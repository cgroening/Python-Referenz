HTTP-Requests sind das Rückgrat moderner Web-APIs. Dieses Kapitel behandelt synchrone Requests mit `requests` und asynchrone Requests mit `aiohttp` sowie Best Practices für API-Kommunikation.

## 1    Die `requests`-Bibliothek

`requests` ist die Standard-Bibliothek für HTTP-Requests in Python – einfach, elegant und mächtig.

### 1.1    Installation

```bash
pip install requests
```

### 1.2    Grundlegende GET-Requests

```python
import requests

# Einfacher GET-Request
response = requests.get('https://api.github.com')

# Response-Attribute
print(response.status_code)      # 200
print(response.text)              # Response-Body als String
print(response.content)           # Response-Body als Bytes
print(response.json())            # JSON automatisch parsen
print(response.headers)           # Response-Headers
print(response.url)               # Finale URL (nach Redirects)
print(response.encoding)          # Encoding (z.B. 'utf-8')
```

### 1.3    Status-Code prüfen

```python
response = requests.get('https://api.github.com/user')

# Manuell prüfen
if response.status_code == 200:
    print('Success!')
elif response.status_code == 404:
    print('Not Found')

# Automatisch Exception werfen bei Fehler (empfohlen)
response.raise_for_status()  # Wirft HTTPError bei 4xx/5xx

# Mit try-except
try:
    response = requests.get('https://api.example.com/data')
    response.raise_for_status()
    data = response.json()
except requests.exceptions.HTTPError as e:
    print(f'HTTP Error: {e}')
except requests.exceptions.RequestException as e:
    print(f'Request failed: {e}')
```

## 2    HTTP-Methoden

### 2.1    GET – Daten abrufen

```python
# Mit Query-Parametern
params = {'q': 'python', 'sort': 'stars'}
response = requests.get('https://api.github.com/search/repositories', 
                        params=params)
# URL: https://api.github.com/search/repositories?q=python&sort=stars

print(response.json()['total_count'])
```

### 2.2    POST – Daten senden

```python
# JSON-Daten senden
data = {'title': 'foo', 'body': 'bar', 'userId': 1}
response = requests.post('https://jsonplaceholder.typicode.com/posts', 
                         json=data)

print(response.status_code)  # 201 Created
print(response.json())

# Formulardaten senden (application/x-www-form-urlencoded)
form_data = {'username': 'john', 'password': 'secret'}
response = requests.post('https://example.com/login', data=form_data)
```

### 2.3    PUT – Daten aktualisieren

```python
# Gesamtes Objekt ersetzen
data = {'title': 'Updated Title', 'body': 'Updated Body', 'userId': 1}
response = requests.put('https://jsonplaceholder.typicode.com/posts/1', 
                        json=data)
```

### 2.4    PATCH – Teilaktualisierung

```python
# Nur einzelne Felder aktualisieren
data = {'title': 'New Title'}
response = requests.patch('https://jsonplaceholder.typicode.com/posts/1', 
                          json=data)
```

### 2.5    DELETE – Ressource löschen

```python
response = requests.delete('https://jsonplaceholder.typicode.com/posts/1')
print(response.status_code)  # 200 oder 204 No Content
```

## 3    Headers und Authentication

### 3.1    Custom Headers

```python
headers = {
    'User-Agent': 'MyApp/1.0',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

response = requests.get('https://api.example.com/data', headers=headers)
```

### 3.2    Basic Authentication

```python
from requests.auth import HTTPBasicAuth

# Variante 1: Mit auth-Parameter
response = requests.get('https://api.example.com/user', 
                        auth=('username', 'password'))

# Variante 2: Explizit mit HTTPBasicAuth
auth = HTTPBasicAuth('username', 'password')
response = requests.get('https://api.example.com/user', auth=auth)
```

### 3.3    Bearer Token (API Keys)

```python
# Typisch für moderne APIs (OAuth, JWT)
token = 'your_api_token_here'
headers = {'Authorization': f'Bearer {token}'}

response = requests.get('https://api.github.com/user', headers=headers)
```

### 3.4    API Key in Query-Parameter

```python
# Manche APIs nutzen Query-Parameter für Keys
params = {'api_key': 'your_api_key'}
response = requests.get('https://api.example.com/data', params=params)
```

## 4    Sessions – Persistente Verbindungen

Sessions ermöglichen wiederverwendbare Konfiguration und Connection-Pooling.

### 4.1    Session-Grundlagen

```python
# Ohne Session (neue Verbindung pro Request)
response1 = requests.get('https://api.example.com/data')
response2 = requests.get('https://api.example.com/data')

# Mit Session (wiederverwendete Verbindung)
with requests.Session() as session:
    # Headers gelten für alle Requests in der Session
    session.headers.update({'Authorization': 'Bearer token123'})
    
    response1 = session.get('https://api.example.com/data')
    response2 = session.get('https://api.example.com/users')
    # Beide Requests nutzen denselben Header
```

### 4.2    Session mit Cookies

```python
session = requests.Session()

# Login (setzt Cookies)
login_data = {'username': 'user', 'password': 'pass'}
session.post('https://example.com/login', data=login_data)

# Weitere Requests nutzen automatisch die Cookies
response = session.get('https://example.com/dashboard')

# Cookies manuell setzen
session.cookies.set('session_id', 'abc123', domain='example.com')
```

### 4.3    Session-Konfiguration

```python
session = requests.Session()

# Default-Parameter für alle Requests
session.headers.update({'User-Agent': 'MyApp/1.0'})
session.params = {'api_key': 'key123'}  # Query-Parameter
session.verify = True  # SSL-Zertifikate prüfen (Standard)
session.timeout = 10   # Timeout in Sekunden

# Alle Requests in Session nutzen diese Einstellungen
response = session.get('https://api.example.com/data')
```

## 5    Timeouts und Retries

### 5.1    Timeouts

```python
# Timeout in Sekunden
try:
    response = requests.get('https://api.example.com/slow', timeout=5)
except requests.exceptions.Timeout:
    print('Request timed out')

# Verschiedene Timeouts für Connect und Read
response = requests.get('https://api.example.com/data', 
                        timeout=(3.05, 10))  # (connect, read)

# Kein Timeout (nicht empfohlen!)
response = requests.get('https://api.example.com/data', timeout=None)
```

### 5.2    Automatische Retries

```python
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# Retry-Strategie konfigurieren
retry_strategy = Retry(
    total=3,                          # Maximale Anzahl Retries
    backoff_factor=1,                 # Wartezeit: 1s, 2s, 4s, ...
    status_forcelist=[429, 500, 502, 503, 504],  # Bei diesen Status-Codes
    allowed_methods=["GET", "POST"]   # Nur für diese Methoden
)

adapter = HTTPAdapter(max_retries=retry_strategy)

session = requests.Session()
session.mount("http://", adapter)
session.mount("https://", adapter)

# Request mit automatischen Retries
response = session.get('https://api.example.com/data')
```

## 6    Datei-Uploads und Downloads

### 6.1    Datei hochladen

```python
# Einfacher Upload
with open('document.pdf', 'rb') as f:
    files = {'file': f}
    response = requests.post('https://api.example.com/upload', files=files)

# Mit Dateinamen und MIME-Type
with open('image.jpg', 'rb') as f:
    files = {
        'file': ('custom_name.jpg', f, 'image/jpeg')
    }
    response = requests.post('https://api.example.com/upload', files=files)

# Mehrere Dateien
files = {
    'file1': open('doc1.pdf', 'rb'),
    'file2': open('doc2.pdf', 'rb')
}
response = requests.post('https://api.example.com/upload', files=files)
```

### 6.2    Datei herunterladen

```python
# Kleine Dateien (komplette Response im RAM)
response = requests.get('https://example.com/image.jpg')
with open('downloaded_image.jpg', 'wb') as f:
    f.write(response.content)

# Große Dateien (streaming)
response = requests.get('https://example.com/largefile.zip', stream=True)
with open('largefile.zip', 'wb') as f:
    for chunk in response.iter_content(chunk_size=8192):
        f.write(chunk)

# Mit Progress Bar (benötigt tqdm)
from tqdm import tqdm

response = requests.get('https://example.com/largefile.zip', stream=True)
total_size = int(response.headers.get('content-length', 0))

with open('largefile.zip', 'wb') as f, tqdm(
    total=total_size, unit='B', unit_scale=True
) as pbar:
    for chunk in response.iter_content(chunk_size=8192):
        f.write(chunk)
        pbar.update(len(chunk))
```

## 7    JSON-Handling

### 7.1    JSON empfangen

```python
response = requests.get('https://api.github.com/users/torvalds')

# JSON automatisch parsen
data = response.json()
print(data['name'])        # Linus Torvalds
print(data['location'])    # Portland

# Fehlerbehandlung
try:
    data = response.json()
except requests.exceptions.JSONDecodeError:
    print('Response is not valid JSON')
```

### 7.2    JSON senden

```python
# json-Parameter setzt automatisch Content-Type: application/json
payload = {
    'name': 'John Doe',
    'email': 'john@example.com',
    'age': 30
}

response = requests.post('https://api.example.com/users', json=payload)

# Äquivalent zu:
import json
headers = {'Content-Type': 'application/json'}
response = requests.post('https://api.example.com/users', 
                         data=json.dumps(payload),
                         headers=headers)
```

## 8    Error Handling

### 8.1    Exception-Hierarchie

```python
from requests.exceptions import (
    RequestException,      # Basis-Exception
    ConnectionError,       # Verbindungsfehler
    Timeout,              # Timeout
    HTTPError,            # 4xx/5xx Status-Codes
    TooManyRedirects,     # Zu viele Redirects
    URLRequired,          # URL fehlt
)

def safe_request(url):
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        return response.json()
    
    except Timeout:
        print('Request timed out')
    except ConnectionError:
        print('Failed to connect')
    except HTTPError as e:
        print(f'HTTP Error: {e.response.status_code}')
    except RequestException as e:
        print(f'Request failed: {e}')
    
    return None
```

### 8.2    Status-Code Handling

```python
response = requests.get('https://api.example.com/data')

# Kategorien prüfen
if response.ok:                    # 200-299
    print('Success')
elif 400 <= response.status_code < 500:
    print('Client error')
elif 500 <= response.status_code < 600:
    print('Server error')

# Spezifische Codes
status_handlers = {
    200: lambda: print('OK'),
    201: lambda: print('Created'),
    400: lambda: print('Bad Request'),
    401: lambda: print('Unauthorized'),
    404: lambda: print('Not Found'),
    500: lambda: print('Server Error')
}

handler = status_handlers.get(response.status_code)
if handler:
    handler()
```

## 9    Asynchrone Requests mit `aiohttp`

Für viele parallele Requests ist `aiohttp` deutlich schneller als `requests`.

### 9.1    Installation

```bash
pip install aiohttp
```

### 9.2    Einfacher GET-Request

```python
import aiohttp
import asyncio

async def fetch_data(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            print(f'Status: {response.status}')
            data = await response.json()
            return data

# Ausführen
asyncio.run(fetch_data('https://api.github.com'))
```

### 9.3    Mehrere parallele Requests

```python
import aiohttp
import asyncio

async def fetch_url(session, url):
    async with session.get(url) as response:
        return await response.json()

async def fetch_all(urls):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
        return results

# Ausführen
urls = [
    'https://api.github.com/users/torvalds',
    'https://api.github.com/users/gvanrossum',
    'https://api.github.com/users/kennethreitz',
]

results = asyncio.run(fetch_all(urls))
for result in results:
    print(result['name'])
```

### 9.4    POST mit aiohttp

```python
async def post_data(url, payload):
    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=payload) as response:
            return await response.json()

payload = {'title': 'Test', 'body': 'Content'}
result = asyncio.run(post_data('https://jsonplaceholder.typicode.com/posts', 
                                payload))
```

### 9.5    Headers und Authentication

```python
async def fetch_with_auth(url, token):
    headers = {'Authorization': f'Bearer {token}'}
    
    async with aiohttp.ClientSession(headers=headers) as session:
        async with session.get(url) as response:
            return await response.json()

# Timeout
timeout = aiohttp.ClientTimeout(total=10)
async with aiohttp.ClientSession(timeout=timeout) as session:
    async with session.get(url) as response:
        data = await response.json()
```

### 9.6    Session wiederverwenden

```python
async def fetch_multiple(urls):
    # Session nur einmal erstellen (effizienter)
    async with aiohttp.ClientSession() as session:
        tasks = []
        for url in urls:
            task = asyncio.create_task(fetch_url(session, url))
            tasks.append(task)
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return results

async def fetch_url(session, url):
    try:
        async with session.get(url) as response:
            return await response.json()
    except Exception as e:
        return {'error': str(e)}
```

### 9.7    Rate Limiting mit Semaphore

```python
import asyncio
import aiohttp

async def fetch_with_limit(session, url, semaphore):
    async with semaphore:  # Maximale parallele Requests begrenzen
        async with session.get(url) as response:
            return await response.json()

async def fetch_all_limited(urls, max_concurrent=5):
    semaphore = asyncio.Semaphore(max_concurrent)
    
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_with_limit(session, url, semaphore) for url in urls]
        results = await asyncio.gather(*tasks)
        return results

# Maximal 5 parallele Requests
urls = [f'https://api.example.com/item/{i}' for i in range(100)]
results = asyncio.run(fetch_all_limited(urls, max_concurrent=5))
```

## 10    Best Practices

### 10.1    Immer Timeouts setzen

```python
# ❌ Schlecht: Kein Timeout (kann ewig hängen)
response = requests.get('https://api.example.com/data')

# ✅ Gut: Timeout definieren
response = requests.get('https://api.example.com/data', timeout=10)

# ✅ Besser: Verschiedene Timeouts
response = requests.get('https://api.example.com/data', 
                        timeout=(3, 10))  # connect, read
```

### 10.2    Sessions für mehrere Requests

```python
# ❌ Schlecht: Neue Verbindung pro Request
for i in range(100):
    response = requests.get(f'https://api.example.com/item/{i}')

# ✅ Gut: Session wiederverwendet Verbindung
with requests.Session() as session:
    for i in range(100):
        response = session.get(f'https://api.example.com/item/{i}')
```

### 10.3    Error Handling nicht vergessen

```python
# ✅ Immer raise_for_status() verwenden
try:
    response = requests.get('https://api.example.com/data')
    response.raise_for_status()  # Exception bei 4xx/5xx
    data = response.json()
except requests.exceptions.RequestException as e:
    logger.error(f'API request failed: {e}')
```

### 10.4    User-Agent setzen

```python
# Viele APIs blockieren Requests ohne User-Agent
headers = {'User-Agent': 'MyApp/1.0 (contact@example.com)'}
response = requests.get('https://api.example.com/data', headers=headers)
```

### 10.5    Secrets nicht im Code

```python
# ❌ Schlecht: API-Key im Code
API_KEY = 'sk_live_abc123xyz'

# ✅ Gut: Aus Umgebungsvariablen
import os
API_KEY = os.getenv('API_KEY')

# ✅ Oder aus .env-Datei (mit python-dotenv)
from dotenv import load_dotenv
load_dotenv()
API_KEY = os.getenv('API_KEY')
```

### 10.6    Rate Limiting respektieren

```python
import time
from datetime import datetime, timedelta

class RateLimiter:
    def __init__(self, max_calls, period):
        self.max_calls = max_calls
        self.period = period  # in seconds
        self.calls = []
    
    def wait_if_needed(self):
        now = datetime.now()
        # Alte Calls entfernen
        self.calls = [call for call in self.calls 
                      if now - call < timedelta(seconds=self.period)]
        
        if len(self.calls) >= self.max_calls:
            sleep_time = (self.calls[0] + timedelta(seconds=self.period) - now).total_seconds()
            time.sleep(sleep_time)
            self.calls = []
        
        self.calls.append(now)

# Verwendung: Max 10 Requests pro Minute
limiter = RateLimiter(max_calls=10, period=60)

for i in range(100):
    limiter.wait_if_needed()
    response = requests.get(f'https://api.example.com/item/{i}')
```

## 11    Praxisbeispiele

### 11.1    GitHub API Wrapper

```python
class GitHubAPI:
    BASE_URL = 'https://api.github.com'
    
    def __init__(self, token=None):
        self.session = requests.Session()
        if token:
            self.session.headers.update({
                'Authorization': f'Bearer {token}',
                'Accept': 'application/vnd.github.v3+json'
            })
        self.session.headers.update({'User-Agent': 'MyGitHubApp/1.0'})
    
    def get_user(self, username):
        response = self.session.get(f'{self.BASE_URL}/users/{username}')
        response.raise_for_status()
        return response.json()
    
    def get_repos(self, username):
        response = self.session.get(f'{self.BASE_URL}/users/{username}/repos')
        response.raise_for_status()
        return response.json()
    
    def close(self):
        self.session.close()

# Verwendung
api = GitHubAPI(token='ghp_xxxxx')
user = api.get_user('torvalds')
repos = api.get_repos('torvalds')
api.close()
```

### 11.2    REST API mit Pagination

```python
def fetch_all_pages(base_url, params=None):
    """Holt alle Seiten einer paginierten API"""
    all_data = []
    page = 1
    
    with requests.Session() as session:
        while True:
            params_with_page = {**(params or {}), 'page': page}
            response = session.get(base_url, params=params_with_page)
            response.raise_for_status()
            
            data = response.json()
            
            if not data:  # Keine weiteren Daten
                break
            
            all_data.extend(data)
            page += 1
    
    return all_data

# Verwendung
all_users = fetch_all_pages('https://api.example.com/users')
```

### 11.3    Async Batch Processing

```python
import aiohttp
import asyncio
from typing import List, Dict, Any

async def process_batch(items: List[str], 
                       batch_size: int = 10) -> List[Dict[Any, Any]]:
    """Verarbeitet Items in Batches asynchron"""
    results = []
    
    async with aiohttp.ClientSession() as session:
        for i in range(0, len(items), batch_size):
            batch = items[i:i + batch_size]
            tasks = [fetch_item(session, item) for item in batch]
            batch_results = await asyncio.gather(*tasks, return_exceptions=True)
            results.extend(batch_results)
    
    return results

async def fetch_item(session, item_id):
    url = f'https://api.example.com/items/{item_id}'
    try:
        async with session.get(url, timeout=5) as response:
            return await response.json()
    except Exception as e:
        return {'error': str(e), 'item_id': item_id}

# Verwendung
item_ids = list(range(1, 101))
results = asyncio.run(process_batch(item_ids, batch_size=10))
```

### 11.4    Retry mit exponential backoff

```python
import time
import random

def retry_with_backoff(func, max_retries=3, base_delay=1):
    """Führt Funktion mit exponential backoff retry aus"""
    for attempt in range(max_retries):
        try:
            return func()
        except requests.exceptions.RequestException as e:
            if attempt == max_retries - 1:  # Letzter Versuch
                raise
            
            # Exponential backoff mit Jitter
            delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
            print(f'Retry {attempt + 1}/{max_retries} after {delay:.2f}s')
            time.sleep(delay)

# Verwendung
def make_request():
    response = requests.get('https://api.example.com/data', timeout=5)
    response.raise_for_status()
    return response.json()

data = retry_with_backoff(make_request, max_retries=3)
```

## 12    Vergleich: requests vs. aiohttp

| Kriterium              | `requests`                | `aiohttp`                     |
| ---------------------- | ------------------------- | ----------------------------- |
| Synchron/Async         | Synchron (blocking)       | Asynchron (non-blocking)      |
| Performance (single)   | ✅ Ausreichend            | ⚠️ Etwas Overhead             |
| Performance (parallel) | ❌ Langsam (sequenziell)  | ✅ Sehr schnell               |
| Einfachheit            | ✅ Sehr einfach           | ⚠️ Async-Kenntnisse nötig     |
| Use Cases              | Normale Scripts, CLI-Tools| Web Scraping, viele APIs      |
| HTTP/2 Support         | ❌                        | ✅ (mit aioh2)                |
| Ecosystem              | ✅ Riesig                 | ✅ Wachsend                   |

**Faustregel:**
- **`requests`**: Für normale Scripts, wenige (<10) Requests, Einfachheit
- **`aiohttp`**: Für viele parallele Requests (>50), Web Scraping, Performance-kritisch

## 13    Zusammenfassung

| Thema                  | Verwendung                                           |
| ---------------------- | ---------------------------------------------------- |
| `requests.get()`       | Daten von API abrufen                                |
| `requests.post()`      | Daten an API senden                                  |
| `response.json()`      | JSON automatisch parsen                              |
| `response.raise_for_status()` | Exception bei Fehler-Status werfen            |
| `Session()`            | Verbindungen wiederverwenden                         |
| `timeout`              | Maximale Wartezeit definieren                        |
| `headers`              | Custom Headers, Authentication                       |
| `aiohttp`              | Asynchrone Requests für hohe Parallelität            |

**Kernprinzipien:**
- Immer Timeouts setzen
- Sessions für mehrere Requests nutzen
- Error Handling nicht vergessen (`raise_for_status()`)
- Rate Limits respektieren
- API-Keys aus Umgebungsvariablen laden
- Für viele parallele Requests `aiohttp` verwenden
