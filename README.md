# NodeMod Examples

This package contains example code demonstrating how to use the NodeMod API for Half-Life/GoldSrc server plugins.

## Getting Started

```bash
npm install
npm run build
```

## Example Files

The `src/examples/` directory contains standalone examples for each API module:

| File | Description |
|------|-------------|
| `cmd.ts` | Command registration and handling |
| `cvar.ts` | Console variable management |
| `entity.ts` | Entity creation and manipulation |
| `engine.ts` | Core engine operations |
| `events.ts` | Event listeners (connect, disconnect, spawn, etc.) |
| `file.ts` | File I/O operations |
| `menu.ts` | Interactive menu system |
| `msg.ts` | Network message handling |
| `player.ts` | Player management and utilities |
| `resource.ts` | Resource precaching |
| `sound.ts` | Sound playback |

## Real-World Example: Admin Plugin

For a complete, production-ready example of a NodeMod plugin, see the **[@nodemod/admin](https://github.com/nodemod/admin-goldsrc)** package. This is a full port of the AMX Mod X admin system to TypeScript, demonstrating:

- Plugin architecture with BasePlugin class
- Permission-based access control
- Command registration with help system integration
- Event handling and player tracking
- Pluggable storage backends (file, SQL)
- Localization support

## Documentation

For comprehensive documentation, guides, and API reference:

- **[NodeMod Documentation](https://nodemod.org)** - Full documentation site
- **[Examples Overview](https://nodemod.org/docs/examples)** - Code examples with explanations
- **[Admin System Guide](https://nodemod.org/docs/guides/admin-system)** - AMX Mod X admin system documentation
- **[Admin Plugin Development](https://nodemod.org/docs/guides/admin-plugins)** - Guide to creating admin plugins
- **[API Reference](https://nodemod.org/docs/api)** - Complete API documentation

## Usage

These examples are designed to run on a Half-Life Dedicated Server (HLDS) with NodeMod installed. Copy the built files to your server's `addons/nodemod/plugins/` directory.

## License

MIT
