import * as express from "express"
import * as shortid from "shortid"
import * as fileUpload from "express-fileupload"
import * as R from "ramda"
import * as cors from "cors"
import * as proxy from "express-http-proxy"
import axios from "axios"

const SIAD_ENDPOINT = "http://localhost:9980"

// simple siad connection with static strings
const siad = axios.create({
  baseURL: SIAD_ENDPOINT,
  headers: {
    "User-Agent": "Sia-Agent",
    "Access-Control-Allow-Origin": "*"
  },
  auth: {
    username: "",
    password: "d05bb024715aea0bb734ce057acbae27"
  }
})

// Ramda shared utility functions
const selectFile = R.path(["files", "file"])
const pName = R.prop("name")

declare var __DEV__: boolean

export class Server {
  public app: express.Express
  public port: number

  constructor() {
    this.app = express()
    this.port = this.getPort()
    this.setRoutes()
    this.start()
  }

  private start = (): void => {
    this.app.listen(this.port, this.onListen)
  }

  private onListen = (err: any): void => {
    if (err) {
      console.error(err)
      return
    }

    if (__DEV__) {
      console.log("> in development")
    }

    console.log(`> listening on port ${this.port}`)
  }

  private getPort = (): number => parseInt(process.env.PORT, 10) || 3000

  private setRoutes = (): void => {
    this.app.use(
      cors({
        origin: "*",
        credentials: true
      })
    )
    this.app.use(
      fileUpload({
        limits: { fileSize: 1000 * 1024 * 1024 }
      })
    )
    // siafile
    this.app.post("/siafile", this.postSiaFile)
    // linkfile
    this.app.get(
      "/sialink/:hash",
      proxy("http://localhost:9980/renter/sialink", {
        proxyReqOptDecorator: (opts, _) => {
          opts.headers["User-Agent"] = "Sia-Agent"
          return opts
        },
        proxyReqPathResolver: req => {
          const { hash } = req.params
          return `/renter/sialink/${hash}`
        }
      })
    )
    this.app.post("/linkfile", this.handleLinkUpload)
  }

  private async handleLinkUpload(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    const fileToUpload: any = selectFile(req)
    console.log("file:", fileToUpload)
    const filename = pName(fileToUpload)
    console.log("filename:", filename)
    const uid = shortid.generate()
    console.log("uid:", uid)
    try {
      const { data } = await siad.post(
        `/renter/linkfile/linkfiles/${uid}`,
        fileToUpload.data,
        {
          params: {
            name: filename
          }
        }
      )
      console.log("data is ", data)
      return res.send(data)
    } catch (err) {
      console.log("err", err.message)
      return res.sendStatus(500)
    }
  }

  private async postSiaFile(
    req: express.Request & any,
    res: express.Response
  ): Promise<express.Response> {
    try {
      const file: any = selectFile(req)

      const selectContentLength = R.path(["headers", "Content-Length"])
      const cl = selectContentLength(req)
      console.log("cl is", cl)

      console.log("file is", file)

      const { data: stream, headers } = await siad.post(
        "/renter/stream",
        file.data,
        {
          responseType: "stream"
        }
      )
      const contentLength = headers["Content-Length"]

      const splitFilename = R.compose(R.head, R.split(".sia"))
      const fileName = R.compose(splitFilename, pName)(file)

      res.set(
        "Content-Disposition",
        `attachment; filename="${fileName}"; filename*="${fileName}"`
      )
      res.set("Content-Length", contentLength)
      stream.pipe(res)
    } catch (e) {
      console.log("postSiaFile err:", e)
      return res.json({ error: e.message })
    }
  }
}

module.exports = new Server().app
