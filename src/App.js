import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/cabs")
      .then((response) => {
        setData(response.data);
        const cabs_data = JSON.parse(localStorage.getItem("cabs")) || [];
        if (cabs_data.length > 0) {
          setFilteredData(cabs_data);
        } else {
          setFilteredData(response.data);
          localStorage.setItem("cabs", JSON.stringify(response.data));
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    console.log(filteredData);
  }, [filteredData]);

  const filterData = () => {
    const filteredCabs = data.filter((cab) => {
      const cabLatitude = cab.location_coordinates[0];
      const cabLongitude = cab.location_coordinates[1];
      const distance = calculateDistance(
        latitude,
        longitude,
        cabLatitude,
        cabLongitude
      );
      return distance < 2;
    });
    setFilteredData(filteredCabs);
    localStorage.setItem("cabs", JSON.stringify(filteredCabs));
    // localStorage.setItem("cabs",filteredCabs);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  return (
    <div className="App">
      <h1 className="app-title">Assignment</h1>
      <div className="user-data">
        <div className="cabs-filter">
          <h2>Cabs Data</h2>
          <div className="location-input">
            <input
              type="text"
              className="location-input-field"
              placeholder="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
            <input
              type="text"
              className="location-input-field"
              placeholder="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
            <button className="filter-btn" onClick={filterData}>
              Filter
            </button>
            <button
              className="show-all-btn"
              onClick={() => {
                axios
                  .get("http://localhost:8000/cabs")
                  .then((response) => {
                    setData(response.data);
                  })
                  .catch((error) => {
                    console.error("Error fetching data:", error);
                  });
                setFilteredData(data);
                setLatitude("");
                setLongitude("");
                localStorage.setItem("cabs", JSON.stringify(data));
              }}
            >
              Show All Cabs
            </button>
          </div>
        </div>
        <table className="cabs-table">
          <thead>
            <tr>
              <th>CAB ID</th>
              <th>DRIVER NAME</th>
              <th>CAR MODEL</th>
              <th>LOCATION</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user) => (
              <tr key={user.cab_id}>
                <td>{user.cab_id}</td>
                <td>{user.driver_name}</td>
                <td>{user.cab_model}</td>
                <td>{Array.isArray(user.location_coordinates) ? user.location_coordinates.join(", ") : "N/A"}</td>
              </tr>
            ))}
          </tbody>


        </table>
      </div>
    </div>
  );
}

export default App;
