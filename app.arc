@app
begin-app

@begin
lint "deno --version"

@http
get /

@tables
data
  scopeID *String
  dataID **String
  ttl TTL
