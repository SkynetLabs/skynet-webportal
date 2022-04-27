import PropTypes from "prop-types";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { TextField } from "../Form/TextField";
import { Button } from "../Button";

import accountsService from "../../services/accountsService";

const recoverySchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Please provide a valid email address"),
});

export const RecoveryForm = ({ onSuccess, onFailure }) => (
  <Formik
    initialValues={{
      email: "",
    }}
    validationSchema={recoverySchema}
    onSubmit={async (values) => {
      try {
        await accountsService.post("user/recover/request", {
          json: values,
        });

        onSuccess();
      } catch {
        onFailure();
      }
    }}
  >
    {({ errors, touched }) => (
      <Form className="flex flex-col gap-4">
        <h3 className="mt-4 mb-8">Request account recovery</h3>
        <TextField
          type="text"
          id="email"
          name="email"
          label="Email address"
          error={errors.email}
          touched={touched.email}
        />

        <div className="flex w-full justify-center mt-4">
          <Button type="submit" className="px-12" $primary>
            Send recovery link
          </Button>
        </div>
      </Form>
    )}
  </Formik>
);

RecoveryForm.propTypes = {
  onFailure: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};
