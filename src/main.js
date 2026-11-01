<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Haikyuu!! Road to the Top — 0.26</title>
<link rel="icon" type="image/png" href="./Icon.png">
<style>
:root{font:14px system-ui,-apple-system,"Segoe UI",sans-serif;color:#f5f7fc;background:#141b28;color-scheme:dark}
*{box-sizing:border-box}body{margin:0}button,input,select{font:inherit}button{cursor:pointer}button:disabled,input:disabled,select:disabled{opacity:.52;cursor:not-allowed}
header{background:linear-gradient(120deg,#354055,#171e2b);border-bottom:2px solid #ffac42;padding:14px 15px;position:sticky;top:0;z-index:5}
.top{display:flex;justify-content:space-between;align-items:center;gap:8px}.top strong{font-size:17px}.top small{display:block;font-size:10px;letter-spacing:.12em;color:#ffcb8f;font-weight:800}
main{padding:13px}.card{padding:14px;margin-bottom:12px;border:1px solid #42516a;border-radius:13px;background:#202c3c}h2{margin:0 0 10px;font-size:17px}p{line-height:1.5}.small{font-size:12px;color:#beccda}.kicker{font-size:10px;color:#ffba70;font-weight:900;letter-spacing:.11em;margin:0 0 8px;text-transform:uppercase}
button{border:1px solid #5c7087;background:#354358;color:white;border-radius:8px;padding:10px;font-weight:750}button:hover:not(:disabled){border-color:#ffbd6b}
.primary{background:#fcb04b;border-color:#ffcb84;color:#212738}.blue{background:#35c8e7;border-color:#7fe7fa;color:#0e2937}.wide{width:100%}
.controls{display:grid;gap:9px}.controls button{text-align:left;padding:13px}/* O seletor de tipo fica discreto no FIM da ficha, sem ocupar o cabeçalho. */
.sheet-type-footer{display:flex;justify-content:center;margin:14px 0 3px}
.sheet-type-footer .switch{width:auto;max-width:100%;padding:6px 12px;font-size:11px;font-weight:650;background:#27374b;color:#bcd1e3;border:1px solid #435670;border-radius:8px}
.sheet-type-footer .switch:hover{background:#34485f;color:white}
.field{display:block;font-size:12px;font-weight:800;margin:10px 0}.field input,.field select{display:block;width:100%;margin-top:7px}
input,select{border:1px solid #566982;background:#111c2b;color:white;border-radius:8px;padding:9px;outline:none}input:focus,select:focus{border-color:#ffbe72}
.attr{display:grid;grid-template-columns:minmax(0,1fr) 67px 76px;align-items:center;gap:7px;border-bottom:1px solid #34465a;padding:7px 0}.attr:last-child{border:0}.attr label{font-size:12px;font-weight:800}.attr input{width:100%;text-align:center}.attr button{background:#fcb04b;color:#20283b;border:0;font-size:12px;padding:10px 2px}
.notice{padding:10px;border-radius:9px;background:#215044;color:#e2f7ed;font-size:12px;line-height:1.45;margin-bottom:12px}.notice.error{background:#65343b;color:#ffe1e1}.notice.warn{background:#614927;color:#ffefc5}
.serve{background:#213c4b;border-color:#3a99ba}.stat{display:flex;justify-content:space-between;gap:10px;border-bottom:1px solid #354356;padding:8px 0}.radio{display:block;background:#152337;border:1px solid #465b75;border-radius:9px;padding:11px;margin:8px 0;font-size:12px;cursor:pointer}.radio input{width:auto;margin-right:7px}
footer{text-align:center;font-size:10px;color:#859ab2;margin:18px 0}
.setup{border-color:#b17a35;background:#302b2b}.profile-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 10px}.profile-grid .field{min-width:0}
.field-hint{display:block;font-weight:400;font-size:11px;color:#9eb2c6;margin:5px 0}.preset{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin:10px 0}.preset span{border:1px solid #4e6074;border-radius:8px;padding:9px 3px;text-align:center;font-size:11px}.preset b{display:block;font-size:16px;color:#ffca84;margin-top:4px}
.save-indicator{font-size:11px;min-height:16px;text-align:right;color:#95d9bd;margin:8px 0}.save-indicator.error{color:#ffc1c1}.tip{font-size:11px;color:#c4b9a7}
.section-heading{display:flex;justify-content:space-between;align-items:center;gap:8px}.section-heading .pill{font-size:10px;color:#ffc37f}


/* Montando seu Jogador: distribuição com limite e resumo claro */
.creation-steps{display:flex;gap:6px;margin:10px 0 15px}
.creation-steps span{flex:1;text-align:center;border:1px solid #6c583c;border-radius:8px;padding:7px 3px;font-size:10px;color:#ffe0ad;background:#413427}
.points-summary{display:flex;align-items:center;justify-content:space-between;gap:10px;background:#142a36;border:1px solid #447b8c;border-radius:10px;padding:12px;margin:10px 0}
.points-summary strong{font-size:25px;color:#7ce7f6}.points-summary small{font-size:11px;color:#bdcedd;display:block}
.bonus-head,.bonus-line{display:grid;grid-template-columns:minmax(0,1fr) 34px 36px 36px 34px;gap:5px;align-items:center}
.bonus-head{font-size:10px;text-transform:uppercase;letter-spacing:.025em;color:#a5c0d3;padding:7px 0;border-bottom:1px solid #475469}
.bonus-line{padding:9px 0;border-bottom:1px solid #3e4b5f}
.bonus-line .attr-name{font-size:12px;font-weight:750;overflow-wrap:anywhere}
.bonus-line .value{text-align:center;font-size:12px;color:#c7d9e7}
.bonus-line .sum{font-size:15px;color:#ffe1a7;font-weight:850;text-align:center}
.bonus-line button{font-size:18px;padding:5px 0;border-radius:7px;background:#34445a;border-color:#69839b}
.bonus-line button.plus{background:#2c6776;border-color:#67d9e7}
.bonus-line button:disabled{opacity:.28}
.bonus-guide{font-size:11px;color:#ccd2dc;margin:10px 0}
.profile-summary{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}
.profile-summary .item{padding:10px;background:#172336;border:1px solid #3d536a;border-radius:9px}
.profile-summary .item small{display:block;font-size:10px;color:#a7bcd1}
.profile-summary .item b{display:block;font-size:13px;margin-top:4px}
 .pill-ok{font-size:11px;color:#7ce7b6;font-weight:850}
.serve-list{display:grid;gap:9px;margin:10px 0}
.serve-option{display:flex;align-items:center;justify-content:space-between;gap:12px;text-align:left;border:1px solid #4e90a5;background:#1c4050;padding:12px}
.serve-option span{display:block;font-size:13px}.serve-option small{display:block;font-weight:500;font-size:11px;color:#c5dbe4;margin-top:5px;line-height:1.35}
.serve-option b{white-space:nowrap;color:#9ef0ff}.warn-text{color:#ffe5ac}.scoreboard{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:9px 0}
.scoreboard div{border:1px solid #516178;background:#172737;padding:12px;border-radius:10px;text-align:center}
.scoreboard strong{display:block;font-size:26px;color:#f8d699}.reception-card{border-color:#71c5a5;background:#183d39}

.pass-result{padding:12px 14px;margin-bottom:12px;border-radius:12px;border:2px solid #64bfb2;background:#143831;box-shadow:0 2px 8px #0003}
.pass-result strong{display:block;font-size:20px;letter-spacing:.045em;color:#b5fbe3}
.pass-result small{display:block;font-size:12px;margin-top:5px;color:#dbf5eb;line-height:1.45}
.pass-result.result-c{border-color:#e8b250;background:#453921}.pass-result.result-c strong{color:#ffe2a1}
.pass-result.result-d,.pass-result.result-ace{border-color:#f37b88;background:#532631}
.pass-result.result-d strong,.pass-result.result-ace strong{color:#ffd3d9}
/* Status: 2 atributos por linha, responsivo e com botões pequenos. */
.attributes-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:9px 0}
.attributes-grid .attr{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px;align-items:center;min-width:0;margin:0;padding:9px 8px;border:1px solid #39516b;border-radius:9px;background:#172536}
.attributes-grid .attr:last-child{border:1px solid #39516b}
.attributes-grid .attr label{grid-column:1/-1;font-size:11px;white-space:normal;line-height:1.2}
.attributes-grid .attr input{width:100%;min-width:0;padding:7px 3px;text-align:center;font-size:15px}
.attributes-grid .attr strong{min-width:0;text-align:center}
.attributes-grid .attr button{font-size:10px;line-height:1.15;padding:9px 4px;min-width:52px;max-width:68px;white-space:nowrap}
@media(max-width:320px){.attributes-grid{gap:5px}.attributes-grid .attr{padding:7px 5px;gap:4px}.attributes-grid .attr button{min-width:45px;font-size:9px}}
.gm-restart{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}
.gm-restart button{font-size:12px;padding:10px 6px}

/* v0.25 — Abas da ficha preservadas: status e saque/recepção. */
.game-tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin:0 0 12px}
.game-tabs.three{grid-template-columns:repeat(3,minmax(0,1fr))}
.game-tabs.three button{font-size:11px;padding:10px 3px}
.game-tabs button{padding:11px 7px;font-size:12px;background:#273c54;color:#cbd8e9;border:1px solid #48627c;border-radius:9px;min-width:0;line-height:1.25}
.game-tabs button[aria-selected="true"]{background:#f4ad4c;color:#1b2a3d;border-color:#ffd18c;font-weight:900}
.game-tabs button:not([aria-selected="true"]):hover{background:#38516e}
.game-tab-panel{min-width:0}
</style></head>
<body><div id="app"><main><div class="card">🏐 Conectando ao Owlbear Rodeo...</div></main></div>
<script type="module">
import OBR, {buildShape} from "https://esm.sh/@owlbear-rodeo/sdk@3.1.0?bundle";

// ================================================================
// HAIKYUU!! ROAD TO THE TOP v0.25 — ARQUIVO PRINCIPAL ÚNICO
// ?background=1 registra ferramentas / janela normal mostra fichas.
// O MESTRE marca área total, Time A, Time B e linhas dos 3 m.
// A área de fora é o complemento das quadras A/B.
// Cada célula representa 1,5 metro (configuração do nosso RPG).
// ================================================================
const ID="br.com.haikyuu.rtt"; // Mantém compatibilidade com fichas anteriores
const SHEET=ID+"/sheet", BALL=ID+"/ball", COURT=ID+"/court", LOCK=ID+"/serve-lock";
const RALLY=ID+"/rally", SCORE=ID+"/score";
// Cada área sorteia uniformemente UM dos centros de célula que a compõem.
// Baixo conserva a mira original de 1,5 × 1,5 m sobre o cruzamento de 4 casas.
// Cima: 2 × 3 casas; Flutuante: 2 × 3 + 2 laterais centrais;
// Viagem: 7 × 7 casas, área móvel equivalente à metade verde de nossa quadra.
const SERVE_TYPES={
 underhand:{name:"Saque por Baixo",mod:0,fail:1,receive:"Passe com Vantagem",receptionAttr:"Passe",advantage:"adv",area:"Quadrado 1,5 × 1,5 m • 4 destinos",count:4},
 overhand:{name:"Saque por Cima",mod:0,fail:2,receive:"Passe normal",receptionAttr:"Passe",advantage:"normal",area:"Retângulo vertical 2 × 3 casas • 6 destinos",count:6},
 float:{name:"Saque Flutuante",mod:-2,fail:3,receive:"Passe com Desvantagem",receptionAttr:"Passe",advantage:"dis",area:"Cruz (+) com 8 casas • 8 destinos",count:8},
 jump:{name:"Saque Viagem",mod:-2,fail:3,receive:"Teste de Defesa",receptionAttr:"Defesa",advantage:"normal",area:"Quadrado móvel 7 × 7 casas • 49 destinos",count:49}
};
const TOOL=ID+"/tool-saque", SERVE=ID+"/mode-saque", CALIBRATE=ID+"/mode-calibrar";
// A mira pode usar a ferramenta nativa de seleção do Owlbear.
// O SDK permite ativar modos, mas não disponibiliza seleção forçada da ferramenta principal.
const POINTER_TOOL="rodeo.owlbear.tools/pointer", POINTER_SERVE=ID+"/mode-saque-selecao";
const AUTO_SERVE=ID+"/mode-saque-automatico";
const ARM_EVENT=ID+"/mira-preparada";
const ICON=new URL("./Icon.png",import.meta.url).href;
const ATTRS=["Ataque","Defesa","Passe","Salto","Saque","Levantamento","Bloqueio"];
// Distribuição oficial da tabela do livro: 7 pontos iniciais em cada posição.
const PRESETS={
 "Levantador":{Ataque:0,Defesa:1,Passe:0,Salto:1,Saque:1,Levantamento:3,Bloqueio:1},
 "Líbero":{Ataque:0,Defesa:3,Passe:3,Salto:0,Saque:0,Levantamento:1,Bloqueio:0},
 "Central":{Ataque:2,Defesa:0,Passe:0,Salto:1,Saque:0,Levantamento:1,Bloqueio:3},
 "Ponteiro":{Ataque:2,Defesa:1,Passe:2,Salto:1,Saque:1,Levantamento:0,Bloqueio:0},
 "Oposto":{Ataque:3,Defesa:0,Passe:0,Salto:2,Saque:2,Levantamento:0,Bloqueio:0}
};
const POSITIONS=Object.keys(PRESETS);
const INITIAL_BONUS_POINTS=3, INITIAL_ATTRIBUTE_CAP=5;
const emptyBonuses=()=>Object.fromEntries(ATTRS.map(a=>[a,0]));
const pointsSpent=s=>ATTRS.reduce((total,a)=>total+(s.creationBonus?.[a]||0),0);
// Cada casa vale 1,5 m. Valores correspondem à borda branca da imagem,
// não à régua posicionada meio quadrado para dentro.
// Nenhum tamanho fixo de quadra. O mestre marca manualmente todas as bordas.
const COURT_CALIBRATION_VERSION=7;
const CAL_TASKS={
 outer:{label:"Área total (inclui FORA)",color:"#ef4444"},
 a:{label:"Quadra Time A",color:"#38bdf8"},
 b:{label:"Quadra Time B",color:"#4ade80"},
 lineA:{label:"Linha dos 3 m — Time A",color:"#fbbf24"},
 lineB:{label:"Linha dos 3 m — Time B",color:"#fbbf24"}
};
const PANEL_ID=ID+"/left-sheet";
const background=new URLSearchParams(location.search).has("background");
const app=document.querySelector("#app");
const escapeHTML=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
// Dice+ supports descriptive roll labels following the entire formula (# text).
// Keep the Owlbear account name intact, but show the in-game character's name.
function labeledDiceNotation(notation,label){
 const clean=String(label||"").replace(/[^\p{L}\p{N} ]/gu," ").replace(/\s+/g," ").trim().slice(0,90);
 return clean?`${notation} #${clean}`:notation;
}
const notify=(s,type)=>OBR.notification.show(s,type).catch(console.warn);
const sleep=t=>new Promise(resolve=>setTimeout(resolve,t));
const newId=()=>crypto.randomUUID();
const finite=(v,fallback=0)=>Number.isFinite(Number(v))?Number(v):fallback;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const isBall=i=>i?.layer==="MOUNT" && i?.metadata?.[BALL]===true;
const isCharacter=i=>i?.layer==="CHARACTER";
const cleanScore=s=>({allies:Math.max(0,Math.trunc(finite(s?.allies))),enemies:Math.max(0,Math.trunc(finite(s?.enemies)))});
const opposite=t=>t==="allies"?"enemies":"allies";
// As equipes são definidas pelos retângulos pintados, não por um meio de quadra fixo.
function courtRect(c,team){return c?.areas?.[team==="allies"?"a":"b"]||null;}
function rectCenter(r){return {x:(r.min.x+r.max.x)/2,y:(r.min.y+r.max.y)/2};}
function rectValid(r){return r&&[r.min?.x,r.min?.y,r.max?.x,r.max?.y].every(Number.isFinite)&&r.min.x<r.max.x&&r.min.y<r.max.y;}
function rectContains(outer,inner,eps=0){return rectValid(outer)&&rectValid(inner)&&
 inner.min.x>=outer.min.x-eps&&inner.max.x<=outer.max.x+eps&&inner.min.y>=outer.min.y-eps&&inner.max.y<=outer.max.y+eps;}
function courtLayout(c){
 const a=c?.areas?.a,b=c?.areas?.b;
 if(!rectValid(a)||!rectValid(b))return null;
 const A=rectCenter(a),B=rectCenter(b),axis=Math.abs(A.x-B.x)>=Math.abs(A.y-B.y)?"x":"y";
 const cross=axis==="x"?"y":"x";
 const aFirst=A[axis]<B[axis];
 const aFace=aFirst?a.max[axis]:a.min[axis],bFace=aFirst?b.min[axis]:b.max[axis];
 if((aFirst?aFace>bFace:bFace>aFace) || Math.max(a.min[cross],b.min[cross])>=Math.min(a.max[cross],b.max[cross]))return null;
 return {axis,cross,aFirst,net:(aFace+bFace)/2, aFace,bFace};
}
function distanceToRect(p,r){
 const dx=Math.max(r.min.x-p.x,0,p.x-r.max.x),dy=Math.max(r.min.y-p.y,0,p.y-r.max.y);
 return dx*dx+dy*dy;
}
function teamOfPosition(p,c){
 if(inside(p,courtRect(c,"allies")||{min:{x:Infinity,y:Infinity},max:{x:-Infinity,y:-Infinity}}))return "allies";
 if(inside(p,courtRect(c,"enemies")||{min:{x:Infinity,y:Infinity},max:{x:-Infinity,y:-Infinity}}))return "enemies";
 const a=courtRect(c,"allies"),b=courtRect(c,"enemies");
 if(!rectValid(a)||!rectValid(b))return null;
 return distanceToRect(p,a)<=distanceToRect(p,b)?"allies":"enemies";
}
function courtZone(p,c){
 if(!isCourt(c))return "Quadra ainda não definida";
 const team=inside(p,c.areas.a)?"a":inside(p,c.areas.b)?"b":null;
 if(!team)return "FORA DA QUADRA";
 const label=team==="a"?"Time A":"Time B",layout=courtLayout(c),line=c.lines?.[team];
 if(!Number.isFinite(line))return label+" — linha dos 3 m pendente";
 const towardNet=team==="a"?layout.aFirst:!layout.aFirst;
 const front=towardNet?p[layout.axis]>=line:p[layout.axis]<=line;
 return label+(front?" — ATÉ a linha dos 3 m (frente)":" — DEPOIS da linha dos 3 m (fundo)");
}
const dieFromResult=data=>{
 const dice=data?.result?.groups?.filter(g=>g.diceType==="d20").flatMap(g=>g.dice||[])||[];
 const used=dice.filter(d=>d.kept!==false);
 const d=used.length===1&&dice.length===1?used[0]:null;
 return Number.isInteger(d?.value)&&d.value>=1&&d.value<=20?d.value:null;
};
// ===== v0.17 — Distância de recepção: -1 por 3 metros =====
// O teste usa o centro real dos tokens (bounds Owlbear), e não a posição
// da quina da imagem. Diagonais contam como UMA casa: distância de Chebyshev.
// Escala do RPG: 1 grid = 1,5 m; duas casas completas = penalidade -1.
function receptionDistance(receiverCenter,ballCenter,gridDpi){
 if(!receiverCenter||!ballCenter||!(gridDpi>0)||
    ![receiverCenter.x,receiverCenter.y,ballCenter.x,ballCenter.y].every(Number.isFinite))
   throw Error("Não foi possível medir a distância até a bola.");
 const cells=Math.max(Math.abs(receiverCenter.x-ballCenter.x),
                      Math.abs(receiverCenter.y-ballCenter.y))/gridDpi;
 const meters=cells*1.5;
 // Tolerância numérica mínima só para corrigir imprecisões de ponto flutuante.
 const penalty=Math.floor(meters/3+1e-9);
 return {cells,meters,penalty,modifier:-penalty};
}
function receptionNotation(type,value,distancePenalty=0){
 if(!SERVE_TYPES[type])throw Error("Tipo de Saque desconhecido na recepção.");
 // Dice+ oficial: 2d20dl1 = DESCARTA o dado MENOR (vantagem).
 // Evitamos depender de flags compartilhadas entre os tipos de saque:
 // Baixo SEMPRE vantagem; Flutuante SEMPRE desvantagem; demais normais.
 const base=type==="underhand"?"2d20dl1":type==="float"?"2d20kl1":"1d20";
 // IMPORTANTE: não simplificar o modificador. O Dice+ deve mostrar
 // 1d20+4-2 em vez de 1d20+2, para o jogador enxergar o nerf.
 // Todos os operadores são suportados pela notação do Dice+.
 const attribute=Number(value)||0;
 const penalty=Math.max(0,Math.trunc(Number(distancePenalty)||0));
 return `${base}${attribute<0?"-":"+"}${Math.abs(attribute)}${penalty?`-${penalty}`:""}`;
}
function forcedOutside(c,dpi,sourceTeam,aimPoint){
 // Erro automático: bola sai pelo fundo do território adversário, sem presumir tamanho.
 const receiving=courtRect(c,opposite(sourceTeam)),layout=courtLayout(c);
 const axis=layout.axis,other=layout.cross;
 const receivingCenter=rectCenter(receiving),aFirst=layout.aFirst;
 const receivingFirst=sourceTeam==="enemies"?aFirst:!aFirst;
 const p={...receivingCenter};
 p[axis]=receivingFirst?receiving.min[axis]-dpi:receiving.max[axis]+dpi;
 p[other]=clamp(aimPoint?.[other]??receivingCenter[other],receiving.min[other]+dpi/2,receiving.max[other]-dpi/2);
 return p;
}
const isCourt=c=>Boolean(c&&c.version===COURT_CALIBRATION_VERSION&&
 rectValid(c.areas?.outer)&&rectValid(c.areas?.a)&&rectValid(c.areas?.b)&&
 rectContains(c.areas.outer,c.areas.a)&&rectContains(c.areas.outer,c.areas.b)&&courtLayout(c));
const allySide=c=>courtLayout(c)?.aFirst?"LEFT":"RIGHT";
function sheetOf(item){const s=item?.metadata?.[SHEET]||{};
 // Fichas concluídas na v0.6 com os 7 pontos-base e nível 1 ganham a nova etapa,
 // sem alterar fichas já evoluídas ou fichas NPC.
 const legacyNeedsBonus=s.created===true && s.kind!=="npc" && s.level===1 &&
   !s.creationBonus && POSITIONS.includes(s.position) &&
   ATTRS.every(a=>finite(s.attributes?.[a])===PRESETS[s.position][a]);
 return{
 name:typeof s.name==="string"?s.name:item?.name||"Personagem",
 kind:s.kind==="mestre"?"mestre":s.kind==="npc"?"npc":"jogador",
 position:POSITIONS.includes(s.position)?s.position:"",
 heightCm:Number.isFinite(s.heightCm)&&s.heightCm>0?s.heightCm:null,
 jumpCm:Number.isFinite(s.jumpCm)&&s.jumpCm>=0?s.jumpCm:null,
 level:Number.isInteger(s.level)&&s.level>=1?s.level:1,
 created:s.created===true&&!legacyNeedsBonus,
 creationBonus:Object.fromEntries(ATTRS.map(a=>[a,clamp(Math.trunc(finite(s.creationBonus?.[a])),0,INITIAL_ATTRIBUTE_CAP)])),
 attributes:Object.fromEntries(ATTRS.map(a=>[a,clamp(Math.trunc(finite(s.attributes?.[a])),-9999,9999)]))
};}
// v0.21: tipo de ficha salvo individualmente no token.
// Fichas antigas criadas continuam entrando direto na Ficha Jogador.
// Quem não tiver classificação ainda vê a escolha apenas na primeira vez.
function rememberedViewFor(item,role){
 if(!isCharacter(item))return "choose";
 const stored=item.metadata?.[SHEET]||{};
 if(stored.kind==="mestre")return role==="GM"?"mestre":"choose";
 if(stored.kind==="npc")return "npc";
 if(stored.kind==="jogador"||stored.created===true)return "jogador";
 return "choose";
}
function mergePatch(a,b){return {...a,...b,
 attributes:{...(a.attributes||{}),...(b.attributes||{})},
 creationBonus:{...(a.creationBonus||{}),...(b.creationBonus||{})}};}
// Fora da quadra é tudo que NÃO está dentro dos territórios A/B.
// A área total, também escolhida pelo mestre, limita a mira normal dos saques.
function exterior(c){return c.areas.outer;}
function inside(p,rect,eps=0){return Boolean(rect&&p.x>=rect.min.x-eps&&p.x<=rect.max.x+eps&&p.y>=rect.min.y-eps&&p.y<=rect.max.y+eps);}
function fourCells(cross,dpi){return[
 {x:cross.x-dpi/2,y:cross.y-dpi/2}, {x:cross.x+dpi/2,y:cross.y-dpi/2},
 {x:cross.x-dpi/2,y:cross.y+dpi/2}, {x:cross.x+dpi/2,y:cross.y+dpi/2}
];}
// Todos os centros estão alinhados às células de 1,5 m.
// O âncora é o cruzamento mais próximo do cursor, como na mira antiga.
// Para alturas ímpares (3/7), a área se estende meia casa para baixo do âncora.
function serveCells(type,cross,dpi){
 if(type==="underhand")return fourCells(cross,dpi);
 const coords=[];
 if(type==="overhand"||type==="float"){
   for(const y of [-.5,.5,1.5])for(const x of [-.5,.5])coords.push({x:cross.x+x*dpi,y:cross.y+y*dpi});
   if(type==="float")for(const x of [-1.5,1.5])coords.push({x:cross.x+x*dpi,y:cross.y+.5*dpi});
 }else if(type==="jump"){
   for(let row=0;row<7;row++)for(let col=0;col<7;col++)
     coords.push({x:cross.x+(col-2.5)*dpi,y:cross.y+(row-2.5)*dpi});
 }
 return coords;
}
function aimAt(cross,dpi,c,sourcePosition,type="underhand"){
 const cells=serveCells(type,cross,dpi);
 if(!SERVE_TYPES[type])return{valid:false,reason:"Tipo de saque inválido.",cells};
 if(!isCourt(c)||!sourcePosition)return{valid:false,reason:"Marque área total, Time A e Time B; selecione o sacador.",cells};
 const sourceTeam=teamOfPosition(sourcePosition,c),targetTeam=opposite(sourceTeam),target=courtRect(c,targetTeam);
 const layout=courtLayout(c),eps=dpi*.001;
 const candidatesInside=cells.map(p=>inside(p,target,eps));
 if(!cells.every(p=>inside(p,exterior(c),eps)))return{valid:false,reason:"A mira ultrapassa a ÁREA TOTAL marcada pelo mestre.",cells,inside:candidatesInside};
 const receiverIsFirst=targetTeam==="allies"?layout.aFirst:!layout.aFirst;
 if(!cells.every(p=>receiverIsFirst?p[layout.axis]<layout.net-eps:p[layout.axis]>layout.net+eps))
   return{valid:false,reason:"Toda a área do saque deve ficar no lado adversário da rede.",cells,inside:candidatesInside};
 if(restrictedServe(type)&&!Number.isFinite(c.lines?.[targetTeam==="allies"?"a":"b"]))
   return{valid:false,reason:"O mestre precisa marcar a linha dos 3 metros do time receptor.",cells,inside:candidatesInside};
 const blocked=cells.map(p=>!serveAllowed(type,p,c,targetTeam));
 const eligibleCells=cells.filter((p,i)=>!blocked[i]);
 if(!eligibleCells.length)return{valid:false,reason:"Todos os destinos estão antes da linha dos 3 metros. Mova a mira para o fundo.",cells,inside:candidatesInside,blocked,eligibleCells,sourceTeam,targetTeam};
 return{valid:true,cells,inside:candidatesInside,blocked,eligibleCells,sourceTeam,targetTeam};
}
// Saques Por Cima e Viagem jamais podem cair entre a rede e a linha dos 3 m.
// Não diminuímos as miras: filtramos os destinos proibidos do sorteio.
// O mestre determina a posição exata de cada linha em cada time.
function restrictedServe(type){return type==="overhand"||type==="jump";}
function isInFrontOfLine(point,c,team){
 const layout=courtLayout(c),key=team==="allies"?"a":"b",line=c?.lines?.[key];
 if(!layout||!Number.isFinite(line))return null;
 const first=team==="allies"?layout.aFirst:!layout.aFirst;
 return first?point[layout.axis]>=line:point[layout.axis]<=line;
}
function serveAllowed(type,point,c,team){
 if(!restrictedServe(type))return true;
 return isInFrontOfLine(point,c,team)===false;
}
// Faixa vermelha sobreposta ao quadrado 7×7: mostra os destinos bloqueados.
function forbiddenServeBand(box,c,team){
 const layout=courtLayout(c),line=c?.lines?.[team==="allies"?"a":"b"];
 if(!layout||!Number.isFinite(line))return null;
 const axis=layout.axis,first=team==="allies"?layout.aFirst:!layout.aFirst;
 const start=box[axis],end=start+(axis==="x"?box.w:box.h);
 const lo=first?Math.max(start,line):start,hi=first?end:Math.min(end,line);
 if(hi<=lo)return null;
 return axis==="x"?{x:lo,y:box.y,w:hi-lo,h:box.h}:{x:box.x,y:lo,w:box.w,h:hi-lo};
}
// Retângulos de aviso para a mira do Viagem: no máximo 4 faixas coloridas.
// Assim não precisamos atualizar 49 objetos locais em cada movimento do mouse.
function outsideBands(box,rect){
 const x0=box.x,x1=box.x+box.w,y0=box.y,y1=box.y+box.h;
 const a=clamp(rect.min.x,x0,x1),b=clamp(rect.max.x,x0,x1);
 const top=clamp(rect.min.y,y0,y1),bottom=clamp(rect.max.y,y0,y1);
 const rects=[
   {x:x0,y:y0,w:Math.max(0,a-x0),h:box.h},
   {x:b,y:y0,w:Math.max(0,x1-b),h:box.h},
   {x:a,y:y0,w:Math.max(0,b-a),h:Math.max(0,top-y0)},
   {x:a,y:bottom,w:Math.max(0,b-a),h:Math.max(0,y1-bottom)}
 ];
 return rects.filter(r=>r.w>0&&r.h>0);
}
function pickCell(cells){const a=new Uint32Array(1);crypto.getRandomValues(a);return cells[Math.floor(a[0]/4294967296*cells.length)];}
// ================= v0.18 · ZONAS DE QUEDA DO PASSE ================
// Cada casa mede um grid (1,5 m); o tamanho dos times NÃO é fixo.
function gridCentersInRect(rect,dpi){
 if(!rectValid(rect)||!(dpi>0))return [];
 const points=[];
 // Centros pelo mesmo grid usado no restante do plugin: limites do mestre
 // são posicionados nos cruzamentos das células da grade Owlbear.
 for(let y=rect.min.y+dpi/2;y<rect.max.y-dpi*.1;y+=dpi){
   for(let x=rect.min.x+dpi/2;x<rect.max.x-dpi*.1;x+=dpi){
     if(x<=rect.max.x-dpi/2+dpi*.01&&y<=rect.max.y-dpi/2+dpi*.01)
       points.push({x,y});
   }
 }
 return points;
}
// v0.18: ZONAS CONFORME OS QUATRO RETÂNGULOS DAS IMAGENS DO MESTRE.
// Contamos faixas PERPENDICULARES à rede, iniciando do lado da rede.
// A: primeira faixa, apenas 3 quadrados centrais.
// B: duas faixas seguintes, largura integral da quadra (sem a faixa da rede).
// C: faixas do meio até a penúltima do fundo + 1 grid FORA nas laterais.
// D: duas faixas do fundo + toda a região exterior atrás do fundo, na largura externa.
// Tudo é calculado para o Time A ou B, na horizontal ou vertical, sem fixar dimensões.
function passLandingCandidates(quality,c,team,dpi){
 if(!QUALITY_RULES[quality]||!isCourt(c)||!(dpi>0))return [];
 const rect=courtRect(c,team),outer=exterior(c),layout=courtLayout(c);
 const axis=layout.axis,cross=layout.cross;
 const first=team==="allies"?layout.aFirst:!layout.aFirst;
 const span=rect.max[axis]-rect.min[axis];
 const lanes=Math.max(1,Math.round(span/dpi));
 const crossCount=Math.max(1,Math.round((rect.max[cross]-rect.min[cross])/dpi));
 const nearCenter=d=>first?rect.max[axis]-(d+.5)*dpi:rect.min[axis]+(d+.5)*dpi;
 const point=(d,j)=>({[axis]:nearCenter(d),[cross]:rect.min[cross]+(j+.5)*dpi});
 const valid=(p,allowOutside)=>inside(p,outer,dpi*.001)&&
   !inside(p,courtRect(c,opposite(team)),dpi*.001)&&
   (allowOutside||inside(p,rect,dpi*.001));
 const results=[];
 const seen=new Set();
 const push=(d,j,allowOutside=false)=>{
   const p=point(d,j),key=`${Math.round(p.x*1000)}:${Math.round(p.y*1000)}`;
   if(!seen.has(key)&&valid(p,allowOutside)){seen.add(key);results.push(p);}
 };
 const across=(ds,j0,j1,allowOutside=false)=>{
   for(const d of ds)for(let j=j0;j<=j1;j++)push(d,j,allowOutside);
 };
 if(quality==="A"){
   // Pegar exatamente três casas CENTRAIS rente à rede (ou as disponíveis).
   const middle=Array.from({length:crossCount},(_,j)=>j)
     .sort((a,b)=>Math.abs(a-(crossCount-1)/2)-Math.abs(b-(crossCount-1)/2)||a-b);
   for(const j of middle.slice(0,3))push(0,j);
 }else if(quality==="B"){
   // Duas colunas logo depois daquela encostada na rede, toda a largura.
   const ds=Array.from({length:2},(_,i)=>i+1).filter(d=>d<lanes);
   across(ds.length?ds:[Math.max(0,lanes-1)],0,crossCount-1);
 }else if(quality==="C"){
   // Faixa roxa: inicia na quarta faixa (índice 3), vai até a
   // penúltima faixa da quadra, com um grid externo em cada lateral.
   const start=Math.min(3,Math.max(0,lanes-2));
   const end=Math.max(start,lanes-2);
   const ds=Array.from({length:end-start+1},(_,i)=>i+start);
   across(ds,-1,crossCount,true);
 }else if(quality==="D"){
   // Retângulo ciano: últimas duas faixas de quadra e TODOS os grids
   // da área externa atrás da linha de fundo, inclusive laterais.
   const start=Math.max(0,lanes-2);
   const outerDepth=first?rect.min[axis]-outer.min[axis]:outer.max[axis]-rect.max[axis];
   const after=Math.max(0,Math.ceil(outerDepth/dpi)+1);
   const ds=Array.from({length:lanes-start+after},(_,i)=>i+start);
   const extendBefore=Math.max(0,Math.ceil((rect.min[cross]-outer.min[cross])/dpi)+1);
   const extendAfter=Math.max(0,Math.ceil((outer.max[cross]-rect.max[cross])/dpi)+1);
   across(ds,-extendBefore,crossCount-1+extendAfter,true);
 }
 return results;
}
// ================= v0.13 · ESTADO DA BOLA E PASSE ================
const BALL_STATE=ID+"/ball-state";
const QUALITY_RULES={
 A:{seconds:20,penalty:0,disadvantage:false,reach:0},
 B:{seconds:10,penalty:0,disadvantage:false,reach:3},
 C:{seconds:5,penalty:-1,disadvantage:false,reach:6},
 D:{seconds:5,penalty:0,disadvantage:true,reach:11}
};
// v0.25 — Nova qualidade da recepção (resultado final de Passe/Defesa menos Saque).
// A: +3 ou mais | B: -1 a +2 | C: -3 a -2 | D: -5 a -4 | Ace: -6 ou menos.
// A penalidade de distância (-1 a cada 3 m) já faz parte do total do Dice+.
function classifyReception(diff){
 return diff>=3?"A":diff>=-1?"B":diff>=-3?"C":diff>=-5?"D":"Ace";
}
function newTimer(quality){
 const durationMs=(QUALITY_RULES[quality]?.seconds||0)*1000;
 return {durationMs,remainingMs:durationMs,status:durationMs?"idle":"disabled",endsAt:null};
}
function timerRemaining(t,now=Date.now()){
 if(!t)return 0;
 return Math.max(0,t.status==="running"?Number(t.endsAt||now)-now:Number(t.remainingMs||0));
}
function fmtTimer(ms){
 const t=Math.max(0,Math.ceil(ms/100));
 return `${Math.floor(t/600)}:${String(Math.floor(t%600/10)).padStart(2,"0")}.${t%10}`;
}
function ballDescription(state){
 if(!state)return "Nenhum saque registrado.";
 const name=state.serverName||"Sacador",type=SERVE_TYPES[state.type]?.name||"Saque";
 return `${name} · ${type} · resultado ${state.total??"—"}`;
}
// ================================================================

async function setBall(itemId,enabled){
 const all=await OBR.scene.items.getItems(i=>isBall(i)||i.id===itemId);
 if(!all.some(i=>i.id===itemId&&i.layer==="MOUNT"))throw Error("Selecione um objeto em Montarias.");
 await OBR.scene.items.updateItems(all.map(i=>i.id),draft=>{
   for(const i of draft){if(i.id===itemId&&enabled)i.metadata[BALL]=true;else delete i.metadata[BALL];}
 });
}

// ==================== PROCESSO DE FUNDO ==========================
// O processo de fundo do mestre conclui o timer mesmo com a ficha fechada.
const AUTO_DICE_SOURCE=ID+"/auto-levantamento";
let autoTimerBusy=false;
async function backgroundDice(notation,label=""){
 const readyId=newId();
 const ready=await new Promise(resolve=>{
   let finished=false;
   const off=OBR.broadcast.onMessage("dice-plus/isReady",e=>{
     if(e.data?.requestId===readyId&&e.data?.ready===true){finished=true;off();clearTimeout(timeout);resolve(true);}
   });
   const timeout=setTimeout(()=>{if(!finished){off();resolve(false);}},1700);
   OBR.broadcast.sendMessage("dice-plus/isReady",{requestId:readyId,timestamp:Date.now()},{destination:"ALL"}).catch(()=>{if(!finished){off();clearTimeout(timeout);resolve(false);}});
 });
 if(!ready)throw Error("Dice+ indisponível na sala.");
 const rollId=newId();
 return new Promise((resolve,reject)=>{
   const done=(error,data)=>{clearTimeout(timeout);offOk();offError();error?reject(error):resolve(data);};
   const offOk=OBR.broadcast.onMessage(AUTO_DICE_SOURCE+"/roll-result",e=>{
     if(e.data?.rollId===rollId){const total=e.data.result?.totalValue;
       if(!Number.isFinite(total))done(Error("Resultado de dado inválido."));
       else done(null,{total,natural:dieFromResult(e.data),rollId});}
   });
   const offError=OBR.broadcast.onMessage(AUTO_DICE_SOURCE+"/roll-error",e=>{
     if(e.data?.rollId===rollId)done(Error(e.data?.error||"Erro no Dice+"));
   });
   const timeout=setTimeout(()=>done(Error("O Dice+ não retornou a rolagem.")),46000);
   Promise.all([OBR.player.getId(),OBR.player.getName()]).then(([playerId,playerName])=>
     OBR.broadcast.sendMessage("dice-plus/roll-request",{
       rollId,playerId,playerName,rollTarget:"everyone",diceNotation:labeledDiceNotation(notation,label),
       showResults:true,timestamp:Date.now(),source:AUTO_DICE_SOURCE
     },{destination:"ALL"})).catch(done);
 });
}
async function backgroundSave(next){
 const balls=await OBR.scene.items.getItems(isBall);
 if(balls.length!==1)throw Error("Bola oficial não identificada.");
 await OBR.scene.items.updateItems([balls[0].id],draft=>{
   for(const item of draft)item.metadata[BALL_STATE]={...next,ballId:balls[0].id};
 });
 await OBR.scene.setMetadata({[RALLY]:{...next,ballId:balls[0].id}});
}
async function backgroundExpireTimer(){
 if(autoTimerBusy||await OBR.player.getRole()!=="GM"||!await OBR.scene.isReady())return;
 const current=(await OBR.scene.getMetadata())[RALLY];
 if(!current?.setterId||current.timer?.status!=="running"||timerRemaining(current.timer)>0)return;
 autoTimerBusy=true;
 try{
   const [setter]=await OBR.scene.items.getItems([current.setterId]);
   if(!isCharacter(setter))throw Error("Levantador não encontrado.");
   const conditions=QUALITY_RULES[current.quality];
   if(!conditions)throw Error("Qualidade de Passe desconhecida.");
   if(!current.reachPassed||!current.setterRunDone)
     throw Error("O Levantador ainda não concluiu a corrida. O timer não pode iniciar.");
   const base=sheetOf(setter).attributes.Levantamento;
   const runPenalty=Math.max(0,Math.trunc(Number(current.setterRunPenalty)||0));
   const qualityPenalty=Number(conditions.penalty)||0;
   // Mantém todas as parcelas visíveis no Dice+: ex. 1d20+4-2-1.
   const notation=`${conditions.disadvantage?"2d20kl1":"1d20"}${base<0?"-":"+"}${Math.abs(base)}`+
     `${runPenalty?`-${runPenalty}`:""}${qualityPenalty<0?qualityPenalty:""}`;
   const working={...current,phase:"resolvendo",timer:{...current.timer,status:"resolving",remainingMs:0,endsAt:null}};
   await backgroundSave(working);
   const rolled=await backgroundDice(notation,`Levantamento de ${sheetOf(setter).name}`);
   const latest=(await OBR.scene.getMetadata())[RALLY];
   if(latest?.serveId!==current.serveId||latest?.phase!=="resolvendo")return;
   const lifting={setterId:current.setterId,setterName:sheetOf(setter).name,total:rolled.total,
     natural:rolled.natural,notation,runPenalty,qualityPenalty,
     distanceMeters:current.setterRunMeters||0,at:Date.now()};
   await backgroundSave({...latest,lifting,phase:"levantado",timer:{...latest.timer,status:"done",remainingMs:0}});
   await notify(`🏐 Levantamento de ${lifting.setterName}: ${lifting.total} (Passe ${current.quality}).`);
 }catch(error){
   console.error("Haikyuu Timer automático",error);
   const fresh=(await OBR.scene.getMetadata())[RALLY];
   if(fresh?.serveId===current.serveId&&fresh?.timer?.status==="resolving"){
     await backgroundSave({...fresh,phase:"aguardando_mestre",timer:{...fresh.timer,status:"error"}}).catch(console.warn);
   }
   await notify(`Falha no Levantamento automático: ${error.message}`,"ERROR");
 }finally{autoTimerBusy=false;}
}

async function startBackground(){
 app.innerHTML="";document.body.style.display="none";
 setInterval(()=>{void backgroundExpireTimer().catch(console.warn);},250);
 let firstCorner=null,previewIds=[],previewJob=null,previewKey="",previewType=null,active=false,executing=false,dpi=0,court=null;
 let pointerServeMeta=null;
 let myPlayerId=await OBR.player.getId();
 let calibrationPreviewIds=[],calibrationPreviewJob=null,calibrationPreviewKey="",calibrationNonce=null,calibrationTask="outer";
 let zoneIds=[],zoneJob=Promise.resolve(),zoneSerial=0;
 let lastSelection=null,opening=false,selectionSerial=0,pendingPoint=null,pendingMeta=null,painting=false;
 async function openLeftSheet(){
   if(opening)return;
   opening=true;
   try{
     const [w,h]=await Promise.all([OBR.viewport.getWidth(),OBR.viewport.getHeight()]);
     await OBR.popover.open({id:PANEL_ID,url:new URL("./index.html",import.meta.url).href,
       width:Math.min(390,Math.max(260,w-25)),height:Math.min(740,Math.max(350,h-88)),
       anchorReference:"POSITION",anchorPosition:{left:12,top:70},
       anchorOrigin:{horizontal:"LEFT",vertical:"TOP"},transformOrigin:{horizontal:"LEFT",vertical:"TOP"},disableClickAway:true});
   }finally{opening=false;}
 }
 async function openSelection(ids){
   const id=ids?.length===1?ids[0]:null,serial=++selectionSerial;
   if(!id){lastSelection=null;return;}
   if(id===lastSelection)return;
   const [item]=await OBR.scene.items.getItems([id]);
   if(serial!==selectionSerial||!item||(!isCharacter(item)&&item.layer!=="MOUNT"))return;
   lastSelection=id;await openLeftSheet();
 }
 OBR.player.onChange(p=>{void openSelection(p.selection).catch(console.warn);});
 OBR.scene.onReadyChange(ready=>{
   if(ready){lastSelection=null;void OBR.player.getSelection().then(openSelection).catch(console.warn);}
   else{court=null;firstCorner=null;dpi=0;void removePreview();void clearCalibrationPreview();void showZones(null);}
 });
 await OBR.contextMenu.create({id:ID+"/abrir-ficha",icons:[{icon:ICON,label:"Abrir ficha Haikyuu!!",filter:{min:1,max:1,every:[{key:"layer",value:"CHARACTER"}]}}],
   async onClick(ctx){await OBR.player.select([ctx.items[0].id],true);await openLeftSheet();}});
 await OBR.contextMenu.create({id:ID+"/definir-bola",icons:[{icon:ICON,label:"Definir como bola",filter:{min:1,max:1,roles:["GM"],every:[{key:"layer",value:"MOUNT"}]}}],
   async onClick(ctx){try{await setBall(ctx.items[0].id,true);await OBR.player.select([ctx.items[0].id],true);await openLeftSheet();await notify("🏐 Bola oficial definida.");}catch(e){await notify(e.message,"ERROR");}}});
 await OBR.tool.create({id:TOOL,icons:[{icon:ICON,label:"Haikyuu!!: mira / calibrar"}],defaultMode:SERVE,defaultMetadata:{serverId:"",serveType:"underhand"}});
 function shape(label,width,height,color,opacity,strokeOpacity=.9){
   return buildShape().shapeType("RECTANGLE").name(label).width(width).height(height).position({x:0,y:0}).layer("DRAWING")
     .disableHit(true).fillColor(color).fillOpacity(opacity).strokeColor(color).strokeWidth(2).strokeOpacity(strokeOpacity).build();
 }
 async function removePreview(){previewKey="";pendingPoint=null;
   if(previewJob)try{await previewJob;}catch(e){console.warn(e);}
   const ids=previewIds;previewIds=[];previewType=null;
   if(ids.length)try{await OBR.scene.local.deleteItems(ids);}catch(e){console.warn(e);}
 }
 async function ensurePreview(type){
   if(previewIds.length&&previewType===type)return;
   if(previewIds.length&&previewType!==type)await removePreview();
   if(previewJob){await previewJob;if(previewIds.length&&previewType===type)return;}
   previewType=type;
   previewJob=(async()=>{
     let shapes=[];
     if(type==="jump"){
       // 7×7 original + 4 faixas laranja de fora + faixa proibida vermelha.
       shapes=[shape("Saque Viagem — 7×7 casas",7*dpi,7*dpi,"#22d3ee",.19),
         ...Array.from({length:4},(_,i)=>shape(`Parte fora ${i+1}`,dpi,dpi,"#f59e0b",0,0)),
         shape("PROIBIDO — antes da linha dos 3 metros",dpi,dpi,"#ef4444",0,0)];
     }else{
       const n=SERVE_TYPES[type]?.count||0;
       shapes=Array.from({length:n},(_,i)=>shape(`Destino ${i+1}`,dpi,dpi,"#38bdf8",.21));
       if(type==="underhand")shapes.push(shape("Mira 1,5 × 1,5 m",dpi,dpi,"#22d3ee",.23));
       if(type==="overhand")shapes.push(shape("Retângulo 2 × 3 casas",2*dpi,3*dpi,"#22d3ee",.08));
       // Na cruz, não criamos retângulo cheio: os 4 cantos devem ficar vazios.
     }
     await OBR.scene.local.addItems(shapes);
     previewIds=shapes.map(s=>s.id);
   })();
   try{await previewJob;}finally{previewJob=null;}
 }
 // A única fonte dos limites é a marcação manual do mestre.
 async function clearCalibrationPreview(){
   calibrationPreviewKey="";
   if(calibrationPreviewJob)try{await calibrationPreviewJob;}catch(e){console.warn(e);}
   const ids=calibrationPreviewIds;calibrationPreviewIds=[];
   if(ids.length)await OBR.scene.local.deleteItems(ids).catch(console.warn);
 }
 function rectBetween(a,b){return{min:{x:Math.min(a.x,b.x),y:Math.min(a.y,b.y)},
   max:{x:Math.max(a.x,b.x),y:Math.max(a.y,b.y)}};}
 function rectShape(r,label,color,opacity=.055,strokeWidth=3){
   return buildShape().shapeType("RECTANGLE").name(label).position({...r.min})
     .width(r.max.x-r.min.x).height(r.max.y-r.min.y).layer("DRAWING")
     .disableHit(true).fillColor(color).fillOpacity(opacity)
     .strokeColor(color).strokeWidth(strokeWidth).strokeOpacity(.82).build();
 }
 function lineRect(c,task,coordinate,size){
   const team=task==="lineA"?"a":"b",r=c.areas[team],axis=courtLayout(c).axis;
   const width=Math.max(2,size*.045);
   return axis==="x"?{min:{x:coordinate-width/2,y:r.min.y},max:{x:coordinate+width/2,y:r.max.y}}:
     {min:{x:r.min.x,y:coordinate-width/2},max:{x:r.max.x,y:coordinate+width/2}};
 }
 async function previewCalibration(point,task){
   if(!point||!CAL_TASKS[task])return;
   const size=await OBR.scene.grid.getDpi(),p=await OBR.scene.grid.snapPosition(point,1,true,false);
   if(task.startsWith("line")&&!isCourt(court))return;
   if(!task.startsWith("line")&&!firstCorner)return;
   const r=task.startsWith("line")?lineRect(court,task,p[courtLayout(court).axis],size):rectBetween(firstCorner,p);
   if(!rectValid(r)){await clearCalibrationPreview();return;}
   const key=`${task}|${r.min.x}|${r.min.y}|${r.max.x}|${r.max.y}`;
   if(key===calibrationPreviewKey)return;
   calibrationPreviewKey=key;
   // Atualizações seriadas evitam duplicatas durante o movimento do ponteiro.
   const old=calibrationPreviewJob;
   calibrationPreviewJob=(async()=>{
     if(old)await old.catch(()=>{});
     if(calibrationPreviewIds.length){await OBR.scene.local.deleteItems(calibrationPreviewIds).catch(console.warn);calibrationPreviewIds=[];}
     const item=rectShape(r,`Prévia: ${CAL_TASKS[task].label}`,CAL_TASKS[task].color,.17);
     await OBR.scene.local.addItems([item]);calibrationPreviewIds=[item.id];
   })();
   await calibrationPreviewJob;
 }
 function outsideTiles(c){
   const outer=c?.areas?.outer;
   if(!rectValid(outer))return [];
   const parts=[c.areas?.a,c.areas?.b].filter(rectValid);
   const xs=[outer.min.x,outer.max.x],ys=[outer.min.y,outer.max.y];
   for(const r of parts){xs.push(r.min.x,r.max.x);ys.push(r.min.y,r.max.y);}
   const uniq=a=>[...new Set(a)].sort((x,y)=>x-y);
   const xx=uniq(xs),yy=uniq(ys),tiles=[];
   for(let i=0;i<xx.length-1;i++)for(let j=0;j<yy.length-1;j++){
     const mid={x:(xx[i]+xx[i+1])/2,y:(yy[j]+yy[j+1])/2};
     if(!parts.some(r=>inside(mid,r))){
       const rect={min:{x:xx[i],y:yy[j]},max:{x:xx[i+1],y:yy[j+1]}};
       if(rectValid(rect))tiles.push(rect);
     }
   }
   return tiles;
 }
 function fillRect(rect,name,color,opacity){
   return buildShape().shapeType("RECTANGLE").name(name).position({...rect.min})
     .width(rect.max.x-rect.min.x).height(rect.max.y-rect.min.y).layer("DRAWING")
     .disableHit(true).fillColor(color).fillOpacity(opacity)
     .strokeColor(color).strokeWidth(0).strokeOpacity(0).build();
 }
 function splitCourt(r,axis,cut){
   if(!Number.isFinite(cut)||cut<=r.min[axis]||cut>=r.max[axis])return[r];
   const first={min:{...r.min},max:{...r.max}},second={min:{...r.min},max:{...r.max}};
   first.max[axis]=cut;second.min[axis]=cut;
   return[first,second];
 }
 async function showZones(next){
   const serial=++zoneSerial;
   const prev=zoneJob;
   zoneJob=(async()=>{
     await prev.catch(()=>{});
     const ids=zoneIds;zoneIds=[];
     if(ids.length)await OBR.scene.local.deleteItems(ids).catch(console.warn);
     if(serial!==zoneSerial||!next||next.showZones===false)return;
     const shapes=[],a=next.areas?.a,b=next.areas?.b,outer=next.areas?.outer;
     for(const r of outsideTiles(next))shapes.push(fillRect(r,"FORA da quadra","#ef4444",.14));
     if(rectValid(outer))shapes.push(rectShape(outer,"Limite externo / Fora", "#ef4444",.015,4));
     const layout=isCourt(next)?courtLayout(next):null;
     for(const [r,key,name,colors] of [[a,"a","A",["#7dd3fc","#2563eb"]],[b,"b","B",["#86efac","#15803d"]]]){
       if(!rectValid(r))continue;
       if(!layout||!Number.isFinite(next.lines?.[key])){
         shapes.push(rectShape(r,`TIME ${name} — quadra válida`,colors[0],.12,4));continue;
       }
       const [lower,higher]=splitCourt(r,layout.axis,next.lines[key]);
       const frontAtHigh=key==="a"?layout.aFirst:!layout.aFirst;
       shapes.push(fillRect(lower,`TIME ${name} — ${frontAtHigh?"FUNDO":"FRENTE"}`,frontAtHigh?colors[1]:colors[0],.17));
       if(higher)shapes.push(fillRect(higher,`TIME ${name} — ${frontAtHigh?"FRENTE":"FUNDO"}`,frontAtHigh?colors[0]:colors[1],.17));
       shapes.push(rectShape(r,`TIME ${name} — área válida`,colors[0],0,4));
     }
     if(layout){
       const size=next.gridDpi||await OBR.scene.grid.getDpi();
       for(const [task,name] of [["lineA","Linha 3 m — A"],["lineB","Linha 3 m — B"]]){
         const coord=next.lines?.[task==="lineA"?"a":"b"];
         if(Number.isFinite(coord))shapes.push(rectShape(lineRect(next,task,coord,size),name,"#fbbf24",.85,2));
       }
     }
     if(!shapes.length||serial!==zoneSerial)return;
     await OBR.scene.local.addItems(shapes);
     if(serial!==zoneSerial){await OBR.scene.local.deleteItems(shapes.map(i=>i.id)).catch(console.warn);return;}
     zoneIds=shapes.map(i=>i.id);
   })();
   await zoneJob.catch(console.warn);
 }
 async function getAim(point,metadata){
   if(!dpi)dpi=await OBR.scene.grid.getDpi();
   const cross=await OBR.scene.grid.snapPosition(point,1,true,false);
   const sid=metadata?.serverId;
   if(!sid)return{cross,aim:{valid:false,reason:"Escolha um tipo de Saque na ficha."}};
   if(!court)court=(await OBR.scene.getMetadata())[COURT];
   const [token]=await OBR.scene.items.getItems([sid]);
   if(!isCharacter(token))return{cross,aim:{valid:false,reason:"Sacador não encontrado."}};
   const bounds=await OBR.scene.items.getItemBounds([sid]);
   const sourcePosition=bounds?.center||token.position;
   return{cross,aim:aimAt(cross,dpi,court,sourcePosition,metadata?.serveType)};
 }
 async function paint(point,metadata){
   if(!active||executing||!point)return;
   const {cross,aim}=await getAim(point,metadata);
   const type=metadata?.serveType;
   if(!SERVE_TYPES[type]||!aim.cells){await removePreview();return;}
   const key=`${type}/${cross.x}/${cross.y}/${metadata?.serverId}/${aim.valid}/${aim.inside?.join("-")}/${aim.blocked?.join("-")}`;
   if(key===previewKey&&previewIds.length&&previewType===type)return;
   // Primeiro criamos (ou reaproveitamos) os elementos; depois aplicamos a posição.
   await ensurePreview(type);
   if(!active||executing||previewType!==type||!previewIds.length)return;
   previewKey=key;
   const lookup=new Map(previewIds.map((id,i)=>[id,i]));
   if(type==="jump"){
     const xs=aim.cells.map(p=>p.x),ys=aim.cells.map(p=>p.y);
     const x=Math.min(...xs)-dpi/2,y=Math.min(...ys)-dpi/2;
     const block={x,y,w:7*dpi,h:7*dpi};
     const zones=isCourt(court)&&aim.valid?outsideBands(block,courtRect(court,aim.targetTeam)):[];
     const forbidden=isCourt(court)&&aim.targetTeam?forbiddenServeBand(block,court,aim.targetTeam):null;
     await OBR.scene.local.updateItems(previewIds,draft=>{
       for(const item of draft){const i=lookup.get(item.id);
         if(i===0){item.position={x,y};item.style.fillColor=aim.valid?"#22d3ee":"#fb7185";item.style.strokeColor=aim.valid?"#22d3ee":"#fb7185";}
         else{
           const zone=i===5?forbidden:zones[i-1];
           if(zone){item.position={x:zone.x,y:zone.y};item.width=zone.w;item.height=zone.h;
             item.style.fillOpacity=i===5?.48:.33;item.style.strokeOpacity=.35;}
           else{item.style.fillOpacity=0;item.style.strokeOpacity=0;}
         }
       }
     });
     return;
   }
   const count=aim.cells.length;
   await OBR.scene.local.updateItems(previewIds,draft=>{
     for(const item of draft){const i=lookup.get(item.id);
       if(i<count){const p=aim.cells[i];item.position={x:p.x-dpi/2,y:p.y-dpi/2};
         const color=aim.blocked?.[i]?"#ef4444":!aim.valid?"#fb7185":aim.inside[i]?"#38bdf8":"#f59e0b";
         item.style.fillColor=color;item.style.strokeColor=color;}
       else{
         // Área principal acompanha o cursor, mas não altera os 4 destinos do baixo.
         item.position=type==="underhand"?{x:cross.x-dpi/2,y:cross.y-dpi/2}:
           {x:cross.x-dpi,y:cross.y-dpi};
         item.style.fillColor=aim.valid?"#22d3ee":"#fb7185";
         item.style.strokeColor=aim.valid?"#22d3ee":"#fb7185";
       }
     }
   });
 }
 function onMouse(point,meta){pendingPoint=point;pendingMeta=meta;
   if(painting)return;painting=true;
   void(async()=>{try{while(pendingPoint){const p=pendingPoint,m=pendingMeta;pendingPoint=null;await paint(p,m);}}
     catch(e){console.warn("Haikyuu mira",e);}finally{painting=false;}})();
 }
 async function animate(ball,landing){
   const bounds=await OBR.scene.items.getItemBounds([ball.id]);
   const center=bounds?.center||ball.position,from={...ball.position};
   const to={x:from.x+landing.x-center.x,y:from.y+landing.y-center.y};
   const [update,stop]=await OBR.interaction.startItemInteraction(ball);
   try{const start=performance.now(),duration=1100;
     while(true){const t=Math.min(1,(performance.now()-start)/duration),e=t*t*(3-2*t);
       update(d=>{d.position={x:from.x+(to.x-from.x)*e,y:from.y+(to.y-from.y)*e};});
       if(t>=1)break;await sleep(32);}
   }finally{await stop();}
   // Conserva o destino final após terminar a interação.
   await OBR.scene.items.updateItems([ball.id],d=>{for(const i of d)i.position=to;});
 }
 // v0.25: animação do Passe fica inteiramente na própria ação de recepção.
 // Não depende mais de broadcast para um segundo processo ou de modo de ferramenta.
 // O saque continua com sua animação independente no processo de fundo.
 async function doServe(point,meta){
   if(executing)return;executing=true;
   let completion={ok:false,error:"Saque interrompido."};
   try{
     if((await OBR.scene.grid.getType())!=="SQUARE")throw Error("A grade precisa ser quadrada.");
     if(!SERVE_TYPES[meta?.serveType]||!meta?.serverId)throw Error("Prepare um Saque na ficha antes de mirar.");
     if(meta?.rollConfirmed!==true||!Number.isInteger(meta?.natural)||meta.natural<1||meta.natural>20)
       throw Error("Aguarde o resultado do D20 natural no Dice+ antes de confirmar o saque.");
     const naturalFail=meta.natural<=SERVE_TYPES[meta.serveType].fail;
     const {aim}=await getAim(point,meta);
     if(!isCourt(court))throw Error("O mestre precisa marcar a área total e as quadras A/B.");
     if(!naturalFail&&!aim.valid)throw Error(aim.reason);
     const balls=await OBR.scene.items.getItems(isBall);
     if(balls.length!==1)throw Error("O mestre precisa definir exatamente uma bola em Montarias.");
     if(balls[0].locked)throw Error("Desbloqueie a bola para movimentá-la.");
     const state=(await OBR.scene.getMetadata())[LOCK];
     if(state?.until>Date.now())throw Error("Outro saque está acontecendo.");
     await OBR.scene.setMetadata({[LOCK]:{until:Date.now()+4500,by:await OBR.player.getId()}});
     try{
       const t=SERVE_TYPES[meta.serveType];
       const [server]=await OBR.scene.items.getItems([meta.serverId]);
       if(!isCharacter(server))throw Error("Sacador não encontrado.");
       const serverBounds=await OBR.scene.items.getItemBounds([meta.serverId]);
       const sourcePosition=serverBounds?.center||server.position;
       const sourceTeam=teamOfPosition(sourcePosition,court);
       const recipientTeam=opposite(sourceTeam);
       const chosen=naturalFail?forcedOutside(court,dpi,sourceTeam,point):pickCell(aim.eligibleCells);
       const landedInside=!naturalFail&&inside(chosen,courtRect(court,recipientTeam),dpi*.001);
       await removePreview();await animate(balls[0],chosen);
       // O erro natural prevalece sobre quaisquer atributos e modificadores.
       const previous=(await OBR.scene.getMetadata());
       const score=cleanScore(previous[SCORE]);
       if(!landedInside)score[recipientTeam]++;
       const serveResult={type:meta.serveType,natural:meta.natural,total:meta.total,
         serveId:meta.rollId||"",serverId:meta.serverId,sourceTeam,recipientTeam,
         landing:chosen,landingZone:courtZone(chosen,court),inside:landedInside,ended:!landedInside,awaitingReception:landedInside,
         receptionPending:false,timestamp:Date.now()};
        const serverName=sheetOf(server).name;
        const fullRally={...serveResult,ballId:balls[0].id,serverName,
          phase:landedInside?"recepcao":"encerrado",quality:null,reception:null,
          setterId:null,setterName:null,reachPassed:false,lifting:null,timer:newTimer(null)};
        await OBR.scene.items.updateItems([balls[0].id],draft=>{
          for(const item of draft)item.metadata[BALL_STATE]=fullRally;
        });
        await OBR.scene.setMetadata({[SCORE]:score,[RALLY]:fullRally});
       if(naturalFail)await notify(`🚫 ${t.name}: D20 natural ${meta.natural}. Erro automático! Ponto para ${recipientTeam==="allies"?"TIME A":"TIME B"}.`);
       else if(!landedInside)await notify(`🚫 ${t.name}: bola FORA! Ponto para ${recipientTeam==="allies"?"TIME A":"TIME B"}.`);
       else await notify(`🏐 ${t.name}: DENTRO! Recepção: ${t.receive}.`);
       // A bola já chegou: o modo fica livre para iniciar a próxima tentativa.
       await OBR.tool.setMetadata(TOOL,{serverId:"",serveType:"",rollConfirmed:false,natural:0,total:0,rollId:""});
       pointerServeMeta=null;
       // Devolve o jogador ao modo original (Seleção, Movimento etc.) após o saque.
       if(meta?.restoreTool&&meta?.restoreMode){
         try{
           if(await OBR.tool.getActiveTool()===meta.restoreTool &&
              await OBR.tool.getActiveToolMode()===AUTO_SERVE){
             await OBR.tool.activateMode(meta.restoreTool,meta.restoreMode);
           }
         }catch(e){console.warn("Haikyuu: não foi possível restaurar modo anterior",e);}
       }
       completion={ok:true,inside:landedInside,naturalFail};
     }finally{await OBR.scene.setMetadata({[LOCK]:null}).catch(console.warn);}
   }catch(e){console.error("Haikyuu saque",e);completion={ok:false,error:e.message};await notify(`Saque: ${e.message}`,"ERROR");}
   finally{
     executing=false;
     // A ficha recebe a confirmação tanto para saques manuais quanto automáticos.
     if(meta?.rollId){
       try{await OBR.broadcast.sendMessage(`${ID}/serve-finished`,{
         rollId:meta.rollId,playerId:await OBR.player.getId(),
         serverId:meta.serverId,...completion
       },{destination:"ALL"});}catch(e){console.warn("Haikyuu: confirmação do saque",e);}
     }
   }
 }
 // Após um erro no D20 natural, a bola sai automaticamente sem exigir uma mira manual.
 OBR.broadcast.onMessage(`${ID}/auto-fault`,event=>{void(async()=>{
   const data=event.data;
   if(!data||data.playerId!==await OBR.player.getId()||!SERVE_TYPES[data.type])return;
   const meta=await OBR.tool.getMetadata(TOOL);
   if(meta?.rollId!==data.rollId||meta?.serverId!==data.serverId||meta?.rollConfirmed!==true)return;
   if(!court)court=(await OBR.scene.getMetadata())[COURT];
   if(!isCourt(court))return;
   const [token]=await OBR.scene.items.getItems([data.serverId]);
   if(!isCharacter(token))return;
   const bounds=await OBR.scene.items.getItemBounds([data.serverId]);
   const sourcePosition=bounds?.center||token.position;
   if(!dpi)dpi=await OBR.scene.grid.getDpi();
   const receiving=courtRect(court,opposite(teamOfPosition(sourcePosition,court)));
   const point=rectCenter(receiving);
   await doServe(point,meta);
 })().catch(e=>{console.error("Haikyuu erro automático",e);void notify(`Erro automático: ${e.message}`,"ERROR");});});
 // O modo da ferramenta oficial continua como alternativa compatível.
 // A extensão agora também registra um modo na ferramenta nativa de seleção (pointer).
 // Ao clicar em um saque, a ficha tenta ativar esse modo, sem clicar no ícone 🏐.
 OBR.broadcast.onMessage(ARM_EVENT,event=>{
   if(event.data?.playerId!==myPlayerId)return;
   pointerServeMeta=event.data?.metadata||null;
   if(!pointerServeMeta?.serverId)void removePreview();
 });
 // Sem filtro activeTools, este modo pode ser usado na ferramenta que JÁ estiver
 // selecionada (Seleção, Movimento, etc.). Não força trocar de ferramenta.
 // A mesma função paint/doServe usada pela calibração recebe os cliques do mapa.
 await OBR.tool.createMode({id:AUTO_SERVE,icons:[{
   icon:ICON,label:"🏐 Mira automática de Saque"
 }],cursors:[{cursor:"crosshair"}],
   onActivate(){
     active=true;
     void OBR.tool.getMetadata(TOOL).then(meta=>{pointerServeMeta=meta;}).catch(console.warn);
   },
   onDeactivate(){active=false;pointerServeMeta=null;void removePreview();},
   onToolMove(_ctx,event){
     if(pointerServeMeta?.serverId)onMouse(event.pointerPosition,pointerServeMeta);
   },
   onToolClick(_ctx,event){
     void OBR.tool.getMetadata(TOOL).then(meta=>{
       pointerServeMeta=meta;
       if(meta?.serverId)return doServe(event.pointerPosition,meta);
     }).catch(err=>console.error("Haikyuu mira automática",err));
     return false;
   },
   onToolDragCancel(){void removePreview();}
 });
 await OBR.tool.createMode({id:POINTER_SERVE,icons:[{
   icon:ICON,label:"🏐 Mira de Saque (Seleção)",filter:{activeTools:[POINTER_TOOL]}
 }],cursors:[{cursor:"crosshair"}],
   onActivate(){
     active=true;
     // Caso o modo tenha sido reaberto, sincronizar com a ficha salva no TOOL.
     void OBR.tool.getMetadata(TOOL).then(meta=>{pointerServeMeta=meta;}).catch(console.warn);
   },
   onDeactivate(){active=false;void removePreview();},
   onToolMove(_ctx,event){
     // A ferramenta nativa fornece seus próprios metadados; use os do nosso saque.
     if(pointerServeMeta?.serverId)onMouse(event.pointerPosition,pointerServeMeta);
   },
   onToolClick(_ctx,event){
     void (async()=>{
       const meta=await OBR.tool.getMetadata(TOOL);
       pointerServeMeta=meta;
       await doServe(event.pointerPosition,meta);
     })().catch(err=>console.error("Haikyuu mira nativa",err));
     return false;
   },
   onToolDragCancel(){void removePreview();}
 });
 await OBR.tool.createMode({id:SERVE,icons:[{icon:ICON,label:"Mirar Saque",filter:{activeTools:[TOOL]}}],cursors:[{cursor:"crosshair"}],
   onActivate(){active=true;},onDeactivate(){active=false;void removePreview();},
   onToolMove(ctx,e){onMouse(e.pointerPosition,ctx.metadata);},
   onToolClick(ctx,e){void doServe(e.pointerPosition,ctx.metadata);return false;},
   onToolDragCancel(){void removePreview();}
 });
 await OBR.tool.createMode({id:CALIBRATE,icons:[{icon:ICON,label:"Definir áreas / linhas (Mestre)",filter:{activeTools:[TOOL],roles:["GM"]}}],cursors:[{cursor:"crosshair"}],
   onActivate(){firstCorner=null;calibrationNonce=null;active=false;void removePreview();void clearCalibrationPreview();},
   onDeactivate(){firstCorner=null;void clearCalibrationPreview();},
   onToolMove(ctx,e){
     const task=ctx.metadata?.calibrationTask||calibrationTask;
     if((firstCorner||task.startsWith("line"))&&CAL_TASKS[task])void previewCalibration(e.pointerPosition,task).catch(console.warn);
   },
   onToolClick(ctx,e){void(async()=>{
     try{
       if(await OBR.player.getRole()!=="GM")throw Error("Somente o mestre pode marcar áreas.");
       if(await OBR.scene.grid.getType()!=="SQUARE")throw Error("Use uma grade quadrada.");
       const task=ctx.metadata?.calibrationTask||"outer";
       if(!CAL_TASKS[task])throw Error("Ferramenta de marcação desconhecida.");
       if(ctx.metadata?.calibrationNonce!==calibrationNonce){
         firstCorner=null;calibrationNonce=ctx.metadata?.calibrationNonce;calibrationTask=task;await clearCalibrationPreview();
       }
       const p=await OBR.scene.grid.snapPosition(e.pointerPosition,1,true,false);
       const size=await OBR.scene.grid.getDpi();
       const prev=(await OBR.scene.getMetadata())[COURT];
       const current=prev?.version===COURT_CALIBRATION_VERSION?prev:{version:COURT_CALIBRATION_VERSION,areas:{},lines:{},showZones:true};
       const next={...current,areas:{...(current.areas||{})},lines:{...(current.lines||{})},gridDpi:size};
       if(task.startsWith("line")){
         if(!isCourt(next))throw Error("Primeiro marque área total, Time A e Time B.");
         const key=task==="lineA"?"a":"b",axis=courtLayout(next).axis,r=next.areas[key];
         if(p[axis]<=r.min[axis]||p[axis]>=r.max[axis])throw Error("Clique dentro da quadra do time para marcar sua linha de 3 m.");
         next.lines[key]=p[axis];
       }else{
         if(!firstCorner){
           firstCorner=p;
           await notify(`📍 1º canto de ${CAL_TASKS[task].label} marcado. Clique no canto oposto. Nenhuma medida fixa será imposta.`);
           return;
         }
         const rect=rectBetween(firstCorner,p);
         if((rect.max.x-rect.min.x)<size*.75||(rect.max.y-rect.min.y)<size*.75)
           throw Error("A área precisa ter pelo menos uma casa de largura e altura.");
         if(task==="outer"){
           next.areas={outer:rect};next.lines={};
         }else{
           if(!rectValid(next.areas.outer))throw Error("Primeiro delimite a área total (incluindo fora). ");
           if(!rectContains(next.areas.outer,rect))throw Error("A quadra do time deve ficar dentro da área total.");
           next.areas[task]=rect;delete next.lines[task];
           if(rectValid(next.areas.a)&&rectValid(next.areas.b)&&!courtLayout(next))
             throw Error("As quadras A/B não podem se sobrepor e precisam estar lado a lado (rede entre elas). Marque novamente.");
         }
       }
       court=next;await OBR.scene.setMetadata({[COURT]:next});await showZones(next);
       firstCorner=null;await clearCalibrationPreview();
       await notify(`✅ ${CAL_TASKS[task].label} salva! ${isCourt(next)?"A quadra está pronta para saques.":"Continue a marcar as áreas restantes."}`);
       await OBR.tool.activateMode(TOOL,SERVE);
     }catch(err){await notify(`Área: ${err.message}`,"ERROR");}
   })().catch(console.error);return false;}
 });
 OBR.scene.onMetadataChange(meta=>{const next=meta[COURT]||null;
   if(JSON.stringify(next)!==JSON.stringify(court)){court=next;void showZones(court);}
 });
 OBR.scene.grid.onChange(()=>{dpi=0;void removePreview();});
 OBR.tool.onToolChange(t=>{if(t!==TOOL&&t!==POINTER_TOOL){active=false;firstCorner=null;void removePreview();void clearCalibrationPreview();}});
 OBR.tool.onToolModeChange(m=>{if(m!==SERVE&&m!==POINTER_SERVE&&m!==AUTO_SERVE){active=false;void removePreview();}if(m!==CALIBRATE){firstCorner=null;void clearCalibrationPreview();}});
 if(await OBR.scene.isReady()){
   court=(await OBR.scene.getMetadata())[COURT]||null;
   await showZones(court);
   await openSelection(await OBR.player.getSelection());
 }
}

// ======================== INTERFACE DA FICHA =======================
async function startPanel(){
 let role=await OBR.player.getRole(),items=[],selectedId=null,selected=null,view="choose",court=null,grid="",message="",messageType="ok",rally=null,score=cleanScore(),serveLock=null;
 let latestPreparedRollId=null;
 let restoreToolId=null,restoreModeId=null;
 let selectSerial=0,busy=false,editingProfile=false,manualTypeChoice=false;
 let panelTab="status";const tabByToken=new Map();const rolls=new Map();
 // Autosave por token: edição otimista + 500ms de debounce, gravações em fila.
 const pending=new Map(),timers=new Map(),chains=new Map(),localSheets=new Map();
 let suppressEchoUntil=0;
 function currentSheet(){return selectedId&&localSheets.has(selectedId)?localSheets.get(selectedId):sheetOf(selected);}
 function saveBadge(text,bad=false){const label=document.querySelector("#autosave");if(label){label.textContent=text;label.classList.toggle("error",bad);}}
 function stage(patch,now=false){
   if(!selectedId||!isCharacter(selected))return;
   suppressEchoUntil=Date.now()+900;
   const id=selectedId,old=localSheets.get(id)||sheetOf(selected);
   localSheets.set(id,mergePatch(old,patch));pending.set(id,mergePatch(pending.get(id)||{},patch));
   clearTimeout(timers.get(id));timers.delete(id);
   saveBadge("● Salvando automaticamente...");
   if(now)void flush(id);else timers.set(id,setTimeout(()=>void flush(id),500));
 }
 async function flush(id){
   clearTimeout(timers.get(id));timers.delete(id);
   const patch=pending.get(id);if(!patch)return chains.get(id)||Promise.resolve();
   pending.delete(id);
   const prev=chains.get(id)||Promise.resolve();
   const job=prev.catch(()=>{}).then(()=>OBR.scene.items.updateItems([id],draft=>{
     for(const i of draft){const saved=i.metadata[SHEET]||{},original=sheetOf(i);
       const data=mergePatch(original,patch);
       i.metadata[SHEET]={...saved,...data,attributes:data.attributes};
     }
   }));
   chains.set(id,job);
   try{
     await job;
     if(!pending.has(id)&&chains.get(id)===job){
       // Mantém a edição visível até o Owlbear confirmar o valor atualizado.
       const [fresh]=await OBR.scene.items.getItems([id]);
       if(fresh&&selectedId===id)selected=fresh;
       localSheets.delete(id);
       saveBadge("✓ Salvo no token");
     }
   }catch(err){
     console.error("Haikyuu autosave",err);
     pending.set(id,mergePatch(patch,pending.get(id)||{}));
     saveBadge("Erro ao salvar — altere um campo para tentar novamente",true);
   }finally{if(chains.get(id)===job)chains.delete(id);}
 }
 function numericField(raw,kind){
   if(raw.trim()==="")return null;
   const n=Number(raw);
   if(!Number.isFinite(n))return undefined;
   if(kind==="level")return Number.isInteger(n)&&n>=1&&n<=9999?n:undefined;
   if(kind==="heightCm")return n>0&&n<=350?Math.round(n*10)/10:undefined;
   if(kind==="jumpCm")return n>=0&&n<=500?Math.round(n*10)/10:undefined;
   return undefined;
 }
 
 const status=(m,type="ok")=>{message=m;messageType=type;render();};
 function header(){return `<header><div class="top"><div><strong>🏐 HAIKYUU!!</strong><small>ROAD TO THE TOP • v0.26</small></div>
 <button data-act="close" aria-label="Fechar ficha">✕</button></div></header>`;}
 function choose(){
 if(selected?.metadata?.[SHEET]?.kind==="mestre"&&role!=="GM")
   return `<section class="card"><h2>⚙️ Ficha Mestre</h2><p class="small">Este token foi configurado como Ficha Mestre. Apenas o mestre pode abrir ou alterar essa ficha.</p></section>`;
 return `<section class="card"><p class="kicker">Token selecionado</p><h2>${escapeHTML(sheetOf(selected).name)}</h2>
 <p class="small">Escolha uma vez o tipo de ficha. A próxima seleção abre direto na ficha salva.</p><div class="controls">
 <button data-view="jogador">👤 Ficha Jogador</button><button data-view="mestre" ${role==="GM"?"":"disabled"}>⚙️ Ficha Mestre</button>
 <button data-view="npc">🎭 Ficha NPC</button></div></section>`;}
 function attributes(s,editable){return `<section class="card"><h2>🎲 Atributos</h2><p class="small">1d20 + atributo · Dice+</p>
 <div class="attributes-grid">${ATTRS.map(a=>`<div class="attr"><label>${a}</label>${editable
 ? `<input type="number" data-attr="${a}" value="${s.attributes[a]}" min="0" max="${s.level===1?INITIAL_ATTRIBUTE_CAP:9999}">`
 : `<strong style="text-align:center;color:#ffe4a5;font-size:17px">${s.attributes[a]}</strong>`}
 <button data-roll="${a}" ${busy?"disabled":""}>${rally?.awaitingReception&&SERVE_TYPES[rally.type]?.receptionAttr===a?"🏐 Receber":"🎲 Rolar"}</button></div>`).join("")}</div>
 <p class="small">${editable?"Ajustes de atributos pelo mestre.":"Atributos definidos na criação. Evoluções futuras serão controladas pelo mestre."}</p></section>`;}
 function positionSelect(s,editable){return `<label class="field">Posição
 <select data-profile="position" ${editable?"":"disabled"}>
 <option value="">Selecione sua posição</option>
 ${POSITIONS.map(p=>`<option value="${escapeHTML(p)}" ${s.position===p?"selected":""}>${escapeHTML(p)}</option>`).join("")}
 </select></label>`;}
 function profileFields(s,editable){return `
 <label class="field">Nome do personagem<input type="text" data-profile="name" maxlength="80" value="${escapeHTML(s.name)}" placeholder="Nome do atleta" ${editable?"":"disabled"}></label>
 ${positionSelect(s,editable&&(!s.created||role==="GM"))}
 <div class="profile-grid"><label class="field">Altura (cm)<input type="number" data-profile="heightCm" min="1" max="350" step="0.1" placeholder="Ex.: 180" value="${s.heightCm??""}" ${editable?"":"disabled"}></label>
 <label class="field">Impulsão (cm)<input type="number" data-profile="jumpCm" min="0" max="500" step="0.1" placeholder="Ex.: 65" value="${s.jumpCm??""}" ${editable?"":"disabled"}></label></div>
 <label class="field">Nível<input type="number" data-profile="level" min="1" max="9999" step="1" value="${s.level}" ${editable?"":"disabled"}></label>`;}
 function bonusBuilder(s,editable){
   if(!s.position)return `<p class="small">Escolha uma posição para receber os 7 pontos iniciais e liberar a distribuição.</p>`;
   const used=pointsSpent(s),remaining=Math.max(0,INITIAL_BONUS_POINTS-used),base=PRESETS[s.position];
   return `<div class="points-summary"><div><b>3 pontos livres do nível 1</b><small>Distribua como quiser, sem passar de 5 por atributo.</small></div>
     <strong aria-label="Pontos restantes">${remaining}/3</strong></div>
   <div class="bonus-head"><span>Atributo</span><span>Base</span><span>−</span><span>Total</span><span>+</span></div>
   ${ATTRS.map(a=>{
     const extra=s.creationBonus[a]||0,total=base[a]+extra;
     return `<div class="bonus-line"><span class="attr-name">${escapeHTML(a)}</span><span class="value">${base[a]}${extra?`<small>+${extra}</small>`:""}</span>
       <button type="button" data-bonus="${a}" data-delta="-1" aria-label="Remover um ponto de ${a}" ${!editable||extra<=0?"disabled":""}>−</button>
       <span class="sum">${total}</span>
       <button type="button" class="plus" data-bonus="${a}" data-delta="1" aria-label="Adicionar um ponto a ${a}" ${!editable||remaining<=0||total>=INITIAL_ATTRIBUTE_CAP?"disabled":""}>+</button></div>`;
   }).join("")}
   <p class="bonus-guide">${remaining===0?"✅ Todos os 3 pontos foram distribuídos.":`Faltam ${remaining} ponto(s) para concluir.`} O limite inicial é 5 em cada atributo.</p>`;
 }
 function summary(s){return `<div class="profile-summary">
   <div class="item"><small>Posição</small><b>${escapeHTML(s.position||"—")}</b></div>
   <div class="item"><small>Nível</small><b>${s.level}</b></div>
   <div class="item"><small>Altura</small><b>${s.heightCm??"—"} cm</b></div>
   <div class="item"><small>Impulsão</small><b>${s.jumpCm??"—"} cm</b></div>
   </div>`;}
 function serveCard(){return `<section class="card serve"><p class="kicker">Gameplay • Rally</p><h2>🏐 Tipos de Saque</h2>
   <p class="small">Escolha o saque: a rolagem do Dice+ será iniciada automaticamente. O erro depende apenas do D20 natural.</p>
   <div class="serve-list">${Object.entries(SERVE_TYPES).map(([key,t])=>`<button class="serve-option" data-serve="${key}" ${busy||(serveLock?.until>Date.now())?"disabled":""}>
     <span>🏐 ${t.name}<small>${t.area}<br>${t.mod<0?"−2 no Teste de Saque":"Teste de Saque normal"} · ${t.receive} · Erro no D20 ${t.fail===1?"1":`1–${t.fail}`}</small></span><b>→</b></button>`).join("")}</div>
   <p class="small">Baixo: 4 destinos; Cima: até 6; Flutuante: 8; Viagem: 7×7, até 49. Por Cima e Viagem NÃO sorteiam casas antes da linha de 3 m. Azul = dentro; laranja = fora; vermelho = destino proibido ou mira inválida.</p>
   <p class="small">${serveLock?.until>Date.now()?"⏳ Bola em movimento: o próximo saque será liberado ao terminar.":"✅ Pode fazer outro saque após a bola parar. Se pular a recepção, o rally anterior será encerrado sem ponto extra."}</p>
   <p class="small">${isCourt(court)?"✅ Quadra calibrada":"⚠️ Mestre precisa marcar Time A/B e área total"}. Ao clicar no saque, tentaremos ativar a mira diretamente na ferramenta atual. Se o Owlbear não permitir, selecione 🏐 como alternativa.</p></section>`;}
 function receiveCard(){
   if(!isCharacter(selected)||!rally?.awaitingReception||!SERVE_TYPES[rally.type]||!isCourt(court))return "";
   const t=SERVE_TYPES[rally.type];
   const waiting=rally.receptionPending;
   return `<section class="card reception-card"><p class="kicker">Recepção do Saque</p><h2>🛡️ ${t.receive}</h2>
    <p class="small">${t.name} recebido: ${t.receptionAttr} ${rally.type==="underhand"?"com VANTAGEM (2d20: descarta o menor)":rally.type==="float"?"com DESVANTAGEM (2d20: mantém o menor)":"normal (1d20)"}.</p>
    <div class="notice" style="margin:10px 0">📏 <b>Distância automática:</b> −1 a cada 3 metros (2 casas) entre seu token e a bola; diagonais contam como uma casa. O cálculo é feito ao clicar no teste.</div>
    <p class="small"><b>Classificação atual:</b> A (+3 ou mais), B (+2 até −1), C (−2 até −3), D (−4 até −5), Ace (−6 ou menos).</p>
    <button class="wide blue" data-act="receive" ${busy||waiting?"disabled":""}>${waiting?"⏳ Recepção em andamento":"🎲 Rolar recepção pelo Dice+"}</button>
    <p class="small">O Dice+ mostra a penalidade separada (ex.: 1d20+4-2). Após a classificação A/B/C/D, o receptor vai até a casa onde estava a bola; depois a bola viaja para a zona sorteada. Ace encerra o Rally. O resultado aparece nesta ficha, sem pop-up.</p></section>`;
 }
 function gameplayTabs(){
   const waiting=!!rally?.awaitingReception&&!!SERVE_TYPES[rally?.type];
   const tab=(name,label)=>`<button type="button" role="tab" aria-selected="${panelTab===name}" data-panel-tab="${name}" ${busy?"disabled":""}>${label}</button>`;
   const hasSetting=currentSheet().position==="Levantador";
   return `<nav class="game-tabs ${hasSetting?"three":""}" role="tablist" aria-label="Abas do jogador">${tab("status","📋 Status")}${tab("rally",waiting?"🏐 Saque/Recepção • !":"🏐 Saque/Recepção")}${hasSetting?tab("setter","🏐 Levantamento"):""}</nav>`;
 }
 function characterSheet(kind){const s=currentSheet(),npc=kind==="npc",editable=role==="GM"||(!npc&&s.kind!=="npc");
   if(!npc&&!s.created)return `<section class="card setup"><p class="kicker">Primeiro acesso • Ficha Jogador</p>
     <h2>🏐 Montando seu Jogador</h2><div class="creation-steps"><span>1 • Seus dados</span><span>2 • 3 pontos extras</span><span>3 • Confirmar</span></div>
     <p class="small">Sua posição concede 7 pontos automaticamente. No nível 1, você recebe mais 3 pontos livres, com limite de 5 por atributo.</p>
     ${profileFields(s,editable)}<div id="autosave" class="save-indicator" aria-live="polite">✓ Autosave ativado</div>
     <h2>🎯 Distribuição de atributos</h2>${bonusBuilder(s,editable)}
     <button class="primary wide" data-act="finish-creation" ${editable&&s.position&&pointsSpent(s)===INITIAL_BONUS_POINTS?"":"disabled"}>✓ Confirmar jogador e abrir ficha</button>
     <p class="tip">Os dados e os pontos ficam salvos neste token antes da confirmação. Você só conclui quando distribuir os 3 pontos.</p></section>`;
   // A aba de Saque/Recepção é permanente, independente da compactação dos atributos.
   // A criação de personagem permanece na tela inicial até ser concluída.
   if(panelTab==="setter"&&s.position==="Levantador")return `${gameplayTabs()}<div class="game-tab-panel" role="tabpanel" aria-label="Levantamento">
     ${setterCard()}${timerCard()}</div>`;
   if(panelTab==="rally")return `${gameplayTabs()}<div class="game-tab-panel" role="tabpanel" aria-label="Saque e Recepção">
     ${serveCard()}${receiveCard()}</div>`;
   if(!npc)return `${gameplayTabs()}<div class="game-tab-panel" role="tabpanel" aria-label="Status">
     <section class="card"><p class="kicker">Ficha Jogador • ${escapeHTML(s.position||"Atleta")}</p>
     <h2>🏐 ${escapeHTML(s.name||"Atleta")}</h2>${summary(s)}
     <div class="pill-ok">✓ Personagem criado</div>
     <button class="wide" style="margin-top:10px" data-act="toggle-profile">${editingProfile?"Ocultar edição dos dados":"✎ Editar informações"}</button>
     ${editingProfile?`<p class="small">Você pode atualizar seus dados. A posição fica bloqueada para jogadores após a criação; o mestre pode alterá-la.</p>
       ${profileFields(s,editable)}<div id="autosave" class="save-indicator" aria-live="polite">✓ Autosave ativado</div>`:""}
     </section>${attributes(s,role==="GM")}</div>`;
   return `${gameplayTabs()}<div class="game-tab-panel" role="tabpanel" aria-label="Status">
     <section class="card"><p class="kicker">Ficha NPC</p><h2>🎭 ${escapeHTML(s.name)}</h2>
     <label class="field">Nome<input data-profile="name" maxlength="80" value="${escapeHTML(s.name)}" ${editable?"":"disabled"}></label>
     <div id="autosave" class="save-indicator" aria-live="polite">✓ Autosave ativado</div></section>
     ${attributes(s,editable)}</div>`;
 }
  // O token de bola é a ficha oficial da jogada; a cena mantém um espelho sincronizado.
  function ballState(){return (isBall(selected)?selected?.metadata?.[BALL_STATE]:null)||rally;}
  function timerCard(){
    const s=ballState(),t=s?.timer;
    if(!s?.reception||s.ended)return "";
    const q=s.quality||"—",label=q==="Ace"?"Ace":`Passe ${q}`;
    const ms=timerRemaining(t);
    const canPlay=role==="GM"&&!s.ended&&!s.receptionPending&&s.phase==="aguardando_mestre"&&s.setterId&&s.reachPassed&&s.setterRunDone&&
      (t?.status==="idle"||t?.status==="paused"||t?.status==="error");
    const canPause=role==="GM"&&t?.status==="running";
    const statusLabel={idle:"Aguardando Play",paused:"Pausado",running:"Em andamento",resolving:"Levantamento no Dice+",done:"Levantamento realizado",error:"Falha na rolagem",disabled:"Sem timer"}[t?.status]||"Aguardando";
    return `<section class="card reception-card"><p class="kicker">Bola · Levantamento</p>
      <h2>🏐 ${escapeHTML(label)} · ${s.reception?.total??"—"} vs ${s.total??"—"}</h2>
      <div class="stat"><span>Margem do Passe</span><b>${s.reception?.difference>0?"+":""}${s.reception?.difference??"—"}</b></div>
      <div class="stat"><span>Levantador</span><b>${escapeHTML(s.setterName||"Não escolhido")}</b></div>
      <div class="stat"><span>Condição</span><b>${q==="C"?"−1 no Levantamento":q==="D"?"Desvantagem":"Normal"}</b></div>
      <div class="stat"><span>Corrida do levantador</span><b>${Number(s.setterRunMeters||0).toFixed(2).replace(".",",")} m · −${s.setterRunPenalty||0}</b></div>
      <p class="small">${QUALITY_RULES[q]?.reach&&!s.reachPassed?`É necessário obter ${QUALITY_RULES[q].reach} ou mais no 1d20 e chegar à bola antes do Play.`:!s.setterRunDone?"Aguardando o deslocamento do levantador.":"Corrida concluída. Timer liberado para o mestre."}</p>
      <div style="font-variant-numeric:tabular-nums;font-size:32px;font-weight:900;text-align:center" data-ball-clock>${fmtTimer(ms)}</div>
      <p class="small" style="text-align:center">${statusLabel}. ${t?.status==="done"?`Resultado do Levantamento: ${s.lifting?.total??"—"}`:""}</p>
      ${role==="GM"&&view==="mestre"?`<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px">
        <button data-act="timer-play" ${canPlay?"":"disabled"}>▶ Play</button>
        <button data-act="timer-pause" ${canPause?"":"disabled"}>⏸ Pausar</button>
        <button data-act="timer-reset" ${["running","paused","idle","error"].includes(t?.status)?"":"disabled"}>↺ Reset</button>
      </div><p class="small">Só o mestre controla o timer. Ao zerar, o Dice+ faz o Levantamento automaticamente.</p>`:""}
    </section>`;
  }
  // Aba exclusiva de atletas cadastrados na posição Levantador.
  function setterCard(){
    if(!isCharacter(selected)||currentSheet().position!=="Levantador")return "";
    const current=rally;
    if(!current?.reception||!QUALITY_RULES[current.quality])
      return `<section class="card"><h2>🏐 Levantamento</h2><p class="small">Aguarde a recepção do saque para liberar a corrida do Levantador.</p></section>`;
    const assigned=current.setterId===selectedId,rule=QUALITY_RULES[current.quality];
    const failure=current.phase==="alcance_falhou";
    const finished=current.phase==="levantado"||current.phase==="resolvendo";
    const active=!current.ended&&!current.receptionPending&&!['passe_em_voo','passe_movimento_falhou'].includes(current.phase);
    const canChoose=active&&!current.setterId;
    const canTest=active&&assigned&&current.phase==="aguardando_alcance";
    const canRetry=active&&assigned&&current.phase==="corrida_erro";
    const meters=Number(current.setterRunMeters||0);
    const distanceText=`${meters.toFixed(2).replace(".",",")} m`;
    return `<section class="card reception-card"><p class="kicker">Gameplay • Levantador</p><h2>🏃 Corrida do Levantador</h2>
      <p class="small">Passe ${escapeHTML(current.quality)}: ${rule.reach?`alcance no D20 natural ≥ ${rule.reach}`:"a bola chega diretamente ao levantador (automático)"}.</p>
      <div class="stat"><span>Levantador</span><b>${escapeHTML(current.setterName||"Ainda não escolhido")}</b></div>
      <div class="stat"><span>Distância a percorrer</span><b>${assigned?distanceText:"Calculada ao assumir a jogada"}</b></div>
      <div class="stat"><span>Penalidade de corrida</span><b>${assigned?`−${current.setterRunPenalty||0}`:"−1 a cada 3 m"}</b></div>
      <p class="small">${rule.penalty<0?"Passe C: −1 adicional no Levantamento. ":""}${rule.disadvantage?"Passe D: Levantamento com desvantagem. ":""}A penalidade de corrida é cumulativa.</p>
      ${canChoose?`<button class="wide blue" data-act="choose-setter" ${busy?"disabled":""}>🏐 Assumir e ${rule.reach?"preparar corrida":"receber a bola automaticamente"}</button>`:""}
      ${canTest?`<button class="wide blue" data-act="test-reach" ${busy?"disabled":""}>🎲 Correr até a bola · 1d20 ≥ ${rule.reach}</button>`:""}
      ${canRetry?`<button class="wide blue" data-act="retry-setter-run" ${busy?"disabled":""}>🔄 Repetir deslocamento interrompido</button>`:""}
      ${current.phase==="corrida_levantador"&&assigned?'<p class="notice">🏃 Deslocamento em andamento. Aguarde a bola ou o Levantador chegar ao destino.</p>':""}
      ${assigned&&current.setterRunDone?`<p class="notice">✅ ${current.quality==="A"?"A bola chegou ao Levantador.":"Levantador chegou à bola."} Penalidade da corrida: −${current.setterRunPenalty||0}. Aguardando Play do mestre.</p>`:""}
      ${failure?`<p class="notice warn">❌ O Levantador falhou no teste de alcance (D20 ${current.reachTotal??"—"}). Bola no chão, rally encerrado e +1 ponto à equipe sacadora.</p>`:""}
      ${current.phase==="corrida_erro"&&assigned?'<p class="notice warn">⚠️ O Owlbear não confirmou o movimento. Tente novamente sem repetir a rolagem.</p>':""}
      ${current.ended&&!failure?'<p class="small">O rally já terminou.</p>':""}
      ${finished?'<p class="small">O levantamento já foi resolvido.</p>':""}
      ${!assigned&&current.setterId?'<p class="small">Outro levantador já assumiu esta jogada.</p>':""}
    </section>`;
  }
  async function commitRally(next,addPoint=false){
    const ball=items.find(isBall);
    if(!ball)throw Error("Defina uma bola oficial em Montarias.");
    const current=(await OBR.scene.getMetadata())[RALLY];
    if(!current||current.serveId!==next.serveId||current.timestamp!==next.timestamp)
      throw Error("O rally foi alterado. Atualize a ficha antes de continuar.");
    await OBR.scene.items.updateItems([ball.id],draft=>{
      for(const i of draft)i.metadata[BALL_STATE]={...next,ballId:ball.id};
    });
    const patch={[RALLY]:{...next,ballId:ball.id}};
    if(addPoint){const meta=await OBR.scene.getMetadata();const sc=cleanScore(meta[SCORE]);sc[next.sourceTeam]++;patch[SCORE]=sc;}
    await OBR.scene.setMetadata(patch);
    rally=patch[RALLY];
    render();
  }
  let setterMovementActive=false;
  // A: a bola chega ao levantador. B/C/D: o levantador corre até a bola.
  // Reaproveita a animação verificada da recepção, sem depender de broadcast.
  async function completeSetterMovement(){
    if(setterMovementActive)throw Error("Já existe um deslocamento de levantador em andamento.");
    setterMovementActive=true;
    try{
      const current=(await OBR.scene.getMetadata())[RALLY];
      if(!current?.setterId||current.phase!=="corrida_levantador"||!current.setterMoveTarget)
        throw Error("Nenhuma corrida do Levantador está pendente.");
      const identity={kind:"setter",serveId:current.serveId,timestamp:current.timestamp,setterId:current.setterId};
      await moveTokenToCenter(current.setterMoveTokenId,current.setterMoveTarget,identity,
        current.quality==="A"?"bola até o Levantador":"Levantador até a bola");
      const latest=await assertPassIsCurrent(identity);
      await commitRally({...latest,reachPassed:true,setterRunDone:true,phase:"aguardando_mestre"});
      return latest;
    }catch(error){
      const now=(await OBR.scene.getMetadata())[RALLY];
      if(now?.phase==="corrida_levantador")
        await commitRally({...now,reachPassed:false,setterRunDone:false,phase:"corrida_erro",setterMoveError:error.message}).catch(console.warn);
      throw error;
    }finally{setterMovementActive=false;}
  }
  async function chooseSetter(){
    const current=(await OBR.scene.getMetadata())[RALLY];
    if(!current?.reception||current.ended||current.receptionPending||
      ["passe_em_voo","passe_movimento_falhou"].includes(current.phase)||!QUALITY_RULES[current.quality])
      throw Error("Aguarde a conclusão da Recepção antes de iniciar o Levantamento.");
    if(current.setterId)throw Error("Um Levantador já assumiu o rally.");
    if(!isCharacter(selected)||currentSheet().position!=="Levantador")
      throw Error("Essa ação é exclusiva de personagens da posição Levantador.");
    const setterId=selectedId;
    const [token]=await OBR.scene.items.getItems([setterId]);
    const bounds=await OBR.scene.items.getItemBounds([setterId]);
    const setterCenter=bounds?.center||token?.position;
    if(!setterCenter||!isCourt(court))throw Error("Quadra ou posição do Levantador inválida.");
    if(teamOfPosition(setterCenter,court)!==current.recipientTeam)
      throw Error("O Levantador precisa pertencer à equipe que recebeu o saque.");
    const balls=await OBR.scene.items.getItems(isBall);
    if(balls.length!==1)throw Error("Selecione uma única bola oficial.");
    const ballBounds=await OBR.scene.items.getItemBounds([balls[0].id]);
    const ballCenter=ballBounds?.center||balls[0].position;
    if(!ballCenter)throw Error("Não foi possível identificar a posição da bola.");
    const isA=current.quality==="A";
    const dpi=await OBR.scene.grid.getDpi();
    const run=isA?{meters:0,cells:0,penalty:0}:receptionDistance(setterCenter,ballCenter,dpi);
    const next={...current,setterId,setterName:currentSheet().name,
      setterRunMeters:run.meters,setterRunCells:run.cells,setterRunPenalty:run.penalty,
      setterMoveTokenId:isA?balls[0].id:setterId,
      setterMoveTarget:isA?{...setterCenter}:{...ballCenter},
      reachPassed:false,setterRunDone:false,reachTotal:null,
      phase:isA?"corrida_levantador":"aguardando_alcance",timer:newTimer(current.quality)};
    await commitRally(next);
    if(isA){
      await completeSetterMovement();
      status("✅ Passe A! A bola foi até o Levantador, sem rolagem de alcance ou penalidade de corrida. Timer de 20 s liberado.");
    }else{
      status(`🏃 Passe ${current.quality}: Levantador a ${run.meters.toFixed(2).replace(".",",")} m da bola (−${run.penalty} no Levantamento). Role 1d20 natural ≥ ${QUALITY_RULES[current.quality].reach}.`);
    }
  }
  async function reachTest(){
    const current=(await OBR.scene.getMetadata())[RALLY];
    if(!current||current.setterId!==selectedId||current.phase!=="aguardando_alcance"||
       current.ended||!QUALITY_RULES[current.quality]?.reach)
      throw Error("O teste de alcance não está disponível para este Levantador.");
    const required=QUALITY_RULES[current.quality].reach;
    const rolled=await requestDice("1d20",`Corrida até a bola de ${current.setterName} · Passe ${current.quality}`,true);
    const latest=(await OBR.scene.getMetadata())[RALLY];
    if(latest?.serveId!==current.serveId||latest?.timestamp!==current.timestamp||
       latest?.setterId!==current.setterId||latest?.phase!=="aguardando_alcance")
      throw Error("A jogada foi alterada durante o teste de alcance.");
    const natural=rolled.natural;
    if(!Number.isInteger(natural))throw Error("O Dice+ não retornou um D20 natural para o alcance.");
    if(natural<required){
      await commitRally({...latest,reachPassed:false,reachTotal:natural,ended:true,
        phase:"alcance_falhou",timer:newTimer(null)},true);
      status(`❌ ${current.setterName} tirou ${natural} (precisava ${required}). Não alcançou a bola! Fim do rally e +1 ponto para a equipe sacadora.`,"warn");
      return;
    }
    // Mede novamente os centros imediatamente antes da corrida efetiva.
    const [setter]=await OBR.scene.items.getItems([current.setterId]);
    const balls=await OBR.scene.items.getItems(isBall);
    if(!setter||balls.length!==1)throw Error("Levantador ou bola não localizado.");
    const [setterBounds,ballBounds,dpi]=await Promise.all([
      OBR.scene.items.getItemBounds([setter.id]),OBR.scene.items.getItemBounds([balls[0].id]),OBR.scene.grid.getDpi()]);
    const from=setterBounds?.center||setter.position,to=ballBounds?.center||balls[0].position;
    const run=receptionDistance(from,to,dpi);
    const working={...latest,reachTotal:natural,reachPassed:false,setterRunDone:false,
      setterRunMeters:run.meters,setterRunCells:run.cells,setterRunPenalty:run.penalty,
      setterMoveTokenId:setter.id,setterMoveTarget:{...to},phase:"corrida_levantador"};
    await commitRally(working);
    await completeSetterMovement();
    status(`✅ ${current.setterName} alcançou a bola (D20 ${natural})! Corrida: ${run.meters.toFixed(2).replace(".",",")} m, −${run.penalty} no Levantamento. Aguardando Play do mestre.`);
  }
  async function retrySetterMovement(){
    const current=(await OBR.scene.getMetadata())[RALLY];
    if(current?.phase!=="corrida_erro"||current.setterId!==selectedId||current.ended)
      throw Error("Não há uma corrida pendente para esse Levantador.");
    await commitRally({...current,phase:"corrida_levantador"});
    await completeSetterMovement();
    status(`✅ Deslocamento concluído! Aguardando Play do mestre.`);
  }
  async function controlTimer(action){
    if(role!=="GM")throw Error("Apenas o mestre controla o timer.");
    const current=(await OBR.scene.getMetadata())[RALLY];
    if(!current?.reception||current.ended||current.receptionPending||!QUALITY_RULES[current.quality])throw Error("Aguarde a conclusão do Passe antes de controlar o Levantamento.");
    const now=Date.now(),old=current.timer||newTimer(current.quality);
    let next;
    if(action==="play"){
      if(!current.setterId||!current.reachPassed||!current.setterRunDone||current.phase!=="aguardando_mestre")
        throw Error("O Levantador precisa alcançar a bola e concluir o deslocamento antes do Play.");
      if(!["idle","paused","error"].includes(old.status))throw Error("O timer não está disponível para Play.");
      const remaining=old.status==="error"?old.durationMs:timerRemaining(old,now);
      next={...old,status:"running",remainingMs:remaining,endsAt:now+remaining};
    }else if(action==="pause"){
      if(old.status!=="running")throw Error("O timer não está rodando.");
      next={...old,status:"paused",remainingMs:timerRemaining(old,now),endsAt:null};
    }else if(action==="reset"){
      if(["resolving","done"].includes(old.status))throw Error("O Levantamento já está resolvido.");
      next=newTimer(current.quality);
    }else throw Error("Comando de timer inválido.");
    await commitRally({...current,timer:next,phase:"aguardando_mestre"});
    status(action==="play"?"▶ Timer iniciado pelo mestre.":action==="pause"?"⏸ Timer pausado pelo mestre.":"↺ Timer reiniciado.");
  }
  setInterval(()=>{
    if(!rally?.timer)return;
    for(const el of document.querySelectorAll("[data-ball-clock]"))el.textContent=fmtTimer(timerRemaining(rally.timer));
  },200);

   function ballPanel(){
    const s=ballState();
    return `<section class="card reception-card"><p class="kicker">Ficha Independente · Bola</p>
      <h2>${isBall(selected)?"🏐 Bola oficial":"Objeto selecionado"}</h2>
      <p class="small">${escapeHTML(selected?.name||"Objeto")}</p>
      <div class="stat"><span>Último saque</span><b>${escapeHTML(ballDescription(s))}</b></div>
      <div class="stat"><span>Local do saque</span><b>${escapeHTML(s?.landingZone||"—")}</b></div>
      ${s?.passLanding?`<div class="stat"><span>Destino do Passe ${escapeHTML(s.quality)}</span><b>${escapeHTML(s.passLandingZone||"Marcado no mapa")}</b></div>`:""}
      <div class="stat"><span>Dificuldade de recepção</span><strong style="font-size:24px">${s?.total??"—"}</strong></div>
      ${s?.setterId?`<div class="stat"><span>Levantador</span><b>${escapeHTML(s.setterName||"—")}</b></div>
        <div class="stat"><span>Corrida / penalidade</span><b>${Number(s.setterRunMeters||0).toFixed(2).replace(".",",")} m · −${s.setterRunPenalty||0}</b></div>`:""}
      ${s?.phase==="alcance_falhou"?'<p class="notice warn">❌ Falha do Levantador: bola no chão, ponto do time sacador.</p>':""}
      ${s?.reception?`<div class="stat"><span>Recepção</span><b>${escapeHTML(s.reception.receiverName||"Receptor")} · ${s.reception.total}</b></div>
        ${Number.isFinite(s.reception.distanceMeters)?`<div class="stat"><span>Distância até a bola</span><b>${s.reception.distanceMeters.toFixed(2).replace(".",",")} m</b></div>
        <div class="stat"><span>Penalidade de distância</span><b>−${s.reception.distancePenalty||0} (${escapeHTML(s.reception.attribute||"Passe")})</b></div>`:""}
        <div class="stat"><span>Qualidade</span><b>${s.quality==="Ace"?"Ace":"Passe "+escapeHTML(s.quality)}</b></div>`:""}
      ${s?.lifting?`<div class="stat"><span>Levantamento</span><b>${s.lifting.total} · ${escapeHTML(s.lifting.setterName)}</b></div>`:""}
      ${role==="GM"?`<button class="wide primary" data-act="${isBall(selected)?"unmark":"mark"}">${isBall(selected)?"Desmarcar bola":"🏐 Definir como bola"}</button>`:'<p class="small">Somente o mestre pode definir a bola.</p>'}
    </section>${timerCard()}`;
  }
 function gmPanel(){if(role!=="GM")return '<section class="card">Acesso restrito ao mestre.</section>';
 return `<section class="card"><p class="kicker">Ficha Mestre</p><h2>⚙️ Partida</h2>
 <div class="stat"><span>Quadra A/B</span><b>${isCourt(court)?"Marcada manualmente":"Pendente"}</b></div>
 <div class="stat"><span>Bolas oficiais</span><b>${items.filter(isBall).length}</b></div>
 <div class="stat"><span>NPCs</span><b>${items.filter(i=>isCharacter(i)&&sheetOf(i).kind==="npc").length}</b></div>
 <p class="small">Grade: ${escapeHTML(grid||"não definida")}. Referência do RPG: 1 casa = 1,5 m.</p></section>
  ${timerCard()}
  <section class="card"><h2>📊 Placar do Rally</h2><div class="scoreboard"><div>Time A<strong>${score.allies}</strong></div><div>Time B<strong>${score.enemies}</strong></div></div>
 <p class="small">${rally?.ended?(rally.phase==="alcance_falhou"?"Levantador não alcançou a bola: ponto do sacador.":rally.quality==="Ace"?"Ace — ponto direto do sacador.":"Último rally encerrado: bola fora."):rally?.reception?`Passe ${rally.quality} registrado na bola. Próxima etapa: Levantamento.`:rally?.awaitingReception?"Rally aberto: aguardando recepção.":"Nenhuma recepção pendente."}</p>
 <button class="wide" data-act="reset-score">Zerar placar (Mestre)</button></section>
 <section class="card"><p class="kicker">Controles exclusivos do Mestre</p><h2>🔄 Reiniciar jogada ou set</h2>
 <p class="small">Reiniciar Saque/Rally limpa a jogada atual e o timer, mas mantém o placar. Reiniciar Set também zera os pontos. Quadra e fichas não são apagadas.</p>
 <div class="gm-restart">
   <button data-act="reset-rally">🏐 Resetar Saque</button>
   <button data-act="reset-set">🔄 Reiniciar Set</button>
 </div></section>
 <section class="card"><p class="kicker">Quadra · Controle do mestre</p><h2>📐 Definir áreas MANUALMENTE</h2>
 <p class="small">Não há tamanho de quadra nem borda vermelha imposto pelo plugin. Você define as áreas no mapa, selecionando dois cantos de cada retângulo. 1 quadradinho do Owlbear = 1,5 m.</p>
 <p class="small"><b>1.</b> Área total: limite externo em vermelho.<br><b>2.</b> Time A: área válida do A (azul).<br>
 <b>3.</b> Time B: área válida do B (verde).<br><b>4.</b> Linha dos 3 m de cada time (amarela): 1 clique na posição desejada.</p>
 <p class="small">FORA = qualquer lugar que não seja território A/B. Dentro das áreas dos times, a linha amarela separa <b>ATÉ a linha dos 3 m (frente)</b> e <b>DEPOIS da linha (fundo)</b>.</p>
 <p class="small">🏐 <b>Novas regras:</b> Saque por Cima e Viagem não caem na frente da linha de 3m. Passe A: 3 casas centrais na rede; B: próximas 2 fileiras, largura total; C: faixa intermediária/fundo com 1 grid lateral externo; D: últimas 2 fileiras e toda a faixa externa atrás do fundo.</p>
 ${[["outer","Área total / Fora"],["a","Time A — dentro"],["b","Time B — dentro"],["lineA","Linha dos 3 m — A"],["lineB","Linha dos 3 m — B"]].map(([key,title])=>{
   const done=key==="lineA"?Number.isFinite(court?.lines?.a):key==="lineB"?Number.isFinite(court?.lines?.b):rectValid(court?.areas?.[key]);
   const locked=(key!=="outer"&&!rectValid(court?.areas?.outer))||(key.startsWith("line")&&!isCourt(court));
   return `<button class="wide" style="margin:4px 0;text-align:left" data-court-task="${key}" ${locked?"disabled":""}>${done?"✅":"⬜"} ${title} · ${key.startsWith("line")?"1 clique":"2 cantos"}</button>`;
 }).join("")}
 <p class="small">${isCourt(court)?"✅ Time A/B definidos. Você pode recalibrar qualquer área.":"⚠️ Marque primeiro a área total e os dois times."}</p>
 ${selected?`<button class="wide" data-act="check-position">📍 Identificar região do token selecionado</button>`:""}
 <button class="wide" data-act="toggle-zones">${court?.showZones===false?"👁 Exibir divisões no mapa":"🙈 Ocultar divisões no mapa"}</button>
 <button class="wide" style="margin-top:8px" data-act="clear-court">🗑 Apagar marcações da quadra</button>
 </section>
 ${isCharacter(selected)?`<section class="card"><h2>Classificar token</h2><div class="controls"><button data-act="type-player">👤 Registrar como Jogador</button><button data-act="type-npc">🎭 Registrar como NPC</button></div></section>`:""}
 ${selected?.layer==="MOUNT"?ballPanel():""}`;}
 function render(){let body="";
   if(isCharacter(selected))body=view==="choose"?choose():view==="mestre"?gmPanel():characterSheet(view);
   else if(selected?.layer==="MOUNT")body=ballPanel();
   else if(view==="mestre"&&role==="GM")body=gmPanel();
   else body=`<section class="card"><h2>Selecione um token</h2><p class="small">Clique no token de personagem. A ficha abre à esquerda, sem cobrir as ferramentas à direita.</p>
     ${role==="GM"?'<button class="wide primary" data-act="master-no-token">⚙️ Abrir ficha Mestre</button>':""}</section>`;
   const result=rally?.quality&&rally?.reception;
   const movementStatus=rally?.phase==="passe_em_voo"?
      (rally.passMoveStage==="bola"?"Receptor chegou! Bola subindo para a zona do Passe…":"Receptor se deslocando para a casa da bola…"):null;
   const classification=result?`<section class="pass-result result-${String(rally.quality).toLowerCase()}" aria-live="polite">
      <strong>${rally.quality==="Ace"?"🚫 ACE — PONTO DIRETO":`🏐 PASSE ${escapeHTML(rally.quality)}!`}</strong>
      <small>${escapeHTML(rally.reception.receiverName||"Receptor")}: ${rally.reception.total} no teste contra ${rally.total} do saque.
      ${rally.quality==="Ace"?"Rally encerrado.":rally.phase==="alcance_falhou"?"Levantador não alcançou a bola. Fim do rally; ponto do time sacador.":rally.phase==="passe_movimento_falhou"?"Movimento pendente. Use Mover novamente.":movementStatus||`Destino: zona ${escapeHTML(rally.quality)}. Timer: ${QUALITY_RULES[rally.quality]?.seconds||0} segundos (mestre controla).`}</small>
     </section>`:"";
   const retry=rally?.phase==="passe_movimento_falhou"?`<button class="wide" data-act="retry-pass-move" style="margin-bottom:12px">🔁 Repetir movimento (receptor → bola) — Passe ${escapeHTML(rally.quality)}</button>`:"";
   app.innerHTML=header()+`<main>${message?`<div class="notice ${escapeHTML(messageType)}" role="status">${escapeHTML(message)}</div>`:""}${classification}${retry}${body}${isCharacter(selected)&&view!=="choose"?'<div class="sheet-type-footer"><button class="switch" data-act="switch">⇄ Trocar tipo de ficha</button></div>':""}<footer>Haikyuu!! Road to the Top • Dice+</footer></main>`;
 }
 async function selectedChanged(ids){const id=ids?.length===1?ids[0]:null,serial=++selectSerial;
   const changed=id!==selectedId;
   if(changed){
     const previous=selectedId;if(previous&&pending.has(previous))void flush(previous);
     view="choose";manualTypeChoice=false;editingProfile=false;message="";
     panelTab=tabByToken.get(id)||"status";
   }selectedId=id;
   if(!id||!(await OBR.scene.isReady())){selected=null;render();return;}
   const [i]=await OBR.scene.items.getItems([id]);if(serial!==selectSerial)return;
   selected=i||null;
   if(panelTab==="setter"&&sheetOf(selected).position!=="Levantador")panelTab="status";
   // Evita reabrir a tela de seleção quando o tipo já está registrado.
   if(changed&&!manualTypeChoice)view=rememberedViewFor(selected,role);
   render();
 }
 async function saveSheet(patch,id=selectedId){if(!id)throw Error("Selecione um personagem.");
   if(id===selectedId){stage(patch,true);await flush(id);return;}
   await OBR.scene.items.updateItems([id],draft=>{for(const i of draft){const old=i.metadata[SHEET]||{},data=mergePatch(sheetOf(i),patch);i.metadata[SHEET]={...old,...data};}});
 }
 // Ativa a mira na ferramenta de seleção sempre que possível, sem exigir clicar no ícone.
 // Calibração permanece no modo exclusivo do Haikyuu para não interferir na seleção.
 // Ativa a mira em QUALQUER ferramenta atual, sem clicar no ícone da extensão.
 // O SDK permite ativar um modo, mas não escolher outra ferramenta principal;
 // por isso registramos AUTO_SERVE sem filtro de activeTools.
 async function prepare(mode,metadata){
   const currentTool=await OBR.tool.getActiveTool();
   const currentMode=await OBR.tool.getActiveToolMode();
   if(mode===SERVE&&currentMode!==AUTO_SERVE && currentMode!==SERVE && currentMode!==POINTER_SERVE){
     restoreToolId=currentTool;
     restoreModeId=currentMode;
   }
   const data=mode===SERVE?{
     ...metadata,restoreTool:restoreToolId,restoreMode:restoreModeId
   }:{...metadata};
   await OBR.tool.setMetadata(TOOL,data);
   if(mode===SERVE){
     // Primeiro avisa o background: quando o modo abrir, a mira já tem os dados.
     await OBR.broadcast.sendMessage(ARM_EVENT,{
       playerId:await OBR.player.getId(),metadata:data
     },{destination:"ALL"});
     try{
       await OBR.tool.activateMode(currentTool,AUTO_SERVE);
     }catch(err){
       console.warn("Haikyuu: modo de mira automática não ativado",err);
       // A ferramenta original do Haikyuu continua como alternativa manual.
       if(currentTool===TOOL)await OBR.tool.activateMode(TOOL,SERVE);
     }
   }else{
     await OBR.tool.activateMode(TOOL,mode);
   }
   return {
     tool:await OBR.tool.getActiveTool(),
     mode:await OBR.tool.getActiveToolMode()
   };
 }
 const aimActivated=state=>(state.mode===AUTO_SERVE)||
   (state.tool===POINTER_TOOL&&state.mode===POINTER_SERVE)||
   (state.tool===TOOL&&state.mode===SERVE);
 async function readyDice(){const requestId=newId();return new Promise(resolve=>{
   let done=false,timer;const finish=val=>{if(done)return;done=true;clearTimeout(timer);unsubscribe();resolve(val);};
   const unsubscribe=OBR.broadcast.onMessage("dice-plus/isReady",event=>{
     if(event.data?.ready===true&&event.data.requestId===requestId)finish(true);
   });
   timer=setTimeout(()=>finish(false),1600);
   OBR.broadcast.sendMessage("dice-plus/isReady",{requestId,timestamp:Date.now()},{destination:"ALL"}).catch(()=>finish(false));
 });}
 // Dice+ é a única fonte do dado; não simulamos D20 local como substituto.
 async function requestDice(notation,label,requireNatural=false){
   if(!(await readyDice()))throw Error("Dice+ não respondeu. Confira se está ativado na sala.");
   const id=newId();
   return new Promise(async(resolve,reject)=>{
     const timer=setTimeout(()=>{
       if(rolls.has(id)){rolls.delete(id);reject(Error("O Dice+ não retornou o resultado. Tente novamente."));}
     },45000);
     rolls.set(id,{label,requireNatural,resolve:r=>{clearTimeout(timer);resolve({...r,notation,rollId:id});},reject:e=>{clearTimeout(timer);reject(e);}});
     try{
       await OBR.broadcast.sendMessage("dice-plus/roll-request",{
         rollId:id,playerId:await OBR.player.getId(),playerName:await OBR.player.getName(),rollTarget:"everyone",
         diceNotation:labeledDiceNotation(notation,label),showResults:true,timestamp:Date.now(),source:ID
       },{destination:"ALL"});
     }catch(e){const pending=rolls.get(id);if(pending){rolls.delete(id);pending.reject(e);}}
   });
 }
 function makeNotation(modifier,dice="1d20"){
   return `${dice}${modifier<0?"-":"+"}${Math.abs(modifier)}`;
 }
 async function roll(attr){
   const s=currentSheet();
   const n=makeNotation(s.attributes[attr]);
   const r=await requestDice(n,`${attr} de ${s.name}`);
   return `${attr} de ${s.name}: ${n} = ${r.total}${r.natural!==null?` (D20 natural ${r.natural})`:""}`;
 }
 async function startServe(type){
   const t=SERVE_TYPES[type];
   if(!t)throw Error("Tipo de Saque inválido.");
   if(view==="jogador"&&!currentSheet().created)throw Error("Conclua a criação antes de sacar.");
   if(!isCourt(court))throw Error("O mestre precisa delimitar a área total e as quadras A/B.");
   if(items.filter(isBall).length!==1)throw Error("O mestre deve definir uma bola em Montarias.");
   if(!isCharacter(selected))throw Error("Selecione o sacador.");
   // O novo saque inicia um novo rally. Uma recepção pendente do saque anterior
   // não pode bloquear o próximo saque (especialmente durante testes repetidos).
   const sessionMeta=await OBR.scene.getMetadata();
   if(sessionMeta[LOCK]?.until>Date.now())throw Error("Aguarde o saque atual terminar.");
   if(sessionMeta[RALLY]?.phase==="passe_em_voo"||sessionMeta[RALLY]?.receptionPending)
     throw Error("Aguarde o receptor chegar à bola e o Passe terminar antes de sacar novamente.");
   const serverId=selectedId;
   latestPreparedRollId=null;
   // Uma nova tentativa não deve reutilizar o modo original de um saque antigo.
   // Uma nova ação não reaproveita o modo anterior de um saque concluído.
   if((await OBR.tool.getActiveToolMode())!==AUTO_SERVE){restoreToolId=null;restoreModeId=null;}
   const s=currentSheet();
   const modifier=s.attributes.Saque+t.mod;
   // Encerra apenas a recepção pendente ANTERIOR, sem atribuir ponto extra.
   // O recebedor ainda pode receber normalmente se nenhum novo saque for escolhido.
   const nowMeta=await OBR.scene.getMetadata();
   const oldRally=nowMeta[RALLY];
   if(oldRally?.awaitingReception){
     const ended={...oldRally,awaitingReception:false,receptionPending:false,ended:true,
       replacedByNewServe:true};
     await OBR.scene.setMetadata({[RALLY]:ended});
     const previousBall=items.find(isBall);
     if(previousBall)await OBR.scene.items.updateItems([previousBall.id],draft=>{
       for(const item of draft)item.metadata[BALL_STATE]=ended;
     });
     rally=ended;
   }
   // A mira fica preparada enquanto os dados rolam; um clique antes do resultado não lança a bola.
   const initialAim=await prepare(SERVE,{serverId,serveType:type,rollConfirmed:false,natural:0,total:0,rollId:""});
   status(`🎲 ${t.name} de ${s.name}: rolando ${makeNotation(modifier)} no Dice+… ${aimActivated(initialAim)?"Mira ativada diretamente no mapa.":"O Owlbear não confirmou a mira: selecione 🏐 na barra como alternativa."}`);
   try{
     const r=await requestDice(makeNotation(modifier),`${t.name} de ${s.name}`,true);
     if(selectedId!==serverId)throw Error("O token selecionado mudou durante o saque. Prepare novamente.");
     const aimState=await prepare(SERVE,{serverId,serveType:type,rollConfirmed:true,natural:r.natural,total:r.total,rollId:r.rollId});
     latestPreparedRollId=r.rollId;
     const hasAim=aimActivated(aimState);
     const fail=r.natural<=t.fail;
     if(fail){
       status(`🚫 ${t.name}: D20 natural ${r.natural}. Bola saindo da quadra...`,"warn");
       await finishAutomaticFault({
         playerId:await OBR.player.getId(),serverId,type,rollId:r.rollId
       });
       status(`🚫 ${t.name}: D20 ${r.natural}. Erro automático e ponto adversário. ✅ Já pode sacar novamente.`,"warn");
     }else{
       status(`🎲 ${t.name} de ${s.name}: D20 natural ${r.natural}; total ${r.total}. ${hasAim?"🎯 Mira automática pronta! Mova o mouse para a quadra adversária.":"⚠️ Não foi possível ativar a ferramenta atual. Selecione 🏐 na barra para mirar."}`,
         hasAim?"ok":"warn");
     }
   }catch(err){
       await OBR.tool.setMetadata(TOOL,{serverId:"",serveType:"",rollConfirmed:false,natural:0,total:0,rollId:""}).catch(console.warn);
     await OBR.broadcast.sendMessage(ARM_EVENT,{playerId:await OBR.player.getId(),metadata:null},{destination:"ALL"}).catch(console.warn);
     throw err;
   }
 }
 // O erro automático é executado pelo processo de fundo; aguardar o aviso
 // impede disparar outro saque enquanto a bola anterior ainda está voando.
 async function finishAutomaticFault(payload){
   return new Promise((resolve,reject)=>{
     let settled=false;
     const clean=()=>{clearTimeout(timeout);unsubscribe();};
     const done=(error,data)=>{if(settled)return;settled=true;clean();error?reject(error):resolve(data);};
     const unsubscribe=OBR.broadcast.onMessage(`${ID}/serve-finished`,event=>{
       const data=event.data;
       if(data?.rollId!==payload.rollId||data?.playerId!==payload.playerId)return;
       if(!data.ok)done(Error(data.error||"Não foi possível concluir o saque automático."));
       else done(null,data);
     });
     const timeout=setTimeout(()=>done(Error("A animação do saque não confirmou o término. Confira a bola no mapa.")),15000);
     OBR.broadcast.sendMessage(`${ID}/auto-fault`,payload,{destination:"ALL"}).catch(done);
   });
 }
  // v0.25 — Passe/Defesa: receptor e bola são movidos NA MESMA janela
  // que executa o teste no Dice+. A versão anterior dependia de um evento
  // broadcast recebido por outro processo; o evento podia não chegar e
  // o personagem se movia, mas a bola permanecia na casa inicial.
  // Aqui há apenas uma sequência e um destino persistido para cada token.
  let passMovementActive=false;
  async function assertPassIsCurrent(identity){
    const now=(await OBR.scene.getMetadata())[RALLY];
    const sameRally=now&&now.serveId===identity.serveId&&now.timestamp===identity.timestamp;
    const valid=identity.kind==="setter"
      ?sameRally&&now.setterId===identity.setterId&&now.phase==="corrida_levantador"&&!now.ended
      :sameRally&&now.receiverId===identity.receiverId&&now.phase==="passe_em_voo";
    if(!valid)throw Error("O rally mudou durante o movimento. O deslocamento foi interrompido para proteger a partida.");
    return now;
  }
  // Move o token pelo CENTRO, mas atualiza a âncora original do item.
  // A posição final é aplicada e verificada independentemente da animação.
  async function moveTokenToCenter(tokenId,targetCenter,identity,stepName){
    if(!targetCenter||![targetCenter.x,targetCenter.y].every(Number.isFinite))
      throw Error(`Destino inválido para ${stepName}.`);
    await assertPassIsCurrent(identity);
    const [token]=await OBR.scene.items.getItems([tokenId]);
    if(!token)throw Error(`Token de ${stepName} não encontrado.`);
    if(token.locked)throw Error(`O token de ${stepName} está bloqueado no Owlbear. Desbloqueie-o.`);
    const bounds=await OBR.scene.items.getItemBounds([tokenId]);
    const center=bounds?.center||token.position;
    if(!center||![center.x,center.y].every(Number.isFinite))
      throw Error(`Não foi possível encontrar o centro do token de ${stepName}.`);
    const from={x:token.position.x,y:token.position.y};
    // Calcula UMA VEZ: a animação não depende de bounds intermediários atrasados.
    const to={x:from.x+targetCenter.x-center.x,y:from.y+targetCenter.y-center.y};
    const delta=Math.hypot(to.x-from.x,to.y-from.y);
    const dpi=await OBR.scene.grid.getDpi();
    let animated=delta<=Math.max(1,dpi*.03),animationIssue=null;
    if(!animated){
      const frames=10,frameWait=65;
      try{
        for(let i=1;i<=frames;i++){
          if(i===1||i===6||i===frames)await assertPassIsCurrent(identity);
          const t=i/frames,e=t*t*(3-2*t);
          const pos={x:from.x+(to.x-from.x)*e,y:from.y+(to.y-from.y)*e};
          await OBR.scene.items.updateItems([tokenId],draft=>{
            for(const item of draft)item.position=pos;
          });
          if(i<frames)await sleep(frameWait);
        }
        animated=true;
      }catch(error){
        animationIssue=error;
        console.warn(`Haikyuu — animacao de ${stepName} interrompida; tentando posicao final`,error);
      }
    }
    // Mesmo se uma atualização intermediária falhar, tenta gravar o destino.
    // Não anuncia sucesso até ter confirmado o posicionamento persistente.
    let lastError=null;
    for(let attempt=0;attempt<3;attempt++){
      await assertPassIsCurrent(identity);
      try{
        await OBR.scene.items.updateItems([tokenId],draft=>{
          for(const item of draft){
            if(item.locked)throw Error("O token foi bloqueado durante o movimento.");
            item.position={...to};
          }
        });
        const [saved]=await OBR.scene.items.getItems([tokenId]);
        if(saved&&Math.hypot(saved.position.x-to.x,saved.position.y-to.y)<=Math.max(.75,dpi*.03))
          return {animated,position:{...to},fallback:!!animationIssue};
        lastError=Error(`O Owlbear não confirmou o deslocamento de ${stepName}.`);
      }catch(error){lastError=error;}
      if(attempt<2)await sleep(130);
    }
    throw Error(`Não foi possível posicionar ${stepName}: ${lastError?.message||"erro desconhecido"}.`);
  }
  async function animatePassBall(ball,landing,identity){
    if(passMovementActive)throw Error("Já existe uma recepção em movimento nesta ficha.");
    passMovementActive=true;
    try{
      let current=await assertPassIsCurrent(identity);
      if(!current.passLanding||!landing)throw Error("Faltou o destino sorteado da bola.");
      if(!current.receiverReachedBall){
        const contact=current.reception?.ballContact;
        if(!contact)throw Error("Não foi salva a posição original da bola.");
        await moveTokenToCenter(identity.receiverId,contact,identity,"receptor");
        current=await assertPassIsCurrent(identity);
        // Persistir o avanço ANTES de tentar a bola, permitindo repetir apenas
        // a segunda etapa caso ela apresente alguma falha.
        await commitRally({...current,receiverReachedBall:true,passMoveStage:"bola"});
      }
      await sleep(140); // Pequena pausa visual do momento do contato.
      await assertPassIsCurrent(identity);
      const moved=await moveTokenToCenter(ball.id,landing,identity,"bola");
      return {animated:moved.animated,fallback:moved.fallback};
    }finally{passMovementActive=false;}
  }
  async function receiveServe(){
    const meta=await OBR.scene.getMetadata(),current=meta[RALLY];
    if(!current?.awaitingReception||current.receptionPending||!SERVE_TYPES[current.type])throw Error("Não há uma recepção disponível.");
    if(!isCharacter(selected)||!isCourt(court))throw Error("Selecione o token recebedor.");
    const receiverId=selectedId;
    const balls=await OBR.scene.items.getItems(isBall);
    if(balls.length!==1)throw Error("Defina uma bola oficial em Montarias.");
    if(!Number.isFinite(court.lines?.[current.recipientTeam==="allies"?"a":"b"]))
      throw Error("O mestre precisa definir a linha dos 3 metros do time receptor para o sorteio do Passe.");
    const [item]=await OBR.scene.items.getItems([selectedId]);
    const bounds=await OBR.scene.items.getItemBounds([selectedId]);
    const ballBounds=await OBR.scene.items.getItemBounds([balls[0].id]);
    const center=bounds?.center||item?.position,ballCenter=ballBounds?.center||balls[0].position;
    if(!center||!ballCenter)throw Error("Não foi possível localizar os tokens na grade.");
    if(teamOfPosition(center,court)!==current.recipientTeam)throw Error("O recebedor deve ser da equipe que recebeu o saque.");
    const dpi=await OBR.scene.grid.getDpi();
    const distance=receptionDistance(center,ballCenter,dpi);
    const s=currentSheet(),t=SERVE_TYPES[current.type];
    const baseAttribute=s.attributes[t.receptionAttr];
    // A vantagem do Por Baixo, a desvantagem do Flutuante e o uso de
    // Defesa contra o Viagem são preservados; muda só o modificador.
    const notation=receptionNotation(current.type,baseAttribute,distance.penalty);
    await commitRally({...current,receptionPending:true,receiverId});
    try{
      status(`📏 ${t.receptionAttr} de ${s.name}: ${distance.meters.toFixed(2).replace(".",",")} m da bola; penalidade −${distance.penalty}. 🎲 ${notation} no Dice+…`);
      const rollLabel=`${t.receptionAttr} de ${s.name}${current.type==="underhand"?" — VANTAGEM":current.type==="float"?" — DESVANTAGEM":""}`;
      const rolled=await requestDice(notation,rollLabel);
      const latest=(await OBR.scene.getMetadata())[RALLY];
      if(latest?.serveId!==current.serveId||latest?.timestamp!==current.timestamp)
        throw Error("O Rally mudou durante a recepção.");
      if(latest?.receiverId!==receiverId)
        throw Error("Outro receptor assumiu a recepção. Tente novamente.");
      const difference=rolled.total-current.total;
      const quality=classifyReception(difference),ace=quality==="Ace";
      const reception={receiverId,receiverName:s.name,attribute:t.receptionAttr,
        total:rolled.total,natural:rolled.natural,notation,difference,quality,
        attributeBase:baseAttribute,effectiveModifier:baseAttribute-distance.penalty,
        distanceMeters:distance.meters,distanceCells:distance.cells,
        distancePenalty:distance.penalty,
        // Posição capturada ANTES de mover alguém; é a casa da recepção.
        ballContact:{x:ballCenter.x,y:ballCenter.y},
        receiverStart:{x:center.x,y:center.y},at:Date.now()};
      let destination=null;
      if(!ace){
        const candidates=passLandingCandidates(quality,court,current.recipientTeam,dpi);
        if(!candidates.length)throw Error(`Não existem casas válidas para o Passe ${quality}. Confira as linhas de 3 metros e a área externa na ficha Mestre.`);
        // Não sortear a própria casa do contato: o Passe precisa deslocar a bola.
        const others=candidates.filter(p=>Math.hypot(p.x-ballCenter.x,p.y-ballCenter.y)>dpi*.55);
        destination=pickCell(others.length?others:candidates);
      }
      const next={...latest,receptionPending:!ace,awaitingReception:false,
        receiverId,reception,quality,ended:ace,passLanding:destination,
        receiverReachedBall:false,passMoveStage:ace?"encerrado":"receptor",
        passLandingZone:destination?courtZone(destination,court):null,
        phase:ace?"encerrado":"passe_em_voo",timer:newTimer(quality)};
      await commitRally(next,ace);
      if(!ace){
        // Movimento do token após classificar A, B, C ou D.
        // O timer continua parado; Play só pode ser dado depois do Passe.
        let flight;
        try{flight=await animatePassBall(balls[0],destination,next);}
        catch(error){
          const failed=(await OBR.scene.getMetadata())[RALLY];
          if(failed?.serveId===current.serveId&&failed?.timestamp===current.timestamp)
            await commitRally({...failed,receptionPending:false,phase:"passe_movimento_falhou"});
          status(`🏐 PASSE ${quality}! Resultado ${rolled.total} contra ${latest.total}. ⚠️ Movimento interrompido: ${error.message}. Use Mover novamente.`,"warn");
          return;
        }
        const afterFlight=(await OBR.scene.getMetadata())[RALLY];
        if(afterFlight?.serveId===current.serveId&&afterFlight?.timestamp===current.timestamp&&afterFlight.phase==="passe_em_voo"){
          await commitRally({...afterFlight,receptionPending:false,phase:"aguardando_levantador",flightAnimated:flight.animated});
        }
      }
      const distanceInfo=`${distance.meters.toFixed(2).replace(".",",")} m; penalidade −${distance.penalty}`;
      status(ace?`🚫 ACE! ${t.receptionAttr} de ${s.name}: ${distanceInfo}. Saque ${latest.total} × Recepção ${rolled.total}. Ponto do sacador.`:
        `🏐 PASSE ${quality}! ${t.receptionAttr} de ${s.name}: ${rolled.total} × Saque ${latest.total}. ${distanceInfo}. A bola foi para a zona ${quality}. Timer ${QUALITY_RULES[quality].seconds}s; mestre dá Play.`,ace?"warn":"ok");
    }catch(e){
      const latest=(await OBR.scene.getMetadata())[RALLY];
      if(latest?.timestamp===current.timestamp&&latest.receptionPending)
        await commitRally({...latest,receptionPending:false}).catch(console.warn);
      throw e;
    }
  }
  async function retryPassMovement(){
    const current=(await OBR.scene.getMetadata())[RALLY];
    if(current?.phase!=="passe_movimento_falhou"||!current.passLanding)
      throw Error("Não existe um Passe com movimento pendente.");
    const balls=await OBR.scene.items.getItems(isBall);
    if(balls.length!==1)throw Error("Defina uma bola oficial em Montarias.");
    const working={...current,receptionPending:true,phase:"passe_em_voo",
      passMoveStage:current.receiverReachedBall?"bola":"receptor"};
    await commitRally(working);
    try{
      const outcome=await animatePassBall(balls[0],current.passLanding,working);
      const updated=(await OBR.scene.getMetadata())[RALLY];
      if(updated?.serveId===current.serveId&&updated?.timestamp===current.timestamp)
        await commitRally({...updated,receptionPending:false,phase:"aguardando_levantador",flightAnimated:outcome.animated});
      status(`🏐 PASSE ${current.quality}! Bola colocada na zona ${current.quality}.`);
    }catch(error){
      const updated=(await OBR.scene.getMetadata())[RALLY];
      if(updated?.serveId===current.serveId&&updated?.timestamp===current.timestamp)
        await commitRally({...updated,receptionPending:false,phase:"passe_movimento_falhou"});
      throw error;
    }
  }
 // Ações administrativas: nunca disponíveis na Ficha Jogador.
 async function resetRallyAndMaybeSet(resetPoints=false){
   if(role!=="GM"||view!=="mestre")throw Error("Apenas a Ficha Mestre pode reiniciar saque/set.");
   const label=resetPoints?"o set (placar e rally)":"o saque/rally atual";
   if(!confirm(`Deseja realmente reiniciar ${label}? As fichas e a quadra serão preservadas.`))return false;
   // Primeiro interrompe a jogada para evitar que animações antigas escrevam
   // sobre o próximo rally; depois atualiza a bola e o placar.
   const patch={[RALLY]:null,[LOCK]:null};
   if(resetPoints)patch[SCORE]={allies:0,enemies:0};
   await OBR.scene.setMetadata(patch);
   const balls=await OBR.scene.items.getItems(isBall);
   if(balls.length)await OBR.scene.items.updateItems(balls.map(b=>b.id),draft=>{
     for(const item of draft)delete item.metadata[BALL_STATE];
   });
   // Desarma qualquer mira anterior sem tocar na posição da bola.
   await OBR.tool.setMetadata(TOOL,{serverId:"",serveType:"",rollConfirmed:false,
     natural:0,total:0,rollId:""}).catch(console.warn);
   rally=null;serveLock=null;
   if(resetPoints)score=cleanScore();
   render();return true;
 }
 app.addEventListener("click",async e=>{const b=e.target.closest("button");if(!b||b.disabled)return;
   if(b.dataset.panelTab){
     if(busy||!isCharacter(selected)||!['status','rally','setter'].includes(b.dataset.panelTab)||!['jogador','npc'].includes(view))return;
     if(b.dataset.panelTab==='setter'&&currentSheet().position!=="Levantador")return;
     panelTab=b.dataset.panelTab;
     if(selectedId)tabByToken.set(selectedId,panelTab);
     message="";render();return;
   }
   if(b.dataset.view){
     const requested=b.dataset.view;
     if(!["jogador","npc","mestre"].includes(requested))return;
     if(requested==="mestre"&&role!=="GM")return;
     if(!isCharacter(selected)||!selectedId)return;
     if(selected.metadata?.[SHEET]?.kind==="mestre"&&role!=="GM")return;
     if(busy)return;
     busy=true;
     try{
       // A escolha vira propriedade do token. Fica salva mesmo fechando a ficha,
       // trocando de personagem ou atualizando o Owlbear.
       await saveSheet({kind:requested});
       view=requested;manualTypeChoice=false;editingProfile=false;message="";
       panelTab="status";if(selectedId)tabByToken.set(selectedId,panelTab);
     }catch(err){console.error("Haikyuu: salvar tipo de ficha",err);status(err.message,"error");}
     finally{busy=false;render();}
     return;
   }
   if(b.dataset.courtTask){
     try{
       if(role!=="GM")throw Error("Somente o mestre marca áreas.");
       const task=b.dataset.courtTask;
       if(!CAL_TASKS[task])throw Error("Marcação inválida.");
       await prepare(CALIBRATE,{serverId:"",serveType:"",calibrationTask:task,calibrationNonce:newId()});
       status(task.startsWith("line")?`🎯 ${CAL_TASKS[task].label}: clique na posição da linha dentro da quadra.`:
         `🎯 ${CAL_TASKS[task].label}: clique em DOIS cantos opostos da área. Não há medidas pré-definidas.`);
     }catch(err){status(err.message,"error");}
     return;
   }
   if(busy)return;
   if(b.dataset.serve){
     busy=true;render();
     try{await startServe(b.dataset.serve);}catch(err){console.error(err);status(err.message,"error");}
     finally{busy=false;render();}return;
   }
   if(b.dataset.bonus){
     if(view!=="jogador"||!isCharacter(selected))return;
     const s=currentSheet(),a=b.dataset.bonus,delta=Number(b.dataset.delta);
     if(s.created||!POSITIONS.includes(s.position)||!ATTRS.includes(a)||![-1,1].includes(delta))return;
     const spent=pointsSpent(s),current=s.creationBonus[a]||0,base=PRESETS[s.position][a];
     const next=current+delta;
     if(next<0||next+base>INITIAL_ATTRIBUTE_CAP||spent+delta>INITIAL_BONUS_POINTS)return;
     const creationBonus={...s.creationBonus,[a]:next};
     stage({creationBonus,attributes:{[a]:base+next}},false);
     message="";render();return;
   }
   // Evita perder texto digitado no clique e garante que a criação está persistida.
   if(selectedId&&pending.has(selectedId))await flush(selectedId);
   busy=true;render();
   try{
     if(b.dataset.roll){
       const attr=b.dataset.roll;
       // Durante recepção, o botão normal do atributo correto também executa
       // a recepção oficial, com -distância EXPLÍCITO no Dice+ e movimento.
       if(rally?.awaitingReception&&SERVE_TYPES[rally.type]?.receptionAttr===attr)
         await receiveServe();
       else status(`🎲 ${await roll(attr)}`);
       return;
     }
     switch(b.dataset.act){
       case "finish-creation":{
         const s=currentSheet();
         if(!s.name.trim())throw Error("Informe o nome do jogador.");
         if(!s.position)throw Error("Escolha uma das cinco posições.");
         if(!(s.heightCm>0))throw Error("Informe sua altura em centímetros.");
         if(s.jumpCm===null)throw Error("Informe sua impulsão em centímetros (pode ser 0).");
         if(!Number.isInteger(s.level)||s.level<1)throw Error("Informe um nível válido.");
         if(pointsSpent(s)!==INITIAL_BONUS_POINTS)throw Error("Distribua exatamente 3 pontos extras antes de confirmar.");
         if(ATTRS.some(a=>s.attributes[a]!==PRESETS[s.position][a]+s.creationBonus[a] || s.attributes[a]>INITIAL_ATTRIBUTE_CAP))
           throw Error("A distribuição deve respeitar o limite de 5 pontos por atributo.");
         await saveSheet({created:true,kind:"jogador"});
         editingProfile=false;
         status("🏐 Jogador confirmado! Ficha de status e ações liberada.");break;
       }
       case "close":
         if(selectedId)await flush(selectedId);
         await Promise.allSettled([OBR.popover.close(PANEL_ID),OBR.action.close()]);break;
       case "switch":manualTypeChoice=true;view="choose";editingProfile=false;message="";render();break;
       case "toggle-profile":editingProfile=!editingProfile;render();break;
       case "master-no-token":view="mestre";render();break;
       case "type-player":await saveSheet({kind:"jogador"});view="jogador";status("Token registrado como Jogador. Da próxima vez, a ficha abre diretamente.");break;
       case "type-npc":await saveSheet({kind:"npc"});view="npc";status("Token registrado como NPC. Da próxima vez, a ficha abre diretamente.");break;
       case "mark":if(role!=="GM")throw Error("Só o mestre define a bola.");await setBall(selectedId,true);status("🏐 Bola oficial definida.");break;
       case "unmark":if(role!=="GM")throw Error("Só o mestre define a bola.");await setBall(selectedId,false);status("Bola desmarcada.");break;
       case "check-position":{
         if(role!=="GM"||!isCourt(court))throw Error("Primeiro marque as quadras do Time A e do Time B.");
         if(!selectedId)throw Error("Selecione um token no mapa.");
         const bounds=await OBR.scene.items.getItemBounds([selectedId]);
         const center=bounds?.center||selected?.position;
         if(!center)throw Error("Não encontrei a posição do token.");
         status(`📍 ${selected?.name||"Token"}: ${courtZone(center,court)}`);break;
       }
       case "toggle-zones":{
         if(role!=="GM")throw Error("Somente o mestre controla as áreas.");
         const prev=(await OBR.scene.getMetadata())[COURT]||{version:COURT_CALIBRATION_VERSION,areas:{},lines:{}};
         await OBR.scene.setMetadata({[COURT]:{...prev,showZones:prev.showZones===false}});
         status("Exibição de zonas atualizada.");break;
       }
       case "clear-court":{
         if(role!=="GM")throw Error("Somente o mestre controla as áreas.");
         if(!confirm("Apagar TODAS as marcações da quadra? Os tokens, fichas, bola e placar serão preservados."))break;
         await OBR.scene.setMetadata({[COURT]:null});status("Marcações da quadra apagadas. Refaça as áreas.");break;
       }
        case "receive":await receiveServe();break;
       case "retry-pass-move":await retryPassMovement();break;
        case "choose-setter":await chooseSetter();break;
        case "test-reach":await reachTest();break;
       case "retry-setter-run":await retrySetterMovement();break;
        case "timer-play":await controlTimer("play");break;
        case "timer-pause":await controlTimer("pause");break;
        case "timer-reset":await controlTimer("reset");break;
       case "reset-rally":if(await resetRallyAndMaybeSet(false))status("🏐 Saque/Rally reiniciado pelo mestre; placar preservado.");break;
       case "reset-set":if(await resetRallyAndMaybeSet(true))status("🔄 Novo set iniciado: placar e rally reiniciados.");break;
       case "reset-score":
         if(role!=="GM")throw Error("Apenas o mestre pode zerar o placar.");
         await OBR.scene.setMetadata({[SCORE]:{allies:0,enemies:0}});
         status("Placar zerado pelo Mestre.");break;
     }
   }catch(err){console.error(err);status(err.message,"error");}
   finally{busy=false;render();}
 });
 function handleProfile(input,immediate){
   if(!isCharacter(selected)||!selectedId)return;
   const field=input.dataset.profile;
   if(field){
     if(field==="position"){
       const position=input.value;
       if(!POSITIONS.includes(position))return;
       const s=currentSheet();
       if(s.created&&role!=="GM")return;
       if(s.position===position)return;
       const patch=!s.created?{position,attributes:{...PRESETS[position]},creationBonus:emptyBonuses()}:{position};
       stage(patch,true);
       if(s.created)message="Posição atualizada pelo mestre. Atributos atuais preservados.";
       render();return;
     }
     if(field==="name"){stage({name:input.value.slice(0,80)},immediate);return;}
     if(["heightCm","jumpCm","level"].includes(field)){
       const n=numericField(input.value,field);
       if(n===undefined){saveBadge("Confira o valor informado",true);return;}
       stage({[field]:n},immediate);return;
     }
   }
   const attr=input.dataset.attr;
   if(ATTRS.includes(attr)){
     const s=currentSheet();
     if(s.created&&role!=="GM")return;
     const raw=input.value.trim(),n=Number(raw);
     if(raw===""||!Number.isInteger(n)||n<0|| (s.level===1&&n>INITIAL_ATTRIBUTE_CAP)){
       saveBadge(`Atributo inválido${s.level===1?" (máximo 5 no nível 1)":""}`,true);return;
     }
     stage({attributes:{[attr]:clamp(n,0,9999)}},immediate);
   }
 }
 app.addEventListener("input",e=>{
   if(e.target instanceof HTMLInputElement&&(e.target.dataset.profile||e.target.dataset.attr))handleProfile(e.target,false);
 });
 app.addEventListener("change",async e=>{
   const input=e.target;
   if(input instanceof HTMLInputElement||input instanceof HTMLSelectElement){
     if(input.dataset.profile||input.dataset.attr){handleProfile(input,true);await flush(selectedId);}
   }
 });
 app.addEventListener("focusout",e=>{
   if(e.target instanceof HTMLInputElement&&(e.target.dataset.profile||e.target.dataset.attr)){
     if(selectedId&&pending.has(selectedId))void flush(selectedId);
   }
 });
 OBR.scene.items.onChange(all=>{items=all;selected=selectedId?all.find(i=>i.id===selectedId)||null:null;
   // Se o mestre classificou o token em outra janela, abrir imediatamente
   // a ficha certa, a menos que o usuário tenha escolhido 'Trocar tipo'.
   if(selected&&view==="choose"&&!manualTypeChoice){
     const remembered=rememberedViewFor(selected,role);
     if(remembered!=="choose")view=remembered;
   }
   if(Date.now()>suppressEchoUntil && !(document.activeElement instanceof HTMLInputElement) && !(document.activeElement instanceof HTMLSelectElement))render();
 });
 OBR.scene.onMetadataChange(meta=>{court=meta[COURT]||null;rally=meta[RALLY]||null;score=cleanScore(meta[SCORE]);serveLock=meta[LOCK]||null;render();});
 OBR.scene.grid.onChange(g=>{grid=g.scale;render();});
 OBR.player.onChange(p=>{role=p.role;const id=p.selection?.length===1?p.selection[0]:null;
   if(id!==selectedId)void selectedChanged(p.selection).catch(console.error);
 });
 OBR.scene.onReadyChange(ready=>{if(ready)void boot().catch(console.error);
   else{items=[];selected=null;selectedId=null;court=null;rally=null;score=cleanScore();serveLock=null;view="choose";editingProfile=false;render();}
 });
 OBR.broadcast.onMessage(`${ID}/serve-finished`,e=>{
   const data=e.data;
   if(data?.rollId!==latestPreparedRollId)return;
   latestPreparedRollId=null;
   if(!busy){
     if(data.ok)status(`✅ ${data.inside?"Saque dentro da quadra":"Saque fora da quadra"}. Bola parada! Você pode sacar novamente.`);
     else status(`Falha ao concluir saque: ${data.error||"tente novamente"}`,"error");
   }
 });
 OBR.broadcast.onMessage(`${ID}/roll-result`,e=>{
   const data=e.data,req=rolls.get(data?.rollId);
   if(!req)return;
   rolls.delete(data.rollId);
   const total=data?.result?.totalValue,natural=dieFromResult(data);
   if(!Number.isFinite(total)||req.requireNatural&&natural===null){
     req.reject(Error("O Dice+ não enviou um D20 natural identificável. O saque foi cancelado por segurança."));return;
   }
   req.resolve({total,natural});
 });
 OBR.broadcast.onMessage(`${ID}/roll-error`,e=>{
   const data=e.data,req=rolls.get(data?.rollId);
   if(!req)return;rolls.delete(data.rollId);
   req.reject(Error(`Dice+: ${data.error||"falha na rolagem"}`));
 });
 async function boot(){if(!(await OBR.scene.isReady())){render();return;}
   const [all,meta,scale,sel]=await Promise.all([OBR.scene.items.getItems(),OBR.scene.getMetadata(),OBR.scene.grid.getScale(),OBR.player.getSelection()]);
   items=all;court=meta[COURT]||null;rally=meta[RALLY]||null;score=cleanScore(meta[SCORE]);serveLock=meta[LOCK]||null;grid=scale.raw||"1,5m";
   await selectedChanged(sel);
 }
 await boot();
}
if(!OBR.isAvailable&&!background){app.innerHTML='<main><div class="card"><h2>🏐 Haikyuu!! v0.26</h2><p>Site publicado! Abra a extensão em uma sala do Owlbear Rodeo para ver a ficha.</p></div></main>';}
else OBR.onReady(()=>{(background?startBackground():startPanel()).catch(err=>{
 console.error("Haikyuu inicialização:",err);
 if(!background)app.innerHTML=`<main><div class="card"><h2>Erro ao iniciar</h2><p>${escapeHTML(err.message)}</p></div></main>`;
});});
</script></body></html>
