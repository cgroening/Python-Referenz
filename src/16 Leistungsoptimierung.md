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
    m.def("add", &add);
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
LLVM steht für "Low-Level Virtual Machine", ist aber heute viel mehr als das: LLVM ist eine moderne Compiler-Infrastruktur, die aus mehreren modularen Tools besteht. Viele moderne Programmiersprachen verwenden LLVM, um ihren Code in Maschinencode zu übersetzen.
>
> **Wichtigste Eigenschaften:**
> - Zwischensprache (IR): LLVM übersetzt Code zuerst in eine eigene "Intermediate Representation" (IR), die dann weiter optimiert wird.
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
libc = ctypes.CDLL("libc.so.6")
# macOS
libc = ctypes.CDLL("libc.dylib")
# Windows
libc = ctypes.CDLL("msvcrt.dll")

# C-Funktion aufrufen
libc.printf(b"Hello from C! %d\n", 42)
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
    printf("Hello, %s!\n", name);
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
lib = ctypes.CDLL("./libmylib.so")

# add-Funktion aufrufen
result = lib.add(5, 3)
print(f"5 + 3 = {result}")  # 8

# greet-Funktion mit String
lib.greet(b"Alice")  # Hello, Alice!
```

#### 6.1.3    Typen und Argumente
```python
import ctypes

lib = ctypes.CDLL("./libmylib.so")

# Rückgabetyp deklarieren
lib.add.restype = ctypes.c_int
lib.add.argtypes = [ctypes.c_int, ctypes.c_int]

result = lib.add(10, 20)
print(result)

# String-Argumente
lib.greet.argtypes = [ctypes.c_char_p]
lib.greet(b"Bob")
```

#### 6.1.4    Komplexe Datentypen
```python
import ctypes

# Struct definieren
class Point(ctypes.Structure):
    _fields_ = [
        ("x", ctypes.c_int),
        ("y", ctypes.c_int)
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
print(f"Sum: {result}")
```

#### 6.1.6    Callbacks (Python → C → Python)
```python
import ctypes

# Python-Funktion als C-Callback
@ctypes.CFUNCTYPE(ctypes.c_int, ctypes.c_int)
def callback(x):
    print(f"Callback called with {x}")
    return x * 2

# C-Funktion: int process(int (*func)(int), int value)
lib.process.argtypes = [ctypes.CFUNCTYPE(ctypes.c_int, ctypes.c_int), ctypes.c_int]
lib.process.restype = ctypes.c_int

result = lib.process(callback, 5)
print(f"Result: {result}")
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
lib = ffi.dlopen("./libmylib.so")

# Funktionen aufrufen
result = lib.add(5, 3)
print(result)  # 8

lib.greet(b"Alice")
```

#### 6.2.2    Out-of-Line Mode (Kompiliert)
```python
# build_mylib.py
from cffi import FFI

ffibuilder = FFI()

ffibuilder.cdef("""
    int add(int a, int b);
""")

ffibuilder.set_source("_mylib",
    """
    int add(int a, int b) {
        return a + b;
    }
    """)

if __name__ == "__main__":
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

lib = ffi.dlopen("./libmylib.so")

# Struct erstellen
p = ffi.new("Point *")
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

lib = ffi.dlopen("./libmylib.so")

# Python-Callback
@ffi.def_extern()
def my_callback(x):
    return x * 2

callback = ffi.callback("int(int)", my_callback)
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
    if (!PyArg_ParseTuple(args, "ii", &a, &b))
        return NULL;
    
    return PyLong_FromLong(a + b);
}

static PyMethodDef ModuleMethods[] = {
    {"add", add, METH_VARARGS, "Add two integers"},
    {NULL, NULL, 0, NULL}
};

static struct PyModuleDef mymodule = {
    PyModuleDef_HEAD_INIT,
    "mymodule",
    "Example module",
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
    print(f"Process ID: {pid}")
    
    # gethostname()
    buf = ctypes.create_string_buffer(256)
    libc.gethostname(buf, 256)
    print(f"Hostname: {buf.value.decode()}")
```

#### 6.5.2    Performance-kritischer Code mit cffi
```python
# build_fast.py
from cffi import FFI

ffibuilder = FFI()

ffibuilder.cdef("""
    void fast_sum(double* data, int size, double* result);
""")

ffibuilder.set_source("_fast",
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
print(f"Python: {time.time() - start:.3f}s")

# C-Version
start = time.time()
c_data = ffi.new("double[]", data)
c_result = ffi.new("double*")
lib.fast_sum(c_data, len(data), c_result)
print(f"C: {time.time() - start:.3f}s")
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
print(f"CUDA Devices: {prop.value}")
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
lib = ctypes.CDLL("./libmylib.so")
lib.set_debug(True)
```

### 6.8    Zusammenfassung

| Tool         | Use Case                          | Complexity | Performance |
| ------------ | --------------------------------- | ---------- | ----------- |
| ctypes       | Quick FFI, System Libs            | Low        | Medium      |
| cffi         | Modern FFI, PyPy-compatible       | Medium     | High        |
| Python C-API | Full control, NumPy-like          | High       | Very High   |
| Pybind11     | C++ Integration                   | Medium     | Very High   |
| Cython       | Python-like, gradual optimization | Low-Medium | High        |

**Kernprinzip:** Wähle ctypes für einfache FFI-Calls, cffi für moderne Performance-kritische Anwendungen, und C-API/Pybind11 für maximale Kontrolle. Cython bleibt die einfachste Option für Python-Entwickler, die Performance brauchen.