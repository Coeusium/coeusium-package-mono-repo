# sql-tag-system

sql based tagging system utility library.

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
