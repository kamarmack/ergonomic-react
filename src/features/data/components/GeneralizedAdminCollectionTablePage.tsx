import * as changeCase from 'change-case';
import { useRouter } from 'next/router';
import { getFieldSpecByFieldKey } from 'ergonomic';
import Link from 'next/link';
import { FieldValues } from 'react-hook-form';
import { GoChevronLeft, GoPlus } from 'react-icons/go';
import { AsyncLink } from '../../../components/custom-ui/async-link';
import { ThemeSelect } from '../../../components/theme/ThemeSelect';
import { Skeleton } from '../../../components/ui/skeleton';
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '../../../components/ui/table';
import { GeneralizedFormProps } from '../types/GeneralizedFormProps';
import { GeneralizedTableCellProps } from '../types/GeneralizedTableCellProps';
import { getGeneralizedFormFieldLabel } from '../utils/getGeneralizedFormFieldLabel';
import { GeneralizedTableCell } from './GeneralizedTableCell';

type RouteQueryParams = { collection_id?: string };

export type GeneralizedAdminCollectionTablePageProps<
	TCollection extends string = string,
> = Pick<
	GeneralizedFormProps<FieldValues, TCollection>,
	| 'getApiResourceSpec'
	| 'getPageQueryHookForCollection'
	| 'idPrefixByCollection'
> & {
	getAdminWebAppRoute: (options: unknown) => string;
	getFirestoreCollectionPath: (collectionId: string) => string;
};
export const GeneralizedAdminCollectionTablePage = <
	TCollection extends string = string,
>({
	getAdminWebAppRoute,
	getApiResourceSpec,
	getFirestoreCollectionPath,
	getPageQueryHookForCollection,
	idPrefixByCollection,
}: GeneralizedAdminCollectionTablePageProps<TCollection>): JSX.Element => {
	// ==== Hooks ==== //

	// Router
	const router = useRouter();

	// ==== Constants ==== //

	// Router Query
	const query = (router?.query as RouteQueryParams) ?? {};

	// Router Query Param Values
	const { collection_id } = query;
	const isValidCollection = (value: string | undefined): value is TCollection =>
		value != null && Object.keys(idPrefixByCollection).includes(value);
	const collectionId = isValidCollection(collection_id) ? collection_id : null;

	// Data
	const isPageQueryForReferenceCollectionEnabled = collectionId != null;
	const pageQueryHookForCollection = getPageQueryHookForCollection(
		isPageQueryForReferenceCollectionEnabled ? collectionId : null,
	);
	const { data: documentPageData, isLoading: isDocumentPageDataLoading } =
		pageQueryHookForCollection({
			firestoreQueryOptions: {
				pageSize: 300,
				orderByClauses: [['_date_created', 'desc']],
			},
			reactQueryOptions: { enabled: isPageQueryForReferenceCollectionEnabled },
		});
	const documentPage = documentPageData?.documents ?? [];

	// API Resource Spec
	const apiResourceSpec = collectionId
		? getApiResourceSpec(collectionId)
		: undefined;

	// Field Spec by Field Key
	const fieldSpecByFieldKey = getFieldSpecByFieldKey(
		apiResourceSpec?.apiResourceJsonSchema,
		apiResourceSpec?.apiResourceFieldEnum.arr,
	);
	const isApiResourceSpecInitialized =
		Object.keys(fieldSpecByFieldKey).length > 0 && apiResourceSpec != null;
	const isDocumentPageReady =
		isPageQueryForReferenceCollectionEnabled &&
		!isDocumentPageDataLoading &&
		isApiResourceSpecInitialized;
	const unsortedFieldSpecEntries = Object.entries(fieldSpecByFieldKey);
	const fieldSpecEntries = unsortedFieldSpecEntries.toSorted((a, b) => {
		const order: Record<string, number> = { name: 1, _id: 2 }; // Define the priority order

		const aPriority = order[a[0]] || 3; // Default priority for others is 3
		const bPriority = order[b[0]] || 3;

		return aPriority - bPriority;
	});
	const tableHeaderData = !isDocumentPageReady
		? []
		: fieldSpecEntries.map(([fieldKey, fieldSpec]) => ({
				name: getGeneralizedFormFieldLabel(fieldKey, fieldSpec),
		  }));
	const tableData = documentPage.map((doc): GeneralizedTableCellProps[] => {
		const data = !isDocumentPageReady
			? []
			: fieldSpecEntries.map(
					([fieldKey, fieldSpec]): GeneralizedTableCellProps => {
						const value = doc[fieldKey as keyof typeof doc];
						const props: GeneralizedTableCellProps = {
							_object: collectionId,
							fieldSpec,
							idPrefixByCollection,
							originalData: doc,
							value,
						};
						return props;
					},
			  );
		return data;
	});

	// Suspense loading state
	if (!isDocumentPageReady) {
		return (
			<div>
				{Array.from({ length: 1 }).map(() => (
					<Skeleton className='h-8' />
				))}
			</div>
		);
	}

	return (
		<div className='p-4'>
			<div className='flex items-center justify-between'>
				<div>
					<Link
						className='flex space-x-0.5'
						href={getAdminWebAppRoute({
							origin,
							includeOrigin: false,
							routeStaticId: 'ADMIN_WEB_APP__/INDEX',
							queryParams: {},
						})}
					>
						<div className='mt-0.5'>
							<GoChevronLeft className='text-green-800' />
						</div>
						<div>
							<p className='font-light text-sm'>Home</p>
						</div>
					</Link>
				</div>
				<div className='flex items-center space-x-2'>
					<div>
						<Link
							className='flex space-x-0.5 border border-gray-200 rounded px-2 py-1'
							href={getAdminWebAppRoute({
								origin,
								includeOrigin: false,
								routeStaticId:
									'ADMIN_WEB_APP__/COLLECTION/[COLLECTION_ID]/CREATE',
								queryParams: { collection_id: collectionId },
							})}
						>
							<div className='mt-0.5'>
								<GoPlus className='text-green-800' />
							</div>
							<div>
								<p className='font-light text-sm'>
									Add {changeCase.capitalCase(collectionId ?? '')}
								</p>
							</div>
						</Link>
					</div>
					<div>
						<ThemeSelect />
					</div>
				</div>
			</div>
			<p className='font-light text-sm'>
				Select {changeCase.capitalCase(collectionId ?? '')} to change
			</p>
			<div className=''>
				<Table className=''>
					<TableHeader className=''>
						<TableRow className=''>
							{tableHeaderData.map(({ name: headerName }) => {
								return <TableHead key={headerName}>{headerName}</TableHead>;
							})}
						</TableRow>
					</TableHeader>
					<TableBody className=''>
						{tableData.map((rowData, rowIdx) => {
							return (
								<TableRow key={rowIdx.toString()}>
									{rowData.map((cellData, cellIdx) => {
										const firebaseProjectId =
											process.env.NEXT_PUBLIC_CONFIG_FIREBASE_PROJECT_ID ?? '';
										const firestoreCollectionId =
											getFirestoreCollectionPath(collectionId);
										const documentId = (
											cellData.originalData as { _id: string }
										)._id;
										const editHref =
											cellIdx === 0
												? getAdminWebAppRoute({
														origin,
														includeOrigin: false,
														routeStaticId:
															'ADMIN_WEB_APP__/COLLECTION/[COLLECTION_ID]/[DOCUMENT_ID]/EDIT',
														queryParams: {
															collection_id: collectionId,
															document_id: documentId,
														},
												  })
												: cellIdx === 1
												? `https://console.firebase.google.com/project/${firebaseProjectId}/firestore/databases/-default-/data/~2F${firestoreCollectionId}~2F${documentId}`
												: '';
										const isReady = cellIdx === 0 || cellIdx === 1;
										const target = cellIdx === 1 ? '_blank' : '_self';

										return (
											<TableCell key={cellIdx.toString()}>
												<AsyncLink
													href={editHref}
													isReady={isReady}
													target={target}
												>
													<GeneralizedTableCell {...cellData} />
												</AsyncLink>
											</TableCell>
										);
									})}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};
