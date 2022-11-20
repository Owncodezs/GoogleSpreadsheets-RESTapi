var sheetname = "Sheet1";
var doc = SpreadsheetApp.openById('1oRt3qBQRpj4CvRQOGk4zc1hZNpCuC-9Bbs25-oTVIXo');
var sheet = doc.getSheetByName(sheetname);
function doGet(e){
  var action=e.parameter.action;
  if(action=='insert'){
    return doInsert(e);
  }else if(action=='view'){
    return doView(e);
  }  
}
function doPost(e) {
  var action=e.parameter.action;
  if(action=='insert'){
    return doInsert(e);
  }else if(action=='view'){
    return doView(e);
  }  
}
function doInsert(e){
  var headers=getHeaderRow_(doc,sheetname)
  var newdata=[[]]
  for (var i=0;i<headers.length;i++){
    var par =eval("e.parameter."+headers[i])
    newdata[0].push(par);
  }
  var rowData =sheet.appendRow(newdata[0]);
  return ContentService.createTextOutput(JSON.stringify({e})).setMimeType(ContentService.MimeType.JSON);

}

function getHeaderRow_(ss, sheetName) {
    var sh = ss.getSheetByName(sheetName);
    return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
}

function doView(e){
  var query_city = e.parameter.city;
  var lastrow = sheet.getLastRow();
  var lastcol = sheet.getLastColumn();
  var rows = [];
  var range = sheet.getRange(1,1,lastrow,lastcol).getValues();
  for(var i = 1, l= range.length; i < l ; i++){
    var dataRow = range[i];
    var record = {};
    for(var j = 0; j < lastcol; j++){
      record[range[0][j]] = dataRow[j];   
    }
    rows.push(record);
  }
  
  if (query_city != null ){
    var qval = rows.filter(a => a["city"] == query_city );
    return ContentService.createTextOutput(JSON.stringify({data:qval})).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({data:rows})).setMimeType(ContentService.MimeType.JSON);
}
function setup(){
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  PropertiesService.getScriptProperties().setProperty("key", doc.getId());
}
