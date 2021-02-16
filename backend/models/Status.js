const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statusSchema = new Schema({
	status: { type: String, enum: ['UP', 'DOWN']},
	url_id: {type: String}
}, { timestamps: { createdAt: 'created_at'}}) 


const Status = mongoose.model('Status', statusSchema);

module.exports = Status;