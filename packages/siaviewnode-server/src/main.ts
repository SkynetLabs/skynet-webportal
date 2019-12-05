import * as express from "express"
import * as fileUpload from "express-fileupload"
import * as R from "ramda"
import * as cors from "cors"
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
        origin: "http://localhost:*",
        credentials: true
      })
    )
    this.app.use(
      fileUpload({
        limits: { fileSize: 10 * 1024 * 1024 }
      })
    )
    this.app.post("/siafile", this.postSiaFile)
    this.app.get("/siafile/download", this.downloadSiaFile)
  }

  private async downloadSiaFile(req, res) {}

  private async postSiaFile(
    req: express.Request & any,
    res: express.Response
  ): Promise<express.Response> {
    const selectFile = R.path(["files", "file"])
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

      const pName = R.prop("name")
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
