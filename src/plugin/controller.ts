import figmaHandler from './figmaHandler';

export interface FigmaPluginProps {
  type: string;
  isJSX: boolean;
}

async function main(msg?: FigmaPluginProps) {
  const nodes = figma.currentPage.selection;

  const htmlText = await Promise.all(
    nodes.map(async (selectedLayer, index) => {
      const { html } = await figmaHandler.generateHtml(selectedLayer, msg ? msg.isJSX : false, index === 0);
      return html;
    })
  );

  figma.ui.postMessage({
    type: 'show-selection-frame',
    message: `${htmlText.join('\n')}`,
  });
}

figma.showUI(__html__, { width: 480, height: 600 });

figma.on('selectionchange', () => {
  main();
});

figma.ui.onmessage = async (msg: FigmaPluginProps) => {
  if (msg.type === 'show-selection-frame') {
    main(msg);
  } else if (msg.type === 'close') {
    figma.closePlugin();
  }
};
