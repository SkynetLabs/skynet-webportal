import * as React from "react";
import styled from "styled-components";
import { useStripe } from "@stripe/react-stripe-js";
import cn from "classnames";

import { useUser } from "../contexts/user";
import { PlansProvider } from "../contexts/plans/PlansProvider";
import useActivePlan from "../hooks/useActivePlan";
import DashboardLayout from "../layouts/DashboardLayout";
import { Panel } from "../components/Panel";
import Slider from "../components/Slider/Slider";
import { CheckmarkIcon } from "../components/Icons";
import { Button } from "../components/Button";
import { usePortalSettings } from "../contexts/portal-settings";
import { Alert } from "../components/Alert";
import HighlightedLink from "../components/HighlightedLink";
import { Metadata } from "../components/Metadata";
import accountsService from "../services/accountsService";
import humanBytes from "../lib/humanBytes";
import { Modal } from "../components/Modal";

const PAID_PORTAL_BREAKPOINTS = [
  {
    name: "lg",
    scrollable: true,
    visibleSlides: 3,
  },
  {
    name: "sm",
    scrollable: true,
    visibleSlides: 2,
  },
  {
    scrollable: true,
    visibleSlides: 1,
  },
];

const FREE_PORTAL_BREAKPOINTS = [
  {
    name: "xl",
    scrollable: true,
    visibleSlides: 4,
  },
  ...PAID_PORTAL_BREAKPOINTS,
];

const PlanSummaryItem = ({ children }) => (
  <li className="flex items-start gap-1 my-2">
    <CheckmarkIcon size={32} className="text-primary shrink-0" />
    <div className="mt-1">{children}</div>
  </li>
);

const Description = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-shrink: 0;
  height: 6rem;
`;

const Price = ({ price }) => (
  <div className="my-8 text-center">
    <h2>
      <sup className="text-lg -top-4">$</sup>
      {price}
    </h2>
    <p className="uppercase text-sm font-light -mt-2">per month</p>
  </div>
);

const bandwidth = (value) => `${humanBytes(value, { bits: true })}/s`;

const storage = (value) => humanBytes(value, { binary: true });

const localizedNumber = (value) => value.toLocaleString();

const PlansSlider = () => {
  const { user, error: userError } = useUser();
  const { plans, loading, activePlan, error: plansError } = useActivePlan(user);
  const { settings } = usePortalSettings();
  const [showPaymentError, setShowPaymentError] = React.useState(false);
  const stripe = useStripe();
  // This will be the base plan that we compare upload/download speeds against.
  // On will either be the user's active plan or lowest of available tiers.
  const basePlan = activePlan || plans[0];

  if (userError || plansError) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h3>Oooops!</h3>
        <p>Something went wrong, please try again later.</p>
      </div>
    );
  }

  const handleSubscribe = async (selectedPlan) => {
    try {
      const { sessionId } = await accountsService
        .post("stripe/checkout", {
          json: {
            price: selectedPlan.stripe,
          },
        })
        .json();
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      setShowPaymentError(true);
      console.error(error);
    }
  };

  return (
    <div className="w-full mb-24">
      <Metadata>
        <title>Payments</title>
      </Metadata>
      {settings.isSubscriptionRequired && !activePlan && (
        <Alert $variant="info" className="mb-6">
          <p className="font-semibold mt-0">This Skynet portal requires a paid subscription.</p>
          <p>
            If you're not ready for that yet, you can use your account on{" "}
            <HighlightedLink as="a" href="https://skynetfree.net">
              SkynetFree.net
            </HighlightedLink>{" "}
            to store up to 100GB for free.
          </p>
        </Alert>
      )}
      {!loading && (
        <Slider
          slides={plans.map((plan) => {
            const isHigherThanCurrent = plan.tier > activePlan?.tier;
            const isCurrentPlanPaid = activePlan?.tier > 1;
            const isCurrent = plan.tier === activePlan?.tier;
            const isLower = plan.tier < activePlan?.tier;
            const speed = plan.limits.uploadBandwidth;
            const currentSpeed = basePlan?.limits?.uploadBandwidth;
            const speedChange = speed > currentSpeed ? speed / currentSpeed : currentSpeed / speed;
            const hasActivePlan = Boolean(activePlan);

            return (
              <Panel
                className={cn("min-h-[620px] px-6 py-10 flex flex-col relative h-full shadow-md", {
                  "border border-primary": isCurrent,
                })}
                wrapperClassName="h-full"
              >
                {isCurrent && (
                  <div className="absolute top-0 left-0 w-full h-6 bg-white px-6 rounded-t">
                    <span className="font-sans uppercase font-semibold text-xs bg-palette-100 px-2 py-1.5 rounded-b-md">
                      Current plan
                    </span>
                  </div>
                )}
                <h3>{plan.name}</h3>
                <Description>{plan.description}</Description>
                <Price price={plan.price} />

                <div className="text-center my-6">
                  {(!hasActivePlan || isHigherThanCurrent) &&
                    (isCurrentPlanPaid ? (
                      <Button $primary as="a" href="/api/stripe/billing">
                        Upgrade
                      </Button>
                    ) : (
                      <Button $primary onClick={() => handleSubscribe(plan)}>
                        Upgrade
                      </Button>
                    ))}
                  {isCurrent && <Button disabled>Current</Button>}
                  {isLower && (
                    <Button as="a" href="/api/stripe/billing">
                      Choose
                    </Button>
                  )}
                </div>
                {plan.limits && (
                  <ul className="-ml-2">
                    <PlanSummaryItem>
                      Pin up to {storage(plan.limits.storageLimit)} on decentralized storage
                    </PlanSummaryItem>
                    <PlanSummaryItem>
                      Support for up to {localizedNumber(plan.limits.maxNumberUploads)} files
                    </PlanSummaryItem>
                    <PlanSummaryItem>
                      {speed === currentSpeed
                        ? `${bandwidth(plan.limits.uploadBandwidth)} upload and ${bandwidth(
                            plan.limits.downloadBandwidth
                          )} download`
                        : `${speedChange}X ${
                            speed > currentSpeed ? "faster" : "slower"
                          } upload and download speeds (${bandwidth(plan.limits.uploadBandwidth)} and ${bandwidth(
                            plan.limits.downloadBandwidth
                          )})`}
                    </PlanSummaryItem>
                    <PlanSummaryItem>
                      {plan.limits.maxUploadSize === plan.limits.storageLimit
                        ? "No limit to file upload size"
                        : `Upload files up to ${storage(plan.limits.maxUploadSize)}`}
                    </PlanSummaryItem>
                  </ul>
                )}
              </Panel>
            );
          })}
          breakpoints={settings.isSubscriptionRequired ? PAID_PORTAL_BREAKPOINTS : FREE_PORTAL_BREAKPOINTS}
          className="px-8 sm:px-4 md:px-0 lg:px-0 mt-10"
        />
      )}
      {showPaymentError && (
        <Modal onClose={() => setShowPaymentError(false)}>
          <h3>Oops! 😔</h3>
          <p className="font-semibold">There was an error contacting our payments provider</p>
          <p>Please try again later</p>
        </Modal>
      )}
    </div>
  );
};

const PaymentsPage = () => (
  <PlansProvider>
    <PlansSlider />
  </PlansProvider>
);

PaymentsPage.Layout = DashboardLayout;

export default PaymentsPage;
