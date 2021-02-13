import superagent from "superagent";

export default async (req, res) => {
  if (req.cookies.ory_kratos_session) {
    try {
      const auth = await superagent
        .post("http://oathkeeper:4455/login")
        .set("cookie", `ory_kratos_session=${req.cookies.ory_kratos_session}`);

      res.setHeader("Set-Cookie", auth.header["set-cookie"]);
    } catch (error) {
      res.redirect(302, "/auth/login"); // credentials were correct but accounts service failed
    }

    res.redirect(302, req.query.return_to ?? "/");
  } else {
    res.redirect(302, "/auth/login"); // redirect to login page if kratos session is missing
  }
};
