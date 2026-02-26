# Kontrollstrukturen

## 1    Bedingungen

### 1.1    `if`, `elif` und `else`

```python
a = 1
b = 2

if a > b:
    print('a ist größer als b')
elif a < b:  # = elseif bzw. else if in anderen Sprachen
    print('a ist kleiner als b')
else:
    print('a ist gleich b')
```

Häufig kann man direkte Vergleiche weglassen:

```python
check = True
string = 'Text'

if check is True:
    print('Bedingung erfüllt.')

if len(string) != 0:
    print('String ist nicht leer.')

# Kürzer:
if check:
    print('Bedingung erfüllt.')

if string:
    print('String ist nicht leer.')
```

### 1.2    Shorthand

```python
a = 1
b = 2

if a < b: print('a ist kleiner als b')
```

### 1.3    Ternary operators (conditional expressions)

TODO: Kurze Erklärung

```python
a = 1
b = 2

kommentar = 'a ist größer als b' if a > b else 'a ist kleiner als b'
print(kommentar)  # a ist kleiner als b
```

### 1.4    ShortHand Ternary

TODO: Kurze Erklärung

**Beispiel 1:**

```python
print( True or 'Some' )  # True
```

**Beispiel 2:**

```python
print( False or 'Some' )  # Some
```

**Beispiel 3:**

```python
output = None
msg = output or 'Keine Daten'
print(msg)  # Keine Daten
```

## 2    `Switch`-`Case`-Äquivalent für Python-Version < 3.10

Vor Python-Version 3.10 gibt es keine `Switch`-`Case`-Anweisung, sie muss simuliert werden:

```python
def switcher(age):
    if age < 18:
        msg = 'Minderjährig'
    elif age < 67:
        msg = 'Volljährig'
    elif age in range(0, 150):
        msg = 'Rentner'
    else:
        msg = 'Fehler'

    return msg

print(switcher(50))  # Volljährig
```

## 3    Pattern Matching mit `match`-`case` (Python 3.10+)

Seit Python 3.10 gibt es strukturelles Pattern Matching mit `match`-`case`. Dies ist deutlich mächtiger als einfache Switch-Case-Statements aus anderen Sprachen.

### 3.1    Einfaches Matching (Literal Patterns)

```python
def http_status(status):
    match status:
        case 200:
            return 'OK'
        case 404:
            return 'Nicht gefunden'
        case 500:
            return 'Interner Serverfehler'
        case _:  # Wildcard (Standard)
            return 'Unbekannter Status'

print(http_status(404))  # Nicht gefunden
```

### 3.2    Mehrere Werte (`OR`-Patterns)

```python
def classify_http_status(status):
    match status:
        case 200 | 201 | 204:
            return 'Erfolgreich'
        case 400 | 401 | 403 | 404:
            return 'Client-Fehler'
        case 500 | 502 | 503:
            return 'Server-Fehler'
        case _:
            return 'Unbekannt'

print(classify_http_status(201))  # Erfolgreich
```

### 3.3    Guards (`if`-Bedingungen)

```python
age = 50

match age:
    case _ if age < 0:
        msg = 'Ungültiges Alter'
    case _ if age < 18:
        msg = 'Minderjähriger'
    case _ if age < 67:
        msg = 'Erwachsener'
    case _ if age < 150:
        msg = 'Rentner'
    case _:
        msg = 'Ungültiges Alter'

print(msg)  # Erwachsener
```

### 3.4    Sequence Patterns (Listen, Tupel)

```python
# Listen/Tupel matchen
point = (0, 5)

match point:
    case (0, 0):
        print('Ursprung')
    case (0, y):
        print(f'Auf y-Achse bei y={y}')
    case (x, 0):
        print(f'Auf x-Achse bei x={x}')
    case (x, y):
        print(f'Punkt auf ({x}, {y})')

# Ausgabe: Aus y-Achse bei y=5
```

**Variable-length Patterns:**

```python
data = [1, 2, 3, 4, 5]

match data:
    case []:
        print('Leere Liste')
    case [x]:
        print(f'Einzelnes Element: {x}')
    case [x, y]:
        print(f'Zwei Elemente: {x}, {y}')
    case [first, *rest]:
        print(f'Erstes: {first}, Rest: {rest}')

# Ausgabe: Erstes: 1, Rest: [2, 3, 4, 5]
```

**Exakte Länge mit Wildcard:**

```python
coordinates = (10, 20, 30)

match coordinates:
    case (x, y):
        print(f'2D: {x}, {y}')
    case (x, y, z):
        print(f'3D: {x}, {y}, {z}')
    case (x, y, z, _):
        print(f'4D+: Erste drei {x}, {y}, {z}')

# Ausgabe: 3D: 10, 20, 30
```

### 3.5    Mapping Patterns (Dictionaries)

```python
user = {'name': 'Alice', 'age': 30, 'role': 'admin'}

match user:
    case {'role': 'admin', 'name': name}:
        print(f'Administrator: {name}')
    case {'role': 'user', 'name': name}:
        print(f'Normaler Benutzer: {name}')
    case {'name': name}:
        print(f'Benutzer ohne Rolle: {name}')

# Ausgabe: Administrator: Alice
```

**Wichtig:** Dictionaries matchen partial (zusätzliche Keys werden ignoriert):

```python
data = {'type': 'point', 'x': 10, 'y': 20, 'color': 'red'}

match data:
    case {'type': 'point', 'x': x, 'y': y}:
        print(f'Punkt bei ({x}, {y})')
        # 'color' wird ignoriert

# Ausgabe: Punkt bei (10, 20)
```

### 3.6    Class Patterns (Strukturelles Matching)

```python
from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int

@dataclass
class Circle:
    center: Point
    radius: int

shape = Circle(Point(0, 0), 5)

match shape:
    case Circle(center=Point(x=0, y=0), radius=r):
        print(f'Kreis im Ursprung mit Radius {r}')
    case Circle(center=Point(x=x, y=y), radius=r):
        print(f'Kreis bei ({x}, {y}) mit Radius {r}')

# Ausgabe: Kreis im Ursprung mit Radius 5
```

**Kürzere Syntax:**

```python
match shape:
    case Circle(Point(0, 0), r):
        print(f'Kreis im Ursprung mit Radius {r}')
    case Circle(Point(x, y), r):
        print(f'Kreis bei ({x}, {y}) mit Radius {r}')
```

### 3.7    AS Patterns (Capture Whole + Parts)

Mit `as` kann man sowohl das Gesamtobjekt als auch Teile davon erfassen:

```python
data = [1, 2, 3, 4]

match data:
    case [x, *rest] as full_list:
        print(f'Erstes: {x}')
        print(f'Rest: {rest}')
        print(f'Gesamte Liste: {full_list}')

# Ausgabe:
# Erstes: 1
# Rest: [2, 3, 4]
# Gesamte Liste: [1, 2, 3, 4]
```

### 3.8    Verschachtelte Patterns

```python
command = ('move', {'x': 10, 'y': 20})

match command:
    case ('move', {'x': x, 'y': y}):
        print(f'Bewege zu ({x}, {y})')
    case ('resize', {'width': w, 'height': h}):
        print(f'Skaliere auf {w}x{h}')
    case ('rotate', {'angle': angle}):
        print(f'Drehe um {angle}°')

# Ausgabe: Bewege zu (10, 20)
```

### 3.10    Best Practices

**✅ DO:**

- Nutze Pattern Matching für komplexe Datenstrukturen
- Verwende Guards für zusätzliche Bedingungen
- Ordne Patterns von spezifisch zu allgemein
- Nutze `_` als Wildcard/Default-Case

**❌ DON'T:**

- Verwende nicht `match` für einfache `if`-elif-Ketten
- Vermeide zu komplexe, verschachtelte Patterns
- Default-Case (`case _:`) nicht vergessen

### 3.11    Pattern Matching vs. `if`-`elif`

**Wann `match` verwenden:**

```python
# Gut für strukturelle Daten
match point:
    case (0, 0): return 'Ursprung'
    case (x, 0): return f'x-Achse: {x}'
    case (0, y): return f'y-Achse: {y}'
    case (x, y): return f'Punkt: ({x}, {y})'
```

**Wann `if-elif` verwenden:**

```python
# Besser für einfache Vergleiche
if age < 18:
    return 'Minderjährig'
elif age < 65:
    return 'Erwachsen'
else:
    return 'Senior'
```

### 3.12    Zusammenfassung

| Pattern-Typ       | Beispiel                                  | Verwendung                     |
| ----------------- | ----------------------------------------- | ------------------------------ |
| Literal           | `case 200:`                               | Exakter Wert                   |
| Wildcard          | `case _:`                                 | Match alles (default)          |
| Capture           | `case x:`                                 | Wert in Variable speichern     |
| OR                | `case 200 \| 201 \| 204:`                 | Mehrere Werte                  |
| Sequence          | `case [x, y, z]:`                         | Listen/Tupel mit fester Länge  |
| Sequence (rest)   | `case [first, *rest]:`                    | Variable Länge                 |
| Mapping           | `case {'key': value}:`                    | Dictionaries                   |
| Class             | `case Point(x, y):`                       | Objekte/Dataclasses            |
| Guard             | `case x if x > 0:`                        | Zusätzliche Bedingung          |
| AS                | `case [x, *rest] as full:`                | Ganzes + Teile erfassen        |

## 4    Schleifen

### 4.1    `for`-Schleifen

```python
L = [0, 1, 2, 3]
count = len(L)

# von 0 bis count-1
for i in range(count):
    print(L[i], end=', ' if i < count-1 else '\n')  # 0, 1, 2, 3

# von 1 bis count-1
for i in range(1, count):
    print(L[i], end=', ' if i < count-1 else '\n')  # 1, 2, 3

# von 0 bis count-1 mit Schrittweite 2
for i in range(0, count, 2):
    print(L[i], end=', ' if i < count-2 else '\n')  # 0, 2

# von count-1 bis 0 (rückwärts)
for i in range(count-1, -1, -1):
    print(L[i], end=', ' if i != 0 else '\n')       # 3, 2, 1, 0
```

```python
D = {'A': 1, 'B': 3, 'C': 7}

for key in D:
    print(key, end=' ')  # A, B, C

print('')

for key, value in D.items():
    print(f'{key}={value}', end=' ')  # A=1 B=3 C=7
```

**Mit Zählervariable:**

```python
lst = ['A', 'B', 'C']

for i in range(len(lst)):
    print(lst[i])

# Kürzer:
for value in lst:
    print(value)

# Wird der Index benötigt:
for i, value in enumerate(lst):
    print(f'{i}: {value}')
```

**Bildung eines Iterators mittels `zip()`**:

```python
a = [1, 2, 3]
b = [4, 5, 6]

for i in range(len(a)):
    print(f'{a[i]} und {b[i]}')

# Besser:
for av, bv in zip(a, b):
    print(f'{av} und {bv}')

# Mit Index:
for i, (av, bv) in enumerate(zip(a, b)):
    print(f'{i}: {av} und {bv}')
```

### 4.2    `while`-Schleifen

Mit Zählbedingung:

```python
i = 0
m = 3

while i <= m:
    print(i)
    i += 1
```

Mit Flag:

```python
i = 0
m = 3
run = True

while run:
    print(i)
    if i == m: run = False
    i += 1
```

Endlosschleife mit `break`:

```python
i = 0
m = 3

while True:
    print(i)
    if i == m: break
    i += 1
```
