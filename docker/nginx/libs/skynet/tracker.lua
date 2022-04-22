local _M = {}

local utils = require("utils")

function _M.track_download_timer(premature, skylink, status, auth_headers, body_bytes_sent)
    if premature then return end

    local httpc = require("resty.http").new()
    local query = table.concat({ "status=" .. status, "bytes=" .. body_bytes_sent }, "&")

    -- 10.10.10.70 points to accounts service (alias not available when using resty-http)
    local res, err = httpc:request_uri("http://10.10.10.70:3000/track/download/" .. skylink .. "?" .. query, {
        method = "POST",
        headers = auth_headers,
    })

    if err or (res and res.status ~= 204) then
        local error_response = err or ("[HTTP " .. res.status .. "] " .. res.body)
        ngx.log(ngx.ERR, "Failed accounts service request /track/download/" .. skylink .. ": ", error_response)
    end
end

function _M.track_download(skylink, status_code, auth_headers, body_bytes_sent)
    local has_auth_headers = not utils.is_table_empty(auth_headers)
    local status_success = status_code >= 200 and status_code <= 299

    if skylink and status_success and has_auth_headers then
        local ok, err = ngx.timer.at(0, _M.track_download_timer, skylink, status_code, auth_headers, body_bytes_sent)
        if not ok then ngx.log(ngx.ERR, "Failed to create timer: ", err) end
    end
end

function _M.track_upload_timer(premature, skylink, auth_headers, uploader_ip)
    if premature then return end

    local httpc = require("resty.http").new()

    -- set correct content type header and include auth headers
    local headers = {
        ["Content-Type"] = "application/x-www-form-urlencoded",
    }
    for key, value in ipairs(auth_headers) do
        headers[key] = value
    end

    -- 10.10.10.70 points to accounts service (alias not available when using resty-http)
    local res, err = httpc:request_uri("http://10.10.10.70:3000/track/upload/" .. skylink, {
        method = "POST",
        headers = headers,
        body = "ip=" .. uploader_ip,
    })

    if err or (res and res.status ~= 204) then
        local error_response = err or ("[HTTP " .. res.status .. "] " .. res.body)
        ngx.log(ngx.ERR, "Failed accounts service request /track/upload/" .. skylink .. ": ", error_response)
    end
end

function _M.track_upload(skylink, status_code, auth_headers, uploader_ip)
    local status_success = status_code >= 200 and status_code <= 299

    if skylink and status_success then
        local ok, err = ngx.timer.at(0, _M.track_upload_timer, skylink, auth_headers, uploader_ip)
        if not ok then ngx.log(ngx.ERR, "Failed to create timer: ", err) end
    end
end

function _M.track_registry_timer(premature, auth_headers, request_method)
    if premature then return end

    local httpc = require("resty.http").new()

    -- based on request method we assign a registry action string used
    -- in track endpoint namely "read" for GET and "write" for POST
    local registry_action = request_method == "GET" and "read" or "write"

    -- 10.10.10.70 points to accounts service (alias not available when using resty-http)
    local res, err = httpc:request_uri("http://10.10.10.70:3000/track/registry/" .. registry_action, {
        method = "POST",
        headers = auth_headers,
    })

    if err or (res and res.status ~= 204) then
        local error_response = err or ("[HTTP " .. res.status .. "] " .. res.body)
        ngx.log(ngx.ERR, "Failed accounts service request /track/registry/" .. registry_action .. ": ", error_response)
    end
end

function _M.track_registry(status_code, auth_headers, request_method)
    local has_auth_headers = not utils.is_table_empty(auth_headers)
    local tracked_status = status_code == 200 or status_code == 404

    if tracked_status and has_auth_headers then
        local ok, err = ngx.timer.at(0, _M.track_registry_timer, auth_headers, request_method)
        if not ok then ngx.log(ngx.ERR, "Failed to create timer: ", err) end
    end
end

return _M
