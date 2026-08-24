/**
 * Joins class names, dropping falsy values.
 *
 * Deliberately not `clsx` or `tailwind-merge`. This project has no conflicting-class
 * problem to solve, because variants are expressed as complete class strings chosen
 * by a lookup rather than as base classes overridden by callers.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
