# Entwicklungs-Tooling & Packaging

Modernes Python-Dependency-Management und Packaging haben sich in den letzten Jahren stark weiterentwickelt. Dieses Kapitel behandelt Virtual Environments, Dependency-Management-Tools und moderne Packaging-Standards.

## 1    Virtual Environments

Virtual Environments isolieren Python-Projekte voneinander und vermeiden Versionskonflikte zwischen Abhängigkeiten.

### 1.1    `venv` – Standard Virtual Environment

```bash
# Virtual Environment erstellen
python -m venv myenv

# Aktivieren (Linux/macOS)
source myenv/bin/activate

# Aktivieren (Windows)
myenv\Scripts\activate

# Deaktivieren
deactivate

# Löschen (einfach Ordner entfernen)
rm -rf myenv
```

**Wichtige Punkte:**

- `venv` ist seit Python 3.3 Teil der Standardbibliothek
- Erstellt isolierte Python-Installation mit eigenem `site-packages`
- Sollte **nicht** ins Git-Repository committed werden

### 1.2    Wo liegt was?

```bash
myenv/
├── bin/           # Aktivierungsscripts und Python-Interpreter (Linux/macOS)
├── Scripts/       # Aktivierungsscripts und Python-Interpreter (Windows)
├── include/       # C-Header-Dateien für Extensions
├── lib/
│   └── python3.x/
│       └── site-packages/  # Installierte Pakete
└── pyvenv.cfg     # Konfiguration des Virtual Environment
```

### 1.3    `virtualenv` – Alternative zu venv

```bash
# Installation
pip install virtualenv

# Virtual Environment erstellen
virtualenv myenv

# Mit spezifischer Python-Version
virtualenv -p python3.11 myenv

# Vorteile gegenüber venv:
# - Schnellere Erstellung
# - Mehr Konfigurationsoptionen
# - Kompatibel mit älteren Python-Versionen
```

### 1.4    `.gitignore` für Virtual Environments

```gitignore
# Virtual Environments
venv/
env/
ENV/
myenv/
.venv/

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
```

## 2    Code Quality Tools (Linting & Type Checking)

Code Quality Tools wie Linter und Typer Checker analysieren den Quellcode. Sie weisen auf potenzielle Fehler, Stilprobleme oder Verstöße gegen Coding-Richtlinien hin – ohne den Code auszuführen. Linter und Typer Checker helfen dabei, fehlerfreien, konsistenten und wartbaren Code zu schreiben.

### 2.1    Was sind Linter und Type Checker?

**Linter:**
- Analysieren Code auf Fehler und Stil-Probleme
- Erzwingen Coding-Standards (PEP 8)
- Finden potenzielle Bugs

**Type Checker:**
- Überprüfen Typannotationen
- Finden Typ-Inkonsistenzen
- Verbessern Code-Dokumentation

### 2.2    Linter

#### 2.2.1    Pylint (obsolet)

- Ein sehr strenger Linter, der Code-Qualität überprüft.
- Findet Fehler, schlechte Praktiken und Verstöße gegen Coding-Standards.
- Sehr langsam im Vergleich zu anderen Lintern, da in Python geschrieben.

#### 2.2.2    Flake8 (obsolet)

- Ein leichtgewichtiger Linter für PEP8-konforme Code-Qualität.
- Unterstützt Plugins für zusätzliche Checks.
- Weniger strikt als Pylint.

### 2.3    Ruff – Moderner All-in-One Linter

**Installation:**

```zsh
pip install ruff
```

**Grundlegende Verwendung:**
```bash
# Code prüfen
ruff check .

# Auto-Fix
ruff check --fix .

# Formatieren (ersetzt black)
ruff format .

# In CI/CD
ruff check --output-format=github .
```

**Konfiguration (pyproject.toml):**
```toml
[tool.ruff]
line-length = 88
target-version = "py311"

[tool.ruff.lint]
select = [
    "E",   # pycodestyle errors
    "W",   # pycodestyle warnings
    "F",   # pyflakes
    "I",   # isort
    "N",   # pep8-naming
    "UP",  # pyupgrade
]
ignore = ["E501"]  # line too long

[tool.ruff.format]
quote-style = "double"
indent-style = "space"
```

- Extrem schneller Linter (da in Rust programmiert!) mit Unterstützung für PEP8, Typing, Imports, usw.
- Enthält bereits die Funktionen von Flake8 + viele Plugins.
- Kann Pylint-Regeln emulieren.
- Sehr viel schneller als Flake8 oder Pylint.
- Experimenteller mypy-Support, aber ist nicht so mächtig wie mypy selbst

**Ersetzt folgende Tools:**
- ✅ Flake8 (Linting)
- ✅ isort (Import-Sortierung)
- ✅ black (Formatierung)
- ✅ pyupgrade (Syntax-Modernisierung)
- ⚠️ Pylint (teilweise, weniger strikt)

> [!tip] Veraltete Tools
> Flake8, Pylint, isort (Sortierung von Importen) und black sind nicht mehr erforderlich, da Ruff deren Funktionen (und mehr) bereits integriert hat.

Ruff gibt auf ihrer Homepage an, dass es deutlich schneller als vergleichbare Tools ist, siehe [docs.astral.sh/ruff/](https://docs.astral.sh/ruff/).


#### 2.3.1    Links

- https://docs.astral.sh/ruff/
- https://docs.astral.sh/ruff/rules/

### 2.4    Type Checker

#### 2.4.1    Mypy – Strenger Type Checker

* Überprüft, ob Typannotationen korrekt sind
* Umfassender als Pylance, besonders für große Projekte

**Installation:**
```bash
pip install mypy
```

**Verwendung:**
```bash
# Einzelne Datei
mypy script.py

# Ganzes Projekt
mypy src/

# Mit strikten Regeln
mypy --strict src/
```

**Konfiguration (pyproject.toml):**
```toml
[tool.mypy]
python_version = "3.11"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true

# Per-Modul Konfiguration
[[tool.mypy.overrides]]
module = "tests.*"
disallow_untyped_defs = false
```

**Häufige Mypy-Patterns:**
```python
from typing import Optional, List, Dict

def process(data: List[str]) -> Optional[Dict[str, int]]:
    if not data:
        return None
    return {item: len(item) for item in data}

# Type Ignores (sparsam verwenden!)
result = legacy_function()  # type: ignore
```

#### 2.4.2    Pyright/Pylance – Alternative zu Mypy

##### Pyright

**Merkmale:**
- In TypeScript geschrieben (schneller als Mypy)
- Basis für Pylance
- Strikte Type Checks
```bash
# Installation
npm install -g pyright

# Verwendung
pyright src/
```

##### Pylance

- Basiert auf Microsofts Pyright.
- Verbessert Autovervollständigung, Typinferenz und Fehleranalyse.

**VS Code Einstellungen:**
```json
{
    "python.analysis.typeCheckingMode": "basic",
    "python.analysis.diagnosticMode": "workspace",
    "python.analysis.autoImportCompletions": true
}
```

#### 2.4.3    ty (Astral, Beta) – Schnellster Type Checker

ty ist ein extrem schneller Python Type Checker und Language Server von Astral (den Machern von Ruff und uv), geschrieben in Rust. ty ist als Alternative zu mypy, Pyright und Pylance konzipiert.

**Status:** Beta (seit Dezember 2025), Stable Release für 2026 geplant.

**Stärken:**
- 10–60× schneller als mypy/Pyright (ohne Cache)
- Inkrementelle Updates in ~5ms (80× schneller als Pyright, 500× schneller als Pyrefly)
- Eingebauter Language Server (LSP) für VS Code, Neovim, PyCharm u.a.
- First-class Intersection Types und fortgeschrittenes Type Narrowing
- Diagnostik-System inspiriert vom Rust-Compiler (Kontext aus mehreren Dateien)
- Geplante Integration mit Ruff (type-aware Linting, Dead Code Elimination)

**Schwächen (Stand Februar 2026):**
- Conformance mit der Python Typing Specification bei ~15% (Pyrefly ~70%, Pyright deutlich höher)
- Noch viele False Positives bei komplexen Codebasen
- Kein Plugin-System für Django/SQLAlchemy/Pydantic (noch)

**Installation und Verwendung:**
```bash
# Installation via uv
uv tool install ty@latest

# Einzelne Datei oder Projekt prüfen
ty check src/

# Watch-Modus (inkrementell)
ty check --watch
```

**Konfiguration (pyproject.toml):**
```toml
[tool.ty.rules]
# Regeln können individuell konfiguriert werden
# Siehe: https://docs.astral.sh/ty/reference/rules/
```

**Empfehlung:** Für experimentierfreudige Entwickler jetzt schon als schnelles Editor-Feedback nutzbar. Für CI/CD weiterhin Pyright oder mypy parallel einsetzen, bis die Genauigkeit steigt. Astrals Track Record mit Ruff und uv spricht dafür, dass ty mittelfristig zum Standard wird.

- https://docs.astral.sh/ty/
- https://github.com/astral-sh/ty

#### 2.4.4    Pyrefly (Meta, Beta) – Nachfolger von Pyre

Pyrefly ist Metas neuer Type Checker und Language Server, in Rust geschrieben. Er ersetzt den älteren, OCaml-basierten Pyre Type Checker, der u.a. für Instagrams Codebase entwickelt wurde.

**Status:** Beta (seit November 2025).

**Stärken:**
- Sehr hohe Performance (1,85 Mio. Zeilen/Sekunde, PyTorch in 2,4s vs. Pyright 35,2s vs. mypy 48,1s)
- 70% Conformance mit Python Typing Specification (von 39% bei Alpha-Launch)
- Automatische Type Inference für Rückgabewerte und lokale Variablen
- Automatische Type Stubs für populäre Third-Party-Libraries
- IDE-Extensions für VS Code, Neovim, Zed, Emacs, Helix
- Vorläufiger Support für Django, Pydantic und Jupyter Notebooks
- MIT-Lizenz, aktive Community (Discord, GitHub)

**Schwächen:**
- Inkrementelle Updates deutlich langsamer als ty (~2,4s vs. 4,7ms bei PyTorch)
- Framework-Support (Django, SQLAlchemy) noch in Entwicklung
- Weniger verbreitet als Pyright oder mypy

**Installation und Verwendung:**
```bash
# Installation
pip install pyrefly

# Projekt initialisieren
pyrefly init

# Type Check
pyrefly check

# Mit Fehler-Zusammenfassung
pyrefly check --summarize-errors
```

**Empfehlung:** Für Projekte, die von Pyre migrieren oder einen schnellen Type Checker mit guter Conformance suchen. Für die meisten Anwender ist Pyright aktuell noch die sicherere Wahl.

- https://pyrefly.org/
- https://github.com/facebook/pyrefly

### 2.5    Vergleich

| Tool        | Typ          | Sprache    | Geschwindigkeit   | Conformance  | LSP/IDE             | Status    |
| ----------- | ------------ | ---------- | ----------------- | ------------ | ------------------- | --------- |
| **Ruff**    | Linter       | Rust       | ✅✅ Extrem schnell | Hoch         | ⚠️ Kein Type LSP    | ✅ Stabil  |
| ~~Flake8~~  | Linter       | Python     | ❌ Langsam         | Mittel       | ❌ Nein              | ⛔ Obsolet |
| ~~Pylint~~  | Linter       | Python     | ❌ Sehr langsam    | Sehr hoch    | ❌ Nein              | ⛔ Obsolet |
| **Pyright** | Type Checker | TypeScript | ✅ Schnell         | ✅✅ Sehr hoch | ✅ Pylance (VS Code) | ✅ Stabil  |
| **mypy**    | Type Checker | Python     | ⚠️ Mittel         | ✅ Hoch       | ❌ Nein              | ✅ Stabil  |
| **ty**      | Type Checker | Rust       | ✅✅ Extrem schnell | ❌ ~15%       | ✅ Eingebaut         | ⚠️ Beta   |
| **Pyrefly** | Type Checker | Rust       | ✅ Sehr schnell    | ⚠️ ~70%      | ✅ Eingebaut         | ⚠️ Beta   |
| Zuban       | Type Checker | Rust       | ✅ Schnell         | ✅ ~69%       | ✅ Eingebaut         | ⚠️ Beta   |
| ~~Pyre~~    | Type Checker | OCaml      | ⚠️ Mittel         | ⚠️ Mittel    | ❌ Nein              | ⛔ Obsolet |

### 2.6    Zusammenfassung

**Modern Stack (2024+):**
- **Ruff**: Linting + Formatting (Standard)
- **Mypy**: Type Checking
- **Pyright/Pylance**: Type Checking (zuverlässigste Option)

**Aufstrebend (Beta, 2025/2026):** -
- **ty** (Astral) – extrem schnell, noch geringe Conformance
- **Pyrefly** (Meta) – schnell, bessere Conformance als ty 
- **Zuban** – mypy-kompatibel, höchste Conformance der neuen Tools

**Legacy Stack (nicht mehr empfohlen):**
- ~~Flake8~~ → Ruff
- ~~black~~ → Ruff format
- ~~isort~~ → Ruff
- ~~Pylint~~ → Ruff (oder zusätzlich)
- ~~Pyre~~ → Pyrefly

#### 2.6.1    Veraltete/Abgelöste Tools

Die folgenden Tools sind funktional ersetzt und sollten bei neuen Projekten nicht mehr eingesetzt werden, weil Ruff (in Rust geschrieben) deren Funktionen in einem einzigen Tool mit 10–100× höherer Geschwindigkeit vereint, bessere Wartbarkeit und einfacherere Konfiguration über eine einzige `pyproject.toml` bietet:

- **Flake8** – komplett durch Ruff ersetzt. Ruff implementiert alle relevanten Flake8-Regeln plus die meisten populären Plugins (isort, pyupgrade, eradicate, yesqa, …) und ist dabei 10–100× schneller.
- **Black** – Ruff enthält einen eigenen Formatter (`ruff format`), der Black-kompatibel ist. Ein separates Tool ist nicht mehr nötig.
- **isort** – ebenfalls in Ruff integriert (`ruff check --select I`).
- **Pylint** – wird zwar noch gepflegt, aber immer weniger genutzt. Ruff deckt den Großteil der relevanten Regeln ab und ist drastisch schneller. Für manche sehr spezifischen Pylint-Checks gibt es noch keinen Ruff-Ersatz, aber für die meisten Projekte reicht Ruff.
- **Pyre** (Meta) – wird durch **Pyrefly** abgelöst, Metas neuen Rust-basierten Type Checker.

#### 2.6.2    Moderne Linter und Type Checker

##### Linting & Formatting: **Ruff**

Ruff ersetzt Flake8, Black, isort, pyupgrade und viele weitere Tools in einem einzigen, extrem schnellen Rust-basierten Tool. Es ist mittlerweile der De-facto-Standard mit über 100.000 GitHub Stars und wird von den meisten großen Open-Source-Projekten genutzt. Konfiguration läuft über `ruff.toml` oder `pyproject.toml`.

##### Type Checking: Drei Optionen

**1. Pyright** – aktuell der zuverlässigste Type Checker. Microsofts TypeScript-basiertes Tool, das auch Pylance in VS Code antreibt. Pyright implementiert neue Typing-Features oft vor anderen Tools und bietet starke IDE-Integration ([Rob's Blog](https://sinon.github.io/future-python-type-checkers/)). Für Produktionsprojekte Stand heute die sicherste Wahl.

**2. mypy** – der Klassiker, weiterhin weit verbreitet und stabil. Für bestehende Projekte absolut brauchbar, aber langsamer als die Alternativen und bei neuen Typing-Features manchmal hinterher.

**3. ty (Astral, Beta)** – das spannendste neue Tool. ty ist ein extrem schneller Python Type Checker und Language Server, in Rust geschrieben, entwickelt als Alternative zu mypy, Pyright und Pylance. [Astral](https://astral.sh/blog/ty) Performance liegt bei 10–60× schneller als mypy/Pyright, mit inkrementellen Updates in 4,7ms statt Sekunden ([byteiota](https://byteiota.com/astral-ty-python-type-checker-60x-faster-than-mypy/)). Allerdings ist die Genauigkeit noch nicht auf dem Niveau von Pyright – ty besteht aktuell etwa 15% der Conformance-Tests, während Pyright und andere deutlich weiter sind ([byteiota](https://byteiota.com/astral-ty-python-type-checker-60x-faster-than-mypy/)). Für "motivated users" empfohlen, Stable Release ist für 2026 geplant. Für Neovim-Nutzer ist der eingebaute LSP besonders interessant sein.

Weitere Newcomer: **Pyrefly** (Meta, Rust-basiert) und **Zuban** (mypy-kompatibel, Rust-basiert) sind ebenfalls 2025 erschienen, aber weniger ausgereift als ty.

> [!tip]
> Für ein umfassende Absicherung der Code-Qualität reichen Ruff (Linting und Formatting) und Pyright/Pylance (Type Checking) aus. Zukünftig könnte ty Pyright/Mypy ablösen.
> 
> In der `pyproject.toml` sieht ein modernes Setup dann minimal so aus:
> 
> ```toml
> [tool.ruff]
> line-length = 88
> target-version = "py313"
> 
> [tool.ruff.lint]
> select = ["E", "F", "I", "UP", "B", "SIM"]
> 
> [tool.pyright]
> pythonVersion = "3.12"
> typeCheckingMode = "standard"
> ```

## 3    Klassisches Dependency Management mit `pip`

### 3.1    Pakete installieren

```bash
# Einzelnes Paket
pip install requests

# Spezifische Version
pip install requests==2.31.0

# Mindestversion
pip install requests>=2.30.0

# Versionsbereiche
pip install "requests>=2.30.0,<3.0.0"

# Aus requirements.txt
pip install -r requirements.txt

# Paket aktualisieren
pip install --upgrade requests

# Paket deinstallieren
pip uninstall requests
```

### 3.2    `requirements.txt`

```txt
# requirements.txt - Produktions-Dependencies
requests==2.31.0
pandas>=2.0.0,<3.0.0
numpy==1.24.3
python-dotenv==1.0.0

# Optional: Kommentare
matplotlib==3.7.1  # Für Visualisierungen
```

```bash
# Requirements generieren (nicht empfohlen für Entwicklung)
pip freeze > requirements.txt

# Installieren
pip install -r requirements.txt
```

### 3.3    Mehrere Requirements-Dateien

```bash
# Projektstruktur
requirements/
├── base.txt          # Basis-Dependencies
├── dev.txt           # Entwicklungs-Tools
└── production.txt    # Produktions-spezifisch
```

```txt
# requirements/base.txt
requests==2.31.0
pandas==2.0.3

# requirements/dev.txt
-r base.txt  # Basis-Dependencies inkludieren
pytest==7.4.0
black==23.7.0
mypy==1.5.0

# requirements/production.txt
-r base.txt
gunicorn==21.2.0
```

```bash
# Entwicklungsumgebung
pip install -r requirements/dev.txt

# Produktion
pip install -r requirements/production.txt
```

### 3.4    Probleme mit `pip freeze`

```bash
# ❌ Problematisch: pip freeze
pip freeze > requirements.txt
```

**Nachteile:**

- Listet **alle** installierten Pakete auf (auch transitive Dependencies)
- Keine Trennung zwischen direkten und indirekten Abhängigkeiten
- Versionsnummern sind exakt → keine Flexibilität bei Updates
- Schwer wartbar bei vielen Paketen

## 4    Paketinstallation aus eigenem Ordner mit Python-Dateien

Im Folgenden wird erklärt, wie man einen Ordner mit `.py`-Dateien zu einem Paket macht und ihn in einer Umgebung lokal installiert.

### 4.1    Erstinstallation
#### 4.1.1    Ordnerstruktur vorbereiten

```
mein_paket/
├── mein_paket/
│   ├── __init__.py
│   ├── modul1.py
│   ├── modul2.py
│   └── ...
└── setup.py
```

Die Datei `__init__.py` muss existieren, da es den Ordner zu einem Python-Paket macht - sie kann auch leer sein, s. [[#4 Initialisierungs-Datei]].

> [!warning] Setup-Datei
> Es muss eine `pyproject.toml` (empfohlen bei neuen Projekten) oder `setup.py` im Hauptverzeichnis exisieren!

 **`setup.py`:**

```python
from setuptools import setup, find_packages

setup(
    name='pylightlib',
    version='0.1.0',
    packages=find_packages(include=['io', 'qt', 'tk', 'msc', 'math', 'mech']),
    install_requires=[],
)
```

#### 4.1.2    Installation

1. Im Terminal zum Ordner des Pakets wechseln (`cd ...`)
2. Richtige Umgebung auswählen (`conda activate ...`)
3. Paket installieren mit

```zsh
pip install .
```

**Alternative (Entwicklungsmodus/editable mode: Änderungen werden ohne Neuinstallation wirksam):**

```zsh
pip install -e .
```

Installation prüfen mit:

```python
python -c "from setuptools import find_packages; print(find_packages())"
```

Folgendes der `.vscode/settings.json` (im Root-Ordner des Projekts, welches das Modul einbinden soll) oder der `settings.json` des Benutzers hinzufügen:

```json
{
	"python.analysis.extraPaths": [
		"/Users/cgroening/Documents/Code/Python/libs/pylightlib"
	]
}
```

> [!WARNING]
> Wenn der Pfad eines Pakets geändert wird, muss es wie folgt neuinstalliert werden:
> 
> 1. Paket deinstallieren:
> 
> ```zsh
> pip uninstall <paketname> -y
> ```
> 
> 2. `.egg`-Datei löschen !!
> 
> Diese Datei löschen:
> 
> ```
> /opt/anaconda3/envs/<envname>/lib/python<version>/site-packages/<paketname>.egg-link
> ```
> 
> 3. Neuinstallation mit 
> 
> ```python
> pip install -e .
> ```

#### 4.1.3    Nutzung des Pakets

```python
from mein_paket import modul1
```

### 4.2    Alternative

Statt das Paket in eine Umgebung zu installieren, kann man stattdessen nur den Pfad lokal verfügbar machen, in dem man ihn zum `PYTHONPATH` hinzufügt oder dies direkt im Code macht:

```python
import sys
sys.path.append('/pfad/zum/ordner')
import modul1
```

Dies ist jedoch eher ein Workaround, keine saubere Installation.

### 4.3    Aktualisierung

Wenn normal installiert wurde, muss nach jeder Änderung der Installationsbefehl erneut ausgeführt werden, damit diese übernommen werden:

```zsh
pip install .
```

Wenn im Entwicklungsmodus installiert wurde (`pip install -e .`), ist das Paket verlinkt, d. h. Änderungen am Code wirken sofort - ohne Neuinstallation.

### 4.4    Initialisierungs-Datei

> [!INFO] Inhalt von `__init__.py`
> Was man in die Initialisierungs-Datei schreibt, entscheidet, wie "sauber" oder bequem das Paket von außen nutzbar ist. Man kann die Datei auch leer lassen, was besonders bei kleinen Paketen häufig geschieht.

#### 4.4.1    Importverkürzung

Beispiel: Die folgende Struktur liegt vor:

```
mein_paket/
├── __init__.py
└── tools.py  # enthält eine Funktion namens "berechne_xyz"
```

In `__init__.py`:

```python
from .tools import berechne_xyz
```

So kann man in seinem Projekt den folgenden Import vornehmen:

```python
from mein_paket import berechne_xyz
```

Anstatt:

```python
from mein_paket.tools import berechne_xyz
```

#### 4.4.2    Globale Variablen

Ein weiterer Verwendungszweck für die `__init__.py` ist das Speichern von globalen Variablen:

```python
__version__ = "0.1.0"
```

#### 4.4.3    Initialisierungscode

Wenn beim Import deines Pakets direkt etwas passieren soll (z. B. Logging einrichten oder ein globaler Status):

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logger.info("mein_paket wurde importiert.")
```


## 5    `pip-tools` – Besseres Dependency Management

`pip-tools` löst viele Probleme von `pip freeze` durch Trennung von abstrakten und konkreten Dependencies.

### 5.1    Installation

```bash
pip install pip-tools
```

### 5.2    Workflow mit `pip-compile`

```txt
# requirements.in - Was wir WOLLEN (abstrakt)
requests>=2.30.0
pandas
pytest>=7.0
```

```bash
# Konkrete Versionen generieren
pip-compile requirements.in

# Erzeugt requirements.txt mit allen transitiven Dependencies
```

```txt
# requirements.txt - Was INSTALLIERT wird (konkret)
# Generated by pip-compile
requests==2.31.0
  # via -r requirements.in
certifi==2023.7.22
  # via requests
charset-normalizer==3.2.0
  # via requests
idna==3.4
  # via requests
urllib3==2.0.4
  # via requests
pandas==2.0.3
  # via -r requirements.in
numpy==1.24.3
  # via pandas
...
```

### 5.3    `pip-sync` – Exakte Environment-Replikation

```bash
# Virtual Environment exakt auf requirements.txt synchronisieren
pip-sync requirements.txt

# Entfernt Pakete, die nicht in requirements.txt sind
# Installiert fehlende Pakete
# Aktualisiert auf exakte Versionen
```

### 5.4    Dependency-Updates

```bash
# Alle Dependencies aktualisieren
pip-compile --upgrade requirements.in

# Nur ein spezifisches Paket aktualisieren
pip-compile --upgrade-package requests requirements.in

# Mit Hashes für zusätzliche Sicherheit
pip-compile --generate-hashes requirements.in
```

### 5.5    Mehrere Environments mit pip-tools

```txt
# requirements.in
requests
pandas

# requirements-dev.in
-c requirements.txt  # Constraint-File: nutze dieselben Versionen
pytest
black
mypy
```

```bash
# Workflow
pip-compile requirements.in
pip-compile requirements-dev.in

# Installation
pip-sync requirements-dev.txt  # Installiert dev + base
```

## 6    Poetry – All-in-One Lösung

Poetry kombiniert Dependency Management, Packaging und Veröffentlichung in einem Tool.

### 6.1    Installation

```bash
# Empfohlene Installation (Linux/macOS)
curl -sSL https://install.python-poetry.org | python3 -

# Alternative: pipx (isoliert)
pipx install poetry

# Nach Installation
poetry --version
```

### 6.2    Neues Projekt initialisieren

```bash
# Interaktive Projekt-Erstellung
poetry new myproject

# Generierte Struktur:
myproject/
├── pyproject.toml
├── README.md
├── myproject/
│   └── __init__.py
└── tests/
    └── __init__.py
```

```bash
# In bestehendem Projekt
poetry init
```

### 6.3    `pyproject.toml` – Poetry-Konfiguration

```toml
[tool.poetry]
name = "myproject"
version = "0.1.0"
description = "A sample Python project"
authors = ["Your Name <you@example.com>"]
readme = "README.md"
license = "MIT"

[tool.poetry.dependencies]
python = "^3.10"
requests = "^2.31.0"
pandas = "^2.0.0"

[tool.poetry.group.dev.dependencies]
pytest = "^7.4.0"
black = "^23.7.0"
mypy = "^1.5.0"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

### 6.4    Dependencies verwalten

```bash
# Paket hinzufügen
poetry add requests

# Dev-Dependency hinzufügen
poetry add --group dev pytest

# Mit Version Constraints
poetry add "requests>=2.30.0,<3.0.0"

# Paket entfernen
poetry remove requests

# Alle Dependencies installieren
poetry install

# Ohne dev-dependencies (Produktion)
poetry install --without dev

# Dependencies aktualisieren
poetry update

# Nur ein Paket aktualisieren
poetry update requests
```

### 6.5    Virtual Environment mit Poetry

```bash
# Poetry erstellt automatisch ein Virtual Environment
poetry install

# In der Poetry-Shell arbeiten
poetry shell

# Befehl im Poetry-Environment ausführen (ohne shell)
poetry run python script.py
poetry run pytest

# Environment-Info anzeigen
poetry env info

# Environment-Pfad
poetry env info --path

# Environment löschen
poetry env remove python3.10
```

### 6.6    Lock-File

Poetry erstellt automatisch `poetry.lock`:

```bash
# poetry.lock - Exakte Versionen aller Dependencies
# Wird automatisch bei 'poetry add' / 'poetry update' aktualisiert
# SOLLTE ins Git committed werden

# Lock-File neu generieren ohne Installation
poetry lock

# Lock-File prüfen
poetry check
```

### 6.7    Scripts definieren

```toml
[tool.poetry.scripts]
start = "myproject.main:main"
test = "pytest"
```

```bash
# Scripts ausführen
poetry run start
poetry run test
```

### 6.8    Packaging und Veröffentlichung

```bash
# Paket bauen
poetry build
# Erstellt dist/myproject-0.1.0.tar.gz und .whl

# Auf PyPI veröffentlichen
poetry publish

# Beides zusammen
poetry publish --build

# Test-PyPI
poetry config repositories.testpypi https://test.pypi.org/legacy/
poetry publish -r testpypi
```

## 7    `pyproject.toml` – PEP 621 Standard

`pyproject.toml` ist der moderne Standard für Python-Projektkonfiguration (definiert in PEP 621).

### 7.1    Grundstruktur ohne Poetry

```toml
[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "mypackage"
version = "0.1.0"
description = "A sample Python package"
readme = "README.md"
authors = [
    {name = "Your Name", email = "you@example.com"}
]
license = {text = "MIT"}
requires-python = ">=3.10"
classifiers = [
    "Programming Language :: Python :: 3",
    "License :: OSI Approved :: MIT License",
]
keywords = ["example", "package"]

dependencies = [
    "requests>=2.30.0",
    "pandas>=2.0.0,<3.0.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.4.0",
    "black>=23.7.0",
    "mypy>=1.5.0",
]
docs = [
    "sphinx>=7.0.0",
]

[project.urls]
Homepage = "https://github.com/username/mypackage"
Documentation = "https://mypackage.readthedocs.io"
Repository = "https://github.com/username/mypackage"
```

### 7.2    Installation mit pip

```bash
# Paket installieren (im Entwicklungsmodus)
pip install -e .

# Mit optional dependencies
pip install -e ".[dev]"
pip install -e ".[dev,docs]"
```

### 7.3    Dynamische Versionen

```toml
[project]
name = "mypackage"
dynamic = ["version"]  # Version aus Code lesen

[tool.setuptools.dynamic]
version = {attr = "mypackage.__version__"}
```

```python
# mypackage/__init__.py
__version__ = "0.1.0"
```

### 7.4    Entry Points / Console Scripts

```toml
[project.scripts]
myapp = "mypackage.cli:main"
mytool = "mypackage.tools:run"
```

```python
# mypackage/cli.py
def main():
    print("Hello from myapp!")

if __name__ == "__main__":
    main()
```

```bash
# Nach Installation verfügbar:
myapp  # Ruft mypackage.cli:main() auf
```

## 8    Verschiedene Build-Backends

### 8.1    setuptools (Standard)

```toml
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"
```

### 8.2    Poetry

```toml
[build-system]
requires = ["poetry-core>=1.0.0"]
build-backend = "poetry.core.masonry.api"
```

### 8.3    Flit (minimalistisch)

```toml
[build-system]
requires = ["flit_core>=3.2"]
build-backend = "flit_core.buildapi"

[project]
name = "mypackage"
authors = [{name = "Your Name"}]
dynamic = ["version", "description"]
```

### 8.4    Hatch (modern)

```toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

## 9    Tool-Konfiguration in `pyproject.toml`

### 9.1    Black (Formatter)

```toml
[tool.black]
line-length = 88
target-version = ['py310', 'py311']
include = '\.pyi?$'
extend-exclude = '''
/(
  # directories
  \.eggs
  | \.git
  | \.venv
  | build
  | dist
)/
'''
```

### 9.2    MyPy (Type Checker)

```toml
[tool.mypy]
python_version = "3.10"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true

[[tool.mypy.overrides]]
module = "pandas.*"
ignore_missing_imports = true
```

### 9.3    Pytest

```toml
[tool.pytest.ini_options]
minversion = "7.0"
addopts = "-ra -q --strict-markers"
testpaths = [
    "tests",
]
markers = [
    "slow: marks tests as slow",
    "integration: integration tests",
]
```

### 9.4    Ruff (Linter & Formatter)

```toml
[tool.ruff]
line-length = 88
target-version = "py310"

[tool.ruff.lint]
select = ["E", "F", "I", "N", "W"]
ignore = ["E501"]

[tool.ruff.lint.per-file-ignores]
"__init__.py" = ["F401"]
```

## 10    Vergleich der Tools

### 10.1    Feature-Matrix

| Feature                | pip + venv | pip-tools  | Poetry               | Hatch         |
| ---------------------- | ---------- | ---------- | -------------------- | ------------- |
| Dependency Resolution  | ✅ Basis    | ✅ Gut      | ✅ Sehr gut           | ✅ Sehr gut    |
| Lock-Files             | ❌          | ✅          | ✅                    | ✅             |
| Virtual Env Management | ⚠️ Manuell | ⚠️ Manuell | ✅ Automatisch        | ✅ Automatisch |
| Packaging              | ⚠️ Separat | ⚠️ Separat | ✅ Integriert         | ✅ Integriert  |
| Publishing             | ⚠️ Separat | ⚠️ Separat | ✅ Integriert         | ✅ Integriert  |
| pyproject.toml         | ✅          | ✅          | ✅                    | ✅             |
| Lernkurve              | ✅ Niedrig  | ✅ Niedrig  | ⚠️ Mittel            | ⚠️ Mittel     |
| Performance            | ✅          | ✅          | ⚠️ Langsamer         | ✅             |
| Ökosystem-Integration  | ✅ Maximal  | ✅ Gut      | ⚠️ Eigenes Ökosystem | ✅ Gut         |

### 10.2    Wann was verwenden?

**pip + venv:**

- Einfache Projekte ohne komplexe Dependencies
- CI/CD-Pipelines (minimale Abhängigkeiten)
- Lern-/Tutorial-Projekte
- Schnelle Prototypen

**pip-tools:**

- Mittlere bis große Projekte
- Wenn exakte Reproduzierbarkeit wichtig ist
- Wenn man bei pip-Ökosystem bleiben will
- CI/CD mit deterministischen Builds

**Poetry:**

- Neue Projekte von Grund auf
- Library-Entwicklung mit Veröffentlichung
- Wenn All-in-One-Lösung gewünscht
- Team-Projekte mit standardisiertem Workflow
- Wenn Virtual Env automatisch verwaltet werden soll

**Hatch:**

- Moderne Alternative zu Poetry
- Schnellere Builds
- Mehrere Python-Versionen testen
- Wenn man mehr Kontrolle als Poetry will

## 11    Best Practices

### 11.1    Allgemeine Empfehlungen

```bash
# ✅ DO: Virtual Environments nutzen
python -m venv venv
source venv/bin/activate

# ✅ DO: pyproject.toml statt setup.py
# Modern und standardisiert

# ✅ DO: Lock-Files ins Git committen
# poetry.lock, requirements.txt (von pip-compile)

# ❌ DON'T: Virtual Environment committen
# Gehört in .gitignore

# ❌ DON'T: pip freeze für Dependency-Management
# Nutze pip-tools oder Poetry

# ✅ DO: Versions-Constraints spezifizieren
requests = "^2.31.0"  # Poetry
requests>=2.31.0,<3.0.0  # pip
```

### 11.2    Entwicklungs-Workflow (Poetry)

```bash
# 1. Projekt initialisieren
poetry new myproject
cd myproject

# 2. Dependencies hinzufügen
poetry add requests pandas
poetry add --group dev pytest black mypy

# 3. Installation
poetry install

# 4. Entwicklung
poetry shell
# oder
poetry run python main.py
poetry run pytest

# 5. Code formatieren/testen
poetry run black .
poetry run mypy .
poetry run pytest

# 6. Vor Commit: Lock-File aktualisieren falls nötig
poetry lock --no-update

# 7. Packaging
poetry build
poetry publish
```

### 11.3    CI/CD Integration

**GitHub Actions mit Poetry:**

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install Poetry
        uses: snok/install-poetry@v1
        with:
          version: 1.6.0
      
      - name: Install dependencies
        run: poetry install
      
      - name: Run tests
        run: poetry run pytest
```

**Mit pip-tools:**

```yaml
- name: Install dependencies
  run: |
    pip install pip-tools
    pip-sync requirements.txt
    
- name: Run tests
  run: pytest
```

## 12    Migration zwischen Tools

### 12.1    Von requirements.txt zu Poetry

```bash
# 1. Poetry initialisieren
poetry init

# 2. Dependencies aus requirements.txt importieren
# (manuell in pyproject.toml übertragen)

# 3. Oder mit poetry add
cat requirements.txt | grep -v "#" | xargs poetry add

# 4. Lock-File generieren
poetry lock
```

### 12.2    Von Poetry zu pip-tools

```bash
# 1. Aus pyproject.toml extrahieren
poetry export -f requirements.txt --output requirements.txt

# 2. requirements.in erstellen (manuell vereinfachen)
# Nur direkte Dependencies ohne Versionen/Hashes

# 3. Neu kompilieren
pip-compile requirements.in
```

## 13    PyInstaller: Standalone Executables – Erstellung einer ausführbaren Datei

Python-Anwendungen als ausführbare Dateien (`.exe`, `.app`) verteilen – ohne Python-Installation beim Endnutzer.

### 13.1    Konzept

PyInstaller bündelt Python-Code + Interpreter + Dependencies in eine ausführbare Datei.

**Vorteile:**

- ✅ Keine Python-Installation nötig
- ✅ Einfache Distribution
- ✅ Verschleierung des Source-Codes (minimal)

**Nachteile:**

- ❌ Große Dateigröße (50-200 MB)
- ❌ Langsamer Start
- ❌ Plattform-spezifisch (.exe muss unter Windows erstellt werden)

### 13.2    Windows: auto-py-to-exe

Es wird `auto-py-to-exe` verwendet. Es handelt sich um eine GUI für `PyInstaller` und ein paar Extras (siehe [stackoverflow.com](https://stackoverflow.com/questions/76873518/whats-the-difference-between-pyinstaller-and-auto-py-to-exe)). Weitere Infos zum Paket unter [pypi.org](https://pypi.org/project/auto-py-to-exe/)

1. Installation
```zsh
pip install auto-py-to-exe
```

2. Ausführen:
```zsh
auto-py-to-exe
```

3. Konfigurationsdatei `auto-py-to-exe_settings.json` aus Projekt laden
4. Konvertieren beginnen

> [!warning]
> Zum Schluss muss der Ordner `data`, der sich im Ordner `_internal` befindet, eine Ebene höher geschoben werden, sodass er sich im gleichen Ordner wie die `.exe` befindet.

### 13.3    macOS: PyInstaller CLI

1. Installation
```zsh
pip install pyinstaller
```

2. App-Bundle erstellen
```zsh
pyinstaller --workpath /Users/cgroening/temp/PyInstaller/build \
            --distpath /Users/cgroening/temp/PyInstaller/dist DoneZilla.spec
```

Zum Debuggen App über Terminal ausführen (um Fehlermeldungen sehen zu können):
```zsh
open '/Users/cgroening/temp/PyInstaller/dist/DoneZilla.app'
```

3. Richtiges Verhalten prüfen: In der `DoneZilla.spec` ist eingestellt, dass die Qt-Dateien NICHT im App-Bundle enthalten sind. Für LGPL-Konformität werden die Qt-Dateien aus dem Ordner `external_libs` geladen. Das heißt, sollte der Ordner nicht existieren oder anders heißen, darf die App nicht starten.
4. Ordner `external_libs` mit den Unterordnern `PySide6` und `shiboken6` in den gleichen Ordner wie das App-Bundle platzieren
5. Ordner `external_libs` aufräumen, sodass er nur benötigte Dateien enthält, um die Größe zu reduzieren

### 13.4    .spec-Datei Konfiguration

```python
# myapp.spec
a = Analysis(
    ['main.py'],
    pathex=[],
    binaries=[],
    datas=[('config.json', '.'), ('images/', 'images')],
    hiddenimports=['pkg_resources'],
    hookspath=[],
    runtime_hooks=[],
    excludes=['tkinter'],
)

pyz = PYZ(a.pure, a.zipped_data)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    name='MyApp',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,  # Für GUI-Apps
    icon='app.ico'
)
```

### 13.5    Datendateien inkludieren

```bash
# Einzelne Datei
pyinstaller --add-data "config.json:." script.py

# Ordner (Linux/Mac)
pyinstaller --add-data "images:images" script.py

# Ordner (Windows)
pyinstaller --add-data "images;images" script.py
```

### 13.6    Häufige Probleme

**Problem: "ModuleNotFoundError" nach Build**
```bash
# Hidden Imports manuell angeben
pyinstaller --hidden-import=pkg_resources script.py
```

**Problem: Zu große .exe**
```bash
# UPX Kompression (optional)
pyinstaller --upx-dir=/path/to/upx script.py

# Module ausschließen
pyinstaller --exclude-module tkinter script.py
```

**Problem: Antivirus False Positive**
- Signiere die .exe digital (Windows)
- Reiche bei Antivirus-Herstellern als False Positive ein

### 13.7    Alternativen

| Tool         | Platform   | Besonderheit                    |
| ------------ | ---------- | ------------------------------- |
| PyInstaller  | All        | Standard, feature-reich         |
| auto-py-to-exe | Windows  | GUI für PyInstaller            |
| cx_Freeze    | All        | Alternative zu PyInstaller      |
| py2app       | macOS      | macOS-spezifisch                |
| py2exe       | Windows    | Windows-only, veraltet          |
| Nuitka       | All        | Kompiliert zu C (schneller)     |
| PyOxidizer   | All        | Rust-basiert, modern            |

### 13.8    Best Practices

**✅ DO:**
- Teste die .exe auf sauberem System
- Verwende .spec-Datei für komplexe Builds
- Versioniere die .spec-Datei
- Erstelle auf Target-Platform (Windows .exe auf Windows)
- Verwende Virtual Environment für saubere Dependencies

**❌ DON'T:**
- Cross-compile nicht (Windows → Linux funktioniert nicht)
- Zu viele Dependencies (Dateigröße)
- Sensitive Daten im Binary (leicht extrahierbar)

## 14    Zusammenfassung

| Tool       | Zweck                              | Empfohlen für                        |
| ---------- | ---------------------------------- | ------------------------------------ |
| `venv`     | Virtual Environments               | Alle Projekte                        |
| `pip`      | Paket-Installation                 | Basis-Tool                           |
| `pip-tools`| Dependency-Pinning                 | Deterministische Builds              |
| Poetry     | All-in-One Management              | Neue Projekte, Libraries             |
| Hatch      | Alternative zu Poetry              | Moderne Projekte, Multi-Python       |
| `pyproject.toml` | Standard-Konfiguration       | Alle modernen Projekte               |

**Moderne Empfehlung:**

- **Einfache Projekte**: `venv` + `pip` + `pyproject.toml`
- **Professionelle Projekte**: `pip-tools` oder Poetry
- **Library-Entwicklung**: Poetry oder Hatch
- **Legacy-Migration**: Schrittweise zu `pyproject.toml` wechseln

**Kernprinzip:** Nutze Lock-Files für reproduzierbare Builds, trenne abstrakte von konkreten Dependencies, und setze auf standardisiertes `pyproject.toml` statt proprietärer Konfigurationen.
