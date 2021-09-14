import logo from './logo.svg';
import './App.css';
import WeatherContainer from './Components/WeatherContainer';
import settings from './Settings/config';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function App() {

  // 
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
      <WeatherContainer host={settings.apiHost}></WeatherContainer>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs lg="">
            1 of 3
          </Col>
          <Col md="auto">Variable width content</Col>
          <Col xs lg="2">
            3 of 3
          </Col>
        </Row>
      </Container>
    </div>
  );
}


export default App;
