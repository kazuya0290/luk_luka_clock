"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Icon from '@mdi/react';
import { mdiRocket, mdiEarth, mdiHeart, mdiWeatherSunny, mdiWeatherRainy, mdiWeatherCloudy, mdiWeatherSnowy, mdiWeatherPartlyCloudy } from '@mdi/js';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type BackgroundStyle =
    | 'space-default'
    | 'space-aurora'
    | 'space-nebula'
    | 'space-galaxy'
    | 'space-sunset'
    | 'space-deep'
    | 'space-cosmos'
    | 'space-milkyway'
    | 'space-stardust'
    | 'space-supernova'
    | 'space-animated';

type BackgroundStyles = Record<BackgroundStyle, string>;

interface ShootingStar {
    left: number;
    top: number;
    key: number;
    speed: number;
}

interface AquariusStar {
    x: number;
    y: number;
    size: number;
    brightness: number;
}

interface AquariusLine {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

interface WeatherData {
    region: string;
    weather: string;
    temperature: number;
    isLoading: boolean;
    error: string | null;
}


type JapanRegion = '北海道' | '東北' | '関東' | '中部' | '近畿' | '中国・四国' | '九州';


const regionToCityMap: Record<JapanRegion, string> = {
    '北海道': '016010', 
    '東北': '040010',   
    '関東': '130010',   
    '中部': '230010',   
    '近畿': '270000',   
    '中国・四国': '340010', 
    '九州': '400010'    
};

const RocketIcon = () => (
    <Icon path={mdiRocket} size={1} />
);

const EarthIcon = () => (
    <Icon path={mdiEarth} size={1} />
);

const HeartIcon = () => (
    <Icon path={mdiHeart} size={1} />
);


const getWeatherIcon = (weather: string) => {
    if (weather.includes('晴')) {
        if (weather.includes('曇') || weather.includes('一時')) {
            return <Icon path={mdiWeatherPartlyCloudy} size={1.5} color="#FFFFFF" />;
        }
        return <Icon path={mdiWeatherSunny} size={1.5} color="#FFFFFF" />;
    } else if (weather.includes('雨')) {
        return <Icon path={mdiWeatherRainy} size={1.5} color="#FFFFFF" />;
    } else if (weather.includes('雪')) {
        return <Icon path={mdiWeatherSnowy} size={1.5} color="#FFFFFF" />;
    } else if (weather.includes('曇')) {
        return <Icon path={mdiWeatherCloudy} size={1.5} color="#FFFFFF" />;
    }
    return <Icon path={mdiWeatherPartlyCloudy} size={1.5} color="#FFFFFF" />;
};

interface ClockProps {
    initialRegion?: JapanRegion;
}

const Clock: React.FC<ClockProps> = ({ initialRegion = '関東' }) => {
    const [mounted, setMounted] = useState(false);
    const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
    const [time, setTime] = useState<Date | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<JapanRegion>(initialRegion);
    const [currentBackground, setCurrentBackground] = useState<BackgroundStyle>('space-default');
    const [currentImage, setCurrentImage] = useState('luka01');
    const [starPositions, setStarPositions] = useState<Array<{ left: number, top: number, size: number, delay: number }>>([]);
    const [weatherData, setWeatherData] = useState<WeatherData>({
        region: initialRegion,
        weather: '',
        temperature: 0,
        isLoading: true,
        error: null
    });

    const aquariusStars: AquariusStar[] = [
        { x: 71, y: 7.5, size: 8, brightness: 0.9 },
        { x: 68.2, y: 10.5, size: 8, brightness: 0.9 },
        { x: 80, y: 15, size: 8, brightness: 0.9 },
        { x: 71.1, y: 15, size: 8, brightness: 0.9 },
        { x: 75, y: 22, size: 8, brightness: 0.9 },
        { x: 66.9, y: 7.5, size: 8, brightness: 0.9 },
        { x: 65.2, y: 10.5, size: 8, brightness: 0.9 },
        { x: 63.2, y: 15.5, size: 8, brightness: 0.9 },
        { x: 65.2, y: 14.5, size: 8, brightness: 0.9 },
        { x: 67.2, y: 16.5, size: 8, brightness: 0.9 },
        { x: 66.2, y: 25.5, size: 8, brightness: 0.9 },
    ];

    const aquariusLines: AquariusLine[] = [
        { x1: 69, y1: 11, x2: 71.5, y2: 8 },
        { x1: 80, y1: 15, x2: 71.5, y2: 8 },
        { x1: 71.4, y1: 16, x2: 71.4, y2: 8 },
        { x1: 75, y1: 22, x2: 71.4, y2: 16 },
        { x1: 67, y1: 8, x2: 68.8, y2: 11.9 },
        { x1: 67, y1: 8, x2: 65.2, y2: 12 },
        { x1: 66, y1: 10.2, x2: 63.2, y2: 16.4 },
        { x1: 63.2, y1: 16.2, x2: 65.2, y2: 15.4 },
        { x1: 65.4, y1: 14.5, x2: 67.2, y2: 17.1 },
        { x1: 66.5, y1: 25.5, x2: 67.5, y2: 16.5 },
    ];

    const router = useRouter();
    const resetToDefaults = useCallback(() => {
        setSelectedRegion('関東');
        setCurrentBackground('space-default');
        setCurrentImage('luka01');
    }, []);

    const handleMoonClick = useCallback(() => {
        router.push("/");
        resetToDefaults();
    }, [router, resetToDefaults]);

    useEffect(() => {
        if (!mounted) {
            setSelectedRegion(initialRegion);
            setCurrentBackground('space-default');
            setCurrentImage('luka01');
        }
    }, [mounted, initialRegion]);

   
    const fetchWeatherData = useCallback(async (region: JapanRegion) => {
        setWeatherData(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            
            const cityCode = regionToCityMap[region];

            
            const response = await axios.get(`/api/weather?cityCode=${cityCode}`);

            
            if (response.data && response.data.forecasts && response.data.forecasts.length > 0) {
               
                const todayForecast = response.data.forecasts[0];

                
                const temperature =
                    (todayForecast.temperature?.max?.celsius !== undefined)
                        ? todayForecast.temperature.max.celsius
                        : (todayForecast.temperature?.min?.celsius !== undefined)
                            ? todayForecast.temperature.min.celsius
                            : 0;

                setWeatherData({
                    region: region,
                    weather: todayForecast.telop || '不明',
                    temperature: temperature,
                    isLoading: false,
                    error: null
                });
            } else {
                throw new Error('予期しない形式のデータを受信しました');
            }
        } catch (error) {
            console.error('天気データの取得に失敗しました:', error);
            let errorMessage = '天気データの取得に失敗しました';

            if (axios.isAxiosError(error) && error.response) {
                errorMessage += `: ${error.response.data?.error || error.message}`;
            }

            setWeatherData(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage
            }));
        }
    }, []);

    
    useEffect(() => {
        if (mounted) {
            fetchWeatherData(selectedRegion);
        }
    }, [selectedRegion, mounted, fetchWeatherData]);

    const formatDate = useCallback((date: Date) => {
        const days = ['日', '月', '火', '水', '木', '金', '土'];
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dayOfWeek = days[date.getDay()];

        return `${year}年${month}月${day}日(${dayOfWeek})`;
    }, []);

    const backgroundStyles: BackgroundStyles = {
        'space-default': 'bg-gradient-to-b from-black via-purple-900 to-blue-900',
        'space-aurora': 'bg-gradient-to-b from-black via-green-900 to-blue-900',
        'space-nebula': 'bg-gradient-to-b from-purple-900 via-pink-900 to-blue-900',
        'space-galaxy': 'bg-gradient-to-b from-black via-blue-900 to-purple-900',
        'space-sunset': 'bg-gradient-to-b from-black via-red-900 to-purple-900',
        'space-deep': 'bg-gradient-to-b from-indigo-950 via-blue-950 to-purple-950',
        'space-cosmos': 'bg-gradient-to-b from-violet-950 via-fuchsia-900 to-blue-950',
        'space-milkyway': 'bg-gradient-to-b from-slate-950 via-indigo-900 to-violet-950',
        'space-stardust': 'bg-gradient-to-b from-purple-950 via-pink-900 to-indigo-950',
        'space-supernova': 'bg-gradient-to-b from-rose-950 via-orange-900 to-purple-950',
        'space-animated': 'cosmic-gradient'
    };

    const getClockStyle = useCallback(() => ({
        position: 'relative' as const,
        width: '500px',
        height: '500px',
        marginTop: '-60px',
        backgroundImage: `url('/${currentImage}.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        border: '5px solid #000',
        borderRadius: '50%',
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden'
    }), [currentImage]);

    useEffect(() => {
        setMounted(true);

        const initialStars = Array.from({ length: 200 }, () => ({
            left: Math.random() * 100,
            top: Math.random() * 100,
            size: Math.random() * 3 + 1,
            delay: Math.random() * 5
        }));
        setStarPositions(initialStars);

        const createShootingStar = () => {
            const star: ShootingStar = {
                left: Math.random() * 100,
                top: Math.random() * 50,
                key: Date.now(),
                speed: Math.random() * 0.5 + 1
            };
            setShootingStars(prev => [...prev, star]);

            setTimeout(() => {
                setShootingStars(prev => prev.filter(s => s.key !== star.key));
            }, star.speed * 1500);
        };

        const shootingStarInterval = setInterval(createShootingStar, 30000);
        createShootingStar();

        return () => {
            clearInterval(shootingStarInterval);
        };
    }, []);

    useEffect(() => {
        if (!mounted) return;

        setTime(new Date());
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, [mounted]);

    if (!mounted || !time) return null;

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const secondDegrees = ((seconds / 60) * 360);
    const minuteDegrees = ((minutes / 60) * 360) + ((seconds / 60) * 6);
    const hourDegrees = ((hours % 12) / 12) * 360 + ((minutes / 60) * 30);

    return (
        <div className={`relative min-h-screen ${backgroundStyles[currentBackground]} overflow-hidden`}>
            <div className="fixed inset-0">
                <div className="background-container">
                    <div className={currentBackground === 'space-animated' ? 'cosmic-gradient' : backgroundStyles[currentBackground]} />
                    {currentBackground === 'space-animated' && <div className="cosmic-overlay" />}
                </div>

                {starPositions.map((star, index) => (
                    <div
                        key={index}
                        className="absolute rounded-full bg-white animate-twinkle"
                        style={{
                            left: `${star.left}%`,
                            top: `${star.top}%`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            animationDelay: `${star.delay}s`,
                            boxShadow: `0 0 ${star.size * 2}px ${star.size}px rgba(255, 255, 255, 0.7)`
                        }}
                    />
                ))}

               
                <div className="absolute inset-0 pointer-events-none">
                    <svg width="100%" height="100%" style={{ position: 'absolute' }}>
                        {aquariusLines.map((line, index) => (
                            <line
                                key={`aquarius-line-${index}`}
                                x1={`${line.x1}%`}
                                y1={`${line.y1}%`}
                                x2={`${line.x2}%`}
                                y2={`${line.y2}%`}
                                stroke="rgba(255, 255, 255, 0.4)"
                                strokeWidth="1"
                                strokeDasharray="3,2"
                            />
                        ))}
                    </svg>
                </div>

                {aquariusStars.map((star, index) => (
                    <div
                        key={`aquarius-star-${index}`}
                        className="absolute rounded-full bg-white animate-pulse"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            opacity: star.brightness,
                            boxShadow: `0 0 ${star.size * 3}px ${star.size}px rgba(255, 255, 255, 0.9)`,
                            animationDuration: `${3 + Math.random() * 2}s`
                        }}
                    />
                ))}

                {shootingStars.map((star) => (
                    <div
                        key={star.key}
                        className="absolute animate-shooting-star"
                        style={{
                            left: `${star.left}%`,
                            top: `${star.top}%`,
                            animationDuration: `${star.speed}s`
                        }}
                    >
                        <div className="w-0.5 h-16 bg-white transform -rotate-45 origin-bottom-left animate-diagonal-streak opacity-80" />
                    </div>
                ))}

                <div
                    className="absolute right-10 top-10 w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 animate-glow cursor-pointer z-50"
                    onClick={handleMoonClick}
                    title="戻る"
                >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent to-gray-900 opacity-20" />
                </div>

                <div className="relative z-10">
                    <div className="flex flex-col items-center justify-center p-1">
                        <div className="digital-clock text-4xl mb-8 text-white">
                            {`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}
                        </div>

                        <div className="date-display text-2xl mb-8 text-white font-mono" style={{
                            textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                            fontFamily: 'Roboto Mono, monospace'
                        }}>
                            {formatDate(time)}
                        </div>

                        
                        <div className="weather-display text-xl mb-8 text-white flex items-center space-x-4">
                            {weatherData.isLoading ? (
                                <div>データ取得中...</div>
                            ) : weatherData.error ? (
                                <div className="text-red-300">{weatherData.error}</div>
                            ) : (
                                <>
                                    <div className="weather-icon2">
                                        {getWeatherIcon(weatherData.weather)}
                                    </div>
                                    <div className="weather-info">
                                        {weatherData.temperature}°C
                                    </div>
                                </>
                            )}
                        </div>

                        <div style={getClockStyle()} className="z-20">
                            <div className="clock-face">
                                {['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'].map((number, index) => (
                                    <div
                                        key={number}
                                        className="number absolute w-6 text-center text-white"
                                        style={{
                                            transform: `rotate(${index * 30}deg) translateY(-220px)`
                                        }}
                                    >
                                        {number}
                                    </div>
                                ))}

                                <div
                                    className="hour-hand absolute left-1/2 bottom-1/2 origin-bottom"
                                    style={{
                                        transform: `translate(-50%, 0) rotate(${hourDegrees}deg)`
                                    }}
                                >
                                    <div className="hand-line1" style={{ transform: 'scaleY(2.3)' }} />
                                    <div className="hand-icon1">
                                        <RocketIcon />
                                    </div>
                                </div>
                                <div
                                    className="minute-hand absolute left-1/2 bottom-1/2 origin-bottom"
                                    style={{
                                        transform: `translate(-50%, 0) rotate(${minuteDegrees}deg)`
                                    }}
                                >
                                    <div className="hand-line2" style={{ transform: 'scaleY(4.0)' }} />
                                    <div className="hand-icon2">
                                        <EarthIcon />
                                    </div>
                                </div>
                                <div
                                    className="second-hand absolute left-1/2 bottom-1/2 origin-bottom"
                                    style={{
                                        transform: `translate(-50%, 0) rotate(${secondDegrees}deg)`
                                    }}
                                >
                                    <div className="hand-line3" style={{ transform: 'scaleY(5.3)' }} />
                                    <div className="hand-icon3">
                                        <HeartIcon />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fixed right-10 top-10 z-50">
                    <div className="controls-2">
                        <div className="control-item2">
                            <label htmlFor="image-select2" className="block4">Luka_image</label>
                            <select
                                id="image-select2"
                                value={currentImage}
                                onChange={(e) => setCurrentImage(e.target.value)}
                                className="bg-gray-800 text-white p-2 rounded"
                            >
                                <option value="luka01">Luka 1</option>
                                <option value="luka02">Luka 2</option>
                                <option value="luka03">Luka 3</option>
                            </select>
                        </div>

                        <div className="control-item2">
                            <label htmlFor="region-select" className="block5">Weather_select</label>
                            <select
                                id="region-select"
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value as JapanRegion)}
                                className="bg-gray-800 text-white p-2 rounded"
                            >
                                <option value="北海道">北海道</option>
                                <option value="東北">東北</option>
                                <option value="関東">関東</option>
                                <option value="中部">中部</option>
                                <option value="近畿">近畿</option>
                                <option value="中国・四国">中国・四国</option>
                                <option value="九州">九州</option>
                            </select>
                        </div>

                        <div className="control-item2">
                            <label htmlFor="background-select2" className="block6">Background</label>
                            <select
                                id="background-select2"
                                value={currentBackground}
                                onChange={(e) => setCurrentBackground(e.target.value as BackgroundStyle)}
                                className="bg-gray-800 text-white p-2 rounded"
                            >
                                <option value="space-default">Default</option>
                                <option value="space-aurora">Aurora</option>
                                <option value="space-nebula">Nebula</option>
                                <option value="space-galaxy">Galaxy</option>
                                <option value="space-sunset">Sunset</option>
                                <option value="space-deep">Deep</option>
                                <option value="space-cosmos">Galaxy2</option>
                                <option value="space-milkyway">Milkyway</option>
                                <option value="space-stardust">Star-dust</option>
                                <option value="space-supernova">Supernova</option>
                                <option value="space-animated">Animation</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Clock;