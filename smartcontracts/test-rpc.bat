@echo off
echo Testing RPC connectivity...
echo.
powershell -ExecutionPolicy Bypass -File test-rpc-direct.ps1
pause
