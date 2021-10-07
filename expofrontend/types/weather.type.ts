export default interface WeatherData {
    id?: any | null,
    indoortemp: number,
    temp: number,
    dewptf: number,
    windchillf: number,
    indoorhumidity: number,
    humidity: number,
    windspeedmph: number,
    windgustmph: number,
    winddir: number,
    absbaromin: number,
    baromin: number,
    rainin: number,
    dailyrainin: number,
    weeklyrainin: number,
    monthlyrainin: number,
    solarradiation: number,
    UV: number,
    dateutc: string,
    realtime: number,
    rtfreq: number
  }

  //new Date('2021-04-11T10:20:30Z')