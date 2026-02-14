# Matplotlib und Seaborn

Matplotlib und Seaborn sind zwei Bibliotheken zur Datenvisualisierung - also zum Erstellen von Diagrammen und Grafiken,n. Hier eine einfache Erklärung.

**Matplotlib**
- Eine grundlegende Bibliothek zur Visualisierung.
- Ermöglicht die Erstellung von Diagrammen.
- Sehr flexibel und anpassbar, jedoch manchmal etwas kompliziert und "low-level".
- Das Modul `pyplot` (oft importiert als `plt`) ist der am häufigsten genutzte Teil.

**Seaborn**
- Baut auf Matplotlib auf - eine Erweiterung, die einfacher zu nutzen ist.
- Hat ein schöneres Design und liefert automatisch ansprechende Diagramme.
- Besonders gut für statistische Grafiken wie Boxplots, Violinplots, Heatmaps usw.
- Ist auf die Verwendung mit Pandas-DataFrames ausgelegt.
- Für das gleiche Ergebnis benötigt man mit Matplotlib häufig deutlich mehr Code als mit Seaborn.

> [!INFO] Kurz gesagt:
> - Matplotlib = leistungsstark & flexibel (manchmal jedoch umständlich)
> - Seaborn = einfacher, schöner & perfekt für schnelle Analysen

## 1   Matplotlib

### 1.1   Grundlagen

#### 1.1.1   Import

```python
%matplotlib inline
import matplotlib.pyplot as plt
plt.style.use('dark_background')
```

Wie `np` bei NumPy und `pd` bei Pandas ist `plt` eine geläufige Bezeichnung und sollte nicht geändert werden.

#### 1.1.2   Zeichnen einer Funktion

```python
# x-Werte definieren
x = np.linspace(
    start=0,
    stop=2 * np.pi,
    num=50,
)

# Grafik und Axen initialisieren
fig = plt.figure()
ax = plt.axes()

# Funktion festlegen
y = np.sin(x)

# Grafik zeichnen und anzeigen
ax.plot(x, y)
plt.show()
```

#### 1.1.3   Plotten einer Linie

```python
x = [1, 2, 3, 4]
y = [10, 20, 25, 30]
plt.plot(x, y)
plt.show()
```

#### 1.1.4   Achsenbeschriftung, Titel & Legende

```python
plt.plot(x, y, label='Werte')
plt.xlabel('X-Achse')
plt.ylabel('Y-Achse')
plt.title('Ein einfacher Plot')
plt.legend()
plt.show()
```

#### 1.1.5   Linienstil, Marker, Farben

```python
plt.plot(x, y, color='red', linestyle='--', linewidth=2, marker='o', markersize=8)
```

### 1.2   Diagrammtypen

#### 1.2.1   Scatter Plot

```python
plt.scatter(x, y, color='blue', marker='x', s=100, alpha=0.7)
```

#### 1.2.2   Balkendiagramm

```python
plt.bar(['A', 'B', 'C'], [10, 20, 15], color='green')
plt.barh(['A', 'B', 'C'], [10, 20, 15], color='orange')
```

#### 1.2.3   Histogramm

```python
data = [1, 2, 2, 3, 3, 3, 4, 4, 5]
plt.hist(data, bins=5, color='purple', edgecolor='black')
```

#### 1.2.4   Boxplot

```python
data1 = [1, 2, 5, 7, 8]
data2 = [2, 3, 6, 8, 9]
plt.boxplot([data1, data2], labels=['Gruppe 1', 'Gruppe 2'])
```

#### 1.2.5   Mehrere Subplots

```python
plt.figure(figsize=(10, 5))
plt.subplot(1, 2, 1)
plt.plot(x, y)
plt.subplot(1, 2, 2)
plt.bar(x, y)
plt.tight_layout()
plt.show()
```

#### 1.2.6   Speichern

```python
plt.savefig('mein_plot.png', dpi=300, bbox_inches='tight')
```

---

## 2   Seaborn

```python
import seaborn as sns
import matplotlib.pyplot as plt
df = sns.load_dataset('tips')
```

### 2.1   Stil und Themes

```python
sns.set_style('whitegrid')
sns.set_context('notebook')
```

### 2.2   Plots nach Datentyp

#### 2.2.1   Line Plot

```python
sns.lineplot(data=df, x='total_bill', y='tip')
```

#### 2.2.2   Scatter Plot mit Gruppierung

```python
sns.scatterplot(data=df, x='total_bill', y='tip', hue='sex', style='smoker', size='size')
```

#### 2.2.3   Histogramm & Verteilung

```python
sns.histplot(df['total_bill'], kde=True, bins=20)
sns.kdeplot(df['total_bill'], fill=True)
```

#### 2.2.4   Boxplot & Violinplot

```python
sns.boxplot(data=df, x='day', y='total_bill', hue='sex')
sns.violinplot(data=df, x='day', y='total_bill', inner='quartile')
```

#### 2.2.5   Stripplot & Swarmplot

```python
sns.stripplot(data=df, x='day', y='total_bill', jitter=True)
sns.swarmplot(data=df, x='day', y='total_bill')
```

### 2.3   Korrelation & Matrix-Plots

#### 2.3.1   Heatmap

```python
corr = df.corr(numeric_only=True)
sns.heatmap(corr, annot=True, cmap='coolwarm', linewidths=0.5)
```

#### 2.3.2   Pairplot

```python
sns.pairplot(df, hue='sex', diag_kind='kde')
```

#### 2.3.3   Jointplot

```python
sns.jointplot(data=df, x='total_bill', y='tip', kind='reg')
```

---

### 2.4   Nützliche Tipps & Tricks

| Aufgabe            | Matplotlib                   | Seaborn                                       |
| ------------------ | ---------------------------- | --------------------------------------------- |
| Farbe ändern       | `color='red'`                | `palette='pastel'` oder `hue="Kategorie"`     |
| Transparenz        | `alpha=0.5`                  | `alpha=0.5`                                   |
| Figurgröße         | `plt.figure(figsize=(8, 4))` | `plt.figure(figsize=(8, 4))` davor verwenden  |
| Achsenticks drehen | `plt.xticks(rotation=45)`    | `plt.xticks(rotation=45)`                     |
| Farbschema         | --                           | `palette='Set2'` (oder 'deep', 'muted', etc.) |
| Theme              | --                           | `sns.set_style('darkgrid')`                   |

