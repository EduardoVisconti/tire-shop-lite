export type ServiceType = "preventive" | "corrective";

export interface ServiceRecord { // Histórico de serviços realizados
  id: string;
  vehicleId: string;

  date: string; // yyyy-MM-dd
  type: ServiceType;
  notes?: string;
}
