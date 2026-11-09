# CyberShield — Cybersecurity Education Platform

**Learn Cybersecurity. Protect Your Digital World.**

Professional multilingual cybersecurity learning platform (frontend demo + architecture for Django backend).

## Features included

- Landing page with dark/light theme
- Login / Register (LocalStorage demo auth)
- User Dashboard with progress stats
- Learning Center — Beginner / Intermediate / Advanced lessons
- Multilingual lesson content (EN primary + UZ + RU)
- Mark lessons complete, streak tracking
- Cyber Threats encyclopedia
- Security Tools: Password strength checker, generator, URL analyzer, checklist
- Quiz engine with scoring, explanations, history
- AI Mentor chat (educational KB + safety filters)
- Dictionary (40+ terms, EN/UZ/RU, searchable)
- Progress and Achievements system
- Settings (theme, language, clear data)
- Admin panel shell (role-based)
- 3 languages: Uzbek (default), English, Russian

## How to run

```powershell
cd CyberShield
python -m http.server 8000
```

Open: http://localhost:8000

## Test accounts

- Username: ali / Password: 123456
- Username: admin / Password: 123456 (admin role)

## Structure

```
CyberShield/
├── index.html, login.html, register.html
├── pages/   (dashboard, learning, lesson, threats, tools, quiz, ai-mentor, dictionary, progress, achievements, settings)
├── admin/
├── css/, js/, locales/, data/
└── backend/  (reserved for Django)
```

© 2026 CyberShield
