import { join } from 'path/posix';
import { createConnection } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () =>
      await createConnection({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'ms',
        password: 'ms',
        database: 'ms_db',
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: true,
      }),
  },
];
