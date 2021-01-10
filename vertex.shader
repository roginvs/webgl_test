#version 100

precision mediump float;

uniform   mat4 u_model;
uniform   mat3 u_model_normal;
uniform   mat4 u_view;
uniform   mat4 u_projection;
// uniform   vec4 u_Color;

attribute vec3 a_Vertex_loc;

attribute vec3 a_Vertex_normal;
attribute vec2 a_Vertex_texture;

varying vec3 v_position;
varying vec3 v_normal;
varying vec2 v_texture_coordinate;

void main() {
  vec4 world_pos = u_model * vec4(a_Vertex_loc, 1.0);;
  
  // Transform the location of the vertex
  gl_Position = u_projection * u_view * world_pos;

  // TODO: Use separate matrix for normals which contains only rotations
  // Which is possible to get from model matrix with some math
  // Provide this 3x3 matrix as uniform
  vec3 world_normal = normalize( u_model_normal * a_Vertex_normal);
  v_normal = world_normal;

  v_position = world_pos.xyz;

  v_texture_coordinate = a_Vertex_texture;

  
}