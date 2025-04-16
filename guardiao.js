
const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const minecraftData = require('minecraft-data');
const pvp = require('mineflayer-pvp').plugin;
const armorManager = require('mineflayer-armor-manager');
// const autoeat = require('mineflayer-auto-eat').plugin;

const bot = mineflayer.createBot({
    host: '192.168.15.97',
    port: 5538,
    version: '1.21.4',
    auth: 'offline',
    username: 'O_GUARDIAO'
});

// plugins
bot.loadPlugin(pathfinder);
bot.loadPlugin(pvp);
bot.loadPlugin(armorManager);

const listaMobs = ['Zombie', 'Creeper', 'Spider', 'Skeleton'];

function seguir(jogador){
    const alvo = bot.players[jogador].entity;
    bot.pathfinder.setGoal(new goals.GoalFollow(alvo, 2), true);
}


function parar(){
    bot.pathfinder.stop();
}

function attack(){

}

function killAura(jogador){
    setInterval(() => {
        const filtro = e => e.type === 'hostile' && 
            e.displayName === "Zombie";
        const mob = bot.nearestEntity(filtro);
        if(mob){
            bot.pvp.attack(mob)
        }
        seguir(jogador)
    }, 1000);
}

function defenderJogador(jogador){
    seguir(jogador);
    bot.chat(`Estou na retaguarda chefe!, ${jogador}!`);
    killAura(jogador);
}

function voltar(){
    bot.chat(`Voltando para casa...`);
}

function comer(){
    bot.autoEat.options = {
        priority: 'foodPoints',
        startAt: 14,
        bannedFood: []
      }
}


// Evento de mensagem no chat
bot.on('messagestr', (message) => {
    const match = message.match(/^<([^>]+)> (.*)/);
    if (!match) return;

    const jogador = match[1];
    const comando = match[2].trim();

    if (comando === '!me defenda' && jogador == 'Carraxinjinping') {
       defenderJogador(jogador);
    }

    if (comando === '!parar') {
        parar();
        bot.chat('parando...');
    }

    if (comando === '!voltar'){
        voltar()
    }
});

bot.on('playerCollect', (coletor, itemDrop) => {
    if (coletor != bot.entity) return

    setTimeout(() => {
        const espada = bot.inventory.items().find(item => 
            item.name.includes('sword'));
        if (espada) bot.equip(espada, 'hand')

    }, 150);
});

// Eventos de login e erro
bot.on('login', () => {
    console.log(`Conectado como ${bot.username}`);
});

bot.on('error', (err) => {
    console.error('Erro:', err);
});