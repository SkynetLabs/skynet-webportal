// @preval
// This file is pre-evaluated on build-time, so the config is only resolved once
// and then included in the bundle for us to use in dynamic styles.
import resolveConfig from "tailwindcss/resolveConfig";

import tailwindConfig from "../../tailwind.config.js";

export default resolveConfig(tailwindConfig).theme;
