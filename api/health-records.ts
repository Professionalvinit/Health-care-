import { VercelRequest, VercelResponse } from '@vercel/node';

// Mock data for demo purposes
const mockHealthRecords = [
  {
    id: '1',
    type: 'LAB_RESULT',
    title: 'Complete Blood Count',
    description: 'Annual CBC panel showing all values within normal ranges',
    value: null,
    unit: null,
    recordDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    provider: 'Dr. Michael Chen',
    isPublic: false
  },
  {
    id: '2',
    type: 'VITAL_SIGNS',
    title: 'Blood Pressure Reading',
    description: 'Regular blood pressure monitoring',
    value: '120/80',
    unit: 'mmHg',
    recordDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    provider: 'Nurse Jennifer',
    isPublic: false
  }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const { patientId, type, limit } = req.query;

      if (!patientId) {
        return res.status(400).json({ error: 'Patient ID is required' });
      }

      let filteredRecords = mockHealthRecords;
      
      if (type && type !== 'all') {
        filteredRecords = filteredRecords.filter(record => record.type === type);
      }

      if (limit) {
        filteredRecords = filteredRecords.slice(0, parseInt(limit as string));
      }

      return res.status(200).json(filteredRecords);
    }

    if (req.method === 'POST') {
      const { patientId, type, title, description, value, unit, recordDate, provider } = req.body;

      if (!patientId || !type || !title || !recordDate || !provider) {
        return res.status(400).json({
          error: 'Missing required fields: patientId, type, title, recordDate, provider'
        });
      }

      const newRecord = {
        id: Date.now().toString(),
        type,
        title: title.trim(),
        description: description?.trim() || '',
        value: value?.trim() || null,
        unit: unit?.trim() || null,
        recordDate: new Date(recordDate),
        provider: provider.trim(),
        isPublic: false,
      };

      // In a real app, save to database
      mockHealthRecords.push(newRecord);

      return res.status(201).json(newRecord);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Error in health-records API:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
