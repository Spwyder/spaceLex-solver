// Zippering (stress only): sigma = F / A, A = min( t*h , t*(ro-ri) )
export const zippering = {
  id: "zippering",
  name: "Zippering",
  fields: [
    { key:"F",  label:"Force (F)",      kind:"force",  hint:"N, kN, lbf" },
    { key:"t",  label:"Thickness (t)",  kind:"length", hint:"m, cm, mm, in, ft" },
    { key:"h",  label:"Height (h)",     kind:"length", hint:"m, cm, mm, in, ft (optional if ro & ri provided)" },
    { key:"ro", label:"Outer radius (ro)", kind:"length", hint:"m, cm, mm, in, ft (optional if h provided)" },
    { key:"ri", label:"Inner radius (ri)", kind:"length", hint:"m, cm, mm, in, ft (optional if h provided)" },
    { key:"sigma", label:"Stress (σ)",  kind:"stress", hint:"(output only)" },
  ],
  solveables: ["sigma"],
  computeSI(solveFor, v){
    if (solveFor !== "sigma") throw new Error("Zippering only solves for σ.");
    if (v.F==null || v.t==null) throw new Error("Provide F and t.");
    const areas = [];
    if (v.h!=null) {
      const A1 = v.t * v.h;
      if (A1<=0) throw new Error("t*h must be > 0");
      areas.push(A1);
    }
    if (v.ro!=null && v.ri!=null) {
      if (v.ro < v.ri) throw new Error("ro must be ≥ ri.");
      const A2 = v.t * (v.ro - v.ri);
      if (A2<=0) throw new Error("t*(ro-ri) must be > 0");
      areas.push(A2);
    }
    if (!areas.length) throw new Error("Provide h OR (ro and ri).");
    const A = Math.min(...areas);
    return v.F / A;
  }
};
