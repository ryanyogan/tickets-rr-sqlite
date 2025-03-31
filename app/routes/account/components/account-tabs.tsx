import { Link, useLocation } from "react-router";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { accountPasswordPath, accountProfilePath } from "~/paths";

export function AccountTabs() {
  const { pathname } = useLocation();

  return (
    <Tabs value={pathname.split("/").at(-1)}>
      <TabsList>
        <TabsTrigger value="profile" asChild>
          <Link to={accountProfilePath()}>Profile</Link>
        </TabsTrigger>
        <TabsTrigger value="password" asChild>
          <Link to={accountPasswordPath()}>Password</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
