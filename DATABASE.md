# ThunderPOS Enterprise Database Design

## Overview
- **Primary Keys**: UUIDv7 (String in SQLite, UUID in Postgres).
- **Soft Deletes**: `deleted_at` timestamp.
- **Sync Support**: `version` and `synced_at` columns on all syncable tables.

## Tables

### 1. Management (Remote Only)
- `companies`: Multi-tenant root.
- `subscriptions`: Plan details.

### 2. Security & Licensing (Local Cache & Remote)
- `users`: Local login and remote management.
- `roles` / `permissions`: RBAC.
- `licenses`: Device activation details.

### 3. POS Operations (Local & Remote Sync)
- `products`: Catalog items.
- `categories`: Product grouping.
- `customers`: Profiles and loyalty.
- `suppliers`: Purchase sources.
- `sales`: Transaction headers.
- `sale_items`: Transaction details.
- `inventory_log`: Stock movement history.
- `expenses`: Business costs.

### 4. Sync Mechanism (Local Only)
- `sync_queue`:
  - `id`: UUID
  - `table_name`: string
  - `record_id`: UUID
  - `action`: 'INSERT' | 'UPDATE' | 'DELETE'
  - `payload`: JSON
  - `created_at`: Timestamp

## Schema (SQL Example)
```sql
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    sku TEXT UNIQUE,
    barcode TEXT,
    price REAL NOT NULL,
    cost REAL NOT NULL,
    category_id TEXT,
    stock_count INTEGER DEFAULT 0,
    version INTEGER DEFAULT 1,
    synced_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);
```
