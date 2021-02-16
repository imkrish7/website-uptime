const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const websiteSchema = new Schema({
	name: { type: String},
	url: { type: String},
	frequency: { type: Number, default: 30},
	lastUpdated: { type: Date , default: Date.now()},
	latestStatus: { type: String, enum: ['UP', 'DOWN']}
}, {timestamps: {createdAt: 'created_at'}})

const Website = mongoose.model('Website', websiteSchema);

module.exports = Website;