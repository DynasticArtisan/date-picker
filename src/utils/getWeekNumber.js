export const getWeekNumber = ( date = new Date() ) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDays = (date.getTime() - firstDayOfYear.getTime()) / 86400000
    return Math.ceil((pastDays + firstDayOfYear.getDay() + 1)/ 7)
}