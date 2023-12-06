import Image from 'next/image';
import { ExLink } from '@/components/ui/external-link';
import { getFootnoteComponents } from '@/components/mdx/footnote';
import { MDXFrontMatter } from '@/types/MdxTypes';
import { Mermaid } from 'mdx-mermaid/lib/Mermaid';
import { InlineMath, BlockMath } from 'react-katex';

type GetMdxRemoteComponentProps = {
	frontMatter: MDXFrontMatter;
};
export function getMdxRemoteComponents({
	frontMatter,
}: GetMdxRemoteComponentProps) {
	const components: {
		[key: string]: () => JSX.Element;
	} = {
		BlockMath: BlockMath as () => JSX.Element,
		ExLink: ExLink as () => JSX.Element,
		Image: Image as unknown as () => JSX.Element,
		InlineMath: InlineMath as () => JSX.Element,
		Mermaid: Mermaid as () => JSX.Element,
	};
	const { footnote_ids } = frontMatter || {};
	if (footnote_ids) {
		const { FootnoteList, FootnoteLink } = getFootnoteComponents({
			footnoteIds: footnote_ids,
		});
		components.FootnoteLink = FootnoteLink as () => JSX.Element;
		components.FootnoteList = FootnoteList as () => JSX.Element;
	}
	return components;
}
