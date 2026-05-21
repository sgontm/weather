import React, { useState } from 'react';
import axios from 'axios';
import './SearchScreen.css';

// カード1枚ずつの天気データの型定義
interface CityWeatherData {
  id: number;
  location: string;
  temp: string;
  img: string;
  alt: string;
}

// 緯度経度を検索するGeo APIのレスポンス型
interface GeoResult {
  name: string;
  lat: number;
  lon: number;
  country?: string;
}

function SearchScreen() {
  // 入力された検索キーワードを管理
  const [keyword, setKeyword] = useState<string>('');
  // 画面に表示するお天気カードのリストを管理（初期値は空）
  const [cards, setCards] = useState<CityWeatherData[]>([]);
  // 検索中などのステータス
  const [statusMsg, setStatusMsg] = useState<string>('都市名を入力して検索してください（例: 大阪、東京）');

  // 検索処理（Enterが押されたとき）
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setStatusMsg('検索中...');

    try {
      // 1. 地名から緯度・経度を検索するAPI（OpenStreetMapのNominatimを利用）
      const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(keyword)}&format=json&limit=1`;
      const geoResponse = await axios.get<GeoResult[]>(geoUrl);

      if (geoResponse.data.length === 0) {
        setStatusMsg('指定された都市が見つかりませんでした。');
        return;
      }

      const { lat, lon, name } = geoResponse.data[0];

      // 2. 取得した緯度・経度を使って、その場所の現在の天気を取得
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=Asia%2FTokyo`;
      const weatherResponse = await axios.get(weatherUrl);

      const current = weatherResponse.data.current_weather;
      const tempStr = `${Math.round(current.temperature)}°`;
      const weatherCode = current.weathercode;

      // 気象コードからイラストのパスを決定
      let imgPath = '/images/cloudy.png';
      let altText = '曇り';
      if (weatherCode === 0) {
        imgPath = '/images/sunny.png';
        altText = '晴れ';
      } else if ([1, 2, 3].includes(weatherCode)) {
        imgPath = '/images/cloudy.png';
        altText = '曇り';
      } else if ([61, 63, 65, 80, 81, 82].includes(weatherCode)) {
        imgPath = '/images/rainy.png';
        altText = '雨';
      }

      // 3. 新しいカードデータを作成
      const newCard: CityWeatherData = {
        id: Date.now(), // 独自のIDを付与
        location: `${name.toLowerCase()},日本`,
        temp: tempStr,
        img: imgPath,
        alt: altText,
      };

      // 既存のカードリストの先頭に追加していく
      setCards((prevCards) => [newCard, ...prevCards]);
      setKeyword(''); // 入力欄をクリア
      setStatusMsg('');

    } catch (error) {
      console.error(error);
      setStatusMsg('データの取得中にエラーが発生しました。');
    }
  };

  return (
    <div className="search-container">
      {/* 1. 上部の検索バー（formタグで囲むことでEnterキーで送信可能に） */}
      <form onSubmit={handleSearch} className="search-bar-wrapper">
        <input 
          type="text" 
          placeholder="検索（都市名を入力してEnter）" 
          className="search-input" 
          value={keyword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
        />
      </form>

      {/* ステータス・メッセージの表示エリア */}
      {statusMsg && <div className="search-status-message">{statusMsg}</div>}

      {/* 2. 天気カードのリストエリア */}
      <div className="card-list">
        {cards.map((card) => (
          <div key={card.id} className="weather-card">
            {/* 左側のテキストエリア */}
            <div className="card-info">
              <span className="card-temp">{card.temp}</span>
              <span className="card-location">{card.location}</span>
            </div>
            {/* 右側の大きなお天気画像 */}
            <div className="card-image-wrapper">
              <img src={card.img} alt={card.alt} className="card-weather-image" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchScreen;