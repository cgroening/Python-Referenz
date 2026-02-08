## 1    Erstellung einer einfachen Klasse

```python
class Person:
    """Eine Klasse, die eine Person repräsentiert."""

    def __init__(self, name, age):
        """Konstruktor für die Klasse Person."""
        self.name = name
        self.age = age

    def introduce(self):
        """Gibt eine Vorstellung der Person aus."""
        print(f"Hallo, mein Name ist {self.name} und ich bin {self.age} Jahre alt.")

# Objekt erstellen
person1 = Person("Alice", 30)
person1.introduce()
```

## 2    Vererbung in Python

```python
class Student(Person):
    """Eine Klasse, die einen Studenten repräsentiert."""

    def __init__(self, name, age, major):
        """Konstruktor für die Klasse Student."""
        super().__init__(name, age)  # Aufruf des Konstruktors der Elternklasse
        self.major = major

    def introduce(self):
        """Überschreibt die Methode der Elternklasse."""
        print(f"Hallo, mein Name ist {self.name}, ich bin {self.age} Jahre alt und studiere {self.major}.")

# Objekt erstellen
student1 = Student("Bob", 22, "Informatik")
student1.introduce()
```

## 3    Mehrfachvererbung

```python
class Worker:
    """Eine Klasse, die einen Arbeiter repräsentiert."""

    def __init__(self, job):
        """Konstruktor für die Klasse Worker."""
        self.job = job

    def work(self):
        """Gibt den Beruf des Arbeiters aus."""
        print(f"Ich arbeite als {self.job}.")

class StudentWorker(Student, Worker):
    """Eine Klasse für einen Studenten, der auch arbeitet."""

    def __init__(self, name, age, major, job):
        """Konstruktor für die Klasse StudentWorker."""
        Student.__init__(self, name, age, major)
        Worker.__init__(self, job)

    def introduce(self):
        """Erweitert die Vorstellungsmethode."""
        print(f"Ich bin {self.name}, {self.age} Jahre alt, studiere {self.major} und arbeite als {self.job}.")

# Objekt erstellen
student_worker = StudentWorker("Clara", 25, "Maschinenbau", "Werkstudent")
student_worker.introduce()
```

## 4    Abstrakte Klassen

```python
from abc import ABC, abstractmethod

class Animal(ABC):
    """Eine abstrakte Klasse für Tiere."""

    @abstractmethod
    def make_sound(self):
        """Abstrakte Methode, die von Unterklassen implementiert werden muss."""
        pass

class Dog(Animal):
    """Eine Klasse, die einen Hund repräsentiert."""

    def make_sound(self):
        """Implementiert die abstrakte Methode."""
        print("Wuff Wuff!")

# Objekt erstellen
dog = Dog()
dog.make_sound()
```

## 5    Getter und Setter mit `property`

```python
class BankAccount:
    """Eine Klasse für ein Bankkonto."""

    def __init__(self, balance):
        self._balance = balance  # Geschützte Variable

    @property
    def balance(self) -> int:
        """Getter für den Kontostand."""
        return self._balance

    @balance.setter
    def balance(self, amount):
        """Setter für den Kontostand mit Validierung."""
        if amount < 0:
            print("Fehler: Der Kontostand kann nicht negativ sein.")
        else:
            self._balance = amount

# Objekt erstellen
account = BankAccount(1000)
print(account.balance)
account.balance = 500
print(account.balance)
account.balance = -100  # Fehler
```

## 6    `__str__` und `__repr__` Methoden

```python
class Car:
    """Eine Klasse für ein Auto."""

    def __init__(self, brand, model):
        self.brand = brand
        self.model = model

    def __str__(self):
        """Lesbare Darstellung des Objekts."""
        return f"Auto: {self.brand} {self.model}"

    def __repr__(self):
        """Detaillierte Darstellung für Entwickler."""
        return f"Car('{self.brand}', '{self.model}')"

# Objekt erstellen
car = Car("BMW", "X5")
print(car)  # __str__ Methode
print(repr(car))  # __repr__ Methode
```

## 7    Zusammenfassung

- `class` definiert eine Klasse.
- `__init__` ist der Konstruktor.
- `super()` ruft Methoden der Elternklasse auf.
- Abstrakte Klassen werden mit `ABC` definiert.
- `property` ermöglicht kontrollierten Zugriff auf Attribute.
- `__str__` und `__repr__` geben eine Darstellung des Objekts zurück.