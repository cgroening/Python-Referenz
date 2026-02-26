# Leistungsoptimierung

Python ist zwar sehr flexibel und einfach zu schreiben, jedoch nicht immer die schnellste Sprache. Für leistungskritische Anwendungen gibt es mehrere Möglichkeiten, Python-Code zu beschleunigen, oft durch die Integration von C/C++ oder durch JIT-Compiler.

## 1    Cython

Cython ist eine Erweiterung von Python, mit der man C-ähnlichen Code schreiben kann, der zu sehr schnellem C-Code kompiliert wird. Es erlaubt auch das Einbinden von C-Bibliotheken.

Die Verwendung lohnt sich nur, wenn man sehr viele mathematische Operationen durchführt.

### 1.1    Beispiel

```python
# example.pyx

def compute_sum(int n):
    cdef int i
    cdef int total = 0
    for i in range(n):
        total += i
    return total
```

Um diesen Code zu verwenden, muss er mit Cython kompiliert werden, z. B. über `setup.py` oder Jupyter mit `%%cython`.

## 2    CPython

CPython ist die Standard-Implementierung von Python, geschrieben in C. Bei der Optimierung auf CPython-Ebene kann man z. B. direkt in C Erweiterungsmodule schreiben.

### 2.1    Vorteile

- Maximale Performance durch nativen C-Code
- Direkter Zugriff auf Python-Interna
- Verwendung für systemnahe Programmierung

### 2.2    Nachteile

- Komplexität des C-Codes
- Manuelle Speicherverwaltung

## 3    Pybind11 (C++)

Pybind11 ist eine moderne Header-only-C++-Bibliothek zur Anbindung von C++-Code an Python. Sie erlaubt es, bestehende C++-Bibliotheken einfach in Python zu verwenden.

### 3.1    Beispiel

```cpp
#include <pybind11/pybind11.h>
int add(int a, int b) {
    return a + b;
}

PYBIND11_MODULE(my_module, m) {
    m.def('add', &add);
}
```

Kompiliert wird dies zu einer `.so`-Datei, die in Python importiert werden kann:

```python
import my_module
print(my_module.add(3, 4))  # Ausgabe: 7
```

> [!INFO] Was ist eine Header-only-C++-Bibliothek?
> In C++ bestehen Bibliotheken typischerweise aus:
> - Header-Dateien (`.h` oder `.hpp`) – enthalten Deklarationen (z. B. Funktionen, Klassen).
> - Implementierungsdateien (`.cpp`) – enthalten die eigentliche Logik.
>
> **Eine Header-only-Bibliothek verzichtet auf `.cpp`-Dateien.**
> Stattdessen ist die gesamte Implementierung direkt in den Header-Dateien enthalten. Das bedeutet:
> - Man muss die Bibliothek nicht kompilieren – man bindet einfach nur die Header-Datei ein.
> - Sie kann per `#include` benutzt werden.
> - Beispiel: `#include <pybind11/pybind11.h>`
>
> **Vorteile:**
> - Einfacher zu integrieren, kein separater Build-Schritt nötig.
> - Portabler, da es keine Abhängigkeit zu vorcompilierten Binaries gibt.
> - Gut geeignet für Templates und generischen Code.
>
**Nachteil:**
> - Der Compiler sieht bei jedem `#include` die komplette Implementierung → längere Compile-Zeiten.

## 4    Numba

Numba ist ein JIT-Compiler (Just-In-Time), der Funktionen zur Laufzeit in optimierten Maschinen-Code übersetzt, basierend auf LLVM.

### 4.1    Beispiel

```python
from numba import jit

@jit(nopython=True)
def fast_sum(n):
    total = 0
    for i in range(n):
        total += i
    return total

print(fast_sum(1000000))
```

Numba funktioniert besonders gut bei numerischen Berechnungen und Schleifen.

> [!INFO] Was ist LLVM?
LLVM steht für *Low-Level Virtual Machine*, ist aber heute viel mehr als das: LLVM ist eine moderne Compiler-Infrastruktur, die aus mehreren modularen Tools besteht. Viele moderne Programmiersprachen verwenden LLVM, um ihren Code in Maschinencode zu übersetzen.
>
> **Wichtigste Eigenschaften:**
> - Zwischensprache (IR): LLVM übersetzt Code zuerst in eine eigene 'Intermediate Representation' (IR), die dann weiter optimiert wird.
> - Optimierungen: Bietet sehr fortschrittliche Optimierungen auf niedriger Ebene.
> - Backend: Erzeugt optimierten Maschinencode für viele Plattformen.
>
> **Beispiele für Tools/Projekte, die LLVM nutzen:**
> - Clang (C/C++-Compiler)
> - Rust
> - Swift
> - Numba (s. o.)
> - Julia
>
> **Warum wichtig für Python-Optimierung?**
> Numba nutzt LLVM, um Python-Funktionen zur Laufzeit (JIT) in schnellen Maschinen-Code umzuwandeln.

## 5    Mypyc

Mypyc kompiliert typannotierten Python-Code zu C-Extensions und kann so erhebliche Geschwindigkeitsvorteile bringen. Es arbeitet zusammen mit `mypi`, dem statischen Typprüfer.

### 5.1    Beispiel

```python
# example.py

def double(x: int) -> int:
    return x * 2
```

Kompilieren mit `mypyc`:

```bash
mypyc example.py
```

Die resultierende `.so`-Datei kann dann wie ein normales Python-Modul importiert werden.

### 5.2    Vorteile

- Nahtlose Integration mit typisiertem Python-Code
- Einfache Anwendung über bestehende Typannotationen

## 6    C-Extensions & FFI (Foreign Function Interface)

Python kann mit C/C++-Code interagieren für maximale Performance oder Zugriff auf System-Bibliotheken. Es gibt mehrere Ansätze mit unterschiedlicher Komplexität.

### 6.1    ctypes – Einfacher FFI-Zugriff

`ctypes` ist eine Built-in Library zum Aufrufen von C-Funktionen aus Shared Libraries.

#### 6.1.1    Grundlagen
```python
import ctypes

# C-Bibliothek laden
# Linux
libc = ctypes.CDLL('libc.so.6')
# macOS
libc = ctypes.CDLL('libc.dylib')
# Windows
libc = ctypes.CDLL('msvcrt.dll')

# C-Funktion aufrufen
libc.printf(b'Hello from C! %d\n', 42)
```

#### 6.1.2    Eigene C-Library einbinden

**C-Code (mylib.c):**
```c
// mylib.c
#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

void greet(const char* name) {
    printf('Hello, %s!\n', name);
}
```

**Kompilieren:**
```bash
# Shared Library erstellen
# Linux
gcc -shared -o libmylib.so -fPIC mylib.c

# macOS
gcc -shared -o libmylib.dylib -fPIC mylib.c

# Windows
gcc -shared -o mylib.dll mylib.c
```

**Python-Code:**
```python
import ctypes

# Library laden
lib = ctypes.CDLL('./libmylib.so')

# add-Funktion aufrufen
result = lib.add(5, 3)
print(f'5 + 3 = {result}')  # 8

# greet-Funktion mit String
lib.greet(b'Alice')  # Hello, Alice!
```

#### 6.1.3    Typen und Argumente
```python
import ctypes

lib = ctypes.CDLL('./libmylib.so')

# Rückgabetyp deklarieren
lib.add.restype = ctypes.c_int
lib.add.argtypes = [ctypes.c_int, ctypes.c_int]

result = lib.add(10, 20)
print(result)

# String-Argumente
lib.greet.argtypes = [ctypes.c_char_p]
lib.greet(b'Bob')
```

#### 6.1.4    Komplexe Datentypen
```python
import ctypes

# Struct definieren
class Point(ctypes.Structure):
    _fields_ = [
        ('x', ctypes.c_int),
        ('y', ctypes.c_int)
    ]

# C-Funktion: void print_point(Point* p)
lib.print_point.argtypes = [ctypes.POINTER(Point)]

p = Point(10, 20)
lib.print_point(ctypes.byref(p))
```

#### 6.1.5    Arrays und Pointer
```python
import ctypes

# Array erstellen
IntArray = ctypes.c_int * 5
arr = IntArray(1, 2, 3, 4, 5)

# Als Pointer übergeben
lib.sum_array.argtypes = [ctypes.POINTER(ctypes.c_int), ctypes.c_int]
lib.sum_array.restype = ctypes.c_int

result = lib.sum_array(arr, 5)
print(f'Sum: {result}')
```

#### 6.1.6    Callbacks (Python → C → Python)
```python
import ctypes

# Python-Funktion als C-Callback
@ctypes.CFUNCTYPE(ctypes.c_int, ctypes.c_int)
def callback(x):
    print(f'Callback called with {x}')
    return x * 2

# C-Funktion: int process(int (*func)(int), int value)
lib.process.argtypes = [ctypes.CFUNCTYPE(ctypes.c_int, ctypes.c_int), ctypes.c_int]
lib.process.restype = ctypes.c_int

result = lib.process(callback, 5)
print(f'Result: {result}')
```

### 6.2    cffi – Modern FFI Interface

`cffi` (C Foreign Function Interface) ist moderner und sicherer als ctypes.

#### 6.2.1    Installation und Grundlagen
```bash
pip install cffi
```
```python
from cffi import FFI

ffi = FFI()

# C-Deklarationen
ffi.cdef("""
    int add(int a, int b);
    void greet(const char* name);
""")

# Library laden
lib = ffi.dlopen('./libmylib.so')

# Funktionen aufrufen
result = lib.add(5, 3)
print(result)  # 8

lib.greet(b'Alice')
```

#### 6.2.2    Out-of-Line Mode (Kompiliert)
```python
# build_mylib.py
from cffi import FFI

ffibuilder = FFI()

ffibuilder.cdef("""
    int add(int a, int b);
""")

ffibuilder.set_source('_mylib',
    """
    int add(int a, int b) {
        return a + b;
    }
    """)

if __name__ == '__main__':
    ffibuilder.compile(verbose=True)
```
```bash
# Kompilieren
python build_mylib.py

# Verwendung
from _mylib import lib
print(lib.add(10, 20))
```

#### 6.2.3    Structs mit cffi
```python
from cffi import FFI

ffi = FFI()

ffi.cdef("""
    typedef struct {
        int x;
        int y;
    } Point;

    void print_point(Point* p);
""")

lib = ffi.dlopen('./libmylib.so')

# Struct erstellen
p = ffi.new('Point *')
p.x = 10
p.y = 20

lib.print_point(p)
```

#### 6.2.4    Callbacks mit cffi
```python
from cffi import FFI

ffi = FFI()

ffi.cdef("""
    typedef int (*callback_t)(int);
    int process(callback_t func, int value);
""")

lib = ffi.dlopen('./libmylib.so')

# Python-Callback
@ffi.def_extern()
def my_callback(x):
    return x * 2

callback = ffi.callback('int(int)', my_callback)
result = lib.process(callback, 5)
print(result)
```

### 6.3    Python C-API – Native Extensions

Direkte C-Extensions mit Python C-API für maximale Kontrolle.

#### 6.3.1    Einfaches Modul
```c
// mymodule.c
#include <Python.h>

static PyObject* add(PyObject* self, PyObject* args) {
    int a, b;
    if (!PyArg_ParseTuple(args, 'ii', &a, &b))
        return NULL;

    return PyLong_FromLong(a + b);
}

static PyMethodDef ModuleMethods[] = {
    {'add', add, METH_VARARGS, 'Add two integers'},
    {NULL, NULL, 0, NULL}
};

static struct PyModuleDef mymodule = {
    PyModuleDef_HEAD_INIT,
    'mymodule',
    'Example module',
    -1,
    ModuleMethods
};

PyMODINIT_FUNC PyInit_mymodule(void) {
    return PyModule_Create(&mymodule);
}
```

**setup.py:**
```python
from setuptools import setup, Extension

module = Extension('mymodule', sources=['mymodule.c'])

setup(
    name='mymodule',
    version='1.0',
    ext_modules=[module]
)
```
```bash
# Kompilieren
python setup.py build_ext --inplace

# Verwenden
import mymodule
print(mymodule.add(5, 3))
```

### 6.4    Vergleich: ctypes vs. cffi vs. C-API

| Aspekt          | ctypes              | cffi                | Python C-API       |
| --------------- | ------------------- | ------------------- | ------------------ |
| **Komplexität** | ✅ Einfach          | ✅ Mittel           | ❌ Komplex         |
| **Performance** | ⚠️ Overhead         | ✅ Schnell          | ✅✅ Sehr schnell   |
| **Portabilität**| ✅ Built-in         | ⚠️ pip install      | ✅ Standard        |
| **Typsicherheit**| ❌ Runtime          | ✅ Compile-Zeit     | ✅ Compile-Zeit    |
| **Wartbarkeit** | ✅ Gut              | ✅ Gut              | ⚠️ Aufwendig       |
| **PyPy**        | ⚠️ Langsam          | ✅ Optimiert        | ❌ Nicht verfügbar |

### 6.5    Praktische Beispiele

#### 6.5.1    System-Calls mit ctypes
```python
import ctypes
import platform

if platform.system() == 'Linux':
    libc = ctypes.CDLL('libc.so.6')

    # getpid() System-Call
    pid = libc.getpid()
    print(f'Process ID: {pid}')

    # gethostname()
    buf = ctypes.create_string_buffer(256)
    libc.gethostname(buf, 256)
    print(f'Hostname: {buf.value.decode()}')
```

#### 6.5.2    Performance-kritischer Code mit cffi
```python
# build_fast.py
from cffi import FFI

ffibuilder = FFI()

ffibuilder.cdef("""
    void fast_sum(double* data, int size, double* result);
""")

ffibuilder.set_source('_fast',
    """
    void fast_sum(double* data, int size, double* result) {
        double sum = 0.0;
        for (int i = 0; i < size; i++) {
            sum += data[i];
        }
        *result = sum;
    }
    """)

ffibuilder.compile(verbose=True)
```
```python
# usage.py
from _fast import ffi, lib
import time

# Große Daten
data = list(range(10_000_000))

# Python-Version
start = time.time()
py_sum = sum(data)
print(f'Python: {time.time() - start:.3f}s')

# C-Version
start = time.time()
c_data = ffi.new('double[]', data)
c_result = ffi.new('double*')
lib.fast_sum(c_data, len(data), c_result)
print(f'C: {time.time() - start:.3f}s')
```

#### 6.5.3    GPU-Zugriff mit ctypes (CUDA)
```python
import ctypes
import numpy as np

# CUDA Runtime laden
cuda = ctypes.CDLL('libcudart.so')

# Device Properties
prop = ctypes.c_int()
cuda.cudaGetDeviceCount(ctypes.byref(prop))
print(f'CUDA Devices: {prop.value}')
```

### 6.6    Best Practices

**✅ Verwende ctypes wenn:**
- Einfacher FFI-Zugriff nötig
- Prototyping
- Standard-Libraries (libc, etc.)
- Keine Kompilierung gewünscht

**✅ Verwende cffi wenn:**
- Performance wichtig
- PyPy-Kompatibilität
- Komplexere C-Interaktion
- Typsicherheit zur Compile-Zeit

**✅ Verwende C-API wenn:**
- Maximale Performance
- Volle Python-Kontrolle nötig
- Existierende C/C++-Codebasis
- NumPy-ähnliche Extensions

**✅ Verwende Pybind11 wenn:**
- C++ Code
- Modern C++ Features
- Header-only bevorzugt

### 6.7    Debugging C-Extensions
```python
# Mit gdb debuggen
import sys
import ctypes

# Core Dumps aktivieren
import resource
resource.setrlimit(resource.RLIMIT_CORE,
                   (resource.RLIM_INFINITY, resource.RLIM_INFINITY))

# Valgrind für Memory-Leaks
# valgrind --leak-check=full python script.py

# Logging in C-Code
lib = ctypes.CDLL('./libmylib.so')
lib.set_debug(True)
```

## 7    Rust-Integration mit PyO3

PyO3 ermöglicht nahtlose Interoperabilität zwischen Rust und Python – Performance von Rust mit Einfachheit von Python.

### Was ist PyO3?

[Offizielle Dokumentation von PyO3](https://pyo3.rs/v0.24.0/)

PyO3 ist eine Rust-Bibliothek (Crate), die es ermöglicht, Rust-Code mit Python zu verbinden. Mit PyO3 kann man:
- Rust-Module für Python schreiben (Rust-Code in Python importieren)
- Python-Code in Rust aufrufen (z. B. bestehende Python-Bibliotheken nutzen)
- Python-Objekte mit Rust interagieren lassen

PyO3 nutzt Rusts Foreign Function Interface (FFI), um eine nahtlose Interoperabilität mit Python zu ermöglichen.

**Warum Rust + Python?**

- ✅ Rust-Performance (~C++ Geschwindigkeit)
- ✅ Memory Safety (keine Segfaults)
- ✅ Moderne Sprache (Cargo, crates.io)
- ✅ Zunehmend populär (ruff, polars, pydantic-core)

**PyO3 vs. Alternativen:**

| Tool     | Sprache | Performance | Memory Safety | Komplexität |     |
| -------- | ------- | ----------- | ------------- | ----------- | --- |
| Pybind11 | C++     | ✅ Sehr hoch | ⚠️ Manuell    | Mittel      |     |
| PyO3     | Rust    | ✅ Sehr hoch | ✅ Garantiert  | Mittel      |     |
| ctypes   | C       | ✅ Hoch      | ❌ Unsicher    | Niedrig     |     |
| Cython   | Python  | ✅ Hoch      | ⚠️ Manuell    | Niedrig     |     |


### 7.1    Anwendungsfälle von PyO3

- Beschleunigung von Python-Code durch performanten Rust-Code
- Erstellung von Python-Erweiterungsmodulen
- Rust-Programme mit einer Python-API ausstatten
- Einbinden von Python-Bibliotheken in Rust

### Installation



### 7.2    Beispiel für ein Rust-Modul für Python

#### 7.2.1    Python-Umgebung auswählen und `maturin` installieren

```zsh
conda activate py312
```

Falls `maturin` noch nicht installiert ist:

```zsh
pip install maturin
```

#### Projekt-Struktur

```
string_sum/
├── Cargo.toml           # Rust-Konfiguration
├── pyproject.toml       # Python-Konfiguration (optional)
└── src/
    └── lib.rs           # Rust-Code
```

#### 7.2.2    Leeren Ordner für die Rust-Bibliothek erstellen

```zsh
mkdir string_sum
```

... und in den Ordner wechseln:

```zsh
cd string_sum
```

#### 7.2.3    `maturin` ausführen um das Projekt zu initialisieren

```
maturin init
```

`pyo3` aus der Liste auswählen

#### 7.2.4    `cargo/config.toml`anpassen
```toml
[build]
target-dir = '/Users/cgroening/Downloads/cargo_target/notes'
```
#### 7.2.5    `cargo.toml` anpassen
```toml
[package]
name = 'string_sum'
version = '0.1.0'
edition = '2021'

[lib]
# The name of the native library. This is the name which will
# be used in Python to import the library (i.e. `import string_sum`).
# If you change this, you must also change the name of the
# `#[pymodule]` in `src/lib.rs`.
name = 'string_sum'

# 'cdylib' is necessary to produce a shared library for Python to import from.
# Downstream Rust code (including code in `bin/`, `examples/`, and `tests/`) will not be able to `use string_sum;` unless the 'rlib' or
# 'lib' crate type is also included, e.g.:
# crate-type = ['cdylib', 'rlib']
crate-type = ['cdylib']

[dependencies]
pyo3 = { version = '0.24.0', features = ['extension-module'] }
```

#### 7.2.6    Code der Datei `lib.rs`

```rust
use pyo3::prelude::*;

/// Formats the sum of two numbers as string
#[pyfunction]
fn sum_as_string(a: usize, b: usize) -> PyResult<String> {
    Ok((a + b).to_string())
}

/// A Python module implemented in Rust. The name of this function must match the `lib.name` setting in the `Cargo.toml`, else Python will not be able to import the module.
#[pymodule]
fn string_sum(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(sum_as_string, m)?)?;
    Ok(())
}
```

> [!warning] Leistungstest mit vielen Iterationen
> Den Leistungsunterschied zwischen Rust und Python kann man vereinfacht testen, indem man eine Aktion durch eine Schleife viele Millionen Mal wiederholt. Rusts Compiler (`rustc`) ist jedoch extrem aggressiv in der Optimierung. Falls das Ergebnis nicht wirklich genutzt wird, erkennt der Compiler, dass die Berechnung nutzlos ist und eliminiert die gesamte Schleife (Dead Code Elimination).
>
> Um diese Optimierung zu umgehen, kann man die Funktion `black_box()` aus `std::hint` nutzen, um sicherzustellen, dass der Wert wirklich berechnet wird.

**Beispiel für `black_box()`:**

```rust
// ...
#use std::hint::black_box;
// ...

#[pyfunction]
fn sum_as_string(a: usize, b: usize) -> PyResult<String> {
    let mut sum = 0;
    for _ in 0..100_000_000 {
        sum += a + b;
    }
    black_box(sum);  // Optimierung verhindern
    Ok(format!('{}', sum))
}
// ...
```

#### 7.2.7    Kompilieren der Bibliothek

```zsh
maturin develop
```

Wenn Änderungen am Rust-Code gemacht werden, muss anschließend `maturin develop` erneut ausgeführt werden, damit sie wirksam sind.

Das Modul wird direkt in die ausgewählte Python-Umgebung installiert, sodass es wie folgt genutzt werden kann:

```python
import string_sum
string_sum.sum_as_string(1, 2)
```

### Vergleich der Leistung

**Performance-Vergleich:**
```python
# Python-Version
def sum_as_string_py(a, b):
    total = 0
    for _ in range(100_000_000):
        total += a + b
    return str(total)

# Rust-Version via PyO3 (siehe oben)
```

**Benchmark:**
```python
import time
import string_sum

# Rust
start = time.time()
result = string_sum.sum_as_string(5, 3)
print(f'Rust: {time.time() - start:.2f}s')

# Python
start = time.time()
result = sum_as_string_py(5, 3)
print(f'Python: {time.time() - start:.2f}s')

# Typisches Ergebnis:
# Rust: 0.15s
# Python: 4.8s
# → ~32x schneller!
```

### 8.7 Fortgeschrittene Features

#### 8.7.1 Python-Klassen in Rust
```rust
use pyo3::prelude::*;

#[pyclass]
struct Counter {
    count: i32,
}

#[pymethods]
impl Counter {
    #[new]
    fn new() -> Self {
        Counter { count: 0 }
    }

    fn increment(&mut self) {
        self.count += 1;
    }

    fn get(&self) -> i32 {
        self.count
    }
}

#[pymodule]
fn my_module(_py: Python, m: &PyModule) -> PyResult<()> {
    m.add_class::<Counter>()?;
    Ok(())
}
```

**Python-Verwendung:**
```python
from my_module import Counter

c = Counter()
c.increment()
print(c.get())  # 1
```

#### 8.7.2 NumPy-Integration
```toml
# Cargo.toml
[dependencies]
pyo3 = { version = '0.24.0', features = ['extension-module'] }
numpy = '0.24.0'
```
```rust
use numpy::PyArray1;
use pyo3::prelude::*;

#[pyfunction]
fn sum_array(arr: &PyArray1<f64>) -> PyResult<f64> {
    let slice = unsafe { arr.as_slice()? };
    Ok(slice.iter().sum())
}
```

#### 8.7.3 Python aus Rust aufrufen
```rust
use pyo3::prelude::*;

fn call_python_function() -> PyResult<()> {
    Python::with_gil(|py| {
        // Python-Code ausführen
        let code = 'print('Hello from Python!')';
        py.run(code, None, None)?;

        // Python-Modul importieren
        let json = py.import('json')?;
        let dumps = json.getattr('dumps')?;
        let result = dumps.call1(('{\'key\': \'value\'}',))?;

        println!('JSON: {}', result);
        Ok(())
    })
}
```

### 8.8 Fehlerbehandlung
```rust
use pyo3::exceptions::PyValueError;
use pyo3::prelude::*;

#[pyfunction]
fn divide(a: f64, b: f64) -> PyResult<f64> {
    if b == 0.0 {
        Err(PyValueError::new_err('Division by zero'))
    } else {
        Ok(a / b)
    }
}
```

**In Python:**
```python
try:
    result = my_module.divide(10, 0)
except ValueError as e:
    print(f'Error: {e}')
```

### 8.9 Distribution

#### 8.9.1 Wheel bauen
```bash
# Für aktuelle Platform
maturin build --release

# Cross-compilation für mehrere Platforms
maturin build --release --target x86_64-unknown-linux-gnu
maturin build --release --target aarch64-apple-darwin

# Universal wheel (wenn möglich)
maturin build --release --universal2
```

#### 8.9.2 PyPI veröffentlichen
```bash
# Testweise
maturin publish --repository testpypi

# Production
maturin publish
```

#### 8.9.3 pyproject.toml
```toml
[build-system]
requires = ['maturin>=1.0,<2.0']
build-backend = 'maturin'

[project]
name = 'string_sum'
version = '0.1.0'
requires-python = '>=3.8'
classifiers = [
    'Programming Language :: Rust',
    'Programming Language :: Python :: Implementation :: CPython',
]
```

### 8.10 Bekannte PyO3-Projekte

**Production Use Cases:**
- **ruff**: Python Linter (1000x schneller als pylint)
- **polars**: DataFrame-Bibliothek (schneller als pandas)
- **pydantic-core**: Validierung für pydantic v2
- **cryptography**: Kryptografie-Primitiven
- **tantivy-py**: Full-text Search Engine
- **tokenizers** (Hugging Face): NLP Tokenization

### 8.11 Vergleich: PyO3 vs. Pybind11

| Aspekt           | PyO3 (Rust)        | Pybind11 (C++)     |
| ---------------- | ------------------ | ------------------ |
| Sprache          | Rust               | C++                |
| Memory Safety    | ✅ Garantiert      | ⚠️ Manuell         |
| Performance      | ✅✅ Sehr hoch     | ✅✅ Sehr hoch     |
| Build-Tool       | maturin, Cargo     | CMake, setuptools  |
| Learning Curve   | ⚠️ Rust-Kenntnisse | ⚠️ C++-Kenntnisse  |
| Ökosystem        | crates.io          | vcpkg, conan       |
| Async Support    | ✅ Tokio           | ⚠️ Komplex         |

### 8.12 Best Practices

**✅ DO:**
- Nutze `maturin develop --release` für Benchmarks
- Verwende `black_box()` für realistische Performance-Tests
- Nutze Rust's Ownership für Memory-Safety
- Profile mit `cargo flamegraph`
- Verwende NumPy-Integration für Array-Operationen
- Teste auf mehreren Platforms (CI/CD)

**❌ DON'T:**
- Python GIL ignorieren (bei Multi-Threading)
- Zu kleine Funktionen (FFI-Overhead)
- Komplexe Python-Objekte ständig konvertieren
- Rust-Panics ungefangen lassen (werden zu Python-Exceptions)

### 8.13 Troubleshooting

**Problem: 'ImportError: DLL load failed'**
```bash
# Windows: Visual C++ Redistributables fehlen
# Lösung: Installiere VC++ Runtime

# Linux: fehlende Shared Libraries
ldd target/release/libmy_module.so
```

**Problem: GIL-Deadlocks**
```rust
// ❌ Kann deadlocken
fn bad_example(py: Python) -> PyResult<()> {
    let data = some_rust_work();
    // Noch im GIL-Lock!
    do_more_work(data);
    Ok(())
}

// ✅ GIL freigeben wenn möglich
fn good_example(py: Python) -> PyResult<()> {
    py.allow_threads(|| {
        some_rust_work()  // Ohne GIL!
    });
    Ok(())
}
```

### Zusammenfassung

**Kernprinzip:** PyO3 kombiniert Rust's Performance und Safety mit Python's Einfachheit. Ideal für moderne, performance-kritische Python-Extensions.

**Wann PyO3 verwenden:**
- ✅ CPU-intensive Berechnungen
- ✅ Memory-Safety wichtig
- ✅ Moderne Codebase
- ✅ Rust-Team vorhanden
- ✅ Async/Concurrent Workloads

**Wann Alternativen:**
- Pybind11: Existierende C++-Codebase
- Cython: Python-Entwickler, graduelle Optimierung
- NumPy/Numba: Wissenschaftliches Computing
- ctypes: Einfache C-Library-Anbindung

**Development Workflow:**

```bash
# 1. Code schreiben (src/lib.rs)

# 2. Build & Install (Development)
maturin develop

# 3. In Python testen
python -c 'import string_sum; print(string_sum.sum_as_string(1, 2))'

# 4. Release Build (optimiert)
maturin develop --release

# 5. Wheel für Distribution
maturin build --release
```

#### 7.3    Vergleich

| Tool         | Use Case                          | Complexity | Performance |
| ------------ | --------------------------------- | ---------- | ----------- |
| ctypes       | Quick FFI, System Libs            | Low        | Medium      |
| cffi         | Modern FFI, PyPy-compatible       | Medium     | High        |
| Python C-API | Full control, NumPy-like          | High       | Very High   |
| Pybind11     | C++ Integration                   | Medium     | Very High   |
| Cython       | Python-like, gradual optimization | Low-Medium | High        |

**Kernprinzip:** Wähle ctypes für einfache FFI-Calls, cffi für moderne Performance-kritische Anwendungen, und C-API/Pybind11 für maximale Kontrolle. Cython bleibt die einfachste Option für Python-Entwickler, die Performance brauchen.



## 8    Vergleich: Python Performance & Extension Tools

| Tool         | Sprache    | Anwendungsfall                           | Komplexität | Performance  | Speichersicherheit | Build-Zeit | Lernkurve      | PyPy-Support |
| ------------ | ---------- | ---------------------------------------- | ----------- | ------------ | ------------------ | ---------- | -------------- | ------------ |
| **ctypes**   | C          | Schneller FFI, System-Libs               | Niedrig     | Mittel       | ❌ Unsicher        | Keine      | ✅ Einfach     | ⚠️ Langsam   |
| **cffi**     | C          | Modern FFI, PyPy-kompatibel              | Mittel      | Hoch         | ⚠️ Manuell         | Schnell    | ✅ Einfach     | ✅ Schnell   |
| **Python C-API** | C      | Volle Kontrolle, NumPy-ähnlich           | Hoch        | Sehr hoch    | ❌ Unsicher        | Mittel     | ❌ Schwer      | ❌ Nein      |
| **Pybind11** | C++        | C++-Integration, modern                  | Mittel      | Sehr hoch    | ⚠️ Manuell         | Langsam    | ⚠️ Mittel      | ❌ Nein      |
| **PyO3**     | Rust       | Modern, sicher, performant               | Mittel      | Sehr hoch    | ✅ Sicher          | Mittel     | ⚠️ Mittel      | ❌ Nein      |
| **Cython**   | Python+C   | Python-ähnlich, graduelle Optimierung    | Niedrig-Mittel | Hoch      | ⚠️ Manuell         | Mittel     | ✅ Einfach     | ❌ Nein      |
| **Numba**    | Python     | JIT, NumPy-fokussiert                    | Niedrig     | Sehr hoch    | ✅ Sicher          | Keine (JIT)| ✅ Einfach     | ❌ Nein      |
| **Mypyc**    | Python     | Typisiertes Python → C                   | Niedrig     | Hoch         | ✅ Sicher          | Mittel     | ✅ Einfach     | ❌ Nein      |
| **PyPy**     | Python     | JIT für reines Python                    | Keine       | Sehr hoch    | ✅ Sicher          | Keine (JIT)| ✅ Keine       | ✅ Nativ     |
| **Nuitka**   | Python     | Python → C Compiler                      | Niedrig     | Hoch         | ✅ Sicher          | Langsam    | ✅ Einfach     | ❌ Nein      |

### 8.1    Legende

**Komplexität:**
- Niedrig: Einfach zu verwenden, wenig Boilerplate
- Mittel: Erfordert Setup und Verständnis
- Hoch: Tiefes Verständnis von Internals nötig

**Performance:**
- Mittel: 2-5x schneller als CPython
- Hoch: 5-20x schneller
- Sehr hoch: 20-100x+ schneller (bei geeigneten Workloads)

**Speichersicherheit:**
- ✅ Sicher: Compiler garantiert Speichersicherheit
- ⚠️ Manuell: Entwickler verantwortlich
- ❌ Unsicher: Leicht Fehler zu machen

**Build-Zeit:**
- Keine: Keine Kompilierung (JIT oder reines Python)
- Schnell: < 1 Sekunde
- Mittel: 1-10 Sekunden
- Langsam: 10+ Sekunden

**Lernkurve:**
- ✅ Einfach: Python-Kenntnisse ausreichend
- ⚠️ Mittel: Neue Sprache/Konzepte lernen
- ❌ Schwer: Tiefe C/C++-Kenntnisse + Python C-API

**PyPy-Support:**
- ✅ Schnell/Nativ: Optimiert für PyPy
- ⚠️ Langsam: Funktioniert, aber langsamer
- ❌ Nein: Nicht kompatibel

### 8.2    Erweiterte Vergleichskriterien

| Tool         | Geeignet für                       | Vermeiden bei                     | Ökosystem       | Async-Support |
| ------------ | ---------------------------------- | --------------------------------- | --------------- | ------------- |
| **ctypes**   | System-Libs, Prototyping           | Komplexe Interaktionen            | Standard-Lib    | N/A           |
| **cffi**     | Moderne C-Libs, PyPy               | Einfache Aufgaben (übertrieben)   | PyPI            | N/A           |
| **Python C-API** | NumPy-ähnliche Extensions      | Einfache Optimierungen            | Nur CPython     | Komplex       |
| **Pybind11** | Moderner C++-Code                  | Reiner C-Code                     | Header-only     | Komplex       |
| **PyO3**     | Moderne Rust-Integration           | Einfache Aufgaben                 | crates.io       | ✅ Tokio      |
| **Cython**   | Graduelle Optimierung              | Reine Python-Alternativen         | PyPI            | Eingeschränkt |
| **Numba**    | NumPy-Arrays, Schleifen            | String-Ops, komplexe Objekte      | Conda/PyPI      | Eingeschränkt |
| **Mypyc**    | Typisiertes Python beschleunigen   | Dynamisches Python                | MyPy-Ökosystem  | Eingeschränkt |
| **PyPy**     | Lang laufendes reines Python       | Kurze Scripts, C-Extensions       | PyPI (begrenzt) | ✅ Nativ      |
| **Nuitka**   | Ganzes Programm optimieren         | Entwicklung (langsame Kompilierung)| Standalone     | Natives Python|

### 8.3    Entscheidungshilfe

**Szenario: Numerische Berechnungen mit Arrays**
→ **Numba** (einfachste Option) oder **Cython** (volle Kontrolle)

**Szenario: Vorhandene C-Bibliothek einbinden**
→ **cffi** (modern) oder **ctypes** (schnell & einfach)

**Szenario: Vorhandene C++-Codebasis**
→ **Pybind11**

**Szenario: Moderne, sichere Extension**
→ **PyO3** (Rust) oder **Pybind11** (C++)

**Szenario: Python-Code beschleunigen ohne neue Sprache**
→ **PyPy** (reines Python) oder **Numba** (NumPy-fokussiert)

**Szenario: Typisiertes Python zu nativem Code**
→ **Mypyc**

**Szenario: Python + C Hybrid**
→ **Cython**

**Szenario: Maximale Performance, volle Kontrolle**
→ **Python C-API** oder **PyO3** (mit Speichersicherheit)

**Szenario: Distribution als Binary**
→ **Nuitka** (kompiliert) oder **PyInstaller** (bündelt)
