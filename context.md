# Users and accounts

users: id, email, created_at

cash_accounts: id, user_id, currency, balance_available, balance_locked

gold_accounts: id, user_id, asset_code, quantity_available, quantity_locked

# Asset and pricing

assets: id, code (XAU_24K, XAU_9999), unit (gram, tael), precision

market_prices: id, asset_id, bid_price, ask_price, mid_price, source, as_of

Keep price history immutable for charting and audit

# Orders and execution

orders: id, user_id, asset_id, side (BUY or SELL), order_type (MARKET or LIMIT), quantity, limit_price, status, created_at

order_fills: id, order_id, fill_quantity, fill_price, fee_amount, filled_at

One order can have many fills

# Ledger (most important)

ledger_entries: id, user_id, account_type (CASH or GOLD), account_id, direction (DEBIT or CREDIT), amount, currency_or_asset, ref_type, ref_id, created_at

Every trade writes balanced entries so accounting is always correct

Never update old entries; only append

# Holdings and cost basis

holding_lots: id, user_id, asset_id, acquired_qty, remaining_qty, acquired_price, acquired_at, source_fill_id

On sell, consume lots (FIFO or average-cost)

realized_pnl table for reporting: user_id, sell_fill_id, cost_amount, proceeds_amount, pnl_amount

# Goals/savings

savings_goals: id, user_id, target_qty or target_value, target_date, auto_buy_rule

goal_events: progress snapshots and auto-buy runs

# Audit and idempotency

audit_logs: action, actor_id, payload, ip, user_agent, created_at

idempotency_keys: key, user_id, request_hash, response_ref, expires_at

Prevent duplicate buy/sell from retry taps

# Critical rules

## Use fixed precision decimals

Money: numeric(20, 4) or numeric(20, 6)

Quantity: numeric(20, 8)

Never use float for money or gold quantity

## Use a canonical unit

Store quantity internally in one base unit (for example gram)

Convert only at UI layer

## Enforce trade consistency in one DB transaction

Lock user account rows before balance updates

Validate funds/quantity before creating fills

Write order fill + ledger + lot updates atomically

Make records immutable
prices, fills, ledger entries should be append-only

# Supabase-specific implementation suggestions

## Keep RLS strict

Every table with user data has policy: user_id = auth.uid()

## Put buy and sell in database functions (RPC)

perform_buy(user_id, asset_id, quantity, price)
perform_sell(user_id, asset_id, quantity, price)

Functions run transactionally and are safer than multi-step client writes

## Let mobile call only RPC for trading

Avoid direct inserts to orders/fills/ledger from client

## Use Realtime subscriptions

Watch orders, balances, and latest price rows for live UI updates

# MVP rollout plan

## Phase 1
assets, market_prices, cash_accounts, gold_accounts, orders, order_fills, ledger_entries
market buy/sell only
no limit orders yet
## Phase 2
holding_lots + realized PnL
trade history and tax/report exports
## Phase 3
goals, recurring buys, notifications
limit orders and execution engine

# Feature suggestions for a strong gold savings app

## Portfolio dashboard

total value, daily PnL, allocation, average buy price

## Simple trade ticket

buy/sell quantity, estimated fee, slippage warning

## Savings automation

weekly or monthly auto-buy
round-up purchases

## Risk controls

max daily buy amount
cooldown after large sell

## Trust features

full transaction timeline
downloadable statement
transparent fee breakdown