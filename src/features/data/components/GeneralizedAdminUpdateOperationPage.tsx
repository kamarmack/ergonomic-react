import { useRouter } from 'next/router';
import Link from 'next/link';
import { FieldValues } from 'react-hook-form';
import { GoChevronLeft } from 'react-icons/go';
import { ThemeSelect } from '../../../components/theme/ThemeSelect';
import { useToast } from '../../../components/ui/use-toast';
import { GeneralizedFormProps } from '../types/GeneralizedFormProps';
import { GeneralizedFormSuspense, GeneralizedForm } from './GeneralizedForm';

type RouteQueryParams = { resource_name?: string; document_id?: string };

export type GeneralizedAdminUpdateOperationPageProps<
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
export const GeneralizedAdminUpdateOperationPage = <
	TResourceName extends string = string,
>({
	getAdminWebAppRoute,
	getApiResourceSpec,
	getCreateOperationMutationForCollection,
	getPageQueryHookForCollection,
	getUpdateOperationMutationForCollection,
	idPrefixByCollection,
}: GeneralizedAdminUpdateOperationPageProps<TResourceName>): JSX.Element => {
	// ==== Hooks ==== //

	// Router
	const router = useRouter();

	// Toaster
	const { toast } = useToast();

	// ==== Constants ==== //

	// Router Query
	const query = (router?.query as RouteQueryParams) ?? {};

	// Router Query Param Values
	const { resource_name, document_id } = query;
	const isValidCollection = (
		value: string | undefined,
	): value is TResourceName =>
		value != null && Object.keys(idPrefixByCollection).includes(value);
	const collectionId = isValidCollection(resource_name) ? resource_name : null;

	// Data
	const isPageQueryForReferenceCollectionEnabled =
		collectionId != null && document_id != null;
	const pageQueryHookForCollection = getPageQueryHookForCollection(
		isPageQueryForReferenceCollectionEnabled ? collectionId : null,
	);
	const {
		data: documentPageData,
		isLoading: isDocumentPageDataLoading,
		refetch: refetchDocumentData,
	} = pageQueryHookForCollection({
		firestoreQueryOptions: {
			whereClauses: [['_id', '==', document_id]],
		},
		reactQueryOptions: { enabled: isPageQueryForReferenceCollectionEnabled },
	});
	const documentPage = documentPageData?.documents ?? [];
	const documentData = documentPage[0] ?? null;
	const isDocumentReady =
		isPageQueryForReferenceCollectionEnabled &&
		!isDocumentPageDataLoading &&
		documentData !== null;

	// Collection URL
	const collectionHref = getAdminWebAppRoute({
		origin,
		includeOrigin: false,
		routeStaticId: 'ADMIN_WEB_APP__/COLLECTION/[COLLECTION_ID]/ALL',
		queryParams: { resource_name },
	});

	// Data query hook for refetch
	const { refetch: refetchDocumentPageData } = pageQueryHookForCollection({
		firestoreQueryOptions: {
			pageSize: 300,
			orderByClauses: [['_date_created', 'desc']],
		},
		reactQueryOptions: { enabled: isPageQueryForReferenceCollectionEnabled },
	});

	// Suspense loading state
	if (!isDocumentReady) {
		return <GeneralizedFormSuspense />;
	}

	return (
		<div className='p-4'>
			<div className='flex items-center justify-between'>
				<div>
					<Link className='flex space-x-0.5' href={collectionHref}>
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
				The resource_name for this page is: {collectionId}
			</p>
			<p className='font-light text-sm'>
				The document_id for this page is: {document_id}
			</p>
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
				operation='update'
				updateProps={{
					documentId: document_id,
					initialFieldValues: documentData,
				}}
				onMutationSuccess={async () => {
					await refetchDocumentData();
					await refetchDocumentPageData();
					toast({
						title: 'Success',
						description: 'Updated record',
					});
					await router.push(collectionHref || '/');
				}}
			/>
		</div>
	);
};
