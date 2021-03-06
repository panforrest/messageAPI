// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()

/*  This is a sample API route. */

const validResources = ["message"]

const PAGE_LENGTH = 10

router.post("/message", function(req, res){
  // console.log(req.body)
  const toUser = req.body.toUser.toLowerCase()
  let params = req.body
  // console.log(toUser)
  turbo
    .fetch("user", { username: toUser })
    .then(data => {
      console.log(data)
      console.log(data.length)
      console.log(data.length === 0)
      if (data.length === 0){
        throw new Error("User not found")
      }
      params.toUser = data[0].id
      console.log(params)
      return turbo.create("message", params)
    }) 
    .then(data => {
      res.json({
        confirmation: "success",
        data: data
      })
      return
    })
    .catch((err) => {
      console.log(err)
      res.json({
        confirmation: 'fail',
        message: err.message
      })
      return
    })  
})

router.get("/:resource", function(req, res){
	const { resource } = req.params
  let { query } = req
	// res.json({
	// 	confirmation: 'success',
	// 	resource: req.params.resource,
	// 	query: req.query // from the url query string
	// })
    if(validResources.indexOf(resource)<0){
      res.json({
        confirmation: 'fail',
        message: 'no such resource'
      })
      return
    }

    // const { page } = query
    const page = 5
    delete query.page

    turbo
    .fetch(resource, query)
    .then(data => {
      console.log(data.length)
      // console.log(PAGE_LENGTH)
      // console.log(page)
      console.log(PAGE_LENGTH * page)

      const pageResults = data.slice(
        PAGE_LENGTH * page - PAGE_LENGTH, 
        PAGE_LENGTH * page
      )
      console.log(pageResults.length)
      res.json({
        confirmation: "success",
        data: pageResults
      })
      return
    })
    .catch((err) => {
      console.log(err)
      res.json({
        confirmation: 'fail',
        message: err.message
      })
      return
    })
})

router.get('/message/me', function(req, res){
  // const { resource } = req.params
  const resource = 'message'
  const { query } = req
  // res.json({
  //  confirmation: 'success',
  //  resource: req.params.resource,
  //  query: req.query // from the url query string
  // })
    // if(validResources.indexOf(resource)<0){
    //   res.json({
    //     confirmation: 'fail',
    //     message: 'no such resource'
    //   })
    //   return
    // }
  const messages = []
  const first = {
      toUser: query.toUser,
      fromUser: query.fromUser
  }

  const second = {
      fromUser: query.toUser,
      toUser: query.fromUser
  }

  turbo
      .fetch(resource, first)
      .then((data) => {
        data.forEach((mes, i)=>{
          messages.push(mes)
        })
        return turbo.fetch(resource, second)
      })
      .then((data, i)=>{
        data.forEach((mes, i)=>{
          messages.push(mes)
        })
        res.json({
          confirmation: "success",
          data: messages
        })
      })
      .catch((err) => {
      console.log(err)
      res.json({
        confirmation: 'fail',
        message: err.message
      })
      return
    })    
})


// router.get('/:resource/:id', function(req, res){
// 	res.json({
// 		confirmation: 'success',
// 		resource: req.params.resource,
// 		id: req.params.id,
// 		query: req.query // from the url query string
// 	})
// })



module.exports = router
