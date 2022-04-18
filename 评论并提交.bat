chcp 65001
call cls
@echo off
echo -----按任意键开始-----
pause > nul
cd  %~dp0
SET /p COMMIT=评论: 
call git add .
call git commit -m "%COMMIT%"
call git push
echo -----命令执行结束，按任意键结束-----
pause > nul