import { createDate } from "./createDate"

export const getWeekDaysNames = (locale = 'default') => {
    const d = new Date()
    const weekDaysNames = Array.from({ length: 7 }).map((_,i)=> {
        const { day, dayNumberInWeek, dayShort } = createDate( new Date(d.getFullYear(), d.getMonth(), i + 1 ), locale )
        return { day, dayNumberInWeek, dayShort }
    })
    return weekDaysNames
}