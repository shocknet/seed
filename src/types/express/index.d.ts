// Type definitions for Express 4.17
// Project: http://expressjs.com
// Definitions by: Boris Yankov <https://github.com/borisyankov>
//                 China Medical University Hospital <https://github.com/CMUH>
//                 Puneet Arora <https://github.com/puneetar>
//                 Dylan Frankland <https://github.com/dfrankland>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

import * as bodyParser from 'body-parser';
import serveStatic = require('serve-static');
import * as core from 'express-serve-static-core';
import * as qs from 'qs';
import { Readable } from 'stream';
import { Token } from '../../models/Token';

/**
 * Creates an Express application. The express() function is a top-level function exported by the express module.
 */
declare function e(): core.Express;

declare namespace e {
  /**
   * This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
   * @since 4.16.0
   */
  var json: typeof bodyParser.json;

  /**
   * This is a built-in middleware function in Express. It parses incoming requests with Buffer payloads and is based on body-parser.
   * @since 4.17.0
   */
  var raw: typeof bodyParser.raw;

  /**
   * This is a built-in middleware function in Express. It parses incoming requests with text payloads and is based on body-parser.
   * @since 4.17.0
   */
  var text: typeof bodyParser.text;

  /**
   * These are the exposed prototypes.
   */
  var application: Application;
  var request: Request;
  var response: Response;

  /**
   * This is a built-in middleware function in Express. It serves static files and is based on serve-static.
   */
  var static: typeof serveStatic;

  /**
   * This is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser.
   * @since 4.16.0
   */
  var urlencoded: typeof bodyParser.urlencoded;

  /**
   * This is a built-in middleware function in Express. It parses incoming request query parameters.
   */
  export function query(options: qs.IParseOptions | typeof qs.parse): Handler;

  export function Router(options?: RouterOptions): core.Router;

  interface RouterOptions {
    /**
     * Enable case sensitivity.
     */
    caseSensitive?: boolean;

    /**
     * Preserve the req.params values from the parent router.
     * If the parent and the child have conflicting param names, the child’s value take precedence.
     *
     * @default false
     * @since 4.5.0
     */
    mergeParams?: boolean;

    /**
     * Enable strict routing.
     */
    strict?: boolean;
  }

  interface Application extends core.Application {}
  interface CookieOptions extends core.CookieOptions {}
  interface Errback extends core.Errback {}
  interface ErrorRequestHandler<
    P extends core.Params = core.ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = core.Query
  > extends core.ErrorRequestHandler<P, ResBody, ReqBody, ReqQuery> {}
  interface Express extends core.Express {}
  interface Handler extends core.Handler {}
  interface IRoute extends core.IRoute {}
  interface IRouter extends core.IRouter {}
  interface IRouterHandler<T> extends core.IRouterHandler<T> {}
  interface IRouterMatcher<T> extends core.IRouterMatcher<T> {}
  interface MediaType extends core.MediaType {}
  interface NextFunction extends core.NextFunction {}
  interface Request<
    P extends core.Params = core.ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = core.Query
  > extends core.Request<P, ResBody, ReqBody, ReqQuery> {
    token: Token;
  }
  interface RequestHandler<
    P extends core.Params = core.ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = core.Query
  > extends core.RequestHandler<P, ResBody, ReqBody, ReqQuery> {}
  interface RequestParamHandler extends core.RequestParamHandler {}
  export interface Response<ResBody = any> extends core.Response<ResBody> {}
  interface Router extends core.Router {}
  interface Send extends core.Send {}
  interface File {
    /** Name of the form field associated with this file. */
    fieldname: string;
    /** Name of the file on the uploader's computer. */
    originalname: string;
    /**
     * Value of the `Content-Transfer-Encoding` header for this file.
     * @deprecated since July 2015
     * @see RFC 7578, Section 4.7
     */
    encoding: string;
    /** Value of the `Content-Type` header for this file. */
    mimetype: string;
    /** Size of the file in bytes. */
    size: number;
    /**
     * A readable stream of this file. Only available to the `_handleFile`
     * callback for custom `StorageEngine`s.
     */
    stream: Readable;
    /** `DiskStorage` only: Directory to which this file has been uploaded. */
    destination: string;
    /** `DiskStorage` only: Name of this file within `destination`. */
    filename: string;
    /** `DiskStorage` only: Full path to the uploaded file. */
    path: string;
    /** `MemoryStorage` only: A Buffer containing the entire file. */
    buffer: Buffer;
  }
}

export = e;
