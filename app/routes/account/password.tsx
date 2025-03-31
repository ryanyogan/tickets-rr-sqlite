import { Heading } from "~/components/heading";
import { AccountTabs } from "./components/account-tabs";

export default function Password() {
  return (
    <div className="flex-1 flex-col flex gap-y-8">
      <Heading
        title="Password"
        description="Manage your password settings"
        tabs={<AccountTabs />}
      />
    </div>
  );
}
