# 🚀 ViaItalia Backend Setup Guide

## 📋 Complete Step-by-Step Setup

### Step 1: Database Server Setup

#### Option A: SQL Server Express (Windows/Linux)

**Windows:**
```bash
# 1. Download SQL Server Express from Microsoft
# https://www.microsoft.com/en-us/sql-server/sql-server-downloads

# 2. During installation:
# - Choose "Custom" installation
# - Enable "Mixed Mode Authentication"
# - Set strong password for 'sa' user: YourStrongPassword123

# 3. Enable TCP/IP Protocol
# Open SQL Server Configuration Manager
# Go to: SQL Server Network Configuration → Protocols for SQLEXPRESS
# Right-click TCP/IP → Enable
# Restart SQL Server service

# 4. Test connection
sqlcmd -S localhost -U sa -P YourStrongPassword123
```

**Linux:**
```bash
# 1. Install SQL Server on Ubuntu/Linux
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
sudo add-apt-repository "$(wget -qO- https://packages.microsoft.com/config/ubuntu/20.04/mssql-server-2019.list)"
sudo apt-get update
sudo apt-get install -y mssql-server

# 2. Configure SQL Server
sudo /opt/mssql/bin/mssql-conf setup
# Choose edition: Express (free)
# Set SA password: YourStrongPassword123

# 3. Install SQL Server command-line tools
curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list | sudo tee /etc/apt/sources.list.d/msprod.list
sudo apt-get update
sudo apt-get install mssql-tools unixodbc-dev

# 4. Test connection
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrongPassword123
```

#### Option B: Docker (Recommended for Development)

```bash
# 1. Pull and run SQL Server Docker container
docker run -e "ACCEPT_EULA=Y" \
  -e "MSSQL_SA_PASSWORD=YourStrongPassword123" \
  -p 1433:1433 \
  --name sqlserver2019 \
  --restart unless-stopped \
  -d mcr.microsoft.com/mssql/server:2019-latest

# 2. Check if container is running
docker ps

# 3. Test connection
docker exec -it sqlserver2019 /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P YourStrongPassword123

# 4. Import database
docker cp TravelDB.sql sqlserver2019:/tmp/TravelDB.sql
docker exec -it sqlserver2019 /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P YourStrongPassword123 -i /tmp/TravelDB.sql
```

#### Option C: Cloud Database (Production)

**Azure SQL Database:**
```bash
# 1. Create Azure SQL Database
az sql server create \
  --name viaitalia-server \
  --resource-group myResourceGroup \
  --location "East US" \
  --admin-user sqladmin \
  --admin-password YourStrongPassword123

# 2. Create database
az sql db create \
  --resource-group myResourceGroup \
  --server viaitalia-server \
  --name TravelDB \
  --service-objective Basic

# 3. Update .env file
DB_SERVER=viaitalia-server.database.windows.net
DB_DATABASE=TravelDB
DB_USER=sqladmin
DB_PASSWORD=YourStrongPassword123
```

### Step 2: Database Import

```bash
# Method 1: Using SQL Server Management Studio (Windows)
# 1. Connect to your SQL Server instance
# 2. Right-click on Databases → Restore Database
# 3. Choose Device → Add File → Select TravelDB.sql
# 4. Click OK to restore

# Method 2: Using sqlcmd (Command Line)
sqlcmd -S localhost -U sa -P YourStrongPassword123 -i TravelDB.sql

# Method 3: Using Docker
docker exec -it sqlserver2019 /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P YourStrongPassword123 -i /tmp/TravelDB.sql
```

### Step 3: Backend Configuration

```bash
# 1. Update .env file with your database credentials
DB_SERVER=localhost
DB_DATABASE=TravelDB
DB_USER=sa
DB_PASSWORD=YourStrongPassword123
DB_PORT=1433

# 2. Test database connection
node scripts/setupDatabase.js

# You should see:
# ✅ Database connection successful!
# ✅ Table Cities: X records found
# ✅ Table Hotels: X records found
# ... etc
```

### Step 4: Start the Backend Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start

# You should see:
# 🚀 ViaItalia Backend Server Started Successfully!
# 📍 Server running on: http://localhost:3000
# ✨ Ready to serve travel recommendations!
```

### Step 5: Test the API

```bash
# Test health endpoint
curl http://localhost:3000/api/v1/health

# Expected response:
# {
#   "success": true,
#   "message": "ViaItalia API is running successfully",
#   "timestamp": "2024-01-01T00:00:00.000Z",
#   "version": "1.0.0"
# }

# Test destinations endpoint
curl http://localhost:3000/api/v1/destinations

# Test recommendation generation
curl -X POST http://localhost:3000/api/v1/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Rome, Italy",
    "startDate": "2024-06-01",
    "days": 3,
    "budget": "medium",
    "companion": "couple",
    "activities": ["City Views", "Food Street"],
    "foodPreference": "vegetarian",
    "additionalPreferences": "Romantic places"
  }'
```

## 🌐 Server Deployment Options

### Local Development Server
```bash
# Already running on localhost:3000
# Perfect for development and testing
# Access: http://localhost:3000
```

### Cloud Deployment

#### 1. Vercel (Serverless - Recommended for API)
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# - DB_SERVER
# - DB_DATABASE  
# - DB_USER
# - DB_PASSWORD
# - DB_PORT
```

#### 2. Heroku (Platform as a Service)
```bash
# Install Heroku CLI
# Create new app
heroku create viaitalia-backend

# Set environment variables
heroku config:set DB_SERVER=your_server
heroku config:set DB_DATABASE=TravelDB
heroku config:set DB_USER=your_username
heroku config:set DB_PASSWORD=your_password
heroku config:set NODE_ENV=production

# Deploy
git add .
git commit -m "Initial deployment"
git push heroku main

# Open app
heroku open
```

#### 3. DigitalOcean Droplet (VPS)
```bash
# Create Ubuntu 20.04 droplet
# SSH into your droplet
ssh root@your_droplet_ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 for process management
npm install pm2 -g

# Create app directory
mkdir /var/www/viaitalia-backend
cd /var/www/viaitalia-backend

# Clone your repository
git clone your_repo_url .

# Install dependencies
npm install --production

# Create .env file
nano .env
# Add your environment variables

# Start with PM2
pm2 start server.js --name viaitalia-backend

# Setup PM2 to start on boot
pm2 startup
pm2 save

# Setup Nginx reverse proxy (optional)
apt install nginx -y
nano /etc/nginx/sites-available/viaitalia-backend

# Add Nginx configuration:
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
ln -s /etc/nginx/sites-available/viaitalia-backend /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 4. AWS EC2 (Scalable Cloud)
```bash
# Launch EC2 instance (t3.micro for free tier)
# Security group: Allow HTTP (80), HTTPS (443), SSH (22), and 3000

# SSH into instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Clone and setup
git clone your_repo_url viaitalia-backend
cd viaitalia-backend
npm install --production

# Configure environment
cp .env.example .env
nano .env

# Install and configure PM2
npm install pm2 -g
pm2 start server.js --name viaitalia-backend
pm2 startup
pm2 save
```

## 🔧 Troubleshooting Guide

### Database Connection Issues

**Problem:** `Failed to connect to localhost:1433`
```bash
# Solution 1: Check if SQL Server is running
# Windows:
services.msc → Look for SQL Server (SQLEXPRESS)

# Linux:
sudo systemctl status mssql-server

# Docker:
docker ps | grep sqlserver

# Solution 2: Enable TCP/IP Protocol
# Use SQL Server Configuration Manager
# Enable TCP/IP under Network Configuration

# Solution 3: Check firewall
# Windows: Allow port 1433 in Windows Firewall
# Linux: sudo ufw allow 1433
```

**Problem:** `Login failed for user 'sa'`
```bash
# Solution: Reset SA password
# In SQL Server Management Studio:
# Security → Logins → sa → Properties → Set new password

# Command line:
ALTER LOGIN sa WITH PASSWORD = 'YourStrongPassword123';
ALTER LOGIN sa ENABLE;
```

### Port Conflicts

**Problem:** `Port 3000 already in use`
```bash
# Solution 1: Find and kill process
# Windows:
netstat -ano | findstr :3000
taskkill /PID <process_id> /F

# Linux:
lsof -ti:3000 | xargs kill -9

# Solution 2: Change port in .env
PORT=3001
```

### CORS Issues

**Problem:** `CORS policy blocked`
```bash
# Solution: Update CORS origin in .env
CORS_ORIGIN=http://localhost:8080
# Or your frontend URL
```

### Performance Issues

**Database Optimization:**
```sql
-- Add indexes for better performance
CREATE INDEX IX_Cities_CityName ON Cities(CityName);
CREATE INDEX IX_Hotels_CityID_Rating ON Hotels(CityID, Rating DESC);
CREATE INDEX IX_Restaurants_CityID_Rating ON Restaurants(CityID, Rating DESC);
CREATE INDEX IX_AttractionPlaces_CityID ON AttractionPlaces(CityID);
CREATE INDEX IX_Beaches_CityID ON Beaches(CityID);
CREATE INDEX IX_ShoppingMalls_CityID ON ShoppingMalls(CityID);
```

**Server Optimization:**
```javascript
// PM2 cluster mode (ecosystem.config.js)
module.exports = {
  apps: [{
    name: 'viaitalia-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};

// Run with: pm2 start ecosystem.config.js
```

## 📊 Monitoring & Maintenance

### Health Monitoring
```bash
# Check API health
curl http://localhost:3000/api/v1/health

# Monitor with PM2
pm2 monit

# View logs
pm2 logs viaitalia-backend
```

### Database Backup
```bash
# Backup database
sqlcmd -S localhost -U sa -P YourPassword \
  -Q "BACKUP DATABASE TravelDB TO DISK = 'C:\backup\TravelDB.bak'"

# Restore database
sqlcmd -S localhost -U sa -P YourPassword \
  -Q "RESTORE DATABASE TravelDB FROM DISK = 'C:\backup\TravelDB.bak'"
```

## 🎯 Success Checklist

- [ ] ✅ SQL Server installed and running
- [ ] ✅ TravelDB database imported successfully  
- [ ] ✅ Database connection test passes
- [ ] ✅ Backend server starts without errors
- [ ] ✅ Health endpoint responds correctly
- [ ] ✅ Destinations endpoint returns data
- [ ] ✅ Recommendation endpoint generates results
- [ ] ✅ Frontend integration working
- [ ] ✅ Server deployed (if production)

## 🆘 Support

If you encounter any issues:

1. **Check logs**: Look at console output and error messages
2. **Verify configuration**: Ensure .env file has correct database credentials
3. **Test connection**: Run `node scripts/setupDatabase.js`
4. **Check services**: Ensure SQL Server and Node.js are running
5. **Review documentation**: Check API_DOCUMENTATION.md for endpoint details

---

**🎉 Congratulations! Your ViaItalia Travel Recommendation Backend is ready!**

Once everything is set up, your system will be able to:
- Generate personalized travel recommendations
- Provide day-wise itineraries
- Suggest hotels based on budget
- Recommend restaurants based on food preferences
- Handle multiple activity preferences
- Scale to handle multiple users