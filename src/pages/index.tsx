"use client";
import React, { useState, useEffect } from 'react';
import { useCallback } from 'react';
import Icon from '@mdi/react';
import { mdiShark, mdiTortoise, mdiDolphin } from '@mdi/js';

// カスタムSVGコンポーネントの定義（変更なし）
const DolphinIcon = () => (
  <Icon path={mdiDolphin} size={1} />
);

const TortoiseIcon = () => (
  <Icon path={mdiTortoise} size={1} />
);

const SharkIcon = () => (
  <Icon path={mdiShark} size={1} />
);

interface ClockProps {
  initialTimezone?: string;
}

const Clock: React.FC<ClockProps> = ({ initialTimezone = 'Asia/Tokyo' }) => {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [timezone, setTimezone] = useState(initialTimezone);
  const [currentBackground, setCurrentBackground] = useState('bg-default');
  const [currentBubbleGradation, setBubbleGradation] = useState('default');
  const [bubblePositions, setBubblePositions] = useState<Array<{ left: number, bottom: number, delay: number }>>([]);
  
  
  // マウント状態の管理
  useEffect(() => {
    setMounted(true);
    // 初期バブル位置の設定
    const initialBubbles = Array.from({ length: 100 }, () => ({
      left: Math.random() * 100,
      bottom: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setBubblePositions(initialBubbles);
  }, []);

  // Time update effect
  useEffect(() => {
    if (!mounted) return;

    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [mounted]);

  const createBubbles = useCallback(() => {
    const newBubbles = Array.from({ length: 100 }, () => ({
      left: Math.random() * 100,
      bottom: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setBubblePositions(newBubbles);
  }, []);

  // Bubble creation effect
  useEffect(() => {
    if (!mounted) return;
    if (currentBubbleGradation !== 'none') {
      createBubbles();
    }
  }, [mounted, currentBubbleGradation, createBubbles]);

  const getTimeInTimezone = useCallback(() => {
    if (!time) return null;
    const options = { timeZone: timezone };
    return new Date(time.toLocaleString('en-US', options));
  }, [time, timezone]);

  // クライアントサイドレンダリングのみを行う
  if (!mounted || !time) {
    return null; // 初期レンダリング時は何も表示しない
  }

  const currentTime = getTimeInTimezone();
  if (!currentTime) return null;

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  const secondDegrees = ((seconds / 60) * 360);
  const minuteDegrees = ((minutes / 60) * 360) + ((seconds / 60) * 6);
  const hourDegrees = ((hours % 12) / 12) * 360 + ((minutes / 60) * 30);

  return (
    <div className={`min-h-screen ${currentBackground} bubble-gradation-${currentBubbleGradation}`}>
      
      <div className="water-ripple"></div>
      <div className="water-distortion"></div>
      
      {/* 泡のレンダリング */}
      {currentBubbleGradation !== 'none' && bubblePositions.map((bubble, index) => (
        <div
          key={index}
          className="bubble"
          style={{
            left: `${bubble.left}%`,
            bottom: `${bubble.bottom}%`,
            animationDelay: `${bubble.delay}s`
          }}
        />
      ))}

      <div className="clock flex flex-col items-center justify-center p-8">

        <div className="digital-clock text-4xl mb-8">
          {`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}
        </div>

        <div className="clock-face relative w-64 h-64 border-4 border-gray-800 rounded-full bg-white">
          {/* Clock numbers */}
          {['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'].map((number, index) => (
            <div
              key={number}
              className="number absolute w-6 text-center"
              style={{
                transform: `rotate(${index * 30}deg) translateY(-220px)`
              }}
            >
              {number}
            </div>
          ))}

          {/* Clock hands */}
          <div
            className="hour-hand absolute left-1/2 bottom-1/2 origin-bottom"
            style={{
              transform: `translate(-50%, 0) rotate(${hourDegrees}deg)`
            }}
          >
            <div className="hand-line1" style={{ transform: 'scaleY(2.3)' }} />
            <div className="hand-icon1">
              <SharkIcon />
            </div>
          </div>
          <div
            className="minute-hand absolute left-1/2 bottom-1/2 origin-bottom"
            style={{
              transform: `translate(-50%, 0) rotate(${minuteDegrees}deg)`
            }}
          >
            <div className="hand-line1" style={{ transform: 'scaleY(4.0)' }} />
            <div className="hand-icon2">
              <TortoiseIcon />
            </div>
          </div>
          <div
            className="second-hand absolute left-1/2 bottom-1/2 origin-bottom"
            style={{
              transform: `translate(-50%, 0) rotate(${secondDegrees}deg)`
            }}
          >
            <div className="hand-line2" style={{ transform: 'scaleY(5.3)' }} />
            <div className="hand-icon3">
              <DolphinIcon />
            </div>
          </div>
        </div>

        <div className="controls">
          <div className="control-item">
            <label htmlFor="timezone-select" className="block-label1">タイムゾーン</label>
            <select
              id="timezone-select"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="block1"
            >
            <option value="Asia/Tokyo">日本 (アジア/東京)</option>
            <option value="Asia/Taipei">台湾 (アジア/台北)</option>
            <option value="America/New_York">ニューヨーク (アメリカ/ニューヨーク)</option>
            <option value="Europe/London">ロンドン (ヨーロッパ/ロンドン)</option>
            <option value="Europe/Paris">パリ (ヨーロッパ/パリ)</option>
            <option value="America/Los_Angeles">ロサンゼルス (アメリカ/ロサンゼルス)</option>
          </select>
          </div>
          
          <div className="control-item">
            <label htmlFor="background-select" className="block-label2">背景</label>
          <select
            value={currentBackground}
            onChange={(e) => setCurrentBackground(e.target.value)}
            className="block2"
          >
            <option value="bg-default">デフォルト</option>
            <option value="bg-aquarium">水族館</option>
            <option value="bg-beach">ビーチ</option>
            <option value="bg-deep-sea">深海</option>
            <option value="bg-sunset-beach">夕焼け</option>
          </select>
          </div>

          <div className="control-item">
            <label htmlFor="bubble-select" className="block-label3">泡の種類</label>
          <select
            value={currentBubbleGradation}
            onChange={(e) => setBubbleGradation(e.target.value)}
            className="block3"
          >
            <option value="default">デフォルト</option>
            <option value="none">泡無し</option>
            <option value="ocean-blue">海の青</option>
            <option value="coral-reef">珊瑚礁</option>
            <option value="deep-sea">深海</option>
            <option value="tropical">熱帯</option>
            </select>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Clock;