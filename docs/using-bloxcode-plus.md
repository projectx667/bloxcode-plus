# Using BloxCode Plus

## Start a workspace

Choose **New** to start with an empty workspace, or select one of the four **Quick start** workspaces in the left-hand panel. They cover player messages, touched parts, leaderstats and keyboard input.

Use the block library and search field to add blocks. Drag a block onto the workspace and connect compatible shapes to build the flow. Standard Blockly categories provide control flow, variables, functions, text and values; Roblox categories group the game-specific blocks. The Luau output updates as the workspace changes.

A workspace can be built entirely from blocks: the Quick start workspaces and included examples are saved block projects. Use **Advanced** only for a small statement that does not yet have a block. Keep the surrounding flow in blocks where possible so the workspace remains readable and easy to adapt.

Use the mouse wheel or the zoom controls to change the workspace scale. Drag an unwanted block stack to the trash. Click the trash icon to inspect and restore recently deleted stacks.

## Choose the script location

Select the Roblox Studio location that records the intended script placement. The selection is saved with the `.blox` project and shown beside the generated Luau. Exporting writes a file; it does not insert a script into a place.

| Selection in BloxCode Plus | Intended Roblox Studio location | Typical responsibility |
|---|---|---|
| `ServerScriptService` | `ServerScriptService` | Server-owned gameplay, persistence and validation |
| `StarterPlayerScripts` | `StarterPlayer > StarterPlayerScripts` | Local player behaviour |
| `StarterGui` | `StarterGui` | Local interface behaviour |
| `StarterCharacterScripts` | `StarterPlayer > StarterCharacterScripts` | Local character behaviour |
| `ReplicatedStorage` | `ReplicatedStorage` | Shared module code |

## Save, open and export

**Save .blox** stores the workspace, project name and selected Studio location in a project file. Use **Open** to continue a saved project or open an example from the repository. The `version` field in a `.blox` file identifies the project format, not the application release.

Use **Copy** to place the generated Luau on the clipboard, or **Export .lua** to write it to a file. Create the appropriate Script, LocalScript or ModuleScript in Roblox Studio, paste the generated Luau, and place it at the selected location.

## Test in Roblox Studio

Before play-testing, check object names, hierarchy assumptions and service access after pasting the script. Test client requests, RemoteEvents and persistent data with server-side validation and appropriate error handling.

For required objects in the included workspaces, see [Example projects](./examples.md).
