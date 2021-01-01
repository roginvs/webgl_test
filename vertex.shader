#version 100

precision mediump float;

uniform   mat4 u_Transform;
// uniform   vec4 u_Color;

attribute vec3 a_Vertex_loc;
attribute vec3 a_Vertex_color;

varying vec3 v_Vertex_color;

void main() {
  // Transform the location of the vertex
  gl_Position = u_Transform * vec4(a_Vertex_loc, 1.0);

  v_Vertex_color = a_Vertex_color;
}