# 🚀 Quick Start Commands

## Prerequisites
- Node.js installed
- MongoDB running locally (or MongoDB Atlas configured)

## Start MongoDB (if using local)
```bash
# Windows
mongod

# Or if installed via chocolatey/brew, use:
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

## Terminal 1: Start Backend
```bash
cd backend
npm start
```

Expected output:
```
✅ MongoDB Connected
🚀 ShuddhEats Server running on:
   - Local: http://localhost:5002
   - Network: http://192.168.0.104:5002
```

## Terminal 2: Start Frontend
```bash
cd frontend
npm run dev
```

Expected output:
```
▲ Next.js running on:
- Local: http://localhost:3001
- Network: http://192.168.0.104:3001
```

## Access Application
👉 **Open Browser**: http://localhost:3001

## Login Credentials

### Regular User (Test Multi-Item Feature)
```
Email: user@shuddheats.com
Password: user1234
```

### Admin User (Requires 2FA)
```
Email: admin@shuddheats.com
Password: admin123
```

---

## One-Command Start (Both Services)

### Windows PowerShell
```powershell
# Run both in parallel
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "start" -WorkingDirectory "backend"; `
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory "frontend"
```

### Mac/Linux (Bash)
```bash
# Run in background
cd backend && npm start &
cd ../frontend && npm run dev
```

---

## Stop the Project

### Windows
```bash
# Press Ctrl+C in each terminal
```

### Kill Processes (if stuck)
```bash
# Windows
taskkill /IM node.exe /F

# Mac/Linux
killall node
```

---

## Environment Files

### Backend Config: `/backend/.env`
```
PORT=5002
MONGO_URI=mongodb://localhost:27017/shuddheats
JWT_SECRET=shuddheats_super_secret_jwt_key_2024
```

### Frontend Config: `/frontend/.env.local`
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5002
NEXT_PUBLIC_API_URL=/api
```

---

## Project Structure

```
Freelance Project/
├── backend/              # Express.js API server
│   ├── .env             # Backend config
│   ├── server.js        # Main server
│   ├── routes/          # API routes
│   ├── models/          # MongoDB models
│   └── package.json
│
├── frontend/            # Next.js React app
│   ├── .env.local       # Frontend config
│   ├── app/             # App router pages
│   ├── components/      # React components
│   ├── context/         # React context
│   └── package.json
```

---

## Troubleshooting

### "Port already in use"
```bash
# Windows - Find process using port
netstat -ano | findstr :5002

# Kill process (replace XXXX with PID)
taskkill /PID XXXX /F
```

### "Cannot connect to MongoDB"
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB
mongod
```

### "Module not found"
```bash
# Reinstall dependencies
cd backend && npm install
cd ../frontend && npm install
```

### "Login returns 500 error"
- Check backend is running: http://localhost:5002/api/health
- Check `.env` file exists in backend folder
- Check JWT_SECRET is set

---

## API Health Check
```bash
curl http://localhost:5002/api/health
```

Expected response:
```json
{"status":"OK","message":"ShuddhEats API is running"}
```
