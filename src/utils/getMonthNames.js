import { createDate } from "./createDate"

export const getMonthNames = ( locale = 'default' ) => {

    const d = new Date()

    const monthesNames = Array.from({ length: 12 }).map((_, i) => {
        const { month, monthIndex, monthShort, date } = createDate(new Date( d.getFullYear(), i, d.getDate() ), locale)
        return { month, monthIndex, monthShort, date }
    })

    return monthesNames
}