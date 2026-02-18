@echo off
echo Fixing database issues...

echo Adding session table...
mysql -u root -p -e "source add_session_table.sql"

echo Adding missing users...
mysql -u root -p -e "source add_missing_users.sql"

echo Database fixes completed!
pause