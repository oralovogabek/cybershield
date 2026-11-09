const QuizEngine = {
  data: null,
  current: null,
  answers: {},
  startTime: null,

  async load() {
    if (this.data) return this.data;
    const res = await fetch('../data/quizzes.json');
    this.data = await res.json();
    return this.data;
  },

  getQuiz(id) {
    return this.data?.quizzes?.find(q => q.id === id);
  },

  start(quizId) {
    const quiz = this.getQuiz(quizId);
    if (!quiz) return null;
    this.current = quiz;
    this.answers = {};
    this.startTime = Date.now();
    return quiz;
  },

  answer(questionId, optionIndex) {
    this.answers[questionId] = optionIndex;
  },

  calculate() {
    if (!this.current) return null;
    let correct = 0;
    const details = [];
    this.current.questions.forEach(q => {
      const userAns = this.answers[q.id];
      const isCorrect = userAns === q.correct;
      if (isCorrect) correct++;
      details.push({
        question: q.question,
        userAnswer: userAns,
        correctAnswer: q.correct,
        isCorrect,
        explanation: q.explanation,
        options: q.options
      });
    });
    const total = this.current.questions.length;
    const score = Math.round((correct / total) * 100);
    const timeSpent = Math.round((Date.now() - this.startTime) / 1000);
    return { correct, total, score, timeSpent, details, quizId: this.current.id, title: this.current.title };
  },

  saveResult(userId, result) {
    const p = Learning.getProgress(userId);
    p.quizHistory = p.quizHistory || [];
    p.quizHistory.unshift({
      quizId: result.quizId,
      title: result.title,
      score: result.score,
      correct: result.correct,
      total: result.total,
      date: new Date().toISOString()
    });
    // average
    const scores = p.quizHistory.map(h => h.score);
    p.quizAvg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    Learning.saveProgress(userId, p);
    Achievements.check(userId);
  }
};