/****************************************************************************************
* UTILITY FUNCTIONS
****************************************************************************************/

function useDevelopmentMode() {
  var devMode = getDevelopmentMode()
  var value = false;
  if (devMode && devMode === "true") value = true;
  return value;
}

function saveDevelopmentMode(useDevelopmentMode) {
  var prop = PropertiesService.getScriptProperties();
  prop.setProperty(PROP_DEVELOPMENT_MODE, useDevelopmentMode);
}

function getDevelopmentMode() {
  var prop = PropertiesService.getScriptProperties();
  return prop.getProperty(PROP_DEVELOPMENT_MODE);
}

function deleteDevelopmentMode() {
  var prop = PropertiesService.getScriptProperties();
  prop.deleteProperty(PROP_DEVELOPMENT_MODE);
}

function saveDevelopmentMail(mailaddress) {
  var prop = PropertiesService.getScriptProperties();
  prop.setProperty(PROP_DEVELOPMENT_MAIL, mailaddress);
}

function getDevelopmentMail() {
  var prop = PropertiesService.getScriptProperties();
  var value = prop.getProperty(PROP_DEVELOPMENT_MAIL);
  if (!value || value === "") {
    value = DEVELOPMENT_EMAIL;
  }
  return value;
}

function deleteDevelopmentMail() {
  var prop = PropertiesService.getScriptProperties();
  prop.deleteProperty(PROP_DEVELOPMENT_MAIL);
}

function getMembershipFee() {
  var prop = PropertiesService.getScriptProperties();
  return JSON.parse(prop.getProperty(PROP_MEMEBERSHIP_FEE));
}

function saveMembershipFee(fee) {
  var prop = PropertiesService.getScriptProperties();
  prop.setProperty(PROP_MEMEBERSHIP_FEE, JSON.stringify(fee));
}

function deleteMembershipFee() {
  var prop = PropertiesService.getScriptProperties();
  prop.deleteAllProperties(PROP_MEMEBERSHIP_FEE);
}

function saveSendConfirmationMail(sendConfirmationMailToUser) {
  var prop = PropertiesService.getScriptProperties();
  prop.setProperty(PROP_SEND_CONFIRMATION_MAIL, sendConfirmationMailToUser);
}

function getSendConfirmationMail() {
  var prop = PropertiesService.getScriptProperties();
  return prop.getProperty(PROP_SEND_CONFIRMATION_MAIL);
}

function deleteSendConfirmationMail() {
  var prop = PropertiesService.getScriptProperties();
  prop.deleteProperty(PROP_SEND_CONFIRMATION_MAIL);
}

function saveSetupAlertValue(value) {
  var prop = PropertiesService.getScriptProperties();
  prop.setProperty(PROP_SETUPALERT, value);
}

function getSetupAlertValue() {
  var prop = PropertiesService.getScriptProperties();
  return JSON.parse(prop.getProperty(PROP_SETUPALERT));
}

function deleteSetupAlertValue() {
  var prop = PropertiesService.getScriptProperties();
  prop.deleteProperty(PROP_SETUPALERT);
}

function deleteSetupRunValue() {
  var prop = PropertiesService.getScriptProperties();
  prop.deleteProperty(PROP_SETUPRUN);
}

function saveSetupRunValue(value) {
  var prop = PropertiesService.getScriptProperties();
  prop.setProperty(PROP_SETUPRUN, value);
}

function getSetupRunValue() {
  var prop = PropertiesService.getScriptProperties();
  return JSON.parse(prop.getProperty(PROP_SETUPRUN));
}

function deleteActiveAnswerSheetId() {
  var prop = PropertiesService.getScriptProperties();
  prop.deleteProperty(PROP_ANSWERSHEET_ID);
}

// Save answer sheet id to Props
function saveActiveAnswerSheetId(ssId) {
  var prop = PropertiesService.getScriptProperties();
  prop.setProperty(PROP_ANSWERSHEET_ID, ssId);
}

// Get active answer sheet id from Props
function getActiveAnswerSheetId() {
  var prop = PropertiesService.getScriptProperties();
  return prop.getProperty(PROP_ANSWERSHEET_ID);
}

// Save name of active answer sheet
function saveActiveSheetName(sheetName) {
  var prop = PropertiesService.getScriptProperties();
  prop.setProperty(PROP_ACTIVESHEET_NAME, sheetName);
}

// Get name of active answer sheet
function getActiveSheetName() {
  var prop = PropertiesService.getScriptProperties();
  return prop.getProperty(PROP_ACTIVESHEET_NAME);
}

// Delete name of active answer sheet
function deleteActiveSheetName() {
  var prop = PropertiesService.getScriptProperties();
  prop.deleteProperty(PROP_ACTIVESHEET_NAME);
}

// Load a file from Google Drive and return BLOB
function getImageFromDrive(imageName) {
  var blob = null;
  
  try {
    var files = DriveApp.getFilesByName(imageName);
    
    while (files.hasNext()) {
      blob = files.next().getBlob();
      break;
    }
  }
  catch(e) {
    ssLogger.log("Error getImageFromDrive");
    ssLogger.log(e);
  }
  finally{
    return blob;
  }
}

// Return current year as string
function getCurrentYear() {
  return Utilities.formatDate(new Date(Date.now()), "CET", "YYYY");
}

// Get Answer sheet id if exists
function getDestinationId() {
  var destId = null;
  var f = FormApp.getActiveForm();
  
  try {
    destId = f.getDestinationId();
  }
  finally {
    return destId;
  }
}

// Get a obejct with memberId and associated row
function getMemberIdRowReferences(activeSheet) {
  var memberIdRowReferences = {};
  try {
    var lastRow = activeSheet.getDataRange().getLastRow();
    
    for (var row = START_ROW; row <= lastRow; row++) {
      var memberId = activeSheet.getRange(row, MEMBERID_COLUMN).getValue();
      memberIdRowReferences[memberId] = row;
    }
  }
  catch(e) {
    ssLogger.log("Error in getMemberIdRowReferences");
    ssLogger.log(e);
  }
  finally {
    return memberIdRowReferences;
  }
}

// Move a file to current folder
function moveFile(fileId) {
  var f = FormApp.getActiveForm();
  
  try {
    var file = DriveApp.getFileById(f.getId());
    var parentFolder = file.getParents().next();
    var ssFile = DriveApp.getFileById(fileId);
    DriveApp.getFolderById(parentFolder.getId()).addFile(ssFile);
    DriveApp.getRootFolder().removeFile(ssFile);
  }
  catch(e) {
    ssLogger.log("Error moveFile");
    ssLogger.log(e);
    throw e;
  }
}

// Generate a new Member id
function generateMemberId() {
  return "m_" + Utilities.getUuid();
}

// Sort a array of members in Reversed ASC
function sortMembers(members) {
  members.sort(function(a, b) {
    if (a.firstname === b.firstname) return 0;
    if (a.firstname < b.firstname) return -1;
    if (a.firstname > b.firstname) return 1;
  });
  
  return members;
}

// Sort a array of members in Reversed DESC
function sortMembersReverse(members) {
  members.sort(function(a, b) {
    if (a.firstname === b.firstname) return 0;
    if (a.firstname < b.firstname) return 1;
    if (a.firstname > b.firstname) return -1;
  });
  
  return members;
}

// Format date to dd.mm.yyyy
function formatDate(date) {
  var dateFormatted = "";
  
  if (date) {
    dateFormatted = Utilities.formatDate(date, "CET", "dd.MM.yyyy");
  }  
  
  return dateFormatted;
}

// Convert member values to JSON object
function convertValuesToMembers(values) {
  var members = [];
  if (values) {
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      var member = {
        "id": row[MEMBERID_COLUMN - 1],
        "firstname": row[FIRSTNAME_COLUMN - 1],
        "lastname": row[LASTNAME_COLUMN - 1],
        "street": row[STREET_COLUMN - 1],
        "zipcodeAndCity": row[ZIPCODECITY_COLUMN - 1],
        "birthdate": row[BIRTHDATE_COLUMN - 1],
        "birthdateFormatted": formatDate(row[BIRTHDATE_COLUMN - 1]),
        "mail": row[MAIL_COLUMN - 1],
        "mobile": row[MOBILEPHONE_COLUMN - 1],
        "confirmationmail": row[CONFIRMATIONMAIL_COLUMN - 1],
        "payment": row[PAYMENT_COLUMN - 1],
        "paymentFormatted": formatDate(row[PAYMENT_COLUMN - 1])
      }
      
      members.push(member);
    }
  }
  
  return members;
}

// Calculate age from a birthdate
function calculateAge(birthdate) {
  var currentDate = new Date(Date.now());
  var cDay = currentDate.getDate();
  var cMonth = currentDate.getMonth();
  var cYear = currentDate.getFullYear();
  var bdate = new Date(birthdate);
  var bDay = bdate.getDate();
  var bMonth = bdate.getMonth();
  var bYear = bdate.getFullYear();
  
  var year = cYear - bYear;
  var month = cMonth - bMonth;
  var day = cDay - bDay;
  
  if (month < 0) {
    year--;
  } else if (month === 0) {
    if (day < 0) {
      year--;
    }
  }
  
  return year;
}

// Check if we are in january - may then subcription is half price
function halfSeasonSubscription() {
  var isHalfSeason = false;
  var month = new Date(Date.now()).getMonth();
  if (month >= 0 && month <= 4) isHalfSeason = true;
  return isHalfSeason;
}