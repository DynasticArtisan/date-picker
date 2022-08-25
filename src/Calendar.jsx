import { useCallback, useState } from "react";
import { useCalendar } from "./hooks/useCalendar";

function Calendar(options) {
  const { state, actions, helpers } = useCalendar(options);
  const [open, setOpen] = useState(false);

  const closeCalendar = useCallback((e) => {
    e.stopPropagation();
    if (e.target.closest(".calendar__wrapper")) {
      return null;
    }
    setOpen(false);
    window.removeEventListener("click", closeCalendar);
  }, []);
  const openCalendar = useCallback((e) => {
    e.stopPropagation();
    setOpen(true);
    window.addEventListener("click", closeCalendar);
  }, []);

  return (
    <div className="calendar">
      <div className="calendar__output" onClick={openCalendar}>
        {!state.rangeMode &&
          state.date &&
          state.date.date?.toLocaleString(options.locale, options.format)}
        {state.rangeMode &&
          state.dateFrom &&
          state.dateFrom.date?.toLocaleString(options.locale, options.format) +
            " - "}
        {state.rangeMode &&
          state.dateTo &&
          state.dateTo.date?.toLocaleString(options.locale, options.format)}
      </div>
      <div className={`calendar__wrapper ${open ? "--open" : ""}`}>
        <div className="calendar__monthes">
          <button
            className="calendar__prevMonth"
            type="button"
            onClick={actions.prevMonth}
          >
            &lt;
          </button>
          <div className="calendar__currentMonth">
            {state.selectedMonth.monthName} {state.selectedMonth.year}
          </div>
          <button
            className="calendar__nextMonth"
            type="button"
            onClick={actions.nextMonth}
          >
            &gt;
          </button>
        </div>
        <div className="calendar__days">
          {state.weekDaysNames.map((day) => (
            <div className="calendar__day" key={day.dayNumberInWeek}>
              {day.dayShort}
            </div>
          ))}
        </div>
        <div
          className="calendar__dates"
          onMouseLeave={() => actions.hoverOnDate(null)}
        >
          {state.calendarDays.map((day, i) => (
            <div
              className={`calendar__date ${
                helpers.isSelected(day) ? "selected" : ""
              } 
              ${helpers.isInRange(day) ? "--in-range" : ""} 
              ${helpers.isInHoverRange(day) ? "--hovered" : ""}`}
              key={i}
              onClick={() => actions.selectDay(day)}
              onMouseEnter={() => actions.hoverOnDate(day)}
            >
              {day.dayNumber}
            </div>
          ))}
        </div>
        <div
          className={`calendar__range-mode ${
            state.rangeMode ? "--selected" : ""
          }`}
          onClick={actions.toggleRangeMode}
        >
          Выбрать период
        </div>
      </div>
      {state.rangeMode ? (
        <>
          <input
            name="dateFrom"
            type="text"
            value={state.date?.timestamp || ""}
            hidden
          />
          <input
            name="dateTo"
            type="text"
            value={state.selectedSecondDay?.timestamp || ""}
            hidden
          />
        </>
      ) : (
        <input
          name="date"
          type="text"
          value={state.date?.timestamp || ""}
          hidden
        />
      )}
      <input
        name="rangeMode"
        type="checkbox"
        checked={state.rangeMode || false}
        hidden
      />
    </div>
  );
}

export default Calendar;
