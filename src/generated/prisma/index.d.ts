
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
 * Model Grados
 * 
 */
export type Grados = $Result.DefaultSelection<Prisma.$GradosPayload>
/**
 * Model Cursos
 * 
 */
export type Cursos = $Result.DefaultSelection<Prisma.$CursosPayload>
/**
 * Model Areas
 * 
 */
export type Areas = $Result.DefaultSelection<Prisma.$AreasPayload>
/**
 * Model Materias
 * 
 */
export type Materias = $Result.DefaultSelection<Prisma.$MateriasPayload>
/**
 * Model MateriaGrados
 * 
 */
export type MateriaGrados = $Result.DefaultSelection<Prisma.$MateriaGradosPayload>
/**
 * Model Docentes
 * 
 */
export type Docentes = $Result.DefaultSelection<Prisma.$DocentesPayload>
/**
 * Model DocenteAsignaciones
 * 
 */
export type DocenteAsignaciones = $Result.DefaultSelection<Prisma.$DocenteAsignacionesPayload>
/**
 * Model Estudiantes
 * 
 */
export type Estudiantes = $Result.DefaultSelection<Prisma.$EstudiantesPayload>

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

  /**
   * `prisma.grados`: Exposes CRUD operations for the **Grados** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Grados
    * const grados = await prisma.grados.findMany()
    * ```
    */
  get grados(): Prisma.GradosDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cursos`: Exposes CRUD operations for the **Cursos** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Cursos
    * const cursos = await prisma.cursos.findMany()
    * ```
    */
  get cursos(): Prisma.CursosDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.areas`: Exposes CRUD operations for the **Areas** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Areas
    * const areas = await prisma.areas.findMany()
    * ```
    */
  get areas(): Prisma.AreasDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.materias`: Exposes CRUD operations for the **Materias** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Materias
    * const materias = await prisma.materias.findMany()
    * ```
    */
  get materias(): Prisma.MateriasDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.materiaGrados`: Exposes CRUD operations for the **MateriaGrados** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MateriaGrados
    * const materiaGrados = await prisma.materiaGrados.findMany()
    * ```
    */
  get materiaGrados(): Prisma.MateriaGradosDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.docentes`: Exposes CRUD operations for the **Docentes** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Docentes
    * const docentes = await prisma.docentes.findMany()
    * ```
    */
  get docentes(): Prisma.DocentesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.docenteAsignaciones`: Exposes CRUD operations for the **DocenteAsignaciones** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DocenteAsignaciones
    * const docenteAsignaciones = await prisma.docenteAsignaciones.findMany()
    * ```
    */
  get docenteAsignaciones(): Prisma.DocenteAsignacionesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.estudiantes`: Exposes CRUD operations for the **Estudiantes** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Estudiantes
    * const estudiantes = await prisma.estudiantes.findMany()
    * ```
    */
  get estudiantes(): Prisma.EstudiantesDelegate<ExtArgs, ClientOptions>;
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
    PasswordResetTokens: 'PasswordResetTokens',
    Grados: 'Grados',
    Cursos: 'Cursos',
    Areas: 'Areas',
    Materias: 'Materias',
    MateriaGrados: 'MateriaGrados',
    Docentes: 'Docentes',
    DocenteAsignaciones: 'DocenteAsignaciones',
    Estudiantes: 'Estudiantes'
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
      modelProps: "instituciones" | "sedes" | "administradores" | "passwordResetTokens" | "grados" | "cursos" | "areas" | "materias" | "materiaGrados" | "docentes" | "docenteAsignaciones" | "estudiantes"
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
      Grados: {
        payload: Prisma.$GradosPayload<ExtArgs>
        fields: Prisma.GradosFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GradosFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradosPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GradosFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradosPayload>
          }
          findFirst: {
            args: Prisma.GradosFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradosPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GradosFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradosPayload>
          }
          findMany: {
            args: Prisma.GradosFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradosPayload>[]
          }
          create: {
            args: Prisma.GradosCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradosPayload>
          }
          createMany: {
            args: Prisma.GradosCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GradosCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradosPayload>[]
          }
          delete: {
            args: Prisma.GradosDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradosPayload>
          }
          update: {
            args: Prisma.GradosUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradosPayload>
          }
          deleteMany: {
            args: Prisma.GradosDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GradosUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GradosUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradosPayload>[]
          }
          upsert: {
            args: Prisma.GradosUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradosPayload>
          }
          aggregate: {
            args: Prisma.GradosAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGrados>
          }
          groupBy: {
            args: Prisma.GradosGroupByArgs<ExtArgs>
            result: $Utils.Optional<GradosGroupByOutputType>[]
          }
          count: {
            args: Prisma.GradosCountArgs<ExtArgs>
            result: $Utils.Optional<GradosCountAggregateOutputType> | number
          }
        }
      }
      Cursos: {
        payload: Prisma.$CursosPayload<ExtArgs>
        fields: Prisma.CursosFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CursosFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CursosPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CursosFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CursosPayload>
          }
          findFirst: {
            args: Prisma.CursosFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CursosPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CursosFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CursosPayload>
          }
          findMany: {
            args: Prisma.CursosFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CursosPayload>[]
          }
          create: {
            args: Prisma.CursosCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CursosPayload>
          }
          createMany: {
            args: Prisma.CursosCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CursosCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CursosPayload>[]
          }
          delete: {
            args: Prisma.CursosDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CursosPayload>
          }
          update: {
            args: Prisma.CursosUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CursosPayload>
          }
          deleteMany: {
            args: Prisma.CursosDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CursosUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CursosUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CursosPayload>[]
          }
          upsert: {
            args: Prisma.CursosUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CursosPayload>
          }
          aggregate: {
            args: Prisma.CursosAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCursos>
          }
          groupBy: {
            args: Prisma.CursosGroupByArgs<ExtArgs>
            result: $Utils.Optional<CursosGroupByOutputType>[]
          }
          count: {
            args: Prisma.CursosCountArgs<ExtArgs>
            result: $Utils.Optional<CursosCountAggregateOutputType> | number
          }
        }
      }
      Areas: {
        payload: Prisma.$AreasPayload<ExtArgs>
        fields: Prisma.AreasFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AreasFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AreasPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AreasFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AreasPayload>
          }
          findFirst: {
            args: Prisma.AreasFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AreasPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AreasFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AreasPayload>
          }
          findMany: {
            args: Prisma.AreasFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AreasPayload>[]
          }
          create: {
            args: Prisma.AreasCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AreasPayload>
          }
          createMany: {
            args: Prisma.AreasCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AreasCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AreasPayload>[]
          }
          delete: {
            args: Prisma.AreasDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AreasPayload>
          }
          update: {
            args: Prisma.AreasUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AreasPayload>
          }
          deleteMany: {
            args: Prisma.AreasDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AreasUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AreasUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AreasPayload>[]
          }
          upsert: {
            args: Prisma.AreasUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AreasPayload>
          }
          aggregate: {
            args: Prisma.AreasAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAreas>
          }
          groupBy: {
            args: Prisma.AreasGroupByArgs<ExtArgs>
            result: $Utils.Optional<AreasGroupByOutputType>[]
          }
          count: {
            args: Prisma.AreasCountArgs<ExtArgs>
            result: $Utils.Optional<AreasCountAggregateOutputType> | number
          }
        }
      }
      Materias: {
        payload: Prisma.$MateriasPayload<ExtArgs>
        fields: Prisma.MateriasFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MateriasFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MateriasPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MateriasFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MateriasPayload>
          }
          findFirst: {
            args: Prisma.MateriasFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MateriasPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MateriasFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MateriasPayload>
          }
          findMany: {
            args: Prisma.MateriasFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MateriasPayload>[]
          }
          create: {
            args: Prisma.MateriasCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MateriasPayload>
          }
          createMany: {
            args: Prisma.MateriasCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MateriasCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MateriasPayload>[]
          }
          delete: {
            args: Prisma.MateriasDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MateriasPayload>
          }
          update: {
            args: Prisma.MateriasUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MateriasPayload>
          }
          deleteMany: {
            args: Prisma.MateriasDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MateriasUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MateriasUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MateriasPayload>[]
          }
          upsert: {
            args: Prisma.MateriasUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MateriasPayload>
          }
          aggregate: {
            args: Prisma.MateriasAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMaterias>
          }
          groupBy: {
            args: Prisma.MateriasGroupByArgs<ExtArgs>
            result: $Utils.Optional<MateriasGroupByOutputType>[]
          }
          count: {
            args: Prisma.MateriasCountArgs<ExtArgs>
            result: $Utils.Optional<MateriasCountAggregateOutputType> | number
          }
        }
      }
      MateriaGrados: {
        payload: Prisma.$MateriaGradosPayload<ExtArgs>
        fields: Prisma.MateriaGradosFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MateriaGradosFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MateriaGradosPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MateriaGradosFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MateriaGradosPayload>
          }
          findFirst: {
            args: Prisma.MateriaGradosFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MateriaGradosPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MateriaGradosFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MateriaGradosPayload>
          }
          findMany: {
            args: Prisma.MateriaGradosFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MateriaGradosPayload>[]
          }
          create: {
            args: Prisma.MateriaGradosCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MateriaGradosPayload>
          }
          createMany: {
            args: Prisma.MateriaGradosCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MateriaGradosCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MateriaGradosPayload>[]
          }
          delete: {
            args: Prisma.MateriaGradosDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MateriaGradosPayload>
          }
          update: {
            args: Prisma.MateriaGradosUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MateriaGradosPayload>
          }
          deleteMany: {
            args: Prisma.MateriaGradosDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MateriaGradosUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MateriaGradosUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MateriaGradosPayload>[]
          }
          upsert: {
            args: Prisma.MateriaGradosUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MateriaGradosPayload>
          }
          aggregate: {
            args: Prisma.MateriaGradosAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMateriaGrados>
          }
          groupBy: {
            args: Prisma.MateriaGradosGroupByArgs<ExtArgs>
            result: $Utils.Optional<MateriaGradosGroupByOutputType>[]
          }
          count: {
            args: Prisma.MateriaGradosCountArgs<ExtArgs>
            result: $Utils.Optional<MateriaGradosCountAggregateOutputType> | number
          }
        }
      }
      Docentes: {
        payload: Prisma.$DocentesPayload<ExtArgs>
        fields: Prisma.DocentesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DocentesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocentesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DocentesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocentesPayload>
          }
          findFirst: {
            args: Prisma.DocentesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocentesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DocentesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocentesPayload>
          }
          findMany: {
            args: Prisma.DocentesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocentesPayload>[]
          }
          create: {
            args: Prisma.DocentesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocentesPayload>
          }
          createMany: {
            args: Prisma.DocentesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DocentesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocentesPayload>[]
          }
          delete: {
            args: Prisma.DocentesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocentesPayload>
          }
          update: {
            args: Prisma.DocentesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocentesPayload>
          }
          deleteMany: {
            args: Prisma.DocentesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DocentesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DocentesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocentesPayload>[]
          }
          upsert: {
            args: Prisma.DocentesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocentesPayload>
          }
          aggregate: {
            args: Prisma.DocentesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDocentes>
          }
          groupBy: {
            args: Prisma.DocentesGroupByArgs<ExtArgs>
            result: $Utils.Optional<DocentesGroupByOutputType>[]
          }
          count: {
            args: Prisma.DocentesCountArgs<ExtArgs>
            result: $Utils.Optional<DocentesCountAggregateOutputType> | number
          }
        }
      }
      DocenteAsignaciones: {
        payload: Prisma.$DocenteAsignacionesPayload<ExtArgs>
        fields: Prisma.DocenteAsignacionesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DocenteAsignacionesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocenteAsignacionesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DocenteAsignacionesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocenteAsignacionesPayload>
          }
          findFirst: {
            args: Prisma.DocenteAsignacionesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocenteAsignacionesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DocenteAsignacionesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocenteAsignacionesPayload>
          }
          findMany: {
            args: Prisma.DocenteAsignacionesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocenteAsignacionesPayload>[]
          }
          create: {
            args: Prisma.DocenteAsignacionesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocenteAsignacionesPayload>
          }
          createMany: {
            args: Prisma.DocenteAsignacionesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DocenteAsignacionesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocenteAsignacionesPayload>[]
          }
          delete: {
            args: Prisma.DocenteAsignacionesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocenteAsignacionesPayload>
          }
          update: {
            args: Prisma.DocenteAsignacionesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocenteAsignacionesPayload>
          }
          deleteMany: {
            args: Prisma.DocenteAsignacionesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DocenteAsignacionesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DocenteAsignacionesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocenteAsignacionesPayload>[]
          }
          upsert: {
            args: Prisma.DocenteAsignacionesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocenteAsignacionesPayload>
          }
          aggregate: {
            args: Prisma.DocenteAsignacionesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDocenteAsignaciones>
          }
          groupBy: {
            args: Prisma.DocenteAsignacionesGroupByArgs<ExtArgs>
            result: $Utils.Optional<DocenteAsignacionesGroupByOutputType>[]
          }
          count: {
            args: Prisma.DocenteAsignacionesCountArgs<ExtArgs>
            result: $Utils.Optional<DocenteAsignacionesCountAggregateOutputType> | number
          }
        }
      }
      Estudiantes: {
        payload: Prisma.$EstudiantesPayload<ExtArgs>
        fields: Prisma.EstudiantesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EstudiantesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstudiantesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EstudiantesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstudiantesPayload>
          }
          findFirst: {
            args: Prisma.EstudiantesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstudiantesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EstudiantesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstudiantesPayload>
          }
          findMany: {
            args: Prisma.EstudiantesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstudiantesPayload>[]
          }
          create: {
            args: Prisma.EstudiantesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstudiantesPayload>
          }
          createMany: {
            args: Prisma.EstudiantesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EstudiantesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstudiantesPayload>[]
          }
          delete: {
            args: Prisma.EstudiantesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstudiantesPayload>
          }
          update: {
            args: Prisma.EstudiantesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstudiantesPayload>
          }
          deleteMany: {
            args: Prisma.EstudiantesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EstudiantesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EstudiantesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstudiantesPayload>[]
          }
          upsert: {
            args: Prisma.EstudiantesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstudiantesPayload>
          }
          aggregate: {
            args: Prisma.EstudiantesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEstudiantes>
          }
          groupBy: {
            args: Prisma.EstudiantesGroupByArgs<ExtArgs>
            result: $Utils.Optional<EstudiantesGroupByOutputType>[]
          }
          count: {
            args: Prisma.EstudiantesCountArgs<ExtArgs>
            result: $Utils.Optional<EstudiantesCountAggregateOutputType> | number
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
    grados?: GradosOmit
    cursos?: CursosOmit
    areas?: AreasOmit
    materias?: MateriasOmit
    materiaGrados?: MateriaGradosOmit
    docentes?: DocentesOmit
    docenteAsignaciones?: DocenteAsignacionesOmit
    estudiantes?: EstudiantesOmit
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
    grados: number
    cursos: number
    areas: number
    materias: number
    docentes: number
    estudiantes: number
  }

  export type InstitucionesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    administradores?: boolean | InstitucionesCountOutputTypeCountAdministradoresArgs
    sedes?: boolean | InstitucionesCountOutputTypeCountSedesArgs
    grados?: boolean | InstitucionesCountOutputTypeCountGradosArgs
    cursos?: boolean | InstitucionesCountOutputTypeCountCursosArgs
    areas?: boolean | InstitucionesCountOutputTypeCountAreasArgs
    materias?: boolean | InstitucionesCountOutputTypeCountMateriasArgs
    docentes?: boolean | InstitucionesCountOutputTypeCountDocentesArgs
    estudiantes?: boolean | InstitucionesCountOutputTypeCountEstudiantesArgs
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
   * InstitucionesCountOutputType without action
   */
  export type InstitucionesCountOutputTypeCountGradosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GradosWhereInput
  }

  /**
   * InstitucionesCountOutputType without action
   */
  export type InstitucionesCountOutputTypeCountCursosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CursosWhereInput
  }

  /**
   * InstitucionesCountOutputType without action
   */
  export type InstitucionesCountOutputTypeCountAreasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AreasWhereInput
  }

  /**
   * InstitucionesCountOutputType without action
   */
  export type InstitucionesCountOutputTypeCountMateriasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MateriasWhereInput
  }

  /**
   * InstitucionesCountOutputType without action
   */
  export type InstitucionesCountOutputTypeCountDocentesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocentesWhereInput
  }

  /**
   * InstitucionesCountOutputType without action
   */
  export type InstitucionesCountOutputTypeCountEstudiantesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EstudiantesWhereInput
  }


  /**
   * Count Type SedesCountOutputType
   */

  export type SedesCountOutputType = {
    administradores: number
    cursos: number
    docentes: number
  }

  export type SedesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    administradores?: boolean | SedesCountOutputTypeCountAdministradoresArgs
    cursos?: boolean | SedesCountOutputTypeCountCursosArgs
    docentes?: boolean | SedesCountOutputTypeCountDocentesArgs
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
   * SedesCountOutputType without action
   */
  export type SedesCountOutputTypeCountCursosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CursosWhereInput
  }

  /**
   * SedesCountOutputType without action
   */
  export type SedesCountOutputTypeCountDocentesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocentesWhereInput
  }


  /**
   * Count Type GradosCountOutputType
   */

  export type GradosCountOutputType = {
    cursos: number
    materiaGrados: number
  }

  export type GradosCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cursos?: boolean | GradosCountOutputTypeCountCursosArgs
    materiaGrados?: boolean | GradosCountOutputTypeCountMateriaGradosArgs
  }

  // Custom InputTypes
  /**
   * GradosCountOutputType without action
   */
  export type GradosCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GradosCountOutputType
     */
    select?: GradosCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GradosCountOutputType without action
   */
  export type GradosCountOutputTypeCountCursosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CursosWhereInput
  }

  /**
   * GradosCountOutputType without action
   */
  export type GradosCountOutputTypeCountMateriaGradosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MateriaGradosWhereInput
  }


  /**
   * Count Type CursosCountOutputType
   */

  export type CursosCountOutputType = {
    estudiantes: number
    docenteAsignaciones: number
  }

  export type CursosCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    estudiantes?: boolean | CursosCountOutputTypeCountEstudiantesArgs
    docenteAsignaciones?: boolean | CursosCountOutputTypeCountDocenteAsignacionesArgs
  }

  // Custom InputTypes
  /**
   * CursosCountOutputType without action
   */
  export type CursosCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CursosCountOutputType
     */
    select?: CursosCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CursosCountOutputType without action
   */
  export type CursosCountOutputTypeCountEstudiantesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EstudiantesWhereInput
  }

  /**
   * CursosCountOutputType without action
   */
  export type CursosCountOutputTypeCountDocenteAsignacionesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocenteAsignacionesWhereInput
  }


  /**
   * Count Type AreasCountOutputType
   */

  export type AreasCountOutputType = {
    materias: number
  }

  export type AreasCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    materias?: boolean | AreasCountOutputTypeCountMateriasArgs
  }

  // Custom InputTypes
  /**
   * AreasCountOutputType without action
   */
  export type AreasCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AreasCountOutputType
     */
    select?: AreasCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AreasCountOutputType without action
   */
  export type AreasCountOutputTypeCountMateriasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MateriasWhereInput
  }


  /**
   * Count Type MateriasCountOutputType
   */

  export type MateriasCountOutputType = {
    materiaGrados: number
    docenteAsignaciones: number
  }

  export type MateriasCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    materiaGrados?: boolean | MateriasCountOutputTypeCountMateriaGradosArgs
    docenteAsignaciones?: boolean | MateriasCountOutputTypeCountDocenteAsignacionesArgs
  }

  // Custom InputTypes
  /**
   * MateriasCountOutputType without action
   */
  export type MateriasCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MateriasCountOutputType
     */
    select?: MateriasCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MateriasCountOutputType without action
   */
  export type MateriasCountOutputTypeCountMateriaGradosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MateriaGradosWhereInput
  }

  /**
   * MateriasCountOutputType without action
   */
  export type MateriasCountOutputTypeCountDocenteAsignacionesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocenteAsignacionesWhereInput
  }


  /**
   * Count Type DocentesCountOutputType
   */

  export type DocentesCountOutputType = {
    docenteAsignaciones: number
  }

  export type DocentesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    docenteAsignaciones?: boolean | DocentesCountOutputTypeCountDocenteAsignacionesArgs
  }

  // Custom InputTypes
  /**
   * DocentesCountOutputType without action
   */
  export type DocentesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocentesCountOutputType
     */
    select?: DocentesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DocentesCountOutputType without action
   */
  export type DocentesCountOutputTypeCountDocenteAsignacionesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocenteAsignacionesWhereInput
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
    grados?: boolean | Instituciones$gradosArgs<ExtArgs>
    cursos?: boolean | Instituciones$cursosArgs<ExtArgs>
    areas?: boolean | Instituciones$areasArgs<ExtArgs>
    materias?: boolean | Instituciones$materiasArgs<ExtArgs>
    docentes?: boolean | Instituciones$docentesArgs<ExtArgs>
    estudiantes?: boolean | Instituciones$estudiantesArgs<ExtArgs>
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
    grados?: boolean | Instituciones$gradosArgs<ExtArgs>
    cursos?: boolean | Instituciones$cursosArgs<ExtArgs>
    areas?: boolean | Instituciones$areasArgs<ExtArgs>
    materias?: boolean | Instituciones$materiasArgs<ExtArgs>
    docentes?: boolean | Instituciones$docentesArgs<ExtArgs>
    estudiantes?: boolean | Instituciones$estudiantesArgs<ExtArgs>
    _count?: boolean | InstitucionesCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type InstitucionesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type InstitucionesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $InstitucionesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Instituciones"
    objects: {
      administradores: Prisma.$AdministradoresPayload<ExtArgs>[]
      sedes: Prisma.$SedesPayload<ExtArgs>[]
      grados: Prisma.$GradosPayload<ExtArgs>[]
      cursos: Prisma.$CursosPayload<ExtArgs>[]
      areas: Prisma.$AreasPayload<ExtArgs>[]
      materias: Prisma.$MateriasPayload<ExtArgs>[]
      docentes: Prisma.$DocentesPayload<ExtArgs>[]
      estudiantes: Prisma.$EstudiantesPayload<ExtArgs>[]
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
    grados<T extends Instituciones$gradosArgs<ExtArgs> = {}>(args?: Subset<T, Instituciones$gradosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GradosPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    cursos<T extends Instituciones$cursosArgs<ExtArgs> = {}>(args?: Subset<T, Instituciones$cursosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CursosPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    areas<T extends Instituciones$areasArgs<ExtArgs> = {}>(args?: Subset<T, Instituciones$areasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AreasPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    materias<T extends Instituciones$materiasArgs<ExtArgs> = {}>(args?: Subset<T, Instituciones$materiasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MateriasPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    docentes<T extends Instituciones$docentesArgs<ExtArgs> = {}>(args?: Subset<T, Instituciones$docentesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocentesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    estudiantes<T extends Instituciones$estudiantesArgs<ExtArgs> = {}>(args?: Subset<T, Instituciones$estudiantesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EstudiantesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Instituciones.grados
   */
  export type Instituciones$gradosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grados
     */
    select?: GradosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Grados
     */
    omit?: GradosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradosInclude<ExtArgs> | null
    where?: GradosWhereInput
    orderBy?: GradosOrderByWithRelationInput | GradosOrderByWithRelationInput[]
    cursor?: GradosWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GradosScalarFieldEnum | GradosScalarFieldEnum[]
  }

  /**
   * Instituciones.cursos
   */
  export type Instituciones$cursosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cursos
     */
    select?: CursosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cursos
     */
    omit?: CursosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CursosInclude<ExtArgs> | null
    where?: CursosWhereInput
    orderBy?: CursosOrderByWithRelationInput | CursosOrderByWithRelationInput[]
    cursor?: CursosWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CursosScalarFieldEnum | CursosScalarFieldEnum[]
  }

  /**
   * Instituciones.areas
   */
  export type Instituciones$areasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Areas
     */
    select?: AreasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Areas
     */
    omit?: AreasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AreasInclude<ExtArgs> | null
    where?: AreasWhereInput
    orderBy?: AreasOrderByWithRelationInput | AreasOrderByWithRelationInput[]
    cursor?: AreasWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AreasScalarFieldEnum | AreasScalarFieldEnum[]
  }

  /**
   * Instituciones.materias
   */
  export type Instituciones$materiasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Materias
     */
    select?: MateriasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Materias
     */
    omit?: MateriasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriasInclude<ExtArgs> | null
    where?: MateriasWhereInput
    orderBy?: MateriasOrderByWithRelationInput | MateriasOrderByWithRelationInput[]
    cursor?: MateriasWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MateriasScalarFieldEnum | MateriasScalarFieldEnum[]
  }

  /**
   * Instituciones.docentes
   */
  export type Instituciones$docentesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Docentes
     */
    select?: DocentesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Docentes
     */
    omit?: DocentesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocentesInclude<ExtArgs> | null
    where?: DocentesWhereInput
    orderBy?: DocentesOrderByWithRelationInput | DocentesOrderByWithRelationInput[]
    cursor?: DocentesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DocentesScalarFieldEnum | DocentesScalarFieldEnum[]
  }

  /**
   * Instituciones.estudiantes
   */
  export type Instituciones$estudiantesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estudiantes
     */
    select?: EstudiantesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Estudiantes
     */
    omit?: EstudiantesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstudiantesInclude<ExtArgs> | null
    where?: EstudiantesWhereInput
    orderBy?: EstudiantesOrderByWithRelationInput | EstudiantesOrderByWithRelationInput[]
    cursor?: EstudiantesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EstudiantesScalarFieldEnum | EstudiantesScalarFieldEnum[]
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
    cursos?: boolean | Sedes$cursosArgs<ExtArgs>
    docentes?: boolean | Sedes$docentesArgs<ExtArgs>
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
    cursos?: boolean | Sedes$cursosArgs<ExtArgs>
    docentes?: boolean | Sedes$docentesArgs<ExtArgs>
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
      cursos: Prisma.$CursosPayload<ExtArgs>[]
      docentes: Prisma.$DocentesPayload<ExtArgs>[]
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
    cursos<T extends Sedes$cursosArgs<ExtArgs> = {}>(args?: Subset<T, Sedes$cursosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CursosPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    docentes<T extends Sedes$docentesArgs<ExtArgs> = {}>(args?: Subset<T, Sedes$docentesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocentesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Sedes.cursos
   */
  export type Sedes$cursosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cursos
     */
    select?: CursosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cursos
     */
    omit?: CursosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CursosInclude<ExtArgs> | null
    where?: CursosWhereInput
    orderBy?: CursosOrderByWithRelationInput | CursosOrderByWithRelationInput[]
    cursor?: CursosWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CursosScalarFieldEnum | CursosScalarFieldEnum[]
  }

  /**
   * Sedes.docentes
   */
  export type Sedes$docentesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Docentes
     */
    select?: DocentesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Docentes
     */
    omit?: DocentesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocentesInclude<ExtArgs> | null
    where?: DocentesWhereInput
    orderBy?: DocentesOrderByWithRelationInput | DocentesOrderByWithRelationInput[]
    cursor?: DocentesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DocentesScalarFieldEnum | DocentesScalarFieldEnum[]
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
   * Model Grados
   */

  export type AggregateGrados = {
    _count: GradosCountAggregateOutputType | null
    _avg: GradosAvgAggregateOutputType | null
    _sum: GradosSumAggregateOutputType | null
    _min: GradosMinAggregateOutputType | null
    _max: GradosMaxAggregateOutputType | null
  }

  export type GradosAvgAggregateOutputType = {
    id: number | null
    orden: number | null
    institucion_id: number | null
  }

  export type GradosSumAggregateOutputType = {
    id: number | null
    orden: number | null
    institucion_id: number | null
  }

  export type GradosMinAggregateOutputType = {
    id: number | null
    nombre: string | null
    nivel: string | null
    orden: number | null
    institucion_id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type GradosMaxAggregateOutputType = {
    id: number | null
    nombre: string | null
    nivel: string | null
    orden: number | null
    institucion_id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type GradosCountAggregateOutputType = {
    id: number
    nombre: number
    nivel: number
    orden: number
    institucion_id: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type GradosAvgAggregateInputType = {
    id?: true
    orden?: true
    institucion_id?: true
  }

  export type GradosSumAggregateInputType = {
    id?: true
    orden?: true
    institucion_id?: true
  }

  export type GradosMinAggregateInputType = {
    id?: true
    nombre?: true
    nivel?: true
    orden?: true
    institucion_id?: true
    created_at?: true
    updated_at?: true
  }

  export type GradosMaxAggregateInputType = {
    id?: true
    nombre?: true
    nivel?: true
    orden?: true
    institucion_id?: true
    created_at?: true
    updated_at?: true
  }

  export type GradosCountAggregateInputType = {
    id?: true
    nombre?: true
    nivel?: true
    orden?: true
    institucion_id?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type GradosAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Grados to aggregate.
     */
    where?: GradosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Grados to fetch.
     */
    orderBy?: GradosOrderByWithRelationInput | GradosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GradosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Grados from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Grados.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Grados
    **/
    _count?: true | GradosCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GradosAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GradosSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GradosMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GradosMaxAggregateInputType
  }

  export type GetGradosAggregateType<T extends GradosAggregateArgs> = {
        [P in keyof T & keyof AggregateGrados]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGrados[P]>
      : GetScalarType<T[P], AggregateGrados[P]>
  }




  export type GradosGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GradosWhereInput
    orderBy?: GradosOrderByWithAggregationInput | GradosOrderByWithAggregationInput[]
    by: GradosScalarFieldEnum[] | GradosScalarFieldEnum
    having?: GradosScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GradosCountAggregateInputType | true
    _avg?: GradosAvgAggregateInputType
    _sum?: GradosSumAggregateInputType
    _min?: GradosMinAggregateInputType
    _max?: GradosMaxAggregateInputType
  }

  export type GradosGroupByOutputType = {
    id: number
    nombre: string
    nivel: string
    orden: number
    institucion_id: number
    created_at: Date
    updated_at: Date
    _count: GradosCountAggregateOutputType | null
    _avg: GradosAvgAggregateOutputType | null
    _sum: GradosSumAggregateOutputType | null
    _min: GradosMinAggregateOutputType | null
    _max: GradosMaxAggregateOutputType | null
  }

  type GetGradosGroupByPayload<T extends GradosGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GradosGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GradosGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GradosGroupByOutputType[P]>
            : GetScalarType<T[P], GradosGroupByOutputType[P]>
        }
      >
    >


  export type GradosSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    nivel?: boolean
    orden?: boolean
    institucion_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    cursos?: boolean | Grados$cursosArgs<ExtArgs>
    materiaGrados?: boolean | Grados$materiaGradosArgs<ExtArgs>
    _count?: boolean | GradosCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["grados"]>

  export type GradosSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    nivel?: boolean
    orden?: boolean
    institucion_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["grados"]>

  export type GradosSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    nivel?: boolean
    orden?: boolean
    institucion_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["grados"]>

  export type GradosSelectScalar = {
    id?: boolean
    nombre?: boolean
    nivel?: boolean
    orden?: boolean
    institucion_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type GradosOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "nivel" | "orden" | "institucion_id" | "created_at" | "updated_at", ExtArgs["result"]["grados"]>
  export type GradosInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    cursos?: boolean | Grados$cursosArgs<ExtArgs>
    materiaGrados?: boolean | Grados$materiaGradosArgs<ExtArgs>
    _count?: boolean | GradosCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GradosIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
  }
  export type GradosIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
  }

  export type $GradosPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Grados"
    objects: {
      institucion: Prisma.$InstitucionesPayload<ExtArgs>
      cursos: Prisma.$CursosPayload<ExtArgs>[]
      materiaGrados: Prisma.$MateriaGradosPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nombre: string
      nivel: string
      orden: number
      institucion_id: number
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["grados"]>
    composites: {}
  }

  type GradosGetPayload<S extends boolean | null | undefined | GradosDefaultArgs> = $Result.GetResult<Prisma.$GradosPayload, S>

  type GradosCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GradosFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GradosCountAggregateInputType | true
    }

  export interface GradosDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Grados'], meta: { name: 'Grados' } }
    /**
     * Find zero or one Grados that matches the filter.
     * @param {GradosFindUniqueArgs} args - Arguments to find a Grados
     * @example
     * // Get one Grados
     * const grados = await prisma.grados.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GradosFindUniqueArgs>(args: SelectSubset<T, GradosFindUniqueArgs<ExtArgs>>): Prisma__GradosClient<$Result.GetResult<Prisma.$GradosPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Grados that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GradosFindUniqueOrThrowArgs} args - Arguments to find a Grados
     * @example
     * // Get one Grados
     * const grados = await prisma.grados.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GradosFindUniqueOrThrowArgs>(args: SelectSubset<T, GradosFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GradosClient<$Result.GetResult<Prisma.$GradosPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Grados that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GradosFindFirstArgs} args - Arguments to find a Grados
     * @example
     * // Get one Grados
     * const grados = await prisma.grados.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GradosFindFirstArgs>(args?: SelectSubset<T, GradosFindFirstArgs<ExtArgs>>): Prisma__GradosClient<$Result.GetResult<Prisma.$GradosPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Grados that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GradosFindFirstOrThrowArgs} args - Arguments to find a Grados
     * @example
     * // Get one Grados
     * const grados = await prisma.grados.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GradosFindFirstOrThrowArgs>(args?: SelectSubset<T, GradosFindFirstOrThrowArgs<ExtArgs>>): Prisma__GradosClient<$Result.GetResult<Prisma.$GradosPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Grados that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GradosFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Grados
     * const grados = await prisma.grados.findMany()
     * 
     * // Get first 10 Grados
     * const grados = await prisma.grados.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gradosWithIdOnly = await prisma.grados.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GradosFindManyArgs>(args?: SelectSubset<T, GradosFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GradosPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Grados.
     * @param {GradosCreateArgs} args - Arguments to create a Grados.
     * @example
     * // Create one Grados
     * const Grados = await prisma.grados.create({
     *   data: {
     *     // ... data to create a Grados
     *   }
     * })
     * 
     */
    create<T extends GradosCreateArgs>(args: SelectSubset<T, GradosCreateArgs<ExtArgs>>): Prisma__GradosClient<$Result.GetResult<Prisma.$GradosPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Grados.
     * @param {GradosCreateManyArgs} args - Arguments to create many Grados.
     * @example
     * // Create many Grados
     * const grados = await prisma.grados.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GradosCreateManyArgs>(args?: SelectSubset<T, GradosCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Grados and returns the data saved in the database.
     * @param {GradosCreateManyAndReturnArgs} args - Arguments to create many Grados.
     * @example
     * // Create many Grados
     * const grados = await prisma.grados.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Grados and only return the `id`
     * const gradosWithIdOnly = await prisma.grados.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GradosCreateManyAndReturnArgs>(args?: SelectSubset<T, GradosCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GradosPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Grados.
     * @param {GradosDeleteArgs} args - Arguments to delete one Grados.
     * @example
     * // Delete one Grados
     * const Grados = await prisma.grados.delete({
     *   where: {
     *     // ... filter to delete one Grados
     *   }
     * })
     * 
     */
    delete<T extends GradosDeleteArgs>(args: SelectSubset<T, GradosDeleteArgs<ExtArgs>>): Prisma__GradosClient<$Result.GetResult<Prisma.$GradosPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Grados.
     * @param {GradosUpdateArgs} args - Arguments to update one Grados.
     * @example
     * // Update one Grados
     * const grados = await prisma.grados.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GradosUpdateArgs>(args: SelectSubset<T, GradosUpdateArgs<ExtArgs>>): Prisma__GradosClient<$Result.GetResult<Prisma.$GradosPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Grados.
     * @param {GradosDeleteManyArgs} args - Arguments to filter Grados to delete.
     * @example
     * // Delete a few Grados
     * const { count } = await prisma.grados.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GradosDeleteManyArgs>(args?: SelectSubset<T, GradosDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Grados.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GradosUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Grados
     * const grados = await prisma.grados.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GradosUpdateManyArgs>(args: SelectSubset<T, GradosUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Grados and returns the data updated in the database.
     * @param {GradosUpdateManyAndReturnArgs} args - Arguments to update many Grados.
     * @example
     * // Update many Grados
     * const grados = await prisma.grados.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Grados and only return the `id`
     * const gradosWithIdOnly = await prisma.grados.updateManyAndReturn({
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
    updateManyAndReturn<T extends GradosUpdateManyAndReturnArgs>(args: SelectSubset<T, GradosUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GradosPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Grados.
     * @param {GradosUpsertArgs} args - Arguments to update or create a Grados.
     * @example
     * // Update or create a Grados
     * const grados = await prisma.grados.upsert({
     *   create: {
     *     // ... data to create a Grados
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Grados we want to update
     *   }
     * })
     */
    upsert<T extends GradosUpsertArgs>(args: SelectSubset<T, GradosUpsertArgs<ExtArgs>>): Prisma__GradosClient<$Result.GetResult<Prisma.$GradosPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Grados.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GradosCountArgs} args - Arguments to filter Grados to count.
     * @example
     * // Count the number of Grados
     * const count = await prisma.grados.count({
     *   where: {
     *     // ... the filter for the Grados we want to count
     *   }
     * })
    **/
    count<T extends GradosCountArgs>(
      args?: Subset<T, GradosCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GradosCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Grados.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GradosAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GradosAggregateArgs>(args: Subset<T, GradosAggregateArgs>): Prisma.PrismaPromise<GetGradosAggregateType<T>>

    /**
     * Group by Grados.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GradosGroupByArgs} args - Group by arguments.
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
      T extends GradosGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GradosGroupByArgs['orderBy'] }
        : { orderBy?: GradosGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, GradosGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGradosGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Grados model
   */
  readonly fields: GradosFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Grados.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GradosClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    institucion<T extends InstitucionesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InstitucionesDefaultArgs<ExtArgs>>): Prisma__InstitucionesClient<$Result.GetResult<Prisma.$InstitucionesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    cursos<T extends Grados$cursosArgs<ExtArgs> = {}>(args?: Subset<T, Grados$cursosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CursosPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    materiaGrados<T extends Grados$materiaGradosArgs<ExtArgs> = {}>(args?: Subset<T, Grados$materiaGradosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MateriaGradosPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Grados model
   */
  interface GradosFieldRefs {
    readonly id: FieldRef<"Grados", 'Int'>
    readonly nombre: FieldRef<"Grados", 'String'>
    readonly nivel: FieldRef<"Grados", 'String'>
    readonly orden: FieldRef<"Grados", 'Int'>
    readonly institucion_id: FieldRef<"Grados", 'Int'>
    readonly created_at: FieldRef<"Grados", 'DateTime'>
    readonly updated_at: FieldRef<"Grados", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Grados findUnique
   */
  export type GradosFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grados
     */
    select?: GradosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Grados
     */
    omit?: GradosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradosInclude<ExtArgs> | null
    /**
     * Filter, which Grados to fetch.
     */
    where: GradosWhereUniqueInput
  }

  /**
   * Grados findUniqueOrThrow
   */
  export type GradosFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grados
     */
    select?: GradosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Grados
     */
    omit?: GradosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradosInclude<ExtArgs> | null
    /**
     * Filter, which Grados to fetch.
     */
    where: GradosWhereUniqueInput
  }

  /**
   * Grados findFirst
   */
  export type GradosFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grados
     */
    select?: GradosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Grados
     */
    omit?: GradosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradosInclude<ExtArgs> | null
    /**
     * Filter, which Grados to fetch.
     */
    where?: GradosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Grados to fetch.
     */
    orderBy?: GradosOrderByWithRelationInput | GradosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Grados.
     */
    cursor?: GradosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Grados from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Grados.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Grados.
     */
    distinct?: GradosScalarFieldEnum | GradosScalarFieldEnum[]
  }

  /**
   * Grados findFirstOrThrow
   */
  export type GradosFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grados
     */
    select?: GradosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Grados
     */
    omit?: GradosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradosInclude<ExtArgs> | null
    /**
     * Filter, which Grados to fetch.
     */
    where?: GradosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Grados to fetch.
     */
    orderBy?: GradosOrderByWithRelationInput | GradosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Grados.
     */
    cursor?: GradosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Grados from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Grados.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Grados.
     */
    distinct?: GradosScalarFieldEnum | GradosScalarFieldEnum[]
  }

  /**
   * Grados findMany
   */
  export type GradosFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grados
     */
    select?: GradosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Grados
     */
    omit?: GradosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradosInclude<ExtArgs> | null
    /**
     * Filter, which Grados to fetch.
     */
    where?: GradosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Grados to fetch.
     */
    orderBy?: GradosOrderByWithRelationInput | GradosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Grados.
     */
    cursor?: GradosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Grados from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Grados.
     */
    skip?: number
    distinct?: GradosScalarFieldEnum | GradosScalarFieldEnum[]
  }

  /**
   * Grados create
   */
  export type GradosCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grados
     */
    select?: GradosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Grados
     */
    omit?: GradosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradosInclude<ExtArgs> | null
    /**
     * The data needed to create a Grados.
     */
    data: XOR<GradosCreateInput, GradosUncheckedCreateInput>
  }

  /**
   * Grados createMany
   */
  export type GradosCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Grados.
     */
    data: GradosCreateManyInput | GradosCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Grados createManyAndReturn
   */
  export type GradosCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grados
     */
    select?: GradosSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Grados
     */
    omit?: GradosOmit<ExtArgs> | null
    /**
     * The data used to create many Grados.
     */
    data: GradosCreateManyInput | GradosCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradosIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Grados update
   */
  export type GradosUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grados
     */
    select?: GradosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Grados
     */
    omit?: GradosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradosInclude<ExtArgs> | null
    /**
     * The data needed to update a Grados.
     */
    data: XOR<GradosUpdateInput, GradosUncheckedUpdateInput>
    /**
     * Choose, which Grados to update.
     */
    where: GradosWhereUniqueInput
  }

  /**
   * Grados updateMany
   */
  export type GradosUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Grados.
     */
    data: XOR<GradosUpdateManyMutationInput, GradosUncheckedUpdateManyInput>
    /**
     * Filter which Grados to update
     */
    where?: GradosWhereInput
    /**
     * Limit how many Grados to update.
     */
    limit?: number
  }

  /**
   * Grados updateManyAndReturn
   */
  export type GradosUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grados
     */
    select?: GradosSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Grados
     */
    omit?: GradosOmit<ExtArgs> | null
    /**
     * The data used to update Grados.
     */
    data: XOR<GradosUpdateManyMutationInput, GradosUncheckedUpdateManyInput>
    /**
     * Filter which Grados to update
     */
    where?: GradosWhereInput
    /**
     * Limit how many Grados to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradosIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Grados upsert
   */
  export type GradosUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grados
     */
    select?: GradosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Grados
     */
    omit?: GradosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradosInclude<ExtArgs> | null
    /**
     * The filter to search for the Grados to update in case it exists.
     */
    where: GradosWhereUniqueInput
    /**
     * In case the Grados found by the `where` argument doesn't exist, create a new Grados with this data.
     */
    create: XOR<GradosCreateInput, GradosUncheckedCreateInput>
    /**
     * In case the Grados was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GradosUpdateInput, GradosUncheckedUpdateInput>
  }

  /**
   * Grados delete
   */
  export type GradosDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grados
     */
    select?: GradosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Grados
     */
    omit?: GradosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradosInclude<ExtArgs> | null
    /**
     * Filter which Grados to delete.
     */
    where: GradosWhereUniqueInput
  }

  /**
   * Grados deleteMany
   */
  export type GradosDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Grados to delete
     */
    where?: GradosWhereInput
    /**
     * Limit how many Grados to delete.
     */
    limit?: number
  }

  /**
   * Grados.cursos
   */
  export type Grados$cursosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cursos
     */
    select?: CursosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cursos
     */
    omit?: CursosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CursosInclude<ExtArgs> | null
    where?: CursosWhereInput
    orderBy?: CursosOrderByWithRelationInput | CursosOrderByWithRelationInput[]
    cursor?: CursosWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CursosScalarFieldEnum | CursosScalarFieldEnum[]
  }

  /**
   * Grados.materiaGrados
   */
  export type Grados$materiaGradosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MateriaGrados
     */
    select?: MateriaGradosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MateriaGrados
     */
    omit?: MateriaGradosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriaGradosInclude<ExtArgs> | null
    where?: MateriaGradosWhereInput
    orderBy?: MateriaGradosOrderByWithRelationInput | MateriaGradosOrderByWithRelationInput[]
    cursor?: MateriaGradosWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MateriaGradosScalarFieldEnum | MateriaGradosScalarFieldEnum[]
  }

  /**
   * Grados without action
   */
  export type GradosDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Grados
     */
    select?: GradosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Grados
     */
    omit?: GradosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradosInclude<ExtArgs> | null
  }


  /**
   * Model Cursos
   */

  export type AggregateCursos = {
    _count: CursosCountAggregateOutputType | null
    _avg: CursosAvgAggregateOutputType | null
    _sum: CursosSumAggregateOutputType | null
    _min: CursosMinAggregateOutputType | null
    _max: CursosMaxAggregateOutputType | null
  }

  export type CursosAvgAggregateOutputType = {
    id: number | null
    grado_id: number | null
    sede_id: number | null
    institucion_id: number | null
  }

  export type CursosSumAggregateOutputType = {
    id: number | null
    grado_id: number | null
    sede_id: number | null
    institucion_id: number | null
  }

  export type CursosMinAggregateOutputType = {
    id: number | null
    nombre: string | null
    grado_id: number | null
    jornada: string | null
    sede_id: number | null
    institucion_id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type CursosMaxAggregateOutputType = {
    id: number | null
    nombre: string | null
    grado_id: number | null
    jornada: string | null
    sede_id: number | null
    institucion_id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type CursosCountAggregateOutputType = {
    id: number
    nombre: number
    grado_id: number
    jornada: number
    sede_id: number
    institucion_id: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type CursosAvgAggregateInputType = {
    id?: true
    grado_id?: true
    sede_id?: true
    institucion_id?: true
  }

  export type CursosSumAggregateInputType = {
    id?: true
    grado_id?: true
    sede_id?: true
    institucion_id?: true
  }

  export type CursosMinAggregateInputType = {
    id?: true
    nombre?: true
    grado_id?: true
    jornada?: true
    sede_id?: true
    institucion_id?: true
    created_at?: true
    updated_at?: true
  }

  export type CursosMaxAggregateInputType = {
    id?: true
    nombre?: true
    grado_id?: true
    jornada?: true
    sede_id?: true
    institucion_id?: true
    created_at?: true
    updated_at?: true
  }

  export type CursosCountAggregateInputType = {
    id?: true
    nombre?: true
    grado_id?: true
    jornada?: true
    sede_id?: true
    institucion_id?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type CursosAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cursos to aggregate.
     */
    where?: CursosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cursos to fetch.
     */
    orderBy?: CursosOrderByWithRelationInput | CursosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CursosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cursos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cursos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Cursos
    **/
    _count?: true | CursosCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CursosAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CursosSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CursosMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CursosMaxAggregateInputType
  }

  export type GetCursosAggregateType<T extends CursosAggregateArgs> = {
        [P in keyof T & keyof AggregateCursos]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCursos[P]>
      : GetScalarType<T[P], AggregateCursos[P]>
  }




  export type CursosGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CursosWhereInput
    orderBy?: CursosOrderByWithAggregationInput | CursosOrderByWithAggregationInput[]
    by: CursosScalarFieldEnum[] | CursosScalarFieldEnum
    having?: CursosScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CursosCountAggregateInputType | true
    _avg?: CursosAvgAggregateInputType
    _sum?: CursosSumAggregateInputType
    _min?: CursosMinAggregateInputType
    _max?: CursosMaxAggregateInputType
  }

  export type CursosGroupByOutputType = {
    id: number
    nombre: string
    grado_id: number
    jornada: string | null
    sede_id: number | null
    institucion_id: number
    created_at: Date
    updated_at: Date
    _count: CursosCountAggregateOutputType | null
    _avg: CursosAvgAggregateOutputType | null
    _sum: CursosSumAggregateOutputType | null
    _min: CursosMinAggregateOutputType | null
    _max: CursosMaxAggregateOutputType | null
  }

  type GetCursosGroupByPayload<T extends CursosGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CursosGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CursosGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CursosGroupByOutputType[P]>
            : GetScalarType<T[P], CursosGroupByOutputType[P]>
        }
      >
    >


  export type CursosSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    grado_id?: boolean
    jornada?: boolean
    sede_id?: boolean
    institucion_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    grado?: boolean | GradosDefaultArgs<ExtArgs>
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    sede?: boolean | Cursos$sedeArgs<ExtArgs>
    estudiantes?: boolean | Cursos$estudiantesArgs<ExtArgs>
    docenteAsignaciones?: boolean | Cursos$docenteAsignacionesArgs<ExtArgs>
    _count?: boolean | CursosCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cursos"]>

  export type CursosSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    grado_id?: boolean
    jornada?: boolean
    sede_id?: boolean
    institucion_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    grado?: boolean | GradosDefaultArgs<ExtArgs>
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    sede?: boolean | Cursos$sedeArgs<ExtArgs>
  }, ExtArgs["result"]["cursos"]>

  export type CursosSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    grado_id?: boolean
    jornada?: boolean
    sede_id?: boolean
    institucion_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    grado?: boolean | GradosDefaultArgs<ExtArgs>
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    sede?: boolean | Cursos$sedeArgs<ExtArgs>
  }, ExtArgs["result"]["cursos"]>

  export type CursosSelectScalar = {
    id?: boolean
    nombre?: boolean
    grado_id?: boolean
    jornada?: boolean
    sede_id?: boolean
    institucion_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type CursosOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "grado_id" | "jornada" | "sede_id" | "institucion_id" | "created_at" | "updated_at", ExtArgs["result"]["cursos"]>
  export type CursosInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    grado?: boolean | GradosDefaultArgs<ExtArgs>
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    sede?: boolean | Cursos$sedeArgs<ExtArgs>
    estudiantes?: boolean | Cursos$estudiantesArgs<ExtArgs>
    docenteAsignaciones?: boolean | Cursos$docenteAsignacionesArgs<ExtArgs>
    _count?: boolean | CursosCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CursosIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    grado?: boolean | GradosDefaultArgs<ExtArgs>
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    sede?: boolean | Cursos$sedeArgs<ExtArgs>
  }
  export type CursosIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    grado?: boolean | GradosDefaultArgs<ExtArgs>
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    sede?: boolean | Cursos$sedeArgs<ExtArgs>
  }

  export type $CursosPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Cursos"
    objects: {
      grado: Prisma.$GradosPayload<ExtArgs>
      institucion: Prisma.$InstitucionesPayload<ExtArgs>
      sede: Prisma.$SedesPayload<ExtArgs> | null
      estudiantes: Prisma.$EstudiantesPayload<ExtArgs>[]
      docenteAsignaciones: Prisma.$DocenteAsignacionesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nombre: string
      grado_id: number
      jornada: string | null
      sede_id: number | null
      institucion_id: number
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["cursos"]>
    composites: {}
  }

  type CursosGetPayload<S extends boolean | null | undefined | CursosDefaultArgs> = $Result.GetResult<Prisma.$CursosPayload, S>

  type CursosCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CursosFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CursosCountAggregateInputType | true
    }

  export interface CursosDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Cursos'], meta: { name: 'Cursos' } }
    /**
     * Find zero or one Cursos that matches the filter.
     * @param {CursosFindUniqueArgs} args - Arguments to find a Cursos
     * @example
     * // Get one Cursos
     * const cursos = await prisma.cursos.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CursosFindUniqueArgs>(args: SelectSubset<T, CursosFindUniqueArgs<ExtArgs>>): Prisma__CursosClient<$Result.GetResult<Prisma.$CursosPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Cursos that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CursosFindUniqueOrThrowArgs} args - Arguments to find a Cursos
     * @example
     * // Get one Cursos
     * const cursos = await prisma.cursos.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CursosFindUniqueOrThrowArgs>(args: SelectSubset<T, CursosFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CursosClient<$Result.GetResult<Prisma.$CursosPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Cursos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CursosFindFirstArgs} args - Arguments to find a Cursos
     * @example
     * // Get one Cursos
     * const cursos = await prisma.cursos.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CursosFindFirstArgs>(args?: SelectSubset<T, CursosFindFirstArgs<ExtArgs>>): Prisma__CursosClient<$Result.GetResult<Prisma.$CursosPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Cursos that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CursosFindFirstOrThrowArgs} args - Arguments to find a Cursos
     * @example
     * // Get one Cursos
     * const cursos = await prisma.cursos.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CursosFindFirstOrThrowArgs>(args?: SelectSubset<T, CursosFindFirstOrThrowArgs<ExtArgs>>): Prisma__CursosClient<$Result.GetResult<Prisma.$CursosPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Cursos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CursosFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Cursos
     * const cursos = await prisma.cursos.findMany()
     * 
     * // Get first 10 Cursos
     * const cursos = await prisma.cursos.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cursosWithIdOnly = await prisma.cursos.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CursosFindManyArgs>(args?: SelectSubset<T, CursosFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CursosPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Cursos.
     * @param {CursosCreateArgs} args - Arguments to create a Cursos.
     * @example
     * // Create one Cursos
     * const Cursos = await prisma.cursos.create({
     *   data: {
     *     // ... data to create a Cursos
     *   }
     * })
     * 
     */
    create<T extends CursosCreateArgs>(args: SelectSubset<T, CursosCreateArgs<ExtArgs>>): Prisma__CursosClient<$Result.GetResult<Prisma.$CursosPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Cursos.
     * @param {CursosCreateManyArgs} args - Arguments to create many Cursos.
     * @example
     * // Create many Cursos
     * const cursos = await prisma.cursos.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CursosCreateManyArgs>(args?: SelectSubset<T, CursosCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Cursos and returns the data saved in the database.
     * @param {CursosCreateManyAndReturnArgs} args - Arguments to create many Cursos.
     * @example
     * // Create many Cursos
     * const cursos = await prisma.cursos.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Cursos and only return the `id`
     * const cursosWithIdOnly = await prisma.cursos.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CursosCreateManyAndReturnArgs>(args?: SelectSubset<T, CursosCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CursosPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Cursos.
     * @param {CursosDeleteArgs} args - Arguments to delete one Cursos.
     * @example
     * // Delete one Cursos
     * const Cursos = await prisma.cursos.delete({
     *   where: {
     *     // ... filter to delete one Cursos
     *   }
     * })
     * 
     */
    delete<T extends CursosDeleteArgs>(args: SelectSubset<T, CursosDeleteArgs<ExtArgs>>): Prisma__CursosClient<$Result.GetResult<Prisma.$CursosPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Cursos.
     * @param {CursosUpdateArgs} args - Arguments to update one Cursos.
     * @example
     * // Update one Cursos
     * const cursos = await prisma.cursos.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CursosUpdateArgs>(args: SelectSubset<T, CursosUpdateArgs<ExtArgs>>): Prisma__CursosClient<$Result.GetResult<Prisma.$CursosPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Cursos.
     * @param {CursosDeleteManyArgs} args - Arguments to filter Cursos to delete.
     * @example
     * // Delete a few Cursos
     * const { count } = await prisma.cursos.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CursosDeleteManyArgs>(args?: SelectSubset<T, CursosDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cursos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CursosUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Cursos
     * const cursos = await prisma.cursos.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CursosUpdateManyArgs>(args: SelectSubset<T, CursosUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cursos and returns the data updated in the database.
     * @param {CursosUpdateManyAndReturnArgs} args - Arguments to update many Cursos.
     * @example
     * // Update many Cursos
     * const cursos = await prisma.cursos.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Cursos and only return the `id`
     * const cursosWithIdOnly = await prisma.cursos.updateManyAndReturn({
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
    updateManyAndReturn<T extends CursosUpdateManyAndReturnArgs>(args: SelectSubset<T, CursosUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CursosPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Cursos.
     * @param {CursosUpsertArgs} args - Arguments to update or create a Cursos.
     * @example
     * // Update or create a Cursos
     * const cursos = await prisma.cursos.upsert({
     *   create: {
     *     // ... data to create a Cursos
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Cursos we want to update
     *   }
     * })
     */
    upsert<T extends CursosUpsertArgs>(args: SelectSubset<T, CursosUpsertArgs<ExtArgs>>): Prisma__CursosClient<$Result.GetResult<Prisma.$CursosPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Cursos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CursosCountArgs} args - Arguments to filter Cursos to count.
     * @example
     * // Count the number of Cursos
     * const count = await prisma.cursos.count({
     *   where: {
     *     // ... the filter for the Cursos we want to count
     *   }
     * })
    **/
    count<T extends CursosCountArgs>(
      args?: Subset<T, CursosCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CursosCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Cursos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CursosAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CursosAggregateArgs>(args: Subset<T, CursosAggregateArgs>): Prisma.PrismaPromise<GetCursosAggregateType<T>>

    /**
     * Group by Cursos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CursosGroupByArgs} args - Group by arguments.
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
      T extends CursosGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CursosGroupByArgs['orderBy'] }
        : { orderBy?: CursosGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CursosGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCursosGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Cursos model
   */
  readonly fields: CursosFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Cursos.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CursosClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    grado<T extends GradosDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GradosDefaultArgs<ExtArgs>>): Prisma__GradosClient<$Result.GetResult<Prisma.$GradosPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    institucion<T extends InstitucionesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InstitucionesDefaultArgs<ExtArgs>>): Prisma__InstitucionesClient<$Result.GetResult<Prisma.$InstitucionesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    sede<T extends Cursos$sedeArgs<ExtArgs> = {}>(args?: Subset<T, Cursos$sedeArgs<ExtArgs>>): Prisma__SedesClient<$Result.GetResult<Prisma.$SedesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    estudiantes<T extends Cursos$estudiantesArgs<ExtArgs> = {}>(args?: Subset<T, Cursos$estudiantesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EstudiantesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    docenteAsignaciones<T extends Cursos$docenteAsignacionesArgs<ExtArgs> = {}>(args?: Subset<T, Cursos$docenteAsignacionesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocenteAsignacionesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Cursos model
   */
  interface CursosFieldRefs {
    readonly id: FieldRef<"Cursos", 'Int'>
    readonly nombre: FieldRef<"Cursos", 'String'>
    readonly grado_id: FieldRef<"Cursos", 'Int'>
    readonly jornada: FieldRef<"Cursos", 'String'>
    readonly sede_id: FieldRef<"Cursos", 'Int'>
    readonly institucion_id: FieldRef<"Cursos", 'Int'>
    readonly created_at: FieldRef<"Cursos", 'DateTime'>
    readonly updated_at: FieldRef<"Cursos", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Cursos findUnique
   */
  export type CursosFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cursos
     */
    select?: CursosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cursos
     */
    omit?: CursosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CursosInclude<ExtArgs> | null
    /**
     * Filter, which Cursos to fetch.
     */
    where: CursosWhereUniqueInput
  }

  /**
   * Cursos findUniqueOrThrow
   */
  export type CursosFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cursos
     */
    select?: CursosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cursos
     */
    omit?: CursosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CursosInclude<ExtArgs> | null
    /**
     * Filter, which Cursos to fetch.
     */
    where: CursosWhereUniqueInput
  }

  /**
   * Cursos findFirst
   */
  export type CursosFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cursos
     */
    select?: CursosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cursos
     */
    omit?: CursosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CursosInclude<ExtArgs> | null
    /**
     * Filter, which Cursos to fetch.
     */
    where?: CursosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cursos to fetch.
     */
    orderBy?: CursosOrderByWithRelationInput | CursosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cursos.
     */
    cursor?: CursosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cursos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cursos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cursos.
     */
    distinct?: CursosScalarFieldEnum | CursosScalarFieldEnum[]
  }

  /**
   * Cursos findFirstOrThrow
   */
  export type CursosFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cursos
     */
    select?: CursosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cursos
     */
    omit?: CursosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CursosInclude<ExtArgs> | null
    /**
     * Filter, which Cursos to fetch.
     */
    where?: CursosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cursos to fetch.
     */
    orderBy?: CursosOrderByWithRelationInput | CursosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cursos.
     */
    cursor?: CursosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cursos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cursos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cursos.
     */
    distinct?: CursosScalarFieldEnum | CursosScalarFieldEnum[]
  }

  /**
   * Cursos findMany
   */
  export type CursosFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cursos
     */
    select?: CursosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cursos
     */
    omit?: CursosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CursosInclude<ExtArgs> | null
    /**
     * Filter, which Cursos to fetch.
     */
    where?: CursosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cursos to fetch.
     */
    orderBy?: CursosOrderByWithRelationInput | CursosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Cursos.
     */
    cursor?: CursosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cursos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cursos.
     */
    skip?: number
    distinct?: CursosScalarFieldEnum | CursosScalarFieldEnum[]
  }

  /**
   * Cursos create
   */
  export type CursosCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cursos
     */
    select?: CursosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cursos
     */
    omit?: CursosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CursosInclude<ExtArgs> | null
    /**
     * The data needed to create a Cursos.
     */
    data: XOR<CursosCreateInput, CursosUncheckedCreateInput>
  }

  /**
   * Cursos createMany
   */
  export type CursosCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Cursos.
     */
    data: CursosCreateManyInput | CursosCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Cursos createManyAndReturn
   */
  export type CursosCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cursos
     */
    select?: CursosSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Cursos
     */
    omit?: CursosOmit<ExtArgs> | null
    /**
     * The data used to create many Cursos.
     */
    data: CursosCreateManyInput | CursosCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CursosIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Cursos update
   */
  export type CursosUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cursos
     */
    select?: CursosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cursos
     */
    omit?: CursosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CursosInclude<ExtArgs> | null
    /**
     * The data needed to update a Cursos.
     */
    data: XOR<CursosUpdateInput, CursosUncheckedUpdateInput>
    /**
     * Choose, which Cursos to update.
     */
    where: CursosWhereUniqueInput
  }

  /**
   * Cursos updateMany
   */
  export type CursosUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Cursos.
     */
    data: XOR<CursosUpdateManyMutationInput, CursosUncheckedUpdateManyInput>
    /**
     * Filter which Cursos to update
     */
    where?: CursosWhereInput
    /**
     * Limit how many Cursos to update.
     */
    limit?: number
  }

  /**
   * Cursos updateManyAndReturn
   */
  export type CursosUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cursos
     */
    select?: CursosSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Cursos
     */
    omit?: CursosOmit<ExtArgs> | null
    /**
     * The data used to update Cursos.
     */
    data: XOR<CursosUpdateManyMutationInput, CursosUncheckedUpdateManyInput>
    /**
     * Filter which Cursos to update
     */
    where?: CursosWhereInput
    /**
     * Limit how many Cursos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CursosIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Cursos upsert
   */
  export type CursosUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cursos
     */
    select?: CursosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cursos
     */
    omit?: CursosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CursosInclude<ExtArgs> | null
    /**
     * The filter to search for the Cursos to update in case it exists.
     */
    where: CursosWhereUniqueInput
    /**
     * In case the Cursos found by the `where` argument doesn't exist, create a new Cursos with this data.
     */
    create: XOR<CursosCreateInput, CursosUncheckedCreateInput>
    /**
     * In case the Cursos was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CursosUpdateInput, CursosUncheckedUpdateInput>
  }

  /**
   * Cursos delete
   */
  export type CursosDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cursos
     */
    select?: CursosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cursos
     */
    omit?: CursosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CursosInclude<ExtArgs> | null
    /**
     * Filter which Cursos to delete.
     */
    where: CursosWhereUniqueInput
  }

  /**
   * Cursos deleteMany
   */
  export type CursosDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cursos to delete
     */
    where?: CursosWhereInput
    /**
     * Limit how many Cursos to delete.
     */
    limit?: number
  }

  /**
   * Cursos.sede
   */
  export type Cursos$sedeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Cursos.estudiantes
   */
  export type Cursos$estudiantesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estudiantes
     */
    select?: EstudiantesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Estudiantes
     */
    omit?: EstudiantesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstudiantesInclude<ExtArgs> | null
    where?: EstudiantesWhereInput
    orderBy?: EstudiantesOrderByWithRelationInput | EstudiantesOrderByWithRelationInput[]
    cursor?: EstudiantesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EstudiantesScalarFieldEnum | EstudiantesScalarFieldEnum[]
  }

  /**
   * Cursos.docenteAsignaciones
   */
  export type Cursos$docenteAsignacionesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocenteAsignaciones
     */
    select?: DocenteAsignacionesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocenteAsignaciones
     */
    omit?: DocenteAsignacionesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocenteAsignacionesInclude<ExtArgs> | null
    where?: DocenteAsignacionesWhereInput
    orderBy?: DocenteAsignacionesOrderByWithRelationInput | DocenteAsignacionesOrderByWithRelationInput[]
    cursor?: DocenteAsignacionesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DocenteAsignacionesScalarFieldEnum | DocenteAsignacionesScalarFieldEnum[]
  }

  /**
   * Cursos without action
   */
  export type CursosDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cursos
     */
    select?: CursosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cursos
     */
    omit?: CursosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CursosInclude<ExtArgs> | null
  }


  /**
   * Model Areas
   */

  export type AggregateAreas = {
    _count: AreasCountAggregateOutputType | null
    _avg: AreasAvgAggregateOutputType | null
    _sum: AreasSumAggregateOutputType | null
    _min: AreasMinAggregateOutputType | null
    _max: AreasMaxAggregateOutputType | null
  }

  export type AreasAvgAggregateOutputType = {
    id: number | null
    orden: number | null
    institucion_id: number | null
  }

  export type AreasSumAggregateOutputType = {
    id: number | null
    orden: number | null
    institucion_id: number | null
  }

  export type AreasMinAggregateOutputType = {
    id: number | null
    nombre: string | null
    es_opcional: boolean | null
    orden: number | null
    institucion_id: number | null
    activa: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type AreasMaxAggregateOutputType = {
    id: number | null
    nombre: string | null
    es_opcional: boolean | null
    orden: number | null
    institucion_id: number | null
    activa: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type AreasCountAggregateOutputType = {
    id: number
    nombre: number
    es_opcional: number
    orden: number
    institucion_id: number
    activa: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type AreasAvgAggregateInputType = {
    id?: true
    orden?: true
    institucion_id?: true
  }

  export type AreasSumAggregateInputType = {
    id?: true
    orden?: true
    institucion_id?: true
  }

  export type AreasMinAggregateInputType = {
    id?: true
    nombre?: true
    es_opcional?: true
    orden?: true
    institucion_id?: true
    activa?: true
    created_at?: true
    updated_at?: true
  }

  export type AreasMaxAggregateInputType = {
    id?: true
    nombre?: true
    es_opcional?: true
    orden?: true
    institucion_id?: true
    activa?: true
    created_at?: true
    updated_at?: true
  }

  export type AreasCountAggregateInputType = {
    id?: true
    nombre?: true
    es_opcional?: true
    orden?: true
    institucion_id?: true
    activa?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type AreasAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Areas to aggregate.
     */
    where?: AreasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Areas to fetch.
     */
    orderBy?: AreasOrderByWithRelationInput | AreasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AreasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Areas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Areas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Areas
    **/
    _count?: true | AreasCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AreasAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AreasSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AreasMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AreasMaxAggregateInputType
  }

  export type GetAreasAggregateType<T extends AreasAggregateArgs> = {
        [P in keyof T & keyof AggregateAreas]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAreas[P]>
      : GetScalarType<T[P], AggregateAreas[P]>
  }




  export type AreasGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AreasWhereInput
    orderBy?: AreasOrderByWithAggregationInput | AreasOrderByWithAggregationInput[]
    by: AreasScalarFieldEnum[] | AreasScalarFieldEnum
    having?: AreasScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AreasCountAggregateInputType | true
    _avg?: AreasAvgAggregateInputType
    _sum?: AreasSumAggregateInputType
    _min?: AreasMinAggregateInputType
    _max?: AreasMaxAggregateInputType
  }

  export type AreasGroupByOutputType = {
    id: number
    nombre: string
    es_opcional: boolean
    orden: number
    institucion_id: number
    activa: boolean
    created_at: Date
    updated_at: Date
    _count: AreasCountAggregateOutputType | null
    _avg: AreasAvgAggregateOutputType | null
    _sum: AreasSumAggregateOutputType | null
    _min: AreasMinAggregateOutputType | null
    _max: AreasMaxAggregateOutputType | null
  }

  type GetAreasGroupByPayload<T extends AreasGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AreasGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AreasGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AreasGroupByOutputType[P]>
            : GetScalarType<T[P], AreasGroupByOutputType[P]>
        }
      >
    >


  export type AreasSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    es_opcional?: boolean
    orden?: boolean
    institucion_id?: boolean
    activa?: boolean
    created_at?: boolean
    updated_at?: boolean
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    materias?: boolean | Areas$materiasArgs<ExtArgs>
    _count?: boolean | AreasCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["areas"]>

  export type AreasSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    es_opcional?: boolean
    orden?: boolean
    institucion_id?: boolean
    activa?: boolean
    created_at?: boolean
    updated_at?: boolean
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["areas"]>

  export type AreasSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    es_opcional?: boolean
    orden?: boolean
    institucion_id?: boolean
    activa?: boolean
    created_at?: boolean
    updated_at?: boolean
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["areas"]>

  export type AreasSelectScalar = {
    id?: boolean
    nombre?: boolean
    es_opcional?: boolean
    orden?: boolean
    institucion_id?: boolean
    activa?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type AreasOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "es_opcional" | "orden" | "institucion_id" | "activa" | "created_at" | "updated_at", ExtArgs["result"]["areas"]>
  export type AreasInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    materias?: boolean | Areas$materiasArgs<ExtArgs>
    _count?: boolean | AreasCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AreasIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
  }
  export type AreasIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
  }

  export type $AreasPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Areas"
    objects: {
      institucion: Prisma.$InstitucionesPayload<ExtArgs>
      materias: Prisma.$MateriasPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nombre: string
      es_opcional: boolean
      orden: number
      institucion_id: number
      activa: boolean
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["areas"]>
    composites: {}
  }

  type AreasGetPayload<S extends boolean | null | undefined | AreasDefaultArgs> = $Result.GetResult<Prisma.$AreasPayload, S>

  type AreasCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AreasFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AreasCountAggregateInputType | true
    }

  export interface AreasDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Areas'], meta: { name: 'Areas' } }
    /**
     * Find zero or one Areas that matches the filter.
     * @param {AreasFindUniqueArgs} args - Arguments to find a Areas
     * @example
     * // Get one Areas
     * const areas = await prisma.areas.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AreasFindUniqueArgs>(args: SelectSubset<T, AreasFindUniqueArgs<ExtArgs>>): Prisma__AreasClient<$Result.GetResult<Prisma.$AreasPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Areas that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AreasFindUniqueOrThrowArgs} args - Arguments to find a Areas
     * @example
     * // Get one Areas
     * const areas = await prisma.areas.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AreasFindUniqueOrThrowArgs>(args: SelectSubset<T, AreasFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AreasClient<$Result.GetResult<Prisma.$AreasPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Areas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AreasFindFirstArgs} args - Arguments to find a Areas
     * @example
     * // Get one Areas
     * const areas = await prisma.areas.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AreasFindFirstArgs>(args?: SelectSubset<T, AreasFindFirstArgs<ExtArgs>>): Prisma__AreasClient<$Result.GetResult<Prisma.$AreasPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Areas that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AreasFindFirstOrThrowArgs} args - Arguments to find a Areas
     * @example
     * // Get one Areas
     * const areas = await prisma.areas.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AreasFindFirstOrThrowArgs>(args?: SelectSubset<T, AreasFindFirstOrThrowArgs<ExtArgs>>): Prisma__AreasClient<$Result.GetResult<Prisma.$AreasPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Areas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AreasFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Areas
     * const areas = await prisma.areas.findMany()
     * 
     * // Get first 10 Areas
     * const areas = await prisma.areas.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const areasWithIdOnly = await prisma.areas.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AreasFindManyArgs>(args?: SelectSubset<T, AreasFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AreasPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Areas.
     * @param {AreasCreateArgs} args - Arguments to create a Areas.
     * @example
     * // Create one Areas
     * const Areas = await prisma.areas.create({
     *   data: {
     *     // ... data to create a Areas
     *   }
     * })
     * 
     */
    create<T extends AreasCreateArgs>(args: SelectSubset<T, AreasCreateArgs<ExtArgs>>): Prisma__AreasClient<$Result.GetResult<Prisma.$AreasPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Areas.
     * @param {AreasCreateManyArgs} args - Arguments to create many Areas.
     * @example
     * // Create many Areas
     * const areas = await prisma.areas.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AreasCreateManyArgs>(args?: SelectSubset<T, AreasCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Areas and returns the data saved in the database.
     * @param {AreasCreateManyAndReturnArgs} args - Arguments to create many Areas.
     * @example
     * // Create many Areas
     * const areas = await prisma.areas.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Areas and only return the `id`
     * const areasWithIdOnly = await prisma.areas.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AreasCreateManyAndReturnArgs>(args?: SelectSubset<T, AreasCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AreasPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Areas.
     * @param {AreasDeleteArgs} args - Arguments to delete one Areas.
     * @example
     * // Delete one Areas
     * const Areas = await prisma.areas.delete({
     *   where: {
     *     // ... filter to delete one Areas
     *   }
     * })
     * 
     */
    delete<T extends AreasDeleteArgs>(args: SelectSubset<T, AreasDeleteArgs<ExtArgs>>): Prisma__AreasClient<$Result.GetResult<Prisma.$AreasPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Areas.
     * @param {AreasUpdateArgs} args - Arguments to update one Areas.
     * @example
     * // Update one Areas
     * const areas = await prisma.areas.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AreasUpdateArgs>(args: SelectSubset<T, AreasUpdateArgs<ExtArgs>>): Prisma__AreasClient<$Result.GetResult<Prisma.$AreasPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Areas.
     * @param {AreasDeleteManyArgs} args - Arguments to filter Areas to delete.
     * @example
     * // Delete a few Areas
     * const { count } = await prisma.areas.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AreasDeleteManyArgs>(args?: SelectSubset<T, AreasDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Areas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AreasUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Areas
     * const areas = await prisma.areas.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AreasUpdateManyArgs>(args: SelectSubset<T, AreasUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Areas and returns the data updated in the database.
     * @param {AreasUpdateManyAndReturnArgs} args - Arguments to update many Areas.
     * @example
     * // Update many Areas
     * const areas = await prisma.areas.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Areas and only return the `id`
     * const areasWithIdOnly = await prisma.areas.updateManyAndReturn({
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
    updateManyAndReturn<T extends AreasUpdateManyAndReturnArgs>(args: SelectSubset<T, AreasUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AreasPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Areas.
     * @param {AreasUpsertArgs} args - Arguments to update or create a Areas.
     * @example
     * // Update or create a Areas
     * const areas = await prisma.areas.upsert({
     *   create: {
     *     // ... data to create a Areas
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Areas we want to update
     *   }
     * })
     */
    upsert<T extends AreasUpsertArgs>(args: SelectSubset<T, AreasUpsertArgs<ExtArgs>>): Prisma__AreasClient<$Result.GetResult<Prisma.$AreasPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Areas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AreasCountArgs} args - Arguments to filter Areas to count.
     * @example
     * // Count the number of Areas
     * const count = await prisma.areas.count({
     *   where: {
     *     // ... the filter for the Areas we want to count
     *   }
     * })
    **/
    count<T extends AreasCountArgs>(
      args?: Subset<T, AreasCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AreasCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Areas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AreasAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AreasAggregateArgs>(args: Subset<T, AreasAggregateArgs>): Prisma.PrismaPromise<GetAreasAggregateType<T>>

    /**
     * Group by Areas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AreasGroupByArgs} args - Group by arguments.
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
      T extends AreasGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AreasGroupByArgs['orderBy'] }
        : { orderBy?: AreasGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AreasGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAreasGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Areas model
   */
  readonly fields: AreasFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Areas.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AreasClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    institucion<T extends InstitucionesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InstitucionesDefaultArgs<ExtArgs>>): Prisma__InstitucionesClient<$Result.GetResult<Prisma.$InstitucionesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    materias<T extends Areas$materiasArgs<ExtArgs> = {}>(args?: Subset<T, Areas$materiasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MateriasPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Areas model
   */
  interface AreasFieldRefs {
    readonly id: FieldRef<"Areas", 'Int'>
    readonly nombre: FieldRef<"Areas", 'String'>
    readonly es_opcional: FieldRef<"Areas", 'Boolean'>
    readonly orden: FieldRef<"Areas", 'Int'>
    readonly institucion_id: FieldRef<"Areas", 'Int'>
    readonly activa: FieldRef<"Areas", 'Boolean'>
    readonly created_at: FieldRef<"Areas", 'DateTime'>
    readonly updated_at: FieldRef<"Areas", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Areas findUnique
   */
  export type AreasFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Areas
     */
    select?: AreasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Areas
     */
    omit?: AreasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AreasInclude<ExtArgs> | null
    /**
     * Filter, which Areas to fetch.
     */
    where: AreasWhereUniqueInput
  }

  /**
   * Areas findUniqueOrThrow
   */
  export type AreasFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Areas
     */
    select?: AreasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Areas
     */
    omit?: AreasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AreasInclude<ExtArgs> | null
    /**
     * Filter, which Areas to fetch.
     */
    where: AreasWhereUniqueInput
  }

  /**
   * Areas findFirst
   */
  export type AreasFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Areas
     */
    select?: AreasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Areas
     */
    omit?: AreasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AreasInclude<ExtArgs> | null
    /**
     * Filter, which Areas to fetch.
     */
    where?: AreasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Areas to fetch.
     */
    orderBy?: AreasOrderByWithRelationInput | AreasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Areas.
     */
    cursor?: AreasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Areas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Areas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Areas.
     */
    distinct?: AreasScalarFieldEnum | AreasScalarFieldEnum[]
  }

  /**
   * Areas findFirstOrThrow
   */
  export type AreasFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Areas
     */
    select?: AreasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Areas
     */
    omit?: AreasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AreasInclude<ExtArgs> | null
    /**
     * Filter, which Areas to fetch.
     */
    where?: AreasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Areas to fetch.
     */
    orderBy?: AreasOrderByWithRelationInput | AreasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Areas.
     */
    cursor?: AreasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Areas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Areas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Areas.
     */
    distinct?: AreasScalarFieldEnum | AreasScalarFieldEnum[]
  }

  /**
   * Areas findMany
   */
  export type AreasFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Areas
     */
    select?: AreasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Areas
     */
    omit?: AreasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AreasInclude<ExtArgs> | null
    /**
     * Filter, which Areas to fetch.
     */
    where?: AreasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Areas to fetch.
     */
    orderBy?: AreasOrderByWithRelationInput | AreasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Areas.
     */
    cursor?: AreasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Areas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Areas.
     */
    skip?: number
    distinct?: AreasScalarFieldEnum | AreasScalarFieldEnum[]
  }

  /**
   * Areas create
   */
  export type AreasCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Areas
     */
    select?: AreasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Areas
     */
    omit?: AreasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AreasInclude<ExtArgs> | null
    /**
     * The data needed to create a Areas.
     */
    data: XOR<AreasCreateInput, AreasUncheckedCreateInput>
  }

  /**
   * Areas createMany
   */
  export type AreasCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Areas.
     */
    data: AreasCreateManyInput | AreasCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Areas createManyAndReturn
   */
  export type AreasCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Areas
     */
    select?: AreasSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Areas
     */
    omit?: AreasOmit<ExtArgs> | null
    /**
     * The data used to create many Areas.
     */
    data: AreasCreateManyInput | AreasCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AreasIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Areas update
   */
  export type AreasUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Areas
     */
    select?: AreasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Areas
     */
    omit?: AreasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AreasInclude<ExtArgs> | null
    /**
     * The data needed to update a Areas.
     */
    data: XOR<AreasUpdateInput, AreasUncheckedUpdateInput>
    /**
     * Choose, which Areas to update.
     */
    where: AreasWhereUniqueInput
  }

  /**
   * Areas updateMany
   */
  export type AreasUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Areas.
     */
    data: XOR<AreasUpdateManyMutationInput, AreasUncheckedUpdateManyInput>
    /**
     * Filter which Areas to update
     */
    where?: AreasWhereInput
    /**
     * Limit how many Areas to update.
     */
    limit?: number
  }

  /**
   * Areas updateManyAndReturn
   */
  export type AreasUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Areas
     */
    select?: AreasSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Areas
     */
    omit?: AreasOmit<ExtArgs> | null
    /**
     * The data used to update Areas.
     */
    data: XOR<AreasUpdateManyMutationInput, AreasUncheckedUpdateManyInput>
    /**
     * Filter which Areas to update
     */
    where?: AreasWhereInput
    /**
     * Limit how many Areas to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AreasIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Areas upsert
   */
  export type AreasUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Areas
     */
    select?: AreasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Areas
     */
    omit?: AreasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AreasInclude<ExtArgs> | null
    /**
     * The filter to search for the Areas to update in case it exists.
     */
    where: AreasWhereUniqueInput
    /**
     * In case the Areas found by the `where` argument doesn't exist, create a new Areas with this data.
     */
    create: XOR<AreasCreateInput, AreasUncheckedCreateInput>
    /**
     * In case the Areas was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AreasUpdateInput, AreasUncheckedUpdateInput>
  }

  /**
   * Areas delete
   */
  export type AreasDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Areas
     */
    select?: AreasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Areas
     */
    omit?: AreasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AreasInclude<ExtArgs> | null
    /**
     * Filter which Areas to delete.
     */
    where: AreasWhereUniqueInput
  }

  /**
   * Areas deleteMany
   */
  export type AreasDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Areas to delete
     */
    where?: AreasWhereInput
    /**
     * Limit how many Areas to delete.
     */
    limit?: number
  }

  /**
   * Areas.materias
   */
  export type Areas$materiasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Materias
     */
    select?: MateriasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Materias
     */
    omit?: MateriasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriasInclude<ExtArgs> | null
    where?: MateriasWhereInput
    orderBy?: MateriasOrderByWithRelationInput | MateriasOrderByWithRelationInput[]
    cursor?: MateriasWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MateriasScalarFieldEnum | MateriasScalarFieldEnum[]
  }

  /**
   * Areas without action
   */
  export type AreasDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Areas
     */
    select?: AreasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Areas
     */
    omit?: AreasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AreasInclude<ExtArgs> | null
  }


  /**
   * Model Materias
   */

  export type AggregateMaterias = {
    _count: MateriasCountAggregateOutputType | null
    _avg: MateriasAvgAggregateOutputType | null
    _sum: MateriasSumAggregateOutputType | null
    _min: MateriasMinAggregateOutputType | null
    _max: MateriasMaxAggregateOutputType | null
  }

  export type MateriasAvgAggregateOutputType = {
    id: number | null
    area_id: number | null
    institucion_id: number | null
  }

  export type MateriasSumAggregateOutputType = {
    id: number | null
    area_id: number | null
    institucion_id: number | null
  }

  export type MateriasMinAggregateOutputType = {
    id: number | null
    nombre: string | null
    area_id: number | null
    institucion_id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type MateriasMaxAggregateOutputType = {
    id: number | null
    nombre: string | null
    area_id: number | null
    institucion_id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type MateriasCountAggregateOutputType = {
    id: number
    nombre: number
    area_id: number
    institucion_id: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type MateriasAvgAggregateInputType = {
    id?: true
    area_id?: true
    institucion_id?: true
  }

  export type MateriasSumAggregateInputType = {
    id?: true
    area_id?: true
    institucion_id?: true
  }

  export type MateriasMinAggregateInputType = {
    id?: true
    nombre?: true
    area_id?: true
    institucion_id?: true
    created_at?: true
    updated_at?: true
  }

  export type MateriasMaxAggregateInputType = {
    id?: true
    nombre?: true
    area_id?: true
    institucion_id?: true
    created_at?: true
    updated_at?: true
  }

  export type MateriasCountAggregateInputType = {
    id?: true
    nombre?: true
    area_id?: true
    institucion_id?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type MateriasAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Materias to aggregate.
     */
    where?: MateriasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Materias to fetch.
     */
    orderBy?: MateriasOrderByWithRelationInput | MateriasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MateriasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Materias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Materias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Materias
    **/
    _count?: true | MateriasCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MateriasAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MateriasSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MateriasMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MateriasMaxAggregateInputType
  }

  export type GetMateriasAggregateType<T extends MateriasAggregateArgs> = {
        [P in keyof T & keyof AggregateMaterias]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMaterias[P]>
      : GetScalarType<T[P], AggregateMaterias[P]>
  }




  export type MateriasGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MateriasWhereInput
    orderBy?: MateriasOrderByWithAggregationInput | MateriasOrderByWithAggregationInput[]
    by: MateriasScalarFieldEnum[] | MateriasScalarFieldEnum
    having?: MateriasScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MateriasCountAggregateInputType | true
    _avg?: MateriasAvgAggregateInputType
    _sum?: MateriasSumAggregateInputType
    _min?: MateriasMinAggregateInputType
    _max?: MateriasMaxAggregateInputType
  }

  export type MateriasGroupByOutputType = {
    id: number
    nombre: string
    area_id: number
    institucion_id: number
    created_at: Date
    updated_at: Date
    _count: MateriasCountAggregateOutputType | null
    _avg: MateriasAvgAggregateOutputType | null
    _sum: MateriasSumAggregateOutputType | null
    _min: MateriasMinAggregateOutputType | null
    _max: MateriasMaxAggregateOutputType | null
  }

  type GetMateriasGroupByPayload<T extends MateriasGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MateriasGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MateriasGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MateriasGroupByOutputType[P]>
            : GetScalarType<T[P], MateriasGroupByOutputType[P]>
        }
      >
    >


  export type MateriasSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    area_id?: boolean
    institucion_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    area?: boolean | AreasDefaultArgs<ExtArgs>
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    materiaGrados?: boolean | Materias$materiaGradosArgs<ExtArgs>
    docenteAsignaciones?: boolean | Materias$docenteAsignacionesArgs<ExtArgs>
    _count?: boolean | MateriasCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["materias"]>

  export type MateriasSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    area_id?: boolean
    institucion_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    area?: boolean | AreasDefaultArgs<ExtArgs>
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["materias"]>

  export type MateriasSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    area_id?: boolean
    institucion_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    area?: boolean | AreasDefaultArgs<ExtArgs>
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["materias"]>

  export type MateriasSelectScalar = {
    id?: boolean
    nombre?: boolean
    area_id?: boolean
    institucion_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type MateriasOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "area_id" | "institucion_id" | "created_at" | "updated_at", ExtArgs["result"]["materias"]>
  export type MateriasInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    area?: boolean | AreasDefaultArgs<ExtArgs>
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    materiaGrados?: boolean | Materias$materiaGradosArgs<ExtArgs>
    docenteAsignaciones?: boolean | Materias$docenteAsignacionesArgs<ExtArgs>
    _count?: boolean | MateriasCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MateriasIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    area?: boolean | AreasDefaultArgs<ExtArgs>
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
  }
  export type MateriasIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    area?: boolean | AreasDefaultArgs<ExtArgs>
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
  }

  export type $MateriasPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Materias"
    objects: {
      area: Prisma.$AreasPayload<ExtArgs>
      institucion: Prisma.$InstitucionesPayload<ExtArgs>
      materiaGrados: Prisma.$MateriaGradosPayload<ExtArgs>[]
      docenteAsignaciones: Prisma.$DocenteAsignacionesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nombre: string
      area_id: number
      institucion_id: number
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["materias"]>
    composites: {}
  }

  type MateriasGetPayload<S extends boolean | null | undefined | MateriasDefaultArgs> = $Result.GetResult<Prisma.$MateriasPayload, S>

  type MateriasCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MateriasFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MateriasCountAggregateInputType | true
    }

  export interface MateriasDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Materias'], meta: { name: 'Materias' } }
    /**
     * Find zero or one Materias that matches the filter.
     * @param {MateriasFindUniqueArgs} args - Arguments to find a Materias
     * @example
     * // Get one Materias
     * const materias = await prisma.materias.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MateriasFindUniqueArgs>(args: SelectSubset<T, MateriasFindUniqueArgs<ExtArgs>>): Prisma__MateriasClient<$Result.GetResult<Prisma.$MateriasPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Materias that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MateriasFindUniqueOrThrowArgs} args - Arguments to find a Materias
     * @example
     * // Get one Materias
     * const materias = await prisma.materias.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MateriasFindUniqueOrThrowArgs>(args: SelectSubset<T, MateriasFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MateriasClient<$Result.GetResult<Prisma.$MateriasPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Materias that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MateriasFindFirstArgs} args - Arguments to find a Materias
     * @example
     * // Get one Materias
     * const materias = await prisma.materias.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MateriasFindFirstArgs>(args?: SelectSubset<T, MateriasFindFirstArgs<ExtArgs>>): Prisma__MateriasClient<$Result.GetResult<Prisma.$MateriasPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Materias that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MateriasFindFirstOrThrowArgs} args - Arguments to find a Materias
     * @example
     * // Get one Materias
     * const materias = await prisma.materias.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MateriasFindFirstOrThrowArgs>(args?: SelectSubset<T, MateriasFindFirstOrThrowArgs<ExtArgs>>): Prisma__MateriasClient<$Result.GetResult<Prisma.$MateriasPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Materias that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MateriasFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Materias
     * const materias = await prisma.materias.findMany()
     * 
     * // Get first 10 Materias
     * const materias = await prisma.materias.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const materiasWithIdOnly = await prisma.materias.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MateriasFindManyArgs>(args?: SelectSubset<T, MateriasFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MateriasPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Materias.
     * @param {MateriasCreateArgs} args - Arguments to create a Materias.
     * @example
     * // Create one Materias
     * const Materias = await prisma.materias.create({
     *   data: {
     *     // ... data to create a Materias
     *   }
     * })
     * 
     */
    create<T extends MateriasCreateArgs>(args: SelectSubset<T, MateriasCreateArgs<ExtArgs>>): Prisma__MateriasClient<$Result.GetResult<Prisma.$MateriasPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Materias.
     * @param {MateriasCreateManyArgs} args - Arguments to create many Materias.
     * @example
     * // Create many Materias
     * const materias = await prisma.materias.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MateriasCreateManyArgs>(args?: SelectSubset<T, MateriasCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Materias and returns the data saved in the database.
     * @param {MateriasCreateManyAndReturnArgs} args - Arguments to create many Materias.
     * @example
     * // Create many Materias
     * const materias = await prisma.materias.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Materias and only return the `id`
     * const materiasWithIdOnly = await prisma.materias.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MateriasCreateManyAndReturnArgs>(args?: SelectSubset<T, MateriasCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MateriasPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Materias.
     * @param {MateriasDeleteArgs} args - Arguments to delete one Materias.
     * @example
     * // Delete one Materias
     * const Materias = await prisma.materias.delete({
     *   where: {
     *     // ... filter to delete one Materias
     *   }
     * })
     * 
     */
    delete<T extends MateriasDeleteArgs>(args: SelectSubset<T, MateriasDeleteArgs<ExtArgs>>): Prisma__MateriasClient<$Result.GetResult<Prisma.$MateriasPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Materias.
     * @param {MateriasUpdateArgs} args - Arguments to update one Materias.
     * @example
     * // Update one Materias
     * const materias = await prisma.materias.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MateriasUpdateArgs>(args: SelectSubset<T, MateriasUpdateArgs<ExtArgs>>): Prisma__MateriasClient<$Result.GetResult<Prisma.$MateriasPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Materias.
     * @param {MateriasDeleteManyArgs} args - Arguments to filter Materias to delete.
     * @example
     * // Delete a few Materias
     * const { count } = await prisma.materias.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MateriasDeleteManyArgs>(args?: SelectSubset<T, MateriasDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Materias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MateriasUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Materias
     * const materias = await prisma.materias.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MateriasUpdateManyArgs>(args: SelectSubset<T, MateriasUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Materias and returns the data updated in the database.
     * @param {MateriasUpdateManyAndReturnArgs} args - Arguments to update many Materias.
     * @example
     * // Update many Materias
     * const materias = await prisma.materias.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Materias and only return the `id`
     * const materiasWithIdOnly = await prisma.materias.updateManyAndReturn({
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
    updateManyAndReturn<T extends MateriasUpdateManyAndReturnArgs>(args: SelectSubset<T, MateriasUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MateriasPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Materias.
     * @param {MateriasUpsertArgs} args - Arguments to update or create a Materias.
     * @example
     * // Update or create a Materias
     * const materias = await prisma.materias.upsert({
     *   create: {
     *     // ... data to create a Materias
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Materias we want to update
     *   }
     * })
     */
    upsert<T extends MateriasUpsertArgs>(args: SelectSubset<T, MateriasUpsertArgs<ExtArgs>>): Prisma__MateriasClient<$Result.GetResult<Prisma.$MateriasPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Materias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MateriasCountArgs} args - Arguments to filter Materias to count.
     * @example
     * // Count the number of Materias
     * const count = await prisma.materias.count({
     *   where: {
     *     // ... the filter for the Materias we want to count
     *   }
     * })
    **/
    count<T extends MateriasCountArgs>(
      args?: Subset<T, MateriasCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MateriasCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Materias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MateriasAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MateriasAggregateArgs>(args: Subset<T, MateriasAggregateArgs>): Prisma.PrismaPromise<GetMateriasAggregateType<T>>

    /**
     * Group by Materias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MateriasGroupByArgs} args - Group by arguments.
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
      T extends MateriasGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MateriasGroupByArgs['orderBy'] }
        : { orderBy?: MateriasGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MateriasGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMateriasGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Materias model
   */
  readonly fields: MateriasFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Materias.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MateriasClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    area<T extends AreasDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AreasDefaultArgs<ExtArgs>>): Prisma__AreasClient<$Result.GetResult<Prisma.$AreasPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    institucion<T extends InstitucionesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InstitucionesDefaultArgs<ExtArgs>>): Prisma__InstitucionesClient<$Result.GetResult<Prisma.$InstitucionesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    materiaGrados<T extends Materias$materiaGradosArgs<ExtArgs> = {}>(args?: Subset<T, Materias$materiaGradosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MateriaGradosPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    docenteAsignaciones<T extends Materias$docenteAsignacionesArgs<ExtArgs> = {}>(args?: Subset<T, Materias$docenteAsignacionesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocenteAsignacionesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Materias model
   */
  interface MateriasFieldRefs {
    readonly id: FieldRef<"Materias", 'Int'>
    readonly nombre: FieldRef<"Materias", 'String'>
    readonly area_id: FieldRef<"Materias", 'Int'>
    readonly institucion_id: FieldRef<"Materias", 'Int'>
    readonly created_at: FieldRef<"Materias", 'DateTime'>
    readonly updated_at: FieldRef<"Materias", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Materias findUnique
   */
  export type MateriasFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Materias
     */
    select?: MateriasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Materias
     */
    omit?: MateriasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriasInclude<ExtArgs> | null
    /**
     * Filter, which Materias to fetch.
     */
    where: MateriasWhereUniqueInput
  }

  /**
   * Materias findUniqueOrThrow
   */
  export type MateriasFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Materias
     */
    select?: MateriasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Materias
     */
    omit?: MateriasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriasInclude<ExtArgs> | null
    /**
     * Filter, which Materias to fetch.
     */
    where: MateriasWhereUniqueInput
  }

  /**
   * Materias findFirst
   */
  export type MateriasFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Materias
     */
    select?: MateriasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Materias
     */
    omit?: MateriasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriasInclude<ExtArgs> | null
    /**
     * Filter, which Materias to fetch.
     */
    where?: MateriasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Materias to fetch.
     */
    orderBy?: MateriasOrderByWithRelationInput | MateriasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Materias.
     */
    cursor?: MateriasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Materias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Materias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Materias.
     */
    distinct?: MateriasScalarFieldEnum | MateriasScalarFieldEnum[]
  }

  /**
   * Materias findFirstOrThrow
   */
  export type MateriasFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Materias
     */
    select?: MateriasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Materias
     */
    omit?: MateriasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriasInclude<ExtArgs> | null
    /**
     * Filter, which Materias to fetch.
     */
    where?: MateriasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Materias to fetch.
     */
    orderBy?: MateriasOrderByWithRelationInput | MateriasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Materias.
     */
    cursor?: MateriasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Materias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Materias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Materias.
     */
    distinct?: MateriasScalarFieldEnum | MateriasScalarFieldEnum[]
  }

  /**
   * Materias findMany
   */
  export type MateriasFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Materias
     */
    select?: MateriasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Materias
     */
    omit?: MateriasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriasInclude<ExtArgs> | null
    /**
     * Filter, which Materias to fetch.
     */
    where?: MateriasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Materias to fetch.
     */
    orderBy?: MateriasOrderByWithRelationInput | MateriasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Materias.
     */
    cursor?: MateriasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Materias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Materias.
     */
    skip?: number
    distinct?: MateriasScalarFieldEnum | MateriasScalarFieldEnum[]
  }

  /**
   * Materias create
   */
  export type MateriasCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Materias
     */
    select?: MateriasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Materias
     */
    omit?: MateriasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriasInclude<ExtArgs> | null
    /**
     * The data needed to create a Materias.
     */
    data: XOR<MateriasCreateInput, MateriasUncheckedCreateInput>
  }

  /**
   * Materias createMany
   */
  export type MateriasCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Materias.
     */
    data: MateriasCreateManyInput | MateriasCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Materias createManyAndReturn
   */
  export type MateriasCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Materias
     */
    select?: MateriasSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Materias
     */
    omit?: MateriasOmit<ExtArgs> | null
    /**
     * The data used to create many Materias.
     */
    data: MateriasCreateManyInput | MateriasCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriasIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Materias update
   */
  export type MateriasUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Materias
     */
    select?: MateriasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Materias
     */
    omit?: MateriasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriasInclude<ExtArgs> | null
    /**
     * The data needed to update a Materias.
     */
    data: XOR<MateriasUpdateInput, MateriasUncheckedUpdateInput>
    /**
     * Choose, which Materias to update.
     */
    where: MateriasWhereUniqueInput
  }

  /**
   * Materias updateMany
   */
  export type MateriasUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Materias.
     */
    data: XOR<MateriasUpdateManyMutationInput, MateriasUncheckedUpdateManyInput>
    /**
     * Filter which Materias to update
     */
    where?: MateriasWhereInput
    /**
     * Limit how many Materias to update.
     */
    limit?: number
  }

  /**
   * Materias updateManyAndReturn
   */
  export type MateriasUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Materias
     */
    select?: MateriasSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Materias
     */
    omit?: MateriasOmit<ExtArgs> | null
    /**
     * The data used to update Materias.
     */
    data: XOR<MateriasUpdateManyMutationInput, MateriasUncheckedUpdateManyInput>
    /**
     * Filter which Materias to update
     */
    where?: MateriasWhereInput
    /**
     * Limit how many Materias to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriasIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Materias upsert
   */
  export type MateriasUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Materias
     */
    select?: MateriasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Materias
     */
    omit?: MateriasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriasInclude<ExtArgs> | null
    /**
     * The filter to search for the Materias to update in case it exists.
     */
    where: MateriasWhereUniqueInput
    /**
     * In case the Materias found by the `where` argument doesn't exist, create a new Materias with this data.
     */
    create: XOR<MateriasCreateInput, MateriasUncheckedCreateInput>
    /**
     * In case the Materias was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MateriasUpdateInput, MateriasUncheckedUpdateInput>
  }

  /**
   * Materias delete
   */
  export type MateriasDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Materias
     */
    select?: MateriasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Materias
     */
    omit?: MateriasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriasInclude<ExtArgs> | null
    /**
     * Filter which Materias to delete.
     */
    where: MateriasWhereUniqueInput
  }

  /**
   * Materias deleteMany
   */
  export type MateriasDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Materias to delete
     */
    where?: MateriasWhereInput
    /**
     * Limit how many Materias to delete.
     */
    limit?: number
  }

  /**
   * Materias.materiaGrados
   */
  export type Materias$materiaGradosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MateriaGrados
     */
    select?: MateriaGradosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MateriaGrados
     */
    omit?: MateriaGradosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriaGradosInclude<ExtArgs> | null
    where?: MateriaGradosWhereInput
    orderBy?: MateriaGradosOrderByWithRelationInput | MateriaGradosOrderByWithRelationInput[]
    cursor?: MateriaGradosWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MateriaGradosScalarFieldEnum | MateriaGradosScalarFieldEnum[]
  }

  /**
   * Materias.docenteAsignaciones
   */
  export type Materias$docenteAsignacionesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocenteAsignaciones
     */
    select?: DocenteAsignacionesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocenteAsignaciones
     */
    omit?: DocenteAsignacionesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocenteAsignacionesInclude<ExtArgs> | null
    where?: DocenteAsignacionesWhereInput
    orderBy?: DocenteAsignacionesOrderByWithRelationInput | DocenteAsignacionesOrderByWithRelationInput[]
    cursor?: DocenteAsignacionesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DocenteAsignacionesScalarFieldEnum | DocenteAsignacionesScalarFieldEnum[]
  }

  /**
   * Materias without action
   */
  export type MateriasDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Materias
     */
    select?: MateriasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Materias
     */
    omit?: MateriasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriasInclude<ExtArgs> | null
  }


  /**
   * Model MateriaGrados
   */

  export type AggregateMateriaGrados = {
    _count: MateriaGradosCountAggregateOutputType | null
    _avg: MateriaGradosAvgAggregateOutputType | null
    _sum: MateriaGradosSumAggregateOutputType | null
    _min: MateriaGradosMinAggregateOutputType | null
    _max: MateriaGradosMaxAggregateOutputType | null
  }

  export type MateriaGradosAvgAggregateOutputType = {
    id: number | null
    materia_id: number | null
    grado_id: number | null
  }

  export type MateriaGradosSumAggregateOutputType = {
    id: number | null
    materia_id: number | null
    grado_id: number | null
  }

  export type MateriaGradosMinAggregateOutputType = {
    id: number | null
    materia_id: number | null
    grado_id: number | null
    created_at: Date | null
  }

  export type MateriaGradosMaxAggregateOutputType = {
    id: number | null
    materia_id: number | null
    grado_id: number | null
    created_at: Date | null
  }

  export type MateriaGradosCountAggregateOutputType = {
    id: number
    materia_id: number
    grado_id: number
    created_at: number
    _all: number
  }


  export type MateriaGradosAvgAggregateInputType = {
    id?: true
    materia_id?: true
    grado_id?: true
  }

  export type MateriaGradosSumAggregateInputType = {
    id?: true
    materia_id?: true
    grado_id?: true
  }

  export type MateriaGradosMinAggregateInputType = {
    id?: true
    materia_id?: true
    grado_id?: true
    created_at?: true
  }

  export type MateriaGradosMaxAggregateInputType = {
    id?: true
    materia_id?: true
    grado_id?: true
    created_at?: true
  }

  export type MateriaGradosCountAggregateInputType = {
    id?: true
    materia_id?: true
    grado_id?: true
    created_at?: true
    _all?: true
  }

  export type MateriaGradosAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MateriaGrados to aggregate.
     */
    where?: MateriaGradosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MateriaGrados to fetch.
     */
    orderBy?: MateriaGradosOrderByWithRelationInput | MateriaGradosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MateriaGradosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MateriaGrados from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MateriaGrados.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MateriaGrados
    **/
    _count?: true | MateriaGradosCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MateriaGradosAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MateriaGradosSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MateriaGradosMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MateriaGradosMaxAggregateInputType
  }

  export type GetMateriaGradosAggregateType<T extends MateriaGradosAggregateArgs> = {
        [P in keyof T & keyof AggregateMateriaGrados]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMateriaGrados[P]>
      : GetScalarType<T[P], AggregateMateriaGrados[P]>
  }




  export type MateriaGradosGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MateriaGradosWhereInput
    orderBy?: MateriaGradosOrderByWithAggregationInput | MateriaGradosOrderByWithAggregationInput[]
    by: MateriaGradosScalarFieldEnum[] | MateriaGradosScalarFieldEnum
    having?: MateriaGradosScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MateriaGradosCountAggregateInputType | true
    _avg?: MateriaGradosAvgAggregateInputType
    _sum?: MateriaGradosSumAggregateInputType
    _min?: MateriaGradosMinAggregateInputType
    _max?: MateriaGradosMaxAggregateInputType
  }

  export type MateriaGradosGroupByOutputType = {
    id: number
    materia_id: number
    grado_id: number
    created_at: Date
    _count: MateriaGradosCountAggregateOutputType | null
    _avg: MateriaGradosAvgAggregateOutputType | null
    _sum: MateriaGradosSumAggregateOutputType | null
    _min: MateriaGradosMinAggregateOutputType | null
    _max: MateriaGradosMaxAggregateOutputType | null
  }

  type GetMateriaGradosGroupByPayload<T extends MateriaGradosGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MateriaGradosGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MateriaGradosGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MateriaGradosGroupByOutputType[P]>
            : GetScalarType<T[P], MateriaGradosGroupByOutputType[P]>
        }
      >
    >


  export type MateriaGradosSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    materia_id?: boolean
    grado_id?: boolean
    created_at?: boolean
    materia?: boolean | MateriasDefaultArgs<ExtArgs>
    grado?: boolean | GradosDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["materiaGrados"]>

  export type MateriaGradosSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    materia_id?: boolean
    grado_id?: boolean
    created_at?: boolean
    materia?: boolean | MateriasDefaultArgs<ExtArgs>
    grado?: boolean | GradosDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["materiaGrados"]>

  export type MateriaGradosSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    materia_id?: boolean
    grado_id?: boolean
    created_at?: boolean
    materia?: boolean | MateriasDefaultArgs<ExtArgs>
    grado?: boolean | GradosDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["materiaGrados"]>

  export type MateriaGradosSelectScalar = {
    id?: boolean
    materia_id?: boolean
    grado_id?: boolean
    created_at?: boolean
  }

  export type MateriaGradosOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "materia_id" | "grado_id" | "created_at", ExtArgs["result"]["materiaGrados"]>
  export type MateriaGradosInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    materia?: boolean | MateriasDefaultArgs<ExtArgs>
    grado?: boolean | GradosDefaultArgs<ExtArgs>
  }
  export type MateriaGradosIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    materia?: boolean | MateriasDefaultArgs<ExtArgs>
    grado?: boolean | GradosDefaultArgs<ExtArgs>
  }
  export type MateriaGradosIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    materia?: boolean | MateriasDefaultArgs<ExtArgs>
    grado?: boolean | GradosDefaultArgs<ExtArgs>
  }

  export type $MateriaGradosPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MateriaGrados"
    objects: {
      materia: Prisma.$MateriasPayload<ExtArgs>
      grado: Prisma.$GradosPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      materia_id: number
      grado_id: number
      created_at: Date
    }, ExtArgs["result"]["materiaGrados"]>
    composites: {}
  }

  type MateriaGradosGetPayload<S extends boolean | null | undefined | MateriaGradosDefaultArgs> = $Result.GetResult<Prisma.$MateriaGradosPayload, S>

  type MateriaGradosCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MateriaGradosFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MateriaGradosCountAggregateInputType | true
    }

  export interface MateriaGradosDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MateriaGrados'], meta: { name: 'MateriaGrados' } }
    /**
     * Find zero or one MateriaGrados that matches the filter.
     * @param {MateriaGradosFindUniqueArgs} args - Arguments to find a MateriaGrados
     * @example
     * // Get one MateriaGrados
     * const materiaGrados = await prisma.materiaGrados.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MateriaGradosFindUniqueArgs>(args: SelectSubset<T, MateriaGradosFindUniqueArgs<ExtArgs>>): Prisma__MateriaGradosClient<$Result.GetResult<Prisma.$MateriaGradosPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MateriaGrados that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MateriaGradosFindUniqueOrThrowArgs} args - Arguments to find a MateriaGrados
     * @example
     * // Get one MateriaGrados
     * const materiaGrados = await prisma.materiaGrados.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MateriaGradosFindUniqueOrThrowArgs>(args: SelectSubset<T, MateriaGradosFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MateriaGradosClient<$Result.GetResult<Prisma.$MateriaGradosPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MateriaGrados that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MateriaGradosFindFirstArgs} args - Arguments to find a MateriaGrados
     * @example
     * // Get one MateriaGrados
     * const materiaGrados = await prisma.materiaGrados.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MateriaGradosFindFirstArgs>(args?: SelectSubset<T, MateriaGradosFindFirstArgs<ExtArgs>>): Prisma__MateriaGradosClient<$Result.GetResult<Prisma.$MateriaGradosPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MateriaGrados that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MateriaGradosFindFirstOrThrowArgs} args - Arguments to find a MateriaGrados
     * @example
     * // Get one MateriaGrados
     * const materiaGrados = await prisma.materiaGrados.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MateriaGradosFindFirstOrThrowArgs>(args?: SelectSubset<T, MateriaGradosFindFirstOrThrowArgs<ExtArgs>>): Prisma__MateriaGradosClient<$Result.GetResult<Prisma.$MateriaGradosPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MateriaGrados that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MateriaGradosFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MateriaGrados
     * const materiaGrados = await prisma.materiaGrados.findMany()
     * 
     * // Get first 10 MateriaGrados
     * const materiaGrados = await prisma.materiaGrados.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const materiaGradosWithIdOnly = await prisma.materiaGrados.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MateriaGradosFindManyArgs>(args?: SelectSubset<T, MateriaGradosFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MateriaGradosPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MateriaGrados.
     * @param {MateriaGradosCreateArgs} args - Arguments to create a MateriaGrados.
     * @example
     * // Create one MateriaGrados
     * const MateriaGrados = await prisma.materiaGrados.create({
     *   data: {
     *     // ... data to create a MateriaGrados
     *   }
     * })
     * 
     */
    create<T extends MateriaGradosCreateArgs>(args: SelectSubset<T, MateriaGradosCreateArgs<ExtArgs>>): Prisma__MateriaGradosClient<$Result.GetResult<Prisma.$MateriaGradosPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MateriaGrados.
     * @param {MateriaGradosCreateManyArgs} args - Arguments to create many MateriaGrados.
     * @example
     * // Create many MateriaGrados
     * const materiaGrados = await prisma.materiaGrados.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MateriaGradosCreateManyArgs>(args?: SelectSubset<T, MateriaGradosCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MateriaGrados and returns the data saved in the database.
     * @param {MateriaGradosCreateManyAndReturnArgs} args - Arguments to create many MateriaGrados.
     * @example
     * // Create many MateriaGrados
     * const materiaGrados = await prisma.materiaGrados.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MateriaGrados and only return the `id`
     * const materiaGradosWithIdOnly = await prisma.materiaGrados.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MateriaGradosCreateManyAndReturnArgs>(args?: SelectSubset<T, MateriaGradosCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MateriaGradosPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MateriaGrados.
     * @param {MateriaGradosDeleteArgs} args - Arguments to delete one MateriaGrados.
     * @example
     * // Delete one MateriaGrados
     * const MateriaGrados = await prisma.materiaGrados.delete({
     *   where: {
     *     // ... filter to delete one MateriaGrados
     *   }
     * })
     * 
     */
    delete<T extends MateriaGradosDeleteArgs>(args: SelectSubset<T, MateriaGradosDeleteArgs<ExtArgs>>): Prisma__MateriaGradosClient<$Result.GetResult<Prisma.$MateriaGradosPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MateriaGrados.
     * @param {MateriaGradosUpdateArgs} args - Arguments to update one MateriaGrados.
     * @example
     * // Update one MateriaGrados
     * const materiaGrados = await prisma.materiaGrados.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MateriaGradosUpdateArgs>(args: SelectSubset<T, MateriaGradosUpdateArgs<ExtArgs>>): Prisma__MateriaGradosClient<$Result.GetResult<Prisma.$MateriaGradosPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MateriaGrados.
     * @param {MateriaGradosDeleteManyArgs} args - Arguments to filter MateriaGrados to delete.
     * @example
     * // Delete a few MateriaGrados
     * const { count } = await prisma.materiaGrados.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MateriaGradosDeleteManyArgs>(args?: SelectSubset<T, MateriaGradosDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MateriaGrados.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MateriaGradosUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MateriaGrados
     * const materiaGrados = await prisma.materiaGrados.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MateriaGradosUpdateManyArgs>(args: SelectSubset<T, MateriaGradosUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MateriaGrados and returns the data updated in the database.
     * @param {MateriaGradosUpdateManyAndReturnArgs} args - Arguments to update many MateriaGrados.
     * @example
     * // Update many MateriaGrados
     * const materiaGrados = await prisma.materiaGrados.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MateriaGrados and only return the `id`
     * const materiaGradosWithIdOnly = await prisma.materiaGrados.updateManyAndReturn({
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
    updateManyAndReturn<T extends MateriaGradosUpdateManyAndReturnArgs>(args: SelectSubset<T, MateriaGradosUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MateriaGradosPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MateriaGrados.
     * @param {MateriaGradosUpsertArgs} args - Arguments to update or create a MateriaGrados.
     * @example
     * // Update or create a MateriaGrados
     * const materiaGrados = await prisma.materiaGrados.upsert({
     *   create: {
     *     // ... data to create a MateriaGrados
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MateriaGrados we want to update
     *   }
     * })
     */
    upsert<T extends MateriaGradosUpsertArgs>(args: SelectSubset<T, MateriaGradosUpsertArgs<ExtArgs>>): Prisma__MateriaGradosClient<$Result.GetResult<Prisma.$MateriaGradosPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MateriaGrados.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MateriaGradosCountArgs} args - Arguments to filter MateriaGrados to count.
     * @example
     * // Count the number of MateriaGrados
     * const count = await prisma.materiaGrados.count({
     *   where: {
     *     // ... the filter for the MateriaGrados we want to count
     *   }
     * })
    **/
    count<T extends MateriaGradosCountArgs>(
      args?: Subset<T, MateriaGradosCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MateriaGradosCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MateriaGrados.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MateriaGradosAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MateriaGradosAggregateArgs>(args: Subset<T, MateriaGradosAggregateArgs>): Prisma.PrismaPromise<GetMateriaGradosAggregateType<T>>

    /**
     * Group by MateriaGrados.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MateriaGradosGroupByArgs} args - Group by arguments.
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
      T extends MateriaGradosGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MateriaGradosGroupByArgs['orderBy'] }
        : { orderBy?: MateriaGradosGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MateriaGradosGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMateriaGradosGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MateriaGrados model
   */
  readonly fields: MateriaGradosFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MateriaGrados.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MateriaGradosClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    materia<T extends MateriasDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MateriasDefaultArgs<ExtArgs>>): Prisma__MateriasClient<$Result.GetResult<Prisma.$MateriasPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    grado<T extends GradosDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GradosDefaultArgs<ExtArgs>>): Prisma__GradosClient<$Result.GetResult<Prisma.$GradosPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the MateriaGrados model
   */
  interface MateriaGradosFieldRefs {
    readonly id: FieldRef<"MateriaGrados", 'Int'>
    readonly materia_id: FieldRef<"MateriaGrados", 'Int'>
    readonly grado_id: FieldRef<"MateriaGrados", 'Int'>
    readonly created_at: FieldRef<"MateriaGrados", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MateriaGrados findUnique
   */
  export type MateriaGradosFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MateriaGrados
     */
    select?: MateriaGradosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MateriaGrados
     */
    omit?: MateriaGradosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriaGradosInclude<ExtArgs> | null
    /**
     * Filter, which MateriaGrados to fetch.
     */
    where: MateriaGradosWhereUniqueInput
  }

  /**
   * MateriaGrados findUniqueOrThrow
   */
  export type MateriaGradosFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MateriaGrados
     */
    select?: MateriaGradosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MateriaGrados
     */
    omit?: MateriaGradosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriaGradosInclude<ExtArgs> | null
    /**
     * Filter, which MateriaGrados to fetch.
     */
    where: MateriaGradosWhereUniqueInput
  }

  /**
   * MateriaGrados findFirst
   */
  export type MateriaGradosFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MateriaGrados
     */
    select?: MateriaGradosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MateriaGrados
     */
    omit?: MateriaGradosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriaGradosInclude<ExtArgs> | null
    /**
     * Filter, which MateriaGrados to fetch.
     */
    where?: MateriaGradosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MateriaGrados to fetch.
     */
    orderBy?: MateriaGradosOrderByWithRelationInput | MateriaGradosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MateriaGrados.
     */
    cursor?: MateriaGradosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MateriaGrados from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MateriaGrados.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MateriaGrados.
     */
    distinct?: MateriaGradosScalarFieldEnum | MateriaGradosScalarFieldEnum[]
  }

  /**
   * MateriaGrados findFirstOrThrow
   */
  export type MateriaGradosFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MateriaGrados
     */
    select?: MateriaGradosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MateriaGrados
     */
    omit?: MateriaGradosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriaGradosInclude<ExtArgs> | null
    /**
     * Filter, which MateriaGrados to fetch.
     */
    where?: MateriaGradosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MateriaGrados to fetch.
     */
    orderBy?: MateriaGradosOrderByWithRelationInput | MateriaGradosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MateriaGrados.
     */
    cursor?: MateriaGradosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MateriaGrados from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MateriaGrados.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MateriaGrados.
     */
    distinct?: MateriaGradosScalarFieldEnum | MateriaGradosScalarFieldEnum[]
  }

  /**
   * MateriaGrados findMany
   */
  export type MateriaGradosFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MateriaGrados
     */
    select?: MateriaGradosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MateriaGrados
     */
    omit?: MateriaGradosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriaGradosInclude<ExtArgs> | null
    /**
     * Filter, which MateriaGrados to fetch.
     */
    where?: MateriaGradosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MateriaGrados to fetch.
     */
    orderBy?: MateriaGradosOrderByWithRelationInput | MateriaGradosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MateriaGrados.
     */
    cursor?: MateriaGradosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MateriaGrados from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MateriaGrados.
     */
    skip?: number
    distinct?: MateriaGradosScalarFieldEnum | MateriaGradosScalarFieldEnum[]
  }

  /**
   * MateriaGrados create
   */
  export type MateriaGradosCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MateriaGrados
     */
    select?: MateriaGradosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MateriaGrados
     */
    omit?: MateriaGradosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriaGradosInclude<ExtArgs> | null
    /**
     * The data needed to create a MateriaGrados.
     */
    data: XOR<MateriaGradosCreateInput, MateriaGradosUncheckedCreateInput>
  }

  /**
   * MateriaGrados createMany
   */
  export type MateriaGradosCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MateriaGrados.
     */
    data: MateriaGradosCreateManyInput | MateriaGradosCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MateriaGrados createManyAndReturn
   */
  export type MateriaGradosCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MateriaGrados
     */
    select?: MateriaGradosSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MateriaGrados
     */
    omit?: MateriaGradosOmit<ExtArgs> | null
    /**
     * The data used to create many MateriaGrados.
     */
    data: MateriaGradosCreateManyInput | MateriaGradosCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriaGradosIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MateriaGrados update
   */
  export type MateriaGradosUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MateriaGrados
     */
    select?: MateriaGradosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MateriaGrados
     */
    omit?: MateriaGradosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriaGradosInclude<ExtArgs> | null
    /**
     * The data needed to update a MateriaGrados.
     */
    data: XOR<MateriaGradosUpdateInput, MateriaGradosUncheckedUpdateInput>
    /**
     * Choose, which MateriaGrados to update.
     */
    where: MateriaGradosWhereUniqueInput
  }

  /**
   * MateriaGrados updateMany
   */
  export type MateriaGradosUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MateriaGrados.
     */
    data: XOR<MateriaGradosUpdateManyMutationInput, MateriaGradosUncheckedUpdateManyInput>
    /**
     * Filter which MateriaGrados to update
     */
    where?: MateriaGradosWhereInput
    /**
     * Limit how many MateriaGrados to update.
     */
    limit?: number
  }

  /**
   * MateriaGrados updateManyAndReturn
   */
  export type MateriaGradosUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MateriaGrados
     */
    select?: MateriaGradosSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MateriaGrados
     */
    omit?: MateriaGradosOmit<ExtArgs> | null
    /**
     * The data used to update MateriaGrados.
     */
    data: XOR<MateriaGradosUpdateManyMutationInput, MateriaGradosUncheckedUpdateManyInput>
    /**
     * Filter which MateriaGrados to update
     */
    where?: MateriaGradosWhereInput
    /**
     * Limit how many MateriaGrados to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriaGradosIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MateriaGrados upsert
   */
  export type MateriaGradosUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MateriaGrados
     */
    select?: MateriaGradosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MateriaGrados
     */
    omit?: MateriaGradosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriaGradosInclude<ExtArgs> | null
    /**
     * The filter to search for the MateriaGrados to update in case it exists.
     */
    where: MateriaGradosWhereUniqueInput
    /**
     * In case the MateriaGrados found by the `where` argument doesn't exist, create a new MateriaGrados with this data.
     */
    create: XOR<MateriaGradosCreateInput, MateriaGradosUncheckedCreateInput>
    /**
     * In case the MateriaGrados was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MateriaGradosUpdateInput, MateriaGradosUncheckedUpdateInput>
  }

  /**
   * MateriaGrados delete
   */
  export type MateriaGradosDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MateriaGrados
     */
    select?: MateriaGradosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MateriaGrados
     */
    omit?: MateriaGradosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriaGradosInclude<ExtArgs> | null
    /**
     * Filter which MateriaGrados to delete.
     */
    where: MateriaGradosWhereUniqueInput
  }

  /**
   * MateriaGrados deleteMany
   */
  export type MateriaGradosDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MateriaGrados to delete
     */
    where?: MateriaGradosWhereInput
    /**
     * Limit how many MateriaGrados to delete.
     */
    limit?: number
  }

  /**
   * MateriaGrados without action
   */
  export type MateriaGradosDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MateriaGrados
     */
    select?: MateriaGradosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MateriaGrados
     */
    omit?: MateriaGradosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MateriaGradosInclude<ExtArgs> | null
  }


  /**
   * Model Docentes
   */

  export type AggregateDocentes = {
    _count: DocentesCountAggregateOutputType | null
    _avg: DocentesAvgAggregateOutputType | null
    _sum: DocentesSumAggregateOutputType | null
    _min: DocentesMinAggregateOutputType | null
    _max: DocentesMaxAggregateOutputType | null
  }

  export type DocentesAvgAggregateOutputType = {
    id: number | null
    institucion_id: number | null
    sede_id: number | null
  }

  export type DocentesSumAggregateOutputType = {
    id: number | null
    institucion_id: number | null
    sede_id: number | null
  }

  export type DocentesMinAggregateOutputType = {
    id: number | null
    apellidos: string | null
    nombres: string | null
    telefono: string | null
    email: string | null
    institucion_id: number | null
    sede_id: number | null
    activo: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type DocentesMaxAggregateOutputType = {
    id: number | null
    apellidos: string | null
    nombres: string | null
    telefono: string | null
    email: string | null
    institucion_id: number | null
    sede_id: number | null
    activo: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type DocentesCountAggregateOutputType = {
    id: number
    apellidos: number
    nombres: number
    telefono: number
    email: number
    institucion_id: number
    sede_id: number
    activo: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type DocentesAvgAggregateInputType = {
    id?: true
    institucion_id?: true
    sede_id?: true
  }

  export type DocentesSumAggregateInputType = {
    id?: true
    institucion_id?: true
    sede_id?: true
  }

  export type DocentesMinAggregateInputType = {
    id?: true
    apellidos?: true
    nombres?: true
    telefono?: true
    email?: true
    institucion_id?: true
    sede_id?: true
    activo?: true
    created_at?: true
    updated_at?: true
  }

  export type DocentesMaxAggregateInputType = {
    id?: true
    apellidos?: true
    nombres?: true
    telefono?: true
    email?: true
    institucion_id?: true
    sede_id?: true
    activo?: true
    created_at?: true
    updated_at?: true
  }

  export type DocentesCountAggregateInputType = {
    id?: true
    apellidos?: true
    nombres?: true
    telefono?: true
    email?: true
    institucion_id?: true
    sede_id?: true
    activo?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type DocentesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Docentes to aggregate.
     */
    where?: DocentesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Docentes to fetch.
     */
    orderBy?: DocentesOrderByWithRelationInput | DocentesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DocentesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Docentes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Docentes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Docentes
    **/
    _count?: true | DocentesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DocentesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DocentesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DocentesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DocentesMaxAggregateInputType
  }

  export type GetDocentesAggregateType<T extends DocentesAggregateArgs> = {
        [P in keyof T & keyof AggregateDocentes]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDocentes[P]>
      : GetScalarType<T[P], AggregateDocentes[P]>
  }




  export type DocentesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocentesWhereInput
    orderBy?: DocentesOrderByWithAggregationInput | DocentesOrderByWithAggregationInput[]
    by: DocentesScalarFieldEnum[] | DocentesScalarFieldEnum
    having?: DocentesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DocentesCountAggregateInputType | true
    _avg?: DocentesAvgAggregateInputType
    _sum?: DocentesSumAggregateInputType
    _min?: DocentesMinAggregateInputType
    _max?: DocentesMaxAggregateInputType
  }

  export type DocentesGroupByOutputType = {
    id: number
    apellidos: string
    nombres: string
    telefono: string
    email: string
    institucion_id: number
    sede_id: number | null
    activo: boolean
    created_at: Date
    updated_at: Date
    _count: DocentesCountAggregateOutputType | null
    _avg: DocentesAvgAggregateOutputType | null
    _sum: DocentesSumAggregateOutputType | null
    _min: DocentesMinAggregateOutputType | null
    _max: DocentesMaxAggregateOutputType | null
  }

  type GetDocentesGroupByPayload<T extends DocentesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DocentesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DocentesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DocentesGroupByOutputType[P]>
            : GetScalarType<T[P], DocentesGroupByOutputType[P]>
        }
      >
    >


  export type DocentesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    apellidos?: boolean
    nombres?: boolean
    telefono?: boolean
    email?: boolean
    institucion_id?: boolean
    sede_id?: boolean
    activo?: boolean
    created_at?: boolean
    updated_at?: boolean
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    sede?: boolean | Docentes$sedeArgs<ExtArgs>
    docenteAsignaciones?: boolean | Docentes$docenteAsignacionesArgs<ExtArgs>
    _count?: boolean | DocentesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["docentes"]>

  export type DocentesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    apellidos?: boolean
    nombres?: boolean
    telefono?: boolean
    email?: boolean
    institucion_id?: boolean
    sede_id?: boolean
    activo?: boolean
    created_at?: boolean
    updated_at?: boolean
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    sede?: boolean | Docentes$sedeArgs<ExtArgs>
  }, ExtArgs["result"]["docentes"]>

  export type DocentesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    apellidos?: boolean
    nombres?: boolean
    telefono?: boolean
    email?: boolean
    institucion_id?: boolean
    sede_id?: boolean
    activo?: boolean
    created_at?: boolean
    updated_at?: boolean
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    sede?: boolean | Docentes$sedeArgs<ExtArgs>
  }, ExtArgs["result"]["docentes"]>

  export type DocentesSelectScalar = {
    id?: boolean
    apellidos?: boolean
    nombres?: boolean
    telefono?: boolean
    email?: boolean
    institucion_id?: boolean
    sede_id?: boolean
    activo?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type DocentesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "apellidos" | "nombres" | "telefono" | "email" | "institucion_id" | "sede_id" | "activo" | "created_at" | "updated_at", ExtArgs["result"]["docentes"]>
  export type DocentesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    sede?: boolean | Docentes$sedeArgs<ExtArgs>
    docenteAsignaciones?: boolean | Docentes$docenteAsignacionesArgs<ExtArgs>
    _count?: boolean | DocentesCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DocentesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    sede?: boolean | Docentes$sedeArgs<ExtArgs>
  }
  export type DocentesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
    sede?: boolean | Docentes$sedeArgs<ExtArgs>
  }

  export type $DocentesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Docentes"
    objects: {
      institucion: Prisma.$InstitucionesPayload<ExtArgs>
      sede: Prisma.$SedesPayload<ExtArgs> | null
      docenteAsignaciones: Prisma.$DocenteAsignacionesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      apellidos: string
      nombres: string
      telefono: string
      email: string
      institucion_id: number
      sede_id: number | null
      activo: boolean
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["docentes"]>
    composites: {}
  }

  type DocentesGetPayload<S extends boolean | null | undefined | DocentesDefaultArgs> = $Result.GetResult<Prisma.$DocentesPayload, S>

  type DocentesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DocentesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DocentesCountAggregateInputType | true
    }

  export interface DocentesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Docentes'], meta: { name: 'Docentes' } }
    /**
     * Find zero or one Docentes that matches the filter.
     * @param {DocentesFindUniqueArgs} args - Arguments to find a Docentes
     * @example
     * // Get one Docentes
     * const docentes = await prisma.docentes.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DocentesFindUniqueArgs>(args: SelectSubset<T, DocentesFindUniqueArgs<ExtArgs>>): Prisma__DocentesClient<$Result.GetResult<Prisma.$DocentesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Docentes that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DocentesFindUniqueOrThrowArgs} args - Arguments to find a Docentes
     * @example
     * // Get one Docentes
     * const docentes = await prisma.docentes.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DocentesFindUniqueOrThrowArgs>(args: SelectSubset<T, DocentesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DocentesClient<$Result.GetResult<Prisma.$DocentesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Docentes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocentesFindFirstArgs} args - Arguments to find a Docentes
     * @example
     * // Get one Docentes
     * const docentes = await prisma.docentes.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DocentesFindFirstArgs>(args?: SelectSubset<T, DocentesFindFirstArgs<ExtArgs>>): Prisma__DocentesClient<$Result.GetResult<Prisma.$DocentesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Docentes that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocentesFindFirstOrThrowArgs} args - Arguments to find a Docentes
     * @example
     * // Get one Docentes
     * const docentes = await prisma.docentes.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DocentesFindFirstOrThrowArgs>(args?: SelectSubset<T, DocentesFindFirstOrThrowArgs<ExtArgs>>): Prisma__DocentesClient<$Result.GetResult<Prisma.$DocentesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Docentes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocentesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Docentes
     * const docentes = await prisma.docentes.findMany()
     * 
     * // Get first 10 Docentes
     * const docentes = await prisma.docentes.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const docentesWithIdOnly = await prisma.docentes.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DocentesFindManyArgs>(args?: SelectSubset<T, DocentesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocentesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Docentes.
     * @param {DocentesCreateArgs} args - Arguments to create a Docentes.
     * @example
     * // Create one Docentes
     * const Docentes = await prisma.docentes.create({
     *   data: {
     *     // ... data to create a Docentes
     *   }
     * })
     * 
     */
    create<T extends DocentesCreateArgs>(args: SelectSubset<T, DocentesCreateArgs<ExtArgs>>): Prisma__DocentesClient<$Result.GetResult<Prisma.$DocentesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Docentes.
     * @param {DocentesCreateManyArgs} args - Arguments to create many Docentes.
     * @example
     * // Create many Docentes
     * const docentes = await prisma.docentes.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DocentesCreateManyArgs>(args?: SelectSubset<T, DocentesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Docentes and returns the data saved in the database.
     * @param {DocentesCreateManyAndReturnArgs} args - Arguments to create many Docentes.
     * @example
     * // Create many Docentes
     * const docentes = await prisma.docentes.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Docentes and only return the `id`
     * const docentesWithIdOnly = await prisma.docentes.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DocentesCreateManyAndReturnArgs>(args?: SelectSubset<T, DocentesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocentesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Docentes.
     * @param {DocentesDeleteArgs} args - Arguments to delete one Docentes.
     * @example
     * // Delete one Docentes
     * const Docentes = await prisma.docentes.delete({
     *   where: {
     *     // ... filter to delete one Docentes
     *   }
     * })
     * 
     */
    delete<T extends DocentesDeleteArgs>(args: SelectSubset<T, DocentesDeleteArgs<ExtArgs>>): Prisma__DocentesClient<$Result.GetResult<Prisma.$DocentesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Docentes.
     * @param {DocentesUpdateArgs} args - Arguments to update one Docentes.
     * @example
     * // Update one Docentes
     * const docentes = await prisma.docentes.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DocentesUpdateArgs>(args: SelectSubset<T, DocentesUpdateArgs<ExtArgs>>): Prisma__DocentesClient<$Result.GetResult<Prisma.$DocentesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Docentes.
     * @param {DocentesDeleteManyArgs} args - Arguments to filter Docentes to delete.
     * @example
     * // Delete a few Docentes
     * const { count } = await prisma.docentes.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DocentesDeleteManyArgs>(args?: SelectSubset<T, DocentesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Docentes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocentesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Docentes
     * const docentes = await prisma.docentes.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DocentesUpdateManyArgs>(args: SelectSubset<T, DocentesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Docentes and returns the data updated in the database.
     * @param {DocentesUpdateManyAndReturnArgs} args - Arguments to update many Docentes.
     * @example
     * // Update many Docentes
     * const docentes = await prisma.docentes.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Docentes and only return the `id`
     * const docentesWithIdOnly = await prisma.docentes.updateManyAndReturn({
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
    updateManyAndReturn<T extends DocentesUpdateManyAndReturnArgs>(args: SelectSubset<T, DocentesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocentesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Docentes.
     * @param {DocentesUpsertArgs} args - Arguments to update or create a Docentes.
     * @example
     * // Update or create a Docentes
     * const docentes = await prisma.docentes.upsert({
     *   create: {
     *     // ... data to create a Docentes
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Docentes we want to update
     *   }
     * })
     */
    upsert<T extends DocentesUpsertArgs>(args: SelectSubset<T, DocentesUpsertArgs<ExtArgs>>): Prisma__DocentesClient<$Result.GetResult<Prisma.$DocentesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Docentes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocentesCountArgs} args - Arguments to filter Docentes to count.
     * @example
     * // Count the number of Docentes
     * const count = await prisma.docentes.count({
     *   where: {
     *     // ... the filter for the Docentes we want to count
     *   }
     * })
    **/
    count<T extends DocentesCountArgs>(
      args?: Subset<T, DocentesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DocentesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Docentes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocentesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DocentesAggregateArgs>(args: Subset<T, DocentesAggregateArgs>): Prisma.PrismaPromise<GetDocentesAggregateType<T>>

    /**
     * Group by Docentes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocentesGroupByArgs} args - Group by arguments.
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
      T extends DocentesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DocentesGroupByArgs['orderBy'] }
        : { orderBy?: DocentesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DocentesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocentesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Docentes model
   */
  readonly fields: DocentesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Docentes.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DocentesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    institucion<T extends InstitucionesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InstitucionesDefaultArgs<ExtArgs>>): Prisma__InstitucionesClient<$Result.GetResult<Prisma.$InstitucionesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    sede<T extends Docentes$sedeArgs<ExtArgs> = {}>(args?: Subset<T, Docentes$sedeArgs<ExtArgs>>): Prisma__SedesClient<$Result.GetResult<Prisma.$SedesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    docenteAsignaciones<T extends Docentes$docenteAsignacionesArgs<ExtArgs> = {}>(args?: Subset<T, Docentes$docenteAsignacionesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocenteAsignacionesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Docentes model
   */
  interface DocentesFieldRefs {
    readonly id: FieldRef<"Docentes", 'Int'>
    readonly apellidos: FieldRef<"Docentes", 'String'>
    readonly nombres: FieldRef<"Docentes", 'String'>
    readonly telefono: FieldRef<"Docentes", 'String'>
    readonly email: FieldRef<"Docentes", 'String'>
    readonly institucion_id: FieldRef<"Docentes", 'Int'>
    readonly sede_id: FieldRef<"Docentes", 'Int'>
    readonly activo: FieldRef<"Docentes", 'Boolean'>
    readonly created_at: FieldRef<"Docentes", 'DateTime'>
    readonly updated_at: FieldRef<"Docentes", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Docentes findUnique
   */
  export type DocentesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Docentes
     */
    select?: DocentesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Docentes
     */
    omit?: DocentesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocentesInclude<ExtArgs> | null
    /**
     * Filter, which Docentes to fetch.
     */
    where: DocentesWhereUniqueInput
  }

  /**
   * Docentes findUniqueOrThrow
   */
  export type DocentesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Docentes
     */
    select?: DocentesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Docentes
     */
    omit?: DocentesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocentesInclude<ExtArgs> | null
    /**
     * Filter, which Docentes to fetch.
     */
    where: DocentesWhereUniqueInput
  }

  /**
   * Docentes findFirst
   */
  export type DocentesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Docentes
     */
    select?: DocentesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Docentes
     */
    omit?: DocentesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocentesInclude<ExtArgs> | null
    /**
     * Filter, which Docentes to fetch.
     */
    where?: DocentesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Docentes to fetch.
     */
    orderBy?: DocentesOrderByWithRelationInput | DocentesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Docentes.
     */
    cursor?: DocentesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Docentes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Docentes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Docentes.
     */
    distinct?: DocentesScalarFieldEnum | DocentesScalarFieldEnum[]
  }

  /**
   * Docentes findFirstOrThrow
   */
  export type DocentesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Docentes
     */
    select?: DocentesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Docentes
     */
    omit?: DocentesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocentesInclude<ExtArgs> | null
    /**
     * Filter, which Docentes to fetch.
     */
    where?: DocentesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Docentes to fetch.
     */
    orderBy?: DocentesOrderByWithRelationInput | DocentesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Docentes.
     */
    cursor?: DocentesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Docentes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Docentes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Docentes.
     */
    distinct?: DocentesScalarFieldEnum | DocentesScalarFieldEnum[]
  }

  /**
   * Docentes findMany
   */
  export type DocentesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Docentes
     */
    select?: DocentesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Docentes
     */
    omit?: DocentesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocentesInclude<ExtArgs> | null
    /**
     * Filter, which Docentes to fetch.
     */
    where?: DocentesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Docentes to fetch.
     */
    orderBy?: DocentesOrderByWithRelationInput | DocentesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Docentes.
     */
    cursor?: DocentesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Docentes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Docentes.
     */
    skip?: number
    distinct?: DocentesScalarFieldEnum | DocentesScalarFieldEnum[]
  }

  /**
   * Docentes create
   */
  export type DocentesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Docentes
     */
    select?: DocentesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Docentes
     */
    omit?: DocentesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocentesInclude<ExtArgs> | null
    /**
     * The data needed to create a Docentes.
     */
    data: XOR<DocentesCreateInput, DocentesUncheckedCreateInput>
  }

  /**
   * Docentes createMany
   */
  export type DocentesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Docentes.
     */
    data: DocentesCreateManyInput | DocentesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Docentes createManyAndReturn
   */
  export type DocentesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Docentes
     */
    select?: DocentesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Docentes
     */
    omit?: DocentesOmit<ExtArgs> | null
    /**
     * The data used to create many Docentes.
     */
    data: DocentesCreateManyInput | DocentesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocentesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Docentes update
   */
  export type DocentesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Docentes
     */
    select?: DocentesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Docentes
     */
    omit?: DocentesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocentesInclude<ExtArgs> | null
    /**
     * The data needed to update a Docentes.
     */
    data: XOR<DocentesUpdateInput, DocentesUncheckedUpdateInput>
    /**
     * Choose, which Docentes to update.
     */
    where: DocentesWhereUniqueInput
  }

  /**
   * Docentes updateMany
   */
  export type DocentesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Docentes.
     */
    data: XOR<DocentesUpdateManyMutationInput, DocentesUncheckedUpdateManyInput>
    /**
     * Filter which Docentes to update
     */
    where?: DocentesWhereInput
    /**
     * Limit how many Docentes to update.
     */
    limit?: number
  }

  /**
   * Docentes updateManyAndReturn
   */
  export type DocentesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Docentes
     */
    select?: DocentesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Docentes
     */
    omit?: DocentesOmit<ExtArgs> | null
    /**
     * The data used to update Docentes.
     */
    data: XOR<DocentesUpdateManyMutationInput, DocentesUncheckedUpdateManyInput>
    /**
     * Filter which Docentes to update
     */
    where?: DocentesWhereInput
    /**
     * Limit how many Docentes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocentesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Docentes upsert
   */
  export type DocentesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Docentes
     */
    select?: DocentesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Docentes
     */
    omit?: DocentesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocentesInclude<ExtArgs> | null
    /**
     * The filter to search for the Docentes to update in case it exists.
     */
    where: DocentesWhereUniqueInput
    /**
     * In case the Docentes found by the `where` argument doesn't exist, create a new Docentes with this data.
     */
    create: XOR<DocentesCreateInput, DocentesUncheckedCreateInput>
    /**
     * In case the Docentes was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DocentesUpdateInput, DocentesUncheckedUpdateInput>
  }

  /**
   * Docentes delete
   */
  export type DocentesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Docentes
     */
    select?: DocentesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Docentes
     */
    omit?: DocentesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocentesInclude<ExtArgs> | null
    /**
     * Filter which Docentes to delete.
     */
    where: DocentesWhereUniqueInput
  }

  /**
   * Docentes deleteMany
   */
  export type DocentesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Docentes to delete
     */
    where?: DocentesWhereInput
    /**
     * Limit how many Docentes to delete.
     */
    limit?: number
  }

  /**
   * Docentes.sede
   */
  export type Docentes$sedeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Docentes.docenteAsignaciones
   */
  export type Docentes$docenteAsignacionesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocenteAsignaciones
     */
    select?: DocenteAsignacionesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocenteAsignaciones
     */
    omit?: DocenteAsignacionesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocenteAsignacionesInclude<ExtArgs> | null
    where?: DocenteAsignacionesWhereInput
    orderBy?: DocenteAsignacionesOrderByWithRelationInput | DocenteAsignacionesOrderByWithRelationInput[]
    cursor?: DocenteAsignacionesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DocenteAsignacionesScalarFieldEnum | DocenteAsignacionesScalarFieldEnum[]
  }

  /**
   * Docentes without action
   */
  export type DocentesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Docentes
     */
    select?: DocentesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Docentes
     */
    omit?: DocentesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocentesInclude<ExtArgs> | null
  }


  /**
   * Model DocenteAsignaciones
   */

  export type AggregateDocenteAsignaciones = {
    _count: DocenteAsignacionesCountAggregateOutputType | null
    _avg: DocenteAsignacionesAvgAggregateOutputType | null
    _sum: DocenteAsignacionesSumAggregateOutputType | null
    _min: DocenteAsignacionesMinAggregateOutputType | null
    _max: DocenteAsignacionesMaxAggregateOutputType | null
  }

  export type DocenteAsignacionesAvgAggregateOutputType = {
    id: number | null
    docente_id: number | null
    curso_id: number | null
    materia_id: number | null
  }

  export type DocenteAsignacionesSumAggregateOutputType = {
    id: number | null
    docente_id: number | null
    curso_id: number | null
    materia_id: number | null
  }

  export type DocenteAsignacionesMinAggregateOutputType = {
    id: number | null
    docente_id: number | null
    curso_id: number | null
    materia_id: number | null
    created_at: Date | null
  }

  export type DocenteAsignacionesMaxAggregateOutputType = {
    id: number | null
    docente_id: number | null
    curso_id: number | null
    materia_id: number | null
    created_at: Date | null
  }

  export type DocenteAsignacionesCountAggregateOutputType = {
    id: number
    docente_id: number
    curso_id: number
    materia_id: number
    created_at: number
    _all: number
  }


  export type DocenteAsignacionesAvgAggregateInputType = {
    id?: true
    docente_id?: true
    curso_id?: true
    materia_id?: true
  }

  export type DocenteAsignacionesSumAggregateInputType = {
    id?: true
    docente_id?: true
    curso_id?: true
    materia_id?: true
  }

  export type DocenteAsignacionesMinAggregateInputType = {
    id?: true
    docente_id?: true
    curso_id?: true
    materia_id?: true
    created_at?: true
  }

  export type DocenteAsignacionesMaxAggregateInputType = {
    id?: true
    docente_id?: true
    curso_id?: true
    materia_id?: true
    created_at?: true
  }

  export type DocenteAsignacionesCountAggregateInputType = {
    id?: true
    docente_id?: true
    curso_id?: true
    materia_id?: true
    created_at?: true
    _all?: true
  }

  export type DocenteAsignacionesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DocenteAsignaciones to aggregate.
     */
    where?: DocenteAsignacionesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DocenteAsignaciones to fetch.
     */
    orderBy?: DocenteAsignacionesOrderByWithRelationInput | DocenteAsignacionesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DocenteAsignacionesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DocenteAsignaciones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DocenteAsignaciones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DocenteAsignaciones
    **/
    _count?: true | DocenteAsignacionesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DocenteAsignacionesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DocenteAsignacionesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DocenteAsignacionesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DocenteAsignacionesMaxAggregateInputType
  }

  export type GetDocenteAsignacionesAggregateType<T extends DocenteAsignacionesAggregateArgs> = {
        [P in keyof T & keyof AggregateDocenteAsignaciones]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDocenteAsignaciones[P]>
      : GetScalarType<T[P], AggregateDocenteAsignaciones[P]>
  }




  export type DocenteAsignacionesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocenteAsignacionesWhereInput
    orderBy?: DocenteAsignacionesOrderByWithAggregationInput | DocenteAsignacionesOrderByWithAggregationInput[]
    by: DocenteAsignacionesScalarFieldEnum[] | DocenteAsignacionesScalarFieldEnum
    having?: DocenteAsignacionesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DocenteAsignacionesCountAggregateInputType | true
    _avg?: DocenteAsignacionesAvgAggregateInputType
    _sum?: DocenteAsignacionesSumAggregateInputType
    _min?: DocenteAsignacionesMinAggregateInputType
    _max?: DocenteAsignacionesMaxAggregateInputType
  }

  export type DocenteAsignacionesGroupByOutputType = {
    id: number
    docente_id: number
    curso_id: number
    materia_id: number
    created_at: Date
    _count: DocenteAsignacionesCountAggregateOutputType | null
    _avg: DocenteAsignacionesAvgAggregateOutputType | null
    _sum: DocenteAsignacionesSumAggregateOutputType | null
    _min: DocenteAsignacionesMinAggregateOutputType | null
    _max: DocenteAsignacionesMaxAggregateOutputType | null
  }

  type GetDocenteAsignacionesGroupByPayload<T extends DocenteAsignacionesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DocenteAsignacionesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DocenteAsignacionesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DocenteAsignacionesGroupByOutputType[P]>
            : GetScalarType<T[P], DocenteAsignacionesGroupByOutputType[P]>
        }
      >
    >


  export type DocenteAsignacionesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    docente_id?: boolean
    curso_id?: boolean
    materia_id?: boolean
    created_at?: boolean
    docente?: boolean | DocentesDefaultArgs<ExtArgs>
    curso?: boolean | CursosDefaultArgs<ExtArgs>
    materia?: boolean | MateriasDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["docenteAsignaciones"]>

  export type DocenteAsignacionesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    docente_id?: boolean
    curso_id?: boolean
    materia_id?: boolean
    created_at?: boolean
    docente?: boolean | DocentesDefaultArgs<ExtArgs>
    curso?: boolean | CursosDefaultArgs<ExtArgs>
    materia?: boolean | MateriasDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["docenteAsignaciones"]>

  export type DocenteAsignacionesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    docente_id?: boolean
    curso_id?: boolean
    materia_id?: boolean
    created_at?: boolean
    docente?: boolean | DocentesDefaultArgs<ExtArgs>
    curso?: boolean | CursosDefaultArgs<ExtArgs>
    materia?: boolean | MateriasDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["docenteAsignaciones"]>

  export type DocenteAsignacionesSelectScalar = {
    id?: boolean
    docente_id?: boolean
    curso_id?: boolean
    materia_id?: boolean
    created_at?: boolean
  }

  export type DocenteAsignacionesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "docente_id" | "curso_id" | "materia_id" | "created_at", ExtArgs["result"]["docenteAsignaciones"]>
  export type DocenteAsignacionesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    docente?: boolean | DocentesDefaultArgs<ExtArgs>
    curso?: boolean | CursosDefaultArgs<ExtArgs>
    materia?: boolean | MateriasDefaultArgs<ExtArgs>
  }
  export type DocenteAsignacionesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    docente?: boolean | DocentesDefaultArgs<ExtArgs>
    curso?: boolean | CursosDefaultArgs<ExtArgs>
    materia?: boolean | MateriasDefaultArgs<ExtArgs>
  }
  export type DocenteAsignacionesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    docente?: boolean | DocentesDefaultArgs<ExtArgs>
    curso?: boolean | CursosDefaultArgs<ExtArgs>
    materia?: boolean | MateriasDefaultArgs<ExtArgs>
  }

  export type $DocenteAsignacionesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DocenteAsignaciones"
    objects: {
      docente: Prisma.$DocentesPayload<ExtArgs>
      curso: Prisma.$CursosPayload<ExtArgs>
      materia: Prisma.$MateriasPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      docente_id: number
      curso_id: number
      materia_id: number
      created_at: Date
    }, ExtArgs["result"]["docenteAsignaciones"]>
    composites: {}
  }

  type DocenteAsignacionesGetPayload<S extends boolean | null | undefined | DocenteAsignacionesDefaultArgs> = $Result.GetResult<Prisma.$DocenteAsignacionesPayload, S>

  type DocenteAsignacionesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DocenteAsignacionesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DocenteAsignacionesCountAggregateInputType | true
    }

  export interface DocenteAsignacionesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DocenteAsignaciones'], meta: { name: 'DocenteAsignaciones' } }
    /**
     * Find zero or one DocenteAsignaciones that matches the filter.
     * @param {DocenteAsignacionesFindUniqueArgs} args - Arguments to find a DocenteAsignaciones
     * @example
     * // Get one DocenteAsignaciones
     * const docenteAsignaciones = await prisma.docenteAsignaciones.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DocenteAsignacionesFindUniqueArgs>(args: SelectSubset<T, DocenteAsignacionesFindUniqueArgs<ExtArgs>>): Prisma__DocenteAsignacionesClient<$Result.GetResult<Prisma.$DocenteAsignacionesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DocenteAsignaciones that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DocenteAsignacionesFindUniqueOrThrowArgs} args - Arguments to find a DocenteAsignaciones
     * @example
     * // Get one DocenteAsignaciones
     * const docenteAsignaciones = await prisma.docenteAsignaciones.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DocenteAsignacionesFindUniqueOrThrowArgs>(args: SelectSubset<T, DocenteAsignacionesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DocenteAsignacionesClient<$Result.GetResult<Prisma.$DocenteAsignacionesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DocenteAsignaciones that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocenteAsignacionesFindFirstArgs} args - Arguments to find a DocenteAsignaciones
     * @example
     * // Get one DocenteAsignaciones
     * const docenteAsignaciones = await prisma.docenteAsignaciones.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DocenteAsignacionesFindFirstArgs>(args?: SelectSubset<T, DocenteAsignacionesFindFirstArgs<ExtArgs>>): Prisma__DocenteAsignacionesClient<$Result.GetResult<Prisma.$DocenteAsignacionesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DocenteAsignaciones that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocenteAsignacionesFindFirstOrThrowArgs} args - Arguments to find a DocenteAsignaciones
     * @example
     * // Get one DocenteAsignaciones
     * const docenteAsignaciones = await prisma.docenteAsignaciones.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DocenteAsignacionesFindFirstOrThrowArgs>(args?: SelectSubset<T, DocenteAsignacionesFindFirstOrThrowArgs<ExtArgs>>): Prisma__DocenteAsignacionesClient<$Result.GetResult<Prisma.$DocenteAsignacionesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DocenteAsignaciones that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocenteAsignacionesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DocenteAsignaciones
     * const docenteAsignaciones = await prisma.docenteAsignaciones.findMany()
     * 
     * // Get first 10 DocenteAsignaciones
     * const docenteAsignaciones = await prisma.docenteAsignaciones.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const docenteAsignacionesWithIdOnly = await prisma.docenteAsignaciones.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DocenteAsignacionesFindManyArgs>(args?: SelectSubset<T, DocenteAsignacionesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocenteAsignacionesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DocenteAsignaciones.
     * @param {DocenteAsignacionesCreateArgs} args - Arguments to create a DocenteAsignaciones.
     * @example
     * // Create one DocenteAsignaciones
     * const DocenteAsignaciones = await prisma.docenteAsignaciones.create({
     *   data: {
     *     // ... data to create a DocenteAsignaciones
     *   }
     * })
     * 
     */
    create<T extends DocenteAsignacionesCreateArgs>(args: SelectSubset<T, DocenteAsignacionesCreateArgs<ExtArgs>>): Prisma__DocenteAsignacionesClient<$Result.GetResult<Prisma.$DocenteAsignacionesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DocenteAsignaciones.
     * @param {DocenteAsignacionesCreateManyArgs} args - Arguments to create many DocenteAsignaciones.
     * @example
     * // Create many DocenteAsignaciones
     * const docenteAsignaciones = await prisma.docenteAsignaciones.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DocenteAsignacionesCreateManyArgs>(args?: SelectSubset<T, DocenteAsignacionesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DocenteAsignaciones and returns the data saved in the database.
     * @param {DocenteAsignacionesCreateManyAndReturnArgs} args - Arguments to create many DocenteAsignaciones.
     * @example
     * // Create many DocenteAsignaciones
     * const docenteAsignaciones = await prisma.docenteAsignaciones.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DocenteAsignaciones and only return the `id`
     * const docenteAsignacionesWithIdOnly = await prisma.docenteAsignaciones.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DocenteAsignacionesCreateManyAndReturnArgs>(args?: SelectSubset<T, DocenteAsignacionesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocenteAsignacionesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DocenteAsignaciones.
     * @param {DocenteAsignacionesDeleteArgs} args - Arguments to delete one DocenteAsignaciones.
     * @example
     * // Delete one DocenteAsignaciones
     * const DocenteAsignaciones = await prisma.docenteAsignaciones.delete({
     *   where: {
     *     // ... filter to delete one DocenteAsignaciones
     *   }
     * })
     * 
     */
    delete<T extends DocenteAsignacionesDeleteArgs>(args: SelectSubset<T, DocenteAsignacionesDeleteArgs<ExtArgs>>): Prisma__DocenteAsignacionesClient<$Result.GetResult<Prisma.$DocenteAsignacionesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DocenteAsignaciones.
     * @param {DocenteAsignacionesUpdateArgs} args - Arguments to update one DocenteAsignaciones.
     * @example
     * // Update one DocenteAsignaciones
     * const docenteAsignaciones = await prisma.docenteAsignaciones.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DocenteAsignacionesUpdateArgs>(args: SelectSubset<T, DocenteAsignacionesUpdateArgs<ExtArgs>>): Prisma__DocenteAsignacionesClient<$Result.GetResult<Prisma.$DocenteAsignacionesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DocenteAsignaciones.
     * @param {DocenteAsignacionesDeleteManyArgs} args - Arguments to filter DocenteAsignaciones to delete.
     * @example
     * // Delete a few DocenteAsignaciones
     * const { count } = await prisma.docenteAsignaciones.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DocenteAsignacionesDeleteManyArgs>(args?: SelectSubset<T, DocenteAsignacionesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DocenteAsignaciones.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocenteAsignacionesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DocenteAsignaciones
     * const docenteAsignaciones = await prisma.docenteAsignaciones.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DocenteAsignacionesUpdateManyArgs>(args: SelectSubset<T, DocenteAsignacionesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DocenteAsignaciones and returns the data updated in the database.
     * @param {DocenteAsignacionesUpdateManyAndReturnArgs} args - Arguments to update many DocenteAsignaciones.
     * @example
     * // Update many DocenteAsignaciones
     * const docenteAsignaciones = await prisma.docenteAsignaciones.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DocenteAsignaciones and only return the `id`
     * const docenteAsignacionesWithIdOnly = await prisma.docenteAsignaciones.updateManyAndReturn({
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
    updateManyAndReturn<T extends DocenteAsignacionesUpdateManyAndReturnArgs>(args: SelectSubset<T, DocenteAsignacionesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocenteAsignacionesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DocenteAsignaciones.
     * @param {DocenteAsignacionesUpsertArgs} args - Arguments to update or create a DocenteAsignaciones.
     * @example
     * // Update or create a DocenteAsignaciones
     * const docenteAsignaciones = await prisma.docenteAsignaciones.upsert({
     *   create: {
     *     // ... data to create a DocenteAsignaciones
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DocenteAsignaciones we want to update
     *   }
     * })
     */
    upsert<T extends DocenteAsignacionesUpsertArgs>(args: SelectSubset<T, DocenteAsignacionesUpsertArgs<ExtArgs>>): Prisma__DocenteAsignacionesClient<$Result.GetResult<Prisma.$DocenteAsignacionesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DocenteAsignaciones.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocenteAsignacionesCountArgs} args - Arguments to filter DocenteAsignaciones to count.
     * @example
     * // Count the number of DocenteAsignaciones
     * const count = await prisma.docenteAsignaciones.count({
     *   where: {
     *     // ... the filter for the DocenteAsignaciones we want to count
     *   }
     * })
    **/
    count<T extends DocenteAsignacionesCountArgs>(
      args?: Subset<T, DocenteAsignacionesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DocenteAsignacionesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DocenteAsignaciones.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocenteAsignacionesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DocenteAsignacionesAggregateArgs>(args: Subset<T, DocenteAsignacionesAggregateArgs>): Prisma.PrismaPromise<GetDocenteAsignacionesAggregateType<T>>

    /**
     * Group by DocenteAsignaciones.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocenteAsignacionesGroupByArgs} args - Group by arguments.
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
      T extends DocenteAsignacionesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DocenteAsignacionesGroupByArgs['orderBy'] }
        : { orderBy?: DocenteAsignacionesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DocenteAsignacionesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocenteAsignacionesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DocenteAsignaciones model
   */
  readonly fields: DocenteAsignacionesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DocenteAsignaciones.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DocenteAsignacionesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    docente<T extends DocentesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DocentesDefaultArgs<ExtArgs>>): Prisma__DocentesClient<$Result.GetResult<Prisma.$DocentesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    curso<T extends CursosDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CursosDefaultArgs<ExtArgs>>): Prisma__CursosClient<$Result.GetResult<Prisma.$CursosPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    materia<T extends MateriasDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MateriasDefaultArgs<ExtArgs>>): Prisma__MateriasClient<$Result.GetResult<Prisma.$MateriasPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the DocenteAsignaciones model
   */
  interface DocenteAsignacionesFieldRefs {
    readonly id: FieldRef<"DocenteAsignaciones", 'Int'>
    readonly docente_id: FieldRef<"DocenteAsignaciones", 'Int'>
    readonly curso_id: FieldRef<"DocenteAsignaciones", 'Int'>
    readonly materia_id: FieldRef<"DocenteAsignaciones", 'Int'>
    readonly created_at: FieldRef<"DocenteAsignaciones", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DocenteAsignaciones findUnique
   */
  export type DocenteAsignacionesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocenteAsignaciones
     */
    select?: DocenteAsignacionesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocenteAsignaciones
     */
    omit?: DocenteAsignacionesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocenteAsignacionesInclude<ExtArgs> | null
    /**
     * Filter, which DocenteAsignaciones to fetch.
     */
    where: DocenteAsignacionesWhereUniqueInput
  }

  /**
   * DocenteAsignaciones findUniqueOrThrow
   */
  export type DocenteAsignacionesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocenteAsignaciones
     */
    select?: DocenteAsignacionesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocenteAsignaciones
     */
    omit?: DocenteAsignacionesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocenteAsignacionesInclude<ExtArgs> | null
    /**
     * Filter, which DocenteAsignaciones to fetch.
     */
    where: DocenteAsignacionesWhereUniqueInput
  }

  /**
   * DocenteAsignaciones findFirst
   */
  export type DocenteAsignacionesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocenteAsignaciones
     */
    select?: DocenteAsignacionesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocenteAsignaciones
     */
    omit?: DocenteAsignacionesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocenteAsignacionesInclude<ExtArgs> | null
    /**
     * Filter, which DocenteAsignaciones to fetch.
     */
    where?: DocenteAsignacionesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DocenteAsignaciones to fetch.
     */
    orderBy?: DocenteAsignacionesOrderByWithRelationInput | DocenteAsignacionesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DocenteAsignaciones.
     */
    cursor?: DocenteAsignacionesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DocenteAsignaciones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DocenteAsignaciones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DocenteAsignaciones.
     */
    distinct?: DocenteAsignacionesScalarFieldEnum | DocenteAsignacionesScalarFieldEnum[]
  }

  /**
   * DocenteAsignaciones findFirstOrThrow
   */
  export type DocenteAsignacionesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocenteAsignaciones
     */
    select?: DocenteAsignacionesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocenteAsignaciones
     */
    omit?: DocenteAsignacionesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocenteAsignacionesInclude<ExtArgs> | null
    /**
     * Filter, which DocenteAsignaciones to fetch.
     */
    where?: DocenteAsignacionesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DocenteAsignaciones to fetch.
     */
    orderBy?: DocenteAsignacionesOrderByWithRelationInput | DocenteAsignacionesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DocenteAsignaciones.
     */
    cursor?: DocenteAsignacionesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DocenteAsignaciones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DocenteAsignaciones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DocenteAsignaciones.
     */
    distinct?: DocenteAsignacionesScalarFieldEnum | DocenteAsignacionesScalarFieldEnum[]
  }

  /**
   * DocenteAsignaciones findMany
   */
  export type DocenteAsignacionesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocenteAsignaciones
     */
    select?: DocenteAsignacionesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocenteAsignaciones
     */
    omit?: DocenteAsignacionesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocenteAsignacionesInclude<ExtArgs> | null
    /**
     * Filter, which DocenteAsignaciones to fetch.
     */
    where?: DocenteAsignacionesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DocenteAsignaciones to fetch.
     */
    orderBy?: DocenteAsignacionesOrderByWithRelationInput | DocenteAsignacionesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DocenteAsignaciones.
     */
    cursor?: DocenteAsignacionesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DocenteAsignaciones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DocenteAsignaciones.
     */
    skip?: number
    distinct?: DocenteAsignacionesScalarFieldEnum | DocenteAsignacionesScalarFieldEnum[]
  }

  /**
   * DocenteAsignaciones create
   */
  export type DocenteAsignacionesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocenteAsignaciones
     */
    select?: DocenteAsignacionesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocenteAsignaciones
     */
    omit?: DocenteAsignacionesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocenteAsignacionesInclude<ExtArgs> | null
    /**
     * The data needed to create a DocenteAsignaciones.
     */
    data: XOR<DocenteAsignacionesCreateInput, DocenteAsignacionesUncheckedCreateInput>
  }

  /**
   * DocenteAsignaciones createMany
   */
  export type DocenteAsignacionesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DocenteAsignaciones.
     */
    data: DocenteAsignacionesCreateManyInput | DocenteAsignacionesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DocenteAsignaciones createManyAndReturn
   */
  export type DocenteAsignacionesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocenteAsignaciones
     */
    select?: DocenteAsignacionesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DocenteAsignaciones
     */
    omit?: DocenteAsignacionesOmit<ExtArgs> | null
    /**
     * The data used to create many DocenteAsignaciones.
     */
    data: DocenteAsignacionesCreateManyInput | DocenteAsignacionesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocenteAsignacionesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DocenteAsignaciones update
   */
  export type DocenteAsignacionesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocenteAsignaciones
     */
    select?: DocenteAsignacionesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocenteAsignaciones
     */
    omit?: DocenteAsignacionesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocenteAsignacionesInclude<ExtArgs> | null
    /**
     * The data needed to update a DocenteAsignaciones.
     */
    data: XOR<DocenteAsignacionesUpdateInput, DocenteAsignacionesUncheckedUpdateInput>
    /**
     * Choose, which DocenteAsignaciones to update.
     */
    where: DocenteAsignacionesWhereUniqueInput
  }

  /**
   * DocenteAsignaciones updateMany
   */
  export type DocenteAsignacionesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DocenteAsignaciones.
     */
    data: XOR<DocenteAsignacionesUpdateManyMutationInput, DocenteAsignacionesUncheckedUpdateManyInput>
    /**
     * Filter which DocenteAsignaciones to update
     */
    where?: DocenteAsignacionesWhereInput
    /**
     * Limit how many DocenteAsignaciones to update.
     */
    limit?: number
  }

  /**
   * DocenteAsignaciones updateManyAndReturn
   */
  export type DocenteAsignacionesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocenteAsignaciones
     */
    select?: DocenteAsignacionesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DocenteAsignaciones
     */
    omit?: DocenteAsignacionesOmit<ExtArgs> | null
    /**
     * The data used to update DocenteAsignaciones.
     */
    data: XOR<DocenteAsignacionesUpdateManyMutationInput, DocenteAsignacionesUncheckedUpdateManyInput>
    /**
     * Filter which DocenteAsignaciones to update
     */
    where?: DocenteAsignacionesWhereInput
    /**
     * Limit how many DocenteAsignaciones to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocenteAsignacionesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DocenteAsignaciones upsert
   */
  export type DocenteAsignacionesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocenteAsignaciones
     */
    select?: DocenteAsignacionesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocenteAsignaciones
     */
    omit?: DocenteAsignacionesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocenteAsignacionesInclude<ExtArgs> | null
    /**
     * The filter to search for the DocenteAsignaciones to update in case it exists.
     */
    where: DocenteAsignacionesWhereUniqueInput
    /**
     * In case the DocenteAsignaciones found by the `where` argument doesn't exist, create a new DocenteAsignaciones with this data.
     */
    create: XOR<DocenteAsignacionesCreateInput, DocenteAsignacionesUncheckedCreateInput>
    /**
     * In case the DocenteAsignaciones was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DocenteAsignacionesUpdateInput, DocenteAsignacionesUncheckedUpdateInput>
  }

  /**
   * DocenteAsignaciones delete
   */
  export type DocenteAsignacionesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocenteAsignaciones
     */
    select?: DocenteAsignacionesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocenteAsignaciones
     */
    omit?: DocenteAsignacionesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocenteAsignacionesInclude<ExtArgs> | null
    /**
     * Filter which DocenteAsignaciones to delete.
     */
    where: DocenteAsignacionesWhereUniqueInput
  }

  /**
   * DocenteAsignaciones deleteMany
   */
  export type DocenteAsignacionesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DocenteAsignaciones to delete
     */
    where?: DocenteAsignacionesWhereInput
    /**
     * Limit how many DocenteAsignaciones to delete.
     */
    limit?: number
  }

  /**
   * DocenteAsignaciones without action
   */
  export type DocenteAsignacionesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocenteAsignaciones
     */
    select?: DocenteAsignacionesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocenteAsignaciones
     */
    omit?: DocenteAsignacionesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocenteAsignacionesInclude<ExtArgs> | null
  }


  /**
   * Model Estudiantes
   */

  export type AggregateEstudiantes = {
    _count: EstudiantesCountAggregateOutputType | null
    _avg: EstudiantesAvgAggregateOutputType | null
    _sum: EstudiantesSumAggregateOutputType | null
    _min: EstudiantesMinAggregateOutputType | null
    _max: EstudiantesMaxAggregateOutputType | null
  }

  export type EstudiantesAvgAggregateOutputType = {
    id: number | null
    curso_id: number | null
    institucion_id: number | null
  }

  export type EstudiantesSumAggregateOutputType = {
    id: number | null
    curso_id: number | null
    institucion_id: number | null
  }

  export type EstudiantesMinAggregateOutputType = {
    id: number | null
    apellidos: string | null
    nombres: string | null
    codigo_estudiantil: string | null
    nombre_acudiente: string | null
    correo_acudiente: string | null
    telefono_acudiente: string | null
    curso_id: number | null
    institucion_id: number | null
    activo: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type EstudiantesMaxAggregateOutputType = {
    id: number | null
    apellidos: string | null
    nombres: string | null
    codigo_estudiantil: string | null
    nombre_acudiente: string | null
    correo_acudiente: string | null
    telefono_acudiente: string | null
    curso_id: number | null
    institucion_id: number | null
    activo: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type EstudiantesCountAggregateOutputType = {
    id: number
    apellidos: number
    nombres: number
    codigo_estudiantil: number
    nombre_acudiente: number
    correo_acudiente: number
    telefono_acudiente: number
    curso_id: number
    institucion_id: number
    activo: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type EstudiantesAvgAggregateInputType = {
    id?: true
    curso_id?: true
    institucion_id?: true
  }

  export type EstudiantesSumAggregateInputType = {
    id?: true
    curso_id?: true
    institucion_id?: true
  }

  export type EstudiantesMinAggregateInputType = {
    id?: true
    apellidos?: true
    nombres?: true
    codigo_estudiantil?: true
    nombre_acudiente?: true
    correo_acudiente?: true
    telefono_acudiente?: true
    curso_id?: true
    institucion_id?: true
    activo?: true
    created_at?: true
    updated_at?: true
  }

  export type EstudiantesMaxAggregateInputType = {
    id?: true
    apellidos?: true
    nombres?: true
    codigo_estudiantil?: true
    nombre_acudiente?: true
    correo_acudiente?: true
    telefono_acudiente?: true
    curso_id?: true
    institucion_id?: true
    activo?: true
    created_at?: true
    updated_at?: true
  }

  export type EstudiantesCountAggregateInputType = {
    id?: true
    apellidos?: true
    nombres?: true
    codigo_estudiantil?: true
    nombre_acudiente?: true
    correo_acudiente?: true
    telefono_acudiente?: true
    curso_id?: true
    institucion_id?: true
    activo?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type EstudiantesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Estudiantes to aggregate.
     */
    where?: EstudiantesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Estudiantes to fetch.
     */
    orderBy?: EstudiantesOrderByWithRelationInput | EstudiantesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EstudiantesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Estudiantes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Estudiantes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Estudiantes
    **/
    _count?: true | EstudiantesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EstudiantesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EstudiantesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EstudiantesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EstudiantesMaxAggregateInputType
  }

  export type GetEstudiantesAggregateType<T extends EstudiantesAggregateArgs> = {
        [P in keyof T & keyof AggregateEstudiantes]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEstudiantes[P]>
      : GetScalarType<T[P], AggregateEstudiantes[P]>
  }




  export type EstudiantesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EstudiantesWhereInput
    orderBy?: EstudiantesOrderByWithAggregationInput | EstudiantesOrderByWithAggregationInput[]
    by: EstudiantesScalarFieldEnum[] | EstudiantesScalarFieldEnum
    having?: EstudiantesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EstudiantesCountAggregateInputType | true
    _avg?: EstudiantesAvgAggregateInputType
    _sum?: EstudiantesSumAggregateInputType
    _min?: EstudiantesMinAggregateInputType
    _max?: EstudiantesMaxAggregateInputType
  }

  export type EstudiantesGroupByOutputType = {
    id: number
    apellidos: string
    nombres: string
    codigo_estudiantil: string
    nombre_acudiente: string
    correo_acudiente: string | null
    telefono_acudiente: string
    curso_id: number
    institucion_id: number
    activo: boolean
    created_at: Date
    updated_at: Date
    _count: EstudiantesCountAggregateOutputType | null
    _avg: EstudiantesAvgAggregateOutputType | null
    _sum: EstudiantesSumAggregateOutputType | null
    _min: EstudiantesMinAggregateOutputType | null
    _max: EstudiantesMaxAggregateOutputType | null
  }

  type GetEstudiantesGroupByPayload<T extends EstudiantesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EstudiantesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EstudiantesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EstudiantesGroupByOutputType[P]>
            : GetScalarType<T[P], EstudiantesGroupByOutputType[P]>
        }
      >
    >


  export type EstudiantesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    apellidos?: boolean
    nombres?: boolean
    codigo_estudiantil?: boolean
    nombre_acudiente?: boolean
    correo_acudiente?: boolean
    telefono_acudiente?: boolean
    curso_id?: boolean
    institucion_id?: boolean
    activo?: boolean
    created_at?: boolean
    updated_at?: boolean
    curso?: boolean | CursosDefaultArgs<ExtArgs>
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["estudiantes"]>

  export type EstudiantesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    apellidos?: boolean
    nombres?: boolean
    codigo_estudiantil?: boolean
    nombre_acudiente?: boolean
    correo_acudiente?: boolean
    telefono_acudiente?: boolean
    curso_id?: boolean
    institucion_id?: boolean
    activo?: boolean
    created_at?: boolean
    updated_at?: boolean
    curso?: boolean | CursosDefaultArgs<ExtArgs>
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["estudiantes"]>

  export type EstudiantesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    apellidos?: boolean
    nombres?: boolean
    codigo_estudiantil?: boolean
    nombre_acudiente?: boolean
    correo_acudiente?: boolean
    telefono_acudiente?: boolean
    curso_id?: boolean
    institucion_id?: boolean
    activo?: boolean
    created_at?: boolean
    updated_at?: boolean
    curso?: boolean | CursosDefaultArgs<ExtArgs>
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["estudiantes"]>

  export type EstudiantesSelectScalar = {
    id?: boolean
    apellidos?: boolean
    nombres?: boolean
    codigo_estudiantil?: boolean
    nombre_acudiente?: boolean
    correo_acudiente?: boolean
    telefono_acudiente?: boolean
    curso_id?: boolean
    institucion_id?: boolean
    activo?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type EstudiantesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "apellidos" | "nombres" | "codigo_estudiantil" | "nombre_acudiente" | "correo_acudiente" | "telefono_acudiente" | "curso_id" | "institucion_id" | "activo" | "created_at" | "updated_at", ExtArgs["result"]["estudiantes"]>
  export type EstudiantesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    curso?: boolean | CursosDefaultArgs<ExtArgs>
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
  }
  export type EstudiantesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    curso?: boolean | CursosDefaultArgs<ExtArgs>
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
  }
  export type EstudiantesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    curso?: boolean | CursosDefaultArgs<ExtArgs>
    institucion?: boolean | InstitucionesDefaultArgs<ExtArgs>
  }

  export type $EstudiantesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Estudiantes"
    objects: {
      curso: Prisma.$CursosPayload<ExtArgs>
      institucion: Prisma.$InstitucionesPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      apellidos: string
      nombres: string
      codigo_estudiantil: string
      nombre_acudiente: string
      correo_acudiente: string | null
      telefono_acudiente: string
      curso_id: number
      institucion_id: number
      activo: boolean
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["estudiantes"]>
    composites: {}
  }

  type EstudiantesGetPayload<S extends boolean | null | undefined | EstudiantesDefaultArgs> = $Result.GetResult<Prisma.$EstudiantesPayload, S>

  type EstudiantesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EstudiantesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EstudiantesCountAggregateInputType | true
    }

  export interface EstudiantesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Estudiantes'], meta: { name: 'Estudiantes' } }
    /**
     * Find zero or one Estudiantes that matches the filter.
     * @param {EstudiantesFindUniqueArgs} args - Arguments to find a Estudiantes
     * @example
     * // Get one Estudiantes
     * const estudiantes = await prisma.estudiantes.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EstudiantesFindUniqueArgs>(args: SelectSubset<T, EstudiantesFindUniqueArgs<ExtArgs>>): Prisma__EstudiantesClient<$Result.GetResult<Prisma.$EstudiantesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Estudiantes that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EstudiantesFindUniqueOrThrowArgs} args - Arguments to find a Estudiantes
     * @example
     * // Get one Estudiantes
     * const estudiantes = await prisma.estudiantes.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EstudiantesFindUniqueOrThrowArgs>(args: SelectSubset<T, EstudiantesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EstudiantesClient<$Result.GetResult<Prisma.$EstudiantesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Estudiantes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EstudiantesFindFirstArgs} args - Arguments to find a Estudiantes
     * @example
     * // Get one Estudiantes
     * const estudiantes = await prisma.estudiantes.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EstudiantesFindFirstArgs>(args?: SelectSubset<T, EstudiantesFindFirstArgs<ExtArgs>>): Prisma__EstudiantesClient<$Result.GetResult<Prisma.$EstudiantesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Estudiantes that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EstudiantesFindFirstOrThrowArgs} args - Arguments to find a Estudiantes
     * @example
     * // Get one Estudiantes
     * const estudiantes = await prisma.estudiantes.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EstudiantesFindFirstOrThrowArgs>(args?: SelectSubset<T, EstudiantesFindFirstOrThrowArgs<ExtArgs>>): Prisma__EstudiantesClient<$Result.GetResult<Prisma.$EstudiantesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Estudiantes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EstudiantesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Estudiantes
     * const estudiantes = await prisma.estudiantes.findMany()
     * 
     * // Get first 10 Estudiantes
     * const estudiantes = await prisma.estudiantes.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const estudiantesWithIdOnly = await prisma.estudiantes.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EstudiantesFindManyArgs>(args?: SelectSubset<T, EstudiantesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EstudiantesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Estudiantes.
     * @param {EstudiantesCreateArgs} args - Arguments to create a Estudiantes.
     * @example
     * // Create one Estudiantes
     * const Estudiantes = await prisma.estudiantes.create({
     *   data: {
     *     // ... data to create a Estudiantes
     *   }
     * })
     * 
     */
    create<T extends EstudiantesCreateArgs>(args: SelectSubset<T, EstudiantesCreateArgs<ExtArgs>>): Prisma__EstudiantesClient<$Result.GetResult<Prisma.$EstudiantesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Estudiantes.
     * @param {EstudiantesCreateManyArgs} args - Arguments to create many Estudiantes.
     * @example
     * // Create many Estudiantes
     * const estudiantes = await prisma.estudiantes.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EstudiantesCreateManyArgs>(args?: SelectSubset<T, EstudiantesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Estudiantes and returns the data saved in the database.
     * @param {EstudiantesCreateManyAndReturnArgs} args - Arguments to create many Estudiantes.
     * @example
     * // Create many Estudiantes
     * const estudiantes = await prisma.estudiantes.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Estudiantes and only return the `id`
     * const estudiantesWithIdOnly = await prisma.estudiantes.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EstudiantesCreateManyAndReturnArgs>(args?: SelectSubset<T, EstudiantesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EstudiantesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Estudiantes.
     * @param {EstudiantesDeleteArgs} args - Arguments to delete one Estudiantes.
     * @example
     * // Delete one Estudiantes
     * const Estudiantes = await prisma.estudiantes.delete({
     *   where: {
     *     // ... filter to delete one Estudiantes
     *   }
     * })
     * 
     */
    delete<T extends EstudiantesDeleteArgs>(args: SelectSubset<T, EstudiantesDeleteArgs<ExtArgs>>): Prisma__EstudiantesClient<$Result.GetResult<Prisma.$EstudiantesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Estudiantes.
     * @param {EstudiantesUpdateArgs} args - Arguments to update one Estudiantes.
     * @example
     * // Update one Estudiantes
     * const estudiantes = await prisma.estudiantes.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EstudiantesUpdateArgs>(args: SelectSubset<T, EstudiantesUpdateArgs<ExtArgs>>): Prisma__EstudiantesClient<$Result.GetResult<Prisma.$EstudiantesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Estudiantes.
     * @param {EstudiantesDeleteManyArgs} args - Arguments to filter Estudiantes to delete.
     * @example
     * // Delete a few Estudiantes
     * const { count } = await prisma.estudiantes.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EstudiantesDeleteManyArgs>(args?: SelectSubset<T, EstudiantesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Estudiantes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EstudiantesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Estudiantes
     * const estudiantes = await prisma.estudiantes.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EstudiantesUpdateManyArgs>(args: SelectSubset<T, EstudiantesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Estudiantes and returns the data updated in the database.
     * @param {EstudiantesUpdateManyAndReturnArgs} args - Arguments to update many Estudiantes.
     * @example
     * // Update many Estudiantes
     * const estudiantes = await prisma.estudiantes.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Estudiantes and only return the `id`
     * const estudiantesWithIdOnly = await prisma.estudiantes.updateManyAndReturn({
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
    updateManyAndReturn<T extends EstudiantesUpdateManyAndReturnArgs>(args: SelectSubset<T, EstudiantesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EstudiantesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Estudiantes.
     * @param {EstudiantesUpsertArgs} args - Arguments to update or create a Estudiantes.
     * @example
     * // Update or create a Estudiantes
     * const estudiantes = await prisma.estudiantes.upsert({
     *   create: {
     *     // ... data to create a Estudiantes
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Estudiantes we want to update
     *   }
     * })
     */
    upsert<T extends EstudiantesUpsertArgs>(args: SelectSubset<T, EstudiantesUpsertArgs<ExtArgs>>): Prisma__EstudiantesClient<$Result.GetResult<Prisma.$EstudiantesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Estudiantes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EstudiantesCountArgs} args - Arguments to filter Estudiantes to count.
     * @example
     * // Count the number of Estudiantes
     * const count = await prisma.estudiantes.count({
     *   where: {
     *     // ... the filter for the Estudiantes we want to count
     *   }
     * })
    **/
    count<T extends EstudiantesCountArgs>(
      args?: Subset<T, EstudiantesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EstudiantesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Estudiantes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EstudiantesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EstudiantesAggregateArgs>(args: Subset<T, EstudiantesAggregateArgs>): Prisma.PrismaPromise<GetEstudiantesAggregateType<T>>

    /**
     * Group by Estudiantes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EstudiantesGroupByArgs} args - Group by arguments.
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
      T extends EstudiantesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EstudiantesGroupByArgs['orderBy'] }
        : { orderBy?: EstudiantesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, EstudiantesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEstudiantesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Estudiantes model
   */
  readonly fields: EstudiantesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Estudiantes.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EstudiantesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    curso<T extends CursosDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CursosDefaultArgs<ExtArgs>>): Prisma__CursosClient<$Result.GetResult<Prisma.$CursosPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Estudiantes model
   */
  interface EstudiantesFieldRefs {
    readonly id: FieldRef<"Estudiantes", 'Int'>
    readonly apellidos: FieldRef<"Estudiantes", 'String'>
    readonly nombres: FieldRef<"Estudiantes", 'String'>
    readonly codigo_estudiantil: FieldRef<"Estudiantes", 'String'>
    readonly nombre_acudiente: FieldRef<"Estudiantes", 'String'>
    readonly correo_acudiente: FieldRef<"Estudiantes", 'String'>
    readonly telefono_acudiente: FieldRef<"Estudiantes", 'String'>
    readonly curso_id: FieldRef<"Estudiantes", 'Int'>
    readonly institucion_id: FieldRef<"Estudiantes", 'Int'>
    readonly activo: FieldRef<"Estudiantes", 'Boolean'>
    readonly created_at: FieldRef<"Estudiantes", 'DateTime'>
    readonly updated_at: FieldRef<"Estudiantes", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Estudiantes findUnique
   */
  export type EstudiantesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estudiantes
     */
    select?: EstudiantesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Estudiantes
     */
    omit?: EstudiantesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstudiantesInclude<ExtArgs> | null
    /**
     * Filter, which Estudiantes to fetch.
     */
    where: EstudiantesWhereUniqueInput
  }

  /**
   * Estudiantes findUniqueOrThrow
   */
  export type EstudiantesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estudiantes
     */
    select?: EstudiantesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Estudiantes
     */
    omit?: EstudiantesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstudiantesInclude<ExtArgs> | null
    /**
     * Filter, which Estudiantes to fetch.
     */
    where: EstudiantesWhereUniqueInput
  }

  /**
   * Estudiantes findFirst
   */
  export type EstudiantesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estudiantes
     */
    select?: EstudiantesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Estudiantes
     */
    omit?: EstudiantesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstudiantesInclude<ExtArgs> | null
    /**
     * Filter, which Estudiantes to fetch.
     */
    where?: EstudiantesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Estudiantes to fetch.
     */
    orderBy?: EstudiantesOrderByWithRelationInput | EstudiantesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Estudiantes.
     */
    cursor?: EstudiantesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Estudiantes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Estudiantes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Estudiantes.
     */
    distinct?: EstudiantesScalarFieldEnum | EstudiantesScalarFieldEnum[]
  }

  /**
   * Estudiantes findFirstOrThrow
   */
  export type EstudiantesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estudiantes
     */
    select?: EstudiantesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Estudiantes
     */
    omit?: EstudiantesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstudiantesInclude<ExtArgs> | null
    /**
     * Filter, which Estudiantes to fetch.
     */
    where?: EstudiantesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Estudiantes to fetch.
     */
    orderBy?: EstudiantesOrderByWithRelationInput | EstudiantesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Estudiantes.
     */
    cursor?: EstudiantesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Estudiantes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Estudiantes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Estudiantes.
     */
    distinct?: EstudiantesScalarFieldEnum | EstudiantesScalarFieldEnum[]
  }

  /**
   * Estudiantes findMany
   */
  export type EstudiantesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estudiantes
     */
    select?: EstudiantesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Estudiantes
     */
    omit?: EstudiantesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstudiantesInclude<ExtArgs> | null
    /**
     * Filter, which Estudiantes to fetch.
     */
    where?: EstudiantesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Estudiantes to fetch.
     */
    orderBy?: EstudiantesOrderByWithRelationInput | EstudiantesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Estudiantes.
     */
    cursor?: EstudiantesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Estudiantes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Estudiantes.
     */
    skip?: number
    distinct?: EstudiantesScalarFieldEnum | EstudiantesScalarFieldEnum[]
  }

  /**
   * Estudiantes create
   */
  export type EstudiantesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estudiantes
     */
    select?: EstudiantesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Estudiantes
     */
    omit?: EstudiantesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstudiantesInclude<ExtArgs> | null
    /**
     * The data needed to create a Estudiantes.
     */
    data: XOR<EstudiantesCreateInput, EstudiantesUncheckedCreateInput>
  }

  /**
   * Estudiantes createMany
   */
  export type EstudiantesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Estudiantes.
     */
    data: EstudiantesCreateManyInput | EstudiantesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Estudiantes createManyAndReturn
   */
  export type EstudiantesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estudiantes
     */
    select?: EstudiantesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Estudiantes
     */
    omit?: EstudiantesOmit<ExtArgs> | null
    /**
     * The data used to create many Estudiantes.
     */
    data: EstudiantesCreateManyInput | EstudiantesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstudiantesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Estudiantes update
   */
  export type EstudiantesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estudiantes
     */
    select?: EstudiantesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Estudiantes
     */
    omit?: EstudiantesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstudiantesInclude<ExtArgs> | null
    /**
     * The data needed to update a Estudiantes.
     */
    data: XOR<EstudiantesUpdateInput, EstudiantesUncheckedUpdateInput>
    /**
     * Choose, which Estudiantes to update.
     */
    where: EstudiantesWhereUniqueInput
  }

  /**
   * Estudiantes updateMany
   */
  export type EstudiantesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Estudiantes.
     */
    data: XOR<EstudiantesUpdateManyMutationInput, EstudiantesUncheckedUpdateManyInput>
    /**
     * Filter which Estudiantes to update
     */
    where?: EstudiantesWhereInput
    /**
     * Limit how many Estudiantes to update.
     */
    limit?: number
  }

  /**
   * Estudiantes updateManyAndReturn
   */
  export type EstudiantesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estudiantes
     */
    select?: EstudiantesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Estudiantes
     */
    omit?: EstudiantesOmit<ExtArgs> | null
    /**
     * The data used to update Estudiantes.
     */
    data: XOR<EstudiantesUpdateManyMutationInput, EstudiantesUncheckedUpdateManyInput>
    /**
     * Filter which Estudiantes to update
     */
    where?: EstudiantesWhereInput
    /**
     * Limit how many Estudiantes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstudiantesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Estudiantes upsert
   */
  export type EstudiantesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estudiantes
     */
    select?: EstudiantesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Estudiantes
     */
    omit?: EstudiantesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstudiantesInclude<ExtArgs> | null
    /**
     * The filter to search for the Estudiantes to update in case it exists.
     */
    where: EstudiantesWhereUniqueInput
    /**
     * In case the Estudiantes found by the `where` argument doesn't exist, create a new Estudiantes with this data.
     */
    create: XOR<EstudiantesCreateInput, EstudiantesUncheckedCreateInput>
    /**
     * In case the Estudiantes was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EstudiantesUpdateInput, EstudiantesUncheckedUpdateInput>
  }

  /**
   * Estudiantes delete
   */
  export type EstudiantesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estudiantes
     */
    select?: EstudiantesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Estudiantes
     */
    omit?: EstudiantesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstudiantesInclude<ExtArgs> | null
    /**
     * Filter which Estudiantes to delete.
     */
    where: EstudiantesWhereUniqueInput
  }

  /**
   * Estudiantes deleteMany
   */
  export type EstudiantesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Estudiantes to delete
     */
    where?: EstudiantesWhereInput
    /**
     * Limit how many Estudiantes to delete.
     */
    limit?: number
  }

  /**
   * Estudiantes without action
   */
  export type EstudiantesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estudiantes
     */
    select?: EstudiantesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Estudiantes
     */
    omit?: EstudiantesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstudiantesInclude<ExtArgs> | null
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


  export const GradosScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    nivel: 'nivel',
    orden: 'orden',
    institucion_id: 'institucion_id',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type GradosScalarFieldEnum = (typeof GradosScalarFieldEnum)[keyof typeof GradosScalarFieldEnum]


  export const CursosScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    grado_id: 'grado_id',
    jornada: 'jornada',
    sede_id: 'sede_id',
    institucion_id: 'institucion_id',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type CursosScalarFieldEnum = (typeof CursosScalarFieldEnum)[keyof typeof CursosScalarFieldEnum]


  export const AreasScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    es_opcional: 'es_opcional',
    orden: 'orden',
    institucion_id: 'institucion_id',
    activa: 'activa',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type AreasScalarFieldEnum = (typeof AreasScalarFieldEnum)[keyof typeof AreasScalarFieldEnum]


  export const MateriasScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    area_id: 'area_id',
    institucion_id: 'institucion_id',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type MateriasScalarFieldEnum = (typeof MateriasScalarFieldEnum)[keyof typeof MateriasScalarFieldEnum]


  export const MateriaGradosScalarFieldEnum: {
    id: 'id',
    materia_id: 'materia_id',
    grado_id: 'grado_id',
    created_at: 'created_at'
  };

  export type MateriaGradosScalarFieldEnum = (typeof MateriaGradosScalarFieldEnum)[keyof typeof MateriaGradosScalarFieldEnum]


  export const DocentesScalarFieldEnum: {
    id: 'id',
    apellidos: 'apellidos',
    nombres: 'nombres',
    telefono: 'telefono',
    email: 'email',
    institucion_id: 'institucion_id',
    sede_id: 'sede_id',
    activo: 'activo',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type DocentesScalarFieldEnum = (typeof DocentesScalarFieldEnum)[keyof typeof DocentesScalarFieldEnum]


  export const DocenteAsignacionesScalarFieldEnum: {
    id: 'id',
    docente_id: 'docente_id',
    curso_id: 'curso_id',
    materia_id: 'materia_id',
    created_at: 'created_at'
  };

  export type DocenteAsignacionesScalarFieldEnum = (typeof DocenteAsignacionesScalarFieldEnum)[keyof typeof DocenteAsignacionesScalarFieldEnum]


  export const EstudiantesScalarFieldEnum: {
    id: 'id',
    apellidos: 'apellidos',
    nombres: 'nombres',
    codigo_estudiantil: 'codigo_estudiantil',
    nombre_acudiente: 'nombre_acudiente',
    correo_acudiente: 'correo_acudiente',
    telefono_acudiente: 'telefono_acudiente',
    curso_id: 'curso_id',
    institucion_id: 'institucion_id',
    activo: 'activo',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type EstudiantesScalarFieldEnum = (typeof EstudiantesScalarFieldEnum)[keyof typeof EstudiantesScalarFieldEnum]


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
    grados?: GradosListRelationFilter
    cursos?: CursosListRelationFilter
    areas?: AreasListRelationFilter
    materias?: MateriasListRelationFilter
    docentes?: DocentesListRelationFilter
    estudiantes?: EstudiantesListRelationFilter
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
    grados?: GradosOrderByRelationAggregateInput
    cursos?: CursosOrderByRelationAggregateInput
    areas?: AreasOrderByRelationAggregateInput
    materias?: MateriasOrderByRelationAggregateInput
    docentes?: DocentesOrderByRelationAggregateInput
    estudiantes?: EstudiantesOrderByRelationAggregateInput
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
    grados?: GradosListRelationFilter
    cursos?: CursosListRelationFilter
    areas?: AreasListRelationFilter
    materias?: MateriasListRelationFilter
    docentes?: DocentesListRelationFilter
    estudiantes?: EstudiantesListRelationFilter
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
    cursos?: CursosListRelationFilter
    docentes?: DocentesListRelationFilter
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
    cursos?: CursosOrderByRelationAggregateInput
    docentes?: DocentesOrderByRelationAggregateInput
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
    cursos?: CursosListRelationFilter
    docentes?: DocentesListRelationFilter
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

  export type GradosWhereInput = {
    AND?: GradosWhereInput | GradosWhereInput[]
    OR?: GradosWhereInput[]
    NOT?: GradosWhereInput | GradosWhereInput[]
    id?: IntFilter<"Grados"> | number
    nombre?: StringFilter<"Grados"> | string
    nivel?: StringFilter<"Grados"> | string
    orden?: IntFilter<"Grados"> | number
    institucion_id?: IntFilter<"Grados"> | number
    created_at?: DateTimeFilter<"Grados"> | Date | string
    updated_at?: DateTimeFilter<"Grados"> | Date | string
    institucion?: XOR<InstitucionesScalarRelationFilter, InstitucionesWhereInput>
    cursos?: CursosListRelationFilter
    materiaGrados?: MateriaGradosListRelationFilter
  }

  export type GradosOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    nivel?: SortOrder
    orden?: SortOrder
    institucion_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    institucion?: InstitucionesOrderByWithRelationInput
    cursos?: CursosOrderByRelationAggregateInput
    materiaGrados?: MateriaGradosOrderByRelationAggregateInput
  }

  export type GradosWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: GradosWhereInput | GradosWhereInput[]
    OR?: GradosWhereInput[]
    NOT?: GradosWhereInput | GradosWhereInput[]
    nombre?: StringFilter<"Grados"> | string
    nivel?: StringFilter<"Grados"> | string
    orden?: IntFilter<"Grados"> | number
    institucion_id?: IntFilter<"Grados"> | number
    created_at?: DateTimeFilter<"Grados"> | Date | string
    updated_at?: DateTimeFilter<"Grados"> | Date | string
    institucion?: XOR<InstitucionesScalarRelationFilter, InstitucionesWhereInput>
    cursos?: CursosListRelationFilter
    materiaGrados?: MateriaGradosListRelationFilter
  }, "id">

  export type GradosOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    nivel?: SortOrder
    orden?: SortOrder
    institucion_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: GradosCountOrderByAggregateInput
    _avg?: GradosAvgOrderByAggregateInput
    _max?: GradosMaxOrderByAggregateInput
    _min?: GradosMinOrderByAggregateInput
    _sum?: GradosSumOrderByAggregateInput
  }

  export type GradosScalarWhereWithAggregatesInput = {
    AND?: GradosScalarWhereWithAggregatesInput | GradosScalarWhereWithAggregatesInput[]
    OR?: GradosScalarWhereWithAggregatesInput[]
    NOT?: GradosScalarWhereWithAggregatesInput | GradosScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Grados"> | number
    nombre?: StringWithAggregatesFilter<"Grados"> | string
    nivel?: StringWithAggregatesFilter<"Grados"> | string
    orden?: IntWithAggregatesFilter<"Grados"> | number
    institucion_id?: IntWithAggregatesFilter<"Grados"> | number
    created_at?: DateTimeWithAggregatesFilter<"Grados"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Grados"> | Date | string
  }

  export type CursosWhereInput = {
    AND?: CursosWhereInput | CursosWhereInput[]
    OR?: CursosWhereInput[]
    NOT?: CursosWhereInput | CursosWhereInput[]
    id?: IntFilter<"Cursos"> | number
    nombre?: StringFilter<"Cursos"> | string
    grado_id?: IntFilter<"Cursos"> | number
    jornada?: StringNullableFilter<"Cursos"> | string | null
    sede_id?: IntNullableFilter<"Cursos"> | number | null
    institucion_id?: IntFilter<"Cursos"> | number
    created_at?: DateTimeFilter<"Cursos"> | Date | string
    updated_at?: DateTimeFilter<"Cursos"> | Date | string
    grado?: XOR<GradosScalarRelationFilter, GradosWhereInput>
    institucion?: XOR<InstitucionesScalarRelationFilter, InstitucionesWhereInput>
    sede?: XOR<SedesNullableScalarRelationFilter, SedesWhereInput> | null
    estudiantes?: EstudiantesListRelationFilter
    docenteAsignaciones?: DocenteAsignacionesListRelationFilter
  }

  export type CursosOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    grado_id?: SortOrder
    jornada?: SortOrderInput | SortOrder
    sede_id?: SortOrderInput | SortOrder
    institucion_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    grado?: GradosOrderByWithRelationInput
    institucion?: InstitucionesOrderByWithRelationInput
    sede?: SedesOrderByWithRelationInput
    estudiantes?: EstudiantesOrderByRelationAggregateInput
    docenteAsignaciones?: DocenteAsignacionesOrderByRelationAggregateInput
  }

  export type CursosWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CursosWhereInput | CursosWhereInput[]
    OR?: CursosWhereInput[]
    NOT?: CursosWhereInput | CursosWhereInput[]
    nombre?: StringFilter<"Cursos"> | string
    grado_id?: IntFilter<"Cursos"> | number
    jornada?: StringNullableFilter<"Cursos"> | string | null
    sede_id?: IntNullableFilter<"Cursos"> | number | null
    institucion_id?: IntFilter<"Cursos"> | number
    created_at?: DateTimeFilter<"Cursos"> | Date | string
    updated_at?: DateTimeFilter<"Cursos"> | Date | string
    grado?: XOR<GradosScalarRelationFilter, GradosWhereInput>
    institucion?: XOR<InstitucionesScalarRelationFilter, InstitucionesWhereInput>
    sede?: XOR<SedesNullableScalarRelationFilter, SedesWhereInput> | null
    estudiantes?: EstudiantesListRelationFilter
    docenteAsignaciones?: DocenteAsignacionesListRelationFilter
  }, "id">

  export type CursosOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    grado_id?: SortOrder
    jornada?: SortOrderInput | SortOrder
    sede_id?: SortOrderInput | SortOrder
    institucion_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: CursosCountOrderByAggregateInput
    _avg?: CursosAvgOrderByAggregateInput
    _max?: CursosMaxOrderByAggregateInput
    _min?: CursosMinOrderByAggregateInput
    _sum?: CursosSumOrderByAggregateInput
  }

  export type CursosScalarWhereWithAggregatesInput = {
    AND?: CursosScalarWhereWithAggregatesInput | CursosScalarWhereWithAggregatesInput[]
    OR?: CursosScalarWhereWithAggregatesInput[]
    NOT?: CursosScalarWhereWithAggregatesInput | CursosScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Cursos"> | number
    nombre?: StringWithAggregatesFilter<"Cursos"> | string
    grado_id?: IntWithAggregatesFilter<"Cursos"> | number
    jornada?: StringNullableWithAggregatesFilter<"Cursos"> | string | null
    sede_id?: IntNullableWithAggregatesFilter<"Cursos"> | number | null
    institucion_id?: IntWithAggregatesFilter<"Cursos"> | number
    created_at?: DateTimeWithAggregatesFilter<"Cursos"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Cursos"> | Date | string
  }

  export type AreasWhereInput = {
    AND?: AreasWhereInput | AreasWhereInput[]
    OR?: AreasWhereInput[]
    NOT?: AreasWhereInput | AreasWhereInput[]
    id?: IntFilter<"Areas"> | number
    nombre?: StringFilter<"Areas"> | string
    es_opcional?: BoolFilter<"Areas"> | boolean
    orden?: IntFilter<"Areas"> | number
    institucion_id?: IntFilter<"Areas"> | number
    activa?: BoolFilter<"Areas"> | boolean
    created_at?: DateTimeFilter<"Areas"> | Date | string
    updated_at?: DateTimeFilter<"Areas"> | Date | string
    institucion?: XOR<InstitucionesScalarRelationFilter, InstitucionesWhereInput>
    materias?: MateriasListRelationFilter
  }

  export type AreasOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    es_opcional?: SortOrder
    orden?: SortOrder
    institucion_id?: SortOrder
    activa?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    institucion?: InstitucionesOrderByWithRelationInput
    materias?: MateriasOrderByRelationAggregateInput
  }

  export type AreasWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: AreasWhereInput | AreasWhereInput[]
    OR?: AreasWhereInput[]
    NOT?: AreasWhereInput | AreasWhereInput[]
    nombre?: StringFilter<"Areas"> | string
    es_opcional?: BoolFilter<"Areas"> | boolean
    orden?: IntFilter<"Areas"> | number
    institucion_id?: IntFilter<"Areas"> | number
    activa?: BoolFilter<"Areas"> | boolean
    created_at?: DateTimeFilter<"Areas"> | Date | string
    updated_at?: DateTimeFilter<"Areas"> | Date | string
    institucion?: XOR<InstitucionesScalarRelationFilter, InstitucionesWhereInput>
    materias?: MateriasListRelationFilter
  }, "id">

  export type AreasOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    es_opcional?: SortOrder
    orden?: SortOrder
    institucion_id?: SortOrder
    activa?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: AreasCountOrderByAggregateInput
    _avg?: AreasAvgOrderByAggregateInput
    _max?: AreasMaxOrderByAggregateInput
    _min?: AreasMinOrderByAggregateInput
    _sum?: AreasSumOrderByAggregateInput
  }

  export type AreasScalarWhereWithAggregatesInput = {
    AND?: AreasScalarWhereWithAggregatesInput | AreasScalarWhereWithAggregatesInput[]
    OR?: AreasScalarWhereWithAggregatesInput[]
    NOT?: AreasScalarWhereWithAggregatesInput | AreasScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Areas"> | number
    nombre?: StringWithAggregatesFilter<"Areas"> | string
    es_opcional?: BoolWithAggregatesFilter<"Areas"> | boolean
    orden?: IntWithAggregatesFilter<"Areas"> | number
    institucion_id?: IntWithAggregatesFilter<"Areas"> | number
    activa?: BoolWithAggregatesFilter<"Areas"> | boolean
    created_at?: DateTimeWithAggregatesFilter<"Areas"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Areas"> | Date | string
  }

  export type MateriasWhereInput = {
    AND?: MateriasWhereInput | MateriasWhereInput[]
    OR?: MateriasWhereInput[]
    NOT?: MateriasWhereInput | MateriasWhereInput[]
    id?: IntFilter<"Materias"> | number
    nombre?: StringFilter<"Materias"> | string
    area_id?: IntFilter<"Materias"> | number
    institucion_id?: IntFilter<"Materias"> | number
    created_at?: DateTimeFilter<"Materias"> | Date | string
    updated_at?: DateTimeFilter<"Materias"> | Date | string
    area?: XOR<AreasScalarRelationFilter, AreasWhereInput>
    institucion?: XOR<InstitucionesScalarRelationFilter, InstitucionesWhereInput>
    materiaGrados?: MateriaGradosListRelationFilter
    docenteAsignaciones?: DocenteAsignacionesListRelationFilter
  }

  export type MateriasOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    area_id?: SortOrder
    institucion_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    area?: AreasOrderByWithRelationInput
    institucion?: InstitucionesOrderByWithRelationInput
    materiaGrados?: MateriaGradosOrderByRelationAggregateInput
    docenteAsignaciones?: DocenteAsignacionesOrderByRelationAggregateInput
  }

  export type MateriasWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: MateriasWhereInput | MateriasWhereInput[]
    OR?: MateriasWhereInput[]
    NOT?: MateriasWhereInput | MateriasWhereInput[]
    nombre?: StringFilter<"Materias"> | string
    area_id?: IntFilter<"Materias"> | number
    institucion_id?: IntFilter<"Materias"> | number
    created_at?: DateTimeFilter<"Materias"> | Date | string
    updated_at?: DateTimeFilter<"Materias"> | Date | string
    area?: XOR<AreasScalarRelationFilter, AreasWhereInput>
    institucion?: XOR<InstitucionesScalarRelationFilter, InstitucionesWhereInput>
    materiaGrados?: MateriaGradosListRelationFilter
    docenteAsignaciones?: DocenteAsignacionesListRelationFilter
  }, "id">

  export type MateriasOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    area_id?: SortOrder
    institucion_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: MateriasCountOrderByAggregateInput
    _avg?: MateriasAvgOrderByAggregateInput
    _max?: MateriasMaxOrderByAggregateInput
    _min?: MateriasMinOrderByAggregateInput
    _sum?: MateriasSumOrderByAggregateInput
  }

  export type MateriasScalarWhereWithAggregatesInput = {
    AND?: MateriasScalarWhereWithAggregatesInput | MateriasScalarWhereWithAggregatesInput[]
    OR?: MateriasScalarWhereWithAggregatesInput[]
    NOT?: MateriasScalarWhereWithAggregatesInput | MateriasScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Materias"> | number
    nombre?: StringWithAggregatesFilter<"Materias"> | string
    area_id?: IntWithAggregatesFilter<"Materias"> | number
    institucion_id?: IntWithAggregatesFilter<"Materias"> | number
    created_at?: DateTimeWithAggregatesFilter<"Materias"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Materias"> | Date | string
  }

  export type MateriaGradosWhereInput = {
    AND?: MateriaGradosWhereInput | MateriaGradosWhereInput[]
    OR?: MateriaGradosWhereInput[]
    NOT?: MateriaGradosWhereInput | MateriaGradosWhereInput[]
    id?: IntFilter<"MateriaGrados"> | number
    materia_id?: IntFilter<"MateriaGrados"> | number
    grado_id?: IntFilter<"MateriaGrados"> | number
    created_at?: DateTimeFilter<"MateriaGrados"> | Date | string
    materia?: XOR<MateriasScalarRelationFilter, MateriasWhereInput>
    grado?: XOR<GradosScalarRelationFilter, GradosWhereInput>
  }

  export type MateriaGradosOrderByWithRelationInput = {
    id?: SortOrder
    materia_id?: SortOrder
    grado_id?: SortOrder
    created_at?: SortOrder
    materia?: MateriasOrderByWithRelationInput
    grado?: GradosOrderByWithRelationInput
  }

  export type MateriaGradosWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    materia_id_grado_id?: MateriaGradosMateria_idGrado_idCompoundUniqueInput
    AND?: MateriaGradosWhereInput | MateriaGradosWhereInput[]
    OR?: MateriaGradosWhereInput[]
    NOT?: MateriaGradosWhereInput | MateriaGradosWhereInput[]
    materia_id?: IntFilter<"MateriaGrados"> | number
    grado_id?: IntFilter<"MateriaGrados"> | number
    created_at?: DateTimeFilter<"MateriaGrados"> | Date | string
    materia?: XOR<MateriasScalarRelationFilter, MateriasWhereInput>
    grado?: XOR<GradosScalarRelationFilter, GradosWhereInput>
  }, "id" | "materia_id_grado_id">

  export type MateriaGradosOrderByWithAggregationInput = {
    id?: SortOrder
    materia_id?: SortOrder
    grado_id?: SortOrder
    created_at?: SortOrder
    _count?: MateriaGradosCountOrderByAggregateInput
    _avg?: MateriaGradosAvgOrderByAggregateInput
    _max?: MateriaGradosMaxOrderByAggregateInput
    _min?: MateriaGradosMinOrderByAggregateInput
    _sum?: MateriaGradosSumOrderByAggregateInput
  }

  export type MateriaGradosScalarWhereWithAggregatesInput = {
    AND?: MateriaGradosScalarWhereWithAggregatesInput | MateriaGradosScalarWhereWithAggregatesInput[]
    OR?: MateriaGradosScalarWhereWithAggregatesInput[]
    NOT?: MateriaGradosScalarWhereWithAggregatesInput | MateriaGradosScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"MateriaGrados"> | number
    materia_id?: IntWithAggregatesFilter<"MateriaGrados"> | number
    grado_id?: IntWithAggregatesFilter<"MateriaGrados"> | number
    created_at?: DateTimeWithAggregatesFilter<"MateriaGrados"> | Date | string
  }

  export type DocentesWhereInput = {
    AND?: DocentesWhereInput | DocentesWhereInput[]
    OR?: DocentesWhereInput[]
    NOT?: DocentesWhereInput | DocentesWhereInput[]
    id?: IntFilter<"Docentes"> | number
    apellidos?: StringFilter<"Docentes"> | string
    nombres?: StringFilter<"Docentes"> | string
    telefono?: StringFilter<"Docentes"> | string
    email?: StringFilter<"Docentes"> | string
    institucion_id?: IntFilter<"Docentes"> | number
    sede_id?: IntNullableFilter<"Docentes"> | number | null
    activo?: BoolFilter<"Docentes"> | boolean
    created_at?: DateTimeFilter<"Docentes"> | Date | string
    updated_at?: DateTimeFilter<"Docentes"> | Date | string
    institucion?: XOR<InstitucionesScalarRelationFilter, InstitucionesWhereInput>
    sede?: XOR<SedesNullableScalarRelationFilter, SedesWhereInput> | null
    docenteAsignaciones?: DocenteAsignacionesListRelationFilter
  }

  export type DocentesOrderByWithRelationInput = {
    id?: SortOrder
    apellidos?: SortOrder
    nombres?: SortOrder
    telefono?: SortOrder
    email?: SortOrder
    institucion_id?: SortOrder
    sede_id?: SortOrderInput | SortOrder
    activo?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    institucion?: InstitucionesOrderByWithRelationInput
    sede?: SedesOrderByWithRelationInput
    docenteAsignaciones?: DocenteAsignacionesOrderByRelationAggregateInput
  }

  export type DocentesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: DocentesWhereInput | DocentesWhereInput[]
    OR?: DocentesWhereInput[]
    NOT?: DocentesWhereInput | DocentesWhereInput[]
    apellidos?: StringFilter<"Docentes"> | string
    nombres?: StringFilter<"Docentes"> | string
    telefono?: StringFilter<"Docentes"> | string
    institucion_id?: IntFilter<"Docentes"> | number
    sede_id?: IntNullableFilter<"Docentes"> | number | null
    activo?: BoolFilter<"Docentes"> | boolean
    created_at?: DateTimeFilter<"Docentes"> | Date | string
    updated_at?: DateTimeFilter<"Docentes"> | Date | string
    institucion?: XOR<InstitucionesScalarRelationFilter, InstitucionesWhereInput>
    sede?: XOR<SedesNullableScalarRelationFilter, SedesWhereInput> | null
    docenteAsignaciones?: DocenteAsignacionesListRelationFilter
  }, "id" | "email">

  export type DocentesOrderByWithAggregationInput = {
    id?: SortOrder
    apellidos?: SortOrder
    nombres?: SortOrder
    telefono?: SortOrder
    email?: SortOrder
    institucion_id?: SortOrder
    sede_id?: SortOrderInput | SortOrder
    activo?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: DocentesCountOrderByAggregateInput
    _avg?: DocentesAvgOrderByAggregateInput
    _max?: DocentesMaxOrderByAggregateInput
    _min?: DocentesMinOrderByAggregateInput
    _sum?: DocentesSumOrderByAggregateInput
  }

  export type DocentesScalarWhereWithAggregatesInput = {
    AND?: DocentesScalarWhereWithAggregatesInput | DocentesScalarWhereWithAggregatesInput[]
    OR?: DocentesScalarWhereWithAggregatesInput[]
    NOT?: DocentesScalarWhereWithAggregatesInput | DocentesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Docentes"> | number
    apellidos?: StringWithAggregatesFilter<"Docentes"> | string
    nombres?: StringWithAggregatesFilter<"Docentes"> | string
    telefono?: StringWithAggregatesFilter<"Docentes"> | string
    email?: StringWithAggregatesFilter<"Docentes"> | string
    institucion_id?: IntWithAggregatesFilter<"Docentes"> | number
    sede_id?: IntNullableWithAggregatesFilter<"Docentes"> | number | null
    activo?: BoolWithAggregatesFilter<"Docentes"> | boolean
    created_at?: DateTimeWithAggregatesFilter<"Docentes"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Docentes"> | Date | string
  }

  export type DocenteAsignacionesWhereInput = {
    AND?: DocenteAsignacionesWhereInput | DocenteAsignacionesWhereInput[]
    OR?: DocenteAsignacionesWhereInput[]
    NOT?: DocenteAsignacionesWhereInput | DocenteAsignacionesWhereInput[]
    id?: IntFilter<"DocenteAsignaciones"> | number
    docente_id?: IntFilter<"DocenteAsignaciones"> | number
    curso_id?: IntFilter<"DocenteAsignaciones"> | number
    materia_id?: IntFilter<"DocenteAsignaciones"> | number
    created_at?: DateTimeFilter<"DocenteAsignaciones"> | Date | string
    docente?: XOR<DocentesScalarRelationFilter, DocentesWhereInput>
    curso?: XOR<CursosScalarRelationFilter, CursosWhereInput>
    materia?: XOR<MateriasScalarRelationFilter, MateriasWhereInput>
  }

  export type DocenteAsignacionesOrderByWithRelationInput = {
    id?: SortOrder
    docente_id?: SortOrder
    curso_id?: SortOrder
    materia_id?: SortOrder
    created_at?: SortOrder
    docente?: DocentesOrderByWithRelationInput
    curso?: CursosOrderByWithRelationInput
    materia?: MateriasOrderByWithRelationInput
  }

  export type DocenteAsignacionesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    docente_id_curso_id_materia_id?: DocenteAsignacionesDocente_idCurso_idMateria_idCompoundUniqueInput
    AND?: DocenteAsignacionesWhereInput | DocenteAsignacionesWhereInput[]
    OR?: DocenteAsignacionesWhereInput[]
    NOT?: DocenteAsignacionesWhereInput | DocenteAsignacionesWhereInput[]
    docente_id?: IntFilter<"DocenteAsignaciones"> | number
    curso_id?: IntFilter<"DocenteAsignaciones"> | number
    materia_id?: IntFilter<"DocenteAsignaciones"> | number
    created_at?: DateTimeFilter<"DocenteAsignaciones"> | Date | string
    docente?: XOR<DocentesScalarRelationFilter, DocentesWhereInput>
    curso?: XOR<CursosScalarRelationFilter, CursosWhereInput>
    materia?: XOR<MateriasScalarRelationFilter, MateriasWhereInput>
  }, "id" | "docente_id_curso_id_materia_id">

  export type DocenteAsignacionesOrderByWithAggregationInput = {
    id?: SortOrder
    docente_id?: SortOrder
    curso_id?: SortOrder
    materia_id?: SortOrder
    created_at?: SortOrder
    _count?: DocenteAsignacionesCountOrderByAggregateInput
    _avg?: DocenteAsignacionesAvgOrderByAggregateInput
    _max?: DocenteAsignacionesMaxOrderByAggregateInput
    _min?: DocenteAsignacionesMinOrderByAggregateInput
    _sum?: DocenteAsignacionesSumOrderByAggregateInput
  }

  export type DocenteAsignacionesScalarWhereWithAggregatesInput = {
    AND?: DocenteAsignacionesScalarWhereWithAggregatesInput | DocenteAsignacionesScalarWhereWithAggregatesInput[]
    OR?: DocenteAsignacionesScalarWhereWithAggregatesInput[]
    NOT?: DocenteAsignacionesScalarWhereWithAggregatesInput | DocenteAsignacionesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"DocenteAsignaciones"> | number
    docente_id?: IntWithAggregatesFilter<"DocenteAsignaciones"> | number
    curso_id?: IntWithAggregatesFilter<"DocenteAsignaciones"> | number
    materia_id?: IntWithAggregatesFilter<"DocenteAsignaciones"> | number
    created_at?: DateTimeWithAggregatesFilter<"DocenteAsignaciones"> | Date | string
  }

  export type EstudiantesWhereInput = {
    AND?: EstudiantesWhereInput | EstudiantesWhereInput[]
    OR?: EstudiantesWhereInput[]
    NOT?: EstudiantesWhereInput | EstudiantesWhereInput[]
    id?: IntFilter<"Estudiantes"> | number
    apellidos?: StringFilter<"Estudiantes"> | string
    nombres?: StringFilter<"Estudiantes"> | string
    codigo_estudiantil?: StringFilter<"Estudiantes"> | string
    nombre_acudiente?: StringFilter<"Estudiantes"> | string
    correo_acudiente?: StringNullableFilter<"Estudiantes"> | string | null
    telefono_acudiente?: StringFilter<"Estudiantes"> | string
    curso_id?: IntFilter<"Estudiantes"> | number
    institucion_id?: IntFilter<"Estudiantes"> | number
    activo?: BoolFilter<"Estudiantes"> | boolean
    created_at?: DateTimeFilter<"Estudiantes"> | Date | string
    updated_at?: DateTimeFilter<"Estudiantes"> | Date | string
    curso?: XOR<CursosScalarRelationFilter, CursosWhereInput>
    institucion?: XOR<InstitucionesScalarRelationFilter, InstitucionesWhereInput>
  }

  export type EstudiantesOrderByWithRelationInput = {
    id?: SortOrder
    apellidos?: SortOrder
    nombres?: SortOrder
    codigo_estudiantil?: SortOrder
    nombre_acudiente?: SortOrder
    correo_acudiente?: SortOrderInput | SortOrder
    telefono_acudiente?: SortOrder
    curso_id?: SortOrder
    institucion_id?: SortOrder
    activo?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    curso?: CursosOrderByWithRelationInput
    institucion?: InstitucionesOrderByWithRelationInput
  }

  export type EstudiantesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    codigo_estudiantil_institucion_id?: EstudiantesCodigo_estudiantilInstitucion_idCompoundUniqueInput
    AND?: EstudiantesWhereInput | EstudiantesWhereInput[]
    OR?: EstudiantesWhereInput[]
    NOT?: EstudiantesWhereInput | EstudiantesWhereInput[]
    apellidos?: StringFilter<"Estudiantes"> | string
    nombres?: StringFilter<"Estudiantes"> | string
    codigo_estudiantil?: StringFilter<"Estudiantes"> | string
    nombre_acudiente?: StringFilter<"Estudiantes"> | string
    correo_acudiente?: StringNullableFilter<"Estudiantes"> | string | null
    telefono_acudiente?: StringFilter<"Estudiantes"> | string
    curso_id?: IntFilter<"Estudiantes"> | number
    institucion_id?: IntFilter<"Estudiantes"> | number
    activo?: BoolFilter<"Estudiantes"> | boolean
    created_at?: DateTimeFilter<"Estudiantes"> | Date | string
    updated_at?: DateTimeFilter<"Estudiantes"> | Date | string
    curso?: XOR<CursosScalarRelationFilter, CursosWhereInput>
    institucion?: XOR<InstitucionesScalarRelationFilter, InstitucionesWhereInput>
  }, "id" | "codigo_estudiantil_institucion_id">

  export type EstudiantesOrderByWithAggregationInput = {
    id?: SortOrder
    apellidos?: SortOrder
    nombres?: SortOrder
    codigo_estudiantil?: SortOrder
    nombre_acudiente?: SortOrder
    correo_acudiente?: SortOrderInput | SortOrder
    telefono_acudiente?: SortOrder
    curso_id?: SortOrder
    institucion_id?: SortOrder
    activo?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: EstudiantesCountOrderByAggregateInput
    _avg?: EstudiantesAvgOrderByAggregateInput
    _max?: EstudiantesMaxOrderByAggregateInput
    _min?: EstudiantesMinOrderByAggregateInput
    _sum?: EstudiantesSumOrderByAggregateInput
  }

  export type EstudiantesScalarWhereWithAggregatesInput = {
    AND?: EstudiantesScalarWhereWithAggregatesInput | EstudiantesScalarWhereWithAggregatesInput[]
    OR?: EstudiantesScalarWhereWithAggregatesInput[]
    NOT?: EstudiantesScalarWhereWithAggregatesInput | EstudiantesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Estudiantes"> | number
    apellidos?: StringWithAggregatesFilter<"Estudiantes"> | string
    nombres?: StringWithAggregatesFilter<"Estudiantes"> | string
    codigo_estudiantil?: StringWithAggregatesFilter<"Estudiantes"> | string
    nombre_acudiente?: StringWithAggregatesFilter<"Estudiantes"> | string
    correo_acudiente?: StringNullableWithAggregatesFilter<"Estudiantes"> | string | null
    telefono_acudiente?: StringWithAggregatesFilter<"Estudiantes"> | string
    curso_id?: IntWithAggregatesFilter<"Estudiantes"> | number
    institucion_id?: IntWithAggregatesFilter<"Estudiantes"> | number
    activo?: BoolWithAggregatesFilter<"Estudiantes"> | boolean
    created_at?: DateTimeWithAggregatesFilter<"Estudiantes"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Estudiantes"> | Date | string
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
    grados?: GradosCreateNestedManyWithoutInstitucionInput
    cursos?: CursosCreateNestedManyWithoutInstitucionInput
    areas?: AreasCreateNestedManyWithoutInstitucionInput
    materias?: MateriasCreateNestedManyWithoutInstitucionInput
    docentes?: DocentesCreateNestedManyWithoutInstitucionInput
    estudiantes?: EstudiantesCreateNestedManyWithoutInstitucionInput
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
    grados?: GradosUncheckedCreateNestedManyWithoutInstitucionInput
    cursos?: CursosUncheckedCreateNestedManyWithoutInstitucionInput
    areas?: AreasUncheckedCreateNestedManyWithoutInstitucionInput
    materias?: MateriasUncheckedCreateNestedManyWithoutInstitucionInput
    docentes?: DocentesUncheckedCreateNestedManyWithoutInstitucionInput
    estudiantes?: EstudiantesUncheckedCreateNestedManyWithoutInstitucionInput
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
    grados?: GradosUpdateManyWithoutInstitucionNestedInput
    cursos?: CursosUpdateManyWithoutInstitucionNestedInput
    areas?: AreasUpdateManyWithoutInstitucionNestedInput
    materias?: MateriasUpdateManyWithoutInstitucionNestedInput
    docentes?: DocentesUpdateManyWithoutInstitucionNestedInput
    estudiantes?: EstudiantesUpdateManyWithoutInstitucionNestedInput
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
    grados?: GradosUncheckedUpdateManyWithoutInstitucionNestedInput
    cursos?: CursosUncheckedUpdateManyWithoutInstitucionNestedInput
    areas?: AreasUncheckedUpdateManyWithoutInstitucionNestedInput
    materias?: MateriasUncheckedUpdateManyWithoutInstitucionNestedInput
    docentes?: DocentesUncheckedUpdateManyWithoutInstitucionNestedInput
    estudiantes?: EstudiantesUncheckedUpdateManyWithoutInstitucionNestedInput
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
    cursos?: CursosCreateNestedManyWithoutSedeInput
    docentes?: DocentesCreateNestedManyWithoutSedeInput
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
    cursos?: CursosUncheckedCreateNestedManyWithoutSedeInput
    docentes?: DocentesUncheckedCreateNestedManyWithoutSedeInput
  }

  export type SedesUpdateInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    jornadas?: SedesUpdatejornadasInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    administradores?: AdministradoresUpdateManyWithoutSedeNestedInput
    cursos?: CursosUpdateManyWithoutSedeNestedInput
    docentes?: DocentesUpdateManyWithoutSedeNestedInput
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
    cursos?: CursosUncheckedUpdateManyWithoutSedeNestedInput
    docentes?: DocentesUncheckedUpdateManyWithoutSedeNestedInput
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

  export type GradosCreateInput = {
    nombre: string
    nivel: string
    orden: number
    created_at?: Date | string
    updated_at?: Date | string
    institucion: InstitucionesCreateNestedOneWithoutGradosInput
    cursos?: CursosCreateNestedManyWithoutGradoInput
    materiaGrados?: MateriaGradosCreateNestedManyWithoutGradoInput
  }

  export type GradosUncheckedCreateInput = {
    id?: number
    nombre: string
    nivel: string
    orden: number
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
    cursos?: CursosUncheckedCreateNestedManyWithoutGradoInput
    materiaGrados?: MateriaGradosUncheckedCreateNestedManyWithoutGradoInput
  }

  export type GradosUpdateInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    nivel?: StringFieldUpdateOperationsInput | string
    orden?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    institucion?: InstitucionesUpdateOneRequiredWithoutGradosNestedInput
    cursos?: CursosUpdateManyWithoutGradoNestedInput
    materiaGrados?: MateriaGradosUpdateManyWithoutGradoNestedInput
  }

  export type GradosUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    nivel?: StringFieldUpdateOperationsInput | string
    orden?: IntFieldUpdateOperationsInput | number
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    cursos?: CursosUncheckedUpdateManyWithoutGradoNestedInput
    materiaGrados?: MateriaGradosUncheckedUpdateManyWithoutGradoNestedInput
  }

  export type GradosCreateManyInput = {
    id?: number
    nombre: string
    nivel: string
    orden: number
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type GradosUpdateManyMutationInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    nivel?: StringFieldUpdateOperationsInput | string
    orden?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GradosUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    nivel?: StringFieldUpdateOperationsInput | string
    orden?: IntFieldUpdateOperationsInput | number
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CursosCreateInput = {
    nombre: string
    jornada?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    grado: GradosCreateNestedOneWithoutCursosInput
    institucion: InstitucionesCreateNestedOneWithoutCursosInput
    sede?: SedesCreateNestedOneWithoutCursosInput
    estudiantes?: EstudiantesCreateNestedManyWithoutCursoInput
    docenteAsignaciones?: DocenteAsignacionesCreateNestedManyWithoutCursoInput
  }

  export type CursosUncheckedCreateInput = {
    id?: number
    nombre: string
    grado_id: number
    jornada?: string | null
    sede_id?: number | null
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
    estudiantes?: EstudiantesUncheckedCreateNestedManyWithoutCursoInput
    docenteAsignaciones?: DocenteAsignacionesUncheckedCreateNestedManyWithoutCursoInput
  }

  export type CursosUpdateInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    grado?: GradosUpdateOneRequiredWithoutCursosNestedInput
    institucion?: InstitucionesUpdateOneRequiredWithoutCursosNestedInput
    sede?: SedesUpdateOneWithoutCursosNestedInput
    estudiantes?: EstudiantesUpdateManyWithoutCursoNestedInput
    docenteAsignaciones?: DocenteAsignacionesUpdateManyWithoutCursoNestedInput
  }

  export type CursosUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    grado_id?: IntFieldUpdateOperationsInput | number
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    sede_id?: NullableIntFieldUpdateOperationsInput | number | null
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    estudiantes?: EstudiantesUncheckedUpdateManyWithoutCursoNestedInput
    docenteAsignaciones?: DocenteAsignacionesUncheckedUpdateManyWithoutCursoNestedInput
  }

  export type CursosCreateManyInput = {
    id?: number
    nombre: string
    grado_id: number
    jornada?: string | null
    sede_id?: number | null
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type CursosUpdateManyMutationInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CursosUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    grado_id?: IntFieldUpdateOperationsInput | number
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    sede_id?: NullableIntFieldUpdateOperationsInput | number | null
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AreasCreateInput = {
    nombre: string
    es_opcional?: boolean
    orden: number
    activa?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    institucion: InstitucionesCreateNestedOneWithoutAreasInput
    materias?: MateriasCreateNestedManyWithoutAreaInput
  }

  export type AreasUncheckedCreateInput = {
    id?: number
    nombre: string
    es_opcional?: boolean
    orden: number
    institucion_id: number
    activa?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    materias?: MateriasUncheckedCreateNestedManyWithoutAreaInput
  }

  export type AreasUpdateInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    es_opcional?: BoolFieldUpdateOperationsInput | boolean
    orden?: IntFieldUpdateOperationsInput | number
    activa?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    institucion?: InstitucionesUpdateOneRequiredWithoutAreasNestedInput
    materias?: MateriasUpdateManyWithoutAreaNestedInput
  }

  export type AreasUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    es_opcional?: BoolFieldUpdateOperationsInput | boolean
    orden?: IntFieldUpdateOperationsInput | number
    institucion_id?: IntFieldUpdateOperationsInput | number
    activa?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    materias?: MateriasUncheckedUpdateManyWithoutAreaNestedInput
  }

  export type AreasCreateManyInput = {
    id?: number
    nombre: string
    es_opcional?: boolean
    orden: number
    institucion_id: number
    activa?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type AreasUpdateManyMutationInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    es_opcional?: BoolFieldUpdateOperationsInput | boolean
    orden?: IntFieldUpdateOperationsInput | number
    activa?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AreasUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    es_opcional?: BoolFieldUpdateOperationsInput | boolean
    orden?: IntFieldUpdateOperationsInput | number
    institucion_id?: IntFieldUpdateOperationsInput | number
    activa?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MateriasCreateInput = {
    nombre: string
    created_at?: Date | string
    updated_at?: Date | string
    area: AreasCreateNestedOneWithoutMateriasInput
    institucion: InstitucionesCreateNestedOneWithoutMateriasInput
    materiaGrados?: MateriaGradosCreateNestedManyWithoutMateriaInput
    docenteAsignaciones?: DocenteAsignacionesCreateNestedManyWithoutMateriaInput
  }

  export type MateriasUncheckedCreateInput = {
    id?: number
    nombre: string
    area_id: number
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
    materiaGrados?: MateriaGradosUncheckedCreateNestedManyWithoutMateriaInput
    docenteAsignaciones?: DocenteAsignacionesUncheckedCreateNestedManyWithoutMateriaInput
  }

  export type MateriasUpdateInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    area?: AreasUpdateOneRequiredWithoutMateriasNestedInput
    institucion?: InstitucionesUpdateOneRequiredWithoutMateriasNestedInput
    materiaGrados?: MateriaGradosUpdateManyWithoutMateriaNestedInput
    docenteAsignaciones?: DocenteAsignacionesUpdateManyWithoutMateriaNestedInput
  }

  export type MateriasUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    area_id?: IntFieldUpdateOperationsInput | number
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    materiaGrados?: MateriaGradosUncheckedUpdateManyWithoutMateriaNestedInput
    docenteAsignaciones?: DocenteAsignacionesUncheckedUpdateManyWithoutMateriaNestedInput
  }

  export type MateriasCreateManyInput = {
    id?: number
    nombre: string
    area_id: number
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type MateriasUpdateManyMutationInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MateriasUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    area_id?: IntFieldUpdateOperationsInput | number
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MateriaGradosCreateInput = {
    created_at?: Date | string
    materia: MateriasCreateNestedOneWithoutMateriaGradosInput
    grado: GradosCreateNestedOneWithoutMateriaGradosInput
  }

  export type MateriaGradosUncheckedCreateInput = {
    id?: number
    materia_id: number
    grado_id: number
    created_at?: Date | string
  }

  export type MateriaGradosUpdateInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    materia?: MateriasUpdateOneRequiredWithoutMateriaGradosNestedInput
    grado?: GradosUpdateOneRequiredWithoutMateriaGradosNestedInput
  }

  export type MateriaGradosUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    materia_id?: IntFieldUpdateOperationsInput | number
    grado_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MateriaGradosCreateManyInput = {
    id?: number
    materia_id: number
    grado_id: number
    created_at?: Date | string
  }

  export type MateriaGradosUpdateManyMutationInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MateriaGradosUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    materia_id?: IntFieldUpdateOperationsInput | number
    grado_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocentesCreateInput = {
    apellidos: string
    nombres: string
    telefono: string
    email: string
    activo?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    institucion: InstitucionesCreateNestedOneWithoutDocentesInput
    sede?: SedesCreateNestedOneWithoutDocentesInput
    docenteAsignaciones?: DocenteAsignacionesCreateNestedManyWithoutDocenteInput
  }

  export type DocentesUncheckedCreateInput = {
    id?: number
    apellidos: string
    nombres: string
    telefono: string
    email: string
    institucion_id: number
    sede_id?: number | null
    activo?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    docenteAsignaciones?: DocenteAsignacionesUncheckedCreateNestedManyWithoutDocenteInput
  }

  export type DocentesUpdateInput = {
    apellidos?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    institucion?: InstitucionesUpdateOneRequiredWithoutDocentesNestedInput
    sede?: SedesUpdateOneWithoutDocentesNestedInput
    docenteAsignaciones?: DocenteAsignacionesUpdateManyWithoutDocenteNestedInput
  }

  export type DocentesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    apellidos?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    institucion_id?: IntFieldUpdateOperationsInput | number
    sede_id?: NullableIntFieldUpdateOperationsInput | number | null
    activo?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    docenteAsignaciones?: DocenteAsignacionesUncheckedUpdateManyWithoutDocenteNestedInput
  }

  export type DocentesCreateManyInput = {
    id?: number
    apellidos: string
    nombres: string
    telefono: string
    email: string
    institucion_id: number
    sede_id?: number | null
    activo?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type DocentesUpdateManyMutationInput = {
    apellidos?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocentesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    apellidos?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    institucion_id?: IntFieldUpdateOperationsInput | number
    sede_id?: NullableIntFieldUpdateOperationsInput | number | null
    activo?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocenteAsignacionesCreateInput = {
    created_at?: Date | string
    docente: DocentesCreateNestedOneWithoutDocenteAsignacionesInput
    curso: CursosCreateNestedOneWithoutDocenteAsignacionesInput
    materia: MateriasCreateNestedOneWithoutDocenteAsignacionesInput
  }

  export type DocenteAsignacionesUncheckedCreateInput = {
    id?: number
    docente_id: number
    curso_id: number
    materia_id: number
    created_at?: Date | string
  }

  export type DocenteAsignacionesUpdateInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    docente?: DocentesUpdateOneRequiredWithoutDocenteAsignacionesNestedInput
    curso?: CursosUpdateOneRequiredWithoutDocenteAsignacionesNestedInput
    materia?: MateriasUpdateOneRequiredWithoutDocenteAsignacionesNestedInput
  }

  export type DocenteAsignacionesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    docente_id?: IntFieldUpdateOperationsInput | number
    curso_id?: IntFieldUpdateOperationsInput | number
    materia_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocenteAsignacionesCreateManyInput = {
    id?: number
    docente_id: number
    curso_id: number
    materia_id: number
    created_at?: Date | string
  }

  export type DocenteAsignacionesUpdateManyMutationInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocenteAsignacionesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    docente_id?: IntFieldUpdateOperationsInput | number
    curso_id?: IntFieldUpdateOperationsInput | number
    materia_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EstudiantesCreateInput = {
    apellidos: string
    nombres: string
    codigo_estudiantil: string
    nombre_acudiente: string
    correo_acudiente?: string | null
    telefono_acudiente: string
    activo?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    curso: CursosCreateNestedOneWithoutEstudiantesInput
    institucion: InstitucionesCreateNestedOneWithoutEstudiantesInput
  }

  export type EstudiantesUncheckedCreateInput = {
    id?: number
    apellidos: string
    nombres: string
    codigo_estudiantil: string
    nombre_acudiente: string
    correo_acudiente?: string | null
    telefono_acudiente: string
    curso_id: number
    institucion_id: number
    activo?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type EstudiantesUpdateInput = {
    apellidos?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    codigo_estudiantil?: StringFieldUpdateOperationsInput | string
    nombre_acudiente?: StringFieldUpdateOperationsInput | string
    correo_acudiente?: NullableStringFieldUpdateOperationsInput | string | null
    telefono_acudiente?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    curso?: CursosUpdateOneRequiredWithoutEstudiantesNestedInput
    institucion?: InstitucionesUpdateOneRequiredWithoutEstudiantesNestedInput
  }

  export type EstudiantesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    apellidos?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    codigo_estudiantil?: StringFieldUpdateOperationsInput | string
    nombre_acudiente?: StringFieldUpdateOperationsInput | string
    correo_acudiente?: NullableStringFieldUpdateOperationsInput | string | null
    telefono_acudiente?: StringFieldUpdateOperationsInput | string
    curso_id?: IntFieldUpdateOperationsInput | number
    institucion_id?: IntFieldUpdateOperationsInput | number
    activo?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EstudiantesCreateManyInput = {
    id?: number
    apellidos: string
    nombres: string
    codigo_estudiantil: string
    nombre_acudiente: string
    correo_acudiente?: string | null
    telefono_acudiente: string
    curso_id: number
    institucion_id: number
    activo?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type EstudiantesUpdateManyMutationInput = {
    apellidos?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    codigo_estudiantil?: StringFieldUpdateOperationsInput | string
    nombre_acudiente?: StringFieldUpdateOperationsInput | string
    correo_acudiente?: NullableStringFieldUpdateOperationsInput | string | null
    telefono_acudiente?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EstudiantesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    apellidos?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    codigo_estudiantil?: StringFieldUpdateOperationsInput | string
    nombre_acudiente?: StringFieldUpdateOperationsInput | string
    correo_acudiente?: NullableStringFieldUpdateOperationsInput | string | null
    telefono_acudiente?: StringFieldUpdateOperationsInput | string
    curso_id?: IntFieldUpdateOperationsInput | number
    institucion_id?: IntFieldUpdateOperationsInput | number
    activo?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type GradosListRelationFilter = {
    every?: GradosWhereInput
    some?: GradosWhereInput
    none?: GradosWhereInput
  }

  export type CursosListRelationFilter = {
    every?: CursosWhereInput
    some?: CursosWhereInput
    none?: CursosWhereInput
  }

  export type AreasListRelationFilter = {
    every?: AreasWhereInput
    some?: AreasWhereInput
    none?: AreasWhereInput
  }

  export type MateriasListRelationFilter = {
    every?: MateriasWhereInput
    some?: MateriasWhereInput
    none?: MateriasWhereInput
  }

  export type DocentesListRelationFilter = {
    every?: DocentesWhereInput
    some?: DocentesWhereInput
    none?: DocentesWhereInput
  }

  export type EstudiantesListRelationFilter = {
    every?: EstudiantesWhereInput
    some?: EstudiantesWhereInput
    none?: EstudiantesWhereInput
  }

  export type AdministradoresOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SedesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GradosOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CursosOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AreasOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MateriasOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DocentesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EstudiantesOrderByRelationAggregateInput = {
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

  export type MateriaGradosListRelationFilter = {
    every?: MateriaGradosWhereInput
    some?: MateriaGradosWhereInput
    none?: MateriaGradosWhereInput
  }

  export type MateriaGradosOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GradosCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    nivel?: SortOrder
    orden?: SortOrder
    institucion_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type GradosAvgOrderByAggregateInput = {
    id?: SortOrder
    orden?: SortOrder
    institucion_id?: SortOrder
  }

  export type GradosMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    nivel?: SortOrder
    orden?: SortOrder
    institucion_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type GradosMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    nivel?: SortOrder
    orden?: SortOrder
    institucion_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type GradosSumOrderByAggregateInput = {
    id?: SortOrder
    orden?: SortOrder
    institucion_id?: SortOrder
  }

  export type GradosScalarRelationFilter = {
    is?: GradosWhereInput
    isNot?: GradosWhereInput
  }

  export type DocenteAsignacionesListRelationFilter = {
    every?: DocenteAsignacionesWhereInput
    some?: DocenteAsignacionesWhereInput
    none?: DocenteAsignacionesWhereInput
  }

  export type DocenteAsignacionesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CursosCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    grado_id?: SortOrder
    jornada?: SortOrder
    sede_id?: SortOrder
    institucion_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type CursosAvgOrderByAggregateInput = {
    id?: SortOrder
    grado_id?: SortOrder
    sede_id?: SortOrder
    institucion_id?: SortOrder
  }

  export type CursosMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    grado_id?: SortOrder
    jornada?: SortOrder
    sede_id?: SortOrder
    institucion_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type CursosMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    grado_id?: SortOrder
    jornada?: SortOrder
    sede_id?: SortOrder
    institucion_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type CursosSumOrderByAggregateInput = {
    id?: SortOrder
    grado_id?: SortOrder
    sede_id?: SortOrder
    institucion_id?: SortOrder
  }

  export type AreasCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    es_opcional?: SortOrder
    orden?: SortOrder
    institucion_id?: SortOrder
    activa?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type AreasAvgOrderByAggregateInput = {
    id?: SortOrder
    orden?: SortOrder
    institucion_id?: SortOrder
  }

  export type AreasMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    es_opcional?: SortOrder
    orden?: SortOrder
    institucion_id?: SortOrder
    activa?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type AreasMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    es_opcional?: SortOrder
    orden?: SortOrder
    institucion_id?: SortOrder
    activa?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type AreasSumOrderByAggregateInput = {
    id?: SortOrder
    orden?: SortOrder
    institucion_id?: SortOrder
  }

  export type AreasScalarRelationFilter = {
    is?: AreasWhereInput
    isNot?: AreasWhereInput
  }

  export type MateriasCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    area_id?: SortOrder
    institucion_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type MateriasAvgOrderByAggregateInput = {
    id?: SortOrder
    area_id?: SortOrder
    institucion_id?: SortOrder
  }

  export type MateriasMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    area_id?: SortOrder
    institucion_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type MateriasMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    area_id?: SortOrder
    institucion_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type MateriasSumOrderByAggregateInput = {
    id?: SortOrder
    area_id?: SortOrder
    institucion_id?: SortOrder
  }

  export type MateriasScalarRelationFilter = {
    is?: MateriasWhereInput
    isNot?: MateriasWhereInput
  }

  export type MateriaGradosMateria_idGrado_idCompoundUniqueInput = {
    materia_id: number
    grado_id: number
  }

  export type MateriaGradosCountOrderByAggregateInput = {
    id?: SortOrder
    materia_id?: SortOrder
    grado_id?: SortOrder
    created_at?: SortOrder
  }

  export type MateriaGradosAvgOrderByAggregateInput = {
    id?: SortOrder
    materia_id?: SortOrder
    grado_id?: SortOrder
  }

  export type MateriaGradosMaxOrderByAggregateInput = {
    id?: SortOrder
    materia_id?: SortOrder
    grado_id?: SortOrder
    created_at?: SortOrder
  }

  export type MateriaGradosMinOrderByAggregateInput = {
    id?: SortOrder
    materia_id?: SortOrder
    grado_id?: SortOrder
    created_at?: SortOrder
  }

  export type MateriaGradosSumOrderByAggregateInput = {
    id?: SortOrder
    materia_id?: SortOrder
    grado_id?: SortOrder
  }

  export type DocentesCountOrderByAggregateInput = {
    id?: SortOrder
    apellidos?: SortOrder
    nombres?: SortOrder
    telefono?: SortOrder
    email?: SortOrder
    institucion_id?: SortOrder
    sede_id?: SortOrder
    activo?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type DocentesAvgOrderByAggregateInput = {
    id?: SortOrder
    institucion_id?: SortOrder
    sede_id?: SortOrder
  }

  export type DocentesMaxOrderByAggregateInput = {
    id?: SortOrder
    apellidos?: SortOrder
    nombres?: SortOrder
    telefono?: SortOrder
    email?: SortOrder
    institucion_id?: SortOrder
    sede_id?: SortOrder
    activo?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type DocentesMinOrderByAggregateInput = {
    id?: SortOrder
    apellidos?: SortOrder
    nombres?: SortOrder
    telefono?: SortOrder
    email?: SortOrder
    institucion_id?: SortOrder
    sede_id?: SortOrder
    activo?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type DocentesSumOrderByAggregateInput = {
    id?: SortOrder
    institucion_id?: SortOrder
    sede_id?: SortOrder
  }

  export type DocentesScalarRelationFilter = {
    is?: DocentesWhereInput
    isNot?: DocentesWhereInput
  }

  export type CursosScalarRelationFilter = {
    is?: CursosWhereInput
    isNot?: CursosWhereInput
  }

  export type DocenteAsignacionesDocente_idCurso_idMateria_idCompoundUniqueInput = {
    docente_id: number
    curso_id: number
    materia_id: number
  }

  export type DocenteAsignacionesCountOrderByAggregateInput = {
    id?: SortOrder
    docente_id?: SortOrder
    curso_id?: SortOrder
    materia_id?: SortOrder
    created_at?: SortOrder
  }

  export type DocenteAsignacionesAvgOrderByAggregateInput = {
    id?: SortOrder
    docente_id?: SortOrder
    curso_id?: SortOrder
    materia_id?: SortOrder
  }

  export type DocenteAsignacionesMaxOrderByAggregateInput = {
    id?: SortOrder
    docente_id?: SortOrder
    curso_id?: SortOrder
    materia_id?: SortOrder
    created_at?: SortOrder
  }

  export type DocenteAsignacionesMinOrderByAggregateInput = {
    id?: SortOrder
    docente_id?: SortOrder
    curso_id?: SortOrder
    materia_id?: SortOrder
    created_at?: SortOrder
  }

  export type DocenteAsignacionesSumOrderByAggregateInput = {
    id?: SortOrder
    docente_id?: SortOrder
    curso_id?: SortOrder
    materia_id?: SortOrder
  }

  export type EstudiantesCodigo_estudiantilInstitucion_idCompoundUniqueInput = {
    codigo_estudiantil: string
    institucion_id: number
  }

  export type EstudiantesCountOrderByAggregateInput = {
    id?: SortOrder
    apellidos?: SortOrder
    nombres?: SortOrder
    codigo_estudiantil?: SortOrder
    nombre_acudiente?: SortOrder
    correo_acudiente?: SortOrder
    telefono_acudiente?: SortOrder
    curso_id?: SortOrder
    institucion_id?: SortOrder
    activo?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type EstudiantesAvgOrderByAggregateInput = {
    id?: SortOrder
    curso_id?: SortOrder
    institucion_id?: SortOrder
  }

  export type EstudiantesMaxOrderByAggregateInput = {
    id?: SortOrder
    apellidos?: SortOrder
    nombres?: SortOrder
    codigo_estudiantil?: SortOrder
    nombre_acudiente?: SortOrder
    correo_acudiente?: SortOrder
    telefono_acudiente?: SortOrder
    curso_id?: SortOrder
    institucion_id?: SortOrder
    activo?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type EstudiantesMinOrderByAggregateInput = {
    id?: SortOrder
    apellidos?: SortOrder
    nombres?: SortOrder
    codigo_estudiantil?: SortOrder
    nombre_acudiente?: SortOrder
    correo_acudiente?: SortOrder
    telefono_acudiente?: SortOrder
    curso_id?: SortOrder
    institucion_id?: SortOrder
    activo?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type EstudiantesSumOrderByAggregateInput = {
    id?: SortOrder
    curso_id?: SortOrder
    institucion_id?: SortOrder
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

  export type GradosCreateNestedManyWithoutInstitucionInput = {
    create?: XOR<GradosCreateWithoutInstitucionInput, GradosUncheckedCreateWithoutInstitucionInput> | GradosCreateWithoutInstitucionInput[] | GradosUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: GradosCreateOrConnectWithoutInstitucionInput | GradosCreateOrConnectWithoutInstitucionInput[]
    createMany?: GradosCreateManyInstitucionInputEnvelope
    connect?: GradosWhereUniqueInput | GradosWhereUniqueInput[]
  }

  export type CursosCreateNestedManyWithoutInstitucionInput = {
    create?: XOR<CursosCreateWithoutInstitucionInput, CursosUncheckedCreateWithoutInstitucionInput> | CursosCreateWithoutInstitucionInput[] | CursosUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: CursosCreateOrConnectWithoutInstitucionInput | CursosCreateOrConnectWithoutInstitucionInput[]
    createMany?: CursosCreateManyInstitucionInputEnvelope
    connect?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
  }

  export type AreasCreateNestedManyWithoutInstitucionInput = {
    create?: XOR<AreasCreateWithoutInstitucionInput, AreasUncheckedCreateWithoutInstitucionInput> | AreasCreateWithoutInstitucionInput[] | AreasUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: AreasCreateOrConnectWithoutInstitucionInput | AreasCreateOrConnectWithoutInstitucionInput[]
    createMany?: AreasCreateManyInstitucionInputEnvelope
    connect?: AreasWhereUniqueInput | AreasWhereUniqueInput[]
  }

  export type MateriasCreateNestedManyWithoutInstitucionInput = {
    create?: XOR<MateriasCreateWithoutInstitucionInput, MateriasUncheckedCreateWithoutInstitucionInput> | MateriasCreateWithoutInstitucionInput[] | MateriasUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: MateriasCreateOrConnectWithoutInstitucionInput | MateriasCreateOrConnectWithoutInstitucionInput[]
    createMany?: MateriasCreateManyInstitucionInputEnvelope
    connect?: MateriasWhereUniqueInput | MateriasWhereUniqueInput[]
  }

  export type DocentesCreateNestedManyWithoutInstitucionInput = {
    create?: XOR<DocentesCreateWithoutInstitucionInput, DocentesUncheckedCreateWithoutInstitucionInput> | DocentesCreateWithoutInstitucionInput[] | DocentesUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: DocentesCreateOrConnectWithoutInstitucionInput | DocentesCreateOrConnectWithoutInstitucionInput[]
    createMany?: DocentesCreateManyInstitucionInputEnvelope
    connect?: DocentesWhereUniqueInput | DocentesWhereUniqueInput[]
  }

  export type EstudiantesCreateNestedManyWithoutInstitucionInput = {
    create?: XOR<EstudiantesCreateWithoutInstitucionInput, EstudiantesUncheckedCreateWithoutInstitucionInput> | EstudiantesCreateWithoutInstitucionInput[] | EstudiantesUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: EstudiantesCreateOrConnectWithoutInstitucionInput | EstudiantesCreateOrConnectWithoutInstitucionInput[]
    createMany?: EstudiantesCreateManyInstitucionInputEnvelope
    connect?: EstudiantesWhereUniqueInput | EstudiantesWhereUniqueInput[]
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

  export type GradosUncheckedCreateNestedManyWithoutInstitucionInput = {
    create?: XOR<GradosCreateWithoutInstitucionInput, GradosUncheckedCreateWithoutInstitucionInput> | GradosCreateWithoutInstitucionInput[] | GradosUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: GradosCreateOrConnectWithoutInstitucionInput | GradosCreateOrConnectWithoutInstitucionInput[]
    createMany?: GradosCreateManyInstitucionInputEnvelope
    connect?: GradosWhereUniqueInput | GradosWhereUniqueInput[]
  }

  export type CursosUncheckedCreateNestedManyWithoutInstitucionInput = {
    create?: XOR<CursosCreateWithoutInstitucionInput, CursosUncheckedCreateWithoutInstitucionInput> | CursosCreateWithoutInstitucionInput[] | CursosUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: CursosCreateOrConnectWithoutInstitucionInput | CursosCreateOrConnectWithoutInstitucionInput[]
    createMany?: CursosCreateManyInstitucionInputEnvelope
    connect?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
  }

  export type AreasUncheckedCreateNestedManyWithoutInstitucionInput = {
    create?: XOR<AreasCreateWithoutInstitucionInput, AreasUncheckedCreateWithoutInstitucionInput> | AreasCreateWithoutInstitucionInput[] | AreasUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: AreasCreateOrConnectWithoutInstitucionInput | AreasCreateOrConnectWithoutInstitucionInput[]
    createMany?: AreasCreateManyInstitucionInputEnvelope
    connect?: AreasWhereUniqueInput | AreasWhereUniqueInput[]
  }

  export type MateriasUncheckedCreateNestedManyWithoutInstitucionInput = {
    create?: XOR<MateriasCreateWithoutInstitucionInput, MateriasUncheckedCreateWithoutInstitucionInput> | MateriasCreateWithoutInstitucionInput[] | MateriasUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: MateriasCreateOrConnectWithoutInstitucionInput | MateriasCreateOrConnectWithoutInstitucionInput[]
    createMany?: MateriasCreateManyInstitucionInputEnvelope
    connect?: MateriasWhereUniqueInput | MateriasWhereUniqueInput[]
  }

  export type DocentesUncheckedCreateNestedManyWithoutInstitucionInput = {
    create?: XOR<DocentesCreateWithoutInstitucionInput, DocentesUncheckedCreateWithoutInstitucionInput> | DocentesCreateWithoutInstitucionInput[] | DocentesUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: DocentesCreateOrConnectWithoutInstitucionInput | DocentesCreateOrConnectWithoutInstitucionInput[]
    createMany?: DocentesCreateManyInstitucionInputEnvelope
    connect?: DocentesWhereUniqueInput | DocentesWhereUniqueInput[]
  }

  export type EstudiantesUncheckedCreateNestedManyWithoutInstitucionInput = {
    create?: XOR<EstudiantesCreateWithoutInstitucionInput, EstudiantesUncheckedCreateWithoutInstitucionInput> | EstudiantesCreateWithoutInstitucionInput[] | EstudiantesUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: EstudiantesCreateOrConnectWithoutInstitucionInput | EstudiantesCreateOrConnectWithoutInstitucionInput[]
    createMany?: EstudiantesCreateManyInstitucionInputEnvelope
    connect?: EstudiantesWhereUniqueInput | EstudiantesWhereUniqueInput[]
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

  export type GradosUpdateManyWithoutInstitucionNestedInput = {
    create?: XOR<GradosCreateWithoutInstitucionInput, GradosUncheckedCreateWithoutInstitucionInput> | GradosCreateWithoutInstitucionInput[] | GradosUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: GradosCreateOrConnectWithoutInstitucionInput | GradosCreateOrConnectWithoutInstitucionInput[]
    upsert?: GradosUpsertWithWhereUniqueWithoutInstitucionInput | GradosUpsertWithWhereUniqueWithoutInstitucionInput[]
    createMany?: GradosCreateManyInstitucionInputEnvelope
    set?: GradosWhereUniqueInput | GradosWhereUniqueInput[]
    disconnect?: GradosWhereUniqueInput | GradosWhereUniqueInput[]
    delete?: GradosWhereUniqueInput | GradosWhereUniqueInput[]
    connect?: GradosWhereUniqueInput | GradosWhereUniqueInput[]
    update?: GradosUpdateWithWhereUniqueWithoutInstitucionInput | GradosUpdateWithWhereUniqueWithoutInstitucionInput[]
    updateMany?: GradosUpdateManyWithWhereWithoutInstitucionInput | GradosUpdateManyWithWhereWithoutInstitucionInput[]
    deleteMany?: GradosScalarWhereInput | GradosScalarWhereInput[]
  }

  export type CursosUpdateManyWithoutInstitucionNestedInput = {
    create?: XOR<CursosCreateWithoutInstitucionInput, CursosUncheckedCreateWithoutInstitucionInput> | CursosCreateWithoutInstitucionInput[] | CursosUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: CursosCreateOrConnectWithoutInstitucionInput | CursosCreateOrConnectWithoutInstitucionInput[]
    upsert?: CursosUpsertWithWhereUniqueWithoutInstitucionInput | CursosUpsertWithWhereUniqueWithoutInstitucionInput[]
    createMany?: CursosCreateManyInstitucionInputEnvelope
    set?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
    disconnect?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
    delete?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
    connect?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
    update?: CursosUpdateWithWhereUniqueWithoutInstitucionInput | CursosUpdateWithWhereUniqueWithoutInstitucionInput[]
    updateMany?: CursosUpdateManyWithWhereWithoutInstitucionInput | CursosUpdateManyWithWhereWithoutInstitucionInput[]
    deleteMany?: CursosScalarWhereInput | CursosScalarWhereInput[]
  }

  export type AreasUpdateManyWithoutInstitucionNestedInput = {
    create?: XOR<AreasCreateWithoutInstitucionInput, AreasUncheckedCreateWithoutInstitucionInput> | AreasCreateWithoutInstitucionInput[] | AreasUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: AreasCreateOrConnectWithoutInstitucionInput | AreasCreateOrConnectWithoutInstitucionInput[]
    upsert?: AreasUpsertWithWhereUniqueWithoutInstitucionInput | AreasUpsertWithWhereUniqueWithoutInstitucionInput[]
    createMany?: AreasCreateManyInstitucionInputEnvelope
    set?: AreasWhereUniqueInput | AreasWhereUniqueInput[]
    disconnect?: AreasWhereUniqueInput | AreasWhereUniqueInput[]
    delete?: AreasWhereUniqueInput | AreasWhereUniqueInput[]
    connect?: AreasWhereUniqueInput | AreasWhereUniqueInput[]
    update?: AreasUpdateWithWhereUniqueWithoutInstitucionInput | AreasUpdateWithWhereUniqueWithoutInstitucionInput[]
    updateMany?: AreasUpdateManyWithWhereWithoutInstitucionInput | AreasUpdateManyWithWhereWithoutInstitucionInput[]
    deleteMany?: AreasScalarWhereInput | AreasScalarWhereInput[]
  }

  export type MateriasUpdateManyWithoutInstitucionNestedInput = {
    create?: XOR<MateriasCreateWithoutInstitucionInput, MateriasUncheckedCreateWithoutInstitucionInput> | MateriasCreateWithoutInstitucionInput[] | MateriasUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: MateriasCreateOrConnectWithoutInstitucionInput | MateriasCreateOrConnectWithoutInstitucionInput[]
    upsert?: MateriasUpsertWithWhereUniqueWithoutInstitucionInput | MateriasUpsertWithWhereUniqueWithoutInstitucionInput[]
    createMany?: MateriasCreateManyInstitucionInputEnvelope
    set?: MateriasWhereUniqueInput | MateriasWhereUniqueInput[]
    disconnect?: MateriasWhereUniqueInput | MateriasWhereUniqueInput[]
    delete?: MateriasWhereUniqueInput | MateriasWhereUniqueInput[]
    connect?: MateriasWhereUniqueInput | MateriasWhereUniqueInput[]
    update?: MateriasUpdateWithWhereUniqueWithoutInstitucionInput | MateriasUpdateWithWhereUniqueWithoutInstitucionInput[]
    updateMany?: MateriasUpdateManyWithWhereWithoutInstitucionInput | MateriasUpdateManyWithWhereWithoutInstitucionInput[]
    deleteMany?: MateriasScalarWhereInput | MateriasScalarWhereInput[]
  }

  export type DocentesUpdateManyWithoutInstitucionNestedInput = {
    create?: XOR<DocentesCreateWithoutInstitucionInput, DocentesUncheckedCreateWithoutInstitucionInput> | DocentesCreateWithoutInstitucionInput[] | DocentesUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: DocentesCreateOrConnectWithoutInstitucionInput | DocentesCreateOrConnectWithoutInstitucionInput[]
    upsert?: DocentesUpsertWithWhereUniqueWithoutInstitucionInput | DocentesUpsertWithWhereUniqueWithoutInstitucionInput[]
    createMany?: DocentesCreateManyInstitucionInputEnvelope
    set?: DocentesWhereUniqueInput | DocentesWhereUniqueInput[]
    disconnect?: DocentesWhereUniqueInput | DocentesWhereUniqueInput[]
    delete?: DocentesWhereUniqueInput | DocentesWhereUniqueInput[]
    connect?: DocentesWhereUniqueInput | DocentesWhereUniqueInput[]
    update?: DocentesUpdateWithWhereUniqueWithoutInstitucionInput | DocentesUpdateWithWhereUniqueWithoutInstitucionInput[]
    updateMany?: DocentesUpdateManyWithWhereWithoutInstitucionInput | DocentesUpdateManyWithWhereWithoutInstitucionInput[]
    deleteMany?: DocentesScalarWhereInput | DocentesScalarWhereInput[]
  }

  export type EstudiantesUpdateManyWithoutInstitucionNestedInput = {
    create?: XOR<EstudiantesCreateWithoutInstitucionInput, EstudiantesUncheckedCreateWithoutInstitucionInput> | EstudiantesCreateWithoutInstitucionInput[] | EstudiantesUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: EstudiantesCreateOrConnectWithoutInstitucionInput | EstudiantesCreateOrConnectWithoutInstitucionInput[]
    upsert?: EstudiantesUpsertWithWhereUniqueWithoutInstitucionInput | EstudiantesUpsertWithWhereUniqueWithoutInstitucionInput[]
    createMany?: EstudiantesCreateManyInstitucionInputEnvelope
    set?: EstudiantesWhereUniqueInput | EstudiantesWhereUniqueInput[]
    disconnect?: EstudiantesWhereUniqueInput | EstudiantesWhereUniqueInput[]
    delete?: EstudiantesWhereUniqueInput | EstudiantesWhereUniqueInput[]
    connect?: EstudiantesWhereUniqueInput | EstudiantesWhereUniqueInput[]
    update?: EstudiantesUpdateWithWhereUniqueWithoutInstitucionInput | EstudiantesUpdateWithWhereUniqueWithoutInstitucionInput[]
    updateMany?: EstudiantesUpdateManyWithWhereWithoutInstitucionInput | EstudiantesUpdateManyWithWhereWithoutInstitucionInput[]
    deleteMany?: EstudiantesScalarWhereInput | EstudiantesScalarWhereInput[]
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

  export type GradosUncheckedUpdateManyWithoutInstitucionNestedInput = {
    create?: XOR<GradosCreateWithoutInstitucionInput, GradosUncheckedCreateWithoutInstitucionInput> | GradosCreateWithoutInstitucionInput[] | GradosUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: GradosCreateOrConnectWithoutInstitucionInput | GradosCreateOrConnectWithoutInstitucionInput[]
    upsert?: GradosUpsertWithWhereUniqueWithoutInstitucionInput | GradosUpsertWithWhereUniqueWithoutInstitucionInput[]
    createMany?: GradosCreateManyInstitucionInputEnvelope
    set?: GradosWhereUniqueInput | GradosWhereUniqueInput[]
    disconnect?: GradosWhereUniqueInput | GradosWhereUniqueInput[]
    delete?: GradosWhereUniqueInput | GradosWhereUniqueInput[]
    connect?: GradosWhereUniqueInput | GradosWhereUniqueInput[]
    update?: GradosUpdateWithWhereUniqueWithoutInstitucionInput | GradosUpdateWithWhereUniqueWithoutInstitucionInput[]
    updateMany?: GradosUpdateManyWithWhereWithoutInstitucionInput | GradosUpdateManyWithWhereWithoutInstitucionInput[]
    deleteMany?: GradosScalarWhereInput | GradosScalarWhereInput[]
  }

  export type CursosUncheckedUpdateManyWithoutInstitucionNestedInput = {
    create?: XOR<CursosCreateWithoutInstitucionInput, CursosUncheckedCreateWithoutInstitucionInput> | CursosCreateWithoutInstitucionInput[] | CursosUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: CursosCreateOrConnectWithoutInstitucionInput | CursosCreateOrConnectWithoutInstitucionInput[]
    upsert?: CursosUpsertWithWhereUniqueWithoutInstitucionInput | CursosUpsertWithWhereUniqueWithoutInstitucionInput[]
    createMany?: CursosCreateManyInstitucionInputEnvelope
    set?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
    disconnect?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
    delete?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
    connect?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
    update?: CursosUpdateWithWhereUniqueWithoutInstitucionInput | CursosUpdateWithWhereUniqueWithoutInstitucionInput[]
    updateMany?: CursosUpdateManyWithWhereWithoutInstitucionInput | CursosUpdateManyWithWhereWithoutInstitucionInput[]
    deleteMany?: CursosScalarWhereInput | CursosScalarWhereInput[]
  }

  export type AreasUncheckedUpdateManyWithoutInstitucionNestedInput = {
    create?: XOR<AreasCreateWithoutInstitucionInput, AreasUncheckedCreateWithoutInstitucionInput> | AreasCreateWithoutInstitucionInput[] | AreasUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: AreasCreateOrConnectWithoutInstitucionInput | AreasCreateOrConnectWithoutInstitucionInput[]
    upsert?: AreasUpsertWithWhereUniqueWithoutInstitucionInput | AreasUpsertWithWhereUniqueWithoutInstitucionInput[]
    createMany?: AreasCreateManyInstitucionInputEnvelope
    set?: AreasWhereUniqueInput | AreasWhereUniqueInput[]
    disconnect?: AreasWhereUniqueInput | AreasWhereUniqueInput[]
    delete?: AreasWhereUniqueInput | AreasWhereUniqueInput[]
    connect?: AreasWhereUniqueInput | AreasWhereUniqueInput[]
    update?: AreasUpdateWithWhereUniqueWithoutInstitucionInput | AreasUpdateWithWhereUniqueWithoutInstitucionInput[]
    updateMany?: AreasUpdateManyWithWhereWithoutInstitucionInput | AreasUpdateManyWithWhereWithoutInstitucionInput[]
    deleteMany?: AreasScalarWhereInput | AreasScalarWhereInput[]
  }

  export type MateriasUncheckedUpdateManyWithoutInstitucionNestedInput = {
    create?: XOR<MateriasCreateWithoutInstitucionInput, MateriasUncheckedCreateWithoutInstitucionInput> | MateriasCreateWithoutInstitucionInput[] | MateriasUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: MateriasCreateOrConnectWithoutInstitucionInput | MateriasCreateOrConnectWithoutInstitucionInput[]
    upsert?: MateriasUpsertWithWhereUniqueWithoutInstitucionInput | MateriasUpsertWithWhereUniqueWithoutInstitucionInput[]
    createMany?: MateriasCreateManyInstitucionInputEnvelope
    set?: MateriasWhereUniqueInput | MateriasWhereUniqueInput[]
    disconnect?: MateriasWhereUniqueInput | MateriasWhereUniqueInput[]
    delete?: MateriasWhereUniqueInput | MateriasWhereUniqueInput[]
    connect?: MateriasWhereUniqueInput | MateriasWhereUniqueInput[]
    update?: MateriasUpdateWithWhereUniqueWithoutInstitucionInput | MateriasUpdateWithWhereUniqueWithoutInstitucionInput[]
    updateMany?: MateriasUpdateManyWithWhereWithoutInstitucionInput | MateriasUpdateManyWithWhereWithoutInstitucionInput[]
    deleteMany?: MateriasScalarWhereInput | MateriasScalarWhereInput[]
  }

  export type DocentesUncheckedUpdateManyWithoutInstitucionNestedInput = {
    create?: XOR<DocentesCreateWithoutInstitucionInput, DocentesUncheckedCreateWithoutInstitucionInput> | DocentesCreateWithoutInstitucionInput[] | DocentesUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: DocentesCreateOrConnectWithoutInstitucionInput | DocentesCreateOrConnectWithoutInstitucionInput[]
    upsert?: DocentesUpsertWithWhereUniqueWithoutInstitucionInput | DocentesUpsertWithWhereUniqueWithoutInstitucionInput[]
    createMany?: DocentesCreateManyInstitucionInputEnvelope
    set?: DocentesWhereUniqueInput | DocentesWhereUniqueInput[]
    disconnect?: DocentesWhereUniqueInput | DocentesWhereUniqueInput[]
    delete?: DocentesWhereUniqueInput | DocentesWhereUniqueInput[]
    connect?: DocentesWhereUniqueInput | DocentesWhereUniqueInput[]
    update?: DocentesUpdateWithWhereUniqueWithoutInstitucionInput | DocentesUpdateWithWhereUniqueWithoutInstitucionInput[]
    updateMany?: DocentesUpdateManyWithWhereWithoutInstitucionInput | DocentesUpdateManyWithWhereWithoutInstitucionInput[]
    deleteMany?: DocentesScalarWhereInput | DocentesScalarWhereInput[]
  }

  export type EstudiantesUncheckedUpdateManyWithoutInstitucionNestedInput = {
    create?: XOR<EstudiantesCreateWithoutInstitucionInput, EstudiantesUncheckedCreateWithoutInstitucionInput> | EstudiantesCreateWithoutInstitucionInput[] | EstudiantesUncheckedCreateWithoutInstitucionInput[]
    connectOrCreate?: EstudiantesCreateOrConnectWithoutInstitucionInput | EstudiantesCreateOrConnectWithoutInstitucionInput[]
    upsert?: EstudiantesUpsertWithWhereUniqueWithoutInstitucionInput | EstudiantesUpsertWithWhereUniqueWithoutInstitucionInput[]
    createMany?: EstudiantesCreateManyInstitucionInputEnvelope
    set?: EstudiantesWhereUniqueInput | EstudiantesWhereUniqueInput[]
    disconnect?: EstudiantesWhereUniqueInput | EstudiantesWhereUniqueInput[]
    delete?: EstudiantesWhereUniqueInput | EstudiantesWhereUniqueInput[]
    connect?: EstudiantesWhereUniqueInput | EstudiantesWhereUniqueInput[]
    update?: EstudiantesUpdateWithWhereUniqueWithoutInstitucionInput | EstudiantesUpdateWithWhereUniqueWithoutInstitucionInput[]
    updateMany?: EstudiantesUpdateManyWithWhereWithoutInstitucionInput | EstudiantesUpdateManyWithWhereWithoutInstitucionInput[]
    deleteMany?: EstudiantesScalarWhereInput | EstudiantesScalarWhereInput[]
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

  export type CursosCreateNestedManyWithoutSedeInput = {
    create?: XOR<CursosCreateWithoutSedeInput, CursosUncheckedCreateWithoutSedeInput> | CursosCreateWithoutSedeInput[] | CursosUncheckedCreateWithoutSedeInput[]
    connectOrCreate?: CursosCreateOrConnectWithoutSedeInput | CursosCreateOrConnectWithoutSedeInput[]
    createMany?: CursosCreateManySedeInputEnvelope
    connect?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
  }

  export type DocentesCreateNestedManyWithoutSedeInput = {
    create?: XOR<DocentesCreateWithoutSedeInput, DocentesUncheckedCreateWithoutSedeInput> | DocentesCreateWithoutSedeInput[] | DocentesUncheckedCreateWithoutSedeInput[]
    connectOrCreate?: DocentesCreateOrConnectWithoutSedeInput | DocentesCreateOrConnectWithoutSedeInput[]
    createMany?: DocentesCreateManySedeInputEnvelope
    connect?: DocentesWhereUniqueInput | DocentesWhereUniqueInput[]
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

  export type CursosUncheckedCreateNestedManyWithoutSedeInput = {
    create?: XOR<CursosCreateWithoutSedeInput, CursosUncheckedCreateWithoutSedeInput> | CursosCreateWithoutSedeInput[] | CursosUncheckedCreateWithoutSedeInput[]
    connectOrCreate?: CursosCreateOrConnectWithoutSedeInput | CursosCreateOrConnectWithoutSedeInput[]
    createMany?: CursosCreateManySedeInputEnvelope
    connect?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
  }

  export type DocentesUncheckedCreateNestedManyWithoutSedeInput = {
    create?: XOR<DocentesCreateWithoutSedeInput, DocentesUncheckedCreateWithoutSedeInput> | DocentesCreateWithoutSedeInput[] | DocentesUncheckedCreateWithoutSedeInput[]
    connectOrCreate?: DocentesCreateOrConnectWithoutSedeInput | DocentesCreateOrConnectWithoutSedeInput[]
    createMany?: DocentesCreateManySedeInputEnvelope
    connect?: DocentesWhereUniqueInput | DocentesWhereUniqueInput[]
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

  export type CursosUpdateManyWithoutSedeNestedInput = {
    create?: XOR<CursosCreateWithoutSedeInput, CursosUncheckedCreateWithoutSedeInput> | CursosCreateWithoutSedeInput[] | CursosUncheckedCreateWithoutSedeInput[]
    connectOrCreate?: CursosCreateOrConnectWithoutSedeInput | CursosCreateOrConnectWithoutSedeInput[]
    upsert?: CursosUpsertWithWhereUniqueWithoutSedeInput | CursosUpsertWithWhereUniqueWithoutSedeInput[]
    createMany?: CursosCreateManySedeInputEnvelope
    set?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
    disconnect?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
    delete?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
    connect?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
    update?: CursosUpdateWithWhereUniqueWithoutSedeInput | CursosUpdateWithWhereUniqueWithoutSedeInput[]
    updateMany?: CursosUpdateManyWithWhereWithoutSedeInput | CursosUpdateManyWithWhereWithoutSedeInput[]
    deleteMany?: CursosScalarWhereInput | CursosScalarWhereInput[]
  }

  export type DocentesUpdateManyWithoutSedeNestedInput = {
    create?: XOR<DocentesCreateWithoutSedeInput, DocentesUncheckedCreateWithoutSedeInput> | DocentesCreateWithoutSedeInput[] | DocentesUncheckedCreateWithoutSedeInput[]
    connectOrCreate?: DocentesCreateOrConnectWithoutSedeInput | DocentesCreateOrConnectWithoutSedeInput[]
    upsert?: DocentesUpsertWithWhereUniqueWithoutSedeInput | DocentesUpsertWithWhereUniqueWithoutSedeInput[]
    createMany?: DocentesCreateManySedeInputEnvelope
    set?: DocentesWhereUniqueInput | DocentesWhereUniqueInput[]
    disconnect?: DocentesWhereUniqueInput | DocentesWhereUniqueInput[]
    delete?: DocentesWhereUniqueInput | DocentesWhereUniqueInput[]
    connect?: DocentesWhereUniqueInput | DocentesWhereUniqueInput[]
    update?: DocentesUpdateWithWhereUniqueWithoutSedeInput | DocentesUpdateWithWhereUniqueWithoutSedeInput[]
    updateMany?: DocentesUpdateManyWithWhereWithoutSedeInput | DocentesUpdateManyWithWhereWithoutSedeInput[]
    deleteMany?: DocentesScalarWhereInput | DocentesScalarWhereInput[]
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

  export type CursosUncheckedUpdateManyWithoutSedeNestedInput = {
    create?: XOR<CursosCreateWithoutSedeInput, CursosUncheckedCreateWithoutSedeInput> | CursosCreateWithoutSedeInput[] | CursosUncheckedCreateWithoutSedeInput[]
    connectOrCreate?: CursosCreateOrConnectWithoutSedeInput | CursosCreateOrConnectWithoutSedeInput[]
    upsert?: CursosUpsertWithWhereUniqueWithoutSedeInput | CursosUpsertWithWhereUniqueWithoutSedeInput[]
    createMany?: CursosCreateManySedeInputEnvelope
    set?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
    disconnect?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
    delete?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
    connect?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
    update?: CursosUpdateWithWhereUniqueWithoutSedeInput | CursosUpdateWithWhereUniqueWithoutSedeInput[]
    updateMany?: CursosUpdateManyWithWhereWithoutSedeInput | CursosUpdateManyWithWhereWithoutSedeInput[]
    deleteMany?: CursosScalarWhereInput | CursosScalarWhereInput[]
  }

  export type DocentesUncheckedUpdateManyWithoutSedeNestedInput = {
    create?: XOR<DocentesCreateWithoutSedeInput, DocentesUncheckedCreateWithoutSedeInput> | DocentesCreateWithoutSedeInput[] | DocentesUncheckedCreateWithoutSedeInput[]
    connectOrCreate?: DocentesCreateOrConnectWithoutSedeInput | DocentesCreateOrConnectWithoutSedeInput[]
    upsert?: DocentesUpsertWithWhereUniqueWithoutSedeInput | DocentesUpsertWithWhereUniqueWithoutSedeInput[]
    createMany?: DocentesCreateManySedeInputEnvelope
    set?: DocentesWhereUniqueInput | DocentesWhereUniqueInput[]
    disconnect?: DocentesWhereUniqueInput | DocentesWhereUniqueInput[]
    delete?: DocentesWhereUniqueInput | DocentesWhereUniqueInput[]
    connect?: DocentesWhereUniqueInput | DocentesWhereUniqueInput[]
    update?: DocentesUpdateWithWhereUniqueWithoutSedeInput | DocentesUpdateWithWhereUniqueWithoutSedeInput[]
    updateMany?: DocentesUpdateManyWithWhereWithoutSedeInput | DocentesUpdateManyWithWhereWithoutSedeInput[]
    deleteMany?: DocentesScalarWhereInput | DocentesScalarWhereInput[]
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

  export type InstitucionesCreateNestedOneWithoutGradosInput = {
    create?: XOR<InstitucionesCreateWithoutGradosInput, InstitucionesUncheckedCreateWithoutGradosInput>
    connectOrCreate?: InstitucionesCreateOrConnectWithoutGradosInput
    connect?: InstitucionesWhereUniqueInput
  }

  export type CursosCreateNestedManyWithoutGradoInput = {
    create?: XOR<CursosCreateWithoutGradoInput, CursosUncheckedCreateWithoutGradoInput> | CursosCreateWithoutGradoInput[] | CursosUncheckedCreateWithoutGradoInput[]
    connectOrCreate?: CursosCreateOrConnectWithoutGradoInput | CursosCreateOrConnectWithoutGradoInput[]
    createMany?: CursosCreateManyGradoInputEnvelope
    connect?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
  }

  export type MateriaGradosCreateNestedManyWithoutGradoInput = {
    create?: XOR<MateriaGradosCreateWithoutGradoInput, MateriaGradosUncheckedCreateWithoutGradoInput> | MateriaGradosCreateWithoutGradoInput[] | MateriaGradosUncheckedCreateWithoutGradoInput[]
    connectOrCreate?: MateriaGradosCreateOrConnectWithoutGradoInput | MateriaGradosCreateOrConnectWithoutGradoInput[]
    createMany?: MateriaGradosCreateManyGradoInputEnvelope
    connect?: MateriaGradosWhereUniqueInput | MateriaGradosWhereUniqueInput[]
  }

  export type CursosUncheckedCreateNestedManyWithoutGradoInput = {
    create?: XOR<CursosCreateWithoutGradoInput, CursosUncheckedCreateWithoutGradoInput> | CursosCreateWithoutGradoInput[] | CursosUncheckedCreateWithoutGradoInput[]
    connectOrCreate?: CursosCreateOrConnectWithoutGradoInput | CursosCreateOrConnectWithoutGradoInput[]
    createMany?: CursosCreateManyGradoInputEnvelope
    connect?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
  }

  export type MateriaGradosUncheckedCreateNestedManyWithoutGradoInput = {
    create?: XOR<MateriaGradosCreateWithoutGradoInput, MateriaGradosUncheckedCreateWithoutGradoInput> | MateriaGradosCreateWithoutGradoInput[] | MateriaGradosUncheckedCreateWithoutGradoInput[]
    connectOrCreate?: MateriaGradosCreateOrConnectWithoutGradoInput | MateriaGradosCreateOrConnectWithoutGradoInput[]
    createMany?: MateriaGradosCreateManyGradoInputEnvelope
    connect?: MateriaGradosWhereUniqueInput | MateriaGradosWhereUniqueInput[]
  }

  export type InstitucionesUpdateOneRequiredWithoutGradosNestedInput = {
    create?: XOR<InstitucionesCreateWithoutGradosInput, InstitucionesUncheckedCreateWithoutGradosInput>
    connectOrCreate?: InstitucionesCreateOrConnectWithoutGradosInput
    upsert?: InstitucionesUpsertWithoutGradosInput
    connect?: InstitucionesWhereUniqueInput
    update?: XOR<XOR<InstitucionesUpdateToOneWithWhereWithoutGradosInput, InstitucionesUpdateWithoutGradosInput>, InstitucionesUncheckedUpdateWithoutGradosInput>
  }

  export type CursosUpdateManyWithoutGradoNestedInput = {
    create?: XOR<CursosCreateWithoutGradoInput, CursosUncheckedCreateWithoutGradoInput> | CursosCreateWithoutGradoInput[] | CursosUncheckedCreateWithoutGradoInput[]
    connectOrCreate?: CursosCreateOrConnectWithoutGradoInput | CursosCreateOrConnectWithoutGradoInput[]
    upsert?: CursosUpsertWithWhereUniqueWithoutGradoInput | CursosUpsertWithWhereUniqueWithoutGradoInput[]
    createMany?: CursosCreateManyGradoInputEnvelope
    set?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
    disconnect?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
    delete?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
    connect?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
    update?: CursosUpdateWithWhereUniqueWithoutGradoInput | CursosUpdateWithWhereUniqueWithoutGradoInput[]
    updateMany?: CursosUpdateManyWithWhereWithoutGradoInput | CursosUpdateManyWithWhereWithoutGradoInput[]
    deleteMany?: CursosScalarWhereInput | CursosScalarWhereInput[]
  }

  export type MateriaGradosUpdateManyWithoutGradoNestedInput = {
    create?: XOR<MateriaGradosCreateWithoutGradoInput, MateriaGradosUncheckedCreateWithoutGradoInput> | MateriaGradosCreateWithoutGradoInput[] | MateriaGradosUncheckedCreateWithoutGradoInput[]
    connectOrCreate?: MateriaGradosCreateOrConnectWithoutGradoInput | MateriaGradosCreateOrConnectWithoutGradoInput[]
    upsert?: MateriaGradosUpsertWithWhereUniqueWithoutGradoInput | MateriaGradosUpsertWithWhereUniqueWithoutGradoInput[]
    createMany?: MateriaGradosCreateManyGradoInputEnvelope
    set?: MateriaGradosWhereUniqueInput | MateriaGradosWhereUniqueInput[]
    disconnect?: MateriaGradosWhereUniqueInput | MateriaGradosWhereUniqueInput[]
    delete?: MateriaGradosWhereUniqueInput | MateriaGradosWhereUniqueInput[]
    connect?: MateriaGradosWhereUniqueInput | MateriaGradosWhereUniqueInput[]
    update?: MateriaGradosUpdateWithWhereUniqueWithoutGradoInput | MateriaGradosUpdateWithWhereUniqueWithoutGradoInput[]
    updateMany?: MateriaGradosUpdateManyWithWhereWithoutGradoInput | MateriaGradosUpdateManyWithWhereWithoutGradoInput[]
    deleteMany?: MateriaGradosScalarWhereInput | MateriaGradosScalarWhereInput[]
  }

  export type CursosUncheckedUpdateManyWithoutGradoNestedInput = {
    create?: XOR<CursosCreateWithoutGradoInput, CursosUncheckedCreateWithoutGradoInput> | CursosCreateWithoutGradoInput[] | CursosUncheckedCreateWithoutGradoInput[]
    connectOrCreate?: CursosCreateOrConnectWithoutGradoInput | CursosCreateOrConnectWithoutGradoInput[]
    upsert?: CursosUpsertWithWhereUniqueWithoutGradoInput | CursosUpsertWithWhereUniqueWithoutGradoInput[]
    createMany?: CursosCreateManyGradoInputEnvelope
    set?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
    disconnect?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
    delete?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
    connect?: CursosWhereUniqueInput | CursosWhereUniqueInput[]
    update?: CursosUpdateWithWhereUniqueWithoutGradoInput | CursosUpdateWithWhereUniqueWithoutGradoInput[]
    updateMany?: CursosUpdateManyWithWhereWithoutGradoInput | CursosUpdateManyWithWhereWithoutGradoInput[]
    deleteMany?: CursosScalarWhereInput | CursosScalarWhereInput[]
  }

  export type MateriaGradosUncheckedUpdateManyWithoutGradoNestedInput = {
    create?: XOR<MateriaGradosCreateWithoutGradoInput, MateriaGradosUncheckedCreateWithoutGradoInput> | MateriaGradosCreateWithoutGradoInput[] | MateriaGradosUncheckedCreateWithoutGradoInput[]
    connectOrCreate?: MateriaGradosCreateOrConnectWithoutGradoInput | MateriaGradosCreateOrConnectWithoutGradoInput[]
    upsert?: MateriaGradosUpsertWithWhereUniqueWithoutGradoInput | MateriaGradosUpsertWithWhereUniqueWithoutGradoInput[]
    createMany?: MateriaGradosCreateManyGradoInputEnvelope
    set?: MateriaGradosWhereUniqueInput | MateriaGradosWhereUniqueInput[]
    disconnect?: MateriaGradosWhereUniqueInput | MateriaGradosWhereUniqueInput[]
    delete?: MateriaGradosWhereUniqueInput | MateriaGradosWhereUniqueInput[]
    connect?: MateriaGradosWhereUniqueInput | MateriaGradosWhereUniqueInput[]
    update?: MateriaGradosUpdateWithWhereUniqueWithoutGradoInput | MateriaGradosUpdateWithWhereUniqueWithoutGradoInput[]
    updateMany?: MateriaGradosUpdateManyWithWhereWithoutGradoInput | MateriaGradosUpdateManyWithWhereWithoutGradoInput[]
    deleteMany?: MateriaGradosScalarWhereInput | MateriaGradosScalarWhereInput[]
  }

  export type GradosCreateNestedOneWithoutCursosInput = {
    create?: XOR<GradosCreateWithoutCursosInput, GradosUncheckedCreateWithoutCursosInput>
    connectOrCreate?: GradosCreateOrConnectWithoutCursosInput
    connect?: GradosWhereUniqueInput
  }

  export type InstitucionesCreateNestedOneWithoutCursosInput = {
    create?: XOR<InstitucionesCreateWithoutCursosInput, InstitucionesUncheckedCreateWithoutCursosInput>
    connectOrCreate?: InstitucionesCreateOrConnectWithoutCursosInput
    connect?: InstitucionesWhereUniqueInput
  }

  export type SedesCreateNestedOneWithoutCursosInput = {
    create?: XOR<SedesCreateWithoutCursosInput, SedesUncheckedCreateWithoutCursosInput>
    connectOrCreate?: SedesCreateOrConnectWithoutCursosInput
    connect?: SedesWhereUniqueInput
  }

  export type EstudiantesCreateNestedManyWithoutCursoInput = {
    create?: XOR<EstudiantesCreateWithoutCursoInput, EstudiantesUncheckedCreateWithoutCursoInput> | EstudiantesCreateWithoutCursoInput[] | EstudiantesUncheckedCreateWithoutCursoInput[]
    connectOrCreate?: EstudiantesCreateOrConnectWithoutCursoInput | EstudiantesCreateOrConnectWithoutCursoInput[]
    createMany?: EstudiantesCreateManyCursoInputEnvelope
    connect?: EstudiantesWhereUniqueInput | EstudiantesWhereUniqueInput[]
  }

  export type DocenteAsignacionesCreateNestedManyWithoutCursoInput = {
    create?: XOR<DocenteAsignacionesCreateWithoutCursoInput, DocenteAsignacionesUncheckedCreateWithoutCursoInput> | DocenteAsignacionesCreateWithoutCursoInput[] | DocenteAsignacionesUncheckedCreateWithoutCursoInput[]
    connectOrCreate?: DocenteAsignacionesCreateOrConnectWithoutCursoInput | DocenteAsignacionesCreateOrConnectWithoutCursoInput[]
    createMany?: DocenteAsignacionesCreateManyCursoInputEnvelope
    connect?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
  }

  export type EstudiantesUncheckedCreateNestedManyWithoutCursoInput = {
    create?: XOR<EstudiantesCreateWithoutCursoInput, EstudiantesUncheckedCreateWithoutCursoInput> | EstudiantesCreateWithoutCursoInput[] | EstudiantesUncheckedCreateWithoutCursoInput[]
    connectOrCreate?: EstudiantesCreateOrConnectWithoutCursoInput | EstudiantesCreateOrConnectWithoutCursoInput[]
    createMany?: EstudiantesCreateManyCursoInputEnvelope
    connect?: EstudiantesWhereUniqueInput | EstudiantesWhereUniqueInput[]
  }

  export type DocenteAsignacionesUncheckedCreateNestedManyWithoutCursoInput = {
    create?: XOR<DocenteAsignacionesCreateWithoutCursoInput, DocenteAsignacionesUncheckedCreateWithoutCursoInput> | DocenteAsignacionesCreateWithoutCursoInput[] | DocenteAsignacionesUncheckedCreateWithoutCursoInput[]
    connectOrCreate?: DocenteAsignacionesCreateOrConnectWithoutCursoInput | DocenteAsignacionesCreateOrConnectWithoutCursoInput[]
    createMany?: DocenteAsignacionesCreateManyCursoInputEnvelope
    connect?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
  }

  export type GradosUpdateOneRequiredWithoutCursosNestedInput = {
    create?: XOR<GradosCreateWithoutCursosInput, GradosUncheckedCreateWithoutCursosInput>
    connectOrCreate?: GradosCreateOrConnectWithoutCursosInput
    upsert?: GradosUpsertWithoutCursosInput
    connect?: GradosWhereUniqueInput
    update?: XOR<XOR<GradosUpdateToOneWithWhereWithoutCursosInput, GradosUpdateWithoutCursosInput>, GradosUncheckedUpdateWithoutCursosInput>
  }

  export type InstitucionesUpdateOneRequiredWithoutCursosNestedInput = {
    create?: XOR<InstitucionesCreateWithoutCursosInput, InstitucionesUncheckedCreateWithoutCursosInput>
    connectOrCreate?: InstitucionesCreateOrConnectWithoutCursosInput
    upsert?: InstitucionesUpsertWithoutCursosInput
    connect?: InstitucionesWhereUniqueInput
    update?: XOR<XOR<InstitucionesUpdateToOneWithWhereWithoutCursosInput, InstitucionesUpdateWithoutCursosInput>, InstitucionesUncheckedUpdateWithoutCursosInput>
  }

  export type SedesUpdateOneWithoutCursosNestedInput = {
    create?: XOR<SedesCreateWithoutCursosInput, SedesUncheckedCreateWithoutCursosInput>
    connectOrCreate?: SedesCreateOrConnectWithoutCursosInput
    upsert?: SedesUpsertWithoutCursosInput
    disconnect?: SedesWhereInput | boolean
    delete?: SedesWhereInput | boolean
    connect?: SedesWhereUniqueInput
    update?: XOR<XOR<SedesUpdateToOneWithWhereWithoutCursosInput, SedesUpdateWithoutCursosInput>, SedesUncheckedUpdateWithoutCursosInput>
  }

  export type EstudiantesUpdateManyWithoutCursoNestedInput = {
    create?: XOR<EstudiantesCreateWithoutCursoInput, EstudiantesUncheckedCreateWithoutCursoInput> | EstudiantesCreateWithoutCursoInput[] | EstudiantesUncheckedCreateWithoutCursoInput[]
    connectOrCreate?: EstudiantesCreateOrConnectWithoutCursoInput | EstudiantesCreateOrConnectWithoutCursoInput[]
    upsert?: EstudiantesUpsertWithWhereUniqueWithoutCursoInput | EstudiantesUpsertWithWhereUniqueWithoutCursoInput[]
    createMany?: EstudiantesCreateManyCursoInputEnvelope
    set?: EstudiantesWhereUniqueInput | EstudiantesWhereUniqueInput[]
    disconnect?: EstudiantesWhereUniqueInput | EstudiantesWhereUniqueInput[]
    delete?: EstudiantesWhereUniqueInput | EstudiantesWhereUniqueInput[]
    connect?: EstudiantesWhereUniqueInput | EstudiantesWhereUniqueInput[]
    update?: EstudiantesUpdateWithWhereUniqueWithoutCursoInput | EstudiantesUpdateWithWhereUniqueWithoutCursoInput[]
    updateMany?: EstudiantesUpdateManyWithWhereWithoutCursoInput | EstudiantesUpdateManyWithWhereWithoutCursoInput[]
    deleteMany?: EstudiantesScalarWhereInput | EstudiantesScalarWhereInput[]
  }

  export type DocenteAsignacionesUpdateManyWithoutCursoNestedInput = {
    create?: XOR<DocenteAsignacionesCreateWithoutCursoInput, DocenteAsignacionesUncheckedCreateWithoutCursoInput> | DocenteAsignacionesCreateWithoutCursoInput[] | DocenteAsignacionesUncheckedCreateWithoutCursoInput[]
    connectOrCreate?: DocenteAsignacionesCreateOrConnectWithoutCursoInput | DocenteAsignacionesCreateOrConnectWithoutCursoInput[]
    upsert?: DocenteAsignacionesUpsertWithWhereUniqueWithoutCursoInput | DocenteAsignacionesUpsertWithWhereUniqueWithoutCursoInput[]
    createMany?: DocenteAsignacionesCreateManyCursoInputEnvelope
    set?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
    disconnect?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
    delete?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
    connect?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
    update?: DocenteAsignacionesUpdateWithWhereUniqueWithoutCursoInput | DocenteAsignacionesUpdateWithWhereUniqueWithoutCursoInput[]
    updateMany?: DocenteAsignacionesUpdateManyWithWhereWithoutCursoInput | DocenteAsignacionesUpdateManyWithWhereWithoutCursoInput[]
    deleteMany?: DocenteAsignacionesScalarWhereInput | DocenteAsignacionesScalarWhereInput[]
  }

  export type EstudiantesUncheckedUpdateManyWithoutCursoNestedInput = {
    create?: XOR<EstudiantesCreateWithoutCursoInput, EstudiantesUncheckedCreateWithoutCursoInput> | EstudiantesCreateWithoutCursoInput[] | EstudiantesUncheckedCreateWithoutCursoInput[]
    connectOrCreate?: EstudiantesCreateOrConnectWithoutCursoInput | EstudiantesCreateOrConnectWithoutCursoInput[]
    upsert?: EstudiantesUpsertWithWhereUniqueWithoutCursoInput | EstudiantesUpsertWithWhereUniqueWithoutCursoInput[]
    createMany?: EstudiantesCreateManyCursoInputEnvelope
    set?: EstudiantesWhereUniqueInput | EstudiantesWhereUniqueInput[]
    disconnect?: EstudiantesWhereUniqueInput | EstudiantesWhereUniqueInput[]
    delete?: EstudiantesWhereUniqueInput | EstudiantesWhereUniqueInput[]
    connect?: EstudiantesWhereUniqueInput | EstudiantesWhereUniqueInput[]
    update?: EstudiantesUpdateWithWhereUniqueWithoutCursoInput | EstudiantesUpdateWithWhereUniqueWithoutCursoInput[]
    updateMany?: EstudiantesUpdateManyWithWhereWithoutCursoInput | EstudiantesUpdateManyWithWhereWithoutCursoInput[]
    deleteMany?: EstudiantesScalarWhereInput | EstudiantesScalarWhereInput[]
  }

  export type DocenteAsignacionesUncheckedUpdateManyWithoutCursoNestedInput = {
    create?: XOR<DocenteAsignacionesCreateWithoutCursoInput, DocenteAsignacionesUncheckedCreateWithoutCursoInput> | DocenteAsignacionesCreateWithoutCursoInput[] | DocenteAsignacionesUncheckedCreateWithoutCursoInput[]
    connectOrCreate?: DocenteAsignacionesCreateOrConnectWithoutCursoInput | DocenteAsignacionesCreateOrConnectWithoutCursoInput[]
    upsert?: DocenteAsignacionesUpsertWithWhereUniqueWithoutCursoInput | DocenteAsignacionesUpsertWithWhereUniqueWithoutCursoInput[]
    createMany?: DocenteAsignacionesCreateManyCursoInputEnvelope
    set?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
    disconnect?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
    delete?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
    connect?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
    update?: DocenteAsignacionesUpdateWithWhereUniqueWithoutCursoInput | DocenteAsignacionesUpdateWithWhereUniqueWithoutCursoInput[]
    updateMany?: DocenteAsignacionesUpdateManyWithWhereWithoutCursoInput | DocenteAsignacionesUpdateManyWithWhereWithoutCursoInput[]
    deleteMany?: DocenteAsignacionesScalarWhereInput | DocenteAsignacionesScalarWhereInput[]
  }

  export type InstitucionesCreateNestedOneWithoutAreasInput = {
    create?: XOR<InstitucionesCreateWithoutAreasInput, InstitucionesUncheckedCreateWithoutAreasInput>
    connectOrCreate?: InstitucionesCreateOrConnectWithoutAreasInput
    connect?: InstitucionesWhereUniqueInput
  }

  export type MateriasCreateNestedManyWithoutAreaInput = {
    create?: XOR<MateriasCreateWithoutAreaInput, MateriasUncheckedCreateWithoutAreaInput> | MateriasCreateWithoutAreaInput[] | MateriasUncheckedCreateWithoutAreaInput[]
    connectOrCreate?: MateriasCreateOrConnectWithoutAreaInput | MateriasCreateOrConnectWithoutAreaInput[]
    createMany?: MateriasCreateManyAreaInputEnvelope
    connect?: MateriasWhereUniqueInput | MateriasWhereUniqueInput[]
  }

  export type MateriasUncheckedCreateNestedManyWithoutAreaInput = {
    create?: XOR<MateriasCreateWithoutAreaInput, MateriasUncheckedCreateWithoutAreaInput> | MateriasCreateWithoutAreaInput[] | MateriasUncheckedCreateWithoutAreaInput[]
    connectOrCreate?: MateriasCreateOrConnectWithoutAreaInput | MateriasCreateOrConnectWithoutAreaInput[]
    createMany?: MateriasCreateManyAreaInputEnvelope
    connect?: MateriasWhereUniqueInput | MateriasWhereUniqueInput[]
  }

  export type InstitucionesUpdateOneRequiredWithoutAreasNestedInput = {
    create?: XOR<InstitucionesCreateWithoutAreasInput, InstitucionesUncheckedCreateWithoutAreasInput>
    connectOrCreate?: InstitucionesCreateOrConnectWithoutAreasInput
    upsert?: InstitucionesUpsertWithoutAreasInput
    connect?: InstitucionesWhereUniqueInput
    update?: XOR<XOR<InstitucionesUpdateToOneWithWhereWithoutAreasInput, InstitucionesUpdateWithoutAreasInput>, InstitucionesUncheckedUpdateWithoutAreasInput>
  }

  export type MateriasUpdateManyWithoutAreaNestedInput = {
    create?: XOR<MateriasCreateWithoutAreaInput, MateriasUncheckedCreateWithoutAreaInput> | MateriasCreateWithoutAreaInput[] | MateriasUncheckedCreateWithoutAreaInput[]
    connectOrCreate?: MateriasCreateOrConnectWithoutAreaInput | MateriasCreateOrConnectWithoutAreaInput[]
    upsert?: MateriasUpsertWithWhereUniqueWithoutAreaInput | MateriasUpsertWithWhereUniqueWithoutAreaInput[]
    createMany?: MateriasCreateManyAreaInputEnvelope
    set?: MateriasWhereUniqueInput | MateriasWhereUniqueInput[]
    disconnect?: MateriasWhereUniqueInput | MateriasWhereUniqueInput[]
    delete?: MateriasWhereUniqueInput | MateriasWhereUniqueInput[]
    connect?: MateriasWhereUniqueInput | MateriasWhereUniqueInput[]
    update?: MateriasUpdateWithWhereUniqueWithoutAreaInput | MateriasUpdateWithWhereUniqueWithoutAreaInput[]
    updateMany?: MateriasUpdateManyWithWhereWithoutAreaInput | MateriasUpdateManyWithWhereWithoutAreaInput[]
    deleteMany?: MateriasScalarWhereInput | MateriasScalarWhereInput[]
  }

  export type MateriasUncheckedUpdateManyWithoutAreaNestedInput = {
    create?: XOR<MateriasCreateWithoutAreaInput, MateriasUncheckedCreateWithoutAreaInput> | MateriasCreateWithoutAreaInput[] | MateriasUncheckedCreateWithoutAreaInput[]
    connectOrCreate?: MateriasCreateOrConnectWithoutAreaInput | MateriasCreateOrConnectWithoutAreaInput[]
    upsert?: MateriasUpsertWithWhereUniqueWithoutAreaInput | MateriasUpsertWithWhereUniqueWithoutAreaInput[]
    createMany?: MateriasCreateManyAreaInputEnvelope
    set?: MateriasWhereUniqueInput | MateriasWhereUniqueInput[]
    disconnect?: MateriasWhereUniqueInput | MateriasWhereUniqueInput[]
    delete?: MateriasWhereUniqueInput | MateriasWhereUniqueInput[]
    connect?: MateriasWhereUniqueInput | MateriasWhereUniqueInput[]
    update?: MateriasUpdateWithWhereUniqueWithoutAreaInput | MateriasUpdateWithWhereUniqueWithoutAreaInput[]
    updateMany?: MateriasUpdateManyWithWhereWithoutAreaInput | MateriasUpdateManyWithWhereWithoutAreaInput[]
    deleteMany?: MateriasScalarWhereInput | MateriasScalarWhereInput[]
  }

  export type AreasCreateNestedOneWithoutMateriasInput = {
    create?: XOR<AreasCreateWithoutMateriasInput, AreasUncheckedCreateWithoutMateriasInput>
    connectOrCreate?: AreasCreateOrConnectWithoutMateriasInput
    connect?: AreasWhereUniqueInput
  }

  export type InstitucionesCreateNestedOneWithoutMateriasInput = {
    create?: XOR<InstitucionesCreateWithoutMateriasInput, InstitucionesUncheckedCreateWithoutMateriasInput>
    connectOrCreate?: InstitucionesCreateOrConnectWithoutMateriasInput
    connect?: InstitucionesWhereUniqueInput
  }

  export type MateriaGradosCreateNestedManyWithoutMateriaInput = {
    create?: XOR<MateriaGradosCreateWithoutMateriaInput, MateriaGradosUncheckedCreateWithoutMateriaInput> | MateriaGradosCreateWithoutMateriaInput[] | MateriaGradosUncheckedCreateWithoutMateriaInput[]
    connectOrCreate?: MateriaGradosCreateOrConnectWithoutMateriaInput | MateriaGradosCreateOrConnectWithoutMateriaInput[]
    createMany?: MateriaGradosCreateManyMateriaInputEnvelope
    connect?: MateriaGradosWhereUniqueInput | MateriaGradosWhereUniqueInput[]
  }

  export type DocenteAsignacionesCreateNestedManyWithoutMateriaInput = {
    create?: XOR<DocenteAsignacionesCreateWithoutMateriaInput, DocenteAsignacionesUncheckedCreateWithoutMateriaInput> | DocenteAsignacionesCreateWithoutMateriaInput[] | DocenteAsignacionesUncheckedCreateWithoutMateriaInput[]
    connectOrCreate?: DocenteAsignacionesCreateOrConnectWithoutMateriaInput | DocenteAsignacionesCreateOrConnectWithoutMateriaInput[]
    createMany?: DocenteAsignacionesCreateManyMateriaInputEnvelope
    connect?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
  }

  export type MateriaGradosUncheckedCreateNestedManyWithoutMateriaInput = {
    create?: XOR<MateriaGradosCreateWithoutMateriaInput, MateriaGradosUncheckedCreateWithoutMateriaInput> | MateriaGradosCreateWithoutMateriaInput[] | MateriaGradosUncheckedCreateWithoutMateriaInput[]
    connectOrCreate?: MateriaGradosCreateOrConnectWithoutMateriaInput | MateriaGradosCreateOrConnectWithoutMateriaInput[]
    createMany?: MateriaGradosCreateManyMateriaInputEnvelope
    connect?: MateriaGradosWhereUniqueInput | MateriaGradosWhereUniqueInput[]
  }

  export type DocenteAsignacionesUncheckedCreateNestedManyWithoutMateriaInput = {
    create?: XOR<DocenteAsignacionesCreateWithoutMateriaInput, DocenteAsignacionesUncheckedCreateWithoutMateriaInput> | DocenteAsignacionesCreateWithoutMateriaInput[] | DocenteAsignacionesUncheckedCreateWithoutMateriaInput[]
    connectOrCreate?: DocenteAsignacionesCreateOrConnectWithoutMateriaInput | DocenteAsignacionesCreateOrConnectWithoutMateriaInput[]
    createMany?: DocenteAsignacionesCreateManyMateriaInputEnvelope
    connect?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
  }

  export type AreasUpdateOneRequiredWithoutMateriasNestedInput = {
    create?: XOR<AreasCreateWithoutMateriasInput, AreasUncheckedCreateWithoutMateriasInput>
    connectOrCreate?: AreasCreateOrConnectWithoutMateriasInput
    upsert?: AreasUpsertWithoutMateriasInput
    connect?: AreasWhereUniqueInput
    update?: XOR<XOR<AreasUpdateToOneWithWhereWithoutMateriasInput, AreasUpdateWithoutMateriasInput>, AreasUncheckedUpdateWithoutMateriasInput>
  }

  export type InstitucionesUpdateOneRequiredWithoutMateriasNestedInput = {
    create?: XOR<InstitucionesCreateWithoutMateriasInput, InstitucionesUncheckedCreateWithoutMateriasInput>
    connectOrCreate?: InstitucionesCreateOrConnectWithoutMateriasInput
    upsert?: InstitucionesUpsertWithoutMateriasInput
    connect?: InstitucionesWhereUniqueInput
    update?: XOR<XOR<InstitucionesUpdateToOneWithWhereWithoutMateriasInput, InstitucionesUpdateWithoutMateriasInput>, InstitucionesUncheckedUpdateWithoutMateriasInput>
  }

  export type MateriaGradosUpdateManyWithoutMateriaNestedInput = {
    create?: XOR<MateriaGradosCreateWithoutMateriaInput, MateriaGradosUncheckedCreateWithoutMateriaInput> | MateriaGradosCreateWithoutMateriaInput[] | MateriaGradosUncheckedCreateWithoutMateriaInput[]
    connectOrCreate?: MateriaGradosCreateOrConnectWithoutMateriaInput | MateriaGradosCreateOrConnectWithoutMateriaInput[]
    upsert?: MateriaGradosUpsertWithWhereUniqueWithoutMateriaInput | MateriaGradosUpsertWithWhereUniqueWithoutMateriaInput[]
    createMany?: MateriaGradosCreateManyMateriaInputEnvelope
    set?: MateriaGradosWhereUniqueInput | MateriaGradosWhereUniqueInput[]
    disconnect?: MateriaGradosWhereUniqueInput | MateriaGradosWhereUniqueInput[]
    delete?: MateriaGradosWhereUniqueInput | MateriaGradosWhereUniqueInput[]
    connect?: MateriaGradosWhereUniqueInput | MateriaGradosWhereUniqueInput[]
    update?: MateriaGradosUpdateWithWhereUniqueWithoutMateriaInput | MateriaGradosUpdateWithWhereUniqueWithoutMateriaInput[]
    updateMany?: MateriaGradosUpdateManyWithWhereWithoutMateriaInput | MateriaGradosUpdateManyWithWhereWithoutMateriaInput[]
    deleteMany?: MateriaGradosScalarWhereInput | MateriaGradosScalarWhereInput[]
  }

  export type DocenteAsignacionesUpdateManyWithoutMateriaNestedInput = {
    create?: XOR<DocenteAsignacionesCreateWithoutMateriaInput, DocenteAsignacionesUncheckedCreateWithoutMateriaInput> | DocenteAsignacionesCreateWithoutMateriaInput[] | DocenteAsignacionesUncheckedCreateWithoutMateriaInput[]
    connectOrCreate?: DocenteAsignacionesCreateOrConnectWithoutMateriaInput | DocenteAsignacionesCreateOrConnectWithoutMateriaInput[]
    upsert?: DocenteAsignacionesUpsertWithWhereUniqueWithoutMateriaInput | DocenteAsignacionesUpsertWithWhereUniqueWithoutMateriaInput[]
    createMany?: DocenteAsignacionesCreateManyMateriaInputEnvelope
    set?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
    disconnect?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
    delete?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
    connect?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
    update?: DocenteAsignacionesUpdateWithWhereUniqueWithoutMateriaInput | DocenteAsignacionesUpdateWithWhereUniqueWithoutMateriaInput[]
    updateMany?: DocenteAsignacionesUpdateManyWithWhereWithoutMateriaInput | DocenteAsignacionesUpdateManyWithWhereWithoutMateriaInput[]
    deleteMany?: DocenteAsignacionesScalarWhereInput | DocenteAsignacionesScalarWhereInput[]
  }

  export type MateriaGradosUncheckedUpdateManyWithoutMateriaNestedInput = {
    create?: XOR<MateriaGradosCreateWithoutMateriaInput, MateriaGradosUncheckedCreateWithoutMateriaInput> | MateriaGradosCreateWithoutMateriaInput[] | MateriaGradosUncheckedCreateWithoutMateriaInput[]
    connectOrCreate?: MateriaGradosCreateOrConnectWithoutMateriaInput | MateriaGradosCreateOrConnectWithoutMateriaInput[]
    upsert?: MateriaGradosUpsertWithWhereUniqueWithoutMateriaInput | MateriaGradosUpsertWithWhereUniqueWithoutMateriaInput[]
    createMany?: MateriaGradosCreateManyMateriaInputEnvelope
    set?: MateriaGradosWhereUniqueInput | MateriaGradosWhereUniqueInput[]
    disconnect?: MateriaGradosWhereUniqueInput | MateriaGradosWhereUniqueInput[]
    delete?: MateriaGradosWhereUniqueInput | MateriaGradosWhereUniqueInput[]
    connect?: MateriaGradosWhereUniqueInput | MateriaGradosWhereUniqueInput[]
    update?: MateriaGradosUpdateWithWhereUniqueWithoutMateriaInput | MateriaGradosUpdateWithWhereUniqueWithoutMateriaInput[]
    updateMany?: MateriaGradosUpdateManyWithWhereWithoutMateriaInput | MateriaGradosUpdateManyWithWhereWithoutMateriaInput[]
    deleteMany?: MateriaGradosScalarWhereInput | MateriaGradosScalarWhereInput[]
  }

  export type DocenteAsignacionesUncheckedUpdateManyWithoutMateriaNestedInput = {
    create?: XOR<DocenteAsignacionesCreateWithoutMateriaInput, DocenteAsignacionesUncheckedCreateWithoutMateriaInput> | DocenteAsignacionesCreateWithoutMateriaInput[] | DocenteAsignacionesUncheckedCreateWithoutMateriaInput[]
    connectOrCreate?: DocenteAsignacionesCreateOrConnectWithoutMateriaInput | DocenteAsignacionesCreateOrConnectWithoutMateriaInput[]
    upsert?: DocenteAsignacionesUpsertWithWhereUniqueWithoutMateriaInput | DocenteAsignacionesUpsertWithWhereUniqueWithoutMateriaInput[]
    createMany?: DocenteAsignacionesCreateManyMateriaInputEnvelope
    set?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
    disconnect?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
    delete?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
    connect?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
    update?: DocenteAsignacionesUpdateWithWhereUniqueWithoutMateriaInput | DocenteAsignacionesUpdateWithWhereUniqueWithoutMateriaInput[]
    updateMany?: DocenteAsignacionesUpdateManyWithWhereWithoutMateriaInput | DocenteAsignacionesUpdateManyWithWhereWithoutMateriaInput[]
    deleteMany?: DocenteAsignacionesScalarWhereInput | DocenteAsignacionesScalarWhereInput[]
  }

  export type MateriasCreateNestedOneWithoutMateriaGradosInput = {
    create?: XOR<MateriasCreateWithoutMateriaGradosInput, MateriasUncheckedCreateWithoutMateriaGradosInput>
    connectOrCreate?: MateriasCreateOrConnectWithoutMateriaGradosInput
    connect?: MateriasWhereUniqueInput
  }

  export type GradosCreateNestedOneWithoutMateriaGradosInput = {
    create?: XOR<GradosCreateWithoutMateriaGradosInput, GradosUncheckedCreateWithoutMateriaGradosInput>
    connectOrCreate?: GradosCreateOrConnectWithoutMateriaGradosInput
    connect?: GradosWhereUniqueInput
  }

  export type MateriasUpdateOneRequiredWithoutMateriaGradosNestedInput = {
    create?: XOR<MateriasCreateWithoutMateriaGradosInput, MateriasUncheckedCreateWithoutMateriaGradosInput>
    connectOrCreate?: MateriasCreateOrConnectWithoutMateriaGradosInput
    upsert?: MateriasUpsertWithoutMateriaGradosInput
    connect?: MateriasWhereUniqueInput
    update?: XOR<XOR<MateriasUpdateToOneWithWhereWithoutMateriaGradosInput, MateriasUpdateWithoutMateriaGradosInput>, MateriasUncheckedUpdateWithoutMateriaGradosInput>
  }

  export type GradosUpdateOneRequiredWithoutMateriaGradosNestedInput = {
    create?: XOR<GradosCreateWithoutMateriaGradosInput, GradosUncheckedCreateWithoutMateriaGradosInput>
    connectOrCreate?: GradosCreateOrConnectWithoutMateriaGradosInput
    upsert?: GradosUpsertWithoutMateriaGradosInput
    connect?: GradosWhereUniqueInput
    update?: XOR<XOR<GradosUpdateToOneWithWhereWithoutMateriaGradosInput, GradosUpdateWithoutMateriaGradosInput>, GradosUncheckedUpdateWithoutMateriaGradosInput>
  }

  export type InstitucionesCreateNestedOneWithoutDocentesInput = {
    create?: XOR<InstitucionesCreateWithoutDocentesInput, InstitucionesUncheckedCreateWithoutDocentesInput>
    connectOrCreate?: InstitucionesCreateOrConnectWithoutDocentesInput
    connect?: InstitucionesWhereUniqueInput
  }

  export type SedesCreateNestedOneWithoutDocentesInput = {
    create?: XOR<SedesCreateWithoutDocentesInput, SedesUncheckedCreateWithoutDocentesInput>
    connectOrCreate?: SedesCreateOrConnectWithoutDocentesInput
    connect?: SedesWhereUniqueInput
  }

  export type DocenteAsignacionesCreateNestedManyWithoutDocenteInput = {
    create?: XOR<DocenteAsignacionesCreateWithoutDocenteInput, DocenteAsignacionesUncheckedCreateWithoutDocenteInput> | DocenteAsignacionesCreateWithoutDocenteInput[] | DocenteAsignacionesUncheckedCreateWithoutDocenteInput[]
    connectOrCreate?: DocenteAsignacionesCreateOrConnectWithoutDocenteInput | DocenteAsignacionesCreateOrConnectWithoutDocenteInput[]
    createMany?: DocenteAsignacionesCreateManyDocenteInputEnvelope
    connect?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
  }

  export type DocenteAsignacionesUncheckedCreateNestedManyWithoutDocenteInput = {
    create?: XOR<DocenteAsignacionesCreateWithoutDocenteInput, DocenteAsignacionesUncheckedCreateWithoutDocenteInput> | DocenteAsignacionesCreateWithoutDocenteInput[] | DocenteAsignacionesUncheckedCreateWithoutDocenteInput[]
    connectOrCreate?: DocenteAsignacionesCreateOrConnectWithoutDocenteInput | DocenteAsignacionesCreateOrConnectWithoutDocenteInput[]
    createMany?: DocenteAsignacionesCreateManyDocenteInputEnvelope
    connect?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
  }

  export type InstitucionesUpdateOneRequiredWithoutDocentesNestedInput = {
    create?: XOR<InstitucionesCreateWithoutDocentesInput, InstitucionesUncheckedCreateWithoutDocentesInput>
    connectOrCreate?: InstitucionesCreateOrConnectWithoutDocentesInput
    upsert?: InstitucionesUpsertWithoutDocentesInput
    connect?: InstitucionesWhereUniqueInput
    update?: XOR<XOR<InstitucionesUpdateToOneWithWhereWithoutDocentesInput, InstitucionesUpdateWithoutDocentesInput>, InstitucionesUncheckedUpdateWithoutDocentesInput>
  }

  export type SedesUpdateOneWithoutDocentesNestedInput = {
    create?: XOR<SedesCreateWithoutDocentesInput, SedesUncheckedCreateWithoutDocentesInput>
    connectOrCreate?: SedesCreateOrConnectWithoutDocentesInput
    upsert?: SedesUpsertWithoutDocentesInput
    disconnect?: SedesWhereInput | boolean
    delete?: SedesWhereInput | boolean
    connect?: SedesWhereUniqueInput
    update?: XOR<XOR<SedesUpdateToOneWithWhereWithoutDocentesInput, SedesUpdateWithoutDocentesInput>, SedesUncheckedUpdateWithoutDocentesInput>
  }

  export type DocenteAsignacionesUpdateManyWithoutDocenteNestedInput = {
    create?: XOR<DocenteAsignacionesCreateWithoutDocenteInput, DocenteAsignacionesUncheckedCreateWithoutDocenteInput> | DocenteAsignacionesCreateWithoutDocenteInput[] | DocenteAsignacionesUncheckedCreateWithoutDocenteInput[]
    connectOrCreate?: DocenteAsignacionesCreateOrConnectWithoutDocenteInput | DocenteAsignacionesCreateOrConnectWithoutDocenteInput[]
    upsert?: DocenteAsignacionesUpsertWithWhereUniqueWithoutDocenteInput | DocenteAsignacionesUpsertWithWhereUniqueWithoutDocenteInput[]
    createMany?: DocenteAsignacionesCreateManyDocenteInputEnvelope
    set?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
    disconnect?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
    delete?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
    connect?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
    update?: DocenteAsignacionesUpdateWithWhereUniqueWithoutDocenteInput | DocenteAsignacionesUpdateWithWhereUniqueWithoutDocenteInput[]
    updateMany?: DocenteAsignacionesUpdateManyWithWhereWithoutDocenteInput | DocenteAsignacionesUpdateManyWithWhereWithoutDocenteInput[]
    deleteMany?: DocenteAsignacionesScalarWhereInput | DocenteAsignacionesScalarWhereInput[]
  }

  export type DocenteAsignacionesUncheckedUpdateManyWithoutDocenteNestedInput = {
    create?: XOR<DocenteAsignacionesCreateWithoutDocenteInput, DocenteAsignacionesUncheckedCreateWithoutDocenteInput> | DocenteAsignacionesCreateWithoutDocenteInput[] | DocenteAsignacionesUncheckedCreateWithoutDocenteInput[]
    connectOrCreate?: DocenteAsignacionesCreateOrConnectWithoutDocenteInput | DocenteAsignacionesCreateOrConnectWithoutDocenteInput[]
    upsert?: DocenteAsignacionesUpsertWithWhereUniqueWithoutDocenteInput | DocenteAsignacionesUpsertWithWhereUniqueWithoutDocenteInput[]
    createMany?: DocenteAsignacionesCreateManyDocenteInputEnvelope
    set?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
    disconnect?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
    delete?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
    connect?: DocenteAsignacionesWhereUniqueInput | DocenteAsignacionesWhereUniqueInput[]
    update?: DocenteAsignacionesUpdateWithWhereUniqueWithoutDocenteInput | DocenteAsignacionesUpdateWithWhereUniqueWithoutDocenteInput[]
    updateMany?: DocenteAsignacionesUpdateManyWithWhereWithoutDocenteInput | DocenteAsignacionesUpdateManyWithWhereWithoutDocenteInput[]
    deleteMany?: DocenteAsignacionesScalarWhereInput | DocenteAsignacionesScalarWhereInput[]
  }

  export type DocentesCreateNestedOneWithoutDocenteAsignacionesInput = {
    create?: XOR<DocentesCreateWithoutDocenteAsignacionesInput, DocentesUncheckedCreateWithoutDocenteAsignacionesInput>
    connectOrCreate?: DocentesCreateOrConnectWithoutDocenteAsignacionesInput
    connect?: DocentesWhereUniqueInput
  }

  export type CursosCreateNestedOneWithoutDocenteAsignacionesInput = {
    create?: XOR<CursosCreateWithoutDocenteAsignacionesInput, CursosUncheckedCreateWithoutDocenteAsignacionesInput>
    connectOrCreate?: CursosCreateOrConnectWithoutDocenteAsignacionesInput
    connect?: CursosWhereUniqueInput
  }

  export type MateriasCreateNestedOneWithoutDocenteAsignacionesInput = {
    create?: XOR<MateriasCreateWithoutDocenteAsignacionesInput, MateriasUncheckedCreateWithoutDocenteAsignacionesInput>
    connectOrCreate?: MateriasCreateOrConnectWithoutDocenteAsignacionesInput
    connect?: MateriasWhereUniqueInput
  }

  export type DocentesUpdateOneRequiredWithoutDocenteAsignacionesNestedInput = {
    create?: XOR<DocentesCreateWithoutDocenteAsignacionesInput, DocentesUncheckedCreateWithoutDocenteAsignacionesInput>
    connectOrCreate?: DocentesCreateOrConnectWithoutDocenteAsignacionesInput
    upsert?: DocentesUpsertWithoutDocenteAsignacionesInput
    connect?: DocentesWhereUniqueInput
    update?: XOR<XOR<DocentesUpdateToOneWithWhereWithoutDocenteAsignacionesInput, DocentesUpdateWithoutDocenteAsignacionesInput>, DocentesUncheckedUpdateWithoutDocenteAsignacionesInput>
  }

  export type CursosUpdateOneRequiredWithoutDocenteAsignacionesNestedInput = {
    create?: XOR<CursosCreateWithoutDocenteAsignacionesInput, CursosUncheckedCreateWithoutDocenteAsignacionesInput>
    connectOrCreate?: CursosCreateOrConnectWithoutDocenteAsignacionesInput
    upsert?: CursosUpsertWithoutDocenteAsignacionesInput
    connect?: CursosWhereUniqueInput
    update?: XOR<XOR<CursosUpdateToOneWithWhereWithoutDocenteAsignacionesInput, CursosUpdateWithoutDocenteAsignacionesInput>, CursosUncheckedUpdateWithoutDocenteAsignacionesInput>
  }

  export type MateriasUpdateOneRequiredWithoutDocenteAsignacionesNestedInput = {
    create?: XOR<MateriasCreateWithoutDocenteAsignacionesInput, MateriasUncheckedCreateWithoutDocenteAsignacionesInput>
    connectOrCreate?: MateriasCreateOrConnectWithoutDocenteAsignacionesInput
    upsert?: MateriasUpsertWithoutDocenteAsignacionesInput
    connect?: MateriasWhereUniqueInput
    update?: XOR<XOR<MateriasUpdateToOneWithWhereWithoutDocenteAsignacionesInput, MateriasUpdateWithoutDocenteAsignacionesInput>, MateriasUncheckedUpdateWithoutDocenteAsignacionesInput>
  }

  export type CursosCreateNestedOneWithoutEstudiantesInput = {
    create?: XOR<CursosCreateWithoutEstudiantesInput, CursosUncheckedCreateWithoutEstudiantesInput>
    connectOrCreate?: CursosCreateOrConnectWithoutEstudiantesInput
    connect?: CursosWhereUniqueInput
  }

  export type InstitucionesCreateNestedOneWithoutEstudiantesInput = {
    create?: XOR<InstitucionesCreateWithoutEstudiantesInput, InstitucionesUncheckedCreateWithoutEstudiantesInput>
    connectOrCreate?: InstitucionesCreateOrConnectWithoutEstudiantesInput
    connect?: InstitucionesWhereUniqueInput
  }

  export type CursosUpdateOneRequiredWithoutEstudiantesNestedInput = {
    create?: XOR<CursosCreateWithoutEstudiantesInput, CursosUncheckedCreateWithoutEstudiantesInput>
    connectOrCreate?: CursosCreateOrConnectWithoutEstudiantesInput
    upsert?: CursosUpsertWithoutEstudiantesInput
    connect?: CursosWhereUniqueInput
    update?: XOR<XOR<CursosUpdateToOneWithWhereWithoutEstudiantesInput, CursosUpdateWithoutEstudiantesInput>, CursosUncheckedUpdateWithoutEstudiantesInput>
  }

  export type InstitucionesUpdateOneRequiredWithoutEstudiantesNestedInput = {
    create?: XOR<InstitucionesCreateWithoutEstudiantesInput, InstitucionesUncheckedCreateWithoutEstudiantesInput>
    connectOrCreate?: InstitucionesCreateOrConnectWithoutEstudiantesInput
    upsert?: InstitucionesUpsertWithoutEstudiantesInput
    connect?: InstitucionesWhereUniqueInput
    update?: XOR<XOR<InstitucionesUpdateToOneWithWhereWithoutEstudiantesInput, InstitucionesUpdateWithoutEstudiantesInput>, InstitucionesUncheckedUpdateWithoutEstudiantesInput>
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
    cursos?: CursosCreateNestedManyWithoutSedeInput
    docentes?: DocentesCreateNestedManyWithoutSedeInput
  }

  export type SedesUncheckedCreateWithoutInstitucionInput = {
    id?: number
    nombre: string
    jornadas?: SedesCreatejornadasInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    administradores?: AdministradoresUncheckedCreateNestedManyWithoutSedeInput
    cursos?: CursosUncheckedCreateNestedManyWithoutSedeInput
    docentes?: DocentesUncheckedCreateNestedManyWithoutSedeInput
  }

  export type SedesCreateOrConnectWithoutInstitucionInput = {
    where: SedesWhereUniqueInput
    create: XOR<SedesCreateWithoutInstitucionInput, SedesUncheckedCreateWithoutInstitucionInput>
  }

  export type SedesCreateManyInstitucionInputEnvelope = {
    data: SedesCreateManyInstitucionInput | SedesCreateManyInstitucionInput[]
    skipDuplicates?: boolean
  }

  export type GradosCreateWithoutInstitucionInput = {
    nombre: string
    nivel: string
    orden: number
    created_at?: Date | string
    updated_at?: Date | string
    cursos?: CursosCreateNestedManyWithoutGradoInput
    materiaGrados?: MateriaGradosCreateNestedManyWithoutGradoInput
  }

  export type GradosUncheckedCreateWithoutInstitucionInput = {
    id?: number
    nombre: string
    nivel: string
    orden: number
    created_at?: Date | string
    updated_at?: Date | string
    cursos?: CursosUncheckedCreateNestedManyWithoutGradoInput
    materiaGrados?: MateriaGradosUncheckedCreateNestedManyWithoutGradoInput
  }

  export type GradosCreateOrConnectWithoutInstitucionInput = {
    where: GradosWhereUniqueInput
    create: XOR<GradosCreateWithoutInstitucionInput, GradosUncheckedCreateWithoutInstitucionInput>
  }

  export type GradosCreateManyInstitucionInputEnvelope = {
    data: GradosCreateManyInstitucionInput | GradosCreateManyInstitucionInput[]
    skipDuplicates?: boolean
  }

  export type CursosCreateWithoutInstitucionInput = {
    nombre: string
    jornada?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    grado: GradosCreateNestedOneWithoutCursosInput
    sede?: SedesCreateNestedOneWithoutCursosInput
    estudiantes?: EstudiantesCreateNestedManyWithoutCursoInput
    docenteAsignaciones?: DocenteAsignacionesCreateNestedManyWithoutCursoInput
  }

  export type CursosUncheckedCreateWithoutInstitucionInput = {
    id?: number
    nombre: string
    grado_id: number
    jornada?: string | null
    sede_id?: number | null
    created_at?: Date | string
    updated_at?: Date | string
    estudiantes?: EstudiantesUncheckedCreateNestedManyWithoutCursoInput
    docenteAsignaciones?: DocenteAsignacionesUncheckedCreateNestedManyWithoutCursoInput
  }

  export type CursosCreateOrConnectWithoutInstitucionInput = {
    where: CursosWhereUniqueInput
    create: XOR<CursosCreateWithoutInstitucionInput, CursosUncheckedCreateWithoutInstitucionInput>
  }

  export type CursosCreateManyInstitucionInputEnvelope = {
    data: CursosCreateManyInstitucionInput | CursosCreateManyInstitucionInput[]
    skipDuplicates?: boolean
  }

  export type AreasCreateWithoutInstitucionInput = {
    nombre: string
    es_opcional?: boolean
    orden: number
    activa?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    materias?: MateriasCreateNestedManyWithoutAreaInput
  }

  export type AreasUncheckedCreateWithoutInstitucionInput = {
    id?: number
    nombre: string
    es_opcional?: boolean
    orden: number
    activa?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    materias?: MateriasUncheckedCreateNestedManyWithoutAreaInput
  }

  export type AreasCreateOrConnectWithoutInstitucionInput = {
    where: AreasWhereUniqueInput
    create: XOR<AreasCreateWithoutInstitucionInput, AreasUncheckedCreateWithoutInstitucionInput>
  }

  export type AreasCreateManyInstitucionInputEnvelope = {
    data: AreasCreateManyInstitucionInput | AreasCreateManyInstitucionInput[]
    skipDuplicates?: boolean
  }

  export type MateriasCreateWithoutInstitucionInput = {
    nombre: string
    created_at?: Date | string
    updated_at?: Date | string
    area: AreasCreateNestedOneWithoutMateriasInput
    materiaGrados?: MateriaGradosCreateNestedManyWithoutMateriaInput
    docenteAsignaciones?: DocenteAsignacionesCreateNestedManyWithoutMateriaInput
  }

  export type MateriasUncheckedCreateWithoutInstitucionInput = {
    id?: number
    nombre: string
    area_id: number
    created_at?: Date | string
    updated_at?: Date | string
    materiaGrados?: MateriaGradosUncheckedCreateNestedManyWithoutMateriaInput
    docenteAsignaciones?: DocenteAsignacionesUncheckedCreateNestedManyWithoutMateriaInput
  }

  export type MateriasCreateOrConnectWithoutInstitucionInput = {
    where: MateriasWhereUniqueInput
    create: XOR<MateriasCreateWithoutInstitucionInput, MateriasUncheckedCreateWithoutInstitucionInput>
  }

  export type MateriasCreateManyInstitucionInputEnvelope = {
    data: MateriasCreateManyInstitucionInput | MateriasCreateManyInstitucionInput[]
    skipDuplicates?: boolean
  }

  export type DocentesCreateWithoutInstitucionInput = {
    apellidos: string
    nombres: string
    telefono: string
    email: string
    activo?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    sede?: SedesCreateNestedOneWithoutDocentesInput
    docenteAsignaciones?: DocenteAsignacionesCreateNestedManyWithoutDocenteInput
  }

  export type DocentesUncheckedCreateWithoutInstitucionInput = {
    id?: number
    apellidos: string
    nombres: string
    telefono: string
    email: string
    sede_id?: number | null
    activo?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    docenteAsignaciones?: DocenteAsignacionesUncheckedCreateNestedManyWithoutDocenteInput
  }

  export type DocentesCreateOrConnectWithoutInstitucionInput = {
    where: DocentesWhereUniqueInput
    create: XOR<DocentesCreateWithoutInstitucionInput, DocentesUncheckedCreateWithoutInstitucionInput>
  }

  export type DocentesCreateManyInstitucionInputEnvelope = {
    data: DocentesCreateManyInstitucionInput | DocentesCreateManyInstitucionInput[]
    skipDuplicates?: boolean
  }

  export type EstudiantesCreateWithoutInstitucionInput = {
    apellidos: string
    nombres: string
    codigo_estudiantil: string
    nombre_acudiente: string
    correo_acudiente?: string | null
    telefono_acudiente: string
    activo?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    curso: CursosCreateNestedOneWithoutEstudiantesInput
  }

  export type EstudiantesUncheckedCreateWithoutInstitucionInput = {
    id?: number
    apellidos: string
    nombres: string
    codigo_estudiantil: string
    nombre_acudiente: string
    correo_acudiente?: string | null
    telefono_acudiente: string
    curso_id: number
    activo?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type EstudiantesCreateOrConnectWithoutInstitucionInput = {
    where: EstudiantesWhereUniqueInput
    create: XOR<EstudiantesCreateWithoutInstitucionInput, EstudiantesUncheckedCreateWithoutInstitucionInput>
  }

  export type EstudiantesCreateManyInstitucionInputEnvelope = {
    data: EstudiantesCreateManyInstitucionInput | EstudiantesCreateManyInstitucionInput[]
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

  export type GradosUpsertWithWhereUniqueWithoutInstitucionInput = {
    where: GradosWhereUniqueInput
    update: XOR<GradosUpdateWithoutInstitucionInput, GradosUncheckedUpdateWithoutInstitucionInput>
    create: XOR<GradosCreateWithoutInstitucionInput, GradosUncheckedCreateWithoutInstitucionInput>
  }

  export type GradosUpdateWithWhereUniqueWithoutInstitucionInput = {
    where: GradosWhereUniqueInput
    data: XOR<GradosUpdateWithoutInstitucionInput, GradosUncheckedUpdateWithoutInstitucionInput>
  }

  export type GradosUpdateManyWithWhereWithoutInstitucionInput = {
    where: GradosScalarWhereInput
    data: XOR<GradosUpdateManyMutationInput, GradosUncheckedUpdateManyWithoutInstitucionInput>
  }

  export type GradosScalarWhereInput = {
    AND?: GradosScalarWhereInput | GradosScalarWhereInput[]
    OR?: GradosScalarWhereInput[]
    NOT?: GradosScalarWhereInput | GradosScalarWhereInput[]
    id?: IntFilter<"Grados"> | number
    nombre?: StringFilter<"Grados"> | string
    nivel?: StringFilter<"Grados"> | string
    orden?: IntFilter<"Grados"> | number
    institucion_id?: IntFilter<"Grados"> | number
    created_at?: DateTimeFilter<"Grados"> | Date | string
    updated_at?: DateTimeFilter<"Grados"> | Date | string
  }

  export type CursosUpsertWithWhereUniqueWithoutInstitucionInput = {
    where: CursosWhereUniqueInput
    update: XOR<CursosUpdateWithoutInstitucionInput, CursosUncheckedUpdateWithoutInstitucionInput>
    create: XOR<CursosCreateWithoutInstitucionInput, CursosUncheckedCreateWithoutInstitucionInput>
  }

  export type CursosUpdateWithWhereUniqueWithoutInstitucionInput = {
    where: CursosWhereUniqueInput
    data: XOR<CursosUpdateWithoutInstitucionInput, CursosUncheckedUpdateWithoutInstitucionInput>
  }

  export type CursosUpdateManyWithWhereWithoutInstitucionInput = {
    where: CursosScalarWhereInput
    data: XOR<CursosUpdateManyMutationInput, CursosUncheckedUpdateManyWithoutInstitucionInput>
  }

  export type CursosScalarWhereInput = {
    AND?: CursosScalarWhereInput | CursosScalarWhereInput[]
    OR?: CursosScalarWhereInput[]
    NOT?: CursosScalarWhereInput | CursosScalarWhereInput[]
    id?: IntFilter<"Cursos"> | number
    nombre?: StringFilter<"Cursos"> | string
    grado_id?: IntFilter<"Cursos"> | number
    jornada?: StringNullableFilter<"Cursos"> | string | null
    sede_id?: IntNullableFilter<"Cursos"> | number | null
    institucion_id?: IntFilter<"Cursos"> | number
    created_at?: DateTimeFilter<"Cursos"> | Date | string
    updated_at?: DateTimeFilter<"Cursos"> | Date | string
  }

  export type AreasUpsertWithWhereUniqueWithoutInstitucionInput = {
    where: AreasWhereUniqueInput
    update: XOR<AreasUpdateWithoutInstitucionInput, AreasUncheckedUpdateWithoutInstitucionInput>
    create: XOR<AreasCreateWithoutInstitucionInput, AreasUncheckedCreateWithoutInstitucionInput>
  }

  export type AreasUpdateWithWhereUniqueWithoutInstitucionInput = {
    where: AreasWhereUniqueInput
    data: XOR<AreasUpdateWithoutInstitucionInput, AreasUncheckedUpdateWithoutInstitucionInput>
  }

  export type AreasUpdateManyWithWhereWithoutInstitucionInput = {
    where: AreasScalarWhereInput
    data: XOR<AreasUpdateManyMutationInput, AreasUncheckedUpdateManyWithoutInstitucionInput>
  }

  export type AreasScalarWhereInput = {
    AND?: AreasScalarWhereInput | AreasScalarWhereInput[]
    OR?: AreasScalarWhereInput[]
    NOT?: AreasScalarWhereInput | AreasScalarWhereInput[]
    id?: IntFilter<"Areas"> | number
    nombre?: StringFilter<"Areas"> | string
    es_opcional?: BoolFilter<"Areas"> | boolean
    orden?: IntFilter<"Areas"> | number
    institucion_id?: IntFilter<"Areas"> | number
    activa?: BoolFilter<"Areas"> | boolean
    created_at?: DateTimeFilter<"Areas"> | Date | string
    updated_at?: DateTimeFilter<"Areas"> | Date | string
  }

  export type MateriasUpsertWithWhereUniqueWithoutInstitucionInput = {
    where: MateriasWhereUniqueInput
    update: XOR<MateriasUpdateWithoutInstitucionInput, MateriasUncheckedUpdateWithoutInstitucionInput>
    create: XOR<MateriasCreateWithoutInstitucionInput, MateriasUncheckedCreateWithoutInstitucionInput>
  }

  export type MateriasUpdateWithWhereUniqueWithoutInstitucionInput = {
    where: MateriasWhereUniqueInput
    data: XOR<MateriasUpdateWithoutInstitucionInput, MateriasUncheckedUpdateWithoutInstitucionInput>
  }

  export type MateriasUpdateManyWithWhereWithoutInstitucionInput = {
    where: MateriasScalarWhereInput
    data: XOR<MateriasUpdateManyMutationInput, MateriasUncheckedUpdateManyWithoutInstitucionInput>
  }

  export type MateriasScalarWhereInput = {
    AND?: MateriasScalarWhereInput | MateriasScalarWhereInput[]
    OR?: MateriasScalarWhereInput[]
    NOT?: MateriasScalarWhereInput | MateriasScalarWhereInput[]
    id?: IntFilter<"Materias"> | number
    nombre?: StringFilter<"Materias"> | string
    area_id?: IntFilter<"Materias"> | number
    institucion_id?: IntFilter<"Materias"> | number
    created_at?: DateTimeFilter<"Materias"> | Date | string
    updated_at?: DateTimeFilter<"Materias"> | Date | string
  }

  export type DocentesUpsertWithWhereUniqueWithoutInstitucionInput = {
    where: DocentesWhereUniqueInput
    update: XOR<DocentesUpdateWithoutInstitucionInput, DocentesUncheckedUpdateWithoutInstitucionInput>
    create: XOR<DocentesCreateWithoutInstitucionInput, DocentesUncheckedCreateWithoutInstitucionInput>
  }

  export type DocentesUpdateWithWhereUniqueWithoutInstitucionInput = {
    where: DocentesWhereUniqueInput
    data: XOR<DocentesUpdateWithoutInstitucionInput, DocentesUncheckedUpdateWithoutInstitucionInput>
  }

  export type DocentesUpdateManyWithWhereWithoutInstitucionInput = {
    where: DocentesScalarWhereInput
    data: XOR<DocentesUpdateManyMutationInput, DocentesUncheckedUpdateManyWithoutInstitucionInput>
  }

  export type DocentesScalarWhereInput = {
    AND?: DocentesScalarWhereInput | DocentesScalarWhereInput[]
    OR?: DocentesScalarWhereInput[]
    NOT?: DocentesScalarWhereInput | DocentesScalarWhereInput[]
    id?: IntFilter<"Docentes"> | number
    apellidos?: StringFilter<"Docentes"> | string
    nombres?: StringFilter<"Docentes"> | string
    telefono?: StringFilter<"Docentes"> | string
    email?: StringFilter<"Docentes"> | string
    institucion_id?: IntFilter<"Docentes"> | number
    sede_id?: IntNullableFilter<"Docentes"> | number | null
    activo?: BoolFilter<"Docentes"> | boolean
    created_at?: DateTimeFilter<"Docentes"> | Date | string
    updated_at?: DateTimeFilter<"Docentes"> | Date | string
  }

  export type EstudiantesUpsertWithWhereUniqueWithoutInstitucionInput = {
    where: EstudiantesWhereUniqueInput
    update: XOR<EstudiantesUpdateWithoutInstitucionInput, EstudiantesUncheckedUpdateWithoutInstitucionInput>
    create: XOR<EstudiantesCreateWithoutInstitucionInput, EstudiantesUncheckedCreateWithoutInstitucionInput>
  }

  export type EstudiantesUpdateWithWhereUniqueWithoutInstitucionInput = {
    where: EstudiantesWhereUniqueInput
    data: XOR<EstudiantesUpdateWithoutInstitucionInput, EstudiantesUncheckedUpdateWithoutInstitucionInput>
  }

  export type EstudiantesUpdateManyWithWhereWithoutInstitucionInput = {
    where: EstudiantesScalarWhereInput
    data: XOR<EstudiantesUpdateManyMutationInput, EstudiantesUncheckedUpdateManyWithoutInstitucionInput>
  }

  export type EstudiantesScalarWhereInput = {
    AND?: EstudiantesScalarWhereInput | EstudiantesScalarWhereInput[]
    OR?: EstudiantesScalarWhereInput[]
    NOT?: EstudiantesScalarWhereInput | EstudiantesScalarWhereInput[]
    id?: IntFilter<"Estudiantes"> | number
    apellidos?: StringFilter<"Estudiantes"> | string
    nombres?: StringFilter<"Estudiantes"> | string
    codigo_estudiantil?: StringFilter<"Estudiantes"> | string
    nombre_acudiente?: StringFilter<"Estudiantes"> | string
    correo_acudiente?: StringNullableFilter<"Estudiantes"> | string | null
    telefono_acudiente?: StringFilter<"Estudiantes"> | string
    curso_id?: IntFilter<"Estudiantes"> | number
    institucion_id?: IntFilter<"Estudiantes"> | number
    activo?: BoolFilter<"Estudiantes"> | boolean
    created_at?: DateTimeFilter<"Estudiantes"> | Date | string
    updated_at?: DateTimeFilter<"Estudiantes"> | Date | string
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

  export type CursosCreateWithoutSedeInput = {
    nombre: string
    jornada?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    grado: GradosCreateNestedOneWithoutCursosInput
    institucion: InstitucionesCreateNestedOneWithoutCursosInput
    estudiantes?: EstudiantesCreateNestedManyWithoutCursoInput
    docenteAsignaciones?: DocenteAsignacionesCreateNestedManyWithoutCursoInput
  }

  export type CursosUncheckedCreateWithoutSedeInput = {
    id?: number
    nombre: string
    grado_id: number
    jornada?: string | null
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
    estudiantes?: EstudiantesUncheckedCreateNestedManyWithoutCursoInput
    docenteAsignaciones?: DocenteAsignacionesUncheckedCreateNestedManyWithoutCursoInput
  }

  export type CursosCreateOrConnectWithoutSedeInput = {
    where: CursosWhereUniqueInput
    create: XOR<CursosCreateWithoutSedeInput, CursosUncheckedCreateWithoutSedeInput>
  }

  export type CursosCreateManySedeInputEnvelope = {
    data: CursosCreateManySedeInput | CursosCreateManySedeInput[]
    skipDuplicates?: boolean
  }

  export type DocentesCreateWithoutSedeInput = {
    apellidos: string
    nombres: string
    telefono: string
    email: string
    activo?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    institucion: InstitucionesCreateNestedOneWithoutDocentesInput
    docenteAsignaciones?: DocenteAsignacionesCreateNestedManyWithoutDocenteInput
  }

  export type DocentesUncheckedCreateWithoutSedeInput = {
    id?: number
    apellidos: string
    nombres: string
    telefono: string
    email: string
    institucion_id: number
    activo?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    docenteAsignaciones?: DocenteAsignacionesUncheckedCreateNestedManyWithoutDocenteInput
  }

  export type DocentesCreateOrConnectWithoutSedeInput = {
    where: DocentesWhereUniqueInput
    create: XOR<DocentesCreateWithoutSedeInput, DocentesUncheckedCreateWithoutSedeInput>
  }

  export type DocentesCreateManySedeInputEnvelope = {
    data: DocentesCreateManySedeInput | DocentesCreateManySedeInput[]
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
    grados?: GradosCreateNestedManyWithoutInstitucionInput
    cursos?: CursosCreateNestedManyWithoutInstitucionInput
    areas?: AreasCreateNestedManyWithoutInstitucionInput
    materias?: MateriasCreateNestedManyWithoutInstitucionInput
    docentes?: DocentesCreateNestedManyWithoutInstitucionInput
    estudiantes?: EstudiantesCreateNestedManyWithoutInstitucionInput
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
    grados?: GradosUncheckedCreateNestedManyWithoutInstitucionInput
    cursos?: CursosUncheckedCreateNestedManyWithoutInstitucionInput
    areas?: AreasUncheckedCreateNestedManyWithoutInstitucionInput
    materias?: MateriasUncheckedCreateNestedManyWithoutInstitucionInput
    docentes?: DocentesUncheckedCreateNestedManyWithoutInstitucionInput
    estudiantes?: EstudiantesUncheckedCreateNestedManyWithoutInstitucionInput
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

  export type CursosUpsertWithWhereUniqueWithoutSedeInput = {
    where: CursosWhereUniqueInput
    update: XOR<CursosUpdateWithoutSedeInput, CursosUncheckedUpdateWithoutSedeInput>
    create: XOR<CursosCreateWithoutSedeInput, CursosUncheckedCreateWithoutSedeInput>
  }

  export type CursosUpdateWithWhereUniqueWithoutSedeInput = {
    where: CursosWhereUniqueInput
    data: XOR<CursosUpdateWithoutSedeInput, CursosUncheckedUpdateWithoutSedeInput>
  }

  export type CursosUpdateManyWithWhereWithoutSedeInput = {
    where: CursosScalarWhereInput
    data: XOR<CursosUpdateManyMutationInput, CursosUncheckedUpdateManyWithoutSedeInput>
  }

  export type DocentesUpsertWithWhereUniqueWithoutSedeInput = {
    where: DocentesWhereUniqueInput
    update: XOR<DocentesUpdateWithoutSedeInput, DocentesUncheckedUpdateWithoutSedeInput>
    create: XOR<DocentesCreateWithoutSedeInput, DocentesUncheckedCreateWithoutSedeInput>
  }

  export type DocentesUpdateWithWhereUniqueWithoutSedeInput = {
    where: DocentesWhereUniqueInput
    data: XOR<DocentesUpdateWithoutSedeInput, DocentesUncheckedUpdateWithoutSedeInput>
  }

  export type DocentesUpdateManyWithWhereWithoutSedeInput = {
    where: DocentesScalarWhereInput
    data: XOR<DocentesUpdateManyMutationInput, DocentesUncheckedUpdateManyWithoutSedeInput>
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
    grados?: GradosUpdateManyWithoutInstitucionNestedInput
    cursos?: CursosUpdateManyWithoutInstitucionNestedInput
    areas?: AreasUpdateManyWithoutInstitucionNestedInput
    materias?: MateriasUpdateManyWithoutInstitucionNestedInput
    docentes?: DocentesUpdateManyWithoutInstitucionNestedInput
    estudiantes?: EstudiantesUpdateManyWithoutInstitucionNestedInput
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
    grados?: GradosUncheckedUpdateManyWithoutInstitucionNestedInput
    cursos?: CursosUncheckedUpdateManyWithoutInstitucionNestedInput
    areas?: AreasUncheckedUpdateManyWithoutInstitucionNestedInput
    materias?: MateriasUncheckedUpdateManyWithoutInstitucionNestedInput
    docentes?: DocentesUncheckedUpdateManyWithoutInstitucionNestedInput
    estudiantes?: EstudiantesUncheckedUpdateManyWithoutInstitucionNestedInput
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
    grados?: GradosCreateNestedManyWithoutInstitucionInput
    cursos?: CursosCreateNestedManyWithoutInstitucionInput
    areas?: AreasCreateNestedManyWithoutInstitucionInput
    materias?: MateriasCreateNestedManyWithoutInstitucionInput
    docentes?: DocentesCreateNestedManyWithoutInstitucionInput
    estudiantes?: EstudiantesCreateNestedManyWithoutInstitucionInput
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
    grados?: GradosUncheckedCreateNestedManyWithoutInstitucionInput
    cursos?: CursosUncheckedCreateNestedManyWithoutInstitucionInput
    areas?: AreasUncheckedCreateNestedManyWithoutInstitucionInput
    materias?: MateriasUncheckedCreateNestedManyWithoutInstitucionInput
    docentes?: DocentesUncheckedCreateNestedManyWithoutInstitucionInput
    estudiantes?: EstudiantesUncheckedCreateNestedManyWithoutInstitucionInput
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
    cursos?: CursosCreateNestedManyWithoutSedeInput
    docentes?: DocentesCreateNestedManyWithoutSedeInput
    institucion: InstitucionesCreateNestedOneWithoutSedesInput
  }

  export type SedesUncheckedCreateWithoutAdministradoresInput = {
    id?: number
    nombre: string
    jornadas?: SedesCreatejornadasInput | string[]
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
    cursos?: CursosUncheckedCreateNestedManyWithoutSedeInput
    docentes?: DocentesUncheckedCreateNestedManyWithoutSedeInput
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
    grados?: GradosUpdateManyWithoutInstitucionNestedInput
    cursos?: CursosUpdateManyWithoutInstitucionNestedInput
    areas?: AreasUpdateManyWithoutInstitucionNestedInput
    materias?: MateriasUpdateManyWithoutInstitucionNestedInput
    docentes?: DocentesUpdateManyWithoutInstitucionNestedInput
    estudiantes?: EstudiantesUpdateManyWithoutInstitucionNestedInput
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
    grados?: GradosUncheckedUpdateManyWithoutInstitucionNestedInput
    cursos?: CursosUncheckedUpdateManyWithoutInstitucionNestedInput
    areas?: AreasUncheckedUpdateManyWithoutInstitucionNestedInput
    materias?: MateriasUncheckedUpdateManyWithoutInstitucionNestedInput
    docentes?: DocentesUncheckedUpdateManyWithoutInstitucionNestedInput
    estudiantes?: EstudiantesUncheckedUpdateManyWithoutInstitucionNestedInput
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
    cursos?: CursosUpdateManyWithoutSedeNestedInput
    docentes?: DocentesUpdateManyWithoutSedeNestedInput
    institucion?: InstitucionesUpdateOneRequiredWithoutSedesNestedInput
  }

  export type SedesUncheckedUpdateWithoutAdministradoresInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    jornadas?: SedesUpdatejornadasInput | string[]
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    cursos?: CursosUncheckedUpdateManyWithoutSedeNestedInput
    docentes?: DocentesUncheckedUpdateManyWithoutSedeNestedInput
  }

  export type InstitucionesCreateWithoutGradosInput = {
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
    cursos?: CursosCreateNestedManyWithoutInstitucionInput
    areas?: AreasCreateNestedManyWithoutInstitucionInput
    materias?: MateriasCreateNestedManyWithoutInstitucionInput
    docentes?: DocentesCreateNestedManyWithoutInstitucionInput
    estudiantes?: EstudiantesCreateNestedManyWithoutInstitucionInput
  }

  export type InstitucionesUncheckedCreateWithoutGradosInput = {
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
    cursos?: CursosUncheckedCreateNestedManyWithoutInstitucionInput
    areas?: AreasUncheckedCreateNestedManyWithoutInstitucionInput
    materias?: MateriasUncheckedCreateNestedManyWithoutInstitucionInput
    docentes?: DocentesUncheckedCreateNestedManyWithoutInstitucionInput
    estudiantes?: EstudiantesUncheckedCreateNestedManyWithoutInstitucionInput
  }

  export type InstitucionesCreateOrConnectWithoutGradosInput = {
    where: InstitucionesWhereUniqueInput
    create: XOR<InstitucionesCreateWithoutGradosInput, InstitucionesUncheckedCreateWithoutGradosInput>
  }

  export type CursosCreateWithoutGradoInput = {
    nombre: string
    jornada?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    institucion: InstitucionesCreateNestedOneWithoutCursosInput
    sede?: SedesCreateNestedOneWithoutCursosInput
    estudiantes?: EstudiantesCreateNestedManyWithoutCursoInput
    docenteAsignaciones?: DocenteAsignacionesCreateNestedManyWithoutCursoInput
  }

  export type CursosUncheckedCreateWithoutGradoInput = {
    id?: number
    nombre: string
    jornada?: string | null
    sede_id?: number | null
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
    estudiantes?: EstudiantesUncheckedCreateNestedManyWithoutCursoInput
    docenteAsignaciones?: DocenteAsignacionesUncheckedCreateNestedManyWithoutCursoInput
  }

  export type CursosCreateOrConnectWithoutGradoInput = {
    where: CursosWhereUniqueInput
    create: XOR<CursosCreateWithoutGradoInput, CursosUncheckedCreateWithoutGradoInput>
  }

  export type CursosCreateManyGradoInputEnvelope = {
    data: CursosCreateManyGradoInput | CursosCreateManyGradoInput[]
    skipDuplicates?: boolean
  }

  export type MateriaGradosCreateWithoutGradoInput = {
    created_at?: Date | string
    materia: MateriasCreateNestedOneWithoutMateriaGradosInput
  }

  export type MateriaGradosUncheckedCreateWithoutGradoInput = {
    id?: number
    materia_id: number
    created_at?: Date | string
  }

  export type MateriaGradosCreateOrConnectWithoutGradoInput = {
    where: MateriaGradosWhereUniqueInput
    create: XOR<MateriaGradosCreateWithoutGradoInput, MateriaGradosUncheckedCreateWithoutGradoInput>
  }

  export type MateriaGradosCreateManyGradoInputEnvelope = {
    data: MateriaGradosCreateManyGradoInput | MateriaGradosCreateManyGradoInput[]
    skipDuplicates?: boolean
  }

  export type InstitucionesUpsertWithoutGradosInput = {
    update: XOR<InstitucionesUpdateWithoutGradosInput, InstitucionesUncheckedUpdateWithoutGradosInput>
    create: XOR<InstitucionesCreateWithoutGradosInput, InstitucionesUncheckedCreateWithoutGradosInput>
    where?: InstitucionesWhereInput
  }

  export type InstitucionesUpdateToOneWithWhereWithoutGradosInput = {
    where?: InstitucionesWhereInput
    data: XOR<InstitucionesUpdateWithoutGradosInput, InstitucionesUncheckedUpdateWithoutGradosInput>
  }

  export type InstitucionesUpdateWithoutGradosInput = {
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
    cursos?: CursosUpdateManyWithoutInstitucionNestedInput
    areas?: AreasUpdateManyWithoutInstitucionNestedInput
    materias?: MateriasUpdateManyWithoutInstitucionNestedInput
    docentes?: DocentesUpdateManyWithoutInstitucionNestedInput
    estudiantes?: EstudiantesUpdateManyWithoutInstitucionNestedInput
  }

  export type InstitucionesUncheckedUpdateWithoutGradosInput = {
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
    cursos?: CursosUncheckedUpdateManyWithoutInstitucionNestedInput
    areas?: AreasUncheckedUpdateManyWithoutInstitucionNestedInput
    materias?: MateriasUncheckedUpdateManyWithoutInstitucionNestedInput
    docentes?: DocentesUncheckedUpdateManyWithoutInstitucionNestedInput
    estudiantes?: EstudiantesUncheckedUpdateManyWithoutInstitucionNestedInput
  }

  export type CursosUpsertWithWhereUniqueWithoutGradoInput = {
    where: CursosWhereUniqueInput
    update: XOR<CursosUpdateWithoutGradoInput, CursosUncheckedUpdateWithoutGradoInput>
    create: XOR<CursosCreateWithoutGradoInput, CursosUncheckedCreateWithoutGradoInput>
  }

  export type CursosUpdateWithWhereUniqueWithoutGradoInput = {
    where: CursosWhereUniqueInput
    data: XOR<CursosUpdateWithoutGradoInput, CursosUncheckedUpdateWithoutGradoInput>
  }

  export type CursosUpdateManyWithWhereWithoutGradoInput = {
    where: CursosScalarWhereInput
    data: XOR<CursosUpdateManyMutationInput, CursosUncheckedUpdateManyWithoutGradoInput>
  }

  export type MateriaGradosUpsertWithWhereUniqueWithoutGradoInput = {
    where: MateriaGradosWhereUniqueInput
    update: XOR<MateriaGradosUpdateWithoutGradoInput, MateriaGradosUncheckedUpdateWithoutGradoInput>
    create: XOR<MateriaGradosCreateWithoutGradoInput, MateriaGradosUncheckedCreateWithoutGradoInput>
  }

  export type MateriaGradosUpdateWithWhereUniqueWithoutGradoInput = {
    where: MateriaGradosWhereUniqueInput
    data: XOR<MateriaGradosUpdateWithoutGradoInput, MateriaGradosUncheckedUpdateWithoutGradoInput>
  }

  export type MateriaGradosUpdateManyWithWhereWithoutGradoInput = {
    where: MateriaGradosScalarWhereInput
    data: XOR<MateriaGradosUpdateManyMutationInput, MateriaGradosUncheckedUpdateManyWithoutGradoInput>
  }

  export type MateriaGradosScalarWhereInput = {
    AND?: MateriaGradosScalarWhereInput | MateriaGradosScalarWhereInput[]
    OR?: MateriaGradosScalarWhereInput[]
    NOT?: MateriaGradosScalarWhereInput | MateriaGradosScalarWhereInput[]
    id?: IntFilter<"MateriaGrados"> | number
    materia_id?: IntFilter<"MateriaGrados"> | number
    grado_id?: IntFilter<"MateriaGrados"> | number
    created_at?: DateTimeFilter<"MateriaGrados"> | Date | string
  }

  export type GradosCreateWithoutCursosInput = {
    nombre: string
    nivel: string
    orden: number
    created_at?: Date | string
    updated_at?: Date | string
    institucion: InstitucionesCreateNestedOneWithoutGradosInput
    materiaGrados?: MateriaGradosCreateNestedManyWithoutGradoInput
  }

  export type GradosUncheckedCreateWithoutCursosInput = {
    id?: number
    nombre: string
    nivel: string
    orden: number
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
    materiaGrados?: MateriaGradosUncheckedCreateNestedManyWithoutGradoInput
  }

  export type GradosCreateOrConnectWithoutCursosInput = {
    where: GradosWhereUniqueInput
    create: XOR<GradosCreateWithoutCursosInput, GradosUncheckedCreateWithoutCursosInput>
  }

  export type InstitucionesCreateWithoutCursosInput = {
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
    grados?: GradosCreateNestedManyWithoutInstitucionInput
    areas?: AreasCreateNestedManyWithoutInstitucionInput
    materias?: MateriasCreateNestedManyWithoutInstitucionInput
    docentes?: DocentesCreateNestedManyWithoutInstitucionInput
    estudiantes?: EstudiantesCreateNestedManyWithoutInstitucionInput
  }

  export type InstitucionesUncheckedCreateWithoutCursosInput = {
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
    grados?: GradosUncheckedCreateNestedManyWithoutInstitucionInput
    areas?: AreasUncheckedCreateNestedManyWithoutInstitucionInput
    materias?: MateriasUncheckedCreateNestedManyWithoutInstitucionInput
    docentes?: DocentesUncheckedCreateNestedManyWithoutInstitucionInput
    estudiantes?: EstudiantesUncheckedCreateNestedManyWithoutInstitucionInput
  }

  export type InstitucionesCreateOrConnectWithoutCursosInput = {
    where: InstitucionesWhereUniqueInput
    create: XOR<InstitucionesCreateWithoutCursosInput, InstitucionesUncheckedCreateWithoutCursosInput>
  }

  export type SedesCreateWithoutCursosInput = {
    nombre: string
    jornadas?: SedesCreatejornadasInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    administradores?: AdministradoresCreateNestedManyWithoutSedeInput
    docentes?: DocentesCreateNestedManyWithoutSedeInput
    institucion: InstitucionesCreateNestedOneWithoutSedesInput
  }

  export type SedesUncheckedCreateWithoutCursosInput = {
    id?: number
    nombre: string
    jornadas?: SedesCreatejornadasInput | string[]
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
    administradores?: AdministradoresUncheckedCreateNestedManyWithoutSedeInput
    docentes?: DocentesUncheckedCreateNestedManyWithoutSedeInput
  }

  export type SedesCreateOrConnectWithoutCursosInput = {
    where: SedesWhereUniqueInput
    create: XOR<SedesCreateWithoutCursosInput, SedesUncheckedCreateWithoutCursosInput>
  }

  export type EstudiantesCreateWithoutCursoInput = {
    apellidos: string
    nombres: string
    codigo_estudiantil: string
    nombre_acudiente: string
    correo_acudiente?: string | null
    telefono_acudiente: string
    activo?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    institucion: InstitucionesCreateNestedOneWithoutEstudiantesInput
  }

  export type EstudiantesUncheckedCreateWithoutCursoInput = {
    id?: number
    apellidos: string
    nombres: string
    codigo_estudiantil: string
    nombre_acudiente: string
    correo_acudiente?: string | null
    telefono_acudiente: string
    institucion_id: number
    activo?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type EstudiantesCreateOrConnectWithoutCursoInput = {
    where: EstudiantesWhereUniqueInput
    create: XOR<EstudiantesCreateWithoutCursoInput, EstudiantesUncheckedCreateWithoutCursoInput>
  }

  export type EstudiantesCreateManyCursoInputEnvelope = {
    data: EstudiantesCreateManyCursoInput | EstudiantesCreateManyCursoInput[]
    skipDuplicates?: boolean
  }

  export type DocenteAsignacionesCreateWithoutCursoInput = {
    created_at?: Date | string
    docente: DocentesCreateNestedOneWithoutDocenteAsignacionesInput
    materia: MateriasCreateNestedOneWithoutDocenteAsignacionesInput
  }

  export type DocenteAsignacionesUncheckedCreateWithoutCursoInput = {
    id?: number
    docente_id: number
    materia_id: number
    created_at?: Date | string
  }

  export type DocenteAsignacionesCreateOrConnectWithoutCursoInput = {
    where: DocenteAsignacionesWhereUniqueInput
    create: XOR<DocenteAsignacionesCreateWithoutCursoInput, DocenteAsignacionesUncheckedCreateWithoutCursoInput>
  }

  export type DocenteAsignacionesCreateManyCursoInputEnvelope = {
    data: DocenteAsignacionesCreateManyCursoInput | DocenteAsignacionesCreateManyCursoInput[]
    skipDuplicates?: boolean
  }

  export type GradosUpsertWithoutCursosInput = {
    update: XOR<GradosUpdateWithoutCursosInput, GradosUncheckedUpdateWithoutCursosInput>
    create: XOR<GradosCreateWithoutCursosInput, GradosUncheckedCreateWithoutCursosInput>
    where?: GradosWhereInput
  }

  export type GradosUpdateToOneWithWhereWithoutCursosInput = {
    where?: GradosWhereInput
    data: XOR<GradosUpdateWithoutCursosInput, GradosUncheckedUpdateWithoutCursosInput>
  }

  export type GradosUpdateWithoutCursosInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    nivel?: StringFieldUpdateOperationsInput | string
    orden?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    institucion?: InstitucionesUpdateOneRequiredWithoutGradosNestedInput
    materiaGrados?: MateriaGradosUpdateManyWithoutGradoNestedInput
  }

  export type GradosUncheckedUpdateWithoutCursosInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    nivel?: StringFieldUpdateOperationsInput | string
    orden?: IntFieldUpdateOperationsInput | number
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    materiaGrados?: MateriaGradosUncheckedUpdateManyWithoutGradoNestedInput
  }

  export type InstitucionesUpsertWithoutCursosInput = {
    update: XOR<InstitucionesUpdateWithoutCursosInput, InstitucionesUncheckedUpdateWithoutCursosInput>
    create: XOR<InstitucionesCreateWithoutCursosInput, InstitucionesUncheckedCreateWithoutCursosInput>
    where?: InstitucionesWhereInput
  }

  export type InstitucionesUpdateToOneWithWhereWithoutCursosInput = {
    where?: InstitucionesWhereInput
    data: XOR<InstitucionesUpdateWithoutCursosInput, InstitucionesUncheckedUpdateWithoutCursosInput>
  }

  export type InstitucionesUpdateWithoutCursosInput = {
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
    grados?: GradosUpdateManyWithoutInstitucionNestedInput
    areas?: AreasUpdateManyWithoutInstitucionNestedInput
    materias?: MateriasUpdateManyWithoutInstitucionNestedInput
    docentes?: DocentesUpdateManyWithoutInstitucionNestedInput
    estudiantes?: EstudiantesUpdateManyWithoutInstitucionNestedInput
  }

  export type InstitucionesUncheckedUpdateWithoutCursosInput = {
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
    grados?: GradosUncheckedUpdateManyWithoutInstitucionNestedInput
    areas?: AreasUncheckedUpdateManyWithoutInstitucionNestedInput
    materias?: MateriasUncheckedUpdateManyWithoutInstitucionNestedInput
    docentes?: DocentesUncheckedUpdateManyWithoutInstitucionNestedInput
    estudiantes?: EstudiantesUncheckedUpdateManyWithoutInstitucionNestedInput
  }

  export type SedesUpsertWithoutCursosInput = {
    update: XOR<SedesUpdateWithoutCursosInput, SedesUncheckedUpdateWithoutCursosInput>
    create: XOR<SedesCreateWithoutCursosInput, SedesUncheckedCreateWithoutCursosInput>
    where?: SedesWhereInput
  }

  export type SedesUpdateToOneWithWhereWithoutCursosInput = {
    where?: SedesWhereInput
    data: XOR<SedesUpdateWithoutCursosInput, SedesUncheckedUpdateWithoutCursosInput>
  }

  export type SedesUpdateWithoutCursosInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    jornadas?: SedesUpdatejornadasInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    administradores?: AdministradoresUpdateManyWithoutSedeNestedInput
    docentes?: DocentesUpdateManyWithoutSedeNestedInput
    institucion?: InstitucionesUpdateOneRequiredWithoutSedesNestedInput
  }

  export type SedesUncheckedUpdateWithoutCursosInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    jornadas?: SedesUpdatejornadasInput | string[]
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    administradores?: AdministradoresUncheckedUpdateManyWithoutSedeNestedInput
    docentes?: DocentesUncheckedUpdateManyWithoutSedeNestedInput
  }

  export type EstudiantesUpsertWithWhereUniqueWithoutCursoInput = {
    where: EstudiantesWhereUniqueInput
    update: XOR<EstudiantesUpdateWithoutCursoInput, EstudiantesUncheckedUpdateWithoutCursoInput>
    create: XOR<EstudiantesCreateWithoutCursoInput, EstudiantesUncheckedCreateWithoutCursoInput>
  }

  export type EstudiantesUpdateWithWhereUniqueWithoutCursoInput = {
    where: EstudiantesWhereUniqueInput
    data: XOR<EstudiantesUpdateWithoutCursoInput, EstudiantesUncheckedUpdateWithoutCursoInput>
  }

  export type EstudiantesUpdateManyWithWhereWithoutCursoInput = {
    where: EstudiantesScalarWhereInput
    data: XOR<EstudiantesUpdateManyMutationInput, EstudiantesUncheckedUpdateManyWithoutCursoInput>
  }

  export type DocenteAsignacionesUpsertWithWhereUniqueWithoutCursoInput = {
    where: DocenteAsignacionesWhereUniqueInput
    update: XOR<DocenteAsignacionesUpdateWithoutCursoInput, DocenteAsignacionesUncheckedUpdateWithoutCursoInput>
    create: XOR<DocenteAsignacionesCreateWithoutCursoInput, DocenteAsignacionesUncheckedCreateWithoutCursoInput>
  }

  export type DocenteAsignacionesUpdateWithWhereUniqueWithoutCursoInput = {
    where: DocenteAsignacionesWhereUniqueInput
    data: XOR<DocenteAsignacionesUpdateWithoutCursoInput, DocenteAsignacionesUncheckedUpdateWithoutCursoInput>
  }

  export type DocenteAsignacionesUpdateManyWithWhereWithoutCursoInput = {
    where: DocenteAsignacionesScalarWhereInput
    data: XOR<DocenteAsignacionesUpdateManyMutationInput, DocenteAsignacionesUncheckedUpdateManyWithoutCursoInput>
  }

  export type DocenteAsignacionesScalarWhereInput = {
    AND?: DocenteAsignacionesScalarWhereInput | DocenteAsignacionesScalarWhereInput[]
    OR?: DocenteAsignacionesScalarWhereInput[]
    NOT?: DocenteAsignacionesScalarWhereInput | DocenteAsignacionesScalarWhereInput[]
    id?: IntFilter<"DocenteAsignaciones"> | number
    docente_id?: IntFilter<"DocenteAsignaciones"> | number
    curso_id?: IntFilter<"DocenteAsignaciones"> | number
    materia_id?: IntFilter<"DocenteAsignaciones"> | number
    created_at?: DateTimeFilter<"DocenteAsignaciones"> | Date | string
  }

  export type InstitucionesCreateWithoutAreasInput = {
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
    grados?: GradosCreateNestedManyWithoutInstitucionInput
    cursos?: CursosCreateNestedManyWithoutInstitucionInput
    materias?: MateriasCreateNestedManyWithoutInstitucionInput
    docentes?: DocentesCreateNestedManyWithoutInstitucionInput
    estudiantes?: EstudiantesCreateNestedManyWithoutInstitucionInput
  }

  export type InstitucionesUncheckedCreateWithoutAreasInput = {
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
    grados?: GradosUncheckedCreateNestedManyWithoutInstitucionInput
    cursos?: CursosUncheckedCreateNestedManyWithoutInstitucionInput
    materias?: MateriasUncheckedCreateNestedManyWithoutInstitucionInput
    docentes?: DocentesUncheckedCreateNestedManyWithoutInstitucionInput
    estudiantes?: EstudiantesUncheckedCreateNestedManyWithoutInstitucionInput
  }

  export type InstitucionesCreateOrConnectWithoutAreasInput = {
    where: InstitucionesWhereUniqueInput
    create: XOR<InstitucionesCreateWithoutAreasInput, InstitucionesUncheckedCreateWithoutAreasInput>
  }

  export type MateriasCreateWithoutAreaInput = {
    nombre: string
    created_at?: Date | string
    updated_at?: Date | string
    institucion: InstitucionesCreateNestedOneWithoutMateriasInput
    materiaGrados?: MateriaGradosCreateNestedManyWithoutMateriaInput
    docenteAsignaciones?: DocenteAsignacionesCreateNestedManyWithoutMateriaInput
  }

  export type MateriasUncheckedCreateWithoutAreaInput = {
    id?: number
    nombre: string
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
    materiaGrados?: MateriaGradosUncheckedCreateNestedManyWithoutMateriaInput
    docenteAsignaciones?: DocenteAsignacionesUncheckedCreateNestedManyWithoutMateriaInput
  }

  export type MateriasCreateOrConnectWithoutAreaInput = {
    where: MateriasWhereUniqueInput
    create: XOR<MateriasCreateWithoutAreaInput, MateriasUncheckedCreateWithoutAreaInput>
  }

  export type MateriasCreateManyAreaInputEnvelope = {
    data: MateriasCreateManyAreaInput | MateriasCreateManyAreaInput[]
    skipDuplicates?: boolean
  }

  export type InstitucionesUpsertWithoutAreasInput = {
    update: XOR<InstitucionesUpdateWithoutAreasInput, InstitucionesUncheckedUpdateWithoutAreasInput>
    create: XOR<InstitucionesCreateWithoutAreasInput, InstitucionesUncheckedCreateWithoutAreasInput>
    where?: InstitucionesWhereInput
  }

  export type InstitucionesUpdateToOneWithWhereWithoutAreasInput = {
    where?: InstitucionesWhereInput
    data: XOR<InstitucionesUpdateWithoutAreasInput, InstitucionesUncheckedUpdateWithoutAreasInput>
  }

  export type InstitucionesUpdateWithoutAreasInput = {
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
    grados?: GradosUpdateManyWithoutInstitucionNestedInput
    cursos?: CursosUpdateManyWithoutInstitucionNestedInput
    materias?: MateriasUpdateManyWithoutInstitucionNestedInput
    docentes?: DocentesUpdateManyWithoutInstitucionNestedInput
    estudiantes?: EstudiantesUpdateManyWithoutInstitucionNestedInput
  }

  export type InstitucionesUncheckedUpdateWithoutAreasInput = {
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
    grados?: GradosUncheckedUpdateManyWithoutInstitucionNestedInput
    cursos?: CursosUncheckedUpdateManyWithoutInstitucionNestedInput
    materias?: MateriasUncheckedUpdateManyWithoutInstitucionNestedInput
    docentes?: DocentesUncheckedUpdateManyWithoutInstitucionNestedInput
    estudiantes?: EstudiantesUncheckedUpdateManyWithoutInstitucionNestedInput
  }

  export type MateriasUpsertWithWhereUniqueWithoutAreaInput = {
    where: MateriasWhereUniqueInput
    update: XOR<MateriasUpdateWithoutAreaInput, MateriasUncheckedUpdateWithoutAreaInput>
    create: XOR<MateriasCreateWithoutAreaInput, MateriasUncheckedCreateWithoutAreaInput>
  }

  export type MateriasUpdateWithWhereUniqueWithoutAreaInput = {
    where: MateriasWhereUniqueInput
    data: XOR<MateriasUpdateWithoutAreaInput, MateriasUncheckedUpdateWithoutAreaInput>
  }

  export type MateriasUpdateManyWithWhereWithoutAreaInput = {
    where: MateriasScalarWhereInput
    data: XOR<MateriasUpdateManyMutationInput, MateriasUncheckedUpdateManyWithoutAreaInput>
  }

  export type AreasCreateWithoutMateriasInput = {
    nombre: string
    es_opcional?: boolean
    orden: number
    activa?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    institucion: InstitucionesCreateNestedOneWithoutAreasInput
  }

  export type AreasUncheckedCreateWithoutMateriasInput = {
    id?: number
    nombre: string
    es_opcional?: boolean
    orden: number
    institucion_id: number
    activa?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type AreasCreateOrConnectWithoutMateriasInput = {
    where: AreasWhereUniqueInput
    create: XOR<AreasCreateWithoutMateriasInput, AreasUncheckedCreateWithoutMateriasInput>
  }

  export type InstitucionesCreateWithoutMateriasInput = {
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
    grados?: GradosCreateNestedManyWithoutInstitucionInput
    cursos?: CursosCreateNestedManyWithoutInstitucionInput
    areas?: AreasCreateNestedManyWithoutInstitucionInput
    docentes?: DocentesCreateNestedManyWithoutInstitucionInput
    estudiantes?: EstudiantesCreateNestedManyWithoutInstitucionInput
  }

  export type InstitucionesUncheckedCreateWithoutMateriasInput = {
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
    grados?: GradosUncheckedCreateNestedManyWithoutInstitucionInput
    cursos?: CursosUncheckedCreateNestedManyWithoutInstitucionInput
    areas?: AreasUncheckedCreateNestedManyWithoutInstitucionInput
    docentes?: DocentesUncheckedCreateNestedManyWithoutInstitucionInput
    estudiantes?: EstudiantesUncheckedCreateNestedManyWithoutInstitucionInput
  }

  export type InstitucionesCreateOrConnectWithoutMateriasInput = {
    where: InstitucionesWhereUniqueInput
    create: XOR<InstitucionesCreateWithoutMateriasInput, InstitucionesUncheckedCreateWithoutMateriasInput>
  }

  export type MateriaGradosCreateWithoutMateriaInput = {
    created_at?: Date | string
    grado: GradosCreateNestedOneWithoutMateriaGradosInput
  }

  export type MateriaGradosUncheckedCreateWithoutMateriaInput = {
    id?: number
    grado_id: number
    created_at?: Date | string
  }

  export type MateriaGradosCreateOrConnectWithoutMateriaInput = {
    where: MateriaGradosWhereUniqueInput
    create: XOR<MateriaGradosCreateWithoutMateriaInput, MateriaGradosUncheckedCreateWithoutMateriaInput>
  }

  export type MateriaGradosCreateManyMateriaInputEnvelope = {
    data: MateriaGradosCreateManyMateriaInput | MateriaGradosCreateManyMateriaInput[]
    skipDuplicates?: boolean
  }

  export type DocenteAsignacionesCreateWithoutMateriaInput = {
    created_at?: Date | string
    docente: DocentesCreateNestedOneWithoutDocenteAsignacionesInput
    curso: CursosCreateNestedOneWithoutDocenteAsignacionesInput
  }

  export type DocenteAsignacionesUncheckedCreateWithoutMateriaInput = {
    id?: number
    docente_id: number
    curso_id: number
    created_at?: Date | string
  }

  export type DocenteAsignacionesCreateOrConnectWithoutMateriaInput = {
    where: DocenteAsignacionesWhereUniqueInput
    create: XOR<DocenteAsignacionesCreateWithoutMateriaInput, DocenteAsignacionesUncheckedCreateWithoutMateriaInput>
  }

  export type DocenteAsignacionesCreateManyMateriaInputEnvelope = {
    data: DocenteAsignacionesCreateManyMateriaInput | DocenteAsignacionesCreateManyMateriaInput[]
    skipDuplicates?: boolean
  }

  export type AreasUpsertWithoutMateriasInput = {
    update: XOR<AreasUpdateWithoutMateriasInput, AreasUncheckedUpdateWithoutMateriasInput>
    create: XOR<AreasCreateWithoutMateriasInput, AreasUncheckedCreateWithoutMateriasInput>
    where?: AreasWhereInput
  }

  export type AreasUpdateToOneWithWhereWithoutMateriasInput = {
    where?: AreasWhereInput
    data: XOR<AreasUpdateWithoutMateriasInput, AreasUncheckedUpdateWithoutMateriasInput>
  }

  export type AreasUpdateWithoutMateriasInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    es_opcional?: BoolFieldUpdateOperationsInput | boolean
    orden?: IntFieldUpdateOperationsInput | number
    activa?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    institucion?: InstitucionesUpdateOneRequiredWithoutAreasNestedInput
  }

  export type AreasUncheckedUpdateWithoutMateriasInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    es_opcional?: BoolFieldUpdateOperationsInput | boolean
    orden?: IntFieldUpdateOperationsInput | number
    institucion_id?: IntFieldUpdateOperationsInput | number
    activa?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InstitucionesUpsertWithoutMateriasInput = {
    update: XOR<InstitucionesUpdateWithoutMateriasInput, InstitucionesUncheckedUpdateWithoutMateriasInput>
    create: XOR<InstitucionesCreateWithoutMateriasInput, InstitucionesUncheckedCreateWithoutMateriasInput>
    where?: InstitucionesWhereInput
  }

  export type InstitucionesUpdateToOneWithWhereWithoutMateriasInput = {
    where?: InstitucionesWhereInput
    data: XOR<InstitucionesUpdateWithoutMateriasInput, InstitucionesUncheckedUpdateWithoutMateriasInput>
  }

  export type InstitucionesUpdateWithoutMateriasInput = {
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
    grados?: GradosUpdateManyWithoutInstitucionNestedInput
    cursos?: CursosUpdateManyWithoutInstitucionNestedInput
    areas?: AreasUpdateManyWithoutInstitucionNestedInput
    docentes?: DocentesUpdateManyWithoutInstitucionNestedInput
    estudiantes?: EstudiantesUpdateManyWithoutInstitucionNestedInput
  }

  export type InstitucionesUncheckedUpdateWithoutMateriasInput = {
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
    grados?: GradosUncheckedUpdateManyWithoutInstitucionNestedInput
    cursos?: CursosUncheckedUpdateManyWithoutInstitucionNestedInput
    areas?: AreasUncheckedUpdateManyWithoutInstitucionNestedInput
    docentes?: DocentesUncheckedUpdateManyWithoutInstitucionNestedInput
    estudiantes?: EstudiantesUncheckedUpdateManyWithoutInstitucionNestedInput
  }

  export type MateriaGradosUpsertWithWhereUniqueWithoutMateriaInput = {
    where: MateriaGradosWhereUniqueInput
    update: XOR<MateriaGradosUpdateWithoutMateriaInput, MateriaGradosUncheckedUpdateWithoutMateriaInput>
    create: XOR<MateriaGradosCreateWithoutMateriaInput, MateriaGradosUncheckedCreateWithoutMateriaInput>
  }

  export type MateriaGradosUpdateWithWhereUniqueWithoutMateriaInput = {
    where: MateriaGradosWhereUniqueInput
    data: XOR<MateriaGradosUpdateWithoutMateriaInput, MateriaGradosUncheckedUpdateWithoutMateriaInput>
  }

  export type MateriaGradosUpdateManyWithWhereWithoutMateriaInput = {
    where: MateriaGradosScalarWhereInput
    data: XOR<MateriaGradosUpdateManyMutationInput, MateriaGradosUncheckedUpdateManyWithoutMateriaInput>
  }

  export type DocenteAsignacionesUpsertWithWhereUniqueWithoutMateriaInput = {
    where: DocenteAsignacionesWhereUniqueInput
    update: XOR<DocenteAsignacionesUpdateWithoutMateriaInput, DocenteAsignacionesUncheckedUpdateWithoutMateriaInput>
    create: XOR<DocenteAsignacionesCreateWithoutMateriaInput, DocenteAsignacionesUncheckedCreateWithoutMateriaInput>
  }

  export type DocenteAsignacionesUpdateWithWhereUniqueWithoutMateriaInput = {
    where: DocenteAsignacionesWhereUniqueInput
    data: XOR<DocenteAsignacionesUpdateWithoutMateriaInput, DocenteAsignacionesUncheckedUpdateWithoutMateriaInput>
  }

  export type DocenteAsignacionesUpdateManyWithWhereWithoutMateriaInput = {
    where: DocenteAsignacionesScalarWhereInput
    data: XOR<DocenteAsignacionesUpdateManyMutationInput, DocenteAsignacionesUncheckedUpdateManyWithoutMateriaInput>
  }

  export type MateriasCreateWithoutMateriaGradosInput = {
    nombre: string
    created_at?: Date | string
    updated_at?: Date | string
    area: AreasCreateNestedOneWithoutMateriasInput
    institucion: InstitucionesCreateNestedOneWithoutMateriasInput
    docenteAsignaciones?: DocenteAsignacionesCreateNestedManyWithoutMateriaInput
  }

  export type MateriasUncheckedCreateWithoutMateriaGradosInput = {
    id?: number
    nombre: string
    area_id: number
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
    docenteAsignaciones?: DocenteAsignacionesUncheckedCreateNestedManyWithoutMateriaInput
  }

  export type MateriasCreateOrConnectWithoutMateriaGradosInput = {
    where: MateriasWhereUniqueInput
    create: XOR<MateriasCreateWithoutMateriaGradosInput, MateriasUncheckedCreateWithoutMateriaGradosInput>
  }

  export type GradosCreateWithoutMateriaGradosInput = {
    nombre: string
    nivel: string
    orden: number
    created_at?: Date | string
    updated_at?: Date | string
    institucion: InstitucionesCreateNestedOneWithoutGradosInput
    cursos?: CursosCreateNestedManyWithoutGradoInput
  }

  export type GradosUncheckedCreateWithoutMateriaGradosInput = {
    id?: number
    nombre: string
    nivel: string
    orden: number
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
    cursos?: CursosUncheckedCreateNestedManyWithoutGradoInput
  }

  export type GradosCreateOrConnectWithoutMateriaGradosInput = {
    where: GradosWhereUniqueInput
    create: XOR<GradosCreateWithoutMateriaGradosInput, GradosUncheckedCreateWithoutMateriaGradosInput>
  }

  export type MateriasUpsertWithoutMateriaGradosInput = {
    update: XOR<MateriasUpdateWithoutMateriaGradosInput, MateriasUncheckedUpdateWithoutMateriaGradosInput>
    create: XOR<MateriasCreateWithoutMateriaGradosInput, MateriasUncheckedCreateWithoutMateriaGradosInput>
    where?: MateriasWhereInput
  }

  export type MateriasUpdateToOneWithWhereWithoutMateriaGradosInput = {
    where?: MateriasWhereInput
    data: XOR<MateriasUpdateWithoutMateriaGradosInput, MateriasUncheckedUpdateWithoutMateriaGradosInput>
  }

  export type MateriasUpdateWithoutMateriaGradosInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    area?: AreasUpdateOneRequiredWithoutMateriasNestedInput
    institucion?: InstitucionesUpdateOneRequiredWithoutMateriasNestedInput
    docenteAsignaciones?: DocenteAsignacionesUpdateManyWithoutMateriaNestedInput
  }

  export type MateriasUncheckedUpdateWithoutMateriaGradosInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    area_id?: IntFieldUpdateOperationsInput | number
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    docenteAsignaciones?: DocenteAsignacionesUncheckedUpdateManyWithoutMateriaNestedInput
  }

  export type GradosUpsertWithoutMateriaGradosInput = {
    update: XOR<GradosUpdateWithoutMateriaGradosInput, GradosUncheckedUpdateWithoutMateriaGradosInput>
    create: XOR<GradosCreateWithoutMateriaGradosInput, GradosUncheckedCreateWithoutMateriaGradosInput>
    where?: GradosWhereInput
  }

  export type GradosUpdateToOneWithWhereWithoutMateriaGradosInput = {
    where?: GradosWhereInput
    data: XOR<GradosUpdateWithoutMateriaGradosInput, GradosUncheckedUpdateWithoutMateriaGradosInput>
  }

  export type GradosUpdateWithoutMateriaGradosInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    nivel?: StringFieldUpdateOperationsInput | string
    orden?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    institucion?: InstitucionesUpdateOneRequiredWithoutGradosNestedInput
    cursos?: CursosUpdateManyWithoutGradoNestedInput
  }

  export type GradosUncheckedUpdateWithoutMateriaGradosInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    nivel?: StringFieldUpdateOperationsInput | string
    orden?: IntFieldUpdateOperationsInput | number
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    cursos?: CursosUncheckedUpdateManyWithoutGradoNestedInput
  }

  export type InstitucionesCreateWithoutDocentesInput = {
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
    grados?: GradosCreateNestedManyWithoutInstitucionInput
    cursos?: CursosCreateNestedManyWithoutInstitucionInput
    areas?: AreasCreateNestedManyWithoutInstitucionInput
    materias?: MateriasCreateNestedManyWithoutInstitucionInput
    estudiantes?: EstudiantesCreateNestedManyWithoutInstitucionInput
  }

  export type InstitucionesUncheckedCreateWithoutDocentesInput = {
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
    grados?: GradosUncheckedCreateNestedManyWithoutInstitucionInput
    cursos?: CursosUncheckedCreateNestedManyWithoutInstitucionInput
    areas?: AreasUncheckedCreateNestedManyWithoutInstitucionInput
    materias?: MateriasUncheckedCreateNestedManyWithoutInstitucionInput
    estudiantes?: EstudiantesUncheckedCreateNestedManyWithoutInstitucionInput
  }

  export type InstitucionesCreateOrConnectWithoutDocentesInput = {
    where: InstitucionesWhereUniqueInput
    create: XOR<InstitucionesCreateWithoutDocentesInput, InstitucionesUncheckedCreateWithoutDocentesInput>
  }

  export type SedesCreateWithoutDocentesInput = {
    nombre: string
    jornadas?: SedesCreatejornadasInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    administradores?: AdministradoresCreateNestedManyWithoutSedeInput
    cursos?: CursosCreateNestedManyWithoutSedeInput
    institucion: InstitucionesCreateNestedOneWithoutSedesInput
  }

  export type SedesUncheckedCreateWithoutDocentesInput = {
    id?: number
    nombre: string
    jornadas?: SedesCreatejornadasInput | string[]
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
    administradores?: AdministradoresUncheckedCreateNestedManyWithoutSedeInput
    cursos?: CursosUncheckedCreateNestedManyWithoutSedeInput
  }

  export type SedesCreateOrConnectWithoutDocentesInput = {
    where: SedesWhereUniqueInput
    create: XOR<SedesCreateWithoutDocentesInput, SedesUncheckedCreateWithoutDocentesInput>
  }

  export type DocenteAsignacionesCreateWithoutDocenteInput = {
    created_at?: Date | string
    curso: CursosCreateNestedOneWithoutDocenteAsignacionesInput
    materia: MateriasCreateNestedOneWithoutDocenteAsignacionesInput
  }

  export type DocenteAsignacionesUncheckedCreateWithoutDocenteInput = {
    id?: number
    curso_id: number
    materia_id: number
    created_at?: Date | string
  }

  export type DocenteAsignacionesCreateOrConnectWithoutDocenteInput = {
    where: DocenteAsignacionesWhereUniqueInput
    create: XOR<DocenteAsignacionesCreateWithoutDocenteInput, DocenteAsignacionesUncheckedCreateWithoutDocenteInput>
  }

  export type DocenteAsignacionesCreateManyDocenteInputEnvelope = {
    data: DocenteAsignacionesCreateManyDocenteInput | DocenteAsignacionesCreateManyDocenteInput[]
    skipDuplicates?: boolean
  }

  export type InstitucionesUpsertWithoutDocentesInput = {
    update: XOR<InstitucionesUpdateWithoutDocentesInput, InstitucionesUncheckedUpdateWithoutDocentesInput>
    create: XOR<InstitucionesCreateWithoutDocentesInput, InstitucionesUncheckedCreateWithoutDocentesInput>
    where?: InstitucionesWhereInput
  }

  export type InstitucionesUpdateToOneWithWhereWithoutDocentesInput = {
    where?: InstitucionesWhereInput
    data: XOR<InstitucionesUpdateWithoutDocentesInput, InstitucionesUncheckedUpdateWithoutDocentesInput>
  }

  export type InstitucionesUpdateWithoutDocentesInput = {
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
    grados?: GradosUpdateManyWithoutInstitucionNestedInput
    cursos?: CursosUpdateManyWithoutInstitucionNestedInput
    areas?: AreasUpdateManyWithoutInstitucionNestedInput
    materias?: MateriasUpdateManyWithoutInstitucionNestedInput
    estudiantes?: EstudiantesUpdateManyWithoutInstitucionNestedInput
  }

  export type InstitucionesUncheckedUpdateWithoutDocentesInput = {
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
    grados?: GradosUncheckedUpdateManyWithoutInstitucionNestedInput
    cursos?: CursosUncheckedUpdateManyWithoutInstitucionNestedInput
    areas?: AreasUncheckedUpdateManyWithoutInstitucionNestedInput
    materias?: MateriasUncheckedUpdateManyWithoutInstitucionNestedInput
    estudiantes?: EstudiantesUncheckedUpdateManyWithoutInstitucionNestedInput
  }

  export type SedesUpsertWithoutDocentesInput = {
    update: XOR<SedesUpdateWithoutDocentesInput, SedesUncheckedUpdateWithoutDocentesInput>
    create: XOR<SedesCreateWithoutDocentesInput, SedesUncheckedCreateWithoutDocentesInput>
    where?: SedesWhereInput
  }

  export type SedesUpdateToOneWithWhereWithoutDocentesInput = {
    where?: SedesWhereInput
    data: XOR<SedesUpdateWithoutDocentesInput, SedesUncheckedUpdateWithoutDocentesInput>
  }

  export type SedesUpdateWithoutDocentesInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    jornadas?: SedesUpdatejornadasInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    administradores?: AdministradoresUpdateManyWithoutSedeNestedInput
    cursos?: CursosUpdateManyWithoutSedeNestedInput
    institucion?: InstitucionesUpdateOneRequiredWithoutSedesNestedInput
  }

  export type SedesUncheckedUpdateWithoutDocentesInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    jornadas?: SedesUpdatejornadasInput | string[]
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    administradores?: AdministradoresUncheckedUpdateManyWithoutSedeNestedInput
    cursos?: CursosUncheckedUpdateManyWithoutSedeNestedInput
  }

  export type DocenteAsignacionesUpsertWithWhereUniqueWithoutDocenteInput = {
    where: DocenteAsignacionesWhereUniqueInput
    update: XOR<DocenteAsignacionesUpdateWithoutDocenteInput, DocenteAsignacionesUncheckedUpdateWithoutDocenteInput>
    create: XOR<DocenteAsignacionesCreateWithoutDocenteInput, DocenteAsignacionesUncheckedCreateWithoutDocenteInput>
  }

  export type DocenteAsignacionesUpdateWithWhereUniqueWithoutDocenteInput = {
    where: DocenteAsignacionesWhereUniqueInput
    data: XOR<DocenteAsignacionesUpdateWithoutDocenteInput, DocenteAsignacionesUncheckedUpdateWithoutDocenteInput>
  }

  export type DocenteAsignacionesUpdateManyWithWhereWithoutDocenteInput = {
    where: DocenteAsignacionesScalarWhereInput
    data: XOR<DocenteAsignacionesUpdateManyMutationInput, DocenteAsignacionesUncheckedUpdateManyWithoutDocenteInput>
  }

  export type DocentesCreateWithoutDocenteAsignacionesInput = {
    apellidos: string
    nombres: string
    telefono: string
    email: string
    activo?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    institucion: InstitucionesCreateNestedOneWithoutDocentesInput
    sede?: SedesCreateNestedOneWithoutDocentesInput
  }

  export type DocentesUncheckedCreateWithoutDocenteAsignacionesInput = {
    id?: number
    apellidos: string
    nombres: string
    telefono: string
    email: string
    institucion_id: number
    sede_id?: number | null
    activo?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type DocentesCreateOrConnectWithoutDocenteAsignacionesInput = {
    where: DocentesWhereUniqueInput
    create: XOR<DocentesCreateWithoutDocenteAsignacionesInput, DocentesUncheckedCreateWithoutDocenteAsignacionesInput>
  }

  export type CursosCreateWithoutDocenteAsignacionesInput = {
    nombre: string
    jornada?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    grado: GradosCreateNestedOneWithoutCursosInput
    institucion: InstitucionesCreateNestedOneWithoutCursosInput
    sede?: SedesCreateNestedOneWithoutCursosInput
    estudiantes?: EstudiantesCreateNestedManyWithoutCursoInput
  }

  export type CursosUncheckedCreateWithoutDocenteAsignacionesInput = {
    id?: number
    nombre: string
    grado_id: number
    jornada?: string | null
    sede_id?: number | null
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
    estudiantes?: EstudiantesUncheckedCreateNestedManyWithoutCursoInput
  }

  export type CursosCreateOrConnectWithoutDocenteAsignacionesInput = {
    where: CursosWhereUniqueInput
    create: XOR<CursosCreateWithoutDocenteAsignacionesInput, CursosUncheckedCreateWithoutDocenteAsignacionesInput>
  }

  export type MateriasCreateWithoutDocenteAsignacionesInput = {
    nombre: string
    created_at?: Date | string
    updated_at?: Date | string
    area: AreasCreateNestedOneWithoutMateriasInput
    institucion: InstitucionesCreateNestedOneWithoutMateriasInput
    materiaGrados?: MateriaGradosCreateNestedManyWithoutMateriaInput
  }

  export type MateriasUncheckedCreateWithoutDocenteAsignacionesInput = {
    id?: number
    nombre: string
    area_id: number
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
    materiaGrados?: MateriaGradosUncheckedCreateNestedManyWithoutMateriaInput
  }

  export type MateriasCreateOrConnectWithoutDocenteAsignacionesInput = {
    where: MateriasWhereUniqueInput
    create: XOR<MateriasCreateWithoutDocenteAsignacionesInput, MateriasUncheckedCreateWithoutDocenteAsignacionesInput>
  }

  export type DocentesUpsertWithoutDocenteAsignacionesInput = {
    update: XOR<DocentesUpdateWithoutDocenteAsignacionesInput, DocentesUncheckedUpdateWithoutDocenteAsignacionesInput>
    create: XOR<DocentesCreateWithoutDocenteAsignacionesInput, DocentesUncheckedCreateWithoutDocenteAsignacionesInput>
    where?: DocentesWhereInput
  }

  export type DocentesUpdateToOneWithWhereWithoutDocenteAsignacionesInput = {
    where?: DocentesWhereInput
    data: XOR<DocentesUpdateWithoutDocenteAsignacionesInput, DocentesUncheckedUpdateWithoutDocenteAsignacionesInput>
  }

  export type DocentesUpdateWithoutDocenteAsignacionesInput = {
    apellidos?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    institucion?: InstitucionesUpdateOneRequiredWithoutDocentesNestedInput
    sede?: SedesUpdateOneWithoutDocentesNestedInput
  }

  export type DocentesUncheckedUpdateWithoutDocenteAsignacionesInput = {
    id?: IntFieldUpdateOperationsInput | number
    apellidos?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    institucion_id?: IntFieldUpdateOperationsInput | number
    sede_id?: NullableIntFieldUpdateOperationsInput | number | null
    activo?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CursosUpsertWithoutDocenteAsignacionesInput = {
    update: XOR<CursosUpdateWithoutDocenteAsignacionesInput, CursosUncheckedUpdateWithoutDocenteAsignacionesInput>
    create: XOR<CursosCreateWithoutDocenteAsignacionesInput, CursosUncheckedCreateWithoutDocenteAsignacionesInput>
    where?: CursosWhereInput
  }

  export type CursosUpdateToOneWithWhereWithoutDocenteAsignacionesInput = {
    where?: CursosWhereInput
    data: XOR<CursosUpdateWithoutDocenteAsignacionesInput, CursosUncheckedUpdateWithoutDocenteAsignacionesInput>
  }

  export type CursosUpdateWithoutDocenteAsignacionesInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    grado?: GradosUpdateOneRequiredWithoutCursosNestedInput
    institucion?: InstitucionesUpdateOneRequiredWithoutCursosNestedInput
    sede?: SedesUpdateOneWithoutCursosNestedInput
    estudiantes?: EstudiantesUpdateManyWithoutCursoNestedInput
  }

  export type CursosUncheckedUpdateWithoutDocenteAsignacionesInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    grado_id?: IntFieldUpdateOperationsInput | number
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    sede_id?: NullableIntFieldUpdateOperationsInput | number | null
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    estudiantes?: EstudiantesUncheckedUpdateManyWithoutCursoNestedInput
  }

  export type MateriasUpsertWithoutDocenteAsignacionesInput = {
    update: XOR<MateriasUpdateWithoutDocenteAsignacionesInput, MateriasUncheckedUpdateWithoutDocenteAsignacionesInput>
    create: XOR<MateriasCreateWithoutDocenteAsignacionesInput, MateriasUncheckedCreateWithoutDocenteAsignacionesInput>
    where?: MateriasWhereInput
  }

  export type MateriasUpdateToOneWithWhereWithoutDocenteAsignacionesInput = {
    where?: MateriasWhereInput
    data: XOR<MateriasUpdateWithoutDocenteAsignacionesInput, MateriasUncheckedUpdateWithoutDocenteAsignacionesInput>
  }

  export type MateriasUpdateWithoutDocenteAsignacionesInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    area?: AreasUpdateOneRequiredWithoutMateriasNestedInput
    institucion?: InstitucionesUpdateOneRequiredWithoutMateriasNestedInput
    materiaGrados?: MateriaGradosUpdateManyWithoutMateriaNestedInput
  }

  export type MateriasUncheckedUpdateWithoutDocenteAsignacionesInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    area_id?: IntFieldUpdateOperationsInput | number
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    materiaGrados?: MateriaGradosUncheckedUpdateManyWithoutMateriaNestedInput
  }

  export type CursosCreateWithoutEstudiantesInput = {
    nombre: string
    jornada?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    grado: GradosCreateNestedOneWithoutCursosInput
    institucion: InstitucionesCreateNestedOneWithoutCursosInput
    sede?: SedesCreateNestedOneWithoutCursosInput
    docenteAsignaciones?: DocenteAsignacionesCreateNestedManyWithoutCursoInput
  }

  export type CursosUncheckedCreateWithoutEstudiantesInput = {
    id?: number
    nombre: string
    grado_id: number
    jornada?: string | null
    sede_id?: number | null
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
    docenteAsignaciones?: DocenteAsignacionesUncheckedCreateNestedManyWithoutCursoInput
  }

  export type CursosCreateOrConnectWithoutEstudiantesInput = {
    where: CursosWhereUniqueInput
    create: XOR<CursosCreateWithoutEstudiantesInput, CursosUncheckedCreateWithoutEstudiantesInput>
  }

  export type InstitucionesCreateWithoutEstudiantesInput = {
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
    grados?: GradosCreateNestedManyWithoutInstitucionInput
    cursos?: CursosCreateNestedManyWithoutInstitucionInput
    areas?: AreasCreateNestedManyWithoutInstitucionInput
    materias?: MateriasCreateNestedManyWithoutInstitucionInput
    docentes?: DocentesCreateNestedManyWithoutInstitucionInput
  }

  export type InstitucionesUncheckedCreateWithoutEstudiantesInput = {
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
    grados?: GradosUncheckedCreateNestedManyWithoutInstitucionInput
    cursos?: CursosUncheckedCreateNestedManyWithoutInstitucionInput
    areas?: AreasUncheckedCreateNestedManyWithoutInstitucionInput
    materias?: MateriasUncheckedCreateNestedManyWithoutInstitucionInput
    docentes?: DocentesUncheckedCreateNestedManyWithoutInstitucionInput
  }

  export type InstitucionesCreateOrConnectWithoutEstudiantesInput = {
    where: InstitucionesWhereUniqueInput
    create: XOR<InstitucionesCreateWithoutEstudiantesInput, InstitucionesUncheckedCreateWithoutEstudiantesInput>
  }

  export type CursosUpsertWithoutEstudiantesInput = {
    update: XOR<CursosUpdateWithoutEstudiantesInput, CursosUncheckedUpdateWithoutEstudiantesInput>
    create: XOR<CursosCreateWithoutEstudiantesInput, CursosUncheckedCreateWithoutEstudiantesInput>
    where?: CursosWhereInput
  }

  export type CursosUpdateToOneWithWhereWithoutEstudiantesInput = {
    where?: CursosWhereInput
    data: XOR<CursosUpdateWithoutEstudiantesInput, CursosUncheckedUpdateWithoutEstudiantesInput>
  }

  export type CursosUpdateWithoutEstudiantesInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    grado?: GradosUpdateOneRequiredWithoutCursosNestedInput
    institucion?: InstitucionesUpdateOneRequiredWithoutCursosNestedInput
    sede?: SedesUpdateOneWithoutCursosNestedInput
    docenteAsignaciones?: DocenteAsignacionesUpdateManyWithoutCursoNestedInput
  }

  export type CursosUncheckedUpdateWithoutEstudiantesInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    grado_id?: IntFieldUpdateOperationsInput | number
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    sede_id?: NullableIntFieldUpdateOperationsInput | number | null
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    docenteAsignaciones?: DocenteAsignacionesUncheckedUpdateManyWithoutCursoNestedInput
  }

  export type InstitucionesUpsertWithoutEstudiantesInput = {
    update: XOR<InstitucionesUpdateWithoutEstudiantesInput, InstitucionesUncheckedUpdateWithoutEstudiantesInput>
    create: XOR<InstitucionesCreateWithoutEstudiantesInput, InstitucionesUncheckedCreateWithoutEstudiantesInput>
    where?: InstitucionesWhereInput
  }

  export type InstitucionesUpdateToOneWithWhereWithoutEstudiantesInput = {
    where?: InstitucionesWhereInput
    data: XOR<InstitucionesUpdateWithoutEstudiantesInput, InstitucionesUncheckedUpdateWithoutEstudiantesInput>
  }

  export type InstitucionesUpdateWithoutEstudiantesInput = {
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
    grados?: GradosUpdateManyWithoutInstitucionNestedInput
    cursos?: CursosUpdateManyWithoutInstitucionNestedInput
    areas?: AreasUpdateManyWithoutInstitucionNestedInput
    materias?: MateriasUpdateManyWithoutInstitucionNestedInput
    docentes?: DocentesUpdateManyWithoutInstitucionNestedInput
  }

  export type InstitucionesUncheckedUpdateWithoutEstudiantesInput = {
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
    grados?: GradosUncheckedUpdateManyWithoutInstitucionNestedInput
    cursos?: CursosUncheckedUpdateManyWithoutInstitucionNestedInput
    areas?: AreasUncheckedUpdateManyWithoutInstitucionNestedInput
    materias?: MateriasUncheckedUpdateManyWithoutInstitucionNestedInput
    docentes?: DocentesUncheckedUpdateManyWithoutInstitucionNestedInput
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

  export type GradosCreateManyInstitucionInput = {
    id?: number
    nombre: string
    nivel: string
    orden: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type CursosCreateManyInstitucionInput = {
    id?: number
    nombre: string
    grado_id: number
    jornada?: string | null
    sede_id?: number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type AreasCreateManyInstitucionInput = {
    id?: number
    nombre: string
    es_opcional?: boolean
    orden: number
    activa?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type MateriasCreateManyInstitucionInput = {
    id?: number
    nombre: string
    area_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type DocentesCreateManyInstitucionInput = {
    id?: number
    apellidos: string
    nombres: string
    telefono: string
    email: string
    sede_id?: number | null
    activo?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type EstudiantesCreateManyInstitucionInput = {
    id?: number
    apellidos: string
    nombres: string
    codigo_estudiantil: string
    nombre_acudiente: string
    correo_acudiente?: string | null
    telefono_acudiente: string
    curso_id: number
    activo?: boolean
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
    cursos?: CursosUpdateManyWithoutSedeNestedInput
    docentes?: DocentesUpdateManyWithoutSedeNestedInput
  }

  export type SedesUncheckedUpdateWithoutInstitucionInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    jornadas?: SedesUpdatejornadasInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    administradores?: AdministradoresUncheckedUpdateManyWithoutSedeNestedInput
    cursos?: CursosUncheckedUpdateManyWithoutSedeNestedInput
    docentes?: DocentesUncheckedUpdateManyWithoutSedeNestedInput
  }

  export type SedesUncheckedUpdateManyWithoutInstitucionInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    jornadas?: SedesUpdatejornadasInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GradosUpdateWithoutInstitucionInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    nivel?: StringFieldUpdateOperationsInput | string
    orden?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    cursos?: CursosUpdateManyWithoutGradoNestedInput
    materiaGrados?: MateriaGradosUpdateManyWithoutGradoNestedInput
  }

  export type GradosUncheckedUpdateWithoutInstitucionInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    nivel?: StringFieldUpdateOperationsInput | string
    orden?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    cursos?: CursosUncheckedUpdateManyWithoutGradoNestedInput
    materiaGrados?: MateriaGradosUncheckedUpdateManyWithoutGradoNestedInput
  }

  export type GradosUncheckedUpdateManyWithoutInstitucionInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    nivel?: StringFieldUpdateOperationsInput | string
    orden?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CursosUpdateWithoutInstitucionInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    grado?: GradosUpdateOneRequiredWithoutCursosNestedInput
    sede?: SedesUpdateOneWithoutCursosNestedInput
    estudiantes?: EstudiantesUpdateManyWithoutCursoNestedInput
    docenteAsignaciones?: DocenteAsignacionesUpdateManyWithoutCursoNestedInput
  }

  export type CursosUncheckedUpdateWithoutInstitucionInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    grado_id?: IntFieldUpdateOperationsInput | number
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    sede_id?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    estudiantes?: EstudiantesUncheckedUpdateManyWithoutCursoNestedInput
    docenteAsignaciones?: DocenteAsignacionesUncheckedUpdateManyWithoutCursoNestedInput
  }

  export type CursosUncheckedUpdateManyWithoutInstitucionInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    grado_id?: IntFieldUpdateOperationsInput | number
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    sede_id?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AreasUpdateWithoutInstitucionInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    es_opcional?: BoolFieldUpdateOperationsInput | boolean
    orden?: IntFieldUpdateOperationsInput | number
    activa?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    materias?: MateriasUpdateManyWithoutAreaNestedInput
  }

  export type AreasUncheckedUpdateWithoutInstitucionInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    es_opcional?: BoolFieldUpdateOperationsInput | boolean
    orden?: IntFieldUpdateOperationsInput | number
    activa?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    materias?: MateriasUncheckedUpdateManyWithoutAreaNestedInput
  }

  export type AreasUncheckedUpdateManyWithoutInstitucionInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    es_opcional?: BoolFieldUpdateOperationsInput | boolean
    orden?: IntFieldUpdateOperationsInput | number
    activa?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MateriasUpdateWithoutInstitucionInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    area?: AreasUpdateOneRequiredWithoutMateriasNestedInput
    materiaGrados?: MateriaGradosUpdateManyWithoutMateriaNestedInput
    docenteAsignaciones?: DocenteAsignacionesUpdateManyWithoutMateriaNestedInput
  }

  export type MateriasUncheckedUpdateWithoutInstitucionInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    area_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    materiaGrados?: MateriaGradosUncheckedUpdateManyWithoutMateriaNestedInput
    docenteAsignaciones?: DocenteAsignacionesUncheckedUpdateManyWithoutMateriaNestedInput
  }

  export type MateriasUncheckedUpdateManyWithoutInstitucionInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    area_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocentesUpdateWithoutInstitucionInput = {
    apellidos?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sede?: SedesUpdateOneWithoutDocentesNestedInput
    docenteAsignaciones?: DocenteAsignacionesUpdateManyWithoutDocenteNestedInput
  }

  export type DocentesUncheckedUpdateWithoutInstitucionInput = {
    id?: IntFieldUpdateOperationsInput | number
    apellidos?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    sede_id?: NullableIntFieldUpdateOperationsInput | number | null
    activo?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    docenteAsignaciones?: DocenteAsignacionesUncheckedUpdateManyWithoutDocenteNestedInput
  }

  export type DocentesUncheckedUpdateManyWithoutInstitucionInput = {
    id?: IntFieldUpdateOperationsInput | number
    apellidos?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    sede_id?: NullableIntFieldUpdateOperationsInput | number | null
    activo?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EstudiantesUpdateWithoutInstitucionInput = {
    apellidos?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    codigo_estudiantil?: StringFieldUpdateOperationsInput | string
    nombre_acudiente?: StringFieldUpdateOperationsInput | string
    correo_acudiente?: NullableStringFieldUpdateOperationsInput | string | null
    telefono_acudiente?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    curso?: CursosUpdateOneRequiredWithoutEstudiantesNestedInput
  }

  export type EstudiantesUncheckedUpdateWithoutInstitucionInput = {
    id?: IntFieldUpdateOperationsInput | number
    apellidos?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    codigo_estudiantil?: StringFieldUpdateOperationsInput | string
    nombre_acudiente?: StringFieldUpdateOperationsInput | string
    correo_acudiente?: NullableStringFieldUpdateOperationsInput | string | null
    telefono_acudiente?: StringFieldUpdateOperationsInput | string
    curso_id?: IntFieldUpdateOperationsInput | number
    activo?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EstudiantesUncheckedUpdateManyWithoutInstitucionInput = {
    id?: IntFieldUpdateOperationsInput | number
    apellidos?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    codigo_estudiantil?: StringFieldUpdateOperationsInput | string
    nombre_acudiente?: StringFieldUpdateOperationsInput | string
    correo_acudiente?: NullableStringFieldUpdateOperationsInput | string | null
    telefono_acudiente?: StringFieldUpdateOperationsInput | string
    curso_id?: IntFieldUpdateOperationsInput | number
    activo?: BoolFieldUpdateOperationsInput | boolean
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

  export type CursosCreateManySedeInput = {
    id?: number
    nombre: string
    grado_id: number
    jornada?: string | null
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type DocentesCreateManySedeInput = {
    id?: number
    apellidos: string
    nombres: string
    telefono: string
    email: string
    institucion_id: number
    activo?: boolean
    created_at?: Date | string
    updated_at?: Date | string
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

  export type CursosUpdateWithoutSedeInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    grado?: GradosUpdateOneRequiredWithoutCursosNestedInput
    institucion?: InstitucionesUpdateOneRequiredWithoutCursosNestedInput
    estudiantes?: EstudiantesUpdateManyWithoutCursoNestedInput
    docenteAsignaciones?: DocenteAsignacionesUpdateManyWithoutCursoNestedInput
  }

  export type CursosUncheckedUpdateWithoutSedeInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    grado_id?: IntFieldUpdateOperationsInput | number
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    estudiantes?: EstudiantesUncheckedUpdateManyWithoutCursoNestedInput
    docenteAsignaciones?: DocenteAsignacionesUncheckedUpdateManyWithoutCursoNestedInput
  }

  export type CursosUncheckedUpdateManyWithoutSedeInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    grado_id?: IntFieldUpdateOperationsInput | number
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocentesUpdateWithoutSedeInput = {
    apellidos?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    institucion?: InstitucionesUpdateOneRequiredWithoutDocentesNestedInput
    docenteAsignaciones?: DocenteAsignacionesUpdateManyWithoutDocenteNestedInput
  }

  export type DocentesUncheckedUpdateWithoutSedeInput = {
    id?: IntFieldUpdateOperationsInput | number
    apellidos?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    institucion_id?: IntFieldUpdateOperationsInput | number
    activo?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    docenteAsignaciones?: DocenteAsignacionesUncheckedUpdateManyWithoutDocenteNestedInput
  }

  export type DocentesUncheckedUpdateManyWithoutSedeInput = {
    id?: IntFieldUpdateOperationsInput | number
    apellidos?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    institucion_id?: IntFieldUpdateOperationsInput | number
    activo?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CursosCreateManyGradoInput = {
    id?: number
    nombre: string
    jornada?: string | null
    sede_id?: number | null
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type MateriaGradosCreateManyGradoInput = {
    id?: number
    materia_id: number
    created_at?: Date | string
  }

  export type CursosUpdateWithoutGradoInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    institucion?: InstitucionesUpdateOneRequiredWithoutCursosNestedInput
    sede?: SedesUpdateOneWithoutCursosNestedInput
    estudiantes?: EstudiantesUpdateManyWithoutCursoNestedInput
    docenteAsignaciones?: DocenteAsignacionesUpdateManyWithoutCursoNestedInput
  }

  export type CursosUncheckedUpdateWithoutGradoInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    sede_id?: NullableIntFieldUpdateOperationsInput | number | null
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    estudiantes?: EstudiantesUncheckedUpdateManyWithoutCursoNestedInput
    docenteAsignaciones?: DocenteAsignacionesUncheckedUpdateManyWithoutCursoNestedInput
  }

  export type CursosUncheckedUpdateManyWithoutGradoInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    sede_id?: NullableIntFieldUpdateOperationsInput | number | null
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MateriaGradosUpdateWithoutGradoInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    materia?: MateriasUpdateOneRequiredWithoutMateriaGradosNestedInput
  }

  export type MateriaGradosUncheckedUpdateWithoutGradoInput = {
    id?: IntFieldUpdateOperationsInput | number
    materia_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MateriaGradosUncheckedUpdateManyWithoutGradoInput = {
    id?: IntFieldUpdateOperationsInput | number
    materia_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EstudiantesCreateManyCursoInput = {
    id?: number
    apellidos: string
    nombres: string
    codigo_estudiantil: string
    nombre_acudiente: string
    correo_acudiente?: string | null
    telefono_acudiente: string
    institucion_id: number
    activo?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type DocenteAsignacionesCreateManyCursoInput = {
    id?: number
    docente_id: number
    materia_id: number
    created_at?: Date | string
  }

  export type EstudiantesUpdateWithoutCursoInput = {
    apellidos?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    codigo_estudiantil?: StringFieldUpdateOperationsInput | string
    nombre_acudiente?: StringFieldUpdateOperationsInput | string
    correo_acudiente?: NullableStringFieldUpdateOperationsInput | string | null
    telefono_acudiente?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    institucion?: InstitucionesUpdateOneRequiredWithoutEstudiantesNestedInput
  }

  export type EstudiantesUncheckedUpdateWithoutCursoInput = {
    id?: IntFieldUpdateOperationsInput | number
    apellidos?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    codigo_estudiantil?: StringFieldUpdateOperationsInput | string
    nombre_acudiente?: StringFieldUpdateOperationsInput | string
    correo_acudiente?: NullableStringFieldUpdateOperationsInput | string | null
    telefono_acudiente?: StringFieldUpdateOperationsInput | string
    institucion_id?: IntFieldUpdateOperationsInput | number
    activo?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EstudiantesUncheckedUpdateManyWithoutCursoInput = {
    id?: IntFieldUpdateOperationsInput | number
    apellidos?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    codigo_estudiantil?: StringFieldUpdateOperationsInput | string
    nombre_acudiente?: StringFieldUpdateOperationsInput | string
    correo_acudiente?: NullableStringFieldUpdateOperationsInput | string | null
    telefono_acudiente?: StringFieldUpdateOperationsInput | string
    institucion_id?: IntFieldUpdateOperationsInput | number
    activo?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocenteAsignacionesUpdateWithoutCursoInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    docente?: DocentesUpdateOneRequiredWithoutDocenteAsignacionesNestedInput
    materia?: MateriasUpdateOneRequiredWithoutDocenteAsignacionesNestedInput
  }

  export type DocenteAsignacionesUncheckedUpdateWithoutCursoInput = {
    id?: IntFieldUpdateOperationsInput | number
    docente_id?: IntFieldUpdateOperationsInput | number
    materia_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocenteAsignacionesUncheckedUpdateManyWithoutCursoInput = {
    id?: IntFieldUpdateOperationsInput | number
    docente_id?: IntFieldUpdateOperationsInput | number
    materia_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MateriasCreateManyAreaInput = {
    id?: number
    nombre: string
    institucion_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type MateriasUpdateWithoutAreaInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    institucion?: InstitucionesUpdateOneRequiredWithoutMateriasNestedInput
    materiaGrados?: MateriaGradosUpdateManyWithoutMateriaNestedInput
    docenteAsignaciones?: DocenteAsignacionesUpdateManyWithoutMateriaNestedInput
  }

  export type MateriasUncheckedUpdateWithoutAreaInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    materiaGrados?: MateriaGradosUncheckedUpdateManyWithoutMateriaNestedInput
    docenteAsignaciones?: DocenteAsignacionesUncheckedUpdateManyWithoutMateriaNestedInput
  }

  export type MateriasUncheckedUpdateManyWithoutAreaInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    institucion_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MateriaGradosCreateManyMateriaInput = {
    id?: number
    grado_id: number
    created_at?: Date | string
  }

  export type DocenteAsignacionesCreateManyMateriaInput = {
    id?: number
    docente_id: number
    curso_id: number
    created_at?: Date | string
  }

  export type MateriaGradosUpdateWithoutMateriaInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    grado?: GradosUpdateOneRequiredWithoutMateriaGradosNestedInput
  }

  export type MateriaGradosUncheckedUpdateWithoutMateriaInput = {
    id?: IntFieldUpdateOperationsInput | number
    grado_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MateriaGradosUncheckedUpdateManyWithoutMateriaInput = {
    id?: IntFieldUpdateOperationsInput | number
    grado_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocenteAsignacionesUpdateWithoutMateriaInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    docente?: DocentesUpdateOneRequiredWithoutDocenteAsignacionesNestedInput
    curso?: CursosUpdateOneRequiredWithoutDocenteAsignacionesNestedInput
  }

  export type DocenteAsignacionesUncheckedUpdateWithoutMateriaInput = {
    id?: IntFieldUpdateOperationsInput | number
    docente_id?: IntFieldUpdateOperationsInput | number
    curso_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocenteAsignacionesUncheckedUpdateManyWithoutMateriaInput = {
    id?: IntFieldUpdateOperationsInput | number
    docente_id?: IntFieldUpdateOperationsInput | number
    curso_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocenteAsignacionesCreateManyDocenteInput = {
    id?: number
    curso_id: number
    materia_id: number
    created_at?: Date | string
  }

  export type DocenteAsignacionesUpdateWithoutDocenteInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    curso?: CursosUpdateOneRequiredWithoutDocenteAsignacionesNestedInput
    materia?: MateriasUpdateOneRequiredWithoutDocenteAsignacionesNestedInput
  }

  export type DocenteAsignacionesUncheckedUpdateWithoutDocenteInput = {
    id?: IntFieldUpdateOperationsInput | number
    curso_id?: IntFieldUpdateOperationsInput | number
    materia_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocenteAsignacionesUncheckedUpdateManyWithoutDocenteInput = {
    id?: IntFieldUpdateOperationsInput | number
    curso_id?: IntFieldUpdateOperationsInput | number
    materia_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
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