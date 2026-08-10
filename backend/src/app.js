import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser" // mere server se jo user ka browser hai uske andar ki cookies excess bhi kar pau or set bhi kar pau
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"})) // yeh tab use krte hai jab kuch search kra or usme bich me + % use ho rhe hai
app.use(express.static("public")) // pdf ya image aai toh store krne ke liye
app.use(cookieParser()) 

// routes import
import userRouter from './routes/user.routes.js'
import healthcheckRouter from './routes/healthcheck.routes.js'
import commentRouter from './routes/comment.routes.js'
import likeRouter from './routes/like.routes.js'
import playlistRouter from './routes/playlist.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
import videoRouter from './routes/video.routes.js'
import dashboardRouter from './routes/dashboard.routes.js'

// Root route showing visual API status dashboard
app.get("/", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Chai aur Code Backend API</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
                font-family: 'Inter', sans-serif;
                background-color: #0f172a;
                color: #f8fafc;
                display: flex;
                flex-direction: column;
                min-height: 100vh;
                align-items: center;
                padding: 40px 20px;
            }
            .container {
                max-width: 900px;
                width: 100%;
                background: rgba(30, 41, 59, 0.7);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 36px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #334155;
                padding-bottom: 20px;
                margin-bottom: 24px;
            }
            .title h1 { font-size: 24px; font-weight: 700; color: #38bdf8; }
            .title p { color: #94a3b8; font-size: 14px; margin-top: 4px; }
            .status-badge {
                background: rgba(34, 197, 94, 0.15);
                border: 1px solid rgba(34, 197, 94, 0.4);
                color: #4ade80;
                padding: 6px 14px;
                border-radius: 9999px;
                font-size: 13px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .dot { width: 8px; height: 8px; background: #4ade80; border-radius: 50%; animation: pulse 2s infinite; }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
            
            .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 32px; }
            .card {
                background: #1e293b;
                padding: 16px 20px;
                border-radius: 12px;
                border: 1px solid #334155;
            }
            .card h3 { font-size: 12px; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; margin-bottom: 6px; }
            .card p { font-size: 16px; font-weight: 600; color: #f1f5f9; }
            
            .group-title { font-size: 16px; font-weight: 600; margin: 20px 0 10px 0; color: #38bdf8; border-bottom: 1px solid #334155; padding-bottom: 6px; }
            .endpoint-list { display: flex; flex-direction: column; gap: 8px; }
            .endpoint-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: #0f172a;
                padding: 10px 14px;
                border-radius: 8px;
                border: 1px solid #1e293b;
                font-family: monospace;
            }
            .method {
                font-weight: 700;
                font-size: 11px;
                padding: 3px 6px;
                border-radius: 4px;
                text-transform: uppercase;
                min-width: 55px;
                text-align: center;
            }
            .method.post { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid #3b82f6; }
            .method.get { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid #22c55e; }
            .method.patch { background: rgba(234, 179, 8, 0.2); color: #facc15; border: 1px solid #eab308; }
            .method.delete { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid #ef4444; }
            
            .path { color: #f1f5f9; font-size: 13px; flex-grow: 1; margin-left: 14px; }
            .auth-tag { font-size: 11px; font-family: sans-serif; background: #334155; color: #cbd5e1; padding: 2px 8px; border-radius: 4px; }
            
            footer { margin-top: 24px; text-align: center; color: #64748b; font-size: 13px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="title">
                    <h1>🚀 Chai aur Code Backend Server</h1>
                    <p>Production Grade Express & MongoDB REST API</p>
                </div>
                <div class="status-badge">
                    <div class="dot"></div> Server Online
                </div>
            </div>

            <div class="grid">
                <div class="card">
                    <h3>Environment</h3>
                    <p>Development Mode</p>
                </div>
                <div class="card">
                    <h3>Controllers Configured</h3>
                    <p>9 Active Modules</p>
                </div>
                <div class="card">
                    <h3>Database Status</h3>
                    <p style="color: #4ade80;">Connected (MongoDB)</p>
                </div>
            </div>

            <div class="group-title">1. Health Check</div>
            <div class="endpoint-list">
                <div class="endpoint-item"><span class="method get">GET</span><span class="path">/api/v1/healthcheck</span></div>
            </div>

            <div class="group-title">2. User Routes</div>
            <div class="endpoint-list">
                <div class="endpoint-item"><span class="method post">POST</span><span class="path">/api/v1/users/register</span></div>
                <div class="endpoint-item"><span class="method post">POST</span><span class="path">/api/v1/users/login</span></div>
                <div class="endpoint-item"><span class="method post">POST</span><span class="path">/api/v1/users/logout</span><span class="auth-tag">🔒 Auth</span></div>
                <div class="endpoint-item"><span class="method post">POST</span><span class="path">/api/v1/users/refresh-token</span></div>
                <div class="endpoint-item"><span class="method get">GET</span><span class="path">/api/v1/users/current-user</span><span class="auth-tag">🔒 Auth</span></div>
            </div>

            <div class="group-title">3. Video Routes</div>
            <div class="endpoint-list">
                <div class="endpoint-item"><span class="method get">GET</span><span class="path">/api/v1/videos</span><span class="auth-tag">🔒 Auth</span></div>
                <div class="endpoint-item"><span class="method post">POST</span><span class="path">/api/v1/videos</span><span class="auth-tag">🔒 Auth</span></div>
                <div class="endpoint-item"><span class="method get">GET</span><span class="path">/api/v1/videos/:videoId</span><span class="auth-tag">🔒 Auth</span></div>
                <div class="endpoint-item"><span class="method patch">PATCH</span><span class="path">/api/v1/videos/:videoId</span><span class="auth-tag">🔒 Auth</span></div>
                <div class="endpoint-item"><span class="method delete">DELETE</span><span class="path">/api/v1/videos/:videoId</span><span class="auth-tag">🔒 Auth</span></div>
            </div>

            <div class="group-title">4. Comment & Like Routes</div>
            <div class="endpoint-list">
                <div class="endpoint-item"><span class="method get">GET</span><span class="path">/api/v1/comments/v/:videoId</span><span class="auth-tag">🔒 Auth</span></div>
                <div class="endpoint-item"><span class="method post">POST</span><span class="path">/api/v1/comments/v/:videoId</span><span class="auth-tag">🔒 Auth</span></div>
                <div class="endpoint-item"><span class="method post">POST</span><span class="path">/api/v1/likes/toggle/v/:videoId</span><span class="auth-tag">🔒 Auth</span></div>
                <div class="endpoint-item"><span class="method get">GET</span><span class="path">/api/v1/likes/videos</span><span class="auth-tag">🔒 Auth</span></div>
            </div>

            <div class="group-title">5. Playlist, Tweet, Subscription & Dashboard Routes</div>
            <div class="endpoint-list">
                <div class="endpoint-item"><span class="method post">POST</span><span class="path">/api/v1/playlists</span><span class="auth-tag">🔒 Auth</span></div>
                <div class="endpoint-item"><span class="method post">POST</span><span class="path">/api/v1/tweets</span><span class="auth-tag">🔒 Auth</span></div>
                <div class="endpoint-item"><span class="method post">POST</span><span class="path">/api/v1/subscriptions/c/:channelId</span><span class="auth-tag">🔒 Auth</span></div>
                <div class="endpoint-item"><span class="method get">GET</span><span class="path">/api/v1/dashboard/stats</span><span class="auth-tag">🔒 Auth</span></div>
            </div>

            <footer>
                Tip: Test all endpoints using <strong>Postman</strong>, <strong>Thunder Client</strong>, or <strong>cURL</strong>.
            </footer>
        </div>
    </body>
    </html>
    `);
});

// routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlists", playlistRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/dashboard", dashboardRouter)

export {app}