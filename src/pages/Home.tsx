import { useVehicles } from '../hooks/use-vehicles';
import { VehicleList } from '../components/VehicleList';

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

			<section className='space-y-3'>
				<h2 className='text-lg font-semibold'>Veículos</h2>

				{isLoading ? (
					<p className='text-sm text-gray-600'>Carregando...</p>
				) : isError ? (
					<p className='text-sm text-red-600'>Erro ao carregar veículos.</p>
				) : (
					<VehicleList vehicles={vehicles} />
				)}
			</section>
		</main>
	);
}
