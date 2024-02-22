import { useState } from "react";
import DemoSignalWire from "./DemoSignalWire";

const users = [
  {
    name: "/private/niravtwo",
    token:
      "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwidHlwIjoiU0FUIn0..S5AKNdmzFF3R9stQ.vNPhBz2J-hyRrFhJpTBeBMl6MAKpV6AoOqDqt6bCfGa3lZtKpePVZa4jJ1UJqv85LtJAgk5jKxhyt3P-J4Gk7VrnvMbWBDekjFsVaaWbVHCKSRQ_KBqY7MgDnGODqFpzBEE_sdBvukT3BH3KLBJ58LVgAxGXhQG4uWqcdr7loGu3X-gVag03J0fmqNcH6mH40dbfwcM7RGuBrAmlsyeRm6tXeLdXxpEveHrU_01H3YxZajgHwqyilseptYSm9RDnsImdH1EewulbzDTaP8h4vgYFgG1Z1dNllyQWC5CvR2gRDnFGwXKXQnWbtQ7szofvhTckZM7fSMEhxD11zO6s8_wuduiqbBC0P2Yaxeudnk14IOGqsmGsSr0USPu2KXiIH9McNERKqErM0KAGn_rqfzuNu4YW9dr-PPAoE1256zzZqb4aFT8CpruJgvHbBErZWJlrI3_0WzNKAURBJwz0eAKEzscDPVGuzHHd8VYXaiSF.IMxBK6YmK71rTuRhaEa9Ng",
  },
  {
    name: "/private/nirav",
    token:
      "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwidHlwIjoiU0FUIn0..CjJioTxLyjhoxAwQ.A03BI1AgQt9oLRyDk92DWi7ipbDx2JxS6R6tVZE4rmreGsc1f_f5iO427VNI8mZSoG11Lh7tj6wuxD2JihTJRjzofat4tHjrhKPobTIovs2Zoze7FC4dVAR0qubeLt-Na0DBfZWAi6M2Gxz5cvo8tgNmahwaisko8Sz7rhDL11PVkZwksBCXnSyhVPdT8nwhd37GhiLm99LRRNuypLP927GiYcSR4csVrQEhfJT5Rj5lLcCjMXDBVdGUw5JkX7b-7x16VfLjl0cstUqJkbiImTTPC4EF7kCs1FFoOj-prplkwLoC9JLq65x9yrXI5SXVO1duxaWgpPbYLdE6gZA2JKDvD021StrNnKI4F6OwsqiTYFlWkE2Ir7hLzgioEHTE7j1-W2CztojuGbpPRvYupkM1oiANBc9toQgv3ZHfpYqa-Gk9JvoDHZZ_BZSQtD0Emr6vHh6E3x4T_RGuClDMrZZnLpoEl2ZjlDbXZMKmCd_a.Bm8-2K40w6PcwwaZbct-sA",
  },
];
export default function IntroDemoSignalWire() {
  const [selectedUser, setSelectedUser] = useState<null | typeof users[0]>(
    null
  );

  if (selectedUser !== null)
    return (
      <DemoSignalWire
        fabricToken={selectedUser.token}
        username={selectedUser.name}
      />
    );

  return (
    <div>
      <h2>Select which user to login as:</h2>
      {users.map((user) => (
        <div key={user.name}>
          <button
            onClick={() => {
              setSelectedUser(user);
            }}
          >
            {user.name}
          </button>
          <br />
        </div>
      ))}
    </div>
  );
}
