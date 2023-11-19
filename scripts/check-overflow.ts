import { getAccountByName } from "@kubiklabs/wasmkit";

import { OverflowContract } from "../artifacts/typescript_schema/OverflowContract";

export default async function run () {
  const runTs = String(new Date());
  const contract_owner = await getAccountByName("account_0");
  const contract = new OverflowContract();
  await contract.setupClient();

 const deploy_response = await contract.deploy(
    contract_owner,
  );
  console.log(deploy_response);

  const contract_info = await contract.instantiate(
    {"count": 102, "sum": 0},
    `deploy test ${runTs}`,
    contract_owner,
    undefined,  // transferAmount
    // customFees, You add here
  );
  console.log(contract_info);

  // will not overflow
  const add_response_1 = await contract.add(
    {account: contract_owner},
    {
      one: 10,
      two: 20,
    },
  );
  console.log(add_response_1);

  const sum_response_1 = await contract.getSum();
  console.log(sum_response_1);

  // will overflow
  const add_response_2 = await contract.add(
    {account: contract_owner},
    {
      one: 2147483640,  // i32 max value: 2147483647
      two: 2147483640,
    },
  );
  console.log(add_response_2);

  const sum_response_2 = await contract.getSum();
  console.log(sum_response_2);
}
