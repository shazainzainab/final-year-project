# 🚀 ViaItalia Backend - Quick Start

## ⚡ Immediate Setup (2 minutes)

### 1. Test Basic Server (No Database Required)
```bash
# Test if Node.js setup is working
npm test

# You should see:
# 🧪 ViaItalia Test Server (No Database)
# 📍 Server running on: http://localhost:3000
# ✅ Test server ready!

# Test API endpoints:
curl http://localhost:3000/api/v1/health
curl http://localhost:3000/api/v1/destinations
```

### 2. Database Quick Setup (Docker - Recommended)
```bash
# Start SQL Server in Docker (easiest method)
docker run -e "ACCEPT_EULA=Y" \
  -e "MSSQL_SA_PASSWORD=YourStrongPassword123" \
  -p 1433:1433 \
  --name sqlserver2019 \
  --restart unless-stopped \
  -d mcr.microsoft.com/mssql/server:2019-latest

# Wait 30 seconds for container to start, then import database
sleep 30
docker cp TravelDB.sql sqlserver2019:/tmp/TravelDB.sql
docker exec -it sqlserver2019 /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P YourStrongPassword123 -i /tmp/TravelDB.sql
```

### 3. Verify Database Connection
```bash
# Test database connectivity
npm run setup-db

# You should see:
# ✅ Database connection successful!
# ✅ Table Cities: X records found
# ✅ Table Hotels: X records found
```

### 4. Start Full Backend Server
```bash
# Start the complete backend with database
npm start

# You should see:
# 🚀 ViaItalia Backend Server Started Successfully!
# 📍 Server running on: http://localhost:3000
# ✨ Ready to serve travel recommendations!
```

### 5. Test Complete API
```bash
# Test health
curl http://localhost:3000/api/v1/health

# Test real destinations (from database)
curl http://localhost:3000/api/v1/destinations

# Test recommendation generation
curl -X POST http://localhost:3000/api/v1/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Rome",
    "startDate": "2024-06-01",
    "days": 3,
    "budget": "medium",
    "companion": "couple",
    "activities": ["City Views", "Food Street"],
    "foodPreference": "vegetarian",
    "additionalPreferences": "Romantic places"
  }'
```

## 📱 Frontend Integration

### Update Your Recommendation Form
Add this to your `recommendation form.html`:
```html
<!-- Add before closing </body> tag -->
<script src="frontend-integration-example.js"></script>
```

### Test Frontend Integration
1. Open `recommendation form.html` in browser
2. Fill the form
3. Click "Submit"
4. Should redirect to `Result.html` with recommendation data

## 🛠️ Alternative Database Setup Methods

### If Docker is not available:

#### Windows - SQL Server Express
```bash
# 1. Download from: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
# 2. Install with Mixed Mode Authentication
# 3. Set SA password: YourStrongPassword123
# 4. Enable TCP/IP in SQL Server Configuration Manager
# 5. Import database using SQL Server Management Studio
```

#### Linux - Native SQL Server
```bash
# Ubuntu/Debian
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
sudo add-apt-repository "$(wget -qO- https://packages.microsoft.com/config/ubuntu/20.04/mssql-server-2019.list)"
sudo apt-get update && sudo apt-get install -y mssql-server
sudo /opt/mssql/bin/mssql-conf setup

# Import database
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrongPassword123 -i TravelDB.sql
```

## 🌐 Deployment Options

### Local Development (Current Setup)
```bash
# Already running on: http://localhost:3000
# Perfect for development and testing
```

### Vercel (Serverless - Easy)
```bash
npm install -g vercel
vercel login
vercel
# Set environment variables in Vercel dashboard
```

### Heroku (Platform as a Service)
```bash
heroku create viaitalia-backend
heroku config:set DB_SERVER=your_azure_server.database.windows.net
heroku config:set DB_DATABASE=TravelDB
heroku config:set DB_USER=your_username
heroku config:set DB_PASSWORD=your_password
git push heroku main
```

## 🔧 Troubleshooting

### Backend won't start?
```bash
# Check Node.js version (need v16+)
node --version

# Reinstall dependencies
rm -rf node_modules
npm install

# Test without database first
npm test
```

### Database connection failed?
```bash
# Check if SQL Server is running
docker ps | grep sqlserver

# Or for native install:
# Windows: services.msc → SQL Server (SQLEXPRESS)
# Linux: sudo systemctl status mssql-server

# Test connection manually
npm run setup-db
```

### Port 3000 in use?
```bash
# Change port in .env file
echo "PORT=3001" >> .env
npm start
```

### CORS errors with frontend?
```bash
# Update CORS origin in .env
echo "CORS_ORIGIN=http://localhost:8080" >> .env
# Replace with your frontend URL
```

## 📞 Need Help?

1. **Quick Test**: Run `npm test` to verify basic setup
2. **Database Issues**: Run `npm run setup-db` for diagnostics  
3. **Check Logs**: Look at console output for specific errors
4. **Read Full Guide**: See `SETUP_GUIDE.md` for detailed instructions
5. **API Documentation**: Check `docs/API_DOCUMENTATION.md`

## ✅ Success Indicators

- ✅ `npm test` shows test server running
- ✅ `npm run setup-db` shows all tables found
- ✅ `npm start` shows "Ready to serve travel recommendations!"
- ✅ `curl http://localhost:3000/api/v1/health` returns success
- ✅ Frontend form submission works and redirects to results

---

**🎉 You're ready to go! Your ViaItalia travel recommendation backend is fully functional!**

Next: Update your frontend JavaScript to connect to the backend, and start generating amazing travel recommendations for Italy! 🇮🇹