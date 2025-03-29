import { categories } from '../src/config/categories.js';

export const typeCommunities = (promt) => {
  const categoriesList = categories.map(category => `${category.id}: ${category.name}`).join(", ");
  
  return `У нас есть категории: ${categoriesList}. А теперь прочитай описание: ${promt}. А теперь определи 1 категорию, к которой относится описание. Ответ должен быть в виде короткого ответа: 1 категория, ответ содержит 1 слово.`;
};
