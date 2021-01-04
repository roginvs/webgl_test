import { assert } from "console";
import { readFileSync } from "fs";
import * as mat4 from "./mat4";
import { loadCubebox, loadImage } from "./loadImage";
import { cube } from "./obj";
import { planeVertexes } from "./data";

document.getElementById("build_date")!.innerHTML = `Built at ${new Date(
  parseInt(process.env.BUILD_TIME || "") * 1000
).toLocaleString()}`;

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

const createProgram = (vertexSource: string, fragmentSource: string) => {
  const shader1 = gl.createShader(gl.VERTEX_SHADER);
  const shader2 = gl.createShader(gl.FRAGMENT_SHADER);
  if (!shader1 || !shader2) {
    throw new Error("No shaders");
  }

  const vertexShaderSource = vertexSource;
  gl.shaderSource(shader1, vertexShaderSource);
  checkErr();

  const fragment = fragmentSource;
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
  console.info(
    `shaders=${gl.getProgramParameter(program, gl.ATTACHED_SHADERS)}`
  );
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
  for (
    let i = 0;
    i < gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    i++
  ) {
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

  return program;
};

const programModel = createProgram(
  readFileSync("./vertex.shader").toString(),
  readFileSync("./fragment.shader").toString()
);

// Explicit bind (TODO: Should it be before linkage?)
// const a_Vertex_location = 0;
// gl.bindAttribLocation(program, 0, "a_Vertex");

const a_Vertex_location = gl.getAttribLocation(programModel, "a_Vertex_loc");
const a_Vertex_normal = gl.getAttribLocation(programModel, "a_Vertex_normal");
const a_Vertex_texture = gl.getAttribLocation(programModel, "a_Vertex_texture");
const u_model_location = gl.getUniformLocation(programModel, "u_model");
const u_view_location = gl.getUniformLocation(programModel, "u_view");
const u_projection_location = gl.getUniformLocation(
  programModel,
  "u_projection"
);

const u_current_texture = gl.getUniformLocation(
  programModel,
  "u_current_texture"
);

gl.useProgram(programModel);

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
gl.bufferData(gl.ARRAY_BUFFER, cube.vertexes, gl.STATIC_DRAW);
(window as any).cube = cube;
const cubeVertexesIndexesBufId = gl.createBuffer();
if (!cubeVertexesIndexesBufId) {
  throw new Error("Failed to create cubeVertexesBuf");
}
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexesIndexesBufId);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cube.indexes, gl.STATIC_DRAW);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null); // Unbind to ensure proper usage

// == plane
const planeVertexesBufId = gl.createBuffer();
if (!planeVertexesBufId) {
  throw new Error("Failed to create buffer for vertexes");
}
gl.bindBuffer(gl.ARRAY_BUFFER, planeVertexesBufId);
gl.bufferData(gl.ARRAY_BUFFER, planeVertexes, gl.STATIC_DRAW);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null); // Unbind to ensure proper usage

// Probably no need this
//gl.depthRange(0, 1000);

// Uncomment this to skip clock-wide triangles
// gl.enable(gl.CULL_FACE);

gl.enable(gl.DEPTH_TEST);

//
// texture

// Uncomment this if needed
// gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)
const modelTexture = gl.createTexture();
if (!modelTexture) {
  throw new Error("Failed to create texture");
}

const planeTexture = gl.createTexture();
if (!planeTexture) {
  throw new Error("Failed to create texture");
}

/*
const cubeboxTexture = gl.createTexture();
if (!cubeboxTexture) {
  throw new Error("Failed to create texture");
}
*/

loadImage("texture.png").then((imgData) => {
  gl.activeTexture(gl.TEXTURE10);
  gl.bindTexture(gl.TEXTURE_2D, modelTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    // mip level
    0,
    gl.RGBA,
    imgData.width,
    imgData.height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    imgData.data
  );

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  console.info("Model texture loaded");

  render();
});

loadImage("plane.png").then((imgData) => {
  gl.activeTexture(gl.TEXTURE11);
  gl.bindTexture(gl.TEXTURE_2D, planeTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    // mip level
    0,
    gl.RGBA,
    imgData.width,
    imgData.height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    imgData.data
  );

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  console.info("Plane texture loaded");

  render();
});

/*
loadCubebox("cubebox.jpg").then((imagesData) => {
  gl.activeTexture(gl.TEXTURE20);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeboxTexture);

  const kinds = [
    gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
    gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
    gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
    gl.TEXTURE_CUBE_MAP_POSITIVE_X,
    gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
    gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
  ];

  for (const imageData of imagesData.map((data, idx) => ({
    ...data,
    kind: kinds[idx],
  }))) {
    gl.texImage2D(
      imageData.kind,
      // mip level
      0,
      gl.RGBA,
      imageData.width,
      imageData.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      imageData.data
    );
  }

  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // TODO: What are those wrapping and do we need them?
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  console.info("Cubebox texture loaded");

  render();
});
*/

//
//
//
/// ============  rendering ================

const cubeTransformMatrix = mat4.create();
mat4.scale(cubeTransformMatrix, cubeTransformMatrix, [1, 1, 1]);
//mat4.translate(cubeTransformMatrix, cubeTransformMatrix, [0, 0, -2]);

const cameraViewMatrix = mat4.create();
mat4.translate(cameraViewMatrix, cameraViewMatrix, [0, 0, -6]);
mat4.rotate(cameraViewMatrix, cameraViewMatrix, Math.PI / 5, [1, 1, 0]);

const projectionMatrix = mat4.create();
mat4.perspective(projectionMatrix, 45, 1, 0.1, 100);

const render = () => {
  console.info("Render");

  const setVertexAttribPointers = () => {
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

    // Texture coords
    gl.vertexAttribPointer(
      a_Vertex_texture,
      2 /* Values per vertex */,
      gl.FLOAT,
      false,
      8 * FLOAT_SIZE /* Stride side is full size in bytes */,
      3 * FLOAT_SIZE /* offset */
    );
    gl.enableVertexAttribArray(a_Vertex_texture);
  };

  gl.uniformMatrix4fv(u_model_location, false, cubeTransformMatrix);
  gl.uniformMatrix4fv(u_view_location, false, cameraViewMatrix);
  gl.uniformMatrix4fv(u_projection_location, false, projectionMatrix);

  // cube
  gl.uniform1i(u_current_texture, 10);

  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexesBufId);

  setVertexAttribPointers();

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexesIndexesBufId);

  gl.drawElements(gl.TRIANGLES, cube.indexes.length, cube.indexType, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  // plane
  gl.uniform1i(u_current_texture, 11);
  gl.bindBuffer(gl.ARRAY_BUFFER, planeVertexesBufId);
  setVertexAttribPointers();
  gl.drawArrays(gl.TRIANGLES, 0, planeVertexes.length / 8);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

// render();

const tmpMatrix = mat4.create();
canvas.addEventListener(
  "mousemove",
  (e) => {
    if (!e.buttons) {
      return;
    }

    const dx = e.movementX;
    const dy = e.movementY;

    mat4.identity(tmpMatrix);
    if (dx !== 0) {
      mat4.rotate(tmpMatrix, tmpMatrix, dx / 150, [0, 1, 0]);
    }
    if (dy !== 0) {
      mat4.rotate(tmpMatrix, tmpMatrix, dy / 150, [1, 0, 0]);
    }

    if (e.shiftKey) {
      // Rotate object
      mat4.multiply(cubeTransformMatrix, tmpMatrix, cubeTransformMatrix);
    } else {
      // Rotate camera
      mat4.multiply(cameraViewMatrix, cameraViewMatrix, tmpMatrix);
    }
    render();
  },
  { passive: true }
);

canvas.addEventListener(
  "mousewheel",
  (event) => {
    const delta = (event as any).deltaY;

    mat4.identity(tmpMatrix);
    mat4.translate(tmpMatrix, tmpMatrix, [0, 0, delta / 150]);
    mat4.multiply(cameraViewMatrix, tmpMatrix, cameraViewMatrix);

    render();
  },
  { passive: false }
);
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
