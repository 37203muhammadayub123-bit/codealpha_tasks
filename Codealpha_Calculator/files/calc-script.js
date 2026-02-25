/* =============================================
   CALC — Calculator
   calc-script.js
   ============================================= */

// ─── STATE ────────────────────────────────────
const state = {
  current:      "0",      // number being entered
  previous:     null,     // previous operand
  operator:     null,     // pending operator
  justEvaled:   false,    // did we just press =?
  expression:   "",       // expression string for display
};

// ─── ELEMENT REFS ─────────────────────────────
const resultEl     = document.getElementById("result");
const expressionEl = document.getElementById("expression");
const hintEl       = document.getElementById("hint");
const calcEl       = document.getElementById("calculator");

// ─── DISPLAY UPDATE ───────────────────────────
function updateDisplay() {
  const val = state.current;

  // Adjust font size for long numbers
  resultEl.classList.remove("small", "xsmall");
  if (val.length > 12)      resultEl.classList.add("xsmall");
  else if (val.length > 8)  resultEl.classList.add("small");

  resultEl.textContent = formatNumber(val);
  expressionEl.textContent = state.expression || "\u00a0";
}

function formatNumber(val) {
  if (val === "Error") return "Error";
  if (val.includes(".")) {
    // Don't format decimals mid-entry
    const [int, dec] = val.split(".");
    return Number(int).toLocaleString() + "." + dec;
  }
  const num = parseFloat(val);
  if (isNaN(num)) return val;
  // Abbreviate huge numbers
  if (Math.abs(num) >= 1e15) return num.toExponential(6);
  return num.toLocaleString();
}

function flashResult() {
  resultEl.classList.remove("pop");
  void resultEl.offsetWidth; // reflow
  resultEl.classList.add("pop");
  resultEl.addEventListener("animationend", () => resultEl.classList.remove("pop"), { once: true });
}

function showError(msg = "Error") {
  state.current = "Error";
  state.previous = null;
  state.operator = null;
  state.expression = "";
  state.justEvaled = false;
  resultEl.textContent = msg;
  calcEl.classList.add("error");
  setTimeout(() => calcEl.classList.remove("error"), 400);
}

// ─── OPERATIONS ───────────────────────────────
function calculate(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);
  switch (op) {
    case "+": return a + b;
    case "−": return a - b;
    case "×": return a * b;
    case "÷":
      if (b === 0) return null; // division by zero
      return a / b;
    default: return b;
  }
}

function opSymbol(action) {
  const map = { add: "+", subtract: "−", multiply: "×", divide: "÷" };
  return map[action] || action;
}

// ─── BUTTON HANDLERS ──────────────────────────

function handleNumber(value) {
  if (state.current === "Error") return;

  if (state.justEvaled) {
    // Start fresh after =
    state.current = value;
    state.expression = "";
    state.justEvaled = false;
  } else if (state.current === "0") {
    state.current = value;
  } else {
    if (state.current.replace("-", "").replace(".", "").length >= 15) return;
    state.current += value;
  }
  updateDisplay();
}

function handleDecimal() {
  if (state.current === "Error") return;
  if (state.justEvaled) { state.current = "0."; state.justEvaled = false; updateDisplay(); return; }
  if (!state.current.includes(".")) {
    state.current += ".";
    updateDisplay();
  }
}

function handleOperator(action) {
  if (state.current === "Error") return;
  const sym = opSymbol(action);

  // If we already have a pending op and a previous value → chain calculation
  if (state.operator && state.previous !== null && !state.justEvaled) {
    const result = calculate(state.previous, state.current, state.operator);
    if (result === null) { showError("Can't ÷ 0"); return; }
    const resultStr = String(parseFloat(result.toPrecision(12)));
    state.previous  = resultStr;
    state.current   = resultStr;
    flashResult();
  } else {
    state.previous = state.current;
  }

  state.operator   = sym;
  state.expression = `${formatNumber(state.previous)} ${sym}`;
  state.justEvaled = false;

  // Next number entry will clear current
  state._pendingNewNum = true;
  updateDisplay();

  // Visually highlight active operator button
  highlightOperator(action);
}

function handleEquals() {
  if (state.current === "Error") return;
  if (!state.operator || state.previous === null) return;

  const a   = state.previous;
  const b   = state.current;
  const op  = state.operator;
  const full = `${formatNumber(a)} ${op} ${formatNumber(b)} =`;

  const result = calculate(a, b, op);
  if (result === null) { showError("Can't ÷ 0"); return; }

  const resultStr = String(parseFloat(result.toPrecision(12)));

  state.expression = full;
  state.current    = resultStr;
  state.previous   = null;
  state.operator   = null;
  state.justEvaled = true;

  clearOperatorHighlight();
  flashResult();
  updateDisplay();
}

function handleClear() {
  state.current    = "0";
  state.previous   = null;
  state.operator   = null;
  state.expression = "";
  state.justEvaled = false;
  state._pendingNewNum = false;
  clearOperatorHighlight();
  updateDisplay();
  hintEl.textContent = "\u00a0";
}

function handleSign() {
  if (state.current === "Error" || state.current === "0") return;
  state.current = state.current.startsWith("-")
    ? state.current.slice(1)
    : "-" + state.current;
  updateDisplay();
}

function handlePercent() {
  if (state.current === "Error") return;
  const val = parseFloat(state.current) / 100;
  state.current = String(parseFloat(val.toPrecision(12)));
  updateDisplay();
}

// Override num handler to support pending new number after operator
const _origHandleNumber = handleNumber;
function handleNumberWrapped(value) {
  if (state._pendingNewNum) {
    state.current = value === "0" ? "0" : value;
    state._pendingNewNum = false;
    updateDisplay();
  } else {
    _origHandleNumber(value);
  }
}

// ─── OPERATOR HIGHLIGHT ───────────────────────
function highlightOperator(action) {
  clearOperatorHighlight();
  const btn = document.querySelector(`[data-action="${action}"]`);
  if (btn) btn.classList.add("active");
}

function clearOperatorHighlight() {
  document.querySelectorAll(".btn-op.active").forEach(b => b.classList.remove("active"));
}

// ─── BUTTON CLICK DISPATCH ────────────────────
document.querySelector(".btn-grid").addEventListener("click", e => {
  const btn = e.target.closest(".btn");
  if (!btn) return;

  const action = btn.dataset.action;
  const value  = btn.dataset.value;

  switch (action) {
    case "num":      handleNumberWrapped(value); break;
    case "decimal":  handleDecimal();            break;
    case "add":
    case "subtract":
    case "multiply":
    case "divide":   handleOperator(action);     break;
    case "equals":   handleEquals();             break;
    case "clear":    handleClear();              break;
    case "sign":     handleSign();               break;
    case "percent":  handlePercent();            break;
  }
});

// ─── KEYBOARD SUPPORT ─────────────────────────
const KEY_MAP = {
  "0": { action: "num", value: "0" },
  "1": { action: "num", value: "1" },
  "2": { action: "num", value: "2" },
  "3": { action: "num", value: "3" },
  "4": { action: "num", value: "4" },
  "5": { action: "num", value: "5" },
  "6": { action: "num", value: "6" },
  "7": { action: "num", value: "7" },
  "8": { action: "num", value: "8" },
  "9": { action: "num", value: "9" },
  ".": { action: "decimal" },
  ",": { action: "decimal" },
  "+": { action: "add" },
  "-": { action: "subtract" },
  "*": { action: "multiply" },
  "x": { action: "multiply" },
  "/": { action: "divide" },
  "Enter":     { action: "equals" },
  "=":         { action: "equals" },
  "Backspace": { action: "backspace" },
  "Escape":    { action: "clear" },
  "Delete":    { action: "clear" },
  "%":         { action: "percent" },
};

document.addEventListener("keydown", e => {
  const mapped = KEY_MAP[e.key];
  if (!mapped) return;

  e.preventDefault();

  // Flash the corresponding button
  animateKeyPress(mapped);

  switch (mapped.action) {
    case "num":      handleNumberWrapped(mapped.value); break;
    case "decimal":  handleDecimal();                   break;
    case "add":
    case "subtract":
    case "multiply":
    case "divide":   handleOperator(mapped.action);     break;
    case "equals":   handleEquals();                    break;
    case "clear":    handleClear();                     break;
    case "percent":  handlePercent();                   break;
    case "backspace": handleBackspace();                break;
  }
});

function handleBackspace() {
  if (state.current === "Error" || state.justEvaled) { handleClear(); return; }
  if (state.current.length <= 1 || (state.current.length === 2 && state.current.startsWith("-"))) {
    state.current = "0";
  } else {
    state.current = state.current.slice(0, -1);
  }
  updateDisplay();
}

function animateKeyPress(mapped) {
  let btn = null;
  if (mapped.action === "num") {
    btn = document.querySelector(`[data-value="${mapped.value}"]`);
  } else {
    btn = document.querySelector(`[data-action="${mapped.action}"]`);
  }
  if (!btn) return;
  btn.classList.add("pressed");
  setTimeout(() => btn.classList.remove("pressed"), 150);
}

// ─── KEYBOARD HINT ────────────────────────────
document.addEventListener("keydown", () => {
  hintEl.textContent = "⌨ keyboard active";
  clearTimeout(hintEl._t);
  hintEl._t = setTimeout(() => { hintEl.textContent = "\u00a0"; }, 2000);
}, { once: true });

// ─── INIT ─────────────────────────────────────
updateDisplay();
