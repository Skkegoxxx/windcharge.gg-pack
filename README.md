# windcharge.gg-pack

Resource pack for windcharge.gg — 1.21.11+ (`pack_format` 75, `max_format` 1000).

## Sounds

Play with `/playsound windcharge:<name> master <player>` (namespace `windcharge`, defined in `assets/windcharge/sounds.json`):

`death`, `kill1`, `kill2`, `kill3`, `win`, `lose`, `buy`, `sell`, `click`

## Rank prefixes

Bitmap glyphs added to `minecraft:default`, so they render in normal chat/tab/scoreboard just by inserting the character — no `<font>` override needed.

| Rank | Codepoint |
|------|-----------|
| EXECUTIVE | U+E001 |
| ADMIN | U+E002 |
| CREATOR | U+E003 |
| HELPER | U+E004 |
| MEDIA | U+E005 |
| MOD | U+E006 |

In LuckPerms / MiniMessage use the escape, e.g. ` ` for the ADMIN tag.

Sizing lives in `assets/minecraft/font/default.json` (`height` = on-screen px, `ascent` = baseline offset). Tags are height 8 / ascent 7 to line up with chat text.

## Custom items

16×16 book items. Set an item's `minecraft:item_model` component to the id:

- `windcharge:sharpness_book` (red)
- `windcharge:density_book` (green)
- `windcharge:wind_burst_book` (blue)
- `windcharge:lunge_book` (purple)

Each has an item definition in `assets/windcharge/items/`, a `minecraft:item/generated` model in `assets/windcharge/models/item/`, and a texture in `assets/windcharge/textures/item/`.
