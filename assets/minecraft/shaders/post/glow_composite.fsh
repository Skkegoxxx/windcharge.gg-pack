#version 330

// Junta la linea y el relleno: por fuera de la silueta la linea del color del
// team a pleno, y adentro ese mismo color transparente. Sale del pack de DIDDY,
// sin el borde ancho de la Item Box ni el halo, que alla estaba apagado.

uniform sampler2D LineSampler;
uniform sampler2D MaskSampler;

in vec2 texCoord;

out vec4 fragColor;

// Opacidad del relleno de adentro.
const float FILL_ALPHA = 0.3;

// Las 4 facs con colores que vanilla no tiene brillan con el color de vanilla
// que tienen prestado (FacIcon en el plugin); aca se cambia por el suyo, como
// en rendertype_text.vsh con el nick.
vec3 facColor(vec3 color) {
    ivec3 c = ivec3(round(color * 255.0));
    if (c == ivec3(170, 0, 0)) {
        return vec3(212.0, 0.0, 143.0) / 255.0;
    }
    if (c == ivec3(0, 0, 170)) {
        return vec3(106.0, 43.0, 200.0) / 255.0;
    }
    if (c == ivec3(85, 85, 85)) {
        return vec3(143.0, 154.0, 42.0) / 255.0;
    }
    if (c == ivec3(0, 0, 0)) {
        return vec3(158.0, 245.0, 200.0) / 255.0;
    }
    return color;
}

void main() {
    vec4 line = texture(LineSampler, texCoord);
    if (line.a > 0.5) {
        fragColor = vec4(facColor(line.rgb), 1.0);
        return;
    }

    vec4 body = texture(MaskSampler, texCoord);
    fragColor = body.a > 0.0 ? vec4(facColor(body.rgb), FILL_ALPHA) : vec4(0.0);
}
