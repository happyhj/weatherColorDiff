
$(document).ready(function(){
	resizeComponents();

	// 자신의 위치를 가져와서 showWeather에 위치정보를 인자로 담아 실행시킨다.
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

	$.ajax({
		type: "GET",
		url: sQuery,
		dataType: "jsonp",
		success: function(forecastData){
			//로컬스토리지에 예보정보 저장
			localStorage.setItem('forecastData', JSON.stringify(forecastData));
			
			printWeatherComponents();
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

	// 화면 콤포넌트 크기 조정
	resizeComponents();
};
	

function updateWeatherPage(dayNumber, sPageId,forecastData){
	var sPresentPage = sPageId;
	var present = extractWeatherInfo(forecastData,dayNumber);
	
	// 온도 강수확률 풍향 업데이트
	$(sPresentPage +" .weatherInfoContainer .degreeContainer .degree").html(String(present['temperatureMax'])+"°C");
	$(sPresentPage +" .rainPercent span").html(String(present['precipProbability'])+"%");
	$(sPresentPage +" .wind span").html(String(present['windSpeed'])+"m/s");
	
	// 날씨아이콘 날짜텍스트 업테이트 
	$(sPresentPage +" .weatherIcon span.icon").html(getWeatherIconCode(present));
	$(sPresentPage +" .date_text").html(String(present['month'])+"월 "+String(present['date'])+"일");	

	// 해당페이지 배경색 업데이트
	var present = extractWeatherInfo(forecastData,dayNumber);
	var temperature = present['temperatureMax'];
	var greenScale = 210-(temperature-20)*8;
	$(sPageId).css("background-color","rgb(240,"+String(greenScale)+",0)");
}

function extractWeatherInfo(forecastData,date){
	var daily = forecastData['daily']['data'][date];
	var present = {};
	present['icon'] = daily['icon'];
	present['precipProbability'] = parseInt(daily['precipProbability']*100);
	present['temperatureMax'] = parseInt(daily['temperatureMax']);
	present['windSpeed'] = daily['windSpeed'];
	var date = new Date(daily['time']*1000);

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
	resizeComponents();
});

function resizeComponents(){
	// 구석삼각형 크기 설정
	var radiuOfTriangle = Math.round($(window).width()/2.2);
	var vertivalShiftCoefficient = radiuOfTriangle*(1-1/(2*Math.sqrt(2)))*(-1)-1;
	var horizontalShiftCoefficient = radiuOfTriangle*(0.5-1/(2*Math.sqrt(2)))*(-1)-1;
	$("div.arrow-left").css("border-bottom",String(radiuOfTriangle) + "px solid transparent");
	$("div.arrow-left").css("border-top",String(radiuOfTriangle) + "px solid transparent");
	$("div.arrow-left").css("border-right",String(radiuOfTriangle) + "px solid #2f2f2f");
	 
	$("div.arrow-left").css("margin-top", String(vertivalShiftCoefficient*2)+"px");
	$("div.arrow-left").css("margin-left", horizontalShiftCoefficient.toString()+"px");
	
	// 현재 날씨 삼각형 색 조정
	var greenScale2 = 210-(localStorage.getItem('today_temp')-20)*8;
	$("div.arrow-left").css("border-right-color","rgb(240,"+String(greenScale2)+",0)");	

	
	// 개별페이지 크기 (컨트롤 파트제외)
	$(".pageContainer").css("height",String($(window).height()-100)+ "px");


}