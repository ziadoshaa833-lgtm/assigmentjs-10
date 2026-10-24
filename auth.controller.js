import { Router } from "express"
import { generateaccesstoken, getalluser, getuser, login, signup, verfyAccount } from "./auth.service.js"
import { auth } from "../../common/middleware/index.js"
import z, { email } from "zod"
import { BadRequestEception } from "../../common/exciptions/error.exceptions.js"
import { validtion } from "../../common/services/validtion.service.js"
import { userloginschema } from "./auth.validtion.js"
import { cheakrole } from "../../common/middleware/cheak.role.js"
import { upload } from "../../common/middleware/multer.js"





const router = Router()
router.post("/signup",upload().single("image"), async (req, res) => {
    let data = await signup(req.body)
    //console.log(req.file);
    res.json(data)
})
router.post("/login", validtion(userloginschema), async (req, res) => {
    let data = await login(req.body)
    res.json(data)
})
router.get("/getuser", auth, async (req, res) => {
    console.log(req.user, "from controller");
    let data = await getalluser(req.user.id)
    res.json(data)

})
router.post("/generate_access_token", async (req, res) => {
    let accesstoken = await generateaccesstoken(req.body)
    res.json(accesstoken)

})
router.put("/verfiy_account", async (req, res) => {
    let data = await verfyAccount(req.body)
    res.json(data)

})
router.get("/get_all_user", auth, cheakrole(["1"]), async (req, res) => {
    let data = await getuser()
    res.json(data)
})







export default router