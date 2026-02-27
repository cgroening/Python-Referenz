# Typannotationen

Typannotation (Type Annotation) ist eine Möglichkeit in Python, den erwarteten Typ von Variablen, Funktionsparametern und Rückgabewerten anzugeben.

> [!tip] Vorteile der Typannotation
> Obwohl Python eine dynamisch typisierte Sprache ist, erlaubt die Typannotation eine bessere Lesbarkeit, Wartbarkeit und eine reduzierte Fehleranfälligkeit im Code.

## 1    Grundlagen der Typannotation

Typannotation wird mit einem Doppelpunkt `:` und dem Typnamen gemacht. Der Rückgabetyp einer Funktion wird mit `->` angegeben.

### 1.1    Beispiel:

```python
def addiere(x: int, y: int) -> int:
    return x + y
```

In diesem Beispiel wird angegeben, dass sowohl `x` als auch `y` vom Typ `int` sind und die Funktion einen `int` zurückgibt.

## 2    Typannotation bei Variablen

```python
name: str = 'Anna'
alter: int = 30
aktiv: bool = True
```

## 3    Optionaler Typ

Manchmal kann eine Variable auch `None` sein. Dafür verwendet man `Optional`:

```python
from typing import Optional

def finde_benutzer(id: int) -> Optional[str]:
    if id == 1:
        return 'Anna'
    return None
```

## 4    `Any`

Der Typ `Any` aus dem `typing`-Modul signalisiert, dass jede Art von Wert erlaubt ist. Dies ist hilfreich, wenn der genaue Typ nicht bekannt oder variabel ist.

```python
from typing import Any

def drucke_wert(wert: Any) -> None:
    print(wert)
```

## 5    `Callable`

`Callable` wird verwendet, um Funktionen als Parameter oder Rückgabewerte zu typisieren.

```python
from typing import Callable

def verarbeite(funktion: Callable[[int, int], int]) -> int:
    return funktion(2, 3)
```

In diesem Beispiel ist `funktion` eine Funktion, die zwei `int`-Werte nimmt und einen `int` zurückgibt.

## 6    Typannotation in Klassen

Auch in Klassen können Typannotationen verwendet werden:

```python
class Person:
    name: str
    alter: int

    def __init__(self, name: str, alter: int) -> None:
        self.name = name
        self.alter = alter
```

### 6.1    Verweis auf eigene Klasse als Typ

Will man innerhalb einer Klasse auf die eigene Klasse verweisen (z. B. bei einer Methode, die ein Objekt der gleichen Klasse zurückgibt), verwendet man einen String (um zirkuläre Importe zu vermeiden) **oder ab Python 3.11** `from __future__ import annotations`:

```python
class Knoten:
    def __init__(self, wert: int, nachfolger: 'Knoten' = None) -> None:
        self.wert = wert
        self.nachfolger = nachfolger
```

Ab Python 3.11:

```python
from __future__ import annotations

class Knoten:
    def __init__(self, wert: int, nachfolger: Knoten = None) -> None:
        self.wert = wert
        self.nachfolger = nachfolger
```

## 7    Typalias

Man kann eigene Typen definieren, um komplexe Strukturen lesbarer zu machen:

```python
from typing import List, Tuple

Koordinaten = Tuple[float, float]
Pfad = List[Koordinaten]
```

## 8    Generics

Generics ermöglichen es, die Typsicherheit zu verbessern, indem man Typen nicht fest vorgibt, sondern parametrisierbar macht.

Sie werden genutzt, um auszudrücken, welche Datentypen eine Funktion oder Klasse erwartet und zurückgibt, ohne auf einen konkreten Typ festgelegt zu sein.

**Beispiel:**

```python
from typing import TypeVar, List

T = TypeVar('T')  # generischer Typ

def first(items: List[T]) -> T:
    return items[0]

print(first([1, 2, 3]))        # int
print(first(['a', 'b', 'c']))  # str
```

 Die Funktion `first()` kann mit Listen beliebiger Typen arbeiten, der Rückgabewert passt sich dem jeweiligen Typ an.

**Vorteile von Generics?**

- Wiederverwendbarer Code mit genauer Typprüfung
- Vermeidet Fehler, die bei gemischten Datentypen auftreten
- Bessere Unterstützung in IDEs & für Autocomplete

### 8.1    Generics in Klassen

Generics können nicht nur in Funktionen, sondern auch in Klassen verwendet werden, um flexibel mit unterschiedlichen Datentypen zu arbeiten. Dabei wird ein Typparameter definiert, der den Typ von Attributen, Parametern oder Rückgabewerten innerhalb der Klasse repräsentiert. So kann dieselbe Klassendefinition für verschiedene konkrete Typen wiederverwendet werden, ohne die Typprüfung zu verlieren.

**Beispiel:**

```python
from typing import Generic, TypeVar

T = TypeVar('T')

class Box(Generic[T]):
    def __init__(self, content: T):
        self.content = content

    def get(self) -> T:
        return self.content

b1 = Box(123)      # Box[int]
b2 = Box('Hallo')  # Box[str]
```

Die Klasse `Box` ist generisch und nimmt einen Typparameter `T` an. Wird ein Objekt der Klasse erzeugt, bestimmt der tatsächliche Typ des Inhalts (`int`, `str`, …) automatisch den Typ für `T`. Dadurch weiß der Type Checker und auch die IDE, welchen konkreten Typ die Methode `get()` zurückgibt. Das verbessert Autovervollständigung und verhindert Typfehler zur Entwicklungszeit.

### 8.2    TypeVar mit Einschränkungen (bound und constraints)

In manchen Situationen soll ein generischer Typ nur bestimmte Typen erlauben. Dafür bietet `TypeVar` zwei Möglichkeiten: `bound` und constraints:

- Mit `bound` wird eine Obergrenze festgelegt (z. B. eine Basisklasse oder ein Typ wie `float`).
- Mit constraints dagegen wird eine Menge gültiger Typen definiert, aus denen ausgewählt werden darf.
#### 8.2.1    Bound

`bound` schränkt `TypeVar` so ein, dass nur Instanzen eines bestimmten Typs oder seiner Unterklassen gültig sind. So kann sichergestellt werden, dass alle Operationen, die auf diesem Typ ausgeführt werden, garantiert verfügbar sind. Das ist besonders nützlich, wenn Funktionen mit bestimmten Eigenschaften oder Methoden arbeiten sollen.

**Beispiel:**

```python
from typing import TypeVar

T = TypeVar('T', bound=float)

def multiply(x: T, factor: float) -> T:
    return x * factor
```

`T` darf nur `float` oder davon abgeleitete Typen sein. Durch `bound=float` kann `T` z. B. nicht `str` oder `list` sein. Wird ein anderer Typ übergeben, erkennt der Type Checker dies als Fehler.

#### 8.2.2    Constraints

`constraints` wird verwendet, um eine Auswahl fest definierter Datentypen zu erlauben. Anders als bei `bound` liegt hier kein typisches Vererbungs-Beziehungskonzept zugrunde, sondern eine Liste akzeptierter Typen.

**Beispiel:**

```python
U = TypeVar('U', int, float)

def add(a: U, b: U) -> U:
    return a + b
```

Hier darf `U` nur `int` oder `float` sein. Ein Aufruf wie `add('a', 'b')` wäre ein Typfehler, auch wenn die Operation zur Laufzeit funktionieren würde – somit wird Typunsicherheit vermieden.

### 8.3    Mehrere Typparameter (`Generic[T, U]`)

Manchmal benötigen Klassen oder Funktionen mehr als einen generischen Typ. Ein typisches Beispiel ist eine Datenstruktur, die Schlüssel und Werte speichert (analog zu `dict`). Mit mehreren Typparametern lassen sich Abhängigkeiten zwischen mehreren Typen genau definieren.

**Beispiel:**

```python
from typing import Generic, TypeVar

T = TypeVar('T')
U = TypeVar('U')

class Pair(Generic[T, U]):
    def __init__(self, first: T, second: U):
        self.first = first
        self.second = second

    def get_first(self) -> T:
        return self.first

    def get_second(self) -> U:
        return self.second


p1 = Pair('Anna', 37)  # Pair[str, int]
p2 = Pair(3.14, True)  # Pair[float, bool]
```

- Pair akzeptiert zwei unterschiedliche generische Typen.
- Beim Erzeugen eines Objekts entscheidet sich, welche konkreten Typen `T` und `U` annehmen.
- Methoden kennen jeweils den passenden Rückgabetyp. Das verbessert Autovervollständigung und Typprüfung

**Einsatzbeispiele:**

- Schlüssel-Wert-Paare
  z. B. Cache oder Konfiguration
- Vergleichsergebnisse
  z. B. `Result`, `Error`
- Wrapper für zwei verschiedenartige Daten
  z. B. DB-Record + Metadaten

**Beispiel für generische Mapping-Struktur:**

```python
from typing import Generic, TypeVar, Dict

K = TypeVar('K')
V = TypeVar('V')

class Storage(Generic[K, V]):
    def __init__(self):
        self.data: Dict[K, V] = {}

    def add(self, key: K, value: V) -> None:
        self.data[key] = value

    def get(self, key: K) -> V:
        return self.data[key]


s = Storage[str, int]()
s.add('Age', 30)
print(s.get('Age'))
```

`TypeVar('K')` und `TypeVar('V')` definieren zwei generische Typparameter für Schlüssel und Werte. Durch `class Storage(Generic[K, V])` wird die Klasse so parametrisierbar, dass sie mit beliebigen Typkombinationen verwendet werden kann. Das interne `Dictionary Dict[K, V]` speichert Werte vom Typ `V` unter Schlüsseln vom Typ `K`. Die Methoden `add()` und `get()` übernehmen und liefern konsistent diese Typen. Beim Erzeugen der Instanz (`Storage[str, int]`) werden die konkreten Typen festgelegt, wodurch Typsicherheit und bessere IDE-Unterstützung erreicht werden.

### 8.4    Generics bei `Dict`, `List`, `Tuple`

Viele eingebaute Python-Datentypen unterstützen Generics standardmäßig. Es kann festgelegt werden, welche Typen Elemente enthalten sollen. Dadurch erkennt der Type Checker z. B., ob ein falscher Wert in eine Liste geschrieben wird oder ob auf ein Dictionary mit einem falschen Schlüsseltyp zugegriffen wird.

**Beispiel:**

```python
from typing import Dict, List, Tuple

numbers: List[int] = [1, 2, 3]
person: Tuple[str, int] = ('Max', 32)
scores: Dict[str, float] = {'Anna': 1.3, 'Benjamin': 2.0}
```

### 8.5    TypedDict und Protocol (erweiterte Typsystem-Funktionen)

Neben Generics stellt die `typing`-Bibliothek weitere Mechanismen zur Verfügung, um komplexere Strukturen und Schnittstellen präzise zu typisieren. Dazu gehören `TypedDict` für strukturiertes Arbeiten mit Dictionaries sowie `Protocol` für strukturelle Typprüfung (ähnlich zu Interfaces in anderen Sprachen).

#### 8.5.1    TypedDict

`TypedDict` ermöglicht das Definieren von Dictionaries mit festen Schlüsselnamen und Wert-typen. Damit lässt sich verhindern, dass Keys fehlen, vertauscht werden oder Werte falscher Typen enthalten.

**Beispiel:**

```python
from typing import TypedDict

class Person(TypedDict):
    name: str
    age: int

p: Person = {'name': 'Tom', 'age': 30}
```

Die IDE weiß so, welche Felder vorhanden sein müssen und welche Typen zugeordnet sind.

#### 8.5.2    Protocol (duck typing + Typprüfung)

Protocol ermöglicht strukturelle Typprüfung, d. h. es muss nicht eine Klasse explizit erben, sondern nur die geforderten Methoden bereitstellen (ähnlich Duck Typing: "wenn es aussieht wie eine Ente…"). Dadurch können generische Funktionen definiert werden, die mit beliebigen Objekten arbeiten, solange sie die erwartete Signatur besitzen.

**Beispiel:**

```python
from typing import Protocol

class Flyer(Protocol):
    def fly(self) -> None:
        ...

class Bird:
    def fly(self) -> None:
        print('Flap!')

def start(f: Flyer):
    f.fly()

start(Bird())
```

Bird erfüllt das Protocol automatisch, ohne explizite Vererbung.

### 8.6    Zusammenfassung

| Konzept     | Bedeutung                      |
| ----------- | ------------------------------ |
| `TypeVar`     | generischer Typ                |
| `Generic[T]`  | Klasse/Funktion ist generisch  |
| `bound=`      | Typ auf Obergrenze beschränken |
| `constraints` | Liste erlaubter Typen          |
| `Protocol`    | strukturelle Typprüfung        |
| `TypedDict`   | typisierte Dictionaries        |

## 9    Warum Typannotationen verwenden?

- **Lesbarkeit**: Andere Entwickler verstehen schneller, was erwartet wird.
- **Wartbarkeit**: Änderungen im Code sind leichter nachzuvollziehen.
- **Fehlervermeidung**: Tools wie Mypy, Pyright/Pylance oder IDEs können Fehler frühzeitig erkennen.
- **Dokumentation**: Typen fungieren als explizite Dokumentation des Codes.

> [!warning] Kein Zwang zur Typisierung
> Python bleibt trotz Typannotationen dynamisch. Die Typangaben werden zur Laufzeit **nicht** erzwungen. Sie dienen lediglich als Hilfe für Entwickler und Werkzeuge.
> ```python
> def echo(text: str) -> str:
> 	return text
>
> # Funktioniert trotzdem, obwohl ein falscher Typ übergeben wird
> print(echo(123))  # Ausgabe: 123
> ```

## 10    Typenvergleich

Typen vergleichen kann man mit den Funktionen `type()` und `isinstance()`.

**Beispiel:**

```python
from collections import namedtuple

Point = namedtuple('Punkt', ['x', 'y'])
p = Point(2, 3)

if type(p) == tuple:
    print('P ist ein Tupel.')  # Wird nicht ausgegeben!

if isinstance(p, tuple):
    print('P ist ein Tupel.')
```

> [!tip]
> Es ist in der Regel besser, `isinstance()` anstelle eines direkten Vergleichs mit `type()` zu verwenden, weil `isinstance()` auch Vererbungen berücksichtigt.

- `type()` gibt die exakte Klasse des Objekts `p` zurück, nämlich `Point`. Daher wird in dem Beispiel der Vergleich falsch ausgewertet.
- `isinstance()` überprüft, ob `p` eine Instanz von `tuple` **oder einer Unterklasse davon** ist. Da `namedtuple` eine Unterklasse von `tuple` ist, gibt i`sinstance(p, tuple)` **`True`** zurück.

Siehe auch: [[objektorientierung#1 `type()`, `isinstance()`, `issubclass()`|type(), isinstance() und issubclass()]].

## 11    Static Type Checking Tools

Typannotationen allein werden von Python zur Laufzeit nicht überprüft. Um Typfehler bereits vor der Ausführung zu finden, nutzt man **Static Type Checker** wie mypy oder Pyright.

### 11.1    mypy – Der Standard Type Checker

mypy ist der offizielle und am weitesten verbreitete Type Checker für Python.

**Installation:**

```bash
pip install mypy
```

**Grundlegende Verwendung:**

```python
# example.py
def greet(name: str) -> str:
    return f'Hello, {name}'

result: int = greet('Alice')  # Typfehler!
```

```bash
# Type Checking ausführen
mypy example.py
```

**Ausgabe:**

```
example.py:4: error: Incompatible types in assignment (expression has type 'str', variable has type 'int')
Found 1 error in 1 file (checked 1 source file)
```

### 11.2    Konfiguration mit `mypy.ini` oder `pyproject.toml`

**mypy.ini:**

```ini
[mypy]
python_version = 3.10
warn_return_any = True
warn_unused_configs = True
disallow_untyped_defs = True
disallow_any_unimported = True
no_implicit_optional = True
warn_redundant_casts = True
warn_unused_ignores = True
warn_no_return = True
check_untyped_defs = True

# Pro Modul konfigurieren
[mypy-pandas.*]
ignore_missing_imports = True

[mypy-numpy.*]
ignore_missing_imports = True
```

**pyproject.toml:**

```toml
[tool.mypy]
python_version = '3.10'
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true

[[tool.mypy.overrides]]
module = 'pandas.*'
ignore_missing_imports = true
```

### 11.3    Wichtige mypy-Optionen

| Option                      | Bedeutung                                              |
| --------------------------- | ------------------------------------------------------ |
| `--strict`                  | Aktiviert alle strengen Checks                         |
| `--ignore-missing-imports`  | Ignoriert fehlende Type Stubs von Drittbibliotheken   |
| `--disallow-untyped-defs`   | Verlangt Typen für alle Funktionsdefinitionen          |
| `--check-untyped-defs`      | Prüft auch Funktionen ohne Typannotationen            |
| `--warn-return-any`         | Warnt bei `Any` als Rückgabetyp                        |
| `--show-error-codes`        | Zeigt Error-Codes (z.B. `[assignment]`)                |

### 11.4    Type Stubs für Drittbibliotheken

Viele Bibliotheken haben keine eingebauten Typannotationen. Dafür gibt es separate Type Stubs.

```bash
# Type Stubs installieren
pip install types-requests
pip install types-PyYAML
pip install pandas-stubs
```

**Typeshed:** Zentrale Sammlung von Type Stubs für die Standardbibliothek und populäre Packages
- Wird automatisch mit mypy installiert
- Repository: https://github.com/python/typeshed

### 11.5    Inline Type Ignores

Manchmal ist man sich sicher, dass der Code korrekt ist, auch wenn mypy warnt:

```python
from typing import Any

def process_data(data: Any) -> int:
    # mypy würde hier warnen, aber wir wissen, dass data eine Zahl ist
    return data + 1  # type: ignore[operator]

# Gesamte Zeile ignorieren
result = some_complex_function()  # type: ignore

# Nur bestimmte Error-Codes ignorieren
value = int('123')  # type: ignore[arg-type]
```

### 11.6    Pyright / Pylance – Microsoft's Type Checker

Pyright ist ein schneller, moderner Type Checker von Microsoft, integriert in VS Code als Pylance.

**Installation:**

```bash
pip install pyright

# Oder als npm-Package (schneller)
npm install -g pyright
```

**Verwendung:**

```bash
pyright src/
```

**Konfiguration (pyrightconfig.json):**

```json
{
  'include': ['src'],
  'exclude': ['**/node_modules', '**/__pycache__'],
  'typeCheckingMode': 'strict',
  'pythonVersion': '3.10',
  'reportMissingImports': true,
  'reportMissingTypeStubs': false
}
```

**In pyproject.toml:**

```toml
[tool.pyright]
include = ['src']
exclude = ['**/node_modules', '**/__pycache__']
typeCheckingMode = 'strict'
pythonVersion = '3.10'
```

### 11.7    mypy vs. Pyright

| Kriterium           | mypy                          | Pyright                       |
| ------------------- | ----------------------------- | ----------------------------- |
| Performance         | ⚠️ Langsamer                  | ✅ Sehr schnell               |
| Standard-Konformität| ✅ Referenz-Implementation    | ✅ Sehr gut                   |
| VS Code Integration | ⚠️ Extension nötig            | ✅ Native (Pylance)           |
| Konfiguration       | ✅ Sehr flexibel              | ✅ Gut                        |
| Community           | ✅ Größer                     | ✅ Wachsend                   |
| Empfohlen für       | CI/CD, Commandline            | VS Code, IDE-Integration      |

### 11.8    Integration in CI/CD

**GitHub Actions:**

```yaml
name: Type Check

on: [push, pull_request]

jobs:
  mypy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.10'

      - name: Install dependencies
        run: |
          pip install mypy types-requests

      - name: Run mypy
        run: mypy src/
```

**Pre-commit Hook:**

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.5.0
    hooks:
      - id: mypy
        additional_dependencies: [types-requests, types-PyYAML]
```

### 11.9    Graduelle Typisierung

Man muss nicht das gesamte Projekt auf einmal typisieren:

```python
# Schritt 1: Keine Typen (Status Quo)
def calculate(x, y):
    return x + y

# Schritt 2: Partielle Typisierung
def calculate(x: int, y: int):
    return x + y

# Schritt 3: Vollständige Typisierung
def calculate(x: int, y: int) -> int:
    return x + y
```

**Strategie für große Projekte:**

1. Kritische/neue Module zuerst typisieren
2. `# type: ignore` für Legacy-Code nutzen
3. Schrittweise strengere mypy-Optionen aktivieren
4. Test-Code kann weniger streng sein

### 11.10    Häufige Type Checker Fehler

**Fehler: `Incompatible return value type`**

```python
def get_name() -> str:
    return None  # Fehler!

# Lösung: Optional verwenden
from typing import Optional

def get_name() -> Optional[str]:
    return None  # OK
```

**Fehler: `Argument has incompatible type`**

```python
def greet(name: str) -> None:
    print(f'Hello, {name}')

greet(123)  # Fehler!

# Lösung: Richtigen Typ übergeben
greet('Alice')
```

**Fehler: `Missing type parameters`**

```python
from typing import List

def process(items: List):  # Fehler! List[?]
    pass

# Lösung: Typ-Parameter angeben
def process(items: List[int]) -> None:
    pass
```

### 11.11    Best Practices

**✅ DO:**

- Type Checker in CI/CD Pipeline integrieren
- Neue Module vollständig typisieren
- `strict` Mode für neue Projekte aktivieren
- Type Stubs für Dependencies installieren
- Pre-commit Hooks verwenden

**❌ DON'T:**

- Typen nur hinzufügen, um mypy zufriedenzustellen
- Überall `Any` verwenden (verliert Typsicherheit)
- Type Checking bei Tests vernachlässigen
- `# type: ignore` ohne Grund nutzen

### 11.12    Weitere Tools

**Pytype (Google):**

```bash
pip install pytype
pytype src/
```

- Inferiert Typen automatisch
- Weniger strikte als mypy
- Gut für Legacy-Code

**Pyre (Meta):**

```bash
pip install pyre-check
pyre check
```

- Fokus auf Performance
- Inkrementelles Type Checking
- Hauptsächlich für große Codebases

### 11.13    Zusammenfassung

| Tool    | Verwendung                                    |
| ------- | --------------------------------------------- |
| mypy    | Standard Type Checker, CLI, CI/CD             |
| Pyright | Schneller Checker, VS Code Integration        |
| Type Stubs | Typen für Drittbibliotheken                |
| `# type: ignore` | Einzelne Warnungen unterdrücken         |

Type Checking ist ein Werkzeug zur Verbesserung der Code-Qualität, kein Selbstzweck. Beginne mit lockeren Einstellungen und erhöhe die Strenge schrittweise.

## 12    Fazit

Typannotationen machen Python-Code robuster, verständlicher und besser wartbar, ohne die Flexibilität der Sprache einzuschränken. Es lohnt sich, sie konsequent zu verwenden, besonders bei größeren Projekten.
