import { format } from 'date-fns';
import type { ProcessedEnergyData, SensorData } from '../types/energy';
import { utils, writeFile } from 'xlsx';

const API_URL = 'https://energybackend.onrender.com/api/sensordata';
let lastData: SensorData | null = null;

async function saveToJsonFile(data: Record<string, ProcessedEnergyData>, date: Date) {
  const formattedDate = format(date, 'yyyy-MM-dd');
  const fileName = `data/${formattedDate}.json`;
  
  try {
    const response = await fetch('/api/saveData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName,
        data,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save data');
    }
  } catch (error) {
    console.error('Error saving data:', error);
    // Fallback to localStorage if file saving fails
    localStorage.setItem(`energy_data_${formattedDate}`, JSON.stringify(data));
  }
}

export async function fetchEnergyData(date?: Date): Promise<ProcessedEnergyData[]> {
  const targetDate = date || new Date();
  const formattedDate = format(targetDate, 'yyyy-MM-dd');
  const isToday = formattedDate === format(new Date(), 'yyyy-MM-dd');
  
  let dailyData: Record<string, ProcessedEnergyData> = {};
  
  // Try to load existing data
  try {
    // First try to load from JSON file
    const fileResponse = await fetch(`/data/${formattedDate}.json`);
    if (fileResponse.ok) {
      dailyData = await fileResponse.json();
    } else {
      // Try alternative filename format
      const altResponse = await fetch(`/data/Mydata_${formattedDate}.json`);
      if (altResponse.ok) {
        dailyData = await altResponse.json();
      } else {
        // Try localStorage as fallback
        const storedData = localStorage.getItem(`energy_data_${formattedDate}`);
        if (storedData) {
          dailyData = JSON.parse(storedData);
        }
      }
    }
  } catch (error) {
    console.error('Error loading existing data:', error);
  }

  // If it's today, fetch new data from API and append
  if (isToday) {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const newData: SensorData = await response.json();
      lastData = newData;
      
      const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      const processedData: ProcessedEnergyData = {
        ...newData,
        timestamp,
      };

      // Add new data to existing data
      dailyData[timestamp] = processedData;
      
      // Save updated data
      await saveToJsonFile(dailyData, targetDate);
    } catch (error) {
      console.error('Error fetching new data:', error);
      // If API fails but we have lastData, use it
      if (lastData) {
        const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        dailyData[timestamp] = { ...lastData, timestamp };
      }
    }
  }

  // Return data sorted by timestamp
  return Object.values(dailyData).sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

export function getDailyData(date: Date): Record<string, ProcessedEnergyData> {
  const formattedDate = format(date, 'yyyy-MM-dd');
  const storedData = localStorage.getItem(`energy_data_${formattedDate}`);
  return storedData ? JSON.parse(storedData) : {};
}

export function exportToExcel(data: ProcessedEnergyData[], date: Date) {
  const ws = utils.json_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Energy Data');
  
  const fileName = `energy_data_${format(date, 'yyyy-MM-dd')}.xlsx`;
  writeFile(wb, fileName);
}

export function calculateStats(data: ProcessedEnergyData[]) {
  if (data.length === 0) return {
    totalEnergy: 0,
    avgPower: 0,
    avgCurrent: 0,
    powerFactor: 0
  };

  const sum = data.reduce((acc, reading) => ({
    energy: acc.energy + Number(reading.energy || 0),
    power: acc.power + Number(reading.power || 0),
    current: acc.current + Number(reading.current || 0),
    powerFactor: acc.powerFactor + Number(reading.Power_factor || 0)
  }), { energy: 0, power: 0, current: 0, powerFactor: 0 });

  return {
    totalEnergy: sum.energy / data.length,
    avgPower: sum.power / data.length,
    avgCurrent: sum.current / data.length,
    powerFactor: sum.powerFactor / data.length
  };
}