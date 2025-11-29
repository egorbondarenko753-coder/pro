import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Страница не найдена
          </p>
          <Link to="/">
            <Button className="btn-primary">
              <Home className="mr-2 h-4 w-4" />
              На главную
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
