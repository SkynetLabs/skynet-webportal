-- luacheck: ignore ngx

local skynet_scanner = require("skynet.scanner")
local skylink = "AQBG8n_sgEM_nlEp3G0w3vLjmdvSZ46ln8ZXHn-eObZNjA"

describe("scan_skylink", function()
    before_each(function()
        stub(ngx.timer, "at")
    end)

    after_each(function()
        ngx.timer.at:revert()
    end)

    it("should schedule a timer when skylink is provided", function()
        ngx.timer.at.invokes(function() return true, nil end)

        skynet_scanner.scan_skylink(skylink)

        assert.stub(ngx.timer.at).was_called_with(0, skynet_scanner.scan_skylink_timer, skylink)
    end)

    it("should log an error if timer failed to create", function()
        stub(ngx, "log")

        ngx.timer.at.invokes(function() return false, "such a failure" end)

        skynet_scanner.scan_skylink(skylink)

        assert.stub(ngx.timer.at).was_called_with(0, skynet_scanner.scan_skylink_timer, skylink)
        assert.stub(ngx.log).was_called_with(ngx.ERR, "Failed to create timer: ", "such a failure")

        ngx.log:revert()
    end)

    it("should not schedule a timer if skylink is not provided", function()
        skynet_scanner.scan_skylink()

        assert.stub(ngx.timer.at).was_not_called()
    end)
end)

describe("scan_skylink_timer", function()
    before_each(function()
        stub(ngx, "log")
    end)

    after_each(function()
        local resty_http = require("resty.http")

        ngx.log:revert()
        resty_http.new:revert()
    end)

    it("should exit early on premature", function()
        local resty_http = require("resty.http")
        local request_uri = spy.new()
        local httpc = mock({ request_uri = request_uri })
        stub(resty_http, "new").returns(httpc)

        skynet_scanner.scan_skylink_timer(true, skylink)

        assert.stub(request_uri).was_not_called()
        assert.stub(ngx.log).was_not_called()
    end)

    it("should make a post request with skylink to scanner service", function()
        local resty_http = require("resty.http")
        local request_uri = spy.new(function()
            return { status = 200 } -- return 200 success
        end)
        local httpc = mock({ request_uri = request_uri })
        stub(resty_http, "new").returns(httpc)

        skynet_scanner.scan_skylink_timer(false, skylink)

        local uri = "http://10.10.10.101:4000/scan/" .. skylink
        assert.stub(request_uri).was_called_with(httpc, uri, { method = "POST" })
        assert.stub(ngx.log).was_not_called()
    end)

    it("should log message on scanner request failure with response code", function()
        local resty_http = require("resty.http")
        local request_uri = spy.new(function()
            return { status = 404, body = "baz" } -- return 404 failure
        end)
        local httpc = mock({ request_uri = request_uri })
        stub(resty_http, "new").returns(httpc)

        skynet_scanner.scan_skylink_timer(false, skylink)

        local uri = "http://10.10.10.101:4000/scan/" .. skylink
        assert.stub(request_uri).was_called_with(httpc, uri, { method = "POST" })
        assert.stub(ngx.log).was_called_with(
            ngx.ERR,
            "Failed malware-scanner request /scan/AQBG8n_sgEM_nlEp3G0w3vLjmdvSZ46ln8ZXHn-eObZNjA: ",
            "[HTTP 404] baz"
        )
    end)

    it("should log message on scanner request error", function()
        local resty_http = require("resty.http")
        local request_uri = spy.new(function()
            return nil, "foo != bar" -- return error
        end)
        local httpc = mock({ request_uri = request_uri })
        stub(resty_http, "new").returns(httpc)

        skynet_scanner.scan_skylink_timer(false, skylink)

        local uri = "http://10.10.10.101:4000/scan/" .. skylink
        assert.stub(request_uri).was_called_with(httpc, uri, { method = "POST" })
        assert.stub(ngx.log).was_called_with(
            ngx.ERR,
            "Failed malware-scanner request /scan/AQBG8n_sgEM_nlEp3G0w3vLjmdvSZ46ln8ZXHn-eObZNjA: ",
            "foo != bar"
        )
    end)
end)
