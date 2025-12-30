import nodemodCore from '@nodemod/core';

// Precache models on server activation
let cupboardModelPrecached = false;

nodemodCore.events.on('dllServerActivate', () => {
  // Precache the model we'll use in examples
  nodemod.eng.precacheModel('models/3dm_palm.mdl');
  cupboardModelPrecached = true;
  console.log('Example models precached');
});

// Example 1: Entity creation and manipulation
nodemodCore.cmd.registerClient('createtest', (client) => {
  if (!cupboardModelPrecached) {
    nodemodCore.util.messageClient(client, 'Model not precached yet, please wait for server activation');
    return;
  }
  
  // Create a new entity
  const entity = nodemod.eng.createEntity();
  
  // Set its properties
  entity.classname = 'cycler'; // Use cycler for displaying models
  entity.targetname = 'example_model'; // Give it a target name
  nodemod.eng.setModel(entity, 'models/3dm_palm.mdl');
  nodemod.eng.setOrigin(entity, [client.origin[0] + 50, client.origin[1], client.origin[2]]);
  nodemod.eng.setSize(entity, [-16, -16, -36], [16, 16, 36]);
  
  // Make it static (won't move)
  nodemod.dll.spawn(entity);
  
  const entityId = nodemod.eng.indexOfEdict(entity);
  nodemodCore.util.messageClient(client, `Created entity with ID: ${entityId}`);
});

// Example 2: Vector and angle operations
nodemodCore.cmd.registerClient('vectortest', (client) => {
  const forward = [0, 0, 0];
  const right = [0, 0, 0];
  const up = [0, 0, 0];
  
  // Get angle vectors from client's view angles
  nodemod.eng.angleVectors(client.angles, forward, right, up);
  
  const message = `Your view vectors:
Forward: [${forward.map(v => v.toFixed(2)).join(', ')}]
Right: [${right.map(v => v.toFixed(2)).join(', ')}]
Up: [${up.map(v => v.toFixed(2)).join(', ')}]`;
  
  nodemodCore.util.messageClient(client, message);
});

// Example 3: Tracing (line of sight, collision detection)
nodemodCore.cmd.registerClient('trace', (client, args) => {
    const distance = args.length > 0 ? parseFloat(args[0]) : 1000;

    // Calculate forward vector from angles manually (fix the math)
    const pitch = -client.angles[0] * Math.PI / 180; // Note the negative!
    const yaw = client.angles[1] * Math.PI / 180;

    const forward = [
      Math.cos(pitch) * Math.cos(yaw),
      Math.cos(pitch) * Math.sin(yaw),
      -Math.sin(pitch)
    ];

    const start = [
      client.origin[0],
      client.origin[1],
      client.origin[2] + client.view_ofs[2] // Check if it's view_ofs not viewOfs
    ];

    const end = [
      start[0] + forward[0] * distance,
      start[1] + forward[1] * distance,
      start[2] + forward[2] * distance
    ];

    // This should work now!
    const trace = nodemod.eng.traceLine(start, end, 0, client);

    console.log(trace);

    const actualDistance = trace.fraction * distance;

    nodemodCore.util.messageClient(client, `Trace: ${trace.fraction < 1.0 ? 'HIT' : 'NO HIT'}, Distance: ${actualDistance.toFixed(1)}`);
  });

// Example 4: Point contents (what's at a location)
nodemodCore.cmd.registerClient('contents', (client) => {
  const contents = nodemod.eng.pointContents(client.origin);
  
  const contentsMap: { [key: number]: string } = {
    [-1]: 'SOLID',
    [-2]: 'WATER',
    [-3]: 'SLIME',
    [-4]: 'LAVA',
    [-5]: 'SKY',
    [-16]: 'LADDER',
    [0]: 'EMPTY'
  };
  
  const contentType = contentsMap[contents] || `Unknown (${contents})`;
  nodemodCore.util.messageClient(client, `Point contents: ${contentType}`);
});

// Example 5: Lighting and illumination
nodemodCore.cmd.registerClient('lighting', (client) => {
  const illumination = nodemod.eng.getEntityIllum(client);
  
  // Set different light styles
  nodemod.eng.lightStyle(0, 'm'); // Normal light
  nodemod.eng.lightStyle(1, 'mmnmmommommnonmmonqnmmo'); // Flicker
  nodemod.eng.lightStyle(2, 'abcdefghijklmnopqrstuvwxyzyxwvutsrqponmlkjihgfedcba'); // Slow pulse
  
  nodemodCore.util.messageClient(client, 
    `Your illumination level: ${illumination}\nLight styles updated!`
  );
});

// Example 6: Sound and particle effects
nodemodCore.cmd.registerClient('effects', (client, args) => {
  const effectType = args[0] || 'sound';
  
  switch (effectType.toLowerCase()) {
    case 'sound':
      // Play sound from client position
      nodemod.eng.emitSound(client, 1, 'misc/talk.wav', 1.0, 1.0, 0, 100);
      nodemodCore.util.messageClient(client, 'Sound effect played');
      break;
      
    case 'particles':
      // Create particle effect
      const direction = [0, 0, 1]; // Upward
      nodemod.eng.particleEffect(client.origin, direction, 255, 50); // White particles
      nodemodCore.util.messageClient(client, 'Particle effect created');
      break;
      
    case 'ambient':
      // Ambient sound at position
      nodemod.eng.emitAmbientSound(client, client.origin, 'ambience/wind2.wav', 0.5, 1.0, 0, 100);
      nodemodCore.util.messageClient(client, 'Ambient sound started');
      break;
      
    default:
      nodemodCore.util.messageClient(client, 'Usage: effects <sound|particles|ambient>');
  }
});

// Example 7: Server commands and execution
nodemodCore.cmd.registerClient('servercmd', (client, args) => {
  if (args.length < 1) {
    nodemodCore.util.messageClient(client, 'Usage: servercmd <command>');
    return;
  }
  
  // Basic admin check
  const isAdmin = client.netname === 'Admin' || nodemodCore.cvar.getBool('sv_cheats');
  if (!isAdmin) {
    nodemodCore.util.messageClient(client, 'Admin access required');
    return;
  }
  
  const command = args.join(' ');
  console.log(`Admin ${client.netname} executing server command: ${command}`);
  
  // Execute server command
  nodemod.eng.serverCommand(command + '\n');
  nodemod.eng.serverExecute();
  
  nodemodCore.util.messageClient(client, `Server command executed: ${command}`);
});

// Example 8: Random number generation
nodemodCore.cmd.registerClient('random', (client, args) => {
  const min = args.length > 0 ? parseInt(args[0]) : 1;
  const max = args.length > 1 ? parseInt(args[1]) : 100;
  
  const randomInt = nodemod.eng.randomLong(min, max);
  const randomFloat = nodemod.eng.randomFloat(0, 1);
  
  nodemodCore.util.messageClient(client, 
    `Random integer (${min}-${max}): ${randomInt}\nRandom float (0-1): ${randomFloat.toFixed(3)}`
  );
});

// Example 9: Entity search and information
nodemodCore.cmd.registerClient('findents', (client, args) => {
  const className = args[0] || 'player';
  let foundCount = 0;
  let message = `Entities with class '${className}':\n`;
  
  // Search for entities by class name
  let entity = nodemod.eng.findEntityByString(nodemod.eng.pEntityOfEntIndex(0), 'classname', className);
  
  while (entity && foundCount < 10) { // Limit to 10 results
    const entityId = nodemod.eng.indexOfEdict(entity);
    const origin = entity.origin;
    
    message += `ID: ${entityId}, Origin: [${origin.map((v: number) => v.toFixed(1)).join(', ')}]\n`;
    foundCount++;
    
    // Find next entity
    const nextEntity = nodemod.eng.findEntityByString(entity, 'classname', className);
    if (nextEntity === entity) break; // Prevent infinite loop
    entity = nextEntity;
  }
  
  if (foundCount === 0) {
    message = `No entities found with class '${className}'`;
  } else if (foundCount >= 10) {
    message += '(Limited to 10 results)';
  }
  
  nodemodCore.util.messageClient(client, message);
});

// Example 10: Player information and manipulation
nodemodCore.cmd.registerClient('playerinfo', (client, args) => {
  const targetName = args[0] || client.netname;
  
  // Find player by name
  let targetEntity = client;
  if (targetName !== client.netname) {
    targetEntity = nodemod.eng.findEntityByString(nodemod.eng.pEntityOfEntIndex(0), 'netname', targetName);
    if (!targetEntity || !targetEntity.netname) {
      nodemodCore.util.messageClient(client, `Player '${targetName}' not found`);
      return;
    }
  }
  
  const entityId = nodemod.eng.indexOfEdict(targetEntity);
  const userId = nodemod.eng.getPlayerUserId(targetEntity);
  const authId = nodemod.eng.getPlayerAuthId(targetEntity);
  const wonId = nodemod.eng.getPlayerWONId(targetEntity);
  
  // Get info buffer and extract some keys
  const infoBuffer = nodemod.eng.getInfoKeyBuffer(targetEntity);
  const model = nodemod.eng.infoKeyValue(infoBuffer, 'model') || 'unknown';
  const topcolor = nodemod.eng.infoKeyValue(infoBuffer, 'topcolor') || '0';
  
  const message = `Player Information:
Name: ${targetEntity.netname}
Entity ID: ${entityId}
User ID: ${userId}
Auth ID: ${authId}
WON ID: ${wonId}
Model: ${model}
Top Color: ${topcolor}
Health: ${targetEntity.health}
Origin: [${targetEntity.origin.map((v: number) => v.toFixed(1)).join(', ')}]`;
  
  nodemodCore.util.messageClient(client, message);
});

// Example 11: Model operations
nodemodCore.cmd.registerClient('modelinfo', (client, args) => {
  const modelName = args[0] || 'models/player.mdl';
  
  try {
    const modelIndex = nodemod.eng.modelIndex(modelName);
    const frameCount = nodemod.eng.modelFrames(modelIndex);
    
    nodemodCore.util.messageClient(client, 
      `Model: ${modelName}\nIndex: ${modelIndex}\nFrames: ${frameCount}`
    );
  } catch (error) {
    nodemodCore.util.messageClient(client, `Model '${modelName}' not found or invalid`);
  }
});

// Example 12: File operations
nodemodCore.cmd.registerClient('fileinfo', (client, args) => {
  const filename = args[0] || 'maps/' + nodemod.mapname + '.bsp';
  
  try {
    const fileSize = nodemod.eng.getFileSize(filename);
    
    if (fileSize > 0) {
      const sizeKB = (fileSize / 1024).toFixed(2);
      nodemodCore.util.messageClient(client, 
        `File: ${filename}\nSize: ${fileSize} bytes (${sizeKB} KB)`
      );
    } else {
      nodemodCore.util.messageClient(client, `File '${filename}' not found`);
    }
  } catch (error) {
    nodemodCore.util.messageClient(client, `Error accessing file '${filename}'`);
  }
});

// Example 13: Map validation and server info
nodemodCore.cmd.registerClient('mapcheck', (client, args) => {
  const mapName = args[0] || nodemod.mapname;
  
  const isValid = nodemod.eng.isMapValid(mapName);
  const isDedicated = nodemod.eng.isDedicatedServer();
  const entityCount = nodemod.eng.numberOfEntities();
  const currentTime = nodemod.eng.time();
  
  const message = `Map Information:
Map Name: ${mapName}
Valid: ${isValid ? 'YES' : 'NO'}
Server Type: ${isDedicated ? 'Dedicated' : 'Listen'}
Entity Count: ${entityCount}
Server Time: ${currentTime.toFixed(2)} seconds`;
  
  nodemodCore.util.messageClient(client, message);
});

// Example 14: Client commands
nodemodCore.cmd.registerClient('clientcmd', (client, args) => {
  if (args.length < 1) {
    nodemodCore.util.messageClient(client, 'Usage: clientcmd <command>');
    return;
  }
  
  const command = args.join(' ');
  
  // Send command to client to execute
  nodemod.eng.clientCommand(client, command);
  nodemodCore.util.messageClient(client, `Client command sent: ${command}`);
});

// Example 15: Physics and movement
nodemodCore.cmd.registerClient('physics', (client, args) => {
  const action = args[0] || 'info';
  
  switch (action.toLowerCase()) {
    case 'drop':
      // Drop client to floor
      const result = nodemod.eng.dropToFloor(client);
      nodemodCore.util.messageClient(client, 
        `Drop to floor result: ${result ? 'Success' : 'Failed'}`
      );
      break;
      
    case 'onfloor':
      // Check if on floor
      const onFloor = nodemod.eng.entIsOnFloor(client);
      nodemodCore.util.messageClient(client, 
        `On floor: ${onFloor ? 'YES' : 'NO'}`
      );
      break;
      
    case 'walk':
      // Walk in direction
      const distance = args.length > 1 ? parseFloat(args[1]) : 50;
      const yaw = client.angles[1]; // Current yaw
      const walkResult = nodemod.eng.walkMove(client, yaw, distance, 0);
      nodemodCore.util.messageClient(client, 
        `Walk move result: ${walkResult ? 'Success' : 'Blocked'}`
      );
      break;
      
    default:
      nodemodCore.util.messageClient(client, 
        'Usage: physics <drop|onfloor|walk [distance]>'
      );
  }
});

console.log('Engine examples loaded successfully!');
console.log('Available commands: createtest, vectortest, trace, contents, lighting, effects, servercmd, random, findents, playerinfo, modelinfo, fileinfo, mapcheck, clientcmd, physics');