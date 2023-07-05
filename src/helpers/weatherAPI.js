const token = import.meta.env.VITE_TOKEN;
const BASE_URL = 'http://api.weatherapi.com/v1/';

export const searchCities = async (term) => {
  if (term === '') {
    return alert('Nenhuma cidade encontrada');
  }
  const response = await fetch(`${BASE_URL}search.json?lang=pt&key=${token}&q=${term}`);
  const data = await response.json();
  return data.map((city) => {
    const { url } = city;
    return url;
  });
};

export const getWeatherByCity = async (cityUrl) => {
  const infoCitys = cityUrl.map(async (url) => {
    const response = await fetch(`${BASE_URL}current.json?lang=pt&key=${token}&q=${url}`);
    const data = await response.json();
    return data;
  });
  const output = await Promise.all(infoCitys);
  return output.map((city) => {
    const { current } = city;
    const { location } = city;
    const { name, country } = location;
    const { temp_c, condition } = current;
    const { text, icon } = condition;
    const newInfo = { temp: temp_c, condition: text };
    newInfo.icon = icon;
    newInfo.name = name;
    newInfo.country = country;
    return newInfo;
  });
};