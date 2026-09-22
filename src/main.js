import OBR, { buildShape, buildText } from "@owlbear-rodeo/sdk";
import "./style.css";

const PREFIX = "pokemon-mundo-perfeito";

const ESTILO_FICHA = `
<style>
  :root {
    --pm-bg: #f3f7fb;
    --pm-panel: #ffffff;
    --pm-panel-soft: #f7faff;
    --pm-line: #d8e2ee;
    --pm-text: #1f2f46;
    --pm-muted: #6c7d93;
    --pm-blue: #3f82e8;
    --pm-blue-strong: #2868c9;
    --pm-blue-soft: #eaf3ff;
    --pm-red: #e85858;
    --pm-shadow: 0 8px 24px rgba(28, 54, 86, 0.10);
  }

  #app {
    padding: 12px !important;
    color: var(--pm-text) !important;
    background:
      linear-gradient(180deg, rgba(255,255,255,.97), rgba(246,249,253,.97)) !important;
  }

  #app * {
    box-sizing: border-box;
  }

  #app h2 {
    color: #182a43 !important;
    font-size: 26px !important;
    font-weight: 800 !important;
    letter-spacing: -0.4px;
  }

  #app h3 {
    color: #2c5f9f !important;
    font-size: 16px !important;
    font-weight: 800 !important;
    margin: 15px 0 9px !important;
    padding: 9px 11px;
    border-radius: 9px;
    background: linear-gradient(90deg, #edf5ff 0%, #f8fbff 100%);
    border: 1px solid #d9e8fb;
  }

  #app p {
    margin: 8px 0 5px !important;
    color: #53647a !important;
    font-size: 12px !important;
    font-weight: 800 !important;
  }

  #app label {
    color: #506177 !important;
    font-size: 12px !important;
    font-weight: 800 !important;
  }

  #app input,
  #app textarea,
  #app select {
    background: #ffffff !important;
    color: #203149 !important;
    border: 1px solid #c8d5e5 !important;
    border-radius: 8px !important;
    outline: none !important;
    font-family: Inter, Arial, sans-serif !important;
    box-shadow: inset 0 1px 2px rgba(27, 48, 76, 0.03);
    transition: border-color .15s ease, box-shadow .15s ease, background .15s ease;
  }

  #app input {
    min-height: 36px !important;
    padding: 7px 9px !important;
  }

  #app textarea {
    padding: 10px !important;
    line-height: 1.4 !important;
  }

  #app input:hover,
  #app textarea:hover {
    border-color: #9fb9da !important;
  }

  #app input:focus,
  #app textarea:focus {
    border-color: var(--pm-blue) !important;
    box-shadow: 0 0 0 3px rgba(63,130,232,.13) !important;
  }

  #app button {
    border: 1px solid #c9d5e3 !important;
    border-radius: 9px !important;
    background: linear-gradient(180deg, #ffffff 0%, #f2f6fb 100%) !important;
    color: #31445e !important;
    font-family: Inter, Arial, sans-serif !important;
    font-weight: 800 !important;
    box-shadow: 0 2px 5px rgba(32, 58, 88, 0.06);
    transition: transform .1s ease, border-color .15s ease, background .15s ease, color .15s ease, box-shadow .15s ease;
  }

  #app button:hover {
    border-color: #82afea !important;
    background: #edf5ff !important;
    color: #235fae !important;
    box-shadow: 0 4px 10px rgba(63,130,232,.12);
  }

  #app button:active {
    transform: translateY(1px);
  }

  #app hr {
    border: 0 !important;
    height: 1px !important;
    background: #dde6f0 !important;
    margin: 14px 0 !important;
  }

  .fichaCabecalho {
    display:flex !important;
    justify-content:space-between !important;
    align-items:center !important;
    gap:12px !important;
    margin-bottom:12px !important;
    padding: 5px 2px 2px;
  }

  .fichaIdentidade {
    display:flex !important;
    align-items:center !important;
    gap:11px !important;
    min-width:0 !important;
    flex:1 !important;
  }

  .fichaAvatar {
    width:72px !important;
    height:72px !important;
    flex:0 0 72px !important;
    display:flex !important;
    align-items:center !important;
    justify-content:center !important;
    overflow:hidden !important;
    border-radius:16px !important;
    border:2px solid #7bb0f3 !important;
    background: linear-gradient(145deg, #f7fbff, #edf5ff) !important;
    box-shadow: 0 4px 10px rgba(49, 103, 171, 0.10);
    padding:4px !important;
  }

  .fichaAvatar img {
    width:100% !important;
    height:100% !important;
    object-fit:contain !important;
    display:block !important;
  }

  .fichaSubtitulo {
    margin-top:4px !important;
    font-size:11px !important;
    color:#728198 !important;
    opacity:1 !important;
    font-weight:900 !important;
    letter-spacing:.7px !important;
  }

  #trocarTipo {
    flex:0 0 auto !important;
    padding:8px 12px !important;
    min-height:36px !important;
    white-space:nowrap !important;
    border-radius:999px !important;
    color:#53647a !important;
    background: #f6f8fb !important;
  }

  #trocarTipo:hover {
    background:#eaf3ff !important;
    color:#245fae !important;
  }

  .fichaAbas {
    display:flex !important;
    gap:7px !important;
    margin-bottom:16px !important;
    flex-wrap:wrap !important;
  }

  #paginaPokemon1,
  #paginaPokemon2,
  #paginaPokemon3,
  #paginaPokemon4,
  #paginaTreinador1,
  #paginaTreinador2,
  #paginaTreinador3,
  #paginaTreinador4 {
    flex:1 !important;
    min-height:52px !important;
    padding:8px 5px !important;
    font-size:11px !important;
    border-radius:10px !important;
    opacity:1 !important;
    background: linear-gradient(180deg, #ffffff 0%, #f1f5fa 100%) !important;
    color:#35475f !important;
    border:1px solid #d2dce8 !important;
  }

  #paginaPokemon1[style*="opacity:1"],
  #paginaPokemon2[style*="opacity:1"],
  #paginaPokemon3[style*="opacity:1"],
  #paginaPokemon4[style*="opacity:1"],
  #paginaTreinador1[style*="opacity:1"],
  #paginaTreinador2[style*="opacity:1"],
  #paginaTreinador3[style*="opacity:1"],
  #paginaTreinador4[style*="opacity:1"] {
    background: linear-gradient(135deg, #4c8dff 0%, #2f73dc 100%) !important;
    color:#ffffff !important;
    border-color:#2f73dc !important;
    box-shadow:0 4px 10px rgba(47,115,220,.20) !important;
  }

  .statusGrid {
    display:grid !important;
    grid-template-columns: minmax(120px, .95fr) minmax(180px, 1.45fr) !important;
    gap:12px !important;
    align-items:start !important;
    margin-top: 4px;
  }

  .statusCard {
    background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
    border:1px solid var(--pm-line);
    border-radius:12px;
    padding:11px;
    box-shadow:0 3px 10px rgba(30, 55, 84, .055);
  }

  .statusCard p:first-child {
    margin-top:0 !important;
  }

  #hpAtual {
    border-left:4px solid var(--pm-red) !important;
    font-weight:800 !important;
  }

  #hpMax {
    font-weight:800 !important;
  }

  #ca {
    border-left:4px solid var(--pm-blue) !important;
    font-weight:800 !important;
  }

  #habilidadePokemon {
    min-height:132px !important;
    background:#fbfdff !important;
  }

  .proficienciaLinha {
    margin-top:10px !important;
    display:flex !important;
    align-items:center !important;
    gap:8px !important;
    padding:8px 9px;
    border-radius:9px;
    background:#f5f9ff;
    border:1px solid #dbe8f7;
  }

  #proficiencia,
  #treinadorProficiencia {
    width:70px !important;
    min-height:34px !important;
    text-align:center !important;
    font-weight:800 !important;
  }

  .calculadoraHpLinha {
    display:flex !important;
    flex-direction:column !important;
    align-items:stretch !important;
    gap:6px !important;
    margin-top:8px !important;
    position:relative;
    width:100% !important;
  }

  .calculadoraTitulo {
    width:100% !important;
    text-align:center !important;
    margin:8px 0 4px !important;
  }

  .calculadoraControles {
    display:flex !important;
    align-items:flex-end !important;
    justify-content:center !important;
    gap:6px !important;
    flex-wrap:wrap !important;
    width:100% !important;
  }

  .calculadoraHpCampo {
    flex:1 1 76px !important;
    min-width:58px !important;
    max-width:100px !important;
  }

  .calculadoraAcao {
    display:flex !important;
    justify-content:center !important;
    width:100% !important;
    margin-top:3px !important;
  }

  .calculadoraHpCampo #alterarHp {
    width:100% !important;
    min-height:34px !important;
    text-align:center !important;
  }

  .superEfetivoWrap,
  .resistenteWrap,
  .moveWrap {
    position:relative;
    flex:0 0 auto;
  }

  #botaoSuperEfetivo,
  #botaoResistente,
  #botaoMove,
  #botaoCalcularHp {
    min-height:34px !important;
    padding:6px 9px !important;
    font-size:10px !important;
    white-space:nowrap !important;
    cursor:pointer !important;
  }

  #botaoCalcularHp {
    width:58% !important;
    min-width:170px !important;
    max-width:260px !important;
    min-height:38px !important;
    padding:7px 18px !important;
    background:linear-gradient(135deg, #42b96b 0%, #269653 100%) !important;
    color:#fff !important;
    border-color:#218447 !important;
    font-weight:900 !important;
  }

  #botaoCalcularHp:hover {
    background:linear-gradient(135deg, #36aa5f 0%, #207f47 100%) !important;
    color:#fff !important;
    border-color:#1d743f !important;
  }

  /* Iniciativa: bloco próprio abaixo da Calculadora. */
  .iniciativaBloco {
    width:100% !important;
    margin-top:12px !important;
    padding-top:3px !important;
  }

  .iniciativaTitulo {
    width:100% !important;
    text-align:center !important;
    margin:6px 0 6px !important;
    color:#53647a !important;
    font-size:12px !important;
    font-weight:800 !important;
  }

  .iniciativaLinha {
    display:flex !important;
    align-items:center !important;
    justify-content:center !important;
    gap:6px !important;
    flex-wrap:wrap !important;
    width:100% !important;
  }

  #iniciativa {
    width:66px !important;
    min-height:36px !important;
    text-align:center !important;
    font-weight:800 !important;
  }

  #rolarIniciativa {
    flex:0 0 38px !important;
    width:38px !important;
    min-height:36px !important;
    padding:5px !important;
    font-size:13px !important;
  }

  .iniciativaCheck {
    display:inline-flex !important;
    align-items:center !important;
    justify-content:center !important;
    gap:5px !important;
    min-height:36px !important;
    padding:5px 9px !important;
    border-radius:999px !important;
    font-size:10px !important;
    white-space:nowrap !important;
    cursor:pointer !important;
  }

  .iniciativaCheckBolinha {
    width:17px !important;
    height:17px !important;
    border-radius:50% !important;
    display:inline-flex !important;
    align-items:center !important;
    justify-content:center !important;
    border:2px solid #9fb1c7 !important;
    background:#fff !important;
    color:transparent !important;
    font-size:10px !important;
    font-weight:900 !important;
    line-height:1 !important;
  }

  .iniciativaCheck.ativo {
    background:#eaf3ff !important;
    color:#245fae !important;
    border-color:#7aa8e6 !important;
  }

  .iniciativaCheck.ativo .iniciativaCheckBolinha {
    background:#3f82e8 !important;
    border-color:#2868c9 !important;
    color:#fff !important;
  }

  /* Super Efetivo: 2x laranja, 4x vermelho. */
  #botaoSuperEfetivo.super2 {
    background:linear-gradient(135deg, #ffb347 0%, #f28c28 100%) !important;
    color:#fff !important;
    border-color:#dc7a18 !important;
  }

  #botaoSuperEfetivo.super4 {
    background:linear-gradient(135deg, #ff6666 0%, #d93636 100%) !important;
    color:#fff !important;
    border-color:#c72d2d !important;
  }

  /* Resistente usa azul para ficar visualmente diferente do Super Efetivo. */
  #botaoResistente.resistente2,
  #botaoResistente.resistente4 {
    background:linear-gradient(135deg, #65a9ff 0%, #367bd4 100%) !important;
    color:#fff !important;
    border-color:#2f6dbd !important;
  }

  .opcoesSuperEfetivo,
  .opcoesResistente,
  .opcoesMove {
    display:none;
    position:absolute;
    z-index:50;
    left:0;
    top:calc(100% + 5px);
    gap:5px;
    padding:6px;
    border:1px solid #d8e2ee;
    border-radius:9px;
    background:#fff;
    box-shadow:0 6px 18px rgba(28,54,86,.16);
  }

  .opcoesSuperEfetivo.aberto,
  .opcoesResistente.aberto {
    display:flex;
  }

  /* O menu Move abre para baixo com as opções empilhadas. */
  .opcoesMove.aberto {
    display:flex;
    flex-direction:column;
    align-items:stretch;
    min-width:100%;
  }

  .opcoesMove .tipoMoveHp {
    width:100% !important;
    min-width:86px !important;
  }

  .multiplicadorSuperEfetivo,
  .divisorResistente,
  .tipoMoveHp {
    min-width:42px !important;
    min-height:32px !important;
    padding:5px 8px !important;
    font-size:11px !important;
    cursor:pointer !important;
  }

  .multiplicadorSuperEfetivo[data-fator="1"].ativo,
  .divisorResistente[data-fator="1"].ativo {
    background:#eef2f7 !important;
    color:#31445e !important;
    border-color:#aebdce !important;
  }

  .multiplicadorSuperEfetivo[data-fator="2"].ativo {
    background:#f28c28 !important;
    color:#fff !important;
    border-color:#dc7a18 !important;
  }

  .multiplicadorSuperEfetivo[data-fator="4"].ativo {
    background:#d93636 !important;
    color:#fff !important;
    border-color:#c72d2d !important;
  }

  .divisorResistente[data-fator="0.5"].ativo,
  .divisorResistente[data-fator="0.25"].ativo {
    background:#3f82e8 !important;
    color:#fff !important;
    border-color:#2868c9 !important;
  }


  /* Move: Físico usa DEF; Especial usa DEFSP; Neutro ignora defesa de estágio. */
  #botaoMove.moveFisico {
    background:linear-gradient(135deg, #f59a55 0%, #d96e2b 100%) !important;
    color:#fff !important;
    border-color:#c55f22 !important;
  }

  #botaoMove.moveEspecial {
    background:linear-gradient(135deg, #9b7cff 0%, #6f52d9 100%) !important;
    color:#fff !important;
    border-color:#6045c6 !important;
  }

  .tipoMoveHp[data-tipo="neutro"].ativo {
    background:#eef2f7 !important;
    color:#31445e !important;
    border-color:#aebdce !important;
  }

  .tipoMoveHp[data-tipo="fisico"].ativo {
    background:#d96e2b !important;
    color:#fff !important;
    border-color:#c55f22 !important;
  }

  .tipoMoveHp[data-tipo="especial"].ativo {
    background:#6f52d9 !important;
    color:#fff !important;
    border-color:#6045c6 !important;
  }

  .movimentoLinha {
    display:grid !important;
    grid-template-columns:repeat(3, minmax(70px, 1fr)) !important;
    gap:7px !important;
  }

  .movimentoLinha input {
    width:100% !important;
  }

  .rolarSalvaguarda,
  .rolarAtributo,
  .rolarPericiaPokemon,
  .rolarPericiaTreinador,
  .rolarAcerto,
  .rolarDano,
  .rolarCritico,
  .rolarD6,
  #rolarCaptura,
  #rolarIniciativa {
    background: linear-gradient(180deg, #f4f9ff 0%, #e7f2ff 100%) !important;
    color:#2865be !important;
    border-color:#a8c7ef !important;
  }

  #salvarPokemonStatus,
  #salvarPokemonMoves,
  #salvarPokemonPericias,
  #salvarPokemonTalentos,
  #salvarTreinadorStatus,
  #salvarTreinadorPerTal,
  #salvarTreinadorHabilidades,
  #salvarTreinadorAnotacoes {
    min-height:42px !important;
    border:0 !important;
    background: linear-gradient(135deg, #4c8dff 0%, #286bd7 100%) !important;
    color:#fff !important;
    box-shadow:0 5px 12px rgba(40,107,215,.22) !important;
  }

  /* Salvamento é automático: os antigos botões continuam apenas como
     gatilhos internos para reaproveitar a lógica já validada. */
  #salvarPokemonStatus,
  #salvarPokemonMoves,
  #salvarPokemonPericias,
  #salvarPokemonTalentos,
  #salvarTreinadorStatus,
  #salvarTreinadorPerTal,
  #salvarTreinadorHabilidades,
  #salvarTreinadorAnotacoes {
    display:none !important;
  }

  details {
    background:#fff !important;
    border:1px solid #d7e1ec !important;
    border-radius:11px !important;
    box-shadow:0 2px 8px rgba(30,50,80,.055) !important;
  }

  details:hover {
    border-color:#a9c4e5 !important;
  }

  summary {
    color:#2d4462 !important;
    font-weight:800 !important;
  }

  ::-webkit-scrollbar {
    width:8px;
  }

  ::-webkit-scrollbar-track {
    background:transparent;
  }

  ::-webkit-scrollbar-thumb {
    background:#a9b8ca;
    border-radius:20px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background:#879bb4;
  }

  @media (max-width: 420px) {
    .statusGrid {
      grid-template-columns:1fr !important;
    }

    .movimentoLinha {
      grid-template-columns:1fr !important;
    }

    .fichaAvatar {
      width:62px !important;
      height:62px !important;
      flex-basis:62px !important;
    }
  }
</style>
`;


const ATRIBUTOS = ["for", "des", "con", "int", "sab", "car"];

const NOMES_ATRIBUTOS = {
    for: "Força",
    des: "Destreza",
    con: "Constituição",
    int: "Inteligência",
    sab: "Sabedoria",
    car: "Carisma"
};

const BUFFS = [
    { id: "atq", nome: "ATQ" },
    { id: "atqsp", nome: "ATQSP" },
    { id: "def", nome: "DEF" },
    { id: "defsp", nome: "DEFSP" },
    { id: "vel", nome: "VEL" },
    { id: "pres", nome: "PRES" },
    { id: "evas", nome: "EVAS" },
    { id: "crit", nome: "CRIT" }
];

const PERICIAS = [
    {
        atributo: "FOR",
        nomeAtributo: "Força",
        pericias: [
            { id: "atletismo", nome: "Atletismo" }
        ]
    },
    {
        atributo: "DES",
        nomeAtributo: "Destreza",
        pericias: [
            { id: "acrobacia", nome: "Acrobacia" },
            { id: "furtividade", nome: "Furtividade" },
            { id: "prestidigitacao", nome: "Prestidigitação" }
        ]
    },
    {
        atributo: "CON",
        nomeAtributo: "Constituição",
        pericias: []
    },
    {
        atributo: "INT",
        nomeAtributo: "Inteligência",
        pericias: [
            { id: "arcanismo", nome: "Arcanismo" },
            { id: "historia", nome: "História" },
            { id: "investigacao", nome: "Investigação" },
            { id: "natureza", nome: "Natureza" },
            { id: "religiao", nome: "Religião" }
        ]
    },
    {
        atributo: "SAB",
        nomeAtributo: "Sabedoria",
        pericias: [
            { id: "adestrar-animais", nome: "Adestrar Animais" },
            { id: "intuicao", nome: "Intuição" },
            { id: "medicina", nome: "Medicina" },
            { id: "percepcao", nome: "Percepção" },
            { id: "sobrevivencia", nome: "Sobrevivência" }
        ]
    },
    {
        atributo: "CAR",
        nomeAtributo: "Carisma",
        pericias: [
            { id: "atuacao", nome: "Atuação" },
            { id: "enganacao", nome: "Enganação" },
            { id: "intimidacao", nome: "Intimidação" },
            { id: "persuasao", nome: "Persuasão" }
        ]
    }
];

// =====================================================
// UTILIDADES
// =====================================================

function esc(valor) {
    return String(valor ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

function limparRotuloDice(texto) {
    return String(texto || "")
        .replace(/[#+\-*/(),]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function formatarBonus(valor) {
    const numero = Number(valor) || 0;
    return numero > 0 ? `+${numero}` : `${numero}`;
}

function faixaCritico(estagio) {
    const mapa = {
        0: "20",
        1: "17–20",
        2: "14–20",
        3: "11–20",
        4: "8–20",
        5: "5–20",
        6: "2–20"
    };

    const valor = Math.max(0, Math.min(6, Number(estagio) || 0));
    return mapa[valor];
}

function duplicarDadosFormula(formula) {
    return String(formula || "").replace(
        /(^|[^A-Za-z0-9_])(\d*)d(\d+)/gi,
        (match, prefixo, quantidade, faces) => {
            const qtd = quantidade === "" ? 1 : Number(quantidade);
            return `${prefixo}${qtd * 2}d${faces}`;
        }
    );
}

function adicionarBonusNaFormula(formula, bonus) {
    if (bonus > 0) return `${formula}+${bonus}`;
    if (bonus < 0) return `${formula}${bonus}`;
    return formula;
}

function formulaSalvaguarda(valor) {
    const numero = Number(
        String(valor ?? "")
            .trim()
            .replace(",", ".")
    );

    if (Number.isNaN(numero)) {
        return null;
    }

    return `1d20${numero >= 0 ? "+" : ""}${numero}`;
}

// =====================================================
// DICE+
// =====================================================

async function dicePlusPronto() {
    const requestId = crypto.randomUUID();

    return new Promise((resolve) => {
        let terminou = false;

        const unsubscribe = OBR.broadcast.onMessage(
            "dice-plus/isReady",
            (event) => {
                if (
                    event.data?.ready === true &&
                    event.data?.requestId === requestId &&
                    !terminou
                ) {
                    terminou = true;
                    unsubscribe();
                    resolve(true);
                }
            }
        );

        OBR.broadcast.sendMessage(
            "dice-plus/isReady",
            {
                requestId,
                timestamp: Date.now()
            },
            { destination: "ALL" }
        );

        setTimeout(() => {
            if (!terminou) {
                terminou = true;
                unsubscribe();
                resolve(false);
            }
        }, 1000);
    });
}

async function rolarNoDicePlus(formula, nome, tipo = "") {
    formula = String(formula || "").trim();

    if (!formula) {
        alert("A fórmula da rolagem está vazia.");
        return;
    }

    if (!(await dicePlusPronto())) {
        alert("Dice+ não foi encontrado.");
        return;
    }

    const playerId = await OBR.player.getId();
    const playerName = await OBR.player.getName();

    const nomeSeguro =
        limparRotuloDice(nome) || "Rolagem";

    const tipoSeguro =
        limparRotuloDice(tipo);

    const rotulo =
        tipoSeguro
            ? `${nomeSeguro} ${tipoSeguro}`
            : nomeSeguro;

    const formulaCompleta =
        `${formula} # ${rotulo}`;

    await OBR.broadcast.sendMessage(
        "dice-plus/roll-request",
        {
            rollId:
                `pokemon_${Date.now()}_${Math.random()
                    .toString(36)
                    .slice(2, 8)}`,

            playerId,
            playerName,
            rollTarget: "everyone",
            diceNotation: formulaCompleta,
            showResults: true,
            timestamp: Date.now(),
            source: PREFIX
        },
        { destination: "ALL" }
    );
}

// =====================================================
// BARRA HP + CA
// =====================================================

const TIPOS_VISUAIS_HUD = [
  "fundo",
  "vida",
  "hp-texto",
  "ca-circulo",
  "ca-texto"
];

const filaHudPorToken = new Map();

function prepararVisualHud(item) {
  const comportamentos = new Set(
    item.disableAttachmentBehavior || []
  );

  // O HUD deve acompanhar a POSIÇÃO do token, mas não pode
  // herdar Flip/escala negativa nem rotação do token.
  comportamentos.add("SCALE");
  comportamentos.add("ROTATION");

  item.disableAttachmentBehavior = [
    ...comportamentos
  ];

  item.rotation = 0;
  item.scale = { x: 1, y: 1 };

  return item;
}

function ordenarHudMaisNovoPrimeiro(a, b) {
  const dataA = Date.parse(a.lastModified || "") || 0;
  const dataB = Date.parse(b.lastModified || "") || 0;

  if (dataA !== dataB) {
    return dataB - dataA;
  }

  // Desempate determinístico para dois jogadores que salvem
  // praticamente no mesmo instante.
  return String(a.id).localeCompare(String(b.id));
}

async function desduplicarHudToken(
  tokenId,
  tiposAtivos = TIPOS_VISUAIS_HUD
) {
  const ativos = new Set(tiposAtivos);

  const visuais =
    await OBR.scene.items.getItems(
      (item) =>
        item.metadata?.[
          `${PREFIX}/statusToken`
        ] === tokenId
    );

  const porTipo = new Map();

  for (const item of visuais) {
    const tipo =
      item.metadata?.[
        `${PREFIX}/tipoVisual`
      ];

    if (!porTipo.has(tipo)) {
      porTipo.set(tipo, []);
    }

    porTipo.get(tipo).push(item);
  }

  const apagar = [];

  for (const [tipo, itens] of porTipo) {
    const ordenados =
      [...itens].sort(
        ordenarHudMaisNovoPrimeiro
      );

    // Se este tipo não deveria existir agora (ex.: barra de
    // vida quando o HP chegou a 0), apaga todas as cópias.
    if (!ativos.has(tipo)) {
      apagar.push(
        ...ordenados.map(
          (item) => item.id
        )
      );

      continue;
    }

    // Mantém exatamente uma cópia de cada parte do HUD.
    if (ordenados.length > 1) {
      apagar.push(
        ...ordenados
          .slice(1)
          .map((item) => item.id)
      );
    }
  }

  if (apagar.length) {
    await OBR.scene.items.deleteItems(
      [...new Set(apagar)]
    );
  }
}

async function corrigirHudExistente() {
  const visuais =
    await OBR.scene.items.getItems(
      (item) =>
        item.metadata?.[
          `${PREFIX}/statusToken`
        ] !== undefined
    );

  if (!visuais.length) {
    return;
  }

  // Migra barras já existentes para a regra anti-Flip.
  await OBR.scene.items.updateItems(
    visuais,
    (items) => {
      for (const item of items) {
        const comportamentos = new Set(
          item.disableAttachmentBehavior || []
        );

        comportamentos.add("SCALE");
        comportamentos.add("ROTATION");

        item.disableAttachmentBehavior = [
          ...comportamentos
        ];

        item.rotation = 0;
        item.scale = { x: 1, y: 1 };
      }
    }
  );

  // Também limpa duplicatas que tenham ficado de versões
  // anteriores do plugin.
  const tokens = [
    ...new Set(
      visuais
        .map(
          (item) =>
            item.metadata?.[
              `${PREFIX}/statusToken`
            ]
        )
        .filter(Boolean)
    )
  ];

  for (const tokenId of tokens) {
    await desduplicarHudToken(tokenId);
  }
}

async function executarEmFilaHud(
  tokenId,
  tarefa
) {
  const anterior =
    filaHudPorToken.get(tokenId) ||
    Promise.resolve();

  const atual = anterior
    .catch(() => {})
    .then(tarefa);

  filaHudPorToken.set(
    tokenId,
    atual
  );

  try {
    return await atual;
  }
  finally {
    if (
      filaHudPorToken.get(tokenId) === atual
    ) {
      filaHudPorToken.delete(tokenId);
    }
  }
}

async function criarStatusNoToken(
  token,
  hpAtual,
  hpMax,
  ca
) {
  return executarEmFilaHud(
    token.id,
    async () => {
      const antigos =
        await OBR.scene.items.getItems(
          (item) =>
            item.metadata?.[
              `${PREFIX}/statusToken`
            ] === token.id
        );

      if (antigos.length) {
        await OBR.scene.items.deleteItems(
          antigos.map(
            (item) => item.id
          )
        );
      }

      const bounds =
        await OBR.scene.items.getItemBounds(
          [token.id]
        );

      const larguraBarra = Math.max(
        100,
        Math.min(
          180,
          bounds.width * 0.85
        )
      );

      const alturaBarra = Math.max(
        20,
        Math.min(
          30,
          larguraBarra * 0.16
        )
      );

      const tamanhoCA =
        alturaBarra * 1.4;

      const espacoCA =
        alturaBarra * 0.35;

      const larguraTotal =
        larguraBarra +
        espacoCA +
        tamanhoCA;

      const inicioX =
        bounds.min.x +
        (
          (bounds.width - larguraTotal)
          / 2
        );

      const barraY =
        bounds.max.y +
        Math.max(
          8,
          bounds.height * 0.03
        );

      let porcentagem =
        hpMax > 0
          ? hpAtual / hpMax
          : 0;

      porcentagem =
        Math.max(
          0,
          Math.min(
            1,
            porcentagem
          )
        );

      const larguraVida =
        larguraBarra * porcentagem;

      let corVida = "#34C759";

      if (porcentagem <= 0.50) {
        corVida = "#FFD60A";
      }

      if (porcentagem <= 0.25) {
        corVida = "#FF453A";
      }

      const fundoBarra =
        prepararVisualHud(
          buildShape()
            .shapeType("RECTANGLE")
            .width(larguraBarra)
            .height(alturaBarra)
            .position({
              x: inicioX,
              y: barraY
            })
            .fillColor("#202020")
            .fillOpacity(1)
            .strokeColor("#000000")
            .strokeWidth(2)
            .layer("ATTACHMENT")
            .zIndex(0)
            .disableAutoZIndex(true)
            .attachedTo(token.id)
            .locked(true)
            .disableHit(true)
            .metadata({
              [`${PREFIX}/statusToken`]:
                token.id,

              [`${PREFIX}/tipoVisual`]:
                "fundo"
            })
            .build()
        );

      let barraVida = null;

      if (larguraVida > 0) {
        barraVida =
          prepararVisualHud(
            buildShape()
              .shapeType("RECTANGLE")
              .width(larguraVida)
              .height(alturaBarra)
              .position({
                x: inicioX,
                y: barraY
              })
              .fillColor(corVida)
              .fillOpacity(1)
              .strokeWidth(0)
              .layer("ATTACHMENT")
              .zIndex(1)
              .disableAutoZIndex(true)
              .attachedTo(token.id)
              .locked(true)
              .disableHit(true)
              .metadata({
                [`${PREFIX}/statusToken`]:
                  token.id,

                [`${PREFIX}/tipoVisual`]:
                  "vida"
              })
              .build()
          );
      }

      const fonteHP =
        Math.max(
          16,
          alturaBarra * 0.72
        );

      const textoHP =
        prepararVisualHud(
          buildText()
            .textType("PLAIN")
            .plainText(`${hpAtual}`)
            .position({
              x: inicioX,

              y:
                barraY +
                (
                  (alturaBarra - fonteHP)
                  / 2
                )
            })
            .width(larguraBarra)
            .height("AUTO")
            .fontFamily("Arial")
            .fontSize(fonteHP)
            .fontWeight(700)
            .lineHeight(1)
            .fillColor("#FFFFFF")
            .fillOpacity(1)
            .strokeWidth(0)
            .textAlign("CENTER")
            .padding(0)
            .layer("ATTACHMENT")
            .zIndex(10)
            .disableAutoZIndex(true)
            .attachedTo(token.id)
            .locked(true)
            .disableHit(true)
            .metadata({
              [`${PREFIX}/statusToken`]:
                token.id,

              [`${PREFIX}/tipoVisual`]:
                "hp-texto"
            })
            .build()
        );

      const caX =
        inicioX +
        larguraBarra +
        espacoCA +
        8;

      const caY =
        barraY -
        (
          (tamanhoCA - alturaBarra)
          / 2
        ) +
        3;

      const circuloCA =
        prepararVisualHud(
          buildShape()
            .shapeType("CIRCLE")
            .width(tamanhoCA)
            .height(tamanhoCA)
            .position({
              x: caX,
              y: caY
            })
            .fillColor("#2481CC")
            .fillOpacity(1)
            .strokeColor("#FFFFFF")
            .strokeWidth(2)
            .layer("ATTACHMENT")
            .zIndex(1)
            .disableAutoZIndex(true)
            .attachedTo(token.id)
            .locked(true)
            .disableHit(true)
            .metadata({
              [`${PREFIX}/statusToken`]:
                token.id,

              [`${PREFIX}/tipoVisual`]:
                "ca-circulo"
            })
            .build()
        );

      const fonteCA =
        tamanhoCA * 0.45;

      const textoCA =
        prepararVisualHud(
          buildText()
            .textType("PLAIN")
            .plainText(`${ca}`)
            .position({
              x:
                caX -
                (tamanhoCA / 2),

              y:
                caY -
                (tamanhoCA / 2)
            })
            .width(tamanhoCA)
            .height(tamanhoCA)
            .fontFamily("Arial")
            .fontSize(fonteCA)
            .fontWeight(700)
            .lineHeight(1)
            .fillColor("#FFFFFF")
            .fillOpacity(1)
            .strokeWidth(0)
            .textAlign("CENTER")
            .textAlignVertical("MIDDLE")
            .padding(0)
            .layer("ATTACHMENT")
            .zIndex(20)
            .disableAutoZIndex(true)
            .attachedTo(token.id)
            .locked(true)
            .disableHit(true)
            .metadata({
              [`${PREFIX}/statusToken`]:
                token.id,

              [`${PREFIX}/tipoVisual`]:
                "ca-texto"
            })
            .build()
        );

      const elementos = [
        fundoBarra
      ];

      if (barraVida) {
        elementos.push(
          barraVida
        );
      }

      elementos.push(
        circuloCA,
        textoHP,
        textoCA
      );

      await OBR.scene.items.addItems(
        elementos
      );

      const tiposAtivos = [
        "fundo",
        "hp-texto",
        "ca-circulo",
        "ca-texto"
      ];

      if (barraVida) {
        tiposAtivos.push("vida");
      }

      // Duas passagens tornam a rotina convergente mesmo se
      // dois usuários salvarem a mesma ficha quase juntos.
      await new Promise(
        (resolve) => setTimeout(resolve, 80)
      );

      await desduplicarHudToken(
        token.id,
        tiposAtivos
      );

      await new Promise(
        (resolve) => setTimeout(resolve, 220)
      );

      await desduplicarHudToken(
        token.id,
        tiposAtivos
      );
    }
  );
}

// =====================================================
// HP + CA DA TELA
// =====================================================

async function pegarHpCaDaTela(aplicarCalculadora = false) {
    let hpAtual =
        Number(
            document
                .querySelector("#hpAtual")
                .value
        );

    let hpMax =
        Number(
            document
                .querySelector("#hpMax")
                .value
        );

    const ca =
        Number(
            document
                .querySelector("#ca")
                .value
        );

    const alterarHp =
        document
            .querySelector("#alterarHp")
            .value
            .trim();

    if (Number.isNaN(hpAtual)) {
        alert(
            "HP atual inválido."
        );

        return null;
    }

    if (Number.isNaN(hpMax)) {
        alert(
            "HP máximo inválido."
        );

        return null;
    }

    if (Number.isNaN(ca)) {
        alert(
            "CA inválida."
        );

        return null;
    }

    if (hpMax < 1) {
        hpMax = 1;
    }

    if (aplicarCalculadora && alterarHp === "") {
        alert("Digite um valor na Calculadora antes de calcular.");
        return null;
    }

    if (aplicarCalculadora && alterarHp !== "") {
        const primeiroCaractere =
            alterarHp.charAt(0);

        const temOperadorExplicito =
            primeiroCaractere === "+" ||
            primeiroCaractere === "-" ||
            primeiroCaractere === "=";

        // Sem sinal, o valor é interpretado como CURA.
        // Ex.: 50 = +50 HP.
        const operador =
            temOperadorExplicito
                ? primeiroCaractere
                : "+";

        const textoValor =
            temOperadorExplicito
                ? alterarHp.substring(1)
                : alterarHp;

        const valor =
            Number(textoValor);

        if (Number.isNaN(valor)) {
            alert(
                "Valor da calculadora inválido."
            );

            return null;
        }

        const fatorDano =
            Number(
                document
                    .querySelector("#multiplicadorHp")
                    ?.value ?? 1
            ) || 1;

        if (operador === "+") {
            hpAtual += valor;
        }

        else if (operador === "-") {
            // Primeiro aplica Super Efetivo / Resistente.
            let danoCalculado =
                Math.floor(valor * fatorDano);

            // Depois aplica a defesa de estágio conforme o tipo do Move.
            // DEF e DEFSP usam a mesma regra visual da página de buffs:
            // bônus = estágio × proficiência.
            const tipoMove =
                document
                    .querySelector("#tipoMoveHpSelecionado")
                    ?.value || "neutro";

            const proficienciaAtual =
                Number(
                    document.querySelector("#proficiencia")?.value ??
                    document.querySelector("#treinadorProficiencia")?.value ??
                    0
                ) || 0;

            let estagioDefesa = 0;

            if (tipoMove === "fisico") {
                estagioDefesa =
                    Number(
                        document.querySelector("#estagioDefHp")?.value ?? 0
                    ) || 0;
            }
            else if (tipoMove === "especial") {
                estagioDefesa =
                    Number(
                        document.querySelector("#estagioDefSpHp")?.value ?? 0
                    ) || 0;
            }

            const bonusDefesa =
                estagioDefesa * proficienciaAtual;

            // Defesa positiva reduz o dano; defesa negativa aumenta.
            // Dano nunca fica abaixo de 0.
            danoCalculado = Math.max(
                0,
                Math.floor(danoCalculado - bonusDefesa)
            );

            hpAtual -= danoCalculado;
        }

        else if (operador === "=") {
            hpAtual = valor;
        }

        else {
            alert(
                "Use -34 para dano, 20 ou +20 para cura, ou =50 para definir o HP."
            );

            return null;
        }
    }

    hpAtual =
        Math.max(
            0,
            Math.min(
                hpAtual,
                hpMax
            )
        );

    return {
        hpAtual,
        hpMax,
        ca,
        calculadoraAplicada: aplicarCalculadora && alterarHp !== ""
    };
}

// =====================================================
// ATRIBUTOS
// =====================================================

function criarLinhaAtributos(
  titulo,
  tipo,
  valores
) {
  const ehSalvaguarda =
    tipo.includes("save");

  const ehModificador =
    tipo.includes("mod");

  const rolavel =
    ehSalvaguarda || ehModificador;

  const caixas =
    ATRIBUTOS.map(
      (atributo) => {

        const tipoRolagem =
          ehSalvaguarda
            ? "Salvaguarda"
            : "Modificador";

        const botao =
          rolavel
            ? `
              <button
                type="button"
                class="rolarAtributo"
                data-campo="${tipo}-${atributo}"
                data-atributo="${atributo}"
                data-tipo-rolagem="${tipoRolagem}"
                title="Rolar ${tipoRolagem.toLowerCase()} de ${NOMES_ATRIBUTOS[atributo]}"
                style="
                  width:100%;
                  margin-top:4px;
                  padding:4px 2px;
                  box-sizing:border-box;
                  font-size:9px;
                  font-weight:bold;
                  cursor:pointer;
                "
              >
                🎲 Rolar
              </button>
            `
            : "";

        return `
          <div style="
            flex:1;
            min-width:42px;
            text-align:center;
          ">

            <div style="
              font-size:11px;
              font-weight:bold;
              margin-bottom:4px;
            ">
              ${atributo.toUpperCase()}
            </div>

            <input
              id="${tipo}-${atributo}"
              type="text"
              value="${esc(valores[atributo])}"
              placeholder="+0"
              style="
                width:100%;
                box-sizing:border-box;
                text-align:center;
                padding:5px 2px;
              "
            >

            ${botao}

          </div>
        `;
      }
    ).join("");

  return `
    <div style="
      margin-top:12px;
    ">
      <div style="
        font-weight:bold;
        margin-bottom:6px;
      ">
        ${titulo}
      </div>

      <div style="
        display:flex;
        gap:4px;
        width:100%;
      ">
        ${caixas}
      </div>
    </div>
  `;
}

function ativarRolagensSalvaguarda(token) {
  document
    .querySelectorAll(".rolarAtributo")
    .forEach(
      (botao) => {

        botao.addEventListener(
          "click",
          async () => {

            const atributo =
              botao.dataset.atributo;

            const tipoRolagem =
              botao.dataset.tipoRolagem ||
              "Modificador";

            const campo =
              document.querySelector(
                `#${botao.dataset.campo}`
              );

            let valorRolagem =
              campo?.value;

            // EVAS: cada estágio concede +1 em TODAS as salvaguardas.
            // O valor salvo na ficha continua sendo o valor-base, evitando
            // somar o bônus novamente a cada autosave.
            if (tipoRolagem === "Salvaguarda") {
              const valorBase =
                Number(
                  String(campo?.value ?? "")
                    .trim()
                    .replace(",", ".")
                );

              if (Number.isNaN(valorBase)) {
                alert(
                  "Valor de salvaguarda inválido."
                );

                return;
              }

              const estagioEvasao =
                Number(
                  token?.metadata?.[
                    `${PREFIX}/buff-evas`
                  ] ?? 0
                ) || 0;

              valorRolagem =
                valorBase + estagioEvasao;
            }

            const formula =
              formulaSalvaguarda(
                valorRolagem
              );

            if (!formula) {
              alert(
                `Valor de ${tipoRolagem.toLowerCase()} inválido.`
              );

              return;
            }

            await rolarNoDicePlus(
              formula,
              `${tipoRolagem} de ${
                NOMES_ATRIBUTOS[atributo] ||
                atributo.toUpperCase()
              }`
            );
          }
        );
      }
    );
}

function ativarRolagemIniciativa(token) {
  const botaoRolar =
    document.querySelector("#rolarIniciativa");

  const campoIniciativa =
    document.querySelector("#iniciativa");

  const campoDestreza =
    document.querySelector("#treinador-mod-des") ||
    document.querySelector("#mod-des");

  const campoProficiencia =
    document.querySelector("#treinadorProficiencia") ||
    document.querySelector("#proficiencia");

  const campoAlerta =
    document.querySelector("#iniciativaAlerta");

  const campoHabilidade =
    document.querySelector("#iniciativaHabilidade");

  const botaoAlerta =
    document.querySelector("#botaoIniciativaAlerta");

  const botaoHabilidade =
    document.querySelector("#botaoIniciativaHabilidade");

  if (
    !botaoRolar ||
    !campoIniciativa ||
    !campoDestreza ||
    !campoAlerta ||
    !campoHabilidade ||
    !botaoAlerta ||
    !botaoHabilidade
  ) {
    return;
  }

  const numeroCampo = (valor) => {
    const numero = Number(
      String(valor ?? "")
        .trim()
        .replace(",", ".")
    );

    return Number.isNaN(numero) ? 0 : numero;
  };

  const iniciativaTotal = () => {
    const destreza =
      numeroCampo(campoDestreza.value);

    const proficiencia =
      numeroCampo(campoProficiencia?.value);

    const bonusAlerta =
      campoAlerta.value === "1"
        ? 5
        : 0;

    const bonusHabilidade =
      campoHabilidade.value === "1"
        ? proficiencia * 2
        : 0;

    // VEL: cada estágio concede +1x Proficiência na iniciativa.
    // Estágios negativos também reduzem a iniciativa.
    const estagioVelocidade =
      Number(
        token?.metadata?.[
          `${PREFIX}/buff-vel`
        ] ?? 0
      ) || 0;

    const bonusVelocidade =
      estagioVelocidade * proficiencia;

    return (
      destreza +
      bonusVelocidade +
      bonusAlerta +
      bonusHabilidade
    );
  };

  const atualizarVisual = () => {
    const total = iniciativaTotal();

    campoIniciativa.value = String(total);

    botaoAlerta.classList.toggle(
      "ativo",
      campoAlerta.value === "1"
    );

    botaoHabilidade.classList.toggle(
      "ativo",
      campoHabilidade.value === "1"
    );
  };

  const salvarEstado = () => {
    const botaoSalvarStatus =
      document.querySelector(
        "#salvarPokemonStatus, #salvarTreinadorStatus"
      );

    if (botaoSalvarStatus) {
      botaoSalvarStatus.click();
    }
  };

  const alternar = (campo) => {
    campo.value =
      campo.value === "1"
        ? "0"
        : "1";

    atualizarVisual();
    salvarEstado();
  };

  campoDestreza.addEventListener(
    "input",
    atualizarVisual
  );

  campoDestreza.addEventListener(
    "change",
    atualizarVisual
  );

  if (campoProficiencia) {
    campoProficiencia.addEventListener(
      "input",
      atualizarVisual
    );

    campoProficiencia.addEventListener(
      "change",
      atualizarVisual
    );
  }

  botaoAlerta.addEventListener(
    "click",
    () => alternar(campoAlerta)
  );

  botaoHabilidade.addEventListener(
    "click",
    () => alternar(campoHabilidade)
  );

  botaoRolar.addEventListener(
    "click",
    async () => {
      const formula =
        formulaSalvaguarda(
          iniciativaTotal()
        );

      if (!formula) {
        alert(
          "Não foi possível calcular a iniciativa."
        );

        return;
      }

      await rolarNoDicePlus(
        formula,
        "Iniciativa"
      );
    }
  );

  atualizarVisual();
}

// =====================================================
// BUFFS POKÉMON
// =====================================================

function criarBuffs(
  valores,
  proficiencia
) {
  return BUFFS.map(
    (buff) => {

      const estagio =
        Number(
          valores[buff.id]
        ) || 0;

      const bonus =
        buff.id === "crit"
          ? faixaCritico(estagio)
          : buff.id === "evas"
            ? estagio
            : estagio * proficiencia;

      return `
        <div style="
          width:76px;
          text-align:center;
        ">

          <div style="
            font-size:11px;
            font-weight:bold;
            margin-bottom:4px;
          ">
            ${buff.nome}
          </div>

          <input
            id="buff-${buff.id}"
            class="campoBuff"
            type="number"
            step="1"
            ${buff.id === "crit" ? 'min="0" max="6"' : ''}
            value="${estagio}"
            style="
              width:100%;
              box-sizing:border-box;
              text-align:center;
              padding:5px;
            "
          >

          <div
            id="bonus-${buff.id}"
            style="
              font-size:11px;
              margin-top:3px;
              opacity:0.8;
            "
          >
            ${buff.id === "crit" ? bonus : formatarBonus(bonus)}
          </div>

        </div>
      `;
    }
  ).join("");
}

// =====================================================
// PERÍCIAS DO TREINADOR
// =====================================================

function criarPericias(
    valores
) {
    return PERICIAS.map(
        (grupo) => {

            if (!grupo.pericias.length) {
                return `
          <div style="
            margin-bottom:12px;
            border:1px solid #555;
            border-radius:6px;
            padding:8px;
          ">

            <strong>
              ${grupo.atributo} —
              ${grupo.nomeAtributo}
            </strong>

            <div style="
              font-size:12px;
              opacity:0.7;
              margin-top:5px;
            ">
              Nenhuma perícia
            </div>

          </div>
        `;
            }

            const linhas =
                grupo.pericias.map(
                    (pericia) => `
            <div style="
              display:flex;
              align-items:center;
              justify-content:space-between;
              gap:8px;
              margin-bottom:6px;
            ">

              <span style="
                flex:1;
                font-size:13px;
              ">
                ${pericia.nome}
              </span>

              <input
                id="pericia-${pericia.id}"
                type="text"
                value="${esc(valores[pericia.id])}"
                placeholder="+0"
                style="
                  width:60px;
                  box-sizing:border-box;
                  text-align:center;
                  padding:5px;
                "
              >

            </div>
          `
                ).join("");

            return `
        <div style="
          margin-bottom:12px;
          border:1px solid #555;
          border-radius:6px;
          padding:8px;
        ">

          <div style="
            font-weight:bold;
            margin-bottom:8px;
          ">
            ${grupo.atributo} —
            ${grupo.nomeAtributo}
          </div>

          ${linhas}

        </div>
      `;
        }
    ).join("");
}

// =====================================================
// CAMPOS DA ABA EXTRA
// =====================================================

function criarSlots(
    quantidade,
    prefixo,
    valores,
    placeholder
) {
    let html = "";

    for (
        let i = 1;
        i <= quantidade;
        i++
    ) {
        html += `
      <input
        id="${prefixo}${i}"
        type="text"
        value="${esc(
            valores[i] ?? ""
        )}"
        placeholder="${placeholder} ${i}"
        style="
          width:100%;
          box-sizing:border-box;
          padding:7px;
          margin-bottom:6px;
        "
      >
    `;
    }

    return html;
}

// =====================================================
// CALCULADORA DE HP
// =====================================================

function ativarCalculadoraHp() {
    const botaoSuper =
        document.querySelector("#botaoSuperEfetivo");

    const opcoesSuper =
        document.querySelector("#opcoesSuperEfetivo");

    const botaoResistente =
        document.querySelector("#botaoResistente");

    const opcoesResistente =
        document.querySelector("#opcoesResistente");

    const multiplicador =
        document.querySelector("#multiplicadorHp");

    const botaoMove =
        document.querySelector("#botaoMove");

    const opcoesMove =
        document.querySelector("#opcoesMove");

    const tipoMoveSelecionado =
        document.querySelector("#tipoMoveHpSelecionado");

    const botaoCalcular =
        document.querySelector("#botaoCalcularHp");

    if (
        !botaoSuper ||
        !opcoesSuper ||
        !botaoResistente ||
        !opcoesResistente ||
        !multiplicador ||
        !botaoMove ||
        !opcoesMove ||
        !tipoMoveSelecionado ||
        !botaoCalcular
    ) {
        return;
    }

    const atualizarVisual = () => {
        const fator =
            Number(multiplicador.value) || 1;

        botaoSuper.classList.remove(
            "super2",
            "super4"
        );

        botaoResistente.classList.remove(
            "resistente2",
            "resistente4"
        );

        if (fator === 2) {
            botaoSuper.classList.add("super2");
            botaoSuper.textContent = "Super Efetivo 2x";
        }
        else if (fator === 4) {
            botaoSuper.classList.add("super4");
            botaoSuper.textContent = "Super Efetivo 4x";
        }
        else {
            botaoSuper.textContent = "Super Efetivo";
        }

        if (fator === 0.5) {
            botaoResistente.classList.add("resistente2");
            botaoResistente.textContent = "Resistente 2x";
        }
        else if (fator === 0.25) {
            botaoResistente.classList.add("resistente4");
            botaoResistente.textContent = "Resistente 4x";
        }
        else {
            botaoResistente.textContent = "Resistente";
        }

        const tipoMove =
            tipoMoveSelecionado.value || "neutro";

        botaoMove.classList.remove(
            "moveFisico",
            "moveEspecial"
        );

        if (tipoMove === "fisico") {
            botaoMove.classList.add("moveFisico");
            botaoMove.textContent = "Move Físico";
        }
        else if (tipoMove === "especial") {
            botaoMove.classList.add("moveEspecial");
            botaoMove.textContent = "Move Especial";
        }
        else {
            botaoMove.textContent = "Move";
        }

        document
            .querySelectorAll(".tipoMoveHp")
            .forEach((opcao) => {
                opcao.classList.toggle(
                    "ativo",
                    opcao.dataset.tipo === tipoMove
                );
            });

        document
            .querySelectorAll(
                ".multiplicadorSuperEfetivo"
            )
            .forEach((opcao) => {
                opcao.classList.toggle(
                    "ativo",
                    Number(opcao.dataset.fator) === fator
                );
            });

        document
            .querySelectorAll(
                ".divisorResistente"
            )
            .forEach((opcao) => {
                opcao.classList.toggle(
                    "ativo",
                    Number(opcao.dataset.fator) === fator
                );
            });
    };

    botaoSuper.addEventListener("click", () => {
        opcoesResistente.classList.remove("aberto");
        opcoesMove.classList.remove("aberto");
        opcoesSuper.classList.toggle("aberto");
    });

    botaoResistente.addEventListener("click", () => {
        opcoesSuper.classList.remove("aberto");
        opcoesMove.classList.remove("aberto");
        opcoesResistente.classList.toggle("aberto");
    });

    botaoMove.addEventListener("click", () => {
        opcoesSuper.classList.remove("aberto");
        opcoesResistente.classList.remove("aberto");
        opcoesMove.classList.toggle("aberto");
    });

    document
        .querySelectorAll(
            ".multiplicadorSuperEfetivo"
        )
        .forEach((opcao) => {
            opcao.addEventListener("click", () => {
                multiplicador.value =
                    opcao.dataset.fator || "1";

                atualizarVisual();
                opcoesSuper.classList.remove("aberto");
            });
        });

    document
        .querySelectorAll(
            ".divisorResistente"
        )
        .forEach((opcao) => {
            opcao.addEventListener("click", () => {
                multiplicador.value =
                    opcao.dataset.fator || "1";

                atualizarVisual();
                opcoesResistente.classList.remove("aberto");
            });
        });

    document
        .querySelectorAll(".tipoMoveHp")
        .forEach((opcao) => {
            opcao.addEventListener("click", () => {
                tipoMoveSelecionado.value =
                    opcao.dataset.tipo || "neutro";

                atualizarVisual();
                opcoesMove.classList.remove("aberto");
            });
        });

    botaoCalcular.addEventListener("click", () => {
        const campoCalculadora =
            document.querySelector("#alterarHp");

        if (!campoCalculadora?.value.trim()) {
            alert("Digite um valor na Calculadora antes de calcular.");
            return;
        }

        const botaoSalvarStatus =
            document.querySelector(
                "#salvarPokemonStatus, #salvarTreinadorStatus"
            );

        if (!botaoSalvarStatus) {
            return;
        }

        botaoSalvarStatus.dataset.aplicarCalculadora = "1";
        botaoSalvarStatus.click();
    });

    atualizarVisual();
}

// =====================================================
// AUTOSAVE
// =====================================================

const IDS_BOTOES_AUTOSAVE = [
    "salvarPokemonStatus",
    "salvarPokemonMoves",
    "salvarPokemonPericias",
    "salvarPokemonTalentos",
    "salvarTreinadorStatus",
    "salvarTreinadorPerTal",
    "salvarTreinadorHabilidades",
    "salvarTreinadorAnotacoes"
];

function ativarAutosaveDaTela() {
    const app = document.querySelector("#app");

    if (!app) {
        return;
    }

    const botaoSalvar = IDS_BOTOES_AUTOSAVE
        .map((id) => document.querySelector(`#${id}`))
        .find(Boolean);

    if (!botaoSalvar || botaoSalvar.dataset.autosaveAtivo === "1") {
        return;
    }

    botaoSalvar.dataset.autosaveAtivo = "1";
    botaoSalvar.style.display = "none";

    let temporizador = null;

    const programarSalvamento = (atraso = 650) => {
        if (temporizador) {
            clearTimeout(temporizador);
        }

        temporizador = setTimeout(() => {
            // A aba pode ter sido trocada durante o debounce.
            if (!document.body.contains(botaoSalvar)) {
                return;
            }

            botaoSalvar.click();
        }, atraso);
    };

    app.querySelectorAll("input, textarea, select")
        .forEach((campo) => {
            // A Calculadora só pode alterar o HP quando o botão CALCULAR
            // for pressionado. Digitar, sair do campo ou trocar opções não
            // executa dano/cura automaticamente.
            if (campo.id === "alterarHp") {
                return;
            }

            campo.addEventListener("input", () => {
                programarSalvamento(650);
            });

            campo.addEventListener("change", () => {
                programarSalvamento(200);
            });
        });

    // Categoria físico/especial altera um input hidden por código,
    // portanto também precisa disparar o autosave explicitamente.
    app.querySelectorAll(".categoriaGolpe")
        .forEach((botao) => {
            botao.addEventListener("click", () => {
                programarSalvamento(120);
            });
        });
}

// =====================================================
// DEFINE TIPO
// =====================================================

async function definirTipoFicha(
    token,
    tipo
) {
    await OBR.scene.items.updateItems(
        [token.id],
        (items) => {

            for (const item of items) {
                item.metadata[
                    `${PREFIX}/tipoFicha`
                ] = tipo;
            }
        }
    );
}

// =====================================================
// ESCOLHER TIPO
// =====================================================

function mostrarEscolhaFicha(
    token
) {
    const app =
        document.querySelector(
            "#app"
        );

    app.innerHTML = `
    ${ESTILO_FICHA}
    <div style="
      text-align:center;
      padding-top:30px;
    ">

      <h2>
        ${esc(
            token.name ||
            "Token"
        )}
      </h2>

      <p>
        Escolha o tipo de ficha
      </p>

      <button
        id="abrirPokemon"
        style="
          width:100%;
          padding:14px;
          margin-bottom:10px;
          font-size:16px;
          font-weight:bold;
          cursor:pointer;
        "
      >
        🐾 POKÉMON
      </button>

      <button
        id="abrirTreinador"
        style="
          width:100%;
          padding:14px;
          font-size:16px;
          font-weight:bold;
          cursor:pointer;
        "
      >
        👤 TREINADOR
      </button>

    </div>
  `;

    document
        .querySelector(
            "#abrirPokemon"
        )
        .addEventListener(
            "click",
            async () => {

                await definirTipoFicha(
                    token,
                    "pokemon"
                );

                const tokenAtualizado =
                    await pegarTokenAtualizado(
                        token.id
                    );

                mostrarFichaPokemon(
                    tokenAtualizado || token
                );
            }
        );

    document
        .querySelector(
            "#abrirTreinador"
        )
        .addEventListener(
            "click",
            async () => {

                await definirTipoFicha(
                    token,
                    "treinador"
                );

                mostrarFichaTreinadorPagina1(
                    token
                );
            }
        );
}

// =====================================================
// TROCAR TIPO
// =====================================================

async function trocarTipoFicha(
    token
) {
    await OBR.scene.items.updateItems(
        [token.id],
        (items) => {

            for (const item of items) {
                delete item.metadata[
                    `${PREFIX}/tipoFicha`
                ];
            }
        }
    );

    mostrarEscolhaFicha(
        token
    );
}

// =====================================================
// MENU TREINADOR
// =====================================================

function menuTreinador(
    paginaAtual
) {
    return `
    <div class="fichaAbas" style="
      display:flex;
      gap:6px;
      margin-bottom:15px;
      flex-wrap:wrap;
    ">

      <button
        id="paginaTreinador1"
        style="
          flex:1;
          min-width:72px;
          padding:8px 4px;
          font-size:11px;
          font-weight:bold;
          cursor:pointer;
          opacity:${paginaAtual === 1 ? "1" : "0.65"};
        "
      >
        STATUS
      </button>

      <button
        id="paginaTreinador2"
        style="
          flex:1;
          min-width:72px;
          padding:8px 4px;
          font-size:11px;
          font-weight:bold;
          cursor:pointer;
          opacity:${paginaAtual === 2 ? "1" : "0.65"};
        "
      >
        PER / TAL
      </button>

      <button
        id="paginaTreinador3"
        style="
          flex:1;
          min-width:86px;
          padding:8px 4px;
          font-size:11px;
          font-weight:bold;
          cursor:pointer;
          opacity:${paginaAtual === 3 ? "1" : "0.65"};
        "
      >
        HABILIDADES
      </button>

      <button
        id="paginaTreinador4"
        style="
          flex:1;
          min-width:86px;
          padding:8px 4px;
          font-size:11px;
          font-weight:bold;
          cursor:pointer;
          opacity:${paginaAtual === 4 ? "1" : "0.65"};
        "
      >
        ANOTAÇÕES
      </button>

    </div>
  `;
}

function cabecalhoTreinador(
    token,
    paginaAtual
) {
    const imagemToken =
        token.type === "IMAGE"
            ? token.image?.url || ""
            : "";

    return `
    <div class="fichaCabecalho" style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:10px;
      margin-bottom:10px;
    ">

      <div class="fichaIdentidade" style="
        display:flex;
        align-items:center;
        gap:10px;
        min-width:0;
        flex:1;
      ">

        ${
            imagemToken
                ? `
                    <div style="
                      width:72px;
                      height:72px;
                      flex:0 0 72px;
                      display:flex;
                      align-items:center;
                      justify-content:center;
                      overflow:hidden;
                      border-radius:14px;
                      border:2px solid #4C8DFF;
                      background:#f3f6fb;
                      box-sizing:border-box;
                      padding:4px;
                    ">
                      <img
                        src="${esc(imagemToken)}"
                        alt="${esc(token.name || "Treinador")}"
                        style="
                          width:100%;
                          height:100%;
                          object-fit:contain;
                          display:block;
                        "
                      >
                    </div>
                `
                : `
                    <div style="
                      width:72px;
                      height:72px;
                      flex:0 0 72px;
                      display:flex;
                      align-items:center;
                      justify-content:center;
                      border-radius:14px;
                      border:2px solid #4C8DFF;
                      background:#f3f6fb;
                      box-sizing:border-box;
                      font-size:30px;
                    ">
                      👤
                    </div>
                `
        }

        <div style="
          min-width:0;
          flex:1;
        ">
          <div style="
            font-size:24px;
            font-weight:700;
            line-height:1.1;
            word-break:break-word;
          ">
            ${esc(token.name || "Treinador")}
          </div>

          <div style="
            font-size:12px;
            opacity:0.75;
            margin-top:2px;
            letter-spacing:0.4px;
          ">
            TREINADOR
          </div>
        </div>
      </div>

      <button
        id="trocarTipo"
        style="
          font-size:11px;
          cursor:pointer;
          white-space:nowrap;
        "
      >
        Trocar tipo
      </button>

    </div>

    ${menuTreinador(paginaAtual)}
  `;
}

function ativarCabecalhoTreinador(
    token
) {
    document
        .querySelector(
            "#trocarTipo"
        )
        .addEventListener(
            "click",
            () =>
                trocarTipoFicha(
                    token
                )
        );

    ativarMenuTreinador(
        token
    );
}

function ativarMenuTreinador(
    token
) {
    document
        .querySelector(
            "#paginaTreinador1"
        )
        .addEventListener(
            "click",
            async () => {

                const tokenAtualizado =
                    await pegarTokenAtualizado(
                        token.id
                    );

                if (!tokenAtualizado) {
                    return;
                }

                mostrarFichaTreinadorPagina1(
                    tokenAtualizado
                );
            }
        );

    document
        .querySelector(
            "#paginaTreinador2"
        )
        .addEventListener(
            "click",
            async () => {

                const tokenAtualizado =
                    await pegarTokenAtualizado(
                        token.id
                    );

                if (!tokenAtualizado) {
                    return;
                }

                mostrarFichaTreinadorPerTal(
                    tokenAtualizado
                );
            }
        );

    document
        .querySelector(
            "#paginaTreinador3"
        )
        .addEventListener(
            "click",
            async () => {

                const tokenAtualizado =
                    await pegarTokenAtualizado(
                        token.id
                    );

                if (!tokenAtualizado) {
                    return;
                }

                mostrarFichaTreinadorHabilidades(
                    tokenAtualizado
                );
            }
        );

    document
        .querySelector(
            "#paginaTreinador4"
        )
        .addEventListener(
            "click",
            async () => {

                const tokenAtualizado =
                    await pegarTokenAtualizado(
                        token.id
                    );

                if (!tokenAtualizado) {
                    return;
                }

                mostrarFichaTreinadorAnotacoes(
                    tokenAtualizado
                );
            }
        );
}

// =====================================================
// PERÍCIAS DO TREINADOR COM ROLAGEM
// =====================================================

function criarPericiasTreinador(
    valores
) {
    return PERICIAS.map(
        (grupo) => {

            if (!grupo.pericias.length) {
                return `
          <div style="
            margin-bottom:12px;
            border:1px solid #555;
            border-radius:6px;
            padding:8px;
          ">

            <strong>
              ${grupo.atributo} —
              ${grupo.nomeAtributo}
            </strong>

            <div style="
              font-size:12px;
              opacity:0.7;
              margin-top:5px;
            ">
              Nenhuma perícia
            </div>

          </div>
        `;
            }

            const linhas =
                grupo.pericias.map(
                    (pericia) => `
            <div style="
              display:flex;
              align-items:center;
              gap:6px;
              margin-bottom:7px;
            ">

              <span style="
                flex:1;
                font-size:13px;
              ">
                ${pericia.nome}
              </span>

              <input
                id="pericia-${pericia.id}"
                type="text"
                value="${esc(
                    valores[
                        pericia.id
                    ]
                )}"
                placeholder="+0"
                style="
                  width:60px;
                  box-sizing:border-box;
                  text-align:center;
                  padding:5px;
                "
              >

              <button
                type="button"
                class="rolarPericiaTreinador"
                data-pericia="${pericia.id}"
                data-nome="${esc(
                    pericia.nome
                )}"
                style="
                  width:72px;
                  padding:5px 3px;
                  box-sizing:border-box;
                  font-size:10px;
                  font-weight:bold;
                  cursor:pointer;
                "
              >
                🎲 Rolar
              </button>

            </div>
          `
                ).join("");

            return `
        <div style="
          margin-bottom:12px;
          border:1px solid #555;
          border-radius:6px;
          padding:8px;
        ">

          <div style="
            font-weight:bold;
            margin-bottom:8px;
          ">
            ${grupo.atributo} —
            ${grupo.nomeAtributo}
          </div>

          ${linhas}

        </div>
      `;
        }
    ).join("");
}

function ativarRolagensPericiasTreinador() {
    document
        .querySelectorAll(
            ".rolarPericiaTreinador"
        )
        .forEach(
            (botao) => {

                botao.addEventListener(
                    "click",
                    async () => {

                        const pericia =
                            botao.dataset.pericia;

                        const nome =
                            botao.dataset.nome ||
                            pericia;

                        const campo =
                            document.querySelector(
                                `#pericia-${pericia}`
                            );

                        const formula =
                            formulaSalvaguarda(
                                campo?.value
                            );

                        if (!formula) {
                            alert(
                                "Valor da perícia inválido."
                            );

                            return;
                        }

                        await rolarNoDicePlus(
                            formula,
                            `Perícia ${nome}`
                        );
                    }
                );
            }
        );
}

// =====================================================
// TREINADOR — ABA 1: STATUS
// =====================================================

function mostrarFichaTreinadorPagina1(
    token
) {
    const app =
        document.querySelector(
            "#app"
        );

    const hpAtual =
        token.metadata[
            `${PREFIX}/hpAtual`
        ] ?? 100;

    const hpMax =
        token.metadata[
            `${PREFIX}/hpMax`
        ] ?? 100;

    const ca =
        token.metadata[
            `${PREFIX}/ca`
        ] ?? 10;

    const proficiencia =
        token.metadata[
            `${PREFIX}/treinador-proficiencia`
        ] ?? 0;

    const bonusCaptura =
        token.metadata[
            `${PREFIX}/treinador-captura-bonus`
        ] ?? "";

    const modificadores = {};
    const salvaguardas = {};

    ATRIBUTOS.forEach(
        (atributo) => {

            modificadores[
                atributo
            ] =
                token.metadata[
                    `${PREFIX}/treinador-mod-${atributo}`
                ] ?? "";

            salvaguardas[
                atributo
            ] =
                token.metadata[
                    `${PREFIX}/treinador-save-${atributo}`
                ] ?? "";
        }
    );

    const iniciativaAlerta =
        token.metadata[
            `${PREFIX}/treinador-iniciativa-alerta`
        ] === true;

    const iniciativaHabilidade =
        token.metadata[
            `${PREFIX}/treinador-iniciativa-habilidade`
        ] === true;

    const estagioVelocidade =
        Number(
            token.metadata[
                `${PREFIX}/buff-vel`
            ] ?? 0
        ) || 0;

    const iniciativa =
        (Number(String(modificadores.des ?? "").replace(",", ".")) || 0) +
        (estagioVelocidade * (Number(proficiencia) || 0)) +
        (iniciativaAlerta ? 5 : 0) +
        (iniciativaHabilidade ? (Number(proficiencia) || 0) * 2 : 0);

    app.innerHTML = `
    ${ESTILO_FICHA}
    ${cabecalhoTreinador(
        token,
        1
    )}

    <div style="
      display:flex;
      gap:6px;
      align-items:flex-end;
      width:100%;
    ">
      <div style="flex:1; min-width:0;">
        <p>HP Atual</p>
        <input
          id="hpAtual"
          type="number"
          value="${hpAtual}"
          style="width:100%; box-sizing:border-box; text-align:center;"
        >
      </div>

      <div style="flex:1; min-width:0;">
        <p>HP Máx.</p>
        <input
          id="hpMax"
          type="number"
          value="${hpMax}"
          style="width:100%; box-sizing:border-box; text-align:center;"
        >
      </div>

      <div style="flex:1; min-width:0;">
        <p>CA</p>
        <input
          id="ca"
          type="number"
          value="${ca}"
          style="width:100%; box-sizing:border-box; text-align:center;"
        >
      </div>

      <div style="flex:1; min-width:0;">
        <p>Prof</p>
        <input
          id="treinadorProficiencia"
          type="number"
          min="0"
          step="1"
          value="${proficiencia}"
          style="width:100%; box-sizing:border-box; text-align:center;"
        >
      </div>

    </div>

    <div class="calculadoraHpLinha">
      <p class="calculadoraTitulo">Calculadora</p>

      <div class="calculadoraControles">
        <div class="calculadoraHpCampo">
          <input
            id="alterarHp"
            type="text"
            placeholder="-34, 20, =50"
          >
        </div>

      <div class="superEfetivoWrap">
        <button
          id="botaoSuperEfetivo"
          type="button"
        >
          Super Efetivo
        </button>

        <div
          id="opcoesSuperEfetivo"
          class="opcoesSuperEfetivo"
        >
          <button
            type="button"
            class="multiplicadorSuperEfetivo"
            data-fator="1"
          >
            Neutro
          </button>

          <button
            type="button"
            class="multiplicadorSuperEfetivo"
            data-fator="2"
          >
            2x
          </button>

          <button
            type="button"
            class="multiplicadorSuperEfetivo"
            data-fator="4"
          >
            4x
          </button>
        </div>
      </div>

      <div class="resistenteWrap">
        <button
          id="botaoResistente"
          type="button"
        >
          Resistente
        </button>

        <div
          id="opcoesResistente"
          class="opcoesResistente"
        >
          <button
            type="button"
            class="divisorResistente"
            data-fator="1"
          >
            Neutro
          </button>

          <button
            type="button"
            class="divisorResistente"
            data-fator="0.5"
          >
            2x
          </button>

          <button
            type="button"
            class="divisorResistente"
            data-fator="0.25"
          >
            4x
          </button>
        </div>
      </div>

      <div class="moveWrap">
        <button id="botaoMove" type="button">Move</button>
        <div id="opcoesMove" class="opcoesMove">
          <button type="button" class="tipoMoveHp" data-tipo="neutro">Neutro</button>
          <button type="button" class="tipoMoveHp" data-tipo="fisico">Físico</button>
          <button type="button" class="tipoMoveHp" data-tipo="especial">Especial</button>
        </div>
      </div>

      </div>

      <div class="calculadoraAcao">
        <button id="botaoCalcularHp" type="button">Calcular</button>
      </div>

      <input id="tipoMoveHpSelecionado" type="hidden" value="neutro">
      <input id="estagioDefHp" type="hidden" value="0">
      <input id="estagioDefSpHp" type="hidden" value="0">

      <input
        id="multiplicadorHp"
        type="hidden"
        value="1"
      >
    </div>

    <div class="iniciativaBloco">
      <p class="iniciativaTitulo">Iniciativa</p>

      <div class="iniciativaLinha">
        <input
          id="iniciativa"
          type="text"
          value="${esc(iniciativa)}"
          readonly
          title="Iniciativa = DES + (VEL × Prof) + Alerta + Habilidade"
        >

        <button
          id="rolarIniciativa"
          type="button"
          title="Rolar iniciativa"
        >🎲</button>

        <button
          id="botaoIniciativaAlerta"
          class="iniciativaCheck ${iniciativaAlerta ? "ativo" : ""}"
          type="button"
          title="Alerta: +5 na iniciativa"
        >
          <span class="iniciativaCheckBolinha">✓</span>
          <span>Alerta</span>
        </button>

        <button
          id="botaoIniciativaHabilidade"
          class="iniciativaCheck ${iniciativaHabilidade ? "ativo" : ""}"
          type="button"
          title="Habilidade: +2x Prof na iniciativa"
        >
          <span class="iniciativaCheckBolinha">✓</span>
          <span>Habilidade</span>
        </button>
      </div>

      <input
        id="iniciativaAlerta"
        type="hidden"
        value="${iniciativaAlerta ? "1" : "0"}"
      >

      <input
        id="iniciativaHabilidade"
        type="hidden"
        value="${iniciativaHabilidade ? "1" : "0"}"
      >
    </div>

    <hr>

    <h3>
      🎯 Captura
    </h3>

    <div style="
      display:flex;
      align-items:center;
      gap:8px;
      margin-bottom:12px;
    ">

      <input
        id="treinadorCapturaBonus"
        type="text"
        value="${esc(
            bonusCaptura
        )}"
        placeholder="+0"
        style="
          width:80px;
          box-sizing:border-box;
          text-align:center;
          padding:7px;
        "
      >

      <button
        id="rolarCaptura"
        type="button"
        style="
          flex:1;
          padding:8px;
          font-weight:bold;
          cursor:pointer;
        "
      >
        🎲 Rolar Captura
      </button>

    </div>

    <hr>

    ${criarLinhaAtributos(
        "Modificadores",
        "treinador-mod",
        modificadores
    )}

    ${criarLinhaAtributos(
        "Salva-guardas",
        "treinador-save",
        salvaguardas
    )}

    <br>

    <button
      id="salvarTreinadorStatus"
      style="
        width:100%;
        padding:10px;
        font-weight:bold;
        cursor:pointer;
      "
    >
      Salvar Status
    </button>
  `;

    ativarCabecalhoTreinador(
        token
    );

    ativarRolagensSalvaguarda(token);
    ativarRolagemIniciativa(token);
    ativarCalculadoraHp();

    document
        .querySelector(
            "#rolarCaptura"
        )
        .addEventListener(
            "click",
            async () => {

                const valor =
                    document
                        .querySelector(
                            "#treinadorCapturaBonus"
                        )
                        .value;

                const formula =
                    formulaSalvaguarda(
                        valor
                    );

                if (!formula) {
                    alert(
                        "Bônus de captura inválido."
                    );

                    return;
                }

                await rolarNoDicePlus(
                    formula,
                    "Captura"
                );
            }
        );

    document
        .querySelector(
            "#salvarTreinadorStatus"
        )
        .addEventListener(
            "click",
            async () => {

                const botaoSalvarStatus =
                    document.querySelector("#salvarTreinadorStatus");

                const aplicarCalculadora =
                    botaoSalvarStatus?.dataset.aplicarCalculadora === "1";

                if (botaoSalvarStatus) {
                    botaoSalvarStatus.dataset.aplicarCalculadora = "0";
                }

                const dados =
                    await pegarHpCaDaTela(aplicarCalculadora);

                if (!dados) {
                    return;
                }

                const novaProficiencia =
                    Number(
                        document
                            .querySelector(
                                "#treinadorProficiencia"
                            )
                            .value
                    ) || 0;

                const novaIniciativa =
                    document
                        .querySelector("#iniciativa")
                        .value
                        .trim();

                const iniciativaAlertaAtiva =
                    document
                        .querySelector("#iniciativaAlerta")
                        ?.value === "1";

                const iniciativaHabilidadeAtiva =
                    document
                        .querySelector("#iniciativaHabilidade")
                        ?.value === "1";

                const novoBonusCaptura =
                    document
                        .querySelector(
                            "#treinadorCapturaBonus"
                        )
                        .value
                        .trim();

                const novosModificadores =
                    {};

                const novasSalvaguardas =
                    {};

                ATRIBUTOS.forEach(
                    (atributo) => {

                        novosModificadores[
                            atributo
                        ] =
                            document
                                .querySelector(
                                    `#treinador-mod-${atributo}`
                                )
                                .value
                                .trim();

                        novasSalvaguardas[
                            atributo
                        ] =
                            document
                                .querySelector(
                                    `#treinador-save-${atributo}`
                                )
                                .value
                                .trim();
                    }
                );

                await OBR.scene.items.updateItems(
                    [token.id],
                    (items) => {

                        for (
                            const item
                            of items
                        ) {
                            item.metadata[
                                `${PREFIX}/hpAtual`
                            ] =
                                dados.hpAtual;

                            item.metadata[
                                `${PREFIX}/hpMax`
                            ] =
                                dados.hpMax;

                            item.metadata[
                                `${PREFIX}/ca`
                            ] =
                                dados.ca;

                            item.metadata[
                                `${PREFIX}/treinador-proficiencia`
                            ] =
                                novaProficiencia;


                            item.metadata[
                                `${PREFIX}/treinador-iniciativa`
                            ] =
                                novaIniciativa;

                            item.metadata[
                                `${PREFIX}/treinador-iniciativa-alerta`
                            ] =
                                iniciativaAlertaAtiva;

                            item.metadata[
                                `${PREFIX}/treinador-iniciativa-habilidade`
                            ] =
                                iniciativaHabilidadeAtiva;

                            item.metadata[
                                `${PREFIX}/treinador-captura-bonus`
                            ] =
                                novoBonusCaptura;

                            ATRIBUTOS.forEach(
                                (atributo) => {

                                    item.metadata[
                                        `${PREFIX}/treinador-mod-${atributo}`
                                    ] =
                                        novosModificadores[
                                            atributo
                                        ];

                                    item.metadata[
                                        `${PREFIX}/treinador-save-${atributo}`
                                    ] =
                                        novasSalvaguardas[
                                            atributo
                                        ];
                                }
                            );
                        }
                    }
                );

                document
                    .querySelector(
                        "#hpAtual"
                    )
                    .value =
                        dados.hpAtual;

                document
                    .querySelector(
                        "#hpMax"
                    )
                    .value =
                        dados.hpMax;

                if (dados.calculadoraAplicada) {
                    document
                        .querySelector(
                            "#alterarHp"
                        )
                        .value = "";
                }

                const bonusEvasaoHud =
                    Number(
                        token.metadata[
                            `${PREFIX}/buff-evas`
                        ] ?? 0
                    ) || 0;

                await criarStatusNoToken(
                    token,
                    dados.hpAtual,
                    dados.hpMax,
                    dados.ca + bonusEvasaoHud
                );
            }
        );
}

// =====================================================
// TREINADOR — ABA 2: PER / TAL
// =====================================================

function mostrarFichaTreinadorPerTal(
    token
) {
    const app =
        document.querySelector(
            "#app"
        );

    const valoresPericias = {};
    const talentos = {};

    PERICIAS.forEach(
        (grupo) => {

            grupo.pericias.forEach(
                (pericia) => {

                    valoresPericias[
                        pericia.id
                    ] =
                        token.metadata[
                            `${PREFIX}/pericia-${pericia.id}`
                        ] ?? "";
                }
            );
        }
    );

    for (
        let i = 1;
        i <= 5;
        i++
    ) {
        talentos[i] =
            token.metadata[
                `${PREFIX}/talento-${i}`
            ] ?? "";
    }

    app.innerHTML = `
    ${ESTILO_FICHA}
    ${cabecalhoTreinador(
        token,
        2
    )}

    <h3>
      Perícias
    </h3>

    ${criarPericiasTreinador(
        valoresPericias
    )}

    <hr>

    <h3>
      🎖️ Talentos
    </h3>

    <div style="
      margin-bottom:20px;
    ">

      ${criarSlots(
        5,
        "talento",
        talentos,
        "Talento"
      )}

    </div>

    <button
      id="salvarTreinadorPerTal"
      style="
        width:100%;
        padding:10px;
        font-weight:bold;
        cursor:pointer;
      "
    >
      Salvar Perícias / Talentos
    </button>
  `;

    ativarCabecalhoTreinador(
        token
    );

    ativarRolagensPericiasTreinador();

    document
        .querySelector(
            "#salvarTreinadorPerTal"
        )
        .addEventListener(
            "click",
            async () => {

                const novasPericias =
                    {};

                const novosTalentos =
                    {};

                PERICIAS.forEach(
                    (grupo) => {

                        grupo.pericias.forEach(
                            (pericia) => {

                                novasPericias[
                                    pericia.id
                                ] =
                                    document
                                        .querySelector(
                                            `#pericia-${pericia.id}`
                                        )
                                        .value
                                        .trim();
                            }
                        );
                    }
                );

                for (
                    let i = 1;
                    i <= 5;
                    i++
                ) {
                    novosTalentos[
                        i
                    ] =
                        document
                            .querySelector(
                                `#talento${i}`
                            )
                            .value
                            .trim();
                }

                await OBR.scene.items.updateItems(
                    [token.id],
                    (items) => {

                        for (
                            const item
                            of items
                        ) {
                            PERICIAS.forEach(
                                (grupo) => {

                                    grupo.pericias.forEach(
                                        (pericia) => {

                                            item.metadata[
                                                `${PREFIX}/pericia-${pericia.id}`
                                            ] =
                                                novasPericias[
                                                    pericia.id
                                                ];
                                        }
                                    );
                                }
                            );

                            for (
                                let i = 1;
                                i <= 5;
                                i++
                            ) {
                                item.metadata[
                                    `${PREFIX}/talento-${i}`
                                ] =
                                    novosTalentos[
                                        i
                                    ];
                            }
                        }
                    }
                );
            }
        );
}

// =====================================================
// TREINADOR — ABA 3: HABILIDADES
// =====================================================

function mostrarFichaTreinadorHabilidades(
    token
) {
    const app =
        document.querySelector(
            "#app"
        );

    const especializacoes = {};
    const habilidades = {};
    const rolagens = {};

    for (
        let i = 1;
        i <= 4;
        i++
    ) {
        especializacoes[i] =
            token.metadata[
                `${PREFIX}/especializacao-${i}`
            ] ?? "";
    }

    for (
        let i = 1;
        i <= 8;
        i++
    ) {
        habilidades[i] =
            token.metadata[
                `${PREFIX}/habilidade-treinador-${i}`
            ] ?? "";
    }

    for (
        let i = 1;
        i <= 3;
        i++
    ) {
        rolagens[i] =
            token.metadata[
                `${PREFIX}/rolagem-d6-${i}`
            ] ?? "";
    }

    let htmlRolagens = "";

    for (
        let i = 1;
        i <= 3;
        i++
    ) {
        htmlRolagens += `
      <div style="
        display:flex;
        gap:6px;
        margin-bottom:8px;
      ">

        <input
          id="rolagemD6-${i}"
          type="text"
          value="${esc(
            rolagens[i]
          )}"
          placeholder="Nome da rolagem"
          style="
            flex:1;
            box-sizing:border-box;
            padding:7px;
          "
        >

        <button
          type="button"
          class="rolarD6"
          data-rolagem="${i}"
          style="
            width:90px;
            cursor:pointer;
            font-weight:bold;
          "
        >
          🎲 ROLAR
        </button>

      </div>
    `;
    }

    app.innerHTML = `
    ${ESTILO_FICHA}
    ${cabecalhoTreinador(
        token,
        3
    )}

    <h3>
      🎯 Especializações
    </h3>

    <div style="
      margin-bottom:20px;
    ">

      ${criarSlots(
        4,
        "especializacao",
        especializacoes,
        "Especialização"
      )}

    </div>

    <h3>
      ⭐ Habilidades de Treinador
    </h3>

    <div style="
      margin-bottom:20px;
    ">

      ${criarSlots(
        8,
        "habilidadeTreinador",
        habilidades,
        "Habilidade"
      )}

    </div>

    <hr>

    <h3>
      🎲 Rolagens 1d6
    </h3>

    ${htmlRolagens}

    <br>

    <button
      id="salvarTreinadorHabilidades"
      style="
        width:100%;
        padding:10px;
        font-weight:bold;
        cursor:pointer;
      "
    >
      Salvar Habilidades
    </button>
  `;

    ativarCabecalhoTreinador(
        token
    );

    document
        .querySelectorAll(
            ".rolarD6"
        )
        .forEach(
            (botao) => {

                botao.addEventListener(
                    "click",
                    async () => {

                        const numero =
                            botao.dataset.rolagem;

                        const nome =
                            document
                                .querySelector(
                                    `#rolagemD6-${numero}`
                                )
                                .value
                                .trim();

                        if (!nome) {
                            alert(
                                "Coloque o nome da rolagem primeiro."
                            );

                            return;
                        }

                        await rolarNoDicePlus(
                            "1d6",
                            nome
                        );
                    }
                );
            }
        );

    document
        .querySelector(
            "#salvarTreinadorHabilidades"
        )
        .addEventListener(
            "click",
            async () => {

                const novasEspecializacoes =
                    {};

                const novasHabilidades =
                    {};

                const novasRolagens =
                    {};

                for (
                    let i = 1;
                    i <= 4;
                    i++
                ) {
                    novasEspecializacoes[
                        i
                    ] =
                        document
                            .querySelector(
                                `#especializacao${i}`
                            )
                            .value
                            .trim();
                }

                for (
                    let i = 1;
                    i <= 8;
                    i++
                ) {
                    novasHabilidades[
                        i
                    ] =
                        document
                            .querySelector(
                                `#habilidadeTreinador${i}`
                            )
                            .value
                            .trim();
                }

                for (
                    let i = 1;
                    i <= 3;
                    i++
                ) {
                    novasRolagens[
                        i
                    ] =
                        document
                            .querySelector(
                                `#rolagemD6-${i}`
                            )
                            .value
                            .trim();
                }

                await OBR.scene.items.updateItems(
                    [token.id],
                    (items) => {

                        for (
                            const item
                            of items
                        ) {
                            for (
                                let i = 1;
                                i <= 4;
                                i++
                            ) {
                                item.metadata[
                                    `${PREFIX}/especializacao-${i}`
                                ] =
                                    novasEspecializacoes[
                                        i
                                    ];
                            }

                            for (
                                let i = 1;
                                i <= 8;
                                i++
                            ) {
                                item.metadata[
                                    `${PREFIX}/habilidade-treinador-${i}`
                                ] =
                                    novasHabilidades[
                                        i
                                    ];
                            }

                            for (
                                let i = 1;
                                i <= 3;
                                i++
                            ) {
                                item.metadata[
                                    `${PREFIX}/rolagem-d6-${i}`
                                ] =
                                    novasRolagens[
                                        i
                                    ];
                            }
                        }
                    }
                );
            }
        );
}

// =====================================================
// TREINADOR — ABA 4: ANOTAÇÕES
// =====================================================

function mostrarFichaTreinadorAnotacoes(
    token
) {
    const app =
        document.querySelector(
            "#app"
        );

    const anotacoes =
        token.metadata[
            `${PREFIX}/treinador-anotacoes`
        ] ?? "";

    app.innerHTML = `
    ${ESTILO_FICHA}
    ${cabecalhoTreinador(
        token,
        4
    )}

    <h3>
      📝 Anotações
    </h3>

    <textarea
      id="treinadorAnotacoes"
      placeholder="Escreva aqui as anotações da sessão..."
      style="
        width:100%;
        min-height:520px;
        box-sizing:border-box;
        padding:10px;
        resize:vertical;
        font-family:Arial, sans-serif;
        line-height:1.4;
      "
    >${esc(
        anotacoes
    )}</textarea>

    <br><br>

    <button
      id="salvarTreinadorAnotacoes"
      style="
        width:100%;
        padding:10px;
        font-weight:bold;
        cursor:pointer;
      "
    >
      Salvar Anotações
    </button>
  `;

    ativarCabecalhoTreinador(
        token
    );

    document
        .querySelector(
            "#salvarTreinadorAnotacoes"
        )
        .addEventListener(
            "click",
            async () => {

                const novasAnotacoes =
                    document
                        .querySelector(
                            "#treinadorAnotacoes"
                        )
                        .value;

                await OBR.scene.items.updateItems(
                    [token.id],
                    (items) => {

                        for (
                            const item
                            of items
                        ) {
                            item.metadata[
                                `${PREFIX}/treinador-anotacoes`
                            ] =
                                novasAnotacoes;
                        }
                    }
                );
            }
        );
}

// =====================================================
// FICHA POKÉMON — MENU
// =====================================================

function menuPokemon(paginaAtual) {
    return `
    <div class="fichaAbas" style="
      display:flex;
      gap:6px;
      margin-bottom:15px;
      flex-wrap:wrap;
    ">
      <button
        id="paginaPokemon1"
        style="
          flex:1;
          min-width:70px;
          padding:8px 4px;
          font-size:11px;
          font-weight:bold;
          cursor:pointer;
          opacity:${paginaAtual === 1 ? "1" : "0.65"};
        "
      >
        STATUS
      </button>

      <button
        id="paginaPokemon2"
        style="
          flex:1;
          min-width:95px;
          padding:8px 4px;
          font-size:11px;
          font-weight:bold;
          cursor:pointer;
          opacity:${paginaAtual === 2 ? "1" : "0.65"};
        "
      >
        MOVES / BUFFS
      </button>

      <button
        id="paginaPokemon3"
        style="
          flex:1;
          min-width:75px;
          padding:8px 4px;
          font-size:11px;
          font-weight:bold;
          cursor:pointer;
          opacity:${paginaAtual === 3 ? "1" : "0.65"};
        "
      >
        PERÍCIAS
      </button>

      <button
        id="paginaPokemon4"
        style="
          flex:1;
          min-width:75px;
          padding:8px 4px;
          font-size:11px;
          font-weight:bold;
          cursor:pointer;
          opacity:${paginaAtual === 4 ? "1" : "0.65"};
        "
      >
        TALENTOS
      </button>
    </div>
  `;
}

// =====================================================
// BUSCA TOKEN ATUALIZADO
// =====================================================

async function pegarTokenAtualizado(tokenId) {
    const items =
        await OBR.scene.items.getItems(
            [tokenId]
        );

    if (
        !items ||
        items.length === 0
    ) {
        return null;
    }

    return items[0];
}

// =====================================================
// MENU POKÉMON
// =====================================================

function ativarMenuPokemon(token) {
    document
        .querySelector("#paginaPokemon1")
        .addEventListener(
            "click",
            async () => {

                const tokenAtualizado =
                    await pegarTokenAtualizado(
                        token.id
                    );

                if (!tokenAtualizado) {
                    return;
                }

                mostrarFichaPokemon(
                    tokenAtualizado
                );
            }
        );

    document
        .querySelector("#paginaPokemon2")
        .addEventListener(
            "click",
            async () => {

                const tokenAtualizado =
                    await pegarTokenAtualizado(
                        token.id
                    );

                if (!tokenAtualizado) {
                    return;
                }

                mostrarFichaPokemonMoves(
                    tokenAtualizado
                );
            }
        );

    document
        .querySelector("#paginaPokemon3")
        .addEventListener(
            "click",
            async () => {

                const tokenAtualizado =
                    await pegarTokenAtualizado(
                        token.id
                    );

                if (!tokenAtualizado) {
                    return;
                }

                mostrarFichaPokemonPericias(
                    tokenAtualizado
                );
            }
        );

    document
        .querySelector("#paginaPokemon4")
        .addEventListener(
            "click",
            async () => {

                const tokenAtualizado =
                    await pegarTokenAtualizado(
                        token.id
                    );

                if (!tokenAtualizado) {
                    return;
                }

                mostrarFichaPokemonTalentos(
                    tokenAtualizado
                );
            }
        );
}

function cabecalhoPokemon(
    token,
    paginaAtual
) {
    const imagemToken =
        token.type === "IMAGE"
            ? token.image?.url || ""
            : "";

    return `
    <div class="fichaCabecalho" style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:10px;
      margin-bottom:10px;
    ">

      <div class="fichaIdentidade" style="
        display:flex;
        align-items:center;
        gap:10px;
        min-width:0;
        flex:1;
      ">

        ${
            imagemToken
                ? `
                    <div style="
                      width:72px;
                      height:72px;
                      flex:0 0 72px;
                      display:flex;
                      align-items:center;
                      justify-content:center;
                      overflow:hidden;
                      border-radius:14px;
                      border:2px solid #4C8DFF;
                      background:#f3f6fb;
                      box-sizing:border-box;
                      padding:4px;
                    ">
                      <img
                        src="${esc(imagemToken)}"
                        alt="${esc(token.name || "Pokémon")}"
                        style="
                          width:100%;
                          height:100%;
                          object-fit:contain;
                          display:block;
                        "
                      >
                    </div>
                `
                : `
                    <div style="
                      width:72px;
                      height:72px;
                      flex:0 0 72px;
                      display:flex;
                      align-items:center;
                      justify-content:center;
                      border-radius:14px;
                      border:2px solid #4C8DFF;
                      background:#f3f6fb;
                      box-sizing:border-box;
                      font-size:30px;
                    ">
                      🐾
                    </div>
                `
        }

        <div style="
          min-width:0;
        ">
          <h2 style="
            margin:0;
            line-height:1.1;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
          ">
            ${esc(token.name || "Pokemon")}
          </h2>

          <div style="
            margin-top:5px;
            font-size:11px;
            opacity:0.65;
            font-weight:bold;
          ">
            POKÉMON
          </div>
        </div>

      </div>

      <button
        id="trocarTipo"
        style="
          font-size:11px;
          cursor:pointer;
          flex:0 0 auto;
          padding:6px 8px;
        "
      >
        Trocar tipo
      </button>

    </div>

    ${menuPokemon(paginaAtual)}
  `;
}


function ativarCabecalhoPokemon(token) {
    document
        .querySelector("#trocarTipo")
        .addEventListener(
            "click",
            () =>
                trocarTipoFicha(
                    token
                )
        );

    ativarMenuPokemon(token);
}

// =====================================================
// PERÍCIAS DO POKÉMON
// =====================================================

function criarPericiasPokemon(valores) {
    return PERICIAS.map(
        (grupo) => {

            if (!grupo.pericias.length) {
                return `
          <div style="
            margin-bottom:12px;
            border:1px solid #555;
            border-radius:6px;
            padding:8px;
          ">
            <strong>
              ${grupo.atributo} — ${grupo.nomeAtributo}
            </strong>

            <div style="
              font-size:12px;
              opacity:0.7;
              margin-top:5px;
            ">
              Nenhuma perícia
            </div>
          </div>
        `;
            }

            const linhas =
                grupo.pericias.map(
                    (pericia) => `
            <div style="
              display:flex;
              align-items:center;
              gap:6px;
              margin-bottom:7px;
            ">
              <span style="
                flex:1;
                font-size:13px;
              ">
                ${pericia.nome}
              </span>

              <input
                id="pokemon-pericia-${pericia.id}"
                type="text"
                value="${esc(valores[pericia.id])}"
                placeholder="+0"
                style="
                  width:60px;
                  box-sizing:border-box;
                  text-align:center;
                  padding:5px;
                "
              >

              <button
                type="button"
                class="rolarPericiaPokemon"
                data-pericia="${pericia.id}"
                data-nome="${esc(pericia.nome)}"
                style="
                  width:72px;
                  padding:5px 3px;
                  box-sizing:border-box;
                  font-size:10px;
                  font-weight:bold;
                  cursor:pointer;
                "
              >
                🎲 Rolar
              </button>
            </div>
          `
                ).join("");

            return `
        <div style="
          margin-bottom:12px;
          border:1px solid #555;
          border-radius:6px;
          padding:8px;
        ">
          <div style="
            font-weight:bold;
            margin-bottom:8px;
          ">
            ${grupo.atributo} — ${grupo.nomeAtributo}
          </div>

          ${linhas}
        </div>
      `;
        }
    ).join("");
}

function ativarRolagensPericiasPokemon() {
    document
        .querySelectorAll(
            ".rolarPericiaPokemon"
        )
        .forEach(
            (botao) => {

                botao.addEventListener(
                    "click",
                    async () => {

                        const pericia =
                            botao.dataset.pericia;

                        const nome =
                            botao.dataset.nome ||
                            pericia;

                        const campo =
                            document.querySelector(
                                `#pokemon-pericia-${pericia}`
                            );

                        const formula =
                            formulaSalvaguarda(
                                campo?.value
                            );

                        if (!formula) {
                            alert(
                                "Valor da perícia inválido."
                            );

                            return;
                        }

                        await rolarNoDicePlus(
                            formula,
                            `Perícia ${nome}`
                        );
                    }
                );
            }
        );
}

// =====================================================
// POKÉMON — ABA 1: STATUS
// =====================================================

function mostrarFichaPokemon(token) {
    const app =
        document.querySelector("#app");

    const hpAtual =
        token.metadata[
            `${PREFIX}/hpAtual`
        ] ?? 100;

    const hpMax =
        token.metadata[
            `${PREFIX}/hpMax`
        ] ?? 100;

    const ca =
        token.metadata[
            `${PREFIX}/ca`
        ] ?? 10;

    const habilidade =
        token.metadata[
            `${PREFIX}/pokemon-habilidade`
        ] ?? "";

    const movimento1 =
        token.metadata[
            `${PREFIX}/movimento1`
        ] ?? "";

    const movimento2 =
        token.metadata[
            `${PREFIX}/movimento2`
        ] ?? "";

    const movimento3 =
        token.metadata[
            `${PREFIX}/movimento3`
        ] ?? "";

    const proficiencia =
        Number(
            token.metadata[
                `${PREFIX}/proficiencia`
            ] ?? 0
        );


    const modificadores = {};
    const salvaguardas = {};

    ATRIBUTOS.forEach(
        (atributo) => {

            modificadores[atributo] =
                token.metadata[
                    `${PREFIX}/mod-${atributo}`
                ] ?? "";

            salvaguardas[atributo] =
                token.metadata[
                    `${PREFIX}/save-${atributo}`
                ] ?? "";
        }
    );

    const iniciativaAlerta =
        token.metadata[
            `${PREFIX}/iniciativa-alerta`
        ] === true;

    const iniciativaHabilidade =
        token.metadata[
            `${PREFIX}/iniciativa-habilidade`
        ] === true;

    const estagioVelocidade =
        Number(
            token.metadata[
                `${PREFIX}/buff-vel`
            ] ?? 0
        ) || 0;

    const iniciativa =
        (Number(String(modificadores.des ?? "").replace(",", ".")) || 0) +
        (estagioVelocidade * proficiencia) +
        (iniciativaAlerta ? 5 : 0) +
        (iniciativaHabilidade ? proficiencia * 2 : 0);

    app.innerHTML = `
    ${ESTILO_FICHA}
    ${cabecalhoPokemon(token, 1)}

    <div class="statusGrid" style="
      display:flex;
      gap:12px;
      align-items:flex-start;
      flex-wrap:wrap;
    ">
      <div class="statusCard" style="
        flex:1;
        min-width:120px;
      ">
        <div style="
          display:flex;
          gap:5px;
          align-items:flex-end;
          width:100%;
        ">
          <div style="flex:1; min-width:0;">
            <p>HP Atual</p>
            <input
              id="hpAtual"
              type="number"
              value="${hpAtual}"
              style="width:100%; box-sizing:border-box; text-align:center;"
            >
          </div>

          <div style="flex:1; min-width:0;">
            <p>HP Máx.</p>
            <input
              id="hpMax"
              type="number"
              value="${hpMax}"
              style="width:100%; box-sizing:border-box; text-align:center;"
            >
          </div>

          <div style="flex:0.8; min-width:0;">
            <p>CA</p>
            <input
              id="ca"
              type="number"
              value="${ca}"
              style="width:100%; box-sizing:border-box; text-align:center;"
            >
          </div>

          <div style="flex:0.8; min-width:0;">
            <p>Prof</p>
            <input
              id="proficiencia"
              type="number"
              min="0"
              step="1"
              value="${proficiencia}"
              style="width:100%; box-sizing:border-box; text-align:center;"
            >
          </div>

        </div>

            <div class="calculadoraHpLinha">
              <p class="calculadoraTitulo">Calculadora</p>

              <div class="calculadoraControles">
                <div class="calculadoraHpCampo">
                  <input
                    id="alterarHp"
                    type="text"
                    placeholder="-34, 20, =50"
                  >
                </div>
        
              <div class="superEfetivoWrap">
                <button
                  id="botaoSuperEfetivo"
                  type="button"
                >
                  Super Efetivo
                </button>
        
                <div
                  id="opcoesSuperEfetivo"
                  class="opcoesSuperEfetivo"
                >
                  <button
                    type="button"
                    class="multiplicadorSuperEfetivo"
                    data-fator="1"
                  >
                    Neutro
                  </button>

                  <button
                    type="button"
                    class="multiplicadorSuperEfetivo"
                    data-fator="2"
                  >
                    2x
                  </button>
        
                  <button
                    type="button"
                    class="multiplicadorSuperEfetivo"
                    data-fator="4"
                  >
                    4x
                  </button>
                </div>
              </div>

              <div class="resistenteWrap">
                <button
                  id="botaoResistente"
                  type="button"
                >
                  Resistente
                </button>

                <div
                  id="opcoesResistente"
                  class="opcoesResistente"
                >
                  <button
                    type="button"
                    class="divisorResistente"
                    data-fator="1"
                  >
                    Neutro
                  </button>

                  <button
                    type="button"
                    class="divisorResistente"
                    data-fator="0.5"
                  >
                    2x
                  </button>

                  <button
                    type="button"
                    class="divisorResistente"
                    data-fator="0.25"
                  >
                    4x
                  </button>
                </div>
              </div>
        
              <div class="moveWrap">
                <button id="botaoMove" type="button">Move</button>
                <div id="opcoesMove" class="opcoesMove">
                  <button type="button" class="tipoMoveHp" data-tipo="neutro">Neutro</button>
                  <button type="button" class="tipoMoveHp" data-tipo="fisico">Físico</button>
                  <button type="button" class="tipoMoveHp" data-tipo="especial">Especial</button>
                </div>
              </div>

              </div>

              <div class="calculadoraAcao">
                <button id="botaoCalcularHp" type="button">Calcular</button>
              </div>

              <input id="tipoMoveHpSelecionado" type="hidden" value="neutro">
              <input id="estagioDefHp" type="hidden" value="${Number(token.metadata[`${PREFIX}/buff-def`] ?? 0)}">
              <input id="estagioDefSpHp" type="hidden" value="${Number(token.metadata[`${PREFIX}/buff-defsp`] ?? 0)}">

              <input
                id="multiplicadorHp"
                type="hidden"
                value="1"
              >
            </div>

            <div class="iniciativaBloco">
              <p class="iniciativaTitulo">Iniciativa</p>

              <div class="iniciativaLinha">
                <input
                  id="iniciativa"
                  type="text"
                  value="${esc(iniciativa)}"
                  readonly
                  title="Iniciativa = DES + (VEL × Prof) + Alerta + Habilidade"
                >

                <button
                  id="rolarIniciativa"
                  type="button"
                  title="Rolar iniciativa"
                >🎲</button>

                <button
                  id="botaoIniciativaAlerta"
                  class="iniciativaCheck ${iniciativaAlerta ? "ativo" : ""}"
                  type="button"
                  title="Alerta: +5 na iniciativa"
                >
                  <span class="iniciativaCheckBolinha">✓</span>
                  <span>Alerta</span>
                </button>

                <button
                  id="botaoIniciativaHabilidade"
                  class="iniciativaCheck ${iniciativaHabilidade ? "ativo" : ""}"
                  type="button"
                  title="Habilidade: +2x Prof na iniciativa"
                >
                  <span class="iniciativaCheckBolinha">✓</span>
                  <span>Habilidade</span>
                </button>
              </div>

              <input
                id="iniciativaAlerta"
                type="hidden"
                value="${iniciativaAlerta ? "1" : "0"}"
              >

              <input
                id="iniciativaHabilidade"
                type="hidden"
                value="${iniciativaHabilidade ? "1" : "0"}"
              >
            </div>

      </div>

      <div class="statusCard" style="
        flex:1.6;
        min-width:180px;
      ">
        <p>Habilidade</p>

        <textarea
          id="habilidadePokemon"
          rows="5"
          placeholder="Escreva a habilidade do Pokémon..."
          style="
            width:100%;
            min-height:110px;
            box-sizing:border-box;
            padding:8px;
            resize:vertical;
          "
        >${esc(habilidade)}</textarea>

      </div>
    </div>

    <hr>

    <h3>Movimentação</h3>

    <div class="movimentoLinha" style="
      display:flex;
      gap:6px;
      flex-wrap:wrap;
    ">
      <input
        id="movimento1"
        type="text"
        value="${esc(movimento1)}"
        placeholder="Ex: 9m"
        style="width:75px;"
      >

      <input
        id="movimento2"
        type="text"
        value="${esc(movimento2)}"
        placeholder="Ex: Voo"
        style="width:75px;"
      >

      <input
        id="movimento3"
        type="text"
        value="${esc(movimento3)}"
        placeholder="Ex: Nado"
        style="width:75px;"
      >
    </div>

    <hr>

    ${criarLinhaAtributos(
        "Modificadores",
        "mod",
        modificadores
    )}

    ${criarLinhaAtributos(
        "Salva-guardas",
        "save",
        salvaguardas
    )}

    <br>

    <button
      id="salvarPokemonStatus"
      style="
        width:100%;
        padding:10px;
        font-weight:bold;
        cursor:pointer;
      "
    >
      Salvar Status
    </button>
  `;

    ativarCabecalhoPokemon(token);
    ativarRolagensSalvaguarda(token);
    ativarRolagemIniciativa(token);
    ativarCalculadoraHp();

    document
        .querySelector(
            "#salvarPokemonStatus"
        )
        .addEventListener(
            "click",
            async () => {

                const botaoSalvarStatus =
                    document.querySelector("#salvarPokemonStatus");

                const aplicarCalculadora =
                    botaoSalvarStatus?.dataset.aplicarCalculadora === "1";

                if (botaoSalvarStatus) {
                    botaoSalvarStatus.dataset.aplicarCalculadora = "0";
                }

                const dados =
                    await pegarHpCaDaTela(aplicarCalculadora);

                if (!dados) {
                    return;
                }

                const mov1 =
                    document
                        .querySelector("#movimento1")
                        .value
                        .trim();

                const mov2 =
                    document
                        .querySelector("#movimento2")
                        .value
                        .trim();

                const mov3 =
                    document
                        .querySelector("#movimento3")
                        .value
                        .trim();

                const novaHabilidade =
                    document
                        .querySelector("#habilidadePokemon")
                        .value
                        .trim();

                const novaProficiencia =
                    Number(
                        document
                            .querySelector("#proficiencia")
                            .value
                    ) || 0;


                const novaIniciativa =
                    document
                        .querySelector("#iniciativa")
                        .value
                        .trim();

                const iniciativaAlertaAtiva =
                    document
                        .querySelector("#iniciativaAlerta")
                        ?.value === "1";

                const iniciativaHabilidadeAtiva =
                    document
                        .querySelector("#iniciativaHabilidade")
                        ?.value === "1";

                const novosModificadores = {};
                const novasSalvaguardas = {};

                ATRIBUTOS.forEach(
                    (atributo) => {

                        novosModificadores[atributo] =
                            document
                                .querySelector(
                                    `#mod-${atributo}`
                                )
                                .value
                                .trim();

                        novasSalvaguardas[atributo] =
                            document
                                .querySelector(
                                    `#save-${atributo}`
                                )
                                .value
                                .trim();
                    }
                );

                await OBR.scene.items.updateItems(
                    [token.id],
                    (items) => {

                        for (const item of items) {

                            item.metadata[
                                `${PREFIX}/hpAtual`
                            ] =
                                dados.hpAtual;

                            item.metadata[
                                `${PREFIX}/hpMax`
                            ] =
                                dados.hpMax;

                            item.metadata[
                                `${PREFIX}/ca`
                            ] =
                                dados.ca;

                            item.metadata[
                                `${PREFIX}/pokemon-habilidade`
                            ] =
                                novaHabilidade;

                            item.metadata[
                                `${PREFIX}/movimento1`
                            ] =
                                mov1;

                            item.metadata[
                                `${PREFIX}/movimento2`
                            ] =
                                mov2;

                            item.metadata[
                                `${PREFIX}/movimento3`
                            ] =
                                mov3;

                            item.metadata[
                                `${PREFIX}/proficiencia`
                            ] =
                                novaProficiencia;


                            item.metadata[
                                `${PREFIX}/iniciativa`
                            ] =
                                novaIniciativa;

                            item.metadata[
                                `${PREFIX}/iniciativa-alerta`
                            ] =
                                iniciativaAlertaAtiva;

                            item.metadata[
                                `${PREFIX}/iniciativa-habilidade`
                            ] =
                                iniciativaHabilidadeAtiva;

                            ATRIBUTOS.forEach(
                                (atributo) => {

                                    item.metadata[
                                        `${PREFIX}/mod-${atributo}`
                                    ] =
                                        novosModificadores[
                                            atributo
                                        ];

                                    item.metadata[
                                        `${PREFIX}/save-${atributo}`
                                    ] =
                                        novasSalvaguardas[
                                            atributo
                                        ];
                                }
                            );
                        }
                    }
                );

                document
                    .querySelector("#hpAtual")
                    .value =
                        dados.hpAtual;

                document
                    .querySelector("#hpMax")
                    .value =
                        dados.hpMax;

                if (dados.calculadoraAplicada) {
                    document
                        .querySelector("#alterarHp")
                        .value = "";
                }

                const bonusEvasaoHud =
                    Number(
                        token.metadata[
                            `${PREFIX}/buff-evas`
                        ] ?? 0
                    ) || 0;

                await criarStatusNoToken(
                    token,
                    dados.hpAtual,
                    dados.hpMax,
                    dados.ca + bonusEvasaoHud
                );
            }
        );
}

// =====================================================
// POKÉMON — ABA 2: MOVES / BUFFS
// =====================================================

function mostrarFichaPokemonMoves(token) {
    const app =
        document.querySelector("#app");

    const proficiencia =
        Number(
            token.metadata[
                `${PREFIX}/proficiencia`
            ] ?? 0
        );

    const buffs = {};

    BUFFS.forEach(
        (buff) => {

            buffs[buff.id] =
                Number(
                    token.metadata[
                        `${PREFIX}/buff-${buff.id}`
                    ] ?? 0
                );
        }
    );

    const golpes = [];

    for (
        let i = 1;
        i <= 5;
        i++
    ) {
        golpes.push({
            nome:
                token.metadata[
                    `${PREFIX}/golpe${i}Nome`
                ] ?? "",

            categoria:
                token.metadata[
                    `${PREFIX}/golpe${i}Categoria`
                ] ?? "",

            acerto:
                token.metadata[
                    `${PREFIX}/golpe${i}Acerto`
                ] ?? "",

            dano:
                token.metadata[
                    `${PREFIX}/golpe${i}Dano`
                ] ?? ""
        });
    }

    let htmlGolpes = "";

    golpes.forEach(
        (golpe, index) => {

            const numero =
                index + 1;

            const titulo =
                golpe.nome ||
                `Golpe ${numero}`;

            const categoriaInicial =
                golpe.categoria === "especial"
                    ? "especial"
                    : golpe.categoria === "fisico"
                        ? "fisico"
                        : "";

            htmlGolpes += `
        <details style="
          margin-bottom:8px;
          border:1px solid #555;
          border-radius:6px;
          padding:7px;
        ">
          <summary style="
            cursor:pointer;
            font-weight:bold;
          ">
            ${numero}. ${esc(titulo)}
          </summary>

          <div style="
            margin-top:10px;
          ">

            <label>Nome</label><br>

            <input
              id="golpe${numero}Nome"
              type="text"
              value="${esc(golpe.nome)}"
              placeholder="Nome do golpe"
              style="
                width:95%;
                margin-bottom:8px;
              "
            >

            <br>

            <label>Categoria</label>

            <input
              id="golpe${numero}Categoria"
              type="hidden"
              value="${categoriaInicial}"
            >

            <div style="
              display:flex;
              gap:6px;
              margin-top:5px;
              margin-bottom:10px;
            ">

              <button
                type="button"
                class="categoriaGolpe"
                data-golpe="${numero}"
                data-categoria="fisico"
                style="
                  flex:1;
                  padding:7px 4px;
                  cursor:pointer;
                  font-weight:bold;
                  opacity:${categoriaInicial === "fisico" ? "1" : "0.55"};
                  border:${categoriaInicial === "fisico" ? "2px solid #FFFFFF" : "1px solid #666"};
                "
              >
                ⚔️ FÍSICO
              </button>

              <button
                type="button"
                class="categoriaGolpe"
                data-golpe="${numero}"
                data-categoria="especial"
                style="
                  flex:1;
                  padding:7px 4px;
                  cursor:pointer;
                  font-weight:bold;
                  opacity:${categoriaInicial === "especial" ? "1" : "0.55"};
                  border:${categoriaInicial === "especial" ? "2px solid #FFFFFF" : "1px solid #666"};
                "
              >
                ✨ ESPECIAL
              </button>

            </div>

            <label>Acerto</label><br>

            <input
              id="golpe${numero}Acerto"
              type="text"
              value="${esc(golpe.acerto)}"
              placeholder="Ex: 1d20+8"
              style="
                width:95%;
                margin-bottom:8px;
              "
            >

            <br>

            <label>Dano</label><br>

            <input
              id="golpe${numero}Dano"
              type="text"
              value="${esc(golpe.dano)}"
              placeholder="Ex: 3d8+5"
              style="
                width:95%;
                margin-bottom:10px;
              "
            >

            <div style="
              display:flex;
              gap:6px;
            ">

              <button
                type="button"
                class="rolarAcerto"
                data-golpe="${numero}"
                style="
                  flex:1;
                  padding:8px;
                  cursor:pointer;
                  font-weight:bold;
                "
              >
                🎲 ACERTO
              </button>

              <button
                type="button"
                class="rolarDano"
                data-golpe="${numero}"
                style="
                  flex:1;
                  padding:8px;
                  cursor:pointer;
                  font-weight:bold;
                "
              >
                🎲 DANO
              </button>

              <button
                type="button"
                class="rolarCritico"
                data-golpe="${numero}"
                style="
                  flex:1;
                  padding:8px;
                  cursor:pointer;
                  font-weight:bold;
                "
              >
                💥 CRÍTICO
              </button>

            </div>

          </div>

        </details>
      `;
        }
    );

    app.innerHTML = `
    ${ESTILO_FICHA}
    ${cabecalhoPokemon(token, 2)}

    <h3>Buffs / Estágios</h3>

    <div style="
      display:flex;
      gap:6px;
      flex-wrap:wrap;
    ">

      ${criarBuffs(
          buffs,
          proficiencia
      )}

    </div>

    <hr>

    <h3>Moves</h3>

    ${htmlGolpes}

    <br>

    <button
      id="salvarPokemonMoves"
      style="
        width:100%;
        padding:10px;
        font-weight:bold;
        cursor:pointer;
      "
    >
      Salvar Moves / Buffs
    </button>
  `;

    ativarCabecalhoPokemon(token);

    function atualizarBuffsPagina() {

        BUFFS.forEach(
            (buff) => {

                const campoBuff =
                    document.querySelector(
                        `#buff-${buff.id}`
                    );

                if (!campoBuff) {
                    return;
                }

                const estagio =
                    Number(
                        campoBuff.value
                    ) || 0;

                const campoBonus =
                    document.querySelector(
                        `#bonus-${buff.id}`
                    );

                if (campoBonus) {
                    campoBonus.textContent =
                        buff.id === "crit"
                            ? faixaCritico(estagio)
                            : buff.id === "evas"
                                ? formatarBonus(estagio)
                                : formatarBonus(
                                    proficiencia * estagio
                                );
                }
            }
        );
    }

    document
        .querySelectorAll(
            ".campoBuff"
        )
        .forEach(
            (campo) => {

                campo.addEventListener(
                    "input",
                    atualizarBuffsPagina
                );
            }
        );

    // =================================================
    // FÍSICO / ESPECIAL
    // =================================================

    document
        .querySelectorAll(
            ".categoriaGolpe"
        )
        .forEach(
            (botao) => {

                botao.addEventListener(
                    "click",
                    () => {

                        const numero =
                            botao.dataset.golpe;

                        const categoria =
                            botao.dataset.categoria;

                        const campoCategoria =
                            document.querySelector(
                                `#golpe${numero}Categoria`
                            );

                        campoCategoria.value =
                            categoria;

                        document
                            .querySelectorAll(
                                `.categoriaGolpe[data-golpe="${numero}"]`
                            )
                            .forEach(
                                (opcao) => {

                                    const ativo =
                                        opcao.dataset.categoria ===
                                        categoria;

                                    opcao.style.opacity =
                                        ativo
                                            ? "1"
                                            : "0.55";

                                    opcao.style.border =
                                        ativo
                                            ? "2px solid #FFFFFF"
                                            : "1px solid #666";
                                }
                            );
                    }
                );
            }
        );

    // =================================================
// ROLAR ACERTO
// BUFF NÃO ENTRA AQUI
// =================================================

document
  .querySelectorAll(
    ".rolarAcerto"
  )
  .forEach(
    (botao) => {

      botao.addEventListener(
        "click",
        async () => {

          const numero =
            botao.dataset.golpe;

          const nome =
            document
              .querySelector(
                `#golpe${numero}Nome`
              )
              .value;

          const formula =
            document
              .querySelector(
                `#golpe${numero}Acerto`
              )
              .value
              .trim();

          if (!formula) {
            alert(
              "A fórmula de acerto está vazia."
            );

            return;
          }

          await rolarNoDicePlus(
            formula,
            nome ||
              `Golpe ${numero}`,
            "Acerto"
          );
        }
      );
    }
  );


// =================================================
// ROLAR DANO + BUFF AUTOMÁTICO
// =================================================

document
  .querySelectorAll(
    ".rolarDano"
  )
  .forEach(
    (botao) => {

      botao.addEventListener(
        "click",
        async () => {

          const numero =
            botao.dataset.golpe;

          const nome =
            document
              .querySelector(
                `#golpe${numero}Nome`
              )
              .value;

          const formulaOriginal =
            document
              .querySelector(
                `#golpe${numero}Dano`
              )
              .value
              .trim();

          if (!formulaOriginal) {
            alert(
              "A fórmula de dano está vazia."
            );

            return;
          }

          const categoria =
            document
              .querySelector(
                `#golpe${numero}Categoria`
              )
              .value;

          if (!categoria) {
            alert(
              "Escolha se o golpe é FÍSICO ou ESPECIAL antes de rolar o dano."
            );

            return;
          }

          let estagioBuff = 0;

          if (
            categoria === "fisico"
          ) {
            estagioBuff =
              Number(
                document
                  .querySelector(
                    "#buff-atq"
                  )
                  ?.value
              ) || 0;
          }

          if (
            categoria === "especial"
          ) {
            estagioBuff =
              Number(
                document
                  .querySelector(
                    "#buff-atqsp"
                  )
                  ?.value
              ) || 0;
          }

          const bonusBuff =
            estagioBuff *
            proficiencia;

          const formulaFinal =
            bonusBuff > 0
              ? `${formulaOriginal}+${bonusBuff}`
              : bonusBuff < 0
                ? `${formulaOriginal}${bonusBuff}`
                : formulaOriginal;

          await rolarNoDicePlus(
            formulaFinal,
            nome ||
              `Golpe ${numero}`,
            "Dano"
          );
        }
      );
    }
  );
    // =================================================
    // ROLAR CRÍTICO — DOBRA SOMENTE OS DADOS
    // =================================================

    document
        .querySelectorAll(".rolarCritico")
        .forEach(
            (botao) => {
                botao.addEventListener(
                    "click",
                    async () => {
                        const numero = botao.dataset.golpe;
                        const nome = document.querySelector(`#golpe${numero}Nome`).value;
                        const formulaOriginal = document.querySelector(`#golpe${numero}Dano`).value.trim();

                        if (!formulaOriginal) {
                            alert("A fórmula de dano está vazia.");
                            return;
                        }

                        const categoria = document.querySelector(`#golpe${numero}Categoria`).value;

                        if (!categoria) {
                            alert("Escolha se o golpe é FÍSICO ou ESPECIAL antes de rolar o crítico.");
                            return;
                        }

                        let estagioBuff = 0;

                        if (categoria === "fisico") {
                            estagioBuff = Number(document.querySelector("#buff-atq")?.value) || 0;
                        }

                        if (categoria === "especial") {
                            estagioBuff = Number(document.querySelector("#buff-atqsp")?.value) || 0;
                        }

                        const bonusBuff = estagioBuff * proficiencia;
                        const formulaCritica = duplicarDadosFormula(formulaOriginal);
                        const formulaFinal = adicionarBonusNaFormula(formulaCritica, bonusBuff);

                        await rolarNoDicePlus(
                            formulaFinal,
                            nome || `Golpe ${numero}`,
                            "Crítico"
                        );
                    }
                );
            }
        );

    // =================================================
    // SALVAR MOVES / BUFFS
    // =================================================

    document
        .querySelector(
            "#salvarPokemonMoves"
        )
        .addEventListener(
            "click",
            async () => {

                const novosBuffs = {};

                BUFFS.forEach(
                    (buff) => {

                        novosBuffs[buff.id] =
                            Number(
                                document
                                    .querySelector(
                                        `#buff-${buff.id}`
                                    )
                                    .value
                            ) || 0;
                    }
                );

                const novosGolpes = [];

                for (
                    let i = 1;
                    i <= 5;
                    i++
                ) {

                    const categoriaCampo =
                        document
                            .querySelector(
                                `#golpe${i}Categoria`
                            )
                            .value;

                    novosGolpes.push({
                        nome:
                            document
                                .querySelector(
                                    `#golpe${i}Nome`
                                )
                                .value
                                .trim(),

                        categoria:
                            categoriaCampo === "especial"
                                ? "especial"
                                : categoriaCampo === "fisico"
                                    ? "fisico"
                                    : "",

                        acerto:
                            document
                                .querySelector(
                                    `#golpe${i}Acerto`
                                )
                                .value
                                .trim(),

                        dano:
                            document
                                .querySelector(
                                    `#golpe${i}Dano`
                                )
                                .value
                                .trim()
                    });
                }

                await OBR.scene.items.updateItems(
                    [token.id],
                    (items) => {

                        for (
                            const item
                            of items
                        ) {

                            BUFFS.forEach(
                                (buff) => {

                                    item.metadata[
                                        `${PREFIX}/buff-${buff.id}`
                                    ] =
                                        novosBuffs[
                                            buff.id
                                        ];
                                }
                            );

                            novosGolpes.forEach(
                                (
                                    golpe,
                                    index
                                ) => {

                                    const numero =
                                        index + 1;

                                    item.metadata[
                                        `${PREFIX}/golpe${numero}Nome`
                                    ] =
                                        golpe.nome;

                                    item.metadata[
                                        `${PREFIX}/golpe${numero}Categoria`
                                    ] =
                                        golpe.categoria;

                                    item.metadata[
                                        `${PREFIX}/golpe${numero}Acerto`
                                    ] =
                                        golpe.acerto;

                                    item.metadata[
                                        `${PREFIX}/golpe${numero}Dano`
                                    ] =
                                        golpe.dano;
                                }
                            );
                        }
                    }
                );

                // EVAS também altera a CA visível no HUD imediatamente.
                // A CA salva no token continua sendo a CA-base.
                const hpAtualHud =
                    Number(
                        token.metadata[
                            `${PREFIX}/hpAtual`
                        ] ?? 100
                    ) || 0;

                const hpMaxHud =
                    Math.max(
                        1,
                        Number(
                            token.metadata[
                                `${PREFIX}/hpMax`
                            ] ?? 100
                        ) || 1
                    );

                const caBaseHud =
                    Number(
                        token.metadata[
                            `${PREFIX}/ca`
                        ] ?? 10
                    ) || 0;

                const caEfetivaHud =
                    caBaseHud +
                    (Number(novosBuffs.evas) || 0);

                await criarStatusNoToken(
                    token,
                    hpAtualHud,
                    hpMaxHud,
                    caEfetivaHud
                );
            }
        );
}

// =====================================================
// POKÉMON — ABA 3: PERÍCIAS
// =====================================================

function mostrarFichaPokemonPericias(
    token
) {
    const app =
        document.querySelector("#app");

    const valoresPericias = {};

    PERICIAS.forEach(
        (grupo) => {

            grupo.pericias.forEach(
                (pericia) => {

                    valoresPericias[
                        pericia.id
                    ] =
                        token.metadata[
                            `${PREFIX}/pokemon-pericia-${pericia.id}`
                        ] ?? "";
                }
            );
        }
    );

    app.innerHTML = `
    ${ESTILO_FICHA}
    ${cabecalhoPokemon(token, 3)}

    <h3>Perícias Pokémon</h3>

    ${criarPericiasPokemon(
        valoresPericias
    )}

    <br>

    <button
      id="salvarPokemonPericias"
      style="
        width:100%;
        padding:10px;
        font-weight:bold;
        cursor:pointer;
      "
    >
      Salvar Perícias
    </button>
  `;

    ativarCabecalhoPokemon(token);

    ativarRolagensPericiasPokemon();

    document
        .querySelector(
            "#salvarPokemonPericias"
        )
        .addEventListener(
            "click",
            async () => {

                const novasPericias = {};

                PERICIAS.forEach(
                    (grupo) => {

                        grupo.pericias.forEach(
                            (pericia) => {

                                novasPericias[
                                    pericia.id
                                ] =
                                    document
                                        .querySelector(
                                            `#pokemon-pericia-${pericia.id}`
                                        )
                                        .value
                                        .trim();
                            }
                        );
                    }
                );

                await OBR.scene.items.updateItems(
                    [token.id],
                    (items) => {

                        for (
                            const item
                            of items
                        ) {

                            PERICIAS.forEach(
                                (grupo) => {

                                    grupo.pericias.forEach(
                                        (pericia) => {

                                            item.metadata[
                                                `${PREFIX}/pokemon-pericia-${pericia.id}`
                                            ] =
                                                novasPericias[
                                                    pericia.id
                                                ];
                                        }
                                    );
                                }
                            );
                        }
                    }
                );
            }
        );
}

// =====================================================
// POKÉMON — ABA 4: TALENTOS
// =====================================================

function mostrarFichaPokemonTalentos(
    token
) {
    const app =
        document.querySelector("#app");

    const talentos = [];

    for (
        let i = 1;
        i <= 5;
        i++
    ) {
        talentos.push({
            titulo:
                token.metadata[
                    `${PREFIX}/pokemon-talento-${i}-titulo`
                ] ?? "",

            descricao:
                token.metadata[
                    `${PREFIX}/pokemon-talento-${i}-descricao`
                ] ?? ""
        });
    }

    let htmlTalentos = "";

    talentos.forEach(
        (talento, index) => {

            const numero =
                index + 1;

            htmlTalentos += `
        <div style="
          margin-bottom:14px;
          border:1px solid #555;
          border-radius:8px;
          padding:10px;
        ">

          <div style="
            font-weight:bold;
            margin-bottom:8px;
          ">
            Talento ${numero}
          </div>

          <label>
            Título
          </label>

          <input
            id="pokemonTalento${numero}Titulo"
            type="text"
            value="${esc(
                talento.titulo
            )}"
            placeholder="Título do talento"
            style="
              width:100%;
              box-sizing:border-box;
              padding:8px;
              margin-top:4px;
              margin-bottom:8px;
            "
          >

          <label>
            Descrição
          </label>

          <textarea
            id="pokemonTalento${numero}Descricao"
            rows="6"
            placeholder="Descrição do talento..."
            style="
              width:100%;
              min-height:130px;
              box-sizing:border-box;
              padding:9px;
              margin-top:4px;
              resize:vertical;
            "
          >${esc(
              talento.descricao
          )}</textarea>

        </div>
      `;
        }
    );

    app.innerHTML = `
    ${ESTILO_FICHA}
    ${cabecalhoPokemon(token, 4)}

    <h3>
      Talentos Pokémon
    </h3>

    ${htmlTalentos}

    <br>

    <button
      id="salvarPokemonTalentos"
      style="
        width:100%;
        padding:10px;
        font-weight:bold;
        cursor:pointer;
      "
    >
      Salvar Talentos
    </button>
  `;

    ativarCabecalhoPokemon(token);

    document
        .querySelector(
            "#salvarPokemonTalentos"
        )
        .addEventListener(
            "click",
            async () => {

                const novosTalentos = [];

                for (
                    let i = 1;
                    i <= 5;
                    i++
                ) {
                    novosTalentos.push({
                        titulo:
                            document
                                .querySelector(
                                    `#pokemonTalento${i}Titulo`
                                )
                                .value
                                .trim(),

                        descricao:
                            document
                                .querySelector(
                                    `#pokemonTalento${i}Descricao`
                                )
                                .value
                                .trim()
                    });
                }

                await OBR.scene.items.updateItems(
                    [token.id],
                    (items) => {

                        for (
                            const item
                            of items
                        ) {

                            novosTalentos.forEach(
                                (
                                    talento,
                                    index
                                ) => {

                                    const numero =
                                        index + 1;

                                    item.metadata[
                                        `${PREFIX}/pokemon-talento-${numero}-titulo`
                                    ] =
                                        talento.titulo;

                                    item.metadata[
                                        `${PREFIX}/pokemon-talento-${numero}-descricao`
                                    ] =
                                        talento.descricao;
                                }
                            );
                        }
                    }
                );
            }
        );
}

// =====================================================
// ABRE TOKEN
// =====================================================

async function mostrarTokenSelecionado() {
    const selection =
        await OBR.player.getSelection();

    if (
        !selection ||
        selection.length === 0
    ) {
        return;
    }

    const items =
        await OBR.scene.items.getItems(
            selection
        );

    if (
        !items ||
        items.length === 0
    ) {
        return;
    }

    const token =
        items[0];

    const tipoFicha =
        token.metadata[
            `${PREFIX}/tipoFicha`
        ];

    if (
        tipoFicha === "pokemon"
    ) {
        mostrarFichaPokemon(
            token
        );

        return;
    }

    if (
        tipoFicha === "treinador"
    ) {
        mostrarFichaTreinadorPagina1(
            token
        );

        return;
    }

    mostrarEscolhaFicha(
        token
    );
}

// =====================================================
// INICIA
// =====================================================

OBR.onReady(
    async () => {

        try {
            await corrigirHudExistente();
        }
        catch (erro) {
            console.warn(
                "Não foi possível normalizar o HUD existente:",
                erro
            );
        }

        const app = document.querySelector("#app");

        if (app) {
            const observerAutosave = new MutationObserver(
                () => ativarAutosaveDaTela()
            );

            observerAutosave.observe(
                app,
                { childList: true, subtree: true }
            );
        }

        await mostrarTokenSelecionado();
        ativarAutosaveDaTela();

        OBR.player.onChange(
            async () => {

                await mostrarTokenSelecionado();

            }
        );
    }
);
