/* GUI blocks. */
(function registerGuiBuilderBlocks() {
  const lua = window.BloxCodePlus.lua;
  const COLOUR = 290;

  Blockly.Blocks['bxplus_create_gui'] = {
    init() {
      this.appendValueInput('PARENT')
        .setCheck('Instance')
        .appendField('create GUI');
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['ScreenGui', 'ScreenGui'],
          ['Frame', 'Frame'],
          ['TextLabel', 'TextLabel'],
          ['TextButton', 'TextButton'],
          ['TextBox', 'TextBox'],
          ['ImageLabel', 'ImageLabel'],
          ['ImageButton', 'ImageButton']
        ]), 'CLASS')
        .appendField('inside');
      this.setOutput(true, 'Instance');
      this.setColour(COLOUR);
      this.setTooltip('Creates a common GUI object inside a parent such as PlayerGui, a ScreenGui or a Frame.');
      this.setHelpUrl('https://create.roblox.com/docs/ui');
    }
  };

  lua.register('bxplus_create_gui', function generateCreateGui(block) {
    const className = block.getFieldValue('CLASS');
    const parent = lua.value(block, 'PARENT', 'game:GetService("Players").LocalPlayer:WaitForChild("PlayerGui")', Blockly.Lua.ORDER_NONE);
    return [`Instance.new("${className}", ${parent})`, Blockly.Lua.ORDER_ATOMIC];
  });

  Blockly.Blocks['bxplus_set_gui_layout'] = {
    init() {
      this.appendValueInput('GUI').setCheck('Instance').appendField('set GUI');
      this.appendValueInput('VALUE')
        .appendField(new Blockly.FieldDropdown([
          ['Position', 'Position'],
          ['Size', 'Size'],
          ['BackgroundColor3', 'BackgroundColor3'],
          ['TextColor3', 'TextColor3'],
          ['Text', 'Text'],
          ['Visible', 'Visible'],
          ['AnchorPoint', 'AnchorPoint'],
          ['ZIndex', 'ZIndex']
        ]), 'PROPERTY')
        .appendField('to');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(COLOUR);
      this.setTooltip('Sets a common GUI property. Pair Position or Size with a UDim2 block, and color properties with a Color3 block.');
      this.setHelpUrl('https://create.roblox.com/docs/ui/position-and-size');
    }
  };

  lua.register('bxplus_set_gui_layout', function generateSetGuiLayout(block) {
    const gui = lua.value(block, 'GUI', 'guiObject', Blockly.Lua.ORDER_ATOMIC);
    const property = block.getFieldValue('PROPERTY');
    const value = lua.value(block, 'VALUE', 'nil', Blockly.Lua.ORDER_NONE);
    return `${gui}.${property} = ${value}\n`;
  });

  Blockly.Blocks['bxplus_when_button_clicked'] = {
    init() {
      this.appendValueInput('BUTTON').setCheck('Instance').appendField('when button');
      this.appendStatementInput('DO').appendField('is clicked, do');
      this.setColour(COLOUR);
      this.setTooltip('Runs the connected blocks when a TextButton or ImageButton is clicked by the local player. Use this in a LocalScript.');
      this.setHelpUrl('https://create.roblox.com/docs/ui/buttons');
    }
  };

  lua.register('bxplus_when_button_clicked', function generateButtonClicked(block) {
    const button = lua.value(block, 'BUTTON', 'button', Blockly.Lua.ORDER_ATOMIC);
    const statements = lua.statement(block, 'DO');
    return `${button}.Activated:Connect(function()\n${statements}end)\n`;
  });
}());
