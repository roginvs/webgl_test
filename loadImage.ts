export async function loadImage(
  imgSrc = "https://spacerangers.gitlab.io/favicon.png"
) {
  // Block magic to bypass CORS issues

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
  const imageData = context.getImageData(0, 0, image.width, image.height);

  URL.revokeObjectURL(url);
  return imageData;
}
