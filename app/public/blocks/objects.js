/* Object blocks. */
(function registerObjectBlocks() {
  const lua = window.BloxCodePlus.lua;
  const COLOUR = 230;

  Blockly.Blocks['bxplus_create_object'] = {
    init() {
      this.appendValueInput('PARENT')
        .setCheck('Instance')
        .appendField('create')
        .appendField(new Blockly.FieldDropdown([
          ['Part', 'Part'],
          ['Folder', 'Folder'],
          ['SpawnLocation', 'SpawnLocation'],
          ['ScreenGui', 'ScreenGui'],
          ['TextLabel', 'TextLabel']
        ]), 'CLASS')
        .appendField('inside');
      this.setOutput(true, 'Instance');
      this.setColour(COLOUR);
      this.setTooltip('Creates a new Roblox object. Connect a parent such as Workspace so Roblox knows where the object belongs.');
      this.setHelpUrl('https://create.roblox.com/docs/reference/engine/classes/Instance');
    }
  };

  lua.register('bxplus_create_object', function generateCreateObject(block) {
    const className = block.getFieldValue('CLASS');
    const parent = lua.value(block, 'PARENT', 'workspace', Blockly.Lua.ORDER_NONE);
    return [`Instance.new("${className}", ${parent})`, Blockly.Lua.ORDER_ATOMIC];
  });

  Blockly.Blocks['bxplus_set_object_property'] = {
    init() {
      this.appendValueInput('OBJECT')
        .setCheck('Instance')
        .appendField('set');
      this.appendValueInput('VALUE')
        .appendField(new Blockly.FieldDropdown([
          ['Name', 'Name'],
          ['Parent', 'Parent'],
          ['Anchored', 'Anchored'],
          ['CanCollide', 'CanCollide'],
          ['Transparency', 'Transparency'],
          ['Position', 'Position'],
          ['Text', 'Text'],
          ['Visible', 'Visible']
        ]), 'PROPERTY')
        .appendField('to');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(COLOUR);
      this.setTooltip('Changes one property of an object. The property must exist on the object’s Roblox class.');
      this.setHelpUrl('https://create.roblox.com/docs/properties');
    }
  };

  lua.register('bxplus_set_object_property', function generateSetProperty(block) {
    const object = lua.value(block, 'OBJECT', 'workspace', Blockly.Lua.ORDER_ATOMIC);
    const property = block.getFieldValue('PROPERTY');
    const value = lua.value(block, 'VALUE', 'nil', Blockly.Lua.ORDER_NONE);
    return `${object}.${property} = ${value}\n`;
  });

  Blockly.Blocks['bxplus_get_service'] = {
    init() {
      this.appendDummyInput()
        .appendField('get service')
        .appendField(new Blockly.FieldDropdown([
          ['Workspace', 'Workspace'],
          ['Players', 'Players'],
          ['ReplicatedStorage', 'ReplicatedStorage'],
          ['ServerScriptService', 'ServerScriptService'],
          ['StarterGui', 'StarterGui'],
          ['DataStoreService', 'DataStoreService']
        ]), 'SERVICE');
      this.setOutput(true, 'Instance');
      this.setColour(COLOUR);
      this.setTooltip('Gets a Roblox service. Services provide shared features such as players, storage and user interfaces.');
      this.setHelpUrl('https://create.roblox.com/docs/reference/engine/classes/ServiceProvider');
    }
  };

  lua.register('bxplus_get_service', function generateGetService(block) {
    const service = block.getFieldValue('SERVICE');
    return [`game:GetService("${service}")`, Blockly.Lua.ORDER_ATOMIC];
  });
}());
