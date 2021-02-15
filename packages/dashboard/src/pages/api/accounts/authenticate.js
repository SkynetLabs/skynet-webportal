import superagent from "superagent";

export default async (req, res) => {
  if (req.cookies.ory_kratos_session) {
    try {
      const auth = await superagent
        .post("http://oathkeeper:4455/login")
        .set("cookie", `ory_kratos_session=${req.cookies.ory_kratos_session}`);

      console.log("auth.header", auth.header);
      res.setHeader("Set-Cookie", auth.header["set-cookie"]);
      res.redirect(req.query.return_to ?? "/");
    } catch (error) {
      console.log("error", error);

      // res.redirect(302, "/auth/login"); // credentials were correct but accounts service failed
      res.redirect("/"); // credentials were correct but accounts service failed
    }
  } else {
    res.redirect("/auth/login"); // redirect to login page if kratos session is missing
  }
};
