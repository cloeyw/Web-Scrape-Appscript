function parser() {
  /** URLs */
  var html = "http://tennisabstract.com/reports/atpRankings.html";

  /** Fetch Site Content */
  var resp = UrlFetchApp.fetch(html).getContentText();
  var $ = Cheerio.load(resp);

  /** Fetch header content */
  // Without using .toArray().map(...) method
  var header = $("#reportable > thead > tr > th");
  console.log(header);

  /** Push header content into array */
  // Iterate through each subtag
  var arr_header = [];
  header.each(function () {
    arr_header.push($(this).text());
  });

  // Push "Website" header
  arr_header.push("Website");

  // Add to active spreadsheet
  SpreadsheetApp.getActiveSheet()
    .getRange(1, 1, 1, arr_header.length)
    .setValues([arr_header]);

  /** Fetch body content */
  var body = $("#reportable > tbody > tr");

  // Create global array to store subarrays
  var global_body = [];

  // Iterate through each subtag to get each row
  body.each(function () {
    arr_body = [];
    var parent = $(this);
    parent.find("td").each(function () {
      arr_body.push($(this).text());
    });
    arr_body.push($(this).find("a").attr("href"));
    global_body.push(arr_body);
  });

  // Add to active spreadsheet
  SpreadsheetApp.getActiveSheet()
    .getRange(2, 1, global_body.length, global_body[0].length)
    .setValues(global_body);

  // .toArray() method:  var data = $('table.snapshot-table2').find('td').toArray().map(x => $(x).text());
}
