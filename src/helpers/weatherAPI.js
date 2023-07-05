const token = import.meta.env.VITE_TOKEN;
const BASE_URL = 'http://api.weatherapi.com/v1/';

export const searchCities = async (term) => {
  const response = await fetch(`${BASE_URL}search.json?lang=pt&key=${token}&q=${term}`);
  const data = await response.json();
  if (data.length === 0) {
    throw new Error('Nenhuma cidade encontrada');
  }
  return data.map((city) => {
    const { url } = city;
    return url;
  });
};

export const getWeatherByCity = async (cityUrl) => {
  const infoCitys = cityUrl.map(async (url) => {
    const response = await fetch(
      `${BASE_URL}current.json?lang=pt&key=${token}&q=${url}`,
    );
    const data = await response.json();
    return data;
  });
  const output = await Promise.all(infoCitys);
  return output.map((city) => {
    const { current } = city;
    const { location } = city;
    const { name, country } = location;
    const { condition } = current;
    const { text, icon } = condition;
    const newInfo = { condition: text };
    newInfo.icon = icon;
    newInfo.name = name;
    newInfo.temp = current.temp_c;
    newInfo.country = country;
    return newInfo;
  });
};

export async function requestForecast(url) {
  const response = await fetch(
    `${BASE_URL}forecast.json?lang=pt&key=${token}&q=${url}&days=7`,
  );
  const data = await response.json();
  return data.forEach((prev) => {
    const { forecast } = prev;
    const { forecastday } = forecast;
    const newData = Object();
    newData.date = forecastday.date;
    newData.maxTemp = forecastday.day.maxtemp_c;
    newData.minTemp = forecastday.day.mintemp_c;
    newData.condition = forecast.day.condition.text;
    newData.icon = forecast.day.condition.icon;
    return newData;
  });
}
