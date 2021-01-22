export type { ConnectionInfo } from '@almaclaine/mysql-utils';

export interface CategorySet {
  id: string;
  name: string;
}

export interface Category {
  set_id: string;
  id: string;
  name: string;
  parent?: string;
}
