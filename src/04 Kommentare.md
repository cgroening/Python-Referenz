## 1    Ein- und Mehrzeilige Kommentare

```python
# Line comment

'''
Multi 
line 
comment
'''

"""
Multi 
line 
comment 
(wird hauptsächlich für Docstrings verwendet)
"""
```

## 2    Docstrings

### 2.1    NumPy-Style

```python
def dividiere(a: float, b: float) -> float:
    """
    Dividiert zwei Zahlen.

    Parameters
    ----------
    a : float
        Die erste Zahl.
    b : float
        Die zweite Zahl.

    Returns
    -------
    float
        Das Ergebnis der Division.

    Raises
    ------
    ZeroDivisionError
        Falls `b` gleich Null ist.
    TypeError
        Falls einer der Eingaben kein Float oder Int ist.
    """
    if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):
        raise TypeError("Beide Werte müssen Zahlen sein.")
    if b == 0:
        raise ZeroDivisionError("Division durch Null ist nicht erlaubt.")
    return a / b
```

**Vorteile:**

- Besonders gut für wissenschaftliche Bibliotheken (`NumPy`, `SciPy`, `Pandas`)
- Strukturiert mit Abschnittsüberschriften (`Parameters`, `Returns`, `Raises`)

### 2.2    Google-Style

Dies ist das Google-Dokumentationsformat. Es ist einfach zu lesen und wird oft in größeren Projekten verwendet.

```python
def addiere(a: int, b: int) -> int:
    """
    Addiert zwei Zahlen und gibt das Ergebnis zurück.

    Args:
        a (int): Die erste Zahl.
        b (int): Die zweite Zahl.

    Returns:
        int: Die Summe der beiden Zahlen.

    Raises:
        TypeError: Falls einer der Eingaben kein Integer ist.
    """
    if not isinstance(a, int) or not isinstance(b, int):
        raise TypeError("Beide Werte müssen vom Typ int sein.")
    return a + b
```

**Vorteile:**

- Leicht verständlich
- Strukturierte Abschnitte (`Args`, `Returns`, `Raises`)

### 2.3    reStructuredText (reST)

Dieses Format wird in Sphinx-Dokumentationen häufig verwendet.

```python
def multipliziere(a: float, b: float) -> float:
    """
    Multipliziert zwei Zahlen.

    :param a: Die erste Zahl.
    :type a: float
    :param b: Die zweite Zahl.
    :type b: float
    :return: Das Produkt von a und b.
    :rtype: float
    :raises TypeError: Falls einer der Eingaben kein Float ist.
    """
    if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):
        raise TypeError("Beide Werte müssen Zahlen sein.")
    return a * b
```

**Vorteile:**

- Unterstützt von Sphinx für automatisch generierte Dokumentationen
- Klar strukturierte Parameter (`:param`, `:return`, `:rtype`, `:raises`)

### 2.4    Vergleich

| Format            | Vorteile                             | Geeignet für                |
| ----------------- | ------------------------------------ | --------------------------- |
| **NumPy**         | Wissenschaftliche Standards          | Data Science, ML, Forschung |
| **Google**        | Einfach zu lesen, klare Struktur     | Allgemeine Python-Projekte  |
| **reST (Sphinx)** | Unterstützt in automatisierten Dokus | Große Dokumentationen, APIs |

Siehe auch:

[Python Docstrings Tutorial : Examples & Format for Pydoc, Numpy, Sphinx Doc Strings](https://www.datacamp.com/tutorial/docstrings-python), insbesondere Abschnitt Comparison of docstring formats*
