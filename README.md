
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

The app was deployed manually on an **AWS EC2 instance** (Ubuntu 24.04).

### EC2 Setup Instructions:

1. Launch a `t3.micro` EC2 instance with Ubuntu 24.04.
2. Open ports 22 (SSH) and 3000 (Custom TCP) in the Security Group.
3. SSH into the instance:

```bash
ssh -i "your-key.pem" ubuntu@<your-ec2-public-dns>
```

4. Install Node.js and npm:

```bash
sudo apt update
sudo apt install -y nodejs npm
```

5. Upload or clone the project, then run:

```bash
npm install
node index.js
```

The server listens on port 3000.

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

