---
title: "Platforma zamówień druku 3D End‑to‑End"
excerpt: "Zaprojektowałem i wdrożyłem customową platformę zamówień druku 3D, która zastąpiła ręczne wyceny i obsługę mailową pełnym self‑service: od kalkulacji ceny po płatność i powiadomienia o realizacji."
tech: ["React", "Node.js", "Python", "JWT", "AWS S3 / MinIO", "PrusaSlicer CLI", "Blender CLI", "MySQL", "WordPress"]
---

# Opis

Stworzyłem dla Geometry Hustlers system automatycznej wyceny druku 3D, który zastąpił ręczne kalkulacje operatorem i całą mailową „wymianę plików” jednym, spójnym procesem online. Z poziomu przeglądarki klient wrzuca model 3D, wybiera materiał i parametry, a aplikacja w kilka sekund wykonuje rzeczywisty slicing, liczy koszt i pokazuje czas realizacji. Składanie zamówienia odbywa się bez udziału człowieka po stronie firmy.

Z punktu widzenia biznesu oznacza to skrócenie czasu odpowiedzi z kilku godzin do  30 sekund, redukcję pracę przy wycenach praktycznie do zera oraz wzrost konwersji zapytań o kilkanaście punktów procentowych. System pilnuje marży, eliminuje błędy cenowe (0% rozjazdów między wyceną a realnym kosztem) i skaluje się razem z liczbą zapytań, zamiast blokować sprzedaż dostępnością kilku osób. To przykład projektu, w którym technologia (Node.js, React, PrusaSlicer, integracja z płatnościami) jest tylko środkiem - celem było uporządkowanie procesu sprzedaży i odblokowanie wzrostu firmy.

## Funkcje

- Natychmiastowe generowanie wycen
- Optymalizacja kosztów materiałów
- Szacowanie czasu druku
- Wsparcie wielu materiałów

## Wpływ

Skrócenie czasu wyceny z godzin do sekund, znacząco poprawiając doświadczenie klienta i efektywność biznesu.
