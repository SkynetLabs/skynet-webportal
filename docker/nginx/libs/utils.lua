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

return _M
