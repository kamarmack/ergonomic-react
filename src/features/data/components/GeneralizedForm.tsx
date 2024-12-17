import * as R from 'ramda';
import { getFieldSpecByFieldKey, getGeneralizedError } from 'ergonomic';
import { useEffect, useState } from 'react';
import { GoInfo } from 'react-icons/go';
import { FieldValues, Path, UseFormSetError, useForm } from 'react-hook-form';
import { Skeleton } from '../../../components/ui/skeleton';
import { useToast } from '../../../components/ui/use-toast';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../../../components/ui/tooltip';
import { NODE_ENV } from '../../../config/nodeEnv';
import { default as cn } from '../../../lib/cn';
import { GeneralizedFormFieldContainer } from './GeneralizedFormFieldContainer';
import { getGeneralizedServerDataFromFormData } from '../utils/getGeneralizedServerDataFromFormData';
import { getGeneralizedFormDataFromServerData } from '../utils/getGeneralizedFormDataFromServerData';
import { useYupValidationResolver } from '../hooks/useYupValidationResolver';
import { getGeneralizedFormFieldErrors } from '../utils/getGeneralizedFormFieldErrors';
import { GeneralizedFormDataTransformationOptions } from '../types/GeneralizedFormDataTransformationOptions';
import { GeneralizedFormProps } from '../types/GeneralizedFormProps';

export const GeneralizedFormSuspense = () => {
	return (
		<div className='flex flex-col space-y-4 max-w-2xl'>
			{Array.from({ length: 10 }).map((_, i) =>
				i % 3 === 0 ? (
					<div key={i} className='flex space-x-2'>
						<Skeleton className='h-8 flex-1' />
						<Skeleton className='h-8 flex-1' />
					</div>
				) : (
					<Skeleton key={i} className='h-8' />
				),
			)}
		</div>
	);
};

export const GeneralizedForm = <
	TFieldValues extends FieldValues = FieldValues,
	TResourceName extends string = string,
>({
	getApiResourceSpec,
	getCreateOperationMutationForResource,
	getPageQueryHookForResource,
	getUpdateOperationMutationForResource,
	idPrefixByResourceName,
	onMutationSuccess: onSuccess,
	operation,
	resourceName,
	updateProps,
}: GeneralizedFormProps<TFieldValues, TResourceName>): JSX.Element => {
	const { toast } = useToast();

	// API Resource Spec
	const apiResourceSpec = resourceName
		? getApiResourceSpec(resourceName)
		: undefined;

	// Field Spec by Field Key
	const createOperationSchema = apiResourceSpec?.createParamsJsonSchema ?? null;
	const updateOperationSchema = apiResourceSpec?.updateParamsJsonSchema ?? null;
	const writeOperationSchema =
		operation === 'create' ? createOperationSchema : updateOperationSchema;
	const createOperationFieldEnum =
		apiResourceSpec?.createParamsFieldEnum ?? null;
	const updateOperationFieldEnum =
		apiResourceSpec?.updateParamsFieldEnum ?? null;
	const writeOperationFieldEnum =
		operation === 'create'
			? createOperationFieldEnum
			: updateOperationFieldEnum;
	const fieldSpecByFieldKey = getFieldSpecByFieldKey(
		writeOperationSchema ?? undefined,
		writeOperationFieldEnum?.arr ?? undefined,
	);
	const currencyFieldKeys = Object.entries(fieldSpecByFieldKey)
		.filter(
			([_, fieldSpec]) =>
				fieldSpec.meta?.type && ['usd'].includes(fieldSpec.meta?.type),
		)
		.map(([fieldKey]) => fieldKey);
	const dateTimeLocalFieldKeys = Object.entries(fieldSpecByFieldKey)
		.filter(([_, fieldSpec]) => fieldSpec.meta?.type === 'date')
		.map(([fieldKey]) => fieldKey);
	const floatingPointNumberFieldKeys = Object.entries(fieldSpecByFieldKey)
		.filter(
			([_, fieldSpec]) => fieldSpec.meta?.type === 'floating_point_number',
		)
		.map(([fieldKey]) => fieldKey);
	const integerFieldKeys = Object.entries(fieldSpecByFieldKey)
		.filter(([_, fieldSpec]) => fieldSpec.meta?.type === 'integer')
		.map(([fieldKey]) => fieldKey);
	const percentageFieldKeys = Object.entries(fieldSpecByFieldKey)
		.filter(([_, fieldSpec]) => fieldSpec.meta?.type === 'percentage')
		.map(([fieldKey]) => fieldKey);
	const phoneNumberFieldKeys = Object.entries(fieldSpecByFieldKey)
		.filter(
			([_, fieldSpec]) =>
				fieldSpec.meta?.type &&
				['united_states_phone_number'].includes(fieldSpec.meta?.type),
		)
		.map(([fieldKey]) => fieldKey);
	const dataTransformationOptions: GeneralizedFormDataTransformationOptions = {
		currencyFieldKeys,
		dateTimeLocalFieldKeys,
		floatingPointNumberFieldKeys,
		integerFieldKeys,
		percentageFieldKeys,
		phoneNumberFieldKeys,
	};

	// Resolver
	const resolver = useYupValidationResolver(
		writeOperationSchema,
		dataTransformationOptions,
	);

	// Initialize the useForm hook
	const {
		// clearErrors,
		control,
		formState,
		handleSubmit,
		reset,
		// resetField,
		setError,
		// setValue,
		watch,
	} = useForm<TFieldValues>({
		resolver,
	});

	// Create Operation Mutation
	const isCreateOperationMutationForResourceEnabled = resourceName != null;
	const createOperationMutationForResource =
		isCreateOperationMutationForResourceEnabled
			? getCreateOperationMutationForResource(resourceName)
			: () => ({ isLoading: false, mutate: (_data: unknown) => void 0 });
	const {
		isLoading: isCreateOperationLoading,
		mutate: createOperationMutation,
	} = createOperationMutationForResource({
		onSuccess,
		onError: ({ error }) => {
			const message =
				error?.message ?? 'Unknown error occurred while adding your record';

			const data = error?.data ?? getGeneralizedError().error.data;
			const errors = Object.entries(data).filter(
				([k]) => apiResourceSpec?.createParamsFieldEnum.isMember(k) ?? false,
			);

			toast({
				title: 'Error',
				description: message,
			});

			if (errors.length) {
				errors.forEach(([k, fieldError]) => {
					const fieldErrorMessages = fieldError as string[];
					const message = Array.isArray(fieldErrorMessages)
						? fieldErrorMessages.join(', ')
						: 'An error occurred for this value';

					setError(k as Parameters<UseFormSetError<TFieldValues>>[0], {
						type: 'value',
						message,
					});
				});
			} else {
				setError('general' as Parameters<UseFormSetError<TFieldValues>>[0], {
					type: 'value',
					message,
				});
			}
		},
	});

	// Update Operation Mutation
	const isUpdateOperationMutationForResourceEnabled =
		resourceName != null && updateProps?.documentId != null;
	const updateOperationMutationForResource =
		isUpdateOperationMutationForResourceEnabled
			? getUpdateOperationMutationForResource(resourceName)
			: () => ({ isLoading: false, mutate: (_data: unknown) => void 0 });
	const {
		isLoading: isUpdateOperationLoading,
		mutate: updateOperationMutation,
	} = updateOperationMutationForResource({
		onSuccess,
		onError: ({ error }) => {
			const message =
				error?.message ?? 'Unknown error occurred while adding your record';

			const data = error?.data ?? getGeneralizedError().error.data;
			const errors = Object.entries(data).filter(
				([k]) => apiResourceSpec?.updateParamsFieldEnum.isMember(k) ?? false,
			);

			toast({
				title: 'Error',
				description: message,
			});

			if (errors.length) {
				errors.forEach(([k, fieldError]) => {
					const fieldErrorMessages = fieldError as string[];
					const message = Array.isArray(fieldErrorMessages)
						? fieldErrorMessages.join(', ')
						: 'An error occurred for this value';

					setError(k as Parameters<UseFormSetError<TFieldValues>>[0], {
						type: 'value',
						message,
					});
				});
			} else {
				setError('general' as Parameters<UseFormSetError<TFieldValues>>[0], {
					type: 'value',
					message,
				});
			}
		},
	});

	const writeMutation =
		operation === 'create' ? createOperationMutation : updateOperationMutation;

	const onSubmit = handleSubmit((data) => {
		const serverData = {
			...getGeneralizedServerDataFromFormData(data, dataTransformationOptions),
			_id: updateProps?.documentId as string,
		};
		console.log(serverData);
		writeMutation(serverData);
	}) as () => void;

	const isApiResourceSpecInitialized =
		Object.keys(fieldSpecByFieldKey).length > 0 && apiResourceSpec != null;
	const [isDefaultValuesInitialized, setIsDefaultValuesInitialized] =
		useState(false);
	useEffect(() => {
		if (operation !== 'create') return;

		if (!isApiResourceSpecInitialized) return;
		if (isDefaultValuesInitialized) return;

		const defaultValues =
			apiResourceSpec.createParamsJsonSchema.getDefault() as TFieldValues;
		const formDefaultVales = getGeneralizedFormDataFromServerData(
			defaultValues,
			dataTransformationOptions,
		);
		console.log('Create Operation Form Default Values', {
			defaultValues,
			formDefaultVales,
		});
		reset(formDefaultVales);

		setIsDefaultValuesInitialized(true);
	}, [
		operation,
		isApiResourceSpecInitialized,
		isDefaultValuesInitialized,
		dataTransformationOptions,
	]);

	const [initialFormData, setInitialFormData] = useState<FieldValues | null>(
		null,
	);
	useEffect(() => {
		if (operation !== 'update') return;
		if (updateProps == null) return;
		if (!isApiResourceSpecInitialized) return;
		if (isDefaultValuesInitialized) return;

		const defaultValues = R.pick(
			updateOperationFieldEnum?.arr ?? [],
			updateProps.initialFieldValues,
		) as TFieldValues;
		const formDefaultVales = getGeneralizedFormDataFromServerData(
			defaultValues,
			dataTransformationOptions,
		);
		console.log('Update Operation Form Default Values', {
			defaultValues,
			formDefaultVales,
		});
		setInitialFormData(() => formDefaultVales);
		reset(formDefaultVales);
		setIsDefaultValuesInitialized(true);
	}, [
		operation,
		updateProps,
		isApiResourceSpecInitialized,
		isDefaultValuesInitialized,
	]);

	const formValues = watch();
	const fieldErrors = getGeneralizedFormFieldErrors(formState);
	const isWriteOperationLoading =
		operation === 'create'
			? isCreateOperationLoading
			: isUpdateOperationLoading;
	const isSubmitting = formState.isSubmitting || isWriteOperationLoading;

	if (!isDefaultValuesInitialized) {
		return <GeneralizedFormSuspense />;
	}

	return (
		<form className='flex flex-col space-y-4 max-w-2xl' onSubmit={onSubmit}>
			<div className='font-light text-sm max-w-2xl'>
				{Object.entries(fieldSpecByFieldKey).map(([fieldKey, fieldSpec]) => (
					<div key={fieldKey}>
						<GeneralizedFormFieldContainer
							_object={resourceName}
							control={control}
							fieldErrors={fieldErrors}
							fieldKey={fieldKey as Path<TFieldValues>}
							fieldSpec={fieldSpec}
							getPageQueryHookForResource={getPageQueryHookForResource}
							idPrefixByResourceName={idPrefixByResourceName}
							initialFormData={initialFormData}
							isSubmitting={isSubmitting}
							operation={operation}
							setError={(message) =>
								setError(
									fieldKey as Parameters<UseFormSetError<TFieldValues>>[0],
									{ message },
								)
							}
						/>
					</div>
				))}
			</div>
			<button
				className={cn(
					isSubmitting
						? 'bg-gray-500 text-gray-300 cursor-not-allowed'
						: 'bg-gray-700 text-white',
					'rounded-md py-2 px-4',
				)}
				disabled={isSubmitting}
				type='submit'
			>
				{isSubmitting ? 'Saving...' : 'Submit'}
			</button>
			{(NODE_ENV === 'development' ||
				['true', 'yes', 'TRUE', 'YES', '1'].includes(
					process.env.NEXT_PUBLIC_SHOW_FORM_DATA_TOOLTIP_ON_GENERALIZED_FORM ??
						'',
				)) && (
				<div>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<button type='button'>
									<GoInfo />
								</button>
							</TooltipTrigger>
							<TooltipContent className='max-h-[40rem] max-w-[40rem] overflow-scroll'>
								<div>
									<p className='font-semibold text-sm'>Form data</p>
									<pre className='text-xs font-light text-gray-500 max-w-xs mt-1'>
										<code>
											{JSON.stringify(
												typeof formValues === 'object' && formValues != null
													? formValues
													: {},
												null,
												'\t',
											)}
										</code>
									</pre>
								</div>
								<div>
									<p className='font-semibold text-sm'>Server data</p>
									<pre className='text-xs font-light text-gray-500 max-w-xs mt-1'>
										<code>
											{JSON.stringify(
												typeof formValues === 'object' && formValues != null
													? getGeneralizedServerDataFromFormData(
															formValues,
															dataTransformationOptions,
													  )
													: {},
												null,
												'\t',
											)}
										</code>
									</pre>
								</div>
								<div>
									<p className='font-semibold text-sm'>Form errors</p>
									<pre className='text-xs font-light text-gray-500 max-w-xs mt-1'>
										<code>
											{JSON.stringify(
												typeof fieldErrors === 'object' && fieldErrors != null
													? fieldErrors
													: {},
												null,
												'\t',
											)}
										</code>
									</pre>
								</div>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			)}

			<p className='font-semibold text-red-700 text-xs'>
				{getGeneralizedFormFieldErrors(
					formState,
				).general?.message?.toString?.()}
			</p>
		</form>
	);
};
