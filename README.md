
# Parking Lot Management System (Cloud Assignment)

This repository contains a simple Node.js + Express backend that simulates a cloud-based parking lot management system.

## Features

- POST `/entry?plate=...&parkingLot=...`  
  → Returns a ticket ID, saves entry time.

- POST `/exit?ticketId=...`  
  → Calculates parking duration and returns plate, lot ID, duration, and fee.

### Billing:
- $10/hour, billed in 15-minute increments.

---

## Deployment

The app is deployed on an **AWS EC2 instance** (Ubuntu 24.04) using a simple setup script.

### EC2 Setup Instructions:

1. Launch a `t3.micro` EC2 instance with Ubuntu 24.04.
2. Open ports 22 (SSH) and 3000 (Custom TCP) in the Security Group.
3. SSH into the instance:

```bash
ssh -i "your-key.pem" ubuntu@<your-ec2-public-dns>
```

4. Upload the `setup.sh` file to the EC2 instance, then run:

```bash
chmod +x setup.sh
./setup.sh
```

This script will:
- Update packages
- Install Node.js, npm, and git
- Clone this repo
- Install dependencies
- Start the app

---

## Testing

To test from inside EC2:

```bash
curl -X POST "http://localhost:3000/entry?plate=123-123-123&parkingLot=382"
curl -X POST "http://localhost:3000/exit?ticketId=1"
```

To test externally (once running):

```bash
curl -X POST "http://<your-ec2-public-dns>:3000/entry?plate=123-123-123&parkingLot=382"
```

---

## Note

- No database is used yet (in-memory only), as allowed in Exercise 1.
- No AWS/GCP automation tools (Terraform, Pulumi) were required for this manual deployment.
