import {IncomingHttpHeaders} from 'http';

/**
 * A response from a web request
 */
class Response<TBody> {
  readonly statusCode: number;
  readonly headers: IncomingHttpHeaders;
  readonly body: TBody;
  readonly url: string;
  constructor(
    statusCode: number,
    headers: IncomingHttpHeaders,
    body: TBody,
    url: string
  ) {
    if (typeof statusCode !== 'number') {
      throw new TypeError(
        'statusCode must be a number but was ' + typeof statusCode
      );
    }
    if (headers === null) {
      throw new TypeError('headers cannot be null');
    }
    if (typeof headers !== 'object') {
      throw new TypeError(
        'headers must be an object but was ' + typeof headers
      );
    }
    this.statusCode = statusCode;
    const headersToLowerCase = {};
    for (var key in headers) {
      (headersToLowerCase as any)[key.toLowerCase()] = headers[key];
    }
    this.headers = headersToLowerCase;
    this.body = body;
    this.url = url;
  }
  isError(): boolean {
    return this.statusCode === 0 || this.statusCode >= 400;
  }
  getBody(encoding: string): string;
  getBody(): TBody;
  getBody(encoding?: string): TBody | string {
    if (this.statusCode === 0) {
      var err = new Error(
        'This request to ' +
          this.url +
          ' resulted in a status code of 0. This usually indicates some kind of network error in a browser (e.g. CORS not being set up or the DNS failing to resolve):\n' +
          this.body.toString()
      );
      (err as any).statusCode = this.statusCode;
      (err as any).headers = this.headers;
      (err as any).body = this.body;
      (err as any).url = this.url;
      throw err;
    }
    if (this.statusCode >= 300) {
      var err = new Error(
        'Server responded to ' +
          this.url +
          ' with status code ' +
          this.statusCode +
          ':\n' +
          this.body.toString()
      );
      (err as any).statusCode = this.statusCode;
      (err as any).headers = this.headers;
      (err as any).body = this.body;
      (err as any).url = this.url;
      throw err;
    }
    if (!encoding || typeof this.body === 'string') {
      return this.body;
    }
    return (this.body as any).toString(encoding);
  }
}

export = Response;
