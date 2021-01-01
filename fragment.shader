#version 100

precision mediump float;

varying vec3 v_Vertex_color;

// uniform vec4 u_Color;

void main() {
  gl_FragColor = vec4(v_Vertex_color, 1);
}

