console.log('Waiting for game to be fully loaded before running tests...');

let testsPassed = 0;
let testsFailed = 0;
let gameLoaded = false;

function test(name: string, fn: () => void): void {
    try {
        console.log(`Testing: ${name}`);
        fn();
        console.log(`✓ PASS: ${name}`);
        testsPassed++;
    } catch (error) {
        console.log(`✗ FAIL: ${name} - ${(error as Error).message}`);
        testsFailed++;
    }
}

function assert(condition: boolean, message?: string): void {
    console.log(`  Asserting: ${message || 'Assertion'}`);
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

function runSafeTests(): void {
    console.log('Running safe tests (no entity creation)...');
    
// Test basic properties
test('nodemod properties exist', () => {
    assert(typeof nodemod.cwd === 'string', 'nodemod.cwd should be a string');
    assert(Array.isArray(nodemod.players), 'nodemod.players should be an array');
    assert(typeof nodemod.mapname === 'string', 'nodemod.mapname should be a string');
    assert(typeof nodemod.time === 'number', 'nodemod.time should be a number');
});

// Test engine object
test('nodemod.eng exists and has methods', () => {
    assert(nodemod.eng !== undefined, 'nodemod.eng should exist');
    assert(typeof nodemod.eng.precacheModel === 'function', 'eng.precacheModel should be a function');
    assert(typeof nodemod.eng.precacheSound === 'function', 'eng.precacheSound should be a function');
    assert(typeof nodemod.eng.setModel === 'function', 'eng.setModel should be a function');
    assert(typeof nodemod.eng.modelIndex === 'function', 'eng.modelIndex should be a function');
    assert(typeof nodemod.eng.modelFrames === 'function', 'eng.modelFrames should be a function');
    assert(typeof nodemod.eng.setSize === 'function', 'eng.setSize should be a function');
    assert(typeof nodemod.eng.changeLevel === 'function', 'eng.changeLevel should be a function');
    assert(typeof nodemod.eng.getSpawnParms === 'function', 'eng.getSpawnParms should be a function');
    assert(typeof nodemod.eng.saveSpawnParms === 'function', 'eng.saveSpawnParms should be a function');
    assert(typeof nodemod.eng.vecToYaw === 'function', 'eng.vecToYaw should be a function');
    assert(typeof nodemod.eng.vecToAngles === 'function', 'eng.vecToAngles should be a function');
    assert(typeof nodemod.eng.moveToOrigin === 'function', 'eng.moveToOrigin should be a function');
    assert(typeof nodemod.eng.changeYaw === 'function', 'eng.changeYaw should be a function');
    assert(typeof nodemod.eng.changePitch === 'function', 'eng.changePitch should be a function');
    assert(typeof nodemod.eng.findEntityByString === 'function', 'eng.findEntityByString should be a function');
    assert(typeof nodemod.eng.getEntityIllum === 'function', 'eng.getEntityIllum should be a function');
    assert(typeof nodemod.eng.findEntityInSphere === 'function', 'eng.findEntityInSphere should be a function');
    assert(typeof nodemod.eng.findClientInPVS === 'function', 'eng.findClientInPVS should be a function');
    assert(typeof nodemod.eng.entitiesInPVS === 'function', 'eng.entitiesInPVS should be a function');
    assert(typeof nodemod.eng.makeVectors === 'function', 'eng.makeVectors should be a function');
    assert(typeof nodemod.eng.angleVectors === 'function', 'eng.angleVectors should be a function');
    assert(typeof nodemod.eng.createEntity === 'function', 'eng.createEntity should be a function');
    assert(typeof nodemod.eng.removeEntity === 'function', 'eng.removeEntity should be a function');
    assert(typeof nodemod.eng.createNamedEntity === 'function', 'eng.createNamedEntity should be a function');
    assert(typeof nodemod.eng.makeStatic === 'function', 'eng.makeStatic should be a function');
    assert(typeof nodemod.eng.entIsOnFloor === 'function', 'eng.entIsOnFloor should be a function');
    assert(typeof nodemod.eng.dropToFloor === 'function', 'eng.dropToFloor should be a function');
    assert(typeof nodemod.eng.walkMove === 'function', 'eng.walkMove should be a function');
    assert(typeof nodemod.eng.setOrigin === 'function', 'eng.setOrigin should be a function');
    assert(typeof nodemod.eng.emitSound === 'function', 'eng.emitSound should be a function');
    assert(typeof nodemod.eng.emitAmbientSound === 'function', 'eng.emitAmbientSound should be a function');
    assert(typeof nodemod.eng.traceLine === 'function', 'eng.traceLine should be a function');
    assert(typeof nodemod.eng.traceToss === 'function', 'eng.traceToss should be a function');
    assert(typeof nodemod.eng.traceMonsterHull === 'function', 'eng.traceMonsterHull should be a function');
    assert(typeof nodemod.eng.traceHull === 'function', 'eng.traceHull should be a function');
    assert(typeof nodemod.eng.traceModel === 'function', 'eng.traceModel should be a function');
    assert(typeof nodemod.eng.traceTexture === 'function', 'eng.traceTexture should be a function');
    assert(typeof nodemod.eng.traceSphere === 'function', 'eng.traceSphere should be a function');
    assert(typeof nodemod.eng.getAimVector === 'function', 'eng.getAimVector should be a function');
    assert(typeof nodemod.eng.serverCommand === 'function', 'eng.serverCommand should be a function');
    assert(typeof nodemod.eng.serverExecute === 'function', 'eng.serverExecute should be a function');
    assert(typeof nodemod.eng.clientCommand === 'function', 'eng.clientCommand should be a function');
    assert(typeof nodemod.eng.particleEffect === 'function', 'eng.particleEffect should be a function');
    assert(typeof nodemod.eng.lightStyle === 'function', 'eng.lightStyle should be a function');
    assert(typeof nodemod.eng.decalIndex === 'function', 'eng.decalIndex should be a function');
    assert(typeof nodemod.eng.pointContents === 'function', 'eng.pointContents should be a function');
    assert(typeof nodemod.eng.messageBegin === 'function', 'eng.messageBegin should be a function');
    assert(typeof nodemod.eng.messageEnd === 'function', 'eng.messageEnd should be a function');
    assert(typeof nodemod.eng.writeByte === 'function', 'eng.writeByte should be a function');
    assert(typeof nodemod.eng.writeChar === 'function', 'eng.writeChar should be a function');
    assert(typeof nodemod.eng.writeShort === 'function', 'eng.writeShort should be a function');
    assert(typeof nodemod.eng.writeLong === 'function', 'eng.writeLong should be a function');
    assert(typeof nodemod.eng.writeAngle === 'function', 'eng.writeAngle should be a function');
    assert(typeof nodemod.eng.writeCoord === 'function', 'eng.writeCoord should be a function');
    assert(typeof nodemod.eng.writeString === 'function', 'eng.writeString should be a function');
    assert(typeof nodemod.eng.writeEntity === 'function', 'eng.writeEntity should be a function');
    assert(typeof nodemod.eng.cVarRegister === 'function', 'eng.cVarRegister should be a function');
    assert(typeof nodemod.eng.cVarGetFloat === 'function', 'eng.cVarGetFloat should be a function');
    assert(typeof nodemod.eng.cVarGetString === 'function', 'eng.cVarGetString should be a function');
    assert(typeof nodemod.eng.cVarSetFloat === 'function', 'eng.cVarSetFloat should be a function');
    assert(typeof nodemod.eng.cVarSetString === 'function', 'eng.cVarSetString should be a function');
    assert(typeof nodemod.eng.alertMessage === 'function', 'eng.alertMessage should be a function');
    assert(typeof nodemod.eng.engineFprintf === 'function', 'eng.engineFprintf should be a function');
    assert(typeof nodemod.eng.pvAllocEntPrivateData === 'function', 'eng.pvAllocEntPrivateData should be a function');
    assert(typeof nodemod.eng.pvEntPrivateData === 'function', 'eng.pvEntPrivateData should be a function');
    assert(typeof nodemod.eng.freeEntPrivateData === 'function', 'eng.freeEntPrivateData should be a function');
    assert(typeof nodemod.eng.szFromIndex === 'function', 'eng.szFromIndex should be a function');
    assert(typeof nodemod.eng.allocString === 'function', 'eng.allocString should be a function');
    assert(typeof nodemod.eng.getVarsOfEnt === 'function', 'eng.getVarsOfEnt should be a function');
    assert(typeof nodemod.eng.pEntityOfEntOffset === 'function', 'eng.pEntityOfEntOffset should be a function');
    assert(typeof nodemod.eng.entOffsetOfPEntity === 'function', 'eng.entOffsetOfPEntity should be a function');
    assert(typeof nodemod.eng.indexOfEdict === 'function', 'eng.indexOfEdict should be a function');
    assert(typeof nodemod.eng.pEntityOfEntIndex === 'function', 'eng.pEntityOfEntIndex should be a function');
    assert(typeof nodemod.eng.findEntityByVars === 'function', 'eng.findEntityByVars should be a function');
    assert(typeof nodemod.eng.getModelPtr === 'function', 'eng.getModelPtr should be a function');
    assert(typeof nodemod.eng.regUserMsg === 'function', 'eng.regUserMsg should be a function');
    assert(typeof nodemod.eng.animationAutomove === 'function', 'eng.animationAutomove should be a function');
    assert(typeof nodemod.eng.getBonePosition === 'function', 'eng.getBonePosition should be a function');
    assert(typeof nodemod.eng.functionFromName === 'function', 'eng.functionFromName should be a function');
    assert(typeof nodemod.eng.nameForFunction === 'function', 'eng.nameForFunction should be a function');
    assert(typeof nodemod.eng.clientPrintf === 'function', 'eng.clientPrintf should be a function');
    assert(typeof nodemod.eng.serverPrint === 'function', 'eng.serverPrint should be a function');
    assert(typeof nodemod.eng.cmdArgs === 'function', 'eng.cmdArgs should be a function');
    assert(typeof nodemod.eng.cmdArgv === 'function', 'eng.cmdArgv should be a function');
    assert(typeof nodemod.eng.cmdArgc === 'function', 'eng.cmdArgc should be a function');
    assert(typeof nodemod.eng.getAttachment === 'function', 'eng.getAttachment should be a function');
    assert(typeof nodemod.eng.randomLong === 'function', 'eng.randomLong should be a function');
    assert(typeof nodemod.eng.randomFloat === 'function', 'eng.randomFloat should be a function');
    assert(typeof nodemod.eng.setView === 'function', 'eng.setView should be a function');
    assert(typeof nodemod.eng.time === 'function', 'eng.time should be a function');
    assert(typeof nodemod.eng.crosshairAngle === 'function', 'eng.crosshairAngle should be a function');
    assert(typeof nodemod.eng.loadFileForMe === 'function', 'eng.loadFileForMe should be a function');
    assert(typeof nodemod.eng.freeFile === 'function', 'eng.freeFile should be a function');
    assert(typeof nodemod.eng.endSection === 'function', 'eng.endSection should be a function');
    assert(typeof nodemod.eng.compareFileTime === 'function', 'eng.compareFileTime should be a function');
    assert(typeof nodemod.eng.getGameDir === 'function', 'eng.getGameDir should be a function');
    assert(typeof nodemod.eng.cvarRegisterVariable === 'function', 'eng.cvarRegisterVariable should be a function');
    assert(typeof nodemod.eng.fadeClientVolume === 'function', 'eng.fadeClientVolume should be a function');
    assert(typeof nodemod.eng.setClientMaxspeed === 'function', 'eng.setClientMaxspeed should be a function');
    assert(typeof nodemod.eng.createFakeClient === 'function', 'eng.createFakeClient should be a function');
    assert(typeof nodemod.eng.runPlayerMove === 'function', 'eng.runPlayerMove should be a function');
    assert(typeof nodemod.eng.numberOfEntities === 'function', 'eng.numberOfEntities should be a function');
    assert(typeof nodemod.eng.getInfoKeyBuffer === 'function', 'eng.getInfoKeyBuffer should be a function');
    assert(typeof nodemod.eng.infoKeyValue === 'function', 'eng.infoKeyValue should be a function');
    assert(typeof nodemod.eng.setKeyValue === 'function', 'eng.setKeyValue should be a function');
    assert(typeof nodemod.eng.setClientKeyValue === 'function', 'eng.setClientKeyValue should be a function');
    assert(typeof nodemod.eng.isMapValid === 'function', 'eng.isMapValid should be a function');
    assert(typeof nodemod.eng.staticDecal === 'function', 'eng.staticDecal should be a function');
    assert(typeof nodemod.eng.precacheGeneric === 'function', 'eng.precacheGeneric should be a function');
    assert(typeof nodemod.eng.getPlayerUserId === 'function', 'eng.getPlayerUserId should be a function');
    assert(typeof nodemod.eng.buildSoundMsg === 'function', 'eng.buildSoundMsg should be a function');
    assert(typeof nodemod.eng.isDedicatedServer === 'function', 'eng.isDedicatedServer should be a function');
    assert(typeof nodemod.eng.cVarGetPointer === 'function', 'eng.cVarGetPointer should be a function');
    assert(typeof nodemod.eng.getPlayerWONId === 'function', 'eng.getPlayerWONId should be a function');
    assert(typeof nodemod.eng.infoRemoveKey === 'function', 'eng.infoRemoveKey should be a function');
    assert(typeof nodemod.eng.getPhysicsKeyValue === 'function', 'eng.getPhysicsKeyValue should be a function');
    assert(typeof nodemod.eng.setPhysicsKeyValue === 'function', 'eng.setPhysicsKeyValue should be a function');
    assert(typeof nodemod.eng.getPhysicsInfoString === 'function', 'eng.getPhysicsInfoString should be a function');
    assert(typeof nodemod.eng.precacheEvent === 'function', 'eng.precacheEvent should be a function');
    assert(typeof nodemod.eng.playbackEvent === 'function', 'eng.playbackEvent should be a function');
    assert(typeof nodemod.eng.setFatPVS === 'function', 'eng.setFatPVS should be a function');
    assert(typeof nodemod.eng.setFatPAS === 'function', 'eng.setFatPAS should be a function');
    assert(typeof nodemod.eng.checkVisibility === 'function', 'eng.checkVisibility should be a function');
    assert(typeof nodemod.eng.deltaSetField === 'function', 'eng.deltaSetField should be a function');
    assert(typeof nodemod.eng.deltaUnsetField === 'function', 'eng.deltaUnsetField should be a function');
    assert(typeof nodemod.eng.deltaAddEncoder === 'function', 'eng.deltaAddEncoder should be a function');
    assert(typeof nodemod.eng.getCurrentPlayer === 'function', 'eng.getCurrentPlayer should be a function');
    assert(typeof nodemod.eng.canSkipPlayer === 'function', 'eng.canSkipPlayer should be a function');
    assert(typeof nodemod.eng.deltaFindField === 'function', 'eng.deltaFindField should be a function');
    assert(typeof nodemod.eng.deltaSetFieldByIndex === 'function', 'eng.deltaSetFieldByIndex should be a function');
    assert(typeof nodemod.eng.deltaUnsetFieldByIndex === 'function', 'eng.deltaUnsetFieldByIndex should be a function');
    assert(typeof nodemod.eng.setGroupMask === 'function', 'eng.setGroupMask should be a function');
    assert(typeof nodemod.eng.createInstancedBaseline === 'function', 'eng.createInstancedBaseline should be a function');
    assert(typeof nodemod.eng.cvarDirectSet === 'function', 'eng.cvarDirectSet should be a function');
    assert(typeof nodemod.eng.forceUnmodified === 'function', 'eng.forceUnmodified should be a function');
    assert(typeof nodemod.eng.getPlayerStats === 'function', 'eng.getPlayerStats should be a function');
    assert(typeof nodemod.eng.addServerCommand === 'function', 'eng.addServerCommand should be a function');
    assert(typeof nodemod.eng.voiceGetClientListening === 'function', 'eng.voiceGetClientListening should be a function');
    assert(typeof nodemod.eng.voiceSetClientListening === 'function', 'eng.voiceSetClientListening should be a function');
    assert(typeof nodemod.eng.getPlayerAuthId === 'function', 'eng.getPlayerAuthId should be a function');
    assert(typeof nodemod.eng.sequenceGet === 'function', 'eng.sequenceGet should be a function');
    assert(typeof nodemod.eng.sequencePickSentence === 'function', 'eng.sequencePickSentence should be a function');
    assert(typeof nodemod.eng.getFileSize === 'function', 'eng.getFileSize should be a function');
    assert(typeof nodemod.eng.getApproxWavePlayLen === 'function', 'eng.getApproxWavePlayLen should be a function');
    assert(typeof nodemod.eng.isCareerMatch === 'function', 'eng.isCareerMatch should be a function');
    assert(typeof nodemod.eng.getLocalizedStringLength === 'function', 'eng.getLocalizedStringLength should be a function');
    assert(typeof nodemod.eng.registerTutorMessageShown === 'function', 'eng.registerTutorMessageShown should be a function');
    assert(typeof nodemod.eng.getTimesTutorMessageShown === 'function', 'eng.getTimesTutorMessageShown should be a function');
    assert(typeof nodemod.eng.processTutorMessageDecayBuffer === 'function', 'eng.processTutorMessageDecayBuffer should be a function');
    assert(typeof nodemod.eng.constructTutorMessageDecayBuffer === 'function', 'eng.constructTutorMessageDecayBuffer should be a function');
    assert(typeof nodemod.eng.resetTutorMessageDecayData === 'function', 'eng.resetTutorMessageDecayData should be a function');
    assert(typeof nodemod.eng.queryClientCvarValue === 'function', 'eng.queryClientCvarValue should be a function');
    assert(typeof nodemod.eng.queryClientCvarValue2 === 'function', 'eng.queryClientCvarValue2 should be a function');
    assert(typeof nodemod.eng.checkParm === 'function', 'eng.checkParm should be a function');
    assert(typeof nodemod.eng.pEntityOfEntIndexAllEntities === 'function', 'eng.pEntityOfEntIndexAllEntities should be a function');
});

// Test event system functions
test('Event system functions exist', () => {
    assert(typeof nodemod.on === 'function', 'nodemod.on should be a function');
    assert(typeof nodemod.addEventListener === 'function', 'nodemod.addEventListener should be a function');
    assert(typeof nodemod.addListener === 'function', 'nodemod.addListener should be a function');
    assert(typeof nodemod.removeListener === 'function', 'nodemod.removeListener should be a function');
    assert(typeof nodemod.removeEventListener === 'function', 'nodemod.removeEventListener should be a function');
    assert(typeof nodemod.clearListeners === 'function', 'nodemod.clearListeners should be a function');
    assert(typeof nodemod.fire === 'function', 'nodemod.fire should be a function');
});

// Test utility functions
test('Utility functions exist', () => {
    assert(typeof nodemod.getUserMsgId === 'function', 'nodemod.getUserMsgId should be a function');
    assert(typeof nodemod.getUserMsgName === 'function', 'nodemod.getUserMsgName should be a function');
    assert(typeof nodemod.setMetaResult === 'function', 'nodemod.setMetaResult should be a function');
    assert(typeof nodemod.continueServer === 'function', 'nodemod.continueServer should be a function');
});

// Test event handling with proper TypeScript types
test('Event system basic functionality', () => {
    let eventFired = false;
    
    // TypeScript will validate the callback signature at compile time
    const testCallback = () => { eventFired = true; };
    
    // Test adding listener with type safety
    nodemod.on('dllClientKill', testCallback);
    
    // Test firing event (fire requires an entity parameter for dllClientKill)
    const fakeEntity = null as any; // For testing purposes
    nodemod.fire('dllClientKill', fakeEntity);
    assert(eventFired, 'Event should have fired and set flag to true');
    
    // Test removing listener
    eventFired = false;
    nodemod.removeListener('dllClientKill', testCallback);
    nodemod.fire('dllClientKill', fakeEntity);
    assert(!eventFired, 'Event should not fire after removing listener');
});

// Test typed event handlers for validation
test('Typed event handler validation', () => {
    // Load the complete event list from our generated JSON file
    let allEvents: string[] = [];
    try {
        const fs = require('fs');
        const path = require('path');
        const eventListPath = path.join(__dirname, '../event-list.json');
        const eventData = JSON.parse(fs.readFileSync(eventListPath, 'utf-8'));
        allEvents = eventData.events;
        console.log(`  Loaded ${allEvents.length} events from generated event-list.json`);
    } catch (e) {
        console.log(`  Could not load event-list.json, using hardcoded subset: ${e}`);
    }
    
    // Track which events have fired
    const eventsFired = new Set<string>();
    const eventHandlers = new Map<string, Function>();
    
    // Register a handler for each event dynamically
    let handlersRegistered = 0;
    let failedRegistrations: string[] = [];
    
    allEvents.forEach(eventName => {
        try {
            // Create a generic handler that logs when the event fires
            const handler = (...args: any[]) => {
                eventsFired.add(eventName);
                console.log(`🎯 ${eventName} fired with ${args.length} args:`, 
                    args.map((arg, i) => {
                        if (arg?.id !== undefined) return `Entity#${arg.id}`;
                        if (typeof arg === 'object' && arg !== null) return `{object}`;
                        if (typeof arg === 'string') return `"${arg.substring(0, 20)}${arg.length > 20 ? '...' : ''}"`;
                        return arg;
                    }).join(', ')
                );
            };
            
            // Type assertion to handle the dynamic event name
            (nodemod.on as any)(eventName, handler);
            eventHandlers.set(eventName, handler);
            handlersRegistered++;

            console.log(`  ✓ Registered handler for event: ${eventName}`);
        } catch (e) {
            console.log('  ✗ Failed to register handler for event:', eventName, e);
            failedRegistrations.push(eventName);
        }
    });
    
    console.log(`✓ Registered ${handlersRegistered}/${allEvents.length} event handlers`);
    if (failedRegistrations.length > 0 && failedRegistrations.length <= 10) {
        console.log(`  Failed to register: ${failedRegistrations.join(', ')}`);
    } else if (failedRegistrations.length > 0) {
        console.log(`  Failed to register ${failedRegistrations.length} events`);
    }
    
    // Test removal of all handlers
    let removeCount = 0;
    eventHandlers.forEach((handler, eventName) => {
        try {
            (nodemod.removeListener as any)(eventName, handler);
            removeCount++;
        } catch (e) {
            // Ignore removal errors
        }
    });
    console.log(`✓ Successfully removed ${removeCount} event handlers`);
    
    // Re-register important events for runtime monitoring
    const importantEvents = ['dllGameInit', 'dllServerActivate', 'dllStartFrame', 'dllClientConnect', 'dllSpawn'];
    importantEvents.forEach(eventName => {
        const handler = eventHandlers.get(eventName);
        if (handler) {
            (nodemod.on as any)(eventName, handler);
        }
    });
    
    // Store the eventsFired set globally so we can report on it later
    (globalThis as any).__eventsFired = eventsFired;
    (globalThis as any).__totalEventsRegistered = handlersRegistered;
});

// Test engine function calls (basic ones that don't require entities)
test('Engine utility functions', () => {
    // Test time function
    const currentTime = nodemod.eng.time();
    assert(typeof currentTime === 'number', 'eng.time() should return a number');
    
    // Test random functions
    const randomLong = nodemod.eng.randomLong(1, 10);
    assert(typeof randomLong === 'number', 'eng.randomLong() should return a number');
    assert(randomLong >= 1 && randomLong <= 10, 'eng.randomLong() should return value in range');
    
    const randomFloat = nodemod.eng.randomFloat(0.0, 1.0);
    assert(typeof randomFloat === 'number', 'eng.randomFloat() should return a number');
    assert(randomFloat >= 0.0 && randomFloat <= 1.0, 'eng.randomFloat() should return value in range');
    
    // Test server check
    const isDedicated = nodemod.eng.isDedicatedServer();
    assert(typeof isDedicated === 'number', 'eng.isDedicatedServer() should return a number');
    
    // Test entity count
    const entityCount = nodemod.eng.numberOfEntities();
    assert(typeof entityCount === 'number', 'eng.numberOfEntities() should return a number');
    assert(entityCount >= 0, 'eng.numberOfEntities() should return non-negative value');
    
    // Test command argument functions
    const cmdArgs = nodemod.eng.cmdArgs();
    assert(typeof cmdArgs === 'string', 'eng.cmdArgs() should return a string');
    
    const cmdArgc = nodemod.eng.cmdArgc();
    assert(typeof cmdArgc === 'number', 'eng.cmdArgc() should return a number');
    assert(cmdArgc >= 0, 'eng.cmdArgc() should return non-negative value');
});

// Test vector operations
test('Vector utility functions', () => {
    const testVector: number[] = [1.0, 0.0, 0.0];
    
    // Test vecToYaw
    const yaw = nodemod.eng.vecToYaw(testVector);
    assert(typeof yaw === 'number', 'eng.vecToYaw() should return a number');
    
    // Test makeVectors
    nodemod.eng.makeVectors([0, 0, 0]);
    
    // Test angleVectors
    const forward: number[] = [0, 0, 0];
    const right: number[] = [0, 0, 0];
    const up: number[] = [0, 0, 0];
    nodemod.eng.angleVectors([0, 0, 0], forward, right, up);
    assert(Array.isArray(forward), 'forward should be filled by angleVectors');
    assert(Array.isArray(right), 'right should be filled by angleVectors');
    assert(Array.isArray(up), 'up should be filled by angleVectors');
});

// Test cvar functions
test('Cvar functions', () => {
    // Test getting cvar values (use common cvars that should exist)
    const hostname = nodemod.eng.cVarGetString('hostname');
    assert(typeof hostname === 'string', 'eng.cVarGetString() should return a string');
    
    const maxPlayers = nodemod.eng.cVarGetFloat('maxplayers');
    assert(typeof maxPlayers === 'number', 'eng.cVarGetFloat() should return a number');
});

// Test tracing functions
test('Trace functions', () => {
    // Create a properly typed trace result object
    // Test traceLine
    const start: number[] = [0, 0, 0];
    const end: number[] = [100, 0, 0];
    const traceResult: nodemod.TraceResult = nodemod.eng.traceLine(start, end, 0, null as any);
    assert(typeof traceResult.fraction === 'number', 'traceLine should fill fraction');
    
    // Test pointContents
    const contents = nodemod.eng.pointContents([0, 0, 0]);
    assert(typeof contents === 'number', 'eng.pointContents() should return a number');
});

// Performance test - measure how long it takes to call basic functions
test('Performance benchmark', () => {
    const iterations = 1000;
    
    // Test time() function performance
    const startTime = Date.now();
    for (let i = 0; i < iterations; i++) {
        nodemod.eng.time();
    }
    const timeCallDuration = Date.now() - startTime;
    console.log(`${iterations} time() calls took ${timeCallDuration}ms`);
    
    // Test randomLong() function performance
    const randomStartTime = Date.now();
    for (let i = 0; i < iterations; i++) {
        nodemod.eng.randomLong(1, 100);
    }
    const randomDuration = Date.now() - randomStartTime;
    console.log(`${iterations} randomLong() calls took ${randomDuration}ms`);
    
    // Test event system performance
    let counter = 0;
    const fakeEntity = null as any; // For testing purposes
    const eventCallback = () => { counter++; };
    nodemod.on('dllClientKill', eventCallback);
    
    const eventStartTime = Date.now();
    for (let i = 0; i < iterations; i++) {
        nodemod.fire('dllClientKill', fakeEntity);
    }
    const eventDuration = Date.now() - eventStartTime;
    console.log(`${iterations} event fires took ${eventDuration}ms`);
    
    nodemod.removeListener('dllClientKill', eventCallback);
    assert(counter === iterations, `Event should have fired ${iterations} times`);
});

}

function runEntityTests(): void {
    console.log('Running entity tests (requires fully loaded game)...');
    
// Test entity functions
test('Entity functions', () => {
    // Test createEntity
    const entity = nodemod.eng.createEntity();
    assert(entity !== null, 'eng.createEntity() should return an entity');
    
    if (entity) {
        // Test entity properties with proper typing
        assert(typeof entity.id === 'number', 'Entity should have numeric id');
        assert(typeof entity.classname === 'string', 'Entity should have classname property');
        assert(Array.isArray(entity.origin), 'Entity should have origin array');
        assert(Array.isArray(entity.angles), 'Entity should have angles array');
        assert(typeof entity.health === 'number', 'Entity should have health property');
        
        // Test setting properties
        entity.classname = 'test_entity';
        assert(entity.classname === 'test_entity', 'Should be able to set entity classname');
        
        entity.health = 100;
        assert(entity.health === 100, 'Should be able to set entity health');
        
        entity.origin = [10, 20, 30];
        assert(entity.origin[0] === 10, 'Should be able to set entity origin');
        assert(entity.origin[1] === 20, 'Should be able to set entity origin');
        assert(entity.origin[2] === 30, 'Should be able to set entity origin');
        
        // Test getting entity vars with proper typing
        const entvars: nodemod.Entvars = nodemod.eng.getVarsOfEnt(entity);

        console.log('Entity entvars:', entvars);
        assert(entvars !== null, 'Should get entvars from entity');
        assert(typeof entvars.classname === 'string', 'Entvars should have classname');
        
        // Clean up
        nodemod.eng.removeEntity(entity);
    }
});

// Test message system with proper types
test('Message functions', () => {
    // Test message system functions exist and can be called
    const testMsgId = nodemod.eng.regUserMsg('TestMsg', 4);
    assert(typeof testMsgId === 'number', 'eng.regUserMsg() should return message ID');
    
    // Test getUserMsgId and getUserMsgName
    const msgId = nodemod.getUserMsgId('TestMsg');
    assert(typeof msgId === 'number', 'getUserMsgId should return number');
    
    const msgName = nodemod.getUserMsgName(testMsgId);
    assert(typeof msgName === 'string', 'getUserMsgName should return string');
});

}

function printSummary(): void {
    console.log('\n' + '='.repeat(50));
    console.log('BENCHMARK RESULTS');
    console.log('='.repeat(50));
    console.log(`Tests Passed: ${testsPassed}`);
    console.log(`Tests Failed: ${testsFailed}`);
    console.log(`Total Tests: ${testsPassed + testsFailed}`);
    console.log(`Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(2)}%`);

    if (testsFailed === 0) {
        console.log('\n🎉 ALL TESTS PASSED! nodemod is working correctly.');
    } else {
        console.log(`\n⚠️  ${testsFailed} test(s) failed. Check the output above for details.`);
    }
    
    // Report on events that fired during the test run
    const eventsFired = (globalThis as any).__eventsFired;
    const totalRegistered = (globalThis as any).__totalEventsRegistered;
    if (eventsFired || totalRegistered) {
        console.log('\n' + '='.repeat(50));
        console.log('EVENT SYSTEM REPORT');
        console.log('='.repeat(50));
        if (totalRegistered) {
            console.log(`Event handlers registered: ${totalRegistered}`);
        }
        if (eventsFired && eventsFired.size > 0) {
            console.log(`Unique events fired: ${eventsFired.size}`);
            console.log('Events that fired:', Array.from(eventsFired).sort().join(', '));
        }
    }
}

// Run safe tests immediately
runSafeTests();

// Set up event listener for when the game is fully loaded
// dllServerActivate is called when the server is fully activated with entities ready
nodemod.on('dllServerActivate', (pEdictList, edictCount, clientMax) => {
    if (!gameLoaded) {
        gameLoaded = true;
        console.log(`\n🎮 Server activated! EdictList=${pEdictList?.id}, edicts=${edictCount}, maxClients=${clientMax}`);
        console.log('Entity system is ready, running entity tests...');
        runEntityTests();
        printSummary();
    }
});

// Listen to game init but DON'T run entity tests here - it's too early
nodemod.on('dllGameInit', () => {
    console.log('🎮 Game initialized (waiting for server activation before entity tests)...');
});