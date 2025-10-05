// Fin Flutter (Vf only) per hobby-rocketry formula using imperial atmos relations.
// Inputs SI: cr, ct, t, b, h [m], G [Pa]; Output: Vf [m/s]
export const finFlutter = {
  id: "fin-flutter",
  name: "Fin Flutter",
  fields: [
    { key:"cr", label:"Root chord (cr)", kind:"length", hint:"m, cm, mm, in, ft" },
    { key:"ct", label:"Tip chord (ct)",  kind:"length", hint:"m, cm, mm, in, ft" },
    { key:"t",  label:"Thickness (t)",   kind:"length", hint:"m, cm, mm, in, ft" },
    { key:"b",  label:"Semi-span (b)",   kind:"length", hint:"m, cm, mm, in, ft" },
    { key:"h",  label:"Altitude (h)",    kind:"length", hint:"m, cm, mm, in, ft" },
    { key:"G",  label:"Shear modulus (G)", kind:"shear", hint:"Pa, kPa, MPa, GPa, psi, ksi" },
    { key:"Vf", label:"Flutter velocity (Vf)", kind:"velocity", hint:"(output only)" },
  ],
  solveables: ["Vf"],
  computeSI(solveFor, v){
    if (!["Vf","vf","v"].includes(solveFor)) throw new Error("Fin Flutter only solves Vf.");

    // basic checks
    ["cr","ct","t","b","h","G"].forEach(k=>{
      if (v[k]==null) throw new Error(`Missing ${k}`);
      if (v[k] <= 0 && k!=="h") throw new Error(`${k} must be > 0`);
    });

    // geometry
    const S      = 0.5 * (v.cr + v.ct) * v.b;
    const AR     = (v.b*v.b) / S;
    const lam    = v.ct / v.cr;
    const c_mean = 0.5 * (v.cr + v.ct);
    const tc3    = Math.pow(v.t / c_mean, 3);

    // atmosphere (imperial relations)
    const h_ft = v.h / 0.3048;
    const T_F  = 59.0 - 0.00356 * h_ft;
    const P_psf = 2116.0 * Math.pow(( (T_F + 459.7) / 518.6 ), 5.256);
    const a_fts = Math.sqrt(1.4 * 1716.59 * (T_F + 460.0));

    // material G: Pa -> psi -> psf
    const G_psi = v.G / 6894.757293168;
    const G_psf = G_psi * 144.0;

    const factor = (G_psf / (1.337 * Math.pow(AR,3) * P_psf * (lam + 1.0)))
                 * (2.0 * (AR + 2.0) * tc3);

    if (factor <= 0) throw new Error("Non-positive flutter factor. Check inputs.");
    const Vf_fts = a_fts * Math.sqrt(factor);
    const Vf_mps = Vf_fts * 0.3048;
    return Vf_mps;
  }
};
