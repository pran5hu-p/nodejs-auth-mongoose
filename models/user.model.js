import { model, Schema } from "mongoose";

const userschema = new Schema(
    {
        name:{
            type: String,
            required: true,
        },
        email:{
            type:String,
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: true,
        },
        salt:{
            type: String,
            required: true,
        },
    },
    {timestamps: true}
);

export const User = model('user', userschema);
export default User;