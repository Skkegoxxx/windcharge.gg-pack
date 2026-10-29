#version 330

// Can't moj_import in things used during startup, when resource packs don't exist.
// This is a copy of dynamicimports.glsl and projection.glsl
layout(std140) uniform DynamicTransforms {
    mat4 ModelViewMat;
    vec4 ColorModulator;
    vec3 ModelOffset;
    mat4 TextureMat;
};
layout(std140) uniform Projection {
    mat4 ProjMat;
};

in vec3 Position;
in vec4 Color;

out vec4 vertexColor;

// The tab scoreboard (TabBoard in the plugin) sits DOWN = 5 empty lines under the top, to clear the
// bar on top, and its panel carries its own glass. The tab's dark box behind the header (and the 1 px
// one under it, for the empty list) is dropped: its exact colour (black at half alpha) and the board's
// width, 264. Not its height: some clients push the whole tab under the boss bars.
const float BOARD_HALF = 132.0;

void main() {
    vec3 pos = Position;
    if (ProjMat[3][3] == 1.0 && Color.rgb == vec3(0.0) && abs(Color.a * 255.0 - 128.0) < 0.5) {
        float middle = floor(round(2.0 / ProjMat[0][0]) / 2.0);
        if (abs(abs(pos.x - middle) - BOARD_HALF) < 0.5) {
            gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
            vertexColor = vec4(0.0);
            return;
        }
    }
    gl_Position = ProjMat * ModelViewMat * vec4(pos, 1.0);

    vertexColor = Color;
}
