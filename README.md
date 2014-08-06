Usage:

```js
var connect = require('connect')
var http = require('http')
var app = connect()

app.use(require('express-reqres')({
  // here are all settings you used to add with app.set()
  'views': './views',
  'view engine': 'jade',
  'etag': 'weak',
  'trust proxy', false,
}))

app.use(function(req, res, next) {
  console.log(req.ip)
  res.render('test')
})

http.createServer(app).listen(3000)
```

