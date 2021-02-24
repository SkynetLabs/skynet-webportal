import dayjs from "dayjs";
import Layout from "../components/Layout";
import useSWR from "swr";
import ky from "ky/umd";

const plans = [
  { id: "initial_free", name: "Free", price: 0, description: "Unlimited bandwidth with throttled speed" },
  { id: "initial_plus", name: "Skynet Plus", price: 5, description: "1 TB premium bandwidth with full speed" },
  { id: "initial_pro", name: "Skynet Pro", price: 20, description: "5 TB premium bandwidth with full speed" },
  { id: "initial_extreme", name: "Skynet Extreme", price: 80, description: "20 TB premium bandwidth with full speed" },
];
const currentlyActivePlan = "initial_free";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Payments() {
  const { data: invoices } = useSWR("/api/square/invoices", fetcher);
  const { data: subscription, mutate: mutateSubscription } = useSWR("/api/square/subscription", fetcher);
  const handleSubscriptionCancel = async (e) => {
    e.preventDefault();

    try {
      const subscription = await ky.post("/api/square/subscription/cancel").json();

      mutateSubscription(subscription, false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubscriptionRestore = async (e) => {
    e.preventDefault();

    try {
      const subscription = await ky.post("/api/square/subscription/restore").json();

      mutateSubscription(subscription, false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title="Payments">
      <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
        <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
          {/* This example requires Tailwind CSS v2.0+ */}
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Current plan</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">Free</dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Current payment</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">&mdash;</dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Plan usage this month</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">24.57%</dd>
              </div>
            </div>
          </dl>

          {/* Plan */}
          <section aria-labelledby="plan_heading">
            <form action="#" method="POST">
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                  <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                    <div className="ml-4 mt-2">
                      <h3 id="plan_heading" className="text-lg leading-6 font-medium text-gray-900">
                        Plan
                      </h3>
                    </div>
                  </div>
                  <fieldset>
                    <legend className="sr-only">Pricing plans</legend>
                    <ul className="relative bg-white rounded-md -space-y-px">
                      {plans.map((plan, index) => (
                        <li key={plan.id}>
                          {/* On: "bg-orange-50 border-orange-200 z-10", Off: "border-gray-200" */}
                          <div
                            className={`relative border ${index === 0 ? "rounded-tl-md rounded-tr-md" : ""} ${
                              index === plans.length - 1 ? "rounded-bl-md rounded-br-md" : ""
                            } p-4 flex flex-col md:pl-4 md:pr-6 md:grid md:grid-cols-3`}
                          >
                            <label className="flex items-center text-sm cursor-pointer">
                              <input
                                name="pricing_plan"
                                type="radio"
                                className="h-4 w-4 text-orange-500 cursor-pointer focus:ring-gray-900 border-gray-300"
                                aria-describedby="plan-option-pricing-0 plan-option-limit-0"
                                defaultChecked
                              />
                              <span className="ml-3 font-medium text-gray-900">{plan.name}</span>
                            </label>
                            <p id="plan-option-pricing-0" className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-center">
                              {/* On: "text-orange-900", Off: "text-gray-900" */}
                              <span className="font-medium">{plan.price ? `$${plan.price} / mo` : "no cost"}</span>
                              {/* On: "text-orange-700", Off: "text-gray-500" */}
                              {/* <span>($290 / yr)</span> */}
                            </p>
                            {/* On: "text-orange-700", Off: "text-gray-500" */}
                            <p id="plan-option-limit-0" className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-right">
                              {plan.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </fieldset>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">Currently active plan:</span>
                    <span className="text-sm ml-3">{subscription ? subscription.planId : "Free"}</span>
                    {subscription && (
                      <span className="text-sm text-gray-500 ml-3">
                        paid until {subscription.paidUntilDate} -{" "}
                        {subscription.canceledDate ? (
                          <>
                            cancelled on {subscription.canceledDate} -{" "}
                            <a
                              href="#"
                              onClick={handleSubscriptionRestore}
                              className="text-sm text-green-600 hover:text-green-900"
                            >
                              restore subscription
                            </a>
                          </>
                        ) : (
                          <>
                            <a
                              href="#"
                              onClick={handleSubscriptionCancel}
                              className="text-sm text-green-600 hover:text-green-900"
                            >
                              cancel subscription
                            </a>
                          </>
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    className="bg-gray-800 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  >
                    Subscribe to selected plan
                  </button>
                </div>
              </div>
            </form>
          </section>
          {/* Billing history */}
          <section aria-labelledby="billing_history_heading">
            <div className="bg-white pt-6 shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 sm:px-6">
                <h2 id="billing_history_heading" className="text-lg leading-6 font-medium text-gray-900">
                  Billing history
                </h2>
              </div>
              <div className="mt-6 flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden border-t border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Invoice
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Description
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                            {/*
                    `relative` is added here due to a weird bug in Safari that causes `sr-only` headings to introduce overflow on the body on mobile.
                  */}
                            <th
                              scope="col"
                              className="relative px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              <span className="sr-only">View receipt</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {invoices &&
                            invoices.map((invoice) => (
                              <tr key={invoice.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {dayjs(invoice.createdAt).format("DD/MM/YYYY")}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {invoice.invoiceNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.status}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <a
                                    href={invoice.publicUrl}
                                    className="text-green-600 hover:text-green-900"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    View invoice
                                  </a>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
