const http = require ('http');
const fs = require('fs');


const server = http.createServer((req,res)=>{
  const method = req.method;
  const url = req.url;

  if( url === '/'){
      res.writeHeader(200 ,{'Content-Type':'text/html'});
      fs.createReadStream(__dirname + '/views/index.html','utf8').pipe(res);
  }
  if(url === '/user' && method === 'POST'){
    const chunks = [];
    req.on('data', chunk=>chunks.push(chunk));

    req.on('end', () =>{
      const data = Buffer.concat(chunks).toString();
       const firstname = data.split('&')[0];
       const fname = firstname.split('=')[1];

       const middlename = data.split('&')[1];
       const mname = middlename.split('=')[1];

       const surname = data.split('&')[2];
       const sname = surname.split('=')[1];

       const regst = data.split('&')[3];
       const regno = decodeURIComponent(regst.split('=')[1]);

       const cos = data.split('&')[4];
       const course = cos.split('=')[1];

       const student = {
         firstName:fname,
         MiddleName: mname,
         Surname: sname,
         Registration:regno,
         Course: course
        };
      fs.writeFileSync('student.json', JSON.stringify(student),{'flag':'a'});
    });
    res.statusCode = 302;
    res.setHeader('Location', '/dashboard');
    return res.end();
  }
  if(url === '/dashboard'){
    fs.readFile("student.json", function(err, data) {
      const printed = data.toString();
      res.writeHeader(200 ,{'Content-Type':'text/html'});
      res.write(`<!DOCTYPE html>
      <html lang="en" dir="ltr">
        <head>
          <meta charset="utf-8">
          <link
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
            rel="stylesheet"
          />
          <!-- Google Fonts -->
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            rel="stylesheet"
          />
          <!-- MDB -->
          <link
            href="https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/4.0.0/mdb.min.css"
            rel="stylesheet"
          />
          <title>NodeJS</title>
        </head>`);
        res.write(`<body><section class="vh-100" style="background-color: #eee;">
        <div class="container h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-lg-12 col-xl-11">
        <div class="card text-black" style="border-radius: 25px;">
        <div class="card-body p-md-5">
        <div class="row justify-content-center">
        <div class="col-md-12 col-lg-12 col-xl-12 order-2 order-lg-1">
        <a href="/">Add another</a>`);
        res.write('<p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Student entered</p>');
        res.write(`<p><strong>${printed}</strong></p>`);
        res.write(`</div></div></div></div></div></div></div></section>
<!-- MDB -->
<script
type="text/javascript"
src="https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/4.0.0/mdb.min.js"></script>
</body>
</html>
`);
    res.end();
    });
  }
});

server.listen(3000, ()=>{
  console.log("server is up and running!");
});
