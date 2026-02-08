# Fortgeschrittene Objektorientierung

## 1    `type()`, `isinstance()` und `issubclass()`

Diese eingebauten Funktionen helfen beim Umgang mit Typen und Vererbung.

- `type(obj)` gibt den exakten Typ des Objekts zurück.
- `isinstance(obj, cls)` prüft, ob `obj` eine Instanz von `cls` oder einer abgeleiteten Klasse ist.
- `issubclass(sub, super)` prüft, ob `sub` eine Unterklasse von `super` ist.

```python
class Animal: pass
class Dog(Animal): pass

a = Animal()
d = Dog()

print(type(d))                  # <class '__main__.Dog'>
print(isinstance(d, Animal))    # True
print(issubclass(Dog, Animal))  # True
```

Diese Funktionen sind wichtig für dynamisches Verhalten, Validierung und Typprüfung.

## 2    `__init__` vs `__new__`

- `__new__` ist für das **Erzeugen** eines neuen Objekts zuständig.
- `__init__` wird anschließend aufgerufen, um das Objekt zu **initialisieren**.

```python
class Custom:
    def __new__(cls, *args, **kwargs):
        print('Creating instance')
        return super().__new__(cls)

    def __init__(self, value):
        print('Initializing with', value)
        self.value = value

obj = Custom(42)
```

`__new__` wird z. B. bei unveränderlichen Typen wie `str` oder `tuple` benötigt, wenn diese beeinflusst werden sollen oder in der Metaprogrammierung (Singleton-Pattern).

## 3    Methodenarten

### 3.1    StaticMethods und ClassMethods

- `@staticmethod` definiert eine Methode, die **keinen Zugriff** auf `self` oder `cls` benötigt.
- `@classmethod` arbeitet mit `cls` und kann so auf die Klasse zugreifen.

```python
class Example:
    @staticmethod
    def utility():
        print('Static method called')

    @classmethod
    def construct(cls):
        print(f'Creating instance of {cls.__name__}')
        return cls()

Example.utility()
obj = Example.construct()
```

`classmethod` wird häufig für alternative Konstruktoren verwendet.

### 3.2    Properties (Private Attribute)

Mit `@property` können Methoden wie Attribute verwendet werden. Das ist nützlich für **gekapselte Attribute**, z. B. mit Validierung oder automatischer Berechnung.

```python
class Person:
    def __init__(self, name):
        self._name = name  # Private Konvention

    @property
    def name(self):
        return self._name

    @name.setter
    def name(self, new):
        self._name = new

p = Person('Alice')
print(p.name)
p.name = 'Bob'
print(p.name)
```

Durch Properties kann die API einfach bleiben, während intern komplexe Logik stattfinden kann.

## 4    Dunder Methods

Dunder (Double Underscore) Methoden ermöglichen benutzerdefiniertes Verhalten für Operatoren und eingebaute Funktionen (`__str__`, `__len__`, `__getitem__` usw.).

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f'({self.x}, {self.y})'

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

p1 = Point(1, 2)
p2 = Point(1, 2)
print(str(p1))  # (1, 2)
print(p1 == p2)  # True
```

Diese Methoden machen Objekte "pythonisch".

## 5    Abstraktion und Vererbung

### 5.1    Abstract Methods

Das `abc`-Modul erlaubt die Definition abstrakter Basisklassen. Methoden mit `@abstractmethod` müssen in Subklassen implementiert werden.

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

class Circle(Shape):
    def area(self):
        return 3.14 * 5 * 5
```

Abstrakte Methoden zwingen Unterklassen zur Implementierung und helfen beim Design stabiler APIs.

### 5.2    Method Resolution Order

Python verwendet das **C3 Linearization**-Verfahren, um die Reihenfolge von Vererbungen zu bestimmen. Die `mro()`-Methode zeigt die Aufrufreihenfolge.

```python
class A: pass
class B(A): pass
class C(A): pass
class D(B, C): pass

print(D.mro())  # [D, B, C, A, object]
```

Wichtig bei Mehrfachvererbung.

## 6    Interation und Indizierung

### 6.1    Iterator-Klasse und Generator-Funktion

Ein Iterator benötigt die Methoden `__iter__` und `__next__`. Alternativ kann `yield` verwendet werden.

```python
class Count:
    def __init__(self, max):
        self.max = max
        self.current = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.current >= self.max:
            raise StopIteration
        self.current += 1
        return self.current
```

Generatoren vereinfachen Iteration:

```python
def count_up_to(max):
    current = 0
    while current < max:
        current += 1
        yield current
```

### 6.2    Indexing-Klasse

Mithilfe von `__getitem__` und `__setitem__` können Objekte wie Listen verwendet werden.

```python
class CustomList:
    def __init__(self, data):
        self.data = data

    def __getitem__(self, index):
        return self.data[index]

    def __setitem__(self, index, value):
        self.data[index] = value
```

Sehr nützlich für eigene Containerklassen.

## 7    Datenpräsentation und Speicheroptimierung

### 7.1    Dataclass

Dataclasses automatisieren Konstruktor, Vergleich und Darstellung.

```python
from dataclasses import dataclass

@dataclass
class User:
    name: str
    age: int
```

#### 7.1.1    Slots

Mit `__slots__` wird der Speicherverbrauch reduziert und der Zugriff beschleunigt.

```python
class Slim:
    __slots__ = ('x', 'y')
    def __init__(self, x, y):
        self.x = x
        self.y = y
```

Seit Python 3.10 ist folgendes möglich (gleichwertiger Code):

```python
@dataclass(slots=True)
class Slim:
    x: int
    y: int
```

> [!INFO] Was macht `__slots__` bzw. `slots=True`?
>
> Normalerweise speichert Python Objektattribute in einem internen Dictionary namens `__dict__.` Das ist flexibel, jedoch nicht speichereffizient oder performant.
> Wenn `__slots__` bzw. `slots=True` verwendet wird, wird dieses Dictionary durch ein festeres Layout ersetzt, bei dem nur die im Slot definierten Felder erlaubt sind.
> 
> **Warum verbessert das die Leistung?**
>
> 1. Weniger Speicherverbrauch:
> Jedes Objekt braucht weniger Speicher, weil kein `__dict__` mehr angelegt wird.
>
> 2. Schnellerer Zugriff auf Attribute:
> Statt eines Dictionary-Lookups wird ein schnellerer, indexbasierter Zugriff verwendet.
>
> 3. Bessere Caching-Effekte:
> Schlankere Objekte passen besser in den Cache, was zu weiteren Geschwindigkeitsgewinnen führen kann – besonders bei großen Listen von Objekten.

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

##### Vorteile von `__slots__`

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

#### 7.1.2    `frozen=True`

Das `frozen=True`-Argument macht die Instanz **unveränderlich** (**immutable**):

```python
@dataclass(frozen=True)
class Point:
    x: int
    y: int

p = Point(1, 2)
print(p.x)  # -> 1

p.x = 10    # -> Fehler: cannot assign to field 'x'
```

- Man kann keine Attribute mehr ändern nach der Erstellung der Instanz.
- Python generiert automatisch einen `setattr`, der Änderungen verhindert.
- Die Klasse wird hashbar (vorausgesetzt alle Felder sind auch hashbar), was z. B. erlaubt, sie als Schlüssel in einem `dict` oder als Elemente in einem `set` zu verwenden.
- Die Verwendung von `frozen=True` führt zu einer Leistungssteigerung, diese ist jedoch minimal.

### 7.2    Namedtuple

Ein `namedtuple` ist ein leichtgewichtiger, unveränderlicher Datenträger mit benannten Feldern.

```python
from collections import namedtuple

Point = namedtuple('Point', ['x', 'y'])
p = Point(3, 4)
print(p.x, p.y)
```

Effizient und leserlich – eine gute Alternative zu kleinen Klassen.

## 8    Enum

`Enum` erlaubt es, symbolische Konstanten mit Namen zu versehen.

```python
from enum import Enum

class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3
```

Gleichbedeutend mit dem obigen Beispiel ist:

```python
from enum import Enum

class Color(Enum):
    RED = auto()
    GREEN = auto()
    BLUE = auto()
```

Enums verbessern die Lesbarkeit und Typsicherheit im Code.

## 9    Class Decorator

Class Decorators modifizieren Klassen beim Erzeugen. Sie eignen sich für Registrierung, Debugging oder Vererbung.

```python
def debug(cls):
    original_init = cls.__init__
    def new_init(self, *args, **kwargs):
        print(f'Creating {cls.__name__} with {args}, {kwargs}')
        original_init(self, *args, **kwargs)
    cls.__init__ = new_init
    return cls

@debug
class Product:
    def __init__(self, name):
        self.name = name

p = Product('Book')
```

Class Decorators sind ein mächtiges Meta-Programmierungstool.

## 10    Metaclasses – Klassen von Klassen

Metaclasses sind ein fortgeschrittenes Feature, mit dem man das Verhalten beim Erstellen von Klassen selbst kontrollieren kann. Sie sind die "Klassen von Klassen".

### 10.1    Grundkonzept

In Python ist alles ein Objekt – auch Klassen. Klassen sind Instanzen von Metaclasses.
```python
# Normale Hierarchie
class Dog:
    pass

dog = Dog()

# Was ist was?
print(type(dog))   # <class '__main__.Dog'> - dog ist Instanz von Dog
print(type(Dog))   # <class 'type'> - Dog ist Instanz von type
print(type(type))  # <class 'type'> - type ist seine eigene Metaclass

# isinstance-Checks
print(isinstance(dog, Dog))     # True
print(isinstance(Dog, type))    # True
```

**Die Kette:**
```
dog  →  Instanz von  →  Dog  →  Instanz von  →  type (Metaclass)
```

### 10.2    `type()` als Metaclass

`type` kann auf zwei Arten verwendet werden:

**1. Als Funktion (Typ abfragen):**
```python
x = 5
print(type(x))  # <class 'int'>
```

**2. Als Metaclass (Klasse erstellen):**
```python
# Normale Klassendefinition
class Dog:
    def bark(self):
        return "Woof!"

# Äquivalent mit type()
Dog = type('Dog', (), {'bark': lambda self: "Woof!"})

dog = Dog()
print(dog.bark())  # "Woof!"
```

**Syntax von `type()` zur Klassenerstellung:**
```python
type(name, bases, dict)
```

- `name`: Klassenname (String)
- `bases`: Tuple der Basisklassen
- `dict`: Dictionary mit Attributen und Methoden

**Beispiel mit Vererbung:**
```python
# Basisklasse
class Animal:
    def breathe(self):
        return "Breathing..."

# Mit type() erstellen
Dog = type(
    'Dog',                          # Name
    (Animal,),                       # Basisklassen
    {
        'species': 'Canis familiaris',
        'bark': lambda self: "Woof!"
    }
)

dog = Dog()
print(dog.breathe())  # "Breathing..." (geerbt)
print(dog.bark())     # "Woof!"
print(dog.species)    # "Canis familiaris"
```

### 10.3    Eigene Metaclass erstellen

Eine Metaclass ist eine Klasse, die von `type` erbt.
```python
class Meta(type):
    def __new__(mcs, name, bases, attrs):
        print(f"Creating class {name}")
        # Klasse erstellen
        cls = super().__new__(mcs, name, bases, attrs)
        return cls

class MyClass(metaclass=Meta):
    pass

# Output beim Import/Ausführung:
# Creating class MyClass
```

**Parameter von `__new__`:**

- `mcs`: Die Metaclass selbst (wie `cls` bei `@classmethod`)
- `name`: Name der zu erstellenden Klasse
- `bases`: Tuple der Basisklassen
- `attrs`: Dictionary der Klassenattribute

### 10.4    `__new__` vs. `__init__` in Metaclasses
```python
class Meta(type):
    def __new__(mcs, name, bases, attrs):
        """Wird WÄHREND der Klassenerstellung aufgerufen"""
        print(f"__new__: Creating {name}")
        cls = super().__new__(mcs, name, bases, attrs)
        return cls
    
    def __init__(cls, name, bases, attrs):
        """Wird NACH der Klassenerstellung aufgerufen"""
        print(f"__init__: Initializing {name}")
        super().__init__(name, bases, attrs)

class MyClass(metaclass=Meta):
    pass

# Output:
# __new__: Creating MyClass
# __init__: Initializing MyClass
```

**Wann was verwenden:**

- `__new__`: Wenn man die Klasse vor ihrer Erstellung modifizieren will
- `__init__`: Wenn man die Klasse nach ihrer Erstellung modifizieren will

### 10.5    Praktische Anwendungsfälle

#### 10.5.1    Attribute validieren
```python
class ValidatedMeta(type):
    def __new__(mcs, name, bases, attrs):
        # Alle Attribute müssen mit Großbuchstaben beginnen
        for key in attrs:
            if not key.startswith('_'):  # Private ignorieren
                if not key[0].isupper():
                    raise ValueError(
                        f"Attribute {key} must start with uppercase letter"
                    )
        return super().__new__(mcs, name, bases, attrs)

# ✅ Funktioniert
class GoodClass(metaclass=ValidatedMeta):
    Name = "valid"
    Age = 25

# ❌ Fehler
# class BadClass(metaclass=ValidatedMeta):
#     name = "invalid"  # ValueError!
```

#### 10.5.2    Automatische Registrierung
```python
class RegistryMeta(type):
    _registry = {}
    
    def __new__(mcs, name, bases, attrs):
        cls = super().__new__(mcs, name, bases, attrs)
        # Klasse automatisch registrieren
        mcs._registry[name] = cls
        return cls
    
    @classmethod
    def get_registry(mcs):
        return mcs._registry

class Plugin(metaclass=RegistryMeta):
    pass

class AudioPlugin(Plugin):
    pass

class VideoPlugin(Plugin):
    pass

# Alle Plugins automatisch registriert
print(RegistryMeta.get_registry())
# {'Plugin': <class '__main__.Plugin'>, 
#  'AudioPlugin': <class '__main__.AudioPlugin'>,
#  'VideoPlugin': <class '__main__.VideoPlugin'>}
```

#### 10.5.3    Singleton-Pattern
```python
class SingletonMeta(type):
    _instances = {}
    
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class Database(metaclass=SingletonMeta):
    def __init__(self):
        print("Connecting to database...")

# Erste Instanz
db1 = Database()  # "Connecting to database..."

# Zweite "Instanz" - gibt dieselbe zurück
db2 = Database()  # (kein Output)

print(db1 is db2)  # True
```

#### 10.5.4    Automatische `__repr__` Methode
```python
class AutoReprMeta(type):
    def __new__(mcs, name, bases, attrs):
        # Automatisch __repr__ generieren
        def auto_repr(self):
            attrs_str = ', '.join(
                f"{k}={v!r}" 
                for k, v in self.__dict__.items()
            )
            return f"{name}({attrs_str})"
        
        # Nur hinzufügen, wenn nicht vorhanden
        if '__repr__' not in attrs:
            attrs['__repr__'] = auto_repr
        
        return super().__new__(mcs, name, bases, attrs)

class Point(metaclass=AutoReprMeta):
    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(10, 20)
print(p)  # Point(x=10, y=20) - automatisch generiert!
```

#### 10.5.5    Interface/Abstract Base Class erzwingen
```python
class InterfaceMeta(type):
    def __new__(mcs, name, bases, attrs):
        # Prüfe, ob alle abstrakten Methoden implementiert sind
        if bases:  # Nicht für die Basisklasse selbst
            for base in bases:
                if hasattr(base, '_required_methods'):
                    for method in base._required_methods:
                        if method not in attrs:
                            raise TypeError(
                                f"{name} must implement {method}()"
                            )
        return super().__new__(mcs, name, bases, attrs)

class Shape(metaclass=InterfaceMeta):
    _required_methods = ['area', 'perimeter']

# ❌ Fehler - area fehlt
# class Circle(Shape):
#     def perimeter(self):
#         return 2 * 3.14 * self.radius

# ✅ Funktioniert
class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        return 3.14 * self.radius ** 2
    
    def perimeter(self):
        return 2 * 3.14 * self.radius
```

### 10.6    Metaclass-Vererbung
```python
class MetaA(type):
    def __new__(mcs, name, bases, attrs):
        print(f"MetaA creating {name}")
        return super().__new__(mcs, name, bases, attrs)

class MetaB(MetaA):
    def __new__(mcs, name, bases, attrs):
        print(f"MetaB creating {name}")
        return super().__new__(mcs, name, bases, attrs)

class MyClass(metaclass=MetaB):
    pass

# Output:
# MetaB creating MyClass
# MetaA creating MyClass
```

### 10.7    `__call__` in Metaclasses

`__call__` wird aufgerufen, wenn eine Instanz der Klasse erstellt wird.
```python
class CounterMeta(type):
    def __init__(cls, name, bases, attrs):
        super().__init__(name, bases, attrs)
        cls._instance_count = 0
    
    def __call__(cls, *args, **kwargs):
        # Wird bei MyClass() aufgerufen
        instance = super().__call__(*args, **kwargs)
        cls._instance_count += 1
        print(f"Created instance #{cls._instance_count}")
        return instance

class MyClass(metaclass=CounterMeta):
    pass

obj1 = MyClass()  # Created instance #1
obj2 = MyClass()  # Created instance #2
obj3 = MyClass()  # Created instance #3

print(MyClass._instance_count)  # 3
```

### 10.8    `__prepare__` – Dictionary für Klassenattribute vorbereiten

`__prepare__` bestimmt, welches Dictionary für die Klassenattribute verwendet wird (normalerweise ein normales `dict`).
```python
from collections import OrderedDict

class OrderedMeta(type):
    @classmethod
    def __prepare__(mcs, name, bases):
        """Wird VOR __new__ aufgerufen"""
        print(f"Preparing namespace for {name}")
        return OrderedDict()
    
    def __new__(mcs, name, bases, namespace):
        print(f"Attributes in order: {list(namespace.keys())}")
        return super().__new__(mcs, name, bases, dict(namespace))

class MyClass(metaclass=OrderedMeta):
    z = 3
    a = 1
    m = 2

# Output:
# Preparing namespace for MyClass
# Attributes in order: ['__module__', '__qualname__', 'z', 'a', 'm']
```

### 10.9    Metaclass-Konflikte vermeiden

Bei Mehrfachvererbung können Metaclass-Konflikte auftreten:
```python
class MetaA(type):
    pass

class MetaB(type):
    pass

class A(metaclass=MetaA):
    pass

class B(metaclass=MetaB):
    pass

# ❌ Fehler: metaclass conflict
# class C(A, B):
#     pass

# ✅ Lösung: Gemeinsame Metaclass
class MetaC(MetaA, MetaB):
    pass

class C(A, B, metaclass=MetaC):
    pass
```

### 10.10    Metaclasses vs. Alternativen

Metaclasses sind mächtig, aber oft gibt es einfachere Alternativen.

#### 10.10.1    Class Decorators
```python
# Mit Metaclass
class AutoStrMeta(type):
    def __new__(mcs, name, bases, attrs):
        def __str__(self):
            return f"{name} instance"
        attrs['__str__'] = __str__
        return super().__new__(mcs, name, bases, attrs)

class MyClass(metaclass=AutoStrMeta):
    pass

# Mit Decorator (einfacher!)
def auto_str(cls):
    def __str__(self):
        return f"{cls.__name__} instance"
    cls.__str__ = __str__
    return cls

@auto_str
class MyClass:
    pass
```

#### 10.10.2    `__init_subclass__` (Python 3.6+)
```python
# Mit Metaclass
class RegistryMeta(type):
    _registry = []
    
    def __new__(mcs, name, bases, attrs):
        cls = super().__new__(mcs, name, bases, attrs)
        mcs._registry.append(cls)
        return cls

# Mit __init_subclass__ (moderner!)
class Plugin:
    _registry = []
    
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        cls._registry.append(cls)

class AudioPlugin(Plugin):
    pass

print(Plugin._registry)  # [<class 'AudioPlugin'>]
```

### 10.11    Debugging von Metaclasses
```python
class DebugMeta(type):
    def __new__(mcs, name, bases, attrs):
        print(f"\n=== Creating class {name} ===")
        print(f"Metaclass: {mcs}")
        print(f"Bases: {bases}")
        print(f"Attributes: {list(attrs.keys())}")
        
        cls = super().__new__(mcs, name, bases, attrs)
        
        print(f"Class created: {cls}")
        print(f"MRO: {cls.__mro__}")
        return cls

class Parent:
    parent_attr = "parent"

class Child(Parent, metaclass=DebugMeta):
    child_attr = "child"

# Output zeigt detaillierte Informationen über Klassenerstellung
```

### 10.12    Best Practices

**✅ Wann Metaclasses verwenden:**
- Framework-/Library-Entwicklung
- Automatische Registrierung/Plugin-Systeme
- Enforcing von Code-Standards
- DSL (Domain Specific Language) Implementation
- Komplexe ORM-Systeme (wie Django Models)

**❌ Wann NICHT verwenden:**
- Für alltägliche Programmierung
- Wenn Class Decorators ausreichen
- Wenn `__init_subclass__` ausreicht
- Wenn es den Code unleserlich macht

**Alternativen prüfen:**
1. Class Decorators (meistens ausreichend)
2. `__init_subclass__` (Python 3.6+)
3. Descriptor Protocol
4. Erst dann: Metaclasses

**Zitat von Tim Peters:**
> "Metaclasses are deeper magic than 99% of users should ever worry about. If you wonder whether you need them, you don't."

### 10.13    Zusammenfassung

| Konzept           | Beschreibung                                  |
| ----------------- | --------------------------------------------- |
| `type`            | Standard-Metaclass aller Klassen              |
| `__new__`         | Klasse während Erstellung modifizieren        |
| `__init__`        | Klasse nach Erstellung initialisieren         |
| `__call__`        | Instanzerstellung kontrollieren               |
| `__prepare__`     | Namespace-Dictionary vorbereiten              |
| `metaclass=`      | Custom Metaclass zuweisen                     |

**Kernprinzip:** Metaclasses kontrollieren die Klassenerstellung selbst. Sie sind ein sehr mächtiges Werkzeug, sollten aber sparsam eingesetzt werden. In den meisten Fällen sind Class Decorators oder `__init_subclass__` die bessere Wahl.

**Entscheidungsbaum:**
1. Brauche ich wirklich Metaprogrammierung? → Oft: Nein
2. Reicht ein Class Decorator? → Meistens: Ja
3. Reicht `__init_subclass__`? → Oft: Ja
4. Brauche ich volle Kontrolle über Klassenerstellung? → Dann: Metaclass

## 11    Itertools – Leistungsstarke Iterator-Werkzeuge

Das `itertools`-Modul bietet spezialisierte Iterator-Funktionen für effiziente Schleifen und funktionale Programmierung. Alle Funktionen sind speichereffizient, da sie Iteratoren statt Listen zurückgeben.

### 11.1    Unendliche Iteratoren

#### 11.1.1    `count()` – Unendliches Zählen
```python
from itertools import count

# Zählt ab 10 in 2er-Schritten
counter = count(start=10, step=2)
for i in counter:
    if i > 20:
        break
    print(i)  # 10, 12, 14, 16, 18, 20

# Mit zip für begrenzte Iteration
for i, letter in zip(count(1), ['a', 'b', 'c']):
    print(f"{i}: {letter}")
# 1: a
# 2: b
# 3: c
```

#### 11.1.2    `cycle()` – Elemente wiederholen
```python
from itertools import cycle

# Zyklisch durch Elemente iterieren
colors = cycle(['red', 'green', 'blue'])

for i, color in enumerate(colors):
    if i >= 7:
        break
    print(color)
# red, green, blue, red, green, blue, red
```

**Praktisches Beispiel – Zeilen abwechselnd einfärben:**
```python
from itertools import cycle

rows = ['Row 1', 'Row 2', 'Row 3', 'Row 4', 'Row 5']
colors = cycle(['white', 'gray'])

for row, color in zip(rows, colors):
    print(f"{row} - {color}")
```

#### 11.1.3    `repeat()` – Element wiederholen
```python
from itertools import repeat

# Unbegrenzt
for item in repeat('X'):
    print(item)  # X, X, X, ... (unendlich)
    break

# Begrenzt
for item in repeat('X', 3):
    print(item)  # X, X, X

# Praktisch mit map
result = list(map(pow, [2, 3, 4], repeat(3)))
print(result)  # [8, 27, 64] (2³, 3³, 4³)
```

### 11.2    Kombinatorische Iteratoren

#### 11.2.1    `product()` – Kartesisches Produkt
```python
from itertools import product

# Alle Kombinationen
colors = ['red', 'blue']
sizes = ['S', 'M', 'L']

for color, size in product(colors, sizes):
    print(f"{color}-{size}")
# red-S, red-M, red-L, blue-S, blue-M, blue-L

# Äquivalent zu verschachtelten Schleifen
for color in colors:
    for size in sizes:
        print(f"{color}-{size}")

# Mit repeat-Parameter
for item in product(range(2), repeat=3):
    print(item)
# (0,0,0), (0,0,1), (0,1,0), (0,1,1), (1,0,0), (1,0,1), (1,1,0), (1,1,1)
```

#### 11.2.2    `permutations()` – Permutationen
```python
from itertools import permutations

# Alle Anordnungen von 3 Elementen
items = ['A', 'B', 'C']
for perm in permutations(items):
    print(perm)
# ('A','B','C'), ('A','C','B'), ('B','A','C'), ('B','C','A'), ('C','A','B'), ('C','B','A')

# Permutationen mit Länge 2
for perm in permutations(items, 2):
    print(perm)
# ('A','B'), ('A','C'), ('B','A'), ('B','C'), ('C','A'), ('C','B')

# Anzahl: n! / (n-r)! für Länge r
import math
n, r = 3, 2
count = math.factorial(n) // math.factorial(n - r)
print(count)  # 6
```

#### 11.2.3    `combinations()` – Kombinationen (ohne Wiederholung)
```python
from itertools import combinations

# Alle 2er-Kombinationen
items = ['A', 'B', 'C', 'D']
for combo in combinations(items, 2):
    print(combo)
# ('A','B'), ('A','C'), ('A','D'), ('B','C'), ('B','D'), ('C','D')

# Anzahl: n! / (r! * (n-r)!)
import math
n, r = 4, 2
count = math.factorial(n) // (math.factorial(r) * math.factorial(n - r))
print(count)  # 6
```

#### 11.2.4    `combinations_with_replacement()` – Kombinationen mit Wiederholung
```python
from itertools import combinations_with_replacement

items = ['A', 'B', 'C']
for combo in combinations_with_replacement(items, 2):
    print(combo)
# ('A','A'), ('A','B'), ('A','C'), ('B','B'), ('B','C'), ('C','C')
```

### 11.3    Terminierende Iteratoren

#### 11.3.1    `chain()` – Iterables verketten
```python
from itertools import chain

# Mehrere Iterables zu einem kombinieren
list1 = [1, 2, 3]
list2 = [4, 5, 6]
list3 = [7, 8, 9]

for item in chain(list1, list2, list3):
    print(item)  # 1, 2, 3, 4, 5, 6, 7, 8, 9

# Äquivalent zu:
result = list1 + list2 + list3

# chain.from_iterable für verschachtelte Iterables
nested = [[1, 2], [3, 4], [5, 6]]
flattened = list(chain.from_iterable(nested))
print(flattened)  # [1, 2, 3, 4, 5, 6]
```

#### 11.3.2    `compress()` – Filtern mit Boolean-Mask
```python
from itertools import compress

data = ['A', 'B', 'C', 'D', 'E']
selectors = [True, False, True, False, True]

result = list(compress(data, selectors))
print(result)  # ['A', 'C', 'E']

# Praktisches Beispiel
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
is_even = [n % 2 == 0 for n in numbers]
evens = list(compress(numbers, is_even))
print(evens)  # [2, 4, 6, 8, 10]
```

#### 11.3.3    `dropwhile()` und `takewhile()` – Bedingte Iteration
```python
from itertools import dropwhile, takewhile

data = [1, 4, 6, 4, 1]

# dropwhile: Überspringt bis Bedingung False wird
result = list(dropwhile(lambda x: x < 5, data))
print(result)  # [6, 4, 1] (ab erstem x >= 5)

# takewhile: Nimmt bis Bedingung False wird
result = list(takewhile(lambda x: x < 5, data))
print(result)  # [1, 4] (bis erstes x >= 5)
```

#### 11.3.4    `filterfalse()` – Umgekehrtes filter()
```python
from itertools import filterfalse

numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# filter gibt True-Werte zurück
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)  # [2, 4, 6, 8, 10]

# filterfalse gibt False-Werte zurück
odds = list(filterfalse(lambda x: x % 2 == 0, numbers))
print(odds)   # [1, 3, 5, 7, 9]
```

#### 11.3.5    `groupby()` – Gruppieren nach Schlüssel
```python
from itertools import groupby

# Daten müssen nach Gruppierungsschlüssel SORTIERT sein!
data = [
    ('Alice', 'A'),
    ('Bob', 'B'),
    ('Charlie', 'C'),
    ('David', 'A'),
    ('Eve', 'B')
]

# Nach zweitem Element gruppieren (NICHT sortiert → falsche Gruppen!)
for key, group in groupby(data, key=lambda x: x[1]):
    print(f"{key}: {list(group)}")
# A: [('Alice', 'A')]
# B: [('Bob', 'B')]
# C: [('Charlie', 'C')]
# A: [('David', 'A')]  ← Neue Gruppe!
# B: [('Eve', 'B')]    ← Neue Gruppe!

# Richtig: Erst sortieren
data_sorted = sorted(data, key=lambda x: x[1])
for key, group in groupby(data_sorted, key=lambda x: x[1]):
    print(f"{key}: {list(group)}")
# A: [('Alice', 'A'), ('David', 'A')]
# B: [('Bob', 'B'), ('Eve', 'B')]
# C: [('Charlie', 'C')]
```

**Praktisches Beispiel – Nach Länge gruppieren:**
```python
from itertools import groupby

words = ['a', 'bb', 'ccc', 'dd', 'e', 'fff']
words_sorted = sorted(words, key=len)

for length, group in groupby(words_sorted, key=len):
    print(f"Length {length}: {list(group)}")
# Length 1: ['a', 'e']
# Length 2: ['bb', 'dd']
# Length 3: ['ccc', 'fff']
```

#### 11.3.6    `islice()` – Slice für Iteratoren
```python
from itertools import islice, count

# Wie list-slicing, aber für Iteratoren
data = range(10)

# islice(iterable, stop)
result = list(islice(data, 5))
print(result)  # [0, 1, 2, 3, 4]

# islice(iterable, start, stop)
result = list(islice(data, 2, 7))
print(result)  # [2, 3, 4, 5, 6]

# islice(iterable, start, stop, step)
result = list(islice(data, 0, 10, 2))
print(result)  # [0, 2, 4, 6, 8]

# Sehr nützlich für unendliche Iteratoren
result = list(islice(count(10), 5))
print(result)  # [10, 11, 12, 13, 14]
```

#### 11.3.7    `starmap()` – map mit Argument-Unpacking
```python
from itertools import starmap

# map wendet Funktion auf einzelne Elemente an
result = list(map(pow, [2, 3, 4], [5, 2, 3]))
print(result)  # [32, 9, 64]

# starmap entpackt Tupel als Argumente
data = [(2, 5), (3, 2), (4, 3)]
result = list(starmap(pow, data))
print(result)  # [32, 9, 64]

# Praktisches Beispiel
points = [(1, 2), (3, 4), (5, 6)]
result = list(starmap(lambda x, y: x + y, points))
print(result)  # [3, 7, 11]
```

#### 11.3.8    `tee()` – Iterator duplizieren
```python
from itertools import tee

data = range(5)
it1, it2 = tee(data, 2)  # 2 unabhängige Kopien

# Beide können unabhängig verwendet werden
print(list(it1))  # [0, 1, 2, 3, 4]
print(list(it2))  # [0, 1, 2, 3, 4]

# Warnung: Original-Iterator nicht mehr verwenden!
```

#### 11.3.9    `zip_longest()` – Zip mit Auffüllung
```python
from itertools import zip_longest

# Normales zip stoppt bei kürzester Sequenz
a = [1, 2, 3]
b = ['a', 'b']
print(list(zip(a, b)))  # [(1, 'a'), (2, 'b')]

# zip_longest füllt mit None auf
print(list(zip_longest(a, b)))
# [(1, 'a'), (2, 'b'), (3, None)]

# Mit custom fillvalue
print(list(zip_longest(a, b, fillvalue='?')))
# [(1, 'a'), (2, 'b'), (3, '?')]
```

### 11.4    Akkumulatoren

#### 11.4.1    `accumulate()` – Kumulative Werte
```python
from itertools import accumulate
import operator

# Standardmäßig: Addition
numbers = [1, 2, 3, 4, 5]
result = list(accumulate(numbers))
print(result)  # [1, 3, 6, 10, 15] (laufende Summe)

# Mit custom Operation
result = list(accumulate(numbers, operator.mul))
print(result)  # [1, 2, 6, 24, 120] (laufendes Produkt)

# Maximum-Tracking
numbers = [5, 2, 8, 1, 9, 3]
result = list(accumulate(numbers, max))
print(result)  # [5, 5, 8, 8, 9, 9]

# Mit Lambda
result = list(accumulate(numbers, lambda x, y: x if x > y else y))
print(result)  # [5, 5, 8, 8, 9, 9]
```

### 11.5    Praktische Kombinationen

#### 11.5.1    Paarweise Iteration
```python
from itertools import tee

def pairwise(iterable):
    """s -> (s0,s1), (s1,s2), (s2,s3), ..."""
    a, b = tee(iterable)
    next(b, None)
    return zip(a, b)

# Verwendung
data = [1, 2, 3, 4, 5]
for pair in pairwise(data):
    print(pair)
# (1, 2), (2, 3), (3, 4), (4, 5)

# Ab Python 3.10 eingebaut:
from itertools import pairwise
for pair in pairwise(data):
    print(pair)
```

#### 11.5.2    Fenster-Iteration (Sliding Window)
```python
from itertools import islice

def sliding_window(iterable, n):
    """Gleitet mit Fenster der Größe n über iterable"""
    iterators = tee(iterable, n)
    for i, it in enumerate(iterators):
        for _ in range(i):
            next(it, None)
    return zip(*iterators)

# Verwendung
data = [1, 2, 3, 4, 5, 6]
for window in sliding_window(data, 3):
    print(window)
# (1, 2, 3), (2, 3, 4), (3, 4, 5), (4, 5, 6)
```

#### 11.5.3    Batching (Chunks)
```python
from itertools import islice

def batched(iterable, n):
    """iterable -> [chunk1, chunk2, ...]"""
    iterator = iter(iterable)
    while True:
        batch = list(islice(iterator, n))
        if not batch:
            break
        yield batch

# Verwendung
data = range(10)
for batch in batched(data, 3):
    print(batch)
# [0, 1, 2], [3, 4, 5], [6, 7, 8], [9]

# Ab Python 3.12 eingebaut:
# from itertools import batched
```

#### 11.5.4    Flatten (Verschachtelung auflösen)
```python
from itertools import chain

def flatten(nested_list):
    """[[1,2], [3,4]] -> [1, 2, 3, 4]"""
    return chain.from_iterable(nested_list)

nested = [[1, 2], [3, 4], [5, 6]]
result = list(flatten(nested))
print(result)  # [1, 2, 3, 4, 5, 6]

# Für beliebige Verschachtelung (rekursiv)
def deep_flatten(nested):
    for item in nested:
        if isinstance(item, (list, tuple)):
            yield from deep_flatten(item)
        else:
            yield item

deeply_nested = [1, [2, [3, [4, 5]]]]
result = list(deep_flatten(deeply_nested))
print(result)  # [1, 2, 3, 4, 5]
```

### 11.6    Performance-Vorteile
```python
import time
from itertools import islice, count

# ❌ Ineffizient: Liste erstellen
start = time.time()
large_list = list(range(10_000_000))
first_100 = large_list[:100]
print(f"List: {time.time() - start:.3f}s")

# ✅ Effizient: Iterator verwenden
start = time.time()
first_100 = list(islice(count(), 100))
print(f"Iterator: {time.time() - start:.3f}s")

# Speichervergleich
import sys
numbers_list = list(range(1_000_000))
numbers_iter = range(1_000_000)

print(f"List: {sys.getsizeof(numbers_list)} bytes")     # ~8 MB
print(f"Iterator: {sys.getsizeof(numbers_iter)} bytes") # ~48 bytes
```

### 11.7    Best Practices

**✅ DO:**
- Nutze Iteratoren für große Datenmengen (speichereffizient)
- Kombiniere itertools-Funktionen für komplexe Operationen
- Sortiere Daten vor `groupby()`
- Verwende `chain.from_iterable()` statt verschachtelter Loops

**❌ DON'T:**
- Konvertiere Iteratoren nicht unnötig zu Listen
- Vergiss nicht, dass Iteratoren nur einmal durchlaufen werden können
- Verwende `groupby()` nicht ohne vorheriges Sortieren
- Original-Iterator nach `tee()` nicht weiterverwenden

### 11.8    Zusammenfassung

| Funktion              | Zweck                                    | Rückgabe            |
| --------------------- | ---------------------------------------- | ------------------- |
| `count()`             | Unendliches Zählen                       | 10, 11, 12, ...     |
| `cycle()`             | Elemente zyklisch wiederholen            | A, B, C, A, B, ...  |
| `repeat()`            | Element wiederholen                      | X, X, X, ...        |
| `product()`           | Kartesisches Produkt                     | (A,1), (A,2), ...   |
| `permutations()`      | Alle Anordnungen                         | (A,B), (B,A), ...   |
| `combinations()`      | Kombinationen ohne Wiederholung          | (A,B), (A,C), ...   |
| `chain()`             | Iterables verketten                      | 1, 2, 3, 4, ...     |
| `compress()`          | Filtern mit Boolean-Mask                 | [True], [False], ...     |
| `groupby()`           | Gruppieren (nach Sortierung!)            | Gruppen nach Key    |
| `islice()`            | Slice für Iteratoren                     | Teilbereich         |
| `accumulate()`        | Kumulative Werte                         | 1, 3, 6, 10, ...    |

**Kernprinzip:** `itertools` bietet speichereffiziente, kombinierbare Iterator-Funktionen für funktionale Programmierung und große Datenmengen. Iteratoren sind lazy (verzögerte Auswertung) und können nur einmal durchlaufen werden.

## 12    Zusammenfassung

1. Typprüfung und Instanzen
	- Mit `type()`, `isinstance()` und `issubclass()` prüft man Objekttypen und Vererbungsbeziehungen.

2. Objekt-Erzeugung
	- `__new__` erzeugt das Objekt (besonders bei Immutable-Typen wichtig).
	- `__init__` initialisiert das Objekt nach der Erzeugung.

3. Methodenarten
	- `@staticmethod`: Kein Zugriff auf Klassen- oder Instanzdaten.
	- `@classmethod`: Zugriff auf die Klasse (`cls`).
	- `@property`: Ermöglicht kontrollierten Zugriff auf Attribute wie bei einem Feld.

4. Spezialmethoden (Dunder Methods)
	- Methoden wie `__str__`, `__eq__`, `__getitem__` erlauben es, benutzerdefinierte Objekte wie eingebaute Typen zu behandeln.

5. Abstraktion und Vererbung
	- Abstrakte Klassen (`ABC`, `@abstractmethod`) erzwingen Implementierungen in Unterklassen.
	- Die Method Resolution Order (MRO) bestimmt die Aufrufreihenfolge bei Mehrfachvererbung.

6. Iteration und Indexierung
	- Iterator-Klassen und Generator-Funktionen ermöglichen eigene Iterationslogik.
	- Mit `__getitem__` und `__setitem__` lassen sich Objekte wie Listen verwenden.

7. Speicher- und Datenrepräsentation
	- `@dataclass` reduziert Boilerplate für Datenobjekte.
		- `__slots__` spart Speicher durch festen Attributsatz.
		- `frozen=True` macht die Dataclass unveränderbar.
	- `namedtuple` ist eine kompakte, unveränderliche Datenstruktur mit Feldnamen.

8. Enumerationen
	- Mit `Enum` kann man symbolische Konstanten definieren, die lesbar und typsicher sind.

9. Klassen-Dekoratoren
	- Decorators für Klassen können beim Erzeugen einer Klasse deren Verhalten ändern oder erweitern – ideal für Logging, Validierung oder automatische Registrierung.
