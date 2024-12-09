import * as changeCase from 'change-case';
import { GoPencil, GoPlus } from 'react-icons/go';
import { FieldValues } from 'react-hook-form';
import Link from 'next/link';
import { Keys } from 'ergonomic';
import cn from '../../../lib/cn';
import { GeneralizedFormProps } from '../types/GeneralizedFormProps';

export type GeneralizedAdminIndexPageProps<
	TCollection extends string = string,
> = Pick<
	GeneralizedFormProps<FieldValues, TCollection>,
	'getApiResourceSpec' | 'idPrefixByCollection'
> & {
	getAdminWebAppRoute: (options: unknown) => string;
};
export const GeneralizedAdminIndexPage = <TCollection extends string = string>({
	getAdminWebAppRoute,
	getApiResourceSpec,
	idPrefixByCollection,
}: GeneralizedAdminIndexPageProps<TCollection>): JSX.Element => {
	return (
		<>
			<div
				className={cn(
					'bg-blue-900 text-white p-4',
					'flex items-center justify-between',
				)}
			>
				<div>
					<p>Firebase administration</p>
				</div>
			</div>
			<div className='mt-4 px-4'>
				<div>
					<p className=''>Database administration</p>
				</div>
				<div className='max-w-2xl'>
					<div className='bg-blue-900 mt-3 p-2'>
						<p className='text-white'>Firestore database (default)</p>
					</div>
					<div className={cn('p-2', 'flex flex-col space-y-2')}>
						{Keys(idPrefixByCollection).map((collectionId, idx) => {
							const { apiResourceCollectionIdPlural } =
								getApiResourceSpec(collectionId);

							return (
								<div
									className={cn(
										'flex items-center justify-between w-full',
										idx === 0 ? '' : 'border-t border-t-gray-200 pt-2',
									)}
									key={collectionId}
								>
									<div>
										<Link
											href={getAdminWebAppRoute({
												origin,
												includeOrigin: false,
												routeStaticId:
													'ADMIN_WEB_APP__/COLLECTION/[COLLECTION_ID]/ALL',
												queryParams: {
													collection_id: collectionId,
												},
											})}
										>
											<p
												className={cn(
													'text-blue-500 font-medium text-base',
													'cursor-pointer hover:underline',
												)}
											>
												{changeCase.capitalCase(apiResourceCollectionIdPlural)}
											</p>
										</Link>
									</div>
									<div className='flex items-center space-x-4'>
										<div>
											<Link
												className='flex space-x-0.5'
												href={getAdminWebAppRoute({
													origin,
													includeOrigin: false,
													routeStaticId:
														'ADMIN_WEB_APP__/COLLECTION/[COLLECTION_ID]/CREATE',
													queryParams: {
														collection_id: collectionId,
													},
												})}
											>
												<div className='mt-0.5'>
													<GoPlus className='text-green-800' />
												</div>
												<div>
													<p className='font-light text-sm'>Add</p>
												</div>
											</Link>
										</div>
										<div>
											<Link
												className='flex space-x-0.5'
												href={getAdminWebAppRoute({
													origin,
													includeOrigin: false,
													routeStaticId:
														'ADMIN_WEB_APP__/COLLECTION/[COLLECTION_ID]/ALL',
													queryParams: {
														collection_id: collectionId,
													},
												})}
											>
												<div className='mt-0.5'>
													<GoPencil className='text-orange-800' />
												</div>
												<div>
													<p className='font-light text-sm'>Change</p>
												</div>
											</Link>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
};
