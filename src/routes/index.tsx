import { lazy } from "react";
import path from "src/constants/path";

import { VoucherView } from "src/pages/Voucher/view";
import NewVoucher from "src/pages/Voucher/view/NewVoucher";
import UpdateVoucher from "src/pages/Voucher/view/UpdateVoucher";
import { BrandView } from "src/pages/brand-new/view";
import { AppView } from "src/pages/overview/view";
import { UserView } from "src/pages/user/view";

const TableFeedback = lazy(() => import("src/pages/Feedback"));
const Orders = lazy(() => import("src/pages/Order"));
const NotFound = lazy(() => import("src/pages/NotFound/NotFound"));
const AddUser = lazy(() => import("src/pages/ListUser/NewUser"));
const UpdateUser = lazy(() => import("src/pages/ListUser/UpdateUser"));
const Categorys = lazy(() => import("src/pages/Category"));
const Brands = lazy(() => import("src/pages/Brand"));

//Product
const ListProduct = lazy(
  () => import("src/pages/Product/List/Product/ListProduct"),
);
const NewProduct = lazy(() => import("src/pages/Product/Create/NewProduct"));
const UpdateProduct = lazy(
  () => import("src/pages/Product/Update/UpdateProduct"),
);
const ProductDetail = lazy(
  () => import("src/pages/Product/Detail/Product_Detail"),
);

const UpdateBrand = lazy(() => import("src/pages/Brand/UpdateBrand"));
const UpdateCategory = lazy(() => import("src/pages/Category/UpdateCategory"));
const NewCategory = lazy(() => import("src/pages/Category/NewCategory"));
const NewBrand = lazy(() => import("src/pages/Brand/NewBrand"));

export const routeMain = [
  {
    path: path.home,
    Component: AppView,
  },

  {
    path: path.orders,
    Component: Orders,
  },
  {
    path: path.voucher,
    Component: VoucherView,
  },
  {
    path: path.voucherNew,
    Component: NewVoucher,
  },
  {
    path: path.voucherDetail,
    Component: UpdateVoucher,
  },
  {
    path: path.users,
    Component: UserView,
  },

  {
    path: path.usersDetail,
    Component: UpdateUser,
  },
  {
    path: path.usersNew,
    Component: AddUser,
  },
  {
    path: path.products,
    Component: ListProduct,
  },
  {
    path: path.productNew,
    Component: NewProduct,
  },
  {
    path: path.productDetail,
    Component: ProductDetail,
  },
  {
    path: path.productUpdate,
    Component: UpdateProduct,
  },

  {
    path: path.categories,
    Component: Categorys,
  },
  {
    path: path.category,
    Component: UpdateCategory,
  },
  {
    path: path.categoryNew,
    Component: NewCategory,
  },
  {
    path: path.brand,
    Component: BrandView,
  },
  {
    path: path.brandDetail,
    Component: UpdateBrand,
  },
  {
    path: path.brandNew,
    Component: NewBrand,
  },

  {
    path: path.feedback,
    Component: TableFeedback,
  },

  {
    path: "*",
    Component: NotFound,
  },
];
const urls: string[] = [
  "product/detail/:productSlug",
  "laptop/detail/:productSlug",
  "tablet/detail/:productSlug",
  "watch/detail/:productSlug",
  "man-hinh-may-tinh/detail/:productSlug",
  "may-tinh-de-ban/detail/:productSlug",
  "accessory/detail/:productSlug",
  "smartwatch/detail/:productSlug",
  "ram/detail/:productSlug",
  "rom/detail/:productSlug",
  "processor/detail/:productSlug",
  "graphics-card/detail/:productSlug",
  "mouse/detail/:productSlug",
  "loudspeaker/detail/:productSlug",
  "adapter/detail/:productSlug",
  "microphone/detail/:productSlug",
  "keyboard/detail/:productSlug",
  "radiator/detail/:productSlug",
  "computer-case/detail/:productSlug",
  "mainboard/detail/:productSlug",
  "monitor/detail/:productSlug",
  "computer-power/detail/:productSlug",
];

const urlsAccess: string[] = [
  "/smartphone",
  "/laptop/:productSlug",
  "/tablet/:productSlug",
  "/smartwatch/:productSlug",
  "/ram/:productSlug",
  "/rom/:productSlug",
  // "/card_graphic/:productSlug",
  "/laptop/:productSlug",
  "/smartwatch/:productSlug",
  "/tablet/:productSlug",
  "/processor/:productSlug",
  "/graphics-card/:productSlug",
  "/mouse/:productSlug",
  // "/loudspeaker/:productSlug",
  "/adapter/:productSlug",
  // "/backup-charger/:productSlug",
  // "/microphone/:productSlug",
  "/radiator/:productSlug",
  "/keyboard/:productSlug",
  "/earphone/:productSlug",
  "/mainboard/:productSlug",
  "/computer-case/:productSlug",
  "/monitor/:productSlug",
  "/computer-power/:productSlug",
];

export const productDetailRoutes = urls.map((url) => ({
  path: url,
  Component: ProductDetail,
}));
export const accessRoutes = urlsAccess.map((url) => ({
  path: url,
  Component: ListProduct,
}));

