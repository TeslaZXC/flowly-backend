import axios from "axios";
import * as cheerio from "cheerio";
import iconv from "iconv-lite";
import { categories } from "../config/categories.js"; 

export const parserCommunities = async (req, res) => {
  try {
    const { name } = req.body; 
    const url = `https://vk.com/${name}`;

    const response = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      },
    });

    const decodedHtml = iconv.decode(response.data, "win1251");
    const $ = cheerio.load(decodedHtml);

    const nameCommunity = $("h1.page_name").text().trim();
    const subscribers = $("span.header_count.fl_l").text().replace(/\s+/g, "").trim();
    const avatar = $(".AvatarRich__img").attr("src");
    const description = $(".line_value").first().text().trim();

    console.log("Парсинг страницы сообщества...");
    console.log(`Название сообщества: ${nameCommunity}`);
    console.log(`Описание сообщества: ${description}`);

    // Первый запрос на локальный сервер для получения категории
    const serverResponse = await axios.post("http://localhost:3000/chat", {
      promt: description, 
    });

    const categoryFromServer = serverResponse.data.response; 
    console.log("Ответ от сервера для описания:", categoryFromServer);

    const categoryIdFromServer = Number(categoryFromServer);

    console.log("Превращаем ответ в число (если это id):", categoryIdFromServer);

    const category = categories.find((cat) => cat.id === categoryIdFromServer);

    if (!category) {
      console.log("Категория не найдена в массиве.");
      return res.status(404).json({ error: "Категория не найдена" });
    }

    console.log(`Найденная категория: ${category.name}, ID: ${category.id}`);

    // Отправляем собранную информацию
    res.json({
      name: nameCommunity,
      subscribers,
      avatar,
      description,
      category: category.name,
      categoryId: category.id,
      categoryLink: category.link,
    });
  } catch (error) {
    console.error("Ошибка при парсинге:", error.message);
    res.status(500).json({ error: "Ошибка при парсинге данных" });
  }
};
