import { assert } from "console";
import { readFileSync } from "fs";
import { vertexes } from "./data";
import * as mat4 from "./mat4";
import { cube } from "./obj";

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

const vertexes_buffer_id = gl.createBuffer();
if (!vertexes_buffer_id) {
  throw new Error("No buffer id");
}

gl.bindBuffer(gl.ARRAY_BUFFER, vertexes_buffer_id);
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

const vertexShaderSource = readFileSync("./vertex.shader").toString();
gl.shaderSource(shader1, vertexShaderSource);
checkErr();

const fragment = readFileSync("./fragment.shader").toString();
gl.shaderSource(shader2, fragment);
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

console.info(`Program InfoLog="${gl.getProgramInfoLog(program)}"`);
console.info(`shaders=${gl.getProgramParameter(program, gl.ATTACHED_SHADERS)}`);
console.info(
  `attributes=${gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)} `
);
for (
  let i = 0;
  i < gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  i++
) {
  const attributeInfo = gl.getActiveAttrib(program, 0);
  if (!attributeInfo) {
    console.warn(`  Atttribute id=${i} no info!`);
  } else {
    console.info(
      `  Atribute id=${i} name=${attributeInfo.name} size=${attributeInfo.size} type=${attributeInfo.type}`
    );
  }
}
console.info(
  `uniforms=${gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)} `
);
for (let i = 0; i < gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS); i++) {
  const uniformInfo = gl.getActiveUniform(program, 0);
  if (!uniformInfo) {
    console.warn(`  Uniform id=${i} no info!`);
  } else {
    console.info(
      `  Uniform id=${i} name=${uniformInfo.name} size=${uniformInfo.size} type=${uniformInfo.type}`
    );
  }
}

// Validation is optional and can be used for debugging
gl.validateProgram(program);
if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
  console.warn(`Program validate fails: ${gl.getProgramInfoLog(program)}`);
}

// Explicit bind (TODO: Should it be before linkage?)
// const a_Vertex_location = 0;
// gl.bindAttribLocation(program, 0, "a_Vertex");

const a_Vertex_location = gl.getAttribLocation(program, "a_Vertex_loc");
const a_Vertex_color = gl.getAttribLocation(program, "a_Vertex_color");
const a_Vertex_normal = gl.getAttribLocation(program, "a_Vertex_normal");
const u_Transform_location = gl.getUniformLocation(program, "u_Transform");

gl.useProgram(program);
checkErr();

gl.clearColor(0, 0, 0, 1);

const FLOAT_SIZE = 4;
//
//
// ==== providing cube
const cubeVertexesBufId = gl.createBuffer();
if (!cubeVertexesBufId) {
  throw new Error("Failed to create cubeVertexesBuf");
}
gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexesBufId);
gl.bufferData(gl.ARRAY_BUFFER, cube.triangles, gl.STATIC_DRAW);

const cubeVertexesIndexesBufId = gl.createBuffer();
if (!cubeVertexesIndexesBufId) {
  throw new Error("Failed to create cubeVertexesBuf");
}
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexesIndexesBufId);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cube.indexes, gl.STATIC_DRAW);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

// Probably no need this
//gl.depthRange(0, 1000);

// Uncomment this to skip clock-wide triangles
gl.enable(gl.CULL_FACE);

//
//
//
/// ============  rendering ================

const rotationMatrix = mat4.create();
mat4.fromRotation(rotationMatrix, Math.PI / 5, [2, 1, 0]);

const scaleMatrix = mat4.create();
mat4.scale(scaleMatrix, scaleMatrix, [0.2, 0.2, 0.2]);

const translateMatrix = mat4.create();
mat4.translate(translateMatrix, translateMatrix, [0, 0, -2]);

const projectionMatrix = mat4.create();
mat4.perspective(projectionMatrix, 45, 1, 0.1, 100);

const transformMatrix = mat4.create();

const render = (coef = 1) => {
  // No need to clear - it is done implicitly by webgl
  //gl.clear(gl.COLOR_BUFFER_BIT);

  //transformMatrix[0] = 1 * coef;
  //transformMatrix[5] = 1 / coef;
  mat4.multiply(transformMatrix, projectionMatrix, translateMatrix);
  mat4.multiply(transformMatrix, transformMatrix, rotationMatrix);
  mat4.multiply(transformMatrix, transformMatrix, scaleMatrix);
  gl.uniformMatrix4fv(u_Transform_location, false, transformMatrix);

  // WebGL always uses GPU memory, so last parameter is always an offset
  // Which means we must bind an array first
  // If OpenGL function is called and no array is bound, then it treats "offset"
  //   as actual pointer inside client memory. TODO: Why book example binds only for enableVertexAttribArray?
  // We can unbind an array after this function call - WebGL just remembers where pointer is
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexes_buffer_id);
  gl.vertexAttribPointer(
    a_Vertex_location,
    3 /* Values per vertex */,
    gl.FLOAT,
    false,
    6 * FLOAT_SIZE /* Stride side is full size in bytes */,
    0 /* offset */
  );
  gl.enableVertexAttribArray(a_Vertex_location);

  gl.vertexAttribPointer(
    a_Vertex_color,
    3 /* Values per vertex */,
    gl.FLOAT,
    false,
    6 * FLOAT_SIZE /* Stride side is full size in bytes */,
    3 * FLOAT_SIZE /* offset */
  );
  // gl.vertexAttrib4f(a_Vertex_color, 0.9, 0, 0.4, 1);
  // Attribute can be set via vertexAttribPointer or vertexAttrib4f
  // Enabling array will disable const value
  gl.enableVertexAttribArray(a_Vertex_color);

  gl.drawArrays(gl.TRIANGLES, 0, 9);

  gl.lineWidth(2);
  gl.drawArrays(gl.LINE_LOOP, 9, 3);

  // ================
  // cube
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexesBufId);

  // Location
  gl.vertexAttribPointer(
    a_Vertex_location,
    3 /* Values per vertex */,
    gl.FLOAT,
    false,
    8 * FLOAT_SIZE /* Stride side is full size in bytes */,
    0 /* offset */
  );
  gl.enableVertexAttribArray(a_Vertex_location);

  // Normal
  gl.vertexAttribPointer(
    a_Vertex_normal,
    3 /* Values per vertex */,
    gl.FLOAT,
    false,
    8 * FLOAT_SIZE /* Stride side is full size in bytes */,
    (3 + 2) * FLOAT_SIZE /* offset */
  );
  gl.enableVertexAttribArray(a_Vertex_normal);

  // Color is same
  gl.vertexAttrib4f(a_Vertex_color, 0.9, 0, 0.4, 1);
  gl.disableVertexAttribArray(a_Vertex_color);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexesIndexesBufId);
  gl.drawElements(gl.TRIANGLES, cube.indexes.length, cube.indexType, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

render(1);
setTimeout(() => {
  console.info("New render");
  render(1);
}, 1000);
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
