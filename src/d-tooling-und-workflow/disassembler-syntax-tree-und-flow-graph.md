# Disassembler, Syntax Tree und Flow Graph

Python bietet mächtige Werkzeuge zur Analyse und Transformation von Code, insbesondere auf niedriger Ebene. In dieser Referenz betrachten wir drei wichtige Konzepte: den Disassembler, den Syntaxbaum (AST) und den Kontrollflussgraphen.

## 1    Disassembler mit `dis`

Das Modul `dis` zeigt die Bytecode-Instruktionen, die vom Python-Interpreter ausgeführt werden. Es ist nützlich zur Fehleranalyse, Optimierung und beim Verständnis, wie Python intern arbeitet.

### 1.1    Beispiel: Disassemblieren einer Funktion

```python
import dis

def greet(name):
    return 'Hello ' + name

# Ausgabe des Bytecodes
dis.dis(greet)
```

**Erklärung**:

- `dis.dis()` zeigt die Bytecode-Instruktionen.
- Man sieht z. B. `LOAD_CONST`, `LOAD_FAST`, `BINARY_ADD`, `RETURN_VALUE`.

## 2    Syntax Tree (AST – Abstract Syntax Tree)

Das `ast`-Modul ermöglicht es, Python-Code als abstrakten Syntaxbaum zu analysieren und zu manipulieren. So kann man z. B. Programme transformieren oder statisch untersuchen.

### 2.1    Beispiel: AST eines Ausdrucks erzeugen

```python
import ast

source_code = 'x + 2'
tree = ast.parse(source_code, mode='eval')

# AST-Struktur anzeigen
print(ast.dump(tree, indent=4))
```

**Erklärung**:

- `ast.parse()` erzeugt den Syntaxbaum.
- `ast.dump()` gibt ihn als lesbare Struktur aus.
- Ideal zur statischen Codeanalyse oder Code-Transformation.

### 2.2    Beispiel: AST eines Moduls mit Funktion

```python
code = '''
def square(x):
    return x * x
'''

parsed = ast.parse(code)
print(ast.dump(parsed, indent=4))
```

## 3    AST Traversierung mit `NodeVisitor`

Man kann mit `ast.NodeVisitor` eigene Besucher-Klassen schreiben, um gezielt über den Baum zu laufen.

```python
class FunctionLister(ast.NodeVisitor):
    def visit_FunctionDef(self, node):
        print(f'Found function: {node.name}')
        self.generic_visit(node)

tree = ast.parse('''
def hello(): pass
def goodbye(): pass
''')

FunctionLister().visit(tree)
```

**Erklärung**:

- `visit_FunctionDef` wird bei jeder Funktionsdefinition aufgerufen.
- `generic_visit()` sorgt für rekursive Durchläufe.

## 4    AST-Modifikation mit `NodeTransformer`

Mit `NodeTransformer` kann man den AST direkt verändern:

```python
class ConstFolder(ast.NodeTransformer):
    def visit_BinOp(self, node):
        self.generic_visit(node)
        if (isinstance(node.left, ast.Constant) and
            isinstance(node.right, ast.Constant)):
            return ast.Constant(value=eval(compile(ast.Expression(node), '', 'eval')))
        return node

tree = ast.parse('x = 2 + 3')
new_tree = ConstFolder().visit(tree)
print(ast.dump(new_tree, indent=4))
```

**Erklärung**:

- Diese Transformation ersetzt `2 + 3` durch `5`.
- Praktisch für Optimierungen.

## 5    Flow Graph / Kontrollflussgraph

Python bietet keine Standardbibliothek für Flow-Graphs, aber man kann z. B. `bytecode`, `cfg`, oder externe Tools wie `pycfg` oder `astmonkey` verwenden.

Ein einfacher Kontrollflussgraph kann durch **manuelle Analyse** des AST oder Bytecodes entstehen.

### 5.1    Beispiel: Kontrolle über Sprungbefehle im Bytecode

```python
import dis

def conditional(x):
    if x > 0:
        return 'positive'
    else:
        return 'non-positive'

dis.dis(conditional)
```

**Erklärung**:

- Man erkennt `POP_JUMP_IF_FALSE` und entsprechende Sprungziele.
- Diese lassen sich zu einem Flow Graph zusammensetzen.

### 5.2    Tools für CFG-Visualisierung

- [`pycfg`](https://github.com/codelucas/pycfg)
- [`pyflowchart`](https://github.com/cdfmlr/pyflowchart)
- [`bytecode`](https://github.com/python/bytecode)

Diese Tools erzeugen z. B. DOT-Dateien, aus denen mit Graphviz Diagramme generiert werden können.

## 6    Fazit

| Thema        | Zweck                                               |
|--------------|-----------------------------------------------------|
| `dis`        | Analyse des Bytecodes                               |
| `ast`        | Strukturierte Analyse und Manipulation von Code     |
| Flow Graph   | Analyse von Kontrollstrukturen und Ablaufpfaden     |

Diese Werkzeuge sind besonders nützlich für Debugging, Optimierung, Sicherheitsanalysen oder eigene Python-Compiler/Interpreter-Projekte.
