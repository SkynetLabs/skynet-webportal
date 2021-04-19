import { Configuration, PublicApi } from "@ory/kratos-client";
import Layout from "../components/Layout";
import config from "../config";
import SelfServiceForm from "../components/Form/SelfServiceForm";
import authServerSideProps from "../services/authServerSideProps";

const kratos = new PublicApi(new Configuration({ basePath: config.kratos.public }));

export const getServerSideProps = authServerSideProps(async (context) => {
  const flow = context.query.flow;

  if (process.env.NODE_ENV === "development") {
    return { props: { flow: require("../../stubs/settings.json") } };
  }

  // The flow is used to identify the login and registration flow and
  // return data like the csrf_token and so on.
  if (!flow || typeof flow !== "string") {
    // No flow ID found in URL, initializing settings flow.
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
});

const fieldsConfig = {
  "traits.email": {
    label: "Email address",
    autoComplete: "email",
    position: 0,
  },
  password: {
    label: "Password",
    autoComplete: "new-password",
    position: 1,
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
        <SelfServiceForm config={profileConfig} fieldsConfig={fieldsConfig} title="Account settings" button="Update" />
        <SelfServiceForm
          config={passwordConfig}
          fieldsConfig={fieldsConfig}
          title="Authentication settings"
          button="Update"
        />
      </div>
    </Layout>
  );
}
