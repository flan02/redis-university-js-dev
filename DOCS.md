# LUA REFERENCE

[docs](https://www.lua.org/manual/)

[redis manual](https://redis.io/docs/latest/commands/eval/)

## Abide by these rules when writing Lua scripts for Redis

- One module per script
- Load the script once and cache its hash
- Provide a usable abstraction for invoking the script
