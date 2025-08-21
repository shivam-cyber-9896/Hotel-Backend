

const express=require('express')
const router=express.Router()
const stnew=require('../controller/gett1')



router.get('/apstudent',stnew.getapstudent);

router.get('/', (req, res) => {
    res.send('Hello World!');
});
router.post ('/sty',stnew.poststy )

router.delete('/deletedata',stnew.deletedate)

router.put('/updatedata',stnew.updatedata)
module.exports=router