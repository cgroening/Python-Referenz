# Module und Pakete

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

## 2    Import-System und Paketsuche

Python's Import-System bestimmt, wie Module und Pakete gefunden und geladen werden. Das Verständnis von `sys.path` und `importlib` ist wichtig für größere Projekte und Package-Entwicklung.

#### 2.1.1    Wie Python Module findet

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

#### 2.1.2    `sys.path` manipulieren

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

#### 2.1.3    `PYTHONPATH` Environment Variable

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

#### 2.1.4    Module dynamisch importieren mit `importlib`

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

#### 2.1.5    Import-Mechanismus im Detail

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

#### 2.1.6    Import-Varianten
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

#### 2.1.7    `__init__.py` im Detail

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

#### 2.1.8    Namespace Packages (PEP 420)

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

#### 2.1.9    Import-Hooks und Finder

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

#### 2.1.10    Debugging von Import-Problemen
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

#### 2.1.11    Best Practices

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

#### 2.1.12    Häufige Import-Probleme

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

#### 2.1.13    Praktisches Beispiel: Projekt-Setup
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

#### 2.1.14    Zusammenfassung

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

### HTML-Dokumentation

## 9 Dokumentation erstellen

Gute Dokumentation ist essenziell für wartbaren Code. Python bietet mehrere Tools zur automatischen Generierung von Dokumentation aus Docstrings.

### 9.1 Docstrings – Best Practices

Docstrings dokumentieren Module, Klassen und Funktionen direkt im Code.

#### 9.1.1 Drei Hauptstile

**Google Style (empfohlen für Lesbarkeit):**
````python
def calculate_distance(x1: float, y1: float, x2: float, y2: float) -> float:
    """Berechnet die euklidische Distanz zwischen zwei Punkten.

    Args:
        x1: X-Koordinate des ersten Punkts
        y1: Y-Koordinate des ersten Punkts
        x2: X-Koordinate des zweiten Punkts
        y2: Y-Koordinate des zweiten Punkts

    Returns:
        Die euklidische Distanz als float

    Raises:
        ValueError: Wenn Koordinaten nicht numerisch sind

    Examples:
        >>> calculate_distance(0, 0, 3, 4)
        5.0
    """
    return ((x2 - x1)**2 + (y2 - y1)**2)**0.5
````

**NumPy Style (wissenschaftliche Pakete):**
````python
def calculate_distance(x1, y1, x2, y2):
    """
    Berechnet die euklidische Distanz zwischen zwei Punkten.

    Parameters
    ----------
    x1 : float
        X-Koordinate des ersten Punkts
    y1 : float
        Y-Koordinate des ersten Punkts
    x2 : float
        X-Koordinate des zweiten Punkts
    y2 : float
        Y-Koordinate des zweiten Punkts

    Returns
    -------
    float
        Die euklidische Distanz

    Examples
    --------
    >>> calculate_distance(0, 0, 3, 4)
    5.0
    """
    return ((x2 - x1)**2 + (y2 - y1)**2)**0.5
````

**Sphinx Style (klassisch):**
````python
def calculate_distance(x1, y1, x2, y2):
    """Berechnet die euklidische Distanz zwischen zwei Punkten.

    :param x1: X-Koordinate des ersten Punkts
    :type x1: float
    :param y1: Y-Koordinate des ersten Punkts
    :type y1: float
    :param x2: X-Koordinate des zweiten Punkts
    :type x2: float
    :param y2: Y-Koordinate des zweiten Punkts
    :type y2: float
    :return: Die euklidische Distanz
    :rtype: float
    :raises ValueError: Wenn Koordinaten nicht numerisch sind
    """
    return ((x2 - x1)**2 + (y2 - y1)**2)**0.5
````

#### 9.1.2 Docstring-Konventionen

**Modul-Docstring:**
````python
"""Geometrie-Utilities für 2D-Berechnungen.

Dieses Modul stellt Funktionen für geometrische Berechnungen bereit,
einschließlich Distanz, Fläche und Umfang.

Example:
    >>> from geometry import calculate_distance
    >>> calculate_distance(0, 0, 3, 4)
    5.0
"""

import math

# ... Code ...
````

**Klassen-Docstring:**
````python
class Circle:
    """Repräsentiert einen Kreis.

    Attributes:
        radius: Radius des Kreises in Metern
        center: Tuple (x, y) für Mittelpunkt

    Example:
        >>> circle = Circle(5.0, (0, 0))
        >>> circle.area()
        78.54
    """

    def __init__(self, radius: float, center: tuple = (0, 0)):
        """Initialisiert einen Kreis.

        Args:
            radius: Radius des Kreises
            center: Mittelpunkt als (x, y) Tuple
        """
        self.radius = radius
        self.center = center
````

**Best Practices:**
````python
# ✅ DO
def process_data(data: list[str]) -> dict:
    """Verarbeitet Eingabedaten zu strukturiertem Dictionary.

    Args:
        data: Liste von Rohdaten-Strings

    Returns:
        Dictionary mit verarbeiteten Daten
    """
    pass

# ❌ DON'T
def process_data(data):
    """processes data"""  # Zu kurz, nicht aussagekräftig
    pass
````

### 9.2 Sphinx – Der Python-Standard

Sphinx ist das Standard-Tool für Python-Dokumentation (verwendet von Python selbst, Django, Flask, etc.).

#### 9.2.1 Installation und Setup
````bash
pip install sphinx sphinx-rtd-theme
````

**Projekt initialisieren:**
````bash
# Im Projekt-Root
mkdir docs
cd docs
sphinx-quickstart

# Interaktive Fragen beantworten:
# > Separate source and build directories? [n]: y
# > Project name: My Project
# > Author name(s): Your Name
# > Project release []: 1.0.0
````

**Struktur:**
````
myproject/
├── docs/
│   ├── source/
│   │   ├── conf.py          # Konfiguration
│   │   ├── index.rst        # Hauptseite
│   │   └── _static/
│   └── build/
│       └── html/            # Generierte HTML-Dateien
├── src/
│   └── myproject/
└── README.md
````

#### 9.2.2 Konfiguration (conf.py)
````python
# docs/source/conf.py

import os
import sys
sys.path.insert(0, os.path.abspath('../../src'))

project = 'My Project'
copyright = '2024, Your Name'
author = 'Your Name'
release = '1.0.0'

# Extensions
extensions = [
    'sphinx.ext.autodoc',       # Automatische API-Docs
    'sphinx.ext.napoleon',      # Google/NumPy Docstrings
    'sphinx.ext.viewcode',      # Quellcode-Links
    'sphinx.ext.intersphinx',   # Links zu anderer Dokumentation
]

# Theme
html_theme = 'sphinx_rtd_theme'

# Napoleon settings (für Google/NumPy Style)
napoleon_google_docstring = True
napoleon_numpy_docstring = True
napoleon_include_init_with_doc = True
````

#### 9.2.3 Dokumentation schreiben

**index.rst:**
````rst
Willkommen zu My Project
========================

.. toctree::
   :maxdepth: 2
   :caption: Inhalt:

   installation
   quickstart
   api
   examples

Indices
=======

* :ref:`genindex`
* :ref:`modindex`
````

**api.rst (automatische API-Dokumentation):**
````rst
API Reference
=============

.. automodule:: myproject.module
   :members:
   :undoc-members:
   :show-inheritance:

.. autoclass:: myproject.MyClass
   :members:
   :special-members: __init__
````

#### 9.2.4 Build und Vorschau
````bash
# HTML generieren
cd docs
make html

# Öffnen
open build/html/index.html

# Auto-Rebuild bei Änderungen
pip install sphinx-autobuild
sphinx-autobuild source build/html
# → http://127.0.0.1:8000
````

#### 9.2.5 Read the Docs Integration

**Kostenlos hosten auf readthedocs.org:**

1. Erstelle `.readthedocs.yaml`:
````yaml
version: 2

build:
  os: ubuntu-22.04
  tools:
    python: "3.11"

sphinx:
  configuration: docs/source/conf.py

python:
  install:
    - requirements: docs/requirements.txt
    - method: pip
      path: .
````

2. `docs/requirements.txt`:
````txt
sphinx>=5.0
sphinx-rtd-theme
````

3. GitHub Repository → Read the Docs verbinden
4. Automatischer Build bei jedem Push

### 9.3 MkDocs – Modernes Markdown

MkDocs ist einfacher als Sphinx und verwendet Markdown statt reStructuredText.

#### 9.3.1 Installation und Setup
````bash
pip install mkdocs mkdocs-material
````

**Projekt initialisieren:**
````bash
mkdocs new my-project
cd my-project
````

**Struktur:**
````
my-project/
├── docs/
│   ├── index.md
│   ├── installation.md
│   └── api.md
└── mkdocs.yml
````

#### 9.3.2 Konfiguration (mkdocs.yml)
````yaml
site_name: My Project
site_description: Awesome Python project
site_author: Your Name
site_url: https://myproject.readthedocs.io

theme:
  name: material
  palette:
    primary: indigo
    accent: indigo
  features:
    - navigation.tabs
    - navigation.sections
    - toc.integrate
    - search.suggest

nav:
  - Home: index.md
  - Installation: installation.md
  - User Guide:
      - Getting Started: guide/quickstart.md
      - Advanced: guide/advanced.md
  - API Reference: api.md

plugins:
  - search
  - mkdocstrings:
      handlers:
        python:
          options:
            show_source: true

markdown_extensions:
  - admonition
  - codehilite
  - toc:
      permalink: true
````

#### 9.3.3 Automatische API-Docs mit mkdocstrings
````bash
pip install mkdocstrings[python]
````

**docs/api.md:**
````markdown
# API Reference

## Module

::: myproject.module
    options:
      show_root_heading: true
      show_source: true

## Classes

::: myproject.MyClass
    options:
      members:
        - method1
        - method2
````

#### 9.3.4 Build und Deploy
````bash
# Lokaler Server
mkdocs serve
# → http://127.0.0.1:8000

# HTML generieren
mkdocs build

# GitHub Pages deployen
mkdocs gh-deploy
````

### 9.4 pdoc – Automatische API-Dokumentation

pdoc generiert automatisch Dokumentation aus Docstrings – kein Setup nötig.

#### 9.4.1 Installation und Verwendung
````bash
pip install pdoc
````

**Einfache Verwendung:**
````bash
# HTML-Dokumentation generieren
pdoc myproject -o docs/

# Live-Server
pdoc myproject --http :8080
# → http://localhost:8080
````

#### 9.4.2 Konfiguration

**Eigenes Template (optional):**
````bash
# Template anpassen
pdoc myproject -o docs/ --template-dir ./templates/
````

**Ausgabe anpassen:**
````python
# myproject/__init__.py

"""My Project

Modulbeschreibung mit **Markdown** Support.

# Features
- Feature 1
- Feature 2

## Examples
```python
from myproject import func
func()
```
"""

__pdoc__ = {
    'private_function': False,  # Nicht dokumentieren
    'MyClass.internal_method': False,
}
````

#### 9.4.3 Vorteile von pdoc

- ✅ Kein Setup nötig
- ✅ Automatische Erkennung
- ✅ Markdown in Docstrings
- ✅ Live-Reload
- ✅ Single-Command

**Wann verwenden:**
- Schnelle API-Dokumentation
- Kleine bis mittlere Projekte
- Kein komplexes Layout nötig

### 9.5 Vergleich

| Tool      | Komplexität | Features      | Format        | Use Case                  |
| --------- | ----------- | ------------- | ------------- | ------------------------- |
| **Sphinx**| Hoch        | Sehr viele    | reStructured  | Große Projekte, Standard  |
| **MkDocs**| Niedrig     | Mittel        | Markdown      | Moderne Docs, einfach     |
| **pdoc**  | Sehr niedrig| Automatisch   | Docstrings    | Schnelle API-Docs         |

### 9.6 Praktisches Beispiel: Vollständige Dokumentation

**Projekt-Struktur:**
````
myproject/
├── src/
│   └── myproject/
│       ├── __init__.py
│       ├── calculator.py
│       └── utils.py
├── docs/
│   ├── source/          # Sphinx
│   │   ├── conf.py
│   │   └── index.rst
│   └── mkdocs.yml       # MkDocs (alternativ)
├── tests/
├── pyproject.toml
└── README.md
````

**calculator.py mit vollständigen Docstrings:**
````python
"""Mathematische Berechnungen.

Dieses Modul stellt grundlegende mathematische Operationen bereit.
"""

class Calculator:
    """Einfacher Taschenrechner.

    Attributes:
        history: Liste der durchgeführten Operationen

    Example:
        >>> calc = Calculator()
        >>> calc.add(2, 3)
        5
        >>> calc.history
        ['2 + 3 = 5']
    """

    def __init__(self):
        """Initialisiert Calculator mit leerer History."""
        self.history = []

    def add(self, a: float, b: float) -> float:
        """Addiert zwei Zahlen.

        Args:
            a: Erste Zahl
            b: Zweite Zahl

        Returns:
            Summe von a und b

        Example:
            >>> calc = Calculator()
            >>> calc.add(10, 5)
            15.0
        """
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        return result

    def divide(self, a: float, b: float) -> float:
        """Dividiert zwei Zahlen.

        Args:
            a: Dividend
            b: Divisor

        Returns:
            Quotient von a durch b

        Raises:
            ValueError: Wenn b gleich 0 ist

        Example:
            >>> calc = Calculator()
            >>> calc.divide(10, 2)
            5.0
        """
        if b == 0:
            raise ValueError("Division durch Null nicht erlaubt")
        result = a / b
        self.history.append(f"{a} / {b} = {result}")
        return result
````

### 9.7 CI/CD Integration

**GitHub Actions für automatische Docs:**
````yaml
# .github/workflows/docs.yml
name: Documentation

on:
  push:
    branches: [main]

jobs:
  deploy-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install sphinx sphinx-rtd-theme

      - name: Build docs
        run: |
          cd docs
          make html

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/build/html
````

### 9.8 Best Practices

**✅ DO:**
- Google-Style Docstrings für Lesbarkeit
- Docstrings für alle öffentlichen Funktionen/Klassen
- Examples in Docstrings (mit doctest-Syntax)
- Type Hints + Docstrings kombinieren
- Automatische API-Docs (Sphinx/pdoc)
- CI/CD für Docs-Build

**❌ DON'T:**
- Docstrings nur für komplexe Funktionen (alle dokumentieren!)
- Informationen in Docstrings und Code duplizieren
- Veraltete Docstrings (bei Code-Änderung aktualisieren!)
- Zu viele Details in Docstrings (Implementierung gehört in Kommentare)

### 9.9 Docstring-Linting

**Tools zur Validierung:**
````bash
# pydocstyle - Docstring-Konventionen prüfen
pip install pydocstyle
pydocstyle src/

# darglint - Docstrings gegen Signaturen prüfen
pip install darglint
darglint src/myproject/

# interrogate - Docstring-Coverage messen
pip install interrogate
interrogate -v src/

# Mit Ruff (bereits integriert)
ruff check --select D .
````

**Pre-commit Hook:**
````yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pycqa/pydocstyle
    rev: 6.3.0
    hooks:
      - id: pydocstyle
````

### 9.10 Zusammenfassung

| Aspekt         | Empfehlung                          |
| -------------- | ----------------------------------- |
| Docstring-Stil | Google Style (lesbar, klar)         |
| Große Projekte | Sphinx + Read the Docs              |
| Einfache Docs  | MkDocs + Material Theme             |
| Schnelle API   | pdoc (automatisch)                  |
| Hosting        | Read the Docs / GitHub Pages        |
| Validierung    | pydocstyle / Ruff                   |

**Kernprinzip:** Gute Dokumentation ist Teil des Codes. Nutze Docstrings konsequent, automatische Generierung (Sphinx/MkDocs/pdoc), und CI/CD für stets aktuelle Dokumentation.
