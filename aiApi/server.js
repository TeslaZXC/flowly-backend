import "dotenv/config";
import express from "express";
import axios from "axios";
import https from "https";
import { v4 as uuidv4 } from "uuid";
import { typeCommunities } from "./typeCommunities.js";

const app = express();
app.use(express.json());

const AUTH_URL = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth";
const API_URL = "https://gigachat.devices.sberbank.ru/api/v1/chat/completions";

let accessToken = null;

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

async function getAccessToken() {
  try {
    const formData = new URLSearchParams();
    formData.append("scope", process.env.GIGACHAT_SCOPE);

    console.log("Запрос на получение токена...");
    const response = await axiosInstance.post(AUTH_URL, formData.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        RqUID: uuidv4(),
        Authorization: `Basic ${process.env.GIGACHAT_AUTH_KEY}`,
      },
    });

    if (!response.data.access_token) throw new Error("❌ Token not received");

    console.log("Токен успешно получен");
    return response.data.access_token;
  } catch (error) {
    console.error("Ошибка получения токена:", error.response?.data || error.message);
    throw error;
  }
}

async function ensureAccessToken(req, res, next) {
  if (!accessToken) {
    try {
      accessToken = await getAccessToken();
    } catch (error) {
      return res.status(500).json({ error: "Ошибка получения токена" });
    }
  }
  next();
}

app.post("/chat", ensureAccessToken, async (req, res) => {
  const { promt } = req.body;

  if (!promt) return res.status(400).json({ error: "Отсутствует сообщение" });

  const message = typeCommunities(promt);

  try {
    const response = await axiosInstance.post(
      API_URL,
      {
        model: "GigaChat",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          RqUID: uuidv4(),
        },
      }
    );

    let fullText = response.data.choices[0].message.content.trim();

    res.json({ response: fullText }); // Возвращаем ответ сервера
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("Токен истек, обновляем...");
      accessToken = await getAccessToken();
      return app.post("/chat", req, res);
    }
    console.error(" Ошибка запроса:", error.response?.data || error.message);
    res.status(500).json({ error: "Ошибка запроса" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    accessToken = await getAccessToken();
    console.log(`Сервер запущен на порту ${PORT}`);
  } catch (error) {
    console.error("Ошибка инициализации сервера:", error.message);
  }
});
