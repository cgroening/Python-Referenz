Python bietet mehrere Möglichkeiten zum Debuggen: durch klassische Print-Ausgaben, durch das integrierte Debugging-Modul `pdb` oder mithilfe von Entwicklungsumgebungen wie Visual Studio Code (VS Code).

## 1    Debugging mit Print-Anweisungen

Dies ist die einfachste, aber oft sehr effektive Methode. Dabei werden Variablenwerte oder Kontrollflussinformationen mit `print()` ausgegeben.

```python
def divide_numbers(a, b):
    print('a:', a)  # Wert von a ausgeben
    print('b:', b)  # Wert von b ausgeben
    if b == 0:
        print('Fehler: Division durch Null')
        return None
    return a / b

result = divide_numbers(10, 0)
print('Ergebnis:', result)
```

## 2    Debugging mit dem `pdb`-Modul

Das Modul `pdb` (Python Debugger) erlaubt schrittweises Durchlaufen des Codes mit interaktiver Steuerung.

### 2.1    Beispiel

```python
import pdb

def greet_user(name):
    pdb.set_trace()  # Hier startet der Debugger
    greeting = 'Hello ' + name
    print(greeting)

greet_user('Anna')
```

### 2.2    Wichtige pdb-Kommandos

- `n`: next – führt die nächste Zeile aus
- `s`: step – springt in Funktionsaufrufe hinein
- `c`: continue – setzt das Programm bis zum nächsten Haltepunkt fort
- `q`: quit – verlässt den Debugger
- `p variable`: gibt den Wert einer Variablen aus

## 3    Fehlerbehandlung mit try-except

Manche Fehler lassen sich nicht vermeiden, können aber abgefangen und behandelt werden.

```python
def convert_to_int(value):
    try:
        return int(value)
    except ValueError as e:
        print('Ungültige Eingabe:', e)
        return None

number = convert_to_int('abc')
print('Ergebnis:', number)
```

## 4    Verwendung von Loggern

### 4.1    Aus Standardbibliothek

#### 4.1.1    Logging-Level

Wenn z. B. Log-Dateien erstellt werden sollen, in der nur Fehler oder kritische Ereignisse gespeichert werden sollen.

| Level      | Beschreibung                                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `DEBUG`    | Detaillierte Debug-Informationen                                                                                                           |
| `INFO`     | Nur zur Info: Dinge, die wie vorgesehen passiert sein                                                                                      |
| `WARNING`  | Wenn etwas Unerwartetes passiert ist, es hat jedoch nicht zu einem Absturz geführt hat                                                     |
| `ERROR`    | Schwerwiegender Fehler, der nicht zu einem Programmabsturz geführt hat (z. B. das Programm konnte eine bestimmte Funktion nicht ausführen) |
| `CRITICAL` | Schwerwiegender, der zu einem Programmabsturz pgeführt hat                                                                                 |

**Beispiel:**

```python
import logging

# Setup the logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# Formatter (optional)
formatter = logging.Formatter(
    '%(asctime)s:%(levelname)s:%(funcName)s:%(message)s',
)

# File handler
filepath = Path(__file__).parent.joinpath('log_standard.log')
file_handler = logging.FileHandler(filepath)
file_handler.setLevel(logging.INFO)  # Info and higher will be logged
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

def divide_integers(a: int, b: int) -> float | None:
    try:
        logger.info(f'a={a}, b={b}')
        result = a / b
        return result
    except ZeroDivisionError as e:
        logger.exception(f'Exception was raised: {e}')
        return None


def main() -> None:
    for _ in range(3):
        print(divide_integers(10, 0))


if __name__ == '__main__':
    main()
```

Inhalt der erstellten Datei `log_standard.log`:

```
2025-03-22 12:05:07,716:INFO:divide_integers:a=10, b=0

2025-03-22 12:05:07,716:ERROR:divide_integers:Exception was raised: division by zero

Traceback (most recent call last):

File ".../logging_standard_lib--edit.py", line 28, in divide_integers

result = a / b

ZeroDivisionError: division by zero

[...]
```
### 4.2    Externer Logger

[loguru](https://github.com/Delgan/loguru)

Ohne Boilerplate:

```python
from loguru import logger

logger.debug("That's it, beautiful and simple logging!")
```

## 5    Debugging in Visual Studio Code (VS Code)

VS Code bietet eine sehr leistungsstarke Debugging-Umgebung mit grafischer Oberfläche.

### 5.1    Voraussetzungen

- Erweiterung "Python" von Microsoft muss installiert sein
- Eine Datei mit Python-Code geöffnet

### 5.2    Breakpoints setzen

- Links neben der Zeilennummer klicken, um einen roten Punkt (Haltepunkt) zu setzen
- Alternativ: F9 drücken bei ausgewählter Zeile

### 5.3    Debugging starten

- Run-Ansicht öffnen (links oder mit Strg+Shift+D)
- Auf 'Start Debugging' klicken oder drücke F5 drücken
- Man kann Variablen inspizieren, in den Code hineinschreiten (F11), darüber hinweg gehen (F10) oder zur nächsten Haltestelle springen (Shift+F5).

### 5.4    Variablen und Ausdrucksinspektion

- In der Debug-Seitenleiste unter "Variables" sieht man die aktuellen Werte.
- Im "Debug Console"-Fenster kann man Ausdrücke interaktiv testen.

### 5.5    Launch-Konfiguration anpassen

Erstelle eine Datei `.vscode/launch.json`, um z. B. Argumente zu übergeben:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: Datei starten",
            "type": "python",
            "request": "launch",
            "program": "${file}",
            "console": "integratedTerminal"
        }
    ]
}
```

## 6    Tipps für effektives Debugging

- Reproduzierbare Fehlerfälle schaffen
- Mit kleinen Datenmengen testen
- Unit Tests schreiben, um Fehler frühzeitig zu entdecken
- Kommentieren und Abschnitte temporär deaktivieren
- Code aufteilen in kleinere, testbare Funktionen
