// Centering Ring (SI): A = π d t; F = s m a; sigma = F/A
export const centeringRing = {
  id: "centering-ring",
  name: "Centering Ring",
  fields: [
    { key:"a", label:"Acceleration (a)", kind:"accel", hint:"m/s^2, ft/s^2, g" },
    { key:"m", label:"Mass (m)",        kind:"mass",  hint:"kg, g, lb, oz" },
    { key:"s", label:"Factor of Safety (s)", kind:"scalar", hint:"unitless" },
    { key:"d", label:"Mean diameter (d)", kind:"length", hint:"m, cm, mm, in, ft" },
    { key:"t", label:"Thickness (t)",      kind:"length", hint:"m, cm, mm, in, ft" },
    { key:"sigma", label:"Stress (σ)",     kind:"stress", hint:"Pa, kPa, MPa, psi" },
  ],
  solveables: ["sigma","a","m","s","d","t"],
  computeSI(solveFor, v){ // v: {a,m,s,d,t,sigma} in SI
    const A = Math.PI * v.d * v.t;
    const F = v.s * v.m * v.a;
    switch(solveFor){
      case "sigma": return F / A;
      case "a":     return (v.sigma * A) / (v.s * v.m);
      case "m":     return (v.sigma * A) / (v.s * v.a);
      case "s":     return (v.sigma * A) / (v.m * v.a);
      case "t":     return F / (Math.PI * v.d * v.sigma);
      case "d":     return F / (Math.PI * v.t * v.sigma);
      default: throw new Error("Unknown variable");
    }
  }
};
