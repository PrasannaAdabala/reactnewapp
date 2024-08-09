import { useState } from "react";

export const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputHandler = (e) => {
    setCity(e.target.value);
  };

  const submit = (e) => {
    e.preventDefault();
    fetchWeatherByCity();
  };

  const fetchWeatherByCity = () => {
    if (!city) {
      setError("Please enter a city.");
      return;
    }
    fetchWeather(`q=${city}`);
  };

  const fetchWeatherByCoords = (lat, lon) => {
    fetchWeather(`lat=${lat}&lon=${lon}`);
  };

  const fetchWeather = (query) => {
    setLoading(true);
    setError(null);

    const id = "80910612dcf7b8881a64531ad282247c";
    const url = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${id}&units=metric`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const tempInCelsius = data.main.temp;
        const tempInFahrenheit = (tempInCelsius * 9) / 5 + 32;
        data.main.temp = tempInFahrenheit;
        setWeather(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        setError("Error fetching weather data. Please try again.");
        setLoading(false);
      });
  };

  const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (err) => {
          console.error("Error getting location:", err);
          setError("Error fetching location. Please try again.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const getBackgroundStyle = (temp) => {
    let backgroundImage;
    if (temp < 80) {
      backgroundImage = "url('https://media.istockphoto.com/id/1289449088/photo/branches-covered-with-ice-after-freezing-rain-sparkling-ice-covered-everything-after-ice.jpg?s=612x612&w=0&k=20&c=HBpXbY4mvVDxUowmAibqHYvNqi-wIEU9DmXFxW4Cj98=')";
    } else if (temp < 95) {
      backgroundImage = "url('https://images.unsplash.com/photo-1561553590-267fc716698a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHdlYXRoZXJ8ZW58MHx8MHx8fDA%3D')";
    } else {
      backgroundImage = "url('https://geographical.co.uk/wp-content/uploads/shutterstock_1152324746-1.jpg')";
    }

    return {
      backgroundImage,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
      color: "#fff",
    };
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "20px",
    textAlign: "center",
    position: "relative",
    backgroundImage:"url(https://images.pexels.com/photos/2449543/pexels-photo-2449543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)",
    overflow: "hidden",
    ...((weather && weather.main) ? getBackgroundStyle(weather.main.temp) : {}),
  };

  const formStyle = {
    marginBottom: "20px",
    position: "relative",
    zIndex: 1,
  };

  const inputStyle = {
    padding: "10px",
    marginRight: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  };

  const buttonStyle = {
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "10px",
  };

  const buttonHoverStyle = {
    backgroundColor: "#0056b3",
  };

  return (
    <div style={containerStyle} >
      <form onSubmit={submit} style={formStyle}>
        <input
          type="text"
          placeholder="Enter city"
          onChange={inputHandler}
          value={city}
          style={inputStyle}
        />
        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor =
              buttonHoverStyle.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor =
              buttonStyle.backgroundColor)
          }
        >
          Get Weather
        </button>
        <button
          type="button"
          style={buttonStyle}
          onClick={getCurrentLocationWeather}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor =
              buttonHoverStyle.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor =
              buttonStyle.backgroundColor)
          }
        >
          Get Current Location Weather
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {weather && weather.main && !loading && !error && (
        <>
          <p>City: {weather.name}</p>
          <p>Temperature: {weather.main.temp}°F</p>
        </>
      )}
    </div>
  );
};

export default Weather;
