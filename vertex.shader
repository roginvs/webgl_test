#version 100

precision mediump float;

uniform   mat4 u_model;
uniform   mat4 u_view;
uniform   mat4 u_projection;
// uniform   vec4 u_Color;

attribute vec3 a_Vertex_loc;
attribute vec3 a_Vertex_color;
attribute vec3 a_Vertex_normal;

varying vec3 v_Vertex_color;

void main() {
  vec4 world_pos = u_model * vec4(a_Vertex_loc, 1.0);;
  
  // TODO: Use separate matrix for normals which contains only rotations
  vec3 world_normal = normalize( (u_model * vec4(a_Vertex_normal, 1.0)).xyz);

  // Transform the location of the vertex
  gl_Position = u_projection * u_view * world_pos;

 

  vec3 diffuse_light_location = vec3(-3.0, 3.0, 2.0);
  vec3 diffuse_light_vector = normalize(diffuse_light_location - world_pos.xyz);
  


  float normal_vs_ligth = max(0.0, dot(world_normal.xyz, diffuse_light_vector));

  v_Vertex_color = a_Vertex_color * normal_vs_ligth;
  //v_Vertex_color = ;
  //v_Vertex_color.rgb = a_Vertex_color.gbr;
}