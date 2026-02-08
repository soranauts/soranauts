import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

/**
 * Filter out nodes that don't represent "reading" content:
 * - SourcesList component children (bibliography entries)
 * - Code blocks (fenced code)
 */
function filterReadableNodes(tree) {
  return {
    ...tree,
    children: tree.children.filter(node => {
      // Exclude fenced code blocks
      if (node.type === 'code') return false;
      
      // Exclude MDX components that contain non-reading content
      if (
        node.type === 'mdxJsxFlowElement' &&
        node.name === 'SourcesList'
      ) return false;
      
      return true;
    })
  };
}

export function readingTimeRemarkPlugin() {
  return function (tree, file) {
    const readableTree = filterReadableNodes(tree);
    const textOnPage = toString(readableTree);
    const readingTime = Math.ceil(getReadingTime(textOnPage).minutes);

    file.data.astro.frontmatter.readingTime = readingTime;
  };
}

export function responsiveTablesRehypePlugin() {
  return function (tree) {
    if (!tree.children) return;

    for (let i = 0; i < tree.children.length; i++) {
      const child = tree.children[i];

      if (child.type === 'element' && child.tagName === 'table') {
        const wrapper = {
          type: 'element',
          tagName: 'div',
          properties: {
            style: 'overflow:auto',
          },
          children: [child],
        };

        tree.children[i] = wrapper;

        i++;
      }
    }
  };
}
