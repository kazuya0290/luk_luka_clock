import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';


const cityCodeToOpenWeatherMap: Record<string, string> = {
    '016010': 'Sapporo',   
    '040010': 'Sendai',    
    '130010': 'Tokyo',     
    '230010': 'Nagoya',    
    '270000': 'Osaka',     
    '340010': 'Hiroshima', 
    '400010': 'Fukuoka'    
};


const regionToCityCode: Record<string, string> = {
    '北海道': '016010',
    '東北': '040010',
    '関東': '130010',
    '中部': '230010',
    '近畿': '270000',
    '中国・四国': '340010',
    '九州': '400010'
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    
    const { cityCode } = req.query;

    if (!cityCode || Array.isArray(cityCode)) {
        return res.status(400).json({ error: '不正なcityCodeパラメータです' });
    }

    try {
        
        let cityName = '';

        if (cityCodeToOpenWeatherMap[cityCode]) {
            cityName = cityCodeToOpenWeatherMap[cityCode];
        } else {
           
            for (const [region, code] of Object.entries(regionToCityCode)) {
                if (cityCode === region) {
                    cityName = cityCodeToOpenWeatherMap[code];
                    break;
                }
            }

            if (!cityName) {
                cityName = 'Tokyo';
                console.warn(`未知の都市コード: ${cityCode}, デフォルトのTokyo（関東）を使用します`);
            }
        }

        const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

        if (!API_KEY) {
            console.error('環境変数からAPIキーが取得できませんでした。環境変数の設定を確認してください。');
            return res.status(500).json({
                error: 'APIキーが設定されていません',
                forecasts: [{
                    telop: '不明',
                    temperature: {
                        min: { celsius: 0 },
                        max: { celsius: 0 }
                    }
                }]
            });
        }

        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName},jp&units=metric&appid=${API_KEY}`
        );

        const weatherData = {
            title: getCityNameJa(cityName),
            forecasts: [
                {
                    date: new Date().toISOString().split('T')[0],
                    telop: translateWeather(response.data.weather[0].main),
                    temperature: {
                        min: {
                            celsius: Math.round(response.data.main.temp_min)
                        },
                        max: {
                            celsius: Math.round(response.data.main.temp_max)
                        }
                    }
                }
            ]
        };

        res.status(200).json(weatherData);
    } catch (error) {
        console.error('天気データの取得に失敗しました:', error);

        let errorMessage = '天気データの取得に失敗しました';
        if (axios.isAxiosError(error)) {
            errorMessage += `: ${error.message}`;
            if (error.response) {
                errorMessage += ` (ステータス: ${error.response.status})`;
            }
        }

        res.status(500).json({
            error: errorMessage,
            forecasts: [{
                telop: '不明',
                temperature: {
                    min: { celsius: 0 },
                    max: { celsius: 0 }
                }
            }]
        });
    }
}

function translateWeather(englishWeather: string): string {
    const weatherMap: { [key: string]: string } = {
        'Clear': '晴れ',
        'Clouds': '曇り',
        'Rain': '雨',
        'Drizzle': '小雨',
        'Thunderstorm': '雷雨',
        'Snow': '雪',
        'Mist': '霧',
        'Fog': '霧',
        'Haze': '霞'
    };

    return weatherMap[englishWeather] || englishWeather;
}

function getCityNameJa(englishCityName: string): string {
    const cityNameMap: { [key: string]: string } = {
        'Sapporo': '札幌',
        'Sendai': '仙台',
        'Tokyo': '東京',
        'Nagoya': '名古屋',
        'Osaka': '大阪',
        'Hiroshima': '広島',
        'Fukuoka': '福岡'
    };

    return cityNameMap[englishCityName] || englishCityName;
}