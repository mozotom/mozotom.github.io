function searchSouthwest() {
  if ((searchType == "o") || (searchType == "r")) {
    var queryString="ss=0"
    queryString += "&disc="
    queryString += "&submitButton="
    queryString += "&previouslySelectedBookingWidgetTab="
    queryString += "&originAirportButtonClicked=no"
    queryString += "&destinationAirportButtonClicked=no"
    queryString += "&returnAirport=" + (searchType=="r"?"RoundTrip":"")
    queryString += "&originAirport=" + flights[0].from
    queryString += "&originAirport_displayed="
    queryString += "&destinationAirport=" + flights[0].to
    queryString += "&destinationAirport_displayed="
    queryString += "&outboundDateString=" + flights[0].month + "/" + flights[0].day + "/"  + flights[0].year
    queryString += "&outboundTimeOfDay=ANYTIME"
    queryString += "&returnDateString=" + (searchType=="r"?flights[1].month + "/" + flights[1].day + "/"  + flights[1].year:"")
    queryString += "&returnTimeOfDay=ANYTIME"
    queryString += "&adultPassengerCount=" + passangerCount
    queryString += "&seniorPassengerCount=0"
    queryString += "&promoCode="
    queryString += "&book_now.x=59"
    queryString += "&book_now.y=4"
    postRequest("http://www.southwest.com/flight/search-flight.html?int=HOMEQBOMAIR", queryString)
  } else {
    alert("Southwest allows one-way and return trips only. \nTo search Multi-city please select another vendor")
  }
}
