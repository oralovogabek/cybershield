const Learning = {
  lessons: null,
  currentLang: 'en',

  async load() {
    if (this.lessons) return this.lessons;
    const res = await fetch('../data/lessons.json');
    this.lessons = await res.json();
    return this.lessons;
  },

  getAllLessons() {
    if (!this.lessons) return [];
    const all = [];
    this.lessons.levels.forEach(level => {
      level.lessons.forEach(l => {
        all.push({ ...l, levelId: level.id, levelTitle: level.title });
      });
    });
    return all.sort((a, b) => {
      const order = { beginner: 0, intermediate: 1, advanced: 2 };
      return (order[a.levelId] - order[b.levelId]) || (a.order - b.order);
    });
  },

  getLesson(id) {
    return this.getAllLessons().find(l => l.id === id);
  },

  getProgress(userId) {
    return Storage.get('cybershield_progress_' + userId, {
      completedLessons: [],
      completedMap: {},
      streak: 0,
      lastStudy: null,
      quizHistory: [],
      quizAvg: null
    });
  },

  saveProgress(userId, progress) {
    Storage.set('cybershield_progress_' + userId, progress);
  },

  markCompleted(userId, lessonId) {
    const p = this.getProgress(userId);
    if (!p.completedMap[lessonId]) {
      p.completedMap[lessonId] = new Date().toISOString();
      p.completedLessons = Object.keys(p.completedMap);
      // simple streak
      const today = new Date().toDateString();
      if (p.lastStudy !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        p.streak = p.lastStudy === yesterday ? (p.streak || 0) + 1 : 1;
        p.lastStudy = today;
      }
      this.saveProgress(userId, p);
      Achievements.check(userId);
    }
    return p;
  },

  isCompleted(userId, lessonId) {
    const p = this.getProgress(userId);
    return !!p.completedMap[lessonId];
  },

  getContent(lesson, lang) {
    if (lang === 'uz' && lesson.content_uz) return lesson.content_uz;
    if (lang === 'ru' && lesson.content_ru) return lesson.content_ru;
    return lesson.content_en || '';
  },

  getTitle(lesson, lang) {
    if (lang === 'uz' && lesson.title_uz) return lesson.title_uz;
    if (lang === 'ru' && lesson.title_ru) return lesson.title_ru;
    return lesson.title;
  }
};

// Simple achievements checker
const Achievements = {
  list: [
    { id: 'first_lesson', name: 'First Lesson', desc: 'Complete your first lesson', icon: '📖' },
    { id: 'first_quiz', name: 'First Quiz', desc: 'Complete your first quiz', icon: '📝' },
    { id: 'quiz_master', name: 'Quiz Master', desc: 'Score 100% on any quiz', icon: '🎯' },
    { id: 'seven_day', name: '7-Day Streak', desc: 'Study 7 days in a row', icon: '🔥' },
    { id: 'security_beginner', name: 'Security Beginner', desc: 'Complete 5 lessons', icon: '🛡️' },
    { id: 'security_explorer', name: 'Security Explorer', desc: 'Complete 15 lessons', icon: '🧭' },
    { id: 'cyber_expert', name: 'Cyber Expert', desc: 'Complete all beginner lessons', icon: '🏆' }
  ],

  getUnlocked(userId) {
    return Storage.get('cybershield_achievements_' + userId, []);
  },

  unlock(userId, id) {
    const unlocked = this.getUnlocked(userId);
    if (!unlocked.find(a => a.id === id)) {
      unlocked.push({ id, unlockedAt: new Date().toISOString() });
      Storage.set('cybershield_achievements_' + userId, unlocked);
      const a = this.list.find(x => x.id === id);
      if (a) Toast.success(`Achievement unlocked: ${a.name} ${a.icon}`);
    }
  },

  check(userId) {
    const p = Learning.getProgress(userId);
    const completed = p.completedLessons?.length || 0;
    if (completed >= 1) this.unlock(userId, 'first_lesson');
    if (completed >= 5) this.unlock(userId, 'security_beginner');
    if (completed >= 15) this.unlock(userId, 'security_explorer');
    if ((p.streak || 0) >= 7) this.unlock(userId, 'seven_day');
    if (p.quizHistory?.length >= 1) this.unlock(userId, 'first_quiz');
    if (p.quizHistory?.some(q => q.score === 100)) this.unlock(userId, 'quiz_master');
  }
};