export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateWalletAddress = (address) => {
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/
  return ethAddressRegex.test(address)
}

export const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['audio/', 'video/', 'text/plain', 'application/pdf'],
    allowedExtensions = ['.mp3', '.wav', '.mp4', '.txt', '.pdf']
  } = options

  const errors = []

  if (file.size > maxSize) {
    errors.push(`File size must be less than ${maxSize / 1024 / 1024}MB`)
  }

  const isTypeAllowed = allowedTypes.some(type => file.type.startsWith(type))
  const isExtensionAllowed = allowedExtensions.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  )

  if (!isTypeAllowed && !isExtensionAllowed) {
    errors.push(`File type not supported. Allowed: ${allowedExtensions.join(', ')}`)
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateSubmission = (data) => {
  const errors = {}

  if (!data.type) {
    errors.type = 'Please select a content type'
  }

  if (!data.file) {
    errors.file = 'Please upload or record content'
  }

  if (!data.title?.trim()) {
    errors.title = 'Title is required'
  } else if (data.title.length < 5) {
    errors.title = 'Title must be at least 5 characters'
  }

  if (!data.community?.trim()) {
    errors.community = 'Community/region is required'
  }

  if (!data.language) {
    errors.language = 'Language is required'
  }

  if (!data.license) {
    errors.license = 'Please select a license'
  }

  if (!data.consent) {
    errors.consent = 'You must agree to the consent terms'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const sanitizeText = (text) => {
  return text
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .substring(0, 5000) // Limit length
}