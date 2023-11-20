import figmaHandler from './figmaHandler';

export interface FigmaPluginProps {
  type: string;
  isJSX: boolean;
}

figma.showUI(__html__, { width: 480, height: 600 });

figma.ui.onmessage = (msg: FigmaPluginProps) => {
  if (msg.type === 'show-selection-frame') {
    const nodes = figma.currentPage.selection;
    const htmlText = [];
    nodes.forEach((selectedLayer) => {
      const { html } = figmaHandler.generateHtml(selectedLayer, msg.isJSX);
      htmlText.push(html);
    });

    figma.viewport.scrollAndZoomIntoView(nodes);
    figma.ui.postMessage({
      type: 'show-selection-frame',
      message: `${htmlText.join('\n')}`,
    });
  } else if (msg.type === 'close') {
    figma.closePlugin();
  }
};
