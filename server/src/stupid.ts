import { Level, Record, Player } from "./schema"
import mongoose from "mongoose"
import { readFile } from "node:fs/promises"

async function openDB(): Promise<mongoose.ClientSession> {
	mongoose.connect(process.env.DB_URI as string)
	return mongoose.startSession()
}

type FileRecord = {
	player: string,
	video: string,
	framerate: number
}

type FileLevel = {
	name: string,
	authors: Array<string>,
	points: number,
	records: Array<FileRecord>
}

let players: Record<string, boolean> = {}

async function insertLevel(session: mongoose.ClientSession, level: FileLevel, position: number) {
	const dbLevel = new Level({
		name: level.name,
		creator: level.authors[0],
		position,
		points: level.points
	})

	await dbLevel.add(session)

	for (const record of level.records) {
		players[record.player] = true
	}
}

async function insertRecords(session: mongoose.ClientSession, level: FileLevel) {
	console.log(`Inserting completions for ${level.name}`)
	for (const record of level.records) {
		console.log(`Inserting ${record.player}'s ${record.framerate} completion`)
		const dbRecord = new Record({
			level: level.name,
			hertz: record.framerate,
			link: record.video,
			player: record.player
		})
		dbRecord.$session(session)
		await dbRecord.save()
	}
}

async function insertPlayers(session: mongoose.ClientSession) {
	for (const player of Object.keys(players)) {
		console.log(`Inserting player ${player}`)
		const dbPlayer = new Player({
			name: player,
			points: 0
		})
		dbPlayer.$session(session)
		await dbPlayer.save()
	}
}

async function main() {
	console.log("Hi")
	let levels = JSON.parse((await readFile("./levels.json")).toString()) as Array<FileLevel>
	console.log("Loaded levels")
	console.log(JSON.stringify(levels[0]))
	let session = await openDB()
	console.log("Opened DB")

	let pos = 1
	for (const level of levels) {
		console.log(`Inserting level "${level.name}"`)
		await insertLevel(session, level, pos)
		pos += 1
	}

	console.log("Inserting players detected")
	await insertPlayers(session)

	console.log("Inserting records for all levels")
	for (const level of levels) {
		await insertRecords(session, level)
	}

	console.log("Committing transaction")
	console.log(await Level.findOne())
	console.log(await Player.findOne())
	console.log(await Record.findOne())
}

main()
