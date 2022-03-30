import * as Yup from "yup";
import { forwardRef, useImperativeHandle, useState } from "react";
import PropTypes from "prop-types";
import { Formik, Form } from "formik";

import accountsService from "../../services/accountsService";

import { Alert } from "../Alert";
import { Button } from "../Button";
import { CopyButton } from "../CopyButton";
import { TextField } from "../Form/TextField";
import { CircledProgressIcon, PlusIcon } from "../Icons";

const newAPIKeySchema = Yup.object().shape({
  name: Yup.string(),
});

const State = {
  Pure: "PURE",
  Success: "SUCCESS",
  Failure: "FAILURE",
};

export const APIKeyType = {
  Public: "public",
  General: "general",
};

export const AddAPIKeyForm = forwardRef(({ onSuccess, type }, ref) => {
  const [state, setState] = useState(State.Pure);
  const [generatedKey, setGeneratedKey] = useState(null);

  useImperativeHandle(ref, () => ({
    reset: () => setState(State.Pure),
  }));

  return (
    <div ref={ref} className="flex flex-col gap-4">
      {state === State.Success && (
        <Alert $variant="success" className="text-center">
          <strong>Success!</strong>
          <p>Please copy your new API key below. We'll never show it again!</p>
          <div className="flex items-center gap-2 mt-4 justify-center">
            <code className="p-2 rounded border border-palette-200 text-xs selection:bg-primary/30 truncate">
              {generatedKey}
            </code>
            <CopyButton value={generatedKey} className="whitespace-nowrap" />
          </div>
        </Alert>
      )}
      {state === State.Failure && (
        <Alert $variant="error">We were not able to generate a new key. Please try again later.</Alert>
      )}
      <Formik
        initialValues={{
          name: "",
        }}
        validationSchema={newAPIKeySchema}
        onSubmit={async ({ name }, { resetForm }) => {
          try {
            const { key } = await accountsService
              .post("user/apikeys", {
                json: {
                  name,
                  public: type === APIKeyType.Public ? "true" : "false",
                  skylinks: type === APIKeyType.Public ? [] : null,
                },
              })
              .json();

            resetForm();
            setGeneratedKey(key);
            setState(State.Success);
            onSuccess();
          } catch {
            setState(State.Failure);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="grid grid-cols-[1fr_min-content] w-full gap-y-2 gap-x-4 items-start">
            <div className="flex items-center">
              <TextField
                type="text"
                id="name"
                name="name"
                label="New API Key Name"
                placeholder="my_applications_statistics"
                error={errors.name}
                touched={touched.name}
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
    </div>
  );
});

AddAPIKeyForm.displayName = "AddAPIKeyForm";

AddAPIKeyForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  type: PropTypes.oneOf([APIKeyType.Public, APIKeyType.General]).isRequired,
};
