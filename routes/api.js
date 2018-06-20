// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()

/*  This is a sample API route. */

router.get('/:resource', function(req, res){
	const { resource } = req.params
	// res.json({
	// 	confirmation: 'success',
	// 	resource: req.params.resource,
	// 	query: req.query // from the url query string
	// })
    const messages = [
        {
            toUser: '5b29acbc368b4a001414daa5',
            fromUser: "Dan",
            message: "Turbo is Awesome",
            dateTime: new Date()
        },
        {
            toUser: '5b29acbc368b4a001414daa5',
            fromUser: "Dan",
            message: "Don't you agree",
            dateTime: new Date()
        },
        {   
            toUser: "Ryan",
            fromUser: "Forrest",
            message: "Turbo is Awesome",
            dateTime: new Date()
        }

    ]
    messages.forEach((message, i)=>{
        turbo.create('message', message)

    })
    // res.json({
    // 	confirmation: "success",
    // 	data: message
    // })
})

router.get('/:resource/:id', function(req, res){
	res.json({
		confirmation: 'success',
		resource: req.params.resource,
		id: req.params.id,
		query: req.query // from the url query string
	})
})



module.exports = router
