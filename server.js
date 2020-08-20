const express = require("express");
const got = require("got");
const cors = require("cors");
const app = express();
const moment = require("moment");
const btoa = require("btoa");

const PORT = 8080;

app.use(cors());

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

app.get("/api/box-scores", async (req, res) => {
  let selectedDate = req.query.date;
  let mySportsFeedApiUrl = new URL(
    `https://api.mysportsfeeds.com/v2.1/pull/nba/2019-2020-regular/date/${moment(
      new Date(selectedDate)
    ).format("YYYYMMDD")}/player_gamelogs.json?`
  );
  const options = {
    method: "GET",
    headers: {
      Authorization:
        "Basic " + btoa(`${process.env.MYSPORTSFEED_API_KEY}:MYSPORTSFEEDS`),
    },
  };

  try {
    const boxScoreResponse = await got(mySportsFeedApiUrl.toString(), options);
    const boxScoreData = boxScoreResponse.body;
    res.send(boxScoreData);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.get("/api/daily-games", async (req, res) => {
  let selectedDate = req.query.date;
  let mySportsFeedApiUrl = new URL(
    `https://api.mysportsfeeds.com/v2.1/pull/nba/2019-2020-regular/date/${moment(
      new Date(selectedDate)
    ).format("YYYYMMDD")}/games.json`
  );

  const options = {
    method: "GET",
    headers: {
      Authorization:
        "Basic " + btoa(`${process.env.MYSPORTSFEED_API_KEY}:MYSPORTSFEEDS`),
    },
  };

  try {
    const dailyGamesResopnse = await got(
      mySportsFeedApiUrl.toString(),
      options
    );
    const dailyGamesData = dailyGamesResopnse.body;
    res.send(dailyGamesData);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.listen(process.env.port || PORT);
