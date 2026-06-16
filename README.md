# 🚀 Static Website CI/CD Pipeline with GitHub Actions, Docker & AWS EC2

## 📖 Overview

This project demonstrates how to build and deploy a static website using a complete CI/CD pipeline.

Whenever code is pushed to the GitHub repository:

1. GitHub Actions automatically starts.
2. Docker image is built.
3. Image is pushed to DockerHub.
4. EC2 server pulls the latest image.
5. Existing container is replaced.
6. Updated website becomes live automatically.

---

## 🏗 Architecture

```text
Developer
    │
    ▼
Git Push
    │
    ▼
GitHub Actions
    │
    ├── Docker Build
    ├── DockerHub Push
    │
    ▼
AWS EC2
    │
    ├── Pull Latest Image
    ├── Restart Container
    │
    ▼
Live Website
```

---

## 🛠 Technologies Used

* Git & GitHub
* GitHub Actions
* Docker
* DockerHub
* AWS EC2
* Linux
* SSH

---

## 📋 Prerequisites

Before using this project, ensure you have:

* AWS Account
* DockerHub Account
* GitHub Account
* AWS EC2 Instance
* Docker Installed on EC2
* SSH Key Pair

---

## 🚀 EC2 Setup

Connect to EC2:

```bash
ssh -i your-key.pem ubuntu@YOUR_PUBLIC_IP
```

Install Docker:

```bash
sudo apt update
sudo apt install docker.io -y

sudo systemctl enable docker
sudo systemctl start docker
```

Verify:

```bash
docker --version
```

---

## 🔐 GitHub Secrets

Add the following secrets in:

Settings → Secrets and variables → Actions

```text
DOCKER_USERNAME
DOCKER_PASSWORD
EC2_HOST
EC2_USER
EC2_SSH_KEY
```

### Example

```text
DOCKER_USERNAME = your-dockerhub-username
DOCKER_PASSWORD = dockerhub-access-token
EC2_HOST = ec2-public-ip
EC2_USER = ubuntu
EC2_SSH_KEY = complete pem file content
```

---

## ⚙️ CI/CD Workflow

The workflow is located at:

```text
.github/workflows/deploy.yml
```

Pipeline Steps:

```text
Code Push
   ↓
Build Docker Image
   ↓
Push to DockerHub
   ↓
SSH into EC2
   ↓
Pull Latest Image
   ↓
Stop Existing Container
   ↓
Run New Container
   ↓
Deployment Complete
```

---

## 🧪 Testing the Pipeline

Make a change in the website:

```html
<h1>CI/CD Test</h1>
```

Commit and push:

```bash
git add .
git commit -m "Test deployment"
git push origin main
```

Go to:

```text
GitHub Repository → Actions
```

Monitor the workflow execution.

---

## ✅ Expected Result

After a successful workflow run:

* Docker image is updated
* DockerHub repository receives a new image
* EC2 server deploys the latest version
* Website reflects new changes automatically

---

## 📚 Learning Outcomes

By completing this project, you will gain hands-on experience with:

* Docker Containerization
* DockerHub Registry
* AWS EC2 Deployment
* GitHub Actions
* CI/CD Pipelines
* Linux Server Administration
* SSH Automation
* Deployment Workflows

---

## 🔮 Future Improvements

* Terraform Infrastructure as Code
* Nginx Reverse Proxy
* HTTPS with Let's Encrypt
* Kubernetes Deployment
* Monitoring & Logging
* Multi-Environment CI/CD

---

## 👨‍💻 Author

Imran Moosa

Cloud & DevOps Learner building hands-on projects to gain practical experience in modern infrastructure and deployment workflows.
