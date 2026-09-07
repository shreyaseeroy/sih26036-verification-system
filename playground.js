require('dotenv').config();
const mongoose = require('mongoose');
const Instrument = require('./models/Instrument');
const User = require('./models/User');

async function getExpiringInstruments(daysAhead = 30) {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + daysAhead);

  const expiringSoon = await Instrument.find({
    verificationStatus: 'verified',
    validUntil: { $gte: today, $lte: futureDate }
  }).populate('ownerId');

  return expiringSoon;
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected!');

  const results = await getExpiringInstruments(30);
  console.log(`Instruments expiring in the next 30 days: ${results.length}`);
  results.forEach(inst => {
    console.log(`- ${inst.serialNumber} (owner: ${inst.ownerId.name}) expires ${inst.validUntil.toDateString()}`);
  });

  await mongoose.disconnect();
}

main();