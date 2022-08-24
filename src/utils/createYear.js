import { createDate } from "./createDate"
import { createMonth } from "./createMonth"

export const createYear = (monthNumber, year, locale = 'default') => {
    const monthCount = 12
    const today = createDate()
    if(!year){
        year = today.year
    }
    if(!monthNumber){
        monthNumber = today.monthNumber
    }
    const month = createMonth(new Date(year, monthNumber - 1 ), locale)
    const getMonthDays = (monthIndex) => {
        return createMonth(new Date(year, monthIndex), locale).createMonthDays()
    }
    const createYearMonthes = () => {
        const monthes = []
        for(let i = 0; i <= monthCount-1; i++ ){
            monthes[i] = getMonthDays(i)
        }
        return monthes
    }
    return {
        month, year, createYearMonthes
    }

}