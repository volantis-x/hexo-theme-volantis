// hexo g 执行 hexo s 跳出 

// https://blog.imkero.com/posts/hexo-page-performance.html#静态资源版本控制


const minimatch = require("minimatch");
const crypto = require('crypto');

const stream2buffer = (stream) => {
  if(!stream) return;
  return new Promise((resolve, reject) => {
    const _buf = [];
    stream.on("data", (chunk) => _buf.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(_buf)));
    stream.on("error", (err) => reject(err));
  });
};

const readFileAsBuffer = (filePath) => {
  return stream2buffer(hexo.route.get(filePath));
};

const readFileAsString = async (filePath) => {
  const buffer = await readFileAsBuffer(filePath);
  return buffer.toString();
};

const parseFilePath = (filePath) => {
  const parts = filePath.split("/");
  const originalFileName = parts[parts.length - 1];

  const dotPosition = originalFileName.lastIndexOf(".");

  const dirname = parts.slice(0, parts.length - 1).join("/");
  const basename =
    dotPosition === -1
      ? originalFileName
      : originalFileName.substring(0, dotPosition);
  const extension =
    dotPosition === -1 ? "" : originalFileName.substring(dotPosition);

  return [dirname, basename, extension];
};

const genFilePath = (dirname, basename, extension) => {
  let dirPrefix = "";
  if (dirname) {
    dirPrefix += dirname + "/";
  }

  if (extension && !extension.startsWith(".")) {
    extension = "." + extension;
  }

  return dirPrefix + basename + extension;
};

const getRevisionedFilePath = (filePath, revision) => {
  const [dirname, basename, extension] = parseFilePath(filePath);
  return genFilePath(dirname, `${basename}.${revision}`, extension);
};

const revisioned = (filePath) => {
  if (!hexo.theme.config.cdn_version) {
    return filePath;
  }
  let arg = process.argv[2];
  if (arg == "s" || arg == "server") {
    return filePath
  }
  return getRevisionedFilePath(filePath, `!!revision:${filePath}!!`);
};

hexo.extend.helper.register("revisioned", revisioned);

const calcFileHash = async (filePath) => {
  if (hexo.route.get(filePath)) {
    const buffer = await stream2buffer(hexo.route.get(filePath));
    const fileHash = crypto.createHash("md5").update(buffer).digest('hex').substring(0, 8);
    return fileHash;
  } else {
    // 随机生成 hash
    return crypto.randomBytes(16).toString('hex').substring(0, 8);
  }

};

const replaceRevisionPlaceholder = async () => {

  if (!hexo.theme.config.cdn_version) {
    return;
  }
  try {
    const options = hexo.config.new_revision || {};
    const include = options.include || [];
  
    const hashPromiseMap = {};
    const hashMap = {};
    const doHash = (filePath) =>
      calcFileHash(filePath).then((hash) => {
        hashMap[filePath] = hash;
      });
  
    await Promise.all(
      hexo.route.list().map(async (path) => {
        const [, , extension] = parseFilePath(path);
        if (![".css", ".js", ".html"].includes(extension)) {
          return;
        }
  
        let fileContent = await readFileAsString(path);
  
        const regexp = /\.!!revision:([^\)]+?)!!/g;
        const matchResult = [...fileContent.matchAll(regexp)];
        if (matchResult.length) {
          const hashTaskList = [];
  
          // 异步获取文件 hash
          matchResult.forEach((group) => {
            const filePath = group[1];
            if (!(filePath in hashPromiseMap)) {
              hashPromiseMap[filePath] = doHash(filePath);
            }
            hashTaskList.push(hashPromiseMap[filePath]);
          });
  
          // 等待全部 hash 完成
          await Promise.all(hashTaskList);
  
          // 替换 placeholder
          fileContent = fileContent.replace(regexp, function (match, filePath) {
            if (!(filePath in hashMap)) {
              throw new Error("file hash not computed");
            }
            return "." + hashMap[filePath];
          });
  
          hexo.route.set(path, fileContent);
        }
      })
    );
  
    await Promise.all(
      hexo.route.list().map(async (path) => {
        for (let i = 0, len = include.length; i < len; i++) {
          if (minimatch(path, include[i])) {
            return doHash(path);
          }
        }
      })
    );
  
    await Promise.all(
      Object.keys(hashMap).map(async (filePath) => {
        hexo.route.set(
          getRevisionedFilePath(filePath, hashMap[filePath]),
          await readFileAsBuffer(filePath)
        );
        hexo.route.remove(filePath);
      })
    );
  } catch (error) {
    hexo.log.error("cdn_version ERROR: " + error);
  }
};

hexo.extend.filter.register("after_generate", replaceRevisionPlaceholder,9999);