import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import knex, { type Knex } from 'knex';
import { bindKnex } from './models';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private _knex: Knex | null = null;

  onModuleInit(): void {
    void this.knex;
  }

  get knex(): Knex {
    if (!this._knex) {
      this._knex = knex({
        client: 'pg',
        connection: process.env.DATABASE_URL,
        pool: { min: 1, max: 10 },
      });
      bindKnex(this._knex);
    }
    return this._knex;
  }

  async onModuleDestroy(): Promise<void> {
    if (this._knex) {
      await this._knex.destroy();
      this._knex = null;
    }
  }
}
