# sql-tag-system-koa-route

koa route for working with sql-tag-system

## API

```ts
export interface ConnectionInfo {
  host: string;
  user: string;
  database: string;
  password: string;
  waitForConnections?: boolean;
  connectionLimit?: number;
  queueLimit?: number;
}
```
