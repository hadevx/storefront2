import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { provinces } from "../../assets/data/addresses.js";
import address2 from "../../assets/images/kuwait.jpg";
import { useSelector } from "react-redux";
import { useCreateAddressMutation } from "../../redux/queries/userApi";
import { toast } from "react-toastify";
import Layout from "../../Layout.jsx";

function Address() {
  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");
  const [block, setBlock] = useState("");
  const [house, setHouse] = useState("");
  const [street, setStreet] = useState("");

  const [createAddress] = useCreateAddressMutation();

  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.auth.userInfo);

  // Update cities based on selected province
  const handleGovernorateChange = (e) => {
    const provinceName = e.target.value;
    setSelectedGovernorate(provinceName);
    const province = provinces.find((p) => p.name === provinceName);

    if (province) {
      setCities(province.cities);
    } else {
      setCities([]);
    }
  };

  const handleCreateAddress = async () => {
    if (!selectedGovernorate || !city || !block || !street || !house) {
      return toast.error("All fields are required");
    }
    const res = await createAddress({
      governorate: selectedGovernorate,
      city: city,
      block: block,
      street: street,
      house: house,
    }).unwrap();
    console.log(res);
    toast.success("You've added new address ", { position: "top-center" });
    navigate(-1);
  };
  return (
    <div className="flex font-[Manrope] bg-gray-100 3xl:items-center  lg:overflow-hidden h-screen   flex-col  lg:flex-row justify-around  ">
      <div className=" p-5   lg:block">
        <img
          src={address2}
          className="drop-shadow-2xl h-full shadow-md object-cover  lg:rounded-3xl"
        />
      </div>
      <div className=" rounded-2xl py-10  px-10 ">
        <div className="  flex flex-col  lg:w-[500px]">
          <div className="mb-5">
            <h1 className="text-3xl font-extrabold mb-2">Hi {userInfo.name}!</h1>
            <p>Add your address to enjoy better shopping experince &hearts;</p>
          </div>
          <div className="mb-5">
            <h1 className="font-bold text-md mb-2">Governorate:</h1>
            <select
              value={selectedGovernorate}
              onChange={handleGovernorateChange}
              className="p-2  rounded-lg border py-3 px-4  bg-zinc-100/50 cursor-pointer shadow-md w-full focus:shadow-[0_0_0_4px_rgba(74,157,236,0.2)] outline-0 focus:border-[#4A9DEC] focus:border">
              <option value="" disabled={true}>
                Choose governorate
              </option>
              {provinces.map((province) => (
                <option className="" key={province.name} value={province.name}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-5">
            <h1 className="font-bold text-md mb-2">City:</h1>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="p-2  rounded-lg  border shadow-md py-3 px-4  w-full bg-zinc-100/50 outline-0 cursor-pointer focus:shadow-[0_0_0_4px_rgba(74,157,236,0.2)] focus:border-[#4A9DEC] focus:border">
              <option value="" disabled={true}>
                Choose city
              </option>
              {cities?.map((city, index) => (
                <option className="" key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-5">
            <h1 className="font-bold text-md mb-2 ">Block:</h1>
            <input
              type="text"
              placeholder="Enter block number"
              className="p-2 w-full shadow border rounded-md h-full bg-gray-100 bg-opacity-50 py-3 px-4  outline-0 focus:shadow-[0_0_0_4px_rgba(74,157,236,0.2)] focus:border-[#4A9DEC] focus:border"
              value={block}
              onChange={(e) => setBlock(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <h1 className="font-bold text-md mb-2 ">Street:</h1>
            <input
              type="text"
              placeholder="Enter street number"
              className="p-2 w-full shadow border rounded-md h-full bg-gray-100 bg-opacity-50 py-3 px-4  outline-0 focus:shadow-[0_0_0_4px_rgba(74,157,236,0.2)] focus:border-[#4A9DEC] focus:border"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>
          <div>
            <h1 className="font-bold text-md mb-2 ">House:</h1>
            <input
              type="text"
              placeholder="Enter house number"
              className="p-2 w-full shadow border rounded-md h-full bg-gray-100 bg-opacity-50 py-3 px-4  outline-0 focus:shadow-[0_0_0_4px_rgba(74,157,236,0.2)] focus:border-[#4A9DEC] focus:border"
              value={house}
              onChange={(e) => setHouse(e.target.value)}
            />
          </div>
          <div className="flex items-center mt-5 justify-end gap-5">
            <Link
              to="/profile"
              className="bg-gradient-to-t text-sm lg:text-md gap-2 items-center flex justify-center from-zinc-200 to-zinc-50 p-3 rounded-lg text-black font-bold drop-shadow-lg shadow ">
              Cancel
            </Link>
            <button
              onClick={handleCreateAddress}
              className="bg-gradient-to-t w-[200px] from-zinc-900 to-zinc-700 hover:bg-gradient-to-b text-white p-3 rounded-lg  font-bold ">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Address;
