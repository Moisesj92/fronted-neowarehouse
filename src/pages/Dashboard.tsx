import { useState, useEffect } from "react";
import { Heading, Text } from "../components/ui";
import { productsApi } from "../api/products.api";
import type { Product } from "../api/products.api";
import {
  CurrencyDollarIcon,
  CubeIcon,
  ShoppingCartIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

interface DashboardStats {
  totalInventoryValue: number;
  totalProducts: number;
  totalStock: number;
  lowStockProducts: number;
  averagePrice: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInventoryValue: 0,
    totalProducts: 0,
    totalStock: 0,
    lowStockProducts: 0,
    averagePrice: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const products = await productsApi.getAll();
      calculateStats(products);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (products: Product[]) => {
    const totalInventoryValue = products.reduce(
      (sum, product) => sum + product.price * product.stock,
      0
    );

    const totalProducts = products.length;

    const totalStock = products.reduce(
      (sum, product) => sum + product.stock,
      0
    );

    // Productos con stock bajo (menos de 10 unidades)
    const lowStockProducts = products.filter(
      (product) => product.stock < 10
    ).length;

    const averagePrice =
      totalProducts > 0
        ? products.reduce((sum, product) => sum + product.price, 0) /
          totalProducts
        : 0;

    setStats({
      totalInventoryValue,
      totalProducts,
      totalStock,
      lowStockProducts,
      averagePrice,
    });
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
  }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    subtitle?: string;
  }) => (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Text className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {title}
          </Text>
          <Heading className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            {value}
          </Heading>
          {subtitle && (
            <Text className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
              {subtitle}
            </Text>
          )}
        </div>
        <div className={`rounded-full p-3 ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Heading className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Dashboard
          </Heading>
          <Text className="text-zinc-600 dark:text-zinc-400 mt-1">
            Resumen del inventario y estadísticas
          </Text>
        </div>
        <div className="text-center py-12">
          <Text className="text-zinc-600 dark:text-zinc-400">
            Cargando estadísticas...
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Heading className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Dashboard
        </Heading>
        <Text className="text-zinc-600 dark:text-zinc-400 mt-1">
          Resumen del inventario y estadísticas
        </Text>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Valor Total del Inventario"
          value={`$${stats.totalInventoryValue.toLocaleString("es-CL")}`}
          icon={CurrencyDollarIcon}
          color="bg-green-500"
          subtitle="Inversión total en productos"
        />

        <StatCard
          title="Total de Productos"
          value={stats.totalProducts}
          icon={CubeIcon}
          color="bg-blue-500"
          subtitle="Productos diferentes en catálogo"
        />

        <StatCard
          title="Unidades en Stock"
          value={stats.totalStock.toLocaleString("es-CL")}
          icon={ShoppingCartIcon}
          color="bg-purple-500"
          subtitle="Total de unidades disponibles"
        />

        <StatCard
          title="Productos con Stock Bajo"
          value={stats.lowStockProducts}
          icon={ChartBarIcon}
          color={stats.lowStockProducts > 0 ? "bg-red-500" : "bg-gray-500"}
          subtitle="Menos de 10 unidades"
        />
      </div>
    </div>
  );
}
