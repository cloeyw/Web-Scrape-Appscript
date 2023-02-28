function getData() {
  /** URLs */
  var html = "http://tennisabstract.com/reports/atpRankings.html";

  /** Fetch Site Content */
  var websiteContent = UrlFetchApp.fetch(html).getContentText();

  /** Extract Header Data */
  // Using String Methods
  var header_start = websiteContent.indexOf("<thead>");
  var header_end = websiteContent.lastIndexOf("</thead>");
  var header_data = websiteContent.slice(header_start, header_end);

  // Using Regex
  var header = header_data.match(/([A-Z])\w+/gm);
  var header1 = header.splice(0, 1); // removing the rank because the spreadsheet has its own index
  var new_header = header.push("Website");
  Logger.log(header);

  // var header = [JSON.parse(matches[0])];
  // var rows = matches.slice(2, matches.length);

  /** Setting the headers of the table */
  SpreadsheetApp.getActiveSheet()
    .getRange(1, 1, 1, new_header)
    .setValues([header]);

  /** Extract Body Data */
  var body_start = websiteContent.indexOf('<td align="right">1</td>');
  var body_end = websiteContent.lastIndexOf("</td>");
  var body_data = websiteContent.slice(body_start, body_end);

  // Getting the website
  var sites = body_data.match(/(https:[^"]+)/gm);

  // Getting the name of player
  var player = body_data.match(/(?<=p=)([^"]+)/gm);

  // Getting the country code
  var country = body_data.match(/[A-Z]{3}/gm);

  // Getting the birthdates
  var birthdates = body_data.match(/(\d{4}-\d{2}-\d{2})/gm);

  /** Create function to sub arrays into global array */
  global = [];
  function addSubArray(p, c, b, s) {
    for (var i = 0; i < p.length; i++) {
      global.push([p[i], c[i], b[i], s[i]]);
    }
  }

  addSubArray(player, country, birthdates, sites);

  /** Populate the sheet with relevant data  */
  SpreadsheetApp.getActiveSheet()
    .getRange(2, 1, global.length, global[0].length)
    .setValues(global);

  /** Add last modified date to column E in row 1 */
  var update_start = websiteContent.indexOf("Updated");
  var update_end = websiteContent.indexOf("</i>");
  var update = [websiteContent.slice(update_start, update_end)];
  SpreadsheetApp.getActiveSheet().getRange(1, 5, 1, 1).setValues([update]);
}
