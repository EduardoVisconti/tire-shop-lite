import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Vehicle } from '../types/vehicle';
import type { ServiceRecord } from '../types/service';

import {
	listVehicles,
	createVehicle,
	addServiceToVehicle
} from '../data/vehicles';

/**
 * Query keys (padrão previsível)
 */
const VEHICLES_KEY = ['vehicles'] as const;

/**
 * Hook central:
 * - ler vehicles (query)
 * - criar vehicle (mutation)
 * - adicionar service (mutation)
 * - invalidar cache para atualizar UI
 */
export function useVehicles() {
	const queryClient = useQueryClient();

	/**
	 * READ: lista de vehicles (estado atual)
	 */
	const vehiclesQuery = useQuery<Vehicle[]>({
		queryKey: VEHICLES_KEY,
		queryFn: async () => {
			// localStorage é síncrono, mas deixamos async pra manter padrão
			return listVehicles();
		}
	});

	/**
	 * WRITE: criar vehicle (estado atual)
	 */
	const createVehicleMutation = useMutation({
		mutationFn: async (input: {
			name: string;
			plate: string;
			status: Vehicle['status'];
			lastServiceDate: string;
			serviceIntervalDays: number;
		}) => {
			return createVehicle(input);
		},
		onSuccess: async () => {
			// força atualizar a lista
			await queryClient.invalidateQueries({ queryKey: VEHICLES_KEY });
		}
	});

	/**
	 * WRITE: adicionar service (histórico) + atualizar estado atual
	 */
	const addServiceMutation = useMutation({
		mutationFn: async (input: {
			vehicleId: string;
			date: string;
			type: ServiceRecord['type'];
			notes?: string;
		}) => {
			return addServiceToVehicle(input);
		},
		onSuccess: async () => {
			// atualiza a lista (pq lastServiceDate e nextServiceDate mudaram)
			await queryClient.invalidateQueries({ queryKey: VEHICLES_KEY });
		}
	});

	return {
		// data
		vehicles: vehiclesQuery.data ?? [],
		isLoading: vehiclesQuery.isLoading,
		isError: vehiclesQuery.isError,

		// actions
		createVehicle: createVehicleMutation.mutate,
		isCreating: createVehicleMutation.isPending,

		addService: addServiceMutation.mutate,
		isAddingService: addServiceMutation.isPending
	};
}
