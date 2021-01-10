async function loadImageToCanvasContext<T>(
  imgSrc: string,
  callback: (
    context: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => T
): Promise<T> {
  // Blob magic to bypass CORS issues

  const blob = await fetch(imgSrc).then((x) => x.blob());

  const url = URL.createObjectURL(blob);

  const image = new Image();
  image.src = url;
  await new Promise((r) => (image.onload = r));

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Failed to get canvas");
  }
  canvas.width = image.width;
  canvas.height = image.height;
  context.drawImage(image, 0, 0);

  const data = callback(context, image.width, image.height);

  URL.revokeObjectURL(url);
  return data;
}

/**
 * Loads image from src url
 */
export async function loadImage(
  imgSrc = "https://spacerangers.gitlab.io/favicon.png"
) {
  const imageData = await loadImageToCanvasContext(
    imgSrc,
    (context, width, height) => {
      return context.getImageData(0, 0, width, height);
    }
  );

  return imageData;
}

/**
 * Loads cubebox texture.
 * Output is 6 sub-images of source
 */

export async function loadCubebox(imgSrc = "cubebox.jpg") {
  const data = await loadImageToCanvasContext(
    imgSrc,
    (context, width, height) => {
      const size = width / 4;
      if (height / 3 !== size) {
        throw new Error("Wrong size");
      }

      return [
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1],
        [3, 1],
        [1, 2],
      ].map(([i, j]) => context.getImageData(i * size, j * size, size, size));
    }
  );

  return data;
}
