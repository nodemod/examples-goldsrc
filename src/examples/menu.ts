import nodemodCore from '@nodemod/core';

// Example: Comprehensive menu system showcase
export function initializeMenuExamples() {
  console.log('Initializing menu system examples...');

  // Command to show main menu
  nodemodCore.cmd.registerClient('mainmenu', (client, args) => {
    showMainMenu(client);
  });

  // Command to show paginated menu
  nodemodCore.cmd.registerClient('bigmenu', (client, args) => {
    showPaginatedMenu(client);
  });

  // Command to show template examples
  nodemodCore.cmd.registerClient('templates', (client, args) => {
    showTemplateExamples(client);
  });
}

// Main menu with nested submenus
function showMainMenu(client: nodemod.Entity) {
  const playerMenu = {
    title: "Player Management",
    items: [
      { name: "Kick Player", handler: (client: nodemod.Entity) => showPlayerList(client, 'kick') },
      { name: "Ban Player", handler: (client: nodemod.Entity) => showPlayerList(client, 'ban') },
      { name: "Get Player Info", handler: (client: nodemod.Entity) => showPlayerList(client, 'info') }
    ]
  };

  const serverMenu = {
    title: "Server Management", 
    items: [
      { name: "Change Map", handler: showMapMenu },
      { name: "Server Settings", handler: showServerSettings },
      { name: "Restart Server", handler: (client: nodemod.Entity) => {
        const confirmMenu = {
          title: "Are you sure you want to restart the server?",
          items: [
            { name: "Confirm", handler: (client: nodemod.Entity) => {
              nodemodCore.util.messageAll("Server restarting in 5 seconds...");
              setTimeout(() => {
                console.log("Server would restart here");
              }, 5000);
            }},
            { name: "Cancel", handler: () => {} }
          ]
        };
        nodemodCore.menu.show(confirmMenu);
      }}
    ]
  };

  const mainMenu = {
    title: "Admin Panel",
    items: [
      { name: "Player Management", handler: (client: nodemod.Entity) => nodemodCore.menu.show(playerMenu) },
      { name: "Server Management", handler: (client: nodemod.Entity) => nodemodCore.menu.show(serverMenu) },
      { name: "View Logs", handler: showRecentLogs },
      { name: "Statistics", handler: showServerStats }
    ],
    time: 30
  };

  nodemodCore.menu.show(mainMenu);
}

// Example of pagination with many items
function showPaginatedMenu(client: nodemod.Entity) {
  const items = [];
  for (let i = 1; i <= 25; i++) {
    items.push({
      name: `Menu Item ${i}`,
      handler: (client: nodemod.Entity) => {
        nodemodCore.util.messageClient(client, `You selected item ${i}!`);
      }
    });
  }

  const bigMenu = {
    title: "Large Menu Example",
    items,
    entity: client,
    time: 60
  };

  nodemodCore.menu.show(bigMenu);
}

// Template examples
function showTemplateExamples(client: nodemod.Entity) {
  const templates = {
    title: "Menu Templates",
    items: [
      {
        name: "Yes/No Example",
        handler: (client: nodemod.Entity) => {
          const yesNo = {
            title: "Do you like this menu system?",
            items: [
              { name: "Yes", handler: (client: nodemod.Entity) => nodemodCore.util.messageClient(client, "Great! We're glad you like it!") },
              { name: "No", handler: (client: nodemod.Entity) => nodemodCore.util.messageClient(client, "We'll work on improving it!") }
            ]
          };
          nodemodCore.menu.show(yesNo);
        }
      },
      {
        name: "Confirmation Example", 
        handler: (client: nodemod.Entity) => {
          const confirm = {
            title: "This will delete all your progress!",
            items: [
              { name: "Confirm", handler: (client: nodemod.Entity) => {
                nodemodCore.util.messageClient(client, "Progress deleted! (just kidding)");
              }},
              { name: "Cancel", handler: (client: nodemod.Entity) => {
                nodemodCore.util.messageClient(client, "Wise choice!");
              }}
            ]
          };
          nodemodCore.menu.show(confirm);
        }
      },
      {
        name: "Simple Template",
        handler: (client: nodemod.Entity) => {
          const simple = {
            title: "Choose a weapon",
            items: [
              { name: "AK-47", handler: (client: nodemod.Entity) => nodemodCore.util.messageClient(client, "You chose AK-47!") },
              { name: "M4A1", handler: (client: nodemod.Entity) => nodemodCore.util.messageClient(client, "You chose M4A1!") },
              { name: "AWP", handler: (client: nodemod.Entity) => nodemodCore.util.messageClient(client, "You chose AWP!") },
              { name: "Deagle", handler: (client: nodemod.Entity) => nodemodCore.util.messageClient(client, "You chose Deagle!") }
            ]
          };
          nodemodCore.menu.show(simple);
        }
      }
    ],
    entity: client
  };

  nodemodCore.menu.show(templates);
}

// Helper functions for menu actions
function showPlayerList(client: nodemod.Entity, action: string) {
  const players = nodemod.players.filter(p => p && p.netname && nodemodCore.util.isValidEntity(p));
  
  const playerItems = players.map(player => ({
    name: `${player.netname} (${nodemodCore.util.getUserId(player)})`,
    handler: (client: nodemod.Entity) => {
      switch (action) {
        case 'kick':
          nodemodCore.util.messageAll(`${player.netname} was kicked by admin`);
          nodemodCore.cmd.run(`kick #${nodemodCore.util.getUserId(player)}`);
          break;
        case 'ban':
          nodemodCore.util.messageAll(`${player.netname} was banned by admin`);
          // Add ban logic here
          break;
        case 'info':
          const info = `Player Info:
Name: ${player.netname}
UserID: ${nodemodCore.util.getUserId(player)}
SteamID: ${nodemodCore.util.getSteamId(player)}
IP: ${nodemodCore.util.getIpAddress(player)}`;
          nodemodCore.util.messageClient(client, info);
          break;
      }
    }
  }));

  const playerMenu = {
    title: `${action.charAt(0).toUpperCase() + action.slice(1)} Player`,
    items: playerItems.length > 0 ? playerItems : [
      { name: "No players found", disabled: true }
    ],
    entity: client,
    time: 30
  };

  nodemodCore.menu.show(playerMenu);
}

function showMapMenu(client: nodemod.Entity) {
  const maps = ['ts_lobby', 'de_inferno', 'de_mirage', 'de_cache', 'de_train', 'de_overpass'];
  
  const mapItems = maps.map(map => ({
    name: map,
    handler: (client: nodemod.Entity) => {
      const confirm = {
        title: `Change map to ${map}?`,
        items: [
          { name: "Confirm", handler: (client: nodemod.Entity) => {
            nodemodCore.util.messageAll(`Changing map to ${map}...`);
            setTimeout(() => {
              console.log(`Map would change to ${map} here`);
              nodemodCore.cmd.run(`changelevel ${map}`);
            }, 2000); // Give players 2 seconds to see the message
          }},
          { name: "Cancel", handler: () => {} }
        ]
      };
      nodemodCore.menu.show(confirm);
    }
  }));

  const mapMenu = {
    title: "Select Map",
    items: mapItems,
    entity: client,
    time: 45
  };

  nodemodCore.menu.show(mapMenu);
}

function showServerSettings(client: nodemod.Entity) {
  const settingsMenu = {
    title: "Server Settings",
    items: [
      { name: "Gravity: Normal", handler: (client: nodemod.Entity) => toggleGravity(client) },
      { name: "Friendly Fire: Off", handler: (client: nodemod.Entity) => toggleFriendlyFire(client) },
      { name: "Max Players: 32", handler: (client: nodemod.Entity) => changeMaxPlayers(client) },
      { name: "Time Limit: 30 min", handler: (client: nodemod.Entity) => changeTimeLimit(client) }
    ],
    entity: client
  };

  nodemodCore.menu.show(settingsMenu);
}

function showRecentLogs(client: nodemod.Entity) {
  nodemodCore.util.messageClient(client, "Recent server logs:\n[INFO] Player connected\n[INFO] Round started\n[WARN] High ping detected");
}

function showServerStats(client: nodemod.Entity) {
  const stats = `Server Statistics:
Players Online: ${nodemod.players.filter(p => nodemodCore.util.isValidEntity(p)).length}
Uptime: 2h 34m
CPU Usage: 45%
Memory: 512MB/1GB
Current Map: ${nodemod.mapname}`;

  nodemodCore.util.messageClient(client, stats);
}

// Setting toggle functions
function toggleGravity(client: nodemod.Entity) {
  nodemodCore.util.messageClient(client, "Gravity toggled! (example)");
}

function toggleFriendlyFire(client: nodemod.Entity) {
  nodemodCore.util.messageClient(client, "Friendly fire toggled! (example)");
}

function changeMaxPlayers(client: nodemod.Entity) {
  const options = {
    title: "Select Max Players",
    items: [
      { name: "16", handler: (client: nodemod.Entity) => nodemodCore.util.messageClient(client, "Max players set to 16") },
      { name: "24", handler: (client: nodemod.Entity) => nodemodCore.util.messageClient(client, "Max players set to 24") },
      { name: "32", handler: (client: nodemod.Entity) => nodemodCore.util.messageClient(client, "Max players set to 32") }
    ]
  };
  nodemodCore.menu.show(options);
}

function changeTimeLimit(client: nodemod.Entity) {
  const options = {
    title: "Select Time Limit",
    items: [
      { name: "15 minutes", handler: (client: nodemod.Entity) => nodemodCore.util.messageClient(client, "Time limit set to 15 minutes") },
      { name: "30 minutes", handler: (client: nodemod.Entity) => nodemodCore.util.messageClient(client, "Time limit set to 30 minutes") },
      { name: "45 minutes", handler: (client: nodemod.Entity) => nodemodCore.util.messageClient(client, "Time limit set to 45 minutes") },
      { name: "No limit", handler: (client: nodemod.Entity) => nodemodCore.util.messageClient(client, "Time limit removed") }
    ]
  };
  nodemodCore.menu.show(options);
}