import Link from "next/link";
import { Configuration, PublicApi } from "@ory/kratos-client";
import { useFormik } from "formik";
import config from "../../config";
import Message from "../../components/Form/Message";

const kratos = new PublicApi(new Configuration({ basePath: config.kratos.public }));

export async function getServerSideProps(context) {
  const flow = context.query.flow;

  if (process.env.NODE_ENV === "development") {
    return { props: { flow: require("../../../stubs/login.json") } };
  }

  // The flow is used to identify the login and registration flow and
  // return data like the csrf_token and so on.
  if (!flow || typeof flow !== "string") {
    console.log("No flow ID found in URL, initializing login flow.");

    return {
      redirect: {
        permanent: false,
        destination: `${config.kratos.browser}/self-service/login/browser`,
      },
    };
  }

  try {
    const { status, data } = await kratos.getSelfServiceLoginFlow(flow);

    if (status === 200) return { props: { flow: data } };

    throw new Error(`Failed to retrieve flow ${flow} with code ${status}`);
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: `${config.kratos.browser}/self-service/login/browser`,
      },
    };
  }
}

const fieldProps = {
  identifier: {
    label: "Email address",
    autoComplete: "email",
    position: 0,
  },
  password: {
    label: "Password",
    autoComplete: "current-password",
    position: 1,
  },
  csrf_token: {
    position: 99,
  },
};

export default function Login({ flow }) {
  const fields = flow.methods.password.config.fields
    .map((field) => ({
      ...field,
      ...fieldProps[field.name],
    }))
    .sort((a, b) => (a.position < b.position ? -1 : 1));
  const formik = useFormik({
    initialValues: fields.reduce((acc, field) => ({ ...acc, [field.name]: field.value }), {}),
  });

  console.log("flow", flow);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="169"
          height="39"
          viewBox="0 0 169 39"
          className="mx-auto h-12 w-auto"
        >
          <path
            d="M160.701 31.245c-2.736 0-4.788-.706-6.156-2.118-1.369-1.411-2.053-3.424-2.053-6.039V2.674h7.487v6.33H169v6.15h-9.02v7.355c0 1.753.886 2.63 2.66 2.63h6.134v6.106h-8.073zm-24.942 0c-1.744 0-3.352-.268-4.826-.803-1.473-.535-2.751-1.292-3.833-2.273a10.275 10.275 0 01-2.526-3.521c-.602-1.367-.902-2.882-.902-4.546 0-1.635.3-3.135.902-4.502a10.275 10.275 0 012.526-3.521c1.082-.98 2.36-1.738 3.833-2.273 1.474-.535 3.082-.803 4.826-.803h5.728c1.293 0 2.42.179 3.383.535.962.357 1.767.847 2.413 1.471a5.823 5.823 0 011.443 2.251c.316.877.474 1.835.474 2.875 0 1.961-.571 3.432-1.714 4.412-1.143.981-3.022 1.471-5.638 1.471h-8.028v-4.056h6.45c1.172 0 1.759-.52 1.759-1.56 0-1.1-.572-1.649-1.714-1.649h-4.6c-1.354 0-2.451.46-3.293 1.382-.842.921-1.263 2.228-1.263 3.922s.42 2.964 1.263 3.811c.842.847 1.94 1.27 3.292 1.27h12.268v6.107H135.76zm-22.867 0V19.567c0-2.526-1.308-3.789-3.924-3.789h-7.532v15.467H93.86V9.003h15.29c3.728 0 6.54.922 8.434 2.764 1.894 1.842 2.841 4.457 2.841 7.844v11.634h-7.532zM67.293 39v-6.418h2.39c.963 0 1.715-.193 2.256-.58a4.58 4.58 0 001.308-1.426L62.422 9.003h7.623l6.675 14.263 6.855-14.263h7.668L78.749 33.43c-.48.95-.984 1.775-1.51 2.473a7.85 7.85 0 01-1.782 1.739 7.11 7.11 0 01-2.233 1.025c-.827.223-1.781.334-2.864.334h-3.067zm-14.207-7.755l-7.713-9.316a4.647 4.647 0 01-.54-.914 2.306 2.306 0 01-.181-.913v-.535c0-.654.225-1.278.676-1.872l7.487-8.692h8.48l-9.02 10.787 9.47 11.455h-8.66zm-17.41 0V0h7.532v31.245h-7.532zm-35.315 0v-7.488h21.92c.571 0 1.037-.171 1.398-.513.36-.342.541-.825.541-1.449 0-.624-.18-1.114-.541-1.47-.36-.357-.827-.535-1.398-.535H9.38c-1.353 0-2.608-.216-3.766-.647-1.157-.43-2.15-1.025-2.976-1.782a8.005 8.005 0 01-1.94-2.742C.233 13.55 0 12.361 0 11.054 0 9.746.233 8.55.7 7.466A8.184 8.184 0 012.638 4.68c.826-.773 1.819-1.367 2.976-1.783 1.158-.416 2.413-.624 3.766-.624h22.281v7.444H9.742c-.571 0-1.03.163-1.375.49-.346.327-.52.802-.52 1.426 0 .594.174 1.07.52 1.426.345.357.804.535 1.375.535h12.9c1.383 0 2.646.216 3.788.647a9.097 9.097 0 012.977 1.805 8.038 8.038 0 011.962 2.785c.466 1.085.7 2.266.7 3.544 0 1.337-.234 2.548-.7 3.632a8.267 8.267 0 01-1.962 2.808 8.62 8.62 0 01-2.977 1.806c-1.142.416-2.405.624-3.788.624H.36z"
            fill="#57B560"
            fillRule="evenodd"
          />
        </svg>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600 max-w">
          or{" "}
          <Link href="/auth/registration">
            <a className="font-medium text-green-600 hover:text-green-500">sign up</a>
          </Link>{" "}
          if you don't have one yet
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form
            className="space-y-6"
            action={flow.methods.password.config.action}
            method={flow.methods.password.config.method}
          >
            {fields.map((field) => (
              <div key={field.name}>
                {field.type !== "hidden" && (
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                    {fieldProps[field.name].label}
                  </label>
                )}
                <div>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    autoComplete={fieldProps[field.name]}
                    required={field.required}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values[field.name]}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>

                {Boolean(field.errors?.length) && (
                  <div className="mt-2">
                    <Message items={field.errors.map(({ message }) => message)} />
                  </div>
                )}
              </div>
            ))}

            <div className="flex items-center justify-between">
              <Link href="/recovery">
                <a className="text-sm font-medium text-green-600 hover:text-green-500">Forgot your password?</a>
              </Link>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Sign in
            </button>

            {Boolean(flow.methods.password.config.errors?.length) && (
              <Message items={flow.methods.password.config.errors.map(({ message }) => message)} />
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
