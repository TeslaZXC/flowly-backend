import axios from "axios";
import { parserCommunities } from "./parserCommunities.js";  

// Функция для запуска парсинга
export const handleParser = async (req, res) => {
  try {

    const { name } = req.body;

    const communityData = await parserCommunities({ body: { name } }, res);

    if (!communityData || !communityData.categoryLink) {
      return res.status(404).json({ error: "Не удалось найти categoryLink." });
    }

    const categoryLink = communityData.categoryLink;
    console.log(`Получен categoryLink: ${categoryLink}`);

    const categoryData = await axios.get(categoryLink);
    console.log(`Данные успешно получены с categoryLink: ${categoryLink}`);

    const fullData = {
      ...communityData,
      categoryData: categoryData.data,
    };

    res.json(fullData);

  } catch (error) {
    console.error("Ошибка при парсинге данных:", error.message);
    res.status(500).json({ error: "Ошибка при обработке запроса." });
  }
};
