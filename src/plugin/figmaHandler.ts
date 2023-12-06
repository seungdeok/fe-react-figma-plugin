function formatJSX(key: string) {
  return key.replace('-', '_');
}

const generateClassname = (isJSX: boolean, layerName: string) => {
  return `${isJSX ? 'className' : 'class'}="${layerName.replace(/ /g, '')}`;
};

async function generateStyle(layer: SceneNode, isJSX: boolean, isOuter: boolean) {
  let cssText = '';
  if (isOuter) {
    cssText += `position: relative;`;
  } else {
    cssText += `position: absolute;left: ${layer['x']}px;top: ${layer['y']}px;`;
  }

  const styles = await layer.getCSSAsync();

  for (const key in styles) {
    const value = styles[key];

    if (key === 'width') {
      cssText += `width: ${layer['layoutSizingHorizontal'] === 'FIXED' ? `${layer['width']}px` : '100%'};`;
    } else if (key === 'height') {
      cssText += `height: ${layer['layoutSizingVertical'] === 'FIXED' ? `${layer['height']}px` : '100%'};`;
    } else {
      cssText += `${isJSX ? formatJSX(key) : key}: ${value};`;
    }
  }

  return cssText;
}

async function generateHtml(layer: SceneNode, isJSX: boolean, isOuter: boolean) {
  let html = '';

  const className = generateClassname(isJSX, layer.name);
  const cssText = await generateStyle(layer, isJSX, isOuter);

  html += `<div ${className} style=${isJSX ? '{{' : '"'}${cssText}${isJSX ? '}}' : '"'}>`;

  switch (layer.type) {
    case 'INSTANCE':
      break;
    case 'RECTANGLE':
      break;
    case 'BOOLEAN_OPERATION':
      break;
    case 'FRAME':
      await Promise.all(
        layer.children.map(async (child) => {
          const childResult = await generateHtml(child, isJSX, isOuter);
          html += childResult.html;

          return;
        })
      );
      break;
    case 'TEXT':
      html += layer.characters;
      break;
    case 'VECTOR':
      html += `<svg width="${layer.width}" height="${layer.height}" xmlns="http://www.w3.org/2000/svg"><path d="${
        layer.fillGeometry.length ? layer.fillGeometry[0].data : ''
      }" /></svg>`;
      break;
    case 'GROUP':
      await Promise.all(
        layer.children.map(async (child) => {
          const childResult = await generateHtml(child, isJSX, isOuter);
          html += childResult.html;

          return;
        })
      );
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
