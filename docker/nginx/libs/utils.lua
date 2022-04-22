local _M = {}

-- utility function for checking if table is empty
function _M.is_table_empty(check)
    -- bind next to local variable to achieve ultimate efficiency
    -- https://stackoverflow.com/a/1252776
    local next = next

    return next(check) == nil
end

-- extract full cookie name and value by its name from cookie string
-- note: name matcher argument is a pattern so you will need to escape
-- any special characters, read more https://www.lua.org/pil/20.2.html
function _M.extract_cookie(cookie_string, name_matcher)
    -- nil cookie string safeguard
    if cookie_string == nil then
        return nil
    end

    local start, stop = string.find(cookie_string, name_matcher .. "=[^;]+")

    if start then
        return string.sub(cookie_string, start, stop)
    end

    return nil
end

-- extract just the cookie value by its name from cookie string
-- note: name matcher argument is a pattern so you will need to escape
-- any special characters, read more https://www.lua.org/pil/20.2.html
function _M.extract_cookie_value(cookie_string, name_matcher)
    local cookie = _M.extract_cookie(cookie_string, name_matcher)

    if cookie == nil then
        return nil
    end

    local value_start = string.find(cookie, "=") + 1

    return string.sub(cookie, value_start)
end

-- utility function that builds on os.getenv to get environment variable value
-- * will always return nil for both unset and empty env vars
-- * parse "boolean": "true" and "1" as true, "false" and "0" as false, throws for others
-- * parse "integer": any numerical string gets converted, otherwise returns nil
function _M.getenv(name, parse)
    local value = os.getenv(name)

    -- treat empty string value as nil to simplify comparisons
    if value == nil or value == "" then
        return nil
    end

    -- do not parse the value
    if parse == nil then
        return value
    end

    -- try to parse as boolean
    if parse == "boolean" then
        if string.lower(value) == "true" or value == "1" then
            return true
        end

        if string.lower(value) == "false" or value == "0" then
            return false
        end

        error("utils.getenv: Parsing value '" .. tostring(value) .. "' to boolean is not supported")
    end

    -- try to parse as integer
    if parse == "integer" then
        return tonumber(value)
    end

    error("utils.getenv: Parsing to '" .. parse .. "' is not supported")
end

return _M
