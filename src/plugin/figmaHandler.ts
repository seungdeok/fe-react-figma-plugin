function generateStyle(layer: SceneNode, isJSX: boolean) {
  let cssText = `style=${isJSX ? '{{' : '"'}`;
  for (const key in layer) {
    const value = layer[key];

    switch (key) {
      case 'width':
        cssText += `width: ${value}px;`;
        break;

      case 'height':
        cssText += `height: ${value}px;`;
        break;

      case 'fills':
        if (value && value.length > 0) {
          const fill = value[0].color;
          if (fill) {
            cssText += `background-color: rgba(${Math.floor(fill.r * 255)}, ${Math.floor(fill.g * 255)}, ${Math.floor(
              fill.b * 255
            )}, ${value[0].opacity});\n`;
          }
        }
        break;
      case 'fontSize':
        cssText += `font-size: ${value}px;`;
        break;

      case 'position':
        cssText += `position: ${value};`;
        break;

      case 'left':
        cssText += `left: ${value}px;`;
        break;

      case 'right':
        cssText += `right: ${value}px;`;
        break;

      case 'top':
        cssText += `top: ${value}px;`;
        break;

      case 'bottom':
        cssText += `bottom: ${value}px;`;
        break;

      case 'borderRadius':
        cssText += `border-radius: ${value}px;`;
        break;

      case 'textAlign':
        cssText += `text-align: ${value};`;
        break;

      case 'color':
        cssText += `color: rgba(${Math.floor(value.r * 255)}, ${Math.floor(value.g * 255)}, ${Math.floor(
          value.b * 255
        )}, 1);`;
        break;

      case 'opacity':
        cssText += `opacity: ${value};`;
        break;

      case 'wordWrap':
        cssText += `word-wrap: ${value ? 'break-word' : 'normal'};`;
        break;

      case 'fontName':
        cssText += `font-family: ${value.family};`;
        break;

      case 'fontWeight':
        cssText += `font-weight: ${value};`;
        break;

      case 'borderTop':
        cssText += `border-top: ${value}px solid;`;
        break;

      case 'borderBottom':
        cssText += `border-bottom: ${value}px solid;`;
        break;

      case 'borderLeft':
        cssText += `border-left: ${value}px solid;`;
        break;

      case 'borderRight':
        cssText += `border-right: ${value}px solid;`;
        break;

      case 'display':
        cssText += `display: ${value};`;
        break;

      case 'justifyContent':
        cssText += `justify-content: ${value};`;
        break;

      case 'alignItems':
        cssText += `align-items: ${value};`;
        break;

      case 'gap':
        cssText += `gap: ${value}px;`;
        break;

      case 'paddingTop':
        cssText += `padding-top: ${value}px;`;
        break;

      case 'paddingBottom':
        cssText += `padding-bottom: ${value}px;`;
        break;

      case 'paddingLeft':
        cssText += `padding-left: ${value}px;`;
        break;

      case 'paddingRight':
        cssText += `padding-right: ${value}px;`;
        break;

      case 'flexDirection':
        cssText += `flex-direction: ${value};`;
        break;

      case 'lineHeight':
        if (typeof value === 'object') {
          if (value.unit === 'PIXELS') {
            cssText += `line-height: ${value.value}px;`;
          }
        } else if (typeof value === 'number') {
          cssText += `line-height: ${value}px;`;
        }
        break;

      default:
        break;
    }
  }

  cssText += isJSX ? '}}' : '"';
  return cssText;
}

function generateHtml(layer: SceneNode, isJSX: boolean) {
  let html = '';

  html += `<div class${isJSX ? 'Name' : ''}="${layer.type.toLowerCase()}"`;

  switch (layer.type) {
    case 'FRAME':
      html += `${generateStyle(layer, isJSX)}>`;
      layer.children.forEach((child) => {
        const childResult = generateHtml(child, isJSX);
        html += childResult.html;
      });
      break;
    case 'TEXT':
      html += `${generateStyle(layer, isJSX)}>`;
      html += layer.characters;
      break;
    case 'INSTANCE':
      html += `${generateStyle(layer, isJSX)}>`;
      break;
    case 'RECTANGLE':
      html += `${generateStyle(layer, isJSX)}>`;
      break;
    case 'VECTOR':
      html += `${generateStyle(layer, isJSX)}>`;
      break;
    case 'GROUP':
      html += `${generateStyle(layer, isJSX)}>`;
      break;
    default:
      break;
  }

  html += `</div>`;

  return { html };
}

export default {
  generateHtml,
  generateStyle,
};
