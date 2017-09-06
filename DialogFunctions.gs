/****************************************************************************************
* DIALOGS
****************************************************************************************/

function firstRunWelcomePrompt() {
  var setupAlert = getSetupAlertValue();
  if (!setupAlert) {
    FormApp.getUi().alert("Det er første gang du bruger denne tilføjelse. Gå i tilføjelses menuen og vælg Beachvolley -> Setup");
    saveSetupAlertValue(true);
  }
}

function showSetupDialog() {
  var ui = HtmlService.createTemplateFromFile("SetupDialogTemplate").evaluate();
  ui.setWidth(400).setHeight(300);
  FormApp.getUi().showModalDialog(ui, "Setup");
}

function showResendConfirmationDialog() {
  var ui = HtmlService.createTemplateFromFile("ResendConfirmationDialogTemplate").evaluate();
  ui.setWidth(500).setHeight(500);
  FormApp.getUi().showModalDialog(ui, "Bekræftelse e-mail");
}

function showSettingsDialog() {
  var ui = HtmlService.createTemplateFromFile("SettingsDialogTemplate").evaluate();
  ui.setWidth(400).setHeight(400);
  FormApp.getUi().showModalDialog(ui, "Indstillinger");
}

function showPaymentsDialog() {
  var ui = HtmlService.createTemplateFromFile("PaymentsDialogTemplate").evaluate();
  ui.setWidth(500).setHeight(500);
  FormApp.getUi().showModalDialog(ui, "Betalinger");
}

function showUnsubscriptionDialog() {
  var ui = HtmlService.createTemplateFromFile("UnsubscriptionDialogTemplate").evaluate();
  ui.setWidth(500).setHeight(500);
  FormApp.getUi().showModalDialog(ui, "Udmeldinger");
}

function showRenewSeasonDialog() {
  var ui = HtmlService.createTemplateFromFile("NewSeasonDialogTemplate").evaluate();
  ui.setWidth(400).setHeight(300);
  FormApp.getUi().showModalDialog(ui, "Ny sæson");
}

function showMemberReportsDialog() {
  var ui = HtmlService.createTemplateFromFile("MemberReportsDialogTemplate").evaluate();
  ui.setWidth(500).setHeight(500);
  FormApp.getUi().showModalDialog(ui, "Rapporter");
}

function showInstructionDialog() {
  var ui = HtmlService.createTemplateFromFile("InstructionDialogTemplate").evaluate();
  ui.setWidth(500).setHeight(500);
  FormApp.getUi().showModalDialog(ui, "Vejledning");
}

function showEditMemberDialog() {
  var ui = HtmlService.createTemplateFromFile("EditMemberDialogTemplate").evaluate();
  ui.setWidth(500).setHeight(500);
  FormApp.getUi().showModalDialog(ui, "Ændre medlems oplysninger");
}