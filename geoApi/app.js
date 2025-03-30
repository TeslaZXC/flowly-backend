import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import fs from 'fs';
import csv from 'csv-parser';

const app = express();
const PORT = 3000;

app.use(bodyParser.json()); 

async function geocode(address, format, addressdetails, limit) {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: format || 'json',
        addressdetails: addressdetails || 1,
        limit: limit || 1,
      },
      headers: {
        'User-Agent': 'GeoApp',
      },
    });
    if (response.data.length > 0) {
      const { lat, lon } = response.data[0]; 
      const coordinates = { lat, lon }; 
      return coordinates;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

async function reverseGeocode(lat, lon, format, addressdetails) {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat: lat,
        lon: lon,
        format: format || 'json',
        addressdetails: addressdetails || 1,
      },
      headers: {
        'User-Agent': 'GeoApp',
      },
    });
    return response.data.address || 'Адрес не найден';
  } catch (error) {
    return 'Ошибка запроса: ' + error.message;
  }
}

app.post('/geo', async (req, res) => {
  const { lat, lon, address, format, addressdetails, limit } = req.body;

  const results = {};  

  if (address) {
    const coordinates = await geocode(address, format, addressdetails, limit);
    if (coordinates) {
      results.coordinates = coordinates;
    } else {
      results.coordinates = 'Координаты не найдены';
    }
  }

  if (lat && lon) {
    const addressResult = await reverseGeocode(lat, lon, format, addressdetails);
    results.address = addressResult;
  }

  if (!results.coordinates && !results.address) {
    return res.status(400).json({ error: 'Не указаны координаты или адрес' });
  }

  return res.json(results);
});

app.get('/convert-csv-to-json', (req, res) => {
    const inputCsvFile = 'data.csv';  // Укажите путь к вашему CSV файлу
    const outputJsonFile = 'output_file.json';  // Путь для сохранения JSON файла
    let results = [];

    fs.createReadStream(inputCsvFile)
        .pipe(csv())  // Преобразование CSV в данные
        .on('data', (data) => results.push(data))
        .on('end', () => {
            // Записываем результаты в JSON файл
            fs.writeFileSync(outputJsonFile, JSON.stringify(results, null, 4), 'utf-8');
            res.json({ message: 'CSV файл успешно преобразован в JSON', data: results });
        })
        .on('error', (err) => {
            res.status(500).json({ message: 'Ошибка при чтении CSV файла', error: err.message });
        });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
