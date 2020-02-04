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

// import * as AxiosLogger from 'axios-logger'
// AxiosLogger.setGlobalConfig({
//   prefixText: 'your prefix',
//   dateFormat: 'HH:MM:ss',
//   status: true,
//   headers: false,
//   data: false
// });
// // add interceptors
// siad.interceptors.request.use(
//   AxiosLogger.requestLogger,
//   AxiosLogger.errorLogger
// );
// siad.interceptors.response.use(
//   AxiosLogger.responseLogger,
//   AxiosLogger.errorLogger
// );

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

    this.logger.info("Verifying connection to siad...")
    this.verifyConnection().then((version: string | null) => {
      if (version) {
        this.logger.info(`siad reachable, version ${version}`)
      }
    })
  }

  private configureMiddleware() {
    // add request id middleware (add unique id to X-Request-Id header)
    this.app.use(requestId())

    // add morgan middleware (HTTP request logging)
    const options = {
      stream: {
        write: (msg: string) => {
          this.logger.info(msg)
        }
      }
    }
    this.app.use(morgan("combined", options));

    // configure CORS (simply enable all CORS requests)
    this.app.use(cors())

    // configure upload limits
    this.app.use(fileUpload({ limits: { fileSize: MAX_UPLOAD_FILESIZE } }))
  }

  private configureRoutes() {
    this.app.post("/siafile", this.handleSiafilePOST.bind(this))
    this.app.post("/skyfile", this.handleSkyfilePOST.bind(this))

    this.app.get(
      "/skylink/:hash",
      proxy("http://127.0.0.1:9980/skynet/skylink/", {
        proxyReqOptDecorator: (opts, _) => {
          opts.headers["User-Agent"] = "Sia-Agent"
          return opts
        },
        proxyReqPathResolver: req => {
          const { hash } = req.params
          return req.query && req.query.attachement
            ? `/skynet/skylink/${hash}?attachment=true`
            : `/skynet/skylink/${hash}`
        }
      })
    )

    this.app.get(
      "/stats", this.handleStatsGET.bind(this)
      // TODO: redirect to protalstats
      // proxy("http://localhost:9980/renter/portalstats", {
      //   proxyReqOptDecorator: (opts, _) => {
      //     opts.headers["User-Agent"] = "Sia-Agent"
      //     return opts
      //   },
      // })
    )
  }

  private async handleStatsGET(req: Request, res: Response): Promise<Response> {
    const mockPSeries = {
      'p80-1': 40,
      'p95-1': 44,
      'p99-1': 48,
      'p80-24': 42,
      'p95-24': 44,
      'p99-24': 46,
      'p80-168': 41,
      'p95-168': 45,
      'p99-168': 49,
    }
    const mockSeries = {
      1: 22,
      24: 438,
      168: 2389,
    }
    const mockSeriesLarge = {
      1: 22,
      24: 438,
      168: 2389,
      720: 12045,
      2160: 63900
    }

    const data = {
      'ttfb': mockPSeries,
      'download_small': mockPSeries,
      'download_throughput': mockPSeries,
      'download_total': mockSeries,
      'upload_small': mockPSeries,
      'upload_throughput': mockPSeries,
      'upload_total': mockSeries,
      'money_spent': mockSeriesLarge,
      'total_files_pinned': 143,
      'total_files_served': mockSeries,
    }

    return res.send(data)
  }

  private async verifyConnection(): Promise<string | null> {
    try {
      const resp = await siad.get('/daemon/version')
      return resp.data.version
    } catch (err) {
      const { message } = err;
      this.logger.error(message)
      return null
    }
  }

  private async handleSkyfilePOST(req: Request, res: Response): Promise<Response> {
    const file = selectFile(req) as UploadedFile
    if (!file) {
      res.status(400).send({ error: "Missing file" })
    }

    const uid = shortid.generate()
    this.logger.info(`POST skyfile w/name ${file.name} and uid ${uid}`)

    try {
      const { data } = await siad.post(
        `/skynet/skyfile/${uid}`,
        file.data,
        {
          maxContentLength: MAX_UPLOAD_FILESIZE,
          params: { filename: file.name }
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
