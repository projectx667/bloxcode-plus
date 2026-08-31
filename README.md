# BloxCode Plus

BloxCode Plus is a visual coding environment for Roblox Luau. Write Luau scripts by connecting blocks, then use the generated code in Roblox Studio.

![Proximity Prompt Door in BloxCode Plus](./assets/proximity-prompt-door.png)

## Initial Release

The first public build is available for Windows x64. Download [BloxCode-Plus-Windows-x64.zip](https://github.com/projectx667/bloxcode-plus/releases/tag/initial-release), extract it, and run `BloxCode Plus.exe`. A SHA-256 file is included for verification.

## What it includes

The editor combines standard Blockly categories with 24 Roblox-specific blocks for players, objects, interactions, GUI, input, RemoteEvents, tools, sound, animation and DataStore patterns. Projects are stored as `.blox` workspaces and retain their selected Studio location. Four Quick start workspaces and openable examples are included.

## Documentation

[Using BloxCode Plus](./docs/using-bloxcode-plus.md) explains the workspace, block library, locations and project files.

[Example projects](./docs/examples.md) describes the included workspaces and the Studio objects they require.

## Community

Use [Issues](https://github.com/projectx667/bloxcode-plus/issues) for reproducible bugs, compatibility reports and block requests. Use [Discussions](https://github.com/projectx667/bloxcode-plus/discussions) for workflows, examples and feedback.

## Project and source

BloxCode Plus began from [BloxCode](https://github.com/wolfgangmeyers/bloxcode) and is maintained as its own codebase. It does not aim to expose every Roblox API.

### Build from source

```shell
git clone https://github.com/projectx667/bloxcode-plus.git
cd bloxcode-plus/app
npm install
npm start
```

Run `npm run package` to create a desktop package. Original BloxCode Plus contributions use the proprietary [LICENSE](./LICENSE). BloxCode and third-party components retain their own terms in [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).
