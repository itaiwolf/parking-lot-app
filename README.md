
# Parking Lot Management System (Cloud Assignment)

This repository contains a Node.js + Express backend that simulates a cloud-based parking lot management system.

## Features

- POST `/entry?plate=...&parkingLot=...`  
  → Generates a ticket ID, stores vehicle entry data in DynamoDB.

- POST `/exit?ticketId=...`  
  → Retrieves entry data, calculates time parked and charge, deletes the ticket from DynamoDB.

### Billing:
- $10/hour, billed in 15-minute increments.

---

## Deployment

The app is deployed on an **AWS EC2 instance** (Ubuntu 24.04) and uses **DynamoDB** for persistence.

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

---

### DynamoDB Setup Instructions:

1. Go to the AWS Management Console → DynamoDB.
2. Create a new table:
   - Table name: `Tickets`
   - Partition key: `ticketId` (String)
3. No sort key or secondary indexes are required.

---

## Testing

To test from inside EC2:

```bash
curl -X POST "http://localhost:3000/entry?plate=123-123-123&parkingLot=382"
curl -X POST "http://localhost:3000/exit?ticketId=THE_ID_FROM_ENTRY"
```

To test externally (once running):

```bash
curl -X POST "http://<your-ec2-public-dns>:3000/entry?plate=123-123-123&parkingLot=382"
```

---

## Notes

- This version uses **AWS DynamoDB** for persistent storage.
- No hardcoded access keys are present in the repo.
- The app assumes that the EC2 instance has the necessary IAM role or environment credentials to access DynamoDB.

