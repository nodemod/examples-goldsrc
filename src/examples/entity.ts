import nodemodCore from '@nodemod/core';

const entity = nodemodCore.entity;

// Wait for server to be ready before creating entities
nodemodCore.events.on('dllServerActivate', () => {
  console.log('Server activated - entities can now be created');
  
  // Example 1: Create and configure a basic entity
  const newEntity = entity.create('info_target');
  if (newEntity) {
    newEntity.target = 'example_target';
    newEntity.origin = [100, 200, 50];
    newEntity.angles = [0, 90, 0];
    console.log(`Created entity with ID: ${newEntity.id}`);
  }

  // Example 2: Find entities by class name
  const playerSpawns = entity.find({ className: 'info_player_start' });
  console.log(`Found ${playerSpawns.length} player spawn points`);

  playerSpawns.forEach((spawn, index) => {
    console.log(`Spawn ${index}: Origin [${spawn.origin.join(', ')}]`);
  });

  // Example 3: Find entity by target name
  const specificTarget = entity.findOne({ targetName: 'secret_door' });
  if (specificTarget) {
    console.log(`Found secret door at: [${specificTarget.origin.join(', ')}]`);
  }
});

// Example 4: Entity search in radius
nodemodCore.events.on('dllClientConnect', (client) => {
  const nearbyEntities = entity.findInSphere(client.origin, 100);
  console.log(`Player ${client.netname} spawned near ${nearbyEntities.length} entities`);
});

// Example 5: Create custom entities with different types (after server ready)
nodemodCore.events.on('dllServerActivate', () => {
  const lightEntity = entity.createLight([0, 0, 100], '_light', 500);
  if (lightEntity) {
    console.log('Created bright light entity');
  }

  const triggerEntity = entity.createTrigger('trigger_once', [50, 50, 0], [128, 128, 64]);
  if (triggerEntity) {
    triggerEntity.target = 'example_trigger';
    
    triggerEntity.onTouch((other) => {
      if (other && other.classname === 'player') {
        console.log('Player touched the trigger!');
      }
    });
  }

  // Example 6: Entity property manipulation
  const infoEntity = entity.createInfo('info_landmark', [200, 300, 75]);
  if (infoEntity) {
    infoEntity.target = 'landmark_1';
    infoEntity.health = 100;
    infoEntity.max_health = 100;
    
    // Set physics properties
    infoEntity.solid = nodemod.SOLID.BBOX;
    infoEntity.movetype = nodemod.MOVETYPE.NONE;
    
    console.log(`Info entity health: ${infoEntity.health}/${infoEntity.max_health}`);
  }
});

// Example 7: Entity distance calculations
nodemodCore.cmd.register('nearest', (client: nodemod.Entity, args: string[]) => {
  const clientWrapper = entity.wrap(client);
  if (!clientWrapper) return;
  
  const allEntities = entity.getAll();
  let nearest = null as typeof allEntities[0] | null;
  let minDistance = Infinity;
  
  allEntities.forEach(ent => {
    if (ent.id !== clientWrapper.id) {
      const distance = clientWrapper.getDistance(ent);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = ent;
      }
    }
  });
  
  if (nearest) {
    nodemodCore.util.messageClient(client, 
      `Nearest entity: ${nearest.classname} (${minDistance.toFixed(1)} units away)`
    );
  }
});

// Example 8: Entity lighting and illumination
nodemodCore.cmd.register('checklight', (client: nodemod.Entity) => {
  const clientWrapper = entity.wrap(client);
  if (clientWrapper) {
    const illumination = clientWrapper.getIllum();
    nodemodCore.util.messageClient(client, 
      `Current illumination level: ${illumination}`
    );
  }
});

// Example 9: Batch entity operations
nodemodCore.cmd.register('cleanup', (client: nodemod.Entity) => {
  // Remove all temporary entities
  const removedCount = entity.removeAll({ className: 'info_target' });
  nodemodCore.util.messageClient(client, 
    `Removed ${removedCount} temporary entities`
  );
});

// Example 10: Entity sound emission (after server ready)
nodemodCore.events.on('dllServerActivate', () => {
  const soundEntity = entity.create('ambient_generic');
  if (soundEntity) {
    soundEntity.origin = [0, 0, 50];
    soundEntity.emitSound(1, 'ambience/wind2.wav', 0.5, 1, 0, 100);
    console.log('Created sound-emitting entity');
  }
});

// Example 10b: Entity flags demonstration
nodemodCore.cmd.register('checkflags', (client: nodemod.Entity) => {
  const clientWrapper = entity.wrap(client);
  if (clientWrapper) {
    const flags = clientWrapper.flags;
    const flagStatus = [];
    
    if (flags & nodemod.FL.ONGROUND) flagStatus.push('ON_GROUND');
    if (flags & nodemod.FL.DUCKING) flagStatus.push('DUCKING');
    if (flags & nodemod.FL.WATERJUMP) flagStatus.push('WATER_JUMP');
    if (flags & nodemod.FL.INWATER) flagStatus.push('IN_WATER');
    if (flags & nodemod.FL.CLIENT) flagStatus.push('CLIENT');
    
    const statusText = flagStatus.length > 0 ? flagStatus.join(', ') : 'NONE';
    nodemodCore.util.messageClient(client, `Your flags: ${statusText}`);
  }
});

// Example 11: Entity physics demonstration (after server ready)
nodemodCore.events.on('dllServerActivate', () => {
  const physicsDemo = entity.create('info_target');
  if (physicsDemo) {
    physicsDemo.origin = [0, 0, 200];
    physicsDemo.solid = nodemod.SOLID.BBOX;
    physicsDemo.movetype = nodemod.MOVETYPE.TOSS;
    physicsDemo.gravity = 1.0;
    physicsDemo.friction = 0.5;
    
    // Set entity size
    physicsDemo.setSize([-16, -16, -16], [16, 16, 16]);
    
    // Drop to floor
    const dropResult = physicsDemo.dropToFloor();
    console.log(`Entity drop result: ${dropResult}`);
  }
});

// Example 12: List nearby entities by ID
nodemodCore.cmd.register('listentities', (client: nodemod.Entity, args: string[]) => {
  const clientWrapper = entity.wrap(client);
  if (!clientWrapper) return;
  
  const radius = args.length > 0 ? parseFloat(args[0]) : 100;
  const nearbyEntities = entity.findInSphere(clientWrapper.origin, radius);
  
  if (nearbyEntities.length === 0) {
    nodemodCore.util.messageClient(client, 'No entities found within range');
    return;
  }
  
  let message = `Entities within ${radius} units:\n`;
  nearbyEntities.forEach((ent) => {
    const distance = clientWrapper.getDistance(ent);
    const isOriginZero = ent.origin[0] === 0 && ent.origin[1] === 0 && ent.origin[2] === 0;
    
    // For brush entities with origin at 0,0,0, the actual distance is calculated differently by findInSphere
    // It uses the brush bounds, so we can't rely on origin-based distance calculation
    const displayDistance = isOriginZero ? 'N/A (brush)' : distance.toFixed(1);
    message += `ID: ${ent.id}, Class: ${ent.classname}, Distance: ${displayDistance}\n`;
  });
  
  nodemodCore.util.messageClient(client, message);
});

console.log('Entity examples loaded successfully!');
console.log('Available commands: nearest, checklight, cleanup, checkflags, listentities');