#version 100

precision mediump float;

varying vec3 v_light_color;
varying vec2 v_texture_coordinate;
// uniform vec4 u_Color;

void main() {
  gl_FragColor = vec4(v_light_color, 1);
}

