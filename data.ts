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
0       0     0     1 0 0 
0.1    -1     0     0 1 0 
-0.1    -1     0     0 0 1 

0       0       0     1 0 0 
1     0.1       0     0 1 0 
-1     0.1     0     0 0 1 

0     0       0     1 0 0 
0.2   0.2       0     0 1 0 
0.2   -0.2    0     0 0 1 

0     0       0     1 1 0 
-0.4   0.2       0     1 0 0 
-0.4   -0.2    0     1 0 1 
`
    .replace(/\r|\n/g, " ")
    .split(/ +/)
    .filter((x) => x)
    .map((x) => parseFloat(x))
);

export const cubeVertexes = new Float32Array(
  `
0 0 0 
1 0 1
1 1 0
0 1 0
0 1 3
1 1 3
1 0 3
0 0 3 
    `
    .replace(/\r|\n/g, " ")
    .split(/ +/)
    .filter((x) => x)
    .map((x) => parseFloat(x))
    .map((x) => x / 3)
);
export const cubeIndexes = new Uint16Array(
  `
0 1 2 3 0 7 4 3 2 5 6 1 6 7 5 6 4
`
    .replace(/\r|\n/g, " ")
    .split(/ +/)
    .filter((x) => x)
    .map((x) => parseInt(x))
);
