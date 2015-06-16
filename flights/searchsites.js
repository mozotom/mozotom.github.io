function searchOrbitz(srcair, srcday, srcmon, srcyea, dstair, dstday, dstmon, dstyea, adult, senior, youth, child, infantseat, infantlap) {
	return(
		'http://www.orbitz.com/App/SubmitLFSSearchRequest' + 
		'?searchMethodHidden=' +
		'&fullSearchOptionHidden=' +
		'&searchType=roundtrip' +
		'&slice1%3AdepartCity=' + srcair + 
		'&slice1%3AarriveCity=' + dstair + 
		'&slice1%3Amonth=' + getMmm(srcmon) +
		'&slice1%3Aday=' + srcday +
		'&slice1%3AtimeType=Depart' +
		'&slice1%3Atime=Anytime' +
		'&slice2%3Amonth=' + getMmm(dstmon) +
		'&slice2%3Aday=' + dstday +
		'&slice2%3AtimeType=Depart' +
		'&slice2%3Atime=Anytime' +
		'&cabinClass=Economy' +
		'&adult=' + adult +
		'&senior=' + senior +
		'&youth=' + youth +
		'&child=' + child +
		'&infantWithoutSeat=' + infantlap +
		'&infantWithSeat=' + infantseat +
		'&Search.x=25' +
		'&Search.y=9'
	)

}

function searchYahoo(srcair, srcday, srcmon, srcyea, dstair, dstday, dstmon, dstyea, adult, senior, youth, child, infantseat, infantlap) {
	return(
		'http://dps1.travelocity.com/airgcobrand.ctl' +
		'?smls=Y' +
		'&Service=YHOE' +
		'&.intl=us' +
		'&.resform=YahooFlightsR' +
		'&source=YR' +
		'&module=tripsrch' +
		'&results=tripsrch' +
		'&tm_range=+' +
		'&dep_dt_mn_1=' + getMmm(srcmon) +
		'&dep_dt_dy_1=' + srcday +
		'&dep_tm_1=+' +
		'&dep_dt_yr_1=2004' + srcyea +
		'&dep_dt_mn_2=' + getMmm(dstmon) +
		'&dep_dt_dy_2=' + dstday +
		'&dep_tm_2=+' +
		'&dep_dt_yr_2=' + dstyea +
		'&senior_pax_cnt=' + senior +
		'&adult_pax_cnt=' + adult +
		'&chld_pax_cnt=' + child +
		'&cls_svc=YR' +
		'&pref_aln=all' +
		'&num_cnx=3' +
		'&dep_arp_cd%281%29=' + srcair + 
		'&dep_arp_range%281%29=0' +
		'&arr_arp_cd%281%29=' + dstair + 
		'&arr_arp_range%281%29=0' +
		'&trip_option=roundtrp'
	)
}

function searchExpedia(srcair, srcday, srcmon, srcyea, dstair, dstday, dstmon, dstyea, adult, senior, youth, child, infantseat, infantlap) {
	infant=0
        if (infantlap > 0) infant=2
        if (infantseat > 0) infant=1
	return(
		'http://www.expedia.com/pub/agent.dll' +
		'?qscr=fexp' +
		'&flag=q' +
		'&city1=' + srcair + 
		'&citd1=' + dstair + 
		'&date1=' + srcmon + '/' + srcday + '/' + fullYear(srcyea) +
		'&time1=362' +
		'&date2=' + dstmon + '/' + dstday + '/' + fullYear(dstyea) +
		'&time2=362' +
		'&cAdu=' + adult +
		'&cSen=' + senior +
		'&cChi=' + (youth + child + infantseat + infantlap) +
		'&cInf=' +
		'&ages1=' + (infantseat + infantlap) +
		'&infs=' + infant +
		'&tktt=' +
		'&ecrc=' +
		'&eccn=' +
		'&qryt=8' +
		'&bund=1' +
		'&load=1' +
		'&rfrr=-429'
	)
}

function searchAA(srcair, srcday, srcmon, srcyea, dstair, dstday, dstmon, dstyea, adult, senior, youth, child, infantseat, infantlap) {
	return(
		'http://www.aa.com/apps/reservations/RTripSearchFlights.jhtml' +
		'?_DARGS=%2Fapps%2Freservations%2FRTripSearchFlights.jhtml' +
		'&tripType=roundTrip' +
		'&_D%3AtripType=+' +
		'&currentCalForm=return' +
		'&currentCodeForm=' +
		'&origin=' + srcair + 
		'&_D%3Aorigin=+' +
		'&destination=' + dstair + 
		'&_D%3Adestination=+' +
		'&departureMonth=' + srcmon +
		'&_D%3AdepartureMonth=+' +
		'&departureDay=' + srcday +
		'&_D%3AdepartureDay=+' +
		'&departureTime=1' +
		'&_D%3AdepartureTime=+' +
		'&departureYear=' +
		'&returnMonth=' + dstmon +
		'&_D%3AreturnMonth=+' +
		'&returnDay=' + dstday +
		'&_D%3AreturnDay=+' +
		'&returnTime=1' +
		'&_D%3AreturnTime=+' +
		'&returnYear=' +
		'&numAdultPassengers=' + (adult + senior) +
		'&_D%3AnumAdultPassengers=+' +
		'&numChildPassengers=' + (youth + child + infantseat + infantlap) +
		'&_D%3AnumChildPassengers=+' +
		'&cabinClass=coach-restricted' +
		'&_D%3AcabinClass=+' +
		'&_D%3AcabinClass=+' +
		'&_D%3AcabinClass=+' +
		'&_D%3AcabinClass=+' +
		'&_D%3AcabinClass=+' +
		'&searchType=fare' +
		'&_D%3AsearchType=+' +
		'&_D%3AsearchType=+' +
		'&displayCount=50' +
		'&_D%3AdisplayCount=+' +
		'&maximumStops=P' +
		'&_D%3AmaximumStops=+' +
		'&_D%3AmaximumStops=+' +
		'&_D%3AmaximumStops=+' +
		'&_D%3Acarrier=+' +
		'&carrier=all' +
		'&_D%3Acarrier=+' +
		'&countryPointOfSale=US' +
		'&_D%3AcountryPointOfSale=+' +
		'&_D%3AcountryPointOfSale=+' +
		'&_D%3AcountryPointOfSale=+' +
		'&%2Faa%2Ftravelinfo%2FSearchFlightsFormHandler.cancelURL=%2Fapps%2Freservations%2FRTripSearchFlights.jhtml' +
		'&_D%3A%2Faa%2Ftravelinfo%2FSearchFlightsFormHandler.cancelURL=+' +
		'&_D%3A%2Faa%2Ftravelinfo%2FSearchFlightsFormHandler.cancel=+' +
		'&_D%3Asubmit=+' +
		'&submit.x=26' +
		'&submit.y=7'
	)
}

function searchNWA(srcair, srcday, srcmon, srcyea, dstair, dstday, dstmon, dstyea, adult, senior, youth, child, infantseat, infantlap) {
	return(
		'http://res.nwa.com/App/ValidateFlightSearch?searchType=roundtrip' +
		'&slice1%3AdepartCity=' + srcair + 
		'&slice1%3AarriveCity=' + dstair + 
		'&slice1%3Amonth=' + getMmm(srcmon) +
		'&slice1%3Aday=' + srcday +
		'&slice1%3Atime=anytime' +
		'&slice2%3Amonth=' + getMmm(dstmon) +
		'&slice2%3Aday=' + dstday +
		'&slice2%3Atime=anytime' +
		'&adult=' + adult +
		'&child=' + (youth +  child) +
		'&senior=' + senior +
		'&infantWithoutSeat=' + infantlap +
		'&infantWithSeat=' + infantseat +
		'&cabinClass=Economy%2FCoach' +
		'&ecertRefCode=' +
		'&ecertCertificateNum=' +
		'&lowFareSearch.x=45' +
		'&lowFareSearch.y=15'
	)
}

function searchUnited(srcair, srcday, srcmon, srcyea, dstair, dstday, dstmon, dstyea, adult, senior, youth, child, infantseat, infantlap) {
	return(
		'https://www.itn.net/cgi/air' +
		'?stamp=2_zHiCeBnKZ*itn%2Ford%3D1073015753.56414%2Citn%2Fair%2Funited' +
		'&best_itins=2' +
		'&return_to=best_itins' +
		'&action=Search' +
		'&rt_ow=Round+Trip' +
		'&depart=' + srcair + 
		'&dest.0=' + dstair + 
		'&mon_abbr.0=' + getMmm(srcmon) +
		'&date.0=' + srcday +
		'&hour_ampm.0=12+am' +
		'&mon_abbr.1=' + getMmm(dstmon) +
		'&date.1=' + dstday +
		'&hour_ampm.1=12+am' +
		'&searchby=itins' +
		'&persons=' + (adult + senior + youth + child + infantseat + infantlap) +
		'&air_class=coach+%28lowest+avail.%29' +
		'&airline=United' +
		'&airline=%28No+Preference%29' +
		'&airline=%28No+Preference%29' +
		'&air_avail=20' +
		'&air_sort=price+%28lowest+to+highest%29' +
		'&mi_return_to=err%2Fff_error_ecert' +
		'&ecertfail_return_to=err%2Fff_error_ecert' +
		'&ecert_num=' +
		'&airsearch=Search'
	)
}


