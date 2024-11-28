import React, { useState } from 'react';
import { format } from 'date-fns';
import { FileText } from 'lucide-react';
import { exportToExcel } from '../utils/energyUtils';
import type { ProcessedEnergyData } from '../types/energy';

export function ReportsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleExport = () => {
    const storedData = localStorage.getItem(`energy_data_${format(selectedDate, 'yyyy-MM-dd')}`);
    if (storedData) {
      const data: Record<string, ProcessedEnergyData> = JSON.parse(storedData);
      exportToExcel(Object.values(data), selectedDate);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-6">
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          />
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FileText className="w-4 h-4 mr-2" />
            Export to Excel
          </button>
        </div>
      </div>
    </div>
  );
}