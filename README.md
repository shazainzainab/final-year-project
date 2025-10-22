# 🇮🇹 ViaItalia Travel Recommendation System Backend

ViaItalia एक comprehensive travel recommendation system है जो Italy के लिए personalized travel plans generate करता है। यह Node.js backend आपके MSSQL database के साथ integrate करके intelligent travel recommendations provide करता है।

## 🚀 Features

- **Smart Recommendations**: Advanced algorithm जो user preferences के based पर personalized travel plans बनाता है
- **Complete Travel Planning**: Hotels, attractions, restaurants, और day-wise itinerary
- **Multi-Activity Support**: Beaches, city views, outdoor plans, events, rivers, food streets, shopping malls, nightlife
- **Budget-Based Planning**: Low, medium, high budget options
- **Companion-Specific Plans**: Solo, couple, family, friends के लिए अलग recommendations
- **Food Preference Support**: Halal, vegetarian, non-vegetarian options
- **RESTful API**: Well-documented और easy-to-use endpoints
- **Real-time Database Integration**: Direct MSSQL database connection
- **Error Handling**: Comprehensive error handling और validation

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Microsoft SQL Server** (2017 or higher)
- **npm** या **yarn** package manager
- **SQL Server Management Studio** (optional, for database management)

## 🛠️ Installation & Setup

### Step 1: Clone और Navigate
```bash
cd /workspace
# Files already exist in your workspace
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Database Setup

#### Option A: SQL Server को Local Install करें
1. **SQL Server Express Download करें:**
   - Microsoft की official website से SQL Server Express download करें
   - Installation wizard follow करें
   - Mixed Mode Authentication enable करें
   - sa user के लिए strong password set करें

2. **SQL Server Configuration Manager में TCP/IP enable करें:**
   ```
   SQL Server Configuration Manager → SQL Server Network Configuration → 
   Protocols for SQLEXPRESS → TCP/IP → Enable
   ```

3. **Database Import करें:**
   ```bash
   # SQL Server Management Studio में connect करें
   # Right-click on Databases → Restore Database
   # या command line से:
   sqlcmd -S localhost -U sa -P YourPassword -i TravelDB.sql
   ```

#### Option B: Docker से SQL Server Run करें
```bash
# SQL Server Docker container run करें
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrongPassword123" \
   -p 1433:1433 --name sqlserver \
   -d mcr.microsoft.com/mssql/server:2019-latest

# Database को container में import करें
docker cp TravelDB.sql sqlserver:/TravelDB.sql
docker exec -it sqlserver /opt/mssql-tools/bin/sqlcmd \
   -S localhost -U sa -P YourStrongPassword123 -i /TravelDB.sql
```

### Step 4: Environment Configuration
```bash
# .env file already exists, update database credentials:
DB_SERVER=localhost
DB_DATABASE=TravelDB
DB_USER=sa
DB_PASSWORD=YourStrongPassword123
DB_PORT=1433
```

### Step 5: Database Connection Test
```bash
# Test database connection
node scripts/setupDatabase.js
```

### Step 6: Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server start होने के बाद आप देखेंगे:
```
🚀 ViaItalia Backend Server Started Successfully!
📍 Server running on: http://localhost:3000
📊 API Base URL: http://localhost:3000/api/v1
✨ Ready to serve travel recommendations!
```

## 🌐 Server Deployment

### Option 1: Local Development Server
```bash
# Already running on localhost:3000
# Perfect for development और testing
```

### Option 2: Cloud Deployment (Recommended)

#### Deploy on Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

#### Deploy on Heroku
```bash
# Install Heroku CLI
# Create Heroku app
heroku create viaitalia-backend

# Set environment variables
heroku config:set DB_SERVER=your_server
heroku config:set DB_DATABASE=TravelDB
heroku config:set DB_USER=your_username
heroku config:set DB_PASSWORD=your_password

# Deploy
git add .
git commit -m "Deploy ViaItalia backend"
git push heroku main
```

#### Deploy on DigitalOcean Droplet
```bash
# Create Ubuntu droplet
# SSH into droplet
ssh root@your_droplet_ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Clone your code
git clone your_repo_url
cd viaitalia-backend

# Install dependencies
npm install

# Configure environment variables
nano .env

# Start with PM2
pm2 start server.js --name "viaitalia-backend"
pm2 startup
pm2 save
```

### Option 3: Database Server Options

#### Azure SQL Database (Recommended for Production)
```bash
# Create Azure SQL Database
# Update .env with Azure connection details:
DB_SERVER=your-server.database.windows.net
DB_DATABASE=TravelDB
DB_USER=your_username
DB_PASSWORD=your_password
```

#### AWS RDS SQL Server
```bash
# Create RDS SQL Server instance
# Update connection details
DB_SERVER=your-rds-endpoint.amazonaws.com
```

## 📊 API Usage

### Health Check
```bash
curl http://localhost:3000/api/v1/health
```

### Generate Recommendation
```bash
curl -X POST http://localhost:3000/api/v1/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Rome, Italy",
    "startDate": "2024-06-01",
    "days": 5,
    "budget": "medium",
    "companion": "couple",
    "activities": ["City Views", "Food Street"],
    "foodPreference": "vegetarian",
    "additionalPreferences": "Romantic places preferred"
  }'
```

### Frontend Integration Example
```javascript
// आपके existing frontend code में integrate करें
const form = document.querySelector('.trip-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    destination: document.getElementById('destination-input').value,
    startDate: document.getElementById('date-picker').value,
    days: parseInt(document.querySelector('.counter-value').textContent),
    budget: document.querySelector('input[name="budget"]:checked').nextElementSibling.querySelector('.card-title').textContent.toLowerCase(),
    companion: document.querySelector('input[name="companion"]:checked').nextElementSibling.querySelector('.card-title').textContent.toLowerCase(),
    activities: Array.from(document.querySelectorAll('input[name="activity"]:checked')).map(cb => 
      cb.nextElementSibling.querySelector('.card-title-bold').textContent
    ),
    foodPreference: document.querySelector('input[name="food"]:checked').parentElement.querySelector('.radio-label').textContent.toLowerCase(),
    additionalPreferences: document.querySelector('.form-textarea').value
  };

  try {
    const response = await fetch('http://localhost:3000/api/v1/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    
    if (result.success) {
      // Redirect to result page with data
      localStorage.setItem('travelRecommendation', JSON.stringify(result.data));
      window.location.href = 'Result.html';
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to generate recommendation');
  }
});
```

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Error
```bash
# Check if SQL Server is running
# Windows:
services.msc → SQL Server (SQLEXPRESS)

# Linux/Docker:
docker ps | grep sqlserver

# Test connection manually
node scripts/setupDatabase.js
```

#### Port Already in Use
```bash
# Check what's using port 3000
netstat -ano | findstr :3000

# Kill the process or change port in .env
PORT=3001
```

#### CORS Issues
```bash
# Update CORS_ORIGIN in .env
CORS_ORIGIN=http://localhost:8080
# या आपका frontend URL
```

### Performance Optimization

#### Database Query Optimization
```sql
-- Add indexes for better performance
CREATE INDEX IX_Cities_CityName ON Cities(CityName);
CREATE INDEX IX_Hotels_CityID_Rating ON Hotels(CityID, Rating);
CREATE INDEX IX_Restaurants_CityID_Rating ON Restaurants(CityID, Rating);
```

#### Server Configuration
```javascript
// PM2 ecosystem file (ecosystem.config.js)
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
```

## 📁 Project Structure

```
viaitalia-backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   └── recommendationController.js  # API controllers
├── middleware/
│   └── errorHandler.js      # Error handling middleware
├── models/
│   └── recommendationModel.js # Database models
├── routes/
│   └── recommendationRoutes.js # API routes
├── scripts/
│   └── setupDatabase.js     # Database setup script
├── utils/
│   └── responseFormatter.js # Response formatting utilities
├── docs/
│   └── API_DOCUMENTATION.md # Complete API documentation
├── server.js               # Main server file
├── package.json            # Dependencies
├── .env                    # Environment variables
└── README.md              # This file
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/destinations` | Get all destinations |
| POST | `/api/v1/recommend` | **Main endpoint** - Generate recommendation |
| GET | `/api/v1/cities/:cityName` | Get city details |
| GET | `/api/v1/hotels` | Get hotels by city and budget |
| GET | `/api/v1/attractions/:cityName` | Get attractions |
| GET | `/api/v1/restaurants/:cityName` | Get restaurants |

## 📖 Documentation

- **Complete API Documentation**: `docs/API_DOCUMENTATION.md`
- **Database Setup Guide**: `scripts/setupDatabase.js`
- **Environment Configuration**: `.env.example`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

अगर आपको कोई issue आता है तो:

1. **Database connection issues**: `scripts/setupDatabase.js` run करें
2. **API not working**: `http://localhost:3000/api/v1/health` check करें
3. **Frontend integration**: API documentation में examples देखें
4. **Performance issues**: Database indexes add करें

## 🎯 Next Steps

1. **Start the server**: `npm start`
2. **Test API**: `http://localhost:3000/api/v1/health`
3. **Integrate with frontend**: Update your form submission code
4. **Deploy to production**: Choose cloud provider और deploy करें

---

**🎉 Congratulations! आपका ViaItalia Travel Recommendation Backend ready है!**

Server successfully start होने के बाद आप अपने frontend को इस backend के साथ connect कर सकते हैं और complete travel recommendation system use कर सकते हैं।