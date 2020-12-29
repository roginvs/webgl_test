import { vertices } from "./data";

console.info("lol");

const canvas = document.getElementById("main_canvas") as HTMLCanvasElement;

const gl = canvas.getContext("webgl2");

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

gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
checkErr();

console.info(`Size`, gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_USAGE));

console.info("vertexes", vertices);

const myBuf = new Float32Array(10);
gl.getBufferSubData(gl.ARRAY_BUFFER, 0, myBuf);
checkErr();
console.info(myBuf);
