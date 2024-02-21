import Link from "next/link";
import { fetchUser } from "@/Hooks/userHooks";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue } from "recoil";
import { userNameGlobal } from "@/Helper/recoilState";

export default function Home() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [savedState, setSavedState] = useRecoilState(userNameGlobal);
  const router = useRouter();

  const handleLogin = async (event: any) => {
    event.preventDefault();
    // const data = await fetchUser({ username: userName, password })
    toast.promise(
      fetchUser({ username: userName, password }).then((resp) => {
        if (resp.token) {
          //will not take null,undefined values
          console.log("User logged in", resp);
          setSavedState((prev) => ({
            ...prev,
            loggedInUser: resp._id,
            chats : resp.chat
          }));
          setTimeout(() => {
            router.push("/Dashboard");
          }, 1300);
        }
      }),
      {
        loading: "Logging you in...",
        success: <p>Logged in successfully!</p>,
        error: <p>Login failed!</p>,
      }
    );
  };
  return (
    <main>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company"/> */}
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign In
          </h2>
        </div>
        <Toaster />
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            onSubmit={(e) => handleLogin(e)}
            method="POST"
          >
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                User Name{" "}
              </label>
              <div className="mt-2">
                <input
                  id="userName"
                  name="userName"
                  placeholder="Enter username"
                  type="text"
                  value={userName}
                  onChange={(event) => setUserName(event.target.value)}
                  required
                  className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign In
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?
            <Link
              href="/signUp"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 ml-2"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
