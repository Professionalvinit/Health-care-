import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
  disabled?: (date: Date) => boolean;
}

export function Calendar({ selected, onSelect, className = '', disabled }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  
  const today = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };
  
  const selectDate = (day: number) => {
    const date = new Date(year, month, day);
    if (disabled && disabled(date)) return;
    onSelect?.(date);
  };
  
  const isSelected = (day: number) => {
    if (!selected) return false;
    const date = new Date(year, month, day);
    return date.toDateString() === selected.toDateString();
  };
  
  const isToday = (day: number) => {
    const date = new Date(year, month, day);
    return date.toDateString() === today.toDateString();
  };
  
  const isDisabled = (day: number) => {
    if (!disabled) return false;
    const date = new Date(year, month, day);
    return disabled(date);
  };
  
  // Generate calendar days
  const days = [];
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="p-2"></div>);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDisabled = isDisabled(day);
    const daySelected = isSelected(day);
    const dayToday = isToday(day);
    
    days.push(
      <button
        key={day}
        onClick={() => selectDate(day)}
        disabled={dayDisabled}
        className={`
          p-2 text-sm rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500
          ${daySelected ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
          ${dayToday && !daySelected ? 'bg-blue-100 text-blue-600' : ''}
          ${dayDisabled ? 'text-gray-400 cursor-not-allowed hover:bg-transparent' : ''}
        `}
      >
        {day}
      </button>
    );
  }
  
  return (
    <div className={`p-4 bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2 className="text-lg font-semibold">
          {monthNames[month]} {year}
        </h2>
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      
      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-xs font-medium text-gray-500 text-center">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    </div>
  );
}
