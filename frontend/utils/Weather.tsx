export const WEATHER_API_KEY = "f3a161624fb94728818fd63ea212aee0";

export const GetWeatherData = async (location: string) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${WEATHER_API_KEY}`
  );
  const data = await response.json();
  return data;
};
