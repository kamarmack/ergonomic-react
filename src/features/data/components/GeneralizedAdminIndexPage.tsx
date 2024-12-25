import * as changeCase from 'change-case';
import { GoPencil, GoPlus } from 'react-icons/go';
import { FieldValues } from 'react-hook-form';
import Link from 'next/link';
import { Keys } from 'ergonomic';
import cn from '../../../lib/cn';
import { GeneralizedFormProps } from '../types/GeneralizedFormProps';

export type GeneralizedAdminIndexPageProps<
	TResourceName extends string = string,
> = Pick<
	GeneralizedFormProps<FieldValues, TResourceName>,
	'getApiResourceSpec' | 'idPrefixByResourceName'
> & {
	getAdminSiteRoute: (options: unknown) => string;
};
export const GeneralizedAdminIndexPage = <
	TResourceName extends string = string,
>({
	getAdminSiteRoute,
	getApiResourceSpec,
	idPrefixByResourceName,
}: GeneralizedAdminIndexPageProps<TResourceName>): JSX.Element => {
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
						{Keys(idPrefixByResourceName).map((resourceName, idx) => {
							const apiResourceSpec = getApiResourceSpec(resourceName);

							return (
								<div
									className={cn(
										'flex items-center justify-between w-full',
										idx === 0 ? '' : 'border-t border-t-gray-200 pt-2',
									)}
									key={resourceName}
								>
									<div>
										<Link
											href={getAdminSiteRoute({
												origin: null,
												includeOrigin: false,
												routeStaticId:
													'ADMIN_SITE__/RESOURCE/[RESOURCE_NAME]/ALL',
												queryParams: {
													resource_name: resourceName,
												},
											})}
										>
											<p
												className={cn(
													'text-blue-500 font-medium text-base',
													'cursor-pointer hover:underline',
												)}
											>
												{changeCase.capitalCase(
													apiResourceSpec.apiResourceNamePlural,
												)}
											</p>
										</Link>
									</div>
									<div className='flex items-center space-x-4'>
										<div>
											<Link
												className='flex space-x-0.5'
												href={getAdminSiteRoute({
													origin: null,
													includeOrigin: false,
													routeStaticId:
														'ADMIN_SITE__/RESOURCE/[RESOURCE_NAME]/CREATE',
													queryParams: {
														resource_name: resourceName,
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
												href={getAdminSiteRoute({
													origin: null,
													includeOrigin: false,
													routeStaticId:
														'ADMIN_SITE__/RESOURCE/[RESOURCE_NAME]/ALL',
													queryParams: {
														resource_name: resourceName,
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
