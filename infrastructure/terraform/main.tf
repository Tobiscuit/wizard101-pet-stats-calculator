terraform {
  required_providers {
    hcloud = {
      source = "hetznercloud/hcloud"
      version = "~> 1.45"
    }
    cloudflare = {
      source = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

variable "hcloud_token" {
  sensitive = true
}

variable "cloudflare_api_token" {
  sensitive = true
}

variable "cloudflare_zone_id" {
  sensitive = true
}

provider "hcloud" {
  token = var.hcloud_token
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

// 1. SSH Key (Unchanged)
resource "hcloud_ssh_key" "jrcodex_admin" {
  name       = "jrcodex-rhel-key"
  public_key = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPYkbi84R3/FYCx4PClpX/NJUavpVdiOzU/bnUZLcRFB"
}

// 2. Hetzner Server (Unchanged)
resource "hcloud_server" "nexus_production" {
  name        = "nexus-core-01"
  image       = "ubuntu-24.04"
  server_type = "ccx23"
  location    = "ash"
  ssh_keys    = [hcloud_ssh_key.jrcodex_admin.id]
  user_data = file("${path.module}/user-data.yml")
}

output "server_ip" {
  value = hcloud_server.nexus_production.ipv4_address
}

// 3. DNS (Cloudflare)
// Hostname: commons.jrcodex.dev
resource "cloudflare_record" "commons" {
  zone_id = var.cloudflare_zone_id
  name    = "commons"
  value   = hcloud_server.nexus_production.ipv4_address
  type    = "A"
  proxied = true // Enable Cloudflare Proxy features (SSL/CDN)
}

// Hostname: api.commons.jrcodex.dev
resource "cloudflare_record" "api_commons" {
  zone_id = var.cloudflare_zone_id
  name    = "api.commons"
  value   = hcloud_server.nexus_production.ipv4_address
  type    = "A"
  proxied = true
}

// Hostname: panel.jrcodex.dev (Coolify Dashboard)
resource "cloudflare_record" "panel" {
  zone_id = var.cloudflare_zone_id
  name    = "panel"
  value   = hcloud_server.nexus_production.ipv4_address
  type    = "A"
  proxied = true
}

// 4. Firewall (Unchanged + UDP 443)
resource "hcloud_firewall" "nexus_security" {
  name = "nexus-firewall"
  
  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "22"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  // Web (TCP)
  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "80"
    source_ips = ["0.0.0.0/0", "::/0"]
  }
  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "443"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  // Web (UDP/QUIC)
  rule {
    direction = "in"
    protocol  = "udp"
    port      = "443"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  // Coolify Admin (Restricted)
  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "8000"
    source_ips = ["76.208.38.206/32"]
  }
}

resource "hcloud_firewall_attachment" "nexus_security_attachment" {
  firewall_id = hcloud_firewall.nexus_security.id
  server_ids  = [hcloud_server.nexus_production.id]
}
