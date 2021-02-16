const Website = require('./models/website');
const request = require('request');
const Status = require('./models/Status');
const cron = require('node-cron');

function prepareQueue (websites){
	let queue = [];
	let currentTime = new Date().getTime();
	for(let i = 0 ; i < websites.length; i++){
		let current = websites[i];
		let updateFrequency = parseInt(current.frequency) || 30;
		let lastUpdated = (new Date(current.lastUpdated.toString()).getTime());
		let diff = currentTime - lastUpdated;
		diff = parseInt(diff/60000);
		if(diff >= updateFrequency ){
			queue.push(websites[i]);
		}
	}
	return queue;
}

function update(queue){
	for(let i=0; i<queue.length; i++){
		let current = queue[i];
		let currenURl = current.url;
		
		let newStatus = new Status({
			url_id: current.id
		})
		request(currenURl, async function(error, response, body){
			let status = "";
			if(error){
				status = 'DOWN';
			}else{
				status = 'UP';
			}

			current['lastUpdated'] = new Date();
			newStatus['status'] = status;
			current['latestStatus'] = status;

			await current.save();
			await newStatus.save();

		})
	}
}




async function healthCheck(){

	try {
		const websites = await Website.find({});
		
		if(websites.length > 0){
			let queue = prepareQueue(websites);
			update(queue);
		}

	} catch (error) {
		console.error("Error: ", error);
	}
}

cron.schedule("* * * * * *", healthCheck);

module.exports = { healthCheck, update };