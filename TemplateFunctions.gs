/****************************************************************************************
* FUNCTIONS CALLED FROM HTML TEMPLATE SidebarTemplate
****************************************************************************************/

// Load CSS and JavaScript in Template
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function getSettings() {
  var settings = {
    "developmentMode": getDevelopmentMode(),
    "developmentMail": getDevelopmentMail(),
    "sendConfirmationMail": getSendConfirmationMail(),
    "membershipFee": getMembershipFee()
  };
  
  return JSON.stringify(settings);
}

function saveSetting(setting, value) {
  if (setting === "developmentmode") {
    saveDevelopmentMode(value);
  } else if (setting === "membershipfee") {
    saveMembershipFee(value);
  } else if (setting === "sendconfirmationmail") {
    saveSendConfirmationMail(value);
  } else if (setting === "developmentmail") {
    saveDevelopmentMail(value);
  }
}

// Run setup functions
function runSetup() {
  saveMembershipFee({
    "full": MEMBERSHIP_FEE_FULL_SETUP_VALUE, 
    "half": MEMBERSHIP_FEE_HALF_SETUP_VALUE
  });
  saveDevelopmentMail(DEVELOPMENT_EMAIL);
  saveDevelopmentMode(false);
  saveSendConfirmationMail(false); //To avoid spreadsheet trigger onsubmit 
  
  var isNewSpreadsheetCreated = setOrCreateSpreadsheetToForm();
  
  saveSendConfirmationMail(true);  
  generateMemberIds();
  addCurrentMembersToContactGroup();  
  
  saveSetupRunValue(true);
  generateMenu();
  
  return isNewSpreadsheetCreated;
}

// Get all data about members
function getAnswerSheetValues() {
  var values = [];
  var ssId = getActiveAnswerSheetId();
  
  if (ssId) {
    var ss = SpreadsheetApp.openById(ssId);
    values = ss.getActiveSheet().getDataRange().getValues();
  }  
  
  var members = sortMembers(convertValuesToMembers(values));
  
  return JSON.stringify(members);
}

// Get all data about members
function getAnswerSheetValuesWithAge() {
  var values = [];
  var ssId = getActiveAnswerSheetId();
  
  if (ssId) {
    var ss = SpreadsheetApp.openById(ssId);
    values = ss.getActiveSheet().getDataRange().getValues();
  }  
  
  var members = sortMembers(convertValuesToMembers(values));
  
  for (var i = 0; i < members.length; i++) {
    members[i].age = calculateAge(members[i].birthdate);
  }
  
  return JSON.stringify(members);
}

// Save info about a members payment
function saveMemberPayments(paymentsInfo) {
  var success = false;
  
  try {
    if (paymentsInfo) {
      var ss = SpreadsheetApp.openById(getActiveAnswerSheetId());
      var as = ss.getActiveSheet();
      memberIdRowReferences = getMemberIdRowReferences(as);
      
      for (var memberId in paymentsInfo) {        
        var row = memberIdRowReferences[memberId];
        var value = "";
        
        if (paymentsInfo[memberId]) {
          value = new Date(Date.now());
        }
        
        as.getRange(row, PAYMENT_COLUMN).setValue(value)
      }
    }
    
    success = true;
  }
  catch(e) {
    ssLogger.log("Error in saveMemberPayments");
    ssLogger.log(e);
  }
  finally {
    return success;
  }
}

// Resend a membership confirmation e-mail
function ResendConfirmationEmail(member) {
  return sendConfirmationMail(member); 
}

// Unsubscribe/delete member and send mail
function UnsubscribeMember(member) {
  var success = false;
  
  try {
    if (member) {
      var memberDeleted = deleteMember(member);
      
      if (memberDeleted) {
        removeMemberFromContactGroup(member);
        
        if (member.sendMail) {
          sendUnsubscribeMail(member);
        }
        
        success = true;
      }
    }
  }
  catch(e) {
    ssLogger.log("Error in UnsubscribeMember");
    ssLogger.log(e);
  }
  finally {
    return success;
  }
}

// Save edited member info
function saveEditMember(member) {
  var success = false;
  
  try {
    if (member) {
      var ss = SpreadsheetApp.openById(getActiveAnswerSheetId());
      var as = ss.getActiveSheet();
      memberIdRowReferences = getMemberIdRowReferences(as);
      var row = memberIdRowReferences[member.id];
      
      as.getRange(row, FIRSTNAME_COLUMN).setValue(member.firstname);
      as.getRange(row, LASTNAME_COLUMN).setValue(member.lastname);
      as.getRange(row, STREET_COLUMN).setValue(member.street);
      as.getRange(row, ZIPCODECITY_COLUMN).setValue(member.zipcodeAndCity);
      as.getRange(row, BIRTHDATE_COLUMN).setValue(member.birthdate);
      as.getRange(row, MAIL_COLUMN).setValue(member.mail);
      as.getRange(row, MOBILEPHONE_COLUMN).setValue(member.mobile);
      
      renameMemberProperties(member);
      success = true;
    }
  } 
  catch(e) {
    ssLogger.log("Error in saveEditMember");
    ssLogger.log(e);
  }
  finally {
    return success;
  }
}

// Create a copy/bakup of current answer sheet and clear payments columns
function createNewSeason(name) {
  var success = false;
  var ssId = getDestinationId();
  
  try {
    if (ssId) {
      var ss = SpreadsheetApp.openById(ssId);
      var as = ss.getActiveSheet();
      var copySheet = ss.duplicateActiveSheet();
      copySheet.setName(name);
      
      var lastRow = as.getDataRange().getLastRow();
      as.getRange(START_ROW, PAYMENT_COLUMN, lastRow).clear();
      success = true;
    }
  }
  catch(e) {
    ssLogger.log("Error createNewSeason");
    ssLogger.log(e);
  }
  finally {
    return success;
  }
}