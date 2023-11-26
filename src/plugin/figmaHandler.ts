function formatJSX(key: string) {
  return key.replace('-', '_');
}

async function generateStyle(layer: SceneNode, isJSX: boolean, isOuter: boolean) {
  let cssText = `style=${isJSX ? '{{' : '"'}`;
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

  cssText += isJSX ? '}}' : '"';
  return cssText;
}

async function generateHtml(layer: SceneNode, isJSX: boolean, isOuter: boolean) {
  let html = '';

  const cssText = await generateStyle(layer, isJSX, isOuter);

  html += `<div style=${isJSX ? '{{' : '"'}${cssText}${isJSX ? '}}' : '"'}>`;

  switch (layer.type) {
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
    case 'INSTANCE':
      break;
    case 'RECTANGLE':
      break;
    case 'VECTOR':
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
