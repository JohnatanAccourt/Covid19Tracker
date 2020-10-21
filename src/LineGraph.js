import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';

const options = {
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0,0");
        },
      },
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            // vai colocar a virgula
            callback: function (value, index, values) {
              return numeral(value).format("0a");
            },
          },
        },
      ],
    },
};

const buildChartData = (data, casesType) => {
    let chartData = [];
    let lastDataPoint;
    
    for (let date in data.cases) {
        // se tiver alguma informação dentro de lastDataPoint ele vai inserir dentro do X a data
        // e vai inserir dentro de Y o valor subtraído pelo anterior, sendo assim, temos a quantidade certa de quantos casos tivemos NAQUELE dia
        if(lastDataPoint){
            let newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint
            };
            // aqui ele vai inserir a informação para o chartData e consequentemente o data
            chartData.push(newDataPoint);
        }
        // no primeiro loop, ele vai passar por aqui então ele vai inserir a quantidade de casos para que no próximo loop ele faça a média
        // e faça a inserção ao chartData
        lastDataPoint = data[casesType][date];
    }
    return chartData;
}

export default function LineGraph({ casesType = 'cases', ...props }){
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
            .then((res) => {
                return res.json();    
            })
            .then((data) => {
                let chartData = buildChartData(data, casesType);
                setData(chartData);
            })
        }

        fetchData();
    }, [casesType])

    return(
        <div className={props.className}>
        {/* é igual a: data && data.lenght ? */}
        {data?.length > 0 && (
            <Line
            data={{
                datasets: [
                {
                    backgroundColor: "rgba(204, 16, 52, 0.5)",
                    borderColor: "#CC1034",
                    data: data,
                },
                ],
            }}
            options={options}
            />
        )}
        </div>
    )
}