import { Link } from "@/components/ui/link";
import { paths } from "@/config/paths";

const NotFoundRoute = () => {
  return (
    <div className="mt-52 flex flex-col items-center font-semibold">
      <h1 className="text-4xl">404 - Not Found</h1>
      <p className="mt-2 text-muted-foreground">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link to={paths.home.getHref()} replace className="mt-4 text-blue-600 hover:text-blue-500">
        Go to Home
      </Link>
    </div>
  );
};

export const Component = NotFoundRoute;
