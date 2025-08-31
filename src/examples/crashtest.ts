console.log('=== Node.js Crash Test Suite ===');
  console.log('Testing various operations that use DelayedTaskScheduler...');

  let testCount = 0;
  let completedTests = 0;

  function logTest(name: string, description: string) {
      testCount++;
      console.log(`\n[TEST ${testCount}] ${name}: ${description}`);
  }

  function markComplete(testNum: number) {
      completedTests++;
      console.log(`[TEST ${testNum} COMPLETE] (${completedTests}/${testCount} done)`);
  }

  // Test 1: Basic setTimeout (most likely crash trigger)
  logTest('setTimeout', 'Single delayed timer');
  setTimeout(() => {
      markComplete(1);
  }, 100);

  // Test 2: Multiple timers
  logTest('Multiple setTimeout', 'Multiple overlapping timers');
  for (let i = 0; i < 5; i++) {
      setTimeout(() => {
          console.log(`  Timer ${i} executed`);
          if (i === 4) markComplete(2);
      }, i * 50);
  }

  // Test 3: setInterval (recurring timer)
  logTest('setInterval', 'Recurring timer');
  let intervalCount = 0;
  const intervalId = setInterval(() => {
      intervalCount++;
      console.log(`  Interval tick ${intervalCount}`);
      if (intervalCount >= 3) {
          clearInterval(intervalId);
          markComplete(3);
      }
  }, 200);

  // Test 4: setImmediate (immediate scheduling)
  logTest('setImmediate', 'Immediate task scheduling');
  setImmediate(() => {
      console.log('  Immediate task executed');
      markComplete(4);
  });

  // Test 5: process.nextTick
  logTest('process.nextTick', 'Next tick scheduling');
  process.nextTick(() => {
      console.log('  NextTick executed');
      markComplete(5);
  });

  // Test 6: Promise resolution
  logTest('Promise.resolve', 'Promise microtask');
  Promise.resolve('promise-result').then((result) => {
      console.log(`  Promise resolved with: ${result}`);
      markComplete(6);
  });

  // Test 7: Async/await with timeout
  logTest('async/await', 'Async function with timer');
  (async () => {
      console.log('  Async function started');
      await new Promise(resolve => setTimeout(resolve, 150));
      console.log('  Async function completed');
      markComplete(7);
  })();

  // Test 8: Nested timers (stress test)
  logTest('Nested timers', 'Timers creating more timers');
  setTimeout(() => {
      console.log('  Level 1 timer');
      setTimeout(() => {
          console.log('  Level 2 timer');
          setTimeout(() => {
              console.log('  Level 3 timer');
              markComplete(8);
          }, 10);
      }, 10);
  }, 300);

  // Test 9: Rapid timer creation
  logTest('Rapid timers', 'Creating many timers quickly');
  let rapidCount = 0;
  for (let i = 0; i < 10; i++) {
      setTimeout(() => {
          rapidCount++;
          if (rapidCount === 10) {
              console.log('  All rapid timers completed');
              markComplete(9);
          }
      }, 50 + i);
  }

  // Test 10: File system (if available)
  logTest('File system', 'Async file operations');
  try {
      const fs = require('fs');
      fs.readFile('/etc/hostname', 'utf8', (err:any , data:any) => {
          if (err) {
              console.log('  File read failed (expected in some envs)');
          } else {
              console.log('  File read success');
          }
          markComplete(10);
      });
  } catch (e) {
      console.log('  FS module not available');
      markComplete(10);
  }

  // Test 11: Worker threads (if available)
  logTest('Worker threads', 'Creating worker thread');
  try {
      const { Worker } = require('worker_threads');
      const worker = new Worker(`
          const { parentPort } = require('worker_threads');
          parentPort.postMessage('worker-hello');
      `, { eval: true });

      worker.on('message', (msg: string) => {
          console.log(`  Worker message: ${msg}`);
          worker.terminate();
          markComplete(11);
      });

      worker.on('error', (err: string) => {
          console.log(`  Worker error: ${err}`);
          markComplete(11);
      });
  } catch (e) {
      console.log('  Worker threads not available');
      markComplete(11);
  }

  // Test 12: HTTP server (network I/O)
  logTest('HTTP server', 'Creating HTTP server');
  try {
      const http = require('http');
      const server = http.createServer((req: any, res: any) => {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Hello from nodemod!');
          server.close(() => {
              console.log('  HTTP server closed');
              markComplete(12);
          });
      });

      server.listen(3020, () => {
          console.log('  HTTP server started on port 3000');
          // Make a request to ourselves
          const req = http.get('http://localhost:3020', (res: any) => {
              let data = '';
              res.on('data', (chunk: any) => data += chunk);
              res.on('end', () => {
                  console.log(`  HTTP response: ${data}`);
              });
          });
          req.on('error', (err: any) => {
              console.log(`  HTTP request error: ${err.message}`);
          });
      });

      server.on('error', (err: any) => {
          console.log(`  HTTP server error: ${err.message}`);
          markComplete(12);
      });
  } catch (e) {
      console.log('  HTTP module not available');
      markComplete(12);
  }

  // Summary timer
  setTimeout(() => {
      console.log('\n=== TEST SUMMARY ===');
      console.log(`Completed: ${completedTests}/${testCount} tests`);
      console.log('If you see this message, the basic timer system is working!');

      if (completedTests < testCount) {
          console.log('Some tests may still be running or failed...');
      } else {
          console.log('All tests completed successfully!');
      }
  }, 2000);

  console.log('\n=== Tests scheduled ===');
  console.log('Watch for crashes during execution...');
  console.log('The crash will likely happen before all tests complete.');
  // Stress test script
  console.log('=== Node.js Stress Test ===');

  // Create many overlapping timers
  for (let i = 0; i < 100; i++) {
      setTimeout(() => {
          console.log(`Stress timer ${i}`);

          // Each timer creates more work
          Promise.resolve().then(() => {
              process.nextTick(() => {
                  // Nested async work
              });
          });
      }, Math.random() * 1000);
  }

  // High frequency interval
  let counter = 0;
  const stressInterval = setInterval(() => {
      counter++;
      console.log(`Stress interval: ${counter}`);

      if (counter >= 50) {
          clearInterval(stressInterval);
          console.log('Stress test completed!');
      }
  }, 50);
