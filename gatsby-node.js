const {onCreatePage} = require('./dist/plugin/onCreatePage');
const {onCreateNode} = require('./dist/plugin/onCreateNode');
const {onPreBootstrap} = require('./dist/plugin/onPreBootstrap');

exports.onCreatePage = onCreatePage;
exports.onCreateNode = onCreateNode;
exports.onPreBootstrap = onPreBootstrap;
