
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ArticleSchema = Schema({
		headline: {type: String, required: true},
		summary: {type: String, required: true},
		link: {type: String, required: true},
		img: String,
		saved: {type: Boolean, default: false},
		comments: [{
			type: Schema.Types.ObjectId,
			ref: "Comment"
		}]
});

const Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;




