import PropTypes from "prop-types";
import { Formik, Form } from "formik";
import { Link } from "gatsby";
import * as Yup from "yup";

import HighlightedLink from "../HighlightedLink";
import { TextField } from "../Form/TextField";
import { Button } from "../Button";

import accountsService from "../../services/accountsService";

const loginSchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Please provide a valid email address"),
  password: Yup.string().required("Password is required"),
});

const INVALID_CREDENTIALS_ERRORS = ["password mismatch", "user not found"];

export const LoginForm = ({ onSuccess }) => (
  <Formik
    initialValues={{
      email: "",
      password: "",
    }}
    validationSchema={loginSchema}
    onSubmit={async (values, { setErrors }) => {
      try {
        await accountsService.post("login", {
          json: values,
        });

        onSuccess();
      } catch (err) {
        if (err.response) {
          const data = await err.response.json();

          if (INVALID_CREDENTIALS_ERRORS.includes(data.message)) {
            setErrors({
              email: "Invalid e-mail address or password",
              password: "Invalid e-mail address or password",
            });
          }
        }
      }
    }}
  >
    {({ errors, touched }) => (
      <Form className="flex flex-col gap-4">
        <h3 className="mt-4 mb-8">Log in to your account</h3>
        <TextField
          type="text"
          id="email"
          name="email"
          label="Email address"
          error={errors.email}
          touched={touched.email}
        />
        <TextField
          type="password"
          id="password"
          name="password"
          label="Password"
          error={errors.password}
          touched={touched.password}
        />
        <div>
          <Link to="/auth/recover" className="text-sm inline transition-colors hover:text-primary">
            Forgot your password?
          </Link>
        </div>

        <div className="flex w-full justify-center mt-4">
          <Button type="submit" className="px-12" $primary>
            Log in
          </Button>
        </div>

        <p className="text-sm text-center mt-8">
          Don't have an account? <HighlightedLink to="/auth/signup">Sign up</HighlightedLink>
        </p>
      </Form>
    )}
  </Formik>
);

LoginForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};
