# Ein- und Ausgabe

## 1    Ausgabe mit print()

### 1.1    Mit und ohne Zeilenumbruch

```python
x = 1
y = 2

print(x)
print(y)

print(x, y, sep=', ', end=' ')  # Kein Zeilenumbruch am Ende
print('(Meine Werte)')

print(x, end=', ')  # Komma statt Zeilenumbruch am Ende
print(y)

# Ausgabe:
# 1
# 2
# 1, 2 (Meine Werte)
# 1, 2
```

> [!info] Besonderheit bei der Verwendung von `print()` mit `end=''`
> Normalerweise geht die Ausgabe von `print()` in den Puffer. Wenn der `end`-Parameter verändert wird, wird der Puffer nicht mehr gespült, d. h. aus Effizienzgründen kann es sein, dass die Ausgabe nicht sofort erfolgt, wenn `print()` aufgerufen wird (z. B. in Schleifen). Abhilfe schafft die Verwendung des Parameters `flush`:
> 
> ```python
> print('Hallo', end='', flush=True)
> ```

### 1.2    Formatierung

```python
m = 123456789     # Masse in kg
g = 9.81          # Erdbeschleunigung
F = m * g / 1000  # Gewichtskraft in kN
print(f'F = {F} kN')       #F = 1211111.10009 kN
print(f'F = {round(F, 2)} kN')  #F = 1211111.1 kN
print(f'F = {F:.2f} kN')   #F = 1211111.10 kN
print(f'F = {F:.2e} kN')   #F = 1.21e+06 kN
print('F = %.2e kN'% (F))  #F = 1.21e+06 kN
```

## 2    Logging

```python
import logging

# Setup
level = logging.DEBUG
format = '[%(levelname)s] %(asctime)s - %(message)s'
logging.basicConfig(level=level, format=format)

# Beispiele
logging.info('Normale Info')
logging.debug('Debug-Info')
logging.error('Fehler...')
```

**Ausgabe:**

```
[INFO] 2025-02-27 23:22:36,954 - Normale Info
[DEBUG] 2025-02-27 23:22:36,955 - Debug-Info
[ERROR] 2025-02-27 23:22:36,956 - Fehler...
```

## 3    Tabellen

### 3.1    Mit "Bordmitteln" (ohne zus. Pakete)

**Beispiel 1:**

```python
s1 = 'a'
s2 = 'ab'
s3 = 'abc'
s4 = 'abcd'

print(f'{s1:>10}')  #    a
print(f'{s2:>10}')  #   cd
print(f'{s3:>10}')  #  bcd
print(f'{s4:>10}')  # abcd
```

**Beispiel 2:**

```python
for x in range(1, 11):
    print(f'{x:05} {x*x:3} {x*x*x:4}')
```

Ausgabe:

```
00001   1    1
00002   4    8
00003   9   27
00004  16   64
00005  25  125
00006  36  216
00007  49  343
00008  64  512
00009  81  729
00010 100 1000
```

### 3.2    `tabulate` und `prettytable`

```python
from tabulate import tabulate         # License: MIT
from prettytable import PrettyTable   # License: BSD (3 clause)

head = ['Name', 'Alter']              # Überschriften
data = [['Max', 33], ['Monika', 29]]  # Inhalt/Zeilen

# Paket "tabulate"
# https://github.com/astanin/python-tabulate
print(tabulate(tabular_data=data, headers=head, tablefmt='pretty',
               colalign=('left', 'right')))
# Alternative: tablefmt='fancy_outline'
print()

# Paket "prettytable"
# https://github.com/jazzband/prettytable
t = PrettyTable(head)
t.add_rows(data)
t.add_row(['Werner', 44])
t.align['Name'] = 'l'
t.align['Alter'] = 'r'
print(t)
print()
```

Ausgabe:

```
+--------+-------+
| Name   | Alter |
+--------+-------+
| Max    |    33 |
| Monika |    29 |
+--------+-------+

+--------+-------+
| Name   | Alter |
+--------+-------+
| Max    |    33 |
| Monika |    29 |
| Werner |    44 |
+--------+-------+
```

### 3.3    `texttable`

```python
from texttable import Texttable  # License: MIT
# Paket "texttable"
# https://github.com/foutaise/texttable/
t = Texttable()
t.set_cols_align(['l', 'c', 'r', 'l'])
t.set_cols_valign(['t', 'm', 'm', 'b'])

head = ['Name', 'Spitzname', 'Alter', 'Kommentar']
data = [['Herr\nMaximilian\nHansen', 'Max', 33, '2 Kinder'],
        ['Frau\nMonika\nPetersen', 'Moni', 29, 'kein\nKommentar']]

data.insert(0, head)
t.add_rows(data)
print(t.draw())
print()

t.set_deco(Texttable.HEADER)
print(t.draw())
```

Ausgabe:

```
+------------+-----------+-------+-----------+
|    Name    | Spitzname | Alter | Kommentar |
+============+===========+=======+===========+
| Herr       |           |       |           |
| Maximilian |    Max    |    33 |           |
| Hansen     |           |       | 2 Kinder  |
+------------+-----------+-------+-----------+
| Frau       |           |       |           |
| Monika     |   Moni    |    29 | kein      |
| Petersen   |           |       | Kommentar |
+------------+-----------+-------+-----------+

   Name      Spitzname   Alter   Kommentar
==========================================
Herr
Maximilian      Max         33
Hansen                           2 Kinder
Frau
Monika         Moni         29   kein
Petersen                         Kommentar
```

## 4    Eingabe mit `input()`

Eine Benutzereingabe aus der Konsole kann wie folgt eingelesen werden:

```python
print('Gib etwas ein:')
s = input()
print(f'Du hast den folgenden Text eingegeben: {s}')
```

## 5    Inhalt einer Textdatei lesen

### 5.1    Einzelne Zeichen oder Zeilen lesen

```python
# Datei öffnen
with open('textdok.txt', 'r') as f:
    # Inhalt lesen
    print(f.read(5))     # Erste 5 zeichen der Datei
    print(f.readline())  # Erste Zeile, die noch nicht gelesen wurde
    print(f.readline())  # Nächste Zeile, usw.
```

> [!NOTE]
> **`with`-statement:**
> 
> `f.close()` um die Datei zu schließen kann aufgrund des `with`-statements (Kontextmanager-Statement) entfallen. Die Datei wird auch geschlossen, wenn es innerhalb des `with`-statements zu einem Fehler kommt. **Daher ist diese Variante immer zu bevorzugen, um Resourcenlecks, Dateisperren und Datenverlust zu vermeiden!** Siehe auch [[../b-oop-und-fortgeschrittene-konzepte/kontext-manager-und-contextlib|Kontext-Manager]].

### 5.2    Komplette Datei lesen

```python
# Datei öffnen
with open('textdok.txt', 'r') as f:
    # Inhalt lesen
    text = f.read()       # Als String
    text = f.readlines()  # Als Liste
```

Alternative Möglichkeit, um die Zeilen einer Textdatei in einer Liste zu speichern (der Zeilenumbruch `\n` am Ende der Strings entfällt hierbei):

```python
# Datei öffnen
with open('textdok.txt', 'r'):
	# Inhalt lesen
	text = []
	for line in f:
	    text.append(line.replace('\n', ''))

print(text)
```

## 6    CSV-Datei lesen

```python
import csv

lines = []
with open('tabelle.csv', newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=';', quotechar='|')
    for row in reader:
        lines.append(row)

print(lines)
```

**Alternative mit Pandas:**

```python
import pandas as pd

# Data frame erstellen
# header = None, wenn keine Überschriften vorhanden sind
df = pd.read_csv('beispieldateien/tabelle.csv', header=0, sep=";", decimal=",",
                 names=['x-Wert', 'y-Wert'])
print(df)
print()
print(df.iloc[6]['x-Wert'])
print(df.iloc[6][1])
```

## 7    Weitere Dateioperationen

```python
import os

os.rename(from, to)   # Umbennen
os.remove(path)       # Löschen
os.chmod(file, 0700)  # Dateiberechtigungen
os.stat(file)         # Dateiinformationen wie Größe, Datum, usw.
```

## 8    Pfade mit `os` und `pathlib.Path`

Es gibt es zwei gängige Möglichkeiten, mit Dateipfaden und dem Dateisystem zu arbeiten:

1. Das ältere `os`-Modul (gemeinsam mit `os.path`)
2. Das modernere `pathlib`-Modul

### 8.1    Übersicht

| Funktion                     | `os` / `os.path`                  | `pathlib.Path`                         |
|-----------------------------|-----------------------------------|----------------------------------------|
| Pfad erstellen              | `os.path.join()`                  | `Path() / Path.joinpath()`             |
| Existenz prüfen             | `os.path.exists()`                | `Path.exists()`                        |
| Datei/Verzeichnis prüfen    | `os.path.isfile()` / `.isdir()`   | `Path.is_file()` / `Path.is_dir()`     |
| Absoluter Pfad              | `os.path.abspath()`               | `Path.resolve()`                       |
| Datei lesen/schreiben       | `open(path)`                      | `Path.read_text()` / `Path.write_text()` |
| Verzeichnisinhalt auflisten| `os.listdir()`                    | `Path.iterdir()`                       |

### 8.2    Beispiele mit `os`

```python
import os

# Pfad zusammensetzen
pfad = os.path.join("verzeichnis", "datei.txt")

# Prüfen, ob Pfad existiert
if os.path.exists(pfad):
    print("Pfad existiert.")

# Absoluten Pfad bekommen
absolut = os.path.abspath(pfad)
```

### 8.3    Beispiele mit `pathlib.Path`

```python
from pathlib import Path

# Pfad zusammensetzen
pfad = Path("verzeichnis") / "datei.txt"

# Existenz prüfen
if pfad.exists():
    print("Pfad existiert.")

# Absoluten Pfad bekommen
absolut = pfad.resolve()
```

### 8.4    Vorteile von `pathlib.Path`

- Objektorientiert: `Path` ist eine Klasse mit Methoden, was zu lesbarerem Code führt.
- Plattformunabhängig: `/` funktioniert auf allen Systemen (intern wird automatisch das richtige Trennzeichen verwendet).
- Übersichtlicher: Viele Methoden wie `.read_text()` oder `.mkdir()` sind direkt verfügbar.
- Bessere Lesbarkeit durch Methodenkette statt Funktionsverschachtelung.

> [!INFO] Was sollte man verwenden?
> `pathlib` wurde mit Python 3.4 eingeführt und ist mittlerweile der empfohlene Standard für Pfadoperationen. Nur bei sehr alten Projekten oder bei Kompatibilität mit Python 2 sollte noch `os.path` verwendet werden.

### 8.5    Kombination mit anderen Modulen

`pathlib.Path` lässt sich gut mit anderen Modulen kombinieren, z. B.:

```python
import shutil
pfad = Path("backup") / "datei.txt"
shutil.copy(pfad, Path("ziel") / "kopie.txt")
```

### 8.6    Zusammenfassung

- Für neue Projekte: Immer pathlib.Path verwenden.
- Für alte Projekte oder einfache Kompatibilität: `os.path` kann noch genutzt werden.
- Beide Module bieten ähnliche Funktionalität, aber `pathlib` ist moderner, klarer und objektorientiert.

## 9    Serialisierung – Daten speichern und laden

Serialisierung ist der Prozess, Python-Objekte in ein speicherbares Format zu konvertieren (und wieder zurück). Dies ermöglicht das Speichern von Daten in Dateien oder den Austausch zwischen Systemen.

### 9.1    JSON (JavaScript Object Notation)

JSON ist ein textbasiertes, sprachunabhängiges Datenformat. Es ist lesbar, weit verbreitet und ideal für APIs und Konfigurationsdateien.

#### 9.1.1    Grundlegende Verwendung
```python
import json

# Python-Objekt
data = {
    'name': 'Alice',
    'age': 30,
    'hobbies': ['reading', 'coding'],
    'active': True
}

# In JSON-String konvertieren
json_string = json.dumps(data)
print(json_string)
# {"name": "Alice", "age": 30, "hobbies": ["reading", "coding"], "active": true}

# Zurück zu Python-Objekt
parsed = json.loads(json_string)
print(parsed['name'])  # Alice
```

#### 9.1.2    JSON-Dateien lesen/schreiben
```python
import json

# In Datei schreiben
data = {'users': ['Alice', 'Bob'], 'count': 2}

with open('data.json', 'w') as f:
    json.dump(data, f, indent=2)

# Aus Datei lesen
with open('data.json', 'r') as f:
    loaded_data = json.load(f)
    print(loaded_data)
```

**Formatierung mit `indent` und `sort_keys`:**
```python
data = {'name': 'Bob', 'age': 25, 'city': 'Berlin'}

# Schön formatiert
json_str = json.dumps(data, indent=4, sort_keys=True)
print(json_str)
# {
#     "age": 25,
#     "city": "Berlin",
#     "name": "Bob"
# }
```

#### 9.1.3    Unterstützte Datentypen

| Python         | JSON      |
| -------------- | --------- |
| `dict`         | `object`  |
| `list`, `tuple`| `array`   |
| `str`          | `string`  |
| `int`, `float` | `number`  |
| `True`         | `true`    |
| `False`        | `false`   |
| `None`         | `null`    |

**NICHT direkt unterstützt:** `set`, `datetime`, `Decimal`, custom Objekte

#### 9.1.4    Custom Objekte serialisieren
```python
import json
from datetime import datetime

class Person:
    def __init__(self, name, age, birthday):
        self.name = name
        self.age = age
        self.birthday = birthday

# Custom Encoder
class PersonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Person):
            return {
                'name': obj.name,
                'age': obj.age,
                'birthday': obj.birthday.isoformat()
            }
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

person = Person('Alice', 30, datetime(1994, 5, 15))
json_str = json.dumps(person, cls=PersonEncoder)
print(json_str)
# {"name": "Alice", "age": 30, "birthday": "1994-05-15T00:00:00"}
```

**Custom Decoder:**
```python
def person_decoder(dct):
    """Konvertiert Dictionary zurück zu Person"""
    if 'name' in dct and 'age' in dct and 'birthday' in dct:
        return Person(
            dct['name'],
            dct['age'],
            datetime.fromisoformat(dct['birthday'])
        )
    return dct

loaded = json.loads(json_str, object_hook=person_decoder)
print(type(loaded))  # <class '__main__.Person'>
```

#### 9.1.5    Sets und Tuples behandeln
```python
import json

data = {
    'tags': {'python', 'coding', 'tutorial'},  # Set
    'coordinates': (10, 20)                     # Tuple
}

# Set → List, Tuple → List
json_str = json.dumps({
    'tags': list(data['tags']),
    'coordinates': list(data['coordinates'])
})

# Beim Laden zurückkonvertieren
loaded = json.loads(json_str)
loaded['tags'] = set(loaded['tags'])
loaded['coordinates'] = tuple(loaded['coordinates'])
```

#### 9.1.6    Pretty-Print für Debugging
```python
import json

data = {'users': [{'name': 'Alice', 'age': 30}, {'name': 'Bob', 'age': 25}]}

# Kompakt (für Speicherung/Übertragung)
compact = json.dumps(data, separators=(',', ':'))
print(compact)
# {"users":[{"name":"Alice","age":30},{"name":"Bob","age":25}]}

# Lesbar (für Debugging)
readable = json.dumps(data, indent=2)
print(readable)
```

### 9.2    YAML (YAML Ain't Markup Language)

YAML ist ein menschenlesbares Datenformat, ideal für Konfigurationsdateien. Erfordert Installation: `pip install pyyaml`

#### 9.2.1    Grundlegende Verwendung
```python
import yaml

# Python-Objekt
config = {
    'database': {
        'host': 'localhost',
        'port': 5432,
        'credentials': {
            'username': 'admin',
            'password': 'secret'
        }
    },
    'features': ['logging', 'caching', 'monitoring']
}

# In YAML-String konvertieren
yaml_string = yaml.dump(config)
print(yaml_string)
# database:
#   host: localhost
#   port: 5432
#   credentials:
#     password: secret
#     username: admin
# features:
# - logging
# - caching
# - monitoring

# Zurück zu Python
parsed = yaml.safe_load(yaml_string)
print(parsed['database']['host'])  # localhost
```

#### 9.2.2    YAML-Dateien lesen/schreiben
```python
import yaml

# Schreiben
config = {
    'server': {'host': '0.0.0.0', 'port': 8000},
    'debug': True
}

with open('config.yaml', 'w') as f:
    yaml.dump(config, f, default_flow_style=False)

# Lesen
with open('config.yaml', 'r') as f:
    loaded = yaml.safe_load(f)
    print(loaded)
```

#### 9.2.3    YAML vs. JSON

**Vorteile von YAML:**
- Menschenlesbarer (keine Klammern, weniger Syntax)
- Kommentare möglich
- Komplexe Datenstrukturen (Anker, Aliase)
- Multiline Strings

**Nachteile von YAML:**
- Langsamer als JSON
- Komplexere Syntax (Einrückung wichtig!)
- Sicherheitsrisiko mit `yaml.load()` (immer `safe_load()` verwenden!)
```yaml
# config.yaml - Beispiel

# Server-Konfiguration
server:
  host: localhost
  port: 8080
  
# Multi-line String
description: |
  Dies ist eine
  mehrzeilige
  Beschreibung.

# Anker & Alias (Wiederverwendung)
default: &default_settings
  timeout: 30
  retries: 3

production:
  <<: *default_settings
  host: prod.example.com

development:
  <<: *default_settings
  host: localhost
```

#### 9.2.4    Sicherheit: `safe_load()` vs. `load()`
```python
import yaml

# ❌ GEFÄHRLICH - kann beliebigen Python-Code ausführen!
# data = yaml.load(file, Loader=yaml.Loader)

# ✅ SICHER - nur einfache Python-Objekte
with open('config.yaml', 'r') as f:
    data = yaml.safe_load(f)
```

#### 9.2.5    Custom Objekte in YAML
```python
import yaml

class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

# Representer registrieren
def person_representer(dumper, person):
    return dumper.represent_mapping('!person', {
        'name': person.name,
        'age': person.age
    })

yaml.add_representer(Person, person_representer)

# Constructor registrieren
def person_constructor(loader, node):
    values = loader.construct_mapping(node)
    return Person(values['name'], values['age'])

yaml.add_constructor('!person', person_constructor)

# Verwendung
person = Person('Alice', 30)
yaml_str = yaml.dump(person)
print(yaml_str)
# !person {age: 30, name: Alice}

loaded = yaml.load(yaml_str, Loader=yaml.Loader)
print(type(loaded))  # <class '__main__.Person'>
```

### 9.3    Pickle – Python-spezifische Serialisierung

Pickle serialisiert Python-Objekte in Binärformat. Nur für Python-zu-Python Kommunikation geeignet.

#### 9.3.1    Grundlegende Verwendung
```python
import pickle

# Python-Objekt
data = {
    'numbers': [1, 2, 3],
    'text': 'Hello',
    'nested': {'a': 1, 'b': 2}
}

# Serialisieren (Bytes)
pickled = pickle.dumps(data)
print(pickled)  # b'\x80\x04\x95...'

# Deserialisieren
unpickled = pickle.loads(pickled)
print(unpickled)  # {'numbers': [1, 2, 3], ...}
```

#### 9.3.2    Pickle-Dateien
```python
import pickle

# Schreiben (Binärmodus!)
data = {'users': ['Alice', 'Bob'], 'count': 2}

with open('data.pkl', 'wb') as f:
    pickle.dump(data, f)

# Lesen
with open('data.pkl', 'rb') as f:
    loaded = pickle.load(f)
    print(loaded)
```

#### 9.3.3    Komplexe Objekte pickleln

Pickle kann fast alles serialisieren:
```python
import pickle
from datetime import datetime

class User:
    def __init__(self, name, created):
        self.name = name
        self.created = created
    
    def greet(self):
        return f"Hello, I'm {self.name}"

user = User('Alice', datetime.now())

# Pickle kann custom Objekte direkt serialisieren
pickled = pickle.dumps(user)
loaded = pickle.loads(pickled)

print(loaded.greet())  # Hello, I'm Alice
print(type(loaded.created))  # <class 'datetime.datetime'>
```

#### 9.3.4    Pickle-Protokolle

Pickle hat verschiedene Protokoll-Versionen:
```python
import pickle

data = {'key': 'value'}

# Protokoll 0: ASCII (lesbar, langsam)
p0 = pickle.dumps(data, protocol=0)

# Protokoll 4: Binär, schnell (Standard ab Python 3.8)
p4 = pickle.dumps(data, protocol=4)

# Höchstes verfügbares Protokoll
p_latest = pickle.dumps(data, protocol=pickle.HIGHEST_PROTOCOL)

print(f"Protocol 0: {len(p0)} bytes")
print(f"Protocol 4: {len(p4)} bytes")
```

#### 9.3.5    Pickle-Sicherheitsrisiken

**⚠️ WARNUNG:** Pickle ist UNSICHER für nicht-vertrauenswürdige Daten!
```python
import pickle

# ❌ GEFÄHRLICH - Kann beliebigen Code ausführen!
# untrusted_data = receive_from_network()
# obj = pickle.loads(untrusted_data)  # NICHT tun!

# ✅ Nur Daten aus vertrauenswürdigen Quellen laden
with open('my_data.pkl', 'rb') as f:
    obj = pickle.load(f)
```

#### 9.3.6    Was kann NICHT gepickled werden?

- Lambda-Funktionen (außer mit `dill`)
- Verschachtelte Funktionen
- File Handles
- Netzwerk-Connections
- Thread/Lock Objekte
```python
import pickle

# ❌ Funktioniert NICHT
try:
    data = lambda x: x * 2
    pickle.dumps(data)
except Exception as e:
    print(f"Error: {e}")  # Can't pickle lambda functions

# ✅ Alternative: dill-Bibliothek
import dill
pickled = dill.dumps(lambda x: x * 2)
```

#### 9.3.7    Custom Pickle-Verhalten
```python
import pickle

class Database:
    def __init__(self, host):
        self.host = host
        self.connection = self._connect()  # Nicht serialisierbar
    
    def _connect(self):
        # Simulierte Verbindung
        return f"Connection to {self.host}"
    
    def __getstate__(self):
        """Was gepickled wird"""
        state = self.__dict__.copy()
        del state['connection']  # Verbindung entfernen
        return state
    
    def __setstate__(self, state):
        """Wie es wiederhergestellt wird"""
        self.__dict__.update(state)
        self.connection = self._connect()  # Neu verbinden

db = Database('localhost')
pickled = pickle.dumps(db)
restored = pickle.loads(pickled)
print(restored.connection)  # Connection to localhost
```

### 9.4    Vergleich: JSON vs. YAML vs. Pickle

| Aspekt              | JSON                  | YAML                  | Pickle                |
| ------------------- | --------------------- | --------------------- | --------------------- |
| **Lesbarkeit**      | ✅ Gut                | ✅✅ Sehr gut         | ❌ Binär              |
| **Performance**     | ✅ Schnell            | ⚠️ Langsamer          | ✅✅ Am schnellsten    |
| **Plattform**       | ✅ Sprachunabhängig   | ✅ Sprachunabhängig   | ❌ Nur Python         |
| **Datentypen**      | ⚠️ Limitiert          | ✅ Erweitert          | ✅✅ Alle Python-Typen|
| **Größe**           | ⚠️ Mittel             | ⚠️ Größer             | ✅ Kompakt            |
| **Sicherheit**      | ✅ Sicher             | ⚠️ safe_load()!       | ❌ Unsicher           |
| **Kommentare**      | ❌ Nein               | ✅ Ja                 | ❌ Nein               |
| **Use Case**        | APIs, Config          | Config, CI/CD         | Python Cache, IPC     |

### 9.5    Wann was verwenden?

**Verwende JSON wenn:**
- ✅ Austausch mit anderen Systemen/Sprachen
- ✅ API-Kommunikation
- ✅ Web-Anwendungen
- ✅ Einfache Datenstrukturen
- ✅ Sicherheit wichtig

**Verwende YAML wenn:**
- ✅ Konfigurationsdateien
- ✅ Menschliche Lesbarkeit wichtig
- ✅ Komplexe Hierarchien
- ✅ Kommentare benötigt
- ✅ CI/CD Pipelines (Docker, Kubernetes, etc.)

**Verwende Pickle wenn:**
- ✅ Nur Python-zu-Python Kommunikation
- ✅ Komplexe Python-Objekte
- ✅ Performance kritisch
- ✅ Temporärer Cache
- ❌ NICHT für nicht-vertrauenswürdige Daten

### 9.6    Praktische Beispiele

#### 9.6.1    Konfigurationsdatei mit JSON
```python
import json
from pathlib import Path

class Config:
    def __init__(self, config_file='config.json'):
        self.config_file = Path(config_file)
        self.data = self.load()
    
    def load(self):
        """Lädt Config oder erstellt Default"""
        if self.config_file.exists():
            with open(self.config_file, 'r') as f:
                return json.load(f)
        return self.get_default()
    
    def save(self):
        """Speichert aktuelle Config"""
        with open(self.config_file, 'w') as f:
            json.dump(self.data, f, indent=2)
    
    def get_default(self):
        return {
            'database': {'host': 'localhost', 'port': 5432},
            'debug': False,
            'max_connections': 100
        }
    
    def get(self, key, default=None):
        return self.data.get(key, default)

# Verwendung
config = Config()
print(config.get('database'))
config.data['debug'] = True
config.save()
```

#### 9.6.2    Objekt-Caching mit Pickle
```python
import pickle
from pathlib import Path
import time

class Cache:
    def __init__(self, cache_dir='cache'):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True)
    
    def get(self, key):
        """Lädt gecachtes Objekt"""
        cache_file = self.cache_dir / f"{key}.pkl"
        if cache_file.exists():
            with open(cache_file, 'rb') as f:
                return pickle.load(f)
        return None
    
    def set(self, key, value):
        """Speichert Objekt im Cache"""
        cache_file = self.cache_dir / f"{key}.pkl"
        with open(cache_file, 'wb') as f:
            pickle.dump(value, f)
    
    def clear(self):
        """Löscht alle Cache-Dateien"""
        for file in self.cache_dir.glob('*.pkl'):
            file.unlink()

# Verwendung
cache = Cache()

# Teure Berechnung
def expensive_operation():
    time.sleep(2)
    return {'result': [i**2 for i in range(1000)]}

# Mit Cache
result = cache.get('computation')
if result is None:
    print("Computing...")
    result = expensive_operation()
    cache.set('computation', result)
else:
    print("From cache!")
```

#### 9.6.3    Multi-Format Serializer
```python
import json
import pickle
import yaml
from pathlib import Path

class Serializer:
    @staticmethod
    def save(data, filepath, format='json'):
        """Speichert Daten in gewünschtem Format"""
        path = Path(filepath)
        
        if format == 'json':
            with open(path, 'w') as f:
                json.dump(data, f, indent=2)
        
        elif format == 'yaml':
            with open(path, 'w') as f:
                yaml.dump(data, f)
        
        elif format == 'pickle':
            with open(path, 'wb') as f:
                pickle.dump(data, f)
        
        else:
            raise ValueError(f"Unknown format: {format}")
    
    @staticmethod
    def load(filepath):
        """Lädt Daten basierend auf Dateiendung"""
        path = Path(filepath)
        
        if path.suffix == '.json':
            with open(path, 'r') as f:
                return json.load(f)
        
        elif path.suffix in ['.yaml', '.yml']:
            with open(path, 'r') as f:
                return yaml.safe_load(f)
        
        elif path.suffix == '.pkl':
            with open(path, 'rb') as f:
                return pickle.load(f)
        
        else:
            raise ValueError(f"Unknown format: {path.suffix}")

# Verwendung
data = {'users': ['Alice', 'Bob'], 'count': 2}

Serializer.save(data, 'data.json', 'json')
Serializer.save(data, 'data.yaml', 'yaml')
Serializer.save(data, 'data.pkl', 'pickle')

loaded = Serializer.load('data.json')
print(loaded)
```

### 9.7    Best Practices

**✅ DO:**
- Verwende JSON für APIs und Webdienste
- Verwende YAML für Konfigurationsdateien
- Verwende Pickle nur für vertrauenswürdige Python-interne Daten
- Immer `yaml.safe_load()` statt `yaml.load()`
- Fehlerbehandlung beim Laden
- Versionierung bei Änderungen am Datenformat

**❌ DON'T:**
- Pickle für nicht-vertrauenswürdige Daten
- `yaml.load()` ohne Loader (Sicherheitsrisiko!)
- JSON für binäre Daten (Base64 verwenden falls nötig)
- Sensitive Daten ohne Verschlüsselung speichern
- Große Dateien komplett im Speicher laden

### 9.8    Zusammenfassung

| Format  | Zweck                                | Vorteil                    |
| ------- | ------------------------------------ | -------------------------- |
| JSON    | API, Config, Datenaustausch          | Standard, sicher, schnell  |
| YAML    | Config, CI/CD, menschenlesbar        | Kommentare, lesbar         |
| Pickle  | Python-Cache, temporäre Speicherung  | Alle Python-Typen, schnell |

**Kernprinzip:** Wähle das Serialisierungsformat basierend auf Use Case, Sicherheit und Interoperabilität. JSON ist der sichere Standard, YAML für Konfiguration, Pickle nur für vertrauenswürdige Python-interne Daten.
