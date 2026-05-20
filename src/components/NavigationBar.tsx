import './NavigationBar.css';

function NavigationBar({ currentScreen, setCurrentScreen }) {
  return (
    <nav className="nav-bar">
      {/* 検索ボタン（左） */}
      <button 
        className={`nav-item ${currentScreen === 'search' ? 'active' : ''}`}
        onClick={() => setCurrentScreen('search')}
      >
        <div className="icon-circle">
          <img src="/images/search-icon.png" alt="検索" className="nav-icon" />
        </div>
      </button>

      {/* ホームボタン（真ん中） */}
      <button 
        className={`nav-item ${currentScreen === 'home' ? 'active' : ''}`}
        onClick={() => setCurrentScreen('home')}
      >
        <div className="icon-circle">
          <img src="/images/home-icon.png" alt="ホーム" className="nav-icon" />
        </div>
      </button>

      {/* 雨雲レーダーボタン（右） */}
      <button 
        className={`nav-item ${currentScreen === 'radar' ? 'active' : ''}`}
        onClick={() => setCurrentScreen('radar')}
      >
        <div className="icon-circle">
          <img src="/images/radar-icon.png" alt="雨雲" className="nav-icon" />
        </div>
      </button>
    </nav>
  );
}

export default NavigationBar;