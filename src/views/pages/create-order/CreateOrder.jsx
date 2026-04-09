import {
  Button,
  Card,
  CardHeader,
  Col,
  Container,
  Input,
  Row,
  Spinner,
} from "reactstrap";
import SimpleHeader from "../../../components/Headers/SimpleHeader";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../../context/AppProvider";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { postMenu, getListMenuByMode } from "../../../apis/menuApiService";
import { createOrder, getDeliveryTimeByMenuId } from "../../../apis/orderApiService";
import { createCustomer, getCustomers } from "../../../apis/customerApiService";
import { notify } from "../../../components/Toast/ToastCustom";
import Select from "react-select";
import axios from "axios";

const CreateOrder = () => {
  const [commandBoxValue, setCommandBoxValue] = useState("");
  const [commandBoxValueState, setCommandBoxValueState] = useState("");
  const [commandBoxValueMessage, setCommandBoxValueMessage] = useState("");


  const { buildingList, storeList } = useContext(AppContext);

  const [formData, setFormData] = useState({ 
    productInformation: "",
    timeReceived: "",
    timeDelivery: "",
    store: "",
    building: "",
    name: "",
    phone: "",
    total: "",
    shipCost: "",
    noteOfOrder: "",
    noteOfCustomer: "",
    paymentName: "",
    menuId: "",
    deliveryTimeId: "",
    serviceId: { label: "Giao hàng tiêu chuẩn", value: 0 },
    modeId: "string",
  });

  const [formState, setFormState] = useState({
    productInformation: "",
    timeReceived: "",
    timeDelivery: "",
    store: "",
    building: "",
    name: "",
    phone: "",
    total: "",
    shipCost: "",
    noteOfOrder: "",
    noteOfCustomer: "",
    paymentName: "",
    deliveryTimeId: "",
  });

  const [formMessages, setFormMessages] = useState({
    productInformation: "",
    timeReceived: "",
    timeDelivery: "",
    store: "",
    building: "",
    name: "",
    phone: "",
    total: "",
    shipCost: "",
    noteOfOrder: "",
    noteOfCustomer: "",
    paymentName: "",
    deliveryTimeId: "",
  });

  const [isLoadingCircle, setIsLoadingCircle] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [deliveryTimeList, setDeliveryTimeList] = useState([]);
  const [isLoadingDeliveryTime, setIsLoadingDeliveryTime] = useState(false);
  const [menus, setMenus] = useState([]);
  const [isLoadingMenus, setIsLoadingMenus] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    // Nếu serviceId là 1 (Nhanh) thì lấy menu mode 1
    // Nếu serviceId là 0 (Tiêu chuẩn) thì lấy menu mode 2
    const targetMode = formData.serviceId.value === 1 ? 1 : 2;
    fetchMenus(targetMode);
  }, [formData.serviceId.value]);

  const fetchMenus = async (mode) => {
    setIsLoadingMenus(true);
    try {
      const response = await getListMenuByMode(mode);
      if (response.data) {
        setMenus(response.data);
      }
    } catch (error) {
      console.error("Error fetching menus:", error);
    } finally {
      setIsLoadingMenus(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers(1, 1000);
      if (response.data) {
        setCustomers(response.data);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // Fetch delivery time frames khi menuId thay đổi
  useEffect(() => {
    if (formData.menuId) {
      fetchDeliveryTimes(formData.menuId);
    }
  }, [formData.menuId]);

  const fetchDeliveryTimes = async (menuId) => {
    setIsLoadingDeliveryTime(true);
    try {
      const response = await getDeliveryTimeByMenuId(menuId);
      if (response.data && Array.isArray(response.data)) {
        setDeliveryTimeList(response.data);
        // Nếu chỉ có 1 khung giờ thì tự động chọn
        if (response.data.length === 1) {
          setFormData((prev) => ({ ...prev, deliveryTimeId: response.data[0].id }));
        } else {
          setFormData((prev) => ({ ...prev, deliveryTimeId: "" }));
        }
      } else {
        setDeliveryTimeList([]);
      }
    } catch (error) {
      console.error("Error fetching delivery times:", error);
      setDeliveryTimeList([]);
    } finally {
      setIsLoadingDeliveryTime(false);
    }
  };

  const handleCommandChange = (e) => {
    const value = e.target.value;
    console.log("Command value changed:", value);
    setCommandBoxValue(value);
    parseCommand(value);
  };

  useEffect(() => {
    if (commandBoxValue !== "") {
      console.log("Validating form after command box value change.");
      validateForm();
    }
  }, [formData, commandBoxValue]);

  const checkPhoneValid = (phone) => {
    return phone.match(/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/im);
  };

  const parseCommand = (command) => {
     console.log("Parsing command:", command);
    const parts = command.split("_");
    if (parts.length === 7) {
      const [
        storeCode,
        orderNote,
        phoneNumber,
        buildingName,
        orderTotal,
        paymentName,
        customerNote,
      ] = parts;

      const storeOption = optionsStore.find((opt) => opt.storeCode === storeCode);
      const buildingOption = optionsBuilding.find(
        (opt) => opt.label.toLowerCase() === buildingName.toLowerCase()
      );
      const paymentOption = optionsPaymentName.find(
        (opt) =>
          opt.label.toLowerCase() === paymentName.toLowerCase() ||
          opt.shorthand.toLowerCase() === paymentName.toLowerCase()
      );
      console.log("Parsed command data:", {
        storeOption,
        orderNote,
        phoneNumber,
        buildingOption,
        orderTotal,
        paymentOption,
        customerNote,
      });

      setFormData((prev) => ({
        ...prev,
        store: storeOption || "",
        noteOfOrder: orderNote,
        phone: phoneNumber,
        building: buildingOption || "",
        total: orderTotal,
        paymentName: paymentOption || "",
        noteOfCustomer: customerNote,
      }));

      setFormState((prev) => ({
        ...prev,
        store: storeOption ? "valid" : "invalid",
        building: buildingOption ? "valid" : "invalid",
        paymentName: paymentOption ? "valid" : "invalid",
        phone: checkPhoneValid(phoneNumber) ? "valid" : "invalid",
        total: orderTotal >= 0 ? "valid" : "invalid",
      }));

      setFormMessages((prev) => ({
        ...prev,
        store: storeOption ? "" : "Cửa hàng không tồn tại",
        building: buildingOption ? "" : "Địa điểm giao không tồn tại",
      }));

      setCommandBoxValueState("valid");
      setCommandBoxValueMessage("Command hợp lệ");

      fetchCustomerInfo(phoneNumber);
    } else {
      setCommandBoxValueState("invalid");
      setCommandBoxValueMessage("Command không đúng định dạng. Vui lòng nhập lại.");
    }
  };

  const optionsStore = storeList.map((item) => ({
    label: item.name,
    value: item.id,
    storeCode: item.storeCode,
  }));

  const optionsBuilding = buildingList.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const getPaymentName = (item) => {
    switch (item) {
      case 0:
        return ["Thu hộ tiền mặt", "TM"];
      case 1:
        return ["Thu hộ chuyển khoản", "CK"];
      case 2:
        return ["Đã thanh toán", "DTT"];
      default:
        return ["", ""];
    }
  };

  const optionsPaymentName = [0, 1, 2].map((item) => {
    const [label, shorthand] = getPaymentName(item);
    return {
      label: label,
      value: item,
      shorthand: shorthand,
    };
  });

  // Build delivery time options cho Select
  const optionsDeliveryTime = deliveryTimeList.map((dt) => ({
    label: `${dt.fromHour} - ${dt.toHour}${
      dt.fromDate
        ? ` (${new Date(dt.fromDate).toLocaleDateString("vi-VN")})`
        : ""
    }`,
    value: dt.id,
  }));

  const optionsMenu = menus.map((m) => ({
    label: `${m.name} (${m.startHour}h - ${m.endHour}h)`,
    value: m.id,
  }));

  useEffect(() => {
    const now = new Date();
    const formattedTime = now.toTimeString().split(" ")[0].slice(0, 5);

    setFormData((prev) => ({
      ...prev,
      timeReceived: formattedTime,
      timeDelivery: formattedTime,
    }));
  }, []);

  const validateForm = () => {
    let valid = true;
    const newState = {};
    const newMessages = {};

    if (formData.noteOfOrder === "") {
      valid = false;
      newState.noteOfOrder = "invalid";
      newMessages.noteOfOrder = "Ghi chú đơn hàng không được để trống";
    } else {
      newState.noteOfOrder = "valid";
      newMessages.noteOfOrder = "";
    }

    if (formData.timeReceived === "") {
      valid = false;
      newState.timeReceived = "invalid";
      newMessages.timeReceived = "Thời gian nhận đơn không được để trống";
    } else {
      newState.timeReceived = "valid";
      newMessages.timeReceived = "";
    }

    if (formData.timeDelivery === "") {
      valid = false;
      newState.timeDelivery = "invalid";
      newMessages.timeDelivery = "Thời gian giao hàng không được để trống";
    } else {
      newState.timeDelivery = "valid";
      newMessages.timeDelivery = "";
    }

    if (formData.store === "") {
      valid = false;
      newState.store = "invalid";
    } else {
      newState.store = "valid";
    }

    if (formData.building === "") {
      valid = false;
      newState.building = "invalid";
    } else {
      newState.building = "valid";
    }

    if (formData.name.trim() === "") {
      valid = false;
      newState.name = "invalid";
      newMessages.name = "Tên khách hàng không được để trống";
    } else {
      newState.name = "valid";
      newMessages.name = "";
    }

    if (formData.paymentName === "") {
      valid = false;
      newState.paymentName = "invalid";
    } else {
      newState.paymentName = "valid";
    }

    if (formData.total === "") {
      valid = false;
      newState.total = "invalid";
      newMessages.total = "Giá trị đơn hàng không được để trống";
    } else if (!/^\d+(\.\d+)?$/.test(formData.total)) {
      valid = false;
      newState.total = "invalid";
      newMessages.total = "Giá trị đơn hàng không hợp lệ";
    } else if (formData.total < 0) {
      setFormData((prev) => ({ ...prev, total: 0 }));
      valid = false;
      newState.total = "invalid";
      newMessages.total = "Giá trị đơn hàng không thể là một giá trị âm";
    } else {
      newState.total = "valid";
      newMessages.total = "";
    }

    if (formData.shipCost === "") {
      valid = false;
      newState.shipCost = "invalid";
      newMessages.shipCost = "Phí dịch vụ không được để trống";
    } else if (!/^\d+(\.\d+)?$/.test(formData.shipCost)) {
      valid = false;
      newState.shipCost = "invalid";
      newMessages.shipCost = "Phí dịch vụ không hợp lệ";
    } else {
      newState.shipCost = "valid";
      newMessages.shipCost = "";
    }

    if (formData.phone === "") {
      valid = false;
      newState.phone = "invalid";
      newMessages.phone = "Số điện thoại không được để trống";
    } else if (!checkPhoneValid(formData.phone)) {
      valid = false;
      newState.phone = "invalid";
      newMessages.phone = "Số điện thoại không hợp lệ";
    } else {
      newState.phone = "valid";
      newMessages.phone = "";
    }

    // Validate deliveryTimeId (bắt buộc)
    if (!formData.deliveryTimeId) {
      valid = false;
      newState.deliveryTimeId = "invalid";
      newMessages.deliveryTimeId = "Khung giờ giao hàng không được để trống";
    } else {
      newState.deliveryTimeId = "valid";
      newMessages.deliveryTimeId = "";
    }

    setFormState(newState);
    setFormMessages(newMessages);

    return valid;
  };

  const fetchCustomerInfo = (phoneNumber) => {
    try {
      console.log("Fetching customer info for phone number:...", phoneNumber);
      const customer = customers.find((item) => item.phoneNumber === phoneNumber);

      if (customer) {
        console.log("Customer found:", customer.fullName);
        setFormData((prev) => ({ ...prev, name: customer.fullName }));
        setFormState((prev) => ({ ...prev, name: "valid" }));
      } else {
        console.log("Customer not found.");
        setFormData((prev) => ({ ...prev, name: "" }));
        setFormState((prev) => ({ ...prev, name: "" }));
      }
    } catch (error) {
      console.error("Error fetching customer info:", error);
    }
  };

  const checkUserExists = (phoneNumber) => {
    console.log("Checking if user exists for phone number:", phoneNumber);
    const exists = customers.some((item) => item.phoneNumber === phoneNumber);
    console.log("User exists:", exists);
    return exists;
  };

  // Helper: parse lỗi từ backend response
  const getBackendErrorMessage = (error) => {
    if (error.response && error.response.data) {
      const data = error.response.data;
      // BE trả về { StatusCode: "Fail", message: "..." }
      if (data.message) return data.message;
      if (typeof data === "string") return data;
    }
    if (error.message) return error.message;
    return "Đã xảy ra lỗi khi tạo đơn hàng";
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoadingCircle(true);
      console.log("Form is valid, proceeding to submit...");

      const customerInfo = {
        fullName: formData.name,
        phoneNumber: formData.phone,
        buildingId: formData.building.value,
        isEnroll: false,
      };
      const token = localStorage.getItem("vhgp-token");
      try {
        const userExists = checkUserExists(customerInfo.phoneNumber);
        if (!userExists) {
          console.log("User does not exist, creating new user...");
          await createCustomer(customerInfo);
          setCustomers((prev) => [...prev, customerInfo]);
        }

        let order = {
          id: "string",
          phoneNumber: formData.phone,
          total: parseFloat(formData.total),
          storeId: formData.store.value,
          menuId: formData.menuId,
          buildingId: formData.building.value,
          customerNote: formData.noteOfCustomer,
          orderNote: formData.noteOfOrder,
          fullName: formData.name,
          shipCost: parseFloat(formData.shipCost),
          deliveryTimeId: formData.deliveryTimeId,
          serviceId: formData.serviceId.value,
          modeId: formData.serviceId.value === 1 ? "1" : "2",
          orderDetail: [
            {
              productId: "string",
              quantity: "1",
              price: parseFloat(formData.total)
            }
          ],
          payments: [
            {
              type: formData.paymentName.value,
            },
          ],
        };
        console.log("Order data:", order);

        const res = await createOrder(order);

        if (res.data) {
          setIsLoadingCircle(false);
          notify("Thêm mới thành công", "Success");
          resetFields();
        }
      } catch (error) {
        console.error("Error creating order or customer:", error);
        setIsLoadingCircle(false);
        const errMsg = getBackendErrorMessage(error);
        notify(errMsg, "Error");
      }
    }
  };

  const resetFields = () => {
    console.log("Resetting form fields...");
    setFormData({
      productInformation: "",
      timeReceived: "",
      timeDelivery: "",
      store: "",
      building: "",
      name: "",
      phone: "",
      total: "",
      shipCost: "",
      noteOfOrder: "",
      noteOfCustomer: "",
      paymentName: "",
      menuId: "",
      deliveryTimeId: "",
      serviceId: { label: "Giao hàng tiêu chuẩn", value: 0 },
      modeId: "string",
    });
  };

  const getSelectStyles = (isValid, isInvalid) => ({
    control: (provided, state) => ({
      ...provided,
      background: "#fff",
      borderColor: isInvalid ? "#fb6340" : isValid ? "#2dce89" : "#dee2e6",
      minHeight: "30px",
      height: "46px",
      boxShadow: state.isFocused
        ? "0 0 0 0.2rem rgba(50, 151, 211, 0.25)"
        : null,
      "&:hover": {
        borderColor: isInvalid ? "#fb6340" : isValid ? "#2dce89" : "#dee2e6",
      },
      borderRadius: "0.5rem",
    }),
    input: (provided) => ({
      ...provided,
      margin: "5px",
    }),
  });
  return (
    <>
      <SimpleHeader name="Tạo vận đơn" parentName="Quản Lý" />
      <Container className="mt--6" fluid>
        <Row>
          {/* Command Box */}
          <div className="col-md-12" style={{ marginBottom: "-10px" }}>
            <div className="form-group">
              <label className="form-control-label">
                Hộp lệnh
                <span style={{ color: "red" }}> * </span>
              </label>
              <span style={{ color: "grey", fontSize: "13px" }}>
                Mã cửa hàng_Thông tin sản phẩm_Số điện thoại_Mã toà nhà_Tổng tiền_Loại thanh toán_Ghi chú
              </span>
              <Input
                type="text"
                id="input-command-box"
                placeholder="Nhập command"
                value={commandBoxValue}
                onChange={handleCommandChange}
                className={commandBoxValueState === "invalid" ? "is-invalid" : ""}
              />
              {commandBoxValueState && (
                <div
                  className={commandBoxValueState === "valid" ? "valid" : "invalid"}
                  style={{
                    fontSize: "80%",
                    color: commandBoxValueState === "valid" ? "#2dce89" : "#fb6340",
                    marginTop: "0.25rem",
                  }}
                >
                  {commandBoxValueMessage}
                </div>
              )}
            </div>
          </div>
  
          <div className="col-lg-12">
            <Card>
              {/* TITLE ĐƠN HÀNG */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "10px 0px",
                }}
                className="align-items-center"
              >
                <CardHeader className="border-0" style={{ padding: "15px" }}>
                  <h2 className="mb-0">Thông tin đơn hàng</h2>
                </CardHeader>
              </div>
  
              {/* FORM NEW MENU */}
              <div className="col-md-12">
                <form>
                  <div className="row">
                    {/* Ghi chú của đơn hàng - thông tin sản phẩm*/}
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-control-label">
                          Ghi chú đơn hàng{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          valid={formState.noteOfOrder === "valid"}
                          invalid={formState.noteOfOrder === "invalid"}
                          className="form-control"
                          type="text"
                          value={formData.noteOfOrder}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, noteOfOrder: e.target.value }));
                            setFormState((prev) => ({ ...prev, noteOfOrder: "" }));
                          }}
                        />
                        {formState.noteOfOrder === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            {formMessages.noteOfOrder}
                          </div>
                        )}
                      </div>
                    </div>
  
                    {/* Time Received */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-control-label">
                          Thời gian nhận hàng dự kiến{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          valid={formState.timeReceived === "valid"}
                          invalid={formState.timeReceived === "invalid"}
                          className="form-control"
                          type="time"
                          value={formData.timeReceived}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, timeReceived: e.target.value }));
                            setFormState((prev) => ({ ...prev, timeReceived: "" }));
                          }}
                        />
                        {formState.timeReceived === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            {formMessages.timeReceived}
                          </div>
                        )}
                      </div>
                    </div>
  
                    {/* ESTIMATED DELIVERY TIME */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-control-label">
                          Thời gian giao hàng dự kiến{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          valid={formState.timeDelivery === "valid"}
                          invalid={formState.timeDelivery === "invalid"}
                          className="form-control"
                          type="time"
                          value={formData.timeDelivery}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, timeDelivery: e.target.value }));
                            setFormState((prev) => ({ ...prev, timeDelivery: "" }));
                          }}
                        />
                        {formState.timeDelivery === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            {formMessages.timeDelivery}
                          </div>
                        )}
                      </div>
                    </div>
  
                    {/* STORE */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-control-label">
                          Cửa hàng <span style={{ color: "red" }}>*</span>
                        </label>
                        <div className={`${formState.store === "invalid" && "error-select"}`}>
                          <Select
                            options={optionsStore}
                            placeholder="Cửa hàng"
                            styles={getSelectStyles(
                              formState.store === "valid",
                              formState.store === "invalid"
                            )}
                            value={formData.store}
                            onChange={(e) => {
                              setFormData((prev) => ({ ...prev, store: e }));
                              setFormState((prev) => ({ ...prev, store: "" }));
                            }}
                          />
                        </div>
                      </div>
                    </div>
  
                    {/* TOTAL (Giá trị đơn hàng chứa ship) */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-control-label">
                          Giá trị đơn hàng chưa tính phí dịch vụ{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          min={0}
                          valid={formState.total === "valid"}
                          invalid={formState.total === "invalid"}
                          className="form-control"
                          type="text"
                          id="example-search-input"
                          value={formData.total}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            setFormData((prev) => ({ ...prev, total: isNaN(value) ? "" : value.toString() }));
                            setFormState((prev) => ({ ...prev, total: "" }));
                          }}
                        />
                        <div className="invalid-feedback">{formMessages.total}</div>
                      </div>
                    </div>
  
                    {/* SHIP COST */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-control-label">
                          Phí dịch vụ <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          min={0}
                          valid={formState.shipCost === "valid"}
                          invalid={formState.shipCost === "invalid"}
                          className="form-control"
                          type="text"
                          id="example-search-input"
                          value={formData.shipCost}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            setFormData((prev) => ({ ...prev, shipCost: isNaN(value) ? "" : value.toString() }));
                            setFormState((prev) => ({ ...prev, shipCost: "" }));
                          }}
                        />
                        <div className="invalid-feedback">{formMessages.shipCost}</div>
                      </div>
                    </div>
  
                    {/* PAYMENT NAME */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-control-label">
                          Phương thức thanh toán{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <div className={`${formState.paymentName === "invalid" && "error-select"}`}>
                          <Select
                            options={optionsPaymentName}
                            placeholder="Thu hộ"
                            styles={getSelectStyles(
                              formState.paymentName === "valid",
                              formState.paymentName === "invalid"
                            )}
                            value={formData.paymentName}
                            onChange={(e) => {
                              setFormData((prev) => ({ ...prev, paymentName: e }));
                              setFormState((prev) => ({ ...prev, paymentName: "" }));
                            }}
                          />
                        </div>
                        {formState.paymentName === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            {formMessages.paymentName}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* TITLE System */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: "10px 0px",
                      }}
                      className="align-items-center"
                    >
                      <CardHeader className="border-0" style={{ padding: "15px" }}>
                        <h2 className="mb-0">Thông tin hệ thống</h2>
                      </CardHeader>
                    </div>

                    {/* SERVICE ID */}
                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="form-control-label">
                          Dịch vụ <span style={{ color: "red" }}>*</span>
                        </label>
                        <Select
                          options={[
                            { label: "Giao hàng tiêu chuẩn", value: 0 },
                            { label: "Giao hàng nhanh", value: 1 },
                          ]}
                          value={formData.serviceId}
                          onChange={(e) => setFormData((prev) => ({ 
                            ...prev, 
                            serviceId: e, 
                            menuId: "", 
                            deliveryTimeId: "" 
                          }))}
                          styles={getSelectStyles(true, false)}
                        />
                      </div>
                    </div>

                    {/* MENU SELECTION */}
                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="form-control-label">
                          Chọn Thực đơn <span style={{ color: "red" }}>*</span>
                        </label>
                        <Select
                          options={optionsMenu}
                          placeholder={isLoadingMenus ? "Đang tải..." : "Chọn thực đơn"}
                          isLoading={isLoadingMenus}
                          value={
                            formData.menuId
                              ? optionsMenu.find((opt) => opt.value === formData.menuId) || null
                              : null
                          }
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, menuId: e ? e.value : "" }));
                            setFormState((prev) => ({ ...prev, menuId: "" }));
                          }}
                          styles={getSelectStyles(true, false)}
                        />
                      </div>
                    </div>

                    {/* Delivery Time - Dropdown lấy từ API */}
                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="form-control-label">
                          Khung giờ giao hàng <span style={{ color: "red" }}>*</span>
                        </label>
                        <Select
                          options={optionsDeliveryTime}
                          placeholder={isLoadingDeliveryTime ? "Đang tải..." : "Chọn khung giờ"}
                          isLoading={isLoadingDeliveryTime}
                          value={
                            formData.deliveryTimeId
                              ? optionsDeliveryTime.find((opt) => opt.value === formData.deliveryTimeId) || null
                              : null
                          }
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, deliveryTimeId: e ? e.value : "" }));
                            setFormState((prev) => ({ ...prev, deliveryTimeId: "" }));
                          }}
                          styles={getSelectStyles(
                            formState.deliveryTimeId === "valid",
                            formState.deliveryTimeId === "invalid"
                          )}
                          isClearable
                        />
                        {formState.deliveryTimeId === "invalid" && (
                          <div style={{ fontSize: "80%", color: "#fb6340", marginTop: "0.25rem" }}>
                            {formMessages.deliveryTimeId}
                          </div>
                        )}
                        {!formData.deliveryTimeId && deliveryTimeList.length === 0 && !isLoadingDeliveryTime && formData.menuId && (
                          <div style={{ fontSize: "80%", color: "#fb6340", marginTop: "0.25rem" }}>
                            Không tìm thấy khung giờ cho menu này
                          </div>
                        )}
                      </div>
                    </div>
  
                    {/* TITLE Customer */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: "10px 0px",
                      }}
                      className="align-items-center"
                    >
                      <CardHeader className="border-0" style={{ padding: "15px" }}>
                        <h2 className="mb-0">Thông tin khách hàng </h2>
                      </CardHeader>
                    </div>
  
                    {/* FULL NAME */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-control-label">
                          Tên khách hàng <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          valid={formState.name === "valid"}
                          invalid={formState.name === "invalid"}
                          className="form-control"
                          type="search"
                          id="example-search-input"
                          value={formData.name}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, name: e.target.value }));
                            setFormState((prev) => ({ ...prev, name: "" }));
                          }}
                        />
                        {formState.name === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            {formMessages.name}
                          </div>
                        )}
                      </div>
                    </div>
  
                    {/* PHONE NUMBER */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-control-label">
                          Số điện thoại <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          valid={formState.phone === "valid"}
                          invalid={formState.phone === "invalid"}
                          className="form-control"
                          type="search"
                          id="example-search-input"
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, phone: e.target.value }));
                            setFormState((prev) => ({ ...prev, phone: "" }));
                          }}
                        />
                        {formState.phone === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            {formMessages.phone}
                          </div>
                        )}
                      </div>
                    </div>
  
                    {/* BUILDING */}
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-control-label">
                          Địa điểm giao <span style={{ color: "red" }}>*</span>
                        </label>
                        <div className={`${formState.building === "invalid" && "error-select"}`}>
                          <Select
                            options={optionsBuilding}
                            placeholder="Địa điểm giao"
                            styles={getSelectStyles(
                              formState.building === "valid",
                              formState.building === "invalid"
                            )}
                            value={formData.building}
                            onChange={(e) => {
                              setFormData((prev) => ({ ...prev, building: e }));
                              setFormState((prev) => ({ ...prev, building: "" }));
                            }}
                          />
                        </div>
                        {formState.building === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            {formMessages.building}
                          </div>
                        )}
                      </div>
                    </div>
  
                    {/* NOTE OF CUSTOMER */}
                    <div className="col-md-12">
                      <div className="form-group">
                        <label className="form-control-label">
                          Ghi chú của khách hàng
                        </label>
                        <textarea
                          rows={3}
                          className="form-control"
                          type="search"
                          id="example-search-input"
                          value={formData.noteOfCustomer}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, noteOfCustomer: e.target.value }));
                            setFormState((prev) => ({ ...prev, noteOfCustomer: "" }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* ACTION BUTTONS */}
                  <Col className="mt-3  text-md-right mb-4" lg="12" xs="5">
                    {/* CREATE BUTTON */}
                    <Button
                      onClick={handleSubmit}
                      className="btn-neutral"
                      color="default"
                      size="lg"
                      disabled={isLoadingCircle}
                      style={{
                        background: "var(--primary)",
                        color: "#000",
                        padding: "0.875rem 2rem",
                      }}
                    >
                      <div
                        className="flex"
                        style={{
                          alignItems: "center",
                          width: 99,
                          justifyContent: "center",
                        }}
                      >
                        {isLoadingCircle ? (
                          <Spinner
                            style={{
                              color: "#000",
                              height: 25,
                              width: 25,
                              margin: "auto",
                            }}
                          />
                        ) : (
                          "Tạo"
                        )}
                      </div>
                    </Button>
                  </Col>
                </form>
              </div>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
  
};
export default CreateOrder;
