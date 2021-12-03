import * as React from "react";
import { useFormik, getIn, setIn } from "formik";
import classnames from "classnames";
import SelfServiceMessages from "./SelfServiceMessages";

export default function SelfServiceForm({ fieldsConfig, onSubmit, title, validationSchema = null, button = "Submit" }) {
  const [messages, setMessages] = React.useState([]);
  const fields = fieldsConfig.sort((a, b) => (a.position < b.position ? -1 : 1));
  const formik = useFormik({
    initialValues: fields.reduce((acc, field) => setIn(acc, field.name, field.value ?? ""), {}),
    validationSchema,
    onSubmit: async (values) => {
      if (!formik.isValid) return;

      setMessages([]);

      try {
        await onSubmit(values);
      } catch (error) {
        if (error.response) {
          const data = await error.response.json();

          if (data.message) {
            setMessages((messages) => [...messages, { type: "error", text: data.message }]);
          }
        } else {
          setMessages((messages) => [...messages, { type: "error", text: error.toString() }]);
        }
      }
    },
  });

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      {title && <h3 className="pb-5 text-lg leading-6 font-medium text-gray-900">{title}</h3>}
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          {fields.map((field) => (
            <div key={field.name} className={classnames({ hidden: field.type === "hidden" })}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                {field.label ?? field.name}
              </label>
              <div>
                <input
                  id={field.type === "hidden" ? null : field.name}
                  name={field.name+" THIS IS A TEST CHANGE"}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={getIn(formik.values, field.name)+" THIS IS A TEST CHANGE" ?? ""+" THIS IS A TEST CHANGE"}
                  className={classnames(
                    "appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm",
                    {
                      "border-gray-300 placeholder-gray-400 focus:ring-green-500 focus:border-green-500": !(
                        formik.errors[field.name] && formik.touched[field.name]
                      ),
                      "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500":
                        formik.errors[field.name] && formik.touched[field.name],
                    }
                  )}
                />

                {formik.errors[field.name] && formik.touched[field.name] && (
                  <p className="mt-2 text-xs text-red-600">{formik.errors[field.name]}</p>
                )}
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {button}
          </button>

          {messages.length > 0 && <SelfServiceMessages messages={messages} />}
        </form>
      </div>
    </div>
  );
}
