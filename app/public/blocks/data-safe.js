/* DataStore blocks. */
(function registerSafeDataBlocks() {
  const lua = window.BloxCodePlus.lua;
  const COLOUR = 45;

  Blockly.Blocks['bxplus_load_data_safely'] = {
    init() {
      this.appendValueInput('DATASTORE').setCheck('Instance').appendField('load data from');
      this.appendValueInput('KEY').appendField('key');
      this.appendDummyInput()
        .appendField('into')
        .appendField(new Blockly.FieldVariable('savedValue'), 'VARIABLE');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(COLOUR);
      this.setTooltip('Loads a DataStore value inside pcall. If Roblox reports an error, the script warns instead of stopping unexpectedly. Use in a server Script.');
      this.setHelpUrl('https://create.roblox.com/docs/cloud-services/data-stores');
    }
  };

  lua.register('bxplus_load_data_safely', function generateSafeDataLoad(block) {
    const dataStore = lua.value(block, 'DATASTORE', 'dataStore', Blockly.Lua.ORDER_ATOMIC);
    const key = lua.value(block, 'KEY', '"player-key"', Blockly.Lua.ORDER_NONE);
    const variable = lua.variable(block, 'VARIABLE');
    return [
      `local success, ${variable} = pcall(function()`,
      `  return ${dataStore}:GetAsync(${key})`,
      'end)',
      'if not success then',
      '  warn("BloxCode Plus: DataStore load failed")',
      'end',
      ''
    ].join('\n');
  });

  Blockly.Blocks['bxplus_update_number_safely'] = {
    init() {
      this.appendValueInput('DATASTORE').setCheck('Instance').appendField('safely add to DataStore');
      this.appendValueInput('KEY').appendField('key');
      this.appendValueInput('CHANGE').setCheck('Number').appendField('change by');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(COLOUR);
      this.setTooltip('Uses UpdateAsync inside pcall to safely change a number even when more than one server may update the same key. Use in a server Script.');
      this.setHelpUrl('https://create.roblox.com/docs/cloud-services/data-stores');
    }
  };

  lua.register('bxplus_update_number_safely', function generateSafeNumberUpdate(block) {
    const dataStore = lua.value(block, 'DATASTORE', 'dataStore', Blockly.Lua.ORDER_ATOMIC);
    const key = lua.value(block, 'KEY', '"player-key"', Blockly.Lua.ORDER_NONE);
    const change = lua.value(block, 'CHANGE', '1', Blockly.Lua.ORDER_NONE);
    return [
      'local success, updateResult = pcall(function()',
      `  return ${dataStore}:UpdateAsync(${key}, function(currentValue)`,
      `    return (currentValue or 0) + ${change}`,
      '  end)',
      'end)',
      'if not success then',
      '  warn("BloxCode Plus: DataStore update failed")',
      'end',
      ''
    ].join('\n');
  });
}());
