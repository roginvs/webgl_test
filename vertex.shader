#version 100

precision mediump float;

uniform   mat4 u_Transform;
// uniform   vec4 u_Color;

attribute vec3 a_Vertex_loc;
attribute vec3 a_Vertex_color;
attribute vec3 a_Vertex_normal;

varying vec3 v_Vertex_color;

void main() {
  // Transform the location of the vertex
  gl_Position = u_Transform * vec4(a_Vertex_loc, 1.0);

  vec4 newNormal = u_Transform * vec4(a_Vertex_normal, 1.0);

  float normal_vs_ligth = dot(a_Vertex_normal.xyz, vec3(1.0, 1.0, 1.0));
  
  v_Vertex_color = a_Vertex_color * normal_vs_ligth;
  v_Vertex_color = abs(a_Vertex_normal);
  //v_Vertex_color.rgb = a_Vertex_color.gbr;
}