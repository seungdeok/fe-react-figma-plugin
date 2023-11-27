import React, { Children, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import format from 'html-format';
import { materialDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import '../styles/ui.css';

enum Renders {
  HTML = 'HTML',
  JSX = 'JSX',
}

type RenderType = Renders[keyof Renders];

function App() {
  const [renderType, setRenderType] = useState<RenderType>(Renders.HTML);
  const [htmlStr, setHtmlStr] = useState('');
  const onShow = (type: RenderType) => () => {
    setRenderType(type);
    parent.postMessage({ pluginMessage: { type: 'show-selection-frame', isJSX: type === Renders.JSX } }, '*');
  };

  const onCopy = () => {
    if (!htmlStr) return;
    const textarea = document.createElement('textarea');
    textarea.value = htmlStr;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';

    document.body.appendChild(textarea);

    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNode(textarea);
    selection.removeAllRanges();
    selection.addRange(range);

    textarea.select();
    document.execCommand('copy');

    document.body.removeChild(textarea);
    selection.removeAllRanges();
  };

  React.useEffect(() => {
    parent.postMessage({ pluginMessage: { type: 'show-selection-frame', isJSX: false } }, '*');
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      if (type === 'show-selection-frame') {
        setHtmlStr(message);
      }
    };
  }, []);

  return (
    <div>
      <h2>Select Frame</h2>
      <div>
        {Children.map([Renders.HTML, Renders.JSX], (label) => (
          <button type="button" className={`${renderType === label ? 'active' : ''}`} onClick={onShow(label)}>
            {label}
          </button>
        ))}
      </div>
      <div className="left-wrap">
        <button type="button" onClick={onCopy}>
          Copy
        </button>
      </div>
      <div>
        <SyntaxHighlighter language="html" style={materialDark}>
          {format(htmlStr)}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default App;
