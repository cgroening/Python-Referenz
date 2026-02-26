# Unit Tests

## 1    Unit Tests mit pytest

Unit Tests prüfen einzelne Komponenten (Funktionen, Klassen) isoliert. Pytest ist das beliebteste Test-Framework für Python und bietet mächtige Features für produktiven Test-Code.

### 1.1    Grundlagen

#### 1.1.1    Installation und Setup

```bash
pip install pytest pytest-cov
```

**Projekt-Struktur:
**
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

#### 1.1.2    Einfacher Test

```python
# src/calculator.py
def add(a, b):
    return a + b

def divide(a, b):
    if b == 0:
        raise ValueError('Cannot divide by zero')
    return a / b
```

```python
# tests/test_calculator.py
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

### 1.2    Assertions

#### 1.2.1    Basis-Assertions

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

#### 1.2.2    Erweiterte Assertions

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

#### 1.2.3    Exception-Testing

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

### 1.3    Fixtures

Fixtures sind wiederverwendbare Setup-Funktionen für Tests.

#### 1.3.1    Basis-Fixtures
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

#### 1.3.2    Setup und Teardown
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

#### 1.3.3    Fixture-Scopes
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

#### 1.3.4    Fixture-Dependencies
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

#### 1.3.5    Autouse-Fixtures
```python
import pytest

@pytest.fixture(autouse=True)
def reset_state():
    """Wird automatisch vor jedem Test ausgeführt"""
    global_state.clear()
    yield
    # Cleanup nach Test
```

#### 1.3.6    Built-in Fixtures
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

### 1.4    Parametrized Tests

Tests mit mehreren Input/Output-Kombinationen.

#### 1.4.1    Basis-Parametrize
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

#### 1.4.2    Mehrere Parameter
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

#### 1.4.3    IDs für lesbare Test-Namen
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

#### 1.4.4    Parametrize mit pytest.param
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

#### 1.4.5    Verschachtelte Parametrize
```python
@pytest.mark.parametrize('x', [1, 2, 3])
@pytest.mark.parametrize('y', [10, 20])
def test_multiply(x, y):
    result = x * y
    assert result == x * y

# Generiert 6 Tests: (1,10), (1,20), (2,10), (2,20), (3,10), (3,20)
```

#### 1.4.6    Parametrize mit Fixtures
```python
@pytest.fixture(params=[1, 2, 3])
def number(request):
    return request.param

def test_positive(number):
    assert number > 0

# Generiert 3 Tests mit number=1, 2, 3
```

### 1.5    Marks und Test-Organisation

#### 1.5.1    Basis-Marks
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

#### 1.5.2    Custom Marks
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

#### 1.5.3    Test-Klassen
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

### 1.6    Mocking

Mocking ersetzt echte Objekte durch kontrollierte Fakes.

#### 1.6.1    unittest.mock Basics
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

#### 1.6.2    Funktionen patchen
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

#### 1.6.3    Decorator-Style Patching
```python
@patch('requests.get')
def test_api_call(mock_get):
    mock_get.return_value.status_code = 200
    mock_get.return_value.json.return_value = {'data': 'test'}
    
    result = get_user_data(1)
    assert result == {'data': 'test'}
```

#### 1.6.4    Mehrere Patches
```python
@patch('module.function_b')
@patch('module.function_a')
def test_multiple_patches(mock_a, mock_b):
    # WICHTIG: Reihenfolge ist umgekehrt!
    mock_a.return_value = 'A'
    mock_b.return_value = 'B'
```

#### 1.6.5    Side Effects
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

#### 1.6.6    Attribute und Methoden mocken
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

#### 1.6.7    Pytest-mock Plugin
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

### 1.7    Test Coverage

Coverage misst, welcher Code von Tests abgedeckt wird.

#### 1.7.1    Coverage ausführen
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

#### 1.7.2    Coverage-Konfiguration
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

#### 1.7.3    Coverage ausschließen
```python
def critical_function():
    result = complex_operation()
    
    if result:  # pragma: no cover
        # Nur in speziellen Fällen ausgeführt
        handle_special_case()
    
    return result
```

### 1.8    Praktische Patterns

#### 1.8.1    Konfigurations-Fixture
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

#### 1.8.2    Datenbank-Tests
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

#### 1.8.3    API-Testing
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

### 1.9    Best Practices

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

### 1.10    pytest.ini Konfiguration
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

### 1.11    Zusammenfassung

| Feature         | Verwendung                               |
| --------------- | ---------------------------------------- |
| Fixtures        | Setup/Teardown, Wiederverwendung         |
| Parametrize     | Mehrere Input/Output-Kombinationen       |
| Marks           | Tests kategorisieren/überspringen        |
| Mocking         | Externe Dependencies ersetzen            |
| Coverage        | Code-Abdeckung messen                    |
| conftest.py     | Gemeinsame Fixtures                      |

**Kernprinzip:** Pytest macht Tests einfach und lesbar. Nutze Fixtures für Setup, Parametrize für Wiederholung, Mocking für Isolation, und Coverage für Vollständigkeit. Schreibe Tests, die schnell, isoliert und deterministisch sind.
