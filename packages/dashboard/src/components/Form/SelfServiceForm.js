import { useFormik, getIn, setIn } from "formik";
import Message from "./Message";

export default function SelfServiceForm({ config, fieldsConfig }) {
  const fields = config.fields
    .map((field) => ({ ...field, ...fieldsConfig[field.name] }))
    .sort((a, b) => (a.position < b.position ? -1 : 1));
  const formik = useFormik({
    initialValues: fields.reduce((acc, field) => setIn(acc, field.name, field.value ?? ""), {}),
  });

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" action={config.action} method={config.method}>
          {fields.map((field) => (
            <div key={field.name}>
              {field.type !== "hidden" && (
                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                  {fieldsConfig[field.name]?.label ?? field.name}
                </label>
              )}
              <div>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  required={field.required}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={getIn(formik.values, field.name)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                {Boolean(field.messages?.length) && (
                  <div className="mt-2">
                    <Message items={field.messages.map(({ text }) => text)} />
                  </div>
                )}
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Update
          </button>

          {Boolean(config.errors?.length) && <Message items={config.errors.map(({ message }) => message)} />}
        </form>
      </div>
    </div>
  );
}
