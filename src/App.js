import React from 'react';
import './App.css';
import '../node_modules/weather-icons/css/weather-icons.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Weather from './components/weather.component'
import Form from './components/form.component'

const apiKey = 'c2b903cdf326a8c09a4bd6f8b4dd4a8a';

//api.openweathermap.org/data/2.5/weather?q=London,uk

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      city: undefined,
      country: undefined,
      icon: undefined,
      name: undefined,
      main: undefined,
      celsius: undefined,
      temp_max: undefined,
      temp_min: undefined,
      description: "",
      error: false
    }

    this.weatherIcon = {
      Thunderstorm: "wi-thunderstorm",
      Drizzle: "wi-sleet",
      Rain: 'wi-storm-showers',
      Snow: 'wi-snow',
      Atmosphere: 'wi-fog',
      Clear: 'wi-day-sunny',
      Clouds: 'wi-day-fog'
    }
  }

  convertCelsius(temp) {
    let cel = Math.floor(temp - 273.15)

    return cel;
  }

  getWeatherIcon(icons, rangeId) {
    switch (true) {
      case rangeId >= 200 && rangeId <= 232:
        this.setState({ icon: this.weatherIcon.Thunderstorm })
        break;
      case rangeId >= 300 && rangeId <= 321:
        this.setState({ icon: this.weatherIcon.Drizzle })
        break;
      case rangeId >= 500 && rangeId <= 531:
        this.setState({ icon: this.weatherIcon.Rain })
        break;
      case rangeId >= 600 && rangeId <= 622:
        this.setState({ icon: this.weatherIcon.Snow })
        break;
      case rangeId >= 701 && rangeId <= 781:
        this.setState({ icon: this.weatherIcon.Atmosphere })
        break;
      case rangeId === 800:
        this.setState({ icon: this.weatherIcon.Clear })
        break;
      case rangeId >= 801 && rangeId <= 804:
        this.setState({ icon: this.weatherIcon.Clouds })
        break;
      default:
        this.setState({ icon: this.weatherIcon.Clouds })

    }
  }

  getWeather = async (e) => {

    e.preventDefault();

    const city = e.target.elements.city.value;
    const country = e.target.elements.country.value;

    if (city && country) {
      const apiCall = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}`)

      const response = await apiCall.json();

      this.setState({
        city: `${response.name}, ${response.sys.country}`,
        celsius: this.convertCelsius(response.main.temp),
        temp_max: this.convertCelsius(response.main.temp_max),
        temp_min: this.convertCelsius(response.main.temp_min),
        description: response.weather[0].description,
      });

      this.getWeatherIcon(this.weatherIcon, response.weather[0].id)
    }else{
      this.setState({error: true})
    }

  }
  render() {
    return (
      <div className="App">
        <Form loadWeather={this.getWeather} error={this.state.error}/>
        <Weather
          city={this.state.city}
          country={this.state.country}
          temp_celsius={this.state.celsius}
          temp_max={this.state.temp_max}
          temp_min={this.state.temp_min}
          description={this.state.description}
          weatherIcon={this.state.icon}
        />
      </div>
    );
  }
}

export default App;
