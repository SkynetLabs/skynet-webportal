import Link from "next/link";
import { useRouter } from "next/router";
import accountsApi from "../../services/accountsApi";
import useAnonRoute from "../../services/useAnonRoute";
import React from "react";

export default function Recover() {
  useAnonRoute(); // ensure user is not logged in

  const router = useRouter();
  const [error, setError] = React.useState("");
  const [confirmed, setConfirmed] = React.useState(false);

  React.useEffect(() => {
    async function confirm() {
      try {
        await accountsApi.get("user/confirm", { searchParams: { token: router.query.token } });

        setConfirmed(true);

        setTimeout(() => {
          router.push("/");
        }, 5000);
      } catch (error) {
        if (error.response) {
          const data = await error.response.json();

          setError(data.message ?? error.toString());
        } else {
          setError(error.toString());
        }
      }
    }

    if (router.query.token) confirm();
  }, [router, setConfirmed]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {!confirmed && !error && (
          <h2 className="mt-6 text-center text-xl text-gray-900">Confirming your email, please wait.</h2>
        )}
        {confirmed && (
          <h2 className="mt-6 text-center text-xl">
            Email confirmed! You will be redirected to the{" "}
            <Link href="/">
              <a className="text-primary hover:text-primary-light">dashboard</a>
            </Link>{" "}
            in 3 seconds.
          </h2>
        )}
        {error && <h2 className="mt-6 text-center text-xl text-red-900">{error}</h2>}
      </div>
    </div>
  );
}
