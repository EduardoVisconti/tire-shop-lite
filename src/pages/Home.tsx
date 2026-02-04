import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useVehicles } from '../hooks/use-vehicles';
import { VehicleList } from '../components/VehicleList';
import { VehicleForm } from '../components/VehicleForm';
import { ServiceForm } from '../components/ServiceForm';

import { listServices } from '../data/vehicles';
import type { ServiceRecord } from '../types/service';

function serviceTypeLabel(type: ServiceRecord['type']) {
	return type === 'preventive' ? 'Preventive' : 'Corrective';
}

export default function Home() {
	const { vehicles, isLoading, isError, resetDemo, isResetting } =
		useVehicles();

	// veículo selecionado para ver histórico
	const [selectedVehicleId, setSelectedVehicleId] = useState('');

	const selectedVehicle = useMemo(() => {
		return vehicles.find((v) => v.id === selectedVehicleId) ?? null;
	}, [vehicles, selectedVehicleId]);

	/**
	 * READ do histórico (services) do veículo selecionado
	 */
	const servicesQuery = useQuery<ServiceRecord[]>({
		queryKey: ['services', selectedVehicleId],
		queryFn: async () => listServices(selectedVehicleId),
		enabled: Boolean(selectedVehicleId)
	});

	const services = servicesQuery.data ?? [];

	return (
		<main className='min-h-screen bg-gray-50'>
			<div className='mx-auto max-w-5xl p-6 space-y-6'>
				<header className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
					<div className='space-y-1'>
						<h1 className='text-2xl font-bold'>Borracharia — Tracker</h1>
						<p className='text-sm text-gray-600'>
							Estado atual (vehicles) + histórico (services) com datas de
							manutenção.
						</p>
					</div>

					<button
						onClick={() => {
							setSelectedVehicleId('');
							resetDemo();
						}}
						disabled={isResetting}
						className='rounded-md border bg-white px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-60'
						title='Limpa os dados do localStorage'
					>
						{isResetting ? 'Resetando...' : 'Reset demo data'}
					</button>
				</header>

				<section className='grid gap-6 lg:grid-cols-2'>
					<div className='rounded-lg border bg-white p-5 space-y-3'>
						<h2 className='text-lg font-semibold'>Cadastrar veículo</h2>
						<VehicleForm />
					</div>

					<div className='rounded-lg border bg-white p-5 space-y-3'>
						<h2 className='text-lg font-semibold'>
							Registrar serviço (histórico)
						</h2>
						<ServiceForm />
					</div>
				</section>

				<section className='grid gap-6 lg:grid-cols-2'>
					<div className='rounded-lg border bg-white p-5 space-y-3'>
						<div className='flex items-center justify-between'>
							<h2 className='text-lg font-semibold'>Lista de veículos</h2>
							<p className='text-xs text-gray-500'>{vehicles.length} total</p>
						</div>

						{isLoading ? (
							<p className='text-sm text-gray-600'>Carregando...</p>
						) : isError ? (
							<p className='text-sm text-red-600'>Erro ao carregar veículos.</p>
						) : (
							<VehicleList vehicles={vehicles} />
						)}
					</div>

					<div className='rounded-lg border bg-white p-5 space-y-3'>
						<h2 className='text-lg font-semibold'>Histórico de serviços</h2>

						<div className='grid gap-2'>
							<label className='text-sm font-medium'>Escolha um veículo</label>

							<select
								className='w-full rounded border px-3 py-2 bg-white'
								value={selectedVehicleId}
								onChange={(e) => setSelectedVehicleId(e.target.value)}
								disabled={vehicles.length === 0}
							>
								<option value=''>Selecione...</option>
								{vehicles.map((v) => (
									<option
										key={v.id}
										value={v.id}
									>
										{v.name} ({v.plate})
									</option>
								))}
							</select>

							{vehicles.length === 0 && (
								<p className='text-xs text-gray-500'>
									Crie um veículo para visualizar histórico.
								</p>
							)}
						</div>

						{!selectedVehicle ? (
							<p className='text-sm text-gray-600'>
								Selecione um veículo para ver o histórico.
							</p>
						) : servicesQuery.isLoading ? (
							<p className='text-sm text-gray-600'>Carregando histórico...</p>
						) : servicesQuery.isError ? (
							<p className='text-sm text-red-600'>
								Erro ao carregar histórico desse veículo.
							</p>
						) : services.length === 0 ? (
							<div className='rounded-lg border border-dashed p-6 text-sm text-gray-600'>
								Nenhum serviço registrado para <b>{selectedVehicle.name}</b>.
							</div>
						) : (
							<div className='space-y-2'>
								{services.map((s) => (
									<div
										key={s.id}
										className='rounded-md border p-3'
									>
										<div className='flex items-center justify-between gap-3'>
											<p className='font-medium'>{s.date}</p>
											<p className='text-xs text-gray-600'>
												{serviceTypeLabel(s.type)}
											</p>
										</div>
										<p className='text-sm text-gray-700 mt-1'>
											{s.notes?.trim() ? s.notes : '—'}
										</p>
									</div>
								))}
							</div>
						)}
					</div>
				</section>
			</div>
		</main>
	);
}
