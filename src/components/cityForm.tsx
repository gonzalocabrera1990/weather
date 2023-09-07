import { Country, State, City } from "country-state-city";
import { useState } from "react";
import Select from "react-select";
import { background } from '../shared/libs'

import Weather from './weather'
import { Loading } from "./loading";

type countryOption = {
  value: {
    latitude: string;
    longitude: string;
    isoCode: string;
  };
  label: string;
} | null;

type stateOption = {
  value: {
    name: string,
    stateCode: string,
    countryCode: string,
    latitude: string,
    longitude: string
  };
  label: string;
} | null;

type cityOption = {
  value: {
    latitude: string;
    longitude: string;
    countryCode: string;
    name: string;
    stateCode: string;
  };
  label: string;
} | null;

const optionsCountry = Country.getAllCountries().map((country) => ({
  value: {
    latitude: country.latitude,
    longitude: country.longitude,
    isoCode: country.isoCode,
  },
  label: country.name,
}));

function CityPicker() {
  const [selectedCountry, setSelectedCountry] = useState<countryOption>(null);
  const [selectedState, setSelectedState] = useState<stateOption>(null);
  const [selectedCity, setSelectedCity] = useState<cityOption>(null);
  const [weather, setWeather] = useState<any>(null)
  const [backgroundImg, setBackgroundImg] = useState<any>(null)
  const [hours, setHours] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState(null)

  const handleSelectedCountry = (option: any) => {
    setSelectedCountry(option);
    setSelectedState(null)
    setSelectedCity(null);
  };
  const handleSelectedState = (option: any) => {
    setSelectedState(option);
    setSelectedCity(null);
  };
  const handleSelectedCity = (option: any) => {
    setSelectedCity(option);
  };
  const calculateWeather = (lat: string, long: string) => {
    setLoading(true);
    (
      function () {
        fetch(`https://api.weatherapi.com/v1/forecast.json?key=9a179446b6644d8ea15170701230604&q=${lat},${long}&days=5&aqi=no&alerts=no`)
          .then(data => data.json())
          .then((info: any) => {
            setWeather(info)
            let hour = info.current.last_updated.split(' ')[1].split(':')[0] * 1
            let getArrayResult = info.forecast.forecastday[0].hour.slice(hour)
            let otherday = info.forecast.forecastday[1].hour.slice(0, (hour))
            let concatHours = getArrayResult.concat(otherday)
            setHours(concatHours)
            const back = info.forecast.forecastday[0].astro
            const sunrise = back.sunrise.split(':')[0] * 1
            const sunset = (back.sunset.split(':')[0] * 1) + 12
            const time = info.current.last_updated.split(' ')[1].split(':')[0] * 1

            if (time > (sunrise + 1) && time < sunset) {
              setBackgroundImg(`${background['dia'][info.current.condition.text]}`)
            } else if (time < sunrise || time > (sunset + 1)) {
              setBackgroundImg(`${background['noche'][info.current.condition.text]}`)
            } else if (time == sunset || time == (sunset + 1)) {
              setBackgroundImg(`${background['atardecer'][info.current.condition.text]}`)
            } else if (time == sunrise  || time == (sunrise + 1)) {
              setBackgroundImg(`${background['amanecer'][info.current.condition.text]}`)
            }
          })
          .catch(error => {
            setError(error)
          })
          .finally(() => {
            setLoading(false)
          })
      }
    )()
  }
  const clean = () => {
    setWeather(null)
    setHours(null)
  }
  if (loading) {
    return <Loading />
  }
  if (error) {
    return <h1>{error}</h1>
  }
  if (weather) {
    return (
      <Weather weather={weather} hours={hours} clean={clean} calculateWeather={calculateWeather} backgroundImg={backgroundImg} />
    )
  } else {
    return (
      <div className="selected-form">
        <span className="selected-title" >Elegi el lugar o la zona que quieres saber el pronostico del tiempo.</span>
        <div className="selected-item selected-country">
          <div className="">
            <label htmlFor="country">Country</label>
          </div>
          <Select
            className="text-black"
            value={selectedCountry}
            onChange={handleSelectedCountry}
            options={optionsCountry}
          />
        </div>
        {
          selectedCountry && (
            <div className="item-info" >
              <span>{selectedCountry?.label} </span>
              <button onClick={() => calculateWeather(selectedCountry.value.latitude, selectedCountry.value.longitude)}>Weather</button>
            </div>
          )
        }
        {
          selectedCountry && (
            <div className="selected-item selected-state">
              <div className="">
                <label htmlFor="country">State</label>
              </div>
              <Select
                className="text-black"
                value={selectedState}
                onChange={handleSelectedState}
                options={State.getStatesOfCountry(
                  selectedCountry.value.isoCode
                )?.map((state) => ({
                  value: {
                    latitude: state.latitude!,
                    longitude: state.longitude!,
                    countryCode: state.countryCode,
                    name: state.name,
                    stateCode: state.isoCode,
                  },
                  label: state.name,
                }))}
              />
            </div>
          )}
        {
          selectedState && (
            <div className="item-info" >
              <span>{selectedCountry?.label}, {selectedState?.label}</span>
              <button onClick={() => calculateWeather(selectedState.value.latitude, selectedState.value.longitude)}>Weather</button>
            </div>
          )
        }
        {selectedState && (
          <div className="selected-item selected-city">
            <div className="">
              <label htmlFor="country">City</label>
            </div>
            <Select
              className="text-black"
              value={selectedCity}
              onChange={handleSelectedCity}
              options={City.getCitiesOfState(selectedCountry?.value.isoCode!, selectedState!.value.stateCode)?.map((city) => ({
                value: {
                  latitude: city.latitude!,
                  longitude: city.longitude!,
                  countryCode: city.countryCode,
                  name: city.name,
                  stateCode: city.stateCode
                },
                label: city.name,
              }))}
            />
          </div>
        )}
          {
            selectedCity && (
              <div className="item-info">
                <span>{selectedCountry?.label}, {selectedState?.label}, {selectedCity?.label}</span>
                <button onClick={() => calculateWeather(selectedCity.value.latitude, selectedCity.value.longitude)}>Weather</button>
              </div>
            )
          }
      </div>
    );
  }
}

export default CityPicker;
