import OBR, { buildImage, buildShape, buildText } from "@owlbear-rodeo/sdk";
import "./style.css";
const PREFIX = "pokemon-mundo-perfeito";
const MODO_APRESENTADOR_INICIATIVA = new URLSearchParams(window.location.search) .get("view") === "initiative";
const ID_POPOVER_INICIATIVA =
`${PREFIX}/apresentador-iniciativa`;
const META_INICIATIVA_TRACKER =
`${PREFIX}/initiative-tracker`;
const META_TURNO_INICIATIVA =
`${PREFIX}/initiative-turn`;
const META_PAINEL_INICIATIVA = `${PREFIX}/painel-iniciativa`;
const META_PAINEL_INICIATIVA_FILHO = `${PREFIX}/painel-iniciativa-filho`;
const META_TREINADOR_POKEMONS = `${PREFIX}/treinador-pokemons`;
const META_POKEMON_DONO_TREINADOR = `${PREFIX}/treinador-pokemon-dono`;
const META_POKEMON_SLOT_TREINADOR = `${PREFIX}/treinador-pokemon-slot`;
const META_MEGA_CONFIG =
`${PREFIX}/mega-config`;
const META_MEGA_ATIVA =
`${PREFIX}/mega-ativa`;
function urlImagemMegaEvolucao() { return new URL("status/Mega.webp?v=2", window.location.href).toString(); }
const MEGA_PONTOS_TOTAL = 11;
const MEGA_CUSTO_CA = 2;
const MEGA_CUSTO_ATRIBUTO = 1;
const MEGA_PASSO_MOVIMENTO = 1.5;
const MEGA_ATRIBUTOS = ["for", "des", "con", "int", "sab", "car"];
const MEGA_MOVIMENTOS = [
  "movimento-caminhada", "movimento-escalada", "movimento-voo",
  "movimento-natacao", "movimento-escavacao", "movimento-flutuacao"
];

function distribuicaoMegaPadrao() {
  return {
    versaoAtributos: 2,
    ca: 0,
    atributos: Object.fromEntries(MEGA_ATRIBUTOS.map((id) => [id, 0])),
    movimentos: Object.fromEntries(MEGA_MOVIMENTOS.map((id) => [id, 0])),
    habilidade: ""
  };
}

function normalizarDistribuicaoMega(valor) {
  const base = distribuicaoMegaPadrao();
  const origem = valor && typeof valor === "object" ? valor : {};
  const formatoStatusBruto = Number(origem.versaoAtributos) === 2;
  base.ca = Math.max(0, Math.trunc(Number(origem.ca) || 0));
  for (const id of MEGA_ATRIBUTOS) {
    const salvo = Math.max(0, Math.trunc(Number(origem.atributos?.[id]) || 0));
    // Migração: versões anteriores guardavam +1 modificador por 2 pontos.
    // Agora guardamos pontos de Status bruto, então +1 mod antigo vira +2 Status.
    base.atributos[id] = formatoStatusBruto ? salvo : salvo * 2;
  }
  for (const id of MEGA_MOVIMENTOS) {
    base.movimentos[id] = Math.max(0, Math.trunc(Number(origem.movimentos?.[id]) || 0));
  }
  base.habilidade = String(origem.habilidade ?? "");
  return base;
}

function pontosUsadosMega(distribuicao) {
  const d = normalizarDistribuicaoMega(distribuicao);
  const atributos = MEGA_ATRIBUTOS.reduce((total, id) => total + d.atributos[id] * MEGA_CUSTO_ATRIBUTO, 0);
  const movimentos = MEGA_MOVIMENTOS.reduce((total, id) => total + d.movimentos[id], 0);
  return d.ca * MEGA_CUSTO_CA + atributos + movimentos;
}

function distribuicaoMegaDoToken(token) {
  return normalizarDistribuicaoMega(megaConfigDoToken(token)?.distribuicao);
}

function bonusCaMegaDoToken(token) {
  return megaAtivaNoToken(token) ? distribuicaoMegaDoToken(token).ca : 0;
}

function bonusStatusMegaDoToken(token, atributo) {
  if (!megaAtivaNoToken(token)) return 0;
  return Number(distribuicaoMegaDoToken(token).atributos?.[atributo]) || 0;
}

function bonusMovimentoMegaDoToken(token, chave) {
  if (!megaAtivaNoToken(token)) return 0;
  const passos = Number(distribuicaoMegaDoToken(token).movimentos?.[chave]) || 0;
  return passos * MEGA_PASSO_MOVIMENTO;
}

function modificadorPorStatus(valor) {
  const numero = Number(String(valor ?? "").trim().replace(",", "."));
  if (!Number.isFinite(numero)) return 0;
  return Math.floor((numero - 10) / 2);
}

function statusBaseDoToken(token, atributo) {
  const salvo = token?.metadata?.[`${PREFIX}/status-${atributo}`];
  const numeroSalvo = Number(String(salvo ?? "").trim().replace(",", "."));
  if (Number.isFinite(numeroSalvo)) return Math.trunc(numeroSalvo);

  // Compatibilidade com fichas antigas que guardavam somente o modificador.
  const modAntigo = Number(String(token?.metadata?.[`${PREFIX}/mod-${atributo}`] ?? "0").trim().replace(",", "."));
  const mod = Number.isFinite(modAntigo) ? Math.trunc(modAntigo) : 0;
  return 10 + (mod * 2);
}

function statusTotalDoToken(token, atributo) {
  return statusBaseDoToken(token, atributo) + bonusStatusMegaDoToken(token, atributo);
}

async function salvarDistribuicaoMega(token, distribuicao) {
  const configAtual = megaConfigDoToken(token);
  if (!configAtual) throw new Error("Defina primeiro o token da Mega Evolução.");
  const novaDistribuicao = normalizarDistribuicaoMega(distribuicao);
  if (pontosUsadosMega(novaDistribuicao) > MEGA_PONTOS_TOTAL) {
    throw new Error(`A Mega possui somente ${MEGA_PONTOS_TOTAL} pontos para distribuir.`);
  }
  const novoConfig = { ...configAtual, distribuicao: novaDistribuicao };
  await OBR.scene.items.updateItems([token.id], (items) => {
    for (const item of items) item.metadata[META_MEGA_CONFIG] = novoConfig;
  });
  token.metadata[META_MEGA_CONFIG] = novoConfig;
  if (megaAtivaNoToken(token)) await recriarHudDepoisDaMega(token);
  return novoConfig;
}

function copiarGridMega(grid, imagem, centralizar = false) {
  const largura = Math.max(1, Number(imagem?.width) || 1);
  const altura = Math.max(1, Number(imagem?.height) || 1);
  const dpi = Number(grid?.dpi) || Math.max(largura, altura);
  return {
    dpi,
    offset: centralizar
      ? { x: largura / 2, y: altura / 2 }
      : {
          x: Number(grid?.offset?.x) || largura / 2,
          y: Number(grid?.offset?.y) || altura / 2
        }
  };
}

function dadosFormaDoToken(item) {
  if (!item || item.type !== "IMAGE" || !item.image?.url) return null;
  const imagem = {
    url: item.image.url,
    mime: item.image.mime || "image/webp",
    width: Number(item.image.width) || 1,
    height: Number(item.image.height) || 1
  };
  return {
    ...imagem,
    grid: copiarGridMega(item.grid, imagem),
    scale: {
      x: Number(item.scale?.x) || 1,
      y: Number(item.scale?.y) || 1
    }
  };
}

function dadosImagemDaReferenciaMega(referencia) { return dadosFormaDoToken(referencia); }
function dadosImagemDoToken(item) { return dadosFormaDoToken(item); }

function megaConfigDoToken(token) {
  const config = token?.metadata?.[META_MEGA_CONFIG];
  if (!config || typeof config !== "object") return null;
  if (!config.normal?.url || !config.mega?.url) return null;
  return config;
}

function megaAtivaNoToken(token) {
  return token?.metadata?.[META_MEGA_ATIVA] === true;
}

function centroDoBounds(bounds) {
  return {
    x: (Number(bounds?.min?.x) + Number(bounds?.max?.x)) / 2,
    y: (Number(bounds?.min?.y) + Number(bounds?.max?.y)) / 2
  };
}

function aplicarFormaNoItem(item, destino, ativa) {
  item.image.url = destino.url;
  item.image.mime = destino.mime || "image/webp";
  item.image.width = Math.max(1, Number(destino.width) || 1);
  item.image.height = Math.max(1, Number(destino.height) || 1);

  // A Mega usa o MESMO tamanho/configuração do token Mega escolhido,
  // mas o ponto de ancoragem é centralizado para não saltar para o lado.
  item.grid = copiarGridMega(destino.grid, destino, ativa);

  if (destino.scale) {
    item.scale = {
      x: Number(destino.scale.x) || 1,
      y: Number(destino.scale.y) || 1
    };
  }

  item.metadata[META_MEGA_ATIVA] = ativa;
}

async function recriarHudDepoisDaMega(token) {
  const hpAtual = Number(token.metadata?.[`${PREFIX}/hpAtual`] ?? 100) || 0;
  const hpMax = Math.max(1, Number(token.metadata?.[`${PREFIX}/hpMax`] ?? 100) || 1);
  const caBase = Number(token.metadata?.[`${PREFIX}/ca`] ?? 10) || 0;
  const evasao = Number(token.metadata?.[`${PREFIX}/buff-evas`] ?? 0) || 0;
  const bonusMega = bonusCaMegaDoToken(token);
  await criarStatusNoToken(token, hpAtual, hpMax, caBase + evasao + bonusMega);
}

async function aplicarImagemMegaAoToken(token, destino, ativa) {
  if (!destino?.url) throw new Error("A imagem da evolução não está disponível.");

  // Guarda o centro REAL da forma atual antes de trocar a imagem.
  const boundsAntes = await OBR.scene.items.getItemBounds([token.id]);
  const centroAntes = centroDoBounds(boundsAntes);

  await OBR.scene.items.updateItems([token.id], (items) => {
    for (const item of items) aplicarFormaNoItem(item, destino, ativa);
  });
  aplicarFormaNoItem(token, destino, ativa);

  // Dá um instante para o Owlbear recalcular os bounds da nova imagem.
  await new Promise((resolve) => setTimeout(resolve, 80));

  // Corrige qualquer salto lateral/vertical causado pelo offset da imagem.
  const boundsDepois = await OBR.scene.items.getItemBounds([token.id]);
  const centroDepois = centroDoBounds(boundsDepois);
  const delta = {
    x: centroAntes.x - centroDepois.x,
    y: centroAntes.y - centroDepois.y
  };

  if (Math.abs(delta.x) > 0.01 || Math.abs(delta.y) > 0.01) {
    await OBR.scene.items.updateItems([token.id], (items) => {
      for (const item of items) {
        item.position = {
          x: Number(item.position?.x || 0) + delta.x,
          y: Number(item.position?.y || 0) + delta.y
        };
      }
    });
    token.position = {
      x: Number(token.position?.x || 0) + delta.x,
      y: Number(token.position?.y || 0) + delta.y
    };
  }

  // A barra é apagada e criada novamente usando os bounds da forma nova.
  // Assim a Mega fica SEMPRE imediatamente acima da barra de HP.
  await recriarHudDepoisDaMega(token);
  
}

async function definirReferenciaMega(tokenAtual, referenciaMega) {
  const imagemNormalAtual = dadosFormaDoToken(tokenAtual);
  const imagemMega = dadosFormaDoToken(referenciaMega);
  if (!imagemNormalAtual || !imagemMega) {
    throw new Error("Não foi possível ler a imagem normal ou a imagem da Mega Evolução.");
  }

  const configAnterior = megaConfigDoToken(tokenAtual);
  const normalSalvar = configAnterior?.normal?.url ? configAnterior.normal : imagemNormalAtual;
  const config = {
    normal: normalSalvar,
    mega: imagemMega,
    referenciaId: referenciaMega?.id || "",
    referenciaNome: referenciaMega?.name || "Mega",
    referenciaOrigem: "CENA",
    distribuicao: normalizarDistribuicaoMega(configAnterior?.distribuicao)
  };

  await OBR.scene.items.updateItems([tokenAtual.id], (items) => {
    for (const item of items) {
      item.metadata[META_MEGA_CONFIG] = config;
      aplicarFormaNoItem(item, normalSalvar, false);
    }
  });
  tokenAtual.metadata[META_MEGA_CONFIG] = config;
  aplicarFormaNoItem(tokenAtual, normalSalvar, false);
  await recriarHudDepoisDaMega(tokenAtual);
  return config;
}

async function pegarBarraHpDoToken(tokenId) {
  const barras = await OBR.scene.items.getItems(
    (item) =>
      item.type === "SHAPE" &&
      item.metadata?.[`${PREFIX}/statusToken`] === tokenId &&
      item.metadata?.[`${PREFIX}/tipoVisual`] === "fundo"
  );
  if (!barras.length) return null;
  barras.sort((a, b) => {
    const dataA = Date.parse(a.lastModified || "") || 0;
    const dataB = Date.parse(b.lastModified || "") || 0;
    return dataB - dataA;
  });
  return barras[0];
}

async function boundsBarraHpDoToken(tokenId) {
  const barra = await pegarBarraHpDoToken(tokenId);
  if (!barra) return null;
  try {
    return await OBR.scene.items.getItemBounds([barra.id]);
  } catch (_) {
    return null;
  }
}

async function ativarMegaEvolucao(token) {
  const config = megaConfigDoToken(token);
  if (!config) throw new Error("Escolha primeiro um token da Mega entre os personagens da mesa.");
  await aplicarImagemMegaAoToken(token, config.mega, true);
  return true;
}

async function retirarMegaEvolucao(token) {
  const config = megaConfigDoToken(token);
  if (!config) throw new Error("Nenhuma forma Mega foi configurada para este Pokémon.");
  await aplicarImagemMegaAoToken(token, config.normal, false);
  return false;
}

async function alternarMegaEvolucao(token) {
  return megaAtivaNoToken(token) ? retirarMegaEvolucao(token) : ativarMegaEvolucao(token);
}
const STATUS_DEBUFFS = [ { id: "envenenado", nome: "Envenenado", sigla: "ENV", arquivo: "Envenenado.png", cor: "#8f39c7", imagem: { width: 1254, height: 1254, bbox: { x: 94, y: 416, width: 1066, height: 448 } } }, { id: "queimado", nome: "Queimado", sigla: "QMD", arquivo: "Queimado.png", cor: "#ef4b18", imagem: { width: 1254, height: 1254, bbox: { x: 88, y: 393, width: 1078, height: 465 } } }, { id: "paralizado", legacyId: "paralisado", nome: "Paralizado", sigla: "PAR", arquivo: "Paralizado.png", cor: "#e4b900", imagem: { width: 1254, height: 1254, bbox: { x: 48, y: 373, width: 1158, height: 498 } } }, { id: "congelado", nome: "Congelado", sigla: "GEL", arquivo: "Congelado.png", cor: "#40aee0", imagem: { width: 1254, height: 1254, bbox: { x: 78, y: 403, width: 1099, height: 472 } } }, { id: "dormindo", nome: "Dormindo", sigla: "DRM", arquivo: "Dormindo.png", cor: "#404bc9", imagem: { width: 1254, height: 1254, bbox: { x: 31, y: 374, width: 1192, height: 514 } } }, { id: "sonolento", nome: "Sonolento", sigla: "SON", arquivo: "Sonolento.png", cor: "#8580df", imagem: { width: 1254, height: 1254, bbox: { x: 78, y: 392, width: 1099, height: 471 } } }, { id: "atordoado", nome: "Atordoado", sigla: "ATO", arquivo: "Atordoado.png", cor: "#e2a900", imagem: { width: 1254, height: 1254, bbox: { x: 180, y: 438, width: 894, height: 378 } } }, { id: "encantado", nome: "Encantado", sigla: "ENC", arquivo: "Encantado.png", cor: "#df3889", imagem: { width: 1254, height: 1254, bbox: { x: 164, y: 429, width: 927, height: 397 } } }, { id: "confuso", nome: "Confuso", sigla: "CNF", arquivo: "Confuso.png", cor: "#16aaa5", imagem: { width: 1254, height: 1254, bbox: { x: 150, y: 431, width: 954, height: 392 } } } ];
const chaveDebuff = (id) =>
`${PREFIX}/debuff-${id}`;
const debuffAtivoNoToken = ( token, status ) => token?.metadata?.[ chaveDebuff(status.id) ] === true || ( status.legacyId && token?.metadata?.[ chaveDebuff(status.legacyId) ] === true );
const urlDebuff = (status) => new URL(
`status/${status.arquivo}?v=9`,
window.location.href ).toString();
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
  #app .talentoCombate.ativo,
  #app .talentoCombate.ativo:hover {
    background: linear-gradient(180deg, #f59e0b 0%, #e97808 100%) !important;
    color:#ffffff !important;
    border-color:#c96505 !important;
    box-shadow:0 3px 9px rgba(217,119,6,.34) !important;
    opacity:1 !important;
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
  #paginaTreinador4,
  #paginaTreinador5 {
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
  #paginaTreinador4[style*="opacity:1"],
  #paginaTreinador5[style*="opacity:1"] {
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
    min-height:72px !important;
    background:#fbfdff !important;
    resize:vertical !important;
  }
  .statusGridPokemon {
    grid-template-columns:1fr !important;
  }

  /* STATUS DO POKÉMON — mais nítido e compacto */
  .pokemonStatusPrincipal {
    background:linear-gradient(180deg,#f8fbff 0%,#eef5ff 100%) !important;
    border:1px solid #c9d9ee !important;
    border-radius:14px !important;
    padding:10px !important;
    box-shadow:0 4px 14px rgba(44,86,140,.10) !important;
  }

  .pokemonStatusTopo {
    display:grid !important;
    grid-template-columns:repeat(6,minmax(0,1fr)) !important;
    gap:7px !important;
    align-items:stretch !important;
    width:100% !important;
  }

  /* HP ganha mais espaço; CA / Prof / Lv ficam organizados abaixo. */
  .pokemonStatusCampo:nth-child(1),
  .pokemonStatusCampo:nth-child(2) {
    grid-column:span 3 !important;
  }

  .pokemonStatusCampo:nth-child(3),
  .pokemonStatusCampo:nth-child(4),
  .pokemonStatusCampo:nth-child(5) {
    grid-column:span 2 !important;
  }

  .pokemonStatusCampo {
    min-width:0 !important;
    padding:7px !important;
    border:1px solid #d6e3f2 !important;
    border-radius:11px !important;
    background:#ffffff !important;
  }

  .pokemonStatusCampo p {
    margin:0 0 5px !important;
    text-align:center !important;
    font-size:11px !important;
    font-weight:900 !important;
    color:#526a88 !important;
    line-height:1.05 !important;
    white-space:nowrap !important;
  }

  .pokemonStatusCampo input {
    width:100% !important;
    min-height:38px !important;
    height:38px !important;
    padding:4px 7px !important;
    text-align:center !important;
    font-size:16px !important;
    font-weight:900 !important;
    color:#18385f !important;
    background:#f7fbff !important;
    border:1px solid #a9c4e7 !important;
    border-radius:9px !important;
    box-shadow:inset 0 1px 2px rgba(33,68,110,.05) !important;
  }

  .pokemonStatusCampo input:focus {
    background:#ffffff !important;
    border-color:#4c8dff !important;
    box-shadow:0 0 0 3px rgba(76,141,255,.12) !important;
  }

  .pokemonCalculadoraCard {
    margin-top:9px !important;
    padding:8px !important;
    border:1px solid #d7e3f2 !important;
    border-radius:11px !important;
    background:#ffffff !important;
  }

  .pokemonCalculadoraCard .calculadoraTitulo {
    margin:0 0 6px !important;
    color:#365a86 !important;
    font-size:11px !important;
    font-weight:900 !important;
  }

  .pokemonCalculadoraCard .calculadoraControles {
    gap:5px !important;
  }

  .pokemonCalculadoraCard #alterarHp {
    background:#f8fbff !important;
    border:1px solid #abc3e2 !important;
    color:#203149 !important;
    font-weight:800 !important;
  }

  .pokemonCalculadoraCard #botaoSuperEfetivo,
  .pokemonCalculadoraCard #botaoResistente,
  .pokemonCalculadoraCard #botaoMove {
    background:linear-gradient(180deg,#f4f8fd 0%,#e8f0f9 100%) !important;
    border:1px solid #b9cce3 !important;
    color:#36516f !important;
    box-shadow:none !important;
  }

  .pokemonCalculadoraCard #botaoCalcularHp {
    background:linear-gradient(135deg,#42b96b 0%,#269653 100%) !important;
    color:#ffffff !important;
    border-color:#218447 !important;
    box-shadow:0 3px 8px rgba(38,150,83,.20) !important;
  }

  @media (max-width: 430px) {
    .pokemonStatusTopo {
      gap:5px !important;
    }

    .pokemonStatusCampo {
      padding:6px !important;
    }

    .pokemonStatusCampo p {
      font-size:10px !important;
    }

    .pokemonStatusCampo input {
      font-size:15px !important;
      min-height:36px !important;
      height:36px !important;
    }
  }
  .pokemonDetalhesCompactos {
    margin-top:7px !important;
    padding-top:6px !important;
    border-top:1px solid #e1e8f0 !important;
  }
  .pokemonDetalhesCompactos p {
    margin:3px 0 3px !important;
  }
  #itemPokemon {
    width:100% !important;
    min-height:32px !important;
    box-sizing:border-box !important;
  }
  #app .hrMovimento {
    margin:5px 0 4px !important;
  }
  #app .tituloMovimento {
    margin:0 0 5px !important;
    padding:7px 9px !important;
    font-size:15px !important;
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
  .movimentoGrid {
    display:grid !important;
    grid-template-columns:repeat(2, minmax(0, 1fr)) !important;
    gap:5px 7px !important;
    margin-top:0 !important;
  }
  .movimentoTipo {
    display:flex !important;
    align-items:center !important;
    justify-content:space-between !important;
    gap:5px !important;
    min-width:0 !important;
    padding:4px 6px !important;
    border:1px solid #dbe5f0 !important;
    border-radius:10px !important;
    background:#fbfdff !important;
  }
  .movimentoNome {
    font-size:11px !important;
    line-height:1.05 !important;
    font-weight:800 !important;
    color:#506177 !important;
    min-width:0 !important;
  }
  .movimentoValor {
    width:44px !important;
    height:44px !important;
    min-height:44px !important;
    flex:0 0 44px !important;
    padding:3px !important;
    border-radius:50% !important;
    text-align:center !important;
    font-size:14px !important;
    font-weight:900 !important;
    appearance:textfield;
  }
  .movimentoValor::-webkit-outer-spin-button,
  .movimentoValor::-webkit-inner-spin-button {
    -webkit-appearance:none;
    margin:0;
  }
  .movimentoTexto {
    display:flex !important;
    flex-direction:column !important;
    gap:0 !important;
    min-width:0 !important;
  }
  .movimentoMeta {
    min-height:10px !important;
    margin-top:1px !important;
    font-size:8px !important;
    line-height:1 !important;
    font-weight:800 !important;
    color:#7a8da5 !important;
    white-space:nowrap !important;
  }
  .movimentoValor {
    border-color:#a8c7ef !important;
    background:linear-gradient(180deg, #ffffff 0%, #f3f8ff 100%) !important;
  }
  .movimentoValor:not(:focus) {
    color:#245fae !important;
  }
  .movimentoValor:focus {
    color:#203149 !important;
  }
  .rolarSalvaguarda,
  .rolarAtributo,
  .rolarPericiaPokemon,
  .rolarPericiaTreinador,
  .rolarAcerto,
  .rolarDano,
  .rolarCritico,
  .rolarDobrarDados,
  .rolarPassouCD,
  .rolarReprovouCD,
  .rolarCriticoCD,
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
function urlApresentadorIniciativa() { const url = new URL(window.location.href);
url.searchParams.set( "view", "initiative" );
return url.toString(); }

async function limparPainelIniciativaMovelAntigo() {
  try {
    const antigos = await OBR.scene.items.getItems(
      (item) => item.metadata?.[META_PAINEL_INICIATIVA] === true || Boolean(item.metadata?.[META_PAINEL_INICIATIVA_FILHO])
    );
    if (antigos.length) {
      await OBR.scene.items.deleteItems(antigos.map((item) => item.id));
    }
  } catch (erro) {
    console.warn("Não foi possível remover o painel móvel antigo de iniciativa:", erro);
  }
}

async function abrirApresentadorIniciativa() {
  let larguraViewport = 900;
  let quantidade = 1;
  try {
    const [viewport, participantes] = await Promise.all([
      OBR.viewport.getWidth(),
      OBR.scene.items.getItems((item) => dadosIniciativaDoItem(item) !== null)
    ]);
    larguraViewport = Number(viewport) || 900;
    quantidade = Math.max(1, participantes.length);
  } catch (_) {}

  const larguraMaxima = Math.max(170, larguraViewport - 30);
  const largura = Math.min(920, larguraMaxima, Math.max(170, quantidade * 79 + 18));
  try { await OBR.popover.close(ID_POPOVER_INICIATIVA); } catch (_) {}
  await OBR.popover.open({
    id: ID_POPOVER_INICIATIVA,
    url: urlApresentadorIniciativa(),
    width: largura,
    height: 132,
    anchorReference: "POSITION",
    anchorPosition: { left: larguraViewport / 2, top: 6 },
    anchorOrigin: { horizontal: "CENTER", vertical: "TOP" },
    transformOrigin: { horizontal: "CENTER", vertical: "TOP" },
    hidePaper: true,
    disableClickAway: true,
    marginThreshold: 0
  });
}

async function salvarResultadoIniciativa(token, total, detalhes = {}) {
const numero = Number(total);
if (!Number.isFinite(numero)) { return; }
const registro = {
  total: numero,
  atualizadoEm: Date.now(),
  rolagemBase: Number.isFinite(Number(detalhes.rolagemBase)) ? Number(detalhes.rolagemBase) : numero,
  bonusHabilidade: Number.isFinite(Number(detalhes.bonusHabilidade)) ? Number(detalhes.bonusHabilidade) : 0,
  dobrado: detalhes.dobrado === true,
  ajusteManual: Number.isFinite(Number(detalhes.ajusteManual)) ? Number(detalhes.ajusteManual) : 0
};
await OBR.scene.items.updateItems([token.id], (items) => {
  for (const item of items) item.metadata[META_INICIATIVA_TRACKER] = registro;
});
token.metadata[META_INICIATIVA_TRACKER] = registro;
}
async function ajustarResultadoIniciativa(tokenId, delta) {
const ajuste = Number(delta);
if (!Number.isFinite(ajuste) || ajuste === 0) { return; }
await OBR.scene.items.updateItems([tokenId], (items) => {
  for (const item of items) {
    const dadosAtuais = dadosIniciativaDoItem(item);
    if (!dadosAtuais) continue;
    item.metadata[META_INICIATIVA_TRACKER] = {
      ...dadosAtuais,
      total: dadosAtuais.total + ajuste,
      ajusteManual: (Number(dadosAtuais.ajusteManual) || 0) + ajuste,
      atualizadoEm: Date.now()
    };
  }
});
}
async function recalcularResultadoIniciativaComOpcoes(tokenId, { habilidadeAtiva, bonusHabilidade, dobrarAtiva }) {
const itens = await OBR.scene.items.getItems([tokenId]);
const item = itens?.[0];
const dados = dadosIniciativaDoItem(item);
if (!item || !dados) return;
const base = Number.isFinite(Number(dados.rolagemBase)) ? Number(dados.rolagemBase) : dados.total;
const ajusteManual = Number(dados.ajusteManual) || 0;
const bonus = habilidadeAtiva ? (Number(bonusHabilidade) || 0) : 0;
const fator = dobrarAtiva ? 2 : 1;
const total = ((base + bonus) * fator) + ajusteManual;
await OBR.scene.items.updateItems([tokenId], (items) => {
  for (const alvo of items) {
    alvo.metadata[META_INICIATIVA_TRACKER] = {
      total,
      atualizadoEm: Date.now(),
      rolagemBase: base,
      bonusHabilidade: bonus,
      dobrado: dobrarAtiva === true,
      ajusteManual
    };
  }
});
}
async function removerDaIniciativa(tokenId) { await OBR.scene.items.updateItems( [tokenId], (items) => { for (const item of items) { delete item.metadata[ META_INICIATIVA_TRACKER ]; delete item.metadata[ META_TURNO_INICIATIVA ]; } } );
 }
function dadosIniciativaDoItem(item) { const dados = item?.metadata?.[ META_INICIATIVA_TRACKER ];
if (!dados) { return null; }
const total = Number( typeof dados === "object" ? dados.total : dados );
if (!Number.isFinite(total)) { return null; }
return {
  total,
  atualizadoEm: Number(typeof dados === "object" ? dados.atualizadoEm : 0) || 0,
  rolagemBase: Number(typeof dados === "object" ? dados.rolagemBase : NaN),
  bonusHabilidade: Number(typeof dados === "object" ? dados.bonusHabilidade : 0) || 0,
  dobrado: typeof dados === "object" ? dados.dobrado === true : false,
  ajusteManual: Number(typeof dados === "object" ? dados.ajusteManual : 0) || 0
}; }
function iniciativasOrdenadas(items) { const iniciativas = [];
for (const item of items || []) { const dados = dadosIniciativaDoItem(item);
if (dados) { iniciativas.push({ item, dados }); } }
iniciativas.sort((a, b) => b.dados.total - a.dados.total || a.dados.atualizadoEm - b.dados.atualizadoEm || String(a.item.name || "").localeCompare( String(b.item.name || "") ) );
return iniciativas; }
async function definirTurnoIniciativa( tokenId, participantes = null ) { const itens = participantes || await OBR.scene.items.getItems( (item) => dadosIniciativaDoItem(item) !== null );
if (!itens.length) { return; }
await OBR.scene.items.updateItems( itens.map((item) => item.id), (items) => { for (const item of items) { if (item.id === tokenId) { item.metadata[ META_TURNO_INICIATIVA ] = true; } else { delete item.metadata[ META_TURNO_INICIATIVA ]; } } } );
 }
async function avancarTurnoIniciativa(tokenId) { const iniciativas = iniciativasOrdenadas( await OBR.scene.items.getItems() );
if (!iniciativas.length) { return; }
let indice = iniciativas.findIndex( ({ item }) => item.id === tokenId );
if (indice < 0) { indice = iniciativas.findIndex( ({ item }) => item.metadata?.[ META_TURNO_INICIATIVA ] === true ); }
if (indice < 0) { indice = 0; }
const proximo = iniciativas[ (indice + 1) % iniciativas.length ].item;
await definirTurnoIniciativa( proximo.id, iniciativas.map(({ item }) => item) ); }
function statusAtivosDoOrganizador(item) { return STATUS_DEBUFFS.filter( (status) => debuffAtivoNoToken( item, status ) ); }
function assinaturaStatusOrganizador(item) { return statusAtivosDoOrganizador(item) .map((status) => status.id) .join(","); }
function criarStatusOrganizador(item) { const ativos = statusAtivosDoOrganizador(item);
if (!ativos.length) { return ""; }
const larguraVisivel = 20;
return ativos .map((status) => { const bbox = status.imagem.bbox; const escala = larguraVisivel / bbox.width; const alturaVisivel = bbox.height * escala; const larguraImagem = status.imagem.width * escala; const alturaImagem = status.imagem.height * escala; const esquerda = -(bbox.x * escala); const topo = -(bbox.y * escala);
return `
                <span
                    class="initStatusBadge"
                    title="${esc(status.nome)}"
                    style="
                        width:${larguraVisivel}px;
                        height:${alturaVisivel}px;
                    "
                >
                    <img
                        src="${esc(urlDebuff(status))}"
                        alt="${esc(status.nome)}"
                        draggable="false"
                        onerror="this.style.display='none'"
                        style="
                            width:${larguraImagem}px;
                            height:${alturaImagem}px;
                            left:${esquerda}px;
                            top:${topo}px;
                        "
                    >
                </span>
            `;
}) .join(""); }
function criarCardApresentadorIniciativa( item, dados, turnoAtual = false ) { const imagem = item.type === "IMAGE" ? item.image?.url || "" : "";
const nome = item.name || "Token";
const quantidadeStatus = statusAtivosDoOrganizador( item ).length;
const linhasStatus = Math.ceil( quantidadeStatus / 3 );
const alturaStatus = quantidadeStatus === 0 ? 0 : ( linhasStatus * 9 + Math.max( 0, linhasStatus - 1 ) * 2 );
// A faixa de status fica absoluta logo abaixo
// do retrato. Esta margem reserva SOMENTE o
// espaço realmente usado pelos badges.
const margemTurno = quantidadeStatus === 0 ? 1 : alturaStatus + 2;
return `
        <div
            class="initCard${turnoAtual ? " turnoAtual" : ""}"
            title="${esc(nome)}"
        >
            <div class="initImagemWrap">
                ${
                    imagem
                        ? `
<img
class="initImagem"
src="${esc(imagem)}"
alt="${esc(nome)}" >
`
                        : `
<div class="initImagemFallback"> 🐾 </div>
`
                }
                <button
                    class="initRemover"
                    type="button"
                    data-remover-iniciativa="${esc(item.id)}"
                    title="Remover este participante da iniciativa"
                >
                    ×
                </button>
            </div>

            <div
                class="initStatusArea"
                title="Status ativos"
                style="
                    height:${alturaStatus}px;
                    min-height:${alturaStatus}px;
                "
            >
                ${criarStatusOrganizador(item)}
            </div>

            <div
                class="initTurnoLinha"
                style="
                    margin-top:${margemTurno}px !important;
                "
            >
                ${
                    turnoAtual
                        ? `
<button
class="initTurno"
type="button"
data-avancar-turno="${esc(item.id)}"
title="Finalizar este turno e passar para o próximo" >➜</button>
`
                        : `
<span class="initTurnoEspaco"></span>
`
                }
            </div>
            <div class="initValorLinha">
                <button
                    class="initAjustar"
                    type="button"
                    data-ajustar-iniciativa="${esc(item.id)}"
                    data-delta="-1"
                    title="Diminuir iniciativa em 1"
                >−</button>
                <div class="initValor">
                    ${dados.total}
                </div>
                <button
                    class="initAjustar"
                    type="button"
                    data-ajustar-iniciativa="${esc(item.id)}"
                    data-delta="1"
                    title="Aumentar iniciativa em 1"
                >+</button>
            </div>
            <div class="initNome">
                ${esc(nome)}
            </div>
        </div>
    `;
}
async function iniciarApresentadorIniciativa() { const app = document.querySelector("#app");
if (!app) return;
document.documentElement.style.cssText += ";background:#161e2c!important;overflow:hidden!important";
document.body.style.cssText += ";margin:0!important;background:#161e2c!important;overflow:hidden!important";
const papel = document.createElement("div");
papel.id = "initiativePresenterRoot";
papel.innerHTML = `
        <style>
            html,body,#app,#initiativePresenterRoot{
                width:100%;height:100%;margin:0;padding:0;box-sizing:border-box;
                background:#161e2c!important;overflow:hidden!important;
            }
            body{font-family:Inter,Arial,sans-serif}
            #initiativePresenterRoot{
                display:flex;
                align-items:flex-start!important;
                justify-content:center;
                padding:3px 6px;
                border:1px solid rgba(255,255,255,.16);
            }
            .initBarra{
                width:100%;
                height:100%;
                display:flex;
                align-items:flex-start!important;
                justify-content:flex-start;
                gap:7px;
                padding:5px 4px 2px;
                box-sizing:border-box;
                overflow-x:auto;
                overflow-y:hidden;
                scrollbar-width:none;
                -ms-overflow-style:none;
                background:#161e2c;
            }
            .initBarra::-webkit-scrollbar{display:none;width:0;height:0}
            .initCard{
                width:72px;
                min-width:72px;
                height:auto!important;
                min-height:0!important;
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:flex-start!important;
                gap:1px;
                position:relative;
            }
            .initImagemWrap{
                width:54px;height:54px;position:relative;display:flex;align-items:center;justify-content:center;
                overflow:visible;border:2px solid #6d7c94;border-radius:12px;background:#f4f7fb;box-sizing:border-box;
            }
            .initCard:first-child .initImagemWrap{border-color:#f59e0b;box-shadow:0 0 0 2px rgba(245,158,11,.2)}
            .initCard.turnoAtual .initImagemWrap{border-color:#35c978;box-shadow:0 0 0 2px rgba(53,201,120,.22),0 0 12px rgba(53,201,120,.20)}
            .initImagem{width:100%;height:100%;object-fit:contain;display:block;border-radius:9px}
            .initImagemFallback{font-size:27px;line-height:1}

            /* Status ficam FORA do retrato.
               Grade de até 3 badges por linha e 3 linhas. */
            .initStatusArea{
                position:absolute!important;
                top:55px!important;
                left:3px!important;
                width:66px;
                min-width:66px;
                display:flex;
                flex-wrap:wrap;
                align-content:flex-start;
                justify-content:center;
                align-items:flex-start;
                column-gap:2px;
                row-gap:2px;
                padding:0!important;
                margin:0!important;
                box-sizing:border-box;
                overflow:hidden;
                transition:height .12s ease;
                z-index:5;
            }
            .initStatusBadge{
                position:relative;
                display:block;
                flex:0 0 auto;
                overflow:hidden;
                border-radius:2px;
                filter:drop-shadow(0 1px 1px rgba(0,0,0,.45));
            }
            .initStatusBadge img{
                position:absolute;
                display:block;
                max-width:none!important;
                max-height:none!important;
                pointer-events:none;
                user-select:none;
            }

            .initTurnoLinha{
                height:18px!important;
                min-height:18px!important;
                flex:0 0 18px!important;
                display:flex!important;
                align-items:center!important;
                justify-content:center!important;
                padding:0!important;
            }
            .initTurnoEspaco{display:block;width:31px;height:18px}
            .initTurno{
                width:31px;height:18px;min-width:31px;min-height:18px;padding:0;display:flex;align-items:center;justify-content:center;
                border:1px solid #6cf0a5;border-radius:999px;background:#209b59;color:#fff;font-size:14px;font-weight:900;line-height:1;cursor:pointer;
                box-shadow:0 0 8px rgba(53,201,120,.28)
            }
            .initTurno:hover{background:#2fbb6e;border-color:#a2ffc8}
            .initValorLinha{display:flex;align-items:center;justify-content:center;gap:2px}
            .initValor{
                min-width:30px;padding:2px 5px;border-radius:999px;background:#2e72d2;color:#fff;
                font-size:13px;font-weight:900;line-height:1.15;text-align:center
            }
            .initCard:first-child .initValor{background:#e97808}
            .initAjustar{
                width:18px;height:18px;min-width:18px;min-height:18px;padding:0;display:flex;align-items:center;justify-content:center;
                border:1px solid #71829b;border-radius:6px;background:#27364b;color:#fff;font-size:14px;font-weight:900;line-height:1;cursor:pointer
            }
            .initAjustar:hover{background:#365273;border-color:#a9c7ef}
            .initNome{width:70px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:#eef4ff;font-size:9px;font-weight:800;text-align:center;line-height:1.05}
            .initRemover{
                width:18px;height:18px;min-height:18px;padding:0;position:absolute;top:-6px;right:-7px;display:flex;align-items:center;justify-content:center;
                border:1px solid #ff8585;border-radius:50%;background:#cc3d3d;color:#fff;font-size:13px;font-weight:900;line-height:1;cursor:pointer
            }
            .initVazio{width:100%;color:#e8eef8;font-size:11px;font-weight:800;text-align:center}
        </style>
        <div id="initiativePresenterList" class="initBarra"></div>
    `;
app.replaceChildren(papel);
const lista = document.querySelector("#initiativePresenterList");
let assinaturaAnterior = "";
let quantidadeAnterior = -1;
let jaTeveParticipantes = false;
const ajustarTamanho = async (quantidade) => { if (quantidade === quantidadeAnterior) return;
quantidadeAnterior = quantidade;
try { const viewport = Number(await OBR.viewport.getWidth()) || 900;
const largura = Math.min(920, Math.max(170, viewport - 30), Math.max(170, quantidade * 79 + 18));
await OBR.popover.setWidth(ID_POPOVER_INICIATIVA, largura);
await OBR.popover.setHeight(ID_POPOVER_INICIATIVA, 150); } catch (_) {} };
const renderizar = (items) => { const iniciativas = iniciativasOrdenadas(items);
const turnoMarcado = iniciativas.find( ({ item }) => item.metadata?.[ META_TURNO_INICIATIVA ] === true );
const turnoId = turnoMarcado?.item.id || iniciativas[0]?.item.id || "";
const assinatura = iniciativas.map(({item,dados}) =>
`${item.id}|${dados.total}|${dados.atualizadoEm}|${item.name || ""}|${item.type === "IMAGE" ? item.image?.url || "" : ""}|${item.id === turnoId ? 1 : 0}|${assinaturaStatusOrganizador(item)}`
).join("§");
if (assinatura === assinaturaAnterior) return;
assinaturaAnterior = assinatura;
if (!iniciativas.length) { if (jaTeveParticipantes) { OBR.popover.close(ID_POPOVER_INICIATIVA).catch(() => {});
return; }
lista.innerHTML = '<div class="initVazio">Aguardando iniciativas...</div>';
ajustarTamanho(1);
return; }
jaTeveParticipantes = true;
lista.innerHTML = iniciativas .map( ({ item, dados }) => criarCardApresentadorIniciativa( item, dados, item.id === turnoId ) ) .join("");
ajustarTamanho(iniciativas.length); };
app.addEventListener("click", async (evento) => { const avancarTurno = evento.target.closest?.( "[data-avancar-turno]" ); if (avancarTurno) { const id = avancarTurno.dataset.avancarTurno; if (id) { avancarTurno.disabled = true; try { await avancarTurnoIniciativa(id); } catch (erro) { console.warn( "Não foi possível avançar o turno:", erro ); } finally { avancarTurno.disabled = false; } } return; } const ajustar = evento.target.closest?.("[data-ajustar-iniciativa]"); if (ajustar) { const id = ajustar.dataset.ajustarIniciativa; const delta = Number(ajustar.dataset.delta); if (id && Number.isFinite(delta) && delta !== 0) { try { await ajustarResultadoIniciativa(id, delta); } catch (erro) { console.warn("Não foi possível ajustar a iniciativa:", erro); } } return; } const remover = evento.target.closest?.("[data-remover-iniciativa]"); const id = remover?.dataset.removerIniciativa; if (!id) return; try { await removerDaIniciativa(id); } catch (erro) { console.warn("Não foi possível remover o participante da iniciativa:", erro); } });
renderizar(await OBR.scene.items.getItems());
OBR.scene.items.onChange(renderizar); }
const ATRIBUTOS = ["for", "des", "con", "int", "sab", "car"];
const NOMES_ATRIBUTOS = { for: "Força", des: "Destreza", con: "Constituição", int: "Inteligência", sab: "Sabedoria", car: "Carisma" };
const BUFFS = [ { id: "atq", nome: "ATQ" }, { id: "atqsp", nome: "ATQSP" }, { id: "def", nome: "DEF" }, { id: "defsp", nome: "DEFSP" }, { id: "vel", nome: "VEL" }, { id: "pres", nome: "PRES" }, { id: "evas", nome: "EVAS" }, { id: "crit", nome: "CRIT" } ];
const PERICIAS = [ { atributo: "FOR", nomeAtributo: "Força", pericias: [ { id: "atletismo", nome: "Atletismo" } ] }, { atributo: "DES", nomeAtributo: "Destreza", pericias: [ { id: "acrobacia", nome: "Acrobacia" }, { id: "furtividade", nome: "Furtividade" }, { id: "prestidigitacao", nome: "Prestidigitação" } ] }, { atributo: "CON", nomeAtributo: "Constituição", pericias: [] }, { atributo: "INT", nomeAtributo: "Inteligência", pericias: [ { id: "arcanismo", nome: "Arcanismo" }, { id: "historia", nome: "História" }, { id: "investigacao", nome: "Investigação" }, { id: "natureza", nome: "Natureza" }, { id: "religiao", nome: "Religião" } ] }, { atributo: "SAB", nomeAtributo: "Sabedoria", pericias: [ { id: "adestrar-animais", nome: "Adestrar Animais" }, { id: "intuicao", nome: "Intuição" }, { id: "medicina", nome: "Medicina" }, { id: "percepcao", nome: "Percepção" }, { id: "sobrevivencia", nome: "Sobrevivência" } ] }, { atributo: "CAR", nomeAtributo: "Carisma", pericias: [ { id: "atuacao", nome: "Atuação" }, { id: "enganacao", nome: "Enganação" }, { id: "intimidacao", nome: "Intimidação" }, { id: "persuasao", nome: "Persuasão" } ] } ];
function esc(valor) { return String(valor ?? "") .replaceAll("&", "&amp;") .replaceAll('"', "&quot;") .replaceAll("<", "&lt;") .replaceAll(">", "&gt;"); }
function limparRotuloDice(texto) { return String(texto || "") .replace(/[#+\-*/(),]/g, " ") .replace(/\s+/g, " ") .trim(); }
function formatarBonus(valor) { const numero = Number(valor) || 0;
return numero > 0 ? `+${numero}` : `${numero}`;
}

const QUANTIDADE_EQUIPE_TREINADOR = 6;
const QUANTIDADE_PC_TREINADOR = 16;

function clonarDadosSimples(valor) {
  if (valor === undefined) return undefined;
  try { return JSON.parse(JSON.stringify(valor)); } catch (_) { return valor; }
}

function rosterTreinadorPadrao() {
  return {
    versao: 1,
    equipe: Array.from({ length: QUANTIDADE_EQUIPE_TREINADOR }, () => null),
    pc: Array.from({ length: QUANTIDADE_PC_TREINADOR }, () => null)
  };
}

function normalizarRosterTreinador(valor) {
  const padrao = rosterTreinadorPadrao();
  if (!valor || typeof valor !== "object") return padrao;
  const normalizarLista = (lista, quantidade) => Array.from({ length: quantidade }, (_, i) => {
    const slot = Array.isArray(lista) ? lista[i] : null;
    return slot && typeof slot === "object" ? clonarDadosSimples(slot) : null;
  });
  return {
    versao: 1,
    equipe: normalizarLista(valor.equipe, QUANTIDADE_EQUIPE_TREINADOR),
    pc: normalizarLista(valor.pc, QUANTIDADE_PC_TREINADOR)
  };
}

function rosterDoTreinador(token) {
  return normalizarRosterTreinador(token?.metadata?.[META_TREINADOR_POKEMONS]);
}

function chaveSlotTreinador(grupo, indice) { return `${grupo}:${indice}`; }
function separarChaveSlotTreinador(chave) {
  const [grupo, indiceTexto] = String(chave || "").split(":");
  const indice = Number(indiceTexto);
  if (!['equipe', 'pc'].includes(grupo) || !Number.isInteger(indice)) return null;
  const limite = grupo === 'equipe' ? QUANTIDADE_EQUIPE_TREINADOR : QUANTIDADE_PC_TREINADOR;
  if (indice < 0 || indice >= limite) return null;
  return { grupo, indice };
}

function metadataPokemonParaSlot(item) {
  const resultado = {};
  for (const [chave, valor] of Object.entries(item?.metadata || {})) {
    if (!chave.startsWith(`${PREFIX}/`)) continue;
    if ([META_INICIATIVA_TRACKER, META_TURNO_INICIATIVA, META_POKEMON_DONO_TREINADOR, META_POKEMON_SLOT_TREINADOR].includes(chave)) continue;
    resultado[chave] = clonarDadosSimples(valor);
  }
  resultado[`${PREFIX}/tipoFicha`] = "pokemon";
  resultado[META_MEGA_ATIVA] = false;
  return resultado;
}

function snapshotPokemonParaTreinador(item) {
  if (!item || item.type !== "IMAGE" || !item.image?.url) return null;
  const configMega = megaConfigDoToken(item);
  const formaAtual = dadosFormaDoToken(item);
  const formaGuardar = megaAtivaNoToken(item) && configMega?.normal?.url ? clonarDadosSimples(configMega.normal) : formaAtual;
  if (!formaGuardar?.url) return null;
  return {
    versao: 1,
    nome: item.name || "Pokémon",
    forma: clonarDadosSimples(formaGuardar),
    rotation: Number(item.rotation) || 0,
    metadata: metadataPokemonParaSlot(item),
    campoId: null,
    atualizadoEm: Date.now()
  };
}

async function salvarRosterTreinador(token, roster) {
  const salvar = normalizarRosterTreinador(roster);
  await OBR.scene.items.updateItems([token.id], (items) => {
    for (const item of items) item.metadata[META_TREINADOR_POKEMONS] = salvar;
  });
  token.metadata[META_TREINADOR_POKEMONS] = salvar;
  return salvar;
}

async function sincronizarRosterTreinadorComCena(token, roster = null) {
  const atual = normalizarRosterTreinador(roster || rosterDoTreinador(token));
  const emCampo = await OBR.scene.items.getItems(
    (item) => item.type === "IMAGE" && item.metadata?.[META_POKEMON_DONO_TREINADOR] === token.id
  );
  const porSlot = new Map(emCampo.map((item) => [String(item.metadata?.[META_POKEMON_SLOT_TREINADOR] || ""), item]));
  let mudou = false;
  for (const grupo of ['equipe', 'pc']) {
    atual[grupo].forEach((slot, indice) => {
      if (!slot) return;
      const chave = chaveSlotTreinador(grupo, indice);
      const item = porSlot.get(chave);
      const novoId = item?.id || null;
      if ((slot.campoId || null) !== novoId) {
        slot.campoId = novoId;
        mudou = true;
      }
    });
  }
  if (mudou) await salvarRosterTreinador(token, atual);
  return atual;
}

async function acharPokemonDoSlotEmCampo(token, chave, slot) {
  if (slot?.campoId) {
    const porId = await OBR.scene.items.getItems([slot.campoId]);
    if (porId?.[0]) return porId[0];
  }
  const encontrados = await OBR.scene.items.getItems(
    (item) => item.type === "IMAGE" &&
      item.metadata?.[META_POKEMON_DONO_TREINADOR] === token.id &&
      item.metadata?.[META_POKEMON_SLOT_TREINADOR] === chave
  );
  return encontrados[0] || null;
}

async function pontoUmGridNaFrenteDoTreinador(token) {
  const dpi = Math.max(1, Number(await OBR.scene.grid.getDpi()) || 150);
  const bounds = await OBR.scene.items.getItemBounds([token.id]);
  const centro = centroDoBounds(bounds);
  const rad = (Number(token.rotation) || 0) * Math.PI / 180;
  return {
    x: centro.x + Math.sin(rad) * dpi,
    y: centro.y - Math.cos(rad) * dpi
  };
}

async function centralizarItemNoPonto(itemId, ponto) {
  await new Promise((resolve) => setTimeout(resolve, 60));
  const bounds = await OBR.scene.items.getItemBounds([itemId]);
  const centro = centroDoBounds(bounds);
  const dx = ponto.x - centro.x;
  const dy = ponto.y - centro.y;
  if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return;
  await OBR.scene.items.updateItems([itemId], (items) => {
    for (const item of items) {
      item.position = { x: Number(item.position?.x || 0) + dx, y: Number(item.position?.y || 0) + dy };
    }
  });
}

async function soltarPokemonDoTreinador(token, grupo, indice) {
  let roster = await sincronizarRosterTreinadorComCena(token);
  const slot = roster[grupo]?.[indice];
  if (!slot?.forma?.url) return;
  const chave = chaveSlotTreinador(grupo, indice);
  const existente = await acharPokemonDoSlotEmCampo(token, chave, slot);
  if (existente) return existente;
  const alvo = await pontoUmGridNaFrenteDoTreinador(token);
  const forma = slot.forma;
  const metadata = clonarDadosSimples(slot.metadata || {}) || {};
  metadata[`${PREFIX}/tipoFicha`] = "pokemon";
  metadata[META_MEGA_ATIVA] = false;
  metadata[META_POKEMON_DONO_TREINADOR] = token.id;
  metadata[META_POKEMON_SLOT_TREINADOR] = chave;
  const imagem = {
    width: Math.max(1, Number(forma.width) || 1),
    height: Math.max(1, Number(forma.height) || 1),
    url: forma.url,
    mime: forma.mime || "image/webp"
  };
  const grid = copiarGridMega(forma.grid, imagem);
  const novo = buildImage(imagem, grid)
    .name(slot.nome || "Pokémon")
    .position(alvo)
    .rotation(Number(slot.rotation) || 0)
    .scale({ x: Number(forma.scale?.x) || 1, y: Number(forma.scale?.y) || 1 })
    .layer("CHARACTER")
    .locked(false)
    .metadata(metadata)
    .build();
  await OBR.scene.items.addItems([novo]);
  await centralizarItemNoPonto(novo.id, alvo);
  slot.campoId = novo.id;
  roster = await salvarRosterTreinador(token, roster);
  const hpAtual = Number(metadata[`${PREFIX}/hpAtual`] ?? 100) || 0;
  const hpMax = Math.max(1, Number(metadata[`${PREFIX}/hpMax`] ?? 100) || 1);
  const caBase = Number(metadata[`${PREFIX}/ca`] ?? 10) || 0;
  const evasao = Number(metadata[`${PREFIX}/buff-evas`] ?? 0) || 0;
  const novoAtualizado = (await OBR.scene.items.getItems([novo.id]))[0] || novo;
  await criarStatusNoToken(novoAtualizado, hpAtual, hpMax, caBase + evasao);
  return novoAtualizado;
}

async function recolherPokemonDoTreinador(token, grupo, indice) {
  let roster = await sincronizarRosterTreinadorComCena(token);
  const slot = roster[grupo]?.[indice];
  if (!slot) return;
  const chave = chaveSlotTreinador(grupo, indice);
  const item = await acharPokemonDoSlotEmCampo(token, chave, slot);
  if (!item) {
    slot.campoId = null;
    await salvarRosterTreinador(token, roster);
    return;
  }
  const snapshot = snapshotPokemonParaTreinador(item);
  if (snapshot) roster[grupo][indice] = snapshot;
  await salvarRosterTreinador(token, roster);
  await OBR.scene.items.deleteItems([item.id]);
  
}

function assinaturaSlotPokemon(slot) {
  if (!slot) return "";
  return JSON.stringify({
    nome: slot.nome || "",
    forma: slot.forma || null,
    rotation: Number(slot.rotation) || 0,
    metadata: slot.metadata || {},
    campoId: slot.campoId || null
  });
}

let sincronizacaoRosterEmCampoPendente = null;
async function sincronizarSnapshotsPokemonsEmCampo() {
  const itens = await OBR.scene.items.getItems();
  const pokemonsEmCampo = itens.filter((item) =>
    item?.type === "IMAGE" &&
    item.metadata?.[META_POKEMON_DONO_TREINADOR] &&
    item.metadata?.[META_POKEMON_SLOT_TREINADOR]
  );
  if (!pokemonsEmCampo.length) return;

  const treinadoresPorId = new Map();
  for (const pokemon of pokemonsEmCampo) {
    const donoId = pokemon.metadata[META_POKEMON_DONO_TREINADOR];
    if (!treinadoresPorId.has(donoId)) treinadoresPorId.set(donoId, []);
    treinadoresPorId.get(donoId).push(pokemon);
  }

  for (const [donoId, pokemons] of treinadoresPorId) {
    const donos = await OBR.scene.items.getItems([donoId]);
    const dono = donos?.[0];
    if (!dono) continue;
    const roster = rosterDoTreinador(dono);
    let mudou = false;

    for (const pokemon of pokemons) {
      const info = separarChaveSlotTreinador(pokemon.metadata[META_POKEMON_SLOT_TREINADOR]);
      if (!info) continue;
      const snapshot = snapshotPokemonParaTreinador(pokemon);
      if (!snapshot) continue;
      snapshot.campoId = pokemon.id;
      const atual = roster[info.grupo]?.[info.indice] || null;
      if (assinaturaSlotPokemon(atual) !== assinaturaSlotPokemon(snapshot)) {
        roster[info.grupo][info.indice] = snapshot;
        mudou = true;
      }
    }

    if (mudou) await salvarRosterTreinador(dono, roster);
  }
}

function agendarSincronizacaoRosterEmCampo() {
  if (sincronizacaoRosterEmCampoPendente) clearTimeout(sincronizacaoRosterEmCampoPendente);
  sincronizacaoRosterEmCampoPendente = setTimeout(() => {
    sincronizacaoRosterEmCampoPendente = null;
    sincronizarSnapshotsPokemonsEmCampo().catch((erro) =>
      console.warn("Não foi possível atualizar o Pokémon guardado com a ficha em campo:", erro)
    );
  }, 180);
}

async function desvincularPokemonDoRosterAnterior(pokemon, novoTreinadorId, novoGrupo, novoIndice) {
  const donoAnteriorId = pokemon?.metadata?.[META_POKEMON_DONO_TREINADOR];
  const chaveAnterior = pokemon?.metadata?.[META_POKEMON_SLOT_TREINADOR];
  if (!donoAnteriorId || !chaveAnterior) return;

  const infoAnterior = separarChaveSlotTreinador(chaveAnterior);
  if (!infoAnterior) return;
  if (donoAnteriorId === novoTreinadorId && infoAnterior.grupo === novoGrupo && infoAnterior.indice === novoIndice) return;

  const donos = await OBR.scene.items.getItems([donoAnteriorId]);
  const donoAnterior = donos?.[0];
  if (!donoAnterior) return;

  const rosterAnterior = rosterDoTreinador(donoAnterior);
  if (rosterAnterior[infoAnterior.grupo]?.[infoAnterior.indice]) {
    rosterAnterior[infoAnterior.grupo][infoAnterior.indice] = null;
    await salvarRosterTreinador(donoAnterior, rosterAnterior);
  }
}

async function registrarPokemonDaCenaNoSlot(token, grupo, indice, pokemon) {
  const snapshot = snapshotPokemonParaTreinador(pokemon);
  if (!snapshot) throw new Error("Não foi possível guardar este Pokémon.");

  // Se esse Pokémon foi solto por outro treinador, transferimos o vínculo em vez
  // de deixar uma cópia fantasma no roster antigo.
  await desvincularPokemonDoRosterAnterior(pokemon, token.id, grupo, indice);

  const treinadorAtual = await pegarTokenAtualizado(token.id) || token;
  const roster = await sincronizarRosterTreinadorComCena(treinadorAtual);
  roster[grupo][indice] = snapshot;
  await salvarRosterTreinador(treinadorAtual, roster);
  await OBR.scene.items.deleteItems([pokemon.id]);
}

async function removerPokemonDoRoster(token, grupo, indice) {
  const roster = await sincronizarRosterTreinadorComCena(token);
  const slot = roster[grupo]?.[indice];
  if (!slot) return;
  const chave = chaveSlotTreinador(grupo, indice);
  const emCampo = await acharPokemonDoSlotEmCampo(token, chave, slot);
  if (emCampo) {
    await OBR.scene.items.updateItems([emCampo.id], (items) => {
      for (const item of items) {
        delete item.metadata[META_POKEMON_DONO_TREINADOR];
        delete item.metadata[META_POKEMON_SLOT_TREINADOR];
      }
    });
  }
  roster[grupo][indice] = null;
  await salvarRosterTreinador(token, roster);
}


async function moverOuTrocarPokemonDoRoster(token, origem, destino) {
  if (!origem || !destino) return;
  if (origem.grupo === destino.grupo && origem.indice === destino.indice) return;

  const treinadorAtual = await pegarTokenAtualizado(token.id) || token;
  const roster = await sincronizarRosterTreinadorComCena(treinadorAtual);
  const slotOrigem = roster[origem.grupo]?.[origem.indice] || null;
  const slotDestino = roster[destino.grupo]?.[destino.indice] || null;
  if (!slotOrigem) return;

  roster[origem.grupo][origem.indice] = slotDestino;
  roster[destino.grupo][destino.indice] = slotOrigem;
  await salvarRosterTreinador(treinadorAtual, roster);

  // Se algum dos Pokémon estiver em campo, atualiza o vínculo para o novo slot.
  const atualizar = [];
  const novoSlotOrigem = roster[origem.grupo][origem.indice];
  const novoSlotDestino = roster[destino.grupo][destino.indice];
  if (novoSlotOrigem?.campoId) {
    atualizar.push({
      id: novoSlotOrigem.campoId,
      chave: chaveSlotTreinador(origem.grupo, origem.indice)
    });
  }
  if (novoSlotDestino?.campoId) {
    atualizar.push({
      id: novoSlotDestino.campoId,
      chave: chaveSlotTreinador(destino.grupo, destino.indice)
    });
  }

  for (const vinculo of atualizar) {
    await OBR.scene.items.updateItems([vinculo.id], (items) => {
      for (const item of items) {
        item.metadata[META_POKEMON_DONO_TREINADOR] = treinadorAtual.id;
        item.metadata[META_POKEMON_SLOT_TREINADOR] = vinculo.chave;
      }
    });
  }
}

function htmlSlotPokemonTreinador(slot, grupo, indice, compacto = false) {
  const chave = chaveSlotTreinador(grupo, indice);
  if (!slot) {
    return `
      <button type="button" class="treinadorPokemonSlot vazio" data-slot-pokemon="${chave}" title="Adicionar Pokémon">
        <span class="treinadorPokemonMais">＋</span>
        <span class="treinadorPokemonSlotLabel">${grupo === 'equipe' ? `Slot ${indice + 1}` : `PC ${indice + 1}`}</span>
      </button>`;
  }
  const url = slot.forma?.url || "";
  const emCampo = Boolean(slot.campoId);
  return `
    <div class="treinadorPokemonSlot preenchido ${compacto ? 'compacto' : ''} ${emCampo ? 'emCampo' : ''}" data-slot-wrap="${chave}">
      <button type="button" class="treinadorPokemonPrincipal" data-slot-pokemon="${chave}" title="${emCampo ? 'Recolher Pokémon' : 'Soltar Pokémon a 1 grid na frente'}">
        <div class="treinadorPokemonRetrato">${url ? `<img src="${esc(url)}" alt="${esc(slot.nome || 'Pokémon')}">` : '🐾'}</div>
        <div class="treinadorPokemonNome">${esc(slot.nome || 'Pokémon')}</div>
        <div class="treinadorPokemonEstado">${emCampo ? '● EM CAMPO' : 'SOLTAR'}</div>
      </button>
      <button type="button" class="treinadorPokemonMover" data-mover-slot="${chave}" title="Mover ou trocar de posição">↔</button>
      <button type="button" class="treinadorPokemonRemover" data-remover-slot="${chave}" title="Remover do slot">×</button>
    </div>`;
}

function tokenEstaDisponivelNaMesa(item) {
  if (!item || item.type !== "IMAGE") return false;
  if (item.layer !== "CHARACTER") return false;
  // Tokens ocultos/retirados da mesa não entram no seletor.
  if (item.visible === false) return false;
  if (!item.image?.url) return false;
  return true;
}

async function pokemonsDisponiveisParaRoster(token) {
  // Busca a cena de novo TODA VEZ que o seletor é aberto.
  // Assim não sobra Pokémon antigo/fantasma em cache.
  const itensAtuais = await OBR.scene.items.getItems();
  return itensAtuais.filter((item) => {
    if (!tokenEstaDisponivelNaMesa(item)) return false;
    if (item.id === token.id) return false;

    // Só fichas realmente marcadas como POKÉMON.
    const tipoFicha = item.metadata?.[`${PREFIX}/tipoFicha`];
    if (tipoFicha !== "pokemon") return false;

    // Pokémon que está EM CAMPO pode ser escolhido por outro treinador também.
    // Se ele já pertencer a outro roster, o vínculo será transferido ao guardar.

    // Token de referência Mega não é Pokémon disponível para o treinador.
    if (String(item.name || "").trim().toLowerCase().startsWith("mega")) return false;

    return true;
  });
}

async function tokensSemFichaParaRegistrarComoPokemon(token) {
  // Também usa somente os itens que existem e estão visíveis AGORA na cena.
  const itensAtuais = await OBR.scene.items.getItems();
  return itensAtuais.filter((item) => {
    if (!tokenEstaDisponivelNaMesa(item)) return false;
    if (item.id === token.id) return false;
    if (item.metadata?.[META_POKEMON_DONO_TREINADOR]) return false;
    if (String(item.name || "").trim().toLowerCase().startsWith("mega")) return false;

    // Só tokens ainda não classificados podem ser registrados como novos Pokémon.
    const tipoFicha = item.metadata?.[`${PREFIX}/tipoFicha`];
    return !tipoFicha;
  });
}

async function marcarTokenComoPokemon(item) {
  if (!item?.id) return null;
  await OBR.scene.items.updateItems([item.id], (items) => {
    for (const alvo of items) {
      alvo.metadata[`${PREFIX}/tipoFicha`] = "pokemon";
    }
  });
  item.metadata = item.metadata || {};
  item.metadata[`${PREFIX}/tipoFicha`] = "pokemon";
  return item;
}

async function mostrarFichaTreinadorPokemons(token) {
  const app = document.querySelector("#app");
  const roster = await sincronizarRosterTreinadorComCena(token);
  app.innerHTML = `
    ${ESTILO_FICHA}
    ${cabecalhoTreinador(token, 5)}
    <style>
      .treinadorPokemonSecao{margin-top:10px;padding:10px;border:1px solid #d6e2f0;border-radius:13px;background:linear-gradient(180deg,#fbfdff,#f3f8ff)}
      .treinadorPokemonTitulo{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px;font-size:12px;font-weight:900;color:#315b90}
      .treinadorPokemonGradeEquipe{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}
      .treinadorPokemonGradePc{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}
      .treinadorPokemonSlot{position:relative;min-width:0;border:1px solid #c8d8eb;border-radius:11px;background:#fff;overflow:hidden;box-shadow:0 2px 7px rgba(35,73,118,.08)}
      button.treinadorPokemonSlot.vazio{width:100%;min-height:103px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;color:#7990ad;border-style:dashed;cursor:pointer}
      .treinadorPokemonMais{font-size:26px;line-height:1;color:#4c8dff}.treinadorPokemonSlotLabel{font-size:9px;font-weight:900}
      .treinadorPokemonPrincipal{width:100%;height:100%;min-height:112px;padding:7px 4px 5px!important;border:0!important;background:transparent!important;box-shadow:none!important;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;cursor:pointer}
      .treinadorPokemonSlot.compacto .treinadorPokemonPrincipal{min-height:91px;padding:5px 2px 4px!important}
      .treinadorPokemonRetrato{width:58px;height:58px;display:flex;align-items:center;justify-content:center;border-radius:12px;border:2px solid #8eabc9;background:#f4f8fd;overflow:hidden}
      .treinadorPokemonSlot.compacto .treinadorPokemonRetrato{width:45px;height:45px;border-radius:10px}
      .treinadorPokemonRetrato img{width:100%;height:100%;object-fit:contain;display:block}
      .treinadorPokemonNome{width:100%;margin-top:4px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:10px;font-weight:900;color:#30455f;text-align:center}
      .treinadorPokemonSlot.compacto .treinadorPokemonNome{font-size:8px}
      .treinadorPokemonEstado{margin-top:2px;font-size:7px;font-weight:900;color:#5e7898}.treinadorPokemonSlot.emCampo{border-color:#4bc27c;box-shadow:0 0 0 2px rgba(75,194,124,.12)}.treinadorPokemonSlot.emCampo .treinadorPokemonEstado{color:#21995a}
      .treinadorPokemonMover{position:absolute!important;top:3px;left:3px;width:24px!important;height:20px!important;min-height:20px!important;padding:0!important;border-radius:7px!important;background:#eef5ff!important;border:1px solid #9dbce4!important;color:#315f9a!important;font-size:12px!important;font-weight:900!important;line-height:1!important;z-index:4}
      .treinadorPokemonMover.ativo{background:#315f9a!important;color:#fff!important;border-color:#315f9a!important}
      .treinadorPokemonRemover{position:absolute!important;top:3px;right:3px;width:20px!important;height:20px!important;min-height:20px!important;padding:0!important;border-radius:50%!important;background:#fff0f0!important;border:1px solid #e7a4a4!important;color:#b63e3e!important;font-size:13px!important;line-height:1!important;z-index:4}
      .treinadorPokemonMoverAviso{display:none;margin:0 0 9px;padding:7px 9px;border-radius:9px;background:#eaf3ff;border:1px solid #9fc1ea;color:#315f9a;font-size:9px;font-weight:900;text-align:center;line-height:1.3}
      .treinadorPokemonMoverAviso.ativo{display:block}
      .treinadorPokemonAjuda{margin:9px 1px 0!important;font-size:9px!important;color:#6f8299!important;line-height:1.35}
      .seletorRosterFundo{position:fixed;inset:0;z-index:9999;background:rgba(12,22,35,.72);display:flex;align-items:center;justify-content:center;padding:14px}
      .seletorRosterPainel{width:min(390px,100%);max-height:86vh;overflow:auto;background:#f7fbff;border:1px solid #9bbbe2;border-radius:15px;padding:12px;box-shadow:0 18px 55px rgba(0,0,0,.34)}
      .seletorRosterTopo{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;color:#284a75;font-size:13px;font-weight:900}.seletorRosterFechar{width:30px!important;height:30px!important;min-height:30px!important;padding:0!important}
      .seletorRosterGrade{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.seletorRosterPokemon{display:grid!important;grid-template-columns:52px minmax(0,1fr)!important;align-items:center!important;gap:8px!important;min-height:64px!important;padding:6px!important;text-align:left!important}.seletorRosterPokemon img{width:50px;height:50px;object-fit:contain;border-radius:9px;background:#fff;border:1px solid #d5e0ed}.seletorRosterPokemon span{overflow:hidden;text-overflow:ellipsis;font-size:10px;font-weight:900}
      .registrarPokemonNovo{width:100%;margin:9px 0 6px!important;min-height:38px!important;background:linear-gradient(135deg,#45a86c,#2c8b55)!important;color:#fff!important;border-color:#287d4d!important;font-size:10px!important;font-weight:900!important}
      .registrarPokemonNovoLista{display:none;margin-top:7px;padding-top:8px;border-top:1px solid #d8e4f1}.registrarPokemonNovoLista.aberto{display:block}.registrarPokemonNovoTitulo{margin:0 0 7px!important;font-size:9px!important;color:#5a718d!important;text-align:center}.registrarPokemonBadge{display:inline-block;margin-left:5px;padding:2px 5px;border-radius:999px;background:#fff4cf;color:#8d6b12;font-size:7px;font-weight:900}
      @media(max-width:430px){.treinadorPokemonGradePc{grid-template-columns:repeat(4,minmax(0,1fr))}.treinadorPokemonGradeEquipe{grid-template-columns:repeat(3,minmax(0,1fr))}}
    </style>
    <div id="avisoMoverPokemon" class="treinadorPokemonMoverAviso">Escolha o slot de destino. Se ele estiver ocupado, os dois Pokémon trocam de posição.</div>
    <div class="treinadorPokemonSecao">
      <div class="treinadorPokemonTitulo"><span>🎒 EQUIPE PRINCIPAL</span><span>6 Pokémon</span></div>
      <div class="treinadorPokemonGradeEquipe">${roster.equipe.map((slot, i) => htmlSlotPokemonTreinador(slot, 'equipe', i, false)).join('')}</div>
      <p class="treinadorPokemonAjuda">Clique no Pokémon para soltar/recolher. Use ↔ para mover para outro slot, trocar a ordem do time ou mandar entre EQUIPE e PC.</p>
    </div>
    <div class="treinadorPokemonSecao">
      <div class="treinadorPokemonTitulo"><span>🖥️ PC</span><span>16 Pokémon • 4×4</span></div>
      <div class="treinadorPokemonGradePc">${roster.pc.map((slot, i) => htmlSlotPokemonTreinador(slot, 'pc', i, true)).join('')}</div>
    </div>
    <div id="seletorRoster" class="seletorRosterFundo" style="display:none">
      <div class="seletorRosterPainel">
        <div class="seletorRosterTopo"><span>Escolher Pokémon da mesa</span><button id="fecharSeletorRoster" class="seletorRosterFechar" type="button">×</button></div>
        <div id="listaSeletorRoster" class="seletorRosterGrade"></div>
        <button id="registrarPokemonNovo" class="registrarPokemonNovo" type="button">＋ REGISTRAR NOVO POKÉMON</button>
        <div id="registrarPokemonNovoLista" class="registrarPokemonNovoLista">
          <p class="registrarPokemonNovoTitulo">Tokens CHARACTER sem ficha. Ao escolher, ele será marcado como POKÉMON e guardado no slot.</p>
          <div id="listaTokensSemFicha" class="seletorRosterGrade"></div>
        </div>
        <p class="treinadorPokemonAjuda">A lista principal mostra somente fichas POKÉMON. Use “Registrar Novo Pokémon” para um token que acabou de entrar no mapa.</p>
      </div>
    </div>`;

  ativarCabecalhoTreinador(token);
  const seletor = document.querySelector('#seletorRoster');
  const lista = document.querySelector('#listaSeletorRoster');
  const botaoRegistrarNovo = document.querySelector('#registrarPokemonNovo');
  const areaRegistrarNovo = document.querySelector('#registrarPokemonNovoLista');
  const listaTokensSemFicha = document.querySelector('#listaTokensSemFicha');
  let destino = null;
  let origemMovimento = null;


  const fechar = () => {
    seletor.style.display = 'none';
    areaRegistrarNovo?.classList.remove('aberto');
    destino = null;
  };
  document.querySelector('#fecharSeletorRoster')?.addEventListener('click', fechar);
  seletor?.addEventListener('click', (evento) => { if (evento.target === seletor) fechar(); });

  const abrirSeletor = async (grupo, indice) => {
    destino = { grupo, indice };
    areaRegistrarNovo?.classList.remove('aberto');
    const disponiveis = await pokemonsDisponiveisParaRoster(token);
    lista.innerHTML = disponiveis.length ? disponiveis.map((pokemon) => `
      <button type="button" class="seletorRosterPokemon" data-pokemon-id="${esc(pokemon.id)}">
        <img src="${esc(pokemon.image?.url || '')}" alt="${esc(pokemon.name || 'Pokémon')}">
        <span>${esc(pokemon.name || 'Pokémon')}</span>
      </button>`).join('') : '<div style="grid-column:1/-1;padding:12px;text-align:center;color:#667d99;font-size:10px;font-weight:800">Nenhuma ficha POKÉMON disponível.<br>Para um token novo, use o botão verde abaixo.</div>';
    seletor.style.display = 'flex';
  };

  const atualizarListaSemFicha = async () => {
    if (!listaTokensSemFicha) return;
    const semFicha = await tokensSemFichaParaRegistrarComoPokemon(token);
    listaTokensSemFicha.innerHTML = semFicha.length ? semFicha.map((item) => `
      <button type="button" class="seletorRosterPokemon" data-registrar-pokemon-id="${esc(item.id)}">
        <img src="${esc(item.image?.url || '')}" alt="${esc(item.name || 'Token')}">
        <span>${esc(item.name || 'Token')}<span class="registrarPokemonBadge">SEM FICHA</span></span>
      </button>`).join('') : '<div style="grid-column:1/-1;padding:12px;text-align:center;color:#667d99;font-size:10px;font-weight:800">Nenhum token CHARACTER sem ficha encontrado.</div>';
  };

  botaoRegistrarNovo?.addEventListener('click', async () => {
    const abrir = !areaRegistrarNovo?.classList.contains('aberto');
    areaRegistrarNovo?.classList.toggle('aberto', abrir);
    if (abrir) await atualizarListaSemFicha();
  });

  document.querySelectorAll('[data-mover-slot]').forEach((botao) => {
    botao.addEventListener('click', (evento) => {
      evento.stopPropagation();
      const info = separarChaveSlotTreinador(botao.dataset.moverSlot);
      if (!info) return;
      origemMovimento = info;
      document.querySelectorAll('[data-mover-slot]').forEach((item) => item.classList.remove('ativo'));
      botao.classList.add('ativo');
      document.querySelector('#avisoMoverPokemon')?.classList.add('ativo');
    });
  });

  document.querySelectorAll('[data-slot-pokemon]').forEach((botao) => {
    botao.addEventListener('click', async () => {
      const info = separarChaveSlotTreinador(botao.dataset.slotPokemon);
      if (!info) return;
      const trainerAtual = await pegarTokenAtualizado(token.id) || token;

      if (origemMovimento) {
        botao.disabled = true;
        try {
          await moverOuTrocarPokemonDoRoster(trainerAtual, origemMovimento, info);
          const atualizado = await pegarTokenAtualizado(token.id) || trainerAtual;
          await mostrarFichaTreinadorPokemons(atualizado);
        } catch (erro) {
          console.error('Erro ao mover Pokémon entre slots:', erro);
          alert(erro?.message || 'Não foi possível mover este Pokémon.');
          botao.disabled = false;
        }
        return;
      }

      const rosterAtual = await sincronizarRosterTreinadorComCena(trainerAtual);
      const slot = rosterAtual[info.grupo][info.indice];
      if (!slot) { await abrirSeletor(info.grupo, info.indice); return; }
      botao.disabled = true;
      try {
        if (slot.campoId) await recolherPokemonDoTreinador(trainerAtual, info.grupo, info.indice);
        else await soltarPokemonDoTreinador(trainerAtual, info.grupo, info.indice);
        const atualizado = await pegarTokenAtualizado(token.id) || trainerAtual;
        await mostrarFichaTreinadorPokemons(atualizado);
      } catch (erro) {
        console.error('Erro ao alternar Pokémon do treinador:', erro);
        alert(erro?.message || 'Não foi possível soltar/recolher este Pokémon.');
        botao.disabled = false;
      }
    });
  });

  document.querySelectorAll('[data-remover-slot]').forEach((botao) => {
    botao.addEventListener('click', async (evento) => {
      evento.stopPropagation();
      const info = separarChaveSlotTreinador(botao.dataset.removerSlot);
      if (!info) return;
      if (!confirm('Remover este Pokémon do slot? Se ele estiver em campo, o token continuará na mesa.')) return;
      const trainerAtual = await pegarTokenAtualizado(token.id) || token;
      await removerPokemonDoRoster(trainerAtual, info.grupo, info.indice);
      const atualizado = await pegarTokenAtualizado(token.id) || trainerAtual;
      await mostrarFichaTreinadorPokemons(atualizado);
    });
  });

  listaTokensSemFicha?.addEventListener('click', async (evento) => {
    const botao = evento.target.closest?.('[data-registrar-pokemon-id]');
    if (!botao || !destino) return;
    botao.disabled = true;
    try {
      const itens = await OBR.scene.items.getItems([botao.dataset.registrarPokemonId]);
      const pokemon = itens[0];
      if (!pokemon) throw new Error('Esse token não está mais na mesa.');
      if (pokemon.metadata?.[`${PREFIX}/tipoFicha`] === 'treinador') {
        throw new Error('Esse token já está marcado como TREINADOR.');
      }
      await marcarTokenComoPokemon(pokemon);
      const trainerAtual = await pegarTokenAtualizado(token.id) || token;
      await registrarPokemonDaCenaNoSlot(trainerAtual, destino.grupo, destino.indice, pokemon);
      fechar();
      const atualizado = await pegarTokenAtualizado(token.id) || trainerAtual;
      await mostrarFichaTreinadorPokemons(atualizado);
    } catch (erro) {
      console.error('Erro ao registrar novo Pokémon:', erro);
      alert(erro?.message || 'Não foi possível registrar este token como Pokémon.');
      botao.disabled = false;
    }
  });

  lista?.addEventListener('click', async (evento) => {
    const botao = evento.target.closest?.('[data-pokemon-id]');
    if (!botao || !destino) return;
    botao.disabled = true;
    try {
      const itens = await OBR.scene.items.getItems([botao.dataset.pokemonId]);
      const pokemon = itens[0];
      if (!pokemon) throw new Error('Esse Pokémon não está mais na mesa.');
      const trainerAtual = await pegarTokenAtualizado(token.id) || token;
      await registrarPokemonDaCenaNoSlot(trainerAtual, destino.grupo, destino.indice, pokemon);
      fechar();
      const atualizado = await pegarTokenAtualizado(token.id) || trainerAtual;
      await mostrarFichaTreinadorPokemons(atualizado);
    } catch (erro) {
      console.error('Erro ao guardar Pokémon:', erro);
      alert(erro?.message || 'Não foi possível guardar este Pokémon.');
      botao.disabled = false;
    }
  });
}

function normalizarEstagioBuff(valor, id = "") { let estagio = Number(valor);
if (Number.isNaN(estagio)) { estagio = 0; }
estagio = Math.trunc(estagio);
if (id === "crit") { return Math.max(0, Math.min(6, estagio)); }
return estagio; }
function bonusPorEstagio(id, estagio, proficiencia) { const valorEstagio = normalizarEstagioBuff(estagio, id);
const prof = Number(proficiencia) || 0;
if (id === "evas" || id === "pres") { return valorEstagio; }
return valorEstagio * prof; }
function numeroDecimal(valor) { const texto = String(valor ?? "") .trim() .replace(",", ".");
if (texto === "") { return null; }
const numero = Number(texto);
return Number.isFinite(numero) ? numero : null; }
function formatarDecimal(valor) { const numero = numeroDecimal(valor);
if (numero === null) { return ""; }
const arredondado = Math.round(numero * 1000) / 1000;
return String(arredondado) .replace(".", ","); }
function movimentoComVelocidade( valorBase, estagioVelocidade ) { const base = numeroDecimal(valorBase);
if (base === null) { return ""; }
const bonus = normalizarEstagioBuff( estagioVelocidade, "vel" ) * 1.5;
return Math.max( 0, base + bonus ); }
function faixaCritico(estagio) { const mapa = { 0: "20", 1: "17–20", 2: "14–20", 3: "11–20", 4: "8–20", 5: "5–20", 6: "2–20" };
const valor = Math.max(0, Math.min(6, Number(estagio) || 0));
return mapa[valor]; }
function duplicarDadosFormula(formula) { return String(formula || "").replace( /(^|[^A-Za-z0-9_])(\d*)d(\d+)/gi, (match, prefixo, quantidade, faces) => { const qtd = quantidade === "" ? 1 : Number(quantidade);
return `${prefixo}${qtd * 2}d${faces}`;
} ); }
function adicionarBonusNaFormula(formula, bonus) {
if (bonus > 0) return `${formula}+${bonus}`;
if (bonus < 0) return `${formula}${bonus}`;
return formula; }
function formulaSalvaguarda(valor) { const numero = Number( String(valor ?? "") .trim() .replace(",", ".") );
if (Number.isNaN(numero)) { return null; }
return `1d20${numero >= 0 ? "+" : ""}${numero}`;
}
async function dicePlusPronto() { const requestId = crypto.randomUUID();
return new Promise((resolve) => { let terminou = false; const unsubscribe = OBR.broadcast.onMessage( "dice-plus/isReady", (event) => { if ( event.data?.ready === true && event.data?.requestId === requestId && !terminou ) { terminou = true; unsubscribe(); resolve(true); } } ); OBR.broadcast.sendMessage( "dice-plus/isReady", { requestId, timestamp: Date.now() }, { destination: "ALL" } ); setTimeout(() => { if (!terminou) { terminou = true; unsubscribe(); resolve(false); } }, 1000); }); }
async function rolarNoDicePlus(formula, nome, tipo = "") { formula = String(formula || "").trim();
if (!formula) { alert("A fórmula da rolagem está vazia.");
return; }
if (!(await dicePlusPronto())) { alert("Dice+ não foi encontrado.");
return; }
const playerId = await OBR.player.getId();
const playerName = await OBR.player.getName();
const nomeSeguro = limparRotuloDice(nome) || "Rolagem";
const tipoSeguro = limparRotuloDice(tipo);
const rotulo = tipoSeguro
? `${nomeSeguro} ${tipoSeguro}`
: nomeSeguro;
const formulaCompleta =
`${formula} # ${rotulo}`;
await OBR.broadcast.sendMessage( "dice-plus/roll-request", { rollId:
`pokemon_${Date.now()}_${Math.random()
                    .toString(36)
                    .slice(2, 8)}`,
playerId, playerName, rollTarget: "everyone", diceNotation: formulaCompleta, showResults: true, timestamp: Date.now(), source: PREFIX }, { destination: "ALL" } ); }
async function rolarNoDicePlusComResultado(formula, nome, tipo = "") { formula = String(formula || "").trim();
if (!formula) { alert("A fórmula da rolagem está vazia.");
return null; }
if (!(await dicePlusPronto())) { alert("Dice+ não foi encontrado.");
return null; }
const playerId = await OBR.player.getId();
const playerName = await OBR.player.getName();
const nomeSeguro = limparRotuloDice(nome) || "Rolagem";
const tipoSeguro = limparRotuloDice(tipo);
const rotulo = tipoSeguro
? `${nomeSeguro} ${tipoSeguro}`
: nomeSeguro;
const formulaCompleta =
`${formula} # ${rotulo}`;
const rollId =
`pokemon_${Date.now()}_${Math.random()
            .toString(36)
            .slice(2, 8)}`;
return new Promise(async (resolve) => { let terminou = false; let temporizador = null; const finalizar = (valor) => { if (terminou) { return; } terminou = true; if (temporizador) { clearTimeout(temporizador); } unsubscribeResultado(); unsubscribeErro(); resolve(valor); }; const unsubscribeResultado = OBR.broadcast.onMessage(
`${PREFIX}/roll-result`,
(event) => { const dados = event.data; if (dados?.rollId !== rollId) { return; } const total = Number( dados?.result?.totalValue ); finalizar( Number.isFinite(total) ? total : null ); } ); const unsubscribeErro = OBR.broadcast.onMessage(
`${PREFIX}/roll-error`,
(event) => { const dados = event.data; if (dados?.rollId !== rollId) { return; } alert( dados?.error
? `Erro na rolagem: ${dados.error}`
: "Não foi possível concluir a rolagem." ); finalizar(null); } ); temporizador = setTimeout(() => { if (!terminou) { alert( "A rolagem demorou demais para retornar o resultado." ); finalizar(null); } }, 30000); try { await OBR.broadcast.sendMessage( "dice-plus/roll-request", { rollId, playerId, playerName, rollTarget: "everyone", diceNotation: formulaCompleta, showResults: true, timestamp: Date.now(), source: PREFIX }, { destination: "ALL" } ); } catch (erro) { console.error( "Erro ao solicitar rolagem de cura no Dice+:", erro ); finalizar(null); } }); }
const TIPOS_VISUAIS_HUD = [ "fundo", "vida", "hp-texto", "ca-circulo", "ca-texto", ...STATUS_DEBUFFS.map(
(status) => `debuff-${status.id}`
) ];
const filaHudPorToken = new Map();
function prepararVisualHud(item) { const comportamentos = new Set( item.disableAttachmentBehavior || [] );
comportamentos.add("SCALE");
comportamentos.add("ROTATION");
item.disableAttachmentBehavior = [ ...comportamentos ];
item.rotation = 0;
item.scale = { x: 1, y: 1 };
return item; }
function ordenarHudMaisNovoPrimeiro(a, b) { const dataA = Date.parse(a.lastModified || "") || 0;
const dataB = Date.parse(b.lastModified || "") || 0;
if (dataA !== dataB) { return dataB - dataA; }
return String(a.id).localeCompare(String(b.id)); }
async function desduplicarHudToken( tokenId, tiposAtivos = TIPOS_VISUAIS_HUD ) { const ativos = new Set(tiposAtivos);
const visuais = await OBR.scene.items.getItems( (item) => item.metadata?.[
`${PREFIX}/statusToken`
] === tokenId );
const porTipo = new Map();
for (const item of visuais) { const tipo = item.metadata?.[
`${PREFIX}/tipoVisual`
];
if (!porTipo.has(tipo)) { porTipo.set(tipo, []); }
porTipo.get(tipo).push(item); }
const apagar = [];
for (const [tipo, itens] of porTipo) { const ordenados = [...itens].sort( ordenarHudMaisNovoPrimeiro );
if (!ativos.has(tipo)) { apagar.push( ...ordenados.map( (item) => item.id ) );
continue; }
if (ordenados.length > 1) { apagar.push( ...ordenados .slice(1) .map((item) => item.id) ); } }
if (apagar.length) { await OBR.scene.items.deleteItems( [...new Set(apagar)] ); } }
async function corrigirHudExistente() { const visuais = await OBR.scene.items.getItems( (item) => item.metadata?.[
`${PREFIX}/statusToken`
] !== undefined );
if (!visuais.length) { return; }
const tokenIds = [ ...new Set( visuais .map( (item) => item.metadata?.[
`${PREFIX}/statusToken`
] ) .filter(Boolean) ) ];
const tokens = await OBR.scene.items.getItems( (item) => tokenIds.includes(item.id) );
const tokensEncontrados = new Set( tokens.map((item) => item.id) );
const orfaos = visuais .filter( (item) => !tokensEncontrados.has( item.metadata?.[
`${PREFIX}/statusToken`
] ) ) .map((item) => item.id);
if (orfaos.length) { await OBR.scene.items.deleteItems( orfaos ); }
// Recria o HUD inteiro de cada token.
// Isso também APAGA automaticamente qualquer
// ENV gigante criado por versões anteriores.
for (const token of tokens) { const hpAtual = Number( token.metadata[
`${PREFIX}/hpAtual`
] ?? 100 ) || 0;
const hpMax = Math.max( 1, Number( token.metadata[
`${PREFIX}/hpMax`
] ?? 100 ) || 1 );
const caBase = Number( token.metadata[
`${PREFIX}/ca`
] ?? 10 ) || 0;
const evasao = Number( token.metadata[
`${PREFIX}/buff-evas`
] ?? 0 ) || 0;
await criarStatusNoToken( token, hpAtual, hpMax, caBase + evasao ); } }
async function executarEmFilaHud( tokenId, tarefa ) { const anterior = filaHudPorToken.get(tokenId) || Promise.resolve();
const atual = anterior .catch(() => {}) .then(tarefa);
filaHudPorToken.set( tokenId, atual );
try { return await atual; } finally { if ( filaHudPorToken.get(tokenId) === atual ) { filaHudPorToken.delete(tokenId); } } }
async function criarStatusNoToken( token, hpAtual, hpMax, ca ) { return executarEmFilaHud( token.id, async () => { const antigos = await OBR.scene.items.getItems( (item) => item.metadata?.[
`${PREFIX}/statusToken`
] === token.id ); if (antigos.length) { await OBR.scene.items.deleteItems( antigos.map( (item) => item.id ) ); } const bounds = await OBR.scene.items.getItemBounds( [token.id] ); const larguraBarra = Math.max( 100, Math.min( 180, bounds.width * 0.85 ) ); const alturaBarra = Math.max( 20, Math.min( 30, larguraBarra * 0.16 ) ); const tamanhoCA = alturaBarra * 1.4; const espacoCA = alturaBarra * 0.35; const larguraTotal = larguraBarra + espacoCA + tamanhoCA; const inicioX = bounds.min.x + ( (bounds.width - larguraTotal) / 2 ); const barraY = bounds.max.y + Math.max( 8, bounds.height * 0.03 ); let porcentagem = hpMax > 0 ? hpAtual / hpMax : 0; porcentagem = Math.max( 0, Math.min( 1, porcentagem ) ); const larguraVida = larguraBarra * porcentagem; let corVida = "#34C759"; if (porcentagem <= 0.50) { corVida = "#FFD60A"; } if (porcentagem <= 0.25) { corVida = "#FF453A"; } const fundoBarra = prepararVisualHud( buildShape() .shapeType("RECTANGLE") .width(larguraBarra) .height(alturaBarra) .position({ x: inicioX, y: barraY }) .fillColor("#202020") .fillOpacity(1) .strokeColor("#000000") .strokeWidth(2) .layer("ATTACHMENT") .zIndex(0) .disableAutoZIndex(true) .attachedTo(token.id) .locked(true) .disableHit(true) .metadata({
[`${PREFIX}/statusToken`]:
token.id,
[`${PREFIX}/tipoVisual`]:
"fundo" }) .build() ); let barraVida = null; if (larguraVida > 0) { barraVida = prepararVisualHud( buildShape() .shapeType("RECTANGLE") .width(larguraVida) .height(alturaBarra) .position({ x: inicioX, y: barraY }) .fillColor(corVida) .fillOpacity(1) .strokeWidth(0) .layer("ATTACHMENT") .zIndex(1) .disableAutoZIndex(true) .attachedTo(token.id) .locked(true) .disableHit(true) .metadata({
[`${PREFIX}/statusToken`]:
token.id,
[`${PREFIX}/tipoVisual`]:
"vida" }) .build() ); } const fonteHP = Math.max( 16, alturaBarra * 0.72 ); const textoHP = prepararVisualHud( buildText() .textType("PLAIN")
.plainText(`${hpAtual}`)
.position({ x: inicioX, y: barraY + ( (alturaBarra - fonteHP) / 2 ) }) .width(larguraBarra) .height("AUTO") .fontFamily("Arial") .fontSize(fonteHP) .fontWeight(700) .lineHeight(1) .fillColor("#FFFFFF") .fillOpacity(1) .strokeWidth(0) .textAlign("CENTER") .padding(0) .layer("ATTACHMENT") .zIndex(10) .disableAutoZIndex(true) .attachedTo(token.id) .locked(true) .disableHit(true) .metadata({
[`${PREFIX}/statusToken`]:
token.id,
[`${PREFIX}/tipoVisual`]:
"hp-texto" }) .build() ); const caX = inicioX + larguraBarra + espacoCA + 8; const caY = barraY - ( (tamanhoCA - alturaBarra) / 2 ) + 3; const circuloCA = prepararVisualHud( buildShape() .shapeType("CIRCLE") .width(tamanhoCA) .height(tamanhoCA) .position({ x: caX, y: caY }) .fillColor("#2481CC") .fillOpacity(1) .strokeColor("#FFFFFF") .strokeWidth(2) .layer("ATTACHMENT") .zIndex(1) .disableAutoZIndex(true) .attachedTo(token.id) .locked(true) .disableHit(true) .metadata({
[`${PREFIX}/statusToken`]:
token.id,
[`${PREFIX}/tipoVisual`]:
"ca-circulo" }) .build() ); const fonteCA = tamanhoCA * 0.45; const textoCA = prepararVisualHud( buildText() .textType("PLAIN")
.plainText(`${ca}`)
.position({ x: caX - (tamanhoCA / 2), y: caY - (tamanhoCA / 2) }) .width(tamanhoCA) .height(tamanhoCA) .fontFamily("Arial") .fontSize(fonteCA) .fontWeight(700) .lineHeight(1) .fillColor("#FFFFFF") .fillOpacity(1) .strokeWidth(0) .textAlign("CENTER") .textAlignVertical("MIDDLE") .padding(0) .layer("ATTACHMENT") .zIndex(20) .disableAutoZIndex(true) .attachedTo(token.id) .locked(true) .disableHit(true) .metadata({
[`${PREFIX}/statusToken`]:
token.id,
[`${PREFIX}/tipoVisual`]:
"ca-texto" }) .build() ); const debuffsAtivos = STATUS_DEBUFFS.filter( (status) => debuffAtivoNoToken( token, status ) ); const visuaisDebuff = []; if (debuffsAtivos.length) { const gridDpi = Math.max( 1, Number( await OBR.scene.grid.getDpi() ) || 150 );
// Badges novamente maiores, aproximadamente
// o dobro da versão anterior.
// Para manter tudo legível, usamos 1 por linha.
const maxPorLinha = 1; const gapX = 0; const gapY = 5; const larguraBadge = Math.max( 68, Math.min( 88, larguraBarra * 0.72 ) );
// Fica claramente abaixo da barra de HP,
// sem encostar nela.
const topoDebuffs = barraY + alturaBarra + 12; for ( let indice = 0; indice < debuffsAtivos.length; indice++ ) { const status = debuffsAtivos[indice]; const bbox = status.imagem.bbox; const escala = larguraBadge / bbox.width; const alturaBadge = bbox.height * escala; const linha = Math.floor( indice / maxPorLinha ); const indiceLinha = indice % maxPorLinha; const inicioLinha = linha * maxPorLinha; const quantidadeLinha = Math.min( maxPorLinha, debuffsAtivos.length - inicioLinha ); const larguraLinha = ( quantidadeLinha * larguraBadge ) + ( Math.max( 0, quantidadeLinha - 1 ) * gapX ); const centroX = inicioX + (larguraBarra / 2); const x = centroX - (larguraLinha / 2) + (larguraBadge / 2) + ( indiceLinha * (larguraBadge + gapX) );
// Espaçamento vertical proporcional
// ao novo tamanho maior dos badges.
const passoLinha = (larguraBadge * 0.46) + gapY; const y = topoDebuffs + (alturaBadge / 2) + (linha * passoLinha);
// O ponto de ancoragem é o CENTRO DO
// DESENHO VISÍVEL, não o centro do PNG
// transparente de 1254x1254.
const offsetX = bbox.x + (bbox.width / 2); const offsetY = bbox.y + (bbox.height / 2); const visual = buildImage( { width: status.imagem.width, height: status.imagem.height, url: urlDebuff(status), mime: "image/png" }, { dpi: gridDpi, offset: { x: offsetX, y: offsetY } } ) .position({ x, y }) .rotation(0) .scale({ x: escala, y: escala }) .layer("ATTACHMENT") .zIndex(30 + indice) .disableAutoZIndex(true) .attachedTo(token.id) .locked(true) .disableHit(true) .metadata({
[`${PREFIX}/statusToken`]:
token.id,
[`${PREFIX}/tipoVisual`]:
`debuff-${status.id}`,
[`${PREFIX}/debuffId`]:
status.id }) .build();
// IMPORTANTE:
// herdamos movimento do token,
// mas NÃO herdamos escala nem rotação.
const comportamentos = new Set( visual .disableAttachmentBehavior || [] ); comportamentos.add("SCALE"); comportamentos.add("ROTATION"); visual.disableAttachmentBehavior = [...comportamentos]; visuaisDebuff.push(visual); } } const elementos = [ fundoBarra ]; if (barraVida) { elementos.push( barraVida ); } elementos.push( circuloCA, textoHP, textoCA, ...visuaisDebuff ); await OBR.scene.items.addItems( elementos ); const tiposAtivos = [ "fundo", "hp-texto", "ca-circulo", "ca-texto" ]; if (barraVida) { tiposAtivos.push("vida"); } for ( const status of debuffsAtivos ) { tiposAtivos.push(
`debuff-${status.id}`
); } await new Promise( (resolve) => setTimeout(resolve, 80) ); await desduplicarHudToken( token.id, tiposAtivos ); await new Promise( (resolve) => setTimeout(resolve, 220) ); await desduplicarHudToken( token.id, tiposAtivos ); } ); }
async function pegarHpCaDaTela(aplicarCalculadora = false) { let hpAtual = Number( document .querySelector("#hpAtual") .value );
let hpMax = Number( document .querySelector("#hpMax") .value );
const ca = Number( document .querySelector("#ca") .value );
const bonusEvasaoCa = Number( document .querySelector("#bonusEvasaoCa") ?.value ?? 0 ) || 0;
const caBase = ca - bonusEvasaoCa;
const alterarHp = document .querySelector("#alterarHp") .value .trim();
if (Number.isNaN(hpAtual)) { alert( "HP atual inválido." );
return null; }
if (Number.isNaN(hpMax)) { alert( "HP máximo inválido." );
return null; }
if (Number.isNaN(ca)) { alert( "CA inválida." );
return null; }
if (hpMax < 1) { hpMax = 1; }
if (aplicarCalculadora && alterarHp === "") { alert("Digite um valor na Calculadora antes de calcular.");
return null; }
if (aplicarCalculadora && alterarHp !== "") { const primeiroCaractere = alterarHp.charAt(0);
const temOperadorExplicito = primeiroCaractere === "+" || primeiroCaractere === "-" || primeiroCaractere === "=";
const operador = temOperadorExplicito ? primeiroCaractere : "+";
const textoValor = temOperadorExplicito ? alterarHp.substring(1) : alterarHp;
const valor = Number(textoValor);
if (Number.isNaN(valor)) { alert( "Valor da calculadora inválido." );
return null; }
const fatorDano = Number( document .querySelector("#multiplicadorHp") ?.value ?? 1 ) || 1;
if (operador === "+") { hpAtual += valor; } else if (operador === "-") { let danoCalculado = Math.floor(valor * fatorDano);
const tipoMove = document .querySelector("#tipoMoveHpSelecionado") ?.value || "neutro";
const proficienciaAtual = Number( document.querySelector("#proficiencia")?.value ?? document.querySelector("#treinadorProficiencia")?.value ?? 0 ) || 0;
let estagioDefesa = 0;
if (tipoMove === "fisico") { estagioDefesa = Number( document.querySelector("#estagioDefHp")?.value ?? 0 ) || 0; } else if (tipoMove === "especial") { estagioDefesa = Number( document.querySelector("#estagioDefSpHp")?.value ?? 0 ) || 0; }
const bonusDefesa = bonusPorEstagio( tipoMove === "fisico" ? "def" : "defsp", estagioDefesa, proficienciaAtual );
danoCalculado = Math.max( 0, Math.floor(danoCalculado - bonusDefesa) );
hpAtual -= danoCalculado; } else if (operador === "=") { hpAtual = valor; } else { alert( "Use -34 para dano, 20 ou +20 para cura, ou =50 para definir o HP." );
return null; } }
hpAtual = Math.max( 0, Math.min( hpAtual, hpMax ) );
return { hpAtual, hpMax, ca, caBase, calculadoraAplicada: aplicarCalculadora && alterarHp !== "" }; }
function criarLinhaAtributos( titulo, tipo, valores ) { const ehSalvaguarda = tipo.includes("save");
const ehModificador = tipo.includes("mod");
const ehStatusPokemon = tipo === "status";
const ehModificadorPokemon = tipo === "mod";
const rolavel = ehSalvaguarda || ehModificador;
const caixas = ATRIBUTOS.map( (atributo) => { const tipoRolagem = ehSalvaguarda ? "Salvaguarda" : "Modificador"; const botao = rolavel
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
              type="${ehStatusPokemon ? "number" : "text"}"
              ${ehStatusPokemon ? 'step="1"' : ''}
              ${ehModificadorPokemon ? 'readonly title="Calculado automaticamente pelo Status"' : ''}
              value="${esc(valores[atributo])}"
              placeholder="${ehStatusPokemon ? "10" : "+0"}"
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
} ).join("");
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
function ativarCalculoStatusPokemon() {
  for (const atributo of ATRIBUTOS) {
    const campoStatus = document.querySelector(`#status-${atributo}`);
    const campoMod = document.querySelector(`#mod-${atributo}`);
    if (!campoStatus || !campoMod) continue;
    const atualizar = () => {
      const numero = Number(String(campoStatus.value ?? "").trim().replace(",", "."));
      if (!Number.isFinite(numero)) return;
      campoMod.value = formatarBonus(modificadorPorStatus(numero));
      campoMod.dispatchEvent(new Event("input", { bubbles: true }));
    };
    campoStatus.addEventListener("input", atualizar);
    campoStatus.addEventListener("change", atualizar);
    atualizar();
  }
}

function ativarRolagensSalvaguarda(token) { document .querySelectorAll(".rolarAtributo") .forEach( (botao) => { botao.addEventListener( "click", async () => { const atributo = botao.dataset.atributo; const tipoRolagem = botao.dataset.tipoRolagem || "Modificador"; const campo = document.querySelector(
`#${botao.dataset.campo}`
); let valorRolagem = campo?.value; if (tipoRolagem === "Salvaguarda") { const valorBase = Number( String(campo?.value ?? "") .trim() .replace(",", ".") ); if (Number.isNaN(valorBase)) { alert( "Valor de salvaguarda inválido." ); return; } const estagioEvasao = normalizarEstagioBuff( token?.metadata?.[
`${PREFIX}/buff-evas`
] ?? 0, "evas" ); valorRolagem = valorBase + estagioEvasao; } const formula = formulaSalvaguarda( valorRolagem ); if (!formula) { alert(
`Valor de ${tipoRolagem.toLowerCase()} inválido.`
); return; } await rolarNoDicePlus( formula,
`${tipoRolagem} de ${
                NOMES_ATRIBUTOS[atributo] ||
                atributo.toUpperCase()
              }`
); } ); } ); }
function ativarRolagemIniciativa(token) {
const botaoRolar = document.querySelector("#rolarIniciativa");
const campoIniciativa = document.querySelector("#iniciativa");
const campoDestreza = document.querySelector("#treinador-mod-des") || document.querySelector("#mod-des");
const campoProficiencia = document.querySelector("#treinadorProficiencia") || document.querySelector("#proficiencia");
const campoAlerta = document.querySelector("#iniciativaAlerta");
const campoHabilidade = document.querySelector("#iniciativaHabilidade");
const campoDobrar = document.querySelector("#iniciativaDobrar");
const botaoAlerta = document.querySelector("#botaoIniciativaAlerta");
const botaoHabilidade = document.querySelector("#botaoIniciativaHabilidade");
const botaoDobrar = document.querySelector("#botaoIniciativaDobrar");
const botaoAbrirPainel = document.querySelector("#abrirApresentadorIniciativa");
const botaoRemoverIniciativa = document.querySelector("#removerDaIniciativa");
let botaoAvancarTurno = document.querySelector("#avancarTurnoIniciativa");
if (!botaoAvancarTurno && botaoRemoverIniciativa?.parentElement) {
  botaoAvancarTurno = document.createElement("button");
  botaoAvancarTurno.id = "avancarTurnoIniciativa";
  botaoAvancarTurno.type = "button";
  botaoAvancarTurno.title = "Passar o turno para o próximo participante";
  botaoAvancarTurno.textContent = "➜";
  botaoAvancarTurno.style.cssText = "min-width:38px;min-height:36px;padding:5px 7px;font-size:13px;cursor:pointer";
  botaoRemoverIniciativa.parentElement.insertBefore(botaoAvancarTurno, botaoRemoverIniciativa);
}
if (!botaoRolar || !campoIniciativa || !campoDestreza || !campoAlerta || !campoHabilidade || !campoDobrar || !botaoAlerta || !botaoHabilidade || !botaoDobrar) return;
const numeroCampo = (valor) => {
  const numero = Number(String(valor ?? "").trim().replace(",", "."));
  return Number.isNaN(numero) ? 0 : numero;
};
const proficienciaAtual = () => numeroCampo(campoProficiencia?.value);
const bonusHabilidadeFinal = () => campoHabilidade.value === "1" ? proficienciaAtual() * 2 : 0;
const iniciativaParaRolagem = () => {
  const destreza = numeroCampo(campoDestreza.value);
  const proficiencia = proficienciaAtual();
  const bonusAlerta = campoAlerta.value === "1" ? 5 : 0;
  const estagioVelocidade = normalizarEstagioBuff(token?.metadata?.[`${PREFIX}/buff-vel`] ?? 0, "vel");
  const bonusVelocidade = estagioVelocidade * proficiencia;
  // Habilidade NÃO entra mais no bônus do dado. Ela é aplicada somente no total do apresentador.
  return destreza + bonusVelocidade + bonusAlerta;
};
const atualizarVisual = () => {
  campoIniciativa.value = String(iniciativaParaRolagem());
  botaoAlerta.classList.toggle("ativo", campoAlerta.value === "1");
  botaoHabilidade.classList.toggle("ativo", campoHabilidade.value === "1");
  botaoDobrar.classList.toggle("ativo", campoDobrar.value === "1");
};
const salvarEstado = () => {
  const botaoSalvarStatus = document.querySelector("#salvarPokemonStatus, #salvarTreinadorStatus");
  if (botaoSalvarStatus) botaoSalvarStatus.click();
};
const atualizarTotalJaRolado = async () => {
  await recalcularResultadoIniciativaComOpcoes(token.id, {
    habilidadeAtiva: campoHabilidade.value === "1",
    bonusHabilidade: proficienciaAtual() * 2,
    dobrarAtiva: campoDobrar.value === "1"
  });
};
const alternar = async (campo, afetaTotalApresentador = false) => {
  campo.value = campo.value === "1" ? "0" : "1";
  atualizarVisual();
  salvarEstado();
  if (afetaTotalApresentador) await atualizarTotalJaRolado();
};
campoDestreza.addEventListener("input", atualizarVisual);
campoDestreza.addEventListener("change", atualizarVisual);
if (campoProficiencia) {
  campoProficiencia.addEventListener("input", atualizarVisual);
  campoProficiencia.addEventListener("change", atualizarVisual);
}
botaoAlerta.addEventListener("click", () => alternar(campoAlerta, false));
botaoHabilidade.addEventListener("click", () => alternar(campoHabilidade, true));
botaoDobrar.addEventListener("click", () => alternar(campoDobrar, true));
botaoRolar.addEventListener("click", async () => {
  const formula = formulaSalvaguarda(iniciativaParaRolagem());
  if (!formula) { alert("Não foi possível calcular a iniciativa."); return; }
  const resultadoDado = await rolarNoDicePlusComResultado(formula, "Iniciativa");
  if (resultadoDado === null) return;
  const bonusHabilidade = bonusHabilidadeFinal();
  const dobrado = campoDobrar.value === "1";
  const totalFinal = (resultadoDado + bonusHabilidade) * (dobrado ? 2 : 1);
  await salvarResultadoIniciativa(token, totalFinal, {
    rolagemBase: resultadoDado,
    bonusHabilidade,
    dobrado,
    ajusteManual: 0
  });
  await abrirApresentadorIniciativa(token);
});
if (botaoAbrirPainel) botaoAbrirPainel.addEventListener("click", () => abrirApresentadorIniciativa(token));
if (botaoAvancarTurno) {
  botaoAvancarTurno.addEventListener("click", async () => {
    const iniciativas = iniciativasOrdenadas(await OBR.scene.items.getItems());
    if (!iniciativas.length) return;
    const atual = iniciativas.find(({ item }) => item.metadata?.[META_TURNO_INICIATIVA] === true)?.item || iniciativas[0].item;
    await avancarTurnoIniciativa(atual.id);
  });
}
if (botaoRemoverIniciativa) botaoRemoverIniciativa.addEventListener("click", async () => { await removerDaIniciativa(token.id); });
atualizarVisual();
}
function criarBuffs( valores, proficiencia ) { return BUFFS.map( (buff) => { const estagio = normalizarEstagioBuff( valores[buff.id], buff.id ); const bonus = buff.id === "crit" ? faixaCritico(estagio) : bonusPorEstagio( buff.id, estagio, proficiencia );
return `
        <div style="
          width:62px;
          text-align:center;
          display:flex;
          flex-direction:column;
          align-items:center;
        ">
          <div style="
            font-size:10px;
            font-weight:bold;
            margin-bottom:2px;
            line-height:1.05;
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
              width:54px;
              min-height:28px !important;
              height:28px;
              box-sizing:border-box;
              text-align:center;
              padding:2px 4px !important;
              font-weight:bold;
            "
          >
          <div
            id="bonus-${buff.id}"
            style="
              font-size:10px;
              margin-top:1px;
              line-height:1;
              opacity:0.82;
            "
          >
            ${buff.id === "crit" ? bonus : formatarBonus(bonus)}
          </div>
        </div>
      `;
} ).join(""); }
function criarPericias( valores ) { return PERICIAS.map( (grupo) => { if (!grupo.pericias.length) {
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
} const linhas = grupo.pericias.map(
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
} ).join(""); }
function criarSlots( quantidade, prefixo, valores, placeholder ) { let html = "";
for ( let i = 1; i <= quantidade; i++ ) {
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
return html; }
function ativarCalculadoraHp() { const botaoSuper = document.querySelector("#botaoSuperEfetivo");
const opcoesSuper = document.querySelector("#opcoesSuperEfetivo");
const botaoResistente = document.querySelector("#botaoResistente");
const opcoesResistente = document.querySelector("#opcoesResistente");
const multiplicador = document.querySelector("#multiplicadorHp");
const botaoMove = document.querySelector("#botaoMove");
const opcoesMove = document.querySelector("#opcoesMove");
const tipoMoveSelecionado = document.querySelector("#tipoMoveHpSelecionado");
const botaoCalcular = document.querySelector("#botaoCalcularHp");
if ( !botaoSuper || !opcoesSuper || !botaoResistente || !opcoesResistente || !multiplicador || !botaoMove || !opcoesMove || !tipoMoveSelecionado || !botaoCalcular ) { return; }
const atualizarVisual = () => { const fator = Number(multiplicador.value) || 1;
botaoSuper.classList.remove( "super2", "super4" );
botaoResistente.classList.remove( "resistente2", "resistente4" );
if (fator === 2) { botaoSuper.classList.add("super2");
botaoSuper.textContent = "Super Efetivo 2x"; } else if (fator === 4) { botaoSuper.classList.add("super4");
botaoSuper.textContent = "Super Efetivo 4x"; } else { botaoSuper.textContent = "Super Efetivo"; }
if (fator === 0.5) { botaoResistente.classList.add("resistente2");
botaoResistente.textContent = "Resistente 2x"; } else if (fator === 0.25) { botaoResistente.classList.add("resistente4");
botaoResistente.textContent = "Resistente 4x"; } else { botaoResistente.textContent = "Resistente"; }
const tipoMove = tipoMoveSelecionado.value || "neutro";
botaoMove.classList.remove( "moveFisico", "moveEspecial" );
if (tipoMove === "fisico") { botaoMove.classList.add("moveFisico");
botaoMove.textContent = "Move Físico"; } else if (tipoMove === "especial") { botaoMove.classList.add("moveEspecial");
botaoMove.textContent = "Move Especial"; } else { botaoMove.textContent = "Move"; }
document .querySelectorAll(".tipoMoveHp") .forEach((opcao) => { opcao.classList.toggle( "ativo", opcao.dataset.tipo === tipoMove ); });
document .querySelectorAll( ".multiplicadorSuperEfetivo" ) .forEach((opcao) => { opcao.classList.toggle( "ativo", Number(opcao.dataset.fator) === fator ); });
document .querySelectorAll( ".divisorResistente" ) .forEach((opcao) => { opcao.classList.toggle( "ativo", Number(opcao.dataset.fator) === fator ); }); };
botaoSuper.addEventListener("click", () => { opcoesResistente.classList.remove("aberto"); opcoesMove.classList.remove("aberto"); opcoesSuper.classList.toggle("aberto"); });
botaoResistente.addEventListener("click", () => { opcoesSuper.classList.remove("aberto"); opcoesMove.classList.remove("aberto"); opcoesResistente.classList.toggle("aberto"); });
botaoMove.addEventListener("click", () => { opcoesSuper.classList.remove("aberto"); opcoesResistente.classList.remove("aberto"); opcoesMove.classList.toggle("aberto"); });
document .querySelectorAll( ".multiplicadorSuperEfetivo" ) .forEach((opcao) => { opcao.addEventListener("click", () => { multiplicador.value = opcao.dataset.fator || "1"; atualizarVisual(); opcoesSuper.classList.remove("aberto"); }); });
document .querySelectorAll( ".divisorResistente" ) .forEach((opcao) => { opcao.addEventListener("click", () => { multiplicador.value = opcao.dataset.fator || "1"; atualizarVisual(); opcoesResistente.classList.remove("aberto"); }); });
document .querySelectorAll(".tipoMoveHp") .forEach((opcao) => { opcao.addEventListener("click", () => { tipoMoveSelecionado.value = opcao.dataset.tipo || "neutro"; atualizarVisual(); opcoesMove.classList.remove("aberto"); }); });
botaoCalcular.addEventListener("click", () => { const campoCalculadora = document.querySelector("#alterarHp"); if (!campoCalculadora?.value.trim()) { alert("Digite um valor na Calculadora antes de calcular."); return; } const botaoSalvarStatus = document.querySelector( "#salvarPokemonStatus, #salvarTreinadorStatus" ); if (!botaoSalvarStatus) { return; } botaoSalvarStatus.dataset.aplicarCalculadora = "1"; botaoSalvarStatus.click(); });
atualizarVisual(); }
let salvamentoBuffPendente = Promise.resolve();
let salvamentoMovimentoPendente = Promise.resolve();
const IDS_BOTOES_AUTOSAVE = [ "salvarPokemonStatus", "salvarPokemonMoves", "salvarPokemonPericias", "salvarPokemonTalentos", "salvarTreinadorStatus", "salvarTreinadorPerTal", "salvarTreinadorHabilidades", "salvarTreinadorAnotacoes" ];
function ativarAutosaveDaTela() { const app = document.querySelector("#app");
if (!app) { return; }
const botaoSalvar = IDS_BOTOES_AUTOSAVE
.map((id) => document.querySelector(`#${id}`))
.find(Boolean);
if (!botaoSalvar || botaoSalvar.dataset.autosaveAtivo === "1") { return; }
botaoSalvar.dataset.autosaveAtivo = "1";
botaoSalvar.style.display = "none";
let temporizador = null;
const programarSalvamento = (atraso = 650) => { if (temporizador) { clearTimeout(temporizador); }
temporizador = setTimeout(() => { if (!document.body.contains(botaoSalvar)) { return; } botaoSalvar.click(); }, atraso); };
app.querySelectorAll("input, textarea, select") .forEach((campo) => { if (campo.id === "alterarHp") { return; } if (campo.classList.contains("movimentoValor")) { return; } if (campo.classList.contains("megaConfigCampo")) { return; } campo.addEventListener("input", () => { programarSalvamento(180); }); campo.addEventListener("change", () => { programarSalvamento(0); }); campo.addEventListener("blur", () => { programarSalvamento(0); }); });
app.querySelectorAll(".categoriaGolpe") .forEach((botao) => { botao.addEventListener("click", () => { programarSalvamento(120); }); }); }
const CAMPOS_MOVIMENTACAO = [ { id: "movimentoCaminhada", metaId: "metaMovimentoCaminhada", chave: "movimento-caminhada" }, { id: "movimentoEscalada", metaId: "metaMovimentoEscalada", chave: "movimento-escalada" }, { id: "movimentoVoo", metaId: "metaMovimentoVoo", chave: "movimento-voo" }, { id: "movimentoNatacao", metaId: "metaMovimentoNatacao", chave: "movimento-natacao" }, { id: "movimentoEscavacao", metaId: "metaMovimentoEscavacao", chave: "movimento-escavacao" }, { id: "movimentoFlutuacao", metaId: "metaMovimentoFlutuacao", chave: "movimento-flutuacao" } ];
function normalizarMovimentoBase(valor) { const numero = numeroDecimal(valor);
if (numero === null) { return null; }
return Math.max( 0, Math.round(numero * 1000) / 1000 ); }
function bonusMovimentoPorVelocidade(estagioVelocidade) { return normalizarEstagioBuff( estagioVelocidade, "vel" ) * 1.5; }
function salvarMovimentoBaseNoToken( token, chave, valorBase ) { const valorSalvar = valorBase === null ? "" : valorBase;
token.metadata[
`${PREFIX}/${chave}`
] = valorSalvar;
salvamentoMovimentoPendente = salvamentoMovimentoPendente .catch(() => {}) .then(async () => { await OBR.scene.items.updateItems( [token.id], (items) => { for (const item of items) { item.metadata[
`${PREFIX}/${chave}`
] = valorSalvar; } } ); });
return salvamentoMovimentoPendente; }
function ativarMovimentacaoComVelocidade( token, estagioVelocidade, movimentosMega = {} ) {
  const bonusVelocidade = bonusMovimentoPorVelocidade(estagioVelocidade);
  const atualizarMeta = (campo, meta, chave) => {
    if (!meta) return;
    const base = normalizarMovimentoBase(campo.dataset.base);
    if (base === null) { meta.textContent = ""; return; }
    const bonusMega = (Number(movimentosMega?.[chave]) || 0) * MEGA_PASSO_MOVIMENTO;
    const partes = [`Base ${formatarDecimal(base)}`];
    if (bonusMega) partes.push(`Mega +${formatarDecimal(bonusMega)}`);
    if (bonusVelocidade) partes.push(`VEL ${bonusVelocidade > 0 ? "+" : ""}${formatarDecimal(bonusVelocidade)}`);
    meta.textContent = partes.join(" · ");
  };
  const mostrarBase = (campo, meta, chave) => {
    const base = normalizarMovimentoBase(campo.dataset.base);
    campo.value = base === null ? "" : formatarDecimal(base);
    atualizarMeta(campo, meta, chave);
  };
  const mostrarTotal = (campo, meta, chave) => {
    const base = normalizarMovimentoBase(campo.dataset.base);
    if (base === null) { campo.value = ""; atualizarMeta(campo, meta, chave); return; }
    const bonusMega = (Number(movimentosMega?.[chave]) || 0) * MEGA_PASSO_MOVIMENTO;
    campo.value = formatarDecimal(movimentoComVelocidade(base + bonusMega, estagioVelocidade));
    atualizarMeta(campo, meta, chave);
  };
  CAMPOS_MOVIMENTACAO.forEach(({ id, metaId, chave }) => {
    const campo = document.querySelector(`#${id}`);
    const meta = document.querySelector(`#${metaId}`);
    if (!campo) return;
    const baseInicial = normalizarMovimentoBase(campo.dataset.base);
    campo.dataset.base = baseInicial === null ? "" : String(baseInicial);
    mostrarTotal(campo, meta, chave);
    campo.addEventListener("focus", () => { mostrarBase(campo, meta, chave); campo.select?.(); });
    let temporizadorMovimento = null;
    const salvarBaseAtual = () => {
      const base = normalizarMovimentoBase(campo.dataset.base);
      return salvarMovimentoBaseNoToken(token, chave, base);
    };
    const programarSalvamentoMovimento = () => {
      if (temporizadorMovimento) clearTimeout(temporizadorMovimento);
      temporizadorMovimento = setTimeout(() => { temporizadorMovimento = null; salvarBaseAtual(); }, 350);
    };
    campo.addEventListener("input", () => {
      const texto = campo.value.trim();
      if (texto === "") { campo.dataset.base = ""; atualizarMeta(campo, meta, chave); programarSalvamentoMovimento(); return; }
      const base = normalizarMovimentoBase(texto);
      if (base === null) return;
      campo.dataset.base = String(base);
      atualizarMeta(campo, meta, chave);
      programarSalvamentoMovimento();
    });
    campo.addEventListener("blur", () => {
      if (temporizadorMovimento) { clearTimeout(temporizadorMovimento); temporizadorMovimento = null; }
      salvarBaseAtual();
      mostrarTotal(campo, meta, chave);
    });
    campo.addEventListener("keydown", (evento) => { if (evento.key === "Enter") { evento.preventDefault(); campo.blur(); } });
  });
}
function pegarMovimentoBase(campoId) { const campo = document.querySelector(
`#${campoId}`
);
if (!campo) { return ""; }
const numero = normalizarMovimentoBase( campo.dataset.base );
return numero === null ? "" : numero; }
async function definirTipoFicha( token, tipo ) { await OBR.scene.items.updateItems( [token.id], (items) => { for (const item of items) { item.metadata[
`${PREFIX}/tipoFicha`
] = tipo; } } ); }
function mostrarEscolhaFicha( token ) { const app = document.querySelector( "#app" );
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
document .querySelector( "#abrirPokemon" ) .addEventListener( "click", async () => { await definirTipoFicha( token, "pokemon" ); const tokenAtualizado = await pegarTokenAtualizado( token.id ); mostrarFichaPokemon( tokenAtualizado || token ); } );
document .querySelector( "#abrirTreinador" ) .addEventListener( "click", async () => { await definirTipoFicha( token, "treinador" ); mostrarFichaTreinadorPagina1( token ); } ); }
async function trocarTipoFicha( token ) { await OBR.scene.items.updateItems( [token.id], (items) => { for (const item of items) { delete item.metadata[
`${PREFIX}/tipoFicha`
]; } } );
mostrarEscolhaFicha( token ); }
function menuTreinador( paginaAtual ) {
return `
    <div class="fichaAbas" style="
      display:grid;
      grid-template-columns:repeat(5,minmax(0,1fr));
      gap:5px;
      margin-bottom:15px;
      width:100%;
    ">
      <button id="paginaTreinador1" style="min-width:0;width:100%;padding:8px 2px;font-size:9px;font-weight:bold;cursor:pointer;opacity:${paginaAtual === 1 ? "1" : "0.65"};">STATUS</button>
      <button id="paginaTreinador2" style="min-width:0;width:100%;padding:8px 2px;font-size:9px;font-weight:bold;cursor:pointer;opacity:${paginaAtual === 2 ? "1" : "0.65"};">PER / TAL</button>
      <button id="paginaTreinador3" style="min-width:0;width:100%;padding:8px 2px;font-size:8px;font-weight:bold;cursor:pointer;opacity:${paginaAtual === 3 ? "1" : "0.65"};">HABILIDADES</button>
      <button id="paginaTreinador4" style="min-width:0;width:100%;padding:8px 2px;font-size:8px;font-weight:bold;cursor:pointer;opacity:${paginaAtual === 4 ? "1" : "0.65"};">ANOTAÇÕES</button>
      <button id="paginaTreinador5" style="min-width:0;width:100%;padding:8px 2px;font-size:8px;font-weight:bold;cursor:pointer;opacity:${paginaAtual === 5 ? "1" : "0.65"};">POKÉMONS</button>
    </div>
  `;
}
function cabecalhoTreinador( token, paginaAtual ) { const imagemToken = token.type === "IMAGE" ? token.image?.url || "" : "";
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
"> <img
src="${esc(imagemToken)}"
alt="${esc(token.name || "Treinador")}"
style="
width:100%;
height:100%;
object-fit:contain;
display:block;
" > </div>
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
"> 👤 </div>
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
function ativarCabecalhoTreinador( token ) { document .querySelector( "#trocarTipo" ) .addEventListener( "click", () => trocarTipoFicha( token ) );
ativarMenuTreinador( token ); }
function ativarMenuTreinador( token ) { document .querySelector( "#paginaTreinador1" ) .addEventListener( "click", async () => { const tokenAtualizado = await pegarTokenAtualizado( token.id ); if (!tokenAtualizado) { return; } mostrarFichaTreinadorPagina1( tokenAtualizado ); } );
document .querySelector( "#paginaTreinador2" ) .addEventListener( "click", async () => { const tokenAtualizado = await pegarTokenAtualizado( token.id ); if (!tokenAtualizado) { return; } mostrarFichaTreinadorPerTal( tokenAtualizado ); } );
document .querySelector( "#paginaTreinador3" ) .addEventListener( "click", async () => { const tokenAtualizado = await pegarTokenAtualizado( token.id ); if (!tokenAtualizado) { return; } mostrarFichaTreinadorHabilidades( tokenAtualizado ); } );
document .querySelector( "#paginaTreinador4" ) .addEventListener( "click", async () => { const tokenAtualizado = await pegarTokenAtualizado( token.id ); if (!tokenAtualizado) { return; } mostrarFichaTreinadorAnotacoes( tokenAtualizado ); } );
document .querySelector( "#paginaTreinador5" ) .addEventListener( "click", async () => { const tokenAtualizado = await pegarTokenAtualizado( token.id ); if (!tokenAtualizado) { return; } await mostrarFichaTreinadorPokemons( tokenAtualizado ); } ); }
function criarPericiasTreinador(valores) {
  const pericias = PERICIAS.flatMap((grupo) =>
    grupo.pericias.map((pericia) => ({ ...pericia, atributo: grupo.atributo }))
  );
  return `
      <div
        class="pokemonPericiasCompactas"
        style="
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:6px;
          width:100%;
        "
      >
        ${pericias.map(
          (pericia) => `
<div
title="${esc(pericia.nome)}"
style="
min-width:0;
display:grid;
grid-template-columns:minmax(0,1fr) 42px 30px;
align-items:center;
gap:4px;
padding:5px 6px;
border:1px solid #dbe5f0;
border-radius:8px;
background:#fbfdff;
"> <div style="
min-width:0;
overflow:hidden;
"> <div style="
min-width:0;
overflow:hidden;
white-space:nowrap;
text-overflow:ellipsis;
font-size:10px;
line-height:1.05;
font-weight:900;
color:#33475f;
"> ${pericia.nome} </div> <div style="
margin-top:2px;
font-size:7px;
line-height:1;
font-weight:900;
color:#8798ad;
"> ${pericia.atributo} </div> </div> <input
id="pericia-${pericia.id}"
type="text"
value="${esc(valores[pericia.id])}"
placeholder="+0"
style="
width:42px;
height:29px;
min-height:29px !important;
box-sizing:border-box;
padding:2px 3px !important;
text-align:center;
font-size:10px;
font-weight:900;
"> <button
type="button"
class="rolarPericiaTreinador"
data-pericia="${pericia.id}"
data-nome="${esc(pericia.nome)}"
title="Rolar ${esc(pericia.nome)}"
style="
width:30px;
min-width:30px;
height:29px;
min-height:29px !important;
padding:1px !important;
box-sizing:border-box;
font-size:12px;
cursor:pointer;
"> 🎲 </button> </div>
`
        ).join("")}
      </div>
    `;
}
function ativarRolagensPericiasTreinador() { document .querySelectorAll( ".rolarPericiaTreinador" ) .forEach( (botao) => { botao.addEventListener( "click", async () => { const pericia = botao.dataset.pericia; const nome = botao.dataset.nome || pericia; const campo = document.querySelector(
`#pericia-${pericia}`
); const formula = formulaSalvaguarda( campo?.value ); if (!formula) { alert( "Valor da perícia inválido." ); return; } await rolarNoDicePlus( formula,
`Perícia ${nome}`
); } ); } ); }
function mostrarFichaTreinadorPagina1( token ) { const app = document.querySelector( "#app" );
const hpAtual = token.metadata[
`${PREFIX}/hpAtual`
] ?? 100;
const hpMax = token.metadata[
`${PREFIX}/hpMax`
] ?? 100;
const caBase = Number( token.metadata[
`${PREFIX}/ca`
] ?? 10 ) || 0;
const estagioEvasao = normalizarEstagioBuff( token.metadata[
`${PREFIX}/buff-evas`
] ?? 0, "evas" );
const ca = caBase + estagioEvasao;
const proficiencia = token.metadata[
`${PREFIX}/treinador-proficiencia`
] ?? 0;
const bonusCaptura = token.metadata[
`${PREFIX}/treinador-captura-bonus`
] ?? "";
const modificadores = {};
const salvaguardas = {};
ATRIBUTOS.forEach( (atributo) => { modificadores[ atributo ] = token.metadata[
`${PREFIX}/treinador-mod-${atributo}`
] ?? ""; salvaguardas[ atributo ] = token.metadata[
`${PREFIX}/treinador-save-${atributo}`
] ?? ""; } );
const iniciativaAlerta = token.metadata[
`${PREFIX}/treinador-iniciativa-alerta`
] === true;
const iniciativaHabilidade = token.metadata[
`${PREFIX}/treinador-iniciativa-habilidade`
] === true;
const iniciativaDobrar = token.metadata[
`${PREFIX}/treinador-iniciativa-dobrar`
] === true;
const estagioVelocidade = normalizarEstagioBuff( token.metadata[
`${PREFIX}/buff-vel`
] ?? 0, "vel" );
const iniciativa = (Number(String(modificadores.des ?? "").replace(",", ".")) || 0) + (estagioVelocidade * (Number(proficiencia) || 0)) + (iniciativaAlerta ? 5 : 0);
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
    <input
      id="bonusEvasaoCa"
      type="hidden"
      value="${estagioEvasao}"
    >
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
          title="Bônus do dado = DES + (VEL × Prof) + Alerta. Habilidade e Dobrar alteram apenas o total no apresentador."
        >
        <button
          id="rolarIniciativa"
          type="button"
          title="Rolar iniciativa e entrar no organizador"
        >🎲</button>
        <button
          id="abrirApresentadorIniciativa"
          type="button"
          title="Abrir organizador de iniciativa"
          style="
            min-width:38px;
            min-height:36px;
            padding:5px 7px;
            font-size:12px;
            cursor:pointer;
          "
        >📋</button>
        <button
          id="removerDaIniciativa"
          type="button"
          title="Remover este token da iniciativa"
          style="
            min-width:38px;
            min-height:36px;
            padding:5px 7px;
            font-size:12px;
            cursor:pointer;
          "
        >✕</button>
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
          title="Habilidade: +2x Prof no TOTAL mostrado no apresentador"
        >
          <span class="iniciativaCheckBolinha">✓</span>
          <span>Habilidade</span>
        </button>
        <button
          id="botaoIniciativaDobrar"
          class="iniciativaCheck ${iniciativaDobrar ? "ativo" : ""}"
          type="button"
          title="Dobrar o total final da iniciativa no apresentador"
        >
          <span class="iniciativaCheckBolinha">✓</span>
          <span>Dobrar</span>
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
      <input
        id="iniciativaDobrar"
        type="hidden"
        value="${iniciativaDobrar ? "1" : "0"}"
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
ativarCabecalhoTreinador( token );
ativarRolagensSalvaguarda(token);
ativarRolagemIniciativa(token);
ativarCalculadoraHp();
document .querySelector( "#rolarCaptura" ) .addEventListener( "click", async () => { const valor = document .querySelector( "#treinadorCapturaBonus" ) .value; const formula = formulaSalvaguarda( valor ); if (!formula) { alert( "Bônus de captura inválido." ); return; } await rolarNoDicePlus( formula, "Captura" ); } );
document .querySelector( "#salvarTreinadorStatus" ) .addEventListener( "click", async () => { const botaoSalvarStatus = document.querySelector("#salvarTreinadorStatus"); const aplicarCalculadora = botaoSalvarStatus?.dataset.aplicarCalculadora === "1"; if (botaoSalvarStatus) { botaoSalvarStatus.dataset.aplicarCalculadora = "0"; } const dados = await pegarHpCaDaTela(aplicarCalculadora); if (!dados) { return; } const novaProficiencia = Number( document .querySelector( "#treinadorProficiencia" ) .value ) || 0; const novaIniciativa = document .querySelector("#iniciativa") .value .trim(); const iniciativaAlertaAtiva = document .querySelector("#iniciativaAlerta") ?.value === "1"; const iniciativaHabilidadeAtiva = document .querySelector("#iniciativaHabilidade") ?.value === "1"; const iniciativaDobrarAtiva = document .querySelector("#iniciativaDobrar") ?.value === "1"; const novoBonusCaptura = document .querySelector( "#treinadorCapturaBonus" ) .value .trim(); const novosModificadores = {}; const novasSalvaguardas = {}; ATRIBUTOS.forEach( (atributo) => { novosModificadores[ atributo ] = document .querySelector(
`#treinador-mod-${atributo}`
) .value .trim(); novasSalvaguardas[ atributo ] = document .querySelector(
`#treinador-save-${atributo}`
) .value .trim(); } ); await OBR.scene.items.updateItems( [token.id], (items) => { for ( const item of items ) { item.metadata[
`${PREFIX}/hpAtual`
] = dados.hpAtual; item.metadata[
`${PREFIX}/hpMax`
] = dados.hpMax; item.metadata[
`${PREFIX}/ca`
] = dados.caBase; item.metadata[
`${PREFIX}/treinador-proficiencia`
] = novaProficiencia; item.metadata[
`${PREFIX}/treinador-iniciativa`
] = novaIniciativa; item.metadata[
`${PREFIX}/treinador-iniciativa-alerta`
] = iniciativaAlertaAtiva; item.metadata[
`${PREFIX}/treinador-iniciativa-habilidade`
] = iniciativaHabilidadeAtiva; item.metadata[
`${PREFIX}/treinador-iniciativa-dobrar`
] = iniciativaDobrarAtiva; item.metadata[
`${PREFIX}/treinador-captura-bonus`
] = novoBonusCaptura; ATRIBUTOS.forEach( (atributo) => { item.metadata[
`${PREFIX}/treinador-mod-${atributo}`
] = novosModificadores[ atributo ]; item.metadata[
`${PREFIX}/treinador-save-${atributo}`
] = novasSalvaguardas[ atributo ]; } ); } } ); document .querySelector( "#hpAtual" ) .value = dados.hpAtual; document .querySelector( "#hpMax" ) .value = dados.hpMax; if (dados.calculadoraAplicada) { document .querySelector( "#alterarHp" ) .value = ""; } await criarStatusNoToken( token, dados.hpAtual, dados.hpMax, dados.ca ); } ); }
function mostrarFichaTreinadorPerTal( token ) { const app = document.querySelector( "#app" );
const valoresPericias = {};
const talentos = {};
PERICIAS.forEach( (grupo) => { grupo.pericias.forEach( (pericia) => { valoresPericias[ pericia.id ] = token.metadata[
`${PREFIX}/pericia-${pericia.id}`
] ?? ""; } ); } );
for ( let i = 1; i <= 5; i++ ) { talentos[i] = token.metadata[
`${PREFIX}/talento-${i}`
] ?? ""; }
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
ativarCabecalhoTreinador( token );
ativarRolagensPericiasTreinador();
document .querySelector( "#salvarTreinadorPerTal" ) .addEventListener( "click", async () => { const novasPericias = {}; const novosTalentos = {}; PERICIAS.forEach( (grupo) => { grupo.pericias.forEach( (pericia) => { novasPericias[ pericia.id ] = document .querySelector(
`#pericia-${pericia.id}`
) .value .trim(); } ); } ); for ( let i = 1; i <= 5; i++ ) { novosTalentos[ i ] = document .querySelector(
`#talento${i}`
) .value .trim(); } await OBR.scene.items.updateItems( [token.id], (items) => { for ( const item of items ) { PERICIAS.forEach( (grupo) => { grupo.pericias.forEach( (pericia) => { item.metadata[
`${PREFIX}/pericia-${pericia.id}`
] = novasPericias[ pericia.id ]; } ); } ); for ( let i = 1; i <= 5; i++ ) { item.metadata[
`${PREFIX}/talento-${i}`
] = novosTalentos[ i ]; } } } ); } ); }
function mostrarFichaTreinadorHabilidades( token ) { const app = document.querySelector( "#app" );
const especializacoes = {};
const habilidades = {};
const rolagens = {};
for ( let i = 1; i <= 4; i++ ) { especializacoes[i] = token.metadata[
`${PREFIX}/especializacao-${i}`
] ?? ""; }
for ( let i = 1; i <= 8; i++ ) { habilidades[i] = token.metadata[
`${PREFIX}/habilidade-treinador-${i}`
] ?? ""; }
for ( let i = 1; i <= 3; i++ ) { rolagens[i] = token.metadata[
`${PREFIX}/rolagem-d6-${i}`
] ?? ""; }
let htmlRolagens = "";
for ( let i = 1; i <= 3; i++ ) {
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
ativarCabecalhoTreinador( token );
document .querySelectorAll( ".rolarD6" ) .forEach( (botao) => { botao.addEventListener( "click", async () => { const numero = botao.dataset.rolagem; const nome = document .querySelector(
`#rolagemD6-${numero}`
) .value .trim(); if (!nome) { alert( "Coloque o nome da rolagem primeiro." ); return; } await rolarNoDicePlus( "1d6", nome ); } ); } );
document .querySelector( "#salvarTreinadorHabilidades" ) .addEventListener( "click", async () => { const novasEspecializacoes = {}; const novasHabilidades = {}; const novasRolagens = {}; for ( let i = 1; i <= 4; i++ ) { novasEspecializacoes[ i ] = document .querySelector(
`#especializacao${i}`
) .value .trim(); } for ( let i = 1; i <= 8; i++ ) { novasHabilidades[ i ] = document .querySelector(
`#habilidadeTreinador${i}`
) .value .trim(); } for ( let i = 1; i <= 3; i++ ) { novasRolagens[ i ] = document .querySelector(
`#rolagemD6-${i}`
) .value .trim(); } await OBR.scene.items.updateItems( [token.id], (items) => { for ( const item of items ) { for ( let i = 1; i <= 4; i++ ) { item.metadata[
`${PREFIX}/especializacao-${i}`
] = novasEspecializacoes[ i ]; } for ( let i = 1; i <= 8; i++ ) { item.metadata[
`${PREFIX}/habilidade-treinador-${i}`
] = novasHabilidades[ i ]; } for ( let i = 1; i <= 3; i++ ) { item.metadata[
`${PREFIX}/rolagem-d6-${i}`
] = novasRolagens[ i ]; } } } ); } ); }
function mostrarFichaTreinadorAnotacoes( token ) { const app = document.querySelector( "#app" );
const anotacoes = token.metadata[
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
ativarCabecalhoTreinador( token );
document .querySelector( "#salvarTreinadorAnotacoes" ) .addEventListener( "click", async () => { const novasAnotacoes = document .querySelector( "#treinadorAnotacoes" ) .value; await OBR.scene.items.updateItems( [token.id], (items) => { for ( const item of items ) { item.metadata[
`${PREFIX}/treinador-anotacoes`
] = novasAnotacoes; } } ); } ); }
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
          min-width:110px;
          padding:8px 4px;
          font-size:10px;
          font-weight:bold;
          cursor:pointer;
          opacity:${paginaAtual === 3 ? "1" : "0.65"};
        "
      >
        PERÍCIAS / DEBUFF
      </button>
      <button
        id="paginaPokemon4"
        style="
          flex:1;
          min-width:70px;
          padding:8px 4px;
          font-size:10px;
          font-weight:bold;
          cursor:pointer;
          opacity:${paginaAtual === 4 ? "1" : "0.65"};
        "
      >
        MEGA
      </button>
    </div>
  `;
}
async function pegarTokenAtualizado(tokenId) { const items = await OBR.scene.items.getItems( [tokenId] );
if ( !items || items.length === 0 ) { return null; }
return items[0]; }
function ativarMenuPokemon(token) { document .querySelector("#paginaPokemon1") .addEventListener( "click", async () => { await salvamentoBuffPendente.catch(() => {}); await salvamentoMovimentoPendente.catch(() => {}); const tokenAtualizado = await pegarTokenAtualizado( token.id ); if (!tokenAtualizado) { return; } mostrarFichaPokemon( tokenAtualizado ); } );
document .querySelector("#paginaPokemon2") .addEventListener( "click", async () => { await salvamentoMovimentoPendente.catch(() => {}); const tokenAtualizado = await pegarTokenAtualizado( token.id ); if (!tokenAtualizado) { return; } mostrarFichaPokemonMoves( tokenAtualizado ); } );
document .querySelector("#paginaPokemon3") .addEventListener( "click", async () => { await salvamentoMovimentoPendente.catch(() => {}); const tokenAtualizado = await pegarTokenAtualizado( token.id ); if (!tokenAtualizado) { return; } mostrarFichaPokemonPericias( tokenAtualizado ); } );
document .querySelector("#paginaPokemon4") .addEventListener( "click", async () => { await salvamentoBuffPendente.catch(() => {}); await salvamentoMovimentoPendente.catch(() => {}); const tokenAtualizado = await pegarTokenAtualizado( token.id ); if (!tokenAtualizado) { return; } mostrarFichaPokemonMega( tokenAtualizado ); } ); }
function cabecalhoPokemon( token, paginaAtual ) { const imagemToken = token.type === "IMAGE" ? token.image?.url || "" : "";
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
"> <img
src="${esc(imagemToken)}"
alt="${esc(token.name || "Pokémon")}"
style="
width:100%;
height:100%;
object-fit:contain;
display:block;
" > </div>
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
"> 🐾 </div>
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
function ativarCabecalhoPokemon(token) { document .querySelector("#trocarTipo") .addEventListener( "click", () => trocarTipoFicha( token ) );
ativarMenuPokemon(token); }
function criarPericiasPokemon(valores) { const pericias = PERICIAS.flatMap( (grupo) => grupo.pericias.map( (pericia) => ({ ...pericia, atributo: grupo.atributo }) ) );
return `
      <div
        class="pokemonPericiasCompactas"
        style="
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:6px;
          width:100%;
        "
      >
        ${pericias.map(
            (pericia) => `
<div
title="${esc(pericia.nome)}"
style="
min-width:0;
display:grid;
grid-template-columns:minmax(0,1fr) 42px 30px;
align-items:center;
gap:4px;
padding:5px 6px;
border:1px solid #dbe5f0;
border-radius:8px;
background:#fbfdff;
" > <div style="
min-width:0;
overflow:hidden;
"> <div style="
min-width:0;
overflow:hidden;
white-space:nowrap;
text-overflow:ellipsis;
font-size:10px;
line-height:1.05;
font-weight:900;
color:#33475f;
"> ${pericia.nome} </div> <div style="
margin-top:2px;
font-size:7px;
line-height:1;
font-weight:900;
color:#8798ad;
"> ${pericia.atributo} </div> </div> <input
id="pokemon-pericia-${pericia.id}"
type="text"
value="${esc(valores[pericia.id])}"
placeholder="+0"
style="
width:42px;
height:29px;
min-height:29px !important;
box-sizing:border-box;
padding:2px 3px !important;
text-align:center;
font-size:10px;
font-weight:900;
" > <button
type="button"
class="rolarPericiaPokemon"
data-pericia="${pericia.id}"
data-nome="${esc(pericia.nome)}"
title="Rolar ${esc(pericia.nome)}"
style="
width:30px;
min-width:30px;
height:29px;
min-height:29px !important;
padding:1px !important;
box-sizing:border-box;
font-size:12px;
cursor:pointer;
" > 🎲 </button> </div>
`
        ).join("")}
      </div>
    `;
}
function ativarRolagensPericiasPokemon() { document .querySelectorAll( ".rolarPericiaPokemon" ) .forEach( (botao) => { botao.addEventListener( "click", async () => { const pericia = botao.dataset.pericia; const nome = botao.dataset.nome || pericia; const campo = document.querySelector(
`#pokemon-pericia-${pericia}`
); const formula = formulaSalvaguarda( campo?.value ); if (!formula) { alert( "Valor da perícia inválido." ); return; } await rolarNoDicePlus( formula,
`Perícia ${nome}`
); } ); } ); }
function mostrarFichaPokemon(token) { const app = document.querySelector("#app");
const megaAtivaStatus = megaAtivaNoToken(token);
const megaDistribuicaoStatus = distribuicaoMegaDoToken(token);
const hpAtual = token.metadata[
`${PREFIX}/hpAtual`
] ?? 100;
const hpMax = token.metadata[
`${PREFIX}/hpMax`
] ?? 100;
const nivelPokemonSalvo = token.metadata[
`${PREFIX}/pokemon-level`
];
const nivelPokemon = nivelPokemonSalvo === undefined || nivelPokemonSalvo === null ? "" : String(nivelPokemonSalvo);
const caBase = Number( token.metadata[
`${PREFIX}/ca`
] ?? 10 ) || 0;
const estagioEvasao = normalizarEstagioBuff( token.metadata[
`${PREFIX}/buff-evas`
] ?? 0, "evas" );
const ca = caBase + estagioEvasao + (megaAtivaStatus ? megaDistribuicaoStatus.ca : 0);
const habilidadeNormal = token.metadata[
`${PREFIX}/pokemon-habilidade`
] ?? "";
const habilidade = megaAtivaStatus && String(megaDistribuicaoStatus.habilidade || "").trim()
  ? megaDistribuicaoStatus.habilidade
  : habilidadeNormal;
const itemPokemon = token.metadata[
`${PREFIX}/pokemon-item`
] ?? "";
const movimentoCaminhada = token.metadata[
`${PREFIX}/movimento-caminhada`
] ?? "";
const movimentoEscalada = token.metadata[
`${PREFIX}/movimento-escalada`
] ?? "";
const movimentoVoo = token.metadata[
`${PREFIX}/movimento-voo`
] ?? "";
const movimentoNatacao = token.metadata[
`${PREFIX}/movimento-natacao`
] ?? "";
const movimentoEscavacao = token.metadata[
`${PREFIX}/movimento-escavacao`
] ?? "";
const movimentoFlutuacao = token.metadata[
`${PREFIX}/movimento-flutuacao`
] ?? "";
const proficiencia = Number( token.metadata[
`${PREFIX}/proficiencia`
] ?? 0 );
const statusAtributos = {};
const modificadores = {};
const salvaguardas = {};
ATRIBUTOS.forEach((atributo) => {
  const statusTotal = statusTotalDoToken(token, atributo);
  statusAtributos[atributo] = statusTotal;
  modificadores[atributo] = formatarBonus(modificadorPorStatus(statusTotal));
  salvaguardas[atributo] = token.metadata[`${PREFIX}/save-${atributo}`] ?? "";
});
const iniciativaAlerta = token.metadata[
`${PREFIX}/iniciativa-alerta`
] === true;
const iniciativaHabilidade = token.metadata[
`${PREFIX}/iniciativa-habilidade`
] === true;
const iniciativaDobrar = token.metadata[
`${PREFIX}/iniciativa-dobrar`
] === true;
const estagioVelocidade = normalizarEstagioBuff( token.metadata[
`${PREFIX}/buff-vel`
] ?? 0, "vel" );
const iniciativa = (Number(String(modificadores.des ?? "").replace(",", ".")) || 0) + (estagioVelocidade * proficiencia) + (iniciativaAlerta ? 5 : 0);
app.innerHTML = `
    ${ESTILO_FICHA}
    ${cabecalhoPokemon(token, 1)}
    <div class="statusGrid statusGridPokemon" style="
      display:flex;
      gap:12px;
      align-items:flex-start;
      flex-wrap:wrap;
    ">
      <div class="statusCard pokemonStatusPrincipal" style="
        flex:1;
        min-width:120px;
      ">
        <div class="pokemonStatusTopo">
          <div class="pokemonStatusCampo">
            <p>HP Atual</p>
            <input
              id="hpAtual"
              type="number"
              value="${hpAtual}"
            >
          </div>
          <div class="pokemonStatusCampo">
            <p>HP Máx.</p>
            <input
              id="hpMax"
              type="number"
              value="${hpMax}"
            >
          </div>
          <div class="pokemonStatusCampo">
            <p>CA</p>
            <input
              id="ca"
              type="number"
              value="${ca}"
            >
          </div>
          <div class="pokemonStatusCampo">
            <p>Prof</p>
            <input
              id="proficiencia"
              type="number"
              min="0"
              step="1"
              value="${proficiencia}"
            >
          </div>
          <div class="pokemonStatusCampo">
            <p>Lv.</p>
            <input
              id="nivelPokemon"
              type="number"
              min="1"
              step="1"
              value="${esc(nivelPokemon)}"
              placeholder="-"
              title="Level do Pokémon"
            >
          </div>
        </div>
        <input
          id="bonusEvasaoCa"
          type="hidden"
          value="${estagioEvasao}"
        >
            <div class="calculadoraHpLinha pokemonCalculadoraCard">
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
                  title="Bônus do dado = DES + (VEL × Prof) + Alerta. Habilidade e Dobrar alteram apenas o total no apresentador."
                >
                <button
                  id="rolarIniciativa"
                  type="button"
                  title="Rolar iniciativa e entrar no organizador"
                >🎲</button>
                <button
                  id="abrirApresentadorIniciativa"
                  type="button"
                  title="Abrir organizador de iniciativa"
                  style="
                    min-width:38px;
                    min-height:36px;
                    padding:5px 7px;
                    font-size:12px;
                    cursor:pointer;
                  "
                >📋</button>
                <button
                  id="removerDaIniciativa"
                  type="button"
                  title="Remover este token da iniciativa"
                  style="
                    min-width:38px;
                    min-height:36px;
                    padding:5px 7px;
                    font-size:12px;
                    cursor:pointer;
                  "
                >✕</button>
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
                  title="Habilidade: +2x Prof no TOTAL mostrado no apresentador"
                >
                  <span class="iniciativaCheckBolinha">✓</span>
                  <span>Habilidade</span>
                </button>
                <button
                  id="botaoIniciativaDobrar"
                  class="iniciativaCheck ${iniciativaDobrar ? "ativo" : ""}"
                  type="button"
                  title="Dobrar o total final da iniciativa no apresentador"
                >
                  <span class="iniciativaCheckBolinha">✓</span>
                  <span>Dobrar</span>
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
              <input
                id="iniciativaDobrar"
                type="hidden"
                value="${iniciativaDobrar ? "1" : "0"}"
              >
            </div>
            <div class="pokemonDetalhesCompactos">
              <p>Habilidades / Talentos</p>
              <textarea
                id="habilidadePokemon"
                rows="3"
                ${megaAtivaStatus ? 'readonly title="Habilidade da Mega ativa. Edite-a na seção Mega Evolução em Moves / Buffs."' : ''}
                placeholder="Escreva as habilidades e talentos do Pokémon..."
                style="
                  width:100%;
                  box-sizing:border-box;
                  padding:8px;
                "
              >${esc(habilidade)}</textarea>
              <p>Item</p>
              <input
                id="itemPokemon"
                type="text"
                value="${esc(itemPokemon)}"
                placeholder="Item carregado pelo Pokémon"
              >
            </div>
      </div>
    </div>
    <hr class="hrMovimento">
    <h3 class="tituloMovimento">Movimentação</h3>
    <div class="movimentoGrid">
      <div class="movimentoTipo">
        <div class="movimentoTexto">
          <span class="movimentoNome">Caminhada</span>
          <span
            id="metaMovimentoCaminhada"
            class="movimentoMeta"
          ></span>
        </div>
        <input
          id="movimentoCaminhada"
          class="movimentoValor"
          type="text"
          inputmode="decimal"
          data-base="${esc(formatarDecimal(movimentoCaminhada))}"
          value="${esc(formatarDecimal(movimentoComVelocidade(movimentoCaminhada, estagioVelocidade)))}"
          placeholder="0"
          title="Valor total com o buff de VEL. Clique para editar o valor base."
        >
      </div>
      <div class="movimentoTipo">
        <div class="movimentoTexto">
          <span class="movimentoNome">Escalada</span>
          <span
            id="metaMovimentoEscalada"
            class="movimentoMeta"
          ></span>
        </div>
        <input
          id="movimentoEscalada"
          class="movimentoValor"
          type="text"
          inputmode="decimal"
          data-base="${esc(formatarDecimal(movimentoEscalada))}"
          value="${esc(formatarDecimal(movimentoComVelocidade(movimentoEscalada, estagioVelocidade)))}"
          placeholder="0"
          title="Valor total com o buff de VEL. Clique para editar o valor base."
        >
      </div>
      <div class="movimentoTipo">
        <div class="movimentoTexto">
          <span class="movimentoNome">Voo</span>
          <span
            id="metaMovimentoVoo"
            class="movimentoMeta"
          ></span>
        </div>
        <input
          id="movimentoVoo"
          class="movimentoValor"
          type="text"
          inputmode="decimal"
          data-base="${esc(formatarDecimal(movimentoVoo))}"
          value="${esc(formatarDecimal(movimentoComVelocidade(movimentoVoo, estagioVelocidade)))}"
          placeholder="0"
          title="Valor total com o buff de VEL. Clique para editar o valor base."
        >
      </div>
      <div class="movimentoTipo">
        <div class="movimentoTexto">
          <span class="movimentoNome">Natação</span>
          <span
            id="metaMovimentoNatacao"
            class="movimentoMeta"
          ></span>
        </div>
        <input
          id="movimentoNatacao"
          class="movimentoValor"
          type="text"
          inputmode="decimal"
          data-base="${esc(formatarDecimal(movimentoNatacao))}"
          value="${esc(formatarDecimal(movimentoComVelocidade(movimentoNatacao, estagioVelocidade)))}"
          placeholder="0"
          title="Valor total com o buff de VEL. Clique para editar o valor base."
        >
      </div>
      <div class="movimentoTipo">
        <div class="movimentoTexto">
          <span class="movimentoNome">Escavação</span>
          <span
            id="metaMovimentoEscavacao"
            class="movimentoMeta"
          ></span>
        </div>
        <input
          id="movimentoEscavacao"
          class="movimentoValor"
          type="text"
          inputmode="decimal"
          data-base="${esc(formatarDecimal(movimentoEscavacao))}"
          value="${esc(formatarDecimal(movimentoComVelocidade(movimentoEscavacao, estagioVelocidade)))}"
          placeholder="0"
          title="Valor total com o buff de VEL. Clique para editar o valor base."
        >
      </div>
      <div class="movimentoTipo">
        <div class="movimentoTexto">
          <span class="movimentoNome">Flutuação</span>
          <span
            id="metaMovimentoFlutuacao"
            class="movimentoMeta"
          ></span>
        </div>
        <input
          id="movimentoFlutuacao"
          class="movimentoValor"
          type="text"
          inputmode="decimal"
          data-base="${esc(formatarDecimal(movimentoFlutuacao))}"
          value="${esc(formatarDecimal(movimentoComVelocidade(movimentoFlutuacao, estagioVelocidade)))}"
          placeholder="0"
          title="Valor total com o buff de VEL. Clique para editar o valor base."
        >
      </div>
    </div>
    <hr>
    ${criarLinhaAtributos(
        "Status",
        "status",
        statusAtributos
    )}
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
ativarCalculoStatusPokemon();
ativarRolagensSalvaguarda(token);
ativarRolagemIniciativa(token);
ativarCalculadoraHp();
ativarMovimentacaoComVelocidade(token, estagioVelocidade, megaAtivaStatus ? megaDistribuicaoStatus.movimentos : {});
document .querySelector( "#salvarPokemonStatus" ) .addEventListener( "click", async () => { const botaoSalvarStatus = document.querySelector("#salvarPokemonStatus"); const aplicarCalculadora = botaoSalvarStatus?.dataset.aplicarCalculadora === "1"; if (botaoSalvarStatus) { botaoSalvarStatus.dataset.aplicarCalculadora = "0"; } const dados = await pegarHpCaDaTela(aplicarCalculadora); if (!dados) { return; } const movimentoCaminhadaNovo = pegarMovimentoBase( "movimentoCaminhada" ); const movimentoEscaladaNovo = pegarMovimentoBase( "movimentoEscalada" ); const movimentoVooNovo = pegarMovimentoBase( "movimentoVoo" ); const movimentoNatacaoNovo = pegarMovimentoBase( "movimentoNatacao" ); const movimentoEscavacaoNovo = pegarMovimentoBase( "movimentoEscavacao" ); const movimentoFlutuacaoNovo = pegarMovimentoBase( "movimentoFlutuacao" ); const novaHabilidadeTela = document.querySelector("#habilidadePokemon").value.trim();
const novaHabilidade = megaAtivaStatus ? habilidadeNormal : novaHabilidadeTela; const novoItemPokemon = document .querySelector("#itemPokemon") .value .trim(); const novaProficiencia = Number( document .querySelector("#proficiencia") .value ) || 0; const nivelPokemonBruto = document .querySelector("#nivelPokemon") ?.value .trim() ?? ""; const novoNivelPokemon = nivelPokemonBruto === "" ? "" : Math.max( 1, Math.trunc( Number(nivelPokemonBruto) || 1 ) ); const novaIniciativa = document .querySelector("#iniciativa") .value .trim(); const iniciativaAlertaAtiva = document .querySelector("#iniciativaAlerta") ?.value === "1"; const iniciativaHabilidadeAtiva = document .querySelector("#iniciativaHabilidade") ?.value === "1"; const iniciativaDobrarAtiva = document .querySelector("#iniciativaDobrar") ?.value === "1"; const novosStatus = {}; const novosModificadores = {}; const novasSalvaguardas = {}; ATRIBUTOS.forEach((atributo) => {
  const statusTela = Number(String(document.querySelector(`#status-${atributo}`)?.value ?? "").trim().replace(",", "."));
  const bonusStatusMega = megaAtivaStatus ? (Number(megaDistribuicaoStatus.atributos?.[atributo]) || 0) : 0;
  const statusBase = Number.isFinite(statusTela)
    ? Math.trunc(statusTela - bonusStatusMega)
    : statusBaseDoToken(token, atributo);
  novosStatus[atributo] = statusBase;
  novosModificadores[atributo] = formatarBonus(modificadorPorStatus(statusBase));
  novasSalvaguardas[atributo] = document.querySelector(`#save-${atributo}`).value.trim();
});
const caBaseParaSalvar = dados.caBase - (megaAtivaStatus ? megaDistribuicaoStatus.ca : 0);
await OBR.scene.items.updateItems( [token.id], (items) => { for (const item of items) { item.metadata[
`${PREFIX}/hpAtual`
] = dados.hpAtual; item.metadata[
`${PREFIX}/hpMax`
] = dados.hpMax; item.metadata[
`${PREFIX}/ca`
] = caBaseParaSalvar; item.metadata[
`${PREFIX}/pokemon-habilidade`
] = novaHabilidade; item.metadata[
`${PREFIX}/pokemon-item`
] = novoItemPokemon; item.metadata[
`${PREFIX}/movimento-caminhada`
] = movimentoCaminhadaNovo; item.metadata[
`${PREFIX}/movimento-escalada`
] = movimentoEscaladaNovo; item.metadata[
`${PREFIX}/movimento-voo`
] = movimentoVooNovo; item.metadata[
`${PREFIX}/movimento-natacao`
] = movimentoNatacaoNovo; item.metadata[
`${PREFIX}/movimento-escavacao`
] = movimentoEscavacaoNovo; item.metadata[
`${PREFIX}/movimento-flutuacao`
] = movimentoFlutuacaoNovo; item.metadata[
`${PREFIX}/proficiencia`
] = novaProficiencia; item.metadata[
`${PREFIX}/pokemon-level`
] = novoNivelPokemon; item.metadata[
`${PREFIX}/iniciativa`
] = novaIniciativa; item.metadata[
`${PREFIX}/iniciativa-alerta`
] = iniciativaAlertaAtiva; item.metadata[
`${PREFIX}/iniciativa-habilidade`
] = iniciativaHabilidadeAtiva; item.metadata[
`${PREFIX}/iniciativa-dobrar`
] = iniciativaDobrarAtiva; ATRIBUTOS.forEach( (atributo) => { item.metadata[
`${PREFIX}/status-${atributo}`
] = novosStatus[ atributo ]; item.metadata[
`${PREFIX}/mod-${atributo}`
] = novosModificadores[ atributo ]; item.metadata[
`${PREFIX}/save-${atributo}`
] = novasSalvaguardas[ atributo ]; } ); } } ); document .querySelector("#hpAtual") .value = dados.hpAtual; document .querySelector("#hpMax") .value = dados.hpMax; if (dados.calculadoraAplicada) { document .querySelector("#alterarHp") .value = ""; } await criarStatusNoToken( token, dados.hpAtual, dados.hpMax, dados.ca ); } ); }
function mostrarFichaPokemonMoves(token) { const app = document.querySelector("#app");
const proficiencia = Number( token.metadata[
`${PREFIX}/proficiencia`
] ?? 0 );
const buffs = {};
BUFFS.forEach( (buff) => { buffs[buff.id] = Number( token.metadata[
`${PREFIX}/buff-${buff.id}`
] ?? 0 ); } );
const precisaoInicial = normalizarEstagioBuff( buffs.pres ?? 0, "pres" );
const lerTalentoAtivo = (id) => { const valor = token.metadata[
`${PREFIX}/talento-${id}`
];
return ( valor === true || valor === 1 || valor === "1" || valor === "true" ); };
const talentosCombate = { mestreCorpo: lerTalentoAtivo("mestre-corpo"), mestreDistancia: lerTalentoAtivo("mestre-distancia"), atacanteBestial: lerTalentoAtivo("atacante-bestial"), disputador: lerTalentoAtivo("disputador"), investidaPoderosa: lerTalentoAtivo("investida-poderosa") };
const golpes = [];
for ( let i = 1; i <= 5; i++ ) { golpes.push({ tipo: token.metadata[
`${PREFIX}/golpe${i}Tipo`
] ?? "", nome: token.metadata[
`${PREFIX}/golpe${i}Nome`
] ?? "", categoria: token.metadata[
`${PREFIX}/golpe${i}Categoria`
] ?? "", acerto: token.metadata[
`${PREFIX}/golpe${i}Acerto`
] ?? "", dano: token.metadata[
`${PREFIX}/golpe${i}Dano`
] ?? "", dobrarDadosVezes: Math.max( 1, Math.min( 10, Number( token.metadata[
`${PREFIX}/golpe${i}DobrarDadosVezes`
] ?? 1 ) || 1 ) ), cd: token.metadata[
`${PREFIX}/golpe${i}CD`
] ?? "", danoCD: token.metadata[
`${PREFIX}/golpe${i}DanoCD`
] ?? "", cura: token.metadata[
`${PREFIX}/golpe${i}Cura`
] ?? "", metadeDados: (token.metadata[
`${PREFIX}/golpe${i}MetadeDados`
] === true || token.metadata[
`${PREFIX}/golpe${i}MetadeDados`
] === 1 || token.metadata[
`${PREFIX}/golpe${i}MetadeDados`
] === "1" || token.metadata[
`${PREFIX}/golpe${i}MetadeDados`
] === "true"), buffAcerto: token.metadata[
`${PREFIX}/golpe${i}BuffAcerto`
] ?? "", statusNome: token.metadata[
`${PREFIX}/golpe${i}StatusNome`
] ?? "" }); }
let htmlGolpes = "";
golpes.forEach( (golpe, index) => { const numero = index + 1;
const titulo = golpe.nome || `Move ${numero}`;
const tipoInicial = ["macerto", "mcd", "cura", "buffdebuff"] .includes(golpe.tipo) ? golpe.tipo : ""; const categoriaInicial = golpe.categoria === "especial" ? "especial" : golpe.categoria === "fisico" ? "fisico" : ""; const mostrarNome = tipoInicial !== ""; const ehAtaque = tipoInicial === "macerto" || tipoInicial === "mcd";
htmlGolpes += `
        <details style="
          margin-bottom:8px;
          border:1px solid #555;
          border-radius:6px;
          padding:7px;
        ">
          <summary
            id="golpe${numero}Resumo"
            style="
              cursor:pointer;
              font-weight:bold;
            "
          >
            ${esc(titulo)}
          </summary>
          <div style="margin-top:10px;">
            <input
              id="golpe${numero}Tipo"
              type="hidden"
              value="${tipoInicial}"
            >
            <input
              id="golpe${numero}Categoria"
              type="hidden"
              value="${categoriaInicial}"
            >
            <input
              id="golpe${numero}MetadeDados"
              type="hidden"
              value="${golpe.metadeDados ? "1" : "0"}"
            >
            <div style="
              display:grid;
              grid-template-columns:repeat(4, minmax(0, 1fr));
              gap:5px;
              margin-bottom:9px;
            ">
              <button
                type="button"
                class="tipoMove"
                data-golpe="${numero}"
                data-tipo="macerto"
                style="
                  min-height:34px !important;
                  padding:5px 3px !important;
                  font-size:9px;
                  line-height:1.05;
                  cursor:pointer;
                  opacity:${tipoInicial === "macerto" ? "1" : "0.62"};
                  border:${tipoInicial === "macerto" ? "2px solid #4C8DFF" : "1px solid #c9d5e3"};
                "
              >
                M.ACERTO
              </button>
              <button
                type="button"
                class="tipoMove"
                data-golpe="${numero}"
                data-tipo="mcd"
                style="
                  min-height:34px !important;
                  padding:5px 3px !important;
                  font-size:9px;
                  line-height:1.05;
                  cursor:pointer;
                  opacity:${tipoInicial === "mcd" ? "1" : "0.62"};
                  border:${tipoInicial === "mcd" ? "2px solid #4C8DFF" : "1px solid #c9d5e3"};
                "
              >
                M.CD
              </button>
              <button
                type="button"
                class="tipoMove"
                data-golpe="${numero}"
                data-tipo="cura"
                style="
                  min-height:34px !important;
                  padding:5px 3px !important;
                  font-size:9px;
                  line-height:1.05;
                  cursor:pointer;
                  opacity:${tipoInicial === "cura" ? "1" : "0.62"};
                  border:${tipoInicial === "cura" ? "2px solid #4C8DFF" : "1px solid #c9d5e3"};
                "
              >
                CURAS
              </button>
              <button
                type="button"
                class="tipoMove"
                data-golpe="${numero}"
                data-tipo="buffdebuff"
                style="
                  min-height:34px !important;
                  padding:5px 2px !important;
                  font-size:8px;
                  line-height:1.05;
                  cursor:pointer;
                  opacity:${tipoInicial === "buffdebuff" ? "1" : "0.62"};
                  border:${tipoInicial === "buffdebuff" ? "2px solid #4C8DFF" : "1px solid #c9d5e3"};
                "
              >
                BUFFS / DEBUFFS
              </button>
            </div>
            <div
              id="golpe${numero}BlocoNome"
              style="display:${mostrarNome ? "block" : "none"};"
            >
              <div style="
                display:flex;
                align-items:flex-end;
                gap:6px;
                margin-bottom:8px;
              ">
                <div style="flex:1; min-width:0;">
                  <label style="display:block; margin-bottom:3px;">Nome</label>
                  <input
                    id="golpe${numero}Nome"
                    type="text"
                    value="${esc(golpe.nome)}"
                    placeholder="Nome do move"
                    style="
                      width:100%;
                      min-height:32px !important;
                      height:32px;
                      padding:5px 7px !important;
                      box-sizing:border-box;
                    "
                  >
                </div>
                <div
                  id="golpe${numero}GrupoCategoria"
                  style="
                    display:${ehAtaque ? "flex" : "none"};
                    gap:5px;
                    flex:0 0 auto;
                  "
                >
                  <button
                    type="button"
                    class="categoriaGolpe"
                    data-golpe="${numero}"
                    data-categoria="fisico"
                    title="Move físico"
                    style="
                      width:72px;
                      min-height:32px !important;
                      height:32px;
                      padding:4px 4px !important;
                      box-sizing:border-box;
                      cursor:pointer;
                      font-size:9px;
                      line-height:1;
                      font-weight:bold;
                      white-space:nowrap;
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
                    title="Move especial"
                    style="
                      width:76px;
                      min-height:32px !important;
                      height:32px;
                      padding:4px 4px !important;
                      box-sizing:border-box;
                      cursor:pointer;
                      font-size:9px;
                      line-height:1;
                      font-weight:bold;
                      white-space:nowrap;
                      opacity:${categoriaInicial === "especial" ? "1" : "0.55"};
                      border:${categoriaInicial === "especial" ? "2px solid #FFFFFF" : "1px solid #666"};
                    "
                  >
                    ✨ ESPECIAL
                  </button>
                </div>
              </div>
            </div>
            <div
              id="golpe${numero}PainelMAcerto"
              style="display:${tipoInicial === "macerto" ? "block" : "none"};"
            >
              <div style="
                display:grid;
                grid-template-columns:minmax(0, 1fr) minmax(0, 1fr);
                gap:8px;
                margin-bottom:9px;
              ">
                <div style="min-width:0;">
                  <label style="display:block; margin-bottom:3px;">Acerto</label>
                  <input
                    id="golpe${numero}Acerto"
                    type="text"
                    value="${esc(golpe.acerto)}"
                    placeholder="Ex: 1d20+8"
                    style="
                      width:100%;
                      min-height:32px !important;
                      height:32px;
                      padding:5px 7px !important;
                      box-sizing:border-box;
                    "
                  >
                </div>
                <div style="min-width:0;">
                  <label style="display:block; margin-bottom:3px;">Dano</label>
                  <input
                    id="golpe${numero}Dano"
                    type="text"
                    value="${esc(golpe.dano)}"
                    placeholder="Ex: 3d8+5"
                    style="
                      width:100%;
                      min-height:32px !important;
                      height:32px;
                      padding:5px 7px !important;
                      box-sizing:border-box;
                    "
                  >
                </div>
              </div>
              <div style="
                display:flex;
                justify-content:flex-end;
                align-items:center;
                gap:6px;
                margin-bottom:8px;
                flex-wrap:wrap;
              ">
                <button
                  type="button"
                  class="metadeDadosMove ${golpe.metadeDados ? "ativo" : ""}"
                  data-golpe="${numero}"
                  title="Adiciona metade da quantidade de cada dado. Ímpares arredondam para baixo; 1 dado recebe +1."
                  style="
                    min-height:32px !important;
                    height:32px;
                    padding:5px 9px !important;
                    cursor:pointer;
                    font-size:9px;
                    font-weight:900;
                    white-space:nowrap;
                    border:${golpe.metadeDados ? "2px solid #6c4bd3" : "1px solid #9aa8ba"};
                    background:${golpe.metadeDados ? "linear-gradient(180deg,#8064df 0%,#6547c7 100%)" : "#f7f9fc"};
                    color:${golpe.metadeDados ? "#fff" : "#43546a"};
                    opacity:${golpe.metadeDados ? "1" : "0.78"};
                  "
                >
                  + METADE DOS DADOS
                </button>
                <button
                  type="button"
                  class="rolarDobrarDados"
                  data-golpe="${numero}"
                  style="
                    min-height:32px !important;
                    height:32px;
                    padding:5px 10px !important;
                    cursor:pointer;
                    font-size:10px;
                    font-weight:bold;
                    white-space:nowrap;
                  "
                >
                  🎲 DOBRAR DADOS
                </button>
                <select
                  id="golpe${numero}DobrarDadosVezes"
                  title="Quantidade de vezes que os dados serão dobrados"
                  style="
                    width:62px;
                    min-height:32px !important;
                    height:32px;
                    padding:4px 6px !important;
                    text-align:center;
                    font-size:10px;
                    font-weight:bold;
                    cursor:pointer;
                  "
                >
                  ${Array.from(
                      { length: 10 },
                      (_, i) => i + 1
                  ).map(
                      (vezes) =>
                          `<option value="${vezes}" ${golpe.dobrarDadosVezes === vezes ? "selected" : ""}>${vezes}x</option>`
                  ).join("")}
                </select>
              </div>
              <div style="display:flex; gap:6px;">
                <button
                  type="button"
                  class="rolarAcerto"
                  data-golpe="${numero}"
                  style="flex:1; padding:8px; cursor:pointer; font-weight:bold;"
                >
                  🎲 ACERTO
                </button>
                <button
                  type="button"
                  class="rolarDano"
                  data-golpe="${numero}"
                  style="flex:1; padding:8px; cursor:pointer; font-weight:bold;"
                >
                  🎲 DANO
                </button>
                <button
                  type="button"
                  class="rolarCritico"
                  data-golpe="${numero}"
                  style="flex:1; padding:8px; cursor:pointer; font-weight:bold;"
                >
                  💥 CRÍTICO
                </button>
              </div>
            </div>
            <div
              id="golpe${numero}PainelMCD"
              style="display:${tipoInicial === "mcd" ? "block" : "none"};"
            >
              <div style="
                display:grid;
                grid-template-columns:minmax(90px, 120px) minmax(0, 1fr);
                align-items:end;
                gap:7px;
                margin-bottom:8px;
              ">
                <div style="min-width:0;">
                  <label style="display:block; margin-bottom:3px;">CD Base</label>
                  <input
                    id="golpe${numero}CD"
                    class="cdBaseMove"
                    data-golpe="${numero}"
                    type="number"
                    value="${esc(golpe.cd)}"
                    placeholder="Ex: 15"
                    title="A CD atual é a CD Base mais os estágios de Precisão."
                    style="
                      width:100%;
                      min-height:32px !important;
                      height:32px;
                      padding:5px 7px !important;
                      text-align:center;
                      box-sizing:border-box;
                    "
                  >
                </div>
                <div
                  id="golpe${numero}CDAtual"
                  class="cdAtualPrecisao"
                  data-cd-base="${esc(golpe.cd)}"
                  style="
                    min-height:32px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    padding:5px 8px;
                    box-sizing:border-box;
                    border:1px solid #a8c7ef;
                    border-radius:8px;
                    background:#f4f9ff;
                    color:#2865be;
                    font-size:10px;
                    font-weight:900;
                    text-align:center;
                  "
                  title="CD atual após aplicar Precisão"
                >
                  ${golpe.cd === ""
                      ? "CD ATUAL —"
                      : `CD ATUAL ${Number(golpe.cd) + precisaoInicial}`}
                </div>
              </div>
              <div style="margin-bottom:8px;">
                <label style="display:block; margin-bottom:3px;">Dano</label>
                <input
                  id="golpe${numero}DanoCD"
                  type="text"
                  value="${esc(golpe.danoCD)}"
                  placeholder="Ex: 1d10+10"
                  style="
                    width:100%;
                    min-height:32px !important;
                    height:32px;
                    padding:5px 7px !important;
                    box-sizing:border-box;
                  "
                >
              </div>
              <div style="display:flex;justify-content:flex-end;margin:0 0 7px;">
                <button
                  type="button"
                  class="metadeDadosMove ${golpe.metadeDados ? "ativo" : ""}"
                  data-golpe="${numero}"
                  title="Adiciona metade da quantidade de cada dado. Ímpares arredondam para baixo; 1 dado recebe +1."
                  style="
                    min-height:32px !important;
                    height:32px;
                    padding:5px 9px !important;
                    cursor:pointer;
                    font-size:9px;
                    font-weight:900;
                    white-space:nowrap;
                    border:${golpe.metadeDados ? "2px solid #6c4bd3" : "1px solid #9aa8ba"};
                    background:${golpe.metadeDados ? "linear-gradient(180deg,#8064df 0%,#6547c7 100%)" : "#f7f9fc"};
                    color:${golpe.metadeDados ? "#fff" : "#43546a"};
                    opacity:${golpe.metadeDados ? "1" : "0.78"};
                  "
                >
                  + METADE DOS DADOS
                </button>
              </div>
              <div style="
                display:grid;
                grid-template-columns:repeat(3, minmax(0, 1fr));
                gap:6px;
              ">
                <button
                  type="button"
                  class="rolarPassouCD"
                  data-golpe="${numero}"
                  style="
                    min-height:38px !important;
                    padding:6px 4px !important;
                    cursor:pointer;
                    font-size:9px;
                    line-height:1.1;
                    font-weight:bold;
                  "
                >
                  ✅ PASSOU NA CD
                </button>
                <button
                  type="button"
                  class="rolarReprovouCD"
                  data-golpe="${numero}"
                  style="
                    min-height:38px !important;
                    padding:6px 4px !important;
                    cursor:pointer;
                    font-size:9px;
                    line-height:1.1;
                    font-weight:bold;
                  "
                >
                  ❌ REPROVOU CD
                </button>
                <button
                  type="button"
                  class="rolarCriticoCD"
                  data-golpe="${numero}"
                  style="
                    min-height:38px !important;
                    padding:6px 4px !important;
                    cursor:pointer;
                    font-size:9px;
                    line-height:1.1;
                    font-weight:bold;
                  "
                >
                  💥 GOLPE CRÍTICO
                </button>
              </div>
            </div>
            <div
              id="golpe${numero}PainelCura"
              style="display:${tipoInicial === "cura" ? "block" : "none"};"
            >
              <div style="
                display:flex;
                align-items:flex-end;
                gap:7px;
                margin-bottom:5px;
              ">
                <div style="flex:1; min-width:0;">
                  <label style="display:block; margin-bottom:3px;">Dados de Cura</label>
                  <input
                    id="golpe${numero}Cura"
                    type="text"
                    value="${esc(golpe.cura)}"
                    placeholder="Ex: 2d8+5"
                    style="
                      width:100%;
                      min-height:32px !important;
                      height:32px;
                      padding:5px 7px !important;
                      box-sizing:border-box;
                    "
                  >
                </div>
                <button
                  type="button"
                  class="metadeDadosMove ${golpe.metadeDados ? "ativo" : ""}"
                  data-golpe="${numero}"
                  title="Adiciona metade da quantidade de cada dado. Ímpares arredondam para baixo; 1 dado recebe +1."
                  style="
                    min-height:32px !important;
                    height:32px;
                    padding:5px 9px !important;
                    cursor:pointer;
                    font-size:9px;
                    font-weight:900;
                    white-space:nowrap;
                    border:${golpe.metadeDados ? "2px solid #6c4bd3" : "1px solid #9aa8ba"};
                    background:${golpe.metadeDados ? "linear-gradient(180deg,#8064df 0%,#6547c7 100%)" : "#f7f9fc"};
                    color:${golpe.metadeDados ? "#fff" : "#43546a"};
                    opacity:${golpe.metadeDados ? "1" : "0.78"};
                  "
                >
                  + METADE DOS DADOS
                </button>
                <button
                  type="button"
                  class="rolarCura"
                  data-golpe="${numero}"
                  style="
                    min-width:112px;
                    min-height:32px !important;
                    height:32px;
                    padding:5px 8px !important;
                    cursor:pointer;
                    font-size:10px;
                    font-weight:bold;
                    white-space:nowrap;
                  "
                >
                  💚 CURAR
                </button>
              </div>
              <div
                id="golpe${numero}CuraInfo"
                style="
                  min-height:15px;
                  font-size:9px;
                  color:#6c7d93;
                  text-align:right;
                "
              ></div>
            </div>
            <div
              id="golpe${numero}PainelBuffDebuff"
              style="display:${tipoInicial === "buffdebuff" ? "block" : "none"};"
            >
              <div style="
                display:grid;
                grid-template-columns:minmax(0, 1fr) auto minmax(0, 1fr);
                align-items:end;
                gap:6px;
                margin-bottom:9px;
              ">
                <div style="min-width:0;">
                  <label style="display:block; margin-bottom:3px;">Acerto</label>
                  <input
                    id="golpe${numero}BuffAcerto"
                    type="text"
                    value="${esc(golpe.buffAcerto)}"
                    placeholder="Ex: 1d20+8"
                    style="
                      width:100%;
                      min-height:32px !important;
                      height:32px;
                      padding:5px 7px !important;
                      box-sizing:border-box;
                    "
                  >
                </div>
                <button
                  type="button"
                  class="rolarAcertoBuffDebuff"
                  data-golpe="${numero}"
                  style="
                    min-height:32px !important;
                    height:32px;
                    padding:5px 8px !important;
                    cursor:pointer;
                    font-size:9px;
                    font-weight:bold;
                    white-space:nowrap;
                  "
                >
                  🎲 ACERTO
                </button>
                <div style="min-width:0;">
                  <label style="display:block; margin-bottom:3px;">Status causado</label>
                  <input
                    id="golpe${numero}StatusNome"
                    type="text"
                    value="${esc(golpe.statusNome)}"
                    placeholder="Ex: Queimadura"
                    style="
                      width:100%;
                      min-height:32px !important;
                      height:32px;
                      padding:5px 7px !important;
                      box-sizing:border-box;
                    "
                  >
                </div>
              </div>
              <div style="
                padding:7px;
                border:1px solid #dbe5f0;
                border-radius:8px;
                margin-bottom:7px;
              ">
                <div style="
                  font-size:9px;
                  font-weight:bold;
                  margin-bottom:5px;
                ">
                  BUFF +1 ESTÁGIO
                </div>
                <div style="
                  display:grid;
                  grid-template-columns:repeat(4, minmax(0, 1fr));
                  gap:5px;
                ">
                  ${BUFFS.map(
                      (buff) => `
<button type="button" class="alterarBuffMove" data-golpe="${numero}" data-buff="${buff.id}" data-delta="1" style=" min-height:30px !important; padding:4px 2px !important; cursor:pointer; font-size:9px; font-weight:bold; " > +1 ${buff.nome} </button>
`
                  ).join("")}
                </div>
              </div>
              <div style="
                padding:7px;
                border:1px solid #dbe5f0;
                border-radius:8px;
              ">
                <div style="
                  font-size:9px;
                  font-weight:bold;
                  margin-bottom:5px;
                ">
                  DEBUFF -1 ESTÁGIO
                </div>
                <div style="
                  display:grid;
                  grid-template-columns:repeat(4, minmax(0, 1fr));
                  gap:5px;
                ">
                  ${BUFFS.map(
                      (buff) => `
<button type="button" class="alterarBuffMove" data-golpe="${numero}" data-buff="${buff.id}" data-delta="-1" style=" min-height:30px !important; padding:4px 2px !important; cursor:pointer; font-size:9px; font-weight:bold; " > -1 ${buff.nome} </button>
`
                  ).join("")}
                </div>
              </div>
            </div>
          </div>
        </details>
      `;
} );
app.innerHTML = `
    ${ESTILO_FICHA}
    ${cabecalhoPokemon(token, 2)}
    <h3 style="
      text-align:center;
      margin:4px 0 5px;
      line-height:1.05;
    ">Buffs / Estágios</h3>
    <div style="
      display:flex;
      justify-content:center;
      align-items:flex-start;
      gap:3px;
      row-gap:4px;
      flex-wrap:wrap;
      margin:0 auto 5px;
      max-width:100%;
    ">
      ${criarBuffs(
          buffs,
          proficiencia
      )}
    </div>
    <div style="
      text-align:center;
      font-size:10px;
      font-weight:900;
      margin:2px 0 4px;
      opacity:0.9;
    ">
      TALENTOS DE COMBATE
    </div>
    <div style="
      display:grid;
      grid-template-columns:repeat(2, minmax(0, 1fr));
      gap:4px;
      margin:0 0 6px;
    ">
      <input id="talento-mestre-corpo" type="hidden" value="${talentosCombate.mestreCorpo ? "1" : "0"}">
      <input id="talento-mestre-distancia" type="hidden" value="${talentosCombate.mestreDistancia ? "1" : "0"}">
      <input id="talento-atacante-bestial" type="hidden" value="${talentosCombate.atacanteBestial ? "1" : "0"}">
      <input id="talento-disputador" type="hidden" value="${talentosCombate.disputador ? "1" : "0"}">
      <input id="talento-investida-poderosa" type="hidden" value="${talentosCombate.investidaPoderosa ? "1" : "0"}">
      <button type="button" class="talentoCombate ${talentosCombate.mestreCorpo ? "ativo" : ""}" data-talento="mestre-corpo"
        style="min-height:30px !important; padding:4px 5px !important; font-size:9px; line-height:1.05; font-weight:bold; cursor:pointer; opacity:${talentosCombate.mestreCorpo ? "1" : "0.55"}; border:${talentosCombate.mestreCorpo ? "2px solid #d97706" : "1px solid #666"}; background:${talentosCombate.mestreCorpo ? "linear-gradient(180deg,#f59e0b 0%,#ea7c09 100%)" : ""}; color:${talentosCombate.mestreCorpo ? "#fff" : ""}; box-shadow:${talentosCombate.mestreCorpo ? "0 2px 7px rgba(217,119,6,.32)" : ""};">
        MESTRE CORPO A CORPO
      </button>
      <button type="button" class="talentoCombate ${talentosCombate.mestreDistancia ? "ativo" : ""}" data-talento="mestre-distancia"
        style="min-height:30px !important; padding:4px 5px !important; font-size:9px; line-height:1.05; font-weight:bold; cursor:pointer; opacity:${talentosCombate.mestreDistancia ? "1" : "0.55"}; border:${talentosCombate.mestreDistancia ? "2px solid #d97706" : "1px solid #666"}; background:${talentosCombate.mestreDistancia ? "linear-gradient(180deg,#f59e0b 0%,#ea7c09 100%)" : ""}; color:${talentosCombate.mestreDistancia ? "#fff" : ""}; box-shadow:${talentosCombate.mestreDistancia ? "0 2px 7px rgba(217,119,6,.32)" : ""};">
        MESTRE À DISTÂNCIA
      </button>
      <button type="button" class="talentoCombate ${talentosCombate.atacanteBestial ? "ativo" : ""}" data-talento="atacante-bestial"
        style="min-height:30px !important; padding:4px 5px !important; font-size:9px; line-height:1.05; font-weight:bold; cursor:pointer; opacity:${talentosCombate.atacanteBestial ? "1" : "0.55"}; border:${talentosCombate.atacanteBestial ? "2px solid #d97706" : "1px solid #666"}; background:${talentosCombate.atacanteBestial ? "linear-gradient(180deg,#f59e0b 0%,#ea7c09 100%)" : ""}; color:${talentosCombate.atacanteBestial ? "#fff" : ""}; box-shadow:${talentosCombate.atacanteBestial ? "0 2px 7px rgba(217,119,6,.32)" : ""};">
        ATACANTE BESTIAL
      </button>
      <button type="button" class="talentoCombate ${talentosCombate.disputador ? "ativo" : ""}" data-talento="disputador"
        style="min-height:30px !important; padding:4px 5px !important; font-size:9px; line-height:1.05; font-weight:bold; cursor:pointer; opacity:${talentosCombate.disputador ? "1" : "0.55"}; border:${talentosCombate.disputador ? "2px solid #d97706" : "1px solid #666"}; background:${talentosCombate.disputador ? "linear-gradient(180deg,#f59e0b 0%,#ea7c09 100%)" : ""}; color:${talentosCombate.disputador ? "#fff" : ""}; box-shadow:${talentosCombate.disputador ? "0 2px 7px rgba(217,119,6,.32)" : ""};">
        DISPUTADOR
      </button>
      <button type="button" class="talentoCombate ${talentosCombate.investidaPoderosa ? "ativo" : ""}" data-talento="investida-poderosa"
        style="grid-column:1 / -1; min-height:30px !important; padding:4px 5px !important; font-size:9px; line-height:1.05; font-weight:bold; cursor:pointer; opacity:${talentosCombate.investidaPoderosa ? "1" : "0.55"}; border:${talentosCombate.investidaPoderosa ? "2px solid #d97706" : "1px solid #666"}; background:${talentosCombate.investidaPoderosa ? "linear-gradient(180deg,#f59e0b 0%,#ea7c09 100%)" : ""}; color:${talentosCombate.investidaPoderosa ? "#fff" : ""}; box-shadow:${talentosCombate.investidaPoderosa ? "0 2px 7px rgba(217,119,6,.32)" : ""};">
        INVESTIDA PODEROSA
      </button>
    </div>
    <div style="border-top:1px solid #555; margin:2px 0 3px;"></div>
    <h3 style="
      text-align:center;
      margin:3px 0 5px;
      line-height:1.05;
    ">Moves</h3>
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
function atualizarBuffsPagina() { BUFFS.forEach( (buff) => { const campoBuff = document.querySelector(
`#buff-${buff.id}`
); if (!campoBuff) { return; } const estagio = normalizarEstagioBuff( campoBuff.value, buff.id ); const campoBonus = document.querySelector(
`#bonus-${buff.id}`
); if (campoBonus) { campoBonus.textContent = buff.id === "crit" ? faixaCritico(estagio) : formatarBonus( bonusPorEstagio( buff.id, estagio, proficiencia ) ); } } ); }
document .querySelectorAll(".campoBuff") .forEach( (campo) => { campo.addEventListener( "input", () => { atualizarBuffsPagina(); const buffId = campo.id.replace("buff-", ""); if (buffId === "pres") { atualizarCDsComPrecisao(); } const valorBuff = normalizarEstagioBuff( campo.value, buffId ); token.metadata[
`${PREFIX}/buff-${buffId}`
] = valorBuff; salvamentoBuffPendente = salvamentoBuffPendente .catch(() => {}) .then(async () => { await OBR.scene.items.updateItems( [token.id], (items) => { for (const item of items) { item.metadata[
`${PREFIX}/buff-${buffId}`
] = valorBuff; } } ); if (buffId === "evas") { const hpAtualHud = Number( token.metadata[
`${PREFIX}/hpAtual`
] ?? 100 ) || 0; const hpMaxHud = Math.max( 1, Number( token.metadata[
`${PREFIX}/hpMax`
] ?? 100 ) || 1 ); const caBaseHud = Number( token.metadata[
`${PREFIX}/ca`
] ?? 10 ) || 0; await criarStatusNoToken(token, hpAtualHud, hpMaxHud, caBaseHud + valorBuff + bonusCaMegaDoToken(token)); } }); } ); campo.addEventListener( "change", () => { const buffId = campo.id.replace("buff-", ""); campo.value = String( normalizarEstagioBuff( campo.value, buffId ) ); atualizarBuffsPagina(); if (buffId === "pres") { atualizarCDsComPrecisao(); } } ); } );
document .querySelectorAll(".cdBaseMove") .forEach((campo) => { campo.addEventListener( "input", atualizarCDsComPrecisao ); campo.addEventListener( "change", atualizarCDsComPrecisao ); });
atualizarCDsComPrecisao();
function atualizarTipoMoveVisual(numero, tipo) { const tiposValidos = ["macerto", "mcd", "cura", "buffdebuff"];
const tipoSeguro = tiposValidos.includes(tipo) ? tipo : "";
const campoTipo = document.querySelector(
`#golpe${numero}Tipo`
);
if (campoTipo) { campoTipo.value = tipoSeguro; }
document .querySelectorAll(
`.tipoMove[data-golpe="${numero}"]`
) .forEach( (opcao) => { const ativo = opcao.dataset.tipo === tipoSeguro; opcao.style.opacity = ativo ? "1" : "0.62"; opcao.style.border = ativo ? "2px solid #4C8DFF" : "1px solid #c9d5e3"; opcao.style.background = ativo ? "#eaf3ff" : ""; } );
const blocoNome = document.querySelector(
`#golpe${numero}BlocoNome`
);
const grupoCategoria = document.querySelector(
`#golpe${numero}GrupoCategoria`
);
const painelMAcerto = document.querySelector(
`#golpe${numero}PainelMAcerto`
);
const painelMCD = document.querySelector(
`#golpe${numero}PainelMCD`
);
const painelCura = document.querySelector(
`#golpe${numero}PainelCura`
);
const painelBuffDebuff = document.querySelector(
`#golpe${numero}PainelBuffDebuff`
);
const ehAtaque = tipoSeguro === "macerto" || tipoSeguro === "mcd";
if (blocoNome) { blocoNome.style.display = tipoSeguro ? "block" : "none"; }
if (grupoCategoria) { grupoCategoria.style.display = ehAtaque ? "flex" : "none"; }
if (painelMAcerto) { painelMAcerto.style.display = tipoSeguro === "macerto" ? "block" : "none"; }
if (painelMCD) { painelMCD.style.display = tipoSeguro === "mcd" ? "block" : "none"; }
if (painelCura) { painelCura.style.display = tipoSeguro === "cura" ? "block" : "none"; }
if (painelBuffDebuff) { painelBuffDebuff.style.display = tipoSeguro === "buffdebuff" ? "block" : "none"; } }
document .querySelectorAll(".tipoMove") .forEach( (botao) => { botao.addEventListener( "click", () => { const numero = botao.dataset.golpe; const tipo = botao.dataset.tipo; atualizarTipoMoveVisual( numero, tipo ); document .querySelector("#salvarPokemonMoves") ?.click(); } ); } );
for (let numero = 1; numero <= 5; numero++) { const campoNome = document.querySelector(
`#golpe${numero}Nome`
);
const resumo = document.querySelector(
`#golpe${numero}Resumo`
);
if (!campoNome || !resumo) { continue; }
const atualizarResumo = () => { const nome = campoNome.value.trim();
resumo.textContent =
nome || `Move ${numero}`;
};
campoNome.addEventListener( "input", atualizarResumo );
campoNome.addEventListener( "change", atualizarResumo ); }
function talentoCombateAtivo(id) { return ( document
.querySelector(`#talento-${id}`)
?.value === "1" ); }
function atualizarVisualTalento(botao, ativo) { botao.classList.toggle("ativo", ativo);
botao.style.opacity = ativo ? "1" : "0.55"; }
document .querySelectorAll(".talentoCombate") .forEach( (botao) => { botao.addEventListener( "click", () => { const id = botao.dataset.talento; const campo = document.querySelector(
`#talento-${id}`
); if (!campo) { return; } const ativo = campo.value !== "1"; campo.value = ativo ? "1" : "0"; atualizarVisualTalento( botao, ativo ); document .querySelector("#salvarPokemonMoves") ?.click(); } ); } );
document .querySelectorAll(".categoriaGolpe") .forEach( (botao) => { botao.addEventListener( "click", () => { const numero = botao.dataset.golpe; const categoria = botao.dataset.categoria; const campoCategoria = document.querySelector(
`#golpe${numero}Categoria`
); campoCategoria.value = categoria; document .querySelectorAll(
`.categoriaGolpe[data-golpe="${numero}"]`
) .forEach( (opcao) => { const ativo = opcao.dataset.categoria === categoria; opcao.style.opacity = ativo ? "1" : "0.55"; opcao.style.border = ativo ? "2px solid #FFFFFF" : "1px solid #666"; } ); } ); } );
function nomeGolpe(numero) { return ( document .querySelector(
`#golpe${numero}Nome`
) ?.value .trim() ||
`Move ${numero}`
); }
function categoriaGolpeAtual(numero) { return ( document .querySelector(
`#golpe${numero}Categoria`
) ?.value || "" ); }
function estagioPrecisaoAtual() { return normalizarEstagioBuff( document .querySelector("#buff-pres") ?.value ?? buffs.pres ?? 0, "pres" ); }
function adicionarPrecisaoAoAcerto(formula) { return adicionarBonusNaFormula( formula, estagioPrecisaoAtual() ); }
function atualizarCDsComPrecisao() { const precisao = estagioPrecisaoAtual();
for (let numero = 1; numero <= 5; numero++) { const campoCD = document.querySelector(
`#golpe${numero}CD`
);
const indicador = document.querySelector(
`#golpe${numero}CDAtual`
);
if (!campoCD || !indicador) { continue; }
const textoBase = String(campoCD.value ?? "").trim();
if (textoBase === "") { indicador.textContent = "CD ATUAL —";
indicador.title = "Defina a CD Base do move.";
continue; }
const cdBase = Number( textoBase.replace(",", ".") );
if (!Number.isFinite(cdBase)) { indicador.textContent = "CD ATUAL —";
continue; }
const cdAtual = cdBase + precisao;
indicador.textContent =
`CD ATUAL ${formatarDecimal(cdAtual)}`;
if (precisao === 0) { indicador.title =
`CD Base ${formatarDecimal(cdBase)} · Precisão 0`;
} else { const sinalPrecisao = precisao > 0 ? "+" : "";
indicador.title =
`CD Base ${formatarDecimal(cdBase)} · Precisão ${sinalPrecisao}${precisao} · CD Atual ${formatarDecimal(cdAtual)}`;
} } }
function formulaComVantagem(formula) { const base = String(formula || "").trim();
if (!base) { return base; }
return `(${base},${base})kh1`;
}
function formulaAcertoComTalentos( numero, formulaOriginal ) { const categoria = categoriaGolpeAtual(numero);
let bonusTalento = estagioPrecisaoAtual();
if ( categoria === "fisico" && talentoCombateAtivo("mestre-corpo") ) { bonusTalento -= 5; }
if ( categoria === "especial" && talentoCombateAtivo("mestre-distancia") ) { bonusTalento -= 5; }
let formulaFinal = adicionarBonusNaFormula( formulaOriginal, bonusTalento );
if (talentoCombateAtivo("disputador")) { formulaFinal = formulaComVantagem( formulaFinal ); }
return formulaFinal; }
function formulaDanoComBuff( numero, formulaOriginal, opcoes = {} ) { const incluirBonusMestres = opcoes.incluirBonusMestres !== false;
const categoria = categoriaGolpeAtual(numero);
if (!categoria) { alert( "Escolha se o move é FÍSICO ou ESPECIAL antes de rolar o dano." );
return null; }
const buffId = categoria === "fisico" ? "atq" : "atqsp";
const estagioBuff = normalizarEstagioBuff( document .querySelector(
`#buff-${buffId}`
) ?.value, buffId );
const bonusBuff = bonusPorEstagio( buffId, estagioBuff, proficiencia );
let bonusTalentos = 0;
if (categoria === "fisico") { if ( incluirBonusMestres && talentoCombateAtivo("mestre-corpo") ) { bonusTalentos += 10; }
if (talentoCombateAtivo("investida-poderosa")) { bonusTalentos += 5; } }
if ( incluirBonusMestres && categoria === "especial" && talentoCombateAtivo("mestre-distancia") ) { bonusTalentos += 10; }
let formulaFinal = adicionarBonusNaFormula( formulaOriginal, bonusBuff + bonusTalentos );
if ( categoria === "fisico" && talentoCombateAtivo("atacante-bestial") ) { formulaFinal = formulaComVantagem( formulaFinal ); }
return formulaFinal; }
function dobrarDadosPorVezes( formula, vezes ) { const quantidadeDobras = Math.max( 1, Math.min( 10, Number(vezes) || 1 ) );
const multiplicador = Math.pow(2, quantidadeDobras);
return String(formula || "").replace( /(^|[^A-Za-z0-9_])(\d*)d(\d+)/gi, (match, prefixo, quantidade, faces) => { const qtdOriginal = quantidade === "" ? 1 : Number(quantidade);
return `${prefixo}${qtdOriginal * multiplicador}d${faces}`;
} ); }
function adicionarMetadeDosDadosFormula(formula) {
const base = String(formula || "").trim();
if (!base) { return base; }
return base.replace( /(^|[^A-Za-z0-9_])(\d*)d(\d+)/gi, (match, prefixo, quantidade, faces) => { const qtdOriginal = quantidade === "" ? 1 : Math.max(0, Number(quantidade) || 0);
const acrescimo = qtdOriginal <= 1 ? 1 : Math.floor(qtdOriginal / 2);
return `${prefixo}${qtdOriginal + acrescimo}d${faces}`;
} ); }
function metadeDadosAtiva(numero) { return document.querySelector(`#golpe${numero}MetadeDados`)?.value === "1"; }
function aplicarMetadeDadosSeAtivo(numero, formula) { return metadeDadosAtiva(numero) ? adicionarMetadeDosDadosFormula(formula) : formula; }
function atualizarVisualMetadeDados(numero) { const ativo = metadeDadosAtiva(numero); document.querySelectorAll(`.metadeDadosMove[data-golpe="${numero}"]`).forEach((botao) => { botao.classList.toggle("ativo", ativo); botao.style.border = ativo ? "2px solid #6c4bd3" : "1px solid #9aa8ba"; botao.style.background = ativo ? "linear-gradient(180deg,#8064df 0%,#6547c7 100%)" : "#f7f9fc"; botao.style.color = ativo ? "#fff" : "#43546a"; botao.style.opacity = ativo ? "1" : "0.78"; botao.textContent = ativo ? "✓ + METADE DOS DADOS" : "+ METADE DOS DADOS"; }); }
document.querySelectorAll(".metadeDadosMove").forEach((botao) => { botao.addEventListener("click", () => { const numero = botao.dataset.golpe; const campo = document.querySelector(`#golpe${numero}MetadeDados`); if (!campo) { return; } campo.value = campo.value === "1" ? "0" : "1"; atualizarVisualMetadeDados(numero); document.querySelector("#salvarPokemonMoves")?.click(); }); });
for (let numero = 1; numero <= 5; numero++) { atualizarVisualMetadeDados(numero); }
document .querySelectorAll(".rolarAcerto") .forEach( (botao) => { botao.addEventListener( "click", async () => { const numero = botao.dataset.golpe; const formula = document .querySelector(
`#golpe${numero}Acerto`
) .value .trim(); if (!formula) { alert( "A fórmula de acerto está vazia." ); return; } const formulaFinal = formulaAcertoComTalentos( numero, formula ); await rolarNoDicePlus( formulaFinal, nomeGolpe(numero), "Acerto" ); } ); } );
document .querySelectorAll(".rolarDano") .forEach( (botao) => { botao.addEventListener( "click", async () => { const numero = botao.dataset.golpe; const formulaOriginal = document .querySelector(
`#golpe${numero}Dano`
) .value .trim(); if (!formulaOriginal) { alert( "A fórmula de dano está vazia." ); return; } const formulaComMetade = aplicarMetadeDadosSeAtivo(numero, formulaOriginal); const formulaFinal = formulaDanoComBuff( numero, formulaComMetade ); if (!formulaFinal) { return; } await rolarNoDicePlus( formulaFinal, nomeGolpe(numero), "Dano" ); } ); } );
document .querySelectorAll(".rolarDobrarDados") .forEach( (botao) => { botao.addEventListener( "click", async () => { const numero = botao.dataset.golpe; const formulaOriginal = document .querySelector(
`#golpe${numero}Dano`
) .value .trim(); if (!formulaOriginal) { alert( "A fórmula de dano está vazia." ); return; } const campoDobras = document.querySelector(
`#golpe${numero}DobrarDadosVezes`
); const vezes = Math.max( 1, Math.min( 10, Number(campoDobras?.value) || 1 ) ); const formulaComMetade = aplicarMetadeDadosSeAtivo(numero, formulaOriginal); const formulaDadosDobrados = dobrarDadosPorVezes( formulaComMetade, vezes ); const formulaFinal = formulaDanoComBuff( numero, formulaDadosDobrados ); if (!formulaFinal) { return; } await rolarNoDicePlus( formulaFinal, nomeGolpe(numero),
`Dobrar Dados ${vezes}x`
); } ); } );
document .querySelectorAll(".rolarCritico") .forEach( (botao) => { botao.addEventListener( "click", async () => { const numero = botao.dataset.golpe; const formulaOriginal = document .querySelector(
`#golpe${numero}Dano`
) .value .trim(); if (!formulaOriginal) { alert( "A fórmula de dano está vazia." ); return; } const categoria = document .querySelector(
`#golpe${numero}Categoria`
) ?.value || ""; if (!categoria) { alert( "Escolha se o move é FÍSICO ou ESPECIAL antes de rolar o crítico." ); return; } const formulaComMetade = aplicarMetadeDadosSeAtivo(numero, formulaOriginal); const formulaCritica = duplicarDadosFormula( formulaComMetade ); const formulaFinal = formulaDanoComBuff( numero, formulaCritica ); if (!formulaFinal) { return; } await rolarNoDicePlus( formulaFinal, nomeGolpe(numero), "Crítico" ); } ); } );
document .querySelectorAll(".rolarPassouCD") .forEach( (botao) => { botao.addEventListener( "click", async () => { const numero = botao.dataset.golpe; const formulaOriginal = document .querySelector(
`#golpe${numero}DanoCD`
) .value .trim(); if (!formulaOriginal) { alert( "A fórmula de dano está vazia." ); return; } const formulaComMetade = aplicarMetadeDadosSeAtivo(numero, formulaOriginal); const formulaComBuff = formulaDanoComBuff( numero, formulaComMetade, { incluirBonusMestres: false } ); if (!formulaComBuff) { return; } const formulaFinal =
`(${formulaComBuff})/2`;
await rolarNoDicePlus( formulaFinal, nomeGolpe(numero), "Passou na CD" ); } ); } );
document .querySelectorAll(".rolarReprovouCD") .forEach( (botao) => { botao.addEventListener( "click", async () => { const numero = botao.dataset.golpe; const formulaOriginal = document .querySelector(
`#golpe${numero}DanoCD`
) .value .trim(); if (!formulaOriginal) { alert( "A fórmula de dano está vazia." ); return; } const formulaComMetade = aplicarMetadeDadosSeAtivo(numero, formulaOriginal); const formulaFinal = formulaDanoComBuff( numero, formulaComMetade ); if (!formulaFinal) { return; } await rolarNoDicePlus( formulaFinal, nomeGolpe(numero), "Reprovou CD" ); } ); } );
document .querySelectorAll(".rolarCriticoCD") .forEach( (botao) => { botao.addEventListener( "click", async () => { const numero = botao.dataset.golpe; const formulaOriginal = document .querySelector(
`#golpe${numero}DanoCD`
) .value .trim(); if (!formulaOriginal) { alert( "A fórmula de dano está vazia." ); return; } const categoria = document .querySelector(
`#golpe${numero}Categoria`
) ?.value || ""; if (!categoria) { alert( "Escolha se o move é FÍSICO ou ESPECIAL antes de rolar o crítico." ); return; } const formulaComMetade = aplicarMetadeDadosSeAtivo(numero, formulaOriginal); const formulaCritica = duplicarDadosFormula( formulaComMetade ); const formulaFinal = formulaDanoComBuff( numero, formulaCritica ); if (!formulaFinal) { return; } await rolarNoDicePlus( formulaFinal, nomeGolpe(numero), "Golpe Crítico" ); } ); } );
async function aplicarCuraNoHp(valorCura) { const cura = Math.max(0, Number(valorCura) || 0);
const hpAtualAnterior = Number( token.metadata[
`${PREFIX}/hpAtual`
] ?? 0 ) || 0;
const hpMax = Math.max( 1, Number( token.metadata[
`${PREFIX}/hpMax`
] ?? 100 ) || 1 );
const hpAtualNovo = Math.max( 0, Math.min( hpMax, hpAtualAnterior + cura ) );
token.metadata[
`${PREFIX}/hpAtual`
] = hpAtualNovo;
await OBR.scene.items.updateItems( [token.id], (items) => { for (const item of items) { item.metadata[
`${PREFIX}/hpAtual`
] = hpAtualNovo; } } );
const caBase = Number( token.metadata[
`${PREFIX}/ca`
] ?? 10 ) || 0;
const evasao = normalizarEstagioBuff( token.metadata[
`${PREFIX}/buff-evas`
] ?? 0, "evas" );
await criarStatusNoToken( token, hpAtualNovo, hpMax, caBase + evasao );
return { curaRolada: cura, curaAplicada: Math.max( 0, hpAtualNovo - hpAtualAnterior ), hpAnterior: hpAtualAnterior, hpAtual: hpAtualNovo, hpMax }; }
document .querySelectorAll(".rolarCura") .forEach( (botao) => { botao.addEventListener( "click", async () => { const numero = botao.dataset.golpe; const formula = document .querySelector(
`#golpe${numero}Cura`
) ?.value .trim(); if (!formula) { alert( "A fórmula de cura está vazia." ); return; } botao.disabled = true; try { const formulaFinal = aplicarMetadeDadosSeAtivo(numero, formula); const resultado = await rolarNoDicePlusComResultado( formulaFinal, nomeGolpe(numero), "Cura" ); if (resultado === null) { return; } const dadosCura = await aplicarCuraNoHp( resultado ); const info = document.querySelector(
`#golpe${numero}CuraInfo`
); if (info) { info.textContent =
`Rolou ${dadosCura.curaRolada} · ` +
`Curou +${dadosCura.curaAplicada} · ` +
`HP ${dadosCura.hpAnterior} → ${dadosCura.hpAtual}/${dadosCura.hpMax}`;
} } finally { botao.disabled = false; } } ); } );
document .querySelectorAll(".rolarAcertoBuffDebuff") .forEach( (botao) => { botao.addEventListener( "click", async () => { const numero = botao.dataset.golpe; const formula = document .querySelector(
`#golpe${numero}BuffAcerto`
) ?.value .trim(); if (!formula) { alert( "A fórmula de acerto está vazia." ); return; } const statusNome = document .querySelector(
`#golpe${numero}StatusNome`
) ?.value .trim(); const formulaFinal = adicionarPrecisaoAoAcerto( formula ); await rolarNoDicePlus( formulaFinal, nomeGolpe(numero), statusNome
? `Acerto · ${statusNome}`
: "Acerto" ); } ); } );
document .querySelectorAll(".alterarBuffMove") .forEach( (botao) => { botao.addEventListener( "click", () => { const buffId = botao.dataset.buff; const delta = Number( botao.dataset.delta ) || 0; const campoBuff = document.querySelector(
`#buff-${buffId}`
); if (!campoBuff || !delta) { return; } const atual = normalizarEstagioBuff( campoBuff.value, buffId ); const novo = normalizarEstagioBuff( atual + delta, buffId ); campoBuff.value = String(novo); campoBuff.dispatchEvent( new Event( "input", { bubbles: true } ) ); campoBuff.dispatchEvent( new Event( "change", { bubbles: true } ) ); } ); } );
document .querySelector("#salvarPokemonMoves") .addEventListener( "click", async () => { const novosBuffs = {}; BUFFS.forEach( (buff) => { novosBuffs[buff.id] = normalizarEstagioBuff( document .querySelector(
`#buff-${buff.id}`
) .value, buff.id ); } ); const novosTalentos = { mestreCorpo: talentoCombateAtivo("mestre-corpo"), mestreDistancia: talentoCombateAtivo("mestre-distancia"), atacanteBestial: talentoCombateAtivo("atacante-bestial"), disputador: talentoCombateAtivo("disputador"), investidaPoderosa: talentoCombateAtivo("investida-poderosa") }; const novosGolpes = []; for ( let i = 1; i <= 5; i++ ) { const tipoCampo = document .querySelector(
`#golpe${i}Tipo`
) .value; const categoriaCampo = document .querySelector(
`#golpe${i}Categoria`
) .value; novosGolpes.push({ tipo: ["macerto", "mcd", "cura", "buffdebuff"] .includes(tipoCampo) ? tipoCampo : "", nome: document .querySelector(
`#golpe${i}Nome`
) .value .trim(), categoria: categoriaCampo === "especial" ? "especial" : categoriaCampo === "fisico" ? "fisico" : "", acerto: document .querySelector(
`#golpe${i}Acerto`
) .value .trim(), dano: document .querySelector(
`#golpe${i}Dano`
) .value .trim(), dobrarDadosVezes: Math.max( 1, Math.min( 10, Number( document .querySelector(
`#golpe${i}DobrarDadosVezes`
) ?.value ) || 1 ) ), cd: document .querySelector(
`#golpe${i}CD`
) .value .trim(), danoCD: document .querySelector(
`#golpe${i}DanoCD`
) .value .trim(), cura: document .querySelector(
`#golpe${i}Cura`
) ?.value .trim() || "", metadeDados: document.querySelector(
`#golpe${i}MetadeDados`
)?.value === "1", buffAcerto: document .querySelector(
`#golpe${i}BuffAcerto`
) ?.value .trim() || "", statusNome: document .querySelector(
`#golpe${i}StatusNome`
) ?.value .trim() || "" }); } await OBR.scene.items.updateItems( [token.id], (items) => { for (const item of items) { BUFFS.forEach( (buff) => { item.metadata[
`${PREFIX}/buff-${buff.id}`
] = novosBuffs[buff.id]; } ); item.metadata[
`${PREFIX}/talento-mestre-corpo`
] = novosTalentos.mestreCorpo; item.metadata[
`${PREFIX}/talento-mestre-distancia`
] = novosTalentos.mestreDistancia; item.metadata[
`${PREFIX}/talento-atacante-bestial`
] = novosTalentos.atacanteBestial; item.metadata[
`${PREFIX}/talento-disputador`
] = novosTalentos.disputador; item.metadata[
`${PREFIX}/talento-investida-poderosa`
] = novosTalentos.investidaPoderosa; novosGolpes.forEach( (golpe, index) => { const numero = index + 1; item.metadata[
`${PREFIX}/golpe${numero}Tipo`
] = golpe.tipo; item.metadata[
`${PREFIX}/golpe${numero}Nome`
] = golpe.nome; item.metadata[
`${PREFIX}/golpe${numero}Categoria`
] = golpe.categoria; item.metadata[
`${PREFIX}/golpe${numero}Acerto`
] = golpe.acerto; item.metadata[
`${PREFIX}/golpe${numero}Dano`
] = golpe.dano; item.metadata[
`${PREFIX}/golpe${numero}DobrarDadosVezes`
] = golpe.dobrarDadosVezes; item.metadata[
`${PREFIX}/golpe${numero}CD`
] = golpe.cd; item.metadata[
`${PREFIX}/golpe${numero}DanoCD`
] = golpe.danoCD; item.metadata[
`${PREFIX}/golpe${numero}Cura`
] = golpe.cura; item.metadata[
`${PREFIX}/golpe${numero}MetadeDados`
] = golpe.metadeDados; item.metadata[
`${PREFIX}/golpe${numero}BuffAcerto`
] = golpe.buffAcerto; item.metadata[
`${PREFIX}/golpe${numero}StatusNome`
] = golpe.statusNome; } ); } } ); const hpAtualHud = Number( token.metadata[
`${PREFIX}/hpAtual`
] ?? 100 ) || 0; const hpMaxHud = Math.max( 1, Number( token.metadata[
`${PREFIX}/hpMax`
] ?? 100 ) || 1 ); const caBaseHud = Number( token.metadata[
`${PREFIX}/ca`
] ?? 10 ) || 0; const caEfetivaHud = caBaseHud + (Number(novosBuffs.evas) || 0); await criarStatusNoToken( token, hpAtualHud, hpMaxHud, caEfetivaHud ); } ); }
function mostrarFichaPokemonMega(token) {
  const app = document.querySelector("#app");
const megaConfig = megaConfigDoToken(token);
const megaAtiva = megaAtivaNoToken(token);
const megaDistribuicaoInicial = distribuicaoMegaDoToken(token);
const megaPontosIniciais = pontosUsadosMega(megaDistribuicaoInicial);
const megaNomesAtributos = { for: "FOR", des: "DES", con: "CON", int: "INT", sab: "SAB", car: "CAR" };
const megaNomesMovimentos = {
  "movimento-caminhada": "Caminhada", "movimento-escalada": "Escalada", "movimento-voo": "Voo",
  "movimento-natacao": "Natação", "movimento-escavacao": "Escavação", "movimento-flutuacao": "Flutuação"
};
const htmlMegaAtributos = MEGA_ATRIBUTOS.map((id) => `
  <div style="display:grid;grid-template-columns:32px 30px 1fr 30px;gap:4px;align-items:center;padding:5px;border:1px solid #e2d8f2;border-radius:8px;background:#fff;">
    <strong style="font-size:9px;color:#604281;">${megaNomesAtributos[id]}</strong>
    <button type="button" class="megaAjuste" data-mega-grupo="atributo" data-mega-id="${id}" data-mega-delta="-1" style="min-height:28px!important;padding:2px!important;">−</button>
    <span id="megaAtributo-${id}" style="text-align:center;font-size:10px;font-weight:900;color:#684895;">+${megaDistribuicaoInicial.atributos[id]} Status</span>
    <button type="button" class="megaAjuste" data-mega-grupo="atributo" data-mega-id="${id}" data-mega-delta="1" style="min-height:28px!important;padding:2px!important;">+</button>
  </div>`).join("");
const htmlMegaMovimentos = MEGA_MOVIMENTOS.map((id) => `
  <div style="display:grid;grid-template-columns:minmax(62px,1fr) 30px 58px 30px;gap:4px;align-items:center;padding:5px;border:1px solid #e2d8f2;border-radius:8px;background:#fff;">
    <strong style="font-size:8px;color:#604281;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${megaNomesMovimentos[id]}</strong>
    <button type="button" class="megaAjuste" data-mega-grupo="movimento" data-mega-id="${id}" data-mega-delta="-1" style="min-height:28px!important;padding:2px!important;">−</button>
    <span id="megaMovimento-${id}" style="text-align:center;font-size:9px;font-weight:900;color:#684895;">+${formatarDecimal(megaDistribuicaoInicial.movimentos[id] * MEGA_PASSO_MOVIMENTO)}m</span>
    <button type="button" class="megaAjuste" data-mega-grupo="movimento" data-mega-id="${id}" data-mega-delta="1" style="min-height:28px!important;padding:2px!important;">+</button>
  </div>`).join("");
  app.innerHTML = `
    ${ESTILO_FICHA}
    ${cabecalhoPokemon(token, 4)}
    <div style="margin-top:2px;">
    <div
      id="megaEvolucaoCard"
      style="
        padding:10px;
        border:1px solid #ddd3f4;
        border-radius:12px;
        background:linear-gradient(180deg,#fbf8ff 0%,#f6f0ff 100%);
        box-shadow:0 3px 10px rgba(91,53,140,.08);
        margin-bottom:8px;
      "
    >
      <div style="
        display:flex;
        align-items:center;
        gap:9px;
        margin-bottom:8px;
      ">
        <div style="
          width:50px;
          height:50px;
          flex:0 0 50px;
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden;
          border-radius:12px;
          background:#ffffff;
          border:1px solid #ded3f1;
          box-shadow:0 2px 7px rgba(91,53,140,.10);
          padding:4px;
        ">
          <img
            src="${esc(urlImagemMegaEvolucao())}"
            alt="Mega Evolução"
            title="Mega Evolução"
            draggable="false"
            onerror="this.style.display='none'"
            style="
              width:100%;
              height:100%;
              object-fit:contain;
              display:block;
            "
          >
        </div>

        <div style="
          min-width:0;
          flex:1;
        ">
          <div style="
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:8px;
          ">
            <div style="
              font-size:11px;
              font-weight:900;
              color:#63418f;
            ">
              MEGA EVOLUÇÃO
            </div>

            <div
              id="megaEstadoTexto"
              style="
                font-size:9px;
                font-weight:900;
                white-space:nowrap;
                color:${megaAtiva ? "#269653" : "#7a688e"};
              "
            >
              ${megaAtiva ? "MEGA ATIVA" : "FORMA NORMAL"}
            </div>
          </div>

          <div
            id="megaReferenciaTexto"
            style="
              margin-top:3px;
              font-size:9px;
              font-weight:800;
              color:#8a77a5;
              word-break:break-word;
            "
          >
            ${
              megaConfig
                ? `Mega definida: ${esc(megaConfig.referenciaNome || "Personagem")}`
                : "Nenhuma forma Mega definida"
            }
          </div>
        </div>
      </div>

      <div style="
        display:grid;
        grid-template-columns:minmax(0,1fr) auto;
        gap:6px;
        align-items:center;
      ">
        <select
          id="megaTokenReferencia"
          style="
            width:100%;
            min-width:0;
            min-height:38px !important;
            padding:7px 9px !important;
            font-size:10px;
            font-weight:900;
            color:#5f4485 !important;
            border-color:#c9b7e6 !important;
            background:#ffffff !important;
          "
        >
          <option value="">Carregando personagens da mesa...</option>
        </select>

        <button
          id="atualizarTokensMega"
          type="button"
          title="Atualizar personagens disponíveis na mesa"
          style="
            min-width:38px;
            min-height:38px !important;
            padding:6px 9px !important;
            font-size:14px;
            font-weight:900;
            cursor:pointer;
          "
        >
          ↻
        </button>
      </div>

      <button
        id="definirMegaEvolucao"
        type="button"
        style="
          width:100%;
          min-height:36px !important;
          margin-top:6px;
          padding:6px 9px !important;
          font-size:10px;
          font-weight:900;
          cursor:pointer;
          background:linear-gradient(180deg,#ffffff 0%,#f0e9fb 100%) !important;
          color:#5f4485 !important;
          border-color:#c9b7e6 !important;
        "
      >
        DEFINIR TOKEN COMO MEGA
      </button>

      <div style="
        margin-top:4px;
        font-size:8px;
        line-height:1.25;
        font-weight:800;
        color:#8a77a5;
        text-align:center;
      ">
        Mostra somente tokens da mesa cujo nome começa com Mega.
      </div>

      <div id="megaDistribuicaoCard" style="margin-top:10px;padding:8px;border:1px solid #d8caed;border-radius:10px;background:#fffaff;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:7px;">
          <strong style="font-size:10px;color:#604281;">DISTRIBUIÇÃO DA MEGA</strong>
          <span id="megaPontosTexto" style="font-size:10px;font-weight:900;color:#6f52d9;">${Math.max(0, MEGA_PONTOS_TOTAL - megaPontosIniciais)} pts livres</span>
        </div>
        <div style="font-size:8px;line-height:1.25;color:#806b99;margin-bottom:7px;">
          CA: 2 pts = +1 CA · Status: 1 pt = +1 atributo · Movimento: 1 pt = +1,5 m
        </div>

        <div style="display:grid;grid-template-columns:48px 30px 1fr 30px;gap:4px;align-items:center;padding:5px;border:1px solid #e2d8f2;border-radius:8px;background:#fff;margin-bottom:6px;">
          <strong style="font-size:9px;color:#604281;">CA</strong>
          <button type="button" class="megaAjuste" data-mega-grupo="ca" data-mega-delta="-1" style="min-height:28px!important;padding:2px!important;">−</button>
          <span id="megaCaValor" style="text-align:center;font-size:10px;font-weight:900;color:#684895;">+${megaDistribuicaoInicial.ca} CA</span>
          <button type="button" class="megaAjuste" data-mega-grupo="ca" data-mega-delta="1" style="min-height:28px!important;padding:2px!important;">+</button>
        </div>

        <div style="font-size:8px;font-weight:900;color:#806b99;margin:7px 0 4px;">STATUS</div>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;">${htmlMegaAtributos}</div>

        <div style="font-size:8px;font-weight:900;color:#806b99;margin:8px 0 4px;">MOVIMENTAÇÃO</div>
        <div style="display:grid;grid-template-columns:1fr;gap:5px;">${htmlMegaMovimentos}</div>

        <div style="font-size:8px;font-weight:900;color:#806b99;margin:8px 0 4px;">HABILIDADE PASSIVA DA MEGA</div>
        <textarea id="megaHabilidadeNova" class="megaConfigCampo" rows="3" placeholder="Escreva a habilidade que substituirá a habilidade normal enquanto a Mega estiver ativa..." style="width:100%;box-sizing:border-box;resize:vertical;">${esc(megaDistribuicaoInicial.habilidade)}</textarea>
        <div id="megaConfigSalvaTexto" style="min-height:11px;margin-top:4px;text-align:center;font-size:8px;font-weight:800;color:#7d6998;">Configuração salva no próprio Pokémon.</div>
      </div>

      <div style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:6px;
        margin-top:8px;
      ">
        <button
          id="botaoMegaEvolucao"
          type="button"
          ${megaConfig && !megaAtiva ? "" : "disabled"}
          style="
            min-height:42px !important;
            padding:7px 8px !important;
            border-radius:10px;
            font-size:10px;
            font-weight:900;
            cursor:pointer;
            background:linear-gradient(135deg,#9b7cff 0%,#6f52d9 100%) !important;
            color:#fff !important;
            border-color:#6045c6 !important;
          "
        >
          MEGA EVOLUÇÃO
        </button>

        <button
          id="retirarMegaEvolucao"
          type="button"
          ${megaAtiva ? "" : "disabled"}
          style="
            min-height:42px !important;
            padding:7px 8px !important;
            border-radius:10px;
            font-size:10px;
            font-weight:900;
            cursor:pointer;
            background:linear-gradient(135deg,#ef7676 0%,#ce4f4f 100%) !important;
            color:#fff !important;
            border-color:#bb4545 !important;
          "
        >
          RETIRAR EVOLUÇÃO
        </button>
      </div>

      <div
        id="megaMensagem"
        style="
          min-height:12px;
          margin-top:5px;
          font-size:9px;
          font-weight:800;
          text-align:center;
          color:#725a91;
        "
      ></div>
    </div>


    </div>
  `;
  ativarCabecalhoPokemon(token);
const seletorMega = document.querySelector("#megaTokenReferencia");
const botaoAtualizarMega = document.querySelector("#atualizarTokensMega");
const botaoDefinirMega = document.querySelector("#definirMegaEvolucao");
const botaoMega = document.querySelector("#botaoMegaEvolucao");
const botaoRetirarMega = document.querySelector("#retirarMegaEvolucao");
const mensagemMega = document.querySelector("#megaMensagem");
const textoReferenciaMega = document.querySelector("#megaReferenciaTexto");
const textoEstadoMega = document.querySelector("#megaEstadoTexto");
const textoMegaPontos = document.querySelector("#megaPontosTexto");
const campoMegaHabilidade = document.querySelector("#megaHabilidadeNova");
const textoMegaConfigSalva = document.querySelector("#megaConfigSalvaTexto");
let distribuicaoMegaEdicao = normalizarDistribuicaoMega(megaDistribuicaoInicial);
let temporizadorSalvarMega = null;
let tokensMegaDisponiveis = [];

const custoMegaAjuste = (grupo) => grupo === "ca" ? 2 : 1;
const atualizarEditorMega = () => {
  const usados = pontosUsadosMega(distribuicaoMegaEdicao);
  const restantes = MEGA_PONTOS_TOTAL - usados;
  if (textoMegaPontos) {
    textoMegaPontos.textContent = `${Math.max(0, restantes)} pts livres`;
    textoMegaPontos.style.color = restantes === 0 ? "#269653" : "#6f52d9";
  }
  const caTexto = document.querySelector("#megaCaValor");
  if (caTexto) caTexto.textContent = `+${distribuicaoMegaEdicao.ca} CA`;
  for (const id of MEGA_ATRIBUTOS) {
    const el = document.querySelector(`#megaAtributo-${id}`);
    if (el) el.textContent = `+${distribuicaoMegaEdicao.atributos[id]} Status`;
  }
  for (const id of MEGA_MOVIMENTOS) {
    const el = document.querySelector(`#megaMovimento-${id}`);
    if (el) el.textContent = `+${formatarDecimal(distribuicaoMegaEdicao.movimentos[id] * MEGA_PASSO_MOVIMENTO)}m`;
  }
  document.querySelectorAll(".megaAjuste").forEach((botao) => {
    const delta = Number(botao.dataset.megaDelta) || 0;
    const grupo = botao.dataset.megaGrupo || "";
    const id = botao.dataset.megaId || "";
    if (delta < 0) {
      let valorAtual = 0;
      if (grupo === "ca") valorAtual = Number(distribuicaoMegaEdicao.ca) || 0;
      if (grupo === "atributo" && MEGA_ATRIBUTOS.includes(id)) valorAtual = Number(distribuicaoMegaEdicao.atributos[id]) || 0;
      if (grupo === "movimento" && MEGA_MOVIMENTOS.includes(id)) valorAtual = Number(distribuicaoMegaEdicao.movimentos[id]) || 0;
      botao.disabled = valorAtual <= 0;
      return;
    }
    botao.disabled = restantes < custoMegaAjuste(grupo);
  });
};

const salvarEditorMega = async () => {
  distribuicaoMegaEdicao.habilidade = campoMegaHabilidade?.value ?? distribuicaoMegaEdicao.habilidade;
  if (!megaConfigDoToken(token)) {
    if (textoMegaConfigSalva) textoMegaConfigSalva.textContent = "Ajustes prontos. Defina o token Mega para salvar no Pokémon.";
    return;
  }
  try {
    const configSalvo = await salvarDistribuicaoMega(token, distribuicaoMegaEdicao);
    distribuicaoMegaEdicao = normalizarDistribuicaoMega(configSalvo.distribuicao);
    if (textoMegaConfigSalva) textoMegaConfigSalva.textContent = "✓ Configuração Mega salva.";
    atualizarEditorMega();
  } catch (erro) {
    if (textoMegaConfigSalva) textoMegaConfigSalva.textContent = erro?.message || "Não foi possível salvar a configuração Mega.";
  }
};

const programarSalvarEditorMega = (atraso = 300) => {
  if (temporizadorSalvarMega) clearTimeout(temporizadorSalvarMega);
  temporizadorSalvarMega = setTimeout(() => { temporizadorSalvarMega = null; salvarEditorMega(); }, atraso);
};

document.querySelectorAll(".megaAjuste").forEach((botao) => {
  botao.addEventListener("click", () => {
    const grupo = botao.dataset.megaGrupo || "";
    const id = botao.dataset.megaId || "";
    const delta = Number(botao.dataset.megaDelta) || 0;
    const usados = pontosUsadosMega(distribuicaoMegaEdicao);
    const custo = custoMegaAjuste(grupo);
    if (delta > 0 && usados + custo > MEGA_PONTOS_TOTAL) {
      if (textoMegaConfigSalva) textoMegaConfigSalva.textContent = "Os 11 pontos da Mega já foram distribuídos.";
      return;
    }
    if (grupo === "ca") distribuicaoMegaEdicao.ca = Math.max(0, distribuicaoMegaEdicao.ca + delta);
    if (grupo === "atributo" && MEGA_ATRIBUTOS.includes(id)) distribuicaoMegaEdicao.atributos[id] = Math.max(0, distribuicaoMegaEdicao.atributos[id] + delta);
    if (grupo === "movimento" && MEGA_MOVIMENTOS.includes(id)) distribuicaoMegaEdicao.movimentos[id] = Math.max(0, distribuicaoMegaEdicao.movimentos[id] + delta);
    atualizarEditorMega();
    programarSalvarEditorMega(80);
  });
});

if (campoMegaHabilidade) {
  campoMegaHabilidade.addEventListener("input", () => {
    distribuicaoMegaEdicao.habilidade = campoMegaHabilidade.value;
    if (textoMegaConfigSalva) textoMegaConfigSalva.textContent = "Salvando habilidade Mega...";
    programarSalvarEditorMega(500);
  });
}

const atualizarVisualMega = (ativa) => {
  if (textoEstadoMega) {
    textoEstadoMega.textContent = ativa ? "MEGA ATIVA" : "FORMA NORMAL";
    textoEstadoMega.style.color = ativa ? "#269653" : "#7a688e";
  }
  const temConfig = Boolean(megaConfigDoToken(token));
  if (botaoMega) botaoMega.disabled = !temConfig || ativa;
  if (botaoRetirarMega) botaoRetirarMega.disabled = !temConfig || !ativa;
};

const atualizarListaTokensMega = async () => {
  if (!seletorMega) return;
  const valorAnterior = seletorMega.value;
  seletorMega.disabled = true;
  if (botaoAtualizarMega) botaoAtualizarMega.disabled = true;
  try {
    const itens = await OBR.scene.items.getItems(
      (item) =>
        item.type === "IMAGE" &&
        item.layer === "CHARACTER" &&
        item.id !== token.id &&
        String(item.name || "").trim().toLocaleLowerCase("pt-BR").startsWith("mega")
    );
    tokensMegaDisponiveis = [...itens].sort((a, b) =>
      String(a.name || "").localeCompare(String(b.name || ""), "pt-BR", { sensitivity: "base" })
    );
    if (!tokensMegaDisponiveis.length) {
      seletorMega.innerHTML = '<option value="">Nenhum token Mega encontrado na mesa</option>';
      if (mensagemMega) mensagemMega.textContent = "Coloque na mesa um token cujo nome comece com Mega e atualize a lista.";
      return;
    }
    seletorMega.innerHTML = [
      '<option value="">Escolher token da Mega...</option>',
      ...tokensMegaDisponiveis.map((item) =>
        `<option value="${esc(item.id)}">${esc(item.name || "Token sem nome")}</option>`
      )
    ].join("");
    const configAtual = megaConfigDoToken(token);
    const candidato = valorAnterior || configAtual?.referenciaId || "";
    if (candidato && tokensMegaDisponiveis.some((item) => item.id === candidato)) {
      seletorMega.value = candidato;
    }
    if (mensagemMega) mensagemMega.textContent = `${tokensMegaDisponiveis.length} token(s) Mega disponível(is) na mesa.`;
  } catch (erro) {
    console.error("Erro ao listar personagens da mesa para Mega:", erro);
    seletorMega.innerHTML = '<option value="">Erro ao carregar personagens</option>';
    if (mensagemMega) mensagemMega.textContent = "Não foi possível carregar os personagens da mesa.";
  } finally {
    seletorMega.disabled = false;
    if (botaoAtualizarMega) botaoAtualizarMega.disabled = false;
  }
};

if (botaoAtualizarMega) {
  botaoAtualizarMega.addEventListener("click", atualizarListaTokensMega);
}

if (botaoDefinirMega && seletorMega) {
  botaoDefinirMega.addEventListener("click", async () => {
    const idReferencia = seletorMega.value;
    if (!idReferencia) {
      if (mensagemMega) mensagemMega.textContent = "Escolha um personagem da mesa primeiro.";
      return;
    }
    let referencia = tokensMegaDisponiveis.find((item) => item.id === idReferencia);
    if (!referencia) referencia = (await OBR.scene.items.getItems([idReferencia]))[0];
    const nomeReferenciaEhMega = String(referencia?.name || "")
      .trim()
      .toLocaleLowerCase("pt-BR")
      .startsWith("mega");
    if (!referencia || referencia.type !== "IMAGE" || referencia.layer !== "CHARACTER" || !nomeReferenciaEhMega) {
      if (mensagemMega) mensagemMega.textContent = "Esse token não está disponível ou o nome não começa com Mega.";
      await atualizarListaTokensMega();
      return;
    }

    botaoDefinirMega.disabled = true;
    try {
      const configBase = await definirReferenciaMega(token, referencia);
      distribuicaoMegaEdicao.habilidade = campoMegaHabilidade?.value ?? distribuicaoMegaEdicao.habilidade;
      const config = await salvarDistribuicaoMega(token, distribuicaoMegaEdicao);
      if (textoReferenciaMega) {
        textoReferenciaMega.textContent = `Mega definida: ${config.referenciaNome || configBase.referenciaNome || referencia.name || "Personagem"}`;
      }
      distribuicaoMegaEdicao = normalizarDistribuicaoMega(config.distribuicao);
      if (campoMegaHabilidade) campoMegaHabilidade.value = distribuicaoMegaEdicao.habilidade;
      atualizarVisualMega(false);
      atualizarEditorMega();
      if (textoMegaConfigSalva) textoMegaConfigSalva.textContent = "✓ Forma e distribuição Mega salvas.";
      if (mensagemMega) mensagemMega.textContent = "Token da mesa salvo como forma Mega.";
    } catch (erro) {
      console.error("Erro ao definir token da mesa como Mega:", erro);
      if (mensagemMega) mensagemMega.textContent = erro?.message || "Não foi possível definir a forma Mega.";
    } finally {
      botaoDefinirMega.disabled = false;
    }
  });
}

if (botaoMega) {
  botaoMega.addEventListener("click", async () => {
    botaoMega.disabled = true;
    try {
      await ativarMegaEvolucao(token);
      atualizarVisualMega(true);
      if (mensagemMega) mensagemMega.textContent = "Mega Evolução ativada.";
    } catch (erro) {
      console.error("Erro ao ativar Mega Evolução:", erro);
      if (mensagemMega) mensagemMega.textContent = erro?.message || "Não foi possível ativar a Mega.";
      atualizarVisualMega(megaAtivaNoToken(token));
    }
  });
}

if (botaoRetirarMega) {
  botaoRetirarMega.addEventListener("click", async () => {
    botaoRetirarMega.disabled = true;
    try {
      await retirarMegaEvolucao(token);
      atualizarVisualMega(false);
      if (mensagemMega) mensagemMega.textContent = "Evolução retirada. O token original foi restaurado.";
    } catch (erro) {
      console.error("Erro ao retirar Mega Evolução:", erro);
      if (mensagemMega) mensagemMega.textContent = erro?.message || "Não foi possível restaurar o token original.";
      atualizarVisualMega(megaAtivaNoToken(token));
    }
  });
}

atualizarVisualMega(megaAtivaNoToken(token));
atualizarEditorMega();
atualizarListaTokensMega();
}

const CHAVE_COPIA_FICHA_POKEMON = `${PREFIX}/ficha-pokemon-copiada-v1`;
let fichaPokemonCopiadaMemoria = null;
const METADATA_NAO_COPIAR_FICHA_POKEMON = new Set([
  META_INICIATIVA_TRACKER,
  META_TURNO_INICIATIVA,
  META_PAINEL_INICIATIVA,
  META_PAINEL_INICIATIVA_FILHO,
  META_TREINADOR_POKEMONS,
  META_POKEMON_DONO_TREINADOR,
  META_POKEMON_SLOT_TREINADOR,
  META_MEGA_CONFIG,
  META_MEGA_ATIVA,
  `${PREFIX}/statusToken`,
  `${PREFIX}/tipoVisual`,
  `${PREFIX}/debuffId`,
  `${PREFIX}/roll-result`,
  `${PREFIX}/roll-error`
]);

function metadataEhDaFichaPokemon(chave) {
  if (!String(chave || '').startsWith(`${PREFIX}/`)) return false;
  if (METADATA_NAO_COPIAR_FICHA_POKEMON.has(chave)) return false;
  if (String(chave).startsWith(`${PREFIX}/treinador-`)) return false;
  return true;
}

function criarPacoteCopiaFichaPokemon(token) {
  const metadata = {};
  for (const [chave, valor] of Object.entries(token?.metadata || {})) {
    if (!metadataEhDaFichaPokemon(chave)) continue;
    metadata[chave] = clonarDadosSimples(valor);
  }
  metadata[`${PREFIX}/tipoFicha`] = 'pokemon';
  return {
    versao: 1,
    nomeOrigem: String(token?.name || 'Pokémon'),
    copiadoEm: Date.now(),
    metadata
  };
}

function guardarCopiaFichaPokemon(token) {
  const pacote = criarPacoteCopiaFichaPokemon(token);
  fichaPokemonCopiadaMemoria = pacote;
  try { localStorage.setItem(CHAVE_COPIA_FICHA_POKEMON, JSON.stringify(pacote)); } catch (_) {}
  return pacote;
}

function lerCopiaFichaPokemon() {
  if (fichaPokemonCopiadaMemoria?.metadata) return fichaPokemonCopiadaMemoria;
  try {
    const bruto = localStorage.getItem(CHAVE_COPIA_FICHA_POKEMON);
    if (!bruto) return null;
    const pacote = JSON.parse(bruto);
    if (pacote?.metadata && typeof pacote.metadata === 'object') {
      fichaPokemonCopiadaMemoria = pacote;
      return pacote;
    }
  } catch (_) {}
  return null;
}

async function colarCopiaFichaPokemonNoToken(token, pacote) {
  if (!token?.id || !pacote?.metadata) throw new Error('Nenhuma ficha de Pokémon foi copiada.');
  await OBR.scene.items.updateItems([token.id], (items) => {
    for (const item of items) {
      // Limpa somente os dados da ficha antiga. Vínculo com treinador, imagem,
      // posição e configuração visual/Mega do token de evolução são preservados.
      for (const chave of Object.keys(item.metadata || {})) {
        if (metadataEhDaFichaPokemon(chave)) delete item.metadata[chave];
      }
      for (const [chave, valor] of Object.entries(pacote.metadata)) {
        if (!metadataEhDaFichaPokemon(chave) && chave !== `${PREFIX}/tipoFicha`) continue;
        item.metadata[chave] = clonarDadosSimples(valor);
      }
      item.metadata[`${PREFIX}/tipoFicha`] = 'pokemon';
      item.metadata[META_MEGA_ATIVA] = false;
    }
  });

  const atualizado = await pegarTokenAtualizado(token.id);
  if (atualizado) {
    const hpAtual = Number(atualizado.metadata?.[`${PREFIX}/hpAtual`] ?? 100) || 0;
    const hpMax = Math.max(1, Number(atualizado.metadata?.[`${PREFIX}/hpMax`] ?? 100) || 1);
    const caBase = Number(atualizado.metadata?.[`${PREFIX}/ca`] ?? 10) || 0;
    const evasao = Number(atualizado.metadata?.[`${PREFIX}/buff-evas`] ?? 0) || 0;
    await criarStatusNoToken(atualizado, hpAtual, hpMax, caBase + evasao);
  }
  return atualizado || token;
}

function mostrarFichaPokemonPericias( token ) { const app = document.querySelector("#app");
const valoresPericias = {};
PERICIAS.forEach( (grupo) => { grupo.pericias.forEach( (pericia) => { valoresPericias[ pericia.id ] = token.metadata[
`${PREFIX}/pokemon-pericia-${pericia.id}`
] ?? ""; } ); } );
const debuffsAtivos = new Set( STATUS_DEBUFFS .filter( (status) => debuffAtivoNoToken( token, status ) ) .map( (status) => status.id ) );
const htmlDebuffs = STATUS_DEBUFFS .map( (status) => { const ativo = debuffsAtivos.has( status.id );
return `
                      <button
                        type="button"
                        class="botaoDebuffPokemon"
                        data-debuff="${esc(status.id)}"
                        title="Liga/desliga ${esc(status.nome)}"
                        style="
                          width:100%;
                          min-width:0;
                          min-height:31px !important;
                          padding:4px 5px !important;
                          border-radius:8px;
                          font-size:8px;
                          line-height:1.05;
                          font-weight:900;
                          cursor:pointer;
                          white-space:nowrap;
                          overflow:hidden;
                          text-overflow:ellipsis;
                          ${
                              ativo
                                  ? `background:${status.cor} !important;color:#fff !important;border-color:${status.cor} !important;`
                                  : ""
                          }
                        "
                      >
                        ${esc(status.sigla)}
                        ${esc(status.nome)}
                        ${ativo ? " ✓" : ""}
                      </button>
                    `;
} ) .join("");
app.innerHTML = `
      ${ESTILO_FICHA}
      ${cabecalhoPokemon(token, 3)}

      <div style="
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:7px;
        margin-bottom:5px;
      ">
        <h3 style="
          margin:0 !important;
        ">
          Perícias
        </h3>

        <span style="
          font-size:8px;
          font-weight:800;
          color:#8292a6;
        ">
          compacto
        </span>
      </div>

      ${criarPericiasPokemon(
          valoresPericias
      )}

      <h3 style="
        margin-top:9px !important;
        margin-bottom:5px !important;
      ">
        Debuffs
      </h3>

      <div style="
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:5px;
        padding:6px;
        border:1px solid #e4d8f5;
        border-radius:9px;
        background:#fbf8ff;
      ">
        ${htmlDebuffs}
      </div>

      <div style="
        margin-top:5px;
        font-size:8px;
        line-height:1.2;
        color:#7b698f;
        font-weight:700;
        text-align:center;
      ">
        Os ícones ativos aparecem logo abaixo da barra de HP.
      </div>

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

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:8px;">
        <button id="copiarFichaPokemon" type="button" style="min-height:38px!important;padding:7px!important;font-size:9px;font-weight:900;cursor:pointer;">COPIAR FICHA</button>
        <button id="colarFichaPokemon" type="button" style="min-height:38px!important;padding:7px!important;font-size:9px;font-weight:900;cursor:pointer;">COLAR FICHA</button>
      </div>
      <div id="mensagemCopiaFichaPokemon" style="min-height:15px;margin-top:5px;text-align:center;font-size:8px;font-weight:800;color:#6a7f99;">Use isso para passar a ficha para o token de uma evolução.</div>
    `;
ativarCabecalhoPokemon(token);
ativarRolagensPericiasPokemon();
const atualizarHudDebuffs = async () => { const hpAtual = Number( token.metadata[
`${PREFIX}/hpAtual`
] ?? 100 ) || 0;
const hpMax = Math.max( 1, Number( token.metadata[
`${PREFIX}/hpMax`
] ?? 100 ) || 1 );
const caBase = Number( token.metadata[
`${PREFIX}/ca`
] ?? 10 ) || 0;
const evasao = Number( token.metadata[
`${PREFIX}/buff-evas`
] ?? 0 ) || 0;
await criarStatusNoToken( token, hpAtual, hpMax, caBase + evasao ); };
document .querySelectorAll( ".botaoDebuffPokemon" ) .forEach( (botao) => { botao.addEventListener( "click", async () => { const id = botao.dataset.debuff; const status = STATUS_DEBUFFS.find( (item) => item.id === id ); if (!status) { return; } const chave = chaveDebuff(id); const novoEstado = !( token.metadata[ chave ] === true ); token.metadata[ chave ] = novoEstado; if ( status.legacyId ) { delete token.metadata[ chaveDebuff( status.legacyId ) ]; } botao.disabled = true; try { await OBR.scene.items.updateItems( [token.id], (items) => { for ( const item of items ) { item.metadata[ chave ] = novoEstado; if ( status.legacyId ) { delete item.metadata[ chaveDebuff( status.legacyId ) ]; } } } ); if (novoEstado) { botao.textContent =
`${status.sigla} ${status.nome} ✓`;
botao.style.setProperty( "background", status.cor, "important" ); botao.style.setProperty( "color", "#ffffff", "important" ); botao.style.setProperty( "border-color", status.cor, "important" ); } else { botao.textContent =
`${status.sigla} ${status.nome}`;
botao.style.removeProperty( "background" ); botao.style.removeProperty( "color" ); botao.style.removeProperty( "border-color" ); } await atualizarHudDebuffs(); } catch (erro) { console.error(
`Erro ao alternar ${status.nome}:`,
erro ); } finally { botao.disabled = false; } } ); } );
const salvarPericiasPokemonDaTela = async () => {
  const novasPericias = {};
  PERICIAS.forEach((grupo) => {
    grupo.pericias.forEach((pericia) => {
      novasPericias[pericia.id] = document.querySelector(`#pokemon-pericia-${pericia.id}`)?.value?.trim() || '';
    });
  });
  await OBR.scene.items.updateItems([token.id], (items) => {
    for (const item of items) {
      PERICIAS.forEach((grupo) => {
        grupo.pericias.forEach((pericia) => {
          item.metadata[`${PREFIX}/pokemon-pericia-${pericia.id}`] = novasPericias[pericia.id];
        });
      });
    }
  });
};

document.querySelector('#salvarPokemonPericias')?.addEventListener('click', async () => {
  await salvarPericiasPokemonDaTela();
  const mensagem = document.querySelector('#mensagemCopiaFichaPokemon');
  if (mensagem) mensagem.textContent = '✓ Perícias salvas.';
});

document.querySelector('#copiarFichaPokemon')?.addEventListener('click', async () => {
  const mensagem = document.querySelector('#mensagemCopiaFichaPokemon');
  try {
    await salvarPericiasPokemonDaTela();
    const atualizado = await pegarTokenAtualizado(token.id) || token;
    const pacote = guardarCopiaFichaPokemon(atualizado);
    if (mensagem) mensagem.textContent = `✓ Ficha de ${pacote.nomeOrigem} copiada.`;
  } catch (erro) {
    console.error('Erro ao copiar ficha do Pokémon:', erro);
    if (mensagem) mensagem.textContent = erro?.message || 'Não foi possível copiar a ficha.';
  }
});

document.querySelector('#colarFichaPokemon')?.addEventListener('click', async () => {
  const mensagem = document.querySelector('#mensagemCopiaFichaPokemon');
  const pacote = lerCopiaFichaPokemon();
  if (!pacote) {
    if (mensagem) mensagem.textContent = 'Nenhuma ficha foi copiada ainda.';
    return;
  }
  if (!confirm(`Colar a ficha de ${pacote.nomeOrigem || 'Pokémon'} neste token? Os dados atuais da ficha serão substituídos.`)) return;
  try {
    const atualizado = await colarCopiaFichaPokemonNoToken(token, pacote);
    mostrarFichaPokemonPericias(atualizado);
    const mensagemNova = document.querySelector('#mensagemCopiaFichaPokemon');
    if (mensagemNova) mensagemNova.textContent = `✓ Ficha de ${pacote.nomeOrigem || 'Pokémon'} colada neste token.`;
  } catch (erro) {
    console.error('Erro ao colar ficha do Pokémon:', erro);
    if (mensagem) mensagem.textContent = erro?.message || 'Não foi possível colar a ficha.';
  }
});
}
function mostrarFichaPokemonTalentos( token ) { const app = document.querySelector("#app");
const talentos = [];
for ( let i = 1; i <= 5; i++ ) { talentos.push({ titulo: token.metadata[
`${PREFIX}/pokemon-talento-${i}-titulo`
] ?? "", descricao: token.metadata[
`${PREFIX}/pokemon-talento-${i}-descricao`
] ?? "" }); }
let htmlTalentos = "";
talentos.forEach( (talento, index) => { const numero = index + 1;
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
} );
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
document .querySelector( "#salvarPokemonTalentos" ) .addEventListener( "click", async () => { const novosTalentos = []; for ( let i = 1; i <= 5; i++ ) { novosTalentos.push({ titulo: document .querySelector(
`#pokemonTalento${i}Titulo`
) .value .trim(), descricao: document .querySelector(
`#pokemonTalento${i}Descricao`
) .value .trim() }); } await OBR.scene.items.updateItems( [token.id], (items) => { for ( const item of items ) { novosTalentos.forEach( ( talento, index ) => { const numero = index + 1; item.metadata[
`${PREFIX}/pokemon-talento-${numero}-titulo`
] = talento.titulo; item.metadata[
`${PREFIX}/pokemon-talento-${numero}-descricao`
] = talento.descricao; } ); } } ); } ); }
async function mostrarTokenSelecionado() { const selection = await OBR.player.getSelection();
if ( !selection || selection.length === 0 ) { return; }
const items = await OBR.scene.items.getItems( selection );
if ( !items || items.length === 0 ) { return; }
const token = items[0];
if (token.metadata?.[META_PAINEL_INICIATIVA] === true || token.metadata?.[META_PAINEL_INICIATIVA_FILHO]) { return; }
const tipoFicha = token.metadata[
`${PREFIX}/tipoFicha`
];
try { if ( tipoFicha === "pokemon" ) { mostrarFichaPokemon( token );
return; }
if ( tipoFicha === "treinador" ) { mostrarFichaTreinadorPagina1( token );
return; }
mostrarEscolhaFicha( token ); } catch (erro) { console.error( "Erro ao abrir a ficha:", erro );
const app = document.querySelector("#app");
if (app) {
app.innerHTML = `
              ${ESTILO_FICHA}
              <div style="
                padding:14px;
                border:1px solid #e7b1b1;
                border-radius:10px;
                background:#fff5f5;
                color:#8a2929;
                font-size:12px;
                line-height:1.35;
              ">
                <strong>
                  A ficha encontrou um erro.
                </strong>
                <div style="
                  margin-top:6px;
                  color:#555;
                  word-break:break-word;
                ">
                  ${esc(
                      erro?.message ||
                      String(erro)
                  )}
                </div>
              </div>
            `;
} } }
OBR.onReady( async () => { if (MODO_APRESENTADOR_INICIATIVA) { await iniciarApresentadorIniciativa(); return; } await limparPainelIniciativaMovelAntigo(); try { await corrigirHudExistente(); } catch (erro) { console.warn( "Não foi possível normalizar o HUD existente:", erro ); } const app = document.querySelector("#app"); if (app) { const observerAutosave = new MutationObserver( () => ativarAutosaveDaTela() ); observerAutosave.observe( app, { childList: true, subtree: true } ); } await mostrarTokenSelecionado(); ativarAutosaveDaTela(); agendarSincronizacaoRosterEmCampo(); OBR.scene.items.onChange(() => agendarSincronizacaoRosterEmCampo()); OBR.player.onChange( async () => { await mostrarTokenSelecionado(); } ); } );
// FIM
