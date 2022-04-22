import * as Yup from "yup";
import { forwardRef, useImperativeHandle, useState } from "react";
import PropTypes from "prop-types";
import { Formik, Form, FieldArray } from "formik";
import { parseSkylink } from "skynet-js";
import cn from "classnames";

import accountsService from "../../services/accountsService";

import { Alert } from "../Alert";
import { Button } from "../Button";
import { CopyButton } from "../CopyButton";
import { TextField } from "../Form/TextField";
import { PlusIcon, TrashIcon } from "../Icons";

const skylinkValidator = (optional) => (value) => {
  if (!value) {
    return optional;
  }

  try {
    return parseSkylink(value) !== null;
  } catch {
    return false;
  }
};

const newSponsorKeySchema = Yup.object().shape({
  name: Yup.string(),
  skylinks: Yup.array().of(Yup.string().test("skylink", "Provide a valid Skylink", skylinkValidator(false))),
  nextSkylink: Yup.string().when("skylinks", {
    is: (skylinks) => skylinks.length === 0,
    then: (schema) => schema.test("skylink", "Provide a valid Skylink", skylinkValidator(true)),
    otherwise: (schema) => schema.test("skylink", "Provide a valid Skylink", skylinkValidator(true)),
  }),
});

const State = {
  Pure: "PURE",
  Success: "SUCCESS",
  Failure: "FAILURE",
};

export const AddSponsorKeyForm = forwardRef(({ onSuccess }, ref) => {
  const [state, setState] = useState(State.Pure);
  const [generatedKey, setGeneratedKey] = useState(null);

  useImperativeHandle(ref, () => ({
    reset: () => setState(State.Pure),
  }));

  return (
    <div ref={ref} className="flex flex-col gap-4">
      {state === State.Success && (
        <Alert $variant="success">
          <strong>Success!</strong>
          <p>Please copy your new API key below. We'll never show it again!</p>
          <div className="flex items-center gap-2 mt-4">
            <code className="p-2 rounded border border-palette-200 text-xs selection:bg-primary/30 truncate">
              {generatedKey}
            </code>
            <CopyButton value={generatedKey} className="whitespace-nowrap" aria-label="Copy the new public API key" />
          </div>
        </Alert>
      )}
      {state === State.Failure && (
        <Alert $variant="error">We were not able to generate a new key. Please try again later.</Alert>
      )}
      <Formik
        initialValues={{
          name: "",
          skylinks: [],
          nextSkylink: "",
        }}
        validationSchema={newSponsorKeySchema}
        onSubmit={async ({ name, skylinks, nextSkylink }, { resetForm }) => {
          try {
            const { key } = await accountsService
              .post("user/apikeys", {
                json: {
                  name,
                  public: "true",
                  skylinks: [...skylinks, nextSkylink].filter(Boolean).map((skylink) => parseSkylink(skylink)),
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
        {({ errors, touched, isSubmitting, values, isValid, setFieldValue, setFieldTouched }) => (
          <Form className="flex flex-col gap-4">
            <div className="flex items-center">
              <TextField
                type="text"
                id="name"
                name="name"
                label="Sponsor API Key Name"
                placeholder="my_applications_statistics"
                error={errors.name}
                touched={touched.name}
              />
            </div>
            <div>
              <h6 className="text-palette-300 mb-2">Skylinks sponsored by the new key</h6>
              <FieldArray
                name="skylinks"
                render={({ push, remove }) => {
                  const { skylinks = [] } = values;
                  const { skylinks: skylinksErrors = [] } = errors;
                  const { skylinks: skylinksTouched = [] } = touched;

                  const appendSkylink = (skylink) => {
                    push(skylink);
                    setFieldValue("nextSkylink", "", false);
                    setFieldTouched("nextSkylink", false);
                  };
                  const isNextSkylinkInvalid = Boolean(
                    errors.nextSkylink || !touched.nextSkylink || !values.nextSkylink
                  );

                  return (
                    <div className="flex flex-col gap-2">
                      {skylinks.map((_, index) => (
                        <div key={index} className="flex gap-4 items-start">
                          <TextField
                            type="text"
                            name={`skylinks.${index}`}
                            placeholder={`${index + 1}. skylink`}
                            error={skylinksErrors[index]}
                            touched={skylinksTouched[index]}
                          />
                          <span className="w-[24px] shrink-0 mt-3">
                            <button type="button" onClick={() => remove(index)} aria-label="Remove this skylink">
                              <TrashIcon size={16} />
                            </button>
                          </span>
                        </div>
                      ))}

                      <div className="flex gap-4 items-start">
                        <TextField
                          type="text"
                          name="nextSkylink"
                          placeholder={`Paste next skylink here`}
                          error={errors.nextSkylink}
                          touched={touched.nextSkylink}
                          onKeyPress={(event) => {
                            if (event.key === "Enter" && isValid) {
                              event.preventDefault();
                              appendSkylink(values.nextSkylink);
                            }
                          }}
                        />
                        <button
                          type="button"
                          aria-label="Add this skylink"
                          onClick={() => appendSkylink(values.nextSkylink)}
                          className={cn("shrink-0 mt-1.5 w-[24px] h-[24px]", {
                            "text-palette-300 cursor-not-allowed": isNextSkylinkInvalid,
                          })}
                          disabled={isNextSkylinkInvalid}
                        >
                          <PlusIcon size={15} />
                        </button>
                      </div>
                    </div>
                  );
                }}
              />
            </div>

            <div className="flex mt-5 justify-center">
              <Button
                type="submit"
                className={cn("px-2.5", { "cursor-wait": isSubmitting })}
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? "Generating your sponsor key..." : "Generate your sponsor key"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
});

AddSponsorKeyForm.displayName = "AddSponsorKeyForm";

AddSponsorKeyForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};
