---
title: "Platforma zamówień druku 3D End‑to‑End"
excerpt: "Zaprojektowałem i wdrożyłem customową platformę zamówień druku 3D, która zastąpiła ręczne wyceny i obsługę mailową pełnym self‑service: od kalkulacji ceny po płatność i powiadomienia o realizacji."
tech: ["React", "Node.js", "Python", "JWT", "AWS S3 / MinIO", "PrusaSlicer CLI", "Blender CLI", "MySQL", "WordPress"]
---

# Opis

Stworzyłem dla Geometry Hustlers system automatycznej wyceny druku 3D, który zastąpił ręczne kalkulacje operatorem i całą mailową „wymianę plików” jednym, spójnym procesem online. Z poziomu przeglądarki klient wrzuca model 3D, wybiera materiał i parametry, a aplikacja w kilka sekund wykonuje rzeczywisty slicing, liczy koszt i pokazuje czas realizacji. Składanie zamówienia odbywa się bez udziału człowieka po stronie firmy.

Z punktu widzenia biznesu oznacza to skrócenie czasu odpowiedzi z kilku godzin do 30 sekund, redukcję pracę przy wycenach praktycznie do zera oraz wzrost konwersji zapytań o kilkanaście punktów procentowych. System pilnuje marży, eliminuje błędy cenowe (0% rozjazdów między wyceną a realnym kosztem) i skaluje się razem z liczbą zapytań, zamiast blokować sprzedaż dostępnością kilku osób. To przykład projektu, w którym technologia (Node.js, React, PrusaSlicer, integracja z płatnościami) jest tylko środkiem - celem było uporządkowanie procesu sprzedaży i odblokowanie wzrostu firmy.

Platforma zamówień druku 3D to kompletny system automatycznej wyceny druku 3D, który:

- Daje klientowi **natychmiastową wycenę**
- Pozwala klientowi **eksperymentować z konfiguracją** w czasie rzeczywistym
- Pokazuje **precyzyjny czas realizacji** uwzględniający kolejkę zamówień
- **Eliminuje korespondencję mailową** - cały proces od wyceny do płatności online
- **Gwarantuje poprawność cen** - kalkulacje oparte na rzeczywistym slicingu

![przykladowa_konfiguracja_czesci](/images/projects/automated-quotation-system/przykladowa_konfiguracja_czesci.jpg "Przykładowa konfiguracja części")

## Funkcje

System z zewnątrz wygląda jak prosta i wygodna wyceniarka online, ale pod spodem spina cały proces: od wrzucenia pliku po opłacone zamówienie z kompletem plików w panelu admina.

**Najważniejsze funkcje:**

- **Natychmiastowa wycena druku 3D**
  - upload plików STL/STEP, konfiguracja produkcji części (materiał, kolor, wypełnienie, ilość) 
  - aktualizacja ceny i czasu realizacji w czasie rzeczywistym.

- **Rzeczywisty slicing w tle**
  - backend uruchamia PrusaSlicer CLI i liczy cenę na podstawie faktycznego zużycia filamentu i czasu druku

- **Pełny proces zamówienia online**
  - podsumowanie koszyka, wybór dostawy, płatności online (Przelewy24)
  - automatyczne potwierdzenia i statusy zamówień mailowo

- **Konto użytkownika i praca między urządzeniami**
  - rejestracja/logowanie, historia zamówień i faktur
  - możliwość kontynuowania wyceny na innym urządzeniu
  - automatyczne przypisanie wyceny do konta po rejestracji/logowaniu

- **Panel administracyjny dla firmy**
  - zarządzanie zamówieniami (statusy, filtrowanie, pobieranie plików)
  - podgląd modeli, konfiguracji i miniaturek,
  - automatyczne generowanie faktur i przypisywanie do zamówienia

## Biznesowe podejście do rozwiązania

Zanim przystąpiłem do pracy nad platformą, przyjrzałem się, jak w praktyce wyglądał cały proces obsługi klienta: od pierwszego maila od klienta z prośbą o wycenę, przez ręczne wprowadzanie modeli do slicera, po odpisywanie z ofertą i tłumaczenie różnic między wariantami.

 **Szybko okazało się, że większość energii firmy idzie w obsługę wycen i edukowanie klientów**, a nie w sam druk, a każda dodatkowa prośba o wycenę innego wypełnienia czy materiału oznacza kolejne minuty, które ktoś musi poświęcić. Jednocześnie klienci musieli czekać na poznanie ceny, więc część leadów zwyczajnie znikała w międzyczasie. **Widać było wyraźnie, że niemal cały ten proces da się zautomatyzować** - tak, aby klient samodzielnie eksperymentował z konfiguracją i natychmiast widział cenę.


**Dwa kluczowe problemy, które chciałem rozwiązać to:**

- **Nieefektywne wykorzystanie czasu specjalistów**  
  Osoba wyceniająca zapytania klientów spędzała kilka godzin dziennie na ręcznym imporcie modeli do slicera, liczeniu zużycia materiału i przepisywaniu wycen do maila - praca powtarzalna, która nie tworzy realnej wartości (poza błyskawiczną reakcją na potrzeby klienta).

- **Brak skalowalności procesu**  
  Więcej zapytań = proporcjonalnie więcej pracy dla operatorów. Sprzedaż była ograniczona przepustowością ludzi, a nie maszyn.


Na tej bazie zdefiniowałem **konkretne cele i założenia projektu**:

- maksymalnie skrócić czas od zapytania do wyceny,  
- ograniczyć i zautomatyzować powtarzalną pracę przy wycenach i edukacji klienta. Proces ma być **w pełni samoobsługowy dla klienta** - od uploadu pliku do płatności online,
- zaprojektować architekturę, która skaluje się wraz z liczbą zapytań bez potrzeby zatrudniania kolejnych osób do wycen,
- zminimalizować błędy cenowe dzięki oparciu się na rzeczywistym slicingu. System musi liczyć ceny na podstawie prawdziwego G-code ze Slicera, a nie tylko objętości,
- uporządkować proces od wyceny do realizacji tak, by każdy model, plik i status miał swoje miejsce w systemie, 
- wpiąć rozwiązanie w istniejący ekosystem WordPress, zamiast budować osobny, odizolowany byt,

Rozwiązanie musi być **customowe**, bo gotowe wtyczki e‑commerce nie rozumieją domeny druku 3D (każda konfiguracja pliku 3D = osobny produkt). Cała dalsza architektura techniczna – Node.js, React, PrusaSlicer, S3/MinIO, panel admina - była już tylko konsekwencją tych biznesowych decyzji.


# Jak to działa w praktyce (klient i administracja)

Z punktu widzenia użytkownika to po prostu narzędzie, które pozwala „wrzucić plik i od razu poznać cenę”, a z punktu widzenia firmy - jedno miejsce, w którym lądują wszystkie wyceny, zamówienia i pliki. Cała złożona logika slicera, algorytmów cenowych i integracji jest schowana za prostym, liniowym flow: klient wchodzi na stronę, uploaduje model, konfiguruje wydruk, opłaca zamówienie, a administrator widzi gotowe zlecenie z kompletem danych.

## Proces zamówienia

Proces dla klienta został zaprojektowany tak, żeby przypominał klasyczny koszyk w sklepie internetowym - tylko zamiast wybierać gotowy produkt z listy, użytkownik sam „tworzy” produkt, wrzucając własny model 3D i dobierając parametry wydruku.

### Upload pliku/ów

Klient przechodzi na podstronę wyceny (np. z menu głównego lub call-to-action na stronie) i od razu widzi panel do wrzucenia plików oraz krótki opis, co się zaraz wydarzy: „wrzuć model, wybierz parametry, poznaj cenę”. Użytkownik może przeciągnąć pliki STL/STEP na dropzone lub wybrać je z dysku - pojedynczo lub kilka naraz, bez konieczności logowania.

![strona_glowna_konfiguratora](/images/projects/automated-quotation-system/strona_glowna_konfiguratora.jpg "Strona główna konfiguratora z dropzone do uploadu plików 3D")

Jeszcze przed wysłaniem plików aplikacja weryfikuje podstawowe parametry: format, rozmiar pliku i wymiary modelu. Limit wielkości plików zależy od typu użytkownika - gość ma niższy próg, zalogowany użytkownik może wrzucać większe modele.

Jeśli plik przejdzie wstępną walidację, rozpoczyna się upload i przetwarzanie.

![upload_przetwarzanie_plikow](/images/projects/automated-quotation-system/upload_przetwarzanie_plikow.jpg "Przetwarzanie uploadu pliku 3D")

Po pomyślnym uploadzie każdy plik staje się osobną pozycją w konfiguratorze – z nazwą, miniaturką modelu 3D oraz podstawowymi parametrami. W tle uruchamiany jest silnik wyceny, który na bazie domyślnych ustawień (technologia FDM, tworzywo PLA, kolor czarny, wypełnienie 20%) oblicza czas druku i koszt. Dopóki dana pozycja jest w stanie liczenia wyceny, jej ustawienia są tymczasowo zablokowane - użytkownik widzi komunikat „obliczanie...”.

![pozycja_w_trakcie_obliczania](/images/projects/automated-quotation-system/pozycja_w_trakcie_obliczania.jpg "Oczekiwanie na obliczenie ceny przez serwer wyceny")

Jeśli na etapie weryfikacji geometrii system wykryje, że model przekracza dopuszczalne gabaryty drukarki, klient od razu zobaczy jasny komunikat o przekroczonych wymiarach i wskazanie, które osie wymagają zmniejszenia modelu.

![oversized](/images/projects/automated-quotation-system/oversized.jpg "Reakcja systemu na przekroczone rozmiary części")

Po kilku sekundach (w zależności od złożoności modelu), wycena jest gotowa, pozycja odblokowuje się do dalszej konfiguracji, a przycisk przejścia do podsumowania staje się dostępny.

Po pierwszym poprawnym uploadzie i utworzeniu pozycji klient może w dowolnym momencie dograć kolejne pliki - zostaną one dodane jako nowe pozycje do tej samej wyceny i przejdą dokładnie ten sam proces przetwarzania.

### Konfiguracja wyceny



### Przejście do podsumowania
### Płatność i potwierdzenie

## Rejestracja, logowanie, panel użytkownika

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
