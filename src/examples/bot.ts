// Global state for fake client commands
let g_fakeCommandState = {
  active: false,
  commandString: '',
  args: [] as string[],
  argCount: 0
};

function fakeClientCommand(entity: nodemod.Entity, commandString: string) {
  const commands = commandString.split(';');

  for (const cmd of commands) {
    const trimmed = cmd.trim();
    if (trimmed) {
      // Set up fake command state
      g_fakeCommandState.active = true;
      g_fakeCommandState.commandString = trimmed;
      g_fakeCommandState.args = parseCommandArgs(trimmed);
      g_fakeCommandState.argCount = g_fakeCommandState.args.length;

      // Call DLL ClientCommand (equivalent to MDLL_ClientCommand)
      nodemod.dll.clientCommand(entity);

      // Clean up
      g_fakeCommandState.active = false;
    }
  }
}

(globalThis as any).fakeClientCommand = fakeClientCommand;

function parseCommandArgs(commandString: string): string[] {
  const args = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < commandString.length; i++) {
    const char = commandString[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ' ' && !inQuotes) {
      if (current) {
        args.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current) {
    args.push(current);
  }

  console.log('[DEBUG] Parsed args:', args);
  return args;
}

nodemod.on('engClientCommand', (entity) => {
  console.log(`[DEBUG] engClientCommand fired!`);
  console.log(`[DEBUG] client:`, entity.netname || 'unknown');
  if (entity.flags & nodemod.FL.FAKECLIENT) {
    nodemod.setMetaResult(nodemod.MRES.SUPERCEDE);
  }
});

nodemod.on('dllClientCommand', (client, commandText) => {
  console.log(`[DEBUG] dllClientCommand fired!`);
  console.log(`[DEBUG] client:`, client.netname || 'unknown');
  console.log(`[DEBUG] commandText:`, JSON.stringify(commandText));
});

// Override engine command parsing functions
nodemod.on('engCmdArgs', () => {
  if (g_fakeCommandState.active) {
    console.log('engCmdArgs called, returned ', g_fakeCommandState.commandString);
    nodemod.setMetaResult(nodemod.MRES.SUPERCEDE);

    // Handle say/say_team bug like rcbotold
    if (g_fakeCommandState.commandString.startsWith('say ')) {
      return g_fakeCommandState.commandString.substring(4);
    } else if (g_fakeCommandState.commandString.startsWith('say_team ')) {
      return g_fakeCommandState.commandString.substring(9);
    }

    return g_fakeCommandState.commandString;
  }
  return '';
});

nodemod.on('engCmdArgv', (argc) => {
  if (g_fakeCommandState.active) {
    console.log(`[DEBUG] engCmdArgv(${argc})`);
    console.log(`[DEBUG] args array:`, JSON.stringify(g_fakeCommandState.args));
    console.log(`[DEBUG] returning:`, JSON.stringify(g_fakeCommandState.args[argc]));
    console.log(`[DEBUG] result length:`, g_fakeCommandState.args[argc].length);
    nodemod.setMetaResult(nodemod.MRES.SUPERCEDE);
    return g_fakeCommandState.args[argc] || '';
  }
  return '';
});

nodemod.on('engCmdArgc', () => {
  if (g_fakeCommandState.active) {
    console.log('engCmdArgc called, returned ', g_fakeCommandState.argCount);
    nodemod.setMetaResult(nodemod.MRES.SUPERCEDE);  
    return g_fakeCommandState.argCount;
  }
  return 0;
});