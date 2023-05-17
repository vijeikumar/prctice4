const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");

const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let database = null;

const initializeDBAndServer = async () => {
  try {
    database = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (e) {
    console.log(`DB error : ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

const convertTheResponse = (eachObj) => {
  return {
    playerId: eachObj.player_id,
    playerName: eachObj.player_name,
    jerseyName: eachObj.jersey_name,
    role: eachObj.role,
  };
};

app.get("/players/", async (request, response) => {
  const getPlayers = `SELECT * FROM cricket_team`;
  const getAllPlayers = await database.all(getPlayers);
  response.send(getAllPlayers.map((eachOne) => convertTheResponse(eachOne)));
});

app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const postPlayers = `INSERT INTO cricket_team (player_name,jersey_number,role) 
    VALUES('${playerName}',${jerseyNumber},'${role}')`;
  const dbRes = await database.run(postPlayers);
  response.send("Player Added to Team");
});

app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const getPlayer = `SELECT * FROM cricket_team WHERE player_id=${playerId};`;
  const dbResponse = await database.get(getPlayer);
  response.send(convertTheResponse(dbResponse));
});

app.put("/players/:playerId", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const updatePlayer = `UPDATE cricket_team SET(playerName='${player_name}',jerseyNumber=${jersey_number},role='${role}') WHERE playerId=${player_id} `;
  const dpRes = await database.run(updatePlayer);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const delPlayer = `DELETE FROM cricket_team WHERE player_id=${playerId}`;
  await database.run(delPlayer);
  response.send("Player Removed");
});
module.exports = app;
