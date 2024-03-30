import axios from "axios";
import { useEffect, useState } from "react";
import { PATHS } from "./paths";
import config from "src/constants/configApi";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { unwrapResult } from "@reduxjs/toolkit";
import { getDetailUser, getUsers } from "src/store/user/userSlice";

const FETCH_TYPES = {
  CITIES: "FETCH_CITIES",
  DISTRICTS: "FETCH_DISTRICTS",
  WARDS: "FETCH_WARDS",
};

async function fetchLocationProvinceOptions(fetchType: string) {
  let url;
  let params;
  switch (fetchType) {
    case FETCH_TYPES.CITIES: {
      url = PATHS.CITIES;
      params = {};
      break;
    }
    default: {
      return [];
    }
  }
  const locations = (
    await axios.get(url, {
      params: params,
      headers: {
        "Content-Type": "application/json",
        token: config.tokenStore,
      },
    })
  ).data["data"];
  return locations.map(
    ({
      ProvinceID,
      ProvinceName,
    }: {
      ProvinceID: number;
      ProvinceName: string;
    }) => ({
      value: ProvinceID,
      label: ProvinceName,
    }),
  );
}
async function fetchLocationDistrictOptions(
  fetchType: string,
  locationId?: string,
) {
  let url;
  let params;
  switch (fetchType) {
    case FETCH_TYPES.CITIES: {
      url = PATHS.CITIES;
      params = {};
      break;
    }
    case FETCH_TYPES.DISTRICTS: {
      url = `${PATHS.DISTRICTS}`;
      params = { province_id: locationId };
      break;
    }
    case FETCH_TYPES.WARDS: {
      url = `${PATHS.WARDS}`;
      params = { district_id: locationId };
      break;
    }
    default: {
      return [];
    }
  }
  const locations = (
    await axios.get(url, {
      params: params,
      headers: {
        "Content-Type": "application/json",
        token: config.tokenStore,
      },
    })
  ).data["data"];
  return locations.map(
    ({
      DistrictID,
      DistrictName,
    }: {
      DistrictID: number;
      DistrictName: string;
    }) => ({
      value: DistrictID,
      label: DistrictName,
    }),
  );
}
async function fetchLocationWardOptions(
  fetchType: string,
  locationId?: string,
) {
  let url;
  let params;
  switch (fetchType) {
    case FETCH_TYPES.CITIES: {
      url = PATHS.CITIES;
      params = {};
      break;
    }
    case FETCH_TYPES.DISTRICTS: {
      url = `${PATHS.DISTRICTS}`;
      params = { province_id: locationId };
      break;
    }
    case FETCH_TYPES.WARDS: {
      url = `${PATHS.WARDS}`;
      params = { district_id: locationId };
      break;
    }
    default: {
      return [];
    }
  }

  const locations = (
    await axios.get(url, {
      params: params,
      headers: {
        "Content-Type": "application/json",
        token: config.tokenStore,
      },
    })
  ).data["data"];
  return locations.map(
    ({ WardCode, WardName }: { WardCode: number; WardName: string }) => ({
      value: WardCode,
      label: WardName,
    }),
  );
}

export async function fetchInitialData(address: any) {
  if (!address || address.length < 3) {
    return {
      cityOptions: [],
      districtOptions: [],
      wardOptions: [],
      selectedCity: null,
      selectedDistrict: null,
      selectedWard: null,
    };
  }

  const [cities, districts, wards] = await Promise.all([
    fetchLocationProvinceOptions(FETCH_TYPES.CITIES),
    fetchLocationDistrictOptions(FETCH_TYPES.DISTRICTS, address[2]),
    fetchLocationWardOptions(FETCH_TYPES.WARDS, address[1]),
  ]);

  const ward = address[0].toString();
  return {
    cityOptions: cities,
    districtOptions: districts,
    wardOptions: wards,
    selectedCity: cities.find((c: any) => c.value === address[2]),
    selectedDistrict: districts.find((d: any) => d.value === address[1]),
    selectedWard: wards.find((w: any) => w.value === ward),
  };
}

function useLocationForm(shouldFetchInitialLocation: boolean) {
  const [state, setState] = useState<any>({
    cityOptions: [],
    districtOptions: [],
    wardOptions: [],
    selectedCity: null,
    selectedDistrict: null,
    selectedWard: null,
  });

  const { userWithId } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { selectedCity, selectedDistrict }: any = state;
  const [part1Address, setPart1Address] = useState<any>();
  const [part2Address, setPart2Address] = useState<any>();
  const [part3Address, setPart3Address] = useState<any>();
  // //console.log(part3Address);
  // useEffect(() => {
  //   const _getData = async () => {
  //     const res = await dispatch(getUsers(""));
  //     await unwrapResult(res);
  //     await dispatch(getDetailUser(res?.payload?.data.data.id));
  //   };
  //   _getData();
  // }, []);

  useEffect(() => {
    const inputString = userWithId.address;

    if (inputString) {
      // Phần 1: từ đầu đến trước dấu ,
      const part1 = inputString.split(",")[0]?.trim();
      setPart1Address(part1);
      // Phần 2: từ dấu , đến dấu +
      const part2 = inputString
        .split(",")
        .slice(1)
        .join(",")
        .split("+")[0]
        .trim();
      setPart2Address(part2);

      // Phần 3: phần còn lại, bỏ vào mảng có 3 phần tử mỗi phần tử đã được ngăn cách bởi dấu -
      const remainingPart = inputString
        ?.split("+")[1]
        ?.split("-")
        .map((item: string) => Number(item.trim()));
      setPart3Address(remainingPart);
    }
  }, [userWithId]);

  const id1 = part3Address && part3Address[0];
  const id2 = part3Address && part3Address[1];
  const id3 = part3Address && part3Address[2];
  useEffect(() => {
    (async function () {
      if (shouldFetchInitialLocation) {
        const initialData = await fetchInitialData(part3Address);
        if (initialData?.cityOptions.length > 0) {
          setState(initialData);
        } else {
          const options = await fetchLocationProvinceOptions(
            FETCH_TYPES.CITIES,
          );
          setState({ ...state, cityOptions: options });
        }
      } else {
        const options = await fetchLocationProvinceOptions(FETCH_TYPES.CITIES);
        setState({ ...state, cityOptions: options });
      }
    })();
  }, [id1, id2, id3]);

  useEffect(() => {
    (async function () {
      if (!selectedCity) return;
      const options = await fetchLocationDistrictOptions(
        FETCH_TYPES.DISTRICTS,
        selectedCity.value,
      );
      setState({ ...state, districtOptions: options });
    })();
  }, [selectedCity]);

  useEffect(() => {
    (async function () {
      if (!selectedDistrict) return;
      const options = await fetchLocationWardOptions(
        FETCH_TYPES.WARDS,
        selectedDistrict.value,
      );
      setState({ ...state, wardOptions: options });
    })();
  }, [selectedDistrict]);

  function onCitySelect(option: any) {
    if (option !== selectedCity) {
      setState({
        ...state,
        districtOptions: [],
        wardOptions: [],
        selectedCity: option,
        selectedDistrict: null,
        selectedWard: null,
      });
    }
  }

  function onDistrictSelect(option: any) {
    if (option !== selectedDistrict) {
      setState({
        ...state,
        wardOptions: [],
        selectedDistrict: option,
        selectedWard: null,
      });
    }
  }

  function onWardSelect(option: any) {
    setState({ ...state, selectedWard: option });
  }

  function onSubmit(e: any) {
    e.preventDefault();
    const city = {
      name: state.selectedCity?.label,
      id: state.selectedCity?.value,
    };
    const district = {
      name: state.selectedDistrict?.label,
      id: state.selectedDistrict?.value,
    };
    const ward = {
      name: state.selectedWard?.label,
      id: state.selectedWard?.value,
    };
    localStorage.setItem("city", JSON.stringify(city));
    localStorage.setItem("district", JSON.stringify(district));
    localStorage.setItem("ward", JSON.stringify(ward));
  }

  return { state, onCitySelect, onDistrictSelect, onWardSelect, onSubmit };
}

export default useLocationForm;

