# Unit-Tests mit pytest

> [!NOTE]
> **Links:**
>
> - [pytest documentation](https://docs.pytest.org/en/stable/)
> - [unittest — Unit testing framework](https://docs.python.org/3/library/unittest.html)

Ein Unit-Test prüft eine einzelne, isolierte Einheit des Codes – typischerweise eine Funktion oder Methode – auf korrektes Verhalten. Er beantwortet die Frage: "Tut diese Funktion das, was sie soll?". Dies erfolgt reproduzierbar, automatisiert und unabhängig vom Rest des Systems.

Gut geschriebene Unit-Tests sind kein nachträglicher Aufwand, sondern ein Werkzeug, das die Entwicklung beschleunigt: Sie machen Regressionsfehler sofort sichtbar, erleichtern Refactoring und dienen gleichzeitig als lebende Dokumentation des erwarteten Verhaltens.

Python bietet mit `unittest` ein eingebautes Testing-Framework direkt in der Standardbibliothek. In der Praxis hat sich jedoch `pytest` als De-facto-Standard etabliert – durch minimalen Boilerplate, ausdrucksstarke Assertions und ein mächtiges Fixture-System. Diese Anleitung verwendet `pytest` als primäres Werkzeug.

Ziel dieser Anleitung ist es, das Wissen zu vermitteln, um:

- Unit-Tests strukturiert aufzubauen und zu benennen
- Fixtures für Testvorbereitungen sauber einzusetzen
- externe Abhängigkeiten mit Mocks zu isolieren
- Testabdeckung zu messen und zu interpretieren
- Tests sinnvoll in einen Entwicklungsworkflow zu integrieren

Unit-Tests prüfen einzelne Komponenten (Funktionen, Klassen) isoliert. `pytest` ist das beliebteste Test-Framework für Python und bietet mächtige Features für produktiven Test-Code.

**Vergleich von Test-Frameworks für Python:**

| Framework                                                       | Stärken                                                                                         | Schwächen                                                               | Wann nutzen                                               |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------- |
| **[unittest](https://docs.python.org/3/library/unittest.html)** | Kein Install, vertraut für Java/JUnit-Kenner, gut für OOP-Strukturen                            | Viel Boilerplate, assertions umständlich (`assertEqual`, `assertIn`, …) | Wenn keine Abhängigkeiten erlaubt sind; legacy-Codebases  |
| **[pytest](https://docs.pytest.org/en/stable/)**                | Minimaler Boilerplate, natives `assert`, Fixtures, Plugins (coverage, mock, xdist), sehr lesbar | Drittanbieter-Abhängigkeit                                              | Standard für neue Projekte – fast immer die richtige Wahl |
| **[doctest](https://docs.python.org/3/library/doctest.html)**   | Tests direkt im Docstring, lebt nah am Code, gut für Dokumentation                              | Unübersichtlich bei komplexen Tests, kein Fixture-System                | Einfache Funktionen dokumentieren + gleichzeitig testen   |
| **[hypothesis](https://hypothesis.works)**                      | Property-based Testing – findet Edge Cases automatisch                                          | Steile Lernkurve, langsamer                                             | Algorithmen, Parser, mathematische Funktionen             |

`pytest` sollte für alles Neue eingesetzt werden, `unittest` nur wenn nötig, `doctest` ergänzend für öffentliche APIs, `hypothesis` für datenintensive Logik.

## 1    Grundlagen

Bevor Tests geschrieben werden können, braucht es eine funktionierende Umgebung und eine klare Projektstruktur – beides ist mit `pytest` schnell eingerichtet.

### 1.1    Installation und Setup

```bash
pip install pytest pytest-cov
```

**Projekt-Struktur:**

Tests werden im Ordner `tests/` abgelegt und beginnen mit `test_`.

```
myproject/
├── src/
│   ├── __init__.py
│   ├── calculator.py
│   └── user.py
├── tests/
│   ├── __init__.py
│   ├── test_calculator.py
│   └── test_user.py
└── pytest.ini
```

### 1.2    Einfacher Test

Ein Test in `pytest` ist eine einfache Python-Funktion, deren Name mit `test_` beginnt.

Das Herzstück jedes Tests ist das `assert`-Statement: Schlägt die Bedingung fehl, meldet `pytest` den Test als fehlgeschlagen und zeigt den genauen Wert, der die Erwartung verletzt hat.

`src/calculator.py`:

```python
def add(a, b):
    return a + b

def divide(a, b):
    if b == 0:
        raise ValueError('Cannot divide by zero')
    return a / b
```

`tests/test_calculator.py`:

```python
from src.calculator import add, divide
import pytest

def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
    assert add(0, 0) == 0

def test_divide():
    assert divide(10, 2) == 5
    assert divide(9, 3) == 3

def test_divide_by_zero():
    with pytest.raises(ValueError, match='Cannot divide by zero'):
        divide(10, 0)
```

**Tests ausführen:**

```bash
# Alle Tests
pytest

# Verbose Output
pytest -v

# Spezifische Datei
pytest tests/test_calculator.py

# Spezifischer Test
pytest tests/test_calculator.py::test_add

# Mit Coverage
pytest --cov=src tests/
```

Ausgabe von `pytest -v`:

```
===================== test session starts =====================
platform darwin -- Python 3.14.3, pytest-9.0.2, pluggy-1.6.0
cachedir: .pytest_cache
rootdir: [...]
collected 3 items                                             

tests/test_calculator.py::test_add PASSED               [ 33%]
tests/test_calculator.py::test_divide PASSED            [ 66%]
tests/test_calculator.py::test_divide_by_zero PASSED    [100%]

====================== 3 passed in 0.00s ======================
```

Ändert man die Zeile `assert divide(9, 3) == 3` zu `assert divide(9, 3) == 4` schlägt ein Test fehl:

```
===================== test session starts =====================
platform darwin -- Python 3.14.3, pytest-9.0.2, pluggy-1.6.0
cachedir: .pytest_cache
rootdir: [...]
collected 3 items                                             

tests/test_calculator.py::test_add PASSED               [ 33%]
tests/test_calculator.py::test_divide FAILED            [ 66%]
tests/test_calculator.py::test_divide_by_zero PASSED    [100%]

========================== FAILURES ===========================
_________________________ test_divide _________________________

    def test_divide():
        assert divide(10, 2) == 5
>       assert divide(9, 3) == 4
E       assert 3.0 == 4
E        +  where 3.0 = divide(9, 3)

tests/test_calculator.py:11: AssertionError
=================== short test summary info ===================
FAILED tests/test_calculator.py::test_divide - assert 3.0 == 4
================= 1 failed, 2 passed in 0.03s =================
```

> [!TIP]
> Tests sind selbst-dokumentierender Code. **Namen sollten so gewählt werden, dass sie Kommentare überflüssig machen.** Kommentare in Tests sind nur sinnvoll, wenn die Intention hinter einer Entscheidung nicht offensichtlich ist – nicht um zu beschreiben, was passiert.

## 2    Assertions

Assertions sind die Grundbausteine jedes Tests – sie formulieren, was nach Ausführung einer Funktion wahr sein muss. `pytest` wertet natives `assert` aus und liefert bei Fehlern detaillierte Differenzanzeigen, ohne dass spezielle Methoden wie `assertEqual` nötig sind.

### 2.1    Basis-Assertions

`pytest` unterstützt alle nativen Python-Vergleichsoperatoren direkt im `assert`. Das macht Tests intuitiv lesbar, da keine Framework-spezifische API erlernt werden muss.

```python
def test_assertions():
    # Gleichheit
    assert 1 + 1 == 2
    assert 'hello' == 'hello'

    # Ungleichheit
    assert 5 != 3

    # Boolean
    assert True
    assert not False

    # Membership
    assert 3 in [1, 2, 3]
    assert 'a' not in 'xyz'

    # Identität
    x = [1, 2]
    y = x
    assert x is y
    assert x is not [1, 2]
```

### 2.2    Erweiterte Assertions

Für Vergleiche, die mit einfachem `==` nicht funktionieren – etwa Floats oder Mengen mit Toleranzbereich – bietet pytest ergänzende Hilfsmittel wie `pytest.approx`.

```python
def test_advanced_assertions():
    # Approximation (Float-Vergleich)
    assert 0.1 + 0.2 == pytest.approx(0.3)
    assert 100 == pytest.approx(105, rel=0.1)  # 10% Toleranz

    # Listen/Sets
    assert [1, 2, 3] == [1, 2, 3]
    assert {1, 2} == {2, 1}  # Set-Reihenfolge egal

    # Dictionaries
    assert {'a': 1, 'b': 2} == {'b': 2, 'a': 1}

    # Teilmengen
    assert {'a', 'b'} <= {'a', 'b', 'c'}
```

### 2.3    Exception-Testing

Erwartet eine Funktion eine Exception unter bestimmten Bedingungen, gehört auch das Testen dieser Ausnahmen zur Spezifikation. `pytest` stellt dafür den Kontextmanager `pytest.raises` bereit.

```python
def test_exceptions():
    # Einfach
    with pytest.raises(ValueError):
        int('invalid')

    # Mit Message-Check
    with pytest.raises(ValueError, match='invalid literal'):
        int('invalid')

    # Exception-Objekt inspizieren
    with pytest.raises(ValueError) as exc_info:
        raise ValueError('Custom message')

    assert 'Custom' in str(exc_info.value)
    assert exc_info.type is ValueError
```

## 3    Fixtures

Fixtures sind wiederverwendbare Setup-Funktionen für Tests. Statt Vorbereitungslogik in jeden Test zu kopieren, wird sie einmal als Fixture definiert und dann per Parameter-Name injiziert. `pytest` erkennt die Abhängigkeit automatisch und führt die Fixture vor dem Test aus. Mit `yield` lässt sich auch Teardown-Logik sauber integrieren.

### 3.1    Basis-Fixtures

Die einfachste Fixture gibt einen Wert zurück, der mehreren Tests zur Verfügung steht – `pytest` injiziert ihn automatisch, wenn der Funktionsparameter den Fixture-Namen trägt.

```python
import pytest

# Einfache Fixture
@pytest.fixture
def sample_data():
    """Gibt Test-Daten zurück"""
    return [1, 2, 3, 4, 5]

def test_sum(sample_data):
    assert sum(sample_data) == 15

def test_length(sample_data):
    assert len(sample_data) == 5
```

### 3.2    Setup und Teardown

Sobald eine Fixture Ressourcen anlegt (Dateien, Verbindungen, temporäre Daten), muss sie diese nach dem Test auch wieder freigeben. Mit `yield` wird der Setup-Teil vom Teardown getrennt: alles vor `yield` läuft vor dem Test, alles dahinter danach.

```python
import pytest
from pathlib import Path

@pytest.fixture
def temp_file(tmp_path):
    """Erstellt temporäre Datei, löscht sie nach Test"""
    # Setup
    file_path = tmp_path / 'test.txt'
    file_path.write_text('Hello World')

    # Fixture-Wert übergeben
    yield file_path

    # Teardown (wird nach Test ausgeführt)
    if file_path.exists():
        file_path.unlink()
    print('Cleanup completed')

def test_file_content(temp_file):
    content = temp_file.read_text()
    assert content == 'Hello World'
```

### 3.3    Fixture-Scopes

Der `scope`-Parameter einer Fixture steuert, wie oft sie instanziiert wird. Standardmäßig wird jede Fixture pro Test neu erstellt (`function`). Teure Ressourcen wie Datenbankverbindungen lassen sich mit einem breiteren Scope einmalig aufbauen und mehrfach wiederverwenden.

```python
import pytest

# Function-Scope (Standard - für jeden Test neu)
@pytest.fixture(scope='function')
def function_fixture():
    print('\nSetup function fixture')
    return 'data'

# Class-Scope (einmal pro Test-Klasse)
@pytest.fixture(scope='class')
def class_fixture():
    print('\nSetup class fixture')
    return 'class data'

# Module-Scope (einmal pro Modul)
@pytest.fixture(scope='module')
def module_fixture():
    print('\nSetup module fixture')
    db = Database()
    yield db
    db.close()

# Session-Scope (einmal pro Test-Session)
@pytest.fixture(scope='session')
def session_fixture():
    print('\nSetup session fixture')
    return 'session data'
```

### 3.4    Fixture-Dependencies

Fixtures können andere Fixtures als Parameter verwenden – `pytest` löst die gesamte Abhängigkeitskette automatisch auf. So lassen sich komplexe Testumgebungen aus kleinen, wiederverwendbaren Bausteinen zusammensetzen.

```python
import pytest

@pytest.fixture
def database():
    """Simulierte Datenbank"""
    db = {'users': []}
    yield db
    db.clear()

@pytest.fixture
def user(database):
    """Benötigt database-Fixture"""
    user = {'id': 1, 'name': 'Alice'}
    database['users'].append(user)
    return user

def test_user_in_database(database, user):
    assert user in database['users']
    assert len(database['users']) == 1
```

### 3.5    Autouse-Fixtures

Mit `autouse=True` wird eine Fixture automatisch für alle Tests im Scope aktiviert, ohne dass sie explizit als Parameter angegeben werden muss. Nützlich für Querschnittsfunktionen wie das Zurücksetzen von globalem Zustand oder das Konfigurieren von Logging.

```python
import pytest

@pytest.fixture(autouse=True)
def reset_state():
    """Wird automatisch vor jedem Test ausgeführt"""
    global_state.clear()
    yield
    # Cleanup nach Test
```

### 3.6    Built-in Fixtures

`pytest` bringt mehrere Built-in Fixtures mit, die häufige Anforderungen abdecken: temporäre Verzeichnisse, Umgebungsvariablen patchen oder `stdout`/`stderr` abfangen – ohne dass dafür zusätzliche Pakete nötig sind.

```python
def test_tmp_path(tmp_path):
    """tmp_path: Temporäres Verzeichnis (pathlib.Path)"""
    file = tmp_path / 'test.txt'
    file.write_text('content')
    assert file.read_text() == 'content'

def test_tmp_path_factory(tmp_path_factory):
    """Erstellt mehrere temp Verzeichnisse"""
    dir1 = tmp_path_factory.mktemp('data1')
    dir2 = tmp_path_factory.mktemp('data2')
    assert dir1 != dir2

def test_monkeypatch(monkeypatch):
    """monkeypatch: Temporär Code ändern"""
    import os
    monkeypatch.setenv('API_KEY', 'test_key')
    assert os.environ['API_KEY'] == 'test_key'
    # Nach Test wird original wiederhergestellt

def test_capsys(capsys):
    """capsys: stdout/stderr erfassen"""
    print('Hello')
    print('World', file=sys.stderr)

    captured = capsys.readouterr()
    assert captured.out == 'Hello\n'
    assert captured.err == 'World\n'
```

## 4    Parametrized Tests

Oft soll dieselbe Logik mit verschiedenen Eingaben getestet werden. Statt den Test-Code mehrfach zu duplizieren, erlaubt `@pytest.mark.parametrize` das deklarative Definieren von Eingabe-/Erwartungspaaren. `pytest` generiert daraus eigenständige Testfälle, die einzeln ausgeführt, gefiltert und im Fehlerfall präzise identifiziert werden können.

### 4.1    Basis-Parametrize

Der Decorator `@pytest.mark.parametrize` nimmt einen String mit kommaseparierten Parameternamen und eine Liste von Werte-Tupeln. `pytest` läuft jeden Eintrag als separaten Test durch und benennt ihn anhand der Werte.

```python
import pytest

@pytest.mark.parametrize('input,expected', [
    (2, 4),
    (3, 9),
    (4, 16),
    (5, 25),
])
def test_square(input, expected):
    assert input ** 2 == expected

# Output:
# test_square[2-4] PASSED
# test_square[3-9] PASSED
# test_square[4-16] PASSED
# test_square[5-25] PASSED
```

### 4.2    Mehrere Parameter

Mehrere Parameter werden als kommaseparierter String angegeben; jedes Tupel in der Liste entspricht einem vollständigen Testfall.

```python
@pytest.mark.parametrize('a,b,expected', [
    (2, 3, 5),
    (10, 5, 15),
    (-1, 1, 0),
    (0, 0, 0),
])
def test_add(a, b, expected):
    assert a + b == expected
```

### 4.3    IDs für lesbare Test-Namen

Standardmäßig verwendet `pytest` die Parameterwerte als Test-ID, was bei langen oder generischen Werten schwer lesbar wird. Mit `ids` lassen sich sprechende Namen zuweisen.

```python
@pytest.mark.parametrize('input,expected', [
    (2, 4),
    (3, 9),
    (5, 25),
], ids=['two', 'three', 'five'])
def test_square(input, expected):
    assert input ** 2 == expected

# Output:
# test_square[two] PASSED
# test_square[three] PASSED
# test_square[five] PASSED
```

### 4.4    Parametrize mit pytest.param

`pytest.param` ermöglicht es, einzelnen Parametersätzen Marks direkt mitzugeben – etwa um einen bestimmten Fall zu überspringen oder als erwarteten Fehler zu markieren, ohne den gesamten Test zu betreffen.

```python
@pytest.mark.parametrize('input,expected', [
    (2, 4),
    pytest.param(0, 0, marks=pytest.mark.skip),
    pytest.param(3, 9, marks=pytest.mark.xfail),
    (4, 16),
])
def test_square(input, expected):
    assert input ** 2 == expected
```

### 4.5    Verschachtelte Parametrize

Werden mehrere `@pytest.mark.parametrize`-Decorators gestapelt, bildet `pytest` das kartesische Produkt aller Kombinationen – jede Kombination wird zu einem eigenen Testfall.

```python
@pytest.mark.parametrize('x', [1, 2, 3])
@pytest.mark.parametrize('y', [10, 20])
def test_multiply(x, y):
    result = x * y
    assert result == x * y

# Generiert 6 Tests: (1,10), (1,20), (2,10), (2,20), (3,10), (3,20)
```

### 4.6    Parametrize mit Fixtures

ixtures können ebenfalls parametrisiert werden, indem `params` im `@pytest.fixture`-Decorator angegeben wird. Jeder Wert in `params` wird über `request.param` zugänglich gemacht – alle Tests, die diese Fixture verwenden, werden automatisch für jeden Wert einmal ausgeführt.

```python
@pytest.fixture(params=[1, 2, 3])
def number(request):
    return request.param

def test_positive(number):
    assert number > 0

# Generiert 3 Tests mit number=1, 2, 3
```

## 5    Marks und Test-Organisation

Marks sind Metadaten, die einzelnen Tests oder ganzen Klassen angehängt werden. Sie ermöglichen es, Tests zu kategorisieren, gezielt auszuführen oder unter bestimmten Bedingungen zu überspringen – ohne den Test-Code selbst zu verändern.

### 5.1    Basis-Marks

`pytest` bringt einige eingebaute Marks mit, die häufige Anforderungen direkt abdecken: Tests überspringen, plattformabhängige Ausführung steuern oder bekannte Fehler dokumentieren, ohne den Test zu entfernen.

```python
import pytest

@pytest.mark.skip(reason='Not implemented yet')
def test_feature():
    pass

@pytest.mark.skipif(sys.platform == 'win32', reason='Unix only')
def test_unix_feature():
    pass

@pytest.mark.xfail(reason='Known bug #123')
def test_buggy_feature():
    assert False

@pytest.mark.slow
def test_expensive_operation():
    # Langer Test
    pass
```

**Tests nach Marks ausführen:**

```bash
# Nur slow Tests
pytest -m slow

# Alles außer slow
pytest -m 'not slow'

# Kombinationen
pytest -m 'slow and database'
pytest -m 'slow or database'
```

### 5.2    Custom Marks

Eigene Marks müssen in `pytest.ini` registriert werden, damit `pytest` sie erkennt und bei `--strict-markers` keine Warnung wirft. Die Registrierung dient gleichzeitig als Dokumentation der vorhandenen Test-Kategorien.

```python
# pytest.ini
[pytest]
markers =
    slow: marks tests as slow
    integration: integration tests
    unit: unit tests
    api: API tests

# tests/test_app.py
@pytest.mark.unit
def test_function():
    pass

@pytest.mark.integration
@pytest.mark.slow
def test_full_workflow():
    pass
```

### 5.3    Test-Klassen

Tests lassen sich in Klassen gruppieren, um zusammengehörige Funktionalität zu bündeln. Eine `autouse`-Fixture innerhalb der Klasse übernimmt das Setup für alle Methoden, ohne dass Vererbung von `unittest.TestCase` nötig ist.

```python
class TestCalculator:
    @pytest.fixture(autouse=True)
    def setup(self):
        """Wird vor jedem Test in der Klasse ausgeführt"""
        self.calc = Calculator()

    def test_add(self):
        assert self.calc.add(2, 3) == 5

    def test_subtract(self):
        assert self.calc.subtract(5, 3) == 2

    @pytest.mark.parametrize('a,b,expected', [
        (10, 2, 5),
        (20, 4, 5),
    ])
    def test_divide(self, a, b, expected):
        assert self.calc.divide(a, b) == expected
```

## 6    Mocking

Mocking ersetzt echte Objekte durch kontrollierte Fakes. Unit-Tests sollen isoliert laufen – ohne Netzwerk, Datenbank oder Dateisystem. Mit Mocks werden externe Abhängigkeiten durch steuerbare Platzhalter ersetzt, die definierte Rückgabewerte liefern und überprüfbar machen, wie der getestete Code mit ihnen interagiert.

### 6.1    unittest.mock: Grundlagen

`unittest.mock` ist Teil der Standardbibliothek und stellt die Kernklassen `Mock` und `MagicMock` bereit. Ein `Mock`-Objekt nimmt jeden Attributzugriff und jeden Aufruf entgegen und zeichnet ihn auf – so lässt sich nachher prüfen, ob und wie eine Abhängigkeit aufgerufen wurde.

```python
from unittest.mock import Mock, MagicMock, patch

def test_mock_basics():
    # Mock erstellen
    mock = Mock()

    # Rückgabewert setzen
    mock.return_value = 42
    assert mock() == 42

    # Aufrufe prüfen
    mock()
    mock.assert_called()
    mock.assert_called_once()

    # Mit Argumenten
    mock(1, 2, key='value')
    mock.assert_called_with(1, 2, key='value')
```

### 6.2    Funktionen patchen

Mit `patch` als Kontextmanager wird eine Funktion oder ein Objekt temporär durch einen Mock ersetzt – nur für die Dauer des `with`-Blocks. Danach wird automatisch das Original wiederhergestellt.

```python
from unittest.mock import patch
import requests

def get_user_data(user_id):
    """Holt Daten von API"""
    response = requests.get(f'https://api.example.com/users/{user_id}')
    return response.json()

def test_get_user_data():
    # requests.get mocken
    with patch('requests.get') as mock_get:
        # Mock-Response konfigurieren
        mock_get.return_value.json.return_value = {
            'id': 1,
            'name': 'Alice'
        }

        result = get_user_data(1)

        assert result['name'] == 'Alice'
        mock_get.assert_called_once_with('https://api.example.com/users/1')
```

### 6.3    Decorator-Style Patching

Alternativ zum Kontextmanager kann `@patch` als Decorator verwendet werden. Der Mock wird dann als zusätzlicher Parameter an die Testfunktion übergeben.

```python
@patch('requests.get')
def test_api_call(mock_get):
    mock_get.return_value.status_code = 200
    mock_get.return_value.json.return_value = {'data': 'test'}

    result = get_user_data(1)
    assert result == {'data': 'test'}
```

### 6.4    Mehrere Patches

Mehrere `@patch`-Decorators werden von innen nach außen angewendet, die Reihenfolge der Parameter in der Testfunktion ist daher umgekehrt zur Reihenfolge der Decorators – ein häufiger Fallstrick.

```python
@patch('module.function_b')
@patch('module.function_a')
def test_multiple_patches(mock_a, mock_b):
    # WICHTIG: Reihenfolge ist umgekehrt!
    mock_a.return_value = 'A'
    mock_b.return_value = 'B'
```

### 6.5    Side Effects

`side_effect` erlaubt komplexeres Verhalten als ein einzelner Rückgabewert: sequenzielle Werte, das Werfen von Exceptions oder eine eigene Funktion, die bei jedem Aufruf ausgeführt wird.

```python
def test_side_effects():
    mock = Mock()

    # Verschiedene Rückgabewerte
    mock.side_effect = [1, 2, 3]
    assert mock() == 1
    assert mock() == 2
    assert mock() == 3

    # Exception werfen
    mock.side_effect = ValueError('Error')
    with pytest.raises(ValueError):
        mock()

    # Custom Funktion
    mock.side_effect = lambda x: x * 2
    assert mock(5) == 10
```

### 6.6    Attribute und Methoden mocken

Attribute eines Mock-Objekts lassen sich direkt zuweisen; Methoden werden über `return_value` konfiguriert. `Mock()` akzeptiert jeden Zugriff ohne Fehler, was das schnelle Aufbauen von Fake-Objekten ermöglicht.

```python
def test_mock_object():
    # Mock-Objekt mit Attributen
    mock_user = Mock()
    mock_user.name = 'Alice'
    mock_user.age = 30
    mock_user.get_email.return_value = 'alice@example.com'

    assert mock_user.name == 'Alice'
    assert mock_user.get_email() == 'alice@example.com'
```

### 6.7    Pytest-mock Plugin

Das Plugin `pytest-mock` stellt die `mocker`-Fixture bereit, die `patch` und Mock-Erstellung in einem pytest-nativen Stil vereint. Im Vergleich zu `unittest.mock` entfällt der `with`-Block – das Patching gilt automatisch für die Dauer des Tests.

```bash
pip install pytest-mock
```

```python
def test_with_mocker(mocker):
    # Eleganter als unittest.mock
    mock = mocker.patch('requests.get')
    mock.return_value.json.return_value = {'data': 'test'}

    result = get_user_data(1)
    assert result == {'data': 'test'}
```

## 7    Test Coverage

Coverage misst, welcher Anteil des Quellcodes beim Ausführen der Tests tatsächlich durchlaufen wird. Eine hohe Abdeckung ist kein Qualitätsbeweis, aber eine niedrige Abdeckung zeigt zuverlässig untestete Bereiche auf. Das Plugin `pytest-cov` integriert Coverage direkt in den `pytest`-Workflow.

### 7.1    Coverage ausführen

`pytest-cov` wird als Flag übergeben und gibt nach dem Test-Lauf einen Bericht aus. Verschiedene Report-Formate stehen zur Verfügung – von der Terminal-Ausgabe bis zum interaktiven HTML-Report, der zeilengenau zeigt, welcher Code nicht abgedeckt ist.

```bash
# Basic Coverage
pytest --cov=src tests/

# HTML-Report
pytest --cov=src --cov-report=html tests/
open htmlcov/index.html

# Terminal-Report mit fehlenden Zeilen
pytest --cov=src --cov-report=term-missing tests/

# Nur Coverage (ohne Tests)
pytest --cov=src --cov-report=term-missing --cov-fail-under=80 tests/
```

### 7.2    Coverage-Konfiguration

Die Coverage-Konfiguration in `.coveragerc` oder `pyproject.toml` legt fest, welche Dateien gemessen werden, welche ausgeschlossen sind und welche Zeilenmuster (z. B. abstrakte Methoden oder Type-Checking-Blöcke) grundsätzlich ignoriert werden sollen.

```ini
# .coveragerc oder pyproject.toml
[tool.coverage.run]
source = ['src']
omit = [
    '*/tests/*',
    '*/test_*.py',
    '*/__pycache__/*',
    '*/site-packages/*'
]

[tool.coverage.report]
exclude_lines = [
    'pragma: no cover',
    'def __repr__',
    'raise AssertionError',
    'raise NotImplementedError',
    'if __name__ == .__main__.:',
    'if TYPE_CHECKING:',
]
```

### 7.3    Coverage ausschließen

Einzelne Zeilen oder Blöcke, die nicht sinnvoll testbar sind oder bewusst ausgelassen werden sollen, lassen sich mit dem Kommentar `# pragma: no cover` von der Coverage-Messung ausschließen. Sparsam einsetzen – jedes `pragma` sollte bewusst gesetzt sein.

```python
def critical_function():
    result = complex_operation()

    if result:  # pragma: no cover
        # Nur in speziellen Fällen ausgeführt
        handle_special_case()

    return result
```

## 8    Praktische Patterns

In der Praxis tauchen bestimmte Fixture-Muster immer wieder auf. Die folgenden Beispiele zeigen bewährte Ansätze für typische Szenarien: globale Konfiguration, Datenbankzugriffe mit automatischem Rollback und das Testen von HTTP-Clients ohne echte Netzwerkaufrufe.

### 8.1    Konfigurations-Fixture

`conftest.py` ist eine spezielle Datei, die pytest automatisch lädt. Fixtures darin stehen allen Tests im selben Verzeichnis und in Unterverzeichnissen zur Verfügung – ohne expliziten Import. Ideal für projektweite Konfiguration oder gemeinsame Ressourcen.

```python
# conftest.py (wird automatisch geladen)
import pytest

@pytest.fixture(scope='session')
def config():
    """Globale Konfiguration"""
    return {
        'api_url': 'http://localhost:8000',
        'timeout': 30,
        'debug': True
    }

@pytest.fixture(scope='session')
def database_url():
    """Test-Datenbank URL"""
    return 'sqlite:///:memory:'
```

### 8.2    Datenbank-Tests

Tests gegen eine Datenbank sollten nach jedem Lauf keinen Zustand hinterlassen. Das Muster mit `session.rollback()` im Teardown stellt sicher, dass jeder Test auf einem sauberen Stand startet – ohne die Datenbank zwischen Tests neu aufzubauen.

```python
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

@pytest.fixture(scope='module')
def engine():
    """Erstellt Test-Datenbank"""
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(engine)
    yield engine
    Base.metadata.drop_all(engine)

@pytest.fixture
def db_session(engine):
    """Session mit Rollback nach Test"""
    Session = sessionmaker(bind=engine)
    session = Session()

    yield session

    session.rollback()
    session.close()

def test_create_user(db_session):
    user = User(name='Alice', email='alice@example.com')
    db_session.add(user)
    db_session.commit()

    assert user.id is not None
    assert db_session.query(User).count() == 1
```

### 8.3    API-Testing

HTTP-Clients werden in Unit Tests nicht gegen echte Endpunkte getestet. Stattdessen wird `requests.get` (oder das jeweilige HTTP-Objekt) gemockt, sodass der Test vollständig deterministisch ist und kein Netzwerk benötigt.

```python
import pytest
import requests

@pytest.fixture
def api_client():
    """API Client mit Base URL"""
    class APIClient:
        base_url = 'http://localhost:8000/api'

        def get(self, endpoint):
            return requests.get(f'{self.base_url}{endpoint}')

        def post(self, endpoint, data):
            return requests.post(f'{self.base_url}{endpoint}', json=data)

    return APIClient()

def test_get_users(api_client, mocker):
    # Mock HTTP-Call
    mock_response = mocker.Mock()
    mock_response.json.return_value = [{'id': 1, 'name': 'Alice'}]
    mock_response.status_code = 200

    mocker.patch('requests.get', return_value=mock_response)

    response = api_client.get('/users')
    assert response.status_code == 200
    assert len(response.json()) == 1
```

## 9    Best Practices

ute Tests sind keine Frage des Frameworks, sondern des Stils. Die folgenden Regeln helfen dabei, eine Test-Suite zu schreiben, die langfristig wartbar, schnell und aussagekräftig bleibt.

**✅ DO:**

- Ein Assert pro Test (wenn möglich)
- Descriptive Test-Namen (`test_user_creation_with_invalid_email`)
- Fixtures für Setup/Teardown
- Parametrize für ähnliche Tests
- Mocking für externe Dependencies
- Coverage > 80% anstreben

**❌ DON'T:**

- Tests von anderen Tests abhängig machen
- Global State zwischen Tests teilen
- Zu komplexe Fixtures
- Echte Datenbanken/APIs in Unit Tests
- Tests ohne Assertions

## 10    pytest.ini Konfiguration

Die `pytest.ini` zentralisiert die gesamte pytest-Konfiguration: Testpfade, Dateipatterns, Standard-Flags und Marker-Definitionen. So müssen keine Optionen bei jedem `pytest`-Aufruf wiederholt werden und das Verhalten ist für alle Entwickler im Projekt identisch.

Seit pytest 6.0 wird `pyproject.toml` vollständig unterstützt. Der Abschnitt lautet `[tool.pytest.ini_options]` statt `[pytest]` – alle Schlüssel sind identisch. `pyproject.toml` ist die modernere Wahl, da sie alle Projektkonfigurationen (pytest, coverage, ruff, usw.) in einer einzigen Datei bündelt.

```ini
[pytest]
# Mindest-Python-Version
minversion = 6.0

# Wo Tests liegen
testpaths = tests

# Datei-Pattern
python_files = test_*.py *_test.py
python_classes = Test*
python_functions = test_*

# Optionen für pytest
addopts =
    -ra
    --strict-markers
    --strict-config
    --showlocals
    --cov=src
    --cov-report=term-missing:skip-covered
    --cov-report=html

# Custom Markers
markers =
    slow: slow tests
    integration: integration tests
    unit: unit tests

# Filterwarnings
filterwarnings =
    error
    ignore::UserWarning
```

## 11    Zusammenfassung

`pytest` macht Tests einfach und lesbar. Fixtures werden für das Setup genutzt, Parametrize für Wiederholung, Marks für das Kategorisieren und selektive Ausführen von Tests, Mocking für Isolation und Coverage für Vollständigkeit. Schreibe Tests, die schnell, isoliert und deterministisch sind. Gemeinsame Fixtures gehören in `conftest.py` – pytest lädt sie automatisch für alle Tests im Verzeichnis, ohne dass ein Import nötig ist.

| Feature         | Verwendung                               |
| --------------- | ---------------------------------------- |
| Fixtures        | Setup/Teardown, Wiederverwendung         |
| Parametrize     | Mehrere Input/Output-Kombinationen       |
| Marks           | Tests kategorisieren/überspringen        |
| Mocking         | Externe Dependencies ersetzen            |
| Coverage        | Code-Abdeckung messen                    |
| conftest.py     | Gemeinsame Fixtures                      |
