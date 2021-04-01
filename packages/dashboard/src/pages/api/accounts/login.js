import superagent from "superagent";

export default async (req, res) => {
  if (req.cookies.ory_kratos_session) {
    try {
      const { header } = await superagent
        .post("http://oathkeeper:4455/login")
        .set("cookie", `ory_kratos_session=${req.cookies.ory_kratos_session}`);

      res.setHeader("Set-Cookie", header["set-cookie"]);
      res.redirect(req.query.return_to ?? "/");
    } catch (error) {
      // credentials were correct but accounts service failed
      res.redirect("/.ory/kratos/public/self-service/browser/flows/logout");
    }
  } else {
    res.redirect("/auth/login"); // redirect to login page if kratos session is missing
  }
};
