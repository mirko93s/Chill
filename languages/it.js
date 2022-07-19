exports.commands = {
	'8ball': {
		too_long: `La domanda deve essere più corta di 3072 caratteri`,
		title: `🎱 **Palla 8**`,
		fortunes: [
			`È certo.`,
			`È decisamente così.`,
			`Senza alcun dubbio.`,
			`Sì, senza dubbio.`,
			`Ci puoi contare.`,
			`Per quanto posso vedere, sì.`,
			`Molto probabilmente.`,
			`Le prospettive sono buone.`,
			`Sì.`,
			`I segni indicano di sì.`,
			`È difficile rispondere, prova di nuovo.`,
			`Rifai la domanda più tardi.`,
			`Meglio non risponderti adesso.`,
			`Non posso predirlo ora.`,
			`Concentrati e rifai la domanda.`,
			`Non ci contare.`,
			`La mia risposta è no.`,
			`Le mie fonti dicono di no.`,
			`Le prospettive non sono buone.`,
			`Molto incerto.`,
		],
	},
	achievement: {
		too_long: `Il titolo e la descrizione non possono essere più lunghi di 25 caratteri`,
		error: `Si è verificato un errore provando a generare l'immagine dell'obiettivo`,
		default_title: `Obiettivo Sbloccato!`,
	},
	activities: {
		error: `Si è verificato un errore durante l'avvio di questa attività.`,
		not_in_vc: `Devi essere in un Canale Vocale per avviare un'attività.`,
		title: `Attività di Discord`,
		description: (invite_code, activity) => `[CLICCA QUI](https://discord.com/invite/${invite_code}) per avviare **${activity}**`,
		by: username => `Richiesto da: ${username}`,
	},
	akinator: {
		already_in_game: `Stai già giocando a una partita di Akinator!`,
		yes: `Sì`,
		no: `No`,
		idk: `Non lo so`,
		probably: `Probabilmente`,
		probably_not: `Probabilmente no`,
		questions: `Domande`,
		progress: (progress, progress_bar) => `Progresso: ${progress}%\n${progress_bar}`,
		guessed_footer: round => `Indovinato in ${round} turni`,
		wp: `Ben fatto!`,
		defeated: `Mi hai sconfitto...`,
		inactivity: `Partita interrotta a causa di inattività.`,
	},
	announce: {
		too_long: `Si prega di rispettare le lunghezze massime del titolo (256) e della descrizione (2048).`,
		no_channel: `Canale degli annunci non trovato.`,
		success: bcchannel => `✅ Annuncio inviato correttamente in ${bcchannel}`,
		error: `Non ho il permesso di farlo. Per favore controlla i miei permessi.`,
	},
	ascii: {
		too_long: `Il testo non può essere più lungo di 50 caratteri`,
		error: `Si è verificato un errore provando a generare il testo ASCII`,
	},
	autovocal_create: {
		channel_name: `auto-vocale`,
		title: `Auto-Vocale`,
		description: channel => `Un nuovo canale Auto-Vocal ${channel} è stato creato.\nOra puoi rinominarlo, impostare i permessi, il limite degli utenti, il bitrate, ecc...`,
	},
	autovocal: {
		already_locked: `Questo canale Auto-Vocale è già bloccato.`,
		locked: `🔒Canale Bloccato`,
		locked_description: `Ora puoi invitare altri utenti a unirsi a questo canale Auto-Vocal facendo \`/autovocal invite @user\`.`,
		no_owner: `Non hai il permesso di bloccare o cacciare le persone!\nSolo il creatore di questo canale Auto-Vocale può farlo.`,
		not_in_av: `Non sei in un canale Auto-Vocale.`,
		already_whitelisted: invited => `${invited} è già nella whitelist.`,
		whitelisted: invited => `${invited} è stato aggiunto alla whitelist del tuo canale Auto-Vocale`,
		by: username => `da ${username}`,
		cannot_whitelist: `Non puoi aggiungere altre persone alla whitelist dal momento che non fai parte di essa. Come sei entrato qui?!`,
		not_locked: `Questo canale Auto-Vocale non è ancora bloccato.`,
		not_whitelisted: `Quella persona non è ancora nella whitelist.`,
		kicked: invited => `${invited} è stato rimosso dalla whitelist del tuo canale Auto-Vocale.`,
	},
	avatar: { title: username => `Avatar di ${username}` },
	Avatar: {
		// avatar context menu
		title: username => `Avatar di ${username}`,
	},
	ban: {
		no_channel: `canale mod-logs non trovato`,
		not_self: `Non puoi bandire te stesso`,
		hierarchy: `Non posso bandire quella persona a causa della gerarchia dei ruoli.`,
		not_in_guild: `Quell'utente non fa parte di questa Gilda`,
		not_provided: `*non fornito*`,
		title: `BAN`,
		by: `Da`,
		reason: `Motivo`,
		error: err => `Errore: **${err}**`,
		banned: (toBan, puchannel) => `✅ ${toBan} è stato bannato e loggato in ${puchannel}`,
	},
	bot: {
		guilds: `Gilde`,
		users: `Utenti`,
		channels: `Canali`,
		bot: `Bot`,
		djs: `Discord.js`,
		nodejs: `Node.js`,
		usage: `Utilizzo`,
		uptime: `Tempo di attività`,
		// unused above this comment, fomratting reasons maybe add more, missing
		created_at: `Creato il`,
		counters: `Contatori`,
		versions: `Versioni`,
		system: `Sistema`,
	},
	bug: {
		cooldown: `Hai già segnalato un problema di recente, devi aspettare 30 minuti tra una segnalazione e l'altra.`,
		too_short: `Fornisci un messaggio abbastanza lungo (50 caratteri).`,
		success: `✅ La tua segnalazione di bug è stata inviata. Grazie!\nConsidera di unirti al [Server di supporto](https://discord.gg/2ktWcAb) per discuterne e rimanere aggiornato su qualsiasi changelog.`,
	},
	calc: {
		invalid: `L'espressione fornita non è valida!`,
		too_long: `L'espressione deve essere più corta di 512 caratteri`,
		service_down: `La calcolatrice non è disponibile al momento, per favore riprova tra pochi secondi!`,
		title: `Calcolatrice`,
	},
	channel: {
		too_long: `Il nome del canale non può essere più lungo di 100 caratteri.`,
		created: (channeltype, channel) => `✅Nuovo canale **\`${channeltype}\`** create con successo: **${channel}**`,
		deleted: channel_name => `✅ Canale eliminato con successo: **${channel_name}**`,
	},
	clear: {
		success: deleted_size => `♻️ ${deleted_size} messaggi eliminati`,
		old: `*Alcuni messaggi non sono stati eliminati perché sono più vecchi di 14 giorni*`,
	},
	coinflip: {
		coin: [
			`Testa`,
			`Croce`,
		],
		title: `Lancia un Moneta`,
		flipping: `Lanciando . . . `,
		flipped: (member, result) => `${member} ha lanciato **${result}**`,
	},
	command: {
		not_valid_command: command => `\`${command}\` non è un comando valido. Controlla \`/help\` per una lista completa.`,
		enabled: command => `✅ \`${command}\` è stato nuovamente abilitato su questo server.`,
		already_enabled: command => `\`${command}\` è già abilitato in questo server!`,
		disabled: command => `❌ \`${command}\` è stato disabilitato su questo server.`,
		already_disabled: command => `\`${command}\` è già disabilitato in questo server.`,
		no_commands: `Non ci sono comandi disabilitati nel server.`,
		disabled_commands: `Comandi Disabilitati`,
	},
	connect4: {
		title: `Forza 4`,
		react: `Reagisci per inserire una pedina`,
		won: winner => `${winner} HA VINTO! 🏆`,
		draw: `PAREGGIO! 😐`,
		turn: (player, turn) => `Turno di ${player} ${turn}`,
		inactivity: `Partita interrotta a causa di inattività`,
	},
	customcommand_list: {
		error: command => `\`${command}\` non è un comando personalizzato valido. Controlla \`/customcommand_list\` per un elenco completo.`,
		no_custom_commands: `Questo server non ha ancora impostato alcun comando personalizzato!`,
		title: `Comandi Personalizzati`,
	},
	customcommand: {
		no_override: `Non puoi sovrascrivere i comandi del bot.`,
		bad_args: `Il comando personalizzato deve essere più corto di 32 caratteri.\nLa risposta deve essere più corta di 512 caratteri`,
		title: `Comandi Personalizzati`,
		created: (command, response) => `Nuovo comando personalizzato creato\n**Comando:** \`${command}\`\n**Risposta:** \`${response}\``,
		error: command => `\`${command}\` non è un comando personalizzato valido. Controlla \`/customcommand_list\` per un elenco completo.`,
		deleted: command => `Il comando personalizzato \`${command}\` è stato eliminato.`,
	},
	drop: {
		no_channel: `Canale Giveaway non trovato.`,
		too_long: `La lunghezza del premio deve essere inferiore a 3072 caratteri.`,
		title: `🎁 Drop`,
		prize: prize => `**Premio:** ${prize}`,
		winner: `**Vincitore:**`,
		footer: `Clicca sul pulsante qui sotto per Rivendicare questo Drop`,
		claim: `Rivendica`,
		claimed: `Rivendicato`,
		started: gachannel => `✅ Drop iniziato in ${gachannel}`,
	},
	emojifind: {
		no_result: query => `Nessun risultato trovato per \`${query}\``,
		favourited_key: `Preferito`,
		favourited_value_s: faves => `${faves} volta`,
		favourited_value_p: faves => `${faves} volte`,
		animated_key: `Animato`,
		yes: `Sì`,
		no: `No`,
		created: `✅ Nuova emoji creata con successo!`,
		add: `Aggiungi`,
		error: `Si è verificato un errore durante il tentativo di creare una nuova emoji. Gli slot emoji del server sono pieni?`,
	},
	flood: {
		turns: turn => `Turni: ${turn}`,
		inactivity: `Partita interrotta a causa di inattività!`,
		won: `HAI VINTO`,
	},
	github: {
		no_result: (username, repo) => `Nessun risultato trovato per \`${username}\\${repo}\``,
		stars: `⭐ Stelle`,
		forks: `⤵️ Forks`,
		watchers: `👁️ Osservatori`,
		language: `Linguaggio`,
		created_at: `Creato il`,
		last_update: `Ultimo aggiornamento`,
		tags: `Etichette`,
		forked: `Fork di`,
	},
	giveaway: {
		no_channel: `Canale Giveaway non trovato.`,
		too_long: `Il premio non può essere più lungo di 250 caratteri`,
		started: `🎉 Giveaway Iniziato`,
		react: `*Reagisci Con 🎉 Per Entrare!*`,
		prize: `🎁 Premio`,
		ends_at: time => `🕒 Termina **<t:${time}:R>`,
		max_winners: winnersnum => `Vincitori massimi: ${winnersnum}`,
		footer_start: host_tag => `Organizzato da ${host_tag}\nIl`,
		success: gachannel => `✅ Giveaway iniziato in ${gachannel}`,
		ended: `🎉 Giveaway Terminato`,
		winners_key_s: `**Vincitore**`,
		winners_key_p: `**Vincitori**`,
		no_participants: `Nessun Partecipante`,
		footer_end: host_tag => `Ospitato da ${host_tag}\nTerminato il`,
		footer_end_resumeInterval_fn: (oldtext) => `${oldtext}\nTerminato il`,
		winner_msg: (winner, prize) => `**Congratulazioni ${winner}!\nHai vinto: \`${prize}\`**`,
		error: `Non ho il permesso di farlo. Per favore controlla i miei permessi.`,
	},
	hangman: {
		hangman: `Impiccato`,
		player: `Giocatore`,
		inactivity: `Partita interrotta a causa di inattività!`,
		won: player => `\nCongratulazioni ${player}! Hai vinto!`,
		lost: (player, word) => `\n${player} ha perso!\nLa parola era ${word}`,
	},
	help: {
		title: `❓ Chill Bot AIUTO❓`,
		description: `Digita \`/help <comando>\` per maggiori informazioni su un comando specifico.`,
		admin: `🚫 Amministrazione`,
		av: `🔊 Auto-Vocale`,
		bot: `🤖 Bot`,
		commands: `🛃 Comandi`,
		fun: `🎲 Svago`,
		games: `🎮 Giochi`,
		info: `ℹ️ Info`,
		moderation: `🔨 Moderazione`,
		music: `🎵 Musica`,
		other: `💡 Altro`,
		owner: `⚙️ Proprietario`,
		roles: `🎚️ Ruoli`,
		settings: `💾 Impostazioni`,
		xp: `🏆 Xp`,
		cmd_description: description => `\n**Descrizione**\n> ${description}`,
		cmd_usage: usage => `\n**Info**\n> ${usage}`,
		cmd_userPerms: user_Perms => `\n\n**Permessi Utente**\n> \`${user_Perms}\``,
		cmd_botPerms: bot_Perms => `\n\n**Permessi Bot**\n> \`${bot_Perms}\``,
	},
	kick: {
		no_channel: `Canale mod-logs non trovato`,
		not_self: `Non puoi espellere te stesso`,
		hierarchy: `Non posso espellere quella persona a causa della gerarchia dei ruoli.`,
		not_in_guild: `Quell'utente non fa parte di questa Gilda`,
		not_provided: `*non fornito*`,
		title: `ESPULSO`,
		by: `Da`,
		reason: `Motivo`,
		error: err => `Errore: **${err}**`,
		kicked: (toKick, puchannel) => `✅ ${toKick} è stato espulso e loggato in ${puchannel}`,
	},
	leaderboard: {
		disabled: `Questo modulo è disabilitato in questo server!`,
		author: guild_name => `${guild_name} 🏆 Classifica 🏆`,
	},
	level: {
		disabled: `Questo modulo è disabilitato in questo server!`,
		level: `Livello`,
		experience: `Esperienza`,
		rank: `Rango`,
		to_next_level: xptolevelup => `*${xptolevelup} per salire di livello*`,
		n_a: `N/D`,
	},
	match: {
		title: `Abbina le Coppie`,
		inactivity: `Partita interrotta a causa di inattività!`,
		won: member => `Congratulazioni ${member}! Hai vinto!`,
	},
	mcstat: { author: `Stato Server Minecraft` },
	nickname: {
		hierarchy: `Non posso cambiare il soprannome di quella persona a causa della gerarchia dei ruoli`,
		not_in_guild: `Quell'utente non fa parte di questa Gilda`,
		success: `✅ Soprannome impostato con successo!`,
		new_nick: (newnickname, member) => `${newnickname} è ora il soprannome di ${member}`,
	},
	nowplaying: {
		title: `🎵 Musica`,
		mco: channel => `"Solo-Canale-Musicale" è attivo!\nPuoi usare il modulo musica solamente in: <#${channel}>.`,
		no_dj: `Non hai il ruolo DJ.`,
		no_playing: `Non c'è niente in riproduzione.`,
		not_vc: `Devi essere in un canale vocale.`,
	},
	pause: {
		title: `🎵 Musica`,
		mco: channel => `"Solo-Canale-Musicale" è attivo!\nPuoi usare il modulo musica solamente in: <#${channel}>.`,
		no_dj: `Non hai il ruolo DJ.`,
		no_playing: `Non c'è niente in riproduzione.`,
		not_vc: `Devi essere in un canale vocale.`,
		paused: `⏸ Pausa`,
	},
	percentage: {
		title: `Percentuale`,
		description: (x, percentage, y) => `${x} è **${percentage} %** di ${y}`,
		error: err => `Errore: ${err}`,
	},
	ping: { calculating: `📶 Calcolando . . .` },
	play: {
		title: `🎵 Musica`,
		mco: channel => `"Solo-Canale-Musicale" è attivo!\nPuoi usare il modulo musica solamente in: <#${channel}>.`,
		no_dj: `Non hai il ruolo DJ.`,
		no_playing: `Non c'è niente in riproduzione.`,
		not_vc: `Devi essere in un canale vocale.`,
		no_result: `Non ho potuto ottenere alcun risultato di ricerca o il link fornito non era valido.`,
		queue_limit: `Non puoi mettere in coda più di 10 canzoni.`,
		playlist_queued: pladded => `✅ ${pladded} brani dalla playlist sono stati aggiunti alla coda`,
		playlist_trimmed: pladded => `✅ ${pladded} brani dalla playlist sono stati aggiunti alla coda\n⚠️ Alcuni brani nella playlist non sono stati aggiunti a causa del limite della coda`,
		live: `IN DIRETTA`,
		queued: song_title => `✅ ${song_title} è stato aggiunto alla coda`,
		by: username => `Richiesto da: ${username}`,
		couldnt_join: error => `Non sono riuscito ad entrare nel canale vocale: ${error}`,
	},
	poll: {
		no_channel: `Canale dei Sondaggi non trovato.`,
		question_too_long: `La domanda deve essere più corta di 256 caratteri`,
		bad_choices: `Si prega di fornire almeno 2 scelte per avviare un sondaggio (max 10 scelte, utilizza virgole per separare le scelte)`,
		description: choicemsg => `**Reagisci per votare**\n${choicemsg}`,
		choices_too_long: `La somma di tutte le scelte non può essere più lunga di 4096 caratteri`,
		success: pollchannel => `✅ Sondaggio iniziato in ${pollchannel}`,
	},
	qr: {},
	queue: {
		title: `🎵 Musica`,
		mco: channel => `"Solo-Canale-Musicale" è attivo!\nPuoi usare il modulo musica solamente in: <#${channel}>.`,
		no_dj: `Non hai il ruolo DJ.`,
		no_playing: `Non c'è niente in riproduzione.`,
		not_vc: `Devi essere in un canale vocale.`,
		queue: (song_list, playing) => `🔀 Coda:\n\n${song_list}\n\n🎶 **${playing}**`,
	},
	reactionroles: {
		title: `Ruoli di Reazione`,
		setup_input: `**Inserisci 1 emoji e menziona un ruolo**`,
		setup_footer: `Quando hai finito di creare i ruoli di reazione clicca sul pulsante Conferma\nQuesta configurazione non è più valida dopo 60 secondi di inattività`,
		confirm: `Conferma`,
		abort: `Interrompi`,
		bad_input_key: `\`⛔ EMOJI O RUOLO NON VALIDI ⛔\``,
		bad_input_value: `> \`Si prega di riprovare...\``,
		too_long_key: `⛔ Limite della Decrizione dell'Embed raggiunto ⛔`,
		too_long_value: `> Non puoi aggiungere altri ruoli`,
		inactivity: `Configurazione interrotta a causa di inattività`,
		react: rolestext => `Reagisci per ottenere i ruoli\n\n${rolestext}`,
		aborted: `La configurazione dei ruoli di reazione è stata interrotta.`,
	},
	remindme: {
		title: `**Promemoria**`,
		set: time => `Il tuo promemoria è stato impostato, ti ricorderò in ${time}.`,
	},
	report: {
		no_channel: `Il canale delle segnalazioni non è stato trovato`,
		no_bots: `Non puoi segnalare i bot`,
		not_self: `Non puoi segnalare te stesso`,
		success: reported => `✅ Grazie per aver segnalato ${reported}.\nUn membro dello staff esaminerà la tua segnalazione il prima possibile`,
		too_long: `La descrizione deve essere più corta di 3072 caratteri`,
		user_report: `Utente Segnalato`,
		member: `**Membro:**`,
		by: `**Segnalato da:**`,
		channel: `**Canale:**`,
		reason: `**Motivo:**`,
		message_report: `Messaggio Segnalato`,
		message_author: `Autore del messaggio:`,
		message: `**Messaggio:**`,
		preview: `Anteprima del Messaggio`,
		char: (content, exceeded) => `${content}\n\`+ ${exceeded} carattere\``,
		chars: (content, exceeded) => `${content}\n\`+ ${exceeded} caratteri\``,
	},
	Report: {
		// report context menu
		no_channel: `Il canale delle segnalazioni non è stato trovato`,
		no_bots: `Non puoi segnalare i bot`,
		not_self: `Non puoi segnalare te stesso`,
		success: reported => `✅ Grazie per aver segnalato ${reported}.\nUn membro dello staff esaminerà la tua segnalazione il prima possibile`,
		too_long: `La descrizione deve essere più corta di 3072 caratteri`,
		user_report: `Utente Segnalato`,
		member: `**Membro:**`,
		by: `**Segnalato da:**`,
		channel: `**Canale:**`,
		reason: `**Motivo:**`,
		message_report: `Messaggio Segnalato`,
		message_author: `Autore del messaggio:`,
		message: `**Messaggio:**`,
		preview: `Anteprima del Messaggio`,
		char: (content, exceeded) => `${content}\n\`+ ${exceeded} carattere\``,
		chars: (content, exceeded) => `${content}\n\`+ ${exceeded} caratteri\``,
	},
	resetconfig: {
		title: `💾Impostazioni del Server`,
		description: `Le impostazioni del server sono state reimpostate ai valori predefiniti.`,
	},
	resume: {
		title: `🎵 Musica`,
		mco: channel => `"Solo-Canale-Musicale" è attivo!\nPuoi usare il modulo musica solamente in: <#${channel}>.`,
		no_dj: `Non hai il ruolo DJ.`,
		no_playing: `Non c'è niente in riproduzione.`,
		not_vc: `Devi essere in un canale vocale.`,
		resumed: `⏯️ Ripreso`,
	},
	rewards: {
		disabled: `Questo modulo è disabilitato in questo server!`,
		no_perms: `Hai bisogno del permesso \`ADMINISTRATOR\` per usare questo comando!`,
		invalid_reward: `Quella ricompensa non esiste`,
		rewards_limit: `Hai raggiunto il numero massimo di ricompense che puoi avere contemporaneamente. Cancellane alcune per aggiungerne altre.`,
		title: `Ricompense del Livello`,
		no_rewards: `Non è stata ancora impostata alcuna ricompensa.`,
		set: (role, level) => `Impostato ${role} per essere assegnato al livello **${level}**.`,
		removed: role => `Rimosso ${role} dalle ricompense.`,
	},
	rockpaperscissors: {
		title: `Sasso Carta Forbici`,
		react: `Reagisci per giocare!`,
		won: `Hai vinto!`,
		tie: `Pareggio!`,
		lost: `Hai perso!`,
	},
	roleinfo: {
		title: `Info ruolo`,
		created_at: `Creato il`,
		mentionable: `Menzionabile`,
		position: `Posizione`,
		category: `Categoria Separata`,
		counter: `Numero Utenti`,
		color: `Colore HEX`,
		perms: `Permessi`,
	},
	rolelist: { title: size => `Ruoli del server [${size}]` },
	say: { success: `✅ Messaggio inviato con successo.` },
	serveremojis: {
		no_emojis: `Il server non ha emoji`,
		title: `Emoji del Server`,
		trimmed: `Alcune emoji sono mancanti in questa lista a causa del limite di 4096 caratteri imposto da Discord.`,
	},
	serverinfo: {
		filter_obj: {
			0: `Spento`,
			1: `Senza Ruolo`,
			2: `Tutti`,
		},
		verification_obj: {
			0: `Nessuno`,
			1: `Basso`,
			2: `Medio`,
			3: `Alto`,
			4: `Massimo`,
		},
		tier_obj: {
			0: `Nessuno`,
			1: `1`,
			2: `2`,
			3: `3`,
		},
		// keep same string length inside each group
		// group1
		text: `Testuale ::`,
		voice: `Vocale   ::`,
		// group2
		count: `Numero ::`,
		tier: `Grado  ::`,
		// group3
		online: `Online ::`,
		total: `Totale ::`,
		// group4
		owner: `Proprietario        ::`,
		created_at: `Creato il           ::`,
		verification: `Livello di Verifica ::`,
		filter: `Filtro Esplicito    ::`,
		roles: `Numero Ruoli        ::`,
		// end groups
		members: `Membri`,
		channels: `Canali`,
		boost: `Potenziamento`,
		other: `Altro`,
	},
	setconfig: {
		title: `💾Impostazioni del Server`,
		invalid_key: `Impossibile trovare quella chiave! Digita \`/showconfig\` per ottenere i nomi delle chiavi`,
		success: (config_key, flag, value) => `**${config_key}** è stato modificato in: ${flag}\`${value}\``,
	},
	setup: {
		title: `INSTALLAZIONE`,
		channels: `**Canali**`,
		roles: `**Ruoli**`,
		categories: `**Categorie**`,
		footer: `✅ Creato\n❌ Già esistente`,
	},
	ship: {
		title: emoji => `${emoji} SHIP ${emoji}`,
		0: (user1, user2) => `🔻 ${user1}\n🔺 ${user2}\n**Non si abbinano affatto**`,
		20: (user1, user2) => `🔻 ${user1}\n🔺 ${user2}\n**Non si abbinano bene**`,
		50: (user1, user2) => `🔻 ${user1}\n🔺 ${user2}\n**Si abbinano molto bene**`,
		90: (user1, user2) => `🔻 ${user1}\n🔺 ${user2}\n**Sono destinati l'uno all'altro**`,
	},
	showconfig: {
		// missing key translations
		title: `💾Impostazioni del Server`,
		channels: `> Canali`,
		roles: `> Ruoli`,
		toggles: `> Interruttori`,
		other: `> Altro`,
		not_found: `❌❌❌ NON TROVATO ❌❌❌❌`,
		warning_key: `⚠️ ⚠️ ⚠️ ATTENZIONE: ⚠️⚠️ ⚠️`,
		warning_value: `Mancano una o più chiavi nelle impostazioni e alcune funzionalità non funzioneranno, questo è successo probabilmente perché hai eliminato i ruoli o i canali del bot\n**Usa \`/setup\` per correggere le chiavi mancanti, ricreerà i ruoli e i canali mancanti. \nOppure usa \`/setconfig\` per impostarli manualmente.**`,
		dashboard: `Pannello di controllo`,
	},
	skip: {
		title: `🎵 Musica`,
		mco: channel => `"Solo-Canale-Musicale" è attivo!\nPuoi usare il modulo musica solamente in: <#${channel}>.`,
		no_dj: `Non hai il ruolo DJ.`,
		no_playing: `Non c'è niente in riproduzione.`,
		not_vc: `Devi essere in un canale vocale.`,
		skipped: `⏭️ Avanti`,
	},
	slotmachine: {
		reroll: `Gira di nuovo`,
		won: member => `Wow! ${member} ha vinto, ottimo lavoro!`,
		lost: member => `Ohhh ${member} ha perso, che schifo!`,
	},
	slowmode: {
		title: `Modalità lenta`,
		set_to: delay => `Imposta su ${delay}`,
		disabled: `Disattivata`,
	},
	stop: {
		title: `🎵 Musica`,
		mco: channel => `"Solo-Canale-Musicale" è attivo!\nPuoi usare il modulo musica solamente in: <#${channel}>.`,
		no_dj: `Non hai il ruolo DJ.`,
		no_playing: `Non c'è niente in riproduzione.`,
		not_vc: `Devi essere in un canale vocale.`,
		stopped: `⏹️ Interrotto`,
	},
	summon: {
		title: `🎵 Musica`,
		mco: channel => `"Solo-Canale-Musicale" è attivo!\nPuoi usare il modulo musica solamente in: <#${channel}>.`,
		no_dj: `Non hai il ruolo DJ.`,
		not_vc: `Devi essere in un canale vocale.`,
		summoned: channel => `✅ Sono entrato in ${channel}`,
		couldnt_summon: channel => `Non sono riuscito ad entrare nel canale vocale: ${channel}`,
	},
	ticket: {
		no_channel: `Non sei in un canale ticket!`,
		no_staff: `È necessario essere parte dello staff o un amministratore per utilizzare questo comando!`,
		ticket_already_opened: `Hai già un ticket aperto!`,
		channel_prefix: `ticket`,
		title: `🎟️ TICKET 🎟️`,
		description: member => `**${member} qualcuno sarà con te a breve.**`,
		opened: channel => `✅ Ticket aperto, vai a ${channel}`,
		closed: `❌ Il ticket è stato chiuso.`,
	},
	tictactoe: {
		turn: (player, turn) => `Turno di ${player} ${turn}`,
		title: `Tris`,
		win: winner => `${winner} HA VINTO! 🏆`,
		draw: `È un pareggio!`,
		inactivity: `Partita interrotta a causa di inattività`,
	},
	timeout: {
		no_channel: `canale mod-logs non trovato`,
		not_moderatable: member => `${member} non può essere messo in timeout!`,
		not_self: `Non puoi mettere in timeout te stesso`,
		not_in_guild: `Quell'utente non fa parte di questa Gilda`,
		not_provided: `*non fornito*`,
		error: err => `Errore: **${err}**`,
		timeout_title: `TIMEOUT`,
		by: `Da`,
		duration: `Durata`,
		reason: `Motivo`,
		not_timed_out: member => `${member} attualmente non è in timeout`,
		removed_title: `TIMEOUT RIMOSSO`,
		timeout_added: (member, puchannel) => `✅ ${member} è stato messo in timeout e loggato in ${puchannel}`,
		timeout_removed: (member, puchannel) => `✅ Il timeout di ${member} è stato rimosso e loggato in ${puchannel}`,
	},
	today: { boring_day: `*Non è accaduto nulla. Solo una normale noiosa giornata...*` },
	translate: {
		title: `Traduttore`,
		error: err => `Errore: **${err}**`,
	},
	'Translate to EN': {
		message_invalid: `Messaggio non valido!`,
		context_to_en: `Tradotto in Inglese`,
		footer: user_tag => `Richiesto da: ${user_tag}`,
	},
	urban: {
		no_result: `Nessun risultato trovato`,
		author: `Dizionario Urban`,
		example: `Esempio`,
		error: err => `Errore: ${err}`,
	},
	usercounter: {
		already_enabled: channel => `Il Contatore Utenti è già abilitato e associato a ${channel}`,
		channel_name: memberCount => `👥・${memberCount} utenti`,
		title: `Contatore Utenti`,
		enabled: created => `**✅ Abilitato e associato a ${created}**`,
		footer: `D'ora in poi terrà traccia del numero di utenti e si aggiornerà automaticamente ogni volta che un nuovo utente entra/esce, con un tempo di ricarica di 30 minuti`,
		disabled: `**Disabilitato**`,
		already_disabled: `Il Contatore Utenti già disabilitato`,
	},
	userinfo: {
		guild: `Info del server`,
		nickname: `**> Nome visualizzato:**`,
		joined_at: `**> Entrato il:**`,
		boosting: `**> Potenziando da:**`,
		no: `No`,
		roles: `**> Ruoli:**`,
		none: `Nessuno`,
		personal: `Info personali`,
		id: `**> ID:**`,
		username: `**> Nome Utente:**`,
		tag: `**> Tag:**`,
		created_at: `**> Creato il:**`,
		activity_type: {
			PLAYING: `Giocando`,
			STREAMING: `In diretta`,
			LISTENING: `Ascoltando`,
			WATCHING: `Guardando`,
			CUSTOM: `Personalizzato`,
			COMPETING: `In competizione`,
		},
		activities: `Attività`,
	},
	'User Info': {
		// userinfo context menu
		guild: `Info del server`,
		nickname: `**> Nome visualizzato:**`,
		joined_at: `**> Entrato il:**`,
		boosting: `**> Potenziando da:**`,
		no: `No`,
		roles: `**> Ruoli:**`,
		none: `Nessuno`,
		personal: `Info personali`,
		id: `**> ID:**`,
		username: `**> Nome Utente:**`,
		tag: `**> Tag:**`,
		created_at: `**> Creato il:**`,
		activity_type: {
			PLAYING: `Giocando`,
			STREAMING: `In diretta`,
			LISTENING: `Ascoltando`,
			WATCHING: `Guardando`,
			CUSTOM: `Personalizzato`,
			COMPETING: `In competizione`,
		},
		activities: `Attività`,
	},
	userrole: {
		hierarchy: role => `Non posso gestire il ruolo ${role} a causa della gerarchia dei ruoli.`,
		already: member => `${member} ha già quel ruolo.`,
		not_yet: member => `${member} non ha quel ruolo.`,
		role_given: (role, member) => `✅ **${role}** è stato dato a ${member}`,
		role_taken: (role, member) => `✅ **${role}** è stato rimosso da ${member}`,
	},
	volume: {
		title: `🎵 Musica`,
		no_playing: `Non c'è niente in riproduzione.`,
		not_vc: `Devi essere in un canale vocale.`,
		volume: volume => `🔈 Volume attuale: **${volume}%**`,
		new_volume: newvolume => `🔈 Nuovo volume: **${newvolume}%**`,
	},
	weather: {
		no_location: `C'è stato un errore cercando di trovare la tua posizione. Riprova.`,
		winds: {
			North: `N`,
			South: `S`,
			West: `O`,
			East: `E`,
			Northwest: `NO`,
			Northeast: `NE`,
			Southwest: `SO`,
			Southeast: `SE`,
		},
		author: `Meteo`,
		temperature: `🌡️Temperatura`,
		feels_like: `♨️Percepita`,
		low: `📉Min:`,
		high: `📈Max:`,
		wind: `🌬️Vento`,
		humidity: `💧Umidità`,
		precipitations: `☔Precipitazioni`,
		forecast: (skytext, low_c, low_f, high_c, high_f, precip) => `**${skytext}**\nMin: ${low_c} °C | ${low_f} °F\nMax: ${high_c} °C | ${high_f} °F\nPrecipitazioni: ${precip}%`,
	},
	xp: {
		disabled: `Questo modulo è disabilitato in questo server.`,
		no_negative: `L'esperienza dell'utente non può essere negativa.`,
		set_to: `Impostata su`,
		author: username => `Esperienza di ${username}`,
		title_s: (xpmsg, points) => `${xpmsg} **${points}** punto`,
		title_p: (xpmsg, points) => `${xpmsg} **${points}** punti`,
		by: username => `da ${username}`,
		levelup_s: (xpmsg, points, level) => `${xpmsg} **${points}** punto\n*Il nuovo livello è: ${level}*`,
		levelup_p: (xpmsg, points, level) => `${xpmsg} **${points}** punti\n*Il nuovo livello è: ${level}*`,
		unlocked: unlocked => `***Ruoli sbloccati:\n${unlocked}***`,
		taken: unlocked => `***Ruoli rimossi:\n${unlocked}***`,
	},
};
exports.events = {
	interactionCreate: {
		no_dm: `Non puoi usare questo comando nei DM.`,
		get_cmd_error: `Si è verificato un errore durante il tentativo di eseguire il comando.`,
		dev_disabled: command_name => `Il comando \`${command_name}\` è stato temporaneamente disabilitato dallo sviluppatore.`,
		dev_only: `Questo comando è limitato allo Sviluppatore del bot!`,
		user_perms_s: perm => `Hai bisogno del permesso \`${perm}\` per usare questo comando!`,
		user_perms_p: perms => `Hai bisogno dei permessi \`${perms}\` per usare questo comando!`,
		bot_perms_s: perm => `Ho bisogno del permesso \`${perm}\` per usare questo comando!`,
		bot_perms_p: perms => `Ho bisogno dei permessi \`${perms}\` per usare questo comando!`,
		guild_disabled: command_name => `\`${command_name}\` è stato disabilitato su questo server da un Amministratore.`,
		error: err => `**ERRORE:** ${err.message}`,
	},
	messageCreate: {
		bot_mention: msg_author => `Ciao ${msg_author}! Digita \`/help\` per maggiori informazioni! 😃`,
		guild_disabled: command => `\`${command.name}\` è stato disabilitato su questo server da un Amministratore.`,
	},
};
exports.functions = {
	welcomeMessage: {
		messages: (member, guild, count) => [
			`${ member.user } è entrato.`,
			`${ member.user } si è unito a ${ guild.name }.`,
			`Benvenuto, ${ member.user }.`,
			`${ member.user } è il nostro 1.000.000° visitatore. Reagisci per un iPhone gratuito.`,
			`Diamo tutti un caloroso benvenuto a ${ member.user }.`,
			`È apparso un ${ member.user } selvatico!`,
			`👋 ${ member.user } 👋`,
			`Benvenuto ${ member.user }, sei il ${ count } membro.`,
			`Ciao ${ member.user }, spero che ti piacerà stare nel nostro server. `,
			`Ciao ${ member.user }, ti stavamo aspettando.`,
			`●●●${ member.user } sta scrivendo...`,
			`${ member.user } si è unito al tuo gruppo.`,
			`Swoooosh. ${ member.user } è appena atterrato.`,
			`${ member.user } ha fatto un salto nel server.`,
			`Dov'è ${ member.user }? Nel server!`,
			`${ member.user } si è appena presentato. Tenete la mia birra.`,
			`Il grande ${ member.user } si è presentato!`,
			`Un ${ member.user } si è generato nel server!`,
			`Benvenuto, ${ member.user }. Spero che tu abbia portato la pizza.`,
			`${ member.user } è appena entrato nel server - glhf!`,
			`${ member.user } è appena entrato. Fate finta di essere impegnati!`,
			`${ member.user } è appena entrato. Posso avere una cura?`,
			`${ member.user } si è unito. Devi costruire piloni aggiuntivi.`,
			`Ommioddio. ${ member.user } è qui.`,
			`Benvenuto, ${ member.user }. Stai attento e ascolta.`,
			`Benvenuto, ${ member.user }. Ti stavamo aspettando ( ͡° ͜ʖ ͡°)`,
			`Benvenuto ${ member.user }. Lascia le tue armi alla porta.`,
			`Preparatevi. ${ member.user } è appena entrato nel server.`,
			`${ member.user } è appena scivolato nel server.`,
			`Sfidante in avvicinamento - ${ member.user } è apparso!`,
			`È un uccello! È un aereo! Non importa, è solo ${ member.user }.`,
			`Ah! ${ member.user } è entrato! Hai attivato la mia carta trappola!`,
			`Saluti, amore! ${ member.user } è qui!`,
			`Ehi! Ascolta! ${ member.user } è entrato!`,
			`Stavamo aspettando te ${ member.user }`,
			`È pericoloso andare da soli, prendi ${ member.user }!`,
			`${ member.user } è entrato nel server! È superefficace!`,
			`${ member.user } è qui, come la profezia annunciò.`,
			`${ member.user } è arrivato. La festa è finita.`,
			`Giocatore pronto ${ member.user }.`,
			`${ member.user } è qui per calciare culi e masticare gomme. E ${ member.user } è rimasto senza gomme.`,
			`Ciao. È ${ member.user } che stai cercando?`,
			`Le rose sono rosse, le viole sono blu, ${ member.user } è entrato nel server in cui sei tu.`,
			`${ member.user } è appena arrivato. Sembra OP - per favore nerfatelo.`,
			`${ member.user } è entrato. Nascondi le tue banane.`,
			`È ${ member.user }! Lode al sole!`,
			`Never gonna give ${ member.user } up. Never gonna let ${ member.user } down.`,
			`${ member.user } si è unito. Rimanete un po' e ascoltate!`,
		],
		left: user => `${user} ha abbandonato la partita.`,
	},
	xpAdd: {
		congratulations: `Congratulazioni`,
		description: (user, curLevel) => `${user} **è salito al Lv. ${curLevel}**!`,
		rewards: (user, curLevel, unlocked) => `${user} **è salito al Lv. ${curLevel}**\n*e ha sbloccato questi ruoli:*\n***${unlocked}***`,
	},
};