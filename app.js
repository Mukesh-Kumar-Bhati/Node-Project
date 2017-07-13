const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require("fs");
const multer  = require('multer');
const pg = require('pg');
const cors = require('cors')




// const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.set('port', (process.env.PORT || 8081));
app.use(express.static('public'));

// parse application/json 
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.get('/', function (req, res) {
   res.send('Hello World');
})



// This responds with "Hello World" on the homepage
app.get('/index.htm', (req, res) => {
   console.log("Got a GET request for the homepage");
    res.sendFile( __dirname + "/" + "index.htm" );
})

/////////////////////////////////////////////////////////////


app.get('/db',  (request, response) =>{

    const conString = process.env.DATABASE_URL;
    const client = new pg.Client(conString);
    client.connect();
    client.query(`SELECT * FROM records`).then((row) =>{
    console.log(row.rows);

    client.end();
  return res.send(JSON.stringify(row.rows));
   }).catch(error => {
  client.end();
  res.send(JSON.stringify(error));
  console.log(error);
 })

  // pg.connect(process.env.DATABASE_URL, (err, client, done) =>{
  //   client.query('SELECT * FROM records', (err, result) =>{
  //     done();
  //     if (err)
  //      { console.error(err); response.send("Error " + err); }
  //     else
  //      {   
  //      response.json(result.rows);
  //       }
  //   });
  // });
});

////////////////////////////////////////////////////////////

//Upload Data on server database

///!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post('/uploadData',(req, res) => {
    console.log('yaha to aa gya bhai....');
    const conString = process.env.DATABASE_URL;
    const client = new pg.Client(conString);
    client.connect();
    console.log("uploadData Box is here");
    console.log('Req execute');
    console.log(req);
    console.log('body of the req');
    client.query(`INSERT INTO public.records(name,mobilenumber,state,email,address,pin,"isChecked") VALUES ('${req.body.name}',${req.body.mobilenumber},'${req.body.state}','${req.body.email}','${req.body.address}',${req.body.pin},${req.body.isChecked})`)
        .then(() =>{
              const query1 = client.query('SELECT * FROM public.records')
             .then((row) =>{
                  console.log(row.rows);

                  client.end();
                  return res.send(JSON.stringify(row.rows));
              });
          }).catch(error => {
  client.end();
  res.send(JSON.stringify(error));
  console.log(error);
 })
    
})


///!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

 // Code for Local host 
/**

app.post('/uploadData',(req, res) => {
    const conString = "postgres://postgres:.@localhost:5432/postgres";
    const client = new pg.Client(conString);
    client.connect();
    console.log("uploadData Box is here");
    console.log(req.body);
    client.query(`INSERT INTO public.records(name,mobilenumber,state,email,address,pin,"isChecked") VALUES ('${req.body.name}',${req.body.mobilenumber},'${req.body.state}','${req.body.email}','${req.body.address}',${req.body.pin},${req.body.isChecked})`)
    .then(() =>{
    const query1 = client.query('SELECT * FROM public.records')
    .then((row) =>{
    console.log(row.rows);

    client.end();
  return res.send(JSON.stringify(row.rows));
});
 }).catch(error => {
  client.end();
  res.send(JSON.stringify(error));
  console.log(error);
 })
    
})   

 **/



// Accessing Data from Database

///!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get('/getData',(req, res) => {
    console.log('test');
    const conString = process.env.DATABASE_URL;
    const client = new pg.Client(conString);
    client.connect();
    console.log("Get DataBox is here : ");
    client.query('SELECT * FROM public.records').then((row) =>{
        console.log(row.rows);
        console.log('####################################################################');
        console.log(JSON.stringify(row.rows));
        client.end();
        res.json(row.rows);
    }).catch(error => {
            client.end();
            res.json(JSON.stringify(error));
            console.log(error);
 });

});

///!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// code for Local host 
/**
app.get('/getData',(req, res) => {
    console.log('test');
    const conString = "postgres://postgres:.@localhost:5432/postgres";
    const client = new pg.Client(conString);
    client.connect();
    console.log("Get DataBox is here : ");
    client.query('SELECT * FROM public.records').then((row) =>{
        console.log(row.rows);
        console.log('####################################################################');
        console.log(JSON.stringify(row.rows));
        client.end();
        res.json(row.rows);
    }).catch(error => {
            client.end();
            res.json(JSON.stringify(error));
            console.log(error);
 });

});

**/
//============


app.post('/process_post', function (req, res) {

     client.connect();
	   const results = [];
   // Prepare output in JSON format
     response = {
            first_name:req.body.first_name,
             last_name:req.body.monile_number
      };
      client.query(`INSERT INTO public.records(name,mobilenumber) VALUES ('${req.body.first_name}',${req.body.monile_number})`);
      const query1 = client.query('SELECT name, mobilenumber FROM records');

      query1.then((row) =>{
	          console.log(row.rows);
	          //res.send(JSON.stringify(row.rows));
       });

   		 query1.on('end', function() {
    		    client.end();
		  });

   // console.log(results);
   // res.end(JSON.stringify(response));
})



var server = app.listen(app.get('port'), () =>{

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})

