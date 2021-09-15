import './App.css';
import WeatherContainer from './Components/WeatherContainer';
import settings from './Settings/config';


function App() {

  // 
  return (
    <div className="App">
      <WeatherContainer host={settings.apiHost}></WeatherContainer>
    </div>
  );
}


export default App;
