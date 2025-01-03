import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';

const API_KEY = 'aa4a2c7dd7d3ed07bb4d5d023c6401b1'; // Replace with your API key

// Define a simple interface for the weather data
interface WeatherData {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
}

const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
    } catch (err) {
      setError('City not found or network error. Error code: ' + err);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather App</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter city name"
        value={city}
        onChangeText={setCity}
      />
      <Button title="Get Weather" onPress={fetchWeather} />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {weather && (
        <View style={styles.weatherContainer}>
          <Text style={styles.city}>
            {weather.name}, {weather.sys.country}
          </Text>
          <Text style={styles.temperature}>{weather.main.temp}°C</Text>
          <Text style={styles.condition}>{weather.weather[0].description}</Text>
          <Text>Humidity: {weather.main.humidity}%</Text>
          <Text>Wind Speed: {weather.wind.speed} m/s</Text>
          <Image
            style={styles.icon}
            source={{
              uri: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  weatherContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  city: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  temperature: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  condition: {
    fontSize: 18,
    fontStyle: 'italic',
  },
  icon: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default App;