const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Certificate = require('../models/Certificate');
const Instrument = require('../models/Instrument');
const User = require('../models/User');
const Application = require('../models/Application');

function generateAuthHash(certificateData) {
  const dataString = `${certificateData.certificateNumber}-${certificateData.instrumentId}-${certificateData.issueDate}-${certificateData.validUntil}`;
  return crypto.createHash('sha256').update(dataString).digest('hex');
}

// GET /api/certificates - fetch all certificates
router.get('/', async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate('instrumentId')
      .populate('issuedBy');
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/certificates/verify/:certificateNumber - the core authentication check
router.get('/verify/:certificateNumber', async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certificateNumber: req.params.certificateNumber })
      .populate('instrumentId')
      .populate('issuedBy');

    if (!cert) {
      return res.status(404).json({ valid: false, reason: "Certificate not found" });
    }

    const recomputedHash = generateAuthHash({
      certificateNumber: cert.certificateNumber,
      instrumentId: cert.instrumentId._id.toString(),
      issueDate: cert.issueDate.toISOString(),
      validUntil: cert.validUntil.toISOString()
    });

    const isAuthentic = recomputedHash === cert.authHash;
    const isExpired = new Date() > cert.validUntil;

    res.json({
      valid: isAuthentic && !isExpired,
      isAuthentic,
      isExpired,
      reason: !isAuthentic ? "Hash mismatch — certificate may be tampered" : (isExpired ? "Certificate expired" : "Valid"),
      certificate: cert
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/certificates - issue a new certificate (typically called when an Application is marked 'completed')
router.post('/', async (req, res) => {
  try {
    const { applicationId, instrumentId, issuedBy, validityYears = 1 } = req.body;

    const certificateNumber = `CERT-${Date.now()}`;
    const issueDate = new Date();
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + validityYears);

    const authHash = generateAuthHash({
      certificateNumber,
      instrumentId,
      issueDate: issueDate.toISOString(),
      validUntil: validUntil.toISOString()
    });

    const newCertificate = await Certificate.create({
      applicationId,
      instrumentId,
      certificateNumber,
      issuedBy,
      issueDate,
      validUntil,
      qrCodeData: `https://sih-verification.example.com/verify/${certificateNumber}`,
      authHash
    });

    res.status(201).json(newCertificate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;