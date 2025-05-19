
module.exports.otp = (name, otpType, otp) => {
    return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en" xml:lang="en">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>OTP template</title>
    <style type="text/css">
        #outlook a {
            padding: 0;
        }

        body {
            width: 100% !important;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            margin: 0;
            padding: 0;
        }

        /* force default font sizes */
        .ExternalClass {
            width: 100%;
        }

        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
            line-height: 100%;
        }

        /* Hotmail */
        table td {
            border-collapse: collapse;
        }

        @media only screen and (min-width: 600px) {
            .maxW {
                width: 600px !important;
            }
        }
    </style>
</head>

<body style="margin: 0px; padding: 0px; -webkit-text-size-adjust:none; -ms-text-size-adjust:none;" leftmargin="0"
    topmargin="0" marginwidth="0" marginheight="0" bgcolor="#f7f7f7">
    <table bgcolor="#f7f7f7" width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
        <tr>
            <td valign="top">
                <table width="100%" class="maxW" style="max-width: 550px; margin: auto;height:100vh; " border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td valign="middle" align="center">
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="padding:30px 0 ;"
                                bgcolor="#fff">
                                <tr>
                                    <td align="center" valign="middle"
                                        style="font-family: Verdana, Geneva, Helvetica, Arial, sans-serif; font-size: 24px; color: #353535; padding:3%; padding-top:30px; padding-bottom:15px;">
                                        <img src=${process.env.APP_LOGO} alt="logo"
                                            style="max-width:120px; display: block; margin: 0 auto;">
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" valign="middle"
                                        style="font-family: Verdana, Geneva, Helvetica, Arial, sans-serif;  color: #353535; padding:3%; padding-top:0px; padding-bottom:15px;">
                                        <h1
                                            style="color:#000; font-weight:700; margin:0;font-size:28px;font-family:'Rubik',sans-serif; margin-bottom:5px;">
                                            Hello${name ? " " + name : ""},
                                        </h1>
                                        <p style="font-size: 15px; margin-top:15px; ">Thank you for choosing Us. Please
                                            use the OTP below to ${otpType}.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" valign="middle"
                                        style="font-family: Verdana, Geneva, Helvetica, Arial, sans-serif;  color: #353535; padding:3%; padding-top:0px; padding-bottom:15px;">
                                        <p style="font-size: 20px; margin-top:0; font-weight:bold; color:#000;">${otp}
                                        </p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="text-align:center; padding:20px 0px 0px; border-top:1px solid #eaeaea; ">
                                        <p
                                            style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">
                                            ALL RIGHTS RESERVED ${Moment().year()} © </strong>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>`
};

module.exports.welcome = (data) => {
    return `<p>Hi ${data.firstName},</p>
    <p>Welcome to our platform. Your account has been created successfully.</p>
    <p>Your login credentials are:</p>
    <p>Email: ${data.email}</p>
    <p>Password: ${data.password}</p>
    <p>Thank you,</p>
    <p>TkFit Team</p>`
}