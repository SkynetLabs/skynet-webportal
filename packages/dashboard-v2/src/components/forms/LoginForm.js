import { useState } from "react";
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

export const LoginForm = ({ onSuccess }) => {
  const [error, setError] = useState(null);

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={loginSchema}
      onSubmit={async (values) => {
        try {
          await accountsService.post("login", {
            json: values,
          });

          onSuccess();
        } catch (err) {
          if (err.response) {
            const data = await err.response.json();

            if (INVALID_CREDENTIALS_ERRORS.includes(data.message)) {
              setError("Invalid email address or password.");
            } else {
              setError(data.message);
            }
          } else {
            setError("An error occured when logging you in. Please try again.");
          }
        }
      }}
    >
      {({ errors, touched }) => (
        <Form className="flex flex-col gap-4">
          <h3 className="mt-4 mb-4">Log in to your account</h3>
          {error && <p className="px-4 py-3 rounded border border-error bg-red-50 text-error mb-4">{error}</p>}
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
            <Link to="/auth/reset-password" className="text-sm inline transition-colors hover:text-primary">
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
};

LoginForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};
