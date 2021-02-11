import superagent from "superagent";
import { serialize } from "cookie";

export default async (req, res) => {
  console.log(Object.keys(req));
  console.log(req.url);
  console.log(req.cookies);
  console.log(req.rawHeaders);
  try {
    const auth = await superagent
      .set("Cookie", serialize("ory_kratos_session", req.cookies.ory_kratos_session))
      .get("/user");

    console.log(auth.header);

    res.setHeader("Set-Cookie", auth.header["set-cookie"]);
  } catch (error) {
    console.log(error);
  }

  res.redirect(302, req.query.return_to);
};
