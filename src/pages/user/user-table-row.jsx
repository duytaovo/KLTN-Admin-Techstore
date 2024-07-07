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

import Label from "src/components/label";
import Iconify from "src/components/iconify";
import { deleteUser, getUsers, updateUser } from "src/store/user/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { useNavigate } from "react-router-dom";
// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  name,
  avatarUrl,
  phoneNumber,
  email,
  gender,
  role,
  isVerified,
  status,
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
    if (confirm("Bạn có muốn disable người dùng không?")) {
      const res = await dispatch(deleteUser(id));
      unwrapResult(res);
      const d = res?.payload.data;
      if (d?.code !== 200) return toast.error(d?.message);
      await toast.success("Disable người dùng thành công  ");
      dispatch(getUsers({ pageNumber: page }));
    }
  };

  return (
    <>
      <TableRow
        className="overflow-scroll max-w-[90%]"
        hover
        tabIndex={-1}
        role="checkbox"
        selected={selected}
      >
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />
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
        </TableCell>

        <TableCell
          sx={{
            fontSize: "14px",
          }}
        >
          {phoneNumber}
        </TableCell>
        {/* <TableCell
          sx={{
            fontSize: "14px",
            width: "90px",
          }}
        >
          {email}
        </TableCell> */}
        <TableCell
          sx={{
            fontSize: "14px",
          }}
        >
          {gender === 1 ? "Nam" : "Nữ"}
        </TableCell>

        <TableCell
          sx={{
            fontSize: "14px",
          }}
        >
          {role === 5 ? "ADMIN" : "USER"}
        </TableCell>

        {/* <TableCell
          sx={{
            fontSize: "14px",
          }}
          align="center"
        >
          {isVerified ? "Yes" : "No"}
        </TableCell> */}

        <TableCell
          sx={{
            fontSize: "14px",
          }}
        >
          <Label color={(status === false && "error") || "success"}>
            {status === true ? "ACTIVE" : "DISABLED"}
          </Label>
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
          <IconButton
            sx={{
              borderRadius: "0",
            }}
            onClick={() => navigate(`/user/detail/${id}`)}
          >
            <Iconify icon="eva:edit-fill" />
            Edit
          </IconButton>
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: "error.main" }}>
          <IconButton onClick={handleDelete}>
            <Iconify icon="eva:trash-2-outline" />
            Delete
          </IconButton>
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  company: PropTypes.any,
  handleClick: PropTypes.func,
  isVerified: PropTypes.any,
  name: PropTypes.any,
  role: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.any,
};

