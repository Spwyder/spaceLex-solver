import { toSI } from "./units.js";
import { formatResult } from "./format.js";
import { centeringRing } from "./calcs/centeringRing.js";
import { uBolt } from "./calcs/uBolt.js";
import { zippering } from "./calcs/zippering.js";
import { finFlutter } from "./calcs/finFlutter.js";

const CALCS = [centeringRing, uBolt, zippering, finFlutter];

// DOM
const calcSelect = document.getElementById("calcSelect");
const solveForRow = document.getElementById("solveForRow");
const solveForSel = document.getElementById("solveFor");
const inputsGrid  = document.getElementById("inputsGrid");
const calcTitle   = document.getElementById("calcTitle");
const computeBtn  = document.getElementById("computeBtn");
const msgEl       = document.getElementById("msg");
const resultsCard = document.getElementById("resultsCard");
const resultText  = document.getElementById("resultText");
const inputsSIBox = document.getElementById("inputsSI");

// Init menu
CALCS.forEach(c => {
  const opt = document.createElement("option");
  opt.value = c.id; opt.textContent = c.name;
  calcSelect.appendChild(opt);
});
let current = CALCS[0];
renderCalc(current);

// Events
calcSelect.addEventListener("change", () => {
  current = CALCS.find(c => c.id === calcSelect.value);
  renderCalc(current);
});
solveForSel.addEventListener("change", () => renderInputs(current));
computeBtn.addEventListener("click", onCompute);

function renderCalc(calc){
  calcTitle.textContent = `${calc.name} — Inputs`;
  // Solve-for dropdown
  solveForSel.innerHTML = "";
  calc.solveables.forEach(k=>{
    const o = document.createElement("option");
    o.value = k; o.textContent = k;
    solveForSel.appendChild(o);
  });
  solveForRow.style.display = calc.solveables.length > 1 ? "grid" : "none";
  renderInputs(calc);
  clearResult();
}

function renderInputs(calc){
  inputsGrid.innerHTML = "";
  msgEl.textContent = "";
  const solveFor = getSolveFor(calc);
  calc.fields.forEach(f=>{
    if (f.key === solveFor) return; // hide solved variable
    inputsGrid.appendChild(inputField(f));
  });
}

function inputField(f){
  const wrap = document.createElement("div");
  wrap.className = "input";
  const lab = document.createElement("label");
  lab.textContent = `${f.label} (${f.hint})`;
  const inp = document.createElement("input");
  inp.type = "text"; inp.id = `in_${f.key}`;
  inp.placeholder = exampleFor(f.kind);
  wrap.appendChild(lab); wrap.appendChild(inp);
  return wrap;
}

function exampleFor(kind){
  switch(kind){
    case "accel": return "e.g., 9.81 m/s^2 or 2 g";
    case "mass":  return "e.g., 40 oz";
    case "length":return "e.g., 0.125 in";
    case "force": return "e.g., 15 lbf";
    case "stress":return "e.g., 30 MPa or 4,000 psi";
    case "shear": return "e.g., 0.38 Msi or 2.6 GPa";
    case "scalar":return "e.g., 1.5";
    default: return "";
  }
}

function getSolveFor(calc){
  if (calc.solveables.length === 1) return calc.solveables[0];
  return solveForSel.value || calc.solveables[0];
}

function onCompute(){
  try{
    msgEl.textContent = "";
    const calc = current;
    const solveFor = getSolveFor(calc);

    // Read inputs and convert to SI
    const si = {};
    calc.fields.forEach(f=>{
      if (f.key === solveFor) return;
      const raw = valueOf(`in_${f.key}`);
      if (!raw) throw new Error(`Missing ${f.label}`);
      // For zippering, allow either (h) or (ro & ri)
      if (calc.id==="zippering" && (f.key==="h" || f.key==="ro" || f.key==="ri")){
        // we convert optional ones only if provided
        if (raw.trim() === "") return;
      }
      si[f.key] = toSI(kindFor(f), raw);
    });

    // Special rule for zippering optionals: must have h OR (ro and ri)
    if (calc.id==="zippering"){
      const haveH  = si.h!=null;
      const haveRR = si.ro!=null && si.ri!=null;
      if (!haveH && !haveRR) throw new Error("Provide either h OR (ro and ri).");
    }

    // Compute
    const valSI = calc.computeSI(solveFor, si);
    resultsCard.style.display = "block";
    resultText.textContent = `${solveFor} = ${formatResult(solveFor, valSI)}`;

    // Show converted inputs
    inputsSIBox.innerHTML = "";
    const ul = document.createElement("ul");
    Object.entries(si).forEach(([k,v])=>{
      const li = document.createElement("li");
      li.textContent = `${k} = ${v}`;
      ul.appendChild(li);
    });
    inputsSIBox.appendChild(ul);

  }catch(e){
    clearResult();
    msgEl.textContent = e.message || String(e);
  }
}

function clearResult(){
  resultsCard.style.display = "none";
  resultText.textContent = "";
  inputsSIBox.innerHTML = "";
}

function kindFor(f){ return f.kind || "scalar"; }
function valueOf(id){ const el = document.getElementById(id); return el ? el.value : ""; }
