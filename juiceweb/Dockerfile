FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libc6-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

RUN apt-get purge -y --auto-remove gcc libc6-dev

EXPOSE 8000
CMD ["bash", "start.sh"]
