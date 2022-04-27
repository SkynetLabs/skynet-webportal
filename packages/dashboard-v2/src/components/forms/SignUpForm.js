import PropTypes from "prop-types";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { TextField } from "../Form/TextField";
import { Button } from "../Button";

import accountsService from "../../services/accountsService";

export const passwordSchema = Yup.object().shape({
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please re-type your password"),
});

const registrationSchema = Yup.object()
  .shape({
    email: Yup.string().required("Email is required").email("Please provide a valid email address"),
  })
  .concat(passwordSchema);

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
        const user = await accountsService
          .post("user", {
            json: {
              email,
              password,
            },
          })
          .json();

        onSuccess(user);
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
