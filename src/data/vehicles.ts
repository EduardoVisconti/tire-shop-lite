import type { Vehicle } from '../types/vehicle';
import type { ServiceRecord } from '../types/service';
import { computeNextServiceDate } from '../utils/dates';

/**
 * Nosso "backend" do mini-projeto:
 * - vehicles ficam salvos no localStorage
 * - services (histórico) ficam salvos no localStorage
 *
 * Importante:
 * - Vehicle = estado atual (resumo de hoje)
 * - ServiceRecord = histórico (log que cresce)
 */

const VEHICLES_KEY = 'tire-shop.vehicles.v1';
const SERVICES_KEY = 'tire-shop.services.v1';

/* -----------------------------
   Helpers de JSON seguro
------------------------------ */

function safeJsonParse<T>(raw: string | null, fallback: T): T {
	if (!raw) return fallback;
	try {
		return JSON.parse(raw) as T;
	} catch {
		return fallback;
	}
}

/* -----------------------------
   Read / Write: Vehicles
------------------------------ */

export function listVehicles(): Vehicle[] {
	const raw = localStorage.getItem(VEHICLES_KEY);
	return safeJsonParse<Vehicle[]>(raw, []);
}

export function saveVehicles(vehicles: Vehicle[]): void {
	localStorage.setItem(VEHICLES_KEY, JSON.stringify(vehicles));
}

/* -----------------------------
   Read / Write: Services (histórico)
------------------------------ */

export function listServices(): ServiceRecord[] {
	const raw = localStorage.getItem(SERVICES_KEY);
	return safeJsonParse<ServiceRecord[]>(raw, []);
}

export function saveServices(services: ServiceRecord[]): void {
	localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
}

/* -----------------------------
   Mutations (ações de negócio)
   - aqui é onde a lógica “de verdade” começa a aparecer
------------------------------ */

/**
 * Cria um veículo (estado atual).
 * - nextServiceDate é derivado (não depende do usuário digitar)
 */
export function createVehicle(input: {
	name: string;
	plate: string;
	status: Vehicle['status'];
	lastServiceDate: string; // yyyy-MM-dd
	serviceIntervalDays: number;
}): Vehicle {
	const vehicles = listVehicles();

	// id simples pro mini-projeto
	const id = crypto.randomUUID();

	const nextServiceDate = computeNextServiceDate(
		input.lastServiceDate,
		input.serviceIntervalDays
	);

	const vehicle: Vehicle = {
		id,
		name: input.name.trim(),
		plate: input.plate.trim().toUpperCase(),
		status: input.status,
		lastServiceDate: input.lastServiceDate,
		serviceIntervalDays: input.serviceIntervalDays,
		nextServiceDate
	};

	saveVehicles([vehicle, ...vehicles]);

	return vehicle;
}

/**
 * Adiciona um service record (histórico) e atualiza o estado atual do vehicle.
 *
 * Fluxo (igual AssetOps):
 * 1) cria ServiceRecord (histórico)
 * 2) atualiza Vehicle (estado atual):
 *    - lastServiceDate
 *    - nextServiceDate (recalcula)
 * 3) salva tudo
 */
export function addServiceToVehicle(input: {
	vehicleId: string;
	date: string; // yyyy-MM-dd
	type: ServiceRecord['type'];
	notes?: string;
}): { updatedVehicle: Vehicle } {
	const vehicles = listVehicles();
	const services = listServices();

	const existingVehicle = vehicles.find((v) => v.id === input.vehicleId);
	if (!existingVehicle) {
		throw new Error('VEHICLE_NOT_FOUND');
	}

	// 1) cria record (histórico)
	const service: ServiceRecord = {
		id: crypto.randomUUID(),
		vehicleId: input.vehicleId,
		date: input.date,
		type: input.type,
		notes: input.notes?.trim() || undefined
	};

	// 2) atualiza vehicle (estado atual)
	const updatedVehicle: Vehicle = {
		...existingVehicle,
		lastServiceDate: input.date,
		nextServiceDate: computeNextServiceDate(
			input.date,
			existingVehicle.serviceIntervalDays
		)
	};

	// 3) salva
	const nextVehicles = vehicles.map((v) =>
		v.id === updatedVehicle.id ? updatedVehicle : v
	);

	saveServices([service, ...services]);
	saveVehicles(nextVehicles);

	return { updatedVehicle };
}
