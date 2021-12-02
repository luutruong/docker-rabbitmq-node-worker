import {URL} from 'url'

export function log(...args: any[]): void {
  const now = new Date()
  console.log(`[${now.toLocaleString()}]`, ...args)
}

export function isValidUrl(str: string): boolean {
  try {
    const component = new URL(str)
    if (component.hostname && component.hostname.indexOf('.') >= 0) {
      return true
    }

    return false
  } catch (e: any) {
    return false
  }
}
