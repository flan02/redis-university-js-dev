# LUA REFERENCE

[docs](https://www.lua.org/manual/)

[redis manual](https://redis.io/docs/latest/commands/eval/)

## Abide by these rules when writing Lua scripts for Redis

- One module per script
- Load the script once and cache its hash
- Provide a usable abstraction for invoking the script

## Pipelines (dont execute atomically) vs Transactions (execute atomically)

Use a pipeline when...

- You have two or more commands to execute
- Can wait for the responses of all commands at once

Use a transaction when...

- You require atomic execution of a set of commands
- You can afford to block other clients while these commands execute
