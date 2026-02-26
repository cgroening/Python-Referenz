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

```python
a = 1
b = 2

kommentar = 'a ist größer als b' if a > b else 'a ist kleiner als b'
print(kommentar)  # a ist kleiner als b
```

### 1.4    ShortHand Ternary

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
            return 'Not Found'
        case 500:
            return 'Internal Server Error'
        case _:  # Wildcard (default)
            return 'Unknown Status'

print(http_status(404))  # Not Found
```

### 3.2    Mehrere Werte (OR Patterns)
```python
def classify_http_status(status):
    match status:
        case 200 | 201 | 204:
            return 'Success'
        case 400 | 401 | 403 | 404:
            return 'Client Error'
        case 500 | 502 | 503:
            return 'Server Error'
        case _:
            return 'Unknown'

print(classify_http_status(201))  # Success
```

### 3.3    Guards (if-Bedingungen)
```python
age = 50

match age:
    case _ if age < 0:
        msg = 'Invalid age'
    case _ if age < 18:
        msg = 'Minor'
    case _ if age < 67:
        msg = 'Adult'
    case _ if age < 150:
        msg = 'Senior'
    case _:
        msg = 'Invalid age'

print(msg)  # Adult
```

### 3.4    Sequence Patterns (Listen, Tupel)
```python
# Listen/Tupel matchen
point = (0, 5)

match point:
    case (0, 0):
        print('Origin')
    case (0, y):
        print(f'On Y-axis at y={y}')
    case (x, 0):
        print(f'On X-axis at x={x}')
    case (x, y):
        print(f'Point at ({x}, {y})')

# Output: On Y-axis at y=5
```

**Variable-length Patterns:**
```python
data = [1, 2, 3, 4, 5]

match data:
    case []:
        print('Empty list')
    case [x]:
        print(f'Single element: {x}')
    case [x, y]:
        print(f'Two elements: {x}, {y}')
    case [first, *rest]:
        print(f'First: {first}, Rest: {rest}')

# Output: First: 1, Rest: [2, 3, 4, 5]
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
        print(f'4D+: First three {x}, {y}, {z}')

# Output: 3D: 10, 20, 30
```

### 3.5    Mapping Patterns (Dictionaries)
```python
user = {'name': 'Alice', 'age': 30, 'role': 'admin'}

match user:
    case {'role': 'admin', 'name': name}:
        print(f'Admin user: {name}')
    case {'role': 'user', 'name': name}:
        print(f'Regular user: {name}')
    case {'name': name}:
        print(f'User without role: {name}')

# Output: Admin user: Alice
```

**Wichtig:** Dictionaries matchen partial (zusätzliche Keys werden ignoriert):
```python
data = {'type': 'point', 'x': 10, 'y': 20, 'color': 'red'}

match data:
    case {'type': 'point', 'x': x, 'y': y}:
        print(f'Point at ({x}, {y})')
        # 'color' wird ignoriert

# Output: Point at (10, 20)
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
        print(f'Circle at origin with radius {r}')
    case Circle(center=Point(x=x, y=y), radius=r):
        print(f'Circle at ({x}, {y}) with radius {r}')

# Output: Circle at origin with radius 5
```

**Kürzere Syntax:**
```python
match shape:
    case Circle(Point(0, 0), r):
        print(f'Circle at origin with radius {r}')
    case Circle(Point(x, y), r):
        print(f'Circle at ({x}, {y}) with radius {r}')
```

### 3.7    AS Patterns (Capture Whole + Parts)

Mit `as` kann man sowohl das Gesamtobjekt als auch Teile davon erfassen:
```python
data = [1, 2, 3, 4]

match data:
    case [x, *rest] as full_list:
        print(f'First: {x}')
        print(f'Rest: {rest}')
        print(f'Full list: {full_list}')

# Output:
# First: 1
# Rest: [2, 3, 4]
# Full list: [1, 2, 3, 4]
```

### 3.8    Verschachtelte Patterns
```python
command = ('move', {'x': 10, 'y': 20})

match command:
    case ('move', {'x': x, 'y': y}):
        print(f'Move to ({x}, {y})')
    case ('resize', {'width': w, 'height': h}):
        print(f'Resize to {w}x{h}')
    case ('rotate', {'angle': angle}):
        print(f'Rotate by {angle}°')

# Output: Move to (10, 20)
```

### 3.9    Praktische Beispiele

#### 3.9.1    JSON-API Response Handling
```python
def handle_response(response):
    match response:
        case {'status': 'success', 'data': data}:
            return f'Success: {data}'

        case {'status': 'error', 'code': 404}:
            return 'Resource not found'

        case {'status': 'error', 'code': code, 'message': msg}:
            return f'Error {code}: {msg}'

        case {'status': 'error'}:
            return 'Unknown error'

        case _:
            return 'Invalid response format'

# Test
print(handle_response({'status': 'success', 'data': {'id': 1}}))
print(handle_response({'status': 'error', 'code': 500, 'message': 'Server error'}))
```

#### 3.9.2    Command Parser
```python
def execute_command(cmd):
    match cmd.split():
        case ['quit'] | ['exit']:
            return 'Exiting...'

        case ['help']:
            return 'Available commands: help, quit, list, add, delete'

        case ['list']:
            return 'Listing all items...'

        case ['add', item]:
            return f'Adding {item}'

        case ['add', *items]:
            return f'Adding multiple items: {items}'

        case ['delete', item]:
            return f'Deleting {item}'

        case _:
            return 'Unknown command'

print(execute_command('add apple'))          # Adding apple
print(execute_command('add apple banana'))   # Adding multiple items: ['apple', 'banana']
```

#### 3.9.3    AST-ähnliche Strukturen
```python
from dataclasses import dataclass

@dataclass
class BinaryOp:
    op: str
    left: any
    right: any

@dataclass
class Constant:
    value: int

def evaluate(expr):
    match expr:
        case Constant(value):
            return value

        case BinaryOp('+', left, right):
            return evaluate(left) + evaluate(right)

        case BinaryOp('-', left, right):
            return evaluate(left) - evaluate(right)

        case BinaryOp('*', left, right):
            return evaluate(left) * evaluate(right)

        case _:
            raise ValueError(f'Unknown expression: {expr}')

# Test: (2 + 3) * 5
expr = BinaryOp('*',
    BinaryOp('+', Constant(2), Constant(3)),
    Constant(5)
)

print(evaluate(expr))  # 25
```

#### 3.9.4    Event Handler
```python
def handle_event(event):
    match event:
        case {'type': 'click', 'x': x, 'y': y, 'button': 'left'}:
            print(f'Left click at ({x}, {y})')

        case {'type': 'click', 'x': x, 'y': y, 'button': 'right'}:
            print(f'Right click at ({x}, {y})')

        case {'type': 'keypress', 'key': 'Enter'}:
            print('Enter pressed')

        case {'type': 'keypress', 'key': key, 'ctrl': True}:
            print(f'Ctrl+{key} pressed')

        case {'type': 'scroll', 'delta': delta} if delta > 0:
            print('Scrolling up')

        case {'type': 'scroll', 'delta': delta} if delta < 0:
            print('Scrolling down')

handle_event({'type': 'click', 'x': 100, 'y': 200, 'button': 'left'})
handle_event({'type': 'keypress', 'key': 'S', 'ctrl': True})
```

### 3.10    Best Practices

**✅ DO:**
- Nutze Pattern Matching für komplexe Datenstrukturen
- Verwende Guards für zusätzliche Bedingungen
- Ordne Patterns von spezifisch zu allgemein
- Nutze `_` als Wildcard/Default-Case

**❌ DON'T:**
- Verwende nicht `match` für einfache if-elif-Ketten
- Vermeide zu komplexe, verschachtelte Patterns
- Default-Case (`case _:`) nicht vergessen

### 3.11    Pattern Matching vs. if-elif

**Wann `match` verwenden:**
```python
# ✅ Gut für strukturelle Daten
match point:
    case (0, 0): return 'Origin'
    case (x, 0): return f'X-axis: {x}'
    case (0, y): return f'Y-axis: {y}'
    case (x, y): return f'Point: ({x}, {y})'
```

**Wann `if-elif` verwenden:**
```python
# ✅ Besser für einfache Vergleiche
if age < 18:
    return 'Minor'
elif age < 65:
    return 'Adult'
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

### 4.1    `for`

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


### 4.2    `while`

```python
i = 0
m = 3

while i <= m:
    print(i)
    i += 1
```

```python
i = 0
m = 3
run = True

while run:
    print(i)
    if i == m: run = False
    i += 1
```

```python
i = 0
m = 3

while True:
    print(i)
    if i == m: break
    i += 1
```
