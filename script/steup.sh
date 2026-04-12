#!/bin/bash

set -e

echo "🚀 Updating system..."
sudo apt update -y

# ---------------- DOCKER ----------------
echo "🐳 Installing Docker..."
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# ---------------- AWS CLI ----------------
echo "☁️ Installing AWS CLI..."
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
sudo apt install -y unzip
unzip awscliv2.zip
sudo ./aws/install

# ---------------- kubectl ----------------
echo "☸️ Installing kubectl..."
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# ---------------- eksctl ----------------
echo "⚙️ Installing eksctl..."
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin

# ---------------- Helm ----------------
echo "📦 Installing Helm..."
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# ---------------- VERIFY ----------------
echo "✅ Verifying installations..."

docker --version
aws --version
kubectl version --client
eksctl version
helm version

echo "🎉 Installation complete!"
echo "👉 Please logout/login once to use Docker without sudo"