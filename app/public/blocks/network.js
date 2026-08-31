/* Networking blocks. */
(function registerNetworkBlocks() {
  const lua = window.BloxCodePlus.lua;
  const COLOUR = 20;

  Blockly.Blocks['bxplus_fire_all_clients'] = {
    init() {
      this.appendValueInput('EVENT').setCheck('RemoteEvent').appendField('send RemoteEvent to all players');
      this.appendValueInput('VALUE').appendField('with');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(COLOUR);
      this.setTooltip('Sends a value from a server Script to every connected client through a RemoteEvent.');
      this.setHelpUrl('https://create.roblox.com/docs/scripting/events/remote');
    }
  };

  lua.register('bxplus_fire_all_clients', function generateFireAllClients(block) {
    const event = lua.value(block, 'EVENT', 'remoteEvent', Blockly.Lua.ORDER_ATOMIC);
    const value = lua.value(block, 'VALUE', 'nil', Blockly.Lua.ORDER_NONE);
    return `${event}:FireAllClients(${value})\n`;
  });

  Blockly.Blocks['bxplus_remote_function'] = {
    init() {
      this.appendValueInput('NAME').setCheck('String').appendField('RemoteFunction named');
      this.setOutput(true, 'RemoteFunction');
      this.setColour(COLOUR);
      this.setTooltip('Finds a RemoteFunction in ReplicatedStorage. RemoteFunctions wait for a reply, so use them only when a response is needed.');
      this.setHelpUrl('https://create.roblox.com/docs/scripting/events/remote');
    }
  };

  lua.register('bxplus_remote_function', function generateRemoteFunction(block) {
    const name = lua.value(block, 'NAME', '"MyRemoteFunction"', Blockly.Lua.ORDER_NONE);
    return [`game:GetService("ReplicatedStorage"):WaitForChild(${name})`, Blockly.Lua.ORDER_ATOMIC];
  });

  Blockly.Blocks['bxplus_invoke_server'] = {
    init() {
      this.appendValueInput('FUNCTION').setCheck('RemoteFunction').appendField('ask RemoteFunction');
      this.appendValueInput('VALUE').appendField('with');
      this.setOutput(true, null);
      this.setColour(COLOUR);
      this.setTooltip('Calls a RemoteFunction from a LocalScript and waits for the server response. Validate all client values on the server.');
      this.setHelpUrl('https://create.roblox.com/docs/scripting/events/remote');
    }
  };

  lua.register('bxplus_invoke_server', function generateInvokeServer(block) {
    const remoteFunction = lua.value(block, 'FUNCTION', 'remoteFunction', Blockly.Lua.ORDER_ATOMIC);
    const value = lua.value(block, 'VALUE', 'nil', Blockly.Lua.ORDER_NONE);
    return [`${remoteFunction}:InvokeServer(${value})`, Blockly.Lua.ORDER_ATOMIC];
  });
}());
