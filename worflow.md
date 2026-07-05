# App launch
App starts and restores session from Supabase.
If no valid session: route to Login/Register.
If valid session: route to Dashboard.
# Authentication flow
Register: user signs up with email/password.
Optional email verification (depending on Supabase settings).
Login: user signs in and session is persisted.
Logout: session is revoked/cleared.
# Dashboard load flow
App fetches:
latest market prices
user cash balance
user gold balance
paged gold transaction/history data
Date filter is applied at DB query level.
User can load more rows via pagination.
# Buy flow (core transaction)
User enters quantity (or amount) and confirms buy.
Client calls RPC perform_buy(...) (single server-side transaction).
Server transaction does:
validate input and user/session
fetch current executable price
lock user cash + gold account rows
check sufficient cash
create order + fill
append ledger debit/credit entries (balanced)
create/update holding lot
update balances
write audit log
Client refreshes balances, holdings, and history.
# Sell flow (core transaction)
User enters quantity and confirms sell.
Client calls RPC perform_sell(...).
Server transaction does:
lock account rows
validate sufficient gold quantity
create order + fill
consume lots (FIFO or average cost)
compute realized PnL
append balanced ledger entries
update balances
write audit log
Client refreshes portfolio and history.
# Portfolio and reporting flow
Holdings view aggregates lots by asset.
Portfolio value = quantity × latest market price.
PnL:
unrealized from current holdings
realized from sell executions
Statement/trade history reads from immutable ledger + fills.
# Savings goal flow
User creates target (qty or value, deadline).
App periodically computes progress.
Optional auto-buy rules trigger RPC buy jobs.
Goal events are logged for timeline/progress.
# Realtime and sync flow
Subscribe to orders/balances/prices via Supabase Realtime.
On updates, UI patches state immediately.
If realtime disconnects, fallback to periodic refetch.
# Safety and reliability flow
Idempotency key per trade request to prevent duplicate taps.
Strict RLS: users can access only their rows.
Trading done only through RPC, not direct table writes.
Immutable records for prices/fills/ledger for auditability.
# Error handling flow
Network error: show retry with non-destructive state.
Validation error (insufficient funds/quantity): show actionable message.
Partial failure is avoided by transaction boundaries.
All trade-side mutations succeed or roll back together.