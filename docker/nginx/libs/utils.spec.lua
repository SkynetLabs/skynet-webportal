local utils = require('utils')

describe("is_table_empty", function()
    it("should return true for empty table", function()
        assert.is_true(utils.is_table_empty({}))
    end)

    it("should return false for not empty table", function()
        assert.is_false(utils.is_table_empty({ ["foo"] = "bar" }))
    end)
end)

describe("extract_cookie", function()
    local cookie_string = "aaa=bbb; skynet-jwt=MTY0NzUyr8jD-ytiWtspm0tGabKfooxeIDuWcXhJ3lnY0eEw==; xxx=yyy"

    it("should return nil if cookie string is nil", function()
        local cookie = utils.extract_cookie_value(nil, "aaa")

        assert.is_nil(cookie)
    end)

    it("should return nil if cookie name is not found", function()
        local cookie = utils.extract_cookie(cookie_string, "foo")

        assert.is_nil(cookie)
    end)

    it("should return cookie if cookie_string starts with that cookie name", function()
        local cookie = utils.extract_cookie(cookie_string, "aaa")

        assert.are.equals(cookie, "aaa=bbb")
    end)

    it("should return cookie if cookie_string ends with that cookie name", function()
        local cookie = utils.extract_cookie(cookie_string, "xxx")

        assert.are.equals(cookie, "xxx=yyy")
    end)

    it("should return cookie with custom matcher", function()
        local cookie = utils.extract_cookie(cookie_string, "skynet[-]jwt")

        assert.are.equals(cookie, "skynet-jwt=MTY0NzUyr8jD-ytiWtspm0tGabKfooxeIDuWcXhJ3lnY0eEw==")
    end)
end)

describe("extract_cookie_value", function()
    local cookie_string = "aaa=bbb; skynet-jwt=MTY0NzUyr8jD-ytiWtspm0tGabKfooxeIDuWcXhJ3lnY0eEw==; xxx=yyy"

    it("should return nil if cookie string is nil", function()
        local value = utils.extract_cookie_value(nil, "aaa")

        assert.is_nil(value)
    end)

    it("should return nil if cookie name is not found", function()
        local value = utils.extract_cookie_value(cookie_string, "foo")

        assert.is_nil(value)
    end)

    it("should return value if cookie_string starts with that cookie name", function()
        local value = utils.extract_cookie_value(cookie_string, "aaa")

        assert.are.equals(value, "bbb")
    end)

    it("should return cookie if cookie_string ends with that cookie name", function()
        local value = utils.extract_cookie_value(cookie_string, "xxx")

        assert.are.equals(value, "yyy")
    end)

    it("should return cookie with custom matcher", function()
        local value = utils.extract_cookie_value(cookie_string, "skynet[-]jwt")

        assert.are.equals(value, "MTY0NzUyr8jD-ytiWtspm0tGabKfooxeIDuWcXhJ3lnY0eEw==")
    end)
end)
