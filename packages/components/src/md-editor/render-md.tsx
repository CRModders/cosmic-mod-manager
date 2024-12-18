// Coding
import { createURLSafeSlug } from "@app/utils/string";
import hljs from "highlight.js/lib/core";
import diff from "highlight.js/lib/languages/diff";
// Configs
import gradle from "highlight.js/lib/languages/gradle";
import groovy from "highlight.js/lib/languages/groovy";
import ini from "highlight.js/lib/languages/ini";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import kotlin from "highlight.js/lib/languages/kotlin";
import lua from "highlight.js/lib/languages/lua";
import properties from "highlight.js/lib/languages/properties";
import python from "highlight.js/lib/languages/python";
import scala from "highlight.js/lib/languages/scala";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";
import { useEffect, useMemo } from "react";
// Scripting
import { useNavigate } from "~/ui/link";
import { cn } from "~/utils";
import { configureXss, md } from "./parse-md";

/* REGISTRATION */
// Scripting
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("lua", lua);
// Coding
hljs.registerLanguage("java", java);
hljs.registerLanguage("kotlin", kotlin);
hljs.registerLanguage("scala", scala);
hljs.registerLanguage("groovy", groovy);
// Configs
hljs.registerLanguage("gradle", gradle);
hljs.registerLanguage("json", json);
hljs.registerLanguage("ini", ini);
hljs.registerLanguage("diff", diff);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("properties", properties);

/* ALIASES */
// Scripting
hljs.registerAliases(["js"], { languageName: "javascript" });
hljs.registerAliases(["ts"], { languageName: "typescript" });
hljs.registerAliases(["py"], { languageName: "python" });
// Coding
hljs.registerAliases(["kt"], { languageName: "kotlin" });
hljs.registerAliases(["diff", "patch"], { languageName: "diff" });
// Configs
hljs.registerAliases(["json5"], { languageName: "json" });
hljs.registerAliases(["toml"], { languageName: "ini" });
hljs.registerAliases(["yml"], { languageName: "yaml" });
hljs.registerAliases(["html", "htm", "xhtml", "mcui", "fxml"], { languageName: "xml" });

export const renderHighlightedString = (string: string, urlModifier?: (url: string) => string) =>
    configureXss(urlModifier).process(
        md({
            highlight: (str: string, lang: string) => {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(str, { language: lang }).value;
                    } catch (__) {}
                }

                return "";
            },
        }).render(string),
    );

interface Props {
    text: string;
    className?: string;
    divElem?: boolean;
    addIdToHeadings?: boolean;
    urlModifier?: (url: string) => string;
}

export function MarkdownRenderBox({ text, className, divElem, addIdToHeadings = true, urlModifier }: Props) {
    const navigate = useNavigate();

    // Use React router to handle internal links
    function handleNavigate(e: MouseEvent) {
        try {
            if (!(e.target instanceof HTMLAnchorElement)) return;
            const target = e.target as HTMLAnchorElement;
            const targetUrl = new URL(target.href);

            if (target.getAttribute("href")?.startsWith("#")) {
                e.preventDefault();
                navigate(`${target.pathname}${target.search}${target.hash}`, { preventScrollReset: true });
                return;
            }

            const targetHost = targetUrl.hostname;
            const currHost = window.location.hostname;

            if (![currHost, `www.${currHost}`].includes(targetHost)) return;

            e.preventDefault();
            navigate(`${target.pathname}${target.search}`);
        } catch {}
    }

    useEffect(() => {
        const mdBox = document.querySelector(".markdown-body") as HTMLDivElement | undefined;
        if (!mdBox) return;

        mdBox.addEventListener("click", handleNavigate);
        return () => {
            mdBox.removeEventListener("click", handleNavigate);
        };
    }, []);

    const formattedText = useMemo(() => {
        if (addIdToHeadings !== true) return text;

        // Replace heading markdown with html tags and add id to them
        const parts = text.split("\n");
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (!isHeading(part)) continue;

            const headingContent = parseHeadingContent(part);
            const id = createURLSafeSlug(headingContent).value;
            if (!id) continue;

            const anchor = `<a class="anchor" title="${headingContent}" href="#${id}">#</a>`;

            const headingParts = part.split("# ");
            const headingType = parseMdHeading(`#${headingParts[0]}`);
            const heading = `<${headingType} id="${id}">${headingParts[1]} ${anchor}</${headingType}>`;
            parts[i] = heading;
        }

        return parts.join("\n");
    }, [text]);

    if (divElem === true) {
        return (
            <div
                className={cn("w-full overflow-auto markdown-body thin-scrollbar", className)}
                // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                dangerouslySetInnerHTML={{ __html: renderHighlightedString(formattedText, urlModifier) }}
            />
        );
    }

    return (
        <section
            className={cn("w-full overflow-auto markdown-body thin-scrollbar", className)}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
            dangerouslySetInnerHTML={{ __html: renderHighlightedString(formattedText, urlModifier) }}
        />
    );
}

export default MarkdownRenderBox;

function isHeading(str: string) {
    if (str.startsWith("# ") || str.startsWith("## ") || str.startsWith("### ")) return true;

    return false;
}

function parseHeadingContent(str: string) {
    try {
        let _str = str;
        if (_str.startsWith("#")) {
            const hashIndex = _str.indexOf("# ");
            _str = _str.slice(hashIndex + 2);
        }
        // Remove dots
        _str = _str.replaceAll(".", "");

        // Remove leading numbers
        _str = _str.replace(/^\d+/, "");

        return _str.trim();
    } catch (error) {
        return "";
    }
}

function parseMdHeading(str: string) {
    switch (str.trim()) {
        case "#":
            return "h1";

        case "##":
            return "h2";

        case "###":
            return "h3";

        case "####":
            return "h4";

        case "#####":
            return "h5";

        case "######":
            return "h6";

        default:
            return "p";
    }
}
