---
title: "HackTheBox - Meow"
date: "2025-11-20"
excerpt: "Very Easy Linux box focusing on basic enumeration and Telnet"
platform: "HackTheBox"
difficulty: "Very Easy"
---

# Reconnaissance

Started with an nmap scan:

```bash
nmap -sC -sV 10.10.10.40
```

Found open Telnet port (23/tcp).

# Initial Access

Connected via Telnet:

```bash
telnet 10.10.10.40
```

Default credentials worked: `root` / no password

# Flag

```
flag{REDACTED}
```

# Key Takeaways

- Always check for default credentials
- Telnet is rarely used today due to security issues
- Basic enumeration is crucial
