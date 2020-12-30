export const vertices = new Float32Array([
  0.5,
  -0.25,
  0.25,
  0,
  0.25,
  0,
  -0.5,
  -0.25,
  0.25,
  -0.5,
  -0.25,
  0.25,
  0,
  0.25,
  0,
  0,
  -0.25,
  -0.5,
  0,
  -0.25,
  -0.5,
  0,
  0.25,
  0,
  0.5,
  -0.25,
  0.25,
  0,
  -0.25,
  -0.5,
  0.5,
  -0.25,
  0.25,
  -0.5,
  -0.25,
  0.25,
]);

export const vertexShaderSource = `
// What's this? TODO
precision mediump int;
precision mediump float;

uniform   mat4 u_Transform;
uniform   vec4 u_Color;

attribute vec3 a_Vertex;

void main() {
  // Transform the location of the vertex
  gl_Position = u_Transform * vec4(a_Vertex, 1.0);
}
`;

export const fragmenShaderSource = `

precision mediump int;
precision mediump float;

uniform vec4 u_Color;

void main() {
  gl_FragColor = u_Color;
}



`;
