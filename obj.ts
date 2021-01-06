import { readFileSync } from "fs";
import { Vector, Vector2d } from "./mat4";

export function parseObjFile(objRaw: string) {
  const vertexes: Vector[] = [];
  const textureCoords: Vector2d[] = [];
  const vertexNormales: Vector[] = [];

  interface FaceVertex {
    vertex: Vector;
    texture: Vector2d | undefined;
    normal: Vector;
    index: number;
  }
  /**
   * key is string like 1/2/3 from "f" command
   */
  const faceVertexes = new Map<string, FaceVertex>();

  const packedVertexes: number[] = [];
  const indexes: number[] = [];

  for (const line of objRaw.split(/\n|\r/).filter((x) => x)) {
    if (line.startsWith("#")) {
      continue;
    }
    const [cmd, ...args] = line.split(/ +/);

    const [arg1] = args;
    if (cmd === "mtllib") {
      // No support yet
      continue;
    } else if (cmd === "o") {
      // Should we throw if two objects in file?
      continue;
    } else if (cmd === "v") {
      if (args.length !== 3) {
        throw new Error("Expect 3 args");
      }
      vertexes.push(args.map((arg) => parseFloat(arg)) as Vector);
    } else if (cmd === "vt") {
      if (args.length !== 2) {
        throw new Error("Expect 2 args");
      }
      textureCoords.push(args.map((arg) => parseFloat(arg)) as Vector2d);
    } else if (cmd === "vn") {
      if (args.length !== 3) {
        throw new Error("Expect 3 args");
      }
      vertexNormales.push(args.map((arg) => parseFloat(arg)) as Vector);
    } else if (cmd === "usemtl") {
      // No support yet
      continue;
    } else if (cmd === "s") {
      // smoothing, ignore
      continue;
    } else if (cmd === "f") {
      if (args.length !== 3) {
        throw new Error("Expect 3 args");
      }
      // args is [ '2/1/1', '3/2/1', '4/3/1' ]
      const parseFaceVertex = (faceVertex: string) => {
        const existing = faceVertexes.get(faceVertex);
        if (existing) {
          return {
            alreadyInTriagles: true,
            ...existing,
          };
        }

        const [vertexId, textureId, normalId] = faceVertex
          .split("/")
          .map((s) => parseInt(s) || 0)
          .map((i) => i - 1);

        const index = faceVertexes.size;

        const vertex = vertexes[vertexId];
        const texture = textureCoords[textureId];
        const normal = vertexNormales[normalId];

        const newFaceVertex: FaceVertex = {
          vertex,
          texture,
          normal,
          index,
        };
        faceVertexes.set(faceVertex, newFaceVertex);

        return {
          alreadyInTriagles: false,
          ...newFaceVertex,
        };
      };

      const v1 = parseFaceVertex(args[0]);
      const v2 = parseFaceVertex(args[1]);
      const v3 = parseFaceVertex(args[2]);

      const packVertex = (vertexData: FaceVertex) => {
        return [
          vertexData.vertex[0],
          vertexData.vertex[1],
          vertexData.vertex[2],
          vertexData.texture ? vertexData.texture[0] : 0,
          vertexData.texture ? vertexData.texture[1] : 0,
          vertexData.normal[0],
          vertexData.normal[1],
          vertexData.normal[2],
        ];
      };
      // console.info(`Face indexes = ${v1.index} ${v2.index} ${v3.index}`);
      for (const v of [v1, v2, v3]) {
        if (!v.alreadyInTriagles) {
          const packedData = packVertex(v);
          // console.info(`  pushing idx=${v.index}`);
          // console.info(`  data is ${packedData.join(" ")}`);
          packedVertexes.push(...packedData);
        }
      }
      indexes.push(v1.index);
      indexes.push(v2.index);
      indexes.push(v3.index);
    }
  }

  if (packedVertexes.length % 8 !== 0) {
    throw new Error("internal error");
  }

  for (const index of indexes) {
    if (index >= packedVertexes.length / 8) {
      throw new Error(`Internal error: index out of bounds`);
    }
  }

  const GL_UNSIGNED_SHORT = 0x1403;
  return {
    vertexes: new Float32Array(packedVertexes),
    indexes: new Uint16Array(indexes),
    indexType: GL_UNSIGNED_SHORT,
  };
}
