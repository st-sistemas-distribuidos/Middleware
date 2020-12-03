const express = require("express");
const readLastLines = require('read-last-lines');
const cors = require('cors')
const port = 3000;
const app = express();
var bodyParser = require('body-parser')

app.use(cors({origin:true, credentials:true}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: false}));
let serverAStatus = false;
let serverBStatus = false;
let time='';

setInterval(()=>{
	readLastLines.read('log.txt', 5).then((lines) => {
		let data = lines.split('\n');
		for (var i = 0; i < data.length; i++) {
			if(data[i] == 'ServerA'){
				if(data[i + 1] === '')
					serverAStatus = 'FAIL';
				else
					serverAStatus = 'OK';
				i++;
			}else if(data[i] == 'ServerB'){
				if(data[i + 1] === '')
					serverBStatus = 'FAIL';
				else
					serverBStatus = 'OK';
				i++;
			}else if (data[i].includes('TIME') ){
				time = data[i];
			}else{
				i++;
			}
		}
	});
},1000);

app.get("/", (req, res) => {
	res.send(
		[
			{
				hora: time,
				servidor : "Server A",
				estado: serverAStatus
			},
			{
				hora: time,
				servidor : "Server B",
				estado: serverBStatus
			},

		]
	)
});

app.listen(port, () => {
  console.log(`App is listening to port ${port}`);
});
