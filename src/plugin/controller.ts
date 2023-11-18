figma.showUI(__html__, { width: 480, height: 600 });

function generateStyle(layer: SceneNode) {
  let cssStyle = 'style="';
  for (const key in layer) {
    const value = layer[key];

    switch (key) {
      case 'width':
        cssStyle += `width: ${value}px;`;
        break;

      case 'height':
        cssStyle += `height: ${value}px;`;
        break;

      case 'fills':
        if (value && value.length > 0) {
          const fill = value[0].color;
          if (fill) {
            cssStyle += `background-color: rgba(${fill.r * 255}, ${fill.g * 255}, ${fill.b * 255}, ${
              value[0].opacity
            });\n`;
          }
        }
        break;
      case 'fontSize':
        cssStyle += `font-size: ${value}px;`;
        break;

      case 'position':
        cssStyle += `position: ${value};`;
        break;

      case 'left':
        cssStyle += `left: ${value}px;`;
        break;

      case 'right':
        cssStyle += `right: ${value}px;`;
        break;

      case 'top':
        cssStyle += `top: ${value}px;`;
        break;

      case 'bottom':
        cssStyle += `bottom: ${value}px;`;
        break;

      case 'borderRadius':
        cssStyle += `border-radius: ${value}px;`;
        break;

      case 'textAlign':
        cssStyle += `text-align: ${value};`;
        break;

      case 'color':
        cssStyle += `color: rgba(${value.r * 255}, ${value.g * 255}, ${value.b * 255}, 1);`;
        break;

      case 'opacity':
        cssStyle += `opacity: ${value};`;
        break;

      case 'wordWrap':
        cssStyle += `word-wrap: ${value ? 'break-word' : 'normal'};`;
        break;

      case 'fontName':
        cssStyle += `font-family: ${value.family};`;
        break;

      case 'fontWeight':
        cssStyle += `font-weight: ${value};`;
        break;

      case 'borderTop':
        cssStyle += `border-top: ${value}px solid;`;
        break;

      case 'borderBottom':
        cssStyle += `border-bottom: ${value}px solid;`;
        break;

      case 'borderLeft':
        cssStyle += `border-left: ${value}px solid;`;
        break;

      case 'borderRight':
        cssStyle += `border-right: ${value}px solid;`;
        break;

      case 'display':
        cssStyle += `display: ${value};`;
        break;

      case 'justifyContent':
        cssStyle += `justify-content: ${value};`;
        break;

      case 'alignItems':
        cssStyle += `align-items: ${value};`;
        break;

      case 'gap':
        cssStyle += `gap: ${value}px;`;
        break;

      case 'paddingTop':
        cssStyle += `padding-top: ${value}px;`;
        break;

      case 'paddingBottom':
        cssStyle += `padding-bottom: ${value}px;`;
        break;

      case 'paddingLeft':
        cssStyle += `padding-left: ${value}px;`;
        break;

      case 'paddingRight':
        cssStyle += `padding-right: ${value}px;`;
        break;

      case 'flexDirection':
        cssStyle += `flex-direction: ${value};`;
        break;

      case 'lineHeight':
        if (typeof value === 'object') {
          if (value.unit === 'PIXELS') {
            cssStyle += `line-height: ${value.value}px;`;
          }
        } else if (typeof value === 'number') {
          cssStyle += `line-height: ${value}px;`;
        }
        break;

      default:
        break;
    }
  }

  cssStyle += '"';
  return cssStyle;
}

function generateHtml(layer: SceneNode) {
  let html = '';

  html += `<div class="${layer.type.toLowerCase()}"`;

  switch (layer.type) {
    case 'FRAME':
      html += `${generateStyle(layer)}>`;
      layer.children.forEach((child) => {
        const childResult = generateHtml(child);
        html += childResult.html;
      });
      break;
    case 'TEXT':
      html += `${generateStyle(layer)}>`;
      html += layer.characters;
      break;
    case 'INSTANCE':
      html += `${generateStyle(layer)}>`;
      break;
    case 'RECTANGLE':
      html += `${generateStyle(layer)}>`;
      break;
    case 'VECTOR':
      html += `${generateStyle(layer)}>`;
      break;
    case 'GROUP':
      html += `${generateStyle(layer)}>`;
      break;
    default:
      break;
  }

  html += `</div>`;

  return { html };
}

figma.ui.onmessage = (msg) => {
  if (msg.type === 'show-selection-frame') {
    const nodes = figma.currentPage.selection;
    const htmlText = [];
    nodes.forEach((selectedLayer) => {
      const { html } = generateHtml(selectedLayer);
      htmlText.push(html);
    });

    figma.viewport.scrollAndZoomIntoView(nodes);
    figma.ui.postMessage({
      type: 'show-selection-frame',
      message: `${htmlText.join('\n')}`,
    });
  }

  // figma.closePlugin();
};
