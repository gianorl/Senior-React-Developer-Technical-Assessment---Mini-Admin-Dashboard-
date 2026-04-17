export type CustomerStatus = "active" | "suspended" | "inactive";

export type PaymentStatus = "paid" | "overdue" | "pending";

export type ServicePackage = "basic" | "standard" | "premium";

export type CustomerAddress = {
  street: string;
  city: string;
  district: string;
  subDistrict: string;
  province: string;
  postalCode: string;
};

export type Customer = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  nationalId: string;
  address: CustomerAddress;
  customerId: string;
  servicePackage: ServicePackage;
  downloadSpeed: number;
  uploadSpeed: number;
  ipAddress: string;
  macAddress: string;
  status: CustomerStatus;
  joinDate: string;
  contractEndDate: string;
  monthlyFee: number;
  paymentStatus: PaymentStatus;
  lastPaymentDate: string;
  dueDate: string;
};

export type CustomerMetricFilter = "all" | "active" | "suspended" | "overdue";

export type CustomerQueryParams = {
  page: number;
  limit: number;
  search?: string;
  sortBy?: keyof Customer;
  sortOrder?: "asc" | "desc";
  metricFilter?: CustomerMetricFilter;
};
