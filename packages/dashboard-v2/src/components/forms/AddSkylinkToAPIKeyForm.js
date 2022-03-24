import * as Yup from "yup";
import PropTypes from "prop-types";
import { Formik, Form } from "formik";

import accountsService from "../../services/accountsService";

import { Button } from "../Button";
import { TextField } from "../Form/TextField";
import { CircledProgressIcon, PlusIcon } from "../Icons";

const newSkylinkSchema = Yup.object().shape({
  skylink: Yup.string().required("Provide a valid Skylink"), // TODO: Comprehensive Skylink validation
});

export const AddSkylinkToAPIKeyForm = ({ keyId, onSuccess, onFailure }) => (
  <Formik
    initialValues={{
      skylink: "",
    }}
    validationSchema={newSkylinkSchema}
    onSubmit={async ({ skylink }, { resetForm }) => {
      try {
        await accountsService
          .patch(`user/apikeys/${keyId}`, {
            json: {
              add: [skylink],
            },
          })
          .json();

        resetForm();
        onSuccess();
      } catch (err) {
        if (err.response) {
          const { message } = await err.response.json();
          onFailure(message);
        } else {
          onFailure("Unknown error occured, please try again.");
        }
      }
    }}
  >
    {({ errors, touched, isSubmitting }) => (
      <Form className="grid grid-cols-[1fr_min-content] w-full gap-y-2 gap-x-4 items-start">
        <div className="flex items-center text-left">
          <TextField
            type="text"
            id="skylink"
            name="skylink"
            label="New Skylink"
            error={errors.skylink}
            touched={touched.skylink}
          />
        </div>
        <div className="flex mt-5 justify-center">
          {isSubmitting ? (
            <CircledProgressIcon size={38} className="text-palette-300 animate-[spin_3s_linear_infinite]" />
          ) : (
            <Button type="submit" className="px-2.5">
              <PlusIcon size={14} />
            </Button>
          )}
        </div>
      </Form>
    )}
  </Formik>
);

AddSkylinkToAPIKeyForm.propTypes = {
  onFailure: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  keyId: PropTypes.string.isRequired,
};
