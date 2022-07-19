exports.commands = {
	'8ball': {
		too_long: `Question must be shorter than 3072 characters`,
		title: `🎱 **8 Ball**`,
		fortunes: [
			`It is certain.`,
			`It is decidedly so.`,
			`Without a doubt.`,
			`Yes - definitely.`,
			`You may rely on it.`,
			`As I see it, yes.`,
			`Most likely.`,
			`Outlook good.`,
			`Yes.`,
			`Signs point to yes.`,
			`Reply hazy, try again.`,
			`Ask again later.`,
			`Better not tell you now.`,
			`Cannot predict now.`,
			`Concentrate and ask again.`,
			`Don't count on it.`,
			`My reply is no.`,
			`My sources say no.`,
			`Outlook not so good.`,
			`Very doubtful.`,
		],
	},
	achievement: {
		too_long: `Title and Description can't be longer than 25 characters`,
		error: `An error occured while trying to generate the achievement image`,
		default_title: `Achievement Unlocked!`,
	},
	activities: {
		error: `An error occured while starting this activity.`,
		not_in_vc: `You need to be in a Voice Channel to start an activity.`,
		title: `Discord Activities`,
		description: (invite_code, activity) => `[CLICK HERE](https://discord.com/invite/${invite_code}) to start **${activity}**`,
		by: (username) => `Requested by: ${username}`,
	},
	akinator: {
		already_in_game: `You are already playing a game of Akinator!`,
		yes: `Yes`,
		no: `No`,
		idk: `I don't know`,
		probably: `Probably`,
		probably_not: `Probably Not`,
		questions: `Questions`,
		progress: (progress, progress_bar) => `Progress: ${progress}%\n${progress_bar}`,
		guessed_footer: (round) => `Guessed in ${round} rounds`,
		wp: `Well played!`,
		defeated: `You defeated me...`,
		inactivity: `Game stopped due to inactivity.`,
	},
	announce: {
		too_long: `Please respect max lengths for title (256) and description (2048).`,
		no_channel: `Announcement channel not found.`,
		success: (bcchannel) => `✅ Announcement correctly sent in ${bcchannel}`,
		error: `I don't have permission to do this. Please check my permissions.`,
	},
	ascii: {
		too_long: `Text can't be longer than 50 characters`,
		error: `An error occured while trying to generate the ascii art text`,
	},
	autovocal_create: {
		channel_name: `auto-vocal`,
		title: `Auto-Vocal`,
		description: (channel) => `A new auto-vocal channel ${channel} has been created.\nYou can now rename it, set the permissions, users limit, bitrate, etc...`,
	},
	autovocal: {
		already_locked: `This Auto-Vocal channel is already locked.`,
		locked: `🔒Channel Locked`,
		locked_description: `You can now invite other users to join this auto-vocal channel by doing \`/autovocal invite @user\`.`,
		no_owner: `You don't have permission to lock or kick people!\nOnly the creator of this Auto-Vocal channel can.`,
		not_in_av: `You are not in an Auto-Vocal channel.`,
		already_whitelisted: (invited) => `${invited} is already whitelisted.`,
		whitelisted: (invited) => `${invited} has been whitelisted in your Auto-Vocal channel`,
		by: (username) => `by ${username}`,
		cannot_whitelist: `You can't whitelist other people since you are not whitelisted yourself. How did you get in here?!`,
		not_locked: `This Auto-Vocal channel is not locked yet.`,
		not_whitelisted: `That person is not whitelisted yet.`,
		kicked: (invited) => `${invited} has been blacklisted from your Auto-Vocal channel.`,
	},
	avatar: {
		title: (username) => `${username}'s avatar`,
	},
	Avatar: { // avatar context menu
		title: (username) => `${username}'s avatar`,
	},
	ban: {
		no_channel: `mod-logs channel not found`,
		not_self: `You can't ban yourself`,
		hierarchy: `I can't ban that person due to role hierarchy.`,
		not_in_guild: `That user is not part of this Guild`,
		not_provided: `*not provided*`,
		title: `BAN`,
		by: `By`,
		reason: `Reason`,
		error: (err) => `Error: **${err}**`,
		banned: (toBan, puchannel) => `✅ ${toBan} has been banned and logged in ${puchannel}`,
	},
	bot: {
		guilds: `Guilds`,
		users: `Users`,
		channels: `Channels`,
		bot: `Bot`,
		djs: `Discord.js`,
		nodejs: `Node.js`,
		usage: `Usage`,
		uptime: `Uptime`,
		// unused above this comment, fomratting reasons maybe add more, missing
		created_at: `Created at`,
		counters: `Counters`,
		versions: `Versions`,
		system: `System`,
	},
	bug: {
		cooldown: `You already reported an issue recently, you have to wait 30 minutes between bug reports.`,
		too_short: `Please provide a long enough message (50 characters).`,
		success: `✅ Your bug report has been sent. Thank you!\nConsider joining the [Support Server](https://discord.gg/2ktWcAb) to discuss about it and stay updated about any changelog.`,
	},
	calc: {
		invalid: `The expression provided was invalid!`,
		too_long: `Expression must be shorter than 512 characters`,
		service_down: `Calculator is not available at the moment, please try again in a few seconds!`,
		title: `Calculator`,
	},
	channel: {
		too_long: `Channel name can't be longer than 100 characters.`,
		created: (channeltype, channel) => `✅ Successfully created a new **\`${channeltype}\`** channel: **${channel}**`,
		deleted: (channel_name) => `✅ Successfully deleted channel: **${channel_name}**`,
	},
	clear: {
		success: (deleted_size) => `♻️ ${deleted_size} messages deleted`,
		old: `*Some messages have not been deleted because they are older than 14 days*`,
	},
	coinflip: {
		coin: [`Heads`, `Tails`],
		title: `Coin Flip`,
		flipping: `Flipping . . . `,
		flipped: (member, result) => `${member} flipped **${result}**`,
	},
	command: {
		not_valid_command: (command) => `\`${command}\` is not a valid command. Check \`/help\` for a full list.`,
		enabled: (command) => `✅ \`${command}\` has been enabled again on this server.`,
		already_enabled: (command) => `\`${command}\` is already enabled on the server!`,
		disabled: (command) => `❌ \`${command}\` has been disabled on this server.`,
		already_disabled: (command) => `\`${command}\` is already disabled on the server.`,
		no_commands: `There are no commands disabled on the server.`,
		disabled_commands: `Disabled Commands`,
	},
	connect4: {
		title: `Connect 4`,
		react: `React to place a chip`,
		won: (winner) => `${winner} WON! 🏆`,
		draw: `DRAW! 😐`,
		turn: (player, turn) => `${player}'s Turn ${turn}`,
		inactivity: `Game stopped due to inactivity`,
	},
	customcommand_list: {
		error: (command) => `\`${command}\` is not a valid custom command. Check \`/customcommand_list\` for a full list.`,
		no_custom_commands: `This server has not set any custom command yet!`,
		title: `Custom Commands`,
	},
	customcommand: {
		no_override: `You can't override bot commands.`,
		bad_args: `Custom command must be shorter than 32 characters.\nResponse must be shorter than 512 characters`,
		title: `Custom Commands`,
		created: (command, response) => `New custom command created\n**Command:** \`${command}\`\n**Response:** \`${response}\``,
		error: (command) => `\`${command}\` is not a valid custom command. Check \`/customcommand_list\` for a full list.`,
		deleted: (command) => `Custom command \`${command}\` has been deleted.`,
	},
	drop: {
		no_channel: `Giveaway channel not found.`,
		too_long: `Prize length must be lower than 3072 characters.`,
		title: `🎁 Drop`,
		prize: (prize) => `**Prize:** ${prize}`,
		winner: `**Winner:**`,
		footer: `Click the button below to Claim the Drop`,
		claim: `Claim`,
		claimed: `Claimed`,
		started: (gachannel) => `✅ Drop started in ${gachannel}`,
	},
	emojifind: {
		no_result: (query) => `No result found for \`${query}\``,
		favourited_key: `Favourited`,
		favourited_value_s: (faves) => `${faves} time`,
		favourited_value_p: (faves) => `${faves} times`,
		animated_key: `Animated`,
		yes: `Yes`,
		no: `No`,
		created: `✅ Successfully created a new emoji!`,
		add: `Add`,
		error: `An error occured while trying to create a new emoji. Are server emoji slots full?`,
	},
	flood: {
		turns: (turn) => `Turns: ${turn}`,
		inactivity: `Game stopped due to inactivity!`,
		won: `WON`,
	},
	github: {
		no_result: (username, repo) => `No result found for \`${username}\\${repo}\``,
		stars: `⭐ Stars`,
		forks: `⤵️ Forks`,
		watchers: `👁️ Watchers`,
		language: `Language`,
		created_at: `Created at`,
		last_update: `Last update`,
		tags: `Tags`,
		forked: `Forked from`,
	},
	giveaway: {
		no_channel: `Giveaway channel not found.`,
		too_long: `Prize can't be longer than 250 chatacters`,
		started: `🎉 Giveaway Started`,
		react: `*React With 🎉 To Enter!*`,
		prize: `🎁 Prize`,
		ends_at: (time) => `🕒 Ends **<t:${time}:R>**`,
		max_winners: (winnersnum) => `Max winners: ${winnersnum}`,
		footer_start: (host_tag) => `Hosted by ${host_tag}\nAt`,
		success: (gachannel) => `✅ Giveaway started in ${gachannel}`,
		ended: `🎉 Giveaway Ended`,
		winners_key_s: `**Winner**`,
		winners_key_p: `**Winners**`,
		no_participants: `No Participants`,
		footer_end: (host_tag) => `Hosted by ${host_tag}\nEnded at`,
		footer_end_resumeInterval_fn: (oldtext) => `${oldtext}\nEnded at`,
		winner_msg: (winner, prize) => `**Congratulations ${winner}!\nYou won: \`${prize}\`**`,
		error: `I don't have permission to do this. Please check my permissions.`,
	},
	hangman: {
		hangman: `Hangman`,
		player: `Player`,
		inactivity: `Game stopped due to inactivity!`,
		won: (player) => `\nCongratulations ${player}! You won!`,
		lost: (player, word) => `\n${player} lost!\nThe word was ${word}`,
	},
	help: {
		title: `❓ Chill Bot HELP ❓`,
		description: `Type \`/help <command>\` for more info about a specific command.`,
		admin: `🚫 Admin`,
		av: `🔊 Auto-Vocal`,
		bot: `🤖 Bot`,
		commands: `🛃 Commands`,
		fun: `🎲 Fun`,
		games: `🎮 Games`,
		info: `ℹ️ Info`,
		moderation: `🔨 Moderation`,
		music: `🎵 Music`,
		other: `💡 Other`,
		owner: `⚙️ Owner`,
		roles: `🎚️ Roles`,
		settings: `💾 Settings`,
		xp: `🏆 Xp`,
		cmd_description: (description) => `\n**Description**\n> ${description}`,
		cmd_usage: (usage) => `\n**Info**\n> ${usage}`,
		cmd_userPerms: (user_Perms) => `\n\n**User Permissions**\n> \`${user_Perms}\``,
		cmd_botPerms: (bot_Perms) => `\n\n**Bot Permissions**\n> \`${bot_Perms}\``,
	},
	kick: {
		no_channel: `mod-logs channel not found`,
		not_self: `You can't kick yourself`,
		hierarchy: `I can't kick that person due to role hierarchy.`,
		not_in_guild: `That user is not part of this Guild`,
		not_provided: `*not provided*`,
		title: `KICK`,
		by: `By`,
		reason: `Reason`,
		error: (err) => `Error: **${err}**`,
		kicked: (toKick, puchannel) => `✅ ${toKick} has been kicked and logged in ${puchannel}`,
	},
	leaderboard: {
		disabled: `This module is disabled on this server!`,
		author: (guild_name) => `${guild_name} 🏆 Leaderboard 🏆`,
	},
	level: {
		disabled: `This module is disabled on this server!`,
		level: `Level`,
		experience: `Experience`,
		rank: `Rank`,
		to_next_level: (xptolevelup) => `*${xptolevelup} to level up*`,
		n_a: `N/A`,
	},
	match: {
		title: `Match the Couples`,
		inactivity: `Game stopped due to inactivity!`,
		won: (member) => `Congratulations ${member}! You won!`,
	},
	mcstat: {
		author: `Minecraft Server Status`,
	},
	nickname: {
		hierarchy: `I can't change that member's nickname due to role hierarchy`,
		not_in_guild: `That user is not part of this Guild`,
		success: `✅ Nickname set successfully!`,
		new_nick: (newnickname, member) => `${newnickname} is now the nickname of ${member}`,
	},
	nowplaying: {
		title: `🎵 Music`,
		mco: (channel) => `Music Channel Only is active!\nYou can only use the music module in: <#${channel}>.`,
		no_dj: `You don't have DJ role.`,
		no_playing: `There is nothing playing.`,
		not_vc: `You are not in a voice channel.`,
	},
	pause: {
		title: `🎵 Music`,
		mco: (channel) => `Music Channel Only is active!\nYou can only use the music module in: <#${channel}>.`,
		no_dj: `You don't have DJ role.`,
		no_playing: `There is nothing playing.`,
		not_vc: `You are not in a voice channel.`,
		paused: `⏸ Paused`,
	},
	percentage: {
		title: `Percentage`,
		description: (x, percentage, y) => `${x} is **${percentage} %** of ${y}`,
		error: (err) => `Error: ${err}`,
	},
	ping: {
		calculating: `📶 Calculating . . .`,
	},
	play: {
		title: `🎵 Music`,
		mco: (channel) => `Music Channel Only is active!\nYou can only use the music module in: <#${channel}>.`,
		no_dj: `You don't have DJ role.`,
		no_playing: `There is nothing playing.`,
		not_vc: `You are not in a voice channel.`,
		no_result: `I could not obtain any search result or the link provided was invalid.`,
		queue_limit: `You can't queue more than 10 songs.`,
		playlist_queued: (pladded) => `✅ ${pladded} songs from the playlist have been added to the queue`,
		playlist_trimmed: (pladded) => `✅ ${pladded} songs from the playlist have been added to the queue\n⚠️ Some songs in the playlist were not added due to the queue limit`,
		live: `LIVE`,
		queued: (song_title) => `✅ ${song_title} has been added to the queue`,
		by: (username) => `Requested by: ${username}`,
		couldnt_join: (error) => `I couldn't join the voice channel: ${error}`,
	},
	poll: {
		no_channel: `Poll channel not found.`,
		question_too_long: `Question must be shorter than 256 characters`,
		bad_choices: `Please provide at least 2 choices to start a poll (max 10 choices, use commas to separate choices)`,
		description: (choicemsg) => `**React to vote**\n${choicemsg}`,
		choices_too_long: `The sum of all choices can't be longer than 4096 characters`,
		success: (pollchannel) => `✅ Poll started in ${pollchannel}`,
	},
	qr: {
		// nothing here
	},
	queue: {
		title: `🎵 Music`,
		mco: (channel) => `Music Channel Only is active!\nYou can only use the music module in: <#${channel}>.`,
		no_dj: `You don't have DJ role.`,
		no_playing: `There is nothing playing.`,
		not_vc: `You are not in a voice channel.`,
		queue: (song_list, playing) => `🔀 Queue:\n\n${song_list}\n\n🎶 **${playing}**`,
	},
	reactionroles: {
		title: `Reaction Roles`,
		setup_input: `**Please enter 1 emoji and mention a role**`,
		setup_footer: `Click the Confirm button when you are done to create the reaction roles\nThis setup becomes invalid after 60 seconds of inactivity`,
		confirm: `Confirm`,
		abort: `Abort`,
		bad_input_key: `\`⛔ INVALID EMOJI OR ROLE ⛔\``,
		bad_input_value: `> \`Please try again...\``,
		too_long_key: `⛔ Embed Description limit reached ⛔`,
		too_long_value: `> You can't add any more role`,
		inactivity: `Setup aborted due to inactivity`,
		react: (rolestext) => `React to get the roles\n\n${rolestext}`,
		aborted: `Reaction Roles setup has been aborted.`,
	},
	remindme: {
		title: `**Reminder**`,
		set: (time) => `Your reminder has been set, I will remind you in ${time}.`,
	},
	report: {
		no_channel: `Reports channel not found`,
		no_bots: `You can't report bots`,
		not_self: `You can't report yourself`,
		success: (reported) => `✅ Thanks for reporting ${reported}.\nA staff member will review your report as soon as possible`,
		too_long: `Description must be shorter than 3072 characters`,
		user_report: `User Report`,
		member: `**Member:**`,
		by: `**Reported by:**`,
		channel: `**Channel:**`,
		reason: `**Reason:**`,
		message_report: `Message Report`,
		message_author: `Message author:`,
		message: `**Message:**`,
		preview: `Message Preview`,
		char: (content, exceeded) => `${content}\n\`+ ${exceeded} character\``,
		chars: (content, exceeded) => `${content}\n\`+ ${exceeded} characters\``,
	},
	Report: { // report context menu
		no_channel: `Reports channel not found`,
		no_bots: `You can't report bots`,
		not_self: `You can't report yourself`,
		success: (reported) => `✅ Thanks for reporting ${reported}.\nA staff member will review your report as soon as possible`,
		too_long: `Description must be shorter than 3072 characters`,
		user_report: `User Report`,
		member: `**Member:**`,
		by: `**Reported by:**`,
		channel: `**Channel:**`,
		reason: `**Reason:**`,
		message_report: `Message Report`,
		message_author: `Message author:`,
		message: `**Message:**`,
		preview: `Message Preview`,
		char: (content, exceeded) => `${content}\n\`+ ${exceeded} character\``,
		chars: (content, exceeded) => `${content}\n\`+ ${exceeded} characters\``,
	},
	resetconfig: {
		title: `💾Guild Settings`,
		description: `Server settings have been resetted to default values.`,
	},
	resume: {
		title: `🎵 Music`,
		mco: (channel) => `Music Channel Only is active!\nYou can only use the music module in: <#${channel}>.`,
		no_dj: `You don't have DJ role.`,
		no_playing: `There is nothing playing.`,
		not_vc: `You are not in a voice channel.`,
		resumed: `⏯️ Resumed`,
	},
	rewards: {
		disabled: `This module is disabled on this server!`,
		no_perms: `You need the \`ADMINISTRATOR\` permission to use this command!`,
		invalid_reward: `That reward doesn't exist`,
		rewards_limit: `You have reached the maximum number of rewards you can have at the same time. Delete some of them to add new ones.`,
		title: `Level Rewards`,
		no_rewards: `No rewards have been set yet.`,
		set: (role, level) => `Set ${role} to be awarded at level **${level}**.`,
		removed: (role) => `Removed ${role} from the Rewards.`,
	},
	rockpaperscissors: {
		title: `Rock Paper Scissors`,
		react: `React to play!`,
		won: `You won!`,
		tie: `It's a tie!`,
		lost: `You lost!`,
	},
	roleinfo: {
		title: `Role Info`,
		created_at: `Created At`,
		mentionable: `Mentionable`,
		position: `Position`,
		category: `Separate Category`,
		counter: `Users counter`,
		color: `Hex Color`,
		perms: `Permissions`,
	},
	rolelist: {
		title: (size) => `Server Roles [${size}]`,
	},
	say: {
		success: `✅ Message correctly sent.`,
	},
	serveremojis: {
		no_emojis: `Server has no emojis`,
		title: `Server Emojis`,
		trimmed: `Some emojis are missing in this list due to Discord 4096 characters limit.`,
	},
	serverinfo: {
		filter_obj: { 0: `Off`, 1: `Without Role`, 2: `Everyone` },
		verification_obj: { 0: `None`, 1: `Low`, 2: `Medium`, 3: `High`, 4: `Highest` },
		tier_obj: { 0: `None`, 1: `1`, 2: `2`, 3: `3` },
		// keep same string length inside each group
		// group1
		text: `Text  ::`,
		voice: `Voice ::`,
		// group2
		count: `Count ::`,
		tier: `Tier  ::`,
		// group3
		online: `Online ::`,
		total: `Total  ::`,
		// group4
		owner: `Owner              ::`,
		created_at: `Created at         ::`,
		verification: `Verification Level ::`,
		filter: `Explicit Filter    ::`,
		roles: `Roles Count        ::`,
		// end groups
		members: `Members`,
		channels: `Channels`,
		boost: `Boost`,
		other: `Other`,
	},
	setconfig: {
		title: `💾Guild Settings`,
		invalid_key: `Couldn't find that key! Do \`/showconfig\` to get key names`,
		success: (config_key, flag, value) => `**${config_key}** has been changed to: ${flag}\`${value}\``,
	},
	setup: {
		title: `SETUP`,
		channels: `**Channels**`,
		roles: `**Roles**`,
		categories: `**Categories**`,
		footer: `✅ Created\n❌ Already exists`,
	},
	ship: {
		title: (emoji) => `${emoji} SHIP ${emoji}`,
		0: (user1, user2) => `🔻 ${user1}\n🔺 ${user2}\n**Do not match at all**`,
		20: (user1, user2) => `🔻 ${user1}\n🔺 ${user2}\n**Do not match well**`,
		50: (user1, user2) => `🔻 ${user1}\n🔺 ${user2}\n**Match very well**`,
		90: (user1, user2) => `🔻 ${user1}\n🔺 ${user2}\n**Are meant to eachother**`,
	},
	showconfig: { // missing key translations
		title: `💾Guild Settings`,
		channels: `> Channels`,
		roles: `> Roles`,
		toggles: `> Toggles`,
		other: `> Other`,
		not_found: `❌❌❌ NOT FOUND ❌❌❌`,
		warning_key: `⚠️ ⚠️ ⚠️ WARNING ⚠️ ⚠️ ⚠️`,
		warning_value: `One or more keys are missing in the settings and some features won't work, this probably happened because you deleted bot roles or channels\n**Do \`/setup\` to fix the missing keys, it will recreate missing roles and channels. \nOr use \`/setconfig\` to manually set the them.**`,
		dashboard: `Dashboard`,
	},
	skip: {
		title: `🎵 Music`,
		mco: (channel) => `Music Channel Only is active!\nYou can only use the music module in: <#${channel}>.`,
		no_dj: `You don't have DJ role.`,
		no_playing: `There is nothing playing.`,
		not_vc: `You are not in a voice channel.`,
		skipped: `⏭️ Skipped`,
	},
	slotmachine: {
		reroll: `Spin Again`,
		won: (member) => `Wow! ${member} won great job!`,
		lost: (member) => `Awww ${member} lost that sucks!`,
	},
	slowmode: {
		title: `Slow-Mode`,
		set_to: (delay) => `Set to ${delay}`,
		disabled: `Disabled`,
	},
	stop: {
		title: `🎵 Music`,
		mco: (channel) => `Music Channel Only is active!\nYou can only use the music module in: <#${channel}>.`,
		no_dj: `You don't have DJ role.`,
		no_playing: `There is nothing playing.`,
		not_vc: `You are not in a voice channel.`,
		stopped: `⏹️ Stopped`,
	},
	summon: {
		title: `🎵 Music`,
		mco: (channel) => `Music Channel Only is active!\nYou can only use the music module in: <#${channel}>.`,
		no_dj: `You don't have DJ role.`,
		not_vc: `You are not in a voice channel.`,
		summoned: (channel) => `✅ I joined ${channel}`,
		couldnt_summon: (channel) => `I couldn't join the voice channel: ${channel}`,
	},
	ticket: {
		no_channel: `You are not in a ticket channel!`,
		no_staff: `You need the be part of the Staff or an Administrator to use this command!`,
		ticket_already_opened: `You already have an opened ticket!`,
		channel_prefix: `ticket`,
		title: `🎟️ TICKET 🎟️`,
		description: (member) => `**${member} someone will be with you shortly.**`,
		opened: (channel) => `✅ Ticket opened, go to ${channel}`,
		closed: `❌ The ticket has been closed.`,
	},
	tictactoe: {
		turn: (player, turn) => `${player}'s Turn ${turn}`,
		title: `Tic Tac Toe`,
		win: (winner) => `${winner} WON! 🏆`,
		draw: `It's a draw!`,
		inactivity: `Game stopped due to inactivity`,
	},
	timeout: {
		no_channel: `mod-logs channel not found`,
		not_moderatable: (member) => `${member} can't be timed out!`,
		not_self: `You can't timeout yourself`,
		not_in_guild: `That user is not part of this Guild`,
		not_provided: `*not provided*`,
		error: (err) => `Error: **${err}**`,
		timeout_title: `TIMEOUT`,
		by: `By`,
		duration: `Duration`,
		reason: `Reason`,
		not_timed_out: (member) => `${member} is not currently timed out`,
		removed_title: `TIMEOUT REMOVED`,
		timeout_added: (member, puchannel) => `✅ ${member} has been timed out and logged in ${puchannel}`,
		timeout_removed: (member, puchannel) => `✅ ${member}'s timeout has been removed and logged in ${puchannel}`,
	},
	today: {
		boring_day: `*Nothing happened. Just a normal boring day...*`,
	},
	translate: {
		title: `Translator`,
		error: (err) => `Error: **${err}**`,
	},
	'Translate to EN': {
		message_invalid: `Not a valid message!`,
		context_to_en: `Translated to English`,
		footer: (user_tag) => `Requested by ${user_tag}`,
	},
	urban: {
		no_result: `Couldn't find any result`,
		author: `Urban Dictionary`,
		example: `Example`,
		error: (err) => `Error: ${err}`,
	},
	usercounter: {
		already_enabled: (channel) => `User Counter is already enabled and bound to ${channel}`,
		channel_name: (memberCount) => `👥・${memberCount} users`,
		title: `User Counter`,
		enabled: (created) => `**✅ Enabled and bound to ${created}**`,
		footer: `From now on it will track user counter and automatically update whenever a new user joins/leaves, with a 30 minutes cooldown`,
		disabled: `**Disabled**`,
		already_disabled: `User Counter is already disabled`,
	},
	userinfo: {
		guild: `Guild Info`,
		nickname: `**> Display name:**`,
		joined_at: `**> Joined at:**`,
		boosting: `**> Boosting since:**`,
		no: `No`,
		roles: `**> Roles:**`,
		none: `None`,
		personal: `Personal Info`,
		id: `**> ID:**`,
		username: `**> Username:**`,
		tag: `**> Tag:**`,
		created_at: `**> Created at:**`,
		activity_type: { PLAYING: `Playing`, STREAMING: `Streaming`, LISTENING: `Listening`, WATCHING: `Watching`, CUSTOM: `Custom`, COMPETING: `Competing` },
		activities: `Activities`,
	},
	'User Info': { // userinfo context menu
		guild: `Guild Info`,
		nickname: `**> Display name:**`,
		joined_at: `**> Joined at:**`,
		boosting: `**> Boosting since:**`,
		no: `No`,
		roles: `**> Roles:**`,
		none: `None`,
		personal: `Personal Info`,
		id: `**> ID:**`,
		username: `**> Username:**`,
		tag: `**> Tag:**`,
		created_at: `**> Created at:**`,
		activity_type: { PLAYING: `Playing`, STREAMING: `Streaming`, LISTENING: `Listening`, WATCHING: `Watching`, CUSTOM: `Custom`, COMPETING: `Competing` },
		activities: `Activities`,
	},
	userrole: {
		hierarchy: (role) => `I can't manage the role ${role} due to roles hierarchy.`,
		already: (member) => `${member} already has that role.`,
		not_yet: (member) => `${member} doesn't have that role.`,
		role_given: (role, member) => `✅ **${role}** has been given to ${member}`,
		role_taken: (role, member) => `✅ **${role}** has been taken from ${member}`,
	},
	volume: {
		title: `🎵 Music`,
		no_playing: `There is nothing playing.`,
		not_vc: `You are not in a voice channel.`,
		volume: (volume) => `🔈 Current volume: **${volume} %**`,
		new_volume: (newvolume) => `🔈 New volume: **${newvolume} %**`,
	},
	weather: {
		no_location: `There was an error trying to find your location. Please try again.`,
		winds: { North: `N`, South: `S`, West: `W`, East: `E`, Northwest: `NW`, Northeast: `NE`, Southwest: `SW`, Southeast: `SE` },
		author: `Weather`,
		temperature: `🌡️Temperature`,
		feels_like: `♨️Feels like`,
		low: `📉Low:`,
		high: `📈High:`,
		wind: `🌬️Wind`,
		humidity: `💧Humidity`,
		precipitations: `☔Precipitations`,
		forecast: (skytext, low_c, low_f, high_c, high_f, precip) => `**${skytext}**\nLow: ${low_c} °C | ${low_f} °F\nHigh: ${high_c} °C | ${high_f} °F\nPrecipitations: ${precip}%`,
	/**
	 * https://docs.microsoft.com/en-us/bingmaps/rest-services/common-parameters-and-types/supported-culture-codes
	 * ^^^^ weather supported languages ^^^^
	 * api lang also translates wind which breaks my formatting object
	 */
	},
	xp: {
		disabled: `This module is disabled on this server.`,
		no_negative: `User experience can't go negative.`,
		set_to: `Set to`,
		author: (username) => `${username}'s experience`,
		title_s: (xpmsg, points) => `${xpmsg} **${points}** point`,
		title_p: (xpmsg, points) => `${xpmsg} **${points}** points`,
		by: (username) => `by ${username}`,
		levelup_s: (xpmsg, points, level) => `${xpmsg} **${points}** point\n*New level is: ${level}*`,
		levelup_p: (xpmsg, points, level) => `${xpmsg} **${points}** points\n*New level is: ${level}*`,
		unlocked: (unlocked) => `***Unlocked roles:\n${unlocked}***`,
		taken: (unlocked) => `***Taken roles:\n${unlocked}***`,
	},
};
exports.events = {
	interactionCreate: {
		no_dm: `You can't use slash commands in DMs.`,
		get_cmd_error: `An error occured while trying to execute that command.`,
		dev_disabled: (command_name) => `Command \`${command_name}\` has been temporarily disabled by the dev.`,
		dev_only: `This command is limited to the bot Developer!`,
		user_perms_s: (perm) => `You need the \`${perm}\` permission to use this command!`,
		user_perms_p: (perms) => `You need the \`${perms}\` permissions to use this command!`,
		bot_perms_s: (perm) => `I need the \`${perm}\` permission to use this command!`,
		bot_perms_p: (perms) => `I need the \`${perms}\` permissions to use this command!`,
		guild_disabled: (command_name) => `\`${command_name}\` has been disabled on this server by an Administrator.`,
		error: (err) => `**ERROR:** ${err.message}`,
	},
	messageCreate: {
		bot_mention: (msg_author) => `Hi ${msg_author}! Type \`/help\` for more info! 😃`,
		guild_disabled: (command) => `\`${command.name}\` has been disabled on this server by an Administrator.`,
	},
};
exports.functions = {
	welcomeMessage: {
		messages: (member, guild, count) => [
			`${member.user} has joined.`,
			`${member.user} joined ${guild.name}.`,
			`Welcome, ${member.user}.`,
			`${member.user} is our 1,000,000th visitor. React for a free iPhone.`,
			`Let's all give a warm welcome to ${member.user}.`,
			`A Wild ${member.user} appeared!`,
			`👋 ${member.user} 👋`,
			`Welcome ${member.user}, you are the ${count} member.`,
			`Hi ${member.user}, hope you will enjoy staying in our server. `,
			`Hello ${member.user}, we were expecting you.`,
			`●●●${member.user} is typing...`,
			`${member.user} joined your party.`,
			`Swoooosh. ${member.user} just landed.`,
			`${member.user} hopped into the server.`,
			`Where’s ${member.user}? In the server!`,
			`${member.user} just showed up. Hold my beer.`,
			`Big ${member.user} showed up!`,
			`A ${member.user} has spawned in the server!`,
			`Welcome, ${member.user}. Hope you brought pizza.`,
			`${member.user} just joined the server - glhf!`,
			`${member.user} just joined. Everyone, look busy!`,
			`${member.user} just joined. Can I get a heal?`,
			`${member.user} joined. You must construct additional pylons.`,
			`Ermagherd. ${member.user} is here.`,
			`Welcome, ${member.user}. Stay awhile and listen.`,
			`Welcome, ${member.user}. We were expecting you ( ͡° ͜ʖ ͡°)`,
			`Welcome ${member.user}. Leave your weapons by the door.`,
			`Brace yourselves. ${member.user} just joined the server.`,
			`${member.user} just slid into the server.`,
			`Challenger approaching - ${member.user} has appeared!`,
			`It's a bird! It's a plane! Nevermind, it's just ${member.user}.`,
			`Ha! ${member.user} has joined! You activated my trap card!`,
			`Cheers, love! ${member.user}'s here!`,
			`Hey! Listen! ${member.user} has joined!`,
			`We've been expecting you ${member.user}`,
			`It's dangerous to go alone, take ${member.user}!`,
			`${member.user} has joined the server! It's super effective!`,
			`${member.user} is here, as the prophecy foretold.`,
			`${member.user} has arrived. Party's over.`,
			`Ready player ${member.user}.`,
			`${member.user} is here to kick butt and chew bubblegum. And ${member.user} is all out of gum.`,
			`Hello. Is it ${member.user} you're looking for?`,
			`Roses are red, violets are blue, ${member.user} joined this server with you.`,
			`${member.user} just arrived. Seems OP - please nerf.`,
			`${member.user} just joined. Hide your bananas.`,
			`It's ${member.user}! Praise the sun!`,
			`Never gonna give ${member.user} up. Never gonna let ${member.user} down.`,
			`${member.user} has joined. Stay a while and listen!`,
		],
		left: (user) => `${user} left the game.`,
	},
	xpAdd: {
		congratulations: `Congratulations`,
		description: (user, curLevel) => `${user} **leveled up to Lvl ${curLevel}**!`,
		rewards: (user, curLevel, unlocked) => `${user} **leveled up to Lvl ${curLevel}**\n*and unlocked these roles:*\n***${unlocked}***`,
	},
};