import axios from "axios";
import { endpoints } from "@/Routes/routes";

type loginPros = {
    username: String,
    password: String,
    email?: String,
}
export const fetchPost = async (data: loginPros, url: String) => {
    const dataThrugh = await axios.post(`${url}`, data)
    if (url === `${endpoints}/user/login`) {
        if (dataThrugh?.data?.text === "Login Successfull") {
            return true;
        }
        else {
            return false;
        }
    }
    else{
        return dataThrugh.data
    }
}