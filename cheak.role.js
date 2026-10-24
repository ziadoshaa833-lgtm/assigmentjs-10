import { userModel } from "../../database/model/user.model.js"
import { UnAuthorizedException } from "../exciptions/error.exceptions.js"
import { includes } from "zod"






export const cheakrole = (roles) => {
    return async (req, res, next) => {
        let userdata = await userModel.findById(req.user.id)
        if (!userdata.role.includes(roles)) {
            throw UnAuthorizedException({ message: "you are notauthorized access" })
        }
        next()

    }

}