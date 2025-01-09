import { FC, FormEvent, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { doLogin, setModalType, updateModal } from "../redux/features/authSlice";
import { FaUnlock, FaUserPlus } from "react-icons/fa";
import { RiLockPasswordFill, RiUser3Fill } from "react-icons/ri";
import { GiArchiveRegister } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";

const LoginModal: FC = () => {
  const [clicked, setClicked] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); // Added for registration
  const [error, setError] = useState(""); // Added for error messages

  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.authReducer.modalOpen);
  const modalType = useAppSelector((state) => state.authReducer.modalType);

  const handleRegistration = () => {
    setEmail(""); // Clear email input
    setUsername(""); // Clear username input
    setPassword(""); // Clear password input
    setError(""); // Clear any previous error
    dispatch(setModalType("register")); // Update the modal type to registration
    dispatch(updateModal(true)); // Open the modal
  };

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (modalType === "register") {
      // Handle registration logic here
      // For now, let's just log the values
      console.log({ username, email, password });
    } else {
      dispatch(doLogin({ username, password }));
    }
  };

  if (open) {
    return (
      <div className="bg-[#0000007d] w-full min-h-screen fixed inset-0 z-30 flex items-center justify-center font-karla">
        <div
          className="relative border shadow rounded p-8 bg-white max-w-md w-full z-40 dark:bg-slate-800 dark:text-white"
          data-test={modalType === "register" ? "register-container" : "login-container"}
        >
          <RxCross1
            className="absolute cursor-pointer right-5 top-5 hover:opacity-85"
            onClick={() => dispatch(updateModal(false))}
          />
          {modalType === "register" ? (
            <>
              <div className="flex mb-2 space-x-2 justify-center items-center">
                <FaUserPlus />
                <h3 className="font-bold text-center text-2xl">Register</h3>
                <FaUserPlus />
              </div>
              {error && <p className="text-red-500 text-center">{error}</p>}
              <form onSubmit={submitForm} className="flex flex-col space-y-3">
                <div className="relative">
                  <input
                    data-test="input-username"
                    type="text"
                    placeholder="Your username here..."
                    className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <RiUser3Fill className="absolute top-3 left-2 text-lg" />
                </div>
                <div className="relative">
                  <input
                    data-test="input-email"
                    type="email"
                    placeholder="Your email here..."
                    className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <RiUser3Fill className="absolute top-3 left-2 text-lg" />
                </div>
                <div className="relative">
                  <input
                    data-test="input-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Your password here..."
                    className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                  />
                  <RiLockPasswordFill className="absolute top-3 left-2 text-lg" />
                </div>
                <input
                  data-test="input-submit"
                  type="submit"
                  value="Register"
                  className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700 cursor-pointer"
                />
              </form>
              <p className="text-center mt-1">
                Already have an account?{" "}
                <button
                  className="text-blue-500 cursor-pointer underline bg-transparent border-none"
                  onClick={() => dispatch(setModalType("login"))}
                >
                  Go to login
                </button>
              </p>
            </>
          ) : (
            <>
              <div className="flex mb-2 space-x-2 justify-center items-center">
                <FaUnlock />
                <h3 className="font-bold text-center text-2xl">Login</h3>
                <FaUnlock />
              </div>
              <form onSubmit={submitForm} className="flex flex-col space-y-3">
                <div className="relative">
                  <input
                    data-test="input-username"
                    type="text"
                    placeholder="Your username here..."
                    className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <RiUser3Fill className="absolute top-3 left-2 text-lg" />
                </div>
                <div className="relative">
                  <input
                    data-test="input-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Your password here..."
                    className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                  />
                  <RiLockPasswordFill className="absolute top-3 left-2 text-lg" />
                </div>
                <input
                  data-test="input-submit"
                  type="submit"
                  value="Login"
                  className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700 cursor-pointer"
                />
              </form>
              <p className="text-center mt-1">
                No Account?{" "}
                <button
                  className="text-blue-500 cursor-pointer underline bg-transparent border-none"
                  onClick={handleRegistration}
                >
                  Register
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default LoginModal;
