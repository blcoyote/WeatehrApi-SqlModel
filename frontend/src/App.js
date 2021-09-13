import logo from './logo.svg';
import './App.css';
import GetWeather from './Functions/WeatherRequests.js'

function App() {
  var url = "https://weather.elcoyote.dk/weatherstation/getweather?day_delta=1&result_interval=12"
    
  GetWeather(url, succes, error);



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );

}
function succes (jsonResponse) {console.log(jsonResponse)}

function error (errorResponse) {console.log(errorResponse)}

export default App;
