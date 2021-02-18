import { Configuration, PublicApi } from "@ory/kratos-client";
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
  console.log(flow);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Update your settings</h2>
      </div>

      <SelfServiceForm config={flow.methods.password.config} fieldsConfig={fieldsConfig} />
      <SelfServiceForm config={flow.methods.profile.config} fieldsConfig={fieldsConfig} />
    </div>
  );
}
