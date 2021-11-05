local _M = {}

local function str_split(str, size)
    local result = {}
    for i=1, #str, size do
        table.insert(result, str:sub(i, i + size - 1))
    end
    return result
end

local function dec2bin(num)
    local result = ""
    repeat
        local halved = num / 2
        local int, frac = math.modf(halved)
        num = int
        result = math.ceil(frac) .. result
    until num == 0
    return result
end

local base32Alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUV"

-- this is not a full implementation of base32 decoder, it doesn't 
-- cover all edge cases but it works good enough for decoding skylinks
-- source: https://gist.github.com/linsonder6/3202fc06832f97905aab2a8a492a80de
function decodeBase32Skylink(str)
    local binary = string.upper(str):gsub(".", function (char)
        if char == "=" then return "" end
        local pos = string.find(base32Alphabet, char)
        pos = pos - 1
        return string.format("%05u", dec2bin(pos))
    end)

    local bytes = str_split(binary, 8)

    local decoded = {}
    for _, byte in pairs(bytes) do
        table.insert(decoded, string.char(tonumber(byte, 2)))
    end

    local concatenated = table.concat(decoded)

    -- decoded skylink is always 34 bytes, anything
    -- else is leftover and should be discarded
    return string.sub(concatenated, 1, 34)
end

-- parse any skylink and return base64 version
function _M.parse(skylink)
    if string.len(skylink) == 55 then
        local base64 = require("ngx.base64")
        local decoded = decodeBase32Skylink(skylink)

        return base64.encode_base64url(decoded)
    end

    return skylink
end

return _M
