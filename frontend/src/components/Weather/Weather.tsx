import {/*useEffect,*/ useState} from "react";
import './Weather.css';


type WeatherData = {
    location: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
    weatherStatus: string;
};

function Weather() {

    const [city, setCity] = useState<string>("");
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

    const handleKeyDown = (e: any) => {
        e.preventDefault();
        void search(city);
    };
    const search = async (city: string) => {

        try {
            const url = `http://localhost:3000/api/weather?city=${city}`;
            const response = await fetch(url);
            const data = await response.json();
            console.log(data)

            if (!response.ok) {
                setWeatherData(null);
                // customData = data;
                alert(data.message);
                return;
            }

            if (response.ok) {
                await fetch("http://localhost:3000/api/history", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        location: data.location,
                        temperature: data.temperature,
                        humidity: data.humidity,
                        windSpeed: data.windSpeed,
                        weatherStatus: data.weatherStatus,
                    })
                })
            }

            setWeatherData(data as WeatherData);

        } catch (error) {
            setWeatherData(null);
            console.error("Error in fetching weather data")
        }
    }

    // useEffect(() => { //option to set city by default
    //     // Optional default load:
    //     setCity("Berlin");
    //     void search("Berlin");
    // }, []);

    return (
        <div className="weather">
            <h1>Weather</h1>
            <form className="search-bar mb-5" onSubmit={handleKeyDown}>
                <input
                    type="text"
                    placeholder="Search"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="search-input"
                />
                <button type="submit">Send</button>
            </form>

            {weatherData && (
                <div className="weather-result">
                    <div className="weather-location">
                        <span className="title">Location: </span>
                        <span className="value">{weatherData.location}</span>
                    </div>
                    <div className="weather-status">
                        <span className="title">Status: </span>
                        <span className="value">{weatherData.weatherStatus}</span>
                    </div>
                    <div className="weather-temperature">
                        <span className="title">Temperature: </span>
                        <span className="value">{weatherData.temperature} °C</span>
                    </div>
                    <div className="weather-humidity">
                        <span className="title">Humidity: </span>
                        <span className="value">{weatherData.humidity}%</span>
                    </div>
                    <div className="weather-wind">
                        <span className="title">Wind Speed: </span>
                        <span className="value">{weatherData.windSpeed} m/s</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Weather;
