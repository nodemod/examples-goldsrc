import nodemodCore from '@nodemod/core';

const resource = nodemodCore.resource;

// Example 1: Basic sound precaching
resource.precacheSound('misc/beep.wav', (id: number) => {
  console.log(`Sound precached with ID: ${id}`);
});

// Example 2: Model precaching with promise
resource.precacheModel('models/player.mdl').then((id: number) => {
  console.log(`Model precached with ID: ${id}`);
});

// Example 3: Generic resource precaching
resource.precacheGeneric('sprites/logo.spr').then((id: number) => {
  console.log(`Generic resource precached with ID: ${id}`);
});

// Example 4: Batch precaching multiple resources
const resourceList = [
  { type: 'sound' as const, path: 'misc/beep.wav' },
  { type: 'sound' as const, path: 'misc/click.wav' },
  { type: 'model' as const, path: 'models/player.mdl' },
  { type: 'generic' as const, path: 'sprites/logo.spr' }
];

resource.precacheBatch(resourceList).then((ids) => {
  console.log(`Batch precaching completed. IDs: ${ids.join(', ')}`);
});

// Example 5: Queue management
console.log(`Current queue length: ${resource.getQueueLength()}`);

// Example 6: Clearing the queue (if needed)
// resource.clearQueue();
// console.log(`Queue cleared. New length: ${resource.getQueueLength()}`);

// Example 7: Precaching game assets on plugin load
const gameAssets = [
  { type: 'sound' as const, path: 'weapons/ak47/ak47-1.wav' },
  { type: 'sound' as const, path: 'weapons/ak47/ak47-2.wav' },
  { type: 'model' as const, path: 'models/w_ak47.mdl' },
  { type: 'model' as const, path: 'models/p_ak47.mdl' }
];

resource.precacheBatch(gameAssets).then(() => {
  console.log('Game assets precached successfully!');
});

console.log('Resource examples loaded successfully!');
console.log('Resources will be precached when dllSpawn event fires');