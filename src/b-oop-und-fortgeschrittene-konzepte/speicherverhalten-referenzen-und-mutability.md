# Speicherverhalten, Referenzen und Mutability

Die folgenden Konzepte sind zentral für das Verständnis von Speicherverhalten und Referenzen. Dieses ist wichtig, um Seiteneffekte und unerwartetes Verhalten zu vermeiden.

## 1    Speicherverwaltung und Garbage Collection

### 1.1    Speicherverwaltung

Python verwaltet den Speicher auf zwei Ebenen:

1. **Private Heap**
	- Alles, was in Python anlegt wird (Variablen, Objekte, Listen usw.), wird im sogenannten *private heap* gespeichert.
	- Man hat keinen direkten Zugriff auf diesen Heap, sondern nur über Python-Objekte.

2. **Speicherallokatoren (Memory Manager)**
	- Python hat einen internen Mechanismus, der entscheidet, wann wie viel Speicher angefordert wird.
	- Objekte kleiner als 512 Bytes werden z. B. in einem speziellen Arena-basierten System verwaltet (über das Modul `pymalloc`).

### 1.2    Garbage Collection

Garbage Collection bedeutet, dass nicht mehr benötigte Objekte automatisch aus dem Speicher entfernt werden.

#### 1.2.1    Referenzzählung

Das ist die primäre Methode der Speicherfreigabe:

```python
import sys

x = []                     # Liste wird erstellt
print(sys.getrefcount(x))  # 2
y = x                      # Jetzt gibt es 2 Referenzen
print(sys.getrefcount(x))  # 3
del x                      # Eine Referenz weniger
print(sys.getrefcount(y))  # 2
```

#### 1.2.2    Zyklische Garbage Collection

Referenzzählung reicht nicht aus, wenn zwei Objekte sich gegenseitig referenzieren:

```python
class Node:
    def __init__(self):
        self.ref = None

a = Node()
b = Node()
a.ref = b
b.ref = a  # Zyklus
del a
del b      # → Referenzzähler wird nicht null
```

Daher hat Python ein zusätzliches Garbage Collector-Modul, das Zyklen erkennen und auflösen kann:

```python
import gc

gc.collect()  # Startet manuelle Garbage Collection
```

### 1.3    Tools & Module

- `gc`: Garbage-Collector-Modul
- `sys.getrefcount(obj)`: Anzahl der Referenzen auf ein Objekt
- `id(obj)`: Gibt die Speicheradresse des Objekts zurück
- `hex(id(obj))`: Speicher Adresse als HEX

### 1.4    Zusammenfassung

| Feature               | Beschreibung                                                   |
| --------------------- | -------------------------------------------------------------- |
| **Heap**              | Speicherort aller Objekte                                      |
| **Referenzzählung**   | Basis-Mechanismus zur Speicherfreigabe                         |
| **Zyklische GC**      | Entfernt Objektzyklen, die Referenzzähler nicht abfängt        |
| **`gc`-Modul**        | Ermöglicht Kontrolle über die Garbage Collection               |


## 2    Variablen und Referenzen

In Python sind Variablen keine Container, sondern Namen, die auf Objekte im Speicher verweisen. Das Verständnis von Variablenbindung und Referenzen ist essenziell, um Seiteneffekte und unerwartetes Verhalten zu vermeiden.

**Variablen binden Namen an Objekte:**

Eine Variable in Python ist ein Name, der auf ein Objekt zeigt. Es wird keine Kopie erzeugt, sondern eine Referenz.

```python
a = [1, 2, 3]
b = a     # b referenziert dasselbe Objekt wie a
a.append(4)
print(b)  # [1, 2, 3, 4] -> b wurde mit verändert
```

**Referenzen und `id()`:**

Jedes Objekt hat eine eindeutige ID (Speicheradresse), die mit `id()` abgefragt werden kann.

```python
x = 'hello'
y = x
print(id(x) == id(y))  # True -> beide zeigen auf dasselbe Objekt

x = x + ' world'  # neues Objekt
print(id(x) == id(y))  # False -> x zeigt jetzt auf etwas anderes
```

**Zuweisung erzeugt keine Kopie:**

```python
data = {'key': 'value'}
copy = data  # keine Kopie, nur neue Referenz
copy['key'] = 'new value'
print(data)  # {'key': 'new value'}
```

### 2.1    Referenzen in Funktionen

Wird ein Objekt an eine Funktion übergeben, wird nur eine Referenz übergeben – keine Kopie.

```python
def change_list(lst):
    lst.append(42)

numbers = [1, 2, 3]
change_list(numbers)
print(numbers)  # [1, 2, 3, 42]
```

Bei unveränderlichen Objekten (z. B. int, str) wirkt sich das nicht aus:

```python
def change_value(x):
    x = x + 1  # neue Referenz innerhalb der Funktion

value = 10
change_value(value)
print(value)  # 10
```

### 2.2    `is` vs. ==

- == prüft Gleichheit des Inhalts
- `is` prüft, ob zwei Variablen auf **dasselbe Objekt** zeigen

```python
a = [1, 2, 3]
b = a
c = [1, 2, 3]

print(a == c)  # True -> Inhalt gleich
print(a is c)  # False -> unterschiedliche Objekte
print(a is b)  # True -> gleiche Referenz
```

### 2.3    Objektidentität bei Mutability

Mutability beeinflusst das Verhalten bei Referenzen stark:

```python
def reset_list(l):
    l.clear()  # verändert Originalobjekt

my_list = [9, 8, 7]
reset_list(my_list)
print(my_list)  # []
```

Bei immutable Typen wie `int` passiert das nicht:

```python
def reset_number(n):
    n = 0  # neue Referenz, Original bleibt gleich

my_number = 123
reset_number(my_number)
print(my_number)  # 123
```

### 2.4    Namen und Gültigkeit (Scope)

Variablen sind innerhalb des jeweiligen Gültigkeitsbereichs (Scope) sichtbar. Eine Zuweisung innerhalb einer Funktion überschreibt nicht die äußere Variable.

```python
name = 'outer'

def test():
    name = 'inner'
    print(name)  # 'inner'

test()
print(name)  # 'outer'
```

### 2.5    Zusammenfassung

- Variablen sind Namen, keine Container.
- Zuweisung erzeugt Referenzen, keine Kopien.
- Mutable Objekte können über mehrere Referenzen verändert werden.
- Unveränderliche Objekte bleiben von außen unbeeinflusst.
- `is` prüft Identität, == prüft Gleichheit.

## 3    Mutability von Datentypen

In Python unterscheidet man zwischen **veränderlichen (mutable)** und **unveränderlichen (immutable)** Datentypen. Dieses Konzept ist zentral für das Verständnis von Speicherverhalten, Referenzen und Seiteneffekten.

> [!INFO] mutable vs immutable
> Ein **mutable** Objekt kann nach seiner Erstellung verändert werden. Änderungen wirken sich auf alle Referenzen auf dieses Objekt aus.
>
> Ein **immutable** Objekt kann nicht verändert werden. Jede Änderung erzeugt ein neues Objekt.

> [!tip] Mutability prüfen mit `id()`
> Die `id()`-Funktion zeigt die Speicheradresse eines Objekts. So erkennt man, ob eine Änderung ein neues Objekt erzeugt hat.
>
> ```python
> s = 'abc'
> print(id(s))  # 4380616160
> s  += 'd'
> print(id(s))  # 4934619072 (Neue ID)
> ```

### 3.1    Beispiele für immutable Typen

- `int`
- `float`
- `str`
- `tuple`
- `frozenset`
- `bool`

```python
x = 10
print(id(x))  # 4381074208
y = x
print(id(y))  # 4381074208
x = x + 1     # neues Objekt wird erstellt
print(id(x))  # 4381074240
print(x)      # 11
print(y)      # 10
```

```python
a = 'hello'
print(id(a))   # 4843587312
b = a
print(id(b))   # 4843587312
a += ' world'  # neuer String, neue Referenz
print(id(a))   # 4934764784
print(a)       # 'hello world'
print(b)       # 'hello'
```

### 3.2    Beispiele für mutable Typen

- `list`
- `dict`
- `set`
- `bytearray`
- user-defined classes (standardmäßig)

```python
items = [1, 2, 3]
copy = items
items.append(4)  # verändert das Objekt selbst
print(items)  # [1, 2, 3, 4]
print(copy)   # [1, 2, 3, 4] -> auch verändert
```

```python
settings = {'theme': 'dark'}
ref = settings
settings['theme'] = 'light'  # Änderung wirkt auf beide Referenzen
print(ref)  # {'theme': 'light'}
```

### 3.3    Typen in Klassenattributen

Bei eigenen Klassen ist das Verhalten abhängig vom verwendeten Datentyp:

```python
class User:
    def __init__(self, name):
        self.name = name  # str ist immutable
        self.tags = []    # list ist mutable

u1 = User('Alice')
u2 = u1
u1.tags.append('admin')   # wirkt auch auf u2
print(u2.tags)            # ['admin']
```


### 3.4    Auswirkungen auf Funktionsparameter

Mutable Objekte können in Funktionen verändert werden, was außerhalb der Funktion sichtbar ist.

```python
def modify_list(lst):
    lst.append(99)  # verändert die übergebene Liste

nums = [1, 2, 3]
modify_list(nums)
print(nums)         # [1, 2, 3, 99]
```

Bei immutable Objekten passiert das nicht:

```python
def modify_number(n):
    n += 1  # neues Objekt innerhalb der Funktion

x = 10
modify_number(x)
print(x)  # 10
```

### 3.5    Zusammenfassung

| Datentyp     | Mutable                                  |
| ------------ | ---------------------------------------- |
| `int`        | Nein                                     |
| `str`        | Nein                                     |
| `bool`       | Nein                                     |
| `tuple`      | Nein (aber Inhalt kann mutable sein)     |
| `list`       | Ja                                       |
| `dict`       | Ja                                       |
| `set`        | Ja                                       |
| `user class` | Abhänigig von den verwendeten Datentypen |

Mutability beeinflusst, wie sich Daten in Speicher, Referenzen und Funktionen verhalten. Ein gutes Verständnis hilft, Bugs und unerwartetes Verhalten zu vermeiden.

## 4    In-Place Operations und Shallow bzw. Deep Copy

### 4.1    In-Place Operations

In-Place Operationen ändern ein Objekt direkt, ohne eine neue Kopie zu erstellen. Das spart Speicher, kann aber zu Seiteneffekten führen, wenn mehrere Referenzen auf das gleiche Objekt existieren.

**Listen verändern:**

```python
numbers = [1, 2, 3]
numbers.append(4)  # verändert das Objekt selbst
print(numbers)  # [1, 2, 3, 4]
```

**`+=` bei Listen:**

```python
data = [1, 2]
other = data
data += [3, 4]  # in-place Änderung
print(data)   # [1, 2, 3, 4]
print(other)  # [1, 2, 3, 4] -> auch verändert
```

> [!warning] `+=` kann auch eine neue Referenz erzeugen (bei immutable Typen)
>
> Bei immutable Typen wie `int`, `str`, `tuple` wird keine In-Place-Änderung durchgeführt.
>
> Beispiel:
> ```python
> x = 10
> y = x
> x += 5  # erzeugt neues Objekt
> print(x)  # 15
> print(y)  # 10
> ```

### 4.2    Shallow Copy (flache Kopie)

Eine flache Kopie kopiert nur die äußere Struktur, nicht die enthaltenen Objekte.

**Beispiel mit `copy.copy()`**:

```python
import copy

original = [[1, 2], [3, 4]]
shallow = copy.copy(original)

shallow[0][0] = 99  # verändert auch 'original'
print(original)  # [[99, 2], [3, 4]]
```

- `shallow` und `original` teilen sich die inneren Listen.
- Nur die erste Ebene wird kopiert.

### 4.3    Deep Copy (tiefe Kopie)

Eine tiefe Kopie erstellt eine vollständige Kopie aller Ebenen, rekursiv.

**Beispiel mit `copy.deepcopy()`:**

```python
import copy

original = [[1, 2], [3, 4]]
deep = copy.deepcopy(original)

deep[0][0] = 99
print(original)  # [[1, 2], [3, 4]]
```

- `deep` ist vollständig unabhängig von `original`.
- Änderungen wirken sich nicht auf das Original aus.

**Vergleich Shallow vs. Deep Copy:**

```python
import copy

data = [{'a': 1}, {'b': 2}]
shallow = copy.copy(data)
deep = copy.deepcopy(data)

shallow[0]['a'] = 99
print(data)       # [{'a': 99}, {'b': 2}]
print(deep)       # [{'a': 1}, {'b': 2}]
```

> [!warning] Kopieren mit Slicing oder Konstruktor
> Beim Kopieren durch Slicing oder die Verwendung eines Konstruktors werden nur flache Kopien erzeugt:
>
> ```python
> original = [1, 2, 3]
> copy1 = original[:]       # flache Kopie
> copy2 = list(original)    # ebenfalls flach
>
> copy1.append(4)
> print(original)           # [1, 2, 3]
> print(copy1)              # [1, 2, 3, 4]
> ```

### 4.4    Wann welche Kopie verwenden?

| Situation                         | Empfehlung                |
| --------------------------------- | ------------------------- |
| Nur äußere Struktur kopieren      | `copy.copy()`             |
| Vollständig unabhängig kopieren   | `copy.deepcopy()`         |
| Performance wichtig, Inhalt flach | `list()`, Slicing (`[:]`) |

### 4.5    Zusammenfassung

- In-Place Operationen ändern das Objekt direkt.
- Shallow Copies duplizieren nur die oberste Ebene.
- Deep Copies duplizieren rekursiv die komplette Struktur.
- Vorsicht bei verschachtelten Strukturen – dort macht `deepcopy` den Unterschied.

## 5    Memory Profiling mit `tracemalloc`

`tracemalloc` ist ein eingebautes Modul zum Überwachen und Analysieren des Speicherverbrauchs von Python-Programmen. Es hilft, Speicherlecks zu finden und den Speicherverbrauch zu optimieren.

### 5.1    Grundlegende Verwendung
```python
import tracemalloc

# Tracking starten
tracemalloc.start()

# Code ausführen
data = [i for i in range(1000000)]

# Aktuellen Speicherverbrauch abrufen
current, peak = tracemalloc.get_traced_memory()
print(f"Current memory: {current / 1024 / 1024:.2f} MB")
print(f"Peak memory: {peak / 1024 / 1024:.2f} MB")

# Tracking stoppen
tracemalloc.stop()
```

### 5.2    Snapshots und Vergleiche

Snapshots ermöglichen es, den Speicherverbrauch zu verschiedenen Zeitpunkten zu vergleichen.
```python
import tracemalloc

tracemalloc.start()

# Erster Snapshot
snapshot1 = tracemalloc.take_snapshot()

# Code ausführen
data = [i * 2 for i in range(1000000)]

# Zweiter Snapshot
snapshot2 = tracemalloc.take_snapshot()

# Unterschiede anzeigen
stats = snapshot2.compare_to(snapshot1, 'lineno')

print("Top 10 Speicherzuwächse:")
for stat in stats[:10]:
    print(stat)
```

### 5.3    Top-Statistiken anzeigen
```python
import tracemalloc

tracemalloc.start()

# Speicherintensiver Code
large_list = [i for i in range(5000000)]
large_dict = {i: str(i) for i in range(100000)}

# Snapshot nehmen
snapshot = tracemalloc.take_snapshot()

# Top 10 nach Speicherverbrauch
top_stats = snapshot.statistics('lineno')

print("Top 10 Memory Consumers:")
for index, stat in enumerate(top_stats[:10], 1):
    print(f"{index}. {stat}")

tracemalloc.stop()
```

**Ausgabe-Beispiel:**
```
Top 10 Memory Consumers:
1. memory_example.py:7: size=38.1 MiB, count=1, average=38.1 MiB
2. memory_example.py:8: size=12.3 MiB, count=100000, average=129 B
```

### 5.4    Speicherlecks finden
```python
import tracemalloc

# Simuliertes Speicherleck
leaked_data = []

def leak_memory():
    """Funktion, die Speicher nicht freigibt"""
    data = [i for i in range(100000)]
    leaked_data.append(data)  # Referenz bleibt bestehen

tracemalloc.start()

snapshot1 = tracemalloc.take_snapshot()

# Mehrfach aufrufen
for _ in range(10):
    leak_memory()

snapshot2 = tracemalloc.take_snapshot()

# Differenz analysieren
top_stats = snapshot2.compare_to(snapshot1, 'lineno')

print("Memory increases:")
for stat in top_stats[:5]:
    print(stat)

tracemalloc.stop()
```

### 5.5    Filtern nach Dateien/Modulen
```python
import tracemalloc
import fnmatch

tracemalloc.start()

# Code ausführen
data = list(range(1000000))

snapshot = tracemalloc.take_snapshot()

# Nur spezifische Dateien
filters = [
    tracemalloc.Filter(True, "*/my_module/*"),  # Include
    tracemalloc.Filter(False, "<frozen*"),      # Exclude frozen modules
    tracemalloc.Filter(False, "<unknown>"),     # Exclude unknown
]

snapshot = snapshot.filter_traces(filters)
top_stats = snapshot.statistics('filename')

for stat in top_stats[:10]:
    print(stat)

tracemalloc.stop()
```

### 5.6    Context Manager für Profiling
```python
from contextlib import contextmanager
import tracemalloc

@contextmanager
def memory_profiler(description="Code Block"):
    """Context Manager für Speicher-Profiling"""
    tracemalloc.start()
    snapshot_before = tracemalloc.take_snapshot()
    
    try:
        yield
    finally:
        snapshot_after = tracemalloc.take_snapshot()
        top_stats = snapshot_after.compare_to(snapshot_before, 'lineno')
        
        print(f"\n=== Memory Profile: {description} ===")
        current, peak = tracemalloc.get_traced_memory()
        print(f"Current: {current / 1024 / 1024:.2f} MB")
        print(f"Peak: {peak / 1024 / 1024:.2f} MB")
        
        print("\nTop 5 allocations:")
        for stat in top_stats[:5]:
            print(stat)
        
        tracemalloc.stop()

# Verwendung
with memory_profiler("List Creation"):
    large_list = [i ** 2 for i in range(1000000)]
```

### 5.7    Detaillierte Traceback-Information
```python
import tracemalloc
import linecache

def display_top(snapshot, key_type='lineno', limit=10):
    """Zeigt Top-Speicherverbraucher mit Traceback"""
    snapshot = snapshot.filter_traces((
        tracemalloc.Filter(False, "<frozen importlib._bootstrap>"),
        tracemalloc.Filter(False, "<unknown>"),
    ))
    top_stats = snapshot.statistics(key_type)

    print(f"Top {limit} lines")
    for index, stat in enumerate(top_stats[:limit], 1):
        frame = stat.traceback[0]
        filename = frame.filename
        lineno = frame.lineno
        
        print(f"#{index}: {filename}:{lineno}: {stat.size / 1024:.1f} KiB")
        
        # Zeile aus Quelldatei
        line = linecache.getline(filename, lineno).strip()
        if line:
            print(f"    {line}")

# Verwendung
tracemalloc.start()

# Speicherintensive Operationen
data1 = [i for i in range(500000)]
data2 = {i: str(i) for i in range(100000)}

snapshot = tracemalloc.take_snapshot()
display_top(snapshot, limit=5)

tracemalloc.stop()
```

### 5.8    Vergleich: Verschiedene Implementierungen
```python
import tracemalloc
import time

def benchmark_memory(func, *args, **kwargs):
    """Misst Speicher und Zeit für Funktion"""
    tracemalloc.start()
    start_time = time.time()
    
    result = func(*args, **kwargs)
    
    current, peak = tracemalloc.get_traced_memory()
    elapsed_time = time.time() - start_time
    tracemalloc.stop()
    
    return {
        'result': result,
        'current_mb': current / 1024 / 1024,
        'peak_mb': peak / 1024 / 1024,
        'time_s': elapsed_time
    }

# Verschiedene Implementierungen testen
def create_list_comprehension(n):
    return [i ** 2 for i in range(n)]

def create_generator(n):
    return list(i ** 2 for i in range(n))

def create_map(n):
    return list(map(lambda x: x ** 2, range(n)))

# Vergleichen
n = 1_000_000
implementations = [
    ('List Comprehension', create_list_comprehension),
    ('Generator Expression', create_generator),
    ('Map', create_map)
]

print(f"Creating {n:,} elements\n")
for name, func in implementations:
    stats = benchmark_memory(func, n)
    print(f"{name}:")
    print(f"  Peak Memory: {stats['peak_mb']:.2f} MB")
    print(f"  Time: {stats['time_s']:.4f} s\n")
```

### 5.9    Speicherlecks in Klassen finden
```python
import tracemalloc
import weakref

class LeakyClass:
    instances = []  # Klassenvariable - hält Referenzen
    
    def __init__(self, data):
        self.data = data
        LeakyClass.instances.append(self)  # Speicherleck!

class CleanClass:
    instances = []
    
    def __init__(self, data):
        self.data = data
        # Schwache Referenz verwenden
        CleanClass.instances.append(weakref.ref(self))

def test_leak():
    tracemalloc.start()
    
    # Leaky Version
    snapshot1 = tracemalloc.take_snapshot()
    
    for _ in range(1000):
        obj = LeakyClass([i for i in range(1000)])
        # obj geht aus dem Scope, aber Referenz bleibt in instances
    
    snapshot2 = tracemalloc.take_snapshot()
    
    # Clean Version
    for _ in range(1000):
        obj = CleanClass([i for i in range(1000)])
    
    snapshot3 = tracemalloc.take_snapshot()
    
    # Vergleich
    print("=== Leaky Class ===")
    stats = snapshot2.compare_to(snapshot1, 'lineno')
    for stat in stats[:3]:
        print(stat)
    
    print("\n=== Clean Class ===")
    stats = snapshot3.compare_to(snapshot2, 'lineno')
    for stat in stats[:3]:
        print(stat)
    
    tracemalloc.stop()

test_leak()
```

### 5.10    Integration in Unit Tests
```python
import tracemalloc
import unittest

class MemoryTestCase(unittest.TestCase):
    def setUp(self):
        tracemalloc.start()
        self.snapshot_before = tracemalloc.take_snapshot()
    
    def tearDown(self):
        snapshot_after = tracemalloc.take_snapshot()
        top_stats = snapshot_after.compare_to(
            self.snapshot_before, 'lineno'
        )
        
        # Warnung bei hohem Speicherverbrauch
        for stat in top_stats[:5]:
            if stat.size_diff > 10 * 1024 * 1024:  # > 10 MB
                print(f"\nWARNING: High memory increase: {stat}")
        
        tracemalloc.stop()
    
    def test_large_allocation(self):
        """Test mit Speicherüberwachung"""
        data = [i for i in range(1000000)]
        self.assertEqual(len(data), 1000000)

if __name__ == '__main__':
    unittest.main()
```

### 5.11    Best Practices

**✅ DO:**
- `tracemalloc` für Entwicklung und Debugging verwenden
- Snapshots vor/nach kritischen Operationen
- Filter verwenden um Noise zu reduzieren
- Mit Context Managers arbeiten
- Peak Memory beachten, nicht nur Current

**❌ DON'T:**
- `tracemalloc` in Produktion laufen lassen (Performance-Overhead ~2-3x)
- Zu häufig Snapshots nehmen (selbst speicherintensiv)
- Ohne Filter arbeiten bei großen Projekten
- `start()` ohne `stop()` aufrufen

### 5.12    Alternative Tools

#### 5.12.1    `memory_profiler`
```bash
pip install memory_profiler
```
```python
from memory_profiler import profile

@profile
def my_func():
    a = [1] * (10 ** 6)
    b = [2] * (2 * 10 ** 7)
    del b
    return a

# Run with: python -m memory_profiler script.py
```

#### 5.12.2    `guppy3` / `heapy`
```bash
pip install guppy3
```
```python
from guppy import hpy

h = hpy()
print(h.heap())
```

#### 5.12.3    `pympler`
```bash
pip install pympler
```
```python
from pympler import asizeof

data = [i for i in range(1000)]
print(f"Size: {asizeof.asizeof(data)} bytes")
```

### 5.13    Praktisches Beispiel: Memory Leak finden
```python
import tracemalloc

class DataProcessor:
    cache = {}  # Klassenvariable - potenzielles Leak
    
    def process(self, data):
        # Cache wächst unbegrenzt
        key = str(data)
        if key not in self.cache:
            self.cache[key] = [d * 2 for d in data]
        return self.cache[key]

def find_leak():
    tracemalloc.start()
    processor = DataProcessor()
    
    snapshots = []
    
    # Mehrere Iterationen
    for i in range(5):
        # Viele verschiedene Daten verarbeiten
        for _ in range(100):
            data = list(range(1000 + i * 100))
            processor.process(data)
        
        snapshot = tracemalloc.take_snapshot()
        snapshots.append(snapshot)
        
        if i > 0:
            stats = snapshot.compare_to(snapshots[i-1], 'lineno')
            print(f"\n=== Iteration {i} ===")
            for stat in stats[:3]:
                print(stat)
    
    # Cache-Größe
    print(f"\nCache entries: {len(DataProcessor.cache)}")
    
    tracemalloc.stop()

find_leak()
```

**Lösung:**
```python
from functools import lru_cache

class DataProcessor:
    @lru_cache(maxsize=100)  # Begrenzter Cache
    def process(self, data):
        data_tuple = tuple(data)  # Hashable machen
        return [d * 2 for d in data_tuple]
```

### 5.14    Zusammenfassung

| Funktion                   | Zweck                                    |
| -------------------------- | ---------------------------------------- |
| `tracemalloc.start()`      | Tracking starten                         |
| `tracemalloc.stop()`       | Tracking stoppen                         |
| `take_snapshot()`          | Speicher-Snapshot erstellen              |
| `get_traced_memory()`      | Current/Peak Memory abrufen              |
| `snapshot.statistics()`    | Top-Verbraucher analysieren              |
| `snapshot.compare_to()`    | Zwei Snapshots vergleichen               |
| `Filter()`                 | Traces filtern                           |

**Kernprinzip:** `tracemalloc` hilft, Speicherlecks zu finden und Speicherverbrauch zu optimieren. Es sollte während der Entwicklung verwendet werden, nicht in Produktion. Kombiniere es mit Snapshots und Filtern für präzise Analysen.