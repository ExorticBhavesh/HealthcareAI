export const SYMPTOMS_LIST = [
  // General Symptoms
  { id: 'fever', label: 'Fever', category: 'general' },
  { id: 'fatigue', label: 'Fatigue / Tiredness', category: 'general' },
  { id: 'weakness', label: 'General Weakness', category: 'general' },
  { id: 'body_pain', label: 'Body Pain', category: 'general' },
  { id: 'chills', label: 'Chills', category: 'general' },
  { id: 'dizziness', label: 'Dizziness', category: 'general' },
  { id: 'appetite_loss', label: 'Loss of Appetite', category: 'general' },
  { id: 'night_sweats', label: 'Night Sweats', category: 'general' },
  { id: 'malaise', label: 'General Malaise', category: 'general' },
  { id: 'weight_loss', label: 'Unexplained Weight Loss', category: 'general' },
  { id: 'weight_gain', label: 'Unexplained Weight Gain', category: 'general' },
  
  // Cardiovascular
  { id: 'chest_pain', label: 'Chest Pain', category: 'cardiovascular' },
  { id: 'palpitations', label: 'Heart Palpitations', category: 'cardiovascular' },
  { id: 'shortness_breath', label: 'Shortness of Breath', category: 'cardiovascular' },
  { id: 'irregular_heartbeat', label: 'Irregular Heartbeat', category: 'cardiovascular' },
  { id: 'high_bp_symptoms', label: 'High Blood Pressure Symptoms', category: 'cardiovascular' },
  { id: 'swollen_legs', label: 'Swollen Legs/Ankles', category: 'cardiovascular' },
  { id: 'rapid_heartbeat', label: 'Rapid Heartbeat', category: 'cardiovascular' },
  { id: 'slow_heartbeat', label: 'Slow Heartbeat', category: 'cardiovascular' },
  
  // Respiratory
  { id: 'cough', label: 'Cough', category: 'respiratory' },
  { id: 'cold', label: 'Common Cold', category: 'respiratory' },
  { id: 'sore_throat', label: 'Sore Throat', category: 'respiratory' },
  { id: 'breathlessness', label: 'Breathlessness', category: 'respiratory' },
  { id: 'wheezing', label: 'Wheezing', category: 'respiratory' },
  { id: 'runny_nose', label: 'Runny Nose', category: 'respiratory' },
  { id: 'nasal_congestion', label: 'Nasal Congestion', category: 'respiratory' },
  { id: 'sneezing', label: 'Frequent Sneezing', category: 'respiratory' },
  { id: 'chest_tightness', label: 'Chest Tightness', category: 'respiratory' },
  { id: 'productive_cough', label: 'Productive Cough (with Mucus)', category: 'respiratory' },
  
  // Neurological
  { id: 'headache', label: 'Headache', category: 'neurological' },
  { id: 'migraine', label: 'Migraine', category: 'neurological' },
  { id: 'anxiety', label: 'Anxiety', category: 'neurological' },
  { id: 'stress', label: 'High Stress', category: 'neurological' },
  { id: 'poor_concentration', label: 'Poor Concentration', category: 'neurological' },
  { id: 'insomnia', label: 'Insomnia / Sleep Issues', category: 'neurological' },
  { id: 'memory_issues', label: 'Memory Problems', category: 'neurological' },
  { id: 'brain_fog', label: 'Brain Fog', category: 'neurological' },
  { id: 'numbness', label: 'Numbness/Tingling', category: 'neurological' },
  { id: 'tremors', label: 'Tremors', category: 'neurological' },
  { id: 'vertigo', label: 'Vertigo', category: 'neurological' },
  
  // Gastrointestinal / Digestive
  { id: 'stomach_pain', label: 'Stomach Pain', category: 'gastrointestinal' },
  { id: 'nausea', label: 'Nausea', category: 'gastrointestinal' },
  { id: 'diarrhea', label: 'Diarrhea', category: 'gastrointestinal' },
  { id: 'constipation', label: 'Constipation', category: 'gastrointestinal' },
  { id: 'acidity', label: 'Acidity / Heartburn', category: 'gastrointestinal' },
  { id: 'bloating', label: 'Bloating', category: 'gastrointestinal' },
  { id: 'vomiting', label: 'Vomiting', category: 'gastrointestinal' },
  { id: 'indigestion', label: 'Indigestion', category: 'gastrointestinal' },
  { id: 'abdominal_cramps', label: 'Abdominal Cramps', category: 'gastrointestinal' },
  { id: 'gas', label: 'Excessive Gas', category: 'gastrointestinal' },
  
  // Musculoskeletal
  { id: 'muscle_pain', label: 'Muscle Pain', category: 'musculoskeletal' },
  { id: 'joint_pain', label: 'Joint Pain', category: 'musculoskeletal' },
  { id: 'muscle_cramps', label: 'Muscle Cramps', category: 'musculoskeletal' },
  { id: 'back_pain', label: 'Back Pain', category: 'musculoskeletal' },
  { id: 'neck_pain', label: 'Neck Pain', category: 'musculoskeletal' },
  { id: 'stiffness', label: 'Muscle Stiffness', category: 'musculoskeletal' },
  { id: 'shoulder_pain', label: 'Shoulder Pain', category: 'musculoskeletal' },
  { id: 'knee_pain', label: 'Knee Pain', category: 'musculoskeletal' },
  
  // Mental Health
  { id: 'depression', label: 'Low Mood / Depression', category: 'mental' },
  { id: 'mood_swings', label: 'Mood Swings', category: 'mental' },
  { id: 'irritability', label: 'Irritability', category: 'mental' },
  { id: 'panic_attacks', label: 'Panic Attacks', category: 'mental' },
  { id: 'social_anxiety', label: 'Social Anxiety', category: 'mental' },
  { id: 'restlessness', label: 'Restlessness', category: 'mental' },
  { id: 'low_motivation', label: 'Low Motivation', category: 'mental' },
  
  // Dermatological / Skin
  { id: 'skin_rash', label: 'Skin Rash', category: 'dermatological' },
  { id: 'itching', label: 'Itching', category: 'dermatological' },
  { id: 'dry_skin', label: 'Dry Skin', category: 'dermatological' },
  { id: 'acne', label: 'Acne', category: 'dermatological' },
  { id: 'eczema', label: 'Eczema Symptoms', category: 'dermatological' },
  { id: 'skin_discoloration', label: 'Skin Discoloration', category: 'dermatological' },
  
  // Immunological
  { id: 'allergies', label: 'Allergies', category: 'immunological' },
  { id: 'frequent_infections', label: 'Frequent Infections', category: 'immunological' },
  { id: 'hay_fever', label: 'Hay Fever', category: 'immunological' },
  { id: 'food_sensitivity', label: 'Food Sensitivity', category: 'immunological' },
  
  // Metabolic / Lifestyle
  { id: 'weight_change', label: 'Unexplained Weight Change', category: 'metabolic' },
  { id: 'low_energy', label: 'Low Energy Levels', category: 'metabolic' },
  { id: 'dehydration', label: 'Dehydration Signs', category: 'metabolic' },
  { id: 'poor_sleep_quality', label: 'Poor Sleep Quality', category: 'metabolic' },
  { id: 'excessive_thirst', label: 'Excessive Thirst', category: 'metabolic' },
  { id: 'frequent_urination', label: 'Frequent Urination', category: 'metabolic' },
  { id: 'sugar_cravings', label: 'Sugar Cravings', category: 'metabolic' },
  
  // Eyes & Vision
  { id: 'eye_strain', label: 'Eye Strain', category: 'sensory' },
  { id: 'blurred_vision', label: 'Blurred Vision', category: 'sensory' },
  { id: 'dry_eyes', label: 'Dry Eyes', category: 'sensory' },
  { id: 'light_sensitivity', label: 'Light Sensitivity', category: 'sensory' },
  
  // Ears
  { id: 'ear_pain', label: 'Ear Pain', category: 'sensory' },
  { id: 'tinnitus', label: 'Ringing in Ears (Tinnitus)', category: 'sensory' },
  { id: 'hearing_issues', label: 'Hearing Issues', category: 'sensory' },
] as const;

export const SYMPTOM_CATEGORIES = {
  general: { label: 'General', color: 'hsl(var(--chart-1))' },
  respiratory: { label: 'Respiratory', color: 'hsl(var(--chart-2))' },
  cardiovascular: { label: 'Cardiovascular', color: 'hsl(var(--chart-3))' },
  gastrointestinal: { label: 'Digestive', color: 'hsl(var(--chart-4))' },
  neurological: { label: 'Neurological', color: 'hsl(var(--chart-5))' },
  musculoskeletal: { label: 'Musculoskeletal', color: 'hsl(var(--warning))' },
  mental: { label: 'Mental Health', color: 'hsl(var(--info))' },
  dermatological: { label: 'Skin', color: 'hsl(var(--accent))' },
  immunological: { label: 'Immune', color: 'hsl(var(--success))' },
  metabolic: { label: 'Metabolic', color: 'hsl(var(--destructive))' },
  sensory: { label: 'Eyes & Ears', color: 'hsl(280, 70%, 60%)' },
} as const;

export const MEDICAL_DISCLAIMER = `
⚕️ Medical Disclaimer: This tool provides general wellness information only and is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read or received from this application.

If you are experiencing a medical emergency, please call emergency services (911) immediately.
`;

export const REGIONS = ['North Region', 'South Region', 'East Region', 'West Region'] as const;

// Wellness Tips by category
export const WELLNESS_TIPS = [
  { id: 1, category: 'hydration', tip: 'Drink a glass of water first thing in the morning to kickstart your metabolism.', icon: 'droplet' },
  { id: 2, category: 'activity', tip: 'Take a 5-minute walk every hour to boost circulation and reduce fatigue.', icon: 'footprints' },
  { id: 3, category: 'sleep', tip: 'Avoid screens 1 hour before bedtime for better sleep quality.', icon: 'moon' },
  { id: 4, category: 'nutrition', tip: 'Include colorful vegetables in every meal for essential nutrients.', icon: 'apple' },
  { id: 5, category: 'stress', tip: 'Practice deep breathing for 3 minutes when feeling stressed.', icon: 'brain' },
  { id: 6, category: 'posture', tip: 'Stretch your neck and shoulders every 30 minutes if working at a desk.', icon: 'user' },
  { id: 7, category: 'hydration', tip: 'Aim for 8 glasses of water daily - your body will thank you!', icon: 'droplet' },
  { id: 8, category: 'activity', tip: 'Try to get 10,000 steps today for optimal heart health.', icon: 'footprints' },
  { id: 9, category: 'mindfulness', tip: 'Take 5 mindful breaths before starting any stressful task.', icon: 'sparkles' },
  { id: 10, category: 'nutrition', tip: 'Eat slowly and mindfully - it takes 20 minutes to feel full.', icon: 'apple' },
] as const;

// Wellness Routine Items
export const WELLNESS_ROUTINES = {
  morning: [
    { id: 'morning_water', label: 'Drink a glass of water', icon: 'droplet' },
    { id: 'morning_stretch', label: '5-minute morning stretch', icon: 'activity' },
    { id: 'healthy_breakfast', label: 'Eat a nutritious breakfast', icon: 'apple' },
    { id: 'morning_walk', label: 'Short morning walk or exercise', icon: 'footprints' },
    { id: 'set_intentions', label: 'Set daily wellness intentions', icon: 'target' },
  ],
  afternoon: [
    { id: 'lunch_hydration', label: 'Stay hydrated with water', icon: 'droplet' },
    { id: 'desk_stretch', label: 'Desk stretches & posture check', icon: 'user' },
    { id: 'mindful_lunch', label: 'Mindful eating at lunch', icon: 'apple' },
    { id: 'short_walk', label: '10-minute afternoon walk', icon: 'footprints' },
    { id: 'breathing_break', label: 'Deep breathing exercise', icon: 'wind' },
  ],
  evening: [
    { id: 'light_dinner', label: 'Light, early dinner', icon: 'apple' },
    { id: 'evening_walk', label: 'Evening relaxation walk', icon: 'footprints' },
    { id: 'screen_off', label: 'Screens off 1hr before bed', icon: 'monitor-off' },
    { id: 'gratitude', label: 'Gratitude journaling', icon: 'heart' },
    { id: 'sleep_prep', label: 'Prepare for quality sleep', icon: 'moon' },
  ],
} as const;