# Funktionen

## 1    `*args` und `**kwargs`

`*args` und `**kwargs` sind optionale Paramenter. `args` (positional arguments) ist eine Liste oder ein Tupel. `kwargs` (keyword arguments) ist ein Dictionary.

> [!note]
> **Benennung der positional und keyword rguments:**
> 
> Die Namen sind nicht vorgeschrieben, wichtig sind nur die Sternchen vor den Variablennamen. Die Benennung `*args` und `**kwargs` ist jedoch üblich.

**Beispiel zu positional arguments:**

```python
def sum_up(*numbers):
    return sum(numbers)

result = sum_up(1, 2, 3, 4, 5)  # 15
```

**Beispiel zu keyword arguments:**

```python
def details(**info):
    for key, value in info.items():
        print(f'{key}: {value}')
        
details(name='Max', age=25, job='Entwickler')
```

Ausgabe:

```
name: Max
age: 25
job: Entwickler
```

## 2    Lambda-Funktion (anonyme Funktion)

```python
square = lambda x: x ** 2
result = square(4)  # 16
```

## 3    Funktion mit mehreren Rückgabewerten

```python
def calculate(a, b):
    return a + b, a * b

total, product = calculate(3, 4)
print(total, product)  # 7 12
```

## 4    Rekursive Funktion

```python
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

result = factorial(5)  # 120
```

## 5    Scope (Gültigkeitsbereich) von Variablen

```python
x = 10     # Globale Variable

def my_function():
    x = 5  # Lokale Variable
    print(x)

my_function()  # 5
print(x)       # 10
```

## 6    Benannte Parameter (keyword parameter)

### 6.1    Standardverhalten

```python
def my_function(a):
    return a * 2

res1 = my_function(2)    # Positionsargument
res2 = my_function(a=2)  # Keyword-Argument
```

Beide Varianten (`my_function(2)` und `my_function(a=2)`) funktionieren. 

### 6.2    `/` - Positional-Only Parameter (nur Positionsargumente)

```python
def my_function(a, /):
    return a * 2

res1 = my_function(2)    # OK: Positionsargument
res2 = my_function(a=2)  # Fehler: Darf nicht als Keyword-Argument übergeben werden
```

Der Schrägstrich (`/`) bedeutet, dass alle Parameter davor NUR als Positionsargumente übergeben werden dürfen.

> [!note]
> **Warum positional-only?**
> 
> - Wird oft bei eingebauten Funktionen wie `len()` genutzt (`len(obj)` statt `len(obj=obj))`
> - Macht API-Design klarer
> - Verhindert, dass Parameter versehentlich als Schlüsselwort verwendet werden

### 6.3    `*` – Keyword-Only Parameter (nur benannte Argumente erlaubt)

```python
def my_function(*, a):
    return a * 2

res1 = my_function(2)    # Fehler: Darf nicht als Positionsargument übergeben werden
res2 = my_function(a=2)  # OK: Muss als benanntes Argument übergeben werden
```

Das Sternchen (`*`) bedeutet, dass alle Parameter danach NUR als Keyword-Argument übergeben werden dürfen.

> [!note]
> **Warum keyword-only?**
> 
> - Erhöht die Lesbarkeit von Funktionen
> - Verhindert Verwechslungen bei der Reihenfolge der Argumente

### 6.4    Kombination aus `/` und `*`

```python
def my_function(a, /, b, *, c):
    return a + b + c

res1 = my_function(1, 2, c=3)   # OK
res2 = my_function(1, b=2, c=3) # OK
res3 = my_function(a=1, 2, c=3)  # Fehler: a darf nicht als Keyword-Argument übergeben werden
res4 = my_function(1, 2, 3)      # Fehler: c muss als benanntes Argument übergeben werden
```

Erklärung:
- `a` ist positional-only, weil es vor `/` steht. $\Rightarrow$ Darf nicht als `a=1` übergeben werden.
	•	`b` kann positional oder keyword sein, weil es zwischen `/` und `*` steht.
	•	`c` ist keyword-only, weil es nach `*` steht.

### 6.5    Zusammenfassung `/` und `*`

| **Schreibweise**       | **Bedeutung**                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| `def f(a)`             | Standard: Positions- und Keyword-Argumente erlaubt                                                |
| `def f(a, /)`          | `a` ist positional-only (kein `a=` erlaubt)                                                       |
| `def f(*, a)`          | `a` ist keyword-only (kein `f(2)`, nur `f(a=2)`)                                                  |
| `def f(a, /, b, *, c)` | `a` $\rightarrow$ nur positional, `b` $\rightarrow$ beides erlaubt, `c` $\rightarrow$ nur keyword |

> [!tip]
> **Best Practice:**
> 
> - `/` für klare API-Schnittstellen
> - `*` für mehr Lesbarkeit und weniger Fehler

## 7    Optionale Listen mit Standardwert

> [!danger]
> Verwendet man optionale Listen als Funktionsparameter und gibt diesen einen Standardwert, ist zu beachten, dass dieser bei der Definition der Funktion festgelegt wird, NICHT beim Aufruf der Funktion. **Dies führt häufig zu einem nicht gewolltem Verhalten.**

**Beispiel:**

```python
def append(n, l=[]):
    l.append(n)
    return l

print(append(0))  # [0]
print(append(0))  # [0, 0] != [0]
```

Daher ist es bei den meisten Anwendungsfällen besser, die Liste innerhalb der Funktion zu initialisieren:

```python
def append(n, l=None):
    if l is None:
        l = []
    l.append(n)
    return l

print(append(0))  # [0]
print(append(0))  # [0]
```

## 8    `partial()`

Mit `partial()` wird eine neue Funktion erstellt, bei der einige Argumente einer bestehenden Funktion bereits vorbelegt sind. Dies ist praktisch, wenn man eine bestimmte Funktion wiederholt aufruft, wobei einige Parameter immer gleich sind.

**Syntax:**

```python
from functools import partial

neue_funktion = partial(funktion, arg1, arg2, ...)
```

**Beispiel:**

```python
from functools import partial

def multiply(x, y):
    return x * y

# Erstelle eine neue Funktion, die den gegebenen Wert immer mit 2 multipliziert
double_value = partial(multiply, 2)

print(double_value(5))  # Ausgabe: 10
print(double_value(10)) # Ausgabe: 20
```

**Alternative mit `lambda`:**

```python
# [...]
double_value = lambda y: multiply(2, y)
# [...]
```

## 9    Rückgabe mehrerer Werte mit `yield`

Neben der Möglichkeit, mehrere Werte über eine Liste oder ein Tupel zurückzugeben, gibt es das Schlüsselwort `yield`:

```rust
def my_func():
  yield 'Hello'
  yield 'World'
  yield 123
  
return_values = my_func()

for val in return_values:
  print(val)
```

Ausgabe:

```
Hello
World
123
```
