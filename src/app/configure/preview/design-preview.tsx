"use client"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"

import { COLORS, MODELS } from "@/validators/option-validator"
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"
import { Configuration } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { ArrowRight, Check } from "lucide-react"
import Confetti from "react-dom-confetti"

import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products"

import { cn, formatPrice } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

import LoginModal from "@/components/login-modal"
import Phone from "@/components/phone"

import { createCheckoutSession } from "@/app/configure/preview/action"

export default function DesignPreview({
  configuration,
}: {
  configuration: Configuration
}) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useKindeBrowserClient()
  const [showConfetti, setShowConfetti] = useState<boolean>(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false)
  const { color, model, material, finish, id } = configuration
  const tw = COLORS.find((supportColor) => supportColor.value === color)?.tw
  const { label: modelLabel } = MODELS.options.find(
    ({ value }) => value === model
  )!

  let totalPrice = BASE_PRICE
  if (material === "polycarbonate")
    totalPrice += PRODUCT_PRICES.material.polycarbonate
  if (finish === "textured") totalPrice += PRODUCT_PRICES.finish.textured

  const { mutateAsync: createPaymentSession, isPending } = useMutation({
    mutationKey: ["get-checkout-session"],
    mutationFn: createCheckoutSession,
    onSuccess: ({ url }) => {
      if (url) router.push(url)
      else throw new Error("Unable to retrieve payment URL")
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "There was an error saving your design. Please try again.",
        variant: "destructive",
      })
    },
  })

  useEffect(() => setShowConfetti(true))

  const config = {
    angle: "141",
    spread: 360,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.12,
    duration: "4000",
    stagger: 3,
    width: "14px",
    height: "20px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  }

  const handleCheckout = async () => {
    if (user) {
      createPaymentSession({ configId: id })
    } else {
      localStorage.setItem("configurationId", id)
      setIsLoginModalOpen(true)
    }
  }
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex select-none justify-center overflow-hidden"
      >
        <Confetti
          active={showConfetti}
          //@ts-ignore
          config={config}
        />
      </div>
      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />

      <div className="mt-20 flex flex-col items-center text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:grid md:gap-x-8 lg:gap-x-12">
        <div className="md:col-span-4 md:row-span-2 md:row-end-2 lg:col-span-3">
          <Phone
            className={cn(`bg-${tw}`, "max-w-[150px] md:max-w-full")}
            imgSrc={configuration.croppedImageUrl!}
          />
        </div>

        <div className="mt-6 sm:col-span-9 sm:mt-0 md:row-end-1">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
            Your {modelLabel} Case
          </h3>
          <div className="mt-3 flex items-center gap-1.5 text-base">
            <Check className="size-4 text-blue-500" />
            In stock and ready to ship
          </div>
        </div>

        <div className="text-base sm:col-span-12 md:col-span-9">
          <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
            <div>
              <p className="font-medium text-zinc-950">Highlights</p>
              <ol className="mt-3 list-inside list-disc text-zinc-700">
                <li>Wireless charging compatible</li>
                <li>TPU shock absorption</li>
                <li>Packaging made from recycled materials</li>
                <li>5 year print warranty</li>
              </ol>
            </div>
            <div>
              <p className="font-medium text-zinc-950">Materials</p>
              <ol className="mt-3 list-inside list-disc text-zinc-700">
                <li>High-quality, durable material</li>
                <li>Scratch- and fingerprint resistant coating</li>
              </ol>
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
              <div className="flow-root text-sm">
                <div className="mt-2 flex items-center justify-between py-1">
                  <p className="text-gray-600">Base price</p>
                  <p className="font-medium text-gray-900">
                    {formatPrice(BASE_PRICE)}
                  </p>
                </div>

                {finish === "textured" ? (
                  <div className="mt-2 flex items-center justify-between py-1">
                    <p className="text-gray-600">Textured finish</p>
                    <p className="font-medium text-gray-900">
                      {formatPrice(PRODUCT_PRICES.finish.textured)}
                    </p>
                  </div>
                ) : null}

                {material === "polycarbonate" ? (
                  <div className="mt-2 flex items-center justify-between py-1">
                    <p className="text-gray-600">Soft polycarbonate material</p>
                    <p className="font-medium text-gray-900">
                      {formatPrice(PRODUCT_PRICES.material.polycarbonate)}
                    </p>
                  </div>
                ) : null}

                <div className="my-2 h-px bg-gray-200" />

                <div className="flex items-center justify-between py-2">
                  <p className="font-semibold text-gray-900">Order total</p>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(totalPrice)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end pb-12">
              <Button
                onClick={() => handleCheckout()}
                disabled={isPending}
                loadingText="Checking out"
                isLoading={isPending}
                className="px-4 sm:px-6 lg:px-8"
              >
                Check out <ArrowRight className="ml-1.5 inline h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
