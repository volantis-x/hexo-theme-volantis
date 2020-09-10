#!/bin/bash
#
# https://volantis.js.org
#
# 只有 rc 阶段的测试版本和正式版本发布到 npm
#
# 1. 输入要发布的版本号
# 2. 修改主题 _config.yml 中的 info.theme_version
# 3. 修改主题 package.json 中的 version
# 4. 提交 commit

# 版本号 例如 4.0.0-rc.1
VERSION=$1

# 替换版本号
function prepare() {
  text="'"${VERSION}"'"" # This is theme's version."
  sed -i "" "s/^  theme_version:\([^\"]\{1,\}\)/  theme_version: ${text}/g" '_config.yml'
  sed -i "" "s/^  \"version\":\([^,]\{1,\}\)/  \"version\": \"${VERSION}\"/g" 'package.json'
}

# 提交
function commit() {
  msg="release: ${VERSION}"

  printf "\n\n> \033[32m%s\033[0m" 'git add --all'
  printf "\n"
  git add --all

  printf "\n\n> \033[32m%s\033[0m" 'git commit -m'
  printf " \033[35m%s\033[0m" ${msg}
  printf "\n"
  git commit -m "${msg}"

  # 变基到 master 分支
  git checkout master
  git rebase dev
  # 切换回 dev 开发分支
  git checkout dev
  
  # 推送
  printf "\n\n> \033[32m%s\033[0m" 'git push origin --all'
  printf "\n"
  git push origin --all

  # done
  printf "\n\n> \033[32m%s\033[0m\n" 'Congratulations!'
}


while :
do
  case $VERSION in
    '')
      read -p "请输入要发布的版本号: " VERSION
    ;;
    *)
    break
    ;;
  esac
done

prepare && commit
