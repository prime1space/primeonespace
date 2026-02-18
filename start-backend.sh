#!/bin/bash
echo "Starting Backend Server on http://127.0.0.1:8001..."
cd backend/php/api
php -S 127.0.0.1:8001 router.php
