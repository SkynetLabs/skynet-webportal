local _M = {}

local basexx = require("basexx")

-- parse any skylink and return base64 version
function _M.parse(skylink)
    if string.len(skylink) == 55 then
        local decoded = basexx.from_basexx(string.upper(skylink), "0123456789ABCDEFGHIJKLMNOPQRSTUV", 5)

        return basexx.to_url64(decoded)
    end

    return skylink
end

return _M
