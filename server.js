
// Add a new route to handle the HTML page


import express from 'express';
import fetch from 'node-fetch';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
const PORT = 8080;

// Replace 'your_mongodb_connection_string' with your MongoDB Atlas connection string
const uri = 'mongodb+srv://kulkarniajinkya729:Ajinkya1234@cluster0.mujzcv2.mongodb.net/my_database?retryWrites=true&w=majority';
const client = new MongoClient(uri);

app.use(express.json());
app.use(cors());

app.get('/fetch-and-store', async (req, res) => {
  console.log('Route accessed');
  try {
    await client.connect();

    const response = await fetch('https://api.wazirx.com/api/v2/tickers');
    const data = await response.json();

    console.log('API Response:', data);

    // Check if the response is an object
    if (typeof data !== 'object' || data === null) {
      console.error('API response is not an object:', data);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Extract relevant information from the object
    const extractedData = Object.keys(data).map(symbol => ({
      symbol: symbol,
      base_unit: data[symbol].base_unit,
      quote_unit: data[symbol].quote_unit,
      low: data[symbol].low,
      high: data[symbol].high,
      last: data[symbol].last,
      type: data[symbol].type,
      open: data[symbol].open,
      volume: data[symbol].volume,
      sell: data[symbol].sell,
      buy: data[symbol].buy,
      at: data[symbol].at,
      name: data[symbol].name,
    }));

    console.log('Extracted Data:', extractedData);

    // Now you can store the extracted data in the database
    const database = client.db('my_database');
    const collection = database.collection('your_collection');

    // Clear existing data in the collection
    await collection.deleteMany({});

    // Insert the extracted data into the collection
    const insertResult = await collection.insertMany(extractedData);

    console.log('Insert Result:', insertResult);

    res.json({ success: true, data: extractedData });
  } catch (error) {
    console.error('Error fetching and storing data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});







app.get('/get-data', async (req, res) => {
  try {
    await client.connect();

    const database = client.db('my_database'); // Replace 'your_database_name' with your database name
    const collection = database.collection('your_collection');

    const storedData = await collection.find({}).toArray();
    res.json(storedData);
  } catch (error) {
    console.error('Error fetching data from the database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
