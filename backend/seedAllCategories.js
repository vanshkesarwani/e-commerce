import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "./Models/productModel.js";
import { User } from "./Models/userModel.js";

dotenv.config({ path: "./.env" });

const CATEGORY_DATA = {
  Men: {
    items: [
      { name: "Tailored Italian Wool Blazer", price: 8999, img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop" },
      { name: "Slim-Fit Oxford Cotton Shirt", price: 2499, img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop" },
      { name: "Classic Double-Breasted Trench", price: 11499, img: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop" },
      { name: "Cashmere Crewneck Sweater", price: 5499, img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop" },
      { name: "Vintage Biker Leather Jacket", price: 14999, img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop" },
      { name: "Pleated Relaxed Linen Trousers", price: 3299, img: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=800&auto=format&fit=crop" },
      { name: "Merino Wool Roll-Neck Jumper", price: 4299, img: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop" },
      { name: "Heavyweight Cotton Overshirt", price: 3799, img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop" },
      { name: "Selvedge Indigo Denim Jeans", price: 4499, img: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop" },
      { name: "Classic Polo Pique Shirt", price: 1999, img: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop" },
      { name: "Structured Tuxedo Dinner Jacket", price: 15999, img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop" },
      { name: "Quilted Thermal Winter Parka", price: 12999, img: "https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=800&auto=format&fit=crop" },
      { name: "Waffle-Knit Raglan Pullover", price: 2999, img: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=800&auto=format&fit=crop" },
      { name: "Sartorial Houndstooth Waistcoat", price: 3499, img: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800&auto=format&fit=crop" },
      { name: "Relaxed Fit Corduroy Shirt", price: 2799, img: "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=800&auto=format&fit=crop" },
      { name: "Water-Resistant Bomber Jacket", price: 6499, img: "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop" },
      { name: "Brushed Cotton Casual Chinos", price: 2899, img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop" },
      { name: "Striped Resort Collar Shirt", price: 2199, img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop" },
      { name: "Cable-Knit Wool Cardigan", price: 4799, img: "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=800&auto=format&fit=crop" },
      { name: "Vintage Suede Trucker Jacket", price: 13499, img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=800&auto=format&fit=crop" },
      { name: "Minimalist Poplin Dress Shirt", price: 2399, img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop" },
      { name: "Thermal Zip-Up Track Jacket", price: 3199, img: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=800&auto=format&fit=crop" },
      { name: "French Terry Fleece Sweatshirt", price: 2599, img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop" },
      { name: "Herringbone Tweed Winter Coat", price: 14299, img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop" },
      { name: "Straight-Leg Raw Denim", price: 3999, img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop" },
      { name: "Lightweight Linen Safari Shirt", price: 2699, img: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?q=80&w=800&auto=format&fit=crop" },
      { name: "Signature Wool Overcoat", price: 16999, img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop" },
      { name: "Modal Blend Everyday Tee", price: 1299, img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop" },
      { name: "Drawstring Linen Lounge Pants", price: 2499, img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop" },
      { name: "Padded Technical Puffer Vest", price: 4999, img: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop" },
      { name: "Denim Sherpa Trucker Jacket", price: 7999, img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop" },
      { name: "Mercerized Cotton Henley", price: 1799, img: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop" }
    ]
  },
  Women: {
    items: [
      { name: "Silk Satin Slip Evening Dress", price: 7499, img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop" },
      { name: "Double-Breasted Wool Trench", price: 12999, img: "https://images.unsplash.com/photo-1539533018447-63fcce667823?q=80&w=800&auto=format&fit=crop" },
      { name: "Cashmere Oversized Cardigan", price: 6299, img: "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?q=80&w=800&auto=format&fit=crop" },
      { name: "Pleated High-Waist Midi Skirt", price: 3499, img: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop" },
      { name: "Structured Tailored Blazer", price: 8499, img: "https://images.unsplash.com/photo-1548624313-039e222d73f4?q=80&w=800&auto=format&fit=crop" },
      { name: "Chiffon Floral Summer Sundress", price: 3999, img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop" },
      { name: "Wide-Leg Tailored Trousers", price: 4199, img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop" },
      { name: "Ribbed Knit Turtleneck Sweater", price: 2999, img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop" },
      { name: "Vintage Wash Mom Jeans", price: 3299, img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop" },
      { name: "Pure Silk Button-Down Blouse", price: 4899, img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop" },
      { name: "Velvet Cocktail Wrap Dress", price: 6799, img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop" },
      { name: "Faux Shearling Aviator Coat", price: 11299, img: "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop" },
      { name: "Linen Tiered Maxi Dress", price: 4599, img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop" },
      { name: "Off-Shoulder Knit Crop Top", price: 1999, img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop" },
      { name: "Quilted Puffer Down Jacket", price: 8999, img: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop" },
      { name: "A-Line Denim Mini Skirt", price: 2399, img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop" },
      { name: "Tailored Linen Jumpsuit", price: 5499, img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop" },
      { name: "French Breton Striped Top", price: 1799, img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop" },
      { name: "Smocked Floral Peplum Blouse", price: 2599, img: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=800&auto=format&fit=crop" },
      { name: "Classic Camel Wool Overcoat", price: 15499, img: "https://images.unsplash.com/photo-1539533018447-63fcce667823?q=80&w=800&auto=format&fit=crop" },
      { name: "Flared High-Rise Corduroy Pants", price: 3499, img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop" },
      { name: "Boho Embroidered Kaftan", price: 4299, img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop" },
      { name: "Metallic Pleated Party Dress", price: 7999, img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop" },
      { name: "Cropped Tweed Parisian Jacket", price: 6999, img: "https://images.unsplash.com/photo-1548624313-039e222d73f4?q=80&w=800&auto=format&fit=crop" },
      { name: "Fine Knit Sleeveless Cardigan", price: 2499, img: "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?q=80&w=800&auto=format&fit=crop" },
      { name: "Paperbag Waist Linen Shorts", price: 1899, img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop" },
      { name: "Lace Trim Cami Nightdress", price: 2799, img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop" },
      { name: "Draped Asymmetrical Bodysuit", price: 2199, img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop" },
      { name: "Satin Pleated Wide-Leg Jumpsuit", price: 6499, img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop" },
      { name: "Cashmere Blend Wrap Shawl", price: 3899, img: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=800&auto=format&fit=crop" },
      { name: "Button-Front Denim Pinafore", price: 2999, img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop" },
      { name: "Organza Tiered Ballgown", price: 18999, img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop" }
    ]
  },
  Kids: {
    items: [
      { name: "Organic Cotton Cloud Baby Romper", price: 1299, img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop" },
      { name: "Mini Cable-Knit Crew Sweater", price: 1899, img: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=800&auto=format&fit=crop" },
      { name: "Kids Quilted Hooded Puffer", price: 3499, img: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=800&auto=format&fit=crop" },
      { name: "Floral Embroidered Party Frock", price: 2499, img: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop" },
      { name: "Denim Overall Dungarees", price: 1999, img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop" },
      { name: "Waterproof Yellow Raincoat", price: 2299, img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop" },
      { name: "Dino-Print Fleece Hoodie Set", price: 2199, img: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=800&auto=format&fit=crop" },
      { name: "Soft Cotton Pajama 2-Pack", price: 1499, img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop" },
      { name: "Gentleman's Mini Blazer Suit", price: 4299, img: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=800&auto=format&fit=crop" },
      { name: "Tulle Princess Birthday Dress", price: 2999, img: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop" },
      { name: "Striped Cotton Sailor Polo", price: 1399, img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop" },
      { name: "Fleece-Lined Winter Joggers", price: 1599, img: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=800&auto=format&fit=crop" },
      { name: "Teddy Bear Sherpa Vest", price: 2199, img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop" },
      { name: "Linen Summer Shortall Set", price: 1799, img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop" },
      { name: "Girls Velvet Holiday Dress", price: 3199, img: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop" },
      { name: "Checked Flannel Kids Shirt", price: 1499, img: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=800&auto=format&fit=crop" },
      { name: "Ribbed Cotton Baby Bodysuits", price: 1199, img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop" },
      { name: "Kids Varsity Bomber Jacket", price: 2899, img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop" },
      { name: "Ruffled Linen Pinafore Skirt", price: 1899, img: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop" },
      { name: "Cargo Pull-On Explorer Pants", price: 1699, img: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=800&auto=format&fit=crop" },
      { name: "Animal Ears Hooded Bathrobe", price: 1999, img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop" },
      { name: "Striped UV50+ Swimsuit Set", price: 1799, img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop" },
      { name: "Knitted Baby Cardigan With Hood", price: 1999, img: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=800&auto=format&fit=crop" },
      { name: "Sequin Stars Holiday Tutu", price: 2399, img: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop" },
      { name: "Pure Cotton Graphic Crew Tee", price: 899, img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop" },
      { name: "Quilted Puffer Snowsuit", price: 4499, img: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=800&auto=format&fit=crop" },
      { name: "Pleated School Uniform Kilt", price: 1899, img: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop" },
      { name: "Boys Linen Mandarin Collar Shirt", price: 1599, img: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=800&auto=format&fit=crop" },
      { name: "Cozy Fleece Zip-Up Onesie", price: 1699, img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop" },
      { name: "Kids Denim Utility Jacket", price: 2699, img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop" },
      { name: "Pastel Polka Dot Sundress", price: 1999, img: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop" },
      { name: "Cotton Thermal Baselayer Set", price: 1499, img: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=800&auto=format&fit=crop" }
    ]
  },
  Footwear: {
    items: [
      { name: "Handcrafted Italian Leather Loafers", price: 8999, img: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop" },
      { name: "Classic White Minimalist Sneakers", price: 4499, img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop" },
      { name: "Suede Chelsea Ankle Boots", price: 7999, img: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=800&auto=format&fit=crop" },
      { name: "High-Performance Knit Trainers", price: 5999, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop" },
      { name: "Strappy Leather Stiletto Heels", price: 6499, img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop" },
      { name: "Oxford Goodyear-Welted Dress Shoes", price: 10999, img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop" },
      { name: "Chunky Lug-Sole Combat Boots", price: 7299, img: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop" },
      { name: "Woven Leather Espadrilles", price: 3499, img: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop" },
      { name: "Retro High-Top Court Sneakers", price: 5499, img: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop" },
      { name: "Pointed Toe Kitten Heel Mules", price: 4799, img: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop" },
      { name: "Waterproof Hiking Mountain Boots", price: 9499, img: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=800&auto=format&fit=crop" },
      { name: "Buckled Monk Strap Dress Shoes", price: 8499, img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop" },
      { name: "Everyday Slip-On Canvas Shoes", price: 2499, img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop" },
      { name: "Square-Toe Leather Block Heels", price: 5999, img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop" },
      { name: "Suede Driving Moccasins", price: 4999, img: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop" },
      { name: "Trail Running Foam Shoes", price: 6299, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop" },
      { name: "Platform Sandal With Ankle Strap", price: 3899, img: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop" },
      { name: "Knee-High Suede Riding Boots", price: 11999, img: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop" },
      { name: "Skateboarding Suede Low-Tops", price: 3799, img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop" },
      { name: "Crystal Embellished Bridal Pumps", price: 8499, img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop" },
      { name: "Desert Suede Chukka Boots", price: 6499, img: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=800&auto=format&fit=crop" },
      { name: "Ergonomic Orthotic Slide Sandals", price: 2199, img: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop" },
      { name: "Wingtip Brogue Leather Shoes", price: 9299, img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop" },
      { name: "Chunky Retro Dad Sneakers", price: 4999, img: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop" },
      { name: "Velvet Evening Slipper Loafers", price: 6999, img: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop" },
      { name: "Waterproof Chelsea Rain Boots", price: 3999, img: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop" },
      { name: "Braided Leather Slide Mules", price: 3299, img: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop" },
      { name: "Aerobic Athletic Running Shoes", price: 4699, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop" },
      { name: "Polished Patent Leather Oxfords", price: 9899, img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop" },
      { name: "Shearling Lined Winter Booties", price: 8299, img: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop" },
      { name: "Breathable Mesh Slip-On Shoes", price: 2999, img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop" },
      { name: "Two-Tone Spectator Derby Shoes", price: 10499, img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop" }
    ]
  },
  Beauty: {
    items: [
      { name: "Damask Rosewater Hydrating Elixir", price: 1899, img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=800&auto=format&fit=crop" },
      { name: "Velvet Matte Parisian Red Lipstick", price: 1499, img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop" },
      { name: "Botanical Squalane Radiance Oil", price: 2699, img: "https://images.unsplash.com/photo-1608248597359-25f0a718d7bd?q=80&w=800&auto=format&fit=crop" },
      { name: "Santorini Oud Eau De Parfum (50ml)", price: 6499, img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop" },
      { name: "Vitamin C Glow Renewal Serum", price: 2299, img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop" },
      { name: "Peptide Firming Night Recovery Balm", price: 3499, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop" },
      { name: "French Green Clay Purifying Mask", price: 1799, img: "https://images.unsplash.com/photo-1567928815116-f6d9039e1ff1?q=80&w=800&auto=format&fit=crop" },
      { name: "Ultra-Light Invisible Mineral Sunscreen SPF50", price: 1999, img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop" },
      { name: "Rose Quartz Facial Contouring Roller", price: 1299, img: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?q=80&w=800&auto=format&fit=crop" },
      { name: "Hyaluronic Acid Moisture Drench Cream", price: 2499, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop" },
      { name: "Nourishing Argan Hair Repair Serum", price: 1899, img: "https://images.unsplash.com/photo-1608248597359-25f0a718d7bd?q=80&w=800&auto=format&fit=crop" },
      { name: "Amber & Vanilla Luxe Body Mist", price: 1599, img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop" },
      { name: "Gold Infused Anti-Aging Eye Serum", price: 3199, img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop" },
      { name: "Exfoliating AHA/BHA Resurfacing Glow Toner", price: 2199, img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=800&auto=format&fit=crop" },
      { name: "12-Shade Nude Couture Eyeshadow Palette", price: 3799, img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop" },
      { name: "Whipped Shea Butter Body Soufflé", price: 1699, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop" },
      { name: "Waterproof Precision Liquid Eyeliner", price: 999, img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop" },
      { name: "Gentle Enzyme Powder Cleanser", price: 1899, img: "https://images.unsplash.com/photo-1567928815116-f6d9039e1ff1?q=80&w=800&auto=format&fit=crop" },
      { name: "Ceramide Barrier Defense Lotion", price: 2399, img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop" },
      { name: "Overnight Collagen Plumping Lip Mask", price: 1199, img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop" },
      { name: "Pure Silk Sleeping Eye Mask", price: 1499, img: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?q=80&w=800&auto=format&fit=crop" },
      { name: "Bergamot & Cedarwood Cologne (100ml)", price: 5899, img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop" },
      { name: "Volumizing Lash Sculpt Mascara", price: 1299, img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop" },
      { name: "Coffee Bean Brightening Eye Cream", price: 2199, img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop" },
      { name: "Lavender Calming Pillow Mist", price: 1099, img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=800&auto=format&fit=crop" },
      { name: "Bioluminescent Dewy Face Primer", price: 1899, img: "https://images.unsplash.com/photo-1608248597359-25f0a718d7bd?q=80&w=800&auto=format&fit=crop" },
      { name: "Bamboo Charcoal Detangling Brush", price: 899, img: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?q=80&w=800&auto=format&fit=crop" },
      { name: "Organic Honey Scrub & Polish", price: 1499, img: "https://images.unsplash.com/photo-1567928815116-f6d9039e1ff1?q=80&w=800&auto=format&fit=crop" },
      { name: "Illuminating Bronzer & Highlighter Duo", price: 2599, img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop" },
      { name: "Retinol 0.5% Cell Renewal Emulsion", price: 2999, img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop" },
      { name: "Mineral Sea Salt Body Glow Wash", price: 1399, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop" },
      { name: "Rosemary Scalp Density Stimulating Oil", price: 1799, img: "https://images.unsplash.com/photo-1608248597359-25f0a718d7bd?q=80&w=800&auto=format&fit=crop" }
    ]
  },
  Accessories: {
    items: [
      { name: "Heritage Chronograph Watch in Sapphire", price: 14999, img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop" },
      { name: "Italian Saffiano Leather Tote Bag", price: 8999, img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop" },
      { name: "Polarized Titanium Aviator Sunglasses", price: 5499, img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop" },
      { name: "18K Gold Plated Chain Necklace", price: 4299, img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop" },
      { name: "Full-Grain Leather Bifold Wallet", price: 2499, img: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop" },
      { name: "Silk Twill Heritage Printed Scarf", price: 3299, img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=800&auto=format&fit=crop" },
      { name: "Reversible Calfskin Dress Belt", price: 2999, img: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800&auto=format&fit=crop" },
      { name: "Minimalist RFID Leather Cardholder", price: 1499, img: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop" },
      { name: "Tortoiseshell Round Frame Sunglasses", price: 4799, img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop" },
      { name: "Automatic Open/Close Windproof Umbrella", price: 1899, img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop" },
      { name: "Sterling Silver Hammered Cuff Bangle", price: 3799, img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop" },
      { name: "Structured Crossbody Saddle Bag", price: 7499, img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop" },
      { name: "Cashmere Ribbed Knit Beanie", price: 1999, img: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=800&auto=format&fit=crop" },
      { name: "Leather Travel Duffle & Weekender", price: 12499, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop" },
      { name: "Stainless Steel Link Mesh Watch", price: 8999, img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop" },
      { name: "Freshwater Pearl Drop Earrings", price: 2899, img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop" },
      { name: "Canvas & Leather Trim Backpack", price: 5999, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop" },
      { name: "Woven Fedora Straw Summer Hat", price: 2199, img: "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=800&auto=format&fit=crop" },
      { name: "Gold Vermeil Signet Ring", price: 3199, img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop" },
      { name: "Suede Driving Gloves With Cashmere", price: 3499, img: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=800&auto=format&fit=crop" },
      { name: "Vintage Brass Key Clip & Fob", price: 899, img: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop" },
      { name: "Oversized Square Acetate Shades", price: 4999, img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop" },
      { name: "Quilted Evening Clutch Bag", price: 4599, img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop" },
      { name: "Braided Italian Nappa Leather Belt", price: 2699, img: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800&auto=format&fit=crop" },
      { name: "Zodiac Pendant Gold Plated Choker", price: 2399, img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop" },
      { name: "Compact Nylon Sling Pack", price: 2799, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop" },
      { name: "Minimalist Ceramic Quartz Watch", price: 11299, img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop" },
      { name: "Silk Knit Solid Dark Navy Tie", price: 1999, img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=800&auto=format&fit=crop" },
      { name: "Monogrammed Passport Travel Cover", price: 1699, img: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop" },
      { name: "Pave Crystal Huggie Hoops", price: 2199, img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop" },
      { name: "Wool Tartan Fringed Winter Scarf", price: 2899, img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=800&auto=format&fit=crop" },
      { name: "Titanium Metal Money Clip", price: 1199, img: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop" }
    ]
  },
  Home: {
    items: [
      { name: "Handmade Ceramic Sculptural Vase", price: 3499, img: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop" },
      { name: "Pure French Flax Linen Duvet Set", price: 8999, img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop" },
      { name: "Cedar & Amberwood Soy Candle (300g)", price: 1699, img: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop" },
      { name: "Nordic Minimalist Cordless Table Lamp", price: 4799, img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop" },
      { name: "Carrara White Marble Coaster 4-Pack", price: 1899, img: "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=800&auto=format&fit=crop" },
      { name: "Heavyweight Waffle Knit Throw Blanket", price: 3299, img: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop" },
      { name: "Organic Turkish Cotton Bath Towel Set", price: 2999, img: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800&auto=format&fit=crop" },
      { name: "Double-Walled Glass Espresso Tumblers", price: 1499, img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop" },
      { name: "Handcrafted Teak End-Grain Cutting Board", price: 2899, img: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=800&auto=format&fit=crop" },
      { name: "Aromatherapy Ultrasonic Stone Diffuser", price: 3999, img: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop" },
      { name: "Japanese Cast Iron Teapot Set", price: 4499, img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop" },
      { name: "Stoneware Matte Dinnerware 16-Piece", price: 7999, img: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=800&auto=format&fit=crop" },
      { name: "Handwoven Jute Floor Area Rug", price: 6499, img: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=800&auto=format&fit=crop" },
      { name: "Modern Brushed Brass Wall Sconce", price: 3799, img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop" },
      { name: "Velvet Decorative Pillow Covers (Set of 2)", price: 1299, img: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop" },
      { name: "Precision Pour-Over Coffee Kettle", price: 2799, img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop" },
      { name: "Bohemian Rattan Laundry Hamper", price: 3199, img: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800&auto=format&fit=crop" },
      { name: "Champagne Coupe Crystal Glass 4-Pack", price: 3599, img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop" },
      { name: "Abstract Minimalist Framed Canvas Art", price: 4999, img: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop" },
      { name: "Pure Silk Oxford Pillowcase Pair", price: 3299, img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop" },
      { name: "Brushed Black Matte Flatware Cutlery Set", price: 3899, img: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=800&auto=format&fit=crop" },
      { name: "Faceted Glass Decanter With Stopper", price: 2499, img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop" },
      { name: "Terracotta Indoor Planter With Saucer", price: 1799, img: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=800&auto=format&fit=crop" },
      { name: "Natural Goose Down Medium Pillow", price: 2699, img: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop" },
      { name: "Stainless Steel Thermal Travel Mug", price: 1399, img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop" },
      { name: "Linen Table Runner & Napkin Set", price: 2199, img: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800&auto=format&fit=crop" },
      { name: "Smoked Glass Flower Urn", price: 2299, img: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop" },
      { name: "Magnetic Walnut Knife Storage Block", price: 3699, img: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=800&auto=format&fit=crop" },
      { name: "Botanical Garden Reed Oil Diffuser", price: 1899, img: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop" },
      { name: "Wool Knitted Pouf Ottoman", price: 4299, img: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=800&auto=format&fit=crop" },
      { name: "Ceramic Minimalist Salt & Pepper Grinders", price: 1699, img: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=800&auto=format&fit=crop" },
      { name: "Gold Rimmed Cocktail Shaker Set", price: 2999, img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop" }
    ]
  }
};

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/kosha_ecommerce";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for bulk seeding:", mongoUri);

    // Drop legacy indexes (slug_1, sku_1, etc.) that cause null duplicate key collisions
    try {
      const existingIndexes = await mongoose.connection.db.collection("products").indexes();
      for (const idx of existingIndexes) {
        if (idx.name !== "_id_") {
          try {
            await mongoose.connection.db.collection("products").dropIndex(idx.name);
            console.log(`Dropped legacy index: ${idx.name}`);
          } catch (e) {
            console.log(`Could not drop index ${idx.name}:`, e.message);
          }
        }
      }
    } catch (idxErr) {
      console.log("Error checking indexes:", idxErr.message);
    }

    // Find admin user to attribute product creation
    let admin = await User.findOne({ role: "admin" });
    if (!admin) {
      admin = await User.findOne({});
    }

    const adminId = admin ? admin._id : new mongoose.Types.ObjectId();
    const adminName = admin ? admin.name : "Velura Admin";

    let totalInserted = 0;

    for (const [categoryName, data] of Object.entries(CATEGORY_DATA)) {
      console.log(`\nProcessing category: ${categoryName}...`);
      
      const existingCount = await Product.countDocuments({ category: categoryName });
      console.log(`Existing products in ${categoryName}: ${existingCount}`);

      const productsToInsert = data.items.map((item, index) => {
        const rating = Number((4.1 + (index % 9) * 0.1).toFixed(1));
        const reviewsCount = 12 + (index * 7) % 85;
        const stock = 15 + (index * 4) % 65;
        const uniqueSlug = `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${categoryName.toLowerCase()}-${index + 1}-${Date.now()}`;

        return {
          title: item.name,
          slug: uniqueSlug,
          category: categoryName,
          price: item.price,
          stock,
          ratings: rating,
          numOfReviews: reviewsCount,
          description: `The ${item.name} reflects Velura's signature dedication to modern sophistication, enduring materials, and effortless luxury. Expertly crafted for the discerning lifestyle.`,
          adminName,
          adminPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
          createdBy: adminId,
          productImage: {
            public_id: `velura_${categoryName.toLowerCase()}_${index + 1}`,
            url: item.img,
          },
        };
      });

      const inserted = await Product.insertMany(productsToInsert);
      totalInserted += inserted.length;
      console.log(`Successfully added ${inserted.length} products to "${categoryName}".`);
    }

    console.log(`\n🎉 Seed completed! Added a total of ${totalInserted} products.`);
    const grandTotal = await Product.countDocuments();
    console.log(`Total products now in database: ${grandTotal}`);

    // Print breakdown
    for (const cat of Object.keys(CATEGORY_DATA)) {
      const count = await Product.countDocuments({ category: cat });
      console.log(`- ${cat}: ${count} products`);
    }

    await mongoose.disconnect();
    console.log("Disconnected cleanly.");
    process.exit(0);
  } catch (error) {
    console.error("Bulk seeding error:", error);
    process.exit(1);
  }
}

seed();
