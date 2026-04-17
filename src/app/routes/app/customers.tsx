import { Head } from "@/components/seo";
import { CustomersList } from "@/features/customers/components/customers-list";

const CustomersRoute = () => {
  return (
    <>
      <Head title="Customers" />
      <CustomersList />
    </>
  );
};

export const Component = CustomersRoute;
