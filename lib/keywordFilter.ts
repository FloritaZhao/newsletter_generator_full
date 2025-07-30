
export function passesKeywordFilter(
  article: { title: string; content: string },
  keywords: string
): boolean {
  if (!keywords) return true;
  const list = keywords
    .split(',')
    .map((kw) => kw.trim().toLowerCase())
    .filter(Boolean);
  const text = (article.title + ' ' + article.content).toLowerCase();
  return list.some((kw) => text.includes(kw));
}
