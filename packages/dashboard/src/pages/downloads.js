import { useState } from "react";
import Layout from "../src/components/Layout";
import Table from "../src/components/Table";

const data = [
  { skylink: "PAL0w4SdA5rFCDGEutgpeQ50Om-YkBabtXVOJAkmedslKw", size: "1 KB", date: "today" },
  { skylink: "XABvi7JtJbQSMAcDwnUnmp2FKDPjg8_tTTFP4BwMSxVdEg", size: "102 MB", date: "today" },
  { skylink: "IADUs8d9CQjUO34LmdaaNPK_STuZo24rpKVfYW3wPPM2uQ", size: "141 KB", date: "today" },
  { skylink: "_A2zt5SKoqwnnZU4cBF8uBycSKULXMyeg1c5ZISBr2Q3dA", size: "1 KB", date: "today" },
  { skylink: "AAC0uO43g64ULpyrW0zO3bjEknSFbAhm8c-RFP21EQlmSQ", size: "0 KB", date: "today" },
  { skylink: "CACqf4NlIMlA0CCCieYGjpViPGyfyJ4v1x3bmuCKZX8FKA", size: "1.3 MB", date: "today" },
];
const headers = [
  { key: "skylink", name: "Skylink" },
  { key: "size", name: "Size" },
  { key: "date", name: "Access time" },
];
const actions = [];

export default function Downloads() {
  const [page, setPage] = useState(1);

  return (
    <Layout title="Your downloads">
      <Table data={data} headers={headers} actions={actions} page={page} setPage={setPage} />
    </Layout>
  );
}
