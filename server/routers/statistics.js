const express = require('express');

const router = express.Router();

const Statistics = require('./../models/statistics').Statistics;

const templatePage = (messages, parrots) => {
  const template = `<!DOCTYPE html>
<html lang="ru-RU">
<head>
  <meta charset="utf-8">
  <meta name="renderer" content="webkit">
  <title>Fridaybot</title>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <meta name="description" content="Slack bot">
  <link rel="stylesheet" href="/stylesheets/style.css">
  <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
  <link rel="icon" href="/favicon.ico" type="image/x-icon">
  <script async="" src="https://www.google-analytics.com/analytics.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.6.0/Chart.min.js"></script>
</head>

<body>
  <div class="wrapper">
    <div class="bg"></div>
      <canvas id="myChart" ></canvas>
      <script>
      var ctx = document.getElementById("myChart").getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ["0", "1","2", "3","4", "5","6", "7","8", "9","10", "11","12", "13","14", "15","16", "17","18", "19","20", "21","22", "23"],
          datasets: [{
            label: 'сообщений',
            data: [${messages}] ,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1
          },
          {
            label: 'пэрротов',
            data:  [${parrots}],
            backgroundColor: 'rgba(25, 99, 132, 0.2)',
            borderColor: 'rgba(25,99,132,1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
      </script>
    </div>
  </div>
</body>
</html>`;
  return template;
};


router.get('/', (req, res) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startTimestamp = (startOfDay / 1000) - 10800;
  const endTimestamp = startTimestamp + 86400;
  const messages = [];
  const parrots = [];
  Statistics.find({ 'timestamp': { '$gte': startTimestamp, '$lt': endTimestamp }, event_type: 'user_message' })
  .then((response) => {
    for (let i = 0; i < 24; i++) {
      const prevTimestamp = startTimestamp + (3600 * i);
      const nextTimestamp = startTimestamp + (3600 * (i + 1));
      const timeInterval = response.filter(item => {
        return item.timestamp >= prevTimestamp && item.timestamp <= nextTimestamp;
      });
      messages.push(timeInterval.length);
      let parrotCounts = 0;
      timeInterval.forEach(item => parrotCounts += item.parrot_count);
      parrots.push(parrotCounts);
    }
    const html = templatePage(messages, parrots);
    res.send(html);
  });
});


module.exports = router;
