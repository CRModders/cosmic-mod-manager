import "@/components/highlightjs.css";
import { renderHighlightedString } from "./render-md";

const TextBox = ({ text }: { text: string }) => {
	return (
		// <p className="w-fit max-w-full text-foreground/95 text-base break-words font-mono">
		// 	{text.split("\n").map((textFragment, index) => {
		// 		const key = index;
		// 		return (
		// 			<React.Fragment key={key}>
		// 				<span className="w-full break-words inline-block my-[0.15em]">{textFragment.replaceAll(" ", "‎ ")}</span>
		// 				<br className="select-none" />
		// 			</React.Fragment>
		// 		);
		// 	})}
		// </p>
		<div
			className="w-full markdown-body"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
			dangerouslySetInnerHTML={{ __html: renderHighlightedString(text) }}
		/>
	);
};

export default TextBox;
