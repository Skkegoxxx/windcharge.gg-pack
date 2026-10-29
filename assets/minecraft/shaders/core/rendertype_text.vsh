#version 330

#moj_import <minecraft:fog.glsl>
#moj_import <minecraft:dynamictransforms.glsl>
#moj_import <minecraft:projection.glsl>

in vec3 Position;
in vec4 Color;
in vec2 UV0;
in ivec2 UV2;

uniform sampler2D Sampler2;

out float sphericalVertexDistance;
out float cylindricalVertexDistance;
out vec4 vertexColor;
out vec2 texCoord0;

// Heads on the tab scoreboard. A head in text can't take a font, so it can only sit on one of
// the header's 9px lines. The plugin tints it with one of three exact colours (alive, dead, and
// the shadow under both) whose blue low bits say how far down it goes.
float headDrop(vec4 color) {
    ivec3 c = ivec3(round(color.rgb * 255.0));
    ivec3 mark = ivec3(c.r, c.g, c.b >> 4);
    bool head = mark == ivec3(251, 245, 15) || mark == ivec3(107, 101, 6) || mark == ivec3(59, 53, 3);
    return head ? float(c.b & 15) : 0.0;
}

// Boss bar names: the first is the bar on top, the next one down is the kill feed.
const float BOSS_NAME_Y = 3.0;
const float BOSS_ROW = 19.0;

// Heads on the bar on top (HudBar in the plugin): the game draws them on the name's line, so they
// come marked in the low three bits of colour and shadow (red 5, green 2, blue 4) and drop 7 to
// sit on the middle of the logo.
const float HUD_HEAD_DROP = 7.0;

bool hudHead(vec4 color) {
    ivec3 c = ivec3(round(color.rgb * 255.0));
    return (c.r & 7) == 5 && (c.g & 7) == 2 && (c.b & 7) == 4;
}

// The kill feed (KillFeed in the plugin), Diddy's: a boss bar name that is moved to the right
// edge, half way down, where a scoreboard would go. The name is always FEED_WIDTH wide and its
// three lanes are drawn on top of each other; the lane is in the blue low bits.
const float FEED_WIDTH = 200.0;
const float FEED_RIGHT = 2.0;
const float FEED_ABOVE_MIDDLE = 22.0;
const float FEED_ROW = 14.0;
const float FEED_ASCENT = 3.0;

bool feedColor(vec4 color, out float lane) {
    ivec3 c = ivec3(round(color.rgb * 255.0));
    int mark = c.b & 7;
    lane = float(mark - 1);
    return (c.r & 7) == 6 && (c.g & 7) == 1 && mark >= 1 && mark <= 3;
}

void main() {
    vec3 pos = Position;
    float lane;
    // Only on screen (no perspective) and only as far down as the tab reaches.
    if (ProjMat[3][3] == 1.0 && pos.y < 240.0) {
        pos.y += headDrop(Color);
    }
    if (ProjMat[3][3] == 1.0 && pos.y < BOSS_ROW && hudHead(Color)) {
        pos.y += HUD_HEAD_DROP;
    }
    if (ProjMat[3][3] == 1.0 && pos.y < BOSS_ROW * 8.0 && feedColor(Color, lane)) {
        float screenWidth = round(2.0 / ProjMat[0][0]);
        float screenHeight = round(-2.0 / ProjMat[1][1]);
        float left = floor(screenWidth / 2.0) - FEED_WIDTH / 2.0;
        float row = floor((pos.y + 0.5) / BOSS_ROW);
        float top = BOSS_NAME_Y + row * BOSS_ROW;
        pos.x = screenWidth - FEED_RIGHT - FEED_WIDTH + (pos.x - left);
        pos.y = floor(screenHeight / 2.0) - FEED_ABOVE_MIDDLE + FEED_ASCENT + lane * FEED_ROW + (pos.y - top);
    }
    gl_Position = ProjMat * ModelViewMat * vec4(pos, 1.0);

    sphericalVertexDistance = fog_spherical_distance(pos);
    cylindricalVertexDistance = fog_cylindrical_distance(pos);
    vertexColor = Color * texelFetch(Sampler2, UV2 / 16, 0);
    texCoord0 = UV0;
}
