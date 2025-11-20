# 🚀 Deployment Guide - d@niel.technology

## Przed wdrożeniem

### 1. Ustaw URL produkcyjny

**WAŻNE:** Musisz ustawić zmienną środowiskową przed buildem!

```bash
# Development
cp .env.example .env.local
# W .env.local zmień:
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Production (na serwerze)
cp .env.example .env.production
# W .env.production zmień:
NEXT_PUBLIC_SITE_URL=https://twoja-domena.com
```

### 2. Test lokalny

```bash
npm run build
npm start
# Sprawdź http://localhost:3000
```

---

## Deployment na Proxmox (Docker)

### Krok 1: Przygotuj serwer

```bash
# SSH do VM na Proxmox
ssh user@your-proxmox-vm

# Instalacja Docker (jeśli nie masz)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Krok 2: Clone repo

```bash
git clone https://github.com/twoj-username/da-niel-technology_website.git
cd da-niel-technology_website
```

### Krok 3: Konfiguracja

```bash
# Skopiuj .env
cp .env.example .env.production

# EDYTUJ .env.production - WAŻNE!
nano .env.production
# Zmień: NEXT_PUBLIC_SITE_URL=https://twoja-rzeczywista-domena.com
```

### Krok 4: Build i uruchom

```bash
docker-compose up -d --build

# Sprawdź logi
docker logs -f dniel-website

# Sprawdź czy działa
curl http://localhost:3000
```

### Krok 5: Nginx Reverse Proxy

```bash
sudo apt install nginx certbot python3-certbot-nginx

# Stwórz config
sudo nano /etc/nginx/sites-available/dniel.technology
```

```nginx
server {
    listen 80;
    server_name twoja-domena.com www.twoja-domena.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Aktywuj config
sudo ln -s /etc/nginx/sites-available/dniel.technology /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL przez Let's Encrypt
sudo certbot --nginx -d twoja-domena.com -d www.twoja-domena.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

---

## Update aplikacji

```bash
cd da-niel-technology_website

# Pull nowych zmian
git pull

# Rebuild i restart
docker-compose down
docker-compose up -d --build

# Sprawdź logi
docker logs -f dniel-website
```

---

## Monitoring

### Logi

```bash
# Realtime logs
docker logs -f dniel-website

# Last 100 lines
docker logs --tail 100 dniel-website
```

### Resource usage

```bash
docker stats dniel-website
```

### Health check

```bash
curl https://twoja-domena.com
curl https://twoja-domena.com/sitemap.xml
curl https://twoja-domena.com/robots.txt
```

---

## Analytics (Umami) - Opcjonalnie

Jeśli chcesz analytics:

```bash
# W tym samym folderze
docker-compose -f docker-compose.yml -f docker-compose.analytics.yml up -d

# Umami będzie dostępne na http://localhost:3001
```

**Setup Umami:**
1. Otwórz http://twoja-domena.com:3001
2. Zaloguj się (default: admin / umami)
3. Dodaj website
4. Skopiuj tracking code
5. Dodaj go do `app/layout.tsx` w `<head>`

---

## Troubleshooting

### Build fails

```bash
# Sprawdź czy jest .env.production
cat .env.production

# Sprawdź logi
docker-compose logs

# Rebuild bez cache
docker-compose build --no-cache
```

### Port 3000 zajęty

```bash
# Zmień port w docker-compose.yml
ports:
  - "3001:3000"  # localhost:3001 -> container:3000
```

### SSL nie działa

```bash
# Sprawdź czy Nginx działa
sudo systemctl status nginx

# Sprawdź config
sudo nginx -t

# Odnów certyfikat manualnie
sudo certbot renew --dry-run
```

---

## Backup

```bash
# Backup contentu (git)
git add content/
git commit -m "Backup content"
git push

# Backup nginx config
sudo cp /etc/nginx/sites-available/dniel.technology ~/backup/
```

---

## Performance optimization

### Gzip compression (w Nginx)

```bash
sudo nano /etc/nginx/nginx.conf
```

Dodaj w sekcji `http {}`:

```nginx
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript text/xml;
gzip_min_length 1000;
```

```bash
sudo systemctl restart nginx
```

### Rate limiting (w Nginx)

Przed `server {}`:

```nginx
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
```

W `server {}`:

```nginx
limit_req zone=general burst=20 nodelay;
```

---

## Gotowe! 🎉

Twoja strona powinna być dostępna na https://twoja-domena.com

**Checklist:**
- ✅ URL w .env.production ustawiony
- ✅ Docker container działa
- ✅ Nginx reverse proxy skonfigurowany
- ✅ SSL certyfikat zainstalowany
- ✅ Sitemap.xml dostępny
- ✅ robots.txt dostępny
- ✅ (Opcjonalnie) Umami analytics

**Pytania?** Sprawdź logi: `docker logs -f dniel-website`
