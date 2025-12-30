import nodemodCore from '@nodemod/core';
import NodemodFile from '@nodemod/core/file';

const file = nodemodCore.file;

// Example 1: Basic file loading and cleanup
nodemodCore.cmd.registerClient('loadfile', (client: nodemod.Entity, args: string[]) => {
  if (args.length < 1) {
    nodemodCore.util.messageClient(client, 'Usage: loadfile <filename>');
    return;
  }
  
  const filename = args[0];
  const buffer = file.load(filename);

  console.log(buffer);
  
  if (buffer && buffer.length > 0) {

    console.log('freeing');
    const size = buffer.length;
    nodemodCore.util.messageClient(client, `Loaded ${filename}: ${size} bytes`);
    
    // Always free the buffer when done!
    file.free(buffer);
  } else {
    nodemodCore.util.messageClient(client, `Failed to load ${filename}`);
  }
});

// Example 2: File existence and size checking
nodemodCore.cmd.registerClient('fileinfo', (client: nodemod.Entity, args: string[]) => {
  if (args.length < 1) {
    nodemodCore.util.messageClient(client, 'Usage: fileinfo <filename>');
    return;
  }
  
  const filename = args[0];
  const exists = file.exists(filename);
  const size = file.getSize(filename);
  
  let message = `File: ${filename}\n`;
  message += `Exists: ${exists ? 'Yes' : 'No'}\n`;
  message += `Size: ${size} bytes`;
  
  nodemodCore.util.messageClient(client, message);
});

// Example 3: Reading text files with automatic cleanup
nodemodCore.cmd.registerClient('readtext', (client: nodemod.Entity, args: string[]) => {
  if (args.length < 1) {
    nodemodCore.util.messageClient(client, 'Usage: readtext <filename>');
    return;
  }
  
  const filename = args[0];
  const content = file.readText(filename);
  
  if (content) {
    const lines = content.split('\n').length;
    const chars = content.length;
    nodemodCore.util.messageClient(client, 
      `Read ${filename}: ${lines} lines, ${chars} characters`);
  } else {
    nodemodCore.util.messageClient(client, `Could not read text from ${filename}`);
  }
});

// Example 4: Configuration file parsing
nodemodCore.cmd.registerClient('loadconfig', (client: nodemod.Entity, args: string[]) => {
  const configFile = args.length > 0 ? args[0] : 'server.cfg';
  const config = file.loadConfig(configFile);
  
  if (config) {
    const keys = Object.keys(config);
    let message = `Config ${configFile} loaded:\n`;
    keys.slice(0, 5).forEach(key => {
      message += `${key}=${config[key]}\n`;
    });
    
    if (keys.length > 5) {
      message += `... and ${keys.length - 5} more settings`;
    }
    
    nodemodCore.util.messageClient(client, message);
  } else {
    nodemodCore.util.messageClient(client, `Config file ${configFile} not found`);
  }
});

// Example 5: Resource file validation
nodemodCore.cmd.registerClient('checkresource', (client: nodemod.Entity, args: string[]) => {
  if (args.length < 2) {
    nodemodCore.util.messageClient(client, 'Usage: checkresource <type> <name>');
    nodemodCore.util.messageClient(client, 'Types: model, sound, map');
    return;
  }
  
  const [type, name] = args;
  let isValid = false;
  
  switch (type) {
    case 'model':
      isValid = file.isValidModelFile(name);
      break;
    case 'sound':
      isValid = file.isValidSoundFile(name);
      break;
    case 'map':
      isValid = file.isValidMapFile(name);
      break;
    default:
      nodemodCore.util.messageClient(client, 'Invalid type. Use: model, sound, map');
      return;
  }
  
  const path = file.buildResourcePath(type, name);
  nodemodCore.util.messageClient(client, 
    `${type} "${name}" is ${isValid ? 'valid' : 'invalid'}\nPath: ${path}`);
});

// Example 6: File path utilities
nodemodCore.cmd.registerClient('filepath', (client: nodemod.Entity, args: string[]) => {
  if (args.length < 1) {
    nodemodCore.util.messageClient(client, 'Usage: filepath <filename>');
    return;
  }
  
  const filename = args[0];
  const normalized = file.normalizePath(filename);
  const extension = file.getExtension(filename);
  const basename = file.getBasename(filename);
  const directory = file.getDirectory(filename);
  
  let message = `File path analysis:\n`;
  message += `Original: ${filename}\n`;
  message += `Normalized: ${normalized}\n`;
  message += `Directory: ${directory || '(none)'}\n`;
  message += `Basename: ${basename}\n`;
  message += `Extension: ${extension || '(none)'}`;
  
  nodemodCore.util.messageClient(client, message);
});

// Example 7: Game directory information
nodemodCore.cmd.registerClient('gamedir', (client: nodemod.Entity) => {
  const gameDir = file.getGameDir();
  const commonFiles = [
    NodemodFile.PATHS.CONFIG,
    NodemodFile.PATHS.MOTD,
    NodemodFile.PATHS.MAPCYCLE
  ];
  
  let message = `Game directory: ${gameDir}\n\nCommon files:\n`;
  commonFiles.forEach(filename => {
    const exists = file.exists(filename);
    const size = exists ? file.getSize(filename) : 0;
    message += `${filename}: ${exists ? `${size}b` : 'missing'}\n`;
  });
  
  nodemodCore.util.messageClient(client, message);
});

// Example 8: Batch file operations
nodemodCore.cmd.registerClient('batchload', (client: nodemod.Entity) => {
  const filesToCheck = [
    'server.cfg',
    'motd.txt',
    'mapcycle.txt',
    'banned.cfg',
    'listip.cfg'
  ];
  
  const results = file.loadMultiple(filesToCheck);
  
  let message = 'Batch file check results:\n';
  Object.entries(results).forEach(([filename, result]) => {
    message += `${filename}: ${result.exists ? `${result.size}b` : 'missing'}\n`;
  });
  
  nodemodCore.util.messageClient(client, message);
  
  // Clean up all loaded buffers
  file.freeMultiple(results);
});

// Example 9: File comparison
nodemodCore.cmd.registerClient('comparefiles', (client: nodemod.Entity, args: string[]) => {
  if (args.length < 2) {
    nodemodCore.util.messageClient(client, 'Usage: comparefiles <file1> <file2>');
    return;
  }
  
  const [file1, file2] = args;
  const size1 = file.getSize(file1);
  const size2 = file.getSize(file2);
  const comparison = file.compareTime(file1, file2);
  
  let message = `File comparison:\n`;
  message += `${file1}: ${size1}b\n`;
  message += `${file2}: ${size2}b\n`;
  
  if (comparison > 0) {
    message += `${file1} is newer`;
  } else if (comparison < 0) {
    message += `${file2} is newer`;
  } else {
    message += 'Files have same modification time';
  }
  
  nodemodCore.util.messageClient(client, message);
});

// Example 10: File watching with cleanup
let fileWatchers: (() => void)[] = [];

nodemodCore.cmd.registerClient('watchfile', (client: nodemod.Entity, args: string[]) => {
  if (args.length < 1) {
    nodemodCore.util.messageClient(client, 'Usage: watchfile <filename>');
    return;
  }
  
  const filename = args[0];
  
  const stopWatching = file.watch(filename, (event) => {
    console.log(`File ${event.filename} changed: ${event.oldSize}b -> ${event.newSize}b`);
    
    // Notify all players
    nodemod.players.forEach(player => {
      if (player && player.netname) {
        nodemodCore.util.messageClient(player, 
          `File ${filename} changed! Size: ${event.newSize}b`);
      }
    });
  }, 2000); // Check every 2 seconds
  
  fileWatchers.push(stopWatching);
  nodemodCore.util.messageClient(client, `Now watching ${filename} for changes`);
});

nodemodCore.cmd.registerClient('stopwatch', (client: nodemod.Entity) => {
  fileWatchers.forEach(stopFn => stopFn());
  fileWatchers = [];
  nodemodCore.util.messageClient(client, 'Stopped all file watchers');
});

// Example 11: Using loadWithCleanup for custom processing
nodemodCore.cmd.registerClient('analyzetext', (client: nodemod.Entity, args: string[]) => {
  if (args.length < 1) {
    nodemodCore.util.messageClient(client, 'Usage: analyzetext <filename>');
    return;
  }
  
  const filename = args[0];
  
  const analysis = file.loadWithCleanup(filename, (buffer) => {
    if (!buffer) return null;
    
    const text = buffer.toString();
    const lines = text.split('\n');
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const chars = text.length;
    
    return {
      lines: lines.length,
      words: words.length,
      characters: chars,
      avgWordsPerLine: Math.round(words.length / lines.length * 100) / 100
    };
  });
  
  if (analysis) {
    let message = `Text analysis of ${filename}:\n`;
    message += `Lines: ${analysis.lines}\n`;
    message += `Words: ${analysis.words}\n`;
    message += `Characters: ${analysis.characters}\n`;
    message += `Avg words/line: ${analysis.avgWordsPerLine}`;
    
    nodemodCore.util.messageClient(client, message);
  } else {
    nodemodCore.util.messageClient(client, `Could not analyze ${filename}`);
  }
});

// Example 12: Resource path building
nodemodCore.cmd.registerClient('buildpath', (client: nodemod.Entity, args: string[]) => {
  if (args.length < 2) {
    nodemodCore.util.messageClient(client, 'Usage: buildpath <type> <name>');
    nodemodCore.util.messageClient(client, 'Types: model, sound, sprite, map, config');
    return;
  }
  
  const [type, name] = args;
  const path = file.buildResourcePath(type, name);
  const exists = file.resourceExists(type, name);
  
  nodemodCore.util.messageClient(client, 
    `${type} path: ${path}\nExists: ${exists ? 'Yes' : 'No'}`);
});

// Clean up watchers on plugin unload
process.on('exit', () => {
  fileWatchers.forEach(stopFn => stopFn());
});

console.log('File examples loaded successfully!');
console.log('Available commands: loadfile, fileinfo, readtext, loadconfig, checkresource,');
console.log('  filepath, gamedir, batchload, comparefiles, watchfile, stopwatch,');
console.log('  analyzetext, buildpath');