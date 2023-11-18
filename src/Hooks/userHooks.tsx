import { fetchPost } from "@/Helper/helper"
import { endpoints } from "@/Routes/routes"
type loginPros = {
    username: String,
    password: String
}
type Signup = {
    username : String,
    email : String,
    password : String,
}
export const fetchUser = async (data: loginPros) => {
    const response = await fetchPost(data , `${endpoints.loginRequest}`);
    return response;
}
export const SignUpUser = async (data :Signup )=>{
    const response = await fetchPost(data, `${endpoints.signUp}`);
    return response;
}