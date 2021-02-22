import { Configuration, PublicApi } from "@ory/kratos-client";
import Layout from "../components/Layout";
import config from "../config";
import SelfServiceForm from "../components/Form/SelfServiceForm";

const kratos = new PublicApi(new Configuration({ basePath: config.kratos.public }));

export async function getServerSideProps(context) {
  const flow = context.query.flow;

  if (process.env.NODE_ENV === "development") {
    return { props: { flow: require("../../stubs/settings.json") } };
  }

  // The flow is used to identify the login and registration flow and
  // return data like the csrf_token and so on.
  if (!flow || typeof flow !== "string") {
    console.log("No flow ID found in URL, initializing settings flow.");

    return {
      redirect: {
        permanent: false,
        destination: `${config.kratos.browser}/self-service/settings/browser`,
      },
    };
  }

  try {
    const { status, data } = await kratos.getSelfServiceSettingsFlow(flow, {
      headers: { cookie: context.req.headers.cookie },
    });

    if (status === 200) return { props: { flow: data } };

    throw new Error(`Failed to retrieve flow ${flow} with code ${status}`);
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: `${config.kratos.browser}/self-service/settings/browser`,
      },
    };
  }
}

const fieldsConfig = {
  "traits.email": {
    label: "Email address",
    autoComplete: "email",
    position: 0,
  },
  "traits.name.first": {
    label: "First name",
    autoComplete: "given-name",
    position: 1,
  },
  "traits.name.last": {
    label: "Last name",
    autoComplete: "family-name",
    position: 2,
  },
  password: {
    label: "Password",
    autoComplete: "new-password",
    position: 4,
  },
  csrf_token: {
    position: 99,
  },
};

export default function Settings({ flow }) {
  const profileConfig = flow.methods.profile.config;
  const passwordConfig = flow.methods.password.config;

  return (
    <Layout title="Settings">
      <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <SelfServiceForm config={profileConfig} fieldsConfig={fieldsConfig} title="Account settings" />
        <SelfServiceForm config={passwordConfig} fieldsConfig={fieldsConfig} title="Authentication settings" />
      </div>
    </Layout>
  );
}
