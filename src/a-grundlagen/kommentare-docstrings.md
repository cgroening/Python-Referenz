# Kommentare und Docstrings

## 1    Ein- und mehrzeilige Kommentare

```python
# Line comment
```

```python
'''
Multi 
line 
comment
'''
```

```python
"""
Multi 
line 
comment 
"""
```

## 2    Docstrings

### 2.1    NumPy-Style

[Style guide — numpydoc Manual](https://numpydoc.readthedocs.io/en/latest/format.html)

```python
def divide(a: float, b: float) -> float:
    """
    Divides two numbers.

    Parameters
    ----------
    a : float
        The first number.
    b : float
        The second number.

    Returns
    -------
    float
        The result of the division.

    Raises
    ------
    ZeroDivisionError
        If `b` is zero.
    TypeError
        If either input is not a float or int.
    """
    if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):
        raise TypeError('Both values must be numbers.')
    if b == 0:
        raise ZeroDivisionError('Division by zero is not allowed.')
    return a / b
```

**Vorteile:**

- Besonders gut für wissenschaftliche Bibliotheken (`NumPy`, `SciPy`, `Pandas`)
- Strukturiert mit Abschnittsüberschriften (`Parameters`, `Returns`, `Raises`)

#### 2.1.1    Kurze Zusammenfassung

```python
def divide(a, b):
    """
    Divides two numbers.
    """
```

#### 2.1.2    Parameter

```python
"""
Parameters
----------
x : int
    Description of parameter `x`.
y
    Description of parameter `y` (with type not specified).
z : int, optional
    Description of parameter `z`.
do_something : bool, default=True
    Description of parameter `do_something`.
*args
    Description of keyword arguments.
**kwargs
    Description of extra arguments
"""
```

#### 2.1.3    Rückgabewerte

##### Returns

```python
"""
Returns
-------
int
    Description of the return value.
"""
```

```python
"""
Returns
-------
return_val_1 : int
    Description of `return_value_1`.
return_val_2 : str or None
    Description of `return_value_2`.
"""
```

##### Yields

```python
"""
Yields
-------
int
    Description of the return value.
"""
```

```python
"""
Yields
------
return_val_1 : int
    Description of `return_value_1`.
return_val_2 : str or None
    Description of `return_value_2`.
"""
```

#### Raises

```python
"""
Raises
------
TypeError
	Description when this error is thrown.
"""
```

#### See Also

```python
"""
See Also
--------
func_a : Description of `func_a`.
func_b, func_c
func_d
"""
```

```python
"""
See Also
--------
package.module.submodule.func_a :
    Description of `func_a`.
"""
```

#### Notes

```python
"""
Notes
-----
Further notes on a method or class.
"""
```

#### Klassen

```python
class BankAccount:
    """
    A bank account with basic transaction functionality.

    Attributes
    ----------
    owner : str
        Full name of the account holder.
    balance : float
        Current account balance in euros.
    iban : str
        International Bank Account Number.

    Methods
    -------
    deposit(amount)
        Add funds to the account.
    withdraw(amount)
        Remove funds from the account.
    transfer(target, amount)
        Transfer funds to another BankAccount.

    """
```

### 2.2    Google-Style

[styleguide | Style guides for Google-originated open-source projects](https://google.github.io/styleguide/pyguide.html)

Dies ist das Google-Dokumentationsformat. Es ist einfach zu lesen und wird oft in größeren Projekten verwendet.

```python
def add(a: int, b: int) -> int:
    """
    Adds two numbers and returns the result.

    Args:
        a (int): The first number.
        b (int): The second number.

    Returns:
        int: The sum of both numbers.

    Raises:
        TypeError: If either input is not an integer.
    """
    if not isinstance(a, int) or not isinstance(b, int):
        raise TypeError('Both values must be of type int.')
    return a + b
```

**Vorteile:**

- Leicht verständlich
- Strukturierte Abschnitte (`Args`, `Returns`, `Raises`)

### 2.3    reStructuredText (reST)

[reStructuredText Primer — Sphinx documentation](https://www.sphinx-doc.org/en/master/usage/restructuredtext/basics.html)

Dieses Format wird in Sphinx-Dokumentationen häufig verwendet.

```python
def multiply(a: float, b: float) -> float:
    """
    Multiplies two numbers.

    :param a: The first number.
    :type a: float
    :param b: The second number.
    :type b: float
    :return: The product of a and b.
    :rtype: float
    :raises TypeError: If either input is not a float or int.
    """
    if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):
        raise TypeError('Both values must be numbers.')
    return a * b
```

**Vorteile:**

- Unterstützt von Sphinx für automatisch generierte Dokumentationen
- Klar strukturierte Parameter (`:param`, `:return`, `:rtype`, `:raises`)

### 2.4    Vergleich

| Format        | Vorteile                             | Geeignet für                |
| ------------- | ------------------------------------ | --------------------------- |
| **NumPy**         | Wissenschaftliche Standards          | Data Science, ML, Forschung |
| **Google**        | Einfach zu lesen, klare Struktur     | Allgemeine Python-Projekte  |
| **reST (Sphinx)** | Unterstützt in automatisierten Dokus | Große Dokumentationen, APIs |

Siehe auch:

[Python Docstrings Tutorial : Examples & Format for Pydoc, Numpy, Sphinx Doc Strings](https://www.datacamp.com/tutorial/docstrings-python), insbesondere Abschnitt Comparison of docstring formats
