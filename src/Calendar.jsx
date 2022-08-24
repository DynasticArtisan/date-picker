import { useCallback, useState } from "react";
import { useCalendar } from "./hooks/useCalendar";

function compareDays(day1, day2) {
  return day1.dayNumber === day2.dayNumber && day1.monthNumber === day2.monthNumber && day1.year === day2.year
}
function checkInRange(day1, day2, day3){
  if(day1.timestamp < day2.timestamp){
    return day3.timestamp < day2.timestamp && day3.timestamp > day1.timestamp
  }
  return day3.timestamp > day2.timestamp && day3.timestamp < day1.timestamp
}

function Calendar(options) {
  const { state, actions } = useCalendar(options)
  const [open, setOpen] = useState(false)
  const [hoverOn, setHoverOn] = useState(null)
  
  const openCalendar = useCallback((e)=>{
    e.stopPropagation()
    setOpen(true)
    window.addEventListener('click', closeCalendar)
  },[])
  const closeCalendar = useCallback((e)=>{
    e.stopPropagation()
    if(e.target.closest('.calendar__wrapper')){
      return null
    }
    setOpen(false)
    window.removeEventListener('click', closeCalendar)
  },[])


  return (
    <div className="calendar">
      <div className="calendar__output" onClick={openCalendar}>{state.date?.date?.toLocaleString(options.locale, { day: '2-digit', month: '2-digit', year: 'numeric' })}{ (state.rangeMode && state.date) ? " - " : '' }{state.selectedSecondDay?.date.toLocaleString(options.locale, { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
      <div className={`calendar__wrapper ${open ? '--open':''}`}>
        <div className="calendar__monthes">
          <button className="calendar__prevMonth" type="button" onClick={actions.prevMonth}>&lt;</button>
          <div className="calendar__currentMonth">{state.selectedMonth.monthName} {state.selectedMonth.year}</div>
          <button className="calendar__nextMonth" type="button" onClick={actions.nextMonth}>&gt;</button>
        </div>
        <div className="calendar__days">
          { state.weekDaysNames.map(day => <div className="calendar__day" key={day.dayNumberInWeek}>{day.dayShort}</div>) }
        </div>
        <div className="calendar__dates" onMouseLeave={()=>setHoverOn(null)}>
          { state.calendarDays.map((day, i) => <div className={`calendar__date ${state.date && compareDays(day, state.date) || state.selectedSecondDay && compareDays(day, state.selectedSecondDay) ? 'selected':''} ${state.date && state.selectedSecondDay && checkInRange(state.date, state.selectedSecondDay, day) ? '--in-range':''} ${hoverOn && checkInRange(state.date, hoverOn, day) ? '--hovered' :''}`} key={i} onClick={()=> actions.selectDay(day)} onMouseEnter={ (state.rangeMode && state.date && !state.selectedSecondDay) ? (()=>setHoverOn(day)) : null }> {day.dayNumber}</div> ) }
        </div>
        <div className={`calendar__range-mode ${state.rangeMode ? '--selected':''}`} onClick={actions.toggleRangeMode}>Выбрать период</div>
      </div>
      {
        state.rangeMode ? (
          <>
            <input name="date_from" type="text" value={state.date?.timestamp} hidden/>
            <input name="date-to" type="text" value={state.selectedSecondDay?.timestamp} hidden/>
          </>
        )
          : (
              <input name="date" type="text" value={state.date?.timestamp} hidden/>
          )
         
      }
      <input name="rangeMode" type="checkbox" checked={state.rangeMode} hidden/>
    </div>
  );
}

export default Calendar;
