import dayjs from "dayjs";

// TODO: this is not an accurate information, we need this data from the backend
const LatestPayment = ({ user }) => (
  <div className="flex mt-6 justify-between items-center bg-palette-100/50 py-4 px-6 border-l-2 border-primary">
    <div className="flex flex-col lg:flex-row">
      <span>Latest payment</span>
      <span className="lg:before:content-['-'] lg:before:px-2 text-xs lg:text-base">
        {dayjs(user.subscribedUntil).subtract(1, "month").format("MM/DD/YYYY")}
      </span>
    </div>
    <div>
      <span className="rounded py-1 px-2 bg-primary/10 font-sans text-primary uppercase text-xs">Success</span>
    </div>
  </div>
);

export default LatestPayment;
