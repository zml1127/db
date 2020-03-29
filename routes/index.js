var express = require('express');
var router = express.Router();
var mongoose = require("../db/connect");
const jwt = require("jsonwebtoken");

//建立模型
var Goods = mongoose.model("ceshi",{name:String,age:Number},"ceshi");

//可以拦截所有的请求

router.use(function(req,res,next){
      if(req.url!=="/users/login" &&  req.url!=="/users/reg"){
      		//验证
      		
      		  jwt.verify(req.headers.token,"haha",(err,code)=>{
				console.log(err);	  
				if(!err){
      		  	  	  next();
      		  	  }
      		  	  else{
      		  	  	 res.json({
      		  	  	 	status:-1,
      		  	  	 	message:'error,valid fail'
      		  	  	 })
      		  	  }
      		  })
      }
      else{  //登录和注册可以正常访问接口
      	  next();
      }
})
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//url   get    //params  //返回值
router.get("/mylist",(req,res)=>{
	// res.setHeader("Access-Control-Allow-Origin","*");
	Goods.find({}).then((response)=>{
		res.json({
			status:0, //0 正常返回  -1 出错啦
			list:response,

		})
	})
})
router.post('/add',(req,res)=>{
	var {name,age} = req.body;
	new Goods({name,age}).save().then(()=>{
		// console.log("res",res)
		 res.json({
			 status:0
		 })
	})
})
/**
 * @api {post} /del Remove document
 * @apiName removedoc
 * @apiGroup Remove
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {Number} status 0 成功

 */
router.post("/del",(req,res)=>{
	 var id = req.body.id;
	 Goods.remove({_id:id}).then(()=>{
	 	res.json({
	 		status:0
	 	})
	 })

})

//根据页码进行分页
router.get("/pagelist",(req,res)=>{
	  var {page,pageSize} = req.query;
	  Goods.find().then((resAll)=>{ //拿到所有的文档
	  	//拿到当前的页面的文档
	  	Goods.find().limit(Number(pageSize)).skip((page-1)*pageSize).then((response)=>{
	  		  res.json({
	  		  	status:0,
	  		  	 pageCount:Math.ceil(resAll.length/pageSize),
	  		  	 list:response,
	  		  	 count:resAll.length
	  		  })
	  	})
	  })
})
//根据id 返回文档
router.get("/getDocById",(req,res)=>{
	  var id= req.query.id;
	  Goods.find({_id:id}).then((response)=>{
	  	res.json({
	  		status:0,
	  		doc:response[0]
	  	})
	  })
})
//确认修改
router.post("/modifyok",(req,res)=>{
	let {id,name,age}=req.body;
	Goods.update({_id:id},{$set:{name,age}}).then(()=>{
		res.json({
			status:0
		})
	})
})
module.exports = router;
