import React from 'react';
import numeral from 'numeral';
import { Circle, Popup } from "react-leaflet";

const casesTypeColors = { 
    cases: {
      hex: "#CC1034",
      multiplier: 800
    },
    recovered: {
      hex: "#7dd71d",
      multiplier: 1200
    },
    deaths: {
      hex: "#fb4443",
      multiplier: 2000
    },
};

export const prettyPrintStat = (stat) => stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const sortData = (data) => {
    const sortedData = [...data];
    // Ele vai pegar o primeiro e o segundo item do sortedData e vai comparar o b com o a 
    // se o b retornar menor do que 0 ele vai ser colocado para um índice anterior ao a
    // se ele retornar maior do que 0 ele vai ser colocado depois do índice a ou que está no topo
    return sortedData.sort((a, b) => a.cases > b.cases ? -1 : 0);
}

export const showDataOnMap = (data, casesType='cases') => (
    data.map(country => (
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={casesTypeColors[casesType].hex}
            fillColor={casesTypeColors[casesType].hex}
            radius={
                Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier 
            }
        >
            <Popup>
                <div className='info-container'>
                    <div className='info-flag' style={{backgroundImage: `url(${country.countryInfo.flag})` }}></div>
                    <div className="info-name">{country.country}</div>
                    <div className='info-confirmed'>Cases: {numeral(country.cases).format("0,0")}</div>
                    <div className='info-recovered'>Recovered: {numeral(country.recovered).format("0,0")}</div>
                    <div className='info-deaths'>Deaths: {numeral(country.deaths).format("0,0")}</div>
                </div>
            </Popup>
        </Circle>
    ))
)