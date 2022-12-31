'use strict';
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
var qcount = 0;
var cur_edit_target = null;
var div = document.getElementById("edit");
const x_max = 10;
const y_max = 10;
const block_size = 10;

function setX(node) {
  const x = node.value;
  circle.setAttribute("cx", 10 * x);
  x3_val.value = x;
  x3.value = x;
  cur_edit_target.childNodes[1].innerText = x;
  run();
}
function setY(node) {
  const y = node.value;
  circle.setAttribute("cy", 10 * y);
  y3_val.value = y;
  y3.value = y;
  cur_edit_target.childNodes[2].innerText = y;
  run();
}
function setQ(node) {
  const Q = node.value;
  q3.value = Q;
  q3_val.value = Q;
  cur_edit_target.childNodes[3].innerText = Q;
  run();
}
function run() {
  if (!tbody.hasChildNodes()) {
    for (var i = 0;i < x_max * y_max;++i) {
      coord_nodes[i].style.visibility = 'hidden';
    }
    return;
  }
  const x3 = Number(circle.getAttribute("cx")) / 10;
  const y3 = Number(circle.getAttribute("cy")) / 10;
  const Q3 = Number(q3.value);
  var count = 0;
  var vec = new cartesian_complex();
  for (var x1=0;x1 < x_max;x1++) {
    for (var y1 = 0;y1<y_max;y1++) {
      const mynode = coord_nodes[count++];
      for (var node of tbody.childNodes) {
        if (!node.hasChildNodes())
          continue;
        const Q1 = Number(node.childNodes[3].innerText);
        const x_diff = x3 - x1;
        const y_diff = y3 - y1;
        if (x_diff == 0 || y_diff == 0) {
          mynode.style.visibility = 'hidden';
          continue;
        }
        mynode.style.visibility = 'visible';
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
function onClickDelete(e) {
  //             button          td         tr
  const target = e.currentTarget.parentNode.parentNode;
  if (Object.is(target, cur_edit_target)) {
    div.style.visibility = 'hidden';
    cur_edit_target = null;
  }
  tbody.removeChild(target);
  run();
}
function onClickEdit(e) {
  //                button          td         tr
  cur_edit_target = e.currentTarget.parentNode.parentNode;
  x3.value = x3_val.value = cur_edit_target.childNodes[1].innerText;
  y3.value = y3_val.value = cur_edit_target.childNodes[3].innerText;
}
document.querySelector("button").addEventListener("click", function() {
  addQ('Q' + (++qcount).toString(), 1, 1);
}, false);
x3.addEventListener("input", () => setX(x3));
y3.addEventListener("input", () => setY(y3));
q3.addEventListener("input", () => setQ(q3));
x3_val.addEventListener("input", () => setX(x3_val));
y3_val.addEventListener("input", () => setY(y3_val));
q3_val.addEventListener("input", () => setQ(q3_val));
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
  var elem_btn = document.createElement("td");
  var elem_edit = document.createElement("td");
  var btn = document.createElement("button");
  var edit_btn = document.createElement("button");
  var tr = document.createElement("tr");
  btn.innerText = "🗑";
  btn.style.color = 'red';
  btn.addEventListener('click', onClickDelete);
  elem_btn.appendChild(btn);
  edit_btn.innerText = "✎";
  edit_btn.style.color = 'blue';
  edit_btn.addEventListener('click', onClickEdit);
  elem_edit.appendChild(edit_btn);
  elem_name.innerText = name;
  elem_q.innerText = q;
  elem_x.innerText = x;
  elem_y.innerText = y;
  tr.appendChild(elem_name);
  tr.appendChild(elem_x);
  tr.appendChild(elem_y);
  tr.appendChild(elem_q);
  tr.appendChild(elem_edit);
  tr.appendChild(elem_btn);
  tbody.appendChild(tr);
  cur_edit_target = tr;
  div.style.visibility = 'visible';
  run();
}
svg.addEventListener("click", function(event) {
  var tmpx = (event.clientX - 20) / 5;
  x3.value = x3_val.value = tmpx / 10;
  circle.setAttribute("cx", tmpx);
  var tmpy = (event.clientY - 20) / 5;
  y3.value = y3_val.value = tmpy / 10;
  circle.setAttribute("cy", tmpy);
  if (cur_edit_target) {
    cur_edit_target.childNodes[1].innerText = x3.value;
    cur_edit_target.childNodes[2].innerText = y3.value;
  }
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
