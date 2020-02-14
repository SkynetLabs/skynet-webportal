import React, { useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import classNames from 'classnames'

import './CodeExamples.scss'
import Colors from './Colors'
import { python, curl, node, go } from './Code'

export default function CodeExamples() {
  const [active, setActive] = useState(1)

  return (
    <div className="code-examples">
      <ul className="code-examples-tabs">
        <li onClick={() => setActive(1)} className={classNames({ active: active === 1 })}>
          CURL
        </li>
        <li onClick={() => setActive(2)} className={classNames({ active: active === 2 })}>
          Python
        </li>
        <li onClick={() => setActive(3)} className={classNames({ active: active === 3 })}>
          Node.js
        </li>
        <li onClick={() => setActive(4)} className={classNames({ active: active === 4 })}>
          Go
        </li>
      </ul>

      <div className="code-examples-body">
        {active === 1 && (
          <SyntaxHighlighter wrapLines showLineNumbers={true} language="curl" style={Colors}>
            {curl}
          </SyntaxHighlighter>
        )}

        {active === 2 && (
          <SyntaxHighlighter wrapLines showLineNumbers={true} language="python" style={Colors}>
            {python}
          </SyntaxHighlighter>
        )}

        {active === 3 && (
          <SyntaxHighlighter wrapLines showLineNumbers={true} language="node" style={Colors}>
            {node}
          </SyntaxHighlighter>
        )}

        {active === 4 && (
          <SyntaxHighlighter wrapLines showLineNumbers={true} language="go" style={Colors}>
            {go}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  )
}
