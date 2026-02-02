import type { Vehicle } from '../types/vehicle';
import { getDueState } from '../utils/dates';

/**
 * Badge simples para mostrar o estado de manutenção baseado em nextServiceDate:
 * - overdue
 * - due_soon
 * - ok
 * - unknown
 */
export function StatusBadge({ vehicle }: { vehicle: Vehicle }) {
	const due = getDueState(vehicle.nextServiceDate);

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

	// opcional: mostrar quantos dias faltam/atrasou
	const suffix =
		typeof due.daysDelta === 'number'
			? due.daysDelta < 0
				? ` (${Math.abs(due.daysDelta)}d late)`
				: ` (${due.daysDelta}d)`
			: '';

	return (
		<span
			className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${map[due.state]}`}
			title='Status baseado no nextServiceDate'
		>
			{label[due.state]}
			{suffix}
		</span>
	);
}
