import matter from 'gray-matter';
import { MDXFrontMatter } from '../../types/MdxTypes';

export const getMdxRemoteFile = ({ mdxString }: { mdxString: string }) => {
	const { content } = matter(mdxString);
	const regex = /<FootnoteLink\s+id="\w+"\s+\/>/g;
	const footnoteMatches = content.match(regex) || [];
	const footnoteIds = footnoteMatches.map((match) =>
		match.replace('<FootnoteLink id="', '').replace('" />', ''),
	);

	const frontMatter: MDXFrontMatter = {
		footnote_ids: footnoteIds,
	};

	return {
		frontMatter,
		content,
	};
};
