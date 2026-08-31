(function bootBloxCodePlus() {
  'use strict';

  const PROJECT_FORMAT = 'bloxcode-plus-project';
  const DEFAULT_CODE = '-- Add blocks to generate Luau code.';
  const elements = {
    search: document.getElementById('block-search'),
    clearSearch: document.getElementById('clear-search-button'),
    searchResults: document.getElementById('search-results'),
    blockCount: document.getElementById('block-count'),
    luaOutput: document.getElementById('lua-output'),
    projectName: document.getElementById('project-name'),
    projectState: document.getElementById('project-state'),
    copyFeedback: document.getElementById('copy-feedback'),
    validationMessage: document.getElementById('validation-message'),
    scriptTarget: document.getElementById('script-target'),
    renameDialog: document.getElementById('rename-dialog'),
    renameForm: document.getElementById('rename-project-form'),
    renameInput: document.getElementById('rename-project-input'),
    renameCancel: document.getElementById('rename-cancel-button'),
    blocklyPromptDialog: document.getElementById('blockly-prompt-dialog'),
    blocklyPromptForm: document.getElementById('blockly-prompt-form'),
    blocklyPromptTitle: document.getElementById('blockly-prompt-title'),
    blocklyPromptLabel: document.getElementById('blockly-prompt-label'),
    blocklyPromptInput: document.getElementById('blockly-prompt-input'),
    blocklyPromptCancel: document.getElementById('blockly-prompt-cancel-button'),
    blocklyPromptSubmit: document.getElementById('blockly-prompt-submit-button'),
    blocklyConfirmDialog: document.getElementById('blockly-confirm-dialog'),
    blocklyConfirmTitle: document.getElementById('blockly-confirm-title'),
    blocklyConfirmMessage: document.getElementById('blockly-confirm-message'),
    blocklyConfirmCancel: document.getElementById('blockly-confirm-cancel-button'),
    blocklyConfirmSubmit: document.getElementById('blockly-confirm-submit-button')
  };

  let workspace;
  let projectName = 'Untitled project';
  let feedbackTimer;
  let blockIndex = [];

  let blocklyPromptCallback = null;
  let blocklyConfirmCallback = null;

  const theme = Blockly.Theme.defineTheme('bloxcodePlusDark', {
    base: Blockly.Themes.Classic,
    componentStyles: {
      workspaceBackgroundColour: '#1e1e1e',
      toolboxBackgroundColour: '#252526',
      toolboxForegroundColour: '#f1f1f1',
      flyoutBackgroundColour: '#2a2a2e',
      flyoutForegroundColour: '#f1f1f1',
      flyoutOpacity: 1,
      scrollbarColour: '#6f6f75',
      scrollbarOpacity: 0.45,
      insertionMarkerColour: '#79b8ff',
      insertionMarkerOpacity: 0.3,
      cursorColour: '#79b8ff'
    }
  });

  const DARK_TEXT_BLOCKS = new Set([
    'bxplus_color3_from_rgb',
    'bxplus_udim2_new',
    'bxplus_cframe_new',
    'bxplus_load_data_safely',
    'bxplus_update_number_safely'
  ]);

  function applyBlockTextContrast() {
    if (!workspace) return;
    workspace.getAllBlocks(false).forEach((block) => {
      if (!DARK_TEXT_BLOCKS.has(block.type)) return;
      const root = block.getSvgRoot();
      if (!root) return;
      root.querySelectorAll('.blocklyText').forEach((text) => {
        text.setAttribute('fill', '#171719');
      });
    });
  }

  function setProjectState(message) {
    elements.projectState.textContent = message;
  }

  function setFeedback(message, isError) {
    window.clearTimeout(feedbackTimer);
    elements.copyFeedback.textContent = message;
    elements.copyFeedback.classList.toggle('error', Boolean(isError));
    if (message) {
      feedbackTimer = window.setTimeout(() => {
        elements.copyFeedback.textContent = '';
        elements.copyFeedback.classList.remove('error');
      }, 3200);
    }
  }

  function displayProjectName() {
    elements.projectName.textContent = projectName;
  }

  function normalizeProjectName(value) {
    return String(value || '')
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '')
      .trim()
      .slice(0, 90);
  }

  function applyProjectTarget(value) {
    const legacyTargets = {
      script: 'server-script',
      localscript: 'local-player',
      modulescript: 'shared-module'
    };
    const targetId = legacyTargets[value] || value;
    if (window.BloxCodePlus.scriptContexts.targets[targetId]) {
      elements.scriptTarget.value = targetId;
    }
  }

  function closeRenameDialog() {
    elements.renameDialog.hidden = true;
  }

  function openRenameDialog() {
    elements.renameInput.value = projectName;
    elements.renameDialog.hidden = false;
    window.requestAnimationFrame(() => {
      elements.renameInput.focus();
      elements.renameInput.select();
    });
  }

  function renameProject(event) {
    if (event) event.preventDefault();
    const nextName = normalizeProjectName(elements.renameInput.value);
    if (!nextName) {
      setFeedback('Choose a project name before saving.', true);
      elements.renameInput.focus();
      return;
    }
    projectName = nextName;
    displayProjectName();
    closeRenameDialog();
    setProjectState('Renamed');
  }

  function closeBlocklyPrompt(value) {
    const callback = blocklyPromptCallback;
    blocklyPromptCallback = null;
    elements.blocklyPromptDialog.hidden = true;
    if (callback) callback(value);
  }

  function openBlocklyPrompt(message, defaultValue, callback) {
    const promptText = String(message || 'Variable name').replace(/:$/, '');
    const isRename = /^rename/i.test(promptText);
    blocklyPromptCallback = callback;
    elements.blocklyPromptTitle.textContent = isRename ? 'Rename variable' : 'Create variable';
    elements.blocklyPromptLabel.textContent = promptText;
    elements.blocklyPromptSubmit.textContent = isRename ? 'Rename' : 'Create';
    elements.blocklyPromptInput.value = String(defaultValue || '');
    elements.blocklyPromptDialog.hidden = false;
    window.requestAnimationFrame(() => {
      elements.blocklyPromptInput.focus();
      elements.blocklyPromptInput.select();
    });
  }

  function submitBlocklyPrompt(event) {
    event.preventDefault();
    const value = elements.blocklyPromptInput.value.trim();
    if (!value) {
      elements.blocklyPromptInput.focus();
      return;
    }
    closeBlocklyPrompt(value);
  }

  function closeBlocklyConfirm(confirmed) {
    const callback = blocklyConfirmCallback;
    blocklyConfirmCallback = null;
    elements.blocklyConfirmDialog.hidden = true;
    if (callback) callback(Boolean(confirmed));
  }

  function openBlocklyConfirm(message, callback) {
    blocklyConfirmCallback = callback;
    elements.blocklyConfirmTitle.textContent = 'Confirm';
    elements.blocklyConfirmMessage.textContent = String(message || 'Continue?');
    elements.blocklyConfirmCancel.hidden = false;
    elements.blocklyConfirmSubmit.textContent = 'Continue';
    elements.blocklyConfirmDialog.hidden = false;
    window.requestAnimationFrame(() => elements.blocklyConfirmSubmit.focus());
  }

  function openBlocklyAlert(message, callback) {
    blocklyConfirmCallback = callback;
    elements.blocklyConfirmTitle.textContent = 'Notice';
    elements.blocklyConfirmMessage.textContent = String(message || '');
    elements.blocklyConfirmCancel.hidden = true;
    elements.blocklyConfirmSubmit.textContent = 'OK';
    elements.blocklyConfirmDialog.hidden = false;
    window.requestAnimationFrame(() => elements.blocklyConfirmSubmit.focus());
  }

  function requestConfirmation(message) {
    return new Promise((resolve) => openBlocklyConfirm(message, resolve));
  }

  function makeProject() {
    return {
      format: PROJECT_FORMAT,
      version: 1,
      name: projectName,
      target: elements.scriptTarget.value,
      savedAt: new Date().toISOString(),
      workspace: Blockly.serialization.workspaces.save(workspace)
    };
  }

  function generateLua() {
    try {
      Blockly.Lua.INFINITE_LOOP_TRAP = null;
      const code = Blockly.Lua.workspaceToCode(workspace).trim();
      elements.luaOutput.textContent = code || DEFAULT_CODE;
    } catch (error) {
      console.error('Lua generation failed:', error);
      elements.luaOutput.textContent = '-- Luau generation failed.\n-- Check the workspace and try again.';
      setFeedback('Luau could not be generated. Check the workspace and try again.', true);
    }
  }

  function updateWorkspace() {
    generateLua();
  }

  function inspectExportTarget() {
    return window.BloxCodePlus.scriptContexts.inspect(workspace, elements.scriptTarget.value);
  }

  window.BloxCodePlus.inspectExportTarget = inspectExportTarget;

  function flattenToolbox(contents, category) {
    if (!Array.isArray(contents)) return;
    contents.forEach((item) => {
      if (item.kind === 'category') {
        flattenToolbox(item.contents, item.name || category);
      } else if (item.kind === 'block' && item.type) {
        blockIndex.push({ type: item.type, category: category || 'Blocks' });
      }
    });
  }

  function readableBlockName(type) {
    return type
      .replace(/^bxplus_/, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function buildBlockIndex() {
    blockIndex = [];
    flattenToolbox(bloxcodePlusToolbox.contents, 'Blocks');
    const unique = new Map();
    blockIndex.forEach((entry) => unique.set(entry.type, entry));
    blockIndex = Array.from(unique.values()).map((entry) => ({
      ...entry,
      label: readableBlockName(entry.type),
      searchable: `${entry.type} ${readableBlockName(entry.type)} ${entry.category}`.toLowerCase()
    }));
    elements.blockCount.textContent = `${blockIndex.length} blocks`;
  }

  function addBlockFromSearch(type) {
    const block = workspace.newBlock(type);
    block.initSvg();
    block.render();
    applyBlockTextContrast();
    const metrics = workspace.getMetrics();
    block.moveBy(Math.max(30, metrics.viewLeft + 40), Math.max(30, metrics.viewTop + 40));
    block.select();
    workspace.centerOnBlock(block.id);
    updateWorkspace();
  }

  function renderSearchResults(query) {
    const normalized = query.trim().toLowerCase();
    elements.clearSearch.hidden = !normalized;
    if (!normalized) {
      elements.searchResults.hidden = true;
      elements.searchResults.replaceChildren();
      return;
    }

    const matches = blockIndex.filter((entry) => entry.searchable.includes(normalized)).slice(0, 9);
    elements.searchResults.hidden = false;
    elements.searchResults.replaceChildren();
    if (!matches.length) {
      const empty = document.createElement('p');
      empty.className = 'search-empty';
      empty.textContent = 'No matching blocks. Try a Roblox service, event or property.';
      elements.searchResults.appendChild(empty);
      return;
    }

    matches.forEach((entry) => {
      const result = document.createElement('button');
      result.type = 'button';
      result.className = 'search-result';
      result.innerHTML = `<strong>${entry.label}</strong><span>${entry.category}</span>`;
      result.addEventListener('click', () => {
        addBlockFromSearch(entry.type);
        elements.search.value = '';
        renderSearchResults('');
      });
      elements.searchResults.appendChild(result);
    });
  }

  async function resetWorkspace() {
    if (workspace.getAllBlocks(false).length && !(await requestConfirmation('Clear every block in this project?'))) return;
    workspace.clear();
    if (workspace.trashcan?.emptyContents) workspace.trashcan.emptyContents();
    window.setTimeout(() => workspace.trashcan?.emptyContents?.(), 0);
    projectName = 'Untitled project';
    displayProjectName();
    setProjectState('New project');
    updateWorkspace();
  }

  function bindTrashcanClick() {
    const trashcan = workspace.trashcan;
    if (!trashcan || !trashcan.svgGroup_) return;

    const trashButton = trashcan.svgGroup_;
    const positionTrashcan = trashcan.position.bind(trashcan);
    const alignTrashcan = () => {
      const transform = trashButton.getAttribute('transform') || '';
      const match = /^translate\(([-\d.]+),\s*([-\d.]+)\)$/.exec(transform);
      if (!match) return;
      trashButton.setAttribute('transform', `translate(${Number(match[1]) + 8},${match[2]})`);
    };
    trashcan.position = (...args) => {
      positionTrashcan(...args);
      alignTrashcan();
    };

    const hitArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    hitArea.setAttribute('x', '0');
    hitArea.setAttribute('y', '0');
    hitArea.setAttribute('width', '48');
    hitArea.setAttribute('height', '60');
    hitArea.setAttribute('fill', 'transparent');
    hitArea.setAttribute('pointer-events', 'all');
    hitArea.setAttribute('aria-hidden', 'true');
    trashButton.appendChild(hitArea);

    const toggleFlyout = (event, deferOpening) => {
      event.preventDefault();
      if (trashcan.contentsIsOpen()) {
        trashcan.closeFlyout();
      } else if (deferOpening) {
        window.setTimeout(() => trashcan.click(), 120);
      } else {
        trashcan.click();
      }
    };
    const handleMouseDown = (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      toggleFlyout(event, true);
    };

    trashButton.setAttribute('role', 'button');
    trashButton.setAttribute('tabindex', '0');
    trashButton.setAttribute('aria-label', 'Open recently deleted blocks');
    trashButton.setAttribute('title', 'Open recently deleted blocks');
    trashButton.addEventListener('mousedown', handleMouseDown, true);
    trashButton.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') toggleFlyout(event, false);
    });
    document.addEventListener('mousedown', (event) => {
      if (!trashcan.contentsIsOpen()) return;
      const target = event.target;
      if (trashButton.contains(target) || target.closest('.blocklyFlyout')) return;
      trashcan.closeFlyout();
    }, true);
  }

  function loadSerializedWorkspace(data) {
    workspace.clear();
    if (typeof data === 'string' && data.trim().startsWith('<xml')) {
      const dom = Blockly.Xml.textToDom(data);
      Blockly.Xml.domToWorkspace(dom, workspace);
    } else {
      Blockly.serialization.workspaces.load(data, workspace);
    }
    Blockly.svgResize(workspace);
    applyBlockTextContrast();
    updateWorkspace();
  }

  function loadProject(project) {
    const source = project.workspace || project;
    projectName = (project.name || 'Imported project').replace(/\.blox$/i, '');
    applyProjectTarget(project.target);
    displayProjectName();
    loadSerializedWorkspace(source);
    setProjectState('Project loaded');
  }

  async function saveProjectFile() {
    const payload = makeProject();
    try {
      if (window.bloxcodePlus && window.bloxcodePlus.saveProject) {
        const result = await window.bloxcodePlus.saveProject(payload);
        if (result && !result.canceled) {
          projectName = result.name || projectName;
          displayProjectName();
          setProjectState('Saved');
          setFeedback('Project saved as a .blox file.');
        }
        return;
      }
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${projectName.replace(/[^a-z0-9-_ ]/gi, '').trim() || 'bloxcode-plus-project'}.blox`;
      link.click();
      URL.revokeObjectURL(link.href);
      setProjectState('Saved');
      setFeedback('Project downloaded as a .blox file.');
    } catch (error) {
      console.error('Unable to save project:', error);
      setFeedback('The project could not be saved.', true);
    }
  }

  async function openProjectFile() {
    try {
      if (window.bloxcodePlus && window.bloxcodePlus.openProject) {
        const result = await window.bloxcodePlus.openProject();
        if (result && !result.canceled && result.project) loadProject(result.project);
        return;
      }
      setFeedback('Opening files is available in the desktop application.', true);
    } catch (error) {
      console.error('Unable to open project:', error);
      setFeedback('The selected .blox file could not be opened.', true);
    }
  }

  async function exportLuaFile() {
    const code = elements.luaOutput.textContent;
    if (!code || code === DEFAULT_CODE || code.startsWith('-- BloxCode Plus could not')) {
      setFeedback('Add a block before exporting Lua.', true);
      return;
    }
    const diagnostics = inspectExportTarget();
    const exportFeedback = (baseMessage) => {
      const suffix = diagnostics.length ? ` Review: ${diagnostics.join(' ')}` : '';
      setFeedback(`${baseMessage}${suffix}`);
    };
    try {
      if (window.bloxcodePlus && window.bloxcodePlus.exportLua) {
        const result = await window.bloxcodePlus.exportLua({ name: projectName, code });
        if (result && !result.canceled) {
          setProjectState('Luau exported');
          exportFeedback('Luau exported as a local file.');
        }
        return;
      }
      const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${normalizeProjectName(projectName).replace(/\s+/g, '-') || 'bloxcode-plus-script'}.lua`;
      link.click();
      URL.revokeObjectURL(link.href);
      exportFeedback('Luau downloaded as a local file.');
    } catch (error) {
      console.error('Unable to export Lua:', error);
      setFeedback('The Lua file could not be exported.', true);
    }
  }

  async function copyLua() {
    const code = elements.luaOutput.textContent;
    if (!code || code === DEFAULT_CODE) {
      setFeedback('Add a block before copying code.', true);
      return;
    }
    try {
      if (window.bloxcodePlus && window.bloxcodePlus.copyText) {
        await window.bloxcodePlus.copyText(code);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(code);
      } else {
        throw new Error('Clipboard access is unavailable.');
      }
      setFeedback('Lua copied to the clipboard.');
    } catch (error) {
      console.error('Unable to copy Lua:', error);
      setFeedback('The code could not be copied. Select it manually instead.', true);
    }
  }

  async function loadTemplate(templateName) {
    const templates = {
      "hello-player": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><variables><variable id=\"playerVar\">player</variable></variables><block type=\"bxplus_when_player_joins\" x=\"70\" y=\"70\"><field name=\"PLAYER\" id=\"playerVar\">player</field><statement name=\"DO\"><block type=\"text_print\"><value name=\"TEXT\"><block type=\"text\"><field name=\"TEXT\">Welcome to the experience!</field></block></value></block></statement></block></xml>",
      "touched-part": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><variables><variable id=\"otherPartVar\">otherPart</variable></variables><block type=\"bxplus_when_part_touched\" x=\"70\" y=\"70\"><field name=\"OTHER_PART\" id=\"otherPartVar\">otherPart</field><value name=\"PART\"><block type=\"instance_wait_for_child\"><field name=\"INSTANCE\">workspace</field><value name=\"NAME\"><block type=\"text\"><field name=\"TEXT\">Coin</field></block></value></block></value><statement name=\"DO\"><block type=\"text_print\"><value name=\"TEXT\"><block type=\"text\"><field name=\"TEXT\">A part was touched!</field></block></value></block></statement></block></xml>",
      "leaderstats": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><variables><variable id=\"playerVar\">player</variable><variable id=\"collectibleVar\">collectible</variable><variable id=\"hitVar\">hit</variable></variables><block type=\"variables_set\" x=\"70\" y=\"70\"><field name=\"VAR\" id=\"collectibleVar\">collectible</field><value name=\"VALUE\"><block type=\"instance_wait_for_child\"><field name=\"INSTANCE\">workspace</field><value name=\"NAME\"><block type=\"text\"><field name=\"TEXT\">Coin</field></block></value></block></value></block><block type=\"bxplus_when_player_joins\"><field name=\"PLAYER\" id=\"playerVar\">player</field><statement name=\"DO\"><block type=\"bxplus_create_leaderstat\"><value name=\"PLAYER\"><block type=\"variables_get\"><field name=\"VAR\" id=\"playerVar\">player</field></block></value><value name=\"NAME\"><block type=\"text\"><field name=\"TEXT\">Coins</field></block></value><value name=\"VALUE\"><block type=\"math_number\"><field name=\"NUM\">0</field></block></value></block></statement></block><block type=\"bxplus_when_part_touched\" x=\"70\" y=\"360\"><field name=\"OTHER_PART\" id=\"hitVar\">hit</field><value name=\"PART\"><block type=\"variables_get\"><field name=\"VAR\" id=\"collectibleVar\">collectible</field></block></value><statement name=\"DO\"><block type=\"bxplus_leaderstat_add\"><value name=\"PLAYER\"><block type=\"bxplus_get_player_from_character\"><value name=\"CHARACTER\"><block type=\"bxplus_instance_get_parent\"><value name=\"INSTANCE\"><block type=\"variables_get\"><field name=\"VAR\" id=\"hitVar\">hit</field></block></value></block></value></block></value><value name=\"AMOUNT\"><block type=\"math_number\"><field name=\"NUM\">1</field></block></value><value name=\"NAME\"><block type=\"text\"><field name=\"TEXT\">Coins</field></block></value></block></statement></block><block type=\"bxplus_part_set_property\" x=\"70\" y=\"250\"><field name=\"PROPERTY\">CanCollide</field><value name=\"PART\"><block type=\"variables_get\"><field name=\"VAR\" id=\"collectibleVar\">collectible</field></block></value><value name=\"VALUE\"><block type=\"logic_boolean\"><field name=\"BOOL\">FALSE</field></block></value></block></xml>",
      "input-action": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"bxplus_when_input_began\" x=\"70\" y=\"70\"><field name=\"KEY\">Space</field><value name=\"SERVICE\"><block type=\"bxplus_input_service\"></block></value><statement name=\"DO\"><block type=\"text_print\"><value name=\"TEXT\"><block type=\"text\"><field name=\"TEXT\">Space pressed!</field></block></value></block></statement></block></xml>",
      "checkpoint-progression": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><variables><variable id=\"playerVar\">player</variable></variables><block type=\"bxplus_when_player_joins\"><field name=\"PLAYER\" id=\"playerVar\">player</field><statement name=\"DO\"><block type=\"bxplus_create_leaderstat\"><value name=\"PLAYER\"><block type=\"variables_get\"><field name=\"VAR\" id=\"playerVar\">player</field></block></value><value name=\"NAME\"><block type=\"text\"><field name=\"TEXT\">Checkpoint</field></block></value><value name=\"VALUE\"><block type=\"math_number\"><field name=\"NUM\">0</field></block></value></block></statement></block></xml>",
      "proximity-prompt-door": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><variables><variable id=\"doorVar\">door</variable><variable id=\"promptVar\">prompt</variable><variable id=\"playerVar\">player</variable></variables><block type=\"variables_set\" x=\"70\" y=\"70\"><field name=\"VAR\" id=\"doorVar\">door</field><value name=\"VALUE\"><block type=\"instance_wait_for_child\"><field name=\"INSTANCE\">workspace</field><value name=\"NAME\"><block type=\"text\"><field name=\"TEXT\">Door</field></block></value></block></value><next><block type=\"variables_set\"><field name=\"VAR\" id=\"promptVar\">prompt</field><value name=\"VALUE\"><block type=\"proximity_prompt_new\"><field name=\"PARENT\" id=\"doorVar\">door</field></block></value><next><block type=\"proximity_prompt_set_text\"><field name=\"PROMPT\" id=\"promptVar\">prompt</field><value name=\"ACTION_TEXT\"><block type=\"text\"><field name=\"TEXT\">Open</field></block></value><value name=\"OBJECT_TEXT\"><block type=\"text\"><field name=\"TEXT\">Door</field></block></value><next><block type=\"proximity_prompt_set_property\"><field name=\"PROPERTY\">HoldDuration</field><field name=\"PROMPT\" id=\"promptVar\">prompt</field><value name=\"VALUE\"><block type=\"math_number\"><field name=\"NUM\">0.5</field></block></value></block></next></block></next></block></next></block><block type=\"proximity_prompt_triggered\" x=\"70\" y=\"360\"><field name=\"PROMPT\" id=\"promptVar\">prompt</field><field name=\"PLAYER\" id=\"playerVar\">player</field><statement name=\"DO\"><block type=\"bxplus_part_set_property\"><field name=\"PROPERTY\">CanCollide</field><value name=\"PART\"><block type=\"variables_get\"><field name=\"VAR\" id=\"doorVar\">door</field></block></value><value name=\"VALUE\"><block type=\"logic_boolean\"><field name=\"BOOL\">FALSE</field></block></value><next><block type=\"bxplus_part_set_property\"><field name=\"PROPERTY\">Transparency</field><value name=\"PART\"><block type=\"variables_get\"><field name=\"VAR\" id=\"doorVar\">door</field></block></value><value name=\"VALUE\"><block type=\"math_number\"><field name=\"NUM\">0.65</field></block></value><next><block type=\"wait\"><field name=\"AMOUNT\">2</field><next><block type=\"bxplus_part_set_property\"><field name=\"PROPERTY\">CanCollide</field><value name=\"PART\"><block type=\"variables_get\"><field name=\"VAR\" id=\"doorVar\">door</field></block></value><value name=\"VALUE\"><block type=\"logic_boolean\"><field name=\"BOOL\">TRUE</field></block></value><next><block type=\"bxplus_part_set_property\"><field name=\"PROPERTY\">Transparency</field><value name=\"PART\"><block type=\"variables_get\"><field name=\"VAR\" id=\"doorVar\">door</field></block></value><value name=\"VALUE\"><block type=\"math_number\"><field name=\"NUM\">0</field></block></value></block></next></block></next></block></next></block></next></block></statement></block></xml>",
      "speed-boost": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><variables><variable id=\"playerVar\">player</variable><variable id=\"characterVar\">character</variable><variable id=\"humanoidVar\">humanoid</variable></variables><block type=\"bxplus_when_player_joins\"><field name=\"PLAYER\" id=\"playerVar\">player</field><statement name=\"DO\"><block type=\"variables_set\"><field name=\"VAR\" id=\"characterVar\">character</field><value name=\"VALUE\"><block type=\"bxplus_player_character\"><value name=\"PLAYER\"><block type=\"variables_get\"><field name=\"VAR\">player</field></block></value></block></value><next><block type=\"variables_set\"><field name=\"VAR\" id=\"humanoidVar\">humanoid</field><value name=\"VALUE\"><block type=\"bxplus_instance_find_child_of_class\"><value name=\"INSTANCE\"><block type=\"variables_get\"><field name=\"VAR\" id=\"characterVar\">character</field></block></value><value name=\"CLASS\"><block type=\"text\"><field name=\"TEXT\">Humanoid</field></block></value></block></value><next><block type=\"bxplus_humanoid_set_property\"><field name=\"PROPERTY\">WalkSpeed</field><value name=\"HUMANOID\"><block type=\"variables_get\"><field name=\"VAR\" id=\"humanoidVar\">humanoid</field></block></value><value name=\"VALUE\"><block type=\"math_number\"><field name=\"NUM\">32</field></block></value></block></next></block></next></block></statement></block></xml>",
      "health-and-damage": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><variables><variable id=\"playerVar\">player</variable><variable id=\"characterVar\">character</variable><variable id=\"humanoidVar\">humanoid</variable></variables><block type=\"bxplus_when_player_joins\"><field name=\"PLAYER\" id=\"playerVar\">player</field><statement name=\"DO\"><block type=\"variables_set\"><field name=\"VAR\" id=\"characterVar\">character</field><value name=\"VALUE\"><block type=\"bxplus_player_character\"><value name=\"PLAYER\"><block type=\"variables_get\"><field name=\"VAR\" id=\"playerVar\">player</field></block></value></block></value><next><block type=\"variables_set\"><field name=\"VAR\" id=\"humanoidVar\">humanoid</field><value name=\"VALUE\"><block type=\"bxplus_instance_find_child_of_class\"><value name=\"INSTANCE\"><block type=\"variables_get\"><field name=\"VAR\" id=\"characterVar\">character</field></block></value><value name=\"CLASS\"><block type=\"text\"><field name=\"TEXT\">Humanoid</field></block></value></block></value><next><block type=\"bxplus_humanoid_set_health\"><value name=\"HUMANOID\"><block type=\"variables_get\"><field name=\"VAR\" id=\"humanoidVar\">humanoid</field></block></value><value name=\"HEALTH\"><block type=\"math_number\"><field name=\"NUM\">100</field></block></value><next><block type=\"bxplus_humanoid_take_damage\"><value name=\"HUMANOID\"><block type=\"variables_get\"><field name=\"VAR\" id=\"humanoidVar\">humanoid</field></block></value><value name=\"DAMAGE\"><block type=\"math_number\"><field name=\"NUM\">25</field></block></value><next><block type=\"text_print\"><value name=\"TEXT\"><block type=\"bxplus_humanoid_get_health\"><value name=\"HUMANOID\"><block type=\"variables_get\"><field name=\"VAR\" id=\"humanoidVar\">humanoid</field></block></value></block></value></block></next></block></next></block></next></block></next></block></statement></block></xml>",
      "validated-shop": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><variables><variable id=\"itemIdVar\">itemId</variable></variables><block type=\"bxplus_when_remote_event_received\"><field name=\"PLAYER\">player</field><field name=\"VALUE\" id=\"itemIdVar\">itemId</field><value name=\"EVENT\"><block type=\"bxplus_remote_event\"><value name=\"NAME\"><block type=\"text\"><field name=\"TEXT\">ShopRequest</field></block></value></block></value><statement name=\"DO\"><block type=\"text_print\"><value name=\"TEXT\"><block type=\"variables_get\"><field name=\"VAR\" id=\"itemIdVar\">itemId</field></block></value></block></statement></block></xml>"
    };
    if (!templates[templateName]) return;
    if (workspace.getAllBlocks(false).length && !(await requestConfirmation('Replace the current workspace with this template?'))) return;
    projectName = templateName.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
    const templateTargets = {
      'hello-player': 'server-script',
      'touched-part': 'server-script',
      'leaderstats': 'server-script',
      'input-action': 'local-player',
      'checkpoint-progression': 'server-script',
      'proximity-prompt-door': 'server-script',
      'speed-boost': 'server-script',
      'health-and-damage': 'server-script',
      'validated-shop': 'server-script'
    };
    elements.scriptTarget.value = templateTargets[templateName] || 'server-script';
    document.querySelectorAll('[data-template]').forEach((button) => {
      const active = button.dataset.template === templateName;
      button.classList.toggle('is-active', active);
      button.toggleAttribute('aria-current', active);
    });
    displayProjectName();
    loadSerializedWorkspace(templates[templateName]);
    setProjectState('Template loaded');
  }

  const SERVER_ONLY_BLOCKS = new Set([
    'bxplus_when_player_joins',
    'bxplus_create_leaderstat',
    'bxplus_load_data_safely',
    'bxplus_update_number_safely',
    'bxplus_when_remote_event_received',
    'bxplus_fire_all_clients'
  ]);
  const CLIENT_ONLY_BLOCKS = new Set([
    'bxplus_when_input_began',
    'gui_button_mouse1_click',
    'bxplus_when_button_clicked'
  ]);

  function validateScriptTarget() {
    if (!workspace || !elements.validationMessage) return;
    const target = elements.scriptTarget.value;
    const blocks = workspace.getAllBlocks(false);
    const hasServerOnly = blocks.some((block) => SERVER_ONLY_BLOCKS.has(block.type));
    const hasClientOnly = blocks.some((block) => CLIENT_ONLY_BLOCKS.has(block.type));
    let message = '';
    if (target !== 'server-script' && hasServerOnly) {
      message = 'ServerScriptService is recommended for this workspace.';
    } else if (target === 'server-script' && hasClientOnly) {
      message = 'A client location is recommended for this workspace.';
    }
    elements.validationMessage.textContent = message;
    elements.validationMessage.classList.toggle('note', Boolean(message));
  }

  function bindControls() {
    elements.search.addEventListener('input', (event) => renderSearchResults(event.target.value));
    elements.scriptTarget.addEventListener('change', () => {
      const target = window.BloxCodePlus.scriptContexts.targets[elements.scriptTarget.value];
      setProjectState(target ? target.location : 'Target updated');
      validateScriptTarget();
      });
    elements.clearSearch.addEventListener('click', () => {
      elements.search.value = '';
      renderSearchResults('');
      elements.search.focus();
    });
    document.getElementById('new-project-button').addEventListener('click', resetWorkspace);
    document.getElementById('rename-project-button').addEventListener('click', openRenameDialog);
    elements.renameForm.addEventListener('submit', renameProject);
    elements.renameCancel.addEventListener('click', closeRenameDialog);
    elements.blocklyPromptForm.addEventListener('submit', submitBlocklyPrompt);
    elements.blocklyPromptCancel.addEventListener('click', () => closeBlocklyPrompt(null));
    elements.blocklyConfirmCancel.addEventListener('click', () => closeBlocklyConfirm(false));
    elements.blocklyConfirmSubmit.addEventListener('click', () => closeBlocklyConfirm(true));
    document.getElementById('reset-workspace-button').addEventListener('click', resetWorkspace);
    document.getElementById('save-project-button').addEventListener('click', saveProjectFile);
    document.getElementById('open-project-button').addEventListener('click', openProjectFile);
    document.getElementById('export-lua-button').addEventListener('click', exportLuaFile);
    document.getElementById('copy-code-button').addEventListener('click', copyLua);
    document.querySelectorAll('[data-template]').forEach((button) => {
      button.addEventListener('click', () => loadTemplate(button.dataset.template));
    });
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !elements.renameDialog.hidden) {
        event.preventDefault();
        closeRenameDialog();
        return;
      }
      if (event.key === 'Escape' && !elements.blocklyPromptDialog.hidden) {
        event.preventDefault();
        closeBlocklyPrompt(null);
        return;
      }
      if (event.key === 'Escape' && !elements.blocklyConfirmDialog.hidden) {
        event.preventDefault();
        closeBlocklyConfirm(false);
        return;
      }
      if (!(event.ctrlKey || event.metaKey)) return;
      if (event.key.toLowerCase() === 's') {
        event.preventDefault();
        saveProjectFile();
      }
      if (event.key.toLowerCase() === 'n') {
        event.preventDefault();
        resetWorkspace();
      }
      if (event.key.toLowerCase() === 'e' && event.shiftKey) {
        event.preventDefault();
        exportLuaFile();
      }
      if (event.key.toLowerCase() === 'r' && event.shiftKey) {
        event.preventDefault();
        openRenameDialog();
      }
    });
    window.addEventListener('resize', () => Blockly.svgResize(workspace));
  }

  Blockly.dialog.setPrompt(openBlocklyPrompt);
  Blockly.dialog.setConfirm(openBlocklyConfirm);
  Blockly.dialog.setAlert(openBlocklyAlert);

  workspace = Blockly.inject('blocklyDiv', {
    media: './media/',
    toolbox: bloxcodePlusToolbox,
    theme,
    grid: { spacing: 20, length: 3, colour: '#343438', snap: true },
    zoom: { controls: true, wheel: true, startScale: 0.9, maxScale: 2, minScale: 0.5, scaleSpeed: 1.15 },
    trashcan: true
  });

  bindTrashcanClick();

  workspace.addChangeListener((event) => {
    if (event.type === Blockly.Events.UI) {
      return;
    }
    updateWorkspace();
    applyBlockTextContrast();
    validateScriptTarget();
  });

  buildBlockIndex();
  bindControls();
  displayProjectName();
  generateLua();
  Blockly.svgResize(workspace);
  validateScriptTarget();
}());
