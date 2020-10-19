import React, { useEffect, useState } from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent
} from '@material-ui/core';

import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData } from './Util';

import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

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
    .then(res => res.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
    })
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID 19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {countries.map((index, country) => (
                <MenuItem key={index} value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl> 
        </div>
        <div className="app__stats">
            <InfoBox title='Casos de Covid-19' cases={countryInfo.todayCases} total={countryInfo.cases}/>
            <InfoBox title='Recuperados' cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
            <InfoBox title='Mortes' cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
        </div>
        <Map/>

      </div>
      <div className="app__right">
        <Card>
          <CardContent>
            <h3>Casos Atualizados por País:</h3>
            <Table countries={tableData} />
            <h3>Novos casos no Mundo:</h3>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
