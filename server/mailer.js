/* Copyright 2014 Harshavardhana <harsha@harshavardhana.net>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var nodemailer = require("nodemailer");
// default SMTP use it
var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "qed.zone@gmail.com",
    pass: "^^^^^****"
  }
});

var mailOptions = {
  from: "Qed (MSRI) Zone <qed.zone@gmail.com>",
  to: "<receiver@msri.org>",
  subject: message.fname,
  text: message.fname,
  html: '<b>' + message.fname + '</b>',
  attachments: [
    { //
      path: _this.root + '/uploaded/' + message.fname
    },
  ]
}

smtpTransport.sendMail(mailOptions, function(error, response){
  if (error) {
    console.log(error);
  } else {
    console.log("Message sent: " + response);
  }
  smtpTransport.close();
});
