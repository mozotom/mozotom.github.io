// Pivot table functions
// Tomasz Mozolewski @2006

var row_order="ascending" // or "descending"
var col_order="ascending" // or "descending"

var row_data_type="text" // or "number"
var col_data_type="text" // or "number"

var row_order_by="name" // or "value"
var col_order_by="name" // or "value"

var table_name=""
var operation="sum" // or "count"

var data = new Array()
var rows = new Array()
var cols = new Array()

var row_order_seq = new Array()
var col_order_seq = new Array()

var row_totals = new Array()
var col_totals = new Array()
var table_total = 0

function add_data(row, col, value) {
  data[data.length] = new Array(row, col, value)
  rows[rows.length] = row
  cols[cols.length] = col
}

function strComp(a, b) {
  var a = "" + a
  var b = "" + b
  
  var len = Math.min(a.length, b.length);
  var i
  
  for (i=0; i<len; ++i) {
    if (a.charCodeAt(i) != b.charCodeAt(i)) break;
  }

  if (i<len) {
    return a.charCodeAt(i) - b.charCodeAt(i)
  } else {
    return a.length - b.length
  }
}

function numComp(a, b) {
  return a - b
}

function getUniq(arr) {
  var result = new Array()
  var x = arr.sort(strComp)
  var i
  
  if (x.length > 0) {
    result[0] = x[0]
    for (i=1; i<x.length; ++i) {
      if (x[i] != x[i-1]) result[result.length] = x[i]
    }
  }

  return result
}

function array_find(arr, elm) {
  var i = 0
  var j = arr.length - 1
  var k

  while (i < j) {
    k = Math.floor((i + j) / 2)
    if (strComp(elm, arr[k]) <= 0) j = k; else i = k + 1
  }

  return i
}

function summarize_data(data, rows, cols) {
  var result = new Array()
  var i, r, c, value
  
  for (i=0; i<data.length; ++i) {
    r = array_find(rows, data[i][0])
    c = array_find(cols, data[i][1])

    if (!result[r]) result[r] = new Array()
    if (!result[r][c]) result[r][c] = 0
    if (!row_totals[r]) row_totals[r] = 0
    if (!col_totals[c]) col_totals[c] = 0
    
    if (operation == "sum") value = parseFloat(data[i][2])
    if (operation == "count") value = 1
    
    result[r][c] += value
    row_totals[r] += value
    col_totals[c] += value
    table_total += value
  }

  return result
}

function pivot_sort_rows(i, j) {
  var result = 0
  var mult = 1
  
  if (row_order == "descending") mult = -1;
  if (row_order_by == "name") {
    if (row_data_type == "text") result = strComp(rows[i], rows[j])
    if (row_data_type == "number") result = numComp(rows[i], rows[j])
  }
  if (row_order_by == "value") result = row_totals[i] - row_totals[j]
  
  return result * mult
}

function pivot_sort_cols(i, j) {
  var result = 0
  var mult = 1
  
  if (col_order == "descending") mult = -1;
  if (col_order_by == "name") {
    if (col_data_type == "text") result = strComp(cols[i], cols[j])
    if (col_data_type == "number") result = numComp(cols[i], cols[j])
  }
  if (col_order_by == "value") result = col_totals[i] - col_totals[j]
  
  return result * mult
}

function calc_data() {
  var i
  rows = getUniq(rows)
  cols = getUniq(cols)

  data = summarize_data(data, rows, cols)
  
  for (i=0; i<rows.length; ++i) row_order_seq[i] = i
  for (i=0; i<cols.length; ++i) col_order_seq[i] = i

  row_order_seq = row_order_seq.sort(pivot_sort_rows)
  col_order_seq = col_order_seq.sort(pivot_sort_cols)
}

function show_table() {
  calc_data()
  var i, j, value

  var result = ""
  result += "<table border=\"1\">"
  
  result += "<tr>"
  result += "<th>" + table_name + "</th>"
  for (i=0; i<cols.length; ++i) result += "<th>" + cols[col_order_seq[i]] + "</th>"
  result += "<th>Total</th>"
  result += "</tr>"
  
  for (i=0; i<rows.length; ++i) {
    result += "<tr>"
    result += "<th style=\"text-align: left\">" + rows[row_order_seq[i]] + "</th>"
    for (j=0; j<cols.length; ++j) {
	  value = data[row_order_seq[i]][col_order_seq[j]]
	  if (!value) value = "&nbsp;"
      result += "<td style=\"text-align: right\">" + value + "</td>"
    }
    result += "<th style=\"text-align: right\">" + row_totals[row_order_seq[i]] + "</th>"
    result += "</tr>"
  }

  result += "<tr>"
  result += "<th style=\"text-align: left\">Total</th>"
  for (i=0; i<cols.length; ++i) result += "<th style=\"text-align: right\">" + col_totals[col_order_seq[i]] + "</th>"
  result += "<th style=\"text-align: right\">" + table_total + "</th>"
  result += "</tr>"

  result += "</table>"

  pivot_table.innerHTML = result
}
