import nodemodCore from '@nodemod/core';

const cvar = nodemodCore.cvar;

// Example 1: Register custom console variables
console.log('Registering custom CVars...');
cvar.register('nm_welcome_message', 'Welcome to the server!', nodemod.FCVAR.SERVER | nodemod.FCVAR.ARCHIVE, 'Default welcome message for new players');
console.log('CVar nm_welcome_message registered with default:', cvar.getString('nm_welcome_message'));
cvar.register('nm_max_warnings', '3', nodemod.FCVAR.SERVER | nodemod.FCVAR.ARCHIVE, 'Maximum warnings before kick');
cvar.register('nm_debug_mode', '0', nodemod.FCVAR.SERVER, 'Enable debug logging');
cvar.register('nm_god_mode', '0', nodemod.FCVAR.PROTECTED, 'Admin god mode (protected from console changes)');

console.log('Custom CVars registered: nm_welcome_message, nm_max_warnings, nm_debug_mode, nm_god_mode');

// Example 2: Basic CVar reading and writing
nodemodCore.cmd.registerClient('cvartest', (client) => {
  // Read various CVar types
  const welcomeMsg = cvar.getString('nm_welcome_message');
  const maxWarnings = cvar.getInt('nm_max_warnings');
  const debugMode = cvar.getBool('nm_debug_mode');
  const gravity = cvar.getFloat('sv_gravity');
  
  let message = `CVar Values:
Welcome: "${welcomeMsg}"
Max Warnings: ${maxWarnings}
Debug Mode: ${debugMode}
Gravity: ${gravity}`;
  
  nodemodCore.util.messageClient(client, message);
});

// Example 3: CVar wrapper usage
const welcomeCVar = cvar.wrap('nm_welcome_message');
const debugCVar = cvar.wrap('nm_debug_mode');

if (welcomeCVar && debugCVar) {
  nodemodCore.cmd.registerClient('setwelcome', (client, args) => {
    if (args.length < 1) {
      nodemodCore.util.messageClient(client, `Current welcome: "${welcomeCVar.value}"`);
      return;
    }
    
    welcomeCVar.value = args.join(' ');
    nodemodCore.util.messageClient(client, `Welcome message set to: "${welcomeCVar.value}"`);
  });
  
  nodemodCore.cmd.registerClient('toggledebug', (client) => {
    debugCVar.bool = !debugCVar.bool;
    nodemodCore.util.messageClient(client, `Debug mode: ${debugCVar.bool ? 'ON' : 'OFF'}`);
  });
}

// Example 4: Reading common server CVars
nodemodCore.cmd.registerClient('serverconfig', (client) => {
  const serverInfo = {
    hostname: cvar.hostname?.value || 'Unknown',
    maxPlayers: cvar.maxplayers?.int || 0,
    friendlyFire: cvar.mp_friendlyfire?.bool || false,
    timeLimit: cvar.mp_timelimit?.float || 0,
    fragLimit: cvar.mp_fraglimit?.int || 0,
    gravity: cvar.sv_gravity?.float || 800,
    cheats: cvar.sv_cheats?.bool || false
  };
  
  let message = `Server Configuration:
Hostname: ${serverInfo.hostname}
Max Players: ${serverInfo.maxPlayers}
Friendly Fire: ${serverInfo.friendlyFire ? 'ON' : 'OFF'}
Time Limit: ${serverInfo.timeLimit} minutes
Frag Limit: ${serverInfo.fragLimit}
Gravity: ${serverInfo.gravity}
Cheats: ${serverInfo.cheats ? 'ENABLED' : 'DISABLED'}`;
  
  nodemodCore.util.messageClient(client, message);
});

// Example 5: Batch CVar operations
nodemodCore.cmd.registerClient('resetcvars', (client) => {
  const customCVars = ['nm_welcome_message', 'nm_max_warnings', 'nm_debug_mode'];
  
  customCVars.forEach(name => {
    const wrapper = cvar.wrap(name);
    if (wrapper) {
      wrapper.reset();
      console.log(`Reset CVar: ${name}`);
    }
  });
  
  nodemodCore.util.messageClient(client, 'Custom CVars reset to default values');
});

// Example 6: Batch set multiple CVars
nodemodCore.cmd.registerClient('setgamemode', (client, args) => {
  const mode = args[0] || 'deathmatch';
  
  let cvarSettings: { [key: string]: string | number } = {};
  
  switch (mode.toLowerCase()) {
    case 'deathmatch':
      cvarSettings = {
        mp_friendlyfire: '0',
        mp_timelimit: '15',
        mp_fraglimit: '30',
        sv_gravity: '800'
      };
      break;
    case 'teamplay':
      cvarSettings = {
        mp_friendlyfire: '0',
        mp_timelimit: '20',
        mp_fraglimit: '0',
        sv_gravity: '800'
      };
      break;
    case 'instagib':
      cvarSettings = {
        mp_friendlyfire: '0',
        mp_timelimit: '10',
        mp_fraglimit: '50',
        sv_gravity: '400'
      };
      break;
    default:
      nodemodCore.util.messageClient(client, 'Unknown mode. Available: deathmatch, teamplay, instagib');
      return;
  }
  
  cvar.setMultiple(cvarSettings);
  nodemodCore.util.messageClient(client, `Game mode set to: ${mode}`);
  console.log(`Game mode changed to ${mode} by ${client.netname}`);
});

// Example 7: CVar monitoring/watching
let gravityWatcher: (() => void) | null = null;

nodemodCore.cmd.registerClient('watchgravity', (client) => {
  if (gravityWatcher) {
    gravityWatcher();
    gravityWatcher = null;
    nodemodCore.util.messageClient(client, 'Stopped watching gravity changes');
    return;
  }
  
  gravityWatcher = cvar.watchVariable('sv_gravity', (current, previous, name) => {
    console.log(`Gravity changed from ${previous} to ${current}`);
    nodemodCore.util.messageAll(`Server gravity changed to ${current}`);
  }, 500);
  
  nodemodCore.util.messageClient(client, 'Now watching gravity changes');
});

// Example 8: CVar validation and bounds checking
nodemodCore.cmd.registerClient('setgravity', (client, args) => {
  if (args.length < 1) {
    const current = cvar.getFloat('sv_gravity');
    nodemodCore.util.messageClient(client, `Current gravity: ${current}`);
    return;
  }
  
  const newGravity = parseFloat(args[0]);
  
  if (isNaN(newGravity)) {
    nodemodCore.util.messageClient(client, 'Invalid gravity value');
    return;
  }
  
  // Validate bounds
  if (newGravity < 0 || newGravity > 2000) {
    nodemodCore.util.messageClient(client, 'Gravity must be between 0 and 2000');
    return;
  }
  
  cvar.setFloat('sv_gravity', newGravity);
  nodemodCore.util.messageClient(client, `Gravity set to ${newGravity}`);
  nodemodCore.util.messageAll(`Gravity changed to ${newGravity} by ${client.netname}`);
});

// Example 9: Check if CVars exist before using
nodemodCore.cmd.registerClient('checkcvars', (client) => {
  const testCVars = ['sv_gravity', 'maxplayers', 'hostname', 'nonexistent_cvar'];
  
  let message = 'CVar existence check:\n';
  testCVars.forEach(name => {
    const exists = cvar.exists(name);
    const value = exists ? cvar.getString(name) : 'N/A';
    message += `${name}: ${exists ? 'EXISTS' : 'MISSING'} (${value})\n`;
  });
  
  nodemodCore.util.messageClient(client, message);
});

// Example 10: Using CVar pointers for performance
nodemodCore.cmd.registerClient('fastgravity', (client, args) => {
  if (args.length < 1) {
    nodemodCore.util.messageClient(client, 'Usage: fastgravity <value>');
    return;
  }
  
  const value = args[0];
  
  // Direct CVar manipulation (fastest method)
  cvar.setDirect('sv_gravity', value);
  nodemodCore.util.messageClient(client, `Gravity set directly to ${value}`);
});

// Example 11: Get all registered custom CVars
nodemodCore.cmd.registerClient('listcustomcvars', (client) => {
  const registered = cvar.getRegistered();
  
  if (registered.size === 0) {
    nodemodCore.util.messageClient(client, 'No custom CVars registered');
    return;
  }
  
  let message = 'Registered Custom CVars:\n';
  registered.forEach((info, name) => {
    const current = cvar.getString(name);
    message += `${name}: "${current}" (default: "${info.string}")\n`;
    if (info.description) {
      message += `  ${info.description}\n`;
    }
  });
  
  nodemodCore.util.messageClient(client, message);
});

// Example 12: Admin-only CVar changes
nodemodCore.cmd.registerClient('admincvar', (client, args) => {
  if (args.length < 2) {
    nodemodCore.util.messageClient(client, 'Usage: admincvar <name> <value>');
    return;
  }
  
  // Basic admin check (you'd implement proper admin system)
  const isAdmin = client.netname === 'Admin' || cvar.getBool('sv_cheats');
  
  if (!isAdmin) {
    nodemodCore.util.messageClient(client, 'Admin access required');
    return;
  }
  
  const cvarName = args[0];
  const cvarValue = args.slice(1).join(' ');
  
  if (!cvar.exists(cvarName)) {
    nodemodCore.util.messageClient(client, `CVar '${cvarName}' does not exist`);
    return;
  }
  
  const oldValue = cvar.getString(cvarName);
  cvar.setString(cvarName, cvarValue);
  
  nodemodCore.util.messageClient(client, `${cvarName}: "${oldValue}" → "${cvarValue}"`);
  console.log(`Admin ${client.netname} changed ${cvarName} from "${oldValue}" to "${cvarValue}"`);
});

// Example 13: Initialize server CVars on startup
nodemodCore.events.on('dllServerActivate', () => {
  cvar.initializeServerCVars();
  console.log('Server CVars initialized');
  
  // Set some initial server configuration
  const hostname = cvar.hostname;
  if (hostname && hostname.value === 'Half-Life') {
    hostname.value = 'NodeMod TypeScript Server';
    console.log('Server hostname updated');
  }
});

console.log('CVar examples loaded successfully!');
console.log('Available commands: cvartest, setwelcome, toggledebug, serverconfig, resetcvars, setgamemode, watchgravity, setgravity, checkcvars, fastgravity, listcustomcvars, admincvar');