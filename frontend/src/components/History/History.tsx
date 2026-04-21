import './History.css';
import { useEffect, useState } from "react";


type HistoryItem = {
  id: number;
  Location: string;
  Status: string;
  Temperature: number;
  Humidity: number;
  WindSpeed: number;
  created_at: string;
};

function History() {
  const [data, setData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");


  const fetchHistory = async (overrideCity: string = city, overrideDate: string = date) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (overrideCity) params.append("city", overrideCity);
      if (overrideDate) params.append("date", overrideDate);

      const query = params.toString();
      const url = `/api/history${query ? `?${query}` : ""}`;

      const response = await fetch(url);
      const data = await response.json();

      setData(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setCity("");
    setDate("");
    fetchHistory("", "");
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="history">
      <h1 className="mb-5">History</h1>
      <div className="flex justify-between items-center mb-5">
        <input
          type="text"
          placeholder="Search by city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="search-input"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="search-input"
        />

        <button onClick={() => fetchHistory()}>
          Apply Filters
        </button>

        {(city || date) && (
          <button onClick={clearFilters}>Clear Filters</button>
        )}

        <button onClick={() => fetchHistory()} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <table className="history-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Location</th>
            <th>Status</th>
            <th>Temperature</th>
            <th>Humidity</th>
            <th>Wind Speed</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.Location}</td>
              <td>{item.Status}</td>
              <td>{item.Temperature}°C</td>
              <td>{item.Humidity}%</td>
              <td>{item.WindSpeed} m/s</td>
              <td>{new Date(item.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default History;
