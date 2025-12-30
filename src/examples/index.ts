// NodeMod Plugin Examples
// This file demonstrates various features of the NodeMod TypeScript framework

import nodemodCore from '@nodemod/core';
import { initializeMenuExamples } from './menu';
// import './examples/cmd';
// import './examples/msg';
// import './examples/resource';
// import './examples/entity';
// import './examples/sound';
// import './examples/events';
// import './examples/file';
// import './examples/player';
// import './examples/cvar';
// import './examples/engine';
import './cmd';
import './msg';
import './resource';
import './entity';
import './sound';
import './events';
import './file';
import './player';
import './cvar';
import './engine';
//import './examples/crashtest';

import inspector from 'inspector';

// Expose nodemodCore globally for debugging
(global as any).nodemodCore = nodemodCore;

// requires process.stdin.resume() at the end to keep running
inspector.open(9229, 'localhost');

// To keep the plugin running for testing purposes
process.stdin.resume();


/** Implementation **/

console.log('NodeMod TypeScript Plugin Loading...');
console.log(`NodeMod Core Library Version: ${nodemodCore.constructor.name}`);

// Initialize all examples
function initializeExamples() {
  console.log('Initializing NodeMod examples...');
  
  // Initialize menu system examples
  initializeMenuExamples();
  
  nodemodCore.cmd.registerClient('say', (client, args) => {
    nodemodCore.util.messageClient(client, `You spoke: ${args.join(' ')}\n`);
  });

  nodemodCore.cmd.registerClient('say_team', (client, args) => {
    nodemodCore.util.messageClient(client, `You teamspoke: ${args.join(' ')}\n`);
  });

  // Basic command example
  nodemodCore.cmd.registerClient('hello', (client, args) => {
    nodemodCore.util.messageClient(client, `Hello ${client.netname}! Arguments: ${args.join(' ')}\n`);
    nodemod.eng.createFakeClient("fucku")
  });

  // Server info command
  nodemodCore.cmd.registerClient('serverinfo2', (client, args) => {
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

// Enable bot commands by patching memory (Linux only)
const fs = require('fs');

function getLibraryBaseAddress(libraryName: string): number | null {
  try {
    const mapsContent = fs.readFileSync('/proc/self/maps', 'utf8');
    const lines = mapsContent.split('\n');

    for (const line of lines) {
      if (line.includes(libraryName) && line.includes('r-xp')) {
        // Parse line like: "7f8b4c000000-7f8b4c100000 r-xp 00000000 08:01 123456 /path/to/ts_i386.so"
        const addressRange = line.split(' ')[0];
        const baseAddress = addressRange.split('-')[0];
        return parseInt(baseAddress, 16);
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to read memory maps:', error);
    return null;
  }
}

function patchMemory(address: number, bytes: number[]): boolean {
  // On Linux, write directly to /proc/self/mem
  try {
    const fd = fs.openSync('/proc/self/mem', 'r+');
    const buffer = Buffer.from(bytes);
    fs.writeSync(fd, buffer, 0, buffer.length, address);
    fs.closeSync(fd);
    return true;
  } catch (error) {
    console.error('Memory patch failed:', error);
    return false;
  }
}

(global as any).enableBotCommands = () => {
  const baseAddr = getLibraryBaseAddress('ts_i386.so');
  if (!baseAddr) {
    console.log('Could not find ts_i386.so base address');
    return false;
  }

  console.log(`Library base address: 0x${baseAddr.toString(16)}`);

  // Patch both functions to just return (0xC3 = ret instruction)
  const success1 = patchMemory(baseAddr + 0xb5520, [0xC3]); // cmd_addbot
  const success2 = patchMemory(baseAddr + 0xb5550, [0xC3]); // cmd_addcustombot

  if (success1 && success2) {
    console.log('Bot commands successfully patched!');
    return true;
  } else {
    console.log('Failed to patch bot commands');
    return false;
  }
}
// Global state for fake client commands
let fakeCommand = {
    isActive: false,
    argv: [] as string[],
    argc: 0,
    args: ""
};

// Command argument parsing function
function parseCommandArgs(command: string): string[] {
    const args: string[] = [];
    let current = "";
    let inQuotes = false;
    let i = 0;

    // Skip leading spaces
    while (i < command.length && command[i] === ' ') i++;

    while (i < command.length) {
        const char = command[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ' ' && !inQuotes) {
            if (current) {
                args.push(current);
                current = "";
            }
            // Skip multiple spaces
            while (i + 1 < command.length && command[i + 1] === ' ') i++;
        } else {
            current += char;
        }
        i++;
    }

    if (current) {
        args.push(current);
    }

    return args;
}

// let fakeClient: any = null;
// nodemod.on('postDllServerActivate', () => {
//   let fakeClient = nodemod.eng.createFakeClient("FakeBot");
// });

// Main FakeClientCommand function
(globalThis as any).fakeClientCommand = (pFakeClient: any, fmt: string, ...args: any[]) => {
    if (!pFakeClient) {
        console.error("FakeClientCommand: No fakeclient!");
        return;
    }

    if (!fmt) return;

    // Format the command string (basic sprintf-like replacement)
    let command = fmt;
    let argIndex = 0;
    command = command.replace(/%[sd]/g, (match) => {
        return argIndex < args.length ? String(args[argIndex++]) : match;
    });

    if (!command || command === '\n') {
        console.error("FakeClientCommand: No command!");
        return;
    }

    const length = command.length;
    let stringindex = 0;

    // Process individual commands separated by semicolons
    while (stringindex < length) {
        const fieldstart = stringindex;

        // Find end of current command (semicolon or end)
        while (stringindex < length && command[stringindex] !== ';') {
            stringindex++;
        }

        let fieldstop = stringindex - 1;
        if (command[fieldstop] === '\n') {
            fieldstop--;
        }

        // Extract current command
        const currentCommand = command.substring(fieldstart, fieldstop + 1).trim();

        if (currentCommand) {
            // Parse arguments
            const argv = parseCommandArgs(currentCommand);

            // Set up fake command globals
            fakeCommand.isActive = true;
            fakeCommand.argv = argv;
            fakeCommand.argc = argv.length;
            fakeCommand.args = currentCommand;

            // Execute the command through metamod
            nodemod.dll.clientCommand(pFakeClient);
        }

        stringindex++; // Skip semicolon
    }

    // Reset globals
    fakeCommand.isActive = false;
    fakeCommand.argv = [];
    fakeCommand.argc = 0;
    fakeCommand.args = "";
}

// Event handlers to intercept command functions with OVERRIDE
nodemod.on('engCmdArgs', () => {
  console.log('args', fakeCommand);
    if (fakeCommand.isActive) {
        nodemod.setMetaResult(3); // MRES_OVERRIDE
        return fakeCommand.args;
    }

    return "";
});

nodemod.on('engCmdArgv', (index: number) => {
  console.log('argv', fakeCommand);
    if (fakeCommand.isActive) {
        nodemod.setMetaResult(3); // MRES_OVERRIDE
        return fakeCommand.argv[index] || "";
    }
    return "";
});

nodemod.on('engCmdArgc', () => {
  console.log('argc', fakeCommand);
    if (fakeCommand.isActive) {
        nodemod.setMetaResult(3); // MRES_OVERRIDE
        return fakeCommand.argc;
    }
    return 0;
});