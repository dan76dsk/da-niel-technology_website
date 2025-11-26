---
title: "Platforma zamówień druku 3D End‑to‑End"
excerpt: "Zaprojektowałem i wdrożyłem customową platformę zamówień druku 3D, która zastąpiła ręczne wyceny i obsługę mailową pełnym self‑service: od kalkulacji ceny po płatność i powiadomienia o realizacji."
tech: ["React", "Node.js", "Python", "JWT", "AWS S3 / MinIO", "PrusaSlicer CLI", "Blender CLI", "MySQL", "WordPress"]
---

# Opis

Stworzyłem dla Geometry Hustlers system automatycznej wyceny druku 3D, który zastąpił ręczne kalkulacje operatorem i całą mailową „wymianę plików” jednym, spójnym procesem online. Z poziomu przeglądarki klient wrzuca model 3D, wybiera materiał i parametry, a aplikacja w kilka sekund wykonuje rzeczywisty slicing, liczy koszt i pokazuje czas realizacji. Składanie zamówienia odbywa się bez udziału człowieka po stronie firmy.

Z punktu widzenia biznesu oznacza to skrócenie czasu odpowiedzi z kilku godzin do 30 sekund, redukcję pracę przy wycenach praktycznie do zera oraz wzrost konwersji zapytań o kilkanaście punktów procentowych. System pilnuje marży, eliminuje błędy cenowe (0% rozjazdów między wyceną a realnym kosztem) i skaluje się razem z liczbą zapytań, zamiast blokować sprzedaż dostępnością kilku osób. To przykład projektu, w którym technologia (Node.js, React, PrusaSlicer, integracja z płatnościami) jest tylko środkiem - celem było uporządkowanie procesu sprzedaży i odblokowanie wzrostu firmy.

![przykladowa_konfiguracja_czesci](/images/projects/automated-quotation-system/przykladowa_konfiguracja_czesci.jpg "Przykładowa konfiguracja części")

## Funkcje

System z zewnątrz wygląda jak prosta i wygodna wyceniarka online, ale pod spodem spina cały proces: od wrzucenia pliku po opłacone zamówienie z kompletem plików w panelu admina.

**Najważniejsze funkcje:**

- **Natychmiastowa wycena druku 3D**
  - upload plików STL/STEP,
  - konfiguracja produkcji części - wybór materiału, koloru, wypełnienia, ilości,
  - aktualizacja ceny i czasu realizacji w czasie rzeczywistym.

- **Rzeczywisty slicing zamiast „szacowania”**
  - backend uruchamia PrusaSlicer CLI dla każdego modelu,
  - cena oparta na faktycznym zużyciu filamentu i czasie druku,
  - inteligentny cache wyników slicingu przyspieszający kolejne wyceny.

- **Pełny proces zamówienia online**
  - podsumowanie koszyka z modelami i konfiguracjami,
  - integracja z płatnościami online (Przelewy24),
  - automatyczne potwierdzenia mailowe i statusy zamówień.

- **Konto użytkownika i historia zamówień**
  - rejestracja i logowanie,
  - wgląd w historię zamówień, pobieranie faktur,

- **Praca między urządzeniami**
  - sesje wyceny działające dla gościa i zalogowanego użytkownika,
  - rozpoczęcie wyceny na jednym urządzeniu i dokończenie na innym,
  - automatyczne przypisanie wyceny do konta po rejestracji/logowaniu.

- **Panel administracyjny dla firmy**
  - lista zamówień ze statusami i filtrowaniem,
  - podgląd modeli, konfiguracji i miniaturek,
  - pobieranie pojedynczych plików lub całych zamówień jako ZIP,
  - zarządzanie sesjami wyceny i automatyczne cleanupy (cron).


## Biznesowe podejście do rozwiązania

Zanim przystąpiłem do pracy, wyszedłem od tego, jak wyglądał proces sprzedaży w praktyce - ile czasu pochłaniało przygotowywanie manualnych wycen

Zanim przystąpiłem do pracy nad platformą, przyjrzałem się, jak w praktyce wyglądał cały proces obsługi klienta: od pierwszego maila od klienta z prośbą o wycenę, przez ręczne wprowadzanie modeli do slicera, po odpisywanie z ofertą i tłumaczenie różnic między wariantami. **Szybko okazało się, że większość energii firmy idzie w obsługę wycen i edukowanie klientów**, a nie w sam druk, a każda dodatkowa prośba o wycenę innego wypełnienia czy materiału oznacza kolejne minuty, które ktoś musi poświęcić. Jednocześnie klienci musieli czekać na poznanie ceny, więc część leadów zwyczajnie znikała w międzyczasie. **Widać było wyraźnie, że niemal cały ten proces da się zautomatyzować** - tak, aby klient samodzielnie eksperymentował z konfiguracją i natychmiast widział cenę.


**Dwa kluczowe problemy, które chciałem rozwiązać to:**

- **Nieefektywne wykorzystanie czasu specjalistów**  
  Osoba wyceniająca zapytania klientów spędzała kilka godzin dziennie na ręcznym imporcie modeli do slicera, liczeniu zużycia materiału i przepisywaniu wycen do maila - praca powtarzalna, która nie tworzy realnej wartości (poza błyskawiczną reakcją na potrzeby klienta).

- **Brak skalowalności procesu**  
  Więcej zapytań = proporcjonalnie więcej pracy dla operatorów. Sprzedaż była ograniczona przepustowością ludzi, a nie maszyn.


Na tej bazie zdefiniowałem **konkretne, mierzalne cele projektu**:

- skrócić czas od zapytania do wyceny z godzin do **< 30 sekund**,  
- ograniczyć powtarzalną pracę przy wycenach i edukacji klienta, tak by skupić się na produkcji i wyjątkowych przypadkach,  
- zapewnić **0% błędów cenowych** dzięki oparciu się na rzeczywistym slicingu,  
- uporządkować proces od wyceny do realizacji tak, by każdy model, plik i status miał swoje miejsce w systemie,  
- wpiąć rozwiązanie w istniejący ekosystem WordPress, zamiast budować osobny, odizolowany byt.

Z tych celów wynikały **główne założenia projektowe**:

- system musi liczyć ceny **tak samo dokładnie jak operator**, czyli na podstawie prawdziwego G-code ze Slicera, a nie tylko objętości i współczynników,  
- proces ma być **w pełni samoobsługowy dla klienta** - od uploadu pliku do płatności online, bez wymiany maili,  
- rozwiązanie musi być **customowe**, bo gotowe wtyczki e‑commerce nie rozumieją domeny druku 3D (każda konfiguracja pliku 3D = osobny produkt),  
- architektura powinna skalować się wraz z liczbą zapytań bez potrzeby zatrudniania kolejnych osób do wycen.

Cała dalsza architektura techniczna – Node.js, React, PrusaSlicer, S3/MinIO, panel admina - była już tylko konsekwencją tych biznesowych decyzji.






















# Doświadczenie użytkownika (flow zamówienia) [lub „Proces zamówienia” z perspektywy użytkownika]
## Proces zamówienia
### Upload pliku/ów
### Konfiguracja wyceny
### Przejście do podsumowania
### Płatność i potwierdzenie

## Logowanie, rejestracja, panel użytkownika

### Rejestracja i potwierdzanie konta
### Historia zamówień
### Kontynuacja wyceny między urządzeniami

## Panel administracyjny

Krótki opis: „co rozwiązano” dla właściciela firmy:

### Zarządzanie zamówieniami
### Zarządzanie sesjami wyceny
### Porządek w plikach i statusach

# Jak to działa pod maską (deep dive techniczny)
I tu zaczyna się mięso dla devów.

## Działanie backendu po uploadzie pliku

### Przechowywanie plików (S3 / MinIO)
### Generowanie miniaturki (Blender)
### Analiza geometrii (jeśli chcesz zahaczyć o Three.js/geometrię)
### Slicing w PrusaSlicer i cache
### Obsługa kolejek / blokad (race conditions, locki)

## Algorytm cenowy i walidacja

    rabaty ilościowe,
    mnożniki za wagę / materiał,
    dopłaty za supporty,
    walidacja ceny na backendzie.


## Sesje, bezpieczeństwo i integracje

    sesje wycen (model danych, expiracje),
    integracja płatności (Przelewy24, weryfikacja podpisu),
    najważniejsze elementy bezpieczeństwa (walidacja uploadów, blokady slicera, ochrona przed manipulacją ceną).
