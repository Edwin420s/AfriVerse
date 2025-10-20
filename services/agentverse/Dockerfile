FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy agent source code
COPY agents/ ./agents/
COPY run_agents.py .

# Create non-root user
RUN useradd --create-home --shell /bin/bash agent
USER agent

# Expose agent ports (8001-8005)
EXPOSE 8001-8005

# Start the agents
CMD ["python", "run_agents.py"]