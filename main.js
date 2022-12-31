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
});
y3.addEventListener("input", function(){
  circle.setAttribute("cy", 10 * (y3_val.value = y3.value));
});
q3.addEventListener("input", function(){
  q3_val.value = q3.value;
});
x3_val.addEventListener("input", function(){
  circle.setAttribute("cx", 10 * (x3.value = x3_val.value));
});
y3_val.addEventListener("input", function(){
  circle.setAttribute("cy", 10 * (y3.value = y3_val.value));
});
q3_val.addEventListener("input", function(){
  q3.value = q3_val.value;
});
const x_max = 10;
const y_max = 10;
const block_size = 10;

function getChild(x, y) {
  return coord_nodes[x * 10 + y];
}
function run() {
  const x3 = Number(circle.getAttribute("cx")) / 10;
  const y3 = Number(circle.getAttribute("cy")) / 10;
  const Q3 = Number(q3.value);
  console.log(x3, y3, Q3);
  var vec = new cartesian_complex();
  for (var x1=0;x1 < x_max;x1++) {
    for (var y1 = 0;y1<y_max;y1++) {
      const mynode = getChild(x, y);
      for (var node of tbody.childNodes) {
        if (!node.firstElementChild) 
          continue;
        const Q1 = Number(node.childNodes[3].innerText);
        const x_diff = x3 - x1;
        const y_diff = y3 - y1;
        const r = Math.hypot(x_diff, y_diff);
        const K = 1 /*9e+9*/;
        const F = K * (Q1 * Q3) / (r * r);
        const theta = Math.atan2(x_diff, y_diff);
        vec.add2(new polar_complex(F, theta));
        console.log(vec.toString());
        vec.reset();
      }
    }
  }
}
window.onload = function() {
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
}
svg.addEventListener("click", function(event) {
  var tmpx = (event.clientX - 20) / 5;
  x3.value = x3_val.value = tmpx / 10;
  circle.setAttribute("cx", tmpx);
  var tmpy = (event.clientY - 20) / 5;
  y3.value = y3_val.value = tmpy / 10;
  circle.setAttribute("cy", tmpy);
}, false);

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
}

addQ("Q1", 5, 5, 1);
