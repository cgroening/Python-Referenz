# Datenbanken

Datenbanken sind zentral für die meisten Anwendungen. Dieses Kapitel behandelt SQLite für einfache Datenbankoperationen und SQLAlchemy als mächtiges ORM (Object-Relational Mapping) für komplexere Szenarien.

## 1    SQLite – Eingebaute Datenbank

SQLite ist eine leichtgewichtige, dateibasierte Datenbank, die Teil der Python-Standardbibliothek ist.

### 1.1    Verbindung herstellen

```python
import sqlite3

# Datenbank erstellen/öffnen (Datei wird automatisch erstellt)
conn = sqlite3.connect('mydatabase.db')

# In-Memory-Datenbank (nur im RAM, für Tests)
conn = sqlite3.connect(':memory:')

# Cursor erstellen (führt SQL-Befehle aus)
cursor = conn.cursor()

# Verbindung schließen
conn.close()
```

### 1.2    Mit Context Manager (empfohlen)

```python
# Automatisches Commit und Close
with sqlite3.connect('mydatabase.db') as conn:
    cursor = conn.cursor()
    # Datenbankoperationen
    cursor.execute('SELECT * FROM users')
# conn.close() wird automatisch aufgerufen
```

### 1.3    Tabelle erstellen

```python
import sqlite3

conn = sqlite3.connect('mydatabase.db')
cursor = conn.cursor()

# Tabelle erstellen
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        age INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
''')

conn.commit()
conn.close()
```

### 1.4    Daten einfügen

```python
# Einzelner Datensatz
cursor.execute(
    'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
    ('Alice', 'alice@example.com', 30)
)

# Mehrere Datensätze
users_data = [
    ('Bob', 'bob@example.com', 25),
    ('Charlie', 'charlie@example.com', 35),
    ('Diana', 'diana@example.com', 28)
]
cursor.executemany(
    'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
    users_data
)

conn.commit()
```

**Wichtig:** Verwende immer `?` Platzhalter (nie String-Formatierung) um SQL-Injection zu vermeiden!

```python
# ❌ NIEMALS SO (SQL-Injection-Risiko!)
name = 'Alice'; DROP TABLE users; --'
cursor.execute(f"INSERT INTO users (name) VALUES ('{name}')")

# ✅ Immer Platzhalter verwenden
cursor.execute('INSERT INTO users (name) VALUES (?)', (name,))
```

### 1.5    Daten abfragen

```python
# Alle Zeilen
cursor.execute('SELECT * FROM users')
all_users = cursor.fetchall()
for user in all_users:
    print(user)  # Tuple: (id, name, email, age, created_at)

# Einzelne Zeile
cursor.execute('SELECT * FROM users WHERE id = ?', (1,))
user = cursor.fetchone()
print(user)

# Bestimmte Anzahl
cursor.execute('SELECT * FROM users')
first_five = cursor.fetchmany(5)

# Mit WHERE-Bedingung
cursor.execute('SELECT name, email FROM users WHERE age > ?', (25,))
results = cursor.fetchall()
```

### 1.6    Row Factory – Zugriff als Dictionary

```python
import sqlite3

conn = sqlite3.connect('mydatabase.db')
# Row Factory aktivieren
conn.row_factory = sqlite3.Row

cursor = conn.cursor()
cursor.execute('SELECT * FROM users WHERE id = ?', (1,))
user = cursor.fetchone()

# Zugriff per Spaltenname (wie Dictionary)
print(user['name'])
print(user['email'])

# Oder als Dictionary konvertieren
user_dict = dict(user)
print(user_dict)
```

### 1.7    Daten aktualisieren

```python
# UPDATE
cursor.execute(
    'UPDATE users SET age = ? WHERE name = ?',
    (31, 'Alice')
)

# Anzahl betroffener Zeilen
print(f'Updated {cursor.rowcount} rows')

conn.commit()
```

### 1.8    Daten löschen

```python
# DELETE
cursor.execute('DELETE FROM users WHERE age < ?', (25,))
print(f'Deleted {cursor.rowcount} rows')

conn.commit()

# Alle Daten löschen
cursor.execute('DELETE FROM users')
conn.commit()

# Tabelle löschen
cursor.execute('DROP TABLE IF EXISTS users')
conn.commit()
```

### 1.9    Transaktionen

```python
conn = sqlite3.connect('mydatabase.db')
cursor = conn.cursor()

try:
    # Mehrere Operationen als Transaktion
    cursor.execute('INSERT INTO users (name, email) VALUES (?, ?)',
                   ('Eve', 'eve@example.com'))
    cursor.execute('UPDATE users SET age = ? WHERE name = ?',
                   (40, 'Alice'))

    # Alles erfolgreich → Commit
    conn.commit()
except sqlite3.Error as e:
    # Fehler → Rollback
    conn.rollback()
    print(f'Transaction failed: {e}')
finally:
    conn.close()
```

## 2    SQLite mit Context Manager Pattern

```python
import sqlite3
from contextlib import contextmanager

@contextmanager
def get_db_connection(db_path):
    """Context Manager für Datenbankverbindungen"""
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

# Verwendung
with get_db_connection('mydatabase.db') as conn:
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users')
    users = cursor.fetchall()
# Automatisches Commit/Rollback/Close
```

## 3    SQLAlchemy – ORM und mehr

SQLAlchemy ist das mächtigste Datenbank-Toolkit für Python mit zwei Hauptkomponenten:
- **Core**: Low-level SQL-Abstraction
- **ORM**: High-level Object-Relational Mapping

### 3.1    Installation

```bash
pip install sqlalchemy
```

### 3.2    Engine erstellen

```python
from sqlalchemy import create_engine

# SQLite
engine = create_engine('sqlite:///mydatabase.db', echo=True)

# PostgreSQL
engine = create_engine('postgresql://user:password@localhost/dbname')

# MySQL
engine = create_engine('mysql+pymysql://user:password@localhost/dbname')

# In-Memory SQLite
engine = create_engine('sqlite:///:memory:')
```

### 3.3    Deklarative Basis und Models

```python
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base
from datetime import datetime

# Basis-Klasse für alle Models
Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    age = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<User(name='{self.name}', email='{self.email}')>"

# Tabellen erstellen
Base.metadata.create_all(engine)
```

### 3.4    Session erstellen

```python
from sqlalchemy.orm import sessionmaker

# Session-Factory erstellen
Session = sessionmaker(bind=engine)

# Session-Instanz
session = Session()

# Mit Context Manager (empfohlen)
from contextlib import contextmanager

@contextmanager
def get_session():
    session = Session()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()

# Verwendung
with get_session() as session:
    user = User(name='Alice', email='alice@example.com', age=30)
    session.add(user)
# Automatisches Commit/Rollback/Close
```

### 3.5    CRUD-Operationen

#### 3.5.1    Create (Einfügen)

```python
from sqlalchemy.orm import Session

# Einzelner Datensatz
with get_session() as session:
    user = User(name='Bob', email='bob@example.com', age=25)
    session.add(user)
    # Commit erfolgt automatisch bei __exit__

# Mehrere Datensätze
with get_session() as session:
    users = [
        User(name='Charlie', email='charlie@example.com', age=35),
        User(name='Diana', email='diana@example.com', age=28)
    ]
    session.add_all(users)
```

#### 3.5.2    Read (Abfragen)

```python
with get_session() as session:
    # Alle Datensätze
    all_users = session.query(User).all()

    # Erster Datensatz
    first_user = session.query(User).first()

    # Nach Primary Key
    user = session.query(User).get(1)  # Deprecated in SQLAlchemy 2.0
    user = session.get(User, 1)  # Neue Syntax

    # Mit Filter
    alice = session.query(User).filter_by(name='Alice').first()

    # Komplexere Filter
    from sqlalchemy import and_, or_

    young_users = session.query(User).filter(User.age < 30).all()

    results = session.query(User).filter(
        and_(User.age > 25, User.age < 35)
    ).all()

    # ORDER BY
    users_sorted = session.query(User).order_by(User.age.desc()).all()

    # LIMIT
    top_5 = session.query(User).limit(5).all()

    # COUNT
    user_count = session.query(User).count()
```

#### 3.5.3    Update (Aktualisieren)

```python
with get_session() as session:
    # Objekt laden und ändern
    user = session.query(User).filter_by(name='Alice').first()
    user.age = 31
    # Änderung wird beim Commit gespeichert

# Bulk-Update
with get_session() as session:
    session.query(User).filter(User.age < 25).update({'age': 25})
```

#### 3.5.4    Delete (Löschen)

```python
with get_session() as session:
    # Objekt laden und löschen
    user = session.query(User).filter_by(name='Bob').first()
    session.delete(user)

# Bulk-Delete
with get_session() as session:
    session.query(User).filter(User.age < 20).delete()
```

## 4    Relationships (Beziehungen)

### 4.1    One-to-Many (Eins-zu-Viele)

```python
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String(100))

    # Relationship: Ein User hat viele Posts
    posts = relationship('Post', back_populates='author', cascade='all, delete-orphan')

class Post(Base):
    __tablename__ = 'posts'

    id = Column(Integer, primary_key=True)
    title = Column(String(200))
    content = Column(String)
    user_id = Column(Integer, ForeignKey('users.id'))

    # Relationship: Ein Post gehört zu einem User
    author = relationship('User', back_populates='posts')

Base.metadata.create_all(engine)

# Verwendung
with get_session() as session:
    user = User(name='Alice')
    post1 = Post(title='First Post', content='Hello World')
    post2 = Post(title='Second Post', content='Another one')

    user.posts.append(post1)
    user.posts.append(post2)

    session.add(user)
    # Posts werden automatisch mit gespeichert

# Abfragen
with get_session() as session:
    user = session.query(User).filter_by(name='Alice').first()
    print(f'{user.name} has {len(user.posts)} posts')

    for post in user.posts:
        print(f'  - {post.title}')
```

### 4.2    Many-to-Many (Viele-zu-Viele)

```python
from sqlalchemy import Table

# Zwischentabelle (Association Table)
user_role_association = Table(
    'user_roles',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('role_id', Integer, ForeignKey('roles.id'))
)

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String(100))

    # Many-to-Many Relationship
    roles = relationship('Role', secondary=user_role_association, back_populates='users')

class Role(Base):
    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True)
    name = Column(String(50))

    users = relationship('User', secondary=user_role_association, back_populates='roles')

Base.metadata.create_all(engine)

# Verwendung
with get_session() as session:
    admin_role = Role(name='admin')
    user_role = Role(name='user')

    alice = User(name='Alice')
    alice.roles.extend([admin_role, user_role])

    bob = User(name='Bob')
    bob.roles.append(user_role)

    session.add_all([alice, bob])

# Abfragen
with get_session() as session:
    user = session.query(User).filter_by(name='Alice').first()
    print(f'{user.name} has roles: {[r.name for r in user.roles]}')
```

### 4.3    One-to-One (Eins-zu-Eins)

```python
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String(100))

    # One-to-One: uselist=False
    profile = relationship('UserProfile', back_populates='user', uselist=False)

class UserProfile(Base):
    __tablename__ = 'user_profiles'

    id = Column(Integer, primary_key=True)
    bio = Column(String)
    avatar_url = Column(String)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True)

    user = relationship('User', back_populates='profile')

# Verwendung
with get_session() as session:
    user = User(name='Alice')
    profile = UserProfile(bio='Software Developer', avatar_url='/avatars/alice.jpg')
    user.profile = profile

    session.add(user)
```

## 5    Erweiterte Queries

### 5.1    Joins

```python
from sqlalchemy import select

with get_session() as session:
    # Implicit Join
    results = session.query(User, Post).filter(User.id == Post.user_id).all()

    # Explicit Join
    results = session.query(User).join(Post).filter(Post.title.like('%Python%')).all()

    # Left Outer Join
    results = session.query(User).outerjoin(Post).all()
```

### 5.2    Aggregationen

```python
from sqlalchemy import func

with get_session() as session:
    # COUNT
    user_count = session.query(func.count(User.id)).scalar()

    # AVG, MIN, MAX, SUM
    avg_age = session.query(func.avg(User.age)).scalar()
    min_age = session.query(func.min(User.age)).scalar()
    max_age = session.query(func.max(User.age)).scalar()

    # GROUP BY
    post_counts = session.query(
        User.name,
        func.count(Post.id).label('post_count')
    ).join(Post).group_by(User.name).all()

    for name, count in post_counts:
        print(f'{name}: {count} posts')
```

### 5.3    Subqueries

```python
from sqlalchemy import select

with get_session() as session:
    # Subquery: Users mit mehr als 5 Posts
    subquery = (
        session.query(Post.user_id, func.count(Post.id).label('post_count'))
        .group_by(Post.user_id)
        .having(func.count(Post.id) > 5)
        .subquery()
    )

    active_users = session.query(User).join(
        subquery, User.id == subquery.c.user_id
    ).all()
```

### 5.4    Eager Loading (N+1 Problem vermeiden)

```python
from sqlalchemy.orm import joinedload, selectinload

with get_session() as session:
    # ❌ N+1 Problem: Ein Query pro User + Posts
    users = session.query(User).all()
    for user in users:
        print(user.posts)  # Neuer Query für jeden User!

    # ✅ Joined Load: Ein Query mit JOIN
    users = session.query(User).options(joinedload(User.posts)).all()
    for user in users:
        print(user.posts)  # Keine zusätzlichen Queries

    # ✅ Select In Load: Zwei Queries (besser bei Many-to-Many)
    users = session.query(User).options(selectinload(User.roles)).all()
```

## 6    Datenbank-Migrationen mit Alembic

Alembic ist das Standard-Migrationstool für SQLAlchemy.

### 6.1    Installation und Setup

```bash
pip install alembic

# Alembic initialisieren
alembic init alembic
```

### 6.2    Konfiguration

```python
# alembic/env.py
from myapp.models import Base  # Deine Models
from myapp.database import engine  # Deine Engine

target_metadata = Base.metadata

# In alembic.ini: Connection String eintragen
# sqlalchemy.url = sqlite:///mydatabase.db
```

### 6.3    Migration erstellen

```bash
# Automatische Migration aus Model-Änderungen
alembic revision --autogenerate -m "Add user table"

# Manuelle Migration
alembic revision -m "Manual migration"
```

### 6.4    Migration ausführen

```bash
# Neueste Migration anwenden
alembic upgrade head

# Spezifische Version
alembic upgrade +1  # Eine Version vorwärts
alembic downgrade -1  # Eine Version zurück

# Migration-History
alembic history
alembic current
```

### 6.5    Beispiel-Migration

```python
# alembic/versions/xxx_add_user_table.py
"""Add user table

Revision ID: abc123
"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('email', sa.String(100), unique=True)
    )

def downgrade():
    op.drop_table('users')
```

## 7    Best Practices

### 7.1    Session-Management

```python
# ✅ Immer Context Manager verwenden
with get_session() as session:
    # Datenbankoperationen
    pass

# ❌ Session nicht manuell schließen vergessen
session = Session()
# Operationen
session.close()  # Leicht zu vergessen!
```

### 7.2    Connection Pooling

```python
# Connection Pool konfigurieren
from sqlalchemy.pool import QueuePool

engine = create_engine(
    'postgresql://user:password@localhost/db',
    poolclass=QueuePool,
    pool_size=10,          # Anzahl permanenter Verbindungen
    max_overflow=20,       # Zusätzliche Verbindungen bei Bedarf
    pool_timeout=30,       # Timeout in Sekunden
    pool_recycle=3600      # Verbindungen nach 1h recyceln
)
```

### 7.3    Bulk-Operationen

```python
# ✅ Effizient: Bulk Insert
with get_session() as session:
    users = [User(name=f'User{i}', email=f'user{i}@example.com')
             for i in range(1000)]
    session.bulk_save_objects(users)

# ❌ Ineffizient: Einzeln einfügen
with get_session() as session:
    for i in range(1000):
        user = User(name=f'User{i}', email=f'user{i}@example.com')
        session.add(user)
```

### 7.4    Raw SQL wenn nötig

```python
# Manchmal ist Raw SQL performanter
with get_session() as session:
    result = session.execute(
        'SELECT name, COUNT(*) as count FROM users GROUP BY name'
    )
    for row in result:
        print(row.name, row.count)
```

### 7.5    Environment-spezifische Konfiguration

```python
import os
from sqlalchemy import create_engine

def get_engine():
    env = os.getenv('ENVIRONMENT', 'development')

    if env == 'production':
        return create_engine(
            os.getenv('DATABASE_URL'),
            echo=False,
            pool_size=20
        )
    elif env == 'testing':
        return create_engine('sqlite:///:memory:', echo=False)
    else:  # development
        return create_engine('sqlite:///dev.db', echo=True)

engine = get_engine()
```

## 8    Praktisches Beispiel: Blog-System

```python
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    posts = relationship('Post', back_populates='author', cascade='all, delete-orphan')
    comments = relationship('Comment', back_populates='author')

class Post(Base):
    __tablename__ = 'posts'

    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    published = Column(DateTime, default=datetime.utcnow)
    author_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    author = relationship('User', back_populates='posts')
    comments = relationship('Comment', back_populates='post', cascade='all, delete-orphan')

class Comment(Base):
    __tablename__ = 'comments'

    id = Column(Integer, primary_key=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    post_id = Column(Integer, ForeignKey('posts.id'), nullable=False)
    author_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    post = relationship('Post', back_populates='comments')
    author = relationship('User', back_populates='comments')

# Setup
engine = create_engine('sqlite:///blog.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)

# Beispiel-Nutzung
def create_sample_data():
    with Session() as session:
        # User erstellen
        alice = User(username='alice', email='alice@example.com')

        # Post erstellen
        post = Post(
            title='My First Post',
            content='This is my first blog post!',
            author=alice
        )

        # Kommentar erstellen
        comment = Comment(
            content='Great post!',
            post=post,
            author=alice
        )

        session.add_all([alice, post, comment])
        session.commit()

def get_user_posts(username):
    with Session() as session:
        user = session.query(User).filter_by(username=username).first()
        if user:
            return [(post.title, len(post.comments)) for post in user.posts]
        return []

# Ausführen
create_sample_data()
posts = get_user_posts('alice')
print(posts)
```

## 9    Zusammenfassung

| Tool/Konzept           | Verwendung                                           |
| ---------------------- | ---------------------------------------------------- |
| `sqlite3`              | Einfache, dateibasierte Datenbank                    |
| `cursor.execute()`     | SQL-Befehle ausführen                                |
| `conn.commit()`        | Änderungen speichern                                 |
| SQLAlchemy Engine      | Datenbankverbindung                                  |
| SQLAlchemy ORM         | Python-Objekte ↔ Datenbank                           |
| `Base`                 | Basis-Klasse für Models                              |
| `relationship()`       | Beziehungen zwischen Tabellen                        |
| `session.query()`      | Daten abfragen                                       |
| `joinedload()`         | Eager Loading (N+1 Problem vermeiden)                |
| Alembic                | Datenbank-Migrationen                                |

**Kernprinzipien:**

- Verwende `?` Platzhalter bei SQLite (SQL-Injection vermeiden)
- Nutze Context Manager für Verbindungen und Sessions
- SQLAlchemy ORM für komplexe Anwendungen, Raw SQL für Performance-kritische Queries
- Eager Loading bei Relationships verwenden
- Migrationen mit Alembic für Schema-Änderungen
- Connection Pooling in Produktion konfigurieren
