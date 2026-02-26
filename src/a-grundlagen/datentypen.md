# Datentypen

## 1    Immutable (Unveränderlich)

| Datentyp    | Beschreibung              | Wertebereich                                                    |
| ----------- | ------------------------- | --------------------------------------------------------------- |
| `int`       | Ganze Zahlen              | Theoretisch unbegrenzt (abhängig vom Speicher)                  |
| `float`     | Gleitkommazahlen          | Ca. ±1.8 × 10³⁰⁸ (IEEE 754, 64-Bit)                             |
| `complex`   | Komplexe Zahlen           | Kombination aus zwei `float`-Werten (Real- und Imaginärteil)    |
| `bool`      | Wahrheitswerte            | `{True, False}`                                                 |
| `str`       | Zeichenketten             | Beliebige Zeichenfolgen (Unicode)                               |
| `tuple`     | Tupel (unveränderlich)    | Beliebige Anzahl von Elementen unterschiedlicher Typen          |
| `frozenset` | Unveränderliche Menge     | Ungeordnete, nicht doppelte Elemente beliebiger immutable Typen |
| `bytes`     | Byte-Sequenz              | Folge von Bytes (0–255)                                         |
| `NoneType`  | Repräsentiert "kein Wert" | `{None}`                                                        |

## 2    Mutable (Veränderlich)

| Datentyp    | Beschreibung                      | Wertebereich                                                    |
| ----------- | --------------------------------- | --------------------------------------------------------------- |
| `list`      | Liste (Array in anderen Sprachen) | Beliebige Anzahl von Elementen unterschiedlicher Typen          |
| `dict`      | Wörterbuch (Key-Value-Paare)      | Schlüssel: Immutable Typen, Werte: Beliebige Typen              |
| `set`       | Menge (keine doppelten Werte)     | Ungeordnete, nicht doppelte Elemente beliebiger immutable Typen |
| `bytearray` | Veränderbare Byte-Sequenz         | Folge von Bytes (0–255)                                         |

## 3    Strings

### 3.1    Allgemein

```python
s = "Hallo"
s = 'Hallo'
s = """Hallo
    Welt"""
s = ("Hallo " 
     "Welt")
s = ('Hallo '
     'Welt')
```

### 3.2    f-Strings

```python
s = 'Welt'

print(f'Hallo {s}')
```

f-Strings sind Konkatenationen vorzuziehen, da sie sich schneller schreiben lassen und besser zu lesen sind:

```python
first_name = 'Max'
last_name = 'Mustermann'

print('Hallo ' + first_name + ' ' + last_name)  # Konkatenationen
print(f'Hallo {first_name} {last_name}')        # f-String
```

### 3.3    Teilstrings

```python
s = 'Hallo'
print(s[0])    # Ausgabe: H
print(s[-1])   # Ausgabe: o
print(s[2:])   # Ausgabe: llo
print(s[:2])   # Ausgabe: Ha
print(s[2:4])  # Ausgabe: ll
```

### 3.4    String zu Liste

```python
s = 'Hallo Welt'
l = s.split(' ')
print(l)  # ['Hallo', 'Welt']
```

### 3.5    Ersetzungen

```python
s = 'Hallo+Welt'
print(s.replace('+', ' '))  # Hallo Welt
```

### 3.6    Raw-Strings

```python
s = 'c:\\mein\\pfad'
s_raw = r'c:\mein\pfad'  # raw string
print(s, s_raw)          # c:\mein\pfad c:\mein\pfad
```

### 3.7    Pfade

```python
from pathlib import Path

str = '/user/somestuff/my_file.txt'
p = Path(str)
print(p.absolute())  # /user/somestuff/my_file.txt
print(p.parent)      # /user/somestuff
print(p.stem)        # my_file
print(p.is_dir())    # False
print(p.is_file())   # True
```

## 4    Zahlen

### 4.1    Integer – Ganze Zahlen

Bei der Division entsteht ein `float`, auch wenn das Ergebnis gerade ist. Vermeiden kann man dies mit dem `//`-Operator.

```python
result = 4 / 2
print(f'{result}; Typ: {type(result)}')  # 2.0; Typ: <class 'float'>

result = 4 // 2
print(f'{result}; Typ: {type(result)}')  # 2; Typ: <class 'int'>
```

**Formatierung von Zahlen:**

```python
n1 = 1000
n2 = 1
print(n1)          # 1000
print(f'{n2:4d}')  #    1
```

### 4.2    Floats  – Gleitkommazahlen

Gleitkommazahlen werden nach dem IEEE 754-Standard als 64-Bit-Wert gespeichert, bestehend aus Vorzeichen, Exponent und Mantisse. Dadurch können sie sehr große und sehr kleine Zahlen darstellen, allerdings nur mit begrenzter Präzision von ca. 15–17 signifikanten Dezimalstellen.

```python
pi = 3.14159
x = 1.5e-10       # wissenschaftliche Notation: 1.5 × 10⁻¹⁰
y = float('inf')  # positiv unendlich
z = float('nan')  # Not a Number (z.B. Ergebnis von 0/0 in anderen Sprachen)
```

#### 4.2.1    Vergleich von Gleitkommazahlen

> [!danger]
> Die Nachkommastellen von Gleitkommazahlen werden **nicht** exakt abgespeichert, daher sollten `float`-Werte **niemals** mit `==` vergleichen werden. Stattdessen eignet sich die Verwendung von `math.isclose()`.

**Beispiel:**

```python
import math

result = 1/10 + 1/10 + 1/10
value = 0.3

print(f'{result:.32f}')  # 0.30000000000000004440892098500626
print(f'{value:.32f}')   # 0.29999999999999998889776975374843
print(result == value)              # False
print(math.isclose(result, value))  # True
```

#### 4.2.2    Runden von Gleitkommazahlen

Aufrunden:

```python
print(math.floor(1.2))  # 1
```

Abrunden:

```python
print(math.ceil(1.2))  # 2
```

Auf 2 Nachkommastellen runden:

```python
print(round(1.23456, 2))  # 1.23
```

Auf das nächstgelegene Vielfache von `10 (= 10^1)` runden:

```python
print(round(644.123, -1))  # 640.0
```

Auf das nächstgelegene Vielfache von `100 (= 10^2)` runden:

```python
print(round(644.123, -2))  # 600.0
```

### 4.3    Potenzen

> [!danger]
> `a^b` ist falsch, da `^` der `XOR`-Operator ist!

```python
import math

a = 2
b = 3

# Es gibt 2 Möglichkeiten:
print(a ** b)          # 8
print(math.pow(a, b))  # 8.0
```

## 5    Typumwandlungen

Python unterscheidet zwischen **impliziten** Typumwandlungen, die Python automatisch vornimmt und **expliziten** Typumwandlungen, die der Entwickler durchführt.

### 5.1    Implizite Typumwandlungen

Python wandelt Typen automatisch um, wenn es nötig ist – z.B. bei arithmetischen Operationen:

```python
x = 3 + 1.5        # int + float → float
print(x, type(x))  # 4.5 <class 'float'>

x = True + 1       # bool + int → int (True wird als 1 behandelt)
print(x, type(x))  # 2 <class 'int'>
```

### 5.2    Explizite Typumwandlungen

#### 5.2.1    Nach `int`

```python
print(int(3.9))    # 3 (Nachkommastellen werden abgeschnitten, nicht gerundet!)
print(int(3.1))    # 3
print(int(-3.9))   # -3 (nicht -4!)
print(int(True))   # 1
print(int(False))  # 0
print(int('42'))   # 42
print(int('0b1010', 2))  # 10   (Binär → int)
print(int('0xFF', 16))   # 255  (Hex → int)
```

> [!warning]
> Strings können nicht direkt in Gleitkommazahlen umgewandelt werden: `int('3.14')` wirft einen `ValueError`.
> 
> Eine Umwandlung ist über den folgenden Umweg möglich: `int(float('3.14'))`.

#### 5.2.2    Nach `float`

```python
print(float(3))          # 3.0
print(float(True))       # 1.0
print(float('3.14'))     # 3.14
print(float('1.5e-10'))  # 1.5e-10
print(float('inf'))      # inf
print(float('nan'))      # nan
```

#### 5.2.3    Nach `str`

```python
print(str(42))         # '42'
print(str(3.14))       # '3.14'
print(str(True))       # 'True'
print(str([1, 2, 3]))  # '[1, 2, 3]'
print(str(None))       # 'None'
```

#### 5.2.4    Nach `bool`

Jeder Typ kann in einen `bool` umgewandelt werden. Als `False` gelten dabei:

| Wert    | Typ        |
| ------- | ---------- |
| `0`     | `int`      |
| `0.0`   | `float`    |
| `''`    | `str`      |
| `[]`    | `list`     |
| `()`    | `tuple`    |
| `{}`    | `dict`     |
| `set()` | `set`      |
| `None`  | `NoneType` |

Alle anderen Werte gelten als `True`.

```python
print(bool(0))      # False
print(bool(0.0))    # False
print(bool(''))     # False
print(bool([]))     # False
print(bool(None))   # False

print(bool(1))      # True
print(bool(-1))     # True
print(bool('0'))    # True (nicht-leerer String!)
print(bool([0]))    # True (nicht-leere Liste!)
```

#### 5.2.5    Nach `list`, `tuple` und `set`

```python
# str → list (jedes Zeichen wird ein Element)
print(list('Hallo'))         # ['H', 'a', 'l', 'l', 'o']

# tuple → list und umgekehrt
print(list((1, 2, 3)))       # [1, 2, 3]
print(tuple([1, 2, 3]))      # (1, 2, 3)

# list → set (Duplikate werden entfernt, Reihenfolge nicht garantiert)
print(set([1, 2, 2, 3, 3]))  # {1, 2, 3}

# set → list
print(list({1, 2, 3}))       # [1, 2, 3]
```

#### 5.2.6    Nach `bytes` und `bytearray`

```python
# str → bytes (Encoding muss angegeben werden)
b = 'Hallo'.encode('utf-8')
print(b)                     # b'Hallo'
print(type(b))               # <class 'bytes'>

# bytes → str
s = b.decode('utf-8')
print(s)                     # Hallo

# list → bytes
b = bytes([72, 101, 108, 108, 111])
print(b)                     # b'Hello'

# bytes → bytearray (veränderlich)
ba = bytearray(b)
ba[0] = 104
print(ba)                    # bytearray(b'hello')
```

### 5.3    Typprüfung

Vor einer Umwandlung kann es sinnvoll sein, den Typ eines Objekts zu prüfen:

```python
x = 42

print(type(x))         # <class 'int'>
print(type(x) == int)  # True

# isinstance() ist vorzuziehen, da es auch Vererbung berücksichtigt
print(isinstance(x, int))           # True
print(isinstance(x, (int, float)))  # True (einer der Typen reicht)
```

Mehr zu Typvergleichen in [[typannotationen#10 Typenvergleich]].

### 5.4    Fehlerbehandlung bei Typumwandlungen

Ungültige Umwandlungen werfen eine Ausnahme. Für unsichere Umwandlungen empfiehlt sich ein `try/except`-Block:

```python
def to_int(value):
    try:
        return int(value)
    except (ValueError, TypeError):
        return None

print(to_int('42'))   # 42
print(to_int('abc'))  # None
print(to_int(None))   # None
```