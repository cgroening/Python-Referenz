# Fehlerbehandlung

## 1    Fehlertypen

| Fehlertyp           | Beschreibung                                                |
| ------------------- | ----------------------------------------------------------- |
| **`SyntaxError`**       | Fehler in der Code-Syntax                                   |
| **`TypeError`**         | Falscher Typ einer Variablen oder eines Arguments           |
| **`ValueError`**        | Ungültiger Wert für eine Operation                          |
| **`IndexError`**        | Zugriff auf nicht vorhandenen Index in einer Liste          |
| **`KeyError`**          | Zugriff auf nicht vorhandenen Schlüssel in einem Dictionary |
| **`ZeroDivisionError`** | Division durch Null                                         |
| **`FileNotFoundError`** | Datei nicht gefunden                                        |
| **`ImportError`**       | Modul kann nicht importiert werden                          |

## 2    Grundlegende Fehlerbehandlung mit `try` und `except`

```python
try:
    number = int(input("Enter a number: "))
    print(10 / number)
except ZeroDivisionError:
    print("Error: Division by zero is not allowed.")
except ValueError:
    print("Error: Please enter a valid number.")
```

## 3    Mehrere `except`-Blöcke

```python
try:
    data = {"name": "Alice"}
    print(data["age"])
except KeyError as e:
    print(f"Missing key: {e}")
except Exception as e:
    print(f"General error: {e}")
```

## 4    Generischer `except`-Block (nicht empfohlen)

```python
try:
    # Code that may raise an error
    print(10 / 0)
except Exception as e:
    print(f"An error occurred: {e}")
```

> [!warning] Hinweis
> Dies fängt zwar alle Fehler ab, kann jedoch das Debugging deutlich erschweren!

## 5    `else`- und `finally`-Blöcke

```python
try:
    with open("file.txt", "r") as file:
        content = file.read()
except FileNotFoundError:
    print("File not found.")
else:
    print("File read successfully.")
finally:
    print("This block always executes.")
```

## 6    Eigene Fehler mit `raise` auslösen

```python
def positive_number(number):
    if number < 0:
        raise ValueError("Number must be positive!")
    return number

try:
    positive_number(-5)
except ValueError as e:
    print(f"Error: {e}")
```

## 7    Eigene Fehlerklassen definieren

```python
class CustomError(Exception):
    pass

try:
    raise CustomError("This is a custom error!")
except CustomError as e:
    print(f"Custom error: {e}")
```

## 8    Logging statt `print` verwenden

```python
import logging

logging.basicConfig(level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')

try:
    1 / 0
except ZeroDivisionError as e:
    logging.error(f"An error occurred: {e}")
```

## 9    Zusammenfassung

- `try` und `except` dienen der Fehlerbehandlung.
- Der `else`-Block wird ausgeführt, wenn kein Fehler auftritt.
- Der `finally`-Block wird immer ausgeführt.
- Mit `raise` können eigene Fehler erzeugt werden.
- Eigene Fehlerklassen werden für spezifische Fehler genutzt.
- Logging ermöglicht eine bessere Fehlerverfolgung.