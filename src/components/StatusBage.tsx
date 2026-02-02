import type { Vehicle } from '../types/vehicle';
import { getMaintenanceState } from '../utils/dates';

/**
 * Badge simples para mostrar o estado de manutenção baseado em nextServiceDate:
 * - overdue
 * - due_soon
 * - ok
 */
export function StatusBadge({ vehicle }: { vehicle: Vehicle }) {
	const state = getMaintenanceState(vehicle.nextServiceDate);

	const map = {
		overdue: 'bg-red-100 text-red-700 border-red-200',
		due_soon: 'bg-yellow-100 text-yellow-800 border-yellow-200',
		ok: 'bg-green-100 text-green-700 border-green-200'
	} as const;

	const label = {
		overdue: 'Overdue',
		due_soon: 'Due soon',
		ok: 'OK'
	} as const;

	return (
		<span
			className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${map[state]}`}
		>
			{label[state]}
		</span>
	);
}
