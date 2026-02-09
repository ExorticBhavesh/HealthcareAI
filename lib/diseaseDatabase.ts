// Disease-to-Symptom Mapping Database
// Maps common health conditions to their associated symptoms from SYMPTOMS_LIST

export interface DiseaseEntry {
  id: string;
  name: string;
  category: string;
  description: string;
  relatedSymptoms: string[];
  preventiveGuidance: string[];
}

export const DISEASE_DATABASE: DiseaseEntry[] = [
  // Metabolic & Endocrine
  {
    id: 'diabetes',
    name: 'Diabetes Indicators',
    category: 'Metabolic',
    description: 'Symptoms commonly associated with blood sugar regulation issues',
    relatedSymptoms: ['excessive_thirst', 'frequent_urination', 'fatigue', 'weight_change', 'blurred_vision', 'low_energy'],
    preventiveGuidance: ['Monitor blood sugar levels regularly', 'Maintain a balanced diet low in processed sugars', 'Exercise regularly for at least 30 minutes daily'],
  },
  {
    id: 'thyroid_disorder',
    name: 'Thyroid Concerns',
    category: 'Metabolic',
    description: 'Symptoms that may relate to thyroid function',
    relatedSymptoms: ['fatigue', 'weight_change', 'weight_loss', 'weight_gain', 'mood_swings', 'muscle_pain', 'dry_skin', 'low_energy'],
    preventiveGuidance: ['Get thyroid function tested periodically', 'Ensure adequate iodine in diet', 'Monitor energy levels and weight changes'],
  },
  // Cardiovascular
  {
    id: 'hypertension',
    name: 'Hypertension Signs',
    category: 'Cardiovascular',
    description: 'Symptoms commonly linked to high blood pressure',
    relatedSymptoms: ['headache', 'dizziness', 'chest_pain', 'shortness_breath', 'high_bp_symptoms', 'blurred_vision', 'palpitations'],
    preventiveGuidance: ['Reduce sodium intake', 'Exercise regularly', 'Monitor blood pressure at home', 'Manage stress levels'],
  },
  {
    id: 'heart_disease',
    name: 'Cardiac Concerns',
    category: 'Cardiovascular',
    description: 'Symptoms that may indicate cardiovascular issues',
    relatedSymptoms: ['chest_pain', 'shortness_breath', 'palpitations', 'irregular_heartbeat', 'rapid_heartbeat', 'swollen_legs', 'fatigue', 'dizziness'],
    preventiveGuidance: ['Maintain heart-healthy diet', 'Regular cardiovascular exercise', 'Avoid smoking and excessive alcohol', 'Monitor cholesterol levels'],
  },
  // Respiratory
  {
    id: 'asthma',
    name: 'Asthma Indicators',
    category: 'Respiratory',
    description: 'Symptoms commonly associated with asthma',
    relatedSymptoms: ['wheezing', 'shortness_breath', 'chest_tightness', 'cough', 'breathlessness'],
    preventiveGuidance: ['Avoid known triggers', 'Keep an inhaler accessible', 'Practice breathing exercises', 'Monitor air quality'],
  },
  {
    id: 'bronchitis',
    name: 'Bronchitis Signs',
    category: 'Respiratory',
    description: 'Symptoms related to bronchial inflammation',
    relatedSymptoms: ['cough', 'productive_cough', 'chest_tightness', 'fatigue', 'sore_throat', 'wheezing'],
    preventiveGuidance: ['Stay hydrated', 'Avoid irritants and pollutants', 'Rest adequately', 'Use a humidifier'],
  },
  {
    id: 'common_cold_flu',
    name: 'Cold & Flu',
    category: 'Respiratory',
    description: 'Symptoms of common cold and influenza',
    relatedSymptoms: ['fever', 'cough', 'sore_throat', 'runny_nose', 'nasal_congestion', 'sneezing', 'body_pain', 'fatigue', 'chills', 'headache'],
    preventiveGuidance: ['Wash hands frequently', 'Get adequate rest', 'Stay hydrated', 'Consider flu vaccination'],
  },
  // Neurological
  {
    id: 'migraine_disorder',
    name: 'Migraine Pattern',
    category: 'Neurological',
    description: 'Symptoms associated with migraine episodes',
    relatedSymptoms: ['migraine', 'headache', 'nausea', 'light_sensitivity', 'blurred_vision', 'dizziness', 'vertigo'],
    preventiveGuidance: ['Identify and avoid triggers', 'Maintain regular sleep schedule', 'Stay hydrated', 'Practice relaxation techniques'],
  },
  {
    id: 'anxiety_disorder',
    name: 'Anxiety Pattern',
    category: 'Mental Health',
    description: 'Symptoms commonly associated with anxiety disorders',
    relatedSymptoms: ['anxiety', 'panic_attacks', 'social_anxiety', 'restlessness', 'insomnia', 'palpitations', 'shortness_breath', 'stress', 'poor_concentration'],
    preventiveGuidance: ['Practice mindfulness meditation', 'Regular physical exercise', 'Limit caffeine intake', 'Consider professional counseling'],
  },
  {
    id: 'depression_pattern',
    name: 'Depression Indicators',
    category: 'Mental Health',
    description: 'Symptoms that may indicate depressive episodes',
    relatedSymptoms: ['depression', 'low_motivation', 'insomnia', 'fatigue', 'appetite_loss', 'poor_concentration', 'mood_swings', 'irritability'],
    preventiveGuidance: ['Stay physically active', 'Maintain social connections', 'Seek professional support', 'Establish daily routines'],
  },
  // Gastrointestinal
  {
    id: 'gastritis',
    name: 'Gastritis Signs',
    category: 'Digestive',
    description: 'Symptoms of stomach lining inflammation',
    relatedSymptoms: ['stomach_pain', 'nausea', 'acidity', 'bloating', 'vomiting', 'appetite_loss', 'indigestion'],
    preventiveGuidance: ['Eat smaller, frequent meals', 'Avoid spicy and acidic foods', 'Reduce alcohol consumption', 'Manage stress'],
  },
  {
    id: 'ibs',
    name: 'IBS Indicators',
    category: 'Digestive',
    description: 'Symptoms commonly associated with irritable bowel syndrome',
    relatedSymptoms: ['stomach_pain', 'bloating', 'diarrhea', 'constipation', 'gas', 'abdominal_cramps', 'nausea'],
    preventiveGuidance: ['Identify trigger foods', 'Eat high-fiber diet', 'Stay hydrated', 'Manage stress levels'],
  },
  // Musculoskeletal
  {
    id: 'arthritis',
    name: 'Arthritis Indicators',
    category: 'Musculoskeletal',
    description: 'Symptoms associated with joint inflammation',
    relatedSymptoms: ['joint_pain', 'stiffness', 'knee_pain', 'shoulder_pain', 'muscle_pain', 'weakness', 'fatigue'],
    preventiveGuidance: ['Maintain healthy weight', 'Stay physically active', 'Apply warm/cold therapy', 'Consider anti-inflammatory diet'],
  },
  {
    id: 'back_issues',
    name: 'Back Problems',
    category: 'Musculoskeletal',
    description: 'Symptoms related to back and spine issues',
    relatedSymptoms: ['back_pain', 'neck_pain', 'stiffness', 'muscle_pain', 'numbness', 'muscle_cramps'],
    preventiveGuidance: ['Practice good posture', 'Strengthen core muscles', 'Take regular breaks from sitting', 'Use ergonomic furniture'],
  },
  // Dermatological
  {
    id: 'allergic_reaction',
    name: 'Allergic Reactions',
    category: 'Immunological',
    description: 'Symptoms of allergic responses',
    relatedSymptoms: ['allergies', 'skin_rash', 'itching', 'sneezing', 'runny_nose', 'nasal_congestion', 'hay_fever', 'food_sensitivity'],
    preventiveGuidance: ['Identify and avoid allergens', 'Keep antihistamines available', 'Maintain clean living environment', 'Consider allergy testing'],
  },
  {
    id: 'eczema_condition',
    name: 'Eczema / Dermatitis',
    category: 'Dermatological',
    description: 'Symptoms of skin inflammation conditions',
    relatedSymptoms: ['eczema', 'skin_rash', 'itching', 'dry_skin', 'skin_discoloration'],
    preventiveGuidance: ['Moisturize regularly', 'Avoid harsh soaps and detergents', 'Manage stress', 'Wear breathable fabrics'],
  },
  // Sleep
  {
    id: 'sleep_disorder',
    name: 'Sleep Disorders',
    category: 'Neurological',
    description: 'Symptoms related to sleep disturbances',
    relatedSymptoms: ['insomnia', 'poor_sleep_quality', 'fatigue', 'low_energy', 'irritability', 'poor_concentration', 'headache', 'brain_fog'],
    preventiveGuidance: ['Maintain consistent sleep schedule', 'Create dark, cool sleeping environment', 'Limit screen time before bed', 'Avoid caffeine after noon'],
  },
  // Stress-related
  {
    id: 'burnout',
    name: 'Burnout Syndrome',
    category: 'Mental Health',
    description: 'Symptoms associated with chronic stress and burnout',
    relatedSymptoms: ['fatigue', 'stress', 'insomnia', 'low_motivation', 'irritability', 'poor_concentration', 'brain_fog', 'headache', 'appetite_loss'],
    preventiveGuidance: ['Set healthy work-life boundaries', 'Take regular breaks', 'Practice self-care routines', 'Seek support from colleagues and professionals'],
  },
  // Vision
  {
    id: 'eye_strain_syndrome',
    name: 'Digital Eye Strain',
    category: 'Sensory',
    description: 'Symptoms from prolonged screen exposure',
    relatedSymptoms: ['eye_strain', 'dry_eyes', 'blurred_vision', 'headache', 'light_sensitivity', 'neck_pain'],
    preventiveGuidance: ['Follow 20-20-20 rule', 'Adjust screen brightness', 'Use blue light filters', 'Take regular breaks from screens'],
  },
  // Infection patterns
  {
    id: 'viral_infection',
    name: 'Viral Infection Pattern',
    category: 'Immunological',
    description: 'Common viral infection symptoms',
    relatedSymptoms: ['fever', 'fatigue', 'body_pain', 'chills', 'cough', 'sore_throat', 'headache', 'appetite_loss', 'weakness'],
    preventiveGuidance: ['Rest and stay hydrated', 'Practice good hygiene', 'Boost immunity with balanced diet', 'Seek medical attention if symptoms worsen'],
  },
  {
    id: 'uti_pattern',
    name: 'Urinary Tract Concerns',
    category: 'Metabolic',
    description: 'Symptoms that may indicate urinary issues',
    relatedSymptoms: ['frequent_urination', 'fever', 'fatigue', 'stomach_pain', 'chills'],
    preventiveGuidance: ['Drink plenty of water', 'Practice good hygiene', 'Don\'t hold urine for long periods', 'Seek medical evaluation'],
  },
  {
    id: 'anemia',
    name: 'Anemia Indicators',
    category: 'Metabolic',
    description: 'Symptoms associated with low blood count',
    relatedSymptoms: ['fatigue', 'weakness', 'dizziness', 'shortness_breath', 'pale_skin', 'rapid_heartbeat', 'low_energy', 'poor_concentration'],
    preventiveGuidance: ['Eat iron-rich foods', 'Include vitamin C to improve absorption', 'Consider supplements if recommended', 'Get regular blood tests'],
  },
];

// Search diseases by name, category, or description
export function searchDiseases(query: string): DiseaseEntry[] {
  if (!query || query.trim().length < 2) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return DISEASE_DATABASE.filter(disease => 
    disease.name.toLowerCase().includes(normalizedQuery) ||
    disease.category.toLowerCase().includes(normalizedQuery) ||
    disease.description.toLowerCase().includes(normalizedQuery) ||
    disease.id.toLowerCase().includes(normalizedQuery)
  );
}

// Get default featured diseases for display
export function getFeaturedDiseases(): DiseaseEntry[] {
  return DISEASE_DATABASE.slice(0, 6);
}
