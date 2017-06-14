import {Headers} from './headers';

/**
 * A response from a web request
 */
class Response {
  readonly statusCode: number;
  readonly headers: Headers;
  readonly body: Buffer | string;
  readonly url: string;
  constructor(statusCode: number, headers: Headers, body: Buffer | string, url: string) {
    if (typeof statusCode !== 'number') {
      throw new TypeError('statusCode must be a number but was ' + (typeof statusCode));
    }
    if (headers === null) {
      throw new TypeError('headers cannot be null');
    }
    if (typeof headers !== 'object') {
      throw new TypeError('headers must be an object but was ' + (typeof headers));
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
  getBody(encoding: string): string;
  getBody(): Buffer | string;
  getBody(encoding?: string): string | Buffer {
    if (this.statusCode >= 300) {
      var err = new Error('Server responded with status code '
                      + this.statusCode + ':\n' + this.body.toString());
      (err as any).statusCode = this.statusCode;
      (err as any).headers = this.headers;
      (err as any).body = this.body;
      (err as any).url = this.url;
      throw err;
    }
    return encoding ? (this.body as any).toString(encoding) : this.body;
  }
}

export = Response;
