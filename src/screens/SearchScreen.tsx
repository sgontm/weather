import './SearchScreen.css';

function SearchScreen() {
  // 検索結果、またはお気に入り地域の仮データ
  // あとで検索ロジックやAPIと連動させます！
  const searchResults = [
    { id: 1, temp: '00°', location: 'osaka,Japan', img: '/images/sunny.png', alt: '晴れ' },
    { id: 2, temp: '00°', location: 'tokyo,Japan', img: '/images/cloudy.png', alt: '曇り' },
  ];

  return (
    <div className="search-container">
      {/* 1. 上部の検索バー */}
      <div className="search-bar-wrapper">
        <input 
          type="text" 
          placeholder="検索" 
          className="search-input" 
        />
      </div>

      {/* 2. 天気カードのリストエリア */}
      <div className="card-list">
        {searchResults.map((card) => (
          <div key={card.id} className="weather-card">
            {/* 左側のテキストエリア */}
            <div className="card-info">
              <span className="card-temp">{card.temp}</span>
              <span className="card-location">{card.location}</span>
            </div>
            
            {/* 右側の大きなお天気画像（カードからはみ出す演出用） */}
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