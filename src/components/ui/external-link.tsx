import Link from 'next/link';
import { BaseComponentWithChildren } from '../../types/BaseComponentTypes';

export type ExternalLinkProps = BaseComponentWithChildren & {
	href: string;
};
export const ExternalLink = ({ href, children }: ExternalLinkProps) => {
	return (
		<Link passHref href={href} rel='noreferrer' target='_blank'>
			{children}
		</Link>
	);
};

export type ExLinkProps = ExternalLinkProps;
export function ExLink({ href, children }: ExLinkProps) {
	return <ExternalLink href={href}>{children}</ExternalLink>;
}
