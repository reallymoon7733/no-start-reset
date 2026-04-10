import { useState, useEffect, useRef, useCallback } from "react";

/* ─── TOKENS ─────────────────────────────────────────────── */
const T = {
  bg: "#F7F5F2", text: "#2E2E33", muted: "#8A8A94", light: "#B5B5BF",
  primary: "#5C6AC4", primaryHover: "#4A58B2", primaryLight: "#EEF0FB",
  sage: "#8FB9A8", sageLight: "#EDF4F1",
  rose: "#E8A598",
  card: "#FFFFFF", border: "#E5E5E5",
  shadow: "0 2px 16px rgba(46,46,51,0.07)",
};

/* ─── CSS ────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{background:${T.bg};font-family:'Plus Jakarta Sans',sans-serif;}

  @keyframes fadeUp{
    from{opacity:0;transform:translateY(16px)}
    to{opacity:1;transform:translateY(0)}
  }
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}

  @keyframes glowPulse{
    0%,100%{transform:scale(1);   opacity:0.18}
    50%    {transform:scale(1.22);opacity:0.09}
  }
  @keyframes corePulse{
    0%,100%{transform:scale(1);   opacity:0.62}
    50%    {transform:scale(1.08);opacity:0.78}
  }
  @keyframes timerTick{0%,100%{opacity:1}50%{opacity:0.45}}
  @keyframes btnPop{from{opacity:0.28;transform:scale(.97)}to{opacity:1;transform:scale(1)}}

  .screen{animation:fadeUp .34s cubic-bezier(.22,.68,0,1.1) both}
  .fadein{animation:fadeIn .28s ease both}

  .btn-p{
    width:100%;background:${T.primary};color:#fff;border:none;border-radius:14px;
    padding:16px 22px;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;
    font-weight:600;cursor:pointer;transition:background .18s,transform .12s,box-shadow .18s;
    box-shadow:0 3px 14px rgba(92,106,196,.26);
  }
  .btn-p:hover{background:${T.primaryHover};box-shadow:0 5px 20px rgba(92,106,196,.36)}
  .btn-p:active{transform:scale(.98)}
  .btn-p:disabled{opacity:.28;cursor:not-allowed;transform:none;box-shadow:none}
  .btn-p.pop{animation:btnPop .24s cubic-bezier(.22,.68,0,1.2) both}

  .btn-sage{
    width:100%;background:${T.sage};color:#fff;border:none;border-radius:14px;
    padding:16px 22px;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;
    font-weight:600;cursor:pointer;transition:background .18s,transform .12s;
    box-shadow:0 3px 14px rgba(143,185,168,.28);
  }
  .btn-sage:hover{background:#7aaa97}
  .btn-sage:active{transform:scale(.98)}

  .btn-s{
    width:100%;background:transparent;color:${T.text};border:1.5px solid ${T.border};
    border-radius:14px;padding:14px 22px;font-family:'Plus Jakarta Sans',sans-serif;
    font-size:15px;font-weight:500;cursor:pointer;
    transition:border-color .18s,background .18s,transform .12s;
  }
  .btn-s:hover{border-color:${T.primary};color:${T.primary};background:${T.primaryLight}}
  .btn-s:active{transform:scale(.98)}

  .btn-g{
    background:none;border:none;color:${T.muted};font-family:'Plus Jakarta Sans',sans-serif;
    font-size:14px;font-weight:500;cursor:pointer;padding:8px 12px;border-radius:8px;
    transition:color .18s,background .18s;
  }
  .btn-g:hover{color:${T.text};background:rgba(46,46,51,.05)}

  .btn-lnk{
    background:none;border:none;color:${T.light};font-family:'Plus Jakarta Sans',sans-serif;
    font-size:13px;cursor:pointer;padding:4px 0;text-decoration:underline;
    text-underline-offset:3px;transition:color .18s;
  }
  .btn-lnk:hover{color:${T.muted}}

  .inp{
    width:100%;background:#FAFAF8;border:1.5px solid ${T.border};border-radius:14px;
    padding:15px 17px;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;
    color:${T.text};outline:none;transition:border-color .2s,box-shadow .2s;resize:none;
    -webkit-appearance:none;
  }
  .inp:focus{border-color:${T.primary};box-shadow:0 0 0 3px rgba(92,106,196,.1)}
  .inp::placeholder{color:${T.light}}

  .sinp{
    width:100%;background:#FAFAF8;border:1.5px solid ${T.border};border-radius:12px;
    padding:12px 15px;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;
    color:${T.text};outline:none;transition:border-color .2s,box-shadow .2s;-webkit-appearance:none;
  }
  .sinp:focus{border-color:${T.primary};box-shadow:0 0 0 3px rgba(92,106,196,.1)}
  .sinp::placeholder{color:${T.light}}
  .sinp.filled{border-color:#D0D0D0}

  .pill{
    display:flex;align-items:center;gap:11px;padding:13px 14px;border-radius:12px;
    border:1.5px solid ${T.border};background:${T.card};cursor:pointer;
    transition:all .18s;width:100%;text-align:left;
  }
  .pill:hover{border-color:${T.primary};background:${T.primaryLight}}
  .pill.sel{border-color:${T.primary};background:${T.primaryLight};box-shadow:0 0 0 3px rgba(92,106,196,.09)}

  .ocard{
    padding:16px 15px;border-radius:14px;border:1.5px solid ${T.border};
    background:${T.card};cursor:pointer;transition:all .18s;text-align:left;width:100%;
  }
  .ocard:hover{border-color:${T.sage};background:${T.sageLight}}

  .winp{
    width:100%;background:transparent;border:none;border-bottom:2px solid ${T.border};
    padding:10px 4px;font-family:'Lora',serif;font-size:26px;font-weight:500;
    color:${T.text};text-align:center;outline:none;transition:border-color .2s;-webkit-appearance:none;
  }
  .winp:focus{border-bottom-color:${T.primary}}
  .winp::placeholder{color:${T.light};font-style:italic}
`;

/* ─── TIMER HOOK ─────────────────────────────────────────── */
function useTimer(init = 120) {
  const [left, setLeft] = useState(init);
  const [run,  setRun]  = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef(null);

  const start = useCallback(() => { setRun(true); setDone(false); }, []);
  const pause = useCallback(() => setRun(false), []);
  const reset = useCallback((s) => {
    clearInterval(ref.current);
    setLeft(s ?? init); setRun(false); setDone(false);
  }, [init]);

  useEffect(() => {
    if (run) {
      ref.current = setInterval(() => setLeft(t => {
        if (t <= 1) { clearInterval(ref.current); setRun(false); setDone(true); return 0; }
        return t - 1;
      }), 1000);
    } else clearInterval(ref.current);
    return () => clearInterval(ref.current);
  }, [run]);

  const mins     = String(Math.floor(left / 60)).padStart(2, "0");
  const secs     = String(left % 60).padStart(2, "0");
  const progress = 1 - left / (init || 1);
  return { left, run, done, start, pause, reset, mins, secs, progress };
}

/* ─── CIRCULAR TIMER ─────────────────────────────────────── */
function Ring({ progress, mins, secs, run, done }) {
  const r = 72, circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
      <svg width={176} height={176} viewBox="0 0 176 176" style={{ transform: "rotate(-90deg)" }}>
        <circle cx={88} cy={88} r={r} fill="none" stroke={T.border} strokeWidth={7} />
        <circle cx={88} cy={88} r={r} fill="none"
          stroke={done ? T.sage : T.primary} strokeWidth={7} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - progress)}
          style={{ transition: "stroke-dashoffset 1s linear, stroke .4s" }} />
      </svg>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: 2 }}>
        <span style={{
          fontFamily: "'Lora',serif", fontSize: done ? 36 : 40, fontWeight: 500,
          color: done ? T.sage : T.text, letterSpacing: "-.02em", lineHeight: 1,
          animation: run ? "timerTick 2.4s ease-in-out infinite" : "none",
        }}>
          {done ? "✓" : `${mins}:${secs}`}
        </span>
        {!done && (
          <span style={{ fontSize: 10, color: T.light, letterSpacing: ".08em", textTransform: "uppercase" }}>
            {run ? "going" : "ready"}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── BREATHING GLOW ─────────────────────────────────────── */
function Glow() {
  return (
    <div style={{ position: "relative", width: 130, height: 130, margin: "0 auto" }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: "radial-gradient(circle, #E8A59833 0%, #E8A59808 65%, transparent 100%)",
        animation: "glowPulse 5s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", inset: "16px", borderRadius: "50%",
        background: "radial-gradient(circle, #F2C4B844 0%, #E8A59822 60%, transparent 100%)",
        animation: "glowPulse 5s ease-in-out .5s infinite",
      }} />
      <div style={{
        position: "absolute", inset: "36px", borderRadius: "50%",
        background: "radial-gradient(circle at 38% 36%, #FDF0EC 0%, #EFC4B6 55%, #DBA898 100%)",
        animation: "corePulse 5s ease-in-out 1s infinite",
        boxShadow: "0 6px 28px rgba(232,165,152,.30)",
      }} />
    </div>
  );
}

/* ─── PRIMITIVES ─────────────────────────────────────────── */
const Lbl = ({ children, style }) => (
  <span style={{
    fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: 600,
    letterSpacing: ".1em", textTransform: "uppercase", color: T.light, ...style,
  }}>{children}</span>
);

const H = ({ children, style }) => (
  <h2 style={{
    fontFamily: "'Lora',serif", fontSize: 26, fontWeight: 600,
    color: T.text, lineHeight: 1.28, ...style,
  }}>{children}</h2>
);

const Sub = ({ children, style }) => (
  <p style={{
    fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 15,
    color: T.muted, lineHeight: 1.65, ...style,
  }}>{children}</p>
);

const Card = ({ children, style }) => (
  <div style={{
    background: T.card, borderRadius: 18, padding: "20px 18px",
    boxShadow: T.shadow, border: `1px solid ${T.border}`, ...style,
  }}>{children}</div>
);

const Dot = ({ color }) => (
  <span style={{
    display: "inline-block", width: 7, height: 7,
    borderRadius: "50%", background: color, flexShrink: 0,
  }} />
);

const Scr = ({ children, center }) => (
  <div className="screen" style={{
    display: "flex", flexDirection: "column", gap: 22,
    ...(center && { alignItems: "center", textAlign: "center" }),
  }}>
    {children}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [screen,      setScreen]      = useState("welcome");
  const [task,        setTask]        = useState("");
  const [stepList,    setStepList]    = useState(["", "", "", ""]);
  const [stepIdx,     setStepIdx]     = useState(0);
  const [activeStep,  setActiveStep]  = useState(""); // explicit — set atomically with navigation
  const activeStepRef = useRef(""); // sync ref — always current, never stale across batched renders
  const [timerLabel,  setTimerLabel]  = useState("Do this now:");
  const [smallerText, setSmallerText] = useState("");
  const [feelWord,    setFeelWord]    = useState("");

  const mainTimer = useTimer(120);
  const contTimer = useTimer(120);

  const filledSteps = stepList.filter(s => s.trim());

  /* helper: always write ref + state together so render sees correct value immediately */
  function setStep(val) {
    activeStepRef.current = val;
    setActiveStep(val);
  }

  /* inject CSS once */
  useEffect(() => {
    const id = "nsr4";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id; el.textContent = CSS;
      document.head.appendChild(el);
    }
  }, []);

  /* ── helpers ── */
  function goToTimer(label, stepOverride) {
    mainTimer.reset(120);
    if (label) setTimerLabel(label);
    if (stepOverride !== undefined) setStep(stepOverride);
    setScreen("timer");
  }

  function continueWith(secs) {
    contTimer.reset(secs);
    setTimeout(() => contTimer.start(), 60);
    setScreen("continuing");
  }

  // Advance to next step first, then go to duration picker with new step already set
  function goNextStep() {
    const next = stepIdx + 1;
    if (next >= filledSteps.length) {
      setScreen("done");
    } else {
      const nextStep = filledSteps[next];
      setStepIdx(next);
      setStep(nextStep);        // ref + state written before navigation — always readable immediately
      setTimerLabel("Next step:");
      setScreen("continue-pick"); // user picks 2 or 5 min for the new step
    }
  }

  function fullReset() {
    setScreen("welcome"); setTask(""); setStepList(["", "", "", ""]);
    setStepIdx(0); setStep(""); activeStepRef.current = ""; setTimerLabel("Do this now:");
    setSmallerText(""); setFeelWord("");
    mainTimer.reset(120); contTimer.reset(120);
  }

  /* ══════════════════════════════════════════════════════════ */
  return (
    <div style={{
      minHeight: "100vh", background: T.bg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "28px 16px 52px",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* ── WELCOME ── */}
        {screen === "welcome" && (
          <Scr center>
            <Glow />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <H>You're not lazy.<br />Your brain is overloaded.</H>
              <Sub>
                When a task feels too big or unclear — your brain freezes.
                This tool helps you <em>start</em>.
              </Sub>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
              <Sub style={{ fontSize: 13, color: T.light, textAlign: "center" }}>
                Takes under 2 minutes. No pressure.
              </Sub>
              <button className="btn-p" onClick={() => setScreen("task")}>Start reset</button>
            </div>
          </Scr>
        )}

        {/* ── TASK INPUT ── */}
        {screen === "task" && (
          <Scr>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <Lbl>Step 1 of 3</Lbl>
              <H>What are you avoiding?</H>
              <Sub>Just write it. Seeing it helps.</Sub>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <textarea
                className="inp" rows={3}
                placeholder="e.g. Reply to emails, clean the kitchen, start that report…"
                value={task}
                onChange={e => setTask(e.target.value)}
                autoFocus
              />
              <span style={{ fontSize: 12, color: T.light, paddingLeft: 4 }}>
                Type one thing — that's enough.
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                className={`btn-p${task.trim() ? " pop" : ""}`}
                disabled={!task.trim()}
                onClick={() => setScreen("steps")}
              >
                Next
              </button>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button className="btn-g" onClick={() => setScreen("welcome")}>← Back</button>
              </div>
            </div>
          </Scr>
        )}

        {/* ── BREAK INTO STEPS ── */}
        {screen === "steps" && (
          <Scr>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <Lbl>Step 2 of 3</Lbl>
              <H>Make it tiny</H>
              <Sub>Write 2–4 very small steps to begin.</Sub>
            </div>

            <div style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: "9px 13px", background: T.primaryLight,
              borderRadius: 10, border: `1px solid ${T.primary}28`,
            }}>
              <Dot color={T.primary} />
              <span style={{ fontSize: 14, color: T.primary, fontWeight: 500 }}>{task}</span>
            </div>

            <div style={{ padding: "12px 14px", background: T.sageLight, borderRadius: 12, border: `1px solid ${T.sage}40` }}>
              <span style={{ fontSize: 11, color: T.sage, fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase" }}>
                Example
              </span>
              <p style={{ fontSize: 13, color: "#5A7A70", marginTop: 5, lineHeight: 1.7 }}>
                Clean the kitchen →<br />
                &nbsp;→ Put one plate in the sink<br />
                &nbsp;→ Throw one item away
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {stepList.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <span style={{ fontSize: 12, color: T.light, fontWeight: 600, minWidth: 16, textAlign: "center" }}>
                    {i + 1}
                  </span>
                  <input
                    className={`sinp${s.trim() ? " filled" : ""}`}
                    placeholder={i === 0 ? "First small step…" : i === 1 ? "Second step…" : `Step ${i + 1} (optional)`}
                    value={s}
                    onChange={e => setStepList(p => p.map((v, j) => j === i ? e.target.value : v))}
                  />
                </div>
              ))}
            </div>

            {filledSteps.length >= 1 && (
              <div className="fadein" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Sub style={{ fontSize: 14, fontWeight: 600, color: T.text }}>
                  Which step will you do first?
                </Sub>
                {filledSteps.map((s, i) => {
                  const isSel = stepIdx === i;
                  return (
                    <button key={i} className={`pill${isSel ? " sel" : ""}`} onClick={() => setStepIdx(i)}>
                      <Dot color={isSel ? T.primary : T.border} />
                      <span style={{ fontSize: 14, color: T.text, flex: 1 }}>{s}</span>
                      {isSel && <span style={{ color: T.primary, fontSize: 13, fontWeight: 600 }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                className="btn-p"
                disabled={filledSteps.length === 0}
                onClick={() => {
                  const sel = filledSteps[stepIdx] ?? filledSteps[0] ?? task;
                  setStep(sel);
                  setTimerLabel("Do this now:");
                  mainTimer.reset(120);
                  setScreen("timer");
                }}
              >
                Start 2-minute reset →
              </button>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button className="btn-g" onClick={() => setScreen("task")}>← Back</button>
              </div>
            </div>
          </Scr>
        )}

        {/* ── TIMER ── */}
        {screen === "timer" && (
          <Scr center>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
              <Lbl>Step 3 of 3</Lbl>
              <H style={{ textAlign: "center" }}>2-minute reset</H>
            </div>

            <Ring
              progress={mainTimer.progress} mins={mainTimer.mins}
              secs={mainTimer.secs} run={mainTimer.run} done={mainTimer.done}
            />

            <Card style={{ textAlign: "center", padding: "15px 18px" }}>
              <Lbl style={{ display: "block", marginBottom: 6 }}>{timerLabel}</Lbl>
              <p style={{ fontFamily: "'Lora',serif", fontSize: 18, color: T.text, lineHeight: 1.4, fontStyle: "italic" }}>
                {activeStepRef.current}
              </p>
            </Card>

            {!mainTimer.done && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", alignItems: "center" }}>
                {!mainTimer.run
                  ? <button className="btn-p" onClick={mainTimer.start}>▶ Start</button>
                  : (
                    <div style={{
                      width: "100%", padding: "14px 20px", borderRadius: 14,
                      background: T.sageLight, border: `1px solid ${T.sage}44`,
                      textAlign: "center", fontSize: 15, color: T.sage, fontWeight: 500,
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                    }}>
                      Timer running…
                    </div>
                  )
                }
                <button className="btn-lnk" onClick={() => { mainTimer.pause(); setScreen("stuck"); }}>
                  I still can't start
                </button>
              </div>
            )}

            {mainTimer.done && (
              <div className="fadein" style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
                <Card style={{ padding: "13px 16px", background: T.sageLight, border: `1px solid ${T.sage}40` }}>
                  <p style={{ fontSize: 14, color: "#4A7A6A", textAlign: "center", lineHeight: 1.6 }}>
                    You broke the freeze. That's the hardest part.
                  </p>
                </Card>
                <button className="btn-p" onClick={() => setScreen("continue-pick")}>
                  Continue this step
                </button>
                <button className="btn-s" onClick={goNextStep}>
                  Start next step
                </button>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button className="btn-g" onClick={() => setScreen("done")}>I'm done for now</button>
                </div>
              </div>
            )}
          </Scr>
        )}

        {/* ── STUCK — picker ── */}
        {screen === "stuck" && (
          <Scr>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <H>Still can't start?</H>
              <Sub>Let's make this easier.</Sub>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {[
                { id: "stuck-env",     emoji: "🌿", label: "Change your environment", hint: "A different spot resets your state." },
                { id: "stuck-smaller", emoji: "✂️",  label: "Make it smaller",          hint: "Write an even tinier first action." },
                { id: "stuck-lower",   emoji: "💛",  label: "Lower the standard",       hint: "Allow yourself to do it badly. That's enough." },
              ].map(o => (
                <button key={o.id} className="ocard" onClick={() => setScreen(o.id)}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
                    <span style={{ fontSize: 21 }}>{o.emoji}</span>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 2 }}>{o.label}</p>
                      <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.5 }}>{o.hint}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Scr>
        )}

        {/* ── STUCK — environment ── */}
        {screen === "stuck-env" && (
          <Scr>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <H>Try this now</H>
              <Sub>Stand up, move to a different spot, sit again.</Sub>
            </div>
            <Card style={{ padding: "18px" }}>
              {["Stand up.", "Move to a different spot.", "Sit down again."].map((line, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 0", borderBottom: i < 2 ? `1px solid ${T.border}` : "none",
                }}>
                  <span style={{
                    width: 26, height: 26, borderRadius: "50%",
                    background: T.primaryLight, color: T.primary,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>{i + 1}</span>
                  <span style={{ fontSize: 15, color: T.text }}>{line}</span>
                </div>
              ))}
            </Card>
            <button className="btn-p" onClick={() => goToTimer("In the new spot:")}>
              Start 2-minute reset
            </button>
          </Scr>
        )}

        {/* ── STUCK — make smaller ── */}
        {screen === "stuck-smaller" && (
          <Scr>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <H>What is an even smaller step?</H>
              <Sub>The absolute minimum to begin.</Sub>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <div style={{
                padding: "9px 13px", background: T.primaryLight, borderRadius: 10,
                border: `1px solid ${T.primary}28`, fontSize: 14, color: T.primary, fontWeight: 500,
              }}>
                Current: <em>{activeStepRef.current}</em>
              </div>
              <input
                className="sinp"
                placeholder="Even tinier…"
                value={smallerText}
                onChange={e => setSmallerText(e.target.value)}
                autoFocus
              />
            </div>
            <button
              className="btn-p"
              disabled={!smallerText.trim()}
              onClick={() => {
                const v = smallerText.trim();
                const updated = [...stepList];
                updated[stepIdx] = v;
                setStepList(updated);
                setSmallerText("");
                goToTimer("Tiny step:", v); // pass v so activeStep updates atomically
              }}
            >
              Use this step
            </button>
          </Scr>
        )}

        {/* ── STUCK — lower standard ── */}
        {screen === "stuck-lower" && (
          <Scr center>
            <div style={{ fontSize: 42 }}>💛</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <H style={{ textAlign: "center" }}>You don't need to do this well.</H>
              <Sub style={{ textAlign: "center" }}>
                Just begin — even if it's messy.<br />Imperfect action beats perfect waiting.
              </Sub>
            </div>
            <button className="btn-p" onClick={() => goToTimer("Messy start:")}>
              Try this for 2 minutes
            </button>
          </Scr>
        )}

        {/* ── CONTINUE — pick duration ── */}
        {screen === "continue-pick" && (
          <Scr center>
            <div style={{ fontSize: 40 }}>⚡</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <H style={{ textAlign: "center" }}>Keep the momentum</H>
              <Sub style={{ textAlign: "center" }}>How long do you want to continue?</Sub>
            </div>
            <Card style={{ padding: "14px 16px", textAlign: "center" }}>
              <Lbl style={{ display: "block", marginBottom: 6 }}>Continue:</Lbl>
              <p style={{ fontFamily: "'Lora',serif", fontSize: 16, color: T.text, fontStyle: "italic", lineHeight: 1.4 }}>
                {activeStepRef.current}
              </p>
            </Card>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
              <button className="btn-p" onClick={() => continueWith(120)}>▶ 2 more minutes</button>
              <button className="btn-sage" onClick={() => continueWith(300)}>▶ 5 minutes</button>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button className="btn-g" onClick={() => setScreen("done")}>I'm done for now</button>
              </div>
            </div>
          </Scr>
        )}

        {/* ── CONTINUING — running timer ── */}
        {screen === "continuing" && (
          <Scr center>
            <H style={{ textAlign: "center" }}>Keep going</H>
            <Sub style={{ textAlign: "center" }}>Stay in it. You're doing it.</Sub>

            <Ring
              progress={contTimer.progress} mins={contTimer.mins}
              secs={contTimer.secs} run={contTimer.run} done={contTimer.done}
            />

            <Card style={{ textAlign: "center", padding: "14px 17px" }}>
              <Lbl style={{ display: "block", marginBottom: 6 }}>Continue:</Lbl>
              <p style={{ fontFamily: "'Lora',serif", fontSize: 16, color: T.text, fontStyle: "italic", lineHeight: 1.4 }}>
                {activeStepRef.current}
              </p>
            </Card>

            {!contTimer.done && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button className="btn-g" onClick={() => { contTimer.pause(); setScreen("done"); }}>
                  I'm done for now
                </button>
              </div>
            )}

            {/* Timer done → decision screen (never auto-navigate) */}
            {contTimer.done && (
              <div className="fadein" style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
                <Card style={{ padding: "13px 16px", background: T.sageLight, border: `1px solid ${T.sage}40` }}>
                  <p style={{ fontSize: 14, color: "#4A7A6A", textAlign: "center", lineHeight: 1.6 }}>
                    You broke the freeze. That's the hardest part.
                  </p>
                </Card>
                <button className="btn-p" onClick={() => setScreen("continue-pick")}>
                  Continue this step
                </button>
                <button className="btn-s" onClick={goNextStep}>
                  Start next step
                </button>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button className="btn-g" onClick={() => setScreen("done")}>I'm done for now</button>
                </div>
              </div>
            )}
          </Scr>
        )}

        {/* ── DONE ── */}
        {screen === "done" && (
          <Scr center>
            <div style={{
              width: 64, height: 64, borderRadius: "50%", margin: "0 auto",
              background: "radial-gradient(circle at 38% 36%, #FDF0EC 0%, #E8A598 60%, #C8A4B4 100%)",
              opacity: .72, animation: "corePulse 4s ease-in-out infinite",
              boxShadow: "0 4px 20px rgba(232,165,152,.25)",
            }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <H style={{ textAlign: "center" }}>You broke the freeze.</H>
              <Sub style={{ textAlign: "center" }}>This is proof you can start.</Sub>
            </div>

            <Card style={{ width: "100%", padding: "22px 18px" }}>
              <Lbl style={{ display: "block", textAlign: "center", marginBottom: 14 }}>
                One word: how do you feel?
              </Lbl>
              <input
                className="winp" placeholder="…"
                value={feelWord} onChange={e => setFeelWord(e.target.value)}
                maxLength={20} autoFocus
              />
              {feelWord && (
                <p className="fadein" style={{ marginTop: 12, fontSize: 13, color: T.muted, textAlign: "center", lineHeight: 1.6 }}>
                  You were <em>{feelWord}</em> — and you started anyway.
                </p>
              )}
            </Card>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
              <button className="btn-p" onClick={fullReset}>Start another reset</button>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button className="btn-g" onClick={fullReset}>Close</button>
              </div>
            </div>

            <p style={{ fontSize: 12, color: T.light, textAlign: "center", lineHeight: 1.6 }}>
              every attempt counts — even the ones that feel small
            </p>
          </Scr>
        )}

      </div>
    </div>
  );
}

