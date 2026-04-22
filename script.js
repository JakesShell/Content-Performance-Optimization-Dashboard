const analyzeBtn = document.getElementById("analyzeBtn");
const contentInput = document.getElementById("content");
const keywordInput = document.getElementById("keyword");
const resultsDiv = document.getElementById("results");

function renderResults(data) {
  const suggestionItems = data.suggestions
    .map(item => `<li>${item}</li>`)
    .join("");

  resultsDiv.innerHTML = `
    <h2>Analysis Results</h2>

    <div class="score-grid">
      <div class="metric-card">
        <h3>Word Count</h3>
        <p>${data.wordCount}</p>
      </div>
      <div class="metric-card">
        <h3>Sentences</h3>
        <p>${data.sentenceCount}</p>
      </div>
      <div class="metric-card">
        <h3>Paragraphs</h3>
        <p>${data.paragraphCount}</p>
      </div>
      <div class="metric-card">
        <h3>Headings</h3>
        <p>${data.headingCount}</p>
      </div>
      <div class="metric-card">
        <h3>Keyword Density</h3>
        <p>${data.keywordDensity}%</p>
      </div>
      <div class="metric-card">
        <h3>Readability</h3>
        <p>${data.readability}</p>
      </div>
    </div>

    <div class="recommendations">
      <h3>Optimization Suggestions</h3>
      <ul>${suggestionItems}</ul>
    </div>
  `;
}

analyzeBtn.addEventListener("click", async () => {
  const content = contentInput.value.trim();
  const keyword = keywordInput.value.trim();

  if (!content) {
    resultsDiv.innerHTML = `<p class="error-message">Please paste content before running the analysis.</p>`;
    return;
  }

  resultsDiv.innerHTML = `<p class="loading-message">Analyzing content...</p>`;

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ content, keyword })
    });

    const data = await response.json();

    if (!response.ok) {
      resultsDiv.innerHTML = `<p class="error-message">Error: ${data.error}</p>`;
      return;
    }

    renderResults(data);
  } catch (error) {
    resultsDiv.innerHTML = `<p class="error-message">Error: Unable to connect to the analysis service.</p>`;
  }
});
