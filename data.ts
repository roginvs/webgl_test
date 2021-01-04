export const planeVertexes = new Float32Array(
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
