# Kontext-Manager und contextlib

Kontextmanager gewährleisten eine saubere Ressourcenverwaltung durch automatisches Setup und Cleanup. Sie sind unverzichtbar beim Arbeiten mit Dateien, Datenbankverbindungen, Locks und anderen Ressourcen, die nach Gebrauch freigegeben werden müssen.

## 1    Das `with`-Statement

Das `with`-Statement stellt sicher, dass Ressourcen korrekt initialisiert und anschließend freigegeben werden – selbst wenn Fehler auftreten.

### 1.1    Dateien öffnen ohne `with`

```python
# Klassischer Ansatz (fehleranfällig)
file = open('data.txt', 'r')
try:
    content = file.read()
    print(content)
finally:
    file.close()  # Manuelles Cleanup
```

### 1.2    Dateien öffnen mit `with`

```python
# Moderner Ansatz (empfohlen)
with open('data.txt', 'r') as file:
    content = file.read()
    print(content)
# Datei wird automatisch geschlossen
```

**Vorteile:**

- Automatisches Schließen der Datei, auch bei Exceptions
- Keine `finally`-Blöcke nötig
- Kompakter und lesbarer Code

## 2    Eigene Kontextmanager mit `__enter__` und `__exit__`

Ein Kontextmanager ist jede Klasse, die die Methoden `__enter__()` und `__exit__()` implementiert.

### 2.1    Einfacher Kontextmanager

```python
class DatabaseConnection:
    def __init__(self, db_name):
        self.db_name = db_name
        self.connection = None
    
    def __enter__(self):
        print(f'Opening connection to {self.db_name}')
        self.connection = f'Connection to {self.db_name}'
        return self.connection  # Wird an 'as'-Variable übergeben
    
    def __exit__(self, exc_type, exc_value, traceback):
        print(f'Closing connection to {self.db_name}')
        if exc_type is not None:
            print(f'Exception occurred: {exc_value}')
        # False zurückgeben lässt Exception weiterpropagieren
        # True unterdrückt die Exception
        return False

# Verwendung
with DatabaseConnection('mydb') as conn:
    print(f'Working with {conn}')
    # raise ValueError('Test error')  # Würde trotzdem cleanup ausführen
```

### 2.2    Parameter von `__exit__`

| Parameter    | Beschreibung                                                     |
| ------------ | ---------------------------------------------------------------- |
| `exc_type`   | Typ der Exception (z.B. `ValueError`) oder `None`                |
| `exc_value`  | Exception-Objekt oder `None`                                     |
| `traceback`  | Traceback-Objekt oder `None`                                     |
| Rückgabewert | `True` unterdrückt Exception, `False` propagiert sie             |

### 2.3    Timer-Kontextmanager

```python
import time

class Timer:
    def __enter__(self):
        self.start = time.time()
        return self
    
    def __exit__(self, *args):
        self.end = time.time()
        self.elapsed = self.end - self.start
        print(f'Elapsed time: {self.elapsed:.4f} seconds')
        return False

# Verwendung
with Timer():
    # Zeitintensiver Code
    sum(range(1_000_000))
```

## 3    Das `contextlib`-Modul

Das `contextlib`-Modul bietet Hilfsfunktionen zum Erstellen und Arbeiten mit Kontextmanagern.

### 3.1    `@contextmanager` Decorator

Der einfachste Weg, einen Kontextmanager zu erstellen, ist mit dem `@contextmanager`-Decorator.

```python
from contextlib import contextmanager

@contextmanager
def file_manager(filename, mode):
    print(f'Opening {filename}')
    file = open(filename, mode)
    try:
        yield file  # Alles vor yield = __enter__, danach = __exit__
    finally:
        print(f'Closing {filename}')
        file.close()

# Verwendung
with file_manager('test.txt', 'w') as f:
    f.write('Hello World')
```

**Wichtig:**

- Code vor `yield` entspricht `__enter__`
- `yield` gibt den Wert zurück (wie `return` in `__enter__`)
- Code nach `yield` entspricht `__exit__`
- `finally`-Block garantiert Cleanup auch bei Exceptions

### 3.2    Mehrere Ressourcen verwalten

```python
from contextlib import contextmanager

@contextmanager
def multi_file_manager(*filenames):
    files = []
    try:
        # Alle Dateien öffnen
        for filename in filenames:
            files.append(open(filename, 'r'))
        yield files
    finally:
        # Alle Dateien schließen
        for f in files:
            f.close()

# Verwendung
with multi_file_manager('file1.txt', 'file2.txt') as (f1, f2):
    content1 = f1.read()
    content2 = f2.read()
```

## 4    Mehrere Kontextmanager kombinieren

### 4.1    Verschachtelt

```python
with open('input.txt', 'r') as infile:
    with open('output.txt', 'w') as outfile:
        content = infile.read()
        outfile.write(content.upper())
```

### 4.2    In einer Zeile (Python 3.1+)

```python
with open('input.txt', 'r') as infile, open('output.txt', 'w') as outfile:
    content = infile.read()
    outfile.write(content.upper())
```

### 4.3    Mit `ExitStack` (flexibel)

```python
from contextlib import ExitStack

filenames = ['file1.txt', 'file2.txt', 'file3.txt']

with ExitStack() as stack:
    # Dynamisch Dateien öffnen
    files = [stack.enter_context(open(fn, 'r')) for fn in filenames]
    
    # Mit allen Dateien arbeiten
    for f in files:
        print(f.read())
    # Alle werden automatisch geschlossen
```

**Vorteile von `ExitStack`:**

- Dynamische Anzahl von Kontextmanagern
- Manuelle Registrierung von Callbacks mit `stack.callback()`
- Besonders nützlich bei unbekannter Anzahl von Ressourcen

## 5    Nützliche Kontextmanager aus `contextlib`

### 5.1    `suppress` – Exceptions unterdrücken

```python
from contextlib import suppress

# Fehler ignorieren statt try-except
with suppress(FileNotFoundError):
    os.remove('nonexistent_file.txt')
# Kein Fehler, wenn Datei nicht existiert
```

### 5.2    `redirect_stdout` – Ausgabe umleiten

```python
from contextlib import redirect_stdout
import io

# stdout in String-Buffer umleiten
output = io.StringIO()
with redirect_stdout(output):
    print('This goes to the buffer')
    print('And this too')

captured = output.getvalue()
print(f'Captured: {captured}')
```

### 5.3    `redirect_stderr` – Fehlerausgabe umleiten

```python
from contextlib import redirect_stderr
import io

error_buffer = io.StringIO()
with redirect_stderr(error_buffer):
    import sys
    sys.stderr.write('Error message')

errors = error_buffer.getvalue()
```

### 5.4    `closing` – Objekte mit `close()` verwalten

```python
from contextlib import closing
from urllib.request import urlopen

# Für Objekte, die close() haben, aber kein with-Statement
with closing(urlopen('http://example.com')) as page:
    content = page.read()
# page.close() wird automatisch aufgerufen
```

### 5.5    `nullcontext` – Optionaler Kontextmanager

```python
from contextlib import nullcontext

def process_file(filename, use_context=True):
    cm = open(filename, 'r') if use_context else nullcontext()
    
    with cm as f:
        # f ist entweder File-Objekt oder None
        if f:
            return f.read()
    return None
```

## 6    Kontextmanager für Threading und Locks

### 6.1    Thread-Lock

```python
import threading

lock = threading.Lock()

# Ohne with (manuell)
lock.acquire()
try:
    # Critical section
    pass
finally:
    lock.release()

# Mit with (automatisch)
with lock:
    # Critical section
    pass
# Lock wird automatisch freigegeben
```

### 6.2    Eigener Lock-Kontextmanager

```python
@contextmanager
def acquire_lock(lock, timeout=10):
    acquired = lock.acquire(timeout=timeout)
    try:
        if not acquired:
            raise TimeoutError('Could not acquire lock')
        yield acquired
    finally:
        if acquired:
            lock.release()

# Verwendung
with acquire_lock(lock):
    print('Lock acquired')
```

## 7    Asynchrone Kontextmanager

Bei asynchronem Code (`async`/`await`) gibt es spezielle Kontextmanager mit `__aenter__` und `__aexit__`.

### 7.1    Async Kontextmanager definieren

```python
import asyncio

class AsyncDatabaseConnection:
    def __init__(self, db_name):
        self.db_name = db_name
    
    async def __aenter__(self):
        print(f'Opening async connection to {self.db_name}')
        await asyncio.sleep(0.1)  # Simuliert async I/O
        return self
    
    async def __aexit__(self, exc_type, exc_value, traceback):
        print(f'Closing async connection to {self.db_name}')
        await asyncio.sleep(0.1)
        return False

# Verwendung
async def main():
    async with AsyncDatabaseConnection('asyncdb') as conn:
        print('Working with async connection')

asyncio.run(main())
```

### 7.2    Mit `@asynccontextmanager`

```python
from contextlib import asynccontextmanager
import asyncio

@asynccontextmanager
async def async_file_manager(filename):
    print(f'Opening {filename} asynchronously')
    await asyncio.sleep(0.1)
    file = open(filename, 'r')
    try:
        yield file
    finally:
        print(f'Closing {filename} asynchronously')
        file.close()
        await asyncio.sleep(0.1)

# Verwendung
async def main():
    async with async_file_manager('test.txt') as f:
        content = f.read()

asyncio.run(main())
```

## 8    Best Practices

### 8.1    Wann eigene Kontextmanager erstellen?

**Gute Anwendungsfälle:**

- Ressourcen mit Setup/Cleanup (Dateien, Verbindungen, Locks)
- Temporäre Zustandsänderungen (Working Directory, Umgebungsvariablen)
- Zeitmessungen und Profiling
- Transaktionen (Begin/Commit/Rollback)
- Logging-Scopes

### 8.2    `@contextmanager` vs. Klasse?

| Kriterium              | `@contextmanager`        | Klasse mit `__enter__`/`__exit__` |
| ---------------------- | ------------------------ | --------------------------------- |
| Einfache Anwendung     | ✅ Bevorzugt             | ❌ Mehr Boilerplate               |
| Wiederverwendbarkeit   | ✅ Gut                   | ✅ Sehr gut                       |
| State-Management       | ⚠️ Begrenzt              | ✅ Flexibel                       |
| Exception-Handling     | ⚠️ Muss explizit sein    | ✅ Klare Kontrolle                |
| Code-Übersichtlichkeit | ✅ Kompakt               | ⚠️ Mehr Code                      |

**Faustregel:** Für einfache Fälle `@contextmanager`, für komplexe Logik oder State-Management eine Klasse.

### 8.3    Typische Fehler vermeiden

```python
# ❌ Falsch: yield vergessen
@contextmanager
def bad_context():
    print('Enter')
    # Fehlt: yield
    print('Exit')

# ✅ Richtig: yield nicht vergessen
@contextmanager
def good_context():
    print('Enter')
    yield
    print('Exit')

# ❌ Falsch: Keine Exception-Behandlung
@contextmanager
def unsafe_context():
    resource = acquire_resource()
    yield resource
    release_resource(resource)  # Wird bei Exception nicht ausgeführt!

# ✅ Richtig: finally verwenden
@contextmanager
def safe_context():
    resource = acquire_resource()
    try:
        yield resource
    finally:
        release_resource(resource)  # Wird immer ausgeführt
```

## 9    Praxisbeispiele

### 9.1    Temporäres Arbeitsverzeichnis

```python
import os
from contextlib import contextmanager

@contextmanager
def temporary_directory(path):
    original_dir = os.getcwd()
    try:
        os.chdir(path)
        yield path
    finally:
        os.chdir(original_dir)

# Verwendung
with temporary_directory('/tmp'):
    print(f'Current dir: {os.getcwd()}')  # /tmp
print(f'Back to: {os.getcwd()}')  # Original directory
```

### 9.2    Datenbank-Transaktion

```python
@contextmanager
def transaction(connection):
    """Automatisches Commit/Rollback bei Datenbanktransaktionen"""
    cursor = connection.cursor()
    try:
        yield cursor
        connection.commit()  # Erfolg → Commit
    except Exception:
        connection.rollback()  # Fehler → Rollback
        raise
    finally:
        cursor.close()

# Verwendung
# with transaction(db_connection) as cursor:
#     cursor.execute('INSERT INTO ...')
#     cursor.execute('UPDATE ...')
# Automatisches Commit bei Erfolg, Rollback bei Exception
```

### 9.3    Profiling-Context

```python
import cProfile
from contextlib import contextmanager

@contextmanager
def profile_code(sort_by='cumulative'):
    """Profiliert Code-Block"""
    profiler = cProfile.Profile()
    profiler.enable()
    try:
        yield profiler
    finally:
        profiler.disable()
        profiler.print_stats(sort=sort_by)

# Verwendung
with profile_code():
    # Code der profiliert werden soll
    result = sum(range(1_000_000))
```

### 9.4    Temporäre Environment Variables

```python
import os
from contextlib import contextmanager

@contextmanager
def env_variable(key, value):
    """Setzt temporär eine Umgebungsvariable"""
    old_value = os.environ.get(key)
    os.environ[key] = value
    try:
        yield
    finally:
        if old_value is None:
            del os.environ[key]
        else:
            os.environ[key] = old_value

# Verwendung
with env_variable('DEBUG', 'true'):
    print(os.environ['DEBUG'])  # 'true'
print(os.environ.get('DEBUG'))  # None oder alter Wert
```

## 10    Zusammenfassung

| Konzept                      | Verwendung                                                 |
| ---------------------------- | ---------------------------------------------------------- |
| `with`-Statement             | Automatisches Setup/Cleanup von Ressourcen                 |
| `__enter__` / `__exit__`     | Kontextmanager als Klasse implementieren                   |
| `@contextmanager`            | Generator-basierter Kontextmanager (einfacher)             |
| `contextlib.suppress`        | Exceptions unterdrücken                                    |
| `contextlib.redirect_stdout` | Ausgaben umleiten                                          |
| `contextlib.ExitStack`       | Dynamische Anzahl von Kontextmanagern                      |
| `async with`                 | Asynchrone Kontextmanager mit `__aenter__` / `__aexit__`   |

**Kernprinzip:** Kontextmanager garantieren, dass Cleanup-Code ausgeführt wird – egal ob der Code normal endet oder eine Exception auftritt. Sie sind der Standard-Ansatz für Ressourcenverwaltung in Python.
