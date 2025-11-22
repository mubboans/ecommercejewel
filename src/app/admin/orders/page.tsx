import { MainLayout } from "@/components/layout/main-layout";
import { getAllOrders } from "./actions";
import { OrdersTable } from "../../../components/admin/orders-table";

export default async function AdminOrdersPage() {
    const orders = await getAllOrders();

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage and track all customer orders
                        </p>
                    </div>
                </div>
                <OrdersTable initialOrders={orders} />
            </div>
        </MainLayout>
    );
}
