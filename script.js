/* global $ d3 */
const url='https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
const svgWidth = $(window).width() > 1000 ? 700 : $(window).width()*0.8;  // width of plot area
const svgHeight = svgWidth*2/3;  //height of plot area
const legendLeft = ($(window).width() - svgWidth)/2 + svgWidth-200;

console.log($(window).width() > 1000 ? 700 : $(window).width()*0.8 );

$.get(url, function(result) {
    handleData(result);
}, 'json')
    .fail(function(){ alert('error') });

function handleData(data) {
  console.log(data);
    const title = "Tour de France: 35 Fastest times up Alpe d'Huez";
    const subtitle = "Normalized to 13.8km distance";
    
    let titleDiv = d3.select(".title");
    titleDiv.append("h3")
        .html(title);
    titleDiv.append("p")
        .html(subtitle);
     
    const margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;

    // set the ranges
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
              
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    let svg = d3.select(".chart").append("svg")
        .attr("class", "chart-area")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

    x.domain([1993, 2016]);
    y.domain([36.5, d3.max(data, function(d) { return d.Seconds/60; })]);
    
    // add the scatter plot
    let dots = svg.selectAll("dot")
        .data(data)
      .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function(d) { return x(d.Year); })
        .attr("cy", function(d) { return y(d.Seconds/60); })
        .style("fill", function(d) {
          if (!d.Doping) {return "green";}
          else {return "red";}
        });
    
    // add the x Axis
    const xAxis = d3.axisBottom(x)
            .ticks(5)
            .tickFormat(d3.format(.4));
            
    const yAxis = d3.axisLeft(y)
            .ticks(5)
            .tickFormat(function(d) {
                return minutesAndSeconds(d)
            });
    
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
    
    // add the y Axis
    svg.append("g")
      .call(yAxis);
      
    let legend = d3.select(".chart").append("div").attr("class", "legend");
    legend.style("top", "-100px").style("left", legendLeft + 'px');
    legend.append("small")
        .append("span").attr("class", "red")
        .append("span").html(" : With doping allegations<br/>");
    legend.append("small")
        .append("span").attr("class", "green")
        .append("span").html(" : No allegations");

    d3.select(".green").insert("svg", ":first-child")
        .attr("width", 10)
        .attr("height", 10)
      .append("circle")
        .attr("r", 5)
        .attr("cx", 5)
        .attr("cy", 5)
        .style("fill", "green");
        
    d3.select(".red").insert("svg", ":first-child")
        .attr("width", 10)
        .attr("height", 10)
      .append("circle")
        .attr("r", 5)
        .attr("cx", 5)
        .attr("cy", 5)
        .style("fill", "red");
      
    //tooltip
    let toolTip = d3.select(".contents").append("div").attr("class", "toolTip");
    
    dots.on("mousemove", function(d){
            toolTip.style("left", d3.event.pageX+10+"px");
            toolTip.style("top", d3.event.pageY-25+"px");
            toolTip.style("display", "inline-block");
            toolTip.html((d.Name)+"<br>"+d.Time);
        });
    dots.on("mouseout", function(d){
            toolTip.style("display", "none");
        });
}

const minutesAndSeconds = (time) => {
  let minutes = (Math.floor(time)).toString();
  let seconds = ((time-minutes)*60).toString();
                
  if (seconds.length < 2) { seconds = '0' + seconds; }
      
  return minutes + ':' + seconds;
}