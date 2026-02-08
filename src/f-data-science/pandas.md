# Pandas

`pandas` ist eine leistungsstarke, offene Bibliothek für Datenanalyse und -manipulation. Sie bietet zwei zentrale Datenstrukturen:
- `Series`: eine eindimensionale Liste (ähnlich wie ein Array mit Labels)
- `DataFrame`: eine tabellarische Datenstruktur (ähnlich wie Excel oder SQL-Tabellen)

Mit `pandas` kann man:
- Daten lesen, schreiben, filtern, sortieren
- fehlende Werte behandeln
- Gruppieren, aggregieren und berechnen
- Daten aus verschiedenen Quellen wie CSV, Excel, SQL, JSON usw. einlesen

`pandas` ist ein Standard-Tool für Datenanalyse mit Python - schnell, flexibel und einfach zu verwenden.

> [!INFO] Grundlegender Unterschied zwischen Numpy und Pandas
> Bei Numpy wird standardmäßig über Zeilen indiziert, bei Pandas über Spalten!

**Grundlegender Unterschied zwischen Numpy und Pandas:**
Bei Numpy wird standardmäßig über Zeilen indiziert, bei Pandas über Spalten!

## 1   Importieren

```python
import pandas as pd
```

Der Name `pd` ist zwar frei wählbar, es handelt sich hierbei jedoch um die geläufige Schreibweise.

## 2   Datentypen

Da pandas auf NumPy basiert sind viele der Datentypen direkt übernommen worden. [[numpy#Datentypen|Numpy-Datentypen]] wie `int32`, `float64`, `bool_`, `object_` usw. sind in pandas-DataFrames direkt verwendbar.

| Datentyp         | Beschreibung                                         |
| ---------------- | ---------------------------------------------------- |
| **`int8`**           | Ganze Zahl, 8 Bit                                    |
| **`int16`**          | Ganze Zahl, 16 Bit                                   |
| **`int32`**          | Ganze Zahl, 32 Bit (Standard für int)                |
| **`int64`**          | Ganze Zahl, 64 Bit                                   |
| **`uint8`**          | Ganze Zahl, 8 Bit, positiv                           |
| **`uint16`**         | Ganze Zahl, 16 Bit, positiv                          |
| **`uint32`**         | Ganze Zahl, 32 Bit, positiv                          |
| **`uint64`**         | Ganze Zahl, 64 Bit, positiv                          |
| **`float16`**        | Fließkommazahl, 16 Bit (geringe Genauigkeit)         |
| **`float32`**        | Fließkommazahl, 32 Bit                               |
| **`float64`**        | Fließkommazahl, 64 Bit (Standard für float)          |
| **`bool`**           | Boolescher Wert (True/False)                         |
| **`object`**         | Beliebiger Python-Objekttyp                          |
| **`string`**         | Pandas-eigener Stringtyp (mit NA-Unterstützung)      |
| **`category`**       | Kategorischer Typ (für wenig verschiedene Textwerte) |
| **`datetime64[ns]`** | Datum/Zeit-Typ im Nanosekundenformat                 |
| **`timedelta[ns]`**  | Zeitdifferenz-Typ im Nanosekundenformat              |


### 2.1   Unterschiede bzw. pandas-spezifische Ergänzungen

1. **`string`**: kein `object` mehr, kann sauber mit fehlenden Werten umgehen
2. **`category`**: für Zellen mit wenigen verschiedenen Werten (z. B. Geschlecht = männlich oder weiblich)
3. Datum: `datetime64[ns]` und `timedelta[ns]`

### 2.2   Angabe des Datentyps

```python
df = pd.read_csv('daten.csv', dtype={'Alter': 'int32', 'Name': 'string'})
```

Änderung des Datentyps:

```python
df['Alter'] = df['Alter'].astype('float')
df['Datum'] = pd.to_datetime(df['Datum'])
```

## 3   Daten laden und speichern

```python
df = pd.read_csv('datei.csv')     # CSV-Datei
df = pd.read_excel('datei.xlsx')  # Excel-Datei
df = pd.read_json('datei.json')   # JSON-Datei
```

```python
df.to_csv('neu.csv', index=False)
df.to_excel('neu.xlsx')
df.to_json('neu.xlsx')
```

## 4   Serie erstellen

`Series` ist ein eindimensionales, beschriftetes Array, das Daten beliebigen Typs enthalten kann. Die Achsenbeschriftungen werden gemeinsam als `index` bezeichnet.

Die grundlegende Methode zur Erstellung einer Series ist der Aufruf:

```python
s = pd.Series(data, index=index)
```

`data` muss ein iterierbares Objekt sein, z. B. `list` oder `np.ndarray`.

**Beispiel:**

```python
data = pd.Series(
    [0.25, 0.5, 0.75, 1.0],
    index=['a', 'b', 'c', 'd'],
)
```

## 5   DataFrame erstellen

`DataFrame` ist eine zweidimensionale, beschriftete Datenstruktur mit Spalten, die unterschiedliche Datentypen enthalten können.
Man kann sich einen DataFrame wie eine Tabelle in einer Tabellenkalkulation oder SQL-Datenbank bzw. wie ein Dictionary aus `Series`-Objekten vorstellen.
Er ist in der Regel das am häufigsten verwendete `pandas`-Objekt.

Wie bei `Series` akzeptiert der `DataFrame` viele verschiedene Eingabetypen:
- Dictionary aus 1D-ndarrays, Listen, Dictionaries oder Series
- Zwei-dimensionale `numpy.ndarray`
- Strukturierte oder rekordbasierte `ndarray`
- Eine einzelne `Series`
- Ein anderer `DataFrame`

```python
data = {'Name': ['Anna', 'Ben'], 'Alter': [25, 30]}
df = pd.DataFrame(data)
```

## 6   Eigenschaften von Serien und DataFrames

```python
def print_series_info(series: pd.Series) -> None:
    print(f'ndim: {series.ndim}')    # Anzahl der Dimensionen
    print(f'shape: {series.shape}')  # Form (Zeilen, Spalten)
    print(f'size: {series.size}')    # Größe
    print(f'dtype: {series.dtype}')  # Datentyp
    print(f'values:\n{series}\n')    # Werte
```

```python
def print_df_info(df: pd.DataFrame) -> None:
    print(f'ndim: {df.ndim}')     # Anzahl der Dimensionen
    print(f'shape: {df.shape}')   # Form (Zeilen, Spalten)
    print(f'size: {df.size}')     # Größe
    print(f'dtype: {df.dtypes}')  # Datentyp
    print(f'values:\n{df}\n')     # Werte
```

```python
df.head()      # Erste 5 Zeilen
df.tail(3)     # Letzte 3 Zeilen
df.columns     # Spaltennamen
df.info()      # Übersicht
df.describe()  # Statistiken
```

## 7   Basis-Funktionen

### 7.1   Zugriff auf Daten

Wir auf eine Spalte z. B. mit `df['Name']` zugegriffen, wird eine `Series` zurückgegeben.

```python
df['Name']             # Einzelne Spalte
df[['Name', 'Alter']]  # Mehrere Spalten
df.iloc[0]             # Erste Zeile (Position)
df.loc[0]              # Erste Zeile (Label)
df.loc[0, 'Name']      # Einzelner Wert
```

### 7.2   Daten filtern & sortieren

```python
df[df['Alter'] > 25]                      # Bedingung
df.sort_values('Alter', ascending=False)  # Sortieren
```

### 7.3   Spalten bearbeiten

```python
df['Alter_neu'] = df['Alter'] + 1       # Neue Spalte
df.rename(columns={'Name': 'Vorname'})  # Umbenennen
df.drop('Alter_neu', axis=1)            # Spalte löschen
```

### 7.4   Fehlende Werte

```python
df.isnull()   # Wo sind fehlen Werte?
df.dropna()   # Zeilen mit NaN entfernen
df.fillna(0)  # NaN mit 0 ersetzen
```

### 7.5   Gruppieren & Aggregieren

```python
df.groupby('Name').mean()  # Durchschnitt pro Gruppe
df['Alter'].mean()         # Mittelwert
df['Alter'].sum()          # Summe
```


## 8   Iteration über Series und DataFrames in pandas

In `pandas` gibt es verschiedene Möglichkeiten, über Daten zu iterieren – je nachdem, ob man eine **Series** oder einen **DataFrame** vor sich hat. Allerdings ist Iteration oft **langsamer** als Vektoroperationen. Nur verwenden, wenn nötig!

### 8.1   Über eine Series iterieren

```python
s = pd.Series([10, 20, 30])

for wert in s:
    print(wert)
```

### 8.2   Über Zeilen eines DataFrames iterieren

#### 8.2.1   `iterrows()`: Zeilenweise als (Index, Series)

```python
for index, row in df.iterrows():
    print(index, row['Spalte1'], row['Spalte2'])
```
- ✅ Einfach zu verstehen
- ⚠️ Langsam bei großen Datenmengen, siehe [[pandas#13.1 Keine Python-Schleifen verwenden]]

#### 8.2.2   `itertuples()`: Zeilenweise als NamedTuple

```python
for row in df.itertuples():
    print(row.Index, row.Spalte1, row.Spalte2)
```
- ✅ Schneller als `iterrows()`
- ⚠️ Spaltennamen müssen wie Attribute verwendet werden

#### 8.2.3   `apply()`: Elegante, performante Alternative

```python
df['Ergebnis'] = df.apply(lambda row: row['A'] + row['B'], axis=1)
```
- ✅ Besser als Schleifen für Transformationen
- ⚠️ Immer `axis=1` angeben, um über Zeilen zu gehen

### 8.3   Iteration über Spaltennamen

```python
for spalte in df.columns:
    print(df[spalte].mean())
```

## 9   Umgang mit fehlenden Daten (Missing Data)

Fehlende Werte sind in pandas durch `NaN` (Not a Number) oder `None` gekennzeichnet. pandas bietet leistungsstarke Werkzeuge, um mit ihnen umzugehen.

**Fehlende Werte erkennen**

```python
df.isnull()        # Gibt DataFrame mit True/False zurück
df.notnull()       # Gegenteil von isnull()
df.isnull().sum()  # Anzahl fehlender Werte pro Spalte
```

**Zeilen/Spalten mit fehlenden Werten entfernen**

```python
df.dropna()           # Entfernt Zeilen mit NaN
df.dropna(axis=1)     # Entfernt Spalten mit NaN
df.dropna(how='all')  # Entfernt nur Zeilen, wo alle Werte fehlen
df.dropna(thresh=2)   # Behalte nur Zeilen mit mindestens 2 nicht-null Werten
```

**Fehlende Werte ersetzen**

```python
df.fillna(0)               # NaN mit 0 ersetzen
df.fillna(method='ffill')  # Vorherigen Wert übernehmen (forward fill)
df.fillna(method='bfill')  # Nachfolgenden Wert übernehmen (backward fill)
df.fillna({'A': 0, 'B': 'leer'})  # Spaltenweise unterschiedliche Werte
```

**Werte gezielt setzen**

```python
df.loc[2, 'Spalte'] = None    # Einzelne Zelle auf NaN setzen
```

> [!INFO] Hinweise
> - `NaN` zählt bei `mean()`, `sum()` usw. nicht mit.
> - Wenn man mit Strings arbeitet, verwendet man `pd.NA` und den Datentyp `string`, um sauber mit fehlenden Werten umzugehen.
> - Bei CSV-Importen: `pd.read_csv(..., na_values=["NA", "-", "n/a"])` erkennt eigene Platzhalter als fehlend.
> - Fehlende Daten sind normal - wichtig ist, sie zu erkennen und sinnvoll damit umzugehen!

## 10   Bedingtes Filtern und logische Masken

Ein zentrales Feature von pandas ist die Möglichkeit, gezielt Zeilen auszuwählen, die bestimmten Bedingungen entsprechen - mithilfe von logischen Ausdrücken und boolschen Masken.

### 10.1   Beispiel: Überlebende mit Altersangabe filtern

```python
survived = df['Survived'] == 1  # Überlebende
has_age = df['Age'] > 0         # Altersangabe vorhanden (> 0)
idxs = survived & has_age       # Beide Bedingungen gleichzeitig
df_sliced = df[idxs]            # DataFrame filtern
```

`&` verknüpft Bedingungen logisch (`AND`).

❗ Bedingungen müssen in Klammern gesetzt werden, wenn direkt kombiniert wird:

```python
df[(df['Survived'] == 1) & (df['Age'] > 0)]
```

### 10.2   Werte zählen (z. B. Altersverteilung der Überlebenden)

```python
survived_age_counts = df_sliced['Age'].value_counts()
print(survived_age_counts)
```

- `value_counts()` zählt, wie oft jeder Wert in einer Spalte vorkommt.
- Praktisch für Histogramme, Häufigkeitsanalysen etc.

```python
df[df['Sex'] == 'female']  # Nur Frauen
df[(df['Fare'] > 100) & (df['Pclass'] == 1)]  # Teure Tickets in 1. Klasse
df[df['Cabin'].notnull()]  # Kabinenangabe vorhanden
```

### 10.3   Tipps

- Für komplexe Bedingungen immer Klammern setzen!
- Bedingungen können vorher benannt werden (wie `survived`, `has_age`), das macht Code lesbarer.
- `.value_counts()`, `.mean()`, `.sum()` und andere Funktionen kann man direkt auf gefilterte Daten anwenden.

## 11   DataFrame-Styling mit `df.style`

Mit `pandas.DataFrame.style` kannst du DataFrames visuell aufbereiten - z. B. zur Anzeige in Jupyter Notebooks oder beim Export nach HTML. `df.style` gibt ein `Styler`-Objekt zurück, mit dem man Formatierungen anwenden kann.

### 11.1   Formatierung von Zahlen

#### 11.1.1   Darstellung in Jupyter

```python
df.style.format('{:.2f}')          # Zwei Nachkommastellen
df.style.format({'A': '${:.1f}'})  # Spaltenweise Formatierung
```

```python
import pandas as pd
from IPython.display import display

df = pd.DataFrame({
    'A': [1.23456, 2.34567],
    'B': [3.14159, 2.71828],
    'C': [10, 20]
})

# Spaltenweise Formatierung definieren
format_dict = {
    'A': '{:.1f}',   # 1 Nachkommastelle
    'B': '{:.3f}',   # 3 Nachkommastellen
}

display(df.style.format(format_dict))
```
#### 11.1.2   Konsolenausgabe

**Globale Einstellung:**

```python
# Globale Einstellung für Anzahl der Nachkommastellen
pd.options.display.float_format = '{:.3f}'.format

# ...

# Globale Einstellung zurücksetzen
pd.reset_option('display.float_format')
```

**Explizite Formatierung:**

```python
import pandas as pd

df = pd.DataFrame({
    'A': [1.23456, 2.34567],
    'B': [3.14159, 2.71828],
    'C': [10, 20]
})

# Manuell formatierte Kopie (als Strings)
df_formatted = df.copy()
df_formatted['A'] = df_formatted['A'].map(lambda x: f"{x:.1f}")
df_formatted['B'] = df_formatted['B'].map(lambda x: f"{x:.3f}")

print(df_formatted)
```

Ausgabe:

```
     A      B   C
0  1.2  3.142  10
1  2.3  2.718  20
```

### 11.2   Farben

**Farbverläufe & Hervorhebungen**

```python
df.style.background_gradient(cmap='Blues')  # Farbverlauf nach Werten
df.style.highlight_max(axis=0)              # Höchstwerte markieren
df.style.highlight_min(axis=1)              # Tiefstwerte pro Zeile
df.style.bar(subset=['A", 'B'], color='lightgreen')  # Balken im Hintergrund
```

 **Bedingtes Styling**

```python
def rot_negative(val):
    color = 'red' if val < 0 else 'black'
    return f'color: {color}'

df.style.applymap(rot_negative, subset=['Gewinn'])
```

**Kombinationen & Ketten**

```python
(df.style
   .format('{:.1f}')
   .highlight_null('red')
   .set_caption('Umsatzübersicht')
)
```

> [!INFO] Hinwes
> `df.style` beeinflusst **nur die Darstellung**, nicht den DataFrame selbst. Ideal für Berichte Dashboards oder visuelle Prüfungen.

Weitere Infos: [pandas Styler Doku](https://pandas.pydata.org/pandas-docs/stable/user_guide/style.html)

## 12   Erweiterte Funktionen

### 12.1   Concatenation / Append / Join

Mehrere DataFrames können zu einem neuen kombiniert werden - entweder vertikal (Zeilen anhängen) oder **horizontal** (Spalten zusammenführen):

```python
# Vertikal zusammenfügen (wie append)
df_all = pd.concat([df1, df2], axis=0)

# Horizontal zusammenfügen (wie join)
df_all = pd.concat([df1, df2], axis=1)
```

```python
# DataFrame mit Keys zusammenfügen
df = pd.concat([df1, df2], keys=['x', 'y'])
```

Für Verknüpfungen wie bei SQL:

```python
pd.merge(df1, df2, on='id', how='inner')   # join via Spalte 'id'
pd.merge(df1, df2, left_on='A', right_on='B', how='outer')
```

Einzelne Zeile anhängen:

```python
df.append({'Name': 'Max', 'Alter': 28}, ignore_index=True)
```

### 12.2   Apply / Map

`apply()` ist sehr mächtig, um Funktionen auf Zeilen oder Spalten anzuwenden.

```python
# Spalte transformieren
df['neue_spalte'] = df['alte_spalte'].apply(lambda x: x + 10)
```

```python
# Zeilenweise Funktion
def f(row):
    return row['A'] + row['B']

df['Summe'] = df.apply(f, axis=1)
```

```python
# map() für einzelne Werte in einer Series
s = pd.Series([1, 2, 3])
s.map({1: 'eins', 2: 'zwei'})
```

### 12.3   Zeitserien (Timeseries)

Mit `pandas` lassen sich Zeitreihen effizient analysieren und verarbeiten.

```python
# Zeitreihe erzeugen
dates = pd.date_range('2023-01-01', periods=5, freq='D')
ts = pd.Series([1, 2, 3, 4, 5], index=dates)
```

```python
# Umwandlung zu Datumsobjekten
df['Datum'] = pd.to_datetime(df['Datum'])
```

```python
# Resampling – z. B. pro Monat mitteln
df.resample('M').mean()
```

```python
# Zeitdifferenzen berechnen
df['delta'] = df['Ende'] - df['Start']
```

### 12.4   Split-Apply-Combine (GroupBy)

Ein zentrales Muster in `pandas`:

1. Daten in Gruppen aufteilen (`split`)
2. Funktion anwenden (`apply`)
3. Ergebnis zusammenführen (`combine`)

```python
# Gruppieren nach Kategorie
grouped = df.groupby('Kategorie')

# Mittelwerte pro Gruppe
grouped.mean()  # oder .min, .max, count, ...
```

```python
# Mehrere Gruppierungen und Aggregationen
grouped = df.groupby(['Survived', 'Sex'])
grouped.Age.agg(['min', 'max', 'median', 'mean'])
```

```python
# Mehrere Aggregationen gleichzeitig
df.groupby('Gruppe').agg({
    'Umsatz': ['sum', 'mean'],
    'Anzahl': 'count'
})
```

```python
# Gruppenspezifische Transformation
df['z-Score'] = grouped['Wert'].transform(lambda x: (x - x.mean()) / x.std())
```

## 13   Performance-Optimierung

Große Datenmengen lassen sich durch gezielte Optimierungen effizienter verarbeiten.

### 13.1   Keine Python-Schleifen verwenden

Der folgende Code ist extrem langsam (Ausführungszeit ca. 500 ms):

```python
col = 'A'
for _, row in df.iterrows():
	if row[col] < 0.5:
		row[col] = 0.0
```

Deutlich schneller ist es mit lambda-Funktion (Ausführungszeit ca. 2,4 ms):

```python
df['A'] = df['A'].apply(lambda x: 0.0 if x < 0.5 else x)
```

Noch schneller ist es mit `where`-Methode (Ausführungszeit ca. 250 µs) :

```python
df['A'] = np.where(df['C'] < 0.5, 0.0, df['C'])
```

**Vektorisierung statt Schleifen**

```python
# Statt: df['x_neu'] = [x+1 for x in df['x']]
df['x_neu'] = df['x'] + 1
```

### 13.2   Daten aufbereiten

**Datentypen verkleinern**

```python
df['int_spalte'] = df['int_spalte'].astype('int32')
df['float_spalte'] = df['float_spalte'].astype('float32')
```

**Nur benötigte Spalten laden**

```python
pd.read_csv('daten.csv', usecols=['Name', 'Alter'])
```

### 13.3   Weitere Möglichkeiten

Weitere Leistungssteigerungen kann man durch die Verwendung von [Cython](https://cython.org) oder [Numba](https://numba.pydata.org) erreichen. Beide generieren C-Code. Da dieser maschinennäher ist, erreicht damit eine geringere Ausführungszeit


