import dayjs from "dayjs";
import Layout from "../components/Layout";
import useSWR from "swr";
import ky from "ky/umd";
import { useEffect, useState } from "react";

const plans = [
  {
    id: "initial_free",
    tier: 1,
    stripe: null,
    name: "Free",
    price: 0,
    description: "Unlimited bandwidth with throttled speed",
  },
  {
    id: "initial_plus",
    tier: 2,
    stripe: "price_1IO6DLIzjULiPWN6ix1KyCtf",
    name: "Skynet Plus",
    price: 5,
    description: "1 TB premium bandwidth with full speed",
  },
  {
    id: "initial_pro",
    tier: 3,
    stripe: "price_1IO6DgIzjULiPWN6NiaSLEKa",
    name: "Skynet Pro",
    price: 20,
    description: "5 TB premium bandwidth with full speed",
  },
  {
    id: "initial_extreme",
    tier: 4,
    stripe: "price_1IO6DvIzjULiPWN6wHgK35J4",
    name: "Skynet Extreme",
    price: 80,
    description: "20 TB premium bandwidth with full speed",
  },
];

const fetcher = (url) => fetch(url).then((r) => r.json());
const apiPrefix = process.env.NODE_ENV === "development" ? "/api/stubs" : "";
const isFreeTier = (tier) => tier === 1;
const isPaidTier = (tier) => !isFreeTier(tier);

const ActiveBadge = () => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800 ml-3">
      active
    </span>
  );
};

export default function Payments() {
  const { data: user } = useSWR(`${apiPrefix}/user`, fetcher);
  const [selectedPlan, setSelectedPlan] = useState(plans.find(({ tier }) => isFreeTier(tier)));
  const activePlan = plans.find(({ tier }) => (user ? user.tier === tier : isFreeTier(tier)));
  const handleSubscribe = async () => {
    try {
      const price = selectedPlan.stripe;
      const { sessionId } = await ky.post("/api/stripe/createCheckoutSession", { json: { price } }).json();
      const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.log(error); // todo: handle error
    }
  };

  useEffect(() => {
    if (activePlan && isPaidTier(activePlan.tier)) {
      setSelectedPlan(activePlan);
    }
  }, [activePlan, selectedPlan, setSelectedPlan]);

  return (
    <Layout title="Payments">
      <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
        <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
          {/* This example requires Tailwind CSS v2.0+ */}
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Current plan</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{activePlan?.name || "—"}</dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Subscription status</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900 capitalize">
                  {isFreeTier(activePlan?.tier) ? "—" : user?.subscriptionStatus}
                </dd>
              </div>
              {user?.subscriptionCancelAtPeriodEnd && (
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    Your plan will be cancelled on {dayjs(user.subscriptionCancelAt).format("D MMM YYYY")}.
                  </div>
                </div>
              )}
            </div>

            {/* <div className="flex flex-col bg-white overflow-hidden shadow rounded-lg">
              <div className="flex-grow px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">Subscription status</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-grey-900">Active</div>
                    </dd>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">All paid up!</div>
              </div>
            </div> */}

            {/* <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">asdas</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">&mdash;</dd>
              </div>
            </div> */}
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
                              {isFreeTier(activePlan?.tier) && (
                                <input
                                  name="pricing_plan"
                                  type="radio"
                                  className="h-4 w-4 text-orange-500 cursor-pointer focus:ring-gray-900 border-gray-300"
                                  aria-describedby="plan-option-pricing-0 plan-option-limit-0"
                                  checked={plan === selectedPlan}
                                  onChange={() => setSelectedPlan(plan)}
                                />
                              )}
                              <span className="ml-3 font-medium text-gray-900">{plan.name}</span>
                              {activePlan === plan && <ActiveBadge />}
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
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="button"
                    onClick={handleSubscribe}
                    disabled={activePlan === selectedPlan}
                    className="bg-green-800 disabled:bg-gray-300 disabled:text-gray-400 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
              {Boolean(user?.stripeCustomerId) && (
                <div className="text-sm text-gray-500 text-center my-3">
                  To manage your active subscription, payment methods and view your billing history, go to{" "}
                  <a href="/api/stripe/customerPortal" className="text-green-600 hover:text-green-900">
                    Stripe Customer Portal
                  </a>
                </div>
              )}
            </form>
          </section>
        </div>
      </div>
    </Layout>
  );
}
