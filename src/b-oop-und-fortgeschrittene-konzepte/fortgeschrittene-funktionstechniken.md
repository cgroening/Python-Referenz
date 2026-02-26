# Fortgeschrittene Funktionstechniken

Closures, Decorators und verwandte Konzepte sind Kernelemente der funktionalen Programmierung in Python. Sie ermöglichen sauberen, wiederverwendbaren und eleganten Code.

## 1    Closures

Ein Closure ist eine verschachtelte Funktion, die auf Variablen der äußeren Funktion auch nach deren Ausführung noch zugreifen kann. Dadurch entsteht ein erhaltener Zustand ohne Verwendung von Klassen.

### 1.1    Beispiel: Einfaches Closure

```python
def greeting(name):
    # innere Funktion greift auf 'name' zu
    def say_hello():
        print(f'Hallo {name}!')
    return say_hello

greet = greeting('Stefan')
greet()  # Ausgabe: Hallo Stefan!
```

### 1.2    Beispiel: Closure mit Zustand

```python
def counter():
    count = 0
    def increment():
        # Zugriff auf äußere Variable mit nonlocal
        nonlocal count
        count += 1
        return count
    return increment

c = counter()
print(c())  # 1
print(c())  # 2
```

## 2    Lambda-Funktionen

Lambda-Funktionen sind anonyme Funktionen, meist in einer Zeile geschrieben. Sie sind besonders praktisch in Kombination mit [[fortgeschrittene-funktionstechniken#4 map, filter, reduce|map, filter]] und anderen [[fortgeschrittene-funktionstechniken#3 Higher-Order Functions|höherwertigen Funktionen]].

**Syntax:**

```python
lambda arguments: expression
```

**Beispiel:**

```python
add = lambda x, y: x + y
print(add(3, 5))  # 8
```

## 3    Higher-Order Functions

Eine Higher-Order Function ist eine Funktion, die andere Funktionen entgegennimmt oder zurückgibt.

```python
def apply_twice(func, value):
    return func(func(value))

print(apply_twice(lambda x: x + 1, 3))  # 5
```

## 4    `map`, `filter`, `reduce`

- `map(func, iterable)`: Wendet `func` auf jedes Element an.
- `filter(func, iterable)`: Filtert Elemente basierend auf Wahrheitswert von `func`.
- `reduce(func, iterable, initial)`: Akkumuliert alle Elemente zu einem einzigen Wert.

```python
numbers = [1, 2, 3, 4, 5]

# map: Transformation
squared = list(map(lambda x: x**2, numbers))  # [1, 4, 9, 16, 25]

# filter: Bedingung
even = list(filter(lambda x: x % 2 == 0, numbers))  # [2, 4]

# reduce: Akkumulation
from functools import reduce
summed = reduce(lambda acc, x: acc + x, numbers, 0)  # 15
```

### 4.1 `map()` – Transformation anwenden

`map(func, iterable)` wendet eine Funktion auf jedes Element eines Iterables an und gibt einen Iterator zurück.

#### 4.1.1 Grundlagen

```python
# Syntax
map(function, iterable)

# Beispiel: Quadrieren
numbers = [1, 2, 3, 4, 5]
squared = map(lambda x: x**2, numbers)

print(list(squared))  # [1, 4, 9, 16, 25]
```

**Wichtig:** `map()` gibt einen **Iterator** zurück, keine Liste! Daher `list()` verwenden um Ergebnis zu materialisieren.

#### 4.1.2 Mit benannten Funktionen

```python
def celsius_to_fahrenheit(celsius):
    return (celsius * 9/5) + 32

temperatures_c = [0, 10, 20, 30, 40]
temperatures_f = map(celsius_to_fahrenheit, temperatures_c)

print(list(temperatures_f))
# [32.0, 50.0, 68.0, 86.0, 104.0]
```

#### 4.1.3 Mehrere Iterables

`map()` kann mehrere Iterables gleichzeitig verarbeiten:

```python
# Zwei Listen addieren
a = [1, 2, 3]
b = [10, 20, 30]

result = map(lambda x, y: x + y, a, b)
print(list(result))  # [11, 22, 33]

# Drei Listen
x = [1, 2, 3]
y = [10, 20, 30]
z = [100, 200, 300]

result = map(lambda a, b, c: a + b + c, x, y, z)
print(list(result))  # [111, 222, 333]
```

**Verhalten bei unterschiedlicher Länge:**

```python
a = [1, 2, 3]
b = [10, 20]  # Kürzer!

result = map(lambda x, y: x + y, a, b)
print(list(result))  # [11, 22] - stoppt beim kürzesten!
```

#### 4.1.4 Mit String-Methoden

```python
# String-Methoden als Funktion
words = ['hello', 'world', 'python']

# Großbuchstaben
upper = map(str.upper, words)
print(list(upper))  # ['HELLO', 'WORLD', 'PYTHON']

# Kapitalisieren
capitalized = map(str.capitalize, words)
print(list(capitalized))  # ['Hello', 'World', 'Python']

# Länge ermitteln
lengths = map(len, words)
print(list(lengths))  # [5, 5, 6]
```

#### 4.1.5 Mit Type Conversion

```python
# Strings zu Integers
string_numbers = ['1', '2', '3', '4', '5']
integers = map(int, string_numbers)
print(list(integers))  # [1, 2, 3, 4, 5]

# Floats zu Integers
floats = [1.5, 2.7, 3.2]
ints = map(int, floats)
print(list(ints))  # [1, 2, 3]

# Mit float()
strings = ['3.14', '2.71', '1.41']
numbers = map(float, strings)
print(list(numbers))  # [3.14, 2.71, 1.41]
```

#### 4.1.6 Praktische Beispiele

**Daten bereinigen:**

```python
# Whitespace entfernen
raw_data = ['  hello  ', 'world\n', '\tpython  ']
cleaned = map(str.strip, raw_data)
print(list(cleaned))  # ['hello', 'world', 'python']

# Email-Adressen normalisieren
emails = ['Alice@Example.COM', 'bob@TEST.com']
normalized = map(str.lower, emails)
print(list(normalized))  # ['alice@example.com', 'bob@test.com']
```

**Dictionary-Verarbeitung:**

```python
users = [
    {'name': 'Alice', 'age': 30},
    {'name': 'Bob', 'age': 25},
    {'name': 'Charlie', 'age': 35}
]

# Nur Namen extrahieren
names = map(lambda user: user['name'], users)
print(list(names))  # ['Alice', 'Bob', 'Charlie']

# Attribute transformieren
def increment_age(user):
    return {**user, 'age': user['age'] + 1}

older_users = map(increment_age, users)
print(list(older_users))
# [{'name': 'Alice', 'age': 31}, ...]
```

**Nested Data:**

```python
# Matrix transponieren (vereinfacht)
matrix = [[1, 2, 3], [4, 5, 6]]

# Jede Zeile verdoppeln
doubled = map(lambda row: list(map(lambda x: x * 2, row)), matrix)
print(list(doubled))
# [[2, 4, 6], [8, 10, 12]]
```

#### **4.1.7 `map()` vs List Comprehension**

```python
numbers = [1, 2, 3, 4, 5]

# Mit map()
squared_map = list(map(lambda x: x**2, numbers))

# Mit List Comprehension
squared_comp = [x**2 for x in numbers]

print(squared_map == squared_comp)  # True
```

**Wann was verwenden?**

|Situation|Empfehlung|Grund|
|---|---|---|
|Einfache Transformation|List Comprehension|Lesbarer|
|Existierende Funktion anwenden|`map()`|Kürzer|
|Komplexe Logik|List Comprehension|Bessere Kontrolle|
|Mehrere Iterables|`map()`|Explizit designed dafür|
|Performance (große Daten)|`map()`|Lazy Evaluation|
|Type Conversion|`map()`|`map(int, data)` elegant|

**Beispiele:**

```python
# ✅ Gut mit map(): Funktion bereits vorhanden
words = ['hello', 'world']
upper = list(map(str.upper, words))

# ✅ Besser mit List Comprehension: Custom Logic
numbers = [1, 2, 3, 4, 5]
result = [x**2 if x % 2 == 0 else x for x in numbers]

# ✅ Gut mit map(): Mehrere Listen
a = [1, 2, 3]
b = [10, 20, 30]
sums = list(map(lambda x, y: x + y, a, b))

# ✅ Besser mit List Comprehension: Lesbarkeit
numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]  # Klarer als map(lambda x: x**2, numbers)
```

#### 4.1.8 Performance-Vergleich

```python
import timeit

# Setup
numbers = range(1000000)

# map() - Lazy
def test_map():
    return list(map(lambda x: x**2, numbers))

# List Comprehension
def test_comp():
    return [x**2 for x in numbers]

print(timeit.timeit(test_map, number=10))   # ~0.5s
print(timeit.timeit(test_comp, number=10))  # ~0.4s

# List Comprehension ist meist etwas schneller!
```

**Aber:** `map()` ohne `list()` ist **lazy** (spart Speicher):

```python
# map() ohne list() - kein Speicher verbraucht
mapped = map(lambda x: x**2, range(1000000))

# Nur bei Bedarf berechnet
for i, value in enumerate(mapped):
    if i > 5:
        break
    print(value)  # Nur 6 Werte berechnet!
```

### 4.2 `filter()` – Elemente filtern

`filter(func, iterable)` behält nur Elemente, für die `func` `True` zurückgibt.

```python
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Nur gerade Zahlen
even = filter(lambda x: x % 2 == 0, numbers)
print(list(even))  # [2, 4, 6, 8, 10]

# Nur Zahlen > 5
greater_five = filter(lambda x: x > 5, numbers)
print(list(greater_five))  # [6, 7, 8, 9, 10]
```

**Mit benannten Funktionen:**

```python
def is_positive(n):
    return n > 0

numbers = [-2, -1, 0, 1, 2, 3]
positive = filter(is_positive, numbers)
print(list(positive))  # [1, 2, 3]
```

**Ohne Lambda (None als Funktion):**

```python
# filter(None, iterable) filtert 'falsy' Werte
mixed = [0, 1, '', 'hello', None, [], [1, 2], False, True]
truthy = filter(None, mixed)
print(list(truthy))  # [1, 'hello', [1, 2], True]
```

### 4.3 `reduce()` – Akkumulation

`reduce(func, iterable, initial)` aus `functools` reduziert Iterable auf einzelnen Wert.

```python
from functools import reduce

# Summe
numbers = [1, 2, 3, 4, 5]
total = reduce(lambda acc, x: acc + x, numbers)
print(total)  # 15

# Mit Startwert
total = reduce(lambda acc, x: acc + x, numbers, 10)
print(total)  # 25 (10 + 15)

# Produkt
product = reduce(lambda acc, x: acc * x, numbers)
print(product)  # 120

# Maximum finden
maximum = reduce(lambda acc, x: x if x > acc else acc, numbers)
print(maximum)  # 5
```

### 4.4 Kombination von `map()`, `filter()` und `reduce()`

```python
# Pipeline: filter → map → reduce
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# 1. Nur gerade Zahlen
even = filter(lambda x: x % 2 == 0, numbers)

# 2. Quadrieren
squared = map(lambda x: x**2, even)

# 3. Summe bilden
from functools import reduce
total = reduce(lambda acc, x: acc + x, squared)

print(total)  # 220 (4 + 16 + 36 + 64 + 100)

# Als One-Liner
result = reduce(
    lambda acc, x: acc + x,
    map(lambda x: x**2, filter(lambda x: x % 2 == 0, numbers))
)
print(result)  # 220
```

### 4.5 Best Practices

**✅ DO:**

```python
# map() für existierende Funktionen
upper = list(map(str.upper, words))

# filter() für einfache Bedingungen
positive = list(filter(lambda x: x > 0, numbers))

# Lazy Evaluation nutzen
for value in map(expensive_function, huge_list):
    if condition:
        break  # Stoppt früh, spart Rechenzeit
```

**❌ DON'T:**

```python
# Zu verschachtelt
result = list(map(lambda x: x**2, filter(lambda x: x > 0, map(int, data))))

# Besser: List Comprehension oder Zwischenschritte
cleaned = [int(x) for x in data]
positive = [x for x in cleaned if x > 0]
result = [x**2 for x in positive]

# Oder moderne Pipe-Operator (ab Python 3.13 geplant)
```

### 4.6 Zusammenfassung

|Funktion|Zweck|Rückgabe|Beispiel|
|---|---|---|---|
|`map()`|Transformation|Iterator|`map(str.upper, words)`|
|`filter()`|Filtern nach Bedingung|Iterator|`filter(lambda x: x > 0, nums)`|
|`reduce()`|Akkumulation zu 1 Wert|Einzelner Wert|`reduce(lambda a,b: a+b, nums)`|

**Kernprinzip:** Moderne Python-Entwickler bevorzugen meist **List/Generator Comprehensions** über `map()/filter()` für bessere Lesbarkeit. `map()` ist aber elegant, wenn bereits eine passende Funktion existiert (`map(str.strip, data)`).

### **4.2 `filter()` – Elemente filtern**

`filter(func, iterable)` behält nur Elemente, für die `func` `True` zurückgibt.

python

```python
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Nur gerade Zahlen
even = filter(lambda x: x % 2 == 0, numbers)
print(list(even))  # [2, 4, 6, 8, 10]

# Nur Zahlen > 5
greater_five = filter(lambda x: x > 5, numbers)
print(list(greater_five))  # [6, 7, 8, 9, 10]
```

**Mit benannten Funktionen:**

python

```python
def is_positive(n):
    return n > 0

numbers = [-2, -1, 0, 1, 2, 3]
positive = filter(is_positive, numbers)
print(list(positive))  # [1, 2, 3]
```

**Ohne Lambda (None als Funktion):**

python

```python
# filter(None, iterable) filtert 'falsy' Werte
mixed = [0, 1, '', 'hello', None, [], [1, 2], False, True]
truthy = filter(None, mixed)
print(list(truthy))  # [1, 'hello', [1, 2], True]
```

### **4.3 `reduce()` – Akkumulation**

`reduce(func, iterable, initial)` aus `functools` reduziert Iterable auf einzelnen Wert.

python

```python
from functools import reduce

# Summe
numbers = [1, 2, 3, 4, 5]
total = reduce(lambda acc, x: acc + x, numbers)
print(total)  # 15

# Mit Startwert
total = reduce(lambda acc, x: acc + x, numbers, 10)
print(total)  # 25 (10 + 15)

# Produkt
product = reduce(lambda acc, x: acc * x, numbers)
print(product)  # 120

# Maximum finden
maximum = reduce(lambda acc, x: x if x > acc else acc, numbers)
print(maximum)  # 5
```

### **4.4 Kombination aller drei**

python

```python
# Pipeline: filter → map → reduce
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# 1. Nur gerade Zahlen
even = filter(lambda x: x % 2 == 0, numbers)

# 2. Quadrieren
squared = map(lambda x: x**2, even)

# 3. Summe bilden
from functools import reduce
total = reduce(lambda acc, x: acc + x, squared)

print(total)  # 220 (4 + 16 + 36 + 64 + 100)

# Als One-Liner
result = reduce(
    lambda acc, x: acc + x,
    map(lambda x: x**2, filter(lambda x: x % 2 == 0, numbers))
)
print(result)  # 220
```

### **4.5 Best Practices**

**✅ DO:**

python

```python
# map() für existierende Funktionen
upper = list(map(str.upper, words))

# filter() für einfache Bedingungen
positive = list(filter(lambda x: x > 0, numbers))

# Lazy Evaluation nutzen
for value in map(expensive_function, huge_list):
    if condition:
        break  # Stoppt früh, spart Rechenzeit
```

**❌ DON'T:**

python

```python
# Zu verschachtelt
result = list(map(lambda x: x**2, filter(lambda x: x > 0, map(int, data))))

# Besser: List Comprehension oder Zwischenschritte
cleaned = [int(x) for x in data]
positive = [x for x in cleaned if x > 0]
result = [x**2 for x in positive]

# Oder moderne Pipe-Operator (ab Python 3.13 geplant)
```

### 4.6 Zusammenfassung

|Funktion|Zweck|Rückgabe|Beispiel|
|---|---|---|---|
|`map()`|Transformation|Iterator|`map(str.upper, words)`|
|`filter()`|Filtern nach Bedingung|Iterator|`filter(lambda x: x > 0, nums)`|
|`reduce()`|Akkumulation zu 1 Wert|Einzelner Wert|`reduce(lambda a,b: a+b, nums)`|

**Kernprinzip:** Moderne Python-Entwickler bevorzugen meist **List/Generator Comprehensions** über `map()/filter()` für bessere Lesbarkeit. `map()` ist aber elegant, wenn bereits eine passende Funktion existiert (`map(str.strip, data)`).

## 5    Partial Functions

Vorkonfigurierte Funktionen mit `functools.partial` erlauben das Vorbelegen von Argumenten einer Funktion. Das ist nützlich, wenn man spezialisierte Varianten einer Funktion benötigt.

```python
from functools import partial

def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
cube = partial(power, exponent=3)

print(square(5))  # 25
print(cube(2))    # 8
```

- `partial` erstellt eine neue Funktion mit fixierten Parametern.
- Hilfreich z. B. beim Konfigurieren von Callbacks oder API-Funktionen.

## 6    Function Factories (Funktions-Fabriken)

Funktionen, die andere Funktionen erzeugen – meist Closures. Ideal, wenn man eine Reihe verwandter Funktionen mit leicht unterschiedlichem Verhalten benötigt.

```python
def make_multiplier(factor):
    def multiply(x):
        return x * factor
    return multiply

double = make_multiplier(2)
print(double(10))  # 20
```

- `factor` bleibt in jeder zurückgegebenen Funktion erhalten.
- Praktisch bei mathematischen Operationen, Filtern, usw.

## 7    Decorators

Ein Decorator erweitert das Verhalten einer Funktion, ohne ihren Code zu verändern. Er basiert auf Closures und Higher-Order Functions.

### 7.1    Einfacher Decorator

```python
def my_decorator(func):
    def wrapper():
        print('Before the function runs.')
        func()
        print('After the function runs.')
    return wrapper

@my_decorator
def say_hello():
    print('Hello!')

say_hello()
```

- `@my_decorator` ersetzt `say_hello` durch `wrapper`.
- Ideal für Logging, Fehlerbehandlung, Zeitmessung etc.

### 7.2    Decorators mit Argumenten

Decorator-Funktionen können Argumente übernehmen, wenn sie flexibel konfiguriert werden sollen. Dazu ist eine zusätzliche Verschachtelung notwendig.

```python
def logger(func):
    def wrapper(*args, **kwargs):
        print(f'Arguments: {args}, {kwargs}')
        return func(*args, **kwargs)
    return wrapper

@logger
def add(x, y):
    return x + y

add(3, 5)
```

- `*args` und `**kwargs` fangen alle Argumente ab.
- So bleiben Decorators universell einsetzbar.

### 7.3    Decorators mit Parametern

```python
def speaker(volume):
    def decorator(func):
        def wrapper():
            print(f'[{volume.upper()}]')
            func()
        return wrapper
    return decorator

@speaker('quiet')
def whisper():
    print('psst...')

whisper()
```

- `speaker('quiet')` gibt den eigentlichen Decorator zurück.
- Mehr Flexibilität durch parametrisierte Dekoration.

### 7.4    Eingebaute Decorators

- `@staticmethod`: Definiert eine Methode ohne `self`
- `@classmethod`: Zugriff auf Klasse statt Instanz
- `@property`: Erlaubt methodenartigen Zugriff auf Attribute

```python
class Circle:
    def __init__(self, radius):
        self._radius = radius

    @property
    def area(self):
        return 3.14 * self._radius ** 2
```

### 7.5    Mehrere Decorators kombinieren

```python
@decorator_one
@decorator_two
def some_function():
    pass
```

- `decorator_two` wird zuerst angewendet, dann `decorator_one`.
- Reihenfolge beachten, wenn Decorators interagieren.

## 8    `functools` – Höherwertige Funktionen und Decorators

Das `functools`-Modul bietet Werkzeuge für funktionale Programmierung und erweiterte Decorator-Funktionalität.

### 8.1    `lru_cache` – Memoization

`lru_cache` (Least Recently Used Cache) speichert Funktionsergebnisse und vermeidet redundante Berechnungen.

#### 8.1.1    Grundlegende Verwendung
```python
from functools import lru_cache

@lru_cache
def fibonacci(n):
    if n in (0, 1):
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(100))  # Instant, ohne Cache würde das ewig dauern

# Cache-Statistiken
print(fibonacci.cache_info())
# CacheInfo(hits=98, misses=101, maxsize=128, currsize=101)
```

#### 8.1.2    Cache-Größe konfigurieren
```python
from functools import lru_cache

# Maximale Cache-Größe festlegen
@lru_cache(maxsize=128)
def expensive_computation(x, y):
    return x ** y

# Unbegrenzter Cache
@lru_cache(maxsize=None)
def compute(x):
    return x * 2

# Cache leeren
expensive_computation.cache_clear()
```

#### 8.1.3    Wann `lru_cache` verwenden?

**✅ Gut für:**
- Rekursive Funktionen (Fibonacci, Factorial)
- Teure Berechnungen mit wiederholten Inputs
- Datenbankabfragen mit gleichen Parametern
- API-Calls mit identischen Requests

**❌ Nicht verwenden bei:**
- Funktionen mit mutable Argumenten (Listen, Dicts)
- Funktionen mit Seiteneffekten
- Sehr großen oder seltenen Inputs

#### 8.1.4    `cache` vs. `lru_cache`
```python
from functools import cache, lru_cache

# cache: Unbegrenzter Cache (Python 3.9+)
@cache
def compute(x):
    return x ** 2

# Äquivalent zu:
@lru_cache(maxsize=None)
def compute(x):
    return x ** 2
```

#### 8.1.5    Performance-Beispiel
```python
import time
from functools import lru_cache

# Ohne Cache
def fib_slow(n):
    if n < 2:
        return n
    return fib_slow(n-1) + fib_slow(n-2)

# Mit Cache
@lru_cache
def fib_fast(n):
    if n < 2:
        return n
    return fib_fast(n-1) + fib_fast(n-2)

# Vergleich
start = time.time()
fib_slow(30)
print(f'Ohne Cache: {time.time() - start:.3f}s')  # ~0.3s

start = time.time()
fib_fast(30)
print(f'Mit Cache: {time.time() - start:.6f}s')   # ~0.000050s
```

### 8.2    `wraps` – Decorator-Metadaten erhalten

`wraps` erhält die Metadaten der ursprünglichen Funktion beim Dekorieren.
```python
from functools import wraps

# ❌ Ohne wraps: Metadaten gehen verloren
def bad_decorator(func):
    def wrapper(*args, **kwargs):
        """Wrapper docstring"""
        return func(*args, **kwargs)
    return wrapper

@bad_decorator
def greet(name):
    """Greet a person"""
    return f'Hello, {name}'

print(greet.__name__)  # 'wrapper' (falsch!)
print(greet.__doc__)   # 'Wrapper docstring' (falsch!)

# ✅ Mit wraps: Metadaten bleiben erhalten
def good_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        """Wrapper docstring"""
        return func(*args, **kwargs)
    return wrapper

@good_decorator
def greet(name):
    """Greet a person"""
    return f'Hello, {name}'

print(greet.__name__)  # 'greet' (richtig!)
print(greet.__doc__)   # 'Greet a person' (richtig!)
```

**Immer `@wraps` in Decorators verwenden!**

### 8.3    `partial` – Funktionen teilweise anwenden

Bereits in Abschnitt 5 erwähnt, hier mehr Details:
```python
from functools import partial

def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
cube = partial(power, exponent=3)

print(square(5))  # 25
print(cube(2))    # 8

# Mit positionalen Argumenten
double = partial(power, 2)
print(double(3))  # 8 (2³)
```

#### 8.3.1    Praktische Beispiele

**Logging mit festem Format:**
```python
from functools import partial
import logging

# Basis-Logger
def log(level, message):
    logging.log(level, message)

# Spezialisierte Logger
debug = partial(log, logging.DEBUG)
info = partial(log, logging.INFO)
error = partial(log, logging.ERROR)

debug('Debug message')
error('Error occurred')
```

**Callback-Funktionen:**
```python
from functools import partial

def send_notification(user, message, priority):
    print(f'[{priority}] To {user}: {message}')

# Vorkonfigurierte Benachrichtigungen
notify_admin = partial(send_notification, user='admin', priority='HIGH')
notify_user = partial(send_notification, priority='NORMAL')

notify_admin('Server down!')
notify_user(user='alice', message='Welcome!')
```

### 8.4    `reduce` – Akkumulation

`reduce` reduziert ein Iterable auf einen einzelnen Wert durch wiederholte Anwendung einer Funktion.
```python
from functools import reduce

# Summe
numbers = [1, 2, 3, 4, 5]
total = reduce(lambda acc, x: acc + x, numbers)
print(total)  # 15

# Mit Startwert
total = reduce(lambda acc, x: acc + x, numbers, 10)
print(total)  # 25

# Produkt
product = reduce(lambda acc, x: acc * x, numbers)
print(product)  # 120

# Maximum
maximum = reduce(lambda acc, x: x if x > acc else acc, numbers)
print(maximum)  # 5
```

**Besser mit `operator`:**
```python
from functools import reduce
import operator

numbers = [1, 2, 3, 4, 5]

# Addition
print(reduce(operator.add, numbers))  # 15

# Multiplikation
print(reduce(operator.mul, numbers))  # 120

# String-Konkatenation
words = ['Hello', ' ', 'World', '!']
print(reduce(operator.add, words))  # 'Hello World!'
```

**Moderne Alternativen:**
```python
# ✅ Besser als reduce für einfache Fälle
numbers = [1, 2, 3, 4, 5]

# sum statt reduce für Addition
total = sum(numbers)  # Bevorzugt!

# max/min eingebaut
maximum = max(numbers)
minimum = min(numbers)

# math.prod für Produkt (Python 3.8+)
import math
product = math.prod(numbers)
```

### 8.5    `singledispatch` – Funktions-Overloading

`singledispatch` ermöglicht verschiedene Implementierungen basierend auf dem Typ des ersten Arguments.
```python
from functools import singledispatch

@singledispatch
def process(data):
    """Default-Implementierung"""
    raise NotImplementedError(f'Cannot process type {type(data)}')

@process.register
def _(data: int):
    return data * 2

@process.register
def _(data: str):
    return data.upper()

@process.register
def _(data: list):
    return len(data)

# Verwendung
print(process(5))        # 10
print(process('hello'))  # 'HELLO'
print(process([1,2,3]))  # 3
```

**Mit Type Hints (Python 3.7+):**
```python
from functools import singledispatch
from typing import List

@singledispatch
def to_json(obj):
    raise TypeError(f'Cannot serialize {type(obj)}')

@to_json.register(int)
@to_json.register(float)
def _(obj):
    return str(obj)

@to_json.register(str)
def _(obj):
    return f''{obj}''

@to_json.register(list)
def _(obj):
    items = ', '.join(to_json(item) for item in obj)
    return f'[{items}]'

@to_json.register(dict)
def _(obj):
    items = ', '.join(f''{k}': {to_json(v)}' for k, v in obj.items())
    return f'{{{items}}}'

# Verwendung
print(to_json(42))                    # '42'
print(to_json('hello'))               # ''hello''
print(to_json([1, 'two', 3]))         # '[1, 'two', 3]'
print(to_json({'a': 1, 'b': 'two'}))  # '{'a': 1, 'b': 'two'}'
```

**Registrierte Typen anzeigen:**
```python
print(to_json.registry)  # Zeigt alle registrierten Typen
print(to_json.registry[int])  # Zeigt Implementierung für int
```

### 8.6    `cmp_to_key` – Vergleichsfunktion zu Schlüsselfunktion

Konvertiert alte-style Vergleichsfunktionen (die -1, 0, 1 zurückgeben) zu modernen Key-Funktionen.
```python
from functools import cmp_to_key

# Alte-style Vergleichsfunktion
def compare(x, y):
    """Sortiert nach Länge, dann alphabetisch"""
    if len(x) != len(y):
        return len(x) - len(y)
    if x < y:
        return -1
    elif x > y:
        return 1
    return 0

# Konvertierung
words = ['apple', 'pie', 'a', 'cherry', 'on']
sorted_words = sorted(words, key=cmp_to_key(compare))
print(sorted_words)  # ['a', 'on', 'pie', 'apple', 'cherry']
```

**Praktisches Beispiel – Custom Card Sorting:**
```python
from functools import cmp_to_key

class Card:
    SUITS = {'Hearts': 4, 'Diamonds': 3, 'Clubs': 2, 'Spades': 1}
    RANKS = {'A': 14, 'K': 13, 'Q': 12, 'J': 11}

    def __init__(self, rank, suit):
        self.rank = rank
        self.suit = suit

    def __repr__(self):
        return f'{self.rank} of {self.suit}'

def compare_cards(card1, card2):
    """Erst nach Farbe, dann nach Wert"""
    # Farben-Vergleich
    suit_diff = Card.SUITS[card1.suit] - Card.SUITS[card2.suit]
    if suit_diff != 0:
        return suit_diff

    # Wert-Vergleich
    rank1 = Card.RANKS.get(card1.rank, int(card1.rank))
    rank2 = Card.RANKS.get(card2.rank, int(card2.rank))
    return rank1 - rank2

cards = [
    Card('K', 'Hearts'),
    Card('2', 'Spades'),
    Card('A', 'Hearts'),
    Card('5', 'Diamonds')
]

sorted_cards = sorted(cards, key=cmp_to_key(compare_cards))
for card in sorted_cards:
    print(card)
# 2 of Spades
# 5 of Diamonds
# K of Hearts
# A of Hearts
```

### 8.7    `total_ordering` – Vergleichsoperatoren automatisch generieren

Generiert alle Vergleichsoperatoren aus `__eq__` und einem weiteren (`__lt__`, `__le__`, `__gt__`, oder `__ge__`).
```python
from functools import total_ordering

@total_ordering
class Student:
    def __init__(self, name, grade):
        self.name = name
        self.grade = grade

    def __eq__(self, other):
        return self.grade == other.grade

    def __lt__(self, other):
        return self.grade < other.grade

    # __le__, __gt__, __ge__ werden automatisch generiert!

alice = Student('Alice', 85)
bob = Student('Bob', 92)

print(alice < bob)   # True
print(alice <= bob)  # True (automatisch generiert)
print(alice > bob)   # False (automatisch generiert)
print(alice >= bob)  # False (automatisch generiert)
print(alice == bob)  # False
```

### 8.8    `cached_property` – Lazy Property mit Cache

Wie `@property`, aber Wert wird nur einmal berechnet und dann gecacht.
```python
from functools import cached_property
import time

class DataProcessor:
    def __init__(self, data):
        self.data = data

    @cached_property
    def processed_data(self):
        """Teure Berechnung"""
        print('Computing...')
        time.sleep(2)
        return [x * 2 for x in self.data]

# Verwendung
processor = DataProcessor([1, 2, 3, 4, 5])

# Erste Verwendung: Berechnung
print(processor.processed_data)  # 'Computing...' dann [2, 4, 6, 8, 10]

# Zweite Verwendung: Cache
print(processor.processed_data)  # [2, 4, 6, 8, 10] (instant!)
```

**Unterschied zu `@property`:**
```python
class Example:
    @property
    def normal_prop(self):
        print('Computing...')
        return expensive_computation()

    @cached_property
    def cached_prop(self):
        print('Computing...')
        return expensive_computation()

obj = Example()

# @property: Jedes Mal neu berechnet
obj.normal_prop  # 'Computing...'
obj.normal_prop  # 'Computing...' (erneut!)

# @cached_property: Nur einmal berechnet
obj.cached_prop  # 'Computing...'
obj.cached_prop  # (kein 'Computing...')
```

### 8.9    Praktische Kombinationen

#### 8.9.1    Decorator mit LRU Cache
```python
from functools import lru_cache, wraps
import time

def timed_lru_cache(maxsize=128):
    """Decorator kombiniert LRU-Cache mit Timing"""
    def decorator(func):
        cached_func = lru_cache(maxsize=maxsize)(func)

        @wraps(func)
        def wrapper(*args, **kwargs):
            start = time.time()
            result = cached_func(*args, **kwargs)
            elapsed = time.time() - start
            print(f'{func.__name__} took {elapsed:.6f}s')
            return result

        wrapper.cache_info = cached_func.cache_info
        wrapper.cache_clear = cached_func.cache_clear
        return wrapper
    return decorator

@timed_lru_cache(maxsize=128)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

fibonacci(30)  # Erste Berechnung: langsam
fibonacci(30)  # Cache-Hit: schnell
```

#### 8.9.2    Partial mit Singledispatch
```python
from functools import singledispatch, partial

@singledispatch
def format_value(value, precision=2):
    return str(value)

@format_value.register(float)
def _(value, precision=2):
    return f'{value:.{precision}f}'

@format_value.register(int)
def _(value, precision=2):
    return f'{value:,}'

# Partial für feste Präzision
format_2dp = partial(format_value, precision=2)
format_4dp = partial(format_value, precision=4)

print(format_2dp(3.14159))   # '3.14'
print(format_4dp(3.14159))   # '3.1416'
print(format_2dp(1000000))   # '1,000,000'
```

### 8.10    Zusammenfassung

| Funktion           | Zweck                                        |
| ------------------ | -------------------------------------------- |
| `lru_cache`        | Memoization / Ergebnisse cachen              |
| `cache`            | Unbegrenzter Cache (3.9+)                    |
| `wraps`            | Metadaten in Decorators erhalten             |
| `partial`          | Funktionen teilweise anwenden                |
| `reduce`           | Iterable auf einzelnen Wert reduzieren       |
| `singledispatch`   | Funktions-Overloading nach Typ               |
| `cmp_to_key`       | Vergleichsfunktion → Key-Funktion            |
| `total_ordering`   | Alle Vergleichsoperatoren generieren         |
| `cached_property`  | Property mit einmaliger Berechnung           |

**Best Practices:**
- Immer `@wraps` in Decorators verwenden
- `lru_cache` für teure, wiederholte Berechnungen
- `singledispatch` statt if-elif Typ-Checks
- `total_ordering` für vergleichbare Klassen
- `cached_property` für lazy initialization

## 9    Throttle und Debounce

Im Folgenden werden die Konzepte Throttle, Debounce und deren Kombination anhand eines Minimalbeispiels (Tkinter-Fenster mit Texteingabe-Widget) gezeigt.

### 9.1    Throttle: Maximal alle X Sekunden ausführen

**Ziel:**

Eine Funktion wird **nicht** bei jeder Eingabe, sondern nur alle X Sekunden ausgeführt.

**Verwendungszweck:**

- Live-Speichern
- Logging
- Netzwerk-Anfragen beim Scrollen oder Eingeben

**Beispiel:**

```python
import tkinter as tk
import time


class ThrottleApp:
    text: tk.Text
    time_last_call: float = 0


    def __init__(self, root):
        # Erstelle Textbox und binde das KeyRelease-Ereignis an on_key()
        self.text = tk.Text(root, height=10, width=40)
        self.text.pack()
        self.text.bind('<KeyRelease>', self.on_key)

    def on_key(self, event: tk.Event):
        now = time.time()

        # Throttle: Ignoriere Aufruf, wenn letzter weniger als 2 s her ist
        if now - self.time_last_call < 2:
            return

        self.time_last_call = now
        self.handle_text(self.text.get('1.0', tk.END).strip())

    def handle_text(self, text: str):
        print(f'[{time.strftime('%X')}] [Throttle] Verarbeitung: {text}')


## Erstelle und starte Tkinter-App
root = tk.Tk()
app = ThrottleApp(root)
root.mainloop()
```


### 9.2    Debounce: Ausführen, wenn keine neuen Events mehr kommen

**Ziel:**

Eine Funktion wird erst ausgeführt, wenn der Benutzer X Sekunden lang nichts mehr gemacht hat.

**Verwendungszweck:**

- Auto-Save nach Tipp-Pause
- Autovervollständigung
- Validierung nach Eingabe

**Beispiel:**

```python
import tkinter as tk
import threading
import time


class DebounceApp:
    text: tk.Text
    debounce_timer: threading.Timer | None = None


    def __init__(self, root):
        # Erstelle Textbox und binde das KeyRelease-Ereignis an on_key()
        self.text = tk.Text(root, height=10, width=40)
        self.text.pack()
        self.text.bind('<KeyRelease>', self.on_key)

    def on_key(self, event: tk.Event):
        # Debounce: Setze den Timer zurück
        if self.debounce_timer:
            self.debounce_timer.cancel()

        # Debounce: Starte den Timer, Aktion nach 3 Sekunden
        self.debounce_timer = threading.Timer(
            3.0, self.handle_text, args=(self.text.get('1.0', tk.END).strip(),)
        )
        self.debounce_timer.start()

    def handle_text(self, text: str):
        print(f'[{time.strftime('%X')}] [Debounce] Finale Verarbeitung: {text}')


## Erstelle und starte Tkinter-App
root = tk.Tk()
app = DebounceApp(root)
root.mainloop()
```

### 9.3    Kombination von Throttle und Debounce

**Ziel:**

Eine Funktion wird alle X Sekunden ausgeführt und wenn der Benutzer Y Sekunden lang nichts mehr gemacht hat.

**Verwendungszweck:**

- Throttle: z. B. regelmäßige Zwischenspeicherung
- Debounce: Finale Verarbeitung, wenn nichts mehr kommt

**Beispiel:**

```python
import tkinter as tk
import threading
import time


class ThrottleDebounceApp:
    text: tk.Text
    last_throttle_time: float = 0
    debounce_timer: threading.Timer | None = None
    throttle_interval = 2.0
    debounce_interval = 3.0


    def __init__(self, root):
        # Erstelle Textbox und binde das KeyRelease-Ereignis an on_key()
        self.text = tk.Text(root, height=10, width=40)
        self.text.pack()
        self.text.bind('<KeyRelease>', self.on_key)

    def on_key(self, event: tk.Event):
        now = time.time()

        # Throttle: Verarbeitung, wenn Throttle-Zeit überschritten
        if now - self.last_throttle_time >= self.throttle_interval:
            self.handle_text(
                reason='Throttle', text=self.text.get('1.0', tk.END).strip()
            )
            self.last_throttle_time = now

        # Debounce: Setze den Timer zurück
        if self.debounce_timer:
            self.debounce_timer.cancel()

        # Debounce: Starte den Timer, Aktion nach 3 Sekunden
        self.debounce_timer = threading.Timer(
            self.debounce_interval,
            self.handle_text,
            kwargs={
                'reason': 'Debounce',
                'text': self.text.get('1.0', tk.END).strip()
            }
        )
        self.debounce_timer.start()

    def handle_text(self, reason: str, text: str):
        print(f'[{time.strftime('%X')}] [{reason}] Verarbeitung: {text}')


## Tkinter-App starten
root = tk.Tk()
app = ThrottleDebounceApp(root)
root.mainloop()
```

### 9.4    Zusammenfassung

| Verhalten       | Beschreibung                        | Beispiel-Use-Case          |
| --------------- | ----------------------------------- | -------------------------- |
| **Throttle**    | Maximal alle X Sekunden ausführen   | Live-Preview, Autosave     |
| **Debounce**    | Nur wenn X Sekunden nichts passiert | Validierung, End-Save      |
| **Kombination** | Regelmäßig + abschließend nach Ruhe | Markdown-Live + Final Save |

## 10    Zusammenfassung

| Konzept             | Nutzen                                                        |
| ------------------- | ------------------------------------------------------------- |
| Closures            | Zustand bewahren, Daten kapseln                               |
| Lambda              | Kürzere anonyme Funktionen                                    |
| Higher-Order Funcs  | Flexible Funktionskomposition                                 |
| map/filter/reduce   | Funktionale Verarbeitung von Listen                           |
| Partial Functions   | Vorbelegte Funktionen                                         |
| Decorators          | Funktion erweitern ohne Quellcode zu ändern                   |
| functools           | Werkzeuge für funktionale Programmierung (cache, wraps, etc.) |
| Throttle & Debounce | Event-Rate-Limiting für Performance und User Experience       |
