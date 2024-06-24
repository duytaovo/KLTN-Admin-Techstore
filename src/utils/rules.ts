import type { RegisterOptions, UseFormGetValues } from "react-hook-form";
import * as yup from "yup";

type Rules = {
  [key in "email" | "password" | "confirm_password"]?: RegisterOptions;
};

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const parent = this.parent?.lstProductTypeAndPrice;

  if (parent[0]?.salePrice !== "" && parent[0]?.price !== "") {
    return Number(parent[0]?.price) >= Number(parent[0]?.salePrice);
  }
  if (parent[1]?.salePrice !== "" && parent[1]?.price !== "") {
    return Number(parent[1]?.price) >= Number(parent[1]?.salePrice);
  }
  if (parent[2]?.salePrice !== "" && parent[2]?.price !== "") {
    return Number(parent[2]?.price) >= Number(parent[2]?.salePrice);
  }
  if (parent[3]?.salePrice !== "" && parent[3]?.price !== "") {
    return Number(parent[3]?.price) >= Number(parent[3]?.salePrice);
  }

  return (
    parent[0]?.salePrice !== "" || parent[0]?.price !== ""
    // price1 !== "" ||
    // price2 !== "" ||
    // price3 ||
    // salePrice1 !== "" ||
    // salePrice2 !== "" ||
    // salePrice3 !== ""
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: "Email là bắt buộc",
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: "Email không đúng định dạng",
    },
    maxLength: {
      value: 160,
      message: "Độ dài từ 5 - 160 ký tự",
    },
    minLength: {
      value: 5,
      message: "Độ dài từ 5 - 160 ký tự",
    },
  },
  password: {
    required: {
      value: true,
      message: "Password là bắt buộc",
    },
    maxLength: {
      value: 160,
      message: "Độ dài từ 6 - 160 ký tự",
    },
    minLength: {
      value: 6,
      message: "Độ dài từ 6 - 160 ký tự",
    },
  },
  confirm_password: {
    required: {
      value: true,
      message: "Nhập lại password là bắt buộc",
    },
    maxLength: {
      value: 160,
      message: "Độ dài từ 6 - 160 ký tự",
    },
    minLength: {
      value: 6,
      message: "Độ dài từ 6 - 160 ký tự",
    },
    validate:
      typeof getValues === "function"
        ? (value) =>
            value === getValues("password") || "Nhập lại password không khớp"
        : undefined,
  },
});

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required("Nhập lại password là bắt buộc")
    .min(6, "Độ dài từ 6 - 160 ký tự")
    .max(160, "Độ dài từ 6 - 160 ký tự")
    .oneOf([yup.ref(refString)], "Nhập lại password không khớp");
};

export const schema = yup.object({
  phone: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .min(5, "Độ dài từ 5 - 160 ký tự")
    .max(160, "Độ dài từ 5 - 160 ký tự"),
  password: yup
    .string()
    .required("Password là bắt buộc")
    .min(6, "Độ dài từ 6 - 160 ký tự")
    .max(160, "Độ dài từ 6 - 160 ký tự"),
  confirm_password: handleConfirmPasswordYup("password"),
});

export const userSchema = yup.object({
  name: yup.string().max(160, "Độ dài tối đa là 160 ký tự"),
  avatar: yup.string().max(1000, "Độ dài tối đa là 1000 ký tự"),
  password: schema.fields["password"],
  new_password: schema.fields["password"],
  confirm_password: handleConfirmPasswordYup("new_password"),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const schemaAddUser = yup.object({
  gender: yup.number(),
  phoneNumber: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .min(10, "Độ dài từ 10 chữ số")
    .matches(
      /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
      "Số điện thoại không đúng định dạng",
    ),
  fullName: yup.string().required("Họ tên là bắt buộc"),
  email: yup
    .string()
    .required("Email là bắt buộc")
    .email("Email không đúng định dạng")
    .min(5, "Độ dài từ 5 - 160 ký tự")
    .max(160, "Độ dài từ 5 - 160 ký tự"),
  password: yup
    .string()
    .min(6, "Độ dài từ 6 - 160 ký tự")
    .max(160, "Độ dài từ 6 - 160 ký tự"),
  address: yup.string(),
  imageUrl: yup.string(),
});

export const schemaProductproduct = yup.object({
  brand: yup.string().required("Trường này là bắt buộc"),
  category: yup.string(),
  characteristic: yup.string().required("Trường này là bắt buộc"),
  name: yup.string().required("Trường này là bắt buộc"),
  description: yup.string().required("Trường này là bắt buộc"),
  design: yup.string().required("Trường này là bắt buộc"),
  dimension: yup.string().required("Trường này là bắt buộc"),
  mass: yup.string().required("Trường này là bắt buộc"),
  accessories: yup.string().required("Trường này là bắt buộc"),
  productStatus: yup.number(),
  ram: yup.string(),
  storageCapacity: yup.string(),
  launchTime: yup
    .number()
    .required("Năm là trường bắt buộc")
    .integer("Năm phải là số nguyên")
    .max(new Date().getFullYear(), "Năm không được lớn hơn năm hiện tại"),
  color: yup.string(),
  quantity: yup.string(),
  depotId: yup.string(),
  lstProductTypeAndPrice: yup.array().required("Trường này là bắt buộc"),
  files: yup.array(),
  "lstProductTypeAndPrice.0.ram": yup.string(),
  "lstProductTypeAndPrice.1.ram": yup.string(),
  "lstProductTypeAndPrice.2.ram": yup.string(),
  "lstProductTypeAndPrice.3.ram": yup.string(),
  "lstProductTypeAndPrice.4.ram": yup.string(),
  "lstProductTypeAndPrice.0.storageCapacity": yup.string(),
  "lstProductTypeAndPrice.1.storageCapacity": yup.string(),
  "lstProductTypeAndPrice.2.storageCapacity": yup.string(),
  "lstProductTypeAndPrice.3.storageCapacity": yup.string(),
  "lstProductTypeAndPrice.4.storageCapacity": yup.string(),
  "lstProductTypeAndPrice.0.color": yup.string(),
  "lstProductTypeAndPrice.1.color": yup.string(),
  "lstProductTypeAndPrice.2.color": yup.string(),
  "lstProductTypeAndPrice.3.color": yup.string(),
  "lstProductTypeAndPrice.4.color": yup.string(),
  "lstProductTypeAndPrice.0.price": yup.string().test({
    name: "price-not-allowed",
    message: "Giá khuyến mãi phải nhỏ hơn giá gốc",
    test: testPriceMinMax,
  }),
  "lstProductTypeAndPrice.1.price": yup.string().test({
    name: "price-not-allowed",
    message: "Giá khuyến mãi phải nhỏ hơn giá gốc",
    test: testPriceMinMax,
  }),
  "lstProductTypeAndPrice.2.price": yup.string().test({
    name: "price-not-allowed",
    message: "Giá khuyến mãi phải nhỏ hơn giá gốc",
    test: testPriceMinMax,
  }),
  "lstProductTypeAndPrice.3.price": yup.string().test({
    name: "price-not-allowed",
    message: "Giá khuyến mãi phải nhỏ hơn giá gốc",
    test: testPriceMinMax,
  }),
  "lstProductTypeAndPrice.4.price": yup.string().test({
    name: "price-not-allowed",
    message: "Giá khuyến mãi phải nhỏ hơn giá gốc",
    test: testPriceMinMax,
  }),
  "lstProductTypeAndPrice.0.salePrice": yup.string().test({
    name: "price-not-allowed",
    message: "Giá khuyến mãi phải nhỏ hơn giá gốc",
    test: testPriceMinMax,
  }),
  "lstProductTypeAndPrice.1.salePrice": yup.string().test({
    name: "price-not-allowed",
    message: "Giá khuyến mãi phải nhỏ hơn giá gốc",
    test: testPriceMinMax,
  }),
  "lstProductTypeAndPrice.2.salePrice": yup.string().test({
    name: "price-not-allowed",
    message: "Giá khuyến mãi phải nhỏ hơn giá gốc",
    test: testPriceMinMax,
  }),
  "lstProductTypeAndPrice.3.salePrice": yup.string().test({
    name: "price-not-allowed",
    message: "Giá khuyến mãi phải nhỏ hơn giá gốc",
    test: testPriceMinMax,
  }),
  "lstProductTypeAndPrice.4.salePrice": yup.string().test({
    name: "price-not-allowed",
    message: "Giá khuyến mãi phải nhỏ hơn giá gốc",
    test: testPriceMinMax,
  }),
  "lstProductTypeAndPrice.0.quantity": yup.string(),
  "lstProductTypeAndPrice.1.quantity": yup.string(),
  "lstProductTypeAndPrice.2.quantity": yup.string(),
  "lstProductTypeAndPrice.3.quantity": yup.string(),
  "lstProductTypeAndPrice.4.quantity": yup.string(),
  "lstProductTypeAndPrice.0.depot": yup.string(),
  "lstProductTypeAndPrice.1.depot": yup.string(),
  "lstProductTypeAndPrice.2.depot": yup.string(),
  "lstProductTypeAndPrice.3.depot": yup.string(),
  "lstProductTypeAndPrice.4.depot": yup.string(),
});

export const schemaVoucher = yup.object({
  name: yup.string().required("Tên là bắt buộc"),
  code: yup.string().required("Mã là bắt buộc"),
  startDate: yup.string(),
  endDate: yup.string(),
  price: yup.number(),
  discount: yup.number(),
  gift: yup.string(),
});

export const schemaBrand = yup.object({
  name: yup.string().required("Tên nhãn hiệu là bắt buộc"),
  address: yup.string(),
  imageUrl: yup.string(),
  slug: yup.string(),
});

export const schemaCategory = yup.object({
  name: yup.string().required("Tên danh mục là bắt buộc"),
  slug: yup.string(),
  parentCategoryId: yup.number(),
});

export type UserSchema = yup.InferType<typeof userSchema>;

export type Schema = yup.InferType<typeof schema>;

