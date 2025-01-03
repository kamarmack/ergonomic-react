import { useRouter } from 'next/router';
import Link from 'next/link';
import { FieldValues } from 'react-hook-form';
import { GoChevronLeft } from 'react-icons/go';
import { ThemeSelect } from '../../../components/theme/ThemeSelect';
import { useToast } from '../../../components/ui/use-toast';
import { GeneralizedFormProps } from '../types/GeneralizedFormProps';
import { GeneralizedFormSuspense, GeneralizedForm } from './GeneralizedForm';

type RouteQueryParams = { resource_name?: string };

export type GeneralizedAdminCreateOperationPageProps<
	TResourceName extends string = string,
> = Pick<
	GeneralizedFormProps<FieldValues, TResourceName>,
	| 'getApiResourceSpec'
	| 'getCreateOperationMutationForResource'
	| 'getPageQueryHookForResource'
	| 'getUpdateOperationMutationForResource'
	| 'idPrefixByResourceName'
> & {
	getAdminSiteRoute: (options: unknown) => string;
};
export const GeneralizedAdminCreateOperationPage = <
	TResourceName extends string = string,
>({
	getAdminSiteRoute,
	getApiResourceSpec,
	getCreateOperationMutationForResource,
	getPageQueryHookForResource,
	getUpdateOperationMutationForResource,
	idPrefixByResourceName,
}: GeneralizedAdminCreateOperationPageProps<TResourceName>): JSX.Element => {
	// ==== Hooks ==== //

	// Router
	const router = useRouter();

	// Toaster
	const { toast } = useToast();

	// ==== Constants ==== //

	// Router Query
	const query = (router?.query as RouteQueryParams) ?? {};

	// Router Query Param Values
	const { resource_name } = query;
	const isValidResourceName = (
		value: string | undefined,
	): value is TResourceName =>
		value != null && Object.keys(idPrefixByResourceName).includes(value);
	const resourceName = isValidResourceName(resource_name)
		? resource_name
		: null;

	// Resource URL
	const resourceHref = getAdminSiteRoute({
		origin: null,
		includeOrigin: false,
		routeStaticId: 'ADMIN_SITE__/RESOURCE/[RESOURCE_NAME]/ALL',
		queryParams: { resource_name },
	});

	// Data query hook for refetch
	const isPageQueryForReferenceResourceEnabled = resourceName != null;
	const pageQueryHookForResource = getPageQueryHookForResource(
		isPageQueryForReferenceResourceEnabled ? resourceName : null,
	);
	const { refetch: refetchDocumentPageData } = pageQueryHookForResource({
		firestoreQueryOptions: {
			pageSize: 300,
			orderByClauses: [['_date_created', 'desc']],
		},
		reactQueryOptions: { enabled: isPageQueryForReferenceResourceEnabled },
	});

	return (
		<div className='p-4'>
			<div className='flex items-center justify-between'>
				<div>
					<Link
						className='flex space-x-0.5'
						href={getAdminSiteRoute({
							origin: null,
							includeOrigin: false,
							routeStaticId: 'ADMIN_SITE__/RESOURCE/[RESOURCE_NAME]/ALL',
							queryParams: { resource_name },
						})}
					>
						<div className='mt-0.5'>
							<GoChevronLeft className='text-green-800' />
						</div>
						<div>
							<p className='font-light text-sm'>Back</p>
						</div>
					</Link>
				</div>
				<div>
					<ThemeSelect />
				</div>
			</div>
			<p className='font-light text-sm'>
				The resource_name for this page is: {resource_name}
			</p>
			{resourceName != null && (
				<div>
					<p className='font-medium text-lg'>
						Here's the JSON schema for the create params for the {resource_name}{' '}
						resource:
					</p>
				</div>
			)}
			{!resourceName && <GeneralizedFormSuspense />}
			{resourceName != null && (
				<GeneralizedForm
					resourceName={resourceName}
					getApiResourceSpec={getApiResourceSpec}
					getCreateOperationMutationForResource={
						getCreateOperationMutationForResource
					}
					getPageQueryHookForResource={getPageQueryHookForResource}
					getUpdateOperationMutationForResource={
						getUpdateOperationMutationForResource
					}
					idPrefixByResourceName={idPrefixByResourceName}
					operation='create'
					updateProps={null}
					onMutationSuccess={async () => {
						await refetchDocumentPageData();
						toast({
							title: 'Success',
							description: 'Added a new record',
						});
						await router.push(resourceHref || '/');
					}}
				/>
			)}
		</div>
	);
};
