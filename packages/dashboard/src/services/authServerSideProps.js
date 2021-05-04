import ky from "ky/umd";

const isProduction = process.env.NODE_ENV === "production";

export default function authServerSideProps(getServerSideProps) {
  return function authenticate(context) {
    if (isProduction && (!("ory_kratos_session" in context.req.cookies) || !("skynet-jwt" in context.req.cookies))) {
      return {
        redirect: {
          permanent: false,
          destination: `/api/accounts/login?return_to=${encodeURIComponent(context.resolvedUrl)}`,
        },
      };
    }

    if (getServerSideProps) {
      const api = ky.create({
        headers: { cookie: context.req.headers.cookie },
        prefixUrl: isProduction ? "http://oathkeeper:4455" : "http://localhost:3000/api/stubs",
      });

      return getServerSideProps(context, api);
    }

    return { props: {} };
  };
}
