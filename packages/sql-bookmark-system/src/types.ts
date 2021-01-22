export type { ConnectionInfo } from '@almaclaine/mysql-utils';

export interface Bookmark {
  id: string;
  hostname: string;
  pathname: string;
  date_added: Date;
}
