import { fragmenShaderSource, vertexShaderSource, vertexes } from "./data";

console.info("lol");

const canvas = document.getElementById("main_canvas") as HTMLCanvasElement;

const gl = canvas.getContext("webgl");

(window as any).gl = gl;

console.info(gl);

if (!gl) {
  throw new Error("No gl");
}
function checkErr() {
  const err = gl?.getError();
  if (err !== 0) {
    throw new Error(`WebGL error=${err}`);
  }
}

const buffer_id = gl.createBuffer();
if (!buffer_id) {
  throw new Error("No buffer id");
}

gl.bindBuffer(gl.ARRAY_BUFFER, buffer_id);
checkErr();

gl.bufferData(gl.ARRAY_BUFFER, vertexes, gl.STATIC_DRAW);
checkErr();

// console.info(`Size`, gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_USAGE));

/*
// Example of how to read data from buffer in webgl2
const myBuf = new Float32Array(10);
gl.getBufferSubData(gl.ARRAY_BUFFER, 0, myBuf);
checkErr();
console.info(myBuf);
*/

const shader1 = gl.createShader(gl.VERTEX_SHADER);
const shader2 = gl.createShader(gl.FRAGMENT_SHADER);
if (!shader1 || !shader2) {
  throw new Error("No shaders");
}

gl.shaderSource(shader1, vertexShaderSource);
checkErr();

gl.shaderSource(shader2, fragmenShaderSource);
checkErr();

gl.compileShader(shader1);
checkErr();

gl.compileShader(shader2);
checkErr();

if (!gl.getShaderParameter(shader1, gl.COMPILE_STATUS)) {
  var info = gl.getShaderInfoLog(shader1);
  throw new Error("Could not compile WebGL program. \n\n" + info);
}
if (!gl.getShaderParameter(shader2, gl.COMPILE_STATUS)) {
  var info = gl.getShaderInfoLog(shader2);
  throw new Error("Could not compile WebGL program. \n\n" + info);
}

const program = gl.createProgram();
if (!program) {
  throw new Error("No gl program");
}

gl.attachShader(program, shader1);
gl.attachShader(program, shader2);

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  // There were errors, so get the errors and display them.
  var error = gl.getProgramInfoLog(program);
  throw new Error("Fatal error: Failed to link program: " + error);
}

// Explicit bind (TODO: Should it be before linkage?)
// const a_Vertex_location = 0;
// gl.bindAttribLocation(program, 0, "a_Vertex");

const a_Vertex_location = gl.getAttribLocation(program, "a_Vertex");

gl.useProgram(program);

gl.clearColor(0, 0, 0, 1);

// rendering

gl.clear(gl.COLOR_BUFFER_BIT);

gl.vertexAttribPointer(
  a_Vertex_location,
  3 /* Values per vertex */,
  gl.FLOAT,
  false,
  0,
  0
);

gl.enableVertexAttribArray(a_Vertex_location);

gl.drawArrays(gl.TRIANGLES, 0, 3);

/*

const u_Color_location = gl.getUniformLocation(program, "u_Color");
const u_Transform_location = gl.getUniformLocation(program, "u_Transform");


const transform = new Float32Array(16);
transform.fill(0);
transform[0] = 1;
transform[5] = 1;
transform[10] = 1;
transform[15] = 1;

gl.uniformMatrix4fv(u_Transform_location, false, transform);

var pyramid_color = new Float32Array([0.5, 0.5, 0.0, 1.0]);
gl.uniform4fv(u_Color_location, pyramid_color);

//     // Bind the vertices Buffer Object to the 'a_Vertex' shader variable
// TODO
gl.vertexAttribPointer(a_Vertex_location, 3, gl.FLOAT, false, 0, 0);
// TODO
gl.enableVertexAttribArray(a_Vertex_location);

// Draw all of the triangles
gl.drawArrays(gl.TRIANGLES, 0, 12);
*/
