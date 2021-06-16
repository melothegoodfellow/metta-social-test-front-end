import { Component } from '@angular/core';
import * as moment from "moment";

//data
import * as data from "../assets/data/flights.json";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'metta-social-test-front-end';
  flights = (data as any).default;
  searchResults = {
    min: 0,
    max: 10000
  }
  returnFlight: Boolean = true;
  flightsSearch = [];
  originCityName = "";
  destinationCityName = "";
  departureDate = "";
  departureDateFormatted = "";
  returnDate = "";
  returnDateFormatted = "";
  passengers = 1;
  searchedOriginCityName = "";
  searchedDestinationCityName = "";

  toggleTab(){
    this.flightsSearch = [];
    this.originCityName = "";
    this.destinationCityName = "";
    this.departureDate = "";
    this.departureDateFormatted = "";
    this.returnDate = "";
    this.returnDateFormatted = "";
    this.passengers = 1;
    this.searchedOriginCityName = "";
    this.searchedDestinationCityName = "";
    this.returnFlight = !this.returnFlight;
  }

  private getFlights(originCityName, destinationCity, departureDate, passengers){
    return this.flights.filter((item) => {
      const flightDepartureSearchedDate = moment(departureDate, "YYYY/MM/DD");
      const checkFlightDepartureDate = moment(item.departure_date_time, "DD/MM/YYYY").isSame(flightDepartureSearchedDate);
      if(
        item.origin_city_name.toLowerCase().includes(originCityName.toLowerCase()) &&
        item.destination_city_name.toLowerCase().includes(destinationCity.toLowerCase()) &&
        checkFlightDepartureDate &&
        item.business_class_available_seats + 
        item.economy_class_available_seats >= passengers
        ){
          this.searchedOriginCityName = item.origin_city_name;
          this.searchedDestinationCityName = item.destination_city_name;
          return item;
        }
    });
  }

  searchFlights(originCityName, destinationCityName, departureDate, returnDate: any = "", passengers){
    this.flightsSearch = [];
    const departFlightsData: any = this.getFlights(originCityName, destinationCityName, departureDate, passengers);
    this.departureDateFormatted = moment(departureDate).format("Do MMM YYYY");
    departFlightsData.map((departFlightData) => {
      let flightDepartureBookingDetails: any = {
        departFlightId: departFlightData.id,
        departFlightOriginCode: departFlightData.origin_city_code,
        departFlightDestinationCode: departFlightData.destination_city_code,
        departFlightDepartureTime: moment(departFlightData.departure_date_time).format("hh:mm A"),
        departFlightArrivalTime: moment(departFlightData.arrival_date_time).format("hh:mm A"),
        departFlightPrice: departFlightData.price
      }
      if(returnDate != "") {
        const returnFlightsData: any = this.getFlights(destinationCityName,originCityName, returnDate, passengers);
        this.returnDateFormatted = moment(returnDate).format("Do MMM YYYY");
        if(returnFlightsData.length > 0){
          returnFlightsData.map((returnFlightData) => {
            let flightReturnBookingDetails: any = {
              returnFlightId: returnFlightData.id,
              returnFlightOriginCode: returnFlightData.origin_city_code,
              returnFlightDestinationCode: returnFlightData.destination_city_code,
              returnFlightDepartureTime: moment(returnFlightData.departure_date_time).format("hh:mm A"),
              returnFlightArrivalTime: moment(returnFlightData.arrival_date_time).format("hh:mm A"),
              returnFlightPrice: returnFlightData.price
            }
            this.flightsSearch.push(
              {
                ...flightDepartureBookingDetails,
                ...flightReturnBookingDetails
              });
          });
        }
        else{
          this.flightsSearch.push(flightDepartureBookingDetails);
        }
      }
    });
  }
}
