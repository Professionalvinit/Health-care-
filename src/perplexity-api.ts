// Mock Perplexity API for demo purposes
// In a real application, this would connect to the actual Perplexity API

export interface PerplexityResponse {
  response: string;
  sources: string[];
}

export async function perplexityChat(query: string): Promise<PerplexityResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock response based on common health queries
  const mockResponse = generateMockHealthResponse(query);
  
  return {
    response: mockResponse.response,
    sources: mockResponse.sources
  };
}

function generateMockHealthResponse(query: string): PerplexityResponse {
  const lowerQuery = query.toLowerCase();
  
  // Common symptom responses
  if (lowerQuery.includes('headache')) {
    return {
      response: `Based on your symptoms, headaches can have various causes including tension, dehydration, stress, or underlying medical conditions. 

**Immediate recommendations:**
- Stay hydrated by drinking plenty of water
- Rest in a quiet, dark room
- Apply a cold or warm compress to your head or neck
- Consider over-the-counter pain relievers if appropriate

**When to seek medical attention:**
- Sudden, severe headache unlike any you've had before
- Headache with fever, stiff neck, confusion, or vision changes
- Headache after a head injury
- Chronic headaches that worsen over time

**Important:** This is general information only. Please consult with a healthcare professional for proper diagnosis and treatment tailored to your specific situation.`,
      sources: [
        'Mayo Clinic - Headache Causes and Treatment',
        'WebMD - When to See a Doctor for Headaches',
        'American Migraine Foundation'
      ]
    };
  }
  
  if (lowerQuery.includes('fever')) {
    return {
      response: `Fever is often a sign that your body is fighting an infection. Here's what you should know:

**General care for fever:**
- Rest and stay hydrated
- Dress in lightweight clothing
- Use fever-reducing medications as directed (acetaminophen or ibuprofen)
- Monitor temperature regularly

**Seek immediate medical attention if:**
- Temperature above 103°F (39.4°C)
- Fever lasts more than 3 days
- Accompanied by severe symptoms like difficulty breathing, chest pain, or severe headache
- Signs of dehydration

**For children:** Different guidelines apply. Consult pediatric care for fevers in infants under 3 months.

**Disclaimer:** This information is for educational purposes only and should not replace professional medical advice.`,
      sources: [
        'CDC - Fever Treatment Guidelines',
        'American Academy of Pediatrics',
        'Mayo Clinic - Fever Management'
      ]
    };
  }
  
  if (lowerQuery.includes('cough')) {
    return {
      response: `Coughs can be caused by various factors including viral infections, allergies, or environmental irritants.

**Types of coughs:**
- Dry cough: Often caused by viral infections or allergies
- Productive cough: May indicate bacterial infection or other conditions

**Home remedies:**
- Stay hydrated with warm liquids
- Use honey (not for children under 1 year)
- Humidify the air
- Avoid irritants like smoke

**See a healthcare provider if:**
- Cough persists more than 2-3 weeks
- Coughing up blood
- High fever with cough
- Difficulty breathing or wheezing
- Cough interferes with sleep for several nights

**Important:** Persistent coughs should be evaluated by a healthcare professional to rule out serious conditions.`,
      sources: [
        'American Lung Association',
        'Mayo Clinic - Cough Treatment',
        'CDC - Respiratory Health Guidelines'
      ]
    };
  }
  
  // Default response for other symptoms
  return {
    response: `Thank you for sharing your symptoms. While I can provide general health information, it's important to consult with a healthcare professional for proper evaluation and diagnosis.

**General recommendations:**
- Monitor your symptoms and note any changes
- Stay hydrated and get adequate rest
- Maintain good hygiene practices
- Keep a symptom diary if symptoms persist

**Seek medical attention if:**
- Symptoms worsen or don't improve
- You develop new concerning symptoms
- You have underlying health conditions
- You're unsure about the severity of your symptoms

**Emergency situations:** Call emergency services immediately if you experience:
- Difficulty breathing
- Chest pain
- Severe allergic reactions
- Loss of consciousness
- Severe bleeding

**Disclaimer:** This AI-generated response is for informational purposes only and should not be considered medical advice. Always consult with qualified healthcare professionals for proper diagnosis and treatment.`,
    sources: [
      'General Health Guidelines - CDC',
      'When to Seek Medical Care - Mayo Clinic',
      'Emergency Medical Services Guidelines'
    ]
  };
}
