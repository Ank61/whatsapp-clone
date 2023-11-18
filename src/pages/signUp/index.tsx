import { useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from "next/link";
import { SignUpUser } from "@/Hooks/userHooks";
import toast, { Toaster } from 'react-hot-toast';

export default function SignUp() {
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cPassword, setcPassword] = useState("");

    const handleSignUp = async (event: any) => {
        event.preventDefault();
        console.log("#Data", event, username, email, password, cPassword);
        toast.promise(
            SignUpUser({ username, email, password }),
             {
               loading: 'Creating...',
               success: <p>User created!</p>,
               error: <p>Could not create user.</p>,
             }
           );
    }
    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-16 lg:px-8">
            <div className="flex flex-row sm:mx-auto sm:w-full sm:max-w-sm">
                <div>
                    <Link href="/"><ArrowBackIcon className="my-3"/></Link>
                </div>
                <Toaster/>
                <h2 className="ml-24 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"> Sign Up</h2>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={(e) => handleSignUp(e)} method="POST">
                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900">User Name </label>
                        <div className="mt-1">
                            <input  id="userName" name="userName" placeholder="Enter username" type="text" value={username} onChange={(event) => setUserName(event.target.value)} required className="pl-3 block w-full rounded-md border-0 py-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900">Email </label>
                        <div className="mt-1">
                            <input id="email" name="email" placeholder="Enter email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="pl-3 block w-full rounded-md border-0 py-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium leading-6 text-gray-900" >Password</label>
                        </div>
                        <div className="mt-1">
                            <input id="password" name="password" type="password" placeholder='   Enter password' value={password} onChange={(event) => setPassword(event.target.value)} required className="pl-3 block w-full rounded-md border-0 py-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium leading-6 text-gray-900" >Confirm Password</label>
                        </div>
                        <div className="mt-1">
                            <input id="cpassword" name="password" type="password" placeholder='   Confirm password' value={cPassword} onChange={(event) => setcPassword(event.target.value)} required className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>

                    </div>

                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    )
}