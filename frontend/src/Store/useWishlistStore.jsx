import { create } from "zustand";
import { toast } from "react-hot-toast";

const STORAGE_KEY = "velura_wishlist";

// Helper to safely load wishlist from local storage
const loadInitialWishlist = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error("Failed to parse wishlist from localStorage:", err);
    return [];
  }
};

// Helper to save wishlist to local storage
const persistWishlist = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to persist wishlist to localStorage:", err);
  }
};

// ==========================================
// WISHLIST & FAVOURITES STORE (ZUSTAND)
// ==========================================
export const useWishlistStore = create((set, get) => ({
  wishlist: loadInitialWishlist(),
  isOpen: false, // Controls Wishlist Slide-over Drawer

  /**
   * Open / Close Wishlist Drawer
   */
  openWishlist: () => set({ isOpen: true }),
  closeWishlist: () => set({ isOpen: false }),
  toggleWishlistDrawer: () => set((state) => ({ isOpen: !state.isOpen })),

  /**
   * Check if a product is already in the wishlist
   */
  isInWishlist: (productId) => {
    const { wishlist } = get();
    return wishlist.some(
      (item) => String(item._id || item.id) === String(productId)
    );
  },

  /**
   * Add a product to the wishlist
   */
  addToWishlist: (product) => {
    if (!product || !product._id) return;
    const { wishlist } = get();
    const exists = wishlist.some(
      (item) => String(item._id || item.id) === String(product._id)
    );

    if (exists) {
      toast("Item is already in your favourites", { icon: "❤️" });
      return;
    }

    const updated = [product, ...wishlist];
    set({ wishlist: updated });
    persistWishlist(updated);
    toast.success(`"${product.title || "Item"}" added to favourites!`, {
      icon: "💖",
    });
  },

  /**
   * Remove a product from the wishlist
   */
  removeFromWishlist: (productId) => {
    const { wishlist } = get();
    const updated = wishlist.filter(
      (item) => String(item._id || item.id) !== String(productId)
    );
    set({ wishlist: updated });
    persistWishlist(updated);
    toast.success("Removed from favourites", { icon: "💔" });
  },

  /**
   * Toggle a product in/out of the wishlist
   */
  toggleWishlist: (product) => {
    if (!product || !product._id) return;
    const { isInWishlist, removeFromWishlist, addToWishlist } = get();
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  },

  /**
   * Clear all items from the wishlist
   */
  clearWishlist: () => {
    set({ wishlist: [] });
    persistWishlist([]);
    toast.success("Favourites cleared", { icon: "🗑️" });
  },
}));

export default useWishlistStore;
