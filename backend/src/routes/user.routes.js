import { Router } from "express";
import { voiceChat } from "../controllers/user.controller.js";



const router = Router();


// router.route("/").get((req,res)=>{
//     res.json({testing:"testing"});
// })


router.route("/voice-chat").post(voiceChat)



export default router;
