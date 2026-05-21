import { useState, useEffect } from 'react';
import axios from 'axios';
import './HomeScreen.css';

// APIから返ってくる天気データの型定義
interface HourlyForecast {
  time: string;
  temp: string;
  img: string;
}

interface WeatherData {
  location: string;
  currentTemp: string;
  hourly: HourlyForecast[];
}

function HomeScreen() {
  // 天気データを管理するState
  const [weather, setWeather] = useState<WeatherData | null>(null);
  // ローディング（読み込み中）状態を管理するState
  const [loading, setLoading] = useState<boolean>(true);
  // エラーメッセージを管理するState
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // 1. ブラウザのGPS機能（位置情報）が使えるかチェック
    if (!navigator.geolocation) {
      setErrorMsg('お使いのブラウザは位置情報に対応していません。');
      setLoading(false);
      return;
    }

    // 2. 現在の位置情報（緯度・経度）を取得
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // 3. 緯度・経度から「逆ジオコーディング」で市区町村コード（JMAコード）を取得、
          // または位置情報に一番近い地域の天気予報データを取得します。
          // 今回は位置情報から天気予報を取得できる無料の仕組みを利用します。
          
          // 【解説】オープンな気象データAPI（Open-Meteo）等を利用して現在地のリアルな天気を取得します
          const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,weathercode&timezone=Asia%2FTokyo`;
          const response = await axios.get(weatherUrl);

          // 逆ジオコーディング（緯度経度から地名に変換）で場所名を取得（簡易版として「現在地」またはリバースAPIを使用）
          // ここでは大阪・吹田市周辺ならそのエリアの名前が入るように簡易設定、またはリバースジオコーディングAPIを叩きます
          const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ja`;
          const geoResponse = await axios.get(geoUrl);
          
          // 市区町村名（city や town や suburb）を抽出
          const address = geoResponse.data.address;
          const locationName = address.city || address.town || address.suburb || '現在地';

          // 現在の気温
          const currentTemp = `${Math.round(response.data.current_weather.temperature)}°`;

          // 3時間ごとの予報データを配列から抽出（現在時刻以降の3つのデータを仮生成）
          const rawHourly = response.data.hourly;
          const parsedHourly: HourlyForecast[] = [];
          
          // 現在の時間に近いインデックスから3つ分（3時間、6時間、9時間後など）を取得
          for (let i = 0; i < 3; i++) {
            const index = (i + 1) * 2; // 2時間おき
            const timeStr = new Date(rawHourly.time[index]).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
            const tempStr = `${Math.round(rawHourly.temperature_2m[index])}°`;
            const weatherCode = rawHourly.weathercode[index];

            // 気象コードからイラストのパスを決定
            let imgPath = '/images/cloudy.png'; // デフォルトは曇り
            if (weatherCode === 0) imgPath = '/images/sunny.png'; // 快晴
            if ([1, 2, 3].includes(weatherCode)) imgPath = '/images/cloudy.png'; // 晴れ・曇り
            if ([61, 63, 65, 80, 81, 82].includes(weatherCode)) imgPath = '/images/rainy.png'; // 雨

            parsedHourly.push({
              time: timeStr,
              temp: tempStr,
              img: imgPath
            });
          }

          // Stateに保存
          setWeather({
            location: locationName,
            currentTemp: currentTemp,
            hourly: parsedHourly
          });
          setLoading(false);

        } catch (err) {
          console.error(err);
          setErrorMsg('天気データの取得に失敗しました。');
          setLoading(false);
        }
      },
      (error) => {
        console.error(error);
        setErrorMsg('位置情報の取得が拒否されたか、取得できませんでした。');
        setLoading(false);
      }
    );
  }, []);

  // 画面の表示分岐
  if (loading) {
    return <div className="screen msg-screen">📍 位置情報を取得中...</div>;
  }

  if (errorMsg) {
    return <div className="screen msg-screen">❌ {errorMsg}</div>;
  }

  if (!weather) return null;

  return (
    <div className="home-container">
      {/* 1. 上部の現在地エリア */}
      <div className="current-weather-section">
        <h1 className="location-title">{weather.location}</h1>
        <p className="current-temp">{weather.currentTemp}</p>
      </div>

      {/* 2. 下部のグレーの大きなカプセル（予報エリア） */}
      <div className="forecast-panel">
        <div className="hourly-list">
          {weather.hourly.map((item, index) => (
            <div key={index} className="hourly-card">
              <span className="hourly-time">{item.time}</span>
              <span className="hourly-temp">{item.temp}</span>
              <div className="hourly-icon-wrapper">
                <img src={item.img} alt="天気" className="hourly-weather-icon" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;