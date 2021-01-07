#version 100

precision mediump float;

varying vec2 v_texture_coordinate;

varying vec3 v_position;
varying vec3 v_normal;

// Puts texture id into this variable
uniform sampler2D u_current_texture;

void main() {
  vec4 texture_color = texture2D(u_current_texture, v_texture_coordinate);



  vec3 diffuse_light_location = vec3(0.0, 20.0, 33.0);
  //vec3 diffuse_light_location = vec3(0.0, 0.0, 0.0);
  vec3 diffuse_light_vector = normalize(diffuse_light_location - v_position.xyz);
  
  float diffuse_coefficient_direction = max(0.0, dot(normalize(v_normal.xyz), diffuse_light_vector));
  float diffuse_coefficient_distance = 1.0;
  float ambient_coefficient = 0.2;

  vec3 light_color = vec3(1.0, 1.0, 1.0) * (
    diffuse_coefficient_direction*diffuse_coefficient_distance +
    ambient_coefficient
  );



  gl_FragColor = texture_color * vec4(light_color, 1);

  
  // Example of screen coordinates (our canvas is 800x600 pixels)
  //if (gl_FragCoord.x > 400.0){
  //  gl_FragColor.x = 1.0;
  // }
}

