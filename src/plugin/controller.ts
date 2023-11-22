import figmaHandler from './figmaHandler';

export interface FigmaPluginProps {
  type: string;
  isJSX: boolean;
}

figma.showUI(__html__, { width: 480, height: 600 });

figma.ui.onmessage = async (msg: FigmaPluginProps) => {
  if (msg.type === 'show-selection-frame') {
    const nodes = figma.currentPage.selection;

    const htmlText = await Promise.all(
      nodes.map(async (selectedLayer, index) => {
        const { html } = await figmaHandler.generateHtml(selectedLayer, msg.isJSX, index === 0);
        return html;
      })
    );

    figma.viewport.scrollAndZoomIntoView(nodes);
    figma.ui.postMessage({
      type: 'show-selection-frame',
      message: `${htmlText.join('\n')}`,
    });
  } else if (msg.type === 'close') {
    figma.closePlugin();
  }
};
