
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

## AWS Credentials Setup
This application requires AWS credentials with access to DynamoDB in region eu-north-1.

## Option 1 – Environment Variables
Before starting the server, set:

```bash
export AWS_ACCESS_KEY_ID=<your-access-key-id>
export AWS_SECRET_ACCESS_KEY=<your-secret-access-key>
export AWS_REGION=eu-north-1
export AWS_DEFAULT_REGION=eu-north-1
```

Or run inline:
```bash
AWS_ACCESS_KEY_ID=<your-access-key-id> \
AWS_SECRET_ACCESS_KEY=<your-secret-access-key> \
AWS_REGION=eu-north-1 \
AWS_DEFAULT_REGION=eu-north-1 \
npm run start
```

## Option 2 – IAM Role (Recommended for EC2)
Attach an IAM role to the EC2 instance with the following permissions on your DynamoDB table:
json:
{
  "Effect": "Allow",
  "Action": [
    "dynamodb:PutItem",
    "dynamodb:GetItem",
    "dynamodb:UpdateItem",
    "dynamodb:DeleteItem"
  ],
  "Resource": "arn:aws:dynamodb:eu-north-1:<account-id>:table/<table-name>"
}


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

