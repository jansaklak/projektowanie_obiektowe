package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type WeatherRequest struct {
	City    string `json:"city" form:"city" query:"city"`
	Country string `json:"country" form:"country" query:"country"`
}

type WeatherResponse struct {
	Location struct {
		Name    string `json:"name"`
		Country string `json:"country"`
	} `json:"location"`
	Current struct {
		TempC     float64 `json:"temp_c"`
		Condition struct {
			Text string `json:"text"`
			Icon string `json:"icon"`
		} `json:"condition"`
		Humidity    int     `json:"humidity"`
		WindKph     float64 `json:"wind_kph"`
		FeelsLikeC  float64 `json:"feelslike_c"`
		Precipitation float64 `json:"precip_mm"`
	} `json:"current"`
}

type WeatherController struct {
	apiKey string
}

func NewWeatherController() *WeatherController {
	apiKey := os.Getenv("WEATHER_API_KEY")
	if apiKey == "" {
		apiKey = "" // ENTER API HERE
	}
	return &WeatherController{apiKey: apiKey}
}

func (wc *WeatherController) fetchWeatherData(city, country string) (*WeatherResponse, error) {
	url := fmt.Sprintf("http://api.weatherapi.com/v1/current.json?key=%s&q=%s,%s&aqi=no", 
		wc.apiKey, city, country)
		
	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("błąd podczas pobierania danych: %v", err)
	}
	defer resp.Body.Close()
	
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API zwróciło status %d", resp.StatusCode)
	}
	
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("błąd podczas odczytu odpowiedzi: %v", err)
	}
	
	var weatherData WeatherResponse
	if err := json.Unmarshal(body, &weatherData); err != nil {
		return nil, fmt.Errorf("błąd podczas parsowania JSON: %v", err)
	}
	
	return &weatherData, nil
}

func (wc *WeatherController) GetWeather(c echo.Context) error {
	req := new(WeatherRequest)
	if err := c.Bind(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Nieprawidłowe parametry zapytania")
	}
	
	if req.City == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "Nazwa miasta jest wymagana")
	}
	
	if req.Country == "" {
		req.Country = "pl"
	}
	
	weatherData, err := wc.fetchWeatherData(req.City, req.Country)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("Błąd: %v", err))
	}
	
	return c.JSON(http.StatusOK, weatherData)
}

func (wc *WeatherController) PostWeather(c echo.Context) error {
	return wc.GetWeather(c)
}

func main() {
	e := echo.New()
	
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	
	weatherController := NewWeatherController()
	
	e.GET("/weather", weatherController.GetWeather)
	e.POST("/weather", weatherController.PostWeather)
	
	e.Logger.Fatal(e.Start(":8080"))
}
