import ky from "ky/umd";

const isProduction = process.env.NODE_ENV === "production";

export default function authServerSideProps(getServerSideProps) {
  return function authenticate(context) {
    const authCookies = ["ory_kratos_session", "skynet-jwt"];

    if (isProduction && !authCookies.every((cookie) => context.req.cookies[cookie])) {
      // it is higly unusual that some of the cookies would be set but other would not
      if (authCookies.some((cookie) => context.req.cookies[cookie])) {
        console.log(
          "Unexpected auth cookies state!",
          authCookies.map((cookie) => `[${cookie}] is ${context.req.cookies[cookie] ? "set" : "not set"}`)
        );
      }

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
