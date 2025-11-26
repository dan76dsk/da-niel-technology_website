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

Jeżeli niezalogowany użytkownik uploaduje plik większy niż obowiązujący limit gościa, zostanie mu przedstawiony pop-up zachęcający do założenia konta, by przesyłać większe pliki

![upload_limit_goscia](/images/projects/automated-quotation-system/upload_limit_goscia.jpg "Pop-up zachęcającu do rejestracji, by przesyłać większe pliki")


Jeśli plik przejdzie wstępną walidację, rozpoczyna się upload i przetwarzanie.

![upload_przetwarzanie_plikow](/images/projects/automated-quotation-system/upload_przetwarzanie_plikow.jpg "Przetwarzanie uploadu pliku 3D")

Po pomyślnym uploadzie każdy plik staje się osobną pozycją w konfiguratorze – z nazwą, miniaturką modelu 3D oraz podstawowymi parametrami. W tle uruchamiany jest silnik wyceny, który na bazie domyślnych ustawień (technologia FDM, tworzywo PLA, kolor czarny, wypełnienie 20%) oblicza czas druku i koszt. Dopóki dana pozycja jest w stanie liczenia wyceny, jej ustawienia są tymczasowo zablokowane - użytkownik widzi komunikat „obliczanie...”.

![pozycja_w_trakcie_obliczania](/images/projects/automated-quotation-system/pozycja_w_trakcie_obliczania.jpg "Oczekiwanie na obliczenie ceny przez serwer wyceny")

Jeśli na etapie weryfikacji geometrii system wykryje, że model przekracza dopuszczalne gabaryty drukarki, klient od razu zobaczy jasny komunikat o przekroczonych wymiarach i wskazanie, które osie wymagają zmniejszenia modelu.

![oversized](/images/projects/automated-quotation-system/oversized.jpg "Reakcja systemu na przekroczone rozmiary części")

Po kilku sekundach (w zależności od złożoności modelu), wycena jest gotowa, pozycja odblokowuje się do dalszej konfiguracji, a przycisk przejścia do podsumowania staje się dostępny.

Po pierwszym poprawnym uploadzie i utworzeniu pozycji klient może w dowolnym momencie dograć kolejne pliki - zostaną one dodane jako nowe pozycje do tej samej sesji wyceny i przejdą dokładnie ten sam proces przetwarzania. 

W momencie, gdy w konfiguratorze pojawi się pierwsza wyceniona pozycja, system wyświetla kafelek z podsumowaniem zamówienia z automatycznie wyliczonym czasem realizacji, listą elementów oraz przyciskiem "złóż zamówienie" przekierowującym do strony podsumowania. Do listy podsumowania są dodawane wyłącznie pozycje z modelami, które nie przekraczają rozmiarów lub nie mają innych błędów przetwarzania.

System wyceny ma zaimplementowaną minimalną kwotę zamówienia, w celu uniknięcia przeciążenia systemu bardzo drobnymi zleceniami. Jeżeli elementy konfiguratora jej nie przekraczają, zostanie ona zastosowana w podsumowaniu z odpowiednią informacją dla użytkownika.

![konfigurator_jedna_pozycja](/images/projects/automated-quotation-system/konfigurator_jedna_pozycja.jpg "Wygląd konfiguratora z jedną wycenioną pozycją")

### Konfiguracja wyceny

Konfigurację wyceny można rozpocząć po wciśnięciu buttona "dostosuj konfigurację". Wówczas pod wycenianą pozycją rozwiją się dodatkowe opcje, zawierające konfigurator wraz z infoboxem, będącym przewodnikiem dla użytkownika.

![konfigurowana_pozycja](/images/projects/automated-quotation-system/konfigurowana_pozycja.jpg "Wygląd konfigurowanej pozycji wraz z informacjami dla użytkownika")

**Konfigurator**

W aktualnej wersji konfiguratora, użytkownik ma możliwość dobrania takich parametrów produkcji jak:

- Technologia druku 3D
- Materiał (tworzywo sztuczne)
- Kolor materiału (zależny od aktualnej dostępności)
- Wypełnienie (dla technologii FDM)
- Opcje zaawansowane - dostępne dla zalogowanych użytkowników

![opcje_konfiguratora](/images/projects/automated-quotation-system/opcje_konfiguratora.jpg "Dostępne opcje konfiguracji")

**Przewodnik dla użytkownika - infobox**

Po najechaniu kursorem na każdą z opcji konfiguratora, zmienia się treść infoboxa. Przedstawia ona użytkownikowi podstawowe informacje o wybieranej pozycji (np. wytrzymałość, klasa cenowa, tolerancje) oraz poglądową grafikę.

![infobox_material_asa_cf](/images/projects/automated-quotation-system/infobox_material_asa_cf.jpg "Przykład informacji o materiale")

![infobox_wypelnienie_40](/images/projects/automated-quotation-system/infobox_wypelnienie_40.jpg "Przykład informacji o wypełnieniu")

Jeżeli użytkownik ma potrzebę dowiedzenia się więcej o danej opcji, infobox w prawym górnym rogu zawiera odnośnik do strony, dokładnie opisującą daną opcje (np. strona z konkretnym tworzywem)

### Przejście do podsumowania
Jak wspomniałem w sekcji "upload plików" przejście do podsumowania jest możliwe, jeżeli w kalkulatorze wyceny druku 3D znajduje się co najmniej jedna poprawnie wyceniona pozycja (bez błędów przetwarzania).

Kafelek z podsumowaniem:
- zawiera listę z podsumowaniem wszystkich wycenianych pozycji,
- po prawej stronie wyświetla obliczony przez system przewidywany czas realizacji,
- ma checkbox "wyświetlaj ceny brutto" (ułatwiający oszacowanie kosztów zarówno osobom fizycznym jak i firmom). 

![podsumowanie_div](/images/projects/automated-quotation-system/podsumowanie_div.jpg "Kafelek podsumowania")

Checkbox "wyświetlaj ceny brutto" domyślnie jest zaznaczony i wyświetlane są ceny brutto - zarówno w każdej pozycji, jak i w podsumowaniu. Analogicznie - jeżeli jest odznaczony, wyświetlają się ceny netto z adekwatną informacją o stawce VAT.

![obsluga_netto_brutto](/images/projects/automated-quotation-system/obsluga_netto_brutto.jpg "Przedstawienie działania checkboxa wyświetlaj ceny brutto")

Po kliknięciu "złóż zamówienie" zakładamy dwa zachowania:
- dla zalogowanego użytkownika następuje przekierowanie do strony podsumowania,
- dla gościa, zanim nastąpi przekierowanie, prezentowany jest pop-up zachęcający do założenia konta - można go pominąć, klikając "kontynuuj jako gość.

![modal_zamowienie](/images/projects/automated-quotation-system/modal_zamowienie.jpg "Pop-up ukazujący się niezalogowanym użytkownikom")

Po przejściu na stronę podsumowania widoczne są 4 sekcje + podsumowanie:
- Zamawiane części - lista z podsumowaniem zamawianych części, ich konfiguracją i czasem realizacji,
- Dane do wysyłki - goście muszą uzupełnić za każdym razem, a dla zalogowanych użytkowników dane są pobierane z bazy danych. Po zaznaczeniu checkboxa "chcę fakturę na firmę" formularz rozszerzy sie o pola firmowych danych
- Dostawa - wybór metody dostawy
- Płatność - wybór metody płatności
- Podsumowanie - podliczenie wszystkich kosztów z rozbiciem na sumę części, dostawę i VAT; checkboxem "wyświetlaj ceny brutto", checkboxy z akceptacją regulaminu i polityką prywatności oraz button "przejdź do płatności"

Checkbox "wyświetlaj ceny brutto" zachowuje się dokładnie tak samo jak w konfiguratorze - przekształca ceny netto<->brutto oraz zmienia komunikaty na adekwatne (czy wyświetlana kwota zawiera VAT czy też nie).

![strona podsumowania](/images/projects/automated-quotation-system/strona_podsumowania.jpg "Wygląd strony podsumowania")

**Dane do wysyłki & różnice pomiędzy gościem a zalogowanym użytkownikiem**

Zalogowany użytkownik na tym etapie będzie miał pobrane z bazy danych swoje dane do wysyłki i (jeżeli zaznaczył) dane do faktury oraz informacje że realizacja wiaże się z akceptacja regulaminu (bez checkboxów, bo zgoda została wyrażona na etapie rejestracji).

![podsumowanie_widok_uzytkownika](/images/projects/automated-quotation-system/podsumowanie_widok_uzytkownika.jpg "Co widzi zalogowany użytkownik")

Niezalogowany użytkownik na tym etapie widzi pusty formularz do uzupełnienia oraz checkboxy potwierdzające zapoznanie się z regulaminem i polityką prywatności.

![podsumowanie_widok_goscia](/images/projects/automated-quotation-system/podsumowanie_widok_goscia.jpg "Co widzi niezalogowany użytkownik - gość")

**Wybór metody dostawy**
Do wyboru:
- Kurier InPost
- Paczkomat InPost

Po wybraniu paczkomaty inpost, pojawi się przycisk "wybierz paczkomat". 

![dostawa_wybrany_paczkomat](/images/projects/automated-quotation-system/dostawa_wybrany_paczkomat.jpg "Wybrany Paczkomat InPost w metodzie dostawy")

Należy wybrać paczkomat/paczkopunkt z mapy InPost (klik w "Wybierz paczkomat" > wyświetli się mapa paczkomatów)

![mapa_inpost](/images/projects/automated-quotation-system/mapa_inpost.jpg "Mapka InPost")

Po wybraniu paczkomatu, wyświetlą się informacje o wybranym paczkomacie:

![wybrany_paczkomat_podsumowanie](/images/projects/automated-quotation-system/wybrany_paczkomat_podsumowanie.jpg "Informacje o wybranym paczkomacie")

**Wybór metody płatności**
Płatności są obsługiwane przez Przelewy24. 
Do wyboru:
- Szybki przelew
- BLIK

Obie metody płatności przekierowują na stronę przelewy24. Metoda "szybki przelew" pozwala na wybranie swojego banku lub innej metody płatności z listy płatności online. BLIK z kolei wymaga podania kodu BLIK na stronie przelewy24, do której nastąpi przekierowanie po kliknięciu "przejdź do płatności".

**Przejdź do płatności**
Przycisk "przejdź do płatności" jest aktywny (klikalny) tylko gdy wszystkie pola formularza są prawidłowo uzupełnone.

### Płatność i potwierdzenie

Po kliknięciu "przejdź do płatności" następuje przekierowanie na stronę operatora płatności Przelewy24, gdzie należy opłacić zamówienie.

![platnosc_p24.jpg](/images/projects/automated-quotation-system/platnosc_p24.jpg "Płatność w systemie Przelewy24")

Po pomyślnym zrealizowaniu płatności, nastąpi powrót na stronę https://geometryhustlers.pl/order-success, na której wyświetlany jest status płatności.

Podczas odczytywania statusu płątności z bazy danych, przez moment wyświetla się komunikat o sprawdzaniu statusu:

![platnosc_sprawdzanie_statusu](/images/projects/automated-quotation-system/platnosc_sprawdzanie_statusu.jpg "Sprawniadze statusu płatności")

Statusy płatności są 3: Oczekuję, opłacono oraz błąd

![przetwarzanie_platnosci](/images/projects/automated-quotation-system/przetwarzanie_platnosci.jpg "Komunikat o przetwarzaniu płatności")

![platnosc_sukces](/images/projects/automated-quotation-system/platnosc_sukces.jpg "Komunikat o pomyślnej płatności")

![platnosc_problem](/images/projects/automated-quotation-system/platnosc_problem.jpg "Komunikat o problemie z płatnością")


### Powiadomienia mailowe

Po pomyślnie zrealizowanej płatności, realizacja trafia do systemu ze statusem "oczekuje na weryfikację techniczną" w celu weryfikacji, czy część jest w ogóle wykonalna. Klient otrzymuje wiadomość mailową z potwierdzeniem przyjęcia płatności i podsumowaniem zamówienia

![email_po_zamowieniu](/images/projects/automated-quotation-system/email_po_zamowieniu.jpg "E-mail po opłaceniu zamówienia")

Jeżeli klient był zarejestrowanym użytkowikiem, w panelu użytkownika będzie widoczna pozycja ze statusem "opłacone - weryfikacja techniczna":

![zamowienie_w_panelu](/images/projects/automated-quotation-system/zamowienie_w_panelu.jpg "Widok opłaconego zamówienia w panelu")

Po zweryfikowaniu i zaakceptowaniu przez administratora zamówienia, status zamówienia zamienia się na "w realizacji" informując mailowo klienta o zmianie statusu.







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
