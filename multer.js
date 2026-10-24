import multer from "multer";


export const upload=()=>{
    const storage=multer.diskStorage({
        destination:"./uploads",
        filename:(req,file,cb)=>{
           cb(null, `${Date.now()}-${file.originalname}`);
        }
    })
    const fileFilter=(req,res,cb)=>{
        const allowType=['image/png','image/jpeg']
        if(allowType.includes(file.mimetype)){
            console.log("true");
            cb(new Error("invalid format"))
            return
        }else{
            console.log("false");
            cb(null,true)
        }
    }

    return multer({storage,fileFilter})
}
