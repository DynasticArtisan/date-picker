import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Component from './Calendar';




class Calendar {
  constructor(node, { date, dateFrom, dateTo, locale, format, rangeMode }={}) {
      this.date = date ? new Date(date) : null;
      this.dateFrom = date ? new Date(dateFrom) : null;
      this.dateTo = date ? new Date(dateTo) : null;
      this.rangeMode = Boolean(rangeMode)
      this.locale = locale || 'deafult'
      this.format = format || { day: '2-digit', month: '2-digit', year: 'numeric' }
      if(node){
        const setDate = function(date){ this.date = date }.bind(this)
        const setDateFrom = function(date){ this.dateFrom = date }.bind(this)
        const setDateTo = function(date){ this.dateTo = date }.bind(this)
        const setRangeMode = function(bool){ this.rangeMode = bool }.bind(this)
        ReactDOM.createRoot(node).render(
          <React.StrictMode>
            <Component {...this} setDate={setDate} setDateFrom={setDateFrom} setDateTo={setDateTo} setRangeMode={setRangeMode}/>
          </React.StrictMode>
        )

      }
  }

}
window.cal = new Calendar(document.querySelector('.date-field'))
window.Calendar = Calendar