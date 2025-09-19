import React, { useState, useEffect } from 'react'
import axios from 'axios'
import sunnyBg from "@/assets/sunny.jpeg"
import defaultBg from "@/assets/default.jpg"
import nightBg from "@/assets/night-bg.jpg"
import cloudBg from "@/assets/cloud-bg.jpeg"
import rainBg from "@/assets/rain-bg.jpeg"
import mistBg from "@/assets/mist-bg.jpeg"

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;


const Weather = () => {

    const [weather, setWeather] = useState(null)
    const [city, setCity] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchWeather = async () => {
        setLoading(true)
        setError(null)
        if (!city) {
            setError("Please enter city name")
            setLoading(false)
            return;
        }
        try {
            const res = await axios.get(
                `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`
            );
            setWeather(res.data)
        } catch (error) {
            setError("City not found");
        }
        setLoading(false);
    }

    const getWeatherStyle = (condition, isDay) => {
        if (condition.includes("sunny") && isDay) return sunnyBg;
        if (condition.includes("clear") && !isDay) return nightBg;
        if (condition.includes("mist") || condition.includes("fog") || condition.includes("haze")) return mistBg; if (condition.includes("cloud")) return cloudBg;
        if (condition.includes("rain")) return rainBg;

        return sunnyBg;
    }

    //   useEffect(()=>{
    //      axios.get(`http://api.weatherapi.com/v1/current.json?key=ee2c2aa26191401fa4475539251709&q=${city}`)
    //      .then(res => {
    //         console.log(res)
    //         setWeather(res.data)
    //      })
    //   },[city])


    // Determine background image
    const backgroundImage = weather
        ? `url(${getWeatherStyle(
            weather.current.condition.text.toLowerCase(),
            weather.current.is_day
        )})`
        : `url(${defaultBg})`;

    return (
        <div className='p-0'>
            <div
                className="w-full h-screen bg-cover bg-center p-10 flex items-center justify-center"
                style={{
                    backgroundImage: backgroundImage
                }}
            >
                <div className='flex flex-col items-center justify-center p-4 text-slate-50 lg:w-1/2 shadow-2xl shadow-amber-50
                lg:h-full bg-white-700 rounded-md bg-clip-padding backdrop-opacity-100 backdrop-blur-sm bg-opacity-70 border border-gray-100'>
                    <input type='text'
                        placeholder='Enter a city'
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className='bg-slate-50 rounded-4xl text-slate-500 px-2 border-2 border-amber-200' />
                    <button
                        onClick={fetchWeather}
                        className=' text-slate-50 bg-amber-400 m-4 rounded-2xl px-3 py-1 transition-transform duration-300 ease-out hover:scale-110 border-4 border-slate-300'>Search</button>

                    {loading && <p>Loading...</p>}
                    {error && <p className='text-red-600'>{error}</p>}
                    {weather && !loading && !error && (
                        <div>
                            <h2 className='font-bold'>{weather.location.name} : {weather.location.country} : {weather.location.region}</h2>
                            <div className='text-xs md:text-lg lg:font-extrabold'>
                                <div className='flex justify-start items-center'>
                                    <h2 className='lg:text-xl'>{weather.current.condition.text}</h2>
                                    <img src={weather.current.condition.icon} alt='weather icon' />
                                </div>
                                <h4>Temperature(in celcius) : {weather.current.temp_c}</h4>
                                <h4>Temperature(in farenheit) : {weather.current.temp_f}</h4>
                                <h4>Humidity : {weather.current.humidity}</h4>
                                <h4>Cloud : {weather.current.cloud}</h4>
                                <h4>Last Updated Date & Time : {weather.current.last_updated}</h4>

                            </div>
                        </div>
                    )}
                </div>


            </div>
        </div>
    )
}

export default Weather
