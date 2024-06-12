import Showdown from "showdown";
import Turndown from "turndown";

const toHTMLConverter = new Showdown.Converter({
  tables: true,
  tasklists: true,
  strikethrough: true,
  simplifiedAutoLink: true,
  openLinksInNewWindow: true,
});

const toHTML = (markdown?: string): string => toHTMLConverter.makeHtml(markdown || "");

const toMarkdownConverter = new Turndown();

const toMarkdown = (html?: string): string => toMarkdownConverter.turndown(html || "");

export { toHTML, toMarkdown };
