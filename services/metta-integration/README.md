# AfriVerse MeTTa Integration

Symbolic AI integration for representing cultural knowledge as MeTTa atoms and running lightweight reasoning.

## Components

- **`metta_client.py`**: Minimal Python client for MeTTa runtime.
- **`example_atoms.met`**: Sample atoms for plants, properties, treatments, and simple rules.

## Runtime

- MeTTa server (community project) expected to run as an HTTP service.
- Configure base URL via `METTA_API_URL` (default `http://localhost:8080`).

## Quickstart

1. Start MeTTa server (reference MeTTa docs for install/run):
```
metta --server --port 8080
```

2. Use the client:
```python
from metta_client import MeTTaClient

client = MeTTaClient("http://localhost:8080")
client.add_atoms([
    '(plant "aloe_vera")',
    '(treats "aloe_vera" "burn")'
])
res = client.query('(treats ?p "burn")')
print(res)
```

## Common Predicates

- `(plant <name>)`
- `(property <subject> <value>)`
- `(treats <plant> <condition>)`
- `(used_for <subject> <purpose>)`
- `(found_in <subject> <region>)`
- `(provenance <subject> <type> <value>)`

## Backend Integration

- `services/backend/src/services/mettaService.js` exposes:
  - `evaluateExpression()`
  - `addAtoms()` / `queryAtoms()` with in-memory fallback

## Notes

- This directory provides examples and client utilities only; the production code path uses the Node `MeTTaService` wrapper.
