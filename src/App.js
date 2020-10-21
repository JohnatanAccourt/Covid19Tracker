import React, { useEffect, useState } from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent
} from '@material-ui/core';

import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table';
import LineGraph from './components/LineGraph';
import { prettyPrintStat, sortData } from './util/util';

import './styles/App.css';
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);

  const [country, setInputCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});

  const [tableData, setTableData] = useState([]);

  const [mapCenter, setMapCenter] = useState({
    lat: 34.00746,
    lng: -40.4796
  });
  const [mapZoom, setMapZoom] = useState(3);

  const [mapCountries, setMapCountries] = useState([]);

  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then((res) => res.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, [])

  useEffect(() => {
      const getCountriesData = async () => {
        await fetch('https://disease.sh/v3/covid-19/countries')
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ))
          const sortedData = sortData(data)
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        })
      }

      getCountriesData();
  },[])

  const onCountryChange = async(e) => {
    const countryCode = e.target.value;

    const url = countryCode === 'worldwide' ? 
    'https://disease.sh/v3/covid-19/all' :
    `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      setInputCountry(countryCode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      setMapZoom(4);
    })
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value='worldwide'>Mundo Todo</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl> 
        </div>
        <div className="app__stats">
            <InfoBox
              isRed
              active={casesType === 'cases'}
              onClick={e => setCasesType('cases')}
              title='Casos de Covid-19' 
              cases={prettyPrintStat(countryInfo.todayCases)} 
              total={prettyPrintStat(countryInfo.cases)}
            />
            <InfoBox 
              active={casesType === 'recovered'}
              onClick={e => setCasesType('recovered')}
              title='Recuperados' 
              cases={prettyPrintStat(countryInfo.todayRecovered)} 
              total={prettyPrintStat(countryInfo.recovered)}
            />
            <InfoBox
              isRed 
              active={casesType === 'deaths'}
              onClick={e => setCasesType('deaths')}
              title='Mortes' 
              cases={prettyPrintStat(countryInfo.todayDeaths)} 
              total={prettyPrintStat(countryInfo.deaths)}
            />
        </div>
        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />

      </div>
      <div className="app__right">
        <Card>
          <CardContent>
            <h3 >Casos Atualizados por País:</h3>
            <Table countries={tableData} />
            <h3 className="app__graphTitle">
              Novas acorrências de 
              { casesType === 'cases' ? ' casos '
                :
                casesType === 'deaths'? ' mortes '
                :
                casesType === 'recovered' ? ' recuperados '
                :
                casesType === ' casos '
              } 
               no Mundo:
            </h3>
            <LineGraph className="app__graph" casesType={casesType} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
