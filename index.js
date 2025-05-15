const express = require('express');
const app = express();
app.use(express.json());

let tickets = {};
let currentId = 1;

app.post('/entry', (req, res) => {
  const { plate, parkingLot } = req.query;
  const entryTime = Date.now();
  const ticketId = currentId++;
  tickets[ticketId] = { plate, parkingLot, entryTime };
  res.json({ ticketId });
});

app.post('/exit', (req, res) => {
  const { ticketId } = req.query;
  const ticket = tickets[ticketId];
  if (!ticket) return res.status(404).json({ error: 'Invalid ticket ID' });

  const exitTime = Date.now();
  const durationMs = exitTime - ticket.entryTime;
  const durationMin = Math.ceil(durationMs / (1000 * 60));
  const charge = Math.ceil(durationMin / 15) * (10 / 4);

  res.json({
    plate: ticket.plate,
    parkingLot: ticket.parkingLot,
    minutesParked: durationMin,
    charge: `$${charge.toFixed(2)}`
  });

  delete tickets[ticketId];
});

app.listen(80, () => {
  console.log('Server running on port 80');
});
