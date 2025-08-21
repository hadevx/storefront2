import { useState, useRef, useEffect } from "react";
import { provinces } from "../../assets/data/addresses.js";
import address2 from "../../assets/images/kuwait.jpg";
import { useSelector } from "react-redux";
import { useCreateAddressMutation } from "../../redux/queries/userApi";
import { toast } from "react-toastify";
import { useGetAddressQuery } from "../../redux/queries/userApi";

export default function AddressModal({ isOpen, onClose }) {
  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");
  const [block, setBlock] = useState("");
  const [house, setHouse] = useState("");
  const [street, setStreet] = useState("");

  const [createAddress, { isLoading: loadingCreateAddress }] = useCreateAddressMutation();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { refetch } = useGetAddressQuery(userInfo?._id);

  const modalRef = useRef();

  // Close modal on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleGovernorateChange = (e) => {
    const provinceName = e.target.value;
    setSelectedGovernorate(provinceName);
    const province = provinces.find((p) => p.name === provinceName);
    if (province) setCities(province.cities);
    else setCities([]);
  };

  const handleCreateAddress = async () => {
    if (!selectedGovernorate || !city || !block || !street || !house) {
      return toast.error("All fields are required");
    }
    const res = await createAddress({
      governorate: selectedGovernorate,
      city,
      block,
      street,
      house,
    }).unwrap();
    toast.success("You've added a new address", { position: "top-center" });
    refetch();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed px-2 inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl max-w-3xl w-full lg:flex overflow-hidden shadow-2xl">
        {/* Left image */}
        <div className="hidden lg:block lg:w-1/2">
          <img
            src={address2}
            alt="Address"
            className="h-full w-full object-cover lg:rounded-l-2xl"
          />
        </div>

        {/* Form */}
        <div className="p-8 lg:w-1/2 flex flex-col gap-4">
          <h2 className="text-2xl font-extrabold">Hi {userInfo.name}!</h2>
          <p>Add your address to enjoy better shopping experience ♥</p>

          {/* Governorate */}
          <div>
            <label className="font-semibold">Governorate:</label>
            <select
              value={selectedGovernorate}
              onChange={handleGovernorateChange}
              className="w-full p-2 mt-1 border rounded-lg outline-none focus:border-blue-500">
              <option value="" disabled>
                Choose governorate
              </option>
              {provinces.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="font-semibold">City:</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2 mt-1 border rounded-lg outline-none focus:border-blue-500">
              <option value="" disabled>
                Choose city
              </option>
              {cities.map((c, idx) => (
                <option key={idx} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Block */}
          <div>
            <label className="font-semibold">Block:</label>
            <input
              type="text"
              placeholder="Enter block number"
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              className="w-full p-2 mt-1 border rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          {/* Street */}
          <div>
            <label className="font-semibold">Street:</label>
            <input
              type="text"
              placeholder="Enter street number"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full p-2 mt-1 border rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          {/* House */}
          <div>
            <label className="font-semibold">House:</label>
            <input
              type="text"
              placeholder="Enter house number"
              value={house}
              onChange={(e) => setHouse(e.target.value)}
              className="w-full p-2 mt-1 border rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-bold">
              Cancel
            </button>
            <button
              onClick={handleCreateAddress}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold">
              {loadingCreateAddress ? "Creating..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
