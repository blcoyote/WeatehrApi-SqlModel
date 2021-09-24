import './App.css';
import WeatherContainer from './Components/WeatherContainer';
import settings from './Settings/config';
import React, { Component } from 'react';

class App extends Component {

  componentDidMount() {
    document.title = "Vejret i Galten"
  }

  render() {
    return (
      <div className="App">
        <WeatherContainer host={settings.apiHost}></WeatherContainer>
      </div>
    );
  }
}

export default App;
