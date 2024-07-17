import Phone from "@/components/phone";
import {cn, formatPrice} from "@/lib/utils";
import {BillingAddress, Configuration, Order, ShippingAddress} from "@prisma/client";
import {COLORS} from "@/validators/option-validator";
import {BASE_PRICE, PRODUCT_PRICES} from "@/config/products";
import {getOrderStatusText} from "@/app/your-orders/page";

const Details = ({order}: {
    order: Order & { configuration: Configuration, shippingAddress: ShippingAddress, billingAddress: BillingAddress }
}) => {
    const configuration = order.configuration;
    const billingAddress = order.billingAddress;
    const shippingAddress = order.shippingAddress;
    const tw = COLORS.find((supportColor) => supportColor.value === configuration.color)?.tw
    return (<div
            className="mt-20 flex flex-col text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:grid md:gap-x-8 lg:gap-x-12">
            <div className="md:col-span-4 md:row-span-2 md:row-end-2 lg:col-span-3">
                <Phone
                    className={cn(`bg-${tw}`, "max-w-[150px] md:max-w-full")}
                    imgSrc={configuration.croppedImageUrl!}
                />
            </div>
            <div className=" md:col-span-8 md:grid-cols-4 space-y-6">
                
                <div className={"flex justify-between"}>
                    <div className=" text-sm font-medium">
                        <p className="text-zinc-900">Order number</p>
                        <p className="mt-2 text-zinc-500">{order.id}</p>
                    </div>
                    <span
                        className="me-2 h-fit w-fit rounded border border-yellow-300 bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-gray-700 dark:text-yellow-300">
                      {getOrderStatusText(order.status)}
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-x-6 border-t border-zinc-200 pt-10 text-sm">
                    <div>
                        <p className="font-medium text-zinc-900">Purchase Date</p>
                        <p className="mt-2 text-zinc-700">{order.createdAt.toLocaleDateString()}</p>
                    </div>
                
                
                </div>
                
                
                <div className={"border-t border-zinc-200"}>
                    <div className="grid grid-cols-2 gap-x-6 py-10 text-sm">
                        <div>
                            <p className="font-medium text-gray-900">Shipping address</p>
                            <div className="mt-2 text-zinc-700">
                                <address className="not-italic">
                                    <span className="block">{shippingAddress?.name}</span>
                                    <span className="block">{shippingAddress?.street}</span>
                                    <span className="block">
                    {shippingAddress?.postalCode} {shippingAddress?.city}
                  </span>
                                </address>
                            </div>
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Billing address</p>
                            <div className="mt-2 text-zinc-700">
                                <address className="not-italic">
                                    <span className="block">{billingAddress?.name}</span>
                                    <span className="block">{billingAddress?.street}</span>
                                    <span className="block">
                    {billingAddress?.postalCode} {billingAddress?.city}
                  </span>
                                </address>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-6 border-t border-zinc-200 py-10 text-sm">
                        <div>
                            <p className="font-medium text-zinc-900">Payment status</p>
                            <p className="mt-2 text-zinc-700">Paid</p>
                        </div>
                        
                        <div>
                            <p className="font-medium text-zinc-900">Shipping Method</p>
                            <p className="mt-2 text-zinc-700">
                                DHL, takes up to 3 working days
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8 md:col-span-4">
                    <div className="flow-root text-sm">
                        <div className="mt-2 flex items-center justify-between py-1">
                            <p className="text-gray-600">Base price</p>
                            <p className="font-medium text-gray-900">
                                {formatPrice(BASE_PRICE)}
                            </p>
                        </div>
                        
                        {configuration.finish === "textured" ? (
                            <div className="mt-2 flex items-center justify-between py-1">
                                <p className="text-gray-600">Textured finish</p>
                                <p className="font-medium text-gray-900">
                                    {formatPrice(PRODUCT_PRICES.finish.textured)}
                                </p>
                            </div>
                        ) : null}
                        
                        {configuration.material === "polycarbonate" ? (
                            <div className="mt-2 flex items-center justify-between py-1">
                                <p className="text-gray-600">Soft polycarbonate material</p>
                                <p className="font-medium text-gray-900">
                                    {formatPrice(PRODUCT_PRICES.material.polycarbonate)}
                                </p>
                            </div>
                        ) : null}
                        
                        <div className="my-2 h-px bg-gray-200"/>
                        
                        <div className="flex items-center justify-between py-2">
                            <p className="font-semibold text-gray-900">Order total</p>
                            <p className="font-semibold text-gray-900">
                                {formatPrice(order.amount)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Details