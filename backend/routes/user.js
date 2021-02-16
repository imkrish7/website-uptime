const route = require('express').Router();
const Website = require('../models/website');
const Status = require('../models/Status');
const { update } = require ('../cron');


route.post('/add', async(req, res)=>{
	let { name, url, frequency } = req.body;

	try {
		let website = await Website.find({url: url});
		if(website.length == 1){
			return res.status(409).json({success: false, msg: "Url already exist"})
		}
	} catch (error) {
		return res.status(500).json({success: false, error: error, msg: error.msg})
	}

	if(url.length > 0 && name.length > 0){
	try {
		name = name.toLowerCase();
		const newWebsite = new Website({
			name: name,
			url: url,
			frequency: frequency || 30
		})
		await newWebsite.save();
		const currentWebsite = await Website.find({name: name});
		update(currentWebsite);
		return res.status(200).json({success: true, msg: "Website added"})
	} catch (error) {
		console.error("Error: ", error);
		return res.status(500).json({success: false, error: error, msg: "Internal server error"})
	}}else{
		return res.status(401).json({ success: false, msg: "Required fields are missing"})
	}

})

route.get('/all',async (req, res)=>{
	
	try{
		const websites = await Website.find({});

		return res.status(200).json({success: true, data: websites})
	}catch(error){
		console.error("Error: ", error);
		return res.status(400).json({ success: false, error: error, msg: error.msg})
	}

})


function prepareData(status, name, url, lastUpdated, latestStatus){

	let result = {
		name,
		url,
		lastUpdated,
		latestStatus,
		upDetail: {
			count: 0
		},
		downDetail: {
			count: 0
		}
	}

	for(let i = 0; i< status.length; i++){

		if(status[i].status == "UP"){
			result['upDetail'].count += 1 
		}else{
			result['downDetail'].count += 1 
		}
	}

	return result;
}


route.get('/detail', async (req, res)=> {
	const name = req.query.name || "";
	if(name.length > 0){
		try{
			let website = await Website.find({name: name});

			if(website.length>0){
				let currentId = website[0].id;
				let url = website[0].url;
				let lastUpdated = website[0].lastUpdated;
				let latestStatus = website[0].latestStatus || "";
				let status = await Status.find({ url_id:currentId });
				let data = prepareData(status, name, url, lastUpdated, latestStatus);

				return res.status(200).json({success: true, data, status});

			}
		}catch (error){
			console.error(error)

			return res.status(404).json({ success: false, msg: "Detail not found"})
		}
	}
})


module.exports = route;