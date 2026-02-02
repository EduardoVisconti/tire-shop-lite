import { useVehicles } from '../hooks/use-vehicles';
import { VehicleList } from '../components/VehicleList';
import { VehicleForm } from '../components/VehicleForm';
import { ServiceForm } from '../components/ServiceForm';

export default function Home() {
	const { vehicles, isLoading, isError } = useVehicles();

	return (
		<main className='mx-auto max-w-3xl p-6 space-y-6'>
			<header className='space-y-1'>
				<h1 className='text-2xl font-bold'>Borracharia — Tracker</h1>
				<p className='text-sm text-gray-600'>
					Estado atual (vehicles) + histórico (services) com datas de
					manutenção.
				</p>
			</header>

			<section className='space-y-4'>
				<div className='rounded-lg border p-4 space-y-3'>
					<h2 className='text-lg font-semibold'>Cadastrar veículo</h2>
					<VehicleForm />
				</div>

				<div className='rounded-lg border p-4 space-y-3'>
					<h2 className='text-lg font-semibold'>
						Registrar serviço (histórico)
					</h2>
					<ServiceForm />
				</div>

				<div className='rounded-lg border p-4 space-y-3'>
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
			</section>
		</main>
	);
}
