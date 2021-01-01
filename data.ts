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

export const vertexes = new Float32Array(
  `
0       0.5     0  
-0.5   -0.5     0  
0.5    -0.5     0 

0       1       0 
0.5     1       0 
0.5     0.5     0 
`
    .split(/ +/)
    .filter((x) => x)
    .map((x) => parseFloat(x))
);

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
