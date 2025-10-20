export const LICENSES = [
  {
    id: 'cc-by-nc',
    title: 'CC BY-NC',
    description: 'Attribution-NonCommercial - Free to share with credit, no commercial use',
    url: 'https://creativecommons.org/licenses/by-nc/4.0/'
  },
  {
    id: 'cc-by-nc-sa',
    title: 'CC BY-NC-SA',
    description: 'Attribution-NonCommercial-ShareAlike - Share alike, no commercial use',
    url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
  },
  {
    id: 'community',
    title: 'Community Use',
    description: 'Restricted to community members and approved researchers only',
    url: null
  },
  {
    id: 'research',
    title: 'Research Only',
    description: 'Available only for academic and non-commercial research purposes',
    url: null
  }
]

export const CONTENT_TYPES = [
  {
    id: 'story',
    title: 'Oral Story',
    description: 'Folktales, legends, historical narratives, or personal stories',
    icon: 'Mic',
    color: 'text-blue-400'
  },
  {
    id: 'medicine',
    title: 'Medicinal Knowledge',
    description: 'Traditional healing practices, plant uses, and remedies',
    icon: 'Heart',
    color: 'text-green-400'
  },
  {
    id: 'practice',
    title: 'Cultural Practice',
    description: 'Rituals, ceremonies, traditional skills, and customs',
    icon: 'Users',
    color: 'text-purple-400'
  },
  {
    id: 'proverb',
    title: 'Proverb/Wisdom',
    description: 'Traditional sayings, wisdom teachings, and philosophical insights',
    icon: 'Lightbulb',
    color: 'text-yellow-400'
  },
  {
    id: 'music',
    title: 'Music & Dance',
    description: 'Traditional songs, instrumental music, and dance forms',
    icon: 'Music',
    color: 'text-red-400'
  },
  {
    id: 'craft',
    title: 'Craft & Art',
    description: 'Traditional crafts, artwork, and manufacturing techniques',
    icon: 'Palette',
    color: 'text-pink-400'
  }
]

export const LANGUAGES = [
  'Swahili', 'English', 'Kikuyu', 'Luo', 'Yoruba', 'Zulu', 
  'Amharic', 'Igbo', 'Oromo', 'Shona', 'Hausa', 'Somali',
  'Afrikaans', 'Twi', 'Wolof', 'Bambara', 'Kinyarwanda',
  'Kirundi', 'Luganda', 'Sesotho', 'Other'
]

export const AFRICAN_REGIONS = [
  'East Africa', 'West Africa', 'North Africa', 'Southern Africa',
  'Central Africa', 'Horn of Africa', 'Sahel', 'Maghreb'
]

export const COUNTRIES = [
  'Kenya', 'Nigeria', 'Ethiopia', 'Egypt', 'South Africa', 'Ghana',
  'Tanzania', 'Uganda', 'Algeria', 'Sudan', 'Morocco', 'Angola',
  'Mozambique', 'Madagascar', 'Cameroon', "Côte d'Ivoire", 'Niger',
  'Burkina Faso', 'Mali', 'Malawi', 'Zambia', 'Senegal', 'Chad',
  'Somalia', 'Zimbabwe', 'Guinea', 'Rwanda', 'Benin', 'Burundi',
  'Tunisia', 'South Sudan', 'Togo', 'Sierra Leone', 'Libya',
  'Congo', 'Liberia', 'Central African Republic', 'Mauritania',
  'Eritrea', 'Namibia', 'Gambia', 'Botswana', 'Gabon', 'Lesotho',
  'Guinea-Bissau', 'Equatorial Guinea', 'Mauritius', 'Eswatini',
  'Djibouti', 'Comoros', 'Cabo Verde', 'Sao Tome and Principe',
  'Seychelles'
]

export const VALIDATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  NEEDS_REVIEW: 'needs_review'
}

export const ENTRY_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
}

export const USER_ROLES = {
  CONTRIBUTOR: 'contributor',
  VALIDATOR: 'validator',
  COMMUNITY_LEADER: 'community_leader',
  ADMIN: 'admin'
}