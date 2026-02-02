import type { Vehicle } from '../types/vehicle';
import { StatusBadge } from './StatusBage';

function vehicleStatusLabel(status: Vehicle['status']) {
	if (status === 'active') return 'Active';
	if (status === 'maintenance') return 'Maintenance';
	return 'Inactive';
}

export function VehicleList({ vehicles }: { vehicles: Vehicle[] }) {
	if (vehicles.length === 0) {
		return (
			<div className='rounded-xl border border-dashed bg-white p-6 text-sm text-gray-600'>
				Nenhum veículo cadastrado ainda.
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			{vehicles.map((v) => (
				<div
					key={v.id}
					className='rounded-xl border bg-white p-4 shadow-sm'
				>
					<div className='flex items-start justify-between gap-4'>
						<div className='min-w-0 space-y-1'>
							<p className='text-base font-semibold truncate'>{v.name}</p>

							<p className='text-sm text-gray-600'>
								Placa: <span className='font-medium'>{v.plate}</span> • Status:{' '}
								<span className='font-medium'>
									{vehicleStatusLabel(v.status)}
								</span>
							</p>
						</div>

						<StatusBadge vehicle={v} />
					</div>

					<div className='mt-4 grid gap-3 sm:grid-cols-3 text-sm'>
						<div className='rounded-lg border bg-gray-50 p-3'>
							<p className='text-xs text-gray-500'>Last service</p>
							<p className='font-medium'>{v.lastServiceDate}</p>
						</div>

						<div className='rounded-lg border bg-gray-50 p-3'>
							<p className='text-xs text-gray-500'>Interval (days)</p>
							<p className='font-medium'>{v.serviceIntervalDays}</p>
						</div>

						<div className='rounded-lg border bg-gray-50 p-3'>
							<p className='text-xs text-gray-500'>Next service</p>
							<p className='font-medium'>{v.nextServiceDate || '—'}</p>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
