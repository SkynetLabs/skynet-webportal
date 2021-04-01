import dayjs from "dayjs";
import Layout from "../components/Layout";
import ky from "ky/umd";
import { useEffect, useState } from "react";
import authServerSideProps from "../services/authServerSideProps";
import classnames from "classnames";
import prettyBytes from "pretty-bytes";
import config from "../config";
import useAccountsApi from "../services/useAccountsApi";
import { isFreeTier, isPaidTier } from "../services/tiers";

const apiPrefix = process.env.NODE_ENV === "development" ? "/api/stubs" : "";

const ActiveBadge = () => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-200 text-green-800 ml-3">
      active
    </span>
  );
};

export const getServerSideProps = authServerSideProps(async (context, api) => {
  const [user, stats, stripe] = await Promise.all([
    api.get("user").json(),
    api.get("user/stats").json(),
    api.get("stripe/prices").json(),
  ]);
  const plans = [config.tiers.starter, ...stripe].sort((a, b) => a.tier - b.tier);

  return { props: { plans, user, stats } };
});

export default function Payments({ plans, user: initialUserData, stats: initialStatsData }) {
  const { data: user } = useAccountsApi(`${apiPrefix}/user`, { initialData: initialUserData });
  const { data: stats } = useAccountsApi(`${apiPrefix}/user/stats`, { initialData: initialStatsData });
  const [selectedPlan, setSelectedPlan] = useState(plans.find(({ tier }) => isFreeTier(tier)));
  const activePlan = plans.find(({ tier }) => (user ? user.tier === tier : isFreeTier(tier)));
  const handleSubscribe = async () => {
    try {
      const price = selectedPlan.stripe;
      const { sessionId } = await ky.post("/api/stripe/checkout", { json: { price } }).json();
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
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
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

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Storage used</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{prettyBytes(stats.storageUsed)}</dd>
              </div>
            </div>
          </dl>

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
                          <label
                            className={`${classnames({
                              "rounded-tl-md rounded-tr-md": index === 0,
                              "rounded-bl-md rounded-br-md": index === plans.length - 1,
                              "bg-green-50 border-green-200 z-10": plan === selectedPlan,
                              "border-gray-200": plan !== selectedPlan,
                              "cursor-pointer": isFreeTier(user?.tier),
                            })} relative border p-4 flex flex-col md:pl-4 md:pr-6 md:grid md:grid-cols-3`}
                          >
                            <span className="flex items-center text-sm">
                              {isFreeTier(activePlan?.tier) && (
                                <input
                                  name="pricing_plan"
                                  type="radio"
                                  className="h-4 w-4 text-orange-500 focus:ring-gray-900 border-gray-300"
                                  aria-describedby="plan-option-pricing-0 plan-option-limit-0"
                                  checked={plan === selectedPlan}
                                  onChange={() => setSelectedPlan(plan)}
                                />
                              )}
                              <span
                                className={classnames("ml-3 font-medium", {
                                  "text-green-900": plan === selectedPlan,
                                  "text-gray-900": plan !== selectedPlan,
                                })}
                              >
                                {plan.name}
                              </span>
                              {activePlan === plan && <ActiveBadge />}
                            </span>
                            <p id="plan-option-pricing-0" className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-center">
                              <span
                                className={classnames("font-medium", {
                                  "text-green-900": plan === selectedPlan,
                                  "text-gray-900": plan !== selectedPlan,
                                })}
                              >
                                {plan.price ? `$${plan.price} / mo` : "no cost"}
                              </span>
                            </p>
                            <p
                              className={classnames("ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-right", {
                                "text-green-700": plan === selectedPlan,
                                "text-gray-500": plan !== selectedPlan,
                              })}
                            >
                              {plan.description}
                            </p>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </fieldset>
                </div>
                <div className="px-4 py-3 bg-gray-50 sm:px-6 flex flex-col">
                  {user && isPaidTier(user.tier) ? (
                    <div className="text-sm text-gray-500 flex justify-between items-center space-x-4 md:space-x-0 flex-col md:flex-row space-y-4 md:space-y-0">
                      <span className="text-center md:text-left">
                        Use Stripe Customer Portal to manage your active subscription, payment methods and view your
                        billing history
                      </span>
                      <a
                        href="/api/stripe/billing"
                        className="text-right flex-shrink-0 w-full md:w-auto bg-green-800 disabled:bg-gray-300 disabled:text-gray-400 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                      >
                        Stripe Customer Portal
                      </a>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubscribe}
                      disabled={activePlan === selectedPlan}
                      className="self-end text-right w-full md:w-auto bg-green-800 disabled:bg-gray-300 disabled:text-gray-400 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                    >
                      Subscribe
                    </button>
                  )}
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </Layout>
  );
}
