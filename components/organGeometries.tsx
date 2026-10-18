import {
  BufferGeometry,
  CatmullRomCurve3,
  CylinderGeometry,
  ExtrudeGeometry,
  IcosahedronGeometry,
  Shape,
  TubeGeometry,
  Vector3,
} from 'three';

/**
 * Low-poly органы. Все формы примерно единичного размера (в пределах [-1, 1]),
 * а реальный размер задаётся через organ.scale в data/sections.ts.
 */

/**
 * Делает геометрию «плоской»: у каждой грани своя нормаль.
 * Так граненый вид получается без производных в шейдере (dFdx/dFdy),
 * которые могут давать NaN и мерцание вместе с Bloom.
 */
export function toFlat(g: BufferGeometry): BufferGeometry {
  const out = g.index ? g.toNonIndexed() : g;
  out.computeVertexNormals();
  return out;
}

// Детерминированный «шум»: зависит только от координат вершины,
// поэтому совпадающие вершины смещаются одинаково и щелей нет.
const noise = (x: number, y: number, z: number) =>
  Math.sin(x * 5.1 + y * 3.7) * Math.cos(z * 4.3 + x * 2.9);

function warp(
  g: BufferGeometry,
  fn: (x: number, y: number, z: number) => [number, number, number],
): BufferGeometry {
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const [x, y, z] = fn(p.getX(i), p.getY(i), p.getZ(i));
    p.setXYZ(i, x, y, z);
  }
  p.needsUpdate = true;
  return g;
}

function brain() {
  return warp(new IcosahedronGeometry(1, 1), (x, y, z) => {
    const k = 1 + 0.14 * noise(x, y, z);
    return [x * k, (y < 0 ? y * 0.7 : y) * k, z * k];
  });
}

function throat() {
  return new CylinderGeometry(0.75, 1, 2, 6, 1);
}

function lung() {
  // Узкий сверху, широкий снизу
  return warp(new IcosahedronGeometry(1, 1), (x, y, z) => {
    const taper = 0.7 + 0.3 * (1 - y) * 0.5;
    const k = 1 + 0.06 * noise(x, y, z);
    return [x * taper * k, y * k, z * k];
  });
}

/**
 * Сердце: классическая кривая сердца, взятая в 24 точках (получается многоугольник)
 * и выдавленная с небольшой фаской. Самое широкое место — сразу под верхней
 * выемкой, дальше контур плавно сходится в острие.
 */
function heart() {
  const N = 24;
  const shape = new Shape();
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);
    const px = x / 16;
    const py = (y + 2.5) / 16;
    if (i === 0) shape.moveTo(px, py);
    else shape.lineTo(px, py);
  }
  shape.closePath();

  const g = new ExtrudeGeometry(shape, {
    depth: 0.7,
    steps: 1,
    bevelEnabled: true,
    bevelThickness: 0.2,
    bevelSize: 0.08,
    bevelSegments: 1,
  });
  g.center();
  g.rotateZ(-0.2); // сердце чуть наклонено
  return g;
}

function stomach() {
  // Бобовидная форма: загнутая и сужающаяся к низу
  return warp(new IcosahedronGeometry(1, 1), (x, y, z) => {
    const bend = 0.35 * y * y;
    const taper = 1 - 0.25 * (1 - y) * 0.5;
    const k = 1 + 0.05 * noise(x, y, z);
    return [(x * taper + bend) * k, y * k, z * k];
  });
}

function intestines() {
  // Змейка из петель в рамке [-1, 1]
  const pts: Vector3[] = [];
  const rows = 4;
  for (let r = 0; r < rows; r++) {
    const y = 0.8 - (r * 1.6) / (rows - 1);
    const dir = r % 2 === 0 ? 1 : -1;
    pts.push(new Vector3(-0.85 * dir, y, 0));
    pts.push(new Vector3(-0.3 * dir, y + 0.12, 0.15));
    pts.push(new Vector3(0.3 * dir, y - 0.12, -0.15));
    pts.push(new Vector3(0.85 * dir, y, 0));
  }
  const curve = new CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
  return new TubeGeometry(curve, 70, 0.17, 5, false);
}

function build(id: string): BufferGeometry {
  switch (id) {
    case 'brain':
      return brain();
    case 'throat':
      return throat();
    case 'lungs':
      return lung();
    case 'heart':
      return heart();
    case 'stomach':
      return stomach();
    case 'intestines':
      return intestines();
    default:
      return new IcosahedronGeometry(1, 1);
  }
}

export function createOrganGeometry(id: string): BufferGeometry {
  return toFlat(build(id));
}