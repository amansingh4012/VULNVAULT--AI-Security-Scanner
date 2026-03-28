# Stage 1: Build the React frontend
FROM node:20-alpine as frontend-build

WORKDIR /app/frontend

# Copy frontend configuration files
COPY frontend/package.json frontend/package-lock.json ./
# Make sure to copy vite.config.js and tailwind/postcss configs if they exist
COPY frontend/vite.config.js ./ 
COPY frontend/tailwind.config.js ./
COPY frontend/postcss.config.js ./

# Install dependencies strictly
RUN npm ci

# Copy the rest of the frontend source
COPY frontend/ ./

# Define build arguments that are needed during Vite build
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_API_URL

# Set them as environment variables for the build process
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_API_URL=$VITE_API_URL

# Build the frontend (this creates the 'dist' folder)
RUN npm run build


# Stage 2: Build the FastAPI backend and serve frontend
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies required for cryptography, Semgrep, Bandit, etc.
RUN apt-get update && apt-get install -y \
    gcc \
    libffi-dev \
    git \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install semgrep bandit reportlab  # Ensure security scanners are installed

# Copy the backend code
COPY backend/ /app/backend/

# IMPORTANT: Copy the built frontend static files into the backend's static directory
COPY --from=frontend-build /app/frontend/dist /app/backend/static

# Expose the standard web port
EXPOSE 8000

# Change working directory so Python imports work exactly like local dev
WORKDIR /app/backend

# Start the uvicorn server binding to 0.0.0.0 and using PORT from environment (default 8000)
CMD ["sh", "-c", "python -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
