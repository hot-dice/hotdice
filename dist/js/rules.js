'use strict';

const table = document.querySelector('#score table');

scoreTuples.forEach(tuple => {
  let row = document.createElement('tr');
  let td = document.createElement('td');
  let td2 = document.createElement('td');
  td.innerText = tuple[0];
  td2.innerText = tuple[1];
  row.append(td);
  row.append(td2);
  table.append(row);
});