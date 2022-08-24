import { getWeekNumber } from "./getWeekNumber"

export const createDate = ( date, locale = 'default' ) => {
    if(!date){
        date = new Date()
    }
    const dayNumber = date.getDate()
    const dayNumberInWeek = (date.getDay() + 6) % 7
    const day = date.toLocaleDateString(locale, { weekday: 'long' })
    const dayShort = date.toLocaleDateString(locale, { weekday: 'short' })
    const year = date.getFullYear()
    const yearShort = date.toLocaleDateString(locale, { year: '2-digit' })
    const month = date.toLocaleDateString(locale, { month: 'long' })
    const monthShort  = date.toLocaleDateString(locale, { month: 'short' })
    const monthNumber = date.getMonth() + 1
    const monthIndex = date.getMonth()
    const timestamp = date.getTime()
    const week = getWeekNumber(date)
    return {
        dayNumber, day, date, dayNumberInWeek, dayShort, year, yearShort, month, monthShort, monthNumber, monthIndex, timestamp, week
    }
}