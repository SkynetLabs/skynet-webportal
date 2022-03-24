import * as React from "react";
import bytes from "pretty-bytes";
import styled from "styled-components";

import { useUser } from "../contexts/user";
import { PlansProvider } from "../contexts/plans/PlansProvider";
import useActivePlan from "../hooks/useActivePlan";
import DashboardLayout from "../layouts/DashboardLayout";
import { Panel } from "../components/Panel";
import Slider from "../components/Slider/Slider";
import { CheckmarkIcon } from "../components/Icons";
import { Button } from "../components/Button";

const SLIDER_BREAKPOINTS = [
  {
    name: "xl",
    scrollable: true,
    visibleSlides: 4,
  },
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

const bandwidth = (value) => `${bytes(value, { bits: true })}/s`;

const storage = (value) => bytes(value, { binary: true });

const localizedNumber = (value) => value.toLocaleString();

const PlansSlider = () => {
  const { user, error: userError } = useUser();
  const { plans, loading, activePlan, error: plansError } = useActivePlan(user);

  if (userError || plansError) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h3>Oooops!</h3>
        <p>Something went wrong, please try again later.</p>
      </div>
    );
  }

  return (
    <div className="w-full mb-24">
      {!loading && (
        <Slider
          slides={plans.map((plan) => {
            const isHigherThanCurrent = plan.tier > activePlan?.tier;
            const isCurrent = plan.tier === activePlan?.tier;

            return (
              <Panel className="min-h-[620px] px-6 py-10 flex flex-col">
                <h3>{plan.name}</h3>
                <Description>{plan.description}</Description>
                <Price price={plan.price} />

                <div className="text-center my-6">
                  <Button $primary={isHigherThanCurrent} disabled={isCurrent}>
                    {isHigherThanCurrent && "Upgrade"}
                    {isCurrent && "Current"}
                    {!isHigherThanCurrent && !isCurrent && "Choose"}
                  </Button>
                </div>
                {plan.limits && (
                  <ul className="-ml-2">
                    <PlanSummaryItem>
                      Pin up to {storage(plan.limits.storageLimit)} of censorship-resistant storage
                    </PlanSummaryItem>
                    <PlanSummaryItem>
                      Support for up to {localizedNumber(plan.limits.maxNumberUploads)} files
                    </PlanSummaryItem>
                    <PlanSummaryItem>{bandwidth(plan.limits.uploadBandwidth)} upload bandwidth</PlanSummaryItem>
                    <PlanSummaryItem>{bandwidth(plan.limits.downloadBandwidth)} download bandwidth</PlanSummaryItem>
                  </ul>
                )}
              </Panel>
            );
          })}
          breakpoints={SLIDER_BREAKPOINTS}
          scrollerClassName="gap-4 xl:gap-8"
          className="px-8 sm:px-4 md:px-0 lg:px-0"
        />
      )}
    </div>
  );
};

const UpgradePage = () => (
  <PlansProvider>
    <PlansSlider />
  </PlansProvider>
);

UpgradePage.Layout = DashboardLayout;

export default UpgradePage;
