const express = require('express');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

// Configure AWS SDK
AWS.config.update({ region: 'eu-north-1' });
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'Tickets';

app.post('/entry', async (req, res) => {
  const { plate, parkingLot } = req.query;

  if (!plate || !parkingLot) {
    return res.status(400).json({ error: 'Missing plate or parkingLot' });
  }

  const ticketId = uuidv4();
  const entryTime = Date.now();

  const params = {
    TableName: TABLE_NAME,
    Item: {
      ticketId,
      plate,
      parkingLot,
      entryTime
    }
  };

  try {
    await dynamo.put(params).promise();
    res.json({ ticketId });
  } catch (err) {
    console.error('DynamoDB Put Error:', err);
    res.status(500).json({ error: 'Failed to store ticket' });
  }
});

app.post('/exit', async (req, res) => {
  const { ticketId } = req.query;

  if (!ticketId) {
    return res.status(400).json({ error: 'Missing ticketId' });
  }

  const params = {
    TableName: TABLE_NAME,
    Key: { ticketId }
  };

  try {
    const result = await dynamo.get(params).promise();
    const ticket = result.Item;

    if (!ticket) return res.status(404).json({ error: 'Invalid ticket ID' });

    const exitTime = Date.now();
    const durationMin = Math.ceil((exitTime - ticket.entryTime) / 60000);
    const charge = Math.ceil(durationMin / 15) * (10 / 4);

    await dynamo.delete(params).promise();

    res.json({
      plate: ticket.plate,
      parkingLot: ticket.parkingLot,
      minutesParked: durationMin,
      charge: `$${charge.toFixed(2)}`
    });
  } catch (err) {
    console.error('DynamoDB Error:', err);
    res.status(500).json({ error: 'Failed to process ticket' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
