import Objection from 'objection';

const { Model, snakeCaseMappers } = Objection;

/**
 * Base model that maps between camelCase (JSON/JS) and snake_case (DB).
 * All models should extend this when using snake_case columns.
 */
export abstract class BaseModel extends Model {
  static query<T extends BaseModel>(
    this: new () => T,
    trxOrKnex?: Objection.TransactionOrKnex,
  ): Objection.QueryBuilder<T> {
    return Model.query.call(this, trxOrKnex) as Objection.QueryBuilder<T>;
  }

  static get columnNameMappers() {
    return snakeCaseMappers();
  }
}
