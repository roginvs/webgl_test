#version 100

precision mediump float;

varying vec3 v_light_color;
varying vec2 v_texture_coordinate;

uniform sampler2D s_texture;

void main() {
  gl_FragColor = texture2D(s_texture, v_texture_coordinate) * vec4(v_light_color, 1);
}

