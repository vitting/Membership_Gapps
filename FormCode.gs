//Only for development
function resetForm() {
  var f = FormApp.getActiveForm();
  f.removeDestination();
  deleteIfTriggerExistsInProject(SPREADSHEET_TRIGGER_ONSUBMIT);
  var cg = ContactsApp.getContactGroup(CONTACTGROUP_NAME);
  if (cg) {
    var contacts = cg.getContacts();
    
    for (var i = 0;i < contacts.length; i++) {
      contacts[i].deleteContact();     
    }
    
    cg.deleteGroup();
  }
  
  deleteDevelopmentMode();
  deleteDevelopmentMail();
  deleteSendConfirmationMail();
  deleteSetupAlertValue();
  deleteSetupRunValue();
  deleteActiveAnswerSheetId();
  deleteActiveSheetName();
}

//Tilret E-mail skabeloner
//Vi skal manuelt sætte en onOpen trigger
//Lav standard svar skabeloner i Gmail

/****************************************************************************************
* PUBLIC VARIABLES
****************************************************************************************/
var ssLogger = new Sslogger();

/****************************************************************************************
* FUNCTIONS
****************************************************************************************/
// onSubmit Event for trigger on Spreadsheet
function onSubmit(e) {
  if (e.values && e.values.length) {
    var member = {
      "id": "",
      "firstname": e.values[FIRSTNAME_COLUMN -1],
      "lastname": e.values[LASTNAME_COLUMN -1],
      "mail": e.values[MAIL_COLUMN -1]
    };
    
    if (sendConfirmationMail(member)) {
      member.id = setNewMemberValues(e.range.rowStart);       
      if (member.id) {
        addMemberToContactGroup(member, getContactGroup());
      }
    }
  }
}

// Form open Event
function onOpen(e) {
  setActiveSheetInAnswerSpreadsheet();
  generateMenu();
  firstRunWelcomePrompt();
}

// Generate Menu in Add-ons menu
function generateMenu() {
  var setupRun = getSetupRunValue();
  var ui = FormApp.getUi().createMenu(MENU_TITLE);
  if (!setupRun) {
    ui.addItem(SETUP_MENUITEM_TEXT, SETUP_MENUITEM_METHOD).addToUi();
  } else {
    ui
    .addItem(REPORTS_MENUITEM_TEXT, REPORTS_MENUITEM_METHOD)
    .addItem(EDITMEMBER_MENUITEM_TEXT, EDITMEMBER_MENUITEM_METHOD)
    .addItem(PAYMENTS_MENUITEM_TEXT, PAYMENTS_MENUITEM_METHOD)
    .addItem(UNSUBSCRIBE_MENU_ITEM_TEXT, UNSUBSCRIBE_MENU_ITEM_METHOD)
    .addItem(NEWSEASON_MENU_ITEM_TEXT, NEWSEASON_MENU_ITEM_METHOD)
    .addItem(RESENDCONFIRMATION_MENUITEM_TEXT, RESENDCONFIRMATION_MENUITEM_METHOD)
    .addItem(SETTINGS_MENUITEM_TEXT, SETTINGS_MENUITEM_METHOD)
    .addItem(INSTRUCTION_MENUITEM_TEXT, INSTRUCTION_MENUITEM_METHOD)
    .addToUi();
  } 
}

// Ensure that active sheet is the sheet used by form
function setActiveSheetInAnswerSpreadsheet() {
  var ssId = getDestinationId();
  var name = getActiveSheetName();
  
  try {
    if (name) {
      var ss = SpreadsheetApp.openById(ssId);
      var sheet = ss.getSheetByName(name);
      ss.setActiveSheet(sheet);
    }
  }
  catch(e) {
    ssLogger.log("Error setActiveSheetInAnswerSpreadsheet");
    ssLogger.log(e);
  }
}

// Save answer spreadsheet id and name to properties
function saveSpreadsheetProperties(ssId) {
  var name = SpreadsheetApp.openById(ssId).getActiveSheet().getName();
  saveActiveSheetName(name);
  saveActiveAnswerSheetId(ssId);
}

// Determin if a new answer sheet should be created or 
// trigger is set on a existing answer sheet
function setOrCreateSpreadsheetToForm() {
  var f = FormApp.getActiveForm();
  var ssId = getDestinationId();
  var newCreated = false;
  if (!ssId) {
    newCreated = true;
    var spreadSheetName = f.getTitle();
    ssId = setAnswerSpreadSheetToForm(spreadSheetName);
  } else {
    deleteIfTriggerExistsInProject(SPREADSHEET_TRIGGER_ONSUBMIT);
    addOnSubmitTriggerOnSpreadSheet(ssId);
  }

  addColumnHeadersToAnswerSpreadsheet(ssId);  
  saveSpreadsheetProperties(ssId);
  
  return newCreated;
}

// Create a new spreadsheet and set SpreadSheet to form
function setAnswerSpreadSheetToForm(name) {
  var f = FormApp.getActiveForm();
  var ssId = createAnswerSpreadSheet(name);
 
  try {
    f.setDestination(FormApp.DestinationType.SPREADSHEET, ssId);
    deleteIfTriggerExistsInProject(SPREADSHEET_TRIGGER_ONSUBMIT);
    addOnSubmitTriggerOnSpreadSheet(ssId);
    moveFile(ssId);
  }
  catch(e) {
    ssLogger.log("Error setAnswerSpreadSheetToForm");
    ssLogger.log(e);
    throw e;
  }
  
  return ssId;
}

// Create a new answer Spreadsheet
function createAnswerSpreadSheet(name) {
  var f = FormApp.getActiveForm();
  var ss = SpreadsheetApp.create(name);
  return ss.getId();
}

function addColumnHeadersToAnswerSpreadsheet(ssId) {
  if (ssId) {
    try {
      var ss = SpreadsheetApp.openById(ssId);
      var as = ss.getActiveSheet();
      as.getRange(1, MEMBERID_COLUMN).setValue(MEMBERID_COLUMN_TEXT);
      as.getRange(1, CONFIRMATIONMAIL_COLUMN).setValue(CONFIRMATIONMAIL_COLUMN_TEXT);
      as.getRange(1, PAYMENT_COLUMN).setValue(PAYMENT_COLUMN_TEXT);
    }
    catch(e) {
      ssLogger.log("Error addColumnHeadersToAnswerSpreadsheet");
      ssLogger.log(e);
    }
  }
}

// Generate Member ids for member not allready assigned one
function generateMemberIds() {
  var ssId = getActiveAnswerSheetId();
  if (ssId) {
    try{
      var ss = SpreadsheetApp.openById(ssId);
      var as = ss.getActiveSheet();
      var lastRow = as.getDataRange().getLastRow();
      
      for (var row = START_ROW; row <= lastRow; row++) {
        var colMemberId = as.getRange(row, MEMBERID_COLUMN);
        if (!colMemberId.getValue()) {
          var memberId = generateMemberId();
          colMemberId.setValue(memberId);
        }
      }
    }
    catch(e){
      ssLogger.log("Error generateMemberIds");
      ssLogger.log(e);
    }
  }
}

// Mark mail as sendt and set memeberId
function setNewMemberValues(row) {
  var memberId = null;
  var ssId = getActiveAnswerSheetId();
  if (ssId) {
    try{
      var date = Utilities.formatDate(new Date(Date.now()), "CET", "dd-MM-yyyy HH:mm");
      memberId = generateMemberId();
      var ss = SpreadsheetApp.openById(ssId);
      var as = ss.getActiveSheet();
      as.getRange(row, MEMBERID_COLUMN).setValue(memberId); 
      as.getRange(row, CONFIRMATIONMAIL_COLUMN).setValue(date); 
    }
    catch(e){
      ssLogger.log("Error setNewMemberValues");
      ssLogger.log(e);
    }
    finally {
      return memberId;
    }
  }
}

// Set onFormSubmit on attatched Spreadsheet
function addOnSubmitTriggerOnSpreadSheet(ssId) {
  var builder = ScriptApp.newTrigger(SPREADSHEET_TRIGGER_ONSUBMIT).forSpreadsheet(ssId).onFormSubmit().create();
}

// Delete trigger if exists
function deleteIfTriggerExistsInProject(triggerName) {
  var triggers = ScriptApp.getProjectTriggers();
  
  for (var i in triggers) {
    if (triggers[i].getHandlerFunction() === triggerName) {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}

//Delete member from spreadsheet
function deleteMember(member) {
  var memberDeleted = false;
  
  try {
    var ssId = getActiveAnswerSheetId();
    var ss = SpreadsheetApp.openById(ssId);
    var as = ss.getActiveSheet();
    var memberIdRowReferences = getMemberIdRowReferences(as);
    var row = memberIdRowReferences[member.id];
    as.deleteRow(row);
    memberDeleted = true;
  }
  catch(e) {
    ssLogger.log("Error deleteMember");
    ssLogger.log(e);
  }
  finally {
    return memberDeleted;
  }
}

// Get reference to contact group or if it don't exist create it
function getContactGroup() {
  var cg = ContactsApp.getContactGroup(CONTACTGROUP_NAME);
  
  if (!cg) {
    cg = createContactGroup();
  }
  
  return cg;
}

// Create contact group
function createContactGroup() {
  var cg = null;
  
  try { 
    cg = ContactsApp.createContactGroup(CONTACTGROUP_NAME);
  }
  catch(e) {
    ssLogger.log("Error createContactGroup");
    ssLogger.log(e);
  }
  finally {
    return cg;
  }
}

// Create a contact
function createContact(member) {
  var c = ContactsApp.createContact(member.firstname, member.lastname, member.mail)
  c.addCustomField(CONTACTCUSTOMFIELD_MEMBERID, member.id);
  return c;
}

// Add current members to contact group
function addCurrentMembersToContactGroup() {
  var ssId = getActiveAnswerSheetId();
  if (ssId) {
    try {
      var ss = SpreadsheetApp.openById(ssId);
      var as = ss.getActiveSheet();
      var lastRow = as.getDataRange().getLastRow();
      var lastColumn = as.getDataRange().getLastColumn();
      var contactGroup = getContactGroup();
      for (var row = START_ROW; row <= lastRow; row++) {
        var member = {
          "id": as.getRange(row, MEMBERID_COLUMN).getValue(),
          "firstname": as.getRange(row, FIRSTNAME_COLUMN).getValue(),
          "lastname": as.getRange(row, LASTNAME_COLUMN).getValue(),
          "mail": as.getRange(row, MAIL_COLUMN).getValue()
        }
        
        addMemberToContactGroup(member, contactGroup);
      }
    }
    catch(e) {
      ssLogger.log("Error addCurrentMembersToContactGroup");
      ssLogger.log(e);
    }
  }
}

// Add a member to contact group
function addMemberToContactGroup(member, contactGroup) {
  try {
    contactGroup.addContact(createContact(member));
  }
  catch(e) {
    ssLogger.log("Error addMemberToContactGroup");
    ssLogger.log(e);
  }
}

//Delete member from Contactgroup
function removeMemberFromContactGroup(member) {
  var success = false;
  
  try {
    var contacts = ContactsApp.getContactsByCustomField(member.id, CONTACTCUSTOMFIELD_MEMBERID);
    
    if (contacts.length) {
      var contact = contacts[0];
      ContactsApp.deleteContact(contact);
    }
    
    success = true;
  }
  catch(e) {
    ssLogger.log("Error removeMemberFromContactGroup");
    ssLogger.log(e);
  }
  finally {
    return success;
  }
}

//Rename member in contacts
function renameMemberProperties(member) {
  var success = false;
  
  try {
    var contacts = ContactsApp.getContactsByCustomField(member.id, CONTACTCUSTOMFIELD_MEMBERID);
    
    if (contacts.length) {
      var contact = contacts[0];
      contact.setFullName(member.firstname + " " + member.lastname);
      var emails = contact.getEmails(ContactsApp.Field.HOME_EMAIL)
      
      if (emails.length) {
        emails[0].setAddress(member.mail);
      }
    }
    
    success = true;
  }
  catch(e) {
    ssLogger.log("Error renameMemberProperties");
    ssLogger.log(e);
  }
  finally {
    return success;
  }
}