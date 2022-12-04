export type Point2D = { x: number; y: number };

export function findAdjacent<T>({ x, y }: Point2D, map: T[][]): Point2D[] {
  const res: Point2D[] = [];
  const maxX = map.length - 1;
  const maxY = map[0].length - 1;

  if (y < maxY) res.push({ x, y: y + 1 });
  if (y !== 0) res.push({ x, y: y - 1 });
  if (x < maxX) res.push({ x: x + 1, y });
  if (x !== 0) res.push({ x: x - 1, y });

  return res;
}

export function findAdjacentAll<T>({ x, y }: Point2D, map: T[][]): Point2D[] {
  const res: Point2D[] = [];
  const maxX = map.length - 1;
  const maxY = map[0].length - 1;

  if (y < maxY) res.push({ x, y: y + 1 });
  if (y !== 0) res.push({ x, y: y - 1 });
  if (x < maxX) res.push({ x: x + 1, y });
  if (x !== 0) res.push({ x: x - 1, y });
  if (x < maxX && y < maxY) res.push({ x: x + 1, y: y + 1 });
  if (x !== 0 && y < maxY) res.push({ x: x - 1, y: y + 1 });
  if (x < maxX && y !== 0) res.push({ x: x + 1, y: y - 1 });
  if (x !== 0 && y !== 0) res.push({ x: x - 1, y: y - 1 });

  return res;
}
