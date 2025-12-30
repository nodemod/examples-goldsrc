import nodemodCore from '@nodemod/core';
import { MsgDest, MsgTypes } from '@nodemod/core/msg';
import { HudTextOptions } from '@nodemod/core/util';

const msg = nodemodCore.msg;

// Example 1: Register and listen to a custom message
const customMsgId = msg.register('CustomAlert', 64);
msg.on('CustomAlert', (state: any) => {
  console.log('CustomAlert received:', state.data);
  console.log('From entity:', state.entity?.netname || 'server');
});

// Example 2: Send a SayText message to a specific player
function sendChatToPlayer(client: nodemod.Entity, message: string) {
  msg.send({
    type: 'SayText',
    entity: client,
    dest: MsgDest.one,
    data: [
      { type: 'byte', value: 0 },
      { type: 'string', value: message }
    ]
  });
}

// Example 3: Send a HUD message to all players
function sendHudMessageToAll(message: string, options?: HudTextOptions) {
  nodemod.players.forEach(player => {
    if (nodemodCore.util.isValidEntity(player)) {
      nodemodCore.util.showHudText(player, message, options);
    }
  });
}

// Example 4: Send a center print message
function sendCenterPrint(client: nodemod.Entity, message: string) {
  msg.send({
    type: MsgTypes.centerprint,
    entity: client,
    dest: MsgDest.one,
    data: [
      { type: 'string', value: message }
    ]
  });
}

// Example 6: Listen to engine messages
msg.on('TextMsg', (state: any) => {
  console.log('TextMsg intercepted:', {
    dest: state.dest,
    type: state.type,
    data: state.data,
    entity: state.entity?.netname || 'N/A'
  });
});

// Example 7: Post-message hook (executes after original message is sent)
msg.on('post:SayText', (state: any) => {
  console.log('SayText message was sent:', state.data);
  // Could log chat messages, implement chat filters, etc.
});

// Example 8: Broadcast message to all players in PVS (Potentially Visible Set)
function broadcastToPVS(origin: number[], message: string) {
  // broadcast, pvs, all, init, pas, pvs_r, pas_r
  msg.send({
    type: 'SayText',
    dest: MsgDest.pvs,
    origin: origin,
    data: [
      { type: 'byte', value: 0 },
      { type: 'string', value: `[PVS] ${message}` }
    ]
  });
}

// Example 9: Register command to test message functionality
nodemodCore.cmd.registerClient('test_msg', (client: nodemod.Entity, args: string[]) => {
  const playerName = client.netname;
  
  switch (args[0]) {
    case 'chat':
      sendChatToPlayer(client, `Hello ${playerName}! This is a custom chat message.`);
      break;
    case 'hud':
      sendHudMessageToAll(`${playerName} triggered a HUD message!`);
      break;
    case 'center':
      sendCenterPrint(client, `Center message for ${playerName}`);
      break;
    case 'pvs':
      broadcastToPVS([client.origin[0], client.origin[1], client.origin[2]], `${playerName} says hello to nearby players!`);
      break;
    default:
      nodemodCore.util.messageClient(client, 'Usage: test_msg <chat|hud|center|complex|pvs>');
  }
});

// Example 10: Message state monitoring
let messageCount = 0;
msg.on('newListener', (eventName: string) => {
  console.log(`New message listener registered: ${eventName}`);
});

// Count all outgoing messages
const originalSend = msg.send.bind(msg);
msg.send = function(options: any) {
  messageCount++;
  console.log(`Sending message #${messageCount}: ${options.type}`);
  return originalSend(options);
};

// Export helper functions for use in other modules
export {
  sendChatToPlayer,
  sendHudMessageToAll,
  sendCenterPrint
};

console.log('Message examples loaded successfully!');
console.log('Available test command: test_msg <chat|hud|center|complex|pvs>');
console.log('Registered message listeners: CustomAlert, TextMsg, post:SayText');