import React from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
      <Calendar className="h-5 w-5 text-gray-500" />
      <input
        type="date"
        value={format(selectedDate, 'yyyy-MM-dd')}
        onChange={(e) => onDateChange(new Date(e.target.value))}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
      />
      <span className="text-sm text-gray-500">
        Viewing data for: {format(selectedDate, 'dd MMMM yyyy')}
      </span>
    </div>
  );
}