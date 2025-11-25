# GH3D Quote Tool — Automatyczna Wyceniarka Druku 3D

> Case study projektu full-stack: od problemu biznesowego do produkcyjnego rozwiązania

---

## Spis treści

1. [Problem biznesowy](#problem-biznesowy)
2. [Rozwiązanie](#rozwiązanie)
3. [W pełni customowe rozwiązanie](#w-pełni-customowe-rozwiązanie)
4. [Architektura systemu](#architektura-systemu)
5. [Serce aplikacji — PrusaSlicer na backendzie](#serce-aplikacji--prusaslicer-na-backendzie)
6. [System sesji](#system-sesji)
7. [Zaawansowany algorytm cenowy](#zaawansowany-algorytm-cenowy)
8. [Frontend — React na WordPress](#frontend--react-na-wordpress)
9. [Panel administracyjny](#panel-administracyjny)
10. [Zarządzanie zamówieniami](#zarządzanie-zamówieniami)
11. [Bezpieczeństwo](#bezpieczeństwo)
12. [Stack technologiczny](#stack-technologiczny)
13. [AI-Assisted Development](#ai-assisted-development)
14. [Rezultaty](#rezultaty)

---

## Problem biznesowy

Tradycyjny model obsługi klienta w branży druku 3D wygląda następująco:

1. Klient wysyła zapytanie e-mailem z załączonym plikiem STL
2. Operator ręcznie importuje model do slicera
3. Operator oblicza cenę na podstawie zużycia filamentu i czasu druku
4. Operator odsyła wycenę e-mailem
5. Klient często nie odpowiada lub negocjuje...
6. Cykl się powtarza

**Statystyki przed wdrożeniem:**
- ~70% zapytań nie kończyło się zamówieniem
- Średni czas odpowiedzi na wycenę: 2-24h
- Czas poświęcony na korespondencję: kilka godzin dziennie

**Główne problemy:**
- Klient nie zna ceny od razu — traci zainteresowanie
- Brak możliwości eksperymentowania z konfiguracją (materiał, wypełnienie, ilość)
- Operator marnuje czas na wyceny, które nigdy nie dojdą do skutku
- Ryzyko błędu ludzkiego przy ręcznych kalkulacjach

---

## Rozwiązanie

**GH3D Quote Tool** to kompletny system automatycznej wyceny druku 3D, który:

- Daje klientowi **natychmiastową wycenę** — bez czekania na odpowiedź
- Pozwala **eksperymentować z konfiguracją** w czasie rzeczywistym
- Pokazuje **precyzyjny czas realizacji** uwzględniający kolejkę zamówień
- **Eliminuje korespondencję mailową** — cały proces od wyceny do płatności online
- **Gwarantuje poprawność cen** — kalkulacje oparte na rzeczywistym slicingu

![Placeholder: Screenshot głównego interfejsu wyceniarki]

---

## W pełni customowe rozwiązanie

### Zero gotowych wtyczek e-commerce

To nie jest kolejna implementacja oparta na WooCommerce czy innym gotowym rozwiązaniu. **Cały system został napisany od zera**, co daje:

- **Pełną kontrolę nad logiką biznesową** — algorytm cenowy dostosowany do specyfiki druku 3D
- **Optymalizację wydajności** — brak narzutu typowego dla uniwersalnych platform
- **Elastyczność** — możliwość szybkiej modyfikacji każdego elementu systemu
- **Brak vendor lock-in** — niezależność od zewnętrznych wtyczek i ich aktualizacji

### Dlaczego nie WooCommerce?

| Aspekt | WooCommerce | Custom Solution |
|--------|-------------|-----------------|
| Wycena produktu | Stała cena lub prosta kalkulacja | PrusaSlicer CLI — rzeczywisty slicing |
| Konfiguracja | Atrybuty produktu | Real-time preview 3D + dynamiczna cena |
| Integracja z slicerem | Brak | Natywna — Blender + PrusaSlicer |
| Wydajność | Overhead WordPress + plugin | Zoptymalizowany Node.js backend |
| Cache G-code | Niemożliwy | Wbudowany system cache |

**Każda linijka kodu została napisana z myślą o konkretnym przypadku użycia** — wycenie druku 3D, nie sprzedaży generycznych produktów.

---

## Architektura systemu

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 19)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  Quote Tool  │  │ Admin Panel  │  │  WordPress Theme     │   │
│  │  (klient)    │  │ (zarządzanie)│  │  (kontener)          │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  REST API    │  │  PrusaSlicer │  │  Payment Gateway     │   │
│  │  (25+ endp.) │  │  CLI Engine  │  │  (Przelewy24)        │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  Blender CLI │  │  Slicer      │  │  Price Validator     │   │
│  │  (thumbnails)│  │  Cache       │  │  (backend check)     │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      INFRASTRUKTURA                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  MySQL/      │  │  AWS S3 /    │  │  Cron Jobs           │   │
│  │  MariaDB     │  │  MinIO       │  │  (session cleanup)   │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Serce aplikacji — PrusaSlicer na backendzie

To jest kluczowy wyróżnik tego projektu. Większość kalkulatorów druku 3D opiera się na **przybliżonych wzorach matematycznych** — objętość × współczynnik materiału × jakiś mnożnik. Problem? Takie estymacje mogą się rozjechać nawet o 30-50% względem rzeczywistości.

**GH3D Quote Tool działa inaczej:**

```typescript
// Backend wykonuje rzeczywisty slicing modelu
const slicerResult = await runPrusaSlicer({
  modelPath: uploadedFile.path,
  material: config.material,
  infill: config.infillPercent,
  supports: config.enableSupports
});

// Wynik to DOKŁADNE dane z G-code
const { filamentUsedGrams, printTimeMinutes } = slicerResult;
```

**Jak to działa:**

1. Klient uploaduje plik STL/STEP
2. Backend uruchamia **PrusaSlicer CLI** z wybranymi parametrami
3. Slicer generuje G-code i zwraca **precyzyjne dane**:
   - Zużycie filamentu (w gramach)
   - Czas druku (w minutach)
   - Informację o supportach
4. Te dane są podstawą kalkulacji ceny

**Korzyści:**
- ✅ Cena = dokładnie tyle, ile faktycznie kosztuje wydruk
- ✅ Eliminacja ręcznej weryfikacji przed realizacją
- ✅ Klient i operator widzą te same liczby

![Placeholder: Diagram przepływu danych przez PrusaSlicer]

### Generowanie miniaturek — Blender CLI

Każdy uploadowany model otrzymuje automatycznie wygenerowaną miniaturkę:

```typescript
// Blender w trybie headless generuje podgląd modelu
await execBlender({
  script: 'render_thumbnail.py',
  model: uploadedFile.path,
  output: thumbnailPath,
  resolution: [256, 256]
});
```

Miniaturki są wykorzystywane w:
- Podglądzie koszyka
- Panelu administracyjnym
- Potwierdzeniach e-mail
- Historii zamówień użytkownika

### Optymalizacja — inteligentny system cache

Slicing to operacja czasochłonna (5-30s w zależności od modelu). Aby zapewnić płynne UX i oszczędzić zasoby serwera:

```typescript
// Klucz cache: hash modelu + infill + supports
// WAŻNE: kolor i materiał NIE wpływają na G-code!
const cacheKey = generateCacheKey(modelHash, infill, supports);

// Sprawdź cache przed slicingiem
const cached = await slicerCache.get(cacheKey);
if (cached) {
  return cached; // Natychmiastowa odpowiedź
}
```

**Kluczowy insight:** Zmiana koloru czy materiału nie wymaga ponownego slicingu — G-code pozostaje identyczny. Cache wykorzystuje tę właściwość, przechowując wyniki dla kombinacji `(model + infill% + supports)`.

### Zabezpieczenie przed równoległym slicingiem

Co jeśli dwóch użytkowników uploaduje ten sam plik w tym samym czasie?

```typescript
// SlicerLockManager zapobiega race conditions
const lock = await slicerLockManager.acquire(cacheKey);

try {
  // Podwójne sprawdzenie — może inny proces właśnie skończył
  const cached = await slicerCache.get(cacheKey);
  if (cached) return cached;

  // Wykonaj slicing
  const result = await runPrusaSlicer(params);
  await slicerCache.set(cacheKey, result);
  return result;
} finally {
  lock.release();
}
```

**Nawet jeśli frontend zostanie zmanipulowany** — backend nie pozwoli uruchomić nowej instancji slicera dla tego samego pliku, dopóki poprzednia nie zakończy pracy.

---

## System sesji

### Architektura sesji

Każdy użytkownik (zalogowany lub gość) otrzymuje unikalną sesję wyceny:

```typescript
interface QuoteSession {
  sessionId: string;           // UUID
  userId: number | null;       // null dla gości
  models: UploadedModel[];     // Lista modeli z konfiguracją
  createdAt: Date;
  expiresAt: Date;             // 7 dni gość, 30 dni user
  status: 'active' | 'ordered' | 'expired';
}
```

### Synchronizacja między urządzeniami

**Kluczowa funkcjonalność:** Zalogowany użytkownik widzi swoją sesję wyceny **niezależnie od urządzenia**:

```typescript
// Po zalogowaniu — sesja jest przypisana do userId
await assignSessionToUser(sessionId, userId);

// Na innym urządzeniu — automatyczne pobranie sesji
const userSession = await getSessionByUserId(userId);
// Użytkownik widzi swoje modele i konfigurację
```

**Scenariusz:**
1. Użytkownik uploaduje modele na komputerze w pracy
2. W domu loguje się na telefonie
3. Widzi dokładnie tę samą sesję z modelami i konfiguracją
4. Może kontynuować zamówienie

### Transfer sesji gościa

Gdy niezalogowany użytkownik tworzy wycenę, a potem się rejestruje:

```typescript
// Sesja gościa zostaje automatycznie przypisana do nowego konta
async function transferGuestSession(guestSessionId: string, newUserId: number) {
  await db.execute(
    'UPDATE sessions SET user_id = ?, expires_at = DATE_ADD(NOW(), INTERVAL 30 DAY) WHERE session_id = ?',
    [newUserId, guestSessionId]
  );
}
```

---

## Zaawansowany algorytm cenowy

System cenowy uwzględnia wiele zmiennych, które odzwierciedlają rzeczywiste koszty produkcji:

### Rabat ilościowy (skala logarytmiczna)

```typescript
// Nie liniowy rabat — modeluje rzeczywiste economies of scale
const bulkDiscount = calculateLogarithmicDiscount(quantity);
// 1 szt. → ×1.0
// 10 szt. → ×0.85
// 100 szt. → ×0.72
// 1000 szt. → ×0.61
// 50000+ szt. → ×0.543
```

### Mnożnik wagowy

Małe wydruki wymagają proporcjonalnie więcej czasu obsługi:

```typescript
const massMultiplier = calculateMassMultiplier(filamentGrams);
// 0-2g → ×2.0 (mikro-elementy)
// 50-100g → ×1.0 (standard)
// 600g+ → ×0.7 (duże modele)
```

### Dopłata za supporty

Materiały kompozytowe są trudniejsze w obróbce:

```typescript
const supportMultiplier = SUPPORT_MULTIPLIERS[material];
// PLA → ×1.1
// PET-G → ×1.2
// ASA → ×1.3
// ASA+CF → ×1.4
```

### Walidacja ceny na backendzie

**Krytyczne zabezpieczenie:** Cena wyświetlana na froncie jest **zawsze weryfikowana przez backend** przed finalizacją zamówienia:

```typescript
// Endpoint checkout — NIE ufa cenie z frontendu
app.post('/api/checkout', async (req, res) => {
  const { sessionId, frontendPrice } = req.body;

  // Przelicz cenę od zera na podstawie danych z cache
  const backendPrice = await recalculatePrice(sessionId);

  // Porównaj z tolerancją na błędy zaokrągleń
  if (Math.abs(frontendPrice - backendPrice) > 0.01) {
    return res.status(400).json({
      error: 'PRICE_MISMATCH',
      correctPrice: backendPrice
    });
  }

  // Kontynuuj tylko z ceną obliczoną przez backend
  await createOrder(sessionId, backendPrice);
});
```

**Eliminuje to całkowicie możliwość manipulacji ceną przez modyfikację requestów.**

![Placeholder: Wizualizacja algorytmu cenowego]

---

## Frontend — React na WordPress

### Dlaczego React na WordPress?

Strona główna Geometry Hustlers działa na WordPress (CMS, blog, SEO). Zamiast tworzyć osobną domenę dla wyceniarki, **React SPA jest osadzona bezpośrednio w strukturze WordPress**:

```
geometryhustlers.pl/           → WordPress (PHP)
geometryhustlers.pl/wycena/    → React App (SPA)
geometryhustlers.pl/panel/     → React Admin Panel
```

**Korzyści:**
- Spójna nawigacja i branding
- Wspólny system użytkowników (JWT + WordPress users)
- SEO-friendly landing pages (WordPress) + interaktywna aplikacja (React)

### Kluczowe komponenty UI

```
├── ModelDropzone      — Drag & drop upload z walidacją
├── ModelViewer3D      — Podgląd 3D (React Three Fiber)
├── ConfigPanel        — Materiał, wypełnienie, ilość
├── PriceDisplay       — Real-time kalkulacja
├── CheckoutFlow       — Dane, dostawa, płatność
└── OrderSuccess       — Potwierdzenie + tracking
```

![Placeholder: Screenshot konfiguracji modelu z podglądem 3D]

### Real-time UX

Każda zmiana parametrów natychmiast aktualizuje cenę:

```typescript
// Debounced API call przy zmianie konfiguracji
useEffect(() => {
  const timer = setTimeout(() => {
    fetchQuote({ material, infill, quantity, supports });
  }, 300);
  return () => clearTimeout(timer);
}, [material, infill, quantity, supports]);
```

---

## Panel administracyjny

Dedykowany panel do zarządzania zamówieniami i sesjami — bez konieczności dostępu do bazy danych.

![Placeholder: Screenshot panelu administracyjnego]

### Zarządzanie zamówieniami

```
┌─────────────────────────────────────────────────────────────────┐
│  ZAMÓWIENIA                                    [Filtruj ▼]      │
├─────────────────────────────────────────────────────────────────┤
│  #1234  │ Jan Kowalski │ 3 modele │ 245.00 PLN │ ● Opłacone    │
│  #1233  │ Anna Nowak   │ 1 model  │ 89.50 PLN  │ ○ W realizacji│
│  #1232  │ Firma XYZ    │ 12 model │ 1250.00 PLN│ ✓ Wysłane     │
└─────────────────────────────────────────────────────────────────┘
```

**Funkcjonalności:**
- Lista zamówień z filtrowaniem (status, data, klient)
- Podgląd szczegółów zamówienia
- **Pobieranie pojedynczych plików** STL bezpośrednio z panelu
- Pobieranie wszystkich plików zamówienia jako ZIP
- Zmiana statusu zamówienia
- Historia zmian statusów

### Zarządzanie sesjami

Panel umożliwia również zarządzanie sesjami wycen:

```typescript
// Endpoint do ręcznego usunięcia sesji
app.delete('/api/admin/sessions/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  // Usuń powiązane pliki z S3
  await cleanupSessionFiles(sessionId);

  // Usuń rekord z bazy
  await db.execute('DELETE FROM sessions WHERE session_id = ?', [sessionId]);

  res.json({ success: true });
});
```

**Możliwości:**
- Przeglądanie aktywnych sesji
- Podgląd zawartości sesji (modele, konfiguracja)
- Ręczne usunięcie wybranej sesji
- Statystyki sesji (aktywne, wygasłe, przekonwertowane na zamówienia)

### Automatyczne utrzymanie porządku — Cron Jobs

System zawiera endpointy przeznaczone do automatycznego wywoływania przez cron:

```typescript
// Endpoint wywoływany codziennie o 3:00
app.post('/api/cron/cleanup-expired-sessions', async (req, res) => {
  // Znajdź sesje, które wygasły
  const expiredSessions = await db.execute(
    'SELECT session_id FROM sessions WHERE expires_at < NOW() AND status = "active"'
  );

  for (const session of expiredSessions) {
    // Usuń pliki z S3
    await cleanupSessionFiles(session.session_id);

    // Oznacz jako wygasłą
    await db.execute(
      'UPDATE sessions SET status = "expired" WHERE session_id = ?',
      [session.session_id]
    );
  }

  res.json({ cleaned: expiredSessions.length });
});
```

**Harmonogram:**
- `cleanup-expired-sessions` — codziennie, usuwa wygasłe sesje
- `cleanup-orphaned-files` — co tydzień, usuwa pliki bez powiązania z sesją

---

## Zarządzanie zamówieniami

### Stany zamówienia

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  NOWE    │───▶│ OPŁACONE │───▶│W REALIZ. │───▶│ WYSŁANE  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                     │                               │
                     ▼                               ▼
               ┌──────────┐                   ┌──────────┐
               │ ANULOWANE│                   │ ODEBRANE │
               └──────────┘                   └──────────┘
```

### Automatyczna wysyłka e-maili

System automatycznie wysyła powiadomienia e-mail przy zmianie statusu:

```typescript
const EMAIL_TEMPLATES = {
  ORDER_CONFIRMED: {
    subject: 'Potwierdzenie zamówienia #{orderId}',
    trigger: 'status === "paid"'
  },
  ORDER_SHIPPED: {
    subject: 'Twoje zamówienie zostało wysłane',
    trigger: 'status === "shipped"'
  },
  ORDER_READY_PICKUP: {
    subject: 'Zamówienie gotowe do odbioru',
    trigger: 'status === "ready_pickup"'
  }
};

// Automatyczny trigger przy zmianie statusu
async function updateOrderStatus(orderId: number, newStatus: OrderStatus) {
  await db.execute('UPDATE orders SET status = ? WHERE id = ?', [newStatus, orderId]);

  // Wyślij odpowiedni e-mail
  const template = findTemplateForStatus(newStatus);
  if (template) {
    await sendOrderEmail(orderId, template);
  }
}
```

**Zawartość e-maili:**
- Podsumowanie zamówienia
- Lista modeli z miniaturkami
- Numer przesyłki (dla wysłanych)
- Link do śledzenia

![Placeholder: Przykład e-maila z potwierdzeniem zamówienia]

---

## Bezpieczeństwo

Aplikacja przeszła **testy penetracyjne** i audyt bezpieczeństwa. Kluczowe zabezpieczenia:

### Ochrona przed OWASP Top 10

| Zagrożenie | Implementacja |
|------------|---------------|
| SQL Injection | Parametryzowane zapytania (mysql2 prepared statements) |
| XSS | React DOM escaping + CSP headers |
| CSRF | SameSite cookies + token validation |
| Broken Authentication | JWT z expiration + secure httpOnly cookies |
| Security Misconfiguration | Environment variables, no hardcoded secrets |

### Walidacja ceny — ochrona przed manipulacją

Jak opisano wcześniej — frontend **nigdy** nie jest źródłem prawdy o cenie. Backend zawsze przelicza cenę na nowo przy checkout, eliminując możliwość oszustwa.

### Bezpieczeństwo płatności

```typescript
// Przelewy24 — weryfikacja CRC podpisu
const expectedCRC = md5(
  `${sessionId}|${orderId}|${amount}|${currency}|${CRC_KEY}`
);
if (receivedCRC !== expectedCRC) {
  throw new SecurityError('Invalid payment signature');
}
```

### Walidacja plików

```typescript
// Wielowarstwowa walidacja uploadów
const validateUpload = (file) => {
  // 1. Sprawdź MIME type
  // 2. Sprawdź rozszerzenie
  // 3. Sprawdź magic bytes
  // 4. Waliduj geometrię (max 250mm per axis)
  // 5. Skanuj pod kątem malformed STL
};
```

### Ochrona slicera

```typescript
// Blokada równoległego uruchamiania slicera dla tego samego pliku
// Zapobiega:
// - DoS przez wielokrotne requesty
// - Race conditions w cache
// - Przeciążeniu serwera
```

### Zgodność z RODO

- Jawna zgoda na przetwarzanie danych (checkbox)
- Osobne consent dla gości i użytkowników
- Timestampy zgód zapisywane w bazie
- Możliwość usunięcia danych na żądanie

![Placeholder: Fragment dokumentacji bezpieczeństwa]

---

## Stack technologiczny

### Frontend

| Technologia | Zastosowanie |
|-------------|--------------|
| **React 19** | UI framework |
| **React Router 7** | Routing SPA |
| **React Three Fiber** | Podgląd 3D modeli |
| **Axios** | HTTP client |
| **Context API** | State management |
| **Google reCAPTCHA v3** | Bot prevention |

### Backend

| Technologia | Zastosowanie |
|-------------|--------------|
| **Node.js 18+** | Runtime |
| **Express 5** | REST API framework |
| **TypeScript 5.8** | Type safety |
| **PrusaSlicer CLI** | Silnik wycen |
| **Blender CLI** | Generowanie miniaturek |
| **Three.js** | Analiza geometrii STL |
| **mysql2** | Database driver |
| **JWT** | Autentykacja |
| **Nodemailer** | Wysyłka e-maili |

### Infrastruktura

| Technologia | Zastosowanie |
|-------------|--------------|
| **MySQL 8.0** | Baza danych (WordPress) |
| **AWS S3 / MinIO** | Object storage |
| **Przelewy24** | Bramka płatności |
| **systemd** | Process management |
| **Nginx** | Reverse proxy |
| **Cron** | Scheduled tasks |

---

## AI-Assisted Development

Projekt został stworzony z wykorzystaniem **AI-assisted development**. Co to oznacza w praktyce?

### Gdzie AI pomogło:

- **Boilerplate i scaffolding** — szybkie generowanie struktury projektu
- **Algorytmy cenowe** — iteracyjne dopracowywanie logiki rabatowej
- **Debugowanie** — analiza stack traces i sugestie fixów
- **Dokumentacja** — generowanie komentarzy i README
- **Code review** — wykrywanie potencjalnych bugów i security issues
- **Refactoring** — optymalizacja i czyszczenie kodu

### Gdzie człowiek był niezbędny:

- **Decyzje architektoniczne** — wybór stosu, struktura projektu
- **Logika biznesowa** — zrozumienie domeny druku 3D
- **UX decisions** — co jest ważne dla użytkownika końcowego
- **Integracje** — konfiguracja PrusaSlicer, Przelewy24, WordPress
- **Testowanie manualne** — weryfikacja na rzeczywistych modelach
- **Deployment** — konfiguracja serwera produkcyjnego

**AI jako narzędzie, nie zastępstwo** — przyspiesza development, ale wymaga ludzkiego nadzoru i ekspertyzy domenowej.

---

## Rezultaty

### Metryki biznesowe (po wdrożeniu)

| Metryka | Przed | Po |
|---------|-------|-----|
| Czas od zapytania do wyceny | 2-24h | **< 30 sekund** |
| Konwersja zapytań | ~30% | **~45%** |
| Czas operatora na wyceny | ~3h/dzień | **~0h** |
| Błędy w wycenach | ~5% | **0%** |

### Metryki techniczne

- **25+ REST API endpoints**
- **7 obsługiwanych materiałów**
- **16 wariantów kolorystycznych**
- **3 metody dostawy** (InPost, kurier, odbiór osobisty)
- **99.9% uptime** od wdrożenia

![Placeholder: Dashboard admina ze statystykami]

---

## Podsumowanie

**GH3D Quote Tool** to przykład, jak technologia może rozwiązać rzeczywisty problem biznesowy:

1. **Identyfikacja problemu** — 70% zapytań nie konwertuje, operator marnuje czas
2. **W pełni customowe rozwiązanie** — zero WooCommerce, każda linia kodu napisana celowo
3. **Techniczne rozwiązanie** — automatyzacja przez PrusaSlicer CLI + Blender
4. **User experience** — natychmiastowa wycena, real-time konfiguracja, sesje między urządzeniami
5. **Integracja** — seamless embedding w istniejący ekosystem WordPress
6. **Bezpieczeństwo** — produkcyjny standard, testy penetracyjne, walidacja cen na backendzie, RODO
7. **Panel admina** — eleganckie zarządzanie zamówieniami i sesjami

Projekt pokazuje, że **full-stack development** to nie tylko pisanie kodu — to zrozumienie domeny, potrzeb użytkownika i constraints biznesowych.

---

*Projekt zrealizowany dla [Geometry Hustlers](https://geometryhustlers.pl) — usługi druku 3D*

*Stack: React 19 • Node.js • TypeScript • PrusaSlicer • Blender • MySQL • AWS S3*

*Development: AI-Assisted | W pełni customowe rozwiązanie*
