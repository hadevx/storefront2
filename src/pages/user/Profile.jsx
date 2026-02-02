import { useMemo, useState, useEffect } from "react";
import Layout from "../../Layout";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, setUserInfo } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import { motion } from "framer-motion";
import {
  useUpdateUserMutation,
  useUpdateAddressMutation,
  useLogoutMutation,
  useGetAddressQuery,
} from "../../redux/queries/userApi";
import { useGetMyOrdersQuery } from "../../redux/queries/orderApi.js";
import AddressModal from "../address/AddressModal.jsx";
import { provinces } from "../../assets/data/addresses.js";
import clsx from "clsx";
import {
  LogOut,
  Pencil,
  MapPin,
  User as UserIcon,
  Phone,
  Mail,
  Package,
  CheckCircle2,
  XCircle,
  Clock3,
  ChevronRight,
} from "lucide-react";

/**
 * ✅ Language logic applied (EN/AR)
 * - Uses state.language.lang
 * - Sets dir RTL/LTR
 * - Translates all visible labels + toasts + order statuses
 * - Keeps your responsive layout (Personal + Address side-by-side on desktop)
 */

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.auth.userInfo);
  const language = useSelector((state) => state.language.lang);

  const t =
    language === "ar"
      ? {
          logout: "تسجيل خروج",
          logoutFailed: "فشل تسجيل الخروج",
          updatedSuccessfully: "تم التحديث بنجاح",
          updateFailed: "فشل التحديث",
          phoneInvalid: "الرجاء إدخال رقم هاتف صحيح",
          addressUpdated: "تم تحديث العنوان",
          addressUpdateFailed: "فشل تحديث العنوان",
          addPhone: "أضف رقم هاتفك",
          notSet: "غير محدد",
          save: "حفظ",
          cancel: "إلغاء",
          edit: "تعديل",
          saving: "جاري الحفظ...",
          personalInfo: "المعلومات الشخصية",
          shippingAddress: "عنوان الشحن",
          addAddress: "+ إضافة عنوان",
          chooseGovernorate: "اختر المحافظة",
          chooseCity: "اختر المنطقة",
          block: "قطعة",
          street: "شارع",
          house: "منزل",
          governorate: "المحافظة",
          city: "المنطقة",
          myOrders: "طلباتي",
          noOrders: "لا توجد طلبات بعد",
          noOrdersHint: "بعد إنشاء أول طلب، سيظهر هنا.",
          startShopping: "ابدأ التسوق",
          viewDetails: "عرض التفاصيل",
          viewAllOrders: "عرض كل الطلبات",
          totalOrders: "إجمالي الطلبات",
          processing: "قيد المعالجة",
          delivered: "تم التوصيل",
          canceled: "ملغي",
          order: "طلب",
          total: "الإجمالي",
          inProgress: "قيد التنفيذ",
          orderLabel: "رقم الطلب",
        }
      : {
          logout: "Logout",
          logoutFailed: "Logout failed",
          updatedSuccessfully: "Updated successfully",
          updateFailed: "Update failed",
          phoneInvalid: "Please enter a valid phone number",
          addressUpdated: "Updated address",
          addressUpdateFailed: "Failed to update address",
          addPhone: "Add your phone number",
          notSet: "Not set",
          save: "Save",
          cancel: "Cancel",
          edit: "Edit",
          saving: "Saving...",
          personalInfo: "Personal information",
          shippingAddress: "Shipping address",
          addAddress: "+ Add your address",
          chooseGovernorate: "Choose governorate",
          chooseCity: "Choose city",
          block: "Block",
          street: "Street",
          house: "House",
          governorate: "Governorate",
          city: "City",
          myOrders: "My orders",
          noOrders: "No orders yet",
          noOrdersHint: "Once you place an order, it will show up here.",
          startShopping: "Start shopping",
          viewDetails: "View details",
          viewAllOrders: "View all orders",
          totalOrders: "Total orders",
          processing: "Processing",
          delivered: "Delivered",
          canceled: "Canceled",
          order: "Order",
          total: "Total",
          inProgress: "In progress",
          orderLabel: "Order #",
        };

  const { data: userAddress, refetch } = useGetAddressQuery(userInfo?._id);
  const { data: myorders } = useGetMyOrdersQuery();

  const [updateUser] = useUpdateUserMutation();
  const [updateAddress, { isLoading: loadingAddress }] = useUpdateAddressMutation();
  const [logoutApiCall, { isLoading: loadingLogout }] = useLogoutMutation();

  // UI state
  const [tab, setTab] = useState("overview"); // overview | orders | address | account
  const [editPersonal, setEditPersonal] = useState(false);
  const [editAddress, setEditAddress] = useState(false);

  // Inputs
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const [newBlock, setNewBlock] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newHouse, setNewHouse] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = useMemo(() => {
    const list = Array.isArray(myorders) ? myorders : [];
    const delivered = list.filter((o) => o?.isDelivered).length;
    const canceled = list.filter((o) => o?.isCanceled).length;
    const processing = Math.max(0, list.length - delivered - canceled);
    return { total: list.length, delivered, canceled, processing };
  }, [myorders]);

  // prevent any accidental horizontal scroll
  useEffect(() => {
    const prev = document.body.style.overflowX;
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = prev;
    };
  }, []);

  // Prefill forms when user toggles edit (nice UX)
  useEffect(() => {
    if (editPersonal) {
      setNewName(userInfo?.name || "");
      setNewEmail(userInfo?.email || "");
      setNewPhone(userInfo?.phone || "");
    }
  }, [editPersonal, userInfo]);

  useEffect(() => {
    if (editAddress && userAddress) {
      setSelectedProvince(userAddress?.governorate || "");
      setCity(userAddress?.city || "");
      setNewBlock(userAddress?.block || "");
      setNewStreet(userAddress?.street || "");
      setNewHouse(userAddress?.house || "");

      const province = provinces.find((p) => p.name === (userAddress?.governorate || ""));
      setCities(province ? province.cities : []);
    }
  }, [editAddress, userAddress]);

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (e) {
      toast.error(t.logoutFailed, { position: "top-center" });
    }
  };

  const handleUpdatePersonal = async () => {
    try {
      if (newPhone && String(newPhone).length !== 8) {
        toast.error(t.phoneInvalid);
        return;
      }

      const res = await updateUser({
        name: newName || userInfo?.name,
        email: newEmail || userInfo?.email,
        phone: newPhone || userInfo?.phone,
      }).unwrap();

      dispatch(setUserInfo(res));
      toast.success(t.updatedSuccessfully, { position: "top-center" });
      setEditPersonal(false);
    } catch (error) {
      toast.error(error?.data?.message || t.updateFailed);
    }
  };

  const handleUpdateAddress = async () => {
    try {
      await updateAddress({
        governorate: selectedProvince,
        city,
        block: newBlock,
        street: newStreet,
        house: newHouse,
      }).unwrap();

      refetch();
      setEditAddress(false);
      toast.success(t.addressUpdated, { position: "top-center" });
    } catch (e) {
      toast.error(t.addressUpdateFailed, { position: "top-center" });
    }
  };

  const handleProvinceChange = (e) => {
    const provinceName = e.target.value;
    setSelectedProvince(provinceName);
    const province = provinces.find((p) => p.name === provinceName);
    setCities(province ? province.cities : []);
    setCity("");
  };

  const handleCityChange = (e) => setCity(e.target.value);

  const OrderStatusPill = ({ order }) => {
    const delivered = order?.isDelivered;
    const canceled = order?.isCanceled;

    const cfg = delivered
      ? {
          label: t.delivered,
          icon: CheckCircle2,
          cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
        }
      : canceled
        ? { label: t.canceled, icon: XCircle, cls: "bg-rose-50 text-rose-700 border-rose-200" }
        : {
            label: t.processing,
            icon: Clock3,
            cls: "bg-amber-50 text-amber-700 border-amber-200",
          };

    const Icon = cfg.icon;

    return (
      <span
        className={clsx(
          "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
          cfg.cls,
        )}>
        <Icon className="h-3.5 w-3.5" />
        {cfg.label}
      </span>
    );
  };

  const Card = ({ title, icon: Icon, action, children }) => (
    <div className="w-full min-w-0 rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur shadow-sm">
      <div className="flex items-center justify-between gap-3 p-5">
        <div className="flex items-center gap-2 min-w-0">
          {Icon ? <Icon className="h-4 w-4 text-neutral-800 shrink-0" /> : null}
          <h2 className="text-sm font-semibold text-neutral-900 truncate">{title}</h2>
        </div>
        <div className="shrink-0">{action}</div>
      </div>
      <div className="px-5 pb-5 min-w-0">{children}</div>
    </div>
  );

  const initial = String(userInfo?.name || "U")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <Layout>
      <div
        dir={language === "ar" ? "rtl" : "ltr"}
        className="relative overflow-x-hidden bg-gray-100">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-neutral-50 to-white" />
          <div className="absolute left-1/2 top-24 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-neutral-200/45 blur-3xl" />
          <div className="absolute -right-24 top-80 h-64 w-64 rounded-full bg-neutral-200/30 blur-3xl" />
        </div>

        <motion.div
          transition={{ duration: 0.6 }}
          className="min-h-screen mx-auto w-full max-w-6xl mt-[70px] lg:mt-[110px] px-3 pb-16">
          {/* Header */}
          <div className="mt-6 w-full min-w-0 rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur shadow-sm p-5 md:p-7">
            <div className="flex items-center justify-between gap-5 md:flex-row md:items-center md:justify-between min-w-0">
              <div className="flex items-center gap-4 min-w-0">
                <div className="shrink-0 size-16 rounded-2xl bg-neutral-900 text-white grid place-items-center font-bold text-lg">
                  {initial}
                </div>

                <div className="min-w-0">
                  <h1 className="truncate text-xl md:text-2xl font-semibold tracking-tight text-neutral-950">
                    {userInfo?.name}
                  </h1>
                  <p className="text-sm text-neutral-600 truncate">{userInfo?.email}</p>
                  <p className="text-xs text-neutral-500 mt-1 truncate">
                    {userInfo?.phone ? `+965 ${userInfo.phone}` : t.addPhone}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loadingLogout}
                className="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-900 active:scale-[0.99] transition">
                {loadingLogout ? (
                  <Spinner className="border-t-transparent" />
                ) : (
                  <>
                    <LogOut className="h-4 w-4" />
                    {t.logout}
                  </>
                )}
              </button>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                <div className="text-xs text-neutral-500 truncate">{t.totalOrders}</div>
                <div className="mt-1 text-lg font-semibold text-neutral-950">{stats.total}</div>
              </div>
              <div className="min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                <div className="text-xs text-neutral-500 truncate">{t.processing}</div>
                <div className="mt-1 text-lg font-semibold text-neutral-950">
                  {stats.processing}
                </div>
              </div>
              <div className="min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                <div className="text-xs text-neutral-500 truncate">{t.delivered}</div>
                <div className="mt-1 text-lg font-semibold text-neutral-950">{stats.delivered}</div>
              </div>
              <div className="min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                <div className="text-xs text-neutral-500 truncate">{t.canceled}</div>
                <div className="mt-1 text-lg font-semibold text-neutral-950">{stats.canceled}</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mt-6 space-y-6 min-w-0">
            {/* ✅ Personal + Address side-by-side on desktop */}
            <div className="grid gap-6 lg:grid-cols-2 min-w-0">
              {/* Personal */}
              {(tab === "overview" || tab === "account") && (
                <Card
                  title={t.personalInfo}
                  icon={UserIcon}
                  action={
                    !editPersonal ? (
                      <button
                        type="button"
                        onClick={() => setEditPersonal(true)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50 transition">
                        <Pencil className="h-4 w-4" />
                        {t.edit}
                      </button>
                    ) : null
                  }>
                  {!editPersonal ? (
                    <div className="grid gap-3 text-sm min-w-0">
                      <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 min-w-0">
                        <UserIcon className="h-4 w-4 text-neutral-600 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs text-neutral-500">
                            {language === "ar" ? "الاسم" : "Name"}
                          </div>
                          <div className="truncate font-medium text-neutral-900">
                            {userInfo?.name}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 min-w-0">
                        <Mail className="h-4 w-4 text-neutral-600 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs text-neutral-500">
                            {language === "ar" ? "البريد الإلكتروني" : "Email"}
                          </div>
                          <div className="truncate font-medium text-neutral-900">
                            {userInfo?.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 min-w-0">
                        <Phone className="h-4 w-4 text-neutral-600 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs text-neutral-500">
                            {language === "ar" ? "الهاتف" : "Phone"}
                          </div>
                          <div className="truncate font-medium text-neutral-900">
                            {userInfo?.phone ? `+965 ${userInfo.phone}` : t.notSet}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 min-w-0">
                      <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder={userInfo?.name}
                        className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
                      />
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder={userInfo?.email}
                        className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
                      />
                      <input
                        type="number"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder={
                          userInfo?.phone ||
                          (language === "ar" ? "الهاتف (8 أرقام)" : "Phone (8 digits)")
                        }
                        className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
                      />

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          type="button"
                          onClick={handleUpdatePersonal}
                          className="rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-900 transition">
                          {t.save}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditPersonal(false)}
                          className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition">
                          {t.cancel}
                        </button>
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {/* Address */}
              {(tab === "overview" || tab === "address") && (
                <Card
                  title={t.shippingAddress}
                  icon={MapPin}
                  action={
                    userAddress && !editAddress ? (
                      <button
                        type="button"
                        onClick={() => setEditAddress(true)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50 transition">
                        <Pencil className="h-4 w-4" />
                        {t.edit}
                      </button>
                    ) : null
                  }>
                  {!userAddress ? (
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="w-full rounded-2xl border border-dashed border-neutral-300 bg-white px-4 py-4 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition">
                      {t.addAddress}
                    </button>
                  ) : !editAddress ? (
                    <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-sm text-neutral-700 space-y-2 min-w-0">
                      {[
                        [t.governorate, userAddress?.governorate],
                        [t.city, userAddress?.city],
                        [t.block, userAddress?.block],
                        [t.street, userAddress?.street],
                        [t.house, userAddress?.house],
                      ].map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between gap-4 min-w-0">
                          <span className="text-xs text-neutral-500">{k}</span>
                          <span className="font-medium text-neutral-900 truncate">{v || "-"}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3 min-w-0">
                      <select
                        value={selectedProvince}
                        onChange={handleProvinceChange}
                        className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10">
                        <option value="">{t.chooseGovernorate}</option>
                        {provinces.map((p) => (
                          <option key={p.name} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </select>

                      <select
                        value={city}
                        onChange={handleCityChange}
                        className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10">
                        <option value="">{t.chooseCity}</option>
                        {cities.map((c, i) => (
                          <option key={i} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          value={newBlock}
                          onChange={(e) => setNewBlock(e.target.value)}
                          placeholder={t.block}
                          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
                        />
                        <input
                          value={newHouse}
                          onChange={(e) => setNewHouse(e.target.value)}
                          placeholder={t.house}
                          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
                        />
                      </div>

                      <input
                        value={newStreet}
                        onChange={(e) => setNewStreet(e.target.value)}
                        placeholder={t.street}
                        className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
                      />

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          type="button"
                          onClick={handleUpdateAddress}
                          disabled={loadingAddress}
                          className="rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-900 transition disabled:opacity-60">
                          {loadingAddress ? t.saving : t.save}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditAddress(false)}
                          className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition">
                          {t.cancel}
                        </button>
                      </div>
                    </div>
                  )}
                </Card>
              )}
            </div>

            {/* Orders section below (full width) */}
            {(tab === "overview" || tab === "orders") && (
              <Card title={`${t.myOrders} (${stats.total})`} icon={Package} action={null}>
                {stats.total === 0 ? (
                  <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-10 text-center">
                    <p className="font-semibold text-neutral-900">{t.noOrders}</p>
                    <p className="mt-1 text-sm text-neutral-500">{t.noOrdersHint}</p>
                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-900 transition">
                      {t.startShopping}
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 min-w-0">
                    {(Array.isArray(myorders) ? myorders : [])
                      .slice(0, tab === "orders" ? 50 : 6)
                      .map((order) => (
                        <div
                          key={order._id}
                          className="rounded-2xl border border-neutral-200 bg-white px-4 py-4 hover:bg-neutral-50 transition min-w-0">
                          <div className="flex items-start justify-between gap-3 min-w-0">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-neutral-900 truncate">
                                {t.orderLabel}
                                {String(order?._id).slice(-6).toUpperCase()}
                              </p>
                              <p className="mt-1 text-xs text-neutral-500">
                                {order?.createdAt?.substring(0, 10)} • {t.total}{" "}
                                <span className="font-semibold text-neutral-900">
                                  {order?.totalPrice?.toFixed(3)} KD
                                </span>
                              </p>
                            </div>
                            <OrderStatusPill order={order} />
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => navigate(`/order/${order?._id}`)}
                              className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-900">
                              {t.viewDetails} <ChevronRight className="h-4 w-4" />
                            </button>

                            <span className="text-xs text-neutral-500 whitespace-nowrap">
                              {order?.isDelivered
                                ? t.delivered
                                : order?.isCanceled
                                  ? t.canceled
                                  : t.inProgress}
                            </span>
                          </div>
                        </div>
                      ))}

                    {tab !== "orders" && stats.total > 6 && (
                      <button
                        type="button"
                        onClick={() => setTab("orders")}
                        className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition">
                        {t.viewAllOrders}
                      </button>
                    )}
                  </div>
                )}
              </Card>
            )}
          </div>

          <AddressModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </motion.div>
      </div>
    </Layout>
  );
}

export default Profile;
