import { notFound } from "next/navigation";
import { getProducts } from "../actions";
import EditForm from "./edit/page";
import { toast } from "sonner";

export const dynamic = 'force-dynamic';

/**
 * Converts a Mongoose document (or any complex object)
 * into a plain JS object safe to send to the client.
 */
function toPlain<T>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? v.toString() : v))
  );
}

export default async function EditPage({ params }: { params: { id: string } }) {
  // 🧠 Step 1: Fetch product by ID
  let productDoc;
  try {
    productDoc = await getProducts(params.id);
  } catch (error) {
    console.error("Error fetching product for edit:", error);
    // Fallback will be handled by the !product check below
    toast.error("Error fetching product for edit");
  }

  // 🧹 Step 2: Convert to plain object (no Mongoose prototype issues)
  const product = productDoc ? toPlain(productDoc) : null;
  console.log(product, "product");

  // 🚫 Handle missing product
  if (!product) {
    notFound();
  }

  // 🪄 Step 3: Pass to client component
  return (
    <div className="min-h-screen bg-background">
      <EditForm product={product} />
    </div>
  );
}
