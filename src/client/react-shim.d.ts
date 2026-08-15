/** Minimal React surface used by the settings row. The actual implementation is
 * the platform React bundle; this shim only satisfies the local TypeScript
 * build without widening the plugin's public API. */
declare module 'react' {
  export function createElement(type: unknown, props?: Record<string, unknown>, ...children: unknown[]): unknown
  export function useState<T>(initial: T): [T, (next: T | ((previous: T) => T)) => void]
}
