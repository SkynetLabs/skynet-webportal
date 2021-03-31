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
    <div>
      <div className="bg-palette-400 rounded-t space-x-2 px-2" style={{ width: "540px" }}>
        <div className="circle bg-error"></div>
        <div className="circle bg-warning"></div>
        <div className="circle bg-primary"></div>
      </div>
      <div className="p-4 bg-palette-500 text-sm" style={{ backgroundColor: "rgb(40, 44, 52)" }}>
        <SyntaxHighlighter language="javascript" showLineNumbers={true} style={style}>
          {codeString}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

CodeTerminal.propTypes = {};

CodeTerminal.defaultProps = {};

export default CodeTerminal;
