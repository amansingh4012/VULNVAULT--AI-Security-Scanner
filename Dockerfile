# Unified Dockerfile for VulnVault (Frontend + Backend)
# This builds both frontend and backend in a single container

FROM python:3.10-slim

WORKDIR /app

# Install system dependencies including Node.js and Git
RUN apt-get update && apt-get install -y \
    git \
    curl \
    build-essential \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Copy and install backend Python dependencies first (better caching)
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Verify key tool installations
RUN bandit --version && pip-audit --version && npm --version

# Copy and build frontend
# These ARGs are passed at build time for Vite to bake into the bundle
ARG VITE_API_URL
ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install
COPY frontend/ .
RUN npm run build

# Copy backend application code
WORKDIR /app
COPY backend/ ./backend/

# Create directory for frontend static files in backend
RUN mkdir -p /app/backend/static

# Move built frontend to backend static directory
RUN cp -r /app/frontend/dist/* /app/backend/static/

# Set working directory to backend
WORKDIR /app/backend

# Expose port (Render uses $PORT, default 8000)
EXPOSE 8000

# Health check — use $PORT env var
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

# Run application — Render sets $PORT, default to 8000
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
