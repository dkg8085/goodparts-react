import React, { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarComponent = ({ onDateChange }) => {

  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-CA"); 
  };

  useEffect(() => {
    if (onDateChange) {
      onDateChange(formatDate(date)); 
    }
  }, []);

  //Outside click close logic added
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setShowCalendar(false); 

    if (onDateChange) {
      onDateChange(formatDate(selectedDate)); 
    }
  };  

  return (
    <div className="calendar-container" ref={calendarRef}>
      <input
        type="text"
        value={date.toLocaleDateString("en-US", { 
          month: "long", 
          day: "numeric", 
          year: "numeric" 
        })}
        readOnly
        onClick={() => setShowCalendar(!showCalendar)}
        className="calendar-input"
      />

      {showCalendar && (
        <div className="calendar-popup">
          <Calendar
            onChange={handleDateChange}
            value={date}
            formatShortWeekday={(locale, date) =>
              date
                .toLocaleDateString(locale, { weekday: "short" })
                .substring(0, 2)
            }
            next2Label={null} 
            prev2Label={null} 
          />
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;