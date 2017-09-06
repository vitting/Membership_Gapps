function Sslogger() {
  var LOGGER_SPREADSHEET_NAME = "LoggerVolleyballFormular";
  var LOGGER_SPREADSHEET_ID = "logger_spreadsheet_id";
  
  this.getPropSsId = function() {
    var prop = PropertiesService.getScriptProperties();
    var ssId = prop.getProperty(LOGGER_SPREADSHEET_ID);
    return ssId;
  }
  
  // Move a file to current folder
  this.moveFile = function(id) {
    var f = FormApp.getActiveForm();
    
    try {
      var file = DriveApp.getFileById(f.getId());
      var parentFolder = file.getParents().next();
      var ssFile = DriveApp.getFileById(id);
      DriveApp.getFolderById(parentFolder.getId()).addFile(ssFile);
      DriveApp.getRootFolder().removeFile(ssFile);
    }
    catch(e) {
      Logger.log("Error moveFile");
      Logger.log(e);
    }
  }  
  
  this.createLoggerSpreadSheet = function() {
    var ss = SpreadsheetApp.create(LOGGER_SPREADSHEET_NAME);
    ss.getActiveSheet().getRange(1, 1).setValue("Timestamp");
    ss.getActiveSheet().getRange(1, 2).setValue("Value");
    var ssId = ss.getId();
    moveFile(ssId);
    var prop = PropertiesService.getScriptProperties();
    prop.setProperty(LOGGER_SPREADSHEET_ID, ssId);
    
    return ss;
  }
  
  this.checkSpreadSheet = function() {
    var ssId = this.getPropSsId();
    var ss;
    if (!ssId) {
      return this.createLoggerSpreadSheet();
    } 
    
    try {
      ss = SpreadsheetApp.openById(ssId);  
    }
    catch(e) {
      Logger.log(e);
      ss = this.createLoggerSpreadSheet();
    }
    finally {
      return ss;
    }
  }
  
  this.ss = this.checkSpreadSheet();
  
  this.log = function (data) {
    var lastRow = this.ss.getActiveSheet().getDataRange().getLastRow();
    var sheet = this.ss.getActiveSheet();
    var value = data;
    if (typeof data === "object") {
      value = JSON.stringify(data);
    }
    var date = Utilities.formatDate(new Date(Date.now()), "CET", "dd-MM-yyyy HH:mm:ss");
    sheet.getRange(lastRow + 1, 1).setValue(date);
    sheet.getRange(lastRow + 1, 2).setValue(value);
  }
}