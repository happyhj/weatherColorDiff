
$(document).ready(function(){
	getLocation();
});

function getLocation()
{
	if (navigator.geolocation)
	{
		navigator.geolocation.getCurrentPosition(showWeather);
	}
	else
	{
		x.innerHTML="Geolocation is not supported by this browser.";
	}
}

var tempInfo = [];

function showWeather(position)
{
	var sQuery = "https://api.forecast.io/forecast/29279b7685082aa05011a94496dd608f/"+position.coords.latitude+","+position.coords.longitude+"?units=si";
//	alert(sQuery);
	$.ajax({
		type: "GET",
		url: sQuery,
		dataType: "jsonp",
		success: function(forecastData){
			//로컬스토리지에 예보정보 저장
			localStorage.setItem('forecastData', JSON.stringify(forecastData));
			printWeatherComponents();
/*
			var today_temp = extractWeatherInfo(forecastData,0).temperatureMax;
			localStorage.setItem('today_temp', today_temp);


			updateWeatherPage(0,"#presentPage",forecastData);
			updateWeatherPage(1,"#day1Page",forecastData);
			updateWeatherPage(2,"#day2Page",forecastData);
			updateWeatherPage(3,"#day3Page",forecastData);
			updateWeatherPage(4,"#day4Page",forecastData);
			updateWeatherPage(5,"#day5Page",forecastData);
			resizeComponents(forecastData);
*/
		}
	});	
}

// 로컬 스토리지의 데이터를 이용해서 화면에 뿌려주기
function printWeatherComponents(){

	var forecastData = JSON.parse(localStorage.getItem('forecastData'));
	var today_temp = extractWeatherInfo(forecastData,0).temperatureMax;
	localStorage.setItem('today_temp', today_temp);

	updateWeatherPage(0,"#presentPage",forecastData);
	updateWeatherPage(1,"#day1Page",forecastData);
	updateWeatherPage(2,"#day2Page",forecastData);
	updateWeatherPage(3,"#day3Page",forecastData);
	updateWeatherPage(4,"#day4Page",forecastData);
	updateWeatherPage(5,"#day5Page",forecastData);
	resizeComponents(forecastData);
	
	var present = extractWeatherInfo(forecastData,0);
	var temperature = present['temperatureMax'];
	var greenScale2 = 210-(localStorage.getItem('today_temp')-20)*8;
	$("div.arrow-left").css("border-right-color","rgb(240,"+String(greenScale2)+",0)");
};
	

function updateWeatherPage(dayNumber, sPageId,forecastData){
	var sPresentPage = sPageId;
	var present = extractWeatherInfo(forecastData,dayNumber);
	$(sPresentPage +" .weatherInfoContainer .degreeContainer .degree").html(String(present['temperatureMax'])+"°C");
	$(sPresentPage +" .rainPercent span").html(String(present['precipProbability'])+"%");
	$(sPresentPage +" .wind span").html(String(present['windSpeed'])+"m/s");
	$(sPresentPage +" .weatherIcon span.icon").html(getWeatherIconCode(present));
	$(sPresentPage +" .date_text").html(String(present['month'])+"월 "+String(present['date'])+"일");	

	var present = extractWeatherInfo(forecastData,dayNumber);
	var temperature = present['temperatureMax'];
	var greenScale = 210-(temperature-20)*8;
	$(sPageId).css("background-color","rgb(240,"+String(greenScale)+",0)");
}

function getAgoDate(yyyy, mm, dd)
{
// alert( getAgoDate(-1,0,-4) );    ==> 20100305
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth();
  var day = today.getDate();
  
  var resultDate = new Date(yyyy+year, month+mm, day+dd);
  
        year = resultDate.getFullYear();
        month = resultDate.getMonth() + 1;
        day = resultDate.getDate();

        if (month < 10)
            month = "0" + month;
        if (day < 10)
            day = "0" + day;

        return year + "" + month + "" + day;
}

/**
*
* 현재 온도,
*/
function extractWeatherInfo(forecastData,date){
	var daily = forecastData['daily']['data'][date];
	var present = {};
	present['icon'] = daily['icon'];
//	alert(present['icon']);
	present['precipProbability'] = parseInt(daily['precipProbability']*100);
	present['temperatureMax'] = parseInt(daily['temperatureMax']);
	present['windSpeed'] = daily['windSpeed'];
	var date = new Date(daily['time']*1000);

//	var date = new Date(parseInt(String(daily['time']).substr(6)));
	present['date'] = date.getDate();
	present['month'] = date.getMonth()+1;
	
	return 	present;
}
function getWeatherIconCode(present) {
//clear-day, clear-night, rain, snow, sleet, wind, fog, cloudy, 
//partly-cloudy-day, or partly-cloudy-night	
	var sIcon = present['icon'];
	
	switch(sIcon)
	{
	case 'clear-day':
	  return 'B';
	  break;
	case 'clear-night':
	  return 'C';
	  break;
	case 'partly-cloudy-day':
	  return 'H';
	  break;
	case 'rain':
	  return 'R';
	  break;
	case 'snow':
	  return 'W';
	  break;
	case 'sleet':
	  return 'X'
	  break;
	case 'wind':
	  return 'F';
	  break;
	default:
	  return 'A';
	}	
	return
}
// 창 크기가 변하면 이벤트 발생
$(window).resize(function() {
	printWeatherComponents();
});

function resizeComponents(forecastData){
	// 날씨 아이콘 크기 조절
	$(".weatherIcon .big").css("font-size",String($(".weatherIcon").height()-20) + "px");
	//$(".icon").css("font-size",String($(".weatherIcon").height()) + "px");	
	$(".degreeContainer").css("font-size",String($(".degreeContainer").height()-10) + "px");
	
	$(".rainPercent").css("font-size",String($(".rainPercent").height()) + "px");
	$(".wind").css("font-size",String($(".wind").height()) + "px");
	$(".rainPercent img").css("height",String($(".rainPercent").height()) + "px");
	$(".wind img").css("height",String($(".wind").height()) + "px");
	
	$(".dateContainer").css("font-size",String($(window).height()/17-10) + "px");
/*
	$("div.arrow-left").css("border-bottom",String(60) + "px solid transparent");
	$("div.arrow-left").css("border-top",String(60) + "px solid transparent");
	$("div.arrow-left").css("border-right",String(60) + "px solid transparent");
*/
	var radiuOfTriangle = Math.round($(window).width()/4);
	var radiuOfTriangle = Math.round($(window).width()/4);
	
//	alert($("div.weatherIcon").height());
	
	var vertivalShiftCoefficient = radiuOfTriangle*(1-1/(2*Math.sqrt(2)))*(-1)-1;
	var horizontalShiftCoefficient = radiuOfTriangle*(0.5-1/(2*Math.sqrt(2)))*(-1)-1;
	$("div.arrow-left").css("border-bottom",String(radiuOfTriangle) + "px solid transparent");
	$("div.arrow-left").css("border-top",String(radiuOfTriangle) + "px solid transparent");
	$("div.arrow-left").css("border-right",String(radiuOfTriangle) + "px solid #2f2f2f");
	 
	$("div.arrow-left").css("margin-top", String(vertivalShiftCoefficient*2)+"px");
	$("div.arrow-left").css("margin-left", horizontalShiftCoefficient.toString()+"px");
	
	$(".pageContainer").css("height",String($(window).height())+ "px");

}