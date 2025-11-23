// Prevent Storybook/esbuild PnP plugin from activating when a user has a .pnp.cjs upstream.
const Module = require('module');
// eslint-disable-next-line no-underscore-dangle
Module._findPnpApi = Module.findPnpApi;
Module.findPnpApi = () => null;
