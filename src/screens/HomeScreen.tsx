import './HomeScreen.css';

function HomeScreen() {
  // 3時間ごとの予報データ（仮データ）の配列
  // あとでAPIからデータを取ってきたら、ここが自動で書き換わるようにします！
  const hourlyData = [
    { time: '00 AM', temp: '00°', img: '/images/cloudy.png' },
    { time: '03 AM', temp: '00°', img: '/images/cloudy.png' },
    { time: '06 AM', temp: '00°', img: '/images/cloudy.png' },
  ];

  return (
    <div className="home-container">
      {/* 1. 上部の現在地エリア */}
      <div className="current-weather-section">
        
        <h1 className="location-title">場所</h1>
        <p className="current-temp">00°</p>
      </div>

      {/* 2. 下部のグレーの大きなカプセル（予報エリア） */}
      <div className="forecast-panel">
        <div className="hourly-list">
          {/* 配列データをmapを使ってループ処理し、3つのカードを並べます */}
          {hourlyData.map((item, index) => (
            <div key={index} className="hourly-card">
              <span className="hourly-time">{item.time}</span>
              <span className="hourly-temp">{item.temp}</span>
              <div className="hourly-icon-wrapper">
                {/* 自分で用意した天気の画像が表示される部分 */}
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