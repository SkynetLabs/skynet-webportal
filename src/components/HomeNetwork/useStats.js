import { useEffect, useState } from "react";
import axios from "axios";

export const AVAILABLE_STATS = {
  ONLINE_HOSTS_COUNT: "onlineHostsCount",
  STORAGE_USED_TB: "storageUsedTB",
  NETWORK_CAPACITY_TB: "networkCapacityTB",
  STORAGE_COST_USD: "storageCostUSD",
  BANDWIDTH_DOWN_COST_USD: "bandwidthDownCostUSD"
};

export default function useStats() {
  const [stats, setStats] = useState({
    [AVAILABLE_STATS.ONLINE_HOSTS_COUNT]: null,
    [AVAILABLE_STATS.STORAGE_USED_TB]: null,
    [AVAILABLE_STATS.NETWORK_CAPACITY_TB]: null,
    [AVAILABLE_STATS.STORAGE_COST_USD]: null,
    [AVAILABLE_STATS.BANDWIDTH_DOWN_COST_USD]: null
  });

  useEffect(() => {
    async function fetchData() {
      const [bandwidth, storage, price] = await Promise.all([getBandwidthStats(), getStorageStats(), getPriceStats()]);

      setStats({ ...bandwidth, ...storage, ...price });
    }

    fetchData();
  }, [setStats]);

  return stats;
}

async function getBandwidthStats() {
  // { up: 76.09, down: 102.66, upusd: 0.23, downusd: 0.32 }
  const { data } = await axios.get("https://siastats.info/dbs/bandwidthpricesdb.json");
  // some entries do not contain the required property so make sure to get one that does
  const current = data.reverse().find((entry) => "downusd" in entry);

  return {
    [AVAILABLE_STATS.BANDWIDTH_DOWN_COST_USD]: current.downusd
  };
}

async function getPriceStats() {
  // { price: 504.59, newcontractformation: 30.79, usd: 1.55, sfperfees: 8.98 }
  const { data } = await axios.get("https://siastats.info/dbs/storagepricesdb.json");
  // some entries do not contain the required property so make sure to get one that does
  const current = data.reverse().find((entry) => "usd" in entry);

  return {
    [AVAILABLE_STATS.STORAGE_COST_USD]: current.usd
  };
}

async function getStorageStats() {
  // { block_height: 247816, block_timestamp: 1582285828, hashrate: 6212581269715416,
  // difficulty: 3501953420754597000, coin_supply: 43638591164, coin_price_USD: 0.003,
  // market_cap_USD: 130915773, used_storage_TB: 725.26, network_capacity_TB: 2270.96,
  // online_hosts: 360, active_contracts: 62997 }
  const { data } = await axios.get("https://siastats.info/dbs/network_status.json");

  return {
    [AVAILABLE_STATS.ONLINE_HOSTS_COUNT]: data.online_hosts,
    [AVAILABLE_STATS.STORAGE_USED_TB]: data.used_storage_TB,
    [AVAILABLE_STATS.NETWORK_CAPACITY_TB]: data.network_capacity_TB
  };
}
