import nodemodCore from '@nodemod/core';
import NodemodEvents from '@nodemod/core/events';

const events = nodemodCore.events;

// Track connected players
const connectedPlayers = new Map<number, { name: string, connectTime: number }>();

// Example 1: Basic event listener
events.on('dllClientConnect', (entity, name, address, rejectReason) => {
  const playerId = nodemod.eng.indexOfEdict(entity);
  console.log(`Player connecting: ${name} from ${address} (ID: ${playerId})`);
  
  // Track player connection time
  connectedPlayers.set(playerId, {
    name: name,
    connectTime: Date.now()
  });
});

// Example 2: Event with priority (higher priority executes first)
events.on('dllClientDisconnect', (entity) => {
  const playerId = nodemod.eng.indexOfEdict(entity);
  const playerData = connectedPlayers.get(playerId);
  
  if (playerData) {
    const sessionTime = (Date.now() - playerData.connectTime) / 1000;
    console.log(`Player ${playerData.name} disconnected after ${sessionTime.toFixed(1)} seconds`);
    connectedPlayers.delete(playerId);
  }
}, { priority: 10 });

// Example 3: One-time event listener
events.once('dllServerActivate', (edict, edictCount, maxClients) => {
  console.log(`Server activated with max ${maxClients} clients`);
  console.log('This message will only appear once');
});

// Example 4: Filtered event - only listen for specific players
events.filter('dllSpawn', 
  (entity) => entity.classname === 'player',
  (entity) => {
    console.log(`Player ${entity.netname} spawned at [${entity.origin.join(', ')}]`);
  }
);

// Example 5: Throttled event - limit frequency (max once per second)
events.throttle('dllStartFrame', () => {
  const playerCount = nodemod.players.filter(p => p && p.netname).length;
  //console.log(`Frame update (throttled): ${playerCount} players online`);
}, 1000);

// Example 6: Debounced event - delay execution until activity stops
let touchCount = 0;
events.debounce('dllTouch', (touched, other) => {
  console.log(`Touch events settled. Total touches in burst: ${touchCount}`);
  touchCount = 0;
}, 500);

events.on('dllTouch', () => {
  touchCount++;
});

nodemod.on('dllUse', () => {
  console.log('Use event triggered');
});

// Example 7: Event chaining and management
events
  .on('dllUse', (used, activator) => {
    console.log(`${used.classname} ${used.targetname || 'unnamed'} used by ${activator.netname}`);
  })
  .on('dllBlocked', (blocker, blocked) => {
    console.log(`Entity ${blocker.classname} blocked ${blocked.classname}`);
  });

// Example 8: Player tracking with events
events.on('dllClientUserInfoChanged', (entity, infoBuffer) => {
  const playerId = nodemod.eng.indexOfEdict(entity);
  console.log(`Player ${entity.netname} (ID: ${playerId}) changed user info`);
});

// Example 9: Frame timing analysis
let frameCount = 0;
let lastFrameTime = 0;

events.on('dllStartFrame', () => {
  frameCount++;
  
  if (frameCount % 100 === 0) {
    const currentTime = nodemod.time;
    if (lastFrameTime > 0) {
      const fps = 100 / (currentTime - lastFrameTime);
      //console.log(`Server FPS: ${fps.toFixed(1)}`);
    }
    frameCount = 0;
    lastFrameTime = currentTime;
  }
});

// Example 10: Command to list event listeners
nodemodCore.cmd.registerClient('listevents', (client) => {
  const eventTypes = [
    'dllClientConnect',
    'dllClientDisconnect', 
    'dllSpawn',
    'dllStartFrame',
    'dllTouch',
    'dllUse'
  ] as const;
  
  let message = 'Active event listeners:\n';
  eventTypes.forEach(eventName => {
    const listeners = events.getListeners(eventName);
    if (listeners.length > 0) {
      message += `${eventName}: ${listeners.length} listener(s)\n`;
    }
  });
  
  nodemodCore.util.messageClient(client, message);
});

// Example 11: Async event waiting
nodemodCore.cmd.registerClient('waitforspawn', async (client) => {
  nodemodCore.util.messageClient(client, 'Waiting for next spawn event...');
  
  try {
    const [entity] = await events.waitFor('dllSpawn', 10000);
    nodemodCore.util.messageClient(client, 
      `Entity spawned: ${entity.classname} at [${entity.origin.join(', ')}]`
    );
  } catch (error) {
    nodemodCore.util.messageClient(client, 'Timeout waiting for spawn event');
  }
});

// Example 12: Player think events
events.on('dllPlayerPreThink', (entity) => {
  // This fires before player physics
  // Good for modifying player input or physics parameters
  const flags = entity.flags;
  if (flags & (1 << 9)) { // FL_ONGROUND
    // Player is on ground
  }
});

events.on('dllPlayerPostThink', (entity) => {
  // This fires after player physics
  // Good for post-processing player state
});

// Example 13: Using event constants
events.on('engClientCommand', (entity: nodemod.Entity) => {
  // Handle client commands
  const cmd = nodemod.eng.cmdArgv(0);
  if (cmd === 'say') {
    const message = nodemod.eng.cmdArgs();
    console.log(`${entity.netname}: ${message}`);
  }
});

// Example 14: Clean up specific event listeners
nodemodCore.cmd.registerClient('clearevents', (client) => {
  // Remove all StartFrame listeners to reduce overhead
  events.clearListeners('dllStartFrame');
  nodemodCore.util.messageClient(client, 'StartFrame event listeners cleared');
});

// Example 15: Entity interaction events
events.on('dllThink', (entity) => {
  if (entity.classname === 'info_target' && entity.targetname === 'thinker') {
    // Custom think logic for specific entities
    entity.nextthink = nodemod.time + 1.0; // Think again in 1 second
  }
});

console.log('Events examples loaded successfully!');
console.log('Available commands: listevents, waitforspawn, clearevents');