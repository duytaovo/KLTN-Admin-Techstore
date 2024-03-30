export type productDetail = {
  productId: number;
  productCode: string;
  name: string;
  description: string;
  design: string;
  dimension: string;
  mass: number;
  launchTime: number;
  accessories: string;
  productStatus: number;
  lstProductTypeAndPrice: {
    typeId: number;
    ram: string;
    storageCapacity: string;
    color: string;
    price: number;
    salePrice: number;
    quantity: number;
    depotId: number;
  }[];
  lstProductImageUrl: string[];
  star: number;
  totalReview: number;
  lstProductAttribute: {
    productAttributeId: number;
    name: string;
    nameVn: string;
    value: string;
  }[];
  brandId: number;
  brandName: string;
  brandImages: string;
  characteristicId: number;
  characteristicName: string;
  categoryId: number;
  categoryName: string;
  slug: string;
};

export type Listproduct = {
  productId: number;
  name: string;
  lstImageUrl: string[];
  lstProductTypeAndPrice: {
    typeId: number;
    ram: string;
    storageCapacity: string;
    color: string;
    price: number;
    salePrice: number;
  }[];
  star: number;
  totalReview: number;
  slug: string;
};

