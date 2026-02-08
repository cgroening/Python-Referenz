# Profiling und Timing

## 1    Dauer der Code-Ausführung messen

Die Funktion `time.time()` gibt die aktuelle Zeit als Unix-Timestamp in Sekunden zurück. Sie ist allerdings nicht ideal für präzise Zeitmessungen, weil sie durch folgende Faktoren beeinflusst wird:

1. Geringe Präzision auf manchen Systemen
	- `time.time()` basiert auf der Systemuhr, die je nach Betriebssystem nicht hochauflösend ist.
	- Bei Windows hat `time.time()` oft nur eine Genauigkeit von etwa 15,6 Millisekunden.
2. Sprünge durch Systemzeit-Änderungen
	- Wenn die Systemuhr manuell geändert oder durch NTP (Network Time Protocol) synchronisiert wird, kann `time.time()` springen oder rückwärtslaufen.
3. Nicht speziell für Zeitmessungen gedacht
	- `time.time()` ist hauptsächlich für das Abrufen der aktuellen Uhrzeit gedacht, nicht für Hochpräzisionsmessungen.

> [!Warum ist `time.perf_counter()` besser?]
> Die Funktion `time.perf_counter()` ist speziell für hochpräzise Zeitmessungen gedacht:
> 1. Hohe Auflösung
> 	- Nutzt die genaueste verfügbare Uhr des Systems.
> 	- Auf modernen Systemen meist Nanosekunden- oder Mikrosekunden-genau.
> 2. Monoton steigend
> 	- Kann nicht durch Systemzeitänderungen beeinflusst werden.
> 	- Die Werte steigen immer an, niemals rückwärts.
> 3. Optimiert für Laufzeitmessungen
> 	- Ideal für Benchmarking und Laufzeitanalysen.

```python
import time

# Ungenau:
start = time.time()  # Nur geeignet um aktuelle Zeit zu erhalten
time.sleep(1)
end = time.time()
print(end - start)

# Genau:
start = time.perf_counter()
time.sleep(1)
end = time.perf_counter()
print(end - start)
```

## 2    Unit Tests in Python

### 2.1    Grundlagen

- Python verwendet das `unittest`-Modul (im Standardpaket enthalten).
- Alternativen: `pytest`, `nose2` (externe Pakete).

### 2.2    Einfaches Beispiel mit `unittest`

```python
import unittest

# Beispiel-Funktion: Addiert zwei Zahlen
def add_numbers(a, b):
    return a + b

# Testklasse
class TestAddNumbers(unittest.TestCase):
    def test_positive_numbers(self):
        self.assertEqual(add_numbers(2, 3), 5)

    def test_negative_numbers(self):
        self.assertEqual(add_numbers(-1, -1), -2)

    def test_zero(self):
        self.assertEqual(add_numbers(0, 0), 0)

# Hauptprogramm für Unit-Tests
if __name__ == '__main__':
    unittest.main()
```

### 2.3    Wichtige Methoden von `unittest.TestCase`

- `assertEqual(a, b)`
- `assertNotEqual(a, b)`
- `assertTrue(x)`
- `assertFalse(x)`
- `assertIsNone(x)`
- `assertRaises(Exception, func, args...)`

## 3    Profiling in Python

### 3.1    Ziel

Performance-Engpässe (Bottlenecks) im Code finden.

### 3.2    Tools im Überblick

- `cProfile` (Standardmodul, robust)
- `timeit` (für kleinere Snippets)
- `line_profiler` (extern, detailliert)
- `py-spy`, `snakeviz`, `yappi` (externe Visualisierung)

### 3.3    Beispiel: `cProfile`

```python
import cProfile

# Rechenintensive Beispiel-Funktion
def compute_heavy_task():
    total = 0
    for i in range(100000):
        total += i ** 2
    return total

# Führe Profiling durch
cProfile.run('compute_heavy_task()')
```

### 3.4    Beispiel: `timeit`

```python
import timeit

# Zeitmessung für einfachen Ausdruck
code = "sum([i*i for i in range(1000)])"
duration = timeit.timeit(stmt=code, number=1000)
print(f"Durchschnittszeit: {duration:.4f} Sekunden")
```

### 3.5    line_profiler (externe Installation nötig)

```zsh
pip install line_profiler
```

```python
# sample.py

# Mit @profile markierte Funktion
@profile
def compute():
    total = 0
    for i in range(10000):
        total += i ** 2
    return total
```

```bash
# Ausführen mit line_profiler
kernprof -l sample.py
python -m line_profiler sample.py.lprof
```

## 4    Tipps

### 4.1    Zuerst Tests schreiben, dann den Code (Test-Driven Development, TDD)

**Was es bedeutet:**

- **TDD** ist ein Entwicklungsansatz, bei dem man zuerst **Tests schreibt**, bevor man den eigentlichen Code implementiert.
- Das Ziel ist, nur so viel Code zu schreiben, wie nötig ist, um den Test bestehen zu lassen.

**Ablauf:**

1. Einen Test schreiben, der fehlschlägt (weil es die Funktion noch nicht gibt).
2. Den minimalen Code implementieren, der den Test bestehen lässt.
3. Refaktorisiere, falls nötig, und sicherstellen, dass der Test weiterhin grün ist.
4. Den Zyklus wiederholen für jede neue Funktionalität.

**Vorteile:**

- Klar definierte Anforderungen.
- Höhere Code-Qualität.
- Tests sind immer aktuell.
- Bessere Wartbarkeit.

### 4.2    `pytest` für eleganteres Testing (nutzt `assert` statt Methoden)

**Was `pytest` auszeichnet:**

- Sehr beliebt wegen seiner einfachen Syntax.
- Statt wie in `unittest` Methoden wie `assertEqual(a, b)` zu verwenden, nutzt man einfach:

  ```python
  assert a == b
  ```

**Beispiel mit `pytest`:**

```python
# test_math.py

def add(a, b):
    return a + b

def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
```

**Warum es eleganter ist:**

- Weniger Boilerplate-Code.
- Fehlermeldungen bei Fehlschlägen sind ausdrucksstärker (zeigt automatisch Werte an).
- Automatische Erkennung von Tests.
- Integration mit Plugins wie `pytest-cov`, `hypothesis` uvm.

### 4.3    Profiling immer bei realistischen Datenmengen

**Warum das wichtig ist:**

- Kleine Testdaten täuschen oft über die Performance hinweg.
- Code, der bei 100 Einträgen schnell ist, kann bei 1 Million Einträgen ineffizient skalieren.
- Realitätsnahe Tests helfen, echte Engpässe zu erkennen.

**Praxis-Tipp:**

Wenn man z. B. ein Programm für Logfile-Analyse entwickelt:

- Profiling mit 10 Zeilen bringt kaum Erkenntnisse.
- Simuliere echte Logdateien (z. B. 100 MB oder mehr).

Tools wie `cProfile`, `timeit`, `line_profiler` sollten mit realistischen Inputs verwendet werden, um aussagekräftige Ergebnisse zu liefern.

---

### 4.4    Tests und Profiling kombinieren für Performance-Regressionstests

**Was das bedeutet:**

- Nicht nur funktionale Richtigkeit testen, sondern auch sicherstellen, dass neue Änderungen den Code nicht verlangsamen.

**Wie man es macht:**

- Einen Test schreiben, der nicht nur prüft, ob das Ergebnis korrekt ist, sondern auch, ob die Ausführung innerhalb einer Zeitgrenze bleibt.

**Beispiel mit `pytest`:**

```python
import time

def test_performance():
    start = time.time()
    result = sum(i*i for i in range(100000))
    duration = time.time() - start
    assert duration < 0.5  # z. B. Maximal 0.5 Sekunden erlaubt
```

**Vorteile:**

- Du erkennst Leistungsregressionen sofort, z. B. wenn jemand unabsichtlich einen ineffizienten Algorithmus einbaut.
- Ideal für kritische Funktionen in Web-Backends, Datenverarbeitung, Simulationen etc.

## 5    Arbeiten in VS Code

### 5.1    Tests ausführen mit `unittest` oder `pytest` in VS Code

- Sicherstellen, dass der Python-Interpreter ausgewählt wurde (unten links oder `Ctrl+Shift+P` → "Python: Interpreter auswählen").
- Kommando-Palette öffnen: `Ctrl+Shift+P`
- Auswählen: `Python: Discover Tests`
- `unittest`, `pytest` oder `nose` als Framework auswählen.
- Danach: `Python: Run All Tests` oder `Run Test` direkt über dem Test mit dem kleinen „Play“-Icon.

>[!INFO]
>VS Code erkennt `pytest` automatisch, wenn die Datei mit `test_*.py` beginnt und `assert`-Statements enthält.

### 5.2    Profiling mit Erweiterung: "Python Profile"

1. Optional: Erweiterung "Python Profiler" installieren.
2. Datei öffnen
3. Einen Breakpoint setzen oder über `Run → Start Debugging` ausführen.
4. Man kann `cProfile`-Ausgaben direkt im Terminal oder über Plugins visualisieren lassen.

### 5.3    Kurzbefehle

| Aktion                         | Shortcut             |
|-------------------------------|----------------------|
| Testdatei ausführen           | `Ctrl+F5` oder ▶ oben |
| Terminal öffnen               | `Ctrl+``             |
| Befehlspalette öffnen         | `Ctrl+Shift+P`       |
| Tests entdecken               | `Python: Discover Tests` |
| Nur einen Test ausführen      | `Rechtsklick > Run Test` |
