import nodemodCore from '@nodemod/core';

const player = nodemodCore.player;

// Example 1: Get all connected players info
nodemodCore.cmd.register('players', (client) => {
  const allPlayers = player.getAll();
  
  if (allPlayers.length === 0) {
    nodemodCore.util.messageClient(client, 'No players connected');
    return;
  }
  
  let message = `Connected players (${allPlayers.length}):\n`;
  allPlayers.forEach(p => {
    message += `[${p.id}] ${p.name} - HP: ${p.health}, Armor: ${p.armor}, Frags: ${p.frags}\n`;
  });
  
  nodemodCore.util.messageClient(client, message);
});

// Example 2: Get player by different identifiers
nodemodCore.cmd.register('playerinfo', (client, args) => {
  if (args.length < 1) {
    nodemodCore.util.messageClient(client, 'Usage: playerinfo <name/id>');
    return;
  }
  
  const searchTerm = args[0];
  let playerInfo = null;
  
  // Try to find by ID first
  if (!isNaN(parseInt(searchTerm))) {
    playerInfo = player.getById(parseInt(searchTerm));
  }
  
  // Try to find by name if not found by ID
  if (!playerInfo) {
    playerInfo = player.getByName(searchTerm);
  }
  
  if (!playerInfo) {
    nodemodCore.util.messageClient(client, `Player '${searchTerm}' not found`);
    return;
  }
  
  const info = `Player Info:
Name: ${playerInfo.name}
ID: ${playerInfo.id}
SteamID: ${playerInfo.steamId}
Health: ${playerInfo.health}/${playerInfo.entity.max_health || 100}
Armor: ${playerInfo.armor}
Position: [${playerInfo.origin.map((v: number) => v.toFixed(1)).join(', ')}]
Team: ${playerInfo.team}
Alive: ${playerInfo.isAlive ? 'Yes' : 'No'}`;
  
  nodemodCore.util.messageClient(client, info);
});

// Example 3: Player teleportation
nodemodCore.cmd.register('teleport', (client, args) => {
  if (args.length < 3) {
    nodemodCore.util.messageClient(client, 'Usage: teleport <x> <y> <z>');
    return;
  }
  
  const x = parseFloat(args[0]);
  const y = parseFloat(args[1]);
  const z = parseFloat(args[2]);
  
  if (isNaN(x) || isNaN(y) || isNaN(z)) {
    nodemodCore.util.messageClient(client, 'Invalid coordinates');
    return;
  }
  
  const success = player.teleport(client, [x, y, z]);
  if (success) {
    nodemodCore.util.messageClient(client, `Teleported to [${x}, ${y}, ${z}]`);
  } else {
    nodemodCore.util.messageClient(client, 'Teleportation failed');
  }
});

// Example 4: Send messages to players
nodemodCore.cmd.register('announce', (client, args) => {
  if (args.length < 1) {
    nodemodCore.util.messageClient(client, 'Usage: announce <message>');
    return;
  }
  
  const message = args.join(' ');
  
  // Broadcast to all players using different message types
  player.broadcast(`[ANNOUNCE] ${message}`, 'chat');
  
  // Also send as HUD message to the command user
  player.sendMessage(client, message, 'hud');
  
  console.log(`${client.netname} announced: ${message}`);
});

// Example 5: Health and armor management
nodemodCore.cmd.register('heal', (client, args) => {
  let targetPlayer = client;
  let amount = 100;
  
  if (args.length > 0) {
    const target = player.getByName(args[0]);
    if (target) {
      targetPlayer = target.entity;
      if (args.length > 1) {
        amount = parseInt(args[1]) || 100;
      }
    } else {
      amount = parseInt(args[0]) || 100;
    }
  }
  
  const newHealth = player.setHealth(targetPlayer, amount);
  const newArmor = player.setArmor(targetPlayer, 100);
  
  nodemodCore.util.messageClient(client, 
    `Healed ${targetPlayer.netname}: Health=${newHealth}, Armor=${newArmor}`
  );
});

// Example 6: Player statistics
nodemodCore.cmd.register('stats', (client, args) => {
  const targetPlayer = args.length > 0 ? player.getByName(args[0]) : player.getPlayerInfo(client);
  
  if (!targetPlayer) {
    nodemodCore.util.messageClient(client, 'Player not found');
    return;
  }
  
  const stats = player.getStats(targetPlayer.entity) || {
    name: targetPlayer.name,
    frags: 0,
    deaths: 0,
    health: targetPlayer.health,
    armor: targetPlayer.armor
  };
  const kd = stats.deaths > 0 ? (stats.frags / stats.deaths).toFixed(2) : stats.frags.toFixed(2);
  
  const message = `Stats for ${stats.name}:
Kills: ${stats.frags}
Deaths: ${stats.deaths}
K/D: ${kd}
Health: ${stats.health}
Armor: ${stats.armor}`;
  
  nodemodCore.util.messageClient(client, message);
});

// Example 7: Find players by criteria
nodemodCore.cmd.register('findplayers', (client, args) => {
  // Find all alive players
  const alivePlayers = player.findPlayers({ isAlive: true });
  
  // Find players on specific team (example: team 2)
  const teamPlayers = player.findPlayers({ team: 2 });
  
  let message = `Alive players: ${alivePlayers.length}\n`;
  alivePlayers.forEach(p => {
    message += `- ${p.name} (HP: ${p.health})\n`;
  });
  
  nodemodCore.util.messageClient(client, message);
});

// Example 8: Players in radius
nodemodCore.cmd.register('nearplayers', (client, args) => {
  const radius = args.length > 0 ? parseFloat(args[0]) : 500;
  const clientInfo = player.getPlayerInfo(client);
  
  if (!clientInfo) return;
  
  const nearbyPlayers = player.getPlayersInRadius(clientInfo.origin, radius);
  
  let message = `Players within ${radius} units:\n`;
  nearbyPlayers.forEach(p => {
    if (p.id !== clientInfo.id) {
      const distance = player.getDistance(client, p.entity);
      message += `${p.name}: ${distance.toFixed(1)} units away\n`;
    }
  });
  
  if (nearbyPlayers.length <= 1) {
    message = 'No other players nearby';
  }
  
  nodemodCore.util.messageClient(client, message);
});

// Example 9: Line of sight check
nodemodCore.cmd.register('cansee', (client, args) => {
  if (args.length < 1) {
    nodemodCore.util.messageClient(client, 'Usage: cansee <player name>');
    return;
  }
  
  const targetPlayer = player.getByName(args[0]);
  if (!targetPlayer) {
    nodemodCore.util.messageClient(client, 'Player not found');
    return;
  }
  
  const canSee = player.canSee(client, targetPlayer.entity);
  const distance = player.getDistance(client, targetPlayer.entity);
  
  if (canSee) {
    nodemodCore.util.messageClient(client, 
      `You can see ${targetPlayer.name} (${distance.toFixed(1)} units away)`
    );
  } else {
    nodemodCore.util.messageClient(client, 
      `You cannot see ${targetPlayer.name} (blocked or too far)`
    );
  }
});

// Example 10: Speed modification
nodemodCore.cmd.register('speed', (client, args) => {
  const speed = args.length > 0 ? parseFloat(args[0]) : 320;
  
  if (isNaN(speed) || speed < 0 || speed > 2000) {
    nodemodCore.util.messageClient(client, 'Invalid speed (0-2000)');
    return;
  }
  
  player.setMaxSpeed(client, speed);
  nodemodCore.util.messageClient(client, `Max speed set to ${speed}`);
});

// Example 11: Different message types
nodemodCore.cmd.register('msgtest', (client) => {
  // Send different types of messages
  player.sendMessage(client, 'This is a chat message', 'chat');
  
  setTimeout(() => {
    player.sendMessage(client, 'This is a HUD message', 'hud');
  }, 1000);
  
  setTimeout(() => {
    player.sendMessage(client, 'This is a center message', 'center');
  }, 2000);
  
  setTimeout(() => {
    player.sendMessage(client, 'This is a console message', 'console');
  }, 3000);
});

// Example 12: Bot creation (if supported)
nodemodCore.cmd.register('addbot', (client, args) => {
  const botName = args.length > 0 ? args[0] : 'Bot' + Math.floor(Math.random() * 1000);
  
  const bot = player.createBot(botName);
  if (bot) {
    nodemodCore.util.messageClient(client, `Bot '${bot.name}' created with ID ${bot.id}`);
    
    // Give the bot some initial properties
    player.setHealth(bot.entity, 100);
    player.setArmor(bot.entity, 50);
  } else {
    nodemodCore.util.messageClient(client, 'Failed to create bot');
  }
});

// Example 13: Track player connections
nodemodCore.events.on('dllClientPutInServer', (entity) => {
  console.log(`Player joining: ${entity.netname}`);
  
  // Wait a bit for player to fully connect
  setTimeout(() => {
      // Send welcome message
      player.sendMessage(entity, `Welcome ${entity.netname}!`, 'chat');
      player.sendMessage(entity, 'Type "help" for available commands', 'center');
      
      // Announce to others
      player.broadcast(`${entity.netname} has joined the game`, 'chat');
  }, 1000);
});

// Example 14: Player damage tracking
let damageStats = new Map<string, { dealt: number, taken: number }>();

// Note: dllTakeDamage may not be available in all nodemod versions
// This is a conceptual example - use available events like dllClientKilled
nodemodCore.events.on('dllSpawn', (entity: nodemod.Entity) => {
  if (entity.netname) {
    // Initialize damage stats for new players
    if (!damageStats.has(entity.netname)) {
      damageStats.set(entity.netname, { dealt: 0, taken: 0 });
    }
  }
});

nodemodCore.cmd.register('damage', (client) => {
  const stats = damageStats.get(client.netname) || { dealt: 0, taken: 0 };
  
  nodemodCore.util.messageClient(client, 
    `Damage - Dealt: ${stats.dealt.toFixed(0)}, Taken: ${stats.taken.toFixed(0)}`
  );
});

// Example 15: Respawn player
nodemodCore.cmd.register('respawnme', (client, args) => {
  const targetPlayer = args.length > 0 ? player.getByName(args[0]) : player.getPlayerInfo(client);
  
  if (!targetPlayer) {
    nodemodCore.util.messageClient(client, 'Player not found');
    return;
  }
  
  // Reset health to respawn`
  player.setHealth(targetPlayer.entity, 100);
  player.setArmor(targetPlayer.entity, 0);
  
  // Find multiplayer spawn points (try deathmatch first, fallback to single-player)
  let spawnPoints = nodemodCore.entity.find({ className: 'info_player_deathmatch' });
  if (spawnPoints.length === 0) {
    spawnPoints = nodemodCore.entity.find({ className: 'info_player_start' });
  }
  
  console.log(`Found ${spawnPoints.length} spawn points`);
  if (spawnPoints.length > 0) {
    const spawn = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
    player.teleport(targetPlayer.entity, spawn.origin, spawn.angles);
  }
  
  nodemodCore.util.messageClient(client, `${targetPlayer.name} respawned`);
});

console.log('Player examples loaded successfully!');
console.log('Available commands: players, playerinfo, teleport, announce, heal, stats, findplayers, nearplayers, cansee, speed, msgtest, addbot, damage, respawn');