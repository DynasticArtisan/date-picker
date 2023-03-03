import { useCallback, useMemo, useReducer, useState } from "react"
import { createMonth, getWeekDaysNames } from "../utils"


function isEqualDate(date1, date2){
    return (
        date1?.dayNumber === date2?.dayNumber &&
        date1?.monthNumber === date2?.monthNumber &&
        date1?.year === date2?.year
      );
}

export const useCalendar = (options) => {
    const [hoverDate, hoverOnDate] = useState(null)
    const [date, setDate] = useReducer(( _ , date)=>{
        options.setDate(date)
        return date
    }, new Date(options.date))
    const [dateFrom, setDateFrom] = useReducer(( _ , date)=>{
        options.setDateFrom(date)
        return date
    }, new Date(options.dateFrom))
    const [dateTo, setDateTo] = useReducer(( _ , date)=>{
        options.setDateTo(date)
        return date
    }, new Date(options.dateTo))
    const clearFields = useCallback(()=>{
        setDate(null)
        setDateFrom(null)
        setDateTo(null)
    },[])
    const [ rangeMode, toggleRangeMode ] = useReducer(prev => {
        clearFields()
        options.setRangeMode(!prev)
        return !prev
    }, options.rangeMode)
    const [ selectedMonth, setSelectedMonth ] = useState(createMonth(options.date || options.dateTo || options.dateFrom, options.locale))

    const weekDaysNames = useMemo(()=> getWeekDaysNames(options.locale), [])
    const calendarDays = useMemo(()=>{
        const selectedMonthDays = selectedMonth.createMonthDays()

        const prevDaysCount = selectedMonthDays[0].dayNumberInWeek
        const prevMonthDays = prevDaysCount ? createMonth(new Date(selectedMonth.monthIndex > 0 ? selectedMonth.year : selectedMonth.year - 1, selectedMonth.monthIndex > 0 ? selectedMonth.monthIndex - 1 : 11), options.locale).createMonthDays().slice(-1 * prevDaysCount) : []

        const nextDaysCount = 6 - selectedMonthDays[selectedMonthDays.length - 1].dayNumberInWeek
        const nextMonthDays = nextDaysCount ? createMonth(new Date(selectedMonth.monthIndex < 11 ? selectedMonth.year : selectedMonth.year + 1, selectedMonth.monthIndex < 11 ? selectedMonth.monthIndex + 1 : 0), options.locale).createMonthDays().slice(0, nextDaysCount) : []


        return [ ...prevMonthDays.map(d => ({ ...d, notCurMonth: true})), ...selectedMonthDays, ...nextMonthDays.map(d => ({ ...d, notCurMonth: true})) ]
    },[selectedMonth])

    const prevMonth = useCallback(()=>{
        setSelectedMonth(current => {
            if(current.monthIndex > 0){
                return createMonth(new Date(current.year, current.monthIndex - 1), options.locale)
            }
            return createMonth(new Date(current.year - 1, 11), options.locale)  
        })
    }, [])
    const nextMonth = useCallback(()=>{
        setSelectedMonth(current => {
            if(current.monthIndex < 11){
                return createMonth(new Date(current.year, current.monthIndex + 1), options.locale)
            }
            return createMonth(new Date(current.year + 1, 0), options.locale)  
        })
    }, [])
    const selectDay = (day)=>{
        if(!rangeMode){
            return setDate(day)
        }
        if(!dateFrom){
            return setDateFrom(day)
        }
        if(!dateTo){
            if(dateFrom.timestamp > day.timestamp){
                setDateTo(dateFrom)
                return setDateFrom(day)
            }
            return setDateTo(day)
        }
        setDateTo(null)
        return setDateFrom(day)
    }


    const isSelected = useCallback((day) => {
        return (
            isEqualDate(day, date) || isEqualDate(day, dateFrom) || isEqualDate(day, dateTo)
          );
    }, [date, dateFrom, dateTo])
    const isInRange = useCallback((day)=>{
        if(!dateFrom || !dateTo){
            return false
        }
        return day.timestamp > dateFrom.timestamp && day.timestamp < dateTo.timestamp
    }, [dateFrom, dateTo])
    const isInHoverRange = useCallback((day)=>{
        if(!dateFrom || !hoverDate || dateTo){
            return false
        }
        if(hoverDate.timestamp > dateFrom.timestamp){
            return day.timestamp > dateFrom.timestamp && day.timestamp < hoverDate.timestamp
        }
        return day.timestamp < dateFrom.timestamp && day.timestamp > hoverDate.timestamp
    }, [dateFrom, hoverDate])

    return {
        state: {
            weekDaysNames, calendarDays, selectedMonth, date, dateFrom, dateTo, rangeMode
        },
        actions: {
            nextMonth, prevMonth, toggleRangeMode, selectDay, hoverOnDate, clearFields
        },
        helpers: {
            isSelected, isInRange, isInHoverRange
        }
    }
    
}