import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import type { SxProps } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import dayjs from "dayjs";

const statusMap = {
  pending: { label: "Pending", color: "warning" },
  delivered: { label: "Delivered", color: "success" },
  refunded: { label: "Refunded", color: "error" },
} as const;

export interface Order {
  id: number;
  nameReceiver: string;
  phoneReceiver: string;
  addressReceiver: string;
  message: string;
  orderPrice: number;
  deliveryPrice: number;
  discount: number;
  finalPrice: number;
  orderStatus: number;
  orderStatusString: string;
  buyDate: string;
  paymentStatus: number;
  paymentStatusString: string;
  paymentMethod: string;
  userId: number;
  orderDetails: never[];
}

export interface LatestOrdersProps {
  orders?: any[];
  sx?: SxProps;
}

export function LatestOrders({
  orders = [],
  sx,
}: LatestOrdersProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardHeader title="Đơn hàng mới nhất" />
      <Divider />
      <Box sx={{ overflowX: "auto" }}>
        <Table sx={{}}>
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell sortDirection="desc">Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.slice(0, 6).map((order) => {
              return (
                <TableRow hover key={order.id}>
                  <TableCell>{order.userId}</TableCell>
                  <TableCell>{order.nameReceiver}</TableCell>
                  <TableCell>
                    {dayjs(order.buyDate).format("MMM D, YYYY")}
                  </TableCell>
                  <TableCell>
                    <Chip label={order.orderStatusString} size="small" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      {/* <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions> */}
    </Card>
  );
}

