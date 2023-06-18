const http = require("http");
const fs = require("fs");
const requests = require("requests");
const homeFile = fs.readFileSync("home.html", "utf-8");
function FtoC(val){
    return Math.ceil(val-273);
}
replaceData= (tempVal,orgVal)=>{
    let newData=tempVal;
    newData=newData.replace("{%temp%}",FtoC(orgVal.main.temp)+ "°C");
    newData=newData.replace("{%tempmin%}",FtoC(orgVal.main.temp_min)+ "°C");
    newData=newData.replace("{%tempmax%}",FtoC(orgVal.main.temp_max)+ "°C");
    newData=newData.replace("{%location%}",orgVal.name);
    newData=newData.replace("{%country%}",orgVal.sys.country);
    newData=newData.replace("{%tempstatus%}",orgVal.weather[0].main);
    console.log(newData);
    return newData;
}
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests("https://api.openweathermap.org/data/2.5/weather?q=buxar&appid=50702dc6550115fbf8ad4ddbf1fd25cd")
      .on("data",  (chunk)=> {
        const objdata=JSON.parse(chunk);
        const arrData=[objdata];
        const realtimedata=arrData.map((val)=> replaceData(homeFile,val)).join(" ");

        res.write(realtimedata);
      })
      .on("end",  (err)=> {
        if (err) return console.log("connection closed due to errors", err);

        console.log("end");
      });
  }
});

server.listen(8000, "127.0.0.1",(err)=> {
    console.log("server is running on port 8000");}
    );
