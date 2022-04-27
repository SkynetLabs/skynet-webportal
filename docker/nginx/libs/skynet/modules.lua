local _M = {}

local utils = require("utils")

function _M.is_enabled(module_abbr)
    if type(module_abbr) ~= "string" or module_abbr:len() ~= 1 then
        error("Module abbreviation '" .. tostring(module_abbr) .. "' should be exactly one character long string")
    end

    local enabled_modules = utils.getenv("PORTAL_MODULES")

    if not enabled_modules then
        return false
    end

    return enabled_modules:find(module_abbr) ~= nil
end

function _M.is_disabled(module_abbr)
    return not _M.is_enabled(module_abbr)
end

return _M
