export const planeVertexes = new Float32Array(
  `  
10  -10  0   1 1   0 0 1
-10  10  0   0 0   0 0 1
-10  -10  0   0 1   0 0 1
`
    .replace(/\r|\n/g, " ")
    .split(/ +/)
    .filter((x) => x)
    .map((x) => parseFloat(x))
);
