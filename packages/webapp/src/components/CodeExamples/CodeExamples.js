import React, { useState, useContext } from "react";
import classNames from "classnames";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { javascript, go, python, bash } from "react-syntax-highlighter/dist/esm/languages/hljs";
import Colors from "./Colors";
import * as snippets from "./Code";
import "./CodeExamples.scss";
import AppContext from "../../AppContext";

SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("go", go);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("bash", bash);

export default function CodeExamples() {
  const [active, setActive] = useState(1);
  const { apiUrl } = useContext(AppContext);
  const interpolateRegExp = new RegExp("https://siasky.net", "g");
  const interpolateSnippet = (snippet) => snippet.replace(interpolateRegExp, apiUrl);

  return (
    <div className="code-examples">
      <div className="code-examples-tabs">
        <button type="button" onClick={() => setActive(1)} className={classNames({ active: active === 1 })}>
          CURL
        </button>
        <button type="button" onClick={() => setActive(2)} className={classNames({ active: active === 2 })}>
          Python
        </button>
        <button type="button" onClick={() => setActive(3)} className={classNames({ active: active === 3 })}>
          Node.js
        </button>
        <button type="button" onClick={() => setActive(4)} className={classNames({ active: active === 4 })}>
          Go
        </button>
      </div>

      <div className="code-examples-body">
        {active === 1 && (
          <SyntaxHighlighter wrapLines showLineNumbers={true} language="bash" style={Colors}>
            {interpolateSnippet(snippets.curl)}
          </SyntaxHighlighter>
        )}

        {active === 2 && (
          <SyntaxHighlighter wrapLines showLineNumbers={true} language="python" style={Colors}>
            {interpolateSnippet(snippets.python)}
          </SyntaxHighlighter>
        )}

        {active === 3 && (
          <SyntaxHighlighter wrapLines showLineNumbers={true} language="javascript" style={Colors}>
            {interpolateSnippet(snippets.node)}
          </SyntaxHighlighter>
        )}

        {active === 4 && (
          <SyntaxHighlighter wrapLines showLineNumbers={true} language="go" style={Colors}>
            {interpolateSnippet(snippets.go)}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  );
}
