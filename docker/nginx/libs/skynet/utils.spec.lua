-- luacheck: ignore io

local utils = require('utils')
local skynet_utils = require('skynet.utils')

describe("authorization_header", function()
    local apipassword = "ddd0c1430fbf2708"
    local expected_header = "Basic OmRkZDBjMTQzMGZiZjI3MDg"

    it("reads SIA_API_PASSWORD from env variable and returns a header", function()
        -- stub getenv on SIA_API_PASSWORD
        stub(utils, "getenv")
        utils.getenv.on_call_with("SIA_API_PASSWORD").returns(apipassword)

        local header = skynet_utils.authorization_header()

        assert.is_equal(header, expected_header)

        -- revert stub to original function
        utils.getenv:revert()
    end)

    it("uses /data/sia/apipassword file if SIA_API_PASSWORD env var is missing", function()
        -- stub /data/sia/apipassword file
        stub(io, "open")
        io.open.on_call_with("/data/sia/apipassword", "rb").returns(mock({
            read = spy.new(function() return apipassword end),
            close = spy.new()
        }))

        local header = skynet_utils.authorization_header()

        assert.is_equal(header, expected_header)

        -- revert stub to original function
        io.open:revert()
    end)

    it("should choose env variable over file if both are available", function()
        -- stub getenv on SIA_API_PASSWORD
        stub(utils, "getenv")
        utils.getenv.on_call_with("SIA_API_PASSWORD").returns(apipassword)

        -- stub /data/sia/apipassword file
        stub(io, "open")
        io.open.on_call_with("/data/sia/apipassword", "rb").returns(mock({
            read = spy.new(function() return "foooooooooooooo" end),
            close = spy.new()
        }))

        local header = skynet_utils.authorization_header()

        assert.is_equal(header, "Basic OmRkZDBjMTQzMGZiZjI3MDg")

        -- revert stubs to original function
        utils.getenv:revert()
        io.open:revert()
    end)

    it("should error out if neither env variable is available nor file exists", function()
        assert.has_error(function()
            skynet_utils.authorization_header()
        end, "Error reading /data/sia/apipassword file")
    end)
end)
