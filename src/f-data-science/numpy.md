# NumPy

[NumPy user guide](https://numpy.org/doc/2.2/user/index.html)

## 1   Einleitung

NumPy ist DIE Standardbibliothek für wissenschaftliche Berechnungen. Sie stellt ein mehrdimensionales Array-Objekt, verschiedene abgeleitete Objekte und eine Vielzahl von Funktionen für schnelle Operationen auf Arrays bereit.

### 1.1   Beispiel für die Leistungssteigerung durch Numpy

Durch die Verwendung von `numpy` anstatt von Listen hat man nicht nur besser lesbaren Code, sondern häufig auch eine deutliche Reduzierung der Ausführungszeit:

```python
import time
import numpy as np

start = time.perf_counter()

x = list(range(10000000))
y = list(range(10000000))
sum = [a + b for a, b in zip(x, y)]

end = time.perf_counter()
print(end - start)  # 0.49263983300625114

# Schneller mit numpy:
start = time.perf_counter()

x = np.arange(10000000)
y = np.arange(10000000)
sum = x + y

end = time.perf_counter()
print(end - start)  # 0.22649779099447187
```

`x + y` macht das gleiche, wie `[a + b for a, b in zip(x, y)]` ist jedoch deutlich schneller zu schreiben und einfacher zu lesen.

## 2   Funktionsweise

Das Herzstück des NumPy-Pakets ist das `ndarray`-Objekt. Dieses kapselt `n`-dimensionale Arrays homogener Datentypen, wobei viele Operationen in kompiliertem C-Code ausgeführt werden, was zu einer deutlich höheren Leistung im Vergleich zu Listen führt. Des Weiteren ist die Schreibweise kürzer und besser lesbar.

**Eigenschaften eines `ndarray`:**

* Es beschreibt eine Sammlung von 'Elementen' des **gleichen** Typs.
* Die Elemente können beispielsweise mit `n` ganzen Zahlen indexiert werden.
* Alle `ndarrays` sind homogen: Jedes Element belegt einen gleich großen Speicherblock.
* Ein Element aus dem Array wird durch ein `PyObject` repräsentiert, das zu den eingebauten skalaren NumPy-Typen gehört.

## 3   Import

```python
import numpy as np
```

Der Name `np` ist zwar frei wählbar, wird in den meisten Fällen jedoch nicht anders benannt.

## 4   Datentypen

| **NumPy-Typ**    | **C-Typ**          | **Beschreibung**                               |
| ---------------- | ------------------ | ---------------------------------------------- |
| **`bool_`**      | `bool`             | Boolean (True oder False)                      |
| **`int8`**       | `signed char`      | Ganze Zahl, 8 Bit, Bereich: -128 bis 127       |
| **`uint8`**      | `unsigned char`    | Ganze Zahl, 8 Bit, Bereich: 0 bis 255          |
| **`int16`**      | `short`            | Ganze Zahl, 16 Bit, Bereich: -32k bis 32k      |
| **`uint16`**     | `unsigned short`   | Ganze Zahl, 16 Bit, positiv                    |
| **`int32`**      | `int`              | Ganze Zahl, 32 Bit                             |
| **`uint32`**     | `unsigned int`     | Ganze Zahl, 32 Bit, positiv                    |
| **`int64`**      | `long` / `int64_t` | Ganze Zahl, 64 Bit                             |
| **`uint64`**     | `unsigned long`    | Ganze Zahl, 64 Bit, positiv                    |
| **`float16`**    | `half`             | Fließkommazahl, 16 Bit (geringere Genauigkeit) |
| **`float32`**    | `float`            | Fließkommazahl, 32 Bit                         |
| **`float64`**    | `double`           | Fließkommazahl, 64 Bit (Standard)              |
| **`complex64`**  | `float complex`    | Komplexe Zahl (2×32 Bit floats)                |
| **`complex128`** | `double complex`   | Komplexe Zahl (2×64 Bit floats)                |
| **`object_`**    | `PyObject*`        | Beliebiges Python-Objekt                       |
| **`string_`**    | `char[]`           | Fester Byte-String (ASCII)                     |
| **`unicode_`**   | `Py_UNICODE[]`     | Unicode-String                                 |
### 4.1   Definition eines Datentyps

```python
arr = np.array([1, 2, 3], dtype=np.int32)
print(arr.dtype)
```

### 4.2   Casten (Typenumwandlung)

```python
arr_float = arr.astype(np.float64)
arr_bool = arr.astype(bool)
arr_str = arr.astype(str)
```

## 5   Arrays erstellen

```python
# Erstellen eines 1D-Arrays
arr = np.array([1, 2, 3, 4, 5])

# Erstellen eines 2D-Arrays
arr = np.array([[1, 2, 3], [4, 5, 6]])

# Null-Array erstellen
zeros = np.zeros(shape=(3, 3))

# Einsen-Array erstellen
ones = np.ones((2, 2))

# Einheitsmatrix
identity = np.eye(3)

# Leeres Array erstellen
empty_array = np.empty((2, 3))

# Array mit einem Wertebereich
range_array = np.arange(0, 10, 2)

# Gleichmäßig verteilte Werte
linspace_array = np.linspace(0, 1, 5)
```

## 6   Eigenschaften von Arrays

```python
def print_array_info(array: np.ndarray) -> None:
    print(f'ndim: {array.ndim}')    # Anzahl der Dimensionen
    print(f'shape: {array.shape}')  # Form des Arrays
    print(f'size: {array.size}')    # Anzahl der Elemente
    print(f'dtype: {array.dtype}')  # Datentyp des Arrays
    print(f'values:\n{array}\n')    # Werte
```

**Beispiel:**

```python
# Erstellen eines 2D-Arrays (3 Zeilen, 4 Spalten)
arr2D = np.array([[1, 2, 3, 4],
                  [5, 6, 7, 8],
                  [9, 10, 11, 12]])

# Eigenschaften des Arrays
ndim = arr2D.ndim
shape = arr2D.shape
size = arr2D.size
dtype = arr2D.dtype

print('Anzahl der Dimensionen:', ndim)  # 2
print('Form des Arrays:', shape)        # (3, 4)
print('Anzahl der Elemente:', size)     # 12
print('Datentyp der Elemente:', dtype)  # int64
```

## 7   Grundlegende Operationen

```python
# Arithmetische Operationen
sum_array = arr + 2
sum_array = arr - 2
mul_array = arr * 2
div_array = arr / 2

# Möglich sind auch die kombinierten Zuweisungsoperatoren
arr += 2
arr -= 2
# ...

# Elementweise Operationen
exp_array = np.exp(arr)
sqrt_array = np.sqrt(arr)
log_array = np.log(arr)
```

## 8   Indizierung und Slicing

Die Array-Indexierung bezieht sich auf jede Verwendung von eckigen Klammern (`[]`), um auf Array-Werte zuzugreifen. Es gibt mehrere Möglichkeiten zur Indexierung, was die NumPy-Indexierung besonders leistungsfähig macht.

> [!INFO]
> Slices von Arrays kopieren die internen Array-Daten nicht, sondern erzeugen lediglich neue Ansichten der Daten.

```python
# Zugriff auf ein Element
val = arr[2]           # Drittes Element

# Slicing
sub_array = arr[1:4]   # Elemente von Index 1 bis 3

# Zugriff auf Zeilen und Spalten
row = arr[1, :]        # Zweite Zeile
two_cols = arr[:, :2]  # Erste zwei Spalten
inner = array[1:-1, 1:-1]  # Array ohne die äußere Zeilen und Spalten
```

**Allgemeine Syntax:**

```python
[start:stop:step]
```

Standardwerte (wenn nichts angegeben wird):

- Start: `0`
- Stop: Bis zum Ende
- Step: `2` (jeder 2. Wert)

[NumPy user guide: Slicing and striding](https://numpy.org/doc/2.2/user/basics.indexing.html)
## 9   Aggregationsfunktionen

```python
sum_value = np.sum(arr)
mean_value = np.mean(arr)
min_value = np.min(arr)
max_value = np.max(arr)
std_dev = np.std(arr)

# Anzahl der Zahlen < 0
count_negative = np.count_nonzero(arr)
count_negative = np.sum(arr < 0)  # Alternative
```

## 10   Mathematische Operationen

```python
# Matrixmultiplikation
matmul_result = np.dot(arr, arr.T)

# Alternative Matrixmultiplikation
matmul_alt = arr @ arr.T
```

## 11   Array-Manipulation

```python
# Reshape (Umformen)
reshaped = arr1.reshape(3, 2)

# Transponieren
transposed = arr.T

# Stapeln von Arrays
vstacked = np.vstack([arr1, arr2])  # Vertikales Stapeln
hstacked = np.hstack([arr1, arr2])  # Horizontales Stapeln

# Alternative zum Stapeln
vstacked = np.concatenate([arr1, arr2], axis=0)  # Vertikales Stapeln
hstacked = np.concatenate([arr1, arr2], axis=1)  # Horizontales Stapeln

# Arrays zusammenfügen mit concatenate
concatenated = np.concatenate([arr1, arr2])             # 1D Arrays
concat_2D_axis0 = np.concatenate([arr1, arr2], axis=0)  # Zeilen anhängen
concat_2D_axis1 = np.concatenate([arr1, arr2], axis=1)  # Spalten anhängen

# In 1D umwandeln
flat1 = arr.flatten()  # Gibt eine Kopie zurück
flat2 = arr.ravel()    # Gibt eine Ansicht zurück (wenn möglich)
```

Erweiterung der Dimension eines Arrays mit `np.newaxis`:

```python
arr1D = np.array([1, 2, 3, 4])

# Umwandlung in Spalten-Vektor (4 Zeilen, 1 Spalte)
col_vector = arr1D[:, np.newaxis]

# Umwandlung in Zeilen-Vektor (1 Zeile, 4 Spalten)
row_vector = arr1D[np.newaxis, :]

print('Original:', arr1D.shape)             # Original: (4,)
print('Spalten-Vektor:', col_vector.shape)  # Spalten-Vektor: (4, 1)
print('Zeilen-Vektor:', row_vector.shape)   # Zeilen-Vektor: (1, 4)
```

## 12   Zufallszahlen

Matrix der Größe 5x5 mit $M_{i,j}\in[-10, 10]$:

```python
M = np.random.randint(low=-10, high=11, size=(5, 5))
# Der untere Wert ist inklusive, der obere nicht!
```

Als `float`:

```python
N = np.random.uniform(-10, 10, size=(5, 5))
```

Weitere Funktionen:

```python
rand_num = np.random.rand(3, 3)  # Zufallszahlen zwischen 0 und 1
rand_ints = np.random.randint(0, 10, (2, 3))  # Zufällige Ganzzahlen
normal_dist = np.random.randn(3, 3)  # Normalverteilte Zufallszahlen
```

## 13   Bedingte Auswahl

```python
# Bedingte Auswahl mit Masken
mask = arr > 2
filtered = arr[mask]  # Enthält nur Werte > 2
```

## 14   Speichern und Laden

```python
np.save('array.npy', arr)           # Speichern
loaded_array = np.load('array.npy')  # Laden
```

## 15   Ufuncs (Universal Functions)

Eine Universal Function ist eine Funktion, welche auf ein `ndarray` elementweise angewendet wird. Es handelt sich um einen 'vektorbasierten' Wrapper für eine Funktion, die eine feste Anzahl spezifischer Eingaben nimmt und eine feste Anzahl spezifischer Ausgaben erzeugt.

Ufuncs sind teilweise 1000-2000 x schneller, als eine Lösung über Python-Code (ohne Numpy).

## 16   Häufig verwendete Funktionen

| **Funktion**        | **Beschreibung**                                   |
| ------------------- | -------------------------------------------------- |
| `np.add(x, y)`      | Elementweise Addition                              |
| `np.subtract(x, y)` | Elementweise Subtraktion                           |
| `np.multiply(x, y)` | Elementweise Multiplikation                        |
| `np.divide(x, y)`   | Elementweise Division                              |
| `np.power(x, y)`    | Potenzieren: `x**y` für jedes Element              |
| `np.mod(x, y)`      | Rest der Division: `x % y`                         |
| `np.floor(x)`       | Abrunden auf nächste ganze Zahl (nach unten)       |
| `np.ceil(x)`        | Aufrunden auf nächste ganze Zahl (nach oben)       |
| `np.round(x)`       | Runden auf nächste ganze Zahl                      |
| `np.sqrt(x)`        | Quadratwurzel jedes Elements                       |
| `np.exp(x)`         | Exponentialfunktion: `e^x` für jedes Element       |
| `np.log(x)`         | Natürlicher Logarithmus                            |
| `np.log10(x)`       | Zehner-Logarithmus                                 |
| `np.sin(x)`         | Sinus jedes Elements (x in Radiant)                |
| `np.cos(x)`         | Kosinus jedes Elements                             |
| `np.tan(x)`         | Tangens jedes Elements                             |
| `np.abs(x)`         | Absoluter Betrag jedes Elements                    |
| `np.maximum(x, y)`  | Größter Wert zwischen `x` und `y` (elementweise)   |
| `np.minimum(x, y)`  | Kleinster Wert zwischen `x` und `y` (elementweise) |

[NumPy user guide: Universal functions](https://numpy.org/doc/2.2/reference/ufuncs.html#ufuncs)

**Beispiel:**

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

result = np.add(a, b)  # [5, 7, 9]
```

## 17   Aggregates (Aggregat-Funktionen)

Aggregatfunktionen (engl. aggregate functions) sind Funktionen, die aus einer großen Menge von Werten einen einzigen zusammengefassten Wert berechnen.

Sie werden oft verwendet, um statistische Kennzahlen aus Arrays zu ermitteln, z. B. Summe, Mittelwert oder Maximum.

### 17.1   Typische Funktionen

| **Funktion**          | **Beschreibung**                  |
| --------------------- | --------------------------------- |
| `np.sum()`            | Summe aller Elemente im Array     |
| `np.mean()`           | Arithmetischer Mittelwert         |
| `np.min()`/`np.max()` | Kleinster / größter Wert im Array |
| `np.std()`            | Standardabweichung                |
| `np.var()`            | Varianz                           |
| `np.median()`         | Median (Zentralwert)              |
| `np.prod()`           | Produkt aller Elemente im Array   |

**Beispiel:**

```python
import numpy as np

arr = np.array([1, 2, 3, 4, 5])

print(np.sum(arr))    # 15
print(np.mean(arr))   # 3.0
print(np.std(arr))    # 1.414...
```

Mit `axis=` kann man die Funktion entlang einer bestimmten Achse anwenden.

**Beispiel:**

```python
import numpy as np

# 2D-Array mit 3 Zeilen und 4 Spalten
arr2D = np.array([[1, 2, 3, 4],
                  [5, 6, 7, 8],
                  [9, 10, 11, 12]])

# Summe pro Spalte (↓)
sum_cols = np.sum(arr2D, axis=0)

# Summe pro Zeile (→)
sum_rows = np.sum(arr2D, axis=1)

print('Summe pro Spalte:', sum_cols)  # [15 18 21 24]
print('Summe pro Zeile:', sum_rows)   # [10 26 42]
```

* `axis=0` ➝ Berechnung erfolgt **über Zeilen hinweg** → ergibt Spalten-Ergebnisse
* `axis=1` ➝ Berechnung erfolgt **über Spalten hinweg** → ergibt Zeilen-Ergebnisse

## 18   Broadcasting

Broadcasting beschreibt die Fähigkeit von NumPy, Arrays unterschiedlicher Form automatisch so zu erweitern, dass sie elementweise Operationen miteinander durchführen können.

👉 Wenn man z. B. ein Array mit einem Skalar oder mit einem kleineren Array kombiniert, passt NumPy intern die Formen an, ohne dass man explizit etwas tun muss.

Vorteile:

- Spart Schleifen
- Spart Speicher
- Sehr schnell dank NumPy-Optimierung

**Beispiel 1: Array + Skalar**

```python
a = np.array([1, 2, 3])
b = 10

result = a + b  # [11, 12, 13]
```


 **Beispiel 2: 2D + 1D**

```python
A = np.array([[1, 2, 3],
              [4, 5, 6]])
B = np.array([10, 20, 30])

result = A + B
```

Intern:

```
[[ 1,  2,  3]     [[10, 20, 30]     [[11, 22, 33]
 [ 4,  5,  6]]  +  [10, 20, 30]]  =  [14, 25, 36]]
```

### 18.1   Broadcasting-Regeln

### 18.2   Von hinten vergleichen:

NumPy vergleicht die Dimensionen von rechts nach links.

**Beispiel:**

```python
A.shape = (3, 4)
B.shape = (4,)  # entspricht intern (1, 4)
```

**Vergleich:**

```
A: (3, 4)
B:    (4)    → automatisch zu (1, 4)
```

✅ passt! → Broadcasting funktioniert → B wird auf jede der 3 Zeilen 'kopiert'

### 18.3   Dimensionen müssen gleich sein oder eine von beiden muss 1 sein


**Beispiel 1:**

```python
A = np.ones((5, 1))
B = np.ones((1, 4))

# Ergebnisform: (5, 4)
```

Vergleich:

```
A: (5, 1)
B: (1, 4)
```

✅ 1 kann zu 4 gebroadcastet werden → ergibt (5, 4)

**Beispiel 2:**

```python
A = np.ones((3, 2))
B = np.ones((3,))
```

Vergleich:

```
A: (3, 2)
B:     (3)
```

❌ 2 vs. 3 → nicht kompatibel, weil 2 ≠ 3 und keine davon ist 1

### 18.4   Fehlende Dimensionen werden als 1 ergänzt (vorne)

**Beispiel:**

```python
A = np.ones((4,))          # (4,)
B = np.ones((3, 4))        # (3, 4)
```

**Vergleich:**

```
A:     (1, 4)
B: (3, 4)
```

- `1` funktioniert wie ein Platzhalter → es wird 'in diese Richtung' kopiert
- Fehlende Dimension? → einfach eine `1` davor denken!

## 19   Masken und Vergleichsoperatoren

```python
arr = np.array([1, 2, 3, 4, 5])

# Vergleichsoperationen erzeugen boolesche Masken
mask_gt = arr > 3     # [False False False  True  True]
mask_eq = arr == 2    # [False  True False False False]
mask_le = arr <= 4    # [ True  True  True  True False]

# Masken zur Auswahl verwenden
filtered = arr[mask_gt]  # [4 5]

# Direkt als Bedingung
filtered_direct = arr[arr % 2 == 0]  # [2 4] → alle geraden Zahlen
```

Indizes der Werte, die größer gleich Null sind:

```python
idxs = np.where(arr >= 0)
```

**Vergleichsoperatoren:**

| **Ausdruck** | **Bedeutung**       |
| ------------ | ------------------- |
| ==           | gleich              |
| !=           | ungleich            |
| `<`          | kleiner als         |
| `<=`         | kleiner oder gleich |
| `>`          | größer als          |
| `>=`         | größer oder gleich  |

Masken können mit logischen Operatoren kombiniert werden:

```python
arr[(arr > 1) & (arr < 5)]  # [2 3 4]
```

## 20   Zufallsfunktionen (`np.random`)

```python
import numpy as np

# Gleichverteilte Zufallszahlen (0 bis 1)
uniform = np.random.rand(2, 3)

# Normalverteilte Zufallszahlen (Mittel=0, Std=1)
normal = np.random.randn(2, 3)

# Zufällige Ganzzahlen
rand_ints = np.random.randint(0, 10, size=(2, 3))  # von 0 bis 9

# Zufällige Auswahl aus Array
arr = np.array([10, 20, 30, 40])
choice = np.random.choice(arr, size=2, replace=False)  # ohne Wiederholung

# Mischen eines Arrays (in-place)
np.random.shuffle(arr)  # verändert arr direkt

# Setzen des Zufallsseeds für Reproduzierbarkeit
np.random.seed(42)
```

| **Funktion**               | **Beschreibung**                                         |
| -------------------------- | -------------------------------------------------------- |
| `np.random.rand(dims...)`  | Gleichverteilte `float`-Zufallszahlen (zwischen 0 und 1) |
| `np.random.randn(dims...)` | Normalverteilte Zufallszahlen (Mittel=0, Std=1)          |
| `np.random.randint(a, b)`  | Zufällige Ganzzahlen im Bereich [a, b)                   |
| `np.random.choice()`       | Zufällige Auswahl aus einem Array                        |
| `np.random.shuffle()`      | Mischt ein Array in-place                                |
| `np.random.seed(n)`        | Setzt den Seed zur Steuerung der Zufälligkeit            |

## 21   Weitere wichtige Funktionen

### 21.1   Achsen verschieben & transponieren

```python
import numpy as np

a = np.zeros((2, 3, 4))

# Achsen vertauschen (z. B. für Bildverarbeitung)
a_moved = np.moveaxis(a, 0, -1)     # Achse 0 nach hinten → shape (3, 4, 2)
a_transposed = np.transpose(a, (2, 0, 1))  # explizite Neuanordnung der Achsen
```

**Wann moveaxis, wann transpose?**

- `moveaxis`: Wenn eine oder mehrere Achsen gezielt verschieben werden sollen.
- `transpose`: Wenn eine vollständige neue Achsenreihenfolge angegeben wird.

### 21.2   Rollendes Verschieben

```python
arr = np.array([1, 2, 3, 4, 5])
rolled = np.roll(arr, shift=2)  # [4 5 1 2 3]
```

Funktioniert auch mit mehrdimensionalen Arrays → `np.roll(arr2D, shift=1, axis=0)`

### 21.3   Indizes & Matrix-Tools

```python
# Koordinaten eines Grids
idx = np.indices((2, 3))  # shape: (2, 2, 3) → für 2D: y- und x-Koordinaten

# Indizes der Diagonale
d_idx = np.diag_indices(n=3)  # ([0,1,2], [0,1,2])

# Untere Dreiecksmatrix
tril_idx = np.tril_indices(n=3)

# Obere Dreiecksmatrix
triu_idx = np.triu_indices(n=3)
```

Diese sind besonders nützlich zum Indexieren von Diagonalen, Dreiecksbereichen oder Rasterpunkten.

### 21.4   Indizes nach Ordnung / Extremwerten

```python
arr = np.array([10, 20, 5, 30])

# Index der Sortierung
idx_sorted = np.argsort(arr)   # [2 0 1 3]

# Index des Maximums / Minimums
idx_max = np.argmax(arr)       # 3
idx_min = np.argmin(arr)       # 2
```

### 21.5   Sonstiges

```python
# Diagonale mit Werten füllen
np.fill_diagonal(M, np.pi)
```

## 22   Daten speichern & laden mit NumPy

> [!INFO]
> Die folgenden Funktionen sind auch mit [[pandas|Pandas]] möglich und i. d. R. einfacher zu handhaben.

### 22.1   Binäres Speichern (schnell & effizient)

**`np.save()`: Speichert ein einzelnes Array als `.npy`-Datei**

```python
arr = np.array([1, 2, 3])
np.save('array.npy', arr)  # speichert binär
```

**`np.savez()`: Speichert mehrere Arrays in einer komprimierten ZIP-Datei**

```python
a = np.arange(5)
b = np.linspace(0, 1, 5)

np.savez('arrays.npz', first=a, second=b)

data = np.load('arrays.npz')
print(data['first'])   # Zugriff auf gespeicherte Arrays
```

**`np.load()`: Lädt .npy- oder .npz-Dateien**

```python
loaded = np.load('array.npy')
```

### 22.2   Speichern im Textformat

**`np.savetxt()`: Speichert Array als Klartext (CSV, TSV etc.)**

```python
arr = np.array([[1, 2], [3, 4]])
np.savetxt('array.txt', arr, fmt='%d', delimiter=',')
```

**`np.loadtxt()`: Lädt ein Array aus einer Textdatei**

```python
loaded_txt = np.loadtxt('array.txt', delimiter=',')
```

Nur für einfache, numerische Arrays geeignet. Keine Metadaten oder Struktur.

### 22.3   Strukturierte Arrays

```python
data = np.array([
    (1, 1.5, 'A'),
    (2, 2.5, 'B')
], dtype=[('id', 'i4'), ('value', 'f4'), ('label', 'U1')])

print(data['id'])        # Zugriff auf Spalte
print(data[0]['label'])  # Zugriff auf Zelle
```

- .npy = kompaktes, schnelles Binärformat für ein Array
- .npz = ZIP-Container für mehrere Arrays
- Textformate sind lesbar, aber langsamer und weniger genau

