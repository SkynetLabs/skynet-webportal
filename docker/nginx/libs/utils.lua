local _M = {}

-- utility function for checking if table is empty
function is_table_empty(check)
    -- bind next to local variable to achieve ultimate efficiency
    -- https://stackoverflow.com/a/1252776
    local next = next

    return next(check) == nil
end

return _M