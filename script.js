const urlMovie = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";
const category = ["Action", "Comedy", "Biography", "Animation", "Adventure", "Family", "Drama"];

const w = 1070;
const h = 1250;
const padding = 150;

//where my tree will be displayed
const svg = d3.select("#dataviz").
append("svg").
attr("width", w).
attr("height", h).
attr("margin", padding);

//API request here
d3.json(urlMovie).
then(dataset => {
  //this draws the treemap
  let root = d3.hierarchy(dataset).sum(d => d.value); // Here the size of each leaf is given by the 'value' field in input data
  let treemap = d3.treemap().
  size([w - padding, h]).
  padding(1);
  treemap(root); //need to call it here to draw

  //tooltip part
  let tooltip = d3.select("body").
  append("div").
  attr("id", "tooltip");

  //cell container
  const cell = svg.
  selectAll("g").
  data(root.leaves()).
  enter().
  append("g");

  //all my rectangles
  cell.
  append("rect").
  attr("class", "tile").
  attr('x', d => d.x0).
  attr('y', d => d.y0).
  attr('width', d => d.x1 - d.x0).
  attr('height', d => d.y1 - d.y0).
  attr("data-name", d => d.data.name).
  attr("data-category", d => d.data.category) // Action, Comedy, Biography, Animation, Adventure, Family, Drama
  .attr("data-value", d => d.data.value).
  attr("fill", d => {
    switch (d.data.category) {
      case "Action":
        return d3.schemeSet3[4];
        break;
      case "Comedy":
        return d3.schemeSet3[0];
        break;
      case "Biography":
        return d3.schemeSet3[2];
        break;
      case "Animation":
        return d3.schemeSet3[6];
        break;
      case "Adventure":
        return d3.schemeSet3[3];
        break;
      case "Family":
        return d3.schemeSet3[1];
        break;
      case "Drama":
        return d3.schemeSet3[10];
        break;
      default:
        return;}

  }).
  on("mouseover", (event, d) => {
    tooltip.html(() => {
      let dollarUSLocale = Intl.NumberFormat('en-US');
      return d.data.name +
      "<br>Genre: " + d.data.category +
      "<br>Value: $" + dollarUSLocale.format(d.data.value);
    });

    tooltip.transition().
    style("visibility", "visible").
    style("cursor", "default").
    style("left", event.pageX + "px").
    style("top", event.pageY - 100 + "px").
    attr("data-value", d.data.value);
  }).
  on("mouseout", () => tooltip.style("visibility", "hidden"));

  //All the texts inside the cells
  svg.
  selectAll("text").
  data(root.leaves()).
  enter().
  append("text").
  selectAll("tspan") /* positions new lines of text in relation to the previous line of text. And by using dx or dy within each of these spans, we can position the word in relation to the word before it.*/.
  data(d => {
    const movieSplit = d.data.name.split(/(?=[A-Z][^A-Z])/g); //splits the name of movie
    return movieSplit.map(name => {
      return {
        text: name,
        x0: d.x0, // keeps x0 reference
        y0: d.y0 // keeps y0 reference
      };
    });
  }) //you can enter data() twice inside one "component"
  .enter().
  append("tspan").
  attr("x", d => d.x0 + 4) //+4 to adjust position (more right)
  .attr("y", (d, i) => d.y0 + 13 + i * 12) // +13 to adjust position (lower)
  .text(d => d.text).
  attr("font-size", 12.5).
  attr("letter-spacing", 0.3).
  attr("fill", "black");

  //legend part
  let legendBox = svg.append("g").
  attr("id", "legend");

  let legend = legendBox.selectAll("rect").
  data(category).
  enter().
  append("rect").
  attr("class", "legend-item").
  attr("x", w - 140).
  attr("y", (d, i) => 110 + i * 30) // 310 is where the first rect appears. 30 is the distance between dots
  .attr("width", 20).
  attr("height", 20).
  attr("fill", d => {switch (d) {
      case "Action":
        return d3.schemeSet3[4];
        break;
      case "Comedy":
        return d3.schemeSet3[0];
        break;
      case "Biography":
        return d3.schemeSet3[2];
        break;
      case "Animation":
        return d3.schemeSet3[6];
        break;
      case "Adventure":
        return d3.schemeSet3[3];
        break;
      case "Family":
        return d3.schemeSet3[1];
        break;
      case "Drama":
        return d3.schemeSet3[10];
        break;
      default:
        return;}

  });

  svg.append("text").
  attr("x", w - 140).
  attr("y", 100).
  text("Legend: ").
  attr("font-size", 20);

  svg.selectAll("g").
  data(category).
  append("text").
  attr("x", w - 115).
  attr("y", (d, i) => 125 + i * 30).
  text((d, i) => d).
  attr("font-size", 15);

});