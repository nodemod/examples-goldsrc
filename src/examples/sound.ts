import nodemodCore from '@nodemod/core';
import { SoundChannel } from '@nodemod/core/sound';

const sound = nodemodCore.sound;
let serverReady = false;

// Wait for server to be ready before playing sounds
nodemodCore.events.on('dllServerActivate', () => {
  serverReady = true;
  console.log('Server activated - sounds can now be played');
  
  // Example 1: Basic sound emission to all players (after server ready)
  sound.emitSound({
    sound: 'misc/beep.wav',
    volume: 0.8,
    pitch: 100
  });
});

// Example 2: Play sound to specific player (only when server is ready)
nodemodCore.events.on('dllClientConnect', (client) => {
  if (serverReady) {
    sound.emitSound({
      entity: client,
      sound: 'misc/welcome.wav',
      channel: SoundChannel.voice,
      volume: 0.7
    });
  }
});

// Example 3: Client-side sound command (with server ready check)
nodemodCore.cmd.register('playsound', (client: nodemod.Entity, args: string[]) => {
  if (!serverReady) {
    nodemodCore.util.messageClient(client, 'Server not ready yet, sounds unavailable');
    return;
  }
  
  if (args.length < 1) {
    nodemodCore.util.messageClient(client, 'Usage: playsound <soundname>');
    return;
  }
  
  const soundName = args[0];
  if (sound.isValidSound(soundName)) {
    sound.emitClientSound(client, soundName);
    nodemodCore.util.messageClient(client, `Playing sound: ${soundName}`);
  } else {
    nodemodCore.util.messageClient(client, 'Invalid sound file format');
  }
});

// Example 4: Deferred sound examples (wait for server ready)
nodemodCore.events.on('dllServerActivate', () => {
  // Example 4a: Ambient sound at specific position
  sound.emitAmbientSound(
    [0, 0, 0], // Position coordinates
    'ambience/wind.wav',
    0.5, // Volume
    2.0, // Attenuation
    0,   // Flags
    90   // Pitch
  );

  // Example 4b: Broadcast sound to all players
  sound.broadcastSound('events/achievement.wav', {
    volume: 0.9,
    pitch: 110
  });

  // Example 4c: Multiple sounds with different configurations
  const soundConfigs = [
    { sound: 'weapons/reload.wav', volume: 0.6, channel: 1 },
    { sound: 'items/pickup.wav', volume: 0.4, channel: 3 },
    { sound: 'ui/select.wav', volume: 0.3, channel: 0 }
  ];

  const results = sound.emitMultipleSounds(soundConfigs);
  results.forEach((result, index) => {
    if (result.success) {
      console.log(`Sound ${index + 1} played successfully`);
    } else {
      console.error(`Sound ${index + 1} failed: ${result.error}`);
    }
  });
});

// Example 7: Stop sound on entity (with server ready check)
nodemodCore.cmd.register('stopsound', (client: nodemod.Entity) => {
  if (!serverReady) {
    nodemodCore.util.messageClient(client, 'Server not ready yet, sounds unavailable');
    return;
  }
  
  sound.stopSound(client, 2); // Stop voice channel sounds
  nodemodCore.util.messageClient(client, 'Voice sounds stopped');
});

// Example 8: Using sound constants (deferred until server ready)
nodemodCore.events.on('dllServerActivate', () => {
  sound.emitSound({
    sound: 'misc/warning.wav',
    volume: 1.0,
    attenuation: (sound.constructor as any).ATTENUATION?.NORMAL || 1,
    flags: (sound.constructor as any).FLAGS?.RELIABLE || 1,
    pitch: 100
  });
});

console.log('Sound examples loaded successfully!');
console.log('Available sound commands: playsound, stopsound');