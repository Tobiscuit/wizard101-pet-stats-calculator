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

// -----------------------------------------------------------
// HIBERNATE SWITCH 💤
// -----------------------------------------------------------
variable "hibernate" {
  description = "Set to true to DESTROY server and save money. Set to false to PROVISION server."
  type        = bool
  default     = false 
}
// -----------------------------------------------------------

provider "hcloud" {
  token = var.hcloud_token
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

// 1. SSH Key (Always exists)
resource "hcloud_ssh_key" "jrcodex_admin" {
  name       = "jrcodex-rhel-key"
  public_key = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPYkbi84R3/FYCx4PClpX/NJUavpVdiOzU/bnUZLcRFB"
}

// 2. Hetzner Server (Dynamic Existence)
resource "hcloud_server" "nexus_production" {
  count       = var.hibernate ? 0 : 1 // 0 = Destroyed, 1 = Created
  
  name        = "nexus-core-01"
  image       = "ubuntu-24.04"
  server_type = "ccx23"
  location    = "ash"
  ssh_keys    = [hcloud_ssh_key.jrcodex_admin.id]
  user_data   = file("${path.module}/user-data.yml")
}

// Create a local variable to safely handle the "missing" IP when hibernating
locals {
  // If hibernate is false, we have 1 server -> use its IP.
  // If hibernate is true, we have 0 servers -> use a dummy IP (ignored by DNS logic below) or Vercel CNAME
  active_ip = var.hibernate ? "76.76.21.21" : hcloud_server.nexus_production[0].ipv4_address
}

// 3. DNS (Dynamic Routing)
// Hostname: commons.jrcodex.dev
resource "cloudflare_record" "commons" {
  zone_id = var.cloudflare_zone_id
  name    = "commons"
  
  // Logic: 
  // If Hibernate: CNAME -> cname.vercel-dns.com (Vercel)
  // If Active:    A     -> Server IP
  value   = var.hibernate ? "cname.vercel-dns.com" : local.active_ip
  type    = var.hibernate ? "CNAME" : "A"
  proxied = true
}

// Hostname: api.commons.jrcodex.dev
resource "cloudflare_record" "api_commons" {
  zone_id = var.cloudflare_zone_id
  name    = "api.commons"
  value   = var.hibernate ? "cname.vercel-dns.com" : local.active_ip
  type    = var.hibernate ? "CNAME" : "A"
  proxied = true
}

// Hostname: panel.jrcodex.dev
// (Note: The Panel will be DEAD if hibernating, so pointing it to Vercel is fine or just leave it)
resource "cloudflare_record" "panel" {
  zone_id = var.cloudflare_zone_id
  name    = "panel"
  value   = var.hibernate ? "cname.vercel-dns.com" : local.active_ip
  type    = var.hibernate ? "CNAME" : "A"
  proxied = true
}

// 4. Firewall (Only exists if Server exists)
resource "hcloud_firewall" "nexus_security" {
  count = var.hibernate ? 0 : 1
  name  = "nexus-firewall"
  
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
  count       = var.hibernate ? 0 : 1
  firewall_id = hcloud_firewall.nexus_security[0].id
  server_ids  = [hcloud_server.nexus_production[0].id]
}

output "server_status" {
  value = var.hibernate ? "HIBERNATING (Server Destroyed, DNS -> Vercel)" : "ACTIVE (Server Running, IP: ${hcloud_server.nexus_production[0].ipv4_address})"
}
