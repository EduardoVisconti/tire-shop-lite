export type VehicleStatus = "active" | "maintenance" | "inactive";

export interface Vehicle {
  id: string;

  // Identidade
  name: string; // Ex: "Civic 2018"
  plate: string; // Ex: "ABC-1234"

  // Estado atual (operacional)
  status: VehicleStatus;

  // Datas (sempre string yyyy-MM-dd)
  lastServiceDate: string;
  serviceIntervalDays: number; // Ex: 180

  // Derivado: lastServiceDate + serviceIntervalDays
  // (a gente não salva no storage como "fonte da verdade" — calcula sempre)
  nextServiceDate: string;
}
