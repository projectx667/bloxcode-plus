# Example projects

The [`examples`](../examples) folder contains `.blox` workspaces. Each project stores its selected Studio location. All examples except the shop client target `ServerScriptService`.

## Hello, player

[`hello-player.blox`](../examples/hello-player.blox) demonstrates a player-join event with a generated player reference and requires no scene setup.

## Collectible Leaderstats

[`collectible-leaderstats.blox`](../examples/collectible-leaderstats.blox) creates a `Coins` leaderstat when a player joins, configures a collectible and increments the value on contact. It requires a `BasePart` named `Coin` under `Workspace`. The player lookup remains in an Advanced block because no dedicated block represents it yet.

## Checkpoint Progression

[`checkpoint-progression.blox`](../examples/checkpoint-progression.blox) creates a `Checkpoint` leaderstat, loads a saved value with the DataStore block and demonstrates a checkpoint loop. It requires a `Checkpoints` folder under `Workspace` containing parts named with checkpoint numbers. The loop and dynamic player lookup remain in Advanced Luau; the player event, leaderstat and DataStore load remain visible as blocks.

## Proximity Prompt Door

[`proximity-prompt-door.blox`](../examples/proximity-prompt-door.blox) creates a `ProximityPrompt` under a part named `Door`, configures its text and opens the door when the prompt is triggered. It requires a `BasePart` named `Door` under `Workspace`.

## Validated shop

The shop workflow uses two workspaces and requires a `RemoteEvent` named `ShopRequest` in `ReplicatedStorage`.

[`validated-shop-client.blox`](../examples/validated-shop-client.blox) targets `StarterGui`. It creates a small GUI, labels a button and sends the item identifier `StarterPack` when the button is clicked.

[`validated-shop-server.blox`](../examples/validated-shop-server.blox) receives that request, verifies the item identifier, checks the player’s `Coins` leaderstat and removes the cost. The final Advanced block marks the server-owned point at which item granting belongs.
