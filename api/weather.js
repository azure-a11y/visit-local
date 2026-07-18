// Vercel 서버리스 함수: 브라우저 대신 서버에서 Google Weather API를 호출한다.
// API 키는 절대 클라이언트로 내려보내지 않고, 필요한 값만 가공해 응답한다.
const { location, languageCode, unitsSystem } = require('./weather.config');

const GOOGLE_WEATHER_ENDPOINT = 'https://weather.googleapis.com/v1/currentConditions:lookup';

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'GET 요청만 허용됩니다.' });
    return;
  }

  const apiKey = process.env.GOOGLE_WEATHER_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'GOOGLE_WEATHER_API_KEY 환경변수가 설정되지 않았습니다.' });
    return;
  }

  const params = new URLSearchParams({
    key: apiKey,
    'location.latitude': String(location.latitude),
    'location.longitude': String(location.longitude),
    languageCode: languageCode,
    unitsSystem: unitsSystem,
  });

  try {
    const upstream = await fetch(GOOGLE_WEATHER_ENDPOINT + '?' + params.toString());
    if (!upstream.ok) {
      res.status(upstream.status).json({ error: 'Google Weather API 호출에 실패했습니다.' });
      return;
    }

    const data = await upstream.json();

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    res.status(200).json({
      temperature: data.temperature ? data.temperature.degrees : null,
      feelsLikeTemperature: data.feelsLikeTemperature ? data.feelsLikeTemperature.degrees : null,
      humidity: typeof data.relativeHumidity === 'number' ? data.relativeHumidity : null,
      precipitationProbability: data.precipitation && data.precipitation.probability
        ? data.precipitation.probability.percent
        : null,
      description: data.weatherCondition && data.weatherCondition.description
        ? data.weatherCondition.description.text
        : null,
    });
  } catch (err) {
    res.status(502).json({ error: '날씨 정보를 가져오는 중 오류가 발생했습니다.' });
  }
};
