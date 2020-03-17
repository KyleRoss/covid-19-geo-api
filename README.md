# covid-19-geo-api
Simple API to access up-to-date COVID-19 data. This application utilizes the [ArcGIS COVID-19 Cases API](https://coronavirus-disasterresponse.hub.arcgis.com/datasets/bbb2e4f589ba40d692fab712ae37b9ac) to pull up-to-date data every 5 minutes and cache the data within a database. The data is normalized and provided in a flexible API format.

**Note:** This project is still a work in progress which means endpoints and/or data may change in the near future as this project evolves.



## API

The API is hosted on Heroku and utilizes a PostgeSQL database to normalize and cache the data.

### API URL

The base API url is: [https://covid-19-geo-api.herokuapp.com](https://covid-19-geo-api.herokuapp.com)

### Endpoints

The following endpoints are available through this API:

#### Get All Data

```http
GET /
```

```json
[{
  "country": "Country Name",
  "country_code": "CC",
  "province": "Province/State Name",
  "province_abbr": "PA",
  "lat": "0.00000",
  "long": "-0.00000",
  "confirmed": 0,
  "recovered": 0,
  "deaths": 0,
  "last_update": "2020-03-16T16:53:06.000Z"
}, {
	...
}]
```

[Example](https://covid-19-geo-api.herokuapp.com/)

#### Get Global Totals

```http
GET /totals
```

```JSON
{
  "total_confirmed": 1000,
  "total_recovered": 1000,
  "total_deaths": 1000
}
```

[Example](https://covid-19-geo-api.herokuapp.com/totals)

#### Get Totals Aggregated by Country

```http
GET /totals/country
```

```json
[{
  "country": "Country Name",
  "country_code": "CC",
  "total_confirmed": 1000,
  "total_recovered": 1000,
  "total_deaths": 1000
}, {
	...
}]
```

[Example](https://covid-19-geo-api.herokuapp.com/totals/country)

#### Get Data by Country Code

```http
GET /country/:countryCode
```

```json
[{
  "country": "Country Name",
  "country_code": "CC",
  "province": "Province/State Name",
  "province_abbr": "PA",
  "lat": "0.00000",
  "long": "-0.00000",
  "confirmed": 0,
  "recovered": 0,
  "deaths": 0,
  "last_update": "2020-03-16T16:53:06.000Z"
}, {
	...
}]
```

[Example](https://covid-19-geo-api.herokuapp.com/country/us)

#### Get Data by US State Abbreviation

```http
GET /country/us/:stateAbbr
```

```json
{
  "country": "Country Name",
  "country_code": "CC",
  "province": "Province/State Name",
  "province_abbr": "PA",
  "lat": "0.00000",
  "long": "-0.00000",
  "confirmed": 0,
  "recovered": 0,
  "deaths": 0,
  "last_update": "2020-03-16T16:53:06.000Z"
}
```

[Example](https://covid-19-geo-api.herokuapp.com/country/us/sc)

