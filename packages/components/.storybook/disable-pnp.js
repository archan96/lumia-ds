// Prevent Storybook/esbuild PnP plugin from activating when a user has a .pnp.cjs upstream.
const Module = require('module');
Module._findPnpApi = Module.findPnpApi;
Module.findPnpApi = () => null;
