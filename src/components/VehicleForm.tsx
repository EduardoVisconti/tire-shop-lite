import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useVehicles } from '../hooks/use-vehicles';

/* -------------------------
   Schema (regras do form)
-------------------------- */

const vehicleSchema = z.object({
	name: z.string().min(1, 'Nome é obrigatório'),
	plate: z.string().min(1, 'Placa é obrigatória'),
	status: z.enum(['active', 'maintenance', 'inactive']),
	lastServiceDate: z.string().min(1, 'Data do último serviço é obrigatória'),
	serviceIntervalDays: z.coerce
		.number()
		.int()
		.min(1, 'Intervalo deve ser maior que 0')
});

type VehicleFormInput = z.input<typeof vehicleSchema>;
type VehicleFormValues = z.output<typeof vehicleSchema>;

/* -------------------------
   Component
-------------------------- */

export function VehicleForm() {
	const { createVehicle, isCreating } = useVehicles();

	const form = useForm<VehicleFormInput, unknown, VehicleFormValues>({
		resolver: zodResolver(vehicleSchema),
		defaultValues: {
			name: '',
			plate: '',
			status: 'active',
			lastServiceDate: '',
			serviceIntervalDays: 180
		}
	});

	function onSubmit(values: VehicleFormValues) {
		// 🔹 Aqui o payload nasce
		createVehicle(values);

		// reset simples
		form.reset();
	}

	return (
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			className='space-y-4 rounded-lg border p-4'
		>
			<h3 className='font-semibold'>Adicionar veículo</h3>

			{/* Nome */}
			<div>
				<label className='block text-sm font-medium'>Nome</label>
				<input
					className='mt-1 w-full rounded border px-3 py-2'
					{...form.register('name')}
				/>
				<p className='text-sm text-red-600'>
					{form.formState.errors.name?.message}
				</p>
			</div>

			{/* Placa */}
			<div>
				<label className='block text-sm font-medium'>Placa</label>
				<input
					className='mt-1 w-full rounded border px-3 py-2'
					{...form.register('plate')}
				/>
				<p className='text-sm text-red-600'>
					{form.formState.errors.plate?.message}
				</p>
			</div>

			{/* Status */}
			<div>
				<label className='block text-sm font-medium'>Status</label>
				<select
					className='mt-1 w-full rounded border px-3 py-2'
					{...form.register('status')}
				>
					<option value='active'>Active</option>
					<option value='maintenance'>Maintenance</option>
					<option value='inactive'>Inactive</option>
				</select>
			</div>

			{/* Last service */}
			<div>
				<label className='block text-sm font-medium'>Último serviço</label>
				<input
					type='date'
					className='mt-1 w-full rounded border px-3 py-2'
					{...form.register('lastServiceDate')}
				/>
				<p className='text-sm text-red-600'>
					{form.formState.errors.lastServiceDate?.message}
				</p>
			</div>

			{/* Interval */}
			<div>
				<label className='block text-sm font-medium'>Intervalo (dias)</label>
				<input
					type='number'
					className='mt-1 w-full rounded border px-3 py-2'
					{...form.register('serviceIntervalDays', { valueAsNumber: true })}
				/>
			</div>

			<button
				type='submit'
				disabled={isCreating}
				className='rounded bg-black px-4 py-2 text-white'
			>
				{isCreating ? 'Salvando...' : 'Adicionar'}
			</button>
		</form>
	);
}
