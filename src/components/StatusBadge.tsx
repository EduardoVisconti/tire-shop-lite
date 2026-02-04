import type { Vehicle } from '../types/vehicle';
import { formatDaysDeltaLabel, getDueState } from '../utils/dates';

/**
 * Badge simples para mostrar o estado de manutenção baseado em nextServiceDate:
 * - overdue
 * - due_soon
 * - ok
 * - unknown
 *
 * Agora também mostra os dias (ex: "Overdue • 3d late")
 */
export function StatusBadge({ vehicle }: { vehicle: Vehicle }) {
	const { state, daysDelta } = getDueState(vehicle.nextServiceDate);

	const map = {
		overdue: 'bg-red-100 text-red-700 border-red-200',
		due_soon: 'bg-yellow-100 text-yellow-800 border-yellow-200',
		ok: 'bg-green-100 text-green-700 border-green-200',
		unknown: 'bg-gray-100 text-gray-700 border-gray-200'
	} as const;

	const label = {
		overdue: 'Overdue',
		due_soon: 'Due soon',
		ok: 'OK',
		unknown: 'Unknown'
	} as const;

	const deltaLabel = formatDaysDeltaLabel(state, daysDelta);

	return (
		<span
			className={`inline-flex items-center gap-2 rounded-md border px-2 py-0.5 text-xs font-medium ${map[state]}`}
			title={
				vehicle.nextServiceDate
					? `Next: ${vehicle.nextServiceDate}`
					: 'Sem data'
			}
		>
			{label[state]}
			{deltaLabel ? <span className='opacity-80'>• {deltaLabel}</span> : null}
		</span>
	);
}
