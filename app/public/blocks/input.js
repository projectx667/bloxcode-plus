/* Input blocks. */
(function registerInputBlocks() {
  const lua = window.BloxCodePlus.lua;
  const COLOUR = 15;

  Blockly.Blocks['bxplus_input_service'] = {
    init() {
      this.appendDummyInput().appendField('UserInputService');
      this.setOutput(true, 'Instance');
      this.setColour(COLOUR);
      this.setTooltip('Gets UserInputService, Roblox’s service for keyboard, mouse, touch and gamepad input. Use it in a LocalScript.');
      this.setHelpUrl('https://create.roblox.com/docs/input');
    }
  };

  lua.register('bxplus_input_service', function generateInputService() {
    return ['game:GetService("UserInputService")', Blockly.Lua.ORDER_ATOMIC];
  });

  Blockly.Blocks['bxplus_when_input_began'] = {
    init() {
      this.appendValueInput('SERVICE').setCheck('Instance').appendField('when input begins on');
      this.appendDummyInput()
        .appendField('key')
        .appendField(new Blockly.FieldDropdown([
          ['Space', 'Space'],
          ['E', 'E'],
          ['F', 'F'],
          ['Q', 'Q'],
          ['LeftShift', 'LeftShift'],
          ['MouseButton1', 'MouseButton1']
        ]), 'KEY');
      this.appendStatementInput('DO').appendField('do');
      this.setColour(COLOUR);
      this.setTooltip('Runs when the local player starts a selected keyboard or mouse input. Put this block in a LocalScript.');
      this.setHelpUrl('https://create.roblox.com/docs/input');
    }
  };

  lua.register('bxplus_when_input_began', function generateInputBegan(block) {
    const service = lua.value(block, 'SERVICE', 'game:GetService("UserInputService")', Blockly.Lua.ORDER_ATOMIC);
    const key = block.getFieldValue('KEY');
    const statements = lua.statement(block, 'DO');
    const indentedStatements = statements
      .split('\n')
      .filter(Boolean)
      .map((line) => `  ${line}`)
      .join('\n');
    const condition = key === 'MouseButton1'
      ? 'input.UserInputType == Enum.UserInputType.MouseButton1'
      : `input.KeyCode == Enum.KeyCode.${key}`;
    return `${service}.InputBegan:Connect(function(input, gameProcessed)\n  if gameProcessed then return end\n  if ${condition} then\n${indentedStatements}\n  end\nend)\n`;
  });
}());
