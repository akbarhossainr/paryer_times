function en_to_bn_number_conversion(en_number) {
	var bn_number = '';

	for (var i = 0; i < en_number.length; i++) {

		if (en_number[i] == '0') bn_number = bn_number + "০";

		if (en_number[i] == '1') bn_number = bn_number + "১";

		if (en_number[i] == '2') bn_number = bn_number + "২";

		if (en_number[i] == '3') bn_number = bn_number + "৩";

		if (en_number[i] == '4') bn_number = bn_number + "৪";

		if (en_number[i] == '5') bn_number = bn_number + "৫";

		if (en_number[i] == '6') bn_number = bn_number + "৬";

		if (en_number[i] == '7') bn_number = bn_number + "৭";

		if (en_number[i] == '8') bn_number = bn_number + "৮";

		if (en_number[i] == '9') bn_number = bn_number + "৯";

		if (en_number[i] == ':') bn_number = bn_number + ":";
		
		if (en_number[i] == 'am') bn_number = bn_number + "asjg";

	}

	return bn_number; 
}


// get current location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, error);
    } else {
        console.log("Geo location is not supported by this browser");
    }
}

function error(error) {
	// console.log(error.code, error.message);
	if (error.code == 2) {
		console.log("Prayer time generating according to Dhaka's coordinates");
		showPrayTimes(23.8043699, 90.3997218, prayTimes);
	}
}

function showPosition(position) {
	showPrayTimes(position.coords.latitude, position.coords.longitude, prayTimes);
}

function showPrayTimes(lat, long, prayTimes) {
	moment.locale('en');
	// Method: University of Islamic Sciences, Karachi
	// Abbr.: Karachi
	// Region Used: Pakistan, Afganistan, Bangladesh, India
	var prayerTimes = prayTimes.setMethod('Karachi');
	var prayerTimes = prayTimes.adjust( {asr: 'Hanafi', maghrib: '3 min'} );
	var prayerTimes = prayTimes.getTimes(new Date(), [lat, long, 300], +6, 0, '12h');

	var list = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Sunset', 'Maghrib', 'Isha', 'Midnight'];
	var listBN = ['ফজর', 'সূর্যোদয়', 'জোহর', 'আসর', 'সূর্যাস্ত', 'মাগরিব', 'ইশা', 'মধ্যরাত'];

	var html = '<table id="timetable" class="table table-bordered table-hover">';
	var nextPrayerTime;
	var nextPrayerTimeRemaining;
	var nextPrayerTimeName;
	var listLength = list.length;
	for (var i = 0; i < listLength; i++) {

		// find current waqt
		var currentWaqt = '';

		var startTime = moment(prayerTimes[list[i].toLowerCase()], 'hh:mm a');
		if (list[i+1]) {
			var endTime = moment(prayerTimes[list[i+1].toLowerCase()], 'hh:mm a');
		}else{
			var endTime = moment(prayerTimes[list[0].toLowerCase()], 'hh:mm a');
		}

		if (startTime.hour() >=12 && endTime.hour() <=12 )
		{
			endTime.add(1, "days");       // handle spanning days
		}

		if (currentWaqt == '') {
			if (moment().isBetween(startTime, endTime)) {
				if (list[i] != 'Sunrise' && list[i] != 'Sunset' && list[i] != 'Midnight') {
					currentWaqt = 'bg-success';
				}

				nextPrayerTime = moment(prayerTimes[list[i+1].toLowerCase()], 'hh:mm a');
				nextPrayerTimeName = list[i+1];
				if (list[i+1] == 'Sunrise' || list[i+1] == 'Sunset' || list[i+1] == 'Midnight') {
					if (list[i+1] == 'Midnight') {
						nextPrayerTime = prayerTimes[list[0].toLowerCase()];
						nextPrayerTimeName = list[0];
						if($("input[name='lang']:checked").val() === 'bn'){
							nextPrayerTimeName = listBN[0];
						}
					}else{
						nextPrayerTime = prayerTimes[list[i+2].toLowerCase()];
						nextPrayerTimeName = list[i+2];
						if($("input[name='lang']:checked").val() === 'bn'){
							nextPrayerTimeName = listBN[i+2];
						}
					}
					nextPrayerTime = moment(nextPrayerTime, 'hh:mm a');
				}
				
				nextPrayerTimeRemaining = moment(nextPrayerTime.diff(moment())).utc().format('HH:mm:ss');
				if($("input[name='lang']:checked").val() === 'bn'){
					nextPrayerTimeRemaining = en_to_bn_number_conversion(moment(nextPrayerTime.diff(moment())).utc().format('HH:mm:ss'));
					nextPrayerTimeName = listBN[i+1];
				}
			}
		}
		var waqt_name = list[i];
		var paryer_time = prayerTimes[list[i].toLowerCase()];
		if($("input[name='lang']:checked").val() === 'bn'){
			paryer_time = en_to_bn_number_conversion(prayerTimes[list[i].toLowerCase()]);
			waqt_name = listBN[i];
		}
		
		html += '<tr class="'+currentWaqt+'"><td>'+waqt_name+ '</td>';
		html += '<td class="text-right">'+paryer_time+ '</td></tr>';

		
		
	}
	var table_footer_title = "Next Prayer Time Remaining";
	if($("input[name='lang']:checked").val() === 'bn'){
		var table_footer_title = "পরবর্তী নামাজের সময় বাকী";
	}

	html += '<tfoot><tr class="text-center"><td colspan="2"><strong id="table_footer_title">'+table_footer_title+'</strong><br> '+nextPrayerTimeName+' '+nextPrayerTimeRemaining+'</td></tfoot>';

	html += '</table>';

	document.getElementById('divShowPrayTimes').innerHTML = html;
}

setInterval(getLocation, 0);

// Set current date and time on card header
function setCurrentDateTime() {
	if($("input[name='lang']:checked").val() === 'bn'){
		moment.locale('bn');
		document.getElementById("table_header_title").innerHTML = "নামাজের সময়";
		document.getElementById("footer_note").innerHTML = "* উজ্জ্বল সারি বর্তমান ওয়াক্ত প্রকাশ করে";
	}else{
		moment.locale('en');
		document.getElementById("table_header_title").innerHTML = "Prayer Times";
		document.getElementById("footer_note").innerHTML = "* Highlited row define the current waqt</sma";
	}
	document.getElementById("currentDateTime").innerHTML = moment().format('MMMM Do YYYY, h:mm:ss a');
}
setInterval(setCurrentDateTime, 0);
