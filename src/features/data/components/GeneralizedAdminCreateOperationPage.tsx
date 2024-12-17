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
	| 'getCreateOperationMutationForCollection'
	| 'getPageQueryHookForCollection'
	| 'getUpdateOperationMutationForCollection'
	| 'idPrefixByCollection'
> & {
	getAdminWebAppRoute: (options: unknown) => string;
};
export const GeneralizedAdminCreateOperationPage = <
	TResourceName extends string = string,
>({
	getAdminWebAppRoute,
	getApiResourceSpec,
	getCreateOperationMutationForCollection,
	getPageQueryHookForCollection,
	getUpdateOperationMutationForCollection,
	idPrefixByCollection,
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
	const isValidCollection = (
		value: string | undefined,
	): value is TResourceName =>
		value != null && Object.keys(idPrefixByCollection).includes(value);
	const collectionId = isValidCollection(resource_name) ? resource_name : null;

	// Collection URL
	const collectionHref = getAdminWebAppRoute({
		origin,
		includeOrigin: false,
		routeStaticId: 'ADMIN_WEB_APP__/COLLECTION/[COLLECTION_ID]/ALL',
		queryParams: { resource_name },
	});

	// Data query hook for refetch
	const isPageQueryForReferenceCollectionEnabled = collectionId != null;
	const pageQueryHookForCollection = getPageQueryHookForCollection(
		isPageQueryForReferenceCollectionEnabled ? collectionId : null,
	);
	const { refetch: refetchDocumentPageData } = pageQueryHookForCollection({
		firestoreQueryOptions: {
			pageSize: 300,
			orderByClauses: [['_date_created', 'desc']],
		},
		reactQueryOptions: { enabled: isPageQueryForReferenceCollectionEnabled },
	});

	return (
		<div className='p-4'>
			<div className='flex items-center justify-between'>
				<div>
					<Link
						className='flex space-x-0.5'
						href={getAdminWebAppRoute({
							origin,
							includeOrigin: false,
							routeStaticId: 'ADMIN_WEB_APP__/COLLECTION/[COLLECTION_ID]/ALL',
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
			{collectionId != null && (
				<div>
					<p className='font-medium text-lg'>
						Here's the JSON schema for the create params for the {resource_name}{' '}
						collection:
					</p>
				</div>
			)}
			{!collectionId && <GeneralizedFormSuspense />}
			{collectionId != null && (
				<GeneralizedForm
					collectionId={collectionId}
					getApiResourceSpec={getApiResourceSpec}
					getCreateOperationMutationForCollection={
						getCreateOperationMutationForCollection
					}
					getPageQueryHookForCollection={getPageQueryHookForCollection}
					getUpdateOperationMutationForCollection={
						getUpdateOperationMutationForCollection
					}
					idPrefixByCollection={idPrefixByCollection}
					operation='create'
					updateProps={null}
					onMutationSuccess={async () => {
						await refetchDocumentPageData();
						toast({
							title: 'Success',
							description: 'Added a new record',
						});
						await router.push(collectionHref || '/');
					}}
				/>
			)}
		</div>
	);
};
