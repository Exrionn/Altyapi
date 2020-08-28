const { RichEmbed } = require("discord.js")
const db = require("quick.db")

exports.run = (client, msg, args) => {
  if (!msg.author.hasPermissions("BAN_MEMBERS")) return msg.reply("Bu Komutu Kullanmak İçin ``Üyeleri Yasakla`` Yetkisine Sahip Olmalısın!!!")
  let member = args[0]
  let sebep = args[1]
  if (!member) return msg.reply("Bir ID Girmelisin!")
  if (!sebep) return msg.reply("Bir Sebep Girmelisin!")
  db.set(`idban_${member}_${msg.guild.id}`, member)
  msg.guild.ban(member)
  
  msg.channel.send(`${member} <@${member}> ID'li Kullanıcı Artık Banı Açılsa Bile Sunucuya Giremeyecek!`)
  
  if (args[0] === "kanal") {
    let kanal = msg.mentions.channels.first()
    if (!kanal) return msg.reply("Bir Kanal Etiketlemelisin.")
    db.set(`idbankanal_${msg.guild.id}`, kanal.id)
    let kanall = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`ID Ban Kanalı Başarıyla ${kanal} Olarak Ayarlandı!`)
  }
  let kanal = client.channels.get(db.get(`idbankanal_${msg.guild.id}`))
  let embed = new RichEmbed()
  .setAuthor(member.user.username, member.user.avatarURL)
  .setTitle(`Ceza: ID Ban`)
  .addField(`Banlanan Kişi`, `<@${member}>`)
  .addField(`Banlanma Sebebi`, `${sebep}`)
  .addField(`Banlayan Moderatör`, `${msg.author}`)
  .setFooter(`${client.user.username} ID Ban Sistemi`)
  .setTimestamp()
  .setColor("RANDOM")
  kanal.send(embed)
}

exports.conf = {
  aliases: []
}

exports.help = {
  name: "idban"
}
