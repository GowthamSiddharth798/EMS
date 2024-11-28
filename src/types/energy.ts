export interface SensorData {
  current: number;
  power: number;
  R_power: number;
  Y_power: number;
  B_power: number;
  energy: number;
  IRcurrent: number;
  IYcurrent: number;
  IBcurrent: number;
  IBLcurrent: number;
  IRLcurrent: number;
  IYLcurrent: number;
  VRvoltage: number;
  VYvoltage: number;
  VBvoltage: number;
  VRLvoltage: number;
  VYLvoltage: number;
  VBLvoltage: number;
  Active_power: number;
  Reactive_power: number;
  Power_factor: number;
  Energy_Meter: number;
  Voltage: number;
  timestamp?: string;
}

export interface ProcessedEnergyData extends SensorData {
  timestamp: string;
}