const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const minecraftData = require('minecraft-data');
const config = require('./auth.js');

const bot = mineflayer.createBot(config);

const chefe = 'Carraxinjinping';

bot.loadPlugin(pathfinder);

function irAteChefe() {
    if (!bot.players[chefe].entity) {
        bot.chat('Não consigo encontrar o chefe!');
        return;
    }
    
    const alvo = bot.players[chefe].entity;
    const goal = new goals.GoalNear(
        alvo.position.x,
        alvo.position.y,
        alvo.position.z,
        1
    );
    
    bot.pathfinder.setGoal(goal);
}

bot.once('spawn', () => {
    // Adicionado 'const' para evitar variáveis globais
    const mcData = minecraftData(bot.version);
    const movement = new Movements(bot, mcData);
    bot.pathfinder.setMovements(movement);
});

bot.on('chat', (username, msg) => {
    if (username !== chefe) return;
    
    const args = msg.split(' ');
    const comando = args[0].toLowerCase(); 

    if (comando === 'venha') {
        if (!bot.players[chefe]) {
            bot.chat('Chefe não está online!');
            return;
        }
        irAteChefe();
    }
});

// Adicionar tratamento de erros
bot.on('error', err => console.log(err));
bot.on('kicked', reason => console.log(reason));