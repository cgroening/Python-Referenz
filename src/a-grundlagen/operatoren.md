# Operatoren

## 1    Vergleichsoperatoren

| Ausdruck | Bedeutung                       |
| -------- | ------------------------------- |
| `a == b` | `a` ist gleich `b`              |
| `a != b` | `a` ist ungleich `b`            |
| `a < b`  | `a` ist kleiner als `b`         |
| `a > b`  | `a` ist größer als `b`          |
| `a <= b` | `a` ist kleiner oder gleich `b` |
| `a >= b` | `a` ist größer oder gleich `b`  |

## 2    Arithmetische Operatoren

| Ausdruck | Bedeutung         |
| -------- | ------------------------------ |
| `a + b`  | `a` wird zu `b` addiert        |
| `a - b`  | `b` wird von `a` subtrahiert   |
| `a / b`  | `a` wird durch `b` geteilt     |
| `a // b` | Ganzzahldivision von `a` durch `b` |
| `a % b`  | Rest von `a` durch `b`         |
| `a * b`  | `a` wird mit `b` multipliziert |
| `a ** b` | `a` hoch `b` (Potenz)          |

## 3    Bitweise Operatoren

| Ausdruck | Bedeutung                       |
| -------- | ------------------------------- |
| `a & b`  | Bitweises AND                   |
| a \|\| b | Bitweises OR                    |
| `a ^ b`  | Bitweises XOR                   |
| `~a`     | Bitweises NOT (Eins-Komplement) |
| `a << b` | Bitweise Linksverschiebung      |
| `a >> b` | Bitweise Rechtsverschiebung     |

## 4    Logische Operatoren

| Ausdruck | Bedeutung    |
| -------- | ----------------------- |
| `a and b` | Beide sind wahr (AND)   |
| `a or b`  | Einer ist wahr (OR)     |
| `not a`   | `a` ist falsch (NOT)    |

## 5    Zusammengesetzte Zuweisungsoperatoren

| Ausdruck  | Bedeutung                        | Beispiel     |
| --------- | -------------------------------- | ------------ |
| `a += b`  | Wert addieren und zuweisen       | `a = a + b`  |
| `a -= b`  | Wert subtrahieren und zuweisen   | `a = a - b`  |
| `a /= b`  | Wert teilen und zuweisen         | `a = a / b`  |
| `a //= b` | Ganzzahldivision und zuweisen    | `a = a // b` |
| `a *= b`  | Wert multiplizieren und zuweisen | `a = a * b`  |
| `a **= b` | Potenzieren und zuweisen         | `a = a ** b` |
| `a \|= b` | Bitweises ODER und zuweisen      | `a = a \| b` |
| `a &= b`  | Bitweises UND und zuweisen       | `a = a & b`  |
| `a ^= b`  | Bitweises XOR und zuweisen       | `a = a ^ b`  |
| `a <<= b` | Linksverschiebung und zuweisen   | `a = a << b` |
| `a >>= b` | Rechtsverschiebung und zuweisen  | `a = a >> b` |

## 6    Operationen bei Set und Mengen

Siehe [[datenstrukturen-collections#5 Sets bzw. Mengen]].

## 7    Walrus-Operator `:=` (Assignment Expression)

Der Walrus Operator (`:=`) wurde in Python 3.8 eingeführt und ermöglicht Zuweisungen innerhalb von Ausdrücken.

**Syntax:**

```python
(variable := expression)
```

### 7.1    Grundlegendes Beispiel

```python
# Ohne Walrus Operator
data = input('Gib Text ein: ')
if len(data) > 5:
    print(f'Der Text is {len(data)} Zeichen lang.')

# Mit Walrus Operator (kompakter)
if (n := len(input('Gib Text ein: '))) > 5:
    print(f' Der Text ist {n} Zeichen lang.')
```

### 7.2    In `while`-Schleifen

```python
# Ohne Walrus Operator
line = input('Gib Befehl ein: ')
while line != 'quit':
    print(f'Du hast eingegeben: {line}')
    line = input('Gib Befehl ein: ')

# Mit Walrus Operator (DRY - Don't Repeat Yourself)
while (line := input('Gib Befehl ein: ')) != 'quit':
    print(f'You entered: {line}')
```

### 7.3    In List Comprehensions

```python
# Liste von Quadraten, nur wenn Quadrat > 10
numbers = [1, 2, 3, 4, 5, 6]

# Ohne Walrus Operator (berechnet x**2 zweimal)
squares = [x**2 for x in numbers if x**2 > 10]

# Mit Walrus Operator (berechnet nur einmal)
squares = [square for x in numbers if (square := x**2) > 10]
# [16, 25, 36]
```

### 7.4    Bei regulären Ausdrücken

```python
import re

# Ohne Walrus Operator
text = 'Email: user@example.com'
match = re.search(r'[\w\.-]+@[\w\.-]+', text)
if match:
    print(f'Gefunden: {match.group()}')

# Mit Walrus Operator
if (match := re.search(r'[\w\.-]+@[\w\.-]+', text)):
    print(f'Found: {match.group()}')
```

### 7.5    Wichtige Hinweise

**Es sind Klammern erforderlich:**

```python
# ❌ Syntaxfehler
if n := 5 > 3:
    pass

# ✅ Richtig
if (n := 5) > 3:
    pass
```

**Der Walrus-Operator ist nicht in allen Kontexten erlaubt:**

```python
# ❌ Nicht als standalone statement
n := 5  # SyntaxError

# ✅ Normale Zuweisung verwenden
n = 5
```

✅ **Wann verwenden:**

- Wenn ein Wert berechnet UND in einer Bedingung verwendet wird
- Bei `while`-Schleifen mit komplexen Bedingungen
- In List Comprehensions zur Vermeidung doppelter Berechnungen

❌ **Wann nicht verwenden:**

- Wenn normale Zuweisung ausreicht
- Wenn es die Lesbarkeit verschlechtert
