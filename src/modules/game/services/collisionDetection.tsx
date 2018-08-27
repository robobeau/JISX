
export function collisionDetection(position, collisionMap): boolean {
  return collisionMap[`${ position.x } ${ position.y }`];
}
