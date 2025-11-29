type Loggable = string | number | boolean | object | Error | null | undefined;

const formatLoggable = (arg: unknown): Loggable => {
  if (arg === null || arg === undefined) return String(arg);
  if (arg instanceof Error) return arg;
  if (typeof arg === 'object' || typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'boolean') {
    return arg as Loggable;
  }
  return String(arg);
};

export const logger = {
  info: (message: string, ...args: unknown[]): void => {
    const formattedArgs = args.map(arg => formatLoggable(arg));
    console.log(`[INFO] ${message}`, ...formattedArgs);
  },
  error: (message: string, ...args: unknown[]): void => {
    const formattedArgs = args.map(arg => formatLoggable(arg));
    console.error(`[ERROR] ${message}`, ...formattedArgs);
  },
  warn: (message: string, ...args: unknown[]): void => {
    const formattedArgs = args.map(arg => formatLoggable(arg));
    console.warn(`[WARN] ${message}`, ...formattedArgs);
  },
  debug: (message: string, ...args: unknown[]): void => {
    if (process.env.NODE_ENV === 'development') {
      const formattedArgs = args.map(arg => formatLoggable(arg));
      console.debug(`[DEBUG] ${message}`, ...formattedArgs);
    }
  },
};
