import { useRef, useEffect } from 'react'
import { dias, icons, translate } from "../shared/libs";

export default function Weather(props: any) {

    useEffect(() => {
        const element: any = document.querySelector('.container')
        element.style.backgroundImage = `url(${props.backgroundImg})`

    }, [])
    const titleRef: any = useRef();
    const scrollStories = (x: any, y: any) => titleRef.current!.scrollBy(x, y)
    const getIconTime = (condition: any, text:string, time:number) => {
        const back = condition.forecast.forecastday[0].astro
        const sunrise = back.sunrise.split(':')[0] * 1
        const sunset = (back.sunset.split(':')[0] * 1) + 12

        if ( time < sunrise || time > (sunset + 1)) {
            if(text == "Clear") return `${text} night`
            if(text == "Partly cloudy") return `${text} night`
            if(text == "Sunny") return `${text} night`
        }
        return text

    }
    const current = !props.weather ? null : (
        <div className='current-weather'>
            <div className='current-title' >
                <span>
                    {props.weather.location.country}, {props.weather.location.region}, {props.weather.location.name}
                </span>
            </div>

            <div className='current-time'>
                <span>
                    <p>Hora actual</p>
                    <p>{props.weather.location.localtime.split(' ')[1]}</p>
                </span>
            </div>

            <div className='main-data'>
                <div className="main-data-icon">
                    <i className={`bi bi-${icons[getIconTime(props.weather, props.weather.current.condition.text, props.weather.current.last_updated.split(' ')[1].split(':')[0] * 1)]}`}></i>
                </div>
                <div className="main-data-temp">
                    <p>{props.weather.current.temp_c}</p>
                    <p>C°</p>
                </div>
                <div className="main-data-feel">
                    <p>{translate[props.weather.current.condition.text]}</p>
                    <p>Sensacion termica</p>
                    <p>{props.weather.current.feelslike_c}°</p>
                </div>
            </div>

            <div className='detail-data'>
                <div className="detail-description" >
                    <p>Ventos</p>
                    <p>{props.weather.current.wind_kph}Km/h</p>
                </div>
                <div className="detail-description">
                    <p>Humedad</p>
                    <p>{props.weather.current.humidity}</p>
                </div>
                <div className="detail-description">
                    <p>Visibilidad</p>
                    <p>{props.weather.current.vis_km} Km</p>
                </div>
                <div className="detail-description">
                    <p>Presión</p>
                    <p>{props.weather.current.pressure_mb} Mbar</p>
                </div>
            </div>
        </div>
    )
    const displayHours = !props.hours ? null : props.hours.map((day: any, index: number) => {
        let condition = day.condition.text
        let iconCondition = getIconTime(props.weather, condition, day.time.split(' ')[1].split(':')[0] * 1)
        let getIcon = icons[iconCondition]
        return (
            <div className="hours-item" key={index} >
                <div className="hours-day">
                    {day.time.split(' ')[1]}
                </div>
                <div className="hours-icon">
                    <i className={`bi bi-${getIcon}`}></i>
                </div>
                <div className="hours-temperatura">
                    <div className="hours-description">
                        <p>Temp</p>
                        <p>{day.temp_c}°</p>
                    </div>
                    <div className="hours-description">
                        <p>Feels Like</p>
                        <p>{day.feelslike_c}°</p>
                    </div>
                </div>
                <div className="hours-precipitacion" >
                    <i className="bi bi-umbrella"></i>
                    <p>{day.chance_of_rain}%</p>
                </div>
            </div>
        )
    })
    const container = !props.weather ? null : props.weather.forecast.forecastday.map((day: any, index: number) => {
        let condition = day.day.condition.text
        let date = new Date(day.date)
        let dia = date.getUTCDay()
        let getIcon = icons[condition]
        return (
            <div className="item" key={index} >
                <div className="day">
                    {index == 0 ? "Hoy" : dias[dia]}
                </div>
                <div className="icon">
                    <i className={`bi bi-${getIcon}`}></i>
                </div>
                <div className="temperatura">
                    <div className="description">
                        <p>Max</p>
                        <p>{day.day.maxtemp_c}°</p>
                    </div>
                    <div className="description">
                        <p>Min</p>
                        <p>{day.day.mintemp_c}°</p>
                    </div>
                </div>
                <div className="precipitacion" >
                    <i className="bi bi-umbrella"></i>
                    <p>{day.day.daily_chance_of_rain}%</p>
                </div>
            </div>
        )
    })
    return (
        <div className='container'>
            <div className="cursor" onClick={() => props.clean()}>
                <span className="bi bi-arrow-left-short arrow-back arrow-back-left"></span>
            </div>
            <div className="cursor" onClick={() => props.calculateWeather(props.weather.location.lat, props.weather.location.lon)}>
                <span className="bi bi-arrow-clockwise reload-weather "></span>
            </div>
            {current}
            <div className="hours">
                <div className="hours-container" ref={titleRef}>
                    {displayHours}
                    <div className="cursor " onClick={() => scrollStories(-300, 0)}>
                        <span className="bi bi-caret-left-fill arrow-component-story arrow-component-story-left"></span>
                    </div>
                    <div className="cursor" onClick={() => scrollStories(300, 0)}>
                        <span className="bi bi-caret-right-fill arrow-component-story arrow-component-story-right"></span>
                    </div>
                </div>
            </div>
            <div id="pronostico">
                {container}
            </div>
        </div>
    )
}