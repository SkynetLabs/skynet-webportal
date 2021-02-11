import { serialize } from "cookie";

export default (req, res) => {
  res.setHeader("Set-Cookie", serialize("foo", Math.random(), {}));
  res.redirect(302, req.query.return_to);
};
