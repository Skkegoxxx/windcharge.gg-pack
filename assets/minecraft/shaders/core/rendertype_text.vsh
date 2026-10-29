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

void main() {
    vec3 pos = Position;
    // Only on screen (no perspective) and only as far down as the tab reaches.
    if (ProjMat[3][3] == 1.0 && pos.y < 240.0) {
        pos.y += headDrop(Color);
    }
    gl_Position = ProjMat * ModelViewMat * vec4(pos, 1.0);

    sphericalVertexDistance = fog_spherical_distance(pos);
    cylindricalVertexDistance = fog_cylindrical_distance(pos);
    vertexColor = Color * texelFetch(Sampler2, UV2 / 16, 0);
    texCoord0 = UV0;
}
