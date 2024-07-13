import {getOrderDetails} from "@/app/your-orders/[id]/actions";
import {notFound} from "next/navigation";
import Details from "@/app/your-orders/[id]/details";

const Page = async ({params}: { params: { id: string } }) => {
    const order = await getOrderDetails(params.id)
    if (!order) {
        return notFound()
    }
    console.log(order)

    return <div className={"pb-5 mx-40"}>
        <Details order={order}/>
    </div>

}
export default Page