import { notFound } from "next/navigation";

import { db } from "@/lib/prisma";

import RestaurantCategories from "./components/categories";
// import RestaurantCategories from "./components/categories";
import RestaurantHeader from "./components/header";

interface RestaurantMenuPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ consumptionMethod: string }>;
}

const isConsumptionMethodValid = (consumptionMethod: string) => {
  return ["DINE_IN", "TAKEAWAY"].includes(consumptionMethod.toUpperCase());
};

const RestaurantMenuPage = async ({
  params,
  searchParams,
}: RestaurantMenuPageProps) => {
  const { slug } = await params;

  const { consumptionMethod } = await searchParams;
  if (!isConsumptionMethodValid(consumptionMethod)) {
    return notFound();
  }

  const restaurant = await db.restaurant.findUnique({ 
    where: { slug }, 
    include: {
        menuCategories: {
            include: {products: true},
        }
    } 
  });
  
  if (!restaurant) {
    return notFound();
  }

  return (
    <div className="relative h-[250px] w-full">
        <RestaurantHeader restaurant={restaurant} />
        <RestaurantCategories restaurant={restaurant} />
    </div>
  );
};

export default RestaurantMenuPage;

// http://localhost:3000/fsw-donalds/menu?consumptionMethod=dine_in