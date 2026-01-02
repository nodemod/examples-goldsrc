// NodeMod Plugin Examples
// This file demonstrates various features of the NodeMod TypeScript framework

import inspector from 'inspector';

import nodemodCore from '@nodemod/core';
import '@nodemod/admin'; // load admin system (loads plugins from plugins.ini)

// Expose nodemodCore globally for debugging
(global as any).nodemodCore = nodemodCore;

// requires process.stdin.resume() at the end to keep running
inspector.open(9229, 'localhost');

// To keep the plugin running for testing purposes
process.stdin.resume();

/** Implementation **/

console.log('[NodeMod] TypeScript Plugin Loading...');
console.log(`[NodeMod] Core Library Version: ${nodemodCore.constructor.name}`);