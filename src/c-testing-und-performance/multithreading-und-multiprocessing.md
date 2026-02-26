# Multithreading und Multiprocessing

## 1    Begriffsdefinitionen

> [!INFO] I/O-bound Performance
> - Eine Aufgabe ist I/O-bound, wenn sie viel Zeit mit Input/Output verbringt, z. B.:
> 	- Auf Netzwerkdaten warten
> 	- Dateien lesen/schreiben
> 	- Datenbankabfragen
> - Die CPU ist dabei oft untätig → Warten auf externe Ressourcen.
>
> Bei I/O-bound Tasks helfen Threads oder Asyncio besonders gut, weil sie während der Wartezeit andere Aufgaben erledigen können.

> [!INFO] CPU-bound Performance
> - Eine Aufgabe ist CPU-bound, wenn sie hauptsächlich die Prozessorleistung beansprucht (z. B. große Berechnungen, Datenkompression).
> - Je schneller der Prozessor, desto schneller die Aufgabe.
> - Beispiel: Primzahlen berechnen, Matrixmultiplikation.
>
> Bei CPU-bound Tasks ist der GIL ein Problem in Threads – daher ist Multiprocessing hier besser.

> [!INFO] Global Interpreter Lock (GIL)
> - GIL = Python-Sperre, die nur einen Thread zur Zeit Bytecode ausführen lässt (bei CPython).
> - Begrenzt die Effizienz von Multithreading bei CPU-bound Tasks (z. B. große Berechnungen).
> - Umgehbar durch Multiprocessing oder C-Extensions.

> [!INFO] IPC (Inter-Process Communication)
> - Prozesse haben getrennte Speicherbereiche → sie teilen keine Variablen.
> - Daher braucht man IPC, um Daten auszutauschen:
> 	- z. B. Queue, Pipe, Shared Memory, Sockets.
>
> **Beispiel mit `multiprocessing.Queue`:**
>
> ```python
> from multiprocessing import Process, Queue
>
> def worker(q):
>     q.put('Hallo aus dem Prozess')
>
> q = Queue()
> p = Process(target=worker, args=(q,))
> p.start()
> print(q.get())  # Ausgabe: Hallo aus dem Prozess
> p.join()
> ```

> [!INFO] Event Loop
> - Das Herzstück von Asyncio.
> - Der Event Loop verwaltet alle Tasks, die gerade laufen oder darauf warten, weiterzumachen.
> - Bei `await` wird eine Task "geparkt", und der Loop schaut, ob eine andere weiterlaufen kann.
>
> **Beispiel mit einem Loop:**
>
> ```python
> import asyncio
>
> async def task():
>     print('Task läuft')
>     await asyncio.sleep(1)
>     print('Task beendet')
>
> loop = asyncio.get_event_loop()
> loop.run_until_complete(task())
> ```


## 2    Multithreading (concurrently, gleichzeitig)

- Leichtgewichtig: Laufen im gleichen Prozessspeicherraum (alle Threads gehören zu einem Prozess).
- Schnell beim Starten (schneller, als einen neuen Prozess zu starten).
- Shared memory: Teilen sich Speicher (z. B. Variablen, Objekte).
	- kann Vor- oder Nachteil sein; ist buganfälliger
- Ideal für I/O-bound Tasks (z. B. Netzwerk, Datei lesen).
- Werden durch den Global Interpreter Lock (GIL) begrenzt – nur ein Thread kann zur gleichen Zeit Python-Bytecode ausführen.

```
             +--------------+
             | Main Process |
             +--------------+
                     |
      +--------------+-------------+
      |              |             |
      v              v             v
+----------+   +----------+  +----------+
| Thread 1 |   | Thread 2 |  | Thread 3 |
+----------+   +----------+  +----------+

   (teilen sich Speicher & Ressourcen)
```


**Beispiel:**

```python
import threading
import time

def worker():
    print('Thread startet')
    time.sleep(2)
    print('Thread endet')

t1 = threading.Thread(target=worker)
t2 = threading.Thread(target=worker)

t1.start()
t2.start()

t1.join()
t2.join()
```

## 3    Multiprocessing (parallel)

- Jeder Prozess hat eigenen Speicher, läuft unabhängig.
- Es neuen Prozess zu starten ist langsamer, als einen neuen Thread zu starten.
- Kein GIL-Problem → besser für CPU-bound Tasks.
- Kein gemeinsamer Speicher → Interprozess-Kommunikation (IPC) nötig.
- Kommunikation zwischen Prozessen ist aufwändiger (z. B. mit Queues, Pipes).

```
+-----------+       +-----------+       +-----------+
| Process 1 |       | Process 2 |       | Process 3 |
|           |       |           |       |           |
| Eigener   |       | Eigener   |       | Eigener   |
| Speicher  |       | Speicher  |       | Speicher  |
+-----------+       +-----------+       +-----------+
      |                   |                   |
      +-------- IPC ------+-------- IPC ------+

        (z. B. Queues, Pipes, Sockets)
```

**Beispiel:**

```python
import multiprocessing
import time

def worker():
    print('Prozess startet')
    time.sleep(2)
    print('Prozess endet')

p1 = multiprocessing.Process(target=worker)
p2 = multiprocessing.Process(target=worker)

p1.start()
p2.start()

p1.join()
p2.join()
```

## 4    Threads vs Processes

| Kriterium             | Threads                        | Processes             |
| --------------------- | ------------------------------ | --------------------- |
| Speicher              | Gemeinsamer Speicher           | Getrennter Speicher   |
| Startzeit             | Schnell                        | Etwas langsamer       |
| CPU-bound Performance | Schlecht (wegen GIL)           | Gut                   |
| I/O-bound Performance | Gut                            | Gut                   |
| Kommunikation         | Einfach (gemeinsamer Speicher) | Komplexer (IPC nötig) |
| Nutzung des GIL       | Ja                             | Nein                  |

## 5    Asyncio (Asynchrone Programmierung)

- Für gleichzeitige Tasks, ohne neue Threads/Prozesse.
- Ideal für viele I/O-bound Tasks (z. B. viele Netzwerkanfragen) unabhängig vom eigentlichen Programm; d. h. wenn man auf ein Event von einem externen Programm wartet.
	- Die CPU kann andere Aufgaben erledigen, während auf das externe Event gewartet wird.
- Arbeitet mit dem Event Loop.

**Beispiel:**

```python
import asyncio

async def say_hello():
    print('Hello')
    await asyncio.sleep(1)
    print('World')

asyncio.run(say_hello())
```

## 6    `asyncio.gather`

- Führt mehrere coroutines gleichzeitig aus.
- Wartet auf alle coroutines, gibt ihre Ergebnisse als Liste zurück.

```python
import asyncio

async def task(n):
    print(f'Task {n} startet')
    await asyncio.sleep(n)
    print(f'Task {n} endet')
    return n * 10

async def main():
    results = await asyncio.gather(
        task(1),
        task(2),
        task(3)
    )
    print('Ergebnisse:', results)

asyncio.run(main())
```

## 7    Vergleich aller Methoden

| Kriterium         | 🧵 Threading | 💥 Multiprocessing  | ⚡ Asyncio             |
| ----------------- | ------------ | ------------------- | --------------------- |
| Parallel?         | Ja (pseudo)  | Ja (echt)           | Ja (kooperativ)       |
| GIL betroffen?    | ✅ Ja         | ❌ Nein              | ✅ Ja                  |
| Für CPU-bound?    | 🚫 Nein      | ✅ Ja                | 🚫 Nein               |
| Für I/O-bound?    | ✅ Ja         | 😐 Mäßig geeignet   | ✅ Ja                  |
| Speicher          | Gemeinsam    | Getrennt            | Gemeinsam (1 Thread)  |
| Kommunikation     | Einfach      | Komplex (IPC nötig) | Intern (await/gather) |
| Nutzung von Tasks | Threads      | Prozesse            | Coroutines            |
| Startzeit         | Schnell      | Langsamer           | Sehr schnell          |
| Schwierigkeit     | 😊 Einfach   | 😓 Schwer           | 😌 Mittel             |
