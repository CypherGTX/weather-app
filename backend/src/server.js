import express from "express";
import cors from "cors";
import "dotenv/config.js"

const app = express();
import {db} from "./db.js";

const PORT = 3000;
// app.use(cors({
//     origin: "http://frontend:80",
// }));

app.use(express.json());

const test = async () => {
    try {
        const [rows] = await db.query('SELECT 1 + 1');
        console.log("Database connected");
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
};

test();

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
        res.status(500).json({message: "Server error", error: error.message});
    }
});

app.post("/api/history", async (req, res) => {
    try {
        const {location, temperature, humidity, windSpeed, weatherStatus} = req.body;
        const sql = "INSERT INTO history_items (Location, Status, Temperature, Humidity, WindSpeed) VALUES (?, ?, ?, ?, ?)";
        await db.execute(sql, [location, weatherStatus, temperature, humidity, windSpeed]);
        res.status(201).json({message: "Item added successfully", time: new Date()});
    } catch (err) {
        res.status(500).json({error: "Saving error"});
    }
})

app.get("/api/history", async (req, res) => {
    const [rows] = await db.query("SELECT * FROM history_items");

    res.json(rows);
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Example is running on http://localhost:${PORT}/api/weather?city=berlin`);
    console.log(`Example of history is running on http://localhost:${PORT}/api/history`);
});
