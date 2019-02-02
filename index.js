const express = require('express')
var exphbs  = require('express-handlebars')
const dotenv = require('dotenv').config()
const Shopify = require('shopify-api-node')

const app = express()

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


const shopify = new Shopify({
    shopName: process.env.SHOPIFY_PRIVATE_API_SHOP_name,
    apiKey: process.env.SHOPIFY_PRIVATE_API_KEY,
    password: process.env.SHOPIFY_PRIVATE_API_PASSWORD 
});

app.get('/',function(req, res){
    shopify.order.list()
    .then( (orders) => {
        
        res.render('index',{
            title: "order list",
            order: orders
        })
    })
    .catch(err => console.log(err));
});

app.get('/data/view/:proid/:id',function(req, res){
    var i; 
    let proid = req.params.proid;
   // console.log(proid)
  shopify.order.get(req.params.id)
  .then(function(order){
    
    for (i=0; i < order.line_items.length; i++)
    {
        if(order.line_items[i].id == proid)
        {
           // res.send(order.line_items[i])
            res.render('product',{
                title: "product details",
                product: order.line_items[i]
            })
        }
    }
    
  })
  .catch(err => console.log(err))
});

app.listen(3000, function(req, res){
    console.log("server is running")
});