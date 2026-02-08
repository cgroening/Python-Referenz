# Datentypen

## 1    Immutable (Unveränderlich)

| Datentyp     | Beschreibung                           | Wertebereich                              |
|-------------|-------------------------------------|------------------------------------------|
| `int`       | Ganze Zahlen                      | Theoretisch unbegrenzt (abhängig vom Speicher) |
| `float`     | Gleitkommazahlen                   | Ca. ±1.8 × 10³⁰⁸ (IEEE 754, 64-Bit)    |
| `complex`   | Komplexe Zahlen                   | Kombination aus zwei `float`-Werten (Real- und Imaginärteil) |
| `bool`      | Wahrheitswerte                    | `{True, False}`                         |
| `str`       | Zeichenketten                     | Beliebige Zeichenfolgen (Unicode)       |
| `tuple`     | Tupel (unveränderlich)            | Beliebige Anzahl von Elementen unterschiedlicher Typen |
| `frozenset` | Unveränderliche Menge             | Ungeordnete, nicht doppelte Elemente beliebiger immutable Typen |
| `bytes`     | Byte-Sequenz                      | Folge von Bytes (0–255)                 |
| `NoneType`  | Repräsentiert "kein Wert"         | `{None}`                                |

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
s = ('Hallo '
     'Welt')
```

### 3.2    f-Strings

```python
s = 'Welt'

print(f'Hallo {s}')  # Hallo Welt
```

f-Strings sind Konkatenationen vorzuziehen, da sie sich schneller schreiben lassen und besser zu lesen sind:

```python
first_name = 'Max'
last_name = 'Mustermann'

print('Hallo ' + first_name + ' ' + last_name)
print(f'Hallo {first_name} {last_name}')
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
print(s, s_raw)  # c:\mein\pfad c:\mein\pfad
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

### 4.1    Integer

Bei der Division entsteht ein float, auch wenn das Ergebnis gerade ist. Vermeiden kann man dies mit dem `//`-Operator.

```python
result = 4 / 2
print(f'{result}; Typ: {type(result)}')  # 2.0; Typ: <class 'float'>

result = 4 // 2
print(f'{result}; Typ: {type(result)}')  # 2; Typ: <class 'int'>
```

**Formatierung:**

```python
n1 = 1000
n2 = 1
print(n1)          # 1000
print(f'{n2:4d}')  #    1
```

### 4.2    Floats

### 4.3    Vergleich

> [!danger]
> Die Nachkommastellen werden nicht exakt abgespeichert, daher sollten `float`-Werte niemals mit == vergleichen werden. Stattdessen eignet sich die Verwendung von `math.isclose()`.

Beispiel:

```python
import math

result = 1/10 + 1/10 + 1/10
value = 0.3

print(f'{result:.32f}')  # 0.30000000000000004440892098500626
print(f'{value:.32f}')   # 0.29999999999999998889776975374843
print(result == value)              # False
print(math.isclose(result, value))  # True
```

### 4.4    Runden

Aufrunden:

```python
print(math.floor(1.2))    # 1
```

Abrunden:

```python
print(math.ceil(1.2))     # 2
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

### 4.5    Potenzen

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





