# Fehlerbehandlung

## 1    Fehlertypen

| Fehlertyp               | Beschreibung                                                |
| ----------------------- | ----------------------------------------------------------- |
| `SyntaxError`       | Fehler in der Code-Syntax                                   |
| `TypeError`         | Falscher Typ einer Variablen oder eines Arguments           |
| `ValueError`        | Ungültiger Wert für eine Operation                          |
| `IndexError`        | Zugriff auf nicht vorhandenen Index in einer Liste          |
| `KeyError`          | Zugriff auf nicht vorhandenen Schlüssel in einem Dictionary |
| `ZeroDivisionError` | Division durch Null                                         |
| `FileNotFoundError` | Datei nicht gefunden                                        |
| `ImportError`       | Modul kann nicht importiert werden                          |

## 2    Grundlegende Fehlerbehandlung mit `try` und `except`

Code, der einen Fehler auslösen könnte, wird in einen `try`-Block geschrieben. Tritt ein Fehler auf, wird die Ausführung unterbrochen und der passende `except`-Block ausgeführt.

```python
try:
    number = int(input('Zahl eingeben: '))
    print(10 / number)
except ZeroDivisionError:
    print('Fehler: Division durch Null ist nicht erlaubt.')
except ValueError:
    print('Fehler: Bitte eine gültige Zahl eingeben.')
```

- `try` und `except` dienen der Fehlerbehandlung.
- Der `else`-Block wird ausgeführt, wenn kein Fehler auftritt.
- Der `finally`-Block wird immer ausgeführt.
- Mit `raise` können eigene Fehler erzeugt werden.
- Eigene Fehlerklassen werden für spezifische Fehler genutzt.
- Logging ermöglicht eine bessere Fehlerverfolgung.

## 3    Mehrere `except`-Blöcke

Können verschiedene Fehlertypen auftreten, lassen sich mehrere `except`-Blöcke hintereinander definieren. Python prüft sie der Reihe nach und führt den ersten passenden aus. Spezifischere Fehlertypen sollten dabei immer vor dem allgemeinen `Exception` stehen.

```python
try:
    data = {'name': 'Anna'}
    print(data['age'])
except KeyError as e:
    print(f'Fehlender Schlüssel: {e}')
except Exception as e:
    print(f'Allgemeiner Fehler: {e}')
```

## 4    Generischer `except`-Block (nicht empfohlen)

Mit `Exception` als Fehlertyp werden alle Ausnahmen abgefangen, unabhängig von ihrer Art.

```python
try:
    # Code, der einen Fehler auslösen kann
    print(10 / 0)
except Exception as e:
    print(f'Ein Fehler ist aufgetreten: {e}')
```

> [!warning] Hinweis
> Dies fängt zwar alle Fehler ab, kann jedoch das Debugging deutlich erschweren!

## 5    `else`- und `finally`-Blöcke

Der `else`-Block wird nur ausgeführt, wenn im `try`-Block kein Fehler aufgetreten ist. Der `finally`-Block wird dagegen immer ausgeführt – unabhängig davon, ob ein Fehler aufgetreten ist oder nicht. Er eignet sich daher für Aufräumarbeiten wie das Schließen von Dateien oder Datenbankverbindungen.

```python
try:
    with open('datei.txt', 'r') as file:
        content = file.read()
except FileNotFoundError:
    print('Datei nicht gefunden.')
else:
    print('Datei erfolgreich gelesen.')
finally:
    print('Dieser Block wird immer ausgeführt.')
```

## 6    Eigene Fehler mit `raise` auslösen

Mit `raise` kann ein Fehler manuell ausgelöst werden, z. B. um ungültige Eingaben frühzeitig abzufangen. Als Fehlertyp können sowohl eingebaute Ausnahmen wie `ValueError` als auch eigene Fehlerklassen verwendet werden.

```python
def positive_number(number):
    if number < 0:
        raise ValueError('Zahl muss positiv sein!')
    return number

try:
    positive_number(-5)
except ValueError as e:
    print(f'Fehler: {e}')
```

## 7    Eigene Fehlerklassen definieren

Durch Ableitung von `Exception` lassen sich eigene Fehlerklassen definieren. Das ist sinnvoll, wenn man zwischen anwendungsspezifischen Fehlern und eingebauten Python-Fehlern unterscheiden möchte.

```python
class CustomError(Exception):
    pass

try:
    raise CustomError('Dies ist ein benutzerdefinierter Fehler!')
except CustomError as e:
    print(f'Benutzerdefinierter Fehler: {e}')
```

## 8    Logging statt `print`

Statt Fehlermeldungen mit `print` auszugeben, sollte in produktivem Code das `logging`-Modul verwendet werden. Es ermöglicht die Ausgabe von Zeitstempel und Schweregrad, die Weiterleitung in Dateien oder externe Systeme sowie eine feingranulare Steuerung, welche Meldungen angezeigt werden.

```python
import logging

logging.basicConfig(level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')

try:
    1 / 0
except ZeroDivisionError as e:
    logging.error(f'Ein Fehler ist aufgetreten: {e}')
```
