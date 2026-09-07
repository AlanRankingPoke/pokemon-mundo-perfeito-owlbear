import OBR, { buildShape, buildText } from "@owlbear-rodeo/sdk";
import "./style.css";

const PREFIX = "pokemon-mundo-perfeito";

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

async function pegarHpCaDaTela() {
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

  if (alterarHp !== "") {
    const operador =
      alterarHp.charAt(0);

    const valor =
      Number(
        alterarHp.substring(1)
      );

    if (Number.isNaN(valor)) {
      alert(
        "Alteração de HP inválida."
      );

      return null;
    }

    if (operador === "+") {
      hpAtual += valor;
    }

    else if (operador === "-") {
      hpAtual -= valor;
    }

    else if (operador === "=") {
      hpAtual = valor;
    }

    else {
      alert(
        "Use -34, +20 ou =50."
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
    ca
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

function ativarRolagensSalvaguarda() {
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

            const formula =
              formulaSalvaguarda(
                campo?.value
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

function ativarRolagemIniciativa() {
  const botao =
    document.querySelector(
      "#rolarIniciativa"
    );

  if (!botao) {
    return;
  }

  botao.addEventListener(
    "click",
    async () => {
      const campo =
        document.querySelector(
          "#iniciativa"
        );

      const formula =
        formulaSalvaguarda(
          campo?.value
        );

      if (!formula) {
        alert(
          "Valor de iniciativa inválido."
        );

        return;
      }

      await rolarNoDicePlus(
        formula,
        "Iniciativa"
      );
    }
  );
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
                value="${esc(
                  valores[pericia.id]
                )}"
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

        mostrarFichaPokemon(
          token
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
    <div style="
      display:flex;
      gap:6px;
      margin-bottom:15px;
    ">

      <button
        id="paginaTreinador1"
        style="
          flex:1;
          padding:8px;
          font-weight:bold;
          cursor:pointer;
          opacity:${
            paginaAtual === 1
              ? "1"
              : "0.65"
          };
        "
      >
        STATUS / PERÍCIAS
      </button>

      <button
        id="paginaTreinador2"
        style="
          flex:1;
          padding:8px;
          font-weight:bold;
          cursor:pointer;
          opacity:${
            paginaAtual === 2
              ? "1"
              : "0.65"
          };
        "
      >
        EXTRA
      </button>

    </div>
  `;
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
      () =>
        mostrarFichaTreinadorPagina1(
          token
        )
    );

  document
    .querySelector(
      "#paginaTreinador2"
    )
    .addEventListener(
      "click",
      () =>
        mostrarFichaTreinadorExtra(
          token
        )
    );
}

// =====================================================
// TREINADOR — PÁGINA 1
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

  const iniciativa =
    token.metadata[
      `${PREFIX}/treinador-iniciativa`
    ] ?? "";

  const proficiencia =
    token.metadata[
      `${PREFIX}/treinador-proficiencia`
    ] ?? 0;

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

  const valoresPericias = {};

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

  app.innerHTML = `
    <div style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:8px;
    ">

      <h2>
        👤 ${esc(
          token.name ||
          "Treinador"
        )}
      </h2>

      <button
        id="trocarTipo"
        style="
          font-size:11px;
          cursor:pointer;
        "
      >
        Trocar tipo
      </button>

    </div>

    ${menuTreinador(1)}

    <p>HP Atual</p>

    <input
      id="hpAtual"
      type="number"
      value="${hpAtual}"
    >

    <p>HP Máximo</p>

    <input
      id="hpMax"
      type="number"
      value="${hpMax}"
    >

    <p>Alterar HP</p>

    <input
      id="alterarHp"
      type="text"
      placeholder="-34, +20 ou =50"
    >

    <p>CA</p>

    <input
      id="ca"
      type="number"
      value="${ca}"
    >

    <div style="
      margin-top:12px;
    ">
      <div style="
        font-weight:bold;
        margin-bottom:6px;
      ">
        Iniciativa
      </div>

      <div style="
        display:flex;
        gap:8px;
        align-items:center;
      ">
        <input
          id="iniciativa"
          type="text"
          value="${esc(iniciativa)}"
          placeholder="+0"
          style="
            width:90px;
            box-sizing:border-box;
            text-align:center;
          "
        >

        <button
          id="rolarIniciativa"
          type="button"
          style="
            flex:1;
            padding:7px;
            font-weight:bold;
            cursor:pointer;
          "
        >
          🎲 Iniciativa
        </button>
      </div>
    </div>

    <hr>

    <h3>
      Proficiência
    </h3>

    <input
      id="treinadorProficiencia"
      type="number"
      min="0"
      step="1"
      value="${proficiencia}"
      style="
        width:80px;
        text-align:center;
        padding:6px;
      "
    >

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

    <hr>

    <h3>
      Perícias
    </h3>

    ${criarPericias(
      valoresPericias
    )}

    <br>

    <button
      id="salvarTreinador"
      style="
        width:100%;
        padding:10px;
        font-weight:bold;
        cursor:pointer;
      "
    >
      Salvar Treinador
    </button>
  `;

  ativarMenuTreinador(
    token
  );

  ativarRolagensSalvaguarda();
  ativarRolagemIniciativa();

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

  document
    .querySelector(
      "#salvarTreinador"
    )
    .addEventListener(
      "click",
      async () => {

        const dados =
          await pegarHpCaDaTela();

        if (!dados) {
          return;
        }

        const novaIniciativa =
          document
            .querySelector(
              "#iniciativa"
            )
            .value
            .trim();

        const novaProficiencia =
          Number(
            document
              .querySelector(
                "#treinadorProficiencia"
              )
              .value
          ) || 0;

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

        const novasPericias =
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
                `${PREFIX}/treinador-iniciativa`
              ] =
                novaIniciativa;

              item.metadata[
                `${PREFIX}/treinador-proficiencia`
              ] =
                novaProficiencia;

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

        document
          .querySelector(
            "#alterarHp"
          )
          .value = "";

        await criarStatusNoToken(
          token,
          dados.hpAtual,
          dados.hpMax,
          dados.ca
        );

        alert(
          "Treinador salvo!"
        );
      }
    );
}

// =====================================================
// TREINADOR — EXTRA
// =====================================================

function mostrarFichaTreinadorExtra(
  token
) {
  const app =
    document.querySelector(
      "#app"
    );

  const especializacoes = {};
  const habilidades = {};
  const talentos = {};
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
    i <= 5;
    i++
  ) {
    talentos[i] =
      token.metadata[
        `${PREFIX}/talento-${i}`
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
    <div style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:8px;
    ">

      <h2>
        👤 ${esc(
          token.name ||
          "Treinador"
        )}
      </h2>

      <button
        id="trocarTipo"
        style="
          font-size:11px;
          cursor:pointer;
        "
      >
        Trocar tipo
      </button>

    </div>

    ${menuTreinador(2)}

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

    <hr>

    <h3>
      🎲 Rolagens 1d6
    </h3>

    ${htmlRolagens}

    <br>

    <button
      id="salvarExtra"
      style="
        width:100%;
        padding:10px;
        font-weight:bold;
        cursor:pointer;
      "
    >
      Salvar Extra
    </button>
  `;

  ativarMenuTreinador(
    token
  );

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
      "#salvarExtra"
    )
    .addEventListener(
      "click",
      async () => {

        const novasEspecializacoes =
          {};

        const novasHabilidades =
          {};

        const novosTalentos =
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

        alert(
          "Extra do treinador salvo!"
        );
      }
    );
}

// =====================================================
// FICHA POKÉMON — MENU
// =====================================================

function menuPokemon(paginaAtual) {
  return `
    <div style="
      display:flex;
      gap:6px;
      margin-bottom:15px;
    ">
      <button
        id="paginaPokemon1"
        style="
          flex:1;
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
          padding:8px 4px;
          font-size:11px;
          font-weight:bold;
          cursor:pointer;
          opacity:${paginaAtual === 3 ? "1" : "0.65"};
        "
      >
        PERÍCIAS
      </button>
    </div>
  `;
}

function ativarMenuPokemon(token) {
  document
    .querySelector("#paginaPokemon1")
    .addEventListener(
      "click",
      () => mostrarFichaPokemon(token)
    );

  document
    .querySelector("#paginaPokemon2")
    .addEventListener(
      "click",
      () => mostrarFichaPokemonMoves(token)
    );

  document
    .querySelector("#paginaPokemon3")
    .addEventListener(
      "click",
      () => mostrarFichaPokemonPericias(token)
    );
}

function cabecalhoPokemon(token, paginaAtual) {
  return `
    <div style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:8px;
    ">
      <h2>
        🐾 ${esc(token.name || "Pokemon")}
      </h2>

      <button
        id="trocarTipo"
        style="
          font-size:11px;
          cursor:pointer;
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
      () => trocarTipoFicha(token)
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
    .querySelectorAll(".rolarPericiaPokemon")
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

  const iniciativa =
    token.metadata[
      `${PREFIX}/iniciativa`
    ] ?? "";

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

  app.innerHTML = `
    ${cabecalhoPokemon(token, 1)}

    <div style="
      display:flex;
      gap:12px;
      align-items:flex-start;
      flex-wrap:wrap;
    ">
      <div style="
        flex:1;
        min-width:120px;
      ">
        <p>HP Atual</p>

        <input
          id="hpAtual"
          type="number"
          value="${hpAtual}"
          style="
            width:100%;
            box-sizing:border-box;
          "
        >

        <p>HP Máximo</p>

        <input
          id="hpMax"
          type="number"
          value="${hpMax}"
          style="
            width:100%;
            box-sizing:border-box;
          "
        >

        <p>Alterar HP</p>

        <input
          id="alterarHp"
          type="text"
          placeholder="-34, +20 ou =50"
          style="
            width:100%;
            box-sizing:border-box;
          "
        >

        <p>CA</p>

        <input
          id="ca"
          type="number"
          value="${ca}"
          style="
            width:100%;
            box-sizing:border-box;
          "
        >

        <div style="
          margin-top:12px;
        ">
          <div style="
            font-weight:bold;
            margin-bottom:6px;
          ">
            Iniciativa
          </div>

          <div style="
            display:flex;
            gap:6px;
            align-items:center;
          ">
            <input
              id="iniciativa"
              type="text"
              value="${esc(iniciativa)}"
              placeholder="+0"
              style="
                width:70px;
                box-sizing:border-box;
                text-align:center;
              "
            >

            <button
              id="rolarIniciativa"
              type="button"
              style="
                flex:1;
                padding:7px 5px;
                font-size:11px;
                font-weight:bold;
                cursor:pointer;
              "
            >
              🎲 Iniciativa
            </button>
          </div>
        </div>
      </div>

      <div style="
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

        <div style="
          margin-top:10px;
          display:flex;
          align-items:center;
          gap:8px;
        ">
          <span style="
            font-size:12px;
            font-weight:bold;
          ">
            Proficiência
          </span>

          <input
            id="proficiencia"
            type="number"
            min="0"
            step="1"
            value="${proficiencia}"
            style="
              width:55px;
              height:28px;
              box-sizing:border-box;
              text-align:center;
              font-size:13px;
            "
          >
        </div>
      </div>
    </div>

    <hr>

    <h3>Movimentação</h3>

    <div style="
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
  ativarRolagensSalvaguarda();
  ativarRolagemIniciativa();

  document
    .querySelector("#salvarPokemonStatus")
    .addEventListener(
      "click",
      async () => {
        const dados =
          await pegarHpCaDaTela();

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

        const novaIniciativa =
          document
            .querySelector("#iniciativa")
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
              ] = dados.hpAtual;

              item.metadata[
                `${PREFIX}/hpMax`
              ] = dados.hpMax;

              item.metadata[
                `${PREFIX}/ca`
              ] = dados.ca;

              item.metadata[
                `${PREFIX}/iniciativa`
              ] = novaIniciativa;

              item.metadata[
                `${PREFIX}/pokemon-habilidade`
              ] = novaHabilidade;

              item.metadata[
                `${PREFIX}/movimento1`
              ] = mov1;

              item.metadata[
                `${PREFIX}/movimento2`
              ] = mov2;

              item.metadata[
                `${PREFIX}/movimento3`
              ] = mov3;

              item.metadata[
                `${PREFIX}/proficiencia`
              ] = novaProficiencia;

              ATRIBUTOS.forEach(
                (atributo) => {
                  item.metadata[
                    `${PREFIX}/mod-${atributo}`
                  ] =
                    novosModificadores[atributo];

                  item.metadata[
                    `${PREFIX}/save-${atributo}`
                  ] =
                    novasSalvaguardas[atributo];
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

        document
          .querySelector("#alterarHp")
          .value = "";

        await criarStatusNoToken(
          token,
          dados.hpAtual,
          dados.hpMax,
          dados.ca
        );

        alert(
          "Status do Pokémon salvo!"
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

  for (let i = 1; i <= 5; i++) {
    golpes.push({
      nome:
        token.metadata[
          `${PREFIX}/golpe${i}Nome`
        ] ?? "",

      acerto:
        token.metadata[
          `${PREFIX}/golpe${i}Acerto`
        ] ?? "",

      dano:
        token.metadata[
          `${PREFIX}/golpe${i}Dano`
        ] ?? "",

      categoria:
        token.metadata[
          `${PREFIX}/golpe${i}Categoria`
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
                margin-bottom:8px;
              "
            >

            <input
              id="golpe${numero}Categoria"
              type="hidden"
              value="${esc(golpe.categoria)}"
            >

            <div style="display:flex; gap:6px; margin-bottom:10px;">
              <button
                type="button"
                class="categoriaGolpe"
                data-golpe="${numero}"
                data-categoria="fisico"
                style="flex:1; padding:6px; cursor:pointer; opacity:${golpe.categoria === "fisico" ? "1" : "0.55"}; border:${golpe.categoria === "fisico" ? "2px solid #FFFFFF" : "1px solid #666"};"
              >
                FÍSICO
              </button>

              <button
                type="button"
                class="categoriaGolpe"
                data-golpe="${numero}"
                data-categoria="especial"
                style="flex:1; padding:6px; cursor:pointer; opacity:${golpe.categoria === "especial" ? "1" : "0.55"}; border:${golpe.categoria === "especial" ? "2px solid #FFFFFF" : "1px solid #666"};"
              >
                ESPECIAL
              </button>
            </div>

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
        const estagio =
          Number(
            document
              .querySelector(
                `#buff-${buff.id}`
              )
              .value
          ) || 0;

        const campoBonus =
          document.querySelector(
            `#bonus-${buff.id}`
          );

        if (buff.id === "crit") {
          campoBonus.textContent =
            faixaCritico(estagio);
        } else {
          campoBonus.textContent =
            formatarBonus(
              proficiencia * estagio
            );
        }
      }
    );
  }

  document
    .querySelectorAll(".campoBuff")
    .forEach(
      (campo) => {
        campo.addEventListener(
          "input",
          atualizarBuffsPagina
        );
      }
    );

  document
    .querySelectorAll(".categoriaGolpe")
    .forEach(
      (botao) => {
        botao.addEventListener(
          "click",
          () => {
            const numero = botao.dataset.golpe;
            const categoria = botao.dataset.categoria;

            document
              .querySelector(`#golpe${numero}Categoria`)
              .value = categoria;

            document
              .querySelectorAll(`.categoriaGolpe[data-golpe="${numero}"]`)
              .forEach((opcao) => {
                const ativo = opcao.dataset.categoria === categoria;
                opcao.style.opacity = ativo ? "1" : "0.55";
                opcao.style.border = ativo
                  ? "2px solid #FFFFFF"
                  : "1px solid #666";
              });
          }
        );
      }
    );

  document
    .querySelectorAll(".rolarAcerto")
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
                .value;

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

  function calcularBonusDano(numero) {
    const categoria =
      document
        .querySelector(`#golpe${numero}Categoria`)
        .value;

    if (!categoria) {
      return { erro: "Escolha se o golpe é FÍSICO ou ESPECIAL antes de rolar o dano." };
    }

    const idBuff =
      categoria === "fisico"
        ? "atq"
        : "atqsp";

    const estagio =
      Number(
        document
          .querySelector(`#buff-${idBuff}`)
          ?.value
      ) || 0;

    return { bonus: estagio * proficiencia };
  }

  document
    .querySelectorAll(".rolarDano")
    .forEach(
      (botao) => {
        botao.addEventListener(
          "click",
          async () => {
            const numero = botao.dataset.golpe;
            const nome =
              document
                .querySelector(`#golpe${numero}Nome`)
                .value;

            const formulaOriginal =
              document
                .querySelector(`#golpe${numero}Dano`)
                .value
                .trim();

            if (!formulaOriginal) {
              alert("A fórmula de dano está vazia.");
              return;
            }

            const resultadoBuff =
              calcularBonusDano(numero);

            if (resultadoBuff.erro) {
              alert(resultadoBuff.erro);
              return;
            }

            const formulaFinal =
              adicionarBonusNaFormula(
                formulaOriginal,
                resultadoBuff.bonus
              );

            await rolarNoDicePlus(
              formulaFinal,
              nome || `Golpe ${numero}`,
              "Dano"
            );
          }
        );
      }
    );

  document
    .querySelectorAll(".rolarCritico")
    .forEach(
      (botao) => {
        botao.addEventListener(
          "click",
          async () => {
            const numero = botao.dataset.golpe;
            const nome =
              document
                .querySelector(`#golpe${numero}Nome`)
                .value;

            const formulaOriginal =
              document
                .querySelector(`#golpe${numero}Dano`)
                .value
                .trim();

            if (!formulaOriginal) {
              alert("A fórmula de dano está vazia.");
              return;
            }

            const resultadoBuff =
              calcularBonusDano(numero);

            if (resultadoBuff.erro) {
              alert(resultadoBuff.erro);
              return;
            }

            const formulaCritica =
              duplicarDadosFormula(formulaOriginal);

            const formulaFinal =
              adicionarBonusNaFormula(
                formulaCritica,
                resultadoBuff.bonus
              );

            await rolarNoDicePlus(
              formulaFinal,
              nome || `Golpe ${numero}`,
              "Crítico"
            );
          }
        );
      }
    );

  document
    .querySelector("#salvarPokemonMoves")
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

        for (let i = 1; i <= 5; i++) {
          novosGolpes.push({
            nome:
              document
                .querySelector(
                  `#golpe${i}Nome`
                )
                .value
                .trim(),

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
                .trim(),

            categoria:
              document
                .querySelector(
                  `#golpe${i}Categoria`
                )
                .value
          });
        }

        await OBR.scene.items.updateItems(
          [token.id],
          (items) => {
            for (const item of items) {
              BUFFS.forEach(
                (buff) => {
                  item.metadata[
                    `${PREFIX}/buff-${buff.id}`
                  ] =
                    novosBuffs[buff.id];
                }
              );

              novosGolpes.forEach(
                (golpe, index) => {
                  const numero =
                    index + 1;

                  item.metadata[
                    `${PREFIX}/golpe${numero}Nome`
                  ] =
                    golpe.nome;

                  item.metadata[
                    `${PREFIX}/golpe${numero}Acerto`
                  ] =
                    golpe.acerto;

                  item.metadata[
                    `${PREFIX}/golpe${numero}Dano`
                  ] =
                    golpe.dano;

                  item.metadata[
                    `${PREFIX}/golpe${numero}Categoria`
                  ] =
                    golpe.categoria;
                }
              );
            }
          }
        );

        alert(
          "Moves e buffs salvos!"
        );
      }
    );
}

// =====================================================
// POKÉMON — ABA 3: PERÍCIAS
// =====================================================

function mostrarFichaPokemonPericias(token) {
  const app =
    document.querySelector("#app");

  const valoresPericias = {};

  PERICIAS.forEach(
    (grupo) => {
      grupo.pericias.forEach(
        (pericia) => {
          valoresPericias[pericia.id] =
            token.metadata[
              `${PREFIX}/pokemon-pericia-${pericia.id}`
            ] ?? "";
        }
      );
    }
  );

  app.innerHTML = `
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
    .querySelector("#salvarPokemonPericias")
    .addEventListener(
      "click",
      async () => {
        const novasPericias = {};

        PERICIAS.forEach(
          (grupo) => {
            grupo.pericias.forEach(
              (pericia) => {
                novasPericias[pericia.id] =
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
            for (const item of items) {
              PERICIAS.forEach(
                (grupo) => {
                  grupo.pericias.forEach(
                    (pericia) => {
                      item.metadata[
                        `${PREFIX}/pokemon-pericia-${pericia.id}`
                      ] =
                        novasPericias[pericia.id];
                    }
                  );
                }
              );
            }
          }
        );

        alert(
          "Perícias do Pokémon salvas!"
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

    // Corrige automaticamente HUDs criados por versões anteriores:
    // remove duplicatas e impede que Flip/rotação do token deforme HP/CA.
    try {
      await corrigirHudExistente();
    }
    catch (erro) {
      console.warn(
        "Não foi possível normalizar o HUD existente:",
        erro
      );
    }

    await mostrarTokenSelecionado();

    OBR.player.onChange(
      async () => {

        await mostrarTokenSelecionado();

      }
    );
  }
);
