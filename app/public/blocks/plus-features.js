/* Additional Roblox workflow blocks. */
(function registerPlusFeatureBlocks() {
  const lua = window.BloxCodePlus.lua;
  const COLOUR = 135;

  Blockly.Blocks['bxplus_get_player_from_character'] = {
    init() {
      this.appendValueInput('CHARACTER').setCheck('Model').appendField('get player from character');
      this.setOutput(true, 'Player');
      this.setColour(COLOUR);
      this.setTooltip('Finds the Player that owns a character Model.');
      this.setHelpUrl('https://create.roblox.com/docs/reference/engine/classes/Players#GetPlayerFromCharacter');
    }
  };
  lua.register('bxplus_get_player_from_character', (block) => {
    const character = lua.value(block, 'CHARACTER', 'character', Blockly.Lua.ORDER_ATOMIC);
    return [`game:GetService("Players"):GetPlayerFromCharacter(${character})`, Blockly.Lua.ORDER_ATOMIC];
  });

  Blockly.Blocks['bxplus_for_each_player'] = {
    init() {
      this.appendStatementInput('DO').appendField('for each player do');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(COLOUR);
      this.setTooltip('Runs the connected blocks once for every player currently in the server.');
      this.setHelpUrl('https://create.roblox.com/docs/reference/engine/classes/Players#GetPlayers');
    }
  };
  lua.register('bxplus_for_each_player', (block) => {
    const body = lua.statement(block, 'DO');
    return `for _, player in ipairs(game:GetService("Players"):GetPlayers()) do\n${body}end\n`;
  });

  Blockly.Blocks['bxplus_humanoid_get_health'] = {
    init() {
      this.appendValueInput('HUMANOID').setCheck('Humanoid').appendField('get humanoid health');
      this.setOutput(true, 'Number');
      this.setColour(230);
      this.setTooltip('Reads the current Health property of a Humanoid.');
      this.setHelpUrl('https://create.roblox.com/docs/reference/engine/classes/Humanoid#Health');
    }
  };
  lua.register('bxplus_humanoid_get_health', (block) => {
    const humanoid = lua.value(block, 'HUMANOID', 'humanoid', Blockly.Lua.ORDER_ATOMIC);
    return [`${humanoid}.Health`, Blockly.Lua.ORDER_ATOMIC];
  });

  Blockly.Blocks['bxplus_humanoid_set_health'] = {
    init() {
      this.appendValueInput('HUMANOID').setCheck('Humanoid').appendField('set humanoid health');
      this.appendValueInput('HEALTH').setCheck('Number').appendField('to');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(230);
      this.setTooltip('Sets a Humanoid Health value. Apply authoritative health changes on the server.');
      this.setHelpUrl('https://create.roblox.com/docs/reference/engine/classes/Humanoid#Health');
    }
  };
  lua.register('bxplus_humanoid_set_health', (block) => {
    const humanoid = lua.value(block, 'HUMANOID', 'humanoid', Blockly.Lua.ORDER_ATOMIC);
    const health = lua.value(block, 'HEALTH', '100', Blockly.Lua.ORDER_NONE);
    return `${humanoid}.Health = ${health}\n`;
  });

  Blockly.Blocks['bxplus_humanoid_take_damage'] = {
    init() {
      this.appendValueInput('HUMANOID').setCheck('Humanoid').appendField('damage humanoid');
      this.appendValueInput('DAMAGE').setCheck('Number').appendField('by');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(230);
      this.setTooltip('Applies damage through Humanoid:TakeDamage. Keep combat authority on the server.');
      this.setHelpUrl('https://create.roblox.com/docs/reference/engine/classes/Humanoid#TakeDamage');
    }
  };
  lua.register('bxplus_humanoid_take_damage', (block) => {
    const humanoid = lua.value(block, 'HUMANOID', 'humanoid', Blockly.Lua.ORDER_ATOMIC);
    const damage = lua.value(block, 'DAMAGE', '10', Blockly.Lua.ORDER_NONE);
    return `${humanoid}:TakeDamage(${damage})\n`;
  });

  Blockly.Blocks['bxplus_player_respawn'] = {
    init() {
      this.appendValueInput('PLAYER').setCheck('Player').appendField('respawn player');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(135);
      this.setTooltip('Loads a new character for a Player. Use on the server for authoritative respawn rules.');
      this.setHelpUrl('https://create.roblox.com/docs/reference/engine/classes/Player#LoadCharacter');
    }
  };
  lua.register('bxplus_player_respawn', (block) => {
    const player = lua.value(block, 'PLAYER', 'player', Blockly.Lua.ORDER_ATOMIC);
    return `${player}:LoadCharacter()\n`;
  });

  Blockly.Blocks['bxplus_tween_property'] = {
    init() {
      this.appendValueInput('INSTANCE').setCheck('Instance').appendField('tween');
      this.appendValueInput('VALUE').appendField(new Blockly.FieldDropdown([
        ['Transparency', 'Transparency'], ['Size', 'Size'], ['Position', 'Position'], ['CFrame', 'CFrame'], ['Volume', 'Volume']
      ]), 'PROPERTY').appendField('to');
      this.appendValueInput('TIME').setCheck('Number').appendField('in seconds');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(290);
      this.setTooltip('Creates and plays a simple TweenService animation for one common property.');
      this.setHelpUrl('https://create.roblox.com/docs/animation/tweening');
    }
  };
  lua.register('bxplus_tween_property', (block) => {
    const instance = lua.value(block, 'INSTANCE', 'instance', Blockly.Lua.ORDER_ATOMIC);
    const property = block.getFieldValue('PROPERTY');
    const value = lua.value(block, 'VALUE', '0', Blockly.Lua.ORDER_NONE);
    const time = lua.value(block, 'TIME', '1', Blockly.Lua.ORDER_NONE);
    return `local tween = game:GetService("TweenService"):Create(${instance}, TweenInfo.new(${time}), {${property} = ${value}})\ntween:Play()\n`;
  });
}());

