import React, { FC, Suspense } from 'react'

// This secret key, in javascript, never is sent to the client
const SOME_SECRET_API_KEY = 'THIS_IS_A_SECRET_KEY_ONLY_ON_THE_SERVER___WOAH'

const getData = (apiKey: string) => new Promise<string>((resolve) => {
  process.stdout.write(`Received API Key ${apiKey}.\n`)
  setTimeout(() => {
    resolve('response from API')
  }, 3000)
})

// Yes, this component, at it's root, is async.
const Delayed = async () => {
  const data = await getData(SOME_SECRET_API_KEY)
  return (
    <>
      <h2>{data}</h2>
      <i>I dare you to find the key on the client.</i>
    </>
  )
}

const Fallback = () => {
  return (
     <>
      <h2>Loading</h2>
      <i>We sent a secret key, in javascript, to fetch the data. Feel free to look at the source.</i>
    </>
  )
}

// No need for html file or a bundle reference.
const Root: FC = () => {
  return (
    <html>
    <head>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <title>Server Components</title>
    </head>
    <body>
    <Suspense fallback={<Fallback />}>
      {/*// @ts-ignore*/}
      <Delayed />
    </Suspense>
    </body>
    </html>
  )
}


export default Root
