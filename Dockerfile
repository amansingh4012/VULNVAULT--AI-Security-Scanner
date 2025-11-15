# Unified Dockerfile for VulnVault (Frontend + Backend)
# This builds both frontend and backend in a single container

FROM python:3.10-slim

WORKDIR /app

# Install system dependencies including Node.js and security tools
RUN apt-get update && apt-get install -y \
    git \
    curl \
    build-essential \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install Python security scanners globally
RUN pip install --no-cache-dir \
    pbr \
    bandit==1.7.5 \
    semgrep==1.45.0 \
    pip-audit==2.6.1

# Verify installations
RUN bandit --version && semgrep --version && pip-audit --version && npm --version

# Copy and build frontend first
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install
COPY frontend/ .
RUN npm run build

# Copy and install backend
WORKDIR /app
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend/ ./backend/

# Create directory for frontend static files in backend
RUN mkdir -p /app/backend/static

# Move built frontend to backend static directory
RUN cp -r /app/frontend/dist/* /app/backend/static/

# Set working directory to backend
WORKDIR /app/backend

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
