/**
 * main.js - main interface to user, controls SVG and DOM
 * https://github.com/ianfun/electric-field
 * Copyright, 2022, ianfun.
 */
var x3 = document.getElementById("x");
var x3_val = document.getElementById("x_val");
var y3 = document.getElementById("y");
var y3_val = document.getElementById("y_val");
var q3 = document.getElementById("q");
var q3_val = document.getElementById("q_val");
var svg = document.querySelector("svg");
var circle = svg.firstElementChild;
var coord_nodes;
var coord = svg.querySelector("g");
var tbody = document.querySelector("tbody");

x3.addEventListener("input", function(){
  x3_val.value = x3.value;
  circle.setAttribute("cx", 10 * x3.value);
  run();
});
y3.addEventListener("input", function(){
  circle.setAttribute("cy", 10 * (y3_val.value = y3.value));
  run();
});
q3.addEventListener("input", function(){
  q3_val.value = q3.value;
  run();
});
x3_val.addEventListener("input", function(){
  circle.setAttribute("cx", 10 * (x3.value = x3_val.value));
  run();
});
y3_val.addEventListener("input", function(){
  circle.setAttribute("cy", 10 * (y3.value = y3_val.value));
  run();
});
q3_val.addEventListener("input", function(){
  q3.value = q3_val.value;
  run();
});
const x_max = 10;
const y_max = 10;
const block_size = 10;

function run() {
  const x3 = Number(circle.getAttribute("cx")) / 10;
  const y3 = Number(circle.getAttribute("cy")) / 10;
  const Q3 = Number(q3.value);
  var count = 0;
  var vec = new cartesian_complex();
  for (var x1=0;x1 < x_max;x1++) {
    for (var y1 = 0;y1<y_max;y1++) {
      const mynode = coord_nodes[count++];
      for (var node of tbody.childNodes) {
        if (!node.firstElementChild)
          continue;
        const Q1 = Number(node.childNodes[3].innerText);
        const x_diff = x3 - x1;
        const y_diff = y3 - y1;
        const r = Math.hypot(x_diff, y_diff);
        /* Actually K is 9e+9, we use 1 for scalability and display reasons */;
        const F = (Q1 * Q3) / (r * r);
        const theta = Math.atan2(x_diff, y_diff);
        vec.add2(new polar_complex(F, theta));
        if (vec.x > 5)
          vec.x = 5;
        if (vec.y > 5)
          vec.y = 5;
        const tmp1 = x1 * block_size;
        const tmp2 = y1 * block_size;
        mynode.setAttribute("x1", tmp1 - vec.x);
        mynode.setAttribute("y1", tmp2 - vec.y);
        mynode.setAttribute("x2", tmp1 + vec.x);
        mynode.setAttribute("y2", tmp2 + vec.y);
        vec.reset();
      }
    }
  }
}
function addQ(name, x, y, q = 1) {
  for (var node of tbody.childNodes) {
    if (node.firstElementChild && name == node.firstElementChild.innerText) {
      return addQ(name + '(1)', x, y, q);
    }
  }
  var elem_name = document.createElement("td");
  var elem_q = document.createElement("td");
  var elem_x = document.createElement("td");
  var elem_y = document.createElement("td");
  var tr = document.createElement("tr");
  elem_name.innerText = name;
  elem_q.innerText = q;
  elem_x.innerText = x;
  elem_y.innerText = y;
  tr.appendChild(elem_name);
  tr.appendChild(elem_x);
  tr.appendChild(elem_y);
  tr.appendChild(elem_q);
  tbody.appendChild(tr);
  var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", x * 10);
  circle.setAttribute("cy", y * 10);
  circle.setAttribute("r", 1);
  circle.style.stroke = 'blue';
  coord.appendChild(circle);
  run();
}
svg.addEventListener("click", function(event) {
  var tmpx = (event.clientX - 20) / 5;
  x3.value = x3_val.value = tmpx / 10;
  circle.setAttribute("cx", tmpx);
  var tmpy = (event.clientY - 20) / 5;
  y3.value = y3_val.value = tmpy / 10;
  circle.setAttribute("cy", tmpy);
  run();
}, false);
for (var x=0;x < x_max;x++) {
  for (var y = 0;y<y_max;y++) {
    var elem = document.createElementNS("http://www.w3.org/2000/svg", "line");
    elem.style.stroke = "black";
    const tmp1 = x * block_size;
    const tmp2 = y * block_size;
    elem.setAttribute("x1", tmp1 - 2);
    elem.setAttribute("x2", tmp1 + 2);
    elem.setAttribute("y1", tmp2 - 2);
    elem.setAttribute("y2", tmp2 + 2);
    coord.appendChild(elem);
  }
}
coord_nodes = coord.childNodes;
addQ("Q1", 5, 5, 1);
