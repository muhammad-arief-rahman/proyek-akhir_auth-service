export const seconds = (n: number, fromMs: boolean = false) =>
  n * (fromMs ? 1000 : 1) // Convert to milliseconds if fromMs is false
export const minutes = (n: number, fromMs: boolean = false) =>
  seconds(60, fromMs) * n
export const hours = (n: number, fromMs: boolean = false) =>
  minutes(60, fromMs) * n
export const days = (n: number, fromMs: boolean = false) =>
  hours(24, fromMs) * n
export const weeks = (n: number, fromMs: boolean = false) => days(7, fromMs) * n

export const REFRESH_TOKEN_DURATION = weeks(1, true)
export const ACCESS_TOKEN_DURATION = minutes(15)
