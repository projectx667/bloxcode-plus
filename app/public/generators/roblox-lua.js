/* Shared Blockly Lua generator helpers. */
(function registerBloxCodePlusGenerators() {
  if (!window.Blockly || !Blockly.Lua) {
    throw new Error('Blockly Lua generator must load before BloxCode Plus generators.');
  }

  const Lua = Blockly.Lua;
  const BloxCodePlus = window.BloxCodePlus = window.BloxCodePlus || {};

  BloxCodePlus.lua = {
    value(block, inputName, fallback, order) {
      const generated = Lua.valueToCode(block, inputName, order || Lua.ORDER_NONE);
      return generated || fallback;
    },

    variable(block, fieldName) {
      return Lua.nameDB_.getName(
        block.getFieldValue(fieldName),
        Blockly.Variables.CATEGORY_NAME
      );
    },

    statement(block, inputName) {
      return Lua.statementToCode(block, inputName) || '';
    },

    register(blockType, generator) {
      Lua[blockType] = generator;
    }
  };
}());
