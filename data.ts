export const oldVerttexes = new Float32Array([
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

export const vertexes = new Float32Array([
  0,
  0.5,
  0,
  -0.5,
  -0.5,
  0,
  0.5,
  -0.5,
  0,

  0,
  1,
  0,
  0.5,
  1,
  0,
  0.5,
  0.5,
  0,
]);

export const transformMatrix = new Float32Array([
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
]);

export const vertexShaderSource = `
#version 100

precision mediump float;

uniform   mat4 u_Transform;
// uniform   vec4 u_Color;

attribute vec4 a_Vertex;

void main() {
  // Transform the location of the vertex
  gl_Position = u_Transform * a_Vertex;
}
`;

export const fragmenShaderSource = `
#version 100

precision mediump float;

// uniform vec4 u_Color;

void main() {
  gl_FragColor = vec4(1.0, 0.5, 0, 1);
}



`;
