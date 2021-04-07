import { useFormik, getIn, setIn } from "formik";
import classnames from "classnames";
import SelfServiceMessages from "./SelfServiceMessages";

export default function SelfServiceForm({ flow, config, fieldsConfig, title, button = "Submit" }) {
  const fields = config.fields
    .filter((field) => !field.name.startsWith("traits.name")) // drop name fields
    .map((field) => ({ ...field, ...fieldsConfig[field.name] }))
    .sort((a, b) => (a.position < b.position ? -1 : 1));
  const formik = useFormik({
    initialValues: fields.reduce((acc, field) => setIn(acc, field.name, field.value ?? ""), {}),
  });

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      {title && <h3 className="pb-5 text-lg leading-6 font-medium text-gray-900">{title}</h3>}
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" action={config.action} method={config.method}>
          {fields.map((field) => (
            <div key={field.name} className={classnames({ hidden: field.type === "hidden" })}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                {fieldsConfig[field.name]?.label ?? field.name}
              </label>
              <div>
                <input
                  id={field.type === "hidden" ? null : field.name}
                  name={field.name}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  required={field.required}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={getIn(formik.values, field.name) ?? ""}
                  className={classnames(
                    "appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm",
                    {
                      "border-gray-300 placeholder-gray-400 focus:ring-green-500 focus:border-green-500": !Boolean(
                        field?.messages?.length
                      ),
                      "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500": Boolean(
                        field?.messages?.length
                      ),
                    }
                  )}
                />

                <SelfServiceMessages messages={field.messages} />

                {field.checks && (
                  <div className="mt-4">
                    <ul className="space-y-1">
                      {field.checks.map((check, index) => (
                        <li
                          key={index}
                          className={
                            check.validate(formik.values, field.name) ? "text-green-600 font-medium" : "text-gray-600"
                          }
                        >
                          <div className="flex space-x-3 items-center">
                            <span className="flex items-center justify-center ">
                              <svg
                                className="h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"
                                />
                              </svg>
                            </span>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <h3 className="text-xs">{check.label}</h3>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
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

          <SelfServiceMessages messages={config.messages} />

          {flow && <SelfServiceMessages messages={flow.messages} />}
        </form>
      </div>
    </div>
  );
}
