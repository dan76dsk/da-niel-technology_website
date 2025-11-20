---
title: "HackTheBox - Meow"
date: "2025-11-20"
excerpt: "Bardzo łatwa maszyna Linux skupiająca się na podstawowej enumeracji i Telnet"
platform: "HackTheBox"
difficulty: "Bardzo Łatwa"
---

# Rekonesans

Rozpocząłem od skanu nmap:

```bash
nmap -sC -sV 10.10.10.40
```

Znalazłem otwarty port Telnet (23/tcp).

# Początkowy Dostęp

Połączyłem się przez Telnet:

```bash
telnet 10.10.10.40
```

Domyślne hasła zadziałały: `root` / brak hasła

# Flaga

```
flag{REDACTED}
```

# Kluczowe Wnioski

- Zawsze sprawdzaj domyślne hasła
- Telnet jest rzadko używany dzisiaj ze względów bezpieczeństwa
- Podstawowa enumeracja jest kluczowa
