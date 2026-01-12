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

## ZRANGE vs ZREVRANGE

- ZRANGE returns elements in ascending order (lowest to highest score)
- ZRANGE is O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned
- When the sorted set has low cardinality, performance isnt a problem
- MUST KEEP YOUR RANGES SMALL!!!
- ZREVRANGE returns elements in descending order (highest to lowest score)

## ZREM (Trimming sorted sets)

- ZREM removes one or more members from a sorted set
- As example, ZREMRANGEBYRANK removes all members in a given rank range
