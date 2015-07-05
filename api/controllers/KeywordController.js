/**
 * KeywordController
 *
 * @description :: Server-side logic for managing keywords
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function (req, res) {
		Keyword.watch(req);

		Keyword.find().exec(function (err, keywords) {
			if (err) return res.negotiate(err);

			var prunedKeywords = [];

			_.each(keywords, function (keyword){
				if (req.isSocket){
					Keyword.subscribe(req, keyword.id);
				}

				prunedKeywords.push(keyword);
			});
			return res.json(prunedKeywords);
		});
	},

	topFive: function (req, res) {
		Keyword.watch(req);

		Keyword.find()
		.sort('times desc')
		.limit(5)
		.exec(function (err, keywords) {
			if (err) return res.negotiate(err);

			var prunedKeywords = [];

			_.each(keywords, function (keyword){
				if (req.isSocket){
					Keyword.subscribe(req, keyword.id);
				}
				prunedKeywords.push(keyword);
			});
			return res.json(prunedKeywords);
		});
	}
};
