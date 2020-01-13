import express, {Request, Response} from "express";
const router = express.Router();

/* GET home page. */
router.get('/', function(req:Request, res: Response, next:any) {
  res.render('index', { title: 'Express' });
  // res.status(200).send("Hello");
});

module.exports = router;
