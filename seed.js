require('dotenv').config();
const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('./models/User');
const Instrument = require('./models/Instrument');
const Application = require('./models/Application');
const Certificate = require('./models/Certificate');

function generateAuthHash(certificateData) {
  const dataString = `${certificateData.certificateNumber}-${certificateData.instrumentId}-${certificateData.issueDate}-${certificateData.validUntil}`;
  return crypto.createHash('sha256').update(dataString).digest('hex');
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected!');

  // Clear existing data first, so re-running this script gives clean results
  await User.deleteMany({});
  await Instrument.deleteMany({});
  await Application.deleteMany({});
  await Certificate.deleteMany({});
  console.log('Old data cleared.');

  // Create sample users
  const users = await User.create([
    {
      name: "Anil Kumar Verma",
      email: "anil.verma@example.com",
      password: "password123",
      role: "user",
      phone: "9876543210"
    },
    {
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      password: "password123",
      role: "user",
      phone: "9123456789"
    },
    {
      name: "Rohan Das",
      email: "rohan.das@example.com",
      password: "password123",
      role: "lmo",
      phone: "9988776655"
    },
    {
      name: "Sunita Reddy",
      email: "sunita.reddy@example.com",
      password: "password123",
      role: "lmo",
      phone: "9765432109"
    },
    {
      name: "Bharat Test & Calibration Centre",
      email: "bharat.gatc@example.com",
      password: "password123",
      role: "gatc",
      phone: "9654321098"
    },
    {
      name: "Meera Iyer",
      email: "meera.iyer@example.com",
      password: "password123",
      role: "admin",
      phone: "9543210987"
    }
  ]);
  console.log(`Created ${users.length} users.`);

  const anil = users.find(u => u.email === "anil.verma@example.com");
  const priya = users.find(u => u.email === "priya.sharma@example.com");
  const rohan = users.find(u => u.email === "rohan.das@example.com");

  // Create sample instruments
  const instruments = await Instrument.create([
    {
      serialNumber: "WS-2024-00123",
      instrumentType: "weighing_scale",
      manufacturer: "Punit Instruments Pvt. Ltd.",
      modelApprovalNumber: "MA-IND-4521",
      accuracyClass: "II",
      ownerId: anil._id,
      verificationStatus: "verified",
      verificationDate: new Date("2026-01-15"),
      validUntil: new Date("2027-01-15")
    },
    {
      serialNumber: "TM-2024-00456",
      instrumentType: "taxi_meter",
      manufacturer: "Trimax Metering Systems",
      modelApprovalNumber: "MA-IND-7788",
      accuracyClass: "III",
      ownerId: priya._id,
      verificationStatus: "pending"
    },
    {
      serialNumber: "WS-2024-00789",
      instrumentType: "weighing_scale",
      manufacturer: "Punit Instruments Pvt. Ltd.",
      modelApprovalNumber: "MA-IND-4521",
      accuracyClass: "I",
      ownerId: anil._id,
      verificationStatus: "expired",
      verificationDate: new Date("2025-02-01"),
      validUntil: new Date("2026-02-01")
    },
    {
      serialNumber: "WS-2024-00999",
      instrumentType: "weighing_scale",
      manufacturer: "Trimax Metering Systems",
      modelApprovalNumber: "MA-IND-9012",
      accuracyClass: "II",
      ownerId: priya._id,
      verificationStatus: "verified",
      verificationDate: new Date("2025-09-20"),
      validUntil: new Date("2026-09-20")   // expiring soon — powers the "expiring soon" demo
    }
  ]);
  console.log(`Created ${instruments.length} instruments.`);

  const verifiedInstrument = instruments.find(i => i.serialNumber === "WS-2024-00123");

  // Create a sample application (completed, ready to have a certificate)
  const application = await Application.create({
    instrumentId: verifiedInstrument._id,
    applicantId: anil._id,
    assignedTo: rohan._id,
    applicationType: "verification",
    status: "completed",
    scheduledDate: new Date("2026-01-10"),
    remarks: "Instrument checked, within accuracy tolerance. Approved.",
    photoUrls: [
      "https://placeholder.com/instrument-front.jpg",
      "https://placeholder.com/nameplate.jpg"
    ]
  });
  console.log('Created 1 application.');

  // Create the certificate for that completed application
  const certificateNumber = "CERT-2026-00001";
  const issueDate = new Date("2026-01-15");
  const validUntil = new Date("2027-01-15");

  const authHash = generateAuthHash({
    certificateNumber,
    instrumentId: verifiedInstrument._id.toString(),
    issueDate: issueDate.toISOString(),
    validUntil: validUntil.toISOString()
  });

  const certificate = await Certificate.create({
    applicationId: application._id,
    instrumentId: verifiedInstrument._id,
    certificateNumber,
    issuedBy: rohan._id,
    issueDate,
    validUntil,
    qrCodeData: `https://sih-verification.example.com/verify/${certificateNumber}`,
    authHash
  });
  console.log('Created 1 certificate:', certificate.certificateNumber);

  await mongoose.disconnect();
  console.log('Disconnected. Seeding complete!');
}

seed();