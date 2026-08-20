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

## Tab-list positioning (negative space)

`minecraft:default` carries a `space` provider whose glyphs advance the cursor without drawing
anything: `U+F800+i` by `-2^i` and `U+F80A+i` by `+2^i`, for `i` in 0..9. Any offset in
±1023px is a sum of those, which is how the in-match tab pins columns to exact pixels — the
font is proportional, so padding with spaces never lines a column up.

The plugin side is `gg.windcharge.shared.utils.Font`; it assumes exactly this ladder. If you
edit the table, re-run:

```
node tools/check-space-font.mjs
```

Ping bars are blanked (`assets/minecraft/textures/gui/sprites/icon/ping_*.png` are transparent)
so the tab can print a numeric ping in that column instead. Delete that folder to get the
vanilla bars back everywhere, lobby included.
