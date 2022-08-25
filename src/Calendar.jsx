import { useCallback, useEffect, useRef, useState } from "react";
import { useCalendar } from "./hooks/useCalendar";

function Calendar(options) {
  const cal = useRef();
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

  useEffect(() => {
    const form = cal.current.closest("form");
    if (form) {
      form.addEventListener("reset", actions.clearFields);
      return () => {
        form.removeEventListener("reset", actions.clearFields);
      };
    }
  }, []);

  return (
    <div className="calendar" ref={cal}>
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
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.8536 7.35355C15.0488 7.15829 15.0488 6.84171 14.8536 6.64645C14.6583 6.45118 14.3417 6.45118 14.1464 6.64645L14.8536 7.35355ZM9.5 12L9.14645 11.6464C8.95118 11.8417 8.95118 12.1583 9.14645 12.3536L9.5 12ZM14.1464 17.3536C14.3417 17.5488 14.6583 17.5488 14.8536 17.3536C15.0488 17.1583 15.0488 16.8417 14.8536 16.6464L14.1464 17.3536ZM14.1464 6.64645L9.14645 11.6464L9.85355 12.3536L14.8536 7.35355L14.1464 6.64645ZM9.14645 12.3536L14.1464 17.3536L14.8536 16.6464L9.85355 11.6464L9.14645 12.3536Z"
                fill="#3288EE"
              />
            </svg>
          </button>
          <div className="calendar__currentMonth">
            {state.selectedMonth.monthName} {state.selectedMonth.year}
          </div>
          <button
            className="calendar__nextMonth"
            type="button"
            onClick={actions.nextMonth}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.14645 16.6464C8.95118 16.8417 8.95118 17.1583 9.14645 17.3536C9.34171 17.5488 9.65829 17.5488 9.85355 17.3536L9.14645 16.6464ZM14.5 12L14.8536 12.3536C15.0488 12.1583 15.0488 11.8417 14.8536 11.6464L14.5 12ZM9.85355 6.64645C9.65829 6.45118 9.34171 6.45118 9.14645 6.64645C8.95118 6.84171 8.95118 7.15829 9.14645 7.35355L9.85355 6.64645ZM9.85355 17.3536L14.8536 12.3536L14.1464 11.6464L9.14645 16.6464L9.85355 17.3536ZM14.8536 11.6464L9.85355 6.64645L9.14645 7.35355L14.1464 12.3536L14.8536 11.6464Z"
                fill="#3288EE"
              />
            </svg>
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
            value={state.dateFrom?.timestamp || ""}
            hidden
          />
          <input
            name="dateTo"
            type="text"
            value={state.dateTo?.timestamp || ""}
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
