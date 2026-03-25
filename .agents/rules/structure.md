---
trigger: manual
---

# Architektura Projektu (NodeGhost Python)

Aby projekt był czytelny, łatwy w utrzymaniu i skalowalny, zastosujemy klasyczny podział na moduły. Utworzymy osobne pliki dla logiki silnika, modeli danych oraz samych klocków (węzłów).

Proponuję następującą strukturę plików w katalogu Twojego projektu:

```text
NodeGhostPython/
├── .venv/                      # (Zignorowane w Git) Wirtualne środowisko Pythona
├── .gitignore                  # Plik ignorujący .venv, __pycache__, pliki konfiguracyjne IDE
├── requirements.txt            # Zależności projektu (FastAPI, uvicorn, pydantic itp.)
├── README.md                   # Opis projektu
│
└── app/                        # Główny folder z kodem backendu (Twój moduł aplikacji)
    ├── __init__.py             # Pusty plik, dzięki któremu Python widzi 'app' jako pakiet
    ├── main.py                 # Punkt wejściowy FastAPI (Twój serwer, endpointy API)
    ├── models.py               # Modele Pydantic: GraphNode, GraphEdge, GraphPayload (Zadanie ze Sprintu 1)
    ├── context.py              # Definicja naszego "Plecaka" - Klasa MacroContext (Sprint 3)
    ├── engine.py               # "Mózg" czyli Graph Execution Engine - logika głównej pętli (Sprint 2, 3, 5)
    │
    └── nodes/                  # Folder przechowujący zdefiniowane akcje (Klocki)
        ├── __init__.py         # Inicjalizuje pakiet, może eksportować listę klocków
        ├── base.py             # Klasa bazowa (BaseNode), z której dziedziczą wszystkie klocki
        ├── browser_nodes.py    # Logika klocków przeglądarki: ClickNode, TypeNode, OpenUrlNode
        ├── data_nodes.py       # Klocki związane z danymi: LogNode, ExportCsvNode
        └── ai_nodes.py         # Klocki integracji z AI (Sprint 7)
```

## Dlaczego taki podział?
*   **Wydzielenie zmartwień (Separation of Concerns):** `main.py` przyjmuje tylko strzały z HTTP i oddaje graf do `engine.py`. Serwer API nie ma absolutnie pojęcia, jak ten graf po cichu chodzi.
*   **Porządek w Klockach:** Wyobraź sobie, że w RUST cały silnik i 20 klocków pojechałeś w jednym 600 liniowym `lib.rs`. Tutaj elegancko dzielimy to na pliki według kategorii. O wiele łatwiej będzie dodać w przyszłości `SlackMessageNode` – wystarczy dorzucić klasę w nowym pliku.
*   **Modele to Modele:** Plik `models.py` służy tylko definicjom tego "co wchodzi i co obrabiamy" na wejściu.

### 🎯 Co teraz?
Twoim celem (w ramach przygotowania środowiska przed Sprintem 1) jest:
1.  Utworzenie wirtualnego środowiska `python -m venv .venv` i jego aktywacja.
2.  Zainstalowanie podstaw `pip install fastapi uvicorn pydantic`.
3.  Zbudowanie folderu `app/` oraz pustych plików (szczególnie interesuje nas dzisiaj `main.py` i `models.py`).

Zrób te foldery, pliki i zainstaluj zależności w konsoli. Daj znać jak stworzysz tę strukturę na dysku!
