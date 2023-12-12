const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const {JWT_SECRET, EMAIL_USER, EMAIL_PASS} = process.env

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
});

function createToken(fullname, email, username, phone) {
    jwt.sign({
        fullname: fullname,
        email: email,
        phone: phone
    },JWT_SECRET, {
        expiresIn: '1m' // 1 minute
    }, (err, token) => {
        if(err) {
            console.log('create token failed')
            throw err
        }

        let mailOptions = {
            from: EMAIL_USER, // Địa chỉ email người gửi
            to: email,
            subject: 'Verify login for the first time',
            text: 'Please click the link below to log in',
            html: `
                <p>Please click the link below to log in:</p>
                <a href="http://localhost:8888/accounts/login?token=${token}&username=${username}">Click to login</a>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error:', error);
            }
            console.log('Email sent:', info.response);
        });

        return token
    })
}

module.exports = createToken