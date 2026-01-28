// ? Fixed window vs Sliding window

// - Fixed window: Counts requests in fixed time intervals (e.g., per minute).
// * Pros: Simple to implement.
// $ Cons: Can lead to bursts of traffic at the edges of the window.
// Schema
// limiter: [name]:[minute-block]:[maxHits] -> count (eg: limiter:123:0:5)

// - Sliding window: Counts requests in a rolling time frame (e.g., last 60 seconds).
// * Pros: More accurate representation of request rate.
// $ Cons: More complex to implement.
// Schema
// limiter: [name]:[timestamp]:[maxHits] -> count
