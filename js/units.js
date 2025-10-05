// Units → SI conversion
// Usage: toSI(kind, "40 oz")  // kind: 'length','mass','force','stress','accel','scalar','shear'

const LENGTH = { m:1, cm:0.01, mm:0.001, in:0.0254, ft:0.3048 };
const MASS   = { kg:1, g:1e-3, lb:0.45359237, lbm:0.45359237, lbs:0.45359237, oz:0.028349523125 };
const FORCE  = { N:1, kN:1e3, lbf:4.4482216152605 };
const STRESS = { Pa:1, kPa:1e3, MPa:1e6, GPa:1e9, psi:6894.757293168, ksi:6894.757293168*1000 };
const ACCEL  = { "m/s^2":1, "m/s2":1, "ft/s^2":0.3048, "ft/s2":0.3048, "in/s^2":0.0254, "in/s2":0.0254, g:9.80665 };

const NUM_UNIT_RE = /^([+-]?\d+(?:\.\d+)?(?:e[+-]?\d+)?)\s*([A-Za-z/^\-0-9]+)?$/i;

export function parseValue(raw) {
  const m = (raw||"").trim().match(NUM_UNIT_RE);
  if (!m) throw new Error("Enter number + unit (e.g., 40 oz, 0.125 in).");
  return { value: parseFloat(m[1]), unit: (m[2]||"").trim() };
}

export function toSI(kind, raw) {
  if (raw==null || String(raw).trim()==="") throw new Error("Missing value.");
  const { value, unit } = parseValue(raw);
  const u = unit.toLowerCase();

  switch (kind) {
    case "length": {
      const key = normKey(LENGTH, u);
      return value * LENGTH[key];
    }
    case "mass": {
      const key = normKey(MASS, u.replace(/s$/,"")); // allow lbs
      return value * MASS[key];
    }
    case "force": {
      const key = normKey(FORCE, u);
      return value * FORCE[key];
    }
    case "stress":
    case "shear": {
      const key = normKey(STRESS, u);
      return value * STRESS[key];
    }
    case "accel": {
      const key = normKey(ACCEL, u.replace(/\s+/g,""));
      return value * ACCEL[key];
    }
    case "scalar":
      if (unit && unit.toLowerCase()!=="x" && unit.toLowerCase()!=="unitless")
        throw new Error("Scalar is unitless (use e.g. 2 or '2 x').");
      return value;
    default:
      throw new Error(`Unknown kind: ${kind}`);
  }
}

function normKey(table, unit) {
  const keys = Object.keys(table);
  const found = keys.find(k => k.toLowerCase() === unit);
  if (!found) throw new Error(`Unsupported unit: ${unit} (allowed: ${keys.join(", ")})`);
  return found;
}
