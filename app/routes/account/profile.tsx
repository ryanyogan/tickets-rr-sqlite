import { Heading } from "~/components/heading";
import { AccountTabs } from "./components/account-tabs";

export default function Profile() {
  return (
    <div className="flex-1 flex-col flex gap-y-8">
      <Heading
        title="Profile"
        description="Manage your profile settings"
        tabs={<AccountTabs />}
      />
    </div>
  );
}
