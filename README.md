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
GET /data
```

**Query String Parameters:**

| Parameter | Type   | Description                                                  | Default  | Example            |
| --------- | ------ | ------------------------------------------------------------ | -------- | ------------------ |
| country   | String | Filter results to a specific country code. Must be a valid [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code. | --       | `?country=us`      |
| state     | String | Get data for a specific US state. Must be a valid [USPS State abbreviation](https://en.wikipedia.org/wiki/List_of_U.S._state_abbreviations). With this parameter set, `country` is optional, but if provided, it must be set to `us`. Results will be returned as an object versus an array of objects. | --       | `?state=sc`        |
| order     | String | Order the results by a specific field. This may be any field that is in the results. | `active` | `?order=confirmed` |
| dir       | String | The direction to sort the results by.                        | `DESC`   | `?dir=asc`         |



```json
[{
  "country": "Country Name",
  "country_code": "CC",
  "province": "Province/State Name",
  "province_abbr": "PA",
  "lat": 0.00000,
  "long": -0.00000,
  "active": 0,
  "confirmed": 0,
  "recovered": 0,
  "deaths": 0,
  "mortality_rate": 0.00,
  "recovery_rate": 0.00,
  "last_update": "2020-03-16T16:53:06.000Z"
}, {
	...
}]
```

[Example (All Data)](https://covid-19-geo-api.herokuapp.com/data)

[Example (By Country)](https://covid-19-geo-api.herokuapp.com/data?country=us)

[Example (By State)](https://covid-19-geo-api.herokuapp.com/data?state=sc)

[Example (Ordering)](https://covid-19-geo-api.herokuapp.com/data?order=confirmed&dir=asc)

#### Get Global Totals

```http
GET /totals
```

```JSON
{
  "total_active": 1000,
  "total_confirmed": 1000,
  "total_recovered": 1000,
  "total_deaths": 1000,
  "mortality_rate": 0.00,
  "recovery_rate": 0.00
}
```

[Example](https://covid-19-geo-api.herokuapp.com/totals)

#### Get Totals Aggregated by Country

```http
GET /totals/country
```

**Query String Parameters:**

| Parameter | Type   | Description                                                  | Default        | Example                  |
| --------- | ------ | ------------------------------------------------------------ | -------------- | ------------------------ |
| country   | String | Filter results to a specific country code. Must be a valid [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code. Results will be an object instead of an array of objects if this parameter is provided. | --             | `?country=us`            |
| order     | String | Order the results by a specific field. This may be any field that is in the results. | `total_active` | `?order=total_confirmed` |
| dir       | String | The direction to sort the results by.                        | `DESC`         | `?dir=asc`               |



```json
[{
  "country": "Country Name",
  "country_code": "CC",
  "total_active": 1000,
  "total_confirmed": 1000,
  "total_recovered": 1000,
  "total_deaths": 1000,
  "mortality_rate": 0.00,
  "recovery_rate": 0.00
}, {
	...
}]
```

[Example](https://covid-19-geo-api.herokuapp.com/totals/country)

[Example (Country)](https://covid-19-geo-api.herokuapp.com/totals/country?country=us)

[Example (Ordering)](https://covid-19-geo-api.herokuapp.com/totals/country?order=total_deaths&dir=asc)

