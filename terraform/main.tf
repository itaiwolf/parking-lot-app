provider "aws" {
  region = "eu-north-1"
}

# ---- Networking (default VPC/subnet) ----
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "defs" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

locals {
  subnet_id = data.aws_subnets.defs.ids[0]
}

data "aws_ami" "ubuntu_latest" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# ---- Security Group (22, 3000) ----
resource "aws_security_group" "parking_lot_sg" {
  name   = "parking-lot-sg"
  vpc_id = data.aws_vpc.default.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ---- EC2 Instance ----
resource "aws_instance" "parking_lot_server" {
  ami                         = data.aws_ami.ubuntu_latest.id
  instance_type               = "t3.micro"
  key_name                    = "parking-lot-key" # change if your key is different
  subnet_id                   = local.subnet_id
  vpc_security_group_ids      = [aws_security_group.parking_lot_sg.id]
  associate_public_ip_address = true

  user_data = <<-EOT
    #!/bin/bash
    apt-get update -y
    apt-get install -y git nodejs npm
    git clone https://github.com/itaiwolf/parking-lot-app.git /home/ubuntu/parking-lot-app || true
    cd /home/ubuntu/parking-lot-app
    npm install
    nohup node index.js > /home/ubuntu/parking-lot-app/server.log 2>&1 &
  EOT

  tags = {
    Name = "parking-lot-server"
  }
}

# ---- DynamoDB (already imported) ----
resource "aws_dynamodb_table" "tickets" {
  name         = "Tickets"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "ticketId"

  attribute {
    name = "ticketId"
    type = "S"
  }

  tags = {
    Name = "ParkingLotTickets"
  }
}

# ---- Output ----
output "app_public_dns" {
  value = aws_instance.parking_lot_server.public_dns
}
