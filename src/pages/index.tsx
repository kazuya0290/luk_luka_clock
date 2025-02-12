"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Icon from '@mdi/react';
import { mdiRocket, mdiEarth, mdiStar } from '@mdi/js';
import { useRouter } from 'next/router';

interface ShootingStar {
  left: number;
  top: number;
  key: number;
  speed: number;
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
  const [currentBackground, setCurrentBackground] = useState('space-default');
  const [currentImage, setCurrentImage] = useState('image01');
  const [starPositions, setStarPositions] = useState<Array<{ left: number, top: number, size: number, delay: number }>>([]);

  const router = useRouter();
  const resetToDefaults = useCallback(() => {
    setTimezone('Asia/Tokyo');
    setCurrentBackground('space-default');
    setCurrentImage('image01');
  }, []);

  const handleMoonClick = useCallback(() => {
    if (router.pathname === "/luka-clock") {
      router.push("/");
    } else {
      resetToDefaults();
    }
  }, [router, resetToDefaults]);

  useEffect(() => {
    if (!mounted) {
      setTimezone(initialTimezone);
      setCurrentBackground('space-default');
      setCurrentImage('image01');
    }
  }, [mounted, initialTimezone]);

  const backgroundStyles = {
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
    marginTop: '10px',
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
          title="Reset to defaults"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent to-gray-900 opacity-20" />
        </div>

        <div
          className="absolute left-10 top-10 w-32 h-32 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 animate-glow cursor-pointer z-50"
          onClick={() => {
            router.push("/luka-clock");
          }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent to-gray-900 opacity-20" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col items-center justify-center p-1">
            <div className="digital-clock text-4xl mb-8 text-white">
              {`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}
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
                <option value="image05">Image 5</option>
                <option value="image06">Image 6</option>
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
                onChange={(e) => setCurrentBackground(e.target.value)}
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