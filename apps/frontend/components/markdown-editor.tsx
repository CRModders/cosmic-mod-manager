import "@/components/highlightjs.css";
import { cn } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
	CodeIcon,
	Cross2Icon,
	FontItalicIcon,
	ImageIcon,
	InfoCircledIcon,
	PlusIcon,
	VideoIcon,
} from "@radix-ui/react-icons";
import { isValidUrl } from "@root/lib/utils";
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
	UnderlineIcon,
} from "./icons";
import MarkdownRenderBox from "./md-render-box";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "./ui/dialog";
import { FormErrorMessage } from "./ui/form-message";
import { Input } from "./ui/input";
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
function setCursorPosition(textarea: any, position: number[]) {
	try {
		if (textarea.setSelectionRange) {
			textarea.focus();
			textarea.setSelectionRange(position[0], position[1]);
		} else if (textarea.createTextRange) {
			const range = textarea.createTextRange();
			range.collapse(true);
			range.moveEnd("character", position[0]);
			range.moveStart("character", position[1]);
			range.select();
		}
	} catch (error) {
		console.error(error);
	}
}

function getTextareaSelectedText(textarea: HTMLTextAreaElement) {
	const selectionStart = textarea.selectionStart;
	const selectionEnd = textarea.selectionEnd;

	return textarea.value.slice(selectionStart, selectionEnd) || "";
}

const getYoutubeIframe = (url: string, _altText: string, _isPreview = false) => {
	const youtubeRegex =
		/^(?:https?:)?(?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9_-]{7,15})(?:[?&][a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+)*$/;
	const match = youtubeRegex.exec(url);
	if (match) {
		return `<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/${match[1]}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>${textSeparatorChar}`;
	}
	return "";
};

type Props = {
	editorValue: string;
	setEditorValue: React.Dispatch<React.SetStateAction<string>>;
	placeholder?: string;
};

const textSeparatorChar = "{|}";

const MarkdownEditor = ({ editorValue, setEditorValue, placeholder }: Props) => {
	const [previewOn, setPreviewOn] = useState(false);
	const editorTextarea = useRef<HTMLTextAreaElement>(null);
	const [lastSelectionRange, setLastSelectionRange] = useState<number[] | null>();
	const [wordWrap, setWordWrap] = useState(false);
	const [keyboardShortcutsModalOpen, setKeyboardShortcutsModalOpen] = useState(false);

	const toggleTextAtCursorsLine = (
		text: string,
		atLineStart?: boolean,
		actionType?: "ADD_FRAGMENT" | "DELETE_FRAGMENT" | "",
		replaceSelectedText: string | null = null,
	) => {
		if (editorTextarea.current?.selectionStart === undefined) return;
		// selectionStart and selectionEnd index, if nothing's selected both will be the same
		const selectionStart = editorTextarea.current.selectionStart;
		const selectionEnd = editorTextarea.current.selectionEnd;

		// If the text has to be added at the line start of around the selection
		if (atLineStart === true) {
			const firstSelectedLineIndex = editorValue.slice(0, selectionStart).lastIndexOf("\n") + 1; // Start index of the first selected line
			const linesBeforeSelection = editorValue.slice(0, firstSelectedLineIndex); // All the other ines before first selected line
			const textAfterSelection = editorValue.slice(selectionEnd); // All the other text after selection
			const selectedLines = `${editorValue.slice(firstSelectedLineIndex, selectionEnd)}`.split("\n"); // All of the selected lines

			let action: "ADD_FRAGMENT" | "DELETE_FRAGMENT" | "" = actionType || "";
			if (!action) {
				// If the first line starts with that text regardless of the other lines, this will be a delete action
				if (selectedLines[0].startsWith(text)) action = "DELETE_FRAGMENT";
				else action = "ADD_FRAGMENT";
			}

			let newSelectedLinesText = "";
			if (action === "ADD_FRAGMENT") {
				// Loop through each line and add the text at the start of each, then add them up
				for (const line of selectedLines) {
					newSelectedLinesText = `${newSelectedLinesText}${text}${line}\n`;
				}

				setLastSelectionRange([selectionStart + text.length, selectionEnd + text.length * selectedLines.length]);
			} else if (action === "DELETE_FRAGMENT") {
				// Same way, loop through each line, but check if the text is at the line start before removing anything
				let charactersDeletedCount = 0;
				for (const line of selectedLines) {
					if (line.startsWith(text)) {
						charactersDeletedCount += text.length;
						newSelectedLinesText += `${line.slice(text.length)}\n`;
					} else {
						newSelectedLinesText += `${line}\n`;
					}
				}

				// If the selection is upto the first character of that line, make sure not to decrease the startIndex
				if (editorValue[selectionStart - 1] === "\n" || selectionStart === 0) {
					setLastSelectionRange([selectionStart, selectionEnd - charactersDeletedCount]);
				} else {
					setLastSelectionRange([selectionStart - text.length, selectionEnd - charactersDeletedCount]);
				}
			}
			setEditorValue(`${linesBeforeSelection}${newSelectedLinesText.slice(0, -1)}${textAfterSelection}`);
		} else {
			const textFragments = text.split(textSeparatorChar);
			const editorValueFragments = [
				editorValue.slice(0, selectionStart),
				editorValue.slice(selectionStart, selectionEnd),
				editorValue.slice(selectionEnd),
			];

			let newText = editorValue;
			if (editorValueFragments[0].endsWith(textFragments[0]) && editorValueFragments[2].startsWith(textFragments[1])) {
				newText = `${editorValue.slice(0, selectionStart - textFragments[0].length)}${editorValueFragments[1] ? editorValueFragments[1] : ""}${editorValue.slice(selectionEnd + textFragments[1].length)}`;
				setLastSelectionRange([selectionStart - textFragments[0].length, selectionEnd - textFragments[0].length]);
			} else {
				newText = `${editorValue.slice(0, selectionStart)}${textFragments[0]}${replaceSelectedText ? replaceSelectedText : editorValueFragments[1] ? editorValueFragments[1] : ""}${textFragments[1]}${editorValue.slice(selectionEnd)}`;

				if (replaceSelectedText !== null) {
					setLastSelectionRange([
						selectionStart + textFragments[0].length,
						selectionEnd - editorValueFragments[1].length + replaceSelectedText.length + textFragments[0].length,
					]);
				} else {
					setLastSelectionRange([selectionStart + textFragments[0].length, selectionEnd + textFragments[0].length]);
				}
			}

			setEditorValue(newText);
		}

		editorTextarea.current.focus();
	};

	const Bold = () => {
		toggleTextAtCursorsLine(`**${textSeparatorChar}**`);
	};
	const Italic = () => {
		toggleTextAtCursorsLine(`_${textSeparatorChar}_`);
	};
	const Underline = () => {
		toggleTextAtCursorsLine(`<u>${textSeparatorChar}</u>`);
	};
	const UnorderedList = () => {
		toggleTextAtCursorsLine("- ", true);
	};
	const Quote = () => {
		toggleTextAtCursorsLine("> ", true);
	};
	const CodeBlock = () => {
		toggleTextAtCursorsLine(`\`\`\`\n${textSeparatorChar}\n\`\`\``);
	};
	const Spoiler = () => {
		toggleTextAtCursorsLine(`<details>\n<summary>Spoiler</summary>\n\n${textSeparatorChar}\n\n</details>`);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (lastSelectionRange?.length) {
			setCursorPosition(editorTextarea.current, lastSelectionRange);
			setLastSelectionRange(null);
		}
	}, [editorValue]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		let blockKeydownEvent = false;
		const handler = (e: KeyboardEvent) => {
			if (e.key === "/" && e.ctrlKey) {
				e.preventDefault();

				if (blockKeydownEvent === true) return;
				blockKeydownEvent = true;
				setKeyboardShortcutsModalOpen(!keyboardShortcutsModalOpen);
			}
		};

		const resetKeyDownEventBlocking = () => {
			blockKeydownEvent = false;
		};

		document.addEventListener("keydown", handler);
		document.addEventListener("keyup", resetKeyDownEventBlocking);
		() => {
			document.removeEventListener("keydown", handler);
			document.removeEventListener("keyup", resetKeyDownEventBlocking);
		};
	}, []);

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
					<IconButton tooltipContent={"Bold"} disabled={previewOn} onClick={Bold}>
						<BoldIcon className="w-5 h-5" />
					</IconButton>
					<IconButton tooltipContent={"Italic"} disabled={previewOn} onClick={Italic}>
						<FontItalicIcon className="w-5 h-5" />
					</IconButton>
					<IconButton tooltipContent={"Underline"} disabled={previewOn} onClick={Underline}>
						<UnderlineIcon className="w-5 h-5" />
					</IconButton>
					<IconButton
						tooltipContent={"Strikethrough"}
						disabled={previewOn}
						onClick={() => {
							toggleTextAtCursorsLine(`~~${textSeparatorChar}~~`);
						}}
					>
						<StrikethroughIcon className="w-5 h-5" />
					</IconButton>
					<IconButton tooltipContent={"Code"} disabled={previewOn} onClick={CodeBlock}>
						<CodeIcon className="w-5 h-5" />
					</IconButton>
					<IconButton tooltipContent={"Spoiler"} disabled={previewOn} onClick={Spoiler}>
						<EyeScanIcon className="w-4 h-4" />
					</IconButton>
					<Separator />
					<IconButton tooltipContent={"Bulleted list"} disabled={previewOn} onClick={UnorderedList}>
						<BulletedListIcon className="w-5 h-5" />
					</IconButton>
					<IconButton
						tooltipContent={"Numbered list"}
						disabled={previewOn}
						onClick={() => {
							toggleTextAtCursorsLine("1. ", true);
						}}
					>
						<NumberedListIcon className="w-5 h-5" />
					</IconButton>
					<IconButton tooltipContent={"Quote"} disabled={previewOn} onClick={Quote}>
						<QuoteIcon className="w-5 h-5" />
					</IconButton>
					<Separator />
					<LinkInsertionModal
						modalTitle="Insert link"
						getMarkdownString={(url: string, altText: string, isPreview?: boolean) => {
							let selectedText = "";
							if (editorTextarea.current) selectedText = getTextareaSelectedText(editorTextarea.current);
							const linkLabel = altText || selectedText || url;
							return `[${isPreview === true ? linkLabel : ""}${textSeparatorChar}](${url})`;
						}}
						insertFragmentFunc={(markdownString: string, url: string, altText: string) => {
							let selectedText = "";
							if (editorTextarea.current) selectedText = getTextareaSelectedText(editorTextarea.current);
							const linkLabel = altText || selectedText || url;
							toggleTextAtCursorsLine(markdownString, false, "ADD_FRAGMENT", linkLabel);
						}}
						altTextInputLabel="Label"
						altTextInputPlaceholder="Enter label..."
						urlInputLabel="URL"
						urlInputPlaceholder="Enter the link's URL..."
						isAltTextRequired={false}
						altTextInputVisible={true}
					>
						<IconButton tooltipContent={"Link"} disabled={previewOn}>
							<ChainIcon className="w-4 h-4" />
						</IconButton>
					</LinkInsertionModal>

					<LinkInsertionModal
						modalTitle="Insert image"
						getMarkdownString={(url: string, altText: string, isPreview = false) => {
							let selectedText = "";
							if (editorTextarea.current) selectedText = getTextareaSelectedText(editorTextarea.current);
							const linkLabel = altText || selectedText || url;
							return `![${isPreview ? linkLabel : ""}${textSeparatorChar}](${url})`;
						}}
						insertFragmentFunc={(markdownString: string, url: string, altText: string) => {
							let selectedText = "";
							if (editorTextarea.current) selectedText = getTextareaSelectedText(editorTextarea.current);
							const linkLabel = altText || selectedText || url;
							toggleTextAtCursorsLine(markdownString, false, "ADD_FRAGMENT", linkLabel);
						}}
						altTextInputLabel="Description (alt text)"
						altTextInputPlaceholder="Describe the image..."
						urlInputLabel="URL"
						urlInputPlaceholder="Enter the image URL..."
						isAltTextRequired={false}
						altTextInputVisible={true}
					>
						<IconButton tooltipContent={"Image"} disabled={previewOn}>
							<ImageIcon className="w-4 h-4" />
						</IconButton>
					</LinkInsertionModal>

					<LinkInsertionModal
						modalTitle="Insert YouTube video"
						getMarkdownString={getYoutubeIframe}
						insertFragmentFunc={(markdownString: string, _url: string, _altText: string) => {
							toggleTextAtCursorsLine(markdownString, false, "ADD_FRAGMENT");
						}}
						altTextInputLabel=""
						altTextInputPlaceholder=""
						urlInputLabel="YouTube video URL"
						urlInputPlaceholder="Enter YouTube video URL"
						isAltTextRequired={false}
						altTextInputVisible={false}
					>
						<IconButton tooltipContent={"Video"} disabled={previewOn}>
							<VideoIcon className="w-5 h-5" />
						</IconButton>
					</LinkInsertionModal>
				</div>
				<div className="flex items-center justify-center gap-2">
					<Switch id="markdown-editor-preview-toggle-switch" checked={previewOn} onCheckedChange={setPreviewOn} />
					<Label htmlFor="markdown-editor-preview-toggle-switch" className="text-foreground-muted">
						Preview
					</Label>
				</div>
			</div>

			<div className="w-full flex gap-2 items-start justify-center mt-2">
				{/* Editor area */}
				<div className={cn("w-full flex flex-col items-center justify-center gap-2", previewOn === true && "hidden")}>
					<Textarea
						placeholder={placeholder}
						className={cn(
							"w-full resize-y min-h-[16rem] h-[32rem] text-base font-mono rounded-lg",
							wordWrap === true ? "overflow-x-auto whitespace-nowrap" : "break-words",
						)}
						ref={editorTextarea}
						value={editorValue}
						onResizeCapture={(e) => console.log(e)}
						onChange={(e) => {
							setEditorValue(e.target.value);
						}}
						onKeyDown={(e) => {
							if (e.key === "Escape") return editorTextarea.current?.blur();

							if (e.key === "Tab") {
								e.preventDefault();

								if (e.shiftKey === true) {
									toggleTextAtCursorsLine("  ", true, "DELETE_FRAGMENT");
								} else {
									toggleTextAtCursorsLine("  ", true, "ADD_FRAGMENT");
								}
							}

							if (e.altKey) {
								e.preventDefault();
								if (e.key === "z") setWordWrap((prev) => !prev);
								else if (e.key === "b") Bold();
								else if (e.key === "i") Italic();
								else if (e.key === "u") Underline();
								else if (e.key === "c") CodeBlock();
								else if (e.key === "s") Spoiler();
								else if (e.key === "q") Quote();
								else if (e.key === "l") UnorderedList();
							}

							if (e.ctrlKey) {
								if (e.key === "b") Bold();
								if (e.key === "i") Italic();
								if (e.key === "u") {
									e.preventDefault();
									Underline();
								}
							}
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

					<div className="w-full flex items-center justify-start">
						<KeyboardShortcutsDialog open={keyboardShortcutsModalOpen} setOpen={setKeyboardShortcutsModalOpen}>
							<div className="w-full flex gap-2 items-center justify-start markdown-body">
								<InfoCircledIcon className="w-4 h-4" />
								<p className="cursor-pointer text-base">
									<kbd>ctrl</kbd> + <kbd>/</kbd> to view keyboard shortcuts
								</p>
							</div>
						</KeyboardShortcutsDialog>
					</div>
				</div>

				{previewOn && (
					<div
						className={cn(
							"w-full flex items-center justify-center border-2 dark:border border-border-hicontrast/50 dark:border-border rounded-lg p-4",
							!editorValue && "min-h-24",
						)}
					>
						<MarkdownRenderBox text={editorValue} />
					</div>
				)}
			</div>
		</div>
	);
};

export default MarkdownEditor;

const EditorModal = ({
	title,
	trigger,
	children,
	modalOpen,
	setModalOpen,
	insertFragmentFunc,
}: {
	title: string;
	modalOpen: boolean;
	setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	trigger: React.ReactNode;
	children: React.ReactNode;
	insertFragmentFunc: () => void;
}) => {
	return (
		<Dialog open={modalOpen} onOpenChange={setModalOpen}>
			<DialogTrigger asChild>
				<div className="flex items-center justify-center">{trigger}</div>
			</DialogTrigger>
			<DialogContent className="">
				<DialogHeader>
					<DialogTitle className="text-xl text-foreground-muted font-semibold">{title}</DialogTitle>
				</DialogHeader>
				{children}

				<DialogFooter>
					<div className="w-full flex flex-wrap gap-2 items-center justify-end">
						<DialogClose asChild>
							<Button className="gap-2" variant={"secondary"}>
								<Cross2Icon className="w-4 h-4" />
								<span>Cancel</span>
							</Button>
						</DialogClose>

						<Button
							className="bg-accent-bg hover:bg-accent-bg/85 dark:text-foreground gap-2"
							onClick={() => {
								insertFragmentFunc();
								setModalOpen(false);
							}}
						>
							<PlusIcon className="w-5 h-5" />
							<span>Insert</span>
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

const LinkInsertionModal = ({
	modalTitle,
	insertFragmentFunc,
	getMarkdownString,
	altTextInputLabel,
	altTextInputPlaceholder,
	urlInputLabel,
	urlInputPlaceholder,
	isAltTextRequired,
	altTextInputVisible,
	children,
}: {
	modalTitle: string;
	altTextInputLabel: string;
	altTextInputPlaceholder: string;
	isAltTextRequired: boolean;
	altTextInputVisible: boolean;
	urlInputLabel: string;
	children: React.ReactNode;
	urlInputPlaceholder: string;
	insertFragmentFunc: (markdownString: string, url: string, altText: string) => void;
	getMarkdownString: (url: string, altText: string, isPreview?: boolean) => string;
}) => {
	const [url, setUrl] = useState("");
	const [urlAltText, setUrlAltText] = useState("");
	const [modalOpen, setModalOpen] = useState(false);
	const [urlValidationError, setUrlValidationError] = useState<string | null>(null);

	useEffect(() => {
		if (modalOpen === false) {
			setUrl("");
			setUrlAltText("");
		}
	}, [modalOpen]);

	useEffect(() => {
		try {
			if (isValidUrl(cleanUrl(url))) setUrlValidationError(null);
			else setUrlValidationError("Invlid URL");
		} catch (error) {
			// @ts-ignore
			setUrlValidationError((error?.message as string) || "");
		}
	}, [url]);

	return (
		<EditorModal
			modalOpen={modalOpen}
			setModalOpen={setModalOpen}
			title={modalTitle}
			insertFragmentFunc={() => {
				if (!url || urlValidationError) return;
				if (isAltTextRequired && !urlAltText) return;

				insertFragmentFunc(getMarkdownString(url, urlAltText, false), url, urlAltText);

				setUrl("");
				setUrlAltText("");
			}}
			trigger={children}
		>
			{altTextInputVisible && (
				<div className="w-full flex flex-col items-start justify-center">
					<Label
						htmlFor="markdown-editor-link-label-input"
						className="flex items-center justify-center text-lg text-foreground/95 font-semibold"
					>
						{altTextInputLabel}{" "}
						{isAltTextRequired && (
							<span className="h-full flex items-start justify-center text-accent-foreground">*</span>
						)}
					</Label>
					<Input
						type="text"
						id="markdown-editor-link-label-input"
						value={urlAltText}
						onChange={(e) => {
							setUrlAltText(e.target.value);
						}}
						placeholder={altTextInputPlaceholder}
						className="w-full"
					/>
				</div>
			)}
			<div className="w-full flex flex-col items-start justify-center">
				<Label
					htmlFor="markdown-editor-link-url-input"
					className="flex items-center justify-center text-lg text-foreground/95 font-semibold"
				>
					{urlInputLabel} <span className="h-full flex items-start justify-center text-accent-foreground">*</span>
				</Label>
				<Input
					id="markdown-editor-link-url-input"
					spellCheck={false}
					type="text"
					value={url}
					onChange={(e) => {
						setUrl(e.target.value);
					}}
					placeholder={urlInputPlaceholder}
					className="w-full"
				/>
			</div>

			{url && urlValidationError ? (
				<FormErrorMessage text={urlValidationError} />
			) : isAltTextRequired && !urlAltText ? (
				<FormErrorMessage text={`${altTextInputLabel} is required!`} />
			) : null}

			<div className="w-full flex flex-col items-start justify-center">
				<span className="text-lg text-foreground-muted font-semibold">Preview</span>
				<div
					tabIndex={-1}
					className={cn(
						"w-full flex items-start justify-start px-4 py-3 border-2 dark:border border-border rounded-lg min-h-24 bg-background-shallow/25",
					)}
				>
					{url && !urlValidationError ? (
						<MarkdownRenderBox text={getMarkdownString(url, urlAltText, true).split(textSeparatorChar).join("")} />
					) : null}
				</div>
			</div>
		</EditorModal>
	);
};

export function cleanUrl(input: string): string {
	let url: URL;

	try {
		url = new URL(input);
	} catch (e) {
		throw new Error("Invalid URL. Make sure the URL is well-formed.");
	}

	// Check for unsupported protocols
	if (url.protocol !== "http:" && url.protocol !== "https:") {
		throw new Error("Unsupported protocol. Use http or https.");
	}

	// If the scheme is "http", automatically upgrade it to "https"
	if (url.protocol === "http:") {
		url.protocol = "https:";
	}

	// Block certain domains for compliance
	const blockedDomains = ["forgecdn"];
	if (blockedDomains.some((domain) => url.hostname.includes(domain))) {
		throw new Error("Invalid URL. This domain is not allowed.");
	}

	return url.toString();
}

const KeyboardShortcutsDialog = ({
	open,
	setOpen,
	children,
}: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; children: React.ReactNode }) => {
	const shortcutsString =
		"|  Action  |  Shortcut  |\n|---|---|\n|  Bold  |  <kbd>ctrl</kbd> <kbd>b</kbd> or <kbd>alt</kbd> <kbd>b</kbd>  |\n|  Italic  |  <kbd>ctrl</kbd> <kbd>i</kbd> or <kbd>alt</kbd> <kbd>i</kbd>  |\n|  Underline  |  <kbd>ctrl</kbd> <kbd>u</kbd> or <kbd>alt</kbd> <kbd>u</kbd>  |\n|  Code  |  <kbd>alt</kbd> <kbd>c</kbd>  |\n|  Spoiler  |  <kbd>alt</kbd> <kbd>s</kbd>  |\n|  Quote  |  <kbd>alt</kbd> <kbd>q</kbd>  |\n|  Bulleted list  |  <kbd>alt</kbd> <kbd>l</kbd>  |";

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild className="flex w-fit items-center justify-start">
				<div>{children}</div>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Keyboard shortcuts</DialogTitle>
				</DialogHeader>
				<div className="w-full flex flex-col items-center justify-center markdown-body">
					<MarkdownRenderBox text={shortcutsString} />
				</div>
			</DialogContent>
		</Dialog>
	);
};
