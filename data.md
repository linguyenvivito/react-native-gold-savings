# user
id, email, create_at
# account
accounts: id, user_id, asset_code, quantity_available

# asset
asset id, code (XAU_24K, XAU_9999), unit (gram, tael)

# price

id, asset_id, buy_price, sell_price, source

# order

orders: id, user_id, asset_id, side (BUY or SELL), quantity, price, created_at

# goal

savings_goals: id, user_id, asset_id, target_qty, target_date

# store

id, name, address, phone, culture, note

# assets in store

store_id, asset_id, buy_price, sell_price, async_price_api

# AI assistance

voice

# analysis

## quatity by asset

## market price currently = quatity by asset * price (sell)

## gold

## Gain and loss by curency = quatity * buy price - quatity & market price

## Gain and loss => Percentage of gain + loss

## inflation

## common stores