const express = require('express');

const authMiddleware = require('../middleware/auth');

const router = express.Router();

const demoCampaigns = [
  {
    id: 'cmp-101',
    name: 'Clean Water Initiative',
    description: 'Bringing sustainable water solutions to remote communities.',
    status: 'Live',
  },
  {
    id: 'cmp-102',
    name: 'Back-to-School Drive',
    description: 'Supplying backpacks and learning kits for students in need.',
    status: 'Planning',
  },
  {
    id: 'cmp-103',
    name: 'Community Garden Expansion',
    description: 'Expanding local gardens to improve food security.',
    status: 'Completed',
  },
];

router.get('/', authMiddleware, (req, res) => {
  res.json({ campaigns: demoCampaigns });
});

module.exports = router;
