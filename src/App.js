import { useState, useEffect } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg: "#F8FAFB",
  surface: "#FFFFFF",
  border: "#E4EAF0",
  borderLight: "#F0F4F8",
  text: "#0D1B2A",
  textMid: "#4A5568",
  textLight: "#8A9BB0",
  blue: "#005EB8",
  blueLight: "#E8F0FB",
  blueMid: "#1976D2",
  teal: "#00897B",
  tealLight: "#E0F2F1",
  red: "#D32F2F",
  redLight: "#FFEBEE",
  green: "#2E7D32",
  greenLight: "#E8F5E9",
  amber: "#F57F17",
  amberLight: "#FFFDE7",
  shadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
  shadowMd: "0 2px 8px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06)",
};

const LABS_MOCK = [
  { id: 1, nome: "Fleury Medicina e Saúde", bairro: "Paraíso", cidade: "São Paulo", rating: 4.9, reviews: 1240, distancia: 0.8, capacidade: 80, ocupacao: 35, acreditacao: "ISO 15189", logoColor: "#005EB8" },
  { id: 2, nome: "DASA Diagnósticos da América", bairro: "Vila Mariana", cidade: "São Paulo", rating: 4.7, reviews: 876, distancia: 1.4, capacidade: 65, ocupacao: 28, acreditacao: "CAP", logoColor: "#00897B" },
  { id: 3, nome: "Grupo Hermes Pardini", bairro: "Saúde", cidade: "São Paulo", rating: 4.6, reviews: 543, distancia: 2.1, capacidade: 55, ocupacao: 18, acreditacao: "ISO 15189", logoColor: "#1976D2" },
  { id: 4, nome: "CDB Centro de Diagnósticos Brasil", bairro: "Moema", cidade: "São Paulo", rating: 4.5, reviews: 312, distancia: 2.8, capacidade: 40, ocupacao: 12, acreditacao: "PALC", logoColor: "#6A1B9A" },
  { id: 5, nome: "Sabin Medicina Diagnóstica", bairro: "Brooklin", cidade: "São Paulo", rating: 4.8, reviews: 698, distancia: 3.5, capacidade: 70, ocupacao: 31, acreditacao: "ISO 15189", logoColor: "#BF360C" },
];

const EXAMES_DB = [
  "Hemograma Completo","Glicemia em Jejum","TSH Ultrassensível","T4 Livre",
  "Colesterol Total e Frações","Triglicerídeos","HDL Colesterol","LDL Colesterol",
  "Vitamina D 25-OH","Vitamina B12","Ferritina Sérica","Ferro Sérico",
  "PCR Proteína C-Reativa","VHS","TGO AST","TGP ALT",
  "Gama GT","Fosfatase Alcalina","Bilirrubinas Totais e Frações",
  "Ureia","Creatinina","Ácido Úrico","Sódio","Potássio",
  "PSA Total","PSA Livre","CEA","CA 19-9","AFP",
  "Beta HCG Quantitativo","Progesterona","Estradiol","FSH","LH",
  "Testosterona Total","Prolactina","Cortisol","Insulina em Jejum",
  "Urina Tipo I EAS","Urocultura","Parasitológico de Fezes","Coprocultura",
  "INR Tempo de Protrombina","TTPA","Plaquetas","Reticulócitos",
];

const LEILOES_MOCK = [
  { id: "LAE-2847", exames: ["Hemograma Completo","Glicemia em Jejum","Colesterol Total e Frações"], lances: 5, timer: 743, melhorLance: 89, precoRef: 125, cidade: "São Paulo", bairro: "Pinheiros" },
  { id: "LAE-2848", exames: ["TSH Ultrassensível","T4 Livre","Vitamina D 25-OH"], lances: 3, timer: 1240, melhorLance: 118, precoRef: 165, cidade: "São Paulo", bairro: "Vila Mariana" },
  { id: "LAE-2849", exames: ["PSA Total","PSA Livre"], lances: 2, timer: 380, melhorLance: 98, precoRef: 130, cidade: "Rio de Janeiro", bairro: "Botafogo" },
  { id: "LAE-2850", exames: ["Beta HCG Quantitativo","Hemograma Completo","Ferritina Sérica"], lances: 4, timer: 560, melhorLance: 142, precoRef: 190, cidade: "São Paulo", bairro: "Ipiranga" },
];

function fmt(s) { const m = Math.floor(s / 60); return `${m}:${(s % 60).toString().padStart(2, "0")}`; }
function disc(a, b) { return Math.round(((b - a) / b) * 100); }
function pct(a, b) { return Math.round((a / b) * 100); }

function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`,
      boxShadow: C.shadow, ...style, cursor: onClick ? "pointer" : "default"
    }}>{children}</div>
  );
}

function Btn({ children, variant = "primary", onClick, disabled, style = {}, size = "md" }) {
  const pad = size === "sm" ? "7px 14px" : size === "lg" ? "14px 28px" : "10px 20px";
  const fs = size === "sm" ? 13 : size === "lg" ? 15 : 14;
  const base = {
    border: "none", borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: fs,
    padding: pad, transition: "all 0.15s", opacity: disabled ? 0.5 : 1, ...style
  };
  const variants = {
    primary: { background: C.blue, color: "#fff", boxShadow: `0 2px 8px ${C.blue}40` },
    secondary: { background: C.blueLight, color: C.blue },
    ghost: { background: "transparent", color: C.textMid, border: `1px solid ${C.border}` },
    success: { background: C.greenLight, color: C.green },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>{children}</button>;
}

function Tag({ children, color = C.blue, bg }) {
  return (
    <span style={{
      background: bg || `${color}18`, color, fontSize: 11, fontWeight: 600,
      padding: "3px 8px", borderRadius: 20, whiteSpace: "nowrap", display: "inline-block"
    }}>{children}</span>
  );
}

function Divider() { return <div style={{ height: 1, background: C.borderLight, margin: "16px 0" }} />; }

function LabInitial({ nome, color, size = 44 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 10, flexShrink: 0,
      background: `${color}18`, border: `1px solid ${color}30`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.4, fontWeight: 800, color, fontFamily: "'Syne', sans-serif"
    }}>{nome[0]}</div>
  );
}

function Stars({ rating }) {
  return (
    <span style={{ fontSize: 11, color: C.amber }}>
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
      <span style={{ color: C.textLight, marginLeft: 4 }}>{rating}</span>
    </span>
  );
}

function Header({ page, onNavigate }) {
  return (
    <header style={{
      background: C.surface, borderBottom: `1px solid ${C.border}`,
      padding: "0 40px", height: 64, display: "flex", alignItems: "center",
      justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <div onClick={() => onNavigate("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: C.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#fff", fontWeight: 900 }}>✓</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: C.text, letterSpacing: "-0.02em" }}>Check<span style={{ color: C.blue }}>App</span></span>
        </div>
        <nav style={{ display: "flex", gap: 4 }}>
          {[
            { id: "home", label: "Início" },
            { id: "patient", label: "Para Pacientes" },
            { id: "lab", label: "Para Laboratórios" },
            { id: "investor", label: "Investidores" },
          ].map(item => (
            <button key={item.id} onClick={() => onNavigate(item.id)} style={{
              background: page === item.id ? C.blueLight : "transparent",
              color: page === item.id ? C.blue : C.textMid,
              border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer",
              fontSize: 13, fontWeight: page === item.id ? 700 : 500,
              fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s"
            }}>{item.label}</button>
          ))}
        </nav>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Tag color={C.green} bg={C.greenLight}>● Ao vivo</Tag>
        <Btn variant="primary" size="sm" onClick={() => onNavigate("patient")}>Fazer Exame</Btn>
      </div>
    </header>
  );
}

function HomePage({ onNavigate }) {
  const [timers, setTimers] = useState(LEILOES_MOCK.map(l => l.timer));
  useEffect(() => {
    const t = setInterval(() => setTimers(p => p.map(s => Math.max(0, s - 1))), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <div style={{ background: "linear-gradient(160deg, #001F4D 0%, #003A8C 60%, #005EB8 100%)", padding: "80px 40px 100px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 64, alignItems: "center" }}>
            <div>
              <div style={{ marginBottom: 20 }}>
                <Tag color="#00BCD4" bg="rgba(0,188,212,0.15)">Leilão Reverso · Medicina Diagnóstica</Tag>
              </div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 48, fontWeight: 800, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.03em", margin: "0 0 20px" }}>
                Exames laboratoriais com <span style={{ color: "#64B5F6" }}>até 60% de economia</span>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 17, lineHeight: 1.7, margin: "0 0 36px", maxWidth: 480 }}>
                Laboratórios parceiros competem pelo seu pedido médico em tempo real. Você escolhe o melhor preço, horário e localização.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <Btn size="lg" onClick={() => onNavigate("patient")} style={{ background: "#fff", color: C.blue, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                  Enviar Pedido Médico →
                </Btn>
                <Btn size="lg" onClick={() => onNavigate("investor")} style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", boxShadow: "none" }}>
                  Ver Dashboard
                </Btn>
              </div>
              <div style={{ display: "flex", gap: 40, marginTop: 48 }}>
                {[{ v: "2.000+", l: "Laboratórios credenciados" }, { v: "R$482k", l: "Economia gerada" }, { v: "73%", l: "Taxa de conversão" }].map(s => (
                  <div key={s.l}>
                    <div style={{ color: "#fff", fontWeight: 800, fontSize: 22, fontFamily: "'Syne', sans-serif" }}>{s.v}</div>
                    <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <Card style={{ overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)" }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: C.text }}>Leilões em andamento</span>
                <Tag color={C.red} bg={C.redLight}>● {LEILOES_MOCK.length} ativos</Tag>
              </div>
              <div style={{ padding: 12 }}>
                {LEILOES_MOCK.map((l, i) => (
                  <div key={l.id} onClick={() => onNavigate("patient")} style={{
                    padding: 12, borderRadius: 8, marginBottom: 6, cursor: "pointer",
                    background: i === 0 ? C.blueLight : C.bg,
                    border: `1px solid ${i === 0 ? C.blue + "30" : C.borderLight}`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {l.exames.slice(0, 2).join(" · ")}{l.exames.length > 2 ? ` +${l.exames.length - 2}` : ""}
                        </div>
                        <div style={{ fontSize: 11, color: C.textLight }}>{l.bairro} · {l.lances} lances</div>
                      </div>
                      <div style={{ textAlign: "right", marginLeft: 12 }}>
                        <div style={{ fontWeight: 800, fontSize: 16, color: C.blue }}>R$ {l.melhorLance}</div>
                        <Tag color={C.green} bg={C.greenLight}>-{disc(l.melhorLance, l.precoRef)}%</Tag>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: timers[i] < 300 ? C.red : C.amber, fontFamily: "monospace" }}>⏱ {fmt(timers[i])}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}` }}>
                <Btn style={{ width: "100%" }} onClick={() => onNavigate("patient")}>Iniciar meu leilão →</Btn>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.blue, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>PROCESSO</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 34, fontWeight: 800, margin: 0, color: C.text, letterSpacing: "-0.02em" }}>Do pedido médico ao resultado em 3 passos</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {[
            { n: "01", icon: "🔍", title: "IA lê seu pedido", desc: "Fotografe ou envie o PDF do seu pedido médico. Nossa IA extrai todos os exames automaticamente.", color: C.blue },
            { n: "02", icon: "⚡", title: "Laboratórios competem", desc: "Laboratórios credenciados próximos ao seu CEP fazem lances em tempo real pelo seu pedido.", color: C.teal },
            { n: "03", icon: "✅", title: "Você escolhe e agenda", desc: "Compare preço, distância e avaliações. Confirme com Pix e receba o resultado no app.", color: C.green },
          ].map(s => (
            <Card key={s.n} style={{ padding: 28 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${s.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>{s.icon}</div>
              <Tag color={s.color} bg={`${s.color}12`}>Passo {s.n}</Tag>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, margin: "10px 0 8px", color: C.text }}>{s.title}</h3>
              <p style={{ color: C.textMid, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card onClick={() => onNavigate("patient")} style={{ padding: 36, background: C.blue, border: "none", cursor: "pointer" }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>👤</div>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, margin: "0 0 10px", color: "#fff" }}>Sou Paciente</h3>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.6, margin: "0 0 20px" }}>Envie seu pedido médico e receba propostas de laboratórios credenciados próximos a você.</p>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Começar agora →</span>
        </Card>
        <Card onClick={() => onNavigate("lab")} style={{ padding: 36, background: "linear-gradient(135deg, #001F4D, #003A8C)", border: "none", cursor: "pointer" }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>🔬</div>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, margin: "0 0 10px", color: "#fff" }}>Sou Laboratório</h3>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.6, margin: "0 0 20px" }}>Preencha sua capacidade ociosa com novos pacientes. Zero custo fixo.</p>
          <span style={{ color: "#64B5F6", fontWeight: 700, fontSize: 14 }}>Cadastrar laboratório →</span>
        </Card>
      </div>
    </div>
  );
}

function PatientFlow({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [cep, setCep] = useState("");
  const [cepData, setCepData] = useState(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");
  const [selectedExames, setSelectedExames] = useState([]);
  const [ocrState, setOcrState] = useState("idle");
  const [ocrResult, setOcrResult] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [lances, setLances] = useState([]);
  const [timer, setTimer] = useState(180);
  const [selectedLance, setSelectedLance] = useState(null);
  const [exameQuery, setExameQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [auctionStarted, setAuctionStarted] = useState(false);

  const buscarCep = async (valor) => {
    const limpo = valor.replace(/\D/g, "");
    if (limpo.length !== 8) return;
    setCepLoading(true); setCepError("");
    try {
      const res = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
      const data = await res.json();
      if (data.erro) { setCepError("CEP não encontrado."); setCepData(null); }
      else setCepData(data);
    } catch { setCepError("Erro ao buscar CEP."); }
    setCepLoading(false);
  };

  const handleCepChange = (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 8);
    if (v.length > 5) v = v.slice(0, 5) + "-" + v.slice(5);
    setCep(v);
    if (v.replace(/\D/g, "").length === 8) buscarCep(v);
  };

  const processarImagem = async (file) => {
    // Mostra preview imediatamente
    const reader = new FileReader();
    reader.onload = (e) => setUploadedImage(e.target.result);
    reader.readAsDataURL(file);

    setOcrState("processing");
    try {
      // Envia para o backend real no Render
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("https://checkapp-cz9a.onrender.com/ocr", {
        method: "POST",
        body: formData,
      });
      const resultado = await res.json();
      if (resultado.erro) {
        setOcrState("error");
        setOcrResult(resultado.erro);
        return;
      }
      setSelectedExames(resultado.exames || []);
      setOcrState("done");
      setOcrResult(`${(resultado.exames || []).length} exame(s) identificado(s)`);
    } catch {
      setOcrState("error");
      setOcrResult("Não foi possível processar. Adicione os exames manualmente.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processarImagem(file);
  };

  const launchAuction = () => {
    if (auctionStarted) return;
    setAuctionStarted(true);
    const precoTotal = selectedExames.length * 38 + 20;
    let delay = 1200;
    LABS_MOCK.slice(0, 4).forEach(lab => {
      setTimeout(() => {
        const lance = Math.round(precoTotal * (0.52 + Math.random() * 0.28));
        setLances(prev => [...prev, { lab, lance, horarios: ["08:00","10:00","14:00","16:30"].filter(() => Math.random() > 0.4) }]);
      }, delay);
      delay += 700 + Math.random() * 800;
    });
    const cd = setInterval(() => setTimer(t => { if (t <= 1) { clearInterval(cd); return 0; } return t - 1; }), 1000);
  };

  useEffect(() => { if (step === 3) launchAuction(); }, [step]);

  const examesFiltrados = EXAMES_DB.filter(e => e.toLowerCase().includes(exameQuery.toLowerCase()) && !selectedExames.includes(e)).slice(0, 6);
  const precoRef = selectedExames.length * 38 + 20;
  const steps = ["Localização", "Exames", "Leilão", "Confirmação"];

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "20px 40px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", alignItems: "center" }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", background: step > i + 1 ? C.green : step === i + 1 ? C.blue : C.borderLight, color: step >= i + 1 ? "#fff" : C.textLight, transition: "all 0.3s" }}>{step > i + 1 ? "✓" : i + 1}</div>
                <span style={{ fontSize: 13, fontWeight: step === i + 1 ? 700 : 400, color: step === i + 1 ? C.blue : C.textLight, whiteSpace: "nowrap" }}>{s}</span>
              </div>
              {i < steps.length - 1 && <div style={{ flex: 1, height: 2, margin: "0 10px", background: step > i + 1 ? C.green : C.borderLight, transition: "all 0.3s" }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>

        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, margin: "0 0 6px", color: C.text }}>Qual é a sua localização?</h2>
            <p style={{ color: C.textMid, margin: "0 0 28px" }}>Usamos seu CEP para encontrar laboratórios parceiros próximos.</p>
            <Card style={{ padding: 28, marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>CEP</label>
              <input value={cep} onChange={handleCepChange} placeholder="00000-000"
                style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${cepError ? C.red : cepData ? C.green : C.border}`, fontSize: 16, fontFamily: "monospace", fontWeight: 600, outline: "none", background: C.surface, color: C.text, boxSizing: "border-box" }}
              />
              {cepLoading && <div style={{ marginTop: 8, color: C.textLight, fontSize: 13 }}>Buscando...</div>}
              {cepError && <div style={{ marginTop: 8, color: C.red, fontSize: 13 }}>⚠ {cepError}</div>}
              {cepData && (
                <div style={{ marginTop: 16, padding: "14px 16px", background: C.greenLight, borderRadius: 8, border: `1px solid ${C.green}30` }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 18 }}>📍</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{cepData.logradouro || "Endereço"}{cepData.bairro ? `, ${cepData.bairro}` : ""}</div>
                      <div style={{ fontSize: 13, color: C.textMid }}>{cepData.localidade} — {cepData.uf}</div>
                    </div>
                  </div>
                  <Divider />
                  <div style={{ fontSize: 13, color: C.textMid }}>🔬 <strong>{LABS_MOCK.length} laboratórios parceiros</strong> encontrados a até 6km</div>
                </div>
              )}
            </Card>

            {cepData && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.textMid, marginBottom: 12 }}>Laboratórios próximos</div>
                {LABS_MOCK.slice(0, 3).map(lab => (
                  <Card key={lab.id} style={{ padding: "14px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                    <LabInitial nome={lab.nome} color={lab.logoColor} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{lab.nome}</div>
                      <div style={{ fontSize: 12, color: C.textLight }}>{lab.distancia}km · {lab.bairro}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Stars rating={lab.rating} />
                      <div style={{ marginTop: 4 }}><Tag color={C.blue} bg={C.blueLight}>{lab.acreditacao}</Tag></div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <Btn size="lg" onClick={() => setStep(2)} disabled={!cepData} style={{ width: "100%" }}>Continuar →</Btn>
            {!cepData && (
              <div style={{ textAlign: "center", marginTop: 12 }}>
                <button onClick={() => setStep(2)} style={{ background: "none", border: "none", color: C.textLight, fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>Pular e continuar sem CEP</button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, margin: "0 0 6px", color: C.text }}>Quais exames você precisa?</h2>
            <p style={{ color: C.textMid, margin: "0 0 24px" }}>Envie seu pedido médico ou adicione os exames manualmente.</p>

            <Card style={{ marginBottom: 20, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.borderLight}`, display: "flex", alignItems: "center", gap: 8 }}>
                <span>🤖</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>Leitura automática por IA</span>
                <Tag color={C.blue} bg={C.blueLight}>Recomendado</Tag>
              </div>

              {ocrState === "idle" && (
                <label style={{ display: "block", cursor: "pointer" }}>
                  <input type="file" accept="image/*,.pdf" onChange={handleFileChange} style={{ display: "none" }} />
                  <div style={{ padding: "32px", textAlign: "center", margin: 16, borderRadius: 10, border: `2px dashed ${C.border}`, background: C.bg }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
                    <div style={{ fontWeight: 600, color: C.text, marginBottom: 6 }}>Clique para enviar o pedido médico</div>
                    <div style={{ color: C.textLight, fontSize: 13 }}>JPG, PNG ou PDF · A IA extrai os exames automaticamente</div>
                  </div>
                </label>
              )}

              {(ocrState === "uploading" || ocrState === "processing") && (
                <div style={{ padding: "32px", textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{ocrState === "uploading" ? "📤" : "🔍"}</div>
                  <div style={{ fontWeight: 600, color: C.text, marginBottom: 6 }}>{ocrState === "uploading" ? "Enviando..." : "IA analisando pedido médico..."}</div>
                  <div style={{ color: C.textLight, fontSize: 13 }}>Aguarde alguns segundos</div>
                </div>
              )}

              {ocrState === "done" && (
                <div style={{ padding: 20 }}>
                  {uploadedImage && <img src={uploadedImage} alt="Pedido" style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 8, marginBottom: 12 }} />}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: C.greenLight, borderRadius: 8 }}>
                    <span>✅</span><span style={{ fontWeight: 600, color: C.green, fontSize: 14 }}>{ocrResult}</span>
                  </div>
                </div>
              )}

              {ocrState === "error" && (
                <div style={{ padding: 20 }}>
                  <div style={{ padding: "10px 14px", background: C.amberLight, borderRadius: 8, marginBottom: 12, fontSize: 13, color: C.amber }}>⚠️ {ocrResult}</div>
                  <label style={{ cursor: "pointer" }}>
                    <input type="file" accept="image/*,.pdf" onChange={handleFileChange} style={{ display: "none" }} />
                    <Btn variant="ghost" size="sm">Tentar novamente</Btn>
                  </label>
                </div>
              )}
            </Card>

            <Card style={{ padding: 20, marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 12 }}>Adicionar exames manualmente</div>
              <div style={{ position: "relative" }}>
                <input value={exameQuery} onChange={e => { setExameQuery(e.target.value); setShowSuggestions(true); }} onFocus={() => setShowSuggestions(true)} placeholder="Digite o nome do exame..."
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" }}
                />
                {showSuggestions && exameQuery && examesFiltrados.length > 0 && (
                  <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: C.shadowMd, zIndex: 50, marginTop: 4 }}>
                    {examesFiltrados.map(e => (
                      <div key={e} onClick={() => { setSelectedExames(prev => [...prev, e]); setExameQuery(""); setShowSuggestions(false); }}
                        style={{ padding: "10px 14px", fontSize: 14, cursor: "pointer", borderBottom: `1px solid ${C.borderLight}`, color: C.text }}
                        onMouseEnter={ev => ev.currentTarget.style.background = C.bg}
                        onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}
                      >{e}</div>
                    ))}
                  </div>
                )}
              </div>
              {selectedExames.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 12, color: C.textLight, marginBottom: 8 }}>Exames selecionados:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {selectedExames.map(e => (
                      <div key={e} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px 5px 12px", background: C.blueLight, borderRadius: 20, border: `1px solid ${C.blue}30` }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: C.blue }}>{e}</span>
                        <button onClick={() => setSelectedExames(prev => prev.filter(x => x !== e))} style={{ background: "none", border: "none", cursor: "pointer", color: C.blue, fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {selectedExames.length > 0 && (
              <div style={{ position: "sticky", bottom: 20, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, boxShadow: C.shadowMd }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: C.text }}>{selectedExames.length} exame(s)</div>
                    <div style={{ fontSize: 12, color: C.textLight }}>Tabela: <span style={{ textDecoration: "line-through" }}>R$ {precoRef}</span></div>
                  </div>
                  <Btn size="lg" onClick={() => setStep(3)}>Lançar Leilão →</Btn>
                </div>
              </div>
            )}
            <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: C.textLight, fontSize: 13, cursor: "pointer", marginTop: 16 }}>← Voltar</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.red }} />
                  <span style={{ fontWeight: 700, fontSize: 13, color: C.red }}>Leilão em andamento</span>
                </div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, margin: 0, color: C.text }}>Recebendo propostas</h2>
                <div style={{ fontSize: 13, color: C.textLight, marginTop: 4 }}>{selectedExames.slice(0, 2).join(" · ")}{selectedExames.length > 2 ? ` +${selectedExames.length - 2}` : ""}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: C.textLight }}>Encerra em</div>
                <div style={{ fontWeight: 800, fontSize: 28, color: timer < 60 ? C.red : C.blue, fontFamily: "monospace" }}>{fmt(timer)}</div>
              </div>
            </div>
            <div style={{ height: 4, background: C.borderLight, borderRadius: 2, marginBottom: 24, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 2, background: timer < 60 ? C.red : C.blue, width: `${(timer / 180) * 100}%`, transition: "width 1s linear" }} />
            </div>

            {lances.length === 0 && (
              <Card style={{ padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📡</div>
                <div style={{ fontWeight: 600, color: C.text }}>Notificando laboratórios próximos...</div>
              </Card>
            )}

            {lances.map((l, idx) => (
              <Card key={idx} onClick={() => setSelectedLance(idx)} style={{
                padding: 20, marginBottom: 10,
                border: `2px solid ${selectedLance === idx ? C.blue : idx === 0 ? C.green + "50" : C.border}`,
                background: selectedLance === idx ? C.blueLight : C.surface, cursor: "pointer"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <LabInitial nome={l.lab.nome} color={l.lab.logoColor} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{l.lab.nome}</div>
                      <div style={{ fontSize: 12, color: C.textLight }}>{l.lab.distancia}km · {l.lab.bairro}</div>
                      <Stars rating={l.lab.rating} />
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 900, fontSize: 26, color: C.blue, fontFamily: "'Syne', sans-serif" }}>R$ {l.lance}</div>
                    <Tag color={C.green} bg={C.greenLight}>-{disc(l.lance, precoRef)}% desc.</Tag>
                    {idx === 0 && <div style={{ marginTop: 4 }}><Tag color={C.amber} bg={C.amberLight}>🏆 Melhor oferta</Tag></div>}
                  </div>
                </div>
                {l.horarios.length > 0 && (
                  <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, color: C.textLight, alignSelf: "center" }}>Horários:</span>
                    {l.horarios.map(h => <Tag key={h} color={C.blue} bg={C.blueLight}>{h}</Tag>)}
                  </div>
                )}
                <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                  <Tag color={C.textMid} bg={C.bg}>{l.lab.acreditacao}</Tag>
                  <Tag color={C.textMid} bg={C.bg}>Resultado em 24h</Tag>
                </div>
              </Card>
            ))}

            {lances.length > 0 && selectedLance !== null && (
              <Btn size="lg" onClick={() => setStep(4)} style={{ width: "100%", marginTop: 8 }}>
                ✅ Confirmar proposta de R$ {lances[selectedLance]?.lance} →
              </Btn>
            )}
          </div>
        )}

        {step === 4 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 24px" }}>✅</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 30, fontWeight: 800, margin: "0 0 10px", color: C.text }}>Exame Confirmado!</h2>
            <p style={{ color: C.textMid, marginBottom: 32 }}>Agendamento realizado com sucesso.</p>
            <Card style={{ padding: 28, marginBottom: 20, textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ color: C.textMid }}>Preço de tabela</span>
                <span style={{ textDecoration: "line-through", color: C.textLight }}>R$ {precoRef}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Você vai pagar</span>
                <span style={{ fontWeight: 900, fontSize: 24, color: C.blue, fontFamily: "'Syne', sans-serif" }}>R$ {lances[selectedLance]?.lance || Math.round(precoRef * 0.62)}</span>
              </div>
              <Divider />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: C.textMid }}>Economia</span>
                <Tag color={C.green} bg={C.greenLight}>R$ {precoRef - (lances[selectedLance]?.lance || Math.round(precoRef * 0.62))} ({disc(lances[selectedLance]?.lance || Math.round(precoRef * 0.62), precoRef)}% off)</Tag>
              </div>
            </Card>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <Btn variant="ghost" onClick={() => { setStep(1); setSelectedExames([]); setLances([]); setSelectedLance(null); setOcrState("idle"); setCep(""); setCepData(null); setAuctionStarted(false); setTimer(180); }}>Novo leilão</Btn>
              <Btn onClick={() => onNavigate("home")}>Voltar ao início</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LabDashboard({ onNavigate }) {
  const lab = LABS_MOCK[0];
  const [tab, setTab] = useState("oportunidades");
  const [bidding, setBidding] = useState(null);
  const [timers, setTimers] = useState(LEILOES_MOCK.map(l => l.timer));
  useEffect(() => {
    const t = setInterval(() => setTimers(p => p.map(s => Math.max(0, s - 1))), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>
      <div style={{ width: 220, background: "#001F4D", minHeight: "100vh", position: "sticky", top: 64, flexShrink: 0 }}>
        <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Painel do Laboratório</div>
          <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", marginTop: 4 }}>{lab.nome.split(" ").slice(0, 2).join(" ")}</div>
        </div>
        <nav style={{ padding: "12px 0" }}>
          {[{ id: "oportunidades", icon: "⚡", label: "Oportunidades" }, { id: "financeiro", icon: "💰", label: "Financeiro" }, { id: "perfil", icon: "⚙️", label: "Meu Laboratório" }].map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 20px", background: tab === item.id ? "rgba(100,181,246,0.15)" : "transparent", borderLeft: `3px solid ${tab === item.id ? "#64B5F6" : "transparent"}`, border: "none", cursor: "pointer", color: tab === item.id ? "#fff" : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: tab === item.id ? 600 : 400, fontFamily: "'DM Sans', sans-serif", textAlign: "left" }}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div style={{ position: "absolute", bottom: 20, left: 16, right: 16 }}>
          <button onClick={() => onNavigate("home")} style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", padding: 9, borderRadius: 8, cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>← Sair</button>
        </div>
      </div>

      <div style={{ flex: 1, padding: 32 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, margin: "0 0 4px", color: C.text }}>{lab.nome}</h1>
          <div style={{ color: C.textLight, fontSize: 13 }}>{lab.bairro} · Ocupação: {pct(lab.ocupacao, lab.capacidade)}%</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Capacidade Ociosa", value: `${lab.capacidade - lab.ocupacao}`, sub: "horários livres hoje", color: C.blue, icon: "🕐" },
            { label: "Lances Ganhos", value: "23", sub: "este mês", color: C.green, icon: "🏆" },
            { label: "Receita via CheckApp", value: "R$ 4.820", sub: "+34% vs mês anterior", color: C.teal, icon: "💰" },
            { label: "Taxa de Conversão", value: "68%", sub: "dos leilões disputados", color: C.amber, icon: "📈" },
          ].map(s => (
            <Card key={s.label} style={{ padding: 20 }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: s.color, fontFamily: "'Syne', sans-serif" }}>{s.value}</div>
              <div style={{ fontWeight: 600, fontSize: 13, color: C.text, marginTop: 2 }}>{s.label}</div>
              <div style={{ color: C.textLight, fontSize: 11, marginTop: 2 }}>{s.sub}</div>
            </Card>
          ))}
        </div>

        {tab === "oportunidades" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: C.text }}>Leilões disponíveis agora</div>
              <Tag color={C.red} bg={C.redLight}>● {LEILOES_MOCK.length} ao vivo</Tag>
            </div>
            {LEILOES_MOCK.map((l, i) => (
              <Card key={l.id} style={{ padding: 20, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 4 }}>{l.exames.join(" · ")}</div>
                    <div style={{ fontSize: 12, color: C.textLight }}>{l.bairro} · {l.lances} lance(s)</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <Tag color={C.blue} bg={C.blueLight}>Melhor: R$ {l.melhorLance}</Tag>
                      <Tag color={C.textMid} bg={C.bg}>Ref: R$ {l.precoRef}</Tag>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: C.textLight, marginBottom: 4 }}>Encerra em</div>
                    <div style={{ fontWeight: 800, fontSize: 20, color: timers[i] < 300 ? C.red : C.blue, fontFamily: "monospace" }}>{fmt(timers[i])}</div>
                    <div style={{ marginTop: 8 }}>
                      {bidding === l.id ? (
                        <Btn variant="success" size="sm" onClick={() => setBidding(null)}>✓ Lance enviado!</Btn>
                      ) : (
                        <Btn size="sm" onClick={() => setBidding(l.id)}>Dar Lance</Btn>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === "financeiro" && (
          <Card style={{ padding: 28 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20, color: C.text }}>Receita via CheckApp — 2025</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 100, marginBottom: 8 }}>
              {[42,58,71,89,112,134,158,187,203,241,276,312].map((v, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: "100%", borderRadius: "3px 3px 0 0", background: i === 11 ? C.blue : `${C.blue}40`, height: `${(v / 312) * 90}px` }} />
                  <span style={{ fontSize: 8, color: C.textLight }}>{"JFMAMJJASOND"[i]}</span>
                </div>
              ))}
            </div>
            <Divider />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {[{ l: "Receita bruta", v: "R$ 4.820" }, { l: "Taxa CheckApp (8%)", v: "R$ 386" }, { l: "Repasse líquido", v: "R$ 4.434", d: true }].map(r => (
                <div key={r.l}>
                  <div style={{ fontSize: 12, color: C.textLight, marginBottom: 4 }}>{r.l}</div>
                  <div style={{ fontWeight: 800, fontSize: 20, color: r.d ? C.green : C.text, fontFamily: "'Syne', sans-serif" }}>{r.v}</div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function InvestorDashboard({ onNavigate }) {
  const [section, setSection] = useState("overview");
  const navItems = [
    { id: "overview", label: "Visão Geral" },
    { id: "market", label: "Mercado" },
    { id: "product", label: "Produto" },
    { id: "model", label: "Modelo" },
    { id: "roadmap", label: "Roadmap" },
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 0 }}>
          {navItems.map(s => (
            <button key={s.id} onClick={() => setSection(s.id)} style={{ padding: "16px 20px", background: "none", border: "none", borderBottom: `3px solid ${section === s.id ? C.blue : "transparent"}`, color: section === s.id ? C.blue : C.textMid, fontWeight: section === s.id ? 700 : 500, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{s.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px" }}>
        {section === "overview" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.blue, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>PITCH PARA INVESTIDORES</div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 34, fontWeight: 800, margin: "0 0 12px", color: C.text, letterSpacing: "-0.02em" }}>A primeira bolsa de exames laboratoriais do mundo</h1>
              <div style={{ display: "flex", gap: 8 }}>
                <Tag color={C.green} bg={C.greenLight}>● MVP Ao Vivo</Tag>
                <Tag color={C.amber} bg={C.amberLight}>Seed · R$1.2M</Tag>
                <Tag color={C.blue} bg={C.blueLight}>18.000 labs endereçáveis · ABRAMED 2024</Tag>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 28 }}>
              {[{ v: "18.000+", l: "Labs no Brasil", c: C.blue }, { v: "2,53B", l: "Exames/ano no BR", c: C.teal }, { v: "75%", l: "Sem plano saúde", c: C.green }, { v: "R$45B", l: "Mercado privado", c: C.amber }, { v: "10%", l: "Crescimento a.a.", c: C.blue }, { v: "R$40B", l: "Receita setor 2024", c: C.green }].map(k => (
                <Card key={k.l} style={{ padding: "16px 12px", textAlign: "center" }}>
                  <div style={{ fontWeight: 900, fontSize: 20, color: k.c, fontFamily: "'Syne', sans-serif" }}>{k.v}</div>
                  <div style={{ fontSize: 11, color: C.textLight, marginTop: 4 }}>{k.l}</div>
                </Card>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
              <Card style={{ padding: 24 }}>
                <div style={{ fontWeight: 700, color: C.text, marginBottom: 4 }}>GMV Mensal (R$)</div>
                <div style={{ fontSize: 12, color: C.textLight, marginBottom: 20 }}>Crescimento acumulado 12 meses</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 100 }}>
                  {[42,58,71,89,112,134,158,187,203,241,276,312].map((v, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ width: "100%", borderRadius: "3px 3px 0 0", background: i === 11 ? C.blue : `${C.blue}40`, height: `${(v / 312) * 90}px` }} />
                      <span style={{ fontSize: 8, color: C.textLight }}>{"JFMAMJJASOND"[i]}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card style={{ padding: 24 }}>
                <div style={{ fontWeight: 700, color: C.text, marginBottom: 20 }}>Ocupação dos Labs</div>
                <div style={{ display: "flex", gap: 20, justifyContent: "center", alignItems: "flex-end", height: 80 }}>
                  {[{ l: "Antes", v: 41, c: `${C.red}60` }, { l: "Depois", v: 68, c: C.blue }].map(b => (
                    <div key={b.l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <span style={{ fontWeight: 800, fontSize: 18, color: C.text }}>{b.v}%</span>
                      <div style={{ width: 44, borderRadius: "4px 4px 0 0", background: b.c, height: `${b.v}px` }} />
                      <span style={{ fontSize: 11, color: C.textLight }}>{b.l}</span>
                    </div>
                  ))}
                </div>
                <Divider />
                <div style={{ textAlign: "center", color: C.green, fontWeight: 700, fontSize: 14 }}>+27pp de melhora</div>
              </Card>
            </div>

            <Card style={{ overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, color: C.text }}>Leilões Ativos Agora</span>
                <Tag color={C.red} bg={C.redLight}>● Ao vivo</Tag>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: C.bg }}>
                    {["ID","Exames","Cidade","Lances","Melhor Lance","Desconto","Encerra"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: C.textLight, fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LEILOES_MOCK.map(l => (
                    <tr key={l.id} style={{ borderTop: `1px solid ${C.borderLight}` }}>
                      <td style={{ padding: "12px 16px", fontFamily: "monospace", color: C.blue, fontSize: 12 }}>{l.id}</td>
                      <td style={{ padding: "12px 16px" }}>{l.exames.slice(0, 2).join(", ")}{l.exames.length > 2 ? "..." : ""}</td>
                      <td style={{ padding: "12px 16px", color: C.textMid }}>{l.cidade}</td>
                      <td style={{ padding: "12px 16px" }}><Tag color={C.green} bg={C.greenLight}>{l.lances}</Tag></td>
                      <td style={{ padding: "12px 16px", fontWeight: 700 }}>R$ {l.melhorLance}</td>
                      <td style={{ padding: "12px 16px" }}><Tag color={C.green} bg={C.greenLight}>-{disc(l.melhorLance, l.precoRef)}%</Tag></td>
                      <td style={{ padding: "12px 16px", fontFamily: "monospace", fontWeight: 700, color: C.amber }}>{fmt(l.timer)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {section === "market" && (
          <div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 30, fontWeight: 800, margin: "0 0 8px", color: C.text }}>Mercado Endereçável</h2>
            <p style={{ color: C.textMid, margin: "0 0 32px" }}>Brasil como prova de conceito · Expansão global planejada</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
              {[{ tipo: "TAM", valor: "R$ 45B", desc: "Mercado privado de medicina diagnóstica no Brasil. Setor cresceu 10% em 2024, com R$34B de receita privada — Painel ABRAMED 2024.", cor: C.blue }, { tipo: "SAM", valor: "R$ 12B", desc: "Exames pagos diretamente pelo paciente (cash-pay). 75% dos brasileiros sem plano privado equivale a ~152M de pessoas — ANS 2024.", cor: C.teal }, { tipo: "SOM", valor: "R$ 180M", desc: "Capturável em 3 anos operando SP, RJ e BH. Representa 1,5% do SAM — meta conservadora e defensável a investidores.", cor: C.green }].map(m => (
                <Card key={m.tipo} style={{ padding: 24, borderTop: `4px solid ${m.cor}` }}>
                  <Tag color={m.cor} bg={`${m.cor}12`}>{m.tipo}</Tag>
                  <div style={{ fontSize: 38, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: m.cor, margin: "12px 0 8px" }}>{m.valor}</div>
                  <div style={{ color: C.textMid, fontSize: 13, lineHeight: 1.6 }}>{m.desc}</div>
                </Card>
              ))}
            </div>
            <Card style={{ overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}><span style={{ fontWeight: 700, color: C.text }}>Análise Competitiva</span></div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: C.bg }}>
                    {["Empresa","Modelo","Leilão Real-Time","Asset-Light","OCR IA","Yield Mgmt"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: C.textLight, fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { nome: "CheckApp", modelo: "Leilão Reverso", v: [true,true,true,true], dest: true },
                    { nome: "Exmed", modelo: "Preço Fixo", v: [false,true,false,false] },
                    { nome: "Dr. Consulta", modelo: "Preço Fixo", v: [false,false,false,false] },
                    { nome: "Labi / Beep", modelo: "Preço Fixo", v: [false,true,false,false] },
                    { nome: "Doutor123", modelo: "Cotação 24h", v: [false,true,false,false] },
                  ].map(c => (
                    <tr key={c.nome} style={{ borderTop: `1px solid ${C.borderLight}`, background: c.dest ? C.blueLight : "transparent" }}>
                      <td style={{ padding: "12px 16px", fontWeight: c.dest ? 800 : 500, color: c.dest ? C.blue : C.text }}>{c.nome}{c.dest ? " ✓" : ""}</td>
                      <td style={{ padding: "12px 16px", color: C.textMid }}>{c.modelo}</td>
                      {c.v.map((val, i) => (
                        <td key={i} style={{ padding: "12px 16px", textAlign: "center", fontSize: 16 }}>{val ? <span style={{ color: C.green }}>✓</span> : <span style={{ color: C.borderLight }}>✗</span>}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {section === "model" && (
          <div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 30, fontWeight: 800, margin: "0 0 32px", color: C.text }}>Modelo de Negócio</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginBottom: 28 }}>
              {[
                { n: "B2C", title: "Take-Rate por Transação", desc: "10% sobre cada transação. Ticket médio de R$95 → R$9,50 por leilão. Fonte: preços praticados por Exmed e Labi.", receita: "~R$ 9,50 / transação", color: C.blue },
                { n: "B2B-A", title: "SaaS para Convênios", desc: "Planos de saúde menores (não verticalizados) usam a plataforma para reduzir custo assistencial de exames simples.", receita: "R$ 1.800 / mês / convênio", color: C.teal },
                { n: "B2B-B", title: "SaaS Premium para Labs", desc: "Laboratórios pagam por analytics avançado, yield management e posicionamento prioritário nos leilões.", receita: "R$ 290 / mês / lab", color: C.green },
                { n: "B2B-C", title: "Saúde Ocupacional", desc: "Empresas gerenciam exames periódicos (NR-7) com relatórios consolidados. Mercado de R$4B/ano no Brasil.", receita: "R$ 6.000 / empresa / ano", color: C.amber },
              ].map(m => (
                <Card key={m.n} style={{ padding: 24, borderLeft: `4px solid ${m.color}` }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                    <Tag color={m.color} bg={`${m.color}12`}>{m.n}</Tag>
                    <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{m.title}</span>
                  </div>
                  <p style={{ color: C.textMid, fontSize: 13, lineHeight: 1.6, margin: "0 0 14px" }}>{m.desc}</p>
                  <div style={{ padding: "8px 12px", background: `${m.color}10`, borderRadius: 8, fontSize: 13, fontWeight: 700, color: m.color }}>💰 {m.receita}</div>
                </Card>
              ))}
            </div>
            <Card style={{ overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}><span style={{ fontWeight: 700, color: C.text }}>Projeções Financeiras — Investimento R$1,2M Seed</span></div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: C.bg }}>
                    {["Métrica","Ano 1","Ano 2","Ano 3"].map(h => (
                      <th key={h} style={{ padding: "10px 20px", textAlign: h === "Métrica" ? "left" : "right", fontSize: 11, color: C.textLight, fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[["GMV","R$ 2.1M","R$ 9.4M","R$ 31M"],["Receita Líquida","R$ 210k","R$ 940k","R$ 3.1M"],["Labs Ativos","120","480","1.200"],["Leilões / mês","800","4.200","18.000"],["Margem Bruta","58%","67%","74%"],["Break-even","—","Mês 18","—"]].map((r, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${C.borderLight}` }}>
                      <td style={{ padding: "12px 20px", fontSize: 13, color: C.textMid }}>{r[0]}</td>
                      <td style={{ padding: "12px 20px", textAlign: "right", fontSize: 13 }}>{r[1]}</td>
                      <td style={{ padding: "12px 20px", textAlign: "right", fontSize: 13 }}>{r[2]}</td>
                      <td style={{ padding: "12px 20px", textAlign: "right", fontSize: 13, fontWeight: 800, color: C.green }}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {section === "roadmap" && (
          <div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 30, fontWeight: 800, margin: "0 0 32px", color: C.text }}>Roadmap & Uso do Capital</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
              {[
                { fase: "Q4 2026", titulo: "MVP Validado", cor: C.green, status: "Em andamento", items: ["120 labs onboardados SP","Leilão funcional ao vivo","OCR com Claude AI ativo","CEP + geolocalização","Pix integrado"] },
                { fase: "Q2 2027", titulo: "Product-Market Fit", cor: C.blue, status: "Planejado", items: ["480 labs em SP + RJ","App iOS + Android","API LIS (Tasy, MV)","B2B 3 convênios piloto","Break-even operacional"] },
                { fase: "Q4 2027", titulo: "Escala Nacional", cor: C.amber, status: "Visão", items: ["1.200 labs em 5 cidades","Saúde ocupacional B2B","Série A para expansão","América Latina (piloto MX)","1M exames transacionados"] },
              ].map(f => (
                <Card key={f.fase} style={{ padding: 24, borderTop: `4px solid ${f.cor}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <Tag color={f.cor} bg={`${f.cor}12`}>{f.status}</Tag>
                    <span style={{ fontSize: 12, color: C.textLight }}>{f.fase}</span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 17, color: C.text, marginBottom: 16, fontFamily: "'Syne', sans-serif" }}>{f.titulo}</div>
                  {f.items.map(item => (
                    <div key={item} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: f.cor, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: C.textMid }}>{item}</span>
                    </div>
                  ))}
                </Card>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <Card style={{ padding: 24 }}>
                <div style={{ fontWeight: 700, color: C.text, marginBottom: 16 }}>Alocação do Capital — R$1,2M Seed</div>
                {[{ item: "Tecnologia & Produto", p: 45, c: C.blue }, { item: "Vendas B2B & Growth", p: 30, c: C.teal }, { item: "Operações & Jurídico", p: 15, c: C.amber }, { item: "Reserva Estratégica", p: 10, c: C.textLight }].map(u => (
                  <div key={u.item} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                      <span style={{ color: C.textMid }}>{u.item}</span>
                      <span style={{ fontWeight: 700, color: u.c }}>{u.p}%</span>
                    </div>
                    <div style={{ height: 6, background: C.borderLight, borderRadius: 3 }}>
                      <div style={{ height: "100%", width: `${u.p}%`, background: u.c, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </Card>
              <Card style={{ padding: 24 }}>
                <div style={{ fontWeight: 700, color: C.text, marginBottom: 12 }}>Contato para Investidores</div>
                <p style={{ color: C.textMid, fontSize: 13, lineHeight: 1.8, marginBottom: 20 }}>
                  Buscamos R$1,2M Seed para 18 meses:<br />
                  • 120 labs ativos em SP (mês 6)<br />
                  • 480 labs SP + RJ (mês 12)<br />
                  • Break-even operacional: Mês 18<br />
                  • Exit via M&A ou Série A em 36 meses
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <Btn style={{ flex: 1 }}>📧 Solicitar Pitch Deck</Btn>
                  <Btn variant="secondary" onClick={() => onNavigate("patient")} style={{ flex: 1 }}>🚀 Ver Demo</Btn>
                </div>
              </Card>
            </div>
          </div>
        )}

        {section === "product" && (
          <div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 30, fontWeight: 800, margin: "0 0 32px", color: C.text }}>Stack Tecnológico</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginBottom: 28 }}>
              {[
                { icon: "🤖", title: "OCR com IA (Anthropic)", desc: "API Claude Vision lê fotos e PDFs de pedidos médicos, extrai exames em menos de 3 segundos com 95% de precisão.", badge: "Claude API · Ativo", color: C.blue },
                { icon: "📍", title: "Geolocalização por CEP", desc: "Integração com ViaCEP para encontrar laboratórios credenciados no raio de 5km em tempo real.", badge: "ViaCEP · Ativo", color: C.teal },
                { icon: "📉", title: "Yield Engine", desc: "Algoritmo proprietário prevê ociosidade dos laboratórios e otimiza preços em função do horário e da demanda.", badge: "Proprietário", color: C.green },
                { icon: "⚡", title: "Leilão WebSocket", desc: "Atualizações em menos de 100ms. Labs recebem notificações push para leilões no seu raio de ação.", badge: "WebSocket + Push", color: C.amber },
              ].map(f => (
                <Card key={f.title} style={{ padding: 24 }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
                  <Tag color={f.color} bg={`${f.color}12`}>{f.badge}</Tag>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, margin: "10px 0 8px", color: C.text }}>{f.title}</h3>
                  <p style={{ color: C.textMid, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                </Card>
              ))}
            </div>
            <Card style={{ padding: 24, background: C.blueLight, border: `1px solid ${C.blue}30` }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 10 }}>🔁 Efeito de Rede — O Moat Principal</div>
              <p style={{ color: C.textMid, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                Mais laboratórios → menores preços → mais pacientes → mais leilões → mais receita para labs → mais labs entram. Uma vez estabelecido o ecossistema em uma cidade, o custo de replicação para um concorrente é proibitivo. Break-even de rede estimado: <strong>180 labs ativos por cidade</strong>.
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; font-family: 'DM Sans', sans-serif; background: #F8FAFB; }
        input:focus { border-color: #005EB8 !important; box-shadow: 0 0 0 3px rgba(0,94,184,0.1); }
        button:hover { opacity: 0.9; }
      `}</style>
      <Header page={page} onNavigate={setPage} />
      {page === "home" && <HomePage onNavigate={setPage} />}
      {page === "patient" && <PatientFlow onNavigate={setPage} />}
      {page === "lab" && <LabDashboard onNavigate={setPage} />}
      {page === "investor" && <InvestorDashboard onNavigate={setPage} />}
    </>
  );
}
