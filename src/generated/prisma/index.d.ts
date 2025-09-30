
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Instituciones
 * 
 */
export type Instituciones = $Result.DefaultSelection<Prisma.$InstitucionesPayload>
/**
 * Model Sedes
 * 
 */
export type Sedes = $Result.DefaultSelection<Prisma.$SedesPayload>
/**
 * Model Administradores
 * 
 */
export type Administradores = $Result.DefaultSelection<Prisma.$AdministradoresPayload>
/**
 * Model PasswordResetTokens
 * 
 */
export type PasswordResetTokens = $Result.DefaultSelection<Prisma.$PasswordResetTokensPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Instituciones
 * const instituciones = await prisma.instituciones.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Instituciones
   * const instituciones = await prisma.instituciones.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.instituciones`: Exposes CRUD operations for the **Instituciones** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Instituciones
    * const instituciones = await prisma.instituciones.findMany()
    * ```
    */
  get instituciones(): Prisma.InstitucionesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sedes`: Exposes CRUD operations for the **Sedes** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sedes
    * const sedes = await prisma.sedes.findMany()
    * ```
    */
  get sedes(): Prisma.SedesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.administradores`: Exposes CRUD operations for the **Administradores** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Administradores
    * const administradores = await prisma.administradores.findMany()
    * ```
    */
  get administradores(): Prisma.AdministradoresDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.passwordResetTokens`: Exposes CRUD operations for the **PasswordResetTokens** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PasswordResetTokens
    * const passwordResetTokens = await prisma.passwordResetTokens.findMany()
    * ```
    */
  get passwordResetTokens(): Prisma.PasswordResetTokensDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.16.2
   * Query Engine version: 1c57fdcd7e44b29b9313256c76699e91c3ac3c43
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Instituciones: 'Instituciones',
    Sedes: 'Sedes',
    Administradores: 'Administradores',
    PasswordResetTokens: 'PasswordResetTokens'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "instituciones" | "sedes" | "administradores" | "passwordResetTokens"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Instituciones: {
        payload: Prisma.$InstitucionesPayload<ExtArgs>
        fields: Prisma.InstitucionesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InstitucionesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitucionesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InstitucionesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitucionesPayload>
          }
          findFirst: {
            args: Prisma.InstitucionesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitucionesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InstitucionesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitucionesPayload>
          }
          findMany: {
            args: Prisma.InstitucionesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitucionesPayload>[]
          }
          create: {
            args: Prisma.InstitucionesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitucionesPayload>
          }
          createMany: {
            args: Prisma.InstitucionesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InstitucionesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitucionesPayload>[]
          }
          delete: {
            args: Prisma.InstitucionesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitucionesPayload>
          }
          update: {
            args: Prisma.InstitucionesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitucionesPayload>
          }
          deleteMany: {
            args: Prisma.InstitucionesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InstitucionesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InstitucionesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitucionesPayload>[]
          }
          upsert: {
            args: Prisma.InstitucionesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitucionesPayload>
          }
          aggregate: {
            args: Prisma.InstitucionesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInstituciones>
          }
          groupBy: {
            args: Prisma.InstitucionesGroupByArgs<ExtArgs>
            result: $Utils.Optional<InstitucionesGroupByOutputType>[]
          }
          count: {
            args: Prisma.InstitucionesCountArgs<ExtArgs>
            result: $Utils.Optional<InstitucionesCountAggregateOutputType> | number
          }
        }
      }
      Sedes: {
        payload: Prisma.$SedesPayload<ExtArgs>
        fields: Prisma.SedesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SedesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SedesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SedesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SedesPayload>
          }
          findFirst: {
            args: Prisma.SedesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SedesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SedesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SedesPayload>
          }
          findMany: {
            args: Prisma.SedesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SedesPayload>[]
          }
          create: {
            args: Prisma.SedesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SedesPayload>
          }
          createMany: {
            args: Prisma.SedesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SedesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SedesPayload>[]
          }
          delete: {
            args: Prisma.SedesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SedesPayload>
          }
          update: {
            args: Prisma.SedesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SedesPayload>
          }
          deleteMany: {
            args: Prisma.SedesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SedesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SedesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SedesPayload>[]
          }
          upsert: {
            args: Prisma.SedesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SedesPayload>
          }
          aggregate: {
            args: Prisma.SedesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSedes>
          }
          groupBy: {
            args: Prisma.SedesGroupByArgs<ExtArgs>
            result: $Utils.Optional<SedesGroupByOutputType>[]
          }
          count: {
            args: Prisma.SedesCountArgs<ExtArgs>
            result: $Utils.Optional<SedesCountAggregateOutputType> | number
          }
        }
      }
      Administradores: {
        payload: Prisma.$AdministradoresPayload<ExtArgs>
        fields: Prisma.AdministradoresFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AdministradoresFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdministradoresPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdministradoresFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdministradoresPayload>
          }
          findFirst: {
            args: Prisma.AdministradoresFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdministradoresPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdministradoresFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdministradoresPayload>
          }
          findMany: {
            args: Prisma.AdministradoresFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdministradoresPayload>[]
          }
          create: {
            args: Prisma.AdministradoresCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdministradoresPayload>
          }
          createMany: {
            args: Prisma.AdministradoresCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AdministradoresCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdministradoresPayload>[]
          }
          delete: {
            args: Prisma.AdministradoresDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdministradoresPayload>
          }
          update: {
            args: Prisma.AdministradoresUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdministradoresPayload>
          }
          deleteMany: {
            args: Prisma.AdministradoresDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AdministradoresUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AdministradoresUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdministradoresPayload>[]
          }
          upsert: {
            args: Prisma.AdministradoresUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdministradoresPayload>
          }
          aggregate: {
            args: Prisma.AdministradoresAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdministradores>
          }
          groupBy: {
            args: Prisma.AdministradoresGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdministradoresGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdministradoresCountArgs<ExtArgs>
            result: $Utils.Optional<AdministradoresCountAggregateOutputType> | number
          }
        }
      }
      PasswordResetTokens: {
        payload: Prisma.$PasswordResetTokensPayload<ExtArgs>
        fields: Prisma.PasswordResetTokensFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PasswordResetTokensFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokensPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PasswordResetTokensFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokensPayload>
          }
          findFirst: {
            args: Prisma.PasswordResetTokensFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokensPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PasswordResetTokensFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokensPayload>
          }
          findMany: {
            args: Prisma.PasswordResetTokensFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokensPayload>[]
          }
          create: {
            args: Prisma.PasswordResetTokensCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokensPayload>
          }
          createMany: {
            args: Prisma.PasswordResetTokensCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PasswordResetTokensCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokensPayload>[]
          }
          delete: {
            args: Prisma.PasswordResetTokensDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokensPayload>
          }
          update: {
            args: Prisma.PasswordResetTokensUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokensPayload>
          }
          deleteMany: {
            args: Prisma.PasswordResetTokensDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PasswordResetTokensUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PasswordResetTokensUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokensPayload>[]
          }
          upsert: {
            args: Prisma.PasswordResetTokensUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokensPayload>
          }
          aggregate: {
            args: Prisma.PasswordResetTokensAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePasswordResetTokens>
          }
          groupBy: {
            args: Prisma.PasswordResetTokensGroupByArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetTokensGroupByOutputType>[]
          }
          count: {
            args: Prisma.PasswordResetTokensCountArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetTokensCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    instituciones?: InstitucionesOmit
    sedes?: SedesOmit
    administradores?: AdministradoresOmit
    passwordResetTokens?: PasswordResetTokensOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type InstitucionesCountOutputType
   */

  export type InstitucionesCountOutputType = {
    administradores: number
    sedes: number
  }

  export type InstitucionesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    administradores?: boolean | InstitucionesCountOutputTypeCountAdministradoresArgs
    sedes?: boolean | InstitucionesCountOutputTypeCountSedesArgs
  }

  // Custom InputTypes
  /**
   * InstitucionesCountOutputType without action
   */
  export type InstitucionesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitucionesCountOutputType
     */
    select?: InstitucionesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * InstitucionesCountOutputType without action
   */
  export type InstitucionesCountOutputTypeCountAdministradoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdministradoresWhereInput
  }

  /**
   * InstitucionesCountOutputType without action
   */
  export type InstitucionesCountOutputTypeCountSedesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SedesWhereInput
  }


  /**
   * Count Type SedesCountOutputType
   */

  export type SedesCountOutputType = {
    administradores: number
  }

  export type SedesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    administradores?: boolean | SedesCountOutputTypeCountAdministradoresArgs
  }

  // Custom InputTypes
  /**
   * SedesCountOutputType without action
   */
  export type SedesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SedesCountOutputType
     */
    select?: SedesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SedesCountOutputType without action
   */
  export type SedesCountOutputTypeCountAdministradoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdministradoresWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Instituciones
   */

  export type AggregateInstituciones = {
    _count: InstitucionesCountAggregateOutputType | null
    _avg: InstitucionesAvgAggregateOutputType | null
    _sum: InstitucionesSumAggregateOutputType | null
    _min: InstitucionesMinAggregateOutputType | null
    _max: InstitucionesMaxAggregateOutputType | null
  }

  export type InstitucionesAvgAggregateOutputType = {
    id: number | null
  }

  export type InstitucionesSumAggregateOutputType = {
    id: number | null
  }

  export type InstitucionesMinAggregateOutputType = {
    id: number | null
    nombre: string | null
    direccion_principal: string | null
    nit: string | null
    nombre_contacto: string | null
    telefono_contacto: string | null
    email: string | null
    password: string | null
    tiene_sedes: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type InstitucionesMaxAggregateOutputType = {
    id: number | null
    nombre: string | null
    direccion_principal: string | null
    nit: string | null
    nombre_contacto: string | null
    telefono_contacto: string | null
    email: string | null
    password: string | null
    tiene_sedes: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type InstitucionesCountAggregateOutputType = {
    id: number
    nombre: number
    direccion_principal: number
    nit: number
    nombre_contacto: number
    telefono_contacto: number
    email: number
    password: number
    tiene_sedes: number
    jornadas: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type InstitucionesAvgAggregateInputType = {
    id?: true
  }

  export type InstitucionesSumAggregateInputType = {
    id?: true
  }

  export type InstitucionesMinAggregateInputType = {
    id?: true
    nombre?: true
    direccion_principal?: true
    nit?: true
    nombre_contacto?: true
    telefono_contacto?: true
    email?: true
    password?: true
    tiene_sedes?: true
    created_at?: true
    updated_at?: true
  }

  export type InstitucionesMaxAggregateInputType = {
    id?: true
    nombre?: true
    direccion_principal?: true
    nit?: true
    nombre_contacto?: true
    telefono_contacto?: true
    email?: true
    password?: true
    tiene_sedes?: true
    created_at?: true
    updated_at?: true
  }

  export type InstitucionesCountAggregateInputType = {
    id?: true
    nombre?: true
    direccion_principal?: true
    nit?: true
    nombre_contacto?: true
    telefono_contacto?: true
    email?: true
    password?: true
    tiene_sedes?: true
    jornadas?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type InstitucionesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Instituciones to aggregate.
     */
    where?: InstitucionesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Instituciones to fetch.
     */
    orderBy?: InstitucionesOrderByWithRelationInput | InstitucionesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InstitucionesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Instituciones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Instituciones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Instituciones
    **/
    _count?: true | InstitucionesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InstitucionesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InstitucionesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InstitucionesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InstitucionesMaxAggregateInputType
  }

  export type GetInstitucionesAggregateType<T extends InstitucionesAggregateArgs> = {
        [P in keyof T & keyof AggregateInstituciones]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInstituciones[P]>
      : GetScalarType<T[P], AggregateInstituciones[P]>
  }




  export type InstitucionesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InstitucionesWhereInput
    orderBy?: InstitucionesOrderByWithAggregationInput | InstitucionesOrderByWithAggregationInput[]
    by: InstitucionesScalarFieldEnum[] | InstitucionesScalarFieldEnum
    having?: InstitucionesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InstitucionesCountAggregateInputType | true
    _avg?: InstitucionesAvgAggregateInputType
    _sum?: InstitucionesSumAggregateInputType
    _min?: InstitucionesMinAggregateInputType
    _max?: InstitucionesMaxAggregateInputType
  }

  export type InstitucionesGroupByOutputType = {
    id: number
    nombre: string
    direccion_principal: string
    nit: string
    nombre_contacto: string
    telefono_contacto: string
    email: string
    password: string
    tiene_sedes: boolean
    jornadas: string[]
    created_at: Date
    updated_at: Date
    _count: InstitucionesCountAggregateOutputType | null
    _avg: InstitucionesAvgAggregateOutputType | null
    _sum: InstitucionesSumAggregateOutputType | null
    _min: InstitucionesMinAggregateOutputType | null
    _max: InstitucionesMaxAggregateOutputType | null
  }

  type GetInstitucionesGroupByPayload<T extends InstitucionesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InstitucionesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InstitucionesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InstitucionesGroupByOutputType[P]>
            : GetScalarType<T[P], InstitucionesGroupByOutputType[P]>
        }
      >
    >


  export type InstitucionesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    direccion_principal?: boolean
    nit?: boolean
    nombre_contacto?: boolean
    telefono_contacto?: boolean
    email?: boolean
    password?: boolean
    tiene_sedes?: boolean
    jornadas?: boolean
    created_at?: boolean
    updated_at?: boolean
    administradores?: boolean | Instituciones$administradoresArgs<ExtArgs>
    sedes?: boolean | Instituciones$sedesArgs<ExtArgs>
    _count?: boolean | InstitucionesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["instituciones"]>

  export type InstitucionesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    direccion_principal?: boolean
    nit?: boolean
    nombre_contacto?: boolean
    telefono_contacto?: boolean
    email?: boolean
    password?: boolean
    tiene_sedes?: boolean
    jornadas?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["instituciones"]>

  export type InstitucionesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    direccion_principal?: boolean
    nit?: boolean
    nombre_contacto?: boolean
    telefono_contacto?: boolean
    email?: boolean
    password?: boolean
    tiene_sedes?: boolean
    jornadas?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["instituciones"]>

  export type InstitucionesSelectScalar = {
    id?: boolean
    nombre?: boolean
    direccion_principal?: boolean
    nit?: boolean
    nombre_contacto?: boolean
    telefono_contacto?: boolean
    email?: boolean
    password?: boolean
    tiene_sedes?: boolean
    jornadas?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type InstitucionesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "direccion_principal" | "nit" | "nombre_contacto" | "telefono_contacto" | "email" | "password" | "tiene_sedes" | "jornadas" | "created_at" | "updated_at", ExtArgs["result"]["instituciones"]>
  export type InstitucionesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    administradores?: boolean | Instituciones$administradoresArgs<ExtArgs>
    sedes?: boolean | Instituciones$sedesArgs<ExtArgs>
    _count?: boolean | InstitucionesCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type InstitucionesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type InstitucionesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $InstitucionesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Instituciones"
    objects: {
      administradores: Prisma.$AdministradoresPayload<ExtArgs>[]
      sedes: Prisma.$SedesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nombre: string
      direccion_principal: string
      nit: string
      nombre_contacto: string
      telefono_contacto: string
      email: string
      password: string
      tiene_sedes: boolean
      jornadas: string[]
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["instituciones"]>
    composites: {}
  }

  type InstitucionesGetPayload<S extends boolean | null | undefined | InstitucionesDefaultArgs> = $Result.GetResult<Prisma.$InstitucionesPayload, S>

  type InstitucionesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InstitucionesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InstitucionesCountAggregateInputType | true
    }

  export interface InstitucionesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Instituciones'], meta: { name: 'Instituciones' } }
    /**
     * Find zero or one Instituciones that matches the filter.
     * @param {InstitucionesFindUniqueArgs} args - Arguments to find a Instituciones
     * @example
     * // Get one Instituciones
     * const instituciones = await prisma.instituciones.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InstitucionesFindUniqueArgs>(args: SelectSubset<T, InstitucionesFindUniqueArgs<ExtArgs>>): Prisma__InstitucionesClient<$Result.GetResult<Prisma.$InstitucionesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Instituciones that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InstitucionesFindUniqueOrThrowArgs} args - Arguments to find a Instituciones
     * @example
     * // Get one Instituciones
     * const instituciones = await prisma.instituciones.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InstitucionesFindUniqueOrThrowArgs>(args: SelectSubset<T, InstitucionesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InstitucionesClient<$Result.GetResult<Prisma.$InstitucionesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Instituciones that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitucionesFindFirstArgs} args - Arguments to find a Instituciones
     * @example
     * // Get one Instituciones
     * const instituciones = await prisma.instituciones.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InstitucionesFindFirstArgs>(args?: SelectSubset<T, InstitucionesFindFirstArgs<ExtArgs>>): Prisma__InstitucionesClient<$Result.GetResult<Prisma.$InstitucionesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Instituciones that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitucionesFindFirstOrThrowArgs} args - Arguments to find a Instituciones
     * @example
     * // Get one Instituciones
     * const instituciones = await prisma.instituciones.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InstitucionesFindFirstOrThrowArgs>(args?: SelectSubset<T, InstitucionesFindFirstOrThrowArgs<ExtArgs>>): Prisma__InstitucionesClient<$Result.GetResult<Prisma.$InstitucionesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Instituciones that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitucionesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Instituciones
     * const instituciones = await prisma.instituciones.findMany()
     * 
     * // Get first 10 Instituciones
     * const instituciones = await prisma.instituciones.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const institucionesWithIdOnly = await prisma.instituciones.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InstitucionesFindManyArgs>(args?: SelectSubset<T, InstitucionesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InstitucionesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Instituciones.
     * @param {InstitucionesCreateArgs} args - Arguments to create a Instituciones.
     * @example
     * // Create one Instituciones
     * const Instituciones = await prisma.instituciones.create({
     *   data: {
     *     // ... data to create a Instituciones
     *   }
     * })
     * 
     */
    create<T extends InstitucionesCreateArgs>(args: SelectSubset<T, InstitucionesCreateArgs<ExtArgs>>): Prisma__InstitucionesClient<$Result.GetResult<Prisma.$InstitucionesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Instituciones.
     * @param {InstitucionesCreateManyArgs} args - Arguments to create many Instituciones.
     * @example
     * // Create many Instituciones
     * const instituciones = await prisma.instituciones.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InstitucionesCreateManyArgs>(args?: SelectSubset<T, InstitucionesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Instituciones and returns the data saved in the database.
     * @param {InstitucionesCreateManyAndReturnArgs} args - Arguments to create many Instituciones.
     * @example
     * // Create many Instituciones
     * const instituciones = await prisma.instituciones.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Instituciones and only return the `id`
     * const institucionesWithIdOnly = await prisma.instituciones.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InstitucionesCreateManyAndReturnArgs>(args?: SelectSubset<T, InstitucionesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InstitucionesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Instituciones.
     * @param {InstitucionesDeleteArgs} args - Arguments to delete one Instituciones.
     * @example
     * // Delete one Instituciones
     * const Instituciones = await prisma.instituciones.delete({
     *   where: {
     *     // ... filter to delete one Instituciones
     *   }
     * })
     * 
     */
    delete<T extends InstitucionesDeleteArgs>(args: SelectSubset<T, InstitucionesDeleteArgs<ExtArgs>>): Prisma__InstitucionesClient<$Result.GetResult<Prisma.$InstitucionesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Instituciones.
     * @param {InstitucionesUpdateArgs} args - Arguments to update one Instituciones.
     * @example
     * // Update one Instituciones
     * const instituciones = await prisma.instituciones.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InstitucionesUpdateArgs>(args: SelectSubset<T, InstitucionesUpdateArgs<ExtArgs>>): Prisma__InstitucionesClient<$Result.GetResult<Prisma.$InstitucionesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Instituciones.
     * @param {InstitucionesDeleteManyArgs} args - Arguments to filter Instituciones to delete.
     * @example
     * // Delete a few Instituciones
     * const { count } = await prisma.instituciones.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InstitucionesDeleteManyArgs>(args?: SelectSubset<T, InstitucionesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Instituciones.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitucionesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Instituciones
     * const instituciones = await prisma.instituciones.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InstitucionesUpdateManyArgs>(args: SelectSubset<T, InstitucionesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Instituciones and returns the data updated in the database.
     * @param {InstitucionesUpdateManyAndReturnArgs} args - Arguments to update many Instituciones.
     * @example
     * // Update many Instituciones
     * const instituciones = await prisma.instituciones.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Instituciones and only return the `id`
     * const institucionesWithIdOnly = await prisma.instituciones.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends InstitucionesUpdateManyAndReturnArgs>(args: SelectSubset<T, InstitucionesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InstitucionesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Instituciones.
     * @param {InstitucionesUpsertArgs} args - Arguments to update or create a Instituciones.
     * @example
     * // Update or create a Instituciones
     * const instituciones = await prisma.instituciones.upsert({
     *   create: {
     *     // ... data to create a Instituciones
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Instituciones we want to update
     *   }
     * })
     */
    upsert<T extends InstitucionesUpsertArgs>(args: SelectSubset<T, InstitucionesUpsertArgs<ExtArgs>>): Prisma__InstitucionesClient<$Result.GetResult<Prisma.$InstitucionesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Instituciones.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitucionesCountArgs} args - Arguments to filter Instituciones to count.
     * @example
     * // Count the number of Instituciones
     * const count = await prisma.instituciones.count({
     *   where: {
     *     // ... the filter for the Instituciones we want to count
     *   }
     * })
    **/
    count<T extends InstitucionesCountArgs>(
      args?: Subset<T, InstitucionesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InstitucionesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Instituciones.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitucionesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InstitucionesAggregateArgs>(args: Subset<T, InstitucionesAggregateArgs>): Prisma.PrismaPromise<GetInstitucionesAggregateType<T>>

    /**
     * Group by Instituciones.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitucionesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InstitucionesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InstitucionesGroupByArgs['orderBy'] }
        : { orderBy?: InstitucionesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InstitucionesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInstitucionesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Instituciones model
   */
  readonly fields: InstitucionesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Instituciones.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InstitucionesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    administradores<T extends Instituciones$administradoresArgs<ExtArgs> = {}>(args?: Subset<T, Instituciones$administradoresArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdministradoresPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sedes<T extends Instituciones$sedesArgs<ExtArgs> = {}>(args?: Subset<T, Instituciones$sedesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SedesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Instituciones model
   */
  interface InstitucionesFieldRefs {
    readonly id: FieldRef<"Instituciones", 'Int'>
    readonly nombre: FieldRef<"Instituciones", 'String'>
    readonly direccion_principal: FieldRef<"Instituciones", 'String'>
    readonly nit: FieldRef<"Instituciones", 'String'>
    readonly nombre_contacto: FieldRef<"Instituciones", 'String'>
    readonly telefono_contacto: FieldRef<"Instituciones", 'String'>
    readonly email: FieldRef<"Instituciones", 'String'>
    readonly password: FieldRef<"Instituciones", 'String'>
    readonly tiene_sedes: FieldRef<"Instituciones", 'Boolean'>
    readonly jornadas: FieldRef<"Instituciones", 'String[]'>
    readonly created_at: FieldRef<"Instituciones", 'DateTime'>
    readonly updated_at: FieldRef<"Instituciones", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Instituciones findUnique
   */
  export type InstitucionesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Instituciones
     */
    select?: InstitucionesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Instituciones
     */
    omit?: InstitucionesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitucionesInclude<ExtArgs> | null
    /**
     * Filter, which Instituciones to fetch.
     */
    where: InstitucionesWhereUniqueInput
  }

  /**
   * Instituciones findUniqueOrThrow
   */
  export type InstitucionesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Instituciones
     */
    select?: InstitucionesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Instituciones
     */
    omit?: InstitucionesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitucionesInclude<ExtArgs> | null
    /**
     * Filter, which Instituciones to fetch.
     */
    where: InstitucionesWhereUniqueInput
  }

  /**
   * Instituciones findFirst
   */
  export type InstitucionesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Instituciones
     */
    select?: InstitucionesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Instituciones
     */
    omit?: InstitucionesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitucionesInclude<ExtArgs> | null
    /**
     * Filter, which Instituciones to fetch.
     */
    where?: InstitucionesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Instituciones to fetch.
     */
    orderBy?: InstitucionesOrderByWithRelationInput | InstitucionesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Instituciones.
     */
    cursor?: InstitucionesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Instituciones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Instituciones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Instituciones.
     */
    distinct?: InstitucionesScalarFieldEnum | InstitucionesScalarFieldEnum[]
  }

  /**
   * Instituciones findFirstOrThrow
   */
  export type InstitucionesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Instituciones
     */
    select?: InstitucionesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Instituciones
     */
    omit?: InstitucionesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitucionesInclude<ExtArgs> | null
    /**
     * Filter, which Instituciones to fetch.
     */
    where?: InstitucionesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Instituciones to fetch.
     */
    orderBy?: InstitucionesOrderByWithRelationInput | InstitucionesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Instituciones.
     */
    cursor?: InstitucionesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Instituciones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Instituciones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Instituciones.
     */
    distinct?: InstitucionesScalarFieldEnum | InstitucionesScalarFieldEnum[]
  }

  /**
   * Instituciones findMany
   */
  export type InstitucionesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Instituciones
     */
    select?: InstitucionesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Instituciones
     */
    omit?: InstitucionesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitucionesInclude<ExtArgs> | null
    /**
     * Filter, which Instituciones to fetch.
     */
    where?: InstitucionesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Instituciones to fetch.
     */
    orderBy?: InstitucionesOrderByWithRelationInput | InstitucionesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Instituciones.
     */
    cursor?: InstitucionesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Instituciones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Instituciones.
     */
    skip?: number
    distinct?: InstitucionesScalarFieldEnum | InstitucionesScalarFieldEnum[]
  }

  /**
   * Instituciones create
   */
  export type InstitucionesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Instituciones
     */
    select?: InstitucionesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Instituciones
     */
    omit?: InstitucionesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitucionesInclude<ExtArgs> | null
    /**
     * The data needed to create a Instituciones.
     */
    data: XOR<InstitucionesCreateInput, InstitucionesUncheckedCreateInput>
  }

  /**
   * Instituciones createMany
   */
  export type InstitucionesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Instituciones.
     */
    data: InstitucionesCreateManyInput | InstitucionesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Instituciones createManyAndReturn
   */
  export type InstitucionesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Instituciones
     */
    select?: InstitucionesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Instituciones
     */
    omit?: InstitucionesOmit<ExtArgs> | null
    /**
     * The data used to create many Instituciones.
     */
    data: InstitucionesCreateManyInput | InstitucionesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Instituciones update
   */
  export type InstitucionesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Instituciones
     */
    select?: InstitucionesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Instituciones
     */
    omit?: InstitucionesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitucionesInclude<ExtArgs> | null
    /**
     * The data needed to update a Instituciones.
     */
    data: XOR<InstitucionesUpdateInput, InstitucionesUncheckedUpdateInput>
    /**
     * Choose, which Instituciones to update.
     */
    where: InstitucionesWhereUniqueInput
  }

  /**
   * Instituciones updateMany
   */
  export type InstitucionesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Instituciones.
     */
    data: XOR<InstitucionesUpdateManyMutationInput, InstitucionesUncheckedUpdateManyInput>
    /**
     * Filter which Instituciones to update
     */
    where?: InstitucionesWhereInput
    /**
     * Limit how many Instituciones to update.
     */
    limit?: number
  }

  /**
   * Instituciones updateManyAndReturn
   */
  export type InstitucionesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Instituciones
     */
    select?: InstitucionesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Instituciones
     */
    omit?: InstitucionesOmit<ExtArgs> | null
    /**
     * The data used to update Instituciones.
     */
    data: XOR<InstitucionesUpdateManyMutationInput, InstitucionesUncheckedUpdateManyInput>
    /**
     * Filter which Instituciones to update
     */
    where?: InstitucionesWhereInput
    /**
     * Limit how many Instituciones to update.
     */
    limit?: number
  }

  /**
   * Instituciones upsert
   */
  export type InstitucionesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Instituciones
     */
    select?: InstitucionesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Instituciones
     */
    omit?: InstitucionesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitucionesInclude<ExtArgs> | null
    /**
     * The filter to search for the Instituciones to update in case it exists.
     */
    where: InstitucionesWhereUniqueInput
    /**
     * In case the Instituciones found by the `where` argument doesn't exist, create a new Instituciones with this data.
     */
    create: XOR<InstitucionesCreateInput, InstitucionesUncheckedCreateInput>
    /**
     * In case the Instituciones was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InstitucionesUpdateInput, InstitucionesUncheckedUpdateInput>
  }

  /**
   * Instituciones delete
   */
  export type InstitucionesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Instituciones
     */
    select?: InstitucionesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Instituciones
     */
    omit?: InstitucionesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitucionesInclude<ExtArgs> | null
    /**
     * Filter which Instituciones to delete.
     */
    where: InstitucionesWhereUniqueInput
  }

  /**
   * Instituciones deleteMany
   */
  export type InstitucionesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Instituciones to delete
     */
    where?: InstitucionesWhereInput
    /**
     * Limit how many Instituciones to delete.
     */
    limit?: number
  }

  /**
   * Instituciones.administradores
   */
  export type Instituciones$administradoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Administradores
     */
    select?: AdministradoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Administradores
     */
    omit?: AdministradoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministradoresInclude<ExtArgs> | null
    where?: AdministradoresWhereInput
    orderBy?: AdministradoresOrderByWithRelationInput | AdministradoresOrderByWithRelationInput[]
    cursor?: AdministradoresWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AdministradoresScalarFieldEnum | AdministradoresScalarFieldEnum[]
  }

  /**
   * Instituciones.sedes
   */
  export type Instituciones$sedesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sedes
     */
    select?: SedesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sedes
     */
    omit?: SedesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SedesInclude<ExtArgs> | null
    where?: SedesWhereInput
    orderBy?: SedesOrderByWithRelationInput | SedesOrderByWithRelationInput[]
    cursor?: SedesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SedesScalarFieldEnum | SedesScalarFieldEnum[]
  }

  /**
   * Instituciones without action
   */
  export type InstitucionesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Instituciones
     */
    select?: InstitucionesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Instituciones
     */
    omit?: InstitucionesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitucionesInclude<ExtArgs> | null
  }


  /**
   * Model Sedes
   */

  export type AggregateSedes = {
    _count: SedesCountAggregateOutputType | null
    _avg: SedesAvgAggregateOutputType | null
    _sum: SedesSumAggregateOutputType | null
    _min: SedesMinAggregateOutputType | null
    _max: SedesMaxAggregateOutputType | null
  }

  export type SedesAvgAggregateOutputType = {
    id: number | null
    institucion_id: number | null
  }

  export type SedesSumAggregateOutputType = {
    id: number | null
    institucion_id: number | null
  }

  export type SedesMinAggregateOutputType = {
    id: number | null
    nombre: string | null
    institucion_id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type SedesMaxAggregateOutputType = {
    id: number | null
    nombre: string | null
    institucion_id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type SedesCountAggregateOutputType = {
    id: number
    nombre: number
    jornadas: number
    institucion_id: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type SedesAvgAggregateInputType = {
    id?: true
    institucion_id?: true
  }

  export type SedesSumAggregateInputType = {
    id?: true
    institucion_id?: true
  }

  export type SedesMinAggregateInputType = {
    id?: true
    nombre?: true
    institucion_id?: true
    created_at?: true
    updated_at?: true
  }

  export type SedesMaxAggregateInputType = {
    id?: true
    nombre?: true
    institucion_id?: true
    created_at?: true
    updated_at?: true
  }

  export type SedesCountAggregateInputType = {
    id?: true
    nombre?: true
    jornadas?: true
    institucion_id?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type SedesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sedes to aggregate.
     */
    where?: SedesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sedes to fetch.
     */
    orderBy?: SedesOrderByWithRelationInput | SedesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SedesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sedes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sedes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sedes
    **/
    _count?: true | SedesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SedesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SedesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SedesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SedesMaxAggregateInputType
  }

  export type GetSedesAggregateType<T extends SedesAggregateArgs> = {
        [P in keyof T & keyof AggregateSedes]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSedes[P]>
      : GetScalarType<T[P], AggregateSedes[P]>
  }




  export type SedesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SedesWhereInput
    orderBy?: SedesOrderByWithAggregationInput | SedesOrderByWithAggregationInput[]
    by: SedesScalarFieldEnum[] | SedesScalarFieldEnum
    having?: SedesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SedesCountAggregateInputType | true
    _avg?: SedesAvgAggregateInputType
    _sum?: SedesSumAggregateInputType
    _min?: SedesMinAggregateInputType
    _max?: SedesMaxAggregateInputType
  }

  export type SedesGroupByOutputType = {
    id: number
    nombre: string
    jornadas: string[]
    institucion_id: number
    created_at: Date
    updated_at: Date
    _count: SedesCountAggregateOutputType | null
    _avg: SedesAvgAggregateOutputType | null
    _sum: SedesSumAggregateOutputType | null
    _min: SedesMinAggregateOutputType | null
    _max: SedesMaxAggregateOutputType | null
  }

  type GetSedesGroupByPayload<T extends SedesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SedesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SedesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SedesGroupByOutputType[P]>
            : GetScalarType<T[P], SedesGroupByOutputType[P]>
        }
      >
    >


  export type SedesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    jornadas?: boolean
    institucion_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    administradores?: boolean | Sedes$administradoresArgs<ExtArgs>
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    _count?: boolean | SedesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sedes"]>

  export type SedesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    jornadas?: boolean
    institucion_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sedes"]>

  export type SedesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    jornadas?: boolean
    institucion_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sedes"]>

  export type SedesSelectScalar = {
    id?: boolean
    nombre?: boolean
    jornadas?: boolean
    institucion_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type SedesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "jornadas" | "institucion_id" | "created_at" | "updated_at", ExtArgs["result"]["sedes"]>
  export type SedesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    administradores?: boolean | Sedes$administradoresArgs<ExtArgs>
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    _count?: boolean | SedesCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SedesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
  }
  export type SedesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
  }

  export type $SedesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Sedes"
    objects: {
      administradores: Prisma.$AdministradoresPayload<ExtArgs>[]
      institucion: Prisma.$InstitucionesPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nombre: string
      jornadas: string[]
      institucion_id: number
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["sedes"]>
    composites: {}
  }

  type SedesGetPayload<S extends boolean | null | undefined | SedesDefaultArgs> = $Result.GetResult<Prisma.$SedesPayload, S>

  type SedesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SedesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SedesCountAggregateInputType | true
    }

  export interface SedesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Sedes'], meta: { name: 'Sedes' } }
    /**
     * Find zero or one Sedes that matches the filter.
     * @param {SedesFindUniqueArgs} args - Arguments to find a Sedes
     * @example
     * // Get one Sedes
     * const sedes = await prisma.sedes.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SedesFindUniqueArgs>(args: SelectSubset<T, SedesFindUniqueArgs<ExtArgs>>): Prisma__SedesClient<$Result.GetResult<Prisma.$SedesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Sedes that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SedesFindUniqueOrThrowArgs} args - Arguments to find a Sedes
     * @example
     * // Get one Sedes
     * const sedes = await prisma.sedes.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SedesFindUniqueOrThrowArgs>(args: SelectSubset<T, SedesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SedesClient<$Result.GetResult<Prisma.$SedesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sedes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SedesFindFirstArgs} args - Arguments to find a Sedes
     * @example
     * // Get one Sedes
     * const sedes = await prisma.sedes.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SedesFindFirstArgs>(args?: SelectSubset<T, SedesFindFirstArgs<ExtArgs>>): Prisma__SedesClient<$Result.GetResult<Prisma.$SedesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sedes that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SedesFindFirstOrThrowArgs} args - Arguments to find a Sedes
     * @example
     * // Get one Sedes
     * const sedes = await prisma.sedes.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SedesFindFirstOrThrowArgs>(args?: SelectSubset<T, SedesFindFirstOrThrowArgs<ExtArgs>>): Prisma__SedesClient<$Result.GetResult<Prisma.$SedesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sedes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SedesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sedes
     * const sedes = await prisma.sedes.findMany()
     * 
     * // Get first 10 Sedes
     * const sedes = await prisma.sedes.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sedesWithIdOnly = await prisma.sedes.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SedesFindManyArgs>(args?: SelectSubset<T, SedesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SedesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Sedes.
     * @param {SedesCreateArgs} args - Arguments to create a Sedes.
     * @example
     * // Create one Sedes
     * const Sedes = await prisma.sedes.create({
     *   data: {
     *     // ... data to create a Sedes
     *   }
     * })
     * 
     */
    create<T extends SedesCreateArgs>(args: SelectSubset<T, SedesCreateArgs<ExtArgs>>): Prisma__SedesClient<$Result.GetResult<Prisma.$SedesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sedes.
     * @param {SedesCreateManyArgs} args - Arguments to create many Sedes.
     * @example
     * // Create many Sedes
     * const sedes = await prisma.sedes.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SedesCreateManyArgs>(args?: SelectSubset<T, SedesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sedes and returns the data saved in the database.
     * @param {SedesCreateManyAndReturnArgs} args - Arguments to create many Sedes.
     * @example
     * // Create many Sedes
     * const sedes = await prisma.sedes.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sedes and only return the `id`
     * const sedesWithIdOnly = await prisma.sedes.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SedesCreateManyAndReturnArgs>(args?: SelectSubset<T, SedesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SedesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Sedes.
     * @param {SedesDeleteArgs} args - Arguments to delete one Sedes.
     * @example
     * // Delete one Sedes
     * const Sedes = await prisma.sedes.delete({
     *   where: {
     *     // ... filter to delete one Sedes
     *   }
     * })
     * 
     */
    delete<T extends SedesDeleteArgs>(args: SelectSubset<T, SedesDeleteArgs<ExtArgs>>): Prisma__SedesClient<$Result.GetResult<Prisma.$SedesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Sedes.
     * @param {SedesUpdateArgs} args - Arguments to update one Sedes.
     * @example
     * // Update one Sedes
     * const sedes = await prisma.sedes.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SedesUpdateArgs>(args: SelectSubset<T, SedesUpdateArgs<ExtArgs>>): Prisma__SedesClient<$Result.GetResult<Prisma.$SedesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sedes.
     * @param {SedesDeleteManyArgs} args - Arguments to filter Sedes to delete.
     * @example
     * // Delete a few Sedes
     * const { count } = await prisma.sedes.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SedesDeleteManyArgs>(args?: SelectSubset<T, SedesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sedes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SedesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sedes
     * const sedes = await prisma.sedes.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SedesUpdateManyArgs>(args: SelectSubset<T, SedesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sedes and returns the data updated in the database.
     * @param {SedesUpdateManyAndReturnArgs} args - Arguments to update many Sedes.
     * @example
     * // Update many Sedes
     * const sedes = await prisma.sedes.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sedes and only return the `id`
     * const sedesWithIdOnly = await prisma.sedes.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SedesUpdateManyAndReturnArgs>(args: SelectSubset<T, SedesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SedesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Sedes.
     * @param {SedesUpsertArgs} args - Arguments to update or create a Sedes.
     * @example
     * // Update or create a Sedes
     * const sedes = await prisma.sedes.upsert({
     *   create: {
     *     // ... data to create a Sedes
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Sedes we want to update
     *   }
     * })
     */
    upsert<T extends SedesUpsertArgs>(args: SelectSubset<T, SedesUpsertArgs<ExtArgs>>): Prisma__SedesClient<$Result.GetResult<Prisma.$SedesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sedes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SedesCountArgs} args - Arguments to filter Sedes to count.
     * @example
     * // Count the number of Sedes
     * const count = await prisma.sedes.count({
     *   where: {
     *     // ... the filter for the Sedes we want to count
     *   }
     * })
    **/
    count<T extends SedesCountArgs>(
      args?: Subset<T, SedesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SedesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Sedes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SedesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SedesAggregateArgs>(args: Subset<T, SedesAggregateArgs>): Prisma.PrismaPromise<GetSedesAggregateType<T>>

    /**
     * Group by Sedes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SedesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SedesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SedesGroupByArgs['orderBy'] }
        : { orderBy?: SedesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SedesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSedesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Sedes model
   */
  readonly fields: SedesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Sedes.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SedesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    administradores<T extends Sedes$administradoresArgs<ExtArgs> = {}>(args?: Subset<T, Sedes$administradoresArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdministradoresPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    institucion<T extends InstitucionesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InstitucionesDefaultArgs<ExtArgs>>): Prisma__InstitucionesClient<$Result.GetResult<Prisma.$InstitucionesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Sedes model
   */
  interface SedesFieldRefs {
    readonly id: FieldRef<"Sedes", 'Int'>
    readonly nombre: FieldRef<"Sedes", 'String'>
    readonly jornadas: FieldRef<"Sedes", 'String[]'>
    readonly institucion_id: FieldRef<"Sedes", 'Int'>
    readonly created_at: FieldRef<"Sedes", 'DateTime'>
    readonly updated_at: FieldRef<"Sedes", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Sedes findUnique
   */
  export type SedesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sedes
     */
    select?: SedesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sedes
     */
    omit?: SedesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SedesInclude<ExtArgs> | null
    /**
     * Filter, which Sedes to fetch.
     */
    where: SedesWhereUniqueInput
  }

  /**
   * Sedes findUniqueOrThrow
   */
  export type SedesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sedes
     */
    select?: SedesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sedes
     */
    omit?: SedesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SedesInclude<ExtArgs> | null
    /**
     * Filter, which Sedes to fetch.
     */
    where: SedesWhereUniqueInput
  }

  /**
   * Sedes findFirst
   */
  export type SedesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sedes
     */
    select?: SedesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sedes
     */
    omit?: SedesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SedesInclude<ExtArgs> | null
    /**
     * Filter, which Sedes to fetch.
     */
    where?: SedesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sedes to fetch.
     */
    orderBy?: SedesOrderByWithRelationInput | SedesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sedes.
     */
    cursor?: SedesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sedes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sedes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sedes.
     */
    distinct?: SedesScalarFieldEnum | SedesScalarFieldEnum[]
  }

  /**
   * Sedes findFirstOrThrow
   */
  export type SedesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sedes
     */
    select?: SedesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sedes
     */
    omit?: SedesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SedesInclude<ExtArgs> | null
    /**
     * Filter, which Sedes to fetch.
     */
    where?: SedesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sedes to fetch.
     */
    orderBy?: SedesOrderByWithRelationInput | SedesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sedes.
     */
    cursor?: SedesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sedes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sedes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sedes.
     */
    distinct?: SedesScalarFieldEnum | SedesScalarFieldEnum[]
  }

  /**
   * Sedes findMany
   */
  export type SedesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sedes
     */
    select?: SedesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sedes
     */
    omit?: SedesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SedesInclude<ExtArgs> | null
    /**
     * Filter, which Sedes to fetch.
     */
    where?: SedesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sedes to fetch.
     */
    orderBy?: SedesOrderByWithRelationInput | SedesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sedes.
     */
    cursor?: SedesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sedes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sedes.
     */
    skip?: number
    distinct?: SedesScalarFieldEnum | SedesScalarFieldEnum[]
  }

  /**
   * Sedes create
   */
  export type SedesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sedes
     */
    select?: SedesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sedes
     */
    omit?: SedesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SedesInclude<ExtArgs> | null
    /**
     * The data needed to create a Sedes.
     */
    data: XOR<SedesCreateInput, SedesUncheckedCreateInput>
  }

  /**
   * Sedes createMany
   */
  export type SedesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sedes.
     */
    data: SedesCreateManyInput | SedesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Sedes createManyAndReturn
   */
  export type SedesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sedes
     */
    select?: SedesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Sedes
     */
    omit?: SedesOmit<ExtArgs> | null
    /**
     * The data used to create many Sedes.
     */
    data: SedesCreateManyInput | SedesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SedesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Sedes update
   */
  export type SedesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sedes
     */
    select?: SedesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sedes
     */
    omit?: SedesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SedesInclude<ExtArgs> | null
    /**
     * The data needed to update a Sedes.
     */
    data: XOR<SedesUpdateInput, SedesUncheckedUpdateInput>
    /**
     * Choose, which Sedes to update.
     */
    where: SedesWhereUniqueInput
  }

  /**
   * Sedes updateMany
   */
  export type SedesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sedes.
     */
    data: XOR<SedesUpdateManyMutationInput, SedesUncheckedUpdateManyInput>
    /**
     * Filter which Sedes to update
     */
    where?: SedesWhereInput
    /**
     * Limit how many Sedes to update.
     */
    limit?: number
  }

  /**
   * Sedes updateManyAndReturn
   */
  export type SedesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sedes
     */
    select?: SedesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Sedes
     */
    omit?: SedesOmit<ExtArgs> | null
    /**
     * The data used to update Sedes.
     */
    data: XOR<SedesUpdateManyMutationInput, SedesUncheckedUpdateManyInput>
    /**
     * Filter which Sedes to update
     */
    where?: SedesWhereInput
    /**
     * Limit how many Sedes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SedesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Sedes upsert
   */
  export type SedesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sedes
     */
    select?: SedesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sedes
     */
    omit?: SedesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SedesInclude<ExtArgs> | null
    /**
     * The filter to search for the Sedes to update in case it exists.
     */
    where: SedesWhereUniqueInput
    /**
     * In case the Sedes found by the `where` argument doesn't exist, create a new Sedes with this data.
     */
    create: XOR<SedesCreateInput, SedesUncheckedCreateInput>
    /**
     * In case the Sedes was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SedesUpdateInput, SedesUncheckedUpdateInput>
  }

  /**
   * Sedes delete
   */
  export type SedesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sedes
     */
    select?: SedesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sedes
     */
    omit?: SedesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SedesInclude<ExtArgs> | null
    /**
     * Filter which Sedes to delete.
     */
    where: SedesWhereUniqueInput
  }

  /**
   * Sedes deleteMany
   */
  export type SedesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sedes to delete
     */
    where?: SedesWhereInput
    /**
     * Limit how many Sedes to delete.
     */
    limit?: number
  }

  /**
   * Sedes.administradores
   */
  export type Sedes$administradoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Administradores
     */
    select?: AdministradoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Administradores
     */
    omit?: AdministradoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministradoresInclude<ExtArgs> | null
    where?: AdministradoresWhereInput
    orderBy?: AdministradoresOrderByWithRelationInput | AdministradoresOrderByWithRelationInput[]
    cursor?: AdministradoresWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AdministradoresScalarFieldEnum | AdministradoresScalarFieldEnum[]
  }

  /**
   * Sedes without action
   */
  export type SedesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sedes
     */
    select?: SedesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sedes
     */
    omit?: SedesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SedesInclude<ExtArgs> | null
  }


  /**
   * Model Administradores
   */

  export type AggregateAdministradores = {
    _count: AdministradoresCountAggregateOutputType | null
    _avg: AdministradoresAvgAggregateOutputType | null
    _sum: AdministradoresSumAggregateOutputType | null
    _min: AdministradoresMinAggregateOutputType | null
    _max: AdministradoresMaxAggregateOutputType | null
  }

  export type AdministradoresAvgAggregateOutputType = {
    id: number | null
    institucion_id: number | null
    sede_id: number | null
  }

  export type AdministradoresSumAggregateOutputType = {
    id: number | null
    institucion_id: number | null
    sede_id: number | null
  }

  export type AdministradoresMinAggregateOutputType = {
    id: number | null
    nombre: string | null
    apellido: string | null
    telefono: string | null
    cargo: string | null
    institucion_id: number | null
    created_at: Date | null
    updated_at: Date | null
    correo: string | null
    sede_id: number | null
    password: string | null
    supabase_user_id: string | null
  }

  export type AdministradoresMaxAggregateOutputType = {
    id: number | null
    nombre: string | null
    apellido: string | null
    telefono: string | null
    cargo: string | null
    institucion_id: number | null
    created_at: Date | null
    updated_at: Date | null
    correo: string | null
    sede_id: number | null
    password: string | null
    supabase_user_id: string | null
  }

  export type AdministradoresCountAggregateOutputType = {
    id: number
    nombre: number
    apellido: number
    telefono: number
    cargo: number
    institucion_id: number
    created_at: number
    updated_at: number
    correo: number
    sede_id: number
    password: number
    supabase_user_id: number
    _all: number
  }


  export type AdministradoresAvgAggregateInputType = {
    id?: true
    institucion_id?: true
    sede_id?: true
  }

  export type AdministradoresSumAggregateInputType = {
    id?: true
    institucion_id?: true
    sede_id?: true
  }

  export type AdministradoresMinAggregateInputType = {
    id?: true
    nombre?: true
    apellido?: true
    telefono?: true
    cargo?: true
    institucion_id?: true
    created_at?: true
    updated_at?: true
    correo?: true
    sede_id?: true
    password?: true
    supabase_user_id?: true
  }

  export type AdministradoresMaxAggregateInputType = {
    id?: true
    nombre?: true
    apellido?: true
    telefono?: true
    cargo?: true
    institucion_id?: true
    created_at?: true
    updated_at?: true
    correo?: true
    sede_id?: true
    password?: true
    supabase_user_id?: true
  }

  export type AdministradoresCountAggregateInputType = {
    id?: true
    nombre?: true
    apellido?: true
    telefono?: true
    cargo?: true
    institucion_id?: true
    created_at?: true
    updated_at?: true
    correo?: true
    sede_id?: true
    password?: true
    supabase_user_id?: true
    _all?: true
  }

  export type AdministradoresAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Administradores to aggregate.
     */
    where?: AdministradoresWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Administradores to fetch.
     */
    orderBy?: AdministradoresOrderByWithRelationInput | AdministradoresOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdministradoresWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Administradores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Administradores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Administradores
    **/
    _count?: true | AdministradoresCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AdministradoresAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AdministradoresSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdministradoresMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdministradoresMaxAggregateInputType
  }

  export type GetAdministradoresAggregateType<T extends AdministradoresAggregateArgs> = {
        [P in keyof T & keyof AggregateAdministradores]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdministradores[P]>
      : GetScalarType<T[P], AggregateAdministradores[P]>
  }




  export type AdministradoresGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdministradoresWhereInput
    orderBy?: AdministradoresOrderByWithAggregationInput | AdministradoresOrderByWithAggregationInput[]
    by: AdministradoresScalarFieldEnum[] | AdministradoresScalarFieldEnum
    having?: AdministradoresScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdministradoresCountAggregateInputType | true
    _avg?: AdministradoresAvgAggregateInputType
    _sum?: AdministradoresSumAggregateInputType
    _min?: AdministradoresMinAggregateInputType
    _max?: AdministradoresMaxAggregateInputType
  }

  export type AdministradoresGroupByOutputType = {
    id: number
    nombre: string
    apellido: string
    telefono: string
    cargo: string
    institucion_id: number
    created_at: Date
    updated_at: Date
    correo: string
    sede_id: number | null
    password: string
    supabase_user_id: string | null
    _count: AdministradoresCountAggregateOutputType | null
    _avg: AdministradoresAvgAggregateOutputType | null
    _sum: AdministradoresSumAggregateOutputType | null
    _min: AdministradoresMinAggregateOutputType | null
    _max: AdministradoresMaxAggregateOutputType | null
  }

  type GetAdministradoresGroupByPayload<T extends AdministradoresGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdministradoresGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdministradoresGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdministradoresGroupByOutputType[P]>
            : GetScalarType<T[P], AdministradoresGroupByOutputType[P]>
        }
      >
    >


  export type AdministradoresSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    apellido?: boolean
    telefono?: boolean
    cargo?: boolean
    institucion_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    correo?: boolean
    sede_id?: boolean
    password?: boolean
    supabase_user_id?: boolean
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    sede?: boolean | Administradores$sedeArgs<ExtArgs>
  }, ExtArgs["result"]["administradores"]>

  export type AdministradoresSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    apellido?: boolean
    telefono?: boolean
    cargo?: boolean
    institucion_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    correo?: boolean
    sede_id?: boolean
    password?: boolean
    supabase_user_id?: boolean
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    sede?: boolean | Administradores$sedeArgs<ExtArgs>
  }, ExtArgs["result"]["administradores"]>

  export type AdministradoresSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    apellido?: boolean
    telefono?: boolean
    cargo?: boolean
    institucion_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    correo?: boolean
    sede_id?: boolean
    password?: boolean
    supabase_user_id?: boolean
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    sede?: boolean | Administradores$sedeArgs<ExtArgs>
  }, ExtArgs["result"]["administradores"]>

  export type AdministradoresSelectScalar = {
    id?: boolean
    nombre?: boolean
    apellido?: boolean
    telefono?: boolean
    cargo?: boolean
    institucion_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    correo?: boolean
    sede_id?: boolean
    password?: boolean
    supabase_user_id?: boolean
  }

  export type AdministradoresOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "apellido" | "telefono" | "cargo" | "institucion_id" | "created_at" | "updated_at" | "correo" | "sede_id" | "password" | "supabase_user_id", ExtArgs["result"]["administradores"]>
  export type AdministradoresInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    sede?: boolean | Administradores$sedeArgs<ExtArgs>
  }
  export type AdministradoresIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    sede?: boolean | Administradores$sedeArgs<ExtArgs>
  }
  export type AdministradoresIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    sede?: boolean | Administradores$sedeArgs<ExtArgs>
  }

  export type $AdministradoresPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Administradores"
    objects: {
      institucion: Prisma.$InstitucionesPayload<ExtArgs>
      sede: Prisma.$SedesPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nombre: string
      apellido: string
      telefono: string
      cargo: string
      institucion_id: number
      created_at: Date
      updated_at: Date
      correo: string
      sede_id: number | null
      password: string
      supabase_user_id: string | null
    }, ExtArgs["result"]["administradores"]>
    composites: {}
  }

  type AdministradoresGetPayload<S extends boolean | null | undefined | AdministradoresDefaultArgs> = $Result.GetResult<Prisma.$AdministradoresPayload, S>

  type AdministradoresCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AdministradoresFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AdministradoresCountAggregateInputType | true
    }

  export interface AdministradoresDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Administradores'], meta: { name: 'Administradores' } }
    /**
     * Find zero or one Administradores that matches the filter.
     * @param {AdministradoresFindUniqueArgs} args - Arguments to find a Administradores
     * @example
     * // Get one Administradores
     * const administradores = await prisma.administradores.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdministradoresFindUniqueArgs>(args: SelectSubset<T, AdministradoresFindUniqueArgs<ExtArgs>>): Prisma__AdministradoresClient<$Result.GetResult<Prisma.$AdministradoresPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Administradores that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AdministradoresFindUniqueOrThrowArgs} args - Arguments to find a Administradores
     * @example
     * // Get one Administradores
     * const administradores = await prisma.administradores.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdministradoresFindUniqueOrThrowArgs>(args: SelectSubset<T, AdministradoresFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AdministradoresClient<$Result.GetResult<Prisma.$AdministradoresPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Administradores that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdministradoresFindFirstArgs} args - Arguments to find a Administradores
     * @example
     * // Get one Administradores
     * const administradores = await prisma.administradores.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdministradoresFindFirstArgs>(args?: SelectSubset<T, AdministradoresFindFirstArgs<ExtArgs>>): Prisma__AdministradoresClient<$Result.GetResult<Prisma.$AdministradoresPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Administradores that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdministradoresFindFirstOrThrowArgs} args - Arguments to find a Administradores
     * @example
     * // Get one Administradores
     * const administradores = await prisma.administradores.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdministradoresFindFirstOrThrowArgs>(args?: SelectSubset<T, AdministradoresFindFirstOrThrowArgs<ExtArgs>>): Prisma__AdministradoresClient<$Result.GetResult<Prisma.$AdministradoresPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Administradores that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdministradoresFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Administradores
     * const administradores = await prisma.administradores.findMany()
     * 
     * // Get first 10 Administradores
     * const administradores = await prisma.administradores.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const administradoresWithIdOnly = await prisma.administradores.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AdministradoresFindManyArgs>(args?: SelectSubset<T, AdministradoresFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdministradoresPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Administradores.
     * @param {AdministradoresCreateArgs} args - Arguments to create a Administradores.
     * @example
     * // Create one Administradores
     * const Administradores = await prisma.administradores.create({
     *   data: {
     *     // ... data to create a Administradores
     *   }
     * })
     * 
     */
    create<T extends AdministradoresCreateArgs>(args: SelectSubset<T, AdministradoresCreateArgs<ExtArgs>>): Prisma__AdministradoresClient<$Result.GetResult<Prisma.$AdministradoresPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Administradores.
     * @param {AdministradoresCreateManyArgs} args - Arguments to create many Administradores.
     * @example
     * // Create many Administradores
     * const administradores = await prisma.administradores.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AdministradoresCreateManyArgs>(args?: SelectSubset<T, AdministradoresCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Administradores and returns the data saved in the database.
     * @param {AdministradoresCreateManyAndReturnArgs} args - Arguments to create many Administradores.
     * @example
     * // Create many Administradores
     * const administradores = await prisma.administradores.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Administradores and only return the `id`
     * const administradoresWithIdOnly = await prisma.administradores.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AdministradoresCreateManyAndReturnArgs>(args?: SelectSubset<T, AdministradoresCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdministradoresPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Administradores.
     * @param {AdministradoresDeleteArgs} args - Arguments to delete one Administradores.
     * @example
     * // Delete one Administradores
     * const Administradores = await prisma.administradores.delete({
     *   where: {
     *     // ... filter to delete one Administradores
     *   }
     * })
     * 
     */
    delete<T extends AdministradoresDeleteArgs>(args: SelectSubset<T, AdministradoresDeleteArgs<ExtArgs>>): Prisma__AdministradoresClient<$Result.GetResult<Prisma.$AdministradoresPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Administradores.
     * @param {AdministradoresUpdateArgs} args - Arguments to update one Administradores.
     * @example
     * // Update one Administradores
     * const administradores = await prisma.administradores.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AdministradoresUpdateArgs>(args: SelectSubset<T, AdministradoresUpdateArgs<ExtArgs>>): Prisma__AdministradoresClient<$Result.GetResult<Prisma.$AdministradoresPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Administradores.
     * @param {AdministradoresDeleteManyArgs} args - Arguments to filter Administradores to delete.
     * @example
     * // Delete a few Administradores
     * const { count } = await prisma.administradores.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AdministradoresDeleteManyArgs>(args?: SelectSubset<T, AdministradoresDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Administradores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdministradoresUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Administradores
     * const administradores = await prisma.administradores.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AdministradoresUpdateManyArgs>(args: SelectSubset<T, AdministradoresUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Administradores and returns the data updated in the database.
     * @param {AdministradoresUpdateManyAndReturnArgs} args - Arguments to update many Administradores.
     * @example
     * // Update many Administradores
     * const administradores = await prisma.administradores.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Administradores and only return the `id`
     * const administradoresWithIdOnly = await prisma.administradores.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AdministradoresUpdateManyAndReturnArgs>(args: SelectSubset<T, AdministradoresUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdministradoresPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Administradores.
     * @param {AdministradoresUpsertArgs} args - Arguments to update or create a Administradores.
     * @example
     * // Update or create a Administradores
     * const administradores = await prisma.administradores.upsert({
     *   create: {
     *     // ... data to create a Administradores
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Administradores we want to update
     *   }
     * })
     */
    upsert<T extends AdministradoresUpsertArgs>(args: SelectSubset<T, AdministradoresUpsertArgs<ExtArgs>>): Prisma__AdministradoresClient<$Result.GetResult<Prisma.$AdministradoresPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Administradores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdministradoresCountArgs} args - Arguments to filter Administradores to count.
     * @example
     * // Count the number of Administradores
     * const count = await prisma.administradores.count({
     *   where: {
     *     // ... the filter for the Administradores we want to count
     *   }
     * })
    **/
    count<T extends AdministradoresCountArgs>(
      args?: Subset<T, AdministradoresCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdministradoresCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Administradores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdministradoresAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AdministradoresAggregateArgs>(args: Subset<T, AdministradoresAggregateArgs>): Prisma.PrismaPromise<GetAdministradoresAggregateType<T>>

    /**
     * Group by Administradores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdministradoresGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AdministradoresGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdministradoresGroupByArgs['orderBy'] }
        : { orderBy?: AdministradoresGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AdministradoresGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdministradoresGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Administradores model
   */
  readonly fields: AdministradoresFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Administradores.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdministradoresClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    institucion<T extends InstitucionesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InstitucionesDefaultArgs<ExtArgs>>): Prisma__InstitucionesClient<$Result.GetResult<Prisma.$InstitucionesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    sede<T extends Administradores$sedeArgs<ExtArgs> = {}>(args?: Subset<T, Administradores$sedeArgs<ExtArgs>>): Prisma__SedesClient<$Result.GetResult<Prisma.$SedesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Administradores model
   */
  interface AdministradoresFieldRefs {
    readonly id: FieldRef<"Administradores", 'Int'>
    readonly nombre: FieldRef<"Administradores", 'String'>
    readonly apellido: FieldRef<"Administradores", 'String'>
    readonly telefono: FieldRef<"Administradores", 'String'>
    readonly cargo: FieldRef<"Administradores", 'String'>
    readonly institucion_id: FieldRef<"Administradores", 'Int'>
    readonly created_at: FieldRef<"Administradores", 'DateTime'>
    readonly updated_at: FieldRef<"Administradores", 'DateTime'>
    readonly correo: FieldRef<"Administradores", 'String'>
    readonly sede_id: FieldRef<"Administradores", 'Int'>
    readonly password: FieldRef<"Administradores", 'String'>
    readonly supabase_user_id: FieldRef<"Administradores", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Administradores findUnique
   */
  export type AdministradoresFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Administradores
     */
    select?: AdministradoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Administradores
     */
    omit?: AdministradoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministradoresInclude<ExtArgs> | null
    /**
     * Filter, which Administradores to fetch.
     */
    where: AdministradoresWhereUniqueInput
  }

  /**
   * Administradores findUniqueOrThrow
   */
  export type AdministradoresFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Administradores
     */
    select?: AdministradoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Administradores
     */
    omit?: AdministradoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministradoresInclude<ExtArgs> | null
    /**
     * Filter, which Administradores to fetch.
     */
    where: AdministradoresWhereUniqueInput
  }

  /**
   * Administradores findFirst
   */
  export type AdministradoresFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Administradores
     */
    select?: AdministradoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Administradores
     */
    omit?: AdministradoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministradoresInclude<ExtArgs> | null
    /**
     * Filter, which Administradores to fetch.
     */
    where?: AdministradoresWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Administradores to fetch.
     */
    orderBy?: AdministradoresOrderByWithRelationInput | AdministradoresOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Administradores.
     */
    cursor?: AdministradoresWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Administradores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Administradores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Administradores.
     */
    distinct?: AdministradoresScalarFieldEnum | AdministradoresScalarFieldEnum[]
  }

  /**
   * Administradores findFirstOrThrow
   */
  export type AdministradoresFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Administradores
     */
    select?: AdministradoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Administradores
     */
    omit?: AdministradoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministradoresInclude<ExtArgs> | null
    /**
     * Filter, which Administradores to fetch.
     */
    where?: AdministradoresWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Administradores to fetch.
     */
    orderBy?: AdministradoresOrderByWithRelationInput | AdministradoresOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Administradores.
     */
    cursor?: AdministradoresWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Administradores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Administradores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Administradores.
     */
    distinct?: AdministradoresScalarFieldEnum | AdministradoresScalarFieldEnum[]
  }

  /**
   * Administradores findMany
   */
  export type AdministradoresFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Administradores
     */
    select?: AdministradoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Administradores
     */
    omit?: AdministradoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministradoresInclude<ExtArgs> | null
    /**
     * Filter, which Administradores to fetch.
     */
    where?: AdministradoresWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Administradores to fetch.
     */
    orderBy?: AdministradoresOrderByWithRelationInput | AdministradoresOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Administradores.
     */
    cursor?: AdministradoresWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Administradores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Administradores.
     */
    skip?: number
    distinct?: AdministradoresScalarFieldEnum | AdministradoresScalarFieldEnum[]
  }

  /**
   * Administradores create
   */
  export type AdministradoresCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Administradores
     */
    select?: AdministradoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Administradores
     */
    omit?: AdministradoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministradoresInclude<ExtArgs> | null
    /**
     * The data needed to create a Administradores.
     */
    data: XOR<AdministradoresCreateInput, AdministradoresUncheckedCreateInput>
  }

  /**
   * Administradores createMany
   */
  export type AdministradoresCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Administradores.
     */
    data: AdministradoresCreateManyInput | AdministradoresCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Administradores createManyAndReturn
   */
  export type AdministradoresCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Administradores
     */
    select?: AdministradoresSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Administradores
     */
    omit?: AdministradoresOmit<ExtArgs> | null
    /**
     * The data used to create many Administradores.
     */
    data: AdministradoresCreateManyInput | AdministradoresCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministradoresIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Administradores update
   */
  export type AdministradoresUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Administradores
     */
    select?: AdministradoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Administradores
     */
    omit?: AdministradoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministradoresInclude<ExtArgs> | null
    /**
     * The data needed to update a Administradores.
     */
    data: XOR<AdministradoresUpdateInput, AdministradoresUncheckedUpdateInput>
    /**
     * Choose, which Administradores to update.
     */
    where: AdministradoresWhereUniqueInput
  }

  /**
   * Administradores updateMany
   */
  export type AdministradoresUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Administradores.
     */
    data: XOR<AdministradoresUpdateManyMutationInput, AdministradoresUncheckedUpdateManyInput>
    /**
     * Filter which Administradores to update
     */
    where?: AdministradoresWhereInput
    /**
     * Limit how many Administradores to update.
     */
    limit?: number
  }

  /**
   * Administradores updateManyAndReturn
   */
  export type AdministradoresUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Administradores
     */
    select?: AdministradoresSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Administradores
     */
    omit?: AdministradoresOmit<ExtArgs> | null
    /**
     * The data used to update Administradores.
     */
    data: XOR<AdministradoresUpdateManyMutationInput, AdministradoresUncheckedUpdateManyInput>
    /**
     * Filter which Administradores to update
     */
    where?: AdministradoresWhereInput
    /**
     * Limit how many Administradores to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministradoresIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Administradores upsert
   */
  export type AdministradoresUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Administradores
     */
    select?: AdministradoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Administradores
     */
    omit?: AdministradoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministradoresInclude<ExtArgs> | null
    /**
     * The filter to search for the Administradores to update in case it exists.
     */
    where: AdministradoresWhereUniqueInput
    /**
     * In case the Administradores found by the `where` argument doesn't exist, create a new Administradores with this data.
     */
    create: XOR<AdministradoresCreateInput, AdministradoresUncheckedCreateInput>
    /**
     * In case the Administradores was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdministradoresUpdateInput, AdministradoresUncheckedUpdateInput>
  }

  /**
   * Administradores delete
   */
  export type AdministradoresDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Administradores
     */
    select?: AdministradoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Administradores
     */
    omit?: AdministradoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministradoresInclude<ExtArgs> | null
    /**
     * Filter which Administradores to delete.
     */
    where: AdministradoresWhereUniqueInput
  }

  /**
   * Administradores deleteMany
   */
  export type AdministradoresDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Administradores to delete
     */
    where?: AdministradoresWhereInput
    /**
     * Limit how many Administradores to delete.
     */
    limit?: number
  }

  /**
   * Administradores.sede
   */
  export type Administradores$sedeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sedes
     */
    select?: SedesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sedes
     */
    omit?: SedesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SedesInclude<ExtArgs> | null
    where?: SedesWhereInput
  }

  /**
   * Administradores without action
   */
  export type AdministradoresDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Administradores
     */
    select?: AdministradoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Administradores
     */
    omit?: AdministradoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministradoresInclude<ExtArgs> | null
  }


  /**
   * Model PasswordResetTokens
   */

  export type AggregatePasswordResetTokens = {
    _count: PasswordResetTokensCountAggregateOutputType | null
    _avg: PasswordResetTokensAvgAggregateOutputType | null
    _sum: PasswordResetTokensSumAggregateOutputType | null
    _min: PasswordResetTokensMinAggregateOutputType | null
    _max: PasswordResetTokensMaxAggregateOutputType | null
  }

  export type PasswordResetTokensAvgAggregateOutputType = {
    id: number | null
  }

  export type PasswordResetTokensSumAggregateOutputType = {
    id: number | null
  }

  export type PasswordResetTokensMinAggregateOutputType = {
    id: number | null
    email: string | null
    token: string | null
    expiresAt: Date | null
    used: boolean | null
    userType: string | null
    createdAt: Date | null
  }

  export type PasswordResetTokensMaxAggregateOutputType = {
    id: number | null
    email: string | null
    token: string | null
    expiresAt: Date | null
    used: boolean | null
    userType: string | null
    createdAt: Date | null
  }

  export type PasswordResetTokensCountAggregateOutputType = {
    id: number
    email: number
    token: number
    expiresAt: number
    used: number
    userType: number
    createdAt: number
    _all: number
  }


  export type PasswordResetTokensAvgAggregateInputType = {
    id?: true
  }

  export type PasswordResetTokensSumAggregateInputType = {
    id?: true
  }

  export type PasswordResetTokensMinAggregateInputType = {
    id?: true
    email?: true
    token?: true
    expiresAt?: true
    used?: true
    userType?: true
    createdAt?: true
  }

  export type PasswordResetTokensMaxAggregateInputType = {
    id?: true
    email?: true
    token?: true
    expiresAt?: true
    used?: true
    userType?: true
    createdAt?: true
  }

  export type PasswordResetTokensCountAggregateInputType = {
    id?: true
    email?: true
    token?: true
    expiresAt?: true
    used?: true
    userType?: true
    createdAt?: true
    _all?: true
  }

  export type PasswordResetTokensAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordResetTokens to aggregate.
     */
    where?: PasswordResetTokensWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?: PasswordResetTokensOrderByWithRelationInput | PasswordResetTokensOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PasswordResetTokensWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PasswordResetTokens
    **/
    _count?: true | PasswordResetTokensCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PasswordResetTokensAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PasswordResetTokensSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PasswordResetTokensMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PasswordResetTokensMaxAggregateInputType
  }

  export type GetPasswordResetTokensAggregateType<T extends PasswordResetTokensAggregateArgs> = {
        [P in keyof T & keyof AggregatePasswordResetTokens]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePasswordResetTokens[P]>
      : GetScalarType<T[P], AggregatePasswordResetTokens[P]>
  }




  export type PasswordResetTokensGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasswordResetTokensWhereInput
    orderBy?: PasswordResetTokensOrderByWithAggregationInput | PasswordResetTokensOrderByWithAggregationInput[]
    by: PasswordResetTokensScalarFieldEnum[] | PasswordResetTokensScalarFieldEnum
    having?: PasswordResetTokensScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PasswordResetTokensCountAggregateInputType | true
    _avg?: PasswordResetTokensAvgAggregateInputType
    _sum?: PasswordResetTokensSumAggregateInputType
    _min?: PasswordResetTokensMinAggregateInputType
    _max?: PasswordResetTokensMaxAggregateInputType
  }

  export type PasswordResetTokensGroupByOutputType = {
    id: number
    email: string
    token: string
    expiresAt: Date
    used: boolean
    userType: string
    createdAt: Date
    _count: PasswordResetTokensCountAggregateOutputType | null
    _avg: PasswordResetTokensAvgAggregateOutputType | null
    _sum: PasswordResetTokensSumAggregateOutputType | null
    _min: PasswordResetTokensMinAggregateOutputType | null
    _max: PasswordResetTokensMaxAggregateOutputType | null
  }

  type GetPasswordResetTokensGroupByPayload<T extends PasswordResetTokensGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PasswordResetTokensGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PasswordResetTokensGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PasswordResetTokensGroupByOutputType[P]>
            : GetScalarType<T[P], PasswordResetTokensGroupByOutputType[P]>
        }
      >
    >


  export type PasswordResetTokensSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    token?: boolean
    expiresAt?: boolean
    used?: boolean
    userType?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["passwordResetTokens"]>

  export type PasswordResetTokensSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    token?: boolean
    expiresAt?: boolean
    used?: boolean
    userType?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["passwordResetTokens"]>

  export type PasswordResetTokensSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    token?: boolean
    expiresAt?: boolean
    used?: boolean
    userType?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["passwordResetTokens"]>

  export type PasswordResetTokensSelectScalar = {
    id?: boolean
    email?: boolean
    token?: boolean
    expiresAt?: boolean
    used?: boolean
    userType?: boolean
    createdAt?: boolean
  }

  export type PasswordResetTokensOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "token" | "expiresAt" | "used" | "userType" | "createdAt", ExtArgs["result"]["passwordResetTokens"]>

  export type $PasswordResetTokensPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PasswordResetTokens"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      email: string
      token: string
      expiresAt: Date
      used: boolean
      userType: string
      createdAt: Date
    }, ExtArgs["result"]["passwordResetTokens"]>
    composites: {}
  }

  type PasswordResetTokensGetPayload<S extends boolean | null | undefined | PasswordResetTokensDefaultArgs> = $Result.GetResult<Prisma.$PasswordResetTokensPayload, S>

  type PasswordResetTokensCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PasswordResetTokensFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PasswordResetTokensCountAggregateInputType | true
    }

  export interface PasswordResetTokensDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PasswordResetTokens'], meta: { name: 'PasswordResetTokens' } }
    /**
     * Find zero or one PasswordResetTokens that matches the filter.
     * @param {PasswordResetTokensFindUniqueArgs} args - Arguments to find a PasswordResetTokens
     * @example
     * // Get one PasswordResetTokens
     * const passwordResetTokens = await prisma.passwordResetTokens.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PasswordResetTokensFindUniqueArgs>(args: SelectSubset<T, PasswordResetTokensFindUniqueArgs<ExtArgs>>): Prisma__PasswordResetTokensClient<$Result.GetResult<Prisma.$PasswordResetTokensPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PasswordResetTokens that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PasswordResetTokensFindUniqueOrThrowArgs} args - Arguments to find a PasswordResetTokens
     * @example
     * // Get one PasswordResetTokens
     * const passwordResetTokens = await prisma.passwordResetTokens.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PasswordResetTokensFindUniqueOrThrowArgs>(args: SelectSubset<T, PasswordResetTokensFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PasswordResetTokensClient<$Result.GetResult<Prisma.$PasswordResetTokensPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PasswordResetTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokensFindFirstArgs} args - Arguments to find a PasswordResetTokens
     * @example
     * // Get one PasswordResetTokens
     * const passwordResetTokens = await prisma.passwordResetTokens.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PasswordResetTokensFindFirstArgs>(args?: SelectSubset<T, PasswordResetTokensFindFirstArgs<ExtArgs>>): Prisma__PasswordResetTokensClient<$Result.GetResult<Prisma.$PasswordResetTokensPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PasswordResetTokens that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokensFindFirstOrThrowArgs} args - Arguments to find a PasswordResetTokens
     * @example
     * // Get one PasswordResetTokens
     * const passwordResetTokens = await prisma.passwordResetTokens.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PasswordResetTokensFindFirstOrThrowArgs>(args?: SelectSubset<T, PasswordResetTokensFindFirstOrThrowArgs<ExtArgs>>): Prisma__PasswordResetTokensClient<$Result.GetResult<Prisma.$PasswordResetTokensPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PasswordResetTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokensFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PasswordResetTokens
     * const passwordResetTokens = await prisma.passwordResetTokens.findMany()
     * 
     * // Get first 10 PasswordResetTokens
     * const passwordResetTokens = await prisma.passwordResetTokens.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const passwordResetTokensWithIdOnly = await prisma.passwordResetTokens.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PasswordResetTokensFindManyArgs>(args?: SelectSubset<T, PasswordResetTokensFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetTokensPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PasswordResetTokens.
     * @param {PasswordResetTokensCreateArgs} args - Arguments to create a PasswordResetTokens.
     * @example
     * // Create one PasswordResetTokens
     * const PasswordResetTokens = await prisma.passwordResetTokens.create({
     *   data: {
     *     // ... data to create a PasswordResetTokens
     *   }
     * })
     * 
     */
    create<T extends PasswordResetTokensCreateArgs>(args: SelectSubset<T, PasswordResetTokensCreateArgs<ExtArgs>>): Prisma__PasswordResetTokensClient<$Result.GetResult<Prisma.$PasswordResetTokensPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PasswordResetTokens.
     * @param {PasswordResetTokensCreateManyArgs} args - Arguments to create many PasswordResetTokens.
     * @example
     * // Create many PasswordResetTokens
     * const passwordResetTokens = await prisma.passwordResetTokens.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PasswordResetTokensCreateManyArgs>(args?: SelectSubset<T, PasswordResetTokensCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PasswordResetTokens and returns the data saved in the database.
     * @param {PasswordResetTokensCreateManyAndReturnArgs} args - Arguments to create many PasswordResetTokens.
     * @example
     * // Create many PasswordResetTokens
     * const passwordResetTokens = await prisma.passwordResetTokens.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PasswordResetTokens and only return the `id`
     * const passwordResetTokensWithIdOnly = await prisma.passwordResetTokens.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PasswordResetTokensCreateManyAndReturnArgs>(args?: SelectSubset<T, PasswordResetTokensCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetTokensPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PasswordResetTokens.
     * @param {PasswordResetTokensDeleteArgs} args - Arguments to delete one PasswordResetTokens.
     * @example
     * // Delete one PasswordResetTokens
     * const PasswordResetTokens = await prisma.passwordResetTokens.delete({
     *   where: {
     *     // ... filter to delete one PasswordResetTokens
     *   }
     * })
     * 
     */
    delete<T extends PasswordResetTokensDeleteArgs>(args: SelectSubset<T, PasswordResetTokensDeleteArgs<ExtArgs>>): Prisma__PasswordResetTokensClient<$Result.GetResult<Prisma.$PasswordResetTokensPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PasswordResetTokens.
     * @param {PasswordResetTokensUpdateArgs} args - Arguments to update one PasswordResetTokens.
     * @example
     * // Update one PasswordResetTokens
     * const passwordResetTokens = await prisma.passwordResetTokens.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PasswordResetTokensUpdateArgs>(args: SelectSubset<T, PasswordResetTokensUpdateArgs<ExtArgs>>): Prisma__PasswordResetTokensClient<$Result.GetResult<Prisma.$PasswordResetTokensPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PasswordResetTokens.
     * @param {PasswordResetTokensDeleteManyArgs} args - Arguments to filter PasswordResetTokens to delete.
     * @example
     * // Delete a few PasswordResetTokens
     * const { count } = await prisma.passwordResetTokens.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PasswordResetTokensDeleteManyArgs>(args?: SelectSubset<T, PasswordResetTokensDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasswordResetTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokensUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PasswordResetTokens
     * const passwordResetTokens = await prisma.passwordResetTokens.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PasswordResetTokensUpdateManyArgs>(args: SelectSubset<T, PasswordResetTokensUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasswordResetTokens and returns the data updated in the database.
     * @param {PasswordResetTokensUpdateManyAndReturnArgs} args - Arguments to update many PasswordResetTokens.
     * @example
     * // Update many PasswordResetTokens
     * const passwordResetTokens = await prisma.passwordResetTokens.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PasswordResetTokens and only return the `id`
     * const passwordResetTokensWithIdOnly = await prisma.passwordResetTokens.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PasswordResetTokensUpdateManyAndReturnArgs>(args: SelectSubset<T, PasswordResetTokensUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetTokensPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PasswordResetTokens.
     * @param {PasswordResetTokensUpsertArgs} args - Arguments to update or create a PasswordResetTokens.
     * @example
     * // Update or create a PasswordResetTokens
     * const passwordResetTokens = await prisma.passwordResetTokens.upsert({
     *   create: {
     *     // ... data to create a PasswordResetTokens
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PasswordResetTokens we want to update
     *   }
     * })
     */
    upsert<T extends PasswordResetTokensUpsertArgs>(args: SelectSubset<T, PasswordResetTokensUpsertArgs<ExtArgs>>): Prisma__PasswordResetTokensClient<$Result.GetResult<Prisma.$PasswordResetTokensPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PasswordResetTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokensCountArgs} args - Arguments to filter PasswordResetTokens to count.
     * @example
     * // Count the number of PasswordResetTokens
     * const count = await prisma.passwordResetTokens.count({
     *   where: {
     *     // ... the filter for the PasswordResetTokens we want to count
     *   }
     * })
    **/
    count<T extends PasswordResetTokensCountArgs>(
      args?: Subset<T, PasswordResetTokensCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PasswordResetTokensCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PasswordResetTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokensAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PasswordResetTokensAggregateArgs>(args: Subset<T, PasswordResetTokensAggregateArgs>): Prisma.PrismaPromise<GetPasswordResetTokensAggregateType<T>>

    /**
     * Group by PasswordResetTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokensGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PasswordResetTokensGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PasswordResetTokensGroupByArgs['orderBy'] }
        : { orderBy?: PasswordResetTokensGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PasswordResetTokensGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPasswordResetTokensGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PasswordResetTokens model
   */
  readonly fields: PasswordResetTokensFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PasswordResetTokens.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PasswordResetTokensClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PasswordResetTokens model
   */
  interface PasswordResetTokensFieldRefs {
    readonly id: FieldRef<"PasswordResetTokens", 'Int'>
    readonly email: FieldRef<"PasswordResetTokens", 'String'>
    readonly token: FieldRef<"PasswordResetTokens", 'String'>
    readonly expiresAt: FieldRef<"PasswordResetTokens", 'DateTime'>
    readonly used: FieldRef<"PasswordResetTokens", 'Boolean'>
    readonly userType: FieldRef<"PasswordResetTokens", 'String'>
    readonly createdAt: FieldRef<"PasswordResetTokens", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PasswordResetTokens findUnique
   */
  export type PasswordResetTokensFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetTokens
     */
    select?: PasswordResetTokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetTokens
     */
    omit?: PasswordResetTokensOmit<ExtArgs> | null
    /**
     * Filter, which PasswordResetTokens to fetch.
     */
    where: PasswordResetTokensWhereUniqueInput
  }

  /**
   * PasswordResetTokens findUniqueOrThrow
   */
  export type PasswordResetTokensFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetTokens
     */
    select?: PasswordResetTokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetTokens
     */
    omit?: PasswordResetTokensOmit<ExtArgs> | null
    /**
     * Filter, which PasswordResetTokens to fetch.
     */
    where: PasswordResetTokensWhereUniqueInput
  }

  /**
   * PasswordResetTokens findFirst
   */
  export type PasswordResetTokensFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetTokens
     */
    select?: PasswordResetTokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetTokens
     */
    omit?: PasswordResetTokensOmit<ExtArgs> | null
    /**
     * Filter, which PasswordResetTokens to fetch.
     */
    where?: PasswordResetTokensWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?: PasswordResetTokensOrderByWithRelationInput | PasswordResetTokensOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResetTokens.
     */
    cursor?: PasswordResetTokensWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResetTokens.
     */
    distinct?: PasswordResetTokensScalarFieldEnum | PasswordResetTokensScalarFieldEnum[]
  }

  /**
   * PasswordResetTokens findFirstOrThrow
   */
  export type PasswordResetTokensFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetTokens
     */
    select?: PasswordResetTokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetTokens
     */
    omit?: PasswordResetTokensOmit<ExtArgs> | null
    /**
     * Filter, which PasswordResetTokens to fetch.
     */
    where?: PasswordResetTokensWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?: PasswordResetTokensOrderByWithRelationInput | PasswordResetTokensOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResetTokens.
     */
    cursor?: PasswordResetTokensWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResetTokens.
     */
    distinct?: PasswordResetTokensScalarFieldEnum | PasswordResetTokensScalarFieldEnum[]
  }

  /**
   * PasswordResetTokens findMany
   */
  export type PasswordResetTokensFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetTokens
     */
    select?: PasswordResetTokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetTokens
     */
    omit?: PasswordResetTokensOmit<ExtArgs> | null
    /**
     * Filter, which PasswordResetTokens to fetch.
     */
    where?: PasswordResetTokensWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?: PasswordResetTokensOrderByWithRelationInput | PasswordResetTokensOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PasswordResetTokens.
     */
    cursor?: PasswordResetTokensWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number
    distinct?: PasswordResetTokensScalarFieldEnum | PasswordResetTokensScalarFieldEnum[]
  }

  /**
   * PasswordResetTokens create
   */
  export type PasswordResetTokensCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetTokens
     */
    select?: PasswordResetTokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetTokens
     */
    omit?: PasswordResetTokensOmit<ExtArgs> | null
    /**
     * The data needed to create a PasswordResetTokens.
     */
    data: XOR<PasswordResetTokensCreateInput, PasswordResetTokensUncheckedCreateInput>
  }

  /**
   * PasswordResetTokens createMany
   */
  export type PasswordResetTokensCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PasswordResetTokens.
     */
    data: PasswordResetTokensCreateManyInput | PasswordResetTokensCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PasswordResetTokens createManyAndReturn
   */
  export type PasswordResetTokensCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetTokens
     */
    select?: PasswordResetTokensSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetTokens
     */
    omit?: PasswordResetTokensOmit<ExtArgs> | null
    /**
     * The data used to create many PasswordResetTokens.
     */
    data: PasswordResetTokensCreateManyInput | PasswordResetTokensCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PasswordResetTokens update
   */
  export type PasswordResetTokensUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetTokens
     */
    select?: PasswordResetTokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetTokens
     */
    omit?: PasswordResetTokensOmit<ExtArgs> | null
    /**
     * The data needed to update a PasswordResetTokens.
     */
    data: XOR<PasswordResetTokensUpdateInput, PasswordResetTokensUncheckedUpdateInput>
    /**
     * Choose, which PasswordResetTokens to update.
     */
    where: PasswordResetTokensWhereUniqueInput
  }

  /**
   * PasswordResetTokens updateMany
   */
  export type PasswordResetTokensUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PasswordResetTokens.
     */
    data: XOR<PasswordResetTokensUpdateManyMutationInput, PasswordResetTokensUncheckedUpdateManyInput>
    /**
     * Filter which PasswordResetTokens to update
     */
    where?: PasswordResetTokensWhereInput
    /**
     * Limit how many PasswordResetTokens to update.
     */
    limit?: number
  }

  /**
   * PasswordResetTokens updateManyAndReturn
   */
  export type PasswordResetTokensUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetTokens
     */
    select?: PasswordResetTokensSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetTokens
     */
    omit?: PasswordResetTokensOmit<ExtArgs> | null
    /**
     * The data used to update PasswordResetTokens.
     */
    data: XOR<PasswordResetTokensUpdateManyMutationInput, PasswordResetTokensUncheckedUpdateManyInput>
    /**
     * Filter which PasswordResetTokens to update
     */
    where?: PasswordResetTokensWhereInput
    /**
     * Limit how many PasswordResetTokens to update.
     */
    limit?: number
  }

  /**
   * PasswordResetTokens upsert
   */
  export type PasswordResetTokensUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetTokens
     */
    select?: PasswordResetTokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetTokens
     */
    omit?: PasswordResetTokensOmit<ExtArgs> | null
    /**
     * The filter to search for the PasswordResetTokens to update in case it exists.
     */
    where: PasswordResetTokensWhereUniqueInput
    /**
     * In case the PasswordResetTokens found by the `where` argument doesn't exist, create a new PasswordResetTokens with this data.
     */
    create: XOR<PasswordResetTokensCreateInput, PasswordResetTokensUncheckedCreateInput>
    /**
     * In case the PasswordResetTokens was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PasswordResetTokensUpdateInput, PasswordResetTokensUncheckedUpdateInput>
  }

  /**
   * PasswordResetTokens delete
   */
  export type PasswordResetTokensDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetTokens
     */
    select?: PasswordResetTokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetTokens
     */
    omit?: PasswordResetTokensOmit<ExtArgs> | null
    /**
     * Filter which PasswordResetTokens to delete.
     */
    where: PasswordResetTokensWhereUniqueInput
  }

  /**
   * PasswordResetTokens deleteMany
   */
  export type PasswordResetTokensDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordResetTokens to delete
     */
    where?: PasswordResetTokensWhereInput
    /**
     * Limit how many PasswordResetTokens to delete.
     */
    limit?: number
  }

  /**
   * PasswordResetTokens without action
   */
  export type PasswordResetTokensDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetTokens
     */
    select?: PasswordResetTokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetTokens
     */
    omit?: PasswordResetTokensOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const InstitucionesScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    direccion_principal: 'direccion_principal',
    nit: 'nit',
    nombre_contacto: 'nombre_contacto',
    telefono_contacto: 'telefono_contacto',
    email: 'email',
    password: 'password',
    tiene_sedes: 'tiene_sedes',
    jornadas: 'jornadas',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type InstitucionesScalarFieldEnum = (typeof InstitucionesScalarFieldEnum)[keyof typeof InstitucionesScalarFieldEnum]


  export const SedesScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    jornadas: 'jornadas',
    institucion_id: 'institucion_id',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type SedesScalarFieldEnum = (typeof SedesScalarFieldEnum)[keyof typeof SedesScalarFieldEnum]


  export const AdministradoresScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    apellido: 'apellido',
    telefono: 'telefono',
    cargo: 'cargo',
    institucion_id: 'institucion_id',
    created_at: 'created_at',
    updated_at: 'updated_at',
    correo: 'correo',
    sede_id: 'sede_id',
    password: 'password',
    supabase_user_id: 'supabase_user_id'
  };

  export type AdministradoresScalarFieldEnum = (typeof AdministradoresScalarFieldEnum)[keyof typeof AdministradoresScalarFieldEnum]


  export const PasswordResetTokensScalarFieldEnum: {
    id: 'id',
    email: 'email',
    token: 'token',
    expiresAt: 'expiresAt',
    used: 'used',
    userType: 'userType',
    createdAt: 'createdAt'
  };

  export type PasswordResetTokensScalarFieldEnum = (typeof PasswordResetTokensScalarFieldEnum)[keyof typeof PasswordResetTokensScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type InstitucionesWhereInput = {
    AND?: InstitucionesWhereInput | InstitucionesWhereInput[]
    OR?: InstitucionesWhereInput[]
    NOT?: InstitucionesWhereInput | InstitucionesWhereInput[]
    id?: IntFilter<"Instituciones"> | number
    nombre?: StringFilter<"Instituciones"> | string
    direccion_principal?: StringFilter<"Instituciones"> | string
    nit?: StringFilter<"Instituciones"> | string
    nombre_contacto?: StringFilter<"Instituciones"> | string
    telefono_contacto?: StringFilter<"Instituciones"> | string
    email?: StringFilter<"Instituciones"> | string
    password?: StringFilter<"Instituciones"> | string
    tiene_sedes?: BoolFilter<"Instituciones"> | boolean
    jornadas?: StringNullableListFilter<"Instituciones">
    created_at?: DateTimeFilter<"Instituciones"> | Date | string
    updated_at?: DateTimeFilter<"Instituciones"> | Date | string
    administradores?: AdministradoresListRelationFilter
    sedes?: SedesListRelationFilter
  }

  export type InstitucionesOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    direccion_principal?: SortOrder
    nit?: SortOrder
    nombre_contacto?: SortOrder
    telefono_contacto?: SortOrder
    email?: SortOrder
    password?: SortOrder
    tiene_sedes?: SortOrder
    jornadas?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    administradores?: AdministradoresOrderByRelationAggregateInput
    sedes?: SedesOrderByRelationAggregateInput
  }

  export type InstitucionesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: InstitucionesWhereInput | InstitucionesWhereInput[]
    OR?: InstitucionesWhereInput[]
    NOT?: InstitucionesWhereInput | InstitucionesWhereInput[]
    nombre?: StringFilter<"Instituciones"> | string
    direccion_principal?: StringFilter<"Instituciones"> | string
    nit?: StringFilter<"Instituciones"> | string
    nombre_contacto?: StringFilter<"Instituciones"> | string
    telefono_contacto?: StringFilter<"Instituciones"> | string
    password?: StringFilter<"Instituciones"> | string
    tiene_sedes?: BoolFilter<"Instituciones"> | boolean
    jornadas?: StringNullableListFilter<"Instituciones">
    created_at?: DateTimeFilter<"Instituciones"> | Date | string
    updated_at?: DateTimeFilter<"Instituciones"> | Date | string
    administradores?: AdministradoresListRelationFilter
    sedes?: SedesListRelationFilter
  }, "id" | "email">

  export type InstitucionesOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    direccion_principal?: SortOrder
    nit?: SortOrder
    nombre_contacto?: SortOrder
    telefono_contacto?: SortOrder
    email?: SortOrder
    password?: SortOrder
    tiene_sedes?: SortOrder
    jornadas?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: InstitucionesCountOrderByAggregateInput
    _avg?: InstitucionesAvgOrderByAggregateInput
    _max?: InstitucionesMaxOrderByAggregateInput
    _min?: InstitucionesMinOrderByAggregateInput
    _sum?: InstitucionesSumOrderByAggregateInput
  }

  export type InstitucionesScalarWhereWithAggregatesInput = {
    AND?: InstitucionesScalarWhereWithAggregatesInput | InstitucionesScalarWhereWithAggregatesInput[]
    OR?: InstitucionesScalarWhereWithAggregatesInput[]
    NOT?: InstitucionesScalarWhereWithAggregatesInput | InstitucionesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Instituciones"> | number
    nombre?: StringWithAggregatesFilter<"Instituciones"> | string
    direccion_principal?: StringWithAggregatesFilter<"Instituciones"> | string
    nit?: StringWithAggregatesFilter<"Instituciones"> | string
    nombre_contacto?: StringWithAggregatesFilter<"Instituciones"> | string
    telefono_contacto?: StringWithAggregatesFilter<"Instituciones"> | string
    email?: StringWithAggregatesFilter<"Instituciones"> | string
    password?: StringWithAggregatesFilter<"Instituciones"> | string
    tiene_sedes?: BoolWithAggregatesFilter<"Instituciones"> | boolean
    jornadas?: StringNullableListFilter<"Instituciones">
    created_at?: DateTimeWithAggregatesFilter<"Instituciones"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Instituciones"> | Date | string
  }

  export type SedesWhereInput = {
    AND?: SedesWhereInput | SedesWhereInput[]
    OR?: SedesWhereInput[]
    NOT?: SedesWhereInput | SedesWhereInput[]
    id?: IntFilter<"Sedes"> | number
    nombre?: StringFilter<"Sedes"> | string
    jornadas?: StringNullableListFilter<"Sedes">
    institucion_id?: IntFilter<"Sedes"> | number
    created_at?: DateTimeFilter<"Sedes"> | Date | string
    updated_at?: DateTimeFilter<"Sedes"> | Date | string
    administradores?: AdministradoresListRelationFilter
    institucion?: XOR<InstitucionesScalarRelationFilter, InstitucionesWhereInput>
  }

  export type SedesOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    jornadas?: SortOrder
    institucion_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    administradores?: AdministradoresOrderByRelationAggregateInput
    institucion?: InstitucionesOrderByWithRelationInput
  }

  export type SedesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: SedesWhereInput | SedesWhereInput[]
    OR?: SedesWhereInput[]
    NOT?: SedesWhereInput | SedesWhereInput[]
    nombre?: StringFilter<"Sedes"> | string
    jornadas?: StringNullableListFilter<"Sedes">
    institucion_id?: IntFilter<"Sedes"> | number
    created_at?: DateTimeFilter<"Sedes"> | Date | string
    updated_at?: DateTimeFilter<"Sedes"> | Date | string
    administradores?: AdministradoresListRelationFilter
    institucion?: XOR<InstitucionesScalarRelationFilter, InstitucionesWhereInput>
  }, "id">

  export type SedesOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    jornadas?: SortOrder
    institucion_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: SedesCountOrderByAggregateInput
    _avg?: SedesAvgOrderByAggregateInput
    _max?: SedesMaxOrderByAggregateInput
    _min?: SedesMinOrderByAggregateInput
    _sum?: SedesSumOrderByAggregateInput
  }

  export type SedesScalarWhereWithAggregatesInput = {
    AND?: SedesScalarWhereWithAggregatesInput | SedesScalarWhereWithAggregatesInput[]
    OR?: SedesScalarWhereWithAggregatesInput[]
    NOT?: SedesScalarWhereWithAggregatesInput | SedesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Sedes"> | number
    nombre?: StringWithAggregatesFilter<"Sedes"> | string
    jornadas?: StringNullableListFilter<"Sedes">
    institucion_id?: IntWithAggregatesFilter<"Sedes"> | number
    created_at?: DateTimeWithAggregatesFilter<"Sedes"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Sedes"> | Date | string
  }

  export type AdministradoresWhereInput = {
    AND?: AdministradoresWhereInput | AdministradoresWhereInput[]
    OR?: AdministradoresWhereInput[]
    NOT?: AdministradoresWhereInput | AdministradoresWhereInput[]
    id?: IntFilter<"Administradores"> | number
    nombre?: StringFilter<"Administradores"> | string
    apellido?: StringFilter<"Administradores"> | string
    telefono?: StringFilter<"Administradores"> | string
    cargo?: StringFilter<"Administradores"> | string
    institucion_id?: IntFilter<"Administradores"> | number
    created_at?: DateTimeFilter<"Administradores"> | Date | string
    updated_at?: DateTimeFilter<"Administradores"> | Date | string
    correo?: StringFilter<"Administradores"> | string
    sede_id?: IntNullableFilter<"Administradores"> | number | null
    password?: StringFilter<"Administradores"> | string
    supabase_user_id?: StringNullableFilter<"Administradores"> | string | null
    institucion?: XOR<InstitucionesScalarRelationFilter, InstitucionesWhereInput>
    sede?: XOR<SedesNullableScalarRelationFilter, SedesWhereInput> | null
  }

  export type AdministradoresOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    apellido?: SortOrder
    telefono?: SortOrder
    cargo?: SortOrder
    institucion_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    correo?: SortOrder
    sede_id?: SortOrderInput | SortOrder
    password?: SortOrder
    supabase_user_id?: SortOrderInput | SortOrder
    institucion?: InstitucionesOrderByWithRelationInput
    sede?: SedesOrderByWithRelationInput
  }

  export type AdministradoresWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    correo?: string
    AND?: AdministradoresWhereInput | AdministradoresWhereInput[]
    OR?: AdministradoresWhereInput[]
    NOT?: AdministradoresWhereInput | AdministradoresWhereInput[]
    nombre?: StringFilter<"Administradores"> | string
    apellido?: StringFilter<"Administradores"> | string
    telefono?: StringFilter<"Administradores"> | string
    cargo?: StringFilter<"Administradores"> | string
    institucion_id?: IntFilter<"Administradores"> | number
    created_at?: DateTimeFilter<"Administradores"> | Date | string
    updated_at?: DateTimeFilter<"Administradores"> | Date | string
    sede_id?: IntNullableFilter<"Administradores"> | number | null
    password?: StringFilter<"Administradores"> | string
    supabase_user_id?: StringNullableFilter<"Administradores"> | string | null
    institucion?: XOR<InstitucionesScalarRelationFilter, InstitucionesWhereInput>
    sede?: XOR<SedesNullableScalarRelationFilter, SedesWhereInput> | null
  }, "id" | "correo">

  export type AdministradoresOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    apellido?: SortOrder
    telefono?: SortOrder
    cargo?: SortOrder
    institucion_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    correo?: SortOrder
    sede_id?: SortOrderInput | SortOrder
    password?: SortOrder
    supabase_user_id?: SortOrderInput | SortOrder
    _count?: AdministradoresCountOrderByAggregateInput
    _avg?: AdministradoresAvgOrderByAggregateInput
    _max?: AdministradoresMaxOrderByAggregateInput
    _min?: AdministradoresMinOrderByAggregateInput
    _sum?: AdministradoresSumOrderByAggregateInput
  }

  export type AdministradoresScalarWhereWithAggregatesInput = {
    AND?: AdministradoresScalarWhereWithAggregatesInput | AdministradoresScalarWhereWithAggregatesInput[]
    OR?: AdministradoresScalarWhereWithAggregatesInput[]
    NOT?: AdministradoresScalarWhereWithAggregatesInput | AdministradoresScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Administradores"> | number
    nombre?: StringWithAggregatesFilter<"Administradores"> | string
    apellido?: StringWithAggregatesFilter<"Administradores"> | string
    telefono?: StringWithAggregatesFilter<"Administradores"> | string
    cargo?: StringWithAggregatesFilter<"Administradores"> | string
    institucion_id?: IntWithAggregatesFilter<"Administradores"> | number
    created_at?: DateTimeWithAggregatesFilter<"Administradores"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Administradores"> | Date | string
    correo?: StringWithAggregatesFilter<"Administradores"> | string
    sede_id?: IntNullableWithAggregatesFilter<"Administradores"> | number | null
    password?: StringWithAggregatesFilter<"Administradores"> | string
    supabase_user_id?: StringNullableWithAggregatesFilter<"Administradores"> | string | null
  }

  export type PasswordResetTokensWhereInput = {
    AND?: PasswordResetTokensWhereInput | PasswordResetTokensWhereInput[]
    OR?: PasswordResetTokensWhereInput[]
    NOT?: PasswordResetTokensWhereInput | PasswordResetTokensWhereInput[]
    id?: IntFilter<"PasswordResetTokens"> | number
    email?: StringFilter<"PasswordResetTokens"> | string
    token?: StringFilter<"PasswordResetTokens"> | string
    expiresAt?: DateTimeFilter<"PasswordResetTokens"> | Date | string
    used?: BoolFilter<"PasswordResetTokens"> | boolean
    userType?: StringFilter<"PasswordResetTokens"> | string
    createdAt?: DateTimeFilter<"PasswordResetTokens"> | Date | string
  }

  export type PasswordResetTokensOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    used?: SortOrder
    userType?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetTokensWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    token?: string
    AND?: PasswordResetTokensWhereInput | PasswordResetTokensWhereInput[]
    OR?: PasswordResetTokensWhereInput[]
    NOT?: PasswordResetTokensWhereInput | PasswordResetTokensWhereInput[]
    email?: StringFilter<"PasswordResetTokens"> | string
    expiresAt?: DateTimeFilter<"PasswordResetTokens"> | Date | string
    used?: BoolFilter<"PasswordResetTokens"> | boolean
    userType?: StringFilter<"PasswordResetTokens"> | string
    createdAt?: DateTimeFilter<"PasswordResetTokens"> | Date | string
  }, "id" | "token">

  export type PasswordResetTokensOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    used?: SortOrder
    userType?: SortOrder
    createdAt?: SortOrder
    _count?: PasswordResetTokensCountOrderByAggregateInput
    _avg?: PasswordResetTokensAvgOrderByAggregateInput
    _max?: PasswordResetTokensMaxOrderByAggregateInput
    _min?: PasswordResetTokensMinOrderByAggregateInput
    _sum?: PasswordResetTokensSumOrderByAggregateInput
  }

  export type PasswordResetTokensScalarWhereWithAggregatesInput = {
    AND?: PasswordResetTokensScalarWhereWithAggregatesInput | PasswordResetTokensScalarWhereWithAggregatesInput[]
    OR?: PasswordResetTokensScalarWhereWithAggregatesInput[]
    NOT?: PasswordResetTokensScalarWhereWithAggregatesInput | PasswordResetTokensScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"PasswordResetTokens"> | number
    email?: StringWithAggregatesFilter<"PasswordResetTokens"> | string
    token?: StringWithAggregatesFilter<"PasswordResetTokens"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"PasswordResetTokens"> | Date | string
    used?: BoolWithAggregatesFilter<"PasswordResetTokens"> | boolean
    userType?: StringWithAggregatesFilter<"PasswordResetTokens"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PasswordResetTokens"> | Date | string
  }

  export type InstitucionesCreateInput = {
    nombre: string
    direccion_principal: string
    nit: string
    nombre_contacto: string
    telefono_contacto: string
    email: string
    password: string
    tiene_sedes?: boolean
    jornadas?: InstitucionesCreatejornadasInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    administradores?: AdministradoresCreateNestedManyWithoutInstitucionInput
    sedes?: SedesCreateNestedManyWithoutInstitucionInput
  }

  export type InstitucionesUncheckedCreateInput = {
    id?: number
    nombre: string
    direccion_principal: string
    nit: string
    nombre_contacto: string
    telefono_contacto: string
    email: string
    password: string
    tiene_sedes?: boolean
    jornadas?: InstitucionesCreatejornadasInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    administradores?: AdministradoresUncheckedCreateNestedManyWithoutInstitucionInput
    sedes?: SedesUncheckedCreateNestedManyWithoutInstitucionInput
  }

  export type InstitucionesUpdateInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    direccion_principal?: StringFieldUpdateOperationsInput | string
    nit?: StringFieldUpdateOperationsInput | string
    nombre_contacto?: StringFieldUpdateOperationsInput | string
    telefono_contacto?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    tiene_sedes?: BoolFieldUpdateOperationsInput | boolean
    jornadas?: InstitucionesUpdatejornadasInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    administradores?: AdministradoresUpdateManyWithoutInstitucionNestedInput
    sedes?: SedesUpdateManyWithoutInstitucionNestedInput
  }

  export type InstitucionesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    direccion_principal?: StringFieldUpdateOperationsInput | string
    nit?: StringFieldUpdateOperationsInput | string
    nombre_contacto?: StringFieldUpdateOperationsInput | string
    telefono_contacto?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    tiene_sedes?: BoolFieldUpdateOperationsInput | boolean
    jornadas?: InstitucionesUpdatejornadasInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    administradores?: AdministradoresUncheckedUpdateManyWithoutInstitucionNestedInput
    sedes?: SedesUncheckedUpdateManyWithoutInstitucionNestedInput
  }

  export type InstitucionesCreateManyInput = {
    id?: number
    nombre: string
    direccion_principal: string
    nit: string
    nombre_contacto: string
    telefono_contacto: string
    email: string
    password: string
    tiene_sedes?: boolean
    jornadas?: InstitucionesCreatejornadasInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type InstitucionesUpdateManyMutationInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    direccion_principal?: StringFieldUpdateOperationsInput | string
    nit?: StringFieldUpdateOperationsInput | string
    nombre_contacto?: StringFieldUpdateOperationsInput | string
    telefono_contacto?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    tiene_sedes?: BoolFieldUpdateOperationsInput | boolean
    jornadas?: InstitucionesUpdatejornadasInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InstitucionesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    direccion_principal?: StringFieldUpdateOperationsInput | string
    nit?: StringFieldUpdateOperationsInput | string
    nombre_contacto?: StringFieldUpdateOperationsInput | string
    telefono_contacto?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    tiene_sedes?: BoolFieldUpdateOperationsInput | boolean
    jornadas?: InstitucionesUpdatejornadasInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SedesCreateInput = {
    nombre: string
    jornadas?: SedesCreatejornadasInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    administradores?: AdministradoresCreateNestedManyWithoutSedeInput
    institucion: InstitucionesCreateNestedOneWithoutSedesInput
  }

  export type SedesUncheckedCreateInput = {
    id?: number
    nombre: string
    jornadas?: SedesCreatejornadasInput | string[]
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
    administradores?: AdministradoresUncheckedCreateNestedManyWithoutSedeInput
  }

  export type SedesUpdateInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    jornadas?: SedesUpdatejornadasInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    administradores?: AdministradoresUpdateManyWithoutSedeNestedInput
    institucion?: InstitucionesUpdateOneRequiredWithoutSedesNestedInput
  }

  export type SedesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    jornadas?: SedesUpdatejornadasInput | string[]
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    administradores?: AdministradoresUncheckedUpdateManyWithoutSedeNestedInput
  }

  export type SedesCreateManyInput = {
    id?: number
    nombre: string
    jornadas?: SedesCreatejornadasInput | string[]
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type SedesUpdateManyMutationInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    jornadas?: SedesUpdatejornadasInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SedesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    jornadas?: SedesUpdatejornadasInput | string[]
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdministradoresCreateInput = {
    nombre: string
    apellido: string
    telefono: string
    cargo: string
    created_at?: Date | string
    updated_at?: Date | string
    correo: string
    password: string
    supabase_user_id?: string | null
    institucion: InstitucionesCreateNestedOneWithoutAdministradoresInput
    sede?: SedesCreateNestedOneWithoutAdministradoresInput
  }

  export type AdministradoresUncheckedCreateInput = {
    id?: number
    nombre: string
    apellido: string
    telefono: string
    cargo: string
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
    correo: string
    sede_id?: number | null
    password: string
    supabase_user_id?: string | null
  }

  export type AdministradoresUpdateInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    apellido?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    cargo?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    correo?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    supabase_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    institucion?: InstitucionesUpdateOneRequiredWithoutAdministradoresNestedInput
    sede?: SedesUpdateOneWithoutAdministradoresNestedInput
  }

  export type AdministradoresUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    apellido?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    cargo?: StringFieldUpdateOperationsInput | string
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    correo?: StringFieldUpdateOperationsInput | string
    sede_id?: NullableIntFieldUpdateOperationsInput | number | null
    password?: StringFieldUpdateOperationsInput | string
    supabase_user_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AdministradoresCreateManyInput = {
    id?: number
    nombre: string
    apellido: string
    telefono: string
    cargo: string
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
    correo: string
    sede_id?: number | null
    password: string
    supabase_user_id?: string | null
  }

  export type AdministradoresUpdateManyMutationInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    apellido?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    cargo?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    correo?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    supabase_user_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AdministradoresUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    apellido?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    cargo?: StringFieldUpdateOperationsInput | string
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    correo?: StringFieldUpdateOperationsInput | string
    sede_id?: NullableIntFieldUpdateOperationsInput | number | null
    password?: StringFieldUpdateOperationsInput | string
    supabase_user_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PasswordResetTokensCreateInput = {
    email: string
    token: string
    expiresAt: Date | string
    used?: boolean
    userType: string
    createdAt?: Date | string
  }

  export type PasswordResetTokensUncheckedCreateInput = {
    id?: number
    email: string
    token: string
    expiresAt: Date | string
    used?: boolean
    userType: string
    createdAt?: Date | string
  }

  export type PasswordResetTokensUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    userType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetTokensUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    userType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetTokensCreateManyInput = {
    id?: number
    email: string
    token: string
    expiresAt: Date | string
    used?: boolean
    userType: string
    createdAt?: Date | string
  }

  export type PasswordResetTokensUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    userType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetTokensUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    userType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AdministradoresListRelationFilter = {
    every?: AdministradoresWhereInput
    some?: AdministradoresWhereInput
    none?: AdministradoresWhereInput
  }

  export type SedesListRelationFilter = {
    every?: SedesWhereInput
    some?: SedesWhereInput
    none?: SedesWhereInput
  }

  export type AdministradoresOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SedesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InstitucionesCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    direccion_principal?: SortOrder
    nit?: SortOrder
    nombre_contacto?: SortOrder
    telefono_contacto?: SortOrder
    email?: SortOrder
    password?: SortOrder
    tiene_sedes?: SortOrder
    jornadas?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type InstitucionesAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type InstitucionesMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    direccion_principal?: SortOrder
    nit?: SortOrder
    nombre_contacto?: SortOrder
    telefono_contacto?: SortOrder
    email?: SortOrder
    password?: SortOrder
    tiene_sedes?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type InstitucionesMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    direccion_principal?: SortOrder
    nit?: SortOrder
    nombre_contacto?: SortOrder
    telefono_contacto?: SortOrder
    email?: SortOrder
    password?: SortOrder
    tiene_sedes?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type InstitucionesSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type InstitucionesScalarRelationFilter = {
    is?: InstitucionesWhereInput
    isNot?: InstitucionesWhereInput
  }

  export type SedesCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    jornadas?: SortOrder
    institucion_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type SedesAvgOrderByAggregateInput = {
    id?: SortOrder
    institucion_id?: SortOrder
  }

  export type SedesMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    institucion_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type SedesMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    institucion_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type SedesSumOrderByAggregateInput = {
    id?: SortOrder
    institucion_id?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SedesNullableScalarRelationFilter = {
    is?: SedesWhereInput | null
    isNot?: SedesWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AdministradoresCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    apellido?: SortOrder
    telefono?: SortOrder
    cargo?: SortOrder
    institucion_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    correo?: SortOrder
    sede_id?: SortOrder
    password?: SortOrder
    supabase_user_id?: SortOrder
  }

  export type AdministradoresAvgOrderByAggregateInput = {
    id?: SortOrder
    institucion_id?: SortOrder
    sede_id?: SortOrder
  }

  export type AdministradoresMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    apellido?: SortOrder
    telefono?: SortOrder
    cargo?: SortOrder
    institucion_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    correo?: SortOrder
    sede_id?: SortOrder
    password?: SortOrder
    supabase_user_id?: SortOrder
  }

  export type AdministradoresMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    apellido?: SortOrder
    telefono?: SortOrder
    cargo?: SortOrder
    institucion_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    correo?: SortOrder
    sede_id?: SortOrder
    password?: SortOrder
    supabase_user_id?: SortOrder
  }

  export type AdministradoresSumOrderByAggregateInput = {
    id?: SortOrder
    institucion_id?: SortOrder
    sede_id?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type PasswordResetTokensCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    used?: SortOrder
    userType?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetTokensAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PasswordResetTokensMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    used?: SortOrder
    userType?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetTokensMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    used?: SortOrder
    userType?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetTokensSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type InstitucionesCreatejornadasInput = {
    set: string[]
  }

  export type AdministradoresCreateNestedManyWithoutInstitucionInput = {
    create?: XOR<AdministradoresCreateWithoutInstitucionInput, AdministradoresUncheckedCreateWithoutInstitucionInput> | AdministradoresCreateWithoutInstitucionInput[] | AdministradoresUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: AdministradoresCreateOrConnectWithoutInstitucionInput | AdministradoresCreateOrConnectWithoutInstitucionInput[]
    createMany?: AdministradoresCreateManyInstitucionInputEnvelope
    connect?: AdministradoresWhereUniqueInput | AdministradoresWhereUniqueInput[]
  }

  export type SedesCreateNestedManyWithoutInstitucionInput = {
    create?: XOR<SedesCreateWithoutInstitucionInput, SedesUncheckedCreateWithoutInstitucionInput> | SedesCreateWithoutInstitucionInput[] | SedesUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: SedesCreateOrConnectWithoutInstitucionInput | SedesCreateOrConnectWithoutInstitucionInput[]
    createMany?: SedesCreateManyInstitucionInputEnvelope
    connect?: SedesWhereUniqueInput | SedesWhereUniqueInput[]
  }

  export type AdministradoresUncheckedCreateNestedManyWithoutInstitucionInput = {
    create?: XOR<AdministradoresCreateWithoutInstitucionInput, AdministradoresUncheckedCreateWithoutInstitucionInput> | AdministradoresCreateWithoutInstitucionInput[] | AdministradoresUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: AdministradoresCreateOrConnectWithoutInstitucionInput | AdministradoresCreateOrConnectWithoutInstitucionInput[]
    createMany?: AdministradoresCreateManyInstitucionInputEnvelope
    connect?: AdministradoresWhereUniqueInput | AdministradoresWhereUniqueInput[]
  }

  export type SedesUncheckedCreateNestedManyWithoutInstitucionInput = {
    create?: XOR<SedesCreateWithoutInstitucionInput, SedesUncheckedCreateWithoutInstitucionInput> | SedesCreateWithoutInstitucionInput[] | SedesUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: SedesCreateOrConnectWithoutInstitucionInput | SedesCreateOrConnectWithoutInstitucionInput[]
    createMany?: SedesCreateManyInstitucionInputEnvelope
    connect?: SedesWhereUniqueInput | SedesWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type InstitucionesUpdatejornadasInput = {
    set?: string[]
    push?: string | string[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AdministradoresUpdateManyWithoutInstitucionNestedInput = {
    create?: XOR<AdministradoresCreateWithoutInstitucionInput, AdministradoresUncheckedCreateWithoutInstitucionInput> | AdministradoresCreateWithoutInstitucionInput[] | AdministradoresUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: AdministradoresCreateOrConnectWithoutInstitucionInput | AdministradoresCreateOrConnectWithoutInstitucionInput[]
    upsert?: AdministradoresUpsertWithWhereUniqueWithoutInstitucionInput | AdministradoresUpsertWithWhereUniqueWithoutInstitucionInput[]
    createMany?: AdministradoresCreateManyInstitucionInputEnvelope
    set?: AdministradoresWhereUniqueInput | AdministradoresWhereUniqueInput[]
    disconnect?: AdministradoresWhereUniqueInput | AdministradoresWhereUniqueInput[]
    delete?: AdministradoresWhereUniqueInput | AdministradoresWhereUniqueInput[]
    connect?: AdministradoresWhereUniqueInput | AdministradoresWhereUniqueInput[]
    update?: AdministradoresUpdateWithWhereUniqueWithoutInstitucionInput | AdministradoresUpdateWithWhereUniqueWithoutInstitucionInput[]
    updateMany?: AdministradoresUpdateManyWithWhereWithoutInstitucionInput | AdministradoresUpdateManyWithWhereWithoutInstitucionInput[]
    deleteMany?: AdministradoresScalarWhereInput | AdministradoresScalarWhereInput[]
  }

  export type SedesUpdateManyWithoutInstitucionNestedInput = {
    create?: XOR<SedesCreateWithoutInstitucionInput, SedesUncheckedCreateWithoutInstitucionInput> | SedesCreateWithoutInstitucionInput[] | SedesUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: SedesCreateOrConnectWithoutInstitucionInput | SedesCreateOrConnectWithoutInstitucionInput[]
    upsert?: SedesUpsertWithWhereUniqueWithoutInstitucionInput | SedesUpsertWithWhereUniqueWithoutInstitucionInput[]
    createMany?: SedesCreateManyInstitucionInputEnvelope
    set?: SedesWhereUniqueInput | SedesWhereUniqueInput[]
    disconnect?: SedesWhereUniqueInput | SedesWhereUniqueInput[]
    delete?: SedesWhereUniqueInput | SedesWhereUniqueInput[]
    connect?: SedesWhereUniqueInput | SedesWhereUniqueInput[]
    update?: SedesUpdateWithWhereUniqueWithoutInstitucionInput | SedesUpdateWithWhereUniqueWithoutInstitucionInput[]
    updateMany?: SedesUpdateManyWithWhereWithoutInstitucionInput | SedesUpdateManyWithWhereWithoutInstitucionInput[]
    deleteMany?: SedesScalarWhereInput | SedesScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AdministradoresUncheckedUpdateManyWithoutInstitucionNestedInput = {
    create?: XOR<AdministradoresCreateWithoutInstitucionInput, AdministradoresUncheckedCreateWithoutInstitucionInput> | AdministradoresCreateWithoutInstitucionInput[] | AdministradoresUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: AdministradoresCreateOrConnectWithoutInstitucionInput | AdministradoresCreateOrConnectWithoutInstitucionInput[]
    upsert?: AdministradoresUpsertWithWhereUniqueWithoutInstitucionInput | AdministradoresUpsertWithWhereUniqueWithoutInstitucionInput[]
    createMany?: AdministradoresCreateManyInstitucionInputEnvelope
    set?: AdministradoresWhereUniqueInput | AdministradoresWhereUniqueInput[]
    disconnect?: AdministradoresWhereUniqueInput | AdministradoresWhereUniqueInput[]
    delete?: AdministradoresWhereUniqueInput | AdministradoresWhereUniqueInput[]
    connect?: AdministradoresWhereUniqueInput | AdministradoresWhereUniqueInput[]
    update?: AdministradoresUpdateWithWhereUniqueWithoutInstitucionInput | AdministradoresUpdateWithWhereUniqueWithoutInstitucionInput[]
    updateMany?: AdministradoresUpdateManyWithWhereWithoutInstitucionInput | AdministradoresUpdateManyWithWhereWithoutInstitucionInput[]
    deleteMany?: AdministradoresScalarWhereInput | AdministradoresScalarWhereInput[]
  }

  export type SedesUncheckedUpdateManyWithoutInstitucionNestedInput = {
    create?: XOR<SedesCreateWithoutInstitucionInput, SedesUncheckedCreateWithoutInstitucionInput> | SedesCreateWithoutInstitucionInput[] | SedesUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: SedesCreateOrConnectWithoutInstitucionInput | SedesCreateOrConnectWithoutInstitucionInput[]
    upsert?: SedesUpsertWithWhereUniqueWithoutInstitucionInput | SedesUpsertWithWhereUniqueWithoutInstitucionInput[]
    createMany?: SedesCreateManyInstitucionInputEnvelope
    set?: SedesWhereUniqueInput | SedesWhereUniqueInput[]
    disconnect?: SedesWhereUniqueInput | SedesWhereUniqueInput[]
    delete?: SedesWhereUniqueInput | SedesWhereUniqueInput[]
    connect?: SedesWhereUniqueInput | SedesWhereUniqueInput[]
    update?: SedesUpdateWithWhereUniqueWithoutInstitucionInput | SedesUpdateWithWhereUniqueWithoutInstitucionInput[]
    updateMany?: SedesUpdateManyWithWhereWithoutInstitucionInput | SedesUpdateManyWithWhereWithoutInstitucionInput[]
    deleteMany?: SedesScalarWhereInput | SedesScalarWhereInput[]
  }

  export type SedesCreatejornadasInput = {
    set: string[]
  }

  export type AdministradoresCreateNestedManyWithoutSedeInput = {
    create?: XOR<AdministradoresCreateWithoutSedeInput, AdministradoresUncheckedCreateWithoutSedeInput> | AdministradoresCreateWithoutSedeInput[] | AdministradoresUncheckedCreateWithoutSedeInput[]
    connectOrCreate?: AdministradoresCreateOrConnectWithoutSedeInput | AdministradoresCreateOrConnectWithoutSedeInput[]
    createMany?: AdministradoresCreateManySedeInputEnvelope
    connect?: AdministradoresWhereUniqueInput | AdministradoresWhereUniqueInput[]
  }

  export type InstitucionesCreateNestedOneWithoutSedesInput = {
    create?: XOR<InstitucionesCreateWithoutSedesInput, InstitucionesUncheckedCreateWithoutSedesInput>
    connectOrCreate?: InstitucionesCreateOrConnectWithoutSedesInput
    connect?: InstitucionesWhereUniqueInput
  }

  export type AdministradoresUncheckedCreateNestedManyWithoutSedeInput = {
    create?: XOR<AdministradoresCreateWithoutSedeInput, AdministradoresUncheckedCreateWithoutSedeInput> | AdministradoresCreateWithoutSedeInput[] | AdministradoresUncheckedCreateWithoutSedeInput[]
    connectOrCreate?: AdministradoresCreateOrConnectWithoutSedeInput | AdministradoresCreateOrConnectWithoutSedeInput[]
    createMany?: AdministradoresCreateManySedeInputEnvelope
    connect?: AdministradoresWhereUniqueInput | AdministradoresWhereUniqueInput[]
  }

  export type SedesUpdatejornadasInput = {
    set?: string[]
    push?: string | string[]
  }

  export type AdministradoresUpdateManyWithoutSedeNestedInput = {
    create?: XOR<AdministradoresCreateWithoutSedeInput, AdministradoresUncheckedCreateWithoutSedeInput> | AdministradoresCreateWithoutSedeInput[] | AdministradoresUncheckedCreateWithoutSedeInput[]
    connectOrCreate?: AdministradoresCreateOrConnectWithoutSedeInput | AdministradoresCreateOrConnectWithoutSedeInput[]
    upsert?: AdministradoresUpsertWithWhereUniqueWithoutSedeInput | AdministradoresUpsertWithWhereUniqueWithoutSedeInput[]
    createMany?: AdministradoresCreateManySedeInputEnvelope
    set?: AdministradoresWhereUniqueInput | AdministradoresWhereUniqueInput[]
    disconnect?: AdministradoresWhereUniqueInput | AdministradoresWhereUniqueInput[]
    delete?: AdministradoresWhereUniqueInput | AdministradoresWhereUniqueInput[]
    connect?: AdministradoresWhereUniqueInput | AdministradoresWhereUniqueInput[]
    update?: AdministradoresUpdateWithWhereUniqueWithoutSedeInput | AdministradoresUpdateWithWhereUniqueWithoutSedeInput[]
    updateMany?: AdministradoresUpdateManyWithWhereWithoutSedeInput | AdministradoresUpdateManyWithWhereWithoutSedeInput[]
    deleteMany?: AdministradoresScalarWhereInput | AdministradoresScalarWhereInput[]
  }

  export type InstitucionesUpdateOneRequiredWithoutSedesNestedInput = {
    create?: XOR<InstitucionesCreateWithoutSedesInput, InstitucionesUncheckedCreateWithoutSedesInput>
    connectOrCreate?: InstitucionesCreateOrConnectWithoutSedesInput
    upsert?: InstitucionesUpsertWithoutSedesInput
    connect?: InstitucionesWhereUniqueInput
    update?: XOR<XOR<InstitucionesUpdateToOneWithWhereWithoutSedesInput, InstitucionesUpdateWithoutSedesInput>, InstitucionesUncheckedUpdateWithoutSedesInput>
  }

  export type AdministradoresUncheckedUpdateManyWithoutSedeNestedInput = {
    create?: XOR<AdministradoresCreateWithoutSedeInput, AdministradoresUncheckedCreateWithoutSedeInput> | AdministradoresCreateWithoutSedeInput[] | AdministradoresUncheckedCreateWithoutSedeInput[]
    connectOrCreate?: AdministradoresCreateOrConnectWithoutSedeInput | AdministradoresCreateOrConnectWithoutSedeInput[]
    upsert?: AdministradoresUpsertWithWhereUniqueWithoutSedeInput | AdministradoresUpsertWithWhereUniqueWithoutSedeInput[]
    createMany?: AdministradoresCreateManySedeInputEnvelope
    set?: AdministradoresWhereUniqueInput | AdministradoresWhereUniqueInput[]
    disconnect?: AdministradoresWhereUniqueInput | AdministradoresWhereUniqueInput[]
    delete?: AdministradoresWhereUniqueInput | AdministradoresWhereUniqueInput[]
    connect?: AdministradoresWhereUniqueInput | AdministradoresWhereUniqueInput[]
    update?: AdministradoresUpdateWithWhereUniqueWithoutSedeInput | AdministradoresUpdateWithWhereUniqueWithoutSedeInput[]
    updateMany?: AdministradoresUpdateManyWithWhereWithoutSedeInput | AdministradoresUpdateManyWithWhereWithoutSedeInput[]
    deleteMany?: AdministradoresScalarWhereInput | AdministradoresScalarWhereInput[]
  }

  export type InstitucionesCreateNestedOneWithoutAdministradoresInput = {
    create?: XOR<InstitucionesCreateWithoutAdministradoresInput, InstitucionesUncheckedCreateWithoutAdministradoresInput>
    connectOrCreate?: InstitucionesCreateOrConnectWithoutAdministradoresInput
    connect?: InstitucionesWhereUniqueInput
  }

  export type SedesCreateNestedOneWithoutAdministradoresInput = {
    create?: XOR<SedesCreateWithoutAdministradoresInput, SedesUncheckedCreateWithoutAdministradoresInput>
    connectOrCreate?: SedesCreateOrConnectWithoutAdministradoresInput
    connect?: SedesWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type InstitucionesUpdateOneRequiredWithoutAdministradoresNestedInput = {
    create?: XOR<InstitucionesCreateWithoutAdministradoresInput, InstitucionesUncheckedCreateWithoutAdministradoresInput>
    connectOrCreate?: InstitucionesCreateOrConnectWithoutAdministradoresInput
    upsert?: InstitucionesUpsertWithoutAdministradoresInput
    connect?: InstitucionesWhereUniqueInput
    update?: XOR<XOR<InstitucionesUpdateToOneWithWhereWithoutAdministradoresInput, InstitucionesUpdateWithoutAdministradoresInput>, InstitucionesUncheckedUpdateWithoutAdministradoresInput>
  }

  export type SedesUpdateOneWithoutAdministradoresNestedInput = {
    create?: XOR<SedesCreateWithoutAdministradoresInput, SedesUncheckedCreateWithoutAdministradoresInput>
    connectOrCreate?: SedesCreateOrConnectWithoutAdministradoresInput
    upsert?: SedesUpsertWithoutAdministradoresInput
    disconnect?: SedesWhereInput | boolean
    delete?: SedesWhereInput | boolean
    connect?: SedesWhereUniqueInput
    update?: XOR<XOR<SedesUpdateToOneWithWhereWithoutAdministradoresInput, SedesUpdateWithoutAdministradoresInput>, SedesUncheckedUpdateWithoutAdministradoresInput>
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type AdministradoresCreateWithoutInstitucionInput = {
    nombre: string
    apellido: string
    telefono: string
    cargo: string
    created_at?: Date | string
    updated_at?: Date | string
    correo: string
    password: string
    supabase_user_id?: string | null
    sede?: SedesCreateNestedOneWithoutAdministradoresInput
  }

  export type AdministradoresUncheckedCreateWithoutInstitucionInput = {
    id?: number
    nombre: string
    apellido: string
    telefono: string
    cargo: string
    created_at?: Date | string
    updated_at?: Date | string
    correo: string
    sede_id?: number | null
    password: string
    supabase_user_id?: string | null
  }

  export type AdministradoresCreateOrConnectWithoutInstitucionInput = {
    where: AdministradoresWhereUniqueInput
    create: XOR<AdministradoresCreateWithoutInstitucionInput, AdministradoresUncheckedCreateWithoutInstitucionInput>
  }

  export type AdministradoresCreateManyInstitucionInputEnvelope = {
    data: AdministradoresCreateManyInstitucionInput | AdministradoresCreateManyInstitucionInput[]
    skipDuplicates?: boolean
  }

  export type SedesCreateWithoutInstitucionInput = {
    nombre: string
    jornadas?: SedesCreatejornadasInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    administradores?: AdministradoresCreateNestedManyWithoutSedeInput
  }

  export type SedesUncheckedCreateWithoutInstitucionInput = {
    id?: number
    nombre: string
    jornadas?: SedesCreatejornadasInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    administradores?: AdministradoresUncheckedCreateNestedManyWithoutSedeInput
  }

  export type SedesCreateOrConnectWithoutInstitucionInput = {
    where: SedesWhereUniqueInput
    create: XOR<SedesCreateWithoutInstitucionInput, SedesUncheckedCreateWithoutInstitucionInput>
  }

  export type SedesCreateManyInstitucionInputEnvelope = {
    data: SedesCreateManyInstitucionInput | SedesCreateManyInstitucionInput[]
    skipDuplicates?: boolean
  }

  export type AdministradoresUpsertWithWhereUniqueWithoutInstitucionInput = {
    where: AdministradoresWhereUniqueInput
    update: XOR<AdministradoresUpdateWithoutInstitucionInput, AdministradoresUncheckedUpdateWithoutInstitucionInput>
    create: XOR<AdministradoresCreateWithoutInstitucionInput, AdministradoresUncheckedCreateWithoutInstitucionInput>
  }

  export type AdministradoresUpdateWithWhereUniqueWithoutInstitucionInput = {
    where: AdministradoresWhereUniqueInput
    data: XOR<AdministradoresUpdateWithoutInstitucionInput, AdministradoresUncheckedUpdateWithoutInstitucionInput>
  }

  export type AdministradoresUpdateManyWithWhereWithoutInstitucionInput = {
    where: AdministradoresScalarWhereInput
    data: XOR<AdministradoresUpdateManyMutationInput, AdministradoresUncheckedUpdateManyWithoutInstitucionInput>
  }

  export type AdministradoresScalarWhereInput = {
    AND?: AdministradoresScalarWhereInput | AdministradoresScalarWhereInput[]
    OR?: AdministradoresScalarWhereInput[]
    NOT?: AdministradoresScalarWhereInput | AdministradoresScalarWhereInput[]
    id?: IntFilter<"Administradores"> | number
    nombre?: StringFilter<"Administradores"> | string
    apellido?: StringFilter<"Administradores"> | string
    telefono?: StringFilter<"Administradores"> | string
    cargo?: StringFilter<"Administradores"> | string
    institucion_id?: IntFilter<"Administradores"> | number
    created_at?: DateTimeFilter<"Administradores"> | Date | string
    updated_at?: DateTimeFilter<"Administradores"> | Date | string
    correo?: StringFilter<"Administradores"> | string
    sede_id?: IntNullableFilter<"Administradores"> | number | null
    password?: StringFilter<"Administradores"> | string
    supabase_user_id?: StringNullableFilter<"Administradores"> | string | null
  }

  export type SedesUpsertWithWhereUniqueWithoutInstitucionInput = {
    where: SedesWhereUniqueInput
    update: XOR<SedesUpdateWithoutInstitucionInput, SedesUncheckedUpdateWithoutInstitucionInput>
    create: XOR<SedesCreateWithoutInstitucionInput, SedesUncheckedCreateWithoutInstitucionInput>
  }

  export type SedesUpdateWithWhereUniqueWithoutInstitucionInput = {
    where: SedesWhereUniqueInput
    data: XOR<SedesUpdateWithoutInstitucionInput, SedesUncheckedUpdateWithoutInstitucionInput>
  }

  export type SedesUpdateManyWithWhereWithoutInstitucionInput = {
    where: SedesScalarWhereInput
    data: XOR<SedesUpdateManyMutationInput, SedesUncheckedUpdateManyWithoutInstitucionInput>
  }

  export type SedesScalarWhereInput = {
    AND?: SedesScalarWhereInput | SedesScalarWhereInput[]
    OR?: SedesScalarWhereInput[]
    NOT?: SedesScalarWhereInput | SedesScalarWhereInput[]
    id?: IntFilter<"Sedes"> | number
    nombre?: StringFilter<"Sedes"> | string
    jornadas?: StringNullableListFilter<"Sedes">
    institucion_id?: IntFilter<"Sedes"> | number
    created_at?: DateTimeFilter<"Sedes"> | Date | string
    updated_at?: DateTimeFilter<"Sedes"> | Date | string
  }

  export type AdministradoresCreateWithoutSedeInput = {
    nombre: string
    apellido: string
    telefono: string
    cargo: string
    created_at?: Date | string
    updated_at?: Date | string
    correo: string
    password: string
    supabase_user_id?: string | null
    institucion: InstitucionesCreateNestedOneWithoutAdministradoresInput
  }

  export type AdministradoresUncheckedCreateWithoutSedeInput = {
    id?: number
    nombre: string
    apellido: string
    telefono: string
    cargo: string
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
    correo: string
    password: string
    supabase_user_id?: string | null
  }

  export type AdministradoresCreateOrConnectWithoutSedeInput = {
    where: AdministradoresWhereUniqueInput
    create: XOR<AdministradoresCreateWithoutSedeInput, AdministradoresUncheckedCreateWithoutSedeInput>
  }

  export type AdministradoresCreateManySedeInputEnvelope = {
    data: AdministradoresCreateManySedeInput | AdministradoresCreateManySedeInput[]
    skipDuplicates?: boolean
  }

  export type InstitucionesCreateWithoutSedesInput = {
    nombre: string
    direccion_principal: string
    nit: string
    nombre_contacto: string
    telefono_contacto: string
    email: string
    password: string
    tiene_sedes?: boolean
    jornadas?: InstitucionesCreatejornadasInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    administradores?: AdministradoresCreateNestedManyWithoutInstitucionInput
  }

  export type InstitucionesUncheckedCreateWithoutSedesInput = {
    id?: number
    nombre: string
    direccion_principal: string
    nit: string
    nombre_contacto: string
    telefono_contacto: string
    email: string
    password: string
    tiene_sedes?: boolean
    jornadas?: InstitucionesCreatejornadasInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    administradores?: AdministradoresUncheckedCreateNestedManyWithoutInstitucionInput
  }

  export type InstitucionesCreateOrConnectWithoutSedesInput = {
    where: InstitucionesWhereUniqueInput
    create: XOR<InstitucionesCreateWithoutSedesInput, InstitucionesUncheckedCreateWithoutSedesInput>
  }

  export type AdministradoresUpsertWithWhereUniqueWithoutSedeInput = {
    where: AdministradoresWhereUniqueInput
    update: XOR<AdministradoresUpdateWithoutSedeInput, AdministradoresUncheckedUpdateWithoutSedeInput>
    create: XOR<AdministradoresCreateWithoutSedeInput, AdministradoresUncheckedCreateWithoutSedeInput>
  }

  export type AdministradoresUpdateWithWhereUniqueWithoutSedeInput = {
    where: AdministradoresWhereUniqueInput
    data: XOR<AdministradoresUpdateWithoutSedeInput, AdministradoresUncheckedUpdateWithoutSedeInput>
  }

  export type AdministradoresUpdateManyWithWhereWithoutSedeInput = {
    where: AdministradoresScalarWhereInput
    data: XOR<AdministradoresUpdateManyMutationInput, AdministradoresUncheckedUpdateManyWithoutSedeInput>
  }

  export type InstitucionesUpsertWithoutSedesInput = {
    update: XOR<InstitucionesUpdateWithoutSedesInput, InstitucionesUncheckedUpdateWithoutSedesInput>
    create: XOR<InstitucionesCreateWithoutSedesInput, InstitucionesUncheckedCreateWithoutSedesInput>
    where?: InstitucionesWhereInput
  }

  export type InstitucionesUpdateToOneWithWhereWithoutSedesInput = {
    where?: InstitucionesWhereInput
    data: XOR<InstitucionesUpdateWithoutSedesInput, InstitucionesUncheckedUpdateWithoutSedesInput>
  }

  export type InstitucionesUpdateWithoutSedesInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    direccion_principal?: StringFieldUpdateOperationsInput | string
    nit?: StringFieldUpdateOperationsInput | string
    nombre_contacto?: StringFieldUpdateOperationsInput | string
    telefono_contacto?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    tiene_sedes?: BoolFieldUpdateOperationsInput | boolean
    jornadas?: InstitucionesUpdatejornadasInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    administradores?: AdministradoresUpdateManyWithoutInstitucionNestedInput
  }

  export type InstitucionesUncheckedUpdateWithoutSedesInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    direccion_principal?: StringFieldUpdateOperationsInput | string
    nit?: StringFieldUpdateOperationsInput | string
    nombre_contacto?: StringFieldUpdateOperationsInput | string
    telefono_contacto?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    tiene_sedes?: BoolFieldUpdateOperationsInput | boolean
    jornadas?: InstitucionesUpdatejornadasInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    administradores?: AdministradoresUncheckedUpdateManyWithoutInstitucionNestedInput
  }

  export type InstitucionesCreateWithoutAdministradoresInput = {
    nombre: string
    direccion_principal: string
    nit: string
    nombre_contacto: string
    telefono_contacto: string
    email: string
    password: string
    tiene_sedes?: boolean
    jornadas?: InstitucionesCreatejornadasInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    sedes?: SedesCreateNestedManyWithoutInstitucionInput
  }

  export type InstitucionesUncheckedCreateWithoutAdministradoresInput = {
    id?: number
    nombre: string
    direccion_principal: string
    nit: string
    nombre_contacto: string
    telefono_contacto: string
    email: string
    password: string
    tiene_sedes?: boolean
    jornadas?: InstitucionesCreatejornadasInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    sedes?: SedesUncheckedCreateNestedManyWithoutInstitucionInput
  }

  export type InstitucionesCreateOrConnectWithoutAdministradoresInput = {
    where: InstitucionesWhereUniqueInput
    create: XOR<InstitucionesCreateWithoutAdministradoresInput, InstitucionesUncheckedCreateWithoutAdministradoresInput>
  }

  export type SedesCreateWithoutAdministradoresInput = {
    nombre: string
    jornadas?: SedesCreatejornadasInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    institucion: InstitucionesCreateNestedOneWithoutSedesInput
  }

  export type SedesUncheckedCreateWithoutAdministradoresInput = {
    id?: number
    nombre: string
    jornadas?: SedesCreatejornadasInput | string[]
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type SedesCreateOrConnectWithoutAdministradoresInput = {
    where: SedesWhereUniqueInput
    create: XOR<SedesCreateWithoutAdministradoresInput, SedesUncheckedCreateWithoutAdministradoresInput>
  }

  export type InstitucionesUpsertWithoutAdministradoresInput = {
    update: XOR<InstitucionesUpdateWithoutAdministradoresInput, InstitucionesUncheckedUpdateWithoutAdministradoresInput>
    create: XOR<InstitucionesCreateWithoutAdministradoresInput, InstitucionesUncheckedCreateWithoutAdministradoresInput>
    where?: InstitucionesWhereInput
  }

  export type InstitucionesUpdateToOneWithWhereWithoutAdministradoresInput = {
    where?: InstitucionesWhereInput
    data: XOR<InstitucionesUpdateWithoutAdministradoresInput, InstitucionesUncheckedUpdateWithoutAdministradoresInput>
  }

  export type InstitucionesUpdateWithoutAdministradoresInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    direccion_principal?: StringFieldUpdateOperationsInput | string
    nit?: StringFieldUpdateOperationsInput | string
    nombre_contacto?: StringFieldUpdateOperationsInput | string
    telefono_contacto?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    tiene_sedes?: BoolFieldUpdateOperationsInput | boolean
    jornadas?: InstitucionesUpdatejornadasInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sedes?: SedesUpdateManyWithoutInstitucionNestedInput
  }

  export type InstitucionesUncheckedUpdateWithoutAdministradoresInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    direccion_principal?: StringFieldUpdateOperationsInput | string
    nit?: StringFieldUpdateOperationsInput | string
    nombre_contacto?: StringFieldUpdateOperationsInput | string
    telefono_contacto?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    tiene_sedes?: BoolFieldUpdateOperationsInput | boolean
    jornadas?: InstitucionesUpdatejornadasInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sedes?: SedesUncheckedUpdateManyWithoutInstitucionNestedInput
  }

  export type SedesUpsertWithoutAdministradoresInput = {
    update: XOR<SedesUpdateWithoutAdministradoresInput, SedesUncheckedUpdateWithoutAdministradoresInput>
    create: XOR<SedesCreateWithoutAdministradoresInput, SedesUncheckedCreateWithoutAdministradoresInput>
    where?: SedesWhereInput
  }

  export type SedesUpdateToOneWithWhereWithoutAdministradoresInput = {
    where?: SedesWhereInput
    data: XOR<SedesUpdateWithoutAdministradoresInput, SedesUncheckedUpdateWithoutAdministradoresInput>
  }

  export type SedesUpdateWithoutAdministradoresInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    jornadas?: SedesUpdatejornadasInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    institucion?: InstitucionesUpdateOneRequiredWithoutSedesNestedInput
  }

  export type SedesUncheckedUpdateWithoutAdministradoresInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    jornadas?: SedesUpdatejornadasInput | string[]
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdministradoresCreateManyInstitucionInput = {
    id?: number
    nombre: string
    apellido: string
    telefono: string
    cargo: string
    created_at?: Date | string
    updated_at?: Date | string
    correo: string
    sede_id?: number | null
    password: string
    supabase_user_id?: string | null
  }

  export type SedesCreateManyInstitucionInput = {
    id?: number
    nombre: string
    jornadas?: SedesCreatejornadasInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type AdministradoresUpdateWithoutInstitucionInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    apellido?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    cargo?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    correo?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    supabase_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    sede?: SedesUpdateOneWithoutAdministradoresNestedInput
  }

  export type AdministradoresUncheckedUpdateWithoutInstitucionInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    apellido?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    cargo?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    correo?: StringFieldUpdateOperationsInput | string
    sede_id?: NullableIntFieldUpdateOperationsInput | number | null
    password?: StringFieldUpdateOperationsInput | string
    supabase_user_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AdministradoresUncheckedUpdateManyWithoutInstitucionInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    apellido?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    cargo?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    correo?: StringFieldUpdateOperationsInput | string
    sede_id?: NullableIntFieldUpdateOperationsInput | number | null
    password?: StringFieldUpdateOperationsInput | string
    supabase_user_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SedesUpdateWithoutInstitucionInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    jornadas?: SedesUpdatejornadasInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    administradores?: AdministradoresUpdateManyWithoutSedeNestedInput
  }

  export type SedesUncheckedUpdateWithoutInstitucionInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    jornadas?: SedesUpdatejornadasInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    administradores?: AdministradoresUncheckedUpdateManyWithoutSedeNestedInput
  }

  export type SedesUncheckedUpdateManyWithoutInstitucionInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    jornadas?: SedesUpdatejornadasInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdministradoresCreateManySedeInput = {
    id?: number
    nombre: string
    apellido: string
    telefono: string
    cargo: string
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
    correo: string
    password: string
    supabase_user_id?: string | null
  }

  export type AdministradoresUpdateWithoutSedeInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    apellido?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    cargo?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    correo?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    supabase_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    institucion?: InstitucionesUpdateOneRequiredWithoutAdministradoresNestedInput
  }

  export type AdministradoresUncheckedUpdateWithoutSedeInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    apellido?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    cargo?: StringFieldUpdateOperationsInput | string
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    correo?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    supabase_user_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AdministradoresUncheckedUpdateManyWithoutSedeInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    apellido?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    cargo?: StringFieldUpdateOperationsInput | string
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    correo?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    supabase_user_id?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}