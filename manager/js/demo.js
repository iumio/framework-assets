type=["","info","success","warning","danger"],demo={initPickColor:function(){$(".pick-class-label").click(function(){var t=$(this).attr("new-class"),i=$("#display-buttons").attr("data-class"),s=$("#display-buttons");if(s.length){var a=s.find(".btn");a.removeClass(i),a.addClass(t),s.attr("data-class",t)}})},initChartist:function(){var t={lineSmooth:!1,low:0,high:800,showArea:!0,height:"245px",axisX:{showGrid:!1},lineSmooth:Chartist.Interpolation.simple({divisor:3}),showLine:!1,showPoint:!1};Chartist.Line("#chartHours",{labels:["9:00AM","12:00AM","3:00PM","6:00PM","9:00PM","12:00PM","3:00AM","6:00AM"],series:[[287,385,490,492,554,586,698,695,752,788,846,944],[67,152,143,240,287,335,435,437,539,542,544,647],[23,113,67,108,190,239,307,308,439,410,410,509]]},t,[["screen and (max-width: 640px)",{axisX:{labelInterpolationFnc:function(t){return t[0]}}}]]);Chartist.Bar("#chartActivity",{labels:["Jan","Feb","Mar","Apr","Mai","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],series:[[542,443,320,780,553,453,326,434,568,610,756,895],[412,243,280,580,453,353,300,364,368,410,636,695]]},{seriesBarDistance:10,axisX:{showGrid:!1},height:"245px"},[["screen and (max-width: 640px)",{seriesBarDistance:5,axisX:{labelInterpolationFnc:function(t){return t[0]}}}]]);Chartist.Pie("#chartPreferences",{series:[[25,30,20,25]]},{donut:!0,donutWidth:40,startAngle:0,total:100,showLabel:!1,axisX:{showGrid:!1}}),Chartist.Pie("#chartPreferences",{labels:["62%","32%","6%"],series:[62,32,6]})}};