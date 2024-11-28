import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { ProcessedEnergyData } from '../types/energy';

interface EnergyChartProps {
  data: ProcessedEnergyData[];
  title: string;
  dataKey: string | string[];
  color: string | string[];
  unit: string;
}

export function EnergyChart({ data, title, dataKey, color, unit }: EnergyChartProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Array.isArray(dataKey) ? (
              dataKey.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={Array.isArray(color) ? color[index] : color}
                  activeDot={{ r: 8 }}
                  name={`${key} (${unit})`}
                />
              ))
            ) : (
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={Array.isArray(color) ? color[0] : color}
                activeDot={{ r: 8 }}
                name={`${title} (${unit})`}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}