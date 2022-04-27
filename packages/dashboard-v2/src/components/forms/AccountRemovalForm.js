import * as Yup from "yup";
import { useState } from "react";
import PropTypes from "prop-types";
import { Formik, Form } from "formik";

import { Button } from "../Button";
import { TextField } from "../Form/TextField";
import accountsService from "../../services/accountsService";

const accountRemovalSchema = Yup.object().shape({
  confirm: Yup.string().oneOf(["delete"], `Type "delete" to confirm`),
});

export const AccountRemovalForm = ({ abort, onSuccess }) => {
  const [error, setError] = useState(false);

  return (
    <Formik
      initialValues={{
        confirm: "",
      }}
      validationSchema={accountRemovalSchema}
      onSubmit={async () => {
        try {
          setError(false);
          await accountsService.delete("user");
          onSuccess();
        } catch {
          setError(true);
        }
      }}
    >
      {({ errors, touched, isValid, dirty }) => (
        <Form className="flex flex-col gap-4">
          <div>
            <h4>Delete account</h4>
            <p>This will completely delete your account.</p>
            <p>
              <strong>This process cannot be undone.</strong>
            </p>
          </div>

          <hr className="border-palette-200/50" />

          <p>Type "delete" in the field below to remove your account.</p>

          <TextField
            type="text"
            name="confirm"
            placeholder="delete"
            error={errors.confirm}
            touched={touched.confirm}
            className="text-center"
            autoFocus
          />

          <div className="flex gap-4 justify-center mt-4">
            <Button $primary onClick={abort}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || !dirty}>
              Delete
            </Button>
          </div>
          {error && (
            <div className="px-3 py-2 sm:px-6 sm:py-4 rounded border bg-red-100 border-red-200 text-error">
              There was an error processing your request. Please try again later.
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

AccountRemovalForm.propTypes = {
  abort: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};
