import { getAccountByName } from "@kubiklabs/wasmkit";

import { AccessControlContract } from "../artifacts/typescript_schema/AccessControlContract";

export default async function run () {
  const runTs = String(new Date());
  const contract_owner = await getAccountByName("account_0");
  const another_account = await getAccountByName("account_1");
  const contract = new AccessControlContract();
  await contract.setupClient();

 const deploy_response = await contract.deploy(
    contract_owner,
  );
  console.log(deploy_response);

  const contract_info = await contract.instantiate(
    {"count": 102},
    `deploy test ${runTs}`,
    contract_owner,
    undefined,  // transferAmount
    // customFees, You add here
  );
  console.log(contract_info);

  // increment from another account is allowed
  const inc_response = await contract.increment(
    {account: another_account},
  );
  console.log(inc_response);

  const count_response = await contract.getCount();
  console.log(count_response);

  // reset any from another account is allowed (should be checked at compile level)
  const reset_response_2 = await contract.resetAny(
    {account: another_account},
    {
      count: 10,
    },
  );
  console.log(reset_response_2);

  // reset from another account is not allowed
  const reset_response_1 = await contract.reset(
    {account: another_account},
    {
      count: 10,
    },
  );
  console.log(reset_response_1);
}
