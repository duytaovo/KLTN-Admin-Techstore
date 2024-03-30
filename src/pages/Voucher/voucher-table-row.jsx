import { useState } from "react";
import PropTypes from "prop-types";

import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import Iconify from "src/components/iconify";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { useAppDispatch } from "src/hooks/useRedux";
import { useNavigate } from "react-router-dom";
import { deleteVoucher, getVouchers } from "src/store/voucher/voucherSlice";

// ----------------------------------------------------------------------

export default function VoucherTableRow({
  selected,
  name,
  code,
  startDate,
  endDate,
  price,
  discount,
  gift,
  handleClick,
  id,
  page,
}) {
  const [open, setOpen] = useState(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleDelete = async () => {
    if (confirm("Bạn có muốn xoá voucher không?")) {
      const res = await dispatch(deleteVoucher(id));
      unwrapResult(res);
      const d = res?.payload.data;
      if (d?.code !== 200) return toast.error(d?.message);
      await toast.success("Xoá voucher thành công  ");
      dispatch(getVouchers({ pageNumber: page }));
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        {/* <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography
              sx={{
                fontSize: "13px",
              }}
              variant="subtitle2"
              noWrap
            >
              {name}
            </Typography>
          </Stack>
        </TableCell> */}
        <TableCell
          sx={{
            fontSize: "14px",
          }}
        >
          {name}
        </TableCell>
        <TableCell
          sx={{
            fontSize: "14px",
          }}
        >
          {code}
        </TableCell>
        <TableCell
          sx={{
            fontSize: "14px",
          }}
        >
          {startDate}
        </TableCell>
        <TableCell
          sx={{
            fontSize: "14px",
          }}
        >
          {endDate}
        </TableCell>
        <TableCell
          sx={{
            fontSize: "14px",
          }}
        >
          {price}
        </TableCell>
        <TableCell
          sx={{
            fontSize: "14px",
          }}
        >
          {discount}
        </TableCell>
        <TableCell
          sx={{
            fontSize: "14px",
          }}
        >
          {gift}
        </TableCell>
        <TableCell
          sx={{
            fontSize: "14px",
          }}
          align="right"
        >
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <IconButton onClick={() => navigate(`/voucher/detail/${id}`)}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Edit
          </IconButton>
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: "error.main" }}>
          <IconButton onClick={handleDelete}>
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Delete
          </IconButton>
        </MenuItem>
      </Popover>
    </>
  );
}

VoucherTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  company: PropTypes.any,
  handleClick: PropTypes.func,
  isVerified: PropTypes.any,
  name: PropTypes.any,
  role: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.any,
};

