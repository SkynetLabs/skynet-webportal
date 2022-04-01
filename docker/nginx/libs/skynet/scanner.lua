local _M = {}

function _M.scan_skylink_timer(premature, skylink)
    if premature then return end

    local httpc = require("resty.http").new()

    -- 10.10.10.101 points to malware-scanner service (alias not available when using resty-http)
    local res, err = httpc:request_uri("http://10.10.10.101:4000/scan/" .. skylink, {
        method = "POST",
    })

    if err or (res and res.status ~= ngx.HTTP_OK) then
        local error_response = err or ("[HTTP " .. res.status .. "] " .. res.body)
        ngx.log(ngx.ERR, "Failed malware-scanner request /scan/" .. skylink .. ": ", error_response)
    end
end

function _M.scan_skylink(skylink)
    if not skylink then return end

    local ok, err = ngx.timer.at(0, _M.scan_skylink_timer, skylink)
    if not ok then ngx.log(ngx.ERR, "Failed to create timer: ", err) end
end

return _M
