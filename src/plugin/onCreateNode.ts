import {CreateNodeArgs, Node} from 'gatsby';
import {FileSystemNode, PluginOptions, LocaleNodeInput} from '../types';

export function unstable_shouldOnCreateNode({node}: {node: Node}) {
  // We only care about JSON content.
  return node.internal.mediaType === `application/json`;
}

export const onCreateNode = async (
  {
    node,
    actions,
    loadNodeContent,
    createNodeId,
    createContentDigest,
    reporter
  }: CreateNodeArgs<FileSystemNode>,
  {localeJsonSourceName = 'locale'}: PluginOptions
) => {
  if (!unstable_shouldOnCreateNode({node})) {
    return;
  }

  const {
    absolutePath,
    internal: {mediaType, type},
    sourceInstanceName,
    relativeDirectory,
    name,
    id
  } = node;

  // Currently only support file resources
  if (type !== 'File') {
    return;
  }

  // User is not using this feature
  if (localeJsonSourceName == null) {
    return;
  }

  if (sourceInstanceName !== localeJsonSourceName) {
    return;
  }

  const activity = reporter.activityTimer(
    `gatsby-plugin-react-i18next: create node: ${relativeDirectory}/${name}`
  );
  activity.start();

  // relativeDirectory name is language name.
  const language = relativeDirectory;
  const content = await loadNodeContent(node);

  // verify & canonicalize indent. (do not care about key order)
  let data: string;
  try {
    data = JSON.stringify(JSON.parse(content), undefined, '');
  } catch {
    const hint = node.absolutePath ? `file ${node.absolutePath}` : `in node ${node.id}`;
    throw new Error(`Unable to parse JSON: ${hint}`);
  }

  const {createNode, createParentChildLink} = actions;

  const localeNode: LocaleNodeInput = {
    id: createNodeId(`${id} >>> Locale`),
    children: [],
    parent: id,
    internal: {
      content: data,
      contentDigest: createContentDigest(data),
      type: `Locale`
    },
    language: language,
    ns: name,
    data,
    fileAbsolutePath: absolutePath
  };

  createNode(localeNode);

  // @ts-ignore
  // staled issue: https://github.com/gatsbyjs/gatsby/issues/19993
  createParentChildLink({parent: node, child: localeNode});

  activity.end();
};
