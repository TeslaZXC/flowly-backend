import axios from 'axios';
import * as cheerio from 'cheerio';
import iconv from 'iconv-lite';

export const parserRecommednation = async (req, res) => {
  try {
    const { URL } = req.body;
    console.log(`Получен запрос с URL: ${URL}`);

    const response = await axios.get(URL, {
      responseType: 'arraybuffer',
    });
    console.log(`Данные успешно получены с URL: ${URL}`);

    const decodedHtml = iconv.decode(response.data, 'win1251');
    const $ = cheerio.load(decodedHtml);

    const communities = [];
    console.log("Начинаем парсить сообщества...");

    $(".groups_row.search_row.clear_fix").each((i, elem) => {
      console.log(`Парсим сообщество #${i + 1}...`);

      const community = {};

      community.name = $(elem)
        .find(".labeled.title a")
        .first()
        .text()
        .trim();
      console.log(`Название сообщества: ${community.name}`);

      community.link =
        "https://vk.com" + $(elem).find(".labeled.title a").attr("href");
      console.log(`Ссылка на сообщество: ${community.link}`);

      community.avatar = $(elem).find(".AvatarRich__img").attr("src");
      console.log(`Аватарка сообщества: ${community.avatar}`);

      const subscribersRaw = $(elem)
        .find(".labeled_link")
        .first()
        .text()
        .replace(/\s+/g, "")
        .replace("подписчиков", "")
        .trim();
      community.subscribers = parseInt(subscribersRaw.replace(/\D/g, ""), 10);
      console.log(`Подписчиков: ${community.subscribers}`);

      communities.push(community);
    });

    console.log(`Парсинг завершен. Найдено ${communities.length} сообществ.`);

    res.json(communities);
  } catch (error) {
    console.error("Ошибка при парсинге:", error);
    res.status(500).send("Ошибка при обработке запроса.");
  }
};
