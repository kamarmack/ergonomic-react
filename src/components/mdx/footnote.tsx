import { MDXFrontMatter } from 'ergonomic-react/src/types/MdxTypes';

export type GetFootnoteComponentsProps = {
	footnoteIds: Required<MDXFrontMatter>['footnote_ids'];
};
export function getFootnoteComponents({
	footnoteIds,
}: GetFootnoteComponentsProps) {
	function getFootnotePos({ id }: { id: string }) {
		const i = footnoteIds.findIndex((k) => k === id);
		if (i === -1) {
			const log = { footnoteIds, id };
			// console.error(`footnote error: ${JSON.stringify(log, null, '\t')}`);
			return -1;
			throw new Error(`footnote error: ${JSON.stringify(log, null, '\t')}`);
		}
		return i + 1;
	}
	type FootnoteLinkProps = {
		id: string;
	};
	function FootnoteLink({ id }: FootnoteLinkProps): JSX.Element {
		return (
			<a
				href={`#details-${id}`}
				id={`footnote-${id}`}
				style={{ textDecoration: 'none' }}
			>
				<sup>{getFootnotePos({ id })}</sup>
			</a>
		);
	}
	type FootnoteListProps = {
		footnotes: {
			[key: string]: string | React.ReactNode;
		};
	};
	function FootnoteList({ footnotes }: FootnoteListProps): JSX.Element {
		const left_padding = <div>&nbsp;&nbsp;&nbsp;</div>;
		if (Object.keys(footnotes || {}).find((k) => !footnoteIds.includes(k))) {
			// console.error(
			// 	`footnote error: ${JSON.stringify(footnoteIds, null, '\t')}`,
			// );
			return <div></div>;
			// throw new Error(`footnote error: ${JSON.stringify(log, null, '\t')}`);
		}
		return (
			<div>
				<p>
					<strong>Notes</strong>
				</p>
				<div
					style={{
						fontSize: 'xx-small',
						width: '50%',
					}}
				>
					{footnoteIds.map((id) => {
						const note = footnotes[id];
						if (!note) {
							const log = { footnotes, footnoteIds, id };
							throw new Error(
								`footnote error: ${JSON.stringify(log, null, '\t')}`,
							);
						}
						return (
							<div className='mt-1' key={id} id={`details-${id}`}>
								<div style={{ display: 'inline-flex' }}>
									<a
										href={`#footnote-${id}`}
										style={{ textDecoration: 'none' }}
									>
										^{getFootnotePos({ id })}
									</a>
									{left_padding}
									{note}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	}
	return {
		FootnoteLink,
		FootnoteList,
	};
}
