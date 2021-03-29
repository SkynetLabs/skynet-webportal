import * as React from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import style from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark";

SyntaxHighlighter.registerLanguage("javascript", js);

const CodeTerminal = () => {
  const codeString = `import { SkynetClient } from "skynet-js";

// create a client
const client = new SkynetClient();

// Assume we have a file from an input form.

async function example() {
  try {
    // upload
    const { skylink } = await client.uploadFile(file);

    // download
    await client.downloadFile(skylink);

    console.log('Download successful');
  } catch (error) {
    console.log(error)
  }
}`;

  return (
    <div className="desktop:max-w-terminal">
      <div className="bg-palette-400 rounded-t space-x-2 px-2">
        <div style={{ height: "11px", width: "11px" }} className="inline-block rounded-full bg-error"></div>
        <div style={{ height: "11px", width: "11px" }} className="inline-block rounded-full bg-warning"></div>
        <div style={{ height: "11px", width: "11px" }} className="inline-block rounded-full bg-primary"></div>
      </div>
      <div className="p-4 bg-palette-500 text-sm" style={{ backgroundColor: "rgb(40, 44, 52)" }}>
        <SyntaxHighlighter language="javascript" showLineNumbers={true} wrapLongLines={true} style={style}>
          {codeString}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

CodeTerminal.propTypes = {};

CodeTerminal.defaultProps = {};

export default CodeTerminal;
