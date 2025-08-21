import { useState, useEffect } from "react";
import Layout from "../../Layout";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HousePlus, PencilLine, Info } from "lucide-react";
import { logout } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import { motion } from "framer-motion";
import Badge from "../../components/Badge";
import {
  useUpdateUserMutation,
  useUpdateAddressMutation,
  useLogoutMutation,
  useGetAddressQuery,
  useGetUserDetailsQuery,
} from "../../redux/queries/userApi";
import { setUserInfo } from "../../redux/slices/authSlice";
import { provinces } from "../../assets/data/addresses.js";
import { useGetMyOrdersQuery } from "../../redux/queries/orderApi.js";
import Message from "../../components/Message.jsx";
import clsx from "clsx";
import { Button, Prompt } from "@medusajs/ui";
import { Tooltip } from "@medusajs/ui";
import AddressModal from "../address/AddressModal.jsx";

function Profile() {
  const [clickEditPersonal, setClickEditPersonal] = useState(false);
  const [clickEditAddress, setClickEditAddress] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newBlock, setNewBlock] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newHouse, setNewHouse] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");

  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //API update user
  const [updateUser] = useUpdateUserMutation();

  //API get user details
  /*   const { data: userInfo } = useGetUserDetailsQuery(id);
  console.log(userInfo); */

  //Get user state
  const userInfo = useSelector((state) => state.auth.userInfo);

  //API get address
  const { data: userAddress, refetch } = useGetAddressQuery(userInfo?._id);

  // console.log(userAddress);
  //API get my orders
  const { data: myorders } = useGetMyOrdersQuery();
  //6899b5fdeba95344aa21bced
  const [isModalOpen, setIsModalOpen] = useState(false);

  //API update address
  const [updateAddress, { isLoading: loadingAddress }] = useUpdateAddressMutation();

  //API logout
  const [logoutApiCall, { isLoading, error }] = useLogoutMutation();

  const handleLogout = async () => {
    await logoutApiCall().unwrap();
    dispatch(logout());
    navigate("/");
  };

  const handleUpdatePersonal = async () => {
    try {
      if (newPhone && newPhone.length !== 8) {
        toast.error("Please enter a valid phone number");
        return;
      }

      /* EMAIL VALIDATION */

      const res = await updateUser({ name: newName, email: newEmail, phone: newPhone }).unwrap();

      dispatch(setUserInfo(res));
      toast.success("Updated user name", { position: "top-center" });
      setClickEditPersonal(!clickEditPersonal);
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };
  const handleUpdateAddress = async () => {
    const res = await updateAddress({
      governorate: selectedProvince,
      city: city,
      block: newBlock,
      street: newStreet,
      house: newHouse,
    });

    refetch();

    setClickEditAddress(!clickEditAddress);
    /* dispatch(setUserInfo({ ...userInfo, address: res })); */
    toast.success("Updated user name", { position: "top-center" });
  };

  // Update cities based on selected province
  const handleProvinceChange = (event) => {
    const provinceName = event.target.value;
    setSelectedProvince(provinceName);
    const province = provinces.find((p) => p.name === provinceName);

    if (province) {
      setCities(province.cities);
    } else {
      setCities([]);
    }
  };
  const handleCityChange = (e) => {
    setCity(e.target.value);
  };
  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1, // Change the stagger delay as needed
        delayChildren: 0.1, // Add delay before the first child starts animating
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1 },
  };
  return (
    <Layout>
      <motion.div className="flex gap-10 flex-col lg:flex-row  justify-center min-h-screen px-2 py-5">
        <div className="lg:w-[50%]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col gap-5  ">
            <h1 className="text-3xl font-bold ">My profile</h1>
            <motion.div
              variants={childVariants}
              className="flex items-center justify-between border bg-zinc-200/10 p-5 lg:p-7 drop-shadow-lg shadow rounded-lg">
              <div className="flex items-center gap-2 lg:gap-5">
                <div className=" rounded-[50%] hover:from-rose-500/80 hover:to-rose-600 bg-gradient-to-r shadow-lg drop-shadow-lg font-bold text-md lg:text-3xl from-gray-500 to-gray-700 text-white size-[40px] lg:size-[100px] flex justify-center items-center">
                  {userInfo?.name?.charAt(0).toUpperCase()}
                  {userInfo?.name?.charAt(userInfo?.name?.length - 1).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-extrabold text-2xl lg:text-3xl ">{userInfo?.name}</h1>
                    {/*  {userInfo?.isAdmin && <Badge variant="admin">admin user</Badge>} */}
                  </div>
                </div>
              </div>
              <div className="flex flex-row-reverse items-center gap-2 lg:gap-5">
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className={clsx(
                    "bg-gradient-to-t text-xs  lg:text-base items-center flex justify-center hover:bg-gradient-to-b transition-all duration-300  p-3 rounded-lg text-white font-bold drop-shadow-md ",
                    isLoading ? "from-gray-500 to-gray-400" : "from-rose-500 to-rose-400"
                  )}>
                  {isLoading ? <Spinner className="border-t-rose-500" /> : "Log out"}
                </button>
              </div>
            </motion.div>
            <motion.div
              variants={childVariants}
              className="flex flex-col gap-5 border bg-zinc-200/10 p-5 lg:p-7 drop-shadow-lg shadow rounded-lg">
              <h1 className="font-extrabold text-xl mb-3">Personal Information</h1>
              <div className="flex  justify-between">
                <div className="">
                  <div className="flex gap-5 lg:gap-20">
                    <div className="flex  flex-col gap-2 ">
                      <h1 className="text-gray-700">Name:</h1>
                      <h1 className="text-gray-700">Email:</h1>
                      <h1 className="text-gray-700">Phone:</h1>
                    </div>
                    {!clickEditPersonal ? (
                      <div className="flex flex-col gap-2 ">
                        <h1 className="font-bold">{userInfo?.name}</h1>
                        <h1 className="font-bold">{userInfo?.email}</h1>
                        <h1 className="font-bold">{userInfo?.phone}</h1>
                      </div>
                    ) : (
                      <div className="flex flex-col lg:flex-row items-center gap-5">
                        <div className="flex flex-col gap-1">
                          <input
                            value={newName}
                            placeholder={userInfo?.name}
                            className="rounded-lg w-[150px] lg:w-full px-2 bg-gray-100/50 border shadow  outline-0 focus:shadow-[0_0_0_4px_rgba(74,157,236,0.2)] focus:border-[#4A9DEC] focus:border"
                            onChange={(e) => setNewName(e.target.value)}
                          />
                          <input
                            type="email"
                            value={newEmail}
                            placeholder={userInfo?.email}
                            className="rounded-lg w-[150px] lg:w-full px-2 bg-gray-100/50 border shadow  outline-0 focus:shadow-[0_0_0_4px_rgba(74,157,236,0.2)] focus:border-[#4A9DEC] focus:border"
                            onChange={(e) => setNewEmail(e.target.value)}
                          />
                          <input
                            type="number"
                            value={newPhone}
                            placeholder={userInfo?.phone}
                            className="rounded-lg w-[150px] lg:w-full px-2 bg-gray-100/50 border shadow outline-0 focus:shadow-[0_0_0_4px_rgba(74,157,236,0.2)] focus:border-[#4A9DEC] focus:border"
                            onChange={(e) => setNewPhone(e.target.value)}
                          />
                        </div>
                        <div>
                          <button
                            onClick={handleUpdatePersonal}
                            disabled={isLoading}
                            className="bg-gradient-to-t text-xs lg:text-lg  from-zinc-200 to-zinc-50 p-3 rounded-lg text-black font-bold drop-shadow-md ">
                            update
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => setClickEditPersonal(!clickEditPersonal)}
                    disabled={isLoading}
                    className="bg-gradient-to-t hover:opacity-70 transition-all duration-300 text-xs lg:text-lg lg:text-md gap-2 items-center flex justify-center from-zinc-200 to-zinc-50 p-3 rounded-lg text-black font-bold drop-shadow-md ">
                    {clickEditPersonal ? "Cancel" : <PencilLine size={18} />}
                  </button>
                </div>
              </div>
            </motion.div>
            {userAddress ? (
              <motion.div
                variants={childVariants}
                className="flex flex-col gap-5 border bg-zinc-200/10 p-5 lg:p-7 drop-shadow-lg shadow rounded-lg">
                <h1 className="font-extrabold text-xl mb-3 items-center flex gap-2">
                  Address{" "}
                  <Tooltip
                    content="It's user responsibility to provide correct address"
                    className="bg-white shadow px-2 py-1 text-sm">
                    <Info size={20} />
                  </Tooltip>
                </h1>
                <div className="flex justify-between">
                  <div>
                    <div className="flex gap-5 lg:gap-14 ">
                      <div className="flex flex-col gap-2 ">
                        <h1 className="text-gray-700">Governorate:</h1>
                        <h1 className="text-gray-700">City:</h1>
                        <h1 className="text-gray-700">Block:</h1>
                        <h1 className="text-gray-700">Street:</h1>
                        <h1 className="text-gray-700">House:</h1>
                      </div>
                      {!clickEditAddress ? (
                        <div className="flex flex-col gap-2 ">
                          <h1 className="font-bold">{userAddress?.governorate}</h1>
                          <h1 className="font-bold">{userAddress?.city}</h1>
                          <h1 className="font-bold">{userAddress?.block}</h1>
                          <h1 className="font-bold">{userAddress?.street}</h1>
                          <h1 className="font-bold">{userAddress?.house}</h1>
                        </div>
                      ) : (
                        <div className="flex flex-col lg:flex-row items-center gap-5">
                          <div className="flex flex-col gap-1">
                            <select
                              value={selectedProvince}
                              onChange={handleProvinceChange}
                              className="rounded-lg border  px-2  bg-zinc-100/50 cursor-pointer shadow-md w-[150px] lg:w-full focus:shadow-[0_0_0_4px_rgba(74,157,236,0.2)] outline-0 focus:border-[#4A9DEC] focus:border">
                              <option value="" disabled={true}>
                                Choose province
                              </option>
                              {provinces?.map((province) => (
                                <option key={province.name} value={province.name}>
                                  {province.name}
                                </option>
                              ))}
                            </select>
                            <select
                              value={city}
                              onChange={handleCityChange}
                              className=" rounded-lg  border shadow-md  px-2  w-[150px] lg:w-full bg-zinc-100/50 outline-0 cursor-pointer focus:shadow-[0_0_0_4px_rgba(74,157,236,0.2)] focus:border-[#4A9DEC] focus:border">
                              <option value="" disabled={true}>
                                Choose city
                              </option>
                              {cities?.map((city, index) => (
                                <option key={index} value={city}>
                                  {city}
                                </option>
                              ))}
                            </select>
                            <input
                              value={newBlock}
                              placeholder={userAddress?.block}
                              className="rounded-lg w-[150px] lg:w-full px-2 bg-gray-100/50 border shadow outline-0 focus:shadow-[0_0_0_4px_rgba(74,157,236,0.2)] focus:border-[#4A9DEC] focus:border"
                              onChange={(e) => setNewBlock(e.target.value)}
                            />
                            <input
                              value={newStreet}
                              placeholder={userAddress?.street}
                              className="rounded-lg w-[150px] lg:w-full px-2 bg-gray-100/50 border shadow outline-0 focus:shadow-[0_0_0_4px_rgba(74,157,236,0.2)] focus:border-[#4A9DEC] focus:border"
                              onChange={(e) => setNewStreet(e.target.value)}
                            />
                            <input
                              value={newHouse}
                              placeholder={userAddress?.house}
                              className="rounded-lg w-[150px] lg:w-full px-2 bg-gray-100/50 border shadow outline-0 focus:shadow-[0_0_0_4px_rgba(74,157,236,0.2)] focus:border-[#4A9DEC] focus:border"
                              onChange={(e) => setNewHouse(e.target.value)}
                            />
                          </div>
                          <div>
                            <button
                              onClick={handleUpdateAddress}
                              disabled={isLoading}
                              className="bg-gradient-to-t text-xs lg:text-lg  from-zinc-200 to-zinc-50 p-3 rounded-lg text-black font-bold drop-shadow-md ">
                              update
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => setClickEditAddress(!clickEditAddress)}
                      disabled={isLoading}
                      className="bg-gradient-to-t text-xs lg:text-lg lg:text-md gap-2 items-center flex justify-center from-zinc-200 to-zinc-50 p-3 rounded-lg text-black font-bold drop-shadow-md ">
                      {clickEditAddress ? "Cancel" : <PencilLine size={18} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex hover:bg-zinc-200/5 cursor-pointer items-center gap-5 border bg-zinc-200/10 p-7 drop-shadow-lg shadow rounded-lg">
                  <h1 className="font-extrabold text-xl ">Add your Address</h1>
                  <HousePlus />
                </button>

                <AddressModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
              </>
            )}
          </motion.div>
        </div>
        {myorders?.length === 0 ? (
          <div className=" lg:w-[30%] ">
            <h1 className="text-3xl font-bold ">
              My orders <span className="text-sm text-blue-600 ">({myorders?.length})</span>
            </h1>
            <Message dismiss={false}>You don't have orders</Message>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col gap-5 h-screen overflow-y-scroll">
            <h1 className="text-3xl font-bold ">My orders ({myorders?.length})</h1>
            {myorders?.map((order) => (
              <motion.div
                key={order._id}
                variants={childVariants}
                className="flex  flex-col hover:bg-zinc-200/5  gap-5 border bg-zinc-200/10 p-7 drop-shadow-lg shadow rounded-lg">
                <div className="flex flex-col gap-5">
                  <Link to={`/order/${order?._id}`} className="flex gap-5 ">
                    <h1 className="flex flex-col gap-2 items-center ">
                      Placed in:{" "}
                      <span className="font-bold"> {order?.createdAt.substring(0, 10)}</span>
                    </h1>
                    <h1 className="flex flex-col gap-2 items-center ">
                      Payment method: <span className="font-bold">{order?.paymentMethod}</span>
                    </h1>
                    <h1 className="flex flex-col gap-2 items-center">
                      Total price:{" "}
                      <span className="font-bold">{order?.totalPrice.toFixed(3)} KD</span>
                    </h1>
                    <h1 className="flex flex-col gap-2 items-center">
                      Products:
                      <span className="font-bold">{order?.orderItems.length}</span>
                    </h1>
                    <h1 className="flex flex-col gap-2 items-center">
                      Status:
                      <span className="font-bold text-sm">
                        {order?.isDelivered ? (
                          <Badge variant="success">Delivered </Badge>
                        ) : order?.isCanceled ? (
                          <Badge variant="danger">Canceled</Badge>
                        ) : (
                          <Badge variant="pending">Processing</Badge>
                        )}
                      </span>
                    </h1>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
}

export default Profile;
