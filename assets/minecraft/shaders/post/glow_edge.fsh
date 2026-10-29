#version 330

// Linea nitida pegada por fuera de la silueta, con el color del team a pleno.
// El sobel de vanilla multiplica el color por la cantidad de vecinos adentro
// (color * 0.2 * n), y en el borde n es chico: de ahi sale la linea oscura.

uniform sampler2D InSampler;

layout(std140) uniform SamplerInfo {
    vec2 OutSize;
    vec2 InSize;
};

in vec2 texCoord;

out vec4 fragColor;

// Grosor de la linea en pixeles de pantalla.
const int WIDTH = 1;

void main() {
    vec2 oneTexel = 1.0 / InSize;

    if (texture(InSampler, texCoord).a > 0.0) {
        fragColor = vec4(0.0);
        return;
    }

    float best = 1000.0;
    vec3 color = vec3(0.0);
    for (int dx = -WIDTH; dx <= WIDTH; dx++) {
        for (int dy = -WIDTH; dy <= WIDTH; dy++) {
            float d = float(dx * dx + dy * dy);
            if (d > float(WIDTH * WIDTH + 1) || d >= best) {
                continue;
            }
            vec4 s = texture(InSampler, texCoord + vec2(float(dx), float(dy)) * oneTexel);
            if (s.a > 0.0) {
                best = d;
                color = s.rgb;
            }
        }
    }

    fragColor = best < 1000.0 ? vec4(color, 1.0) : vec4(0.0);
}
