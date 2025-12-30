import nodemodCore from '@nodemod/core';

const cmd = nodemodCore.cmd;

// Example 1: Basic command registration using the register method
cmd.registerClient('say_hello', (client: nodemod.Entity, args: string[]) => {
  const playerName = client.netname;
  nodemodCore.util.messageClient(client, `Hello ${playerName}!`);
  console.log(`Player ${playerName} used say_hello command`);
});

// Example 2: Command with arguments
cmd.registerClient('say_greet', (client: nodemod.Entity, args: string[]) => {
  const playerName = client.netname;
  const target = args[0] || 'World';
  nodemodCore.util.messageClient(client, `${playerName} greets ${target}!`);
});

// Example 3: Advanced command registration using add method with full options
cmd.add({
  name: 'say_info',
  type: 'client',
  handler: (ctx: any) => {
    const playerName = ctx.client.netname;
    const message = `Player: ${playerName}, Command: ${ctx.text}, Args: ${ctx.args.join(', ')}`;
    nodemodCore.util.messageClient(ctx.client, message);
    console.log(`Command info: ${message}`);
  }
});

// Example 4: Server command execution
cmd.registerClient('say_time', (client: nodemod.Entity) => {
  // Execute a server command to get current time
  cmd.run('status');
  const playerName = client.netname;
  nodemodCore.util.messageClient(client, `${playerName}, server status command executed!`);
});

// Example 5: Command with validation
cmd.registerClient('say_admin', (client: nodemod.Entity, args: string[]) => {
  const playerName = client.netname;
  
  // Basic validation example
  if (args.length < 1) {
    nodemodCore.util.messageClient(client, 'Usage: say_admin <message>');
    return;
  }
  
  const adminMessage = args.join(' ');
  // This would typically check for admin privileges
  nodemodCore.util.messageClient(client, `[ADMIN] ${playerName}: ${adminMessage}`);
  console.log(`Admin command from ${playerName}: ${adminMessage}`);
});

console.log('Command examples loaded successfully!');
console.log('Available commands: say_hello, say_greet, say_info, say_time, say_admin');