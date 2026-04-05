# Docker & CI/CD Setup Guide

This guide explains how to use Docker and set up CI/CD pipelines for the E-Cell FCRIT website.

## Quick Start

### Local Development with Docker

```bash
# Run development environment with hot reload
docker-compose --profile dev up app-dev

# Run production build locally
docker-compose up app
```

### Build Docker Image Locally

```bash
# Build production image
docker build -t ecell-fcrit:latest .

# Build development image
docker build -f Dockerfile.dev -t ecell-fcrit:dev .

# Run the production container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id \
  -e NEXT_PUBLIC_SANITY_DATASET=production \
  ecell-fcrit:latest
```

## Docker Architecture

### Multi-Stage Build (Production)

The `Dockerfile` uses a 3-stage build process for optimal image size:

1. **deps** - Installs production dependencies only
2. **builder** - Builds the Next.js application with all dependencies
3. **runtime** - Contains only runtime essentials and the built app

**Advantages:**

- Smaller final image size (~200MB vs ~500MB)
- Better security (no build tools in production)
- Faster deployments

### Development Dockerfile

`Dockerfile.dev` is optimized for development:

- Includes hot reload support
- Mounts source code as volume
- Includes development tools (git, etc.)

## Docker Compose Services

### Production Service (`app`)

```yaml
- Port: 3000
- Restart policy: unless-stopped
- Health checks enabled
- Environment variables configurable
```

### Development Service (`app-dev`)

- Accessible at port 3001
- Volume mounts for hot reload
- Activated with `--profile dev` flag

## CI/CD Workflows

### 1. Docker Build Workflow (`.github/workflows/docker-build.yml`)

**Trigger:** Push to main/develop, PR, or version tags
**Actions:**

- Builds Docker image
- Pushes to GitHub Container Registry (ghcr.io)
- Uses GitHub Actions cache for faster builds

**Required Secrets:** None (uses GITHUB_TOKEN)

### 2. Security Scan Workflow (`.github/workflows/security-scan.yml`)

**Trigger:** Push, PR, or daily schedule (2 AM UTC)
**Actions:**

- Runs `npm audit` for dependencies
- Runs ESLint for code quality
- Scans filesystem with Trivy
- Scans built Docker image
- Uploads SARIF reports to GitHub Security tab

**What it checks:**

- ✅ NPM package vulnerabilities
- ✅ Docker image vulnerabilities
- ✅ Code style and linting issues

### 3. Deployment Workflow (`.github/workflows/deploy.yml`)

**Trigger:** Push to main or manual workflow_dispatch
**Steps:**

1. Tests - Builds and verifies the application
2. Deploy Docker - Pushes image to registry
3. Deploy Server - SSH to production server and pulls latest changes
4. Post-deployment Tests - Health checks and smoke tests

**Required Secrets:**

```bash
DEPLOY_HOST      # IP/domain of your server
DEPLOY_USER      # SSH username
DEPLOY_KEY       # SSH private key (base64 encoded)
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
```

## Environment Variables

### For Docker Containers

Create a `.env.production` file:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_read_token
NEXT_PUBLIC_SITE_URL=https://ecell.fcrit.ac.in
```

### For GitHub Actions

Configure in **Settings → Secrets and variables → Actions:**

```bash
# Required for deployment
DEPLOY_HOST=your.server.com
DEPLOY_USER=deploy_user
DEPLOY_KEY=$(cat ~/.ssh/deploy_key | base64)

# For Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=...
```

## Running on College Server

### Initial Setup

1. **SSH to server:**

```bash
ssh deploy_user@your_server_ip
```

2. **Clone repository:**

```bash
cd /app
git clone https://github.com/your-org/e-cell.git
cd e-cell
```

3. **Create `.env.production`:**

```bash
nano .env.production
# Add environment variables
```

4. **Install Docker & Docker Compose:**

```bash
# For Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker deploy_user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

5. **Create systemd service for auto-restart:**

```bash
sudo nano /etc/systemd/system/ecell.service
```

Add:

```ini
[Unit]
Description=E-Cell FCRIT Website
After=docker.service
Requires=docker.service

[Service]
Type=simple
Restart=always
RestartSec=10
WorkingDirectory=/app/e-cell
ExecStart=/usr/local/bin/docker-compose up
ExecStop=/usr/local/bin/docker-compose down

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ecell.service
sudo systemctl start ecell.service
```

### Monitoring Logs

```bash
# View logs
docker-compose logs -f app

# View specific service logs
docker-compose logs -f app --tail=100

# Check container status
docker-compose ps
```

### Updating Production

Automated via GitHub Actions on push to main:

```bash
git push origin main
# GitHub Actions will automatically build, test, and deploy
```

Or manually:

```bash
cd /app/e-cell
git pull origin main
docker-compose pull
docker-compose up -d
```

## Health Checks

All containers include health checks that verify:

- Application responds on port 3000
- HTTP status 200 is returned
- Runs every 30 seconds with 3 retries

Check health status:

```bash
docker-compose ps
# Look for "(healthy)" status
```

## Performance Tips

1. **Image Size**: ~200MB (optimized multi-stage build)
2. **Build Time**: ~2-3 minutes (first time), faster with cache
3. **Startup Time**: ~5-10 seconds
4. **Memory Usage**: ~300-400MB at runtime

## Troubleshooting

### Container won't start

```bash
docker-compose logs app
# Check all environment variables are set
```

### Port already in use

```bash
sudo lsof -i :3000
sudo kill -9 <PID>
# Or change port in docker-compose.yml
```

### Permission denied errors

```bash
sudo usermod -aG docker $(whoami)
# Log out and log back in
```

### Rebuild without cache

```bash
docker-compose build --no-cache
docker-compose up -d
```

## Security Best Practices

✅ **Applied in this setup:**

- Non-root user in container
- Minimal Alpine base images
- Health checks for availability
- Signal handling (dumb-init)
- Environment variables for secrets

✅ **Additional recommendations:**

- Use GitHub branch protection rules
- Require code reviews for merges
- Scan vulnerabilities weekly
- Keep Node.js updated
- Rotate SSH keys regularly

## Useful Commands

```bash
# View running containers
docker ps

# SSH into running container
docker-compose exec app /bin/sh

# Execute command in container
docker-compose exec app npm run build

# Stop and remove everything
docker-compose down

# Remove unused images
docker image prune -a

# Check image layers
docker history ecell-fcrit:latest
```

## References

- [Next.js Deployment (Docker)](https://nextjs.org/docs/deployment/docker)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Trivy Container Security](https://github.com/aquasecurity/trivy)
