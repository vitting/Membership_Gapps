// Used in ConfirmTemplate
var recipientName;
var amount;
// Send a Confirmation to a newly create member
// Uses a HTML Template = ConfirmTemplate
function sendConfirmationMail(member) {
  var mailSendt = false;
  var sendConfirmationMail = getSendConfirmationMail();
  recipientName = "";
  amount = "";
  
  //HACK
  if (useDevelopmentMode()) {
    member.mail = getDevelopmentMail();
    EMAIL_BCC = getDevelopmentMail();
  }
  
  try {
    if (sendConfirmationMail && sendConfirmationMail === "true") {
      var qrimg;
      var fee = getMembershipFee();
      if (halfSeasonSubscription() && fee.full !== fee.half) {
        amount = fee.half;
        qrimg = getImageFromDrive(IMG_SIKVOLLEY_QR_HALF);
      } else {
        amount = fee.full;
        qrimg = getImageFromDrive(IMG_SIKVOLLEY_QR_FULL);
      }
      
      recipientName = member.firstname;  
      var html = HtmlService.createTemplateFromFile(CONFIRM_EMAIL_TEMPLATE_NAME).evaluate().getContent();
      var recipient = member.mail;
      var subject = CONFIRM_EMAIL_SUBJECT;
      var body = "";
      var options = {
        htmlBody: html,
        name: EMAIL_SENDER_NAME,
        bcc: EMAIL_BCC,
        inlineImages: {
          qrimg: qrimg,
          logo: getImageFromDrive(IMG_SIKVOLLEY_LOGO)
        },
        noReply: true
      };
      
      MailApp.sendEmail(recipient, subject, body, options);
    }
    
    mailSendt = true;
  }
  catch(e) {
    ssLogger.log("Error sendConfirmationMail");
    ssLogger.log(e);
  }
  finally{
    return mailSendt;
  }
}

function sendUnsubscribeMail(member) {
  var mailSendt = false;
  recipientName = "";
  
  //HACK
  if (useDevelopmentMode()) {
    member.mail = getDevelopmentMail();
    EMAIL_BCC = getDevelopmentMail();
  }
  
  try {
    recipientName = member.firstname;  
    var html = HtmlService.createTemplateFromFile(UNSUBSCRIBE_EMAIL_TEMPLATE_NAME).evaluate().getContent();
    var recipient = member.mail;
    var subject = UNSUBSCRIBE_EMAIL_SUBJECT;
    var body = "";
    var options = {
      htmlBody: html,
      name: EMAIL_SENDER_NAME,
      bcc: EMAIL_BCC,
      inlineImages: {
        logo: getImageFromDrive(IMG_SIKVOLLEY_LOGO)
      },
      noReply: true
    };
    
    MailApp.sendEmail(recipient, subject, body, options);
    mailSendt = true;
  }
  catch(e) {
    ssLogger.log("Error sendUnsubscribeMail");
    ssLogger.log(e);
  }
  finally{
    return mailSendt;
  }
}