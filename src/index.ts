// NodeMod Plugin Examples
// This file demonstrates various features of the NodeMod TypeScript framework

import nodemodCore from '@nodemod/core';
import { initializeMenuExamples } from './examples/menu';
import './examples/cmd';
import './examples/msg';
import './examples/resource';
import './examples/entity';
import './examples/sound';
import './examples/events';
import './examples/file';
import './examples/player';
import './examples/cvar';
import './examples/engine';

import inspector from 'inspector';

// Expose nodemodCore globally for debugging
(global as any).nodemodCore = nodemodCore;

// requires process.stdin.resume() at the end to keep running
inspector.open(9229, 'localhost');

// To keep the plugin running for testing purposes
process.stdin.resume();


/** Implementation **/

console.log('[NodeMod] TypeScript Plugin Loading...');
console.log(`[NodeMod] Core Library Version: ${nodemodCore.constructor.name}`);

// Initialize all examples
function initializeExamples() {
  console.log('Initializing NodeMod examples...');
  
  // Initialize menu system examples
  initializeMenuExamples();
  
  nodemodCore.cmd.register('say', (client, args) => {
    if (!client) return;
    nodemodCore.util.messageClient(client, `You spoke: ${args.join(' ')}\n`);
  });

  nodemodCore.cmd.register('say_team', (client, args) => {
    if (!client) return;
    nodemodCore.util.messageClient(client, `You teamspoke: ${args.join(' ')}\n`);
  });

  // Basic command example
  nodemodCore.cmd.register('hello', (client, args) => {
    if (!client) return;
    nodemodCore.util.messageClient(client, `Hello ${client.netname}! Arguments: ${args.join(' ')}\n`);
  });

  // Server info command
  nodemodCore.cmd.register('serverinfo', (client, args) => {
    if (!client) return;
    const info = `Server Information:
Map: ${nodemod.mapname}
Players: ${nodemod.players.filter(p => nodemodCore.util.isValidEntity(p)).length}
Server Time: ${Math.floor(nodemod.time)} seconds`;

    nodemodCore.util.messageClient(client, info);
  });

  // Event examples
  nodemodCore.events.on('dllClientConnect', (client, name, address) => {
    console.log(`Player ${name} connected from ${address}`);
    //nodemodCore.util.messageAll(`Welcome ${name} to the server!`);
  });

  nodemodCore.events.on('dllClientDisconnect', (client) => {
    console.log(`Player ${client.netname} disconnected`);
  });

  // Message example
  nodemodCore.msg.register('TextMsg', 128);
  nodemodCore.msg.on('TextMsg', (state) => {
    console.log('TextMsg received:', state.data);
  });
}

// Initialize when the plugin loads
try {
  initializeExamples();
  console.log('NodeMod TypeScript Plugin loaded successfully!');
} catch (error) {
  console.error('Error loading NodeMod plugin:', error);
}

// Export for potential external use
export { initializeExamples };