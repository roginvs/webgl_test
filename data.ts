export const planeVertexes = new Float32Array(
  `  
100   0 -100  1 1   0 1 0
-100  0  100   0 0   0 1 0
-100  0  -100   0 1   0 1 0

100  0  100    1 0   0 1 0
100  0  -100   1 1   0 1 0
-100  0  100   0 0   0 1 0
`
    .replace(/\r|\n/g, " ")
    .split(/ +/)
    .filter((x) => x)
    .map((x) => parseFloat(x))
);
