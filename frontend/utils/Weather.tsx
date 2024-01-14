export const WEATHER_API_KEY = "f3a161624fb94728818fd63ea212aee0";

export const GetWeatherData = async (location): Promise<string> => {
  if (location === "null" || location === null) {
    return "no location data provided for weather";
  }

  const lat = location["latitude"];
  const lon = location["longitude"];

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
  );
  const data = await response.json();
  if ((await response.status) === 200) {
    return data.weather[0].description;
  } else {
    return "Weather not avalible";
  }
};
