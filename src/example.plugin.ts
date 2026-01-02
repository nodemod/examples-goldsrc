// Example Admin Plugin
// Demonstrates how to create a simple plugin for the admin system

import nodemodCore from '@nodemod/core';
import { adminSystem, BasePlugin, Plugin, PluginMetadata, ADMIN_KICK, utils } from '@nodemod/admin';

const cvar = nodemodCore.cvar;

class ExamplePlugin extends BasePlugin implements Plugin {
    readonly metadata: PluginMetadata = {
        name: 'Example Plugin',
        version: '1.0.0',
        author: 'NodeMod Team',
        description: 'A simple example plugin'
    };

    private amxHelloEnabled: any;

    constructor(pluginName: string) {
        super(pluginName);

        // Register a CVAR
        this.registerCvar('amx_hello_enabled', '1', 0, 'Enable hello command');
        this.amxHelloEnabled = cvar.wrap('amx_hello_enabled');

        // Register a command that requires ADMIN_KICK access
        this.registerCommand(
            'amx_hello',
            ADMIN_KICK,
            'Says hello to a player',
            (entity, args) => this.cmdHello(entity, args)
        );

        console.log('[Example] Plugin loaded!');
    }

    private cmdHello(entity: nodemod.Entity | null, args: string[]): void {
        if (!this.amxHelloEnabled.int) {
            this.sendConsole(entity, 'Hello command is disabled');
            return;
        }

        const target = args[1] || 'world';
        this.sendConsole(entity, `Hello, ${target}!`);

        // Show activity to all players based on amx_show_activity setting
        this.showActivity(entity, `said hello to ${target}`);

        // Log the action
        this.logAdminAction(entity, 'hello', null, { target });
    }

    onUnload(): void {
        console.log('[Example] Plugin unloaded!');
    }
}

export default ExamplePlugin;
