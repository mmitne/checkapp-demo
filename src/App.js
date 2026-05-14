import { useState, useEffect } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const LABS_DB = [
  { id: 1, nome: "BioLab São Paulo", bairro: "Pinheiros", cidade: "São Paulo", cep: "05422-030", rating: 4.8, reviews: 312, distancia: 0.8, capacidade: 72, ocupacao: 31, especialidades: ["Hemograma", "Glicemia", "TSH", "PSA", "Urina", "Colesterol"], logoColor: "#0057FF" },
  { id: 2, nome: "Analítica Clínica", bairro: "Consolação", cidade: "São Paulo", cep: "01301-100", rating: 4.6, reviews: 187, distancia: 1.4, capacidade: 55, ocupacao: 22, especialidades: ["Hemograma", "PCR", "Vitamina D", "Ferro", "TSH"], logoColor: "#00C896" },
  { id: 3, nome: "Laboratório Central RJ", bairro: "Botafogo", cidade: "Rio de Janeiro", cep: "22250-040", rating: 4.9, reviews: 541, distancia: 2.1, capacidade: 90, ocupacao: 58, especialidades: ["Hemograma", "Glicemia", "Colesterol", "Cortisol", "Beta HCG"], logoColor: "#FF6B35" },
  { id: 4, nome: "DiagnósticosFast", bairro: "Moema", cidade: "São Paulo", cep: "04077-020", rating: 4.5, reviews: 98, distancia: 3.2, capacidade: 40, ocupacao: 14, especialidades: ["Urina", "Fezes", "PCR", "Glicemia"], logoColor: "#9B59B6" },
  { id: 5, nome: "Citolab Premium", bairro: "Itaim Bibi", cidade: "São Paulo", cep: "04543-906", rating: 4.7, reviews: 224, distancia: 1.9, capacidade: 65, ocupacao: 28, especialidades: ["TSH", "Tireoide", "Hemograma", "PSA", "CEA", "AFP"], logoColor: "#E74C3C" },
  { id: 6, nome: "Analises Clinicas Carlos Chagas", bairro: "Bosque", cidade: "Rio Branco", cep: "69908-650", rating: 4.4, reviews: 76, distancia: 4.5, capacidade: 35, ocupacao: 11, especialidades: ["Hemograma", "Glicemia", "Urina"], logoColor: "#1ABC9C" },
  { id: 7, nome: "UNILAB Diagnósticos", bairro: "Gruta de Lourdes", cidade: "Maceió", cep: "57052-825", rating: 4.3, reviews: 145, distancia: 5.1, capacidade: 50, ocupacao: 19, especialidades: ["Hemograma", "Colesterol", "PCR", "TSH"], logoColor: "#3498DB" },
  { id: 8, nome: "HEMOPAC Centro Diagnóstico", bairro: "Farol", cidade: "Maceió", cep: "57051-380", rating: 4.6, reviews: 203, distancia: 2.8, capacidade: 60, ocupacao: 35, especialidades: ["Hemograma", "Coagulação", "Plaquetas", "Ferritina"], logoColor: "#E67E22" },
];

const EXAMES_POPULARES = [
  { nome: "Hemograma Completo", precoRef: 45, icon: "🩸" },
  { nome: "Glicemia em Jejum", precoRef: 25, icon: "💉" },
  { nome: "TSH (Tireoide)", precoRef: 65, icon: "🦋" },
  { nome: "Colesterol Total + Frações", precoRef: 55, icon: "💊" },
  { nome: "Vitamina D 25-OH", precoRef: 80, icon: "☀️" },
  { nome: "PSA Total", precoRef: 70, icon: "🔬" },
  { nome: "Urina Tipo I (EAS)", precoRef: 30, icon: "🧪" },
  { nome: "PCR (Proteína C-Reativa)", precoRef: 40, icon: "🧬" },
  { nome: "Beta HCG Quantitativo", precoRef: 75, icon: "🤰" },
  { nome: "Ferritina Sérica", precoRef: 60, icon: "⚗️" },
];

const LEILOES_ATIVOS = [
  { id: "LAE-001", paciente: "Maria S.", exames: ["Hemograma Completo", "Glicemia em Jejum"], lances: 4, tempoRestante: 847, melhorLance: 52, precoRef: 70, status: "ativo", cidade: "São Paulo", bairro: "Pinheiros" },
  { id: "LAE-002", paciente: "João M.", exames: ["TSH (Tireoide)", "Vitamina D 25-OH"], lances: 2, tempoRestante: 1240, melhorLance: 118, precoRef: 145, status: "ativo", cidade: "São Paulo", bairro: "Vila Madalena" },
  { id: "LAE-003", paciente: "Ana R.", exames: ["Colesterol Total + Frações", "PCR"], lances: 6, tempoRestante: 320, melhorLance: 68, precoRef: 95, status: "quente", cidade: "Rio de Janeiro", bairro: "Botafogo" },
  { id: "LAE-004", paciente: "Carlos F.", exames: ["PSA Total"], lances: 1, tempoRestante: 2100, melhorLance: 62, precoRef: 70, status: "ativo", cidade: "São Paulo", bairro: "Moema" },
  { id: "LAE-005", paciente: "Lucia P.", exames: ["Beta HCG Quantitativo", "Hemograma Completo", "Ferritina Sérica"], lances: 3, tempoRestante: 560, melhorLance: 142, precoRef: 180, status: "ativo", cidade: "São Paulo", bairro: "Ipiranga" },
];

const METRICAS = {
  totalLabs: 2000, totalLeiloes: 1847, economiaGerada: 482300, ticketMedio: 87, taxaConversao: 73, nps: 68,
  receitaMensal: [42000, 58000, 71000, 89000, 112000, 134000, 158000, 187000, 203000, 241000, 276000, 312000],
  leiloesPorDia: [45, 62, 58, 71, 83, 91, 87, 102, 118, 134, 128, 145, 139, 162],
  ocupacaoLabsAntes: 41, ocupacaoLabsDepois: 68,
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
function pct(occ, cap) { return Math.round((occ / cap) * 100); }
function desconto(melhor, ref) { return Math.round(((ref - melhor) / ref) * 100); }

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Logo({ size = 28 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        width: size, height: size, borderRadius: "30%", background: "linear-gradient(135deg, #00D4FF, #0057FF)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.5, fontWeight: 900, color: "#fff",
        boxShadow: "0 2px 12px rgba(0,87,255,0.4)"
      }}>✓</div>
      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: size * 0.75, letterSpacing: "-0.03em", color: "#0A0E1A" }}>
        Check<span style={{ color: "#0057FF" }}>App</span>
      </span>
    </div>
  );
}

function Badge({ children, color = "#0057FF", bg }) {
  return (
    <span style={{
      background: bg || `${color}18`, color, fontSize: 11, fontWeight: 700, padding: "3px 8px",
      borderRadius: 20, letterSpacing: "0.03em", textTransform: "uppercase"
    }}>{children}</span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, border: "1px solid #F0F2F8",
      boxShadow: "0 2px 20px rgba(0,0,0,0.05)", padding: 24, ...style
    }}>{children}</div>
  );
}

function MiniChart({ data, color = "#0057FF", height = 50 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 200, h = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return `${x},${y}`;
  }).join(" ");
  const area = `0,${h} ${pts} ${w},${h}`;
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`grad-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#grad-${color.replace("#","")})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function Countdown({ seconds, setSeconds }) {
  useEffect(() => {
    const t = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [setSeconds]);
  const urgent = seconds < 300;
  return (
    <span style={{ color: urgent ? "#FF3B30" : "#0057FF", fontWeight: 800, fontFamily: "monospace", fontSize: 14 }}>
      {urgent && "⚡ "}{formatTime(seconds)}
    </span>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────

function LandingPage({ onNavigate }) {
  const [activeAuction, setActiveAuction] = useState(0);
  const [timers, setTimers] = useState(LEILOES_ATIVOS.map(l => l.tempoRestante));

  useEffect(() => {
    const t = setInterval(() => {
      setTimers(prev => prev.map(s => Math.max(0, s - 1)));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#F7F9FF", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0A0E1A 0%, #0D1A3E 50%, #0A2060 100%)",
        padding: "80px 40px 100px", position: "relative", overflow: "hidden"
      }}>
        {/* Decorative orbs */}
        {[
          { w: 400, h: 400, top: -150, right: -100, color: "rgba(0,87,255,0.15)" },
          { w: 250, h: 250, bottom: -80, left: 80, color: "rgba(0,212,255,0.1)" },
        ].map((o, i) => (
          <div key={i} style={{
            position: "absolute", width: o.w, height: o.h, borderRadius: "50%",
            background: `radial-gradient(circle, ${o.color}, transparent)`,
            top: o.top, right: o.right, bottom: o.bottom, left: o.left, pointerEvents: "none"
          }} />
        ))}

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 60 }}>
            <Logo size={36} />
            <div style={{ display: "flex", gap: 12 }}>
              {["Para Pacientes", "Para Laboratórios", "Investidores"].map(label => (
                <button key={label} onClick={() => onNavigate(label === "Para Pacientes" ? "patient" : label === "Para Laboratórios" ? "lab" : "investor")}
                  style={{
                    background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                    color: "#fff", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13,
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                    backdropFilter: "blur(10px)", transition: "all 0.2s"
                  }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <div style={{ marginBottom: 20 }}>
                <Badge color="#00D4FF" bg="rgba(0,212,255,0.15)">🚀 Leilão Reverso em Tempo Real</Badge>
              </div>
              <h1 style={{
                color: "#fff", fontSize: 52, fontFamily: "'Syne', sans-serif", fontWeight: 800,
                lineHeight: 1.1, letterSpacing: "-0.03em", margin: "0 0 20px"
              }}>
                Exames até <span style={{ color: "#00D4FF" }}>60% mais baratos</span> pelo leilão
              </h1>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 17, lineHeight: 1.6, marginBottom: 32 }}>
                Laboratórios competem pelos seus exames em tempo real. Você escolhe o melhor preço, horário e localização. Simples assim.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button onClick={() => onNavigate("patient")} style={{
                  background: "linear-gradient(135deg, #0057FF, #00D4FF)", border: "none",
                  color: "#fff", padding: "14px 28px", borderRadius: 12, cursor: "pointer",
                  fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "0 4px 20px rgba(0,87,255,0.4)"
                }}>Fazer Leilão Agora →</button>
                <button onClick={() => onNavigate("investor")} style={{
                  background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)",
                  color: "#fff", padding: "14px 28px", borderRadius: 12, cursor: "pointer",
                  fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                  backdropFilter: "blur(10px)"
                }}>Ver Dashboard Investidor</button>
              </div>

              {/* Stats */}
              <div style={{ display: "flex", gap: 32, marginTop: 48 }}>
                {[
                  { v: "2.000+", l: "Laboratórios" },
                  { v: "R$482k", l: "Economia gerada" },
                  { v: "73%", l: "Taxa de conversão" },
                ].map(s => (
                  <div key={s.l}>
                    <div style={{ color: "#00D4FF", fontWeight: 800, fontSize: 24, fontFamily: "'Syne', sans-serif" }}>{s.v}</div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Auctions Panel */}
            <div style={{
              background: "rgba(255,255,255,0.05)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.12)",
              padding: 24, backdropFilter: "blur(20px)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>🔴 Leilões ao Vivo</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{LEILOES_ATIVOS.length} ativos agora</span>
              </div>
              {LEILOES_ATIVOS.slice(0, 3).map((l, idx) => (
                <div key={l.id} onClick={() => setActiveAuction(idx)} style={{
                  background: activeAuction === idx ? "rgba(0,87,255,0.2)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${activeAuction === idx ? "rgba(0,87,255,0.5)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 12, padding: "12px 16px", marginBottom: 8, cursor: "pointer",
                  transition: "all 0.2s"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>
                        {l.exames.slice(0, 2).join(" + ")}{l.exames.length > 2 ? ` +${l.exames.length - 2}` : ""}
                      </div>
                      <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, marginTop: 2 }}>{l.bairro}, {l.cidade}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "#00D4FF", fontWeight: 800, fontSize: 16 }}>R$ {l.melhorLance}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, textDecoration: "line-through" }}>R${l.precoRef}</span>
                        <span style={{ color: "#4ADE80", fontSize: 10, fontWeight: 700 }}>-{desconto(l.melhorLance, l.precoRef)}%</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>{l.lances} lances</span>
                    <span style={{ color: timers[LEILOES_ATIVOS.indexOf(l)] < 300 ? "#FF6B6B" : "#FFD93D", fontSize: 10, fontWeight: 700 }}>
                      ⏱ {formatTime(timers[LEILOES_ATIVOS.indexOf(l)])}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 38, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
            Como funciona em <span style={{ color: "#0057FF" }}>3 passos</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {[
            { n: "01", icon: "📋", title: "Envie sua receita", desc: "Foto da receita médica ou digita os exames. Nossa IA extrai tudo automaticamente em segundos.", color: "#0057FF" },
            { n: "02", icon: "⚡", title: "Laboratórios fazem lances", desc: "Laboratórios parceiros próximos a você competem em tempo real pelo seu pedido com preços e horários.", color: "#00C896" },
            { n: "03", icon: "🏆", title: "Você escolhe e agenda", desc: "Escolha o melhor custo-benefício, pague via Pix ou cartão e receba o resultado no app.", color: "#FF6B35" },
          ].map(step => (
            <Card key={step.n} style={{ position: "relative", overflow: "hidden" }}>
              <div style={{
                position: "absolute", top: -10, right: -10, fontSize: 80, fontFamily: "'Syne', sans-serif",
                fontWeight: 900, color: `${step.color}08`, lineHeight: 1
              }}>{step.n}</div>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{step.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, fontFamily: "'Syne', sans-serif" }}>{step.title}</div>
              <div style={{ color: "#666", fontSize: 14, lineHeight: 1.6 }}>{step.desc}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Sections */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div onClick={() => onNavigate("patient")} style={{
          background: "linear-gradient(135deg, #0057FF, #0041CC)", borderRadius: 20, padding: 40,
          cursor: "pointer", transition: "transform 0.2s", color: "#fff"
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>👤</div>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, margin: "0 0 12px" }}>Sou Paciente</h3>
          <p style={{ opacity: 0.8, fontSize: 14, lineHeight: 1.6, margin: "0 0 20px" }}>Faça seus exames com até 60% de desconto. Sem plano de saúde, sem complicação.</p>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Fazer meu primeiro leilão →</span>
        </div>
        <div onClick={() => onNavigate("lab")} style={{
          background: "linear-gradient(135deg, #0A0E1A, #1A2040)", borderRadius: 20, padding: 40,
          cursor: "pointer", transition: "transform 0.2s", color: "#fff"
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔬</div>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, margin: "0 0 12px" }}>Sou Laboratório</h3>
          <p style={{ opacity: 0.8, fontSize: 14, lineHeight: 1.6, margin: "0 0 20px" }}>Preencha horários ociosos e aumente sua receita sem custo fixo. Pague só quando vender.</p>
          <span style={{ fontWeight: 700, fontSize: 14, color: "#00D4FF" }}>Cadastrar meu laboratório →</span>
        </div>
      </div>
    </div>
  );
}

// ─── PATIENT FLOW ─────────────────────────────────────────────────────────────

function PatientFlow({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [selectedExames, setSelectedExames] = useState([]);
  const [ocrDone, setOcrDone] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [, setAuctionLive] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState(null);
  const [lances, setLances] = useState([]);
  const [timer, setTimer] = useState(180);

  const toggleExame = (exame) => {
    setSelectedExames(prev =>
      prev.find(e => e.nome === exame.nome)
        ? prev.filter(e => e.nome !== exame.nome)
        : [...prev, exame]
    );
  };

  const startOCR = () => {
    setScanning(true);
    setTimeout(() => {
      setOcrDone(true);
      setScanning(false);
      setSelectedExames([EXAMES_POPULARES[0], EXAMES_POPULARES[1], EXAMES_POPULARES[3]]);
    }, 2000);
  };

  const launchAuction = () => {
    setStep(3);
    setAuctionLive(true);
    setTimer(180);

    const labsToUse = LABS_DB.filter(l =>
      selectedExames.every(e => l.especialidades.includes(e.nome)) ||
      selectedExames.some(e => l.especialidades.includes(e.nome))
    ).slice(0, 4);

    const precoTotal = selectedExames.reduce((a, e) => a + e.precoRef, 0);

    let delay = 1500;
    labsToUse.forEach((lab, idx) => {
      setTimeout(() => {
        const reducao = 0.55 + Math.random() * 0.25;
        const lance = Math.round(precoTotal * reducao);
        setLances(prev => [...prev, {
          lab, lance, horarios: ["08:00", "10:30", "14:00", "16:30"].filter(() => Math.random() > 0.4),
          destaques: ["Resultado em 24h", "Coleta domiciliar disponível", "Acreditação ISO 15189"].filter(() => Math.random() > 0.5)
        }]);
      }, delay);
      delay += 800 + Math.random() * 700;
    });

    const countdown = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(countdown); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const precoTotal = selectedExames.reduce((a, e) => a + e.precoRef, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#F7F9FF", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #F0F2F8", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Logo size={28} />
        <button onClick={() => onNavigate("home")} style={{ background: "none", border: "1px solid #E0E4F0", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>← Voltar</button>
      </div>

      {/* Progress Steps */}
      <div style={{ background: "#fff", borderBottom: "1px solid #F0F2F8", padding: "20px 40px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", alignItems: "center", gap: 0 }}>
          {[
            { n: 1, l: "Seus Exames" },
            { n: 2, l: "Lançar Leilão" },
            { n: 3, l: "Receber Lances" },
            { n: 4, l: "Confirmar" },
          ].map((s, i) => (
            <div key={s.n} style={{ display: "flex", alignItems: "center", flex: i < 3 ? 1 : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: step >= s.n ? (step === s.n ? "#0057FF" : "#4ADE80") : "#F0F2F8",
                  color: step >= s.n ? "#fff" : "#999", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, transition: "all 0.3s"
                }}>
                  {step > s.n ? "✓" : s.n}
                </div>
                <span style={{ fontSize: 12, fontWeight: step === s.n ? 700 : 400, color: step === s.n ? "#0057FF" : "#999", whiteSpace: "nowrap" }}>{s.l}</span>
              </div>
              {i < 3 && <div style={{ flex: 1, height: 2, background: step > s.n ? "#4ADE80" : "#F0F2F8", margin: "0 8px", transition: "all 0.3s" }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px" }}>

        {/* STEP 1: Select Exams */}
        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, margin: "0 0 8px" }}>Quais exames você precisa?</h2>
            <p style={{ color: "#888", margin: "0 0 24px" }}>Selecione os exames ou envie sua receita médica</p>

            {/* OCR Upload */}
            <Card style={{ marginBottom: 24, border: "2px dashed #E0E4F0", background: scanning ? "#F0F7FF" : ocrDone ? "#F0FFF8" : "#FAFBFF" }}>
              {!ocrDone ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{scanning ? "🔄" : "📄"}</div>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>{scanning ? "Analisando com IA..." : "Envie sua receita médica"}</div>
                  <div style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>Nossa IA extrai os exames automaticamente</div>
                  {!scanning && (
                    <button onClick={startOCR} style={{
                      background: "linear-gradient(135deg, #0057FF, #00D4FF)", color: "#fff",
                      border: "none", padding: "10px 24px", borderRadius: 10, cursor: "pointer",
                      fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans', sans-serif"
                    }}>📸 Simular Upload OCR</button>
                  )}
                  {scanning && (
                    <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{
                          width: 8, height: 8, borderRadius: "50%", background: "#0057FF",
                          animation: `bounce 1s ease-in-out ${i * 0.2}s infinite alternate`
                        }} />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 20 }}>✅</span>
                    <span style={{ fontWeight: 700, color: "#00C896" }}>Receita processada com sucesso</span>
                  </div>
                  <div style={{ color: "#666", fontSize: 13 }}>3 exames identificados e selecionados automaticamente</div>
                </div>
              )}
            </Card>

            {/* Exam Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 24 }}>
              {EXAMES_POPULARES.map(exame => {
                const sel = !!selectedExames.find(e => e.nome === exame.nome);
                return (
                  <div key={exame.nome} onClick={() => toggleExame(exame)} style={{
                    background: sel ? "#F0F7FF" : "#fff", border: `2px solid ${sel ? "#0057FF" : "#F0F2F8"}`,
                    borderRadius: 12, padding: "12px 16px", cursor: "pointer", transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: 10
                  }}>
                    <span style={{ fontSize: 20 }}>{exame.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: sel ? "#0057FF" : "#333" }}>{exame.nome}</div>
                      <div style={{ fontSize: 11, color: "#888" }}>Ref: R$ {exame.precoRef}</div>
                    </div>
                    {sel && <span style={{ color: "#0057FF", fontWeight: 700 }}>✓</span>}
                  </div>
                );
              })}
            </div>

            {selectedExames.length > 0 && (
              <div style={{
                position: "sticky", bottom: 20, background: "#fff", border: "1px solid #F0F2F8",
                borderRadius: 16, padding: 20, boxShadow: "0 8px 40px rgba(0,0,0,0.12)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{selectedExames.length} exame{selectedExames.length > 1 ? "s" : ""} selecionado{selectedExames.length > 1 ? "s" : ""}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>Preço tabela: <span style={{ textDecoration: "line-through" }}>R$ {precoTotal}</span></div>
                  </div>
                  <button onClick={() => setStep(2)} style={{
                    background: "linear-gradient(135deg, #0057FF, #00D4FF)", color: "#fff",
                    border: "none", padding: "12px 24px", borderRadius: 10, cursor: "pointer",
                    fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans', sans-serif"
                  }}>Continuar →</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Launch Auction */}
        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, margin: "0 0 8px" }}>Configurar seu Leilão</h2>
            <p style={{ color: "#888", margin: "0 0 24px" }}>Revise e lance o leilão para os laboratórios próximos</p>

            <Card style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>📋 Exames selecionados</div>
              {selectedExames.map(e => (
                <div key={e.nome} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F8F8F8" }}>
                  <span style={{ fontSize: 14 }}>{e.icon} {e.nome}</span>
                  <span style={{ fontWeight: 600, color: "#888", fontSize: 13, textDecoration: "line-through" }}>R$ {e.precoRef}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "2px solid #F0F2F8" }}>
                <span style={{ fontWeight: 700 }}>Total (tabela)</span>
                <span style={{ fontWeight: 800, color: "#888", textDecoration: "line-through" }}>R$ {precoTotal}</span>
              </div>
            </Card>

            <Card style={{ marginBottom: 20, background: "linear-gradient(135deg, #F0F7FF, #E8F0FF)" }}>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>⚡ Yield Engine — Previsão</div>
              <div style={{ display: "flex", gap: 20 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>Economia esperada</div>
                  <div style={{ fontWeight: 900, fontSize: 28, color: "#0057FF", fontFamily: "'Syne', sans-serif" }}>~{Math.round(30 + Math.random() * 20)}%</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>Labs disponíveis (5km)</div>
                  <div style={{ fontWeight: 900, fontSize: 28, color: "#00C896", fontFamily: "'Syne', sans-serif" }}>{3 + Math.floor(Math.random() * 4)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>Duração do leilão</div>
                  <div style={{ fontWeight: 900, fontSize: 28, color: "#FF6B35", fontFamily: "'Syne', sans-serif" }}>3 min</div>
                </div>
              </div>
              <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(0,87,255,0.08)", borderRadius: 8, fontSize: 12, color: "#0057FF" }}>
                💡 Horário ideal detectado: laboratórios têm alta ociosidade nesse momento
              </div>
            </Card>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(1)} style={{
                background: "#F0F2F8", border: "none", padding: "14px 20px", borderRadius: 10, cursor: "pointer",
                fontWeight: 600, fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: "#666"
              }}>← Voltar</button>
              <button onClick={launchAuction} style={{
                flex: 1, background: "linear-gradient(135deg, #0057FF, #00D4FF)", color: "#fff",
                border: "none", padding: "14px", borderRadius: 10, cursor: "pointer",
                fontWeight: 800, fontSize: 16, fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 4px 20px rgba(0,87,255,0.35)"
              }}>🚀 Lançar Leilão Agora</button>
            </div>
          </div>
        )}

        {/* STEP 3: Live Auction */}
        {step === 3 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, margin: "0 0 4px" }}>Leilão ao Vivo 🔴</h2>
                <p style={{ color: "#888", margin: 0, fontSize: 14 }}>Laboratórios estão fazendo seus lances...</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#888" }}>Encerra em</div>
                <div style={{ fontWeight: 800, fontSize: 24, color: timer < 60 ? "#FF3B30" : "#0057FF", fontFamily: "monospace" }}>
                  {formatTime(timer)}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: 4, background: "#F0F2F8", borderRadius: 2, marginBottom: 24, overflow: "hidden" }}>
              <div style={{
                height: "100%", background: timer < 60 ? "#FF3B30" : "linear-gradient(90deg, #0057FF, #00D4FF)",
                width: `${(timer / 180) * 100}%`, transition: "width 1s linear", borderRadius: 2
              }} />
            </div>

            {lances.length === 0 && (
              <Card style={{ textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📡</div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Aguardando lances...</div>
                <div style={{ color: "#888", fontSize: 13 }}>Laboratórios próximos foram notificados</div>
              </Card>
            )}

            {lances.map((l, idx) => (
              <div key={idx} onClick={() => setSelectedWinner(idx)} style={{
                background: selectedWinner === idx ? "#F0F7FF" : "#fff",
                border: `2px solid ${selectedWinner === idx ? "#0057FF" : idx === 0 ? "#4ADE80" : "#F0F2F8"}`,
                borderRadius: 16, padding: 20, marginBottom: 12, cursor: "pointer",
                transition: "all 0.2s",
                animation: "slideIn 0.4s ease-out"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: `linear-gradient(135deg, ${l.lab.logoColor}, ${l.lab.logoColor}88)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, color: "#fff", fontWeight: 800
                    }}>{l.lab.nome[0]}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{l.lab.nome}</div>
                      <div style={{ color: "#888", fontSize: 12 }}>{l.lab.distancia}km · {l.lab.bairro}</div>
                      <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                        <span style={{ fontSize: 10, color: "#FFB800" }}>{"★".repeat(Math.floor(l.lab.rating))}</span>
                        <span style={{ fontSize: 10, color: "#888" }}>{l.lab.rating} ({l.lab.reviews})</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 900, fontSize: 28, color: "#0057FF", fontFamily: "'Syne', sans-serif" }}>R$ {l.lance}</div>
                    <Badge color="#00C896">-{desconto(l.lance, precoTotal)}% desc.</Badge>
                  </div>
                </div>
                {l.destaques.length > 0 && (
                  <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
                    {l.destaques.map(d => <Badge key={d} color="#666" bg="#F5F5F5">{d}</Badge>)}
                  </div>
                )}
                {l.horarios.length > 0 && (
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <span style={{ fontSize: 11, color: "#888" }}>Horários: </span>
                    {l.horarios.map(h => (
                      <span key={h} style={{ fontSize: 11, fontWeight: 600, background: "#F0F7FF", color: "#0057FF", padding: "2px 6px", borderRadius: 4 }}>{h}</span>
                    ))}
                  </div>
                )}
                {idx === 0 && <div style={{ marginTop: 8 }}><Badge color="#00C896">🏆 Melhor oferta</Badge></div>}
              </div>
            ))}

            {lances.length > 0 && selectedWinner !== null && (
              <button onClick={() => setStep(4)} style={{
                width: "100%", background: "linear-gradient(135deg, #00C896, #00A878)", color: "#fff",
                border: "none", padding: "16px", borderRadius: 12, cursor: "pointer",
                fontWeight: 800, fontSize: 16, fontFamily: "'DM Sans', sans-serif", marginTop: 16,
                boxShadow: "0 4px 20px rgba(0,200,150,0.35)"
              }}>✅ Aceitar Lance de R$ {lances[selectedWinner]?.lance} →</button>
            )}
          </div>
        )}

        {/* STEP 4: Confirmation */}
        {step === 4 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, margin: "0 0 12px" }}>Exame Agendado!</h2>
            <p style={{ color: "#888", marginBottom: 32 }}>Seu leilão foi um sucesso. Você economizou:</p>

            <div style={{
              background: "linear-gradient(135deg, #0057FF, #00D4FF)", borderRadius: 20, padding: 32,
              color: "#fff", marginBottom: 24, display: "inline-block", minWidth: 280
            }}>
              <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Preço tabela</div>
              <div style={{ fontSize: 22, textDecoration: "line-through", opacity: 0.6, fontFamily: "monospace" }}>R$ {precoTotal}</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 12, marginBottom: 4 }}>Você vai pagar</div>
              <div style={{ fontSize: 48, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>
                R$ {lances[selectedWinner]?.lance || Math.round(precoTotal * 0.6)}
              </div>
              <div style={{ marginTop: 8, fontSize: 16, fontWeight: 700, color: "#4ADE80" }}>
                Economia: R$ {precoTotal - (lances[selectedWinner]?.lance || Math.round(precoTotal * 0.6))} ({desconto(lances[selectedWinner]?.lance || Math.round(precoTotal * 0.6), precoTotal)}% off)
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => { setStep(1); setSelectedExames([]); setLances([]); setSelectedWinner(null); setOcrDone(false); }} style={{
                background: "#F0F2F8", border: "none", padding: "12px 24px", borderRadius: 10, cursor: "pointer",
                fontWeight: 600, fontFamily: "'DM Sans', sans-serif"
              }}>Novo Leilão</button>
              <button onClick={() => onNavigate("home")} style={{
                background: "linear-gradient(135deg, #0057FF, #00D4FF)", color: "#fff", border: "none",
                padding: "12px 24px", borderRadius: 10, cursor: "pointer",
                fontWeight: 700, fontFamily: "'DM Sans', sans-serif"
              }}>Voltar ao Início</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── LAB DASHBOARD ────────────────────────────────────────────────────────────

function LabDashboard({ onNavigate }) {
  const lab = LABS_DB[0];
  const [activeTab, setActiveTab] = useState("oportunidades");
  const [bidValue, setBidValue] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#F7F9FF", fontFamily: "'DM Sans', sans-serif", display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: "#0A0E1A", minHeight: "100vh", padding: "24px 0", position: "sticky", top: 0 }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Logo size={24} />
        </div>
        <div style={{ marginTop: 8 }}>
          {[
            { id: "oportunidades", icon: "⚡", label: "Oportunidades" },
            { id: "lances", icon: "🏆", label: "Meus Lances" },
            { id: "agenda", icon: "📅", label: "Agenda" },
            { id: "financeiro", icon: "💰", label: "Financeiro" },
            { id: "perfil", icon: "⚙️", label: "Meu Lab" },
          ].map(item => (
            <div key={item.id} onClick={() => setActiveTab(item.id)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", cursor: "pointer",
              background: activeTab === item.id ? "rgba(0,87,255,0.2)" : "transparent",
              borderLeft: activeTab === item.id ? "3px solid #0057FF" : "3px solid transparent",
              transition: "all 0.15s"
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ color: activeTab === item.id ? "#fff" : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: activeTab === item.id ? 700 : 400 }}>{item.label}</span>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
          <button onClick={() => onNavigate("home")} style={{
            width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.5)", padding: "10px", borderRadius: 8, cursor: "pointer",
            fontSize: 12, fontFamily: "'DM Sans', sans-serif"
          }}>← Sair</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "32px 32px" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, margin: "0 0 4px" }}>
            {activeTab === "oportunidades" ? "⚡ Leilões Disponíveis" :
             activeTab === "lances" ? "🏆 Histórico de Lances" :
             activeTab === "financeiro" ? "💰 Painel Financeiro" : "Dashboard"}
          </h1>
          <p style={{ color: "#888", margin: 0, fontSize: 14 }}>{lab.nome} · {lab.bairro}</p>
        </div>

        {/* Top Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Ocupação Atual", value: `${pct(lab.ocupacao, lab.capacidade)}%`, sub: "Capacidade ociosa disponível", color: "#0057FF", icon: "📊" },
            { label: "Leilões Ganhos", value: "23", sub: "Este mês", color: "#00C896", icon: "🏆" },
            { label: "Receita Extra", value: "R$ 4.820", sub: "Via CheckApp", color: "#FF6B35", icon: "💰" },
            { label: "Horários Livres", value: `${lab.capacidade - lab.ocupacao}`, sub: "Hoje à tarde", color: "#9B59B6", icon: "🕐" },
          ].map(s => (
            <Card key={s.label}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: s.color, fontFamily: "'Syne', sans-serif" }}>{s.value}</div>
              <div style={{ fontWeight: 600, fontSize: 13, marginTop: 2 }}>{s.label}</div>
              <div style={{ color: "#888", fontSize: 11, marginTop: 2 }}>{s.sub}</div>
            </Card>
          ))}
        </div>

        {activeTab === "oportunidades" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontWeight: 700 }}>Leilões próximos de você ({LEILOES_ATIVOS.length})</div>
              <Badge color="#FF3B30" bg="#FF3B3015">🔴 Ao vivo</Badge>
            </div>
            {LEILOES_ATIVOS.map(leilao => (
              <Card key={leilao.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{leilao.exames.join(" + ")}</div>
                    <div style={{ color: "#888", fontSize: 12 }}>{leilao.bairro} · {leilao.lances} lance{leilao.lances !== 1 ? "s" : ""} até agora</div>
                    <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                      <span style={{ fontSize: 11, background: "#F0F7FF", color: "#0057FF", padding: "3px 8px", borderRadius: 6, fontWeight: 600 }}>
                        Melhor lance: R$ {leilao.melhorLance}
                      </span>
                      <span style={{ fontSize: 11, background: "#FFF7F0", color: "#FF6B35", padding: "3px 8px", borderRadius: 6, fontWeight: 600 }}>
                        Ref: R$ {leilao.precoRef}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Encerra em</div>
                    <div style={{ fontWeight: 800, color: leilao.tempoRestante < 300 ? "#FF3B30" : "#0057FF", fontFamily: "monospace", fontSize: 18 }}>
                      {formatTime(leilao.tempoRestante)}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      {bidValue === leilao.id ? (
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <input type="number" defaultValue={leilao.melhorLance - 3}
                            style={{ width: 70, padding: "6px 8px", borderRadius: 8, border: "2px solid #0057FF", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }} />
                          <button onClick={() => setBidValue(null)} style={{
                            background: "#0057FF", color: "#fff", border: "none", padding: "7px 12px",
                            borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif"
                          }}>Dar Lance</button>
                        </div>
                      ) : (
                        <button onClick={() => setBidValue(leilao.id)} style={{
                          background: "linear-gradient(135deg, #0057FF, #00D4FF)", color: "#fff",
                          border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer",
                          fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif"
                        }}>💰 Dar Lance</button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "financeiro" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
              <Card>
                <div style={{ fontWeight: 700, marginBottom: 16 }}>Receita via CheckApp — Últimos 12 meses</div>
                <MiniChart data={METRICAS.receitaMensal.map(v => v / 100)} color="#0057FF" height={80} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                  {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map(m => (
                    <span key={m} style={{ fontSize: 9, color: "#bbb" }}>{m}</span>
                  ))}
                </div>
              </Card>
              <Card>
                <div style={{ fontWeight: 700, marginBottom: 16 }}>Este mês</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: "#0057FF", fontFamily: "'Syne', sans-serif" }}>R$ 4.820</div>
                <div style={{ color: "#00C896", fontSize: 13, fontWeight: 600, marginTop: 4 }}>↑ +34% vs mês anterior</div>
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #F0F2F8" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8 }}>
                    <span style={{ color: "#888" }}>Exames vendidos</span>
                    <span style={{ fontWeight: 700 }}>23</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8 }}>
                    <span style={{ color: "#888" }}>Taxa CheckApp (8%)</span>
                    <span style={{ fontWeight: 700, color: "#888" }}>R$ 386</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span style={{ color: "#888" }}>Repasse líquido</span>
                    <span style={{ fontWeight: 700, color: "#00C896" }}>R$ 4.434</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── INVESTOR DASHBOARD ───────────────────────────────────────────────────────

function InvestorDashboard({ onNavigate }) {
  const [activeSection, setActiveSection] = useState("overview");

  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const maxReceita = Math.max(...METRICAS.receitaMensal);

  return (
    <div style={{ minHeight: "100vh", background: "#0A0E1A", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
      {/* Header */}
      <div style={{
        background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center",
        backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 100
      }}>
        <Logo size={28} />
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Badge color="#4ADE80" bg="rgba(74,222,128,0.15)">🟢 MVP Ao Vivo</Badge>
          <Badge color="#FFB800" bg="rgba(255,184,0,0.15)">Série A — R$800k</Badge>
          <button onClick={() => onNavigate("home")} style={{
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 12,
            fontFamily: "'DM Sans', sans-serif"
          }}>← Sair</button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px" }}>

        {/* Section Nav */}
        <div style={{ display: "flex", gap: 8, marginBottom: 36, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 16 }}>
          {[
            { id: "overview", label: "📊 Overview" },
            { id: "market", label: "🌎 Mercado" },
            { id: "product", label: "⚡ Produto" },
            { id: "model", label: "💰 Modelo" },
            { id: "roadmap", label: "🗺️ Roadmap" },
          ].map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
              background: activeSection === s.id ? "rgba(0,87,255,0.25)" : "transparent",
              border: `1px solid ${activeSection === s.id ? "rgba(0,87,255,0.6)" : "rgba(255,255,255,0.1)"}`,
              color: activeSection === s.id ? "#fff" : "rgba(255,255,255,0.5)",
              padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13,
              fontFamily: "'DM Sans', sans-serif", fontWeight: activeSection === s.id ? 700 : 400,
              transition: "all 0.15s"
            }}>{s.label}</button>
          ))}
        </div>

        {activeSection === "overview" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 38, fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
                A primeira <span style={{ color: "#00D4FF" }}>bolsa de exames</span> do mundo
              </h1>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, margin: 0 }}>Leilão reverso + Yield Management para laboratórios clínicos</p>
            </div>

            {/* KPI Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 28 }}>
              {[
                { v: "2.000", l: "Laboratórios", c: "#00D4FF", i: "🔬" },
                { v: "1.847", l: "Leilões realizados", c: "#4ADE80", i: "⚡" },
                { v: "R$482k", l: "Economia gerada", c: "#FFB800", i: "💰" },
                { v: "R$87", l: "Ticket médio", c: "#FF6B35", i: "🎫" },
                { v: "73%", l: "Conversão", c: "#9B59B6", i: "📈" },
                { v: "NPS 68", l: "Satisfação", c: "#E74C3C", i: "❤️" },
              ].map(k => (
                <div key={k.l} style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14, padding: "16px 12px", textAlign: "center"
                }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{k.i}</div>
                  <div style={{ fontWeight: 900, fontSize: 20, color: k.c, fontFamily: "'Syne', sans-serif" }}>{k.v}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{k.l}</div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>GMV Mensal (R$)</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 20 }}>Crescimento acumulado 12 meses</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100 }}>
                  {METRICAS.receitaMensal.map((v, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{
                        width: "100%", background: i === 11 ? "linear-gradient(0deg, #0057FF, #00D4FF)" : "rgba(0,87,255,0.4)",
                        borderRadius: "4px 4px 0 0", height: `${(v / maxReceita) * 90}px`,
                        transition: "height 0.3s ease"
                      }} />
                      <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>{months[i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Ocupação dos Labs</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 20 }}>Antes vs Depois do CheckApp</div>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-end", height: 100, justifyContent: "center" }}>
                  {[
                    { label: "Antes", value: METRICAS.ocupacaoLabsAntes, color: "rgba(255,107,53,0.6)" },
                    { label: "Depois", value: METRICAS.ocupacaoLabsDepois, color: "rgba(0,87,255,0.8)" },
                  ].map(b => (
                    <div key={b.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{b.value}%</span>
                      <div style={{ width: 40, background: b.color, borderRadius: "4px 4px 0 0", height: `${b.value}px` }} />
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{b.label}</span>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: "center", marginTop: 12, color: "#4ADE80", fontWeight: 700, fontSize: 14 }}>
                  +{METRICAS.ocupacaoLabsDepois - METRICAS.ocupacaoLabsAntes}pp de melhora
                </div>
              </div>
            </div>

            {/* Active auctions table */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
              <div style={{ fontWeight: 700, marginBottom: 16 }}>🔴 Leilões Ativos Agora</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {["ID", "Exames", "Cidade", "Lances", "Melhor Lance", "Desconto", "Encerra em"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LEILOES_ATIVOS.map(l => (
                    <tr key={l.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "10px 12px", fontSize: 12, fontFamily: "monospace", color: "#00D4FF" }}>{l.id}</td>
                      <td style={{ padding: "10px 12px", fontSize: 12 }}>{l.exames.slice(0, 2).join(", ")}{l.exames.length > 2 ? "..." : ""}</td>
                      <td style={{ padding: "10px 12px", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{l.cidade}</td>
                      <td style={{ padding: "10px 12px", fontSize: 12 }}><Badge color="#4ADE80">{l.lances}</Badge></td>
                      <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 700 }}>R$ {l.melhorLance}</td>
                      <td style={{ padding: "10px 12px" }}><Badge color="#00C896">-{desconto(l.melhorLance, l.precoRef)}%</Badge></td>
                      <td style={{ padding: "10px 12px", fontSize: 12, color: l.tempoRestante < 300 ? "#FF6B6B" : "#FFB800", fontFamily: "monospace", fontWeight: 700 }}>
                        {formatTime(l.tempoRestante)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === "market" && (
          <div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, margin: "0 0 8px" }}>Mercado Endereçável</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", margin: "0 0 32px" }}>Brasil + Expansão Global</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
              {[
                { tipo: "TAM", valor: "R$ 180B", desc: "Mercado total de diagnósticos no Brasil + EUA", cor: "#FF6B35" },
                { tipo: "SAM", valor: "R$ 28B", desc: "Pacientes sem plano + plataformas de prescrição digital", cor: "#FFB800" },
                { tipo: "SOM", valor: "R$ 420M", desc: "Mercado capturável com operação em SP/RJ em 3 anos", cor: "#4ADE80" },
              ].map(m => (
                <div key={m.tipo} style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${m.cor}30`, borderRadius: 16, padding: 24 }}>
                  <Badge color={m.cor} bg={`${m.cor}20`}>{m.tipo}</Badge>
                  <div style={{ fontSize: 40, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: m.cor, margin: "12px 0 8px" }}>{m.valor}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.5 }}>{m.desc}</div>
                </div>
              ))}
            </div>

            {/* Competitive Matrix */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
              <div style={{ fontWeight: 700, marginBottom: 16 }}>Análise Competitiva</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {["Empresa", "Modelo de Preço", "Leilão Real-Time", "Asset-Light", "OCR IA", "Yield Mgmt"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { nome: "CheckApp", modelo: "Leilão Reverso", leilao: true, asset: true, ocr: true, yield: true, destaque: true },
                    { nome: "Exmed", modelo: "Preço Fixo", leilao: false, asset: true, ocr: false, yield: false },
                    { nome: "Dr. Consulta", modelo: "Preço Fixo", leilao: false, asset: false, ocr: false, yield: false },
                    { nome: "Labi / Beep", modelo: "Preço Fixo", leilao: false, asset: true, ocr: false, yield: false },
                    { nome: "Doutor123", modelo: "Cotação 24h", leilao: false, asset: true, ocr: false, yield: false },
                  ].map(c => (
                    <tr key={c.nome} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: c.destaque ? "rgba(0,87,255,0.1)" : "transparent" }}>
                      <td style={{ padding: "12px", fontWeight: c.destaque ? 800 : 500, color: c.destaque ? "#00D4FF" : "#fff" }}>{c.nome} {c.destaque ? "✓" : ""}</td>
                      <td style={{ padding: "12px", color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{c.modelo}</td>
                      {[c.leilao, c.asset, c.ocr, c.yield].map((val, i) => (
                        <td key={i} style={{ padding: "12px", textAlign: "center", fontSize: 18 }}>
                          {val ? <span style={{ color: "#4ADE80" }}>✓</span> : <span style={{ color: "rgba(255,255,255,0.15)" }}>✗</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === "product" && (
          <div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, margin: "0 0 32px" }}>Stack Tecnológico</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginBottom: 28 }}>
              {[
                { title: "🤖 OCR Inteligente", desc: "Motor de IA converte receitas médicas em requisições de leilão em < 3 segundos. Suporte a fotos, PDFs, e prescrições digitais (Mevo/Memed).", badge: "Gemini API", color: "#00D4FF" },
                { title: "📉 Yield Engine", desc: "Algoritmo de Step-Down prevê ociosidade dos laboratórios e sugere lances otimizados. Preços caem automaticamente conforme horário ocioso se aproxima.", badge: "Proprietário", color: "#4ADE80" },
                { title: "⚡ Leilão Real-Time", desc: "WebSockets garantem atualizações em < 100ms. Laboratorios recebem alertas georreferenciados para leilões no raio de 5km.", badge: "WebSocket", color: "#FFB800" },
                { title: "💊 Base 2.000 Labs", desc: "Rede mapeada com dados de CEP, especialidades e histórico de preços. Algoritmo de match por proximidade, disponibilidade e reputação.", badge: "2.000 registros", color: "#FF6B35" },
              ].map(f => (
                <div key={f.title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
                  <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, fontFamily: "'Syne', sans-serif" }}>{f.title}</div>
                  <Badge color={f.color} bg={`${f.color}20`}>{f.badge}</Badge>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.7, marginTop: 12, marginBottom: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Network Effect */}
            <div style={{ background: "rgba(0,87,255,0.1)", border: "1px solid rgba(0,87,255,0.3)", borderRadius: 16, padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>🔁 Efeito de Rede — O Moat Principal</div>
              <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                <div style={{ flex: 1, color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.7 }}>
                  Quanto mais laboratórios entram → menores os preços → mais pacientes usam → mais leilões → mais receita para os labs → mais labs entram. <br/><br/>
                  Uma vez estabelecido o ecossistema em uma cidade, o custo de replicação para um concorrente é proibitivo.
                </div>
                <div style={{ textAlign: "center", padding: 20, background: "rgba(0,87,255,0.2)", borderRadius: 12, minWidth: 160 }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Break-even estimado</div>
                  <div style={{ fontWeight: 900, fontSize: 32, color: "#00D4FF", fontFamily: "'Syne', sans-serif" }}>180</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>labs ativos por cidade</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "model" && (
          <div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, margin: "0 0 32px" }}>Modelo de Negócio</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginBottom: 28 }}>
              {[
                { n: "B2C", title: "Take-Rate por Transação", desc: "8% sobre cada exame transacionado. Zero custo fixo para o paciente acessar o serviço.", receita: "R$ 7/transação em média", color: "#0057FF" },
                { n: "B2B-A", title: "SaaS para Convênios", desc: "Planos de saúde não verticalizados usam a plataforma para otimizar custos de exames.", receita: "R$ 2.500/mês por convênio", color: "#00C896" },
                { n: "B2B-B", title: "SaaS para Labs", desc: "Laboratórios premium pagam para ter ferramentas avançadas de precificação e analytics.", receita: "R$ 390/mês por lab", color: "#FF6B35" },
                { n: "B2B-C", title: "Saúde Ocupacional", desc: "Empresas gerenciam os exames periódicos de seus colaboradores com relatórios consolidados.", receita: "R$ 8.000/empresa/ano", color: "#9B59B6" },
              ].map(m => (
                <div key={m.n} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${m.color}30`, borderRadius: 16, padding: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <Badge color={m.color} bg={`${m.color}20`}>{m.n}</Badge>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>{m.title}</span>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.6, margin: "0 0 12px" }}>{m.desc}</p>
                  <div style={{ padding: "8px 12px", background: `${m.color}15`, borderRadius: 8, fontSize: 12, fontWeight: 700, color: m.color }}>
                    💰 {m.receita}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial projections */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Projeções Financeiras (com investimento R$800k)</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["", "Ano 1", "Ano 2", "Ano 3"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: h === "" ? "left" : "right", fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { metric: "GMV (R$)", values: ["R$ 3.8M", "R$ 18M", "R$ 62M"] },
                    { metric: "Receita Líquida", values: ["R$ 380k", "R$ 1.8M", "R$ 6.2M"] },
                    { metric: "Labs Ativos", values: ["450", "1.200", "2.000+"] },
                    { metric: "Leilões/mês", values: ["2.400", "12.000", "48.000"] },
                    { metric: "Margem Bruta", values: ["62%", "71%", "78%"] },
                  ].map((r, i) => (
                    <tr key={r.metric} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{r.metric}</td>
                      {r.values.map((v, j) => (
                        <td key={j} style={{ padding: "12px 16px", textAlign: "right", fontSize: 13, fontWeight: j === 2 ? 800 : 500, color: j === 2 ? "#4ADE80" : "#fff" }}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === "roadmap" && (
          <div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, margin: "0 0 32px" }}>Roadmap & Uso do Capital</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
              {[
                { fase: "Fase 1 · Q3 2026", titulo: "MVP Brasil", cor: "#4ADE80", items: ["Lançamento SP + RJ", "450 labs onboardados", "Integração Mevo/Memed", "App iOS + Android", "Payment via Pix/Cartão"], status: "Em andamento" },
                { fase: "Fase 2 · Q1 2027", titulo: "Escala Nacional", cor: "#00D4FF", items: ["Expansão 10 cidades BR", "API LIS (sistemas de labs)", "B2B planos de saúde", "Yield Engine v2", "1.200 labs ativos"], status: "Planejado" },
                { fase: "Fase 3 · Q3 2027", titulo: "Expansão Global", cor: "#FFB800", items: ["Soft launch EUA (FL/TX)", "América Latina (MX, CO)", "Cash-pay patients EUA", "Truck Labs integration", "20M pacientes alcançados"], status: "Visão" },
              ].map(f => (
                <div key={f.fase} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${f.cor}30`, borderRadius: 16, padding: 24 }}>
                  <Badge color={f.cor} bg={`${f.cor}20`}>{f.status}</Badge>
                  <div style={{ fontWeight: 700, fontSize: 15, margin: "12px 0 4px" }}>{f.titulo}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginBottom: 16 }}>{f.fase}</div>
                  {f.items.map(item => (
                    <div key={item} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: f.cor, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Capital Allocation */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
                <div style={{ fontWeight: 700, marginBottom: 16 }}>💰 Uso do Capital — R$800k</div>
                {[
                  { item: "Tecnologia & Produto", pct: 45, cor: "#0057FF" },
                  { item: "Vendas B2B & Growth", pct: 30, cor: "#00C896" },
                  { item: "Operações & Jurídico", pct: 15, cor: "#FFB800" },
                  { item: "Reserva", pct: 10, cor: "#888" },
                ].map(u => (
                  <div key={u.item} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                      <span style={{ color: "rgba(255,255,255,0.7)" }}>{u.item}</span>
                      <span style={{ fontWeight: 700, color: u.cor }}>{u.pct}%</span>
                    </div>
                    <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3 }}>
                      <div style={{ height: "100%", width: `${u.pct}%`, background: u.cor, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
                <div style={{ fontWeight: 700, marginBottom: 16 }}>📬 Contato para Investidores</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.8, marginBottom: 20 }}>
                  Buscamos R$800k para 18 meses de operação focados em:<br/>
                  • Aquisição dos primeiros 450 labs ativos<br/>
                  • Escala para 2 cidades (SP + RJ)<br/>
                  • Break-even operacional projetado: Mês 14
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button style={{
                    flex: 1, background: "linear-gradient(135deg, #0057FF, #00D4FF)",
                    border: "none", color: "#fff", padding: "12px", borderRadius: 10, cursor: "pointer",
                    fontWeight: 700, fontFamily: "'DM Sans', sans-serif", fontSize: 13
                  }}>📧 Solicitar Pitch Deck</button>
                  <button onClick={() => onNavigate("patient")} style={{
                    flex: 1, background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "12px", borderRadius: 10,
                    cursor: "pointer", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", fontSize: 13
                  }}>🚀 Ver Demo Ao Vivo</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-6px); } }
      `}</style>
      {page === "home" && <LandingPage onNavigate={setPage} />}
      {page === "patient" && <PatientFlow onNavigate={setPage} />}
      {page === "lab" && <LabDashboard onNavigate={setPage} />}
      {page === "investor" && <InvestorDashboard onNavigate={setPage} />}
    </>
  );
}
