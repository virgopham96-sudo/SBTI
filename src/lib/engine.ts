export interface QuestionOption {
  text: string;
  tag: string;
}

export interface Question {
  id: number;
  model: string;
  question: string;
  options: QuestionOption[];
}

export class SBTIEngine {
  pool: Question[];
  selectedQuestions: Question[];
  userAnswers: Record<number, string>;

  constructor(questionPool: Question[]) {
    this.pool = questionPool;
    this.selectedQuestions = [];
    this.userAnswers = {};
  }

  /**
   * 1. Tạo bộ đề 30 câu ngẫu nhiên
   * Đảm bảo lấy đều từ các 'model' (SE, SA, CC, LV) để tránh lệch dữ liệu.
   */
  generateTest(count = 30): Question[] {
    // Phân loại câu hỏi theo model
    const models = ['SE', 'SA', 'CC', 'LV'];
    const questionsPerModel = Math.floor(count / models.length);
    let finalSelection: Question[] = [];

    models.forEach(model => {
      const filtered = this.pool.filter(q => q.model === model);
      const shuffled = filtered.sort(() => 0.5 - Math.random());
      finalSelection = [...finalSelection, ...shuffled.slice(0, questionsPerModel)];
    });

    // Nếu vẫn thiếu câu (do chia lẻ), lấy thêm từ pool chính
    if (finalSelection.length < count) {
      const remaining = this.pool.filter(q => !finalSelection.includes(q));
      finalSelection = [...finalSelection, ...remaining.sort(() => 0.5 - Math.random()).slice(0, count - finalSelection.length)];
    }

    // Trộn lại lần cuối để các model đan xen nhau
    this.selectedQuestions = finalSelection.sort(() => 0.5 - Math.random());
    return this.selectedQuestions;
  }

  /**
   * 2. Lưu câu trả lời của người dùng
   * @param questionId 
   * @param selectedTag 
   */
  recordAnswer(questionId: number, selectedTag: string) {
    this.userAnswers[questionId] = selectedTag;
  }

  /**
   * 3. Tính toán kết quả cuối cùng (Vibe Check)
   */
  calculateResult() {
    const answersArray = Object.values(this.userAnswers);
    if (answersArray.length === 0) return { mainVibe: "Chưa có dữ liệu", breakdown: {}, summary: "" };

    const scores: Record<string, number> = {};
    
    // Đếm tần suất xuất hiện của các Tag
    answersArray.forEach(tag => {
      scores[tag] = (scores[tag] || 0) + 1;
    });

    // Sắp xếp để lấy Tag có điểm cao nhất
    const sortedTags = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topTag = sortedTags[0][0];

    // Trả về kết quả kèm theo bảng phân tích tỉ lệ
    return {
      mainVibe: topTag,
      breakdown: scores,
      summary: `Bạn chính là một ${topTag} chính hiệu!`
    };
  }
}
