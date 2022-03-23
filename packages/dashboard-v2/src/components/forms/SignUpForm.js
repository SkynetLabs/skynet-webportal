import PropTypes from "prop-types";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { TextField } from "../Form/TextField";
import { Button } from "../Button";

import accountsService from "../../services/accountsService";

// TODO: better password strength validation
const registrationSchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Please provide a valid email address"),
  password: Yup.string().required("Password is required").min(6, "Password has to be at least 6 characters long"),
  confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const USER_EXISTS_ERROR = "identity already belongs to an existing user";

export const SignUpForm = ({ onSuccess, onFailure }) => (
  <Formik
    initialValues={{
      email: "",
      password: "",
      confirmPassword: "",
    }}
    validationSchema={registrationSchema}
    onSubmit={async ({ email, password }, { setErrors }) => {
      try {
        await accountsService.post("user", {
          json: {
            email,
            password,
          },
        });

        onSuccess();
      } catch (err) {
        let isFormErrorSet = false;

        if (err.response) {
          const data = await err.response.json();

          // If it's a user error, let's capture it and handle within the form.
          if (USER_EXISTS_ERROR === data.message) {
            setErrors({ email: "This email address already in use." });
            isFormErrorSet = true;
          }
        }

        if (!isFormErrorSet) {
          onFailure();
        }
      }
    }}
  >
    {({ errors, touched }) => (
      <Form className="flex flex-col gap-4">
        <div className="mt-4 mb-8">
          <h3>Create your free account</h3>
          <p className="font-light font-sans text-lg">Includes 100 GB storage at basic speed</p>
        </div>

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
        <div className="text-xs text-palette-400">
          <ul>
            <li>At least 6 characters long</li>
            <li>Significantly different from the email</li>
          </ul>
        </div>

        <TextField
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          error={errors.confirmPassword}
          touched={touched.confirmPassword}
        />

        <div className="flex w-full justify-center mt-4">
          <Button type="submit" className="px-12" $primary>
            Sign up!
          </Button>
        </div>
      </Form>
    )}
  </Formik>
);

SignUpForm.propTypes = {
  onFailure: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};
