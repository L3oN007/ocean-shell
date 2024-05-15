import { Suspense } from "react"

import ThankYou from "./thankyou"

const Page = () => {
  return (
    <Suspense>
      <ThankYou />
    </Suspense>
  )
}
export default Page
