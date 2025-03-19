export const seconds = (n: number) => n * 1000
export const minutes = (n: number) => seconds(60) * n
export const hours = (n: number) => minutes(60) * n
export const days = (n: number) => hours(24) * n
export const weeks = (n: number) => days(7) * n

export const REFRESH_TOKEN_DURATION = weeks(1)
export const ACCESS_TOKEN_DURATION = minutes(15)