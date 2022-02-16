import * as Yup from "yup";
import Layout from "../../components/Layout";
import SelfServiceForm from "../../components/Form/SelfServiceForm";
import accountsApi from "../../services/accountsApi";

const profileConfig = [
  {
    name: "email",
    type: "text",
    label: "New email address",
    autoComplete: "email",
    position: 0,
  },
  {
    name: "confirmEmail",
    type: "text",
    label: "New email address repeated",
    autoComplete: "email",
    position: 1,
  },
];

const passwordConfig = [
  {
    name: "password",
    type: "password",
    label: "New password",
    position: 1,
  },
  {
    name: "confirmPassword",
    type: "password",
    label: "New password repeated",
    position: 2,
  },
];

const emailValidationSchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("This email is invalid"),
  confirmEmail: Yup.string().oneOf([Yup.ref("email"), null], "Emails must match"),
});

const passwordValidationSchema = Yup.object().shape({
  password: Yup.string().required("Password is required").min(6, "Password has to be at least 6 characters long"),
  confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match"),
});

export default function Settings() {
  const onEmailSubmit = async (values) => {
    await accountsApi.put("user", {
      json: {
        email: values.email,
      },
    });
  };

  const onPasswordSubmit = async (values) => {
    await accountsApi.put("user", {
      json: {
        password: values.password,
      },
    });
  };

  return (
    <Layout title="Settings">
      <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <SelfServiceForm
          fieldsConfig={profileConfig}
          validationSchema={emailValidationSchema}
          onSubmit={onEmailSubmit}
          title="Account settings"
          button="Update"
        />
        <SelfServiceForm
          fieldsConfig={passwordConfig}
          validationSchema={passwordValidationSchema}
          onSubmit={onPasswordSubmit}
          title="Authentication settings"
          button="Update"
        />
      </div>
    </Layout>
  );
}
