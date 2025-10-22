# Contributing to AfriVerse

Thank you for your interest in contributing to AfriVerse! This document provides guidelines for contributing to the project.

---

## 🌍 Ways to Contribute

### 1. **Cultural Knowledge Submissions**
- Share indigenous knowledge from your community
- Validate entries for cultural accuracy
- Translate content to local languages

### 2. **Code Contributions**
- Bug fixes and improvements
- New features and enhancements
- Documentation updates
- Test coverage improvements

### 3. **Community Support**
- Help others in discussions
- Report bugs and issues
- Suggest features and improvements

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL
- Git

### Setup Development Environment

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/AfriVerse.git
cd AfriVerse

# 2. Install dependencies
npm install
cd services/backend && npm install
cd ../agentverse && pip install -r requirements.txt

# 3. Configure environment
cp services/backend/.env.example services/backend/.env
# Edit .env with your local settings

# 4. Run database migrations
cd services/backend
npx prisma migrate dev

# 5. Start development servers
npm run dev  # Backend
cd ../../frontend && npm run dev  # Frontend
```

---

## 📝 Code Guidelines

### JavaScript/TypeScript
- Use ES6+ features
- Follow Airbnb style guide
- Use meaningful variable names
- Add JSDoc comments for functions

### Python
- Follow PEP 8 style guide
- Use type hints
- Add docstrings to functions
- Use async/await for I/O operations

### Smart Contracts
- Follow Solidity best practices
- Add NatSpec comments
- Write comprehensive tests
- Optimize gas usage

---

## 🧪 Testing

### Run Tests
```bash
# Backend tests
cd services/backend
npm test

# Frontend tests
cd frontend
npm test

# Smart contract tests
cd smartcontracts
npx hardhat test
```

### Test Coverage
- Aim for 80%+ test coverage
- Write unit tests for new features
- Add integration tests for API endpoints

---

## 📋 Pull Request Process

### Before Submitting

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Add tests for new functionality
   - Update documentation

3. **Test your changes**
   ```bash
   npm test
   npm run lint
   ```

4. **Commit with clear messages**
   ```bash
   git commit -m "feat: add cultural knowledge export feature"
   ```

### Commit Message Format
```
type(scope): description

[optional body]
[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Build process or auxiliary tool changes

### Submit Pull Request

1. Push your branch
   ```bash
   git push origin feature/your-feature-name
   ```

2. Open a Pull Request on GitHub
3. Fill out the PR template
4. Wait for review

### Review Process
- At least one maintainer approval required
- All tests must pass
- Code coverage must not decrease
- Documentation must be updated

---

## 🐛 Bug Reports

### Before Reporting
1. Check existing issues
2. Verify bug is reproducible
3. Test on latest version

### Report Template
```markdown
**Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., Ubuntu 22.04]
- Node version: [e.g., 18.17.0]
- Browser: [e.g., Chrome 120]

**Screenshots**
If applicable

**Additional Context**
Any other relevant information
```

---

## 💡 Feature Requests

### Suggest a Feature
1. Check if feature already requested
2. Open a new issue with `enhancement` label
3. Describe the feature clearly
4. Explain why it's needed
5. Provide examples if possible

---

## 🌐 Cultural Sensitivity Guidelines

### When Contributing Cultural Content

1. **Respect Sacred Knowledge**
   - Don't share restricted or sacred information
   - Verify permissions from community elders
   - Use appropriate access controls

2. **Accurate Attribution**
   - Credit knowledge holders properly
   - Include community and region
   - Preserve original language

3. **Cultural Context**
   - Provide cultural background
   - Explain significance and use
   - Note any restrictions or protocols

4. **Consent**
   - Obtain explicit consent for sharing
   - Document consent process
   - Respect community decisions

---

## 📞 Community

### Get Help
- **GitHub Discussions:** Ask questions and share ideas
- **Discord:** Join our community (link in README)
- **Email:** eduedwyn5@gmail.com

### Code of Conduct
- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Respect cultural differences
- No harassment or discrimination

---

## 📄 License

By contributing to AfriVerse, you agree that your contributions will be licensed under the MIT License.

---

## 🙏 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Acknowledged in release notes
- Eligible for contributor NFTs (coming soon)

---

**Thank you for helping preserve indigenous knowledge with AfriVerse!** 🌍✨
