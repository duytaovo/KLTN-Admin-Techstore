import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import ButtonMui from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Button, Form, Pagination, Upload } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useAppDispatch } from "src/hooks/useRedux";
import {
  getTemplateProduct,
  importProduct,
} from "src/store/product/productSlice";
import { useSearchParams } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import { useState } from "react";
import InputFile from "src/components/InputFile";
import { toast } from "react-toastify";

const steps = ["Download template", "Import template"];
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
export default function CustomStep({ setOpen }: any) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [excelFile, setExcelFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const productValue = searchParams.get("product");
  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // Assume you have the JSON response stored in a variable named 'responseData'

  // Function to trigger file download
  const downloadFile = async (url: string) => {
    // Create a temporary link element
    const link = document.createElement("a");
    link.href = url;

    // Specify the download attribute with a suggested filename
    link.download = "downloaded_file";

    // Append the link to the document
    document.body.appendChild(link);

    // Trigger a click on the link to start the download
    link.click();

    // Remove the link element from the document
    document.body.removeChild(link);
  };
  const onClickDownloadTemplate = async () => {
    if (productValue === "undefined") {
      toast.error("Vui lòng chọn sản phẩm");
      return;
    } else {
      const res = await dispatch(getTemplateProduct({ slug: productValue }));
      unwrapResult(res);
      downloadFile(res.payload.data?.data);
    }
  };

  const handleExcelFileChange = (event: any) => {
    setExcelFile(event.target.files[0]);
  };

  const handleZipFileChange = (event: any) => {
    setZipFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    if (excelFile) {
      formData.append("file", excelFile);
    } else {
      toast.warning("Cần chọn file excel");
      return;
    }
    // Kiểm tra và thêm tệp ZIP vào FormData
    if (zipFile) {
      formData.append("images", zipFile);
    }

    try {
      setIsSubmitting(true);
      const res = await dispatch(
        importProduct({ body: formData, params: productValue }),
      );
      unwrapResult(res);
      const d = res?.payload?.data;
      console.log(d);
      if (d?.code !== 200) return toast.error(d?.message);
      await toast.success("Nhập thành công ");
      setOpen(false);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <ButtonMui onClick={handleReset}>Reset</ButtonMui>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {activeStep === 0 ? (
            <Button
              onClick={onClickDownloadTemplate}
              type="primary"
              icon={<DownloadOutlined />}
              size="small"
              className="text-blue-500"
            >
              Tải template
            </Button>
          ) : (
            <div>
              <Form
                name="validate_other"
                {...formItemLayout}
                initialValues={{
                  "input-number": 3,
                  "checkbox-group": ["A", "B"],
                  rate: 3.5,
                  "color-picker": null,
                }}
                style={{ maxWidth: 600 }}
              >
                <Form.Item
                  name="files"
                  rules={[{ required: true }]}
                  label="Nhập file excel"
                >
                  {/* <Upload> */}
                  <div className="flex flex-col items-start justify-center">
                    <input
                      type="file"
                      accept=".xlsx"
                      onChange={handleExcelFileChange}
                    />

                    <button
                      className="text-red-500 border-red-300 border w-20 p-1 mt-3"
                      type="button"
                      onClick={() => {
                        setExcelFile(null);
                      }}
                    >
                      Xoá
                    </button>
                    <div className="mt-3 flex flex-col items-center text-red-500">
                      <div>Định dạng:.xlsx</div>
                    </div>
                  </div>
                  {/* </Upload> */}
                </Form.Item>
                <Form.Item
                  name="files"
                  label="Hình ảnh"
                  valuePropName="fileList"
                >
                  <div className="flex flex-col items-start ">
                    <input
                      type="file"
                      accept=".zip"
                      onChange={handleZipFileChange}
                    />
                    <button
                      className="text-red-500 border-red-300 border w-20 p-1 mt-3"
                      type="button"
                      onClick={() => {
                        setZipFile(null);
                      }}
                    >
                      Xoá
                    </button>
                    <div className="mt-3  flex flex-col items-center text-red-500">
                      <div>Định dạng:.Zip</div>
                    </div>
                    {/* {errors.images?.message} */}
                  </div>
                </Form.Item>
              </Form>
              <Form.Item label="" className="ml-[135px]">
                <Button
                  disabled={isSubmitting === true}
                  className="w-[100px]"
                  onClick={handleUpload}
                  type="default"
                >
                  {isSubmitting ? "Loading..." : "Lưu"}
                </Button>
              </Form.Item>
            </div>
          )}
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <ButtonMui
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </ButtonMui>
            <Box sx={{ flex: "1 1 auto" }} />
            <ButtonMui onClick={handleNext}>
              {activeStep === steps.length - 1 ? "" : "Next"}
            </ButtonMui>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}

