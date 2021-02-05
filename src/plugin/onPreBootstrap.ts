import {ParentSpanPluginArgs} from 'gatsby';
import {PluginOptions} from '../types';
import report from 'gatsby-cli/lib/reporter';

export const onPreBootstrap = (_args: ParentSpanPluginArgs, pluginOptions: PluginOptions) => {
  // Check for deprecated option.
  if (pluginOptions.hasOwnProperty('path')) {
    report.error(
      `gatsby-plugin-react-i18next: 💥💥💥 "path" option is deprecated and won't be working as it was before. Please update setting on your gastby-config.js.\n\nSee detail: https://github.com/microapps/gatsby-plugin-react-i18next\n\n`
    );
  }
};
