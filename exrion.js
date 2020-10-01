///////7/24 kısmı\\\\\\
const express = require("express");
const http = require("http");
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " BOT Aktif.");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_NAME}.glitch.me`);
}, 1000 * 60 * 3);
//////7/24 kısmı bitiş\\\\\\

//Modüllerinizi 150. Satırdan İtibaren Ekleyiniz.
//150. satıra kadar hiç bir şeyi ellemeyin yoksa bot çalışmaz!!!

///////En Gerekli Modüller\\\\\
const { Client, RichEmbed, Collection } = require("discord.js")
const exrion = new Client()
const fs = require("fs")
const db = require("quick.db")
//////En Gerekli Modüller\\\\\\

///////Ayarlar.json Kısmı\\\\\\
exrion.conf = {
  token: "tokeniniz.",
  pref: "prefixsiniz.",
  sahip: "sizin idniz.",//NOT: Birden Fazla Sahip Eklemek İçin sahip: ["id1","id2","id3"]
  oynuyor: "Made By Exrîøn",
  durum: "dnd"//online = çevrimiçi idle = boşta dnd = rahatsız etmeyin
}
///////Ayarlar.json Kısmı\\\\\\

/////Message.js Kısmı\\\\\\\
exrion.on("message", message => {
  let client = message.client;
  if (message.author.bot) return;
  if (!message.content.startsWith(exrion.conf.pref)) return;
  let command = message.content.split(" ")[0].slice(exrion.conf.pref.length);
  let params = message.content.split(" ").slice(1);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  
  if (cmd) {
    cmd.run(client, message, params);
  }
})
 ///////Message.js Kısmı\\\\\\


///////Command Handler Başlangıç\\\\\\\
const log = message => {
  console.log(`[Exrîøn] ${message}`);
};

exrion.commands = new Collection();
exrion.aliases = new Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} adet komut yüklenmeye hazır. Başlatılıyor...`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Komut yükleniyor: ${props.help.name}'.`);
    exrion.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      exrion.aliases.set(alias, props.help.name);
    });
  });
});

exrion.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      exrion.commands.delete(command);
      exrion.aliases.forEach((cmd, alias) => {
        if (cmd === command) exrion.aliases.delete(alias);
      });
      exrion.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        exrion.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
exrion.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      exrion.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        exrion.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

exrion.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      exrion.commands.delete(command);
      exrion.aliases.forEach((cmd, alias) => {
        if (cmd === command) exrion.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
////////Command Handler Bitiş\\\\\\\

//////Ready.js\\\\\
exrion.on("ready", () => {
  exrion.user.setActivity(exrion.conf.oynuyor)
  console.log(`${log} Oynuyor Ayarlandı: ${exrion.conf.oynuyor}`)
  exrion.user.setStatus(exrion.conf.durum)
  if (exrion.conf.durum === "online") var durum = "Çevrimiçi"
  if (exrion.conf.durum === "idle") var durum = "Boşta"
  if (exrion.conf.durum === "dnd") var durum = "Rahatsız Etmeyin"
  console.log(`${log} Durum Ayarlandı: ${durum}`)
  console.log(`${log} ${exrion.user.username} Aktif Ve Hizmete Hazır!`)
});
//////Ready.js\\\\\

/////ID Ban\\\\\
exrion.on("guildMemberAdd", async member => {
  let banlı = db.get(`idban_${member.id}_${member.guild.id}`)
  if (member.id === banlı) {
    member.send("ID Ban Yediğin İçin Seni Geri Banladım!")//Burdaki Yazıyı Değiştirebilirsiniz Göndermesini İstemiyorsanız Silebilirsiniz.
    member.guild.ban(member.id)
  }
});
/////ID Ban\\\\\



exrion.login(exrion.conf.token)
