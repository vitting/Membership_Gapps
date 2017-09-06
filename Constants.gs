/****************************************************************************************
* CONSTANTS
****************************************************************************************/
var DEVELOPMENT_EMAIL = "XXXXXXX@hotmail.com";

// MENU & DIALOG
var MENU_TITLE = "Volleyball";
var SETTINGS_MENUITEM_TEXT = "Indstillinger";
var SETTINGS_MENUITEM_METHOD = "showSettingsDialog";
var SETUP_MENUITEM_TEXT = "Setup";
var SETUP_MENUITEM_METHOD = "showSetupDialog";
var REPORTS_MENUITEM_TEXT = "Rapporter";
var REPORTS_MENUITEM_METHOD = "showMemberReportsDialog";
var PAYMENTS_MENUITEM_TEXT = "Betalinger";
var PAYMENTS_MENUITEM_METHOD = "showPaymentsDialog";
var UNSUBSCRIBE_MENU_ITEM_TEXT = "Udmeld medlem";
var UNSUBSCRIBE_MENU_ITEM_METHOD = "showUnsubscriptionDialog";
var NEWSEASON_MENU_ITEM_TEXT = "Ny sæson";
var NEWSEASON_MENU_ITEM_METHOD = "showRenewSeasonDialog";
var INSTRUCTION_MENUITEM_TEXT = "Vejledning";
var INSTRUCTION_MENUITEM_METHOD = "showInstructionDialog";
var EDITMEMBER_MENUITEM_TEXT = "Rediger medlems oplysninger";
var EDITMEMBER_MENUITEM_METHOD = "showEditMemberDialog";
var RESENDCONFIRMATION_MENUITEM_TEXT = "Bekræftelse e-mail";
var RESENDCONFIRMATION_MENUITEM_METHOD = "showResendConfirmationDialog";


// Images
var IMG_SIKVOLLEY_QR = "mobilepay_qr.png";
var IMG_SIKVOLLEY_QR_FULL = "qr_kontingent_350.png";
var IMG_SIKVOLLEY_QR_HALF = "qr_kontingent_175.png";
var IMG_SIKVOLLEY_LOGO = "silkeborg_kfum_logo.png";

var SPREADSHEET_TRIGGER_ONSUBMIT = "onSubmit";

// Spreadsheet columns
var FIRSTNAME_COLUMN = 2;
var LASTNAME_COLUMN = 3;
var STREET_COLUMN = 4;
var ZIPCODECITY_COLUMN = 5;
var BIRTHDATE_COLUMN = 6
var MAIL_COLUMN = 7;
var MOBILEPHONE_COLUMN = 8;
var MEMBERID_COLUMN = 9;
var CONFIRMATIONMAIL_COLUMN = 10;
var PAYMENT_COLUMN = 11;
var START_ROW = 2;
var MEMBERID_COLUMN_TEXT = "MedlemsId";
var CONFIRMATIONMAIL_COLUMN_TEXT = "Indmeldelses mail";
var PAYMENT_COLUMN_TEXT = "Betaling";

var CONFIRM_EMAIL_TEMPLATE_NAME = "ConfirmEmailTemplate";
var CONFIRM_EMAIL_SUBJECT = "Indmeldelse i Silkeborg KFUM Volleyball";
var UNSUBSCRIBE_EMAIL_TEMPLATE_NAME = "UnsubscribeEmailTemplate";
var UNSUBSCRIBE_EMAIL_SUBJECT = "Udmeldelse af Silkeborg KFUM Volleyball";
var MAILMEMBERS_EMAIL_TEMPLATE_NAME = "MailMembersEmailTemplate";
var EMAIL_SENDER_NAME = "Silkeborg Volleyball";
var EMAIL_BCC = "XXXXXX@gmail.com";

var CONTACTGROUP_NAME = "Medlemmer";
var CONTACTCUSTOMFIELD_MEMBERID = "MedlemsId";

var MEMBERSHIP_FEE_FULL_SETUP_VALUE = "350";
var MEMBERSHIP_FEE_HALF_SETUP_VALUE = "175";

var PROP_ANSWERSHEET_ID = "answersheet_id";
var PROP_ACTIVESHEET_NAME = "activesheet_name";
var PROP_CONTACTGROUP_ID = "contactgroup_id";
var PROP_SETUPRUN = "setupRun";
var PROP_SETUPALERT = "setupAlert";
var PROP_DEVELOPMENT_MODE = "developmentmode";
var PROP_DEVELOPMENT_MAIL = "developmentmail";
var PROP_SEND_CONFIRMATION_MAIL = "send_confirmation_mail";
var PROP_MEMEBERSHIP_FEE = "memebership_fee";