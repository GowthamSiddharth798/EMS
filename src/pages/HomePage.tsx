import React, { useState, useEffect } from 'react';
import { Zap, Battery, Gauge, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { DateSelector } from '../components/DateSelector';
import { EnergyChart } from '../components/EnergyChart';
import { StatCard } from '../components/StatCard';
import { fetchEnergyData, calculateStats } from '../utils/energyUtils';
import type { ProcessedEnergyData } from '../types/energy';

export function HomePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [energyData, setEnergyData] = useState<ProcessedEnergyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function loadData() {
      try {
        const data = await fetchEnergyData(selectedDate);
        setEnergyData(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch energy data');
        console.error('Error:', error);
      }
    }

    loadData();

    // Only poll for current date
    if (selectedDate.toDateString() === new Date().toDateString()) {
      interval = setInterval(loadData, 60000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [selectedDate]);

  const stats = calculateStats(energyData);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading energy data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Energy Dashboard</h1>
      
      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
      
      {energyData.length === 0 ? (
        <div className="mt-8 p-4 bg-yellow-50 rounded-md">
          <p className="text-yellow-700">No data available for the selected date.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <StatCard
              title="Total Energy"
              value={`${stats.totalEnergy.toFixed(2)} kWh`}
              icon={Zap}
            />
            <StatCard
              title="Active Power"
              value={`${stats.avgPower.toFixed(2)} kW`}
              icon={Battery}
            />
            <StatCard
              title="Current"
              value={`${stats.avgCurrent.toFixed(2)} A`}
              icon={Gauge}
            />
            <StatCard
              title="Power Factor"
              value={stats.powerFactor.toFixed(3)}
              icon={Activity}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <EnergyChart
              data={energyData}
              title="Power Consumption"
              dataKey="power"
              color="#059669"
              unit="kW"
            />
            <EnergyChart
              data={energyData}
              title="Phase Powers"
              dataKey={['R_power', 'Y_power', 'B_power']}
              color={['#DC2626', '#FCD34D', '#2563EB']}
              unit="W"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <EnergyChart
              data={energyData}
              title="Phase Currents"
              dataKey={['IRcurrent', 'IYcurrent', 'IBcurrent']}
              color={['#DC2626', '#FCD34D', '#2563EB']}
              unit="A"
            />
            <EnergyChart
              data={energyData}
              title="Phase Voltages"
              dataKey={['VRvoltage', 'VYvoltage', 'VBvoltage']}
              color={['#DC2626', '#FCD34D', '#2563EB']}
              unit="V"
            />
          </div>
        </>
      )}
    </div>
  );
}