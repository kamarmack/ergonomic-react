import { useRouter } from 'next/router';
import Link from 'next/link';
import { FieldValues } from 'react-hook-form';
import { GoChevronLeft } from 'react-icons/go';
import { ThemeSelect } from '../../../components/theme/ThemeSelect';
import { useToast } from '../../../components/ui/use-toast';
import { GeneralizedFormProps } from '../types/GeneralizedFormProps';
import { GeneralizedFormSuspense, GeneralizedForm } from './GeneralizedForm';

type RouteQueryParams = { collection_id?: string };

export type GeneralizedAdminCreateOperationPageProps<
	TCollection extends string = string,
> = Pick<
	GeneralizedFormProps<FieldValues, TCollection>,
	| 'getApiObjectSpec'
	| 'getCreateOperationMutationForCollection'
	| 'getPageQueryHookForCollection'
	| 'getUpdateOperationMutationForCollection'
	| 'idPrefixByCollection'
> & {
	getAdminWebAppRoute: (options: unknown) => string;
};
export const GeneralizedAdminCreateOperationPage = <
	TCollection extends string = string,
>({
	getAdminWebAppRoute,
	getApiObjectSpec,
	getCreateOperationMutationForCollection,
	getPageQueryHookForCollection,
	getUpdateOperationMutationForCollection,
	idPrefixByCollection,
}: GeneralizedAdminCreateOperationPageProps<TCollection>): JSX.Element => {
	// ==== Hooks ==== //

	// Router
	const router = useRouter();

	// Toaster
	const { toast } = useToast();

	// ==== Constants ==== //

	// Router Query
	const query = (router?.query as RouteQueryParams) ?? {};

	// Router Query Param Values
	const { collection_id } = query;
	const isValidCollection = (value: string | undefined): value is TCollection =>
		value != null && Object.keys(idPrefixByCollection).includes(value);
	const collectionId = isValidCollection(collection_id) ? collection_id : null;

	// Collection URL
	const collectionHref = getAdminWebAppRoute({
		origin,
		includeOrigin: false,
		routeStaticId: 'ADMIN_WEB_APP__/COLLECTION/[COLLECTION_ID]/ALL',
		queryParams: { collection_id },
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
							queryParams: { collection_id },
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
				The collection_id for this page is: {collection_id}
			</p>
			{collectionId != null && (
				<div>
					<p className='font-medium text-lg'>
						Here's the JSON schema for the create params for the {collection_id}{' '}
						collection:
					</p>
				</div>
			)}
			{!collectionId && <GeneralizedFormSuspense />}
			{collectionId != null && (
				<GeneralizedForm
					collectionId={collectionId}
					getApiObjectSpec={getApiObjectSpec}
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
