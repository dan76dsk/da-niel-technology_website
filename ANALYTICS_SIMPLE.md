# Prosty custom analytics - draft

Jeśli chcesz najprostsze rozwiązanie bez zewnętrznych narzędzi:

## Opcja A: Server logs + GoAccess
```bash
# Nginx generuje logi → analizujesz je lokalnie
apt install goaccess
goaccess /var/log/nginx/access.log -o report.html --log-format=COMBINED
```

**Pros:** Zero dependencies, privacy-friendly
**Cons:** Brak real-time, trzeba manualnie sprawdzać

---

## Opcja B: Custom API endpoint + SQLite

**Potrzebne:**
1. API route w Next.js (`/api/stats`)
2. Mała SQLite baza (lub Postgres jeśli masz)
3. Client-side fetch do `/api/stats` na każdym page view

**Struktura:**
```
pages_stats
- id
- path (varchar)
- timestamp (datetime)
- referrer (varchar)
- user_agent (varchar)
```

**Dashboard:** Prosty admin panel w Next.js do przeglądania statystyk

Mogę to zaimplementować jeśli chcesz (1-2h pracy), ale szczerze **Umami będzie lepsze** - już gotowe, tested, secure.

---

## Rekomendacja:
**Użyj Umami** - oszczędzisz sobie roboty, jest open source i privacy-friendly.
Dostaniesz profesjonalny dashboard w 10 minut setup.
