// get current location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser");
    }
}

function showPosition(position) {
	showPrayTimes(position.coords.latitude, position.coords.longitude, prayTimes);
}

function showPrayTimes(lat, long, prayTimes) {
	var paryerTimes = prayTimes.adjust( {asr: 'Hanafi', maghrib: '3 min'} );
	var paryerTimes = prayTimes.getTimes(new Date(), [lat, long], +6, 0, '12h');

	var list = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Sunset', 'Maghrib', 'Isha', 'Midnight'];

	var html = '<table id="timetable" class="table table-bordered table-hover">';
	html += '<tr><th colspan="2">'+ new Date().toLocaleString()+ '</th></tr>';
	for(var i in list)	{
		html += '<tr><td>'+ list[i]+ '</td>';
		html += '<td class="text-right">'+ paryerTimes[list[i].toLowerCase()]+ '</td></tr>';
	}
	html += '</table>';

	document.getElementById('divShowPrayTimes').innerHTML = html;
}

getLocation();