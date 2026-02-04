import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Vehicle } from '../types/vehicle';
import type { ServiceRecord } from '../types/service';

import {
	listVehicles,
	createVehicle,
	addServiceToVehicle,
	resetDemoData
} from '../data/vehicles';

/**
 * Query keys
 */
const VEHICLES_KEY = ['vehicles'] as const;

export function useVehicles() {
	const queryClient = useQueryClient();

	/**
	 * READ: vehicles (estado atual)
	 */
	const vehiclesQuery = useQuery<Vehicle[]>({
		queryKey: VEHICLES_KEY,
		queryFn: async () => listVehicles()
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
		}) => createVehicle(input),
		onSuccess: async () => {
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
		}) => addServiceToVehicle(input),
		onSuccess: async (_data, variables) => {
			// atualiza lista de vehicles (estado atual)
			await queryClient.invalidateQueries({ queryKey: VEHICLES_KEY });

			// atualiza o histórico do veículo selecionado (se estiver aberto)
			await queryClient.invalidateQueries({
				queryKey: ['services', variables.vehicleId]
			});
		}
	});

	/**
	 * WRITE: reset demo data
	 */
	const resetMutation = useMutation({
		mutationFn: async () => {
			resetDemoData();
		},
		onSuccess: async () => {
			// invalida tudo que depende do storage
			await queryClient.invalidateQueries({ queryKey: VEHICLES_KEY });
			await queryClient.invalidateQueries({ queryKey: ['services'] });
		}
	});

	return {
		vehicles: vehiclesQuery.data ?? [],
		isLoading: vehiclesQuery.isLoading,
		isError: vehiclesQuery.isError,

		createVehicle: createVehicleMutation.mutate,
		isCreating: createVehicleMutation.isPending,

		addService: addServiceMutation.mutate,
		isAddingService: addServiceMutation.isPending,

		resetDemo: resetMutation.mutate,
		isResetting: resetMutation.isPending
	};
}
