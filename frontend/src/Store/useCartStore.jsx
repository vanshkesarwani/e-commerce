import { create } from "zustand";
import { toast } from "react-hot-toast";
import apiClient from "../api/apiClient";

// ==========================================
// SHOPPING CART & PROMO CODE STORE (ZUSTAND)
// ==========================================
export const useCartStore = create((set, get) => ({
  cart: [],
  selectedItemIds: [], // Track selected cart items for checkout
  coupon: null,
  availableCoupons: [], // Active coupons for suggestions & search
  isLoadingCoupons: false,
  total: 0,
  subtotal: 0,
  allItemsSubtotal: 0,
  isCouponApplied: false,
  isLoading: false,

  /**
   * Fetch all active and valid coupons for suggestions and search bar
   */
  fetchAvailableCoupons: async (search = "") => {
    try {
      set({ isLoadingCoupons: true });
      const query = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
      const response = await apiClient.get(`/coupon/available${query}`);
      set({
        availableCoupons: Array.isArray(response.data) ? response.data : [],
      });
    } catch (error) {
      console.error("Error fetching available coupons:", error.message);
    } finally {
      set({ isLoadingCoupons: false });
    }
  },

  /**
   * Fetch active public coupon (single)
   */
  getMyCoupon: async () => {
    try {
      const response = await apiClient.get("/coupon");
      set({ coupon: response.data });
    } catch (error) {
      console.error("Error fetching active coupon:", error.message);
    }
  },

  /**
   * Validate and apply discount coupon code
   */
  applyCoupon: async (code) => {
    if (!code || !code.trim()) {
      toast.error("Please enter a valid coupon code");
      return;
    }

    try {
      const response = await apiClient.post("/coupon/validate", {
        code: code.trim().toUpperCase(),
      });
      set({ coupon: response.data, isCouponApplied: true });
      get().calculateTotals();
      toast.success(`Coupon ${code.trim().toUpperCase()} applied successfully!`);
    } catch (error) {
      toast.error(error.message || "Failed to apply coupon");
    }
  },

  /**
   * Remove currently applied coupon
   */
  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals();
    toast.success("Coupon removed");
  },

  /**
   * Selection Controls: Toggle single item
   */
  toggleSelectItem: (productId) => {
    const { selectedItemIds } = get();
    const isSelected = selectedItemIds.includes(productId);
    const updated = isSelected
      ? selectedItemIds.filter((id) => id !== productId)
      : [...selectedItemIds, productId];

    set({ selectedItemIds: updated });
    get().calculateTotals();
  },

  /**
   * Selection Controls: Select all items
   */
  selectAllItems: () => {
    const { cart } = get();
    set({ selectedItemIds: cart.map((item) => item._id) });
    get().calculateTotals();
  },

  /**
   * Selection Controls: Deselect all items
   */
  deselectAllItems: () => {
    set({ selectedItemIds: [] });
    get().calculateTotals();
  },

  /**
   * Remove only the currently selected items from cart
   */
  removeSelectedItems: async () => {
    const { selectedItemIds } = get();
    if (selectedItemIds.length === 0) {
      toast("No items selected to remove", { icon: "ℹ️" });
      return;
    }

    try {
      set({ isLoading: true });
      for (const id of selectedItemIds) {
        await apiClient.delete(`/cart/delete/${id}`);
      }
      const res = await apiClient.get("/cart");
      const newCart = Array.isArray(res.data) ? res.data : [];
      set({ cart: newCart, selectedItemIds: [] });
      get().calculateTotals();
      toast.success("Selected items removed from cart");
    } catch (err) {
      toast.error(err.message || "Failed to remove selected items");
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Helper to get array of selected items
   */
  getSelectedItems: () => {
    const { cart, selectedItemIds } = get();
    return cart.filter((item) => selectedItemIds.includes(item._id));
  },

  /**
   * Fetch all items in user's cart from backend
   */
  getCartItems: async () => {
    try {
      set({ isLoading: true });
      const res = await apiClient.get("/cart");
      const newCart = Array.isArray(res.data) ? res.data : [];
      const currentSelected = get().selectedItemIds;
      const validIds = newCart.map((i) => i._id);

      // Preserve previously selected items that are still in cart, or select all by default
      const updatedSelected =
        currentSelected.length === 0
          ? validIds
          : currentSelected.filter((id) => validIds.includes(id));

      set({ cart: newCart, selectedItemIds: updatedSelected });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [], selectedItemIds: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Clear local and server-side cart
   */
  clearCart: async () => {
    try {
      await apiClient.delete("/cart/delete");
      set({
        cart: [],
        selectedItemIds: [],
        coupon: null,
        total: 0,
        subtotal: 0,
        isCouponApplied: false,
      });
    } catch (error) {
      set({
        cart: [],
        selectedItemIds: [],
        coupon: null,
        total: 0,
        subtotal: 0,
        isCouponApplied: false,
      });
    }
  },

  /**
   * Add a product to the cart
   */
  addToCart: async (product) => {
    try {
      const response = await apiClient.post("/cart", { productId: product._id });
      const newCart = Array.isArray(response.data) ? response.data : [];
      const currentSelected = get().selectedItemIds;
      // Auto-select newly added item
      const updatedSelected = Array.from(new Set([...currentSelected, product._id]));

      set({ cart: newCart, selectedItemIds: updatedSelected });
      get().calculateTotals();
      toast.success("Product added to cart");
    } catch (error) {
      toast.error(error.message || "Failed to add product to cart");
    }
  },

  /**
   * Remove specific product from the cart
   */
  removeFromCart: async (productId) => {
    try {
      const response = await apiClient.delete(`/cart/delete/${productId}`);
      const newCart = Array.isArray(response.data) ? response.data : [];
      const updatedSelected = get().selectedItemIds.filter((id) => id !== productId);

      set({ cart: newCart, selectedItemIds: updatedSelected });
      get().calculateTotals();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(error.message || "Failed to remove item");
    }
  },

  /**
   * Update item quantity in the cart
   */
  updateQuantity: async (productId, quantity) => {
    if (quantity <= 0) {
      return get().removeFromCart(productId);
    }

    try {
      const response = await apiClient.put(`/cart/update/${productId}`, { quantity });
      set({ cart: Array.isArray(response.data) ? response.data : [] });
      get().calculateTotals();
    } catch (error) {
      toast.error(error.message || "Failed to update quantity");
    }
  },

  /**
   * Recalculate subtotal and total based on selected items
   */
  calculateTotals: () => {
    const { cart, selectedItemIds, coupon } = get();
    // Subtotal is calculated only for SELECTED items
    const selectedItems = cart.filter((item) => selectedItemIds.includes(item._id));

    const subtotal = selectedItems.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return sum + price * quantity;
    }, 0);

    const allItemsSubtotal = cart.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return sum + price * quantity;
    }, 0);

    let total = subtotal;

    if (coupon && coupon.discountPercentage && subtotal > 0) {
      const discount = subtotal * (Number(coupon.discountPercentage) / 100);
      total = Math.max(0, subtotal - discount);
    }

    set({
      subtotal: Math.round(subtotal),
      total: Math.round(total),
      allItemsSubtotal: Math.round(allItemsSubtotal),
    });
  },
}));

export default useCartStore;