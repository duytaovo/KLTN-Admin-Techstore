import { useEffect } from "react";
import useLocationForm from "./useLocationForm";
import Select from "react-select";

interface Props {
  onChange: (value: any) => void;
}

const LocationForm = ({ onChange }: Props) => {
  const { state, onCitySelect, onDistrictSelect, onWardSelect, onSubmit } =
    useLocationForm(true);
  const {
    cityOptions,
    districtOptions,
    wardOptions,
    selectedCity,
    selectedDistrict,
    selectedWard,
  } = state;
  useEffect(() => {
    // Gọi hàm onChange với giá trị mặc định khi component được render
    onChange &&
      onChange({
        ward: {
          name: selectedWard?.label,
          id: selectedWard?.value,
        },
        district: {
          name: selectedDistrict?.label,
          id: selectedDistrict?.value,
        },
        city: {
          name: selectedCity?.label,
          id: selectedCity?.value,
        },
      });
  }, [selectedWard, selectedDistrict, selectedCity]); // Thêm dependency rỗng để useEffect chỉ chạy một lần sau khi mount
  return (
    <div className="form-container my-8">
      <div className="select-container flex space-x-4">
        <Select
          name="cityId"
          key={`cityId_${selectedCity?.value}`}
          isDisabled={cityOptions.length === 0}
          options={cityOptions}
          onChange={(option) => onCitySelect(option)}
          placeholder="Tỉnh/Thành"
          defaultValue={selectedCity}
        />

        <Select
          name="districtId"
          key={`districtId_${selectedDistrict?.value}`}
          isDisabled={districtOptions.length === 0}
          options={districtOptions}
          onChange={(option) => onDistrictSelect(option)}
          placeholder="Quận/Huyện"
          defaultValue={selectedDistrict}
        />

        <Select
          name="wardId"
          key={`wardId_${selectedWard?.value}`}
          isDisabled={wardOptions.length === 0}
          options={wardOptions}
          placeholder="Phường/Xã"
          onChange={(option) => {
            onWardSelect(option);
            onChange({
              ward: {
                name: option.label,
                id: option.value,
              },
              district: {
                name: selectedDistrict.label,
                id: selectedDistrict.value,
              },
              city: {
                name: selectedCity.label,
                id: selectedCity.value,
              },
            });
          }}
          defaultValue={selectedWard}
        />
      </div>
    </div>
  );
};

export default LocationForm;

