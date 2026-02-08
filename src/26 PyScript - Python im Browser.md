## 1    PyScript / Python im Browser

PyScript ermöglicht es, Python-Code direkt im Browser auszuführen – ohne Server-Backend. Es basiert auf Pyodide (CPython kompiliert zu WebAssembly).

### 1.1    Was ist PyScript?

PyScript ist ein Framework von Anaconda, das Python im Browser lauffähig macht:

- **Kein Server nötig**: Python läuft komplett client-seitig
- **WebAssembly-basiert**: Nutzt Pyodide (CPython → WASM)
- **HTML-Integration**: Python-Code direkt in HTML einbetten
- **Pakete verfügbar**: NumPy, Pandas, Matplotlib, Scikit-learn, etc.

**Offizielle Website:** https://pyscript.net

### 1.2    Erste Schritte

#### 1.2.1    Minimales Beispiel
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PyScript Demo</title>
    
    <!-- PyScript einbinden -->
    <link rel="stylesheet" href="https://pyscript.net/latest/pyscript.css" />
    <script defer src="https://pyscript.net/latest/pyscript.js"></script>
</head>
<body>
    <h1>Hello from PyScript!</h1>
    
    <!-- Python-Code ausführen -->
    <py-script>
        print("Hello, World!")
        print(f"2 + 2 = {2 + 2}")
    </py-script>
</body>
</html>
```

#### 1.2.2    Output anzeigen
```html
<body>
    <h1>Calculator</h1>
    
    <div id="output"></div>
    
    <py-script>
        from pyscript import display
        
        result = 10 * 5
        display(f"10 × 5 = {result}", target="output")
    </py-script>
</body>
```

### 1.3    Python-Pakete verwenden

#### 1.3.1    Pakete deklarieren
```html
<head>
    <script defer src="https://pyscript.net/latest/pyscript.js"></script>
    
    <!-- Pakete konfigurieren -->
    <py-config>
        packages = ["numpy", "pandas", "matplotlib"]
    </py-config>
</head>

<body>
    <py-script>
        import numpy as np
        import pandas as pd
        
        # NumPy Array
        arr = np.array([1, 2, 3, 4, 5])
        print(f"Mean: {np.mean(arr)}")
        
        # Pandas DataFrame
        df = pd.DataFrame({
            'A': [1, 2, 3],
            'B': [4, 5, 6]
        })
        display(df)
    </py-script>
</body>
```

#### 1.3.2    Verfügbare Pakete

PyScript/Pyodide unterstützt viele populäre Pakete:

**Wissenschaftlich:**
- NumPy, SciPy, Pandas
- Matplotlib, Plotly
- Scikit-learn
- SymPy

**Web/Utility:**
- Requests (pyodide-http)
- BeautifulSoup
- Pillow
- PyYAML

**Vollständige Liste:** https://pyodide.org/en/stable/usage/packages-in-pyodide.html

### 1.4    DOM-Manipulation

#### 1.4.1    JavaScript-Interoperabilität
```html
<body>
    <button id="myButton">Click Me!</button>
    <div id="result"></div>
    
    <py-script>
        from pyscript import document
        
        def button_click(event):
            result_div = document.querySelector("#result")
            result_div.innerText = "Button was clicked!"
        
        # Event Listener
        button = document.querySelector("#myButton")
        button.addEventListener("click", button_click)
    </py-script>
</body>
```

#### 1.4.2    HTML-Elemente erstellen
```html
<body>
    <div id="container"></div>
    
    <py-script>
        from pyscript import document
        
        container = document.querySelector("#container")
        
        # Neues Element erstellen
        new_div = document.createElement("div")
        new_div.innerText = "Created with Python!"
        new_div.style.color = "blue"
        
        container.appendChild(new_div)
    </py-script>
</body>
```

### 1.5    Interaktive Anwendungen

#### 1.5.1    Eingabefelder verarbeiten
```html
<body>
    <input type="text" id="nameInput" placeholder="Enter your name">
    <button id="greetBtn">Greet</button>
    <div id="greeting"></div>
    
    <py-script>
        from pyscript import document
        
        def greet(event):
            name_input = document.querySelector("#nameInput")
            greeting_div = document.querySelector("#greeting")
            
            name = name_input.value
            greeting_div.innerText = f"Hello, {name}!"
        
        btn = document.querySelector("#greetBtn")
        btn.addEventListener("click", greet)
    </py-script>
</body>
```

#### 1.5.2    Formular mit Validierung
```html
<body>
    <form id="myForm">
        <input type="number" id="num1" placeholder="Number 1">
        <input type="number" id="num2" placeholder="Number 2">
        <button type="submit">Calculate</button>
    </form>
    <div id="result"></div>
    
    <py-script>
        from pyscript import document
        
        def calculate(event):
            event.preventDefault()
            
            num1 = float(document.querySelector("#num1").value or 0)
            num2 = float(document.querySelector("#num2").value or 0)
            
            result = num1 + num2
            
            result_div = document.querySelector("#result")
            result_div.innerText = f"{num1} + {num2} = {result}"
        
        form = document.querySelector("#myForm")
        form.addEventListener("submit", calculate)
    </py-script>
</body>
```

### 1.6    Datenvisualisierung

#### 1.6.1    Matplotlib im Browser
```html
<head>
    <script defer src="https://pyscript.net/latest/pyscript.js"></script>
    <py-config>
        packages = ["matplotlib", "numpy"]
    </py-config>
</head>

<body>
    <h1>Matplotlib Chart</h1>
    <div id="plot"></div>
    
    <py-script>
        import matplotlib.pyplot as plt
        import numpy as np
        from pyscript import display
        
        # Daten erstellen
        x = np.linspace(0, 2 * np.pi, 100)
        y = np.sin(x)
        
        # Plot erstellen
        fig, ax = plt.subplots()
        ax.plot(x, y)
        ax.set_title("Sine Wave")
        ax.set_xlabel("x")
        ax.set_ylabel("sin(x)")
        
        # Im Browser anzeigen
        display(fig, target="plot")
    </py-script>
</body>
```

#### 1.6.2    Interaktive Plots
```html
<body>
    <h1>Interactive Plot</h1>
    <label>Frequency: <input type="range" id="freq" min="1" max="10" value="1"></label>
    <div id="plot"></div>
    
    <py-script>
        import matplotlib.pyplot as plt
        import numpy as np
        from pyscript import document, display
        
        def update_plot(event):
            freq = int(document.querySelector("#freq").value)
            
            x = np.linspace(0, 2 * np.pi, 100)
            y = np.sin(freq * x)
            
            plt.clf()
            plt.plot(x, y)
            plt.title(f"sin({freq}x)")
            
            display(plt.gcf(), target="plot", append=False)
        
        # Initial plot
        update_plot(None)
        
        # Event Listener
        slider = document.querySelector("#freq")
        slider.addEventListener("input", update_plot)
    </py-script>
</body>
```

### 1.7    Dateien und Storage

#### 1.7.1    Dateien hochladen
```html
<body>
    <input type="file" id="fileInput" accept=".csv">
    <div id="preview"></div>
    
    <py-script>
        from pyscript import document, display
        import pandas as pd
        from io import StringIO
        
        async def handle_file(event):
            file = event.target.files.item(0)
            
            # Datei lesen
            text = await file.text()
            
            # Als Pandas DataFrame
            df = pd.read_csv(StringIO(text))
            
            display(df, target="preview")
        
        file_input = document.querySelector("#fileInput")
        file_input.addEventListener("change", handle_file)
    </py-script>
</body>
```

#### 1.7.2    localStorage verwenden
```html
<body>
    <input type="text" id="dataInput" placeholder="Enter data">
    <button id="saveBtn">Save</button>
    <button id="loadBtn">Load</button>
    <div id="output"></div>
    
    <py-script>
        from pyscript import document, window
        
        def save_data(event):
            data = document.querySelector("#dataInput").value
            window.localStorage.setItem("myData", data)
            document.querySelector("#output").innerText = "Saved!"
        
        def load_data(event):
            data = window.localStorage.getItem("myData")
            document.querySelector("#output").innerText = f"Loaded: {data}"
        
        document.querySelector("#saveBtn").addEventListener("click", save_data)
        document.querySelector("#loadBtn").addEventListener("click", load_data)
    </py-script>
</body>
```

### 1.8    HTTP-Requests
```html
<body>
    <button id="fetchBtn">Fetch Data</button>
    <div id="data"></div>
    
    <py-script>
        from pyscript import document
        import json
        from pyodide.http import pyfetch
        
        async def fetch_data(event):
            response = await pyfetch("https://api.github.com/users/python")
            data = await response.json()
            
            output = f"Name: {data['name']}\n"
            output += f"Followers: {data['followers']}"
            
            document.querySelector("#data").innerText = output
        
        btn = document.querySelector("#fetchBtn")
        btn.addEventListener("click", fetch_data)
    </py-script>
</body>
```

### 1.9    Externe Python-Dateien

#### 1.9.1    Dateien importieren
```html
<!-- index.html -->
<head>
    <script defer src="https://pyscript.net/latest/pyscript.js"></script>
    <py-config>
        [[fetch]]
        files = ["utils.py"]
    </py-config>
</head>

<body>
    <py-script>
        from utils import greet, calculate
        
        print(greet("Alice"))
        print(calculate(10, 5))
    </py-script>
</body>
```
```python
# utils.py
def greet(name):
    return f"Hello, {name}!"

def calculate(a, b):
    return a + b
```

### 1.10    Vor- und Nachteile

#### 1.10.1    Vorteile

**✅ Kein Server nötig**
- Statisches Hosting (GitHub Pages, Netlify)
- Keine Backend-Infrastruktur
- Kostenlos hostbar

**✅ Python-Ökosystem**
- NumPy, Pandas, Matplotlib
- Wissenschaftliche Bibliotheken
- Bekannte Syntax

**✅ Offline-fähig**
- Nach initialem Laden
- Progressive Web Apps möglich

**✅ Sicherheit**
- Browser-Sandbox
- Kein direkter Dateisystem-Zugriff

#### 1.10.2    Nachteile

**❌ Ladezeit**
- Initial: 5-10 Sekunden (Pyodide + Pakete)
- ~6 MB Download
- Langsam auf mobilen Geräten

**❌ Performance**
- Langsamer als natives JavaScript
- WebAssembly-Overhead
- Nicht für alle Use Cases geeignet

**❌ Eingeschränkte Pakete**
- Nicht alle Python-Pakete verfügbar
- C-Extensions müssen kompiliert sein
- Keine native System-Calls

**❌ Browser-Support**
- Moderne Browser nötig
- WebAssembly erforderlich
- IE nicht unterstützt

### 1.11    Use Cases

**✅ Gut geeignet für:**
- Datenvisualisierung
- Wissenschaftliche Demos
- Interaktive Tutorials
- Prototyping
- Bildungs-Tools
- Data Science Dashboards
- Statische Webseiten mit Python-Logik

**❌ Nicht geeignet für:**
- Performance-kritische Apps
- Große Enterprise-Anwendungen
- Real-time Anwendungen
- Mobile-First Apps
- SEO-kritische Seiten (initial render)

### 1.12    Alternativen

#### 1.12.1    Pyodide (direkt)

PyScript basiert auf Pyodide. Kann auch direkt verwendet werden:
```html
<script src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"></script>

<script type="text/javascript">
    async function main() {
        let pyodide = await loadPyodide();
        
        await pyodide.loadPackage("numpy");
        
        pyodide.runPython(`
            import numpy as np
            print(np.array([1, 2, 3]))
        `);
    }
    main();
</script>
```

**Vorteile:**
- Mehr Kontrolle
- Kleinerer Overhead
- Direkter JavaScript-Zugriff

**Nachteile:**
- Mehr Boilerplate
- Weniger Python-freundlich

#### 1.12.2    Brython

Browser-Python-Implementierung (kein WebAssembly):
```html
<script src="https://cdn.jsdelivr.net/npm/brython@3/brython.min.js"></script>

<body onload="brython()">
    <script type="text/python">
        from browser import document, alert
        
        def hello(event):
            alert("Hello from Brython!")
        
        document["myButton"].bind("click", hello)
    </script>
    
    <button id="myButton">Click</button>
</body>
```

**Vorteile:**
- Schnellerer Start
- Leichtgewichtiger

**Nachteile:**
- Weniger Pakete
- Nicht vollständig Python-kompatibel
- Langsamer bei Berechnungen

#### 1.12.3    Skulpt

Weitere Browser-Python-Alternative:
```html
<script src="http://skulpt.org/js/skulpt.min.js"></script>
<script src="http://skulpt.org/js/skulpt-stdlib.js"></script>

<script>
    function runit() {
        Sk.configure({output: console.log});
        Sk.importMainWithBody("<stdin>", false, `
print("Hello from Skulpt!")
        `);
    }
</script>
```

### 1.13    Vergleich

| Framework | Basis        | Pakete    | Performance | Ladezeit | Python-Version |
| --------- | ------------ | --------- | ----------- | -------- | -------------- |
| PyScript  | Pyodide/WASM | ✅✅ Viele | ⚠️ Mittel   | ⏱️ Lang  | 3.11           |
| Pyodide   | WASM         | ✅✅ Viele | ⚠️ Mittel   | ⏱️ Lang  | 3.11           |
| Brython   | JS           | ⚠️ Wenige | ✅ Schneller| ✅ Kurz  | 3.10           |
| Skulpt    | JS           | ❌ Minimal| ✅ Schneller| ✅ Kurz  | 2.x            |

### 1.14    Praktisches Beispiel: Todo-App
```html
<!DOCTYPE html>
<html>
<head>
    <script defer src="https://pyscript.net/latest/pyscript.js"></script>
    <style>
        .todo-item { padding: 10px; margin: 5px; border: 1px solid #ccc; }
        .done { text-decoration: line-through; opacity: 0.5; }
    </style>
</head>
<body>
    <h1>PyScript Todo App</h1>
    
    <input type="text" id="todoInput" placeholder="New todo...">
    <button id="addBtn">Add</button>
    
    <div id="todoList"></div>
    
    <py-script>
        from pyscript import document
        
        todos = []
        
        def render_todos():
            todo_list = document.querySelector("#todoList")
            todo_list.innerHTML = ""
            
            for i, todo in enumerate(todos):
                item = document.createElement("div")
                item.className = "todo-item"
                if todo['done']:
                    item.classList.add("done")
                
                item.innerText = todo['text']
                item.addEventListener("click", lambda e, idx=i: toggle_todo(idx))
                
                todo_list.appendChild(item)
        
        def add_todo(event):
            input_elem = document.querySelector("#todoInput")
            text = input_elem.value.strip()
            
            if text:
                todos.append({'text': text, 'done': False})
                input_elem.value = ""
                render_todos()
        
        def toggle_todo(index):
            todos[index]['done'] = not todos[index]['done']
            render_todos()
        
        # Event Listeners
        add_btn = document.querySelector("#addBtn")
        add_btn.addEventListener("click", add_todo)
        
        input_elem = document.querySelector("#todoInput")
        input_elem.addEventListener("keypress", 
            lambda e: add_todo(e) if e.key == "Enter" else None)
    </py-script>
</body>
</html>
```

### 1.15    Deployment

#### 1.15.1    GitHub Pages
```bash
# 1. Erstelle Repository
git init
git add .
git commit -m "Initial commit"

# 2. Push zu GitHub
git remote add origin https://github.com/username/pyscript-app.git
git push -u origin main

# 3. GitHub Pages aktivieren (Settings → Pages)
# Source: main branch

# 4. App verfügbar unter:
# https://username.github.io/pyscript-app/
```

#### 1.15.2    Netlify
```bash
# 1. netlify.toml erstellen
[build]
  publish = "."

# 2. Deploy
netlify deploy --prod
```

### 1.16    Best Practices

**✅ DO:**
- Loading-Indicator während Pyodide lädt
- Pakete nur wenn nötig laden
- Code in externe .py-Dateien auslagern
- Caching nutzen (Service Worker)
- Progressive Enhancement (JS Fallback)

**❌ DON'T:**
- Zu viele Pakete auf einmal laden
- Große Berechnungen synchron
- PyScript für SEO-kritische Seiten
- Sensitive Daten client-seitig verarbeiten
- Alte Browser erwarten

### 1.17    Zukunft von PyScript

**Entwicklungen:**
- Performance-Verbesserungen
- Kleinere Bundle-Größen
- Mehr Pakete
- Bessere Tooling
- Framework-Integration (React, Vue)

**Versionen:**
- 2023: PyScript 1.0 (stabil)
- 2024: Verbesserte Performance, kleinere Bundles
- Zukunft: Native WebAssembly-Integration

### 1.18    Zusammenfassung

| Aspekt       | Bewertung                                |
| ------------ | ---------------------------------------- |
| Einstieg     | ✅ Einfach (HTML + Python)               |
| Performance  | ⚠️ Langsamer als JS, aber akzeptabel     |
| Use Cases    | Visualisierung, Demos, Prototyping       |
| Produktion   | ⚠️ Mit Vorsicht (Ladezeit beachten)      |
| Zukunft      | ✅ Aktive Entwicklung                    |

**Kernprinzip:** PyScript ermöglicht Python im Browser für Visualisierung und interaktive Demos. Ideal für statische Seiten mit wissenschaftlichen Inhalten, aber nicht als vollständiger JavaScript-Ersatz. Beachte Ladezeiten und Browser-Kompatibilität.

**Ressourcen:**
- Offizielle Docs: https://docs.pyscript.net/
- Examples: https://pyscript.net/examples/
- Pyodide: https://pyodide.org/
- Discord: https://discord.gg/pyscript