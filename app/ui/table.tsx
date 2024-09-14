import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
} from "@nextui-org/react";
import { FaAngleDown, FaPlus } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";

import { SearchIcon } from "@/components/icons";
import { capitalize } from "@/components/utils";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  inactive: "danger",
  expire: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "vehicleType",
  "licensePlateNumber",
  "status",
  "tollTagId",
  "activationDate",
  "expiredDate",
  "actions",
];

interface User {
  id: number;
  name: string;
  role: string;
  team: string;
  status: string;
  age: string;
  avatar: string;
  email: string;
}

export interface Vehicle {
  id: number;
  vehicleType: string;
  licensePlateNumber: string;
  vehicleOwnerId: string;
  tollTag: {
    id: number;
    activationDate: Date;
    expiredDate: Date;
    status: string;
    vehicleId: number;
  };
}

interface Columns {
  name: string;
  uid: string;
  sortable: boolean | undefined;
}

interface VehicleType {
  uid: string;
  label: string;
  value: string;
}

interface StatusType {
  label: string;
  value: string;
}

export const ResultTable = ({
  vehicles,
  columns,
  vehicleTypeOptions,
  statusOptions,
}: {
  vehicles: Vehicle[] | [];
  columns: Columns[];
  vehicleTypeOptions: VehicleType[];
  statusOptions: StatusType[];
}) => {
  console.log(vehicles);

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  const [vehicleTypeFilter, setVehicleTypeFilter] =
    React.useState<Selection>("all");
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column: any) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredVehicles = [...vehicles];
    console.log(statusFilter, vehicleTypeFilter);
    if (hasSearchFilter) {
      filteredVehicles = filteredVehicles.filter((item) =>
        item.licensePlateNumber
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredVehicles = filteredVehicles.filter((vehicle) =>
        Array.from(statusFilter).includes(vehicle.tollTag?.status)
      );
    }
    if (
      vehicleTypeFilter !== "all" &&
      Array.from(vehicleTypeFilter).length !== vehicleTypeOptions.length
    ) {
      filteredVehicles = filteredVehicles.filter((vehicle) =>
        Array.from(vehicleTypeFilter).includes(vehicle.vehicleType)
      );
    }

    return filteredVehicles;
  }, [vehicles, filterValue, statusFilter, vehicleTypeFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Vehicle, b: Vehicle) => {
      const first = a[sortDescriptor.column as keyof Vehicle] as number;
      const second = b[sortDescriptor.column as keyof Vehicle] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (vehicle: Vehicle, columnKey: React.Key) => {
      const cellValue = vehicle[columnKey as keyof Vehicle];

      switch (columnKey) {
        case "tollTagId":
          return (
            <p className="text-bold text-small text-center capitalize">
              {vehicle.id}
            </p>
          );
        case "activationDate":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitaliz text-center">
                {new Date(vehicle.tollTag?.activationDate).toLocaleDateString()}
              </p>
              <p className="text-bold text-tiny capitalize text-default-400 text-center">
                {new Date(vehicle.tollTag?.activationDate).toLocaleTimeString()}
              </p>
            </div>
          );
        case "expiredDate":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize text-center">
                {new Date(vehicle.tollTag?.expiredDate).toLocaleDateString()}
              </p>
              <p className="text-bold text-tiny capitalize text-default-400 text-center">
                {new Date(vehicle.tollTag?.expiredDate).toLocaleTimeString()}
              </p>
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[vehicle.tollTag?.status]}
              size="sm"
              variant="flat"
            >
              {vehicle.tollTag?.status || "N/A"}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <HiDotsVertical className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem>View</DropdownItem>
                  <DropdownItem>Edit</DropdownItem>
                  <DropdownItem>Delete</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          if (typeof cellValue !== "object") return cellValue;

          return "N/A";
      }
    },
    []
  );

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by license plate number..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<FaAngleDown className="text-small" />}
                  variant="flat"
                >
                  Vehicle Type
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={vehicleTypeFilter}
                selectionMode="multiple"
                onSelectionChange={setVehicleTypeFilter}
              >
                {vehicleTypeOptions.map((vehicleType: VehicleType) => (
                  <DropdownItem key={vehicleType.label} className="capitalize">
                    {capitalize(vehicleType.label)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<FaAngleDown className="text-small" />}
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((statusType: StatusType) => (
                  <DropdownItem key={statusType.value} className="capitalize">
                    {capitalize(statusType.label)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<FaAngleDown className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" endContent={<FaPlus />}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {vehicles.length} vehicles
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    vehicleTypeFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    vehicles.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <Table
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[480px]",
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No vehicles found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
