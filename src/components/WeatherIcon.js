import React from 'react';
import { WiDaySunny, WiRain, WiSnow, WiCloudy, WiDayCloudy, WiThunderstorm, WiFog } from 'react-icons/wi';

const WeatherIcon = ({ code, alt }) => {
  const iconMap = {
    '01d': WiDaySunny,
    '01n': WiDaySunny,
    '02d': WiDayCloudy,
    '02n': WiDayCloudy,
    '03d': WiCloudy,
    '03n': WiCloudy,
    '04d': WiCloudy,
    '04n': WiCloudy,
    '09d': WiRain,
    '09n': WiRain,
    '10d': WiRain,
    '10n': WiRain,
    '11d': WiThunderstorm,
    '11n': WiThunderstorm,
    '13d': WiSnow,
    '13n': WiSnow,
    '50d': WiFog,
    '50n': WiFog
  };

  const IconComponent = iconMap[code] || WiDaySunny;

  return <IconComponent aria-label={alt} title={alt} size="3em" />;
};

export default WeatherIcon;