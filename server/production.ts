import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import path from "path";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple logging function for production
function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit", 
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const requestPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (requestPath.startsWith("/api")) {
      let logLine = `${req.method} ${requestPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
  throw err;
});

// Serve static files in production
function serveStaticFiles() {
  const publicPath = path.join(process.cwd(), 'server', 'public');
  
  if (fs.existsSync(publicPath)) {
    log(`Serving static files from ${publicPath}`);
    app.use(express.static(publicPath));
    
    // Handle client-side routing - serve index.html for all non-API routes
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        const indexPath = path.join(publicPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(404).send('Not Found');
        }
      }
    });
  } else {
    log('Static files not found, running in development mode');
    
    // Minimal fallback for missing static files
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.send(`
          <html>
            <head><title>Server Running</title></head>
            <body>
              <h1>Server is running</h1>
              <p>Static files not found. Build the client first.</p>
              <p>Port: ${process.env.PORT}</p>
              <p>Environment: ${process.env.NODE_ENV}</p>
            </body>
          </html>
        `);
      }
    });
  }
}

async function startServer() {
  try {
    // Register API routes
    const server = await registerRoutes(app);
    
    // Serve static files
    serveStaticFiles();
    
    const port = Number(process.env.PORT) || 5000;
    server.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
    });
    
  } catch (error) {
    log(`Failed to start server: ${error}`);
    process.exit(1);
  }
}

startServer();