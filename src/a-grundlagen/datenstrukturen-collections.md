# Datenstrukturen (Collections)

## 1    Listen

### 1.1    Zugriff auf Elemente, Teillisten

```python
L = ['Null', 'Eins', 'Zwei', 'Drei']

# Anzahl der Elemente
print(len(L))  # 4

# Element 1
print(L[1])    # Eins

# Element 0-2
print(L[0:2])  # ['Null', 'Eins']

# Die letzten beiden Elemente
print(L[-2:])  # ['Zwei', 'Drei']
```

### 1.2    Elemente hinzufügen und löschen

```python
L = [2, 4, 6, 8]
L.append(10)  # Der Wert 10 wird hinzugefügt
print(L)      # [2, 4, 6, 8, 10]

L.remove(4)   # Der Wert 4 wird entfernt (NICHT Element 4)
print(L)      # [2, 6, 8, 10]

del L[0:2]    # Element 0-1 werden gelöscht, kein Rückgabewert
print(L)      # [8, 10]

del L[1]      # Element 1 wird gelöscht, kein Rückgabewert
print(L)      # [8]

# Element 0 wird entfernt und zurückgegeben
print(L.pop(0))  # 8
```

### 1.3    Listen kombinieren

```python
L1 = [1, 2, 3]
L2 = [4, 5, 6]

# Möglichkeit 1
print(L1 + L2)  # [1, 2, 3, 4, 5, 6]

L1.extend(L2)

# Möglichkeit 2
print(L1)       # [1, 2, 3, 4, 5, 6]
```

Prüfen, ob Wert in Liste ist:

```python
L = ["A", "B", "C"]
x = "B"
print(x in L)  # True
```

### 1.4    List comprehensions (kompakte Erstellung von Listen)

**Beispiel 1:**

```python
numbers = []
for i in range(5):
    numbers.append(i**2)
print(numbers)  # [0, 1, 4, 9, 16]

# List comprehension:
numbers = [i**2 for i in range(5)]
print(numbers)  # [0, 1, 4, 9, 16]
```

**Beispiel 2:**

```python
L2 = []
for i in range(0, len(L)):
    if L[i] > 1:
        L2.append(L[i]*2)
print(L2)                         # [4, 6]

# List comprehension:
L = [1, 2, 3]
print([x*2 for x in L if x > 1])  # [4, 6]
```

List comprehension sind in einigen Fällen besser lesbar, können jedoch auch schnell unübersichtlich werden. Sie sind auch mit `if`-Bedingungen möglich.

**Beispiel 1:**

```python
numbers = [i*-1 if i<3 else -1 for i in range(5)]
print(numbers)  # [0, -1, -2, -1, -1]
```

**Beispiel 2:**

```python
numbers = [i+1 for i in range(5) if i != 3]
print(numbers)  # [1, 2, 3, 5]
```

Beim ersten Beispiel steht die if-Bedingung am Anfang, dadurch wird festgelegt, was abgespeichert wird. Beim zweiten Beispiel, bei der die `if`-Bedingung am Ende steht, wird festgelegt, ob überhaupt etwas abgespeichert werden soll.

### 1.5    Kopieren von Listen

> [!danger]
> Das Kopieren einer Liste über Variablenzuweisen (z. B. `l2 = l1`) führt häufig zu einem nicht gewollten Verhalten, da das Ändern von `l2` auch die Änderung von `l1` mit sich bringt.

**Beispiel:**

```python
l1 = [1, 2]
l2 = l1
l2[0] = 3
print(l1)  # [3, 2]
print(l2)  # [3, 2]
```

Dies liegt daran, dass auf diese Weite l1 und l2 auf die selbe Speicheradresse verweisen:

```python
l1 = [1, 2]
l2 = l1
print(id(l1))  # 1957190476864
print(id(l2))  # 1957190476864
```

Um das zu umgehen, kopiert man Listen wie folgt:

```python
l1 = [1, 2]
l2 = l1.copy()
l2[0] = 3
print(l1)  # [1, 2]
print(l2)  # [3, 2]
```

> [!warning]
> Dies ist eine sog. *shallow-copy*. Bei mehrdimensionalen Listen funktioniert dies jedoch nicht! Es muss eine sog. *deep-copy* erstellt werden.

**Beispiel für shallow-copy:**

```python
import copy

l1 = [[1, 2], [3, 4]]
l2 = l1.copy()  # oder l2 = copy.copy(l1)
l2[0][0] = 5
print(l1)  # [[5, 2], [3, 4]]
print(l2)  # [[5, 2], [3, 4]]
print(id(l1))        # 1957176932224
print(id(l2))        # 1957176994368
print(id(l1[0][0]))  # 1956557750640
print(id(l2[0][0]))  # 1956557750640
```

**Beispiel für deep-copy:**

```python
import copy

l1 = [[1, 2], [3, 4]]
l2 = copy.deepcopy(l1)
l2[0][0] = 5
print(l1)            # [[1, 2], [3, 4]]
print(l2)            # [[5, 2], [3, 4]]
print(id(l1))        # 1957190472320
print(id(l2))        # 1957190477184
print(id(l1[0][0]))  # 1956557750512
print(id(l2[0][0]))  # 1956557750640
```

Mehr zu Listen unter:
https://www.programiz.com/python-programming/methods/list

## 2    Arrays

Arrays sind ähnlich wie Listen, jedoch effizienter bei numerischen Operationen, insbesondere für große Datenmengen. In Python können Arrays mit dem `array`-Modul oder über `NumPy` verwendet werden.

```python
import array

# Ein Array mit ganzen Zahlen (Typcode 'i' für Integer)
arr = array.array('i', [1, 2, 3, 4, 5])
print(arr)  # array('i', [1, 2, 3, 4, 5])

# Elementzugriff
print(arr[1])  # 2

# Element hinzufügen
arr.append(6)
print(arr)  # array('i', [1, 2, 3, 4, 5, 6])

# Element entfernen
arr.remove(3)
print(arr)  # array('i', [1, 2, 4, 5, 6])
```

## 3    Tupel

Tupel sind wie Listen, jedoch mit dem Unterschied, dass der Inhalt des Tupels nicht veränderbar ist.

```python
t = 1, 2, 3
t = (1, 2, 3)
print(t[0])  # 1
```

### 3.1    Tuple unpacking

```python
t = (1, 2, 3)

val1, val2, val3 = t
print(val1, val2, val3)  # 1 2 3

val1, _, val3 = t
print(val1, val3)        # 1 3

val1, *t2 = t
print(val1, t2)          # 1 [2, 3]
```

## 4    Dictionaries

Dictionaries werden benutzt, um Daten in `key`-`value`-Paaren zu speichern.

**Erstellung von Dictionaries:**

```python
# Möglichkeit 1:
baujahr = {'Ford': 2019, 'Honda': 2013}
print(baujahr)  # {'Ford': 2019, 'Honda': 2013}

# Möglichkeit 2:
baujahr = dict(Ford = 2019, Honda = 2013)
print(baujahr)  # {'Ford': 2019, 'Honda': 2013}

# Möglichkeit 3: Schlüssel werden als Tupel übergeben)
baujahr = dict.fromkeys( ('Ford', 'Honda') )
baujahr['Ford'] = 2019
baujahr['Honda'] = 2013
print(baujahr)  # {'Ford': 2019, 'Honda': 2013}
```

**Zugriff auf die Schlüssel und Werte von Dictionaries in Schleifen:**

```python
D = {'Ford': 2019, 'Honda': 2013}

print('Schlüssel des Dictionaries:')
for key in D:
    print(key)
    # Ford
    # Honda

print('\nWerte des Dictionaries:')
for value in D.values():
    print(value)
    # 2019
    # 2013

print('\nSchlüssel und Werte des Dictionaries:')
for key, value in D.items():
    print(f'{key}: {value}')
    # Ford: 2019
    # Honda: 2013
```

## 5    Sets bzw. Mengen

Siehe auch [operatoren](operatoren.md).

**Operationen:**

```python
S1 = {'Banane', 'Paprika', 'Zitrone'}
S2 = {'Apfel', 'Banane', 'Birne', 'Gurke', 'Paprika'}

# Vereinigung
print(S1 | S2)  # {'Zitrone', 'Gurke', 'Birne', 'Paprika', 'Apfel', 'Banane'}

# Schnittmenge
print(S1 & S2)  # {'Paprika', 'Banane'}

# Differenz (S1 ohne S2)
print(S1 - S2)  # {'Zitrone'}

# Symmetrische Differenz (= Vereinigung ohne Schnittmenge)
print(S1 ^ S2)  # {'Apfel', 'Zitrone', 'Gurke', 'Birne'}

print('\nAlternativen:')

# Vereinigung
print(S1.union(S2)) # {'Zitrone', 'Gurke', 'Birne', 'Paprika', 'Apfel', 'Banane'}

# Schnittmenge
print(S1.intersection(S2))  # {'Paprika', 'Banane'}

# Differenz (S1 ohne S2)
print(S1.difference(S2))    # {'Zitrone'}

# Symmetrische Differenz (= Vereinigung ohne Schnittmenge)
print(S1.symmetric_difference(S2))  # {'Apfel', 'Zitrone', 'Gurke', 'Birne'}
```

Mehr zu Datentypen:
https://docs.python.org/3/library/stdtypes.html

## 6    Das `collections`-Modul

Das `collections`-Modul bietet spezialisierte Container-Datentypen, die über die eingebauten Listen, Tupel, Dictionaries und Sets hinausgehen.

### 6.1    `Counter` – Zählen von Elementen

`Counter` ist ein Dictionary-Subtyp zum Zählen von hashbaren Objekten.

#### 6.1.1    Grundlegende Verwendung
```python
from collections import Counter

# Aus Liste erstellen
words = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple']
counter = Counter(words)
print(counter)  # Counter({'apple': 3, 'banana': 2, 'cherry': 1})

# Aus String erstellen (zählt Zeichen)
text = "mississippi"
counter = Counter(text)
print(counter)  # Counter({'i': 4, 's': 4, 'p': 2, 'm': 1})

# Direkte Initialisierung
counter = Counter(a=3, b=2, c=1)
print(counter)  # Counter({'a': 3, 'b': 2, 'c': 1})
```

#### 6.1.2    Häufigste Elemente
```python
from collections import Counter

votes = ['Alice', 'Bob', 'Alice', 'Charlie', 'Bob', 'Alice']
counter = Counter(votes)

# Häufigste n Elemente
print(counter.most_common(2))  # [('Alice', 3), ('Bob', 2)]

# Alle Elemente nach Häufigkeit
print(counter.most_common())   # [('Alice', 3), ('Bob', 2), ('Charlie', 1)]
```

#### 6.1.3    Counter-Operationen
```python
from collections import Counter

c1 = Counter(a=3, b=1)
c2 = Counter(a=1, b=2)

# Addition
print(c1 + c2)  # Counter({'a': 4, 'b': 3})

# Subtraktion (negative Werte werden entfernt)
print(c1 - c2)  # Counter({'a': 2})

# Vereinigung (Maximum)
print(c1 | c2)  # Counter({'a': 3, 'b': 2})

# Schnittmenge (Minimum)
print(c1 & c2)  # Counter({'a': 1, 'b': 1})
```

#### 6.1.4    Praktische Beispiele

**Wortfrequenz-Analyse:**
```python
from collections import Counter

text = """Python ist eine wunderbare Programmiersprache. 
Python macht Spaß und Python ist mächtig."""

words = text.lower().split()
word_count = Counter(words)

print(word_count.most_common(3))
# [('python', 3), ('ist', 2), ('eine', 1)]
```

**Duplikate finden:**
```python
from collections import Counter

data = [1, 2, 3, 2, 4, 5, 3, 6, 7, 3]
counter = Counter(data)

# Elemente, die mehr als einmal vorkommen
duplicates = [item for item, count in counter.items() if count > 1]
print(duplicates)  # [2, 3]
```

### 6.2    `defaultdict` – Dictionary mit Standardwerten

`defaultdict` erstellt automatisch Standardwerte für fehlende Schlüssel.

#### 6.2.1    Grundkonzept
```python
from collections import defaultdict

# Mit list als Factory
d = defaultdict(list)
d['fruits'].append('apple')
d['fruits'].append('banana')
d['vegetables'].append('carrot')

print(d)  # defaultdict(<class 'list'>, {'fruits': ['apple', 'banana'], 'vegetables': ['carrot']})

# Mit int als Factory (Standardwert 0)
counter = defaultdict(int)
for word in ['a', 'b', 'a', 'c', 'b', 'a']:
    counter[word] += 1

print(counter)  # defaultdict(<class 'int'>, {'a': 3, 'b': 2, 'c': 1})
```

#### 6.2.2    Verschiedene Factory-Funktionen
```python
from collections import defaultdict

# list - leere Liste
d1 = defaultdict(list)
print(d1['key'])  # []

# int - 0
d2 = defaultdict(int)
print(d2['key'])  # 0

# str - leerer String
d3 = defaultdict(str)
print(d3['key'])  # ''

# set - leeres Set
d4 = defaultdict(set)
print(d4['key'])  # set()

# Lambda für custom Defaults
d5 = defaultdict(lambda: 'N/A')
print(d5['key'])  # 'N/A'
```

#### 6.2.3    Vergleich: dict vs. defaultdict
```python
# Normales dict
d = {}
# d['key'].append('value')  # KeyError!

# Mit setdefault (umständlich)
d.setdefault('key', []).append('value')

# Mit defaultdict (elegant)
from collections import defaultdict
d = defaultdict(list)
d['key'].append('value')  # Funktioniert!
```

#### 6.2.4    Praktische Beispiele

**Gruppieren nach Schlüssel:**
```python
from collections import defaultdict

students = [
    ('Alice', 'Math'),
    ('Bob', 'Physics'),
    ('Charlie', 'Math'),
    ('Diana', 'Physics'),
    ('Eve', 'Math')
]

by_subject = defaultdict(list)
for name, subject in students:
    by_subject[subject].append(name)

print(dict(by_subject))
# {'Math': ['Alice', 'Charlie', 'Eve'], 'Physics': ['Bob', 'Diana']}
```

**Verschachtelte defaultdict:**
```python
from collections import defaultdict

# Zweistufiges defaultdict
tree = lambda: defaultdict(tree)
users = tree()

users['john']['age'] = 30
users['john']['city'] = 'New York'
users['alice']['age'] = 25

print(dict(users))
# {'john': {'age': 30, 'city': 'New York'}, 'alice': {'age': 25}}
```

### 6.3    `deque` – Double-Ended Queue

`deque` (ausgesprochen "deck") ist eine Liste, die für schnelle Zugriffe an beiden Enden optimiert ist.

#### 6.3.1    Grundoperationen
```python
from collections import deque

# Erstellen
d = deque([1, 2, 3])
print(d)  # deque([1, 2, 3])

# Am Ende hinzufügen/entfernen (wie Liste)
d.append(4)
print(d)  # deque([1, 2, 3, 4])

last = d.pop()
print(last, d)  # 4 deque([1, 2, 3])

# Am Anfang hinzufügen/entfernen (O(1) statt O(n))
d.appendleft(0)
print(d)  # deque([0, 1, 2, 3])

first = d.popleft()
print(first, d)  # 0 deque([1, 2, 3])
```

#### 6.3.2    Rotation und Erweiterung
```python
from collections import deque

d = deque([1, 2, 3, 4, 5])

# Rotation nach rechts
d.rotate(2)
print(d)  # deque([4, 5, 1, 2, 3])

# Rotation nach links
d.rotate(-2)
print(d)  # deque([1, 2, 3, 4, 5])

# Mehrere Elemente hinzufügen
d.extend([6, 7])
print(d)  # deque([1, 2, 3, 4, 5, 6, 7])

d.extendleft([0, -1])
print(d)  # deque([-1, 0, 1, 2, 3, 4, 5, 6, 7])
```

#### 6.3.3    Maximale Länge (Ringbuffer)
```python
from collections import deque

# Deque mit maximaler Länge
d = deque(maxlen=3)

d.append(1)
d.append(2)
d.append(3)
print(d)  # deque([1, 2, 3], maxlen=3)

d.append(4)  # Ältestes Element (1) wird automatisch entfernt
print(d)  # deque([2, 3, 4], maxlen=3)
```

#### 6.3.4    Performance-Vergleich: list vs. deque
```python
from collections import deque
import time

# Liste
data_list = []
start = time.time()
for i in range(100000):
    data_list.insert(0, i)  # O(n) - langsam!
print(f"List insert(0): {time.time() - start:.3f}s")

# Deque
data_deque = deque()
start = time.time()
for i in range(100000):
    data_deque.appendleft(i)  # O(1) - schnell!
print(f"Deque appendleft: {time.time() - start:.3f}s")
```

**Typisches Ergebnis:**
- List insert(0): ~3.5s
- Deque appendleft: ~0.01s

#### 6.3.5    Praktische Beispiele

**FIFO-Queue (First In, First Out):**
```python
from collections import deque

queue = deque()

# Elemente hinzufügen
queue.append('Task 1')
queue.append('Task 2')
queue.append('Task 3')

# Elemente verarbeiten (FIFO)
while queue:
    task = queue.popleft()
    print(f"Processing: {task}")
```

**Sliding Window:**
```python
from collections import deque

def moving_average(values, window_size):
    """Berechnet gleitenden Durchschnitt"""
    window = deque(maxlen=window_size)
    averages = []
    
    for value in values:
        window.append(value)
        averages.append(sum(window) / len(window))
    
    return averages

data = [10, 20, 30, 40, 50, 60]
result = moving_average(data, window_size=3)
print(result)  # [10.0, 15.0, 20.0, 30.0, 40.0, 50.0]
```

**Browser History (Back/Forward):**
```python
from collections import deque

class BrowserHistory:
    def __init__(self):
        self.back_stack = deque()
        self.forward_stack = deque()
        self.current = None
    
    def visit(self, url):
        if self.current:
            self.back_stack.append(self.current)
        self.current = url
        self.forward_stack.clear()
    
    def back(self):
        if self.back_stack:
            self.forward_stack.append(self.current)
            self.current = self.back_stack.pop()
        return self.current
    
    def forward(self):
        if self.forward_stack:
            self.back_stack.append(self.current)
            self.current = self.forward_stack.pop()
        return self.current

# Verwendung
browser = BrowserHistory()
browser.visit('google.com')
browser.visit('python.org')
browser.visit('github.com')
print(browser.back())     # python.org
print(browser.back())     # google.com
print(browser.forward())  # python.org
```

### 6.4    `ChainMap` – Mehrere Dictionaries verketten

`ChainMap` gruppiert mehrere Dictionaries zu einem einzigen View.

#### 6.4.1    Grundkonzept
```python
from collections import ChainMap

dict1 = {'a': 1, 'b': 2}
dict2 = {'b': 3, 'c': 4}
dict3 = {'c': 5, 'd': 6}

# ChainMap erstellen
chain = ChainMap(dict1, dict2, dict3)

print(chain['a'])  # 1 (aus dict1)
print(chain['b'])  # 2 (aus dict1, nicht dict2!)
print(chain['c'])  # 4 (aus dict2, nicht dict3!)
print(chain['d'])  # 6 (aus dict3)
```

**Wichtig:** Bei Lookup wird das **erste** Dictionary mit dem Schlüssel verwendet.

#### 6.4.2    Modifikationen
```python
from collections import ChainMap

user_config = {'theme': 'dark', 'font_size': 12}
default_config = {'theme': 'light', 'font_size': 14, 'auto_save': True}

config = ChainMap(user_config, default_config)

print(config['theme'])      # 'dark' (aus user_config)
print(config['auto_save'])  # True (aus default_config)

# Änderungen gehen ins ERSTE Dictionary
config['theme'] = 'blue'
print(user_config)  # {'theme': 'blue', 'font_size': 12}
print(default_config)  # Unverändert

# Neuer Schlüssel wird auch ins ERSTE Dictionary eingefügt
config['new_key'] = 'value'
print(user_config)  # {'theme': 'blue', 'font_size': 12, 'new_key': 'value'}
```

#### 6.4.3    Methoden
```python
from collections import ChainMap

dict1 = {'a': 1}
dict2 = {'b': 2}

chain = ChainMap(dict1, dict2)

# Neues Dictionary vorne hinzufügen
chain = chain.new_child({'c': 3})
print(chain)  # ChainMap({'c': 3}, {'a': 1}, {'b': 2})

# Erstes Dictionary entfernen
chain = chain.parents
print(chain)  # ChainMap({'a': 1}, {'b': 2})

# Alle Maps anzeigen
print(chain.maps)  # [{'a': 1}, {'b': 2}]
```

#### 6.4.4    Praktische Beispiele

**Konfiguration mit Fallbacks:**
```python
from collections import ChainMap
import os

# Priorität: CLI-Args > Env-Vars > Config-File > Defaults
defaults = {
    'host': 'localhost',
    'port': 8000,
    'debug': False
}

config_file = {
    'host': '0.0.0.0',
    'port': 3000
}

env_vars = {
    k.lower().replace('app_', ''): v 
    for k, v in os.environ.items() 
    if k.startswith('APP_')
}

cli_args = {
    'debug': True
}

config = ChainMap(cli_args, env_vars, config_file, defaults)

print(config['host'])   # '0.0.0.0' (aus config_file)
print(config['debug'])  # True (aus cli_args)
print(config['port'])   # 3000 (aus config_file)
```

**Scope-Management (z.B. für Interpreter):**
```python
from collections import ChainMap

class Scope:
    def __init__(self):
        self.scopes = ChainMap({})
    
    def push_scope(self):
        """Neuer Scope (z.B. neue Funktion)"""
        self.scopes = self.scopes.new_child()
    
    def pop_scope(self):
        """Scope verlassen"""
        self.scopes = self.scopes.parents
    
    def set(self, name, value):
        """Variable im aktuellen Scope setzen"""
        self.scopes[name] = value
    
    def get(self, name):
        """Variable nachschlagen (mit Fallback zu äußeren Scopes)"""
        return self.scopes.get(name)

# Verwendung
scope = Scope()
scope.set('x', 10)          # Global: x=10

scope.push_scope()          # Neue Funktion
scope.set('x', 20)          # Lokal: x=20
print(scope.get('x'))       # 20

scope.pop_scope()           # Funktion verlassen
print(scope.get('x'))       # 10 (global wieder sichtbar)
```

### 6.5    `namedtuple` – Tupel mit benannten Feldern

`namedtuple` erstellt Tuple-Subklassen mit benannten Feldern.

#### 6.5.1    Grundlegende Verwendung
```python
from collections import namedtuple

# namedtuple-Klasse definieren
Point = namedtuple('Point', ['x', 'y'])

# Instanzen erstellen
p1 = Point(10, 20)
p2 = Point(x=30, y=40)

# Zugriff per Name oder Index
print(p1.x)     # 10
print(p1[0])    # 10
print(p1.y)     # 20

# Tuple unpacking funktioniert
x, y = p1
print(x, y)     # 10 20
```

#### 6.5.2    Verschiedene Erstellungsmethoden
```python
from collections import namedtuple

# Methode 1: Liste von Strings
Point = namedtuple('Point', ['x', 'y'])

# Methode 2: String mit Leerzeichen
Point = namedtuple('Point', 'x y')

# Methode 3: String mit Kommas
Point = namedtuple('Point', 'x, y')
```

#### 6.5.3    Methoden von namedtuple
```python
from collections import namedtuple

Point = namedtuple('Point', 'x y')
p = Point(10, 20)

# Als Dictionary
print(p._asdict())  # {'x': 10, 'y': 20}

# Felder anzeigen
print(p._fields)    # ('x', 'y')

# Neues Objekt mit geänderten Werten
p2 = p._replace(x=30)
print(p2)           # Point(x=30, y=20)

# Aus iterable erstellen
Point._make([40, 50])  # Point(x=40, y=50)
```

#### 6.5.4    Default-Werte
```python
from collections import namedtuple

# Mit defaults (Python 3.7+)
Point = namedtuple('Point', ['x', 'y', 'z'], defaults=[0, 0, 0])

p1 = Point()
print(p1)  # Point(x=0, y=0, z=0)

p2 = Point(10)
print(p2)  # Point(x=10, y=0, z=0)

p3 = Point(10, 20)
print(p3)  # Point(x=10, y=20, z=0)
```

#### 6.5.5    Vergleich: namedtuple vs. dict vs. class
```python
from collections import namedtuple

# namedtuple
Person = namedtuple('Person', 'name age')
p1 = Person('Alice', 30)

# Dictionary
p2 = {'name': 'Alice', 'age': 30}

# Klasse
class PersonClass:
    def __init__(self, name, age):
        self.name = name
        self.age = age
p3 = PersonClass('Alice', 30)

# Speicherverbrauch
import sys
print(f"namedtuple: {sys.getsizeof(p1)} bytes")  # ~56
print(f"dict: {sys.getsizeof(p2)} bytes")        # ~232
print(f"class: {sys.getsizeof(p3)} bytes")       # ~48 + __dict__
```

#### 6.5.6    Praktische Beispiele

**CSV-Daten verarbeiten:**
```python
from collections import namedtuple
import csv

# CSV-Daten
csv_data = """name,age,city
Alice,30,New York
Bob,25,London
Charlie,35,Paris"""

# namedtuple aus CSV-Header
lines = csv_data.strip().split('\n')
header = lines[0].split(',')
Person = namedtuple('Person', header)

# Daten parsen
people = []
for line in lines[1:]:
    values = line.split(',')
    person = Person(*values)
    people.append(person)

for p in people:
    print(f"{p.name} is {p.age} years old from {p.city}")
```

**Koordinaten-System:**
```python
from collections import namedtuple
import math

Point = namedtuple('Point', 'x y')

def distance(p1, p2):
    """Euklidische Distanz zwischen zwei Punkten"""
    return math.sqrt((p2.x - p1.x)**2 + (p2.y - p1.y)**2)

p1 = Point(0, 0)
p2 = Point(3, 4)

print(f"Distance: {distance(p1, p2)}")  # 5.0
```

**RGB-Farben:**
```python
from collections import namedtuple

Color = namedtuple('Color', 'red green blue')

# Vordefinierte Farben
BLACK = Color(0, 0, 0)
WHITE = Color(255, 255, 255)
RED = Color(255, 0, 0)

def to_hex(color):
    return f'#{color.red:02x}{color.green:02x}{color.blue:02x}'

print(to_hex(RED))  # #ff0000
```

### 6.6    Zusammenfassung

| Collection     | Verwendung                                    | Vorteil                          |
| -------------- | --------------------------------------------- | -------------------------------- |
| `Counter`      | Elemente zählen                               | Einfache Häufigkeitsanalyse      |
| `defaultdict`  | Dictionary mit Auto-Initialisierung           | Kein KeyError, weniger Code      |
| `deque`        | Queue/Stack mit Zugriff an beiden Enden       | O(1) append/pop an beiden Enden  |
| `ChainMap`     | Mehrere Dictionaries verketten                | Konfiguration mit Fallbacks      |
| `namedtuple`   | Tupel mit benannten Feldern                   | Lesbar, leichtgewichtig          |

**Kernprinzip:** Das `collections`-Modul bietet spezialisierte Datenstrukturen für häufige Anwendungsfälle, die effizienter und lesbarer sind als selbstgebaute Lösungen.