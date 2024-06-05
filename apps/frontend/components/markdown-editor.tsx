import { cn } from "@/lib/utils";
import { CodeIcon, FontItalicIcon, ImageIcon, InfoCircledIcon, VideoIcon } from "@radix-ui/react-icons";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
	BoldIcon,
	BulletedListIcon,
	ChainIcon,
	EyeScanIcon,
	Heading1Icon,
	Heading2Icon,
	Heading3Icon,
	NumberedListIcon,
	QuoteIcon,
	StrikethroughIcon,
} from "./icons";
import TextBox from "./text-box";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const IconButton = ({
	children,
	tooltipContent,
	disabled,
	...props
}: {
	children: React.ReactNode;
	tooltipContent?: React.ReactNode;
	disabled?: boolean;
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
}) => {
	return (
		<TooltipProvider delayDuration={300}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						size={"icon"}
						tabIndex={disabled ? -1 : 0}
						disabled={disabled}
						className="w-8 h-8 bg-zinc-300/65 dark:bg-zinc-700 text-foreground-muted hover:text-foreground dark:hover:text-foreground-muted hover:bg-zinc-300 dark:hover:bg-zinc-700/65"
						{...props}
					>
						{children}
					</Button>
				</TooltipTrigger>
				<TooltipContent className=" bg-background-shallow text-foreground-muted">
					<span className="">{tooltipContent || ""}</span>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

const Separator = () => {
	return <span className="hidden lg:flex w-[0.1rem] bg-background-shallow h-10" />;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function setCursorPosition(textarea: any, position: number) {
	try {
		if (textarea.setSelectionRange) {
			// Check if the method exists
			textarea.focus(); // Focus the textarea
			textarea.setSelectionRange(position, position); // Set the cursor position
		} else if (textarea.createTextRange) {
			// For Internet Explorer support
			const range = textarea.createTextRange();
			range.collapse(true);
			range.moveEnd("character", position);
			range.moveStart("character", position);
			range.select();
		}
	} catch (error) {
		console.error(error);
	}
}

type Props = {
	placeholder?: string;
};

const textSeparatorChar = "{|}";

const MarkdownEditor = ({ placeholder }: Props) => {
	const [editorValue, seteditorValue] = useState("");
	const [previewOn, setPreviewOn] = useState(false);
	const editorTextarea = useRef<HTMLTextAreaElement>(null);
	const [lastSelectionRange, setLastSelectionRange] = useState<number | null>(null);

	const toggleTextAtCursorsLine = (text: string, atLineStart?: boolean) => {
		if (editorTextarea.current?.selectionStart === undefined) return;
		const selectionStart = editorTextarea.current.selectionStart;
		let targetIndex = selectionStart;
		if (atLineStart === true) {
			const lastNextLineCharIndex = editorValue.slice(0, selectionStart).lastIndexOf("\n");
			targetIndex = lastNextLineCharIndex + 1;
		}

		if (atLineStart === true) {
			let newText = editorValue;

			if (editorValue.slice(targetIndex).startsWith(text)) {
				newText = `${editorValue.slice(0, targetIndex)}${editorValue.slice(targetIndex + text.length)}`;
				setLastSelectionRange(selectionStart - text.length);
			} else {
				newText = `${editorValue.slice(0, targetIndex)}${text}${editorValue.slice(targetIndex)}`;
				setLastSelectionRange(selectionStart + text.length);
			}

			seteditorValue(newText);
			editorTextarea.current.focus();
		} else {
			const textFragments = text.split(textSeparatorChar);
			const editorValueFragments = [editorValue.slice(0, targetIndex), editorValue.slice(targetIndex)];
			let newText = editorValue;

			if (editorValueFragments[0].endsWith(textFragments[0]) && editorValueFragments[1].startsWith(textFragments[0])) {
				newText = `${editorValue.slice(0, targetIndex - textFragments[0].length)}${editorValue.slice(targetIndex + textFragments[1].length)}`;
				setLastSelectionRange(selectionStart - textFragments[0].length);
			} else {
				newText = `${editorValue.slice(0, targetIndex)}${textFragments.join("")}${editorValue.slice(targetIndex)}`;
				setLastSelectionRange(selectionStart + textFragments[0].length);
			}

			seteditorValue(newText);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (lastSelectionRange !== null) {
			console.log(lastSelectionRange);
			setCursorPosition(editorTextarea.current, lastSelectionRange);
			setLastSelectionRange(null);
		}
	}, [editorValue]);

	return (
		<div className="w-full flex flex-col items-start justify-center gap-1">
			{/* TOOLBAR */}
			<div className="w-full flex flex-wrap items-center justify-between gap-1">
				<div className="flex items-center justify-start gap-2 flex-wrap">
					<IconButton
						tooltipContent={"Heading 1"}
						disabled={previewOn}
						onClick={() => {
							toggleTextAtCursorsLine("# ", true);
						}}
					>
						<Heading1Icon className="w-5 h-5" />
					</IconButton>
					<IconButton
						tooltipContent={"Heading 2"}
						disabled={previewOn}
						onClick={() => {
							toggleTextAtCursorsLine("## ", true);
						}}
					>
						<Heading2Icon className="w-5 h-5" />
					</IconButton>
					<IconButton
						tooltipContent={"Heading 3"}
						disabled={previewOn}
						onClick={() => {
							toggleTextAtCursorsLine("### ", true);
						}}
					>
						<Heading3Icon className="w-5 h-5" />
					</IconButton>
					<Separator />
					<IconButton
						tooltipContent={"Bold"}
						disabled={previewOn}
						onClick={() => {
							toggleTextAtCursorsLine(`**${textSeparatorChar}**`);
						}}
					>
						<BoldIcon className="w-5 h-5" />
					</IconButton>
					<IconButton
						tooltipContent={"Italic"}
						disabled={previewOn}
						onClick={() => {
							toggleTextAtCursorsLine(`_${textSeparatorChar}_`);
						}}
					>
						<FontItalicIcon className="w-5 h-5" />
					</IconButton>
					<IconButton tooltipContent={"Strikethrough"} disabled={previewOn}>
						<StrikethroughIcon className="w-5 h-5" />
					</IconButton>
					<IconButton tooltipContent={"Code"} disabled={previewOn}>
						<CodeIcon className="w-5 h-5" />
					</IconButton>
					<IconButton tooltipContent={"Spoiler"} disabled={previewOn}>
						<EyeScanIcon className="w-4 h-4" />
					</IconButton>
					<Separator />
					<IconButton tooltipContent={"Bulleted list"} disabled={previewOn}>
						<BulletedListIcon className="w-5 h-5" />
					</IconButton>
					<IconButton tooltipContent={"Numbered list"} disabled={previewOn}>
						<NumberedListIcon className="w-5 h-5" />
					</IconButton>
					<IconButton tooltipContent={"Quote"} disabled={previewOn}>
						<QuoteIcon className="w-5 h-5" />
					</IconButton>
					<Separator />
					<IconButton tooltipContent={"Link"} disabled={previewOn}>
						<ChainIcon className="w-4 h-4" />
					</IconButton>
					<IconButton tooltipContent={"Image"} disabled={previewOn}>
						<ImageIcon className="w-4 h-4" />
					</IconButton>
					<IconButton tooltipContent={"Video"} disabled={previewOn}>
						<VideoIcon className="w-5 h-5" />
					</IconButton>
				</div>
				<div className="flex items-center justify-center gap-2">
					<Switch id="markdown-editor-preview-toggle-switch" checked={previewOn} onCheckedChange={setPreviewOn} />
					<Label htmlFor="markdown-editor-preview-toggle-switch" className="text-foreground-muted">
						Preview
					</Label>
				</div>
			</div>

			<div className="w-full flex items-center justify-center mt-2">
				{/* Editor area */}
				{previewOn === false ? (
					<div className="w-full flex flex-col items-center justify-center gap-2">
						<Textarea
							placeholder={placeholder}
							className="w-full resize-y min-h-80 font-mono text-base rounded-lg"
							ref={editorTextarea}
							value={editorValue}
							onChange={(e) => {
								seteditorValue(e.target.value);
							}}
							spellCheck={false}
						/>

						<div className="w-full flex items-center justify-start text-foreground-muted gap-2 mt-2">
							<InfoCircledIcon className="w-4 h-4" />
							<p>
								You can use{" "}
								<a
									href="https://www.markdownguide.org/basic-syntax/"
									className=" text-blue-600 dark:text-blue-400 hover:brightness-110"
								>
									Markdown format
								</a>{" "}
								here.
							</p>
						</div>
					</div>
				) : (
					<div
						className={cn(
							"w-full flex items-center justify-center border-2 dark:border border-border-hicontrast/50 dark:border-border rounded-lg p-4",
							!editorValue && "min-h-24",
						)}
					>
						<TextBox text={editorValue} />
					</div>
				)}
			</div>
		</div>
	);
};

export default MarkdownEditor;
