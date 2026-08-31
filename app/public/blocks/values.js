/* Roblox value blocks. */
(function registerValueBlocks() {
  const lua = window.BloxCodePlus.lua;
  const COLOUR = 65;

  Blockly.Blocks['bxplus_color3_from_rgb'] = {
    init() {
      this.appendValueInput('RED').setCheck('Number').appendField('Color3 from red');
      this.appendValueInput('GREEN').setCheck('Number').appendField('green');
      this.appendValueInput('BLUE').setCheck('Number').appendField('blue');
      this.setOutput(true, 'Color3');
      this.setColour(COLOUR);
      this.setTooltip('Creates a Roblox Color3 value from red, green and blue values between 0 and 255. Use it for Parts and GUI colors.');
      this.setHelpUrl('https://create.roblox.com/docs/reference/engine/datatypes/Color3');
    }
  };

  lua.register('bxplus_color3_from_rgb', function generateColor3(block) {
    const red = lua.value(block, 'RED', '255', Blockly.Lua.ORDER_NONE);
    const green = lua.value(block, 'GREEN', '255', Blockly.Lua.ORDER_NONE);
    const blue = lua.value(block, 'BLUE', '255', Blockly.Lua.ORDER_NONE);
    return [`Color3.fromRGB(${red}, ${green}, ${blue})`, Blockly.Lua.ORDER_ATOMIC];
  });

  Blockly.Blocks['bxplus_udim2_new'] = {
    init() {
      this.appendValueInput('X_SCALE').setCheck('Number').appendField('UDim2 x scale');
      this.appendValueInput('X_OFFSET').setCheck('Number').appendField('x offset');
      this.appendValueInput('Y_SCALE').setCheck('Number').appendField('y scale');
      this.appendValueInput('Y_OFFSET').setCheck('Number').appendField('y offset');
      this.setOutput(true, 'UDim2');
      this.setColour(COLOUR);
      this.setTooltip('Creates a UDim2 value for GUI position or size. Scale is relative to the screen; offset is a pixel value.');
      this.setHelpUrl('https://create.roblox.com/docs/reference/engine/datatypes/UDim2');
    }
  };

  lua.register('bxplus_udim2_new', function generateUDim2(block) {
    const xScale = lua.value(block, 'X_SCALE', '0', Blockly.Lua.ORDER_NONE);
    const xOffset = lua.value(block, 'X_OFFSET', '0', Blockly.Lua.ORDER_NONE);
    const yScale = lua.value(block, 'Y_SCALE', '0', Blockly.Lua.ORDER_NONE);
    const yOffset = lua.value(block, 'Y_OFFSET', '0', Blockly.Lua.ORDER_NONE);
    return [`UDim2.new(${xScale}, ${xOffset}, ${yScale}, ${yOffset})`, Blockly.Lua.ORDER_ATOMIC];
  });

  Blockly.Blocks['bxplus_cframe_new'] = {
    init() {
      this.appendValueInput('X').setCheck('Number').appendField('CFrame at x');
      this.appendValueInput('Y').setCheck('Number').appendField('y');
      this.appendValueInput('Z').setCheck('Number').appendField('z');
      this.setOutput(true, 'CFrame');
      this.setColour(COLOUR);
      this.setTooltip('Creates a CFrame at a position. Use CFrames when you need to position or move Parts precisely.');
      this.setHelpUrl('https://create.roblox.com/docs/reference/engine/datatypes/CFrame');
    }
  };

  lua.register('bxplus_cframe_new', function generateCFrame(block) {
    const x = lua.value(block, 'X', '0', Blockly.Lua.ORDER_NONE);
    const y = lua.value(block, 'Y', '0', Blockly.Lua.ORDER_NONE);
    const z = lua.value(block, 'Z', '0', Blockly.Lua.ORDER_NONE);
    return [`CFrame.new(${x}, ${y}, ${z})`, Blockly.Lua.ORDER_ATOMIC];
  });
}());
