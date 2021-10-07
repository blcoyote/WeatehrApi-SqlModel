import http from "../services/https-common";
import ITutorialData from "../types/weather.type"

class WeatherDataService {

  get(delta: number, interval: number, imperial: boolean) {
    return http.get(`/weatherstation/getweather?day_delta=${delta}&result_interval${interval}&imperial=${imperial}`);
  }
}

export default new WeatherDataService();