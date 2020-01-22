import axios from "axios"
import cors from "cors"
import express, { Request, Response } from "express"
import fileUpload, { UploadedFile } from "express-fileupload"
import proxy from "express-http-proxy"
import requestId from "express-request-id"
import morgan from 'morgan'
import R from "ramda"
import shortid from "shortid"
import { Logger } from "winston"
import logger from "./logger"

const MAX_UPLOAD_FILESIZE = 1000 * 1024 * 1024
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

export class Server {
  public app: express.Express

  constructor(private logger: Logger) { this.boot() }

  private boot() {
    this.app = express()

    this.logger.info("Configuring middleware...")
    this.configureMiddleware()

    this.logger.info("Configuring routes...")
    this.configureRoutes()

    this.logger.info("Booting server...")
    const port = parseInt(process.env.PORT, 10) || 3000
    this.app.listen(port, () => {
      this.logger.info(`Listening on port ${port}`)
    })
  }

  private configureMiddleware() {
    // add morgan middleware (HTTP request logging)
    const options = {
      stream: {
        write: (msg: string) => { this.logger.info(msg) }
      }
    }
    this.app.use(morgan("combined", options));

    // add request id middleware (add unique id to X-Request-Id header)
    this.app.use(requestId())

    // configure CORS (simply enable all CORS requests)
    this.app.use(cors())

    // configure upload limits
    this.app.use(fileUpload({ limits: { fileSize: MAX_UPLOAD_FILESIZE } }))
  }

  private configureRoutes() {
    this.app.get("/sialink/:hash", this.handleSialinkGET.bind(this))
    this.app.post("/siafile", this.handleSiafilePOST.bind(this))
    this.app.post("/linkfile", this.handleLinkfilePOST.bind(this))
  }

  private handleSialinkGET() {
    return proxy(`${SIAD_ENDPOINT}/renter/sialink`, {
      proxyReqOptDecorator: (opts, _) => {
        opts.headers["User-Agent"] = "Sia-Agent"
        return opts
      },
      proxyReqPathResolver: req => {
        const { hash } = req.params
        return `/renter/sialink/${hash}`
      }
    })
  }

  private async handleLinkfilePOST(req: Request, res: Response): Promise<Response> {
    const file = selectFile(req) as UploadedFile
    const uid = shortid.generate()

    this.logger.info(`POST linkfile w/name ${file.name} and uid ${uid}`)

    try {
      const { data } = await siad.post(
        `/renter/linkfile/linkfiles/${uid}`,
        file.data,
        {
          maxContentLength: MAX_UPLOAD_FILESIZE,
          params: { name: file.name }
        }
      )
      return res.send(data)
    } catch (err) {
      const { message } = err;
      this.logger.error(message)
      return res.status(500).send({ error: err.message })
    }
  }

  private async handleSiafilePOST(req: Request, res: Response): Promise<Response> {
    const file = selectFile(req) as UploadedFile
    const selectContentLength = R.path(["headers", "Content-Length"])
    const cl = selectContentLength(req)

    this.logger.info(`POST siafile ${file.name} w/contentlength ${cl}`)

    try {
      const { data: stream, headers } = await siad.post(
        "/renter/stream",
        file.data,
        { responseType: "stream" }
      )

      const splitFilename = R.compose(R.head, R.split(".sia"))
      const fileName = R.compose(splitFilename, pName)(file)

      res.set(
        "Content-Disposition",
        `attachment; filename="${fileName}"; filename*="${fileName}"`
      )
      res.set("Content-Length", headers["Content-Length"])
      return stream.pipe(res)
    } catch (err) {
      const { message } = err;
      this.logger.error(message)
      return res.status(500).send({ error: err.message })
    }
  }
}

module.exports = new Server(logger).app
