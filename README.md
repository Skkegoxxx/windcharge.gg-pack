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

Other items:

- `windcharge:shuriken` (throwing star)
- `windcharge:bastion` (wooden shield)
- `windcharge:tailwind` (wind orb)

Each has an item definition in `assets/windcharge/items/`, a `minecraft:item/generated` model in `assets/windcharge/models/item/`, and a texture in `assets/windcharge/textures/item/`.

To throw the shuriken as a projectile, have the server/plugin spawn a projectile (e.g. a snowball) whose item carries `minecraft:item_model` = `windcharge:shuriken` — it renders this flat sprite spinning in flight. The pack only supplies the look; a resource pack can't create new projectile entities on its own.

## Tab scoreboard

The match scoreboard the plugin draws in the tab header (`TabBoard`). Fonts `windcharge:board/-1` to `windcharge:board/8` all hold the same glyphs, each one dropped that many pixels below the top of a 9px tab line, so anything can sit anywhere on the panel. Textures in `assets/windcharge/textures/font/board/`.

- The kill feed pixel font on the plain characters, plus `_` and a 3px space
- `U+E100`–`U+E10A` small digits and `$`, `U+E110`–`U+E112` sword, skull and heart
- `U+E120`/`U+E130` the big score digits and their shadow, `U+E140`/`U+E141` the two top halves
- `U+E150`–`U+E159` the panel for one to five a side, in two halves
- `U+E160` row fill, `U+E161`/`U+E162` your row's frame, `U+E170`–`U+E175` place medals (alive, dead)
- `U+E180`–`U+E184` ping bars, `U+E190` the money bill
- `U+F000`–`U+F008` and `U+F010`–`U+F018` spaces of ±1 to ±256

Player heads can't take a font, so `shaders/core/rendertype_text.vsh` moves them down instead: a head tinted with one of the board's marker colours drops by the low bits of its blue.

## Round banner

What the middle of the screen says when a round ends: `ROUND 6`, then `WON` or `LOST`, then why and the score (`RoundBanner` in the plugin). It goes in the vanilla title, which draws at four times size, so the glyphs in `windcharge:banner/*` are at a quarter and every pixel lands on a screen pixel. One font per height: `label`, `word` and `line`, each with a `_shadow` one pixel lower.

- `U+E200`–`U+E223` kill feed pixel font, digits then A to Z
- `U+E300`–`U+E321` the game font's small caps, digits, `|` and `:`
- `U+E400`–`U+E405` `W O N L S T` at three times size, bold
- `U+F100`–`U+F109` and `U+F120`–`U+F129` spaces of ±1 to ±512 screen pixels

Every glyph advances the same 28px (a near invisible pixel in the corner of each cell), so the plugin places them one by one.
