# ViaItalia Backend

This Node.js project powers the ViaItalia travel-recommendation engine and consumes the existing `TravelDB` SQL Server database.

---

## 1. Prerequisites

1. **Node.js v18+** (Download from https://nodejs.org/)
2. **SQL Server 2019/2022** (Any edition) or **Azure SQL / AWS RDS SQL Server** instance that contains the data from `TravelDB.sql`.
3. **npm** (comes with Node) or **yarn** for dependency installation.

> 💡 **Quick local setup** (Docker)
>
> ```bash
> docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=YourStrong!Passw0rd' \
>   -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2022-latest
> ```
>
> Once the container is running, connect with any SQL client (e.g. VS Code SQL Tools, Azure Data Studio or `sqlcmd`) and execute the **TravelDB.sql** script to create all tables & seed data.

---

## 2. Configuration

Copy `.env.example` ➜ `.env` and tweak the connection parameters

```bash
cp .env.example .env
nano .env   # or any editor
```

---

## 3. Install & Run

```bash
cd backend
npm install   # installs dependencies
npm run dev   # starts server with nodemon (auto-reload)
```

If everything is correct you will see:

```
✅ Connected to MSSQL
🚀 Server listening on port 5000
```

### Production start

```bash
npm run start
```

---

## 4. API Reference

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST   | `/api/recommendations` | Returns best trip plan based on form payload |
| GET    | `/api/destinations` | List all cities / destinations |
| GET    | `/api/destinations/:id/hotels` | Hotels in given city |

### Example payload (`POST /api/recommendations`)

```json
{
  "destination": "Rome",
  "startDate": "2024-08-10",
  "days": 5,
  "budget": "medium",
  "travelType": "couple",
  "activities": ["beaches", "foodstreet"],
  "foodPreference": "halal",
  "additional": "Prefer public transport"
}
```

---

## 5. Deploying

### A. Node + SQL Server on **Azure**

1. Create *Azure SQL Database* and import `TravelDB`.
2. Create *Azure App Service (Linux)* and enable CI/CD or push the code through GitHub.
3. Set the environment variables of the App Service (found in `.env.example`).

### B. Node + SQL Server on **AWS**

1. Launch *Amazon RDS SQL Server* instance and run `TravelDB.sql`.
2. Deploy backend via *Elastic Beanstalk* or *AWS Fargate* using the provided Dockerfile.

### C. **On-prem / VPS**

1. Install SQL Server 2019 on the same machine or accessible LAN.
2. Install Node.js and set the project as a systemd service or run with PM2.

---

## 6. Useful commands

| Command | Purpose |
| ------- | ------- |
| `npm run dev` | Start dev server with auto-reload |
| `npm run start` | Start prod server |
| `npm audit` | Security audit |

---

## 7. Support

If you have questions, open an issue or ping the development team.