"use client";

import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

import { ResultTable } from "@/app/ui/table";
import { Vehicle } from "@/app/ui/table";

interface searchQuery {
  vehicleId: string;
  licensePlate: string;
  status: string;
  vehicleType: string;
}

// type Vehicle = {
//   id: number;
//   vehicleId: string;
//   licensePlate: string;
//   status: string;
//   vehicleType: string;
//   createdAt: string;
//   updatedAt: string;
//   // vehicleOwner: User;
// };

const statusOptions = [
  { label: "All", value: "" },
  { label: "Active", value: "active" },
  { label: "Expire", value: "expire" },
  { label: "Inactive", value: "inactive" },
  { label: "No Toll Tag", value: "null" },
];

const vehicleTypeOptions = [
  { label: "All", uid: "all", value: "" },
  { label: "Car", uid: "car", value: "car" },
  { label: "Bus", uid: "bus", value: "bus" },
  { label: "Minibus", uid: "minibus", value: "minibus" },
  { label: "Truck", uid: "truck", value: "truck" },
  { label: "Van", uid: "van", value: "van" },
  { label: "Motorcycle", uid: "motorcycle", value: "motorcycle" },
];

const columns = [
  { name: "ID", uid: "id", sortable: true },
  // { name: "NAME", uid: "name", sortable: true },
  { name: "VEHICLE TYPE", uid: "vehicleType", sortable: false },
  { name: "LICENSE PLATE NUMBER", uid: "licensePlateNumber", sortable: true },
  { name: "STATUS", uid: "status", sortable: false },
  { name: "TOLL TAG ID", uid: "tollTagId", sortable: false },
  { name: "ACTIVATION DATE", uid: "activationDate", sortable: false },
  { name: "EXPIRED DATE", uid: "expiredDate", sortable: false },
  { name: "ACTIONS", uid: "actions", sortable: false },
];

export default function VehiclePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setsearchQuery] = useState<searchQuery>({
    vehicleId: searchParams.get("vehicleId") ?? "",
    licensePlate: searchParams.get("licensePlate") ?? "",
    status: searchParams.get("status") ?? "",
    vehicleType: searchParams.get("vehicleType") ?? "",
  });
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setsearchQuery((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange =
    (name: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      setsearchQuery((prev) => ({ ...prev, [name]: e.target.value }));
    };

  const handleSearch = useCallback(
    (e: { preventDefault: () => void }) => {
      e.preventDefault();
      const params = new URLSearchParams();

      for (const [key, value] of Object.entries(searchQuery)) {
        if (value) {
          params.set(key, value);
        }
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [searchQuery, router, pathname]
  );

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get("http://localhost:5115/api/Vehicle", {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        });

        if (!response.data) {
          throw new Error("Network response was not ok");
        }

        setVehicles(response.data);
      } catch (err) {
        console.log(err);
        // if (err instanceof Error) {
        //   setError(err.message);
        // } else {
        //   setError("An unknown error occurred");
        // }
        // } finally {
        //   setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <div>
      <Card className="max-w-full mx-auto">
        <CardHeader className="py-4 px-4 flex-col items-start bg-primary">
          <h2 className="text-2xl font-bold text-secondary mb-2">
            Vehicle Search Query
          </h2>
          <p className="text-tiny text-white/60">
            Find vehicles by ID, license plate, status, or type
          </p>
        </CardHeader>
        <CardBody>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={handleSearch}
          >
            <Input
              label="Vehicle ID"
              name="vehicleId"
              placeholder="Enter vehicle ID"
              value={searchQuery.vehicleId}
              onChange={handleInputChange}
            />
            <Input
              label="License Plate Number"
              name="licensePlate"
              placeholder="Enter license plate"
              value={searchQuery.licensePlate}
              onChange={handleInputChange}
            />
            <Select
              className="max-w-xs"
              label="Status"
              placeholder="Select status"
              value={searchQuery.status}
              onChange={handleSelectChange("status")}
            >
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </Select>
            <Select
              className="max-w-xs"
              label="Vehicle Type"
              placeholder="Select vehicle type"
              value={searchQuery.vehicleType}
              onChange={handleSelectChange("vehicleType")}
            >
              {vehicleTypeOptions.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </Select>
            <Button
              className="col-span-full text-secondary"
              color="primary"
              startContent={
                <FaSearch className="mr-2 h-4 w-4 text-secondary" />
              }
              type="submit"
            >
              Search Vehicle
            </Button>
          </form>
        </CardBody>
      </Card>
      <span className="m-5" />
      <ResultTable
        columns={columns}
        statusOptions={statusOptions}
        vehicleTypeOptions={vehicleTypeOptions}
        vehicles={vehicles}
      />
    </div>
  );
}
