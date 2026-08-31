(function registerBloxCodePlusScriptContexts() {
  'use strict';

  const BloxCodePlus = window.BloxCodePlus = window.BloxCodePlus || {};
  const targets = Object.freeze({
    'server-script': Object.freeze({
      side: 'server',
      scriptClass: 'Script',
      location: 'ServerScriptService',
      label: 'Server Script'
    }),
    'local-player': Object.freeze({
      side: 'client',
      scriptClass: 'LocalScript',
      location: 'StarterPlayerScripts',
      label: 'Player LocalScript'
    }),
    'local-gui': Object.freeze({
      side: 'client',
      scriptClass: 'LocalScript',
      location: 'StarterGui',
      label: 'GUI LocalScript'
    }),
    'local-character': Object.freeze({
      side: 'client',
      scriptClass: 'LocalScript',
      location: 'StarterCharacterScripts',
      label: 'Character LocalScript'
    }),
    'shared-module': Object.freeze({
      side: 'shared',
      scriptClass: 'ModuleScript',
      location: 'ReplicatedStorage',
      label: 'ModuleScript'
    })
  });

  const groups = Object.freeze({
    clientInput: Object.freeze([
      'bxplus_input_service',
      'bxplus_when_input_began',
      'bxplus_fire_remote_event',
      'bxplus_invoke_server'
    ]),
    clientGui: Object.freeze([
      'bxplus_create_gui',
      'bxplus_set_gui_layout',
      'bxplus_when_button_clicked'
    ]),
    server: Object.freeze([
      'bxplus_when_player_joins',
      'bxplus_create_leaderstat',
      'bxplus_when_remote_event_received',
      'bxplus_fire_all_clients',
      'bxplus_load_data_safely',
      'bxplus_update_number_safely'
    ]),
    running: Object.freeze([
      'bxplus_when_player_joins',
      'bxplus_when_part_touched',
      'bxplus_when_remote_event_received',
      'bxplus_when_input_began',
      'bxplus_when_button_clicked'
    ]),
    inboundRemote: Object.freeze(['bxplus_when_remote_event_received']),
    outboundRemote: Object.freeze([
      'bxplus_fire_remote_event',
      'bxplus_fire_all_clients',
      'bxplus_invoke_server'
    ]),
    dataStore: Object.freeze([
      'bxplus_load_data_safely',
      'bxplus_update_number_safely'
    ])
  });

  function containsAny(activeTypes, group) {
    return group.some((type) => activeTypes.has(type));
  }

  function collectTypes(workspace) {
    return new Set(
      workspace.getAllBlocks(false)
        .filter((block) => block.isEnabled())
        .map((block) => block.type)
    );
  }

  function inspect(workspace, targetId) {
    const activeTypes = collectTypes(workspace);
    const target = targets[targetId] || targets['server-script'];
    const hasInput = containsAny(activeTypes, groups.clientInput);
    const hasGui = containsAny(activeTypes, groups.clientGui);
    const hasClient = hasInput || hasGui;
    const hasServer = containsAny(activeTypes, groups.server);
    const hasRunning = containsAny(activeTypes, groups.running);
    const notes = [];

    if (hasClient && hasServer) {
      notes.push('This workspace mixes client and server responsibilities; split them into explicit LocalScript and Script entry points.');
    } else if (hasInput && target.side !== 'client') {
      notes.push('StarterPlayerScripts is recommended for the input and client-remote blocks in this workspace.');
    } else if (hasGui && target.side !== 'client') {
      notes.push('StarterGui is recommended for the GUI blocks in this workspace.');
    } else if (hasGui && targetId === 'local-player') {
      notes.push('StarterGui is usually clearer for GUI blocks than StarterPlayerScripts.');
    } else if (hasServer && target.side !== 'server') {
      notes.push('ServerScriptService is recommended for the server-side blocks in this workspace.');
    }

    if (target.side === 'shared' && hasRunning) {
      notes.push('This workspace contains running event blocks; keep reusable functions in the ModuleScript and connect events from an entry script.');
    }
    if (containsAny(activeTypes, groups.inboundRemote)) {
      notes.push('Validate RemoteEvent values, permissions and request rate on the server before using them.');
    }
    if (containsAny(activeTypes, groups.outboundRemote)) {
      notes.push('Remote calls need a server handler that validates client input before changing shared state.');
    }
    if (containsAny(activeTypes, groups.dataStore)) {
      notes.push('DataStore patterns still need server-side input validation and Studio testing with the intended experience settings.');
    }

    return notes;
  }

  BloxCodePlus.scriptContexts = Object.freeze({ targets, inspect });
}());
