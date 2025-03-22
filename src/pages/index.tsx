"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Icon from '@mdi/react';
import { mdiRocket, mdiEarth, mdiStar } from '@mdi/js';
import { useRouter } from 'next/navigation';

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

interface VirgoStar {
  x: number;
  y: number;
  size: number;
  brightness: number;
}

interface VirgoLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const RocketIcon = () => (
  <Icon path={mdiRocket} size={1} />
);

const EarthIcon = () => (
  <Icon path={mdiEarth} size={1} />
);

const StarIcon = () => (
  <Icon path={mdiStar} size={1} />
);

interface ClockProps {
  initialTimezone?: string;
}

const Clock: React.FC<ClockProps> = ({ initialTimezone = 'Asia/Tokyo' }) => {
  const [mounted, setMounted] = useState(false);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [time, setTime] = useState<Date | null>(null);
  const [timezone, setTimezone] = useState(initialTimezone);
  const [currentBackground, setCurrentBackground] = useState<BackgroundStyle>('space-default');
  const [currentImage, setCurrentImage] = useState('image01');
  const [starPositions, setStarPositions] = useState<Array<{ left: number, top: number, size: number, delay: number }>>([]);


  const virgoStars: VirgoStar[] = [
    { x: 74.5, y: 19.1, size: 8, brightness: 0.9 },
    { x: 72, y: 15, size: 8, brightness: 0.7 },
    { x: 69, y: 10, size: 8, brightness: 0.8 },
    { x: 67.2, y: 7, size: 8, brightness: 0.7 },
    { x: 65.1, y: 5, size: 8, brightness: 0.8 },
    { x: 61.6, y: 8.8, size: 8, brightness: 0.8 },
    { x: 60, y: 15, size: 8, brightness: 0.7 },
    { x: 63, y: 18, size: 8, brightness: 0.8 },
    { x: 64, y: 22, size: 8, brightness: 0.7 },
    { x: 70, y: 22.5, size: 8, brightness: 0.8 },
    { x: 73, y: 26.5, size: 8, brightness: 0.7 },
    { x: 74.1, y: 29, size: 8, brightness: 0.7 },
    { x: 74.8, y: 38, size: 8, brightness: 0.7 },
    { x: 66.5, y: 1, size: 8, brightness: 0.7 },
    { x: 76.5, y: 19.1, size: 8, brightness: 0.9 },
    { x: 79.5, y: 30.5, size: 8, brightness: 0.9 },
  ];

  const virgoLines: VirgoLine[] = [
    { x1: 75, y1: 20, x2: 72, y2: 15 },
    { x1: 72, y1: 15, x2: 69, y2: 10 },
    { x1: 69, y1: 10, x2: 67, y2: 7 },
    { x1: 67, y1: 7, x2: 65, y2: 5 },
    { x1: 65, y1: 5, x2: 63, y2: 8 },
    { x1: 63, y1: 8, x2: 61, y2: 11 },
    { x1: 61, y1: 11, x2: 60, y2: 15 },
    { x1: 60, y1: 15, x2: 63, y2: 18 },
    { x1: 63, y1: 18, x2: 64, y2: 22 },
    { x1: 62, y1: 10, x2: 70, y2: 23 },
    { x1: 70, y1: 23, x2: 73, y2: 27 },
    { x1: 73, y1: 27, x2: 75, y2: 20 },
    { x1: 74.1, y1: 29, x2: 66.5, y2: 17.5 },
    { x1: 75, y1: 38, x2: 74.5, y2: 29 },
    { x1: 67, y1: 1, x2: 65.5, y2: 5 },
    { x1: 76.5, y1: 19.5, x2: 75, y2: 19.5 },
    { x1: 79.5, y1: 30.5, x2: 76.9, y2: 19.5 },
  ];

  const router = useRouter();
  const resetToDefaults = useCallback(() => {
    setTimezone('Asia/Tokyo');
    setCurrentBackground('space-default');
    setCurrentImage('image01');
  }, []);

  const handleMoonClick = useCallback(() => {
    router.push("/");
    resetToDefaults();
  }, [router, resetToDefaults]);

  useEffect(() => {
    if (!mounted) {
      setTimezone(initialTimezone);
      setCurrentBackground('space-default');
      setCurrentImage('image01');
    }
  }, [mounted, initialTimezone]);

  const formatDate = useCallback((date: Date) => {
    const days = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dayOfWeek = days[date.getDay()];

    return `${year}/${month}/${day} ${dayOfWeek}`;
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
    marginTop: '-22px',
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

  const getTimeInTimezone = useCallback(() => {
    if (!time) return null;
    const options = { timeZone: timezone };
    return new Date(time.toLocaleString('en-US', options));
  }, [time, timezone]);

  if (!mounted || !time) return null;

  const currentTime = getTimeInTimezone();
  if (!currentTime) return null;

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

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

        {/* 通常の星 */}
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

        {/* 乙女座の星座 - 線 */}
        <div className="absolute inset-0 pointer-events-none">
          <svg width="100%" height="100%" style={{ position: 'absolute' }}>
            {virgoLines.map((line, index) => (
              <line
                key={`line-${index}`}
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

        {/* 乙女座の星座 - 星 */}
        {virgoStars.map((star, index) => (
          <div
            key={`virgo-star-${index}`}
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
          title="設定リセット"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent to-gray-900 opacity-20" />
        </div>

        <div
          className="absolute left-10 top-10 w-32 h-32 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 animate-glow cursor-pointer z-50"
          onClick={() => {
            router.push("/luka-clock");
          }}
          title="ルカ(国内時計モード)"
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
              {formatDate(currentTime)}
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
                    <StarIcon />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed right-10 top-10 space-y-8 z-50">
          <div className="controls fixed right-10 top-10 space-y-8 z-50">
            <div className="control-item">
              <label htmlFor="image-select" className="block1 text-white mb-2">Image</label>
              <select
                id="image-select"
                value={currentImage}
                onChange={(e) => setCurrentImage(e.target.value)}
                className="bg-gray-800 text-white p-2 rounded w-50 mb-10"
              >
                <option value="image01">Image 1</option>
                <option value="image02">Image 2</option>
                <option value="image03">Image 3</option>
                <option value="image04">Image 4</option>
              </select>
            </div>

            <div className="control-item">
              <label htmlFor="timezone-select" className="block2 text-white">Timezone</label>
              <select
                id="timezone-select"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="bg-gray-800 text-white p-2 rounded"
              >
                <option value="Asia/Tokyo">Asia/Tokyo</option>
                <option value="Asia/Taipei">Asia/Taipei</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
                <option value="Europe/Paris">Europe/Paris</option>
                <option value="America/Los_Angeles">America/Los_Angeles</option>
              </select>
            </div>

            <div className="control-item">
              <label htmlFor="background-select" className="block3 text-white mb-2">Background</label>
              <select
                id="background-select"
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