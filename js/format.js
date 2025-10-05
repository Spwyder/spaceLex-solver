export function fmtSI(key, si) {
  if (["length"].includes(key)) return `${si.toPrecision(6)} m`;
  return `${si}`;
}

export function formatResult(varKey, siValue) {
  if (["d","t","h","ro","ri","cr","ct","b"].includes(varKey))
    return `${siValue.toPrecision(6)} m  (${(siValue*1e3).toPrecision(6)} mm)`;
  if (varKey==="m")
    return `${siValue.toPrecision(6)} kg  (${(siValue*1e3).toPrecision(6)} g)`;
  if (varKey==="a")
    return `${siValue.toPrecision(6)} m/s²  (${(siValue/9.80665).toPrecision(6)} g)`;
  if (varKey==="F")
    return `${siValue.toPrecision(6)} N  (${(siValue/1000).toPrecision(6)} kN)`;
  if (["sigma","G"].includes(varKey))
    return `${siValue.toPrecision(6)} Pa  (${(siValue/1e6).toPrecision(6)} MPa)`;
  if (varKey==="s")
    return `${siValue.toPrecision(6)} (unitless)`;
  if (["Vf","vf","v"].includes(varKey)) {
    const ft_s = siValue/0.3048;
    return `${siValue.toFixed(3)} m/s  (${ft_s.toFixed(1)} ft/s)`;
  }
  return `${siValue.toPrecision(6)} (SI units)`;
}
