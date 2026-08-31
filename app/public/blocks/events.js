/* Event blocks. */
(function registerEventBlocks() {
  const lua = window.BloxCodePlus.lua;
  const COLOUR = 20;

  Blockly.Blocks['bxplus_when_part_touched'] = {
    init() {
      this.appendValueInput('PART')
        .setCheck('Instance')
        .appendField('when part');
      this.appendDummyInput()
        .appendField('is touched by')
        .appendField(new Blockly.FieldVariable('otherPart'), 'OTHER_PART');
      this.appendStatementInput('DO').appendField('do');
      this.setColour(COLOUR);
      this.setTooltip('Runs the connected blocks whenever another part touches this part. Use it for doors, checkpoints and pickups.');
      this.setHelpUrl('https://create.roblox.com/docs/reference/engine/classes/BasePart#Touched');
    }
  };

  lua.register('bxplus_when_part_touched', function generatePartTouched(block) {
    const part = lua.value(block, 'PART', 'workspace.Part', Blockly.Lua.ORDER_ATOMIC);
    const otherPart = lua.variable(block, 'OTHER_PART');
    const statements = lua.statement(block, 'DO');
    return `${part}.Touched:Connect(function(${otherPart})\n${statements}end)\n`;
  });

  Blockly.Blocks['bxplus_remote_event'] = {
    init() {
      this.appendValueInput('NAME')
        .setCheck('String')
        .appendField('RemoteEvent named');
      this.setOutput(true, 'RemoteEvent');
      this.setColour(COLOUR);
      this.setTooltip('Finds a RemoteEvent in ReplicatedStorage. RemoteEvents let LocalScripts and server Scripts communicate safely.');
      this.setHelpUrl('https://create.roblox.com/docs/scripting/events/remote');
    }
  };

  lua.register('bxplus_remote_event', function generateRemoteEvent(block) {
    const name = lua.value(block, 'NAME', '"MyRemoteEvent"', Blockly.Lua.ORDER_NONE);
    return [`game:GetService("ReplicatedStorage"):WaitForChild(${name})`, Blockly.Lua.ORDER_ATOMIC];
  });

  Blockly.Blocks['bxplus_fire_remote_event'] = {
    init() {
      this.appendValueInput('EVENT')
        .setCheck('RemoteEvent')
        .appendField('fire RemoteEvent');
      this.appendValueInput('VALUE')
        .appendField('with');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(COLOUR);
      this.setTooltip('Sends a value through a RemoteEvent. In a LocalScript, this calls the server; in a Script, use FireClient or FireAllClients instead.');
      this.setHelpUrl('https://create.roblox.com/docs/scripting/events/remote#remote-events');
    }
  };

  lua.register('bxplus_fire_remote_event', function generateFireRemoteEvent(block) {
    const event = lua.value(block, 'EVENT', 'remoteEvent', Blockly.Lua.ORDER_ATOMIC);
    const value = lua.value(block, 'VALUE', 'nil', Blockly.Lua.ORDER_NONE);
    return `${event}:FireServer(${value})\n`;
  });

  Blockly.Blocks['bxplus_when_remote_event_received'] = {
    init() {
      this.appendValueInput('EVENT')
        .setCheck('RemoteEvent')
        .appendField('when RemoteEvent');
      this.appendDummyInput()
        .appendField('is received as')
        .appendField(new Blockly.FieldVariable('player'), 'PLAYER')
        .appendField('and')
        .appendField(new Blockly.FieldVariable('value'), 'VALUE');
      this.appendStatementInput('DO').appendField('do');
      this.setColour(COLOUR);
      this.setTooltip('Runs on the server when a client fires a RemoteEvent. Always validate values received from a client before using them.');
      this.setHelpUrl('https://create.roblox.com/docs/scripting/security/client-server-boundary');
    }
  };

  lua.register('bxplus_when_remote_event_received', function generateRemoteReceived(block) {
    const event = lua.value(block, 'EVENT', 'remoteEvent', Blockly.Lua.ORDER_ATOMIC);
    const player = lua.variable(block, 'PLAYER');
    const value = lua.variable(block, 'VALUE');
    const statements = lua.statement(block, 'DO');
    return `${event}.OnServerEvent:Connect(function(${player}, ${value})\n${statements}end)\n`;
  });
}());
