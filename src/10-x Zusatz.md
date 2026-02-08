**Einfügeposition:**

1. **Ersetze** Zeile 202 bis 253 (der bisherige Abschnitt "7 Datenpräsentation" wird zu "7 Speicheroptimierung und Datenpräsentation")
2. Der neue, ausführliche Abschnitt über `__slots__` wird **7.1**
3. Der bisherige Abschnitt "7.1 Dataclass" wird zu **7.2 Dataclass**
4. Der Unterabschnitt "7.1.1 Slots" in Dataclass kann gekürzt werden auf einen Verweis: "Siehe [[#7.1 `__slots__` – Speicher sparen und Performance steigern]] für Details zu `__slots__`."
5. "7.1.2 `frozen=True`" wird zu "7.2.1 `frozen=True`"
6. Abschnitt "7.2 Namedtuple" wird zu **7.3 Namedtuple**
7. Die restlichen Abschnitte (8 Enum, 9 Class Decorator, 10 Zusammenfassung) bleiben bei ihrer Nummerierung

---


## 7 Speicheroptimierung und Datenpräsentation

### 7.1 `__slots__` – Speicher sparen und Performance steigern

Standardmäßig speichert Python Objektattribute in einem Dictionary (`__dict__`). Das ist flexibel, aber speicherintensiv. Mit `__slots__` kann man Speicher sparen und Attributzugriffe beschleunigen.

#### 7.1.1 Grundkonzept
```python
# Ohne __slots__ (Standard)
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

# Mit __slots__
class PersonSlotted:
    __slots__ = ('name', 'age')
    
    def __init__(self, name, age):
        self.name = name
        self.age = age
```

**Speichervergleich:**
```python
import sys

p1 = Person('Alice', 30)
p2 = PersonSlotted('Alice', 30)

print(sys.getsizeof(p1.__dict__))  # ~232 bytes
print(sys.getsizeof(p2))            # ~56 bytes
```

#### 7.1.2 Vorteile von `__slots__`

**1. Reduzierter Speicherverbrauch:**
- Kein `__dict__` pro Instanz
- Besonders wichtig bei vielen Objekten (z.B. 1 Million Instanzen)

**2. Schnellerer Attributzugriff:**
- Direkter Array-Zugriff statt Dictionary-Lookup
- ~20-30% schneller

**3. Typsicherheit:**
- Nur definierte Attribute erlaubt
- Verhindert Tippfehler
```python
class Point:
    __slots__ = ('x', 'y')
    
    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(10, 20)
p.z = 30  # AttributeError: 'Point' object has no attribute 'z'
```

#### 7.1.3 Einschränkungen

**Kein `__dict__`:**
```python
class Slotted:
    __slots__ = ('x', 'y')

obj = Slotted()
print(obj.__dict__)  # AttributeError: 'Slotted' object has no attribute '__dict__'
```

**Keine dynamischen Attribute:**
```python
class Slotted:
    __slots__ = ('x',)
    
    def __init__(self, x):
        self.x = x

obj = Slotted(10)
obj.y = 20  # AttributeError!
```

**Lösung: `__dict__` explizit hinzufügen:**
```python
class FlexibleSlotted:
    __slots__ = ('x', '__dict__')  # Erlaubt zusätzliche Attribute
    
    def __init__(self, x):
        self.x = x

obj = FlexibleSlotted(10)
obj.y = 20  # Funktioniert jetzt
```

#### 7.1.4 Vererbung mit `__slots__`

**Fall 1: Basisklasse ohne `__slots__`**
```python
class Base:
    pass

class Derived(Base):
    __slots__ = ('x',)

# Derived hat sowohl __dict__ (von Base) als auch __slots__
# → Kein Speichervorteil!
```

**Fall 2: Beide mit `__slots__`**
```python
class Base:
    __slots__ = ('name',)

class Derived(Base):
    __slots__ = ('age',)  # Erweitert Base-Slots

d = Derived()
d.name = 'Alice'  # Von Base
d.age = 30        # Von Derived
```

**Fall 3: Leere `__slots__` in Basisklasse**
```python
class Base:
    __slots__ = ()  # Verhindert __dict__ in Unterklassen

class Derived(Base):
    __slots__ = ('x', 'y')
```

#### 7.1.5 `__weakref__` für schwache Referenzen

Standardmäßig verhindert `__slots__` schwache Referenzen:
```python
import weakref

class Slotted:
    __slots__ = ('x',)

obj = Slotted()
weak = weakref.ref(obj)  # TypeError: cannot create weak reference
```

**Lösung:**
```python
class Slotted:
    __slots__ = ('x', '__weakref__')  # Schwache Referenzen erlauben

obj = Slotted()
weak = weakref.ref(obj)  # Funktioniert
```

#### 7.1.6 Performance-Benchmark
```python
import time

class Normal:
    def __init__(self, x, y):
        self.x = x
        self.y = y

class Slotted:
    __slots__ = ('x', 'y')
    
    def __init__(self, x, y):
        self.x = x
        self.y = y

# Speicher
instances = 1_000_000

start = time.time()
normal_list = [Normal(i, i*2) for i in range(instances)]
print(f"Normal: {time.time() - start:.2f}s")

start = time.time()
slotted_list = [Slotted(i, i*2) for i in range(instances)]
print(f"Slotted: {time.time() - start:.2f}s")

# Attributzugriff
obj_normal = Normal(10, 20)
obj_slotted = Slotted(10, 20)

start = time.time()
for _ in range(10_000_000):
    _ = obj_normal.x
print(f"Normal access: {time.time() - start:.2f}s")

start = time.time()
for _ in range(10_000_000):
    _ = obj_slotted.x
print(f"Slotted access: {time.time() - start:.2f}s")
```

**Typische Ergebnisse:**
- Speicher: ~40-50% weniger
- Zugriff: ~20-30% schneller

#### 7.1.7 Wann `__slots__` verwenden?

**✅ Verwenden bei:**
- Vielen Instanzen (>10.000)
- Bekannter, fixer Attributmenge
- Performance-kritischen Objekten
- Datenklassen mit vielen Instanzen
- Eingebetteten Systemen (begrenzter Speicher)

**❌ Vermeiden bei:**
- Wenigen Instanzen (<1.000)
- Dynamischen Attributen erforderlich
- Mehrfachvererbung (kompliziert)
- Flexibilität wichtiger als Performance
- Plugins/Extensions (brauchen `__dict__`)

#### 7.1.8 Best Practices

**1. Immer `__weakref__` berücksichtigen:**
```python
# ✅ Gut: Explizit entscheiden
class Point:
    __slots__ = ('x', 'y', '__weakref__')
```

**2. Vorsicht bei Vererbung:**
```python
# ❌ Problematisch
class Base:
    pass  # Hat __dict__

class Child(Base):
    __slots__ = ('x',)  # Bringt nichts, da Base __dict__ hat

# ✅ Besser
class Base:
    __slots__ = ()  # Explizit keine Attribute

class Child(Base):
    __slots__ = ('x',)
```

**3. Slots dokumentieren:**
```python
class Vector:
    """3D Vector.
    
    Slots: x, y, z (float) - coordinates
    """
    __slots__ = ('x', 'y', 'z')
```

**4. Mit Pickle/Serialisierung:**
```python
class Serializable:
    __slots__ = ('x', 'y')
    
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    # Für pickle bei __slots__
    def __getstate__(self):
        return {slot: getattr(self, slot) for slot in self.__slots__}
    
    def __setstate__(self, state):
        for slot, value in state.items():
            setattr(self, slot, value)
```

#### 7.1.9 Kombinationen und fortgeschrittene Patterns

**Mit Properties:**
```python
class Temperature:
    __slots__ = ('_celsius',)
    
    def __init__(self, celsius):
        self._celsius = celsius
    
    @property
    def celsius(self):
        return self._celsius
    
    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Temperature below absolute zero")
        self._celsius = value
    
    @property
    def fahrenheit(self):
        return self._celsius * 9/5 + 32
```

**Mit Descriptors:**
```python
class Descriptor:
    def __set_name__(self, owner, name):
        self.name = f'_{name}'
    
    def __get__(self, obj, type):
        return getattr(obj, self.name)
    
    def __set__(self, obj, value):
        setattr(obj, self.name, value)

class Person:
    __slots__ = ('_name', '_age')
    name = Descriptor()
    age = Descriptor()
```

**Hybrid-Ansatz (für Migration):**
```python
class Hybrid:
    __slots__ = ('x', 'y', '__dict__')
    
    def __init__(self, x, y, **kwargs):
        self.x = x
        self.y = y
        # Zusätzliche Attribute in __dict__
        for key, value in kwargs.items():
            setattr(self, key, value)

h = Hybrid(1, 2, z=3, name='test')
# x, y in slots (schnell)
# z, name in __dict__ (flexibel)
```

#### 7.1.10 Praxisbeispiel: Große Datenmengen
```python
# Szenario: 1 Million GPS-Punkte speichern

class GPSPointNormal:
    def __init__(self, lat, lon, timestamp):
        self.lat = lat
        self.lon = lon
        self.timestamp = timestamp

class GPSPointSlotted:
    __slots__ = ('lat', 'lon', 'timestamp')
    
    def __init__(self, lat, lon, timestamp):
        self.lat = lat
        self.lon = lon
        self.timestamp = timestamp

# Speicherverbrauch Vergleich
import sys
import tracemalloc

# Normal
tracemalloc.start()
normal_points = [GPSPointNormal(i*0.1, i*0.2, i) for i in range(1_000_000)]
normal_memory = tracemalloc.get_traced_memory()[0] / 1024 / 1024
tracemalloc.stop()

# Slotted
tracemalloc.start()
slotted_points = [GPSPointSlotted(i*0.1, i*0.2, i) for i in range(1_000_000)]
slotted_memory = tracemalloc.get_traced_memory()[0] / 1024 / 1024
tracemalloc.stop()

print(f"Normal: {normal_memory:.2f} MB")
print(f"Slotted: {slotted_memory:.2f} MB")
print(f"Saved: {normal_memory - slotted_memory:.2f} MB ({(1 - slotted_memory/normal_memory)*100:.1f}%)")
```

**Typisches Ergebnis:**
- Normal: ~240 MB
- Slotted: ~120 MB
- Ersparnis: ~50%

#### 7.1.11 Zusammenfassung

| Aspekt              | Ohne `__slots__`     | Mit `__slots__`          |
| ------------------- | -------------------- | ------------------------ |
| Speicherverbrauch   | Hoch                 | Niedrig (~40-50% weniger)|
| Attributzugriff     | Langsam (dict)       | Schnell (~20-30%)        |
| Dynamische Attrs    | ✅ Möglich           | ❌ Nicht möglich         |
| Flexibilität        | ✅ Hoch              | ⚠️ Eingeschränkt         |
| Use Case            | Normale Klassen      | Performance-kritisch     |
| Typfehler           | Zur Laufzeit         | Sofort                   |
| Vererbung           | ✅ Einfach           | ⚠️ Komplex               |

**Kernprinzip:** `__slots__` ist ein Optimierungs-Tool für speicher- und performance-kritische Szenarien mit vielen Instanzen und fixer Attributstruktur. Nicht vorzeitig optimieren – erst bei messbaren Performance-Problemen einsetzen.