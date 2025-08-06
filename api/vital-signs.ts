import { VercelRequest, VercelResponse } from '@vercel/node';

// Mock vital signs data
const generateMockVitals = (days: number) => {
  const vitals = [];
  for (let i = days; i >= 0; i -= 7) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    vitals.push({
      id: `vital-${i}`,
      recordDate: date,
      systolic: 115 + Math.floor(Math.random() * 10),
      diastolic: 75 + Math.floor(Math.random() * 10),
      heartRate: 68 + Math.floor(Math.random() * 12),
      temperature: 98.1 + (Math.random() * 1.5),
      weight: 150 + Math.floor(Math.random() * 5),
      height: 68,
      bmi: 22.8
    });
  }
  return vitals;
};

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
      const { patientId, days, limit } = req.query;

      if (!patientId) {
        return res.status(400).json({ error: 'Patient ID is required' });
      }

      const daysToFetch = days ? parseInt(days as string) : 180;
      let vitalSigns = generateMockVitals(daysToFetch);

      if (limit) {
        vitalSigns = vitalSigns.slice(0, parseInt(limit as string));
      }

      return res.status(200).json(vitalSigns);
    }

    if (req.method === 'POST') {
      const { patientId, systolic, diastolic, heartRate, temperature, weight, height, recordDate } = req.body;

      if (!patientId || !recordDate) {
        return res.status(400).json({ error: 'Patient ID and record date are required' });
      }

      // Calculate BMI if weight and height are provided
      let bmi = null;
      if (weight && height) {
        bmi = (weight / (height * height)) * 703;
        bmi = Math.round(bmi * 10) / 10;
      }

      const vitalSigns = {
        id: Date.now().toString(),
        patientId,
        systolic: systolic || null,
        diastolic: diastolic || null,
        heartRate: heartRate || null,
        temperature: temperature || null,
        weight: weight || null,
        height: height || null,
        bmi,
        recordDate: new Date(recordDate),
      };

      return res.status(201).json(vitalSigns);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Error in vital-signs API:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
