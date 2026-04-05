# Deployment Guide for E-Cell FCRIT Website

## Overview

This guide covers deploying the E-Cell FCRIT website to the college official server using Docker and CI/CD pipelines.

## Prerequisites

- [ ] Access to college server (SSH)
- [ ] GitHub repository with this code
- [ ] Docker and Docker Compose installed on server
- [ ] DNS configured to point to server
- [ ] SSL certificate (Let's Encrypt or college SSL)
- [ ] Sanity CMS project credentials

## Step 1: Prepare College Server

### 1.1 SSH Setup

```bash
# Generate deploy key (if not exists)
ssh-keygen -t ed25519 -C "ecell-deploy" -f ~/.ssh/ecell-deploy

# Copy public key to server authorized_keys
cat ~/.ssh/ecell-deploy.pub | ssh deploy_user@college-server \
  "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

# Convert private key to base64 for GitHub
cat ~/.ssh/ecell-deploy | base64 > ecell-deploy-base64.txt
```

### 1.2 Server Dependencies

SSH to college server:

```bash
ssh deploy_user@college-server

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" \

# Verify Node.js in container (24.14.1 Alpine)
# Already handled via Dockerfile
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx (for reverse proxy & SSL)
sudo apt install -y nginx certbot python3-certbot-nginx

# Create app directory
sudo mkdir -p /var/www/ecell
sudo chown -R $USER:$USER /var/www/ecell
cd /var/www/ecell
```

### 1.3 Clone Repository

```bash
git clone https://github.com/your-org/e-cell.git
cd e-cell

# Create .env.production
nano .env.production
```

Add:

```env
NODE_ENV=production
NEXT_PUBLIC_SANITY_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=<your-read-token>
NEXT_PUBLIC_SITE_URL=https://ecell.fcrit.ac.in
```

## Step 2: Configure GitHub Secrets

Go to GitHub: **Settings → Secrets and variables → Actions**

Add these secrets:

```
DEPLOY_HOST = college-server.edu.in
DEPLOY_USER = deploy_user
DEPLOY_KEY = <base64-encoded-private-key>
NEXT_PUBLIC_SANITY_PROJECT_ID = <project-id>
NEXT_PUBLIC_SANITY_DATASET = production
SANITY_API_READ_TOKEN = <read-token>
```

## Step 3: Configure Nginx Reverse Proxy

SSH to server and create Nginx config:

```bash
sudo nano /etc/nginx/sites-available/ecell
```

Add:

```nginx
upstream ecell_app {
    server localhost:3000;
}

server {
    listen 80;
    server_name ecell.fcrit.ac.in;

    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name ecell.fcrit.ac.in;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/ecell.fcrit.ac.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ecell.fcrit.ac.in/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_vary on;

    # Proxy settings
    location / {
        proxy_pass http://ecell_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts for long connections
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://ecell_app;
        proxy_cache_valid 30d;
        add_header Cache-Control "public, immutable";
    }

    # Disable access to sensitive files
    location ~ /\. {
        deny all;
    }
}
```

Enable and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/ecell /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 4: SSL Certificate

```bash
# Get certificate from Let's Encrypt
sudo certbot certonly --nginx -d ecell.fcrit.ac.in

# Auto-renewal (runs daily)
sudo systemctl enable certbot.timer
```

## Step 5: Start Application

```bash
cd /var/www/ecell

# Start containers
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app
```

## Step 6: Create Systemd Service

```bash
sudo nano /etc/systemd/system/ecell-app.service
```

Add:

```ini
[Unit]
Description=E-Cell FCRIT Website
After=docker.service
Requires=docker.service

[Service]
Type=simple
User=deploy_user
WorkingDirectory=/var/www/ecell
ExecStart=/usr/local/bin/docker-compose up
ExecStop=/usr/local/bin/docker-compose down
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ecell-app.service
sudo systemctl start ecell-app.service
```

## Step 7: Monitoring & Maintenance

### Check Application Status

```bash
sudo systemctl status ecell-app.service
docker-compose ps
curl https://ecell.fcrit.ac.in
```

### View Logs

```bash
# Docker logs
docker-compose logs -f app --tail=100

# Systemd logs
sudo journalctl -u ecell-app.service -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Update Application

Automatic on every push to main:

```bash
git push origin main
# GitHub Actions will deploy automatically
```

Manual update:

```bash
cd /var/www/ecell
git pull origin main
docker-compose pull
docker-compose up -d
```

### Backup Data

```bash
# Backup docker volumes
docker-compose exec app tar czf - /app > backup-$(date +%Y%m%d).tar.gz

# Backup .env files
tar czf env-backup-$(date +%Y%m%d).tar.gz .env.production
```

### Rollback to Previous Version

```bash
git log --oneline
git checkout <previous-commit-hash>
docker-compose pull
docker-compose up -d
```

## Performance Monitoring

### Check System Resources

```bash
# CPU and Memory
docker stats

# Disk Space
df -h

# Network
netstat -an | grep :3000
```

### Enable Monitoring (Optional)

Add to docker-compose.yml:

```yaml
prometheus:
  image: prom/prometheus:latest
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
  ports:
    - "9090:9090"
  profiles:
    - monitoring

grafana:
  image: grafana/grafana:latest
  ports:
    - "3001:3000"
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=admin
  profiles:
    - monitoring
```

## Security Checklist

- [x] SSH key-based authentication
- [x] Docker non-root user
- [x] HTTPS/SSL certificate
- [x] Security headers configured
- [x] Firewall rules
- [x] Regular backups
- [x] Dependency scanning

### Firewall Rules (UFW)

```bash
sudo ufw enable
sudo ufw allow 22/tcp       # SSH
sudo ufw allow 80/tcp       # HTTP
sudo ufw allow 443/tcp      # HTTPS
sudo ufw allow 3000/tcp     # App (internal)
sudo ufw status
```

## Troubleshooting

### Application won't start

```bash
docker-compose logs app
# Check environment variables
env | grep NEXT_
```

### Port conflicts

```bash
sudo lsof -i :3000
sudo lsof -i :80
sudo lsof -i :443
```

### SSL certificate issues

```bash
sudo certbot certificates
sudo certbot renew --dry-run
```

### Out of disk space

```bash
docker system prune -a
df -h
# Remove old images: docker rmi <image-name>
```

## Support Contacts

- **GitHub Issues**: Report bugs and feature requests
- **System Admin**: For server access issues
- **Sanity Support**: For CMS-related issues

## References

- [Docker Deployment](https://docs.docker.com/guides/deployment/)
- [Nginx Reverse Proxy](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [GitHub Actions Deployment](https://docs.github.com/en/actions/deployment)
