// 环境配置检查可以避免一些奇葩的报错

const exec = require('child_process').exec;
module.exports =(hexo) => {
  if (!hexo.checkEnvironment) {
    hexo.checkEnvironment=1;
    hexo.log.info(`Checking environment configuration...`);

    // Checking environment
    exec('node -v', (err, stdout, stderr) => {
      if (err) {
        CheckError(hexo,`node.js: ${err}`);
      }
      let nodeVersion = stdout.match(/v(\d*)/)[1];
      if (nodeVersion<16) {
        hexo.log.info(`node.js 版本：${stdout}`);
        CheckError(hexo,`node.js 版本过低，请升级至 v16.x 及以上版本！`);
      }else{
        exec('hexo -v', (err, stdout, stderr) => {
          if (err) {
            CheckError(hexo,`hexo-cli: ${err}`);
          }
          let hexoVersion1 = stdout.match(/hexo:\s*(\d*)/)[1];
          let hexoVersion2 = stdout.match(/hexo:\s*\d*\.(\d*)/)[1];
          if (hexoVersion1<5 || (hexoVersion1==5 && hexoVersion2<4)) {
            hexo.log.info(`hexo  版本：${stdout}`);
            CheckError(hexo,`hexo 版本过低，请升级至 5.4 以上版本！`);
          }else{
            let hexoClVersion1 = stdout.match(/hexo-cli:\s*(\d*)/)[1];
            let hexoClVersion2 = stdout.match(/hexo-cli:\s*\d*\.(\d*)/)[1];
            if (hexoClVersion1<4 || (hexoClVersion1==4 && hexoClVersion2<1)) {
              hexo.log.info(`hexo-cli 版本：${stdout}`);
              CheckError(hexo,`hexo-cli 版本过低，请升级至 4.1 以上版本！`);
            }else{
              // Checking configuration
              let checkConfiguration = require('./check-configuration')(hexo);
              if (checkConfiguration!==true) {
                CheckConfError(hexo,checkConfiguration);
              }
            }
          }
        });
      }
    });
  }
};

function CheckError(hexo,msg) {
  hexo.log.error(`
============================================================
环境配置检查失败！| Environment configuration check failed!
============================================================
${msg}
============================================================
推荐的配置：
Hexo: 5.4 ~ 6.x
hexo-cli: 4.3 ~ latest
node.js: 16.x LTS ~ latest LTS
npm: 8.x ~ latest LTS
============================================================
# 当前 Debug 调试模式
debug: env
关闭调试模式主题配置文件设置 debug: false
============================================================`);
  throw new Error('环境配置检查失败！| Environment configuration check failed!');
}

function CheckConfError(hexo,msg) {
  hexo.log.error(`
============================================================
配置文件检查失败！| Configuration check failed!
============================================================
${msg}
============================================================
# 当前 Debug 调试模式
debug: env
关闭调试模式主题配置文件设置 debug: false
============================================================`);
  throw new Error('配置文件检查失败！| Configuration check failed!');
}
