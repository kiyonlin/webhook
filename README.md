# webhook

基于Node.js的webhook项目，用来自动部署应用，可以同时处理多个项目，支持coding和github，处理之后自动发送邮件提醒

## Usage

### Step 1 配置webhook

进入coding或github的webhook设置页面，填写url和口令

url格式如下

```
http://域名:端口/webhook/项目名
```

口令随便设置

### Step 2 写配置文件

在`config.json`中写配置文件，格式如下

```
{
  "project-name-1":{                                // 项目名，必须跟第一步填写的相同
    "path":"/home/xiaogaoyang/test",                // 项目的路径，在服务器中的绝对路径
    "command":"./shell/test.sh",                    // shell脚本路径，相对于当前项目根目录的路径
    "platform":"github",                            // git平台，github或coding
    "secret":"test",                                // 口令，平台为github时填写
    "token":"test"                                  // 口令，平台为coding时填写
  },
  "project-name-2":{
    ...
  },
  ...
}
```

### Step 3 配置提醒邮箱

邮箱需要开启SMTP服务，我这里使用的是126邮箱

在`modules/mailer.js`中修改邮箱设置

```
const config = {
  host: 'smtp.126.com',             // SMTP服务器
  port: 25,                         // 端口
  auth: {
    user: 'xxxx@126.com',           // 邮箱用户名
    pass: 'xxxxxx'                  // 邮箱客户端授权码
  }
};

const defaultMail = {
  from: config.auth.user,
  to: '345745764@qq.com',           // 接收者
  subject: '默认邮件主题',
  text: '默认邮件内容'
};
```

### Step 4 写shell脚本

常见的shell脚本如下

```shell
#! /bin/bash

git reset --hard origin/master
git clean -f
git pull origin master
npm install
pm2 start index.js --name "project-name"
```

### Step 5 启动该项目

```
npm install
pm2 start index.js --name "webhook"
```
