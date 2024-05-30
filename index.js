require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); 
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
let num = 0;
let domains = [];

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  const pattern = /^https?:\/\/.*/
  if(! pattern.test(url)){
    res.json({error: 'invalid url'});
  }else if (domains.some(i => i.url === url )) {
    const obj = domains.find(i => i.url === url);
    res.json({original_url: obj.url, short_url: obj.id})
  }
  else{
    num++;
    domains.push({id: num, url: url});
    res.json({original_url: url, short_url: num})
  }

})

app.get('/api/shorturl/:url?', (req, res) => {
  if(isNaN(parseInt(req.params.url))) {
    res.json({error: 'wrong format'})
  } 
  else {
    const obj = domains.find(i => i.id == req.params.url)
    console.log(obj)
    if ( obj == undefined) {
      res.json({error: 'invalid url'})
    } else res.redirect(obj.url);
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
