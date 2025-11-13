# Deployment Guide - FitFindr

Complete guide for deploying your FitFindr application to production.

## 🎯 Deployment Options

### Backend Options
- Railway (Recommended)
- Render
- AWS EC2
- Google Cloud Run
- DigitalOcean

### Frontend Options
- Vercel (Recommended)
- Netlify
- AWS Amplify
- Cloudflare Pages

---

## 🚂 Backend Deployment (Railway)

### Prerequisites
- GitHub account
- Railway account (free tier available)
- Google Maps API key

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Create Railway Project**
   - Go to [railway.app](https://railway.app)
   - Click "Start a New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository

3. **Configure Build**
   - Railway should auto-detect Python
   - Root directory: `/backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Set Environment Variables**
   - Go to Variables tab
   - Add: `GOOGLE_MAPS_API_KEY=your_key_here`

5. **Deploy**
   - Railway will automatically deploy
   - Note your deployment URL (e.g., `https://fitfindr-api.up.railway.app`)

### Alternative: Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)

2. **New Web Service**
   - Connect GitHub repo
   - Root directory: `backend`
   - Environment: Python 3
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Environment Variables**
   - Add `GOOGLE_MAPS_API_KEY`

---

## ⚡ Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (free tier available)
- Backend deployed and URL available

### Steps

1. **Install Vercel CLI** (Optional)
   ```bash
   npm i -g vercel
   ```

2. **Configure Environment**
   Create `.env.production` in frontend folder:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

3. **Deploy via Vercel CLI**
   ```bash
   cd frontend
   vercel
   ```
   Follow the prompts:
   - Setup and deploy? Yes
   - Which scope? Your account
   - Link to existing project? No
   - Project name: fitfindr
   - Directory: `./`
   - Override settings? No

4. **Deploy via Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Import Git Repository
   - Select your repo
   - Configure:
     - Framework: Next.js
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `.next`
   - Add Environment Variable:
     - Name: `NEXT_PUBLIC_API_URL`
     - Value: Your backend URL
   - Deploy!

5. **Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Alternative: Netlify

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)

2. **Import Project**
   - New site from Git
   - Connect to GitHub
   - Select repository

3. **Build Settings**
   - Base directory: `frontend`
   - Build command: `npm run build && npm run export`
   - Publish directory: `out`

4. **Environment Variables**
   - Add `NEXT_PUBLIC_API_URL`

5. **Deploy**

---

## 🔧 Production Configuration

### Backend Updates

Update CORS in `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-frontend-domain.vercel.app",
        "https://your-custom-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Frontend Updates

Update `frontend/lib/api.ts`:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
```

---

## 📊 Google Maps API Configuration

### Production Setup

1. **Restrict API Key** (Important for security)
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - APIs & Services → Credentials
   - Edit your API key

2. **Add Application Restrictions**
   - HTTP referrers
   - Add your production domains:
     ```
     https://your-backend.railway.app/*
     https://your-frontend.vercel.app/*
     ```

3. **Restrict API Access**
   - Select "Restrict key"
   - Enable only:
     - Places API
     - Geocoding API

4. **Monitor Usage**
   - Set up billing alerts
   - Monitor quotas

---

## 🔒 Security Best Practices

### Backend
- ✅ Never commit `.env` file
- ✅ Use environment variables for secrets
- ✅ Restrict CORS to specific domains
- ✅ Implement rate limiting
- ✅ Add API authentication (optional)

### Frontend
- ✅ Never expose backend secrets
- ✅ Use environment variables
- ✅ Validate user inputs
- ✅ Implement error boundaries

### API Keys
- ✅ Restrict API keys by domain
- ✅ Monitor usage
- ✅ Rotate keys regularly
- ✅ Set spending limits

---

## 🧪 Testing Production

### Backend Health Check
```bash
curl https://your-backend-url.com/api/health
```

Expected response:
```json
{"status": "healthy"}
```

### Frontend
1. Visit your frontend URL
2. Enter a location
3. Set preferences
4. Click "Find Gyms"
5. Verify results appear

### Full Integration Test
```bash
# Test API endpoint
curl -X POST https://your-backend-url.com/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "location": "New York, NY",
    "hygiene": 5,
    "equipment_quality": 5,
    "less_crowd": 3,
    "trainer_knowledge": 4,
    "price": 3,
    "amenities": 4,
    "atmosphere": 5,
    "custom_filters": [],
    "min_rating": 0,
    "max_distance": 5
  }'
```

---

## 📈 Monitoring

### Backend Monitoring
- Railway/Render provide built-in logs
- Check error rates
- Monitor response times
- Set up alerts

### Frontend Monitoring
- Vercel Analytics (built-in)
- Google Analytics (optional)
- Sentry for error tracking

### API Usage
- Monitor Google Maps API usage
- Set billing alerts
- Track quota consumption

---

## 🔄 CI/CD

### Automatic Deployments

Both Vercel and Railway support automatic deployments:

1. **On Push to Main**
   - Automatically deploys production
   - Runs build checks
   - Updates live site

2. **On Pull Request**
   - Creates preview deployment
   - Test changes before merging

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          # Railway deployment commands

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm i -g vercel
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## 🚨 Troubleshooting

### "API Key Invalid"
- Check environment variable is set
- Verify key in Google Console
- Ensure Places API is enabled

### CORS Errors
- Add frontend domain to backend CORS
- Clear browser cache
- Check browser console

### "Cannot fetch gyms"
- Check backend logs
- Verify API endpoint URL
- Test backend health check

### Build Failures
- Check dependency versions
- Review build logs
- Verify Node/Python versions

---

## 💰 Cost Estimates

### Free Tier (Development)
- **Railway**: 500 hours/month free
- **Vercel**: Unlimited deployments
- **Google Maps**: $200 free credit/month

### Production (Estimated)
- **Backend**: $5-20/month (Railway/Render)
- **Frontend**: $0 (Vercel free tier sufficient)
- **Google Maps**: $0-50/month (depends on usage)
- **Domain**: $10-15/year

**Total**: ~$60-240/year

---

## 📚 Resources

- [Railway Docs](https://docs.railway.app/)
- [Vercel Docs](https://vercel.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## ✅ Deployment Checklist

- [ ] Backend deployed to Railway/Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] Google Maps API key restricted
- [ ] CORS configured for production domains
- [ ] Custom domain configured (optional)
- [ ] SSL certificates active
- [ ] Health checks passing
- [ ] Error monitoring setup
- [ ] Analytics configured
- [ ] Documentation updated with live URLs

---

**Your FitFindr app is now live! 🎉**
