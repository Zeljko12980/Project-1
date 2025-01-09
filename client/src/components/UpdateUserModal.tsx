import { FC, FormEvent, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { updateUserData, setModalType, updateModal } from "../redux/features/authSlice"; // Import `updateUserData`
import { FaUserEdit } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";

const UpdateUserModal: FC = () => {
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<string | "">("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [state, setState] = useState("");
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.authReducer.modalOpen);
  const modalType = useAppSelector((state) => state.authReducer.modalType);

  const handleUpdate = () => {
    setError("");
    dispatch(setModalType("update"));
    dispatch(updateModal(true));
  };

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userName || !email) {
      setError("Please fill all required fields.");
      return;
    }

    dispatch(updateUserData({
      userName,
      email,
      firstName,
      lastName,
      phoneNumber,
      address,
      city,
      postalCode,
      state,
    }));
    dispatch(updateModal(false)); // Close modal immediately after submitting
    setError("");  // Reset error if form submission is successful
  };

  if (open && modalType === "update") {
    return (
      <div className="bg-[#0000007d] w-full min-h-screen fixed inset-0 z-30 flex items-center justify-center font-karla">
        <div className="relative border shadow rounded p-8 bg-white max-w-md w-full z-40 dark:bg-slate-800 dark:text-white">
          <RxCross1
            className="absolute cursor-pointer right-5 top-5 hover:opacity-85"
            onClick={() => dispatch(updateModal(false))}
          />
          <div className="flex mb-2 space-x-2 justify-center items-center">
            <FaUserEdit />
            <h3 className="font-bold text-center text-2xl">Update User Info</h3>
            <FaUserEdit />
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={submitForm} className="flex flex-col space-y-3">
            <input
              type="text"
              placeholder="First name"
              className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last name"
              className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <input
              type="text"
              placeholder="Address"
              className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              type="text"
              placeholder="City"
              className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              type="text"
              placeholder="Postal code"
              className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
            <input
              type="text"
              placeholder="State"
              className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <input
              type="submit"
              value="Update"
              className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700 cursor-pointer"
            />
          </form>
        </div>
      </div>
    );
  }

  return null;
};

export default UpdateUserModal;
