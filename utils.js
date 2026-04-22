function countWords(content) {
  const words = content.trim().match(/\b[\w'-]+\b/g);
  return words ? words.length : 0;
}

function countSentences(content) {
  const sentences = content.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  return sentences.length || 1;
}

function countParagraphs(content) {
  return content
    .split(/\n\s*\n/)
    .filter(paragraph => paragraph.trim().length > 0).length || 1;
}

function countHeadings(content) {
  const headingMatches = content.match(/(^|\n)\s*(#|H1:|H2:|H3:)/gi);
  return headingMatches ? headingMatches.length : 0;
}

function keywordDensity(content, keyword) {
  if (!keyword || !keyword.trim()) return 0;

  const normalizedContent = content.toLowerCase();
  const normalizedKeyword = keyword.toLowerCase().trim();

  const words = countWords(content);
  if (words === 0) return 0;

  const regex = new RegExp(`\\b${normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g");
  const matches = normalizedContent.match(regex);
  const occurrences = matches ? matches.length : 0;

  return Number(((occurrences / words) * 100).toFixed(2));
}

function readabilityScore(content) {
  const words = countWords(content);
  const sentences = countSentences(content);

  if (words === 0) return 0;

  const averageWordsPerSentence = words / sentences;

  if (averageWordsPerSentence <= 14) return "Easy";
  if (averageWordsPerSentence <= 20) return "Moderate";
  return "Difficult";
}

function buildSuggestions({ wordCount, paragraphCount, headingCount, keywordDensityValue, readability }) {
  const suggestions = [];

  if (headingCount === 0) {
    suggestions.push("Add headings or section markers to improve structure and scannability.");
  }

  if (paragraphCount < 3) {
    suggestions.push("Break long blocks into more paragraphs for easier reading.");
  }

  if (wordCount < 150) {
    suggestions.push("Expand the content with more useful detail to improve topical depth.");
  }

  if (keywordDensityValue === 0) {
    suggestions.push("Include the focus keyword naturally in the content where relevant.");
  } else if (keywordDensityValue > 3) {
    suggestions.push("Reduce repetition of the focus keyword to avoid over-optimization.");
  }

  if (readability === "Difficult") {
    suggestions.push("Shorten sentences to improve readability and clarity.");
  }

  if (suggestions.length === 0) {
    suggestions.push("Content looks balanced. Consider adding internal links and stronger calls to action.");
  }

  return suggestions;
}

function analyzeContent(content, keyword) {
  const cleanedContent = content.trim();

  const wordCount = countWords(cleanedContent);
  const sentenceCount = countSentences(cleanedContent);
  const paragraphCount = countParagraphs(cleanedContent);
  const headingCount = countHeadings(cleanedContent);
  const keywordDensityValue = keywordDensity(cleanedContent, keyword);
  const readability = readabilityScore(cleanedContent);

  return {
    wordCount,
    sentenceCount,
    paragraphCount,
    headingCount,
    keywordDensity: keywordDensityValue,
    readability,
    suggestions: buildSuggestions({
      wordCount,
      paragraphCount,
      headingCount,
      keywordDensityValue,
      readability
    })
  };
}

module.exports = { analyzeContent };
