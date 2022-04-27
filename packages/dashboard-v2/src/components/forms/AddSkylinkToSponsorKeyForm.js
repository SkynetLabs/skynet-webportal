import * as Yup from "yup";
import PropTypes from "prop-types";
import { Formik, Form } from "formik";
import { parseSkylink } from "skynet-js";

import { Button } from "../Button";
import { TextField } from "../Form/TextField";
import { CircledProgressIcon, PlusIcon } from "../Icons";

const newSkylinkSchema = Yup.object().shape({
  skylink: Yup.string()
    .required("Skylink is required")
    .test("skylink", "Provide a valid Skylink", (value) => {
      try {
        return parseSkylink(value) !== null;
      } catch {
        return false;
      }
    }),
});

export const AddSkylinkToSponsorKeyForm = ({ addSkylink }) => (
  <Formik
    initialValues={{
      skylink: "",
    }}
    validationSchema={newSkylinkSchema}
    onSubmit={async ({ skylink }, { resetForm }) => {
      if (await addSkylink(parseSkylink(skylink))) {
        resetForm();
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
            placeholder="Paste a new Skylink here"
            error={errors.skylink}
            touched={touched.skylink}
          />
        </div>
        <div className="flex mt-5 justify-center">
          {isSubmitting ? (
            <CircledProgressIcon size={38} className="text-palette-300 animate-[spin_3s_linear_infinite]" />
          ) : (
            <Button type="submit" className="px-2.5" aria-label="Add this skylink">
              <PlusIcon size={14} />
            </Button>
          )}
        </div>
      </Form>
    )}
  </Formik>
);

AddSkylinkToSponsorKeyForm.propTypes = {
  addSkylink: PropTypes.func.isRequired,
};
