# Contributing to AfriVerse

Thank you for your interest in contributing to AfriVerse! This document provides guidelines for contributing to the project.

## 🌟 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- **Clear title** and description
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, browser, Node version)

### Suggesting Features

We welcome feature suggestions! Please:
- Check existing issues to avoid duplicates
- Describe the feature and its benefits
- Explain how it aligns with AfriVerse's mission
- Provide use cases or examples

### Pull Request Process

1. **Fork the repository** and create your branch from `main`
2. **Follow code style guidelines** (see below)
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Write clear commit messages**
6. **Submit a pull request**

## 💻 Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/AfriVerse.git
cd AfriVerse/frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Start development server
npm run dev
```

## 📝 Code Style Guidelines

### JavaScript/React

```javascript
// ✅ Good: Functional components with hooks
export default function MyComponent({ prop1, prop2 }) {
  const [state, setState] = useState(null)
  
  useEffect(() => {
    // Side effects here
  }, [])
  
  return <div>Content</div>
}

// ❌ Avoid: Class components
class MyComponent extends React.Component { }
```

### File Naming
- **Components**: PascalCase (e.g., `MyComponent.jsx`)
- **Utilities**: camelCase (e.g., `formatDate.js`)
- **Pages**: kebab-case (e.g., `my-page.js`)

### Import Order
```javascript
// 1. External libraries
import { useState } from 'react'
import { motion } from 'framer-motion'

// 2. Internal components
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// 3. Utilities and constants
import { api } from '@/lib/api'
import { CONTENT_TYPES } from '@/utils/constants'

// 4. Styles
import './styles.css'
```

### Component Structure
```javascript
'use client' // If client component

import { useState } from 'react'
import PropTypes from 'prop-types' // Optional

/**
 * Component description
 * @param {Object} props - Component props
 * @param {string} props.title - Title to display
 */
export default function Component({ title }) {
  // 1. State and hooks
  const [state, setState] = useState(null)
  
  // 2. Event handlers
  const handleClick = () => {
    // Logic here
  }
  
  // 3. Effects
  useEffect(() => {
    // Side effects
  }, [])
  
  // 4. Render
  return (
    <div>
      <h1>{title}</h1>
    </div>
  )
}

// PropTypes (optional)
Component.propTypes = {
  title: PropTypes.string.isRequired
}
```

### CSS/Styling

```css
/* Use Tailwind utility classes when possible */
<div className="flex items-center justify-between p-4 bg-primary-navy">

/* For custom styles, use CSS modules or styled components */
.custom-style {
  /* Custom CSS here */
}
```

## 🧪 Testing

Before submitting a PR:

```bash
# Run linter
npm run lint

# Build project
npm run build

# Test in production mode
npm run start
```

## 📐 Component Checklist

When creating a new component:

- [ ] Functional component with hooks
- [ ] Props destructured in function signature
- [ ] Responsive design (mobile-first)
- [ ] Accessible (ARIA labels, keyboard navigation)
- [ ] Loading and error states
- [ ] JSDoc comments for complex logic
- [ ] Used in at least one page

## 🎨 Design Guidelines

### Colors
- Use theme colors from `tailwind.config.js`
- Maintain contrast ratios for accessibility (WCAG AA)

### Typography
- **Headings**: Cormorant Garamond
- **Body text**: Poppins
- Maintain hierarchy with font sizes

### Spacing
- Use Tailwind spacing scale (4, 8, 12, 16, 24, 32, 48, 64px)
- Maintain consistent padding/margins

### Animations
- Use Framer Motion for complex animations
- Keep animations subtle and purposeful
- Respect `prefers-reduced-motion`

## 🌍 Cultural Sensitivity

When working with cultural content:

- **Respect** - Treat all cultural knowledge with respect
- **Consent** - Ensure proper consent for shared knowledge
- **Accuracy** - Verify cultural information with community members
- **Representation** - Avoid stereotypes and generalizations
- **Attribution** - Credit knowledge sources appropriately

## 🚀 Commit Message Guidelines

Use conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Build process or tooling changes

### Examples
```
feat(submit): add voice recording feature

Implemented voice recording with real-time visualization
and playback controls.

Closes #123
```

```
fix(api): handle network timeout errors

Added retry logic and better error messages for network failures.
```

## 📚 Documentation

When adding features:

- Update README.md if needed
- Add JSDoc comments for public functions
- Create inline comments for complex logic
- Update API documentation if endpoints change

## 🔍 Code Review

PRs will be reviewed for:

- **Functionality** - Does it work as expected?
- **Code quality** - Is it readable and maintainable?
- **Performance** - Is it efficient?
- **Accessibility** - Is it accessible to all users?
- **Security** - Are there security concerns?
- **Documentation** - Is it well-documented?

## 🎯 Priority Areas

Current areas where contributions are especially welcome:

1. **Accessibility improvements** - WCAG compliance
2. **Performance optimization** - Load time, rendering
3. **Mobile responsiveness** - Touch interactions
4. **Internationalization** - More language support
5. **Testing** - Unit and integration tests
6. **Documentation** - Tutorials and guides

## 💬 Community

- **GitHub Discussions** - For questions and ideas
- **Issues** - For bugs and feature requests
- **Pull Requests** - For code contributions

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You

Every contribution, no matter how small, helps preserve cultural heritage for future generations. Thank you for being part of this mission!

---

**Questions?** Open an issue or reach out to eduedwyn5@gmail.com
