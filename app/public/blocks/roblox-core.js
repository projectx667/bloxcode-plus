/* Core Roblox workflow blocks. */
(function registerRobloxCoreBlocks() {
  const lua = window.BloxCodePlus.lua;
  const HUMANOID_COLOUR = 230;
  const PART_COLOUR = 20;
  const CAMERA_COLOUR = 160;
  const INPUT_COLOUR = 330;

  function defaultForProperty(property) {
    if (['Anchored', 'CanCollide', 'Sit', 'Jump', 'PlatformStand'].includes(property)) return 'false';
    if (property === 'Material') return 'Enum.Material.Plastic';
    if (property === 'Color') return 'Color3.new(1, 1, 1)';
    if (['Position', 'Size'].includes(property)) return 'Vector3.new(0, 0, 0)';
    if (property === 'CFrame') return 'CFrame.new()';
    return '0';
  }

  function addGetProperty(type, label, inputName, check, output, properties, colour, tooltip, generator) {
    Blockly.Blocks[type] = { init() {
      this.appendValueInput(inputName).setCheck(check).appendField(label);
      this.setOutput(true, output);
      this.setColour(colour);
      this.setTooltip(tooltip);
    }};
    lua.register(type, generator);
  }
  function addSetProperty(type, label, inputName, check, propertyName, properties, colour, tooltip) {
    Blockly.Blocks[type] = { init() {
      this.appendValueInput(inputName).setCheck(check).appendField(label);
      this.appendValueInput('VALUE').appendField(new Blockly.FieldDropdown(properties), 'PROPERTY').appendField('to');
      this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(colour); this.setTooltip(tooltip);
    }};
    lua.register(type, (block) => {
      const object = lua.value(block, inputName, inputName.toLowerCase(), Blockly.Lua.ORDER_ATOMIC);
      const value = lua.value(block, 'VALUE', defaultForProperty(block.getFieldValue('PROPERTY')), Blockly.Lua.ORDER_NONE);
      return `${object}.${block.getFieldValue('PROPERTY')} = ${value}\n`;
    });
  }

  const humanoidProperties = [
    ['WalkSpeed', 'WalkSpeed'], ['JumpPower', 'JumpPower'], ['JumpHeight', 'JumpHeight'],
    ['MaxHealth', 'MaxHealth'], ['Sit', 'Sit'], ['Jump', 'Jump'], ['PlatformStand', 'PlatformStand']
  ];
  addGetProperty('bxplus_humanoid_get_property', 'get humanoid', 'HUMANOID', 'Humanoid', null, humanoidProperties, HUMANOID_COLOUR, 'Reads a common Humanoid property.', (block) => {
    return [`${lua.value(block, 'HUMANOID', 'humanoid', Blockly.Lua.ORDER_ATOMIC)}.${block.getFieldValue('PROPERTY')}`, Blockly.Lua.ORDER_ATOMIC];
  });
  Blockly.Blocks['bxplus_humanoid_get_property'].init = function initHumanoidGetProperty() {
    this.appendValueInput('HUMANOID').setCheck('Humanoid').appendField('get humanoid').appendField(new Blockly.FieldDropdown(humanoidProperties), 'PROPERTY');
    this.setOutput(true); this.setColour(HUMANOID_COLOUR); this.setTooltip('Reads WalkSpeed, JumpPower, JumpHeight, MaxHealth or a common state.');
  };
  addSetProperty('bxplus_humanoid_set_property', 'set humanoid', 'HUMANOID', 'Humanoid', 'PROPERTY', humanoidProperties, HUMANOID_COLOUR, 'Sets a common Humanoid property.');

  function addHumanoidEvent(type, label, event, colour, args, tooltip) {
    Blockly.Blocks[type] = { init() {
      this.appendValueInput('HUMANOID').setCheck('Humanoid').appendField(label);
      this.appendStatementInput('DO').appendField('do');
      this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(colour); this.setTooltip(tooltip);
    }};
    lua.register(type, (block) => {
      const humanoid = lua.value(block, 'HUMANOID', 'humanoid', Blockly.Lua.ORDER_ATOMIC);
      const body = lua.statement(block, 'DO');
      return `${humanoid}.${event}:Connect(function(${args})\n${body}end)\n`;
    });
  }
  addHumanoidEvent('bxplus_humanoid_died', 'when humanoid dies', 'Died', HUMANOID_COLOUR, '', 'Runs when a Humanoid reaches zero Health.');
  addHumanoidEvent('bxplus_humanoid_health_changed', 'when humanoid health changes', 'HealthChanged', HUMANOID_COLOUR, 'health', 'Runs when Humanoid.Health changes.');

  Blockly.Blocks['bxplus_humanoid_move_to'] = { init() {
    this.appendValueInput('HUMANOID').setCheck('Humanoid').appendField('move humanoid to');
    this.appendValueInput('LOCATION').setCheck('Vector3');
    this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(HUMANOID_COLOUR); this.setTooltip('Moves a Humanoid to a Vector3 location.');
  }};
  lua.register('bxplus_humanoid_move_to', (block) => `${lua.value(block, 'HUMANOID', 'humanoid', Blockly.Lua.ORDER_ATOMIC)}:MoveTo(${lua.value(block, 'LOCATION', 'Vector3.new(0, 0, 0)', Blockly.Lua.ORDER_NONE)})\n`);

  const partProperties = [
    ['Position', 'Position'], ['CFrame', 'CFrame'], ['Size', 'Size'], ['Color', 'Color'], ['Transparency', 'Transparency'],
    ['Material', 'Material'], ['Anchored', 'Anchored'], ['CanCollide', 'CanCollide']
  ];
  addGetProperty('bxplus_part_get_property', 'get part', 'PART', 'BasePart', null, partProperties, PART_COLOUR, 'Reads a common BasePart property.', (block) => {
    return [`${lua.value(block, 'PART', 'part', Blockly.Lua.ORDER_ATOMIC)}.${block.getFieldValue('PROPERTY')}`, Blockly.Lua.ORDER_ATOMIC];
  });
  Blockly.Blocks['bxplus_part_get_property'].init = function initPartGetProperty() {
    this.appendValueInput('PART').setCheck('BasePart').appendField('get part').appendField(new Blockly.FieldDropdown(partProperties), 'PROPERTY');
    this.setOutput(true); this.setColour(PART_COLOUR); this.setTooltip('Reads Position, CFrame, Size, Color, Material, Anchored or CanCollide.');
  };
  addSetProperty('bxplus_part_set_property', 'set part', 'PART', 'BasePart', 'PROPERTY', partProperties, PART_COLOUR, 'Sets a common BasePart property.');

  Blockly.Blocks['bxplus_click_detector_clicked'] = { init() {
    this.appendValueInput('DETECTOR').setCheck('ClickDetector').appendField('when ClickDetector is clicked');
    this.appendStatementInput('DO').appendField('do');
    this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(PART_COLOUR); this.setTooltip('Handles ClickDetector.MouseClick and provides the clicking Player.');
  }};
  lua.register('bxplus_click_detector_clicked', (block) => `${lua.value(block, 'DETECTOR', 'clickDetector', Blockly.Lua.ORDER_ATOMIC)}.MouseClick:Connect(function(player)\n${lua.statement(block, 'DO')}end)\n`);

  Blockly.Blocks['bxplus_camera_current'] = { init() {
    this.appendDummyInput().appendField('current camera'); this.setOutput(true, 'Camera'); this.setColour(CAMERA_COLOUR); this.setTooltip('Returns workspace.CurrentCamera. Use from a LocalScript.');
  }};
  lua.register('bxplus_camera_current', () => ['workspace.CurrentCamera', Blockly.Lua.ORDER_ATOMIC]);
  Blockly.Blocks['bxplus_camera_set_type'] = { init() {
    this.appendValueInput('CAMERA').setCheck('Camera').appendField('set camera type');
    this.appendDummyInput().appendField(new Blockly.FieldDropdown([['Custom', 'Custom'], ['Scriptable', 'Scriptable'], ['Attach', 'Attach'], ['Watch', 'Watch'], ['Track', 'Track']]), 'TYPE');
    this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(CAMERA_COLOUR); this.setTooltip('Sets CameraType. Use Scriptable for cutscenes and restore Custom afterwards.');
  }};
  lua.register('bxplus_camera_set_type', (block) => `${lua.value(block, 'CAMERA', 'workspace.CurrentCamera', Blockly.Lua.ORDER_ATOMIC)}.CameraType = Enum.CameraType.${block.getFieldValue('TYPE')}\n`);
  Blockly.Blocks['bxplus_camera_set_cframe'] = { init() {
    this.appendValueInput('CAMERA').setCheck('Camera').appendField('set camera CFrame to'); this.appendValueInput('CFRAME').setCheck('CFrame');
    this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(CAMERA_COLOUR); this.setTooltip('Sets the camera CFrame. Use from a LocalScript.');
  }};
  lua.register('bxplus_camera_set_cframe', (block) => `${lua.value(block, 'CAMERA', 'workspace.CurrentCamera', Blockly.Lua.ORDER_ATOMIC)}.CFrame = ${lua.value(block, 'CFRAME', 'CFrame.new()', Blockly.Lua.ORDER_NONE)}\n`);

  Blockly.Blocks['bxplus_instance_get_children'] = { init() {
    this.appendValueInput('INSTANCE').setCheck('Instance').appendField('get children of'); this.setOutput(true, 'Array'); this.setColour(210); this.setTooltip('Returns all direct children of an Instance.');
  }};
  lua.register('bxplus_instance_get_children', (block) => [`${lua.value(block, 'INSTANCE', 'workspace', Blockly.Lua.ORDER_ATOMIC)}:GetChildren()`, Blockly.Lua.ORDER_ATOMIC]);
  Blockly.Blocks['bxplus_instance_find_child_of_class'] = { init() {
    this.appendValueInput('INSTANCE').setCheck('Instance').appendField('find child of class'); this.appendValueInput('CLASS').setCheck('String').appendField('class'); this.setOutput(true, 'Instance'); this.setColour(210); this.setTooltip('Finds the first child matching a ClassName.');
  }};
  lua.register('bxplus_instance_find_child_of_class', (block) => [`${lua.value(block, 'INSTANCE', 'workspace', Blockly.Lua.ORDER_ATOMIC)}:FindFirstChildOfClass(${lua.value(block, 'CLASS', '"Part"', Blockly.Lua.ORDER_NONE)})`, Blockly.Lua.ORDER_ATOMIC]);

  Blockly.Blocks['bxplus_workspace_raycast'] = { init() {
    this.appendValueInput('ORIGIN').setCheck('Vector3').appendField('raycast from'); this.appendValueInput('DIRECTION').setCheck('Vector3').appendField('direction');
    this.setOutput(true, 'RaycastResult'); this.setColour(65); this.setTooltip('Casts a ray from workspace and returns the RaycastResult or nil.');
  }};
  lua.register('bxplus_workspace_raycast', (block) => [`workspace:Raycast(${lua.value(block, 'ORIGIN', 'Vector3.new(0, 0, 0)', Blockly.Lua.ORDER_NONE)}, ${lua.value(block, 'DIRECTION', 'Vector3.new(0, -1, 0)', Blockly.Lua.ORDER_NONE)})`, Blockly.Lua.ORDER_ATOMIC]);

  Blockly.Blocks['bxplus_mouse_location'] = { init() {
    this.appendDummyInput().appendField('mouse location'); this.setOutput(true, 'Vector2'); this.setColour(INPUT_COLOUR); this.setTooltip('Returns the mouse location from UserInputService. Use from a LocalScript.');
  }};
  lua.register('bxplus_mouse_location', () => ['game:GetService("UserInputService"):GetMouseLocation()', Blockly.Lua.ORDER_ATOMIC]);
  Blockly.Blocks['bxplus_when_mouse_button'] = { init() {
    this.appendDummyInput().appendField('when mouse button').appendField(new Blockly.FieldDropdown([['left', 'MouseButton1'], ['right', 'MouseButton2']]), 'BUTTON');
    this.appendStatementInput('DO').appendField('do'); this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(INPUT_COLOUR); this.setTooltip('Handles a mouse button input through UserInputService. Use from a LocalScript.');
  }};
  lua.register('bxplus_when_mouse_button', (block) => `game:GetService("UserInputService").InputBegan:Connect(function(input, gameProcessed)\n  if gameProcessed then return end\n  if input.UserInputType == Enum.UserInputType.${block.getFieldValue('BUTTON')} then\n${lua.statement(block, 'DO')}  end\nend)\n`);

  Blockly.Blocks['bxplus_chat_system_message'] = { init() {
    this.appendValueInput('MESSAGE').setCheck('String').appendField('display system message'); this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(290); this.setTooltip('Displays a system message through TextChatService. Use from a LocalScript.');
  }};
  lua.register('bxplus_chat_system_message', (block) => `game:GetService("TextChatService").TextChannels.RBXGeneral:DisplaySystemMessage(${lua.value(block, 'MESSAGE', '"Message"', Blockly.Lua.ORDER_NONE)})\n`);
  Blockly.Blocks['bxplus_instance_get_parent'] = { init() {
    this.appendValueInput('INSTANCE').setCheck('Instance').appendField('get parent of'); this.setOutput(true); this.setColour(210); this.setTooltip('Returns an Instance parent.');
  }};
  lua.register('bxplus_instance_get_parent', (block) => [`${lua.value(block, 'INSTANCE', 'instance', Blockly.Lua.ORDER_ATOMIC)}.Parent`, Blockly.Lua.ORDER_ATOMIC]);
  Blockly.Blocks['bxplus_leaderstat_add'] = { init() {
    this.appendValueInput('PLAYER').setCheck('Player').appendField('add');
    this.appendValueInput('AMOUNT').setCheck('Number').appendField('to leaderstat');
    this.appendValueInput('NAME').setCheck('String').appendField('named');
    this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(135); this.setTooltip('Adds to a named IntValue under a player leaderstats folder.');
  }};
  lua.register('bxplus_leaderstat_add', (block) => {
    const player = lua.value(block, 'PLAYER', 'player', Blockly.Lua.ORDER_ATOMIC);
    const amount = lua.value(block, 'AMOUNT', '1', Blockly.Lua.ORDER_NONE);
    const name = lua.value(block, 'NAME', '"Coins"', Blockly.Lua.ORDER_NONE);
    return `local owner = ${player}\nlocal leaderstats = owner and owner:FindFirstChild("leaderstats")\nlocal stat = leaderstats and leaderstats:FindFirstChild(${name})\nif stat then stat.Value += ${amount} end\n`;
  });

  Blockly.Blocks['bxplus_chat_message_received'] = { init() {
    this.appendStatementInput('DO').appendField('when chat message received do'); this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(290); this.setTooltip('Runs when TextChatService receives a message. Use from a LocalScript.');
  }};
  lua.register('bxplus_chat_message_received', (block) => `game:GetService("TextChatService").MessageReceived:Connect(function(textChatMessage)\n${lua.statement(block, 'DO')}end)\n`);
}());

