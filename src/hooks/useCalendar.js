import { useCallback, useMemo, useReducer, useState } from "react"
import { createMonth, getWeekDaysNames } from "../utils"


export const useCalendar = (options) => {
    const locale = 'default'
    const [date, setDate] = useState(new Date(options.date))
    const [dateFrom, setDateFrom] = useState(new Date(options.dateFrom))
    const [dateTo, setDateTo] = useState(new Date(options.dateTo))

    const [ rangeMode, toggleRangeMode ] = useReducer(prev => {
        setDate(null)
        options.date = null
        setDateFrom(null)
        options.dateFrom = null
        setDateTo(null)
        options.dateTo = null
        return !prev
    }, options.rangeMode)

    const [ selectedMonth, setSelectedMonth ] = useState(createMonth(options.date || options.dateTo || options.dateFrom, options.locale))

    const weekDaysNames = useMemo(()=> getWeekDaysNames(options.locale), [])

    const calendarDays = useMemo(()=>{
        const selectedMonthDays = selectedMonth.createMonthDays()

        const prevDaysCount = selectedMonthDays[0].dayNumberInWeek
        const prevMonthDays = prevDaysCount ? createMonth(new Date(selectedMonth.monthIndex > 0 ? selectedMonth.year : selectedMonth.year - 1, selectedMonth.monthIndex > 0 ? selectedMonth.monthIndex - 1 : 11), locale).createMonthDays().slice(-1 * prevDaysCount) : []

        const nextDaysCount = 6 - selectedMonthDays[selectedMonthDays.length - 1].dayNumberInWeek
        const nextMonthDays = nextDaysCount ? createMonth(new Date(selectedMonth.monthIndex < 11 ? selectedMonth.year : selectedMonth.year + 1, selectedMonth.monthIndex < 11 ? selectedMonth.monthIndex + 1 : 0), locale).createMonthDays().slice(0, nextDaysCount) : []


        return [ ...prevMonthDays, ...selectedMonthDays, ...nextMonthDays ]
    },[selectedMonth])

    const prevMonth = useCallback(()=>{
        setSelectedMonth(current => {
            if(current.monthIndex > 0){
                return createMonth(new Date(current.year, current.monthIndex - 1), locale)
            }
            return createMonth(new Date(current.year - 1, 11), locale)  
        })
    }, [locale])

    const nextMonth = useCallback(()=>{
        setSelectedMonth(current => {
            if(current.monthIndex < 11){
                return createMonth(new Date(current.year, current.monthIndex + 1), locale)
            }
            return createMonth(new Date(current.year + 1, 0), locale)  
        })
    }, [locale])

    const selectDay = (day)=>{
        if(!rangeMode){
            options.setDate(day.date)
            return setDate(day)
        }
        if(!dateFrom){
            options.setDateFrom(day.date)
            return setDateFrom(day)
        }
        if(!dateTo){
            if(dateFrom.timestamp > day.timestamp){
                options.setDateTo(dateFrom.date)
                setDateTo(dateFrom)
                options.setDateFrom(day.date)
                return setDateFrom(day)
            }
            options.setDateTo(day.date)
            return setDateTo(day)
        }
        options.setDateFrom(day.date)
        setDateFrom(day)
    }

    return {
        state: {
            weekDaysNames, calendarDays, selectedMonth, date, dateFrom, dateTo, rangeMode
        },
        actions: {
            nextMonth, prevMonth, toggleRangeMode, selectDay
        }
    }
    
}