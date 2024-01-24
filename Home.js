import React, { useState, useEffect } from 'react';
import './Home.css';
function App() {
  const [data, setData] = useState([]);


  useEffect(() => {
    // Fetch data from your backend API
    fetch('http://localhost:8080/get-data')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setData(data.slice(0, 10))) // Display only the first 10 items
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>Top 10 Tickers</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Last</th>
            <th>Buy</th>
            <th>Sell</th>
            <th>Volume</th>
            <th>Base Unit</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.last}</td>
              <td>{item.buy}</td>
              <td>{item.sell}</td>
              <td>{item.volume}</td>
              <td>{item.base_unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
