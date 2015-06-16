function searchFlights(company) {
	numberOfFlights=flightSearch.search.length
	searchInitiated=false

	for (i=1; i<numberOfFlights; ++i) if (flightSearch.search[i].checked) {
		searchInitiated=true

		srcair=flightSearch.srcair[i].value
		srcday=parseInt(flightSearch.srcday[i].value)
		srcmon=parseInt(flightSearch.srcmon[i].value)
		srcyea=parseInt(flightSearch.srcyea[i].value)

		dstair=flightSearch.dstair[i].value
		dstday=parseInt(flightSearch.dstday[i].value)
		dstmon=parseInt(flightSearch.dstmon[i].value)
		dstyea=parseInt(flightSearch.dstyea[i].value)

		adult=verZero(flightSearch.adult[i].value)
		senior=verZero(flightSearch.senior[i].value)
		youth=verZero(flightSearch.youth[i].value)
		child=verZero(flightSearch.child[i].value)
		infantseat=verZero(flightSearch.infantseat[i].value)
		infantlap=verZero(flightSearch.infantlap[i].value)

	        if ((company == 'all') || (company == 'orbitz')) showFliths(searchOrbitz(srcair, srcday, srcmon, srcyea, dstair, dstday, dstmon, dstyea, adult, senior, youth, child, infantseat, infantlap), 'orbitz')
	        if ((company == 'all') || (company == 'yahoo')) showFliths(searchYahoo(srcair, srcday, srcmon, srcyea, dstair, dstday, dstmon, dstyea, adult, senior, youth, child, infantseat, infantlap), 'yahoo')
	        if ((company == 'all') || (company == 'expedia')) showFliths(searchExpedia(srcair, srcday, srcmon, srcyea, dstair, dstday, dstmon, dstyea, adult, senior, youth, child, infantseat, infantlap), 'expedia')
	        if ((company == 'all') || (company == 'AA')) showFliths(searchAA(srcair, srcday, srcmon, srcyea, dstair, dstday, dstmon, dstyea, adult, senior, youth, child, infantseat, infantlap), 'AA')
	        if ((company == 'all') || (company == 'NWA')) showFliths(searchNWA(srcair, srcday, srcmon, srcyea, dstair, dstday, dstmon, dstyea, adult, senior, youth, child, infantseat, infantlap), 'NWA')
	        if ((company == 'all') || (company == 'United')) showFliths(searchUnited(srcair, srcday, srcmon, srcyea, dstair, dstday, dstmon, dstyea, adult, senior, youth, child, infantseat, infantlap), 'United')
	        
	        
	}

	if (!searchInitiated) alert('Please check at least one box next to "Search"')
}

function showFliths(url, company) {
	window.open(url, company, "toolbar=yes, location=yes, directories=no, status=yes, menubar=yes, scrollbars=yes, resizable=yes, copyhistory=no")
}

function verZero(x) {
	if (x == "") return 0 ; else return parseInt(x)
}

function getMmm(month) {
	switch (month) {
	case  1: return('Jan')
	case  2: return('Feb')
	case  3: return('Mar')
	case  4: return('Apr')
	case  5: return('May')
	case  6: return('Jun')
	case  7: return('Jul')
	case  8: return('Aug')
	case  9: return('Sep')
	case 10: return('Oct')
	case 11: return('Nov')
	case 12: return('Dec')
	}
}

function fullYear(year) {
	if (year < 2000) return (year + 2000); else return(year)
}

