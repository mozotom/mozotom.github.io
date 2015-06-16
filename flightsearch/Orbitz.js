function searchOrbitz() {
  var orbitzSearchTypes = { "o": "oneway", "r": "roundtrip", "m": "multiflight"}

  var queryString="searchType=air"
  queryString += "&source=" + (searchType=="m"?"advanced":"quick_search")
  queryString += "&searchTab=quick_search"
  queryString += "&dpHidden="
  queryString += "&tripLength="
  queryString += "&searchMethodHidden=find"
  queryString += "&expandTravelers=false"
  queryString += "&WebLogicSession="
  queryString += "&orbotHotelSearchTypeKey=+"
  queryString += "&previousBot="
  queryString += "&currentBot="
  queryString += "&isBot=true"
  queryString += "&isBasicDataPersistenceOnly=true"
  queryString += "&isFlex="
  queryString += "flightType=" + orbitzSearchTypes[searchType]

  if (searchType == "m") {
	for (var i=0; i<flights.length; ++i) {
	  var j = i + 1
      queryString += "&origin" + j + "=" + flights[i].from
      queryString += "&destination" + j + "=" + flights[i].to
      queryString += "&startDate" + j + "=" + flights[i].month + "/" + flights[i].day + "/" + (flights[i].year%100)
      queryString += "&useStartCal" + j + "=true"
      queryString += "&startTimeType" + j + "=Depart"
      queryString += "&startTime" + j + "=Anytime"
    }
    queryString += "&seniors=0"
    queryString += "&youths=0"
    queryString += "&children=0"
    queryString += "&infantsWithoutSeat=0"
    queryString += "&infantsWithSeat=0"
    queryString += "&preferencingType=airline"
    queryString += "&carrier1="
    queryString += "&carrier2="
    queryString += "&carrier3="
    queryString += "&alliance="
    queryString += "&cabinClass=Economy"
  } else {
    queryString += "&origin=" + flights[0].from
    queryString += "&destination=" + flights[0].to
    queryString += "&startDate=" + flights[0].month + "/" + flights[0].day + "/" + (flights[0].year%100)
    queryString += "&useStartCal=true"
    queryString += "&startTime=Anytime"
    queryString += "&endDate=" + (searchType=="r"?flights[1].month + "/" + flights[1].day + "/" + (flights[1].year%100):"")
    queryString += "&useEndCal=true"
    queryString += "&endTime=Anytime"
  }
  queryString += nonStop?"&nonstop=":""
  queryString += "&adults=" + passangerCount
  queryString += "&Search.x=true"

  postRequest("http://www.orbitz.com/App/SubmitQuickSearch?z=a535&r=h", queryString)
}
