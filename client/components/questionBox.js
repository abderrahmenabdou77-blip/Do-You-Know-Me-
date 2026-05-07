// Question box component
function renderQuestionBox(question, index, total) {
  return `
    <div class="question-card">
      <div class="question-number">Question ${index + 1} of ${total}</div>
      <div class="question-text-en">${question.en}</div>
      <div class="question-text-ar">${question.ar}</div>
    </div>
  `;
}
