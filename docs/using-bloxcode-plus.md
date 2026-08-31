# Using BloxCode Plus

## Start a project

Click **New** to open an empty workspace, or choose a Template in the left sidebar. A Template opens with its blocks already connected so you can inspect it, change it and use it as a base for your own script.

The block library is on the left. Use the search field when you know the name of a block, then drag it into the workspace and connect it to the rest of the script. The Luau output on the right updates as you work.

The complete list of built-in Templates is in [Templates](./examples.md). It includes small examples for player events, parts, input, checkpoints, prompts, Humanoids and server-side shop validation.

Use the mouse wheel or the zoom controls to change the workspace scale. Drag a block stack to the trash to remove it. The trash icon lets you review and restore deleted blocks.

## Roblox block categories

The Roblox blocks are grouped by the object or service they work with. The connection shapes show which values can be plugged into an input.

| Category | Blocks available | Typical use |
|---|---|---|
| Instance | Get children, find child of class and get parent | Inspect a hierarchy or keep a reference to a Roblox object. |
| Part | Get or set Position, CFrame, Size, Color and common state; ClickDetector clicked; Raycast | Build world interactions, configure BaseParts and detect scene geometry. |
| Humanoid | Health, WalkSpeed, JumpPower, JumpHeight, MaxHealth, Died, HealthChanged and MoveTo | Control a character or non-player character, respond to health changes and move it to a Vector3 location. |
| Camera | Current camera, camera type and camera CFrame | Create local camera behaviour such as a cutscene; use these blocks from a LocalScript. |
| Services: Chat | Display a system message and react when a chat message is received | Implement local text-chat feedback. |
| Services: Leaderstats | Add a number to a named leaderstat | Update a player-owned score after validating the gameplay action on the server. |
| Services: Tweens | Tween a selected property of an Instance | Animate Transparency, Size, Position, CFrame or Volume over a duration. |

## Choose the script location

Select the Roblox Studio location where the script will be placed. BloxCode Plus saves this choice in the `.blox` project and displays it beside the generated Luau. Exporting creates a file; it does not insert a script into a Roblox place.

| Selection in BloxCode Plus | Intended Roblox Studio location | Typical responsibility |
|---|---|---|
| `ServerScriptService` | `ServerScriptService` | Server-owned gameplay, persistence and validation |
| `StarterPlayerScripts` | `StarterPlayer > StarterPlayerScripts` | Local player behaviour |
| `StarterGui` | `StarterGui` | Local interface behaviour |
| `StarterCharacterScripts` | `StarterPlayer > StarterCharacterScripts` | Local character behaviour |
| `ReplicatedStorage` | `ReplicatedStorage` | Shared module code |

## Save, open and export

**Save .blox** stores the workspace, project name and selected Studio location in a project file. Use **Open** to continue a saved project. The `version` field in a `.blox` file identifies the project format, not the application release.

Use **Copy** to place the generated Luau on the clipboard, or **Export .lua** to write it to a file. Create the appropriate Script, LocalScript or ModuleScript in Roblox Studio, paste the generated Luau, and place it at the selected location.

## Test in Roblox Studio

Before pressing Play, check the object names and hierarchy used by the script. Test server and client code in the correct context, especially when using RemoteEvents or saved data. Keep server-side validation in place for requests coming from the client.

## Keyboard shortcuts

`Ctrl+N` creates a new project, `Ctrl+S` saves the current `.blox` project, `Shift+Ctrl+E` exports the generated Luau, and `Shift+Ctrl+R` opens the project rename dialog. Deleted blocks remain available through the Blockly trashcan.
