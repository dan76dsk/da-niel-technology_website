---
title: "Platforma zamówień druku 3D End‑to‑End"
excerpt: "Zaprojektowałem i wdrożyłem customową platformę zamówień druku 3D, która zastąpiła ręczne wyceny i obsługę mailową pełnym self‑service: od kalkulacji ceny po płatność i powiadomienia o realizacji."
tech: ["React", "Node.js", "Python", "JWT", "AWS S3 / MinIO", "PrusaSlicer CLI", "Blender CLI", "MySQL", "WordPress"]
---

# Opis

Platforma zamówień druku 3D - od uploadu modelu do płatności online - w mniej niż minutę, całkowicie self-service. Od problemu biznesowego do produkcyjnego wdrożenia.

Stworzyłem dla Geometry Hustlers full-stackowy system automatycznej wyceny druku 3D, który zastąpił ręczne kalkulacje operatorem i całą mailową „wymianę plików” jednym, spójnym procesem online. Z poziomu przeglądarki klient wrzuca model 3D, wybiera materiał i parametry, a aplikacja w kilka sekund wykonuje rzeczywisty slicing, liczy koszt i pokazuje czas realizacji. Składanie zamówienia odbywa się bez udziału człowieka po stronie firmy.

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
  - zarządzanie zamówieniami (zmiany statusów, podgląd szczegółów i pobieranie plików)
  - automatyczna wysyłka maili z info. o zmianie statusu
  - automatyczne generowanie faktur

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

Rozwiązanie musi być **customowe**, bo gotowe wtyczki e‑commerce nie rozumieją domeny druku 3D (każda konfiguracja pliku 3D = osobny produkt). Cała dalsza architektura techniczna - Node.js, React, PrusaSlicer, S3/MinIO, panel admina - była już tylko konsekwencją tych biznesowych decyzji.


# Jak to działa w praktyce (klient i administracja)

Z punktu widzenia użytkownika to po prostu narzędzie, które pozwala „wrzucić plik i od razu poznać cenę”, a z punktu widzenia firmy - jedno miejsce, w którym lądują wszystkie wyceny, zamówienia i pliki. Cała złożona logika slicera, algorytmów cenowych i integracji jest schowana za prostym, liniowym flow: klient wchodzi na stronę, uploaduje model, konfiguruje wydruk, opłaca zamówienie, a administrator widzi gotowe zlecenie z kompletem danych.

## Proces zamówienia

Proces dla klienta został zaprojektowany tak, żeby przypominał klasyczny koszyk w sklepie internetowym - tylko zamiast wybierać gotowy produkt z listy, użytkownik sam „tworzy” produkt, wrzucając własny model 3D i dobierając parametry wydruku.

### Upload pliku/ów

Klient przechodzi na podstronę wyceny https://geometryhustlers.pl/quote/ (np. z menu głównego lub call-to-action na stronie) i od razu widzi panel do wrzucenia plików oraz krótki opis, co się zaraz wydarzy: „wrzuć model, wybierz parametry, poznaj cenę”. Użytkownik może przeciągnąć pliki STL/STEP na dropzone lub wybrać je z dysku - pojedynczo lub kilka naraz, bez konieczności logowania.

![strona_glowna_konfiguratora](/images/projects/automated-quotation-system/strona_glowna_konfiguratora.jpg "Strona główna konfiguratora z dropzone do uploadu plików 3D")

Jeszcze przed wysłaniem plików aplikacja weryfikuje podstawowe parametry: format, rozmiar pliku i wymiary modelu. Limit wielkości plików zależy od typu użytkownika - gość ma niższy próg, zalogowany użytkownik może wrzucać większe modele.

Jeżeli niezalogowany użytkownik uploaduje plik większy niż obowiązujący limit gościa, zostanie mu przedstawiony pop-up zachęcający do założenia konta, by przesyłać większe pliki

![upload_limit_goscia](/images/projects/automated-quotation-system/upload_limit_goscia.jpg "Pop-up zachęcający do rejestracji, by przesyłać większe pliki")


Jeśli plik przejdzie wstępną walidację, rozpoczyna się upload i przetwarzanie.

![upload_przetwarzanie_plikow](/images/projects/automated-quotation-system/upload_przetwarzanie_plikow.jpg "Przetwarzanie uploadu pliku 3D")

Po pomyślnym uploadzie każdy plik staje się osobną pozycją w konfiguratorze - z nazwą, miniaturką modelu 3D oraz podstawowymi parametrami. W tle uruchamiany jest silnik wyceny, który na bazie domyślnych ustawień (technologia FDM, tworzywo PLA, kolor czarny, wypełnienie 20%) oblicza czas druku i koszt. Dopóki dana pozycja jest w stanie liczenia wyceny, jej ustawienia są tymczasowo zablokowane - użytkownik widzi komunikat „obliczanie...”.

![pozycja_w_trakcie_obliczania](/images/projects/automated-quotation-system/pozycja_w_trakcie_obliczania.jpg "Oczekiwanie na obliczenie ceny przez serwer wyceny")

Jeśli na etapie weryfikacji geometrii system wykryje, że model przekracza dopuszczalne gabaryty drukarki, klient od razu zobaczy jasny komunikat o przekroczonych wymiarach i wskazanie, które osie wymagają zmniejszenia modelu.

![oversized](/images/projects/automated-quotation-system/oversized.jpg "Reakcja systemu na przekroczone rozmiary części")

Po kilku sekundach (w zależności od złożoności modelu), wycena jest gotowa, pozycja odblokowuje się do dalszej konfiguracji, a przycisk przejścia do podsumowania staje się dostępny.

Po pierwszym poprawnym uploadzie i utworzeniu pozycji klient może w dowolnym momencie dograć kolejne pliki - zostaną one dodane jako nowe pozycje do tej samej sesji wyceny i przejdą dokładnie ten sam proces przetwarzania. 

W momencie, gdy w konfiguratorze pojawi się pierwsza wyceniona pozycja, system wyświetla kafelek z podsumowaniem zamówienia z automatycznie wyliczonym czasem realizacji, listą elementów oraz przyciskiem "złóż zamówienie" przekierowującym do strony podsumowania. Do listy podsumowania są dodawane wyłącznie pozycje z modelami, które nie przekraczają rozmiarów lub nie mają innych błędów przetwarzania.

System wyceny ma zaimplementowaną minimalną kwotę zamówienia, w celu uniknięcia przeciążenia systemu bardzo drobnymi zleceniami. Jeżeli elementy konfiguratora jej nie przekraczają, zostanie ona zastosowana w podsumowaniu z odpowiednią informacją dla użytkownika.

![konfigurator_jedna_pozycja](/images/projects/automated-quotation-system/konfigurator_jedna_pozycja.jpg "Wygląd konfiguratora z jedną wycenioną pozycją")

### Konfiguracja wyceny

Konfigurację wyceny można rozpocząć po wciśnięciu buttona "dostosuj konfigurację". Wówczas pod wycenianą pozycją rozwijają się dodatkowe opcje, zawierające konfigurator wraz z infoboxem, będącym przewodnikiem dla użytkownika.

![konfigurowana_pozycja](/images/projects/automated-quotation-system/konfigurowana_pozycja.jpg "Wygląd konfigurowanej pozycji wraz z informacjami dla użytkownika")

**Nakład** 

W konfiguratorze możesz wprowadzić liczbę sztuk (nakład) dla każdego modelu osobno. System automatycznie przelicza cenę końcową w zależności od wybranego wolumenu. Im większy nakład, tym niższa cena jednostkowa wydruku - rabat naliczany jest algorytmicznie, a wynikowy koszt jednej sztuki i sumy pozycji widoczny jest w czasie rzeczywistym przy każdej zmianie ilości. Dzięki temu klient może łatwo sprawdzić, jak zwiększenie zamawianej liczby części wpływa na cenę zamówienia. 

![wplyw_nakladu_na_cene](/images/projects/automated-quotation-system/wplyw_nakladu_na_cene.jpg "Wpływ nakładu na cenę")

**Konfigurator**

W aktualnej wersji konfiguratora, użytkownik ma możliwość dobrania takich parametrów produkcji jak:

- Technologia druku 3D
- Materiał (tworzywo sztuczne)
- Kolor materiału (zależny od aktualnej dostępności)
- Wypełnienie (dla technologii FDM)
- Opcje zaawansowane - dostępne dla zalogowanych użytkowników

![opcje_konfiguratora](/images/projects/automated-quotation-system/opcje_konfiguratora.jpg "Dostępne opcje konfiguracji")

Na chwilę obecną jest zaimplementowana jedna opcja zaawansowana - "druk 3D bez podpór", która jest dostępna tylko dla zalogowanych użytkowników (dla gości jest "wyszarzona" i nieklikalna). Opcja jest dostępna w przypadku, gdy algorytm wychwyci fakt, że model 3D został pocięty prez slicer z podporami. Opcja jest przydatna w przypadku, gdy osoba zamawiająca wydruk 3D posiada podstawową wiedzę o druku 3D FDM i ma pewnosć, że przesłaną cześć da się wykonać bez materiału podporowego - wpływa to na cenę końcową części oraz czas realizacji. Zaznaczenie tej opcji wiążę się z koniecznością potwierdzenia wyboru, pojawi się pop-up ostrzegający:

![druk_bez_podpor](/images/projects/automated-quotation-system/druk_bez_podpor.jpg "Pop-up dla zaznaczonej opcji druku bez podpór")

Fakt wyrażenia zgody jest odnotowany w bazie danych z datą potwierdzenia treści pop-upa.

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

Po przejściu na stronę podsumowania (https://geometryhustlers.pl/quote/order/) widoczne są 4 sekcje + podsumowanie:
- Zamawiane części - lista z podsumowaniem zamawianych części, ich konfiguracją i czasem realizacji,
- Dane do wysyłki - goście muszą uzupełnić za każdym razem, a dla zalogowanych użytkowników dane są pobierane z bazy danych. Po zaznaczeniu checkboxa "chcę fakturę na firmę" formularz rozszerzy sie o pola firmowych danych
- Dostawa - wybór metody dostawy
- Płatność - wybór metody płatności
- Podsumowanie - podliczenie wszystkich kosztów z rozbiciem na sumę części, dostawę i VAT; checkboxem "wyświetlaj ceny brutto", checkboxy z akceptacją regulaminu i polityką prywatności oraz button "przejdź do płatności"

Checkbox "wyświetlaj ceny brutto" zachowuje się dokładnie tak samo jak w konfiguratorze - przekształca ceny netto<->brutto oraz zmienia komunikaty na adekwatne (czy wyświetlana kwota zawiera VAT czy też nie).

![strona podsumowania](/images/projects/automated-quotation-system/strona_podsumowania.jpg "Wygląd strony podsumowania")

**Dane do wysyłki & różnice pomiędzy gościem a zalogowanym użytkownikiem**

Zalogowany użytkownik na tym etapie będzie miał pobrane z bazy danych swoje dane do wysyłki i (jeżeli uzupełnił) dane do firmowej faktury oraz informację, że realizacja zamówienia wiąże się z akceptacją regulaminu. Checkboxy nie są ponownie wyświetlane - zgoda została już wyrażona podczas rejestracji i jest zapisana w systemie.

![podsumowanie_widok_uzytkownika](/images/projects/automated-quotation-system/podsumowanie_widok_uzytkownika.jpg "Co widzi zalogowany użytkownik")

Niezalogowany użytkownik na tym etapie widzi pusty formularz do uzupełnienia oraz checkboxy wymagające potwierdzenia zapoznania się z regulaminem i polityką prywatności przed przejściem do płatności.
Wyrażenie tych zgód nie jest jedynie formalnością - podczas składania zamówienia system odnotowuje każdą akceptację, zapisując informację o wyrażeniu zgody wraz z datą i godziną do rekordu konkretnego zamówienia w bazie danych. Dzięki temu każda zgoda może być łatwo zidentyfikowana i powiązana z konkretną transakcją, co jest niezbędne dla zgodności z RODO oraz dla bezpieczeństwa prawnego procesu sprzedaży.

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

Po pomyślnym zrealizowaniu płatności, nastąpi powrót na stronę https://geometryhustlers.pl/order-success/, na której wyświetlany jest status płatności.

Podczas odczytywania statusu płątności z bazy danych, przez moment wyświetla się komunikat o sprawdzaniu statusu:

![platnosc_sprawdzanie_statusu](/images/projects/automated-quotation-system/platnosc_sprawdzanie_statusu.jpg "Sprawniadze statusu płatności")

Statusy płatności są 3: Oczekuję, opłacono oraz błąd

![przetwarzanie_platnosci](/images/projects/automated-quotation-system/przetwarzanie_platnosci.jpg "Komunikat o przetwarzaniu płatności")

![platnosc_sukces](/images/projects/automated-quotation-system/platnosc_sukces.jpg "Komunikat o pomyślnej płatności")

![platnosc_problem](/images/projects/automated-quotation-system/platnosc_problem.jpg "Komunikat o problemie z płatnością")


### Powiadomienia mailowe i statusy zamówień

Po pomyślnie zrealizowanej płatności, realizacja trafia do systemu ze statusem "oczekuje na weryfikację techniczną" w celu weryfikacji, czy część jest w ogóle wykonalna. Klient otrzymuje wiadomość mailową z potwierdzeniem przyjęcia płatności i podsumowaniem zamówienia

![email_po_zamowieniu](/images/projects/automated-quotation-system/email_po_zamowieniu.jpg "E-mail po opłaceniu zamówienia")

Jeżeli klient był zarejestrowanym użytkowikiem, w panelu użytkownika będzie widoczna pozycja ze statusem "opłacone - weryfikacja techniczna":

![zamowienie_w_panelu](/images/projects/automated-quotation-system/zamowienie_w_panelu.jpg "Widok opłaconego zamówienia w panelu")

Po zweryfikowaniu i zaakceptowaniu przez administratora zamówienia, status zamówienia zamienia się na "w realizacji" informując mailowo klienta o zmianie statusu. 
Maile do klienta są wysyłane po zmianach statusu:
- "opłacone - weryfikacja techniczna" -> "w realizacji"
- "w realizacji" -> "zrealizowane"

## Konto użytkownika

System kont użytkowników opiera się na natywnym mechanizmie WordPressa - wykorzystuje istniejącą tabelę użytkowników i logikę autoryzacji, a aplikacja wyceny komunikuje się z nią przez własne API. 

### Rejestracja i potwierdzanie konta

Podczas procesu rejestracji (na stronie https://geometryhustlers.pl/register) użytkownik obowiązkowo podaje imię i nazwisko, adres e‑mail i hasło (opcjonalnie też dane adresowe). Rejestracja wymaga także zaakceptowania Regulaminu oraz Polityki prywatności poprzez zaznaczenie odpowiednich checkboxów. Wyrażone zgody nie są jedynie technicznym warunkiem rejestracji - informacje te są trwale zapisywane w bazie danych, każda zgoda jest przypisana do konkretnego użytkownika, a system rejestruje również datę i godzinę ich wyrażenia. Dzięki temu każda akceptacja regulaminu oraz polityki prywatności może być w razie potrzeby jednoznacznie potwierdzona, co zapewnia zgodność z wymogami RODO oraz innymi przepisami dotyczącymi przetwarzania danych osobowych.

Po prawidłowym wypełnieniu i przesłaniu formularza użytkownik otrzymuje komunikat:

![konto_utworzone](/images/projects/automated-quotation-system/konto_utworzone.jpg "Komunikat po rejestracji konta")

 System tworzy konto i wysyła link aktywacyjny na maila. Po kliknięciu w link aktywujący, konto staje się aktywne i użytkownik zostanie przekierowany do strony logowania z komunikatem o aktywowanym koncie:

![konto_aktywowane](/images/projects/automated-quotation-system/konto_aktywowane.jpg "Komunikat po aktywacji konta")

### Logowanie

Logowanie odbywa się klasycznie - e‑mail + hasło. Po poprawnym zalogowaniu użytkownik jest automatycznie „podpinany” pod istniejącą aktywną sesję wyceny ładowaną z bazy danych (lub sesja jest przepinana, jeśli przed zalogowaniem, w sesji przeglądarki, działał jako gość), tak aby nie tracił wprowadzonych wcześniej modeli 3D i konfiguracji. W przypadku błędnego hasła system zwraca czytelny komunikat, a odzyskiwanie dostępu odbywa się przez wysłanie linku resetującego hasło na podany adres e‑mail.

Logowanie odbywa się w trzech miejscach:
- główna strona logowania pod adresem https://geometryhustlers.pl/login,
- pop-up który pojawia się gościom przy próbie uploadu pliku większego niż obowiązujący limit dla gości,
- pop-up który pojawia się gościom przy przejściu do podsumowania.

![logowanie](/images/projects/automated-quotation-system/logowanie.jpg "Strona główna logowania")

Zalogować mogą się tylko użytkownicy, którzy aktywowali swoje konto. Podczas próby zalogowania się na nieaktywne konto, użytkownik dostanie komunikat:

![konto_nieaktywowane](/images/projects/automated-quotation-system/konto_nieaktywowane.jpg "Komunikat o nieaktywnym koncie")

Po zalogowaniu, użytkownik zostaje przekierowany na panel użytkownika, a w nagłówku strony będzie się wyświetlać jego nazwa użytkownika:

![zalogowany_uzytkownik](/images/projects/automated-quotation-system/zalogowany_uzytkownik.jpg "Wygląd fragmentu nagłówka dla zalogowanego użytkownika")

### Resetowanie hasła

Na stronie logowania, klikając "zapomniałem hasła" następuje przekierowanie na stronę wysyłania linku resetującego pod adresem https://geometryhustlers.pl/forgotpass. 

![resetuj_haslo](/images/projects/automated-quotation-system/resetuj_haslo.jpg "Formularz resetowania hasła")

Po wpisaniu maila powiązanego z kontem, którego reset hasła dotyczy, użytkownik utrzymuje komunikat:

![reset_hasla](/images/projects/automated-quotation-system/reset_hasla.jpg "Komunikat o wysłanym linku do resetowania hasła")

Po kliknięciu w link resetujący hasło następuje przekierowanie do wordpressowego resetowania hasła:

![wordpressowe_resetowanie_hasla](/images/projects/automated-quotation-system/wordpressowe_resetowanie_hasla.jpg "Ustawianie nowego hasła")

Po ustaleniu nowego hasła użytkownik otrzymuje komunikat potwierdzający:

![haslo_zmienione](/images/projects/automated-quotation-system/haslo_zmienione.jpg "Komunikat o potwierdzeniu zmienionego hasła")


### Panel użytkownika i historia zamówień

Po zalogowaniu użytkownik ma dostęp do prostego panelu, w którym widzi listę swoich zamówień z kluczowymi informacjami: datą, kwotą, statusem oraz liczbą modeli w zamówieniu. Panel użytkownika jest dostępny pod adresem https://geometryhustlers.pl/account/. Stroną główną panelu użytkownika jest zakładka z zamówieniami.

![moje_zamowienia](/images/projects/automated-quotation-system/moje_zamowienia.jpg "Lista zamówień użytkownika")

W zakładce z zamówieniami można przejrzeć aktualne i archiwalne zamówienia. Każda z pozycji zamówień daje możliwość pobrania faktury VAT za zamówienie (klikając ikonę faktury w kolumnie "faktura") oraz zobaczenia szczegółów zamówienia, klikając w numer zamówienia

![szczegoly_zamowienia_konto_uzytkownika](/images/projects/automated-quotation-system/szczegoly_zamowienia_konto_uzytkownika.jpg "Szczegóły wybranego zamówienia")

Poza historią zamówień, w panelu użytkownika jest opcja zarządzania kontem (https://geometryhustlers.pl/account/manage) na której mozna:
- zmienić swoje dane
- zmienić hasło
- usunąć konto

![account_manage](/images/projects/automated-quotation-system/account_manage.jpg "Panel użytkownika - zarządzanie kontem")

- Po kliknięciu "zmień dane" pojawia się formularz, gdzie dane można aktualizować.
- Po kliknięciu "zmień hasło" na adres mailowy użytkownika zostaje wysłany link do resetowania hasła oraz pojawia się komunikat:

![komunikat_zmien_haslo](/images/projects/automated-quotation-system/komunikat_zmien_haslo.jpg "Komunikat po zmianie hasła")

W celu zabezpieczenia przed masową wysyłką maili wysyłających linki do zmiany hasła, został dodany mechanizm zabezpieczający. Po ponownym kliknięciu, użytkownik dostaje komunikat, by odczekać kilka sekund przed ponownym wysłaniem maila:

![komunikat_zmien_haslo_poczekaj](/images/projects/automated-quotation-system/komunikat_zmien_haslo_poczekaj.jpg "Komunikat po zbyt szybkim kliknięciu zmień hasło")

Po kliknięciu "usuń konto" użytkownik zostaje poinformowany za pomocą pop-upa, że wraz z tą operacją wszelkie dane powiązane z kontem zostaną trwale usunięte z systemów teleinformatycznych:

![modal_usun_konto](/images/projects/automated-quotation-system/modal_usun_konto.jpg "Pop-up ostrzegający przed usunięciem konta")

### Kontynuacja wyceny między urządzeniami i czas ważności sesji

Domyślnie wycena gościa jest przypisana do sesji przeglądarki - można zamknąć kartę i wrócić później na tym samym urządzeniu, bez utraty danych. Sesja gościa jest ważna przez 7 dni.

Jeśli użytkownik w dowolnym momencie się zarejestruje lub zaloguje, istniejąca sesja zostaje przypisana do jego konta i przedłużony zostaje czas jej ważności do 30 dni. Dzięki temu może rozpocząć wycenę na jednym urządzeniu, a dokończyć ją na innym, widząc dokładnie te same modele i konfiguracje.


## Panel administracyjny

Panel administracyjny to centrum operacyjne platformy, które umożliwia zespołowi Geometry Hustlers sprawne zarządzanie wszystkimi etapami obsługi zamówień - od weryfikacji nowych zleceń, przez kontrolę statusów produkcji, po porządkowanie i archiwizowanie plików 3D. Panel został zaprojektowany przede wszystkim z myślą o funkcjonalności - interfejs jest minimalistyczny i skupiony na szybkości działania oraz wygodzie pracy operatorów, nie na efektach wizualnych. Całość skonstruowana jest tak, aby ułatwić codzienną pracę i pozwalać na błyskawiczne wykonanie najważniejszych operacji administracyjnych.

### Zarządzanie sesjami wyceny

To narzędzie do kontroli i monitorowania wszystkich rozpoczętych oraz zarchiwizowanych (ale jeszcze nieusuniętych) sesji wycen - zarówno od gości, jak i zarejestrowanych użytkowników. Pozwala operatorowi śledzić cały proces ofertowania i podejmować właściwe działania na etapie jeszcze przed zamówieniem.

**Tabela z sesjami wyceny**

Tabela zbiorcza prezentuje kluczowe informacje o każdej sesji: ID sesji, użytkownik, status (aktywna/wygasła), daty utworzenia, ostatniej aktywności oraz planowanego wygaśnięcia, łączna wartość wyceny i przewidywany lead time. Możliwe jest sortowanie i filtrowanie po dowolnej kolumnie - np. wyszukanie najnowszych czy najwyżej wycenionych ofert.

![admin_panel_sesje_wyceny](/images/projects/automated-quotation-system/admin_panel_sesje_wyceny.jpg "Tabela z sesjami wyceny")

Z poziomu listy administrator może:
- usuwać pojedyncze lub grupowe sesje (np. wygasłe, testowe, generowane błędnie),
- monitorować ścieżkę wycen - które zostały przekształcone w zamówienia, a które porzucone lub nieukończone,
- dla sesji powiązanych z kontem użytkownika uruchomić akcję „follow-up”, która wyśle przypominającego e-maila z linkiem powrotnym do dokończenia wyceny.

**Szczegóły sesji wyceny**

Po kliknięciu ID lub przycisku „szczegóły” dostępny jest modal z kompletnym podsumowaniem: lista przesłanych modeli, wybrane parametry druku (materiał, kolor, wypełnienie, ilość), statusy przetwarzania każdej pozycji oraz lead time dla całej sesji.

![szczegoly_sesji_wyceny](/images/projects/automated-quotation-system/szczegoly_sesji_wyceny.jpg "Szczegóły sesji wyceny")

**Przypomnienia e-mail o wycenie (follow-up)**

Gdy sesja wyceny jest powiązana z kontem użytkownika, operator może jednym kliknięciem wysłać automatycznego maila przypominającego o pozostawionej - ale niedokończonej - ofercie. Wiadomość zawiera indywidualny link do sesji, który pozwala wrócić bez utraty konfiguracji.

![przypomnienie_o_wycenie](/images/projects/automated-quotation-system/przypomnienie_o_wycenie.jpg "Treść maila przypominająca o wycenie")

### Zarządzanie zamówieniami

To kluczowa funkcjonalność panelu administracyjnego. W module zarządzania zamówieniami widoczna jest lista wszystkich zamówień złożonych przez użytkowników - zarówno nowych, będących w realizacji, jak i już zakończonych. Dzięki elastycznemu zarządzaniu zamówieniami operatorzy mogą łatwo śledzić postęp realizacji produkcji, reagować na pojawiające się zapytania, a także utrzymywać wzorowy porządek w archiwum zamówień - bez konieczności sięgania po zewnętrzne narzędzia czy grzebania w bazie danych.

Moduł został zaprojektowany tak, by jak najwięcej czynności administracyjnych odbywało się z poziomu jednego widoku - bez przeładowywania strony i bez konieczności korzystania z dodatkowych formularzy czy systemów zewnętrznych. Większość powtarzalnych zadań (zmiana statusu, wysyłka powiadomień, generowanie dokumentów) wykonywana jest automatycznie lub za pomocą jednego kliknięcia.

**Tabela z zamówieniami**

Informacje o zamówieniach są przedstawione w formie przejrzystej tabeli. W tabeli prezentowane są takie dane jak: ID zamówienia, użytkownik, wartość netto, aktualny status (np. nowe, opłacone, w realizacji, wysłane, anulowane), data utworzenia, przewidywany lead time oraz informacja o ewentualnej dołączonej notatce od klienta. Ostatnia kolumna przeznaczona jest na akcje dostępne dla operatora.

![admin_panel_zamowienia](/images/projects/automated-quotation-system/admin_panel_zamowienia.jpg "Tabela z zamówieniami")

Tabela zamówień umożliwia filtrowanie i sortowanie według dowolnych pól (status, data, użytkownik, wartość), co pozwala szybko znaleźć interesujące zamówienie lub zidentyfikować priorytety produkcyjne.

**Dodatkowe opcje dla wybranych zamówień**

Pierwsza kolumna tabeli zamówień zawiera checkboxy umożliwiające zaznaczenie pojedynczych lub wielu pozycji jednocześnie. Gdy zostanie zaznaczona co najmniej jedna pozycja, nad tabelą pojawia się dodatkowy pasek z opcjami masowych operacji:

- Kopiuj pliki - przenosi pliki modeli 3D wybranych zamówień ze wskazanego folderu wycen do dedykowanego folderu produkcyjnego na S3. Zapobiega to utracie plików w przypadku automatycznego czyszczenia sesji wycen i zapewnia stabilność archiwum produkcyjnego.
- Pobierz logi - pozwala pobrać diagnostyczne logi backendu związane z wybraną konfiguracją zamówienia. Funkcja ta pomaga w szybkiej diagnostyce i rozwiązywaniu ewentualnych problemów technicznych zgłoszonych przez klienta (np. nietypowe zachowanie slicera, rozjazdy w konfiguracji, błędy uploadu).
- Usuń zaznaczone - umożliwia trwałe usunięcie wybranych zamówień z systemu, wraz z powiązanymi plikami i danymi.

![admin_panel_dodatkowe_opcje_zamowien](/images/projects/automated-quotation-system/admin_panel_dodatkowe_opcje_zamowien.jpg "Dodatkowe opcje dla wybranych zamówień")

**Szczegóły zamówienia**

Po wejściu do szczegółów zamówienia operator uzyskuje dostęp do wszystkich kluczowych informacji na temat danej realizacji w jednym miejscu. Dla każdej pozycji prezentowana jest szczegółowa konfiguracja produkcji - materiał, kolor, wypełnienie, opcje specjalne i liczba sztuk - uzupełniona o podgląd 3D modelu oraz możliwość pobrania oryginalnego pliku 3D. Oprócz tego, przy każdej części wyświetlane są informacje operacyjne: przewidywany czas druku i zużycie materiału, będące precyzyjnym wynikiem analizy slicera. Dzięki temu operator ma wszystkie dane niezbędne do sprawnej organizacji i planowania procesu produkcyjnego.

![admin_panel_szczegoly_zamowienia](/images/projects/automated-quotation-system/admin_panel_szczegoly_zamowienia.jpg "Szczegóły zamówienia")

Ponadto, w szczegółach zamówienia znajdują się pełne dane kontaktowe zamawiającego oraz dane do wysyłki, co pozwala na natychmiastowe przygotowanie paczki lub kontakt w razie niejasności. Całość została zaprojektowana tak, by obsługa zamówienia - od weryfikacji plików, przez produkcję, aż po wysyłkę - była możliwa bez opuszczania panelu administracyjnego.

**Akcje operatora**

Wszystkie kluczowe akcje dostępne są kontekstowo, w zależności od etapu zamówienia. Dzięki temu panel prowadzi operatora przez proces krok po kroku, nie pozwalając np. zamknąć realizacji przed wygenerowaniem dokumentów czy uzupełnieniem danych do wysyłki. Automatyczne powiadomienia e-mail wyręczają operatora w kontakcie z klientem i minimalizują ryzyko błędów informacyjnych.

- **Dla statusu "opłacone - weryfikacja techniczna", dostępną akcją jest "zatwierdź realizację"**

![admin_panel_status_oplacone](/images/projects/automated-quotation-system/admin_panel_status_oplacone.jpg "Akcje dla opłaconego zamówienia")

Po kliknięciu "zatwierdź realizację", wyskakuje alert o potwierdzeniu akcji:

![admin_panel_zatwierdzanie_realizacji](/images/projects/automated-quotation-system/admin_panel_zatwierdzanie_realizacji.jpg "Alert o zatwierdzeniu realizacji")

Po zatwierdzeniu, status zlecenia automatycznie zmienia się na "W realizacji", a do klienta wysyłany jest email potwierdzający, że jego pliki 3D zostały zatwierdzone do produkcji.

![email_zatwierdzenie](/images/projects/automated-quotation-system/email_zatwierdzenie.jpg "Email, jakiego otrzymuje klient po zatwierdzeniu plików")

- **Dla statusu "W realizacji", dostępne są trzy akcje: "Dodaj fakturę", "Nadaj paczkę" oraz "Zakończ realizację"**

![admin_panel_status_wrealizacji](/images/projects/automated-quotation-system/admin_panel_status_wrealizacji.jpg "Akcje dla zamówienia w realizacji")

Po kliknięciu "dodaj fakturę" wyświetli się modal dodawania faktury do zamówienia.

![admin_panel_dodaj_fakture](/images/projects/automated-quotation-system/admin_panel_dodaj_fakture.jpg "Modal z opcjami dodania faktury do zlecenia")

W modalu dostępne są dwie opcje - "Wygeneruj fakturę automatycznie" lub "Dodaj link do faktury z Fakturowni". Domyślnie preferowaną opcją jest automatyczne generowanie faktury przez API systemu faktur - panel automatycznie pobiera dane klienta oraz dane do faktury z zamówienia, eliminując konieczność ręcznego przepisywania. Po utworzeniu faktury, klient będzie miał możliwość pobrania jej z poziomu panelu konta.

Po pomyslnym wygenerowaniu faktury przez pierwszą opcję, wyskoczy potwierdzenie:

![admin_panel_potwierdzenie_generowania_faktury](/images/projects/automated-quotation-system/admin_panel_potwierdzenie_generowania_faktury.jpg "Potwierdzenie generowania faktury")

Gdy faktura jest już dodana do zlecenia, otwierając modal z opcją dodania faktury, na dole modala wyświetli się komunikat, że faktura jest już przypisana do zamówienia.

![admin_panel_faktura_dodana](/images/projects/automated-quotation-system/admin_panel_faktura_dodana.jpg "Informacja że faktura już dodana do zamówienia")

Po kliknięciu "Nadaj paczkę" wyświetli się modal dodawania numeru przesyłki do zamówienia. Na tym etapie trzeba już posiadać nr wcześniej przygotowanej przesyłki. Na potrzeby MVP aplikacji ta funkcjonalność się sprawdza, natomiast w następnej wersji panelu administracyjnego zakładam dodanie automatycznego generowania listów przewozowych (automatyczne generowanie listu przewozowego przez API firmy dostarczającej usługi kurierskie na podstawie wprowadznonych danych paczki oraz uzupełnianie nr listu przewozowego)

![admin_panel_nadaj_paczke.jpg](/images/projects/automated-quotation-system/admin_panel_nadaj_paczke.jpg "Modal z opcją dodania nr przesyłki")

Po dodaniu nr przesyłki pojawi się potwierdzenie:
![admin_panel_paczka_nr_przesylki_nadany.jpg](/images/projects/automated-quotation-system/admin_panel_paczka_nr_przesylki_nadany.jpg "Potwierdzenie zapisania nr przesyłki do bazy")

Gdy nr przesyłki jest już dodany do zlecenia, otwierając modal z opcją uzupełnienia listu przewozowego, na dole modala wyświetli się komunikat, że nr przesyłki jest już przypisany do zamówienia.

![admin_panel_potwierdzony_nr_przesylki](/images/projects/automated-quotation-system/admin_panel_potwierdzony_nr_przesylki.jpg "Informacja że nr przesyłki już przypisany do zamówienia")

Aby kliknąć akcję "Zakończ realizację" niezbędne jest wcześniejsze dodanie faktury oraz nr przesyłki. Jeżeli któraś z wartości nie jest uzupełniona, wyskoczy adekwatny komunikat:

![admin_panel_alert_przez_zakonczeniem](/images/projects/automated-quotation-system/admin_panel_alert_przez_zakonczeniem.jpg "Alert przed zakonczeniem realizacji")

Gdy faktura i nr przesyłki są dodane, przed wykonaniem akcji zakończenia realizacji wyświetli się alert "czy na pewno?":

![admin_panel_zakoncz_realizacje](/images/projects/automated-quotation-system/admin_panel_zakoncz_realizacje.jpg "Alert - czy na pewno chcesz zakonczyc realizacje")

Po zatwierdzeniu akcji, zostanie ona potwierdzona, status realizacji zmieni się na "Zrealizowane" oraz do klienta zostanie wysłany email z informacją o zakończeniu realizacji, gdzie otrzyma link do śledzenia paczki oraz fakturę za zrealizowaną usługę.

![admin_panel_potwierdzenie_zakonczenia.jpg](/images/projects/automated-quotation-system/admin_panel_potwierdzenie_zakonczenia.jpg "Potwierdzenie zakończenia realizacji")

![email_zamowienie_zrealizowane](/images/projects/automated-quotation-system/email_zamowienie_zrealizowane.jpg "Email z informacją o zakończeniu realizacji")

### Porządek w plikach i statusach

Aby utrzymać porządek na platformie oraz zoptymalizować wykorzystanie przestrzeni dyskowej, panel administracyjny wyposażony jest w dedykowane narzędzia do zarządzania plikami i statusami sesji oraz zamówień. W centralnej części widoku zarządczego znajdują się trzy kluczowe przyciski:



- **Wyczyść przeterminowane sesje** - Usuwa wszelkie informacje oraz pliki powiązane z wygasłymi sesjami wyceny - zarówno zewnętrznie z S3, jak i z serwera aplikacji. Dzięki temu, niepotrzebne i porzucone wyceny nie zajmują miejsca ani nie pozostawiają "śmieciowych" plików.

- **Sprawdź daty wygaśnięcia** - Automatycznie weryfikuje aktualne sesje i oznacza te, które przekroczyły ustawiony czas ważności, jako "expired". Przeglądanie i manualne wywoływanie tej operacji pozwala na szybkie nadzorowanie stanu systemu zwłaszcza przy dużym wolumenie użytkowników.

- **Wyczyść stare pliki 3D zamówień** - Usuwa pliki 3D z folderów roboczych na S3, które zostały przeniesione do dedykowanego archiwum zamówień. Dzięki temu tymczasowe przestrzenie na pliki wykorzystywane do kalkulacji wycen nie są zapełniane historycznymi danymi, których kopie są już bezpiecznie zarchiwizowane przy zamówieniu.

![panel_porządek](/images/projects/automated-quotation-system/panel_porzadek.jpg "Panel sterowania porządkiem w plikach i statusach")

Każda z tych operacji informuje operatora o swoim wyniku - po wykonaniu zadania system zwraca szczegóły działania z backendu (np. liczba usuniętych plików), które są wyświetlane bezpośrednio w panelu. To pozwala administratorowi łatwo monitorować i potwierdzać bieżący stan platformy oraz skuteczność działań porządkowych.

![wynik_operacji_porządkowej](/images/projects/automated-quotation-system/wynik_operacji_porządkowej.jpg "Przykładowy wynik działania operacji porządkowej")

Dzięki temu pliki przesyłane w ramach wycen są przechowywane tylko przez minimalny czas wymagany do realizacji zamówienia - reszta jest automatycznie, nieodwracalnie usuwana. Takie podejście gwarantuje realną zgodność z RODO i wysoki standard bezpieczeństwa.





---


# Podsumowanie techniczne i doświadczenia z wdrożenia

## Od zera do skalowalnej produkcyjnej platformy - świadome zarządzanie projektem

Zanim napisałem pierwszą linijkę kodu, dokładnie rozpoznałem, jaki efekt biznesowy ma przynieść ta platforma - nie chodziło o samą automatykę, tylko o strategiczny wzrost firmy: redukcję pracy operacyjnej, likwidację barier zakupowych, skalowanie i eliminację błędów w procesie wycen. Od początku myślałem o całym przedsięwzięciu z poziomu firmy, nie produktu IT - odczytywałem powtarzalne miejsca pracy manualnej i wdrażałem optymalizację, która zmieniała drukarnię w “maszynę”, nad którą można teraz pracować z metapoziomu: monitorować, dokładać nowe “moduły”, automatyzować. To typowy “pracuj nad firmą, nie w firmie” - zorientowany na efektywność biznesową, a nie tylko na kod.

Jednocześnie samą implementację od początku prowadziłem jak “projekt end-to-end”:  
- Rozrysowanie całego flow (użytkownik, sesja wyceny, zamówienie, admin),  
- Precyzyjna definicja wymagań (np. klucz: realna, nie estymowana cena wyceny = slicing G-code),  
- Bezpieczeństwo, ergonomia, skalowalność jako wymagania nie do otwarcia (choć oznaczały pracę po stronie architektury i devopsu).
- Wygodę użytkownika, przyszłą skalowalność oraz bezpieczeństwo traktowałem jako "must-have", co miało przełożenie zarówno na decyzje architektoniczne, jak i praktyki devopsowe.

## Nauka przez praktykę, narzędzia i świadomy AI-assisted development

Gdy zaczynałem projekt, miałem podstawy w JavaScript, ale Node.js i React były dla mnie nowością. Moją największą przewagą nie była więc znajomość konkretnej składni, tylko naturalna intuicja technologiczna i umiejętność wyczowania kontekstu technologicznego. Kluczowa okazała się też skuteczność w wykorzystywaniu narzędzi AI - nie traktowałem LLM jak “autopilota”, ale jak kontekstowego asystenta, którego rolą jest nie bezmyślne generowanie kodu, tylko przetwarzanie intencji i logiki projektowej, debugowanie, rozwijanie architektury i usprawnianie wdrożeń.

Przez większość prac korzystałem z dwóch podejść:

### Praca z Claude Sonnet 4.5 i ChatGPT 4.1 (standardowy workflow)

Na początku rozwoju projektu głównym narzędziem był dla mnie Claude Sonnet 4.5, choć w codziennej pracy często wspomagałem się także ChatGPT 4.1. Wypracowałem jasny podział zadań między tymi modelami:

- **Claude Sonnet 4.5** służył mi do generowania bardziej rozbudowanych fragmentów kodu - zarówno frontendowych, jak i backendowych - oraz do szybkich iteracji/refactoringu i debugowania zachowań na styku różnych komponentów. Przed każdą sesją z Claudem zawsze przygotowywałem zwięzłą, dobrze sformatowaną notatkę dokumentacyjną, zawierającą opis projektu, strukturę repozytorium oraz aktualny scope zmiany. W miarę potrzeb dostarczałem mu dodatkowo wybrane fragmenty kodu (README, kluczowe pliki), by mógł lepiej rozumieć intencje oraz zależności biznesowe i techniczne.

- **ChatGPT 4.1** traktowałem natomiast jako “precyzyjne narzędzie chirurgiczne” - wykorzystywałem go do mikrooperacji, jednostkowych poprawek, testowania pojedyńczych funkcji, generowania testów jednostkowych czy rozwiązywania lokalnych bugów. Zaletą GPT była możliwość zadania bardzo precyzyjnego problemu i natychmiastowego uzyskania poprawki.

Kluczowym elementem workflow była **kontrola kontekstu**:  
– Każda istotna funkcjonalność dostawała własną, dedykowaną konwersację - po to, by nie przepalać tokenów na nieistotny kontekst,  
– Dbałem, by w konwersacji znajdowały się tylko te informacje, które były potrzebne dla aktualnego ficzera - żadnego zbędnego szumu z innych tematów,  
– Notatki, README i wycinki kodu ładowałem tylko w niezbędnym zakresie, stale aktualizując je przy większych zmianach,  
– Po zamknięciu prac nad jednym ficzerem, nowy ficzer = nowa rozmowa, z czystym i aktualnym kontekstem.

To podejście pozwoliło mi efektywnie korzystać z obu modeli - Claude Sonnet 4.5 do holistycznych, wieloetapowych zmian, a ChatGPT 4.1 do precyzyjnych operacji. Jednocześnie cały czas to ja byłem “dyrygentem” procesu - kontrolowałem przepływ informacji i ścieżkę kodowania, utrzymując wysoką jakość i oszczędność zarówno czasu, jak i kosztów pracy z AI.

### Przełom z Claude Code (integracja z monorepo GitHub)

Prawdziwy gamechanger nastąpił, gdy odkryłem Claude Code i podpiąłem do niego swoje monorepo projektu przez GitHub. To narzędzie z miejsca przejęło cały kontekst - bez konieczności każdorazowego tłumaczenia struktury, repo, zależności czy intencji.
Wystarczyło zadbać o porządną, na bieżąco aktualizowaną dokumentację w README oraz utrzymanie spójności projektu - a Claude Code potrafił już rozumieć zmiany cross-modularnie i trzymać kontekst wszystkiego, co działo się zarówno na backendzie, frontach, jak i w plikach konfiguracyjnych.  
Efekt?  
- Mogłem w ciągu jednej dłuższej sesji przeprowadzić zmiany, które dotyczyły jednocześnie API, panelu admina i backendowego workflow,  
- Znacznie zmniejszyło to potrzebę “dogrzewania” własnego kontekstu przez kopiowanie plików ręcznie,  
- Usprawnienie developmentu synchronicznego (np. zmiany w jednym komponencie automatycznie śledzone przez kod po stronie serwera czy frontendu).

W obu podejściach najważniejsze było to, że to ja nadawałem ton, ramy i porządek - AI było narzędziem, nie “czarną skrzynką”. Kod powstawał spójny i logiczny, bo prowadziłem workflow od początku do końca, stale rozumiejąc skutki każdej zmiany.

Uważam, że z AI można zrealizować praktycznie każdy feature, o ile poprawnie przygotuje się grunt i ustali jasne reguły pracy (konkretna rozmowa = konkretny ficzer/proces, czyste README, ścisły kontekst) - dało mi dużą przewagę produktywności. Było też nieocenioną pomocą w nauce nowych technologii “w biegu”, np. Reacta, który musiałem wchłonąć szybko, by platforma była rzeczywiście nowoczesna i wydajna.

## Architektura, stack i decyzje techniczne - inżynieria pod realne wymagania, nie hype

Kluczowy wybór: cały stack miał być w pełni customowy, zero schodzenia na gotowce, które nie rozumieją branży druku 3D (np. WooCommerce, Shopify, uniwersalne kalkulatory).  
- **Backend:** Node.js (twardsza nauka, ale pełna kontrola)  
- **Frontend:** React (komfort oddzielenia warstwy - mogłem osobno wdrażać, testować i refaktorować, UI był doklejalny do WordPressa)  
- **Repozytorium:** monorepo Github, 3 główne paczki (frontend użytkownika, panel admina, backend), wszystko trzymane w wersjach, z historią zmian.

### Kluczowe narzędzie: PrusaSlicer  
Wdrożenie wyceny przez realne G-code - nie szacowane objętością, tylko dane z terminalowego slicing’u - z punktu widzenia biznesu zmieniło wszystko:  
- Precyzja wyceny,  
- Zero zaniżania/nieprzewidywalnych kosztów (“niespodzianki” znane z innych systemów),  
- Możliwość automatyzacji i skalowania bez poprawek “po ludzku”.

Wyboru samego slicera dokonałem, bo znam PrusaSlicer doskonale z maszynowego doświadczenia - i… nie było lepszej alternatywy dającej pełne CLI, wydajność, deterministyczność wyników.

### Storage S3/MinIO i strategia zarządzania plikami  
Na początku rozważałem wybór pomiędzy klasycznym FTP a bucketem S3, który był mi wówczas obcy. Po analizie stwierdziłem, że architektura S3/MinIO idealnie odpowiada potrzebom zarządzania dużą liczbą plików w tym projekcie.

Pierwsze testy pokazały, jak łatwo w tradycyjnym podejściu powstaje chaos - brak powiązania plików z sesjami wycen czy zamówieniami prowadziłby do bałaganu i problemów z retencją danych. Dlatego od razu wdrożyłem logikę wiązania plików z sesjami i zamówieniami oraz mechanizmy cache’owania, automatycznego czyszczenia i migracji plików do folderów docelowych. Te praktyki zapewniają porządek, automatyzację, zgodność z RODO i bezpieczeństwo na każdym etapie życia pliku.

## DevOps, hosting, bezpieczeństwo, automatyzacja

Całość hostuję na własnym **homelabie**, który specjalnie rozbudowałem (nowe CPU i RAM), by zapewnić płynność działania PrusaSlicer nawet przy wielu równoległych wycenach. Sercem środowiska jest Proxmox - każda usługa (backend, oba frontend’y, storage, MinIO, Prometheus) działa w dedykowanej VM lub kontenerze LXC/Docker. 

Usługi są wystawiane na świat tylko tam, gdzie to konieczne (np. strona firmowa, backend), a pełna kontrola odbywa się przez reverse proxy (Nginx Proxy Manager) z precyzyjnie ustawionymi przekierowaniami na określone porty oraz maszyny. Dodatkowo, cała komunikacja z zewnątrz jest ściśle limitowana przez firewall na routerze - każdy przychodzący i wychodzący ruch sieciowy jest kontrolowany przez zestaw dedykowanych reguł i whitelist, co skutecznie zamyka dostęp do usług, które nie muszą być dostępne publicznie.

Warstwa DNS w Cloudflare zapewnia dodatkową ochronę - rzeczywisty adres IP mojego serwera pozostaje ukryty, co eliminuje jeden z najczęstszych wektorów ataków na sieci domowe i infrastrukturę bare metal.

Monitoring przy pomocy Grafany i Prometheus pozwala mi na bieżąco kontrolować zużycie zasobów, planować skalowanie maszyn wirtualnych, wdrażać automatyczne kopie zapasowe, zadania utrzymaniowe i rolling update’y usług bez ryzyka utraty kontroli nad środowiskiem produkcyjnym.

![prometheus](/images/projects/automated-quotation-system/prometheus.jpg "Monitoring zasobów backendu")

### Wdrażanie nowości i workflow wdrożeniowy - praktyczna nauka na żywym projekcie

To była moja pierwsza aplikacja webowa tej skali, w której samodzielnie spinałem procesy przebudowy i wdrażania zarówno frontendu, jak i backendu. Naturalnie, nie znałem jeszcze narzędzi do automatycznego CI/CD ani nie miałem gotowych schematów z innych dużych zespołów. Workflow wdrożeniowy wypracowałem po prostu eksperymentując - metodą kolejnych prób, błędów i iteracji - aż znalazłem efektywny sposób, który sprawdzał się na moim homelabie.

Aktualizacje wdrażałem manualnie, bo taka ścieżka była dla mnie zrozumiała i pozwalała uczyć się na bieżąco, jak działają zależności między budowanymi komponentami. Frontend wrzucałem przez własny skrypt `.sh`, który automatyzował podmianę plików builda na FTP w strukturze WordPressa, natomiast backend aktualizowałem przez `git pull`, kompilację i restart usług przez systemd po SSH.

Ten manualny workflow, choć powolniejszy niż profesjonalne CI/CD, dał mi pełną świadomość zależności, nauczył dyscypliny wersjonowania oraz umożliwił szybkie wycofanie zmian (rollback), gdy coś poszło nie tak. Przy MVP i dynamicznie rozwijającym się projekcie okazał się dobrą szkołą realnej pracy z wydaniami, deployem i zarządzaniem środowiskiem produkcyjnym.

### Wersjonowanie i środowiska - praktyczna ewolucja podejścia

Początkowo nie przywiązywałem wagi do oddzielania środowiska deweloperskiego od produkcyjnego - skoro zaczynałem sam, a ruch na platformie był zerowy, naturalne wydawało się testowanie wszystkiego “na żywym organizmie”. Jednak w miarę szybkiego rozwoju projektu, rosnącej liczby funkcji i pojawiania się prawdziwych użytkowników, zrozumiałem, jak duże ryzyko niosą ze sobą poprawki i rozwój na produkcji. Pojawiały się nieprzewidziane konflikty, regresje oraz coraz większy stres związany z wycofywaniem nietrafionych zmian.

To praktyczne doświadczenie przekonało mnie, że nawet w jednoosobowym, dynamicznym projekcie warto postawić na jasny podział środowisk: na development, staging oraz produkcję, a także zadbać o czytelną chronologię wersji i możliwość łatwego rollbacku. Od tamtego momentu workflow projektowy zaczął obejmować: testy i eksperymenty w sandboxie, staging nowości oraz świadome “flagi” bezpieczeństwa przy wdrożeniach na produkcję.

Wszystko opierałem na monorepo Github, gdzie trzy główne moduły (frontend platformy wyceny, frontend panelu admina, backend) pozwalały na częściowe, niezależne wdrożenia. Branchowanie, pull requesty oraz wersjonowanie kodu nauczyły mnie proceduralnego podejścia do zmian i dały poczucie panowania nad coraz bardziej złożoną platformą.

## Iteracyjny rozwój, strategie automatyzacji i feedback loop

Moim codziennym rytuałem była pętla feedbacku: dzień kończyłem podsumowaniem realnego progresu, oceniając, co działa, a co jeszcze wymaga pracy. Uczyłem się strategicznego myślenia - skupiając się najpierw na rzeczach fundamentalnych, później wdrażając szczegóły. Planowanie backlogu i roadmapy nauczyło mnie łączyć perspektywę developera, biznesu i klienta końcowego.  
 **Automatyzacja i optymalizacja** były naturalnym następstwem obserwacji na każdym etapie wdrożenia, m.in.:  
- Zauważałem bałagan na S3 przy testach → wdrażałem powiązania plików z sesjami i porządkowanie,  
- Testowałem slicing przy tych samych parametrach → zauważyłem niepotrzebne ponowne zużycie zasobów serwera, wdrożyłem mechanizm cache blokujący niepotrzebny load,  
- Pojawiła się potrzeba czyszczenia plików i optymalizacji storage → powstały dedykowane narzędzia admina, mechanizmy czyszczenia, a także integracja wymuszająca porządek i retencję zgodnie z RODO.

Ten organiczny rozwój pozwala mi dziś **myśleć i działać jak CTO, product owner i devops w jednej osobie** - rozumiem i wdrażam cykl build-measure-learn, stale usprawniam flow, zadaję sobie pytanie: gdzie jeszcze można odciąć powtarzalną robotę, poprawić UX, zoptymalizować biznes? Finalnie - **tylko taka postawa daje przewagę konkurencyjną każdej rozwijającej się organizacji technologicznej.**

## Bezpieczeństwo, walidacje i odporność

Wraz z rosnącą liczbą funkcji i integracji bezpieczeństwo systemu stawało się coraz większym wyzwaniem. Doświadczenie pokazało mi, że każdy nowy ficzer może “wysypać” nawet wcześniej dobrze przetestowane części - liczba możliwych wektorów ataku i konfliktów rośnie wykładniczo z każdą iteracją.  
Pilnowałem:  
- rygorystycznych walidacji na backendzie (np. walidacja uploadów, blokady na manipulacje ceną),  
- jasnego modelu RODO (kasowanie danych, retencja, mechanizmy clean-up dla sesji i plików poza okresem przechowywania),  
- fizycznych zabezpieczeń sieciowych (Cloudflare, reverse proxy, firewall),  
- polityki minimalnych uprawnień i fizycznej separacji usług (każda usługa w swoim kontenerze/LXC, porty otwarte tylko tam, gdzie to konieczne).  
**Najważniejsza lekcja:** poziom bezpieczeństwa jest odwrotnie proporcjonalny do liczby funkcji, jeśli nie towarzyszy temu kultura testowania, automatyczne walidacje, procedury rollbacku i sprawny monitoring.

## Zarządzanie i optymalizacja biznesu przez technologię

Ten projekt nauczył mnie patrzeć na firmę jak na dynamiczny mechanizm, który można doskonalić przez automatyzację powtarzalnych czynności - nie tylko dla przyspieszenia obsługi klienta, ale po prostu dla otwarcia nowego modelu biznesowego i wolumenu, który dawniej blokowała ręczna praca operatora.

**Dzięki automatyzacji obsługi zleceń:**
- obsługa wycen skaluje się praktycznie bezkosztowo (więcej klientów ≠ więcej godzin pracy),
- mogę łatwo zatrudnić kolejne osoby (admin panel → czytelny, wszystko pod ręką, jasne procedury),
- każda kolejna optymalizacja/feature nie tylko poprawia backend/front, ale daje realny wzrost operacyjny w biznesie (lepsza konwersja, mniejszy chaos, szybszy obrót gotówki).

Największą satysfakcję daje mi to, że - dzięki tej platformie - moja firma przestała być zbiorem ręcznie wykonywanych, chaotycznych działań, a stała się poukładaną maszyną, która działa według zdefiniowanych reguł, procedur i automatycznych przepływów. Teraz nie “pracuję w firmie” - pracuję nad firmą: mogę usprawniać system z perspektywy całości, wdrażać kolejne automatyzacje, optymalizować, rozwijać i doskonalić model biznesowy.

## Przemyślenia wdrożeniowe i potencjał optymalizacji

- W kolejnej wersji rozdzieliłbym frontend jako osobne SPA pod subdomeną (np. platforma.geometryhustlers.pl), nie w ramach WordPressa - lepsza separacja odpowiedzialności, większa elastyczność i niezależne zarządzanie userami oraz bazą danych.  
- Nie wdrażać funkcji “na wszelki wypadek” - jeśli nie ma realnej potrzeby, nie warto tracić czasu i zasobów.  
- Częste review kodu (własne lub wspierane przez AI) i iteracyjne czyszczenie starego codebase’u zapobiega narastaniu długu technicznego.  
- Warto postawić na monitoring od pierwszego dnia (Prometheus), wtedy łatwo skalować VM-ki, optymalizować flow i nie dopuścić do zadyszki przy rosnącym ruchu lub volume wycen.

---

**Podsumowując:**  
To nie tylko projekt programistyczny - to przykład, jak wykorzystując połączenie inżynierskiej ciekawości, kompetencji dev/ops, szerokiego spojrzenia biznesowego oraz najnowszych narzędzi (AI, homelab, automatyzacja, storage), można w praktyce stworzyć firmę zarządzaną jak sprawny, skalowalny system, a nie codziennie gaszony „pożar”.
Całość od pomysłu, przez architekturę, development, po finalne wdrożenie technologiczne powstała w duchu: szukaj miejsc do optymalizacji, automatyzuj powtarzalność, dokumentuj każdy etap decyzji i stale pracuj nad sprzężeniem zwrotnym z realnymi problemami biznesu.
To właśnie takie podejście - stawiające na automatyzację, spięcie wszystkiego w przejrzysty system i ciągłe szukanie nowej wartości - jest według mnie kluczowe dla każdego CTO, foundera, czy managera, który myśli o rozwoju firmy odpornej na chaos i gotowej na szybkie skalowanie.
Ten projekt pokazuje, że mając “systemowy” mindset i gotowość do eksperymentów, można - nawet w pojedynkę - zamienić firmę w samonapędzający się mechanizm, gotowy do dalszego rozwoju i efektywnej ekspansji.








# Jak to działa pod maską (deep dive techniczny)

treść w tworzeniu


