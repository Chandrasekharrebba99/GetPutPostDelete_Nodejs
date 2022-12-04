const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

let db = null;
const dbpath = path.join(__dirname, "cricketTeam.db");

const intialDBandserver = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("localhost:3000");
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
intialDBandserver();

app.use(express.json());

app.get("/players/", async (req, res) => {
  const Query = `SELECT * FROM cricket_team`;

  const resultarr = await db.all(Query);
  const convertDbObjectToResponseObject = (resultarr) => {
    return {
      playerId: resultarr.player_id,
      playerName: resultarr.player_name,
      jerseyNumber: resultarr.jersey_number,
      role: resultarr.role,
    };
  };
  let finalresult = resultarr.map((obj) =>
    convertDbObjectToResponseObject(obj)
  );

  //resultDB = convertDbObjectToResponseObject(finalresult);
  res.send(finalresult);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;

  const addplayerQuery = `
    INSERT INTO
      cricket_team(player_name,jersey_number,role)
    VALUES
      (
        '${playerName}',
         ${jerseyNumber}, 
         '${role}'
        
      );`;

  const dbResponse = await db.run(addplayerQuery);
  const playerID = dbResponse.lastID;
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (req, res) => {
  const { playerId } = req.params;
  const Query = `SELECT * FROM cricket_team WHERE
    player_id = ${playerId}`;

  const resultarr = await db.get(Query);
  const convertDbObjectToResponseObject = (resultarr) => {
    return {
      playerId: resultarr.player_id,
      playerName: resultarr.player_name,
      jerseyNumber: resultarr.jersey_number,
      role: resultarr.role,
    };
  };

  res.send(convertDbObjectToResponseObject(resultarr));
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerID } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  console.log(playerID);
  const updatePlayerQuery = `
    UPDATE
      cricket_team
    SET
      player_name = '${playerName}'
      jersey_name = ${jerseyNumber},
      role='${role}'
    WHERE
      player_id = ${playerID};`;
  console.log(updatePlayerQuery);
  await db.run(updatePLayerQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  console.log(playerID);
  const deleteBookQuery = `
    DELETE FROM
      cricket_team
    WHERE player_Id = ${13};`;

  await db.run(deleteBookQuery);
  response.send("player Removed");
});

module.exports = app;
