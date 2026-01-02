# NodeMod Plugins

This package is the default plugins directory bundled with NodeMod releases. It provides example plugins and loads the admin system.

## Directory Structure

When installed on a server, the plugins directory looks like:

```
addons/nodemod/plugins/
├── dist/                    # Compiled JavaScript
│   ├── index.js             # Entry point
│   └── example.plugin.js
├── src/                     # TypeScript source
│   ├── index.ts
│   └── example.plugin.ts
├── packages/
│   └── admin/               # Admin system package
│       ├── dist/
│       │   ├── admin.plugin.js
│       │   ├── adminchat.plugin.js
│       │   └── ...
│       └── src/
├── package.json
└── node_modules/
    └── @nodemod/core/
```

## Plugin System

### Creating Plugins

Plugins must be named with the `.plugin.ts` extension. The plugin loader only loads files matching this pattern.

See `src/example.plugin.ts` for a working example. Here's the basic structure:

```typescript
// src/myplugin.plugin.ts
import { BasePlugin, Plugin, PluginMetadata, ADMIN_KICK } from '@nodemod/admin';

class MyPlugin extends BasePlugin implements Plugin {
    readonly metadata: PluginMetadata = {
        name: 'My Plugin',
        version: '1.0.0',
        author: 'Your Name',
        description: 'Description of your plugin'
    };

    constructor(pluginName: string) {
        super(pluginName);

        // Register commands, CVARs, event handlers, etc.
        this.registerCommand('amx_mycommand', ADMIN_KICK, 'Does something',
            (entity, args) => this.handleCommand(entity, args));
    }

    private handleCommand(entity: nodemod.Entity | null, args: string[]): void {
        this.sendConsole(entity, 'Command executed!');
    }
}

export default MyPlugin;
```

### Enabling Plugins

Add your plugin to `configs/plugins.ini`:

```ini
; Admin system (required)
admin

; Admin plugins
adminchat
admincmd
adminhelp
plmenu
; ... other admin plugins

; Custom plugins
myplugin
```

### Plugin Search Paths

The plugin loader searches for `{pluginName}.plugin.js` in:

1. `dist/` - For custom plugins in this package
2. `packages/admin/dist/` - For admin system plugins

So in `plugins.ini`:
- `adminchat` finds `packages/admin/dist/adminchat.plugin.js`
- `myplugin` finds `dist/myplugin.plugin.js`

## Admin System

The admin system (`@nodemod/admin`) is a TypeScript port of AMX Mod X, providing:

- **User Authentication** - SteamID, IP, or name-based admin access
- **Access Flags** - Granular permission system (ADMIN_KICK, ADMIN_BAN, etc.)
- **Command System** - Register commands with access requirements
- **BasePlugin Class** - Common utilities for plugin development
- **Localization** - Multi-language support via dictionary files
- **Storage Backends** - File-based or SQL admin storage

### BasePlugin Utilities

When extending `BasePlugin`, you get access to:

```typescript
// Command & CVAR registration
this.registerCommand(name, flags, description, callback);
this.registerCvar(name, defaultValue, flags, description);

// Localization
this.getLang(entity, 'LANG_KEY', ...args);

// Console/Chat output
this.sendConsole(entity, message);
this.sendChat(target, message);

// Admin activity display
this.showActivity(adminEntity, message);

// Logging
this.logAdminAction(admin, action, target, params);
```

## Included Example

### example.plugin.ts

A working example plugin is included demonstrating:
- Extending `BasePlugin`
- Registering a command with access flags
- Registering a CVAR
- Using utility methods

## Building

```bash
npm install
npm run build
```

## Development

For local development, edit TypeScript files in `src/` and rebuild:

```bash
npm run build:watch
```

## Documentation

- **[NodeMod Documentation](https://nodemod.org)** - Full documentation
- **[Admin System Guide](https://nodemod.org/docs/guides/admin-system)** - Configuration and usage
- **[Admin Plugin Development](https://nodemod.org/docs/guides/admin-plugins)** - Creating plugins

## License

MIT
