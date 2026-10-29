# Push contact catch-delay code review

**Verdict: PASS.** The one-tick exclusion is scoped to a successful push against a ball carrier.

- The push action sets `match.pushContactActorId` only after it releases the carrier's ball into loose-ball mode. Off-ball knockdowns and unsuccessful pushes do not set the marker.
- `integrateBall` excludes that one player from the same-tick loose-ball catch candidate list. Teammates and opponents remain eligible, and normal catch checks run again on the next simulation tick.
- `stepMatch` clears the marker immediately after `integrateBall`, so it cannot suppress later catch opportunities or survive a normal tick. The carrier-push path necessarily reaches the loose-ball candidate check; `integrateBall` has no early return for loose mode.
- The change preserves release ownership and last-touch behavior. The added regression test confirms the ball remains loose, the holder is stunned, the pusher has not reacquired it, and the pusher's animation stays on the exact push contact tick.

No scope or stale-marker issue found. The marker is a single actor ID, which matches the intended case of briefly delaying only the player who jarred the ball loose.
