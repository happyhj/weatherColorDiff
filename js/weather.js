$(document).ready(function(){
	resizeComponents();
	// 자신의 위치를 가져와서 showWeather에 위치정보를 인자로 담아 실행시킨다.
	getLocation();
	
});

window.onload = function()
{

}

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
	Date.prototype.yyyymmdd = function() {         
	                                
	        var yyyy = this.getFullYear().toString();                                    
	        var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based         
	        var dd  = this.getDate().toString();             
	                            
	        return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
	   };  
	
	d = new Date();
	d.setDate(d.getDate()-1);
	var sD_1 = d.yyyymmdd();
	d.setDate(d.getDate()-1);
	var sD_2 = d.yyyymmdd();
	d.setDate(d.getDate()-1);
	var sD_3 = d.yyyymmdd();

	var sQuery = "https://api.forecast.io/forecast/29279b7685082aa05011a94496dd608f/"+position.coords.latitude+","+position.coords.longitude+"?units=si";
	var sQuery_past = "https://api.forecast.io/forecast/29279b7685082aa05011a94496dd608f/"+position.coords.latitude+","+position.coords.longitude+","+sD_1+"T12:00:00?units=si";
	var sQuery_past2 = "https://api.forecast.io/forecast/29279b7685082aa05011a94496dd608f/"+position.coords.latitude+","+position.coords.longitude+","+sD_2+"T12:00:00?units=si"
	var sQuery_past3 = "https://api.forecast.io/forecast/29279b7685082aa05011a94496dd608f/"+position.coords.latitude+","+position.coords.longitude+","+sD_3+"T12:00:00?units=si"
	$.when(
	$.ajax({ 
		type: "GET",
		url: sQuery,
		dataType: "jsonp"
	}),$.ajax({ 
		type: "GET",
		url: sQuery_past,
		dataType: "jsonp"		
		
	}),$.ajax({ 
		type: "GET",
		url: sQuery_past2,
		dataType: "jsonp"		
		
	}),$.ajax({ 
		type: "GET",
		url: sQuery_past3,
		dataType: "jsonp"		
		
	})).then(function (res1, res2, res3, res4) {		
		//로컬스토리지에 예보정보 저장
		localStorage.setItem('forecastData', JSON.stringify(res1[0]));
//		alert(JSON.stringify(res2[0]['daily']['data']));


		updateWeatherPage(0,"#day-1Page",res2[0]);
		updateWeatherPage(0,"#day-2Page",res3[0]);
		updateWeatherPage(0,"#day-3Page",res4[0]);
	
		var day_n1_temp = extractWeatherInfo(res2[0],0).temperatureMax;
		localStorage.setItem('day_n1_temp', day_n1_temp);	
		var day_n2_temp = extractWeatherInfo(res3[0],0).temperatureMax;
		localStorage.setItem('day_n2_temp', day_n2_temp);		
		var day_n3_temp = extractWeatherInfo(res4[0],0).temperatureMax;
		localStorage.setItem('day_n3_temp', day_n3_temp);		
		
		printWeatherComponents();
		resizeComponents();

	})
	
 
 


}

// 로컬 스토리지의 데이터를 이용해서 화면에 뿌려주기
function printWeatherComponents(){

	var forecastData = JSON.parse(localStorage.getItem('forecastData'));
	var today_temp = extractWeatherInfo(forecastData,0).temperatureMax;
	localStorage.setItem('today_temp', today_temp);

	updateWeatherPage(0,"#day-3Page",forecastData);
	updateWeatherPage(0,"#day-2Page",forecastData);
	updateWeatherPage(0,"#day-1Page",forecastData);
	updateWeatherPage(0,"#presentPage",forecastData);
	updateWeatherPage(1,"#day1Page",forecastData);
	updateWeatherPage(2,"#day2Page",forecastData);
	updateWeatherPage(3,"#day3Page",forecastData);
	updateWeatherPage(4,"#day4Page",forecastData);
	updateWeatherPage(5,"#day5Page",forecastData);


	
 	$("div.controlContainer").attr("class","controlContainer");
	$("div.controlContainer").css("background-color",$("#presentPage").css("background-color"));					  
	// 화면 콤포넌트 크기 조정
	resizeComponents();
	
	var greenScale2 ;
	
	new Dragdealer('magnifier',
	{
		x: 3/9,
		steps: 9,
		snap: true,
		animationCallback: function(x, y)
		{
			switch(x*8+1) {
				case 1:
				  $("#day-3Page").attr("class","weatherPage");
				  $("#day-2Page").attr("class","weatherPage invisiblePage");
				  $("#day-1Page").attr("class","weatherPage invisiblePage");
				  $("#presentPage").attr("class","weatherPage invisiblePage");
				  $("#day1Page").attr("class","weatherPage invisiblePage");
				  $("#day2Page").attr("class","weatherPage invisiblePage");
				  $("#day3Page").attr("class","weatherPage invisiblePage");
				  $("#day4Page").attr("class","weatherPage invisiblePage");
				  $("#day5Page").attr("class","weatherPage invisiblePage");
				  $("div.controlContainer").css("background-color",$("#day-3Page").css("background-color"));
				  $(".red-bar.handle h1").html($("#day-3Page .dateContainer.rightCorner p:first-child").html());
				  $(".red-bar-corner-label").html($("#day-3Page .dateContainer.leftCorner p").html());
					// 구석삼각형 색 설정	 
					greenScale2 = 210-(localStorage.getItem('day_n3_temp')-20)*8;
					$("#day-3Page div.arrow-left").css("border-right-color","rgb(240,"+String(greenScale2)+",0)");	

				  break;
				case 2:
				  $("#day-3Page").attr("class","weatherPage invisiblePage");
				  $("#day-2Page").attr("class","weatherPage");
				  $("#day-1Page").attr("class","weatherPage invisiblePage");
				  $("#presentPage").attr("class","weatherPage invisiblePage");
				  $("#day1Page").attr("class","weatherPage invisiblePage");
				  $("#day2Page").attr("class","weatherPage invisiblePage");
				  $("#day3Page").attr("class","weatherPage invisiblePage");
				  $("#day4Page").attr("class","weatherPage invisiblePage");
				  $("#day5Page").attr("class","weatherPage invisiblePage");
				  $("div.controlContainer").css("background-color",$("#day-2Page").css("background-color"));
				  $(".red-bar.handle h1").html($("#day-2Page .dateContainer.rightCorner p:first-child").html());
				  $(".red-bar-corner-label").html($("#day-2Page .dateContainer.leftCorner p").html());
					// 구석삼각형 색 설정	 
					greenScale2 = 210-(localStorage.getItem('day_n2_temp')-20)*8;
					$("#day-3Page div.arrow-left").css("border-right-color","rgb(240,"+String(greenScale2)+",0)");	
				  break;
				case 3:
				  $("#day-3Page").attr("class","weatherPage invisiblePage");
				  $("#day-2Page").attr("class","weatherPage invisiblePage");
				  $("#day-1Page").attr("class","weatherPage");
				  $("#presentPage").attr("class","weatherPage invisiblePage");
				  $("#day1Page").attr("class","weatherPage invisiblePage");
				  $("#day2Page").attr("class","weatherPage invisiblePage");
				  $("#day3Page").attr("class","weatherPage invisiblePage");
				  $("#day4Page").attr("class","weatherPage invisiblePage");
				  $("#day5Page").attr("class","weatherPage invisiblePage");
				  $("div.controlContainer").css("background-color",$("#day-1Page").css("background-color"));
				  $(".red-bar.handle h1").html($("#day-1Page .dateContainer.rightCorner p:first-child").html());
				  $(".red-bar-corner-label").html($("#day-1Page .dateContainer.leftCorner p").html());
					// 구석삼각형 색 설정	 
					greenScale2 = 210-(localStorage.getItem('day_n1_temp')-20)*8;
					$("#day-3Page div.arrow-left").css("border-right-color","rgb(240,"+String(greenScale2)+",0)");	
				  break;
				case 4:
				  $("#day-3Page").attr("class","weatherPage invisiblePage");
				  $("#day-2Page").attr("class","weatherPage invisiblePage");
				  $("#day-1Page").attr("class","weatherPage invisiblePage");
				  $("#presentPage").attr("class","weatherPage");
				  $("#day1Page").attr("class","weatherPage invisiblePage");
				  $("#day2Page").attr("class","weatherPage invisiblePage");
				  $("#day3Page").attr("class","weatherPage invisiblePage");
				  $("#day4Page").attr("class","weatherPage invisiblePage");
				  $("#day5Page").attr("class","weatherPage invisiblePage");
				  $("div.controlContainer").css("background-color",$("#presentPage").css("background-color"));
				  $(".red-bar.handle h1").html($("#presentPage .dateContainer.rightCorner p:first-child").html());
				  $(".red-bar-corner-label").html("");
				  break;
				case 5:
				  $("#day-3Page").attr("class","weatherPage invisiblePage");
				  $("#day-2Page").attr("class","weatherPage invisiblePage");
				  $("#day-1Page").attr("class","weatherPage invisiblePage");
				  $("#presentPage").attr("class","weatherPage invisiblePage");
				  $("#day1Page").attr("class","weatherPage");
				  $("#day2Page").attr("class","weatherPage invisiblePage");
				  $("#day3Page").attr("class","weatherPage invisiblePage");
				  $("#day4Page").attr("class","weatherPage invisiblePage");
				  $("#day5Page").attr("class","weatherPage invisiblePage");
				  $("div.controlContainer").css("background-color",$("#day1Page").css("background-color"));				  
				  $(".red-bar.handle h1").html($("#day1Page .dateContainer.rightCorner p:first-child").html());
				  $(".red-bar-corner-label").html($("#day1Page .dateContainer.leftCorner p").html());
				  break;
				case 6:
				  $("#day-3Page").attr("class","weatherPage invisiblePage");
				  $("#day-2Page").attr("class","weatherPage invisiblePage");
				  $("#day-1Page").attr("class","weatherPage invisiblePage");
				  $("#presentPage").attr("class","weatherPage invisiblePage");
				  $("#day1Page").attr("class","weatherPage invisiblePage");
				  $("#day2Page").attr("class","weatherPage");
				  $("#day3Page").attr("class","weatherPage invisiblePage");
				  $("#day4Page").attr("class","weatherPage invisiblePage");
				  $("#day5Page").attr("class","weatherPage invisiblePage");	
				  $("div.controlContainer").css("background-color",$("#day2Page").css("background-color"));	
				  $(".red-bar.handle h1").html($("#day2Page .dateContainer.rightCorner p:first-child").html());
				  $(".red-bar-corner-label").html($("#day1Page .dateContainer.leftCorner p").html());
			  
				  break;
				case 7:
				  $("#day-3Page").attr("class","weatherPage invisiblePage");
				  $("#day-2Page").attr("class","weatherPage invisiblePage");
				  $("#day-1Page").attr("class","weatherPage invisiblePage");
				  $("#presentPage").attr("class","weatherPage invisiblePage");
				  $("#day1Page").attr("class","weatherPage invisiblePage");
				  $("#day2Page").attr("class","weatherPage invisiblePage");
				  $("#day3Page").attr("class","weatherPage");
				  $("#day4Page").attr("class","weatherPage invisiblePage");
				  $("#day5Page").attr("class","weatherPage invisiblePage");	
				  $("div.controlContainer").css("background-color",$("#day3Page").css("background-color"));	
				  $(".red-bar.handle h1").html($("#day3Page .dateContainer.rightCorner p:first-child").html());
				  $(".red-bar-corner-label").html($("#day1Page .dateContainer.leftCorner p").html());
			  
				  break;
				case 8:
				  $("#day-3Page").attr("class","weatherPage invisiblePage");
				  $("#day-2Page").attr("class","weatherPage invisiblePage");
				  $("#day-1Page").attr("class","weatherPage invisiblePage");
				  $("#presentPage").attr("class","weatherPage invisiblePage");
				  $("#day1Page").attr("class","weatherPage invisiblePage");
				  $("#day2Page").attr("class","weatherPage invisiblePage");
				  $("#day3Page").attr("class","weatherPage invisiblePage");
				  $("#day4Page").attr("class","weatherPage");
				  $("#day5Page").attr("class","weatherPage invisiblePage");	
				  $("div.controlContainer").css("background-color",$("#day4Page").css("background-color"));	
				  $(".red-bar.handle h1").html($("#day4Page .dateContainer.rightCorner p:first-child").html());	
				  $(".red-bar-corner-label").html($("#day1Page .dateContainer.leftCorner p").html());		  
				  break;
				case 9:
				  $("#day-3Page").attr("class","weatherPage invisiblePage");
				  $("#day-2Page").attr("class","weatherPage invisiblePage");
				  $("#day-1Page").attr("class","weatherPage invisiblePage");
				  $("#presentPage").attr("class","weatherPage invisiblePage");
				  $("#day1Page").attr("class","weatherPage invisiblePage");
				  $("#day2Page").attr("class","weatherPage invisiblePage");
				  $("#day3Page").attr("class","weatherPage invisiblePage");
				  $("#day4Page").attr("class","weatherPage invisiblePage");
				  $("#day5Page").attr("class","weatherPage");
				  $("div.controlContainer").css("background-color",$("#day5Page").css("background-color"));	
				  $(".red-bar.handle h1").html($("#day5Page .dateContainer.rightCorner p:first-child").html());
				  $(".red-bar-corner-label").html($("#day1Page .dateContainer.leftCorner p").html());				  
				  break;
				default:
				  break;
			}
		}
	});

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
	
	// 접힌부분 색깔, 크기 조정
	$(sPresentPage+" div.shadow-left").css("height",String($(document).width()/2.5+5)+"px");
	$(sPresentPage+" div.shadow-left").css("background-color",$(sPresentPage).css("background-color"));
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
	case 'partly-cloudy-night':
	  return 'I';
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
	case 'fog':
	  return 'F';
	  break;;
	case 'cloudy':
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
	// 구석삼각형 위치 설정	 
	$("div.arrow-left").css("margin-top", String(vertivalShiftCoefficient*2)+"px");
	$("div.arrow-left").css("margin-left", horizontalShiftCoefficient.toString()+"px");
	// 구석삼각형 색 설정	 
	var greenScale2 = 210-(localStorage.getItem('today_temp')-20)*8;
	$("div.arrow-left").css("border-right-color","rgb(240,"+String(greenScale2)+",0)");	


	// 구석삼각형 위치 설정	 
//	$("#test").css("margin-top", String(vertivalShiftCoefficient*2)+"px");
//	$("#test").css("margin-left", horizontalShiftCoefficient.toString()+"px");
	$("div.division.shadow-left").css("margin-top", String(vertivalShiftCoefficient*0.85)+"px");
	$("div.division.shadow-left").css("margin-left", (horizontalShiftCoefficient*2.5).toString()+"px");
	$("div.division.shadow-left").css("-webkit-transform", "rotate(45deg)");
	$("div.division.shadow-left").css("height",String($(document).width()/2+5)+"px");

	// 개별페이지 크기 (컨트롤 파트제외)
	$(".pageContainer").css("height",String($(window).height()-100)+ "px");


}