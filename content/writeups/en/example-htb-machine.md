---
title: "Example HTB Machine"
date: "2025-11-20"
excerpt: "Initial foothold through web enumeration, privilege escalation via misconfigured SUID binary"
platform: "HackTheBox"
difficulty: "Easy"
---

# Recon

Started with nmap scan:

```bash
nmap -sC -sV -oN nmap.txt 10.10.10.123
```

Found open ports:
- 22/tcp SSH
- 80/tcp HTTP

# Initial Foothold

Web server running on port 80...

# Privilege Escalation

Found SUID binary...

# Flags

**User flag:** `[redacted]`
**Root flag:** `[redacted]`
