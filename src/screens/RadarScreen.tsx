import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import './RadarScreen.css';

// RainViewer APIから返ってくるデータの型を定義
interface RadarFrame {
  path: string;
  time: number;
}

interface RainViewerResponse {
  radar: {
    past: RadarFrame[];
    nowcast: RadarFrame[]; // ← スペルを正しく修正
  };
}

function RadarScreen() {
  const [timestamps, setTimestamps] = useState<RadarFrame[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // 1. RainViewer API からデータを取得
  useEffect(() => {
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then((res) => res.json())
      .then((data: RainViewerResponse) => {
        // past と nowcast を合体させる（スペルを修正）
        const allData = [...data.radar.past, ...data.radar.nowcast];
        setTimestamps(allData);
        
        if (data.radar.past.length > 0) {
          setCurrentIndex(data.radar.past.length - 1);
        }
      })
      .catch((err) => console.error('データ取得エラー:', err));
  }, []);

  // 2. 自動再生のタイマー処理
  useEffect(() => {
    // NodeJS.Timeout の代わりに number | null を使うことで型エラーを回避
    let timer: number | null = null;
    
    if (isPlaying && timestamps.length > 0) {
      // window.setInterval と明示することでブラウザのタイマーID（number）を返させます
      timer = window.setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex >= timestamps.length - 1) {
            return 0;
          }
          return prevIndex + 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, timestamps]);

  // タイムスタンプを「14:30」表記に変換する関数
  const formatTime = (ts: number | undefined): string => {
    if (!ts) return '00:00';
    const date = new Date(ts * 1000);
    return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  };

  // 現在表示する雨雲画像のURL
  const currentTileUrl = timestamps.length > 0 && timestamps[currentIndex]
    ? `https://tilecache.rainviewer.com${timestamps[currentIndex].path}/256/{z}/{x}/{y}/2/1_1.png`
    : null;

  return (
    <div className="radar-container">
      {/* 地図エリア */}
      <MapContainer 
        center={[34.75, 135.53]} 
        zoom={9} 
        zoomControl={false} 
        className="map-view"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        />
        {currentTileUrl && (
          <TileLayer 
            key={currentTileUrl} 
            url={currentTileUrl} 
            opacity={0.6} 
          />
        )}
      </MapContainer>

      {/* 下部の操作パネル */}
      <div className="radar-control-panel">
        <div className="status-text">
          {isPlaying ? '⚡ 雨雲の動きを再生中' : 'しばらく雨は降りません'}
        </div>

        <div className="location-text">
          大阪府吹田市周辺の天気 &gt;
        </div>

        <div className="timeline-wrapper">
          <button 
            className="play-button" 
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? '⏸' : '▶︎'}
          </button>

          <div className="slider-container">
            <div className="current-time-display">
              {timestamps.length > 0 ? formatTime(timestamps[currentIndex]?.time) : '--:--'}
            </div>
            
            <input
              type="range"
              min="0"
              max={timestamps.length > 0 ? timestamps.length - 1 : 0}
              value={currentIndex}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setIsPlaying(false);
                setCurrentIndex(Number(e.target.value));
              }}
              className="time-slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RadarScreen;