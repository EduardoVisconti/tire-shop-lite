import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';

import { useVehicles } from '../hooks/use-vehicles';
import type { ServiceRecord } from '../types/service';

/* -------------------------
   Schema (regras do form)
-------------------------- */

const serviceSchema = z.object({
	vehicleId: z.string().min(1, 'Selecione um veículo'),
	date: z.string().min(1, 'Data é obrigatória'),
	type: z.enum(['preventive', 'corrective']),
	notes: z.string().optional()
});

type ServiceFormInput = z.input<typeof serviceSchema>;
type ServiceFormValues = z.output<typeof serviceSchema>;

/* -------------------------
   Component
-------------------------- */

export function ServiceForm() {
	const { vehicles, addService, isAddingService } = useVehicles();

	// Hoje no formato yyyy-MM-dd (igual AssetOps)
	const today = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);

	const form = useForm<ServiceFormInput, unknown, ServiceFormValues>({
		resolver: zodResolver(serviceSchema),
		defaultValues: {
			vehicleId: '',
			date: today,
			type: 'preventive',
			notes: ''
		}
	});

	function onSubmit(values: ServiceFormValues) {
		// payload do histórico (ServiceRecord) nasce aqui
		addService({
			vehicleId: values.vehicleId,
			date: values.date,
			type: values.type as ServiceRecord['type'],
			notes: values.notes?.trim() || undefined
		});

		// reseta mantendo a data de hoje
		form.reset({ vehicleId: '', date: today, type: 'preventive', notes: '' });
	}

	return (
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			className='space-y-4 rounded-lg border p-4'
		>
			<h3 className='font-semibold'>Adicionar serviço (histórico)</h3>

			{/* Vehicle select */}
			<div>
				<label className='block text-sm font-medium'>Veículo</label>
				<select
					className='mt-1 w-full rounded border px-3 py-2'
					disabled={isAddingService || vehicles.length === 0}
					{...form.register('vehicleId')}
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

				<p className='text-sm text-red-600'>
					{form.formState.errors.vehicleId?.message}
				</p>

				{vehicles.length === 0 && (
					<p className='mt-1 text-xs text-muted-foreground'>
						Crie um veículo primeiro para registrar serviços.
					</p>
				)}
			</div>

			{/* Date */}
			<div>
				<label className='block text-sm font-medium'>Data do serviço</label>
				<input
					type='date'
					className='mt-1 w-full rounded border px-3 py-2'
					disabled={isAddingService}
					{...form.register('date')}
				/>
				<p className='text-sm text-red-600'>
					{form.formState.errors.date?.message}
				</p>
			</div>

			{/* Type */}
			<div>
				<label className='block text-sm font-medium'>Tipo</label>
				<select
					className='mt-1 w-full rounded border px-3 py-2'
					disabled={isAddingService}
					{...form.register('type')}
				>
					<option value='preventive'>Preventive</option>
					<option value='corrective'>Corrective</option>
				</select>
			</div>

			{/* Notes */}
			<div>
				<label className='block text-sm font-medium'>Notas (opcional)</label>
				<input
					className='mt-1 w-full rounded border px-3 py-2'
					disabled={isAddingService}
					placeholder='ex: troca de pneus, alinhamento, balanceamento...'
					{...form.register('notes')}
				/>
			</div>

			<button
				type='submit'
				disabled={isAddingService || vehicles.length === 0}
				className='rounded bg-black px-4 py-2 text-white'
			>
				{isAddingService ? 'Salvando...' : 'Adicionar serviço'}
			</button>
		</form>
	);
}
