/*
export async function handler (req: object) {
  return {
    statusCode: 201,
    headers: {
      'content-type': 'application/json; charset=utf8',
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
    },
    body: JSON.stringify({env: Deno.env.toObject(), version: Deno.version, build: Deno.build})
  }
}*/

import { createClient } from "https://denopkg.com/chiefbiiko/dynamodb/mod.ts";

export async function handler() {
  
  const env = Deno.env.toObject()
  
  let env = env.NODE_ENV === 'testing'? 'staging' : (env.NODE_ENV || 'staging')
  let scopeID = env.BEGIN_DATA_SCOPE_ID || env.ARC_APP_NAME || 'sandbox'
  let dataID = `${env}#${table}#${key}`
  
  
  let dyno = createClient();
  let result = await dyno.query({
        TableName: env.BEGIN_DATA_TABLE_NAME,
        Select: 'COUNT',
        KeyConditionExpression: '#scopeID = :scopeID and begins_with(#dataID, :dataID)',
        ExpressionAttributeNames: {
          '#scopeID': 'scopeID',
          '#dataID': 'dataID'
        },
        ExpressionAttributeValues: {
          ':scopeID': scopeID,
          ':dataID': dataID.replace('#UNKNOWN', ''),
        }
      })
  
  return {statusCode: 200, body: JSON.stringify(result)}
}
