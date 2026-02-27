const express = require("express");
const PORT = 3000;
const app = express();
const cors = require("cors")
require('dotenv').config();

app.use(cors({
    origin: "http://localhost:5173",
}));

app.get('/api/weather', async (req, res) => {
    const city = req.query.city;
    const apiKey = process.env.APP_ID;

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        const response = await fetch(url);
        const data = await response.json();

        res.json({
            location: data.name,
            temperature: Math.floor(data.main.temp),
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            weatherStatus: data.weather[0].main
        })

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
    console.log(`Example is running on http://localhost:${PORT}/api/weather?city=berlin`)
});