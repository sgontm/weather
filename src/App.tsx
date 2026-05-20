import { useState } from 'react';
import './App.css';
import NavigationBar from './components/NavigationBar';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import RadarScreen from './screens/RadarScreen';

function App() {
  // 現在どの画面を表示するか決めるState（初期値はトップ画面 'home'）
  const [currentScreen, setCurrentScreen] = useState('home');

  return (
    <div className="app-container">
      {/* 画面の上半分：現在選ばれている画面を表示 */}
      <div className="main-content">
        {currentScreen === 'home' && <HomeScreen />}
        {currentScreen === 'search' && <SearchScreen />}
        {currentScreen === 'radar' && <RadarScreen />}
      </div>

      {/* 画面の下半分：ナビゲーションバー */}
      <NavigationBar currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
    </div>
  );
}

export default App;