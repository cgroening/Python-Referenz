## 1    Aufbau von Modulen und Paketen

### 1.1    Was ist ein Modul?

Ein Modul ist eine einzelne Python-Datei (`.py`), die Funktionen, Klassen oder Variablen enthält. Module helfen, Code logisch zu gliedern und wiederverwendbar zu machen.

Beispiel für ein Modul `math_utils.py`:

```python
# math_utils.py

def add(a, b):
    return a + b

def multiply(a, b):
    return a * b
```

Dieses Modul kann in anderen Dateien importiert werden:

```python
import math_utils

print(math_utils.add(2, 3))       # Ausgabe: 5
print(math_utils.multiply(4, 5))  # Ausgabe: 20
```

### 1.2    Was ist ein Paket?

Ein Paket ist ein Verzeichnis, das mehrere Module enthält und eine `__init__.py`-Datei besitzt. Diese Datei kennzeichnet das Verzeichnis als Paket.

Beispielstruktur:

```
my_package/
├── __init__.py
├── math_utils.py
└── string_utils.py
```

Inhalt von `__init__.py` (kann leer sein oder Exporte definieren):

```python
from .math_utils import add, multiply
from .string_utils import capitalize
```

Verwendung des Pakets:

```python
import my_package

print(my_package.add(2, 2))
```

### 1.3    Import-System und Paketsuche

Python's Import-System bestimmt, wie Module und Pakete gefunden und geladen werden. Das Verständnis von `sys.path` und `importlib` ist wichtig für größere Projekte und Package-Entwicklung.

#### 1.3.1    Wie Python Module findet

Beim `import`-Statement sucht Python in dieser Reihenfolge:

1. **Built-in Modules** (in Python kompiliert)
2. **Aktuelles Verzeichnis** (wo das Script liegt)
3. **`PYTHONPATH`** Environment Variable
4. **Standard-Library-Pfade**
5. **Site-Packages** (installierte Pakete)
```python
import sys

# Alle Suchpfade anzeigen
for path in sys.path:
    print(path)

# Typische Ausgabe:
# /Users/user/project           ← Aktuelles Verzeichnis
# /usr/local/lib/python3.10     ← Standard Library
# /usr/local/lib/python3.10/site-packages  ← Installierte Pakete
```

#### 1.3.2    `sys.path` manipulieren

`sys.path` ist eine Liste und kann zur Laufzeit modifiziert werden.
```python
import sys

# Pfad hinzufügen (am Ende)
sys.path.append('/path/to/my/modules')

# Pfad hinzufügen (am Anfang - höhere Priorität)
sys.path.insert(0, '/path/to/my/modules')

# Jetzt können Module aus diesem Pfad importiert werden
import my_custom_module
```

**Praktisches Beispiel – Projekt-Root finden:**
```python
import sys
from pathlib import Path

# Projekt-Root zum Path hinzufügen
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

# Jetzt können alle Projekt-Module importiert werden
from src.utils import helper
```

#### 1.3.3    `PYTHONPATH` Environment Variable

Permanent Pfade hinzufügen ohne Code-Änderung:
```bash
# Linux/macOS
export PYTHONPATH="/path/to/modules:$PYTHONPATH"

# Windows
set PYTHONPATH=C:\path\to\modules;%PYTHONPATH%

# In .bashrc/.zshrc dauerhaft:
echo 'export PYTHONPATH="/path/to/modules:$PYTHONPATH"' >> ~/.bashrc
```

**In Python-Scripts:**
```python
import os

# PYTHONPATH zur Laufzeit setzen (vor Import!)
os.environ['PYTHONPATH'] = '/path/to/modules'
```

#### 1.3.4    Module dynamisch importieren mit `importlib`

`importlib` erlaubt programmatisches Importieren zur Laufzeit.

**Modul aus String importieren:**
```python
import importlib

# Modul-Name als String
module_name = 'math'
math_module = importlib.import_module(module_name)

print(math_module.sqrt(16))  # 4.0

# Mit relativem Import (innerhalb eines Pakets)
# from ..utils import helper  ← als Code
helper = importlib.import_module('..utils.helper', package='mypackage.submodule')
```

**Modul neu laden:**
```python
import importlib
import my_module

# Modul während Entwicklung neu laden
importlib.reload(my_module)
```

**Plugin-System mit dynamischen Imports:**
```python
import importlib
import os

def load_plugins(plugin_dir):
    """Lädt alle Python-Dateien aus plugin_dir als Module"""
    plugins = []
    
    for filename in os.listdir(plugin_dir):
        if filename.endswith('.py') and not filename.startswith('_'):
            module_name = filename[:-3]  # .py entfernen
            
            # Dynamisch importieren
            spec = importlib.util.spec_from_file_location(
                module_name, 
                os.path.join(plugin_dir, filename)
            )
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            
            plugins.append(module)
    
    return plugins

# Verwendung
plugins = load_plugins('./plugins')
for plugin in plugins:
    if hasattr(plugin, 'initialize'):
        plugin.initialize()
```

#### 1.3.5    Import-Mechanismus im Detail

**Was passiert bei `import module`:**

1. Python prüft `sys.modules` (Cache) ob Modul bereits geladen
2. Falls nicht: Suche nach Modul in `sys.path`
3. Modul-Datei wird gefunden und kompiliert zu Bytecode (`.pyc`)
4. Code wird ausgeführt
5. Modul-Objekt wird in `sys.modules` gecacht
6. Name wird im lokalen Namespace gebunden
```python
import sys

# Modul-Cache anzeigen
print('math' in sys.modules)  # False

import math
print('math' in sys.modules)  # True

# Modul ist jetzt gecacht
import math  # Lädt nicht neu, nutzt Cache
```

**Cache manuell leeren:**
```python
import sys

# Modul aus Cache entfernen
if 'my_module' in sys.modules:
    del sys.modules['my_module']

# Jetzt wird es beim nächsten Import neu geladen
import my_module
```

#### 1.3.6    Import-Varianten
```python
# 1. Ganzes Modul importieren
import math
print(math.sqrt(16))

# 2. Spezifische Funktionen importieren
from math import sqrt, pi
print(sqrt(16))

# 3. Alles importieren (nicht empfohlen!)
from math import *

# 4. Mit Alias
import numpy as np
from datetime import datetime as dt

# 5. Relativer Import (nur innerhalb von Paketen)
from . import sibling_module
from .. import parent_module
from ..sibling_package import module
```

#### 1.3.7    `__init__.py` im Detail

Die `__init__.py` kontrolliert, was beim Import eines Pakets passiert.

**Leere `__init__.py`:**
```python
# my_package/__init__.py
# (leer)
```
```python
# Verwendung
import my_package.module  # OK
from my_package import module  # OK
import my_package  # OK, aber nichts verfügbar
```

**Mit Exporten:**
```python
# my_package/__init__.py
from .module_a import function_a
from .module_b import ClassB
from .subpackage import helper

__all__ = ['function_a', 'ClassB', 'helper']
```
```python
# Verwendung
from my_package import function_a, ClassB
import my_package
my_package.function_a()  # Funktioniert!
```

**Mit `__all__` für `from package import *`:**
```python
# my_package/__init__.py
from .module_a import function_a
from .module_b import function_b, function_c

# Nur diese werden bei "from package import *" exportiert
__all__ = ['function_a', 'function_b']
```

#### 1.3.8    Namespace Packages (PEP 420)

Seit Python 3.3: Packages ohne `__init__.py` (für verteilte Packages).
```
namespace_package/
├── part1/
│   └── module_a.py
└── part2/
    └── module_b.py
```
```python
# Beide Teile werden als ein Namespace-Package behandelt
from namespace_package.part1 import module_a
from namespace_package.part2 import module_b
```

**Wann verwenden:**
- Große Packages über mehrere Repositories verteilt
- Plugin-Systeme
- Unternehmens-interne Package-Strukturen

#### 1.3.9    Import-Hooks und Finder

Fortgeschritten: Eigene Import-Mechanismen implementieren.
```python
import sys
import importlib.abc
import importlib.machinery

class CustomFinder(importlib.abc.MetaPathFinder):
    def find_spec(self, fullname, path, target=None):
        """Custom Module Finder"""
        if fullname.startswith('custom_'):
            print(f"Custom finder handling: {fullname}")
            # Eigene Logik zum Finden des Moduls
        return None

# Finder registrieren
sys.meta_path.insert(0, CustomFinder())
```

#### 1.3.10    Debugging von Import-Problemen
```python
import sys

# 1. Prüfen, ob Modul im Path liegt
def find_module(module_name):
    """Zeigt, wo Python nach einem Modul suchen würde"""
    import importlib.util
    
    spec = importlib.util.find_spec(module_name)
    if spec:
        print(f"Found: {spec.origin}")
    else:
        print(f"Not found: {module_name}")
        print("\nSearching in:")
        for path in sys.path:
            print(f"  {path}")

find_module('numpy')

# 2. Import mit Debugging
import importlib
import logging

logging.basicConfig(level=logging.DEBUG)

# Zeigt detaillierte Import-Informationen
import importlib
importlib.import_module('my_module')

# 3. Verbose Imports beim Start
# python -v script.py
```

#### 1.3.11    Best Practices

**✅ DO:**
```python
# Absolute Imports bevorzugen
from my_package.module import function

# sys.path nur für temporäre Anpassungen
import sys
sys.path.insert(0, '/temp/path')

# importlib für dynamische Imports
import importlib
module = importlib.import_module('plugin_name')

# __all__ in __init__.py definieren
__all__ = ['public_function', 'PublicClass']
```

**❌ DON'T:**
```python
# Vermeiden: from module import *
from math import *  # Namespace pollution!

# Vermeiden: sys.path dauerhaft manipulieren in Libraries
sys.path.append('/hardcoded/path')  # Nicht portabel!

# Vermeiden: Zirkuläre Imports
# module_a.py imports module_b
# module_b.py imports module_a

# Vermeiden: __init__.py mit viel Logik
# Imports sollten schnell sein
```

#### 1.3.12    Häufige Import-Probleme

**Problem 1: `ModuleNotFoundError`**
```python
# Fehler: ModuleNotFoundError: No module named 'my_module'

# Lösung 1: Pfad prüfen
import sys
print(sys.path)

# Lösung 2: Pfad hinzufügen
sys.path.insert(0, '/path/to/module')

# Lösung 3: PYTHONPATH setzen
# export PYTHONPATH="/path/to/module:$PYTHONPATH"

# Lösung 4: Package installieren
# pip install my_module
```

**Problem 2: Zirkuläre Imports**
```python
# module_a.py
from module_b import function_b

# module_b.py
from module_a import function_a  # ImportError!

# Lösung 1: Import in Funktion verschieben
# module_a.py
def my_function():
    from module_b import function_b
    function_b()

# Lösung 2: Gemeinsame Logik in drittes Modul auslagern
```

**Problem 3: Name Conflicts**
```python
# ❌ Überschreibt builtin
from mymodule import open  # Überschreibt open()!

# ✅ Alias verwenden
from mymodule import open as myopen
```

#### 1.3.13    Praktisches Beispiel: Projekt-Setup
```
myproject/
├── src/
│   ├── __init__.py
│   ├── core/
│   │   ├── __init__.py
│   │   └── engine.py
│   └── utils/
│       ├── __init__.py
│       └── helpers.py
├── tests/
│   └── test_engine.py
└── setup.py
```

**In Tests importieren:**
```python
# tests/test_engine.py
import sys
from pathlib import Path

# Projekt-Root zum Path hinzufügen
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

# Jetzt funktionieren Imports
from src.core.engine import Engine
from src.utils.helpers import helper_function
```

**Bessere Lösung: Editable Install**
```bash
# Im Projekt-Root
pip install -e .

# Jetzt funktioniert überall:
from src.core.engine import Engine
```

#### 1.3.14    Zusammenfassung

| Konzept             | Zweck                                        |
| ------------------- | -------------------------------------------- |
| `sys.path`          | Liste der Suchpfade für Module               |
| `sys.modules`       | Cache geladener Module                       |
| `importlib`         | Programmatisches Importieren                 |
| `PYTHONPATH`        | Environment Variable für Suchpfade           |
| `__init__.py`       | Paket-Initialisierung und Exporte            |
| `__all__`           | Kontrolliert `from package import *`         |
| Namespace Packages  | Packages ohne `__init__.py` (PEP 420)        |

**Kernprinzip:** Python's Import-System ist flexibel und erweiterbar. Für normale Projekte reichen Standard-Imports, aber `importlib` und `sys.path` ermöglichen erweiterte Szenarien wie Plugin-Systeme und dynamisches Laden.

## 2    HTML-Dokumentation erstellen mit MkDocs

### 2.1    Was ist MkDocs?

MkDocs ist ein Werkzeug zur Erstellung von Webseiten für Projektdokumentation. Es nutzt Markdown-Dateien als Inhalt und erzeugt daraus eine statische HTML-Seite.

### 2.2    Installation

MkDocs wird mit `pip` installiert:

```bash
pip install mkdocs
```

Optional kann ein Theme wie `material` installiert werden:

```bash
pip install mkdocs-material
```

### 2.3    Projektstruktur

Erzeuge ein neues Dokumentationsprojekt:

```bash
mkdocs new my-docs
cd my-docs
```

Projektstruktur:

```
my-docs/
├── docs/
│   └── index.md
└── mkdocs.yml
```

### 2.4    Dokumentation schreiben

Markdown-Dateien kommen ins `docs/`-Verzeichnis. Beispiel `docs/index.md`:

```markdown
# Willkommen

Dies ist die Dokumentation zu meinem Projekt.
```

### 2.5    Lokaler Server zum Testen

Starte einen lokalen Server zum Testen der HTML-Seite:

```bash
mkdocs serve
```

Die Seite ist nun unter `http://127.0.0.1:8000/` erreichbar.

### 2.6    HTML-Seite erstellen

Zum Erzeugen der HTML-Seite verwende:

```bash
mkdocs build
```

Die fertige Seite befindet sich im Verzeichnis `site/`.

### 2.7    Deployment (optional)

MkDocs unterstützt einfache Veröffentlichung mit GitHub Pages:

```bash
mkdocs gh-deploy
```

Das setzt voraus, dass dein Projekt in einem Git-Repository liegt.
