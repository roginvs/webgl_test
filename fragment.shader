#version 100

precision mediump float;

varying vec3 v_light_color;
varying vec2 v_texture_coordinate;

// Puts texture id into this variable
uniform sampler2D u_current_texture;

void main() {
  vec4 texture_color = texture2D(u_current_texture, v_texture_coordinate);
  gl_FragColor = texture_color * vec4(v_light_color, 1);
}

