#version 100

precision mediump float;

uniform   mat4 u_model;
uniform   mat4 u_view;
uniform   mat4 u_projection;
// uniform   vec4 u_Color;

attribute vec3 a_Vertex_loc;

attribute vec3 a_Vertex_normal;
attribute vec2 a_Vertex_texture;

varying vec3 v_light_color;
varying vec2 v_texture_coordinate;

void main() {
  vec4 world_pos = u_model * vec4(a_Vertex_loc, 1.0);;
  
  // TODO: Use separate matrix for normals which contains only rotations
  // Which is possible to get from model matrix with some math
  // Provide this 3x3 matrix as uniform
  vec3 world_normal = normalize( (u_model * vec4(a_Vertex_normal, 1.0)).xyz);

  // Transform the location of the vertex
  gl_Position = u_projection * u_view * world_pos;

 

  vec3 diffuse_light_location = vec3(-3.0, 3.0, 2.0);
  vec3 diffuse_light_vector = normalize(diffuse_light_location - world_pos.xyz);
  
  float diffuse_coefficient = max(0.0, dot(world_normal.xyz, diffuse_light_vector));

  float ambient_coefficient = 0.2;

  v_light_color = vec3(1.0, 1.0, 1.0) * (diffuse_coefficient + ambient_coefficient);
  v_texture_coordinate = a_Vertex_texture;
  //v_Vertex_color = ;
  //v_Vertex_color.rgb = a_Vertex_color.gbr;
}