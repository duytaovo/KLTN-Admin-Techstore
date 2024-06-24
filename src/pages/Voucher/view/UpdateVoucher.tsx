import { yupResolver } from "@hookform/resolvers/yup";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Form, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "src/components/Input";
import path from "src/constants/path";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { ErrorResponse } from "src/types/utils.type";
import { schemaVoucher } from "src/utils/rules";
import { isAxiosUnprocessableEntityError } from "src/utils/utils";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRange } from "@mui/x-date-pickers-pro";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import {
  addVoucher,
  getDetailVoucher,
  getVouchers,
  updateVoucher,
} from "src/store/voucher/voucherSlice";
interface FormData {
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  // price: number;
  // discount: number;
  gift: string;
}

const UpdateVoucher: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    setError,
    register,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schemaVoucher),
  });
  const { voucherDetail } = useAppSelector((state) => state.voucher);
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [value, setValueDay] = useState<DateRange<Dayjs>>([
    dayjs(),
    dayjs(),
  ]);

  useEffect(() => {
    dispatch(getDetailVoucher(id));
  }, [id]);

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    setValue("name", voucherDetail?.name);
    setValue("code", voucherDetail?.code);
    setValue("startDate", voucherDetail?.startDate);
    setValue("endDate", voucherDetail?.endDate);
    setValue("price", voucherDetail?.price);
    // setValue("discount", voucherDetail?.discount);
    // setValue("gift", voucherDetail?.gift);
  }, [voucherDetail]);

  const onSubmit = handleSubmit(async (data) => {
    const body = JSON.stringify({
      name: data.name,
      code: data.code,
      startDate: value[0]?.format("YYYY-MM-DD") || null,
      endDate: value[1]?.format("YYYY-MM-DD") || null,
      price: data.price,
      discount: 0,
      gift: null,
    });

    try {
      setIsSubmitting(true);
      const res = await dispatch(updateVoucher({ id: id, body: body }));
      unwrapResult(res);
      const d = res?.payload?.data;
      // if (d?.code !== 200) return toast.error(d?.message);
      await toast.success("Cập nhật mã giảm giá thành công ");
      await dispatch(getVouchers({ pageNumber: 1 }));
      await navigate(path.voucher);
    } catch (error: any) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data;
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: "Server",
            });
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  });
  const onClickHuy = () => {
    reset();
  };

  return (
    <div className="bg-white shadow ">
      <h2 className="font-bold m-4 text-2xl">Cập nhật mã giảm giá</h2>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 700, padding: 6 }}
        autoComplete="off"
        noValidate
        onSubmitCapture={onSubmit}
      >
        <Form.Item
          label="Tên mã giảm giá"
          name="name"
          rules={[{ required: true }]}
        >
          <Input
            placeholder=""
            name="name"
            register={register}
            type="text"
            className=""
            errorMessage={errors.name?.message}
          />
        </Form.Item>
        <Form.Item label="Mã giảm giá" name="code" rules={[{ required: true }]}>
          <Input
            placeholder=""
            name="code"
            register={register}
            type="text"
            className=""
            errorMessage={errors.code?.message}
          />
        </Form.Item>
        <Form.Item label="Start-End" name="day" rules={[{ required: true }]}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              value={value}
              onChange={(newValue) => setValueDay(newValue)}
            />
          </LocalizationProvider>
        </Form.Item>
        <Form.Item label="Giá" name="price" rules={[{ required: true }]}>
          <Input
            placeholder=""
            name="price"
            register={register}
            type="number"
            className=""
            errorMessage={errors.price?.message}
          />
        </Form.Item>
        {/* <Form.Item
          label="Giảm giá"
          name="discount"
          rules={[{ required: true }]}
        >
          <Input
            placeholder=""
            name="discount"
            register={register}
            type="number"
            className=""
            errorMessage={errors.discount?.message}
          />
        </Form.Item> */}
        {/* <Form.Item label="Quà" name="gift">
          <Input
            placeholder=""
            name="gift"
            register={register}
            type="text"
            className=""
            // errorMessage={errors.gift?.message}
          />
        </Form.Item> */}
        <div className="flex justify-start">
          <Form.Item label="" className="ml-[115px] mb-2">
            <Button className="w-[100px]" onClick={onSubmit}>
              {isSubmitting ? "Loading..." : "Lưu"}
            </Button>
          </Form.Item>
          <Form.Item label="" className="ml-[50px] mb-2">
            <Button className="w-[100px]" onClick={onClickHuy}>
              Đặt lại
            </Button>
          </Form.Item>
          <Form.Item label="" className="ml-[50px] mb-2">
            <Button
              className="w-[100px]"
              onClick={() => {
                navigate(path.voucher);
              }}
            >
              Hủy
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default () => <UpdateVoucher />;

