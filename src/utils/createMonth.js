import { createDate } from "./createDate"
import { getMonthNumberOfDays } from "./getMonthNumberOfDays"

export const createMonth = (date = new Date(), locale = 'default') => {
    const { month: monthName, year, monthNumber, monthIndex } = createDate(date)

    const getDay = (dayNumber) => {
        return createDate(new Date(year, monthIndex, dayNumber), locale)
    }
    const createMonthDays = () => {
        const days = []
        for(let i = 0; i<=getMonthNumberOfDays(monthIndex, year)-1;i++ ){
            days[i] = getDay(i+1)
        }
        return days
    }
    return {
        monthName, monthNumber, monthIndex, year, getDay, createMonthDays
    }
}