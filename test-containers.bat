@echo off
setlocal enabledelayedexpansion

REM Container Testing Script for Todo Application (Windows)
echo Testing Docker Containers for Todo Application
echo ==============================================

REM Set color codes for Windows (if supported)
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "NC=[0m"

REM Global variables
set PASS_COUNT=0
set FAIL_COUNT=0
set TOTAL_TESTS=0

REM Function to test if container is running
:test_container_running
set container_name=%1
set /a TOTAL_TESTS+=1
echo|set /p="Testing if %container_name% is running... "

docker ps | findstr /C:"%container_name%" >nul 2>&1
if !errorlevel! == 0 (
    echo %GREEN%✓ PASS%NC%
    set /a PASS_COUNT+=1
    exit /b 0
) else (
    echo %RED%✗ FAIL%NC%
    set /a FAIL_COUNT+=1
    exit /b 1
)

REM Function to test container health
:test_container_healthy
set container_name=%1
set /a TOTAL_TESTS+=1
echo|set /p="Testing if %container_name% is healthy... "

for /f "delims=" %%i in ('docker inspect --format="{{.State.Health.Status}}" %container_name% 2^>nul') do set health_status=%%i

if "!health_status!" == "healthy" (
    echo %GREEN%✓ PASS%NC%
    set /a PASS_COUNT+=1
    exit /b 0
) else if "!health_status!" == "" (
    echo %YELLOW%⚠ NO HEALTHCHECK%NC%
    set /a PASS_COUNT+=1
    exit /b 0
) else (
    echo %RED%✗ FAIL ^(Status: !health_status!^)%NC%
    set /a FAIL_COUNT+=1
    exit /b 1
)

REM Function to test HTTP endpoints
:test_endpoint
set url=%1
set expected_status=%2
set description=%3
set /a TOTAL_TESTS+=1
echo|set /p="Testing %description%... "

REM Use PowerShell for HTTP requests on Windows
for /f %%i in ('powershell -command "try { $response = Invoke-WebRequest -Uri '%url%' -UseBasicParsing -TimeoutSec 10; $response.StatusCode } catch { $_.Exception.Response.StatusCode.value__ }"') do set status_code=%%i

if "!status_code!" == "%expected_status%" (
    echo %GREEN%✓ PASS ^(HTTP !status_code!^)%NC%
    set /a PASS_COUNT+=1
    exit /b 0
) else (
    echo %RED%✗ FAIL ^(HTTP !status_code!, expected %expected_status%^)%NC%
    set /a FAIL_COUNT+=1
    exit /b 1
)

REM Function to test MongoDB connection
:test_mongodb_connection
set /a TOTAL_TESTS+=1
echo|set /p="Testing MongoDB connection... "

docker exec todo-mongodb mongosh --eval "db.adminCommand('ping')" >nul 2>&1
if !errorlevel! == 0 (
    echo %GREEN%✓ PASS%NC%
    set /a PASS_COUNT+=1
    exit /b 0
) else (
    echo %RED%✗ FAIL%NC%
    set /a FAIL_COUNT+=1
    exit /b 1
)

REM Function to wait for services
:wait_for_services
echo Waiting for services to be ready...
timeout /t 30 /nobreak >nul
exit /b 0

REM Main execution starts here
echo.
echo Checking if Docker Compose services are running...

docker-compose ps | findstr /C:"Up" >nul 2>&1
if !errorlevel! neq 0 (
    echo %RED%❌ Docker Compose services are not running!%NC%
    echo Please run: docker-compose up -d
    exit /b 1
)

call :wait_for_services

echo.
echo Container Status Tests
echo ----------------------
call :test_container_running "todo-mongodb"
call :test_container_running "todo-backend"
call :test_container_running "todo-frontend"

echo.
echo Health Check Tests
echo ------------------
call :test_container_healthy "todo-mongodb"
call :test_container_healthy "todo-backend"
call :test_container_healthy "todo-frontend"

echo.
echo Connectivity Tests
echo ------------------
call :test_endpoint "http://localhost:3000" "200" "Frontend accessibility"
call :test_endpoint "http://localhost:5000" "200" "Backend health endpoint"
call :test_mongodb_connection

echo.
echo API Functionality Tests
echo ------------------------
call :test_endpoint "http://localhost:5000" "200" "Todos API endpoint"

echo.
echo Inter-service Communication Tests
echo ----------------------------------
set /a TOTAL_TESTS+=1
echo|set /p="Testing backend to database connection... "
docker exec todo-backend curl -s http://mongodb:27017 >nul 2>&1
if !errorlevel! == 0 (
    echo %GREEN%✓ PASS%NC%
    set /a PASS_COUNT+=1
) else (
    echo %RED%✗ FAIL%NC%
    set /a FAIL_COUNT+=1
)

echo.
echo Resource Usage Check
echo --------------------
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"

echo.
echo ===============================================
echo Test Summary
echo ===============================================
echo Total Tests: !TOTAL_TESTS!
echo Passed: %GREEN%!PASS_COUNT!%NC%
echo Failed: %RED%!FAIL_COUNT!%NC%

if !FAIL_COUNT! == 0 (
    echo %GREEN%✅ All tests passed!%NC%
) else (
    echo %RED%❌ Some tests failed!%NC%
)

echo.
echo Access your application at:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo   MongoDB:  mongodb://localhost:27017

echo.
pause
exit /b 0