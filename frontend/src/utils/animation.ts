export function getRandomPosition(
  radius: number,
  otherBlobPosition: { x: number; y: number } | null = null
) {
  // Calculate the bounds for 2/3 of the screen
  const boundWidth = (window.innerWidth * 2) / 3;
  const boundHeight = (window.innerHeight * 2) / 3;

  // Calculate the offset to center the bounds
  const offsetX = (window.innerWidth - boundWidth) / 2;
  const offsetY = (window.innerHeight - boundHeight) / 2;

  let newPosition;
  const minDistance = radius * 1.5; // Minimum distance between blobs centers

  do {
    newPosition = {
      x: offsetX + Math.random() * (boundWidth - 2 * radius),
      y: offsetY + Math.random() * (boundHeight - 2 * radius),
    };
  } while (
    otherBlobPosition &&
    Math.hypot(
      newPosition.x - otherBlobPosition.x,
      newPosition.y - otherBlobPosition.y
    ) < minDistance
  );

  return newPosition;
}
