// Type declarations for external modules

declare module '@dropbox/sign' {
  export class SignatureRequestApi {
    username: string;
    signatureRequestSend(data: SignatureRequestSendRequest): Promise<any>;
    signatureRequestGet(requestId: string): Promise<any>;
    signatureRequestCancel(requestId: string): Promise<any>;
  }

  export interface SignatureRequestSendRequest {
    title: string;
    subject: string;
    message: string;
    signers: Array<{
      emailAddress: string;
      name: string;
      order?: number;
    }>;
    files: any[];
    testMode?: boolean;
    formFieldsPerDocument?: any[];
    useTextTags?: boolean;
    hideTextTags?: boolean;
  }

  export interface SignatureRequest {
    signature_request_id: string;
    signatures?: Array<{
      signature_url?: string;
      signer_email_address?: string;
      [key: string]: any;
    }>;
    [key: string]: any;
  }
}

declare module 'fs' {
  export function readFileSync(path: string, options?: any): Buffer | string;
  export function writeFileSync(path: string, data: any, options?: any): void;
  export function existsSync(path: string): boolean;
  export function mkdirSync(path: string, options?: any): void;
  
  export namespace promises {
    export function readFile(path: string, options?: any): Promise<Buffer | string>;
    export function writeFile(path: string, data: any, options?: any): Promise<void>;
    export function mkdir(path: string, options?: any): Promise<void>;
    export function access(path: string, mode?: number): Promise<void>;
  }
}

declare module 'fs/promises' {
  export function readFile(path: string, options?: any): Promise<Buffer | string>;
  export function writeFile(path: string, data: any, options?: any): Promise<void>;
  export function mkdir(path: string, options?: any): Promise<void>;
  export function access(path: string, mode?: number): Promise<void>;
}

declare module 'crypto' {
  export function createHmac(algorithm: string, key: string): {
    update(data: string): any;
    digest(encoding: string): string;
  };
  export function randomBytes(size: number): Buffer;
  export function createHash(algorithm: string): {
    update(data: string | Buffer): any;
    digest(encoding?: string): string | Buffer;
  };
}

declare module 'next/server' {
  export class NextRequest {
    json(): Promise<any>;
    readonly headers: Headers;
    readonly nextUrl: {
      searchParams: URLSearchParams;
      pathname: string;
      [key: string]: any;
    };
    [key: string]: any;
  }

  export class NextResponse {
    static json(data: any, init?: ResponseInit): NextResponse;
    static redirect(url: string, init?: ResponseInit): NextResponse;
    [key: string]: any;
  }
}

declare module 'react' {
  export const useState: <T>(initialValue: T | (() => T)) => [T, (value: T | ((prev: T) => T)) => void];
  export const useEffect: (effect: () => void | (() => void), deps?: any[]) => void;
  export const useCallback: <T extends (...args: any[]) => any>(callback: T, deps: any[]) => T;
  export const useMemo: <T>(factory: () => T, deps: any[]) => T;
  export const useRef: <T>(initialValue: T | null) => { current: T | null };
  
  export interface FC<P = {}> {
    (props: P): JSX.Element | null;
  }

  export namespace JSX {
    interface Element {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
  
  export default React;
  const React: any;
}

declare module 'react-dom' {
  export function render(element: any, container: any): void;
  export default ReactDOM;
  const ReactDOM: any;
}
