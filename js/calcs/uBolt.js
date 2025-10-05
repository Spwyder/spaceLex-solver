// U-Bolt (SI): A = (π/4) d^2; F = s m a; sigma = F/A
export const uBolt = {
  id: "u-bolt",
  name: "U-Bolt",
  fields: [
    { key:"a", label:"Acceleration (a)", kind:"accel", hint:"m/s^2, ft/s^2, g" },
    { key:"m", label:"Mass (m)",        kind:"mass",  hint:"kg, g, lb, oz" },
    { key:"s", label:"Factor of Safety (s)", kind:"scalar", hint:"unitless" },
    { key:"d", label:"Diameter (d)",     kind:"length", hint:"m, cm, mm, in, ft" },
    { key:"sigma", label:"Stress (σ)",   kind:"stress", hint:"Pa, kPa, MPa, psi" },
  ],
  solveables: ["sigma","a","m","s","d"],
  computeSI(solveFor, v){
    const A = (Math.PI/4)*v.d*v.d;
    const F = v.s * v.m * v.a;
    switch(solveFor){
      case "sigma": return F / A;
      case "a":     return (v.sigma * A) / (v.s * v.m);
      case "m":     return (v.sigma * A) / (v.s * v.a);
      case "s":     return (v.sigma * A) / (v.m * v.a);
      case "d":     return Math.sqrt((4 * (v.s * v.m * v.a)) / (Math.PI * v.sigma));
      default: throw new Error("Unknown variable");
    }
  }
};
