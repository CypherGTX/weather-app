const express = require("express");
const PORT = 3000;
const app = express();
const cors = require("cors")
const mongoose = require("mongoose");
require('dotenv').config();
const WeatherHistory = require('./models/History');

app.use(cors({
    origin: "http://localhost:5173",
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

app.get('/api/weather', async (req, res) => {
    const city = req.query.city;
    const apiKey = process.env.APP_ID;

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        const response = await fetch(url);
        const data = await response.json();

        // console.log(data);

        res.json({
            location: data.name,
            temperature: Math.floor(data.main.temp),
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            weatherStatus: data.weather[0].main
        })

    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
});

app.post('/api/history', async (req, res) => {

    try {
        const newRecord = new WeatherHistory(req.body);
        await newRecord.save();
        res.status(201).json(newRecord);
    } catch (err) {
        res.status(400).json({ error: "Saving error" });
    }

})

app.get('/api/history', async (req, res) => {
    const history = await WeatherHistory.find().sort({ date: -1 }); // Останні запити зверху
    res.json(history);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Example is running on http://localhost:${PORT}/api/weather?city=berlin`);
    console.log(`Example of history is running on http://localhost:${PORT}/api/history`);
});