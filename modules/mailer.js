const nodemailer = require('nodemailer');

// 创建一个SMTP客户端配置
const config = {
  host: 'smtp.126.com',
  port: 25,
  auth: {
    user: 'xxxxx@126.com',
    pass: 'xxxxx'
  }
};

const defaultMail = {
  from: config.auth.user,
  to: '345745764@qq.com',
  subject: '我是默认主题',
  text: '我是默认内容'
};

const transporter = nodemailer.createTransport(config);


module.exports = function(mail) {
  // 应用默认配置
  mail = Object.assign({}, defaultMail, mail);

  // 发送邮件
  transporter.sendMail(mail, function(error, info) {
    if (error) return console.log(error);
    console.log('mail sent:', info.response,'\n');
  });
};