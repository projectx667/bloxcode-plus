/* Player blocks. */
(function registerPlayerBlocks() {
  const lua = window.BloxCodePlus.lua;
  const COLOUR = 135;

  Blockly.Blocks['bxplus_when_player_joins'] = {
    init() {
      this.appendDummyInput()
        .appendField('when player')
        .appendField(new Blockly.FieldVariable('player'), 'PLAYER')
        .appendField('joins');
      this.appendStatementInput('DO').appendField('do');
      this.setColour(COLOUR);
      this.setTooltip('Runs the connected blocks whenever a player enters the experience. This is a common starting point for server scripts.');
      this.setHelpUrl('https://create.roblox.com/docs/reference/engine/classes/Players#PlayerAdded');
    }
  };

  lua.register('bxplus_when_player_joins', function generatePlayerJoins(block) {
    const player = lua.variable(block, 'PLAYER');
    const statements = lua.statement(block, 'DO');
    return `game:GetService("Players").PlayerAdded:Connect(function(${player})\n${statements}end)\n`;
  });

  Blockly.Blocks['bxplus_player_character'] = {
    init() {
      this.appendValueInput('PLAYER')
        .setCheck('Player')
        .appendField('character of player');
      this.setOutput(true, 'Model');
      this.setColour(COLOUR);
      this.setTooltip('Gets a player’s character model. A character might not be ready immediately after the player joins.');
      this.setHelpUrl('https://create.roblox.com/docs/characters');
    }
  };

  lua.register('bxplus_player_character', function generatePlayerCharacter(block) {
    const player = lua.value(block, 'PLAYER', 'player', Blockly.Lua.ORDER_ATOMIC);
    return [`${player}.Character`, Blockly.Lua.ORDER_ATOMIC];
  });

  Blockly.Blocks['bxplus_player_gui'] = {
    init() {
      this.appendDummyInput().appendField("local player's PlayerGui");
      this.setOutput(true, 'Instance');
      this.setColour(COLOUR);
      this.setTooltip('Gets the PlayerGui for the local player. Use this as the parent of GUI objects created by a LocalScript.');
      this.setHelpUrl('https://create.roblox.com/docs/reference/engine/classes/PlayerGui');
    }
  };

  lua.register('bxplus_player_gui', function generatePlayerGui() {
    return ['game:GetService("Players").LocalPlayer:WaitForChild("PlayerGui")', Blockly.Lua.ORDER_ATOMIC];
  });

  Blockly.Blocks['bxplus_create_leaderstat'] = {
    init() {
      this.appendValueInput('PLAYER')
        .setCheck('Player')
        .appendField('create leaderstat for');
      this.appendValueInput('NAME')
        .setCheck('String')
        .appendField('named');
      this.appendValueInput('VALUE')
        .setCheck('Number')
        .appendField('with starting value');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(COLOUR);
      this.setTooltip('Creates a visible score value for one player. Roblox displays values inside a leaderstats folder on the player list.');
      this.setHelpUrl('https://create.roblox.com/docs/players/leaderboards');
    }
  };

  lua.register('bxplus_create_leaderstat', function generateLeaderstat(block) {
    const player = lua.value(block, 'PLAYER', 'player', Blockly.Lua.ORDER_NONE);
    const name = lua.value(block, 'NAME', '"Score"', Blockly.Lua.ORDER_NONE);
    const value = lua.value(block, 'VALUE', '0', Blockly.Lua.ORDER_NONE);
    return [
      'local leaderstats = Instance.new("Folder")',
      'leaderstats.Name = "leaderstats"',
      `leaderstats.Parent = ${player}`,
      'local stat = Instance.new("IntValue")',
      `stat.Name = ${name}`,
      `stat.Value = ${value}`,
      'stat.Parent = leaderstats',
      ''
    ].join('\n');
  });
}());
