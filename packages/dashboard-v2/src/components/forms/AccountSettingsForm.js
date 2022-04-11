import * as Yup from "yup";
import PropTypes from "prop-types";
import { Formik, Form } from "formik";

import { Button } from "../Button";
import { TextField } from "../Form/TextField";
import accountsService from "../../services/accountsService";

const isPopulated = (value) => value?.length > 0;

const emailUpdateSchema = Yup.object().shape({
  email: Yup.string().email("Please provide a valid email address"),
  confirmEmail: Yup.string()
    .oneOf([Yup.ref("email"), null], "Emails must match")
    .when("email", {
      is: isPopulated,
      then: (schema) => schema.required("Please confirm new email address"),
    }),
  password: Yup.string().min(1, "Password can't be blank"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .when("password", {
      is: isPopulated,
      then: (schema) => schema.required("Please confirm new password"),
    }),
});

export const AccountSettingsForm = ({ user, onSuccess, onFailure }) => {
  return (
    <Formik
      initialValues={{
        email: "",
        confirmEmail: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={emailUpdateSchema}
      onSubmit={async ({ email, password }, { resetForm }) => {
        try {
          const user = await accountsService
            .put("user", {
              json: {
                email: email || undefined,
                password: password || undefined,
              },
            })
            .json();

          resetForm();
          await onSuccess(user);
        } catch {
          onFailure();
        }
      }}
    >
      {({ errors, touched, isValid, dirty }) => (
        <Form>
          <div className="flex flex-col w-full gap-8">
            <div className="flex flex-col sm:flex-row gap-2">
              <TextField
                type="text"
                id="email"
                name="email"
                label="Email address"
                placeholder={user?.email}
                error={errors.email}
                touched={touched.email}
              />
              <TextField
                type="text"
                id="confirmEmail"
                name="confirmEmail"
                label="Confirm new email address"
                error={errors.confirmEmail}
                touched={touched.confirmEmail}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <TextField
                type="password"
                id="password"
                name="password"
                label="New password"
                error={errors.password}
                touched={touched.password}
              />
              <TextField
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm new password"
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
              />
            </div>
          </div>
          <div className="flex mt-2 sm:mt-0 pt-5 justify-center">
            <Button type="submit" className="px-24" disabled={!isValid || !dirty}>
              Update
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

AccountSettingsForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
};
